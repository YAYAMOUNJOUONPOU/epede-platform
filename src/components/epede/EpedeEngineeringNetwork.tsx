// src/components/epede/EpedeEngineeringNetwork.tsx
// Interactive 21-Domain Connected Engineering Topology Network for EPEDE
import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Globe, 
  BarChart3, 
  Radio, 
  Lock, 
  TrendingUp, 
  Building2, 
  Factory, 
  BatteryCharging, 
  Car, 
  Scale, 
  FileCheck, 
  Compass, 
  Server, 
  Flame, 
  Sliders, 
  BookOpen,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { engineeringAssets, getEngineeringImageUrl } from '../../services/engineeringAssets';

export interface DomainNode {
  id: string;
  nameFr: string;
  nameEn: string;
  subtitleFr: string;
  subtitleEn: string;
  category: 'core_power' | 'infrastructure' | 'digital_control' | 'governance_methods';
  icon: any;
  angle: number; // in degrees around center
  distance: number; // radius from center
  connections: string[]; // IDs of interconnected domains
  standards: string[];
  keyEquipmentFr: string[];
  keyEquipmentEn: string[];
  engineeringFocusFr: string;
  engineeringFocusEn: string;
  imageObj: any;
}

export const EPEDE_21_DOMAINS: DomainNode[] = [
  {
    id: 'generation',
    nameFr: 'Production & Centrales',
    nameEn: 'Power Generation',
    subtitleFr: 'Hydro, Thermique, Turbines & Alternateurs Synchrones',
    subtitleEn: 'Hydro, Thermal, Turbines & Synchronous Alternators',
    category: 'core_power',
    icon: Zap,
    angle: 0,
    distance: 260,
    connections: ['transformation', 'transmission', 'renewables_microgrids', 'automation', 'engineering_studies'],
    standards: ['IEC 60034', 'IEEE 1010', 'IEC 60193'],
    keyEquipmentFr: ['Alternateur synchrone', 'Turbine Francis/Pelton', 'Régulateur de vitesse', 'Système d’excitation statique'],
    keyEquipmentEn: ['Synchronous alternator', 'Francis/Pelton turbine', 'Speed governor', 'Static excitation system'],
    engineeringFocusFr: 'Conversion électromécanique, inertie rotorique, régulation primaire fréquence-puissance f(P).',
    engineeringFocusEn: 'Electromechanical conversion, rotor inertia, primary frequency-power regulation f(P).',
    imageObj: engineeringAssets.generation.hydroRunner,
  },
  {
    id: 'transformation',
    nameFr: 'Transformation & GSU',
    nameEn: 'Transformation & GSU',
    subtitleFr: 'Transformateurs Élévateurs, Dyn11/YNd11 & Diélectrique',
    subtitleEn: 'Step-Up Transformers, Vector Groups & Dielectric',
    category: 'core_power',
    icon: Layers,
    angle: 17,
    distance: 310,
    connections: ['generation', 'transmission', 'substations', 'asset_management', 'safety'],
    standards: ['IEC 60076', 'IEEE C57.12', 'IEC 60296'],
    keyEquipmentFr: ['Transformateur 225/15 kV', 'Régulateur en charge (OLTC)', 'Relais Buchholz', 'Traversées condensateur RIP'],
    keyEquipmentEn: ['225/15 kV transformer', 'On-load tap changer (OLTC)', 'Buchholz relay', 'RIP condenser bushings'],
    engineeringFocusFr: 'Rapport de transformation, impédance de court-circuit Ucc%, tenue thermique et diélectrique de l’huile.',
    engineeringFocusEn: 'Turn ratio, short-circuit impedance Ucc%, thermal oil withstand and DGA dissolved gas analysis.',
    imageObj: engineeringAssets.transformation.powerTransformer,
  },
  {
    id: 'transmission',
    nameFr: 'Transport THT / HTB',
    nameEn: 'High-Voltage Transmission',
    subtitleFr: 'Lignes Aériennes 225/400 kV, Faisceaux & Stabilité',
    subtitleEn: '225/400 kV Overhead Lines, Bundles & Dynamic Stability',
    category: 'core_power',
    icon: Activity,
    angle: 34,
    distance: 270,
    connections: ['transformation', 'substations', 'smart_grids', 'engineering_studies', 'safety'],
    standards: ['IEC 60826', 'IEEE 738', 'IEC 60383'],
    keyEquipmentFr: ['Pylônes treillis acier', 'Conducteurs faisceaux Almelec', 'Câble de garde OPGW', 'Anneaux pare-effluves'],
    keyEquipmentEn: ['Steel lattice towers', 'Almelec bundle conductors', 'OPGW optical ground wire', 'Corona grading rings'],
    engineeringFocusFr: 'Puissance naturelle SIL, effet couronne, chutes de tension inductive, protection différentielle de ligne 87L.',
    engineeringFocusEn: 'Surge impedance loading SIL, corona loss, reactive compensation and line differential protection 87L.',
    imageObj: engineeringAssets.transmission.corridor,
  },
  {
    id: 'substations',
    nameFr: 'Postes Électriques AIS/GIS',
    nameEn: 'Substations AIS & GIS',
    subtitleFr: 'Jeux de Barres, Disjoncteurs SF6 & Cellules Blindées',
    subtitleEn: 'Busbar Topologies, SF6 Breakers & Gas-Insulated Switchgear',
    category: 'core_power',
    icon: Building2,
    angle: 51,
    distance: 330,
    connections: ['transmission', 'distribution', 'automation', 'safety', 'ot_cybersecurity', 'power_quality', 'asset_management', 'smart_grids'],
    standards: ['IEC 61936-1', 'IEC 62271-100', 'IEEE 80'],
    keyEquipmentFr: ['Disjoncteurs SF6 HTB', 'Sectionneurs rotatifs', 'Réducteurs TC/TT', 'Grille de mise à la terre cuivre'],
    keyEquipmentEn: ['HV SF6 circuit breakers', 'Rotary disconnectors', 'CT/VT instrument transformers', 'Copper grounding grid IEEE 80'],
    engineeringFocusFr: 'Topologies double jeu de barres, pouvoir de coupure symétrique 40 kA, tension de pas et de toucher.',
    engineeringFocusEn: 'Double-busbar architectures, symmetrical breaking capacity 40 kA, step and touch potential safety.',
    imageObj: engineeringAssets.substations.outdoorAis,
  },
  {
    id: 'distribution',
    nameFr: 'Distribution HTA / HNB',
    nameEn: 'Medium-Voltage Distribution',
    subtitleFr: 'Réseaux 30/20 kV, Cellules RMU & Postes H61',
    subtitleEn: '30/20 kV Grids, Ring Main Units & Distribution Substations',
    category: 'core_power',
    icon: Zap,
    angle: 68,
    distance: 270,
    connections: ['substations', 'buildings', 'industry', 'power_quality', 'renewables_microgrids'],
    standards: ['IEC 62271-200', 'IEC 60076', 'NF C 13-100'],
    keyEquipmentFr: ['Cellules RMU compactes', 'Transformateurs H61 160 kVA', 'Reclosers automatiques', 'Détecteurs de défauts FPI'],
    keyEquipmentEn: ['Compact Ring Main Units', 'Pole-mounted H61 transformers', 'Automatic reclosers', 'Fault passage indicators (FPI)'],
    engineeringFocusFr: 'Boucles ouvertes, régimes de neutre compensé Peterson/résistant, coordination isolement HTA/BT.',
    engineeringFocusEn: 'Open-loop topology, earthing resistor/Peterson coil tuning, MV/LV insulation coordination.',
    imageObj: engineeringAssets.distribution.rmuSwitchgear,
  },
  {
    id: 'buildings',
    nameFr: 'Bâtiments Tertiaires & BT',
    nameEn: 'Buildings & LV Systems',
    subtitleFr: 'Tableaux TGBT, Sélectivité Disjoncteurs & Schémas TT/TN',
    subtitleEn: 'LV Main Panels, Breaker Selectivity & Earthing TT/TN/IT',
    category: 'infrastructure',
    icon: Building2,
    angle: 85,
    distance: 310,
    connections: ['distribution', 'industry', 'low_current', 'safety', 'power_quality'],
    standards: ['IEC 60364', 'NF C 15-100', 'IEC 61439-1'],
    keyEquipmentFr: ['TGBT 3200 A', 'Disjoncteurs boîtier moulé', 'Inverseur de source normal/secours', 'Onduleurs UPS en ligne'],
    keyEquipmentEn: ['3200 A Main LV switchboard', 'MCCBs & ACBs', 'Automatic transfer switch (ATS)', 'Online double-conversion UPS'],
    engineeringFocusFr: 'Sélectivité chronométrique et ampèremétrique, protection des personnes par DDR, dimensionnement des canalisations.',
    engineeringFocusEn: 'Time-current selectivity, residual current RCD safety, cable thermal stress and voltage drop compliance.',
    imageObj: engineeringAssets.industry.industrialMcc,
  },
  {
    id: 'industry',
    nameFr: 'Installations Industrielles',
    nameEn: 'Industrial Installations',
    subtitleFr: 'MCC Moteurs, Variateurs VFD & Continuité Critique',
    subtitleEn: 'Motor Control Centers, VFD Drives & Critical Uptime',
    category: 'infrastructure',
    icon: Factory,
    angle: 102,
    distance: 270,
    connections: ['distribution', 'buildings', 'automation', 'power_quality', 'safety'],
    standards: ['IEC 61439-2', 'IEC 61800-3', 'IEC 60947'],
    keyEquipmentFr: ['Tiroirs débrochables MCC', 'Variateurs de fréquence 4Q', 'Batteries de condensateurs', 'Transformateurs d’isolement'],
    keyEquipmentEn: ['Withdrawable MCC drawers', '4-Quadrant VFDs', 'Power factor correction banks', 'Isolation transformers'],
    engineeringFocusFr: 'Démarrage direct vs progressif des moteurs, creux de tension, facteur de puissance tan(phi), ambiance sévère IP54/65.',
    engineeringFocusEn: 'Direct-on-line vs soft starters, voltage sag ride-through, cos(phi) power factor, rugged IP54/65 enclosures.',
    imageObj: engineeringAssets.industry.industrialMcc,
  },
  {
    id: 'automation',
    nameFr: 'Automatisme & SCADA',
    nameEn: 'Automation & SCADA',
    subtitleFr: 'Supervision DCS, Automates API/PLC & Bus de Terrain',
    subtitleEn: 'DCS Supervision, Industrial PLCs & Fieldbus Protocols',
    category: 'digital_control',
    icon: Sliders,
    angle: 119,
    distance: 320,
    connections: ['substations', 'industry', 'generation', 'smart_grids', 'ot_cybersecurity'],
    standards: ['IEC 61131-3', 'IEC 60870-5-104', 'Modbus TCP / DNP3'],
    keyEquipmentFr: ['Automates redondants SIL-3', 'Postes opérateurs SCADA', 'Passerelles RTU', 'Réseaux Ethernet temps réel'],
    keyEquipmentEn: ['Redundant SIL-3 PLCs', 'SCADA operator HMIs', 'RTU field gateways', 'Industrial deterministic Ethernet'],
    engineeringFocusFr: 'Boucles PID d’asservissement, détection d’états, télégravation des alarmes, horodatage absolu 1 ms.',
    engineeringFocusEn: 'PID closed-loop control, state telemetry, chronological alarm logging, 1 ms absolute SOE timestamping.',
    imageObj: engineeringAssets.automation.scadaControlRoom,
  },
  {
    id: 'low_current',
    nameFr: 'Courants Faibles & SSI',
    nameEn: 'Low-Current & Fire Safety',
    subtitleFr: 'Détection Incendie, Contrôle d’Accès & Câblage VDI',
    subtitleEn: 'Fire Detection Systems, Access Control & Structured Cabling',
    category: 'infrastructure',
    icon: Radio,
    angle: 136,
    distance: 270,
    connections: ['buildings', 'safety', 'automation'],
    standards: ['EN 54', 'ISO/IEC 11801', 'NF S 61-931'],
    keyEquipmentFr: ['Centrale CMSI / SSI', 'Détecteurs optiques de fumée', 'Baies de brassage Cat6A/Fibre', 'Contrôleurs de portes sécurisés'],
    keyEquipmentEn: ['Fire alarm control panel (FACP)', 'Optical smoke detectors', 'Cat6A/Fiber patch bays', 'Biometric door controllers'],
    engineeringFocusFr: 'Zonage de sécurité incendie, asservissement désenfumage, redondance des liens optiques, tenue au feu CR1.',
    engineeringFocusEn: 'Fire compartmentalization, smoke exhaust damper interlocks, optical link redundancy, fire-rated cabling.',
    imageObj: engineeringAssets.automation.iedProtectionRelay,
  },
  {
    id: 'ai_technology',
    nameFr: 'IA & Jumeaux Numériques',
    nameEn: 'AI & Digital Twins',
    subtitleFr: 'Maintenance Prédictive PHM, Réseaux Neuronaux & Algorithmes',
    subtitleEn: 'Predictive Maintenance PHM, Neural Forecasting & Edge ML',
    category: 'digital_control',
    icon: Cpu,
    angle: 153,
    distance: 320,
    connections: ['automation', 'smart_grids', 'asset_management', 'engineering_studies'],
    standards: ['IEC 61970 CIM', 'IEEE 1855', 'ISO 13374'],
    keyEquipmentFr: ['Serveurs de calcul Edge GPU', 'Capteurs vibratoires sans fil', 'Plateforme Jumeau Numérique', 'Modèles d’analyse DGA huile'],
    keyEquipmentEn: ['Edge GPU inferencing nodes', 'Wireless triaxial vibration sensors', 'Physics-informed digital twins', 'Transformer DGA AI models'],
    engineeringFocusFr: 'Estimation d’état dynamique, détection précoce des décharges partielles, prévision de charge par séries temporelles.',
    engineeringFocusEn: 'Dynamic state estimation, early partial discharge anomaly detection, time-series load forecasting.',
    imageObj: engineeringAssets.automation.scadaControlRoom,
  },
  {
    id: 'projects',
    nameFr: 'Ingénierie de Projets EPC',
    nameEn: 'EPC Project Engineering',
    subtitleFr: 'Cycle Projet, Études FEED, Achats & Essais FAT/SAT',
    subtitleEn: 'EPC Project Life Cycle, FEED Studies, Procurement & FAT/SAT',
    category: 'governance_methods',
    icon: FileCheck,
    angle: 170,
    distance: 260,
    connections: ['engineering_studies', 'regulation_markets', 'finance_esg', 'safety'],
    standards: ['FIDIC Yellow/Silver', 'ISO 21500', 'IEC 60076 (FAT)'],
    keyEquipmentFr: ['Spécifications techniques CCTP', 'Bordereaux de prix unitaires', 'Bancs d’essais usine FAT', 'Plannings chemin critique Primavera'],
    keyEquipmentEn: ['Technical specifications CCTP', 'Bill of quantities BOQ', 'Factory acceptance testing rigs (FAT)', 'Primavera critical path schedules'],
    engineeringFocusFr: 'De la phase conceptuelle à la mise en service industrielle, validation des garanties de performance thermique et acoustique.',
    engineeringFocusEn: 'From FEED through commissioning, strict verification of contractor performance guarantees and milestone acceptance.',
    imageObj: engineeringAssets.transformation.powerTransformer,
  },
  {
    id: 'engineering_studies',
    nameFr: 'Études de Réseau & Calculs',
    nameEn: 'Power System Studies',
    subtitleFr: 'Court-Circuit CEI 60909, Écoulement de Charge & Harmoniques',
    subtitleEn: 'IEC 60909 Short-Circuit, Load Flow & Harmonic Resonance',
    category: 'governance_methods',
    icon: Compass,
    angle: 187,
    distance: 310,
    connections: ['generation', 'transmission', 'substations', 'power_quality', 'ai_technology'],
    standards: ['IEC 60909', 'IEEE 399 (Brown Book)', 'IEC 61363'],
    keyEquipmentFr: ['Moteurs de calcul Newton-Raphson', 'Matrices d’impédance de court-circuit', 'Modèles thermiques de câbles', 'Abaques d’arc-flash IEEE 1584'],
    keyEquipmentEn: ['Newton-Raphson load-flow solvers', 'Short-circuit impedance matrices', 'Cable thermal sizing models', 'IEEE 1584 arc-flash calculators'],
    engineeringFocusFr: 'Calcul rigoureux de l’Icc max (pouvoir de coupure) et Icc min (protection), stabilité transitoire angulaire rotorique.',
    engineeringFocusEn: 'Rigorous calculation of max Icc (breaking capacity) and min Icc (trip sensitivity), transient rotor angle stability.',
    imageObj: engineeringAssets.transmission.corridor,
  },
  {
    id: 'regulation_markets',
    nameFr: 'Régulation & Marchés',
    nameEn: 'Regulation & Markets',
    subtitleFr: 'Codes de Réseau (Grid Code), Tarification & Régulation ARSEL',
    subtitleEn: 'Grid Codes, Wheeling Tariffs & Utility Regulation Frameworks',
    category: 'governance_methods',
    icon: Scale,
    angle: 204,
    distance: 270,
    connections: ['projects', 'finance_esg', 'smart_grids', 'transmission'],
    standards: ['EU Network Code', 'SONATREL Grid Code', 'Loi Électricité Cameroun 2011'],
    keyEquipmentFr: ['Compteurs de facturation 4 quadrants', 'Plateforme de règlement des écarts', 'Cahiers des charges de raccordement', 'Registres d’accès aux tiers'],
    keyEquipmentEn: ['4-Quadrant grid tariff meters', 'Imbalance settlement engine', 'Grid interconnection compliance rules', 'Open-access capacity register'],
    engineeringFocusFr: 'Contrats PPA de vente d’énergie, pénalités de puissance réactive tan(phi), obligations de réserve primaire et secondaire.',
    engineeringFocusEn: 'Power Purchase Agreements (PPA), reactive power penalties, mandatory primary/secondary frequency reserve delivery.',
    imageObj: engineeringAssets.automation.scadaControlRoom,
  },
  {
    id: 'smart_grids',
    nameFr: 'Réseaux Intelligents (Smart Grids)',
    nameEn: 'Smart Grids & Automation',
    subtitleFr: 'Norme CEI 61850, Messages GOOSE, SV & Compteurs AMI',
    subtitleEn: 'IEC 61850 Station Bus, GOOSE & Sampled Values Interoperability',
    category: 'digital_control',
    icon: Sparkles,
    angle: 221,
    distance: 330,
    connections: ['substations', 'transmission', 'renewables_microgrids', 'ai_technology', 'bess', 'ev_charging'],
    standards: ['IEC 61850-7-4', 'IEC 61850-9-2', 'IEEE C37.118 (PMU)'],
    keyEquipmentFr: ['Switchs Ethernet durcis PTP 1588', 'Unités de mesure phasorielle PMU', 'Relais IED communicants', 'Concentrateurs de données DCU'],
    keyEquipmentEn: ['Hardened PTP IEEE 1588 Ethernet switches', 'Phasor measurement units (PMUs)', 'Communicating digital IEDs', 'Data concentrators (DCU)'],
    engineeringFocusFr: 'Remplacement des fileries cuivre par bus process optique, synchronisation nanoseconde IEEE 1588v2, reconfiguration automatique FDIR.',
    engineeringFocusEn: 'Replacement of copper wiring with optical process bus, IEEE 1588v2 nanosecond timing, automated fault isolation (FDIR).',
    imageObj: engineeringAssets.substations.gisIndoor,
  },
  {
    id: 'renewables_microgrids',
    nameFr: 'Renouvelables & Micro-Réseaux',
    nameEn: 'Renewables & Microgrids',
    subtitleFr: 'Photovoltaïque, Éolien, Contrôleurs d’Îlotage & Onduleurs Formeurs',
    subtitleEn: 'PV, Wind, Islanding Controllers & Grid-Forming Inverters',
    category: 'core_power',
    icon: Flame,
    angle: 238,
    distance: 270,
    connections: ['generation', 'distribution', 'bess', 'smart_grids', 'power_quality'],
    standards: ['IEC 62116', 'IEEE 1547', 'IEC 62898 (Microgrids)'],
    keyEquipmentFr: ['Onduleurs formeurs de réseau (Grid-Forming)', 'Trackers solaires mono-axes', 'Système de délestage intelligent', 'Génératrices hybrides diesel-PV'],
    keyEquipmentEn: ['Grid-forming inverters (virtual inertia)', 'Single-axis solar tracking arrays', 'Fast load-shedding controller', 'Hybrid solar-diesel synchronizer'],
    engineeringFocusFr: 'Inertie synthétique, passage à vide îloté (islanding), gestion intermittence nuageuse, limitation rampe de puissance.',
    engineeringFocusEn: 'Synthetic virtual inertia, seamless islanded transition, cloud passage ramp-rate control and black-start capability.',
    imageObj: engineeringAssets.generation.solarPlant,
  },
  {
    id: 'bess',
    nameFr: 'Stockage par Batteries (BESS)',
    nameEn: 'Battery Storage (BESS)',
    subtitleFr: 'Containers LiFePO4, Onduleurs Bidirectionnels & Réglage de Fréquence',
    subtitleEn: 'Utility-Scale LiFePO4 Storage, 4-Quadrant PCS & Fast FCR',
    category: 'core_power',
    icon: BatteryCharging,
    angle: 255,
    distance: 310,
    connections: ['renewables_microgrids', 'smart_grids', 'substations', 'ev_charging'],
    standards: ['IEC 62933-5-2', 'NFPA 855', 'UL 9540A'],
    keyEquipmentFr: ['Racks batteries LFP 1500 V', 'Système de conversion PCS 4 quadrants', 'Système de gestion batterie BMS', 'Climatisation HVAC liquide & extinction Novec'],
    keyEquipmentEn: ['1500 V DC LFP battery racks', '4-Quadrant bi-directional PCS', 'Battery management system (BMS)', 'Liquid cooling thermal loops & clean gas fire suppression'],
    engineeringFocusFr: 'Réglage ultra-rapide de fréquence FCR (< 500 ms), écrêtement des pointes (peak shaving), arbitrage tarifaire journalier.',
    engineeringFocusEn: 'Sub-second frequency containment reserve (FCR), peak shaving, daily energy time-shifting and SoC balancing.',
    imageObj: engineeringAssets.storageAndEv.bessContainer,
  },
  {
    id: 'ev_charging',
    nameFr: 'Mobilité Électrique & Bornes IRVE',
    nameEn: 'EV Charging Infrastructure',
    subtitleFr: 'Superchargeurs 350 kW DC, Protocole ISO 15118 & Smart Charging',
    subtitleEn: '350 kW DC Fast Hubs, ISO 15118 Plug&Charge & Grid Impact',
    category: 'infrastructure',
    icon: Car,
    angle: 272,
    distance: 270,
    connections: ['distribution', 'bess', 'buildings', 'power_quality', 'smart_grids'],
    standards: ['IEC 61851-1/-23', 'ISO 15118', 'OCPP 2.0.1'],
    keyEquipmentFr: ['Bornes rapides DC Combo CCS2', 'Câbles refroidis par liquide', 'Transformateur dédié HTA/BT', 'Serveur de supervision OCPP'],
    keyEquipmentEn: ['CCS2 DC ultra-fast dispensers', 'Liquid-cooled charging cables', 'Dedicated MV step-down substation', 'OCPP 2.0.1 cloud dispatch broker'],
    engineeringFocusFr: 'Impact sur la courbe de charge du transformateur, gestion dynamique V1G/V2G, harmoniques de redressement triphasé.',
    engineeringFocusEn: 'Transformer thermal overload mitigation, dynamic V1G/V2G bidirectional throttling, harmonic distortion from rectifiers.',
    imageObj: engineeringAssets.storageAndEv.evFastHub,
  },
  {
    id: 'power_quality',
    nameFr: 'Qualité de l’Énergie (Power Quality)',
    nameEn: 'Power Quality & Harmonics',
    subtitleFr: 'Harmoniques THD, Creux de Tension CEI 61000 & Filtres Actifs',
    subtitleEn: 'Harmonics THD, Voltage Sags per IEC 61000 & Active Filters',
    category: 'core_power',
    icon: Activity,
    angle: 289,
    distance: 320,
    connections: ['industry', 'distribution', 'engineering_studies', 'renewables_microgrids', 'ev_charging'],
    standards: ['IEC 61000-4-30 Class A', 'IEEE 519', 'EN 50160'],
    keyEquipmentFr: ['Analyseurs d’énergie Classe A', 'Filtres actifs anti-harmoniques', 'Compensateurs synchrones statiques STATCOM', 'Bobines anti-résonance'],
    keyEquipmentEn: ['Class A power quality recorders', 'Active harmonic power filters (APF)', 'STATCOM voltage stabilizers', 'Detuned capacitor reactor banks'],
    engineeringFocusFr: 'Limitation du THD-U < 5% et THD-I, correction du facteur de puissance, élimination des résonances parallèles L-C.',
    engineeringFocusEn: 'Restricting voltage THD < 5% per IEEE 519, reactive compensation, preventing LC parallel harmonic resonance.',
    imageObj: engineeringAssets.industry.vfdDrive,
  },
  {
    id: 'asset_management',
    nameFr: 'Gestion d’Actifs & Maintenance',
    nameEn: 'Asset Management & Reliability',
    subtitleFr: 'Norme ISO 55000, Diagnostic DGA Huile & Analyse RCM',
    subtitleEn: 'ISO 55000 Asset Life, Dissolved Gas DGA & RCM Maintenance',
    category: 'governance_methods',
    icon: BarChart3,
    angle: 306,
    distance: 270,
    connections: ['transformation', 'substations', 'ai_technology', 'finance_esg'],
    standards: ['ISO 55000', 'IEEE C57.104', 'CIGRE TB 761'],
    keyEquipmentFr: ['Spectromètres d’analyse d’huile', 'Caméras thermographiques IR', 'Caméras acoustiques ultra-sons', 'Plateforme GMAO Maximo/SAP PM'],
    keyEquipmentEn: ['Online DGA gas monitors', 'Infrared thermography imagers', 'Ultrasonic corona/acoustic cameras', 'Enterprise CMMS maintenance suites'],
    engineeringFocusFr: 'Courbe de baignoire du matériel électrique, indice de santé de transformateur (Health Index), calcul du coût total de possession TCO.',
    engineeringFocusEn: 'Bathtub reliability curve, transformer Fleet Health Index, life-extension overhaul decisions and TCO minimization.',
    imageObj: engineeringAssets.transformation.buchholzRelay,
  },
  {
    id: 'safety',
    nameFr: 'Sécurité & Habilitations Électriques',
    nameEn: 'Electrical Safety & Clearances',
    subtitleFr: 'Norme NF C 18-510, Habilitations B2V/H2V, Arc-Flash & IEEE 80',
    subtitleEn: 'NF C 18-510 Standards, B2V/H2V Licensure, Arc-Flash & IEEE 80',
    category: 'governance_methods',
    icon: ShieldCheck,
    angle: 323,
    distance: 310,
    connections: ['substations', 'transmission', 'distribution', 'buildings', 'industry'],
    standards: ['NF C 18-510', 'IEEE 1584 (Arc Flash)', 'IEEE 80 (Grounding)'],
    keyEquipmentFr: ['EPI catégorie 4 Arc-Flash 40 cal/cm²', 'Perches télescopiques VAT', 'Dispositifs de mise à la terre et en court-circuit (MALT/CC)', 'Cadenas de consignation LOTO'],
    keyEquipmentEn: ['Arc-Flash PPE Category 4 suits', 'Insulated voltage test poles (VAT)', 'Portable earth and short-circuit kits', 'Lockout-Tagout (LOTO) key interlocks'],
    engineeringFocusFr: 'Les 5 étapes incontournables de la consignation électrique, calcul d’énergie incidente d’arc, distances minimales d’approche DMA.',
    engineeringFocusEn: '5 golden rules of electrical isolation and lock-out, incident arc energy boundary sizing, minimum approach clearances.',
    imageObj: engineeringAssets.substations.circuitBreaker,
  },
  {
    id: 'ot_cybersecurity',
    nameFr: 'Cybersécurité Industrielle (OT)',
    nameEn: 'Industrial OT Cybersecurity',
    subtitleFr: 'Norme CEI 62443, Cloisonnement DMZ SCADA & Diodes de Données',
    subtitleEn: 'IEC 62443 Security Levels, Substation DMZ & Unidirectional Diodes',
    category: 'digital_control',
    icon: Lock,
    angle: 340,
    distance: 270,
    connections: ['substations', 'automation', 'smart_grids'],
    standards: ['IEC 62443-3-3', 'NERC CIP', 'ISO 27019'],
    keyEquipmentFr: ['Pare-feux industriels d’inspection profonde (DPI)', 'Diodes de données unidirectionnelles', 'Sondes de détection d’intrusion réseau (IDS)', 'Serveurs d’authentification Radius/Tacacs+'],
    keyEquipmentEn: ['Industrial deep-packet inspection firewalls', 'Hardware unidirectional data diodes', 'Network anomaly intrusion sensors (IDS)', 'Role-based access jump hosts & HSMs'],
    engineeringFocusFr: 'Isolation rigoureuse entre IT d’entreprise et OT de conduite temps réel, intégrité des trames GOOSE/MMS CEI 61850.',
    engineeringFocusEn: 'Purdue model zoning, micro-segmentation of substation networks, cryptographic signing of IEC 61850 control commands.',
    imageObj: engineeringAssets.automation.scadaControlRoom,
  },
  {
    id: 'finance_esg',
    nameFr: 'Finance, Économie & ESG',
    nameEn: 'Finance, Energy Economics & ESG',
    subtitleFr: 'Coût Égalisé de l’Énergie (LCOE), Investissements CAPEX/OPEX & Bilan Carbone',
    subtitleEn: 'Levelized Cost of Energy (LCOE), CAPEX/OPEX Modeling & ESG Impact',
    category: 'governance_methods',
    icon: TrendingUp,
    angle: 357,
    distance: 310,
    connections: ['projects', 'regulation_markets', 'renewables_microgrids', 'asset_management'],
    standards: ['IFRS / Taxonomy', 'GHG Protocol', 'IRENA Cost Metrics'],
    keyEquipmentFr: ['Modèles financiers sous Excel/Python', 'Logiciels de modélisation LCOE', 'Registres de crédits carbone vérifiés', 'Rapports d’audit environnemental IFC PS'],
    keyEquipmentEn: ['Project finance cash-flow models', 'LCOE optimization calculation suites', 'Carbon offset certificate registries', 'IFC Performance Standards compliance audits'],
    engineeringFocusFr: 'Taux de rentabilité interne (TRI), actualisation des flux de trésorerie sur 40 ans, optimisation du compromis CAPEX vs pertes Joule du réseau.',
    engineeringFocusEn: 'Internal rate of return (IRR), 40-year asset discount rates, balancing initial substation CAPEX against technical line losses.',
    imageObj: engineeringAssets.generation.solarPlant,
  },
];

interface EpedeEngineeringNetworkProps {
  locale: 'fr' | 'en';
  onSelectDomain?: (domainId: string) => void;
  onNavigateView?: (view: string) => void;
}

export const EpedeEngineeringNetwork: React.FC<EpedeEngineeringNetworkProps> = ({
  locale,
  onSelectDomain,
  onNavigateView,
}) => {
  const [selectedId, setSelectedId] = useState<string>('substations');

  const selectedDomain = useMemo(() => {
    return EPEDE_21_DOMAINS.find((d) => d.id === selectedId) || EPEDE_21_DOMAINS[3];
  }, [selectedId]);

  const connectedIds = useMemo(() => {
    return new Set(selectedDomain.connections);
  }, [selectedDomain]);

  // Center coordinate for SVG
  const centerX = 380;
  const centerY = 380;

  return (
    <section 
      id="epede-engineering-network"
      aria-label="EPEDE 21-Domain Connected Network"
      className="rounded-3xl bg-slate-950 text-slate-100 border border-slate-800/80 p-5 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{locale === 'fr' ? 'Écosystème Connecté 21 Domaines' : 'Connected 21-Domain Ecosystem'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase font-sans">
            {locale === 'fr' ? 'Réseau Topologique des Disciplines EPEDE' : 'EPEDE Engineering Topology Network'}
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl font-mono leading-relaxed">
            {locale === 'fr'
              ? 'L’électrotechnique n’est pas un assemblage de silos isolés, mais un réseau physique et méthodologique interdépendant. Cliquez sur un nœud pour observer ses flux, normes et connexions.'
              : 'Electrical power engineering is not a siloed field, but an interconnected physical and methodological graph. Select any discipline to see active dependencies, standards, and equipment.'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span>{locale === 'fr' ? 'Sélectionné' : 'Selected'}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
            <span>{locale === 'fr' ? 'Interconnecté' : 'Connected'}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-500">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span>{locale === 'fr' ? 'Veille' : 'Passive'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Topology Canvas (Left) + Detail Inspector (Right) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left: Interactive Radial Graph Canvas */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-2 sm:p-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[460px] sm:min-h-[560px] shadow-inner">
          <div className="w-full max-w-[540px] aspect-square relative flex items-center justify-center">
            
            {/* SVG Lines Layer */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 760 760"
            >
              <defs>
                <linearGradient id="activeEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#D97706" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="dimEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#334155" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#1E293B" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Concentric orbital guide circles */}
              <circle cx={centerX} cy={centerY} r="180" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={centerX} cy={centerY} r="270" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx={centerX} cy={centerY} r="330" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />

              {/* Edge Connections between nodes */}
              {EPEDE_21_DOMAINS.map((node) => {
                const angleRad = (node.angle * Math.PI) / 180;
                const nodeX = centerX + node.distance * Math.cos(angleRad);
                const nodeY = centerY + node.distance * Math.sin(angleRad);

                // Draw edge from center to this node
                const isSelected = node.id === selectedId;
                const isConnected = connectedIds.has(node.id);

                return (
                  <g key={`edges-${node.id}`}>
                    {/* Line from center EPEDE hub */}
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={nodeX}
                      y2={nodeY}
                      stroke={isSelected ? 'url(#activeEdge)' : isConnected ? '#F59E0B40' : '#1E293B40'}
                      strokeWidth={isSelected ? 2.5 : isConnected ? 1.5 : 0.8}
                    />

                    {/* Inter-node edges for selected node */}
                    {isSelected && node.connections.map((targetId) => {
                      const target = EPEDE_21_DOMAINS.find(d => d.id === targetId);
                      if (!target) return null;
                      const targetAngleRad = (target.angle * Math.PI) / 180;
                      const targetX = centerX + target.distance * Math.cos(targetAngleRad);
                      const targetY = centerY + target.distance * Math.sin(targetAngleRad);

                      return (
                        <line
                          key={`inter-${node.id}-${targetId}`}
                          x1={nodeX}
                          y1={nodeY}
                          x2={targetX}
                          y2={targetY}
                          stroke="#F59E0B"
                          strokeWidth="1.8"
                          strokeDasharray="4 2"
                          className="animate-pulse"
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>

            {/* Center Core Node: EPEDE */}
            <div 
              className="absolute z-20 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-slate-900 border-2 border-amber-500 shadow-xl shadow-amber-500/20 flex flex-col items-center justify-center text-center p-1.5 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onNavigateView?.('journey')}
              title="EPEDE CORE HUB"
            >
              <span className="font-mono text-base sm:text-lg font-black text-amber-400 leading-none">
                E⚡
              </span>
              <span className="font-mono text-[9px] font-bold text-white uppercase tracking-widest mt-0.5">
                EPEDE
              </span>
              <span className="text-[7px] font-mono text-slate-400 uppercase leading-none">
                Core Hub
              </span>
            </div>

            {/* 21 Orbiting Domain Nodes */}
            {EPEDE_21_DOMAINS.map((node) => {
              const angleRad = (node.angle * Math.PI) / 180;
              // Map 760x760 SVG coordinate space to percentage (0% to 100%)
              const posX = ((centerX + node.distance * Math.cos(angleRad)) / 760) * 100;
              const posY = ((centerY + node.distance * Math.sin(angleRad)) / 760) * 100;

              const isSelected = node.id === selectedId;
              const isConnected = connectedIds.has(node.id);
              const NodeIcon = node.icon;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(node.id);
                    onSelectDomain?.(node.id);
                  }}
                  style={{
                    left: `${posX}%`,
                    top: `${posY}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute z-30 group transition-all duration-200 focus:outline-none ${
                    isSelected
                      ? 'scale-125 z-40'
                      : isConnected
                      ? 'scale-110 opacity-100'
                      : 'opacity-40 hover:opacity-100 hover:scale-110'
                  }`}
                  aria-label={locale === 'fr' ? node.nameFr : node.nameEn}
                  title={`${locale === 'fr' ? node.nameFr : node.nameEn}`}
                >
                  <div className={`p-2 sm:p-2.5 rounded-full border transition-all flex items-center justify-center ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-white shadow-lg shadow-amber-500/40 ring-4 ring-amber-500/30'
                      : isConnected
                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/80 shadow-md shadow-amber-900/30'
                      : 'bg-slate-900/90 text-slate-400 border-slate-700 hover:border-slate-500'
                  }`}>
                    <NodeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Domain Pill Slider (Mobile Friendly alternative) */}
          <div className="w-full mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
            {EPEDE_21_DOMAINS.map((d) => (
              <button
                key={`pill-${d.id}`}
                type="button"
                onClick={() => {
                  setSelectedId(d.id);
                  onSelectDomain?.(d.id);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-all shrink-0 ${
                  d.id === selectedId
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : connectedIds.has(d.id)
                    ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {locale === 'fr' ? d.nameFr.split(' ')[0] : d.nameEn.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Rich Engineering Inspector Panel */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
          
          {/* Real Engineering Photography Banner */}
          <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-slate-950">
            <img
              src={getEngineeringImageUrl(selectedDomain.imageObj)}
              alt={locale === 'fr' ? selectedDomain.imageObj.altFr : selectedDomain.imageObj.altEn}
              className="w-full h-full object-cover opacity-80 brightness-95 transition-all duration-700"
              loading="lazy"
              onError={(e) => {
                // Fallback to safe substation photograph
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            
            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-950/90 text-amber-400 border border-amber-500/30 font-bold uppercase tracking-wider">
                {selectedDomain.imageObj.voltageClass || 'DISCIPLINE'}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-950/90 text-slate-300 border border-slate-700 font-medium">
                {selectedDomain.imageObj.standardRef || 'CEI / IEEE'}
              </span>
            </div>

            {/* Bottom Title on Image */}
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-amber-400 font-black tracking-widest uppercase">
                  EPEDE // {selectedDomain.id.toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                {locale === 'fr' ? selectedDomain.nameFr : selectedDomain.nameEn}
              </h3>
            </div>
          </div>

          {/* Details & Engineering Metadata */}
          <div className="p-5 sm:p-6 space-y-5 flex-1 flex flex-col justify-between">
            
            {/* Subtitle & Focus */}
            <div className="space-y-3">
              <p className="text-xs font-mono text-amber-400/90 font-medium">
                {locale === 'fr' ? selectedDomain.subtitleFr : selectedDomain.subtitleEn}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-white block mb-1 font-mono uppercase text-[11px] text-amber-400">
                  {locale === 'fr' ? "Objet d'Ingénierie :" : 'Engineering Focus :'}
                </span>
                {locale === 'fr' ? selectedDomain.engineeringFocusFr : selectedDomain.engineeringFocusEn}
              </p>
            </div>

            {/* Key Equipment */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-amber-500" />
                <span>{locale === 'fr' ? 'Équipements Clés :' : 'Key Physical Equipment :'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {(locale === 'fr' ? selectedDomain.keyEquipmentFr : selectedDomain.keyEquipmentEn).map((eq, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 text-[11px] flex items-center gap-1.5 truncate">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="truncate">{eq}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Normes & Standards */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                <span>{locale === 'fr' ? 'Cadre Normatif Référentiel :' : 'Governing Standards :'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {selectedDomain.standards.map((st, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/60 font-semibold">
                    {st}
                  </span>
                ))}
              </div>
            </div>

            {/* Connected Disciplines */}
            <div className="space-y-1.5 pt-1 border-t border-slate-800">
              <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">
                {locale === 'fr' ? 'Interconnexions Actives (' + selectedDomain.connections.length + ') :' : 'Active Dependencies (' + selectedDomain.connections.length + ') :'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedDomain.connections.map((connId) => {
                  const target = EPEDE_21_DOMAINS.find(d => d.id === connId);
                  if (!target) return null;
                  return (
                    <button
                      key={connId}
                      type="button"
                      onClick={() => {
                        setSelectedId(connId);
                        onSelectDomain?.(connId);
                      }}
                      className="px-2 py-0.5 rounded-md bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-800/50 text-[10px] font-mono transition-colors flex items-center gap-1"
                    >
                      <span>→</span>
                      <span>{locale === 'fr' ? target.nameFr : target.nameEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateView?.('domains')}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99]"
              >
                <span>{locale === 'fr' ? 'Explorer la Fiche Détaillée & Abaques' : 'Open Comprehensive Domain Datasheet'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
