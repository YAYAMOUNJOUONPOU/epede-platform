// src/components/domain/modules/FiveLevelArchitectureTab.tsx
import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Wrench, 
  BookOpen, 
  Share2, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldAlert, 
  Activity, 
  Gauge, 
  FileText,
  ChevronRight,
  Info
} from 'lucide-react';
import type { DomainCode, Equipment } from '../../../types/epede';
import { DOMAINS, EQUIPMENT_ITEMS } from '../../../data/epedeData';

interface FiveLevelArchitectureTabProps {
  domainCode: DomainCode;
  locale: 'fr' | 'en';
  onSelectEquipment: (id: string) => void;
  onSelectStandard: (ref: string) => void;
  onSelectRole: (slug: string) => void;
  onNavigateDomain?: (code: DomainCode) => void;
}

interface DomainFiveLevelData {
  level1_system: {
    titleFr: string;
    titleEn: string;
    summaryFr: string;
    summaryEn: string;
    physicsPrinciplesFr: string[];
    physicsPrinciplesEn: string[];
    operatingVoltages: string[];
    powerFlowTypeFr: string;
    powerFlowTypeEn: string;
  };
  level2_equipment: {
    primaryApparatusFr: string[];
    primaryApparatusEn: string[];
    equipmentIds: string[];
    keyRatingsFr: string[];
    keyRatingsEn: string[];
  };
  level3_engineering: {
    designCalculationsFr: string[];
    designCalculationsEn: string[];
    protectionSchemesFr: string[];
    protectionSchemesEn: string[];
    maintenancePracticesFr: string[];
    maintenancePracticesEn: string[];
  };
  level4_standards: {
    standardsList: { ref: string; titleFr: string; titleEn: string }[];
    regulatoryBodiesFr: string[];
    regulatoryBodiesEn: string[];
  };
  level5_relatedDomains: Record<string, {
    domainCode: DomainCode;
    relationshipTypeFr: string;
    relationshipTypeEn: string;
    descriptionFr: string;
    descriptionEn: string;
  }>;
}

const FIVE_LEVEL_REGISTRY: Partial<Record<DomainCode, DomainFiveLevelData>> = {
  D01: {
    level1_system: {
      titleFr: 'Conversion de l\'Énergie Primaire en Énergie Électrique',
      titleEn: 'Primary Energy Conversion to Bulk Electric Power',
      summaryFr: 'Ce système convertit l\'énergie potentielle hydraulique, thermique ou cinétique en énergie électromécanique triphasée synchrone régulée en tension (U) et en fréquence (f = 50 Hz).',
      summaryEn: 'Converts hydraulic, thermal, or kinetic potential energy into synchronous 3-phase electric power regulated in voltage (U) and frequency (f = 50 Hz).',
      physicsPrinciplesFr: [
        'Loi de Faraday-Lenz (induction électromagnétique e = -dΦ/dt)',
        'Équation d\'Euler pour les turbomachines hydrauliques (P = ρ·g·Q·H·η)',
        'Équation de balancement du rotor (J·dω/dt = C_m - C_e)'
      ],
      physicsPrinciplesEn: [
        'Faraday-Lenz Law of Induction (e = -dΦ/dt)',
        'Euler Turbomachinery Equation (P = ρ·g·Q·H·η)',
        'Rotor Swing Equation of Motion (J·dω/dt = T_m - T_e)'
      ],
      operatingVoltages: ['6.6 kV', '10.5 kV', '15.0 kV (Nachtigal)', '20.0 kV'],
      powerFlowTypeFr: 'Injection active unidirectionnelle P (MW) avec régulation de puissance réactive Q (Mvar)',
      powerFlowTypeEn: 'Unidirectional active power P (MW) injection with reactive power Q (Mvar) voltage support'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Turbines Francis / Pelton / Kaplan',
        'Alternateurs Synchrones à Pôles Saillants',
        'Système d\'Excitation Statique Brushless / Thyristors',
        'Disjoncteur de Groupe (Generator Circuit Breaker - GCB)',
        'Transformateur Élévateur de Groupe (GSU)'
      ],
      primaryApparatusEn: [
        'Francis / Pelton / Kaplan Turbines',
        'Salient-Pole Synchronous Alternators',
        'Static / Brushless Thyristor Excitation System',
        'Generator Circuit Breaker (GCB - IEC 62271-37-013)',
        'Generator Step-Up Transformer (GSU)'
      ],
      equipmentIds: ['eq-hydro-gen-01', 'eq-transfo-puiss-01', 'eq-disjoncteur-sf6-01'],
      keyRatingsFr: [
        'Puissance apparente nominale Sn = 70 MVA par groupe (Nachtigal 7x60 MW)',
        'Tension statorique Un = 15.0 kV ± 5%',
        'Facteur de puissance cos φ = 0.85 inductif / 0.95 capacitif',
        'Vitesse de rotation nominale N = 187.5 tr/min'
      ],
      keyRatingsEn: [
        'Rated apparent power Sn = 70 MVA per unit (Nachtigal 7x60 MW)',
        'Stator nominal voltage Un = 15.0 kV ± 5%',
        'Rated power factor cos phi = 0.85 lagging / 0.95 leading',
        'Nominal rotational speed N = 187.5 rpm'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Dimensionnement électromagnétique de l\'entrefer et calcul de la réactance synchrone Xd, Xq',
        'Courbe de capabilité générateur (limites d\'échauffement rotor/stator et stabilité d\'angle)',
        'Calcul des courts-circuits subtransitoires I"k3 (CEI 60909) pour tenue du GCB'
      ],
      designCalculationsEn: [
        'Electromagnetic air-gap sizing & synchronous reactance Xd, Xq calculation',
        'Generator P-Q capability diagram (rotor/stator thermal limits & angle stability margin)',
        'Subtransient short-circuit current I"k3 (IEC 60909) for GCB duty rating'
      ],
      protectionSchemesFr: [
        'ANSI 87G : Protection différentielle statorique 100% numérique',
        'ANSI 64R/64S : Détection défaut masse rotorique et masse statorique 100% 3ème harmonique',
        'ANSI 40 : Perte d\'excitation (relais d\'impédance circulaire)',
        'ANSI 46 : Déséquilibre de courant inverse (I2²·t)'
      ],
      protectionSchemesEn: [
        'ANSI 87G: Digital generator stator percentage differential protection',
        'ANSI 64R/64S: Rotor ground fault & 100% stator ground (3rd harmonic injection)',
        'ANSI 40: Loss of excitation (mho impedance circle)',
        'ANSI 46: Negative-phase-sequence current unbalance (I2²·t)'
      ],
      maintenancePracticesFr: [
        'Analyse des décharges partielles en ligne (PD monitoring)',
        'Mesure de résistance d\'isolement (Megger) et indice de polarisation (IP)',
        'Inspection endoscopique du circuit magnétique et contrôle des cales d\'encoches'
      ],
      maintenancePracticesEn: [
        'Online partial discharge (PD) stator monitoring',
        'Insulation resistance testing (Megger) and Polarization Index (PI)',
        'Borescope core inspection and slot wedge tightness verification'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'CEI 60034-1', titleFr: 'Machines électriques tournantes - Caractéristiques assignées et performances', titleEn: 'Rotating electrical machines - Rating and performance' },
        { ref: 'CEI 62271-37-013', titleFr: 'Disjoncteurs pour générateurs', titleEn: 'Alternating-current generator circuit-breakers' },
        { ref: 'IEEE C37.102', titleFr: 'Guide pour la protection des alternateurs', titleEn: 'Guide for AC Generator Protection' },
        { ref: 'CEI 60076', titleFr: 'Transformateurs de puissance', titleEn: 'Power transformers' }
      ],
      regulatoryBodiesFr: [
        'ARSEL (Agence de Régulation du Secteur de l\'Électricité - Cameroun)',
        'MINEE (Ministère de l\'Eau et de l\'Énergie)',
        'CIGRE Comité d\'Études A1 (Machines Électriques Tournantes)'
      ],
      regulatoryBodiesEn: [
        'ARSEL (Electricity Sector Regulatory Agency - Cameroon)',
        'MINEE (Ministry of Water Resources and Energy)',
        'CIGRE Study Committee A1 (Rotating Electrical Machines)'
      ]
    },
    level5_relatedDomains: {
      D02: {
        domainCode: 'D02',
        relationshipTypeFr: 'Stabilité & Dispatching',
        relationshipTypeEn: 'Stability & Dispatching',
        descriptionFr: 'Fournit la réserve primaire et secondaire de fréquence (f-P) pour l\'architecture globale du réseau.',
        descriptionEn: 'Provides primary and secondary frequency containment reserves (f-P) for overall grid stability.'
      },
      D03: {
        domainCode: 'D03',
        relationshipTypeFr: 'Évacuation Haute Tension',
        relationshipTypeEn: 'HV Power Evacuation',
        descriptionFr: 'Injecte la puissance produite dans les corridors 225 kV vers les centres de consommation.',
        descriptionEn: 'Injects generated bulk power into 225 kV corridors toward regional load centers.'
      },
      D04: {
        domainCode: 'D04',
        relationshipTypeFr: 'Poste d\'Évacuation de Centrale',
        relationshipTypeEn: 'Plant Substation Switchyard',
        descriptionFr: 'Interconnecté au poste de transformation élévateur 15/225 kV.',
        descriptionEn: 'Interfaced directly with the 15/225 kV step-up substation switchyard.'
      },
      D11: {
        domainCode: 'D11',
        relationshipTypeFr: 'Philosophie de Protection',
        relationshipTypeEn: 'Protection Philosophy',
        descriptionFr: 'Coordination sélective entre protection alternateur (87G) et protection transformateur (87T).',
        descriptionEn: 'Unit differential coordination between generator (87G) and transformer (87T) zones.'
      },
      D12: {
        domainCode: 'D12',
        relationshipTypeFr: 'SCADA & Téléconduite',
        relationshipTypeEn: 'SCADA & Control',
        descriptionFr: 'Automates de tranche, contrôle-commande DCS de centrale et consignes AGC du dispatcher.',
        descriptionEn: 'Unit controller, plant DCS, and AGC dispatch setpoints from the National Control Center.'
      }
    }
  },
  D02: {
    level1_system: {
      titleFr: 'Architecture de Réseau, Équilibrage Offre-Demande & Téléconduite (EMS/CNC)',
      titleEn: 'Power Grid Architecture, System Balancing & National Dispatching (EMS/CNC)',
      summaryFr: 'Ce système régit la topologie globale du réseau interconnecté, la planification prévisionnelle des flux, l\'équilibrage temps réel entre la production et la demande (réglage primaire f/P, secondaire AGC et tertiaire), ainsi que la stabilité dynamique globale du réseau national sous la conduite du Centre National de Conduite (CNC Mangombé / Yaoundé).',
      summaryEn: 'Governs overall power grid topological architecture, day-ahead power flow scheduling, real-time generation-demand balancing (primary, secondary AGC, tertiary frequency/power reserves), and national dynamic grid stability under the National Control Center (CNC).',
      physicsPrinciplesFr: [
        'Équation différentielle de balancement dynamique de fréquence du réseau : 2H · (df/dt) = P_m - P_e - D · Δf',
        'Équations de transit de puissance non-linéaires (Power Flow Newton-Raphson et formulation nodale [I] = [Y_bus] · [V])',
        'Critère d\'égale aire (Equal Area Criterion) pour la stabilité transitoire angulaire rotorique sous contingence N-1',
        'Découplage P-f (puissance active / fréquence) et Q-V (puissance réactive / tension) sur les réseaux de transport à forte réactance (X/R >> 1)',
        'Limites de stabilité de tension (courbes P-V / Q-V et marge avant point de bifurcation en nez de courbe)'
      ],
      physicsPrinciplesEn: [
        'Dynamic power system frequency swing equation: 2H · (df/dt) = P_m - P_e - D · Δf',
        'Nonlinear AC power flow equations (Newton-Raphson nodal formulation [I] = [Y_bus] · [V])',
        'Equal Area Criterion for rotor angle transient stability assessment under severe N-1 grid contingencies',
        'P-f (active power/frequency) and Q-V (reactive power/voltage) decoupling on high-inductance transmission lines (X/R >> 1)',
        'Voltage stability margins and saddle-node bifurcation limit (nose curves P-V and Q-V)'
      ],
      operatingVoltages: ['400 kV / 225 kV (Réseau THT Interconnecté)', '90 kV / 110 kV (Sous-transport)', '15 – 30 kV (Moyenne Tension)', 'Fréquence de consigne 50.00 Hz (tolérance ± 0.20 Hz)'],
      powerFlowTypeFr: 'Transit maillé multiphase interconnecté bidirectionnel régulé en permanence par le dispatching national (SONATREL CNC) avec dispatching économique et sécurité N-1.',
      powerFlowTypeEn: 'Meshed multiphase interconnected bidirectional bulk power flow continuously regulated by national dispatching (SONATREL CNC) with security-constrained economic dispatch.'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Serveurs SCADA/EMS Redondants Temps Réel (Energy Management System)',
        'Consoles Pupitreurs et Mur d\'Images Synoptique du Dispatching National (CNC Yaoundé / Mangombé)',
        'Système de Réglage Automatique de Fréquence-Puissance (AGC / LFC - Automatic Generation Control)',
        'Unités de Mesure Phasorielle (PMU / WAMS synchronisées par satellite GPS)',
        'Automates de Délestage Fréquencemétrique et Voltmétrique d\'Urgence (UFLS / UVLS)',
        'Compensateurs Synchrones et Gradins de Condensateurs Haute Tension Commutés',
        'Passerelles de Communication Inter-Centres TASE.2 / ICCP (CEI 60870-6)'
      ],
      primaryApparatusEn: [
        'Dual-Redundant Real-Time SCADA/EMS Servers (Energy Management System)',
        'Dispatcher Operational Consoles & Synoptic Video Wall (National Control Center Yaoundé / Mangombé)',
        'Automatic Generation Control (AGC / LFC) Central Frequency-Power Controller',
        'Phasor Measurement Units (PMU / WAMS GPS/PTP Sub-microsecond Synchronized)',
        'Emergency Under-Frequency & Under-Voltage Load Shedding Relays (UFLS / UVLS)',
        'Synchronous Condensers & Grid-Scale Mechanically Switched Capacitor Banks',
        'Inter-Control Center Communications Protocol Gateways (TASE.2 / ICCP per IEC 60870-6)'
      ],
      equipmentIds: ['eq-scada-ems-01', 'eq-relais-num-01', 'eq-dcu-poste-01'],
      keyRatingsFr: [
        'Bande de tolérance normale de la fréquence : 49.80 Hz – 50.20 Hz (plage d\'alerte 49.50 – 50.50 Hz, déclenchement délestage < 48.80 Hz)',
        'Réserve primaire de fréquence : 2.5% à 5.0% de la puissance nominale des groupes mobilisable en moins de 15 à 30 secondes',
        'Réserve secondaire de réglage (AGC) : temps de déploiement 2 à 15 minutes pour ramener la fréquence à 50.00 Hz',
        'Taux de disponibilité de l\'infrastructure SCADA/EMS : 99.999% (temps d\'indisponibilité annuel maximal < 5.26 minutes)',
        'Précision d\'horodatage synchrophasor PMU : incertitude temporelle inférieure à 1 microseconde (classe TVE < 1% selon IEEE C37.118)'
      ],
      keyRatingsEn: [
        'Normal Operating Frequency Band: 49.80 Hz – 50.20 Hz (alert band 49.50 – 50.50 Hz, emergency UFLS trigger < 48.80 Hz)',
        'Primary Frequency Response: 2.5% to 5.0% of unit rated capacity deployed within 15 to 30 seconds',
        'Secondary Operating Reserve (AGC): deployment within 2 to 15 minutes restoring steady-state frequency to 50.00 Hz',
        'SCADA/EMS High Availability Rating: 99.999% uptime (< 5.26 minutes annual allowable downtime)',
        'Synchrophasor PMU Timestamp Accuracy: absolute time error < 1 microsecond (TVE < 1% per IEEE C37.118)'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Calcul de répartition des puissances en régime permanent (Load Flow Newton-Raphson, matrices jacobiennes et flux sur les branches)',
        'Analyse systématique de contingence N-1 et N-2 pour identifier les surcharges thermiques et les risques de cascade d\'ouvertures',
        'Calcul des réserves tournantes requises et du dimensionnement des échelons de délestage par sous-fréquence UFLS (49.2 Hz à 48.2 Hz)',
        'Optimisation économique du placement de production (Unit Commitment & Security-Constrained Optimal Power Flow SCOPF)',
        'Modélisation de la stabilité dynamique petit signal (analyse des modes oscillatoires inter-zones 0.1 – 2.0 Hz et calage des PSS)'
      ],
      designCalculationsEn: [
        'Steady-state power flow solving (Newton-Raphson Jacobian matrix, branch thermal loading and bus voltage profiles)',
        'Systematic N-1 and N-2 contingency screening to detect line overloads and cascading trip vulnerabilities',
        'Spinning reserve dimensioning and under-frequency load shedding (UFLS) staged step calculations (49.2 Hz down to 48.2 Hz)',
        'Generation dispatch optimization (Unit Commitment & Security-Constrained Optimal Power Flow SCOPF)',
        'Small-signal dynamic stability modeling (inter-area oscillation damping 0.1 – 2.0 Hz and Power System Stabilizer tuning)'
      ],
      protectionSchemesFr: [
        'Automate de délestage d\'urgence par sous-fréquence UFLS à 4 ou 5 échelons avec confirmation par dérivée df/dt (ANSI 81L / 81R)',
        'Protection contre l\'écroulement de tension par délestage voltmétrique sélectif UVLS (ANSI 27)',
        'Plan de défense national contre les ruptures de synchronisme et séparation de réseau en îlots stables (Out-of-Step Tripping ANSI 78)',
        'Procédure automatique et manuelle de reconstitution de réseau après écroulement total (Black Start depuis Songloulou / Édéa)',
        'Système de protection d\'intégrité de zone WAPS (Wide Area Protection System) coordonnant les actions de délestage et de télé-déclenchement'
      ],
      protectionSchemesEn: [
        'Emergency Under-Frequency Load Shedding (UFLS) 4-5 stage automated scheme with RoCoF df/dt confirmation (ANSI 81L / 81R)',
        'Under-Voltage Load Shedding (UVLS / ANSI 27) preventing wide-area voltage collapse',
        'Out-of-Step Tripping (OST / ANSI 78) and controlled islanding preserving generation balance under loss of synchronism',
        'Black Start and sequential network restoration sequence initiated from Songloulou and Édéa hydro power stations',
        'Wide-Area Protection System (WAPS) coordinating automated inter-tripping, transfer-trip, and remedial action schemes (RAS)'
      ],
      maintenancePracticesFr: [
        'Exercices annuels de basculement de l\'exploitation vers le site de secours du dispatching (Disaster Recovery Site)',
        'Recalibration et validation périodique du modèle réseau CIM (CEI 61970) par comparaison avec les mesures PMU réelles',
        'Vérification des passerelles ICCP / TASE.2 reliant le CNC aux dispatchings des producteurs et des réseaux voisins (WAPP/CAPP)',
        'Simulations d\'ingénierie régulières de reprise de service post-blackout sur simulateur d\'entraînement des opérateurs (DTS)',
        'Audit de cybersécurité continue des accès et pare-feu du réseau opérationnel SCADA selon la norme CEI 62351'
      ],
      maintenancePracticesEn: [
        'Annual operational failover drills to the secondary National Control Disaster Recovery Site',
        'Periodic CIM network model validation (IEC 61970) tuned against synchronized real-world PMU telemetry data',
        'Auditing and health monitoring of ICCP / TASE.2 inter-utility communication links with regional power pools (WAPP/CAPP)',
        'Black Start and restorative drill simulations conducted on the high-fidelity Operator Training Simulator (DTS)',
        'Continuous operational technology cybersecurity audits of SCADA network boundaries per IEC 62351 specifications'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'CEI 61970 (Série CIM)', titleFr: 'Interface de programmation d\'application pour système de gestion d\'énergie (EMS-API) - Modèle d\'information commun (CIM)', titleEn: 'Energy Management System Application Program Interface (EMS-API) - Common Information Model (CIM)' },
        { ref: 'CEI 60870-6 (TASE.2 / ICCP)', titleFr: 'Matériels et systèmes de téléconduite - Protocoles de téléconduite compatibles avec les normes ISO (ICCP)', titleEn: 'Telecontrol equipment and systems - Telecontrol protocols compatible with ISO standards (ICCP / TASE.2)' },
        { ref: 'IEEE C37.118', titleFr: 'Norme IEEE pour la mesure des synchrophasors dans les réseaux électriques (PMU)', titleEn: 'IEEE Standard for Synchrophasor Measurements for Power Systems' },
        { ref: 'CEI 62351 (Parties 1 à 14)', titleFr: 'Gestion des systèmes de puissance et échanges d\'informations associés - Sécurité des données et des communications', titleEn: 'Power systems management and associated information exchange - Data and communications cybersecurity' },
        { ref: 'Code de Réseau SONATREL', titleFr: 'Règles techniques de raccordement et d\'exploitation du Réseau Interconnecté National du Cameroun', titleEn: 'National Transmission Grid Technical Access, Operation and Reliability Code (SONATREL / ARSEL)' }
      ],
      regulatoryBodiesFr: [
        'SONATREL (Société Nationale de Transport de l\'Électricité - Exploitant du réseau de transport et du dispatching CNC)',
        'ARSEL Cameroun (Agence de Régulation du Secteur de l\'Électricité - Régulateur national des tarifs et codes)',
        'CAPP / PEAC (Pool Énergétique d\'Afrique Centrale - Coordination des échanges énergétiques transfrontaliers)',
        'CIGRE Comité C2 (Exploitation et conduite des réseaux électriques mondiaux)'
      ],
      regulatoryBodiesEn: [
        'SONATREL (Cameroon National Electricity Transmission Corporation - Transmission System Operator & Dispatcher)',
        'ARSEL Cameroon (Electricity Sector Regulatory Agency - Tariff and Grid Code Enforcement)',
        'CAPP / PEAC (Central African Power Pool - Regional interconnection and cross-border power trading)',
        'CIGRE Study Committee C2 (Power system operation and control)'
      ]
    },
    level5_relatedDomains: {
      D01: {
        domainCode: 'D01',
        relationshipTypeFr: 'Production d\'Énergie & Régulation f/P',
        relationshipTypeEn: 'Generation & AGC Control',
        descriptionFr: 'Le CNC envoie en continu les télé-consignes de puissance active aux centrales hydroélectriques de Songloulou et Nachtigal.',
        descriptionEn: 'The National Control Center streams real-time active power setpoints and AGC pulses to Songloulou and Nachtigal hydro plants.'
      },
      D03: {
        domainCode: 'D03',
        relationshipTypeFr: 'Lignes de Transport THT 225 kV',
        relationshipTypeEn: 'EHV Transmission Grid',
        descriptionFr: 'Surveillance en temps réel des flux de puissance, des charges thermiques des lignes et de la sécurité N-1 des couloirs de transport.',
        descriptionEn: 'Continuous surveillance of branch power flows, line dynamic thermal ratings, and N-1 corridor security.'
      },
      D04: {
        domainCode: 'D04',
        relationshipTypeFr: 'Postes de Transformation THT/HT',
        relationshipTypeEn: 'Substations & Switching Stations',
        descriptionFr: 'Téléconduite à distance des disjoncteurs de poste, surveillance des tensions de jeu de barres et manœuvre des prises de transformateurs.',
        descriptionEn: 'Remote SCADA operation of substation breakers, bus voltage monitoring, and on-load tap changer (OLTC) control.'
      },
      D10: {
        domainCode: 'D10',
        relationshipTypeFr: 'Supervision SCADA & EMS',
        relationshipTypeEn: 'SCADA & EMS Supervision',
        descriptionFr: 'Infrastructure matérielle et logicielle hébergeant la base de données temps réel, les alarmes et l\'estimateur d\'état.',
        descriptionEn: 'Host computational infrastructure powering the real-time database, alarm management, and state estimation engines.'
      },
      D11: {
        domainCode: 'D11',
        relationshipTypeFr: 'Plans de Protection & Études Dynamiques',
        relationshipTypeEn: 'Protection Plans & Dynamic Studies',
        descriptionFr: 'Coordination des plans de délestage UFLS/UVLS avec le plan de protection sélectif des lignes et des jeux de barres.',
        descriptionEn: 'Coordination between system-wide UFLS/UVLS schemes and local line/busbar selective protection philosophies.'
      }
    }
  },
  D03: {
    level1_system: {
      titleFr: 'Transport d\'Énergie en Très Haute Tension (THT 225 kV / 400 kV)',
      titleEn: 'Bulk Power Transmission via Extra-High Voltage (225 kV / 400 kV)',
      summaryFr: 'Ce système achemine des flux massifs de puissance électrique sur des centaines de kilomètres en minimisant les pertes par effet Joule grâce à l\'élévation de tension (P_pertes = R · I² = R · (P / (√3 · U · cos φ))²).',
      summaryEn: 'Transmits bulk power over hundreds of kilometers while minimizing Joule losses through high voltage elevation (P_loss = R · I² = R · (P / (√3 · U · cos φ))²).',
      physicsPrinciplesFr: [
        'Loi de Joule et transport à tension élevée (Pertes inversement proportionnelles au carré de la tension U²)',
        'Équations des télégraphistes pour lignes longues distribuées (Z_c = √(L/C), constante de propagation γ = α + jβ)',
        'Effet Ferranti : montée en tension à vide en bout de ligne capacitive (U_2 ≈ U_1 / cos(β·l))'
      ],
      physicsPrinciplesEn: [
        'Joule heating law (Losses decrease inversely with square of voltage U²)',
        'Telegrapher equations for distributed lines (Surge impedance Zc = √(L/C), propagation constant γ = α + jβ)',
        'Ferranti effect: no-load capacitive voltage rise at line receiving end (U_2 ≈ U_1 / cos(β·l))'
      ],
      operatingVoltages: ['400 kV THT', '225 kV THT (Dorsale RIS Cameroun)', '110 kV / 90 kV HT'],
      powerFlowTypeFr: 'Transit bidirectionnel multiphase interconnecté maillé',
      powerFlowTypeEn: 'Meshed bidirectional multiphase interconnected bulk power flow'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Pylônes métalliques en treillis (alignement, angle, ancrage)',
        'Conducteurs en faisceaux (ACSR / AAAC / Almélec)',
        'Chaînes d\'isolateurs en verre trempé ou composite polymère',
        'Câbles de garde avec fibre optique intégrée (OPGW)',
        'Anneaux pare-effluves (anti-corona) et amortisseurs de vibrations Stockbridge'
      ],
      primaryApparatusEn: [
        'Galvanized steel lattice towers (suspension, angle, tension dead-end)',
        'Bundled phase conductors (ACSR / AAAC / Aster)',
        'Toughened glass or composite polymer insulator strings',
        'Optical Ground Wire (OPGW) shield wire',
        'Corona rings and Stockbridge aeolian vibration dampers'
      ],
      equipmentIds: ['eq-ligne-225kv-01', 'eq-isolateur-composite-01'],
      keyRatingsFr: [
        'Capacité de transit thermique nominale : 350 MVA par terne 225 kV',
        'Portée moyenne entre pylônes : 350 à 450 mètres',
        'Tension de tenue aux chocs de foudre (BIL) : 1050 kVcrête',
        'Résistance linéique R : ~0.08 Ω/km ; Réactance linéique X : ~0.4 Ω/km'
      ],
      keyRatingsEn: [
        'Thermal transit capacity rating: 350 MVA per 225 kV circuit',
        'Average tower ruling span: 350 to 450 meters',
        'Basic Lightning Impulse Insulation Level (BIL): 1050 kVpeak',
        'Series resistance R: ~0.08 Ω/km; Series reactance X: ~0.4 Ω/km'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Calcul mécanique de traction et de flèche des câbles (équation de la chaînette et hypothèses de vent/température)',
        'Puissance naturelle de la ligne (SIL = U² / Z_c ≈ 130 MW à 225 kV)',
        'Limites de stabilité transitoire d\'angle (critère des aires égales)'
      ],
      designCalculationsEn: [
        'Catenary mechanical tension & sag calculation (ruling span, wind pressure & max temperature)',
        'Surge Impedance Loading (SIL = U² / Z_c ≈ 130 MW at 225 kV)',
        'Transient rotor angle stability limits (equal area criterion)'
      ],
      protectionSchemesFr: [
        'ANSI 21 : Protection de distance numérique multi-zones (Zone 1 instantanée 80%, Zone 2 120%, Zone 3 inverse)',
        'ANSI 87L : Protection différentielle de ligne sur fibre optique OPGW avec comparaison vectorielle',
        'ANSI 79 : Réenclencheur automatique mono/tripolaire rapide pour élimination des défauts fugitifs'
      ],
      protectionSchemesEn: [
        'ANSI 21: Digital distance protection (Zone 1 instantaneous 80%, Zone 2 120%, Zone 3 reverse)',
        'ANSI 87L: Current differential line protection over dedicated OPGW optical channel',
        'ANSI 79: Fast single/three-pole auto-reclosing for clearing transient atmospheric arc faults'
      ],
      maintenancePracticesFr: [
        'Inspection thermographique par drone ou hélicoptère (points chauds sur manchons)',
        'Élagage régulier des couloirs de servitude (dégagement de gabarit CEI 61936)',
        'Mesure de résistance de prise de terre des pieds de pylônes'
      ],
      maintenancePracticesEn: [
        'Helicopter / drone infrared thermography (splice & clamp hot-spot detection)',
        'Right-of-way vegetation management and statutory electrical clearance audits',
        'Tower footing ground resistance measurement'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'CEI 60826', titleFr: 'Critères de conception des lignes aériennes de transport', titleEn: 'Design criteria of overhead transmission lines' },
        { ref: 'CEI 61089', titleFr: 'Conducteurs pour lignes aériennes à brins circulaires', titleEn: 'Round wire concentric lay overhead electrical stranded conductors' },
        { ref: 'CEI 60071', titleFr: 'Coordination de l\'isolement', titleEn: 'Insulation co-ordination' },
        { ref: 'IEEE 738', titleFr: 'Calcul de la capacité thermique des conducteurs nus', titleEn: 'Calculating the Current-Temperature Relationship of Bare Overhead Conductors' }
      ],
      regulatoryBodiesFr: [
        'SONATREL (Société Nationale de Transport de l\'Électricité - Gestionnaire du Réseau THT Cameroun)',
        'CIGRE Comité d\'Études B2 (Lignes Aériennes)'
      ],
      regulatoryBodiesEn: [
        'SONATREL (National Electricity Transmission Company - TSO Cameroon)',
        'CIGRE Study Committee B2 (Overhead Lines)'
      ]
    },
    level5_relatedDomains: {
      D01: {
        domainCode: 'D01',
        relationshipTypeFr: 'Source d\'Énergie',
        relationshipTypeEn: 'Power Infeed',
        descriptionFr: 'Reçoit l\'énergie des grands centres de production (Nachtigal, Song Loulou, Edéa).',
        descriptionEn: 'Receives bulk energy from major generating hubs (Nachtigal, Song Loulou, Edea).'
      },
      D04: {
        domainCode: 'D04',
        relationshipTypeFr: 'Nœuds de Connexion',
        relationshipTypeEn: 'Interconnection Nodes',
        descriptionFr: 'Se raccorde aux postes d\'interconnexion THT (Postes de Nyom 2, Bekoko, Mangombe, Oyomabang).',
        descriptionEn: 'Terminates at 225 kV substation switchyards (Nyom 2, Bekoko, Mangombe, Oyomabang).'
      },
      D11: {
        domainCode: 'D11',
        relationshipTypeFr: 'Protection Sélective',
        relationshipTypeEn: 'Protection Coordination',
        descriptionFr: 'Coordination des temps de déclenchement de distance (Zone 2/3) avec les jeux de barres aval.',
        descriptionEn: 'Coordination of distance zones (Zone 2/3) with downstream substation busbars.'
      },
      D13: {
        domainCode: 'D13',
        relationshipTypeFr: 'Télécommunications',
        relationshipTypeEn: 'Telecommunications',
        descriptionFr: 'Utilise le câble de garde OPGW pour transporter les flux SCADA, téléconduite et téléprotection.',
        descriptionEn: 'Relies on OPGW fiber for SCADA telemetry, teleprotection signals, and IP dispatcher telephony.'
      }
    }
  },
  D04: {
    level1_system: {
      titleFr: 'Transformation de Tension & Aiguillage des Flux Électriques',
      titleEn: 'Voltage Transformation & Power Routing Nodes',
      summaryFr: 'Le poste électrique est le carrefour névralgique du réseau : il transforme les niveaux de tension (ex. 225 kV vers 30 kV), interconnecte les circuits via des jeux de barres, et permet la coupure sécurisée en charge ou sur court-circuit.',
      summaryEn: 'Substations act as central grid hubs: transforming voltage levels (e.g. 225 kV to 30 kV), routing power across busbar arrangements, and interrupting load or severe fault currents safely.',
      physicsPrinciplesFr: [
        'Induction mutuelle ferromagnétique (Théorème de Boucherot U = 4.44·f·N·B·S)',
        'Extinction de l\'arc électrique dans le SF6 ou le vide (rigidité diélectrique et constante de déionisation)',
        'Propagation des ondes de choc de foudre et réflexion sur discontinuités d\'impédance'
      ],
      physicsPrinciplesEn: [
        'Mutual ferromagnetic induction (Boucherot law U = 4.44·f·N·B·S)',
        'Electric arc extinction in SF6 gas or vacuum (dielectric recovery rate)',
        'Atmospheric impulse surge propagation and wave reflections at impedance boundaries'
      ],
      operatingVoltages: ['225 kV HTB', '90 kV HTB', '30 kV HTA (Distribution Cameroun)', '15 kV HTA'],
      powerFlowTypeFr: 'Nœud de dérivation et abaissement de tension avec jeux de barres simples ou doubles',
      powerFlowTypeEn: 'Switching node and step-down substation with single, double, or breaker-and-a-half busbars'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Transformateurs de Puissance HTB/HTA (ex. 225/30 kV 63 MVA)',
        'Disjoncteurs HTB au gaz SF6 (coupure de court-circuit 31.5 kA)',
        'Sectionneurs d\'aiguillage et sectionneurs de terre avec verrouillage mécanique',
        'Transformateurs de mesure de courant (TC) et de tension (TT)',
        'Parafoudres à oxyde de zinc (ZnO) sans éclateur'
      ],
      primaryApparatusEn: [
        'HV/MV Power Transformers (e.g. 225/30 kV 63 MVA ONAN/ONAF)',
        'SF6 Gas Circuit Breakers (31.5 kA short-circuit interruption)',
        'Busbar disconnectors and earthing switches with mechanical interlocks',
        'Instrument current transformers (CT) and voltage transformers (VT)',
        'Gapless Zinc Oxide (ZnO) surge arresters'
      ],
      equipmentIds: ['eq-transfo-puiss-01', 'eq-disjoncteur-sf6-01', 'eq-sectionneur-225-01'],
      keyRatingsFr: [
        'Puissance assignée : 63 MVA ONAN / 80 MVA ONAF',
        'Tension de court-circuit Ucc% : 12.5% à 14%',
        'Pouvoir de coupure du disjoncteur : 31.5 kA efficace pendant 3 secondes',
        'Niveau d\'isolement assigné à fréquence industrielle : 460 kV / 1 min'
      ],
      keyRatingsEn: [
        'Rated capacity: 63 MVA ONAN / 80 MVA ONAF',
        'Short-circuit impedance Ucc%: 12.5% to 14%',
        'Breaker breaking capacity: 31.5 kA rms for 3 seconds',
        'Power frequency withstand voltage: 460 kV / 1 min'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Calcul des courants de court-circuit triphasés et monophasés Ik" selon la norme CEI 60909',
        'Dimensionnement des parafoudres ZnO et coordination de l\'isolement selon la CEI 60071',
        'Calcul de la grille de terre du poste (résistance globale R_terre < 1 Ω, potentiels de pas et de toucher CEI 61936)'
      ],
      designCalculationsEn: [
        'Three-phase and phase-to-ground short-circuit calculations according to IEC 60909',
        'ZnO surge arrester rating & insulation coordination per IEC 60071',
        'Substation earthing mesh design (ground resistance R < 1 Ω, step & touch potential compliance IEC 61936)'
      ],
      protectionSchemesFr: [
        'ANSI 87T : Protection différentielle à pourcentage avec retenue d\'harmonique 2 (courant d\'enclenchement inrush)',
        'ANSI 50/51 & 50N/51N : Maximum de courant de phase et de terre à temps inverse IDMT',
        'ANSI 63 : Relais Buchholz (détection de gaz et d\'onde de pression d\'huile dans la cuve)',
        'ANSI 87B : Protection différentielle de jeu de barres haute impédance'
      ],
      protectionSchemesEn: [
        'ANSI 87T: Percentage transformer differential with 2nd harmonic inrush restraint',
        'ANSI 50/51 & 50N/51N: Inverse-time phase and residual ground overcurrent',
        'ANSI 63: Buchholz gas accumulation and oil surge mechanical detection',
        'ANSI 87B: High-impedance busbar differential protection'
      ],
      maintenancePracticesFr: [
        'Analyse des gaz dissous dans l\'huile (DGA - méthode de Duval et CEI 60599)',
        'Mesure de la tangente delta (tg δ) des traversées condensateur',
        'Essais de temps de manœuvre et synchronisme des pôles de disjoncteur'
      ],
      maintenancePracticesEn: [
        'Dissolved gas analysis in transformer oil (DGA - Duval triangle IEC 60599)',
        'Capacitance and power factor / Tan Delta (tg δ) test of condenser bushings',
        'Circuit breaker contact timing and pole velocity dynamic analysis'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'CEI 60076', titleFr: 'Transformateurs de puissance', titleEn: 'Power transformers' },
        { ref: 'CEI 62271-100', titleFr: 'Appareillage à haute tension - Disjoncteurs à courant alternatif', titleEn: 'High-voltage switchgear and controlgear - Alternating-current circuit-breakers' },
        { ref: 'CEI 61936-1', titleFr: 'Installations électriques en courant alternatif de puissance supérieure à 1 kV', titleEn: 'Power installations exceeding 1 kV a.c.' },
        { ref: 'CEI 61850', titleFr: 'Réseaux et systèmes de communication pour l\'automatisation des systèmes électriques', titleEn: 'Communication networks and systems for power utility automation' }
      ],
      regulatoryBodiesFr: [
        'SONATREL (Exploitant des postes 225 kV)',
        'Eneo Cameroun (Exploitant des rames de distribution 30 kV)',
        'CIGRE Comité d\'Études B3 (Postes Électriques)'
      ],
      regulatoryBodiesEn: [
        'SONATREL (225 kV Substation Operator)',
        'Eneo Cameroon (30 kV Distribution Switchyard Operator)',
        'CIGRE Study Committee B3 (Substations)'
      ]
    },
    level5_relatedDomains: {
      D03: {
        domainCode: 'D03',
        relationshipTypeFr: 'Arrivée Lignes',
        relationshipTypeEn: 'Line Terminations',
        descriptionFr: 'Reçoit les lignes 225 kV en amont et en assure le sectionnement et la protection.',
        descriptionEn: 'Receives 225 kV transmission lines and provides switching and protection.'
      },
      D05: {
        domainCode: 'D05',
        relationshipTypeFr: 'Alimentation Départs Moyenne Tension',
        relationshipTypeEn: 'MV Feeder Feeds',
        descriptionFr: 'Alimente les rames de départs 30 kV vers les villes et zones industrielles.',
        descriptionEn: 'Feeds 30 kV distribution feeders powering cities and industrial zones.'
      },
      D11: {
        domainCode: 'D11',
        relationshipTypeFr: 'Zone de Protection',
        relationshipTypeEn: 'Protection Scheme',
        descriptionFr: 'Héberge les armoires de relais numériques IED et les réducteurs de mesure.',
        descriptionEn: 'Houses numerical protection IED cubicles, interlocks, and instrument transformers.'
      },
      D12: {
        domainCode: 'D12',
        relationshipTypeFr: 'Automatisme SAS',
        relationshipTypeEn: 'Substation Automation',
        descriptionFr: 'Système de contrôle-commande numérique (SAS) sous protocole CEI 61850.',
        descriptionEn: 'Digital Substation Automation System (SAS) communicating via IEC 61850 MMS and GOOSE.'
      },
      D16: {
        domainCode: 'D16',
        relationshipTypeFr: 'Mise à la Terre & Foudre',
        relationshipTypeEn: 'Grounding & Lightning',
        descriptionFr: 'Protégé par le ceinturage de terre en cuivre nu et les fils de garde/mâts parafoudre.',
        descriptionEn: 'Protected by copper grounding grid, surge arresters, and overhead shield wires.'
      }
    }
  },
  D05: {
    level1_system: {
      titleFr: 'Réseaux de Distribution HTA/BT & Électrification Rurale',
      titleEn: 'MV/LV Distribution Networks & Rural Electrification',
      summaryFr: 'Architecture radiale arborescente et bouclée ouverte acheminant l\'énergie depuis les postes sources HTA jusqu\'aux abonnés finaux résidentiels, tertiaires et ruraux via des réseaux aériens et souterrains 15-30 kV et 400 V, avec réenclencheurs automatiques (IACM/Reclosers) et transformateurs de distribution HTA/BT.',
      summaryEn: 'Radial branched and open-loop distribution topology routing power from MV primary substations to end-use residential, commercial, and rural consumers via 15-30 kV overhead/underground feeders and 400 V lines, equipped with auto-reclosers and MV/LV step-down transformers.',
      physicsPrinciplesFr: [
        'Chute de tension en ligne radiale HTA/BT : ΔU = √3 · I · (R · cos φ + X · sin φ)',
        'Échauffement thermique des conducteurs nus et torsadés (Loi de Joule et équation d\'équilibre thermique I²R = h·A·Δθ)',
        'Équations d\'écoulement de charges radiales (Forward-Backward Sweep method pour réseaux de distribution arborescents)',
        'Comportement transitoire des courants de court-circuit asymétriques monophasés phase-terre dans les réseaux à neutre compensé ou résistant',
        'Pertes techniques par effet Joule et pertes fer magnétiques à vide des transformateurs de distribution'
      ],
      physicsPrinciplesEn: [
        'Voltage drop in radial distribution feeders: ΔU = √3 · I · (R · cos φ + X · sin φ)',
        'Conductor thermal equilibrium equations (Joule heating vs convection/radiation heat dissipation I²R = h·A·Δθ)',
        'Radial distribution power flow equations (Forward-Backward Sweep methodology for branched networks)',
        'Transient behavior of single-phase-to-ground unsymmetrical fault currents under resistor-grounded MV systems',
        'Distribution transformer technical no-load iron core losses and load copper Joule dissipation'
      ],
      operatingVoltages: ['30 kV (Réseau HTA Rural Cameroun)', '15 kV (HTA Urbain Yaoundé/Douala)', '400 V (Triphasé Basse Tension)', '230 V (Monophasé Abonnés)', 'Régime de neutre TT / IT / TN'],
      powerFlowTypeFr: 'Écoulement d\'énergie principalement unidirectionnel descendant de la source vers les charges, devenant bidirectionnel avec l\'intégration du solaire distribué et des mini-réseaux ruraux.',
      powerFlowTypeEn: 'Primarily unidirectional top-down power delivery from primary substation to loads, evolving into bidirectional flow with distributed rooftop solar and mini-grid injection.'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Transformateur de Distribution HTA/BT Haut Rendement (50 à 630 kVA, huile minérale ou végétale)',
        'Disjoncteur Réenclencheur Aérien HTA (Auto-Recloser avec contrôle électronique)',
        'Interrupteur Aérien à Commande Mécanique ou Télécommandé (IACM / LBS SF6)',
        'Câbles Torsadés BT en Faisceau Aérien Autoporté (Aluminium 3x70 + 54.6 mm²)',
        'Postes de Transformation HTA/BT Préfabriqués et Postes sur Poteau (H61)',
        'Sectionneurs Fusibles HTA à Expulsion (Cut-Out Fuses HPC)',
        'Coffrets et Tableaux de Distribution Basse Tension (TUR / TIPI 4 à 8 départs BT)'
      ],
      primaryApparatusEn: [
        'High-Efficiency MV/LV Step-Down Distribution Transformer (50 to 630 kVA, mineral or ester oil)',
        'Pole-Mounted MV Automatic Circuit Recloser (ACR with microprocessor controller)',
        'Air-Break Overhead Switch-Disconnector / Motorized Gas Load Break Switch (IACM / SF6 LBS)',
        'Aerial Bundled Cable Low-Voltage Assemblies (ABC Aluminium 3x70 + 54.6 mm² messenger)',
        'Pole-Mounted Transformer Substation (H61) and Prefabricated Compact Enclosures',
        'Overhead Expulsion Fuse Cutouts (Dropout Fuses with high breaking capacity)',
        'Low-Voltage Distribution Feeder Pillars (TUR / TIPI 4 to 8 outgoing LV circuits)'
      ],
      equipmentIds: ['eq-transfo-distrib-01', 'eq-reclosers-01', 'eq-relais-num-01'],
      keyRatingsFr: [
        'Tension assignée d\'isolement HTA : 36 kV (réseaux 30 kV) ou 24 kV (réseaux 15 kV), tenue au choc foudre 170 kV BIL',
        'Pouvoir de coupure réenclencheur HTA : 12.5 kA ou 16 kA sous 30 kV (cycle normalisé O-0.3s-CO-3s-CO)',
        'Chute de tension maximale admissible en bout de ligne BT : ≤ 5% en zone urbaine, ≤ 8% à 10% en bout d\'antenne rurale',
        'Courant de court-circuit présumé au tableau BT : Icc ≤ 15 kA à 25 kA selon la puissance du transformateur source',
        'Durée de vie utile des conducteurs torsadés BT : ≥ 30 ans sous contraintes climatiques tropicales humides'
      ],
      keyRatingsEn: [
        'MV Insulation Rating: 36 kV (for 30 kV rural lines) or 24 kV (15 kV urban), 170 kV BIL lightning impulse withstand',
        'Recloser Breaking Capacity: 12.5 kA or 16 kA at 30 kV (standard operating cycle O-0.3s-CO-3s-CO)',
        'Maximum Allowable Voltage Drop at Feeder End: ≤ 5% in urban dense networks, ≤ 8% to 10% on long rural spurs',
        'Prospective Short-Circuit Current at LV Board: Icc ≤ 15 kA to 25 kA depending on transformer kVA rating',
        'Low-Voltage ABC Conductor Design Lifespan: ≥ 30 years under severe tropical equatorial humidity and UV exposure'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Calcul de chute de tension cumulative par segment de départ HTA selon la méthode de sommation des moments électriques',
        'Dimensionnement du calibre des conducteurs par critère thermique, densité économique de courant et chute de tension limite',
        'Plan de coordination sélective ampèremétrique et chronométrique entre fusibles HTA H61, réenclencheurs et disjoncteur de tête de départ',
        'Optimisation de l\'emplacement et de la puissance des bancs de condensateurs HTA pour compensation locale de réactif',
        'Étude de viabilité technico-économique des mini-réseaux hybrides solaires-diesel pour l\'électrification rurale décentralisée'
      ],
      designCalculationsEn: [
        'Cumulative voltage drop profiling along MV feeders using distributed electrical moment summation',
        'Conductor cross-section sizing based on continuous ampacity, economic current density, and maximum permissible voltage sag',
        'Time-current grading and selectivity coordination between transformer dropouts, line reclosers, and substation feeder breakers',
        'Optimal siting and sizing of shunt capacitor banks for feeder reactive power compensation and loss minimization',
        'Techno-economic optimization and levelized cost of electricity (LCOE) for decentralized rural hybrid solar mini-grids'
      ],
      protectionSchemesFr: [
        'Protection de surintensité à temps inverse et instantanée (ANSI 50/51) sur les têtes de départ HTA',
        'Protection de défaut terre directionnelle ou ampèremétrique sensible (ANSI 50N/51N, 67N) pour réseaux à neutre impédant',
        'Cycle de réenclenchement automatique triphasé (ANSI 79 : 1 cycle rapide + 2 cycles lents pour éliminer les défauts fugitifs à 85%)',
        'Détecteurs de défaut de passage de courant communicants (DAX / DDA) avec voyant flash à haute visibilité',
        'Protection des transformateurs H61 par fusibles à expulsion HPC et parafoudres à oxyde de zinc ZnO en tête de poteau'
      ],
      protectionSchemesEn: [
        'Time-overcurrent and instantaneous feeder protection (ANSI 50/51) on substation MV outgoing bays',
        'Sensitive earth-fault and directional ground protection (ANSI 50N/51N, 67N) for resistor-earthed systems',
        'Three-phase automated reclosing sequence (ANSI 79: 1 fast trip + 2 delayed shots clearing over 85% of transient faults)',
        'Communicating faulted circuit indicators (FCIs / DAX) with high-intensity omnidirectional strobe beacons',
        'Transformer protection combining high-voltage expulsion fuse cutouts and pole-top zinc-oxide ZnO surge arresters'
      ],
      maintenancePracticesFr: [
        'Campagnes régulières d\'élagage et d\'abattage d\'arbres sous les couloirs de lignes aériennes HTA en zone forestière équatoriale',
        'Contrôle thermographique infrarouge semestriel des connexions HTA, manchons de dérivation et traversées de transformateurs',
        'Analyse diélectrique et mesure de rigidité de l\'huile des transformateurs de distribution (tenue minimale > 30 kV / 2.5 mm)',
        'Contrôle périodique de la résistance de terre des masses et du neutre des postes H61 (R_terre < 5 Ω exigée)',
        'Télé-surveillance de l\'état des organes de coupure et télécommande depuis le dispatching régional DMS'
      ],
      maintenancePracticesEn: [
        'Cyclic vegetation clearance and tree trimming along overhead MV feeder easements in tropical equatorial forests',
        'Biannual infrared thermographic inspection of clamp connections, jumper splices, and transformer bushings',
        'Dielectric breakdown voltage testing of distribution transformer insulating oil (minimum threshold > 30 kV / 2.5 mm)',
        'Periodic measurement of neutral and frame grounding resistance at pole-mounted substations (mandated R_earth < 5 Ω)',
        'Remote supervisory health monitoring and motorized feeder automation telemetry to regional DMS dispatch'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'CEI 60076 (Parties 1 à 16)', titleFr: 'Transformateurs de puissance (Spécifications pour transformateurs de distribution)', titleEn: 'Power transformers (General specifications, temperature rise, and distribution transformers)' },
        { ref: 'CEI 62271-200', titleFr: 'Appareillage sous enveloppe métallique pour courant alternatif de tensions assignées > 1 kV et ≤ 52 kV', titleEn: 'AC metal-enclosed switchgear and controlgear for rated voltages above 1 kV and up to and including 52 kV' },
        { ref: 'CEI 60364', titleFr: 'Installations électriques à basse tension (Règles générales et schémas des liaisons à la terre)', titleEn: 'Low-voltage electrical installations (Fundamental principles, protection for safety, earthing systems)' },
        { ref: 'NF C 13-100', titleFr: 'Postes de livraison établis à l\'intérieur d\'un bâtiment et alimentés par un réseau de distribution public HTA', titleEn: 'Indoor consumer substations supplied by public medium-voltage distribution systems' },
        { ref: 'CEI 62271-103', titleFr: 'Appareillage à haute tension - Interrupteurs pour tensions assignées supérieures à 1 kV et jusqu\'à 52 kV', titleEn: 'High-voltage switchgear and controlgear - Switches for rated voltages above 1 kV up to and including 52 kV' }
      ],
      regulatoryBodiesFr: [
        'Eneo Cameroon S.A. (Concessionnaire national de la distribution et de la commercialisation d\'électricité)',
        'AER Cameroun (Agence d\'Électrification Rurale - Financement et développement des réseaux décentralisés)',
        'ARSEL Cameroun (Agence de Régulation du Secteur de l\'Électricité - Normes de qualité de service et tarifs)',
        'Ministère de l\'Eau et de l\'Énergie (MINEE Cameroun - Stratégie nationale d\'accès universel à l\'électricité)'
      ],
      regulatoryBodiesEn: [
        'Eneo Cameroon S.A. (National electricity distribution and customer retail concessionaire)',
        'AER Cameroon (Rural Electrification Agency - Decentralized off-grid and mini-grid expansion)',
        'ARSEL Cameroon (Electricity Sector Regulatory Agency - Quality of service and tariff determination)',
        'Ministry of Water Resources and Energy (MINEE Cameroon - Universal electricity access policy)'
      ]
    },
    level5_relatedDomains: {
      D04: {
        domainCode: 'D04',
        relationshipTypeFr: 'Postes Sources HT/HTA',
        relationshipTypeEn: 'Primary HT/MV Substations',
        descriptionFr: 'Les postes sources transforment la tension de transport en 15 ou 30 kV et alimentent les départs de distribution.',
        descriptionEn: 'Primary substations step down transmission voltage to 15 or 30 kV and feed distribution feeder networks.'
      },
      D12: {
        domainCode: 'D12',
        relationshipTypeFr: 'Téléconduite & Automatismes FLISR',
        relationshipTypeEn: 'Distribution Automation & FLISR',
        descriptionFr: 'Télécommande des réenclencheurs et interrupteurs télécommandés pour l\'isolation automatique des tronçons en défaut.',
        descriptionEn: 'Remote SCADA control of motorized reclosers and sectionalisers executing automated fault isolation and service restoration.'
      },
      D15: {
        domainCode: 'D15',
        relationshipTypeFr: 'Comptage Intelligent AMI',
        relationshipTypeEn: 'Smart Metering & AMI',
        descriptionFr: 'Déploiement des compteurs communicants et concentrateurs CPL/4G pour la télé-relève et la gestion des pertes.',
        descriptionEn: 'Deployment of AMI smart meters and PLC/cellular concentrators for automated meter reading and non-technical loss analytics.'
      },
      D16: {
        domainCode: 'D16',
        relationshipTypeFr: 'Régimes de Neutre & Sécurité',
        relationshipTypeEn: 'Earthing & Safety Schemes',
        descriptionFr: 'Coordination des régimes de neutre HTA (RPN) et BT (TT/TN) pour garantir la sécurité des tiers et la tenue aux surtensions.',
        descriptionEn: 'Coordination of MV neutral earthing (via NGR) and LV earthing schemes (TT/TN) ensuring public safety and surge mitigation.'
      },
      D11: {
        domainCode: 'D11',
        relationshipTypeFr: 'Protection & Coordination Sélective',
        relationshipTypeEn: 'Protection & Selectivity Studies',
        descriptionFr: 'Calage des courbes à temps inverse des disjoncteurs de départ pour une sélectivité totale avec les fusibles avals.',
        descriptionEn: 'Inverse-time relay curve calibration on feeder breakers ensuring discrimination with downstream fuses and reclosers.'
      }
    }
  },
  D06: {
    level1_system: {
      titleFr: 'Installations Électriques Industrielles, Bâtiments & Micro-Réseaux',
      titleEn: 'Industrial Power Systems, Building Infrastructure & Microgrids',
      summaryFr: 'Ce système régit la distribution terminale de forte puissance au sein des sites industriels lourds (raffineries, cimenteries, mines, agro-alimentaire), des infrastructures tertiaires critiques (hôpitaux, data centers) et des micro-réseaux insulaires intégrant cogénération, groupes de secours et stockage par batteries.',
      summaryEn: 'Governs heavy-duty end-use power distribution within heavy industrial facilities (refineries, cement plants, mines), mission-critical tertiary infrastructure (hospitals, data centers), and islanded microgrids incorporating captive generation, diesel gensets, and BESS.',
      physicsPrinciplesFr: [
        'Régime thermique des récepteurs industriels et contraintes électrodynamiques de court-circuit (Forces de Laplace F = μ0 · I1 · I2 / (2πd))',
        'Démarrage et appel de courant des moteurs asynchrones à cage (I_dem ≈ 6 à 8 In, chute de tension transitoire en ligne)',
        'Puissance déformante et pollution harmonique générée par les variateurs de vitesse VFD et redresseurs non-linéaires',
        'Facteur de puissance et dimensionnement de la compensation de puissance réactive kVAR locale (cos φ = P / S)',
        'Équilibre de puissance et inertie synthétique dans les micro-réseaux autonomes basse tension (inverters en mode Grid-Forming)'
      ],
      physicsPrinciplesEn: [
        'Industrial receiver thermal loading and electrodynamic fault stress (Laplace forces F = μ0 · I1 · I2 / (2πd))',
        'Induction motor across-the-line starting inrush dynamics (I_start ≈ 6 to 8 In causing transient feeder voltage dips)',
        'Deformation power and harmonic spectra injected by nonlinear adjustable speed drives (VFDs) and rectifier bridges',
        'Power factor and localized reactive power compensation dimensioning (cos φ = P / S)',
        'Microgrid power balancing and synthetic inertia emulation in autonomous islanded systems (grid-forming inverters)'
      ],
      operatingVoltages: ['6.6 kV / 11 kV (Moyenne Tension Industrielle)', '400 V Triphasé / 230 V Monophasé BT', '48 V / 110 V / 220 V DC (Alimentations sans interruption)', 'Micro-réseaux autonomes 400 V'],
      powerFlowTypeFr: 'Flux local fortement fluctuant avec démarrages de fortes charges motrices, réinjection intermittente PV et basculement automatique normal/secours (inverseur de source ATS).',
      powerFlowTypeEn: 'Dynamic local power distribution subject to heavy motor starts, intermittent rooftop PV injection, and automated primary-to-backup transfer switching (ATS).'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Tableaux Généraux Basse Tension (TGBT Forme 4b avec tiroirs débrochables)',
        'Disjoncteurs de Puissance BT à Coupure dans l\'Air (ACB 800 à 6300 A avec déclencheur électronique)',
        'Disjoncteurs Boîtier Moulé (MCCB à déclencheur magnétothermique et électronique)',
        'Groupes Électrogènes Diesel de Secours Automatiques (Genset 250 kVA à 2500 kVA avec inverseur ATS)',
        'Systèmes d\'Alimentation Sans Interruption Statiques (ASI / UPS double conversion en ligne VFI)',
        'Centres de Contrôle Moteurs (CCM / MCC avec départs directs, progressifs et variateurs VFD)',
        'Armoires Automatiques de Compensation de Facteur de Puissance à Condensateurs et Filtres Anti-Harmoniques'
      ],
      primaryApparatusEn: [
        'Main Low-Voltage Switchboards (MLVS / TGBT Form 4b fully withdrawable compartments)',
        'Air Circuit Breakers (ACB 800 to 6300 A with advanced electronic trip units)',
        'Molded Case Circuit Breakers (MCCB with thermal-magnetic and electronic trip units)',
        'Standby Emergency Diesel Generator Sets (Genset 250 kVA to 2500 kVA with automated ATS switch)',
        'Uninterruptible Power Supplies (Double Conversion Online UPS VFI-SS-111)',
        'Motor Control Centers (MCC featuring direct-on-line, soft-starters, and variable frequency drives)',
        'Automatic Power Factor Correction Capacitor Banks with Detuned Harmonic Blocking Reactors'
      ],
      equipmentIds: ['eq-tgbt-indus-01', 'eq-relais-num-01', 'eq-transfo-distrib-01'],
      keyRatingsFr: [
        'Courant assigné jeu de barres TGBT : jusqu\'à 6300 A (tenue aux courants de court-circuit Icw jusqu\'à 100 kA / 1 s)',
        'Pouvoir de coupure ultime des disjoncteurs : Icu jusqu\'à 150 kA sous 400 V AC (CEI 60947-2)',
        'Temps de commutation automatique normal/secours ATS : < 100 ms (sans interruption < 0 ms avec UPS online)',
        'Rendement énergétique des onduleurs UPS : ≥ 96% en mode double conversion et ≥ 99% en mode éco',
        'Classe d\'isolation thermique des moteurs : Classe F (155 °C) ou H (180 °C) avec échauffement limité à la classe B'
      ],
      keyRatingsEn: [
        'Main Busbar Rated Continuous Current: up to 6300 A (short-time withstand current Icw up to 100 kA / 1 s)',
        'Circuit Breaker Ultimate Breaking Capacity: Icu up to 150 kA at 400 V AC (IEC 60947-2)',
        'Automatic Transfer Switch (ATS) Transfer Time: < 100 ms (zero transfer time with online static UPS)',
        'UPS Operating Efficiency: ≥ 96% in double conversion mode, ≥ 99% in intelligent eco mode',
        'Motor Insulation Class: Class F (155 °C) or Class H (180 °C) with temperature rise restricted to Class B limits'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Calcul précis des courants de court-circuit maximaux et minimaux selon la méthode des impédances (norme CEI 60909)',
        'Bilan de puissance global d\'usine, foisonnement des charges et facteur d\'utilisation (Ku, Ks)',
        'Étude de démarrage direct et sur variateur des gros moteurs asynchrones et vérification de la chute de tension transitoire (< 15%)',
        'Dimensionnement des câbles d\'énergie BT selon la norme CEI 60364-5-52 (lettre de sélection, facteurs de correction thermique et de groupement)',
        'Dimensionnement des bancs de batteries et autonomie des onduleurs UPS pour charges médicales ou informatiques critiques'
      ],
      designCalculationsEn: [
        'Comprehensive prospective short-circuit current calculations using the impedance method per IEC 60909',
        'Connected load schedules, diversity factors (Ks), and coincidence factor computations for plant sizing',
        'Motor starting dynamics assessment (direct-on-line vs soft-starter/VFD) confirming bus voltage drop remains < 15%',
        'Low-voltage cable ampacity and thermal sizing per IEC 60364-5-52 (derating factors for ambient heat, grouping, and soil)',
        'Battery bank autonomy sizing and load profiling for critical medical, telemetry, and IT data center loads'
      ],
      protectionSchemesFr: [
        'Déclencheurs électroniques avancés : Protection long retard L, court retard S sélectif, instantané I et défaut terre G (LSI/LSIG)',
        'Protection différentielle résiduelle à haute sensibilité pour la sécurité des personnes (DDR 30 mA) et de prévention incendie (300 mA)',
        'Verrouillage mécanique et électrique sécurisé Normal/Secours interdisant le couplage accidentel réseau/groupe',
        'Relais de protection thermique moteur (ANSI 49) et protection contre le blocage de rotor (ANSI 51LR)',
        'Parafoudres BT Type 1 + 2 en tête de TGBT pour la protection contre les surtensions transitoires industrielles'
      ],
      protectionSchemesEn: [
        'Advanced electronic trip units: Long-time (L), Short-time selective (S), Instantaneous (I), and Ground-fault (G) (LSIG)',
        'Residual current devices (RCDs) for personnel life safety (30 mA) and fire hazard mitigation (300 mA)',
        'Mechanically and electrically interlocked ATS transfer schemes preventing accidental paralleling of grid and genset',
        'Motor thermal overload protection (ANSI 49) and locked-rotor protection (ANSI 51LR)',
        'Type 1 + Type 2 low-voltage surge protective devices (SPDs) installed at the service entrance switchboard'
      ],
      maintenancePracticesFr: [
        'Audit thermographique infrarouge semestriel des connexions de puissance et des plages de raccordement du TGBT',
        'Essai mensuel en charge réelle des groupes électrogènes de secours avec banc de charge résistif',
        'Test annuel de capacité de décharge des batteries d\'accumulateurs d\'onduleurs UPS (contrôle d\'impédance interne des éléments)',
        'Débrochage et contrôle mécanique des disjoncteurs ACB (graissage des tringleries, test de déclenchement à l\'injecteur)',
        'Contrôle de la qualité de l\'isolement électrique par mégohmmètre sous 500 V / 1000 V DC'
      ],
      maintenancePracticesEn: [
        'Biannual infrared thermography audit of heavy-current busbar joints, terminations, and breaker stabs',
        'Monthly live-load testing of emergency backup diesel generators utilizing calibrated resistive load banks',
        'Annual battery bank discharge capacity testing and cell internal impedance logging on critical UPS installations',
        'Racking out and mechanical overhaul of draw-out air circuit breakers (lubrication, primary contact wear checks, secondary injection)',
        'Periodic insulation resistance testing with calibrated megohmmeters under 500 V / 1000 V DC test potentials'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'CEI 61439 (Parties 1 et 2)', titleFr: 'Ensembles d\'appareillage à basse tension - Règles générales et ensembles d\'appareillage de puissance (TGBT)', titleEn: 'Low-voltage switchgear and controlgear assemblies - General rules and power switchgear assemblies' },
        { ref: 'CEI 60947-2', titleFr: 'Appareillage à basse tension - Partie 2 : Disjoncteurs', titleEn: 'Low-voltage switchgear and controlgear - Part 2: Circuit-breakers' },
        { ref: 'CEI 60364 (NF C 15-100)', titleFr: 'Installations électriques à basse tension - Règles de conception, réalisation et vérification', titleEn: 'Low-voltage electrical installations - Design, erection and verification rules' },
        { ref: 'IEEE 1584-2018', titleFr: 'Guide pour la réalisation des calculs de danger d\'arc électrique en milieu industriel', titleEn: 'IEEE Guide for Performing Arc-Flash Hazard Calculations in industrial facilities' },
        { ref: 'NFPA 70E', titleFr: 'Norme de sécurité électrique sur les lieux de travail (Protection individuelle et zones d\'approche)', titleEn: 'Standard for Electrical Safety in the Workplace (Arc-flash PPE and safe approach boundaries)' }
      ],
      regulatoryBodiesFr: [
        'IEEE Industry Applications Society (IAS - Normes de génie électrique industriel)',
        'Schneider Electric / Siemens Technical Councils (Guides de conception TGBT et distribution terminale)',
        'Corps National des Sapeurs-Pompiers (Réglementation de sécurité contre l\'incendie dans les ERP et IGH au Cameroun)',
        'ARSEL Cameroun (Réglementation des postes de livraison HTA industriels)'
      ],
      regulatoryBodiesEn: [
        'IEEE Industry Applications Society (IAS - Industrial power systems engineering standards)',
        'Schneider Electric / Siemens Engineering Technical Councils (Switchboard design guides and application standards)',
        'Cameroon Fire & Rescue Corps (Safety codes and fire prevention standards for public and industrial buildings)',
        'ARSEL Cameroon (Regulatory framework for private medium-voltage industrial service connections)'
      ]
    },
    level5_relatedDomains: {
      D05: {
        domainCode: 'D05',
        relationshipTypeFr: 'Réseau de Distribution HTA',
        relationshipTypeEn: 'Medium-Voltage Distribution Feeder',
        descriptionFr: 'Le réseau de distribution public alimente le poste de livraison HTA privé du complexe industriel.',
        descriptionEn: 'The utility distribution feeder feeds the private primary MV customer substation of the plant.'
      },
      D07: {
        domainCode: 'D07',
        relationshipTypeFr: 'Machines & Moteurs Électriques',
        relationshipTypeEn: 'Electric Motors & Drives',
        descriptionFr: 'Les centres de contrôle moteurs (CCM) alimentent et protègent les moteurs d\'entraînement des pompes et broyeurs.',
        descriptionEn: 'Motor control centers (MCC) distribute power to and protect high-power induction pump and mill motors.'
      },
      D08: {
        domainCode: 'D08',
        relationshipTypeFr: 'Électronique de Puissance & VFD',
        relationshipTypeEn: 'Power Electronics & VFDs',
        descriptionFr: 'Les variateurs de vitesse et les onduleurs UPS assurent le pilotage fin des procédés et la continuité sans coupure.',
        descriptionEn: 'Variable frequency drives and static UPS inverters ensure precise process motion control and uninterrupted power.'
      },
      D14: {
        domainCode: 'D14',
        relationshipTypeFr: 'Qualité d\'Énergie & Filtrage',
        relationshipTypeEn: 'Power Quality & Filtering',
        descriptionFr: 'La compensation de réactif et le filtrage harmonique actif préservent la durée de vie du matériel et éliminent les pénalités.',
        descriptionEn: 'Reactive compensation and active harmonic filtering safeguard equipment lifespan and eliminate utility reactive penalties.'
      },
      D16: {
        domainCode: 'D16',
        relationshipTypeFr: 'Sécurité Électrique & Arc Flash',
        relationshipTypeEn: 'Electrical Safety & Arc Flash',
        descriptionFr: 'Calcul des énergies incidentes aux jeux de barres du TGBT et prescription des EPI requis pour les électriciens.',
        descriptionEn: 'Incident energy calculations at TGBT busbars dictate PPE category requirements for qualified maintenance electricians.'
      }
    }
  },
  D07: {
    level1_system: {
      titleFr: 'Machines Électriques & Conversion Électromécanique',
      titleEn: 'Electrical Machines & Electromechanical Conversion',
      summaryFr: 'Ce système régit la conversion bidirectionnelle d\'énergie entre puissances mécaniques et puissances électromagnétiques alternatives via couplage rotor-stator, circuits magnétiques en tôles d\'acier au silicium et régulations d\'excitation AVR.',
      summaryEn: 'Governs bidirectional energy conversion between shaft mechanical power and alternating electromagnetic energy via rotor-stator coupling, laminated silicon steel cores, and automatic voltage regulation (AVR).',
      physicsPrinciplesFr: [
        'Loi de Faraday-Lenz (induction électromagnétique e = -dΦ/dt)',
        'Loi de Laplace (force électromécanique sur conducteurs F = I·L × B)',
        'Équation de balancement électromécanique du rotor (J·dω/dt = C_m - C_e)'
      ],
      physicsPrinciplesEn: [
        'Faraday-Lenz Law of Induction (e = -dΦ/dt)',
        'Laplace Electromechanical Force (F = I·L × B)',
        'Rotor Electromechanical Swing Equation (J·dω/dt = T_m - T_e)'
      ],
      operatingVoltages: ['400 V BT (Moteurs)', '6.6 kV HTA', '11 kV / 15 kV HTA (Nachtigal)', '20 kV – 24 kV'],
      powerFlowTypeFr: 'Production active synchrone P (MW) et absorption/fourniture de réactif Q (Mvar)',
      powerFlowTypeEn: 'Synchronous active power generation P (MW) with bidirectional reactive power Q (Mvar) dispatch'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Alternateur Synchrone à Pôles Saillants (Hydro)',
        'Transformateur Élévateur de Groupe (GSU 15/225 kV)',
        'Disjoncteur de Groupe pour Générateurs (GCB)',
        'Système d\'Excitation Statique à Thyristors & AVR',
        'Gaine à Barres à Phases Séparées (IPB)'
      ],
      primaryApparatusEn: [
        'Salient-Pole Hydro Synchronous Alternator',
        'Generator Step-Up Transformer (GSU 15/225 kV)',
        'Generator Circuit Breaker (GCB)',
        'Static Thyristor Excitation System & AVR',
        'Isolated Phase Busduct (IPB)'
      ],
      equipmentIds: ['eq-hydro-songloulou-01', 'eq-trafo-hta-01', 'eq-cb-sf6-01'],
      keyRatingsFr: [
        'Puissance nominale assignée Sn : 70 MVA par groupe (Nachtigal 7x60 MW)',
        'Tension statorique assignée Un : 15.0 kV ± 5%',
        'Facteur de puissance assigné : cos φ = 0.85 inductif / 0.95 capacitif',
        'Vitesse synchrone de rotation : 187.5 tr/min (32 pôles à 50 Hz)'
      ],
      keyRatingsEn: [
        'Rated nominal capacity Sn: 70 MVA per unit (Nachtigal 7x60 MW)',
        'Nominal stator voltage Un: 15.0 kV ± 5%',
        'Rated power factor: cos phi = 0.85 lagging / 0.95 leading',
        'Nominal synchronous speed: 187.5 rpm (32 poles at 50 Hz)'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Courbe de capabilité P-Q de l\'alternateur et limites de courant rotorique/statorique',
        'Calcul des réactances directes et transverses d-q (Xd, X\'d, X"d, Xq, X"q)',
        'Dimensionnement thermique des enroulements selon échauffement limite CEI 60085'
      ],
      designCalculationsEn: [
        'Generator P-Q capability diagram and thermal rotor/stator current limits',
        'Direct and quadrature axes reactances calculation (Xd, X\'d, X"d, Xq, X"q)',
        'Winding insulation thermal sizing based on IEC 60085 temperature rise classes'
      ],
      protectionSchemesFr: [
        'ANSI 87G : Protection différentielle statorique à pourcentage sans temporisation',
        'ANSI 40 : Perte d\'excitation (relais d\'impédance circulaire Mho décalé)',
        'ANSI 64R/64S : Protection masse rotorique et masse statorique 100% 3ème harmonique',
        'ANSI 46 : Protection contre les déséquilibres et courants inverses (I2²·t)'
      ],
      protectionSchemesEn: [
        'ANSI 87G: Instantaneous percentage stator differential protection',
        'ANSI 40: Loss of field / excitation protection using offset mho circle',
        'ANSI 64R/64S: Rotor ground fault and 100% stator ground via 3rd harmonic monitoring',
        'ANSI 46: Unbalance negative-phase-sequence overcurrent protection (I2²·t)'
      ],
      maintenancePracticesFr: [
        'Surveillance des décharges partielles (PD) en ligne par capteurs capacitifs 80 pF',
        'Analyse des gaz dissous dans l\'huile du transfo élévateur (DGA - CEI 60599)',
        'Contrôle vibratoire spectral FFT des paliers et de la ligne d\'arbre'
      ],
      maintenancePracticesEn: [
        'Online partial discharge (PD) stator monitoring via 80 pF capacitive couplers',
        'Dissolved gas analysis in GSU transformer oil (DGA per IEC 60599 Duval triangle)',
        'FFT vibration spectrum monitoring of thrust bearings and generator shaft'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'CEI 60034-1', titleFr: 'Machines électriques tournantes - Caractéristiques assignées et performances', titleEn: 'Rotating electrical machines - Rating and performance' },
        { ref: 'CEI 60076', titleFr: 'Transformateurs de puissance', titleEn: 'Power transformers' },
        { ref: 'CEI 62271-37-013', titleFr: 'Disjoncteurs pour générateurs (GCB)', titleEn: 'Alternating-current generator circuit-breakers' },
        { ref: 'IEEE C37.102', titleFr: 'Guide de protection des alternateurs à courant alternatif', titleEn: 'Guide for AC Generator Protection' }
      ],
      regulatoryBodiesFr: [
        'CIGRE Comité d\'Études A1 (Machines Électriques Tournantes)',
        'CIGRE Comité d\'Études A2 (Transformateurs de Puissance)',
        'SONATREL / Eneo (Spécifications Techniques Réseau Cameroun)'
      ],
      regulatoryBodiesEn: [
        'CIGRE Study Committee A1 (Rotating Electrical Machines)',
        'CIGRE Study Committee A2 (Power Transformers)',
        'SONATREL / Eneo (Cameroon Utility Engineering Grid Codes)'
      ]
    },
    level5_relatedDomains: {
      D01: {
        domainCode: 'D01',
        relationshipTypeFr: 'Entraînement Mécanique',
        relationshipTypeEn: 'Mechanical Prime Mover',
        descriptionFr: 'Reçoit le couple mécanique de la turbine hydraulique ou thermique sur l\'arbre principal.',
        descriptionEn: 'Receives mechanical driving torque from hydraulic or thermal turbine shaft.'
      },
      D04: {
        domainCode: 'D04',
        relationshipTypeFr: 'Poste d\'Évacuation',
        relationshipTypeEn: 'Evacuation Switchyard',
        descriptionFr: 'Se raccorde au jeu de barres haute tension via le transformateur élévateur GSU.',
        descriptionEn: 'Connects to transmission substation busbars via generator step-up transformer.'
      },
      D11: {
        domainCode: 'D11',
        relationshipTypeFr: 'Protection Unitaire',
        relationshipTypeEn: 'Unit Protection Relaying',
        descriptionFr: 'Intègre les protections unitaires 87G/87T, désexcitation rapide et déclenchement d\'urgence.',
        descriptionEn: 'Integrates unit differential 87G/87T protection, rapid de-excitation, and emergency tripping.'
      },
      D15: {
        domainCode: 'D15',
        relationshipTypeFr: 'Diagnostic d\'Actifs',
        relationshipTypeEn: 'Asset Diagnostics',
        descriptionFr: 'Diagnostic diélectrique des bobinages, thermographie et chromatographie des huiles DGA.',
        descriptionEn: 'Winding dielectric insulation diagnostics, thermography, and DGA oil chromatography.'
      }
    }
  },
  D08: {
    level1_system: {
      titleFr: 'Systèmes Électriques Industriels & Procédés Électro-Intensifs',
      titleEn: 'Industrial Electrical & Process Systems',
      summaryFr: 'Ce système régit l\'architecture électrique des usines à procédé continu (mines, métallurgie, cimenteries, pétrochimie) : distribution radiale ou bouclée HTA/BT, centres de contrôle moteur (MCC 400 V/690 V), atmosphères explosibles (ATEX) et maintien strict de la continuité de production.',
      summaryEn: 'Governs power distribution for continuous process industries (mines, metal smelting, cement, petrochemicals): MV/LV radial or open-loop topology, withdrawable Motor Control Centers (MCC), hazardous ATEX areas, and absolute continuity of production.',
      physicsPrinciplesFr: [
        'Échauffement adiabatique et équilibre thermique des conducteurs et moteurs (I²·t)',
        'Creux de tension transitoire au démarrage direct des moteurs (ΔU% = S_start / (S_sc + S_start))',
        'Propagation des ondes harmoniques de courant non linéaires dans les impédances de réseau'
      ],
      physicsPrinciplesEn: [
        'Adiabatic heating and motor thermal equilibrium time constants (I²·t)',
        'Transient bus voltage sag during direct-on-line motor starts (ΔU% = S_start / (S_sc + S_start))',
        'Harmonic distortion propagation of non-linear converter loads through grid impedance'
      ],
      operatingVoltages: ['400 V BT', '690 V BT Industriel', '6.6 kV HTA', '11 kV / 15 kV HTA', '90 kV HTB Privé'],
      powerFlowTypeFr: 'Consommation électro-intensive active P (MW) et gestion locale du facteur de puissance (cos φ ≥ 0.95)',
      powerFlowTypeEn: 'Heavy active power consumption P (MW) with on-site power factor correction (cos phi >= 0.95)'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Tableau Général Basse Tension MCC à Tiroirs Débrochables (Forme 4b)',
        'Variateur de Fréquence Moyenne Tension Multi-Niveaux (CHB 6.6 kV)',
        'Moteur Asynchrone Antidéflagrant ATEX Ex d IIC T4',
        'Transformateur Tri-Enroulements de Procédé HTA/BT (2500 kVA)',
        'Filtre Harmonique Actif et Batterie Automatique de Condensateurs BT'
      ],
      primaryApparatusEn: [
        'Withdrawable Motor Control Center (Form 4b segregation)',
        'Cascaded H-Bridge Medium-Voltage VFD Drive (6.6 kV)',
        'Explosion-Proof Induction Motor ATEX Ex d IIC T4',
        'Three-Winding Industrial Process Transformer (2500 kVA)',
        'Active Harmonic Filter and Detuned Automatic LV Capacitor Bank'
      ],
      equipmentIds: ['eq-tgbt-bt-01', 'eq-vfd-ind-01', 'eq-motor-atex-01'],
      keyRatingsFr: [
        'Courant nominal jeu de barres principal MCC : 2500 A à 4000 A',
        'Tenue au court-circuit Icw : 50 kA / 65 kA (1s)',
        'Forme de séparation interne : Forme 4b (CEI 61439-2)',
        'Marquage ATEX moteurs de zone : II 2G Ex d IIC T4 Gb (IP66)'
      ],
      keyRatingsEn: [
        'Rated main MCC busbar continuous current: 2500 A to 4000 A',
        'Short-time withstand rating Icw: 50 kA / 65 kA (1s)',
        'Internal functional segregation: Form 4b (IEC 61439-2)',
        'ATEX classification for zoned drives: II 2G Ex d IIC T4 Gb (IP66)'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Calcul du creux de tension transitoire au démarrage des gros moteurs',
        'Coordination sélective totale chronométrique et ampèremétrique (TCC)',
        'Dimensionnement des filtres d\'harmoniques passifs/actifs selon CEI 61000'
      ],
      designCalculationsEn: [
        'Transient busbar voltage dip calculation during motor starting',
        'Total time-current curve (TCC) coordination and selectivity study',
        'Active and passive harmonic filter sizing per IEC 61000 regulations'
      ],
      protectionSchemesFr: [
        'ANSI 49 : Protection thermique image d\'échauffement stator/rotor',
        'ANSI 51LR : Protection contre le rotor bloqué et démarrage prolongé',
        'ANSI 46 : Protection contre les déséquilibres de phase et courant inverse I2',
        'ANSI 50N/51N : Détection de défaut terre résiduel par tore sommateur CBCT'
      ],
      protectionSchemesEn: [
        'ANSI 49: Motor stator and rotor thermal replica protection',
        'ANSI 51LR: Locked rotor and prolonged acceleration time trip',
        'ANSI 46: Negative-sequence unbalance current protection',
        'ANSI 50N/51N: Sensitive residual ground fault protection via core-balance CT'
      ],
      maintenancePracticesFr: [
        'Thermographie infrarouge semestrielle des pinces débrochables des tiroirs MCC',
        'Analyse vibratoire spectrale FFT des paliers moteurs en continu',
        'Contrôle de résistance d\'isolement mégohmmètre 1000V/2500V'
      ],
      maintenancePracticesEn: [
        'Biannual infrared thermography of MCC withdrawable contact fingers',
        'Continuous online FFT vibration spectrum monitoring of motor bearings',
        'Periodic megohmmeter 1000V/2500V insulation resistance testing'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'CEI 61439-1/2', titleFr: 'Ensembles d\'appareillage à basse tension - Tableaux de puissance et MCC', titleEn: 'Low-voltage switchgear and controlgear assemblies - Power switchgear and MCC' },
        { ref: 'CEI 60079', titleFr: 'Atmosphères explosives - Matériel électrique et règles d\'installation (ATEX)', titleEn: 'Explosive atmospheres - Electrical equipment and installation rules' },
        { ref: 'CEI 61800-3', titleFr: 'Entraînements électriques de puissance à vitesse variable - CEM', titleEn: 'Adjustable speed electrical power drive systems - EMC requirements' },
        { ref: 'NFPA 70E', titleFr: 'Sécurité électrique sur les lieux de travail et calcul du risque d\'arc flash', titleEn: 'Standard for Electrical Safety in the Workplace & Arc Flash Assessment' }
      ],
      regulatoryBodiesFr: [
        'CIGRE Comité B3 (Sous-stations et Installations Industrielles)',
        'IEEE Industry Applications Society (IAS)',
        'Direction des Mines et de la Sécurité Industrielle (MINEE Cameroun)'
      ],
      regulatoryBodiesEn: [
        'CIGRE Study Committee B3 (Substations & Industrial Installations)',
        'IEEE Industry Applications Society (IAS)',
        'Ministry of Water Resources & Energy (MINEE Cameroon)'
      ]
    },
    level5_relatedDomains: {
      D04: {
        domainCode: 'D04',
        relationshipTypeFr: 'Poste Source Privé',
        relationshipTypeEn: 'Industrial Substation',
        descriptionFr: 'Reçoit la tension 90 kV ou 30 kV du concessionnaire et alimente les transformateurs généraux.',
        descriptionEn: 'Receives utility 90 kV or 30 kV transmission feed to step down to plant distribution level.'
      },
      D06: {
        domainCode: 'D06',
        relationshipTypeFr: 'Distribution BT',
        relationshipTypeEn: 'LV Distribution & Switchboards',
        descriptionFr: 'Définit les règles de filerie BT, régimes de neutre industriels (TNS/IT) et armoires secondaires.',
        descriptionEn: 'Defines low-voltage wiring, industrial earthing regimes (TNS/IT), and secondary boards.'
      },
      D07: {
        domainCode: 'D07',
        relationshipTypeFr: 'Actionneurs & Moteurs',
        relationshipTypeEn: 'Motors & Actuators',
        descriptionFr: 'Fournit les moteurs asynchrones et synchrones entraînés par les tiroirs MCC et variateurs VFD.',
        descriptionEn: 'Provides the physical induction and synchronous motors driven by MCC drawers and VFDs.'
      },
      D14: {
        domainCode: 'D14',
        relationshipTypeFr: 'Qualité d\'Énergie & CEM',
        relationshipTypeEn: 'Power Quality & EMC',
        descriptionFr: 'Compense les harmoniques et le réactif induits par les grands variateurs de vitesse et fours.',
        descriptionEn: 'Mitigates harmonics and reactive power drawn by massive process variable speed drives and furnaces.'
      }
    }
  },
  D09: {
    level1_system: {
      titleFr: 'Conversion Solaire PV, Éolienne & Systèmes Décentralisés (EnR & IBR)',
      titleEn: 'Solar PV, Wind Conversion & Inverter-Based Resources (IBR & DER)',
      summaryFr: 'Ce système convertit le flux photonique solaire et cinétique éolien en puissance électrique triphasée synchrone via des générateurs statiques basés sur onduleurs (IBR). Il opère en régulation de point de puissance maximale (MPPT), assure la tenue dynamique lors des creux de tension (LVRT) et participe au soutien de fréquence (FFR) et de tension (Q(U)).',
      summaryEn: 'Harnesses solar photon flux and kinetic wind energy into grid-synchronized 3-phase AC power via Inverter-Based Resources (IBR). Executes real-time MPPT, enforces Low-Voltage Ride-Through (LVRT) grid-code compliance, and provides dynamic voltage support Q(U) and fast frequency response (FFR).',
      physicsPrinciplesFr: [
        'Effet photoélectrique dans les jonctions P-N silicium monocristallin (équation de Shockley-Queisser)',
        'Théorie de Betz pour la puissance aérodynamique éolienne (P_max = (16/27) · 0.5 · ρ · S · v³)',
        'Contrôle vectoriel d-q et synchronisation de phase par boucle à verrouillage de phase (PLL)'
      ],
      physicsPrinciplesEn: [
        'Semiconductor P-N junction photovoltaic effect (Shockley-Queisser limit)',
        'Betz limit for aerodynamic wind energy extraction (P_max = (16/27) · 0.5 · ρ · S · v³)',
        'Vector dq synchronous frame control and Phase-Locked Loop (PLL) grid tracking'
      ],
      operatingVoltages: ['1000 V / 1500 V DC (Chaînes PV)', '690 V AC (Sortie Onduleurs/Éolien)', '20 kV / 33 kV HTA (Collecteur)', '90 kV / 225 kV HTB (Évacuation)'],
      powerFlowTypeFr: 'Production active variable P (MW) intermittente avec injection dynamique réactive Q (Mvar) 4 quadrants',
      powerFlowTypeEn: 'Variable active generation P (MW) with four-quadrant dynamic reactive current Q (Mvar) injection'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Modules Photovoltaïques Bifaciaux N-Type TOPCon 650 Wp',
        'Onduleurs Centraux Haute Tension 1500 V DC (3.125 MVA MV Skid)',
        'Aérogénérateurs Synchrones Direct-Drive PMSG 4.5 MW',
        'Contrôleur de Centrale Réseau (Power Plant Controller - PPC)',
        'Poste de Transformation Élévateur de Parc 33 kV / 225 kV'
      ],
      primaryApparatusEn: [
        'N-Type TOPCon 650 Wp Bifacial Solar PV Modules',
        'Utility Central Inverter 1500 V DC Skid (3.125 MVA)',
        'Direct-Drive Permanent Magnet Wind Turbines (PMSG 4.5 MW)',
        'Master Power Plant Controller (PPC & Grid-Code Engine)',
        'Main Step-Up Substation Transformer 33 kV / 225 kV'
      ],
      equipmentIds: ['eq-inv-solar-01', 'eq-wind-pmsg-01', 'eq-ppc-controller-01', 'eq-bess-utility-50mw'],
      keyRatingsFr: [
        'Tension DC maximale de chaîne : 1500 V DC',
        'Rendement européen pondéré des onduleurs : η > 99.0%',
        'Temps de réponse de la régulation de tension réactive : < 200 ms',
        'Capacité de passage des creux de tension (LVRT) : 0% U pendant 150 ms sans déconnexion'
      ],
      keyRatingsEn: [
        'Maximum DC string voltage: 1500 V DC',
        'European weighted inverter efficiency: η > 99.0%',
        'Reactive voltage control response time: < 200 ms',
        'Low-Voltage Ride-Through (LVRT) capability: 0% U for 150 ms without tripping'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Simulation d\'ombrage 3D, pertes de mismatch, et calcul du Performance Ratio (PVSyst/DIgSILENT)',
        'Dimensionnement du réseau de câbles 33 kV (chute de tension < 1.5%, courant capacitif homopolaire)',
        'Étude d\'intégration dynamique EMT/RMS : tenue aux creux de tension LVRT et stabilité en petit signal'
      ],
      designCalculationsEn: [
        '3D shading, mismatch loss simulation, and Performance Ratio assessment (PVSyst/DIgSILENT)',
        '33 kV collector cable network sizing (voltage drop < 1.5%, zero-sequence charging capacitance)',
        'EMT/RMS dynamic grid impact studies: LVRT ride-through compliance and small-signal stability'
      ],
      protectionSchemesFr: [
        'ANSI 27/59 : Protection à minimum/maximum de tension au point de livraison commun (PCC)',
        'ANSI 81U/81O : Protection de sous/surfréquence avec rampe de délestage P(f) graduelle',
        'ANSI 78 / 81R : Détection d\'îlotage non intentionnel par dérivée de fréquence ROCOF (df/dt)',
        'ANSI 67N : Protection directionnelle homopolaire de terre sur le réseau de câbles 33 kV'
      ],
      protectionSchemesEn: [
        'ANSI 27/59: Undervoltage & overvoltage protection at Point of Common Coupling (PCC)',
        'ANSI 81U/81O: Under/overfrequency protection with progressive P(f) curtailment curves',
        'ANSI 78 / 81R: Unintentional islanding detection via Rate of Change of Frequency (ROCOF df/dt)',
        'ANSI 67N: Directional zero-sequence ground fault relaying on 33 kV underground cable loops'
      ],
      maintenancePracticesFr: [
        'Thermographie aérienne par drone avec caméra radiométrique infrarouge (détection des points chauds)',
        'Mesure de courbes I-V des chaînes de modules et contrôle d\'isolement DC continu (Riso > 1 MΩ)',
        'Nettoyage robotisé sans eau des panneaux en environnement sahélien/désertique'
      ],
      maintenancePracticesEn: [
        'Drone-based radiometric infrared thermal imaging for hot-spot detection on strings',
        'Field I-V curve tracing and continuous DC insulation resistance monitoring (Riso > 1 MΩ)',
        'Waterless automated robotic brush cleaning of PV modules in dusty Sahel environments'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'CEI 62109-1/2', titleFr: 'Sécurité des convertisseurs de puissance utilisés dans les systèmes photovoltaïques', titleEn: 'Safety of power converters for use in photovoltaic power systems' },
        { ref: 'IEEE 1547-2018', titleFr: 'Norme d\'interconnexion des ressources énergétiques décentralisées (DER)', titleEn: 'Standard for Interconnection and Interoperability of Distributed Energy Resources' },
        { ref: 'CEI 61400-21', titleFr: 'Aérogénérateurs - Mesure et évaluation des caractéristiques de qualité de l\'onde', titleEn: 'Wind energy generation systems - Measurement and assessment of electrical characteristics' },
        { ref: 'EN 50549-2', titleFr: 'Exigences pour les centrales génératrices raccordées en HTA aux réseaux de distribution', titleEn: 'Requirements for generating plants to be connected in parallel with distribution networks' }
      ],
      regulatoryBodiesFr: [
        'CIGRE Comité B4 (Électronique de Puissance et Systèmes DC/EnR)',
        'CIGRE Comité C6 (Réseaux de Distribution Actifs et Systèmes Décentralisés)',
        'ARSEL / SONATREL (Règlement Technique d\'Accès au Réseau Interconnecté Camerounais)'
      ],
      regulatoryBodiesEn: [
        'CIGRE Study Committee B4 (DC Systems & Power Electronics)',
        'CIGRE Study Committee C6 (Active Distribution Systems & Distributed Energy Resources)',
        'Electricity Sector Regulatory Agency (ARSEL) & SONATREL (Cameroon Grid Code)'
      ]
    },
    level5_relatedDomains: {
      D01: {
        domainCode: 'D01',
        relationshipTypeFr: 'Parc de Production',
        relationshipTypeEn: 'Bulk Generation Fleet',
        descriptionFr: 'Complète les centrales hydroélectriques de base et thermiques pour décarboner le mix énergétique.',
        descriptionEn: 'Complements base-load hydro and thermal fleet to decarbonize the national generation mix.'
      },
      D04: {
        domainCode: 'D04',
        relationshipTypeFr: 'Poste d\'Évacuation',
        relationshipTypeEn: 'Evacuation Substation',
        descriptionFr: 'Injecte la production des câbles 33 kV dans le poste élévateur HTB 90 kV ou 225 kV.',
        descriptionEn: 'Injects collector 33 kV power into high-voltage 90 kV or 225 kV evacuation substations.'
      },
      D10: {
        domainCode: 'D10',
        relationshipTypeFr: 'Stockage & Lissage',
        relationshipTypeEn: 'Storage & Smoothing',
        descriptionFr: 'Couple des batteries BESS pour absorber les variations d\'irradiation et fournir du report de charge.',
        descriptionEn: 'Pairs with BESS utility storage to smooth solar ramping and provide day-to-night energy shifting.'
      },
      D11: {
        domainCode: 'D11',
        relationshipTypeFr: 'Études Réseau & Découplage',
        relationshipTypeEn: 'Grid Studies & Protection',
        descriptionFr: 'Calibre les protections de découplage HTA/HTB face au faible courant de court-circuit des onduleurs.',
        descriptionEn: 'Sets anti-islanding and collector protections tailored to low short-circuit current of inverters.'
      },
      D14: {
        domainCode: 'D14',
        relationshipTypeFr: 'Harmoniques & Qualité Réseau',
        relationshipTypeEn: 'Harmonics & Power Quality',
        descriptionFr: 'Filtre les distorsions harmoniques de commutation MLI et garantit la conformité du THD < 3%.',
        descriptionEn: 'Attenuates PWM switching ripple and guarantees total harmonic distortion THD < 3%.'
      }
    }
  },
  D10: {
    level1_system: {
      titleFr: 'Systèmes de Stockage BESS, Électrochimie LFP & Infrastructures IRVE',
      titleEn: 'Utility Battery Storage (BESS), LFP Chemistry & High-Power EV Charging',
      summaryFr: 'Ce système régit le stockage massif d\'énergie électrochimique (BESS conteneurisé 1500 V DC) et sa restitution bidirectionnelle instantanée via des convertisseurs PCS réversibles (4 quadrants). Il assure la réserve primaire ultra-rapide (FFR < 120 ms), le lissage des rampes d\'énergies intermittentes, l\'inertie synthétique en mode Grid-Forming, et l\'alimentation des corridors autoroutiers de recharge rapide VE (IRVE 350 kW).',
      summaryEn: 'Governs utility-scale electrochemical energy storage (1500 V DC containerized BESS) and dynamic 4-quadrant bidirectional power flow through PCS inverters. Delivers Fast Frequency Response (FFR < 120 ms), solar ramp smoothing, virtual inertia (VSG) under Grid-Forming control, and heavy-duty transit EV fast charging hubs (350 kW).',
      physicsPrinciplesFr: [
        'Électrochimie d\'intercalation Lithium-Fer-Phosphate (LiFePO4) : réaction redox réversible sans dégagement d\'oxygène jusqu\'à 270°C',
        'Contrôle en source de tension virtuelle (Virtual Synchronous Generator) : modélisation de l\'équation d\'oscillation J·(dω/dt) = T_m - T_e',
        'Dynamique de transfert de charge et équation de Butler-Volmer pour les cinétiques d\'électrodes',
        'Équilibre thermique en refroidissement liquide forcé : loi de Fourier et convection forcée q = h·A·(T_cell - T_fluid)'
      ],
      physicsPrinciplesEn: [
        'Lithium Iron Phosphate (LiFePO4) intercalation electrochemistry: stable reversible redox reaction with zero oxygen release up to 270°C',
        'Virtual Synchronous Generator (VSG) voltage source control: synthesizing swing equation inertia J·(dω/dt) = Tm - Te',
        'Charge transfer kinetics and Butler-Volmer formulation for electrochemical battery electrodes',
        'Forced liquid cooling thermal equilibrium: Fourier conduction and convection balance q = h·A·(T_cell - T_fluid)'
      ],
      operatingVoltages: [
        '950 V – 1 500 V DC (Chaînes & Racks Batteries BESS)',
        '690 V AC (Sortie Convertisseurs Réversibles PCS)',
        '33 kV HTA (Réseau de Collecte & Évacuation BESS)',
        '150 V – 1 000 V DC / 500 A (Bornes IRVE Haute Puissance)'
      ],
      powerFlowTypeFr: 'Flux bidirectionnel réversible 4 quadrants (Charge/Décharge P ± 50 MW, Réactif dynamique inductif/capacitif Q ± 25 Mvar indépendant du SoC)',
      powerFlowTypeEn: 'Four-quadrant bidirectional power flow (Reversible P ± 50 MW, dynamic inductive/capacitive Q ± 25 Mvar decoupled from battery SoC)'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Conteneur BESS ISO 40 pieds climatisé avec Racks LFP 1500 V DC',
        'Convertisseur Bidirectionnel PCS 2.5 MVA Grid-Forming (VSG)',
        'Système de Gestion de Batterie (BMS à 3 niveaux : BMU esclave, BCU rack, Master BMS)',
        'Groupe de Refroidissement Liquide (Chiller eau-glycol) & Plaques Froides',
        'Transformateur Élévateur de Skid 690 V / 33 kV à Faibles Pertes',
        'Borne de Recharge Ultra-Rapide DC 350 kW (HPC) avec Câbles Refroidis'
      ],
      primaryApparatusEn: [
        '40ft ISO Temperature-Controlled Container with 1500 V DC LFP Racks',
        'Grid-Forming Bidirectional PCS Inverter Skid 2.5 MVA (VSG)',
        '3-Tier Battery Management System (Slave BMU, Rack BCU, Master BESS Controller)',
        'Liquid Cooling Chiller Unit (Water-glycol loop) & Direct Cold Plates',
        'Low-Loss 690 V / 33 kV Skid Step-Up Power Transformer',
        'High-Power 350 kW Ultra-Fast DC EV Charger with Liquid-Cooled Cables'
      ],
      equipmentIds: ['eq-bess-utility-50mw', 'eq-pcs-grid-forming-01', 'eq-bess-rack-lfp', 'eq-ev-charger-350kw'],
      keyRatingsFr: [
        'Puissance active nominale : 50 MW (injection / absorption réseau)',
        'Capacité de stockage d\'énergie : 100 MWh (taux C/2 - 2 heures)',
        'Temps de réponse en fréquence : < 120 ms (du repos à pleine puissance FFR)',
        'Rendement aller-retour AC-AC (RTE) : 88.5 % à pleine charge',
        'Tension assignée du bus DC : 1 331 V DC nominal (1 160 – 1 490 V DC)',
        'Puissance unitaire borne IRVE : 350 kW DC (500 A continus)'
      ],
      keyRatingsEn: [
        'Nominal active power: 50 MW (continuous injection / charging absorption)',
        'Usable energy capacity: 100 MWh (C/2 rate - 2 hours duration)',
        'Frequency response time: < 120 ms (from standby to full FFR rating)',
        'Round-trip AC-AC efficiency (RTE): 88.5 % at full load',
        'Rated DC bus voltage: 1,331 V DC nominal (1,160 – 1,490 V DC)',
        'EV charger unit capacity: 350 kW DC (500 A continuous liquid-cooled)'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Dimensionnement capacité/puissance (MWh/MW) selon les profils d\'injection solaire et les exigences FFR SONATREL',
        'Calcul d\'emballement thermique et surface d\'évents de déflagration selon NFPA 855 et essais UL 9540A',
        'Courant de court-circuit DC au jeu de barres 1500 V (CEI 61660-1 : pic i_p > 45 kA, constante de temps τ < 15 ms)',
        'Modélisation hydro-thermique en boucle liquide pour maintenir l\'écart cellule à ΔT < 2.5°C sous climat sahélien (45°C ext.)'
      ],
      designCalculationsEn: [
        'Energy and power capacity sizing (MWh/MW) tailored to solar ramping and national FFR reserve rules',
        'Thermal runaway propagation analysis and deflagration explosion vent sizing per NFPA 855 / UL 9540A',
        'DC short-circuit calculation on 1500 V bus per IEC 61660-1 (peak current ip > 45 kA, time constant τ < 15 ms)',
        'Liquid cooling hydro-thermal simulation to maintain cell divergence ΔT < 2.5°C in 45°C ambient Sahel climate'
      ],
      protectionSchemesFr: [
        'ANSI 81U/O : Détection ultra-rapide sous/sur-fréquence et commande FFR en boucle autonome (< 60 ms)',
        'ANSI 76 : Protection surintensité DC et déclenchement pyrotechnique instantané sur court-circuit interne (< 5 ms)',
        'ANSI 49B : Image thermique par cellule couplée aux détecteurs précurseurs multigaz (H2, CO, COV) et extinction Novec',
        'ANSI 64R : Contrôleur permanent d\'isolement du bus continu flottant 1500 V DC (alarme < 100 kΩ)',
        'ANSI 27/59 : Protection de tension au PCC avec tenue obligatoire aux creux de tension (LVRT) et surtensions (HVRT)'
      ],
      protectionSchemesEn: [
        'ANSI 81U/O: Ultra-fast under/overfrequency trigger with autonomous FFR injection (< 60 ms)',
        'ANSI 76: DC overcurrent and high-speed pyrotechnic disconnection on rack bolted fault (< 5 ms)',
        'ANSI 49B: Cell thermal replica coupled with early off-gas sensors (H2, CO, VOC) and Novec clean agent release',
        'ANSI 64R: Continuous insulation resistance monitor for 1500 V isolated DC bus (alarm < 100 kΩ)',
        'ANSI 27/59: Grid interface voltage protection enforcing Low/High Voltage Ride-Through (LVRT/HVRT) curves'
      ],
      maintenancePracticesFr: [
        'Test périodique de capacité et recalibration dynamique du SoC / SoH par cyclage complet contrôlé',
        'Analyse physico-chimique du caloporteur eau-glycol et contrôle de débit/pression des pompes de chiller',
        'Thermographie infrarouge étalonnée des bornes de raccordement DC 1500 V et modules de puissance PCS'
      ],
      maintenancePracticesEn: [
        'Periodic capacity testing and dynamic SoC/SoH recalibration via controlled full charge/discharge cycle',
        'Physicochemical analysis of water-glycol coolant and chiller pump pressure/flow diagnostics',
        'Calibrated radiometric infrared thermography of 1500 V DC busbar joints and PCS power modules'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'CEI 62933-5-2', titleFr: 'Systèmes de stockage d\'énergie électrique (EES) - Aspects de sécurité des systèmes BESS électrochimiques', titleEn: 'Electrical energy storage (EES) systems - Safety requirements for grid-integrated BESS' },
        { ref: 'NFPA 855', titleFr: 'Norme pour l\'installation des systèmes stationnaires de stockage d\'énergie', titleEn: 'Standard for the Installation of Stationary Energy Storage Systems' },
        { ref: 'CEI 62619', titleFr: 'Accumulateurs industriels - Exigences de sécurité pour les batteries au lithium', titleEn: 'Secondary lithium cells and batteries for use in industrial applications - Safety requirements' },
        { ref: 'IEEE 2800-2022', titleFr: 'Norme d\'interconnexion des ressources à base d\'onduleurs (IBR / Grid-Forming)', titleEn: 'Standard for Interconnection and Interoperability of Inverter-Based Resources' },
        { ref: 'ISO 15118', titleFr: 'Véhicules routiers - Interface de communication de recharge (Plug & Charge)', titleEn: 'Road vehicles - Vehicle to grid communication interface (Plug & Charge)' },
        { ref: 'CEI 61851-23', titleFr: 'Système de charge conductive pour véhicules électriques - Bornes de recharge DC', titleEn: 'Electric vehicle conductive charging system - DC electric vehicle charging station' }
      ],
      regulatoryBodiesFr: [
        'CIGRE Comité C6 (Systèmes Décentralisés & Stockage d\'Énergie)',
        'NFPA Energy Storage Technical Committee',
        'ARSEL / SONATREL (Cadre Réglementaire des Services Système BESS au Cameroun)'
      ],
      regulatoryBodiesEn: [
        'CIGRE Study Committee C6 (Active Distribution Systems & Energy Storage)',
        'NFPA Energy Storage Technical Committee',
        'ARSEL & SONATREL (Cameroon BESS Grid Integration & Ancillary Services Framework)'
      ]
    },
    level5_relatedDomains: {
      D02: {
        domainCode: 'D02',
        relationshipTypeFr: 'Stabilité & Architecture Réseau',
        relationshipTypeEn: 'Grid Stability & Architecture',
        descriptionFr: 'Fournit la réserve dynamique ultra-rapide (FFR) et l\'inertie virtuelle permettant de stabiliser le réseau sans faire appel aux groupes thermiques coûteux.',
        descriptionEn: 'Provides sub-second fast frequency response (FFR) and synthetic inertia to anchor network stability without firing up costly peaker units.'
      },
      D04: {
        domainCode: 'D04',
        relationshipTypeFr: 'Poste d\'Interconnexion HTA/HTB',
        relationshipTypeEn: 'Interconnection Substation',
        descriptionFr: 'Raccorde les transformateurs de skid BESS 690 V / 33 kV aux jeux de barres des postes de Garoua et Maroua.',
        descriptionEn: 'Connects BESS 690 V / 33 kV skid transformers to substation switchgear at Garoua and Maroua substations.'
      },
      D08: {
        domainCode: 'D08',
        relationshipTypeFr: 'Électronique de Puissance Réversible',
        relationshipTypeEn: 'Bidirectional Power Electronics',
        descriptionFr: 'Partage les lois de commande 4 quadrants, semi-conducteurs SiC/IGBT et algorithmes de machine synchrone virtuelle (VSG).',
        descriptionEn: 'Shares four-quadrant converter topologies, SiC/IGBT semiconductors, and Virtual Synchronous Generator (VSG) control.'
      },
      D09: {
        domainCode: 'D09',
        relationshipTypeFr: 'Lissage de Production Solaire',
        relationshipTypeEn: 'Renewable Smoothing & Firming',
        descriptionFr: 'Compense en temps réel les chutes soudaines de production des centrales solaires de Maroua et Guider lors des passages nuageux.',
        descriptionEn: 'Compensates instantaneous solar generation dropouts at Maroua and Guider solar farms during sudden cloud transits.'
      },
      D12: {
        domainCode: 'D12',
        relationshipTypeFr: 'Conduite Réseau SCADA / EMS',
        relationshipTypeEn: 'SCADA / EMS Central Dispatching',
        descriptionFr: 'Reçoit les consignes de puissance active/réactive et les autorisations de charge/décharge du dispatching national SONATREL.',
        descriptionEn: 'Receives active/reactive power setpoints and charge/discharge scheduling commands from the SONATREL national dispatching center.'
      }
    }
  },
  D11: {
    level1_system: {
      titleFr: 'Systèmes de Protection Numérique, Relais IED & Études de Réseau',
      titleEn: 'Digital Protection Systems, Numerical IEDs & Power System Studies',
      summaryFr: 'Ce système garantit la sécurité d\'exploitation et l\'intégrité des personnes et des matériels du réseau électrique en détectant, localisant et isolant sélectivement les défauts (courts-circuits, surcharges, déséquilibres, dérives de fréquence) en moins de 60 ms. Il intègre les relais numériques multifonctions (IEDs), l\'architecture de poste CEI 61850 (Station Bus MMS, GOOSE et Process Bus SV), les études de court-circuit CEI 60909 et la coordination sélective des courbes temps-courant (TCC).',
      summaryEn: 'Ensures personnel safety and equipment integrity across the power grid by selectively detecting, locating, and isolating faults (short-circuits, overloads, unbalance, frequency excursions) in under 60 ms. Integrates numerical multifunction IEDs, IEC 61850 substation architecture (Station Bus MMS, fast GOOSE, and Process Bus SV), IEC 60909 short-circuit analysis, and selective Time-Current Coordination (TCC).',
      physicsPrinciplesFr: [
        'Lois de Kirchhoff des courants (Loi des nœuds) : base de la protection différentielle unitaire Σ I_entrants = 0 en zone saine',
        'Composantes symétriques de Fortescue : décomposition en séquences directe (d), inverse (i) et homopolaire (0) pour analyser les défauts asymétriques',
        'Équations télégraphiques d\'ondes progressives et réflexion d\'onde pour la localisation de défaut ultra-rapide (< 5 ms)',
        'Théorie des arcs électriques et modélisation thermique selon l\'équation de balance d\'énergie d\'arc IEEE 1584'
      ],
      physicsPrinciplesEn: [
        'Kirchhoff\'s Current Law (KCL): foundation of unit differential protection where Σ I_in = 0 for healthy protected zones',
        'Fortescue symmetrical components: resolving unsymmetrical faults into positive (1), negative (2), and zero (0) sequence networks',
        'Telegrapher\'s travelling wave equations and wave reflections for sub-5 ms ultra-high-speed line fault pinpointing',
        'Electric arc flash physics and thermodynamic radiant heat balance modeling per IEEE 1584'
      ],
      operatingVoltages: [
        '225 kV HTB (Réseau d\'Évacuation & Interconnexion SONATREL)',
        '90 kV HTB (Sous-Transmission Régionale & Boucles Urbaines)',
        '30 kV / 15 kV HTA (Réseaux de Distribution Eneo)',
        '110 V / 220 V DC (Circuits Auxiliaires de Déclenchement Sécurisés)'
      ],
      powerFlowTypeFr: 'Supervision de grandeurs vectorielles (P, Q, I, V, angle de phase, impédance de boucle R + jX et sens d\'écoulement)',
      powerFlowTypeEn: 'Complex vector quantities monitoring (active/reactive power, phasor currents, voltages, R+jX apparent impedance loop, directional angles)'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Relais Différentiel Numérique Transformateur & Alternateur (ANSI 87T / 87G)',
        'Relais de Protection de Distance de Ligne 225 kV Multi-Zones (ANSI 21/21N & 67N)',
        'Contrôleur de Baie & IED Multifonction CEI 61850 (BCU)',
        'Unité de Fusion Process Bus Haute Tension (Merging Unit CEI 61869-9 / 61850-9-2LE)',
        'Transformateurs de Courant de Protection (TC classe 5P20, PX, TPX/TPY/TPZ)',
        'Transformateurs de Tension Inductifs et Capacitifs (TT / CVT)'
      ],
      primaryApparatusEn: [
        'Numerical Transformer & Generator Differential Relay (ANSI 87T / 87G)',
        '225 kV Multi-Zone Line Distance & Directional Earth Fault Relay (ANSI 21/21N & 67N)',
        'IEC 61850 Bay Controller & Multifunction Protection IED (BCU)',
        'High-Voltage Process Bus Merging Unit (IEC 61869-9 / IEC 61850-9-2LE)',
        'Protection Current Transformers (5P20, PX, transient TPX/TPY/TPZ classes)',
        'Inductive & Capacitive Voltage Transformers (VT / CVT)'
      ],
      equipmentIds: ['eq-relay-diff-87t', 'eq-relay-dist-21', 'eq-ied-relay-61850', 'eq-mu-61869-9'],
      keyRatingsFr: [
        'Temps de détection algorithmique : < 15 ms (défaut solide en Zone 1 ou Idiff élevé)',
        'Temps total d\'élimination (Relais + Disjoncteur SF6) : < 65 ms',
        'Latence d\'émission de télégramme GOOSE : < 2.5 ms (Classe de transfert rapide)',
        'Taux d\'échantillonnage Sampled Values : 4 000 Hz (80 éch./période) selon CEI 61869-9',
        'Précision d\'horodatage PTP IEEE 1588 : < 1 µs (Power Profile C37.238)',
        'Facteur limite de précision des TC : ALF ≥ 20 (Classe 5P20) avec Kssc dimensionné'
      ],
      keyRatingsEn: [
        'Algorithmic fault detection speed: < 15 ms (Zone 1 solid fault or high Idiff)',
        'Total fault clearing time (Relay + SF6 Breaker): < 65 ms',
        'GOOSE trip publication latency: < 2.5 ms (fastest transfer class)',
        'Sampled Values stream rate: 4,000 Hz (80 samples/cycle) per IEC 61869-9',
        'IEEE 1588 PTP timestamping accuracy: < 1 µs (Power Profile C37.238)',
        'CT Accuracy Limit Factor: ALF ≥ 20 (5P20 class) with coordinated Kssc'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Calcul des courants de court-circuit triphasé, biphasé et monophasé selon la norme CEI 60909 (Ik", ip, Ib, Ik)',
        'Coordination sélective chronométrique des courbes temps-courant (TCC) avec marge de sélectivité Δt ≥ 250 ms',
        'Calcul de non-saturation transitoire des TC de protection (tension de coude Vk, fardeau secondaire Rb, constante de temps Tp)',
        'Analyse de l\'énergie d\'arc électrique (Arc Flash) et frontière de sécurité selon IEEE 1584 et NFPA 70E',
        'Calcul des polygones de distance (R1, X1, RF) et compensation du facteur homopolaire de ligne k0 = (Z0 - Z1) / (3·Z1)'
      ],
      designCalculationsEn: [
        'Three-phase, line-to-line, and line-to-ground short-circuit calculations per IEC 60909 (Ik", ip, Ib, Ik)',
        'Selective Time-Current Coordination (TCC) grading margins with minimum discrimination step Δt ≥ 250 ms',
        'Protection CT transient saturation checking (knee-point voltage Vk, secondary burden Rb, network time constant Tp)',
        'Arc Flash incident energy and safety boundary analysis according to IEEE 1584 and NFPA 70E',
        'Line distance polygon reach sizing (R1, X1, RF) and zero-sequence compensation factor k0 = (Z0 - Z1) / (3·Z1)'
      ],
      protectionSchemesFr: [
        'ANSI 87T/87G/87B : Protection différentielle unitaire à pourcentage stabilisé avec retenue harmonique 2 et 5',
        'ANSI 21/21N : Protection de distance multi-zones avec schéma de téléaction POTT sur réseau optique OPGW',
        'ANSI 50/51 & 50N/51N : Surintensité instantanée et temporisée selon les courbes inverses normalisées CEI 60255',
        'ANSI 67/67N : Surintensité directionnelle de phase et de terre polarisée par tension résiduelle',
        'ANSI 81U/O & 81R : Délestage fréquentiel automatique par gradins (UFLS) avec blocage par gradient ROCOF (df/dt)',
        'ANSI 50BF : Protection défaillance disjoncteur avec réémission et déclenchement de barre de secours (< 150 ms)'
      ],
      protectionSchemesEn: [
        'ANSI 87T/87G/87B: Percentage-restrained unit differential protection with 2nd and 5th harmonic blocking',
        'ANSI 21/21N: Multi-zone line distance protection with permissive overreach transfer trip (POTT) over OPGW',
        'ANSI 50/51 & 50N/51N: Instantaneous and inverse-time overcurrent curves per IEC 60255 standard curves',
        'ANSI 67/67N: Directional phase and ground overcurrent polarized by residual zero-sequence voltage',
        'ANSI 81U/O & 81R: Underfrequency load shedding (UFLS) stages complemented by ROCOF rate-of-change supervision',
        'ANSI 50BF: Breaker failure protection with sequential re-trip and adjacent busbar strip (< 150 ms)'
      ],
      maintenancePracticesFr: [
        'Injection de courants et tensions secondaires via caisse d\'essais triphasée numérique étalonnée (ex. Omicron)',
        'Vérification de la polarité et du rapport de transformation des TC par test de saturation et mesure de fardeau réel',
        'Analyse des oscillographies de défaut au format Comtrade (IEEE C37.111) après chaque déclenchement réel'
      ],
      maintenancePracticesEn: [
        'Secondary current and voltage injection using calibrated automated three-phase test sets (e.g., Omicron)',
        'CT polarity, turns ratio, excitation knee-point curve, and real loop burden verification',
        'Post-mortem disturbance analysis using standardized IEEE C37.111 Comtrade oscillography records'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'CEI 60255', titleFr: 'Relais de mesure et dispositifs de protection (Série complète)', titleEn: 'Measuring relays and protection equipment (Full series)' },
        { ref: 'CEI 61850', titleFr: 'Réseaux et systèmes de communication pour l\'automatisation des compagnies d\'électricité', titleEn: 'Communication networks and systems for power utility automation' },
        { ref: 'CEI 60909', titleFr: 'Courants de court-circuit dans les réseaux triphasés à courant alternatif', titleEn: 'Short-circuit currents in three-phase a.c. systems' },
        { ref: 'IEEE 1584', titleFr: 'Guide pour la réalisation des calculs de risques d\'arc électrique', titleEn: 'Guide for Performing Arc-Flash Hazard Calculations' },
        { ref: 'CEI 61869-2', titleFr: 'Transformateurs de mesure - Exigences spécifiques pour les transformateurs de courant', titleEn: 'Instrument transformers - Additional requirements for current transformers' },
        { ref: 'IEEE C37.113', titleFr: 'Guide IEEE pour la protection des lignes de transport d\'énergie', titleEn: 'IEEE Guide for Protective Relay Applications to Transmission Lines' }
      ],
      regulatoryBodiesFr: [
        'CIGRE Comité B5 (Systèmes de Protection & Automatisation des Postes)',
        'IEEE Power System Relaying and Control Committee (PSRC)',
        'Direction du Dispatching & Études Réseau SONATREL (Cameroun)'
      ],
      regulatoryBodiesEn: [
        'CIGRE Study Committee B5 (Protection and Automation)',
        'IEEE Power System Relaying and Control Committee (PSRC)',
        'SONATREL Transmission System Operator & Protection Engineering Directorate'
      ]
    },
    level5_relatedDomains: {
      D02: {
        domainCode: 'D02',
        relationshipTypeFr: 'Stabilité & Architecture Réseau',
        relationshipTypeEn: 'Grid Architecture & Stability',
        descriptionFr: 'Fournit les niveaux de court-circuit amont (Sk), les impédances de Thévenin et les seuils de délestage UFLS.',
        descriptionEn: 'Supplies upstream short-circuit capacities (Sk), Thévenin grid equivalents, and UFLS load shedding setpoints.'
      },
      D03: {
        domainCode: 'D03',
        relationshipTypeFr: 'Lignes de Transport HTB 225 kV',
        relationshipTypeEn: '225 kV HV Transmission Lines',
        descriptionFr: 'Protège les portées aériennes contre la foudre par déclenchement sélectif monophasé et réenclenchement rapide ANSI 79.',
        descriptionEn: 'Protects overhead conductors against atmospheric flashovers with single-pole tripping and ANSI 79 auto-reclose.'
      },
      D04: {
        domainCode: 'D04',
        relationshipTypeFr: 'Postes Électriques & Appareillage',
        relationshipTypeEn: 'Substations & Switchgear',
        descriptionFr: 'Actionne les déclencheurs de disjoncteurs SF6, surveille les verrouillages de sécurité et pilote la protection barres 87B.',
        descriptionEn: 'Triggers SF6 breaker trip coils, enforces interlocking rules, and drives 87B busbar differential protection.'
      },
      D08: {
        domainCode: 'D08',
        relationshipTypeFr: 'Électronique de Puissance & FACTS',
        relationshipTypeEn: 'Power Electronics & FACTS',
        descriptionFr: 'Adapte les algorithmes de distance et de surintensité aux faibles courants de court-circuit des onduleurs solaires et FACTS.',
        descriptionEn: 'Tailors distance and overcurrent algorithms to the limited fault contributions of inverter-interfaced energy resources.'
      },
      D12: {
        domainCode: 'D12',
        relationshipTypeFr: 'Automatisation SCADA & Téléconduite',
        relationshipTypeEn: 'SCADA Automation & Substation Control',
        descriptionFr: 'Transmet les télémesures, alarmes de déclenchement, comptes-rendus d\'événements (SOE) et fichiers oscillographiques Comtrade.',
        descriptionEn: 'Feeds real-time telemetries, trip alarms, Sequence of Events (SOE), and Comtrade disturbance records to SCADA.'
      }
    }
  },

  D12: {
    level1_system: {
      titleFr: 'Système d\'Automatisation de Poste (SAS), Téléconduite SCADA & Instrumentation de Tranche',
      titleEn: 'Substation Automation Systems (SAS), SCADA Telecontrol & Bay Instrumentation',
      summaryFr: 'Ce domaine traite de l\'infrastructure numérique temps réel assurant la supervision, le verrouillage sécurisé, la télémesure et la télécommande des postes électriques et réseaux de distribution. Il englobe les contrôleurs de tranche (BCU), les passerelles RTU, les protocoles télécoms normalisés (CEI 61850 MMS/GOOSE, CEI 60870-5-104) et les liaisons vers le Dispatching National de Conduite de SONATREL.',
      summaryEn: 'This domain encompasses the mission-critical real-time digital infrastructure providing supervision, safety interlocking, telemetry, and telecontrol of high-voltage substations and grids. It encompasses Bay Control Units (BCUs), RTU gateways, standardized telecontrol protocols (IEC 61850 MMS/GOOSE, IEC 60870-5-104), and high-availability links to the National Load Dispatch Center.',
      physicsPrinciplesFr: [
        'Théorie de l\'information de Shannon & intégrité des télémesures (temps de latence, gigue, rapport signal sur bruit)',
        'Logique combinatoire et séquentielle booléenne d\'interverrouillage de sécurité (anti-manœuvre en charge)',
        'Filtrage numérique anti-rebond (debounce) et horodatage événementiel SOE avec résolution milliseconde',
        'Redondance réseau sans coupure à tolérance de panne instantanée (Zéro temps de recouvrement bumpless PRP/HSR)'
      ],
      physicsPrinciplesEn: [
        'Shannon information theory and telemetry data integrity (latency, jitter, SNR margins)',
        'Boolean sequential and combinational safety interlocking logic (precluding on-load disconnector operation)',
        'Digital contact chatter debounce filtering and 1 ms sequence of events (SOE) timestamp resolution',
        'Bumpless zero-recovery time dual-homed industrial network redundancy (IEC 62439-3 PRP/HSR)'
      ],
      operatingVoltages: ['110 V DC (Alimentation contrôle)', '220 V AC (Auxiliaires)', '24 V DC (Télécoms)', 'Postes 225 kV / 110 kV / 30 kV'],
      powerFlowTypeFr: 'Flux bidirectionnel d\'informations numériques temps réel, télécommandes chiffrées et télésignalisations',
      powerFlowTypeEn: 'Bidirectional real-time digital telecontrol flow, encrypted telecommands, and double-point statuses'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Contrôleur numérique de tranche / travée (BCU - Bay Control Unit)',
        'Passerelle de téléconduite & concentrateur de données (RTU - Remote Terminal Unit)',
        'Commutateurs Ethernet durcis managés avec interfaces redondantes (PRP/HSR RedBox)',
        'Serveurs SCADA redondants & IHM tactile locale de tranche',
        'Horloge mère GPS Grandmaster PTP (IEEE 1588v2) & IRIG-B',
        'Transducteurs de mesure numériques multifonctions (U, I, P, Q, f, cos φ)'
      ],
      primaryApparatusEn: [
        'Digital Bay Control Unit (BCU)',
        'Substation RTU Gateway & Data Concentrator',
        'Hardened Managed Ethernet Switches with Redundancy (PRP/HSR RedBox)',
        'Redundant Industrial SCADA Servers & Bay Touchscreen HMIs',
        'Substation GPS Grandmaster PTP Time Server (IEEE 1588v2) & IRIG-B',
        'Multifunction Digital Measurement Transducers (V, I, P, Q, f, PF)'
      ],
      equipmentIds: ['eq-trafo-hta-01', 'eq-disj-225-sf6', 'eq-relais-num-01', 'eq-transfo-sec-01'],
      keyRatingsFr: [
        'Tension auxiliaire de contrôle : 110 V DC ± 20% sur banc de batteries étanche',
        'Résolution chronologique d\'horodatage (SOE) : ≤ 1.0 ms synchronisée GPS',
        'Temps de basculement réseau sur rupture fibre (PRP CEI 62439-3) : 0 ms (zéro paquet perdu)',
        'Isolation diélectrique des entrées binaires : 2.5 kV RMS / 5 kV choc impulsionnel',
        'Bande passante bus de station : 1 Gbps optique duplex multimode/monomode'
      ],
      keyRatingsEn: [
        'Control auxiliary voltage: 110 V DC ± 20% backed by sealed station batteries',
        'Sequence of Events (SOE) timestamp resolution: ≤ 1.0 ms GPS-synchronized',
        'Network failover upon fiber breakage (PRP IEC 62439-3): 0 ms (bumpless, zero packet loss)',
        'Dielectric insulation on binary inputs: 2.5 kV RMS / 5 kV impulse withstand',
        'Station bus optical bandwidth: 1 Gbps full-duplex multimode/single-mode'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Calcul du temps de transit et de gigue des trames GOOSE et MMS sur le bus de station',
        'Dimensionnement des capacités de charge des entrées binaires et résistance d\'atténuation capacitive',
        'Élaboration des matrices d\'interverrouillage logique de poste (équations booléennes d\'exploitation)',
        'Bilan de consommation électrique du contrôle-commande pour dimensionnement des batteries 110 V DC',
        'Cartographie d\'adressage des points d\'information (IOA) selon le protocole CEI 60870-5-104'
      ],
      designCalculationsEn: [
        'Network latency and jitter budget calculation for GOOSE and MMS traffic on station bus',
        'Binary input capacitive discharge threshold calculation to suppress phantom induced voltages',
        'Development of comprehensive station Boolean interlocking truth tables and safety sequences',
        'DC auxiliary load balance calculation for 110 V DC station battery and charger sizing',
        'Information Object Address (IOA) mapping design per IEC 60870-5-104 telecontrol standards'
      ],
      protectionSchemesFr: [
        'Surveillance permanente du circuit de déclenchement (Trip Circuit Supervision - ANSI 74 / TCS)',
        'Verrouillage matériel et logiciel d\'anti-manœuvre en charge des sectionneurs (ANSI 89L)',
        'Contrôle automatique de synchronisme avant fermeture de disjoncteur (ANSI 25)',
        'Procédure de télécommande sécurisée "Sélectionner Avant d\'Exécuter" (Select-Before-Operate - SBO)',
        'Surveillance de l\'intégrité des communications par messages d\'interrogation cyclique (Test APDU)'
      ],
      protectionSchemesEn: [
        'Trip circuit continuous supervision in both open and closed breaker states (ANSI 74 / TCS)',
        'Hardwired and software-enforced on-load disconnector opening interlocks (ANSI 89L)',
        'Automatic synchro-check verification prior to closing interconnecting breakers (ANSI 25)',
        'Cryptographically enforced Select-Before-Operate (SBO) telecommand protocol',
        'Communication keep-alive heartbeat and channel monitoring via periodic test APDUs'
      ],
      maintenancePracticesFr: [
        'Audit annuel de la synchronisation PTP et vérification de la dérive de l\'oscillateur en mode roue libre',
        'Test d\'injection d\'ordres de télécommande simulés en mode d\'isolement test (Test Bit CEI 61850)',
        'Vérification thermographique des alimentations à découpage et convertisseurs DC/DC des armoires CCN',
        'Contrôle de l\'intégrité des liaisons optiques par réflectométrie optique dans le domaine temporel (OTDR)',
        'Mise à jour et signature des firmwares selon les politiques de gestion des vulnérabilités CEI 62351'
      ],
      maintenancePracticesEn: [
        'Annual audit of PTP time sync accuracy and verification of oscillator holdover drift stability',
        'Simulated telecommand testing utilizing IEC 61850 test-mode flags to prevent accidental primary operations',
        'Infrared thermographic inspections of switchmode DC/DC power supplies inside control cubicles',
        'Optical fiber link attenuation and continuity verification using OTDR reflectometry',
        'Cryptographic firmware validation and vulnerability patching aligned with IEC 62351 guidelines'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'CEI 61850-3', titleFr: 'Réseaux et systèmes de communication pour l\'automatisation des services de distribution d\'énergie - Exigences générales', titleEn: 'Communication networks and systems for power utility automation - General requirements' },
        { ref: 'CEI 60870-5-104', titleFr: 'Matériels et systèmes de téléconduite - Accès réseau pour la CEI 60870-5-101 utilisant des profils de transport normalisés', titleEn: 'Telecontrol equipment and systems - Network access for IEC 60870-5-101 using standard transport profiles' },
        { ref: 'CEI 62439-3', titleFr: 'Réseaux de communication industriels de haute disponibilité - Protocoles PRP et HSR', titleEn: 'Industrial communication networks - High availability automation networks - PRP and HSR' },
        { ref: 'CEI 62351', titleFr: 'Gestion des systèmes de puissance et échanges d\'informations associées - Sécurité des données et des communications', titleEn: 'Power systems management and associated information exchange - Data and communications security' },
        { ref: 'IEEE 1613', titleFr: 'Exigences environnementales et d\'essais pour les dispositifs de réseau de communication dans les postes électriques', titleEn: 'IEEE Standard Environmental and Testing Requirements for Communications Networking Devices Installed in Electric Power Substations' }
      ],
      regulatoryBodiesFr: [
        'CIGRE Comité B5 (Systèmes de Protection & Contrôle-Commande des Postes)',
        'SONATREL - Direction du Dispatching National & des Systèmes Télécoms (Cameroun)',
        'ARSEL - Agence de Régulation du Secteur de l\'Électricité du Cameroun'
      ],
      regulatoryBodiesEn: [
        'CIGRE Study Committee B5 (Protection and Automation)',
        'SONATREL - National Dispatching Center & Telecom Systems Directorate (Cameroon)',
        'ARSEL - Electricity Sector Regulatory Agency of Cameroon'
      ]
    },
    level5_relatedDomains: {
      D04: {
        domainCode: 'D04',
        relationshipTypeFr: 'Postes Électriques & Appareillage',
        relationshipTypeEn: 'Substations & Switchgear',
        descriptionFr: 'Acquiert l\'état des disjoncteurs et sectionneurs motorisés et commande leurs bobines d\'enclenchement/déclenchement.',
        descriptionEn: 'Gathers positional feedback from circuit breakers and motor-driven switches and fires trip/close actuators.'
      },
      D11: {
        domainCode: 'D11',
        relationshipTypeFr: 'Protection & Relais Numériques',
        relationshipTypeEn: 'Protection & Digital Relays',
        descriptionFr: 'Réceptionne les ordres de déclenchement rapide, les trames d\'alarme et les enregistrements oscilloperturbographiques Comtrade.',
        descriptionEn: 'Receives high-speed trip indications, general alarm telegrams, and Comtrade fault disturbance records.'
      },
      D13: {
        domainCode: 'D13',
        relationshipTypeFr: 'Télécommunications & Câbles OPGW',
        relationshipTypeEn: 'Telecommunications & OPGW Cables',
        descriptionFr: 'Fournit le support physique WAN (fibres OPGW et multiplexeurs MPLS) pour acheminer les trames de téléconduite 104 vers le dispatching.',
        descriptionEn: 'Provides optical WAN transport (OPGW fiber and MPLS routers) routing IEC 60870-5-104 packets to the national center.'
      },
      D02: {
        domainCode: 'D02',
        relationshipTypeFr: 'Architecture & Stabilité Réseau',
        relationshipTypeEn: 'Grid Architecture & Stability',
        descriptionFr: 'Injecte les flux de télémesures en temps réel (MW, Mvar, kV, Hz) dans les calculateurs d\'estimation d\'état du SCADA/EMS.',
        descriptionEn: 'Feeds live telemetry streams (MW, Mvar, kV, Hz) directly into SCADA/EMS state estimation and contingency engines.'
      },
      D10: {
        domainCode: 'D10',
        relationshipTypeFr: 'Stockage d\'Énergie BESS',
        relationshipTypeEn: 'Energy Storage & Charging',
        descriptionFr: 'Transmet les consignes de régulation de puissance active/réactive et les ordres d\'injection de réserve rapide (FFR).',
        descriptionEn: 'Transmits dynamic active/reactive power dispatch setpoints and fast frequency response triggers to battery PCS.'
      }
    }
  },

  D13: {
    level1_system: {
      titleFr: 'Réseau de Télécommunications Haute Tension, Câbles OPGW & Technologies Opérationnelles (OT)',
      titleEn: 'High-Voltage Utility Telecommunications, OPGW Fiber & Operational Technology (OT)',
      summaryFr: 'Ce domaine traite de l\'infrastructure de télécommunication industrielle déterministe et ultra-fiable reliant les postes électriques, les centrales de production et le Dispatching National de Conduite de SONATREL. Il couvre les câbles de garde à fibres optiques (OPGW), les réseaux optiques de transport déterministes (MPLS-TP, SDH/SONET), les canaux de téléprotection différentielle normalisés (IEEE C37.94), les liaisons de secours par faisceaux hertziens (FH) et le chiffrement cybersécurisé OT selon la CEI 62351.',
      summaryEn: 'This domain covers the mission-critical, deterministic, ultra-reliable utility telecommunication backbone interconnecting power substations, generating stations, and the SONATREL National Load Dispatch Center. It encompasses Optical Ground Wire (OPGW) cable infrastructure, deterministic packet-optical transport networks (MPLS-TP, SDH/SONET), standardized teleprotection channels (IEEE C37.94), backup microwave radio links, and OT cybersecurity encryption per IEC 62351.',
      physicsPrinciplesFr: [
        'Guidage optique par réflexion totale interne et diffusion de Rayleigh dans la silice (atténuation spectrale 0.20-0.35 dB/km)',
        'Dispersion chromatique et dispersion modale de polarisation (PMD) limitant la portée à très haut débit',
        'Théorème de Shannon-Hartley & calcul de rapport signal sur bruit optique (OSNR)',
        'Propagation électromagnétique en espace libre et équation de bilan de liaison hertzienne de Friis (Fading de Rayleigh)'
      ],
      physicsPrinciplesEn: [
        'Total internal reflection waveguiding and Rayleigh scattering in fused silica (spectral attenuation 0.20-0.35 dB/km)',
        'Chromatic dispersion and polarization mode dispersion (PMD) setting transmission distance limits',
        'Shannon-Hartley channel capacity theorem & Optical Signal-to-Noise Ratio (OSNR) budget',
        'Free-space electromagnetic propagation and Friis microwave link path budget (Rayleigh multipath fading)'
      ],
      operatingVoltages: ['48 V DC (Alimentation télécom secourue)', '220 V AC (Redresseurs)', 'Fibre optique 1310/1550 nm', 'Faisceaux hertziens 7 GHz / 13 GHz'],
      powerFlowTypeFr: 'Flux numérique bidirectionnel multiplexé à très faible latence (< 5 ms pour téléprotection, < 15 ms pour SCADA)',
      powerFlowTypeEn: 'Bidirectional multiplexed deterministic digital stream with sub-5ms teleprotection and sub-15ms SCADA latency'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Câble de garde à fibres optiques (OPGW - Optical Ground Wire 24/48 FO)',
        'Tiroir de répartition optique de poste (ODF - Optical Distribution Frame)',
        'Nœud de transport optique hybride SDH / Packet Optical MPLS-TP durci',
        'Interface optique de téléprotection normalisée IEEE C37.94',
        'Routeur WAN industriel durci avec accélérateur de chiffrement (IPsec / MACsec)',
        'Faisceau hertzien numérique secours (IDU / ODU avec parabole haute directivité)',
        'Atelier d\'énergie 48 V DC télécom avec redresseurs modulaires et banc batteries 10h'
      ],
      primaryApparatusEn: [
        'Optical Ground Wire cable with stainless steel loose tube (OPGW 24/48 fibers)',
        'Substation Optical Distribution Frame (ODF) & Patch Panels',
        'Hardened Hybrid SDH / Packet Optical MPLS-TP Transport Node',
        'Standardized IEEE C37.94 Optical Teleprotection Interface',
        'Industrial Ruggedized WAN Router with Hardware Encryption Engine (IPsec / MACsec)',
        'Digital Microwave Backup Radio (Indoor IDU / Outdoor ODU with high-gain dish)',
        '48 V DC Telecom Power Supply Plant with Modular Rectifiers and 10h Battery Bank'
      ],
      equipmentIds: ['eq-trafo-hta-01', 'eq-relais-num-01', 'eq-disj-225-sf6'],
      keyRatingsFr: [
        'Atténuation linéique optique OPGW : ≤ 0.22 dB/km à 1550 nm (fibre monomode ITU-T G.652D)',
        'Temps de basculement de tunnel MPLS-TP 1:1 : < 50 ms (zéro perte de synchronisation)',
        'Latence unidirectionnelle canal téléprotection IEEE C37.94 : ≤ 5.0 ms avec gigue < 0.1 ms',
        'Asymétrie de temps de propagation aller-retour (Tx/Rx) : ≤ 0.20 ms (exigence ANSI 87L)',
        'Tension atelier énergie télécom : 48 V DC flottant avec autonomie sur batterie ≥ 10 heures'
      ],
      keyRatingsEn: [
        'OPGW linear optical attenuation: ≤ 0.22 dB/km at 1550 nm (ITU-T G.652D single-mode fiber)',
        'MPLS-TP 1:1 tunnel failover protection switching: < 50 ms (bumpless synchronization)',
        'IEEE C37.94 one-way teleprotection channel propagation latency: ≤ 5.0 ms with jitter < 0.1 ms',
        'Round-trip propagation asymmetry (Tx/Rx delay skew): ≤ 0.20 ms (ANSI 87L differential mandate)',
        'Substation telecom power supply: 48 V DC floating with emergency battery reserve ≥ 10 hours'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Calcul du bilan de puissance optique de liaison (pertes fibres, épissures, connecteurs et marge de vieillissement)',
        'Calcul du temps de transit de phase et compensation de l\'asymétrie pour relais différentiels de ligne 87L',
        'Bilan de liaison faisceau hertzien selon les recommandations UIT-R P.530 (marge de fading thermique et pluie)',
        'Dimensionnement du parc de batteries 48 V DC télécom et calcul de la capacité Ah selon la norme IEEE 485',
        'Modélisation de la qualité de service (QoS) : allocation CIR/EIR stricte pour téléprotection vs SCADA'
      ],
      designCalculationsEn: [
        'Optical link power loss budget calculation (fiber attenuation, fusion splices, patch connectors, aging margin)',
        'Phase propagation latency calculation and round-trip delay skew compensation for line differential relays (87L)',
        'Microwave link budget modeling per ITU-R P.530 (thermal fade margin, multi-path fading, and rain attenuation)',
        '48 V DC telecom battery bank sizing and Ah capacity derivation according to IEEE 485 standards',
        'Quality of Service (QoS) engineering: strict CIR/EIR allocation guaranteeing zero packet drop for teleprotection'
      ],
      protectionSchemesFr: [
        'Protection de chemin de transport MPLS-TP 1:1 / 1+1 par basculement matériel BFD < 50 ms',
        'Surveillance de perte de synchronisation trame IEEE C37.94 (Yellow Alarm / Loss of Frame)',
        'Chiffrement matériel de trame MACsec (IEEE 802.1AE) et tunnels IPsec pour flux CEI 60870-5-104',
        'Relève automatique de lien sur faisceau hertzien de secours par routage dynamique OSPF/BFD',
        'Détection d\'intrusion et de courbure de fibre par réflectométrie optique continue intégrée (OTDR)'
      ],
      protectionSchemesEn: [
        '1:1 and 1+1 MPLS-TP linear path protection switching via hardware-accelerated BFD in under 50 ms',
        'Continuous frame alignment and synchronization supervision for IEEE C37.94 (Yellow Alarm / LOF detection)',
        'Line-rate hardware frame encryption using MACsec (IEEE 802.1AE) and IPsec tunnels for SCADA telemetry',
        'Automatic routing failover to microwave backup links driven by sub-second BFD-triggered dynamic OSPF',
        'In-line intrusion and microbending detection via continuous embedded Optical Time Domain Reflectometry (OTDR)'
      ],
      maintenancePracticesFr: [
        'Campagne annuelle de réflectométrie optique OTDR bi-longueur d\'onde (1310 nm / 1550 nm) sur les 48 brins OPGW',
        'Test de taux d\'erreur binaire (BERT) et mesure de gigue sur canaux 2 Mbps selon l\'ITU-T O.151 / RFC 2544',
        'Contrôle de l\'impédance interne et test de décharge sous charge réelle des bancs batteries 48 V DC',
        'Inspection des boîtes d\'épissures sur pylônes 225 kV (étanchéité, rayon de courbure des cassettes de lovage)',
        'Vérification de la puissance optique d\'émission et de réception des modules SFP via télémétrie DDM/DOM'
      ],
      maintenancePracticesEn: [
        'Annual dual-wavelength OTDR reflectometry testing (1310 nm / 1550 nm) across all 48 OPGW fiber strands',
        'Bit Error Rate Testing (BERT) and packet jitter measurements on 2 Mbps circuits per ITU-T O.151 / RFC 2544',
        'Internal battery resistance conductance testing and controlled discharge verification on 48 V DC battery strings',
        'Field inspection of tower splice boxes on 225 kV lines (watertight gasket integrity, fiber coil bend radius)',
        'Real-time optical transmit and receive power monitoring on SFP modules utilizing Digital Diagnostic Monitoring (DDM)'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'ITU-T G.652D', titleFr: 'Caractéristiques d\'un câble et d\'une fibre optique unimodale standard', titleEn: 'Characteristics of a single-mode optical fibre and cable' },
        { ref: 'IEEE C37.94', titleFr: 'Norme d\'interface optique n x 64 kbps pour équipements de téléprotection et multiplexeurs', titleEn: 'Standard for N times 64 kbps Optical Fiber Interfaces between Teleprotection and Multiplexer Equipment' },
        { ref: 'CEI 62351-3/9', titleFr: 'Sécurité des données et des communications pour la gestion des systèmes électriques (Chiffrement & Gestion des clés)', titleEn: 'Power systems management and associated information exchange - Data and communications security (TCP/IP & Key Management)' },
        { ref: 'ITU-T G.8113.1', titleFr: 'Opérations, administration et maintenance pour réseaux de transport par paquets MPLS-TP', titleEn: 'Operations, administration and maintenance mechanisms for MPLS-TP in packet transport networks' },
        { ref: 'IEEE 1613', titleFr: 'Exigences environnementales et d\'essais pour les dispositifs de télécommunication dans les postes électriques', titleEn: 'Standard Environmental and Testing Requirements for Communications Networking Devices Installed in Electric Power Substations' }
      ],
      regulatoryBodiesFr: [
        'CIGRE Comité D2 (Systèmes d\'information et télécommunications pour les réseaux électriques)',
        'UIT-T / UIT-R (Union Internationale des Télécommunications)',
        'ART Cameroun (Agence de Régulation des Télécommunications)'
      ],
      regulatoryBodiesEn: [
        'CIGRE Study Committee D2 (Information Systems and Telecommunication for Power Utilities)',
        'ITU-T / ITU-R (International Telecommunication Union)',
        'ART Cameroon (Telecommunications Regulatory Agency)'
      ]
    },
    level5_relatedDomains: {
      D03: {
        domainCode: 'D03',
        relationshipTypeFr: 'Lignes de Transport & Pylônes',
        relationshipTypeEn: 'Transmission Lines & Towers',
        descriptionFr: 'Le câble OPGW est installé en sommet de pylônes 225 kV / 110 kV, servant simultanément de fil de garde anti-foudre et de support fibre.',
        descriptionEn: 'OPGW is strung at the apex of 225 kV / 110 kV lattice towers, serving concurrently as lightning shield and optical backbone.'
      },
      D11: {
        domainCode: 'D11',
        relationshipTypeFr: 'Protection & Relais Numériques',
        relationshipTypeEn: 'Protection & Digital Relays',
        descriptionFr: 'Fournit le canal déterministe ultra-rapide IEEE C37.94 pour la protection différentielle de ligne 87L et le télé-déclenchement direct.',
        descriptionEn: 'Provides the deterministic ultra-low-latency IEEE C37.94 optical pipe for line differential 87L and direct transfer tripping.'
      },
      D12: {
        domainCode: 'D12',
        relationshipTypeFr: 'Automatisation & SCADA',
        relationshipTypeEn: 'Automation & SCADA Control',
        descriptionFr: 'Transporte les flux de téléconduite CEI 60870-5-104 et synchronise les horloges PTP IEEE 1588v2 de tous les postes du réseau.',
        descriptionEn: 'Carries IEC 60870-5-104 SCADA traffic and distributes IEEE 1588v2 PTP boundary clock synchronization to all substations.'
      },
      D02: {
        domainCode: 'D02',
        relationshipTypeFr: 'Architecture & Dispatching National',
        relationshipTypeEn: 'Grid Architecture & Dispatching',
        descriptionFr: 'Relie les postes d\'interconnexion stratégiques au Dispatching National de Conduite (CNC Yaoundé / Douala) de SONATREL.',
        descriptionEn: 'Interconnects major strategic substations with SONATREL national grid control centers (CNC Yaoundé / Douala).'
      },
      D04: {
        domainCode: 'D04',
        relationshipTypeFr: 'Postes Électriques & Appareillage',
        relationshipTypeEn: 'Substations & Switchgear',
        descriptionFr: 'Héberge les répartiteurs optiques ODF, les châssis MPLS-TP et les ateliers d\'énergie 48 V DC dans le bâtiment de commande.',
        descriptionEn: 'Houses optical distribution frames (ODF), MPLS-TP racks, and 48 V DC telecom battery systems in the control building.'
      }
    }
  },

  D14: {
    level1_system: {
      titleFr: 'Qualité de l\'Onde Électrique, Harmoniques, Compatibilité Électromagnétique (CEM) & Stabilité Dynamique',
      titleEn: 'Power Quality, Harmonic Pollution, Electromagnetic Compatibility (EMC) & Dynamic Grid Stability',
      summaryFr: 'Ce domaine traite de la pureté de la tension et du courant alternatif, du contrôle des distorsions harmoniques (THD), de l\'atténuation des creux de tension (sags) et surtensions temporaires, du papillotement (flicker Pst/Plt), du déséquilibre de phase (u2) et de la compatibilité électromagnétique (CEM) en environnement de poste et industriel haute tension. Il couvre les systèmes de compensation dynamique (STATCOM, SVC), les filtres actifs et passifs, les analyseurs de qualité d\'onde Classe A (CEI 61000-4-30) et l\'immunité contre les transitoires rapides et décharges électrostatiques.',
      summaryEn: 'This domain addresses AC voltage and current waveform purity, harmonic distortion mitigation (THD), voltage sag/swell ride-through, flicker suppression (Pst/Plt), negative-sequence unbalance (u2), and high-voltage substation electromagnetic compatibility (EMC). It encompasses dynamic reactive compensation (STATCOM, SVC), active and passive harmonic filters, Class A power quality analyzers (IEC 61000-4-30), and shielding immunity against fast transient bursts (EFT) and lightning surges.',
      physicsPrinciplesFr: [
        'Décomposition spectrale de Fourier des signaux périodiques non-linéaires et calcul des harmoniques pairs/impairs',
        'Théorie de la puissance réactive instantanée p-q d\'Akagi et repère tournant d-q (transformation de Park)',
        'Composantes symétriques de Fortescue (directe, inverse, homopolaire) pour la quantification des déséquilibres',
        'Mécanismes de couplage électromagnétique : capacitif, inductif, galvanique par impédance commune et champ rayonné'
      ],
      physicsPrinciplesEn: [
        'Fourier series spectral decomposition of non-linear waveforms and even/odd harmonic ranking',
        'Akagi instantaneous active and reactive p-q power theory and d-q rotating frame (Park transformation)',
        'Fortescue symmetrical sequence components (positive, negative, zero) for phase unbalance assessment',
        'Electromagnetic coupling mechanisms: capacitive, inductive, common-impedance galvanic, and radiated RF fields'
      ],
      operatingVoltages: ['225 kV / 110 kV (Transport HTB)', '30 kV / 15 kV (Distribution HTA)', '400 V / 230 V (Basse Tension)', '±800 V DC (Bus continu convertisseurs APF/STATCOM)'],
      powerFlowTypeFr: 'Flux bidirectionnel de puissance réactive dynamique (±Q Mvar) et injection de courants harmoniques d\'opposition (-Ih)',
      powerFlowTypeEn: 'Dynamic bidirectional reactive power injection (±Q Mvar) and counter-phase harmonic cancellation currents (-Ih)'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Compensateur Statique Synchrone (STATCOM à chaîne MMC / IGBT 3-niveaux)',
        'Filtre Actif Parallèle (APF / Shunt Active Power Filter) pour injection anti-harmonique',
        'Filtre Harmonique Passif accordé (LC série / filtre passe-haut amorti de type C)',
        'Analyseur de Qualité d\'Énergie certifié Classe A selon la CEI 61000-4-30 Ed. 3',
        'Compensateur Statique de Déphasage & Flicker (SVC à thyristors TCR / TSC)',
        'Transformateur d\'Isolement à Écran Électrostatique mis à la terre (K-Factor 13 / 20)',
        'Dispositifs de Protection contre les Surtensions Transitoires (Parafoudres SPD Type 1+2)'
      ],
      primaryApparatusEn: [
        'Static Synchronous Compensator (STATCOM with MMC / 3-Level NPC IGBTs)',
        'Shunt Active Power Filter (APF) for selective counter-harmonic cancellation',
        'Tuned Passive Harmonic Filter (Series LC trap / C-type damped high-pass filter)',
        'Certified Class A Power Quality Analyzer per IEC 61000-4-30 Ed. 3',
        'Static Var Compensator (SVC with thyristor-controlled reactors TCR and switched capacitors TSC)',
        'Electrostatic Shielded Isolation Transformer (K-Factor 13 / 20)',
        'Surge Protective Devices (SPD Type 1+2 surge arresters)'
      ],
      equipmentIds: ['eq-statcom-01', 'eq-relais-num-01', 'eq-trafo-hta-01'],
      keyRatingsFr: [
        'Taux de Distorsion Harmonique Global en tension (THDu) : ≤ 5.0% au point de livraison HTA/HTB (IEEE 519 / CEI 61000-2-4)',
        'Sévérité du Flicker : Pst ≤ 1.0 (court terme 10 min) et Plt ≤ 0.8 (long terme 2 heures)',
        'Temps de réponse dynamique STATCOM : < 20 ms (sub-cycle) pour correction de tension et soutien de puissance réactive',
        'Précision de mesure analyseur Classe A : incertitude < 0.1% sur tension nominale et < 1 ms sur horodatage synchrone',
        'Capacité d\'atténuation filtre actif : suppression jusqu\'au rang 50 avec compensation sélective configurable'
      ],
      keyRatingsEn: [
        'Total Harmonic Voltage Distortion (THDu): ≤ 5.0% at high-voltage PCC (IEEE 519 / IEC 61000-2-4)',
        'Flicker Severity Limits: Pst ≤ 1.0 (10-min short term) and Plt ≤ 0.8 (2-hour long term)',
        'STATCOM dynamic response time: < 20 ms (sub-cycle) for voltage dip ride-through and reactive support',
        'Class A Analyzer accuracy: < 0.1% voltage measurement uncertainty and sub-millisecond PTP time tagging',
        'Active Filter compensation capability: up to 50th harmonic order with individual harmonic programming'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Calcul de la fréquence de résonance parallèle LC entre batterie de condensateurs et inductance du réseau : fr = f1 * sqrt(Ssc / Qc)',
        'Étude d\'écoulement de charges harmoniques (Harmonic Load Flow) et impédance de grille en fréquence (Z-bus sweep)',
        'Calcul de dimensionnement du facteur de déclassement (K-factor) des transformateurs alimentant des charges non-linéaires',
        'Évaluation de la propagation des creux de tension (courbes de tolérance d\'équipements CBEMA / ITIC et CEI 61000-4-11)',
        'Conception du blindage CEM, des liaisons équipotentielles HF et du dimensionnement des filtres passe-bas de ligne'
      ],
      designCalculationsEn: [
        'Parallel harmonic resonance frequency derivation between capacitor banks and grid inductance: fr = f1 * sqrt(Ssc / Qc)',
        'Harmonic Load Flow and frequency scan analysis of grid impedance (Z-bus sweep from 50 Hz to 2.5 kHz)',
        'Transformer K-factor thermal derating calculation under non-linear rectifier loading per IEEE C57.110',
        'Voltage sag propagation modeling and equipment ride-through assessment against CBEMA / ITIC and IEC 61000-4-11 curves',
        'EMC shielding design, high-frequency equipotential bonding, and line EMI filter attenuation calculation'
      ],
      protectionSchemesFr: [
        'Protection contre la surcharge harmonique des batteries de condensateurs (ANSI 51H)',
        'Protection contre les surtensions transitoires et résonances ferro-résonantes (ANSI 59 / 59N)',
        'Surveillance automatique du déséquilibre de phase (ANSI 47 / 46) et alarme si composante inverse u2 > 2%',
        'Déconnexion rapide des filtres passifs en cas de surintensité harmonique ou dérive capacitive (ANSI 50/51)',
        'Verrouillage automatique des convertisseurs IGBT en cas de surtension sur le bus continu DC (> 900 V)'
      ],
      protectionSchemesEn: [
        'Capacitor bank harmonic overload thermal protection (ANSI 51H)',
        'Transient overvoltage and ferroresonance protection scheme (ANSI 59 / 59N)',
        'Negative-sequence unbalance supervision (ANSI 47 / 46) tripping/alarm if u2 > 2%',
        'Fast tripping of passive filter branches upon excessive harmonic currents or capacitor cell rupture (ANSI 50/51)',
        'Instantaneous IGBT crowbar protection against DC link overvoltage surges (> 900 V)'
      ],
      maintenancePracticesFr: [
        'Enregistrement continu et audit hebdomadaire des statistiques de qualité selon la norme EN 50160 (95% des valeurs sur 1 semaine)',
        'Inspection thermographique infrarouge des selfs d\'antiparasitage, condensateurs de puissance et connexions de puissance',
        'Mesure de la capacité des cellules de filtrage et contrôle de l\'inductance des bobines de choc (recherche de dérive)',
        'Vérification de l\'impédance de terre haute fréquence et continuité du maillage de masse CEM (tresse de masse < 0.1 ohm)',
        'Calibrage périodique triennal des analyseurs de réseau avec source de référence étalon certifiée'
      ],
      maintenancePracticesEn: [
        'Continuous monitoring and weekly automated compliance audits per EN 50160 (95% weekly statistical percentiles)',
        'Infrared thermographic scanning of tuning reactors, power capacitors, and busbar bolted connections',
        'Capacitance and ESR measurement of power filter stages to detect early internal dielectric degradation',
        'High-frequency earthing impedance verification and EMC bonding ground mesh continuity checks (< 0.1 ohm)',
        'Triennial precision recalibration of Class A power quality instruments against traceable calibration standards'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'CEI 61000-4-30', titleFr: 'Techniques d\'essai et de mesure - Méthodes de mesure de la qualité de l\'alimentation (Classe A)', titleEn: 'Testing and measurement techniques - Power quality measurement methods (Class A edition 3)' },
        { ref: 'IEEE 519-2022', titleFr: 'Pratique recommandée pour le contrôle des harmoniques dans les réseaux d\'énergie électrique', titleEn: 'Standard for Harmonic Control in Electric Power Systems' },
        { ref: 'EN 50160', titleFr: 'Caractéristiques de la tension fournie par les réseaux publics de distribution', titleEn: 'Voltage characteristics of electricity supplied by public electricity networks' },
        { ref: 'CEI 61000-2-4', titleFr: 'Niveaux de compatibilité dans les installations industrielles pour les perturbations conduites basse fréquence', titleEn: 'Compatibility levels in industrial plants for low-frequency conducted disturbances' },
        { ref: 'CEI 61000-4-15', titleFr: 'Flickermètre - Spécifications fonctionnelles et de conception', titleEn: 'Flickermeter - Functional and design specifications' }
      ],
      regulatoryBodiesFr: [
        'CIGRE Comité C4 (Performance technique des réseaux : PQ, CEM & Foudre)',
        'IEEE Power & Energy Society (Transmission & Distribution Committee)',
        'ARSEL Cameroun (Agence de Régulation du Secteur de l\'Électricité)'
      ],
      regulatoryBodiesEn: [
        'CIGRE Study Committee C4 (System Technical Performance: PQ, EMC & Lightning)',
        'IEEE Power & Energy Society (Transmission & Distribution Committee)',
        'ARSEL Cameroon (Electricity Sector Regulatory Agency)'
      ]
    },
    level5_relatedDomains: {
      D08: {
        domainCode: 'D08',
        relationshipTypeFr: 'Électronique de Puissance & Convertisseurs',
        relationshipTypeEn: 'Power Electronics & Inverters',
        descriptionFr: 'Les redresseurs et onduleurs sont les principales sources d\'harmoniques (H5, H7, H11, H13) tout en fournissant les briques IGBT pour l\'APF et le STATCOM.',
        descriptionEn: 'Power rectifiers and inverters are primary harmonic sources (H5, H7, H11, H13) while providing core IGBT blocks for APF and STATCOM devices.'
      },
      D07: {
        domainCode: 'D07',
        relationshipTypeFr: 'Machines Tournantes & Moteurs',
        relationshipTypeEn: 'Rotating Machines & Motors',
        descriptionFr: 'Les harmoniques de tension provoquent un échauffement supplémentaire du rotor et des pertes fer dans les moteurs et alternateurs (déclassement NEMA).',
        descriptionEn: 'Voltage harmonics cause excessive rotor surface heating and core iron losses in industrial motors and alternators (NEMA derating).'
      },
      D04: {
        domainCode: 'D04',
        relationshipTypeFr: 'Postes Électriques & Transformateurs',
        relationshipTypeEn: 'Substations & Transformers',
        descriptionFr: 'Héberge les batteries de condensateurs, les réactances de lissage et les parafoudres avec risque de résonance LC sur le jeu de barres HTA.',
        descriptionEn: 'Houses power capacitor banks, smoothing reactors, and surge arresters vulnerable to LC parallel resonance on MV busbars.'
      },
      D02: {
        domainCode: 'D02',
        relationshipTypeFr: 'Stabilité Dynamique & Réseau',
        relationshipTypeEn: 'Grid Dynamics & Voltage Stability',
        descriptionFr: 'Le soutien rapide de tension par STATCOM (temps de réponse < 20 ms) prévient l\'effondrement de tension lors des défauts réseau N-1.',
        descriptionEn: 'Rapid sub-cycle STATCOM voltage support (< 20 ms) mitigates voltage collapse and sustains fault ride-through during N-1 contingencies.'
      },
      D16: {
        domainCode: 'D16',
        relationshipTypeFr: 'Mise à la Terre & Sécurité CEM',
        relationshipTypeEn: 'Earthing, Bonding & EMC Safety',
        descriptionFr: 'Un maillage de terre à faible impédance haute fréquence et le blindage des câbles de contrôle sont indispensables pour l\'immunité CEM du poste.',
        descriptionEn: 'Low-impedance high-frequency ground grids and shielded instrumentation cables are vital to guarantee substation EMC immunity.'
      }
    }
  },

  D15: {
    level1_system: {
      titleFr: 'Comptage Intelligent, Réseaux Intelligents (Smart Grids) & Numérisation des Réseaux',
      titleEn: 'Smart Metering, Advanced Metering Infrastructure (AMI) & Grid Digitalization',
      summaryFr: 'Architecture bidirectionnelle d\'acquisition, de télé-relève et d\'analyse des flux d\'énergie reliant les compteurs intelligents abonnés (AMI) aux systèmes de gestion d\'entreprise (MDMS/HES) pour la facturation en temps réel, la détection des fraudes et l\'optimisation de l\'exploitation du réseau de distribution.',
      summaryEn: 'Bidirectional telemetry, acquisition, and analytics framework interconnecting customer smart meters (AMI) with enterprise utility systems (MDMS/HES) for automated billing, non-technical loss eradication, and real-time distribution automation.',
      physicsPrinciplesFr: [
        'Loi de Joule et intégration de l\'énergie active et réactive E = ∫ (u·i) dt par conversion numérique analogique sigma-delta',
        'Propagation électromagnétique haute fréquence sur courant porteur en ligne (CPL G3 OFDM / PRIME)',
        'Théorie de l\'échantillonnage de Nyquist-Shannon et traitement numérique du signal DSP métrologique',
        'Conservation de l\'énergie de Kirchhoff pour le bilan de masse au poste de distribution : ΔE = E_totalisateur - Σ E_abonnés',
        'Cryptographie asymétrique et symétrique AES-128/GCM pour l\'intégrité et la confidentialité des télégrammes DLMS/COSEM'
      ],
      physicsPrinciplesEn: [
        'Joule heating and electrical energy integration E = ∫ (u·i) dt via high-precision sigma-delta metrology ADCs',
        'High-frequency electromagnetic wave propagation along power line conductors (G3-PLC OFDM / PRIME)',
        'Nyquist-Shannon sampling theorem and digital signal processing (DSP) metrology filters',
        'Kirchhoff\'s energy conservation law for substation mass balancing: ΔE = E_feeder - Σ E_customers',
        'Symmetric and asymmetric cryptographic authentication (AES-128/GCM) securing DLMS/COSEM telegrams'
      ],
      operatingVoltages: ['230 V (Monophasé)', '400 V (Triphasé BT)', '15 – 30 kV (Postes Distribution HTA)', 'Réseaux WAN / Télécoms'],
      powerFlowTypeFr: 'Flux bidirectionnel d\'énergie (consommation abonné et injection photovoltaïque décentralisée Prosumer) synchronisé avec flux bidirectionnel de données de télémesure et télé-ordres.',
      powerFlowTypeEn: 'Bidirectional power flow (customer consumption and distributed solar prosumer export) synchronized with bidirectional telemetry and remote command data flows.'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Compteur Électronique Intelligent d\'Énergie Active et Réactive Classe 0.5S / 1.0 (DLMS/COSEM)',
        'Concentrateur de Données de Poste HTA/BT (DCU - Data Concentrator Unit)',
        'Compteur Totalisateur de Tête de Départ Poste HTA/BT (Balance d\'Énergie)',
        'Clavier de Saisie Déporté & Compteur Split Prépayé STS (Standard Transfer Specification)',
        'Modem de Communication Modulaire (CPL G3, Cellulaire 4G/LTE-M, RF Mesh)',
        'Transformateurs de Courant de Précision à Noyau Divisé (TC Classe 0.2S / 0.5S)',
        'Serveur Central de Collecte HES (Head-End System) et Moteur Analytique MDMS'
      ],
      primaryApparatusEn: [
        'Smart Electronic Active & Reactive Energy Meter Class 0.5S / 1.0 (DLMS/COSEM)',
        'Substation Data Concentrator Unit (DCU Linux Embedded)',
        'Distribution Transformer Bulk Totalizer Check Meter (Energy Balancing)',
        'Customer Interface Unit (CIU) & STS Split Prepayment Meter',
        'Modular Plug-in Communication Modem (G3-PLC, Cellular LTE-M, RF Mesh)',
        'High-Precision Split-Core Current Transformers (CT Class 0.2S / 0.5S)',
        'Head-End System (HES) Server & Meter Data Management System (MDMS)'
      ],
      equipmentIds: ['eq-smart-meter-01', 'eq-dcu-poste-01', 'eq-relais-num-01'],
      keyRatingsFr: [
        'Classe de Précision Métrologique : Classe 1.0 (CEI 62053-21) pour usage résidentiel, Classe 0.5S / 0.2S (CEI 62053-22) pour compteurs industriels et postes',
        'Courant Assigné de Base et Maximal : 5(60) A ou 10(100) A monophasé, 3×5(100) A triphasé BT direct',
        'Pouvoir de Coupure du Relais Interne : 100 A sous 250 V AC (Catégorie UC3 selon CEI 62052-31, tenue court-circuit 25 kA)',
        'Débit et Bande Passante Télécoms : CPL G3 OFDM (35 – 91 kHz, jusqu\'à 45 kbit/s), 4G LTE-M / NB-IoT (jusqu\'à 1 Mbit/s)',
        'Chiffrement et Sécurité Informatique : Suite de Sécurité 0 et 1 DLMS (AES-128 GCM avec clés de chiffrement et d\'authentification uniques)'
      ],
      keyRatingsEn: [
        'Metrological Accuracy Class: Class 1.0 (IEC 62053-21) residential, Class 0.5S / 0.2S (IEC 62053-22) commercial and substation feeders',
        'Current Ratings: 5(60) A or 10(100) A single-phase, 3×5(100) A three-phase direct connected',
        'Internal Contactor Breaking Capacity: 100 A at 250 V AC (Utilization Category UC3 per IEC 62052-31, 25 kA short-circuit withstand)',
        'Communication Throughput: G3-PLC OFDM (35 – 91 kHz, up to 45 kbit/s), 4G LTE-M / NB-IoT (up to 1 Mbit/s)',
        'Cybersecurity & Encryption: DLMS Security Suite 0 and 1 (AES-128 GCM authenticated encryption with unique per-device keys)'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Bilan de masse d\'énergie au poste HTA/BT et calcul algorithmique des pertes non-techniques : ΔE = E_totalisateur - (Σ E_abonnés + Pertes Joules calculées)',
        'Dimensionnement de la portée CPL G3 et calcul de l\'atténuation HF selon la typologie des câbles torsadés BT et le niveau de bruit',
        'Dimensionnement de la bande passante télécoms et volumétrie de stockage MDMS pour la relève quart-horaire de 500 000 compteurs',
        'Calcul de rentabilité économique (ROI / VAN) du déploiement AMI et modélisation de la réduction du manque à gagner commercial',
        'Dimensionnement thermique du relais de coupure 100 A sous cycles de manœuvre répétés et surintensités de court-circuit amont'
      ],
      designCalculationsEn: [
        'Substation energy mass balancing and non-technical loss localization: ΔE = E_bulk - (Σ E_customers + calculated technical line losses)',
        'G3-PLC communication range budget and high-frequency attenuation modeling along low-voltage aerial bundle cables',
        'Telecom bandwidth sizing and MDMS database clustering for 15-minute interval profile ingestion from 500,000 smart meters',
        'Economic ROI and Net Present Value (NPV) modeling for utility AMI rollout factoring revenue recovery and operational savings',
        'Thermal rating and mechanical endurance evaluation of the 100 A internal latching contactor under fault currents'
      ],
      protectionSchemesFr: [
        'Détection anti-fraude multi-capteurs : alarme ouverture de capot, inversion phase/neutre, détection de champ magnétique externe puissant (> 0.5 T)',
        'Délestage automatique et limitation de puissance souscrite par coupure du relais interne lors d\'un dépassement contractuel persistant',
        'Protection contre les surtensions transitoires d\'origine atmosphérique (varistances MOV internes 440 V et éclateurs à gaz)',
        'Déconnexion automatique de sécurité en cas de rupture du neutre amont entraînant une surtension entre phase et neutre (> 300 V)',
        'Journal d\'audit inviolable des événements de sécurité (Audit Log scellé et horodaté synchronisé NTP)'
      ],
      protectionSchemesEn: [
        'Multi-sensor anti-tamper detection: enclosure opening switches, reversed polarity, external magnetic field saturation (> 0.5 T)',
        'Automated demand limiting and contractual threshold enforcement by tripping the internal 100 A latching contactor',
        'Internal surge protective devices (heavy-duty 440 V metal-oxide varistors and gas discharge tubes)',
        'Overvoltage auto-disconnect mitigation during broken neutral conditions on three-phase low-voltage feeders (> 300 V)',
        'Tamper-evident cryptographic security audit logging with PTP/NTP synchronized microsecond timestamps'
      ],
      maintenancePracticesFr: [
        'Étalonnage métrologique périodique sur banc d\'essai automatique selon la norme CEI 62058 (échantillonnage statistique de lots)',
        'Mise à jour sécurisée du micrologiciel à distance (OTA Firmware Upgrade) avec signature cryptographique ECDSA et contrôle de somme',
        'Surveillance continue des taux de succès de relève quotidienne (SLA KPI de lecture > 98.5% à H+2)',
        'Audit de terrain des alertes de détection de fraude générées par le moteur d\'intelligence artificielle du MDMS',
        'Contrôle de l\'état de la batterie lithium interne de sauvegarde de l\'horloge temps réel (RTC durée de vie > 15 ans)'
      ],
      maintenancePracticesEn: [
        'Periodic metrological recalibration on automated test benches per IEC 62058 (statistical lot sampling methodology)',
        'Secure Over-The-Air (OTA) remote firmware upgrading with asymmetric ECDSA digital signatures and rollback safety',
        'Continuous monitoring of daily meter read success rates (utility KPI SLA > 98.5% automated collection within 2 hours)',
        'Field inspection and technical enforcement dispatch based on MDMS machine-learning tamper anomaly alarms',
        'Internal lithium backup battery impedance monitoring for real-time clock (RTC operating lifespan > 15 years)'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'CEI 62056 (DLMS/COSEM)', titleFr: 'Échange des données pour le comptage de l\'électricité - La suite DLMS/COSEM (Architecture, COSEM, transport)', titleEn: 'Electricity metering data exchange - The DLMS/COSEM suite (Architecture, object identification, and profile generic)' },
        { ref: 'CEI 62053-21', titleFr: 'Équipement de comptage de l\'électricité - Compteurs statiques d\'énergie active (classes 1 et 2)', titleEn: 'Electricity metering equipment - Static meters for active energy (classes 1 and 2)' },
        { ref: 'CEI 61968-9', titleFr: 'Intégration d\'applications pour les services de distribution - Interfaces pour le comptage et la télé-relève (CIM)', titleEn: 'Application integration at electric utilities - Interfaces for meter reading and control (CIM standard)' },
        { ref: 'CEI 62052-31', titleFr: 'Équipement de comptage de l\'électricité - Exigences de sécurité pour compteurs communicants et organes de coupure', titleEn: 'Electricity metering equipment - Product safety requirements for smart meters and disconnect switches' },
        { ref: 'CEI 61334 (CPL)', titleFr: 'Automatisation de la distribution à l\'aide de systèmes de communication à courants porteurs', titleEn: 'Distribution automation using distribution line carrier systems (PLC)' }
      ],
      regulatoryBodiesFr: [
        'DLMS User Association (Standardisation mondiale de la suite protocolaire DLMS/COSEM)',
        'STS Association (Standard mondial de transfert de crédit prépayé sécurisé STS)',
        'G3-PLC Alliance (Certification d\'interopérabilité des communications par courants porteurs)',
        'ARSEL Cameroun (Réglementation tarifaire, homologation des compteurs et code de comptage)'
      ],
      regulatoryBodiesEn: [
        'DLMS User Association (Global management of DLMS/COSEM protocol suite)',
        'STS Association (Standard Transfer Specification for secure token prepayment)',
        'G3-PLC Alliance (Powerline communication interoperability and certification)',
        'ARSEL Cameroon (Electricity Sector Regulatory Agency - Tariff and Grid Metering Code)'
      ]
    },
    level5_relatedDomains: {
      D05: {
        domainCode: 'D05',
        relationshipTypeFr: 'Réseau de Distribution HTA/BT',
        relationshipTypeEn: 'MV/LV Distribution Grid',
        descriptionFr: 'Le réseau de distribution physique constitue le support de transmission des compteurs CPL et bénéficie directement de l\'équilibrage de charge et de la détection des coupures.',
        descriptionEn: 'The physical distribution network provides the media for PLC communication and leverages AMI telemetry for phase load balancing and automated outage reporting.'
      },
      D10: {
        domainCode: 'D10',
        relationshipTypeFr: 'SCADA, EMS/DMS & Téléconduite',
        relationshipTypeEn: 'SCADA, EMS/DMS & Telecontrol',
        descriptionFr: 'L\'intégration du MDMS avec l\'ADMS permet d\'alimenter les algorithmes d\'estimation d\'état basse tension et de localisation automatique des pannes (FLISR).',
        descriptionEn: 'Interfacing MDMS with utility ADMS drives low-voltage state estimation algorithms and fault location, isolation, and service restoration (FLISR).'
      },
      D14: {
        domainCode: 'D14',
        relationshipTypeFr: 'Qualité de l\'Énergie & Tensions',
        relationshipTypeEn: 'Power Quality & Voltage Monitoring',
        descriptionFr: 'Les compteurs AMI enregistrent en continu la tension efficace, les creux et les harmoniques aux points terminaux, créant une cartographie nationale de la qualité d\'onde.',
        descriptionEn: 'AMI endpoints continuously sample RMS voltage profiles, sags, and harmonic levels, building a high-resolution grid power quality observability map.'
      },
      D16: {
        domainCode: 'D16',
        relationshipTypeFr: 'Sécurité Électrique & Mise à la Terre',
        relationshipTypeEn: 'Electrical Safety & Earthing',
        descriptionFr: 'La mesure de la tension de neutre et le signalement des ruptures de terre au compteur protègent les usagers contre les risques d\'électrocution et d\'incendie.',
        descriptionEn: 'Neutral voltage monitoring and broken earth detection at smart meter terminals shield consumers from severe electrocution and structural fire hazards.'
      },
      D04: {
        domainCode: 'D04',
        relationshipTypeFr: 'Postes de Transformation HTA/BT',
        relationshipTypeEn: 'MV/LV Substations & Transformers',
        descriptionFr: 'Les postes hébergent les concentrateurs DCU et les compteurs totalisateurs de tête de départ indispensables au calcul de la balance de masse d\'énergie.',
        descriptionEn: 'Substations house DCU concentrators and feeder totalizer check meters required to execute algorithmic mass energy balance calculations.'
      }
    }
  },

  D16: {
    level1_system: {
      titleFr: 'Sécurité Électrique, Régimes de Neutre, Réseaux de Terre & Protection Foudre',
      titleEn: 'Electrical Safety, Earthing Systems, Neutral Grounding & Lightning Protection',
      summaryFr: 'Ensemble coordonné des dispositions physiques, électrotechniques et constructives destinées à garantir l\'équipotentialité des masses métalliques, l\'écoulement rapide des courants de court-circuit et de foudre dans le sol, la maîtrise des tensions de pas et de toucher sous les limites de fibrillation cardiaque humaine, et l\'élimination ultra-rapide des amorçages d\'arc électrique (Arc Flash).',
      summaryEn: 'Coordinated electrotechnical and safety engineering framework ensuring equipotential bonding of exposed conductive parts, high-capacity grounding of lightning impulses and short-circuit currents, limiting step and touch potentials below human ventricular fibrillation thresholds, and ultra-fast arc flash mitigation.',
      physicsPrinciplesFr: [
        'Loi d\'Ohm généralisée et gradient de potentiel dans un milieu conducteur semi-infini (équations de Laplace ∇²V = 0)',
        'Modèle biophysique de tolérance du corps humain et seuils de fibrillation ventriculaire de Dalziel (norme IEEE 80)',
        'Écoulement impulsionnel de la foudre et impédance d\'onde transitoire des prises de terre haute fréquence (Z_hf ≠ R_dc)',
        'Méthode de la sphère roulante électrogéométrique pour la zone de protection des paratonnerres (modèle de Whitehead)',
        'Énergie incidente de l\'arc électrique et transfert radiatif thermique et d\'onde de choc de pression (modèle IEEE 1584-2018)'
      ],
      physicsPrinciplesEn: [
        'Generalized Ohm\'s law and ground potential rise in semi-infinite conductive soil (Laplace equation ∇²V = 0)',
        'Biophysical human body electrical tolerance model and Dalziel ventricular fibrillation criteria (IEEE 80 standard)',
        'High-frequency transient impulse dispersion of lightning surges in earth electrodes (transient impedance Z_hf ≠ R_dc)',
        'Electrogeometric rolling sphere interception method for air terminal lightning protection (Whitehead model)',
        'Incident arc flash thermal energy radiation and pressure blast wave propagation (IEEE 1584-2018 calculation model)'
      ],
      operatingVoltages: ['225 kV / 90 kV (Postes HTB)', '15 – 30 kV (Réseaux HTA)', '400 V / 230 V (Installations BT)', 'Tension de Pas < 2500 V', 'Tension de Toucher < 800 V'],
      powerFlowTypeFr: 'Écoulement unidirectionnel de courants impulsionnels de foudre (jusqu\'à 200 kA en quelques microsecondes) et de courants de défaut à la terre (limités à 300 A en HTA par RPN ou 31.5 kA en HTB) vers le maillage de terre.',
      powerFlowTypeEn: 'Unidirectional rapid dispersion of atmospheric lightning surge currents (up to 200 kA in microseconds) and power ground-fault currents (limited to 300 A in MV via NGR or 31.5 kA in HV) into the earth grid.'
    },
    level2_equipment: {
      primaryApparatusFr: [
        'Maillage de Terre Enterré en Cuivre Nu 120 mm² avec Piquets Verticaux Profonds',
        'Résistance de Limitation du Neutre (RPN 30 kV - 300 A - 57.7 Ω)',
        'Paratonnerres à Tige Métallique (Franklin Rod LPS Classe I) et Câbles de Garde OPGW',
        'Parafoudres Haute Tension à Oxyde de Zinc (ZnO Sans Éclateur Classe 3 / 4)',
        'Système de Protection Ultra-Rapide contre l\'Arc Électrique (Arc Flash Optique & Fibre Nue)',
        'Liaisons Équipotentielles Principales (LEP) et Tapis Isolants / de Terre aux Commandes',
        'Couche de Gravier Concassé de Surface de 15 cm (Résistivité ρs ≥ 3000 Ω·m)'
      ],
      primaryApparatusEn: [
        'Buried Copper Ground Grid Mesh (120 mm² bare copper with deep vertical driven rods)',
        'Neutral Grounding Resistor (NGR 30 kV - 300 A - 57.7 Ω for 10s fault duration)',
        'Franklin Air Terminal Rods (LPS Class I) and Continuous OPGW Shield Conductors',
        'Gapless Zinc-Oxide (ZnO) High-Voltage Surge Arresters (Station Class 3 / 4)',
        'Optical Arc Flash Fast Protection Relay (Bare optical fiber loop and point lenses)',
        'Main Equipotential Bonding Leads & Operator Substation Switch Operating Mats',
        'Crushed Rock Surface Layer 15 cm (High Surface Resistivity ρs ≥ 3000 Ω·m)'
      ],
      equipmentIds: ['eq-parafoudre-01', 'eq-rpn-30kv-01', 'eq-arc-flash-01', 'eq-relais-num-01'],
      keyRatingsFr: [
        'Résistance Globale de la Prise de Terre de Poste : R_terre ≤ 0.5 Ω pour les postes HTB 225 kV (CEI 61936-1 / IEEE 80)',
        'Tension de Toucher Admissible (Touch Potential) : Utouch ≤ 780 V sous gravier 15 cm pour élimination en 0.2 s (corps 50 kg)',
        'Courant Assigné de Neutre RPN : 300 A sous 17.3 kV phase-terre pendant 10 s (57.7 Ω)',
        'Courant d\'Impulsion Foudre Assigné (Iimp) : 200 kA (onde 10/350 µs selon CEI 62305-1)',
        'Temps de Détection et d\'Ordre Déclenchement Arc Flash : < 2 ms (déclenchement total disjoncteur < 45 ms)'
      ],
      keyRatingsEn: [
        'Substation Overall Earth Grid Resistance: R_earth ≤ 0.5 Ω for 225 kV bulk substations (IEC 61936-1 / IEEE 80)',
        'Permissible Touch Potential: Utouch ≤ 780 V with 15 cm crushed rock surfacing for 0.2 s clearing (50 kg human body)',
        'NGR Rated Ground Fault Current: 300 A at 17.3 kV line-to-neutral for 10 s rating (57.7 Ω)',
        'Lightning Impulse Rated Current (Iimp): 200 kA (10/350 µs waveform per IEC 62305-1)',
        'Optical Arc Flash Detection & Trip Initiation Time: < 2 ms (total breaker arc interruption < 45 ms)'
      ]
    },
    level3_engineering: {
      designCalculationsFr: [
        'Dimensionnement du maillage de terre selon la méthodologie IEEE 80 (calcul de la résistance de terre Rg, tension de pas Es et tension de toucher Et)',
        'Interprétation de la résistivité du sol par sondage Wenner à 4 piquets et inversion en modèle de sol à deux couches (ρ1, ρ2, h)',
        'Calcul de l\'énergie incidente d\'arc électrique (Arc Flash Incident Energy en cal/cm²) selon la norme IEEE 1584-2018 et délimitation des périmètres de sécurité',
        'Conception de la protection foudre par la méthode de la sphère roulante (CEI 62305-3) et calcul de la distance de séparation minimale S',
        'Calcul de la tenue thermique adiabatique des conducteurs de terre en cuivre nu selon la formule d\'Onderdonk'
      ],
      designCalculationsEn: [
        'Earth grid mesh dimensioning per IEEE 80 analytical equations (grid resistance Rg, step potential Es, and mesh touch potential Em)',
        'Wenner 4-pin soil resistivity profile interpretation and mathematical inversion into equivalent two-layer soil models (ρ1, ρ2, h)',
        'Arc flash incident energy evaluation (cal/cm²) per IEEE 1584-2018 equations and safety boundary distance demarcation',
        'Rolling sphere electrogeometric lightning interception design per IEC 62305-3 and separation distance S computation',
        'Bare copper grounding conductor adiabatic thermal sizing per Onderdonk equation for maximum clearing time'
      ],
      protectionSchemesFr: [
        'Protection contre les défauts à la terre directionnelle HTA wattmétrique / ampèremétrique (ANSI 67N / 51N)',
        'Protection différentielle de terre restreinte (ANSI 87N) pour transformateurs de puissance et alternateurs',
        'Protection ultra-rapide optique contre l\'arc électrique en cellule HTA (détection de lumière + seuil de surintensité I >)',
        'Surveillance thermique continue de la résistance de neutre RPN avec temporisation de secours en cas de défaut non-éliminé',
        'Surveillance de l\'intégrité de la liaison de terre par boucle de contrôle de continuité et relais de tension de neutre (ANSI 59N)'
      ],
      protectionSchemesEn: [
        'Directional ground fault protection for MV networks (ANSI 67N / 51N with sensitive residual current detection)',
        'Restricted Earth Fault (REF / ANSI 87N) differential protection for power transformers and hydro generators',
        'Ultra-fast optical arc flash switchgear busbar protection (point lens/fiber light detection confirmed by instantaneous I >)',
        'Thermal overload surveillance of NGR resistor elements with backup clearance tripping if fault persists beyond 10 s',
        'Substation earth bonding continuous loop monitoring and neutral displacement voltage supervision (ANSI 59N)'
      ],
      maintenancePracticesFr: [
        'Mesure annuelle de la résistance de terre au telluromètre haute fréquence avec méthode des 62% pour s\'affranchir des perturbations',
        'Audit de continuité des liaisons équipotentielles sous courant 10 A (résistance de contact maximale admissible < 0.1 Ω)',
        'Inspection de l\'épaisseur et de la propreté de la couche de gravier concassé de surface (élimination de la terre végétale et mousses)',
        'Vérification des compteurs d\'impacts de foudre sur les descentes de paratonnerres et contrôle de l\'état des parafoudres ZnO',
        'Contrôle annuel des équipements de protection individuelle (EPI arc flash, gants isolants HT, perches à décharge, tabourets)'
      ],
      maintenancePracticesEn: [
        'Annual ground grid resistance measurement using high-frequency earth tester with 62% potential fall-of-potential method',
        'High-current 10 A continuity audit of all equipotential bonding connections (maximum contact resistance < 0.1 Ω)',
        'Surface crushed rock layer depth and contamination inspection (preventing organic soil or silt ingress reducing resistivity)',
        'Substation lightning flash counter logging and surge arrester leakage current mA monitoring',
        'Mandatory annual dielectric testing and recertification of arc flash PPE, high-voltage insulating gloves, and grounding sticks'
      ]
    },
    level4_standards: {
      standardsList: [
        { ref: 'IEEE 80-2013', titleFr: 'Guide IEEE pour la sécurité de la mise à la terre dans les postes électriques en courant alternatif', titleEn: 'IEEE Guide for Safety in AC Substation Grounding' },
        { ref: 'CEI 62305 (Parties 1 à 4)', titleFr: 'Protection contre la foudre - Principes généraux, évaluation des risques, dommages physiques et réseaux électriques', titleEn: 'Protection against lightning - General principles, risk assessment, physical damage and electrical systems' },
        { ref: 'IEEE 1584-2018', titleFr: 'Guide IEEE pour la réalisation des calculs de danger d\'arc électrique (Arc Flash)', titleEn: 'IEEE Guide for Performing Arc-Flash Hazard Calculations' },
        { ref: 'CEI 61936-1', titleFr: 'Installations électriques en courant alternatif de puissance supérieure à 1 kV - Règles communes', titleEn: 'Power installations exceeding 1 kV a.c. - Common rules (Earthing systems)' },
        { ref: 'NFPA 70E', titleFr: 'Norme pour la sécurité électrique sur le lieu de travail (Gestion du risque d\'arc électrique et EPI)', titleEn: 'Standard for Electrical Safety in the Workplace (Arc flash boundaries and PPE categories)' }
      ],
      regulatoryBodiesFr: [
        'IEEE PES Substations Committee (Comité technique de rédaction de la norme IEEE 80)',
        'CEI Comité d\'Études TC 81 (Protection contre la foudre)',
        'CIGRE Comité B3 (Postes électriques et installations haute tension)',
        'Ministère de l\'Eau et de l\'Énergie (MINEE) & SONATREL (Réglementation technique nationale de sécurité électrique)'
      ],
      regulatoryBodiesEn: [
        'IEEE PES Substations Committee (Standard development body for IEEE 80 substation earthing)',
        'IEC Technical Committee TC 81 (Lightning protection standard development)',
        'CIGRE Study Committee B3 (Substations and electrical installations)',
        'Ministry of Water Resources and Energy (MINEE) & SONATREL Cameroon (National electrical safety codes)'
      ]
    },
    level5_relatedDomains: {
      D04: {
        domainCode: 'D04',
        relationshipTypeFr: 'Postes Électriques & Appareillage',
        relationshipTypeEn: 'Substations & Switchgear',
        descriptionFr: 'Le maillage de terre s\'étend sous toute l\'emprise du poste pour protéger les opérateurs lors de la manœuvre des sectionneurs et disjoncteurs.',
        descriptionEn: 'The earth grid spans the entire substation yard footprint to guarantee operator safety during manual or motorized switchgear operations.'
      },
      D03: {
        domainCode: 'D03',
        relationshipTypeFr: 'Lignes de Transport Haute Tension',
        relationshipTypeEn: 'High-Voltage Transmission Lines',
        descriptionFr: 'Les câbles de garde et la prise de terre de chaque pylône évacuent les coups de foudre directs et évitent les amorçages en retour (back-flashover).',
        descriptionEn: 'Shield wires and tower footing grounding electrodes discharge direct lightning strikes, preventing destructive back-flashover surges.'
      },
      D09: {
        domainCode: 'D09',
        relationshipTypeFr: 'Protection & Automatismes de Réseau',
        relationshipTypeEn: 'Protections & Control Relays',
        descriptionFr: 'Les relais de protection de terre (ANSI 50N/51N, 67N) sont directement calé sur la valeur ohmique de la résistance de neutre RPN.',
        descriptionEn: 'Ground fault protection relays (ANSI 50N/51N, 67N) are calibrated around the specific grounding impedance and thermal duration of the NGR.'
      },
      D14: {
        domainCode: 'D14',
        relationshipTypeFr: 'Qualité d\'Énergie & CEM',
        relationshipTypeEn: 'Power Quality & EMC Shielding',
        descriptionFr: 'Un réseau de masse équipotentiel maillé à très faible impédance haute fréquence est indispensable pour protéger les IED numériques contre les surtensions transitoires.',
        descriptionEn: 'A high-frequency, low-impedance equipotential ground plane is mandatory to shield digital IEDs and communication circuits from transient EMC noise.'
      },
      D01: {
        domainCode: 'D01',
        relationshipTypeFr: 'Aménagements Hydroélectriques',
        relationshipTypeEn: 'Hydroelectric Power Plants',
        descriptionFr: 'Les centrales hydroélectriques requièrent une mise à la terre subaquatique spéciale dans le lit du fleuve combinée à la mise à la terre des blindages de conduite forcée.',
        descriptionEn: 'Hydro plants require specialized underwater grounding electrodes placed in the river bed interconnected with penstock steel liners and powerhouse rock anchors.'
      }
    }
  }
};

export const FiveLevelArchitectureTab: React.FC<FiveLevelArchitectureTabProps> = ({
  domainCode,
  locale,
  onSelectEquipment,
  onSelectStandard,
  onSelectRole,
  onNavigateDomain,
}) => {
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Fallback if specific domain data isn't in registry yet
  const specificData = FIVE_LEVEL_REGISTRY[domainCode] || FIVE_LEVEL_REGISTRY['D04']!;
  const currentDomain = DOMAINS.find((d) => d.code === domainCode) || DOMAINS[0];

  const domainEquipments = EQUIPMENT_ITEMS.filter((e) => e.domain_code === domainCode);

  return (
    <div className="space-y-6 max-w-5xl font-sans">
      
      {/* Overview Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30">
                {locale === 'fr' ? 'Architecture Système en 5 Niveaux' : '5-Level System Architecture'}
              </span>
              <span className="font-mono text-xs text-slate-400 font-bold">{domainCode}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-sans text-white">
              {locale === 'fr' ? currentDomain.name_fr : currentDomain.name_en}
            </h3>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{locale === 'fr' ? 'Modèle Analytique Conforme CEI' : 'IEC Compliant Analytic Model'}</span>
          </div>
        </div>

        {/* 5 Levels Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {[
            { level: 1 as const, icon: Activity, titleFr: 'Niv 1 · Système', titleEn: 'L1 · System', descFr: 'Phénomène physique', descEn: 'Physical model' },
            { level: 2 as const, icon: Cpu, titleFr: 'Niv 2 · Équipements', titleEn: 'L2 · Equipment', descFr: 'Appareillage & calibres', descEn: 'Apparatus & ratings' },
            { level: 3 as const, icon: Wrench, titleFr: 'Niv 3 · Ingénierie', titleEn: 'L3 · Engineering', descFr: 'Calculs & protections', descEn: 'Calculations & relaying' },
            { level: 4 as const, icon: BookOpen, titleFr: 'Niv 4 · Normes', titleEn: 'L4 · Standards', descFr: 'CEI / IEEE / Codes', descEn: 'IEC / IEEE / Codes' },
            { level: 5 as const, icon: Share2, titleFr: 'Niv 5 · Relations', titleEn: 'L5 · Related', descFr: 'Interconnexion 21 Domaines', descEn: '21-Domain matrix' },
          ].map((item) => {
            const isSelected = activeLevel === item.level;
            const Icon = item.icon;
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => setActiveLevel(item.level)}
                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between font-mono ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-400 shadow-md ring-2 ring-sky-400/30'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">
                    {locale === 'fr' ? item.titleFr : item.titleEn}
                  </span>
                  <Icon className="h-3.5 w-3.5 opacity-80" />
                </div>
                <span className={`text-[10px] line-clamp-1 font-sans ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                  {locale === 'fr' ? item.descFr : item.descEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LEVEL 1: SYSTEM (What is happening?) */}
      {activeLevel === 1 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-sky-700 uppercase">
              {locale === 'fr' ? 'NIVEAU 1 — VUE SYSTÈME (QUE SE PASSE-T-IL ?)' : 'LEVEL 1 — SYSTEM VIEW (WHAT IS HAPPENING?)'}
            </span>
            <h4 className="text-xl font-bold text-slate-900 font-sans">
              {locale === 'fr' ? specificData.level1_system.titleFr : specificData.level1_system.titleEn}
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              {locale === 'fr' ? specificData.level1_system.summaryFr : specificData.level1_system.summaryEn}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Physics Principles */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h5 className="font-mono text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-sky-600" />
                <span>{locale === 'fr' ? 'Lois Physiques Gouvernantes' : 'Governing Physical Principles'}</span>
              </h5>
              <ul className="space-y-2 font-mono text-xs text-slate-700">
                {(locale === 'fr' ? specificData.level1_system.physicsPrinciplesFr : specificData.level1_system.physicsPrinciplesEn).map((law, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-600 font-bold">•</span>
                    <span>{law}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Operating Parameters */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h5 className="font-mono text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-sky-600" />
                <span>{locale === 'fr' ? 'Régime Opérationnel & Tensions' : 'Operating Regime & Voltages'}</span>
              </h5>
              
              <div>
                <span className="font-mono text-[11px] text-slate-500 block mb-1">
                  {locale === 'fr' ? 'Paliers de tension nominaux :' : 'Nominal voltage steps:'}
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {specificData.level1_system.operatingVoltages.map((v, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-white border border-slate-300 font-bold text-slate-800">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-mono text-[11px] text-slate-500 block mb-1">
                  {locale === 'fr' ? 'Comportement du transit :' : 'Power flow behavior:'}
                </span>
                <p className="font-sans text-xs text-slate-700 leading-relaxed font-medium">
                  {locale === 'fr' ? specificData.level1_system.powerFlowTypeFr : specificData.level1_system.powerFlowTypeEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 2: EQUIPMENT (What makes the system work?) */}
      {activeLevel === 2 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-sky-700 uppercase">
              {locale === 'fr' ? 'NIVEAU 2 — APPAREILLAGE & MATÉRIEL (QU\'EST-CE QUI FAIT FONCTIONNER LE SYSTÈME ?)' : 'LEVEL 2 — APPARATUS & ASSETS (WHAT MAKES THE SYSTEM WORK?)'}
            </span>
            <h4 className="text-xl font-bold text-slate-900 font-sans">
              {locale === 'fr' ? 'Composants Principaux & Caractéristiques Assignées' : 'Primary Apparatus & Nameplate Ratings'}
            </h4>
          </div>

          {/* Apparatus List */}
          <div className="space-y-2">
            <h5 className="font-mono text-xs font-bold text-slate-700 uppercase">
              {locale === 'fr' ? 'Équipements électrotechniques constitutifs :' : 'Core electrotechnical equipment:'}
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(locale === 'fr' ? specificData.level2_equipment.primaryApparatusFr : specificData.level2_equipment.primaryApparatusEn).map((app, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-mono text-xs font-bold">
                    {idx + 1}
                  </div>
                  <span className="font-sans text-xs font-bold text-slate-800">
                    {app}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Ratings & Specifications */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h5 className="font-mono text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <Gauge className="h-4 w-4 text-sky-600" />
              <span>{locale === 'fr' ? 'Calibres & Valeurs Assignées Types' : 'Typical Nameplate Ratings & Limits'}</span>
            </h5>
            <ul className="space-y-1.5 font-mono text-xs text-slate-700">
              {(locale === 'fr' ? specificData.level2_equipment.keyRatingsFr : specificData.level2_equipment.keyRatingsEn).map((rating, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{rating}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Linked EPEDE Equipment Catalog Cards */}
          {domainEquipments.length > 0 && (
            <div className="space-y-3 pt-2">
              <h5 className="font-mono text-xs font-bold text-slate-700 uppercase">
                {locale === 'fr' ? 'Fiches techniques détaillées dans EPEDE :' : 'Documented datasheets in EPEDE:'}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {domainEquipments.map((eq) => (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => onSelectEquipment(eq.id)}
                    className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-left transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-mono text-[10px] font-bold text-sky-700 block uppercase">
                        {eq.voltage_level || 'HT/MT/BT'}
                      </span>
                      <span className="font-sans font-bold text-xs text-slate-900 group-hover:text-sky-700 transition-colors">
                        {locale === 'fr' ? eq.name_fr : eq.name_en}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-sky-700 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LEVEL 3: ENGINEERING (How do professionals design, operate, protect & maintain it?) */}
      {activeLevel === 3 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-sky-700 uppercase">
              {locale === 'fr' ? 'NIVEAU 3 — PRATIQUES D\'INGÉNIERIE (COMMENT LES EXPERTS LE CONÇOIVENT ET L\'EXPLOITENT ?)' : 'LEVEL 3 — ENGINEERING PRACTICES (HOW EXPERTS DESIGN, PROTECT & MAINTAIN IT?)'}
            </span>
            <h4 className="text-xl font-bold text-slate-900 font-sans">
              {locale === 'fr' ? 'Calculs d\'Ingénierie, Plans de Protection & Maintenance' : 'Engineering Calculations, Protection Philosophy & Asset Maintenance'}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Design Calculations */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-mono text-xs font-bold uppercase">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <span>{locale === 'fr' ? '1. Calculs de Dimensionnement' : '1. Sizing Calculations'}</span>
              </div>
              <ul className="space-y-2 font-mono text-[11px] text-slate-700">
                {(locale === 'fr' ? specificData.level3_engineering.designCalculationsFr : specificData.level3_engineering.designCalculationsEn).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">▪</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Protection Schemes */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-mono text-xs font-bold uppercase">
                <span className="h-2 w-2 rounded-full bg-purple-600" />
                <span>{locale === 'fr' ? '2. Schémas de Protection ANSI' : '2. ANSI Protection Schemes'}</span>
              </div>
              <ul className="space-y-2 font-mono text-[11px] text-slate-700">
                {(locale === 'fr' ? specificData.level3_engineering.protectionSchemesFr : specificData.level3_engineering.protectionSchemesEn).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">▪</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Maintenance Practices */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-mono text-xs font-bold uppercase">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                <span>{locale === 'fr' ? '3. Maintenance & Essais' : '3. Maintenance & Field Testing'}</span>
              </div>
              <ul className="space-y-2 font-mono text-[11px] text-slate-700">
                {(locale === 'fr' ? specificData.level3_engineering.maintenancePracticesFr : specificData.level3_engineering.maintenancePracticesEn).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">▪</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 4: STANDARDS & PRACTICES */}
      {activeLevel === 4 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-sky-700 uppercase">
              {locale === 'fr' ? 'NIVEAU 4 — CADRE NORMATIF & RÉGLEMENTAIRE' : 'LEVEL 4 — STANDARDS & REGULATORY COMPLIANCE'}
            </span>
            <h4 className="text-xl font-bold text-slate-900 font-sans">
              {locale === 'fr' ? 'Normes Internationales CEI / IEEE & Cadre Sectoriel' : 'International IEC / IEEE Standards & Regional Grid Codes'}
            </h4>
          </div>

          <div className="space-y-3">
            <h5 className="font-mono text-xs font-bold text-slate-700 uppercase">
              {locale === 'fr' ? 'Normes applicables pour ce domaine :' : 'Applicable international standards:'}
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specificData.level4_standards.standardsList.map((std, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectStandard(std.ref)}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 inline-block mb-1">
                      {std.ref}
                    </span>
                    <p className="font-sans text-xs text-slate-700 font-medium line-clamp-2">
                      {locale === 'fr' ? std.titleFr : std.titleEn}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-amber-800 transition-colors shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Authorities */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h5 className="font-mono text-xs font-bold text-slate-800 uppercase">
              {locale === 'fr' ? 'Autorités de Régulation & Comités Techniques :' : 'Regulatory Authorities & Technical Committees:'}
            </h5>
            <ul className="space-y-1 font-mono text-xs text-slate-700">
              {(locale === 'fr' ? specificData.level4_standards.regulatoryBodiesFr : specificData.level4_standards.regulatoryBodiesEn).map((body, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-slate-400">🏛️</span>
                  <span>{body}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* LEVEL 5: RELATED DOMAINS (Interactions across 21 domains) */}
      {activeLevel === 5 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-sky-700 uppercase">
              {locale === 'fr' ? 'NIVEAU 5 — INTERACTIONS ENTRE DOMAINES (LES 21 DOMAINES CONNECTÉS)' : 'LEVEL 5 — CROSS-DOMAIN INTERACTIONS (21 INTERCONNECTED DOMAINS)'}
            </span>
            <h4 className="text-xl font-bold text-slate-900 font-sans">
              {locale === 'fr' ? 'Comment ce domaine s\'articule avec l\'écosystème global EPEDE' : 'How this domain interfaces with the complete EPEDE ecosystem'}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(Object.values(specificData.level5_relatedDomains) as Array<{
              domainCode: DomainCode;
              relationshipTypeFr: string;
              relationshipTypeEn: string;
              descriptionFr: string;
              descriptionEn: string;
            }>).map((rel, idx) => {
              const targetDom = DOMAINS.find((d) => d.code === rel.domainCode);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                        {rel.domainCode} · {targetDom ? (locale === 'fr' ? targetDom.short_fr : targetDom.short_en) : ''}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">
                        {locale === 'fr' ? rel.relationshipTypeFr : rel.relationshipTypeEn}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-slate-700 leading-relaxed font-medium">
                      {locale === 'fr' ? rel.descriptionFr : rel.descriptionEn}
                    </p>
                  </div>

                  {onNavigateDomain && (
                    <button
                      type="button"
                      onClick={() => onNavigateDomain(rel.domainCode)}
                      className="text-xs font-mono font-bold text-sky-700 hover:text-sky-950 flex items-center gap-1 self-start pt-2"
                    >
                      <span>{locale === 'fr' ? `Explorer ${rel.domainCode}` : `Explore ${rel.domainCode}`}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
