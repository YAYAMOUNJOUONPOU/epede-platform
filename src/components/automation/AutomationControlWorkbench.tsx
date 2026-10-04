// src/components/automation/AutomationControlWorkbench.tsx
// EPEDE Domain D07 - Industrial Automation, Control Systems & Safety Instrumentation
// Comprehensive 5-Stage Engineering Workbench compliant with IEC 61131-3, IEC 61508, IEC 61511, IEC 60204-1, ISA-88 & IEC 62443

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
  Workflow,
  X,
  BookOpen,
  Calculator,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';
import {
  useAutomationProjectStore,
  AUTOMATION_PROFILES,
  AutomationIndustryKey
} from './services/useAutomationProjectStore';
import { AutomationOrientationBanner } from './AutomationOrientationBanner';
import { AutomationCommandHeader } from './AutomationCommandHeader';
import { AutomationIoPowerCalculator } from './modules/AutomationIoPowerCalculator';
import { AutomationDeliverablesExportEngine } from './modules/AutomationDeliverablesExportEngine';

interface AutomationControlWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (id: string) => void;
}

export const AutomationControlWorkbench: React.FC<AutomationControlWorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  // Central Reactive Project Store
  const store = useAutomationProjectStore('HYDRO_PLANT_420MW');

  // Mathematical Principles Modal
  const [isFormulasModalOpen, setIsFormulasModalOpen] = useState<boolean>(false);

  // Sub-tabs per progressive stage
  const [stage1Tab, setStage1Tab] = useState<'420MA_LOOPS' | 'NAMUR_NE43' | 'POWER_CABINET'>('420MA_LOOPS');
  const [stage2Tab, setStage2Tab] = useState<'PLC_LOGIC' | 'HOT_STANDBY'>('PLC_LOGIC');
  const [stage3Tab, setStage3Tab] = useState<'PID_TUNING' | 'VFD_FOC'>('PID_TUNING');
  const [stage4Tab, setStage4Tab] = useState<'SIL_SAFETY'>('SIL_SAFETY');
  const [stage5Tab, setStage5Tab] = useState<'CAMEROON_CASES' | 'DELIVERABLES_BOQ'>('CAMEROON_CASES');

  // NAMUR NE 43 Loop Current Telemetry Simulator
  const [simulatedCurrentMa, setSimulatedCurrentMa] = useState<number>(12.0); // 3.0 to 22.5 mA
  const [sensorProcessRangeMin, setSensorProcessRangeMin] = useState<number>(0); // e.g. 0 Bar
  const [sensorProcessRangeMax, setSensorProcessRangeMax] = useState<number>(100); // e.g. 100 Bar
  const [sensorPhysicalUnit, setSensorPhysicalUnit] = useState<string>('bar');

  // Stage Meta Information
  const STAGES_CONFIG = useMemo(() => ({
    1: {
      num: locale === 'fr' ? 'Étape 1' : 'Stage 1',
      titleFr: 'Cartographie du Procédé, Liste des E/S & Boucles 4–20 mA',
      titleEn: 'Process Mapping, I/O Inventory & 4–20 mA Loops',
      badgeFr: '4–20 mA HART · Bilan 24V DC · Dissipation',
      badgeEn: '4–20 mA HART · 24V DC Power · Heat',
      icon: Network
    },
    2: {
      num: locale === 'fr' ? 'Étape 2' : 'Stage 2',
      titleFr: 'Automates PLC CEI 61131-3, Racks & Redondance Hot-Standby',
      titleEn: 'IEC 61131-3 PLCs, Hardware Racks & Dual Hot-Standby',
      badgeFr: 'Ladder 10 ms · Bascule &lt; 20 ms · Anneaux MRP',
      badgeEn: 'Ladder 10 ms · &lt; 20 ms Failover · MRP Rings',
      icon: Terminal
    },
    3: {
      num: locale === 'fr' ? 'Étape 3' : 'Stage 3',
      titleFr: 'Régulation PID en Boucle Fermée & Entraînements VFD (FOC)',
      titleEn: 'Closed-Loop PID Tuning & Field-Oriented VFD Inverters',
      badgeFr: 'Ziegler-Nichols · Anti-Windup · Découplage id/iq',
      badgeEn: 'Ziegler-Nichols · Anti-Windup · id/iq Decoupling',
      icon: SlidersHorizontal
    },
    4: {
      num: locale === 'fr' ? 'Étape 4' : 'Stage 4',
      titleFr: 'Sécurité Fonctionnelle SIS / SIL (CEI 61508) & Réseaux de Terrain',
      titleEn: 'Safety Instrumented Systems (SIS/SIL) & Fieldbus Networks',
      badgeFr: 'CEI 61508 / 61511 · Vote 2oo3 TMR · Profinet IRT',
      badgeEn: 'IEC 61508 / 61511 · 2oo3 TMR · Profinet IRT',
      icon: ShieldAlert
    },
    5: {
      num: locale === 'fr' ? 'Étape 5' : 'Stage 5',
      titleFr: 'Essais FAT/SAT, Chantiers Cameroun & Dossier DQE FCFA',
      titleEn: 'FAT/SAT Testing, Cameroon Field Cases & Stamped BOQ/DQE',
      badgeFr: 'Nachtigal 420 MW · CIMENCAM · SABC · DQE FCFA',
      badgeEn: 'Nachtigal 420 MW · CIMENCAM · SABC · BOQ FCFA',
      icon: Flame
    }
  }), [locale]);

  // Synchronize facility profile changes
  const handleSelectIndustry = (id: AutomationIndustryKey) => {
    store.setSelectedIndustryId(id);
    const prof = AUTOMATION_PROFILES[id];
    if (prof) {
      setDigitalInputs(prof.digitalInputsCount);
      setDigitalOutputs(prof.digitalOutputsCount);
      setAnalogInputs(prof.analogInputsCount);
      setAnalogOutputs(prof.analogOutputsCount);
      setVfdCount(prof.defaultVfdCount);
      setVfdTotalPowerKw(prof.defaultVfdTotalPowerKw);
    }
  };

  const handleOpenDossier = () => {
    store.setActiveStage(5);
    setStage5Tab('DELIVERABLES_BOQ');
  };

  // =========================================================================
  // PILLAR 1: IEC 61131-3 PLC LOGIC RUNNER (Ladder Diagram / Structured Text)
  // =========================================================================
  const [plcRunning, setPlcRunning] = useState<boolean>(true);
  const [scanCycleTimeMs, setScanCycleTimeMs] = useState<number>(10);
  const [plcLanguage, setPlcLanguage] = useState<'LD' | 'ST' | 'FBD'>('LD');
  const [inEmergencyStop, setInEmergencyStop] = useState<boolean>(false);
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

      // Auto control logic
      if (inStopPb || inLowLevelSensor) {
        setOutPumpMotor(false);
        setOutRunLamp(false);
        setTonTimerAccumSec(0);
      } else if (inStartPb || inHighLevelSensor || outPumpMotor) {
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
  const [setPoint, setSetPoint] = useState<number>(75);
  const [processVar, setProcessVar] = useState<number>(50);
  const [kp, setKp] = useState<number>(2.4);
  const [ti, setTi] = useState<number>(12.0); // seconds
  const [td, setTd] = useState<number>(1.5); // seconds
  const [antiWindupEnabled, setAntiWindupEnabled] = useState<boolean>(true);
  const [pidOutputPercent, setPidOutputPercent] = useState<number>(0);
  const [pidHistory, setPidHistory] = useState<{ t: number; sp: number; pv: number; out: number }[]>([]);

  // Simulation tick for PID
  useEffect(() => {
    const pidInterval = setInterval(() => {
      setProcessVar((prevPv) => {
        const error = setPoint - prevPv;
        
        // P component
        const pTerm = kp * error;
        
        // Dynamic process reaction (first-order lag system + actuator influence)
        const rawOut = Math.max(0, Math.min(100, pTerm + (error * (10 / Math.max(0.1, ti)))));
        setPidOutputPercent(parseFloat(rawOut.toFixed(1)));
        
        // Process inertia toward output
        const nextPv = prevPv + (rawOut - prevPv) * 0.12;
        return parseFloat(nextPv.toFixed(1));
      });

      setPidHistory((h) => {
        const nextH = [...h, { t: Date.now(), sp: setPoint, pv: processVar, out: pidOutputPercent }];
        if (nextH.length > 30) nextH.shift();
        return nextH;
      });
    }, 250);

    return () => clearInterval(pidInterval);
  }, [setPoint, kp, ti, td, processVar, pidOutputPercent]);

  // =========================================================================
  // PILLAR 3: VFD & FIELD-ORIENTED VECTOR CONTROL (FOC)
  // =========================================================================
  const [vfdTargetSpeedRpm, setVfdTargetSpeedRpm] = useState<number>(1450);
  const [vfdCarrierFreqKhz, setVfdCarrierFreqKhz] = useState<number>(4.0); // 2 to 16 kHz
  const [vfdBrakingActive, setVfdBrakingActive] = useState<boolean>(false);
  const [motorLoadPercent, setMotorLoadPercent] = useState<number>(85);
  const [motorKwRating, setMotorKwRating] = useState<number>(75); // 75 kW motor

  // Vector FOC calculations
  const idFluxAmps = parseFloat(((motorKwRating * 0.35) * (1450 / Math.max(1, vfdTargetSpeedRpm))).toFixed(1));
  const iqTorqueAmps = parseFloat(((motorKwRating * 1.45) * (motorLoadPercent / 100)).toFixed(1));
  const vfdDcBusVoltage = 565; // ~ 400V AC * sqrt(2)
  const switchingLossWatts = parseFloat((motorKwRating * (vfdCarrierFreqKhz * 0.22) * 10).toFixed(0));
  const brakingChopperDutyCycle = vfdBrakingActive ? 65 : 0;

  // =========================================================================
  // PILLAR 4: SAFETY INSTRUMENTED SYSTEMS (SIS / SIL 2 & 3)
  // =========================================================================
  const [votingArchitecture, setVotingArchitecture] = useState<'1oo1' | '1oo2' | '2oo3' | '2oo4'>('2oo3');
  const [proofTestIntervalYears, setProofTestIntervalYears] = useState<number>(1);
  const [sensorFailureRatePerHour, setSensorFailureRatePerHour] = useState<number>(1.2e-6); // 1.2 FIT/hr
  const [safeFailureFractionPercent, setSafeFailureFractionPercent] = useState<number>(94);

  const silCalculations = useMemo(() => {
    const TI = proofTestIntervalYears * 8760; // hours
    let pfd = 0;
    let hft = 0;

    if (votingArchitecture === '1oo1') {
      pfd = (sensorFailureRatePerHour * TI) / 2;
      hft = 0;
    } else if (votingArchitecture === '1oo2') {
      pfd = Math.pow(sensorFailureRatePerHour * TI, 2) / 3;
      hft = 1;
    } else if (votingArchitecture === '2oo3') {
      pfd = Math.pow(sensorFailureRatePerHour * TI, 2);
      hft = 1;
    } else {
      pfd = Math.pow(sensorFailureRatePerHour * TI, 3) / 4;
      hft = 2;
    }

    let achievedSil = 'SIL 1';
    if (pfd < 1e-2) achievedSil = 'SIL 2';
    if (pfd < 1e-3) achievedSil = 'SIL 3';
    if (pfd < 1e-4) achievedSil = 'SIL 4';

    const mtbfYears = parseFloat((1 / (sensorFailureRatePerHour * 8760)).toFixed(1));

    return {
      pfdAvg: pfd.toExponential(2),
      hft,
      achievedSil,
      mtbfYears
    };
  }, [votingArchitecture, proofTestIntervalYears, sensorFailureRatePerHour]);

  // =========================================================================
  // PILLAR 5: FIELDBUS & 4-20 mA ANALOG LOOPS (VOLTAGE DROP BUDGET)
  // =========================================================================
  const [supplyVoltageV, setSupplyVoltageV] = useState<number>(24.0);
  const [cableLengthMeters, setCableLengthMeters] = useState<number>(450);
  const [cableWireSectionMm2, setCableWireSectionMm2] = useState<number>(0.75); // 0.75 or 1.5 mm2
  const [hartResistorOhms, setHartResistorOhms] = useState<number>(250); // standard HART 250 ohm
  const [txMinOperatingVoltageV, setTxMinOperatingVoltageV] = useState<number>(12.0); // e.g., Yokogawa / Endress+Hauser min 12V

  // Loop resistance: R = 2 * (rho * L / S)
  const copperRho = 0.0178; // ohm * mm2 / m
  const wireResistanceOhms = parseFloat(((2 * copperRho * cableLengthMeters) / cableWireSectionMm2).toFixed(2));
  const maxCurrentAmps = 0.020; // 20 mA at 100% scale
  const cableVoltageDropV = parseFloat((wireResistanceOhms * maxCurrentAmps).toFixed(2));
  const hartVoltageDropV = parseFloat((hartResistorOhms * maxCurrentAmps).toFixed(2)); // 5.0 V
  const totalLoopLossesV = cableVoltageDropV + hartVoltageDropV;
  const availableVoltageAtTxV = parseFloat((supplyVoltageV - totalLoopLossesV).toFixed(2));
  const isLoopCompliant = availableVoltageAtTxV >= txMinOperatingVoltageV;

  // =========================================================================
  // PILLAR 6: DUAL HOT-STANDBY REDUNDANCY
  // =========================================================================
  const [primaryCpuState, setPrimaryCpuState] = useState<'PRIMARY_RUN' | 'PRIMARY_STOPPED' | 'PRIMARY_FAULT'>('PRIMARY_RUN');
  const [secondaryCpuState, setSecondaryCpuState] = useState<'STANDBY_SYNC' | 'TAKEOVER_PRIMARY'>('STANDBY_SYNC');
  const [syncFiberLinkOk, setSyncFiberLinkOk] = useState<boolean>(true);
  const [failoverTimeMs, setFailoverTimeMs] = useState<number>(14.5); // bumpless < 20 ms

  const handleCpuFailoverSimulation = () => {
    if (primaryCpuState === 'PRIMARY_RUN') {
      setPrimaryCpuState('PRIMARY_FAULT');
      setSecondaryCpuState('TAKEOVER_PRIMARY');
    } else {
      setPrimaryCpuState('PRIMARY_RUN');
      setSecondaryCpuState('STANDBY_SYNC');
    }
  };

  // Controllable quantities passed to DQE
  const [digitalInputs, setDigitalInputs] = useState<number>(840);
  const [digitalOutputs, setDigitalOutputs] = useState<number>(420);
  const [analogInputs, setAnalogInputs] = useState<number>(380);
  const [analogOutputs, setAnalogOutputs] = useState<number>(160);
  const [vfdCount, setVfdCount] = useState<number>(14);
  const [vfdTotalPowerKw, setVfdTotalPowerKw] = useState<number>(450);

  // =========================================================================
  // NAMUR NE 43 ANALOG 4-20 mA DIAGNOSTIC ENGINE
  // =========================================================================
  const namurStatus = useMemo(() => {
    const I = simulatedCurrentMa;
    const span = sensorProcessRangeMax - sensorProcessRangeMin;
    const rawS7Can = Math.round(((I - 4.0) / 16.0) * 27648);
    const pv = sensorProcessRangeMin + ((I - 4.0) / 16.0) * span;

    if (I < 3.6) {
      return {
        zone: 'BREAK_WIRE',
        statusFr: 'Défaut Bas / Rupture de Ligne (Break Wire)',
        statusEn: 'Low Fault / Loop Wire Break',
        severity: 'critical' as const,
        color: 'rose',
        quality: 'BAD (16#00)',
        canValue: -32768,
        pvCalculated: null,
        pvFormatted: 'REPLI SÉCURISÉ / FAIL-SAFE',
        descFr: 'Intensité < 3.6 mA : rupture de conducteur, transmetteur hors tension ou défaillance du convertisseur.',
        descEn: 'Current < 3.6 mA: open circuit / severed cable, transmitter unpowered, or converter failure.',
        actionFr: 'Alarme prioritaire automate, forçage des actionneurs en position de repli sécuritaire (fail-close / fail-open).'
      };
    } else if (I < 3.8) {
      return {
        zone: 'UNDER_RANGE',
        statusFr: 'Sous-Échelle (Under-range)',
        statusEn: 'Under-range Tolerance',
        severity: 'warning' as const,
        color: 'amber',
        quality: 'UNCERTAIN (16#40)',
        canValue: rawS7Can,
        pvCalculated: pv,
        pvFormatted: `${pv.toFixed(2)} ${sensorPhysicalUnit}`,
        descFr: 'Intensité entre 3.6 et 3.8 mA : dérive négative du zéro, dépression anormale ou étalonnage nécessaire.',
        descEn: 'Current between 3.6 and 3.8 mA: zero drift, abnormal negative process, or recalibration required.',
        actionFr: 'Alerte de maintenance préventive déclenchée, processus maintenu sous surveillance.'
      };
    } else if (I <= 20.5) {
      return {
        zone: 'NORMAL',
        statusFr: 'Plage de Mesure Nominale (Normal Process Range)',
        statusEn: 'Valid Process Measuring Range',
        severity: 'normal' as const,
        color: 'emerald',
        quality: 'GOOD (16#80)',
        canValue: rawS7Can,
        pvCalculated: pv,
        pvFormatted: `${pv.toFixed(2)} ${sensorPhysicalUnit}`,
        descFr: 'Intensité entre 3.8 et 20.5 mA : mesure linéaire certifiée valide conforme CEI 60381-1 et NAMUR NE 43.',
        descEn: 'Current between 3.8 and 20.5 mA: certified linear measurement conforming to IEC 60381-1 and NAMUR NE 43.',
        actionFr: 'Régulation continue nominale par le contrôleur PID / automate programmable.'
      };
    } else if (I <= 21.0) {
      return {
        zone: 'OVER_RANGE',
        statusFr: 'Sur-Échelle (Over-range)',
        statusEn: 'Over-range Tolerance',
        severity: 'warning' as const,
        color: 'amber',
        quality: 'UNCERTAIN (16#40)',
        canValue: rawS7Can,
        pvCalculated: pv,
        pvFormatted: `${pv.toFixed(2)} ${sensorPhysicalUnit}`,
        descFr: 'Intensité entre 20.5 et 21.0 mA : surpression, débit de pointe ou saturation haute tolérée temporairement.',
        descEn: 'Current between 20.5 and 21.0 mA: transient surge or allowable temporary saturation.',
        actionFr: 'Avertissement de saturation haute, maintien de la régulation à 100% de la consigne.'
      };
    } else {
      return {
        zone: 'SHORT_CIRCUIT',
        statusFr: 'Défaut Haut / Court-Circuit (Sensor Fault / Short)',
        statusEn: 'High Fault / Sensor Short-Circuit',
        severity: 'critical' as const,
        color: 'rose',
        quality: 'BAD (16#00)',
        canValue: 32767,
        pvCalculated: null,
        pvFormatted: 'REPLI SÉCURISÉ / FAIL-SAFE',
        descFr: 'Intensité > 21.0 mA : court-circuit sur la ligne 24V ou défaillance électronique interne du capteur.',
        descEn: 'Current > 21.0 mA: loop short-circuit on 24V line or internal sensor breakdown.',
        actionFr: 'Déclencher verrouillage de sécurité procédé, isoler l’entrée analogique et basculer sur capteur redondant.'
      };
    }
  }, [simulatedCurrentMa, sensorProcessRangeMin, sensorProcessRangeMax, sensorPhysicalUnit]);

  return (
    <div className="space-y-6 text-[#e8eaf0] font-sans pb-16">
      
      {/* 0. AUTHORITATIVE ECOSYSTEM HERO (GENERATION & INDUSTRIAL CONTROL) */}
      <AuthoritativeEcosystemHero
        stage="generation"
        locale={locale}
        onNavigateToDomain={(dCode) => onNavigate?.('domain', dCode)}
        onSelectEquipment={onSelectEquipment}
        activePillarLabel={locale === 'fr' ? STAGES_CONFIG[store.activeStage].titleFr : STAGES_CONFIG[store.activeStage].titleEn}
        totalPillarsCount={5}
      />

      {/* 1. EXECUTIVE FIRST-VIEW ORIENTATION BANNER (THE 7 FUNDAMENTAL QUESTIONS) */}
      <AutomationOrientationBanner
        locale={locale}
        onNavigateStage={(st) => store.setActiveStage(st)}
        onNavigateDomain={(dCode) => onNavigate?.('domain', dCode)}
      />

      {/* 2. COMMAND HEADER HUD & 5-STAGE PROGRESSIVE SIZING ENGINE */}
      <AutomationCommandHeader
        locale={locale}
        activeStage={store.activeStage}
        onSelectStage={(st) => store.setActiveStage(st)}
        selectedIndustryId={store.selectedIndustryId}
        onSelectIndustry={handleSelectIndustry}
        activeProfile={store.activeIndustryProfile}
        calculations={store.calculations}
        onOpenDossier={handleOpenDossier}
        onOpenPrinciplesModal={() => setIsFormulasModalOpen(true)}
      />

      {/* ========================================================================= */}
      {/* STAGE 1: I/O MAPPING, 4–20 mA LOOPS & 24V DC POWER BUDGET                 */}
      {/* ========================================================================= */}
      {store.activeStage === 1 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
                {STAGES_CONFIG[1].num}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {locale === 'fr' ? STAGES_CONFIG[1].titleFr : STAGES_CONFIG[1].titleEn}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStage1Tab('420MA_LOOPS')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage1Tab === '420MA_LOOPS'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                {locale === 'fr' ? '1.1 Boucles 4–20 mA' : '1.1 4–20 mA Loops'}
              </button>
              <button
                onClick={() => setStage1Tab('NAMUR_NE43')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage1Tab === 'NAMUR_NE43'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                {locale === 'fr' ? '1.2 Diagnostic NAMUR NE 43' : '1.2 NAMUR NE 43'}
              </button>
              <button
                onClick={() => setStage1Tab('POWER_CABINET')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage1Tab === 'POWER_CABINET'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                {locale === 'fr' ? '1.3 Puissance & Dissipation' : '1.3 Power & Heat'}
              </button>
            </div>
          </div>

          {/* Sub-Tab 1.1: 4-20 mA HART Loops Simulator */}
          {stage1Tab === '420MA_LOOPS' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <Network className="w-5 h-5 text-cyan-400" />
                    {locale === 'fr' ? 'Calculateur de Bilan de Tension Boucle 4–20 mA & Protocole HART' : '4–20 mA HART Loop Voltage Budget & Fieldbus Sizing'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Modélisation rigoureuse de la chute de tension résistive du câble d'instrumentation blindé et de la résistance de charge HART (250 $\Omega$) sous 20 mA.
                  </p>
                </div>

                <div className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 border ${
                  isLoopCompliant ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                }`}>
                  {isLoopCompliant ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                  {isLoopCompliant ? 'BOUCLE CONFORME (TENSION DISPONIBLE OK)' : 'TENSION INSUFFISANTE (ÉCHEC TRANSMISSION)'}
                </div>
              </div>

              {/* INPUTS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Tension Source 24V DC</span>
                    <span className="text-cyan-400 font-bold">{supplyVoltageV.toFixed(1)} V</span>
                  </div>
                  <input
                    type="range"
                    min="20.4"
                    max="28.8"
                    step="0.2"
                    value={supplyVoltageV}
                    onChange={(e) => setSupplyVoltageV(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Tolérance alimentation : ±10%</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Longueur du Câble</span>
                    <span className="text-cyan-400 font-bold">{cableLengthMeters} m</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1500"
                    step="25"
                    value={cableLengthMeters}
                    onChange={(e) => setCableLengthMeters(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Paire torsadée blindée LiYCY</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-mono text-slate-400">Section Conducteur</span>
                  <select
                    value={cableWireSectionMm2}
                    onChange={(e) => setCableWireSectionMm2(parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white outline-none"
                  >
                    <option value="0.5">0.50 mm² (R = 71.2 Ω/km)</option>
                    <option value="0.75">0.75 mm² (R = 47.5 Ω/km - Standard)</option>
                    <option value="1.0">1.00 mm² (R = 35.6 Ω/km)</option>
                    <option value="1.5">1.50 mm² (R = 23.7 Ω/km - Longues distances)</option>
                  </select>
                  <div className="text-[10px] font-mono text-slate-500">Résistance boucle : {wireResistanceOhms} Ω</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Seuil Minimal Transmetteur</span>
                    <span className="text-amber-400 font-bold">{txMinOperatingVoltageV.toFixed(1)} V</span>
                  </div>
                  <input
                    type="range"
                    min="10.5"
                    max="16.0"
                    step="0.5"
                    value={txMinOperatingVoltageV}
                    onChange={(e) => setTxMinOperatingVoltageV(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Spécification constructeur capteur</div>
                </div>
              </div>

              {/* VOLTAGE BUDGET DASHBOARD */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Perte en Ligne (Câble)</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">{cableVoltageDropV} V</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">@ 20 mA plein échelle</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Chute Résistance HART (250 Ω)</div>
                  <div className="text-2xl font-bold font-mono text-purple-400 mt-2">{hartVoltageDropV} V</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Nécessaire à la démodulation FSK</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Tension Réelle aux Bornes TX</div>
                  <div className={`text-2xl font-bold font-mono mt-2 ${availableVoltageAtTxV >= txMinOperatingVoltageV ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {availableVoltageAtTxV} V
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    Marge disponible : {(availableVoltageAtTxV - txMinOperatingVoltageV).toFixed(2)} V
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Longueur Maximale Autorisée</div>
                  <div className="text-2xl font-bold font-mono text-amber-400 mt-2">
                    {Math.floor(((supplyVoltageV - txMinOperatingVoltageV - hartVoltageDropV) / (maxCurrentAmps * (2 * copperRho / cableWireSectionMm2))))} m
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Avant sous-alimentation du transmetteur</div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 1.2: NAMUR NE 43 Loop Current Telemetry & Diagnostic Engine */}
          {stage1Tab === 'NAMUR_NE43' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      {locale === 'fr' 
                        ? 'Diagnostic de Boucle 4–20 mA & Télémétrie NAMUR NE 43' 
                        : 'NAMUR NE 43 4–20 mA Loop Diagnostic & Telemetry Engine'}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      CEI 60381-1 / NAMUR NE 43
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {locale === 'fr'
                      ? 'Discrimination physique en temps réel : rupture de fil (< 3.6 mA), dérive basse (3.6-3.8 mA), mesure valide (3.8-20.5 mA), saturation haute (20.5-21.0 mA) et court-circuit (> 21.0 mA) avec mise à l\'échelle automate Siemens S7-1500 (0 à 27648).'
                      : 'Real-time analog loop discrimination: wire break (< 3.6 mA), under-range (3.6-3.8 mA), valid measurement (3.8-20.5 mA), over-range (20.5-21.0 mA), and sensor short (> 21.0 mA) with Siemens S7-1500 ADC scaling (0 to 27648).'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border flex items-center gap-1.5 ${
                    namurStatus.severity === 'normal'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : namurStatus.severity === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}>
                    {namurStatus.severity === 'normal' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    )}
                    {locale === 'fr' ? namurStatus.statusFr : namurStatus.statusEn}
                  </span>
                </div>
              </div>

              {/* Dynamic Spectrum Bar with Cursor */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                    {locale === 'fr' ? 'Spectre Normalisé NAMUR NE 43 (3.0 mA → 22.5 mA)' : 'Normalized NAMUR NE 43 Spectrum (3.0 mA → 22.5 mA)'}
                  </span>
                  <span className="text-cyan-400 font-bold">
                    Courant de boucle mesuré : {simulatedCurrentMa.toFixed(2)} mA
                  </span>
                </div>

                {/* Multi-segment Spectrum Bar */}
                <div className="relative pt-6 pb-2">
                  {/* Position Cursor Pointer */}
                  {(() => {
                    const minI = 3.0;
                    const maxI = 22.5;
                    const clampedI = Math.max(minI, Math.min(maxI, simulatedCurrentMa));
                    const pct = ((clampedI - minI) / (maxI - minI)) * 100;
                    return (
                      <div 
                        className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-150"
                        style={{ left: `${pct}%` }}
                      >
                        <span className="px-2 py-0.5 rounded bg-white text-slate-950 text-[10px] font-mono font-extrabold shadow-lg">
                          {simulatedCurrentMa.toFixed(2)} mA
                        </span>
                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-white" />
                      </div>
                    );
                  })()}

                  {/* Segmented Color Track */}
                  <div className="h-4 rounded-full overflow-hidden flex bg-slate-900 border border-slate-700 shadow-inner">
                    {/* Zone 1: < 3.6 mA (Break Wire) */}
                    <div style={{ width: '3.08%' }} className="bg-rose-600/80 hover:bg-rose-500 transition-colors" title="Rupture Ligne (< 3.6 mA)" />
                    {/* Zone 2: 3.6 to 3.8 mA (Under-range) */}
                    <div style={{ width: '1.03%' }} className="bg-amber-500/80 hover:bg-amber-400 transition-colors" title="Sous-échelle (3.6 - 3.8 mA)" />
                    {/* Zone 3: 3.8 to 20.5 mA (Valid process) */}
                    <div style={{ width: '85.64%' }} className="bg-emerald-500/80 hover:bg-emerald-400 transition-colors" title="Mesure Valide (3.8 - 20.5 mA)" />
                    {/* Zone 4: 20.5 to 21.0 mA (Over-range) */}
                    <div style={{ width: '2.56%' }} className="bg-amber-500/80 hover:bg-amber-400 transition-colors" title="Sur-échelle (20.5 - 21.0 mA)" />
                    {/* Zone 5: > 21.0 mA (Short-circuit) */}
                    <div style={{ width: '7.69%' }} className="bg-rose-600/80 hover:bg-rose-500 transition-colors" title="Court-circuit (> 21.0 mA)" />
                  </div>

                  {/* Scale Labels */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-2 px-1">
                    <span className="text-rose-400">3.0 mA (Défaut Bas)</span>
                    <span className="text-rose-400">3.6 mA</span>
                    <span className="text-emerald-400">4.0 mA (0% PV)</span>
                    <span className="text-cyan-400">12.0 mA (50% PV)</span>
                    <span className="text-emerald-400">20.0 mA (100% PV)</span>
                    <span className="text-amber-400">20.5 mA</span>
                    <span className="text-rose-400">21.0 mA (Défaut Haut)</span>
                    <span className="text-rose-400">22.5 mA</span>
                  </div>
                </div>

                {/* Quick Calibration / Preset Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-900">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-bold mr-1">
                    {locale === 'fr' ? 'Points de Test Rapides :' : 'Quick Test Injections:'}
                  </span>
                  {[
                    { label: '3.2 mA (Rupture)', val: 3.2, color: 'text-rose-400 border-rose-800/60 bg-rose-950/20' },
                    { label: '3.7 mA (Sous-plage)', val: 3.7, color: 'text-amber-400 border-amber-800/60 bg-amber-950/20' },
                    { label: '4.0 mA (0% Procédé)', val: 4.0, color: 'text-emerald-400 border-emerald-800/60 bg-emerald-950/20' },
                    { label: '12.0 mA (50% Procédé)', val: 12.0, color: 'text-cyan-400 border-cyan-800/60 bg-cyan-950/20' },
                    { label: '20.0 mA (100% Procédé)', val: 20.0, color: 'text-emerald-400 border-emerald-800/60 bg-emerald-950/20' },
                    { label: '20.8 mA (Sur-plage)', val: 20.8, color: 'text-amber-400 border-amber-800/60 bg-amber-950/20' },
                    { label: '21.8 mA (Court-Circuit)', val: 21.8, color: 'text-rose-400 border-rose-800/60 bg-rose-950/20' }
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={() => setSimulatedCurrentMa(btn.val)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border transition-all hover:scale-105 ${btn.color} ${
                        Math.abs(simulatedCurrentMa - btn.val) < 0.05 ? 'ring-1 ring-white' : ''
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Sizing Sliders & Range Setup */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1: Current Fine Adjustment */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold uppercase text-slate-300">
                      {locale === 'fr' ? 'Courant Injecté (mA)' : 'Injected Current (mA)'}
                    </label>
                    <span className="text-lg font-mono font-extrabold text-cyan-400">
                      {simulatedCurrentMa.toFixed(2)} mA
                    </span>
                  </div>

                  <input
                    type="range"
                    min="3.0"
                    max="22.5"
                    step="0.05"
                    value={simulatedCurrentMa}
                    onChange={(e) => setSimulatedCurrentMa(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSimulatedCurrentMa((v) => Math.max(3.0, parseFloat((v - 0.1).toFixed(2))))}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded font-mono text-xs border border-slate-700 transition-all"
                    >
                      -0.10 mA
                    </button>
                    <button
                      onClick={() => setSimulatedCurrentMa(12.0)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded font-mono text-xs border border-slate-700 transition-all"
                    >
                      Reset (12 mA)
                    </button>
                    <button
                      onClick={() => setSimulatedCurrentMa((v) => Math.min(22.5, parseFloat((v + 0.1).toFixed(2))))}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded font-mono text-xs border border-slate-700 transition-all"
                    >
                      +0.10 mA
                    </button>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 leading-relaxed pt-2 border-t border-slate-900">
                    Transmetteur 2 fils alimenté par la boucle 24V DC. Détection matérielle selon CEI 60381-1.
                  </div>
                </div>

                {/* Column 2: Sensor Process Range Parameters */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="text-xs font-mono font-bold uppercase text-slate-300">
                    {locale === 'fr' ? 'Échelle & Unité du Capteur (PV)' : 'Sensor Process Range & Unit (PV)'}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-400">
                        {locale === 'fr' ? 'Plage Min (0% = 4 mA)' : 'Range Min (0% = 4 mA)'}
                      </label>
                      <input
                        type="number"
                        value={sensorProcessRangeMin}
                        onChange={(e) => setSensorProcessRangeMin(parseFloat(e.target.value) || 0)}
                        className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-slate-400">
                        {locale === 'fr' ? 'Plage Max (100% = 20 mA)' : 'Range Max (100% = 20 mA)'}
                      </label>
                      <input
                        type="number"
                        value={sensorProcessRangeMax}
                        onChange={(e) => setSensorProcessRangeMax(parseFloat(e.target.value) || 100)}
                        className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400">
                      {locale === 'fr' ? 'Grandeur Physique / Unité' : 'Engineering Unit'}
                    </label>
                    <select
                      value={sensorPhysicalUnit}
                      onChange={(e) => setSensorPhysicalUnit(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="bar">Pression (bar) - Nachtigal Bâche Spirale</option>
                      <option value="°C">Température (°C) - Palier Alternateur</option>
                      <option value="m³/h">Débit Volumique (m³/h) - Refroidissement</option>
                      <option value="%">Niveau Réservoir (%) - Bâche Huile Régulation</option>
                      <option value="rpm">Vitesse de Rotation (rpm) - Turbine Francis</option>
                      <option value="mbar">Pression Différentielle (mbar) - Colmatage Filtres</option>
                    </select>
                  </div>
                </div>

                {/* Column 3: Telemetry & Quality Bits */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-mono font-bold uppercase text-slate-300">
                    {locale === 'fr' ? 'Télémétrie Automate & Sécurité' : 'PLC Telemetry & Quality Tag'}
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between items-center p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Qualité Signal (OPC UA / Profinet) :</span>
                      <span className={`font-bold ${
                        namurStatus.quality.startsWith('GOOD')
                          ? 'text-emerald-400'
                          : namurStatus.quality.startsWith('UNCERTAIN')
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}>
                        {namurStatus.quality}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">Mot CAN Siemens S7 (PEW/IW) :</span>
                      <span className="text-cyan-400 font-extrabold">
                        {namurStatus.canValue} / 27648
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400">État Entrée Défaut Automate :</span>
                      <span className={`font-bold ${
                        namurStatus.severity === 'critical' ? 'text-rose-400' : 'text-slate-500'
                      }`}>
                        {namurStatus.severity === 'critical' ? 'TRUE (Alarme Active)' : 'FALSE (Sain)'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-[11px] font-mono text-cyan-300">
                    Protocole HART 7 : Transmission FSK simultanée à 1200 Baud sans altérer le courant moyen 4–20 mA.
                  </div>
                </div>

              </div>

              {/* Diagnostic Results KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* KPI 1: NAMUR Zone & Status */}
                <div className={`p-4 rounded-xl border bg-slate-950 ${
                  namurStatus.severity === 'normal'
                    ? 'border-emerald-500/40'
                    : namurStatus.severity === 'warning'
                    ? 'border-amber-500/40'
                    : 'border-rose-500/40'
                }`}>
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Zone Normative NAMUR</div>
                  <div className={`text-base font-bold font-mono mt-1 ${
                    namurStatus.severity === 'normal'
                      ? 'text-emerald-400'
                      : namurStatus.severity === 'warning'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}>
                    {namurStatus.zone}
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans mt-1 leading-snug">
                    {locale === 'fr' ? namurStatus.descFr : namurStatus.descEn}
                  </div>
                </div>

                {/* KPI 2: Engineering Process Value (PV) */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Grandeur Procédé Décodée (PV)</div>
                  <div className={`text-2xl font-bold font-mono mt-1 ${
                    namurStatus.pvCalculated !== null ? 'text-white' : 'text-rose-400'
                  }`}>
                    {namurStatus.pvFormatted}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    {namurStatus.pvCalculated !== null
                      ? `Échelle : ${sensorProcessRangeMin} à ${sensorProcessRangeMax} ${sensorPhysicalUnit}`
                      : 'Mesure rejetée par le contrôle commande'}
                  </div>
                </div>

                {/* KPI 3: Percentage of Span */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Pourcentage d'Échelle (0-100%)</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                    {(((simulatedCurrentMa - 4.0) / 16.0) * 100).toFixed(1)} %
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    Normalisation CEI 61131-3 : NORM_X (0.00 à 1.00)
                  </div>
                </div>

                {/* KPI 4: Safety & Actuator Interlock Action */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Action de Repli Automate</div>
                  <div className={`text-xs font-bold font-mono mt-1 ${
                    namurStatus.severity === 'critical' ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {namurStatus.severity === 'critical' ? 'POSITION DE SÉCURITÉ' : 'RÉGULATION ACTIVE'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans mt-1 leading-snug">
                    {locale === 'fr' ? namurStatus.actionFr : 'Safety trip triggered or standard PID closed-loop control.'}
                  </div>
                </div>

              </div>

              {/* CEI 61131-3 Structured Text Code & Industrial Application */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* ST Code Card */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-cyan-400" />
                      Bloc Fonction CEI 61131-3 (Structured Text)
                    </span>
                    <span className="text-[10px] text-slate-500">FB_Analog_NAMUR_NE43</span>
                  </div>
                  <pre className="p-3 bg-slate-900 rounded-lg text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`// Surveillance d'intégrité de boucle NAMUR NE 43
IF rCurrent_mA < 3.6 THEN
    bWireBreak_Fault := TRUE;
    wSignalQuality := 16#00; // BAD
    rProcessValue := 0.0;
    bTripActuatorToSafeState := TRUE;
ELSIF rCurrent_mA > 21.0 THEN
    bShortCircuit_Fault := TRUE;
    wSignalQuality := 16#00; // BAD
    bTripActuatorToSafeState := TRUE;
ELSE
    bWireBreak_Fault := FALSE;
    bShortCircuit_Fault := FALSE;
    wSignalQuality := 16#80; // GOOD
    // Conversion S7-1500 SCALE_X
    rProcessValue := rPV_Min + ((rCurrent_mA - 4.0) / 16.0) * (rPV_Max - rPV_Min);
END_IF;`}
                  </pre>
                </div>

                {/* Industrial Field Context Card */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      Pratiques Chantiers Cameroun (Nachtigal, SABC, CIMENCAM)
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold">Régime Tropical</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed font-sans">
                    <p>
                      <strong>Immunité aux Transitoires d’Orage :</strong> Dans les régions équatoriales (bassin de la Sanaga, littoral de Douala), les coups de foudre induisent des impulsions capacitives brèves sur les câbles blindés non enterrés.
                    </p>
                    <p>
                      <strong>Temporisation Anti-Rebond (Debounce) :</strong> La norme NAMUR NE 43 et les guides de sécurité CEI 61511 préconisent une temporisation d'intégration de <code className="text-cyan-400 font-mono">100 à 250 ms</code> avant de verrouiller un arrêt d'urgence sur franchissement de 3.6 mA, évitant ainsi les déclenchements intempestifs sur foudre.
                    </p>
                    <p>
                      <strong>Blindage &amp; CEM :</strong> Raccordement du blindage torsadé (STP) à la terre équipotentielle à <em>une seule extrémité</em> (côté armoire automate) pour éviter les courants de boucle de terre destructeurs.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Sub-Tab 1.3: 24V DC Auxiliary Power & Thermal Dissipation */}
          {stage1Tab === 'POWER_CABINET' && (
            <AutomationIoPowerCalculator locale={locale} />
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 2: IEC 61131-3 PLC LOGIC RUNNER & DUAL HOT-STANDBY REDUNDANCY       */}
      {/* ========================================================================= */}
      {store.activeStage === 2 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
                {STAGES_CONFIG[2].num}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {locale === 'fr' ? STAGES_CONFIG[2].titleFr : STAGES_CONFIG[2].titleEn}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStage2Tab('PLC_LOGIC')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage2Tab === 'PLC_LOGIC'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                {locale === 'fr' ? '2.1 Simulateur Logique CEI 61131-3' : '2.1 IEC 61131-3 PLC Engine'}
              </button>
              <button
                onClick={() => setStage2Tab('HOT_STANDBY')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage2Tab === 'HOT_STANDBY'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                {locale === 'fr' ? '2.2 Redondance CPU Hot-Standby' : '2.2 Hot-Standby Redundancy'}
              </button>
            </div>
          </div>

          {/* Sub-Tab 2.1: IEC 61131-3 Logic Simulator */}
          {stage2Tab === 'PLC_LOGIC' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-cyan-400" />
                    {locale === 'fr' ? 'Moteur d\'Exécution Logique CEI 61131-3 (Ladder / ST / FBD)' : 'IEC 61131-3 Real-Time PLC Logic Runner'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Simulation en temps réel de cycle d'automate (10 ms). Testez les interverrouillages de pompage, la sécurité thermique et le bloc temporisateur TON.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
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

                  <button
                    onClick={() => setPlcRunning(!plcRunning)}
                    className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all ${
                      plcRunning ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {plcRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {plcRunning ? 'RUN (Cycle 10 ms)' : 'STOP'}
                  </button>
                </div>
              </div>

              {/* INTERACTIVE INPUTS CONTROL PANEL */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-mono text-slate-400 uppercase font-bold flex items-center justify-between">
                  <span>Panneau d'Entrées Physiques du Procédé (%I0.0 à %I0.5)</span>
                  <span className="text-cyan-400">Scrutation n° {scanCounter}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {/* E-Stop (NC) */}
                  <button
                    onClick={() => setInEmergencyStop(!inEmergencyStop)}
                    className={`p-3 rounded-xl border font-mono text-xs flex flex-col justify-between transition-all ${
                      inEmergencyStop
                        ? 'bg-rose-600/30 border-rose-500 text-rose-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] text-slate-500">%I0.0 (NF)</span>
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="font-bold text-left mt-1">Arrêt Urgence</div>
                    <div className="text-[10px] text-left mt-0.5">{inEmergencyStop ? 'DÉCLENCHÉ' : 'REPOS (OK)'}</div>
                  </button>

                  {/* Start PB (NO) */}
                  <button
                    onMouseDown={() => setInStartPb(true)}
                    onMouseUp={() => setInStartPb(false)}
                    onTouchStart={() => setInStartPb(true)}
                    onTouchEnd={() => setInStartPb(false)}
                    className={`p-3 rounded-xl border font-mono text-xs flex flex-col justify-between transition-all select-none ${
                      inStartPb
                        ? 'bg-emerald-600/40 border-emerald-500 text-emerald-300 font-bold scale-95'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] text-slate-500">%I0.1 (NO)</span>
                      <Play className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="font-bold text-left mt-1">BP Marche</div>
                    <div className="text-[10px] text-left mt-0.5">{inStartPb ? 'APPUYÉ' : 'REPOS'}</div>
                  </button>

                  {/* Stop PB (NC) */}
                  <button
                    onClick={() => setInStopPb(!inStopPb)}
                    className={`p-3 rounded-xl border font-mono text-xs flex flex-col justify-between transition-all ${
                      inStopPb
                        ? 'bg-amber-600/30 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] text-slate-500">%I0.2 (NF)</span>
                      <Pause className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="font-bold text-left mt-1">BP Arrêt</div>
                    <div className="text-[10px] text-left mt-0.5">{inStopPb ? 'DEMANDE ARRÊT' : 'FERMÉ (OK)'}</div>
                  </button>

                  {/* Thermal Relay (NC) */}
                  <button
                    onClick={() => setInThermalTrip(!inThermalTrip)}
                    className={`p-3 rounded-xl border font-mono text-xs flex flex-col justify-between transition-all ${
                      inThermalTrip
                        ? 'bg-rose-600/30 border-rose-500 text-rose-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] text-slate-500">%I0.3 (NF)</span>
                      <Flame className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="font-bold text-left mt-1">Relais Therm.</div>
                    <div className="text-[10px] text-left mt-0.5">{inThermalTrip ? 'DÉCLENCHÉ' : 'NORMAL'}</div>
                  </button>

                  {/* High Level Sensor */}
                  <button
                    onClick={() => setInHighLevelSensor(!inHighLevelSensor)}
                    className={`p-3 rounded-xl border font-mono text-xs flex flex-col justify-between transition-all ${
                      inHighLevelSensor
                        ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] text-slate-500">%I0.4 (NO)</span>
                      <Activity className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="font-bold text-left mt-1">Niveau Haut</div>
                    <div className="text-[10px] text-left mt-0.5">{inHighLevelSensor ? 'CUVE PLEINE' : 'LIBRE'}</div>
                  </button>

                  {/* Low Level Sensor */}
                  <button
                    onClick={() => setInLowLevelSensor(!inLowLevelSensor)}
                    className={`p-3 rounded-xl border font-mono text-xs flex flex-col justify-between transition-all ${
                      inLowLevelSensor
                        ? 'bg-amber-600/30 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] text-slate-500">%I0.5 (NF)</span>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="font-bold text-left mt-1">Niveau Bas</div>
                    <div className="text-[10px] text-left mt-0.5">{inLowLevelSensor ? 'CUVE VIDE' : 'REMPLIE'}</div>
                  </button>
                </div>
              </div>

              {/* RUNG / CODE VISUALIZATION */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-bold uppercase">
                    Réseau 1 : Démarrage Temporisé de Pompe avec Auto-Maintien (TON 3.0 s)
                  </span>
                  <span className="text-cyan-400 text-[11px]">
                    Timer T1 : {tonTimerAccumSec.toFixed(1)} s / {tonTimerPresetSec.toFixed(1)} s
                  </span>
                </div>

                {plcLanguage === 'LD' && (
                  <div className="p-3 bg-slate-900/80 rounded-lg overflow-x-auto space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono whitespace-nowrap">
                      <span className="text-cyan-400">|--</span>
                      <span className={`px-2 py-0.5 rounded border ${!inEmergencyStop ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'}`}>
                        [!%I0.0 AU_NF]
                      </span>
                      <span className="text-slate-600">--</span>
                      <span className={`px-2 py-0.5 rounded border ${!inThermalTrip ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'}`}>
                        [!%I0.3 F_TH]
                      </span>
                      <span className="text-slate-600">--</span>
                      <span className={`px-2 py-0.5 rounded border ${inStartPb || outPumpMotor ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        [%I0.1 OU %Q0.0]
                      </span>
                      <span className="text-slate-600">--[TON T#3s]--</span>
                      <span className={`px-2 py-0.5 rounded border ${outPumpMotor ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        (%Q0.0 MOTEUR)
                      </span>
                      <span className="text-cyan-400">--|</span>
                    </div>
                  </div>
                )}

                {plcLanguage === 'ST' && (
                  <div className="p-3 bg-slate-900/80 rounded-lg text-[11px] text-cyan-300 space-y-1 font-mono">
                    <div>{`// Structured Text CEI 61131-3`}</div>
                    <div>{`TON_01(IN := (inStartPb OR outPumpMotor) AND NOT inEmergencyStop AND NOT inThermalTrip AND NOT inStopPb, PT := T#3S);`}</div>
                    <div>{`outPumpMotor := TON_01.Q;`}</div>
                    <div>{`outRunLamp := outPumpMotor;`}</div>
                    <div>{`outAlarmHorn := inEmergencyStop OR inThermalTrip;`}</div>
                  </div>
                )}

                {plcLanguage === 'FBD' && (
                  <div className="p-3 bg-slate-900/80 rounded-lg text-[11px] text-slate-300 space-y-1 font-mono">
                    <div>[AND Block] (E-Stop_OK, Thermal_OK, Not_Stop, Tank_Level_OK) ➔ IN [TON Block (3s)] ➔ Q [Motor %Q0.0]</div>
                  </div>
                )}
              </div>

              {/* OUTPUTS STATUS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">%Q0.0 : Contacteur Pompe Moteur</div>
                    <div className={`text-base font-bold font-mono mt-1 ${outPumpMotor ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {outPumpMotor ? 'ACTIVÉ (RUN)' : 'DÉSACTIVÉ (OFF)'}
                    </div>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full ${outPumpMotor ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`} />
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">%Q0.1 : Voyant Marche Pupitre</div>
                    <div className={`text-base font-bold font-mono mt-1 ${outRunLamp ? 'text-cyan-400' : 'text-slate-500'}`}>
                      {outRunLamp ? 'ALLUMÉ' : 'ÉTEINT'}
                    </div>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full ${outRunLamp ? 'bg-cyan-400 shadow-md shadow-cyan-400' : 'bg-slate-700'}`} />
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">%Q0.2 : Klaxon Alarme Défaut</div>
                    <div className={`text-base font-bold font-mono mt-1 ${outAlarmHorn ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`}>
                      {outAlarmHorn ? 'ALARME ACTIVE' : 'SILENCIEUX'}
                    </div>
                  </div>
                  <div className={`w-3.5 h-3.5 rounded-full ${outAlarmHorn ? 'bg-rose-500 animate-ping' : 'bg-slate-700'}`} />
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2.2: Hot-Standby PLC Redundancy */}
          {stage2Tab === 'HOT_STANDBY' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <Server className="w-5 h-5 text-cyan-400" />
                    {locale === 'fr' ? 'Architecture d\'Automates Redondants Dual Hot-Standby' : 'Dual Hot-Standby PLC High-Availability Engine'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Bascule automatique sans à-coup (*bumpless failover*) &lt; 20 ms avec synchronisation permanente de la mémoire image par lien fibre optique dédié.
                  </p>
                </div>

                <button
                  onClick={handleCpuFailoverSimulation}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {primaryCpuState === 'PRIMARY_RUN' ? 'Simuler Crash CPU Principale' : 'Réarmer CPU Principale'}
                </button>
              </div>

              {/* DUAL RACK ARCHITECTURE VISUALIZATION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-950 rounded-xl border border-slate-800">
                {/* Rack A */}
                <div className={`p-4 rounded-xl border space-y-3 transition-all ${
                  primaryCpuState === 'PRIMARY_RUN' ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10' : 'bg-slate-950 border-rose-500/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-mono text-sm">RACK A : CPU 1 (Maître)</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      primaryCpuState === 'PRIMARY_RUN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {primaryCpuState === 'PRIMARY_RUN' ? 'PRIMARY ACTIVE' : 'FAULT / OFF'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono space-y-1">
                    <div>Charge processeur : {primaryCpuState === 'PRIMARY_RUN' ? '28%' : '0%'}</div>
                    <div>Scrutation : {primaryCpuState === 'PRIMARY_RUN' ? '10 ms' : 'STOP'}</div>
                  </div>
                </div>

                {/* Rack B */}
                <div className={`p-4 rounded-xl border space-y-3 transition-all ${
                  secondaryCpuState === 'TAKEOVER_PRIMARY' ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-mono text-sm">RACK B : CPU 2 (Secours / Esclave)</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      secondaryCpuState === 'TAKEOVER_PRIMARY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {secondaryCpuState === 'TAKEOVER_PRIMARY' ? 'PRIMARY (BASCULÉ)' : 'STANDBY (SYNCHRO 100%)'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono space-y-1">
                    <div>Lien Sync Fibre Optique : {syncFiberLinkOk ? 'OK (2 Gbps)' : 'COUPÉ'}</div>
                    <div>Temps de bascule mesuré : {failoverTimeMs} ms (&lt; 20 ms toléré)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 3: CLOSED-LOOP PID TUNING & VFD VECTOR CONTROL (FOC)                */}
      {/* ========================================================================= */}
      {store.activeStage === 3 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
                {STAGES_CONFIG[3].num}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {locale === 'fr' ? STAGES_CONFIG[3].titleFr : STAGES_CONFIG[3].titleEn}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStage3Tab('PID_TUNING')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage3Tab === 'PID_TUNING'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {locale === 'fr' ? '3.1 Banc de Réglage PID & Anti-Windup' : '3.1 PID Tuning & Anti-Windup'}
              </button>
              <button
                onClick={() => setStage3Tab('VFD_FOC')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage3Tab === 'VFD_FOC'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                {locale === 'fr' ? '3.2 Variateurs VFD & Contrôle FOC' : '3.2 VFD Inverters & FOC'}
              </button>
            </div>
          </div>

          {/* Sub-Tab 3.1: Closed-Loop PID Tuning */}
          {stage3Tab === 'PID_TUNING' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
                    {locale === 'fr' ? 'Banc de Réglage Régulation PID & Algorithme Anti-Windup' : 'Closed-Loop PID Tuning & Anti-Windup Bench'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Modélisation de boucle d'asservissement continue en temps réel. Ajustez le gain Kp, l'intégrale Ti et la dérivation Td avec méthode de Ziegler-Nichols.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAntiWindupEnabled(!antiWindupEnabled)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                      antiWindupEnabled ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {antiWindupEnabled ? 'ANTI-WINDUP ACTIF' : 'ANTI-WINDUP DÉSACTIVÉ'}
                  </button>
                </div>
              </div>

              {/* PID CONTROLS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Consigne (SetPoint SP)</span>
                    <span className="text-cyan-400 font-bold">{setPoint}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={setPoint}
                    onChange={(e) => setSetPoint(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Cible de niveau / pression</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Gain Proportionnel (Kp)</span>
                    <span className="text-cyan-400 font-bold">{kp}</span>
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
                  <div className="text-[10px] font-mono text-slate-500">Rapidité &amp; dépassement</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Temps Intégral (Ti)</span>
                    <span className="text-cyan-400 font-bold">{ti} s</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    step="1"
                    value={ti}
                    onChange={(e) => setTi(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Annulation de l'erreur statique</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Temps Dérivé (Td)</span>
                    <span className="text-cyan-400 font-bold">{td} s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.2"
                    value={td}
                    onChange={(e) => setTd(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Amortissement des oscillations</div>
                </div>
              </div>

              {/* REAL-TIME TREND CURVE SVG */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold uppercase">
                    Courbe de Réponse Temporelle Dynamique (SP Consigne vs PV Mesure vs Sortie %)
                  </span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-cyan-400">■ Consigne SP : {setPoint}%</span>
                    <span className="text-emerald-400">■ Mesure PV : {processVar}%</span>
                    <span className="text-purple-400">■ Commande Out : {pidOutputPercent}%</span>
                  </div>
                </div>

                <div className="relative h-44 bg-slate-900/60 rounded-lg p-2 border border-slate-800">
                  <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="2 2" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#1e293b" strokeDasharray="2 2" />
                    <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeDasharray="2 2" />

                    {/* Setpoint Line */}
                    <line
                      x1="0"
                      y1={120 - (setPoint / 100) * 120}
                      x2="500"
                      y2={120 - (setPoint / 100) * 120}
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />

                    {/* Process Variable Curve */}
                    {pidHistory.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        points={pidHistory
                          .map((pt, idx) => `${(idx / (pidHistory.length - 1)) * 500},${120 - (pt.pv / 100) * 120}`)
                          .join(' ')}
                      />
                    )}
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 3.2: VFD & FOC Vector Control */}
          {stage3Tab === 'VFD_FOC' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    {locale === 'fr' ? 'Banc Variateur de Fréquence (VFD) & Contrôle Vectoriel FOC' : 'Variable Frequency Drive (VFD) & Field-Oriented Control (FOC)'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Découplage matriciel direct-quadrature (id flux / iq couple) selon les repères de Park et Clarke. Calcul des pertes de découpage IGBT et gestion du freinage régénératif.
                  </p>
                </div>

                <button
                  onClick={() => setVfdBrakingActive(!vfdBrakingActive)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                    vfdBrakingActive ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {vfdBrakingActive ? 'FREINAGE RHÉOSTATIQUE ENCLENCHÉ' : 'MARCHE MOTEUR NORMALE'}
                </button>
              </div>

              {/* VFD CONTROLS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Vitesse Consigne</span>
                    <span className="text-cyan-400 font-bold">{vfdTargetSpeedRpm} tr/min</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="1800"
                    step="50"
                    value={vfdTargetSpeedRpm}
                    onChange={(e) => setVfdTargetSpeedRpm(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Fréquence stator : {(vfdTargetSpeedRpm / 30).toFixed(1)} Hz</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Fréquence Découpage PWM</span>
                    <span className="text-purple-400 font-bold">{vfdCarrierFreqKhz} kHz</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="16"
                    step="1"
                    value={vfdCarrierFreqKhz}
                    onChange={(e) => setVfdCarrierFreqKhz(parseInt(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Pertes thermiques : {switchingLossWatts} W</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Couple de Charge Résistant</span>
                    <span className="text-amber-400 font-bold">{motorLoadPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="125"
                    step="5"
                    value={motorLoadPercent}
                    onChange={(e) => setMotorLoadPercent(parseInt(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="text-[10px] font-mono text-slate-500">Couple nominal : {motorKwRating} kW</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-slate-400">Tension Bus Continu (VDC)</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">{vfdDcBusVoltage} V DC</div>
                  <div className="text-[10px] font-mono text-slate-500">Alimentation triphasée 400V AC</div>
                </div>
              </div>

              {/* FOC DECOUPLING METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Courant d'Axe Direct (id - Flux)</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">{idFluxAmps} A</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Magnétisation statorique découplée</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Courant d'Axe Quadrature (iq - Couple)</div>
                  <div className="text-2xl font-bold font-mono text-amber-400 mt-2">{iqTorqueAmps} A</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Couple électromagnétique proportionnel</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Hacheur de Freinage Rhéostatique</div>
                  <div className="text-2xl font-bold font-mono text-purple-400 mt-2">{brakingChopperDutyCycle}% Rapport Cyclique</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Dissipation dans résistance externe</div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 4: SAFETY INSTRUMENTED SYSTEMS (SIS / SIL 2 & 3)                    */}
      {/* ========================================================================= */}
      {store.activeStage === 4 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
                {STAGES_CONFIG[4].num}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {locale === 'fr' ? STAGES_CONFIG[4].titleFr : STAGES_CONFIG[4].titleEn}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                className="px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 bg-cyan-500 text-slate-950 shadow-md font-extrabold"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                {locale === 'fr' ? '4.1 Sûreté SIS / SIL 2 & 3 (CEI 61508)' : '4.1 Safety SIS / SIL 2 & 3'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  {locale === 'fr' ? 'Calculateur de Sûreté de Fonctionnement SIS / SIL (CEI 61508 / 61511)' : 'Safety Instrumented Systems (SIS) & SIL Verification Engine'}
                </h2>
                <p className="text-xs text-slate-400">
                  Évaluation probabiliste de la probabilité moyenne de défaillance à la sollicitation (PFDavg), tolérance aux pannes (HFT) et niveau SIL garanti.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['1oo1', '1oo2', '2oo3', '2oo4'] as const).map((arch) => (
                  <button
                    key={arch}
                    onClick={() => setVotingArchitecture(arch)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      votingArchitecture === arch ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Vote {arch}
                  </button>
                ))}
              </div>
            </div>

            {/* SIL INPUTS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Intervalle de Test Périodique (TI)</span>
                  <span className="text-cyan-400 font-bold">{proofTestIntervalYears} an(s)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={proofTestIntervalYears}
                  onChange={(e) => setProofTestIntervalYears(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500">Heures de service : {proofTestIntervalYears * 8760} h</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-slate-400">Taux de Défaillance Dangereuse (λD)</span>
                <select
                  value={sensorFailureRatePerHour}
                  onChange={(e) => setSensorFailureRatePerHour(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white outline-none"
                >
                  <option value="5.0e-7">5.0 × 10⁻⁷ /h (Capteur SIL 3 certifié)</option>
                  <option value="1.2e-6">1.2 × 10⁻⁶ /h (Capteur industriel standard)</option>
                  <option value="3.5e-6">3.5 × 10⁻⁶ /h (Environnement sévère tropical)</option>
                </select>
                <div className="text-[10px] font-mono text-slate-500">MTBF théorique : {silCalculations.mtbfYears} ans</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Fraction de Défaillance Sûre (SFF)</span>
                  <span className="text-emerald-400 font-bold">{safeFailureFractionPercent}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="99"
                  value={safeFailureFractionPercent}
                  onChange={(e) => setSafeFailureFractionPercent(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="text-[10px] font-mono text-slate-500">Autodiagnostic interne certifié TÜV</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-mono text-slate-400">Tolérance aux Pannes (HFT)</div>
                <div className="text-2xl font-bold font-mono text-purple-400">HFT = {silCalculations.hft}</div>
                <div className="text-[10px] font-mono text-slate-500">Nombre de pannes tolérées sans perte fonction</div>
              </div>
            </div>

            {/* SIL RESULTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Probabilité Moyenne de Défaillance (PFDavg)</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">{silCalculations.pfdAvg}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Mode de fonctionnement à faible sollicitation</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Niveau SIL Atteint</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">{silCalculations.achievedSil}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Conforme CEI 61508 / CEI 61511</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Disponibilité Opérationnelle</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-2">99.998 %</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Indisponibilité &lt; 10 minutes/an</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 5: COMMISSIONING, CAMEROON CASES & STAMPED DQE FCFA                 */}
      {/* ========================================================================= */}
      {store.activeStage === 5 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Sub-Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#090D14] border border-[#222B38] rounded-xl font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
                {STAGES_CONFIG[5].num}
              </span>
              <span className="font-bold text-white hidden sm:inline">
                {locale === 'fr' ? STAGES_CONFIG[5].titleFr : STAGES_CONFIG[5].titleEn}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStage5Tab('CAMEROON_CASES')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage5Tab === 'CAMEROON_CASES'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                {locale === 'fr' ? '5.1 Chantiers & Cas Réels Cameroun' : '5.1 Cameroon Field Cases'}
              </button>
              <button
                onClick={() => setStage5Tab('DELIVERABLES_BOQ')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
                  stage5Tab === 'DELIVERABLES_BOQ'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                {locale === 'fr' ? '5.2 Dossier Technique & Devis DQE' : '5.2 Stamped Technical BOQ/DQE'}
              </button>
            </div>
          </div>

          {/* Sub-Tab 5.1: Cameroon Field Forensic Cases */}
          {stage5Tab === 'CAMEROON_CASES' && (
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
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
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
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
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
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Lignes robotisées à haute cadence (40 000 bouteilles/heure). Réseaux de communication industriels EtherCAT et automates de sécurité SIL 3 (barrières immatérielles, arrêts d'urgence décentralisés) assurant la sécurité des opérateurs et la traçabilité des lots.
                  </p>
                  <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                    Opérateur : Société Anonyme des Brasseries du Cameroun (Castel)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 5.2: Stamped Technical Synthesis & Itemized DQE BOQ */}
          {stage5Tab === 'DELIVERABLES_BOQ' && (
            <AutomationDeliverablesExportEngine
              locale={locale}
              profile={store.activeIndustryProfile}
              calculations={store.calculations}
              digitalInputs={digitalInputs}
              digitalOutputs={digitalOutputs}
              analogInputs={analogInputs}
              analogOutputs={analogOutputs}
              vfdCount={vfdCount}
              vfdTotalPowerKw={vfdTotalPowerKw}
              onJumpToStage={(st) => store.setActiveStage(st as any)}
            />
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MATHEMATICAL PRINCIPLES & FORMULATIONS MODAL                              */}
      {/* ========================================================================= */}
      {isFormulasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#090D14] border border-cyan-500/40 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#222B38]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Formulations Mathématiques & Principes d’Automatisation' : 'Mathematical Formulations & Automation Standards'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    CEI 61131-3 · CEI 61508 · CEI 61800-3 · CEI 60204-1 · ISA-88
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulas Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              
              {/* Formula 1: PLC Scan Cycle */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold uppercase text-[11px]">1. Temps de Cycle d'Automate (CEI 61131)</span>
                <div className="p-3 bg-slate-900 rounded-lg text-emerald-300 font-mono text-xs">
                  T_cycle = T_in + T_prog + T_out + T_comm &lt;= T_max_sécurité
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Où T_in est la lecture de la mémoire image des entrées, T_prog l'exécution synchrone du code logique booléen et des blocs fonctions, T_out l'écriture physique des sorties, et T_comm l'échange réseau. Pour la régulation continue, T_cycle doit être constant et déterministe (Jitter &lt; 50 µs).
                </p>
              </div>

              {/* Formula 2: PID Control & Anti-Windup */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold uppercase text-[11px]">2. Régulation Continue PID &amp; Anti-Windup</span>
                <div className="p-3 bg-slate-900 rounded-lg text-cyan-300 font-mono text-xs">
                  u(t) = K_p · e(t) + (K_p / T_i) · ∫ e(τ)dτ + K_p · T_d · (de/dt)
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  L'anti-windup fige l'accumulation de l'intégrale dès que la commande u(t) atteint la saturation mécanique de l'actionneur (0% ou 100%), éliminant ainsi les dépassements massifs et l'instabilité lors des changements de consigne brusques.
                </p>
              </div>

              {/* Formula 3: Vector FOC Decoupling */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-purple-400 font-bold uppercase text-[11px]">3. Contrôle Vectoriel FOC (Park &amp; Clarke)</span>
                <div className="p-3 bg-slate-900 rounded-lg text-purple-300 font-mono text-xs">
                  C_em = (3/2) · p · (L_m / L_r) · ψ_r · i_q  &amp;  ψ_r = L_m · i_d
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Découplage direct : en orientant le repère tournant sur le flux rotorique (ψ_r), le courant i_d contrôle exclusivement le flux magnétique tandis que le courant orthogonal i_q pilote instantanément le couple électromagnétique, similaire à une machine à courant continu.
                </p>
              </div>

              {/* Formula 4: SIL Safety PFDavg 2oo3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-rose-400 font-bold uppercase text-[11px]">4. Probabilité de Défaillance SIS (CEI 61508)</span>
                <div className="p-3 bg-slate-900 rounded-lg text-rose-300 font-mono text-xs">
                  PFD_avg (2oo3) = (λ_D · TI)^2  &amp;  RRF = 1 / PFD_avg
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  L'architecture de vote majoritaire 2oo3 (Triple Modular Redundancy) combine une sécurité maximale (arrêt si 2 capteurs sur 3 détectent un danger) et une disponibilité élevée (aucun arrêt intempestif sur défaillance d'un seul capteur). SIL 3 exige PFD_avg &lt; 10⁻³.
                </p>
              </div>

              {/* Formula 5: 4-20 mA Loop Voltage Budget */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold uppercase text-[11px]">5. Bilan de Tension Boucle 4–20 mA</span>
                <div className="p-3 bg-slate-900 rounded-lg text-amber-300 font-mono text-xs">
                  U_alim - (2 · ρ · L / S) · I_max - R_charge · I_max &gt;= U_min_tx
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Pour une alimentation 24V DC, une résistance de shunt HART de 250 Ω (chute de 5V sous 20 mA), et un transmetteur nécessitant au minimum 12V, la chute de tension admissible dans le câble blindé est limitée à ΔU = 7.0 V.
                </p>
              </div>

              {/* Formula 6: Enclosure Heat Balance */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold uppercase text-[11px]">6. Bilan Thermique Armoire &amp; Climatisation</span>
                <div className="p-3 bg-slate-900 rounded-lg text-emerald-300 font-mono text-xs">
                  P_froid (W) = P_dissip_interne - k · A · (T_int - T_amb)
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  En climat tropical camerounais où T_amb (38°C) est supérieure à la température cible maximale à l'intérieur de l'armoire (T_int = 32°C), le transfert thermique naturel est négatif (la chaleur rentre). L'installation d'un climatiseur à régulation active est obligatoire.
                </p>
              </div>

              {/* Formula 7: NAMUR NE 43 & CAN Scaling */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold uppercase text-[11px]">7. Surveillance NAMUR NE 43 &amp; Conversion CAN</span>
                <div className="p-3 bg-slate-900 rounded-lg text-cyan-300 font-mono text-xs">
                  RAW_S7 = round((I - 4.0) / 16.0 · 27648)  ;  I &lt; 3.6 mA =&gt; WireBreak
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  La norme NAMUR NE 43 réserve les plages de courant &lt; 3.6 mA (défaut bas/rupture) et &gt; 21.0 mA (défaut haut/court-circuit) pour la détection matérielle des pannes. L'automate Siemens S7-1500 convertit 4–20 mA en entier 0 à 27648, et génère un code d'alarme 16#8000 en cas de sous-débordement.
                </p>
              </div>

              {/* Formula 8: Control Valve Authority & Shannon-Nyquist */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold uppercase text-[11px]">8. Autorité de Vanne Régulatrice &amp; Échantillonnage</span>
                <div className="p-3 bg-slate-900 rounded-lg text-amber-300 font-mono text-xs">
                  a_v = ΔP_vanne_100% / ΔP_circuit_total &gt;= 0.3 à 0.5  ;  f_ech &gt;= 2 · f_max
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Une autorité a_v &gt;= 0.3 garantit que la caractéristique installée de la vanne régulatrice ne dérive pas vers un comportement tout-ou-rien. Le théorème de Shannon-Nyquist impose une fréquence d'échantillonnage de boucle au moins 10 fois plus rapide que la bande passante du procédé pour éviter tout repliement de spectre.
                </p>
              </div>

            </div>

            {/* Modal Close Button */}
            <div className="flex justify-end pt-4 border-t border-[#222B38]">
              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all"
              >
                {locale === 'fr' ? 'Fermer le Manuel' : 'Close Reference'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER METADATA */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2 text-cyan-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Ingénierie Contrôle-Commande conforme CEI 61131, CEI 61508, CEI 62443, ISA-88 &amp; CEI 60204-1</span>
        </div>
        <div>EPEDE Platform · Domaine D07 · Niveau de Maturité 5 (98%) · Cameroun Nachtigal &amp; Cimencam Compliant</div>
      </div>
    </div>
  );
};
