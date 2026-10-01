// src/components/simulation/modules/GeneratorCapabilityLabTab.tsx
// Module 13: Synchronous Generator Capability & P-Q Operating Chart (CEI 60034-1 / IEEE C50.13 / ANSI 32 & 40)
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
  Cpu,
  Flame,
  Wind
} from 'lucide-react';

interface GeneratorCapabilityLabTabProps {
  locale: 'fr' | 'en';
}

export type MachinePresetType = 'hydro_nachtigal' | 'gas_kribi' | 'steam_thermal' | 'hydro_songloulou' | 'custom';

export const GeneratorCapabilityLabTab: React.FC<GeneratorCapabilityLabTabProps> = ({ locale }) => {
  // ---------------------------------------------------------------------------
  // 1. GENERATOR NAMEPLATE RATINGS & PARAMETERS
  // ---------------------------------------------------------------------------
  const [sRatedMva, setSRatedMva] = useState<number>(120); // Rated MVA
  const [unKv, setUnKv] = useState<number>(15.0); // Rated terminal voltage kV
  const [cosPhiRated, setCosPhiRated] = useState<number>(0.85); // Rated power factor (lagging)
  const [xdPu, setXdPu] = useState<number>(1.15); // Direct-axis synchronous reactance (p.u.)
  const [xqPu, setXqPu] = useState<number>(0.72); // Quadrature-axis synchronous reactance (p.u.)
  const [xdPrimePu, setXdPrimePu] = useState<number>(0.28); // Direct-axis transient reactance (p.u.)
  const [isRotorSalient, setIsRotorSalient] = useState<boolean>(true); // Salient pole (hydro) vs Cylindrical (thermal)

  // ---------------------------------------------------------------------------
  // 2. GRID & COOLING CONDITIONS
  // ---------------------------------------------------------------------------
  const [vtPu, setVtPu] = useState<number>(1.00); // Actual terminal voltage (p.u.) [0.90 - 1.10]
  const [coolingMode, setCoolingMode] = useState<'air_open' | 'h2_1bar' | 'h2_2bar' | 'h2_3bar' | 'water_cooled'>('air_open');
  const [activePreset, setActivePreset] = useState<MachinePresetType>('hydro_nachtigal');

  // Cooling derating factor
  const coolingFactor = useMemo(() => {
    switch (coolingMode) {
      case 'air_open': return 1.00;
      case 'h2_1bar': return 0.85;
      case 'h2_2bar': return 0.95;
      case 'h2_3bar': return 1.05;
      case 'water_cooled': return 1.15;
      default: return 1.00;
    }
  }, [coolingMode]);

  // ---------------------------------------------------------------------------
  // 3. OPERATING DISPATCH POINT (P, Q)
  // ---------------------------------------------------------------------------
  const [pOpMw, setPOpMw] = useState<number>(95); // Operating active power MW
  const [qOpMvar, setQOpMvar] = useState<number>(45); // Operating reactive power MVAR (+ = overexcited / generating Q, - = underexcited / absorbing Q)
  const [isInteractiveDragging, setIsInteractiveDragging] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // 4. DISPLAY DOMAIN & VISUAL MODES
  // ---------------------------------------------------------------------------
  const [displayDomain, setDisplayDomain] = useState<'pq_chart' | 'rx_protection' | 'v_curves' | 'report'>('pq_chart');
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);

  // Canvases refs
  const pqCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rxCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const vCurvesCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hover probe for P-Q Canvas
  const [pqHover, setPqHover] = useState<{ p: number; q: number; s: number; pf: number; deltaDeg: number } | null>(null);

  // ---------------------------------------------------------------------------
  // 5. APPLY MACHINE PRESETS
  // ---------------------------------------------------------------------------
  const handleApplyPreset = (preset: MachinePresetType) => {
    setActivePreset(preset);
    if (preset === 'hydro_nachtigal') {
      setSRatedMva(120);
      setUnKv(15.0);
      setCosPhiRated(0.85);
      setXdPu(1.10);
      setXqPu(0.68);
      setXdPrimePu(0.26);
      setIsRotorSalient(true);
      setCoolingMode('air_open');
      setPOpMw(95);
      setQOpMvar(40);
    } else if (preset === 'gas_kribi') {
      setSRatedMva(58);
      setUnKv(11.5);
      setCosPhiRated(0.80);
      setXdPu(1.68);
      setXqPu(1.60);
      setXdPrimePu(0.22);
      setIsRotorSalient(false);
      setCoolingMode('air_open');
      setPOpMw(44);
      setQOpMvar(18);
    } else if (preset === 'steam_thermal') {
      setSRatedMva(350);
      setUnKv(20.0);
      setCosPhiRated(0.85);
      setXdPu(2.05);
      setXqPu(1.98);
      setXdPrimePu(0.25);
      setIsRotorSalient(false);
      setCoolingMode('h2_3bar');
      setPOpMw(280);
      setQOpMvar(110);
    } else if (preset === 'hydro_songloulou') {
      setSRatedMva(48);
      setUnKv(10.5);
      setCosPhiRated(0.85);
      setXdPu(1.15);
      setXqPu(0.72);
      setXdPrimePu(0.30);
      setIsRotorSalient(true);
      setCoolingMode('air_open');
      setPOpMw(38);
      setQOpMvar(15);
    }
  };

  // ---------------------------------------------------------------------------
  // 6. ANALYTICAL CAPABILITY CALCULATIONS (CEI 60034-1 & IEEE C50.13)
  // ---------------------------------------------------------------------------
  const calcResults = useMemo(() => {
    // Base electrical quantities
    const sBase = sRatedMva; // MVA
    const pRatedMw = sBase * cosPhiRated; // MW
    const qRatedMvar = sBase * Math.sqrt(Math.max(0, 1 - cosPhiRated * cosPhiRated)); // MVAR
    const iRatedA = (sBase * 1e6) / (Math.sqrt(3) * unKv * 1e3); // A
    const zBaseOhm = (unKv * unKv) / sBase; // Ohm

    // Thermal rating scaled by cooling factor
    const sThermalMax = sBase * coolingFactor;

    // Operating point in per-unit
    const pPu = pOpMw / sBase;
    const qPu = qOpMvar / sBase;
    const sOpMva = Math.sqrt(pOpMw * pOpMw + qOpMvar * qOpMvar);
    const sOpPu = sOpMva / sBase;
    const pfOp = sOpMva > 0.01 ? Math.min(1.0, Math.abs(pOpMw) / sOpMva) : 1.0;
    const iStatorA = (sOpMva * 1e6) / (Math.sqrt(3) * (unKv * vtPu) * 1e3);
    const iStatorPu = sOpMva / (sBase * vtPu);

    // Internal Rotor Angle delta:
    // tan(delta) = (P * Xq) / (Vt^2 + Q * Xq)
    const tanDeltaNum = pPu * xqPu;
    const tanDeltaDen = vtPu * vtPu + qPu * xqPu;
    const deltaRad = Math.atan2(tanDeltaNum, tanDeltaDen);
    const deltaDeg = (deltaRad * 180) / Math.PI;

    // Internal Excitation EMF Ef (pu)
    // Ef = Vt * cos(delta) + Id * Xd
    // In synchronous coordinates:
    const idPu = (vtPu * (xqPu * Math.sin(deltaRad) * Math.sin(deltaRad) + xdPu * Math.cos(deltaRad) * Math.cos(deltaRad)) > 0)
      ? (vtPu * Math.sin(deltaRad) - pPu * 0) // simplified projection
      : 0;
    const efPu = Math.sqrt(
      Math.pow(vtPu + (qPu * xdPu) / vtPu, 2) + Math.pow((pPu * xdPu) / vtPu, 2)
    );

    // Rated excitation at nominal lagging PF and nominal Vt=1.0:
    const efRatedPu = Math.sqrt(
      Math.pow(1.0 + (qRatedMvar / sBase) * xdPu, 2) + Math.pow((pRatedMw / sBase) * xdPu, 2)
    );
    const ifdRatio = efPu / efRatedPu; // Ratio to rated field current

    // -------------------------------------------------------------------------
    // CAPABILITY ENVELOPE BOUNDARIES IN PU
    // -------------------------------------------------------------------------
    // 1. Armature (Stator) Current Limit:
    // Circle centered at (0, 0) with radius = Vt * (sThermalMax / sBase)
    const rStatorPu = vtPu * coolingFactor;

    // 2. Rotor Field Heating Limit:
    // Center at (P=0, Q = -Vt^2 / Xd)
    const qCenterRotorPu = -(vtPu * vtPu) / xdPu;
    // Radius = (Vt * Ef_max) / Xd, where Ef_max is scaled by cooling
    const rRotorPu = (vtPu * (efRatedPu * coolingFactor)) / xdPu;

    // 3. Stator End-Iron Core Underexcitation Limit (UEL):
    // In underexcitation, axial leakage flux heats the stator core ends.
    // Circle centered at (0, -0.25 * Vt^2 / Xq), empirical industrial standard
    const qCenterUelPu = -(0.35 * vtPu * vtPu) / xqPu;
    const rUelPu = 0.82 * rStatorPu;

    // 4. Practical Steady-State Stability Limit (PSSL):
    // Margin of delta <= 70 deg (instead of 90 deg)
    // Q_stab(P) = -Vt^2 / Xd + P / tan(70 deg)
    const deltaMaxSafeDeg = 70;
    const tanDeltaMax = Math.tan((deltaMaxSafeDeg * Math.PI) / 180);

    // 5. Prime Mover (Turbine) Limit:
    const pTurbineMaxMw = pRatedMw * 1.05; // 105% of rated MW
    const pTurbineMinMw = pRatedMw * 0.10; // 10% minimum load
    const pTurbineMaxPu = pTurbineMaxMw / sBase;
    const pTurbineMinPu = pTurbineMinMw / sBase;

    // -------------------------------------------------------------------------
    // EVALUATE MARGINS & COMPLIANCE
    // -------------------------------------------------------------------------
    // A. Check Stator Thermal Overload
    const statorLoadPct = (iStatorPu / coolingFactor) * 100;
    const isStatorOverloaded = iStatorPu > rStatorPu * 1.01;

    // B. Check Rotor Field Overload
    const distToRotorCenter = Math.sqrt(pPu * pPu + Math.pow(qPu - qCenterRotorPu, 2));
    const isRotorOverloaded = distToRotorCenter > rRotorPu * 1.01;
    const rotorLoadPct = (distToRotorCenter / rRotorPu) * 100;

    // C. Check End-Iron Underexcitation Limit (UEL)
    const distToUelCenter = Math.sqrt(pPu * pPu + Math.pow(qPu - qCenterUelPu, 2));
    const isUelExceeded = qPu < 0 && distToUelCenter > rUelPu * 1.01;

    // D. Check Stability Margin
    const qMinStabAtP = -(vtPu * vtPu) / xdPu + pPu / tanDeltaMax;
    const isStabilityAtRisk = qPu < qMinStabAtP || deltaDeg > 70;

    // E. Check Reverse Power (ANSI 32)
    const isReversePower = pOpMw < -pRatedMw * 0.02; // Motoring > 2%

    // F. Check Turbine Limit
    const isTurbineOverloaded = pOpMw > pTurbineMaxMw;
    const isBelowMinTurbine = pOpMw > 0 && pOpMw < pTurbineMinMw;

    // G. ANSI 40 Loss of Field Relay Seen Impedance
    // Z_seen = R + jX = Vt^2 / (P - jQ) [in p.u.]
    const sSq = pPu * pPu + qPu * qPu;
    const rSeenPu = sSq > 1e-4 ? (vtPu * vtPu * pPu) / sSq : 100;
    const xSeenPu = sSq > 1e-4 ? (vtPu * vtPu * qPu) / sSq : 100;
    const zSeenOhmR = rSeenPu * zBaseOhm;
    const zSeenOhmX = xSeenPu * zBaseOhm;

    // ANSI 40 Offset Mho Relay settings (Mason / Berdy characteristic):
    // Circle 1: Offset = -X'd/2, Diameter = Xd
    const mhoOffset1Pu = -xdPrimePu / 2;
    const mhoDia1Pu = xdPu;
    const mhoCenter1X = mhoOffset1Pu - mhoDia1Pu / 2;
    const mhoRadius1 = mhoDia1Pu / 2;
    const distToMho1 = Math.sqrt(rSeenPu * rSeenPu + Math.pow(xSeenPu - mhoCenter1X, 2));
    const isAnsi40Zone1Trip = distToMho1 <= mhoRadius1;

    // Circle 2: Offset = -X'd/2, Diameter = 1.3 * Xd
    const mhoDia2Pu = 1.3 * xdPu;
    const mhoCenter2X = mhoOffset1Pu - mhoDia2Pu / 2;
    const mhoRadius2 = mhoDia2Pu / 2;
    const distToMho2 = Math.sqrt(rSeenPu * rSeenPu + Math.pow(xSeenPu - mhoCenter2X, 2));
    const isAnsi40Zone2Trip = distToMho2 <= mhoRadius2;

    const isInsideCapability = !isStatorOverloaded && !isRotorOverloaded && !isUelExceeded && !isStabilityAtRisk && !isReversePower && !isTurbineOverloaded;

    return {
      sBase,
      pRatedMw,
      qRatedMvar,
      iRatedA,
      zBaseOhm,
      sThermalMax,
      pPu,
      qPu,
      sOpMva,
      sOpPu,
      pfOp,
      iStatorA,
      iStatorPu,
      deltaDeg,
      efPu,
      ifdRatio,
      rStatorPu,
      qCenterRotorPu,
      rRotorPu,
      qCenterUelPu,
      rUelPu,
      pTurbineMaxMw,
      pTurbineMinMw,
      pTurbineMaxPu,
      pTurbineMinPu,
      statorLoadPct,
      rotorLoadPct,
      isStatorOverloaded,
      isRotorOverloaded,
      isUelExceeded,
      isStabilityAtRisk,
      isReversePower,
      isTurbineOverloaded,
      isBelowMinTurbine,
      rSeenPu,
      xSeenPu,
      zSeenOhmR,
      zSeenOhmX,
      mhoCenter1X,
      mhoRadius1,
      isAnsi40Zone1Trip,
      mhoCenter2X,
      mhoRadius2,
      isAnsi40Zone2Trip,
      isInsideCapability
    };
  }, [sRatedMva, unKv, cosPhiRated, xdPu, xqPu, xdPrimePu, vtPu, coolingFactor, pOpMw, qOpMvar]);

  // ---------------------------------------------------------------------------
  // CANVAS DRAWING 1: P-Q CAPABILITY CHART
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = pqCanvasRef.current;
    if (!canvas || displayDomain !== 'pq_chart') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Coordinate transformations
    // Origin in (P, Q) plane: P is vertical (0 to +1.4 pu), Q is horizontal (-1.2 to +1.2 pu)
    // Convention in European/IEC Power Engineering: P is Y-axis (top = generation, bottom = motoring), Q is X-axis (right = overexcited/lag, left = underexcited/lead)
    const padX = 60;
    const padY = 40;
    const plotW = width - 2 * padX;
    const plotH = height - 2 * padY;

    const qMin = -1.3;
    const qMax = 1.3;
    const pMin = -0.3;
    const pMax = 1.3;

    const toCanvasX = (qVal: number) => padX + ((qVal - qMin) / (qMax - qMin)) * plotW;
    const toCanvasY = (pVal: number) => padY + plotH - ((pVal - pMin) / (pMax - pMin)) * plotH;

    // Grid Background
    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, width, height);

    // Subtle Grid lines
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let qG = -1.2; qG <= 1.2; qG += 0.2) {
      const x = toCanvasX(qG);
      ctx.beginPath();
      ctx.moveTo(x, padY);
      ctx.lineTo(x, padY + plotH);
      ctx.stroke();
      if (Math.abs(qG) > 0.05) {
        ctx.fillStyle = '#475569';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${qG > 0 ? '+' : ''}${qG.toFixed(1)}`, x, padY + plotH + 15);
      }
    }

    for (let pG = -0.2; pG <= 1.2; pG += 0.2) {
      const y = toCanvasY(pG);
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(padX + plotW, y);
      ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${pG.toFixed(1)}`, padX - 8, y + 3);
    }

    // Main Axes
    const originX = toCanvasX(0);
    const originY = toCanvasY(0);

    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.5;
    // Q-Axis (horizontal)
    ctx.beginPath();
    ctx.moveTo(padX, originY);
    ctx.lineTo(padX + plotW, originY);
    ctx.stroke();

    // P-Axis (vertical)
    ctx.beginPath();
    ctx.moveTo(originX, padY);
    ctx.lineTo(originX, padY + plotH);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('P (pu) Génération', originX - 10, padY + 12);
    ctx.textAlign = 'left';
    ctx.fillText('P < 0 Moteur', originX - 10, padY + plotH - 5);
    ctx.textAlign = 'right';
    ctx.fillText('Q (pu) Surexcité (+MVAR)', padX + plotW, originY - 8);
    ctx.textAlign = 'left';
    ctx.fillText('Sous-excité (-MVAR)', padX, originY - 8);

    // -------------------------------------------------------------------------
    // DRAW PERMISSIBLE SAFE OPERATING ENVELOPE (POLYGON FILL)
    // -------------------------------------------------------------------------
    // Sample points along the lower of all limits
    const envelopePoints: { x: number; y: number }[] = [];
    const pStep = 0.01;

    for (let pVal = Math.max(0, calcResults.pTurbineMinPu); pVal <= calcResults.pTurbineMaxPu; pVal += pStep) {
      // Stator limit: Q_stat = +sqrt(R_stat^2 - P^2)
      let qMaxP = 0;
      if (pVal <= calcResults.rStatorPu) {
        qMaxP = Math.sqrt(Math.max(0, calcResults.rStatorPu * calcResults.rStatorPu - pVal * pVal));
      }
      // Rotor limit: Q_rot = Q_center + sqrt(R_rot^2 - P^2)
      if (pVal <= calcResults.rRotorPu) {
        const qRot = calcResults.qCenterRotorPu + Math.sqrt(Math.max(0, calcResults.rRotorPu * calcResults.rRotorPu - pVal * pVal));
        qMaxP = Math.min(qMaxP, qRot);
      }
      envelopePoints.push({ x: toCanvasX(qMaxP), y: toCanvasY(pVal) });
    }

    // Top horizontal cap (turbine max)
    const pTop = calcResults.pTurbineMaxPu;
    let qLeftTop = 0;
    // Left side: underexcitation limits
    for (let pVal = pTop; pVal >= Math.max(0, calcResults.pTurbineMinPu); pVal -= pStep) {
      // Stator left limit
      let qMinP = -Math.sqrt(Math.max(0, calcResults.rStatorPu * calcResults.rStatorPu - pVal * pVal));
      // UEL limit: Q_center_uel - sqrt(R_uel^2 - P^2)
      if (pVal <= calcResults.rUelPu) {
        const qUel = calcResults.qCenterUelPu - Math.sqrt(Math.max(0, calcResults.rUelPu * calcResults.rUelPu - pVal * pVal));
        qMinP = Math.max(qMinP, qUel);
      }
      // Stability limit
      const qStab = -(vtPu * vtPu) / xdPu + pVal / Math.tan((70 * Math.PI) / 180);
      qMinP = Math.max(qMinP, qStab);

      envelopePoints.push({ x: toCanvasX(qMinP), y: toCanvasY(pVal) });
    }

    // Draw permissible shaded polygon
    if (envelopePoints.length > 3) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(envelopePoints[0].x, envelopePoints[0].y);
      for (let i = 1; i < envelopePoints.length; i++) {
        ctx.lineTo(envelopePoints[i].x, envelopePoints[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // -------------------------------------------------------------------------
    // DRAW THE INDIVIDUAL LIMIT CURVES
    // -------------------------------------------------------------------------
    // 1. Armature (Stator) Circle: center (0, 0), radius = rStatorPu
    ctx.strokeStyle = '#F59E0B'; // Amber
    ctx.lineWidth = 2.2;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    for (let deg = 0; deg <= 180; deg += 2) {
      const rad = (deg * Math.PI) / 180;
      const qVal = calcResults.rStatorPu * Math.cos(rad);
      const pVal = calcResults.rStatorPu * Math.sin(rad);
      const cx = toCanvasX(qVal);
      const cy = toCanvasY(pVal);
      if (deg === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Rotor Field Heating Circle: center (0, qCenterRotorPu), radius = rRotorPu
    ctx.strokeStyle = '#06B6D4'; // Cyan
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    let startedRotor = false;
    for (let pVal = 0; pVal <= Math.min(calcResults.rRotorPu, 1.3); pVal += 0.02) {
      const qVal = calcResults.qCenterRotorPu + Math.sqrt(Math.max(0, calcResults.rRotorPu * calcResults.rRotorPu - pVal * pVal));
      const cx = toCanvasX(qVal);
      const cy = toCanvasY(pVal);
      if (!startedRotor) {
        ctx.moveTo(cx, cy);
        startedRotor = true;
      } else {
        ctx.lineTo(cx, cy);
      }
    }
    ctx.stroke();

    // 3. Stator End-Iron Core Underexcitation Limit (UEL):
    ctx.strokeStyle = '#EC4899'; // Pink/Magenta
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    let startedUel = false;
    for (let pVal = 0; pVal <= Math.min(calcResults.rUelPu, 1.2); pVal += 0.02) {
      const qVal = calcResults.qCenterUelPu - Math.sqrt(Math.max(0, calcResults.rUelPu * calcResults.rUelPu - pVal * pVal));
      const cx = toCanvasX(qVal);
      const cy = toCanvasY(pVal);
      if (!startedUel) {
        ctx.moveTo(cx, cy);
        startedUel = true;
      } else {
        ctx.lineTo(cx, cy);
      }
    }
    ctx.stroke();

    // 4. Practical Steady-State Stability Limit (delta = 70 deg)
    ctx.strokeStyle = '#10B981'; // Emerald
    ctx.lineWidth = 2.0;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const qStab0 = -(vtPu * vtPu) / xdPu;
    const qStabTop = qStab0 + 1.2 / Math.tan((70 * Math.PI) / 180);
    ctx.moveTo(toCanvasX(qStab0), toCanvasY(0));
    ctx.lineTo(toCanvasX(qStabTop), toCanvasY(1.2));
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Turbine Limits (Pmax & Pmin)
    ctx.strokeStyle = '#EF4444'; // Red
    ctx.lineWidth = 1.8;
    ctx.setLineDash([6, 4]);
    // Pmax line
    const yPMax = toCanvasY(calcResults.pTurbineMaxPu);
    ctx.beginPath();
    ctx.moveTo(padX, yPMax);
    ctx.lineTo(padX + plotW, yPMax);
    ctx.stroke();

    // Pmin line
    ctx.strokeStyle = '#F97316';
    const yPMin = toCanvasY(calcResults.pTurbineMinPu);
    ctx.beginPath();
    ctx.moveTo(padX, yPMin);
    ctx.lineTo(padX + plotW, yPMin);
    ctx.stroke();
    ctx.setLineDash([]);

    // Reverse power boundary (P = -0.02)
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 1.5;
    const yRev = toCanvasY(-0.02);
    ctx.beginPath();
    ctx.moveTo(padX, yRev);
    ctx.lineTo(padX + plotW, yRev);
    ctx.stroke();

    // -------------------------------------------------------------------------
    // DRAW OPERATING POINT (P_op, Q_op) & VECTOR
    // -------------------------------------------------------------------------
    const opX = toCanvasX(calcResults.qPu);
    const opY = toCanvasY(calcResults.pPu);

    // Apparent power S vector line from origin
    ctx.strokeStyle = calcResults.isInsideCapability ? '#38BDF8' : '#F43F5E';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(opX, opY);
    ctx.stroke();

    // S vector arrow head
    const angleS = Math.atan2(originY - opY, opX - originX);
    const arrowLen = 10;
    ctx.fillStyle = calcResults.isInsideCapability ? '#38BDF8' : '#F43F5E';
    ctx.beginPath();
    ctx.moveTo(opX, opY);
    ctx.lineTo(opX - arrowLen * Math.cos(angleS - Math.PI / 6), opY + arrowLen * Math.sin(angleS - Math.PI / 6));
    ctx.lineTo(opX - arrowLen * Math.cos(angleS + Math.PI / 6), opY + arrowLen * Math.sin(angleS + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // Highlight circle on Operating Point
    ctx.fillStyle = calcResults.isInsideCapability ? '#38BDF8' : '#F43F5E';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(opX, opY, 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Glow effect
    ctx.fillStyle = calcResults.isInsideCapability ? 'rgba(56, 189, 248, 0.3)' : 'rgba(244, 63, 94, 0.4)';
    ctx.beginPath();
    ctx.arc(opX, opY, 14, 0, 2 * Math.PI);
    ctx.fill();

    // Operational Point Tag
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = calcResults.isInsideCapability ? '#38BDF8' : '#F43F5E';
    ctx.lineWidth = 1.2;
    const tagW = 150;
    const tagH = 38;
    let tagX = opX + 12;
    let tagY = opY - 20;
    if (tagX + tagW > width - 10) tagX = opX - tagW - 12;
    if (tagY < padY) tagY = padY + 5;

    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(tagX, tagY, tagW, tagH, 6);
    } else {
      ctx.rect(tagX, tagY, tagW, tagH);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`P: ${pOpMw.toFixed(1)} MW (${calcResults.pPu.toFixed(2)} pu)`, tagX + 8, tagY + 14);
    ctx.fillStyle = calcResults.qPu >= 0 ? '#38BDF8' : '#EC4899';
    ctx.fillText(`Q: ${qOpMvar.toFixed(1)} MVAR | cosφ: ${calcResults.pfOp.toFixed(3)}`, tagX + 8, tagY + 28);

    // -------------------------------------------------------------------------
    // CHART LEGEND (BOTTOM)
    // -------------------------------------------------------------------------
    const legY = padY + 18;
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';

    ctx.fillStyle = '#F59E0B';
    ctx.fillText('— Échauffement Stator (Ia)', padX + 10, legY);
    ctx.fillStyle = '#06B6D4';
    ctx.fillText('— Échauffement Rotor (Ifd)', padX + 175, legY);
    ctx.fillStyle = '#EC4899';
    ctx.fillText('— Limite Têtes (UEL)', padX + 345, legY);
    ctx.fillStyle = '#10B981';
    ctx.fillText('-- Stabilité Statique (70°)', padX + 485, legY);

    // Hover tooltip if probe is active
    if (pqHover) {
      const hx = toCanvasX(pqHover.q);
      const hy = toCanvasY(pqHover.p);

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(hx, padY);
      ctx.lineTo(hx, padY + plotH);
      ctx.moveTo(padX, hy);
      ctx.lineTo(padX + plotW, hy);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [displayDomain, calcResults, pOpMw, qOpMvar, vtPu, xdPu, pqHover]);

  // Mouse handlers for P-Q Chart interaction
  const handlePqCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsInteractiveDragging(true);
    updateOpFromMouse(e);
  };

  const handlePqCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = pqCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const padX = 60;
    const padY = 40;
    const plotW = canvas.width - 2 * padX;
    const plotH = canvas.height - 2 * padY;

    const qMin = -1.3;
    const qMax = 1.3;
    const pMin = -0.3;
    const pMax = 1.3;

    if (mouseX >= padX && mouseX <= padX + plotW && mouseY >= padY && mouseY <= padY + plotH) {
      const qVal = qMin + ((mouseX - padX) / plotW) * (qMax - qMin);
      const pVal = pMin + ((padY + plotH - mouseY) / plotH) * (pMax - pMin);
      const sVal = Math.sqrt(pVal * pVal + qVal * qVal);
      const pfVal = sVal > 0.01 ? Math.min(1.0, Math.abs(pVal) / sVal) : 1.0;
      const tanD = (pVal * xqPu) / (vtPu * vtPu + qVal * xqPu);
      const deltaVal = (Math.atan2(pVal * xqPu, vtPu * vtPu + qVal * xqPu) * 180) / Math.PI;

      setPqHover({ p: pVal, q: qVal, s: sVal, pf: pfVal, deltaDeg: deltaVal });

      if (isInteractiveDragging) {
        updateOpFromMouse(e);
      }
    } else {
      setPqHover(null);
    }
  };

  const handlePqCanvasMouseUp = () => {
    setIsInteractiveDragging(false);
  };

  const updateOpFromMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = pqCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const padX = 60;
    const padY = 40;
    const plotW = canvas.width - 2 * padX;
    const plotH = canvas.height - 2 * padY;

    const qMin = -1.3;
    const qMax = 1.3;
    const pMin = -0.3;
    const pMax = 1.3;

    const clampedX = Math.max(padX, Math.min(padX + plotW, mouseX));
    const clampedY = Math.max(padY, Math.min(padY + plotH, mouseY));

    const qPu = qMin + ((clampedX - padX) / plotW) * (qMax - qMin);
    const pPu = pMin + ((padY + plotH - clampedY) / plotH) * (pMax - pMin);

    setPOpMw(Math.round(pPu * sRatedMva));
    setQOpMvar(Math.round(qPu * sRatedMva));
  };

  // ---------------------------------------------------------------------------
  // CANVAS DRAWING 2: R-X PROTECTION PLANE (ANSI 40 & 32 RELAY MAPPING)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = rxCanvasRef.current;
    if (!canvas || displayDomain !== 'rx_protection') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, width, height);

    const padX = 60;
    const padY = 30;
    const plotW = width - 2 * padX;
    const plotH = height - 2 * padY;

    // R-X scale in per-unit
    const rMin = -1.0;
    const rMax = 2.0;
    const xMin = -2.2;
    const xMax = 1.2;

    const toXPlot = (rVal: number) => padX + ((rVal - rMin) / (rMax - rMin)) * plotW;
    const toYPlot = (xVal: number) => padY + plotH - ((xVal - xMin) / (xMax - xMin)) * plotH;

    // Grid lines
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let r = -0.8; r <= 1.8; r += 0.4) {
      const cx = toXPlot(r);
      ctx.beginPath();
      ctx.moveTo(cx, padY);
      ctx.lineTo(cx, padY + plotH);
      ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${r.toFixed(1)}`, cx, padY + plotH + 15);
    }
    for (let x = -2.0; x <= 1.0; x += 0.5) {
      const cy = toYPlot(x);
      ctx.beginPath();
      ctx.moveTo(padX, cy);
      ctx.lineTo(padX + plotW, cy);
      ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${x.toFixed(1)}`, padX - 8, cy + 3);
    }

    // Main Axes
    const origX = toXPlot(0);
    const origY = toYPlot(0);

    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padX, origY);
    ctx.lineTo(padX + plotW, origY);
    ctx.moveTo(origX, padY);
    ctx.lineTo(origX, padY + plotH);
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('R (pu)', padX + plotW, origY - 8);
    ctx.textAlign = 'left';
    ctx.fillText('+jX (pu)', origX + 8, padY + 12);
    ctx.fillText('-jX (pu) Zone Pertes Excitation', origX + 8, padY + plotH - 5);

    // -------------------------------------------------------------------------
    // DRAW ANSI 40 OFFSET MHO RELAY CIRCLES
    // -------------------------------------------------------------------------
    // Zone 2 Offset Mho Circle
    const z2CenterY = toYPlot(calcResults.mhoCenter2X);
    const z2RadiusPx = (calcResults.mhoRadius2 / (xMax - xMin)) * plotH;

    ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2.0;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.arc(origX, z2CenterY, z2RadiusPx, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    // Zone 1 Offset Mho Circle
    const z1CenterY = toYPlot(calcResults.mhoCenter1X);
    const z1RadiusPx = (calcResults.mhoRadius1 / (xMax - xMin)) * plotH;

    ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(origX, z1CenterY, z1RadiusPx, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Labels for relay zones
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.fillStyle = '#F43F5E';
    ctx.textAlign = 'center';
    ctx.fillText('ANSI 40 Zone 1 (Trip 0.1s)', origX, z1CenterY);
    ctx.fillStyle = '#EF4444';
    ctx.fillText('ANSI 40 Zone 2 (Trip 0.75s)', origX, z2CenterY + z2RadiusPx - 12);

    // Mark -X'd/2 offset
    const offsetPy = toYPlot(-xdPrimePu / 2);
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(origX, offsetPy, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText('-X\'d/2', origX + 25, offsetPy + 3);

    // -------------------------------------------------------------------------
    // PLOT APPARENT IMPEDANCE Z_seen
    // -------------------------------------------------------------------------
    const seenX = toXPlot(calcResults.rSeenPu);
    const seenY = toYPlot(calcResults.xSeenPu);

    const isTrip = calcResults.isAnsi40Zone1Trip || calcResults.isAnsi40Zone2Trip;

    // Vector line from origin
    ctx.strokeStyle = isTrip ? '#EF4444' : '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(origX, origY);
    ctx.lineTo(seenX, seenY);
    ctx.stroke();

    // Impedance point
    ctx.fillStyle = isTrip ? '#EF4444' : '#38BDF8';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(seenX, seenY, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Callout box
    const boxW = 160;
    const boxH = 42;
    let bx = seenX + 12;
    let by = seenY - 20;
    if (bx + boxW > width - 10) bx = seenX - boxW - 12;

    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = isTrip ? '#EF4444' : '#38BDF8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, boxW, boxH, 6);
    else ctx.rect(bx, by, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Z_app: ${calcResults.rSeenPu.toFixed(2)} + j${calcResults.xSeenPu.toFixed(2)} pu`, bx + 8, by + 15);
    ctx.fillStyle = isTrip ? '#EF4444' : '#10B981';
    ctx.fillText(
      isTrip ? '⚠️ DÉCLENCHEMENT PERTE EXC.' : '✅ IMPÉDANCE NORMALE',
      bx + 8,
      by + 30
    );
  }, [displayDomain, calcResults, xdPu, xdPrimePu]);

  // ---------------------------------------------------------------------------
  // CANVAS DRAWING 3: MORDEY V-CURVES (Ia vs Ifd)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = vCurvesCanvasRef.current;
    if (!canvas || displayDomain !== 'v_curves') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, width, height);

    const padX = 60;
    const padY = 30;
    const plotW = width - 2 * padX;
    const plotH = height - 2 * padY;

    // Ifd range (0.2 to 2.4 pu), Ia range (0 to 1.6 pu)
    const ifMin = 0.2;
    const ifMax = 2.4;
    const iaMin = 0.0;
    const iaMax = 1.6;

    const toIfX = (ifVal: number) => padX + ((ifVal - ifMin) / (ifMax - ifMin)) * plotW;
    const toIaY = (iaVal: number) => padY + plotH - ((iaVal - iaMin) / (iaMax - iaMin)) * plotH;

    // Grid lines
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let f = 0.4; f <= 2.2; f += 0.4) {
      const cx = toIfX(f);
      ctx.beginPath();
      ctx.moveTo(cx, padY);
      ctx.lineTo(cx, padY + plotH);
      ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${f.toFixed(1)}`, cx, padY + plotH + 15);
    }
    for (let a = 0.2; a <= 1.4; a += 0.4) {
      const cy = toIaY(a);
      ctx.beginPath();
      ctx.moveTo(padX, cy);
      ctx.lineTo(padX + plotW, cy);
      ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${a.toFixed(1)}`, padX - 8, cy + 3);
    }

    // Axes
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padX, padY + plotH);
    ctx.lineTo(padX + plotW, padY + plotH);
    ctx.moveTo(padX, padY);
    ctx.lineTo(padX, padY + plotH);
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('Courant d\'excitation Ifd (pu)', padX + plotW, padY + plotH + 28);
    ctx.textAlign = 'left';
    ctx.fillText('Courant Stator Ia (pu)', padX - 10, padY - 10);

    // Stator thermal limit line (Ia = 1.0 pu)
    const yIaRated = toIaY(1.0 * coolingFactor);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padX, yIaRated);
    ctx.lineTo(padX + plotW, yIaRated);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#F59E0B';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText(`Ia nominal thermique (${coolingFactor.toFixed(2)} pu)`, padX + 10, yIaRated - 6);

    // Draw V-Curves for P = 0, P = 0.5, P = 1.0
    const pLevels = [
      { p: 0.0, color: '#64748B', label: 'P = 0 (Compensateur synchrone)' },
      { p: 0.5, color: '#38BDF8', label: 'P = 0.5 pu' },
      { p: 1.0, color: '#10B981', label: 'P = 1.0 pu (Pleine charge)' }
    ];

    pLevels.forEach(({ p, color }) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      let started = false;

      for (let ifVal = ifMin; ifVal <= ifMax; ifVal += 0.02) {
        // Ef = ifVal
        // Q = (Ef*Vt*cos(delta) - Vt^2) / Xd
        // Ia = sqrt(P^2 + Q^2) / Vt
        const deltaApprox = Math.asin(Math.min(0.99, (p * xdPu) / (ifVal * vtPu)));
        const qVal = (ifVal * vtPu * Math.cos(deltaApprox) - vtPu * vtPu) / xdPu;
        const iaVal = Math.sqrt(p * p + qVal * qVal) / vtPu;

        if (iaVal <= iaMax) {
          const cx = toIfX(ifVal);
          const cy = toIaY(iaVal);
          if (!started) {
            ctx.moveTo(cx, cy);
            started = true;
          } else {
            ctx.lineTo(cx, cy);
          }
        }
      }
      ctx.stroke();
    });

    // Unity Power Factor line (cos phi = 1.0, minimum of each V-curve)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    for (let p = 0; p <= 1.0; p += 0.1) {
      const ifUnity = Math.sqrt(vtPu * vtPu + Math.pow((p * xdPu) / vtPu, 2));
      const iaUnity = p / vtPu;
      const cx = toIfX(ifUnity);
      const cy = toIaY(iaUnity);
      if (p === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText('cos φ = 1.0', toIfX(1.1), toIaY(0.4));

    // Operating point indicator on V-curve
    const opIf = calcResults.efPu;
    const opIa = calcResults.iStatorPu;
    if (opIf >= ifMin && opIf <= ifMax && opIa <= iaMax) {
      const px = toIfX(opIf);
      const py = toIaY(opIa);

      ctx.fillStyle = '#EC4899';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillText(`Point Réel: If=${opIf.toFixed(2)} pu, Ia=${opIa.toFixed(2)} pu`, px + 10, py - 6);
    }
  }, [displayDomain, calcResults, vtPu, xdPu, coolingFactor]);

  // ---------------------------------------------------------------------------
  // GENERATE FORMAL ENGINEERING REPORT & NOTE
  // ---------------------------------------------------------------------------
  const generateFullEngineeringNote = () => {
    return `================================================================================
CONSEIL SUPÉRIEUR D'INGÉNIERIE & ARCHITECTURE NUMÉRIQUE - EPEDE
NOTE DE CALCUL & AUDIT DE CAPABILITÉ D'ALTERNATEUR SYNCHRONE (P-Q DIAGRAM)
RÉFÉRENTIELS : CEI 60034-1 / IEEE C50.13 / IEEE 421.5 / IEEE C37.102 (ANSI 32/40)
================================================================================
Date du calcul : ${new Date().toISOString().split('T')[0]}
Unité de Production : ${activePreset.toUpperCase()}
Type de rotor : ${isRotorSalient ? 'Pôles Saillants (Hydro)' : 'Rotor Cylindre Lisse (Turbo/Gaz)'}
Système de refroidissement : ${coolingMode.toUpperCase()} (Facteur derating: ${coolingFactor.toFixed(2)})

1. CARACTÉRISTIQUES NOMINALES (PLAQUE SIGNALÉTIQUE)
--------------------------------------------------------------------------------
- Puissance apparente nominale (Sn) : ${sRatedMva} MVA
- Tension nominale entre phases (Un) : ${unKv} kV
- Facteur de puissance nominal (cos phi n) : ${cosPhiRated.toFixed(2)} (Inductif)
- Puissance active nominale (Pn) : ${calcResults.pRatedMw.toFixed(1)} MW
- Puissance réactive nominale (Qn) : ${calcResults.qRatedMvar.toFixed(1)} MVAR
- Courant stator nominal assigné (In) : ${calcResults.iRatedA.toFixed(1)} A
- Impédance de base (Zb) : ${calcResults.zBaseOhm.toFixed(3)} Ohms
- Réactance synchrone axe direct Xd : ${xdPu.toFixed(2)} p.u. (${(xdPu * calcResults.zBaseOhm).toFixed(2)} Ohms)
- Réactance synchrone axe quadrature Xq : ${xqPu.toFixed(2)} p.u. (${(xqPu * calcResults.zBaseOhm).toFixed(2)} Ohms)
- Réactance transitoire X'd : ${xdPrimePu.toFixed(2)} p.u. (${(xdPrimePu * calcResults.zBaseOhm).toFixed(2)} Ohms)

2. CONDITIONS D'EXPLOITATION ACTUELLES & POINT DE DISPATCHING
--------------------------------------------------------------------------------
- Tension aux bornes (Vt) : ${vtPu.toFixed(3)} p.u. (${(vtPu * unKv).toFixed(2)} kV)
- Puissance active injectée (P) : ${pOpMw} MW (${calcResults.pPu.toFixed(3)} p.u.)
- Puissance réactive injectée (Q) : ${qOpMvar} MVAR (${calcResults.qPu.toFixed(3)} p.u.)
- Puissance apparente transitée (S) : ${calcResults.sOpMva.toFixed(1)} MVA (${calcResults.sOpPu.toFixed(3)} p.u.)
- Facteur de puissance en exploitation : ${calcResults.pfOp.toFixed(3)} (${qOpMvar >= 0 ? 'Surexcité / Fourniture Q' : 'Sous-excité / Absorption Q'})
- Courant stator appelé (Ia) : ${calcResults.iStatorA.toFixed(1)} A (${calcResults.iStatorPu.toFixed(3)} p.u.)
- Angle de charge interne rotor (delta) : ${calcResults.deltaDeg.toFixed(1)} deg
- Force électromotrice interne (Ef) : ${calcResults.efPu.toFixed(3)} p.u.
- Ratio de courant d'excitation rotor (Ifd/Ifd_nom) : ${calcResults.ifdRatio.toFixed(2)}

3. VÉRIFICATION DES LIMITES PHYSIQUES & THERMIQUES DE LA MACHINE
--------------------------------------------------------------------------------
- Limite d'échauffement statorique (Ia^2 * Ra) :
  * Taux de charge stator : ${calcResults.statorLoadPct.toFixed(1)} %
  * Statut : ${calcResults.isStatorOverloaded ? 'SURCHARGE THERMIQUE STATORIQUE DANGEREUSE' : 'CONFORME (Sous le seuil d\'isolation)'}

- Limite d'échauffement de l'enroulement d'excitation rotor (Ifd^2 * Rf) :
  * Taux de charge rotor : ${calcResults.rotorLoadPct.toFixed(1)} %
  * Statut : ${calcResults.isRotorOverloaded ? 'SURCHAUFFE ROTORIQUE - RISQUE DÉGÂT ISOLATION' : 'CONFORME'}

- Limite d'échauffement des circuits magnétiques d'extrémité (Sous-excitation / UEL) :
  * Statut : ${calcResults.isUelExceeded ? 'ÉCHAUFFEMENT DES DENTS D\'EXTRÉMITÉ DÉPASSÉ' : 'CONFORME (Flux axial sous contrôle)'}

- Marge de Stabilité Statique (PSSL - delta <= 70 deg) :
  * Statut : ${calcResults.isStabilityAtRisk ? 'DANGER INSTABILITÉ TRANSITOIRE / DÉCROCHAGE' : 'STABILITÉ ASSURÉE'}

- Limite mécanique de la turbine motrice (Régulateur) :
  * Pmax = ${calcResults.pTurbineMaxMw.toFixed(1)} MW | Pmin = ${calcResults.pTurbineMinMw.toFixed(1)} MW
  * Statut : ${calcResults.isTurbineOverloaded ? 'DÉPASSEMENT PUISSANCE TURBINE' : calcResults.isBelowMinTurbine ? 'ATTENTION SOUS-CHARGE TURBINE' : 'CONFORME'}

4. COORDONNÉES DES RELAIS DE PROTECTION GÉNÉRATEUR (ANSI 32 & 40)
--------------------------------------------------------------------------------
- Protection Retour de Puissance (ANSI 32) :
  * Seuil de déclenchement turbine : -${(calcResults.pRatedMw * 0.02).toFixed(1)} MW (2% Pn)
  * Régime actuel : ${calcResults.isReversePower ? 'DÉCLENCHEMENT MARCHE EN MOTEUR' : 'RÉGIME ALTERNATEUR NORMAL'}

- Protection Perte d'Excitation (ANSI 40 - Caractéristique Mho Décentrée de Berdy) :
  * Impédance vue par le relais : Z = ${calcResults.rSeenPu.toFixed(3)} + j(${calcResults.xSeenPu.toFixed(3)}) p.u.
  * Impédance primaire : R = ${calcResults.zSeenOhmR.toFixed(2)} Ohms, X = ${calcResults.zSeenOhmX.toFixed(2)} Ohms
  * Zone 1 Mho (Décentrement -X'd/2 = -${(xdPrimePu/2).toFixed(2)} pu, Diamètre = ${xdPu.toFixed(2)} pu) : ${calcResults.isAnsi40Zone1Trip ? 'TRIP IMMÉDIAT (0.1s)' : 'AUCUN DÉCLENCHEMENT'}
  * Zone 2 Mho (Diamètre = ${(1.3 * xdPu).toFixed(2)} pu, Temporisation 0.75s) : ${calcResults.isAnsi40Zone2Trip ? 'TRIP TEMPORISÉ (0.75s)' : 'AUCUN DÉCLENCHEMENT'}

VERDICT GÉNÉRAL D'EXPLOITATION : ${calcResults.isInsideCapability ? 'EXPLOITATION AUTORISÉE DANS LE DOMAINE DE CAPABILITÉ NOMINALE' : 'EXPLOITATION HORS DOMAINE NOMINAL - ALERTE DÉCLENCHEMENT OU ENDOMMAGEMENT'}
================================================================================`;
  };

  const handleCopyReport = () => {
    const text = generateFullEngineeringNote();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2500);
    });
  };

  const handleDownloadReport = () => {
    const text = generateFullEngineeringNote();
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Audit_Capabilite_Alternateur_${activePreset.toUpperCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-[#0C131D] via-[#101926] to-[#0A1018] border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                MODULE 13 &bull; CEI 60034-1 &bull; IEEE C50.13 &bull; ANSI 32 / 40
              </span>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                CENTRALES HYDRAULIQUES & THERMIQUES
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-2.5">
              <Compass className="h-6 w-6 text-cyan-400" />
              <span>
                {locale === 'fr'
                  ? 'Diagramme de Capabilité P-Q & Exploitation Alternateur Synchrone'
                  : 'Synchronous Generator P-Q Capability Chart & Grid Operation Lab'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Simulation interactive du domaine de fonctionnement admissible (échauffements stator/rotor, limite de sous-excitation UEL, marge de stabilité PSSL et relais perte d\'excitation ANSI 40).'
                : 'Interactive modeling of generator operating envelope (stator/rotor heating, underexcitation core-end limit UEL, PSSL steady-state stability, and ANSI 40 loss-of-field protection).'}
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono text-neutral-400">{locale === 'fr' ? 'Groupes de Production :' : 'Machine Presets:'}</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleApplyPreset('hydro_nachtigal')}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all border ${
                  activePreset === 'hydro_nachtigal'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-[#0E141D] text-neutral-400 border-[#252E38] hover:text-white'
                }`}
              >
                Nachtigal (120 MVA)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('gas_kribi')}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all border ${
                  activePreset === 'gas_kribi'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-[#0E141D] text-neutral-400 border-[#252E38] hover:text-white'
                }`}
              >
                Kribi Gaz (58 MVA)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('steam_thermal')}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all border ${
                  activePreset === 'steam_thermal'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-[#0E141D] text-neutral-400 border-[#252E38] hover:text-white'
                }`}
              >
                Turbo Vapeur (350 MVA)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('hydro_songloulou')}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all border ${
                  activePreset === 'hydro_songloulou'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-[#0E141D] text-neutral-400 border-[#252E38] hover:text-white'
                }`}
              >
                Song Loulou (48 MVA)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 font-mono">
        <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Puissance P / Pn</span>
          <div className="text-lg font-bold text-white flex items-baseline gap-1 mt-1">
            <span>{pOpMw}</span>
            <span className="text-xs text-neutral-400">/ {calcResults.pRatedMw.toFixed(0)} MW</span>
          </div>
          <span className="text-[11px] text-cyan-400 font-bold">{calcResults.pPu.toFixed(2)} p.u.</span>
        </div>

        <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Réactif Q / Qn</span>
          <div className="text-lg font-bold text-white flex items-baseline gap-1 mt-1">
            <span>{qOpMvar > 0 ? `+${qOpMvar}` : qOpMvar}</span>
            <span className="text-xs text-neutral-400">MVAR</span>
          </div>
          <span className={`text-[11px] font-bold ${qOpMvar >= 0 ? 'text-cyan-400' : 'text-purple-400'}`}>
            {qOpMvar >= 0 ? 'Surexcité (Fourni)' : 'Sous-excité (Abs.)'}
          </span>
        </div>

        <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Facteur Puissance</span>
          <div className="text-lg font-bold text-white flex items-baseline gap-1 mt-1">
            <span>{calcResults.pfOp.toFixed(3)}</span>
          </div>
          <span className="text-[11px] text-amber-300 font-bold">
            {qOpMvar >= 0 ? 'Inductif (Arrière)' : 'Capacitif (Avant)'}
          </span>
        </div>

        <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Charge Stator (Ia)</span>
          <div className="text-lg font-bold text-white flex items-baseline gap-1 mt-1">
            <span>{calcResults.iStatorA.toFixed(0)}</span>
            <span className="text-xs text-neutral-400">A</span>
          </div>
          <span className={`text-[11px] font-bold ${calcResults.isStatorOverloaded ? 'text-rose-400' : 'text-emerald-400'}`}>
            {calcResults.statorLoadPct.toFixed(1)}% {calcResults.isStatorOverloaded ? '⚠️ Surcharge' : 'OK'}
          </span>
        </div>

        <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Angle Rotor (δ)</span>
          <div className="text-lg font-bold text-white flex items-baseline gap-1 mt-1">
            <span>{calcResults.deltaDeg.toFixed(1)}</span>
            <span className="text-xs text-neutral-400">°</span>
          </div>
          <span className={`text-[11px] font-bold ${calcResults.isStabilityAtRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
            {calcResults.deltaDeg > 70 ? '⚠️ Instable (>70°)' : 'Stable (<70°)'}
          </span>
        </div>

        <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Relais ANSI 40</span>
          <div className="text-lg font-bold text-white flex items-baseline gap-1 mt-1">
            <span>{calcResults.isAnsi40Zone1Trip ? 'TRIP Z1' : calcResults.isAnsi40Zone2Trip ? 'TRIP Z2' : 'OK'}</span>
          </div>
          <span className={`text-[11px] font-bold ${calcResults.isAnsi40Zone1Trip || calcResults.isAnsi40Zone2Trip ? 'text-rose-400' : 'text-emerald-400'}`}>
            {calcResults.isAnsi40Zone1Trip || calcResults.isAnsi40Zone2Trip ? '⚠️ Perte Excitation' : 'Excitation Saine'}
          </span>
        </div>
      </div>

      {/* Main Content Layout: Controls on Left, Graphics & Canvases on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Generator & Dispatch Controls */}
        <div className="space-y-4">
          {/* Machine Electrical Sizing Card */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-4 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                <Cpu className="h-4 w-4" />
                1. {locale === 'fr' ? 'Caractéristiques Alternateur' : 'Machine Parameters'}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">{unKv} kV &bull; {sRatedMva} MVA</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>{locale === 'fr' ? 'Puissance Apparente (Sn) :' : 'Rated MVA (Sn):'}</span>
                  <span className="text-white font-bold">{sRatedMva} MVA</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="600"
                  step="5"
                  value={sRatedMva}
                  onChange={(e) => setSRatedMva(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>{locale === 'fr' ? 'Facteur de Puissance Nom. :' : 'Rated Power Factor:'}</span>
                  <span className="text-white font-bold">{cosPhiRated.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="0.95"
                  step="0.01"
                  value={cosPhiRated}
                  onChange={(e) => setCosPhiRated(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-neutral-400 text-[11px] block mb-1">Xd (p.u.)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.8"
                    max="2.5"
                    value={xdPu}
                    onChange={(e) => setXdPu(parseFloat(e.target.value) || 1.0)}
                    className="w-full bg-[#080B10] border border-[#252E38] rounded px-2 py-1 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 text-[11px] block mb-1">Xq (p.u.)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="2.4"
                    value={xqPu}
                    onChange={(e) => setXqPu(parseFloat(e.target.value) || 0.7)}
                    className="w-full bg-[#080B10] border border-[#252E38] rounded px-2 py-1 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 text-[11px] block mb-1">X'd transitoire (p.u.)</label>
                <input
                  type="number"
                  step="0.02"
                  min="0.15"
                  max="0.45"
                  value={xdPrimePu}
                  onChange={(e) => setXdPrimePu(parseFloat(e.target.value) || 0.25)}
                  className="w-full bg-[#080B10] border border-[#252E38] rounded px-2 py-1 text-white font-bold"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-400">{locale === 'fr' ? 'Technologie Rotor :' : 'Rotor Construction:'}</span>
                <button
                  type="button"
                  onClick={() => setIsRotorSalient(!isRotorSalient)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                    isRotorSalient
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                  }`}
                >
                  {isRotorSalient ? 'Pôles Saillants (Hydro)' : 'Rotor Lisse (Turbo)'}
                </button>
              </div>
            </div>
          </div>

          {/* Operating Point & Grid Voltage Dispatch Card */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-4 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <Sliders className="h-4 w-4" />
                2. {locale === 'fr' ? 'Point de Fonctionnement (P, Q)' : 'Dispatch Controls (P, Q)'}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                calcResults.isInsideCapability
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {calcResults.isInsideCapability ? (locale === 'fr' ? 'AUTORISÉ' : 'ALLOWED') : (locale === 'fr' ? 'HORS CAPABILITÉ' : 'LIMIT EXCEEDED')}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>{locale === 'fr' ? 'Puissance Active P :' : 'Active Power P:'}</span>
                  <span className="text-cyan-300 font-bold">{pOpMw} MW ({calcResults.pPu.toFixed(2)} pu)</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max={Math.round(calcResults.pRatedMw * 1.2)}
                  step="1"
                  value={pOpMw}
                  onChange={(e) => setPOpMw(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>{locale === 'fr' ? 'Puissance Réactive Q :' : 'Reactive Power Q:'}</span>
                  <span className={`${qOpMvar >= 0 ? 'text-cyan-300' : 'text-purple-300'} font-bold`}>
                    {qOpMvar > 0 ? `+${qOpMvar}` : qOpMvar} MVAR ({calcResults.qPu.toFixed(2)} pu)
                  </span>
                </div>
                <input
                  type="range"
                  min={-Math.round(sRatedMva * 0.9)}
                  max={Math.round(sRatedMva * 0.9)}
                  step="1"
                  value={qOpMvar}
                  onChange={(e) => setQOpMvar(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>{locale === 'fr' ? 'Tension Réseau aux Bornes Vt :' : 'Terminal Voltage Vt:'}</span>
                  <span className="text-white font-bold">{vtPu.toFixed(2)} pu ({(vtPu * unKv).toFixed(1)} kV)</span>
                </div>
                <input
                  type="range"
                  min="0.90"
                  max="1.10"
                  step="0.01"
                  value={vtPu}
                  onChange={(e) => setVtPu(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="text-neutral-400 text-[11px] block mb-1 flex items-center gap-1">
                  <Wind className="h-3 w-3 text-cyan-400" />
                  {locale === 'fr' ? 'Refroidissement & Derating :' : 'Cooling Medium:'}
                </label>
                <select
                  value={coolingMode}
                  onChange={(e) => setCoolingMode(e.target.value as any)}
                  className="w-full bg-[#080B10] border border-[#252E38] rounded px-2.5 py-1.5 text-white font-mono text-xs"
                >
                  <option value="air_open">Air Ouvert / Circuit Fermé (k=1.00)</option>
                  <option value="h2_1bar">Hydrogène H2 @ 1.0 bar (k=0.85)</option>
                  <option value="h2_2bar">Hydrogène H2 @ 2.0 bar (k=0.95)</option>
                  <option value="h2_3bar">Hydrogène H2 @ 3.0 bar nominal (k=1.05)</option>
                  <option value="water_cooled">Stator Refroidi à l'Eau Pure (k=1.15)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPOpMw(Math.round(calcResults.pRatedMw * 0.9));
                    setQOpMvar(Math.round(calcResults.qRatedMvar * 0.6));
                  }}
                  className="flex-1 py-1.5 rounded text-xs font-bold bg-[#080B10] text-neutral-300 border border-[#252E38] hover:text-white hover:border-neutral-500 transition-colors"
                >
                  Nominal 90%
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPOpMw(0);
                    setQOpMvar(Math.round(sRatedMva * 0.7));
                  }}
                  className="flex-1 py-1.5 rounded text-xs font-bold bg-[#080B10] text-cyan-300 border border-[#252E38] hover:border-cyan-500 transition-colors"
                >
                  Compensateur
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right 2 Cols: Interactive Graphic Views & Analysis */}
        <div className="lg:col-span-2 space-y-4">
          {/* Domain Selection Tabs */}
          <div className="flex flex-wrap items-center justify-between border-b border-[#252E38] pb-2 gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setDisplayDomain('pq_chart')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  displayDomain === 'pq_chart'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm'
                    : 'bg-[#0D1117] text-neutral-400 hover:text-white border-[#252E38]'
                }`}
              >
                1. {locale === 'fr' ? 'Diagramme de Capabilité P-Q' : 'P-Q Capability Chart'}
              </button>

              <button
                type="button"
                onClick={() => setDisplayDomain('rx_protection')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  displayDomain === 'rx_protection'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400 shadow-sm'
                    : 'bg-[#0D1117] text-neutral-400 hover:text-white border-[#252E38]'
                }`}
              >
                2. {locale === 'fr' ? 'Plan R-X & Relais ANSI 40/32' : 'R-X Plane & ANSI 40/32'}
              </button>

              <button
                type="button"
                onClick={() => setDisplayDomain('v_curves')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  displayDomain === 'v_curves'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm'
                    : 'bg-[#0D1117] text-neutral-400 hover:text-white border-[#252E38]'
                }`}
              >
                3. {locale === 'fr' ? 'Courbes en V de Mordey (Ia/If)' : 'Mordey V-Curves (Ia/If)'}
              </button>

              <button
                type="button"
                onClick={() => setDisplayDomain('report')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  displayDomain === 'report'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-sm'
                    : 'bg-[#0D1117] text-neutral-400 hover:text-white border-[#252E38]'
                }`}
              >
                4. {locale === 'fr' ? 'Note d\'Ingénierie & Dispatch' : 'Engineering Report & BOM'}
              </button>
            </div>

            <div className="text-[11px] font-mono text-neutral-400 hidden sm:block">
              CEI 60034-1 &bull; IEEE C50.13
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="bg-[#080B10] border border-[#252E38] rounded-xl p-4 overflow-hidden relative shadow-inner">
            {displayDomain === 'pq_chart' && (
              <div className="space-y-2">
                <canvas
                  ref={pqCanvasRef}
                  width={700}
                  height={380}
                  onMouseDown={handlePqCanvasMouseDown}
                  onMouseMove={handlePqCanvasMouseMove}
                  onMouseUp={handlePqCanvasMouseUp}
                  className="w-full h-auto rounded-lg cursor-crosshair"
                />
                <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
                  <span>
                    {locale === 'fr'
                      ? '💡 Cliquez-glissez directement sur le graphique pour ajuster le point (P, Q).'
                      : '💡 Click and drag directly on the canvas to dispatch operating point (P, Q).'}
                  </span>
                  {pqHover && (
                    <span className="text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                      P: {(pqHover.p * sRatedMva).toFixed(0)} MW &bull; Q: {(pqHover.q * sRatedMva).toFixed(0)} MVAR &bull; cosφ: {pqHover.pf.toFixed(3)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {displayDomain === 'rx_protection' && (
              <div className="space-y-2">
                <canvas
                  ref={rxCanvasRef}
                  width={700}
                  height={380}
                  className="w-full h-auto rounded-lg"
                />
                <div className="text-[11px] font-mono text-neutral-400 px-1">
                  {locale === 'fr'
                    ? '💡 Diagramme d\'impédance vue au niveau des bornes de l\'alternateur. Le cercle Zone 1 (0.1s) et Zone 2 (0.75s) protègent contre la perte d\'excitation sans déclenchement intempestif sur oscillation stable.'
                    : '💡 Apparent terminal impedance locus. Zone 1 (0.1s) and Zone 2 (0.75s) offset mho circles safeguard against loss of synchronism without false tripping during power swings.'}
                </div>
              </div>
            )}

            {displayDomain === 'v_curves' && (
              <div className="space-y-2">
                <canvas
                  ref={vCurvesCanvasRef}
                  width={700}
                  height={380}
                  className="w-full h-auto rounded-lg"
                />
                <div className="text-[11px] font-mono text-neutral-400 px-1">
                  {locale === 'fr'
                    ? '💡 Courbes en V de Mordey : Courant statorique Ia en fonction du courant d\'excitation rotorique Ifd pour différents niveaux de puissance active P. Le point rouge indique l\'état réel de fonctionnement.'
                    : '💡 Mordey V-Curves: Stator current Ia as a function of field excitation current Ifd for constant power levels. The red dot represents the live operating state.'}
                </div>
              </div>
            )}

            {/* TAB 4: FORMAL REPORT & DISPATCH AUDIT */}
            {displayDomain === 'report' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#252E38]">
                  <div>
                    <h3 className="text-sm font-mono font-bold text-purple-400 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {locale === 'fr'
                        ? 'Note de Calcul de Capabilité Alternateur & Dispatching Réseau'
                        : 'Synchronous Generator Capability & Dispatching Engineering Report'}
                    </h3>
                    <p className="text-[11px] font-mono text-neutral-400">
                      CEI 60034-1 &bull; IEEE C50.13 &bull; IEEE 421.5 &bull; IEEE C37.102
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyReport}
                      className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copiedStatus ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier la Note' : 'Copy Report')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadReport}
                      className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-[#0D1117] text-neutral-300 border border-[#252E38] hover:text-white hover:border-neutral-500 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{locale === 'fr' ? 'Télécharger .txt' : 'Download .txt'}</span>
                    </button>
                  </div>
                </div>

                {/* Audit Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3 space-y-2">
                    <span className="text-xs font-mono font-bold text-amber-400 block">
                      {locale === 'fr' ? 'Thermique Stator (Ia)' : 'Stator Heating (Ia)'}
                    </span>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Courant actuel :</span>
                        <span className="font-bold text-white">{calcResults.iStatorA.toFixed(1)} A</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Taux de charge :</span>
                        <span className={`font-bold ${calcResults.isStatorOverloaded ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {calcResults.statorLoadPct.toFixed(1)} %
                        </span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Statut thermique :</span>
                        <span className={calcResults.isStatorOverloaded ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {calcResults.isStatorOverloaded ? 'Surcharge !' : 'Conforme'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3 space-y-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 block">
                      {locale === 'fr' ? 'Excitation Rotor (Ifd)' : 'Rotor Field (Ifd)'}
                    </span>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">FEM interne Ef :</span>
                        <span className="font-bold text-white">{calcResults.efPu.toFixed(3)} pu</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Taux Ifd / Ifd_nom :</span>
                        <span className={`font-bold ${calcResults.isRotorOverloaded ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {(calcResults.ifdRatio * 100).toFixed(1)} %
                        </span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Statut rotor :</span>
                        <span className={calcResults.isRotorOverloaded ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {calcResults.isRotorOverloaded ? 'Surchauffe !' : 'Conforme'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-3 space-y-2">
                    <span className="text-xs font-mono font-bold text-pink-400 block">
                      {locale === 'fr' ? 'Sous-excitation & Stabilité' : 'Stability & UEL Limit'}
                    </span>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Angle rotor δ :</span>
                        <span className={`font-bold ${calcResults.deltaDeg > 70 ? 'text-rose-400' : 'text-white'}`}>
                          {calcResults.deltaDeg.toFixed(1)}° (Max 70°)
                        </span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Limite têtes UEL :</span>
                        <span className={`font-bold ${calcResults.isUelExceeded ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {calcResults.isUelExceeded ? 'Flux axial critique' : 'Conforme'}
                        </span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span className="text-neutral-400">Relais ANSI 40 :</span>
                        <span className={calcResults.isAnsi40Zone1Trip || calcResults.isAnsi40Zone2Trip ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {calcResults.isAnsi40Zone1Trip ? 'Déclenchement Z1' : calcResults.isAnsi40Zone2Trip ? 'Déclenchement Z2' : 'Verrouillé'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span>{locale === 'fr' ? 'Note de Calcul Intégrale (Format Texte Certifié) :' : 'Complete Certified Engineering Note:'}</span>
                    <button
                      type="button"
                      onClick={handleCopyReport}
                      className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{copiedStatus ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier tout' : 'Copy all')}</span>
                    </button>
                  </div>
                  <pre className="bg-[#05070A] border border-[#252E38] rounded-xl p-3 text-[11px] font-mono text-neutral-300 overflow-x-auto max-h-60 select-all whitespace-pre-wrap leading-relaxed">
                    {generateFullEngineeringNote()}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
