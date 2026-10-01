// src/components/diagrams/modules/SldLineDifferential87LViewer.tsx
import React, { useState, useMemo } from 'react';
import {
  Activity,
  Radio,
  Wifi,
  WifiOff,
  ShieldAlert,
  Check,
  Zap,
  Sliders,
  Info,
  Clock,
  Layers,
  ArrowRightLeft,
  Compass,
  Download,
  Copy,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { Iec61850ConfigModal } from './Iec61850ConfigModal';

export type LineDiffScenario = 
  | 'INTERNAL_FAULT_PHA' 
  | 'EXTERNAL_THROUGH_FAULT' 
  | 'LINE_CHARGING_INRUSH' 
  | 'FIBER_CHANNEL_DESYNC';

export interface SldLineDifferential87LViewerProps {
  locale: 'fr' | 'en';
  currentTimeMs: number;
  effectiveTMin: number;
  effectiveTMax: number;
}

export const SldLineDifferential87LViewer: React.FC<SldLineDifferential87LViewerProps> = ({
  locale,
  currentTimeMs,
  effectiveTMin,
  effectiveTMax,
}) => {
  // IEC 61850 SCL modal state
  const [showIecModal, setShowIecModal] = useState<boolean>(false);

  // Scenario selection
  const [scenario, setScenario] = useState<LineDiffScenario>('INTERNAL_FAULT_PHA');

  // Protection Settings
  const [is1_pu, setIs1_pu] = useState<number>(0.20); // Basic pickup threshold (0.20 In = 120 A)
  const [k1_slope, setK1_slope] = useState<number>(0.30); // Slope 1 (30%)
  const [is2_pu, setIs2_pu] = useState<number>(1.50); // Breakpoint (1.50 In = 900 A)
  const [k2_slope, setK2_slope] = useState<number>(0.70); // Slope 2 (70%)
  const [isHighSet_pu, setIsHighSet_pu] = useState<number>(8.0); // High-set instantaneous (8.0 In)

  // Line & System Parameters
  const [lineLengthKm, setLineLengthKm] = useState<number>(80); // 80 km 225 kV line
  const [capacitiveCompActive, setCapacitiveCompActive] = useState<boolean>(true);
  const [ctConvention, setCtConvention] = useState<'INWARD' | 'BUS_OUTWARD'>('INWARD');
  const [syncMode, setSyncMode] = useState<'IEEE_1588_PTP' | 'ECHO_METHOD'>('IEEE_1588_PTP');
  const [selectedPhase, setSelectedPhase] = useState<'A' | 'B' | 'C'>('A');
  const [copiedData, setCopiedData] = useState<boolean>(false);

  // Rated values
  const InomA = 600; // 600 A secondary/primary base (CT 600/1 A)
  const UnomKv = 225; // 225 kV Line
  const VphaseV = (UnomKv * 1000) / Math.sqrt(3); // 129.9 kV line-to-neutral
  const fHz = 50;
  const omega = 2 * Math.PI * fHz; // 314.16 rad/s
  const cKm_nF = 9.6; // 9.6 nF/km operational capacitance

  // Continuous capacitive charging current calculation: Ic = omega * C_total * V_phase
  const cTotalF = lineLengthKm * cKm_nF * 1e-9;
  const icPeakA = omega * cTotalF * VphaseV * Math.sqrt(2); // Peak charging current
  const icRmsA = omega * cTotalF * VphaseV; // RMS charging current (~31.4 A for 80 km)

  // Propagation delay across optical fiber link (assume ~5 µs / km for standard single-mode fiber)
  const fiberDelayMs = useMemo(() => {
    const baseDelay = (lineLengthKm * 4.9) / 1000 + 0.12; // in ms
    if (scenario === 'FIBER_CHANNEL_DESYNC') {
      return baseDelay + 2.85; // Jitter / delay asymmetry
    }
    return Number(baseDelay.toFixed(3));
  }, [lineLengthKm, scenario]);

  const isSyncLocked = scenario !== 'FIBER_CHANNEL_DESYNC';

  // Calculate instantaneous and phasor currents for Local (Substation A) and Remote (Substation B)
  // based on time t and selected scenario
  const calculateCurrentsAtTime = (tMs: number) => {
    const tSec = tMs / 1000;
    const isFaultPeriod = tMs >= 0 && tMs <= 50; // Fault cleared at t = 50 ms by 87L
    const isPostFault = tMs > 50;

    // Normal load: 420 A, PF = 0.95 inductive (-18 deg)
    const loadPeakA = 420 * Math.sqrt(2);
    const loadAngleRad = (-18 * Math.PI) / 180;

    let il_peak = loadPeakA;
    let ir_peak = loadPeakA;
    let il_angle = loadAngleRad;
    let ir_angle = ctConvention === 'INWARD' ? loadAngleRad + Math.PI : loadAngleRad;

    // Capacitive charging current (leads voltage by +90 deg, angle = +pi/2)
    const icInstantaneous = icPeakA * Math.cos(omega * tSec + Math.PI / 2);

    if (scenario === 'INTERNAL_FAULT_PHA') {
      if (isFaultPeriod) {
        // Severe internal fault fed from both substations
        // Substation A feeds 7200 A (-75 deg)
        il_peak = 7200 * Math.sqrt(2);
        il_angle = (-75 * Math.PI) / 180;
        // Substation B feeds 5400 A (-78 deg)
        ir_peak = 5400 * Math.sqrt(2);
        ir_angle = ctConvention === 'INWARD' ? (-78 * Math.PI) / 180 : (-78 * Math.PI) / 180 + Math.PI;
      } else if (isPostFault) {
        // Breakers tripped at both ends
        il_peak = 0;
        ir_peak = 0;
      }
    } else if (scenario === 'EXTERNAL_THROUGH_FAULT') {
      if (isFaultPeriod) {
        // High through-fault: 14500 A enters at A, leaves at B
        il_peak = 14500 * Math.sqrt(2);
        il_angle = (-72 * Math.PI) / 180;
        // At Substation B, current exits:
        ir_peak = 14420 * Math.sqrt(2); // slight CT distortion
        ir_angle = ctConvention === 'INWARD' 
          ? (-72 * Math.PI) / 180 + Math.PI + (1.2 * Math.PI) / 180 // slight 1.2 deg CT phase error
          : (-72 * Math.PI) / 180 + (1.2 * Math.PI) / 180;
      }
    } else if (scenario === 'LINE_CHARGING_INRUSH') {
      // Breaker closed at A, Breaker OPEN at B
      il_peak = icPeakA;
      il_angle = Math.PI / 2; // +90 deg purely capacitive
      ir_peak = 0;
      ir_angle = 0;
    }

    // Instantaneous values
    const il_inst = il_peak * Math.cos(omega * tSec + il_angle);
    const ir_inst = ir_peak * Math.cos(omega * tSec + ir_angle);

    // Phasors (RMS complex)
    const il_rms = il_peak / Math.sqrt(2);
    const ir_rms = ir_peak / Math.sqrt(2);

    const il_re = il_rms * Math.cos(il_angle);
    const il_im = il_rms * Math.sin(il_angle);

    const ir_re = ir_rms * Math.cos(ir_angle);
    const ir_im = ir_rms * Math.sin(ir_angle);

    // Differential vector:
    // With INWARD convention: Idiff = |IL + IR - Ic_comp|
    // With BUS_OUTWARD convention: Idiff = |IL - IR - Ic_comp|
    let idiff_re = ctConvention === 'INWARD' ? il_re + ir_re : il_re - ir_re;
    let idiff_im = ctConvention === 'INWARD' ? il_im + ir_im : il_im - ir_im;

    if (capacitiveCompActive) {
      // Subtract capacitive current vector (0, icRmsA)
      idiff_im -= icRmsA;
    }

    const idiff_rms = Math.sqrt(idiff_re * idiff_re + idiff_im * idiff_im);
    const idiff_angle_deg = (Math.atan2(idiff_im, idiff_re) * 180) / Math.PI;

    // Restraining current: Irest = (|IL| + |IR|) / 2
    const irest_rms = (il_rms + ir_rms) / 2;

    // Per-unit values
    const idiff_pu = idiff_rms / InomA;
    const irest_pu = irest_rms / InomA;

    // Tripping threshold calculation based on dual-slope curve
    let tripThreshold_pu: number;
    if (irest_pu <= is2_pu) {
      tripThreshold_pu = is1_pu + k1_slope * irest_pu;
    } else {
      tripThreshold_pu = is1_pu + k1_slope * is2_pu + k2_slope * (irest_pu - is2_pu);
    }

    const isTripped = (idiff_pu >= tripThreshold_pu || idiff_pu >= isHighSet_pu) && isSyncLocked;

    return {
      tMs,
      il_inst,
      ir_inst,
      il_rms,
      ir_rms,
      il_angle_deg: (il_angle * 180) / Math.PI,
      ir_angle_deg: (ir_angle * 180) / Math.PI,
      idiff_rms,
      idiff_angle_deg,
      irest_rms,
      idiff_pu,
      irest_pu,
      tripThreshold_pu,
      isTripped,
      icRmsA,
      icInstantaneous,
    };
  };

  // Trajectory points across timeline for the R-X / Idiff-Irest plot
  const trajectoryData = useMemo(() => {
    const points: ReturnType<typeof calculateCurrentsAtTime>[] = [];
    for (let t = effectiveTMin; t <= effectiveTMax; t += 2) {
      points.push(calculateCurrentsAtTime(t));
    }
    return points;
  }, [scenario, ctConvention, capacitiveCompActive, is1_pu, k1_slope, is2_pu, k2_slope, isHighSet_pu, effectiveTMin, effectiveTMax, lineLengthKm]);

  // Current operating point at master slider currentTimeMs
  const currentOp = useMemo(() => {
    return calculateCurrentsAtTime(currentTimeMs);
  }, [currentTimeMs, scenario, ctConvention, capacitiveCompActive, is1_pu, k1_slope, is2_pu, k2_slope, isHighSet_pu, lineLengthKm]);

  // SVG coordinate transformation helpers for Dual-Slope Plane
  // X: Irest_pu (0 to 6 pu) -> 60 to 440 px
  // Y: Idiff_pu (0 to 6 pu) -> 310 to 30 px
  const svgPlaneWidth = 470;
  const svgPlaneHeight = 340;
  const maxPuDisplay = 6.0;

  const restToX = (irest: number) => 55 + (Math.min(maxPuDisplay, Math.max(0, irest)) / maxPuDisplay) * (svgPlaneWidth - 75);
  const diffToY = (idiff: number) => 295 - (Math.min(maxPuDisplay, Math.max(0, idiff)) / maxPuDisplay) * 260;

  // Dual-slope characteristic polygon points for TRIP ZONE
  const tripBoundaryPath = useMemo(() => {
    const p0 = `${restToX(0)},${diffToY(is1_pu)}`;
    const pBreak = `${restToX(is2_pu)},${diffToY(is1_pu + k1_slope * is2_pu)}`;
    const pEndIrest = maxPuDisplay;
    const pEndIdiff = is1_pu + k1_slope * is2_pu + k2_slope * (pEndIrest - is2_pu);
    const pEnd = `${restToX(pEndIrest)},${diffToY(Math.min(maxPuDisplay, pEndIdiff))}`;
    const pTopRight = `${restToX(pEndIrest)},${diffToY(maxPuDisplay)}`;
    const pTopLeft = `${restToX(0)},${diffToY(maxPuDisplay)}`;
    return `M ${p0} L ${pBreak} L ${pEnd} L ${pTopRight} L ${pTopLeft} Z`;
  }, [is1_pu, k1_slope, is2_pu, k2_slope]);

  // Copy diagnostic summary
  const handleCopyReport = () => {
    const report = [
      `=== DIAGNOSTIC DIFFÉRENTIELLE DE LIGNE ANSI 87L ===`,
      `Date/Heure: ${new Date().toISOString()}`,
      `Ligne: 225 kV Mangoumbé - Oyomabang (${lineLengthKm} km)`,
      `Scénario: ${scenario}`,
      `Temps d'analyse t: ${currentTimeMs.toFixed(1)} ms`,
      `Courant Sous-station A (Local): ${currentOp.il_rms.toFixed(1)} A (${currentOp.il_angle_deg.toFixed(1)}°)`,
      `Courant Sous-station B (Distant): ${currentOp.ir_rms.toFixed(1)} A (${currentOp.ir_angle_deg.toFixed(1)}°)`,
      `Courant Différentiel Idiff: ${currentOp.idiff_rms.toFixed(1)} A (${currentOp.idiff_pu.toFixed(2)} p.u.)`,
      `Courant de Retenue Irest: ${currentOp.irest_rms.toFixed(1)} A (${currentOp.irest_pu.toFixed(2)} p.u.)`,
      `Courant Capacitif Ligne Ic: ${icRmsA.toFixed(1)} A (Compensé: ${capacitiveCompActive ? 'OUI' : 'NON'})`,
      `Seuil de Déclenchement à ce point: ${(currentOp.tripThreshold_pu * InomA).toFixed(1)} A`,
      `État Relais 87L: ${currentOp.isTripped ? 'DÉCLENCHEMENT (TRIP)' : 'STABILITÉ / RETENUE'}`,
      `Liaison Téléprotection: Fibre Optique ${fiberDelayMs} ms - Horloge: ${isSyncLocked ? 'VERROUILLÉE (IEEE 1588)' : 'DÉSYNCHRONISÉE (ALARME 87L BLOQUÉE)'}`,
    ].join('\n');

    navigator.clipboard.writeText(report);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2000);
  };

  return (
    <div className="space-y-4 font-sans animate-in fade-in duration-200">
      
      {/* Top Banner: Substation Link Status & Fiber Optic Teleprotection Channel */}
      <div className="p-4 rounded-xl bg-[#0B1321] border border-[#20314A] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              <Radio className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  {locale === 'fr' 
                    ? 'PROTECTION DIFFÉRENTIELLE DE LIGNE MULTI-TERMINAUX (ANSI 87L / CEI 60255-13)' 
                    : 'MULTI-TERMINAL LINE DIFFERENTIAL TELEPROTECTION (ANSI 87L / IEC 60255-13)'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold">
                  {lineLengthKm} km · 225 kV
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? 'Synchronisation bout-en-bout par fibre optique OPGW & compensation vectorielle du courant capacitif de ligne.'
                  : 'End-to-end OPGW fiber optic synchronization & line charging capacitive current vector compensation.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
              title="Copier le rapport d'analyse 87L"
            >
              {copiedData ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedData ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier Bilan' : 'Copy Report')}</span>
            </button>
          </div>
        </div>

        {/* Teleprotection Channel Metrics & Topology Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 text-xs font-mono">
          {/* Substation A (Local) */}
          <div className="p-2.5 rounded-lg bg-[#0F1A2C] border border-[#22354E]">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="font-bold text-cyan-400">{locale === 'fr' ? 'POSTE A (LOCAL)' : 'STATION A (LOCAL)'}</span>
              <span>MiCOM P546</span>
            </div>
            <div className="text-white font-bold mt-1 text-sm">Poste Mangoumbé 225 kV</div>
            <div className="text-[11px] text-slate-300 mt-0.5 flex items-center justify-between">
              <span>I_local:</span>
              <span className="text-cyan-300 font-bold">{currentOp.il_rms.toFixed(0)} A ∠ {currentOp.il_angle_deg.toFixed(1)}°</span>
            </div>
          </div>

          {/* Optical Teleprotection Link */}
          <div className={`p-2.5 rounded-lg border ${isSyncLocked ? 'bg-[#0F1A2C] border-[#22354E]' : 'bg-rose-950/40 border-rose-500/50 animate-pulse'}`}>
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="font-bold flex items-center gap-1 text-indigo-400">
                <Wifi className="h-3 w-3" />
                {locale === 'fr' ? 'CANAL FIBRE OPTIQUE' : 'OPTICAL FIBER LINK'}
              </span>
              <span className={isSyncLocked ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {isSyncLocked ? '1588 PTP LOCKED' : 'DESYNC ALARM'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-white font-bold text-xs">{fiberDelayMs} ms {locale === 'fr' ? 'propagation' : 'propagation'}</span>
              <span className="text-[10px] text-slate-400">Gigue: {isSyncLocked ? '0.8 µs' : '3200 µs'}</span>
            </div>
            <div className="text-[10px] text-slate-300 mt-0.5 flex items-center justify-between">
              <span>{locale === 'fr' ? 'Protocole :' : 'Protocol:'}</span>
              <span className="text-indigo-300">{syncMode === 'IEEE_1588_PTP' ? 'IEEE C37.94 / 1588' : 'Ping-Pong / Echo'}</span>
            </div>
          </div>

          {/* Substation B (Remote) */}
          <div className="p-2.5 rounded-lg bg-[#0F1A2C] border border-[#22354E]">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="font-bold text-amber-400">{locale === 'fr' ? 'POSTE B (DISTANT)' : 'STATION B (REMOTE)'}</span>
              <span>SIPROTEC 7SD87</span>
            </div>
            <div className="text-white font-bold mt-1 text-sm">Poste Oyomabang 225 kV</div>
            <div className="text-[11px] text-slate-300 mt-0.5 flex items-center justify-between">
              <span>I_distant:</span>
              <span className="text-amber-300 font-bold">{currentOp.ir_rms.toFixed(0)} A ∠ {currentOp.ir_angle_deg.toFixed(1)}°</span>
            </div>
          </div>

          {/* Real-time 87L Trip Status */}
          <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
            currentOp.isTripped 
              ? 'bg-rose-950/60 border-rose-500 text-rose-200 shadow-md shadow-rose-900/30 animate-pulse' 
              : !isSyncLocked
              ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
          }`}>
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold uppercase tracking-wider">{locale === 'fr' ? 'ORDRE DE DÉCLENCHEMENT 87L' : '87L TRIP STATUS'}</span>
              <ShieldAlert className="h-3.5 w-3.5" />
            </div>
            <div className="text-sm font-bold font-mono mt-1">
              {currentOp.isTripped 
                ? (locale === 'fr' ? 'DÉCLENCHEMENT INSTANTANÉ' : 'INSTANTANEOUS TRIP')
                : !isSyncLocked
                ? (locale === 'fr' ? 'BLOQUÉ (DÉSYNCHRO)' : 'BLOCKED (DESYNC)')
                : (locale === 'fr' ? 'STABILITÉ / RETENUE' : 'RESTRAIN / STABLE')}
            </div>
            <div className="text-[10px] opacity-90 mt-0.5 flex items-center justify-between">
              <span>Idiff / Irest:</span>
              <span className="font-bold">{currentOp.idiff_rms.toFixed(0)} A / {currentOp.irest_rms.toFixed(0)} A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Selection & Engineering Parameters Bar */}
      <div className="p-3.5 rounded-xl bg-[#09111D] border border-[#1C2C40] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Scenario Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400 text-[11px] mr-1 font-bold">{locale === 'fr' ? 'Scénario :' : 'Scenario:'}</span>
            <button
              type="button"
              onClick={() => setScenario('INTERNAL_FAULT_PHA')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                scenario === 'INTERNAL_FAULT_PHA'
                  ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50 shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              1. {locale === 'fr' ? 'Défaut Interne Ligne (Ph-A)' : 'Internal Fault (Ph-A)'}
            </button>

            <button
              type="button"
              onClick={() => setScenario('EXTERNAL_THROUGH_FAULT')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                scenario === 'EXTERNAL_THROUGH_FAULT'
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              2. {locale === 'fr' ? 'Défaut Externe Traversant' : 'External Through Fault'}
            </button>

            <button
              type="button"
              onClick={() => setScenario('LINE_CHARGING_INRUSH')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                scenario === 'LINE_CHARGING_INRUSH'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              3. {locale === 'fr' ? 'Mise Sous Tension Ligne à Vide (Ic)' : 'No-Load Line Energization (Ic)'}
            </button>

            <button
              type="button"
              onClick={() => setScenario('FIBER_CHANNEL_DESYNC')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                scenario === 'FIBER_CHANNEL_DESYNC'
                  ? 'bg-violet-500/25 text-violet-300 border border-violet-500/50 shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              4. {locale === 'fr' ? 'Dérive Horloge / Gigue Fibre' : 'Clock Drift / Fiber Jitter'}
            </button>
          </div>

          {/* Quick Toggles */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {/* Capacitive Current Compensation Toggle */}
            <button
              type="button"
              onClick={() => setCapacitiveCompActive(!capacitiveCompActive)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                capacitiveCompActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-xs'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Compensation en temps réel du courant de charge capacitif Ic = omega*C*V"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? `Comp. Capacitive Ic (${icRmsA.toFixed(0)}A) : ${capacitiveCompActive ? 'ACTIVE' : 'DÉSACTIVÉE'}` : `Cap. Comp Ic (${icRmsA.toFixed(0)}A): ${capacitiveCompActive ? 'ON' : 'OFF'}`}</span>
            </button>

            {/* CT Convention Toggle */}
            <button
              type="button"
              onClick={() => setCtConvention(ctConvention === 'INWARD' ? 'BUS_OUTWARD' : 'INWARD')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-colors cursor-pointer"
              title="Changer la polarité nominale des réducteurs de courant"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-indigo-400" />
              <span>{ctConvention === 'INWARD' ? 'TC: Entrant Zone (IL+IR)' : 'TC: Sortant Barre (IL-IR)'}</span>
            </button>

            {/* IEC 61850 SCL Config Generator Button */}
            <button
              type="button"
              onClick={() => setShowIecModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 font-mono text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Générer les fichiers de configuration CEI 61850 SCL / CID / SCD"
            >
              <Cpu className="h-3.5 w-3.5 text-indigo-400" />
              <span>{locale === 'fr' ? 'CONFIG CEI 61850' : 'IEC 61850 SCL'}</span>
            </button>
          </div>
        </div>

        {/* Setting Sliders Drawer */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-300">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Is1 (Seuil Base):</span>
              <span className="text-cyan-300 font-bold">{(is1_pu * InomA).toFixed(0)} A ({is1_pu.toFixed(2)} In)</span>
            </div>
            <input
              type="range"
              min={0.10}
              max={0.50}
              step={0.02}
              value={is1_pu}
              onChange={(e) => setIs1_pu(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Pente 1 (k1):</span>
              <span className="text-cyan-300 font-bold">{(k1_slope * 100).toFixed(0)} %</span>
            </div>
            <input
              type="range"
              min={0.15}
              max={0.50}
              step={0.05}
              value={k1_slope}
              onChange={(e) => setK1_slope(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Is2 (Coude):</span>
              <span className="text-cyan-300 font-bold">{(is2_pu * InomA).toFixed(0)} A ({is2_pu.toFixed(1)} In)</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={2.5}
              step={0.1}
              value={is2_pu}
              onChange={(e) => setIs2_pu(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Pente 2 (k2):</span>
              <span className="text-cyan-300 font-bold">{(k2_slope * 100).toFixed(0)} %</span>
            </div>
            <input
              type="range"
              min={0.50}
              max={1.00}
              step={0.05}
              value={k2_slope}
              onChange={(e) => setK2_slope(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">{locale === 'fr' ? 'Longueur Ligne :' : 'Line Length:'}</span>
              <span className="text-indigo-300 font-bold">{lineLengthKm} km</span>
            </div>
            <input
              type="range"
              min={20}
              max={180}
              step={5}
              value={lineLengthKm}
              onChange={(e) => setLineLengthKm(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded-lg accent-indigo-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Dual View: Left = Dual-Slope Operating Plane (Idiff vs Irest) | Right = Synchronized Dual-End Waveforms & Vectors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column (5 Cols): Dual-Slope Differential Plane (Idiff vs Irest) */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#0A121E] border border-[#1E2E44] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-indigo-400" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  {locale === 'fr' ? 'PLAN DIFFÉRENTIEL DYNAMIQUE (Idiff vs Irest)' : 'DYNAMIC DIFFERENTIAL PLANE (Idiff vs Irest)'}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                CEI 60255-13
              </span>
            </div>

            {/* Characteristic SVG Plane */}
            <div className="w-full relative mt-3">
              <svg viewBox={`0 0 ${svgPlaneWidth} ${svgPlaneHeight}`} className="w-full h-auto">
                {/* Background */}
                <rect x="0" y="0" width={svgPlaneWidth} height={svgPlaneHeight} fill="#060B12" rx="8" />

                {/* Grid Lines */}
                {[1, 2, 3, 4, 5, 6].map((pu) => (
                  <React.Fragment key={`grid-${pu}`}>
                    {/* Vertical grid lines (Irest) */}
                    <line
                      x1={restToX(pu)}
                      y1={35}
                      x2={restToX(pu)}
                      y2={295}
                      stroke="#162232"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={restToX(pu)}
                      y={310}
                      fill="#64748B"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {pu}
                    </text>

                    {/* Horizontal grid lines (Idiff) */}
                    <line
                      x1={55}
                      y1={diffToY(pu)}
                      x2={svgPlaneWidth - 20}
                      y2={diffToY(pu)}
                      stroke="#162232"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={48}
                      y={diffToY(pu) + 3}
                      fill="#64748B"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {pu}
                    </text>
                  </React.Fragment>
                ))}

                {/* Trip Zone Shaded Area */}
                <path
                  d={tripBoundaryPath}
                  fill="rgba(244, 63, 94, 0.14)"
                  stroke="rgba(244, 63, 94, 0.85)"
                  strokeWidth="2"
                />

                {/* Restrain Zone Shaded Area (Stability) */}
                <polygon
                  points={`
                    ${restToX(0)},${diffToY(0)} 
                    ${restToX(0)},${diffToY(is1_pu)} 
                    ${restToX(is2_pu)},${diffToY(is1_pu + k1_slope * is2_pu)} 
                    ${restToX(maxPuDisplay)},${diffToY(Math.min(maxPuDisplay, is1_pu + k1_slope * is2_pu + k2_slope * (maxPuDisplay - is2_pu)))} 
                    ${restToX(maxPuDisplay)},${diffToY(0)}
                  `}
                  fill="rgba(16, 185, 129, 0.08)"
                />

                {/* Zone Labels */}
                <text
                  x={restToX(1.2)}
                  y={diffToY(4.2)}
                  fill="#F43F5E"
                  fontSize="12"
                  fontFamily="monospace"
                  fontWeight="bold"
                  opacity="0.85"
                >
                  ZONE DÉCLENCHEMENT (TRIP)
                </text>
                <text
                  x={restToX(3.0)}
                  y={diffToY(0.7)}
                  fill="#10B981"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                  opacity="0.85"
                >
                  ZONE DE RETENUE (STABILITÉ)
                </text>

                {/* Breakpoint annotation */}
                <circle
                  cx={restToX(is2_pu)}
                  cy={diffToY(is1_pu + k1_slope * is2_pu)}
                  r="4"
                  fill="#38BDF8"
                  stroke="#0C4A6E"
                  strokeWidth="1.5"
                />
                <text
                  x={restToX(is2_pu) + 6}
                  y={diffToY(is1_pu + k1_slope * is2_pu) - 6}
                  fill="#38BDF8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  Coude Is2 = {is2_pu} In
                </text>

                {/* High-Set Threshold Line */}
                <line
                  x1={55}
                  y1={diffToY(isHighSet_pu)}
                  x2={svgPlaneWidth - 20}
                  y2={diffToY(isHighSet_pu)}
                  stroke="#F59E0B"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />

                {/* Trajectory Trail over time */}
                <polyline
                  points={trajectoryData
                    .filter((p) => p.tMs <= currentTimeMs)
                    .map((p) => `${restToX(p.irest_pu)},${diffToY(p.idiff_pu)}`)
                    .join(' ')}
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  opacity="0.75"
                />

                {/* Current Operating Point Marker */}
                <g>
                  {/* Glowing halo */}
                  <circle
                    cx={restToX(currentOp.irest_pu)}
                    cy={diffToY(currentOp.idiff_pu)}
                    r={currentOp.isTripped ? "12" : "9"}
                    fill={currentOp.isTripped ? "rgba(244, 63, 94, 0.4)" : "rgba(56, 189, 248, 0.3)"}
                    className="animate-pulse"
                  />
                  <circle
                    cx={restToX(currentOp.irest_pu)}
                    cy={diffToY(currentOp.idiff_pu)}
                    r="5"
                    fill={currentOp.isTripped ? "#F43F5E" : "#38BDF8"}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  {/* Label on point */}
                  <text
                    x={restToX(currentOp.irest_pu) + 8}
                    y={diffToY(currentOp.idiff_pu) - 8}
                    fill={currentOp.isTripped ? "#FDA4AF" : "#BAE6FD"}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    t = {currentTimeMs.toFixed(0)} ms ({currentOp.idiff_pu.toFixed(2)} pu)
                  </text>
                </g>

                {/* Axes */}
                <line x1="55" y1="295" x2={svgPlaneWidth - 15} y2="295" stroke="#475569" strokeWidth="1.5" />
                <line x1="55" y1="295" x2="55" y2="25" stroke="#475569" strokeWidth="1.5" />

                {/* Axis Titles */}
                <text
                  x={svgPlaneWidth - 20}
                  y="325"
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                  fontWeight="bold"
                >
                  I_rest = (|IL| + |IR|)/2 [p.u.]
                </text>

                <text
                  x="20"
                  y="20"
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  I_diff = |IL + IR - Ic| [p.u.]
                </text>
              </svg>
            </div>
          </div>

          {/* Quick Mathematical Summary */}
          <div className="p-3 rounded-lg bg-[#0E1726] border border-[#1E2E44] text-[11px] font-mono text-slate-300 mt-3 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">{locale === 'fr' ? 'Courant Différentiel Vectoriel :' : 'Vector Differential Current:'}</span>
              <span className="text-rose-300 font-bold">{currentOp.idiff_rms.toFixed(1)} A ({currentOp.idiff_pu.toFixed(2)} p.u.)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{locale === 'fr' ? 'Courant de Retenue Scalaire :' : 'Scalar Restraining Current:'}</span>
              <span className="text-emerald-300 font-bold">{currentOp.irest_rms.toFixed(1)} A ({currentOp.irest_pu.toFixed(2)} p.u.)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{locale === 'fr' ? 'Seuil Dynamique Limite (Trip Boundary) :' : 'Trip Boundary Threshold:'}</span>
              <span className="text-amber-300 font-bold">{(currentOp.tripThreshold_pu * InomA).toFixed(1)} A ({(currentOp.tripThreshold_pu).toFixed(2)} p.u.)</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800">
              <span className="text-slate-400">{locale === 'fr' ? 'Marge de Sécurité / Déclenchement :' : 'Safety / Trip Margin:'}</span>
              <span className={`font-bold ${currentOp.idiff_pu >= currentOp.tripThreshold_pu ? 'text-rose-400' : 'text-emerald-400'}`}>
                {((currentOp.idiff_pu - currentOp.tripThreshold_pu) * InomA).toFixed(0)} A
                ({currentOp.idiff_pu >= currentOp.tripThreshold_pu ? (locale === 'fr' ? ' Déclenchement' : ' Tripping') : (locale === 'fr' ? ' Sous le seuil' : ' Restrained')})
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (6 Cols): Synchronized Dual-End Waveforms & Vector Comparison */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-[#0A121E] border border-[#1E2E44] shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  {locale === 'fr' ? 'ONDES INSTANTANÉES SYNCHRONISÉES (POSTE A vs POSTE B)' : 'SYNCHRONIZED DUAL-END WAVEFORMS (STATION A vs B)'}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Phase {selectedPhase}
              </span>
            </div>

            {/* Synchronized Oscillogram SVG */}
            <div className="w-full relative mt-3">
              <svg viewBox="0 0 460 210" className="w-full h-auto">
                <rect x="0" y="0" width="460" height="210" fill="#060B12" rx="8" />

                {/* Zero axes */}
                <line x1="45" y1="105" x2="445" y2="105" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="45" y1="15" x2="45" y2="195" stroke="#475569" strokeWidth="1.5" />

                {/* Time divisions */}
                {[-40, -20, 0, 20, 40, 60, 80, 100, 120, 140, 160].map((t) => {
                  if (t < effectiveTMin || t > effectiveTMax) return null;
                  const x = 45 + ((t - effectiveTMin) / (effectiveTMax - effectiveTMin)) * 395;
                  return (
                    <React.Fragment key={`tdiv-${t}`}>
                      <line x1={x} y1={20} x2={x} y2={190} stroke="#131F30" strokeWidth="1" />
                      <text x={x} y={202} fill="#64748B" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        {t}
                      </text>
                    </React.Fragment>
                  );
                })}

                {/* Fault Inception Marker t = 0 */}
                {0 >= effectiveTMin && 0 <= effectiveTMax && (
                  <g>
                    {(() => {
                      const x0 = 45 + ((0 - effectiveTMin) / (effectiveTMax - effectiveTMin)) * 395;
                      return (
                        <>
                          <line x1={x0} y1={15} x2={x0} y2={190} stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 2" />
                          <text x={x0 + 3} y={26} fill="#F43F5E" fontSize="8" fontFamily="monospace" fontWeight="bold">
                            t = 0
                          </text>
                        </>
                      );
                    })()}
                  </g>
                )}

                {/* Cursor Line */}
                {(() => {
                  const cx = 45 + ((currentTimeMs - effectiveTMin) / (effectiveTMax - effectiveTMin)) * 395;
                  return (
                    <g>
                      <line x1={cx} y1={15} x2={cx} y2={190} stroke="#38BDF8" strokeWidth="2" />
                      <circle cx={cx} cy={105} r="3" fill="#38BDF8" />
                    </g>
                  );
                })()}

                {/* Waveform 1: Local Substation A (Cyan) */}
                <path
                  d={(() => {
                    const points = trajectoryData.map((p) => {
                      const x = 45 + ((p.tMs - effectiveTMin) / (effectiveTMax - effectiveTMin)) * 395;
                      const y = 105 - (p.il_inst / 18000) * 80;
                      return `${x},${y}`;
                    });
                    return `M ${points.join(' L ')}`;
                  })()}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />

                {/* Waveform 2: Remote Substation B (Amber) */}
                <path
                  d={(() => {
                    const points = trajectoryData.map((p) => {
                      const x = 45 + ((p.tMs - effectiveTMin) / (effectiveTMax - effectiveTMin)) * 395;
                      const y = 105 - (p.ir_inst / 18000) * 80;
                      return `${x},${y}`;
                    });
                    return `M ${points.join(' L ')}`;
                  })()}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="1.8"
                  strokeDasharray={scenario === 'EXTERNAL_THROUGH_FAULT' ? '3 1' : 'none'}
                />

                {/* Waveform 3: Resulting Differential Current Idiff(t) (Violet) */}
                <path
                  d={(() => {
                    const points = trajectoryData.map((p) => {
                      const x = 45 + ((p.tMs - effectiveTMin) / (effectiveTMax - effectiveTMin)) * 395;
                      // Inst differential
                      const instDiff = ctConvention === 'INWARD' ? p.il_inst + p.ir_inst : p.il_inst - p.ir_inst;
                      const comp = capacitiveCompActive ? p.icInstantaneous : 0;
                      const y = 105 - ((instDiff - comp) / 18000) * 80;
                      return `${x},${y}`;
                    });
                    return `M ${points.join(' L ')}`;
                  })()}
                  fill="none"
                  stroke="#C084FC"
                  strokeWidth="1.5"
                />

                {/* Legends */}
                <g transform="translate(55, 20)">
                  <line x1="0" y1="5" x2="15" y2="5" stroke="#38BDF8" strokeWidth="2" />
                  <text x="20" y="8" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">I_Local (Poste A)</text>

                  <line x1="125" y1="5" x2="140" y2="5" stroke="#F59E0B" strokeWidth="2" />
                  <text x="145" y="8" fill="#F59E0B" fontSize="9" fontFamily="monospace" fontWeight="bold">I_Distant (Poste B)</text>

                  <line x1="260" y1="5" x2="275" y2="5" stroke="#C084FC" strokeWidth="2" />
                  <text x="280" y="8" fill="#C084FC" fontSize="9" fontFamily="monospace" fontWeight="bold">I_Diff (Résultant)</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Phasor Radar Comparison (Vector Diagram) */}
          <div className="p-3.5 rounded-lg bg-[#080E18] border border-[#1E2E44]">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-400 font-bold uppercase">{locale === 'fr' ? 'DIAGRAMME PHASORIEL BOUT-EN-BOUT' : 'END-TO-END PHASOR DIAGRAM'}</span>
              <span className="text-[10px] text-slate-500">t = {currentTimeMs.toFixed(1)} ms</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Polar plot SVG */}
              <div className="w-full flex justify-center">
                <svg viewBox="0 0 160 160" className="w-36 h-36">
                  {/* Concentric rings */}
                  <circle cx="80" cy="80" r="70" fill="#04070D" stroke="#1A283C" strokeWidth="1" />
                  <circle cx="80" cy="80" r="46" fill="none" stroke="#1A283C" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx="80" cy="80" r="23" fill="none" stroke="#1A283C" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="10" y1="80" x2="150" y2="80" stroke="#1E293B" strokeWidth="1" />
                  <line x1="80" y1="10" x2="80" y2="150" stroke="#1E293B" strokeWidth="1" />

                  {/* Local Vector (Cyan) */}
                  {(() => {
                    const r = Math.min(68, (currentOp.il_rms / 12000) * 65);
                    const rad = (currentOp.il_angle_deg * Math.PI) / 180;
                    const x = 80 + r * Math.cos(rad);
                    const y = 80 - r * Math.sin(rad);
                    return (
                      <g>
                        <line x1="80" y1="80" x2={x} y2={y} stroke="#38BDF8" strokeWidth="2.5" />
                        <circle cx={x} cy={y} r="3" fill="#38BDF8" />
                      </g>
                    );
                  })()}

                  {/* Remote Vector (Amber) */}
                  {(() => {
                    const r = Math.min(68, (currentOp.ir_rms / 12000) * 65);
                    const rad = (currentOp.ir_angle_deg * Math.PI) / 180;
                    const x = 80 + r * Math.cos(rad);
                    const y = 80 - r * Math.sin(rad);
                    return (
                      <g>
                        <line x1="80" y1="80" x2={x} y2={y} stroke="#F59E0B" strokeWidth="2.5" />
                        <circle cx={x} cy={y} r="3" fill="#F59E0B" />
                      </g>
                    );
                  })()}

                  {/* Differential Vector Idiff (Violet) */}
                  {(() => {
                    const r = Math.min(68, (currentOp.idiff_rms / 12000) * 65);
                    const rad = (currentOp.idiff_angle_deg * Math.PI) / 180;
                    const x = 80 + r * Math.cos(rad);
                    const y = 80 - r * Math.sin(rad);
                    return (
                      <g>
                        <line x1="80" y1="80" x2={x} y2={y} stroke="#C084FC" strokeWidth="2" strokeDasharray="3 1" />
                        <circle cx={x} cy={y} r="3" fill="#C084FC" />
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Phasor Table & Angular Difference */}
              <div className="space-y-1.5 text-[11px] font-mono">
                <div className="p-2 rounded bg-[#0E1726] border border-slate-800">
                  <div className="text-cyan-400 font-bold">I_Local (Poste A) :</div>
                  <div className="text-white">{currentOp.il_rms.toFixed(0)} A ∠ {currentOp.il_angle_deg.toFixed(1)}°</div>
                </div>

                <div className="p-2 rounded bg-[#0E1726] border border-slate-800">
                  <div className="text-amber-400 font-bold">I_Distant (Poste B) :</div>
                  <div className="text-white">{currentOp.ir_rms.toFixed(0)} A ∠ {currentOp.ir_angle_deg.toFixed(1)}°</div>
                </div>

                <div className="p-2 rounded bg-[#0E1726] border border-slate-800">
                  <div className="text-purple-400 font-bold">I_Différique :</div>
                  <div className="text-white">{currentOp.idiff_rms.toFixed(0)} A ∠ {currentOp.idiff_angle_deg.toFixed(1)}°</div>
                </div>

                <div className="text-[10px] text-slate-400 pt-1">
                  Déphasage Δθ: <span className="text-slate-200 font-bold">{Math.abs(currentOp.il_angle_deg - currentOp.ir_angle_deg).toFixed(1)}°</span>
                  {scenario === 'INTERNAL_FAULT_PHA' && <span className="text-rose-400 ml-1 font-bold">(En Phase -&gt; Défaut)</span>}
                  {scenario === 'EXTERNAL_THROUGH_FAULT' && <span className="text-emerald-400 ml-1 font-bold">(En Opposition -&gt; Traversant)</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Engineering Diagnostic Details & Recommendations */}
      <div className="p-4 rounded-xl bg-[#0C1524] border border-[#1E2E44] text-xs font-mono text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <Info className="h-4 w-4" />
          <span>{locale === 'fr' ? 'RÈGLES D\'INGÉNIERIE ANSI 87L & COMPORTEMENT NORMATIF (CEI 60255-13)' : 'ANSI 87L ENGINEERING PRINCIPLES & NORMATIVE BEHAVIOR (IEC 60255-13)'}</span>
        </div>
        <p className="leading-relaxed text-slate-300">
          {scenario === 'INTERNAL_FAULT_PHA' && (
            locale === 'fr'
              ? 'Défaut interne monophasé franc Ph-A : Les deux extrémités de la ligne alimentent le court-circuit. Les vecteurs de courant I_local et I_distant sont en phase (entrant dans la zone). Le courant différentiel Idiff bondit au-dessus de la caractéristique à double pente, générant un ordre de déclenchement instantané simultané à Mangoumbé et Oyomabang en moins de 15 ms.'
              : 'Internal single-phase Ph-A fault: Both line terminals feed into the short-circuit. Current vectors are in-phase (entering zone). Idiff jumps above dual-slope trip curve, issuing simultaneous instantaneous trip orders at both substations within 15 ms.'
          )}
          {scenario === 'EXTERNAL_THROUGH_FAULT' && (
            locale === 'fr'
              ? 'Court-circuit traversant hors-zone : Le fort courant de défaut traverse la ligne (entre au Poste A et ressort au Poste B). Le courant de retenue Irest est très élevé, déplaçant le point de fonctionnement dans la zone de forte pente k2 (70%). Idiff résiduel reste minime (inférieur aux erreurs de TC), garantissant une stabilité absolue sans déclenchement intempestif.'
              : 'External through-fault: Massive fault current traverses the line (entering Station A, exiting Station B). High restraining current Irest places operating point into high slope k2 (70%) region. Residual Idiff remains below threshold, ensuring 100% stability against CT saturation.'
          )}
          {scenario === 'LINE_CHARGING_INRUSH' && (
            locale === 'fr'
              ? `Mise sous tension de la ligne à vide (225 kV, ${lineLengthKm} km) : Le courant capacitif de charge continue Ic = ω·C·V atteint ${icRmsA.toFixed(1)} A. Sans compensation vectorielle, ce courant apparaît comme un faux courant différentiel pouvant franchir le seuil Is1 (${(is1_pu * InomA).toFixed(0)} A). Avec la compensation active, Ic est vectoriellement soustrait, réduisant Idiff résiduel à ~0 A.`
              : `No-load line energization (225 kV, ${lineLengthKm} km): Continuous capacitive charging current Ic = ω·C·V reaches ${icRmsA.toFixed(1)} A. Without vector compensation, this appears as phantom differential current risking false trip. Active compensation vectorially subtracts Ic, maintaining Idiff near 0 A.`
          )}
          {scenario === 'FIBER_CHANNEL_DESYNC' && (
            locale === 'fr'
              ? 'Perte de synchronisation temporelle sur canal fibre optique : La gigue dépasse la tolérance normative (> 1.5 ms). Le relais 87L bloque immédiatement l\'algorithme différentiel pour éviter tout faux déclenchement sur échantillons déphasés, émet une alarme téléprotection et bascule instantanément sur la protection de secours de distance ANSI 21.'
              : 'Optical fiber channel desynchronization: Jitter exceeds standard tolerance (> 1.5 ms). The 87L relay immediately blocks differential tripping to avoid spurious operations, generates a teleprotection alarm, and executes seamless fallback to backup ANSI 21 distance protection.'
          )}
        </p>
      </div>

      {/* IEC 61850 Modal */}
      <Iec61850ConfigModal
        isOpen={showIecModal}
        onClose={() => setShowIecModal(false)}
        locale={locale}
      />

    </div>
  );
};
