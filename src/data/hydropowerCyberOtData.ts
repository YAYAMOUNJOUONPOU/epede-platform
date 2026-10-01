// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 11 DATA ENGINE
// STEP 11: Industrial OT Cybersecurity (IEC 62443), IEC 61850 & Cyber-Resilience
// ============================================================================

import type {
  Iec62443Zone,
  Iec61850TrafficStream,
  CyberPhysicalAttackScenario,
  SimulatedCyberAttackType,
  HybridBessParameters,
} from '../types/hydropowerCyberOt';

// ============================================================================
// 1. IEC 62443-3-3 SECURITY ZONES & PURDUE MODEL ARCHITECTURE
// ============================================================================

export const IEC_62443_SECURITY_ZONES: Iec62443Zone[] = [
  {
    id: 'ZONE-01',
    purdueLevel: 0,
    name: {
      fr: 'Zone 1 : Systèmes Instrumentés de Sécurité (SIS) & Arrêt d\'Urgence',
      en: 'Zone 1: Safety Instrumented Systems (SIS) & Emergency Trip',
    },
    securityLevelTarget: 'SL-4',
    securityLevelAchieved: 'SL-4',
    primaryAssets: {
      fr: 'Relais d\'arrêt d\'urgence électromécaniques 24Vdc, déclencheurs survitesse centrifuge 140%, électrovannes d\'injection huile sous pression.',
      en: 'Hardwired 24Vdc emergency stop relays, mechanical 140% overspeed centrifugal switches, high-pressure hydraulic dump valves.',
    },
    perimeterProtection: {
      fr: 'Isolation galvanique totale (Air-Gap) sans passerelle réseau IP. Câblage direct blindé catégorie 6A vers actionneurs de coupure.',
      en: 'Total physical galvanic air-gap without IP network gateways. Direct shielded cabling to physical trip coils.',
    },
    inboundProtocols: ['Hardwired Dry Contacts', 'Discrete 24V DC Loop'],
    vulnerabilitiesMitigated: {
      fr: 'Immunité absolue contre toute cyberattaque informatique ou tentative d\'écrasement firmware à distance.',
      en: 'Absolute immunity against remote malware injection, firmware corruption, and network-borne attack vectors.',
    },
    complianceStatus: 'compliant',
  },
  {
    id: 'ZONE-02',
    purdueLevel: 1,
    name: {
      fr: 'Zone 2 : Process Bus CEI 61850 & Tranches de Protection Électrique',
      en: 'Zone 2: IEC 61850 Process Bus & Electrical Protection Bays',
    },
    securityLevelTarget: 'SL-3',
    securityLevelAchieved: 'SL-3',
    primaryAssets: {
      fr: 'Merging Units optiques (MU), Calculateurs de Tranche (BCU), Relais différentiels alternateur 87G et transformateur 87T.',
      en: 'Optical Merging Units (MU), Bay Controller Units (BCU), 87G Generator & 87T Transformer differential relays.',
    },
    perimeterProtection: {
      fr: 'Switches Ethernet durcis industriels avec architecture redondante double anneau PRP/HSR (Zero Failover Time) et filtrage MAC matériel.',
      en: 'Ruggedized industrial Ethernet switches running dual PRP/HSR redundant zero-packet-loss rings with hardware MAC-address binding.',
    },
    inboundProtocols: ['GOOSE (IEC 61850-8-1)', 'Sampled Values (IEC 61850-9-2LE)', 'IEEE 1588 PTP'],
    vulnerabilitiesMitigated: {
      fr: 'Protection contre l\'injection de fausses trames GOOSE de déclenchement par signature HMAC-SHA256 (CEI 62351-6).',
      en: 'Mitigates false trip injection and replay spoofing through cryptographic HMAC-SHA256 frame signing (IEC 62351-6).',
    },
    complianceStatus: 'compliant',
  },
  {
    id: 'ZONE-03',
    purdueLevel: 2,
    name: {
      fr: 'Zone 3 : Station Bus SCADA & Conduite Centrale de l\'Usine',
      en: 'Zone 3: Station Bus SCADA & Central Powerhouse Control',
    },
    securityLevelTarget: 'SL-3',
    securityLevelAchieved: 'SL-3',
    primaryAssets: {
      fr: 'Serveurs SCADA redondants double machine, IHM opérateur salle de commande, Automates programmables maîtres (PLC) Siemens S7-400H.',
      en: 'Hot-standby redundant SCADA host servers, operator HMI consoles, Master PLC governors and turbine sequencing controllers.',
    },
    perimeterProtection: {
      fr: 'Pare-feu industriels de zone (Next-Gen Industrial Firewall) avec inspection approfondie des paquets (DPI) pour les protocoles MMS et IEC 104.',
      en: 'Next-Generation Industrial Firewalls with Deep Packet Inspection (DPI) validating MMS command parameters and register limits.',
    },
    inboundProtocols: ['MMS (IEC 61850-8-1)', 'Modbus TCP (Sécurisé)', 'SNMPv3', 'TLS 1.3'],
    vulnerabilitiesMitigated: {
      fr: 'Blocage des commandes d\'ouverture intempestive des directrices au-delà des profils de cavitation ou des vitesses de rotation critiques.',
      en: 'Blocks unauthorized opening setpoints exceeding allowable cavitation boundaries or critical resonant speeds.',
    },
    complianceStatus: 'compliant',
  },
  {
    id: 'ZONE-04',
    purdueLevel: 3,
    name: {
      fr: 'Zone 4 : DMZ Industrielle & Passerelle de Téléconduite Nationale',
      en: 'Zone 4: Industrial DMZ & National Grid Dispatch Gateway',
    },
    securityLevelTarget: 'SL-3',
    securityLevelAchieved: 'SL-2',
    primaryAssets: {
      fr: 'Passerelles de téléconduite IEC 60870-5-104 vers le dispatching SONATREL Yaoundé, Serveur Historian historisation OSIsoft PI.',
      en: 'IEC 60870-5-104 telecontrol gateways connecting to SONATREL national grid dispatch, OSIsoft PI data historian replica.',
    },
    perimeterProtection: {
      fr: 'Double pare-feu en coupure d\'éditeurs différents (Check Point + Fortinet), diode de données optique unidirectionnelle vers le cloud d\'entreprise.',
      en: 'Dual multi-vendor firewalls (Check Point + Fortinet) with hardware unidirectional optical data diode isolating process data outwards.',
    },
    inboundProtocols: ['IEC 60870-5-104 (IPsec VPN)', 'DNP3 Secure', 'HTTPS (mTLS Certificat X.509)'],
    vulnerabilitiesMitigated: {
      fr: 'Empêche la propagation latérale des ransomwares d\'entreprise vers les automates de régulation turbine de la centrale.',
      en: 'Prevents lateral ransomware spreading from corporate office IT networks into real-time powerhouse governor buses.',
    },
    complianceStatus: 'warning',
  },
  {
    id: 'ZONE-05',
    purdueLevel: 4,
    name: {
      fr: 'Zone 5 : Réseau Bureautique IT & ERP Gestion d\'Actifs Entreprise',
      en: 'Zone 5: Enterprise Corporate IT & Asset ERP Network',
    },
    securityLevelTarget: 'SL-1',
    securityLevelAchieved: 'SL-1',
    primaryAssets: {
      fr: 'Postes de travail ingénieurs, ERP SAP gestion de maintenance GMAO, accès Internet bureautique et messagerie corporate.',
      en: 'Office workstations, SAP enterprise asset management ERP, corporate internet gateways, and administrative cloud tools.',
    },
    perimeterProtection: {
      fr: 'Endpoint Detection and Response (EDR), passerelles web sécurisées, authentification multifacteur (MFA) FIDO2 obligatoire.',
      en: 'Corporate EDR agent telemetry, secure web proxy gateways, mandatory FIDO2 hardware Multi-Factor Authentication (MFA).',
    },
    inboundProtocols: ['HTTPS', 'SSHv2', 'LDAPS', 'IPsec IKEv2'],
    vulnerabilitiesMitigated: {
      fr: 'Neutralisation des courriels d\'hameçonnage ciblé (spear-phishing) visant les identifiants d\'ingénierie et de configuration SCADA.',
      en: 'Neutralizes targeted spear-phishing campaigns attempting credential theft of plant engineering staff.',
    },
    complianceStatus: 'compliant',
  },
];

// ============================================================================
// 2. IEC 61850 NETWORK BUS TELEMETRIES (PROCESS BUS & STATION BUS)
// ============================================================================

export const IEC_61850_NETWORK_STREAMS: Iec61850TrafficStream[] = [
  {
    id: 'STREAM-01',
    protocol: 'SampledValues_SV',
    networkBus: 'ProcessBus',
    bandwidthUsageMbps: 38.4,
    latencyBudgetMs: 2.0,
    measuredLatencyMs: 0.85,
    encryptionStandard: 'IEC 62351-9 Hardware Timestamped',
    isDeterministic: true,
    healthStatus: 'optimal',
  },
  {
    id: 'STREAM-02',
    protocol: 'GOOSE',
    networkBus: 'ProcessBus',
    bandwidthUsageMbps: 1.2,
    latencyBudgetMs: 4.0,
    measuredLatencyMs: 1.45,
    encryptionStandard: 'IEC 62351-6 HMAC-SHA256 Authentication',
    isDeterministic: true,
    healthStatus: 'optimal',
  },
  {
    id: 'STREAM-03',
    protocol: 'PTP_IEEE1588',
    networkBus: 'ProcessBus',
    bandwidthUsageMbps: 0.4,
    latencyBudgetMs: 0.001, // 1 microsecond accuracy
    measuredLatencyMs: 0.00035, // 350 nanoseconds
    encryptionStandard: 'IEEE 1588-2019 Profile Power Utility',
    isDeterministic: true,
    healthStatus: 'optimal',
  },
  {
    id: 'STREAM-04',
    protocol: 'MMS',
    networkBus: 'StationBus',
    bandwidthUsageMbps: 14.5,
    latencyBudgetMs: 50.0,
    measuredLatencyMs: 12.2,
    encryptionStandard: 'IEC 62351-4 TLS 1.3 / X.509 Certificates',
    isDeterministic: false,
    healthStatus: 'optimal',
  },
  {
    id: 'STREAM-05',
    protocol: 'IEC_104',
    networkBus: 'DMZ_Gateway',
    bandwidthUsageMbps: 2.8,
    latencyBudgetMs: 250.0,
    measuredLatencyMs: 48.0,
    encryptionStandard: 'IEC 62351-3 IPsec AES-256 Tunnel',
    isDeterministic: false,
    healthStatus: 'optimal',
  },
];

// ============================================================================
// 3. CYBER-PHYSICAL ATTACK SIMULATION SCENARIOS & MITIGATION LAB
// ============================================================================

export const CYBER_PHYSICAL_ATTACK_SCENARIOS: Record<SimulatedCyberAttackType, CyberPhysicalAttackScenario> = {
  goose_replay_spoofing: {
    id: 'goose_replay_spoofing',
    title: {
      fr: 'Attaque par Rejeu & Usurpation de Trame GOOSE (Déclenchement Illégitime 87G)',
      en: 'GOOSE Message Spoofing & Replay Attack (False 87G Generator Trip)',
    },
    mitreAttckId: 'T0814 - Denial of Service / T0855 - Unauthorized Command Message',
    attackVector: {
      fr: 'Capture d\'une trame GOOSE de déclenchement différentiel et réinjection frauduleuse sur le switch Process Bus pour provoquer un arrêt d\'urgence de 420 MW.',
      en: 'Sniffing an authentic 87G tripping GOOSE frame and replaying it onto the Process Bus switch to trigger a black-plant 420 MW emergency trip.',
    },
    physicalImpactWithoutDefense: {
      fr: 'Arrêt intempestif immédiat des 7 groupes de Nachtigal, perte subite de 420 MW sur le réseau RIS, effondrement de fréquence et délestage généralisé à Yaoundé et Douala.',
      en: 'Instantaneous false blackout tripping of all 7 Nachtigal units, dropping 420 MW, triggering an acute frequency collapse and regional blackouts across Yaoundé and Douala.',
    },
    iec62443DefenseMechanism: {
      fr: 'Vérification cryptographique stricte par la norme CEI 62351-6 : contrôle des numéros de séquence (sqNum), compteurs d\'état (stNum) et signature asymétrique HMAC-SHA256.',
      en: 'Rigorous IEC 62351-6 cryptographic verification: state counter (stNum) sequencing validation and microsecond HMAC-SHA256 cryptographic signature checks.',
    },
    detectionTimeMs: 1.8,
    mitigationAction: {
      fr: 'Paquet frauduleux immédiatement rejeté et tracé. Switch industriel isole le port d\'accès compromis et alerte le SIEM/SOC en temps réel.',
      en: 'Forged packet immediately discarded. Ruggedized switch auto-quarantines the compromised port and generates a high-priority SIEM/SOC alert.',
    },
    postIncidentIntegrity: {
      fr: '100% Intégrité préservée : Zéro déclenchement intempestif, les groupes restent synchronisés au réseau 225 kV.',
      en: '100% Operational continuity: Zero false trips, units maintain stable continuous 225 kV synchronization.',
    },
  },
  scada_setpoint_override: {
    id: 'scada_setpoint_override',
    title: {
      fr: 'Tentative de Surconsommation Forcée & Dépassement Seuil Cavitation (Stuxnet-Style)',
      en: 'Malicious Governor Setpoint Override & Cavitation Boundary Breach',
    },
    mitreAttckId: 'T0836 - Modify Parameter / T0843 - Program Download',
    attackVector: {
      fr: 'Compromission des identifiants SCADA pour forcer l\'ouverture brutale du distributeur à 108% sous faible chute, induisant une cavitation destructrice.',
      en: 'Compromised SCADA administrative credentials attempting to override turbine guide vane opening to 108% under low head, forcing catastrophic cavitation.',
    },
    physicalImpactWithoutDefense: {
      fr: 'Érosion ultra-rapide des aubes de la roue Francis par cavitation vibratoire violente, risques de rupture mécanique des biellettes du distributeur.',
      en: 'Severe ultrasonic pitting and fatigue cracking across Francis runner blades, risking mechanical guide vane shear pin failure.',
    },
    iec62443DefenseMechanism: {
      fr: 'Sécurité de zone CEI 62443-3-3 : Pare-feu industriel DPI validant la table d\'adressage Modbus/MMS et butée matérielle électro-hydraulique indépendante.',
      en: 'IEC 62443-3-3 zone firewall Deep Packet Inspection enforcing rigid parameter boundary checks, backed by hardwired mechanical limit stops.',
    },
    detectionTimeMs: 14.5,
    mitigationAction: {
      fr: 'La consigne hors limites est rejetée par le régulateur de vitesse Woodward. Le contrôleur bascule en mode Local Isolé avec verrouillage IHM.',
      en: 'Out-of-boundary setpoint rejected by Woodward digital governor. Local controller locks into local-override fail-safe mode.',
    },
    postIncidentIntegrity: {
      fr: 'Matériel hydro-mécanique intact. L\'ouverture reste régulée dans la plage optimale BEP (94.6% de rendement).',
      en: 'Turbine runner and linkages unharmed. Discharge maintained strictly inside optimal BEP envelope.',
    },
  },
  ptp_time_poisoning: {
    id: 'ptp_time_poisoning',
    title: {
      fr: 'Empoisonnement de l\'Horloge PTP IEEE 1588 & Falsification de Télémétrie',
      en: 'IEEE 1588 PTP Grandmaster Clock Spoofing & Chronology Tampering',
    },
    mitreAttckId: 'T0879 - Impair Process Control / T0816 - Device Restart/Shutdown',
    attackVector: {
      fr: 'Usurpation de l\'horloge Grandmaster PTP par injection de paquets d\'annonce décalés de +15 ms pour fausser la synchronisation des Sampled Values.',
      en: 'Rogue PTP Grandmaster clock packet injection skewing time references by +15 ms, destabilizing Sampled Values phase angle calculations.',
    },
    physicalImpactWithoutDefense: {
      fr: 'Désynchronisation des Merging Units optiques, fausses mesures de déphasage U-I entraînant un déclenchement erroné de la protection différentielle 87T.',
      en: 'Optical Merging Unit phase angle drift corrupting differential current calculation, causing a spurious 87T transformer lockout.',
    },
    iec62443DefenseMechanism: {
      fr: 'Redondance multi-sources IEEE 1588 Profile Utility (Power Profile) : double récepteur GNSS GPS/Galileo avec oscillateurs locaux au rubidium.',
      en: 'Dual GNSS (GPS + Galileo) multi-source cross-verification with rubidium holdover oscillators filtering rogue delay-request anomalies.',
    },
    detectionTimeMs: 0.45,
    mitigationAction: {
      fr: 'L\'horloge frauduleuse est déclarée non-conforme par l\'algorithme Best Master Clock (BMCA). Basculement transparent sur l\'horloge rubidium de secours.',
      en: 'Rogue master disqualified via BMCA (Best Master Clock Algorithm). Transparent failover to high-precision rubidium holdover clock.',
    },
    postIncidentIntegrity: {
      fr: 'Dérive temporelle inférieure à 40 nanosecondes. Les calculs différentiels vectoriels restent d\'une précision absolue.',
      en: 'Residual time drift restricted below 40 nanoseconds. Current phasor calculations remain mathematically pristine.',
    },
  },
  dmz_ransomware_lateral: {
    id: 'dmz_ransomware_lateral',
    title: {
      fr: 'Propagation Latérale de Ransomware depuis le Réseau Bureautique IT',
      en: 'IT-to-OT Ransomware Lateral Infiltration via DMZ Historian',
    },
    mitreAttckId: 'T0866 - Lateral Movement / T0869 - Standard Application Layer Protocol',
    attackVector: {
      fr: 'Poste bureautique infecté tentant de rebondir via le port d\'administration RDP du serveur Historian pour chiffrer la base de données SCADA.',
      en: 'Infected office workstation attempting RDP lateral pivoting through the DMZ historian server to encrypt real-time SCADA archives.',
    },
    physicalImpactWithoutDefense: {
      fr: 'Perte de visibilité complète des opérateurs sur les niveaux de la retenue et les températures de paliers, forçant l\'arrêt conservatoire de l\'usine.',
      en: 'Complete loss of situational awareness over reservoir levels and bearing temperatures, necessitating precautionary plant shutdown.',
    },
    iec62443DefenseMechanism: {
      fr: 'Micro-segmentation CEI 62443 Zone 4 : Diode de données optique à sens unique (Data Diode). Aucun flux entrant IP n\'est physiquement possible depuis l\'IT.',
      en: 'Physical hardware unidirectional optical data diode in DMZ. Zero physical inbound photons/packets permitted from corporate IT.',
    },
    detectionTimeMs: 0.12,
    mitigationAction: {
      fr: 'La diode de données bloque matériellement la tentative de connexion TCP. Le switch de supervision isole immédiatement le poste infecté en Zone 5.',
      en: 'Optical diode physically drops inbound packets at light layer. EDR isolates the originating infected host on the corporate subnet.',
    },
    postIncidentIntegrity: {
      fr: 'Réseau industriel OT rigoureusement inviolé. Télémétrie et téléconduite 100% opérationnelles sans interruption de service.',
      en: 'OT process network remains hermetically sealed. Hydro generation and grid dispatch continue unabated.',
    },
  },
};

// ============================================================================
// 4. HYBRID RESILIENCE: BESS (BATTERIES) + FLOATING SOLAR (FPV) LAB
// ============================================================================

export function calculateHybridBessBenefits(
  batteryPowerMW: number = 50,
  floatingSolarCapacityMWp: number = 40
): HybridBessParameters {
  // Battery sizing: 2-hour duration standard
  const batteryCapacityMWh = batteryPowerMW * 2;

  // Floating solar: 1 MWp covers approx 0.8 hectares of reservoir
  // Nachtigal reservoir is approx 150 hectares (pondage)
  const solarHectares = floatingSolarCapacityMWp * 0.8;
  const reservoirSurfaceCoveredPercent = Number(((solarHectares / 150) * 100).toFixed(1));

  // Water evaporation saved: Floating panels shade water, saving ~1,250 m3 / hectare / year in tropical climate
  const waterEvaporationSavedM3PerYear = Math.round(solarHectares * 1250);

  // Frequency Nadir stabilization: BESS can inject full power in < 150 ms (Fast Frequency Response - FFR)
  // Raising grid frequency nadir from 48.9 Hz to 49.6 Hz during sudden 100 MW trip in Cameroon Southern Grid
  const gridFrequencyNadirStabilizationHz = Number((49.2 + (batteryPowerMW / 50) * 0.45).toFixed(2));

  return {
    batteryCapacityMWh,
    batteryPowerMW,
    floatingSolarCapacityMWp,
    fastFrequencyResponseTimeMs: 140,
    reservoirSurfaceCoveredPercent,
    waterEvaporationSavedM3PerYear,
    gridFrequencyNadirStabilizationHz,
  };
}
