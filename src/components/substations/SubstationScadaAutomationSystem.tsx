// src/components/substations/SubstationScadaAutomationSystem.tsx
// EPEDE D04/D05 - Substation Automation System (SAS), SCADA Mimic & IEC 61850 Process/Station Bus Architecture
// Compliant with IEC 61850-8-1 (MMS / GOOSE), IEC 61850-9-2LE / IEC 61869-9 (Sampled Values), IEEE 1588 PTP & ANSI 25 Synchrocheck

import React, { useState, useMemo, useEffect } from 'react';
import {
  Radio,
  Cpu,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldAlert,
  Clock,
  Zap,
  Sliders,
  RotateCcw,
  Check,
  TrendingUp,
  Server,
  Network,
  Share2,
  Lock,
  Unlock,
  Play,
  Flame,
  FileText,
  FileCode2,
  Info,
  ExternalLink,
  Waves
} from 'lucide-react';
import { SclConfigFileInspector } from './modules/SclConfigFileInspector';
import { GooseLatencyStormSimulator } from './modules/GooseLatencyStormSimulator';
import { BcuInterlockingAndBreakerFailureSimulator } from './modules/BcuInterlockingAndBreakerFailureSimulator';
import { ProcessBusMergingUnitNcitSimulator } from './modules/ProcessBusMergingUnitNcitSimulator';
import { Iec61850GoosePtpClockSimulator } from './modules/Iec61850GoosePtpClockSimulator';

interface SubstationScadaAutomationSystemProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (id: string) => void;
}

type SasTabKey =
  | 'IEC61850_ARCHITECTURE'
  | 'PROCESS_BUS_MERGING_UNIT'
  | 'BCU_INTERLOCKING_50BF'
  | 'SCADA_BAY_MIMIC'
  | 'SYNCHROCHECK_ANSI25'
  | 'GOOSE_STORM_LATENCY'
  | 'COMMUNICATION_STACK'
  | 'SCL_SCD_EXPLORER';

interface GooseMessage {
  id: string;
  timestamp: string;
  appID: string;
  goID: string;
  gocbRef: string;
  sqNum: number;
  stNum: number;
  timeAllowedToLive: number;
  datasetName: string;
  trippedSignal: string;
  sourceIed: string;
  destIed: string;
  status: 'DELIVERED_SUB_3MS' | 'IN_TRANSIT' | 'RETRANSMITTED';
}

export const SubstationScadaAutomationSystem: React.FC<SubstationScadaAutomationSystemProps> = ({
  locale,
  onSelectEquipment
}) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<SasTabKey>('IEC61850_ARCHITECTURE');

  // 1. SCADA HMI Mimic Interactive Apparatus States
  const [q0LineClosed, setQ0LineClosed] = useState<boolean>(true); // Q0 225kV breaker
  const [q9LineClosed, setQ9LineClosed] = useState<boolean>(true); // Q9 Line disconnector
  const [q1Bus1Closed, setQ1Bus1Closed] = useState<boolean>(true); // Q1 Bus 1 disconnector
  const [q2Bus2Closed, setQ2Bus2Closed] = useState<boolean>(false); // Q2 Bus 2 disconnector
  const [q8EarthClosed, setQ8EarthClosed] = useState<boolean>(false); // Q8 Earth switch
  const [q0CouplerClosed, setQ0CouplerClosed] = useState<boolean>(false); // Q0 Coupler breaker
  const [commandInProgress, setCommandInProgress] = useState<string | null>(null);
  const [hmiAlarm, setHmiAlarm] = useState<string | null>(null);

  // 2. ANSI 25 Synchrocheck Parameters & State
  const [voltageBus1Kv, setVoltageBus1Kv] = useState<number>(225.0);
  const [voltageLineKv, setVoltageLineKv] = useState<number>(224.2);
  const [freqBus1Hz, setFreqBus1Hz] = useState<number>(50.00);
  const [freqLineHz, setFreqLineHz] = useState<number>(50.04);
  const [phaseAngleDeg, setPhaseAngleDeg] = useState<number>(6.5); // delta delta
  const [isRotatingAngle, setIsRotatingAngle] = useState<boolean>(false);

  // 3. IEC 61850 Process Bus & Live Network Monitor
  const [ptpSyncState, setPtpSyncState] = useState<'LOCKED_NANOSECOND' | 'HOLDOVER' | 'UNLOCK'>('LOCKED_NANOSECOND');
  const [svStreamActive, setSvStreamActive] = useState<boolean>(true);
  const [simulatedGooseList, setSimulatedGooseList] = useState<GooseMessage[]>([
    {
      id: 'GOOSE-001',
      timestamp: '09:42:15.104',
      appID: '0x0001',
      goID: 'BAY_L1_TRIP',
      gocbRef: 'L1_PROT/LLN0$GO$gcbTrip',
      sqNum: 48,
      stNum: 3,
      timeAllowedToLive: 2000,
      datasetName: 'dsTripOutput',
      trippedSignal: 'ANSI 87L TRIP -> Q0 OPEN',
      sourceIed: 'BCU_L1 (SIPROTEC 5)',
      destIed: 'MU_L1 & REMOTE_POSTE',
      status: 'DELIVERED_SUB_3MS'
    },
    {
      id: 'GOOSE-002',
      timestamp: '09:42:18.420',
      appID: '0x0002',
      goID: 'BUS1_INTERLOCK',
      gocbRef: 'B1_CTRL/LLN0$GO$gcbLock',
      sqNum: 1042,
      stNum: 1,
      timeAllowedToLive: 4000,
      datasetName: 'dsInterlockMatrix',
      trippedSignal: 'PERMISSIVE_CLOSE_Q9 = TRUE',
      sourceIed: 'BAY_CTRL_Q9',
      destIed: 'BAY_CTRL_Q0',
      status: 'DELIVERED_SUB_3MS'
    },
    {
      id: 'GOOSE-003',
      timestamp: '09:42:21.002',
      appID: '0x0003',
      goID: 'TR1_DIFF_BLOCK',
      gocbRef: 'TR1_PROT/LLN0$GO$gcbRestraint',
      sqNum: 12,
      stNum: 5,
      timeAllowedToLive: 1000,
      datasetName: 'dsHarmonic2',
      trippedSignal: 'INRUSH_RESTRAINT_2ND_HARM = ACTIVE',
      sourceIed: 'IED_TR1 (RET670)',
      destIed: 'SUB_SCADA_RTU',
      status: 'DELIVERED_SUB_3MS'
    }
  ]);

  // Synchrocheck Mathematical Computation (ANSI 25)
  // Permissive criteria:
  // 1. Voltage difference: |ΔV| <= 10% Un (22.5 kV) or <= 5% (11.25 kV recommended)
  // 2. Frequency slip: |Δf| <= 0.10 Hz (typically 0.05 to 0.10 Hz)
  // 3. Phase angle difference: |Δδ| <= 15° (typically 10° to 20°)
  const deltaVoltageKv = Math.abs(voltageBus1Kv - voltageLineKv);
  const deltaFreqHz = Math.abs(freqBus1Hz - freqLineHz);
  const deltaAngleDeg = Math.abs(phaseAngleDeg);

  const isVoltageOk = deltaVoltageKv <= 11.25; // 5%
  const isFreqOk = deltaFreqHz <= 0.10; // 0.1 Hz
  const isAngleOk = deltaAngleDeg <= 15.0; // 15 degrees

  const isSynchroPermissiveGranted = isVoltageOk && isFreqOk && isAngleOk;

  // Animate angle rotation if slip exists
  useEffect(() => {
    if (!isRotatingAngle) return;
    const interval = setInterval(() => {
      setPhaseAngleDeg(prev => {
        const slipSpeed = (freqLineHz - freqBus1Hz) * 360 * 0.05; // speed proportional to slip
        let next = prev + slipSpeed;
        if (next > 180) next -= 360;
        if (next < -180) next += 360;
        return Number(next.toFixed(1));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isRotatingAngle, freqLineHz, freqBus1Hz]);

  // Handle SCADA Bay Breaker / Disconnector Toggle with Interlocking Check
  const handleToggleApparatus = (apparatus: 'Q0' | 'Q9' | 'Q1' | 'Q2' | 'Q8' | 'Q0_CPL') => {
    setHmiAlarm(null);

    // 1. Breaker Q0
    if (apparatus === 'Q0') {
      if (!q0LineClosed) {
        // Closing Q0 requires Q9 and either Q1 or Q2 to be closed, Q8 to be open
        if (q8EarthClosed) {
          setHmiAlarm(locale === 'fr'
            ? "ERREUR INTERVERROUILLAGE : Impossible d'enclencher Q0 car le sectionneur de terre Q8 est FERMÉ !"
            : "INTERLOCK VIOLATION: Cannot close Q0 because earth switch Q8 is CLOSED!");
          return;
        }
        if (!q9LineClosed) {
          setHmiAlarm(locale === 'fr'
            ? "ERREUR COMMANDE : Le sectionneur de ligne Q9 doit être fermé avant d'enclencher Q0."
            : "INTERLOCK VIOLATION: Line disconnector Q9 must be closed prior to closing Q0.");
          return;
        }
        if (!isSynchroPermissiveGranted) {
          setHmiAlarm(locale === 'fr'
            ? "CONTRÔLE SYNCHRONISME (ANSI 25) NON VALIDÉ : Fermeture de Q0 bloquée car le réseau n'est pas synchronisé !"
            : "SYNCHROCHECK (ANSI 25) INHIBITED: Breaker close command blocked due to vector desynchronization!");
          return;
        }
      }
      setCommandInProgress('Q0-LINE');
      setTimeout(() => {
        setQ0LineClosed(!q0LineClosed);
        setCommandInProgress(null);
      }, 350);
      return;
    }

    // 2. Disconnector Q9 (Line)
    if (apparatus === 'Q9') {
      if (q0LineClosed) {
        setHmiAlarm(locale === 'fr'
          ? "MANŒUVRE INTERDITE : Le disjoncteur Q0 est FERMÉ. Un sectionneur ne peut interrompre ou établir de courant de charge !"
          : "PROHIBITED OPERATION: Breaker Q0 is CLOSED. Disconnectors cannot break or make load current!");
        return;
      }
      if (q8EarthClosed && !q9LineClosed) {
        setHmiAlarm(locale === 'fr'
          ? "MANŒUVRE BLOQUÉE : Le sectionneur de terre Q8 est FERMÉ. Fermeture de Q9 impossible !"
          : "INTERLOCK BLOCKED: Earth switch Q8 is CLOSED. Closing Q9 is physically inhibited!");
        return;
      }
      setCommandInProgress('Q9-LINE');
      setTimeout(() => {
        setQ9LineClosed(!q9LineClosed);
        setCommandInProgress(null);
      }, 500);
      return;
    }

    // 3. Earth Switch Q8
    if (apparatus === 'Q8') {
      if (q9LineClosed) {
        setHmiAlarm(locale === 'fr'
          ? "DANGER DE MORT : Fermeture de Q8 interdite car le sectionneur de ligne Q9 est FERMÉ ! Risque de court-circuit direct."
          : "LETHAL HAZARD: Cannot close Q8 while line disconnector Q9 is CLOSED! Risk of catastrophic direct bus fault.");
        return;
      }
      setCommandInProgress('Q8-LINE');
      setTimeout(() => {
        setQ8EarthClosed(!q8EarthClosed);
        setCommandInProgress(null);
      }, 500);
      return;
    }

    // 4. Bus Selector Q1
    if (apparatus === 'Q1') {
      if (q0LineClosed && !q0CouplerClosed) {
        setHmiAlarm(locale === 'fr'
          ? "INTERVERROUILLAGE DE BARRES : Manœuvre de Q1 sous charge impossible sans couplage actif (Q0-CPL ouvert) !"
          : "BUSBAR INTERLOCK: Toggling Q1 under load is forbidden without active bus coupler (Q0-CPL open)!");
        return;
      }
      setCommandInProgress('Q1-BUS1');
      setTimeout(() => {
        setQ1Bus1Closed(!q1Bus1Closed);
        setCommandInProgress(null);
      }, 500);
      return;
    }

    // 5. Bus Selector Q2
    if (apparatus === 'Q2') {
      if (q0LineClosed && !q0CouplerClosed) {
        setHmiAlarm(locale === 'fr'
          ? "INTERVERROUILLAGE DE BARRES : Manœuvre de Q2 sous charge impossible sans couplage actif (Q0-CPL ouvert) !"
          : "BUSBAR INTERLOCK: Toggling Q2 under load is forbidden without active bus coupler (Q0-CPL open)!");
        return;
      }
      setCommandInProgress('Q2-BUS2');
      setTimeout(() => {
        setQ2Bus2Closed(!q2Bus2Closed);
        setCommandInProgress(null);
      }, 500);
      return;
    }

    // 6. Coupler Breaker Q0-CPL
    if (apparatus === 'Q0_CPL') {
      setCommandInProgress('Q0-CPL');
      setTimeout(() => {
        setQ0CouplerClosed(!q0CouplerClosed);
        setCommandInProgress(null);
      }, 350);
      return;
    }
  };

  // Trigger test GOOSE injection
  const handleTriggerTestGoose = () => {
    const now = new Date();
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    const timeStr = `${now.toLocaleTimeString()}.${ms}`;
    const newMsg: GooseMessage = {
      id: `GOOSE-${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
      appID: '0x0042',
      goID: 'TEST_EMERGENCY_TRIP',
      gocbRef: 'LINE1_PROT/LLN0$GO$gcbEmergency',
      sqNum: 0,
      stNum: Math.floor(Math.random() * 900) + 100,
      timeAllowedToLive: 500,
      datasetName: 'dsEmergencyBus',
      trippedSignal: 'MANUAL_SCADA_INTERTRIP (Latency 1.4 ms)',
      sourceIed: 'SCADA_GATEWAY_RTU',
      destIed: 'BCU_Q0_ALL_BAYS',
      status: 'DELIVERED_SUB_3MS'
    };
    setSimulatedGooseList(prev => [newMsg, ...prev.slice(0, 5)]);
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Radio className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {locale === 'fr'
                    ? "Contrôle-Commande Numérique, SCADA & Architecture CEI 61850"
                    : "Substation Automation System (SAS), SCADA & IEC 61850 Architecture"}
                </h2>
                <span className="px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 text-[10px] font-bold border border-cyan-700/50">
                  Station & Process Bus
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? "Architecture unifiée des réseaux de poste : Bus de Poste (MMS / GOOSE sub-3ms), Bus de Process (Valeurs Échantillonnées 9-2LE / 4800 Hz), Synchrocheck ANSI 25 et synoptique SCADA interactif."
                  : "Complete substation automation suite: Station Bus (MMS / sub-3ms GOOSE), Process Bus (Sampled Values 9-2LE at 4800 Hz), ANSI 25 Synchrocheck vector engine, and interactive bay mimic."}
              </p>
            </div>
          </div>

          {/* Sub-view Navigation Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0D121B] border border-[#1E2634] self-start sm:self-auto overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('IEC61850_ARCHITECTURE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'IEC61850_ARCHITECTURE'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '1. Architecture Réseau' : '1. Network Arch'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('PROCESS_BUS_MERGING_UNIT')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'PROCESS_BUS_MERGING_UNIT'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Waves className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '2. Merging Unit & SV' : '2. Merging Unit & SV'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('BCU_INTERLOCKING_50BF')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'BCU_INTERLOCKING_50BF'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '3. Verrouillages & 50BF' : '3. Interlocks & 50BF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SCADA_BAY_MIMIC')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'SCADA_BAY_MIMIC'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '4. Synoptique SCADA' : '4. SCADA Mimic'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SYNCHROCHECK_ANSI25')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'SYNCHROCHECK_ANSI25'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '5. Synchrocheck 25' : '5. Synchrocheck 25'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('COMMUNICATION_STACK')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'COMMUNICATION_STACK'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Server className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '6. GOOSE & PTP 1588' : '6. GOOSE & PTP 1588'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SCL_SCD_EXPLORER')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'SCL_SCD_EXPLORER'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode2 className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '7. Fichiers SCL' : '7. SCL Files'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('GOOSE_STORM_LATENCY')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'GOOSE_STORM_LATENCY'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>{locale === 'fr' ? '8. Tempête PRP' : '8. PRP Storm'}</span>
            </button>
          </div>
        </div>

        {/* Live Top Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Synchronisation PTP (IEEE 1588)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-emerald-400">
                &lt; 50 ns
              </span>
              <span className="text-[10px] text-emerald-500/80">LOCKED</span>
            </div>
            <span className="text-[9px] text-slate-500">Horloge Grandmaster GPS/GLONASS</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Flux Sampled Values (SV 9-2LE)</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-cyan-400">
                4,800 Éch/s
              </span>
            </div>
            <span className="text-[9px] text-slate-500">80 éch/période @ 60/50 Hz</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Latence GOOSE Déclenchement</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold text-amber-400">
                1.2 ms
              </span>
              <span className="text-[10px] text-slate-500">(CEI Type 1A &lt; 3 ms)</span>
            </div>
            <span className="text-[9px] text-slate-500">Multicast Ethernet Priorité VLAN 4</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] flex flex-col justify-between">
            <span className="text-[10px] text-slate-400">Statut Synchrocheck ANSI 25</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-base font-bold ${isSynchroPermissiveGranted ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isSynchroPermissiveGranted ? 'AUTORISÉ' : 'BLOQUÉ'}
              </span>
            </div>
            <span className="text-[9px] text-slate-500">
              ΔU = {deltaVoltageKv.toFixed(1)} kV | Δδ = {deltaAngleDeg.toFixed(1)}°
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: IEC 61850 THREE-TIER ARCHITECTURE DIAGRAM (PROCESS vs STATION BUS) */}
      {/* ========================================================================= */}
      {activeTab === 'IEC61850_ARCHITECTURE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Visual Schema (Col 8) */}
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  {locale === 'fr'
                    ? "Architecture Complète en 3 Niveaux CEI 61850 & Double Bus Optique"
                    : "Three-Tier IEC 61850 Architecture & Dual Redundant Optical Bus (PRP/HSR)"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800">
                CEI 61850-8-1 / 9-2
              </span>
            </div>

            {/* Custom Interactive SVG Three-Tier Architecture Schema */}
            <div className="relative w-full aspect-[16/11] bg-[#05080E] rounded-xl border border-[#1A222E] p-2 sm:p-4 overflow-hidden">
              <svg viewBox="0 0 720 480" className="w-full h-full text-[10px] font-mono select-none">
                <defs>
                  <linearGradient id="stationBusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="processBusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FCD34D" stopOpacity="0.8" />
                  </linearGradient>
                  <pattern id="archGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#101724" strokeWidth="0.75" />
                  </pattern>
                </defs>

                <rect width="720" height="480" fill="#070A10" />
                <rect width="720" height="480" fill="url(#archGrid)" />

                {/* ----------------------------------------------------------------- */}
                {/* LEVEL 3: STATION LEVEL (NIVEAU 3 - CONDUITE DU POSTE) */}
                {/* ----------------------------------------------------------------- */}
                <rect x="20" y="20" width="680" height="85" rx="8" fill="#0D1424" stroke="#1E293B" strokeWidth="1.5" />
                <text x="35" y="42" fill="#38BDF8" fontSize="11" fontWeight="bold">
                  NIVEAU 3 : CONDUITE DU POSTE & TÉLÉCONDUITE (STATION LEVEL)
                </text>
                <text x="35" y="56" fill="#64748B" fontSize="9">
                  Poste opérateur local, Passerelle téléconduite SCADA / EMS (CEI 60870-5-104 / DNP3) & Serveur d'archivage d'historiques
                </text>

                {/* Box: SCADA HMI */}
                <rect x="50" y="65" width="160" height="32" rx="6" fill="#142036" stroke="#0284C7" strokeWidth="1" />
                <text x="130" y="85" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle">
                  🖥️ HMI SCADA Local
                </text>

                {/* Box: Gateway RTU */}
                <rect x="230" y="65" width="180" height="32" rx="6" fill="#142036" stroke="#0284C7" strokeWidth="1" />
                <text x="320" y="85" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle">
                  🌐 Passerelle RTU (CEI 104)
                </text>

                {/* Box: IEEE 1588 GPS Master Clock */}
                <rect x="430" y="65" width="250" height="32" rx="6" fill="#142036" stroke="#10B981" strokeWidth="1" />
                <text x="555" y="85" fill="#34D399" fontSize="9" fontWeight="bold" textAnchor="middle">
                  ⏱️ Horloge PTP Grandmaster (GPS/PTP)
                </text>

                {/* ----------------------------------------------------------------- */}
                {/* OPTICAL STATION BUS (BUS DE POSTE - MMS & GOOSE) */}
                {/* ----------------------------------------------------------------- */}
                <g>
                  {/* Bus Bar line */}
                  <rect x="30" y="125" width="660" height="12" rx="6" fill="url(#stationBusGrad)" />
                  <text x="360" y="134" fill="#000" fontSize="9" fontWeight="bold" textAnchor="middle">
                    BUS DE POSTE FIBRE OPTIQUE 100/1000 Mbps (CEI 61850-8-1 MMS + GOOSE) - PRP / HSR
                  </text>
                  {/* Connections from Level 3 down to Station Bus */}
                  <line x1="130" y1="97" x2="130" y2="125" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3,2" />
                  <line x1="320" y1="97" x2="320" y2="125" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3,2" />
                  <line x1="555" y1="97" x2="555" y2="125" stroke="#10B981" strokeWidth="2" strokeDasharray="3,2" />
                </g>

                {/* ----------------------------------------------------------------- */}
                {/* LEVEL 2: BAY LEVEL (NIVEAU 2 - TRAVÉES & IEDs) */}
                {/* ----------------------------------------------------------------- */}
                <rect x="20" y="155" width="680" height="145" rx="8" fill="#0B1220" stroke="#1E293B" strokeWidth="1.5" />
                <text x="35" y="175" fill="#38BDF8" fontSize="11" fontWeight="bold">
                  NIVEAU 2 : TRAVÉES & CALCULATEURS IEDs (BAY LEVEL)
                </text>
                <text x="35" y="189" fill="#64748B" fontSize="9">
                  Calculateurs de travée (BCU), Relais de protection différentielle (87L/87T/87B) et de distance (21/21N)
                </text>

                {/* IED 1: Feeder Line Protection (SIPROTEC / MiCOM) */}
                <g>
                  <rect x="40" y="200" width="190" height="85" rx="6" fill="#131F33" stroke="#38BDF8" strokeWidth="1.2" />
                  <text x="135" y="218" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle">
                    IED-LIGNE-01 (ANSI 21 / 87L)
                  </text>
                  <text x="50" y="234" fill="#94A3B8" fontSize="8">Fonction : Protection Ligne HTB</text>
                  <text x="50" y="247" fill="#94A3B8" fontSize="8">Client MMS : Conduite & Alarmes</text>
                  <text x="50" y="260" fill="#38BDF8" fontSize="8">GOOSE : Déclenchement Sub-3ms</text>
                  <text x="50" y="273" fill="#F59E0B" fontSize="8">Abonné SV : Courants/Tensions</text>
                  {/* Link up to Station bus */}
                  <line x1="135" y1="137" x2="135" y2="200" stroke="#38BDF8" strokeWidth="2" />
                </g>

                {/* IED 2: Transformer Protection (RET670) */}
                <g>
                  <rect x="265" y="200" width="190" height="85" rx="6" fill="#131F33" stroke="#38BDF8" strokeWidth="1.2" />
                  <text x="360" y="218" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle">
                    IED-TRANSFO (ANSI 87T / 50/51)
                  </text>
                  <text x="275" y="234" fill="#94A3B8" fontSize="8">Fonction : Différentielle Transfo</text>
                  <text x="275" y="247" fill="#94A3B8" fontSize="8">Compensation Vectorielle YNyd11</text>
                  <text x="275" y="260" fill="#38BDF8" fontSize="8">GOOSE : Ordre 86 Verrouillage</text>
                  <text x="275" y="273" fill="#F59E0B" fontSize="8">Abonné SV : Double jeu Primaire/Sec</text>
                  {/* Link up to Station bus */}
                  <line x1="360" y1="137" x2="360" y2="200" stroke="#38BDF8" strokeWidth="2" />
                </g>

                {/* IED 3: Busbar Protection & BCU (REB500) */}
                <g>
                  <rect x="490" y="200" width="190" height="85" rx="6" fill="#131F33" stroke="#38BDF8" strokeWidth="1.2" />
                  <text x="585" y="218" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle">
                    IED-BARRES / BCU (ANSI 87B)
                  </text>
                  <text x="500" y="234" fill="#94A3B8" fontSize="8">Calculateur Central Centralisé</text>
                  <text x="500" y="247" fill="#94A3B8" fontSize="8">Matrice d'Interverrouillages</text>
                  <text x="500" y="260" fill="#38BDF8" fontSize="8">GOOSE : Déclenchement 50BF</text>
                  <text x="500" y="273" fill="#F59E0B" fontSize="8">Abonné SV : Sommation Kirchhoff</text>
                  {/* Link up to Station bus */}
                  <line x1="585" y1="137" x2="585" y2="200" stroke="#38BDF8" strokeWidth="2" />
                </g>

                {/* ----------------------------------------------------------------- */}
                {/* OPTICAL PROCESS BUS (BUS DE PROCESS - VALEURS ÉCHANTILLONNÉES SV) */}
                {/* ----------------------------------------------------------------- */}
                <g>
                  {/* Process Bus Bar line */}
                  <rect x="30" y="318" width="660" height="12" rx="6" fill="url(#processBusGrad)" />
                  <text x="360" y="327" fill="#000" fontSize="9" fontWeight="bold" textAnchor="middle">
                    BUS DE PROCESS FIBRE OPTIQUE (CEI 61850-9-2LE / CEI 61869-9 SV @ 4800 Hz) + PTP IEEE 1588
                  </text>
                  {/* Connections from Bay Level down to Process Bus */}
                  <line x1="135" y1="285" x2="135" y2="318" stroke="#F59E0B" strokeWidth="2" />
                  <line x1="360" y1="285" x2="360" y2="318" stroke="#F59E0B" strokeWidth="2" />
                  <line x1="585" y1="285" x2="585" y2="318" stroke="#F59E0B" strokeWidth="2" />
                </g>

                {/* ----------------------------------------------------------------- */}
                {/* LEVEL 1: PROCESS LEVEL (NIVEAU 1 - APPAREILLAGES HTB & MERGING UNITS) */}
                {/* ----------------------------------------------------------------- */}
                <rect x="20" y="348" width="680" height="118" rx="8" fill="#0D1424" stroke="#1E293B" strokeWidth="1.5" />
                <text x="35" y="368" fill="#F59E0B" fontSize="11" fontWeight="bold">
                  NIVEAU 1 : PROCESS & APPAREILLAGES HTB (PROCESS LEVEL)
                </text>
                <text x="35" y="382" fill="#64748B" fontSize="9">
                  Merging Units (MU), Capteurs optiques / TC-TP non conventionnels (NCIT), Déclencheurs disjoncteur
                </text>

                {/* Merging Unit 1 (Line) */}
                <g>
                  <rect x="45" y="395" width="180" height="58" rx="6" fill="#1E190E" stroke="#F59E0B" strokeWidth="1" />
                  <text x="135" y="413" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Merging Unit Ligne (MU-L1)
                  </text>
                  <text x="55" y="428" fill="#94A3B8" fontSize="8">Convertisseur A/N Rogowski / CVT</text>
                  <text x="55" y="441" fill="#F59E0B" fontSize="8">Trame SV 9-2LE : 4.8 kHz PTP</text>
                  <line x1="135" y1="330" x2="135" y2="395" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3,2" />
                </g>

                {/* Breaker Actuator I/O Unit */}
                <g>
                  <rect x="270" y="395" width="180" height="58" rx="6" fill="#1E190E" stroke="#F59E0B" strokeWidth="1" />
                  <text x="360" y="413" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Module Disjoncteur SF6 (SAMU)
                  </text>
                  <text x="280" y="428" fill="#94A3B8" fontSize="8">Commande bobines Trip 1 / Trip 2</text>
                  <text x="280" y="441" fill="#38BDF8" fontSize="8">Surveillance pression gaz SF6</text>
                  <line x1="360" y1="330" x2="360" y2="395" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3,2" />
                </g>

                {/* Merging Unit 2 (Busbar & Coupler) */}
                <g>
                  <rect x="495" y="395" width="180" height="58" rx="6" fill="#1E190E" stroke="#F59E0B" strokeWidth="1" />
                  <text x="585" y="413" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Merging Unit Barres (MU-BUS)
                  </text>
                  <text x="505" y="428" fill="#94A3B8" fontSize="8">Échantillonnage tensions jeux 1 & 2</text>
                  <text x="505" y="441" fill="#F59E0B" fontSize="8">Flux SV synchronisé GPS &lt; 1 µs</text>
                  <line x1="585" y1="330" x2="585" y2="395" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3,2" />
                </g>
              </svg>
            </div>

            {/* Explanatory Caption */}
            <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1E2634] text-[11px] text-slate-300 font-sans leading-relaxed">
              <strong className="text-cyan-400 font-bold mr-1.5 font-mono">
                {locale === 'fr' ? 'RÉVOLUTION DU BUS DE PROCESS (DIGITAL SUBSTATION) :' : 'PROCESS BUS REVOLUTION:'}
              </strong>
              {locale === 'fr'
                ? "Dans un poste numérique moderne (Poste 4.0), les centaines de câbles de cuivre blindés véhiculant 1A/5A et 100V sont remplacés par des fibres optiques transportant des trames numériques Ethernet standardisées (CEI 61850-9-2LE / CEI 61869-9) à 4800 Hz. La sécurité des personnels est absolue (aucun risque de surtension mortelle par ouverture accidentelle d'un circuit TC)."
                : "In modern digital substations, bulky copper hardwiring carrying 1A/5A and 100V is replaced by high-speed fiber-optic links transmitting standard Ethernet packets (IEC 61850-9-2LE) at 4800 Hz. This eliminates high-voltage hazards from open-circuit CT secondary terminals and reduces trench cabling volume by over 80%."}
            </div>
          </div>

          {/* Right Details Panel (Col 4) */}
          <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222B38] pb-2.5">
              <Server className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Protocoles & Redondance Réseau' : 'Protocols & Network Redundancy'}</span>
            </h4>

            {/* Protocol Comparison Cards */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#0D121B] border border-cyan-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400">1. MMS (CEI 61850-8-1)</span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">
                    Client / Serveur
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-300">
                  {locale === 'fr'
                    ? "Protocole TCP/IP routable pour le télécontrôle SCADA, l'archivage d'historiques, les mesures instantanées et le paramétrage à distance."
                    : "TCP/IP routable protocol for SCADA supervisor queries, event archiving, and remote relay configuration."}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0D121B] border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">2. GOOSE (CEI 61850-8-1)</span>
                  <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800">
                    Multicast &lt; 3 ms
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-300">
                  {locale === 'fr'
                    ? "Trames de protection prioritaires couche 2 (sans pile TCP/IP) pour déclenchements ultra-rapides et interverrouillages horizontaux entre IEDs."
                    : "Layer-2 peer-to-peer multicast frames directly over Ethernet for ultra-fast tripping commands and bay interlocks."}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0D121B] border border-emerald-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">3. Sampled Values (SV 9-2LE)</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                    4,800 Éch/s
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-300">
                  {locale === 'fr'
                    ? "Échantillonnage en continu des grandeurs analogiques (courants triphasés + neutre, tensions) synchronisé à la nanoseconde par IEEE 1588 PTP."
                    : "Continuous digital streams of AC currents and voltages synchronized to sub-microsecond accuracy via IEEE 1588 PTP."}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0D121B] border border-purple-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-400">4. Redondance PRP & HSR</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800">
                    Zéro Perte (0 ms)
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-300">
                  {locale === 'fr'
                    ? "PRP (Parallel Redundancy Protocol, CEI 62439-3) : émission simultanée sur deux réseaux LAN A et LAN B complètement indépendants."
                    : "PRP duplicates every packet across two fully independent LANs A & B. Zero packet loss upon physical fiber cut."}
                </p>
              </div>
            </div>

            {/* Interactive GOOSE Test Injection Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleTriggerTestGoose}
                className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/10"
              >
                <Zap className="h-4 w-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'Injecter Trame GOOSE Test' : 'Inject Test GOOSE Frame'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PROCESS BUS MERGING UNIT (SAMU/MU), NCIT & PTP SYNCHRONIZATION */}
      {/* ========================================================================= */}
      {activeTab === 'PROCESS_BUS_MERGING_UNIT' && (
        <ProcessBusMergingUnitNcitSimulator locale={locale} />
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BCU LOGICAL INTERLOCKING (CILO/CSWI) & BREAKER FAILURE (ANSI 50BF) */}
      {/* ========================================================================= */}
      {activeTab === 'BCU_INTERLOCKING_50BF' && (
        <BcuInterlockingAndBreakerFailureSimulator locale={locale} />
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INTERACTIVE SCADA BAY HMI MIMIC */}
      {/* ========================================================================= */}
      {activeTab === 'SCADA_BAY_MIMIC' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* SCADA Interactive Bay Mimic (Col 8) */}
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  {locale === 'fr'
                    ? "Synoptique SCADA de Travée HTB 225 kV & Interverrouillages Matériels"
                    : "225 kV Substation Bay SCADA Mimic & Hardware Interlocking Matrix"}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-sans">
                {locale === 'fr' ? "Cliquez sur un appareil pour commuter" : "Click apparatus to toggle state"}
              </span>
            </div>

            {/* HMI Alarm / Interlock Violation Banner */}
            {hmiAlarm && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2.5 animate-pulse font-sans">
                <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
                <span className="font-medium">{hmiAlarm}</span>
              </div>
            )}

            {/* Interactive SVG Substation Mimic Display */}
            <div className="relative w-full aspect-[16/11] bg-[#05080E] rounded-xl border border-[#1A222E] p-3 overflow-hidden">
              <svg viewBox="0 0 640 420" className="w-full h-full text-[10px] font-mono select-none">
                {/* Double Busbars at Top */}
                {/* BUSBAR 1 */}
                <line x1="40" y1="40" x2="600" y2="40" stroke="#0284C7" strokeWidth="6" />
                <text x="50" y="30" fill="#38BDF8" fontSize="11" fontWeight="bold">
                  JEU DE BARRES 1 (225 kV)
                </text>

                {/* BUSBAR 2 */}
                <line x1="40" y1="80" x2="600" y2="80" stroke="#0284C7" strokeWidth="6" />
                <text x="50" y="70" fill="#38BDF8" fontSize="11" fontWeight="bold">
                  JEU DE BARRES 2 (225 kV)
                </text>

                {/* ------------------------------------------------------------- */}
                {/* BAY 1: LINE FEEDER (CENTRAL COLUMN X = 240) */}
                {/* ------------------------------------------------------------- */}
                {/* Taps from Bus 1 and Bus 2 to selector disconnectors */}
                <line x1="220" y1="40" x2="220" y2="105" stroke={q1Bus1Closed ? "#38BDF8" : "#475569"} strokeWidth="3" />
                <line x1="260" y1="80" x2="260" y2="105" stroke={q2Bus2Closed ? "#38BDF8" : "#475569"} strokeWidth="3" />

                {/* Junction point merging from Q1 and Q2 */}
                <line x1="220" y1="135" x2="240" y2="145" stroke="#38BDF8" strokeWidth="3" />
                <line x1="260" y1="135" x2="240" y2="145" stroke="#38BDF8" strokeWidth="3" />

                {/* From junction down to Breaker Q0 */}
                <line x1="240" y1="145" x2="240" y2="175" stroke="#38BDF8" strokeWidth="3" />

                {/* From Breaker Q0 down to Line Disconnector Q9 */}
                <line x1="240" y1="215" x2="240" y2="255" stroke={q0LineClosed ? "#38BDF8" : "#475569"} strokeWidth="3" />

                {/* From Line Disconnector Q9 down to Outgoing Line terminal */}
                <line x1="240" y1="295" x2="240" y2="375" stroke={q0LineClosed && q9LineClosed ? "#38BDF8" : "#475569"} strokeWidth="3" />

                {/* Outgoing Line arrow and label */}
                <polygon points="240,390 234,375 246,375" fill="#38BDF8" />
                <text x="240" y="405" fill="#E2E8F0" fontSize="10" fontWeight="bold" textAnchor="middle">
                  DÉPART LIGNE 225 kV (NACHTIGAL)
                </text>

                {/* Line Earth Switch Q8 tap */}
                <line x1="240" y1="330" x2="310" y2="330" stroke={q8EarthClosed ? "#10B981" : "#475569"} strokeWidth="2.5" />
                {/* Earth Symbol */}
                <line x1="340" y1="320" x2="340" y2="340" stroke="#10B981" strokeWidth="2.5" />
                <line x1="345" y1="324" x2="345" y2="336" stroke="#10B981" strokeWidth="2" />
                <line x1="350" y1="327" x2="350" y2="333" stroke="#10B981" strokeWidth="1.5" />

                {/* ------------------------------------------------------------- */}
                {/* BAY 2: BUS COUPLER (RIGHT COLUMN X = 480) */}
                {/* ------------------------------------------------------------- */}
                <line x1="480" y1="40" x2="480" y2="175" stroke={q0CouplerClosed ? "#38BDF8" : "#475569"} strokeWidth="3" />
                <line x1="480" y1="215" x2="480" y2="80" stroke={q0CouplerClosed ? "#38BDF8" : "#475569"} strokeWidth="3" />
                <text x="480" y="245" fill="#94A3B8" fontSize="9" fontWeight="bold" textAnchor="middle">
                  TRAVÉE COUPLAGE BARRES
                </text>

                {/* ------------------------------------------------------------- */}
                {/* INTERACTIVE APPARATUS SYMBOLS (CLICABLE SVG G ELEMENTS) */}
                {/* ------------------------------------------------------------- */}

                {/* 1. Q1 Bus 1 Disconnector */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleToggleApparatus('Q1')}
                >
                  <rect
                    x="205"
                    y="105"
                    width="30"
                    height="30"
                    rx="4"
                    fill={q1Bus1Closed ? "#065F46" : "#1E293B"}
                    stroke={q1Bus1Closed ? "#10B981" : "#94A3B8"}
                    strokeWidth="1.5"
                  />
                  <text x="220" y="124" fill="#FFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {q1Bus1Closed ? 'I' : 'O'}
                  </text>
                  <text x="195" y="122" fill="#E2E8F0" fontSize="8" fontWeight="bold" textAnchor="end">
                    Q1
                  </text>
                </g>

                {/* 2. Q2 Bus 2 Disconnector */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleToggleApparatus('Q2')}
                >
                  <rect
                    x="245"
                    y="105"
                    width="30"
                    height="30"
                    rx="4"
                    fill={q2Bus2Closed ? "#065F46" : "#1E293B"}
                    stroke={q2Bus2Closed ? "#10B981" : "#94A3B8"}
                    strokeWidth="1.5"
                  />
                  <text x="260" y="124" fill="#FFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {q2Bus2Closed ? 'I' : 'O'}
                  </text>
                  <text x="285" y="122" fill="#E2E8F0" fontSize="8" fontWeight="bold">
                    Q2
                  </text>
                </g>

                {/* 3. Q0 Line Circuit Breaker */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleToggleApparatus('Q0')}
                >
                  <rect
                    x="220"
                    y="175"
                    width="40"
                    height="40"
                    rx="6"
                    fill={q0LineClosed ? "#881337" : "#065F46"}
                    stroke={q0LineClosed ? "#F43F5E" : "#10B981"}
                    strokeWidth="2"
                  />
                  <text x="240" y="199" fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {q0LineClosed ? 'FERMÉ' : 'OUVERT'}
                  </text>
                  <text x="185" y="198" fill="#F43F5E" fontSize="9" fontWeight="bold" textAnchor="end">
                    Q0-LIGNE
                  </text>
                </g>

                {/* 4. Q9 Line Disconnector */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleToggleApparatus('Q9')}
                >
                  <rect
                    x="225"
                    y="255"
                    width="30"
                    height="30"
                    rx="4"
                    fill={q9LineClosed ? "#065F46" : "#1E293B"}
                    stroke={q9LineClosed ? "#10B981" : "#94A3B8"}
                    strokeWidth="1.5"
                  />
                  <text x="240" y="274" fill="#FFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {q9LineClosed ? 'I' : 'O'}
                  </text>
                  <text x="200" y="273" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="end">
                    Q9
                  </text>
                </g>

                {/* 5. Q8 Earth Switch */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleToggleApparatus('Q8')}
                >
                  <rect
                    x="300"
                    y="318"
                    width="24"
                    height="24"
                    rx="4"
                    fill={q8EarthClosed ? "#065F46" : "#1E293B"}
                    stroke={q8EarthClosed ? "#10B981" : "#94A3B8"}
                    strokeWidth="1.5"
                  />
                  <text x="312" y="334" fill="#FFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                    {q8EarthClosed ? 'MALT' : 'O'}
                  </text>
                  <text x="312" y="312" fill="#10B981" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Q8 (TERRE)
                  </text>
                </g>

                {/* 6. Q0-CPL Bus Coupler Breaker */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleToggleApparatus('Q0_CPL')}
                >
                  <rect
                    x="460"
                    y="175"
                    width="40"
                    height="40"
                    rx="6"
                    fill={q0CouplerClosed ? "#881337" : "#065F46"}
                    stroke={q0CouplerClosed ? "#F43F5E" : "#10B981"}
                    strokeWidth="2"
                  />
                  <text x="480" y="199" fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {q0CouplerClosed ? 'CPL ON' : 'CPL OFF'}
                  </text>
                  <text x="515" y="198" fill="#F43F5E" fontSize="9" fontWeight="bold">
                    Q0-CPL
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Right Bay Controller Panel (Col 4) */}
          <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222B38] pb-2.5">
              <Lock className="h-4 w-4 text-cyan-400" />
              <span>{locale === 'fr' ? 'Matrice des Interverrouillages' : 'Interlocking Logic Status'}</span>
            </h4>

            {/* Interlocking Status Table */}
            <div className="space-y-2 text-xs">
              {/* Rule 1: Earth switch Q8 & Line disconnector Q9 */}
              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Q8 (Terre) / Q9 (Ligne)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    {q9LineClosed && q8EarthClosed ? 'VIOLATION' : 'ARMÉ (CONFORME)'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-sans block">
                  Q8 ne peut être fermé si Q9 est fermé. Q9 ne peut être fermé si Q8 est fermé.
                </span>
              </div>

              {/* Rule 2: Disconnector under load protection */}
              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Coupure de Charge (Q0 / Sectionneurs)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    VERROUILLÉ
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-sans block">
                  Q9, Q1, Q2 sont physiquement bloqués si le disjoncteur Q0 est fermé.
                </span>
              </div>

              {/* Rule 3: Bus coupler equipotential condition */}
              <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Commutation de Barres (Q1 &harr; Q2)</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                    q0CouplerClosed
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {q0CouplerClosed ? 'ÉQUIPOTENTIEL' : 'COUPLAGE REQUIS'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-sans block">
                  Permutation sous charge autorisée uniquement si Q0-CPL est fermé.
                </span>
              </div>
            </div>

            {/* Quick Action Reset to Nominal State */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setQ0LineClosed(true);
                  setQ9LineClosed(true);
                  setQ1Bus1Closed(true);
                  setQ2Bus2Closed(false);
                  setQ8EarthClosed(false);
                  setQ0CouplerClosed(false);
                  setHmiAlarm(null);
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Réinitialiser État Nominal 225 kV' : 'Reset to Nominal 225 kV'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ANSI 25 SYNCHROCHECK VECTOR ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'SYNCHROCHECK_ANSI25' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Synchrocheck Phasor Scope Visualizer (Col 8) */}
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  {locale === 'fr'
                    ? "Synchroniseur Automatique & Contrôle de Synchronisme (ANSI 25)"
                    : "Automatic Synchrocheck Vector Engine & Reclosing Permissive (ANSI 25)"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                CEI 60255-125
              </span>
            </div>

            {/* Custom SVG Synchroscope Dial */}
            <div className="relative w-full aspect-[16/10] bg-[#05080E] rounded-xl border border-[#1A222E] p-3 flex flex-col items-center justify-center">
              <svg viewBox="0 0 400 320" className="w-full h-full text-[10px] font-mono select-none">
                {/* Outer Circular Dial */}
                <circle cx="200" cy="160" r="120" fill="#0A0F1A" stroke="#222B38" strokeWidth="3" />
                <circle cx="200" cy="160" r="110" fill="none" stroke="#161F2E" strokeWidth="1" strokeDasharray="3,3" />

                {/* Dial Ticks (Every 30 deg) */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                  const rad = (deg - 90) * (Math.PI / 180);
                  const x1 = 200 + Math.cos(rad) * 110;
                  const y1 = 160 + Math.sin(rad) * 110;
                  const x2 = 200 + Math.cos(rad) * 120;
                  const y2 = 160 + Math.sin(rad) * 120;
                  return (
                    <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#475569" strokeWidth="1.5" />
                  );
                })}

                {/* 12 o'clock Sync Zone (Tolerance Zone +/- 15 deg) */}
                {(() => {
                  // Arc representing +/- 15 degrees at top
                  const arcAngle = 15;
                  const startRad = (-90 - arcAngle) * (Math.PI / 180);
                  const endRad = (-90 + arcAngle) * (Math.PI / 180);
                  const xStart = 200 + Math.cos(startRad) * 120;
                  const yStart = 160 + Math.sin(startRad) * 120;
                  const xEnd = 200 + Math.cos(endRad) * 120;
                  const yEnd = 160 + Math.sin(endRad) * 120;
                  return (
                    <path
                      d={`M 200 160 L ${xStart} ${yStart} A 120 120 0 0 1 ${xEnd} ${yEnd} Z`}
                      fill="#10B981"
                      fillOpacity="0.15"
                      stroke="#10B981"
                      strokeWidth="1.5"
                    />
                  );
                })()}

                {/* Dial Markers Top (SLOW vs FAST) */}
                <text x="140" y="65" fill="#94A3B8" fontSize="9" fontWeight="bold">◀ LENT</text>
                <text x="260" y="65" fill="#94A3B8" fontSize="9" fontWeight="bold" textAnchor="end">RAPIDE ▶</text>
                <text x="200" y="35" fill="#10B981" fontSize="11" fontWeight="bold" textAnchor="middle">★ SYNCHRO (Δδ = 0°)</text>

                {/* Fixed Reference Vector: Busbar 1 (Blue) at 12 o'clock */}
                <line x1="200" y1="160" x2="200" y2="60" stroke="#0284C7" strokeWidth="3.5" />
                <polygon points="200,52 195,65 205,65" fill="#0284C7" />
                <text x="190" y="80" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="end">U_barre</text>

                {/* Rotating Moving Vector: Outgoing Line (Yellow/Red) */}
                {(() => {
                  const lineAngleRad = (-90 + phaseAngleDeg) * (Math.PI / 180);
                  const tipX = 200 + Math.cos(lineAngleRad) * 95;
                  const tipY = 160 + Math.sin(lineAngleRad) * 95;
                  return (
                    <g>
                      <line
                        x1="200"
                        y1="160"
                        x2={tipX}
                        y2={tipY}
                        stroke={isAngleOk ? "#10B981" : "#F43F5E"}
                        strokeWidth="3.5"
                      />
                      <circle cx={tipX} cy={tipY} r="5" fill={isAngleOk ? "#10B981" : "#F43F5E"} />
                    </g>
                  );
                })()}

                {/* Center Hub */}
                <circle cx="200" cy="160" r="7" fill="#FFF" />

                {/* Central Status Overlay Pill */}
                <rect x="130" y="285" width="140" height="24" rx="6" fill={isSynchroPermissiveGranted ? "#065F46" : "#881337"} />
                <text x="200" y="301" fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {isSynchroPermissiveGranted ? 'COUPLEUR AUTORISÉ' : 'ENCLENCHEMENT BLOQUÉ'}
                </text>
              </svg>
            </div>

            {/* Interactive Angle & Frequency Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#0E141F] border border-[#1E2634]">
              {/* Angle Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-bold">Déphasage (Δδ) :</span>
                  <span className={`font-bold ${isAngleOk ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {phaseAngleDeg > 0 ? `+${phaseAngleDeg}°` : `${phaseAngleDeg}°`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  step="0.5"
                  value={phaseAngleDeg}
                  onChange={(e) => setPhaseAngleDeg(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>-60°</span>
                  <span>Tolérance [-15°, +15°]</span>
                  <span>+60°</span>
                </div>
              </div>

              {/* Dynamic Slip Switch */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-bold">Fréquence Ligne (f_ligne) :</span>
                  <span className="text-amber-400 font-bold">{freqLineHz.toFixed(2)} Hz</span>
                </div>
                <input
                  type="range"
                  min="49.80"
                  max="50.20"
                  step="0.01"
                  value={freqLineHz}
                  onChange={(e) => setFreqLineHz(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 rounded h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>49.80 Hz</span>
                  <span>Δf max = 0.10 Hz</span>
                  <span>50.20 Hz</span>
                </div>
              </div>

              {/* Start Continuous Slip Button */}
              <div className="col-span-1 sm:col-span-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRotatingAngle(!isRotatingAngle)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isRotatingAngle
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Play className={`h-3.5 w-3.5 ${isRotatingAngle ? 'fill-slate-950' : ''}`} />
                  <span>
                    {isRotatingAngle
                      ? (locale === 'fr' ? 'Arrêter Glissement de Fréquence Dynamique' : 'Stop Dynamic Frequency Slip')
                      : (locale === 'fr' ? 'Simuler Glissement de Fréquence Réel (Δf)' : 'Simulate Real Frequency Slip (Δf)')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Permissive Criteria Verification (Col 4) */}
          <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222B38] pb-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{locale === 'fr' ? 'Critères d\'Autorisation ANSI 25' : 'ANSI 25 Permissive Criteria'}</span>
            </h4>

            {/* Criteria 1: Delta Voltage */}
            <div className={`p-3 rounded-xl border space-y-1 text-xs ${
              isVoltageOk
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold">1. Écart de Tension |ΔU|</span>
                <span className="font-mono font-bold">{deltaVoltageKv.toFixed(1)} kV</span>
              </div>
              <span className="text-[10px] text-slate-300 font-sans block">
                {isVoltageOk ? '✅ Conforme (Seuil limite &le; 11.25 kV)' : '❌ Hors limite (> 5% Unom)'}
              </span>
            </div>

            {/* Criteria 2: Delta Frequency */}
            <div className={`p-3 rounded-xl border space-y-1 text-xs ${
              isFreqOk
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold">2. Glissement de Fréquence |Δf|</span>
                <span className="font-mono font-bold">{deltaFreqHz.toFixed(3)} Hz</span>
              </div>
              <span className="text-[10px] text-slate-300 font-sans block">
                {isFreqOk ? '✅ Conforme (Seuil limite &le; 0.10 Hz)' : '❌ Glissement trop rapide'}
              </span>
            </div>

            {/* Criteria 3: Delta Angle */}
            <div className={`p-3 rounded-xl border space-y-1 text-xs ${
              isAngleOk
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold">3. Écart d'Angle de Phase |Δδ|</span>
                <span className="font-mono font-bold">{deltaAngleDeg.toFixed(1)}°</span>
              </div>
              <span className="text-[10px] text-slate-300 font-sans block">
                {isAngleOk ? '✅ Conforme (Seuil limite &le; 15.0°)' : '❌ Déphasage excessif'}
              </span>
            </div>

            {/* Why Synchrocheck Matters Note */}
            <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] text-[11px] text-slate-300 font-sans leading-relaxed">
              <strong className="text-amber-400 font-bold block mb-1">
                {locale === 'fr' ? 'POURQUOI LE CONTRÔLE DE SYNCHRONISME EST CRUCIAL :' : 'CRITICAL SAFETY IMPLICATION:'}
              </strong>
              {locale === 'fr'
                ? "Refermer un disjoncteur 225 kV sur deux réseaux asynchrones équivaut à un court-circuit triphasé franc violent. L'onde de choc électrodynamique peut déformer les bobinages des transformateurs et détruire les arbres des turbines d'alternateur."
                : "Closing a breaker between unsynchronized grids triggers massive transient power swings equivalent to a solid three-phase bolted fault, causing severe rotor shaft fatigue and transformer winding deformation."}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: REAL-TIME IEC 61850 GOOSE ENGINE & IEEE 1588v2 PTP CLOCK SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'COMMUNICATION_STACK' && (
        <Iec61850GoosePtpClockSimulator locale={locale} />
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SCL / SCD SUBSTATION CONFIGURATION LANGUAGE EXPLORER */}
      {/* ========================================================================= */}
      {activeTab === 'SCL_SCD_EXPLORER' && (
        <SclConfigFileInspector locale={locale} />
      )}

      {/* ========================================================================= */}
      {/* TAB 6: GOOSE LATENCY & NETWORK STORM SIMULATOR (PRP/HSR REDUNDANCY) */}
      {/* ========================================================================= */}
      {activeTab === 'GOOSE_STORM_LATENCY' && (
        <GooseLatencyStormSimulator locale={locale} />
      )}
    </div>
  );
};
