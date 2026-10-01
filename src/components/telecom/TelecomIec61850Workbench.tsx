// src/components/telecom/TelecomIec61850Workbench.tsx
// EPEDE Engineering Workbench — Domain D13: Communications & Operational Technology (Télécommunications de Réseau & CEI 61850)
// Grounded in IEC 61850-9-2LE/61869-9, IEC 61850-8-1 (GOOSE), IEC 62439-3 (PRP/HSR), IEEE 1588v2 PTP,
// ITU-T G.652D OPGW Link Budgets, High-Frequency Power Line Carrier (PLC), and Cameroon National Telecom Infrastructure.

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Network,
  Radio,
  Activity,
  Clock,
  Zap,
  Layers,
  Server,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Share2,
  Waves,
  Eye,
  Info,
  Database,
  Cpu,
  Flame,
  Lock,
  Unlock,
  FileText,
  Globe,
  TrendingUp,
  RefreshCw,
  Send,
  Terminal,
  ExternalLink
} from 'lucide-react';

interface TelecomIec61850WorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (id: string) => void;
}

type PillarId = 
  | 'PROCESS_BUS_SV'
  | 'GOOSE_STORM'
  | 'PRP_HSR_REDUNDANCY'
  | 'PTP_IEEE1588'
  | 'OPGW_LINK_BUDGET'
  | 'PLC_LINE_TRAP'
  | 'CAMEROON_TELECOM';

export const TelecomIec61850Workbench: React.FC<TelecomIec61850WorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  const [activePillar, setActivePillar] = useState<PillarId>('PROCESS_BUS_SV');

  // =========================================================================
  // PILLAR 1: SUBSTATION PROCESS BUS & SAMPLED VALUES (IEC 61850-9-2LE / 61869-9)
  // =========================================================================
  const [svSampleRate, setSvSampleRate] = useState<4000 | 12800>(4000); // 4000 Hz (80 s/c at 50Hz) or 12800 Hz (256 s/c)
  const [svSensorType, setSvSensorType] = useState<'ROGOWSKI_NCIT' | 'CONVENTIONAL_SAMU' | 'OPTICAL_FARADAY'>('ROGOWSKI_NCIT');
  const [svFaultActive, setSvFaultActive] = useState<boolean>(false);
  const [svSmpCnt, setSvSmpCnt] = useState<number>(1042);
  const [svVlanPriority, setSvVlanPriority] = useState<number>(4);
  const [svSimRunning, setSvSimRunning] = useState<boolean>(true);

  // Time ticker for wave simulation
  const [waveAngle, setWaveAngle] = useState<number>(0);
  useEffect(() => {
    if (!svSimRunning) return;
    const interval = setInterval(() => {
      setWaveAngle((prev) => (prev + 0.15) % (Math.PI * 2));
      setSvSmpCnt((prev) => (prev + 1) % (svSampleRate === 4000 ? 4000 : 12800));
    }, 50);
    return () => clearInterval(interval);
  }, [svSimRunning, svSampleRate]);

  // Compute instantaneous values
  const nominalCurrentPeak = 1250 * Math.sqrt(2); // ~1768 A
  const faultCurrentPeak = 21500 * Math.sqrt(2);  // ~30.4 kA
  const currentAmp = svFaultActive ? faultCurrentPeak : nominalCurrentPeak;

  const currentPhaseA = currentAmp * Math.sin(waveAngle);
  const currentPhaseB = currentAmp * Math.sin(waveAngle - (2 * Math.PI) / 3);
  const currentPhaseC = currentAmp * Math.sin(waveAngle + (2 * Math.PI) / 3);

  const nominalVoltagePeak = (225000 / Math.sqrt(3)) * Math.sqrt(2); // ~183.7 kV peak
  const voltageAmp = svFaultActive ? nominalVoltagePeak * 0.15 : nominalVoltagePeak;

  const voltagePhaseA = voltageAmp * Math.sin(waveAngle);
  const voltagePhaseB = nominalVoltagePeak * Math.sin(waveAngle - (2 * Math.PI) / 3);
  const voltagePhaseC = nominalVoltagePeak * Math.sin(waveAngle + (2 * Math.PI) / 3);

  // =========================================================================
  // PILLAR 2: STATION BUS GOOSE STORM & TELEPROTECTION BENCH (IEC 61850-8-1)
  // =========================================================================
  const [gooseStNum, setGooseStNum] = useState<number>(7);
  const [gooseSqNum, setGooseSqNum] = useState<number>(1);
  const [gooseTripActive, setGooseTripActive] = useState<boolean>(false);
  const [gooseVlanPcp, setGooseVlanPcp] = useState<number>(6); // Priority Code Point 6 or 7
  const [bgNetworkTrafficMb, setBgNetworkTrafficMb] = useState<number>(35); // Background load %
  const [igmpSnoopingEnabled, setIgmpSnoopingEnabled] = useState<boolean>(true);
  const [gooseLog, setGooseLog] = useState<Array<{
    time: string;
    intervalMs: number;
    stNum: number;
    sqNum: number;
    status: string;
    latencyMs: number;
  }>>([
    { time: '14:20:00.100', intervalMs: 1000, stNum: 7, sqNum: 142, status: 'NORMAL_HEARTBEAT', latencyMs: 0.85 },
    { time: '14:20:01.100', intervalMs: 1000, stNum: 7, sqNum: 143, status: 'NORMAL_HEARTBEAT', latencyMs: 0.82 }
  ]);

  const handleTriggerGooseTrip = () => {
    const newSt = gooseStNum + 1;
    setGooseStNum(newSt);
    setGooseSqNum(0);
    setGooseTripActive(true);

    // Calculate actual latency under network load
    const baseLatency = 0.75;
    const congestionFactor = igmpSnoopingEnabled ? (bgNetworkTrafficMb * 0.008) : (bgNetworkTrafficMb * 0.035);
    const calculatedLatency = +(baseLatency + congestionFactor).toFixed(2);

    const burstEvents = [
      { time: 'TRIP T0 +0.0ms', intervalMs: 0, stNum: newSt, sqNum: 0, status: 'TRIP_COMMAND_BURST (t0)', latencyMs: calculatedLatency },
      { time: 'TRIP T1 +1.0ms', intervalMs: 1, stNum: newSt, sqNum: 1, status: 'BURST_RETRANSMISSION (t1)', latencyMs: +(calculatedLatency + 0.05).toFixed(2) },
      { time: 'TRIP T2 +2.0ms', intervalMs: 2, stNum: newSt, sqNum: 2, status: 'BURST_RETRANSMISSION (t2)', latencyMs: +(calculatedLatency + 0.03).toFixed(2) },
      { time: 'TRIP T3 +4.0ms', intervalMs: 4, stNum: newSt, sqNum: 3, status: 'EXPONENTIAL_BACKOFF (t3)', latencyMs: +(calculatedLatency + 0.04).toFixed(2) },
      { time: 'TRIP T4 +8.0ms', intervalMs: 8, stNum: newSt, sqNum: 4, status: 'EXPONENTIAL_BACKOFF (t4)', latencyMs: +(calculatedLatency + 0.02).toFixed(2) },
      { time: 'TRIP T5 +16.0ms', intervalMs: 16, stNum: newSt, sqNum: 5, status: 'EXPONENTIAL_BACKOFF (t5)', latencyMs: +(calculatedLatency + 0.02).toFixed(2) }
    ];

    setGooseLog((prev) => [...burstEvents, ...prev.slice(0, 8)]);
  };

  // =========================================================================
  // PILLAR 3: ZERO-RECOVERY NETWORK REDUNDANCY (PRP vs HSR per IEC 62439-3)
  // =========================================================================
  const [redundancyProtocol, setRedundancyProtocol] = useState<'PRP' | 'HSR'>('PRP');
  const [lanAFault, setLanAFault] = useState<boolean>(false);
  const [lanBFault, setLanBFault] = useState<boolean>(false);
  const [ringNode3Cut, setRingNode3Cut] = useState<boolean>(false);
  const [prpPacketsSent, setPrpPacketsSent] = useState<number>(14520);
  const [prpPacketsRcvA, setPrpPacketsRcvA] = useState<number>(14520);
  const [prpPacketsRcvB, setPrpPacketsRcvB] = useState<number>(14520);
  const [prpDuplicatesDiscarded, setPrpDuplicatesDiscarded] = useState<number>(14520);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrpPacketsSent((prev) => prev + 10);
      if (!lanAFault) setPrpPacketsRcvA((prev) => prev + 10);
      if (!lanBFault) setPrpPacketsRcvB((prev) => prev + 10);
      if (!lanAFault && !lanBFault) {
        setPrpDuplicatesDiscarded((prev) => prev + 10);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lanAFault, lanBFault]);

  // =========================================================================
  // PILLAR 4: PRECISION TIME PROTOCOL IEEE 1588v2 & PTP GRANDMASTER
  // =========================================================================
  const [ptpGmState, setPtpGmState] = useState<'LOCKED_GNSS' | 'HOLDOVER_OCXO' | 'HOLDOVER_RUBIDIUM' | 'FREERUN_DRIFT'>('LOCKED_GNSS');
  const [ptpHoldoverHours, setPtpHoldoverHours] = useState<number>(0);
  const [switchClockType, setSwitchClockType] = useState<'TRANSPARENT_CLOCK_TC' | 'BOUNDARY_CLOCK_BC' | 'STANDARD_SWITCH_NO_PTP'>('TRANSPARENT_CLOCK_TC');

  // Time drift calculation (in nanoseconds)
  const calculatedDriftNs = useMemo(() => {
    if (ptpGmState === 'LOCKED_GNSS') return 18; // ~18 ns locked to GPS
    if (ptpGmState === 'HOLDOVER_RUBIDIUM') {
      // 1 microsecond drift after 24h (~41 ns/h)
      return Math.round(18 + ptpHoldoverHours * 41.6);
    }
    if (ptpGmState === 'HOLDOVER_OCXO') {
      // 1 microsecond drift after 4h (~250 ns/h)
      return Math.round(18 + ptpHoldoverHours * 250);
    }
    // Free run: standard uncompensated quartz (~3000 ns/h)
    return Math.round(18 + ptpHoldoverHours * 3200);
  }, [ptpGmState, ptpHoldoverHours]);

  // Phase error on 50 Hz power system: delta_theta = 360 * f * delta_t
  const phaseAngleErrorDeg = (360 * 50 * (calculatedDriftNs * 1e-9)).toFixed(4);

  // =========================================================================
  // PILLAR 5: WAN OPTICAL LINK BUDGET & OPGW DISPERSION SOLVER (ITU-T G.652D)
  // =========================================================================
  const [opgwLineLengthKm, setOpgwLineLengthKm] = useState<number>(115); // e.g. Mangombé - Oyomabang 225 kV
  const [opticalWavelength, setOpticalWavelength] = useState<1310 | 1550>(1550);
  const [spliceCount, setSpliceCount] = useState<number>(38); // 1 splice every ~3km drum
  const [connectorCount, setConnectorCount] = useState<number>(4); // Patch panels
  const [agingMarginDb, setAgingMarginDb] = useState<number>(3.0);
  const [txOpticalPowerDbm, setTxOpticalPowerDbm] = useState<number>(+1.5);
  const [rxSensitivityDbm, setRxSensitivityDbm] = useState<number>(-31.0);

  const fiberAttenuationCoeff = opticalWavelength === 1550 ? 0.20 : 0.35; // dB/km
  const spliceLossDb = 0.05; // dB per fusion splice
  const connectorLossDb = 0.25; // dB per mated connector pair

  const fiberLoss = +(opgwLineLengthKm * fiberAttenuationCoeff).toFixed(2);
  const totalSpliceLoss = +(spliceCount * spliceLossDb).toFixed(2);
  const totalConnectorLoss = +(connectorCount * connectorLossDb).toFixed(2);
  const totalLinkAttenuationDb = +(fiberLoss + totalSpliceLoss + totalConnectorLoss + agingMarginDb).toFixed(2);

  const totalLinkBudgetDb = +(txOpticalPowerDbm - rxSensitivityDbm).toFixed(2);
  const opticalMarginDb = +(totalLinkBudgetDb - totalLinkAttenuationDb).toFixed(2);
  const isOpticalLinkViable = opticalMarginDb >= 0;

  // =========================================================================
  // PILLAR 6: POWER LINE CARRIER (CPL / PLC) & LINE TRAP HIGH-FREQUENCY COUPLER
  // =========================================================================
  const [plcFrequencyKhz, setPlcFrequencyKhz] = useState<number>(180); // 40 to 500 kHz
  const [lineTrapInductanceMh, setLineTrapInductanceMh] = useState<number>(1.0); // 0.5 to 2.0 mH
  const [ccvtCapacitancePf, setCcvtCapacitancePf] = useState<number>(6800); // 4000 to 10000 pF

  const omega = 2 * Math.PI * plcFrequencyKhz * 1000;
  const lineTrapImpedance = Math.round(omega * (lineTrapInductanceMh * 1e-3));
  const ccvtImpedance = Math.round(1 / (omega * (ccvtCapacitancePf * 1e-12)));

  // Rejection quality: LT impedance > 400 ohms
  const lineTrapIsCompliant = lineTrapImpedance >= 400;

  // =========================================================================
  // PILLAR 7: CAMEROON TELECOM INFRASTRUCTURE & FORENSIC GRID INCIDENTS
  // =========================================================================
  const [selectedCaseId, setSelectedCaseId] = useState<'CASE_OPGW_SONATREL' | 'CASE_87L_ASYMMETRY' | 'CASE_ENEO_RADIO_LTE'>('CASE_OPGW_SONATREL');

  return (
    <div className="w-full space-y-6">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950/80 to-slate-900 border border-teal-700/50 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">
                DOMAIN D13 · MASTER WORKBENCH
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> CEI 61850 / IEEE 1588 / PRP
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Radio className="w-6 h-6 text-teal-400 animate-pulse" />
              {locale === 'fr' 
                ? 'Station Expert Télécommunications & Postes Numériques CEI 61850'
                : 'Utility Telecom & IEC 61850 Digital Substation Engineering Workbench'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Laboratoire interactif de télécommunications d\'énergie : bus de processus (Sampled Values 9-2LE / NCIT), bus de station GOOSE, redondance zéro-perte PRP/HSR, synchronisation PTP IEEE 1588v2, bilan de liaison OPGW, courants porteurs (CPL) et infrastructure télécom camerounaise SONATREL / Eneo.'
                : 'Interactive utility telecommunications laboratory: process bus (Sampled Values 9-2LE / NCIT), station bus GOOSE teleprotection, zero-packet-loss PRP/HSR redundancy, IEEE 1588v2 PTP time sync, OPGW optical link budgeting, Power Line Carrier (PLC), and Cameroon national utility telecom backbones.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-teal-600/40 text-right font-mono">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                {locale === 'fr' ? 'Normes Maîtresses' : 'Governing Standards'}
              </span>
              <span className="text-xs font-bold text-teal-300">
                IEC 61850 · 62439-3 · G.652D
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-PILLAR SELECTOR TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {[
          { id: 'PROCESS_BUS_SV', labelFr: '1. Bus Processus SV', labelEn: '1. Process Bus SV', icon: Waves },
          { id: 'GOOSE_STORM', labelFr: '2. GOOSE & Déclenchement', labelEn: '2. GOOSE & Tripping', icon: Zap },
          { id: 'PRP_HSR_REDUNDANCY', labelFr: '3. Redondance PRP/HSR', labelEn: '3. PRP / HSR Dual LAN', icon: Network },
          { id: 'PTP_IEEE1588', labelFr: '4. Synchro PTP 1588', labelEn: '4. IEEE 1588 PTP', icon: Clock },
          { id: 'OPGW_LINK_BUDGET', labelFr: '5. Bilan Optique OPGW', labelEn: '5. OPGW Link Budget', icon: Activity },
          { id: 'PLC_LINE_TRAP', labelFr: '6. CPL & Self d\'Arrêt', labelEn: '6. PLC & Line Trap', icon: Radio },
          { id: 'CAMEROON_TELECOM', labelFr: '7. Réseau SONATREL', labelEn: '7. Cameroon Telecom', icon: Globe },
        ].map((p) => {
          const Icon = p.icon;
          const isActive = activePillar === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePillar(p.id as PillarId)}
              className={`flex items-center gap-2 p-3 rounded-xl font-mono text-xs font-bold transition-all text-left border ${
                isActive
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-lg shadow-teal-500/20'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-teal-400'}`} />
              <span className="truncate">{locale === 'fr' ? p.labelFr : p.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* PILLAR 1: SUBSTATION PROCESS BUS & SAMPLED VALUES (IEC 61850-9-2LE) */}
      {/* =================================================================== */}
      {activePillar === 'PROCESS_BUS_SV' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CONTROLS CARD */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Waves className="w-4 h-4 text-teal-400" />
                  {locale === 'fr' ? 'Configuration Merging Unit (MU)' : 'Merging Unit (MU) Setup'}
                </h3>
                <button
                  onClick={() => setSvSimRunning(!svSimRunning)}
                  className={`p-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1 ${
                    svSimRunning ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {svSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {svSimRunning ? (locale === 'fr' ? 'Actif' : 'Running') : (locale === 'fr' ? 'Pause' : 'Paused')}
                </button>
              </div>

              {/* SENSOR TECHNOLOGY SELECTOR */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block">
                  {locale === 'fr' ? 'Technologie de Capteur HTB :' : 'HV Instrument Sensor Type:'}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'ROGOWSKI_NCIT', nameFr: 'Bobine de Rogowski (NCIT di/dt)', nameEn: 'Rogowski Coil (NCIT di/dt)', badge: 'Insaturable > 100 kA' },
                    { id: 'OPTICAL_FARADAY', nameFr: 'Capteur Optique (Effet Faraday)', nameEn: 'Optical Sensor (Faraday Effect)', badge: 'Immunité CEM absolue' },
                    { id: 'CONVENTIONAL_SAMU', nameFr: 'TC/TT Classique + Boîtier SAMU', nameEn: 'Conventional CT/VT + SAMU Box', badge: 'Conversion Cuivre vers Optique' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSvSensorType(s.id as any)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all ${
                        svSensorType === s.id
                          ? 'bg-teal-950/60 border-teal-500 text-white shadow-md shadow-teal-500/10'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{locale === 'fr' ? s.nameFr : s.nameEn}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-teal-300 border border-teal-800">
                          {s.badge}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* SAMPLING FREQUENCY SELECTOR */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block">
                  {locale === 'fr' ? 'Fréquence d\'échantillonnage (CEI 61869-9) :' : 'Sampling Frequency (IEC 61869-9):'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSvSampleRate(4000)}
                    className={`p-2 rounded-xl border font-mono text-xs font-bold text-center transition-all ${
                      svSampleRate === 4000
                        ? 'bg-teal-500 text-slate-950 border-teal-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    4000 Hz (80 éch./pér.)
                    <span className="block text-[10px] font-normal opacity-80">Protection 9-2LE</span>
                  </button>
                  <button
                    onClick={() => setSvSampleRate(12800)}
                    className={`p-2 rounded-xl border font-mono text-xs font-bold text-center transition-all ${
                      svSampleRate === 12800
                        ? 'bg-teal-500 text-slate-950 border-teal-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    12800 Hz (256 éch./pér.)
                    <span className="block text-[10px] font-normal opacity-80">Qualité d\'onde / DFR</span>
                  </button>
                </div>
              </div>

              {/* FAULT INJECTION BUTTON */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setSvFaultActive(!svFaultActive)}
                  className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                    svFaultActive
                      ? 'bg-red-600 hover:bg-red-500 text-white border-red-400 animate-pulse shadow-lg shadow-red-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  {svFaultActive
                    ? (locale === 'fr' ? 'DÉFAUT ACTIF : Court-Circuit 30 kA' : 'FAULT ACTIVE : 30 kA Short-Circuit')
                    : (locale === 'fr' ? 'Injecter Court-Circuit Phase A' : 'Inject Phase A Short-Circuit')}
                </button>
              </div>

              {/* METRICS SUMMARY */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Ethernet Ethertype :</span>
                  <span className="text-teal-400 font-bold">0x88BA (SV)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Multicast MAC :</span>
                  <span className="text-slate-200">01-0C-CD-04-00-01</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Compteur smpCnt :</span>
                  <span className="text-emerald-400 font-bold">{svSmpCnt} / {svSampleRate - 1}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Débit de tranche :</span>
                  <span className="text-amber-400 font-bold">{svSampleRate === 4000 ? '4.80 Mbps' : '15.36 Mbps'}</span>
                </div>
              </div>
            </div>

            {/* LIVE SAMPLE VALUES WAVEFORM & TELEMETRY */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  {locale === 'fr' ? 'Flux Échantillonné Numérique en Temps Réel (Dataset 9-2LE)' : 'Real-Time Digital Sample Stream (9-2LE Dataset)'}
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {locale === 'fr' ? 'Intervalle : 250 μs / échantillon' : 'Interval: 250 μs / sample'}
                </span>
              </div>

              {/* THREE-PHASE INSTANTANEOUS TELEMETRY CARDS */}
              <div className="grid grid-cols-3 gap-3 font-mono">
                {/* PHASE A */}
                <div className={`p-3 rounded-xl border ${svFaultActive ? 'bg-red-950/40 border-red-500' : 'bg-slate-950 border-slate-800'}`}>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Phase A (Ia / Va)</div>
                  <div className={`text-base font-bold ${svFaultActive ? 'text-red-400' : 'text-emerald-400'}`}>
                    {(currentPhaseA / 1000).toFixed(2)} kA
                  </div>
                  <div className="text-xs text-slate-300">
                    {(voltagePhaseA / 1000).toFixed(1)} kV
                  </div>
                  <div className="text-[10px] text-teal-400 mt-1">
                    Quality: {svFaultActive ? '0x2000 (Test)' : '0x0000 (Good)'}
                  </div>
                </div>

                {/* PHASE B */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Phase B (Ib / Vb)</div>
                  <div className="text-base font-bold text-amber-400">
                    {(currentPhaseB / 1000).toFixed(2)} kA
                  </div>
                  <div className="text-xs text-slate-300">
                    {(voltagePhaseB / 1000).toFixed(1)} kV
                  </div>
                  <div className="text-[10px] text-teal-400 mt-1">
                    Quality: 0x0000 (Good)
                  </div>
                </div>

                {/* PHASE C */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Phase C (Ic / Vc)</div>
                  <div className="text-base font-bold text-sky-400">
                    {(currentPhaseC / 1000).toFixed(2)} kA
                  </div>
                  <div className="text-xs text-slate-300">
                    {(voltagePhaseC / 1000).toFixed(1)} kV
                  </div>
                  <div className="text-[10px] text-teal-400 mt-1">
                    Quality: 0x0000 (Good)
                  </div>
                </div>
              </div>

              {/* LIVE OSCILLOSCOPE VISUALIZER */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>Visualiseur d'onde 50 Hz (Échantillons SV interpolés)</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400" /> Ia
                    <span className="w-2 h-2 rounded-full bg-amber-400 ml-2" /> Ib
                    <span className="w-2 h-2 rounded-full bg-sky-400 ml-2" /> Ic
                  </span>
                </div>
                <div className="relative h-44 w-full bg-slate-900/60 rounded-lg border border-slate-800/80 overflow-hidden flex items-center">
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 opacity-15 pointer-events-none">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div key={i} className="border-r border-b border-teal-500" />
                    ))}
                  </div>
                  {/* Phase A wave */}
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 120">
                    {/* Center line */}
                    <line x1="0" y1="60" x2="400" y2="60" stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
                    {/* Wave A */}
                    <path
                      d={`M ${Array.from({ length: 40 }).map((_, i) => {
                        const x = i * 10;
                        const angle = waveAngle + (i * 0.15);
                        const amp = svFaultActive ? 52 : 25;
                        const y = 60 - amp * Math.sin(angle);
                        return `${x},${y}`;
                      }).join(' L ')}`}
                      fill="none"
                      stroke="#f87171"
                      strokeWidth={svFaultActive ? 3 : 2}
                    />
                    {/* Wave B */}
                    <path
                      d={`M ${Array.from({ length: 40 }).map((_, i) => {
                        const x = i * 10;
                        const angle = waveAngle + (i * 0.15) - (2 * Math.PI) / 3;
                        const y = 60 - 25 * Math.sin(angle);
                        return `${x},${y}`;
                      }).join(' L ')}`}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="1.8"
                    />
                    {/* Wave C */}
                    <path
                      d={`M ${Array.from({ length: 40 }).map((_, i) => {
                        const x = i * 10;
                        const angle = waveAngle + (i * 0.15) + (2 * Math.PI) / 3;
                        const y = 60 - 25 * Math.sin(angle);
                        return `${x},${y}`;
                      }).join(' L ')}`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>
              </div>

              {/* PACKET APDU INSPECTOR */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1">
                <div className="text-teal-400 font-bold flex items-center justify-between">
                  <span>CEI 61850-9-2LE APDU Payload Structure</span>
                  <span className="text-slate-500">Ethertype 0x88BA · Size: 148 bytes</span>
                </div>
                <div className="text-slate-300 font-mono break-all bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-amber-400">80 01 01</span> (savPdu) <span className="text-teal-400">82 02 04 12</span> (smpCnt: {svSmpCnt}) <span className="text-emerald-400">85 01 00</span> (smpSynch: Global PTP) <span className="text-sky-400">87 40 [Ia Ib Ic In Va Vb Vc Vn + 8x Quality bitmasks]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PILLAR 2: STATION BUS GOOSE STORM & TELEPROTECTION BENCH (8-1)     */}
      {/* =================================================================== */}
      {activePillar === 'GOOSE_STORM' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* GOOSE EMISSION CONTROLS */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                {locale === 'fr' ? 'Générateur de Déclenchement GOOSE' : 'GOOSE Trip Signal Publisher'}
              </h3>

              <div className="space-y-3">
                <button
                  onClick={handleTriggerGooseTrip}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {locale === 'fr' ? 'PUBLIER ORDRE DÉCLENCHEMENT (TRIP)' : 'PUBLISH TRIP COMMAND BURST'}
                </button>
                <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                  {locale === 'fr'
                    ? 'Déclenche une salve exponentielle t0, 1ms, 2ms, 4ms, 8ms... Incrémente stNum et réinitialise sqNum.'
                    : 'Launches exponential burst t0, 1ms, 2ms, 4ms, 8ms... Increments stNum and resets sqNum.'}
                </p>
              </div>

              {/* NETWORK CONGESTION & STORM SLIDER */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    {locale === 'fr' ? 'Charge Réseau Concurrente :' : 'Background Network Traffic:'}
                  </span>
                  <span className={`font-bold ${bgNetworkTrafficMb > 70 ? 'text-red-400' : 'text-teal-400'}`}>
                    {bgNetworkTrafficMb}% ({bgNetworkTrafficMb * 10} Mbps)
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={bgNetworkTrafficMb}
                  onChange={(e) => setBgNetworkTrafficMb(+e.target.value)}
                  className="w-full accent-teal-400"
                />
              </div>

              {/* IGMP SNOOPING & VLAN QoS TOGGLE */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <div className="text-xs font-mono font-bold text-white">IGMP Snooping & VLAN QoS</div>
                    <div className="text-[10px] font-mono text-slate-400">Priorisation IEEE 802.1p (PCP=6)</div>
                  </div>
                  <button
                    onClick={() => setIgmpSnoopingEnabled(!igmpSnoopingEnabled)}
                    className={`px-3 py-1 rounded-lg font-mono text-xs font-bold border transition-all ${
                      igmpSnoopingEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-red-500/20 text-red-300 border-red-500/40'
                    }`}
                  >
                    {igmpSnoopingEnabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>AppID :</span>
                    <span className="text-teal-300">0x0001 (Trip_Bay1)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Ethertype :</span>
                    <span className="text-amber-400">0x88B8 (GOOSE)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>État stNum actuel :</span>
                    <span className="text-white font-bold">{gooseStNum}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Séquence sqNum :</span>
                    <span className="text-slate-300">{gooseSqNum}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE GOOSE BURST & LATENCY LOG */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-teal-400" />
                  {locale === 'fr' ? 'Journal d\'Analyse des Trames GOOSE en Ligne' : 'Online GOOSE Frame Capture Log'}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                  IEC 61850-5 Type 1A Limit &lt; 3.0 ms
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                      <th className="pb-2">Timestamp / Event</th>
                      <th className="pb-2">Interval</th>
                      <th className="pb-2">stNum / sqNum</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2 text-right">Latency</th>
                      <th className="pb-2 text-right">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {gooseLog.map((pkt, idx) => {
                      const isCompliant = pkt.latencyMs < 3.0;
                      return (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="py-2.5 text-slate-300 font-bold">{pkt.time}</td>
                          <td className="py-2.5 text-slate-400">{pkt.intervalMs} ms</td>
                          <td className="py-2.5 text-teal-300">st={pkt.stNum} / sq={pkt.sqNum}</td>
                          <td className="py-2.5 text-slate-300">{pkt.status}</td>
                          <td className="py-2.5 text-right font-bold text-amber-300">{pkt.latencyMs} ms</td>
                          <td className="py-2.5 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isCompliant
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {isCompliant ? 'PASS < 3ms' : 'LATENCY VIOLATION'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* TECHNICAL PRINCIPLE EXPLANATION */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-1 leading-relaxed">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-400" />
                  {locale === 'fr' ? 'Mécanisme de Retransmission Exponentielle CEI 61850-8-1 :' : 'IEC 61850-8-1 Exponential Retransmission Scheme:'}
                </div>
                <p>
                  {locale === 'fr'
                    ? 'À chaque événement (ordre de déclenchement), le relais émet sans accusé de réception TCP (Layer 2 direct). Pour garantir la réception sans congestionner le bus, il répète la trame avec des intervalles doublés : T0=0ms, T1=1ms, T2=2ms, T3=4ms... jusqu\'à Tmax=1000ms. Si le réseau est sous tempête broadcast sans IGMP Snooping, la file d\'attente du commutateur peut saturer.'
                    : 'Upon any physical event (trip assert), the relay broadcasts raw Ethernet Layer 2 frames with zero TCP ACK overhead. To guarantee delivery without flooding the network, bursts repeat with exponentially doubling intervals: T0=0ms, T1=1ms, T2=2ms, T3=4ms... until steady Tmax=1000ms heartbeat. Without IGMP Snooping, broadcast storms saturate switch buffers.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PILLAR 3: ZERO-RECOVERY NETWORK REDUNDANCY (PRP vs HSR IEC 62439-3) */}
      {/* =================================================================== */}
      {activePillar === 'PRP_HSR_REDUNDANCY' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Network className="w-4 h-4 text-teal-400" />
                  {locale === 'fr' ? 'Architecture Redondante Déterministe CEI 62439-3' : 'IEC 62439-3 Deterministic Redundancy Architecture'}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  {locale === 'fr' ? 'Temps de commutation strictly 0 ms (Zero-Recovery Time) sans aucune perte de trame' : 'Zero-Recovery Time (strictly 0 ms failover) with zero packet drop'}
                </p>
              </div>

              {/* PROTOCOL SELECTOR */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRedundancyProtocol('PRP')}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                    redundancyProtocol === 'PRP'
                      ? 'bg-teal-500 text-slate-950 border-teal-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  PRP (Parallel Redundancy)
                </button>
                <button
                  onClick={() => setRedundancyProtocol('HSR')}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                    redundancyProtocol === 'HSR'
                      ? 'bg-teal-500 text-slate-950 border-teal-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  HSR (Seamless Ring)
                </button>
              </div>
            </div>

            {/* TOPOLOGY INTERACTIVE SCHEMATIC */}
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="text-slate-300 font-bold">
                  {redundancyProtocol === 'PRP'
                    ? (locale === 'fr' ? 'Topologie PRP : Deux LANs Indépendants A & B' : 'PRP Topology: Dual Segregated LAN A & B')
                    : (locale === 'fr' ? 'Topologie HSR : Anneau sans coupure à double sens' : 'HSR Topology: Dual-Direction Seamless Ring')}
                </span>
                <span className="text-emerald-400 font-bold">Failover Downtime = 0.000 ms</span>
              </div>

              {/* PRP DUAL-LAN VIEW */}
              {redundancyProtocol === 'PRP' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {/* LAN A */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    lanAFault ? 'bg-red-950/30 border-red-500/60' : 'bg-slate-900 border-teal-700/60'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${lanAFault ? 'bg-red-500 animate-ping' : 'bg-teal-400'}`} />
                        <span className="font-bold text-white">RESEAU LAN A (Fibre Primaire)</span>
                      </div>
                      <button
                        onClick={() => setLanAFault(!lanAFault)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                          lanAFault ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' : 'bg-red-500/20 text-red-300 border-red-500'
                        }`}
                      >
                        {lanAFault ? 'Rétablir Fibre A' : 'Sectionner Fibre A'}
                      </button>
                    </div>
                    <div className="mt-3 space-y-1 text-slate-400 text-[11px]">
                      <div>Statut de liaison : <span className={lanAFault ? 'text-red-400 font-bold' : 'text-emerald-400'}>{lanAFault ? 'ROMPU / DOWN' : 'ACTIF / UP'}</span></div>
                      <div>Remorque RCT LanID : <span className="text-teal-300">0xA (LAN A)</span></div>
                      <div>Trames reçues A : <span className="text-white font-bold">{prpPacketsRcvA.toLocaleString()}</span></div>
                    </div>
                  </div>

                  {/* LAN B */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    lanBFault ? 'bg-red-950/30 border-red-500/60' : 'bg-slate-900 border-teal-700/60'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${lanBFault ? 'bg-red-500 animate-ping' : 'bg-teal-400'}`} />
                        <span className="font-bold text-white">RESEAU LAN B (Fibre Secondaire)</span>
                      </div>
                      <button
                        onClick={() => setLanBFault(!lanBFault)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                          lanBFault ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' : 'bg-red-500/20 text-red-300 border-red-500'
                        }`}
                      >
                        {lanBFault ? 'Rétablir Fibre B' : 'Sectionner Fibre B'}
                      </button>
                    </div>
                    <div className="mt-3 space-y-1 text-slate-400 text-[11px]">
                      <div>Statut de liaison : <span className={lanBFault ? 'text-red-400 font-bold' : 'text-emerald-400'}>{lanBFault ? 'ROMPU / DOWN' : 'ACTIF / UP'}</span></div>
                      <div>Remorque RCT LanID : <span className="text-teal-300">0xB (LAN B)</span></div>
                      <div>Trames reçues B : <span className="text-white font-bold">{prpPacketsRcvB.toLocaleString()}</span></div>
                    </div>
                  </div>
                </div>
              ) : (
                /* HSR RING VIEW */
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">Anneau HSR Déterminé (Ports A et B sur chaque DANH)</span>
                    <button
                      onClick={() => setRingNode3Cut(!ringNode3Cut)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                        ringNode3Cut ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' : 'bg-red-500/20 text-red-300 border-red-500'
                      }`}
                    >
                      {ringNode3Cut ? 'Réparer Brin Optique Anneau' : 'Couper Brin Optique Nœud 3'}
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                    {ringNode3Cut
                      ? 'L\'anneau HSR est ouvert en topologie ligne : les trames circulent jusqu\'à la rupture et sont reçues via le sens opposé sans aucun paquet perdu. Le protocole Duplicate Discard supprime la seconde copie.'
                      : 'L\'anneau HSR est complet : chaque trame circule simultanément en sens horaire et anti-horaire. Le nœud émetteur supprime la trame après un tour complet.'}
                  </div>
                </div>
              )}

              {/* DUPLICATE DISCARD PERFORMANCE BENCHMARK */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Trames Émises Total</div>
                  <div className="text-base font-bold text-white">{prpPacketsSent.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Doublons Éliminés</div>
                  <div className="text-base font-bold text-teal-400">{prpDuplicatesDiscarded.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Pertes de Trames</div>
                  <div className="text-base font-bold text-emerald-400">0 (0.00%)</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Temps Reconfig vs RSTP</div>
                  <div className="text-base font-bold text-amber-400">0 ms (vs 2500 ms)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PILLAR 4: PRECISION TIME PROTOCOL IEEE 1588v2 & PTP GRANDMASTER    */}
      {/* =================================================================== */}
      {activePillar === 'PTP_IEEE1588' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PTP CLOCK CONTROLS */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                {locale === 'fr' ? 'Horloge Grandmaster PTP' : 'PTP Grandmaster Clock'}
              </h3>

              {/* GM MODE SELECTOR */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block">
                  {locale === 'fr' ? 'État de Verrouillage de l\'Horloge Mère :' : 'Grandmaster Lock State:'}
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'LOCKED_GNSS', labelFr: 'Verrouillé GNSS / GPS (Stratum 1)', labelEn: 'GNSS / GPS Locked (Stratum 1)' },
                    { id: 'HOLDOVER_RUBIDIUM', labelFr: 'Holdover Rubidium Atomique (< 1 μs / 24h)', labelEn: 'Rubidium Atomic Holdover (< 1 μs / 24h)' },
                    { id: 'HOLDOVER_OCXO', labelFr: 'Holdover Quartz OCXO (< 1 μs / 4h)', labelEn: 'OCXO Crystal Holdover (< 1 μs / 4h)' },
                    { id: 'FREERUN_DRIFT', labelFr: 'Quartz Non Compensé (Dérive forte)', labelEn: 'Uncompensated Free Run (Rapid Drift)' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPtpGmState(m.id as any)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs font-mono transition-all ${
                        ptpGmState === m.id
                          ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-md shadow-teal-500/10'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {locale === 'fr' ? m.labelFr : m.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* HOLDOVER DURATION SLIDER */}
              {ptpGmState !== 'LOCKED_GNSS' && (
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">
                      {locale === 'fr' ? 'Durée de Perte Signal GPS :' : 'GNSS Signal Loss Duration:'}
                    </span>
                    <span className="text-amber-400 font-bold">{ptpHoldoverHours} h</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={ptpHoldoverHours}
                    onChange={(e) => setPtpHoldoverHours(+e.target.value)}
                    className="w-full accent-teal-400"
                  />
                </div>
              )}

              {/* PTP PROFILE SPEC */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Profil Normalisé :</span>
                  <span className="text-teal-300 font-bold">IEC 61850-9-3</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Domaine PTP :</span>
                  <span className="text-slate-200">Domain 0 (Power Utility)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Fréquence Sync :</span>
                  <span className="text-emerald-400 font-bold">1 paquet / seconde</span>
                </div>
              </div>
            </div>

            {/* PTP DRIFT ANALYSIS & PROTECTION IMPACT */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  {locale === 'fr' ? 'Bilan de Dérive Temporelle & Impact Protection Différentielle' : 'Time Drift Analysis & Differential Protection Stability'}
                </h3>
                <span className={`text-xs font-mono px-2 py-0.5 rounded border font-bold ${
                  calculatedDriftNs <= 1000
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}>
                  {calculatedDriftNs <= 1000 ? 'CONFORME CEI (< 1 μs)' : 'NON-CONFORME (> 1 μs)'}
                </span>
              </div>

              {/* DRIFT GAUGES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Dérive Cumulée Δt</div>
                  <div className={`text-xl font-bold ${calculatedDriftNs <= 1000 ? 'text-teal-400' : 'text-red-400'}`}>
                    {calculatedDriftNs} ns
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {(calculatedDriftNs / 1000).toFixed(3)} μs
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Erreur Angulaire 50 Hz</div>
                  <div className="text-xl font-bold text-amber-400">
                    {phaseAngleErrorDeg}°
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Δθ = 360° × 50 Hz × Δt
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Stabilité Relais 87B / 87T</div>
                  <div className={`text-base font-bold ${+phaseAngleErrorDeg < 0.05 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {+phaseAngleErrorDeg < 0.05 ? 'STABLE' : 'RISQUE DÉCLENCHEMENT'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {+phaseAngleErrorDeg < 0.05 ? 'Marge > 98%' : 'Courant fictif induit'}
                  </div>
                </div>
              </div>

              {/* TECHNICAL PRINCIPLE EXPLANATION */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-2 leading-relaxed">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-400" />
                  {locale === 'fr' ? 'Pourquoi la Précision sub-microseconde est Cruciale ?' : 'Why Sub-Microsecond Accuracy is Mandatory:'}
                </div>
                <p>
                  {locale === 'fr'
                    ? 'Dans une protection différentielle de barre 87B ou de ligne 87L numérisée via bus de processus (Sampled Values), le relais compare les phases des courants à chaque instant. Une erreur temporelle de 1 μs correspond à 0.018° à 50 Hz, ce qui est négligeable. En revanche, une dérive de 100 μs (1.8°) ou 1 ms (18°) crée un courant différentiel artificiel gigantesque lors d\'un court-circuit externe traversant, provoquant le déclenchement intempestif de tout le poste !'
                    : 'Inside digital busbar (87B) or line (87L) differential protections fed by Sampled Values, relays compute phasor sums across bay nodes. A 1 μs time skew introduces a negligible 0.018° phase offset at 50 Hz. Conversely, a 100 μs (1.8°) or 1 ms (18°) clock drift generates massive spurious differential current during severe external through-faults, falsely tripping entire high-voltage substations!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PILLAR 5: WAN OPTICAL LINK BUDGET & OPGW DISPERSION SOLVER (G.652) */}
      {/* =================================================================== */}
      {activePillar === 'OPGW_LINK_BUDGET' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* OPGW LINK PARAMETERS */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" />
                {locale === 'fr' ? 'Paramètres de la Liaison OPGW' : 'OPGW Optical Link Inputs'}
              </h3>

              {/* LINE LENGTH SLIDER */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">{locale === 'fr' ? 'Longueur de Ligne HTB :' : 'HV Line Corridor Length:'}</span>
                  <span className="text-teal-400 font-bold">{opgwLineLengthKm} km</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="250"
                  value={opgwLineLengthKm}
                  onChange={(e) => {
                    const len = +e.target.value;
                    setOpgwLineLengthKm(len);
                    setSpliceCount(Math.round(len / 3)); // ~1 splice every 3 km drum
                  }}
                  className="w-full accent-teal-400"
                />
              </div>

              {/* WAVELENGTH SELECTOR */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block">
                  {locale === 'fr' ? 'Longueur d\'onde Optique :' : 'Optical Wavelength:'}
                </label>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <button
                    onClick={() => setOpticalWavelength(1310)}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      opticalWavelength === 1310
                        ? 'bg-teal-500 text-slate-950 border-teal-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    1310 nm (0.35 dB/km)
                  </button>
                  <button
                    onClick={() => setOpticalWavelength(1550)}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      opticalWavelength === 1550
                        ? 'bg-teal-500 text-slate-950 border-teal-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    1550 nm (0.20 dB/km)
                  </button>
                </div>
              </div>

              {/* SFP TRANSCEIVER POWER SETTINGS */}
              <div className="space-y-3 pt-3 border-t border-slate-800 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Puissance Émetteur (Tx) :</span>
                  <span className="text-white font-bold">{txOpticalPowerDbm} dBm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sensibilité Récepteur (Rx) :</span>
                  <span className="text-white font-bold">{rxSensitivityDbm} dBm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Marge de vieillissement :</span>
                  <span className="text-amber-400 font-bold">{agingMarginDb} dB</span>
                </div>
              </div>
            </div>

            {/* OPTICAL POWER BUDGET CALCULATION & VERDICT */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  {locale === 'fr' ? 'Résultats du Bilan d\'Affaiblissement (ITU-T G.652D)' : 'Optical Power Budget Solver (ITU-T G.652D)'}
                </h3>
                <span className={`text-xs font-mono px-2.5 py-1 rounded font-bold border ${
                  isOpticalLinkViable
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}>
                  {isOpticalLinkViable ? 'LIAISON VIABLE (MARGE POSITIVE)' : 'ATTÉNUATION EXCESSIVE (AMPLIFICATEUR REQUIS)'}
                </span>
              </div>

              {/* FORMULA BREAKDOWN */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                <div className="text-teal-400 font-bold">
                  A_total = (α × L) + (N_épissures × A_épissure) + (N_connecteurs × A_conn) + Marge_sécurité
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Atténuation Fibre</span>
                    <span className="font-bold text-white">{fiberLoss} dB</span> ({opgwLineLengthKm} km × {fiberAttenuationCoeff})
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Pertes Épissures</span>
                    <span className="font-bold text-white">{totalSpliceLoss} dB</span> ({spliceCount} × 0.05 dB)
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Connecteurs Patch</span>
                    <span className="font-bold text-white">{totalConnectorLoss} dB</span> ({connectorCount} × 0.25 dB)
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Marge Sécurité</span>
                    <span className="font-bold text-amber-400">{agingMarginDb} dB</span>
                  </div>
                </div>
              </div>

              {/* TOTAL ATTENUATION VS BUDGET */}
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Affaiblissement Total</div>
                  <div className="text-xl font-bold text-red-400">{totalLinkAttenuationDb} dB</div>
                  <div className="text-[10px] text-slate-500">Pertes de ligne cumulées</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Budget Optique Dispo</div>
                  <div className="text-xl font-bold text-teal-400">{totalLinkBudgetDb} dB</div>
                  <div className="text-[10px] text-slate-500">Tx - Rx Sensitivity</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Marge Nette de Liaison</div>
                  <div className={`text-xl font-bold ${opticalMarginDb >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                    {opticalMarginDb > 0 ? `+${opticalMarginDb}` : opticalMarginDb} dB
                  </div>
                  <div className="text-[10px] text-slate-500">Marge résiduelle réelle</div>
                </div>
              </div>

              {/* CAMEROON CONTEXT NOTE */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400">
                <span className="text-teal-400 font-bold">Cas Concret SONATREL : </span>
                La ligne 225 kV Mangombé - Oyomabang (115 km) exploite un câble OPGW 48 fibres G.652D avec des émetteurs SFP+ 1550 nm (budget 32 dB), garantissant une marge de sécurité de +3.9 dB sous forte humidité équatoriale.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PILLAR 6: POWER LINE CARRIER (CPL / PLC) & LINE TRAP COUPLING     */}
      {/* =================================================================== */}
      {activePillar === 'PLC_LINE_TRAP' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PLC CONTROLS */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-teal-400" />
                {locale === 'fr' ? 'Paramètres Courants Porteurs (CPL)' : 'Power Line Carrier (PLC) Setup'}
              </h3>

              {/* CARRIER FREQUENCY SLIDER */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">{locale === 'fr' ? 'Fréquence Porteuse HF :' : 'Carrier Frequency (HF):'}</span>
                  <span className="text-teal-400 font-bold">{plcFrequencyKhz} kHz</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="500"
                  value={plcFrequencyKhz}
                  onChange={(e) => setPlcFrequencyKhz(+e.target.value)}
                  className="w-full accent-teal-400"
                />
              </div>

              {/* LINE TRAP INDUCTANCE */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">{locale === 'fr' ? 'Inductance Self d\'Arrêt :' : 'Line Trap Inductance (L):'}</span>
                  <span className="text-amber-400 font-bold">{lineTrapInductanceMh} mH</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={lineTrapInductanceMh}
                  onChange={(e) => setLineTrapInductanceMh(+e.target.value)}
                  className="w-full accent-amber-400"
                />
              </div>

              {/* CCVT CAPACITANCE */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">{locale === 'fr' ? 'Capacité TTPC / CCVT :' : 'Coupling Capacitor (CCVT):'}</span>
                  <span className="text-sky-400 font-bold">{ccvtCapacitancePf} pF</span>
                </div>
                <input
                  type="range"
                  min="4000"
                  max="10000"
                  step="200"
                  value={ccvtCapacitancePf}
                  onChange={(e) => setCcvtCapacitancePf(+e.target.value)}
                  className="w-full accent-sky-400"
                />
              </div>
            </div>

            {/* PLC SCHEMATIC & IMPEDANCE SOLVER */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Waves className="w-4 h-4 text-emerald-400" />
                  {locale === 'fr' ? 'Banc de Couplage Haute Fréquence HTB' : 'High-Voltage RF Coupling Analysis'}
                </h3>
                <span className={`text-xs font-mono px-2.5 py-1 rounded font-bold border ${
                  lineTrapIsCompliant
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}>
                  {lineTrapIsCompliant ? 'BLOCAGE CONFORME (> 400 Ω)' : 'BLOCAGE INSUFFISANT'}
                </span>
              </div>

              {/* COUPLING CHAIN SCHEMATIC */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
                <div className="text-slate-300 font-bold">Schéma de la Chaîne de Couplage CPL HTB :</div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] overflow-x-auto gap-2">
                  <div className="p-2 rounded bg-slate-800 text-center shrink-0">
                    <div className="text-teal-400 font-bold">Émetteur CPL</div>
                    <div className="text-slate-400">75 Ω Coaxial</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                  <div className="p-2 rounded bg-slate-800 text-center shrink-0">
                    <div className="text-amber-400 font-bold">Boîte d'Accord LMU</div>
                    <div className="text-slate-400">Adaptation 75 → 400 Ω</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                  <div className="p-2 rounded bg-slate-800 text-center shrink-0">
                    <div className="text-sky-400 font-bold">TTPC / CCVT ({ccvtCapacitancePf} pF)</div>
                    <div className="text-slate-400">Zc = {ccvtImpedance} Ω</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                  <div className="p-2 rounded bg-slate-800 text-center shrink-0">
                    <div className="text-emerald-400 font-bold">Ligne 225 kV</div>
                    <div className="text-slate-400">Guide d'onde HF</div>
                  </div>
                  <div className="p-2 rounded bg-red-950/60 border border-red-500/40 text-center shrink-0">
                    <div className="text-red-400 font-bold">Self d'Arrêt ({lineTrapInductanceMh} mH)</div>
                    <div className="text-slate-400">Z_LT = {lineTrapImpedance} Ω (Blocage)</div>
                  </div>
                </div>
              </div>

              {/* IMPEDANCE VALUES CARDS */}
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Impédance de Blocage Self (Z_LT)</div>
                  <div className={`text-xl font-bold ${lineTrapIsCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                    {lineTrapImpedance} Ω
                  </div>
                  <div className="text-[10px] text-slate-500">Z_LT = 2π × f × L (Atténuation &gt; 26 dB vers le jeu de barres)</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Impédance Série CCVT (Z_C)</div>
                  <div className="text-xl font-bold text-sky-400">
                    {ccvtImpedance} Ω
                  </div>
                  <div className="text-[10px] text-slate-500">Z_C = 1 / (2π × f × C) (Passe-haut HF vers la ligne)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* PILLAR 7: CAMEROON TELECOM INFRASTRUCTURE & FORENSIC GRID INCIDENTS */}
      {/* =================================================================== */}
      {activePillar === 'CAMEROON_TELECOM' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CASE STUDIES SELECTOR */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-400" />
                {locale === 'fr' ? 'Cas d\'Ingénierie & Incidents' : 'Case Studies & Incident Reports'}
              </h3>

              <div className="space-y-2">
                {[
                  { id: 'CASE_OPGW_SONATREL', titleFr: 'Dorsale OPGW SONATREL (2500+ km)', titleEn: 'SONATREL National OPGW Backbone' },
                  { id: 'CASE_87L_ASYMMETRY', titleFr: 'Incident Asymétrie Téléprotection 87L', titleEn: '87L Teleprotection Fiber Asymmetry Trip' },
                  { id: 'CASE_ENEO_RADIO_LTE', titleFr: 'Téléconduite Radio VHF/UHF & LTE Eneo', titleEn: 'Eneo Urban VHF/UHF & APN LTE Telecontrol' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id as any)}
                    className={`w-full p-3 rounded-xl border text-left font-mono text-xs transition-all ${
                      selectedCaseId === c.id
                        ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-md shadow-teal-500/10'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {locale === 'fr' ? c.titleFr : c.titleEn}
                  </button>
                ))}
              </div>
            </div>

            {/* CASE DETAIL VIEW */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              {selectedCaseId === 'CASE_OPGW_SONATREL' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-sm font-bold text-white">Dorsale Nationale OPGW SONATREL (Cameroun)</span>
                    <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 text-[10px]">
                      225 kV / 90 kV · 48 Fibres G.652D
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    La dorsale OPGW de SONATREL interconnecte les grands centres de production (Nachtigal 420 MW, Songloulou 384 MW, Édéa 276 MW) avec le Centre National de Conduite de Mangombé et les métropoles de Yaoundé (Nyom 2, Oyomabang), Douala (Bekoko, Logbaba, Deido) et Bafoussam.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                    <div className="text-teal-400 font-bold">Services Critiques Transportés :</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      <li>Téléconduite SCADA CEI 60870-5-104 vers le dispatching de Mangombé</li>
                      <li>Téléprotection différentielle de ligne 87L ultra-rapide (&lt; 5 ms)</li>
                      <li>Téléphonie d'exploitation VoIP prioritaire et visioconférence de crise</li>
                      <li>Location de brins de fibres optiques noirs excédentaires aux opérateurs télécoms</li>
                    </ul>
                  </div>
                </div>
              )}

              {selectedCaseId === 'CASE_87L_ASYMMETRY' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-sm font-bold text-red-400">Analyse Forensic : Déclenchement Intempestif 87L par Asymétrie Optique</span>
                    <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px]">
                      Δt_asym &gt; 1.5 ms
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Lors d'une coupure de câble OPGW sur une ligne 225 kV, le réseau de transmission optique SDH/MPLS a automatiquement basculé le canal de transmission aller (Tx) sur un trajet alternatif de secours (145 km) tandis que le canal retour (Rx) restait sur la route directe (55 km).
                  </p>
                  <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 space-y-2 text-[11px] text-slate-300">
                    <div className="text-red-400 font-bold">Mécanisme de Défaillance :</div>
                    <p>
                      La protection différentielle de ligne 87L assume par défaut un temps de propagation symétrique : t_aller = t_retour = RTT / 2. L'asymétrie de 1.7 ms a faussé le calcul de recalage temporel des phaseurs de courant mesurés aux deux extrémités, faisant apparaître un déphasage de 30° en pleine charge nominale (1200 A) et déclenchant la ligne saine !
                    </p>
                    <div className="text-emerald-400 font-bold pt-1">Contre-Mesure Imposée :</div>
                    <p>
                      Interdiction du reroutage asymétrique dynamique pour les flux 87L; obligation d'utiliser la synchronisation externe par horloges GPS/IEEE 1588 PTP à chaque extrémité de la ligne HTB.
                    </p>
                  </div>
                </div>
              )}

              {selectedCaseId === 'CASE_ENEO_RADIO_LTE' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-sm font-bold text-white">Téléconduite Distribution MT 30 kV Eneo (VHF/UHF & APN LTE Privé)</span>
                    <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 text-[10px]">
                      DMS / ADMS Douala & Yaoundé
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Pour télécommander les centaines d'interrupteurs aériens télécommandés (IACM) et réenclencheurs en réseau de distribution 30 kV, Eneo combine un réseau radio VHF/UHF propriétaire et des liaisons cellulaires 4G LTE avec APN privé sécurisé et cartes SIM M2M industrielles.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                    <div className="text-teal-400 font-bold">Performances du Système :</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      <li>Temps d'exécution d'une télécommande d'ouverture/fermeture : &lt; 2.5 secondes</li>
                      <li>Taux de disponibilité des liaisons radio en milieu urbain : &gt; 99.2%</li>
                      <li>Isolement automatique des défauts câbles par automatisme FLISR en moins de 3 minutes</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
