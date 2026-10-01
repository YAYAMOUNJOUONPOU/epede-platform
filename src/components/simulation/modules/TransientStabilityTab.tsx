// src/components/simulation/modules/TransientStabilityTab.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Zap, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sliders, 
  Layers,
  Gauge,
  Play,
  Square
} from 'lucide-react';

interface TransientStabilityTabProps {
  locale: 'fr' | 'en';
}

export const TransientStabilityTab: React.FC<TransientStabilityTabProps> = ({ locale }) => {
  // -------------------------------------------------------------
  // 9. TRANSIENT STABILITY & EQUAL AREA CRITERION (SMIB) STATE
  // -------------------------------------------------------------
  const [stabPm, setStabPm] = useState<number>(0.82); // Mechanical power (p.u.)
  const [stabH, setStabH] = useState<number>(4.0); // Inertia constant H (seconds)
  const [stabDamping, setStabDamping] = useState<number>(0.03); // Damping factor D (p.u.)
  const [stabTClearMs, setStabTClearMs] = useState<number>(140); // Clearing time in ms
  const [stabFaultSeverity, setStabFaultSeverity] = useState<number>(0.15); // During-fault transfer capability ratio (Pmax2 / Pmax1)
  const [stabGenMva, setStabGenMva] = useState<number>(500); // Generator MVA base
  const [stabLineVoltKv, setStabLineVoltKv] = useState<number>(225); // 225 kV line
  const [stabActivePreset, setStabActivePreset] = useState<'nachtigal' | 'memveele' | 'kribi' | 'songloulou' | 'custom'>('nachtigal');
  const [stabIsPlaying, setStabIsPlaying] = useState<boolean>(true);
  const [stabAnimFrame, setStabAnimFrame] = useState<number>(0);

  const stabPowerAngleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const stabTimeDomainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // System parameters in p.u. on Generator MVA Base
  const stabXdPrime = 0.25; // Generator transient reactance X'd
  const stabXTrafo = 0.15; // Step-up transformer reactance Xt
  const stabXLine = 0.40; // Reactance per circuit of double line
  const stabEgPrime = 1.20; // Internal transient emf Eg'
  const stabVInf = 1.00; // Infinite bus voltage V_inf
  const stabFNom = 50; // Frequency 50 Hz
  const stabOmega0 = 2 * Math.PI * stabFNom; // 314.159 rad/s

  // Pre-fault total reactance (two parallel lines)
  const stabXPre = stabXdPrime + stabXTrafo + stabXLine / 2; // 0.60 p.u.
  const stabPMax1 = (stabEgPrime * stabVInf) / stabXPre; // 2.00 p.u.

  // Initial power angle delta0
  const stabClampedPm = Math.min(stabPm, stabPMax1 * 0.96);
  const stabDelta0Rad = Math.asin(Math.min(0.999, Math.max(-0.999, stabClampedPm / stabPMax1)));
  const stabDelta0Deg = (stabDelta0Rad * 180) / Math.PI;

  // During-fault maximum electrical power
  const stabPMax2 = stabFaultSeverity * stabPMax1;

  // Post-fault total reactance (faulted line tripped, 1 line remaining)
  const stabXPost = stabXdPrime + stabXTrafo + stabXLine; // 0.80 p.u.
  const stabPMax3 = (stabEgPrime * stabVInf) / stabXPost; // 1.50 p.u.

  // Post-fault equilibrium angle
  const stabDeltaPost0Rad = Math.asin(Math.min(0.999, Math.max(-0.999, stabClampedPm / stabPMax3)));
  const stabDeltaPost0Deg = (stabDeltaPost0Rad * 180) / Math.PI;

  // Maximum allowable angle for deceleration
  const stabDeltaMaxRad = Math.PI - stabDeltaPost0Rad;
  const stabDeltaMaxDeg = (stabDeltaMaxRad * 180) / Math.PI;

  // Equal Area Criterion: Analytical Critical Clearing Angle delta_cc
  const stabNumCos = stabClampedPm * (stabDeltaMaxRad - stabDelta0Rad) + stabPMax3 * Math.cos(stabDeltaMaxRad) - stabPMax2 * Math.cos(stabDelta0Rad);
  const stabDenCos = stabPMax3 - stabPMax2;
  const stabCosDeltaCc = stabDenCos !== 0 ? stabNumCos / stabDenCos : -1;
  const stabDeltaCcRad = stabCosDeltaCc >= -1 && stabCosDeltaCc <= 1 ? Math.acos(stabCosDeltaCc) : Math.PI;
  const stabDeltaCcDeg = (stabDeltaCcRad * 180) / Math.PI;

  // Approximate Critical Clearing Time (CCT) in ms
  const stabPAccFault = Math.max(0.05, stabClampedPm - stabPMax2 * Math.sin(stabDelta0Rad));
  const stabTCcSecEst = Math.sqrt(Math.max(0, (4 * stabH * Math.max(0, stabDeltaCcRad - stabDelta0Rad)) / (stabOmega0 * stabPAccFault)));
  const stabTCcMsEst = Math.round(stabTCcSecEst * 1000);

  // Time-domain simulation using Runge-Kutta 4 (RK4)
  const stabTrajectory = useMemo(() => {
    const dt = 0.002; // 2 ms time step
    const tTotal = 3.0; // 3.0 seconds
    const steps = Math.floor(tTotal / dt);

    const tFault = 0.10; // Fault at 0.10 s
    const tClear = tFault + stabTClearMs / 1000;

    const points: Array<{
      t: number;
      deltaRad: number;
      deltaDeg: number;
      omegaRel: number;
      freqHz: number;
      pe: number;
      stage: 'pre' | 'fault' | 'post';
    }> = [];

    let delta = stabDelta0Rad;
    let omegaRel = 0; // Speed deviation in rad/s
    let isUnstable = false;

    const getDerivs = (tNow: number, d: number, w: number) => {
      let pe: number;
      if (tNow < tFault) {
        pe = stabPMax1 * Math.sin(d);
      } else if (tNow < tClear) {
        pe = stabPMax2 * Math.sin(d);
      } else {
        pe = stabPMax3 * Math.sin(d);
      }

      const dDelta = w;
      const dOmega = (stabOmega0 / (2 * Math.max(0.5, stabH))) * (stabClampedPm - pe - stabDamping * w);
      return { dDelta, dOmega, pe };
    };

    let maxDeltaDeg = stabDelta0Deg;
    let actualDeltaClearDeg = stabDelta0Deg;

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;

      if (Math.abs(t - tClear) < dt) {
        actualDeltaClearDeg = (delta * 180) / Math.PI;
      }

      const stage = t < tFault ? 'pre' : t < tClear ? 'fault' : 'post';
      const deg = (delta * 180) / Math.PI;
      if (deg > maxDeltaDeg) maxDeltaDeg = deg;

      if (deg > 180 || delta > Math.PI) {
        isUnstable = true;
      }

      const currentDerivs = getDerivs(t, delta, omegaRel);
      points.push({
        t: Math.round(t * 1000) / 1000,
        deltaRad: delta,
        deltaDeg: deg,
        omegaRel,
        freqHz: stabFNom + omegaRel / (2 * Math.PI),
        pe: currentDerivs.pe,
        stage
      });

      // RK4 step
      const k1 = getDerivs(t, delta, omegaRel);
      const k2 = getDerivs(t + dt / 2, delta + (dt / 2) * k1.dDelta, omegaRel + (dt / 2) * k1.dOmega);
      const k3 = getDerivs(t + dt / 2, delta + (dt / 2) * k2.dDelta, omegaRel + (dt / 2) * k2.dOmega);
      const k4 = getDerivs(t + dt, delta + dt * k3.dDelta, omegaRel + dt * k3.dOmega);

      delta += (dt / 6) * (k1.dDelta + 2 * k2.dDelta + 2 * k3.dDelta + k4.dDelta);
      omegaRel += (dt / 6) * (k1.dOmega + 2 * k2.dOmega + 2 * k3.dOmega + k4.dOmega);

      if (delta > 3 * Math.PI) {
        delta = 3 * Math.PI;
        isUnstable = true;
      }
    }

    return {
      points,
      isUnstable,
      maxDeltaDeg,
      actualDeltaClearDeg
    };
  }, [
    stabTClearMs,
    stabH,
    stabDamping,
    stabFaultSeverity,
    stabClampedPm,
    stabPMax1,
    stabPMax2,
    stabPMax3,
    stabDelta0Rad,
    stabDelta0Deg,
    stabOmega0,
    stabFNom
  ]);

  // Actual Areas A1 and A2
  const stabDeltaCRad = (stabTrajectory.actualDeltaClearDeg * Math.PI) / 180;
  const stabAreaA1 = Math.max(0, stabClampedPm * (stabDeltaCRad - stabDelta0Rad) + stabPMax2 * (Math.cos(stabDeltaCRad) - Math.cos(stabDelta0Rad)));
  const stabAreaA2 = Math.max(0, stabPMax3 * (Math.cos(stabDeltaCRad) - Math.cos(stabDeltaMaxRad)) - stabClampedPm * (stabDeltaMaxRad - stabDeltaCRad));
  const stabMarginPct = stabAreaA1 > 0 ? Math.round(((stabAreaA2 - stabAreaA1) / stabAreaA1) * 100) : 0;

  const isStabSafe = !stabTrajectory.isUnstable && stabAreaA2 >= stabAreaA1;
  const stabVerdict = isStabSafe
    ? {
        label: locale === 'fr' ? 'RÉSEAU STABLE (AMORTI CONVERGENT)' : 'SYSTEM STABLE (CONVERGENT OSCILLATION)',
        color: '#10B981',
        desc: locale === 'fr'
          ? `Marge de stabilité transitoire +${stabMarginPct}%. Temps d'élimination ${stabTClearMs} ms < CCT (${stabTCcMsEst} ms).`
          : `Transient stability margin +${stabMarginPct}%. Clearing time ${stabTClearMs} ms < CCT (${stabTCcMsEst} ms).`
      }
    : {
        label: locale === 'fr' ? 'DÉCROCHAGE / PERTE DE SYNCHRONISME (ANSI 78)' : 'OUT-OF-STEP / POLE SLIP DETECTED (ANSI 78)',
        color: '#EF4444',
        desc: locale === 'fr'
          ? `Énergie accélératrice excessive (A1 > A2). L'angle rotorique dépasse 180°. Risque d'écroulement généralisé.`
          : `Excessive accelerating energy (A1 > A2). Rotor angle exceeds 180°. Risk of general blackout.`
      };

  // Animation cursor loop
  useEffect(() => {
    if (!stabIsPlaying) return;
    let animId: number;
    const updateAnim = () => {
      setStabAnimFrame((prev) => (prev + 1) % 1500);
      animId = requestAnimationFrame(updateAnim);
    };
    animId = requestAnimationFrame(updateAnim);
    return () => cancelAnimationFrame(animId);
  }, [stabIsPlaying]);

  // Canvas 1: Power-Angle Curves (P-delta Plane)
  useEffect(() => {
        const canvas = stabPowerAngleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerW = canvas.parentElement?.clientWidth;
    const w = (canvas.width = Math.max(320, containerW && containerW > 50 ? containerW : 550));
    const h = (canvas.height = 340);

    const padL = 50;
    const padR = 25;
    const padT = 25;
    const padB = 40;
    const plotW = Math.max(100, w - padL - padR);
    const plotH = Math.max(100, h - padT - padB);

    const maxDeltaPlotDeg = 180;
    const maxPPlot = 2.4;

    const toScrX = (deg: number) => padL + (deg / maxDeltaPlotDeg) * plotW;
    const toScrY = (p: number) => padT + plotH - (p / maxPPlot) * plotH;

    // Background
    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.lineWidth = 1;
    ctx.font = '9px ui-monospace, monospace';

    for (let deg = 0; deg <= 180; deg += 30) {
      const sx = toScrX(deg);
      ctx.strokeStyle = deg === 0 ? 'rgba(148, 163, 184, 0.4)' : 'rgba(37, 46, 56, 0.6)';
      ctx.beginPath();
      ctx.moveTo(sx, padT);
      ctx.lineTo(sx, padT + plotH);
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'center';
      ctx.fillText(`${deg}°`, sx, padT + plotH + 13);
    }

    for (let p = 0; p <= maxPPlot; p += 0.5) {
      const sy = toScrY(p);
      ctx.strokeStyle = p === 0 ? 'rgba(148, 163, 184, 0.4)' : 'rgba(37, 46, 56, 0.6)';
      ctx.beginPath();
      ctx.moveTo(padL, sy);
      ctx.lineTo(padL + plotW, sy);
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'right';
      ctx.fillText(`${p.toFixed(1)}`, padL - 8, sy + 3);
    }

    // Axis Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 10px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Angle Rotorique δ (Degrés)', padL + plotW / 2, padT + plotH + 30);

    ctx.save();
    ctx.translate(padL - 32, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Puissance P (p.u.)', 0, 0);
    ctx.restore();

    // Shaded Area A1 (Accelerating Area: from delta0 to deltaC, between Pm and Pe2)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.beginPath();
    ctx.moveTo(toScrX(stabDelta0Deg), toScrY(stabClampedPm));
    for (let d = stabDelta0Deg; d <= stabTrajectory.actualDeltaClearDeg; d += 1) {
      const p2 = stabPMax2 * Math.sin((d * Math.PI) / 180);
      ctx.lineTo(toScrX(d), toScrY(p2));
    }
    ctx.lineTo(toScrX(stabTrajectory.actualDeltaClearDeg), toScrY(stabClampedPm));
    ctx.closePath();
    ctx.fill();

    // Shaded Area A2 (Decelerating Area: from deltaC to deltaMax, between Pe3 and Pm)
    ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
    ctx.beginPath();
    ctx.moveTo(toScrX(stabTrajectory.actualDeltaClearDeg), toScrY(stabClampedPm));
    for (let d = stabTrajectory.actualDeltaClearDeg; d <= Math.min(180, stabDeltaMaxDeg); d += 1) {
      const p3 = stabPMax3 * Math.sin((d * Math.PI) / 180);
      ctx.lineTo(toScrX(d), toScrY(p3));
    }
    ctx.lineTo(toScrX(Math.min(180, stabDeltaMaxDeg)), toScrY(stabClampedPm));
    ctx.closePath();
    ctx.fill();

    // Text labels for Areas A1 and A2
    const midA1Deg = (stabDelta0Deg + stabTrajectory.actualDeltaClearDeg) / 2;
    ctx.fillStyle = '#F87171';
    ctx.font = 'bold 11px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`A1 (Accél.) = ${stabAreaA1.toFixed(3)}`, toScrX(midA1Deg), toScrY(stabClampedPm * 0.6));

    const midA2Deg = (stabTrajectory.actualDeltaClearDeg + Math.min(180, stabDeltaMaxDeg)) / 2;
    ctx.fillStyle = '#34D399';
    ctx.fillText(`A2 (Décél.) = ${stabAreaA2.toFixed(3)}`, toScrX(midA2Deg), toScrY(stabClampedPm * 1.3));

    // Draw Pre-fault curve Pmax1 * sin(delta) (Gold)
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let d = 0; d <= 180; d += 2) {
      const p = stabPMax1 * Math.sin((d * Math.PI) / 180);
      const sx = toScrX(d);
      const sy = toScrY(p);
      if (d === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Draw Post-fault curve Pmax3 * sin(delta) (Purple)
    ctx.strokeStyle = '#A855F7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let d = 0; d <= 180; d += 2) {
      const p = stabPMax3 * Math.sin((d * Math.PI) / 180);
      const sx = toScrX(d);
      const sy = toScrY(p);
      if (d === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Draw During-fault curve Pmax2 * sin(delta) (Red)
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let d = 0; d <= 180; d += 2) {
      const p = stabPMax2 * Math.sin((d * Math.PI) / 180);
      const sx = toScrX(d);
      const sy = toScrY(p);
      if (d === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Draw Mechanical Power Line Pm (Dashed Amber)
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(padL, toScrY(stabClampedPm));
    ctx.lineTo(padL + plotW, toScrY(stabClampedPm));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Pm = ${stabClampedPm.toFixed(2)} p.u.`, padL + plotW - 95, toScrY(stabClampedPm) - 6);

    // Draw Vertical Delta markers
    const drawMarker = (deg: number, color: string, label: string) => {
      const sx = toScrX(deg);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(sx, padT);
      ctx.lineTo(sx, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = color;
      ctx.font = 'bold 9px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, sx, padT + 12);
    };

    drawMarker(stabDelta0Deg, '#FACC15', `δ0 (${stabDelta0Deg.toFixed(1)}°)`);
    drawMarker(stabTrajectory.actualDeltaClearDeg, '#06B6D4', `δc (${stabTrajectory.actualDeltaClearDeg.toFixed(1)}°)`);
    if (stabDeltaCcDeg < 180) {
      drawMarker(stabDeltaCcDeg, '#EC4899', `δcc (${stabDeltaCcDeg.toFixed(1)}°)`);
    }

    // Animated operating point along curve
    const curIdx = Math.min(stabAnimFrame, stabTrajectory.points.length - 1);
    const curPt = stabTrajectory.points[curIdx];
    if (curPt) {
      const curScrX = toScrX(Math.min(180, curPt.deltaDeg));
      const curScrY = toScrY(Math.min(maxPPlot, curPt.pe));

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(curScrX, curScrY, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [
    stabClampedPm,
    stabPMax1,
    stabPMax2,
    stabPMax3,
    stabDelta0Deg,
    stabDeltaCcDeg,
    stabDeltaMaxDeg,
    stabTrajectory,
    stabAreaA1,
    stabAreaA2,
    stabAnimFrame
  ]);

  // Canvas 2: Time-Domain Trajectory delta(t) & Frequency Deviation
  useEffect(() => {
        const canvas = stabTimeDomainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerW = canvas.parentElement?.clientWidth;
    const w = (canvas.width = Math.max(320, containerW && containerW > 50 ? containerW : 550));
    const h = (canvas.height = 340);

    const padL = 50;
    const padR = 25;
    const padT = 25;
    const padB = 40;
    const plotW = Math.max(100, w - padL - padR);
    const plotH = Math.max(100, h - padT - padB);

    const maxT = 3.0; // 3.0 seconds
    const maxDeltaPlot = 200; // degrees

    const toScrX = (t: number) => padL + (t / maxT) * plotW;
    const toScrY = (deg: number) => padT + plotH - (deg / maxDeltaPlot) * plotH;

    // Background
    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, w, h);

    // Time Grid
    ctx.lineWidth = 1;
    ctx.font = '9px ui-monospace, monospace';

    for (let t = 0; t <= maxT; t += 0.5) {
      const sx = toScrX(t);
      ctx.strokeStyle = t === 0 ? 'rgba(148, 163, 184, 0.4)' : 'rgba(37, 46, 56, 0.6)';
      ctx.beginPath();
      ctx.moveTo(sx, padT);
      ctx.lineTo(sx, padT + plotH);
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'center';
      ctx.fillText(`${t.toFixed(1)}s`, sx, padT + plotH + 13);
    }

    // Delta Grid
    for (let deg = 0; deg <= maxDeltaPlot; deg += 40) {
      const sy = toScrY(deg);
      ctx.strokeStyle = deg === 0 ? 'rgba(148, 163, 184, 0.4)' : 'rgba(37, 46, 56, 0.6)';
      ctx.beginPath();
      ctx.moveTo(padL, sy);
      ctx.lineTo(padL + plotW, sy);
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'right';
      ctx.fillText(`${deg}°`, padL - 8, sy + 3);
    }

    // Axis Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 10px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Temps t (Secondes)', padL + plotW / 2, padT + plotH + 30);

    ctx.save();
    ctx.translate(padL - 32, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Angle Rotorique δ (°)', 0, 0);
    ctx.restore();

    // Stability Boundary Line (180 degrees)
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padL, toScrY(180));
    ctx.lineTo(padL + plotW, toScrY(180));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Limite de Stabilité (180°)', padL + plotW - 145, toScrY(180) - 5);

    // Draw Fault Inception and Clearance Zone
    const tFault = 0.10;
    const tClear = tFault + stabTClearMs / 1000;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.fillRect(toScrX(tFault), padT, toScrX(tClear) - toScrX(tFault), plotH);

    ctx.fillStyle = '#F87171';
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`Défaut (${stabTClearMs} ms)`, (toScrX(tFault) + toScrX(tClear)) / 2, padT + 12);

    // Draw CCT marker
    const tCcSec = stabTCcMsEst / 1000;
    if (tCcSec <= maxT) {
      const cctX = toScrX(0.10 + tCcSec);
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cctX, padT);
      ctx.lineTo(cctX, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#EC4899';
      ctx.font = 'bold 9px ui-monospace, monospace';
      ctx.fillText(`CCT: ${stabTCcMsEst}ms`, cctX + 4, padT + 25);
    }

    // Plot delta(t)
    ctx.strokeStyle = isStabSafe ? '#10B981' : '#EF4444';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    stabTrajectory.points.forEach((pt, idx) => {
      const sx = toScrX(pt.t);
      const sy = toScrY(Math.min(maxDeltaPlot, pt.deltaDeg));
      if (idx === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    });
    ctx.stroke();

    // Moving time cursor
    const curIdx = Math.min(stabAnimFrame, stabTrajectory.points.length - 1);
    const curPt = stabTrajectory.points[curIdx];
    if (curPt) {
      const curX = toScrX(curPt.t);
      const curY = toScrY(Math.min(maxDeltaPlot, curPt.deltaDeg));

      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(curX, padT);
      ctx.lineTo(curX, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(curX, curY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Readout
      ctx.fillStyle = '#E0F2FE';
      ctx.font = 'bold 10px ui-monospace, monospace';
      ctx.fillText(`t=${curPt.t.toFixed(2)}s | δ=${curPt.deltaDeg.toFixed(1)}° | f=${curPt.freqHz.toFixed(2)}Hz`, padL + 10, padT + plotH - 10);
    }
  }, [
    stabTClearMs,
    stabTCcMsEst,
    stabTrajectory,
    isStabSafe,
    stabAnimFrame
  ]);

  return (
        <div className="space-y-6">
          {/* Top Status & Stability Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div 
              className="p-4 rounded-xl border flex items-center gap-3 transition-all"
              style={{
                backgroundColor: `${stabVerdict.color}15`,
                borderColor: `${stabVerdict.color}60`
              }}
            >
              <div 
                className="w-3.5 h-3.5 rounded-full animate-ping shrink-0"
                style={{ backgroundColor: stabVerdict.color }}
              />
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                  {locale === 'fr' ? 'VERDICT STABILITÉ TRANSITOIRE' : 'TRANSIENT STABILITY VERDICT'}
                </div>
                <div className="text-sm font-bold font-mono" style={{ color: stabVerdict.color }}>
                  {stabVerdict.label}
                </div>
              </div>
            </div>

            <div className="bg-[#11161D] p-4 rounded-xl border border-[#252E38]">
              <div className="text-[10px] text-neutral-400 font-mono uppercase">
                {locale === 'fr' ? 'Temps Critique d\'Élimination (CCT)' : 'Critical Clearing Time (CCT)'}
              </div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                {stabTCcMsEst} ms
              </div>
              <div className="text-[10px] text-neutral-400 mt-1 font-mono">
                {locale === 'fr' 
                  ? `Élimination actuelle : ${stabTClearMs} ms (${stabTClearMs <= stabTCcMsEst ? `Marge : +${stabTCcMsEst - stabTClearMs} ms` : `Dépassement : -${stabTClearMs - stabTCcMsEst} ms`})` 
                  : `Actual clearing: ${stabTClearMs} ms (${stabTClearMs <= stabTCcMsEst ? `Margin: +${stabTCcMsEst - stabTClearMs} ms` : `Deficit: -${stabTClearMs - stabTCcMsEst} ms`})`}
              </div>
            </div>

            <div className="bg-[#11161D] p-4 rounded-xl border border-[#252E38]">
              <div className="text-[10px] text-neutral-400 font-mono uppercase">
                {locale === 'fr' ? 'Angle Critique δ_cc / δ_0' : 'Critical Angle δ_cc / δ_0'}
              </div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                {stabDeltaCcDeg < 180 ? `${stabDeltaCcDeg.toFixed(1)}°` : 'N/A'}
              </div>
              <div className="text-[10px] text-neutral-400 mt-1 font-mono">
                δ_0 = {stabDelta0Deg.toFixed(1)}° · δ_c = {stabTrajectory.actualDeltaClearDeg.toFixed(1)}° · δ_max = {stabDeltaMaxDeg.toFixed(1)}°
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              isStabSafe 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
            }`}>
              <div className="text-[10px] font-mono uppercase">
                {locale === 'fr' ? 'Bilan Énergétique (Aires A1 / A2)' : 'Energy Balance (A1 / A2)'}
              </div>
              <div className={`text-base font-bold font-mono mt-0.5 ${isStabSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                A1={stabAreaA1.toFixed(3)} | A2={stabAreaA2.toFixed(3)}
              </div>
              <div className="text-[10px] mt-1 font-mono">
                {isStabSafe 
                  ? `${locale === 'fr' ? 'Marge d\'énergie :' : 'Energy margin:'} +${stabMarginPct}% (A2 ≥ A1)` 
                  : `${locale === 'fr' ? 'Déficit d\'énergie :' : 'Energy deficit:'} ${stabMarginPct}% (A1 > A2)`}
              </div>
            </div>
          </div>

          {/* Dual Interactive Graph View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Graph 1: Power-Angle P-delta Plane & Equal Area Criterion */}
            <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="font-bold text-[#F3F4F6]">
                    {locale === 'fr' ? 'COURBES PUISSANCE-ANGLE & CRITÈRE DES AIRES' : 'POWER-ANGLE CURVES & EQUAL AREA CRITERION'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 font-mono font-bold">
                  P = P_max · sin(δ)
                </span>
              </div>

              {/* Canvas 1 */}
              <div className="relative w-full overflow-hidden rounded-xl border border-[#252E38]/80 bg-[#080B10]">
                <canvas ref={stabPowerAngleCanvasRef} className="w-full block" />
              </div>

              {/* Legend & Area Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-[#11161D] border border-yellow-500/30">
                  <div className="text-yellow-400 font-bold">Pré-défaut (2 Lignes)</div>
                  <div className="text-[10px] text-neutral-400">P_max1 = {stabPMax1.toFixed(2)} p.u.</div>
                </div>
                <div className="p-2 rounded-lg bg-[#11161D] border border-red-500/30">
                  <div className="text-red-400 font-bold">Pendant Défaut</div>
                  <div className="text-[10px] text-neutral-400">P_max2 = {stabPMax2.toFixed(2)} p.u.</div>
                </div>
                <div className="p-2 rounded-lg bg-[#11161D] border border-purple-500/30">
                  <div className="text-purple-400 font-bold">Post-défaut (1 Ligne)</div>
                  <div className="text-[10px] text-neutral-400">P_max3 = {stabPMax3.toFixed(2)} p.u.</div>
                </div>
                <div className="p-2 rounded-lg bg-[#11161D] border border-amber-500/30">
                  <div className="text-amber-400 font-bold">Consigne P_m</div>
                  <div className="text-[10px] text-neutral-400">{stabClampedPm.toFixed(2)} p.u. ({(stabClampedPm * stabGenMva).toFixed(0)} MW)</div>
                </div>
              </div>
            </div>

            {/* Graph 2: Time-Domain Swing Equation Simulation delta(t) */}
            <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-bold text-[#F3F4F6]">
                    {locale === 'fr' ? 'TRAJECTOIRE TEMPORELLE δ(t) (ÉQUATION DE SWING RK4)' : 'TIME-DOMAIN ROTOR TRAJECTORY δ(t) (SWING RK4)'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStabIsPlaying((prev) => !prev)}
                    className="px-2.5 py-1 rounded bg-[#161C24] border border-[#252E38] hover:border-cyan-400 text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all"
                  >
                    {stabIsPlaying ? <Square className="h-3 w-3 text-amber-400" /> : <Play className="h-3 w-3 text-emerald-400" />}
                    <span>{stabIsPlaying ? (locale === 'fr' ? 'Pause' : 'Pause') : (locale === 'fr' ? 'Animer' : 'Play')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStabAnimFrame(0)}
                    className="p-1 rounded bg-[#161C24] border border-[#252E38] hover:border-cyan-400 text-neutral-400 hover:text-white transition-all"
                    title={locale === 'fr' ? 'Réinitialiser t = 0' : 'Reset t = 0'}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Canvas 2 */}
              <div className="relative w-full overflow-hidden rounded-xl border border-[#252E38]/80 bg-[#080B10]">
                <canvas ref={stabTimeDomainCanvasRef} className="w-full block" />
              </div>

              {/* Trajectory Details */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-[#11161D] border border-[#252E38]">
                  <div className="text-neutral-400 text-[10px]">Élongation Max δ_max</div>
                  <div className={`font-bold mt-0.5 ${stabTrajectory.maxDeltaDeg > 180 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {stabTrajectory.maxDeltaDeg.toFixed(1)}°
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-[#11161D] border border-[#252E38]">
                  <div className="text-neutral-400 text-[10px]">Temps Défaut t_c</div>
                  <div className="font-bold text-cyan-400 mt-0.5">
                    {stabTClearMs} ms
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-[#11161D] border border-[#252E38]">
                  <div className="text-neutral-400 text-[10px]">Fréquence Initiale</div>
                  <div className="font-bold text-white mt-0.5">
                    50.00 Hz
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Controls & Grid Presets Panel */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-3 font-mono">
              <span className="font-bold text-sm text-[#F3F4F6]">
                {locale === 'fr' ? 'PARAMÈTRES RÉSEAU, CENTRALE ET DISJONCTEUR' : 'GENERATOR, NETWORK & BREAKER SETTINGS'}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 font-bold">
                CEI 60034-1 / IEEE C37.102
              </span>
            </div>

            {/* Presets */}
            <div>
              <label className="text-[10px] text-neutral-400 font-mono uppercase block mb-1.5">
                {locale === 'fr' ? 'Centrales Réelles & Lignes d\'Évacuation (Cameroun / International) :' : 'Real Power Plants & Evacuation Corridors:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setStabActivePreset('nachtigal');
                    setStabPm(0.84);
                    setStabH(4.2);
                    setStabDamping(0.03);
                    setStabTClearMs(120);
                    setStabFaultSeverity(0.10);
                    setStabGenMva(500);
                    setStabLineVoltKv(225);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    stabActivePreset === 'nachtigal'
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-[#252E38] bg-[#161C24] hover:border-emerald-500/50'
                  }`}
                >
                  <div className="font-bold text-xs text-white">Nachtigal Hydro (420 MW)</div>
                  <div className="text-[10px] text-neutral-400">RIS 225 kV · H = 4.2 s</div>
                  <div className="text-[9px] text-emerald-400 mt-0.5">Évacuation Nyom 2 (2x225 kV)</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStabActivePreset('memveele');
                    setStabPm(0.80);
                    setStabH(3.6);
                    setStabDamping(0.025);
                    setStabTClearMs(140);
                    setStabFaultSeverity(0.12);
                    setStabGenMva(250);
                    setStabLineVoltKv(225);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    stabActivePreset === 'memveele'
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-[#252E38] bg-[#161C24] hover:border-cyan-500/50'
                  }`}
                >
                  <div className="font-bold text-xs text-white">Memve'ele Hydro (211 MW)</div>
                  <div className="text-[10px] text-neutral-400">RIS 225 kV · H = 3.6 s</div>
                  <div className="text-[9px] text-cyan-400 mt-0.5">Ligne 225 kV Ahala (280 km)</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStabActivePreset('kribi');
                    setStabPm(0.78);
                    setStabH(5.2);
                    setStabDamping(0.04);
                    setStabTClearMs(110);
                    setStabFaultSeverity(0.20);
                    setStabGenMva(280);
                    setStabLineVoltKv(225);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    stabActivePreset === 'kribi'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-[#252E38] bg-[#161C24] hover:border-amber-500/50'
                  }`}
                >
                  <div className="font-bold text-xs text-white">Kribi Gaz (216 MW)</div>
                  <div className="text-[10px] text-neutral-400">Thermique gaz · H = 5.2 s</div>
                  <div className="text-[9px] text-amber-400 mt-0.5">Évacuation Bekoko / Mangombé</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStabActivePreset('songloulou');
                    setStabPm(0.88);
                    setStabH(3.8);
                    setStabDamping(0.03);
                    setStabTClearMs(150);
                    setStabFaultSeverity(0.15);
                    setStabGenMva(440);
                    setStabLineVoltKv(225);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    stabActivePreset === 'songloulou'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-[#252E38] bg-[#161C24] hover:border-purple-500/50'
                  }`}
                >
                  <div className="font-bold text-xs text-white">Songloulou Hydro (384 MW)</div>
                  <div className="text-[10px] text-neutral-400">RIS 225 kV · H = 3.8 s</div>
                  <div className="text-[9px] text-purple-400 mt-0.5">Liaison Mangombé / Douala</div>
                </button>
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3 border-t border-[#252E38] font-mono text-xs">
              
              {/* Slider 1: Fault Clearing Time */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 font-bold">
                    {locale === 'fr' ? 'Temps d\'Élimination t_clear :' : 'Clearing Time t_clear:'}
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                    stabTClearMs <= stabTCcMsEst ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {stabTClearMs} ms
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="350"
                  step="5"
                  value={stabTClearMs}
                  onChange={(e) => {
                    setStabTClearMs(parseInt(e.target.value));
                    setStabActivePreset('custom');
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>40 ms (Ultra-rapide)</span>
                  <span className="text-pink-400 font-bold">CCT: {stabTCcMsEst} ms</span>
                  <span>350 ms (Retardé)</span>
                </div>
              </div>

              {/* Slider 2: Mechanical Power Pm */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 font-bold">
                    {locale === 'fr' ? 'Puissance Mécanique P_m :' : 'Mechanical Power P_m:'}
                  </span>
                  <span className="text-amber-400 font-bold">
                    {stabPm.toFixed(2)} p.u. ({(stabPm * stabGenMva).toFixed(0)} MW)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="1.40"
                  step="0.02"
                  value={stabPm}
                  onChange={(e) => {
                    setStabPm(parseFloat(e.target.value));
                    setStabActivePreset('custom');
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>0.30 p.u. (Charge faible)</span>
                  <span>1.0 p.u. (Nominale)</span>
                  <span>1.40 p.u. (Surcharge)</span>
                </div>
              </div>

              {/* Slider 3: Inertia Constant H */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 font-bold">
                    {locale === 'fr' ? 'Constante d\'Inertie H :' : 'Inertia Constant H:'}
                  </span>
                  <span className="text-purple-400 font-bold">
                    {stabH.toFixed(1)} s
                  </span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="8.0"
                  step="0.1"
                  value={stabH}
                  onChange={(e) => {
                    setStabH(parseFloat(e.target.value));
                    setStabActivePreset('custom');
                  }}
                  className="w-full accent-purple-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>1.5 s (Turbine gaz)</span>
                  <span>4.0 s (Hydro Francis)</span>
                  <span>8.0 s (Grande inertie)</span>
                </div>
              </div>

            </div>

            {/* Bottom Row: Fault Severity, Damping & Principles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3 border-t border-[#252E38] font-mono text-xs">
              
              {/* Fault transfer capability */}
              <div className="space-y-1">
                <div className="flex justify-between text-neutral-400">
                  <span>{locale === 'fr' ? 'Transfert Résiduel Défaut P_max2 / P_max1 :' : 'Fault Residual Transfer:'}</span>
                  <span className="text-white font-bold">{(stabFaultSeverity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.40"
                  step="0.02"
                  value={stabFaultSeverity}
                  onChange={(e) => {
                    setStabFaultSeverity(parseFloat(e.target.value));
                    setStabActivePreset('custom');
                  }}
                  className="w-full accent-red-500 cursor-pointer"
                />
                <div className="text-[10px] text-neutral-500 flex justify-between">
                  <span>0% (Court-circuit franc barres)</span>
                  <span>40% (Défaut éloigné)</span>
                </div>
              </div>

              {/* Damping */}
              <div className="space-y-1">
                <div className="flex justify-between text-neutral-400">
                  <span>{locale === 'fr' ? 'Amortissement D :' : 'Damping Factor D:'}</span>
                  <span className="text-white font-bold">{stabDamping.toFixed(3)} p.u.</span>
                </div>
                <input
                  type="range"
                  min="0.00"
                  max="0.08"
                  step="0.005"
                  value={stabDamping}
                  onChange={(e) => {
                    setStabDamping(parseFloat(e.target.value));
                    setStabActivePreset('custom');
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="text-[10px] text-neutral-500 flex justify-between">
                  <span>0.00 (Sans amortissement)</span>
                  <span>0.08 (Fort amortissement)</span>
                </div>
              </div>

              {/* Standards and Principles card */}
              <div className="p-3 rounded-lg bg-[#080B10] border border-[#252E38] space-y-1 text-[10px]">
                <div className="text-emerald-400 font-bold mb-1">
                  {locale === 'fr' ? 'Principes & Normes (CEI 60034 / IEEE) :' : 'Transient Stability Standards:'}
                </div>
                <div className="text-neutral-400">• Équation de Swing : (2H/ω0) · d²δ/dt² = P_m - P_e - D·Δω</div>
                <div className="text-neutral-400">• Critère des Aires : A1 (accélération) ≤ A2 (décélération)</div>
                <div className="text-neutral-400">• Déclenchement sélectif ANSI 78 si l'angle dépasse la limite critique</div>
              </div>

            </div>
          </div>
        </div>
      );
};
