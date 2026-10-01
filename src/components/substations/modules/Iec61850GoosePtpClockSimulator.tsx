// src/components/substations/modules/Iec61850GoosePtpClockSimulator.tsx
// EPEDE Substation Automation Suite: IEC 61850-8-1 GOOSE Peer-to-Peer Interlocking Engine,
// IEEE 1588v2 PTP (IEC/IEEE 61850-9-3 Power Profile) Grandmaster Time Synchronization,
// and Sampled Values (SV 9-2LE / 61869-9) Multicast Ethernet Stream Analyzer

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Network,
  Clock,
  Radio,
  Zap,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Pause,
  Server,
  Activity,
  Layers,
  Sliders,
  Send,
  Cpu,
  Share2,
  TrendingUp,
  Flame,
  Info
} from 'lucide-react';

interface Iec61850GoosePtpClockSimulatorProps {
  locale: 'fr' | 'en';
}

type PtpGrandmasterMode = 'GPS_LOCKED_CLASS_6' | 'HOLDOVER_RUBIDIUM' | 'GNSS_ANTENNA_FAULT_FREE_RUN';
type SwitchClockMode = 'TRANSPARENT_CLOCK_E2E' | 'BOUNDARY_CLOCK';
type GooseTriggerEvent = 'NORMAL_HEARTBEAT' | 'BAY1_CB_TRIP_INTERLOCK' | 'BUS_REVERSE_BLOCKING' | 'BREAKER_FAILURE_50BF';

interface GoosePacketRecord {
  id: string;
  timestampStr: string;
  appId: string;
  gocbRef: string;
  stNum: number;
  sqNum: number;
  timeAllowedToLiveMs: number;
  dataPayload: string;
  latencyMs: number;
  sourceIed: string;
  targetIeds: string;
  isRetransmission: boolean;
}

export const Iec61850GoosePtpClockSimulator: React.FC<Iec61850GoosePtpClockSimulatorProps> = ({
  locale
}) => {
  // ---------------------------------------------------------------------------
  // 1. PTP GRANDMASTER CLOCK STATE (IEEE 1588v2 / IEC 61850-9-3 Power Profile)
  // ---------------------------------------------------------------------------
  const [grandmasterMode, setGrandmasterMode] = useState<PtpGrandmasterMode>('GPS_LOCKED_CLASS_6');
  const [switchClockMode, setSwitchClockMode] = useState<SwitchClockMode>('TRANSPARENT_CLOCK_E2E');
  const [switchJitterNs, setSwitchJitterNs] = useState<number>(35); // 10 to 800 ns
  const [activeGnssSatellites, setActiveGnssSatellites] = useState<number>(14);

  // Time calculations based on PTP state
  const ptpAccuracyMetrics = useMemo(() => {
    if (grandmasterMode === 'GPS_LOCKED_CLASS_6') {
      const totalJitter = switchClockMode === 'TRANSPARENT_CLOCK_E2E' ? switchJitterNs + 15 : switchJitterNs + 40;
      return {
        accuracyClass: 'IEC 61850-9-3 Class 6 (< 1 µs)',
        clockOffsetNs: Math.round(totalJitter * 0.4),
        pathDelayUs: 1.25,
        syncStatus: 'LOCKED_OPTIMAL',
        svStatusOk: true,
        diffProtOk: true
      };
    } else if (grandmasterMode === 'HOLDOVER_RUBIDIUM') {
      return {
        accuracyClass: 'Holdover Rubidium (Drift < 1 µs/24h)',
        clockOffsetNs: 420,
        pathDelayUs: 1.65,
        syncStatus: 'HOLDOVER_WARNING',
        svStatusOk: true,
        diffProtOk: true
      };
    } else {
      return {
        accuracyClass: 'Free Running (Drift > 10 µs)',
        clockOffsetNs: 8400,
        pathDelayUs: 4.80,
        syncStatus: 'LOSS_OF_SYNC_ALARM',
        svStatusOk: false, // IEC 61850-9-2 requires < 1 µs sync for SV
        diffProtOk: false // ANSI 87 blocked to prevent spurious trip
      };
    }
  }, [grandmasterMode, switchClockMode, switchJitterNs]);

  // ---------------------------------------------------------------------------
  // 2. PEER-TO-PEER GOOSE PUBLISHER / SUBSCRIBER ENGINE (IEC 61850-8-1)
  // ---------------------------------------------------------------------------
  const [stNum, setStNum] = useState<number>(12);
  const [sqNum, setSqNum] = useState<number>(0);
  const [gooseHistory, setGooseHistory] = useState<GoosePacketRecord[]>([]);
  const [lastTrigger, setLastTrigger] = useState<GooseTriggerEvent>('NORMAL_HEARTBEAT');
  const [vlanPriority, setVlanPriority] = useState<number>(4); // Default VLAN priority 4 for GOOSE
  const [isBurstActive, setIsBurstActive] = useState<boolean>(false);

  // Trigger a GOOSE state change with retransmission burst curve (T0 = 1ms -> 2ms -> 4ms -> 8ms -> 1000ms)
  const handleTriggerGoose = (event: GooseTriggerEvent) => {
    setLastTrigger(event);
    const newSt = stNum + 1;
    setStNum(newSt);
    setSqNum(0);
    setIsBurstActive(true);

    let eventPayload = 'Normal Keepalive State';
    let src = 'BAY1_LINE_BCU';
    let targets = 'BAY2_BCU, CPL_BCU, BUSBAR_87B';
    let baseLatency = 0.9;

    if (event === 'BAY1_CB_TRIP_INTERLOCK') {
      eventPayload = 'TRIP_COMMAND: Q0 Breaker OPEN (Reverse Interlock Blocked)';
      src = 'BAY1_LINE_PROT_P1';
      targets = 'BAY1_BCU, BAY2_BCU, BUSBAR_87B';
      baseLatency = 1.1;
    } else if (event === 'BUS_REVERSE_BLOCKING') {
      eventPayload = 'BLOCKING_SIGNAL: Overcurrent in Outgoing Feeder (Block 87B)';
      src = 'BAY1_OVERCURRENT_IED';
      targets = 'BUSBAR_CENTRAL_87B_IED';
      baseLatency = 0.85;
    } else if (event === 'BREAKER_FAILURE_50BF') {
      eventPayload = 'EMERGENCY_50BF: Bay 1 Q0 Stuck Closed -> TRIP ADJACENT BAYS';
      src = 'BAY1_50BF_LOGIC';
      targets = 'ALL_SUBSTATION_BCUs, TRANSFORMER_Q0';
      baseLatency = 1.4;
    }

    const now = new Date();
    const msStr = String(now.getMilliseconds()).padStart(3, '0');
    const timeStr = `${now.toLocaleTimeString()}.${msStr}`;

    // Create immediate T0 burst packet
    const burstPkt0: GoosePacketRecord = {
      id: `GOOSE-${Date.now()}-0`,
      timestampStr: timeStr,
      appId: '0x0001',
      gocbRef: 'BAY1_LD0/LLN0$GO$gcbTrip',
      stNum: newSt,
      sqNum: 0,
      timeAllowedToLiveMs: 2,
      dataPayload: eventPayload,
      latencyMs: baseLatency,
      sourceIed: src,
      targetIeds: targets,
      isRetransmission: false
    };

    // Subsequent exponential retransmissions
    const burstPkt1: GoosePacketRecord = {
      id: `GOOSE-${Date.now()}-1`,
      timestampStr: `${now.toLocaleTimeString()}.${String(now.getMilliseconds() + 1).padStart(3, '0')}`,
      appId: '0x0001',
      gocbRef: 'BAY1_LD0/LLN0$GO$gcbTrip',
      stNum: newSt,
      sqNum: 1,
      timeAllowedToLiveMs: 4,
      dataPayload: eventPayload,
      latencyMs: baseLatency + 0.1,
      sourceIed: src,
      targetIeds: targets,
      isRetransmission: true
    };

    const burstPkt2: GoosePacketRecord = {
      id: `GOOSE-${Date.now()}-2`,
      timestampStr: `${now.toLocaleTimeString()}.${String(now.getMilliseconds() + 3).padStart(3, '0')}`,
      appId: '0x0001',
      gocbRef: 'BAY1_LD0/LLN0$GO$gcbTrip',
      stNum: newSt,
      sqNum: 2,
      timeAllowedToLiveMs: 8,
      dataPayload: eventPayload,
      latencyMs: baseLatency + 0.2,
      sourceIed: src,
      targetIeds: targets,
      isRetransmission: true
    };

    setGooseHistory(prev => [burstPkt0, burstPkt1, burstPkt2, ...prev.slice(0, 15)]);

    setTimeout(() => {
      setIsBurstActive(false);
    }, 1200);
  };

  // ---------------------------------------------------------------------------
  // 3. SAMPLED VALUES (IEC 61850-9-2LE / IEC 61869-9) STREAM DISSECTOR
  // ---------------------------------------------------------------------------
  const [svSampleRate, setSvSampleRate] = useState<4000 | 12800>(4000); // 80 éch/période vs 256 éch/période @ 50 Hz
  const [svStreamCount, setSvStreamCount] = useState<number>(31240);

  useEffect(() => {
    const timer = setInterval(() => {
      setSvStreamCount(prev => (prev + (svSampleRate === 4000 ? 80 : 256)) % 1000000);
    }, 100);
    return () => clearInterval(timer);
  }, [svSampleRate]);

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Network className="w-4 h-4" />
            </span>
            <span className="font-bold text-white text-sm">
              {locale === 'fr'
                ? "Simulateur CEI 61850 : Trame GOOSE Sub-3ms, PTP IEEE 1588v2 & Sampled Values (SV 9-2LE)"
                : "IEC 61850 Substation Simulator: Sub-3ms GOOSE, IEEE 1588v2 PTP & Sampled Values (SV 9-2LE)"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            {locale === 'fr'
              ? "Modélisation de l'inter-verrouillage peer-to-peer par GOOSE (stNum / sqNum), synchronisation nanoseconde PTP (Profil Puissance IEC 61850-9-3) et dissection de trames Ethernet optiques."
              : "Peer-to-peer GOOSE interlocking engine with burst retransmissions, IEEE 1588v2 nanosecond PTP Grandmaster synchronization, and optical SV 9-2LE bitstream packet dissection."}
          </p>
        </div>

        {/* Global Reset */}
        <button
          type="button"
          onClick={() => {
            setGrandmasterMode('GPS_LOCKED_CLASS_6');
            setSwitchClockMode('TRANSPARENT_CLOCK_E2E');
            setSwitchJitterNs(35);
            setStNum(12);
            setSqNum(0);
            setGooseHistory([]);
            setLastTrigger('NORMAL_HEARTBEAT');
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{locale === 'fr' ? 'Réinitialiser' : 'Reset'}</span>
        </button>
      </div>

      {/* Main Grid: Left = IEEE 1588v2 PTP Clock System, Right = GOOSE Engine & SV Dissector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ===================================================================== */}
        {/* LEFT COLUMN: IEEE 1588v2 PTP GRANDMASTER CLOCK & SWITCHES (COL 6)    */}
        {/* ===================================================================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Horloge Grandmaster PTP (Profil Puissance CEI/IEEE 61850-9-3)"
                    : "PTP Grandmaster Clock (IEC/IEEE 61850-9-3 Power Profile)"}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                ptpAccuracyMetrics.syncStatus === 'LOCKED_OPTIMAL'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : ptpAccuracyMetrics.syncStatus === 'HOLDOVER_WARNING'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
              }`}>
                {ptpAccuracyMetrics.syncStatus === 'LOCKED_OPTIMAL' ? 'PTP VERROUILLÉ (< 50 ns)' : ptpAccuracyMetrics.syncStatus === 'HOLDOVER_WARNING' ? 'HOLDOVER DRIFT' : 'SYNCHRO PERDUE'}
              </span>
            </div>

            {/* Grandmaster Operational Mode Toggle */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400">État de la Source de Synchronisation GNSS :</span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['GPS_LOCKED_CLASS_6', 'HOLDOVER_RUBIDIUM', 'GNSS_ANTENNA_FAULT_FREE_RUN'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setGrandmasterMode(mode)}
                    className={`p-2 rounded-xl border text-[10px] font-bold text-left transition-all cursor-pointer flex flex-col justify-between ${
                      grandmasterMode === mode
                        ? mode === 'GPS_LOCKED_CLASS_6'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : mode === 'HOLDOVER_RUBIDIUM'
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-rose-600 text-white border-rose-400 animate-pulse'
                        : 'bg-[#0D121B] border-[#1E2634] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{mode === 'GPS_LOCKED_CLASS_6' ? '1. GPS Verrouillé' : mode === 'HOLDOVER_RUBIDIUM' ? '2. Holdover Rubidium' : '3. Perte Antenne GNSS'}</span>
                    <span className="text-[8px] opacity-80 mt-1 font-mono">
                      {mode === 'GPS_LOCKED_CLASS_6' ? 'Classe 6 (<1µs)' : mode === 'HOLDOVER_RUBIDIUM' ? 'Dérive 1µs/24h' : 'Erreur > 10µs'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live PTP Telemetry Gauge Panel */}
            <div className="p-3.5 rounded-xl bg-[#05080E] border border-[#1E2634] space-y-2.5 font-mono">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Écart d'Horloge Absolu (Clock Offset) :</span>
                <span className={`text-sm font-bold ${ptpAccuracyMetrics.clockOffsetNs > 1000 ? 'text-rose-400' : ptpAccuracyMetrics.clockOffsetNs > 100 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  &plusmn;{ptpAccuracyMetrics.clockOffsetNs} ns
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Délai Moyen de Propagation (Mean Path Delay) :</span>
                <span className="text-cyan-400 font-bold">{ptpAccuracyMetrics.pathDelayUs.toFixed(2)} µs</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Satellites Actifs (GPS + Galileo) :</span>
                <span className="text-white font-bold">{grandmasterMode === 'GNSS_ANTENNA_FAULT_FREE_RUN' ? '0 (Décrochage)' : `${activeGnssSatellites} Satellites`}</span>
              </div>
            </div>

            {/* Switch Clock Architecture: Transparent vs Boundary Clock */}
            <div className="p-3.5 rounded-xl bg-[#0D121B] border border-[#1E2634] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold text-[11px]">Mode d'Horloge du Switch Ethernet Durci :</span>
                <span className="text-cyan-300 font-bold font-mono text-[10px]">
                  {switchClockMode === 'TRANSPARENT_CLOCK_E2E' ? 'Transparent Clock (TC End-to-End)' : 'Boundary Clock (BC)'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSwitchClockMode('TRANSPARENT_CLOCK_E2E')}
                  className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold cursor-pointer ${
                    switchClockMode === 'TRANSPARENT_CLOCK_E2E'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Transparent Clock (TC)
                </button>
                <button
                  type="button"
                  onClick={() => setSwitchClockMode('BOUNDARY_CLOCK')}
                  className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold cursor-pointer ${
                    switchClockMode === 'BOUNDARY_CLOCK'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Boundary Clock (BC)
                </button>
              </div>

              {/* Jitter slider */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Gigue Matérielle de Traversée du Switch :</span>
                  <span className="text-emerald-400 font-mono font-bold">{switchJitterNs} ns</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={switchJitterNs}
                  onChange={e => setSwitchJitterNs(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Diagnostic Impact on Differential Protection (ANSI 87) & SV */}
            <div className={`p-3 rounded-xl border space-y-1.5 ${
              ptpAccuracyMetrics.diffProtOk
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/50 border-rose-500 text-rose-200'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-[11px]">
                {ptpAccuracyMetrics.diffProtOk ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Synchronisation Précise : Protection Différentielle (ANSI 87B) Active</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span>VERROUILLAGE SÉCURITÉ : Protection 87B et Merging Units Bloquées</span>
                  </>
                )}
              </div>
              <p className="text-[10px] font-sans leading-relaxed">
                {ptpAccuracyMetrics.diffProtOk
                  ? "L'écart temporel &le; 1 µs garantit un déphasage d'échantillonnage < 0.018°, éliminant tout faux courant différentiel d'origine numérique dans le différentiel de jeu de barres."
                  : "Un désalignement temporel > 1 µs fausse l'alignement des phaseurs de courant entre travées, risquant un déclenchement intempestif massif du poste. L'IED 87B se verrouille automatiquement par sécurité."}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: PEER-TO-PEER GOOSE ENGINE & ETHERNET TRACE (COL 6)      */}
        {/* ===================================================================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#222B38] pb-2.5">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-xs">
                  {locale === 'fr'
                    ? "Moteur GOOSE Peer-to-Peer Sub-3ms (CEI 61850-8-1)"
                    : "Peer-to-Peer Sub-3ms GOOSE Engine (IEC 61850-8-1)"}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                VLAN Pri: {vlanPriority} · EtherType 0x88B8
              </span>
            </div>

            {/* Interactive GOOSE Action Triggers */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-sans">
                {locale === 'fr'
                  ? "Déclencher un événement GOOSE pour observer la courbe de retransmission (stNum / sqNum) :"
                  : "Trigger GOOSE event to inspect stNum/sqNum burst retransmission curve:"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleTriggerGoose('BAY1_CB_TRIP_INTERLOCK')}
                  className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-600 text-rose-200 text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-rose-400" />
                  <span>1. Déclenchement Q0</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerGoose('BUS_REVERSE_BLOCKING')}
                  className="p-2 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-600 text-amber-200 text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>2. Blocage Amont 87B</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTriggerGoose('BREAKER_FAILURE_50BF')}
                  className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-600 text-purple-200 text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-purple-400" />
                  <span>3. Défaillance 50BF</span>
                </button>
              </div>
            </div>

            {/* Live Packet Dissection Visualizer */}
            <div className="p-3.5 rounded-xl bg-[#05080E] border border-[#1E2634] space-y-2">
              <div className="flex justify-between items-center text-[10px] pb-1.5 border-b border-slate-800">
                <span className="text-slate-400">Dernier Message Transmis :</span>
                <span className="font-mono text-cyan-300 font-bold">stNum: {stNum} · sqNum: {sqNum}</span>
              </div>

              <div className="space-y-1.5 text-[10px] font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Adresse MAC Multicast :</span>
                  <span className="text-slate-300 font-bold">01-0C-CD-01-00-01</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">goCB Reference :</span>
                  <span className="text-amber-400">BAY1_LD0/LLN0$GO$gcbTrip</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time-Allowed-To-Live (TAL) :</span>
                  <span className="text-emerald-400 font-bold">{isBurstActive ? '2 ms (Burst T0)' : '2000 ms (Keepalive)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Latence Mesurée :</span>
                  <span className="text-emerald-400 font-bold">0.92 ms (Exigence CEI &lt; 3 ms)</span>
                </div>
              </div>
            </div>

            {/* Live Captured GOOSE Packet Log Table */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold">Journal des Trames GOOSE Capturées :</span>
              <div className="max-h-40 overflow-y-auto rounded-xl border border-[#1E2634] bg-[#05080E]">
                <table className="w-full text-left text-[10px] font-mono">
                  <thead className="bg-[#0D121B] text-slate-400 border-b border-slate-800 sticky top-0">
                    <tr>
                      <th className="p-1.5">Heure</th>
                      <th className="p-1.5">st/sq</th>
                      <th className="p-1.5">TAL</th>
                      <th className="p-1.5">Événement Payload</th>
                      <th className="p-1.5">Latence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {gooseHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-3 text-center text-slate-500 font-sans">
                          Aucun événement déclenché. Cliquez sur un bouton ci-dessus pour émettre une trame.
                        </td>
                      </tr>
                    ) : (
                      gooseHistory.map(pkt => (
                        <tr key={pkt.id} className="hover:bg-slate-800/40">
                          <td className="p-1.5 text-cyan-400">{pkt.timestampStr}</td>
                          <td className="p-1.5 text-amber-300">{pkt.stNum}/{pkt.sqNum}</td>
                          <td className="p-1.5 text-slate-300">{pkt.timeAllowedToLiveMs} ms</td>
                          <td className="p-1.5 text-white font-sans truncate max-w-[140px]">{pkt.dataPayload}</td>
                          <td className="p-1.5 text-emerald-400 font-bold">{pkt.latencyMs.toFixed(2)} ms</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Sampled Values (SV 9-2LE) Process Bus Quick Monitor */}
          <div className="p-3.5 rounded-2xl bg-[#080C13] border border-[#222B38] shadow-2xl flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <div>
                <span className="text-white font-bold block">Flux Sampled Values (CEI 61850-9-2LE) :</span>
                <span className="text-slate-400 text-[10px]">
                  {svSampleRate === 4000 ? '80 éch/période @ 50 Hz (4000 éch/s)' : '256 éch/période @ 50 Hz (12800 éch/s)'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold font-mono">
                smpCnt: {svStreamCount}
              </span>
              <button
                type="button"
                onClick={() => setSvSampleRate(svSampleRate === 4000 ? 12800 : 4000)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold cursor-pointer"
              >
                {svSampleRate === 4000 ? 'Passer à 256 éch' : 'Passer à 80 éch'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
