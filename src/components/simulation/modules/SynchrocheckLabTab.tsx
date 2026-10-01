// src/components/simulation/modules/SynchrocheckLabTab.tsx
// Module 14: Synchrocheck & Generator Paralleling Lab (ANSI 25 / CEI 60255-127 / IEEE C37.102 / IEEE 1547)
// High-Voltage Generation & Grid Integration Lab - EPEDE Supreme Engineering Council

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Gauge,
  Activity,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Layers,
  Zap,
  Play,
  Square,
  Copy,
  Download,
  FileText,
  Compass,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Radio,
  Timer
} from 'lucide-react';

interface SynchrocheckLabTabProps {
  locale: 'fr' | 'en';
}

export type SynchroPresetType = 
  | 'hydro_nachtigal'
  | 'gas_kribi'
  | 'substation_intertie'
  | 'severe_antiphase'
  | 'excessive_slip';

export const SynchrocheckLabTab: React.FC<SynchrocheckLabTabProps> = ({ locale }) => {
  // ---------------------------------------------------------------------------
  // 1. GRID (BUSBAR) NOMINAL & ACTUAL CONDITIONS
  // ---------------------------------------------------------------------------
  const [gridVoltageNominalKv, setGridVoltageNominalKv] = useState<number>(15.0); // 15 kV nominal
  const [gridVoltageKv, setGridVoltageKv] = useState<number>(15.0);
  const [gridFrequencyHz, setGridFrequencyHz] = useState<number>(50.00);

  // ---------------------------------------------------------------------------
  // 2. GENERATOR (INCOMING MACHINE) GOVERNOR & AVR STATE
  // ---------------------------------------------------------------------------
  const [genVoltageKv, setGenVoltageKv] = useState<number>(15.0);
  const [genFrequencyHz, setGenFrequencyHz] = useState<number>(50.06); // slight slip
  const [breakerCloseTimeMs, setBreakerCloseTimeMs] = useState<number>(80); // 80 ms typical circuit breaker
  const [machineRatedMva, setMachineRatedMva] = useState<number>(120); // 120 MVA hydro
  const [xdDoublePrimePu, setXdDoublePrimePu] = useState<number>(0.20); // subtransient reactance

  // ---------------------------------------------------------------------------
  // 3. ANSI 25 RELAY CRITERIA TOLERANCES
  // ---------------------------------------------------------------------------
  const [deltaUThresholdPercent, setDeltaUThresholdPercent] = useState<number>(4.0); // max 4%
  const [deltaFThresholdHz, setDeltaFThresholdHz] = useState<number>(0.10); // max 0.10 Hz
  const [deltaAngleThresholdDeg, setDeltaAngleThresholdDeg] = useState<number>(10.0); // max 10 deg

  // ---------------------------------------------------------------------------
  // 4. OPERATION MODES & LIVE ROTATION ENGINE
  // ---------------------------------------------------------------------------
  const [activePreset, setActivePreset] = useState<SynchroPresetType>('hydro_nachtigal');
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);
  const [autoArmClosing, setAutoArmClosing] = useState<boolean>(false);
  const [breakerClosed, setBreakerClosed] = useState<boolean>(false);

  // Live real-time phase angle delta (in degrees 0..360)
  const [currentAngleDeg, setCurrentAngleDeg] = useState<number>(45.0);
  const angleRef = useRef<number>(45.0);
  const lastTimeRef = useRef<number>(performance.now());
  const synchroscopeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Result of closing operation
  interface ClosureResult {
    timestamp: string;
    closedAtAngle: number;
    voltageMismatchPercent: number;
    frequencySlipHz: number;
    inrushCurrentKa: number;
    inrushCurrentPu: number;
    shockTorquePu: number;
    status: 'perfect' | 'acceptable' | 'warning' | 'catastrophic';
    message: string;
  }
  const [closureReport, setClosureReport] = useState<ClosureResult | null>(null);

  // ---------------------------------------------------------------------------
  // 5. CALCULATIONS
  // ---------------------------------------------------------------------------
  const deltaU_kv = Math.abs(genVoltageKv - gridVoltageKv);
  const deltaU_percent = gridVoltageKv > 0 ? (deltaU_kv / gridVoltageKv) * 100 : 0;
  const slipFrequencyHz = genFrequencyHz - gridFrequencyHz; // positive => generator faster
  const slipSpeedRpm = (slipFrequencyHz * 60) / 8; // assuming 8 pairs of poles (16 poles, 375 rpm hydro)

  // Breaker lead angle: delta_lead = 360 * slipFrequency * (breakerCloseTimeMs / 1000)
  const breakerLeadAngleDeg = 360 * slipFrequencyHz * (breakerCloseTimeMs / 1000);

  // Verification against ANSI 25 permissives
  const isVoltagePermitted = deltaU_percent <= deltaUThresholdPercent;
  const isFrequencyPermitted = Math.abs(slipFrequencyHz) <= deltaFThresholdHz;
  // Normalize angle to -180..+180
  const normalizedAngleDeg = ((angleRef.current + 180) % 360) - 180;
  const isAnglePermitted = Math.abs(normalizedAngleDeg) <= deltaAngleThresholdDeg;
  const isReadyToClose = isVoltagePermitted && isFrequencyPermitted && isAnglePermitted;

  // Three synchronizing lamps brightness (0..100)
  // Dark lamp method: connected across same phases L1-L1', L2-L2', L3-L3'
  // Lamp voltage V = 2 * V_ph * sin(delta / 2)
  const lampDarkBrightness = useMemo(() => {
    const rad = (angleRef.current * Math.PI) / 180;
    const factor = Math.abs(Math.sin(rad / 2));
    return Math.round(factor * 100);
  }, [currentAngleDeg]);

  // Bright lamp (cross-connected lamps L1-L2', L2-L3')
  const lampCross1Brightness = useMemo(() => {
    const rad = ((angleRef.current + 120) * Math.PI) / 180;
    const factor = Math.abs(Math.sin(rad / 2));
    return Math.round(factor * 100);
  }, [currentAngleDeg]);

  const lampCross2Brightness = useMemo(() => {
    const rad = ((angleRef.current - 120) * Math.PI) / 180;
    const factor = Math.abs(Math.sin(rad / 2));
    return Math.round(factor * 100);
  }, [currentAngleDeg]);

  // ---------------------------------------------------------------------------
  // 6. LIVE ANIMATION TICK
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isSimRunning && !breakerClosed) {
        // Delta angle evolves as: d(angle)/dt = 360 * slipFrequency
        const dAngle = 360 * slipFrequencyHz * dt;
        let newAngle = (angleRef.current + dAngle) % 360;
        if (newAngle < 0) newAngle += 360;
        angleRef.current = newAngle;
        setCurrentAngleDeg(newAngle);

        // In Auto-closing mode:
        // Trigger closing when angle + breakerLeadAngle passes near 0 degrees (360)
        if (autoArmClosing && isVoltagePermitted && isFrequencyPermitted) {
          const predictedAngleAtContact = (newAngle + breakerLeadAngleDeg) % 360;
          const normPred = ((predictedAngleAtContact + 180) % 360) - 180;
          if (Math.abs(normPred) < 1.5) {
            executeBreakerClose(predictedAngleAtContact);
            setAutoArmClosing(false);
          }
        }
      }

      animId = requestAnimationFrame(tick);
    };

    lastTimeRef.current = performance.now();
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isSimRunning, breakerClosed, slipFrequencyHz, autoArmClosing, breakerLeadAngleDeg, isVoltagePermitted, isFrequencyPermitted]);

  // ---------------------------------------------------------------------------
  // 7. BREAKER CLOSING LOGIC & STRESS ASSESSMENT
  // ---------------------------------------------------------------------------
  const executeBreakerClose = (effectiveAngleDeg: number) => {
    setBreakerClosed(true);

    const normAngle = ((effectiveAngleDeg + 180) % 360) - 180;
    const absNormAngle = Math.abs(normAngle);
    const rad = (normAngle * Math.PI) / 180;

    // Rated current In = S / (sqrt(3) * U)
    const ratedCurrentKa = machineRatedMva / (Math.sqrt(3) * gridVoltageNominalKv);

    // Vector voltage difference: |E - U|
    const deltaV_ph = Math.sqrt(
      Math.pow(genVoltageKv, 2) + Math.pow(gridVoltageKv, 2) - 2 * genVoltageKv * gridVoltageKv * Math.cos(rad)
    ) / Math.sqrt(3);

    // Total subtransient impedance in Ohms:
    // Z_base = U^2 / S_mva
    const zBase = Math.pow(gridVoltageNominalKv, 2) / machineRatedMva;
    const xTotalOhm = (xdDoublePrimePu + 0.05) * zBase; // include 0.05 pu external grid reactance

    // Inrush current peak
    const inrushCurrentKa = xTotalOhm > 0 ? (deltaV_ph / xTotalOhm) : 0;
    const inrushPu = inrushCurrentKa / ratedCurrentKa;

    // Synchronizing air-gap shock torque:
    // T_shock = (E * U / X) * sin(delta)
    const torqueShockPu = ((genVoltageKv * gridVoltageKv) / (Math.pow(gridVoltageNominalKv, 2) * (xdDoublePrimePu + 0.05))) * Math.sin(rad);
    const absTorquePu = Math.abs(torqueShockPu);

    let status: 'perfect' | 'acceptable' | 'warning' | 'catastrophic' = 'perfect';
    let message = '';

    if (absNormAngle <= 3.0 && deltaU_percent <= 2.0 && Math.abs(slipFrequencyHz) <= 0.05) {
      status = 'perfect';
      message = locale === 'fr' 
        ? 'Couplage Idéal ! Zéro à-coup mécanique sur l\'arbre. Entrée en réseau transparente.'
        : 'Ideal Paralleling! Zero mechanical shock on rotor shaft. Seamless grid tie-in.';
    } else if (absNormAngle <= deltaAngleThresholdDeg && isVoltagePermitted && isFrequencyPermitted) {
      status = 'acceptable';
      message = locale === 'fr'
        ? 'Synchronisation conforme ANSI 25. Léger transfert de puissance active initial acceptable.'
        : 'Compliant ANSI 25 sync. Minor initial active power surge within machine tolerance.';
    } else if (absNormAngle <= 30.0) {
      status = 'warning';
      message = locale === 'fr'
        ? 'Attention : Fort à-coup électromécanique (couple transitoire élevé). Fatigue prématurée des accouplements.'
        : 'Warning: Significant electromechanical surge. Premature mechanical fatigue on couplings.';
    } else {
      status = 'catastrophic';
      message = locale === 'fr'
        ? 'CATASTROPHE : Fermeture hors phase ! Déclenchement instantané ANSI 50/87G, risque de cisaillement de l\'arbre turbine et déformation des bobinages statoriques.'
        : 'CATASTROPHIC: Out-of-phase closure! ANSI 50/87G instant trip, risk of shaft coupling shearing and severe stator winding distortion.';
    }

    setClosureReport({
      timestamp: new Date().toLocaleTimeString(),
      closedAtAngle: Math.round(normAngle * 10) / 10,
      voltageMismatchPercent: Math.round(deltaU_percent * 10) / 10,
      frequencySlipHz: Math.round(slipFrequencyHz * 1000) / 1000,
      inrushCurrentKa: Math.round(inrushCurrentKa * 10) / 10,
      inrushCurrentPu: Math.round(inrushPu * 100) / 100,
      shockTorquePu: Math.round(absTorquePu * 100) / 100,
      status,
      message,
    });
  };

  const handleManualClose = () => {
    // Breaker has closing time delay! Real contact touches at angle + leadAngle
    const actualTouchAngle = (angleRef.current + breakerLeadAngleDeg) % 360;
    executeBreakerClose(actualTouchAngle);
  };

  const handleResetBreaker = () => {
    setBreakerClosed(false);
    setClosureReport(null);
    setAutoArmClosing(false);
  };

  // ---------------------------------------------------------------------------
  // 8. PRESET HANDLER
  // ---------------------------------------------------------------------------
  const applyPreset = (preset: SynchroPresetType) => {
    setActivePreset(preset);
    setBreakerClosed(false);
    setClosureReport(null);
    setAutoArmClosing(false);

    switch (preset) {
      case 'hydro_nachtigal':
        setGridVoltageNominalKv(15.0);
        setGridVoltageKv(15.0);
        setGridFrequencyHz(50.00);
        setGenVoltageKv(15.08); // +0.5%
        setGenFrequencyHz(50.06); // +0.06 Hz slow clockwise slip
        setMachineRatedMva(120);
        setXdDoublePrimePu(0.20);
        setBreakerCloseTimeMs(80);
        break;
      case 'gas_kribi':
        setGridVoltageNominalKv(11.0);
        setGridVoltageKv(10.95);
        setGridFrequencyHz(50.00);
        setGenVoltageKv(11.02);
        setGenFrequencyHz(50.08);
        setMachineRatedMva(50);
        setXdDoublePrimePu(0.16);
        setBreakerCloseTimeMs(70);
        break;
      case 'substation_intertie':
        setGridVoltageNominalKv(225.0);
        setGridVoltageKv(224.0);
        setGridFrequencyHz(50.00);
        setGenVoltageKv(225.5);
        setGenFrequencyHz(50.03); // very slow slip
        setMachineRatedMva(300);
        setXdDoublePrimePu(0.12);
        setBreakerCloseTimeMs(90);
        break;
      case 'severe_antiphase':
        setGridVoltageNominalKv(15.0);
        setGridVoltageKv(15.0);
        setGridFrequencyHz(50.00);
        setGenVoltageKv(15.0);
        setGenFrequencyHz(50.00); // static anti-phase
        angleRef.current = 180.0;
        setCurrentAngleDeg(180.0);
        setMachineRatedMva(120);
        setXdDoublePrimePu(0.20);
        setBreakerCloseTimeMs(80);
        break;
      case 'excessive_slip':
        setGridVoltageNominalKv(15.0);
        setGridVoltageKv(15.0);
        setGridFrequencyHz(50.00);
        setGenVoltageKv(15.8); // +5.3%
        setGenFrequencyHz(50.65); // high slip (+0.65 Hz)
        setMachineRatedMva(120);
        setXdDoublePrimePu(0.20);
        setBreakerCloseTimeMs(80);
        break;
    }
  };

  // ---------------------------------------------------------------------------
  // 9. CANVAS DRAWING: SYNCHROSCOPE DIAL
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = synchroscopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) - 24;

    ctx.clearRect(0, 0, width, height);

    // Outer Dark Bezel
    const gradBezel = ctx.createLinearGradient(0, 0, width, height);
    gradBezel.addColorStop(0, '#1E293B');
    gradBezel.addColorStop(0.5, '#0F172A');
    gradBezel.addColorStop(1, '#090D16');
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 14, 0, Math.PI * 2);
    ctx.fillStyle = gradBezel;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    // Inner Dial Face
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#070A11';
    ctx.fill();

    // Permitted Sync Green Sector at 12 o'clock (-deltaAngle .. +deltaAngle)
    const startAngleRad = ((-90 - deltaAngleThresholdDeg) * Math.PI) / 180;
    const endAngleRad = ((-90 + deltaAngleThresholdDeg) * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius - 6, startAngleRad, endAngleRad);
    ctx.closePath();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Tick marks around perimeter (every 30 deg and 10 deg)
    for (let deg = 0; deg < 360; deg += 10) {
      const isMajor = deg % 30 === 0;
      const tickAngle = ((deg - 90) * Math.PI) / 180;
      const innerR = isMajor ? radius - 16 : radius - 8;
      const outerR = radius - 2;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(tickAngle) * innerR, cy + Math.sin(tickAngle) * innerR);
      ctx.lineTo(cx + Math.cos(tickAngle) * outerR, cy + Math.sin(tickAngle) * outerR);
      ctx.strokeStyle = isMajor ? '#94A3B8' : '#334155';
      ctx.lineWidth = isMajor ? 2 : 1;
      ctx.stroke();
    }

    // Top Dead Center Marker (0 deg / Synchronism)
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius + 2);
    ctx.lineTo(cx - 7, cy - radius - 12);
    ctx.lineTo(cx + 7, cy - radius - 12);
    ctx.closePath();
    ctx.fill();

    // Direction indicators: SLOW (-) on left, FAST (+) on right
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#EF4444';
    ctx.fillText('◄ SLOW (-)', cx - radius * 0.55, cy - radius * 0.4);
    ctx.fillStyle = '#10B981';
    ctx.fillText('FAST (+) ►', cx + radius * 0.55, cy - radius * 0.4);

    // Cardinal Angle text
    ctx.fillStyle = '#64748B';
    ctx.font = '10px monospace';
    ctx.fillText('0°', cx, cy - radius + 22);
    ctx.fillText('180°', cx, cy + radius - 20);
    ctx.fillText('-90°', cx - radius + 24, cy);
    ctx.fillText('+90°', cx + radius - 24, cy);

    // Synchroscope Needle
    const needleAngleRad = ((currentAngleDeg - 90) * Math.PI) / 180;
    const needleLength = radius - 18;

    ctx.save();
    ctx.shadowColor = isReadyToClose ? '#10B981' : '#F59E0B';
    ctx.shadowBlur = isReadyToClose ? 14 : 6;

    ctx.beginPath();
    ctx.moveTo(cx - Math.sin(needleAngleRad) * 4, cy + Math.cos(needleAngleRad) * 4);
    ctx.lineTo(cx + Math.cos(needleAngleRad) * needleLength, cy + Math.sin(needleAngleRad) * needleLength);
    ctx.lineTo(cx + Math.sin(needleAngleRad) * 4, cy - Math.cos(needleAngleRad) * 4);
    ctx.closePath();
    ctx.fillStyle = isReadyToClose ? '#10B981' : '#F59E0B';
    ctx.fill();

    // Center Hub
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#E2E8F0';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#0F172A';
    ctx.fill();

    ctx.restore();

    // Digital Center readout
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = isReadyToClose ? '#34D399' : '#FBBF24';
    ctx.textAlign = 'center';
    const norm = Math.round((((currentAngleDeg + 180) % 360) - 180) * 10) / 10;
    ctx.fillText(`${norm > 0 ? '+' : ''}${norm}°`, cx, cy + 36);

    ctx.font = '10px monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(`Δf: ${slipFrequencyHz >= 0 ? '+' : ''}${slipFrequencyHz.toFixed(3)} Hz`, cx, cy + 52);
  }, [currentAngleDeg, deltaAngleThresholdDeg, isReadyToClose, slipFrequencyHz]);

  // ---------------------------------------------------------------------------
  // 10. CANVAS DRAWING: WAVEFORM SCOPE (GRID vs GENERATOR & BEAT ENVELOPE)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const midY = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Background & Grid
    ctx.fillStyle = '#070A11';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    // Horizontal center and limits
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.moveTo(0, midY - 45);
    ctx.lineTo(w, midY - 45);
    ctx.moveTo(0, midY + 45);
    ctx.lineTo(w, midY + 45);
    ctx.stroke();

    // Waveform plotting across 3 full cycles of 50 Hz (60 ms)
    const points = 240;
    const amplitude = 40;

    // 1. Grid Voltage Waveform (Amber) - Reference (phase = 0)
    ctx.beginPath();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    for (let i = 0; i < points; i++) {
      const x = (i / points) * w;
      const t = (i / points) * 3 * Math.PI * 2;
      const y = midY - Math.sin(t) * amplitude * (gridVoltageKv / gridVoltageNominalKv);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. Generator Voltage Waveform (Cyan) - Phase shifted by currentAngleDeg
    const deltaRad = (currentAngleDeg * Math.PI) / 180;
    ctx.beginPath();
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 2;
    for (let i = 0; i < points; i++) {
      const x = (i / points) * w;
      const t = (i / points) * 3 * Math.PI * 2;
      const y = midY - Math.sin(t + deltaRad) * amplitude * (genVoltageKv / gridVoltageNominalKv);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 3. Difference (Voltage Across Open Breaker Poles) - White dashed
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < points; i++) {
      const x = (i / points) * w;
      const t = (i / points) * 3 * Math.PI * 2;
      const uGrid = Math.sin(t) * (gridVoltageKv / gridVoltageNominalKv);
      const uGen = Math.sin(t + deltaRad) * (genVoltageKv / gridVoltageNominalKv);
      const diff = uGen - uGrid;
      const y = midY - diff * (amplitude * 0.6);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }, [currentAngleDeg, genVoltageKv, gridVoltageKv, gridVoltageNominalKv]);

  // ---------------------------------------------------------------------------
  // 11. EXPORT / COPY ENGINEERING REPORT
  // ---------------------------------------------------------------------------
  const [copied, setCopied] = useState<boolean>(false);
  const handleCopyReport = () => {
    const text = `
=== EPEDE ANSI 25 SYNCHROCHECK & GENERATOR PARALLELING REPORT ===
Date: ${new Date().toLocaleString()}
Standard Reference: CEI 60255-127 / IEEE C37.102 / IEEE 1547

[1. SYSTEM RATINGS]
Machine Rated Power: ${machineRatedMva} MVA
Nominal Busbar Voltage: ${gridVoltageNominalKv} kV
Subtransient Reactance X''d: ${xdDoublePrimePu} p.u.
Circuit Breaker Closing Advance: ${breakerCloseTimeMs} ms

[2. LIVE STATUS AT TEST/CLOSURE]
Grid Voltage (U_bus): ${gridVoltageKv.toFixed(2)} kV | Frequency: ${gridFrequencyHz.toFixed(2)} Hz
Generator Voltage (U_gen): ${genVoltageKv.toFixed(2)} kV | Frequency: ${genFrequencyHz.toFixed(2)} Hz
Voltage Difference ΔU: ${deltaU_kv.toFixed(3)} kV (${deltaU_percent.toFixed(2)}% - Threshold: ±${deltaUThresholdPercent}%) -> ${isVoltagePermitted ? 'PASSED' : 'BLOCKED'}
Frequency Slip Δf: ${slipFrequencyHz.toFixed(3)} Hz (Threshold: ±${deltaFThresholdHz} Hz) -> ${isFrequencyPermitted ? 'PASSED' : 'BLOCKED'}
Phase Angle Δδ: ${normalizedAngleDeg.toFixed(1)}° (Threshold: ±${deltaAngleThresholdDeg}°) -> ${isAnglePermitted ? 'PASSED' : 'BLOCKED'}
Breaker Lead Angle (Advance): ${breakerLeadAngleDeg.toFixed(1)}°
ANSI 25 Permissive Status: ${isReadyToClose ? 'PERMITTED (ARMED)' : 'INTERLOCKED (INHIBITED)'}

${closureReport ? `
[3. BREAKER CLOSURE TRANSIENT EVALUATION]
Status: ${closureReport.status.toUpperCase()}
Closure Angle: ${closureReport.closedAtAngle}°
Inrush Current: ${closureReport.inrushCurrentKa} kA (${closureReport.inrushCurrentPu} × In)
Air-Gap Torque Shock: ${closureReport.shockTorquePu} × Tn
Diagnosis: ${closureReport.message}
` : '[3. BREAKER STATUS]: OPEN / SYNCHROCHECK IN PROGRESS'}
=================================================================
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Standard Badges */}
      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Compass className="h-5 w-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black font-mono text-white tracking-wide">
                  {locale === 'fr' 
                    ? 'Synchronisation & Couplage Alternateur Réseau (ANSI 25)' 
                    : 'Synchrocheck & Generator Paralleling Lab (ANSI 25)'}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CEI 60255-127
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  IEEE C37.102
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? 'Modélisation interactive des 3 conditions de synchronisme (ΔU, Δf, Δδ), synchroscope analogique, méthode des feux sombres et calcul des chocs de couple électromécaniques en cas de fausse manoeuvre.'
                  : 'Interactive modeling of the 3 paralleling conditions (ΔU, Δf, Δδ), analog synchroscope, dark-lamp method, and mechanical shock torque transients from out-of-phase closure.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyReport}
              className="px-3 py-1.5 rounded-lg bg-[#162238] hover:bg-[#1E2E4A] text-neutral-300 hover:text-white font-mono text-xs flex items-center gap-1.5 border border-[#2A3B57] transition-all"
            >
              <Copy className="h-3.5 w-3.5 text-cyan-400" />
              <span>{copied ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Rapport ANSI 25' : 'ANSI 25 Report')}</span>
            </button>
          </div>
        </div>

        {/* Preset Scenarios Selector */}
        <div className="pt-4 flex items-center flex-wrap gap-2">
          <span className="text-xs font-mono text-neutral-400 mr-2 flex items-center gap-1">
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span>{locale === 'fr' ? 'Scénarios Préréglés :' : 'Preset Scenarios :'}</span>
          </span>

          {[
            { id: 'hydro_nachtigal', labelFr: 'Hydro Nachtigal 120 MVA (15 kV)', labelEn: 'Nachtigal Hydro 120 MVA (15 kV)' },
            { id: 'gas_kribi', labelFr: 'Turbine Gaz Kribi 50 MVA (11 kV)', labelEn: 'Kribi Gas Turbine 50 MVA (11 kV)' },
            { id: 'substation_intertie', labelFr: 'Interconnexion Lignes 225 kV', labelEn: '225 kV Line Intertie' },
            { id: 'severe_antiphase', labelFr: '⚠️ Opposition de Phase (180°)', labelEn: '⚠️ 180° Anti-Phase Disaster' },
            { id: 'excessive_slip', labelFr: '⚠️ Glissement Excessif (+0.65 Hz)', labelEn: '⚠️ Excessive Slip (+0.65 Hz)' },
          ].map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => applyPreset(sc.id as SynchroPresetType)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                activePreset === sc.id
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-sm'
                  : 'bg-[#0E1524] border-[#1E293B] text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {locale === 'fr' ? sc.labelFr : sc.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Synchroscope & Synchronizing Lamps (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Synchroscope Instrument Dial */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'SYNCHROSCOPE ANALOGIQUE' : 'ANALOG SYNCHROSCOPE'}</span>
              </span>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded border font-bold ${
                isReadyToClose
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {isReadyToClose 
                  ? (locale === 'fr' ? 'ZONE COUPLAGE AUTORISÉE' : 'CLOSING ZONE PERMITTED')
                  : (locale === 'fr' ? 'INTERDICTION COUPLAGE' : 'CLOSING INHIBITED')}
              </span>
            </div>

            <canvas
              ref={synchroscopeCanvasRef}
              width={300}
              height={300}
              className="w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] rounded-full my-2 shadow-2xl"
            />

            {/* Slip Rotation Speed Telemetry */}
            <div className="w-full grid grid-cols-2 gap-2 mt-2 font-mono text-xs text-center">
              <div className="bg-[#070A11] p-2 rounded-lg border border-[#1E293B]">
                <span className="text-[9px] text-neutral-500 block">VITESSE ROTATION AIGUILLE</span>
                <span className={`font-bold ${slipFrequencyHz >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {Math.abs(slipFrequencyHz * 60).toFixed(1)} tr/min (synchro)
                </span>
              </div>
              <div className="bg-[#070A11] p-2 rounded-lg border border-[#1E293B]">
                <span className="text-[9px] text-neutral-500 block">AVANCE DISJONCTEUR (80 ms)</span>
                <span className="font-bold text-cyan-400">
                  {breakerLeadAngleDeg >= 0 ? `+${breakerLeadAngleDeg.toFixed(1)}°` : `${breakerLeadAngleDeg.toFixed(1)}°`}
                </span>
              </div>
            </div>
          </div>

          {/* Synchronizing Lamps (Dark & Bright Lamp Method) */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <h3 className="font-mono text-xs font-bold text-neutral-200 uppercase">
                  {locale === 'fr' ? 'MÉTHODE DES LAMPES DE SYNCHRONISATION' : 'SYNCHRONIZING LAMPS METHOD'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                {locale === 'fr' ? 'Feux sombres L1 / Croisés L2-L3' : 'Dark L1 / Crossed L2-L3'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center font-mono">
              {/* Lamp 1 (Dark lamp - Phase L1 to L1') */}
              <div className="bg-[#070A11] p-3 rounded-xl border border-[#1E293B] flex flex-col items-center">
                <span className="text-[10px] text-neutral-400 mb-2">LAMPE 1 (L1-L1')</span>
                <div 
                  className="h-10 w-10 rounded-full border-2 border-neutral-700 transition-all duration-75 flex items-center justify-center shadow-lg"
                  style={{
                    backgroundColor: `rgba(251, 191, 36, ${lampDarkBrightness / 100})`,
                    boxShadow: lampDarkBrightness > 10 ? `0 0 ${lampDarkBrightness / 4}px rgba(251, 191, 36, 0.8)` : 'none'
                  }}
                >
                  <Lightbulb className={`h-5 w-5 ${lampDarkBrightness < 15 ? 'text-neutral-600' : 'text-amber-950'}`} />
                </div>
                <span className="text-[10px] font-bold text-amber-300 mt-2">
                  {lampDarkBrightness < 10 ? (locale === 'fr' ? 'ÉTEINTE (0°)' : 'DARK (0°)') : `${lampDarkBrightness}%`}
                </span>
              </div>

              {/* Lamp 2 (Crossed - L2 to L3') */}
              <div className="bg-[#070A11] p-3 rounded-xl border border-[#1E293B] flex flex-col items-center">
                <span className="text-[10px] text-neutral-400 mb-2">LAMPE 2 (L2-L3')</span>
                <div 
                  className="h-10 w-10 rounded-full border-2 border-neutral-700 transition-all duration-75 flex items-center justify-center shadow-lg"
                  style={{
                    backgroundColor: `rgba(251, 191, 36, ${lampCross1Brightness / 100})`,
                    boxShadow: lampCross1Brightness > 10 ? `0 0 ${lampCross1Brightness / 4}px rgba(251, 191, 36, 0.8)` : 'none'
                  }}
                >
                  <Lightbulb className={`h-5 w-5 ${lampCross1Brightness < 15 ? 'text-neutral-600' : 'text-amber-950'}`} />
                </div>
                <span className="text-[10px] font-bold text-amber-300 mt-2">{lampCross1Brightness}%</span>
              </div>

              {/* Lamp 3 (Crossed - L3 to L2') */}
              <div className="bg-[#070A11] p-3 rounded-xl border border-[#1E293B] flex flex-col items-center">
                <span className="text-[10px] text-neutral-400 mb-2">LAMPE 3 (L3-L2')</span>
                <div 
                  className="h-10 w-10 rounded-full border-2 border-neutral-700 transition-all duration-75 flex items-center justify-center shadow-lg"
                  style={{
                    backgroundColor: `rgba(251, 191, 36, ${lampCross2Brightness / 100})`,
                    boxShadow: lampCross2Brightness > 10 ? `0 0 ${lampCross2Brightness / 4}px rgba(251, 191, 36, 0.8)` : 'none'
                  }}
                >
                  <Lightbulb className={`h-5 w-5 ${lampCross2Brightness < 15 ? 'text-neutral-600' : 'text-amber-950'}`} />
                </div>
                <span className="text-[10px] font-bold text-amber-300 mt-2">{lampCross2Brightness}%</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              {locale === 'fr'
                ? 'Au synchronisme exact (Δδ = 0°), la lampe 1 (feux sombres) est totalement éteinte, tandis que les lampes 2 et 3 brillent avec la même intensité.'
                : 'At exact synchronism (Δδ = 0°), lamp 1 (dark lamp) is fully extinguished, while lamps 2 and 3 glow with identical maximum brightness.'}
            </p>
          </div>
        </div>

        {/* Right Column: Comparative Gauges, Waveform Scope & Breaker Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Dual Voltmeter & Dual Frequencymeter Instrumentation */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-mono text-xs font-bold text-neutral-200 uppercase flex items-center justify-between">
              <span>{locale === 'fr' ? 'INSTRUMENTATION COMPARATIVE : RÉSEAU vs ALTERNATEUR' : 'COMPARATIVE GAUGES: GRID BUS vs GENERATOR'}</span>
              <span className="text-[10px] text-cyan-400 font-bold">ANSI 25 CHECK</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              {/* Voltages Card */}
              <div className="bg-[#070A11] p-4 rounded-xl border border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">TENSION LIGNE (U)</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isVoltagePermitted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    ΔU: {deltaU_percent.toFixed(2)}% (Max ±{deltaUThresholdPercent}%)
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-bold">U_Réseau (Bus):</span>
                    <span className="text-amber-300 font-bold">{gridVoltageKv.toFixed(2)} kV</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-400 font-bold">U_Alternateur (Gen):</span>
                    <span className="text-cyan-300 font-bold">{genVoltageKv.toFixed(2)} kV</span>
                  </div>
                </div>

                {/* Slider for Generator Voltage (AVR adjustment) */}
                <div className="pt-2 border-t border-[#1E293B]">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'RÉGULATION TENSION AVR (kV)' : 'AVR VOLTAGE REGULATOR (kV)'}</span>
                    <span className="text-cyan-400 font-bold">{genVoltageKv.toFixed(2)} kV</span>
                  </div>
                  <input
                    type="range"
                    min={gridVoltageNominalKv * 0.85}
                    max={gridVoltageNominalKv * 1.15}
                    step={0.05}
                    value={genVoltageKv}
                    disabled={breakerClosed}
                    onChange={(e) => setGenVoltageKv(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Frequencies Card */}
              <div className="bg-[#070A11] p-4 rounded-xl border border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">FRÉQUENCE (f)</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isFrequencyPermitted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    Δf: {slipFrequencyHz >= 0 ? '+' : ''}{slipFrequencyHz.toFixed(3)} Hz (Max ±{deltaFThresholdHz} Hz)
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-bold">f_Réseau:</span>
                    <span className="text-amber-300 font-bold">{gridFrequencyHz.toFixed(2)} Hz</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-400 font-bold">f_Alternateur:</span>
                    <span className="text-cyan-300 font-bold">{genFrequencyHz.toFixed(3)} Hz</span>
                  </div>
                </div>

                {/* Slider for Generator Frequency (Governor Speed adjustment) */}
                <div className="pt-2 border-t border-[#1E293B]">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'RÉGULATEUR DE VITESSE TURBINE (Hz)' : 'TURBINE SPEED GOVERNOR (Hz)'}</span>
                    <span className="text-cyan-400 font-bold">{genFrequencyHz.toFixed(3)} Hz</span>
                  </div>
                  <input
                    type="range"
                    min={49.00}
                    max={51.00}
                    step={0.01}
                    value={genFrequencyHz}
                    disabled={breakerClosed}
                    onChange={(e) => setGenFrequencyHz(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Oscilloscope Waveform Comparison Canvas */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-neutral-300 uppercase flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'OSCILLOSCOPE DE BATTEMENT TENSIONEL' : 'VOLTAGE BEAT OSCILLOSCOPE'}</span>
              </span>
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span>U_Réseau</span>
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span>U_Alternateur</span>
                </span>
                <span className="flex items-center gap-1 text-neutral-300">
                  <span className="h-0.5 w-3 border-t border-dashed border-white" />
                  <span>Δu(t) Pôles</span>
                </span>
              </div>
            </div>

            <canvas
              ref={waveformCanvasRef}
              width={600}
              height={140}
              className="w-full h-[140px] rounded-xl border border-[#1E293B]"
            />
          </div>

          {/* Breaker Operation Controls & Auto-Synchronizer */}
          <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <h3 className="font-mono text-xs font-bold text-neutral-200 uppercase">
                  {locale === 'fr' ? 'COMMANDE ENCLENCHEMENT DISJONCTEUR 52G' : '52G GENERATOR BREAKER CLOSE CONTROLS'}
                </h3>
              </div>

              {/* Mode Toggle: Manual vs Auto */}
              <div className="flex items-center bg-[#070A11] p-1 rounded-lg border border-[#1E293B] font-mono text-xs">
                <button
                  type="button"
                  onClick={() => { setMode('manual'); setAutoArmClosing(false); }}
                  className={`px-3 py-1 rounded transition-all ${
                    mode === 'manual'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {locale === 'fr' ? 'Manuel Opérateur' : 'Manual Operator'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('auto')}
                  className={`px-3 py-1 rounded transition-all ${
                    mode === 'auto'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {locale === 'fr' ? 'Automatique (ANSI 25)' : 'Auto-Synchro (ANSI 25)'}
                </button>
              </div>
            </div>

            {/* Breaker Status Banner */}
            <div className={`p-4 rounded-xl border font-mono flex items-center justify-between ${
              breakerClosed
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-[#070A11] border-[#1E293B] text-neutral-300'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${breakerClosed ? 'bg-emerald-400 animate-ping' : 'bg-neutral-600'}`} />
                <div>
                  <span className="font-bold text-sm block">
                    {breakerClosed 
                      ? (locale === 'fr' ? 'DISJONCTEUR FERMÉ · MACHINE EN RÉSEAU' : 'BREAKER CLOSED · GENERATOR ON GRID')
                      : (locale === 'fr' ? 'DISJONCTEUR OUVERT · SYNCHRONISATION ACTIVE' : 'BREAKER OPEN · PARALLELING ACTIVE')}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {mode === 'manual' 
                      ? (locale === 'fr' ? 'Prise en compte avance mécanique (80 ms)' : 'Breaker mechanical advance accounted (80 ms)')
                      : (locale === 'fr' ? 'Asservissement prédictif ANSI 25' : 'Predictive lead angle firing ANSI 25')}
                  </span>
                </div>
              </div>

              {breakerClosed ? (
                <button
                  type="button"
                  onClick={handleResetBreaker}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Ouvrir / Réinitialiser' : 'Open / Reset'}</span>
                </button>
              ) : mode === 'manual' ? (
                <button
                  type="button"
                  onClick={handleManualClose}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <Zap className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'ENCLENCHER DISJONCTEUR' : 'CLOSE BREAKER NOW'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setAutoArmClosing((prev) => !prev)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
                    autoArmClosing
                      ? 'bg-cyan-500 text-neutral-950 shadow-cyan-500/30 animate-pulse'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                  }`}
                >
                  <Timer className="h-4 w-4" />
                  <span>
                    {autoArmClosing 
                      ? (locale === 'fr' ? 'ATTENTE COUPLAGE OPTIMAL...' : 'WAITING FOR SYNC...')
                      : (locale === 'fr' ? 'ARMER AUTO-SYNCHRO' : 'ARM AUTO-SYNCHRO')}
                  </span>
                </button>
              )}
            </div>

            {/* Post-Closure Stress Diagnostic Card */}
            {closureReport && (
              <div className={`p-4 rounded-xl border font-mono space-y-3 animate-in fade-in duration-300 ${
                closureReport.status === 'perfect' 
                  ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-200'
                  : closureReport.status === 'acceptable'
                  ? 'bg-cyan-950/20 border-cyan-500/50 text-cyan-200'
                  : closureReport.status === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/50 text-amber-200'
                  : 'bg-rose-950/30 border-rose-500/60 text-rose-200'
              }`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {closureReport.status === 'catastrophic' ? (
                      <ShieldAlert className="h-4 w-4 text-rose-400" />
                    ) : closureReport.status === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    )}
                    <span>{closureReport.message}</span>
                  </div>
                  <span className="text-[10px] opacity-75">{closureReport.timestamp}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-black/30 p-2 rounded-lg">
                    <span className="text-[9px] opacity-75 block">ANGLE CONTACT RÉEL</span>
                    <span className="font-bold">{closureReport.closedAtAngle > 0 ? `+${closureReport.closedAtAngle}°` : `${closureReport.closedAtAngle}°`}</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg">
                    <span className="text-[9px] opacity-75 block">ÉCART TENSION (ΔU)</span>
                    <span className="font-bold">{closureReport.voltageMismatchPercent}%</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg">
                    <span className="text-[9px] opacity-75 block">COURANT APPEL (I_inrush)</span>
                    <span className="font-bold">{closureReport.inrushCurrentKa} kA ({closureReport.inrushCurrentPu} × In)</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg">
                    <span className="text-[9px] opacity-75 block">CHOC DE COUPLE (T_shock)</span>
                    <span className="font-bold">{closureReport.shockTorquePu} × Tn</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Educational Engineering Accordion / Standards Card */}
      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="font-mono text-sm font-bold text-white uppercase flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-cyan-400" />
          <span>{locale === 'fr' ? 'FONDEMENTS ÉLECTROTECHNIQUES : LE COUPLAGE D\'UNE MACHINE SYNCHRONE' : 'ELECTROTECHNICAL FOUNDATIONS: SYNCHRONOUS MACHINE PARALLELING'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-[#070A11] p-4 rounded-xl border border-[#1E293B] space-y-2">
            <span className="text-cyan-400 font-bold block">1. Égalité des Tensions (ΔU ≤ 2-5%)</span>
            <p className="text-neutral-400 leading-relaxed font-sans text-xs">
              {locale === 'fr'
                ? 'Un écart de tension induit un transfert immédiat de puissance réactive (Q). Si U_gen > U_bus, la machine fournit du réactif (surexcitée). Si U_gen < U_bus, elle en absorbe (sous-excitée, risque ANSI 40).'
                : 'A voltage discrepancy causes an instantaneous surge of reactive power (Q). If U_gen > U_bus, the machine injects VARs. If U_gen < U_bus, it absorbs VARs (underexcited, ANSI 40 trip risk).'}
            </p>
          </div>

          <div className="bg-[#070A11] p-4 rounded-xl border border-[#1E293B] space-y-2">
            <span className="text-amber-400 font-bold block">2. Égalité des Fréquences (Δf ≤ 0.10 Hz)</span>
            <p className="text-neutral-400 leading-relaxed font-sans text-xs">
              {locale === 'fr'
                ? 'Un glissement résiduel positif (+0.05 Hz) est recommandé pour assurer que l\'alternateur prenne immédiatement une petite charge active motrice dès la fermeture, évitant le retour d\'énergie (ANSI 32R).'
                : 'A slight positive slip (+0.05 Hz) is recommended so the incoming generator smoothly picks up initial motorizing active power rather than reverse motoring (ANSI 32R).'}
            </p>
          </div>

          <div className="bg-[#070A11] p-4 rounded-xl border border-[#1E293B] space-y-2">
            <span className="text-emerald-400 font-bold block">3. Concordance de Phase (Δδ ≤ 10°) & Avance</span>
            <p className="text-neutral-400 leading-relaxed font-sans text-xs">
              {locale === 'fr'
                ? 'Le disjoncteur met 60 à 100 ms pour fermer ses contacts mécaniques. Le relais ANSI 25 doit anticiper cet angle d\'avance (Δδ_lead = 360 × fs × t_close) pour que le contact physique se fasse exactement à 0°.'
                : 'Circuit breakers require 60 to 100 ms to mechanically engage contacts. Relay ANSI 25 must calculate lead advance (Δδ_lead = 360 × fs × t_close) so physical contact touches at exactly 0°.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
