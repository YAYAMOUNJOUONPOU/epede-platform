// src/components/diagrams/modules/Iec62351CyberSecurityPanel.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Key,
  Lock,
  Unlock,
  AlertTriangle,
  Play,
  Square,
  Activity,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Terminal,
  Cpu,
  RefreshCw,
  Server,
  Zap,
  Radio,
  Wifi,
  Database
} from 'lucide-react';
import type { SoeLogEntry } from './SldSoeLogPanel';

export type CyberThreatType =
  | 'REPLAY_GOOSE'
  | 'ROGUE_PTP_GM'
  | 'SV_SPOOFING'
  | 'DOS_FLOODING'
  | 'UNAUTH_MMS_WRITE'
  | 'REVOKED_CERT';

export interface DpiPacketEvent {
  id: string;
  timestamp: string;
  protocol: 'GOOSE' | 'SV_9_2LE' | 'MMS' | 'PTP_1588' | 'SNMPv3';
  srcMac: string;
  dstMac: string;
  srcIp?: string;
  dstIp?: string;
  action: 'PASS' | 'BLOCKED' | 'FLAGGED' | 'QUARANTINED';
  ruleTriggered: string;
  hmacValid: boolean;
  severity: 'NORMAL' | 'WARNING' | 'CRITICAL';
  details: string;
}

export interface IedCertificate {
  id: string;
  name: string;
  iedModel: string;
  zone: 'Station Bus' | 'Process Bus' | 'Gateway / SCADA';
  algorithm: string;
  keyLength: number;
  validFrom: string;
  validTo: string;
  serialNumber: string;
  sha256Fingerprint: string;
  issuer: string;
  status: 'VALID' | 'EXPIRING_SOON' | 'REVOKED';
}

interface Iec62351CyberSecurityPanelProps {
  locale: 'fr' | 'en';
  onEmitSoeLog?: (entry: Omit<SoeLogEntry, 'id'>) => void;
}

const DEFAULT_CERTIFICATES: IedCertificate[] = [
  {
    id: 'cert-root',
    name: 'CA-SUBSTATION-OYOMABANG-ROOT',
    iedModel: 'Hardware Root CA Trust Anchor',
    zone: 'Station Bus',
    algorithm: 'RSA-PSS / SHA-384',
    keyLength: 4096,
    validFrom: '2024-01-01',
    validTo: '2034-01-01',
    serialNumber: '7A:3F:89:12:00:C1:B4:EF',
    sha256Fingerprint: '9B:5E:21:A4:7D:38:11:09:5C:8B:22:90:E4:3A:D7:66:81:4F:2E:19',
    issuer: 'SONATREL National Grid PKI Authority',
    status: 'VALID'
  },
  {
    id: 'cert-ied-bay-01',
    name: 'IED-BAY-01-SEL411L',
    iedModel: 'Ligne 225kV Protection & Contrôle',
    zone: 'Station Bus',
    algorithm: 'ECDSA / secp384r1 (NIST P-384)',
    keyLength: 384,
    validFrom: '2025-06-15',
    validTo: '2028-06-15',
    serialNumber: '21:88:AC:04:90:5E:33:01',
    sha256Fingerprint: '14:2C:9A:F0:88:B1:77:E5:43:09:82:1D:6E:90:34:B8:21:4E:99:A0',
    issuer: 'CA-SUBSTATION-OYOMABANG-ROOT',
    status: 'VALID'
  },
  {
    id: 'cert-ied-trafo-01',
    name: 'IED-TRAFO-01-RET670',
    iedModel: 'Transformateur 225/30kV Différentielle 87T',
    zone: 'Station Bus',
    algorithm: 'RSA / SHA-256',
    keyLength: 3072,
    validFrom: '2025-02-10',
    validTo: '2027-02-10',
    serialNumber: '55:3A:D1:6C:89:FE:44:91',
    sha256Fingerprint: 'C2:90:33:14:8A:DF:71:02:44:E1:90:B3:7A:66:19:D4:58:12:30:EF',
    issuer: 'CA-SUBSTATION-OYOMABANG-ROOT',
    status: 'VALID'
  },
  {
    id: 'cert-samu-01',
    name: 'SAMU-01-MERGING-UNIT',
    iedModel: 'Merging Unit TC/TT Bus Process 9-2LE',
    zone: 'Process Bus',
    algorithm: 'ECDSA / secp256r1 (P-256)',
    keyLength: 256,
    validFrom: '2025-01-01',
    validTo: '2027-01-01',
    serialNumber: '09:FE:22:98:A1:66:33:11',
    sha256Fingerprint: '88:41:A0:9C:23:5E:F0:71:B2:99:04:D8:1A:33:6C:45:90:12:AA:77',
    issuer: 'CA-SUBSTATION-OYOMABANG-ROOT',
    status: 'VALID'
  },
  {
    id: 'cert-scada-gw',
    name: 'RTU-SCADA-IEC60870-GW',
    iedModel: 'Passerelle Téléconduite Dispatching',
    zone: 'Gateway / SCADA',
    algorithm: 'RSA / SHA-256',
    keyLength: 3072,
    validFrom: '2024-03-01',
    validTo: '2026-10-01',
    serialNumber: '33:8A:CC:12:60:FE:91:02',
    sha256Fingerprint: '4F:A1:99:54:12:00:D3:8E:76:A2:18:90:BC:44:E1:55:09:A1:7B:66',
    issuer: 'CA-SUBSTATION-OYOMABANG-ROOT',
    status: 'EXPIRING_SOON'
  },
  {
    id: 'cert-ews-laptop',
    name: 'EWS-ENG-MAINT-LAPTOP',
    iedModel: 'Poste d’Ingénierie & Maintenance Nomade',
    zone: 'Station Bus',
    algorithm: 'RSA / SHA-256',
    keyLength: 2048,
    validFrom: '2023-01-10',
    validTo: '2024-01-10',
    serialNumber: 'AA:11:90:EF:33:41:09:00',
    sha256Fingerprint: 'EE:44:11:80:79:33:51:C2:8A:10:DF:99:32:00:54:61:99:AC:BB:01',
    issuer: 'CA-SUBSTATION-OYOMABANG-ROOT',
    status: 'REVOKED'
  }
];

export const Iec62351CyberSecurityPanel: React.FC<Iec62351CyberSecurityPanelProps> = ({
  locale,
  onEmitSoeLog
}) => {
  // Navigation tabs within cyber panel
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'ATTACK_SIM' | 'DPI_STREAM' | 'PKI_CERTS' | 'HARDENING'>('OVERVIEW');

  // Security Posture & Mitigations
  const [quarantineActive, setQuarantineActive] = useState<boolean>(false);
  const [enforceStrictHmac, setEnforceStrictHmac] = useState<boolean>(true);
  const [readOnlyProtectionLock, setReadOnlyProtectionLock] = useState<boolean>(true);
  const [ptpAnnexKEnforced, setPtpAnnexKEnforced] = useState<boolean>(true);
  const [stormRateLimiterActive, setStormRateLimiterActive] = useState<boolean>(true);

  // Certificates list
  const [certificates, setCertificates] = useState<IedCertificate[]>(DEFAULT_CERTIFICATES);
  const [selectedCert, setSelectedCert] = useState<IedCertificate | null>(null);

  // Attack Simulation State
  const [activeAttack, setActiveAttack] = useState<CyberThreatType | null>(null);
  const [attackProgress, setAttackProgress] = useState<number>(0);
  const [attackLog, setAttackLog] = useState<string[]>([]);
  const [dpiStreamPaused, setDpiStreamPaused] = useState<boolean>(false);
  const [dpiFilterProtocol, setDpiFilterProtocol] = useState<'ALL' | 'GOOSE' | 'SV_9_2LE' | 'MMS' | 'PTP_1588'>('ALL');

  // Live DPI buffer
  const [dpiPackets, setDpiPackets] = useState<DpiPacketEvent[]>([]);
  const packetIdCounter = useRef(1);

  // Add initial normal packets
  useEffect(() => {
    const initialPackets: DpiPacketEvent[] = [
      {
        id: `pkt-${packetIdCounter.current++}`,
        timestamp: new Date().toLocaleTimeString() + '.142',
        protocol: 'SV_9_2LE',
        srcMac: '00:02:A2:3F:11:80',
        dstMac: '01:0C:CD:04:00:01',
        action: 'PASS',
        ruleTriggered: 'IEC62351-6.SV_RATE_OK',
        hmacValid: true,
        severity: 'NORMAL',
        details: 'smpCnt=2840, smpSynch=2 (GPS), 4000 fps, HMAC-SHA256 validé'
      },
      {
        id: `pkt-${packetIdCounter.current++}`,
        timestamp: new Date().toLocaleTimeString() + '.145',
        protocol: 'GOOSE',
        srcMac: '00:02:A2:3F:11:80',
        dstMac: '01:0C:CD:01:00:01',
        action: 'PASS',
        ruleTriggered: 'IEC62351-6.GOOSE_SQ_MONOTONIC',
        hmacValid: true,
        severity: 'NORMAL',
        details: 'stNum=12, sqNum=842, TAL=1000ms, Pas d’anomalie séquentielle'
      },
      {
        id: `pkt-${packetIdCounter.current++}`,
        timestamp: new Date().toLocaleTimeString() + '.149',
        protocol: 'PTP_1588',
        srcMac: '00:50:C2:55:01:99',
        dstMac: '01:1B:19:00:00:00',
        action: 'PASS',
        ruleTriggered: 'IEC62351-7.PTP_GM_AUTHENTICATED',
        hmacValid: true,
        severity: 'NORMAL',
        details: 'Grandmaster ID 00-50-C2-FF-FE-55-01-99, Class=6, Offset=+12ns'
      },
      {
        id: `pkt-${packetIdCounter.current++}`,
        timestamp: new Date().toLocaleTimeString() + '.152',
        protocol: 'MMS',
        srcMac: '00:50:56:A1:2B:10',
        dstMac: '00:02:A2:3F:11:80',
        srcIp: '10.120.4.50',
        dstIp: '10.120.4.21',
        action: 'PASS',
        ruleTriggered: 'IEC62351-3.TLS_1_3_SESSION',
        hmacValid: true,
        severity: 'NORMAL',
        details: 'mTLS Handshake réussi (ECDHE-ECDSA-AES256-GCM), Rôle: SecAdmin'
      }
    ];
    setDpiPackets(initialPackets);
  }, []);

  // Periodic normal packet stream generator if not paused
  useEffect(() => {
    if (dpiStreamPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString() + '.' + Math.floor(now.getMilliseconds()).toString().padStart(3, '0');

      if (!activeAttack) {
        // Normal random packet
        const protos: ('SV_9_2LE' | 'GOOSE' | 'MMS' | 'PTP_1588')[] = ['SV_9_2LE', 'SV_9_2LE', 'GOOSE', 'PTP_1588'];
        const proto = protos[Math.floor(Math.random() * protos.length)];

        let newPkt: DpiPacketEvent;
        if (proto === 'SV_9_2LE') {
          newPkt = {
            id: `pkt-${packetIdCounter.current++}`,
            timestamp: timeStr,
            protocol: 'SV_9_2LE',
            srcMac: '00:02:A2:3F:11:80',
            dstMac: '01:0C:CD:04:00:01',
            action: 'PASS',
            ruleTriggered: 'IEC62351-6.SV_INTEGRITY_CHECK',
            hmacValid: true,
            severity: 'NORMAL',
            details: `smpCnt=${Math.floor(Math.random() * 4000)}, smpSynch=2 (Grandmaster GPS), HMAC Tag OK`
          };
        } else if (proto === 'GOOSE') {
          newPkt = {
            id: `pkt-${packetIdCounter.current++}`,
            timestamp: timeStr,
            protocol: 'GOOSE',
            srcMac: '00:02:A2:3F:11:80',
            dstMac: '01:0C:CD:01:00:01',
            action: 'PASS',
            ruleTriggered: 'IEC62351-6.GOOSE_SQ_MONOTONIC',
            hmacValid: true,
            severity: 'NORMAL',
            details: `Heartbeat régulier: stNum=12, sqNum=${Math.floor(Math.random() * 500) + 800}, TAL=2000ms`
          };
        } else {
          newPkt = {
            id: `pkt-${packetIdCounter.current++}`,
            timestamp: timeStr,
            protocol: 'PTP_1588',
            srcMac: '00:50:C2:55:01:99',
            dstMac: '01:1B:19:00:00:00',
            action: 'PASS',
            ruleTriggered: 'IEC62351-7.PTP_SYNC_VALID',
            hmacValid: true,
            severity: 'NORMAL',
            details: 'Sync Announce valide. Précision sub-microseconde (±14 ns)'
          };
        }

        setDpiPackets(prev => [newPkt, ...prev.slice(0, 39)]);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [dpiStreamPaused, activeAttack]);

  // Security Posture Score Calculation
  const securityScore = useMemo(() => {
    let score = 100;
    if (activeAttack) score -= 35;
    if (!enforceStrictHmac) score -= 15;
    if (!readOnlyProtectionLock) score -= 15;
    if (!ptpAnnexKEnforced) score -= 10;
    if (!stormRateLimiterActive) score -= 10;
    if (certificates.some(c => c.status === 'REVOKED')) score -= 5;
    if (certificates.some(c => c.status === 'EXPIRING_SOON')) score -= 4;
    return Math.max(10, Math.min(100, score));
  }, [activeAttack, enforceStrictHmac, readOnlyProtectionLock, ptpAnnexKEnforced, stormRateLimiterActive, certificates]);

  // Attack Execution Logic
  const handleLaunchAttack = (threat: CyberThreatType) => {
    setActiveAttack(threat);
    setAttackProgress(10);
    const now = new Date();
    const timeStr = now.toLocaleTimeString() + '.' + Math.floor(now.getMilliseconds()).toString().padStart(3, '0');

    let logMsg = '';
    let attackPkt: DpiPacketEvent;
    let soeEntry: Omit<SoeLogEntry, 'id'>;

    switch (threat) {
      case 'REPLAY_GOOSE':
        logMsg = locale === 'fr'
          ? 'ALERTE IDS: Injection d’une trame GOOSE capturée (stNum=4, sqNum=12) avec faux ordre d’ouverture disjoncteur.'
          : 'IDS ALERT: Injected captured GOOSE frame (stNum=4, sqNum=12) carrying forged circuit breaker trip order.';
        attackPkt = {
          id: `pkt-${packetIdCounter.current++}`,
          timestamp: timeStr,
          protocol: 'GOOSE',
          srcMac: '00:E0:4C:68:04:1F', // Rogue MAC
          dstMac: '01:0C:CD:01:00:01',
          action: 'BLOCKED',
          ruleTriggered: 'IEC62351-6.SEC_ERR_REPLAY_DETECTED',
          hmacValid: false,
          severity: 'CRITICAL',
          details: 'stNum=4 < IED_stNum=12, Rejeu de commande déclenchement détecté! Paquet éliminé en couche 2.'
        };
        soeEntry = {
          time: now.toLocaleTimeString(),
          ansi: 'SEC-62351',
          event: locale === 'fr'
            ? 'ATTAQUE REJEU GOOSE INTERCEPTÉE: Trame périmée rejetée, disjoncteur préservé de tout faux déclenchement'
            : 'GOOSE REPLAY ATTACK INTERCEPTED: Stale frame dropped, breaker protected against unauthorized trip',
          breakers: '52-1 [MAINTENU FERMÉ]',
          clearing: '0.4 ms (IDS Block)',
          severity: 'CRITICAL'
        };
        break;

      case 'ROGUE_PTP_GM':
        logMsg = locale === 'fr'
          ? 'ALERTE IDS: Fausse annonce PTP IEEE 1588 reçue d’une horloge pirate (GM ID non répertorié, dérive +2.4µs).'
          : 'IDS ALERT: Rogue PTP IEEE 1588 announce frame received from untrusted GM ID with +2.4µs phase offset.';
        attackPkt = {
          id: `pkt-${packetIdCounter.current++}`,
          timestamp: timeStr,
          protocol: 'PTP_1588',
          srcMac: '00:1B:2F:AA:BB:CC',
          dstMac: '01:1B:19:00:00:00',
          action: 'BLOCKED',
          ruleTriggered: 'IEC62351-7.ROGUE_GRANDMASTER_HIJACK',
          hmacValid: false,
          severity: 'CRITICAL',
          details: 'Horloge pirate non signée. Dérive de phase anormale (>200ns) rejetée, repli automatique sur GPS Stratum-1.'
        };
        soeEntry = {
          time: now.toLocaleTimeString(),
          ansi: 'SEC-PTP',
          event: locale === 'fr'
            ? 'TENTATIVE PIRATAGE HORLOGE PTP: Horloge pirate rejetée, synchronisation bus process sécurisée'
            : 'ROGUE PTP CLOCK HIJACK ATTEMPT: Rogue clock isolated, process bus synchronization secured',
          breakers: 'SAMU-01 / IED [INTACTS]',
          clearing: '1.2 ms (Annex K Block)',
          severity: 'CRITICAL'
        };
        break;

      case 'SV_SPOOFING':
        logMsg = locale === 'fr'
          ? 'ALERTE IDS: Injection de trames SV 9-2LE falsifiées avec surintensité fictive 28.5 kA sur phase A.'
          : 'IDS ALERT: Forged SV 9-2LE frames injected with artificial 28.5 kA overcurrent on Phase A.';
        attackPkt = {
          id: `pkt-${packetIdCounter.current++}`,
          timestamp: timeStr,
          protocol: 'SV_9_2LE',
          srcMac: '00:50:79:66:68:01',
          dstMac: '01:0C:CD:04:00:01',
          action: 'BLOCKED',
          ruleTriggered: 'IEC62351-6.HMAC_TAG_INVALID',
          hmacValid: false,
          severity: 'CRITICAL',
          details: 'Signature cryptographique HMAC-SHA256 invalide sur flux SV! Échantillons marqués INVALID.'
        };
        soeEntry = {
          time: now.toLocaleTimeString(),
          ansi: 'SEC-SV',
          event: locale === 'fr'
            ? 'INJECTION FALSIFIÉE ÉCHANTILLONS SV BLOQUÉE: Signature HMAC invalide, protection 50/51 non bernée'
            : 'FORGED SV SAMPLES BLOCKED: HMAC signature invalid, protection 50/51 untriggered',
          breakers: 'DISJONCTEUR 52 [NON DÉCLENCHÉ]',
          clearing: '< 0.25 ms (Filter)',
          severity: 'CRITICAL'
        };
        break;

      case 'DOS_FLOODING':
        logMsg = locale === 'fr'
          ? 'ALERTE IDS: Tempête réseau multicast (45 000 fps) saturant le bus de process 100BASE-FX.'
          : 'IDS ALERT: Multicast network storm (45,000 fps) attempting to saturate 100BASE-FX process bus.';
        attackPkt = {
          id: `pkt-${packetIdCounter.current++}`,
          timestamp: timeStr,
          protocol: 'GOOSE',
          srcMac: '00:E0:4C:99:88:77',
          dstMac: '01:0C:CD:01:00:01',
          action: 'QUARANTINED',
          ruleTriggered: 'IEC62351-7.STORM_CONTROL_EXCEEDED',
          hmacValid: false,
          severity: 'CRITICAL',
          details: 'Seuil tempête (6000 fps) dépassé! Déclenchement limitation matérielle et isolement port SW-01/P7.'
        };
        soeEntry = {
          time: now.toLocaleTimeString(),
          ansi: 'SEC-DOS',
          event: locale === 'fr'
            ? 'TEMPÊTE DOS ÉTOUFFÉE: Limitation de débit activée, communication prioritaire relayée sans perte'
            : 'DOS FLOOD CONTAINED: Hardware rate limiting engaged, priority protection traffic preserved',
          breakers: 'COMMUTATEUR SW-01 [PORT ISOLÉ]',
          clearing: '0.8 ms',
          severity: 'WARNING'
        };
        break;

      case 'UNAUTH_MMS_WRITE':
        logMsg = locale === 'fr'
          ? 'ALERTE IDS: Requête MMS Write unauthorized (tentative de forçage du seuil ANSI 50 de 1200A à 9999A).'
          : 'IDS ALERT: Unauthorized MMS Write request (attempt to overwrite ANSI 50 trip threshold from 1200A to 9999A).';
        attackPkt = {
          id: `pkt-${packetIdCounter.current++}`,
          timestamp: timeStr,
          protocol: 'MMS',
          srcMac: '00:1E:67:89:FE:44',
          dstMac: '00:02:A2:3F:11:80',
          srcIp: '192.168.1.188',
          dstIp: '10.120.4.21',
          action: 'BLOCKED',
          ruleTriggered: 'IEC62351-8.RBAC_ACCESS_DENIED',
          hmacValid: false,
          severity: 'CRITICAL',
          details: 'Adresse IP source non autorisée hors sous-réseau EWS. Échec certificat mTLS. Session fermée.'
        };
        soeEntry = {
          time: now.toLocaleTimeString(),
          ansi: 'SEC-MMS',
          event: locale === 'fr'
            ? 'TENTATIVE MODIFICATION PARAMÈTRES REJETÉE: Échec RBAC / Certificat non habilité'
            : 'UNAUTHORIZED SETTINGS WRITE REJECTED: RBAC / Certificate authorization failed',
          breakers: 'RÉGLAGES IED [VERROUILLÉS]',
          clearing: 'Accès Refusé',
          severity: 'CRITICAL'
        };
        break;

      case 'REVOKED_CERT':
        logMsg = locale === 'fr'
          ? 'ALERTE IDS: Connexion mTLS initiée avec un certificat X.509 figurant dans la liste de révocation (CRL).'
          : 'IDS ALERT: mTLS connection initiated presenting an X.509 certificate present on CRL revocation list.';
        attackPkt = {
          id: `pkt-${packetIdCounter.current++}`,
          timestamp: timeStr,
          protocol: 'MMS',
          srcMac: 'AA:11:90:EF:33:41',
          dstMac: '10:120:4:10',
          srcIp: '10.120.4.99',
          dstIp: '10.120.4.10',
          action: 'BLOCKED',
          ruleTriggered: 'IEC62351-9.CERTIFICATE_REVOKED',
          hmacValid: false,
          severity: 'CRITICAL',
          details: 'Certificat "EWS-ENG-MAINT-LAPTOP" (Serial AA:11:90:EF...) révoqué! Handshake TLS 1.3 interrompu.'
        };
        soeEntry = {
          time: now.toLocaleTimeString(),
          ansi: 'SEC-PKI',
          event: locale === 'fr'
            ? 'CONNEXION PAR CERTIFICAT RÉVOQUÉ INTERDITE: Contrôle OCSP strict conforme CEI 62351-9'
            : 'REVOKED CERTIFICATE CONNECTION DENIED: Strict OCSP check conforming to IEC 62351-9',
          breakers: 'PASSERELLE [ACCÈS FERMÉ]',
          clearing: 'Handshake Abort',
          severity: 'WARNING'
        };
        break;
    }

    setAttackLog(prev => [logMsg, ...prev]);
    setDpiPackets(prev => [attackPkt, ...prev.slice(0, 39)]);

    // Emit to main substation SOE log chronicle
    if (onEmitSoeLog) {
      onEmitSoeLog(soeEntry);
    }

    // Progress animation
    let currentStep = 10;
    const interval = setInterval(() => {
      currentStep += 30;
      setAttackProgress(currentStep);
      if (currentStep >= 100) {
        clearInterval(interval);
      }
    }, 400);
  };

  const handleStopAttack = () => {
    setActiveAttack(null);
    setAttackProgress(0);
    const now = new Date();
    setAttackLog(prev => [
      locale === 'fr'
        ? `[${now.toLocaleTimeString()}] Attaque neutralisée. Retour aux flux nominaux surveillés.`
        : `[${now.toLocaleTimeString()}] Threat neutralised. Reverted to nominal monitored streams.`,
      ...prev
    ]);
  };

  const handleRenewCertificate = (certId: string) => {
    setCertificates(prev => prev.map(c => {
      if (c.id === certId) {
        return {
          ...c,
          validTo: '2029-12-31',
          status: 'VALID',
          serialNumber: Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase() + ':RENEWED'
        };
      }
      return c;
    }));
  };

  const handleRevokeCertificate = (certId: string) => {
    setCertificates(prev => prev.map(c => {
      if (c.id === certId) {
        return {
          ...c,
          status: 'REVOKED'
        };
      }
      return c;
    }));
  };

  // Export JSON Cybersecurity Audit Report
  const handleExportAuditReport = () => {
    const reportData = {
      substation: 'Poste 225/30 kV d’Oyomabang (SONATREL)',
      standard: 'IEC 62351-3, IEC 62351-6, IEC 62351-7, IEC 62351-9, NERC CIP-005',
      exportTimestamp: new Date().toISOString(),
      securityPostureScore: `${securityScore}%`,
      threatDefconLevel: activeAttack ? 'DEFCON 2 - ACTIVE THREAT MITIGATED' : 'DEFCON 5 - NORMAL OPERATIONS',
      mitigations: {
        quarantineActive,
        enforceStrictHmac,
        readOnlyProtectionLock,
        ptpAnnexKEnforced,
        stormRateLimiterActive
      },
      certificates: certificates.map(c => ({
        id: c.id,
        name: c.name,
        status: c.status,
        algorithm: c.algorithm,
        keyLength: c.keyLength,
        validTo: c.validTo,
        issuer: c.issuer
      })),
      recentDpiEvents: dpiPackets.slice(0, 10).map(p => ({
        time: p.timestamp,
        protocol: p.protocol,
        action: p.action,
        rule: p.ruleTriggered,
        details: p.details
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-cybersecurity-iec62351-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredDpiPackets = useMemo(() => {
    if (dpiFilterProtocol === 'ALL') return dpiPackets;
    return dpiPackets.filter(p => p.protocol === dpiFilterProtocol);
  }, [dpiPackets, dpiFilterProtocol]);

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner: Security Posture & Status */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl border ${
              activeAttack
                ? 'bg-rose-500/20 border-rose-500/60 text-rose-400 animate-pulse'
                : 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400'
            }`}>
              {activeAttack ? <ShieldAlert className="h-7 w-7" /> : <ShieldCheck className="h-7 w-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-mono tracking-tight text-white uppercase">
                  {locale === 'fr'
                    ? 'Moniteur Cybersécurité OT & IDS Réseau (CEI 62351)'
                    : 'OT Cybersecurity Monitor & Network IDS (IEC 62351)'}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono tracking-wider ${
                  activeAttack
                    ? 'bg-rose-600 text-white animate-bounce'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {activeAttack
                    ? (locale === 'fr' ? 'ALERTE INTRUSION DÉTECTÉE' : 'INTRUSION THREAT DETECTED')
                    : (locale === 'fr' ? 'SÉCURISÉ / DÉFENSE ACTIVE' : 'SECURE / DEFENSE ARMED')}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? 'Inspection profonde DPI en temps réel des bus de process (SV 9-2LE) et station (GOOSE/MMS) avec authentification cryptographique.'
                  : 'Real-time deep packet inspection (DPI) of process bus (SV 9-2LE) and station bus (GOOSE/MMS) with cryptographic authentication.'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[10px] uppercase font-mono font-bold text-slate-400">
                {locale === 'fr' ? 'Score de Posture OT' : 'OT Posture Score'}
              </div>
              <div className={`text-xl font-mono font-black ${
                securityScore > 85 ? 'text-emerald-400' : securityScore > 65 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {securityScore}%
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[10px] uppercase font-mono font-bold text-slate-400">
                {locale === 'fr' ? 'Trames Inspectées' : 'Inspected Frames'}
              </div>
              <div className="text-xl font-mono font-black text-cyan-400">
                {packetIdCounter.current + 4120}
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportAuditReport}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold transition-colors shadow-xs cursor-pointer"
              title="Exporter rapport de conformité CEI 62351 / NERC CIP"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Rapport Audit' : 'Audit Report'}</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-800 mt-4 pt-3 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveSubTab('OVERVIEW')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'OVERVIEW'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? '1. Architecture & ESP' : '1. Architecture & ESP'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ATTACK_SIM')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'ATTACK_SIM'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? '2. Simulateur d’Attaques OT' : '2. OT Attack Simulator'}</span>
            {activeAttack && <span className="h-2 w-2 rounded-full bg-rose-300 animate-ping" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('DPI_STREAM')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'DPI_STREAM'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? '3. Flux DPI Temps Réel' : '3. Live DPI Stream'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('PKI_CERTS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'PKI_CERTS'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? '4. Gestion PKI (CEI 62351-9)' : '4. PKI Manager (62351-9)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('HARDENING')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'HARDENING'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? '5. Durcissement & Contre-Mesures' : '5. Hardening & Mitigation'}</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: ARCHITECTURE & ESP (ELECTRONIC SECURITY PERIMETER) */}
      {activeSubTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Zone 3: Station Bus */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-sky-400" />
                    <span className="text-xs font-mono font-bold text-sky-300 uppercase">
                      Zone 3 : Bus de Station (MMS / GOOSE)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                    VLAN 10 / 1000M
                  </span>
                </div>
                <ul className="text-xs space-y-2 text-slate-300 font-mono">
                  <li className="flex items-center justify-between">
                    <span>• IED-BAY-01 (SEL-411L)</span>
                    <span className="text-emerald-400 font-bold">TLS 1.3 / HMAC</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>• IED-TRAFO-01 (RET670)</span>
                    <span className="text-emerald-400 font-bold">TLS 1.3 / HMAC</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>• Passerelle SCADA RTU</span>
                    <span className="text-emerald-400 font-bold">104-TLS / RBAC</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                Protégé par mTLS X.509 et contrôle des accès basé sur les rôles (CEI 62351-8).
              </div>
            </div>

            {/* Zone 2: Process Bus */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                      Zone 2 : Bus de Process (SV 9-2LE)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    VLAN 20 / Optique
                  </span>
                </div>
                <ul className="text-xs space-y-2 text-slate-300 font-mono">
                  <li className="flex items-center justify-between">
                    <span>• SAMU-01 Merging Unit</span>
                    <span className="text-emerald-400 font-bold">4000 fps / Signé</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>• Horloge PTP 1588v2 GM</span>
                    <span className="text-emerald-400 font-bold">Annex K Anti-Spoof</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>• Déclencheur Trip GOOSE</span>
                    <span className="text-emerald-400 font-bold">&lt; 3ms / HMAC-256</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                Chiffrement d’intégrité CEI 62351-6 empêchant l'injection d'échantillons ou rejeux.
              </div>
            </div>

            {/* Zone 1: Electronic Security Perimeter (ESP) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-emerald-300 uppercase">
                      Zone 1 : DMZ & Pare-feu OT (ESP)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    NERC CIP-005
                  </span>
                </div>
                <ul className="text-xs space-y-2 text-slate-300 font-mono">
                  <li className="flex items-center justify-between">
                    <span>• Pare-feu Stateful OT</span>
                    <span className="text-emerald-400 font-bold">DPI CEI 61850</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>• Serveur KDC de Clés</span>
                    <span className="text-emerald-400 font-bold">Clés Session HMAC</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>• Journalisation Syslog SIEM</span>
                    <span className="text-emerald-400 font-bold">SOE 1ms Horodaté</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                Périmètre électronique étanche interdisant tout accès Internet ou direct IT non filtré.
              </div>
            </div>
          </div>

          {/* Standards Compliance Grid */}
          <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{locale === 'fr' ? 'Matrice de Conformité Normative CEI 62351' : 'IEC 62351 Regulatory Compliance Matrix'}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs text-sky-400">CEI 62351-3</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">CONFORME</span>
                </div>
                <div className="text-[11px] text-slate-300 font-medium">Sécurité Profils TCP/IP</div>
                <div className="text-[10px] text-slate-400 mt-1">mTLS 1.3 pour liaisons MMS & CEI 60870-5-104 avec certificats mutuels.</div>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs text-amber-400">CEI 62351-6</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">CONFORME</span>
                </div>
                <div className="text-[11px] text-slate-300 font-medium">Sécurité Profils GOOSE / SV</div>
                <div className="text-[10px] text-slate-400 mt-1">Authentification HMAC-SHA256 à faible latence (&lt;40µs) sans chiffrement lourd.</div>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs text-emerald-400">CEI 62351-7</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">CONFORME</span>
                </div>
                <div className="text-[11px] text-slate-300 font-medium">Gestion Système & Réseau (NSM)</div>
                <div className="text-[10px] text-slate-400 mt-1">Supervision SNMPv3 sécurisée des ports de switchs, dérives PTP et buffers IED.</div>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs text-purple-400">CEI 62351-9</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">CONFORME</span>
                </div>
                <div className="text-[11px] text-slate-300 font-medium">Gestion des Clés & PKI</div>
                <div className="text-[10px] text-slate-400 mt-1">Cycle de vie des certificats X.509 avec révocation dynamique CRL / OCSP.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ATTACK SIMULATOR */}
      {activeSubTab === 'ATTACK_SIM' && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h4 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-500" />
                  <span>{locale === 'fr' ? 'Simulateur d’Intrusion & Attaques Réseau OT' : 'OT Network Intrusion & Attack Simulator'}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {locale === 'fr'
                    ? 'Injectez des cyberattaques réalistes sur les bus de communication pour évaluer la réponse en temps réel de l’IDS.'
                    : 'Inject realistic cyber attacks across communication buses to test real-time IDS mitigation response.'}
                </p>
              </div>

              {activeAttack ? (
                <button
                  type="button"
                  onClick={handleStopAttack}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer shadow-xs animate-pulse"
                >
                  <Square className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Arrêter l’Attaque' : 'Stop Attack'}</span>
                </button>
              ) : (
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  {locale === 'fr' ? 'Système Prêt au Test' : 'Ready for Injection'}
                </span>
              )}
            </div>

            {/* Attack Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Attack 1 */}
              <div className={`p-4 rounded-xl border transition-all ${
                activeAttack === 'REPLAY_GOOSE'
                  ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}>
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-black text-rose-400 uppercase">1. Rejeu GOOSE (Replay)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">CEI 62351-6</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Capture et réémission d'une trame GOOSE antérieure avec faux ordre d'ouverture du disjoncteur 52-1.
                </p>
                <div className="mt-3 text-[10px] font-mono text-cyan-400">
                  Détection: Rupture de séquence <span className="text-white font-bold">stNum / sqNum</span>.
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchAttack('REPLAY_GOOSE')}
                  disabled={activeAttack === 'REPLAY_GOOSE'}
                  className="mt-3 w-full py-1.5 px-3 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 rounded-lg text-xs font-mono font-bold transition-colors border border-rose-500/40 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="h-3 w-3" />
                  <span>{locale === 'fr' ? 'Lancer Rejeu GOOSE' : 'Inject Replay Attack'}</span>
                </button>
              </div>

              {/* Attack 2 */}
              <div className={`p-4 rounded-xl border transition-all ${
                activeAttack === 'ROGUE_PTP_GM'
                  ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}>
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-black text-amber-400 uppercase">2. Piratage Horloge PTP</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">IEEE 1588</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Injection de trames PTP Announce avec fausse priorité pour décaler l'échantillonnage SV (+2.4µs) et déclencher la diff 87L.
                </p>
                <div className="mt-3 text-[10px] font-mono text-cyan-400">
                  Détection: Grandmaster non certifié & saut de phase &gt; 200ns.
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchAttack('ROGUE_PTP_GM')}
                  disabled={activeAttack === 'ROGUE_PTP_GM'}
                  className="mt-3 w-full py-1.5 px-3 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 rounded-lg text-xs font-mono font-bold transition-colors border border-amber-500/40 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="h-3 w-3" />
                  <span>{locale === 'fr' ? 'Lancer Usurpation PTP' : 'Inject PTP Attack'}</span>
                </button>
              </div>

              {/* Attack 3 */}
              <div className={`p-4 rounded-xl border transition-all ${
                activeAttack === 'SV_SPOOFING'
                  ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}>
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-black text-cyan-400 uppercase">3. Falsification Trames SV</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">9-2LE</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Injection de courants transitoires massifs (28.5 kA) pour faire disjoncter sans défaut réel.
                </p>
                <div className="mt-3 text-[10px] font-mono text-cyan-400">
                  Détection: Échec de signature cryptographique <span className="text-white font-bold">HMAC-SHA256</span>.
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchAttack('SV_SPOOFING')}
                  disabled={activeAttack === 'SV_SPOOFING'}
                  className="mt-3 w-full py-1.5 px-3 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 rounded-lg text-xs font-mono font-bold transition-colors border border-cyan-500/40 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="h-3 w-3" />
                  <span>{locale === 'fr' ? 'Lancer Falsification SV' : 'Inject SV Spoofing'}</span>
                </button>
              </div>

              {/* Attack 4 */}
              <div className={`p-4 rounded-xl border transition-all ${
                activeAttack === 'DOS_FLOODING'
                  ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}>
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-black text-purple-400 uppercase">4. Déni de Service (DoS)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">CEI 62351-7</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Tempête de 45 000 trames/seconde visant à saturer les buffers de réception des IEDs de protection.
                </p>
                <div className="mt-3 text-[10px] font-mono text-cyan-400">
                  Détection: Contrôle de tempête matériel et limitation de bande passante.
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchAttack('DOS_FLOODING')}
                  disabled={activeAttack === 'DOS_FLOODING'}
                  className="mt-3 w-full py-1.5 px-3 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg text-xs font-mono font-bold transition-colors border border-purple-500/40 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="h-3 w-3" />
                  <span>{locale === 'fr' ? 'Lancer Tempête DoS' : 'Inject DoS Flood'}</span>
                </button>
              </div>

              {/* Attack 5 */}
              <div className={`p-4 rounded-xl border transition-all ${
                activeAttack === 'UNAUTH_MMS_WRITE'
                  ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}>
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-black text-orange-400 uppercase">5. Écriture MMS Illégitime</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">CEI 62351-8</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Tentative de neutralisation des seuils de déclenchement 50/51 par commande MMS depuis une IP non habilitée.
                </p>
                <div className="mt-3 text-[10px] font-mono text-cyan-400">
                  Détection: Rejet de certificat mTLS et rôle RBAC insuffisant.
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchAttack('UNAUTH_MMS_WRITE')}
                  disabled={activeAttack === 'UNAUTH_MMS_WRITE'}
                  className="mt-3 w-full py-1.5 px-3 bg-orange-600/30 hover:bg-orange-600/50 text-orange-300 rounded-lg text-xs font-mono font-bold transition-colors border border-orange-500/40 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="h-3 w-3" />
                  <span>{locale === 'fr' ? 'Lancer Forçage MMS' : 'Inject MMS Write'}</span>
                </button>
              </div>

              {/* Attack 6 */}
              <div className={`p-4 rounded-xl border transition-all ${
                activeAttack === 'REVOKED_CERT'
                  ? 'bg-rose-950/40 border-rose-500 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}>
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-black text-emerald-400 uppercase">6. Certificat Révoqué</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">CEI 62351-9</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Présentation d'un ancien certificat d'ordinateur d'ingénierie présent sur la liste de révocation CRL/OCSP.
                </p>
                <div className="mt-3 text-[10px] font-mono text-cyan-400">
                  Détection: Interruption immédiate du handshake TLS 1.3.
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchAttack('REVOKED_CERT')}
                  disabled={activeAttack === 'REVOKED_CERT'}
                  className="mt-3 w-full py-1.5 px-3 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 rounded-lg text-xs font-mono font-bold transition-colors border border-emerald-500/40 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="h-3 w-3" />
                  <span>{locale === 'fr' ? 'Lancer Cert Révoqué' : 'Inject Revoked Cert'}</span>
                </button>
              </div>
            </div>

            {/* Attack Output / Mitigation Console */}
            {activeAttack && (
              <div className="mt-5 p-4 bg-slate-900 border border-rose-500/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs">
                    <Terminal className="h-4 w-4" />
                    <span>RÉSULTAT DE L’INSPECTION PROFONDE (DPI) & ATTÉNUATION EN DIRECT :</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">Progression test :</span>
                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, attackProgress)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-rose-300 space-y-1 max-h-36 overflow-y-auto">
                  {attackLog.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      &gt; {log}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{locale === 'fr' ? 'ATTÉNUATION AUTOMATIQUE RÉUSSIE :' : 'AUTOMATIC MITIGATION SUCCESSFUL:'} Paquet neutralisé en couche 2/4. Aucun déclenchement intempestif des disjoncteurs.</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                    Temps réponse &lt; 1 ms
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LIVE DPI STREAM */}
      {activeSubTab === 'DPI_STREAM' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${dpiStreamPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`} />
                <h4 className="text-xs font-mono font-bold text-white uppercase">
                  {locale === 'fr' ? 'Flux d’Inspection Profonde DPI en Temps Réel' : 'Live Deep Packet Inspection Stream'}
                </h4>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Protocol Filter Chips */}
                {(['ALL', 'GOOSE', 'SV_9_2LE', 'MMS', 'PTP_1588'] as const).map((proto) => (
                  <button
                    key={proto}
                    type="button"
                    onClick={() => setDpiFilterProtocol(proto)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      dpiFilterProtocol === proto
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {proto === 'ALL' ? (locale === 'fr' ? 'TOUS' : 'ALL') : proto}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setDpiStreamPaused(!dpiStreamPaused)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                    dpiStreamPaused
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {dpiStreamPaused ? <Play className="h-3 w-3" /> : <Square className="h-3 w-3" />}
                  <span>{dpiStreamPaused ? (locale === 'fr' ? 'Reprendre' : 'Resume') : (locale === 'fr' ? 'Pause' : 'Pause')}</span>
                </button>
              </div>
            </div>

            {/* DPI Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                    <th className="py-2 px-2.5">Horodatage</th>
                    <th className="py-2 px-2.5">Protocole</th>
                    <th className="py-2 px-2.5">Source &rarr; Dest</th>
                    <th className="py-2 px-2.5">Action IDS</th>
                    <th className="py-2 px-2.5">Règle CEI 62351</th>
                    <th className="py-2 px-2.5">Détail Cryptographique / Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDpiPackets.map((pkt) => (
                    <tr
                      key={pkt.id}
                      className={`hover:bg-slate-900/60 transition-colors ${
                        pkt.severity === 'CRITICAL'
                          ? 'bg-rose-950/20'
                          : pkt.severity === 'WARNING'
                          ? 'bg-amber-950/20'
                          : ''
                      }`}
                    >
                      <td className="py-2 px-2.5 text-slate-400 text-[11px] whitespace-nowrap">{pkt.timestamp}</td>
                      <td className="py-2 px-2.5 font-bold">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          pkt.protocol === 'SV_9_2LE'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : pkt.protocol === 'GOOSE'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : pkt.protocol === 'MMS'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {pkt.protocol}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 text-slate-300 text-[11px]">
                        <div>{pkt.srcIp ? `${pkt.srcIp} (${pkt.srcMac})` : pkt.srcMac}</div>
                        <div className="text-[10px] text-slate-500">&rarr; {pkt.dstIp ? `${pkt.dstIp} (${pkt.dstMac})` : pkt.dstMac}</div>
                      </td>
                      <td className="py-2 px-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          pkt.action === 'PASS'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : pkt.action === 'BLOCKED'
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {pkt.action}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 text-slate-400 text-[11px] whitespace-nowrap">
                        {pkt.ruleTriggered}
                      </td>
                      <td className="py-2 px-2.5 text-slate-300 text-[11px] max-w-md truncate">
                        {pkt.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PKI CERTIFICATES MANAGEMENT (IEC 62351-9) */}
      {activeSubTab === 'PKI_CERTS' && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h4 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
                  <Key className="h-4 w-4 text-amber-400" />
                  <span>{locale === 'fr' ? 'Inventaire des Certificats Numériques X.509 (CEI 62351-9)' : 'X.509 Digital Certificates Inventory (IEC 62351-9)'}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gestion centralisée des identités cryptographiques des IEDs, Merging Units et passerelles du poste.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-lg border border-amber-500/40">
                PKI Locale Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                    <th className="py-2 px-2.5">Équipement / Nom Certificat</th>
                    <th className="py-2 px-2.5">Zone Réseau</th>
                    <th className="py-2 px-2.5">Algorithme & Clé</th>
                    <th className="py-2 px-2.5">Validité Jusqu'à</th>
                    <th className="py-2 px-2.5">Statut PKI</th>
                    <th className="py-2 px-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-2.5 px-2.5">
                        <div className="font-bold text-white">{cert.name}</div>
                        <div className="text-[10px] text-slate-400">{cert.iedModel}</div>
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-300 text-[11px]">{cert.zone}</td>
                      <td className="py-2.5 px-2.5 text-slate-300 text-[11px]">
                        <div>{cert.algorithm}</div>
                        <div className="text-[10px] text-slate-500">{cert.keyLength} bits</div>
                      </td>
                      <td className="py-2.5 px-2.5 text-slate-300 text-[11px]">{cert.validTo}</td>
                      <td className="py-2.5 px-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          cert.status === 'VALID'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : cert.status === 'EXPIRING_SOON'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-600 text-white'
                        }`}>
                          {cert.status === 'VALID' ? 'VALIDE' : cert.status === 'EXPIRING_SOON' ? 'EXPIRATION PROCHE' : 'RÉVOQUÉ'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedCert(cert)}
                            className="px-2 py-1 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                          >
                            Détails
                          </button>
                          {cert.status !== 'VALID' && (
                            <button
                              type="button"
                              onClick={() => handleRenewCertificate(cert.id)}
                              className="px-2 py-1 rounded text-[10px] font-mono bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                            >
                              Renouveler
                            </button>
                          )}
                          {cert.status === 'VALID' && cert.id !== 'cert-root' && (
                            <button
                              type="button"
                              onClick={() => handleRevokeCertificate(cert.id)}
                              className="px-2 py-1 rounded text-[10px] font-mono bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors cursor-pointer"
                            >
                              Révoquer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Certificate Details Modal / Card */}
            {selectedCert && (
              <div className="mt-5 p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono font-bold text-xs text-amber-400 uppercase">
                    Détails X.509 : {selectedCert.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Numéro de Série (ASN.1) :</span>
                    <span className="text-white font-bold">{selectedCert.serialNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Autorité Émettrice (Issuer DN) :</span>
                    <span className="text-white">{selectedCert.issuer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Période de Validité :</span>
                    <span className="text-slate-300">{selectedCert.validFrom} &rarr; {selectedCert.validTo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block">Empreinte SHA-256 (Fingerprint) :</span>
                    <span className="text-cyan-300 text-[11px] break-all">{selectedCert.sha256Fingerprint}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: HARDENING & MITIGATION */}
      {activeSubTab === 'HARDENING' && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <h4 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-400" />
                <span>{locale === 'fr' ? 'Durcissement des Postes & Mesures d’Atténuation Immédiate' : 'Substation Hardening & Rapid Countermeasures'}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Activez ou désactivez les mécanismes de défense en profondeur pour isoler le poste en cas de cybermenace avérée.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Control 1 */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-white">
                    {locale === 'fr' ? 'Signature HMAC Obligatoire (CEI 62351-6)' : 'Strict HMAC Signature Requirement'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Rejette systématiquement toute trame GOOSE ou SV 9-2LE dépourvue de tag HMAC authentifié.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnforceStrictHmac(!enforceStrictHmac)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    enforceStrictHmac
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {enforceStrictHmac ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                </button>
              </div>

              {/* Control 2 */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-white">
                    {locale === 'fr' ? 'Verrouillage Réglages IED (Lecture Seule)' : 'IED Settings Hardware Interlock (Read-Only)'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Bloque toute écriture distante MMS des seuils de protection ANSI 50/51/21/87 sans clé physique.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReadOnlyProtectionLock(!readOnlyProtectionLock)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    readOnlyProtectionLock
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {readOnlyProtectionLock ? 'VERROUILLÉ' : 'LIBRE'}
                </button>
              </div>

              {/* Control 3 */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-white">
                    {locale === 'fr' ? 'Protection Horloge PTP Annex K' : 'PTP Annex K Anti-Spoofing'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Vérifie l'autorité de l'horloge Grandmaster PTP et rejette toute dérive temporelle soudaine.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPtpAnnexKEnforced(!ptpAnnexKEnforced)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    ptpAnnexKEnforced
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {ptpAnnexKEnforced ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                </button>
              </div>

              {/* Control 4 */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-white">
                    {locale === 'fr' ? 'Limiteur de Tempête Réseau (Storm Rate Control)' : 'Storm Rate Limiter (DoS Defense)'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Plafonne les trames multicast à 6000 fps par port pour garantir la priorité aux trames SV légitimes.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStormRateLimiterActive(!stormRateLimiterActive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    stormRateLimiterActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {stormRateLimiterActive ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
