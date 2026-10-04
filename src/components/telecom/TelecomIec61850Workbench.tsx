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
  ExternalLink,
  BookOpen,
  Calculator,
  X,
  FileSpreadsheet
} from 'lucide-react';

import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';
import { TelecomOrientationBanner } from './TelecomOrientationBanner';
import {
  TelecomCommandHeader,
  type TelecomScenarioKey,
  TELECOM_SCENARIO_PROFILES
} from './TelecomCommandHeader';
import { TelecomDqeBoqEngine } from './modules/TelecomDqeBoqEngine';

interface TelecomIec61850WorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (id: string) => void;
}

export const TelecomIec61850Workbench: React.FC<TelecomIec61850WorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  const isFr = locale === 'fr';

  // =========================================================================
  // 5-STAGE PROGRESSIVE SIZING ENGINE & SCENARIO STATE
  // =========================================================================
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<TelecomScenarioKey>('MANGOMBE_225KV_DIGITAL_SUB');
  const [isFormulasModalOpen, setIsFormulasModalOpen] = useState<boolean>(false);

  // Sub-tabs for compound stages
  const [stage2SubTab, setStage2SubTab] = useState<'GOOSE' | 'PRP_HSR'>('GOOSE');
  const [stage4SubTab, setStage4SubTab] = useState<'OPGW' | 'PLC'>('OPGW');
  const [stage5SubTab, setStage5SubTab] = useState<'CASES' | 'BOQ_DQE'>('CASES');

  // =========================================================================
  // STAGE 1: SUBSTATION PROCESS BUS & SAMPLED VALUES (IEC 61850-9-2LE / 61869-9)
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
  // STAGE 2A: STATION BUS GOOSE STORM & TELEPROTECTION BENCH (IEC 61850-8-1)
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

  const latestGooseLatency = gooseLog[0]?.latencyMs || 0.85;

  // =========================================================================
  // STAGE 2B: ZERO-RECOVERY NETWORK REDUNDANCY (PRP vs HSR per IEC 62439-3)
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
  // STAGE 3: PRECISION TIME PROTOCOL IEEE 1588v2 & PTP GRANDMASTER
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
  // STAGE 4A: WAN OPTICAL LINK BUDGET & OPGW DISPERSION SOLVER (ITU-T G.652D)
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
  // STAGE 4B: POWER LINE CARRIER (CPL / PLC) & LINE TRAP HIGH-FREQUENCY COUPLER
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
  // STAGE 5A: CAMEROON TELECOM INFRASTRUCTURE & FORENSIC GRID INCIDENTS
  // =========================================================================
  const [selectedCaseId, setSelectedCaseId] = useState<'CASE_OPGW_SONATREL' | 'CASE_87L_ASYMMETRY' | 'CASE_ENEO_RADIO_LTE'>('CASE_OPGW_SONATREL');

  // Handle Scenario Profile Switching
  const handleSelectScenario = (key: TelecomScenarioKey) => {
    setSelectedScenarioKey(key);
    const profile = TELECOM_SCENARIO_PROFILES[key];
    setOpgwLineLengthKm(profile.defaultLineLengthKm);
    setOpticalWavelength(profile.defaultWavelength);
    setSpliceCount(profile.defaultSpliceCount);
    setPtpGmState(profile.defaultPtpClock);
    setRedundancyProtocol(profile.defaultRedundancy);
    setSvSampleRate(profile.defaultSampleRate);

    if (key === 'MANGOMBE_225KV_DIGITAL_SUB') {
      setActiveStage(1);
      setSelectedCaseId('CASE_OPGW_SONATREL');
    } else if (key === 'OPGW_WAN_MANGOMBE_OYOMABANG') {
      setActiveStage(4);
      setStage4SubTab('OPGW');
      setSelectedCaseId('CASE_87L_ASYMMETRY');
    } else if (key === 'ENEO_DISTRIBUTION_SCADA_LTE') {
      setActiveStage(5);
      setSelectedCaseId('CASE_ENEO_RADIO_LTE');
    }
  };

  const activeStageTitle = useMemo(() => {
    if (activeStage === 1) return isFr ? 'Étape 1 : Bus de Processus & SV 9-2LE' : 'Stage 1: Process Bus & SV 9-2LE';
    if (activeStage === 2) return isFr ? 'Étape 2 : Bus de Poste GOOSE & PRP/HSR' : 'Stage 2: Station Bus GOOSE & PRP/HSR';
    if (activeStage === 3) return isFr ? 'Étape 3 : Synchronisation PTP IEEE 1588' : 'Stage 3: IEEE 1588 PTP Time Sync';
    if (activeStage === 4) return isFr ? 'Étape 4 : Dorsales WAN OPGW & CPL' : 'Stage 4: Grid WAN OPGW & PLC';
    return isFr ? 'Étape 5 : Références Terrain & Chiffrage DQE' : 'Stage 5: Field Cases & Stamped BOQ';
  }, [activeStage, isFr]);

  return (
    <div className="w-full space-y-6 text-[#e8eaf0] font-sans pb-16">
      
      {/* 0. AUTHORITATIVE ECOSYSTEM HERO (SUBSTATION & TELECOM DIGITAL TWIN) */}
      <AuthoritativeEcosystemHero
        stage="substation"
        locale={locale}
        onNavigateToDomain={(dCode) => onNavigate?.('domain', dCode)}
        onSelectEquipment={onSelectEquipment}
        activePillarLabel={activeStageTitle}
        totalPillarsCount={5}
      />

      {/* 1. EXECUTIVE FIRST-VIEW ORIENTATION BANNER (THE 7 FUNDAMENTAL QUESTIONS) */}
      <TelecomOrientationBanner
        locale={locale}
        onNavigateStage={(st) => setActiveStage(st)}
        onNavigateDomain={(dCode) => onNavigate?.('domain', dCode)}
      />

      {/* 2. COMMAND HEADER HUD & 5-STAGE PROGRESSIVE SIZING ENGINE */}
      <TelecomCommandHeader
        locale={locale}
        activeStage={activeStage}
        onSelectStage={(st) => setActiveStage(st)}
        selectedScenarioKey={selectedScenarioKey}
        onSelectScenario={handleSelectScenario}
        onOpenFormulasModal={() => setIsFormulasModalOpen(true)}
        onOpenDossier={() => { setActiveStage(5); setStage5SubTab('BOQ_DQE'); }}
        gooseLatencyMs={latestGooseLatency}
        ptpDriftNs={calculatedDriftNs}
      />

      {/* =================================================================== */}
      {/* STAGE 1: SUBSTATION PROCESS BUS & SAMPLED VALUES (IEC 61850-9-2LE) */}
      {/* =================================================================== */}
      {activeStage === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CONTROLS CARD */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Waves className="w-4 h-4 text-teal-400" />
                  {isFr ? 'Configuration Merging Unit (MU)' : 'Merging Unit (MU) Setup'}
                </h3>
                <button
                  onClick={() => setSvSimRunning(!svSimRunning)}
                  className={`p-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1 ${
                    svSimRunning ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {svSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {svSimRunning ? (isFr ? 'Actif' : 'Running') : (isFr ? 'Pause' : 'Paused')}
                </button>
              </div>

              {/* SENSOR TECHNOLOGY SELECTOR */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block">
                  {isFr ? 'Technologie de Capteur HTB :' : 'HV Instrument Sensor Type:'}
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
                        <span>{isFr ? s.nameFr : s.nameEn}</span>
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
                  {isFr ? 'Fréquence d\'échantillonnage (CEI 61869-9) :' : 'Sampling Frequency (IEC 61869-9):'}
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
                    <span className="block text-[10px] font-normal opacity-80">Qualité d'onde / DFR</span>
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
                    ? (isFr ? 'DÉFAUT ACTIF : Court-Circuit 30 kA' : 'FAULT ACTIVE : 30 kA Short-Circuit')
                    : (isFr ? 'Injecter Court-Circuit Phase A' : 'Inject Phase A Short-Circuit')}
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
                  {isFr ? 'Flux Échantillonné Numérique en Temps Réel (Dataset 9-2LE)' : 'Real-Time Digital Sample Stream (9-2LE Dataset)'}
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {isFr ? 'Intervalle : 250 μs / échantillon' : 'Interval: 250 μs / sample'}
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
                </div>

                {/* PHASE B */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Phase B (Ib / Vb)</div>
                  <div className="text-base font-bold text-emerald-400">
                    {(currentPhaseB / 1000).toFixed(2)} kA
                  </div>
                  <div className="text-xs text-slate-300">
                    {(voltagePhaseB / 1000).toFixed(1)} kV
                  </div>
                </div>

                {/* PHASE C */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Phase C (Ic / Vc)</div>
                  <div className="text-base font-bold text-emerald-400">
                    {(currentPhaseC / 1000).toFixed(2)} kA
                  </div>
                  <div className="text-xs text-slate-300">
                    {(voltagePhaseC / 1000).toFixed(1)} kV
                  </div>
                </div>
              </div>

              {/* DYNAMIC SVG WAVEFORM DISPLAY */}
              <div className="h-44 w-full bg-slate-950 rounded-xl border border-slate-800 p-2 relative overflow-hidden flex flex-col justify-center">
                <svg className="w-full h-full" viewBox="0 0 600 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e293b" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="75" x2="600" y2="75" stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="0" y1="25" x2="600" y2="25" stroke="#1e293b" strokeDasharray="2 2" strokeWidth="1" />
                  <line x1="0" y1="125" x2="600" y2="125" stroke="#1e293b" strokeDasharray="2 2" strokeWidth="1" />

                  {/* Phase A Curve */}
                  <path
                    d={Array.from({ length: 120 }, (_, i) => {
                      const x = i * 5;
                      const a = waveAngle + (i * 0.1);
                      const amp = svFaultActive ? 65 : 35;
                      const y = 75 - Math.sin(a) * amp;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke={svFaultActive ? '#ef4444' : '#10b981'}
                    strokeWidth={svFaultActive ? '2.5' : '1.5'}
                  />

                  {/* Phase B Curve */}
                  <path
                    d={Array.from({ length: 120 }, (_, i) => {
                      const x = i * 5;
                      const a = waveAngle - (2 * Math.PI) / 3 + (i * 0.1);
                      const y = 75 - Math.sin(a) * 35;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                  />

                  {/* Phase C Curve */}
                  <path
                    d={Array.from({ length: 120 }, (_, i) => {
                      const x = i * 5;
                      const a = waveAngle + (2 * Math.PI) / 3 + (i * 0.1);
                      const y = 75 - Math.sin(a) * 35;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                  />
                </svg>

                <div className="absolute bottom-2 right-3 flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Phase A
                  </span>
                  <span className="flex items-center gap-1 text-sky-400">
                    <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> Phase B
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Phase C
                  </span>
                </div>
              </div>

              {/* RAW ETHERNET FRAME INSPECTOR (HEX & DECODED ASN.1 BER) */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-teal-400 font-bold">
                    <Terminal className="w-3.5 h-3.5" />
                    {isFr ? 'Inspecteur de Trame SV (IEC 61850-9-2LE / ASN.1 BER)' : 'SV Frame Inspector (IEC 61850-9-2LE / ASN.1 BER)'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    VLAN ID: 0 | PCP: {svVlanPriority}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
                  <div className="text-slate-500">
                    // Header: DestMAC[01:0C:CD:04:00:01] SrcMAC[00:1E:C0:A4:91:20] TPID[8100] TCI[8000] EtherType[88BA]
                  </div>
                  <div className="text-teal-300">
                    APPID: <span className="text-white font-bold">0x4000</span> | Length: <span className="text-white">128 octets</span> | Reserved1: 0x0000 | Reserved2: 0x0000
                  </div>
                  <div className="text-emerald-400">
                    savPdu [Tag 0x60] -&gt; noASDU: 1 | asdu [Tag 0x30] -&gt; svID: &quot;EDEA_225_MU01&quot; | smpCnt: {svSmpCnt} | confRev: 1
                  </div>
                  <div className="text-amber-300">
                    Dataset Values: Ia={(currentPhaseA / 1000).toFixed(2)}kA (q=0x0000) | Ib={(currentPhaseB / 1000).toFixed(2)}kA (q=0x0000) | Ic={(currentPhaseC / 1000).toFixed(2)}kA (q=0x0000)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 2: STATION BUS, GOOSE BURST STORM & PRP/HSR REDUNDANCY        */}
      {/* =================================================================== */}
      {activeStage === 2 && (
        <div className="space-y-6">
          {/* SUB-STAGE SELECTOR TABS */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setStage2SubTab('GOOSE')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage2SubTab === 'GOOSE'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <Zap className="w-4 h-4" />
              {isFr ? '2A : Trames GOOSE & Télé-déclenchement (< 3 ms)' : '2A: GOOSE Frames & Teleprotection (< 3 ms)'}
            </button>
            <button
              onClick={() => setStage2SubTab('PRP_HSR')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage2SubTab === 'PRP_HSR'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <Network className="w-4 h-4" />
              {isFr ? '2B : Redondance LAN Zéro-Coupure PRP / HSR (CEI 62439-3)' : '2B: Zero-Recovery PRP / HSR LAN Redundancy (IEC 62439-3)'}
            </button>
          </div>

          {/* 2A: GOOSE BENCH */}
          {stage2SubTab === 'GOOSE' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* TRIGGER & NETWORK TRAFFIC CONTROLS */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  {isFr ? 'Générateur de Télé-déclenchement GOOSE' : 'GOOSE Trip Command Generator'}
                </h3>

                {/* TRIP INJECTION */}
                <div className="space-y-2">
                  <button
                    onClick={handleTriggerGooseTrip}
                    className="w-full py-4 rounded-xl font-mono text-sm font-black bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5 fill-slate-950" />
                    {isFr ? 'ÉMETTRE ORDRE TRIP GOOSE (stNum++)' : 'TRANSMIT GOOSE TRIP ORDER (stNum++)'}
                  </button>
                  <p className="text-[11px] text-slate-400 font-mono text-center">
                    {isFr ? 'Conforme CEI 61850-8-1 : Temps de transfert classe TT6 < 3 ms' : 'Compliant with IEC 61850-8-1: Transfer time class TT6 < 3 ms'}
                  </p>
                </div>

                {/* TRAFFIC LOAD SLIDER */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">{isFr ? 'Trafic de fond sur le Switch :' : 'Background Switch Load:'}</span>
                    <span className="text-amber-400 font-bold">{bgNetworkTrafficMb}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={bgNetworkTrafficMb}
                    onChange={(e) => setBgNetworkTrafficMb(+e.target.value)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>

                {/* IGMP SNOOPING & VLAN TOGGLE */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <label className="flex items-center justify-between text-xs font-mono text-slate-300 cursor-pointer">
                    <span>IGMP Snooping & Filtrage Multicast :</span>
                    <button
                      onClick={() => setIgmpSnoopingEnabled(!igmpSnoopingEnabled)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                        igmpSnoopingEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {igmpSnoopingEnabled ? (isFr ? 'ACTIVÉ (Recommandé)' : 'ENABLED (Recommended)') : (isFr ? 'DÉSACTIVÉ (Risque Tempête)' : 'DISABLED (Storm Risk)')}
                    </button>
                  </label>

                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Priorité VLAN IEEE 802.1Q :</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-bold border border-slate-700">
                      PCP 6 (High Priority)
                    </span>
                  </div>
                </div>

                {/* PROTOCOL METRICS */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>EtherType :</span>
                    <span className="text-amber-400 font-bold">0x88B8 (GOOSE)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Compteur État (stNum) :</span>
                    <span className="text-white font-bold">{gooseStNum}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Séquence (sqNum) :</span>
                    <span className="text-slate-200">{gooseSqNum}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Délai de veille (Tmax) :</span>
                    <span className="text-teal-400 font-bold">1000 ms</span>
                  </div>
                </div>
              </div>

              {/* GOOSE BURST RETRANSMISSION CURVE & EVENT LOG */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-400" />
                    {isFr ? 'Séquence de Rafale GOOSE & Courbe de Backoff Exponentiel' : 'GOOSE Burst Sequence & Exponential Backoff Curve'}
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {latestGooseLatency} ms {isFr ? '(Latence Réelle mesurée)' : '(Measured Latency)'}
                  </span>
                </div>

                {/* BURST TIMING EXPLANATION */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1 text-slate-300">
                  <div className="text-teal-400 font-bold flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    {isFr ? 'Mécanisme de Fiabilité CEI 61850-8-1 :' : 'IEC 61850-8-1 Reliability Mechanism:'}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    {isFr
                      ? 'Lors d\'un changement d\'état, le message GOOSE est réémis immédiatement sans attendre d\'acquittement avec des intervalles exponentiels successifs (0ms, 1ms, 2ms, 4ms, 8ms...) jusqu\'à stabiliser à Tmax (1000ms), garantissant une réception à 99.999% même en présence de paquets perdus.'
                      : 'Upon state change, GOOSE retransmits instantly without ACK at exponential intervals (0ms, 1ms, 2ms, 4ms, 8ms...) settling at Tmax (1000ms), ensuring 99.999% delivery guarantee even over congested networks.'}
                  </p>
                </div>

                {/* LIVE EVENT LOG TABLE */}
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                        <th className="py-2.5 px-3">{isFr ? 'Horodatage' : 'Timestamp'}</th>
                        <th className="py-2.5 px-3">stNum</th>
                        <th className="py-2.5 px-3">sqNum</th>
                        <th className="py-2.5 px-3">{isFr ? 'Statut / Événement' : 'Status / Event'}</th>
                        <th className="py-2.5 px-3 text-right">{isFr ? 'Latence' : 'Latency'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {gooseLog.map((row, idx) => (
                        <tr key={idx} className={row.status.includes('TRIP') ? 'bg-red-950/30 text-red-200' : 'text-slate-300'}>
                          <td className="py-2 px-3 text-slate-400">{row.time}</td>
                          <td className="py-2 px-3 font-bold text-white">{row.stNum}</td>
                          <td className="py-2 px-3 text-slate-400">{row.sqNum}</td>
                          <td className="py-2 px-3">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              row.status.includes('TRIP') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-400">
                            {row.latencyMs.toFixed(2)} ms
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2B: PRP / HSR BENCH */}
          {stage2SubTab === 'PRP_HSR' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* TOPOLOGY & CONTROLS */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Network className="w-4 h-4 text-teal-400" />
                  {isFr ? 'Sélection Architecture CEI 62439-3' : 'IEC 62439-3 Architecture'}
                </h3>

                {/* REDUNDANCY PROTOCOL SELECTOR */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setRedundancyProtocol('PRP')}
                    className={`p-3 rounded-xl border font-mono text-xs font-bold transition-all text-center ${
                      redundancyProtocol === 'PRP'
                        ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    PRP (IEC 62439-3-4)
                    <span className="block text-[10px] font-normal opacity-80 mt-0.5">Double Étoile Séparée</span>
                  </button>
                  <button
                    onClick={() => setRedundancyProtocol('HSR')}
                    className={`p-3 rounded-xl border font-mono text-xs font-bold transition-all text-center ${
                      redundancyProtocol === 'HSR'
                        ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    HSR (IEC 62439-3-5)
                    <span className="block text-[10px] font-normal opacity-80 mt-0.5">Anneau Haute Dispo</span>
                  </button>
                </div>

                {/* FAULT SIMULATION TOGGLES */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="text-xs font-mono text-slate-400">
                    {isFr ? 'Simulation de Panne de Liaison :' : 'Link Failure Simulation:'}
                  </div>

                  {redundancyProtocol === 'PRP' ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => setLanAFault(!lanAFault)}
                        className={`w-full p-2.5 rounded-xl border font-mono text-xs font-bold transition-all flex items-center justify-between ${
                          lanAFault ? 'bg-red-950/60 border-red-500 text-red-300' : 'bg-slate-800/80 border-slate-700 text-slate-300'
                        }`}
                      >
                        <span>LAN A (Réseau Rouge)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-900">
                          {lanAFault ? (isFr ? 'COUPÉ (Panne)' : 'CUT (Failed)') : (isFr ? 'OPÉRATIONNEL' : 'HEALTHY')}
                        </span>
                      </button>

                      <button
                        onClick={() => setLanBFault(!lanBFault)}
                        className={`w-full p-2.5 rounded-xl border font-mono text-xs font-bold transition-all flex items-center justify-between ${
                          lanBFault ? 'bg-red-950/60 border-red-500 text-red-300' : 'bg-slate-800/80 border-slate-700 text-slate-300'
                        }`}
                      >
                        <span>LAN B (Réseau Bleu)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-900">
                          {lanBFault ? (isFr ? 'COUPÉ (Panne)' : 'CUT (Failed)') : (isFr ? 'OPÉRATIONNEL' : 'HEALTHY')}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRingNode3Cut(!ringNode3Cut)}
                      className={`w-full p-3 rounded-xl border font-mono text-xs font-bold transition-all flex items-center justify-between ${
                        ringNode3Cut ? 'bg-red-950/60 border-red-500 text-red-300' : 'bg-slate-800/80 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span>{isFr ? 'Coupure Anneau HSR (Fibre 2-3)' : 'HSR Ring Cut (Fiber 2-3)'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-900">
                        {ringNode3Cut ? (isFr ? 'ANNEAU OUVERT' : 'RING OPEN') : (isFr ? 'BOUCLE FERMÉE' : 'RING CLOSED')}
                      </span>
                    </button>
                  )}
                </div>

                {/* ZERO LOSS GUARANTEE BADGE */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 font-mono text-xs space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    {isFr ? 'Temps de Recouvrement : 0 ms' : 'Recovery Time: 0 ms'}
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {isFr
                      ? 'Aucun paquet GOOSE ou SV n\'est perdu lors de la rupture d\'un canal physique grâce à la duplication systématique à la source (RedBox / DANP).'
                      : 'Zero GOOSE or SV packets lost upon physical cable severance due to hitless source packet replication (RedBox / DANP).'}
                  </p>
                </div>
              </div>

              {/* TELEMETRY PACKET MONITOR & ARCHITECTURE TOPOLOGY SCHEMATIC */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-400" />
                    {isFr ? 'Télémétrie Redondance & Élimination des Doublons' : 'Redundancy Telemetry & Duplicate Discard Engine'}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                    Protocole : {redundancyProtocol}
                  </span>
                </div>

                {/* REAL-TIME PACKET COUNTERS */}
                <div className="grid grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">ÉMIS SOURCE</span>
                    <span className="text-base font-bold text-white mt-1 block">{prpPacketsSent}</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${lanAFault ? 'bg-red-950/30 border-red-500' : 'bg-slate-950 border-slate-800'}`}>
                    <span className="text-slate-400 text-[10px] block">REÇU LAN A</span>
                    <span className={`text-base font-bold mt-1 block ${lanAFault ? 'text-red-400' : 'text-emerald-400'}`}>
                      {lanAFault ? '0 (OFF)' : prpPacketsRcvA}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl border ${lanBFault ? 'bg-red-950/30 border-red-500' : 'bg-slate-950 border-slate-800'}`}>
                    <span className="text-slate-400 text-[10px] block">REÇU LAN B</span>
                    <span className={`text-base font-bold mt-1 block ${lanBFault ? 'text-red-400' : 'text-blue-400'}`}>
                      {lanBFault ? '0 (OFF)' : prpPacketsRcvB}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">DOUBLONS REJETÉS</span>
                    <span className="text-base font-bold text-amber-400 mt-1 block">{prpDuplicatesDiscarded}</span>
                  </div>
                </div>

                {/* SVG SCHEMATIC OF DUAL LAN OR HSR RING */}
                <div className="h-52 w-full bg-slate-950 rounded-xl border border-slate-800 p-4 flex items-center justify-center relative overflow-hidden">
                  {redundancyProtocol === 'PRP' ? (
                    <div className="w-full max-w-lg space-y-4 font-mono text-xs text-center">
                      <div className="p-2 rounded-lg bg-teal-950/50 border border-teal-500/50 text-teal-300 font-bold mx-auto w-48">
                        DANP / Équipement Source
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className={`p-3 rounded-xl border ${lanAFault ? 'bg-red-950/40 border-red-500 text-red-400' : 'bg-slate-900 border-emerald-500 text-emerald-300'}`}>
                          <div className="font-bold">Réseau A (LAN A)</div>
                          <div className="text-[10px] opacity-80">Commutateurs 61850-3 Redondance A</div>
                        </div>
                        <div className={`p-3 rounded-xl border ${lanBFault ? 'bg-red-950/40 border-red-500 text-red-400' : 'bg-slate-900 border-blue-500 text-blue-300'}`}>
                          <div className="font-bold">Réseau B (LAN B)</div>
                          <div className="text-[10px] opacity-80">Commutateurs 61850-3 Redondance B</div>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-teal-950/50 border border-teal-500/50 text-teal-300 font-bold mx-auto w-48">
                        DANP / Récepteur (Discard Doublons)
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-lg space-y-3 font-mono text-xs text-center">
                      <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/50 text-amber-300 font-bold mx-auto w-64">
                        {isFr ? 'Boucle HSR (High-availability Seamless)' : 'HSR High-availability Seamless Ring'}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
                          Nœud 1 (Relais 87T)
                        </div>
                        <div className={`p-2.5 rounded-xl border ${ringNode3Cut ? 'bg-red-950/50 border-red-500 text-red-300' : 'bg-slate-900 border-slate-700 text-slate-200'}`}>
                          Liaison Inter-Nœud
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
                          Nœud 2 (Relais 21)
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {isFr ? 'Trame HSR avec étiquette 6 octets (LSDU) circulant dans les deux sens simultanément.' : 'HSR frame with 6-byte tag (LSDU) propagating in both directions simultaneously.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 3: PRECISION TIME PROTOCOL IEEE 1588v2 & PTP GRANDMASTER     */}
      {/* =================================================================== */}
      {activeStage === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* GRANDMASTER CLOCK CONFIGURATION */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                {isFr ? 'Horloge Grandmaster PTP (IEEE 1588v2)' : 'IEEE 1588v2 PTP Grandmaster Clock'}
              </h3>

              {/* OSCILLATOR / SYNC SOURCE SELECTOR */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block">
                  {isFr ? 'Source de Référence Temporelle :' : 'Time Reference Source:'}
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'LOCKED_GNSS', labelFr: 'Verrouillé GNSS (GPS / Galileo)', labelEn: 'Locked GNSS (GPS / Galileo)', badge: '±18 ns (Précision Absolue)' },
                    { id: 'HOLDOVER_RUBIDIUM', labelFr: 'Holdover Rubidium Atomique', labelEn: 'Atomic Rubidium Holdover', badge: '< 1 μs / 24h dérive' },
                    { id: 'HOLDOVER_OCXO', labelFr: 'Holdover Quartz OCXO Four', labelEn: 'Oven-Controlled OCXO Quartz', badge: '< 1.5 μs / 4h dérive' },
                    { id: 'FREERUN_DRIFT', labelFr: 'Oscillateur Libre non-compensé', labelEn: 'Uncompensated Free Run', badge: '> 3 μs / heure (Critique)' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setPtpGmState(c.id as any)}
                      className={`w-full p-2.5 rounded-xl border text-left font-mono text-xs transition-all ${
                        ptpGmState === c.id
                          ? 'bg-blue-950/60 border-blue-500 text-white shadow-md shadow-blue-500/10'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{isFr ? c.labelFr : c.labelEn}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-blue-300 border border-blue-800">
                          {c.badge}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* HOLDOVER DURATION SLIDER */}
              {ptpGmState !== 'LOCKED_GNSS' && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">{isFr ? 'Durée de coupure GNSS :' : 'GNSS Outage Duration:'}</span>
                    <span className="text-amber-400 font-bold">{ptpHoldoverHours} {isFr ? 'heures' : 'hours'}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="48"
                    value={ptpHoldoverHours}
                    onChange={(e) => setPtpHoldoverHours(+e.target.value)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                  />
                </div>
              )}

              {/* SWITCH CLOCK SUPPORT */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-mono text-slate-400 block">
                  {isFr ? 'Rôle des Switchs Réseau (Jitter Compensation) :' : 'Network Switch Clock Mode:'}
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'TRANSPARENT_CLOCK_TC', nameFr: 'Transparent Clock (TC E2E / P2P)', nameEn: 'Transparent Clock (TC E2E / P2P)', info: 'Corrige temps de séjour en switch' },
                    { id: 'BOUNDARY_CLOCK_BC', nameFr: 'Boundary Clock (BC)', nameEn: 'Boundary Clock (BC)', info: 'Relais d\'horloge maître/esclave' },
                    { id: 'STANDARD_SWITCH_NO_PTP', nameFr: 'Switch Standard sans PTP', nameEn: 'Standard Switch without PTP', info: 'Inacceptable en bus process (Jitter > 50μs)' }
                  ].map((sw) => (
                    <button
                      key={sw.id}
                      onClick={() => setSwitchClockType(sw.id as any)}
                      className={`w-full p-2 rounded-xl border text-left font-mono text-xs transition-all ${
                        switchClockType === sw.id
                          ? 'bg-blue-950/60 border-blue-500 text-white'
                          : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold">{isFr ? sw.nameFr : sw.nameEn}</div>
                      <div className="text-[10px] text-slate-400">{sw.info}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PTP DRIFT READOUT & SYNCHROPHASOR 87L DIFFERENTIAL STABILITY */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  {isFr ? 'Dérive Temporelle & Erreur d\'Angle Phaseur (Impact Protection 87L / PMU)' : 'Time Drift & Synchrophasor Phase Error (87L / PMU Impact)'}
                </h3>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                  calculatedDriftNs < 1000 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'
                }`}>
                  {calculatedDriftNs < 1000 ? (isFr ? 'CONFORME CEI 61850-9-3' : 'IEC 61850-9-3 COMPLIANT') : (isFr ? 'DÉRIVE NON-CONFORME' : 'NON-COMPLIANT DRIFT')}
                </span>
              </div>

              {/* TELEMETRY READOUT CARDS */}
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">{isFr ? 'DÉRIVE TEMPORELLE' : 'TIME DRIFT'}</span>
                  <span className={`text-lg font-black mt-1 block ${calculatedDriftNs < 1000 ? 'text-blue-400' : 'text-red-400'}`}>
                    {calculatedDriftNs >= 1000 ? `${(calculatedDriftNs / 1000).toFixed(2)} μs` : `${calculatedDriftNs} ns`}
                  </span>
                  <span className="text-[10px] text-slate-500">Seuil limite 9-2LE : 1.0 μs</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">{isFr ? 'ERREUR ANGLE PHASE' : 'PHASE ANGLE ERROR'}</span>
                  <span className={`text-lg font-black mt-1 block ${+phaseAngleErrorDeg < 0.1 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {phaseAngleErrorDeg}°
                  </span>
                  <span className="text-[10px] text-slate-500">À 50 Hz (20 ms = 360°)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">{isFr ? 'DIFFÉRENTIELLE 87L' : '87L DIFFERENTIAL'}</span>
                  <span className={`text-lg font-black mt-1 block ${+phaseAngleErrorDeg < 0.05 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {+phaseAngleErrorDeg < 0.05 ? (isFr ? 'STABLE' : 'STABLE') : (isFr ? 'DÉCLENCHEMENT FAUX' : 'FALSE TRIP RISK')}
                  </span>
                  <span className="text-[10px] text-slate-500">I_diff fictif généré</span>
                </div>
              </div>

              {/* MATHEMATICAL DEMONSTRATION BOX */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                <div className="text-blue-400 font-bold flex items-center justify-between">
                  <span>{isFr ? 'Formule Maîtresse d\'Erreur de Phase par Dérive Temporelle :' : 'Master Formula for Phase Error via Time Drift:'}</span>
                  <span className="text-[10px] text-slate-400">IEEE C37.118 / IEC 61850-9-3</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-center text-sm font-bold text-teal-300">
                  Δθ = 360° × f_réseau × Δt
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isFr
                    ? 'À la fréquence nominale de 50 Hz, une seconde correspond à 18 000 degrés. Une dérive de seulement 1 microseconde (1 μs) engendre une erreur d\'angle de 0.018°. Au-delà de 1.5 milliseconde d\'asymétrie ou de dérive temporelle, l\'erreur dépasse 27°, ce qui déclenche intempestivement la protection différentielle de ligne 87L en pleine charge nominale.'
                    : 'At 50 Hz nominal frequency, one second corresponds to 18,000 electrical degrees. A mere 1 microsecond (1 μs) time drift creates a 0.018° phase shift. Above 1.5 milliseconds of drift or link asymmetry, the error exceeds 27°, provoking false tripping of 87L line differential protections under healthy full load.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 4: GRID WAN COMMUNICATIONS: OPGW LINK BUDGET & PLC (CPL)     */}
      {/* =================================================================== */}
      {activeStage === 4 && (
        <div className="space-y-6">
          {/* SUB-STAGE SELECTOR TABS */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setStage4SubTab('OPGW')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage4SubTab === 'OPGW'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              {isFr ? '4A : Bilan Optique OPGW & Dispersion (ITU-T G.652D)' : '4A: OPGW Optical Link Budget (ITU-T G.652D)'}
            </button>
            <button
              onClick={() => setStage4SubTab('PLC')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage4SubTab === 'PLC'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <Radio className="w-4 h-4" />
              {isFr ? '4B : Courants Porteurs en Ligne (CPL) & Self d\'Arrêt (Line Trap)' : '4B: Power Line Carrier (PLC) & Line Trap'}
            </button>
          </div>

          {/* 4A: OPGW LINK BUDGET BENCH */}
          {stage4SubTab === 'OPGW' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* OPGW PARAMETER SLIDERS */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-400" />
                  {isFr ? 'Paramètres Fibre OPGW (ITU-T G.652D)' : 'OPGW Optical Parameters'}
                </h3>

                {/* LINE LENGTH */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">{isFr ? 'Longueur de Ligne OPGW :' : 'OPGW Line Length:'}</span>
                    <span className="text-teal-400 font-bold">{opgwLineLengthKm} km</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="250"
                    value={opgwLineLengthKm}
                    onChange={(e) => setOpgwLineLengthKm(+e.target.value)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>

                {/* WAVELENGTH SELECTOR */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 block">{isFr ? 'Longueur d\'onde optique :' : 'Wavelength:'}</label>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <button
                      onClick={() => setOpticalWavelength(1310)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        opticalWavelength === 1310 ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      1310 nm
                      <span className="block text-[10px] opacity-80">0.35 dB/km</span>
                    </button>
                    <button
                      onClick={() => setOpticalWavelength(1550)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        opticalWavelength === 1550 ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      1550 nm (Recommandé)
                      <span className="block text-[10px] opacity-80">0.20 dB/km</span>
                    </button>
                  </div>
                </div>

                {/* SPLICE COUNT */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">{isFr ? 'Nombre d\'épissures de fusion :' : 'Fusion Splice Count:'}</span>
                    <span className="text-white font-bold">{spliceCount} ({spliceLossDb} dB/épi.)</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="80"
                    value={spliceCount}
                    onChange={(e) => setSpliceCount(+e.target.value)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>

                {/* AGING MARGIN */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">{isFr ? 'Marge de sécurité / Vieillissement :' : 'Aging / Safety Margin:'}</span>
                    <span className="text-amber-400 font-bold">{agingMarginDb} dB</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="6.0"
                    step="0.5"
                    value={agingMarginDb}
                    onChange={(e) => setAgingMarginDb(+e.target.value)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>

                {/* OPTICAL POWER TRANSCEIVER SPECS */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Puissance Tx</span>
                    <span className="text-white font-bold">{txOpticalPowerDbm > 0 ? `+${txOpticalPowerDbm}` : txOpticalPowerDbm} dBm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Sensibilité Rx</span>
                    <span className="text-white font-bold">{rxSensitivityDbm} dBm</span>
                  </div>
                </div>
              </div>

              {/* DETAILED ATTENUATION BUDGET & VERDICT */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    {isFr ? 'Décomposition des Pertes Optiques & Marge Réseau' : 'Optical Loss Breakdown & Link Margin'}
                  </h3>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    isOpticalLinkViable ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    {isOpticalLinkViable ? (isFr ? 'LIAISON VIABLE (Marge > 0)' : 'LINK VIABLE (Margin > 0)') : (isFr ? 'ATTÉNUATION EXCESSIVE' : 'EXCESSIVE ATTENUATION')}
                  </span>
                </div>

                {/* BREAKDOWN CARDS */}
                <div className="grid grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Perte Fibre</span>
                    <span className="text-base font-bold text-teal-400 mt-1 block">{fiberLoss} dB</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Pertes Épissures</span>
                    <span className="text-base font-bold text-slate-200 mt-1 block">{totalSpliceLoss} dB</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Connecteurs</span>
                    <span className="text-base font-bold text-slate-200 mt-1 block">{totalConnectorLoss} dB</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Marge Vieilliss.</span>
                    <span className="text-base font-bold text-amber-400 mt-1 block">{agingMarginDb} dB</span>
                  </div>
                </div>

                {/* TOTAL BUDGET VS TOTAL ATTENUATION SUMMARY */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Budget Optique Total Disponible (Tx - Rx) :</span>
                    <span className="text-white font-bold">{totalLinkBudgetDb} dB</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Atténuation Totale de Liaison Calculée :</span>
                    <span className="text-teal-400 font-bold">{totalLinkAttenuationDb} dB</span>
                  </div>
                  <div className="flex justify-between items-center text-base pt-2 border-t border-slate-800">
                    <span className="font-bold text-white">Marge Optique Résiduelle :</span>
                    <span className={`text-lg font-black ${opticalMarginDb >= 3.0 ? 'text-emerald-400' : opticalMarginDb >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                      {opticalMarginDb > 0 ? `+${opticalMarginDb}` : opticalMarginDb} dB
                    </span>
                  </div>
                </div>

                {/* FORMULA REFERENCE */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                  <div className="text-teal-400 font-bold">Formule ITU-T G.652D :</div>
                  <code>P_rx = P_tx - (α_λ × L + N_splice × A_splice + N_conn × A_conn + M_vieillissement)</code>
                </div>
              </div>
            </div>
          )}

          {/* 4B: POWER LINE CARRIER (PLC) & LINE TRAP BENCH */}
          {stage4SubTab === 'PLC' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* PLC PARAMETERS */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Radio className="w-4 h-4 text-teal-400" />
                  {isFr ? 'Paramètres CPL & Self d\'Arrêt (Line Trap)' : 'PLC & Line Trap Parameters'}
                </h3>

                {/* CARRIER FREQUENCY */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">{isFr ? 'Fréquence Porteuse CPL :' : 'PLC Carrier Frequency:'}</span>
                    <span className="text-teal-400 font-bold">{plcFrequencyKhz} kHz</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="500"
                    step="10"
                    value={plcFrequencyKhz}
                    onChange={(e) => setPlcFrequencyKhz(+e.target.value)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>40 kHz (LF)</span>
                    <span>500 kHz (HF)</span>
                  </div>
                </div>

                {/* LINE TRAP INDUCTANCE */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">{isFr ? 'Inductance Self d\'Arrêt (L) :' : 'Line Trap Inductance (L):'}</span>
                    <span className="text-white font-bold">{lineTrapInductanceMh} mH</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.0"
                    step="0.1"
                    value={lineTrapInductanceMh}
                    onChange={(e) => setLineTrapInductanceMh(+e.target.value)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>

                {/* COUPLING CAPACITOR CAPACITANCE */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">{isFr ? 'Capacité CCVT de Couplage (C) :' : 'Coupling Capacitor (C):'}</span>
                    <span className="text-white font-bold">{ccvtCapacitancePf} pF</span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="12000"
                    step="500"
                    value={ccvtCapacitancePf}
                    onChange={(e) => setCcvtCapacitancePf(+e.target.value)}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>
              </div>

              {/* HIGH-FREQUENCY IMPEDANCE RESPONSE & COMPLIANCE */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    {isFr ? 'Impédance de Blocage & Couplage Haute Fréquence' : 'Blocking Impedance & High-Frequency Coupling'}
                  </h3>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    lineTrapIsCompliant ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    {lineTrapIsCompliant ? (isFr ? 'BLOCAGE CONFORME (Z >= 400 Ω)' : 'BLOCKING COMPLIANT (Z >= 400 Ω)') : (isFr ? 'FUITE HF VERS LE POSTE' : 'HF LEAKAGE RISK')}
                  </span>
                </div>

                {/* IMPEDANCE CARDS */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">{isFr ? 'IMPÉDANCE SELF D\'ARRÊT (Z_LT)' : 'LINE TRAP IMPEDANCE (Z_LT)'}</span>
                    <span className={`text-xl font-black mt-1 block ${lineTrapIsCompliant ? 'text-teal-400' : 'text-red-400'}`}>
                      {lineTrapImpedance} Ω
                    </span>
                    <span className="text-[10px] text-slate-500">Bloque le signal HF vers le poste</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">{isFr ? 'IMPÉDANCE CONDENSATEUR CCVT' : 'CCVT CAPACITOR IMPEDANCE'}</span>
                    <span className="text-xl font-black text-blue-400 mt-1 block">
                      {ccvtImpedance} Ω
                    </span>
                    <span className="text-[10px] text-slate-500">Injecte le signal HF sur la phase HTB</span>
                  </div>
                </div>

                {/* CPL ARCHITECTURE DESCRIPTION */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
                  <div className="text-teal-400 font-bold flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    {isFr ? 'Rôle Stratégique du CPL en Réseau HTB :' : 'Strategic Role of Power Line Carrier in HV Grids:'}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    {isFr
                      ? 'Le courant porteur en ligne (CPL) utilise les conducteurs de phase haute tension 225 kV comme support physique de transmission des télé-actions et du secours téléprotection. La self d\'arrêt (Line Trap) présente une impédance négligeable à 50 Hz mais supérieure à 400 Ω dans la bande 40-500 kHz, empêchant le signal radioélectrique de se dissiper dans les jeux de barres du poste.'
                      : 'Power Line Carrier (PLC) utilizes the 225 kV high-voltage phase conductors themselves as a physical transmission medium for teleprotection commands. The line trap presents negligible impedance at 50 Hz while exceeding 400 Ω in the 40-500 kHz carrier band, preventing HF signal dissipation into the substation busbars.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 5: FIELD BENCHMARKS, CAMEROON CASES & STAMPED BOQ / DQE      */}
      {/* =================================================================== */}
      {activeStage === 5 && (
        <div className="space-y-6">
          {/* SUB-STAGE SELECTOR TABS */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setStage5SubTab('CASES')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage5SubTab === 'CASES'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <Globe className="w-4 h-4" />
              {isFr ? '5A : Retours d\'Expérience Réseau Cameroun (SONATREL & Eneo)' : '5A: Cameroon Grid Field Benchmarks (SONATREL & Eneo)'}
            </button>
            <button
              onClick={() => setStage5SubTab('BOQ_DQE')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                stage5SubTab === 'BOQ_DQE'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              {isFr ? '5B : Devis Quantitatif Estimatif Chiffré (DQE / BOQ FCFA)' : '5B: Stamped Bill of Quantities (BOQ / DQE FCFA)'}
            </button>
          </div>

          {/* 5A: FIELD CASES */}
          {stage5SubTab === 'CASES' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* CASE SELECTION CARDS */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-400" />
                  {isFr ? 'Cas d\'Étude Industriels Réels' : 'Real-World Industrial Field Cases'}
                </h3>

                <div className="space-y-2">
                  {[
                    {
                      id: 'CASE_OPGW_SONATREL',
                      titleFr: 'Dorsale OPGW SONATREL 225 kV',
                      titleEn: 'SONATREL 225 kV OPGW Backbone',
                      subtitle: 'Songloulou — Mangombé — Yaoundé'
                    },
                    {
                      id: 'CASE_87L_ASYMMETRY',
                      titleFr: 'Incident 87L par Asymétrie Optique',
                      titleEn: '87L Trip Incident via Optical Asymmetry',
                      subtitle: 'Déclenchement intempestif Δt > 1.5 ms'
                    },
                    {
                      id: 'CASE_ENEO_RADIO_LTE',
                      titleFr: 'Téléconduite MT Eneo (VHF / LTE)',
                      titleEn: 'Eneo MV Telecontrol (VHF / LTE)',
                      subtitle: 'ADMS & IAT urbains Douala/Yaoundé'
                    }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCaseId(c.id as any)}
                      className={`w-full p-3 rounded-xl border text-left font-mono text-xs transition-all ${
                        selectedCaseId === c.id
                          ? 'bg-teal-950/60 border-teal-500 text-white shadow-md shadow-teal-500/10'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold">{isFr ? c.titleFr : c.titleEn}</div>
                      <div className="text-[10px] text-teal-400/80 mt-0.5">{c.subtitle}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* DETAILED CASE STUDY VIEW */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800">
                {selectedCaseId === 'CASE_OPGW_SONATREL' && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-sm font-bold text-white">Dorsale Fibre Optique OPGW du Réseau Interconnecté Sud (RIS)</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                        SONATREL · 225 kV
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      L&apos;artère de transport haute tension 225 kV Songloulou — Mangombé (Édéa) — Oyomabang (Yaoundé) intègre un câble de garde à fibres optiques (OPGW) 48 brins monomodes ITU-T G.652D. Ce support unifié achemine :
                    </p>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                      <div className="text-teal-400 font-bold">Applications en Service :</div>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        <li>Téléconduite SCADA CEI 60870-5-104 vers le dispatching de Mangombé</li>
                        <li>Téléprotection différentielle de ligne 87L ultra-rapide (&lt; 5 ms)</li>
                        <li>Téléphonie d&apos;exploitation VoIP prioritaire et visioconférence de crise</li>
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
                      Lors d&apos;une coupure de câble OPGW sur une ligne 225 kV, le réseau de transmission optique SDH/MPLS a automatiquement basculé le canal de transmission aller (Tx) sur un trajet alternatif de secours (145 km) tandis que le canal retour (Rx) restait sur la route directe (55 km).
                    </p>
                    <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 space-y-2 text-[11px] text-slate-300">
                      <div className="text-red-400 font-bold">Mécanisme de Défaillance :</div>
                      <p>
                        La protection différentielle de ligne 87L assume par défaut un temps de propagation symétrique : t_aller = t_retour = RTT / 2. L&apos;asymétrie de 1.7 ms a faussé le calcul de recalage temporel des phaseurs de courant mesurés aux deux extrémités, faisant apparaître un déphasage de 30° en pleine charge nominale (1200 A) et déclenchant la ligne saine !
                      </p>
                      <div className="text-emerald-400 font-bold pt-1">Contre-Mesure Imposée :</div>
                      <p>
                        Interdiction du reroutage asymétrique dynamique pour les flux 87L; obligation d&apos;utiliser la synchronisation externe par horloges GPS/IEEE 1588 PTP à chaque extrémité de la ligne HTB.
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
                      Pour télécommander les centaines d&apos;interrupteurs aériens télécommandés (IACM) et réenclencheurs en réseau de distribution 30 kV, Eneo combine un réseau radio VHF/UHF propriétaire et des liaisons cellulaires 4G LTE avec APN privé sécurisé et cartes SIM M2M industrielles.
                    </p>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                      <div className="text-teal-400 font-bold">Performances du Système :</div>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        <li>Temps d&apos;exécution d&apos;une télécommande d&apos;ouverture/fermeture : &lt; 2.5 secondes</li>
                        <li>Taux de disponibilité des liaisons radio en milieu urbain : &gt; 99.2%</li>
                        <li>Isolement automatique des défauts câbles par automatisme FLISR en moins de 3 minutes</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5B: STAMPED DQE / BOQ ENGINE */}
          {stage5SubTab === 'BOQ_DQE' && (
            <TelecomDqeBoqEngine
              locale={locale}
              substationBays={6}
              opgwLineLengthKm={opgwLineLengthKm}
              spliceCount={spliceCount}
              redundancyProtocol={redundancyProtocol}
              ptpClockType={ptpGmState}
              projectName={TELECOM_SCENARIO_PROFILES[selectedScenarioKey].nameFr}
            />
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 8-FORMULA MATHEMATICAL PRINCIPLES & PHYSICS MODAL                   */}
      {/* =================================================================== */}
      {isFormulasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* MODAL HEADER */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-teal-400" />
                <h3 className="font-mono font-bold text-lg text-white">
                  {isFr ? 'Formulaire Mathématique & Physique des Télécommunications Réseau' : 'Mathematical Formulations & Telecom Physics Reference'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY WITH 8 FORMULAS */}
            <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs">
              {/* FORMULA 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-teal-400 font-bold">
                  <span>1. Débit et Bande Passante du Flux Sampled Values (SV CEI 61869-9 / 9-2LE)</span>
                  <span className="text-[10px] text-slate-500">Ethernet L2</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-center text-sm font-bold text-teal-300">
                  BW_stream = f_s × N_ASDU × L_Ethernet × 8  [bps]
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Pour f_s = 4000 Hz (80 éch./pér. à 50 Hz) avec une trame Ethernet typique de 150 octets, le débit continu généré par une seule Merging Unit est : BW = 4000 × 1 × 150 × 8 = 4.80 Mbps. À 12800 Hz (256 éch./pér.), le débit atteint 15.36 Mbps par MU.
                </p>
              </div>

              {/* FORMULA 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-amber-400 font-bold">
                  <span>2. Loi de Retransmission GOOSE Tempête et Backoff Exponentiel (CEI 61850-8-1)</span>
                  <span className="text-[10px] text-slate-500">Classe TT6 &lt; 3 ms</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-center text-sm font-bold text-amber-300">
                  T_i = min( 2^i × T_min , T_max )  avec T_min = 1 ms, T_max = 1000 ms
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Lors d&apos;un déclenchement disjoncteur (changement de stNum), la trame GOOSE est immédiatement envoyée à t=0ms, puis réémise à t=1ms, t=2ms, t=4ms, t=8ms, etc., jusqu&apos;à atteindre le temps de battement nominal T_max (1000ms).
                </p>
              </div>

              {/* FORMULA 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-emerald-400 font-bold">
                  <span>3. Temps de Recouvrement Zéro Perte PRP / HSR (CEI 62439-3)</span>
                  <span className="text-[10px] text-slate-500">Seamless Redundancy</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-center text-sm font-bold text-emerald-300">
                  R_loss = 0 ms  ;  T_ring_HSR = Σ(D_k) + L_ring / v_célérité
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Contrairement au protocole RSTP qui nécessite 50 à 500 ms de convergence en cas de rupture de câble, PRP et HSR dupliquent chaque trame à l&apos;émission. La coupure physique d&apos;une liaison entraîne une perte de paquets strictement nulle (R_loss = 0).
                </p>
              </div>

              {/* FORMULA 4 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-blue-400 font-bold">
                  <span>4. Équation de Décalage d&apos;Horloge PTP et Délai Aller-Retour IEEE 1588v2</span>
                  <span className="text-[10px] text-slate-500">PTP Master/Slave</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-center text-sm font-bold text-blue-300">
                  Offset = [(t2 - t1) - (t4 - t3)] / 2  ;  Delay_one_way = [(t2 - t1) + (t4 - t3)] / 2
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Calcul du décalage (offset) et du délai aller-retour moyen en supposant la symétrie du temps de propagation du réseau physique. Les commutateurs Transparent Clock (TC) ajoutent leur temps de résidence (correctionField) pour neutraliser le jitter.
                </p>
              </div>

              {/* FORMULA 5 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-purple-400 font-bold">
                  <span>5. Erreur d&apos;Angle de Phase Induite par la Dérive Temporelle (Protection 87L)</span>
                  <span className="text-[10px] text-slate-500">Synchrophasor IEEE C37.118</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-center text-sm font-bold text-purple-300">
                  Δθ = 360° × f_grid × Δt  =&gt;  À 50 Hz, 1 μs = 0.018° et 1.5 ms = 27.0°
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Sur le réseau 50 Hz camerounais, une asymétrie de liaison ou dérive temporelle de 1.5 ms fait apparaître un courant différentiel fictif de 46% du courant de transit, ce qui déclenche intempestivement la ligne 225 kV Songloulou-Mangombé.
                </p>
              </div>

              {/* FORMULA 6 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-teal-400 font-bold">
                  <span>6. Bilan de Liaison Optique OPGW (ITU-T G.652D 1310/1550 nm)</span>
                  <span className="text-[10px] text-slate-500">Optical Power Budget</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-center text-sm font-bold text-teal-300">
                  P_rx = P_tx - ( α_λ × L + N_splice × A_splice + N_conn × A_conn + M_vieillissement )
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Atténuation linéique standard : α_1550 = 0.20 dB/km, α_1310 = 0.35 dB/km. Pertes d&apos;épissure par fusion : 0.05 dB/épissure. Perte par couple de connecteurs : 0.25 dB. Marge de vieillissement minimale recommandée : 3.0 dB.
                </p>
              </div>

              {/* FORMULA 7 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-amber-400 font-bold">
                  <span>7. Impédance de Blocage Haute Fréquence de la Self d&apos;Arrêt CPL (Line Trap)</span>
                  <span className="text-[10px] text-slate-500">40 kHz à 500 kHz</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-center text-sm font-bold text-amber-300">
                  Z_LT(f) = (jωL) / (1 - ω² L C_p) &gt;= 400 Ω  ;  f_0 = 1 / (2π √(L C_p))
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  La self d&apos;arrêt (Line Trap) insérée en série sur la phase HTB doit présenter une impédance supérieure ou égale à 400 Ω sur toute la bande porteuse pour empêcher l&apos;atténuation du signal dans le poste et éviter les brouillages vers les transformateurs.
                </p>
              </div>

              {/* FORMULA 8 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-blue-400 font-bold">
                  <span>8. Impédance Réactive du Condensateur de Couplage CPL (CCVT)</span>
                  <span className="text-[10px] text-slate-500">Couplage Phase-Terre</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-center text-sm font-bold text-blue-300">
                  X_c = 1 / (2π f C_ccvt)  ;  À 50 Hz : X_c = 723 kΩ  ;  À 180 kHz : X_c = 130 Ω
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Le transformateur de tension capacitif (CCVT de 4400 pF) isole parfaitement le récepteur CPL de la haute tension 50 Hz (haute impédance) tout en présentant un chemin de faible impédance pour injecter les signaux haute fréquence vers la ligne.
                </p>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="px-4 py-2 rounded-xl font-mono text-xs font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors"
              >
                {isFr ? 'Fermer le Formulaire' : 'Close Reference'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
