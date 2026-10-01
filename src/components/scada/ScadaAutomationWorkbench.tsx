// src/components/scada/ScadaAutomationWorkbench.tsx
// EPEDE Domain D12 - Automation, Instrumentation & Control (Téléconduite, SAS & Systèmes SCADA)
// Comprehensive 7-Pillar Engineering Workbench compliant with IEC 60870-5-104, IEC 61850, IEC 62351, ANSI 25 & IEEE C37.2

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Cpu,
  Radio,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Zap,
  Sliders,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  Clock,
  Lock,
  Unlock,
  Server,
  Network,
  Terminal,
  FileCode,
  ArrowRight,
  TrendingUp,
  Share2,
  Flame,
  Info,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Eye,
  Key
} from 'lucide-react';
import { BcuInterlockingAndBreakerFailureSimulator } from '../substations/modules/BcuInterlockingAndBreakerFailureSimulator';

interface ScadaAutomationWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (id: string) => void;
}

type PillarKey =
  | 'SAS_MIMIC_SBO'
  | 'IEC104_PROTOCOL'
  | 'INTERLOCKING_50BF'
  | 'SYNCHROCHECK_25'
  | 'AGC_FREQUENCY'
  | 'CYBERSECURITY_62351'
  | 'CAMEROON_FORENSICS';

export const ScadaAutomationWorkbench: React.FC<ScadaAutomationWorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  const [activePillar, setActivePillar] = useState<PillarKey>('SAS_MIMIC_SBO');

  const pillars = useMemo(
    () => [
      {
        id: 'SAS_MIMIC_SBO' as PillarKey,
        num: 'P1',
        titleFr: 'IHM de Travée & Contrôle SBO (BCU)',
        titleEn: 'Bay HMI Mimic & SBO Breaker Control',
        icon: Cpu,
        badgeFr: 'CEI 61850 / BCU',
        badgeEn: 'IEC 61850 / BCU'
      },
      {
        id: 'IEC104_PROTOCOL' as PillarKey,
        num: 'P2',
        titleFr: 'Analyseur de Trames CEI 60870-5-104',
        titleEn: 'IEC 60870-5-104 Protocol Analyzer',
        icon: Terminal,
        badgeFr: 'APDU / ASDU / CP56',
        badgeEn: 'APDU / ASDU / CP56'
      },
      {
        id: 'INTERLOCKING_50BF' as PillarKey,
        num: 'P3',
        titleFr: 'Interverrouillages Logiques & Refus (50BF)',
        titleEn: 'Logic Interlocking & Breaker Failure',
        icon: ShieldAlert,
        badgeFr: 'Sécurité CILO / 50BF',
        badgeEn: 'CILO Safety / 50BF'
      },
      {
        id: 'SYNCHROCHECK_25' as PillarKey,
        num: 'P4',
        titleFr: 'Synchro-contrôle Vectoriel (ANSI 25)',
        titleEn: 'Vectorial Synchrocheck (ANSI 25)',
        icon: Activity,
        badgeFr: 'ΔV, Δf, Δδ, Advance',
        badgeEn: 'ΔV, Δf, Δδ, Advance'
      },
      {
        id: 'AGC_FREQUENCY' as PillarKey,
        num: 'P5',
        titleFr: 'Réglage Fréquence-Puissance (AGC / ACE)',
        titleEn: 'Automatic Generation Control (AGC)',
        icon: TrendingUp,
        badgeFr: 'ACE & Délestage UFLS',
        badgeEn: 'ACE & UFLS Shedding'
      },
      {
        id: 'CYBERSECURITY_62351' as PillarKey,
        num: 'P6',
        titleFr: 'Cybersécurité Réseau OT (CEI 62351)',
        titleEn: 'OT Cybersecurity (IEC 62351)',
        icon: ShieldCheck,
        badgeFr: 'TLS 1.3 / HMAC / DPI',
        badgeEn: 'TLS 1.3 / HMAC / DPI'
      },
      {
        id: 'CAMEROON_FORENSICS' as PillarKey,
        num: 'P7',
        titleFr: 'Dispatchings Cameroun & Retours d\'Incident',
        titleEn: 'Cameroon Dispatching & Forensics',
        icon: Radio,
        badgeFr: 'Mangombé & Koumassi',
        badgeEn: 'Mangombé & Koumassi'
      }
    ],
    []
  );

  // ===========================================================================
  // PILLAR 1: SAS BAY MIMIC & SBO STATE
  // ===========================================================================
  const [controlAuthority, setControlAuthority] = useState<'LOCAL' | 'BAY_BCU' | 'STATION_HMI' | 'REMOTE_DISPATCH'>('REMOTE_DISPATCH');
  const [breakerQ0Closed, setBreakerQ0Closed] = useState<boolean>(true);
  const [disconnectorQ1Closed, setDisconnectorQ1Closed] = useState<boolean>(true);
  const [disconnectorQ2Closed, setDisconnectorQ2Closed] = useState<boolean>(false);
  const [disconnectorQ9Closed, setDisconnectorQ9Closed] = useState<boolean>(true);
  const [earthQ8Closed, setEarthQ8Closed] = useState<boolean>(false);
  
  // SBO (Select-Before-Operate) execution state machine
  const [sboStage, setSboStage] = useState<'IDLE' | 'SELECT_ARMED' | 'OPERATING' | 'SUCCESS' | 'ABORTED'>('IDLE');
  const [sboTargetApparatus, setSboTargetApparatus] = useState<string>('Q0');
  const [sboTargetAction, setSboTargetAction] = useState<'OPEN' | 'CLOSE'>('OPEN');
  const [sboTimerRemaining, setSboTimerRemaining] = useState<number>(0);
  const [sboLog, setSboLog] = useState<string[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sboStage === 'SELECT_ARMED' && sboTimerRemaining > 0) {
      timer = setTimeout(() => {
        setSboTimerRemaining((prev) => prev - 1);
      }, 1000);
    } else if (sboStage === 'SELECT_ARMED' && sboTimerRemaining <= 0) {
      setSboStage('ABORTED');
      setSboLog((prev) => [
        `[${new Date().toLocaleTimeString()}] SBO Timeout! Commande ${sboTargetAction} sur ${sboTargetApparatus} annulée automatiquement (sécurité).`,
        ...prev.slice(0, 8)
      ]);
    }
    return () => clearTimeout(timer);
  }, [sboStage, sboTimerRemaining, sboTargetAction, sboTargetApparatus]);

  const handleArmSbo = (apparatus: string, action: 'OPEN' | 'CLOSE') => {
    // Interlocking safety pre-check
    if (apparatus === 'Q9' && action === 'OPEN' && breakerQ0Closed) {
      setSboLog((prev) => [
        `[${new Date().toLocaleTimeString()}] INTERVERROUILLAGE ACTIF: Impossible de manœuvrer Q9 (Sectionneur de ligne) tant que Q0 (Disjoncteur) est FERMÉ !`,
        ...prev.slice(0, 8)
      ]);
      return;
    }
    if (apparatus === 'Q8' && action === 'CLOSE' && (disconnectorQ9Closed || breakerQ0Closed)) {
      setSboLog((prev) => [
        `[${new Date().toLocaleTimeString()}] DANGER INTERVERROUILLAGE: Impossible de fermer Q8 (Terre) si la ligne ou le disjoncteur est raccordé !`,
        ...prev.slice(0, 8)
      ]);
      return;
    }

    setSboTargetApparatus(apparatus);
    setSboTargetAction(action);
    setSboStage('SELECT_ARMED');
    setSboTimerRemaining(10); // 10s arming window
    setSboLog((prev) => [
      `[${new Date().toLocaleTimeString()}] SBO SÉLECTION ARMÉE: Ordre ${action} sur ${apparatus}. Validation interverrouillages OK. Confirmation COT=7 émise au SCADA. Fenêtre d'exécution: 10s.`,
      ...prev.slice(0, 8)
    ]);
  };

  const handleExecuteSbo = () => {
    if (sboStage !== 'SELECT_ARMED') return;
    setSboStage('OPERATING');
    setSboLog((prev) => [
      `[${new Date().toLocaleTimeString()}] SBO EXÉCUTION: Ordre physique transmis à la bobine de commande de ${sboTargetApparatus}...`,
      ...prev.slice(0, 8)
    ]);

    setTimeout(() => {
      if (sboTargetApparatus === 'Q0') {
        setBreakerQ0Closed(sboTargetAction === 'CLOSE');
      } else if (sboTargetApparatus === 'Q1') {
        setDisconnectorQ1Closed(sboTargetAction === 'CLOSE');
      } else if (sboTargetApparatus === 'Q2') {
        setDisconnectorQ2Closed(sboTargetAction === 'CLOSE');
      } else if (sboTargetApparatus === 'Q9') {
        setDisconnectorQ9Closed(sboTargetAction === 'CLOSE');
      } else if (sboTargetApparatus === 'Q8') {
        setEarthQ8Closed(sboTargetAction === 'CLOSE');
      }
      setSboStage('SUCCESS');
      setSboLog((prev) => [
        `[${new Date().toLocaleTimeString()}] TÉLÉCOMMANDE ACCOMPLIE: ${sboTargetApparatus} est désormais ${sboTargetAction === 'CLOSE' ? 'FERMÉ' : 'OUVERT'}. Signalisation double COT=3 transmise au dispatching.`,
        ...prev.slice(0, 8)
      ]);
    }, 600);
  };

  const handleCancelSbo = () => {
    setSboStage('IDLE');
    setSboTimerRemaining(0);
    setSboLog((prev) => [
      `[${new Date().toLocaleTimeString()}] SBO ANNULÉ manuellement par l'opérateur.`,
      ...prev.slice(0, 8)
    ]);
  };

  // Live bay electric variables
  const bayVoltageKv = breakerQ0Closed && (disconnectorQ1Closed || disconnectorQ2Closed) && disconnectorQ9Closed ? 224.8 : 0;
  const bayCurrentA = breakerQ0Closed && (disconnectorQ1Closed || disconnectorQ2Closed) && disconnectorQ9Closed ? 485 : 0;
  const bayPowerMw = ((Math.sqrt(3) * bayVoltageKv * bayCurrentA * 0.92) / 1000).toFixed(1);
  const bayPowerMvar = ((Math.sqrt(3) * bayVoltageKv * bayCurrentA * Math.sin(Math.acos(0.92))) / 1000).toFixed(1);

  // ===========================================================================
  // PILLAR 2: IEC 60870-5-104 PROTOCOL ANALYZER
  // ===========================================================================
  const [asduTypeSelected, setAsduTypeSelected] = useState<number>(46); // 46 = Double command C_DC_NA_1
  const [cotSelected, setCotSelected] = useState<number>(6); // 6 = Activation
  const [coaValue, setCoaValue] = useState<number>(1);
  const [ioaValue, setIoaValue] = useState<number>(1001);
  const [commandAction, setCommandAction] = useState<'OPEN' | 'CLOSE'>('OPEN');
  const [sboBit, setSboBit] = useState<boolean>(true); // S/E bit: 1 = Select, 0 = Execute
  const [sendSeqNum, setSendSeqNum] = useState<number>(14);
  const [recvSeqNum, setRecvSeqNum] = useState<number>(8);

  const generatedIec104Hex = useMemo(() => {
    // APCI: Start 0x68, Len, Control field (4 bytes for I-frame)
    // ASDU: Type ID (1 byte), VSQ (1 byte), COT (2 bytes), COA (2 bytes), IOA (3 bytes), Payload
    const startByte = '68';
    const apduLen = '14'; // 20 bytes total
    const cf1 = (sendSeqNum << 1).toString(16).padStart(2, '0');
    const cf2 = (sendSeqNum >> 7).toString(16).padStart(2, '0');
    const cf3 = (recvSeqNum << 1).toString(16).padStart(2, '0');
    const cf4 = (recvSeqNum >> 7).toString(16).padStart(2, '0');

    const typeHex = asduTypeSelected.toString(16).padStart(2, '0');
    const vsqHex = '01'; // 1 object
    const cot1Hex = cotSelected.toString(16).padStart(2, '0');
    const cot2Hex = '00';
    const coa1Hex = (coaValue & 0xff).toString(16).padStart(2, '0');
    const coa2Hex = ((coaValue >> 8) & 0xff).toString(16).padStart(2, '0');
    const ioa1Hex = (ioaValue & 0xff).toString(16).padStart(2, '0');
    const ioa2Hex = ((ioaValue >> 8) & 0xff).toString(16).padStart(2, '0');
    const ioa3Hex = ((ioaValue >> 16) & 0xff).toString(16).padStart(2, '0');

    // Command qualifier: DCO (Double Command)
    // bits 0-1: 1=Open, 2=Close. bit 7: S/E (Select=0x80, Execute=0x00)
    let dcoVal = commandAction === 'OPEN' ? 1 : 2;
    if (sboBit) dcoVal |= 0x80;
    const valHex = dcoVal.toString(16).padStart(2, '0');

    // CP56Time2a timestamp (7 bytes) mock
    const now = new Date();
    const ms = now.getMilliseconds() + now.getSeconds() * 1000;
    const ms1Hex = (ms & 0xff).toString(16).padStart(2, '0');
    const ms2Hex = ((ms >> 8) & 0xff).toString(16).padStart(2, '0');
    const minHex = (now.getMinutes() & 0x3f).toString(16).padStart(2, '0');
    const hrHex = (now.getHours() & 0x1f).toString(16).padStart(2, '0');
    const dayHex = ((now.getDate() & 0x1f) | ((now.getDay() || 7) << 5)).toString(16).padStart(2, '0');
    const monHex = ((now.getMonth() + 1) & 0x0f).toString(16).padStart(2, '0');
    const yrHex = ((now.getFullYear() % 100) & 0x7f).toString(16).padStart(2, '0');

    return {
      start: startByte,
      len: apduLen,
      apci: `${cf1} ${cf2} ${cf3} ${cf4}`,
      type: typeHex,
      vsq: vsqHex,
      cot: `${cot1Hex} ${cot2Hex}`,
      coa: `${coa1Hex} ${coa2Hex}`,
      ioa: `${ioa1Hex} ${ioa2Hex} ${ioa3Hex}`,
      val: valHex,
      time: `${ms1Hex} ${ms2Hex} ${minHex} ${hrHex} ${dayHex} ${monHex} ${yrHex}`,
      fullHex: `${startByte} ${apduLen} ${cf1} ${cf2} ${cf3} ${cf4} ${typeHex} ${vsqHex} ${cot1Hex} ${cot2Hex} ${coa1Hex} ${coa2Hex} ${ioa1Hex} ${ioa2Hex} ${ioa3Hex} ${valHex} ${ms1Hex} ${ms2Hex} ${minHex} ${hrHex} ${dayHex} ${monHex} ${yrHex}`
    };
  }, [sendSeqNum, recvSeqNum, asduTypeSelected, cotSelected, coaValue, ioaValue, commandAction, sboBit]);

  // ===========================================================================
  // PILLAR 4: SYNCHROCHECK ANSI 25 VECTOR CALCULATOR
  // ===========================================================================
  const [synchroBusVoltageKv, setSynchroBusVoltageKv] = useState<number>(225);
  const [synchroLineVoltageKv, setSynchroLineVoltageKv] = useState<number>(223);
  const [synchroDeltaFreqHz, setSynchroDeltaFreqHz] = useState<number>(0.04); // slip
  const [synchroDeltaAngleDeg, setSynchroDeltaAngleDeg] = useState<number>(6.5);
  const [breakerClosingTimeMs, setBreakerClosingTimeMs] = useState<number>(75);

  const deltaVoltageKv = Math.abs(synchroBusVoltageKv - synchroLineVoltageKv);
  const deltaVoltagePercent = (deltaVoltageKv / 225) * 100;
  const advanceAngleDeg = 360 * synchroDeltaFreqHz * (breakerClosingTimeMs / 1000);

  const isSynchroVoltageOk = deltaVoltagePercent <= 5.0; // <= 5%
  const isSynchroFreqOk = Math.abs(synchroDeltaFreqHz) <= 0.1; // <= 0.1 Hz
  const isSynchroAngleOk = Math.abs(synchroDeltaAngleDeg) <= 12.0; // <= 12 deg
  const isSynchroPermissiveGranted = isSynchroVoltageOk && isSynchroFreqOk && isSynchroAngleOk;

  // ===========================================================================
  // PILLAR 5: AUTOMATIC GENERATION CONTROL (AGC) & FREQUENCY SIMULATOR
  // ===========================================================================
  const [gridFrequencyHz, setGridFrequencyHz] = useState<number>(50.0);
  const [frequencyBiasB, setFrequencyBiasB] = useState<number>(35); // MW / 0.1 Hz
  const [tieLinePowerActualMw, setTieLinePowerActualMw] = useState<number>(180);
  const [tieLinePowerScheduledMw, setTieLinePowerScheduledMw] = useState<number>(180);
  const [agcMode, setAgcMode] = useState<'AUTO' | 'MANUAL' | 'OFF'>('AUTO');
  const [isSimulatingContingency, setIsSimulatingContingency] = useState<boolean>(false);
  const [contingencyStage, setContingencyStage] = useState<string>('Nominal 50.0 Hz');

  const areaControlErrorAce = useMemo(() => {
    const deltaP = tieLinePowerActualMw - tieLinePowerScheduledMw;
    const deltaF = gridFrequencyHz - 50.0;
    // ACE = (Ptie - Pprog) + 10 * B * (f - f0)
    return deltaP + 10 * frequencyBiasB * deltaF;
  }, [tieLinePowerActualMw, tieLinePowerScheduledMw, gridFrequencyHz, frequencyBiasB]);

  const triggerContingencyTrip = () => {
    setIsSimulatingContingency(true);
    setContingencyStage('Défaut 225 kV: Déclenchement de 120 MW à Songloulou');
    setGridFrequencyHz(49.35); // Drop below 49.5 Hz -> UFLS Stage 1!
    setTieLinePowerActualMw(225);

    setTimeout(() => {
      setContingencyStage('UFLS Palier 1: Délestage automatique de 40 MW à Douala (Bassa/Bonabéri)');
      setGridFrequencyHz(49.65);
    }, 2500);

    setTimeout(() => {
      setContingencyStage('Régulation AGC Secondaire: Ordre télégraphié à Nachtigal (+80 MW)');
      setGridFrequencyHz(49.92);
      setTieLinePowerActualMw(185);
    }, 5500);

    setTimeout(() => {
      setContingencyStage('Réseau stabilisé à 50.00 Hz par le Dispatching National de Mangombé');
      setGridFrequencyHz(50.0);
      setTieLinePowerActualMw(180);
      setIsSimulatingContingency(false);
    }, 8500);
  };

  // ===========================================================================
  // PILLAR 6: IEC 62351 OT CYBERSECURITY SIMULATOR
  // ===========================================================================
  const [cyberProtectionEnabled, setCyberProtectionEnabled] = useState<boolean>(true);
  const [simulatedAttackType, setSimulatedAttackType] = useState<'REPLAY_ATTACK' | 'MALICIOUS_TRIP' | 'GOOSE_POISONING' | 'NONE'>('NONE');
  const [attackExecutionLog, setAttackExecutionLog] = useState<string[]>([]);

  const handleExecuteAttackSimulation = (type: 'REPLAY_ATTACK' | 'MALICIOUS_TRIP' | 'GOOSE_POISONING') => {
    setSimulatedAttackType(type);
    if (cyberProtectionEnabled) {
      if (type === 'MALICIOUS_TRIP') {
        setAttackExecutionLog((prev) => [
          `[${new Date().toLocaleTimeString()}] ATTAQUE BLOQUÉE: Injection d'ordre frauduleux C_DC_NA_1 sur port 2404 interceptée. Signature cryptographique HMAC-SHA256 absente ou certificat X.509 invalide (CEI 62351-5). Ordre rejeté par le pare-feu de poste.`,
          ...prev.slice(0, 6)
        ]);
      } else if (type === 'REPLAY_ATTACK') {
        setAttackExecutionLog((prev) => [
          `[${new Date().toLocaleTimeString()}] ATTAQUE BLOQUÉE: Tente de rejouer une trame CEI 104 capturée. Le numéro de séquence d'information N(S) est obsolète et l'horodatage CP56Time2a dépasse la tolérance d'anti-rejeu (< 200 ms per CEI 62351-3). Trame détruite.`,
          ...prev.slice(0, 6)
        ]);
      } else {
        setAttackExecutionLog((prev) => [
          `[${new Date().toLocaleTimeString()}] ATTAQUE BLOQUÉE: Trames GOOSE falsifiées avec faux stNum. Le commutateur de poste applique l'inspection IEEE 802.1Q et la vérification de jeton d'authentification CEI 62351-6. Port isolé automatiquement.`,
          ...prev.slice(0, 6)
        ]);
      }
    } else {
      // VULNERABLE WITHOUT IEC 62351
      if (type === 'MALICIOUS_TRIP') {
        setBreakerQ0Closed(false);
        setAttackExecutionLog((prev) => [
          `[${new Date().toLocaleTimeString()}] ⚠️ COMPROMISSION MAJEURE (SANS CEI 62351) : L'attaquant a injecté une trame CEI 104 non chiffrée. Le BCU a exécuté l'ordre d'ouverture sans authentification ! Le disjoncteur 225 kV s'est ouvert en pleine charge !`,
          ...prev.slice(0, 6)
        ]);
      } else if (type === 'REPLAY_ATTACK') {
        setAttackExecutionLog((prev) => [
          `[${new Date().toLocaleTimeString()}] ⚠️ COMPROMISSION MAJEURE (SANS CEI 62351) : Télémesures falsifiées acceptées par le serveur FEP du SCADA. L'opérateur visualise une fausse tension et prend des décisions erronées.`,
          ...prev.slice(0, 6)
        ]);
      } else {
        setAttackExecutionLog((prev) => [
          `[${new Date().toLocaleTimeString()}] ⚠️ COMPROMISSION MAJEURE (SANS CEI 62351) : Tempête de trames GOOSE forgées. Les automates de protection ont déclenché des verrouillages intempestifs.`,
          ...prev.slice(0, 6)
        ]);
      }
    }
  };

  return (
    <div className="space-y-6 text-[#e8eaf0] font-sans">
      {/* 1. DOMAIN BANNER HEADER */}
      <div className="relative bg-gradient-to-br from-[#021f1d] via-[#032926] to-[#011413] border-b-4 border-teal-500 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-6 top-3 text-8xl font-black text-teal-400/[0.04] pointer-events-none select-none font-mono">
          D12
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-teal-400 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              <span>EPEDE Engineering Workbench · Domaine 12 / 21</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight flex items-center gap-3">
              <Cpu className="h-8 w-8 text-teal-400" />
              <span>{locale === 'fr' ? 'Téléconduite, SAS & Systèmes SCADA' : 'Automation, Instrumentation & Control'}</span>
            </h1>
            <p className="text-sm text-neutral-300 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Station expert d\'ingénierie du Contrôle-Commande Numérique (CCN/SAS), des protocoles de téléconduite CEI 60870-5-104, du synchro-contrôle ANSI 25, du réglage AGC national et de la cybersécurité OT CEI 62351.'
                : 'Advanced engineering workbench for Substation Automation Systems (SAS), IEC 60870-5-104 telemetry protocol analysis, ANSI 25 synchrocheck, national AGC frequency regulation, and IEC 62351 OT cybersecurity.'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 border border-teal-800/50 p-3 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                {locale === 'fr' ? 'Disponibilité Téléconduite' : 'SCADA Availability'}
              </div>
              <div className="text-lg font-bold font-mono text-teal-400">99.998 %</div>
            </div>
            <div className="w-px h-8 bg-teal-800/60" />
            <div className="text-right">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                {locale === 'fr' ? 'Portée Télécommande' : 'SBO Latency'}
              </div>
              <div className="text-lg font-bold font-mono text-sky-400">&lt; 350 ms</div>
            </div>
          </div>
        </div>

        {/* 7-PILLAR TAB BAR */}
        <div className="flex gap-2 overflow-x-auto pt-6 pb-1 scrollbar-thin border-t border-teal-900/60 mt-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isCurrent = activePillar === pillar.id;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillar(pillar.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25 scale-[1.02]'
                    : 'bg-slate-900/80 text-neutral-300 hover:text-white hover:bg-slate-800 border border-teal-900/40'
                }`}
              >
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${isCurrent ? 'bg-slate-950 text-teal-400' : 'bg-teal-950 text-teal-300'}`}>
                  {pillar.num}
                </span>
                <Icon className="h-4 w-4 shrink-0" />
                <span>{locale === 'fr' ? pillar.titleFr : pillar.titleEn}</span>
                <span className="hidden xl:inline text-[9px] opacity-75 font-normal ml-1">
                  ({locale === 'fr' ? pillar.badgeFr : pillar.badgeEn})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* PILLAR 1: SAS BAY MIMIC & SBO CONTROL */}
      {/* ===================================================================== */}
      {activePillar === 'SAS_MIMIC_SBO' && (
        <div className="space-y-6">
          {/* Top Control Authority Bar */}
          <div className="bg-slate-900/90 border border-teal-900/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-400" />
              <span className="text-xs font-mono font-bold uppercase text-white">
                {locale === 'fr' ? 'Niveau d\'Autorité de Commande (Loc/Rem) :' : 'Control Authority Level (Loc/Rem):'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: 'LOCAL', labelFr: '1. Local Coffret (Pied Appareil)', labelEn: '1. Local Switchyard' },
                  { id: 'BAY_BCU', labelFr: '2. BCU Travée (Salle Relais)', labelEn: '2. Bay BCU (Relay Room)' },
                  { id: 'STATION_HMI', labelFr: '3. IHM Poste (Supervision)', labelEn: '3. Substation HMI' },
                  { id: 'REMOTE_DISPATCH', labelFr: '4. Dispatching National (Mangombé)', labelEn: '4. National Dispatch (Mangombé)' }
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setControlAuthority(mode.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    controlAuthority === mode.id
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800 text-neutral-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {locale === 'fr' ? mode.labelFr : mode.labelEn}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Bay Interactive SLD Schematic */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    {locale === 'fr' ? 'Travée Ligne 225 kV Bekoko · Synoptique Dynamique' : '225 kV Line Bay Bekoko · Dynamic Mimic'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-teal-400 bg-teal-950/80 border border-teal-800/60 px-2 py-0.5 rounded">
                  CEI 61850-7-4 LN CSWI / XCBR
                </span>
              </div>

              {/* Graphical Bay SLD */}
              <div className="relative bg-[#080d12] border border-slate-800/80 rounded-xl p-6 min-h-[380px] flex flex-col items-center justify-center font-mono">
                {/* Busbar 1 (Jeu de Barres 1) */}
                <div className="w-full max-w-md flex items-center justify-between mb-4">
                  <div className="w-full h-2.5 bg-red-500 rounded flex items-center px-2">
                    <span className="text-[9px] font-black text-white uppercase">Busbar 1 · 225 kV (Barre A)</span>
                  </div>
                </div>

                {/* Busbar 2 (Jeu de Barres 2) */}
                <div className="w-full max-w-md flex items-center justify-between mb-8">
                  <div className="w-full h-2.5 bg-amber-500 rounded flex items-center px-2">
                    <span className="text-[9px] font-black text-white uppercase">Busbar 2 · 225 kV (Barre B)</span>
                  </div>
                </div>

                {/* Disconnectors Q1 & Q2 branches */}
                <div className="w-full max-w-md grid grid-cols-2 gap-8 mb-4">
                  {/* Selector Q1 to Bus 1 */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-neutral-400 mb-1">Q1 (Sélecteur Barre 1)</span>
                    <button
                      type="button"
                      onClick={() => handleArmSbo('Q1', disconnectorQ1Closed ? 'OPEN' : 'CLOSE')}
                      className={`px-4 py-2 rounded-lg border font-bold text-xs transition-all flex items-center gap-2 ${
                        disconnectorQ1Closed
                          ? 'bg-red-500/20 text-red-300 border-red-500 shadow-md shadow-red-500/20'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      }`}
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>{disconnectorQ1Closed ? 'FERMÉ (89A)' : 'OUVERT (89A)'}</span>
                    </button>
                  </div>

                  {/* Selector Q2 to Bus 2 */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-neutral-400 mb-1">Q2 (Sélecteur Barre 2)</span>
                    <button
                      type="button"
                      onClick={() => handleArmSbo('Q2', disconnectorQ2Closed ? 'OPEN' : 'CLOSE')}
                      className={`px-4 py-2 rounded-lg border font-bold text-xs transition-all flex items-center gap-2 ${
                        disconnectorQ2Closed
                          ? 'bg-red-500/20 text-red-300 border-red-500 shadow-md shadow-red-500/20'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      }`}
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>{disconnectorQ2Closed ? 'FERMÉ (89B)' : 'OUVERT (89B)'}</span>
                    </button>
                  </div>
                </div>

                {/* Vertical Bus Coupling Junction Line */}
                <div className="w-0.5 h-6 bg-cyan-400 mb-2" />

                {/* Circuit Breaker Q0 (Disjoncteur 52) */}
                <div className="flex flex-col items-center mb-4">
                  <span className="text-[10px] font-bold text-neutral-300 mb-1">Q0 · Disjoncteur Ligne (ANSI 52)</span>
                  <button
                    type="button"
                    onClick={() => handleArmSbo('Q0', breakerQ0Closed ? 'OPEN' : 'CLOSE')}
                    className={`px-6 py-3 rounded-xl border-2 font-black text-sm tracking-wider transition-all flex items-center gap-3 ${
                      breakerQ0Closed
                        ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-600/30 animate-pulse'
                        : 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30'
                    }`}
                  >
                    <Zap className="h-5 w-5" />
                    <span>{breakerQ0Closed ? 'DISJONCTEUR FERMÉ (EN CHARGE)' : 'DISJONCTEUR OUVERT (DÉCLENCHÉ)'}</span>
                  </button>
                </div>

                <div className="w-0.5 h-6 bg-cyan-400 mb-2" />

                {/* Disconnector Q9 (Line Disconnector 89L) & Earth switch Q8 (89E) */}
                <div className="w-full max-w-md grid grid-cols-2 gap-8 mb-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-neutral-400 mb-1">Q9 (Sectionneur Ligne)</span>
                    <button
                      type="button"
                      onClick={() => handleArmSbo('Q9', disconnectorQ9Closed ? 'OPEN' : 'CLOSE')}
                      className={`px-4 py-2 rounded-lg border font-bold text-xs transition-all flex items-center gap-2 ${
                        disconnectorQ9Closed
                          ? 'bg-red-500/20 text-red-300 border-red-500 shadow-md'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      }`}
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>{disconnectorQ9Closed ? 'FERMÉ (89L)' : 'OUVERT (89L)'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-neutral-400 mb-1">Q8 (Mise à la Terre)</span>
                    <button
                      type="button"
                      onClick={() => handleArmSbo('Q8', earthQ8Closed ? 'OPEN' : 'CLOSE')}
                      className={`px-4 py-2 rounded-lg border font-bold text-xs transition-all flex items-center gap-2 ${
                        earthQ8Closed
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-md'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      }`}
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>{earthQ8Closed ? 'TERRE FERMÉE (89E)' : 'TERRE OUVERTE (89E)'}</span>
                    </button>
                  </div>
                </div>

                {/* Line Outgoing Terminal to Songloulou */}
                <div className="w-full max-w-md flex items-center justify-center pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                    <ArrowRight className="h-4 w-4" />
                    <span>Départ Ligne 225 kV vers Songloulou (Longueur: 62 km · Almélec 570 mm²)</span>
                  </div>
                </div>
              </div>

              {/* Bay Real-time Telemetry Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 font-mono">Tension U12</span>
                  <div className="text-sm font-bold font-mono text-emerald-400">{bayVoltageKv} kV</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 font-mono">Courant Ligne</span>
                  <div className="text-sm font-bold font-mono text-cyan-400">{bayCurrentA} A</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 font-mono">Puissance Active</span>
                  <div className="text-sm font-bold font-mono text-amber-400">{bayPowerMw} MW</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 font-mono">Puissance Réactive</span>
                  <div className="text-sm font-bold font-mono text-purple-400">{bayPowerMvar} Mvar</div>
                </div>
              </div>
            </div>

            {/* SBO Execution & Sequence Console */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      {locale === 'fr' ? 'Protocole SBO (Select Before Operate)' : 'SBO Protocol Sequencer'}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded ${
                      sboStage === 'SELECT_ARMED'
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : sboStage === 'OPERATING'
                        ? 'bg-sky-500 text-slate-950'
                        : sboStage === 'SUCCESS'
                        ? 'bg-emerald-500 text-slate-950'
                        : sboStage === 'ABORTED'
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-800 text-neutral-400'
                    }`}
                  >
                    STATUS: {sboStage}
                  </span>
                </div>

                {/* SBO Action Prompt Card */}
                {sboStage === 'SELECT_ARMED' ? (
                  <div className="bg-amber-950/40 border-2 border-amber-500/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        COMMANDE ARMÉE : {sboTargetAction} sur {sboTargetApparatus}
                      </span>
                      <span className="text-xs font-mono font-black text-amber-400 bg-amber-950 px-2 py-1 rounded border border-amber-700">
                        {sboTimerRemaining} s restantes
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                      Le contrôleur de travée (BCU) a validé les interverrouillages logiques booléens. Le relais d'armement est maintenu. Confirmez l'ordre d'exécution physique.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleExecuteSbo}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs py-2.5 rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>CONFIRMER EXÉCUTION</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelSbo}
                        className="bg-slate-800 hover:bg-slate-700 text-neutral-300 font-mono font-bold text-xs px-3 py-2.5 rounded-lg transition-all"
                      >
                        ANNULER
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs font-mono text-neutral-400">
                    <div className="flex items-center gap-2 text-teal-400 font-bold">
                      <Info className="h-4 w-4" />
                      <span>Séquence SBO en attente :</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Cliquez sur l'un des appareils haute tension du synoptique (Q0, Q1, Q2, Q9, Q8) pour initier une commande d'armement sécurisée en 2 temps (Select-Before-Operate).
                    </p>
                  </div>
                )}
              </div>

              {/* Event & Telemetry Logs */}
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    {locale === 'fr' ? 'Journal Événements SOE (1 ms) :' : 'SOE Event Logger (1 ms):'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSboLog([])}
                    className="text-[10px] font-mono text-neutral-500 hover:text-neutral-300"
                  >
                    Effacer
                  </button>
                </div>
                <div className="bg-[#05080c] border border-slate-800 rounded-xl p-3 h-48 overflow-y-auto space-y-1.5 font-mono text-[11px] scrollbar-thin">
                  {sboLog.length === 0 ? (
                    <div className="text-neutral-600 italic py-2 text-center">Aucun événement enregistré.</div>
                  ) : (
                    sboLog.map((log, i) => (
                      <div key={i} className="text-neutral-300 leading-relaxed border-b border-slate-800/40 pb-1">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PILLAR 2: IEC 60870-5-104 PROTOCOL ANALYZER */}
      {/* ===================================================================== */}
      {activePillar === 'IEC104_PROTOCOL' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-teal-900/60 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-mono font-black text-white flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-teal-400" />
                  <span>{locale === 'fr' ? 'Générateur & Décodeur de Trames CEI 60870-5-104 (APDU / ASDU)' : 'IEC 60870-5-104 APDU / ASDU Frame Inspector'}</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Structure de communication temps réel sur liaison TCP/IP (Port 2404) reliant les passerelles RTU des postes au SCADA National de Mangombé.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono bg-teal-950/80 border border-teal-800/60 px-3 py-1.5 rounded-lg text-teal-300">
                <span>Norme : CEI 60870-5-104:2006</span>
              </div>
            </div>

            {/* Frame Builder Interactive Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-300">Type d'ASDU (Type ID)</label>
                <select
                  value={asduTypeSelected}
                  onChange={(e) => setAsduTypeSelected(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-cyan-300"
                >
                  <option value={1}>Type 1: M_SP_NA_1 (Télésignalisation simple)</option>
                  <option value={3}>Type 3: M_DP_NA_1 (Télésignalisation double)</option>
                  <option value={13}>Type 13: M_ME_NC_1 (Télémesure flottante IEEE 754)</option>
                  <option value={45}>Type 45: C_SC_NA_1 (Télécommande simple)</option>
                  <option value={46}>Type 46: C_DC_NA_1 (Télécommande double avec SBO)</option>
                  <option value={100}>Type 100: C_IC_NA_1 (Interrogation générale)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-300">Cause Transmission (COT)</label>
                <select
                  value={cotSelected}
                  onChange={(e) => setCotSelected(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-amber-300"
                >
                  <option value={3}>3: Spontané (Sur variation d'état / seuil)</option>
                  <option value={6}>6: Activation (Télécommande émise par dispatching)</option>
                  <option value={7}>7: Confirmation d'activation (Émise par RTU)</option>
                  <option value={10}>10: Fin d'activation (Exécution terminée)</option>
                  <option value={20}>20: Réponse Interrogation Générale (GI)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-300">Adresse Commune COA (Poste)</label>
                <input
                  type="number"
                  min={1}
                  max={65535}
                  value={coaValue}
                  onChange={(e) => setCoaValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-neutral-300">Adresse Objet IOA (3 octets)</label>
                <input
                  type="number"
                  min={1}
                  max={16777215}
                  value={ioaValue}
                  onChange={(e) => setIoaValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white"
                />
              </div>
            </div>

            {/* Sequence numbers and SBO toggle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Compteur Émission N(S) : {sendSeqNum}</label>
                <input
                  type="range"
                  min={0}
                  max={32767}
                  value={sendSeqNum}
                  onChange={(e) => setSendSeqNum(Number(e.target.value))}
                  className="w-full accent-teal-400 h-1 bg-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-400">Compteur Réception N(R) : {recvSeqNum}</label>
                <input
                  type="range"
                  min={0}
                  max={32767}
                  value={recvSeqNum}
                  onChange={(e) => setRecvSeqNum(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono font-bold text-neutral-300">Bit S/E (Select / Execute) :</span>
                <button
                  type="button"
                  onClick={() => setSboBit(!sboBit)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                    sboBit ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
                  }`}
                >
                  {sboBit ? '1 = SELECT (Armement)' : '0 = EXECUTE (Exécution)'}
                </button>
              </div>
            </div>

            {/* Color-Coded Hex Dump Viewer */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                {locale === 'fr' ? 'Trame Hexadécimale Brute Décodée :' : 'Raw Color-Coded Hex Dump:'}
              </span>
              <div className="bg-[#05080c] border border-slate-800 p-4 rounded-xl font-mono text-sm leading-relaxed overflow-x-auto space-y-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded" title="Start Byte (0x68)">
                    {generatedIec104Hex.start}
                  </span>
                  <span className="bg-purple-800/80 text-purple-100 px-2 py-0.5 rounded" title="APDU Length (Bytes)">
                    {generatedIec104Hex.len}
                  </span>
                  <span className="bg-blue-900/80 text-blue-200 px-2 py-0.5 rounded" title="APCI Control Field: I-Format N(S)/N(R)">
                    {generatedIec104Hex.apci}
                  </span>
                  <span className="bg-teal-900/80 text-teal-200 px-2 py-0.5 rounded" title="ASDU Type ID">
                    {generatedIec104Hex.type}
                  </span>
                  <span className="bg-teal-800/80 text-teal-100 px-2 py-0.5 rounded" title="Variable Structure Qualifier (VSQ)">
                    {generatedIec104Hex.vsq}
                  </span>
                  <span className="bg-amber-900/80 text-amber-200 px-2 py-0.5 rounded" title="Cause of Transmission (COT)">
                    {generatedIec104Hex.cot}
                  </span>
                  <span className="bg-orange-900/80 text-orange-200 px-2 py-0.5 rounded" title="Common Address of ASDU (COA)">
                    {generatedIec104Hex.coa}
                  </span>
                  <span className="bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded" title="Information Object Address (IOA)">
                    {generatedIec104Hex.ioa}
                  </span>
                  <span className="bg-pink-900/80 text-pink-200 px-2 py-0.5 rounded" title="Value & Qualifier (S/E bit)">
                    {generatedIec104Hex.val}
                  </span>
                  <span className="bg-indigo-900/80 text-indigo-200 px-2 py-0.5 rounded" title="CP56Time2a 7-Byte High-Precision Timestamp">
                    {generatedIec104Hex.time}
                  </span>
                </div>
              </div>
            </div>

            {/* Field Breakdown Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-950 text-neutral-400 uppercase">
                  <tr>
                    <th className="p-2.5">Couche</th>
                    <th className="p-2.5">Champ</th>
                    <th className="p-2.5">Octets</th>
                    <th className="p-2.5">Valeur Hex</th>
                    <th className="p-2.5">Signification Technique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                  <tr>
                    <td className="p-2.5 font-bold text-purple-400">APCI</td>
                    <td className="p-2.5">Start Byte</td>
                    <td className="p-2.5">1</td>
                    <td className="p-2.5 text-purple-300">0x68</td>
                    <td className="p-2.5">Octet de synchronisation normalisé CEI 104</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-blue-400">APCI</td>
                    <td className="p-2.5">Contrôle Format I</td>
                    <td className="p-2.5">4</td>
                    <td className="p-2.5 text-blue-300">{generatedIec104Hex.apci}</td>
                    <td className="p-2.5">N(S)={sendSeqNum}, N(R)={recvSeqNum} (Transfert d'information séquencé)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-teal-400">ASDU</td>
                    <td className="p-2.5">Type ID</td>
                    <td className="p-2.5">1</td>
                    <td className="p-2.5 text-teal-300">0x{generatedIec104Hex.type}</td>
                    <td className="p-2.5">Type {asduTypeSelected} ({asduTypeSelected === 46 ? 'Double Command C_DC_NA_1' : 'Standard ASDU'})</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-amber-400">ASDU</td>
                    <td className="p-2.5">Cause Transm. (COT)</td>
                    <td className="p-2.5">2</td>
                    <td className="p-2.5 text-amber-300">0x{generatedIec104Hex.cot}</td>
                    <td className="p-2.5">COT {cotSelected} ({cotSelected === 6 ? 'Activation' : cotSelected === 7 ? 'Confirmation' : 'Spontané'})</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-orange-400">ASDU</td>
                    <td className="p-2.5">Adresse COA</td>
                    <td className="p-2.5">2</td>
                    <td className="p-2.5 text-orange-300">0x{generatedIec104Hex.coa}</td>
                    <td className="p-2.5">Poste Source / Passerelle RTU (COA = {coaValue})</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-emerald-400">ASDU</td>
                    <td className="p-2.5">Adresse Objet IOA</td>
                    <td className="p-2.5">3</td>
                    <td className="p-2.5 text-emerald-300">0x{generatedIec104Hex.ioa}</td>
                    <td className="p-2.5">Point d'information (Disjoncteur Q0 IOA = {ioaValue})</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-400">ASDU</td>
                    <td className="p-2.5">Horodatage CP56Time2a</td>
                    <td className="p-2.5">7</td>
                    <td className="p-2.5 text-indigo-300">{generatedIec104Hex.time}</td>
                    <td className="p-2.5">Horodatage UTC haute résolution à 1 ms avec drapeau IV et SU</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PILLAR 3: LOGIC INTERLOCKING & BREAKER FAILURE 50BF */}
      {/* ===================================================================== */}
      {activePillar === 'INTERLOCKING_50BF' && (
        <div className="space-y-6">
          <BcuInterlockingAndBreakerFailureSimulator locale={locale} />
        </div>
      )}

      {/* ===================================================================== */}
      {/* PILLAR 4: SYNCHROCHECK ANSI 25 VECTOR CALCULATOR */}
      {/* ===================================================================== */}
      {activePillar === 'SYNCHROCHECK_25' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Synchrocheck Parameters & Sliders */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-teal-400" />
                  <span>{locale === 'fr' ? 'Paramètres Vectoriels de Synchronisation' : 'Vectorial Synchrocheck Parameters'}</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Conditions de couplage sécurisé entre le Jeu de Barres 225 kV et la Ligne Entrante (ou Alternateur).
                </p>
              </div>

              {/* Slider 1: Delta Voltage */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-300">Tension Ligne Entrante Uline :</span>
                  <span className="font-bold text-cyan-400">{synchroLineVoltageKv} kV (Ref. Barre: {synchroBusVoltageKv} kV)</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={245}
                  step={0.5}
                  value={synchroLineVoltageKv}
                  onChange={(e) => setSynchroLineVoltageKv(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-slate-800"
                />
                <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                  <span>Écart d'amplitude |ΔU| : {deltaVoltageKv.toFixed(1)} kV ({deltaVoltagePercent.toFixed(2)} %)</span>
                  <span className={isSynchroVoltageOk ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {isSynchroVoltageOk ? 'CONFORME (≤ 5%)' : 'HORS GABARIT (> 5%)'}
                  </span>
                </div>
              </div>

              {/* Slider 2: Delta Frequency */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-300">Glissement de Fréquence Δf (f1 - f2) :</span>
                  <span className="font-bold text-amber-400">{synchroDeltaFreqHz.toFixed(3)} Hz</span>
                </div>
                <input
                  type="range"
                  min={-0.3}
                  max={0.3}
                  step={0.005}
                  value={synchroDeltaFreqHz}
                  onChange={(e) => setSynchroDeltaFreqHz(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1 bg-slate-800"
                />
                <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                  <span>Vitesse de rotation relative des phaseurs</span>
                  <span className={isSynchroFreqOk ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {isSynchroFreqOk ? 'CONFORME (≤ 0.10 Hz)' : 'HORS GABARIT (> 0.10 Hz)'}
                  </span>
                </div>
              </div>

              {/* Slider 3: Delta Angle */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-300">Déphasage Angulaire |Δδ| :</span>
                  <span className="font-bold text-purple-400">{synchroDeltaAngleDeg.toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={45}
                  step={0.5}
                  value={synchroDeltaAngleDeg}
                  onChange={(e) => setSynchroDeltaAngleDeg(Number(e.target.value))}
                  className="w-full accent-purple-400 h-1 bg-slate-800"
                />
                <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                  <span>Tolérance permissive angulaire max : 12°</span>
                  <span className={isSynchroAngleOk ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {isSynchroAngleOk ? 'CONFORME (≤ 12°)' : 'HORS GABARIT (> 12°)'}
                  </span>
                </div>
              </div>

              {/* Slider 4: Breaker closing time advance */}
              <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-300">Temps mécanique d'enclenchement disjoncteur (tclose) :</span>
                  <span className="font-bold text-white">{breakerClosingTimeMs} ms</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={120}
                  step={5}
                  value={breakerClosingTimeMs}
                  onChange={(e) => setBreakerClosingTimeMs(Number(e.target.value))}
                  className="w-full accent-teal-400 h-1 bg-slate-800"
                />
                <div className="text-[11px] font-mono text-teal-300">
                  Angle d'anticipation de commande calculé : <strong>δlead = {advanceAngleDeg.toFixed(2)}°</strong>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Formule: δlead = 360° · Δf · tclose (compense le retard mécanique pour fermer à 0° parfait).
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Vector Phasor Diagram & Permissive Decision */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    {locale === 'fr' ? 'Diagramme Polaire Synchroscope (ANSI 25)' : 'Synchroscope Polar Phasor Plane'}
                  </span>
                  <span
                    className={`text-xs font-mono font-black px-3 py-1 rounded-full ${
                      isSynchroPermissiveGranted
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 animate-pulse'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {isSynchroPermissiveGranted ? 'PERMIS DE FERMETURE ACCORDÉ' : 'VERROUILLÉ (FERMETURE INTERDITE)'}
                  </span>
                </div>

                {/* SVG Synchroscope */}
                <div className="relative bg-[#05080c] border border-slate-800 rounded-xl p-4 flex items-center justify-center min-h-[260px]">
                  <svg viewBox="0 0 240 240" className="w-56 h-56">
                    {/* Circle dial */}
                    <circle cx="120" cy="120" r="90" fill="none" stroke="#1e293b" strokeWidth="2" />
                    <circle cx="120" cy="120" r="95" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    {/* Permissive Zone Sector (-12° to +12°) */}
                    <path
                      d="M 120 120 L 101.3 32.1 A 90 90 0 0 1 138.7 32.1 Z"
                      fill="rgba(16, 185, 129, 0.2)"
                      stroke="#10b981"
                      strokeWidth="1.5"
                    />
                    <text x="120" y="24" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      ±12° PERMISSIBLE
                    </text>

                    {/* Fixed Bus Reference Vector (Red at 0 deg / North) */}
                    <line x1="120" y1="120" x2="120" y2="35" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                    <text x="125" y="50" fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      Ubus
                    </text>

                    {/* Rotating/Offset Line Vector (Cyan) */}
                    {(() => {
                      const rad = ((synchroDeltaAngleDeg - 90) * Math.PI) / 180;
                      const len = (synchroLineVoltageKv / 225) * 85;
                      const x2 = 120 + len * Math.cos(rad);
                      const y2 = 120 + len * Math.sin(rad);
                      return (
                        <>
                          <line x1="120" y1="120" x2={x2} y2={y2} stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
                          <text x={x2 + 5} y={y2} fill="#06b6d4" fontSize="9" fontFamily="monospace" fontWeight="bold">
                            Uline
                          </text>
                        </>
                      );
                    })()}

                    {/* Center point */}
                    <circle cx="120" cy="120" r="5" fill="#f8fafc" />
                  </svg>
                </div>
              </div>

              {/* Status checklist */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">1. Amplitude Tension |ΔU| ≤ 5% :</span>
                  <span className={isSynchroVoltageOk ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {deltaVoltagePercent.toFixed(2)} % ({isSynchroVoltageOk ? 'PASS' : 'FAIL'})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">2. Glissement Fréquence |Δf| ≤ 0.10 Hz :</span>
                  <span className={isSynchroFreqOk ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {Math.abs(synchroDeltaFreqHz).toFixed(3)} Hz ({isSynchroFreqOk ? 'PASS' : 'FAIL'})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">3. Déphasage Angulaire |Δδ| ≤ 12° :</span>
                  <span className={isSynchroAngleOk ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {synchroDeltaAngleDeg.toFixed(1)}° ({isSynchroAngleOk ? 'PASS' : 'FAIL'})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PILLAR 5: AUTOMATIC GENERATION CONTROL (AGC) & ACE SIMULATOR */}
      {/* ===================================================================== */}
      {activePillar === 'AGC_FREQUENCY' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-teal-400" />
                  <span>{locale === 'fr' ? 'Réglage Automatique Fréquence-Puissance (AGC / ACE)' : 'Automatic Generation Control (AGC) & Area Control Error'}</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Boucle fermée de régulation secondaire de fréquence opérée par le Centre National de Conduite de Mangombé (SONATREL).
                </p>
              </div>

              <button
                type="button"
                disabled={isSimulatingContingency}
                onClick={triggerContingencyTrip}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
                  isSimulatingContingency
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
                }`}
              >
                <Flame className="h-4 w-4" />
                <span>{isSimulatingContingency ? 'SIMULATION EN COURS...' : 'DÉCLENCHER INCIDENT (PERTE 120 MW)'}</span>
              </button>
            </div>

            {/* Current Status banner */}
            <div className="bg-slate-950 p-4 rounded-xl border border-teal-900/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${isSimulatingContingency ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                <span className="text-xs font-mono font-bold text-white uppercase">Étape de Conduite Réseau :</span>
                <span className="text-xs font-mono text-teal-300">{contingencyStage}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-neutral-400">Fréquence Réseau : </span>
                  <span
                    className={`font-black text-sm ${
                      gridFrequencyHz < 49.5
                        ? 'text-red-400 animate-pulse'
                        : gridFrequencyHz < 49.9
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {gridFrequencyHz.toFixed(2)} Hz
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400">Erreur ACE : </span>
                  <span className="font-bold text-cyan-400">{areaControlErrorAce.toFixed(1)} MW</span>
                </div>
              </div>
            </div>

            {/* AGC Mathematical Model & Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#05080c] p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-neutral-300">Équation ACE (Area Control Error) :</span>
                <div className="bg-slate-950 p-3 rounded text-[11px] font-mono text-teal-300 border border-slate-800/80 leading-relaxed">
                  ACE = (Pinter - Pprog) + 10 · B · (f - 50.0)
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  Combine l'écart d'échange aux frontières et l'écart de fréquence pondéré par la sensibilité statique naturelle du réseau B ({frequencyBiasB} MW/0.1 Hz).
                </p>
              </div>

              <div className="bg-[#05080c] p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-neutral-300">Automate de Délestage Fréquentiel (UFLS) :</span>
                <div className="space-y-1 text-[11px] font-mono text-neutral-300">
                  <div className={`p-1 rounded ${gridFrequencyHz < 49.5 ? 'bg-red-950/80 text-red-300 font-bold' : ''}`}>
                    • Palier 1 (49.50 Hz) : Délestage 10% (Douala Ouest)
                  </div>
                  <div className={`p-1 rounded ${gridFrequencyHz < 49.0 ? 'bg-red-950/80 text-red-300 font-bold' : ''}`}>
                    • Palier 2 (49.00 Hz) : Délestage 15% (Yaoundé Sud)
                  </div>
                  <div className={`p-1 rounded ${gridFrequencyHz < 48.5 ? 'bg-red-950/80 text-red-300 font-bold' : ''}`}>
                    • Palier 3 (48.50 Hz) : Délestage 15% (Industries Littoral)
                  </div>
                </div>
              </div>

              <div className="bg-[#05080c] p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-neutral-300">Groupes de Régulation Réquisitionnés :</span>
                <div className="space-y-1.5 text-[11px] font-mono text-neutral-300">
                  <div className="flex justify-between">
                    <span>Centrale Nachtigal (Hydro) :</span>
                    <span className="text-emerald-400 font-bold">Régulation AGC Primaire/Sec.</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Centrale Songloulou (Hydro) :</span>
                    <span className="text-cyan-400 font-bold">Réglage de Fréquence Base</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Centrale Edéa (Hydro) :</span>
                    <span className="text-purple-400 font-bold">Réserve Tournante</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PILLAR 6: IEC 62351 OT CYBERSECURITY SIMULATOR */}
      {/* ===================================================================== */}
      {activePillar === 'CYBERSECURITY_62351' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-teal-400" />
                  <span>{locale === 'fr' ? 'Cybersécurité des Systèmes OT & Téléconduite (CEI 62351)' : 'OT Cybersecurity & Threat Defense Engine (IEC 62351)'}</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Protection cryptographique des protocoles industriels SCADA contre le rejeu, l'espionnage et l'injection d'ordres frauduleux.
                </p>
              </div>

              {/* Master Security Toggle */}
              <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs font-mono text-neutral-300">Chiffrement & Authentification CEI 62351 :</span>
                <button
                  type="button"
                  onClick={() => setCyberProtectionEnabled(!cyberProtectionEnabled)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                    cyberProtectionEnabled
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-red-600 text-white animate-pulse'
                  }`}
                >
                  {cyberProtectionEnabled ? 'ACTIF (SÉCURISÉ TLS/HMAC)' : 'DÉSACTIVÉ (VULNÉRABLE)'}
                </button>
              </div>
            </div>

            {/* Attack Simulation Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => handleExecuteAttackSimulation('MALICIOUS_TRIP')}
                className="bg-slate-950 hover:bg-slate-850 p-4 rounded-xl border border-red-900/60 text-left space-y-2 transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-red-400">Attaque 1 : Injection d'Ordre</span>
                  <Terminal className="h-4 w-4 text-red-400" />
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  Envoi d'un ordre d'ouverture disjoncteur C_DC_NA_1 frauduleux sur port 2404 sans signature.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleExecuteAttackSimulation('REPLAY_ATTACK')}
                className="bg-slate-950 hover:bg-slate-850 p-4 rounded-xl border border-amber-900/60 text-left space-y-2 transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">Attaque 2 : Rejeu de Trame (Replay)</span>
                  <RotateCcw className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  Capture et réémission d'anciennes télémesures pour tromper l'estimation d'état du SCADA.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleExecuteAttackSimulation('GOOSE_POISONING')}
                className="bg-slate-950 hover:bg-slate-850 p-4 rounded-xl border border-purple-900/60 text-left space-y-2 transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-400">Attaque 3 : Falsification GOOSE</span>
                  <Network className="h-4 w-4 text-purple-400" />
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  Injection de fausses trames multicast GOOSE sur le bus de station pour bloquer les verrouillages.
                </p>
              </button>
            </div>

            {/* Attack Log Output */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                {locale === 'fr' ? 'Journal d\'Audit de Sécurité du Pare-feu Industriel :' : 'Industrial Firewall & SIEM Security Audit Log:'}
              </span>
              <div className="bg-[#05080c] border border-slate-800 rounded-xl p-4 font-mono text-xs text-neutral-300 min-h-[140px] space-y-1.5 scrollbar-thin">
                {attackExecutionLog.length === 0 ? (
                  <div className="text-neutral-600 italic py-4 text-center">
                    Système de détection d'intrusion (IDS) actif. Cliquez sur une attaque ci-dessus pour tester la résilience CEI 62351.
                  </div>
                ) : (
                  attackExecutionLog.map((item, idx) => (
                    <div key={idx} className="leading-relaxed border-b border-slate-800/40 pb-1">
                      {item}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PILLAR 7: CAMEROON DISPATCHING & FORENSICS */}
      {/* ===================================================================== */}
      {activePillar === 'CAMEROON_FORENSICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Case 1: CNCRT Mangombé */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold">
                <Radio className="h-4 w-4" />
                <span>CNCRT Mangombé (SONATREL)</span>
              </div>
              <h4 className="text-sm font-bold text-white font-mono">Dispatching National 225 kV</h4>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Le Centre National de Conduite de Mangombé (Édéa) centralise la supervision des 2500 km de lignes HTB du Cameroun. Il arbitre la répartition hydro-thermique entre la Sanaga (Nachtigal, Songloulou, Edéa) et les centrales thermiques via des anneaux de fibres optiques OPGW sécurisés.
              </p>
              <div className="text-[11px] font-mono text-teal-300 pt-2 border-t border-slate-800">
                Protocole : CEI 60870-5-104 & ICCP / TASE.2
              </div>
            </div>

            {/* Case 2: Koumassi Dispatching */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold">
                <Server className="h-4 w-4" />
                <span>Dispatching Eneo Koumassi</span>
              </div>
              <h4 className="text-sm font-bold text-white font-mono">SCADA ADMS Distribution Douala</h4>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Supervise les réseaux 30 kV et 15 kV de la métropole économique de Douala. Équipé d'un automatisme FLISR (Self-healing) permettant d'isoler un défaut de câble souterrain et de réalimenter les clients sains en moins de 3 minutes via télécommande à distance.
              </p>
              <div className="text-[11px] font-mono text-sky-300 pt-2 border-t border-slate-800">
                Fonction : Auto-cicatrisation FLISR & DMS
              </div>
            </div>

            {/* Case 3: Blackout Prevention Forensics */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                <Flame className="h-4 w-4" />
                <span>Incident du Réseau Sud (RIS)</span>
              </div>
              <h4 className="text-sm font-bold text-white font-mono">Défense par Délestage UFLS</h4>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Lors du déclenchement brutal de la ligne 225 kV Songloulou-Mangombé, la chute de fréquence a atteint 49.35 Hz en 800 ms. L'action coordonnée des automates UFLS de Palier 1 et le renvoi de puissance depuis Nachtigal ont évité l'effondrement en cascade du réseau national.
              </p>
              <div className="text-[11px] font-mono text-amber-300 pt-2 border-t border-slate-800">
                Résultat : Sauvegarde de 680 MW en 2.5 s
              </div>
            </div>
          </div>

          {/* Standards & Telemetry Codes Reference Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              {locale === 'fr' ? 'Table de Référence des Signaux & Télécommandes SCADA :' : 'SCADA Signal Classification & Standard Types:'}
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-950 text-neutral-400 uppercase">
                  <tr>
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Désignation</th>
                    <th className="p-2.5">Type CEI 104</th>
                    <th className="p-2.5">Précision / Format</th>
                    <th className="p-2.5">Exemple dans le Poste</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50 text-neutral-300">
                  <tr>
                    <td className="p-2.5 font-bold text-teal-400">TS</td>
                    <td className="p-2.5">Télésignalisation Simple</td>
                    <td className="p-2.5">Type 1 (M_SP_NA_1)</td>
                    <td className="p-2.5">1 bit (0=Inactif, 1=Actif)</td>
                    <td className="p-2.5">Alarme déclenchement protection 87T, niveau SF6 bas</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-sky-400">TCS</td>
                    <td className="p-2.5">Télésignalisation Double</td>
                    <td className="p-2.5">Type 3 (M_DP_NA_1)</td>
                    <td className="p-2.5">2 bits (01=Ouvert, 10=Fermé)</td>
                    <td className="p-2.5">Position disjoncteur Q0, sectionneur Q1/Q2/Q9</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-amber-400">TM</td>
                    <td className="p-2.5">Télémesure Analogique</td>
                    <td className="p-2.5">Type 13 (M_ME_NC_1)</td>
                    <td className="p-2.5">Flottant IEEE 754 (32 bits)</td>
                    <td className="p-2.5">Puissance active (MW), tension (kV), courant (A)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-red-400">TC</td>
                    <td className="p-2.5">Télécommande</td>
                    <td className="p-2.5">Type 46 (C_DC_NA_1)</td>
                    <td className="p-2.5">Séquence 2 temps SBO (Select/Execute)</td>
                    <td className="p-2.5">Ouverture/fermeture disjoncteur 225 kV</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-purple-400">TR</td>
                    <td className="p-2.5">Télé-réglage / Consigne</td>
                    <td className="p-2.5">Type 50 (C_SE_NC_1)</td>
                    <td className="p-2.5">Consigne numérique flottante</td>
                    <td className="p-2.5">Consigne AGC de puissance turbine, prise régleur en charge</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
