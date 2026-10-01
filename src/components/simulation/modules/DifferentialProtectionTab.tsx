// src/components/simulation/modules/DifferentialProtectionTab.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  GitMerge, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Activity, 
  Zap, 
  Layers
} from 'lucide-react';

interface DifferentialProtectionTabProps {
  locale: 'fr' | 'en';
}

export const DifferentialProtectionTab: React.FC<DifferentialProtectionTabProps> = ({ locale }) => {
  // -------------------------------------------------------------
  // 10. TRANSFORMER DIFFERENTIAL PROTECTION ANSI 87T STATE
  // -------------------------------------------------------------
  const [diffSnMva, setDiffSnMva] = useState<number>(63); // 63 MVA
  const [diffU1Kv, setDiffU1Kv] = useState<number>(225); // 225 kV
  const [diffU2Kv, setDiffU2Kv] = useState<number>(30); // 30 kV
  const [diffVectorGroup, setDiffVectorGroup] = useState<'Dyn11' | 'YNd11' | 'Dyn1' | 'Yy0'>('Dyn11');
  const [diffCt1Prim, setDiffCt1Prim] = useState<number>(200); // 200/1 A
  const [diffCt2Prim, setDiffCt2Prim] = useState<number>(1500); // 1500/1 A

  // Dual-Slope Percentage Restraint settings (p.u. of In)
  const [diffIs1, setDiffIs1] = useState<number>(0.25); // Base pickup Is1 (0.20 - 0.40 p.u.)
  const [diffSlope1, setDiffSlope1] = useState<number>(0.30); // Slope 1 (20% - 40%)
  const [diffIs2, setDiffIs2] = useState<number>(2.0); // Knee point Is2 (1.5 - 2.5 p.u.)
  const [diffSlope2, setDiffSlope2] = useState<number>(0.70); // Slope 2 (60% - 80%)
  const [diffIinst, setDiffIinst] = useState<number>(8.0); // Instantaneous unrestrained threshold (6.0 - 10.0 p.u.)

  // Harmonic Restraint thresholds
  const [diffH2Thresh, setDiffH2Thresh] = useState<number>(15); // 15% 2nd harmonic
  const [diffH5Thresh, setDiffH5Thresh] = useState<number>(30); // 30% 5th harmonic

  // Injection / Simulation scenario
  const [diffActiveScenario, setDiffActiveScenario] = useState<
    'normal' | 'through_fault' | 'internal_light' | 'internal_heavy' | 'inrush' | 'overexcitation' | 'ct_saturation_external' | 'custom'
  >('normal');

  const [diffI1Mag, setDiffI1Mag] = useState<number>(1.0); // p.u.
  const [diffI1Angle, setDiffI1Angle] = useState<number>(0); // deg
  const [diffI2Mag, setDiffI2Mag] = useState<number>(1.0); // p.u.
  const [diffI2Angle, setDiffI2Angle] = useState<number>(180); // deg (through-load convention)
  const [diffH2Pct, setDiffH2Pct] = useState<number>(0); // %
  const [diffH5Pct, setDiffH5Pct] = useState<number>(0); // %

  const diffCharCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const diffPhasorCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Electrical computations
  const diffIn1 = (diffSnMva * 1e3) / (Math.sqrt(3) * diffU1Kv); // Amps
  const diffIn2 = (diffSnMva * 1e3) / (Math.sqrt(3) * diffU2Kv); // Amps

  // Vector conversion for currents in zone convention
  const rad1 = (diffI1Angle * Math.PI) / 180;
  const rad2 = (diffI2Angle * Math.PI) / 180;
  const diffI1x = diffI1Mag * Math.cos(rad1);
  const diffI1y = diffI1Mag * Math.sin(rad1);
  const diffI2x = diffI2Mag * Math.cos(rad2);
  const diffI2y = diffI2Mag * Math.sin(rad2);

  // Differential and Restraint Currents
  const diffIdx = diffI1x + diffI2x;
  const diffIdy = diffI1y + diffI2y;
  const diffId = Math.sqrt(diffIdx * diffIdx + diffIdy * diffIdy);
  const diffIr = (diffI1Mag + diffI2Mag) / 2;

  // Dual-slope threshold at current Ir
  let diffThresholdAtIr = diffIs1;
  if (diffIr <= diffIs2) {
    diffThresholdAtIr = diffIs1 + diffSlope1 * diffIr;
  } else {
    diffThresholdAtIr = diffIs1 + diffSlope1 * diffIs2 + diffSlope2 * (diffIr - diffIs2);
  }

  // Harmonic block conditions
  const isH2Blocked = diffH2Pct >= diffH2Thresh;
  const isH5Blocked = diffH5Pct >= diffH5Thresh;
  const isInstantaneousTrip = diffId >= diffIinst;
  const isPercentageTrip = diffId >= diffThresholdAtIr;

  // Overall Relay Decision
  let diffTripStatus: {
    state: 'STABLE' | 'TRIP_PERCENTAGE' | 'TRIP_INSTANTANEOUS' | 'BLOCKED_H2' | 'BLOCKED_H5';
    label: string;
    color: string;
    description: string;
    operatingTimeMs: number;
  };

  if (isInstantaneousTrip) {
    diffTripStatus = {
      state: 'TRIP_INSTANTANEOUS',
      label: locale === 'fr' ? 'DÉCLENCHEMENT INSTANTANÉ NON RETENU (ANSI 87U)' : 'INSTANTANEOUS UNRESTRAINED TRIP (ANSI 87U)',
      color: '#EF4444',
      description: locale === 'fr'
        ? `Court-circuit interne violent (> ${diffIinst} In). Déclenchement ultra-rapide sans retenue ni filtrage harmonique pour protéger l'intégrité de la cuve.`
        : `Catastrophic internal fault (> ${diffIinst} In). Ultra-fast clearance without restraint or harmonic delay.`,
      operatingTimeMs: 12
    };
  } else if (isH2Blocked) {
    diffTripStatus = {
      state: 'BLOCKED_H2',
      label: locale === 'fr' ? 'BLOCAGE INRUSH HARMONIQUE 2 (H2 DETECTÉ)' : 'INRUSH RESTRAINT H2 (BLOCKING)',
      color: '#F59E0B',
      description: locale === 'fr'
        ? `Taux d'harmonique 2 = ${diffH2Pct}% (Seuil ${diffH2Thresh}%). Courant magnétisant d'enclenchement détecté. Déclenchement inhibé.`
        : `2nd harmonic ratio = ${diffH2Pct}% (Threshold ${diffH2Thresh}%). Transformer energization inrush detected. Trip inhibited.`,
      operatingTimeMs: 0
    };
  } else if (isH5Blocked) {
    diffTripStatus = {
      state: 'BLOCKED_H5',
      label: locale === 'fr' ? 'BLOCAGE SURFLUXAGE HARMONIQUE 5 (H5 DETECTÉ)' : 'OVEREXCITATION RESTRAINT H5 (BLOCKING)',
      color: '#3B82F6',
      description: locale === 'fr'
        ? `Taux d'harmonique 5 = ${diffH5Pct}% (Seuil ${diffH5Thresh}%). Surfluxage magnétique V/Hz sans court-circuit. Déclenchement 87T inhibé (transfert à ANSI 24).`
        : `5th harmonic ratio = ${diffH5Pct}% (Threshold ${diffH5Thresh}%). V/Hz core saturation overexcitation detected. Trip inhibited.`,
      operatingTimeMs: 0
    };
  } else if (isPercentageTrip) {
    diffTripStatus = {
      state: 'TRIP_PERCENTAGE',
      label: locale === 'fr' ? 'DÉCLENCHEMENT DIFFÉRENTIEL RETENU (ANSI 87T)' : 'RESTRAINED DIFFERENTIAL TRIP (ANSI 87T)',
      color: '#EC4899',
      description: locale === 'fr'
        ? `Défaut interne avéré dans la zone protégée (Id = ${diffId.toFixed(2)} p.u. > Seuil ${diffThresholdAtIr.toFixed(2)} p.u.). Ordre de déclenchement émis aux disjoncteurs HT et BT.`
        : `Internal fault within protected zone (Id = ${diffId.toFixed(2)} p.u. > Threshold ${diffThresholdAtIr.toFixed(2)} p.u.). Trip issued to HV and LV breakers.`,
      operatingTimeMs: 25
    };
  } else {
    diffTripStatus = {
      state: 'STABLE',
      label: locale === 'fr' ? 'ZONE DE RETENUE — STABILITÉ PARFAITE' : 'RESTRAINT ZONE — STABLE',
      color: '#10B981',
      description: locale === 'fr'
        ? `Régime équilibré ou défaut traversant externe. Courant différentiel résiduel (${diffId.toFixed(2)} p.u.) inférieur au seuil de retenue (${diffThresholdAtIr.toFixed(2)} p.u.).`
        : `Normal through-load or external through-fault. Operating current (${diffId.toFixed(2)} p.u.) is below restraint threshold (${diffThresholdAtIr.toFixed(2)} p.u.).`,
      operatingTimeMs: 0
    };
  }

  // Preset switch helper
  const applyDiffScenario = (scen: typeof diffActiveScenario) => {
    setDiffActiveScenario(scen);
    if (scen === 'normal') {
      setDiffI1Mag(1.0);
      setDiffI1Angle(0);
      setDiffI2Mag(1.0);
      setDiffI2Angle(180);
      setDiffH2Pct(2);
      setDiffH5Pct(1);
    } else if (scen === 'through_fault') {
      setDiffI1Mag(4.5);
      setDiffI1Angle(0);
      setDiffI2Mag(4.2); // slight CT error
      setDiffI2Angle(175);
      setDiffH2Pct(4);
      setDiffH5Pct(2);
    } else if (scen === 'internal_light') {
      setDiffI1Mag(1.8);
      setDiffI1Angle(0);
      setDiffI2Mag(0.4);
      setDiffI2Angle(0); // flowing in same direction into fault
      setDiffH2Pct(3);
      setDiffH5Pct(2);
    } else if (scen === 'internal_heavy') {
      setDiffI1Mag(8.5);
      setDiffI1Angle(0);
      setDiffI2Mag(3.0);
      setDiffI2Angle(10);
      setDiffH2Pct(1);
      setDiffH5Pct(1);
    } else if (scen === 'inrush') {
      setDiffI1Mag(3.2);
      setDiffI1Angle(0);
      setDiffI2Mag(0.0); // secondary unloaded
      setDiffI2Angle(180);
      setDiffH2Pct(24); // Heavy 2nd harmonic
      setDiffH5Pct(3);
    } else if (scen === 'overexcitation') {
      setDiffI1Mag(1.4);
      setDiffI1Angle(0);
      setDiffI2Mag(0.2);
      setDiffI2Angle(180);
      setDiffH2Pct(5);
      setDiffH5Pct(36); // Heavy 5th harmonic
    } else if (scen === 'ct_saturation_external') {
      // External heavy through fault where CT2 saturates, causing severe false differential current Id
      setDiffI1Mag(6.5);
      setDiffI1Angle(0);
      setDiffI2Mag(3.2); // CT2 secondary collapsed due to core saturation
      setDiffI2Angle(155); // Phase shift caused by distorted waveform peak
      setDiffH2Pct(18); // Harmonic 2 generated by asymmetric half-wave saturation
      setDiffH5Pct(6);
    }
  };

  // Canvas 1: Dual-Slope Characteristic Curve (Id vs Ir Plane)
  useEffect(() => {
    const canvas = diffCharCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerW = canvas.parentElement?.clientWidth;
    const w = (canvas.width = Math.max(320, containerW && containerW > 50 ? containerW : 550));
    const h = (canvas.height = 360);

    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, w, h);

    const padLeft = 45;
    const padBottom = 35;
    const padTop = 25;
    const padRight = 25;
    const plotW = w - padLeft - padRight;
    const plotH = h - padBottom - padTop;

    const maxIr = 8.0;
    const maxId = 10.0;

    const toX = (ir: number) => padLeft + (ir / maxIr) * plotW;
    const toY = (id: number) => padTop + (1 - id / maxId) * plotH;

    // Grid lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(37, 46, 56, 0.6)';
    ctx.fillStyle = '#64748B';
    ctx.font = '9px ui-monospace, monospace';

    for (let ir = 0; ir <= maxIr; ir += 1.0) {
      const x = toX(ir);
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, padTop + plotH);
      ctx.stroke();
      ctx.fillText(`${ir.toFixed(0)}`, x - 3, padTop + plotH + 14);
    }

    for (let id = 0; id <= maxId; id += 2.0) {
      const y = toY(id);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + plotW, y);
      ctx.stroke();
      ctx.fillText(`${id.toFixed(0)}`, 10, y + 3);
    }

    // Axes labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.fillText('Ir (p.u.) — Retenue (Restraint)', padLeft + plotW / 2 - 60, h - 6);

    ctx.save();
    ctx.translate(14, padTop + plotH / 2 + 50);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Id (p.u.) — Différentiel (Operating)', 0, 0);
    ctx.restore();

    // Fill Trip Region (above dual-slope curve)
    ctx.fillStyle = 'rgba(236, 72, 153, 0.08)';
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(diffIs1));

    // Knee point
    const idKnee = diffIs1 + diffSlope1 * diffIs2;
    ctx.lineTo(toX(diffIs2), toY(idKnee));

    // Up to maxIr or instantaneous threshold
    const idAtMaxIr = Math.min(diffIinst, idKnee + diffSlope2 * (maxIr - diffIs2));
    ctx.lineTo(toX(maxIr), toY(idAtMaxIr));
    ctx.lineTo(toX(maxIr), toY(maxId));
    ctx.lineTo(toX(0), toY(maxId));
    ctx.closePath();
    ctx.fill();

    // Fill Instantaneous High-Set Trip Region (Id >= diffIinst)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.fillRect(toX(0), toY(maxId), plotW, toY(diffIinst) - toY(maxId));

    // Draw Dual Slope Boundary Line
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#F43F5E';
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(diffIs1));
    ctx.lineTo(toX(diffIs2), toY(idKnee));
    ctx.lineTo(toX(maxIr), toY(idAtMaxIr));
    ctx.stroke();

    // Instantaneous line
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#EF4444';
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(diffIinst));
    ctx.lineTo(toX(maxIr), toY(diffIinst));
    ctx.stroke();
    ctx.setLineDash([]);

    // Text on curves
    ctx.fillStyle = '#F43F5E';
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.fillText(`Pente 1 (${(diffSlope1 * 100).toFixed(0)}%)`, toX(diffIs2 * 0.4), toY(diffIs1 + diffSlope1 * diffIs2 * 0.4) - 8);
    ctx.fillText(`Pente 2 (${(diffSlope2 * 100).toFixed(0)}%)`, toX(Math.min(maxIr - 1, diffIs2 + 1.2)), toY(idKnee + diffSlope2 * 1.2) - 8);

    ctx.fillStyle = '#EF4444';
    ctx.fillText(`Seuil Inst. 87U = ${diffIinst.toFixed(1)} p.u.`, toX(maxIr - 3.5), toY(diffIinst) - 6);

    // Knee Point Marker
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(toX(diffIs2), toY(idKnee), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '8px ui-monospace, monospace';
    ctx.fillText(`Knee Is2=${diffIs2.toFixed(1)}`, toX(diffIs2) - 15, toY(idKnee) + 14);

    // Current Operating Point (Ir, Id)
    const ptX = toX(Math.min(maxIr, diffIr));
    const ptY = toY(Math.min(maxId, diffId));

    // Glow ring
    ctx.fillStyle = diffTripStatus.color;
    ctx.beginPath();
    ctx.arc(ptX, ptY, 8, 0, Math.PI * 2);
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Solid dot
    ctx.beginPath();
    ctx.arc(ptX, ptY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Coordinates Tag
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.fillText(
      `Point (Ir=${diffIr.toFixed(2)}, Id=${diffId.toFixed(2)})`,
      Math.min(ptX + 8, w - 160),
      Math.max(ptY - 8, padTop + 14)
    );
  }, [diffIs1, diffSlope1, diffIs2, diffSlope2, diffIinst, diffIr, diffId, diffTripStatus.color]);

  // Canvas 2: Vector Phasor Diagram & Harmonics Bar Scope
  useEffect(() => {
    const canvas = diffPhasorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerW = canvas.parentElement?.clientWidth;
    const w = (canvas.width = Math.max(320, containerW && containerW > 50 ? containerW : 550));
    const h = (canvas.height = 360);

    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, w, h);

    // Left half: Circular phasor diagram
    const cx = w * 0.32;
    const cy = h * 0.52;
    const rMax = Math.min(cx - 20, cy - 25);

    // Polar circles
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(37, 46, 56, 0.6)';
    for (let r = 0.25; r <= 1.0; r += 0.25) {
      ctx.beginPath();
      ctx.arc(cx, cy, rMax * r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Axes
    ctx.beginPath();
    ctx.moveTo(cx - rMax, cy);
    ctx.lineTo(cx + rMax, cy);
    ctx.moveTo(cx, cy - rMax);
    ctx.lineTo(cx, cy + rMax);
    ctx.stroke();

    // Vector drawing function
    const drawVector = (mag: number, angleDeg: number, maxM: number, color: string, label: string) => {
      const angleRad = (angleDeg * Math.PI) / 180;
      const len = Math.max(10, Math.min(rMax, (mag / maxM) * rMax));
      const ex = cx + len * Math.cos(angleRad);
      const ey = cy - len * Math.sin(angleRad);

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // Arrowhead
      const headAngle = Math.PI / 7;
      const headLen = 8;
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
      ctx.fillStyle = '#F3F4F6';
      ctx.font = 'bold 9px ui-monospace, monospace';
      ctx.fillText(label, ex + 6 * Math.cos(angleRad), ey - 6 * Math.sin(angleRad));
    };

    const maxM = Math.max(2.0, diffI1Mag, diffI2Mag, diffId * 1.1);

    // Vector I1 (HV)
    drawVector(diffI1Mag, diffI1Angle, maxM, '#38BDF8', `I1 (${diffI1Mag.toFixed(2)} p.u.)`);
    // Vector I2 (LV - reversed by convention)
    drawVector(diffI2Mag, diffI2Angle, maxM, '#34D399', `I2 (${diffI2Mag.toFixed(2)} p.u.)`);
    // Resultant Vector Id
    const diffAngleDeg = (Math.atan2(diffIdy, diffIdx) * 180) / Math.PI;
    drawVector(diffId, diffAngleDeg, maxM, '#F43F5E', `Id (${diffId.toFixed(2)} p.u.)`);

    // Title left
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.fillText('DIAGRAMME VECTORIEL DES COURANTS', 16, 20);

    // Right half: Harmonics Spectrum Bars (H1 fundamental, H2 inrush, H5 overexcitation)
    const rightX = w * 0.65;
    const barW = 32;
    const barMaxH = 180;
    const baseY = h * 0.72;

    ctx.fillStyle = '#94A3B8';
    ctx.fillText('SPECTRE HARMONIQUE (BLOCAGE)', rightX, 20);

    // H1 (100%)
    ctx.fillStyle = '#64748B';
    ctx.fillRect(rightX, baseY - barMaxH, barW, barMaxH);
    ctx.fillStyle = '#F3F4F6';
    ctx.fillText('H1', rightX + 8, baseY + 14);
    ctx.fillText('100%', rightX + 2, baseY - barMaxH - 5);

    // H2 (Inrush)
    const h2H = Math.min(barMaxH, (diffH2Pct / 50) * barMaxH);
    ctx.fillStyle = diffH2Pct >= diffH2Thresh ? '#F59E0B' : '#0284C7';
    ctx.fillRect(rightX + barW + 16, baseY - h2H, barW, h2H);
    ctx.fillStyle = '#F3F4F6';
    ctx.fillText('H2', rightX + barW + 24, baseY + 14);
    ctx.fillText(`${diffH2Pct}%`, rightX + barW + 18, baseY - h2H - 5);

    // H2 Threshold Line
    const h2ThreshY = baseY - (diffH2Thresh / 50) * barMaxH;
    ctx.strokeStyle = '#F59E0B';
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.moveTo(rightX + barW + 12, h2ThreshY);
    ctx.lineTo(rightX + barW * 2 + 20, h2ThreshY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#F59E0B';
    ctx.font = '8px ui-monospace, monospace';
    ctx.fillText(`Seuil ${diffH2Thresh}%`, rightX + barW + 14, h2ThreshY - 3);

    // H5 (Overexcitation)
    const h5H = Math.min(barMaxH, (diffH5Pct / 50) * barMaxH);
    ctx.fillStyle = diffH5Pct >= diffH5Thresh ? '#3B82F6' : '#0D9488';
    ctx.fillRect(rightX + barW * 2 + 32, baseY - h5H, barW, h5H);
    ctx.fillStyle = '#F3F4F6';
    ctx.fillText('H5', rightX + barW * 2 + 40, baseY + 14);
    ctx.fillText(`${diffH5Pct}%`, rightX + barW * 2 + 34, baseY - h5H - 5);

    // H5 Threshold Line
    const h5ThreshY = baseY - (diffH5Thresh / 50) * barMaxH;
    ctx.strokeStyle = '#3B82F6';
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.moveTo(rightX + barW * 2 + 28, h5ThreshY);
    ctx.lineTo(rightX + barW * 3 + 36, h5ThreshY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#3B82F6';
    ctx.fillText(`Seuil ${diffH5Thresh}%`, rightX + barW * 2 + 30, h5ThreshY - 3);
  }, [diffI1Mag, diffI1Angle, diffI2Mag, diffI2Angle, diffId, diffIdx, diffIdy, diffH2Pct, diffH5Pct, diffH2Thresh, diffH5Thresh]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
      {/* Main Visualizer & Curves */}
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-5">
        {/* Header / Trip Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#252E38] pb-3 text-xs">
          <div className="flex items-center gap-2">
            <span 
              className="h-3 w-3 rounded-full animate-pulse" 
              style={{ backgroundColor: diffTripStatus.color }}
            />
            <span className="font-bold text-[#F3F4F6]">
              {locale === 'fr' ? 'RELAIS DE PROTECTION DIFFÉRENTIELLE NUMÉRIQUE' : 'DIGITAL DIFFERENTIAL PROTECTION RELAY'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-900/40 text-violet-300 border border-violet-800">
              ANSI 87T / 87B · CEI 60255-13
            </span>
          </div>
          <div 
            className="px-3 py-1 rounded-full text-xs font-bold border"
            style={{ 
              backgroundColor: `${diffTripStatus.color}20`, 
              borderColor: diffTripStatus.color,
              color: diffTripStatus.color 
            }}
          >
            {diffTripStatus.label}
          </div>
        </div>

        {/* Status Description Banner */}
        <div 
          className="p-3.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all"
          style={{
            backgroundColor: `${diffTripStatus.color}15`,
            borderColor: `${diffTripStatus.color}50`
          }}
        >
          <div className="mt-0.5">
            {diffTripStatus.state === 'TRIP_PERCENTAGE' || diffTripStatus.state === 'TRIP_INSTANTANEOUS' ? (
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            ) : diffTripStatus.state.startsWith('BLOCKED') ? (
              <ShieldAlert className="h-4 w-4 text-amber-400" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            )}
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-[#F3F4F6] text-[11px]">{diffTripStatus.label}</div>
            <div className="text-neutral-300 text-[11px] leading-relaxed">{diffTripStatus.description}</div>
            {diffTripStatus.operatingTimeMs > 0 && (
              <div className="text-rose-400 font-bold text-[10px]">
                {locale === 'fr' ? 'Temps de déclenchement :' : 'Trip time:'} {diffTripStatus.operatingTimeMs} ms
              </div>
            )}
          </div>
        </div>

        {/* Preset Scenarios */}
        <div className="space-y-2">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-3 w-3 text-violet-400" />
            <span>{locale === 'fr' ? 'Scénarios d’Injection & Défauts Réseau :' : 'Injection & Fault Scenarios:'}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => applyDiffScenario('normal')}
              className={`p-2 rounded-xl border text-left transition-all ${
                diffActiveScenario === 'normal'
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200'
                  : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">1. {locale === 'fr' ? 'Charge Nominale' : 'Rated Load'}</div>
              <div className="text-[9px] text-neutral-400">Id &approx; 0 p.u. (Stable)</div>
            </button>

            <button
              type="button"
              onClick={() => applyDiffScenario('through_fault')}
              className={`p-2 rounded-xl border text-left transition-all ${
                diffActiveScenario === 'through_fault'
                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200'
                  : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">2. {locale === 'fr' ? 'Défaut Traversant' : 'Through Fault'}</div>
              <div className="text-[9px] text-neutral-400">Ir fort, Pente 2 active</div>
            </button>

            <button
              type="button"
              onClick={() => applyDiffScenario('internal_light')}
              className={`p-2 rounded-xl border text-left transition-all ${
                diffActiveScenario === 'internal_light'
                  ? 'border-pink-500 bg-pink-500/20 text-pink-200'
                  : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">3. {locale === 'fr' ? 'Défaut Interne (P1)' : 'Internal Fault (P1)'}</div>
              <div className="text-[9px] text-neutral-400">Trip 87T (25 ms)</div>
            </button>

            <button
              type="button"
              onClick={() => applyDiffScenario('internal_heavy')}
              className={`p-2 rounded-xl border text-left transition-all ${
                diffActiveScenario === 'internal_heavy'
                  ? 'border-rose-500 bg-rose-500/20 text-rose-200'
                  : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">4. {locale === 'fr' ? 'Court-Circuit Franc' : 'Heavy Internal Fault'}</div>
              <div className="text-[9px] text-neutral-400">Trip Inst 87U (&lt;15 ms)</div>
            </button>

            <button
              type="button"
              onClick={() => applyDiffScenario('inrush')}
              className={`p-2 rounded-xl border text-left transition-all ${
                diffActiveScenario === 'inrush'
                  ? 'border-amber-500 bg-amber-500/20 text-amber-200'
                  : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">5. {locale === 'fr' ? 'Enclenchement Inrush' : 'Transformer Inrush'}</div>
              <div className="text-[9px] text-neutral-400">Blocage H2 (24% &ge; 15%)</div>
            </button>

            <button
              type="button"
              onClick={() => applyDiffScenario('overexcitation')}
              className={`p-2 rounded-xl border text-left transition-all ${
                diffActiveScenario === 'overexcitation'
                  ? 'border-blue-500 bg-blue-500/20 text-blue-200'
                  : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">6. {locale === 'fr' ? 'Surfluxage V/Hz' : 'Overexcitation'}</div>
              <div className="text-[9px] text-neutral-400">Blocage H5 (36% &ge; 30%)</div>
            </button>

            <button
              type="button"
              onClick={() => applyDiffScenario('ct_saturation_external')}
              className={`p-2 rounded-xl border text-left transition-all ${
                diffActiveScenario === 'ct_saturation_external'
                  ? 'border-rose-500 bg-rose-500/20 text-rose-200 shadow-md'
                  : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">7. {locale === 'fr' ? 'Saturation TC (Défaut Ext.)' : 'CT Saturation (Ext Fault)'}</div>
              <div className="text-[9px] text-neutral-400">{locale === 'fr' ? 'Faux Id + H2 transitoire' : 'Spurious Id + DC/H2'}</div>
            </button>
          </div>
        </div>

        {/* Canvas 1: Dual Slope Characteristic */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-violet-400" />
              <span className="font-bold text-[#F3F4F6]">
                {locale === 'fr' ? 'PLAN CARACTÉRISTIQUE BIPENTE Id vs Ir' : 'DUAL-SLOPE Id vs Ir OPERATING PLANE'}
              </span>
            </span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="text-neutral-400">
                Id = <strong className="text-pink-400">{diffId.toFixed(2)} p.u.</strong>
              </span>
              <span className="text-neutral-400">
                Ir = <strong className="text-cyan-400">{diffIr.toFixed(2)} p.u.</strong>
              </span>
              <span className="text-neutral-400">
                Seuil = <strong className="text-rose-400">{diffThresholdAtIr.toFixed(2)} p.u.</strong>
              </span>
            </div>
          </div>
          <div className="w-full overflow-hidden rounded-xl border border-[#252E38] bg-[#080B10]">
            <canvas ref={diffCharCanvasRef} className="w-full block" />
          </div>
        </div>

        {/* Canvas 2: Phasor Diagram and Harmonics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-bold text-[#F3F4F6]">
                {locale === 'fr' ? 'DIAGRAMME DES PHASORS & FILTRES HARMONIQUES' : 'PHASOR DIAGRAM & HARMONIC RESTRAINT'}
              </span>
            </span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="text-amber-400 font-bold">H2 : {diffH2Pct}%</span>
              <span className="text-blue-400 font-bold">H5 : {diffH5Pct}%</span>
            </div>
          </div>
          <div className="w-full overflow-hidden rounded-xl border border-[#252E38] bg-[#080B10]">
            <canvas ref={diffPhasorCanvasRef} className="w-full block" />
          </div>
        </div>

        {/* Transformer Rating & Substation Context */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">PUISSANCE APPARENTE</div>
            <div className="text-xl font-black text-violet-400">
              {diffSnMva} <span className="text-xs font-normal text-neutral-400">MVA</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-sans">
              Couplage {diffVectorGroup}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">COURANT NOMINAL HT (I1n)</div>
            <div className="text-xl font-black text-cyan-400">
              {diffIn1.toFixed(1)} <span className="text-xs font-normal text-neutral-400">A</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-sans">
              TC HT: {diffCt1Prim}/1 A
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">COURANT NOMINAL BT (I2n)</div>
            <div className="text-xl font-black text-emerald-400">
              {diffIn2.toFixed(1)} <span className="text-xs font-normal text-neutral-400">A</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-sans">
              TC BT: {diffCt2Prim}/1 A
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">DÉCISION RELAIS 87T</div>
            <div className="text-xl font-black" style={{ color: diffTripStatus.color }}>
              {diffTripStatus.operatingTimeMs > 0 ? `${diffTripStatus.operatingTimeMs} ms` : 'VEILLE'}
            </div>
            <div className="text-[10px] text-neutral-500 font-sans">
              {diffTripStatus.state}
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Settings and Interactive Injection Sliders */}
      <div className="space-y-4 text-xs font-mono">
        
        {/* Settings Card: Dual-Slope Thresholds */}
        <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="text-[10px] text-neutral-400 uppercase font-bold flex items-center justify-between border-b border-[#252E38] pb-2">
            <span>{locale === 'fr' ? 'RÉGLAGES RELAIS CARACTÉRISTIQUE BIPENTE' : 'DUAL-SLOPE RELAY SETTINGS'}</span>
            <span className="text-violet-400">ANSI 87T</span>
          </div>

          {/* Is1 Pickup */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Seuil de base (Is1) :</span>
              <span className="text-pink-400 font-bold">{diffIs1.toFixed(2)} p.u.</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.50"
              step="0.05"
              value={diffIs1}
              onChange={(e) => setDiffIs1(parseFloat(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-neutral-500">
              <span>0.10 p.u.</span>
              <span>Compense courant magnétisant</span>
              <span>0.50 p.u.</span>
            </div>
          </div>

          {/* Slope 1 */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Pente 1 (Slope 1) :</span>
              <span className="text-pink-400 font-bold">{(diffSlope1 * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.15"
              max="0.50"
              step="0.05"
              value={diffSlope1}
              onChange={(e) => setDiffSlope1(parseFloat(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <div className="text-[9px] text-neutral-500">Compense les prises régleur en charge (OLTC &plusmn;10%)</div>
          </div>

          {/* Knee point Is2 */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Coude de transition (Is2) :</span>
              <span className="text-amber-400 font-bold">{diffIs2.toFixed(1)} p.u.</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.2"
              value={diffIs2}
              onChange={(e) => setDiffIs2(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Slope 2 */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Pente 2 (Slope 2) :</span>
              <span className="text-amber-400 font-bold">{(diffSlope2 * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.50"
              max="0.90"
              step="0.05"
              value={diffSlope2}
              onChange={(e) => setDiffSlope2(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="text-[9px] text-neutral-500">Immunisation contre saturation TC en défaut traversant</div>
          </div>

          {/* Instantaneous threshold */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Seuil Instantané Unrestrained (87U) :</span>
              <span className="text-rose-400 font-bold">{diffIinst.toFixed(1)} p.u.</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="12.0"
              step="0.5"
              value={diffIinst}
              onChange={(e) => setDiffIinst(parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="text-[9px] text-neutral-500">Déclenchement instantané sans blocage harmonique</div>
          </div>
        </div>

        {/* Harmonics & Inrush Restraint Filters */}
        <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="text-[10px] text-neutral-400 uppercase font-bold flex items-center justify-between border-b border-[#252E38] pb-2">
            <span>{locale === 'fr' ? 'FILTRAGE HARMONIQUE INRUSH & V/Hz' : 'HARMONIC RESTRAINT'}</span>
            <span className="text-cyan-400">CEI 60255-13</span>
          </div>

          {/* Harmonic 2 Inrush Setting */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Seuil Blocage H2 (Inrush) :</span>
              <span className="text-amber-400 font-bold">{diffH2Thresh}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="25"
              step="1"
              value={diffH2Thresh}
              onChange={(e) => setDiffH2Thresh(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Harmonic 5 Overexcitation Setting */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Seuil Blocage H5 (Surfluxage) :</span>
              <span className="text-blue-400 font-bold">{diffH5Thresh}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="45"
              step="1"
              value={diffH5Thresh}
              onChange={(e) => setDiffH5Thresh(parseInt(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Interactive Injection Source Sliders */}
        <div className="bg-[#11161D] border border-[#252E38] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="text-[10px] text-neutral-400 uppercase font-bold flex items-center justify-between border-b border-[#252E38] pb-2">
            <span>{locale === 'fr' ? 'INJECTION COURANTS SECONDAIRES' : 'INJECTION GENERATOR'}</span>
            <span className="text-emerald-400">Custom</span>
          </div>

          {/* I1 Magnitude */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Module I1 (HT) :</span>
              <span className="text-cyan-400 font-bold">{diffI1Mag.toFixed(2)} p.u.</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={diffI1Mag}
              onChange={(e) => {
                setDiffI1Mag(parseFloat(e.target.value));
                setDiffActiveScenario('custom');
              }}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* I2 Magnitude */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Module I2 (BT) :</span>
              <span className="text-emerald-400 font-bold">{diffI2Mag.toFixed(2)} p.u.</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={diffI2Mag}
              onChange={(e) => {
                setDiffI2Mag(parseFloat(e.target.value));
                setDiffActiveScenario('custom');
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* I2 Phase Angle */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Angle Déphasage I2 :</span>
              <span className="text-emerald-400 font-bold">{diffI2Angle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={diffI2Angle}
              onChange={(e) => {
                setDiffI2Angle(parseInt(e.target.value));
                setDiffActiveScenario('custom');
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-neutral-500">
              <span>0° (Défaut interne)</span>
              <span>180° (Traversant normal)</span>
            </div>
          </div>

          {/* Harmonic 2 Injection */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Taux Harmonique 2 Inrush :</span>
              <span className="text-amber-400 font-bold">{diffH2Pct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={diffH2Pct}
              onChange={(e) => {
                setDiffH2Pct(parseInt(e.target.value));
                setDiffActiveScenario('custom');
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Harmonic 5 Injection */}
          <div className="space-y-1">
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>Taux Harmonique 5 Surfluxage :</span>
              <span className="text-blue-400 font-bold">{diffH5Pct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={diffH5Pct}
              onChange={(e) => {
                setDiffH5Pct(parseInt(e.target.value));
                setDiffActiveScenario('custom');
              }}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Transformer Parameters Switcher */}
        <div className="p-3 rounded-2xl bg-[#11161D] border border-[#252E38] space-y-2">
          <div className="text-[10px] text-neutral-400 uppercase font-bold flex items-center gap-1.5">
            <Sliders className="h-3 w-3 text-violet-400" />
            <span>{locale === 'fr' ? 'Transformateurs Réseau Cameroun :' : 'Grid Transformers (Cameroon):'}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() => {
                setDiffSnMva(70);
                setDiffU1Kv(225);
                setDiffU2Kv(16);
                setDiffVectorGroup('YNd11');
                setDiffCt1Prim(250);
                setDiffCt2Prim(3000);
              }}
              className="p-1.5 rounded border border-[#252E38] hover:border-violet-500 text-left bg-[#161C24]"
            >
              <div className="font-bold text-white">Nachtigal GSU</div>
              <div className="text-neutral-400">70 MVA · 16/225 kV</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setDiffSnMva(100);
                setDiffU1Kv(225);
                setDiffU2Kv(90);
                setDiffVectorGroup('Yy0');
                setDiffCt1Prim(300);
                setDiffCt2Prim(800);
              }}
              className="p-1.5 rounded border border-[#252E38] hover:border-violet-500 text-left bg-[#161C24]"
            >
              <div className="font-bold text-white">Bekoko Interco</div>
              <div className="text-neutral-400">100 MVA · 225/90 kV</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setDiffSnMva(36);
                setDiffU1Kv(90);
                setDiffU2Kv(15);
                setDiffVectorGroup('Dyn11');
                setDiffCt1Prim(300);
                setDiffCt2Prim(1600);
              }}
              className="p-1.5 rounded border border-[#252E38] hover:border-violet-500 text-left bg-[#161C24]"
            >
              <div className="font-bold text-white">Oyomabang Dist.</div>
              <div className="text-neutral-400">36 MVA · 90/15 kV</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setDiffSnMva(50);
                setDiffU1Kv(225);
                setDiffU2Kv(11);
                setDiffVectorGroup('Dyn11');
                setDiffCt1Prim(150);
                setDiffCt2Prim(3000);
              }}
              className="p-1.5 rounded border border-[#252E38] hover:border-violet-500 text-left bg-[#161C24]"
            >
              <div className="font-bold text-white">Alucam Smelter</div>
              <div className="text-neutral-400">50 MVA · 225/11 kV</div>
            </button>
          </div>
        </div>

        {/* Standards Guide Box */}
        <div className="p-3 rounded-2xl bg-[#080B10] border border-[#252E38] space-y-1 text-[10px]">
          <div className="text-violet-400 font-bold mb-1">
            {locale === 'fr' ? 'Normes & Principes (CEI 60255-13 / IEEE C37.91) :' : 'Differential Protection Standards:'}
          </div>
          <div className="text-neutral-400">• Id = |I1 + I2| (Opération) vs Ir = (|I1| + |I2|)/2 (Retenue)</div>
          <div className="text-neutral-400">• Pente 1 (20-40%) : compense le régleur en charge (+/-10%) et erreurs TC</div>
          <div className="text-neutral-400">• Pente 2 (60-80%) : immunise contre la saturation des TC en défaut externe</div>
          <div className="text-neutral-400">• Blocage H2 (&ge;15%) : empêche le déclenchement intempestif à l'enclenchement</div>
          <div className="text-neutral-400">• Blocage H5 (&ge;30%) : protège contre la surtension sans surchauffe magnétique</div>
        </div>

      </div>
    </div>
  );
};
