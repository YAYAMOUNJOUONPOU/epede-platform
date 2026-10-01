// src/components/simulation/modules/DirectionalEarthFaultTab.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Compass, 
  Activity, 
  Zap, 
  Layers,
  RotateCcw
} from 'lucide-react';

interface DirectionalEarthFaultTabProps {
  locale: 'fr' | 'en';
}

export type NeutralRegime = 'isolated' | 'resistor' | 'solid' | 'petersen';

export const DirectionalEarthFaultTab: React.FC<DirectionalEarthFaultTabProps> = ({ locale }) => {
  // -------------------------------------------------------------
  // 1. GRID & NEUTRAL SYSTEM PARAMETERS
  // -------------------------------------------------------------
  const [neutralRegime, setNeutralRegime] = useState<NeutralRegime>('resistor');
  const [unKv, setUnKv] = useState<number>(30); // 30 kV (Line-to-Line)
  const [gridCapacitiveCurrentA, setGridCapacitiveCurrentA] = useState<number>(45); // Total network Ic0 (A)
  const [neutralResistanceOhm, setNeutralResistanceOhm] = useState<number>(40); // Rn (Ohms)
  const [faultResistanceRf, setFaultResistanceRf] = useState<number>(10); // Rf (Ohms)
  const [petersenDetuningPct, setPetersenDetuningPct] = useState<number>(0); // Detuning % (-20% to +20%)

  // -------------------------------------------------------------
  // 2. ANSI 67N / 59N RELAY SETTINGS
  // -------------------------------------------------------------
  const [v0PickupThresholdV, setV0PickupThresholdV] = useState<number>(15); // 3V0 threshold (5V to 50V secondary, e.g. 15V)
  const [i0PickupThresholdA, setI0PickupThresholdA] = useState<number>(5); // 3I0 threshold (1A to 50A primary)
  const [relayRcaDeg, setRelayRcaDeg] = useState<number>(0); // Relay Characteristic Angle (-90 to +90)
  const [sectorAngleDeg, setSectorAngleDeg] = useState<number>(85); // Trip sector half-width (+/-85 deg)

  // -------------------------------------------------------------
  // 3. FAULT LOCATION & FEEDER CONTEXT
  // -------------------------------------------------------------
  const [activeFeeder, setActiveFeeder] = useState<'faulty_f1' | 'healthy_f2'>('faulty_f1');
  const [faultPhase, setFaultPhase] = useState<'A' | 'B' | 'C'>('A');

  // Canvases
  const polarScopeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const voltageShiftCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Electrical computations
  const vPhNomKv = unKv / Math.sqrt(3); // Line-to-Neutral nominal (kV)
  const omega = 2 * Math.PI * 50; // 50 Hz

  // Equivalent neutral admittance (Yn = Gn + jBn)
  let gn = 0; // S
  let bn = 0; // S
  let rnEffective = 0; // Ohms

  if (neutralRegime === 'solid') {
    rnEffective = 0.5; // Very small resistance
    gn = 1 / rnEffective;
  } else if (neutralRegime === 'resistor') {
    rnEffective = neutralResistanceOhm;
    gn = 1 / rnEffective;
  } else if (neutralRegime === 'petersen') {
    // Petersen coil inductance compensates total grid capacitance (3 C0 omega)
    const iCompensated = gridCapacitiveCurrentA * (1 + petersenDetuningPct / 100);
    const coilCurrentAtVn = iCompensated; // At rated Vn
    bn = -coilCurrentAtVn / (vPhNomKv * 1000); // Inductive admittance (negative susceptance)
    gn = 0.03 * Math.abs(bn); // 3% active coil losses
  } else {
    // Isolated neutral
    gn = 0;
    bn = 0;
  }

  // Network total zero-sequence capacitive admittance (3 * C0 * omega)
  const b0Grid = gridCapacitiveCurrentA / (vPhNomKv * 1000); // S

  // Total zero-sequence admittance connected to neutral: Y0 = Gn + j(Bn + B0_grid)
  const y0Real = gn;
  const y0Imag = bn + b0Grid;

  // Single-phase fault impedance Zf = Rf
  const zf = faultResistanceRf;

  // Residual voltage 3V0 under single line to ground fault
  // 3V0 = -3 * Vph / (1 + 3 * Zf * Y0)
  const denomReal = 1 + 3 * zf * y0Real;
  const denomImag = 3 * zf * y0Imag;
  const denomMagSq = denomReal * denomReal + denomImag * denomImag;

  const v0MagKv = vPhNomKv / Math.sqrt(denomMagSq); // V0 magnitude in kV
  const v0PhaseRad = Math.PI - Math.atan2(denomImag, denomReal); // V0 phase angle
  const threeV0Volts = v0MagKv * 1000 * 3; // 3V0 in Volts primary
  const threeV0SecondaryVolts = (threeV0Volts / (unKv * 1000 / Math.sqrt(3))) * 100 / Math.sqrt(3); // On 100V / sqrt(3) secondary

  // Feeder Zero-sequence Current 3I0
  // Feeder 1 (Faulty feeder): Sees current returning through all other healthy feeders + neutral
  // 3I0_faulty = - (Yn + j B0_other_feeders) * 3V0
  // Assuming Feeder 1 represents 30% of network capacitance, other feeders represent 70%
  const f1CapShare = 0.30;
  const otherCapShare = 0.70;

  let threeI0Real = 0;
  let threeI0Imag = 0;

  if (activeFeeder === 'faulty_f1') {
    // Faulty feeder carries sum of neutral current + other healthy feeders capacitive current
    // I_faulty = V0 * (Yn + j * otherCapShare * B0_grid)
    const ynReal = gn;
    const ynImag = bn + otherCapShare * b0Grid;
    const v0x = v0MagKv * 1000 * Math.cos(v0PhaseRad);
    const v0y = v0MagKv * 1000 * Math.sin(v0PhaseRad);

    // Multiply complex: (v0x + j v0y) * (ynReal + j ynImag)
    threeI0Real = v0x * ynReal - v0y * ynImag;
    threeI0Imag = v0x * ynImag + v0y * ynReal;
  } else {
    // Healthy feeder 2 carries only its own capacitive charging current: I_healthy = - j * f2Cap * B0 * V0
    const f2CapShare = 0.25;
    const v0x = v0MagKv * 1000 * Math.cos(v0PhaseRad);
    const v0y = v0MagKv * 1000 * Math.sin(v0PhaseRad);

    threeI0Real = (v0y * f2CapShare * b0Grid);
    threeI0Imag = (-v0x * f2CapShare * b0Grid);
  }

  const threeI0MagA = Math.sqrt(threeI0Real * threeI0Real + threeI0Imag * threeI0Imag);
  const threeI0PhaseDeg = (Math.atan2(threeI0Imag, threeI0Real) * 180) / Math.PI;

  // Polarizing angle reference (3V0 angle)
  const threeV0PhaseDeg = (v0PhaseRad * 180) / Math.PI;

  // Angular difference between 3I0 and 3V0
  let deltaPhiDeg = (threeI0PhaseDeg - threeV0PhaseDeg) % 360;
  if (deltaPhiDeg > 180) deltaPhiDeg -= 360;
  if (deltaPhiDeg < -180) deltaPhiDeg += 360;

  // Angle relative to Relay Characteristic Angle (RCA)
  let angleRelRca = (deltaPhiDeg - relayRcaDeg) % 360;
  if (angleRelRca > 180) angleRelRca -= 360;
  if (angleRelRca < -180) angleRelRca += 360;

  // Relay trip condition:
  // 1. 3V0 magnitude exceeds pickup: threeV0SecondaryVolts >= v0PickupThresholdV
  // 2. 3I0 magnitude exceeds pickup: threeI0MagA >= i0PickupThresholdA
  // 3. Angle inside trip sector: |angleRelRca| <= sectorAngleDeg
  const isV0Pickup = threeV0SecondaryVolts >= v0PickupThresholdV;
  const isI0Pickup = threeI0MagA >= i0PickupThresholdA;
  const isSectorMatch = Math.abs(angleRelRca) <= sectorAngleDeg;

  let relayStatus: {
    state: 'TRIP_FORWARD' | 'BLOCK_REVERSE' | 'BELOW_THRESHOLD';
    label: string;
    color: string;
    description: string;
  };

  if (!isV0Pickup) {
    relayStatus = {
      state: 'BELOW_THRESHOLD',
      label: locale === 'fr' ? 'VEILLE — TENSION RÉSIDUELLE 3V0 INSUFFISANTE' : 'STANDBY — RESIDUAL VOLTAGE 3V0 BELOW PICKUP',
      color: '#64748B',
      description: locale === 'fr' 
        ? `3V0 (${threeV0SecondaryVolts.toFixed(1)} V sec) < Seuil d'activation (${v0PickupThresholdV} V sec). Aucun défaut d'isolement significatif détecté.`
        : `3V0 (${threeV0SecondaryVolts.toFixed(1)} V sec) < Pickup threshold (${v0PickupThresholdV} V sec). No significant ground fault.`
    };
  } else if (!isI0Pickup) {
    relayStatus = {
      state: 'BELOW_THRESHOLD',
      label: locale === 'fr' ? 'VEILLE — COURANT RÉSIDUEL 3I0 INFÉRIEUR AU SEUIL' : 'STANDBY — RESIDUAL CURRENT 3I0 BELOW PICKUP',
      color: '#F59E0B',
      description: locale === 'fr'
        ? `3V0 actif (${threeV0SecondaryVolts.toFixed(1)} V) mais 3I0 (${threeI0MagA.toFixed(1)} A) < Seuil départ (${i0PickupThresholdA} A). Défaut d'isolement sur autre départ ou courant très faible.`
        : `3V0 active (${threeV0SecondaryVolts.toFixed(1)} V) but 3I0 (${threeI0MagA.toFixed(1)} A) < Feeder pickup (${i0PickupThresholdA} A). Low residual current.`
    };
  } else if (isSectorMatch) {
    relayStatus = {
      state: 'TRIP_FORWARD',
      label: locale === 'fr' ? 'DÉCLENCHEMENT SÉLECTIF DIRECTIONNEL AVANT (ANSI 67N)' : 'FORWARD DIRECTIONAL TRIP (ANSI 67N)',
      color: '#EF4444',
      description: locale === 'fr'
        ? `Défaut à la terre sur CE départ (${activeFeeder === 'faulty_f1' ? 'Départ F1' : 'Départ F2'}). Angle relatif (${angleRelRca.toFixed(0)}°) dans le secteur déclencheur (+/-${sectorAngleDeg}°). Ordre d'ouverture disjoncteur émis.`
        : `Earth fault on THIS feeder (${activeFeeder === 'faulty_f1' ? 'Feeder F1' : 'Feeder F2'}). Relative angle (${angleRelRca.toFixed(0)}°) within trip sector (+/-${sectorAngleDeg}°). Trip signal issued.`
    };
  } else {
    relayStatus = {
      state: 'BLOCK_REVERSE',
      label: locale === 'fr' ? 'BLOCAGE DIRECTIONNEL ARRIÈRE (ANSI 67N ARRIÈRE)' : 'REVERSE DIRECTIONAL BLOCK (ANSI 67N REVERSE)',
      color: '#06B6D4',
      description: locale === 'fr'
        ? `Défaut situé en ARRIÈRE ou sur un AUTRE départ du poste. Le courant capacitif 3I0 s'écoule en sens inverse. Blocage sélectif du départ sain garanti.`
        : `Fault is located in REVERSE direction on another feeder. Capacitive current flows backwards. Healthy feeder is selectively blocked.`
    };
  }

  // Phase voltages under fault (Healthy phase overvoltage calculation)
  // Phase A faulted: VA = Vph - V0
  // Phase B: VB = Vph * e^(-j120) - V0
  // Phase C: VC = Vph * e^(+j120) - V0
  const vaMag = Math.max(0.1, vPhNomKv - v0MagKv * Math.cos(v0PhaseRad));
  const vbMag = Math.sqrt(
    Math.pow(vPhNomKv * Math.cos(-2 * Math.PI / 3) - v0MagKv * Math.cos(v0PhaseRad), 2) +
    Math.pow(vPhNomKv * Math.sin(-2 * Math.PI / 3) - v0MagKv * Math.sin(v0PhaseRad), 2)
  );
  const vcMag = Math.sqrt(
    Math.pow(vPhNomKv * Math.cos(2 * Math.PI / 3) - v0MagKv * Math.cos(v0PhaseRad), 2) +
    Math.pow(vPhNomKv * Math.sin(2 * Math.PI / 3) - v0MagKv * Math.sin(v0PhaseRad), 2)
  );

  // Overvoltage factor on healthy phases
  const healthyOvervoltageRatio = Math.max(vbMag, vcMag) / vPhNomKv;

  // Preset switch
  const applyPreset = (reg: NeutralRegime) => {
    setNeutralRegime(reg);
    if (reg === 'isolated') {
      setRelayRcaDeg(-90); // Capacitive current leads V0
      setV0PickupThresholdV(15);
      setI0PickupThresholdA(4);
      setNeutralResistanceOhm(10000);
      setFaultResistanceRf(5);
    } else if (reg === 'resistor') {
      setRelayRcaDeg(0); // Resistive in-phase with V0
      setV0PickupThresholdV(12);
      setI0PickupThresholdA(10);
      setNeutralResistanceOhm(40);
      setFaultResistanceRf(10);
    } else if (reg === 'petersen') {
      setRelayRcaDeg(0); // Wattmetric active residual
      setV0PickupThresholdV(15);
      setI0PickupThresholdA(2);
      setPetersenDetuningPct(0);
      setFaultResistanceRf(15);
    } else if (reg === 'solid') {
      setRelayRcaDeg(0);
      setV0PickupThresholdV(5);
      setI0PickupThresholdA(100);
      setNeutralResistanceOhm(0.5);
      setFaultResistanceRf(2);
    }
  };

  // Canvas 1: Directional Polar Scope (3V0 Polarizing vector + 3I0 Operating vector)
  useEffect(() => {
    const canvas = polarScopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerW = canvas.parentElement?.clientWidth;
    const w = (canvas.width = Math.max(320, containerW && containerW > 50 ? containerW : 550));
    const h = (canvas.height = 360);

    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.48;
    const cy = h * 0.50;
    const rMax = Math.min(cx - 30, cy - 35);

    // Concentric grid circles
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(37, 46, 56, 0.7)';
    for (let r = 0.25; r <= 1.0; r += 0.25) {
      ctx.beginPath();
      ctx.arc(cx, cy, rMax * r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Radial spokes every 30 deg
    for (let a = 0; a < 360; a += 30) {
      const rad = (a * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + rMax * Math.cos(rad), cy - rMax * Math.sin(rad));
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = '8px ui-monospace, monospace';
      ctx.textAlign = 'center';
      const tx = cx + (rMax + 14) * Math.cos(rad);
      const ty = cy - (rMax + 14) * Math.sin(rad) + 3;
      ctx.fillText(`${a}°`, tx, ty);
    }

    // DRAW FORWARD TRIP SECTOR
    // Sector centered on (threeV0PhaseDeg + relayRcaDeg)
    const centerAngleDeg = threeV0PhaseDeg + relayRcaDeg;
    const startRad = (-centerAngleDeg - sectorAngleDeg) * Math.PI / 180;
    const endRad = (-centerAngleDeg + sectorAngleDeg) * Math.PI / 180;

    ctx.fillStyle = 'rgba(239, 68, 68, 0.14)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, rMax, startRad, endRad);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // DRAW REVERSE BLOCK SECTOR
    ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, rMax, endRad, startRad);
    ctx.closePath();
    ctx.fill();

    // RCA Line (Relay Characteristic Angle centerline)
    const rcaRad = -centerAngleDeg * Math.PI / 180;
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + rMax * Math.cos(rcaRad), cy + rMax * Math.sin(rcaRad));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Axe RCA', cx + (rMax - 25) * Math.cos(rcaRad), cy + (rMax - 25) * Math.sin(rcaRad) - 6);

    // Vector drawing helper
    const drawPhasor = (mag: number, angleDeg: number, maxMag: number, color: string, label: string) => {
      const angleRad = (angleDeg * Math.PI) / 180;
      const len = Math.max(15, Math.min(rMax, (mag / maxMag) * rMax));
      const ex = cx + len * Math.cos(angleRad);
      const ey = cy - len * Math.sin(angleRad);

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // Arrowhead
      const headAngle = Math.PI / 7;
      const headLen = 9;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(
        ex - headLen * Math.cos(angleRad - headAngle),
        ey + headLen * Math.sin(angleRad - headAngle)
      );
      ctx.lineTo(
        ex - headLen * Math.cos(angleRad + headAngle),
        ey + headLen * Math.sin(angleRad + headAngle)
      );
      ctx.closePath();
      ctx.fill();

      // Label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px ui-monospace, monospace';
      ctx.fillText(label, ex + 12 * Math.cos(angleRad), ey - 8 * Math.sin(angleRad));
    };

    // Vector 1: Polarizing Residual Voltage 3V0
    drawPhasor(
      Math.max(0.1, threeV0SecondaryVolts),
      threeV0PhaseDeg,
      100, // 100V sec full scale
      '#A855F7',
      `3V0 (${threeV0SecondaryVolts.toFixed(1)} V)`
    );

    // Vector 2: Operating Residual Current 3I0
    const maxIDisplay = Math.max(25, threeI0MagA * 1.3);
    drawPhasor(
      Math.max(0.1, threeI0MagA),
      threeI0PhaseDeg,
      maxIDisplay,
      relayStatus.color,
      `3I0 (${threeI0MagA.toFixed(1)} A)`
    );

    // Title
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 10px ui-monospace, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('PLAN POLAIRE DIRECTIONNEL ANSI 67N', 18, 22);

    // Legend
    ctx.font = '9px ui-monospace, monospace';
    ctx.fillStyle = '#A855F7';
    ctx.fillText('■ 3V0 (Tension polarisante)', 18, 40);
    ctx.fillStyle = relayStatus.color;
    ctx.fillText(`■ 3I0 (${relayStatus.label.split(' ')[0]})`, 18, 55);
    ctx.fillStyle = '#EF4444';
    ctx.fillText('■ Secteur Déclencheur Avant', 18, 70);
  }, [
    threeV0SecondaryVolts,
    threeV0PhaseDeg,
    threeI0MagA,
    threeI0PhaseDeg,
    relayRcaDeg,
    sectorAngleDeg,
    relayStatus.color,
    relayStatus.label
  ]);

  // Canvas 2: Three-Phase Voltage Triangle & Neutral Point Shift (Déplacement du Point Neutre)
  useEffect(() => {
    const canvas = voltageShiftCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerW = canvas.parentElement?.clientWidth;
    const w = (canvas.width = Math.max(320, containerW && containerW > 50 ? containerW : 550));
    const h = (canvas.height = 360);

    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.50;
    const cy = h * 0.52;
    const scale = Math.min(w, h) * 0.35; // px per nominal Vph

    // Earth potential point E (at center)
    const ex = cx;
    const ey = cy;

    // In normal state: Neutral N is at E (center)
    // In fault state: Neutral N shifts by V0
    const v0xPx = (v0MagKv / vPhNomKv) * scale * Math.cos((v0PhaseRad));
    const v0yPx = -(v0MagKv / vPhNomKv) * scale * Math.sin((v0PhaseRad));
    const nx = ex + v0xPx;
    const ny = ey + v0yPx;

    // Three phase endpoints A, B, C relative to Neutral N
    const angleA = 0;
    const angleB = -2 * Math.PI / 3;
    const angleC = 2 * Math.PI / 3;

    const ax = nx + scale * Math.cos(angleA);
    const ay = ny - scale * Math.sin(angleA);

    const bx = nx + scale * Math.cos(angleB);
    const by = ny - scale * Math.sin(angleB);

    const cxPt = nx + scale * Math.cos(angleC);
    const cyPt = ny - scale * Math.sin(angleC);

    // Phase-to-Phase triangle (A-B-C delta voltages remain stiff)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(cxPt, cyPt);
    ctx.closePath();
    ctx.stroke();

    // Earth Point E marker
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(ex, ey, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 10px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Terre (E = 0V)', ex, ey + 18);

    // Neutral Point N marker
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(nx, ny, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FBBF24';
    ctx.fillText('Neutre (N)', nx, ny - 10);

    // Vector V0 (from E to N)
    ctx.strokeStyle = '#A855F7';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(nx, ny);
    ctx.stroke();
    ctx.setLineDash([]);

    // Line from Earth to faulted phase A (VA to earth)
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ax, ay);
    ctx.stroke();

    // Line from Earth to healthy phase B (VB to earth)
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // Line from Earth to healthy phase C (VC to earth)
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(cxPt, cyPt);
    ctx.stroke();

    // Labels on phase tips
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 11px ui-monospace, monospace';
    ctx.fillText(`Phase A: ${vaMag.toFixed(1)} kV`, ax + 10, ay);

    ctx.fillStyle = '#38BDF8';
    ctx.fillText(`Phase B: ${vbMag.toFixed(1)} kV`, bx - 10, by + 16);
    ctx.fillText(`Phase C: ${vcMag.toFixed(1)} kV`, cxPt - 10, cyPt - 16);

    // Title & Info
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 10px ui-monospace, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('DÉPLACEMENT DU POINT NEUTRE & SURTENSIONS SAINES', 18, 22);

    ctx.fillStyle = healthyOvervoltageRatio > 1.5 ? '#F43F5E' : '#34D399';
    ctx.fillText(
      `Facteur de Surtension Saine = x${healthyOvervoltageRatio.toFixed(2)} (${healthyOvervoltageRatio > 1.6 ? 'Surtension max ~√3' : 'Modérée'})`,
      18,
      40
    );
  }, [v0MagKv, vPhNomKv, v0PhaseRad, vaMag, vbMag, vcMag, healthyOvervoltageRatio]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
      {/* Main Visualizer Left 2 Columns */}
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-5">
        
        {/* Header / Trip Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#252E38] pb-3 text-xs">
          <div className="flex items-center gap-2">
            <span 
              className="h-3 w-3 rounded-full animate-pulse" 
              style={{ backgroundColor: relayStatus.color }}
            />
            <span className="font-bold text-[#F3F4F6]">
              {locale === 'fr' ? 'RELAIS DE DÉFAUT TERRE DIRECTIONNEL NUMÉRIQUE' : 'DIRECTIONAL EARTH FAULT RELAY'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-900/40 text-cyan-300 border border-cyan-800">
              ANSI 67N / 59N · CEI 60255-151
            </span>
          </div>
          <div 
            className="px-3 py-1 rounded-full text-xs font-bold border"
            style={{ 
              backgroundColor: `${relayStatus.color}20`, 
              borderColor: relayStatus.color,
              color: relayStatus.color 
            }}
          >
            {relayStatus.label}
          </div>
        </div>

        {/* Status Description Banner */}
        <div 
          className="p-3.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all"
          style={{
            backgroundColor: `${relayStatus.color}15`,
            borderColor: `${relayStatus.color}50`
          }}
        >
          <div className="mt-0.5">
            {relayStatus.state === 'TRIP_FORWARD' ? (
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            ) : relayStatus.state === 'BLOCK_REVERSE' ? (
              <ShieldAlert className="h-4 w-4 text-cyan-400" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            )}
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-[#F3F4F6] text-[11px]">{relayStatus.label}</div>
            <div className="text-neutral-300 text-[11px] leading-relaxed">{relayStatus.description}</div>
          </div>
        </div>

        {/* Neutral Earthing Regime Presets */}
        <div className="space-y-2">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3 w-3 text-cyan-400" />
            <span>{locale === 'fr' ? 'Régimes de Neutre HTA / MV (CEI 60071 / 60364) :' : 'Neutral Earthing Regimes:'}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              onClick={() => applyPreset('resistor')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                neutralRegime === 'resistor'
                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200 shadow-md'
                  : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">1. {locale === 'fr' ? 'Neutre Résistant (RPN)' : 'Resistor Grounded'}</div>
              <div className="text-[9px] text-neutral-400">Courant limité (ex. 300A / 40Ω)</div>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('isolated')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                neutralRegime === 'isolated'
                  ? 'border-amber-500 bg-amber-500/20 text-amber-200 shadow-md'
                  : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">2. {locale === 'fr' ? 'Neutre Isolé (IT)' : 'Isolated Neutral'}</div>
              <div className="text-[9px] text-neutral-400">Courant purement capacitif Ic0</div>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('petersen')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                neutralRegime === 'petersen'
                  ? 'border-purple-500 bg-purple-500/20 text-purple-200 shadow-md'
                  : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">3. {locale === 'fr' ? 'Bobine de Petersen' : 'Petersen Coil'}</div>
              <div className="text-[9px] text-neutral-400">Compensé résonant (If &approx; 0)</div>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('solid')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                neutralRegime === 'solid'
                  ? 'border-rose-500 bg-rose-500/20 text-rose-200 shadow-md'
                  : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">4. {locale === 'fr' ? 'Neutre Direct Terre' : 'Solid Grounded'}</div>
              <div className="text-[9px] text-neutral-400">Fort If (kA), 50N suffisant</div>
            </button>
          </div>
        </div>

        {/* Canvas 1: Polar Directional Scope */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-bold text-[#F3F4F6]">
                {locale === 'fr' ? 'PLAN POLAIRE DIRECTIONNEL 67N (3V0 vs 3I0)' : 'POLAR DIRECTIONAL PLANE (3V0 vs 3I0)'}
              </span>
            </span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="text-neutral-400">
                Déphasage $\Delta\varphi = {deltaPhiDeg.toFixed(0)}°$
              </span>
              <span className="font-bold text-amber-400">
                Écart RCA = {angleRelRca.toFixed(0)}°
              </span>
            </div>
          </div>
          <div className="w-full overflow-hidden rounded-xl border border-[#252E38] bg-[#080B10]">
            <canvas ref={polarScopeCanvasRef} className="w-full block" />
          </div>
        </div>

        {/* Canvas 2: Symmetrical Voltages & Neutral Point Shift */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-purple-400" />
              <span className="font-bold text-[#F3F4F6]">
                {locale === 'fr' ? 'TRIANGLE DES TENSIONS TRIPHASÉES & DÉPLACEMENT DU NEUTRE (V0)' : 'THREE-PHASE VOLTAGES & NEUTRAL POINT DISPLACEMENT (V0)'}
              </span>
            </span>
            <span className="text-[10px] text-neutral-400">
              {locale === 'fr' ? 'Phase en défaut : A (Terre)' : 'Faulted phase: A (Ground)'}
            </span>
          </div>
          <div className="w-full overflow-hidden rounded-xl border border-[#252E38] bg-[#080B10]">
            <canvas ref={voltageShiftCanvasRef} className="w-full block" />
          </div>
        </div>

        {/* Feeder Selection Bar (Compare Faulty Feeder vs Healthy Feeder) */}
        <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">{locale === 'fr' ? 'Point d’Observation Relais :' : 'Relay Location:'}</span>
            <button
              type="button"
              onClick={() => setActiveFeeder('faulty_f1')}
              className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                activeFeeder === 'faulty_f1'
                  ? 'border-rose-500 bg-rose-500/20 text-rose-200'
                  : 'border-[#252E38] text-neutral-400'
              }`}
            >
              {locale === 'fr' ? 'Départ 1 en Défaut (Sens AVANT)' : 'Feeder 1 Faulty (FORWARD)'}
            </button>
            <button
              type="button"
              onClick={() => setActiveFeeder('healthy_f2')}
              className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                activeFeeder === 'healthy_f2'
                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200'
                  : 'border-[#252E38] text-neutral-400'
              }`}
            >
              {locale === 'fr' ? 'Départ 2 Sain (Sens ARRIÈRE)' : 'Feeder 2 Healthy (REVERSE)'}
            </button>
          </div>
          <div className="text-[11px] text-neutral-400">
            {activeFeeder === 'faulty_f1' 
              ? (locale === 'fr' ? '3I0 = courant de défaut s’éloignant du jeu de barres' : '3I0 flows away from busbar')
              : (locale === 'fr' ? '3I0 = courant capacitif sain retournant vers le jeu de barres' : '3I0 returns to busbar')}
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">TENSION RÉSIDUELLE 3V0</div>
            <div className="text-xl font-black text-purple-400">
              {threeV0SecondaryVolts.toFixed(1)} <span className="text-xs font-normal text-neutral-400">V sec</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-sans">
              {(threeV0Volts / 1000).toFixed(2)} kV primaire
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">COURANT RÉSIDUEL 3I0</div>
            <div className="text-xl font-black text-cyan-400">
              {threeI0MagA.toFixed(1)} <span className="text-xs font-normal text-neutral-400">A</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-sans">
              Angle: {threeI0PhaseDeg.toFixed(0)}°
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">SURTENSION PHASES SAINES</div>
            <div className="text-xl font-black text-amber-400">
              {Math.max(vbMag, vcMag).toFixed(1)} <span className="text-xs font-normal text-neutral-400">kV</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-sans">
              x{healthyOvervoltageRatio.toFixed(2)} Vn ({((healthyOvervoltageRatio - 1) * 100).toFixed(0)}% surtension)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">SÉLECTIVITÉ DIRECTIONNELLE</div>
            <div className="text-xl font-black" style={{ color: relayStatus.color }}>
              {isSectorMatch ? 'SECTEUR AVANT' : 'SECTEUR ARRIÈRE'}
            </div>
            <div className="text-[10px] text-neutral-500 font-sans">
              {isSectorMatch ? 'Déclenchement autorisé' : 'Déclenchement verrouillé'}
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Relay & Grid Sliders */}
      <div className="space-y-4 text-xs font-mono">
        
        {/* Relay 67N Settings Card */}
        <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="text-[10px] text-neutral-400 uppercase font-bold flex items-center justify-between border-b border-[#252E38] pb-2">
            <span>{locale === 'fr' ? 'PARAMÈTRES RELAIS ANSI 67N' : 'ANSI 67N RELAY SETTINGS'}</span>
            <span className="text-cyan-400">RCA={relayRcaDeg}°</span>
          </div>

          {/* Relay Characteristic Angle (RCA) */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Angle Caractéristique (RCA) :</span>
              <span className="text-yellow-400 font-bold">{relayRcaDeg}°</span>
            </div>
            <input
              type="range"
              min="-90"
              max="90"
              step="5"
              value={relayRcaDeg}
              onChange={(e) => setRelayRcaDeg(parseInt(e.target.value))}
              className="w-full accent-yellow-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-neutral-500">
              <span>-90° (Neutre Isolé)</span>
              <span>0° (Neutre Résistant)</span>
              <span>+45° (Inductif)</span>
            </div>
          </div>

          {/* 3V0 Pickup Threshold */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Seuil de Tension 3V0 (ANSI 59N) :</span>
              <span className="text-purple-400 font-bold">{v0PickupThresholdV} V sec</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={v0PickupThresholdV}
              onChange={(e) => setV0PickupThresholdV(parseInt(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="text-[9px] text-neutral-500">Généralement réglé entre 10 et 20 V sec</div>
          </div>

          {/* 3I0 Pickup Threshold */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Seuil de Courant 3I0 (ANSI 51N) :</span>
              <span className="text-cyan-400 font-bold">{i0PickupThresholdA} A prim</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={i0PickupThresholdA}
              onChange={(e) => setI0PickupThresholdA(parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Sector Width */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Demi-Angle Secteur (+/-) :</span>
              <span className="text-rose-400 font-bold">&plusmn;{sectorAngleDeg}°</span>
            </div>
            <input
              type="range"
              min="45"
              max="90"
              step="5"
              value={sectorAngleDeg}
              onChange={(e) => setSectorAngleDeg(parseInt(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="text-[9px] text-neutral-500">Norme CEI : standard &plusmn;85° (170° d'ouverture)</div>
          </div>
        </div>

        {/* Network & Physical Fault Sliders */}
        <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="text-[10px] text-neutral-400 uppercase font-bold flex items-center justify-between border-b border-[#252E38] pb-2">
            <span>{locale === 'fr' ? 'RÉSEAU & DÉFAUT PHYSIQUE' : 'GRID & FAULT PARAMETERS'}</span>
            <span className="text-emerald-400">{unKv} kV</span>
          </div>

          {/* Voltage Level */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Tension Nominale Composée (Un) :</span>
              <span className="text-emerald-400 font-bold">{unKv} kV</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-[10px]">
              {[15, 20, 30, 33].map((kv) => (
                <button
                  key={kv}
                  type="button"
                  onClick={() => setUnKv(kv)}
                  className={`py-1 rounded border text-center ${
                    unKv === kv ? 'border-emerald-500 bg-emerald-500/20 text-white' : 'border-[#252E38] text-neutral-400'
                  }`}
                >
                  {kv} kV
                </button>
              ))}
            </div>
          </div>

          {/* Capacitive Current of Network */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Courant Capacitif Total Réseau (Ic0) :</span>
              <span className="text-cyan-400 font-bold">{gridCapacitiveCurrentA} A</span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={gridCapacitiveCurrentA}
              onChange={(e) => setGridCapacitiveCurrentA(parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="text-[9px] text-neutral-500">Dû aux câbles souterrains (~2 à 3 A/km)</div>
          </div>

          {/* Neutral Resistance (if resistor) */}
          {neutralRegime === 'resistor' && (
            <div className="space-y-1">
              <div className="flex justify-between text-neutral-300 text-[11px]">
                <span>Résistance de Neutre (Rn) :</span>
                <span className="text-amber-400 font-bold">{neutralResistanceOhm} &Omega;</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={neutralResistanceOhm}
                onChange={(e) => setNeutralResistanceOhm(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="text-[9px] text-neutral-500">
                Limite If_max à ~{((unKv * 1000 / Math.sqrt(3)) / neutralResistanceOhm).toFixed(0)} A
              </div>
            </div>
          )}

          {/* Petersen Coil Detuning (if petersen) */}
          {neutralRegime === 'petersen' && (
            <div className="space-y-1">
              <div className="flex justify-between text-neutral-300 text-[11px]">
                <span>Désaccord Bobine Petersen :</span>
                <span className="text-purple-400 font-bold">
                  {petersenDetuningPct > 0 ? `+${petersenDetuningPct}% (Sur-comp.)` : `${petersenDetuningPct}% (Sous-comp.)`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="2"
                value={petersenDetuningPct}
                onChange={(e) => setPetersenDetuningPct(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          )}

          {/* Fault Resistance Rf */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Résistance de Défaut (Rf) :</span>
              <span className="text-rose-400 font-bold">{faultResistanceRf} &Omega;</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={faultResistanceRf}
              onChange={(e) => setFaultResistanceRf(parseInt(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="text-[9px] text-neutral-500">0 &Omega; = franc à la terre, 100 &Omega; = résistant</div>
          </div>
        </div>

        {/* Engineering Guidelines & Standards */}
        <div className="p-3 rounded-2xl bg-[#080B10] border border-[#252E38] space-y-1.5 text-[10px]">
          <div className="text-cyan-400 font-bold mb-1">
            {locale === 'fr' ? 'Guide d’Ingénierie & Normes (CEI 60071 / 60255-151) :' : 'Engineering Standards & Notes:'}
          </div>
          <div className="text-neutral-400">• <strong className="text-white">ANSI 67N</strong> : Sécurité d'élimination de défaut en réseau bouclé ou avec fort capacitif sans faux déclenchement des départs sains.</div>
          <div className="text-neutral-400">• <strong className="text-white">RPN (Neutre Résistant)</strong> : Idéal en réseau mixte aéro-souterrain camerounais (SONATREL / Eneo 30 kV) pour limiter la surtension saine à &le; 1.4 Un.</div>
          <div className="text-neutral-400">• <strong className="text-white">Neutre Isolé</strong> : Surtension continue de &radic;3 Vn sur phases saines, exigeant une tenue diélectrique renforcée des câbles.</div>
          <div className="text-neutral-400">• <strong className="text-white">Bobine Petersen</strong> : Permet de poursuivre l'exploitation lors d'un défaut monophasé fugitif grâce à l'auto-extinction de l'arc.</div>
        </div>

      </div>
    </div>
  );
};
