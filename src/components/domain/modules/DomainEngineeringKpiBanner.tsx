// src/components/domain/modules/DomainEngineeringKpiBanner.tsx
import React from 'react';
import { 
  Zap, 
  Activity, 
  Gauge, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Flame, 
  CheckCircle2, 
  ExternalLink,
  Box,
  Battery,
  Award,
  Clock,
  Compass
} from 'lucide-react';
import type { DomainCode } from '../../../types/epede';
import { ALL_CANONICAL_EQUIPMENT } from '../../../data/equipment/canonicalEquipmentRegistry';

interface DomainEngineeringKpiBannerProps {
  domainCode: DomainCode;
  locale: 'fr' | 'en';
  onSelectEquipment?: (id: string) => void;
  onNavigateView?: (view: string) => void;
}

interface DomainKpiData {
  titleFr: string;
  titleEn: string;
  kpis: Array<{
    labelFr: string;
    labelEn: string;
    value: string;
    unit?: string;
    sublabelFr?: string;
    sublabelEn?: string;
    accent: 'cyan' | 'amber' | 'emerald' | 'rose' | 'purple';
  }>;
  standards: string[];
  equipmentFocusTags: string[];
}

const DOMAIN_KPIS_REGISTRY: Record<string, DomainKpiData> = {
  D01: {
    titleFr: 'Indicateurs d’Ingénierie & Métriques de Production Électrique',
    titleEn: 'Generation Engineering Indicators & Output Metrics',
    kpis: [
      { labelFr: 'Capacité Nominale', labelEn: 'Rated Capacity', value: '48.0', unit: 'MVA', sublabelFr: 'Alternateur Synchrone', sublabelEn: 'Synchronous Alternator', accent: 'cyan' },
      { labelFr: 'Tension Statorique', labelEn: 'Stator Voltage', value: '11.0', unit: 'kV', sublabelFr: 'Couplage Étoile', sublabelEn: 'Star-Connected', accent: 'amber' },
      { labelFr: 'Constante d’Inertie (H)', labelEn: 'Inertia Constant (H)', value: '3.8', unit: 's', sublabelFr: 'Inertie mécanique rotor', sublabelEn: 'Rotor Mechanical Inertia', accent: 'purple' },
      { labelFr: 'Facteur de Puissance', labelEn: 'Power Factor', value: '0.85', unit: 'cos φ', sublabelFr: 'Diagramme P-Q CEI 60034', sublabelEn: 'IEC 60034 P-Q Curve', accent: 'emerald' },
      { labelFr: 'Rendement Global (η)', labelEn: 'Overall Efficiency (η)', value: '94.2', unit: '%', sublabelFr: 'Turbine Francis + GSU', sublabelEn: 'Francis Turbine + GSU', accent: 'cyan' },
      { labelFr: 'Temps de Démarrage', labelEn: 'Black-Start Time', value: '< 180', unit: 's', sublabelFr: 'Reprise sur réseau mort', sublabelEn: 'Dead Grid Restoration', accent: 'rose' }
    ],
    standards: ['CEI 60034-1', 'CEI 60034-3', 'IEEE 421.5', 'CEI 61362'],
    equipmentFocusTags: ['eq-exp-hydro-gen-01', 'eq-exp-gsu-trafo-01', 'eq-exp-gis-bay-225k']
  },
  D02: {
    titleFr: 'Architecture Réseau, Écoulement de Charge & Stabilité Dynamique',
    titleEn: 'Power-System Architecture, Power Flow & Dynamic Stability',
    kpis: [
      { labelFr: 'Fréquence Consigne (fn)', labelEn: 'Nominal Frequency (fn)', value: '50.00', unit: 'Hz', sublabelFr: 'Bande d\'exploitation ±0.15 Hz', sublabelEn: 'Operating Band ±0.15 Hz', accent: 'cyan' },
      { labelFr: 'Puissance Transitée', labelEn: 'Corridor Power Flow', value: '380', unit: 'MW', sublabelFr: 'Corridor RIS Songloulou-Douala', sublabelEn: 'RIS Songloulou-Douala Trunk', accent: 'amber' },
      { labelFr: 'Critère de Sécurité', labelEn: 'Contingency Criterion', value: 'N - 1', unit: '', sublabelFr: 'Perte ligne 225 kV admissible', sublabelEn: 'Single 225 kV Line Loss Withstand', accent: 'rose' },
      { labelFr: 'Réserve Primaire', labelEn: 'Primary Spinning Reserve', value: '45', unit: 'MW', sublabelFr: 'Réponse rapide statisme 4%', sublabelEn: 'Fast Droop 4% Response', accent: 'emerald' },
      { labelFr: 'Pertes Réseau THT', labelEn: 'Transmission Joule Losses', value: '2.4', unit: '%', sublabelFr: 'Optimisation dispatching Newton-Raphson', sublabelEn: 'Newton-Raphson Optimal Dispatch', accent: 'purple' },
      { labelFr: 'Angle de Transport (δ)', labelEn: 'Rotor Angle (δ)', value: '28.5', unit: '°', sublabelFr: 'Marge de stabilité transitoire', sublabelEn: 'Transient Stability Margin', accent: 'cyan' }
    ],
    standards: ['CEI 61970 (CIM)', 'IEEE 399', 'UCTE / ENTSO-E', 'CEI 60909'],
    equipmentFocusTags: ['eq-exp-tower-225kv', 'eq-exp-sub-trafo-225-30', 'eq-exp-gis-bay-225k']
  },
  D03: {
    titleFr: 'Lignes Aériennes THT, Faisceaux Conducteurs & Câbles OPGW',
    titleEn: 'Overhead EHV Transmission Lines, Conductor Bundles & OPGW',
    kpis: [
      { labelFr: 'Tension Nominale (Un)', labelEn: 'Nominal Voltage (Un)', value: '225', unit: 'kV', sublabelFr: 'Corridor Interconnexion RIS', sublabelEn: 'Interconnected RIS Corridor', accent: 'cyan' },
      { labelFr: 'Capacité Thermique', labelEn: 'Thermal Current Limit', value: '850', unit: 'A', sublabelFr: 'Faisceau Almelec-Acier Aster 570', sublabelEn: 'Aster 570 AAAC Bundle', accent: 'amber' },
      { labelFr: 'Puissance Naturelle (SIL)', labelEn: 'Surge Impedance Load', value: '135', unit: 'MW', sublabelFr: 'Impédance d\'onde Zc = 375 Ω', sublabelEn: 'Surge Impedance Zc = 375 Ω', accent: 'purple' },
      { labelFr: 'Longueur de Portée', labelEn: 'Average Span Length', value: '380', unit: 'm', sublabelFr: 'Pylônes métalliques treillis', sublabelEn: 'Lattice Steel Towers', accent: 'emerald' },
      { labelFr: 'Fibre Optique OPGW', labelEn: 'OPGW Optical Fibers', value: '48', unit: 'FO', sublabelFr: 'G.652D téléprotection & SCADA', sublabelEn: 'G.652D Teleprotection & SCADA', accent: 'cyan' },
      { labelFr: 'Pertes Couronne (Corona)', labelEn: 'Corona Losses', value: '< 1.5', unit: 'kW/km', sublabelFr: 'En régime sec de référence', sublabelEn: 'Dry Weather Baseline', accent: 'rose' }
    ],
    standards: ['CEI 60826', 'Cigré TB 384', 'IEEE 738', 'CEI 61089'],
    equipmentFocusTags: ['eq-exp-tower-225kv', 'eq-exp-statcom-mmc-50mvar', 'eq-exp-ct-225k']
  },
  D04: {
    titleFr: 'Spécifications de Tenue & Grandeurs Assignées du Poste HTB',
    titleEn: 'HV Substation Withstand Specs & Rated Characteristics',
    kpis: [
      { labelFr: 'Tension Assignée (Ur)', labelEn: 'Rated Voltage (Ur)', value: '245', unit: 'kV', sublabelFr: 'Réseau 225 kV THT', sublabelEn: '225 kV EHV Grid', accent: 'cyan' },
      { labelFr: 'Pouvoir de Coupure (Isc)', labelEn: 'Breaking Capacity (Isc)', value: '40.0', unit: 'kA', sublabelFr: 'Durée tk = 1.0 s', sublabelEn: 'Duration tk = 1.0 s', accent: 'rose' },
      { labelFr: 'Tenue au Choc (BIL)', labelEn: 'Impulse Withstand (BIL)', value: '1050', unit: 'kV', sublabelFr: 'Onde 1.2/50 µs', sublabelEn: '1.2/50 µs Waveform', accent: 'purple' },
      { labelFr: 'Courant Assigné (Ir)', labelEn: 'Rated Current (Ir)', value: '3150', unit: 'A', sublabelFr: 'Jeu de Barres Principal', sublabelEn: 'Main Busbar System', accent: 'amber' },
      { labelFr: 'Pression SF6 / GIS', labelEn: 'SF6 Gas Pressure', value: '0.60', unit: 'MPa', sublabelFr: 'Surveillance densistat', sublabelEn: 'Density Monitor Alert', accent: 'emerald' },
      { labelFr: 'Latence GOOSE (CEI 61850)', labelEn: 'GOOSE Latency', value: '< 2.5', unit: 'ms', sublabelFr: 'Déclenchement inter-baies', sublabelEn: 'Inter-Bay Tripping', accent: 'cyan' }
    ],
    standards: ['CEI 62271-100', 'CEI 62271-203', 'CEI 60076', 'CEI 61850'],
    equipmentFocusTags: ['eq-exp-sub-trafo-225-30', 'eq-exp-gis-bay-225k', 'eq-exp-ct-225k', 'eq-exp-relay-ied-61850']
  },
  D05: {
    titleFr: 'Réseaux de Distribution HTA, Postes de Coupure & Qualité de Fourniture',
    titleEn: 'MV Distribution Grids, RMU Switching Stations & Service Continuity',
    kpis: [
      { labelFr: 'Tension Réseau HTA', labelEn: 'MV System Voltage', value: '30 / 15', unit: 'kV', sublabelFr: 'Distribution Urbaine & Rurale', sublabelEn: 'Urban & Rural Distribution', accent: 'cyan' },
      { labelFr: 'Temps Coupure SAIDI', labelEn: 'SAIDI Interruption Index', value: '120', unit: 'min / an', sublabelFr: 'Indicateur moyen de continuité', sublabelEn: 'System Average Interruption', accent: 'amber' },
      { labelFr: 'Fréquence Coupure SAIFI', labelEn: 'SAIFI Frequency Index', value: '1.8', unit: 'défauts/an', sublabelFr: 'Coupures longues > 3 min', sublabelEn: 'Long Outages > 3 min', accent: 'rose' },
      { labelFr: 'Temps Reconfiguration FLISR', labelEn: 'FLISR Self-Healing Time', value: '< 45', unit: 's', sublabelFr: 'Isolement & rebouclage auto', sublabelEn: 'Auto Fault Isolation & Restoration', accent: 'emerald' },
      { labelFr: 'Courant Défaut Terre (Io)', labelEn: 'Ground Fault Current (Io)', value: '300', unit: 'A', sublabelFr: 'Limitation par résistance de neutre', sublabelEn: 'Limited by Neutral Resistor NGR', accent: 'purple' },
      { labelFr: 'Taux de Charge Feeder', labelEn: 'Feeder Loading Rate', value: '68', unit: '%', sublabelFr: 'Capacité de réserve pour secours', sublabelEn: 'N-1 Backup Transfer Margin', accent: 'cyan' }
    ],
    standards: ['CEI 62271-200', 'IEEE 1366', 'CEI 60364-5-52', 'NF C 13-100'],
    equipmentFocusTags: ['eq-exp-cell-mv-30k', 'eq-exp-kiosk-30kv-400v', 'eq-exp-ami-smartmeter-3p']
  },
  D06: {
    titleFr: 'Dimensionnement Électrodynamique & Sécurité Basse Tension (TGBT)',
    titleEn: 'LV Switchboard Electrodynamic Sizing & Safety Parameters',
    kpis: [
      { labelFr: 'Tension Nominale (Un)', labelEn: 'Nominal Voltage (Un)', value: '400 / 230', unit: 'V', sublabelFr: 'Régimes TT / TN-S / IT', sublabelEn: 'TT / TN-S / IT Regimes', accent: 'cyan' },
      { labelFr: 'Courant Assigné TGBT (In)', labelEn: 'TGBT Incomer Rating (In)', value: '2500', unit: 'A', sublabelFr: 'Disjoncteur ACB Débrochable', sublabelEn: 'Drawout ACB Breaker', accent: 'amber' },
      { labelFr: 'Pouvoir de Coupure (Icu)', labelEn: 'Breaking Capacity (Icu)', value: '65.0', unit: 'kA', sublabelFr: 'Tenue C-C TGBT (1s)', sublabelEn: '1s Withstand Capacity', accent: 'rose' },
      { labelFr: 'Chute de Tension Max (ΔU)', labelEn: 'Max Voltage Drop (ΔU)', value: '2.8', unit: '%', sublabelFr: 'NF C 15-100 (Max 5.0%)', sublabelEn: 'IEC 60364 (Max 5.0%)', accent: 'emerald' },
      { labelFr: 'Indice Protection', labelEn: 'Ingress Protection', value: 'IP 54 / IK 10', unit: '', sublabelFr: 'Enveloppe industrielle', sublabelEn: 'Industrial Enclosure', accent: 'purple' },
      { labelFr: 'Forme de Séparation', labelEn: 'Internal Separation', value: 'Forme 4b', unit: 'CEI 61439', sublabelFr: 'Cloisonnement total', sublabelEn: 'Full Compartmentalization', accent: 'cyan' }
    ],
    standards: ['CEI 61439-1 & 2', 'NF C 15-100', 'CEI 60364-5-52', 'CEI 60947-2'],
    equipmentFocusTags: ['eq-exp-tgbt-main-400v', 'eq-exp-kiosk-30kv-400v', 'eq-exp-motor-ind-250kw']
  },
  D07: {
    titleFr: 'Automatisme Industriel, Systèmes DCS & Sécurité Fonctionnelle SIL',
    titleEn: 'Industrial Automation, DCS Systems & SIL Functional Safety',
    kpis: [
      { labelFr: 'Temps de Cycle API (PLC)', labelEn: 'PLC Task Cycle Time', value: '8.5', unit: 'ms', sublabelFr: 'Exécution CEI 61131-3', sublabelEn: 'IEC 61131-3 Runtime', accent: 'cyan' },
      { labelFr: 'Intégrité Sécurité (SIL)', labelEn: 'Safety Integrity Level', value: 'SIL 3', unit: 'CEI 61508', sublabelFr: 'Système d\'arrêt d\'urgence ESD', sublabelEn: 'Emergency Shutdown ESD', accent: 'rose' },
      { labelFr: 'Disponibilité DCS', labelEn: 'DCS Availability', value: '99.995', unit: '%', sublabelFr: 'Architecture CPU 1oo2D redondante', sublabelEn: '1oo2D Redundant Architecture', accent: 'emerald' },
      { labelFr: 'Points d\'E/S Gérés', labelEn: 'Configured I/O Points', value: '1850', unit: 'voies', sublabelFr: 'DI / DO / AI / AO terrain', sublabelEn: 'Field I/O Capacity', accent: 'amber' },
      { labelFr: 'Réseau Bus de Terrain', labelEn: 'Fieldbus Network', value: '100', unit: 'Mbps', sublabelFr: 'Profinet IRT / Modbus TCP', sublabelEn: 'Profinet IRT / Modbus TCP', accent: 'purple' },
      { labelFr: 'MTBF Électronique', labelEn: 'Hardware MTBF', value: '> 150', unit: 'k-heures', sublabelFr: 'Composants tropicalisés vernis', sublabelEn: 'Conformal Coated Components', accent: 'cyan' }
    ],
    standards: ['CEI 61131-3', 'CEI 61508', 'CEI 62061', 'ISA-88'],
    equipmentFocusTags: ['eq-exp-motor-ind-250kw', 'eq-exp-switch-iec62443', 'eq-exp-relay-ied-61850']
  },
  D08: {
    titleFr: 'Courants Faibles, Alimentations Secourues CC & Télégestion Bâtiment',
    titleEn: 'Extra Low Voltage, Secure DC Power & Building Management (BMS)',
    kpis: [
      { labelFr: 'Tensioncontinue Poste', labelEn: 'Substation DC Bus', value: '110 / 48', unit: 'V CC', sublabelFr: 'Batterie stationnaire plomb étanche', sublabelEn: 'Stationary VRLA Battery', accent: 'cyan' },
      { labelFr: 'Autonomie Secourue', labelEn: 'Backup Autonomy', value: '8.0', unit: 'heures', sublabelFr: 'Alimentation IED & bobines décl.', sublabelEn: 'IEDs & Trip Coils Autonomy', accent: 'amber' },
      { labelFr: 'Protocole GTB/BMS', labelEn: 'BMS Building Protocol', value: 'BACnet / IP', unit: '', sublabelFr: 'Supervision HVAC & énergie', sublabelEn: 'HVAC & Energy Management', accent: 'emerald' },
      { labelFr: 'Extinction Incendie', labelEn: 'Fire Suppression Gas', value: 'Inergen 300', unit: 'bar', sublabelFr: 'Gaz inerte non destructif salles relais', sublabelEn: 'Clean Agent Relay Room Protection', accent: 'rose' },
      { labelFr: 'Contrôle d\'Accès Sécurisé', labelEn: 'Access Control Security', value: 'RFID / Biométrie', unit: '', sublabelFr: 'Conformité sûreté périmétrique', sublabelEn: 'Perimeter Security Compliance', accent: 'purple' },
      { labelFr: 'Onduleur ASI (UPS)', labelEn: 'Online UPS Inverter', value: '40', unit: 'kVA', sublabelFr: 'Double conversion VFI-SS-111', sublabelEn: 'True Double-Conversion VFI', accent: 'cyan' }
    ],
    standards: ['NF C 13-100', 'CEI 60896', 'NFPA 72', 'EN 54'],
    equipmentFocusTags: ['eq-exp-switch-iec62443', 'eq-exp-tgbt-main-400v', 'eq-exp-ami-smartmeter-3p']
  },
  D09: {
    titleFr: 'Métriques d’Exploitation BESS, Smart Grid & Stockage d’Énergie',
    titleEn: 'BESS, Smart Grid & Energy Storage Operational Metrics',
    kpis: [
      { labelFr: 'Puissance Nominale PCS', labelEn: 'PCS Rated Power', value: '5.0', unit: 'MW', sublabelFr: 'Onduleur 4-Quadrants SiC', sublabelEn: '4-Quadrant SiC Inverter', accent: 'cyan' },
      { labelFr: 'Énergie Embarquée', labelEn: 'Installed Energy', value: '10.0', unit: 'MWh', sublabelFr: 'Cellules LFP 280Ah (2C)', sublabelEn: '280Ah LFP Cells (2C)', accent: 'emerald' },
      { labelFr: 'Rendement Aller-Retour (RTE)', labelEn: 'Round-Trip Efficiency', value: '89.5', unit: '%', sublabelFr: 'Cycle charge/décharge AC-AC', sublabelEn: 'AC-to-AC Cycle Efficiency', accent: 'purple' },
      { labelFr: 'Temps de Réponse FFR', labelEn: 'FFR Response Time', value: '< 20', unit: 'ms', sublabelFr: 'Inertie synthétique PLL', sublabelEn: 'Synthetic Inertia Emulation', accent: 'amber' },
      { labelFr: 'Cyclabilité Garantie', labelEn: 'Cycle Life Expectancy', value: '6000', unit: 'cycles', sublabelFr: 'À 80% DoD / 25°C', sublabelEn: 'At 80% DoD / 25°C', accent: 'cyan' },
      { labelFr: 'Taux de Dégradation SEI', labelEn: 'Capacity Fade Rate', value: '1.2', unit: '% / an', sublabelFr: 'Refroidissement liquide actif', sublabelEn: 'Active Liquid Thermal Mgt', accent: 'rose' }
    ],
    standards: ['CEI 62933-2-1', 'IEEE 2800', 'NFPA 855', 'CEI 62619'],
    equipmentFocusTags: ['eq-exp-bess-container-5mw', 'eq-exp-statcom-mmc-50mvar', 'eq-exp-switch-iec62443']
  },
  D10: {
    titleFr: 'Infrastructures de Recharge Haute Puissance (HPC) & Mobilité Électrique',
    titleEn: 'High-Power EV Charging (HPC) & E-Mobility Grid Integration',
    kpis: [
      { labelFr: 'Puissance Borne HPC', labelEn: 'HPC Unit Power', value: '350', unit: 'kW', sublabelFr: 'Refroidissement liquide câble', sublabelEn: 'Liquid-Cooled Cable System', accent: 'cyan' },
      { labelFr: 'Tension DC Sortie', labelEn: 'Output DC Voltage', value: '200 – 1000', unit: 'V CC', sublabelFr: 'Compatible architecture 800V', sublabelEn: '800V Architecture Ready', accent: 'amber' },
      { labelFr: 'Courant Max de Charge', labelEn: 'Max Charge Current', value: '500', unit: 'A', sublabelFr: 'Connecteur CCS Combo 2', sublabelEn: 'CCS Combo 2 Connector', accent: 'rose' },
      { labelFr: 'Rendement Conversion AC/DC', labelEn: 'Conversion Efficiency', value: '96.5', unit: '%', sublabelFr: 'Étage SiC bidirectionnel', sublabelEn: 'Bidirectional SiC Stage', accent: 'emerald' },
      { labelFr: 'Facteur de Puissance', labelEn: 'Input Power Factor', value: '> 0.99', unit: '', sublabelFr: 'PFC actif THDi < 3%', sublabelEn: 'Active PFC THDi < 3%', accent: 'purple' },
      { labelFr: 'Protocole V2G (ISO 15118)', labelEn: 'Vehicle-to-Grid Protocol', value: 'Plug & Charge', unit: '', sublabelFr: 'Support injection réseau V2G', sublabelEn: 'V2G Reverse Power Injection', accent: 'cyan' }
    ],
    standards: ['CEI 61851-1 & 23', 'ISO 15118', 'CEI 62196', 'IEEE 2030.5'],
    equipmentFocusTags: ['eq-exp-ev-hpc-350kw', 'eq-exp-bess-container-5mw', 'eq-exp-tgbt-main-400v']
  },
  D11: {
    titleFr: 'Coordination des Protections, Sélectivité & Études de Réseau',
    titleEn: 'Protection Coordination, Selectivity & Power System Studies',
    kpis: [
      { labelFr: 'Temps Déclenchement Instantané', labelEn: 'Instantaneous Trip Time', value: '< 25', unit: 'ms', sublabelFr: 'Protection différentielle 87', sublabelEn: '87 Differential Protection', accent: 'rose' },
      { labelFr: 'Intervalle Sélectif (CTI)', labelEn: 'Grading Margin (CTI)', value: '280', unit: 'ms', sublabelFr: 'Coordination ampèremétrique 51', sublabelEn: 'Overcurrent 51 Discrimination', accent: 'amber' },
      { labelFr: 'Zone Protection Distance', labelEn: 'Distance Zone 1 Reach', value: '85', unit: '%', sublabelFr: 'Couverture ligne sans temporisation', sublabelEn: 'Instantaneous Line Reach', accent: 'cyan' },
      { labelFr: 'Marge Saturation TC', labelEn: 'CT Saturation Factor', value: '> 2.0', unit: 'Ktd', sublabelFr: 'Tenue composante apériodique DC', sublabelEn: 'DC Transient Offset Withstand', accent: 'emerald' },
      { labelFr: 'Sélectivité Logique', labelEn: 'GOOSE Logic Interlocking', value: '< 3.0', unit: 'ms', sublabelFr: 'Blocage rapide amont busbar', sublabelEn: 'Fast Reverse Bus Interlocking', accent: 'purple' },
      { labelFr: 'Temps Élimination Arc Flash', labelEn: 'Arc Flash Clearing Time', value: '< 40', unit: 'ms', sublabelFr: 'Capteur optique boucle fibre', sublabelEn: 'Fiber Optical Arc Sensor', accent: 'rose' }
    ],
    standards: ['CEI 60255-151', 'IEEE C37.90', 'IEEE C37.110', 'IEEE 242'],
    equipmentFocusTags: ['eq-exp-relay-ied-61850', 'eq-exp-ct-225k', 'eq-exp-gis-bay-225k']
  },
  D12: {
    titleFr: 'Contrôle-Commande Numérique (SCADA / SAS) & Téléconduite',
    titleEn: 'Substation Automation Systems (SAS / SCADA) & Telecontrol',
    kpis: [
      { labelFr: 'Temps Réponse Téléaction', labelEn: 'Telecontrol Latency', value: '< 800', unit: 'ms', sublabelFr: 'Commande SBO sécurisée', sublabelEn: 'Secure Select-Before-Operate', accent: 'cyan' },
      { labelFr: 'Disponibilité Téléconduite', labelEn: 'SCADA Availability', value: '99.98', unit: '%', sublabelFr: 'Serveurs redondants chaud CNC', sublabelEn: 'Hot-Standby Dispatch Servers', accent: 'emerald' },
      { labelFr: 'Protocole Télégestion', labelEn: 'Telecontrol Protocol', value: 'CEI 60870-5-104', unit: '', sublabelFr: 'Liaison CNC Sonatrel / Postes', sublabelEn: 'National Dispatcher Link', accent: 'amber' },
      { labelFr: 'Capacité Journal Événements', labelEn: 'SOE Event Buffer', value: '100 000', unit: 'événements', sublabelFr: 'Horodatage 1 ms à la source', sublabelEn: '1 ms Timestamp at Source', accent: 'purple' },
      { labelFr: 'Taux Rafraîchissement Mesures', labelEn: 'Measurement Scan Rate', value: '1.0', unit: 's', sublabelFr: 'Télémétries P, Q, U, I, f', sublabelEn: 'Telemetry Refresh Rate', accent: 'cyan' },
      { labelFr: 'Cybersécurité CEI 62351', labelEn: 'IEC 62351 Encryption', value: 'TLS 1.3', unit: '', sublabelFr: 'Chiffrement flux SCADA et IED', sublabelEn: 'Encrypted Telecontrol Streams', accent: 'rose' }
    ],
    standards: ['CEI 60870-5-104', 'CEI 61850', 'CEI 62351', 'CEI 61968'],
    equipmentFocusTags: ['eq-exp-switch-iec62443', 'eq-exp-relay-ied-61850', 'eq-exp-gis-bay-225k']
  },
  D13: {
    titleFr: 'Télécommunications de Poste, Réseaux PRP/HSR & CEI 61850',
    titleEn: 'Substation Telecommunications, PRP/HSR Networks & IEC 61850',
    kpis: [
      { labelFr: 'Temps Recouvrement PRP/HSR', labelEn: 'PRP/HSR Recovery Time', value: '0', unit: 'ms', sublabelFr: 'Zéro perte de trame sans coupure', sublabelEn: 'Seamless Zero-Loss Redundancy', accent: 'emerald' },
      { labelFr: 'Latence Multicast GOOSE', labelEn: 'GOOSE Multicast Latency', value: '< 2.0', unit: 'ms', sublabelFr: 'Priorité VLAN IEEE 802.1Q', sublabelEn: 'VLAN Priority Tagging', accent: 'cyan' },
      { labelFr: 'Précision Horloge PTP', labelEn: 'PTP Clock Precision', value: '< 100', unit: 'ns', sublabelFr: 'IEEE 1588 / Profil Énergie CEI 61850-9-3', sublabelEn: 'IEEE 1588 Power Utility Profile', accent: 'purple' },
      { labelFr: 'Débit Bus de Process SV', labelEn: 'Sampled Values Stream', value: '4800', unit: 'éch/s', sublabelFr: 'Échantillonnage tensions/courants', sublabelEn: 'Digital Merging Unit Sampling', accent: 'amber' },
      { labelFr: 'Bande Passante Station Bus', labelEn: 'Station Bus Bandwidth', value: '1.0', unit: 'Gbps', sublabelFr: 'Fibre optique multimode / monomode', sublabelEn: 'Optical Fiber Gigabit Backbone', accent: 'cyan' },
      { labelFr: 'Gigue Réseau (Jitter)', labelEn: 'Packet Network Jitter', value: '< 10', unit: 'µs', sublabelFr: 'Déterminisme garanti switch CEI 62443', sublabelEn: 'Deterministic Switch QoS', accent: 'rose' }
    ],
    standards: ['CEI 61850-9-2', 'CEI 62439-3 (PRP/HSR)', 'IEEE 1588 (PTP)', 'CEI 62443-4-2'],
    equipmentFocusTags: ['eq-exp-switch-iec62443', 'eq-exp-relay-ied-61850', 'eq-exp-tower-225kv']
  },
  D14: {
    titleFr: 'Qualité de l’Énergie, Harmoniques, Flicker & Compatibilité CEM',
    titleEn: 'Power Quality, Harmonics, Flicker & Electromagnetic Compatibility',
    kpis: [
      { labelFr: 'Distorsion Harmonique THDu', labelEn: 'Voltage THD (THDu)', value: '< 2.5', unit: '%', sublabelFr: 'Norme CEI 61000-2-4 Classe 2 (Max 5%)', sublabelEn: 'IEC 61000-2-4 Class 2 (Max 5%)', accent: 'emerald' },
      { labelFr: 'Distorsion Courant THDi', labelEn: 'Current THD (THDi)', value: '< 4.8', unit: '%', sublabelFr: 'Conformité gabarit IEEE 519', sublabelEn: 'IEEE 519 Compliance Limit', accent: 'cyan' },
      { labelFr: 'Déséquilibre de Tension (U2/U1)', labelEn: 'Voltage Unbalance (U2/U1)', value: '< 0.8', unit: '%', sublabelFr: 'Composante inverse (Max 2.0%)', sublabelEn: 'Negative Sequence (Max 2.0%)', accent: 'purple' },
      { labelFr: 'Indice de Flicker (Pst)', labelEn: 'Short-Term Flicker (Pst)', value: '< 0.75', unit: '', sublabelFr: 'Gêne visuelle éclairage (Seuil 1.0)', sublabelEn: 'Visual Irritation Limit (Max 1.0)', accent: 'amber' },
      { labelFr: 'Temps Réaction Filtre Actif', labelEn: 'Active Filter Response', value: '< 5', unit: 'ms', sublabelFr: 'Compensation harmonique rang 2 à 50', sublabelEn: 'Harmonic Compensation 2nd-50th', accent: 'cyan' },
      { labelFr: 'Creux de Tension Tolérés', labelEn: 'Voltage Sag Immunity', value: 'SEMI F47', unit: '', sublabelFr: 'Tenue creux 50% pendant 200 ms', sublabelEn: 'Sag Ride-Through 50% for 200 ms', accent: 'rose' }
    ],
    standards: ['CEI 61000-4-30 Classe A', 'IEEE 519-2022', 'EN 50160', 'CEI 61000-4-7'],
    equipmentFocusTags: ['eq-exp-statcom-mmc-50mvar', 'eq-exp-ami-smartmeter-3p', 'eq-exp-tgbt-main-400v']
  },
  D15: {
    titleFr: 'Gestion d’Actifs, Diagnostic Transformateurs & Maintenance Prédictive',
    titleEn: 'Asset Management, Transformer Diagnostics & Predictive Maintenance',
    kpis: [
      { labelFr: 'Indice de Santé Global (HI)', labelEn: 'Fleet Health Index (HI)', value: '88.4', unit: '%', sublabelFr: 'Parc transformateurs HTB RIS', sublabelEn: 'RIS EHV Transformer Fleet', accent: 'emerald' },
      { labelFr: 'Gaz Dissous DGA (C2H2)', labelEn: 'Dissolved Acetylene (C2H2)', value: '< 2.0', unit: 'ppm', sublabelFr: 'Diagnostic Triangle de Duval sain', sublabelEn: 'Duval Triangle Normal Zone', accent: 'cyan' },
      { labelFr: 'Teneur en Eau Huile', labelEn: 'Moisture in Dielectric Oil', value: '11.5', unit: 'ppm', sublabelFr: 'Rigidité diélectrique > 70 kV/2.5mm', sublabelEn: 'Dielectric Breakdown > 70 kV', accent: 'purple' },
      { labelFr: 'Déviation SFRA (Balayage)', labelEn: 'SFRA Frequency Deviation', value: '< 1.5', unit: 'dB', sublabelFr: 'Aucune déformation mécanique enroulements', sublabelEn: 'Zero Winding Geometry Deformation', accent: 'amber' },
      { labelFr: 'Compteurs AMI Connectés', labelEn: 'Smart Meters Deployed', value: '425 000', unit: 'points', sublabelFr: 'Télérelève toutes les 15 min', sublabelEn: '15-Minute Interval Tele-Metering', accent: 'cyan' },
      { labelFr: 'Taux Perte Non-Technique', labelEn: 'Non-Technical Loss Rate', value: '4.2', unit: '%', sublabelFr: 'Détection fraude IA anti-dérive', sublabelEn: 'AI Fraud Detection Reduction', accent: 'rose' }
    ],
    standards: ['CEI 60599', 'IEEE C57.104', 'CEI 60076-18 (SFRA)', 'ISO 55000'],
    equipmentFocusTags: ['eq-exp-dga-online-monitor', 'eq-exp-ami-smartmeter-3p', 'eq-exp-sub-trafo-225-30']
  },
  D16: {
    titleFr: 'Sécurité Électrique, Réseau de Terre & Protection Foudre (CEM)',
    titleEn: 'Electrical Safety, Earthing Grid & Lightning Protection (EMC)',
    kpis: [
      { labelFr: 'Résistance Grille Terre (Rg)', labelEn: 'Earth Grid Resistance (Rg)', value: '0.48', unit: 'Ω', sublabelFr: 'Poste HTB Bekoko (Objectif < 1.0 Ω)', sublabelEn: 'Bekoko EHV Station (Target < 1.0 Ω)', accent: 'emerald' },
      { labelFr: 'Tension de Contact Tolérable', labelEn: 'Tolerable Touch Voltage', value: '725', unit: 'V', sublabelFr: 'Calcul IEEE Std 80 (corps 70 kg)', sublabelEn: 'IEEE Std 80 (70 kg body weight)', accent: 'cyan' },
      { labelFr: 'Tension de Pas Tolérable', labelEn: 'Tolerable Step Voltage', value: '2450', unit: 'V', sublabelFr: 'Couche gravier 10 cm (ρ = 3000 Ω·m)', sublabelEn: '10 cm Gravel Layer (ρ = 3000 Ω·m)', accent: 'purple' },
      { labelFr: 'Courant Écoulement Foudre', labelEn: 'Lightning Discharge Current', value: '100', unit: 'kA', sublabelFr: 'Onde normalisée 10/350 µs Niveau I', sublabelEn: '10/350 µs Class I Direct Strike', accent: 'rose' },
      { labelFr: 'Rayon Sphère Fictive', labelEn: 'Rolling Sphere Radius', value: '20', unit: 'm', sublabelFr: 'Niveau I de protection CEI 62305', sublabelEn: 'IEC 62305 Level I Protection', accent: 'amber' },
      { labelFr: 'Équipotentialité Cadre', labelEn: 'Equipotential Continuity', value: '< 0.05', unit: 'Ω', sublabelFr: 'Liaisons équipotentielles principales', sublabelEn: 'Main Equipotential Bonding', accent: 'cyan' }
    ],
    standards: ['IEEE Std 80', 'CEI 62305-1 à 4', 'NF C 15-100', 'CEI 61936-1'],
    equipmentFocusTags: ['eq-exp-sub-trafo-225-30', 'eq-exp-tower-225kv', 'eq-exp-tgbt-main-400v']
  }
};

export const DomainEngineeringKpiBanner: React.FC<DomainEngineeringKpiBannerProps> = ({
  domainCode,
  locale,
  onSelectEquipment,
  onNavigateView
}) => {
  const isFr = locale === 'fr';
  const kpiData = DOMAIN_KPIS_REGISTRY[domainCode];

  // Equipment census for this domain
  const domainEquipments = ALL_CANONICAL_EQUIPMENT.filter(
    (e) => e.parentDomain === domainCode || e.subsystemContext?.[locale]?.includes(domainCode)
  );

  if (!kpiData && domainEquipments.length === 0) return null;

  return (
    <div className="bg-[#0C121D] border border-cyan-500/25 rounded-2xl p-5 shadow-2xl space-y-4 font-mono">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/90 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-950/80 border border-cyan-500/40 rounded-xl text-cyan-400">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-cyan-400/90 uppercase tracking-widest font-bold">
              {isFr ? 'INGÉNIERIE SYSTÈME & TABLEAU DE BORD TECHNIQUE' : 'SYSTEM ENGINEERING & TECHNICAL DASHBOARD'}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              {kpiData ? (isFr ? kpiData.titleFr : kpiData.titleEn) : (isFr ? `Recensement & Métriques ${domainCode}` : `${domainCode} Census & Metrics`)}
            </h2>
          </div>
        </div>

        {/* Standards Tags */}
        {kpiData && (
          <div className="flex flex-wrap items-center gap-1.5">
            {kpiData.standards.map((std) => (
              <span
                key={std}
                className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-300 text-[10px] font-bold"
              >
                {std}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      {kpiData && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpiData.kpis.map((kpi, idx) => {
            const borderColors = {
              cyan: 'border-cyan-800/60 text-cyan-300',
              amber: 'border-amber-800/60 text-amber-300',
              emerald: 'border-emerald-800/60 text-emerald-300',
              rose: 'border-rose-800/60 text-rose-300',
              purple: 'border-purple-800/60 text-purple-300'
            };
            const textColors = {
              cyan: 'text-cyan-400',
              amber: 'text-amber-400',
              emerald: 'text-emerald-400',
              rose: 'text-rose-400',
              purple: 'text-purple-400'
            };

            return (
              <div
                key={idx}
                className={`bg-[#121926] border rounded-xl p-3 flex flex-col justify-between space-y-1 shadow-inner ${borderColors[kpi.accent]}`}
              >
                <div className="text-[10px] text-slate-400 uppercase tracking-wider truncate">
                  {isFr ? kpi.labelFr : kpi.labelEn}
                </div>
                <div className="flex items-baseline gap-1 my-0.5">
                  <span className={`text-xl sm:text-2xl font-black ${textColors[kpi.accent]}`}>
                    {kpi.value}
                  </span>
                  {kpi.unit && (
                    <span className="text-[10px] text-slate-400 font-normal">
                      {kpi.unit}
                    </span>
                  )}
                </div>
                {(kpi.sublabelFr || kpi.sublabelEn) && (
                  <div className="text-[9px] text-slate-400 truncate">
                    {isFr ? kpi.sublabelFr : kpi.sublabelEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Equipment Census Strip */}
      <div className="bg-[#101724] border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Box className="h-4 w-4 text-amber-400 shrink-0" />
          <span className="font-bold text-slate-200">
            {isFr
              ? `Recensement Matériel du Domaine : ${domainEquipments.length} équipements normalisés CEI`
              : `Domain Equipment Census: ${domainEquipments.length} IEC-standardized apparatus`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {kpiData?.equipmentFocusTags.map((eqId) => {
            const eq = ALL_CANONICAL_EQUIPMENT.find(e => e.id === eqId);
            if (!eq) return null;
            return (
              <button
                key={eqId}
                type="button"
                onClick={() => onSelectEquipment?.(eqId)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#182334] hover:bg-cyan-950/70 border border-slate-700 hover:border-cyan-500/50 rounded-lg text-[11px] text-slate-200 hover:text-cyan-200 transition-all cursor-pointer shadow-xs"
              >
                <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950 px-1 rounded border border-cyan-800/60">
                  {eq.tagIec || eq.id.replace('eq-exp-', '')}
                </span>
                <span className="truncate max-w-[140px]">
                  {eq.name[locale]}
                </span>
                <ExternalLink className="h-3 w-3 text-slate-400 opacity-60" />
              </button>
            );
          })}

          {onNavigateView && (
            <button
              type="button"
              onClick={() => onNavigateView('equipment-reference')}
              className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
            >
              {isFr ? 'Voir tout le Référentiel →' : 'View Full Reference →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
