// src/components/automation/AutomationControlWorkbench.tsx
// EPEDE Domain D07 - Industrial Automation, Control Systems & Safety Instrumentation
// Comprehensive 7-Pillar Engineering Workbench compliant with IEC 61131-3, IEC 61508, IEC 61511, IEC 60204-1, ISA-88 & IEC 62443

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Cpu,
  Activity,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Network,
  Server,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Clock,
  Layers,
  Code,
  ArrowRight,
  TrendingUp,
  Share2,
  Flame,
  Info,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Workflow
} from 'lucide-react';

interface AutomationControlWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (id: string) => void;
}

type PillarKey =
  | 'IEC61131_PLC_RUNNER'
  | 'PID_CLOSED_LOOP'
  | 'VFD_FOC_DRIVES'
  | 'SIL_SAFETY_ESD'
  | 'FIELDBUS_COMM_IO'
  | 'PLC_ARCHITECTURE_REDUNDANCY'
  | 'CAMEROON_HYDRO_INDUSTRY';

export const AutomationControlWorkbench: React.FC<AutomationControlWorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  const [activePillar, setActivePillar] = useState<PillarKey>('IEC61131_PLC_RUNNER');

  const pillars = useMemo(
    () => [
      {
        id: 'IEC61131_PLC_RUNNER' as PillarKey,
        num: 'P1',
        titleFr: 'Simulateur Logique CEI 61131-3 (LD / ST / FBD)',
        titleEn: 'IEC 61131-3 PLC Logic Engine (LD / ST / FBD)',
        icon: Terminal,
        badgeFr: 'Cycle PLC 10 ms · Rungs & Traces',
        badgeEn: '10 ms PLC Scan · Rungs & Traces'
      },
      {
        id: 'PID_CLOSED_LOOP' as PillarKey,
        num: 'P2',
        titleFr: 'Banc de Réglage PID & Anti-Windup',
        titleEn: 'Closed-Loop PID Tuning & Anti-Windup Bench',
        icon: SlidersHorizontal,
        badgeFr: 'Ziegler-Nichols & Réponse Indicielle',
        badgeEn: 'Ziegler-Nichols & Step Response'
      },
      {
        id: 'VFD_FOC_DRIVES' as PillarKey,
        num: 'P3',
        titleFr: 'Variateurs VFD & Contrôle Vectoriel (FOC)',
        titleEn: 'VFD Inverters & Field-Oriented Control (FOC)',
        icon: Activity,
        badgeFr: 'id/iq Découplage · Hachoir Freinage',
        badgeEn: 'id/iq Decoupling · Braking Chopper'
      },
      {
        id: 'SIL_SAFETY_ESD' as PillarKey,
        num: 'P4',
        titleFr: 'Systèmes Instrumentés de Sécurité (SIS / SIL 2 & 3)',
        titleEn: 'Safety Instrumented Systems (SIS / SIL 2 & 3)',
        icon: ShieldAlert,
        badgeFr: 'CEI 61508 / 61511 · Vote 1oo2 / 2oo3',
        badgeEn: 'IEC 61508 / 61511 · 1oo2 / 2oo3 Voting'
      },
      {
        id: 'FIELDBUS_COMM_IO' as PillarKey,
        num: 'P5',
        titleFr: 'Bus de Terrain & Boucles Analogiques 4–20 mA',
        titleEn: 'Fieldbus Networks & 4–20 mA HART Loops',
        icon: Network,
        badgeFr: 'Profinet IRT · Modbus TCP · HART',
        badgeEn: 'Profinet IRT · Modbus TCP · HART'
      },
      {
        id: 'PLC_ARCHITECTURE_REDUNDANCY' as PillarKey,
        num: 'P6',
        titleFr: 'Architectures Matérielles & Redondance Hot-Standby',
        titleEn: 'Hardware Racks & Dual Hot-Standby PLC',
        icon: Server,
        badgeFr: 'Bascule sans à-coup · E/S Déportées',
        badgeEn: 'Bumpless Failover · Remote I/O Drops'
      },
      {
        id: 'CAMEROON_HYDRO_INDUSTRY' as PillarKey,
        num: 'P7',
        titleFr: 'Retours d\'Expérience Industriels & Hydro au Cameroun',
        titleEn: 'Cameroon Hydro & Industrial Automation Forensics',
        icon: Flame,
        badgeFr: 'Nachtigal 420 MW · CIMENCAM · SABC',
        badgeEn: 'Nachtigal 420 MW · CIMENCAM · SABC'
      }
    ],
    []
  );

  // =========================================================================
  // PILLAR 1: IEC 61131-3 PLC LOGIC RUNNER (Ladder Diagram / Structured Text)
  // =========================================================================
  const [plcRunning, setPlcRunning] = useState<boolean>(true);
  const [scanCycleTimeMs, setScanCycleTimeMs] = useState<number>(10);
  const [plcLanguage, setPlcLanguage] = useState<'LD' | 'ST' | 'FBD'>('LD');
  const [inEmergencyStop, setInEmergencyStop] = useState<boolean>(false); // NC contact: false = OK (closed), true = pressed
  const [inStartPb, setInStartPb] = useState<boolean>(false);
  const [inStopPb, setInStopPb] = useState<boolean>(false);
  const [inThermalTrip, setInThermalTrip] = useState<boolean>(false);
  const [inLowLevelSensor, setInLowLevelSensor] = useState<boolean>(false);
  const [inHighLevelSensor, setInHighLevelSensor] = useState<boolean>(false);

  // PLC internal memory tags
  const [outPumpMotor, setOutPumpMotor] = useState<boolean>(false);
  const [outRunLamp, setOutRunLamp] = useState<boolean>(false);
  const [outAlarmHorn, setOutAlarmHorn] = useState<boolean>(false);
  const [tonTimerAccumSec, setTonTimerAccumSec] = useState<number>(0);
  const tonTimerPresetSec = 3.0; // 3 seconds safety delay before pump starts
  const [scanCounter, setScanCounter] = useState<number>(1420);

  useEffect(() => {
    if (!plcRunning) return;
    const interval = setInterval(() => {
      setScanCounter((c) => c + 1);

      // Evaluate PLC Rung logic
      const isHealthy = !inEmergencyStop && !inThermalTrip;

      if (!isHealthy) {
        setOutPumpMotor(false);
        setOutRunLamp(false);
        setOutAlarmHorn(inThermalTrip || inEmergencyStop);
        setTonTimerAccumSec(0);
        return;
      }

      setOutAlarmHorn(false);

      // Auto control logic: Start command or high tank level requests start, stopped by stop PB or low level
      if (inStopPb || inLowLevelSensor) {
        setOutPumpMotor(false);
        setOutRunLamp(false);
        setTonTimerAccumSec(0);
      } else if (inStartPb || inHighLevelSensor || outPumpMotor) {
        // Run safety TON timer
        setTonTimerAccumSec((prev) => {
          const next = Math.min(tonTimerPresetSec, prev + 0.1);
          if (next >= tonTimerPresetSec) {
            setOutPumpMotor(true);
            setOutRunLamp(true);
          }
          return next;
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [
    plcRunning,
    inEmergencyStop,
    inStartPb,
    inStopPb,
    inThermalTrip,
    inLowLevelSensor,
    inHighLevelSensor,
    outPumpMotor
  ]);

  // =========================================================================
  // PILLAR 2: CLOSED-LOOP PID TUNING SIMULATOR
  // =========================================================================
  const [setPoint, setSetPoint] = useState<number>(75); // Target (e.g. Tank Level % or Pressure bar)
  const [processVar, setProcessVar] = useState<number>(50); // Measured PV
  const [kp, setKp] = useState<number>(2.4); // Proportional Gain
  const [tiSec, setTiSec] = useState<number>(8.0); // Integral Time Ti (s)
  const [tdSec, setTdSec] = useState<number>(0.8); // Derivative Time Td (s)
  const [antiWindupEnabled, setAntiWindupEnabled] = useState<boolean>(true);
  const [pidManualMode, setPidManualMode] = useState<boolean>(false);
  const [manualOutputPercent, setManualOutputPercent] = useState<number>(45);
  const [historyPV, setHistoryPV] = useState<number[]>([40, 42, 45, 48, 50, 52, 53, 55, 60, 68, 72, 74, 75, 75, 75]);

  // PID solver calculation
  const errorVal = setPoint - processVar;
  const kiVal = tiSec > 0 ? kp / tiSec : 0;
  const kdVal = kp * tdSec;

  const rawP = kp * errorVal;
  const [integralAccum, setIntegralAccum] = useState<number>(15);
  const rawI = antiWindupEnabled ? Math.max(-25, Math.min(25, integralAccum)) : integralAccum;
  const rawD = kdVal * 0.1; // simulated rate of change
  const rawOutput = rawP + rawI + rawD;
  const clampedOutput = Math.max(0, Math.min(100, pidManualMode ? manualOutputPercent : rawOutput));

  // Dynamic PID step response simulation tick
  useEffect(() => {
    const timer = setInterval(() => {
      if (pidManualMode) return;
      setProcessVar((prevPV) => {
        const flowIn = clampedOutput * 0.035;
        const flowOut = prevPV * 0.025;
        const nextPV = Math.max(0, Math.min(100, prevPV + (flowIn - flowOut)));
        setHistoryPV((hist) => [...hist.slice(-24), parseFloat(nextPV.toFixed(1))]);
        return parseFloat(nextPV.toFixed(1));
      });
      setIntegralAccum((acc) => {
        const next = acc + errorVal * 0.02;
        return antiWindupEnabled ? Math.max(-20, Math.min(20, next)) : next;
      });
    }, 400);
    return () => clearInterval(timer);
  }, [clampedOutput, errorVal, pidManualMode, antiWindupEnabled]);

  // =========================================================================
  // PILLAR 3: VARIABLE FREQUENCY DRIVE (VFD) & FOC VECTOR CONTROL
  // =========================================================================
  const [motorNominalPowerKw, setMotorNominalPowerKw] = useState<number>(110); // 110 kW (Typical Cameroon industrial slurry pump)
  const [motorSpeedRpmRef, setMotorSpeedRpmRef] = useState<number>(1200); // 0 to 1500 rpm
  const [vfdCarrierKhz, setVfdCarrierKhz] = useState<number>(4.0); // 2 to 12 kHz PWM
  const [vfdControlMode, setVfdControlMode] = useState<'FOC_VECTOR' | 'SCALAR_VF' | 'DTC'>('FOC_VECTOR');
  const [cableLengthMeters, setCableLengthMeters] = useState<number>(120); // Motor cable length
  const [useDvDtFilter, setUseDvDtFilter] = useState<boolean>(true);

  // Electrical computations for VFD
  const motorNominalCurrentA = useMemo(() => {
    return parseFloat(((motorNominalPowerKw * 1000) / (Math.sqrt(3) * 400 * 0.86 * 0.94)).toFixed(1));
  }, [motorNominalPowerKw]);

  const outputFrequencyHz = (motorSpeedRpmRef / 1500) * 50;
  const estimatedTorqueNm = useMemo(() => {
    if (motorSpeedRpmRef <= 0) return 0;
    const omega = (2 * Math.PI * motorSpeedRpmRef) / 60;
    const actualPower = motorNominalPowerKw * Math.pow(motorSpeedRpmRef / 1500, 2.5); // centrifugal pump load
    return parseFloat(((actualPower * 1000) / omega).toFixed(0));
  }, [motorSpeedRpmRef, motorNominalPowerKw]);

  // Field-oriented decoupled currents
  const idMagnetizingCurrentA = parseFloat((motorNominalCurrentA * 0.38).toFixed(1)); // d-axis flux current
  const iqTorqueCurrentA = parseFloat(
    (motorNominalCurrentA * 0.9 * (estimatedTorqueNm / (motorNominalPowerKw * 6.36))).toFixed(1)
  ); // q-axis torque current

  // Motor terminal peak reflected overvoltage (dV/dt)
  const dcBusVoltage = 565; // 400V RMS * sqrt(2)
  const peakOvervoltageVolts = useMemo(() => {
    if (useDvDtFilter) return Math.round(dcBusVoltage * 1.15); // with dV/dt reactor or sine-filter
    // Transmission line wave reflection: V_peak = V_dc * (1 + reflection_coeff)
    const factor = cableLengthMeters > 100 ? 1.95 : 1.0 + (cableLengthMeters / 100) * 0.95;
    return Math.round(dcBusVoltage * factor);
  }, [cableLengthMeters, useDvDtFilter, dcBusVoltage]);

  // Dynamic braking chopper resistor sizing
  const brakingPeakPowerKw = parseFloat((motorNominalPowerKw * 0.7).toFixed(1));
  const brakingResistorOhms = useMemo(() => {
    const vBrakeThreshold = 750; // DC bus voltage where chopper fires
    return parseFloat(((vBrakeThreshold * vBrakeThreshold) / (brakingPeakPowerKw * 1000)).toFixed(1));
  }, [brakingPeakPowerKw]);

  // =========================================================================
  // PILLAR 4: SAFETY INSTRUMENTED SYSTEMS (SIS) & SIL VERIFICATION
  // =========================================================================
  const [targetSilLevel, setTargetSilLevel] = useState<'SIL_1' | 'SIL_2' | 'SIL_3'>('SIL_2');
  const [architectureVoting, setArchitectureVoting] = useState<'1oo1' | '1oo2' | '2oo3'>('1oo2');
  const [lambdaDU_perHour, setLambdaDU_perHour] = useState<number>(1.2e-6); // Dangerous undetected failure rate
  const [proofTestIntervalHours, setProofTestIntervalHours] = useState<number>(8760); // 1 year proof test interval
  const [diagnosticCoveragePct, setDiagnosticCoveragePct] = useState<number>(90); // 90% DC

  // SIL Calculations per IEC 61508-6
  const pfdAvgValue = useMemo(() => {
    const t_i = proofTestIntervalHours;
    const l_du = lambdaDU_perHour * (1 - diagnosticCoveragePct / 100);
    if (architectureVoting === '1oo1') {
      return (l_du * t_i) / 2;
    } else if (architectureVoting === '1oo2') {
      const beta = 0.05; // 5% common cause factor
      return ((l_du * t_i) ** 2) / 3 + (beta * l_du * t_i) / 2;
    } else {
      // 2oo3 voting
      const beta = 0.02;
      return (l_du * t_i) ** 2 + (beta * l_du * t_i) / 2;
    }
  }, [architectureVoting, lambdaDU_perHour, diagnosticCoveragePct, proofTestIntervalHours]);

  const achievedSil = useMemo(() => {
    if (pfdAvgValue < 1e-4) return 'SIL 3 (Excellence)';
    if (pfdAvgValue < 1e-3) return 'SIL 3';
    if (pfdAvgValue < 1e-2) return 'SIL 2';
    if (pfdAvgValue < 1e-1) return 'SIL 1';
    return 'NON CONFORME (PFD > 0.1)';
  }, [pfdAvgValue]);

  const riskReductionFactor = pfdAvgValue > 0 ? Math.round(1 / pfdAvgValue) : 0;

  // =========================================================================
  // PILLAR 5: FIELDBUS & 4-20 mA INSTRUMENTATION LOOP
  // =========================================================================
  const [activeProtocol, setActiveProtocol] = useState<'PROFINET_IRT' | 'MODBUS_TCP' | 'ETHERCAT' | 'HART_ANALOG'>('PROFINET_IRT');
  const [sensorRawMa, setSensorRawMa] = useState<number>(12.8); // 4.0 to 20.0 mA
  const [sensorRangeMin, setSensorRangeMin] = useState<number>(0); // e.g., 0 bar
  const [sensorRangeMax, setSensorRangeMax] = useState<number>(16); // e.g., 16 bar
  const [wireResistanceOhms, setWireResistanceOhms] = useState<number>(18.5); // Cable loop resistance

  // 4-20 mA conversion to physical process variable
  const physicalEngValue = useMemo(() => {
    const fraction = (sensorRawMa - 4.0) / 16.0;
    const clamped = Math.max(0, Math.min(1, fraction));
    return parseFloat((sensorRangeMin + clamped * (sensorRangeMax - sensorRangeMin)).toFixed(2));
  }, [sensorRawMa, sensorRangeMin, sensorRangeMax]);

  const loopVoltageDrop = parseFloat((((sensorRawMa / 1000) * wireResistanceOhms) + (sensorRawMa / 1000) * 250).toFixed(2)); // with 250 ohm HART load resistor

  // =========================================================================
  // PILLAR 6: PLC HARDWARE RACKS & DUAL HOT-STANDBY REDUNDANCY
  // =========================================================================
  const [cpuAStatus, setCpuAStatus] = useState<'PRIMARY_RUN' | 'STANDBY_SYNC' | 'FAULTED'>('PRIMARY_RUN');
  const [cpuBStatus, setCpuBStatus] = useState<'PRIMARY_RUN' | 'STANDBY_SYNC' | 'FAULTED'>('STANDBY_SYNC');
  const [opticalSyncLinkOk, setOpticalSyncLinkOk] = useState<boolean>(true);
  const [remoteIoDrop1Ok, setRemoteIoDrop1Ok] = useState<boolean>(true);
  const [remoteIoDrop2Ok, setRemoteIoDrop2Ok] = useState<boolean>(true);
  const [powerSupplyRedundantOk, setPowerSupplyRedundantOk] = useState<boolean>(true);

  const simulateCpuAFailure = () => {
    setCpuAStatus('FAULTED');
    setCpuBStatus('PRIMARY_RUN');
  };

  const restoreCpuA = () => {
    setCpuAStatus('STANDBY_SYNC');
  };

  return (
    <div className="space-y-6 text-[#e8eaf0] font-sans">
      {/* 1. DOMAIN BANNER HEADER */}
      <div className="relative bg-gradient-to-br from-[#001a1f] via-[#002830] to-[#0a1622] border-b-4 border-cyan-400 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-6 top-3 text-8xl font-black text-cyan-400/[0.06] pointer-events-none select-none font-mono">
          D07
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-cyan-400 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              EPEDE Engineering Station · Domain D07 · Level 5 Reference Quality
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wide text-white font-sans">
              Automatisation, Contrôle-Commande &amp; <span className="text-cyan-400">Sécurité Instrumentée</span>
            </h1>
            <p className="text-xs sm:text-sm font-mono tracking-wider uppercase text-cyan-200/90 font-bold">
              CEI 61131-3 (LD/ST) · PID Anti-Windup · VFD &amp; FOC · CEI 61508 / 61511 (SIL 2/3) · Profinet IRT · Redondance Hot-Standby
            </p>
          </div>

          <div className="self-start sm:self-auto bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono text-[11px] font-bold tracking-wider uppercase px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            7 Piliers Techniques Opérationnels
          </div>
        </div>
      </div>

      {/* 2. PILLAR NAVIGATION BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-md">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          const isActive = activePillar === pillar.id;
          return (
            <button
              key={pillar.id}
              onClick={() => setActivePillar(pillar.id)}
              className={`flex flex-col items-start p-3 rounded-xl text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-300'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 hover:text-white border border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-slate-950 text-cyan-400' : 'bg-slate-800 text-cyan-300'}`}>
                  {pillar.num}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
              </div>
              <div className="text-xs font-bold leading-snug line-clamp-2">
                {locale === 'fr' ? pillar.titleFr : pillar.titleEn}
              </div>
              <div className={`text-[9px] font-mono mt-1 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                {locale === 'fr' ? pillar.badgeFr : pillar.badgeEn}
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* PILLAR 1: IEC 61131-3 PLC LOGIC RUNNER (LD / ST / FBD)                    */}
      {/* ========================================================================= */}
      {activePillar === 'IEC61131_PLC_RUNNER' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                    {locale === 'fr' ? 'Moteur d\'Exécution Logique CEI 61131-3 en Temps Réel' : 'Real-Time IEC 61131-3 PLC Logic Runtime'}
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  {locale === 'fr'
                    ? 'Cycle de scan cyclique, évaluation des barreaux Ladder (LD), équivalences Structured Text (ST) et temporisateurs normalisés TON.'
                    : 'Cyclic PLC scan execution, Ladder diagram rungs, Structured Text equivalents and IEC standardized TON on-delay timers.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPlcRunning(!plcRunning)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all ${
                    plcRunning ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {plcRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {plcRunning ? (locale === 'fr' ? 'PLC EN MARCHE (RUN)' : 'PLC RUNNING') : (locale === 'fr' ? 'PLC EN PAUSE (STOP)' : 'PLC STOPPED')}
                </button>

                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {(['LD', 'ST', 'FBD'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setPlcLanguage(lang)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        plcLanguage === lang ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PLC I/O INTERACTION PANEL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Discrete Inputs (DI) */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    {locale === 'fr' ? 'Entrées Numériques Terrain (DI)' : 'Field Digital Inputs (DI)'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">24 V DC Sink/Source</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setInEmergencyStop(!inEmergencyStop)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      inEmergencyStop
                        ? 'bg-red-500/20 border-red-500 text-red-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-slate-500">%I0.0 · NC</div>
                    <div className="text-xs font-bold mt-1">Arrêt d'Urgence (E-Stop)</div>
                    <span className="text-[10px] font-mono font-bold mt-2">
                      {inEmergencyStop ? 'DECLENCHE (0)' : 'REPOS FERME (1)'}
                    </span>
                  </button>

                  <button
                    onClick={() => setInThermalTrip(!inThermalTrip)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      inThermalTrip
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-slate-500">%I0.1 · NC</div>
                    <div className="text-xs font-bold mt-1">Défaut Thermique Moteur</div>
                    <span className="text-[10px] font-mono font-bold mt-2">
                      {inThermalTrip ? 'DISJONCTEUR OUVERT' : 'OK (1)'}
                    </span>
                  </button>

                  <button
                    onMouseDown={() => setInStartPb(true)}
                    onMouseUp={() => setInStartPb(false)}
                    onTouchStart={() => setInStartPb(true)}
                    onTouchEnd={() => setInStartPb(false)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all select-none ${
                      inStartPb
                        ? 'bg-emerald-500/30 border-emerald-500 text-emerald-200 ring-2 ring-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-slate-500">%I0.2 · NO (Poussoir)</div>
                    <div className="text-xs font-bold mt-1">Bouton Marche (Start)</div>
                    <span className="text-[10px] font-mono font-bold mt-2">
                      {inStartPb ? 'ACTIONNE (1)' : 'REPOS (0)'}
                    </span>
                  </button>

                  <button
                    onMouseDown={() => setInStopPb(true)}
                    onMouseUp={() => setInStopPb(false)}
                    onTouchStart={() => setInStopPb(true)}
                    onTouchEnd={() => setInStopPb(false)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all select-none ${
                      inStopPb
                        ? 'bg-rose-500/30 border-rose-500 text-rose-200 ring-2 ring-rose-400'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-slate-500">%I0.3 · NC (Poussoir)</div>
                    <div className="text-xs font-bold mt-1">Bouton Arrêt (Stop)</div>
                    <span className="text-[10px] font-mono font-bold mt-2">
                      {inStopPb ? 'ACTIONNE (0)' : 'REPOS (1)'}
                    </span>
                  </button>

                  <button
                    onClick={() => setInHighLevelSensor(!inHighLevelSensor)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      inHighLevelSensor
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-slate-500">%I0.4 · Flotteur Haut</div>
                    <div className="text-xs font-bold mt-1">Niveau Haut Cuve</div>
                    <span className="text-[10px] font-mono font-bold mt-2">
                      {inHighLevelSensor ? 'IMMERSION (1)' : 'A SEC (0)'}
                    </span>
                  </button>

                  <button
                    onClick={() => setInLowLevelSensor(!inLowLevelSensor)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      inLowLevelSensor
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-slate-500">%I0.5 · Sécurité Basse</div>
                    <div className="text-xs font-bold mt-1">Niveau Bas Cuve (Marche à sec)</div>
                    <span className="text-[10px] font-mono font-bold mt-2">
                      {inLowLevelSensor ? 'ALERTE SEC (1)' : 'OK FLUIDE (0)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Discrete Outputs (DO) and PLC Status */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    {locale === 'fr' ? 'Sorties Numériques (DO) & Mémoire' : 'Digital Outputs (DO) & Memory'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Relais / Transistor 2A</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                    outPumpMotor ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/10' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <div className="text-[10px] font-mono text-slate-500">%Q0.0 · Contacteur KM1</div>
                    <div className="text-sm font-bold mt-1">Pompe d'Exhaure / Évacuation</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${outPumpMotor ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`} />
                      <span className="text-xs font-mono font-bold">{outPumpMotor ? 'EN ROTATION (ON)' : 'A L\'ARRET (OFF)'}</span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                    outRunLamp ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <div className="text-[10px] font-mono text-slate-500">%Q0.1 · Voyant Pupitre</div>
                    <div className="text-sm font-bold mt-1">Voyant Marche Vert</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${outRunLamp ? 'bg-cyan-400' : 'bg-slate-700'}`} />
                      <span className="text-xs font-mono font-bold">{outRunLamp ? 'ALLUME' : 'ETEINT'}</span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                    outAlarmHorn ? 'bg-red-500/20 border-red-400 text-red-300 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <div className="text-[10px] font-mono text-slate-500">%Q0.2 · Klaxon Alarme</div>
                    <div className="text-sm font-bold mt-1">Sirène Défaut Salle des Machines</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${outAlarmHorn ? 'bg-red-500' : 'bg-slate-700'}`} />
                      <span className="text-xs font-mono font-bold">{outAlarmHorn ? 'ALARME ACTIVE !' : 'SILENCE'}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border bg-slate-900 border-slate-800 text-slate-300 flex flex-col justify-between">
                    <div className="text-[10px] font-mono text-slate-500">TON_01 · Temporisateur Sécurité</div>
                    <div className="text-xs font-bold mt-1">Délai Anti-Cavitant : {tonTimerAccumSec.toFixed(1)}s / {tonTimerPresetSec}s</div>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full transition-all"
                        style={{ width: `${(tonTimerAccumSec / tonTimerPresetSec) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Cycle Scan: {scanCycleTimeMs} ms</span>
                  <span>Compteur Scans: #{scanCounter}</span>
                  <span className="text-emerald-400 font-bold">Watchdog OK</span>
                </div>
              </div>
            </div>

            {/* CODE REPRESENTATION (LD / ST / FBD) */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-300 uppercase">
                  {plcLanguage === 'LD' ? 'Barreau Ladder Diagram (LD) CEI 61131-3' : plcLanguage === 'ST' ? 'Code Structured Text (ST) CEI 61131-3' : 'Diagramme Blocs Fonctionnels (FBD)'}
                </span>
                <span className="text-[11px] text-slate-500">POU: Main_Pump_Control · Cyclic Task (10 ms)</span>
              </div>

              {plcLanguage === 'LD' && (
                <div className="text-xs text-slate-300 space-y-3 font-mono overflow-x-auto py-2">
                  <div className="text-slate-400">// Rung 1: Auto-maintien et démarrage pompe avec sécurité niveau et thermique</div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-cyan-400 font-bold">|--</span>
                    <span className={`px-2 py-1 rounded border ${!inEmergencyStop ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-red-500 bg-red-500/20 text-red-400'}`}>
                      [/] E_Stop_NC (%I0.0)
                    </span>
                    <span className="text-cyan-400">---</span>
                    <span className={`px-2 py-1 rounded border ${!inThermalTrip ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-red-500 bg-red-500/20 text-red-400'}`}>
                      [/] Therm_Trip_NC (%I0.1)
                    </span>
                    <span className="text-cyan-400">---</span>
                    <span className={`px-2 py-1 rounded border ${!inStopPb ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-amber-500 bg-amber-500/20 text-amber-400'}`}>
                      [/] Stop_PB_NC (%I0.3)
                    </span>
                    <span className="text-cyan-400">---</span>
                    <span className={`px-2 py-1 rounded border ${inStartPb || outPumpMotor ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-700 bg-slate-900 text-slate-400'}`}>
                      [ ] (Start_PB OR Pump_KM1)
                    </span>
                    <span className="text-cyan-400">---</span>
                    <span className="px-2 py-1 rounded border border-cyan-500/50 bg-cyan-500/10 text-cyan-300">
                      [TON: PT:=T#3S]
                    </span>
                    <span className="text-cyan-400 font-bold">---( )</span>
                    <span className={`px-2 py-1 rounded font-bold border ${outPumpMotor ? 'border-emerald-400 bg-emerald-500/30 text-emerald-200' : 'border-slate-700 text-slate-500'}`}>
                      Pump_KM1 (%Q0.0)
                    </span>
                    <span className="text-cyan-400 font-bold">--|</span>
                  </div>
                </div>
              )}

              {plcLanguage === 'ST' && (
                <pre className="text-xs text-cyan-300 leading-relaxed overflow-x-auto py-1">
{`// Structured Text Routine per IEC 61131-3
PROGRAM Main_Pump_Control
VAR
    bEStopHealthy     AT %I0.0 : BOOL;
    bThermalRelayOK   AT %I0.1 : BOOL;
    bStartCommand     AT %I0.2 : BOOL;
    bStopCommand      AT %I0.3 : BOOL;
    bHighLevelTrigger AT %I0.4 : BOOL;
    bLowLevelAlarm    AT %I0.5 : BOOL;
    bPumpContactor    AT %Q0.0 : BOOL;
    tonSafetyDelay    : TON;
END_VAR

// Safety Interlock Check
IF NOT bEStopHealthy OR NOT bThermalRelayOK OR bLowLevelAlarm THEN
    bPumpContactor := FALSE;
    tonSafetyDelay(IN := FALSE);
ELSE
    // Run Command with Auto-latch
    IF (bStartCommand OR bHighLevelTrigger OR bPumpContactor) AND NOT bStopCommand THEN
        tonSafetyDelay(IN := TRUE, PT := T#3S);
        IF tonSafetyDelay.Q THEN
            bPumpContactor := TRUE;
        END_IF;
    ELSE
        bPumpContactor := FALSE;
        tonSafetyDelay(IN := FALSE);
    END_IF;
END_IF;
END_PROGRAM`}
                </pre>
              )}

              {plcLanguage === 'FBD' && (
                <div className="text-xs text-slate-300 space-y-2 py-2">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-400">AND_BLOCK_01 :</span>
                      <span>Inputs [ NOT(E_Stop) &amp; NOT(Thermal_Trip) &amp; (Start OR Level_High OR Latch) &amp; NOT(Stop) ]</span>
                    </div>
                    <span className="text-emerald-400 font-bold">--&gt; TON Timer (3.0s) --&gt; OUT: Pump_Contactor (%Q0.0)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 2: CLOSED-LOOP PID TUNING & ANTI-RESET WINDUP                      */}
      {/* ========================================================================= */}
      {activePillar === 'PID_CLOSED_LOOP' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
                  {locale === 'fr' ? 'Banc de Réglage PID Industriel & Anti-Saturation (Anti-Windup)' : 'Industrial PID Loop Tuning & Anti-Reset Windup'}
                </h2>
                <p className="text-xs text-slate-400">
                  Formulation parallèle ISA standard : u(t) = Kp·e(t) + (Kp/Ti)·∫e(t)dt + Kp·Td·(de/dt). Modélisation de boucle de niveau/débit.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAntiWindupEnabled(!antiWindupEnabled)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                    antiWindupEnabled
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  Anti-Windup: {antiWindupEnabled ? 'ACTIF' : 'DESACTIVE'}
                </button>
                <button
                  type="button"
                  onClick={() => setPidManualMode(!pidManualMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                    pidManualMode
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-emerald-500 text-slate-950 font-bold'
                  }`}
                >
                  Mode: {pidManualMode ? 'MANUEL' : 'AUTO'}
                </button>
              </div>
            </div>

            {/* PID INTERACTIVE CONTROLS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Consigne SP (Set Point)</span>
                  <span className="font-bold text-cyan-400 font-mono text-sm">{setPoint} %</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={setPoint}
                  onChange={(e) => setSetPoint(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 font-mono">Erreur e = {errorVal.toFixed(1)} %</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Gain Proportionnel Kp</span>
                  <span className="font-bold text-cyan-400 font-mono text-sm">{kp.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8.0"
                  step="0.1"
                  value={kp}
                  onChange={(e) => setKp(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 font-mono">Action P = {rawP.toFixed(1)} %</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Temps Intégral Ti</span>
                  <span className="font-bold text-cyan-400 font-mono text-sm">{tiSec.toFixed(1)} s</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="30.0"
                  step="0.5"
                  value={tiSec}
                  onChange={(e) => setTiSec(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 font-mono">Action I = {rawI.toFixed(1)} %</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Temps Dérivé Td</span>
                  <span className="font-bold text-cyan-400 font-mono text-sm">{tdSec.toFixed(2)} s</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="4.0"
                  step="0.1"
                  value={tdSec}
                  onChange={(e) => setTdSec(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 font-mono">Action D = {rawD.toFixed(1)} %</div>
              </div>
            </div>

            {/* LIVE CURVE & OUTPUT GAUGE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* SVG Trend Chart */}
              <div className="lg:col-span-2 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <span className="w-2.5 h-1 bg-cyan-400 rounded" />
                      Mesure PV (Process Variable) : {processVar.toFixed(1)} %
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-1 bg-emerald-400 rounded" />
                      Consigne SP : {setPoint} %
                    </span>
                  </div>
                  <span className="text-slate-500">Échantillonnage 400 ms</span>
                </div>

                <div className="relative h-44 bg-slate-900/60 rounded-lg p-2 border border-slate-800/80">
                  <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="400" y2="30" stroke="#1e293b" strokeDasharray="2 2" />
                    <line x1="0" y1="60" x2="400" y2="60" stroke="#1e293b" strokeDasharray="2 2" />
                    <line x1="0" y1="90" x2="400" y2="90" stroke="#1e293b" strokeDasharray="2 2" />

                    {/* Setpoint Line */}
                    <line
                      x1="0"
                      y1={120 - (setPoint / 100) * 120}
                      x2="400"
                      y2={120 - (setPoint / 100) * 120}
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    {/* PV Trend Line */}
                    {historyPV.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={historyPV
                          .map((val, idx) => {
                            const x = (idx / (historyPV.length - 1)) * 400;
                            const y = 120 - (val / 100) * 120;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />
                    )}
                  </svg>
                </div>
              </div>

              {/* PID Controller Output Gauge */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {locale === 'fr' ? 'Commande Sortie Régulateur CV (0-100%)' : 'Controller Output CV (0-100%)'}
                </div>

                <div className="text-center py-2">
                  <div className="text-4xl font-extrabold font-mono text-cyan-400">
                    {clampedOutput.toFixed(1)} %
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    {pidManualMode ? 'Commande Manuelle Forcée' : 'Commande Automatique vanne / variateur'}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Pondération P (Proportionnel)</span>
                    <span className="text-cyan-300">{rawP.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Pondération I (Intégral)</span>
                    <span className="text-cyan-300">{rawI.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Pondération D (Dérivée)</span>
                    <span className="text-cyan-300">{rawD.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                  💡 <strong className="text-slate-200">Recommandation terrain :</strong> En cas de pompage de niveau, réduire le gain Kp et allonger Ti pour éviter les coups de bélier hydrauliques.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 3: VFD & FIELD-ORIENTED VECTOR CONTROL (FOC)                       */}
      {/* ========================================================================= */}
      {activePillar === 'VFD_FOC_DRIVES' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  {locale === 'fr' ? 'Entraînements à Fréquence Variable (VFD) & Contrôle Vectoriel de Flux' : 'Variable Frequency Drives & Field-Oriented Control (FOC)'}
                </h2>
                <p className="text-xs text-slate-400">
                  Découplage flux/couple (id / iq), tenue diélectrique des longs câbles moteurs (surtenseurs dV/dt) et hacheur de freinage rhéostatique.
                </p>
              </div>

              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['FOC_VECTOR', 'SCALAR_VF', 'DTC'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setVfdControlMode(mode)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      vfdControlMode === mode ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode === 'FOC_VECTOR' ? 'FOC Vectoriel' : mode === 'SCALAR_VF' ? 'Scalaire U/f' : 'DTC Direct'}
                  </button>
                ))}
              </div>
            </div>

            {/* VFD CONTROLS & MOTOR PARAMETERS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Consigne Vitesse</span>
                  <span className="font-bold text-cyan-400 font-mono">{motorSpeedRpmRef} tr/min</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1500"
                  step="50"
                  value={motorSpeedRpmRef}
                  onChange={(e) => setMotorSpeedRpmRef(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 font-mono">Fréquence stator : {outputFrequencyHz.toFixed(1)} Hz</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Puissance Moteur Pn</span>
                  <span className="font-bold text-cyan-400 font-mono">{motorNominalPowerKw} kW</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="315"
                  step="15"
                  value={motorNominalPowerKw}
                  onChange={(e) => setMotorNominalPowerKw(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 font-mono">Courant nominal In : {motorNominalCurrentA} A</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Longueur Câble Moteur</span>
                  <span className="font-bold text-cyan-400 font-mono">{cableLengthMeters} m</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={cableLengthMeters}
                  onChange={(e) => setCableLengthMeters(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 font-mono">Onde réfléchie de tension</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Filtre dV/dt ou Sinus</span>
                  <span className={`font-bold font-mono text-xs ${useDvDtFilter ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {useDvDtFilter ? 'INSTALLE' : 'ABSENT (DANGER)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setUseDvDtFilter(!useDvDtFilter)}
                  className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                    useDvDtFilter ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-red-500/20 border-red-500 text-red-300'
                  }`}
                >
                  {useDvDtFilter ? 'Désactiver Filtre' : 'Activer Filtre dV/dt'}
                </button>
                <div className="text-[10px] text-slate-500 font-mono">Protection bobinage moteur</div>
              </div>
            </div>

            {/* FOC ELECTRICAL DISPLAY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Décomposition Vectorielle Park (id, iq)</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Courant Magnétisant id (Flux)</span>
                    <span className="font-bold text-cyan-300">{idMagnetizingCurrentA} A</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Courant Actif iq (Couple)</span>
                    <span className="font-bold text-emerald-300">{iqTorqueCurrentA} A</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Couple Électromécanique Estimé</span>
                    <span className="font-bold text-white">{estimatedTorqueNm} N·m</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Tension Crête Réfléchie dV/dt aux Bornes</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-center py-2">
                  <div className={`text-3xl font-extrabold font-mono ${peakOvervoltageVolts > 1000 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {peakOvervoltageVolts} V crête
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {peakOvervoltageVolts > 1000
                      ? '⚠️ RISQUE DE CLAQUAGE DE L\'ISOLATION MOTEUR (CEI 60034-25)'
                      : '✅ Conforme tenue diélectrique classe H'}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Bus continu : {dcBusVoltage} V DC · Câble non filtré &gt; 50m amplifie les réflexions d'ondes dues à l'impédance caractéristique.
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Hacheur &amp; Résistance de Freinage</span>
                  <Flame className="w-4 h-4 text-rose-400" />
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Puissance Freinage Crête</span>
                    <span className="font-bold text-rose-300">{brakingPeakPowerKw} kW</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Valeur Résistance R_br</span>
                    <span className="font-bold text-white">{brakingResistorOhms} Ω</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Dissipation obligatoire lors de la décélération brutale d'une centrifugeuse ou convoyeur en descente pour éviter l'alarme surtension bus DC.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 4: SAFETY INSTRUMENTED SYSTEMS (SIS) & SIL VERIFICATION           */}
      {/* ========================================================================= */}
      {activePillar === 'SIL_SAFETY_ESD' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  {locale === 'fr' ? 'Systèmes Instrumentés de Sécurité (SIS / ESD) & Certification SIL' : 'Safety Instrumented Systems (SIS / ESD) & SIL Allocation'}
                </h2>
                <p className="text-xs text-slate-400">
                  Calcul de la probabilité moyenne de défaillance à la sollicitation (PFDavg) selon CEI 61508 / CEI 61511 et architectures de vote 1oo1, 1oo2, 2oo3.
                </p>
              </div>

              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['1oo1', '1oo2', '2oo3'] as const).map((arch) => (
                  <button
                    key={arch}
                    onClick={() => setArchitectureVoting(arch)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      architectureVoting === arch ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Architecture {arch}
                  </button>
                ))}
              </div>
            </div>

            {/* SIL INPUT PARAMETERS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Taux Défaillance λ_DU (FIT)</span>
                  <span className="font-bold text-red-400 font-mono">{(lambdaDU_perHour * 1e9).toFixed(0)} FIT</span>
                </div>
                <input
                  type="range"
                  min="0.2e-6"
                  max="5.0e-6"
                  step="0.2e-6"
                  value={lambdaDU_perHour}
                  onChange={(e) => setLambdaDU_perHour(parseFloat(e.target.value))}
                  className="w-full accent-red-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 font-mono">λ_DU = {lambdaDU_perHour.toExponential(2)} h⁻¹</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Intervalle Proof-Test (Ti)</span>
                  <span className="font-bold text-red-400 font-mono">{proofTestIntervalHours} h ({(proofTestIntervalHours / 8760).toFixed(1)} an)</span>
                </div>
                <input
                  type="range"
                  min="2190"
                  max="26280"
                  step="2190"
                  value={proofTestIntervalHours}
                  onChange={(e) => setProofTestIntervalHours(parseInt(e.target.value, 10))}
                  className="w-full accent-red-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 font-mono">Essai périodique périodique de déclenchement</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Couverture Diagnostic (DC)</span>
                  <span className="font-bold text-red-400 font-mono">{diagnosticCoveragePct} %</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="99"
                  step="1"
                  value={diagnosticCoveragePct}
                  onChange={(e) => setDiagnosticCoveragePct(parseInt(e.target.value, 10))}
                  className="w-full accent-red-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 font-mono">Autotests et surveillance d'impédance</div>
              </div>
            </div>

            {/* SIL METRICS RESULTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-2">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase">Probabilité de Panne PFDavg</div>
                <div className="text-3xl font-extrabold font-mono text-cyan-400">{pfdAvgValue.toExponential(2)}</div>
                <div className="text-xs text-slate-400 font-mono">Probability of Failure on Demand</div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-2">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase">Niveau SIL Atteint</div>
                <div className="text-3xl font-extrabold font-mono text-emerald-400">{achievedSil}</div>
                <div className="text-xs text-slate-400 font-mono">Norme CEI 61508 / CEI 61511</div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-2">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase">Facteur Réduction du Risque (RRF)</div>
                <div className="text-3xl font-extrabold font-mono text-amber-400">{riskReductionFactor} ×</div>
                <div className="text-xs text-slate-400 font-mono">RRF = 1 / PFDavg</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-red-400 uppercase font-mono">Architecture {architectureVoting} dans l'Industrie Pétrolière et Chimique :</div>
              <p className="leading-relaxed">
                {architectureVoting === '1oo1' && '1oo1 (One out of One) : Aucune redondance matérielle. Toute défaillance non détectée empêche le déclenchement de sécurité. Généralement limité à SIL 1.'}
                {architectureVoting === '1oo2' && '1oo2 (One out of Two) : Haute sécurité. Le déclenchement s\'active si au moins un des deux canaux détecte le dépassement du seuil critique. Tolérance aux pannes matérielles.'}
                {architectureVoting === '2oo3' && '2oo3 (Two out of Three) : Vote majoritaire combinant sécurité maximale et haute disponibilité. Élimine les arrêts intempestifs de production en ignorant un capteur défaillant.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 5: FIELDBUS & 4-20 mA ANALOG INSTRUMENTATION                      */}
      {/* ========================================================================= */}
      {activePillar === 'FIELDBUS_COMM_IO' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Network className="w-5 h-5 text-cyan-400" />
                  {locale === 'fr' ? 'Réseaux de Terrain Industriels & Boucles Analogiques 4–20 mA' : 'Industrial Fieldbuses & 4–20 mA Analog Instrument Loops'}
                </h2>
                <p className="text-xs text-slate-400">
                  Étalonnage de transmetteurs de pression/température, résistance de charge HART 250 Ω et protocoles temps réel Ethernet.
                </p>
              </div>

              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['PROFINET_IRT', 'MODBUS_TCP', 'ETHERCAT', 'HART_ANALOG'] as const).map((proto) => (
                  <button
                    key={proto}
                    onClick={() => setActiveProtocol(proto)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      activeProtocol === proto ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {proto.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* 4-20 mA LOOP INTERACTIVE CALIBRATOR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase">Simulateur Calibrateur 4–20 mA</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Courant Mesuré</span>
                    <span className="font-bold text-cyan-300 text-sm">{sensorRawMa.toFixed(2)} mA</span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="20.0"
                    step="0.1"
                    value={sensorRawMa}
                    onChange={(e) => setSensorRawMa(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-500">Zéro (4 mA)</div>
                    <div className="font-bold text-white">{sensorRangeMin} bar</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-500">Échelle (20 mA)</div>
                    <div className="font-bold text-white">{sensorRangeMax} bar</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center flex flex-col justify-between">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase">Grandeur Physique Échelonnée (PV)</div>
                <div className="py-2">
                  <div className="text-4xl font-extrabold font-mono text-emerald-400">{physicalEngValue} bar</div>
                  <div className="text-xs text-slate-400 font-mono mt-1">Pression Circuit Hydraulique</div>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Formule: PV = Min + [(I - 4mA)/16mA] × (Max - Min)
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase">Budget Tension Boucle 24 V DC</div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Résistance Câble ({wireResistanceOhms} Ω)</span>
                    <span className="text-white">{((sensorRawMa / 1000) * wireResistanceOhms).toFixed(2)} V</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shunt Entrée PLC (250 Ω HART)</span>
                    <span className="text-white">{((sensorRawMa / 1000) * 250).toFixed(2)} V</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold">
                    <span className="text-slate-300">Chute de Tension Totale</span>
                    <span className="text-amber-300">{loopVoltageDrop} V</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Tension Disponible Transmetteur</span>
                    <span>{(24.0 - loopVoltageDrop).toFixed(2)} V (&gt; 12V OK)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 6: PLC HARDWARE ARCHITECTURES & REDUNDANCY                         */}
      {/* ========================================================================= */}
      {activePillar === 'PLC_ARCHITECTURE_REDUNDANCY' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  {locale === 'fr' ? 'Architecture Matérielle PLC & Redondance Hot-Standby' : 'PLC Hardware Rack & Dual Hot-Standby Redundancy'}
                </h2>
                <p className="text-xs text-slate-400">
                  Synchronisation optique ultra-rapide entre CPU maître et réserve sans perte de cycle (Bumpless Transfer &lt; 20 ms).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cpuAStatus === 'PRIMARY_RUN' ? simulateCpuAFailure : restoreCpuA}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                    cpuAStatus === 'PRIMARY_RUN'
                      ? 'bg-rose-500/20 border border-rose-400 text-rose-300'
                      : 'bg-emerald-500 text-slate-950'
                  }`}
                >
                  {cpuAStatus === 'PRIMARY_RUN' ? 'Simuler Panne CPU A' : 'Rétablir CPU A'}
                </button>
              </div>
            </div>

            {/* DUAL RACK VISUAL ARCHITECTURE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CPU Rack A */}
              <div className={`p-5 rounded-xl border transition-all ${
                cpuAStatus === 'PRIMARY_RUN'
                  ? 'bg-slate-950 border-cyan-400 ring-2 ring-cyan-400/30'
                  : 'bg-slate-950/60 border-slate-800 opacity-80'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="font-mono text-xs font-bold text-cyan-300">RACK 01 · CPU A (Maître Initial)</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    cpuAStatus === 'PRIMARY_RUN' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {cpuAStatus}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-4 text-center font-mono text-xs">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">PSU</div>
                    <div className="font-bold text-emerald-400 text-xs">24V OK</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">CPU</div>
                    <div className="font-bold text-cyan-400 text-xs">{cpuAStatus === 'PRIMARY_RUN' ? 'EXEC' : 'OFF'}</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">SYNC</div>
                    <div className="font-bold text-cyan-400 text-xs">OPTIC</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">ETH</div>
                    <div className="font-bold text-emerald-400 text-xs">MRP RING</div>
                  </div>
                </div>
              </div>

              {/* CPU Rack B */}
              <div className={`p-5 rounded-xl border transition-all ${
                cpuBStatus === 'PRIMARY_RUN'
                  ? 'bg-slate-950 border-emerald-400 ring-2 ring-emerald-400/30'
                  : 'bg-slate-950/60 border-slate-800 opacity-80'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="font-mono text-xs font-bold text-emerald-300">RACK 02 · CPU B (Réserve Chaude)</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    cpuBStatus === 'PRIMARY_RUN' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {cpuBStatus}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-4 text-center font-mono text-xs">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">PSU</div>
                    <div className="font-bold text-emerald-400 text-xs">24V OK</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">CPU</div>
                    <div className="font-bold text-emerald-400 text-xs">{cpuBStatus === 'PRIMARY_RUN' ? 'ACTIVE' : 'SYNC'}</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">SYNC</div>
                    <div className="font-bold text-cyan-400 text-xs">OPTIC</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500">ETH</div>
                    <div className="font-bold text-emerald-400 text-xs">MRP RING</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Remote I/O drops */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Anneau Redondant MRP (Media Redundancy Protocol) : Îlots E/S Déportés RIO 01 &amp; RIO 02 connectés</span>
              </div>
              <span className="text-cyan-400 font-bold">Temps de Bascule Reconfiguration &lt; 20 ms</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PILLAR 7: CAMEROON HYDRO & INDUSTRIAL FORENSICS                           */}
      {/* ========================================================================= */}
      {activePillar === 'CAMEROON_HYDRO_INDUSTRY' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                {locale === 'fr' ? 'Cas Réels & Retours d\'Expérience Industriels au Cameroun' : 'Real Cameroon Industrial & Hydro Automation Forensics'}
              </h2>
              <p className="text-xs text-slate-400">
                Infrastructures d'automatismes critiques au Cameroun : Régulation de turbines hydroélectriques, variateurs cimenterie et automatisation d'embouteillage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Nachtigal Hydro */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  1. Centrale Hydroélectrique de Nachtigal (420 MW)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Régulation de vitesse et de débit des 7 turbines Francis (60 MW chacune). Automates de sécurité redondants contrôlant les vannes de prise d'eau, les groupes oléopneumatiques haute pression (160 bar) et l'asservissement des aubes directrices via bus Profinet déterministe.
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                  Opérateur : NHPC / EDF / SONATREL
                </div>
              </div>

              {/* CIMENCAM Cement */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase">
                  2. Cimenteries CIMENCAM (Nomayos &amp; Figuil)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pilotage des broyeurs verticaux et ventilateurs de tirage des fours par variateurs moyenne tension 6.6 kV. Automates DCS régulant le débit de matière première, les filtres à manches et la température du four rotatif avec boucles PID multi-variables.
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                  Opérateur : CIMENCAM / Groupe LafargeHolcim
                </div>
              </div>

              {/* SABC Breweries */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  3. Lignes d'Embouteillage SABC (Bassa &amp; Ndokoti)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Lignes robotisées à haute cadence (40 000 bouteilles/heure). Réseaux de communication industriels EtherCAT et automates de sécurité SIL 3 (barrières immatérielles, arrêts d'urgence décentralisés) assurant la sécurité des opérateurs et la traçabilité des lots.
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                  Opérateur : Société Anonyme des Brasseries du Cameroun (Castel)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
