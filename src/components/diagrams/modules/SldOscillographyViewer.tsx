// src/components/diagrams/modules/SldOscillographyViewer.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Copy, 
  Check, 
  Zap, 
  ShieldAlert, 
  Clock, 
  Layers, 
  Maximize2, 
  X,
  Radio,
  FileCode,
  Gauge,
  BarChart2,
  Sliders,
  Sparkles,
  Filter,
  Compass,
  Eye,
  EyeOff,
  Target,
  Crosshair,
  Upload,
  FileText,
  AlertTriangle,
  FolderOpen,
  ArrowRightLeft
} from 'lucide-react';
import {
  parseComtrade,
  ParsedComtradeRecord,
  PRELOADED_COMTRADE_SAMPLES,
} from '../../../utils/comtradeParser';
import { SldLineDifferential87LViewer } from './SldLineDifferential87LViewer';

export type FaultRecordType = 
  | 'THREE_PHASE_BUS_FAULT' 
  | 'SINGLE_PHASE_GROUND_FAULT' 
  | 'TRAFO_INRUSH_VS_87T' 
  | 'ANSI_79_AUTO_RECLOSE'
  | 'IMPORTED_COMTRADE';

export type HarmonicChannelType = 'IA' | 'IB' | 'IC' | 'IN0' | 'VA';

export type OscillogramViewMode = 'DUAL_SPLIT' | 'WAVEFORMS' | 'PHASOR_RADAR' | 'RX_IMPEDANCE' | 'FFT_SPECTRUM' | 'LINE_DIFF_87L';

export type DistanceCharacteristicShape = 'MHO' | 'QUADRILATERAL';

export interface RxPoint {
  tMs: number;
  r: number;
  x: number;
  zMag: number;
  angleDeg: number;
}

export interface RxAnalysisResult {
  currentPoint: RxPoint;
  trajectory: RxPoint[];
  detectedZone: 'ZONE_1' | 'ZONE_2' | 'REVERSE_ZONE' | 'LOAD_NORMAL';
  isTripped: boolean;
  lineImpedanceOhm: number;
  lineAngleDeg: number;
  z1ReachOhm: number;
  z2ReachOhm: number;
  rArcCoverageOhm: number;
  faultDistancePct: number;
}

export interface PhasorVector {
  name: string;
  re: number;
  im: number;
  magnitude: number;
  angleDeg: number;
  color: string;
  unit: string;
  isVoltage?: boolean;
}

export interface PhasorAnalysisResult {
  va: PhasorVector;
  vb: PhasorVector;
  vc: PhasorVector;
  ia: PhasorVector;
  ib: PhasorVector;
  ic: PhasorVector;
  i1_direct: PhasorVector;
  i2_inverse: PhasorVector;
  i0_homopolar: PhasorVector;
  v1_direct: PhasorVector;
  v2_inverse: PhasorVector;
  v0_homopolar: PhasorVector;
  unbalanceI2_pct: number;
  unbalanceI0_pct: number;
  unbalanceV2_pct: number;
  impedanceMag_ohm: number;
  impedanceAngle_deg: number;
  powerFactor: number;
  maxVoltageRms: number;
  maxCurrentRms: number;
}

export interface HarmonicOrder {
  order: number;
  freqHz: number;
  label: string;
  rms: number;
  peak: number;
  pctOfFund: number;
}

export interface FftAnalysisResult {
  fundamentalRms: number;
  fundamentalPeak: number;
  thdPct: number;
  harmonics: HarmonicOrder[];
  h2RatioPct: number;
  isH2RestraintActive: boolean;
  h5RatioPct: number;
  h7RatioPct: number;
  dcComponent: number;
  crestFactor: number;
  channelName: string;
}

export interface SldOscillographyViewerProps {
  locale: 'fr' | 'en';
  onClose?: () => void;
  initialFaultType?: FaultRecordType;
}

export const SldOscillographyViewer: React.FC<SldOscillographyViewerProps> = ({
  locale,
  onClose,
  initialFaultType = 'SINGLE_PHASE_GROUND_FAULT',
}) => {
  const [selectedRecord, setSelectedRecord] = useState<FaultRecordType>(initialFaultType);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(20); // Time in ms (-40 to +160 ms)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(0.5); // 0.2x, 0.5x, 1x
  const [copiedComtrade, setCopiedComtrade] = useState<boolean>(false);
  const [activeChannelView, setActiveChannelView] = useState<'ALL' | 'VOLTAGE' | 'CURRENT' | 'DIGITAL'>('ALL');
  const [viewMode, setViewMode] = useState<OscillogramViewMode>('DUAL_SPLIT');
  const [fftChannel, setFftChannel] = useState<HarmonicChannelType>('IA');
  const [showVoltagePhasors, setShowVoltagePhasors] = useState<boolean>(true);
  const [showCurrentPhasors, setShowCurrentPhasors] = useState<boolean>(true);
  const [showSymmetricalPhasors, setShowSymmetricalPhasors] = useState<boolean>(true);
  const [phasorRefMode, setPhasorRefMode] = useState<'ABSOLUTE' | 'VA_REF'>('ABSOLUTE');
  const [rxShape, setRxShape] = useState<DistanceCharacteristicShape>('MHO');
  const [showRxTrajectory, setShowRxTrajectory] = useState<boolean>(true);
  const [showLoadBlinder, setShowLoadBlinder] = useState<boolean>(true);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importedComtrade, setImportedComtrade] = useState<ParsedComtradeRecord | null>(null);
  const [cfgInputText, setCfgInputText] = useState<string>('');
  const [datInputText, setDatInputText] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [activeImportTab, setActiveImportTab] = useState<'PRELOADED' | 'DROP' | 'PASTE'>('PRELOADED');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Time window bounds
  const T_MIN = -40; // 2 cycles pre-fault at 50 Hz
  const T_MAX = 160; // 8 cycles post-fault
  const DT = 0.5; // 0.5 ms sampling period = 2000 Hz sample rate (IEC 60255 DFR standard)

  const effectiveTMin = (selectedRecord === 'IMPORTED_COMTRADE' && importedComtrade) ? importedComtrade.tMinMs : T_MIN;
  const effectiveTMax = (selectedRecord === 'IMPORTED_COMTRADE' && importedComtrade) ? importedComtrade.tMaxMs : T_MAX;

  // Simulation parameter definitions depending on selected fault record
  const recordConfig = useMemo(() => {
    switch (selectedRecord) {
      case 'THREE_PHASE_BUS_FAULT':
        return {
          title_fr: 'Défaut Triphasé Franc sur Jeu de Barres 225 kV',
          title_en: 'Bolted 3-Phase Fault on 225 kV Busbar',
          ansi: 'ANSI 87B / 50',
          clearingTimeMs: 45,
          pickupTimeMs: 12,
          recloseAttempt: false,
          ik_ka: 22.4,
          ip_ka: 57.1,
          dcTauMs: 45,
          vPre_kv: 130.0, // Phase-to-neutral (225 / sqrt(3))
          vFault_kv: 12.0,
          description_fr: 'Court-circuit triphasé symétrique franc (If = 22.4 kA). Effondrement sévère et équilibré de la tension. Courant homopolaire I0 nul. Élimination ultra-rapide par différentielle barres 87B en 45 ms.',
          description_en: 'Symmetrical 3-phase fault (If = 22.4 kA). Severe balanced voltage sag. Zero residual current I0. Ultra-fast clearance by 87B bus differential in 45 ms.',
        };
      case 'SINGLE_PHASE_GROUND_FAULT':
        return {
          title_fr: 'Défaut Monophasé Phase A - Terre (Réseau 225 kV)',
          title_en: 'Single Phase-to-Ground Fault Phase A - Earth (225 kV)',
          ansi: 'ANSI 50N / 51N / 21',
          clearingTimeMs: 55,
          pickupTimeMs: 15,
          recloseAttempt: false,
          ik_ka: 14.8,
          ip_ka: 38.5,
          dcTauMs: 38,
          vPre_kv: 130.0,
          vFault_kv: 18.0,
          description_fr: 'Défaut dissymétrique Phase A à la terre. Forte composante homopolaire 3I0 = 14.8 kA. Surtension temporaire saine sur phases B et C (hausse à 225 kV entre phases).',
          description_en: 'Asymmetrical Phase A-to-earth fault. High zero-sequence current 3I0 = 14.8 kA. Healthy phase temporary overvoltage on phases B and C.',
        };
      case 'TRAFO_INRUSH_VS_87T':
        return {
          title_fr: 'Enclenchement Transformateur (Inrush) vs Défaut Interne',
          title_en: 'Transformer Inrush Current vs Internal Short-Circuit',
          ansi: 'ANSI 87T (2nd Harmonic Restraint)',
          clearingTimeMs: 999, // Restrained, no trip!
          pickupTimeMs: 999,
          recloseAttempt: false,
          ik_ka: 4.8,
          ip_ka: 12.2,
          dcTauMs: 120, // High magnetic L/R time constant
          vPre_kv: 130.0,
          vFault_kv: 115.0,
          description_fr: 'Courant d\'enclenchement magnétisant dissymétrique riche en harmonique 2 (I2h > 15%). La retenue harmonique 2 du relais 87T bloque le déclenchement intempestif.',
          description_en: 'Asymmetric magnetizing inrush rich in 2nd harmonic (I2h > 15%). ANSI 87T harmonic restraint successfully prevents nuisance trip.',
        };
      case 'ANSI_79_AUTO_RECLOSE':
        return {
          title_fr: 'Défaut Fugitif Ligne avec Cycle Réenclencheur (ANSI 79)',
          title_en: 'Transient Line Fault with Auto-Recloser Cycle (ANSI 79)',
          ansi: 'ANSI 21 + 79 (O - 0.3s - CO)',
          clearingTimeMs: 40,
          pickupTimeMs: 12,
          recloseAttempt: true,
          recloseTimeMs: 110,
          ik_ka: 16.5,
          ip_ka: 42.0,
          dcTauMs: 35,
          vPre_kv: 130.0,
          vFault_kv: 20.0,
          description_fr: 'Défaut fugitif amorcé par la foudre. Ouverture immédiate du disjoncteur 52 en 40 ms. Pause déionisation 70 ms. Réenclenchement réussi à t = 110 ms.',
          description_en: 'Lightning-induced transient fault. Immediate trip in 40 ms. De-ionization dead-time 70 ms. Successful reclose at t = 110 ms with full voltage recovery.',
        };
      case 'IMPORTED_COMTRADE':
        return {
          title_fr: importedComtrade ? `COMTRADE Réel : ${importedComtrade.stationName}` : 'Oscillogramme COMTRADE Importé',
          title_en: importedComtrade ? `Field COMTRADE: ${importedComtrade.stationName}` : 'Imported COMTRADE Record',
          ansi: importedComtrade ? `Relais : ${importedComtrade.deviceId}` : 'CEI 60255-24 / IEEE C37.111',
          clearingTimeMs: 65,
          pickupTimeMs: 22,
          recloseAttempt: false,
          ik_ka: 12.0,
          ip_ka: 30.0,
          dcTauMs: 38,
          vPre_kv: 130.0,
          vFault_kv: 25.0,
          description_fr: importedComtrade ? importedComtrade.rawCfgSummary : 'Fichier COMTRADE chargé et analysé cycle par cycle.',
          description_en: importedComtrade ? importedComtrade.rawCfgSummary : 'COMTRADE record parsed and visualized cycle-by-cycle.',
        };
    }
  }, [selectedRecord, importedComtrade]);

  // Compute instantaneous waveform values at time t (in ms)
  const getSample = (tMs: number) => {
    // If an imported COMTRADE dataset is active, look up / interpolate directly from parsed samples
    if (selectedRecord === 'IMPORTED_COMTRADE' && importedComtrade && importedComtrade.samples.length > 0) {
      const samples = importedComtrade.samples;
      const first = samples[0];
      const last = samples[samples.length - 1];
      if (tMs <= first.tMs) return first;
      if (tMs >= last.tMs) return last;

      let low = 0;
      let high = samples.length - 1;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (samples[mid].tMs < tMs) low = mid + 1;
        else high = mid - 1;
      }
      const idx = Math.min(Math.max(0, low), samples.length - 1);
      return samples[idx];
    }
    const omega = 2 * Math.PI * 50; // 50 Hz rad/s
    const tSec = tMs / 1000;
    const isFaultActive = tMs >= 0 && (
      selectedRecord === 'ANSI_79_AUTO_RECLOSE'
        ? tMs <= recordConfig.clearingTimeMs
        : tMs <= recordConfig.clearingTimeMs
    );
    const isPostReclose = selectedRecord === 'ANSI_79_AUTO_RECLOSE' && tMs >= (recordConfig.recloseTimeMs || 110);
    const isBreakerOpen = tMs > recordConfig.clearingTimeMs && (
      selectedRecord === 'ANSI_79_AUTO_RECLOSE' ? tMs < (recordConfig.recloseTimeMs || 110) : true
    );

    // Pre-fault base currents (nominal ~450 A = 0.45 kA)
    let ia = 0.45 * Math.sin(omega * tSec);
    let ib = 0.45 * Math.sin(omega * tSec - (2 * Math.PI) / 3);
    let ic = 0.45 * Math.sin(omega * tSec + (2 * Math.PI) / 3);

    // Pre-fault base voltages (~130 kV phase-ground)
    let va = recordConfig.vPre_kv * Math.sin(omega * tSec);
    let vb = recordConfig.vPre_kv * Math.sin(omega * tSec - (2 * Math.PI) / 3);
    let vc = recordConfig.vPre_kv * Math.sin(omega * tSec + (2 * Math.PI) / 3);

    if (tMs >= 0) {
      const decay = Math.exp(-tMs / recordConfig.dcTauMs);

      if (selectedRecord === 'THREE_PHASE_BUS_FAULT') {
        if (isFaultActive) {
          ia = recordConfig.ik_ka * Math.SQRT2 * (Math.sin(omega * tSec - Math.PI / 2) + decay * 0.95);
          ib = recordConfig.ik_ka * Math.SQRT2 * (Math.sin(omega * tSec - Math.PI / 2 - (2 * Math.PI) / 3) - decay * 0.48);
          ic = recordConfig.ik_ka * Math.SQRT2 * (Math.sin(omega * tSec - Math.PI / 2 + (2 * Math.PI) / 3) - decay * 0.47);

          va = recordConfig.vFault_kv * Math.sin(omega * tSec);
          vb = recordConfig.vFault_kv * Math.sin(omega * tSec - (2 * Math.PI) / 3);
          vc = recordConfig.vFault_kv * Math.sin(omega * tSec + (2 * Math.PI) / 3);
        } else {
          // Breaker cleared
          ia = 0;
          ib = 0;
          ic = 0;
          va = 0;
          vb = 0;
          vc = 0;
        }
      } else if (selectedRecord === 'SINGLE_PHASE_GROUND_FAULT') {
        if (isFaultActive) {
          // Phase A fault
          ia = recordConfig.ik_ka * Math.SQRT2 * (Math.sin(omega * tSec - Math.PI / 2) + decay * 0.98);
          ib = 0.48 * Math.sin(omega * tSec - (2 * Math.PI) / 3);
          ic = 0.48 * Math.sin(omega * tSec + (2 * Math.PI) / 3);

          va = recordConfig.vFault_kv * Math.sin(omega * tSec);
          // Healthy phase voltage rise due to neutral displacement
          vb = (recordConfig.vPre_kv * 1.55) * Math.sin(omega * tSec - (2 * Math.PI) / 3);
          vc = (recordConfig.vPre_kv * 1.55) * Math.sin(omega * tSec + (2 * Math.PI) / 3);
        } else {
          ia = 0;
          ib = 0;
          ic = 0;
          va = 0;
          vb = 0;
          vc = 0;
        }
      } else if (selectedRecord === 'TRAFO_INRUSH_VS_87T') {
        // High unidirectional peaks rich in 2nd harmonic (100 Hz)
        const inrushA = recordConfig.ik_ka * Math.SQRT2 * Math.pow(Math.max(0, Math.sin(omega * tSec)), 2.2) * decay;
        const inrushB = recordConfig.ik_ka * 0.6 * Math.SQRT2 * Math.pow(Math.max(0, Math.sin(omega * tSec - (2 * Math.PI) / 3)), 2.2) * decay;
        const inrushC = recordConfig.ik_ka * 0.4 * Math.SQRT2 * Math.pow(Math.max(0, Math.sin(omega * tSec + (2 * Math.PI) / 3)), 2.2) * decay;

        ia = inrushA;
        ib = inrushB;
        ic = inrushC;

        va = recordConfig.vFault_kv * Math.sin(omega * tSec);
        vb = recordConfig.vFault_kv * Math.sin(omega * tSec - (2 * Math.PI) / 3);
        vc = recordConfig.vFault_kv * Math.sin(omega * tSec + (2 * Math.PI) / 3);
      } else if (selectedRecord === 'ANSI_79_AUTO_RECLOSE') {
        if (isFaultActive) {
          ia = recordConfig.ik_ka * Math.SQRT2 * (Math.sin(omega * tSec - Math.PI / 2) + decay);
          va = recordConfig.vFault_kv * Math.sin(omega * tSec);
        } else if (isBreakerOpen) {
          ia = 0;
          ib = 0;
          ic = 0;
          va = 0;
          vb = 0;
          vc = 0;
        } else if (isPostReclose) {
          // Reclosure successful!
          const tPost = (tMs - (recordConfig.recloseTimeMs || 110)) / 1000;
          ia = 0.45 * Math.sin(omega * tPost);
          ib = 0.45 * Math.sin(omega * tPost - (2 * Math.PI) / 3);
          ic = 0.45 * Math.sin(omega * tPost + (2 * Math.PI) / 3);
          va = recordConfig.vPre_kv * Math.sin(omega * tPost);
          vb = recordConfig.vPre_kv * Math.sin(omega * tPost - (2 * Math.PI) / 3);
          vc = recordConfig.vPre_kv * Math.sin(omega * tPost + (2 * Math.PI) / 3);
        }
      }
    }

    const in0 = ia + ib + ic; // Residual neutral current (3I0)
    const vn0 = (va + vb + vc) / 3;

    // Digital binary signals (0 or 1)
    const relayTrip = tMs >= recordConfig.pickupTimeMs && tMs <= recordConfig.clearingTimeMs + 20;
    const breakerAux52a = isBreakerOpen ? 0 : 1;
    const autoRecloseActive = selectedRecord === 'ANSI_79_AUTO_RECLOSE' && tMs >= recordConfig.clearingTimeMs && tMs < (recordConfig.recloseTimeMs || 110);

    return {
      tMs,
      va,
      vb,
      vc,
      vn0,
      ia,
      ib,
      ic,
      in0,
      relayTrip: relayTrip ? 1 : 0,
      breakerAux52a,
      autoRecloseActive: autoRecloseActive ? 1 : 0,
    };
  };

  // Precompute trace dataset for SVG rendering
  const dataset = useMemo(() => {
    if (selectedRecord === 'IMPORTED_COMTRADE' && importedComtrade && importedComtrade.samples.length > 0) {
      return importedComtrade.samples;
    }
    const points: ReturnType<typeof getSample>[] = [];
    for (let t = T_MIN; t <= T_MAX; t += DT) {
      points.push(getSample(t));
    }
    return points;
  }, [selectedRecord, recordConfig, importedComtrade]);

  // Current sample at cursor
  const currentSample = useMemo(() => getSample(currentTimeMs), [currentTimeMs, recordConfig, selectedRecord, importedComtrade]);

  // Sliding single-cycle FFT Harmonic Analysis (20 ms window ending at currentTimeMs)
  const fftAnalysis = useMemo((): FftAnalysisResult => {
    const N = 40; // 40 samples over 20 ms (50 Hz cycle) at DT = 0.5 ms
    const samples: number[] = [];
    const tEnd = currentTimeMs;
    const tStart = tEnd - 20;

    for (let k = 0; k < N; k++) {
      const tSample = tStart + (k / N) * 20;
      const s = getSample(tSample);
      let val = s.ia;
      if (fftChannel === 'IB') val = s.ib;
      else if (fftChannel === 'IC') val = s.ic;
      else if (fftChannel === 'IN0') val = s.in0;
      else if (fftChannel === 'VA') val = s.va;
      samples.push(val);
    }

    // DC Component (Mean value over 1 full cycle)
    const dcComponent = samples.reduce((acc, v) => acc + v, 0) / N;

    // Discrete Fourier Transform for orders: H1, H2, H3, H4, H5, H7, H9, H11
    const orders = [1, 2, 3, 4, 5, 7, 9, 11];
    const harmonicResults: { order: number; freqHz: number; label: string; peak: number; rms: number }[] = [];

    for (const h of orders) {
      let re = 0;
      let im = 0;
      for (let k = 0; k < N; k++) {
        const theta = (2 * Math.PI * h * k) / N;
        re += samples[k] * Math.cos(theta);
        im += samples[k] * Math.sin(theta);
      }
      re = (2 / N) * re;
      im = (2 / N) * im;
      const peak = Math.sqrt(re * re + im * im);
      const rms = peak / Math.SQRT2;
      harmonicResults.push({
        order: h,
        freqHz: h * 50,
        label: `H${h}`,
        peak,
        rms,
      });
    }

    const fund = harmonicResults[0]; // order 1 (50 Hz)
    const fundPeak = Math.max(fund.peak, 0.0001);
    const fundRms = fund.rms;

    let sumHarmonicSq = 0;
    const harmonics: HarmonicOrder[] = harmonicResults.map((hr) => {
      const pctOfFund = hr.order === 1 ? 100 : (hr.peak / fundPeak) * 100;
      if (hr.order > 1) {
        sumHarmonicSq += hr.peak * hr.peak;
      }
      return {
        ...hr,
        pctOfFund,
      };
    });

    const thdPct = (Math.sqrt(sumHarmonicSq) / fundPeak) * 100;
    const h2 = harmonics.find((h) => h.order === 2)?.pctOfFund || 0;
    const h5 = harmonics.find((h) => h.order === 5)?.pctOfFund || 0;
    const h7 = harmonics.find((h) => h.order === 7)?.pctOfFund || 0;

    // ANSI 87T Restraint is active if H2 ratio >= 15.0% and current is non-zero
    const isH2RestraintActive = h2 >= 15.0 && fundRms > 0.05;

    const maxAbs = Math.max(...samples.map(Math.abs));
    const crestFactor = fundRms > 0.001 ? maxAbs / fundRms : 1.414;

    const channelName = 
      fftChannel === 'IA' ? (locale === 'fr' ? 'Courant Phase A (iA)' : 'Phase A Current (iA)') :
      fftChannel === 'IB' ? (locale === 'fr' ? 'Courant Phase B (iB)' : 'Phase B Current (iB)') :
      fftChannel === 'IC' ? (locale === 'fr' ? 'Courant Phase C (iC)' : 'Phase C Current (iC)') :
      fftChannel === 'IN0' ? (locale === 'fr' ? 'Courant Homopolaire (3I0)' : 'Residual Ground (3I0)') :
      (locale === 'fr' ? 'Tension Phase A (vA)' : 'Phase A Voltage (vA)');

    return {
      fundamentalRms: fundRms,
      fundamentalPeak: fundPeak,
      thdPct,
      harmonics,
      h2RatioPct: h2,
      isH2RestraintActive,
      h5RatioPct: h5,
      h7RatioPct: h7,
      dcComponent,
      crestFactor,
      channelName,
    };
  }, [currentTimeMs, fftChannel, selectedRecord, recordConfig, locale]);

  // Sliding single-cycle Phasor Vector & Fortescue Symmetrical Components Analysis
  const phasorAnalysis = useMemo((): PhasorAnalysisResult => {
    const N = 40; // 40 samples over 20 ms
    const tEnd = currentTimeMs;
    const tStart = tEnd - 20;

    const vaSamples: number[] = [];
    const vbSamples: number[] = [];
    const vcSamples: number[] = [];
    const iaSamples: number[] = [];
    const ibSamples: number[] = [];
    const icSamples: number[] = [];

    for (let k = 0; k < N; k++) {
      const tSample = tStart + (k / N) * 20;
      const s = getSample(tSample);
      vaSamples.push(s.va);
      vbSamples.push(s.vb);
      vcSamples.push(s.vc);
      iaSamples.push(s.ia);
      ibSamples.push(s.ib);
      icSamples.push(s.ic);
    }

    // Helper to calculate fundamental Fourier complex phasor
    const computePhasor = (samples: number[], name: string, color: string, unit: string, isVoltage = false): PhasorVector => {
      let re = 0;
      let im = 0;
      for (let k = 0; k < N; k++) {
        const theta = (2 * Math.PI * k) / N;
        re += samples[k] * Math.cos(theta);
        im += samples[k] * Math.sin(theta);
      }
      re = (2 / N) * re;
      im = (2 / N) * im;
      const peak = Math.sqrt(re * re + im * im);
      const rms = peak / Math.SQRT2;
      let angleDeg = (Math.atan2(im, re) * 180) / Math.PI;
      if (angleDeg < 0) angleDeg += 360;

      return {
        name,
        re,
        im,
        magnitude: rms,
        angleDeg,
        color,
        unit,
        isVoltage,
      };
    };

    let va = computePhasor(vaSamples, 'VA', '#f43f5e', 'kV', true);
    let vb = computePhasor(vbSamples, 'VB', '#fbbf24', 'kV', true);
    let vc = computePhasor(vcSamples, 'VC', '#38bdf8', 'kV', true);
    let ia = computePhasor(iaSamples, 'IA', '#f43f5e', 'kA', false);
    let ib = computePhasor(ibSamples, 'IB', '#fbbf24', 'kA', false);
    let ic = computePhasor(icSamples, 'IC', '#38bdf8', 'kA', false);

    // If VA_REF mode, rotate all angles by -va.angleDeg so VA aligns with 0 degrees
    if (phasorRefMode === 'VA_REF') {
      const refAngle = va.angleDeg;
      const rotatePhasor = (p: PhasorVector): PhasorVector => {
        let newAngle = p.angleDeg - refAngle;
        if (newAngle < 0) newAngle += 360;
        if (newAngle >= 360) newAngle -= 360;
        const rad = (newAngle * Math.PI) / 180;
        const peak = p.magnitude * Math.SQRT2;
        return {
          ...p,
          angleDeg: newAngle,
          re: peak * Math.cos(rad),
          im: peak * Math.sin(rad),
        };
      };
      va = rotatePhasor(va);
      vb = rotatePhasor(vb);
      vc = rotatePhasor(vc);
      ia = rotatePhasor(ia);
      ib = rotatePhasor(ib);
      ic = rotatePhasor(ic);
    }

    // Fortescue Symmetrical Components
    // a = e^(j 120°) = -0.5 + j (sqrt(3)/2)
    // a^2 = e^(j 240°) = -0.5 - j (sqrt(3)/2)
    const sqrt3Over2 = Math.sqrt(3) / 2;
    const multA = (re: number, im: number) => ({
      re: -0.5 * re - sqrt3Over2 * im,
      im: sqrt3Over2 * re - 0.5 * im,
    });
    const multA2 = (re: number, im: number) => ({
      re: -0.5 * re + sqrt3Over2 * im,
      im: -sqrt3Over2 * re - 0.5 * im,
    });

    // Current sequence components (I1, I2, I0)
    const aIb = multA(ib.re, ib.im);
    const a2Ic = multA2(ic.re, ic.im);
    const a2Ib = multA2(ib.re, ib.im);
    const aIc = multA(ic.re, ic.im);

    const i1_re = (ia.re + aIb.re + a2Ic.re) / 3;
    const i1_im = (ia.im + aIb.im + a2Ic.im) / 3;
    const i1_mag = Math.sqrt(i1_re * i1_re + i1_im * i1_im) / Math.SQRT2;
    let i1_ang = (Math.atan2(i1_im, i1_re) * 180) / Math.PI;
    if (i1_ang < 0) i1_ang += 360;

    const i2_re = (ia.re + a2Ib.re + aIc.re) / 3;
    const i2_im = (ia.im + a2Ib.im + aIc.im) / 3;
    const i2_mag = Math.sqrt(i2_re * i2_re + i2_im * i2_im) / Math.SQRT2;
    let i2_ang = (Math.atan2(i2_im, i2_re) * 180) / Math.PI;
    if (i2_ang < 0) i2_ang += 360;

    const i0_re = (ia.re + ib.re + ic.re) / 3;
    const i0_im = (ia.im + ib.im + ic.im) / 3;
    const i0_mag = Math.sqrt(i0_re * i0_re + i0_im * i0_im) / Math.SQRT2;
    let i0_ang = (Math.atan2(i0_im, i0_re) * 180) / Math.PI;
    if (i0_ang < 0) i0_ang += 360;

    // Voltage sequence components (V1, V2, V0)
    const aVb = multA(vb.re, vb.im);
    const a2Vc = multA2(vc.re, vc.im);
    const a2Vb = multA2(vb.re, vb.im);
    const aVc = multA(vc.re, vc.im);

    const v1_re = (va.re + aVb.re + a2Vc.re) / 3;
    const v1_im = (va.im + aVb.im + a2Vc.im) / 3;
    const v1_mag = Math.sqrt(v1_re * v1_re + v1_im * v1_im) / Math.SQRT2;
    let v1_ang = (Math.atan2(v1_im, v1_re) * 180) / Math.PI;
    if (v1_ang < 0) v1_ang += 360;

    const v2_re = (va.re + a2Vb.re + aVc.re) / 3;
    const v2_im = (va.im + a2Vb.im + aVc.im) / 3;
    const v2_mag = Math.sqrt(v2_re * v2_re + v2_im * v2_im) / Math.SQRT2;
    let v2_ang = (Math.atan2(v2_im, v2_re) * 180) / Math.PI;
    if (v2_ang < 0) v2_ang += 360;

    const v0_re = (va.re + vb.re + vc.re) / 3;
    const v0_im = (va.im + vb.im + vc.im) / 3;
    const v0_mag = Math.sqrt(v0_re * v0_re + v0_im * v0_im) / Math.SQRT2;
    let v0_ang = (Math.atan2(v0_im, v0_re) * 180) / Math.PI;
    if (v0_ang < 0) v0_ang += 360;

    // Unbalance Factors
    const unbalanceI2_pct = i1_mag > 0.01 ? (i2_mag / i1_mag) * 100 : 0;
    const unbalanceI0_pct = i1_mag > 0.01 ? (i0_mag / i1_mag) * 100 : 0;
    const unbalanceV2_pct = v1_mag > 0.01 ? (v2_mag / v1_mag) * 100 : 0;

    // Loop Impedance Z = VA / IA
    const impedanceMag_ohm = ia.magnitude > 0.02 ? (va.magnitude / ia.magnitude) : 999;
    let phi = va.angleDeg - ia.angleDeg;
    while (phi > 180) phi -= 360;
    while (phi < -180) phi += 360;
    const powerFactor = Math.cos((phi * Math.PI) / 180);

    const maxVoltageRms = Math.max(va.magnitude, vb.magnitude, vc.magnitude, 1.0);
    const maxCurrentRms = Math.max(ia.magnitude, ib.magnitude, ic.magnitude, 0.1);

    return {
      va,
      vb,
      vc,
      ia,
      ib,
      ic,
      i1_direct: { name: 'I1 (Direct)', re: i1_re, im: i1_im, magnitude: i1_mag, angleDeg: i1_ang, color: '#06b6d4', unit: 'kA' },
      i2_inverse: { name: 'I2 (Inverse)', re: i2_re, im: i2_im, magnitude: i2_mag, angleDeg: i2_ang, color: '#f97316', unit: 'kA' },
      i0_homopolar: { name: 'I0 (Homopolaire)', re: i0_re, im: i0_im, magnitude: i0_mag, angleDeg: i0_ang, color: '#c084fc', unit: 'kA' },
      v1_direct: { name: 'V1 (Direct)', re: v1_re, im: v1_im, magnitude: v1_mag, angleDeg: v1_ang, color: '#06b6d4', unit: 'kV', isVoltage: true },
      v2_inverse: { name: 'V2 (Inverse)', re: v2_re, im: v2_im, magnitude: v2_mag, angleDeg: v2_ang, color: '#f97316', unit: 'kV', isVoltage: true },
      v0_homopolar: { name: 'V0 (Homopolaire)', re: v0_re, im: v0_im, magnitude: v0_mag, angleDeg: v0_ang, color: '#c084fc', unit: 'kV', isVoltage: true },
      unbalanceI2_pct,
      unbalanceI0_pct,
      unbalanceV2_pct,
      impedanceMag_ohm,
      impedanceAngle_deg: phi,
      powerFactor,
      maxVoltageRms,
      maxCurrentRms,
    };
  }, [currentTimeMs, selectedRecord, recordConfig, phasorRefMode]);

  // Distance Relay R-X Impedance Trajectory & Zone Reach Analysis (ANSI 21)
  const rxAnalysis = useMemo((): RxAnalysisResult => {
    // 225 kV line parameters (Length ~ 50 km, 225 kV, 400 mm² Almelec)
    const lineImpedanceOhm = 14.2;
    const lineAngleDeg = 83.5;
    const lineAngleRad = (lineAngleDeg * Math.PI) / 180;
    
    // Zone 1 Reach: 80% of line impedance
    const z1ReachOhm = 0.8 * lineImpedanceOhm; // ~11.36 Ohm
    // Zone 2 Reach: 120% of line impedance
    const z2ReachOhm = 1.2 * lineImpedanceOhm; // ~17.04 Ohm
    const rArcCoverageOhm = 16.0; // Arc resistance coverage in quadrilateral mode

    // Helper to calculate apparent loop impedance at a given time t
    const computeZAt = (t: number): RxPoint => {
      const N = 40;
      let va_re = 0;
      let va_im = 0;
      let ia_re = 0;
      let ia_im = 0;

      for (let k = 0; k < N; k++) {
        const tSample = (t - 20) + (k / N) * 20;
        const s = getSample(tSample);
        const theta = (2 * Math.PI * k) / N;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        va_re += s.va * cosT;
        va_im += s.va * sinT;
        ia_re += s.ia * cosT;
        ia_im += s.ia * sinT;
      }
      va_re = (2 / N) * va_re;
      va_im = (2 / N) * va_im;
      ia_re = (2 / N) * ia_re;
      ia_im = (2 / N) * ia_im;

      const iSq = ia_re * ia_re + ia_im * ia_im;
      let r = 50.0;
      let x = 30.0;

      if (iSq > 0.005) {
        // Z = V / I in Ohms (kV / kA = Ohm)
        r = (va_re * ia_re + va_im * ia_im) / iSq;
        x = (va_im * ia_re - va_re * ia_im) / iSq;
      } else {
        // Breaker open or negligible load current -> high impedance
        r = 85.0;
        x = 45.0;
      }

      // Clamp values to prevent numerical extremes outside chart visual boundaries
      r = Math.max(-15, Math.min(60, r));
      x = Math.max(-15, Math.min(50, x));

      const zMag = Math.sqrt(r * r + x * x);
      let angleDeg = (Math.atan2(x, r) * 180) / Math.PI;
      if (angleDeg < 0) angleDeg += 360;

      return { tMs: t, r, x, zMag, angleDeg };
    };

    // Calculate historical trajectory from T_MIN (-40 ms) up to currentTimeMs
    const trajectory: RxPoint[] = [];
    const stepMs = 2.0;
    for (let t = T_MIN; t <= currentTimeMs; t += stepMs) {
      trajectory.push(computeZAt(t));
    }
    // Always include exact current point
    const currentPoint = computeZAt(currentTimeMs);
    trajectory.push(currentPoint);

    // Mho Zone Detection
    // Mho circle 1 center & radius
    const z1_tip_r = z1ReachOhm * Math.cos(lineAngleRad);
    const z1_tip_x = z1ReachOhm * Math.sin(lineAngleRad);
    const mho1_cx = z1_tip_r / 2;
    const mho1_cy = z1_tip_x / 2;
    const mho1_rad = z1ReachOhm / 2;

    const distFromMho1Center = Math.sqrt((currentPoint.r - mho1_cx) ** 2 + (currentPoint.x - mho1_cy) ** 2);
    const inMho1 = distFromMho1Center <= mho1_rad;

    // Mho circle 2 center & radius
    const z2_tip_r = z2ReachOhm * Math.cos(lineAngleRad);
    const z2_tip_x = z2ReachOhm * Math.sin(lineAngleRad);
    const mho2_cx = z2_tip_r / 2;
    const mho2_cy = z2_tip_x / 2;
    const mho2_rad = z2ReachOhm / 2;

    const distFromMho2Center = Math.sqrt((currentPoint.r - mho2_cx) ** 2 + (currentPoint.x - mho2_cy) ** 2);
    const inMho2 = distFromMho2Center <= mho2_rad;

    // Quadrilateral Zone Detection
    const inQuad1 = currentPoint.x >= 0.2 && currentPoint.x <= z1_tip_x && currentPoint.r >= -2.0 && currentPoint.r <= rArcCoverageOhm;
    const inQuad2 = currentPoint.x >= 0.2 && currentPoint.x <= z2_tip_x && currentPoint.r >= -4.0 && currentPoint.r <= (rArcCoverageOhm + 6.0);

    // Reverse zone check
    const inReverse = currentPoint.x < -0.2 && currentPoint.r < 0;

    let detectedZone: 'ZONE_1' | 'ZONE_2' | 'REVERSE_ZONE' | 'LOAD_NORMAL' = 'LOAD_NORMAL';
    if (rxShape === 'MHO') {
      if (inMho1) detectedZone = 'ZONE_1';
      else if (inMho2) detectedZone = 'ZONE_2';
      else if (inReverse) detectedZone = 'REVERSE_ZONE';
    } else {
      if (inQuad1) detectedZone = 'ZONE_1';
      else if (inQuad2) detectedZone = 'ZONE_2';
      else if (inReverse) detectedZone = 'REVERSE_ZONE';
    }

    const isTripped = (detectedZone === 'ZONE_1') || (detectedZone === 'ZONE_2' && currentTimeMs >= recordConfig.pickupTimeMs);
    const faultDistancePct = Math.max(0, Math.min(100, (currentPoint.x / z1_tip_x) * 80));

    return {
      currentPoint,
      trajectory,
      detectedZone,
      isTripped,
      lineImpedanceOhm,
      lineAngleDeg,
      z1ReachOhm,
      z2ReachOhm,
      rArcCoverageOhm,
      faultDistancePct,
    };
  }, [currentTimeMs, getSample, T_MIN, recordConfig, rxShape]);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    let lastTimestamp = performance.now();
    const frame = (now: number) => {
      const deltaSec = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      setCurrentTimeMs((prev) => {
        // Step forward proportional to speed (1x = 1 ms per 1 ms real-time)
        const advance = deltaSec * 1000 * playSpeed;
        const next = prev + advance;
        if (next > T_MAX) {
          setIsPlaying(false);
          return T_MAX;
        }
        return next;
      });

      animationRef.current = requestAnimationFrame(frame);
    };

    animationRef.current = requestAnimationFrame(frame);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, playSpeed, effectiveTMax]);

  // Step controls
  const handleStepForwardCycle = () => {
    setIsPlaying(false);
    setCurrentTimeMs((prev) => Math.min(effectiveTMax, prev + 20)); // +1 cycle at 50 Hz (20 ms)
  };

  const handleStepBackwardCycle = () => {
    setIsPlaying(false);
    setCurrentTimeMs((prev) => Math.max(effectiveTMin, prev - 20)); // -1 cycle
  };

  const handleStepQuarterCycle = () => {
    setIsPlaying(false);
    setCurrentTimeMs((prev) => Math.min(effectiveTMax, prev + 5)); // +5 ms = quarter cycle
  };

  const handleResetTimeline = () => {
    setIsPlaying(false);
    setCurrentTimeMs(effectiveTMin);
  };

  // Dynamic time divisions across the active timeline
  const timeTicks = useMemo(() => {
    const ticks: number[] = [];
    const start = Math.floor(effectiveTMin / 20) * 20;
    const end = Math.ceil(effectiveTMax / 20) * 20;
    for (let t = start; t <= end; t += 20) {
      if (t >= effectiveTMin && t <= effectiveTMax) {
        ticks.push(t);
      }
    }
    return ticks.length > 0 ? ticks : [-40, -20, 0, 20, 40, 60, 80, 100, 120, 140, 160];
  }, [effectiveTMin, effectiveTMax]);

  // COMTRADE Loading Handlers
  const handleLoadPreloadedComtrade = (sampleKey: keyof typeof PRELOADED_COMTRADE_SAMPLES) => {
    try {
      setImportError(null);
      const sample = PRELOADED_COMTRADE_SAMPLES[sampleKey];
      const parsed = parseComtrade(sample.cfg, sample.generateDat());
      setImportedComtrade(parsed);
      setSelectedRecord('IMPORTED_COMTRADE');
      setCurrentTimeMs(20);
      setImportSuccess(`Oscillogramme "${sample.title}" chargé (${parsed.totalSamples} échantillons, Fe = ${parsed.sampleRateHz} Hz).`);
      setShowImportModal(false);
    } catch (err: any) {
      setImportError(err?.message || 'Erreur lors du décodage du fichier COMTRADE.');
    }
  };

  const handleParsePastedComtrade = () => {
    try {
      setImportError(null);
      if (!cfgInputText.trim()) {
        throw new Error('Veuillez renseigner le contenu du fichier .CFG.');
      }
      if (!datInputText.trim()) {
        throw new Error('Veuillez renseigner le contenu du fichier .DAT.');
      }
      const parsed = parseComtrade(cfgInputText, datInputText);
      setImportedComtrade(parsed);
      setSelectedRecord('IMPORTED_COMTRADE');
      setCurrentTimeMs(20);
      setImportSuccess(`Fichier COMTRADE ${parsed.stationName} chargé (${parsed.totalSamples} échantillons).`);
      setShowImportModal(false);
    } catch (err: any) {
      setImportError(err?.message || 'Erreur lors du décodage des données COMTRADE collées.');
    }
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setImportError(null);
    let cfgFile: File | null = null;
    let datFile: File | null = null;

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const name = f.name.toLowerCase();
      if (name.endsWith('.cfg')) cfgFile = f;
      else if (name.endsWith('.dat')) datFile = f;
    }

    if (!cfgFile || !datFile) {
      setImportError('Veuillez sélectionner à la fois le fichier .CFG et le fichier .DAT (ou les déposer ensemble).');
      return;
    }

    const readerCfg = new FileReader();
    readerCfg.onload = (eCfg) => {
      const cfgContent = eCfg.target?.result as string;
      const readerDat = new FileReader();
      readerDat.onload = (eDat) => {
        const datContent = eDat.target?.result as string;
        try {
          const parsed = parseComtrade(cfgContent, datContent);
          setImportedComtrade(parsed);
          setSelectedRecord('IMPORTED_COMTRADE');
          setCurrentTimeMs(20);
          setImportSuccess(`Fichier importé avec succès : ${parsed.stationName} (${parsed.totalSamples} échantillons).`);
          setShowImportModal(false);
        } catch (err: any) {
          setImportError(err?.message || 'Erreur lors de l\'analyse des fichiers COMTRADE importés.');
        }
      };
      readerDat.readAsText(datFile!);
    };
    readerCfg.readAsText(cfgFile);
  };

  // SVG coordinate transformation helpers
  const svgWidth = 840;
  const tToX = (t: number) => 70 + ((t - effectiveTMin) / (effectiveTMax - effectiveTMin)) * (svgWidth - 90);
  const vToY = (v: number, baseY: number, scaleY: number) => baseY - v * scaleY;
  const iToY = (i: number, baseY: number, scaleY: number) => baseY - i * scaleY;

  // Generate SVG Path Strings for Waveforms
  const pathVa = useMemo(() => {
    return dataset.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${tToX(d.tMs).toFixed(1)} ${vToY(d.va, 85, 0.42).toFixed(1)}`).join(' ');
  }, [dataset]);

  const pathVb = useMemo(() => {
    return dataset.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${tToX(d.tMs).toFixed(1)} ${vToY(d.vb, 85, 0.42).toFixed(1)}`).join(' ');
  }, [dataset]);

  const pathVc = useMemo(() => {
    return dataset.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${tToX(d.tMs).toFixed(1)} ${vToY(d.vc, 85, 0.42).toFixed(1)}`).join(' ');
  }, [dataset]);

  const pathIa = useMemo(() => {
    const scale = recordConfig.ik_ka > 10 ? 2.5 : 5.0;
    return dataset.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${tToX(d.tMs).toFixed(1)} ${iToY(d.ia, 205, scale).toFixed(1)}`).join(' ');
  }, [dataset, recordConfig.ik_ka]);

  const pathIb = useMemo(() => {
    const scale = recordConfig.ik_ka > 10 ? 2.5 : 5.0;
    return dataset.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${tToX(d.tMs).toFixed(1)} ${iToY(d.ib, 205, scale).toFixed(1)}`).join(' ');
  }, [dataset, recordConfig.ik_ka]);

  const pathIc = useMemo(() => {
    const scale = recordConfig.ik_ka > 10 ? 2.5 : 5.0;
    return dataset.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${tToX(d.tMs).toFixed(1)} ${iToY(d.ic, 205, scale).toFixed(1)}`).join(' ');
  }, [dataset, recordConfig.ik_ka]);

  const pathIn0 = useMemo(() => {
    const scale = recordConfig.ik_ka > 10 ? 2.5 : 5.0;
    return dataset.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${tToX(d.tMs).toFixed(1)} ${iToY(d.in0, 205, scale).toFixed(1)}`).join(' ');
  }, [dataset, recordConfig.ik_ka]);

  // Digital channels paths
  const pathRelayTrip = useMemo(() => {
    return dataset.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${tToX(d.tMs).toFixed(1)} ${(285 - d.relayTrip * 18).toFixed(1)}`).join(' ');
  }, [dataset]);

  const pathBreaker52a = useMemo(() => {
    return dataset.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${tToX(d.tMs).toFixed(1)} ${(325 - d.breakerAux52a * 18).toFixed(1)}`).join(' ');
  }, [dataset]);

  // Export COMTRADE text summary
  const handleExportComtrade = () => {
    const header = [
      `EPEDE_SUBSTATION_DFR,${selectedRecord},2026`,
      `8,6A,2D`,
      `1,VA,A,,kV,1,0,0,-200,200`,
      `2,VB,B,,kV,1,0,0,-200,200`,
      `3,VC,C,,kV,1,0,0,-200,200`,
      `4,IA,A,,kA,1,0,0,-60,60`,
      `5,IB,B,,kA,1,0,0,-60,60`,
      `6,IC,C,,kA,1,0,0,-60,60`,
      `1,TRIP,0`,
      `2,52A,0`,
      `50.0`,
      `1`,
      `2000,${dataset.length}`,
      `TIMESTAMP: ${new Date().toISOString()}`,
      `IEEE C37.111 / IEC 60255-24 COMPLIANT RECORD`,
    ].join('\n');

    const blob = new Blob([header], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comtrade-${selectedRecord.toLowerCase()}-${Date.now()}.cfg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setCopiedComtrade(true);
    setTimeout(() => setCopiedComtrade(false), 2000);
  };

  const cursorX = tToX(currentTimeMs);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#0A101A] border border-[#1E2D44] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-[#0F1726] border-b border-[#1E2E44] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  {locale === 'fr' ? 'RELECTEUR OSCILLOGRAPHIQUE & REJOUEMENT TRANSITOIRE' : 'OSCILLOGRAPHY REPLAY & DIGITAL FAULT RECORDER'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  IEC 60255-24 / COMTRADE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? 'Rejouement pas-à-pas cycle par cycle (20 ms / 50 Hz) des ondes de tension, courant et contacts binaires de protection.'
                  : 'Cycle-by-cycle (20 ms / 50 Hz) transient playback of 3-phase voltages, fault currents, and binary protection contacts.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/25 hover:bg-violet-600/35 text-violet-300 border border-violet-500/50 text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
              title="Importer un fichier oscillographique COMTRADE (.CFG & .DAT)"
            >
              <Upload className="h-3.5 w-3.5 text-violet-400" />
              <span>{locale === 'fr' ? 'IMPORTER .CFG / .DAT' : 'IMPORT .CFG / .DAT'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportComtrade}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
              title="Exporter les fichiers COMTRADE (.CFG)"
            >
              {copiedComtrade ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Download className="h-3.5 w-3.5 text-cyan-400" />}
              <span>{copiedComtrade ? (locale === 'fr' ? 'EXPORTÉ' : 'EXPORTED') : 'COMTRADE'}</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Fault Event Selector Bar */}
        <div className="px-5 py-2.5 bg-[#0C1320] border-b border-[#1C2C40] flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase shrink-0 mr-1">
            {locale === 'fr' ? 'Oscillogramme :' : 'Oscillogram:'}
          </span>

          <button
            type="button"
            onClick={() => { setSelectedRecord('SINGLE_PHASE_GROUND_FAULT'); setCurrentTimeMs(20); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all border ${
              selectedRecord === 'SINGLE_PHASE_GROUND_FAULT'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-xs'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            1. Monophasé Terre (14.8 kA)
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRecord('THREE_PHASE_BUS_FAULT'); setCurrentTimeMs(20); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all border ${
              selectedRecord === 'THREE_PHASE_BUS_FAULT'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-xs'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            2. Triphasé Barre 87B (22.4 kA)
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRecord('ANSI_79_AUTO_RECLOSE'); setCurrentTimeMs(20); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all border ${
              selectedRecord === 'ANSI_79_AUTO_RECLOSE'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-xs'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            3. Réenclencheur ANSI 79
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRecord('TRAFO_INRUSH_VS_87T'); setCurrentTimeMs(20); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all border ${
              selectedRecord === 'TRAFO_INRUSH_VS_87T'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-xs'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            4. Inrush Transfo (Retenue 2h)
          </button>

          <button
            type="button"
            onClick={() => {
              if (importedComtrade) {
                setSelectedRecord('IMPORTED_COMTRADE');
                setCurrentTimeMs(20);
              } else {
                setShowImportModal(true);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
              selectedRecord === 'IMPORTED_COMTRADE'
                ? 'bg-violet-500/25 text-violet-300 border-violet-500/50 shadow-xs'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-violet-400" />
            <span>{importedComtrade ? `5. ${importedComtrade.stationName.slice(0, 18)}` : '5. Importer COMTRADE...'}</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-[#080E18]">
          
          {/* COMTRADE Import Success Notification */}
          {importSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs font-mono text-emerald-200 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{importSuccess}</span>
              </div>
              <button
                type="button"
                onClick={() => setImportSuccess(null)}
                className="text-emerald-400 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Top Event Metadata Banner */}
          <div className="p-3.5 rounded-xl bg-[#0D1624] border border-[#1F2E44] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span className="font-bold text-white text-sm">
                  {locale === 'fr' ? recordConfig.title_fr : recordConfig.title_en}
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                  {recordConfig.ansi}
                </span>
              </div>
              <p className="text-slate-400 font-sans text-xs mt-1">
                {locale === 'fr' ? recordConfig.description_fr : recordConfig.description_en}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">{locale === 'fr' ? 'Durée Élimination' : 'Clearing Time'}</span>
                <span className="font-bold text-amber-400">{recordConfig.clearingTimeMs < 500 ? `${recordConfig.clearingTimeMs} ms` : 'BLOCAGE'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">{locale === 'fr' ? 'Crête Dynamique ip' : 'Peak Crest ip'}</span>
                <span className="font-bold text-rose-400">{recordConfig.ip_ka} kA</span>
              </div>
            </div>
          </div>

          {/* Interactive Scrubbing & Transport Deck */}
          <div className="p-3.5 rounded-xl bg-[#0D1624] border border-[#1F2E44] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              
              {/* Transport Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetTimeline}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  title="Revenir au pré-défaut (t = -40 ms)"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleStepBackwardCycle}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-colors"
                  title="Reculer d'un cycle (20 ms)"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>-1 CYCLE</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-md ${
                    isPlaying
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{isPlaying ? (locale === 'fr' ? 'PAUSE' : 'PAUSE') : (locale === 'fr' ? 'LECTURE' : 'PLAY')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleStepQuarterCycle}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-colors"
                  title="Avancer d'un quart de cycle (5 ms)"
                >
                  <span>+1/4</span>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={handleStepForwardCycle}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-colors"
                  title="Avancer d'un cycle (20 ms)"
                >
                  <span>+1 CYCLE</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Playback speed selector */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-slate-400 text-[11px]">{locale === 'fr' ? 'Vitesse :' : 'Speed:'}</span>
                {[0.2, 0.5, 1.0].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPlaySpeed(s)}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                      playSpeed === s
                        ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Cursor position readout */}
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-slate-400">
                  {locale === 'fr' ? 'Curseur instantané :' : 'Cursor position:'}
                </span>
                <span className="px-2.5 py-1 rounded bg-black/50 border border-slate-800 text-white font-bold text-sm">
                  t = {currentTimeMs.toFixed(1)} ms
                </span>
                <span className="text-slate-400 text-[11px]">
                  ({((currentTimeMs) / 20).toFixed(2)} cycles)
                </span>
              </div>
            </div>

            {/* View Mode & Instant Harmonic / Phasor Status Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setViewMode('DUAL_SPLIT')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    viewMode === 'DUAL_SPLIT'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Double Vue (Ondes + Phasors)' : 'Dual View (Waves + Phasors)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('WAVEFORMS')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    viewMode === 'WAVEFORMS'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Ondes Seules' : 'Waveforms Only'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('PHASOR_RADAR')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    viewMode === 'PHASOR_RADAR'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Diagramme Phasoriel & Fortescue' : 'Phasor & Fortescue'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('RX_IMPEDANCE')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    viewMode === 'RX_IMPEDANCE'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Crosshair className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Plan d\'Impédance R-X (ANSI 21)' : 'R-X Impedance Plane (ANSI 21)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('FFT_SPECTRUM')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    viewMode === 'FFT_SPECTRUM'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart2 className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Spectre FFT & Retenue 87T' : 'FFT Spectrum & 87T'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('LINE_DIFF_87L')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                    viewMode === 'LINE_DIFF_87L'
                      ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/50 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Différentielle Ligne ANSI 87L' : 'Line Diff ANSI 87L'}</span>
                </button>
              </div>

              {/* Instant Status Pill */}
              <div className="flex items-center gap-2 text-xs font-mono">
                {rxAnalysis.detectedZone === 'ZONE_1' ? (
                  <span className="px-2.5 py-0.5 rounded font-bold bg-rose-500/30 text-rose-300 border border-rose-500/50 animate-pulse flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                    {locale === 'fr' ? `TRIP ZONE 1 (ANSI 21) - R = ${rxAnalysis.currentPoint.r.toFixed(1)}Ω, X = ${rxAnalysis.currentPoint.x.toFixed(1)}Ω` : `ZONE 1 TRIP (ANSI 21) - R = ${rxAnalysis.currentPoint.r.toFixed(1)}Ω, X = ${rxAnalysis.currentPoint.x.toFixed(1)}Ω`}
                  </span>
                ) : rxAnalysis.detectedZone === 'ZONE_2' ? (
                  <span className="px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    {locale === 'fr' ? 'PICKUP ZONE 2 (TEMPORISÉ 300 ms)' : 'ZONE 2 PICKUP (DELAYED 300 ms)'}
                  </span>
                ) : phasorAnalysis.unbalanceI2_pct > 15 ? (
                  <span className="px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    {locale === 'fr' ? `DÉSÉQUILIBRE I2/I1: ${phasorAnalysis.unbalanceI2_pct.toFixed(0)}% (ANSI 46)` : `I2/I1 UNBALANCE: ${phasorAnalysis.unbalanceI2_pct.toFixed(0)}% (ANSI 46)`}
                  </span>
                ) : fftAnalysis.isH2RestraintActive ? (
                  <span className="px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                    {locale === 'fr' ? 'RETENUE 87T ACTIVE' : '87T RESTRAINED'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Zapp = {rxAnalysis.currentPoint.zMag.toFixed(1)}Ω | cos φ: {phasorAnalysis.powerFactor.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Timeline Slider with Milestones */}
            <div className="space-y-1">
              <input
                type="range"
                min={effectiveTMin}
                max={effectiveTMax}
                step={0.5}
                value={currentTimeMs}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentTimeMs(parseFloat(e.target.value));
                }}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
                <span>{effectiveTMin} ms ({locale === 'fr' ? 'Pré-défaut' : 'Pre-fault'})</span>
                <span className="text-rose-400 font-bold">t = 0 ms ({locale === 'fr' ? 'Amorçage' : 'Fault'})</span>
                <span className="text-amber-400 font-bold">t = {recordConfig.pickupTimeMs} ms ({locale === 'fr' ? 'Déclenchement' : 'Trip'})</span>
                <span className="text-emerald-400 font-bold">{recordConfig.clearingTimeMs < 500 ? `t = ${recordConfig.clearingTimeMs} ms` : 'Sans déclenchement'}</span>
                <span>+{effectiveTMax} ms ({locale === 'fr' ? 'Stabilisation' : 'End'})</span>
              </div>
            </div>
          </div>

          {/* Oscillogram Multi-Channel Viewport (SVG) */}
          {(viewMode === 'DUAL_SPLIT' || viewMode === 'WAVEFORMS') && (
            <div className="p-4 rounded-xl bg-[#070D16] border border-[#1E2D44] space-y-3 overflow-x-auto shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1 border-b border-slate-800/80">
                <div className="flex items-center gap-4">
                  <span className="text-white font-bold uppercase">{locale === 'fr' ? 'VOIES OSCILLOGRAPHIQUES CANAUX ANALOGIQUES & DIGITAUX' : 'OSCILLOGRAPHIC ANALOG & DIGITAL CHANNELS'}</span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-rose-400"><span className="h-2 w-2 rounded-full bg-rose-400" /> Ph A</span>
                    <span className="flex items-center gap-1 text-amber-400"><span className="h-2 w-2 rounded-full bg-amber-400" /> Ph B</span>
                    <span className="flex items-center gap-1 text-sky-400"><span className="h-2 w-2 rounded-full bg-sky-400" /> Ph C</span>
                    <span className="flex items-center gap-1 text-purple-400"><span className="h-2 w-2 rounded-full bg-purple-400" /> 3I0 / V0</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">Échantillonnage 2 kHz (50 Hz)</span>
              </div>

              <div className="w-full relative overflow-hidden" style={{ minWidth: '780px' }}>
                <svg viewBox="0 0 840 360" className="w-full h-auto">
                  {/* Background Grid & Time Divisions (every 20 ms = 1 cycle) */}
                  {timeTicks.map((t) => {
                    const gx = tToX(t);
                    const isZero = t === 0;
                    return (
                      <g key={t}>
                        <line x1={gx} y1="20" x2={gx} y2="340" stroke={isZero ? '#f43f5e' : '#1e293b'} strokeWidth={isZero ? 1.5 : 0.7} strokeDasharray={isZero ? 'none' : '3 3'} />
                        <text x={gx} y="14" fill={isZero ? '#f43f5e' : '#64748b'} fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight={isZero ? 'bold' : 'normal'}>
                          {t >= 0 ? `+${t}ms` : `${t}ms`}
                        </text>
                      </g>
                    );
                  })}

                  {/* Horizontal Baseline 1: Voltages (center Y = 85) */}
                  <line x1="70" y1="85" x2="820" y2="85" stroke="#334155" strokeWidth="1" />
                  <text x="65" y="88" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end" fontWeight="bold">
                    u(t) kV
                  </text>

                  {/* Voltage Waveforms */}
                  <path d={pathVa} fill="none" stroke="#f43f5e" strokeWidth="1.8" />
                  <path d={pathVb} fill="none" stroke="#fbbf24" strokeWidth="1.8" />
                  <path d={pathVc} fill="none" stroke="#38bdf8" strokeWidth="1.8" />

                  {/* Horizontal Baseline 2: Currents (center Y = 205) */}
                  <line x1="70" y1="205" x2="820" y2="205" stroke="#334155" strokeWidth="1" />
                  <text x="65" y="208" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end" fontWeight="bold">
                    i(t) kA
                  </text>

                  {/* Current Waveforms */}
                  <path d={pathIa} fill="none" stroke="#f43f5e" strokeWidth="2.0" />
                  <path d={pathIb} fill="none" stroke="#fbbf24" strokeWidth="1.8" />
                  <path d={pathIc} fill="none" stroke="#38bdf8" strokeWidth="1.8" />
                  <path d={pathIn0} fill="none" stroke="#c084fc" strokeWidth="1.4" strokeDasharray="4 2" />

                  {/* Binary Trace 1: Relay Trip Contact (Y = 285) */}
                  <line x1="70" y1="285" x2="820" y2="285" stroke="#1e293b" strokeWidth="1" />
                  <text x="65" y="282" fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="end">
                    TRIP 86
                  </text>
                  <path d={pathRelayTrip} fill="none" stroke="#f43f5e" strokeWidth="2.2" />

                  {/* Binary Trace 2: Breaker 52a Auxiliary (Y = 325) */}
                  <line x1="70" y1="325" x2="820" y2="325" stroke="#1e293b" strokeWidth="1" />
                  <text x="65" y="322" fill="#e2e8f0" fontSize="9" fontFamily="monospace" textAnchor="end">
                    52a AUX
                  </text>
                  <path d={pathBreaker52a} fill="none" stroke="#34d399" strokeWidth="2.2" />

                  {/* Cursor Line */}
                  <line x1={cursorX} y1="20" x2={cursorX} y2="340" stroke="#22d3ee" strokeWidth="2" strokeDasharray="2 2" />
                  <polygon points={`${cursorX - 5},20 ${cursorX + 5},20 ${cursorX},28`} fill="#22d3ee" />

                  {/* Hover dots at cursor intersection */}
                  <circle cx={cursorX} cy={vToY(currentSample.va, 85, 0.42)} r="4" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
                  <circle cx={cursorX} cy={vToY(currentSample.vb, 85, 0.42)} r="4" fill="#fbbf24" stroke="#fff" strokeWidth="1" />
                  <circle cx={cursorX} cy={vToY(currentSample.vc, 85, 0.42)} r="4" fill="#38bdf8" stroke="#fff" strokeWidth="1" />
                  <circle cx={cursorX} cy={iToY(currentSample.ia, 205, recordConfig.ik_ka > 10 ? 2.5 : 5.0)} r="4.5" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          )}

          {/* Phasor Diagram (Fresnel Polar Radar) & Fortescue Symmetrical Components Panel */}
          {(viewMode === 'DUAL_SPLIT' || viewMode === 'PHASOR_RADAR') && (
            <div className="p-4 rounded-xl bg-[#0A121E] border border-[#1E2E44] space-y-4 shadow-xl">
              {/* Phasor Panel Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Compass className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    {locale === 'fr'
                      ? 'DIAGRAMME PHASORIEL (FRESNEL) & COMPOSANTES SYMÉTRIQUES FORTESCUE'
                      : 'FRESNEL PHASOR RADAR & FORTESCUE SYMMETRICAL COMPONENTS'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {locale === 'fr' ? 'Plan Polaire (r, θ) - CEI 60255' : 'Polar Plane (r, θ) - IEC 60255'}
                  </span>
                </div>

                {/* Visibility Controls & Reference Frame */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  {/* Voltages Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowVoltagePhasors(!showVoltagePhasors)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      showVoltagePhasors
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {showVoltagePhasors ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    <span>{locale === 'fr' ? 'Tensions (VA, VB, VC)' : 'Voltages (VA, VB, VC)'}</span>
                  </button>

                  {/* Currents Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowCurrentPhasors(!showCurrentPhasors)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      showCurrentPhasors
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {showCurrentPhasors ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    <span>{locale === 'fr' ? 'Courants (IA, IB, IC)' : 'Currents (IA, IB, IC)'}</span>
                  </button>

                  {/* Symmetrical Components Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowSymmetricalPhasors(!showSymmetricalPhasors)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      showSymmetricalPhasors
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {showSymmetricalPhasors ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    <span>{locale === 'fr' ? 'Fortescue (I1, I2, I0)' : 'Fortescue (I1, I2, I0)'}</span>
                  </button>

                  {/* Reference Mode Switcher */}
                  <button
                    type="button"
                    onClick={() => setPhasorRefMode(phasorRefMode === 'ABSOLUTE' ? 'VA_REF' : 'ABSOLUTE')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-slate-900 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                    title={locale === 'fr' ? 'Changer le repère de phase angulaire' : 'Switch angular phase reference'}
                  >
                    <Sliders className="h-3 w-3 text-cyan-400" />
                    <span>{phasorRefMode === 'VA_REF' ? 'Réf: VA = 0°' : 'Réf: Absolue (DFT)'}</span>
                  </button>
                </div>
              </div>

              {/* Grid: Left = Polar Radar SVG, Right = Symmetrical Decomposition & Impedance Matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Polar Radar SVG (5 cols) */}
                <div className="lg:col-span-5 bg-[#070D16] p-4 rounded-xl border border-slate-800/80 flex flex-col items-center justify-center">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span className="font-bold text-slate-200">
                      {locale === 'fr' ? 'Plan Polaire Tridimensionnel' : 'Complex Polar Grid'}
                    </span>
                    <span className="text-[11px] text-cyan-400">
                      {locale === 'fr' ? 'Sens Trigonométrique (+)' : 'Counter-Clockwise (+)'}
                    </span>
                  </div>

                  <div className="w-full max-w-[360px] aspect-square relative flex items-center justify-center">
                    <svg viewBox="0 0 420 420" className="w-full h-full">
                      {/* Definitions for glow filter */}
                      <defs>
                        <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Radar Center and Radius definitions */}
                      {(() => {
                        const cx = 210;
                        const cy = 210;
                        const R = 160;

                        // Helper to render an individual vector
                        const renderVector = (v: PhasorVector, isBold = false, isDashed = false, offsetLabelY = 0) => {
                          const maxScale = v.isVoltage ? phasorAnalysis.maxVoltageRms : phasorAnalysis.maxCurrentRms;
                          let len = (v.magnitude / Math.max(maxScale, 0.001)) * (0.82 * R);
                          if (len < 6 && v.magnitude > 0.01) len = 6;

                          const rad = (v.angleDeg * Math.PI) / 180;
                          const xTip = cx + len * Math.cos(rad);
                          const yTip = cy - len * Math.sin(rad);

                          // Arrow wings at tip
                          const wingAngle1 = rad + 2.65;
                          const wingAngle2 = rad - 2.65;
                          const wingLen = isBold ? 8 : 6.5;
                          const w1x = xTip + wingLen * Math.cos(wingAngle1);
                          const w1y = yTip - wingLen * Math.sin(wingAngle1);
                          const w2x = xTip + wingLen * Math.cos(wingAngle2);
                          const w2y = yTip - wingLen * Math.sin(wingAngle2);

                          // Text Label location
                          const labelRad = rad;
                          const labelDist = len + 12;
                          const lx = cx + labelDist * Math.cos(labelRad);
                          const ly = cy - labelDist * Math.sin(labelRad) + offsetLabelY;

                          return (
                            <g key={v.name} className="transition-all duration-75">
                              {/* Vector Line */}
                              <line
                                x1={cx}
                                y1={cy}
                                x2={xTip}
                                y2={yTip}
                                stroke={v.color}
                                strokeWidth={isBold ? 2.6 : 1.8}
                                strokeDasharray={isDashed ? '4 2' : 'none'}
                                strokeLinecap="round"
                              />
                              {/* Arrowhead */}
                              <polygon
                                points={`${xTip},${yTip} ${w1x},${w1y} ${w2x},${w2y}`}
                                fill={v.color}
                              />
                              {/* Vector Tip Dot */}
                              <circle cx={xTip} cy={yTip} r={isBold ? 3.5 : 2.5} fill={v.color} stroke="#070D16" strokeWidth={1} />
                              {/* Label */}
                              <text
                                x={lx}
                                y={ly}
                                fill={v.color}
                                fontSize={isBold ? '10' : '9'}
                                fontWeight="bold"
                                fontFamily="monospace"
                                textAnchor="middle"
                                dominantBaseline="central"
                              >
                                {v.name}
                              </text>
                            </g>
                          );
                        };

                        return (
                          <>
                            {/* Outer Radar Boundary */}
                            <circle cx={cx} cy={cy} r={R} fill="#050912" stroke="#1e293b" strokeWidth={1.5} />

                            {/* Concentric Calibration Circles */}
                            {[0.25, 0.5, 0.75, 1.0].map((frac) => (
                              <g key={frac}>
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={R * frac}
                                  fill="none"
                                  stroke={frac === 1.0 ? '#334155' : '#141E30'}
                                  strokeWidth={frac === 1.0 ? 1.2 : 0.8}
                                  strokeDasharray={frac === 1.0 ? 'none' : '2 3'}
                                />
                                <text
                                  x={cx + R * frac - 3}
                                  y={cy - 4}
                                  fill="#475569"
                                  fontSize="7.5"
                                  fontFamily="monospace"
                                  textAnchor="end"
                                >
                                  {Math.round(frac * 100)}%
                                </text>
                              </g>
                            ))}

                            {/* Radial Spokes every 30 degrees */}
                            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                              const rad = (deg * Math.PI) / 180;
                              const x2 = cx + R * Math.cos(rad);
                              const y2 = cy - R * Math.sin(rad);
                              const isMainAxis = deg % 90 === 0;

                              // Text degree label position
                              const labelR = R + 14;
                              const lx = cx + labelR * Math.cos(rad);
                              const ly = cy - labelR * Math.sin(rad) + 3;

                              return (
                                <g key={deg}>
                                  <line
                                    x1={cx}
                                    y1={cy}
                                    x2={x2}
                                    y2={y2}
                                    stroke={isMainAxis ? '#334155' : '#141E30'}
                                    strokeWidth={isMainAxis ? 1.0 : 0.6}
                                    strokeDasharray={isMainAxis ? 'none' : '2 3'}
                                  />
                                  <text
                                    x={lx}
                                    y={ly}
                                    fill={isMainAxis ? '#94a3b8' : '#475569'}
                                    fontSize={isMainAxis ? '8.5' : '7.5'}
                                    fontFamily="monospace"
                                    textAnchor="middle"
                                    fontWeight={isMainAxis ? 'bold' : 'normal'}
                                  >
                                    {deg}°
                                  </text>
                                </g>
                              );
                            })}

                            {/* Center Pivot Point */}
                            <circle cx={cx} cy={cy} r={3} fill="#22d3ee" />

                            {/* Render Voltages VA, VB, VC */}
                            {showVoltagePhasors && (
                              <>
                                {renderVector(phasorAnalysis.va, false, false, -3)}
                                {renderVector(phasorAnalysis.vb, false, false, 0)}
                                {renderVector(phasorAnalysis.vc, false, false, 0)}
                              </>
                            )}

                            {/* Render Currents IA, IB, IC */}
                            {showCurrentPhasors && (
                              <>
                                {renderVector(phasorAnalysis.ia, true, false, 0)}
                                {renderVector(phasorAnalysis.ib, true, false, 0)}
                                {renderVector(phasorAnalysis.ic, true, false, 0)}
                              </>
                            )}

                            {/* Render Fortescue Symmetrical Sequences (I1, I2, I0) */}
                            {showSymmetricalPhasors && (
                              <>
                                {renderVector(phasorAnalysis.i1_direct, false, true, 3)}
                                {renderVector(phasorAnalysis.i2_inverse, false, true, 3)}
                                {renderVector(phasorAnalysis.i0_homopolar, false, true, 3)}
                              </>
                            )}
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Legend below polar radar */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-rose-400">
                      <span className="w-2.5 h-0.5 bg-rose-400" /> Ph A
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <span className="w-2.5 h-0.5 bg-amber-400" /> Ph B
                    </span>
                    <span className="flex items-center gap-1 text-sky-400">
                      <span className="w-2.5 h-0.5 bg-sky-400" /> Ph C
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400">
                      <span className="w-2.5 h-0.5 bg-cyan-400 border-t border-dashed" /> I1 Direct
                    </span>
                    <span className="flex items-center gap-1 text-orange-400">
                      <span className="w-2.5 h-0.5 bg-orange-400 border-t border-dashed" /> I2 Inverse
                    </span>
                    <span className="flex items-center gap-1 text-purple-400">
                      <span className="w-2.5 h-0.5 bg-purple-400 border-t border-dashed" /> I0 Homopolaire
                    </span>
                  </div>
                </div>

                {/* Right: Numerical Table, Symmetrical Components & Protection Metrics (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-3">
                  {/* Table of Instantaneous Fundamental Phasors */}
                  <div className="bg-[#070D16] p-3 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300 pb-2 border-b border-slate-800/80 mb-2">
                      <span className="font-bold flex items-center gap-1.5 text-white">
                        <Gauge className="h-3.5 w-3.5 text-cyan-400" />
                        {locale === 'fr' ? 'Phasors Fondamentaux (50 Hz)' : 'Fundamental Phasors (50 Hz)'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        t = {currentTimeMs.toFixed(1)} ms
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-mono">
                        <thead>
                          <tr className="text-[10px] text-slate-400 border-b border-slate-800/60 text-left">
                            <th className="pb-1">{locale === 'fr' ? 'Signal' : 'Signal'}</th>
                            <th className="pb-1">{locale === 'fr' ? 'Module RMS' : 'RMS Mag'}</th>
                            <th className="pb-1">{locale === 'fr' ? 'Angle θ' : 'Angle θ'}</th>
                            <th className="pb-1">{locale === 'fr' ? 'Forme Cartésienne (Re + j·Im)' : 'Rectangular (Re + j·Im)'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          {[
                            phasorAnalysis.va,
                            phasorAnalysis.vb,
                            phasorAnalysis.vc,
                            phasorAnalysis.ia,
                            phasorAnalysis.ib,
                            phasorAnalysis.ic,
                          ].map((p) => (
                            <tr key={p.name} className="hover:bg-slate-800/30">
                              <td className="py-1 font-bold flex items-center gap-1.5" style={{ color: p.color }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                                {p.name}
                              </td>
                              <td className="py-1 text-slate-200 font-bold">
                                {p.magnitude.toFixed(2)} {p.unit}
                              </td>
                              <td className="py-1 text-slate-300">
                                {p.angleDeg.toFixed(1)}°
                              </td>
                              <td className="py-1 text-slate-400 text-[11px]">
                                {p.re >= 0 ? '+' : ''}{p.re.toFixed(1)} {p.im >= 0 ? '+ j' : '- j'}{Math.abs(p.im).toFixed(1)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Fortescue Symmetrical Components Card */}
                  <div className="bg-[#070D16] p-3 rounded-xl border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300 pb-1.5 border-b border-slate-800/80">
                      <span className="font-bold flex items-center gap-1.5 text-purple-300">
                        <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                        {locale === 'fr' ? 'Composantes Symétriques (CEI 60034 / ANSI 46)' : 'Fortescue Symmetrical Components (ANSI 46)'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {locale === 'fr' ? 'Décomposition en séquences' : 'Sequence decomposition'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                      {/* Positive sequence I1 */}
                      <div className="p-2 rounded bg-slate-900/80 border border-cyan-500/30">
                        <div className="text-[10px] text-cyan-400 font-bold">{locale === 'fr' ? 'Direct (I1)' : 'Positive (I1)'}</div>
                        <div className="text-sm font-bold text-white mt-0.5">
                          {phasorAnalysis.i1_direct.magnitude.toFixed(2)} kA
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ∠ {phasorAnalysis.i1_direct.angleDeg.toFixed(1)}°
                        </div>
                      </div>

                      {/* Negative sequence I2 */}
                      <div className={`p-2 rounded border ${
                        phasorAnalysis.unbalanceI2_pct > 15
                          ? 'bg-rose-950/40 border-rose-500/50'
                          : 'bg-slate-900/80 border-orange-500/30'
                      }`}>
                        <div className="text-[10px] text-orange-400 font-bold">{locale === 'fr' ? 'Inverse (I2)' : 'Negative (I2)'}</div>
                        <div className="text-sm font-bold text-white mt-0.5">
                          {phasorAnalysis.i2_inverse.magnitude.toFixed(2)} kA
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ∠ {phasorAnalysis.i2_inverse.angleDeg.toFixed(1)}°
                        </div>
                      </div>

                      {/* Zero sequence I0 */}
                      <div className={`p-2 rounded border ${
                        phasorAnalysis.unbalanceI0_pct > 15
                          ? 'bg-purple-950/40 border-purple-500/50'
                          : 'bg-slate-900/80 border-purple-500/30'
                      }`}>
                        <div className="text-[10px] text-purple-400 font-bold">{locale === 'fr' ? 'Homopolaire (I0)' : 'Zero Seq (I0)'}</div>
                        <div className="text-sm font-bold text-white mt-0.5">
                          {phasorAnalysis.i0_homopolar.magnitude.toFixed(2)} kA
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ∠ {phasorAnalysis.i0_homopolar.angleDeg.toFixed(1)}°
                        </div>
                      </div>
                    </div>

                    {/* Unbalance Ratios & Protection Diagnostic Indicators */}
                    <div className="space-y-2 pt-1 border-t border-slate-800/60 text-xs font-mono">
                      {/* I2 / I1 Negative Sequence Unbalance */}
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <span className="text-slate-300">
                            {locale === 'fr' ? 'Taux de Déséquilibre Inverse (I2 / I1) :' : 'Negative Sequence Unbalance (I2 / I1):'}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            phasorAnalysis.unbalanceI2_pct > 20
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                              : phasorAnalysis.unbalanceI2_pct > 5
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {phasorAnalysis.unbalanceI2_pct.toFixed(1)}% {phasorAnalysis.unbalanceI2_pct > 15 ? '(ANSI 46 SEUIL FRANCHI)' : ''}
                          </span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-150 ${
                              phasorAnalysis.unbalanceI2_pct > 20
                                ? 'bg-rose-500'
                                : phasorAnalysis.unbalanceI2_pct > 5
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, phasorAnalysis.unbalanceI2_pct)}%` }}
                          />
                        </div>
                      </div>

                      {/* I0 / I1 Ground Dissymmetry */}
                      <div>
                        <div className="flex justify-between items-center text-[11px] mb-1">
                          <span className="text-slate-300">
                            {locale === 'fr' ? 'Rapport Homopolaire (I0 / I1 - Défaut Terre) :' : 'Zero Sequence Ratio (I0 / I1 - Earth Fault):'}
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            phasorAnalysis.unbalanceI0_pct > 15
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {phasorAnalysis.unbalanceI0_pct.toFixed(1)}% {phasorAnalysis.unbalanceI0_pct > 15 ? '(ANSI 50N/51N)' : ''}
                          </span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-purple-500 transition-all duration-150"
                            style={{ width: `${Math.min(100, phasorAnalysis.unbalanceI0_pct)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apparent Loop Impedance & Distance Protection (ANSI 21) */}
                  <div className="bg-[#070D16] p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">{locale === 'fr' ? 'Impédance Zapp' : 'Apparent Z'}</span>
                        <span className={`text-base font-bold ${
                          phasorAnalysis.impedanceMag_ohm < 10
                            ? 'text-rose-400'
                            : 'text-cyan-400'
                        }`}>
                          {phasorAnalysis.impedanceMag_ohm > 990 ? '∞' : `${phasorAnalysis.impedanceMag_ohm.toFixed(2)} Ω`}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">{locale === 'fr' ? 'Déphasage φ (V-I)' : 'Angle φ (V-I)'}</span>
                        <span className="text-base font-bold text-slate-200">
                          {phasorAnalysis.impedanceAngle_deg.toFixed(1)}°
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">{locale === 'fr' ? 'Facteur cos φ' : 'Power Factor'}</span>
                        <span className="text-base font-bold text-amber-300">
                          {phasorAnalysis.powerFactor.toFixed(2)} {phasorAnalysis.powerFactor >= 0 ? '(IND)' : '(CAP)'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 max-w-[240px]">
                      {phasorAnalysis.impedanceMag_ohm < 10 ? (
                        <span className="text-rose-400 font-bold">
                          {locale === 'fr'
                            ? 'DÉTECTION ZONE 1 (ANSI 21) : Effondrement de l\'impédance de boucle sous le seuil de ligne.'
                            : 'ZONE 1 PICKUP (ANSI 21): Apparent impedance collapsed below line protection boundary.'}
                        </span>
                      ) : (
                        <span>
                          {locale === 'fr'
                            ? 'Impédance de charge normale hors des cercles de déclenchement mho.'
                            : 'Normal operating load impedance outside mho tripping characteristics.'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Distance Protection R-X Complex Impedance Plane (ANSI 21 / IEC 60255-121) */}
          {(viewMode === 'DUAL_SPLIT' || viewMode === 'RX_IMPEDANCE') && (
            <div className="p-4 rounded-xl bg-[#0A121E] border border-[#1E2E44] space-y-4 shadow-xl">
              {/* R-X Panel Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Crosshair className="h-4 w-4 text-rose-400" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    {locale === 'fr'
                      ? 'PROTECTION DE DISTANCE ANSI 21 : PLAN D\'IMPÉDANCE COMPLEXE (R-X) & TRAJECTOIRE DE DÉFAUT'
                      : 'ANSI 21 DISTANCE RELAY: COMPLEX IMPEDANCE PLANE (R-X) & FAULT TRAJECTORY LOCUS'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {locale === 'fr' ? 'Ligne 225 kV (50 km)' : '225 kV Line (50 km)'}
                  </span>
                </div>

                {/* Characteristic Controls */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  {/* Characteristic Shape Switcher */}
                  <div className="flex items-center gap-1 p-0.5 rounded bg-slate-900 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setRxShape('MHO')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                        rxShape === 'MHO'
                          ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {locale === 'fr' ? 'Cercles Mho' : 'Mho Circles'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRxShape('QUADRILATERAL')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                        rxShape === 'QUADRILATERAL'
                          ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {locale === 'fr' ? 'Quadrilatère' : 'Quadrilateral'}
                    </button>
                  </div>

                  {/* Trajectory Trail Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowRxTrajectory(!showRxTrajectory)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                      showRxTrajectory
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {showRxTrajectory ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    <span>{locale === 'fr' ? 'Locus Z(t)' : 'Z(t) Locus'}</span>
                  </button>

                  {/* Load Blinder Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowLoadBlinder(!showLoadBlinder)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                      showLoadBlinder
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span>{locale === 'fr' ? 'Blinder Charge' : 'Load Blinder'}</span>
                  </button>
                </div>
              </div>

              {/* R-X Interactive Stage & Diagnostics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: SVG Complex Impedance Plane R-X (7 cols) */}
                <div className="lg:col-span-7 bg-[#070D16] p-3 rounded-xl border border-slate-800/80 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-slate-300 pb-2 border-b border-slate-800/80 mb-2">
                    <span className="font-bold flex items-center gap-1.5 text-white">
                      <Target className="h-3.5 w-3.5 text-rose-400" />
                      {locale === 'fr' ? 'Plan Complexe (Résistance R - Réactance X)' : 'Complex Plane (Resistance R - Reactance X)'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      X (Reactance Ω) ↑ vs R (Resistance Ω) →
                    </span>
                  </div>

                  {/* SVG R-X Canvas */}
                  <div className="w-full flex justify-center overflow-x-auto">
                    <svg viewBox="0 0 560 460" className="w-full max-w-[560px] h-auto select-none bg-[#040810] rounded-lg border border-slate-900">
                      <defs>
                        {/* Glow filter for fault locus */}
                        <filter id="rx-locus-glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        {/* Target cursor glow */}
                        <filter id="rx-target-glow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        {/* Zone 1 Pattern */}
                        <pattern id="zone1-stripes" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                          <line x1="0" y1="0" x2="0" y2="8" stroke="#f43f5e" strokeWidth="0.8" opacity="0.15" />
                        </pattern>
                      </defs>

                      {(() => {
                        const svgW = 560;
                        const svgH = 460;
                        const padL = 55;
                        const padR = 25;
                        const padT = 30;
                        const padB = 45;
                        const plotW = svgW - padL - padR; // 480
                        const plotH = svgH - padT - padB; // 385

                        const rMin = -10;
                        const rMax = 35;
                        const xMin = -10;
                        const xMax = 28;
                        const deltaR = rMax - rMin; // 45
                        const deltaX = xMax - xMin; // 38

                        const toSvgX = (r: number) => padL + ((r - rMin) / deltaR) * plotW;
                        const toSvgY = (x: number) => padT + ((xMax - x) / deltaX) * plotH;

                        const originX = toSvgX(0);
                        const originY = toSvgY(0);

                        // Line parameters
                        const lineAngleRad = (rxAnalysis.lineAngleDeg * Math.PI) / 180;
                        const zL_r = rxAnalysis.lineImpedanceOhm * Math.cos(lineAngleRad);
                        const zL_x = rxAnalysis.lineImpedanceOhm * Math.sin(lineAngleRad);

                        // Zone 1 Reach
                        const z1_r = rxAnalysis.z1ReachOhm * Math.cos(lineAngleRad);
                        const z1_x = rxAnalysis.z1ReachOhm * Math.sin(lineAngleRad);

                        // Zone 2 Reach
                        const z2_r = rxAnalysis.z2ReachOhm * Math.cos(lineAngleRad);
                        const z2_x = rxAnalysis.z2ReachOhm * Math.sin(lineAngleRad);

                        // Reverse Zone 4 Reach (-20% ZL)
                        const z4_r = -0.2 * zL_r;
                        const z4_x = -0.2 * zL_x;

                        // Grid tick marks
                        const rTicks = [-10, -5, 0, 5, 10, 15, 20, 25, 30, 35];
                        const xTicks = [-10, -5, 0, 5, 10, 15, 20, 25];

                        // Trajectory locus path
                        const locusPoints = rxAnalysis.trajectory.map(p => ({
                          x: toSvgX(p.r),
                          y: toSvgY(p.x),
                          tMs: p.tMs,
                          r: p.r,
                          xVal: p.x
                        }));
                        const locusPathD = locusPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

                        // Instantaneous cursor coordinates
                        const curX = toSvgX(rxAnalysis.currentPoint.r);
                        const curY = toSvgY(rxAnalysis.currentPoint.x);

                        return (
                          <>
                            {/* Background Grid Lines */}
                            {rTicks.map((rVal) => {
                              const sx = toSvgX(rVal);
                              const isZero = rVal === 0;
                              return (
                                <g key={`grid-r-${rVal}`}>
                                  <line
                                    x1={sx}
                                    y1={padT}
                                    x2={sx}
                                    y2={svgH - padB}
                                    stroke={isZero ? '#475569' : '#141E30'}
                                    strokeWidth={isZero ? 1.4 : 0.6}
                                    strokeDasharray={isZero ? 'none' : '2 3'}
                                  />
                                  <text
                                    x={sx}
                                    y={svgH - padB + 14}
                                    fill={isZero ? '#94a3b8' : '#475569'}
                                    fontSize="8.5"
                                    fontFamily="monospace"
                                    textAnchor="middle"
                                  >
                                    {rVal}
                                  </text>
                                </g>
                              );
                            })}

                            {xTicks.map((xVal) => {
                              const sy = toSvgY(xVal);
                              const isZero = xVal === 0;
                              return (
                                <g key={`grid-x-${xVal}`}>
                                  <line
                                    x1={padL}
                                    y1={sy}
                                    x2={svgW - padR}
                                    y2={sy}
                                    stroke={isZero ? '#475569' : '#141E30'}
                                    strokeWidth={isZero ? 1.4 : 0.6}
                                    strokeDasharray={isZero ? 'none' : '2 3'}
                                  />
                                  <text
                                    x={padL - 8}
                                    y={sy + 3}
                                    fill={isZero ? '#94a3b8' : '#475569'}
                                    fontSize="8.5"
                                    fontFamily="monospace"
                                    textAnchor="end"
                                  >
                                    {xVal}
                                  </text>
                                </g>
                              );
                            })}

                            {/* Axis Labels */}
                            <text
                              x={svgW - padR}
                              y={originY - 8}
                              fill="#94a3b8"
                              fontSize="10"
                              fontFamily="monospace"
                              fontWeight="bold"
                              textAnchor="end"
                            >
                              +R (Ω)
                            </text>
                            <text
                              x={originX + 8}
                              y={padT + 12}
                              fill="#94a3b8"
                              fontSize="10"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              +jX (Ω)
                            </text>

                            {/* Load Encroachment Blinder Area */}
                            {showLoadBlinder && (
                              <g id="load-blinder-group">
                                <polygon
                                  points={`
                                    ${toSvgX(18)},${toSvgY(-4)}
                                    ${toSvgX(34)},${toSvgY(-4)}
                                    ${toSvgX(34)},${toSvgY(18)}
                                    ${toSvgX(18)},${toSvgY(14)}
                                  `}
                                  fill="rgba(168, 85, 247, 0.08)"
                                  stroke="#a855f7"
                                  strokeWidth="1.2"
                                  strokeDasharray="4 3"
                                />
                                <text
                                  x={toSvgX(24)}
                                  y={toSvgY(6)}
                                  fill="#c084fc"
                                  fontSize="8"
                                  fontFamily="monospace"
                                  textAnchor="middle"
                                >
                                  {locale === 'fr' ? 'ZONE DE CHARGE (BLINDER)' : 'LOAD ENCROACHMENT'}
                                </text>
                              </g>
                            )}

                            {/* Mho Characteristics */}
                            {rxShape === 'MHO' && (
                              <g id="mho-zones-group">
                                {/* Zone 2 Mho Circle */}
                                {(() => {
                                  const radOhm = rxAnalysis.z2ReachOhm / 2;
                                  const cxOhm = z2_r / 2;
                                  const cyOhm = z2_x / 2;
                                  const cx = toSvgX(cxOhm);
                                  const cy = toSvgY(cyOhm);
                                  const rx = (radOhm / deltaR) * plotW;
                                  const ry = (radOhm / deltaX) * plotH;
                                  return (
                                    <g>
                                      <ellipse
                                        cx={cx}
                                        cy={cy}
                                        rx={rx}
                                        ry={ry}
                                        fill="rgba(245, 158, 11, 0.06)"
                                        stroke="#f59e0b"
                                        strokeWidth="1.5"
                                        strokeDasharray="4 3"
                                      />
                                      <text
                                        x={toSvgX(z2_r) + 8}
                                        y={toSvgY(z2_x) - 4}
                                        fill="#f59e0b"
                                        fontSize="9"
                                        fontFamily="monospace"
                                        fontWeight="bold"
                                      >
                                        Zone 2 (120% ZL / 300ms)
                                      </text>
                                    </g>
                                  );
                                })()}

                                {/* Zone 1 Mho Circle */}
                                {(() => {
                                  const radOhm = rxAnalysis.z1ReachOhm / 2;
                                  const cxOhm = z1_r / 2;
                                  const cyOhm = z1_x / 2;
                                  const cx = toSvgX(cxOhm);
                                  const cy = toSvgY(cyOhm);
                                  const rx = (radOhm / deltaR) * plotW;
                                  const ry = (radOhm / deltaX) * plotH;
                                  return (
                                    <g>
                                      <ellipse
                                        cx={cx}
                                        cy={cy}
                                        rx={rx}
                                        ry={ry}
                                        fill="rgba(244, 63, 94, 0.14)"
                                        stroke="#f43f5e"
                                        strokeWidth="1.8"
                                      />
                                      <text
                                        x={toSvgX(z1_r) - 6}
                                        y={toSvgY(z1_x) - 6}
                                        fill="#f43f5e"
                                        fontSize="9.5"
                                        fontFamily="monospace"
                                        fontWeight="bold"
                                      >
                                        Zone 1 (80% ZL / 0ms)
                                      </text>
                                    </g>
                                  );
                                })()}

                                {/* Reverse Zone 4 Mho Circle */}
                                {(() => {
                                  const radOhm = (0.2 * rxAnalysis.lineImpedanceOhm) / 2;
                                  const cxOhm = z4_r / 2;
                                  const cyOhm = z4_x / 2;
                                  const cx = toSvgX(cxOhm);
                                  const cy = toSvgY(cyOhm);
                                  const rx = (radOhm / deltaR) * plotW;
                                  const ry = (radOhm / deltaX) * plotH;
                                  return (
                                    <g>
                                      <ellipse
                                        cx={cx}
                                        cy={cy}
                                        rx={rx}
                                        ry={ry}
                                        fill="rgba(168, 85, 247, 0.08)"
                                        stroke="#a855f7"
                                        strokeWidth="1.2"
                                        strokeDasharray="3 2"
                                      />
                                      <text
                                        x={cx - rx - 4}
                                        y={cy}
                                        fill="#a855f7"
                                        fontSize="8"
                                        fontFamily="monospace"
                                        textAnchor="end"
                                      >
                                        Zone 4 (Rev)
                                      </text>
                                    </g>
                                  );
                                })()}
                              </g>
                            )}

                            {/* Quadrilateral Characteristics */}
                            {rxShape === 'QUADRILATERAL' && (
                              <g id="quad-zones-group">
                                {/* Zone 2 Quadrilateral Polygon */}
                                <polygon
                                  points={`
                                    ${toSvgX(-4)},${toSvgY(0)}
                                    ${toSvgX(22)},${toSvgY(0)}
                                    ${toSvgX(24)},${toSvgY(z2_x)}
                                    ${toSvgX(-1.5)},${toSvgY(z2_x)}
                                  `}
                                  fill="rgba(245, 158, 11, 0.06)"
                                  stroke="#f59e0b"
                                  strokeWidth="1.5"
                                  strokeDasharray="4 3"
                                />
                                <text
                                  x={toSvgX(24) + 6}
                                  y={toSvgY(z2_x)}
                                  fill="#f59e0b"
                                  fontSize="9"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                >
                                  Quad Zone 2 (300ms)
                                </text>

                                {/* Zone 1 Quadrilateral Polygon */}
                                <polygon
                                  points={`
                                    ${toSvgX(-2)},${toSvgY(0)}
                                    ${toSvgX(rxAnalysis.rArcCoverageOhm)},${toSvgY(0)}
                                    ${toSvgX(rxAnalysis.rArcCoverageOhm + 1.5)},${toSvgY(z1_x)}
                                    ${toSvgX(-0.5)},${toSvgY(z1_x)}
                                  `}
                                  fill="rgba(244, 63, 94, 0.14)"
                                  stroke="#f43f5e"
                                  strokeWidth="1.8"
                                />
                                <text
                                  x={toSvgX(rxAnalysis.rArcCoverageOhm + 1.5) + 6}
                                  y={toSvgY(z1_x)}
                                  fill="#f43f5e"
                                  fontSize="9.5"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                >
                                  Quad Zone 1 (0ms)
                                </text>
                              </g>
                            )}

                            {/* Protected Line Impedance Vector ZL */}
                            <line
                              x1={originX}
                              y1={originY}
                              x2={toSvgX(zL_r)}
                              y2={toSvgY(zL_x)}
                              stroke="#eab308"
                              strokeWidth="2.2"
                              strokeDasharray="5 3"
                            />
                            {/* 80% mark on line */}
                            <circle
                              cx={toSvgX(z1_r)}
                              cy={toSvgY(z1_x)}
                              r={3.5}
                              fill="#f43f5e"
                              stroke="#fff"
                              strokeWidth="1"
                            />
                            {/* 100% mark on line */}
                            <circle
                              cx={toSvgX(zL_r)}
                              cy={toSvgY(zL_x)}
                              r={4}
                              fill="#eab308"
                              stroke="#fff"
                              strokeWidth="1"
                            />
                            <text
                              x={toSvgX(zL_r) + 8}
                              y={toSvgY(zL_x) + 4}
                              fill="#eab308"
                              fontSize="9"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              ZL (100% = {rxAnalysis.lineImpedanceOhm}Ω ∠{rxAnalysis.lineAngleDeg}°)
                            </text>

                            {/* Historical Impedance Trajectory Trail */}
                            {showRxTrajectory && (
                              <g id="rx-trajectory-trail">
                                <path
                                  d={locusPathD}
                                  fill="none"
                                  stroke="#06b6d4"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  filter="url(#rx-locus-glow)"
                                  opacity="0.85"
                                />
                                {/* Intermediate sample dots */}
                                {locusPoints.filter((_, idx) => idx % 4 === 0).map((pt, i) => (
                                  <circle
                                    key={`trail-pt-${i}`}
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={1.8}
                                    fill="#22d3ee"
                                    opacity="0.6"
                                  />
                                ))}
                              </g>
                            )}

                            {/* Instantaneous Impedance Cursor / Reticle */}
                            <g id="rx-current-point-reticle" filter="url(#rx-target-glow)">
                              {/* Pulsing outer ring */}
                              <circle
                                cx={curX}
                                cy={curY}
                                r={10}
                                fill="none"
                                stroke={rxAnalysis.detectedZone === 'ZONE_1' ? '#f43f5e' : '#06b6d4'}
                                strokeWidth="1.6"
                                className="animate-ping"
                                opacity="0.7"
                              />
                              {/* Outer targeting circle */}
                              <circle
                                cx={curX}
                                cy={curY}
                                r={7}
                                fill="none"
                                stroke={rxAnalysis.detectedZone === 'ZONE_1' ? '#f43f5e' : '#06b6d4'}
                                strokeWidth="1.8"
                              />
                              {/* Crosshairs */}
                              <line
                                x1={curX - 12}
                                y1={curY}
                                x2={curX + 12}
                                y2={curY}
                                stroke={rxAnalysis.detectedZone === 'ZONE_1' ? '#f43f5e' : '#06b6d4'}
                                strokeWidth="1.2"
                              />
                              <line
                                x1={curX}
                                y1={curY - 12}
                                x2={curX}
                                y2={curY + 12}
                                stroke={rxAnalysis.detectedZone === 'ZONE_1' ? '#f43f5e' : '#06b6d4'}
                                strokeWidth="1.2"
                              />
                              {/* Core dot */}
                              <circle
                                cx={curX}
                                cy={curY}
                                r={3}
                                fill={rxAnalysis.detectedZone === 'ZONE_1' ? '#f43f5e' : '#22d3ee'}
                              />
                            </g>

                            {/* Tooltip callout near cursor */}
                            <g transform={`translate(${Math.min(curX + 12, svgW - 145)}, ${Math.max(curY - 35, padT + 25)})`}>
                              <rect
                                x="-4"
                                y="-12"
                                width="140"
                                height="42"
                                rx="4"
                                fill="rgba(7, 13, 22, 0.92)"
                                stroke={rxAnalysis.detectedZone === 'ZONE_1' ? '#f43f5e' : '#0ea5e9'}
                                strokeWidth="1"
                              />
                              <text x="3" y="1" fill="#fff" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                                Z = {rxAnalysis.currentPoint.r.toFixed(1)} + j{rxAnalysis.currentPoint.x.toFixed(1)} Ω
                              </text>
                              <text x="3" y="13" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                                |Z| = {rxAnalysis.currentPoint.zMag.toFixed(1)} Ω (∠{rxAnalysis.currentPoint.angleDeg.toFixed(0)}°)
                              </text>
                              <text
                                x="3"
                                y="24"
                                fill={rxAnalysis.detectedZone === 'ZONE_1' ? '#f43f5e' : '#38bdf8'}
                                fontSize="7.5"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                {rxAnalysis.detectedZone === 'ZONE_1'
                                  ? '• PICKUP ZONE 1 (0 ms)'
                                  : rxAnalysis.detectedZone === 'ZONE_2'
                                  ? '• PICKUP ZONE 2 (300 ms)'
                                  : '• REGIME DE CHARGE'}
                              </text>
                            </g>
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Legend below R-X canvas */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-rose-400">
                      <span className="w-2.5 h-1.5 bg-rose-500/30 border border-rose-500 rounded-xs" /> Zone 1 (80% Line)
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <span className="w-2.5 h-1.5 bg-amber-500/20 border border-amber-500 border-dashed rounded-xs" /> Zone 2 (120% Line)
                    </span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <span className="w-3 h-0.5 bg-yellow-400 border-t border-dashed" /> ZLigne (100%)
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400">
                      <span className="w-2.5 h-0.5 bg-cyan-400" /> Locus Z(t)
                    </span>
                    <span className="flex items-center gap-1 text-purple-400">
                      <span className="w-2.5 h-1.5 bg-purple-500/20 border border-purple-500 border-dashed rounded-xs" /> Blinder Charge
                    </span>
                  </div>
                </div>

                {/* Right: Real-time Protection Diagnostics & Settings (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  {/* Master Relay State Card */}
                  <div className={`p-3.5 rounded-xl border font-mono transition-all ${
                    rxAnalysis.detectedZone === 'ZONE_1'
                      ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/50'
                      : rxAnalysis.detectedZone === 'ZONE_2'
                      ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-950/40'
                      : rxAnalysis.detectedZone === 'REVERSE_ZONE'
                      ? 'bg-purple-950/30 border-purple-500/50'
                      : 'bg-[#070D16] border-slate-800/80'
                  }`}>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <ShieldAlert className={`h-4 w-4 ${
                          rxAnalysis.detectedZone === 'ZONE_1'
                            ? 'text-rose-400 animate-pulse'
                            : rxAnalysis.detectedZone === 'ZONE_2'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`} />
                        {locale === 'fr' ? 'ÉTAT DU RELAIS DE DISTANCE ANSI 21' : 'ANSI 21 DISTANCE RELAY STATE'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        t = {currentTimeMs.toFixed(1)} ms
                      </span>
                    </div>

                    {rxAnalysis.detectedZone === 'ZONE_1' ? (
                      <div className="space-y-2">
                        <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-200">
                          <div className="font-bold text-xs flex items-center gap-1.5">
                            <Zap className="h-4 w-4 text-rose-400 fill-rose-400" />
                            {locale === 'fr' ? 'DÉCLENCHEMENT INSTANTANÉ ZONE 1 (0 ms)' : 'ZONE 1 INSTANTANEOUS TRIP (0 ms)'}
                          </div>
                          <p className="text-[11px] text-rose-300/90 mt-1 leading-relaxed">
                            {locale === 'fr'
                              ? `L'impédance de boucle Z = ${rxAnalysis.currentPoint.zMag.toFixed(1)} Ω est entrée dans la caractéristique Zone 1 (< ${rxAnalysis.z1ReachOhm.toFixed(1)} Ω). Ordre d'ouverture disjoncteur (ANSI 86) émis.`
                              : `Loop impedance Z = ${rxAnalysis.currentPoint.zMag.toFixed(1)} Ω entered Zone 1 boundary (< ${rxAnalysis.z1ReachOhm.toFixed(1)} Ω). Master trip command issued.`}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-slate-400">{locale === 'fr' ? 'Localisation estimée du défaut :' : 'Estimated fault location:'}</span>
                          <span className="font-bold text-rose-300">
                            ~{rxAnalysis.faultDistancePct.toFixed(0)}% ({((rxAnalysis.faultDistancePct / 100) * 50).toFixed(1)} km)
                          </span>
                        </div>
                      </div>
                    ) : rxAnalysis.detectedZone === 'ZONE_2' ? (
                      <div className="space-y-2">
                        <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200">
                          <div className="font-bold text-xs flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-amber-400" />
                            {locale === 'fr' ? 'DÉMARRAGE TEMPORISÉ ZONE 2 (300 ms)' : 'ZONE 2 TIME-DELAYED PICKUP (300 ms)'}
                          </div>
                          <p className="text-[11px] text-amber-300/90 mt-1 leading-relaxed">
                            {locale === 'fr'
                              ? `Défaut détecté en Zone 2 d'overreach (120% ZL). Temporisation de secours en cours pour coordination sélective avec le poste aval.`
                              : `Fault detected in Zone 2 overreach (120% ZL). Backup timer running for selective coordination with downstream substation.`}
                          </p>
                        </div>
                      </div>
                    ) : rxAnalysis.detectedZone === 'REVERSE_ZONE' ? (
                      <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-200">
                        <div className="font-bold text-xs">{locale === 'fr' ? 'DÉFAUT AMONT / INVERSE (BLOCAGE)' : 'REVERSE FAULT (DIRECTIONAL BLOCK)'}</div>
                        <p className="text-[11px] text-purple-300/90 mt-1">
                          {locale === 'fr'
                            ? 'Défaut situé en arrière du jeu de barres. Déclenchement ligne bloqué par l\'élément directionnel.'
                            : 'Fault located behind busbar. Line tripping blocked by directional element.'}
                        </p>
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          {locale === 'fr' ? 'FONCTIONNEMENT NORMAL (RÉGIME DE CHARGE)' : 'NORMAL LOAD CONDITION'}
                        </div>
                        <p className="text-[11px] text-emerald-400/80 mt-1">
                          {locale === 'fr'
                            ? `L'impédance apparente Z = ${rxAnalysis.currentPoint.zMag.toFixed(1)} Ω se situe en dehors de toutes les zones de déclenchement.`
                            : `Apparent impedance Z = ${rxAnalysis.currentPoint.zMag.toFixed(1)} Ω is safely outside all tripping boundaries.`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Instantaneous Impedance Readout Cards */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-[#070D16] border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{locale === 'fr' ? 'Résistance Apparente R' : 'Apparent Resistance R'}</span>
                      <span className="text-sm font-bold text-white">
                        {rxAnalysis.currentPoint.r.toFixed(2)} Ω
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#070D16] border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{locale === 'fr' ? 'Réactance Apparente X' : 'Apparent Reactance X'}</span>
                      <span className="text-sm font-bold text-cyan-300">
                        {rxAnalysis.currentPoint.x.toFixed(2)} Ω
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#070D16] border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{locale === 'fr' ? 'Module |Zapp|' : 'Impedance Magnitude |Z|'}</span>
                      <span className="text-sm font-bold text-amber-300">
                        {rxAnalysis.currentPoint.zMag.toFixed(2)} Ω
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#070D16] border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{locale === 'fr' ? 'Angle d\'Impédance θ' : 'Impedance Angle θ'}</span>
                      <span className="text-sm font-bold text-purple-300">
                        {rxAnalysis.currentPoint.angleDeg.toFixed(1)}°
                      </span>
                    </div>
                  </div>

                  {/* Protection Relay Settings Reference Card */}
                  <div className="p-3 rounded-xl bg-[#070D16] border border-slate-800/80 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                        {locale === 'fr' ? 'Réglages Relais (Plan de Protection)' : 'Relay Settings (Protection Scheme)'}
                      </span>
                      <span className="text-[10px] text-slate-400">CEI 60255-121</span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{locale === 'fr' ? 'Impédance totale ligne ZL :' : 'Total line impedance ZL:'}</span>
                        <span className="font-bold text-yellow-300">{rxAnalysis.lineImpedanceOhm.toFixed(1)} Ω ∠{rxAnalysis.lineAngleDeg}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{locale === 'fr' ? 'Portée Zone 1 (80% ZL) :' : 'Zone 1 reach (80% ZL):'}</span>
                        <span className="font-bold text-rose-400">{rxAnalysis.z1ReachOhm.toFixed(1)} Ω (t = 0 ms)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{locale === 'fr' ? 'Portée Zone 2 (120% ZL) :' : 'Zone 2 reach (120% ZL):'}</span>
                        <span className="font-bold text-amber-400">{rxAnalysis.z2ReachOhm.toFixed(1)} Ω (t = 300 ms)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{locale === 'fr' ? 'Résistance d\'arc max Rarc :' : 'Max arc resistance Rarc:'}</span>
                        <span className="font-bold text-slate-200">{rxAnalysis.rArcCoverageOhm.toFixed(1)} Ω</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FFT Harmonic Spectrum & 87T Restraint Diagnostic Panel */}
          {(viewMode === 'DUAL_SPLIT' || viewMode === 'FFT_SPECTRUM') && (
            <div className="p-4 rounded-xl bg-[#0A121E] border border-[#1E2E44] space-y-4 shadow-xl">
              {/* FFT Panel Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <BarChart2 className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    {locale === 'fr'
                      ? 'DÉCOMPOSITION HARMONIQUE FFT & RETENUE H2 TRANSFO (CEI 61000-4-7 / IEEE C37.91)'
                      : 'FFT HARMONIC SPECTRUM & TRAFO H2 RESTRAINT (IEC 61000-4-7 / IEEE C37.91)'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {locale === 'fr' ? 'Fenêtre 1 cycle (20 ms)' : '1-Cycle Window (20 ms)'}
                  </span>
                </div>

                {/* Harmonic Channel Selector */}
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-slate-400 text-[11px]">{locale === 'fr' ? 'Voie analysée :' : 'Channel:'}</span>
                  {(['IA', 'IB', 'IC', 'IN0', 'VA'] as HarmonicChannelType[]).map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setFftChannel(ch)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        fftChannel === ch
                          ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50 shadow-xs'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {ch === 'IN0' ? '3I0' : ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* FFT Grid: Left = SVG Harmonic Bar Chart, Right = Protection & Quality Diagnostics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Interactive Harmonic Bar Chart (7 cols) */}
                <div className="lg:col-span-7 bg-[#070D16] p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span className="font-bold text-slate-200">{fftAnalysis.channelName}</span>
                    <span className="text-[11px] text-slate-400">{locale === 'fr' ? 'Spectre en % du fondamental' : 'Spectrum in % of fundamental'}</span>
                  </div>

                  {/* SVG Bar Chart */}
                  <div className="w-full relative overflow-x-auto">
                    <svg viewBox="0 0 540 210" className="w-full h-auto" style={{ minWidth: '460px' }}>
                      {/* Grid lines at 0%, 20%, 40%, 60%, 80%, 100% */}
                      {[0, 20, 40, 60, 80, 100].map((pct) => {
                        const y = 175 - (pct / 100) * 140;
                        return (
                          <g key={pct}>
                            <line x1="45" y1={y} x2="520" y2={y} stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 2" />
                            <text x="40" y={y + 3} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="end">
                              {pct}%
                            </text>
                          </g>
                        );
                      })}

                      {/* 15% ANSI 87T Threshold Guideline for Inrush Restraint */}
                      <g>
                        <line x1="45" y1={175 - 0.15 * 140} x2="520" y2={175 - 0.15 * 140} stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="4 3" />
                        <text x="515" y={175 - 0.15 * 140 - 4} fill="#f59e0b" fontSize="8.5" fontFamily="monospace" textAnchor="end" fontWeight="bold">
                          {locale === 'fr' ? 'Seuil Retenue H2 (15%) - ANSI 87T' : '87T H2 Restraint Threshold (15%)'}
                        </text>
                      </g>

                      {/* Bars for Harmonics */}
                      {fftAnalysis.harmonics.map((h, idx) => {
                        const x = 60 + idx * 56;
                        const barWidth = 32;
                        const clampedPct = Math.min(105, h.pctOfFund);
                        const barHeight = Math.max(3, (clampedPct / 100) * 140);
                        const y = 175 - barHeight;

                        // Color determination
                        let barFill = '#38bdf8'; // Sky
                        if (h.order === 1) barFill = '#22d3ee'; // Fundamental Cyan
                        else if (h.order === 2) {
                          barFill = h.pctOfFund >= 15 ? '#f59e0b' : '#64748b'; // Inrush Amber or low slate
                        } else if (h.order === 3) barFill = '#c084fc'; // Purple
                        else if (h.order === 5 || h.order === 7) barFill = '#34d399'; // Emerald for power converters
                        else barFill = '#94a3b8';

                        return (
                          <g key={h.order}>
                            {/* Bar */}
                            <rect
                              x={x}
                              y={y}
                              width={barWidth}
                              height={barHeight}
                              fill={barFill}
                              rx="3"
                              className="transition-all duration-150"
                            />
                            
                            {/* Percentage label above bar */}
                            <text
                              x={x + barWidth / 2}
                              y={y - 4}
                              fill={h.order === 2 && h.pctOfFund >= 15 ? '#f59e0b' : '#e2e8f0'}
                              fontSize="9"
                              fontFamily="monospace"
                              textAnchor="middle"
                              fontWeight={h.order === 1 || (h.order === 2 && h.pctOfFund >= 15) ? 'bold' : 'normal'}
                            >
                              {h.order === 1 ? '100%' : `${h.pctOfFund.toFixed(1)}%`}
                            </text>

                            {/* Absolute RMS value inside/above bar */}
                            <text
                              x={x + barWidth / 2}
                              y={175 + 14}
                              fill="#f8fafc"
                              fontSize="9.5"
                              fontFamily="monospace"
                              textAnchor="middle"
                              fontWeight="bold"
                            >
                              {h.label}
                            </text>

                            <text
                              x={x + barWidth / 2}
                              y={175 + 26}
                              fill="#64748b"
                              fontSize="8"
                              fontFamily="monospace"
                              textAnchor="middle"
                            >
                              {h.freqHz}Hz
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-400" /> H1 (50 Hz Fondamental)</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> H2 (100 Hz Retenue 87T)</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> H5/H7 (Onduleurs)</span>
                    </div>
                    <span>Fondamental RMS: {fftAnalysis.fundamentalRms.toFixed(2)} {fftChannel === 'VA' ? 'kV' : 'kA'}</span>
                  </div>
                </div>

                {/* Right: Protection & Quality Diagnostics (5 cols) */}
                <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
                  
                  {/* ANSI 87T Transformer Inrush Restraint Card */}
                  <div className={`p-3.5 rounded-xl border transition-all ${
                    fftAnalysis.isH2RestraintActive
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-xs'
                      : 'bg-[#0D1522] border-[#1E2D40]'
                  }`}>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className={`h-4 w-4 ${fftAnalysis.isH2RestraintActive ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span className="font-mono text-xs font-bold text-white uppercase">
                          {locale === 'fr' ? 'Retenue Harmonique H2 (ANSI 87T)' : 'ANSI 87T Harmonic Restraint'}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        fftAnalysis.isH2RestraintActive
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {fftAnalysis.isH2RestraintActive ? (locale === 'fr' ? 'RETENUE ACTIVE' : 'RESTRAINED') : (locale === 'fr' ? 'SANS RETENUE' : 'NO RESTRAINT')}
                      </span>
                    </div>

                    <div className="mt-2.5 space-y-2 text-xs font-mono">
                      <div className="flex items-baseline justify-between">
                        <span className="text-slate-400">{locale === 'fr' ? 'Rapport I(2h) / I(1h) :' : 'I(2h) / I(1h) Ratio:'}</span>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-lg font-black ${fftAnalysis.h2RatioPct >= 15 ? 'text-amber-400' : 'text-slate-200'}`}>
                            {fftAnalysis.h2RatioPct.toFixed(1)}%
                          </span>
                          <span className="text-[10px] text-slate-400">(Seuil: 15.0%)</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                        {fftAnalysis.isH2RestraintActive
                          ? (locale === 'fr'
                              ? 'Courant d\'enclenchement magnétisant asymétrique avec saturation du noyau. Le blocage 87T inhibe le déclenchement pour prévenir les coupures intempestives (CEI 60255-13).'
                              : 'Asymmetrical magnetizing inrush with core saturation. ANSI 87T blocking inhibits tripping to prevent false tripping (IEC 60255-13).')
                          : (locale === 'fr'
                              ? 'Faible teneur en H2 (< 15%). En cas de surintensité différentielle, l\'ordre d\'ouverture disjoncteur 52 est libéré instantanément (défaut interne avéré).'
                              : 'Low H2 content (< 15%). In case of differential overcurrent, tripping order to breaker 52 is released instantly without delay.')}
                      </p>
                    </div>
                  </div>

                  {/* THD & Power Quality Card */}
                  <div className="p-3.5 rounded-xl bg-[#0D1522] border border-[#1E2D40] space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-cyan-400" />
                        <span className="font-bold text-white uppercase">{locale === 'fr' ? 'Distorsion Harmonique Totale (THD)' : 'Total Harmonic Distortion (THD)'}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">CEI 61000-2-4</span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-slate-400">THD-F :</span>
                      <span className={`text-lg font-black ${
                        fftAnalysis.thdPct > 25 ? 'text-rose-400' : fftAnalysis.thdPct > 8 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {fftAnalysis.thdPct.toFixed(1)}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          fftAnalysis.thdPct > 25 ? 'bg-rose-500' : fftAnalysis.thdPct > 8 ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${Math.min(100, (fftAnalysis.thdPct / 50) * 100)}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Facteur de Crête</span>
                        <span className="font-bold text-slate-200">{fftAnalysis.crestFactor.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Composante Continue Idc</span>
                        <span className="font-bold text-slate-200">{fftAnalysis.dcComponent.toFixed(2)} {fftChannel === 'VA' ? 'kV' : 'kA'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Converter Interaction Card (H5/H7) */}
                  <div className="p-3 rounded-xl bg-[#0D1522] border border-[#1E2D40] text-xs font-mono space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="uppercase font-bold text-slate-300">Onduleurs & Électronique de Puissance (6k ± 1)</span>
                      <span>H5 & H7</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-2 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400">H5 (250 Hz)</span>
                        <span className="font-bold text-emerald-400">{fftAnalysis.h5RatioPct.toFixed(1)}%</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400">H7 (350 Hz)</span>
                        <span className="font-bold text-emerald-400">{fftAnalysis.h7RatioPct.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Multi-Terminal Line Differential Teleprotection Module (ANSI 87L / IEC 60255-13) */}
          {viewMode === 'LINE_DIFF_87L' && (
            <SldLineDifferential87LViewer
              locale={locale}
              currentTimeMs={currentTimeMs}
              effectiveTMin={effectiveTMin}
              effectiveTMax={effectiveTMax}
            />
          )}

          {/* Instantaneous Telemetry & Symmetrical Components Readout Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {/* Phase A Instantaneous Current */}
            <div className="p-3 rounded-xl bg-[#0D1522] border border-[#1E2D40] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                i_A (t = {currentTimeMs.toFixed(1)}ms)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black font-mono text-rose-400">
                  {currentSample.ia.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">kA</span>
              </div>
            </div>

            {/* Phase B Instantaneous Current */}
            <div className="p-3 rounded-xl bg-[#0D1522] border border-[#1E2D40] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                i_B (t = {currentTimeMs.toFixed(1)}ms)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black font-mono text-amber-400">
                  {currentSample.ib.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">kA</span>
              </div>
            </div>

            {/* Phase C Instantaneous Current */}
            <div className="p-3 rounded-xl bg-[#0D1522] border border-[#1E2D40] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                i_C (t = {currentTimeMs.toFixed(1)}ms)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black font-mono text-sky-400">
                  {currentSample.ic.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">kA</span>
              </div>
            </div>

            {/* Residual Ground Current 3I0 */}
            <div className="p-3 rounded-xl bg-[#0D1522] border border-[#1E2D40] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                3I_0 (Homopolaire)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black font-mono text-purple-400">
                  {currentSample.in0.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">kA</span>
              </div>
            </div>

            {/* Phase A Instantaneous Voltage */}
            <div className="p-3 rounded-xl bg-[#0D1522] border border-[#1E2D40] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                v_A (Phase-Terre)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black font-mono text-rose-300">
                  {currentSample.va.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-slate-400">kV</span>
              </div>
            </div>

            {/* Breaker State */}
            <div className="p-3 rounded-xl bg-[#0D1522] border border-[#1E2D40] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                État Disjoncteur 52
              </span>
              <div className="flex items-center gap-2 pt-1">
                <span className={`h-2.5 w-2.5 rounded-full ${currentSample.breakerAux52a === 1 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                <span className={`font-mono text-xs font-bold ${currentSample.breakerAux52a === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {currentSample.breakerAux52a === 1 ? 'FERMÉ (CLOSED)' : 'OUVERT (TRIPPED)'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-[#0B121C] border-t border-[#1E2E44] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span>
              {locale === 'fr' 
                ? 'Conformité CEI 60255-24 / IEEE C37.111 COMTRADE avec datation synchrophasor à la microseconde.' 
                : 'Compliant with IEC 60255-24 / IEEE C37.111 COMTRADE digital recording standard.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportComtrade}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
            >
              <FileCode className="h-4 w-4" />
              <span>{locale === 'fr' ? 'EXPORTER COMTRADE (.CFG)' : 'EXPORT COMTRADE (.CFG)'}</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                {locale === 'fr' ? 'FERMER' : 'CLOSE'}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* COMTRADE Ingestion Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-[#0E1624] border border-[#23354E] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#141F32] border-b border-[#23354E] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/40">
                  <FolderOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    {locale === 'fr' ? 'Importation Oscillogrammes COMTRADE (CEI 60255-24 / IEEE C37.111)' : 'Import COMTRADE Fault Records (IEC 60255-24 / IEEE C37.111)'}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    {locale === 'fr' ? 'Ingestion de paires .CFG (configuration) et .DAT (valeurs instantanées).' : 'Ingest paired .CFG (configuration) and .DAT (instantaneous data) files.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-4 pt-3 pb-0 bg-[#0E1624] border-b border-[#23354E] flex gap-2">
              <button
                type="button"
                onClick={() => { setActiveImportTab('PRELOADED'); setImportError(null); }}
                className={`px-3 py-1.5 rounded-t-lg text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                  activeImportTab === 'PRELOADED'
                    ? 'bg-[#182338] text-violet-300 border-violet-400'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                {locale === 'fr' ? '1. Relais Constructeurs Pré-chargés' : '1. Preloaded Relay Records'}
              </button>
              <button
                type="button"
                onClick={() => { setActiveImportTab('DROP'); setImportError(null); }}
                className={`px-3 py-1.5 rounded-t-lg text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                  activeImportTab === 'DROP'
                    ? 'bg-[#182338] text-violet-300 border-violet-400'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                {locale === 'fr' ? '2. Glisser-Déposer Fichiers (.CFG + .DAT)' : '2. Drag & Drop Files'}
              </button>
              <button
                type="button"
                onClick={() => { setActiveImportTab('PASTE'); setImportError(null); }}
                className={`px-3 py-1.5 rounded-t-lg text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                  activeImportTab === 'PASTE'
                    ? 'bg-[#182338] text-violet-300 border-violet-400'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                {locale === 'fr' ? '3. Coller Texte Brute' : '3. Paste Raw Text'}
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 bg-[#09101B]">
              {importError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 flex items-center gap-2 text-xs font-mono text-rose-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{importError}</span>
                </div>
              )}

              {activeImportTab === 'PRELOADED' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 font-sans">
                    {locale === 'fr'
                      ? 'Sélectionnez un enregistrement réel de perturbation issu de relais industriels pour analyse instantanée :'
                      : 'Select a real-world disturbance record from industry relays for instant replay:'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* MiCOM P442 Sample */}
                    <div className="p-4 rounded-xl bg-[#111B2B] border border-[#23354E] hover:border-violet-500/50 transition-all flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/40 text-[10px] font-mono font-bold">
                            Schneider MiCOM P442
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">2000 Hz / 50 Hz</span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-2">
                          {PRELOADED_COMTRADE_SAMPLES.MICOM_P442_225KV_FAULT.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {PRELOADED_COMTRADE_SAMPLES.MICOM_P442_225KV_FAULT.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleLoadPreloadedComtrade('MICOM_P442_225KV_FAULT')}
                        className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
                      >
                        {locale === 'fr' ? 'Charger cet Oscillogramme' : 'Load this Record'}
                      </button>
                    </div>

                    {/* SIPROTEC 7SJ85 Sample */}
                    <div className="p-4 rounded-xl bg-[#111B2B] border border-[#23354E] hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                            Siemens SIPROTEC 7SJ85
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">2000 Hz / 50 Hz</span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-2">
                          {PRELOADED_COMTRADE_SAMPLES.SIPROTEC_7SJ85_20KV_INRUSH.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {PRELOADED_COMTRADE_SAMPLES.SIPROTEC_7SJ85_20KV_INRUSH.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleLoadPreloadedComtrade('SIPROTEC_7SJ85_20KV_INRUSH')}
                        className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono text-xs font-bold transition-colors cursor-pointer"
                      >
                        {locale === 'fr' ? 'Charger cet Oscillogramme' : 'Load this Record'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeImportTab === 'DROP' && (
                <div className="space-y-3">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFilesSelected(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#2A3C56] hover:border-violet-400/80 rounded-2xl p-8 text-center cursor-pointer transition-all bg-[#101726]/60 hover:bg-[#121A2A]"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".cfg,.dat,text/plain"
                      onChange={(e) => handleFilesSelected(e.target.files)}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 text-violet-400 mx-auto mb-2" />
                    <p className="text-xs font-mono font-bold text-slate-200">
                      {locale === 'fr'
                        ? 'Glissez-déposez simultanément le fichier .CFG et le fichier .DAT ici'
                        : 'Drag & drop paired .CFG and .DAT files here'}
                    </p>
                    <p className="text-[11px] text-slate-400 font-sans mt-1">
                      {locale === 'fr'
                        ? 'ou cliquez pour parcourir vos dossiers locaux (CEI 60255-24 / IEEE C37.111 format ASCII)'
                        : 'or click to browse your local files (IEC 60255-24 / IEEE C37.111 ASCII format)'}
                    </p>
                  </div>
                </div>
              )}

              {activeImportTab === 'PASTE' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase font-bold">
                        1. En-tête de Configuration (.CFG) :
                      </label>
                      <textarea
                        rows={8}
                        value={cfgInputText}
                        onChange={(e) => setCfgInputText(e.target.value)}
                        placeholder={"SUBSTATION_A,P442_RELAY,1999\n8,6A,2D\n1,Va,A,,kV,1,0,0,-200,200\n2,Vb,B,,kV,1,0,0,-200,200\n3,Vc,C,,kV,1,0,0,-200,200\n4,Ia,A,,kA,1,0,0,-60,60\n5,Ib,B,,kA,1,0,0,-60,60\n6,Ic,C,,kA,1,0,0,-60,60\n1,TRIP,0\n2,52A,0\n50.0\n1\n2000,400"}
                        className="w-full bg-[#080E18] border border-[#23354E] rounded-xl p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-violet-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase font-bold">
                        2. Données Oscillographiques (.DAT ASCII) :
                      </label>
                      <textarea
                        rows={8}
                        value={datInputText}
                        onChange={(e) => setDatInputText(e.target.value)}
                        placeholder={"1,0,128.5,-64.2,-64.3,0.45,-0.22,-0.23,0,1\n2,500,129.1,-63.9,-64.1,0.44,-0.21,-0.24,0,1\n3,1000,127.8,-64.5,-63.3,0.46,-0.23,-0.23,0,1"}
                        className="w-full bg-[#080E18] border border-[#23354E] rounded-xl p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-violet-400"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleParsePastedComtrade}
                    className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    {locale === 'fr' ? 'Analyser et Visualiser l\'Oscillogramme' : 'Parse and Visualize Record'}
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#0D1522] border-t border-[#23354E] flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-[10px]">
                Norme : IEEE C37.111-1999 / CEI 60255-24 Edition 2.0
              </span>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                {locale === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
