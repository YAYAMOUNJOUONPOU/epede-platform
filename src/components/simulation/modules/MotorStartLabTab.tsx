// src/components/simulation/modules/MotorStartLabTab.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MotorStartLabTabProps {
  locale: 'fr' | 'en';
}

export const MotorStartLabTab: React.FC<MotorStartLabTabProps> = ({ locale }) => {
  const [motorKw, setMotorKw] = useState<number>(160); // 160 kW
  const [motorVoltageV, setMotorVoltageV] = useState<number>(400); // 400 V
  const [motorPoles, setMotorPoles] = useState<number>(4); // 4 poles -> 1500 rpm synchronous
  const [motorInrushRatio] = useState<number>(6.5); // Id/In = 6.5
  const [motorCdCn] = useState<number>(2.2); // Starting torque Cd/Cn = 2.2
  const [motorCmaxCn] = useState<number>(2.8); // Breakdown torque Cmax/Cn = 2.8
  const [motorInertiaJ, setMotorInertiaJ] = useState<number>(6.5); // kg·m²
  const [motorLoadType, setMotorLoadType] = useState<'quadratic' | 'constant'>('quadratic');
  const [motorStartMethod, setMotorStartMethod] = useState<'dol' | 'star_delta' | 'soft_starter' | 'vfd'>('dol');
  const [softStarterLimit, setSoftStarterLimit] = useState<number>(3.2); // x In
  const [motorTrafoKva, setMotorTrafoKva] = useState<number>(1000); // 1000 kVA supply trafo
  const [motorTrafoUk] = useState<number>(6.0); // 6%
  const [motorGridSscMva, setMotorGridSscMva] = useState<number>(250); // 250 MVA upstream fault level
  const [motorGraphMode, setMotorGraphMode] = useState<'torque-speed' | 'transient-time'>('torque-speed');

  // Interactive motor starting simulation state
  const [isMotorStarting, setIsMotorStarting] = useState<boolean>(false);
  const [motorSimTime, setMotorSimTime] = useState<number>(0); // elapsed seconds
  const [motorSimSpeed, setMotorSimSpeed] = useState<number>(0); // instantaneous rpm
  const motorCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synchronous speed & nominal speed
  const nSync = (60 * 50) / (motorPoles / 2); // 1500 rpm for 4 poles
  const nominalSlip = 0.022; // ~2.2%
  const nNominal = Math.round(nSync * (1 - nominalSlip)); // ~1467 rpm
  const omegaNom = (2 * Math.PI * nNominal) / 60; // rad/s

  // Nominal electrical parameters
  const etaNom = 0.94;
  const cosPhiNom = 0.88;
  const iNomAmps = (motorKw * 1000) / (Math.sqrt(3) * motorVoltageV * cosPhiNom * etaNom);
  const cNomNm = (motorKw * 1000) / omegaNom; // Nominal torque in N·m

  // Starting factor coefficients by method
  let startCurrentMultiplier = motorInrushRatio; // DOL default
  let startTorqueMultiplier = 1.0; // DOL full torque

  if (motorStartMethod === 'star_delta') {
    startCurrentMultiplier = motorInrushRatio / 3;
    startTorqueMultiplier = 1 / 3;
  } else if (motorStartMethod === 'soft_starter') {
    startCurrentMultiplier = softStarterLimit;
    startTorqueMultiplier = Math.pow(softStarterLimit / motorInrushRatio, 2);
  } else if (motorStartMethod === 'vfd') {
    startCurrentMultiplier = 1.10;
    startTorqueMultiplier = 1.0; // VFD full torque from 0 Hz
  }

  const iStartAmps = iNomAmps * startCurrentMultiplier;
  const sStartKva = (Math.sqrt(3) * motorVoltageV * iStartAmps) / 1000;

  // Supply network short-circuit capacity at motor busbar
  const sTrafoScKva = motorTrafoKva / (motorTrafoUk / 100);
  const sGridScKva = motorGridSscMva * 1000;
  const sBusScKva = 1 / (1 / sGridScKva + 1 / sTrafoScKva);

  // Busbar instantaneous voltage dip (%) during start
  const busVoltageSagPercent = motorStartMethod === 'vfd' ? 1.2 : Math.min(45, (sStartKva / (sBusScKva + sStartKva)) * 100);
  const busVoltageDuringStartV = motorVoltageV * (1 - busVoltageSagPercent / 100);

  // Net starting torque developed at motor shaft (torque is proportional to U²)
  const netStartingTorqueNm = motorStartMethod === 'vfd'
    ? cNomNm * 1.20
    : cNomNm * motorCdCn * startTorqueMultiplier * Math.pow(1 - busVoltageSagPercent / 100, 2);

  // Initial load torque at zero speed
  const loadTorqueZeroNm = motorLoadType === 'quadratic' ? cNomNm * 0.15 : cNomNm * 0.80;
  const netAccTorqueZeroNm = netStartingTorqueNm - loadTorqueZeroNm;
  const isMotorStall = netAccTorqueZeroNm <= 0;

  // Mean acceleration torque and acceleration time estimate
  const meanAccTorqueNm = Math.max(15, (netStartingTorqueNm + cNomNm * motorCmaxCn * 0.7) / 2 - (motorLoadType === 'quadratic' ? cNomNm * 0.45 : cNomNm * 0.80));
  const estimatedAccelTimeSec = isMotorStall ? 99.9 : (motorInertiaJ * omegaNom) / meanAccTorqueNm;

  // Live starting animation ticker
  useEffect(() => {
    if (!isMotorStarting) return;
    let animId: number;
    let lastTs = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTs) / 1000;
      lastTs = now;

      setMotorSimTime((prevTime) => {
        const nextTime = prevTime + dt;
        if (nextTime >= estimatedAccelTimeSec * 1.15) {
          setIsMotorStarting(false);
          setMotorSimSpeed(nNominal);
          return estimatedAccelTimeSec;
        }

        // Speed ramp formula
        const progress = Math.min(1, nextTime / estimatedAccelTimeSec);
        const eased = Math.pow(progress, 1.4);
        setMotorSimSpeed(Math.min(nNominal, Math.round(nNominal * eased)));
        return nextTime;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isMotorStarting, estimatedAccelTimeSec, nNominal]);

  // Canvas drawing for Motor Starting Tab
  useEffect(() => {
    const canvas = motorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.parentElement?.clientWidth || 720);
    const h = (canvas.height = 360);

    // Dark background
    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, w, h);

    // Padding
    const padL = 65;
    const padR = 30;
    const padT = 30;
    const padB = 45;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.lineWidth = 1;
    const xGrid = 8;
    const yGrid = 6;
    for (let i = 0; i <= xGrid; i++) {
      const gx = padL + (i / xGrid) * plotW;
      ctx.beginPath();
      ctx.moveTo(gx, padT);
      ctx.lineTo(gx, padT + plotH);
      ctx.stroke();
    }
    for (let j = 0; j <= yGrid; j++) {
      const gy = padT + (j / yGrid) * plotH;
      ctx.beginPath();
      ctx.moveTo(padL, gy);
      ctx.lineTo(padL + plotW, gy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#9CA3AF';

    if (motorGraphMode === 'torque-speed') {
      const maxTorquePlot = cNomNm * (motorCmaxCn * 1.15);

      // Y-ticks
      for (let j = 0; j <= yGrid; j++) {
        const val = Math.round((maxTorquePlot * (yGrid - j)) / yGrid);
        const gy = padT + (j / yGrid) * plotH;
        ctx.fillText(`${val} Nm`, 8, gy + 3);
      }

      // X-ticks
      for (let i = 0; i <= xGrid; i++) {
        const speedVal = Math.round((nSync * i) / xGrid);
        const gx = padL + (i / xGrid) * plotW;
        ctx.fillText(`${speedVal}`, gx - 12, padT + plotH + 18);
      }
      ctx.fillText(locale === 'fr' ? 'Vitesse de rotation N (tr/min)' : 'Rotor Speed N (rpm)', padL + plotW / 2 - 60, padT + plotH + 34);

      // 1. Shaded accelerating torque area between Cmot and Cr
      const numSteps = 100;
      const sm = 0.16;
      const voltFactor = motorStartMethod === 'vfd' ? 1.0 : Math.pow(1 - busVoltageSagPercent / 100, 2);

      const motPts: { x: number; y: number }[] = [];
      const loadPts: { x: number; y: number }[] = [];

      for (let i = 0; i <= numSteps; i++) {
        const speed = (i / numSteps) * nSync;
        const s = Math.max(0.001, (nSync - speed) / nSync);
        const gx = padL + (speed / nSync) * plotW;

        let cMotor = 0;
        if (motorStartMethod === 'vfd') {
          cMotor = speed <= nNominal ? cNomNm * 1.25 : (cNomNm * 1.25 * nNominal) / speed;
        } else {
          const klossNorm = (2 * motorCmaxCn) / (s / sm + sm / s);
          const cUnadjusted = (klossNorm * (s / (s + 0.1)) + motorCdCn * Math.pow(s, 2)) * 0.75 * cNomNm;
          cMotor = cUnadjusted * startTorqueMultiplier * voltFactor;
        }

        let cLoad = 0;
        if (motorLoadType === 'quadratic') {
          cLoad = cNomNm * (0.15 + 0.75 * Math.pow(speed / nSync, 2));
        } else {
          cLoad = cNomNm * 0.80;
        }

        const gyMot = padT + plotH - (cMotor / maxTorquePlot) * plotH;
        const gyLoad = padT + plotH - (cLoad / maxTorquePlot) * plotH;

        motPts.push({ x: gx, y: Math.max(padT, gyMot) });
        loadPts.push({ x: gx, y: Math.max(padT, gyLoad) });
      }

      // Shaded Acceleration Area
      ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.beginPath();
      motPts.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      for (let idx = loadPts.length - 1; idx >= 0; idx--) {
        ctx.lineTo(loadPts[idx].x, loadPts[idx].y);
      }
      ctx.closePath();
      ctx.fill();

      // Load Torque Line (Amber dashed)
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      loadPts.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Motor Torque Line (Cyan solid)
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      motPts.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Operating point marker at nominal intersection
      const operX = padL + (nNominal / nSync) * plotW;
      const operY = padT + plotH - (cNomNm / maxTorquePlot) * plotH;
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(operX, operY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(`Pt Nom: ${nNominal} tr/min, ${Math.round(cNomNm)} Nm`, operX - 70, operY - 10);

      // If running or speed > 0, draw live rotor position cursor
      if (motorSimSpeed > 0) {
        const curX = padL + (motorSimSpeed / nSync) * plotW;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(curX, padT);
        ctx.lineTo(curX, padT + plotH);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(curX, padT + plotH - 12, 4, 0, Math.PI * 2);
        ctx.fill();
      }

    } else {
      // Mode: Transient vs Time
      const tMax = Math.max(2, estimatedAccelTimeSec * 1.2);
      const maxCurrentPlot = Math.max(iStartAmps * 1.15, iNomAmps * 2);

      // Y-ticks (Speed %)
      for (let j = 0; j <= yGrid; j++) {
        const pct = 100 - (j * 100) / yGrid;
        const gy = padT + (j / yGrid) * plotH;
        ctx.fillText(`${pct}%`, 18, gy + 3);
      }

      // X-ticks (Time in s)
      for (let i = 0; i <= xGrid; i++) {
        const tVal = ((tMax * i) / xGrid).toFixed(1);
        const gx = padL + (i / xGrid) * plotW;
        ctx.fillText(`${tVal}s`, gx - 10, padT + plotH + 18);
      }
      ctx.fillText(locale === 'fr' ? 'Temps d\'accélération t (secondes)' : 'Acceleration Time t (seconds)', padL + plotW / 2 - 70, padT + plotH + 34);

      // 1. Draw Speed Curve n(t) in Emerald
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const numTSteps = 100;
      for (let i = 0; i <= numTSteps; i++) {
        const t = (i / numTSteps) * tMax;
        const prog = Math.min(1, t / estimatedAccelTimeSec);
        const speedPct = isMotorStall ? 0 : Math.pow(prog, 1.4);
        const gx = padL + (t / tMax) * plotW;
        const gy = padT + plotH - speedPct * plotH;
        if (i === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      }
      ctx.stroke();

      // 2. Draw Current Curve I(t) in Amber
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= numTSteps; i++) {
        const t = (i / numTSteps) * tMax;
        const prog = Math.min(1, t / estimatedAccelTimeSec);
        const gx = padL + (t / tMax) * plotW;

        let curA = iStartAmps;
        if (!isMotorStall) {
          if (prog < 0.85) {
            curA = iStartAmps - (iStartAmps - iNomAmps * 1.3) * Math.pow(prog, 3);
          } else {
            curA = iNomAmps * 1.3 - (iNomAmps * 0.3) * ((prog - 0.85) / 0.15);
          }
        }
        const gy = padT + plotH - (curA / maxCurrentPlot) * plotH;
        if (i === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      }
      ctx.stroke();

      // 3. Draw Bus Voltage Curve Ubus(t) in Cyan
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      for (let i = 0; i <= numTSteps; i++) {
        const t = (i / numTSteps) * tMax;
        const prog = Math.min(1, t / estimatedAccelTimeSec);
        const gx = padL + (t / tMax) * plotW;

        let uBus = motorVoltageV * (1 - busVoltageSagPercent / 100);
        if (!isMotorStall) {
          uBus += (motorVoltageV - uBus) * Math.pow(prog, 2);
        }
        const uPct = uBus / motorVoltageV;
        const gy = padT + plotH - uPct * plotH;
        if (i === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Scrubber for current simulation time
      if (motorSimTime > 0) {
        const scrubX = padL + (Math.min(tMax, motorSimTime) / tMax) * plotW;
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(scrubX, padT);
        ctx.lineTo(scrubX, padT + plotH);
        ctx.stroke();
      }
    }
  }, [
    motorGraphMode,
    motorVoltageV,
    busVoltageSagPercent,
    motorSimSpeed,
    motorSimTime,
    estimatedAccelTimeSec,
    isMotorStall,
    cNomNm,
    iNomAmps,
    iStartAmps,
    nSync,
    nNominal,
    motorCmaxCn,
    motorCdCn,
    motorStartMethod,
    startTorqueMultiplier,
    motorLoadType,
    locale
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Visualizer & Curves */}
      <div className="lg:col-span-2 bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between border-b border-[#252E38] pb-4 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${isMotorStarting ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
            <span className="font-bold text-[#F3F4F6] uppercase">
              {locale === 'fr' ? 'SIMULATION TRANSITOIRE DE DÉMARRAGE MOTEUR (CEI 60034 / IEEE 399)' : 'MOTOR STARTING & VOLTAGE SAG SIMULATOR (IEC 60034 / IEEE 399)'}
            </span>
          </div>

          {/* Mode Toggle Buttons */}
          <div className="flex items-center gap-1.5 bg-[#161C24] p-1 rounded-xl border border-[#252E38]">
            <button
              type="button"
              onClick={() => setMotorGraphMode('torque-speed')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                motorGraphMode === 'torque-speed'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? 'Couple C(N)' : 'Torque C(N)'}
            </button>
            <button
              type="button"
              onClick={() => setMotorGraphMode('transient-time')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                motorGraphMode === 'transient-time'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? 'Temporel I(t), N(t)' : 'Transient I(t), N(t)'}
            </button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="relative rounded-xl border border-[#252E38] overflow-hidden bg-[#080B10]">
          <canvas
            ref={motorCanvasRef}
            className="w-full h-[360px] block"
          />

          {/* Graph Legend Overlay */}
          <div className="absolute top-3 right-3 bg-[#0D1117]/90 border border-[#252E38] rounded-lg p-2.5 font-mono text-[10px] space-y-1 backdrop-blur-sm pointer-events-none">
            {motorGraphMode === 'torque-speed' ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-4 bg-cyan-400 rounded" />
                  <span className="text-neutral-300">{locale === 'fr' ? 'Couple Moteur C_mot(N)' : 'Motor Torque C_mot(N)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-0.5 w-4 bg-amber-400 border-b border-amber-400 border-dashed" />
                  <span className="text-neutral-300">{locale === 'fr' ? 'Couple Résistant C_r(N)' : 'Load Torque C_r(N)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-4 bg-cyan-400/20 border border-cyan-400/40 rounded" />
                  <span className="text-neutral-300">{locale === 'fr' ? 'Marge Accélération ΔC' : 'Net Accel Torque ΔC'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-emerald-400 rounded-full" />
                  <span className="text-neutral-300">{locale === 'fr' ? 'Point Nominal' : 'Nominal Point'}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-4 bg-emerald-400 rounded" />
                  <span className="text-neutral-300">{locale === 'fr' ? 'Vitesse N(t) [%]' : 'Rotor Speed N(t) [%]'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-4 bg-amber-400 rounded" />
                  <span className="text-neutral-300">{locale === 'fr' ? 'Courant I(t) [A]' : 'Current I(t) [A]'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-0.5 w-4 bg-cyan-400 border-b border-cyan-400 border-dashed" />
                  <span className="text-neutral-300">{locale === 'fr' ? 'Tension U_bus(t)' : 'Busbar Voltage U_bus(t)'}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Interactive Start Sequence Bar */}
        <div className="p-4 rounded-xl bg-[#11161D] border border-[#252E38] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isMotorStall}
              onClick={() => {
                if (isMotorStarting) {
                  setIsMotorStarting(false);
                } else {
                  setMotorSimTime(0);
                  setMotorSimSpeed(0);
                  setIsMotorStarting(true);
                }
              }}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                isMotorStall
                  ? 'bg-red-500/10 text-red-400 border border-red-500/30 cursor-not-allowed'
                  : isMotorStarting
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {isMotorStarting ? (
                <>
                  <Square className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'Interrompre' : 'Stop'}</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>{locale === 'fr' ? 'Lancer Séquence de Démarrage' : 'Start Motor Sequence'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMotorStarting(false);
                setMotorSimTime(0);
                setMotorSimSpeed(0);
              }}
              className="px-3 py-2.5 rounded-xl bg-[#161C24] hover:bg-[#1E2631] text-neutral-400 hover:text-white border border-[#252E38] transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Réarmer' : 'Reset'}</span>
            </button>
          </div>

          {/* Real-time Tachometer readout */}
          <div className="flex items-center gap-5">
            <div className="text-right">
              <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'Vitesse Rotor' : 'Rotor Speed'}</div>
              <div className="text-base font-bold text-white">
                {motorSimSpeed} <span className="text-xs text-neutral-400 font-normal">tr/min</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'Temps Écoulé' : 'Elapsed'}</div>
              <div className="text-base font-bold text-cyan-300">
                {motorSimTime.toFixed(2)}s / {estimatedAccelTimeSec.toFixed(2)}s
              </div>
            </div>
          </div>
        </div>

        {/* Key KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#11161D] border border-amber-500/30">
            <span className="font-mono text-[10px] text-neutral-400 uppercase">
              {locale === 'fr' ? 'Courant Démarrage Id' : 'Starting Current Id'}
            </span>
            <div className="text-xl font-black text-amber-300 font-mono mt-1">
              {iStartAmps.toFixed(0)} <span className="text-xs text-neutral-400 font-normal">A</span>
            </div>
            <div className="text-[11px] text-amber-400 mt-1 font-mono">
              {(iStartAmps / iNomAmps).toFixed(1)} × I_nom ({iNomAmps.toFixed(0)} A)
            </div>
          </div>

          <div className={`p-4 rounded-xl bg-[#11161D] border ${
            busVoltageSagPercent > 15 ? 'border-red-500/40' : busVoltageSagPercent > 10 ? 'border-amber-500/40' : 'border-emerald-500/30'
          }`}>
            <span className="font-mono text-[10px] text-neutral-400 uppercase">
              {locale === 'fr' ? 'Creux de Tension ΔU' : 'Bus Voltage Sag ΔU'}
            </span>
            <div className={`text-xl font-black font-mono mt-1 ${
              busVoltageSagPercent > 15 ? 'text-red-400' : busVoltageSagPercent > 10 ? 'text-amber-300' : 'text-emerald-400'
            }`}>
              -{busVoltageSagPercent.toFixed(1)}%
            </div>
            <div className="text-[11px] text-neutral-400 mt-1 font-mono">
              U_bus = {busVoltageDuringStartV.toFixed(0)} V
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#11161D] border border-cyan-500/30">
            <span className="font-mono text-[10px] text-neutral-400 uppercase">
              {locale === 'fr' ? 'Temps Accélération ta' : 'Accel Time ta'}
            </span>
            <div className="text-xl font-black text-cyan-300 font-mono mt-1">
              {isMotorStall ? 'CALAGE' : `${estimatedAccelTimeSec.toFixed(2)}s`}
            </div>
            <div className="text-[11px] text-neutral-400 mt-1 font-mono">
              J_tot = {motorInertiaJ} kg·m²
            </div>
          </div>

          <div className={`p-4 rounded-xl bg-[#11161D] border ${
            isMotorStall ? 'border-red-500/40' : 'border-[#252E38]'
          }`}>
            <span className="font-mono text-[10px] text-neutral-400 uppercase">
              {locale === 'fr' ? 'Couple Développé Cd' : 'Breakaway Torque Cd'}
            </span>
            <div className={`text-xl font-black font-mono mt-1 ${isMotorStall ? 'text-red-400' : 'text-white'}`}>
              {netStartingTorqueNm.toFixed(0)} <span className="text-xs text-neutral-400 font-normal">Nm</span>
            </div>
            <div className={`text-[11px] mt-1 font-mono ${isMotorStall ? 'text-red-400' : 'text-emerald-400'}`}>
              {isMotorStall ? 'Couple < Résistant !' : `Marge: +${netAccTorqueZeroNm.toFixed(0)} Nm`}
            </div>
          </div>
        </div>

        {/* Methods Comparison Table */}
        <div className="p-4 rounded-xl bg-[#161C24] border border-[#252E38] space-y-3 font-mono text-xs">
          <div className="text-neutral-400 font-bold uppercase text-[11px] border-b border-[#252E38] pb-1.5 flex justify-between items-center">
            <span>{locale === 'fr' ? 'COMPARATIF TECHNIQUE DES PROCÉDÉS DE DÉMARRAGE' : 'STARTING METHODS COMPARATIVE BENCHMARK'}</span>
            <span className="text-cyan-400">CEI 60034-12</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-[#252E38] text-neutral-400">
                  <th className="py-2 text-left">{locale === 'fr' ? 'Méthode' : 'Method'}</th>
                  <th className="py-2 text-center">Id / In</th>
                  <th className="py-2 text-center">Cd / Cn</th>
                  <th className="py-2 text-center">{locale === 'fr' ? 'Creux ΔU (400V)' : 'Sag ΔU'}</th>
                  <th className="py-2 text-left">{locale === 'fr' ? 'Application Recommandée' : 'Best Application'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252E38]/60 text-neutral-300">
                <tr className={motorStartMethod === 'dol' ? 'bg-cyan-950/30 text-cyan-200' : ''}>
                  <td className="py-2 font-bold flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${motorStartMethod === 'dol' ? 'bg-cyan-400' : 'bg-neutral-600'}`} />
                    DOL (Direct)
                  </td>
                  <td className="py-2 text-center text-amber-300 font-bold">6.0 - 7.5</td>
                  <td className="py-2 text-center text-emerald-300">1.8 - 2.5</td>
                  <td className="py-2 text-center text-red-400">Élevé (12 - 25%)</td>
                  <td className="py-2 text-neutral-400 text-[10px]">Moteurs &lt; 55 kW sur transfo dédié</td>
                </tr>
                <tr className={motorStartMethod === 'star_delta' ? 'bg-cyan-950/30 text-cyan-200' : ''}>
                  <td className="py-2 font-bold flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${motorStartMethod === 'star_delta' ? 'bg-cyan-400' : 'bg-neutral-600'}`} />
                    Étoile-Triangle (Y-Δ)
                  </td>
                  <td className="py-2 text-center text-amber-300">2.0 - 2.6</td>
                  <td className="py-2 text-center text-amber-400">0.5 - 0.8</td>
                  <td className="py-2 text-center text-amber-300">Moyen (6 - 12%)</td>
                  <td className="py-2 text-neutral-400 text-[10px]">Démarrage à vide uniquement (ventilateurs)</td>
                </tr>
                <tr className={motorStartMethod === 'soft_starter' ? 'bg-cyan-950/30 text-cyan-200' : ''}>
                  <td className="py-2 font-bold flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${motorStartMethod === 'soft_starter' ? 'bg-cyan-400' : 'bg-neutral-600'}`} />
                    Démarreur Progressif
                  </td>
                  <td className="py-2 text-center text-cyan-300">2.5 - 4.0</td>
                  <td className="py-2 text-center text-cyan-300">0.6 - 1.2</td>
                  <td className="py-2 text-center text-emerald-300">Réduit (4 - 8%)</td>
                  <td className="py-2 text-neutral-400 text-[10px]">Pompes centrifuges (anti-coup de bélier)</td>
                </tr>
                <tr className={motorStartMethod === 'vfd' ? 'bg-cyan-950/30 text-cyan-200' : ''}>
                  <td className="py-2 font-bold flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${motorStartMethod === 'vfd' ? 'bg-cyan-400' : 'bg-neutral-600'}`} />
                    Variateur de Vitesse (VFD)
                  </td>
                  <td className="py-2 text-center text-emerald-400 font-bold">1.0 - 1.1</td>
                  <td className="py-2 text-center text-emerald-400 font-bold">1.2 - 1.5</td>
                  <td className="py-2 text-center text-emerald-400 font-bold">Négligeable (&lt; 2%)</td>
                  <td className="py-2 text-neutral-400 text-[10px]">Couple constant, régulation fine de débit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Standard Compliance Verdict Box */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
          isMotorStall
            ? 'bg-red-950/30 border-red-500/50 text-red-300'
            : busVoltageSagPercent > 15
            ? 'bg-amber-950/30 border-amber-500/50 text-amber-300'
            : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
        }`}>
          {isMotorStall ? (
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
          ) : busVoltageSagPercent > 15 ? (
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
          )}
          <div className="space-y-1">
            <div className="font-bold">
              {isMotorStall
                ? (locale === 'fr' ? 'CALAGE CRITIQUE : Couple moteur insuffisant au décollage' : 'CRITICAL STALL: Insufficient Breakaway Torque')
                : busVoltageSagPercent > 15
                ? (locale === 'fr' ? 'NON-CONFORME IEEE 141 : Creux de tension excessif (> 15%)' : 'NON-COMPLIANT IEEE 141: Excessive Voltage Sag (> 15%)')
                : (locale === 'fr' ? 'CONFORME IEEE 141 & CEI 60034 : Démarrage électrotechnique validé' : 'COMPLIANT IEEE 141 & IEC 60034: Sizing Verified')}
            </div>
            <div className="text-[11px] text-neutral-300">
              {isMotorStall
                ? (locale === 'fr'
                    ? `Le couple net développé (${netStartingTorqueNm.toFixed(0)} Nm) est inférieur au couple résistant (${loadTorqueZeroNm.toFixed(0)} Nm). Réduisez la charge au démarrage ou passez au variateur de vitesse (VFD).`
                    : `Net starting torque (${netStartingTorqueNm.toFixed(0)} Nm) is lower than load breakaway torque (${loadTorqueZeroNm.toFixed(0)} Nm). Switch to VFD or reduce load at start.`)
                : busVoltageSagPercent > 15
                ? (locale === 'fr'
                    ? `Le creux de tension (${busVoltageSagPercent.toFixed(1)}%) risque de faire déclencher les contacteurs BT (seuil 85% Un) et perturber les autres équipements connectés au transfo de ${motorTrafoKva} kVA. Démarreur progressif ou VFD fortement recommandé.`
                    : `Voltage sag (${busVoltageSagPercent.toFixed(1)}%) exceeds the 15% threshold, risking contactor drop-out and UV relay tripping. A soft starter or VFD is strongly recommended.`)
                : (locale === 'fr'
                    ? `Le creux de tension reste maîtrisé à ${busVoltageSagPercent.toFixed(1)}% (≤ 10% tolérance réseau). Le temps d'accélération (${estimatedAccelTimeSec.toFixed(2)}s) est largement inférieur à la limite thermique rotor bloqué (~15s).`
                    : `Voltage sag is maintained at ${busVoltageSagPercent.toFixed(1)}% (within IEEE 10% limit). Accel time (${estimatedAccelTimeSec.toFixed(2)}s) is well below motor locked-rotor thermal limit.`)}
            </div>
          </div>
        </div>
      </div>

      {/* Right Inputs Sidebar */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-6 shadow-2xl space-y-5 font-mono text-xs">
        <div className="text-xs font-bold text-[#F3F4F6] uppercase border-b border-[#252E38] pb-3 flex items-center justify-between">
          <span>{locale === 'fr' ? 'PARAMÈTRES ÉLECTROTECHNIQUES' : 'ELECTRICAL INPUTS'}</span>
          <RotateCcw 
            className="h-3.5 w-3.5 text-neutral-400 hover:text-cyan-400 cursor-pointer transition-colors" 
            onClick={() => {
              setMotorKw(160);
              setMotorVoltageV(400);
              setMotorStartMethod('dol');
              setMotorLoadType('quadratic');
              setMotorInertiaJ(6.5);
              setMotorTrafoKva(1000);
              setMotorGridSscMva(250);
              setIsMotorStarting(false);
              setMotorSimTime(0);
              setMotorSimSpeed(0);
            }}
          />
        </div>

        {/* Motor Power Kw */}
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <label className="text-neutral-300">{locale === 'fr' ? 'Puissance active Pn :' : 'Rated Power Pn:'}</label>
            <span className="text-cyan-400 font-bold">{motorKw} kW</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[37, 75, 160, 315].map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => setMotorKw(kw)}
                className={`py-1 rounded text-[10px] font-bold border transition-colors ${
                  motorKw === kw
                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                    : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
                }`}
              >
                {kw} kW
              </button>
            ))}
          </div>
          <input
            type="range"
            min="15"
            max="630"
            step="5"
            value={motorKw}
            onChange={(e) => setMotorKw(parseFloat(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        {/* Starting Method */}
        <div className="space-y-1.5">
          <label className="text-neutral-300">{locale === 'fr' ? 'Procédé de démarrage :' : 'Starting Method:'}</label>
          <select
            value={motorStartMethod}
            onChange={(e) => setMotorStartMethod(e.target.value as any)}
            className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-3 py-2 text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          >
            <option value="dol">Direct-On-Line (DOL / Direct)</option>
            <option value="star_delta">Étoile-Triangle (Y - Δ)</option>
            <option value="soft_starter">Démarreur Progressif (Soft Starter)</option>
            <option value="vfd">Variateur de Vitesse (VFD / VSD)</option>
          </select>
        </div>

        {/* Soft starter current limit if selected */}
        {motorStartMethod === 'soft_starter' && (
          <div className="space-y-1 bg-[#161C24] p-2.5 rounded-lg border border-cyan-500/30">
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-300">{locale === 'fr' ? 'Limitation courant :' : 'Current Limit:'}</span>
              <span className="text-cyan-300 font-bold">{softStarterLimit.toFixed(1)} × In</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="4.5"
              step="0.1"
              value={softStarterLimit}
              onChange={(e) => setSoftStarterLimit(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        )}

        {/* Mechanical Load Profile */}
        <div className="space-y-1.5">
          <label className="text-neutral-300">{locale === 'fr' ? 'Caractéristique de charge :' : 'Mechanical Load Type:'}</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMotorLoadType('quadratic')}
              className={`p-2 rounded-lg text-[10px] font-bold border text-left transition-colors ${
                motorLoadType === 'quadratic'
                  ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                  : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
              }`}
            >
              <div>{locale === 'fr' ? 'Quadratique (k·N²)' : 'Quadratic (k·N²)'}</div>
              <div className="text-[9px] text-neutral-500 font-normal">Pompe / Ventilateur</div>
            </button>
            <button
              type="button"
              onClick={() => setMotorLoadType('constant')}
              className={`p-2 rounded-lg text-[10px] font-bold border text-left transition-colors ${
                motorLoadType === 'constant'
                  ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                  : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
              }`}
            >
              <div>{locale === 'fr' ? 'Constant (C0)' : 'Constant (C0)'}</div>
              <div className="text-[9px] text-neutral-500 font-normal">Convoyeur / Broyeur</div>
            </button>
          </div>
        </div>

        {/* Poles & Inertia */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-neutral-400">{locale === 'fr' ? 'Pôles moteur :' : 'Poles:'}</label>
            <select
              value={motorPoles}
              onChange={(e) => setMotorPoles(parseInt(e.target.value, 10))}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2 py-1.5 text-white font-bold mt-1 focus:border-cyan-400 focus:outline-none"
            >
              <option value={2}>2 pôles (3000 rpm)</option>
              <option value={4}>4 pôles (1500 rpm)</option>
              <option value={6}>6 pôles (1000 rpm)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-neutral-400">{locale === 'fr' ? 'Inertie J (kg·m²) :' : 'Inertia J (kg·m²):'}</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="50"
              value={motorInertiaJ}
              onChange={(e) => setMotorInertiaJ(parseFloat(e.target.value) || 1)}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2 py-1.5 text-white font-bold mt-1 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Grid & Transformer Parameters */}
        <div className="pt-3 border-t border-[#252E38] space-y-3">
          <div className="text-neutral-400 uppercase text-[10px] font-bold">
            {locale === 'fr' ? 'RÉSEAU ÉLECTRIQUE ALIMENTATION' : 'SUPPLY GRID PARAMETERS'}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-300">{locale === 'fr' ? 'Transfo source Sn :' : 'Supply Trafo Sn:'}</span>
              <span className="text-cyan-400 font-bold">{motorTrafoKva} kVA</span>
            </div>
            <select
              value={motorTrafoKva}
              onChange={(e) => setMotorTrafoKva(parseInt(e.target.value, 10))}
              className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2 py-1.5 text-white font-bold focus:border-cyan-400 focus:outline-none"
            >
              <option value={400}>400 kVA (uk=4.0%)</option>
              <option value={630}>630 kVA (uk=4.5%)</option>
              <option value={1000}>1000 kVA (uk=6.0%)</option>
              <option value={1600}>1600 kVA (uk=6.0%)</option>
              <option value={2500}>2500 kVA (uk=7.0%)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-neutral-400">Tension Un (V) :</label>
              <select
                value={motorVoltageV}
                onChange={(e) => setMotorVoltageV(parseInt(e.target.value, 10))}
                className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2 py-1.5 text-white font-bold mt-1 focus:border-cyan-400 focus:outline-none"
              >
                <option value={400}>400 V</option>
                <option value={690}>690 V</option>
                <option value={3300}>3300 V</option>
                <option value={6600}>6600 V</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-neutral-400">Ssc Amont (MVA) :</label>
              <input
                type="number"
                value={motorGridSscMva}
                onChange={(e) => setMotorGridSscMva(parseFloat(e.target.value) || 100)}
                className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2 py-1.5 text-white font-bold mt-1 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Quick Sizing summary */}
        <div className="p-3 rounded-lg bg-[#080B10] border border-[#252E38] space-y-1 font-mono text-[10px]">
          <div className="text-cyan-400 font-bold mb-1">{locale === 'fr' ? 'Formules de Référence (IEEE 399) :' : 'Reference Equations:'}</div>
          <div className="text-neutral-400">• S_start = √3 · U · I_d (kVA)</div>
          <div className="text-neutral-400">• ΔU_bus = S_start / (S_bus,sc + S_start) · 100%</div>
          <div className="text-neutral-400">• Couple effectif Cd,net = Cd,nom · (U_bus / Un)²</div>
        </div>
      </div>
    </div>
  );
};
