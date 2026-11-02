// src/components/simulation/modules/IndustrialMotorDynamicSimulator.tsx
// EPEDE 2.0: Industrial Motor Starting Dynamic Simulator (Domain D07 / D08)
// Interactive simulator solving dynamic torque-speed curves (Mm - Mr), inrush decay, and busbar voltage sag
// Calibrated to IEC 60034-1, IEC 60034-12, IEEE Std 399 (Brown Book), IEEE Std 620 & Cameroon industrial projects

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Play,
  Square,
  RotateCcw,
  Sliders,
  Layers,
  Info,
  Building2,
  TrendingUp,
  Cpu,
  Flame,
  Gauge
} from 'lucide-react';
import {
  IndustrialMotorDynamicsEngine,
  CAMEROON_MOTOR_PRESETS,
  MotorVoltageTier,
  MotorStartMethod,
  MechanicalLoadType,
  MotorPreset,
} from '../../../data/industrialMotorDynamicsEngine';

interface IndustrialMotorDynamicSimulatorProps {
  locale: 'fr' | 'en';
  initialPresetId?: string;
}

export const IndustrialMotorDynamicSimulator: React.FC<IndustrialMotorDynamicSimulatorProps> = ({
  locale,
  initialPresetId = 'nachtigal-raw-water',
}) => {
  const isFr = locale === 'fr';

  // 1. Preset & Configuration State
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPresetId);
  const [voltageV, setVoltageV] = useState<MotorVoltageTier>(400);
  const [powerKw, setPowerKw] = useState<number>(160);
  const [poleCount, setPoleCount] = useState<number>(4);
  const [startMethod, setStartMethod] = useState<MotorStartMethod>('soft-starter');
  const [loadType, setLoadType] = useState<MechanicalLoadType>('quadratic');
  const [motorInertiaJ, setMotorInertiaJ] = useState<number>(4.5);
  const [loadInertiaJ, setLoadInertiaJ] = useState<number>(8.0);
  const [supplyTrafoKva, setSupplyTrafoKva] = useState<number>(1000);
  const [supplyTrafoUk, setSupplyTrafoUk] = useState<number>(6.0);
  const [upstreamGridSscMva, setUpstreamGridSscMva] = useState<number>(350);
  const [softStarterLimit, setSoftStarterLimit] = useState<number>(3.2);

  // Active Visualization Tab
  const [activeTab, setActiveTab] = useState<'torque-speed' | 'transient-current' | 'bus-sag' | 'method-compare'>('torque-speed');

  // Animation Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);
  const [simSpeedRpm, setSimSpeedRpm] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Apply preset selection
  const handleSelectPreset = (preset: MotorPreset) => {
    setSelectedPresetId(preset.id);
    setVoltageV(preset.voltageV);
    setPowerKw(preset.powerKw);
    setPoleCount(preset.poles);
    setStartMethod(preset.defaultMethod);
    setLoadType(preset.loadType);
    setMotorInertiaJ(preset.motorInertiaJ);
    setLoadInertiaJ(preset.loadInertiaJ);
    setSupplyTrafoKva(preset.supplyTrafoKva);
    setSupplyTrafoUk(preset.supplyTrafoUk);
    setUpstreamGridSscMva(preset.upstreamGridSscMva);
    setIsSimulating(false);
    setSimTime(0);
    setSimSpeedRpm(0);
  };

  // 2. Solve Electrodynamic Engine
  const simulationResult = useMemo(() => {
    return IndustrialMotorDynamicsEngine.solve({
      voltageV,
      powerKw,
      poleCount,
      startMethod,
      loadType,
      motorInertiaJ,
      loadInertiaJ,
      supplyTrafoKva,
      supplyTrafoUkPercent: supplyTrafoUk,
      upstreamGridSscMva,
      softStarterLimitRatio: softStarterLimit,
    });
  }, [
    voltageV,
    powerKw,
    poleCount,
    startMethod,
    loadType,
    motorInertiaJ,
    loadInertiaJ,
    supplyTrafoKva,
    supplyTrafoUk,
    upstreamGridSscMva,
    softStarterLimit,
  ]);

  // 3. Animation Loop
  useEffect(() => {
    if (!isSimulating) return;

    let animId: number;
    let lastTs = performance.now();
    const accelTime = simulationResult.accelerationTimeSec;

    const tick = (now: number) => {
      const dt = (now - lastTs) / 1000;
      lastTs = now;

      setSimTime((prevTime) => {
        const nextTime = prevTime + dt;
        if (nextTime >= accelTime * 1.15) {
          setIsSimulating(false);
          setSimSpeedRpm(simulationResult.nominalSpeedRpm);
          return accelTime;
        }

        const progress = Math.min(1.0, nextTime / accelTime);
        const speed = Math.round(
          simulationResult.nominalSpeedRpm * Math.pow(progress, 1.4)
        );
        setSimSpeedRpm(speed);
        return nextTime;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isSimulating, simulationResult]);

  // Handle Play / Stop / Reset
  const handlePlayToggle = () => {
    if (isSimulating) {
      setIsSimulating(false);
    } else {
      if (simTime >= simulationResult.accelerationTimeSec) {
        setSimTime(0);
        setSimSpeedRpm(0);
      }
      setIsSimulating(true);
    }
  };

  const handleReset = () => {
    setIsSimulating(false);
    setSimTime(0);
    setSimSpeedRpm(0);
  };

  // 4. HTML5 Canvas Rendering for Dynamic Curves
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 740);
    const height = (canvas.height = 360);

    // Deep slate background
    ctx.fillStyle = '#060B14';
    ctx.fillRect(0, 0, width, height);

    const padL = 65;
    const padR = 30;
    const padT = 30;
    const padB = 45;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    // Grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
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
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#94A3B8';

    if (activeTab === 'torque-speed') {
      // ==================== TORQUE-SPEED CURVE M(omega) ====================
      const pts = simulationResult.torqueSpeedPoints;
      const maxTorque = Math.max(...pts.map((p) => p.motorTorqueNm), simulationResult.breakdownTorqueNm) * 1.15;
      const nSync = simulationResult.synchronousSpeedRpm;

      // Y-axis ticks (Torque N·m)
      for (let j = 0; j <= yGrid; j++) {
        const val = Math.round((maxTorque * (yGrid - j)) / yGrid);
        const gy = padT + (j / yGrid) * plotH;
        ctx.fillText(`${val} Nm`, 8, gy + 3);
      }

      // X-axis ticks (Speed rpm)
      for (let i = 0; i <= xGrid; i++) {
        const speedVal = Math.round((nSync * i) / xGrid);
        const gx = padL + (i / xGrid) * plotW;
        ctx.fillText(`${speedVal}`, gx - 12, padT + plotH + 18);
      }
      ctx.fillText(
        isFr ? 'Vitesse de rotation N (tr/min)' : 'Rotor Speed N (rpm)',
        padL + plotW / 2 - 60,
        padT + plotH + 34
      );

      // Shaded Accelerating Torque Area between Mm and Mr
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.beginPath();
      pts.forEach((p, idx) => {
        const gx = padL + (p.speedRpm / nSync) * plotW;
        const gy = padT + plotH - (p.motorTorqueNm / maxTorque) * plotH;
        if (idx === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      });
      for (let idx = pts.length - 1; idx >= 0; idx--) {
        const p = pts[idx];
        const gx = padL + (p.speedRpm / nSync) * plotW;
        const gy = padT + plotH - (p.loadTorqueNm / maxTorque) * plotH;
        ctx.lineTo(gx, gy);
      }
      ctx.closePath();
      ctx.fill();

      // Load Torque Curve (Amber dashed)
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      pts.forEach((p, idx) => {
        const gx = padL + (p.speedRpm / nSync) * plotW;
        const gy = padT + plotH - (p.loadTorqueNm / maxTorque) * plotH;
        if (idx === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Motor Torque Curve (Neon Cyan / Emerald)
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      pts.forEach((p, idx) => {
        const gx = padL + (p.speedRpm / nSync) * plotW;
        const gy = padT + plotH - (p.motorTorqueNm / maxTorque) * plotH;
        if (idx === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      });
      ctx.stroke();

      // Operating point marker at nominal intersection
      const operX = padL + (simulationResult.nominalSpeedRpm / nSync) * plotW;
      const operY = padT + plotH - (simulationResult.nominalTorqueNm / maxTorque) * plotH;
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(operX, operY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(
        `Pt Nom: ${simulationResult.nominalSpeedRpm} tr/min, ${simulationResult.nominalTorqueNm} Nm`,
        operX - 90,
        operY - 12
      );

      // Live animated rotor speed cursor
      if (simSpeedRpm > 0) {
        const curX = padL + (simSpeedRpm / nSync) * plotW;
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(curX, padT);
        ctx.lineTo(curX, padT + plotH);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(curX, padT + plotH - 8, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (activeTab === 'transient-current') {
      // ==================== TRANSIENT CURRENT ENVELOPE I(t) ====================
      const pts = simulationResult.transientTimePoints;
      const tMax = Math.max(...pts.map((p) => p.timeSec));
      const maxCurrent = simulationResult.startingCurrentA * 1.15;

      // Y-axis ticks (Current A)
      for (let j = 0; j <= yGrid; j++) {
        const val = Math.round((maxCurrent * (yGrid - j)) / yGrid);
        const gy = padT + (j / yGrid) * plotH;
        ctx.fillText(`${val} A`, 8, gy + 3);
      }

      // X-axis ticks (Time s)
      for (let i = 0; i <= xGrid; i++) {
        const tVal = ((tMax * i) / xGrid).toFixed(1);
        const gx = padL + (i / xGrid) * plotW;
        ctx.fillText(`${tVal}s`, gx - 8, padT + plotH + 18);
      }
      ctx.fillText(
        isFr ? 'Temps d’accélération t (secondes)' : 'Acceleration Time t (seconds)',
        padL + plotW / 2 - 70,
        padT + plotH + 34
      );

      // Nominal current reference line (dashed green)
      const nomY = padT + plotH - (simulationResult.nominalCurrentA / maxCurrent) * plotH;
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padL, nomY);
      ctx.lineTo(padL + plotW, nomY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText(`In = ${simulationResult.nominalCurrentA} A`, padL + plotW - 85, nomY - 6);

      // Current Envelope Curve (Amber)
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      pts.forEach((p, idx) => {
        const gx = padL + (p.timeSec / tMax) * plotW;
        const gy = padT + plotH - (p.currentAmps / maxCurrent) * plotH;
        if (idx === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      });
      ctx.stroke();

      // Peak subtransient inrush dot at t = 0
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(padL, padT + plotH - (simulationResult.startingCurrentA / maxCurrent) * plotH, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(`Id = ${simulationResult.startingCurrentA} A (${simulationResult.inrushRatio} In)`, padL + 10, padT + 18);
    } else if (activeTab === 'bus-sag') {
      // ==================== BUSBAR VOLTAGE SAG DELTA U(t) ====================
      const pts = simulationResult.transientTimePoints;
      const tMax = Math.max(...pts.map((p) => p.timeSec));
      const maxSag = Math.max(25, simulationResult.busVoltageSagPercent * 1.3);

      // Y-axis ticks (Voltage Sag %)
      for (let j = 0; j <= yGrid; j++) {
        const val = Math.round((maxSag * (yGrid - j)) / yGrid);
        const gy = padT + (j / yGrid) * plotH;
        ctx.fillText(`-${val}%`, 14, gy + 3);
      }

      // X-axis ticks (Time s)
      for (let i = 0; i <= xGrid; i++) {
        const tVal = ((tMax * i) / xGrid).toFixed(1);
        const gx = padL + (i / xGrid) * plotW;
        ctx.fillText(`${tVal}s`, gx - 8, padT + plotH + 18);
      }
      ctx.fillText(
        isFr ? 'Temps d’accélération t (secondes)' : 'Acceleration Time t (seconds)',
        padL + plotW / 2 - 70,
        padT + plotH + 34
      );

      // Permissible Limit Line 10% (Flicker / IEEE 399)
      const lim10Y = padT + plotH - (10.0 / maxSag) * plotH;
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padL, lim10Y);
      ctx.lineTo(padL + plotW, lim10Y);
      ctx.stroke();
      ctx.fillText(isFr ? 'Limite Flicker 10%' : '10% Flicker Limit', padL + plotW - 120, lim10Y - 5);

      // Critical Limit Line 15% (Contactor Drop-out)
      const lim15Y = padT + plotH - (15.0 / maxSag) * plotH;
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padL, lim15Y);
      ctx.lineTo(padL + plotW, lim15Y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText(isFr ? 'Seuil Déclenchement 15%' : '15% Dropout Limit', padL + plotW - 150, lim15Y - 5);

      // Voltage Sag Curve (Cyan / Rose if critical)
      ctx.strokeStyle = simulationResult.busVoltageSagPercent > 15 ? '#EF4444' : '#38BDF8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      pts.forEach((p, idx) => {
        const gx = padL + (p.timeSec / tMax) * plotW;
        const gy = padT + plotH - (p.busVoltageSagPercent / maxSag) * plotH;
        if (idx === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      });
      ctx.stroke();
    }
  }, [activeTab, simulationResult, simSpeedRpm, isFr]);

  return (
    <div className="bg-[#070D19] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6 font-mono text-xs">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold mb-1">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="uppercase tracking-wider">
              {isFr
                ? 'EPEDE D07/D08 · SIMULATEUR DYNAMIQUE D’ÉLECTRODYNAMIQUE & DÉMARRAGE MOTEUR'
                : 'EPEDE D07/D08 · INDUSTRIAL MOTOR STARTING & TRANSIENT DYNAMICS SIMULATOR'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>
              {isFr
                ? 'Analyseur Transitoire Couple-Vitesse, Appel de Courant & Chute de Tension'
                : 'Transient Torque-Speed, Inrush Envelope & Busbar Sag Analyzer'}
            </span>
          </h2>
          <span className="text-[11px] text-slate-400 block mt-0.5 font-sans">
            {isFr
              ? 'Conforme CEI 60034-12, IEEE Std 399 (Brown Book), IEEE Std 620 et prescriptions SONATREL/Eneo'
              : 'Calibrated to IEC 60034-12, IEEE Std 399, IEEE Std 620 and industrial Cameroonian project standards'}
          </span>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 font-bold ${
              simulationResult.isMotorStall
                ? 'bg-rose-950/60 border-rose-600 text-rose-300'
                : simulationResult.busVoltageSagPercent > 15
                ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
            }`}
          >
            {simulationResult.isMotorStall ? (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
                <span>{isFr ? 'CALAGE MOTEUR (Mm < Mr)' : 'MOTOR STALL (Mm < Mr)'}</span>
              </>
            ) : simulationResult.busVoltageSagPercent > 15 ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{isFr ? 'CHUTE CRITIQUE (>15%)' : 'CRITICAL SAG (>15%)'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isFr ? 'DÉMARRAGE CONFORME' : 'START COMPLIANT'}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Cameroon Industrial Presets Strip */}
      <div className="space-y-2">
        <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isFr ? 'CAS D’ÉTUDES INDUSTRIELS DU CAMEROUN (PRESETS DIRECTS)' : 'CAMEROON INDUSTRIAL PROJECT PRESETS'}</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {CAMEROON_MOTOR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPresetId === preset.id
                  ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-[11px] truncate text-cyan-300">
                {isFr ? preset.name.fr : preset.name.en}
              </div>
              <div className="text-[9.5px] text-slate-400 truncate mt-0.5">
                {preset.powerKw} kW · {preset.voltageV} V · {preset.defaultMethod.toUpperCase()}
              </div>
              <div className="text-[8.5px] text-slate-500 truncate mt-1">
                {isFr ? preset.facility.fr : preset.facility.en}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. KPI Telemetry Gauges Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Nominal Current In */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">
            {isFr ? 'Courant Nominal (In)' : 'Nominal Current (In)'}
          </span>
          <span className="text-lg font-black text-cyan-300 block mt-0.5">
            {simulationResult.nominalCurrentA} A
          </span>
          <span className="text-[9px] text-slate-500 block">
            {powerKw} kW @ {voltageV} V
          </span>
        </div>

        {/* Starting Inrush Current Id */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-900/50">
          <span className="text-[10px] text-slate-400 block uppercase">
            {isFr ? 'Appel Courant (Id)' : 'Starting Current (Id)'}
          </span>
          <span className="text-lg font-black text-amber-400 block mt-0.5">
            {simulationResult.startingCurrentA} A
          </span>
          <span className="text-[9px] text-slate-500 block">
            Ratio Id/In = {simulationResult.inrushRatio}x
          </span>
        </div>

        {/* Breakaway Starting Torque Cd */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">
            {isFr ? 'Couple Décollage (Cd)' : 'Starting Torque (Cd)'}
          </span>
          <span className="text-lg font-black text-emerald-400 block mt-0.5">
            {simulationResult.startingTorqueNm} Nm
          </span>
          <span className="text-[9px] text-slate-500 block">
            Cn = {simulationResult.nominalTorqueNm} Nm
          </span>
        </div>

        {/* Busbar Voltage Sag */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">
            {isFr ? 'Chute Tension Bus' : 'Bus Voltage Sag'}
          </span>
          <span
            className={`text-lg font-black block mt-0.5 ${
              simulationResult.busVoltageSagPercent > 15
                ? 'text-rose-400'
                : simulationResult.busVoltageSagPercent > 10
                ? 'text-amber-400'
                : 'text-cyan-300'
            }`}
          >
            -{simulationResult.busVoltageSagPercent}%
          </span>
          <span className="text-[9px] text-slate-500 block">
            U_min = {simulationResult.busVoltageDuringStartV} V
          </span>
        </div>

        {/* Acceleration Time */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">
            {isFr ? 'Temps Accélération' : 'Accel Duration'}
          </span>
          <span className="text-lg font-black text-slate-200 block mt-0.5">
            {simulationResult.isMotorStall ? '∞ (Calage)' : `${simulationResult.accelerationTimeSec} s`}
          </span>
          <span className="text-[9px] text-slate-500 block">
            {simulationResult.nominalSpeedRpm} tr/min
          </span>
        </div>

        {/* Thermal Energy I2t */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">
            {isFr ? 'Énergie Thermique I²t' : 'Thermal Stress I²t'}
          </span>
          <span className="text-lg font-black text-purple-300 block mt-0.5">
            {(simulationResult.thermalEnergyI2t / 1e6).toFixed(2)} MA²s
          </span>
          <span className="text-[9px] text-slate-500 block">
            CEI 60947-4-1 Classe 10
          </span>
        </div>
      </div>

      {/* 4. Controls & Visual Canvas Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Visual Dynamic Graph (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          {/* Chart View Mode Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('torque-speed')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  activeTab === 'torque-speed'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Courbe Couple-Vitesse M(N)' : 'Torque-Speed M(N)'}
              </button>
              <button
                onClick={() => setActiveTab('transient-current')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  activeTab === 'transient-current'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Courant I(t) Décroissant' : 'Inrush Decay I(t)'}
              </button>
              <button
                onClick={() => setActiveTab('bus-sag')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  activeTab === 'bus-sag'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Chute Tension Bus ΔU(t)' : 'Busbar Sag ΔU(t)'}
              </button>
              <button
                onClick={() => setActiveTab('method-compare')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  activeTab === 'method-compare'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isFr ? 'Comparateur 4 Modes' : '4-Method Compare'}
              </button>
            </div>

            {/* Play / Reset Animation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayToggle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition-colors"
              >
                {isSimulating ? (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Pause' : 'Pause'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Lancer Démarrage' : 'Start Motor'}</span>
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                title={isFr ? 'Réinitialiser' : 'Reset'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Chart Canvas / Multi-Method View */}
          {activeTab !== 'method-compare' ? (
            <div className="w-full bg-[#060B14] rounded-xl border border-slate-900 p-2 relative">
              <canvas ref={canvasRef} className="w-full h-80 rounded-lg select-none" />

              {/* Dynamic Tachometer Overlay */}
              <div className="absolute top-4 right-4 bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl flex items-center gap-3 backdrop-blur-sm">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">
                    {isFr ? 'Tachymètre Rotor' : 'Rotor Speed'}
                  </span>
                  <span className="text-sm font-black text-emerald-400">
                    {simSpeedRpm} / {simulationResult.nominalSpeedRpm} rpm
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block uppercase">
                    {isFr ? 'Temps Écoulé' : 'Elapsed'}
                  </span>
                  <span className="text-sm font-black text-cyan-300">
                    {simTime.toFixed(2)} s
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // ==================== 4-METHOD COMPARISON TABLE & MATRIX ====================
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="text-cyan-400 font-bold uppercase text-[11px] flex items-center justify-between pb-2 border-b border-slate-800">
                <span>{isFr ? 'COMPARAISON NORMATIVE DES 4 MODES DE DÉMARRAGE' : 'NORMATIVE 4-METHOD STARTING COMPARISON'}</span>
                <span className="text-slate-400">CEI 60034-12 · {powerKw} kW @ {voltageV} V</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* DOL */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-cyan-300 font-bold">
                    <span>DOL (Direct)</span>
                    <span className="text-[10px] text-slate-500">6.8 In</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Id Appel :</span>
                      <span className="text-amber-400 font-bold">{simulationResult.methodComparison.dol.startingCurrentA} A</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Cd Décollage :</span>
                      <span className="text-emerald-400 font-bold">{simulationResult.methodComparison.dol.startingTorqueNm} Nm</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Chute Bus :</span>
                      <span className="text-rose-400 font-bold">-{simulationResult.methodComparison.dol.voltageSagPercent}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Temps t_acc :</span>
                      <span className="text-slate-200 font-bold">{simulationResult.methodComparison.dol.accelTimeSec} s</span>
                    </div>
                  </div>
                </div>

                {/* Star-Delta */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-amber-300 font-bold">
                    <span>Étoile-Triangle</span>
                    <span className="text-[10px] text-slate-500">2.3 In</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Id Appel :</span>
                      <span className="text-amber-400 font-bold">{simulationResult.methodComparison['star-delta'].startingCurrentA} A</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Cd Décollage :</span>
                      <span className="text-emerald-400 font-bold">{simulationResult.methodComparison['star-delta'].startingTorqueNm} Nm</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Chute Bus :</span>
                      <span className="text-amber-400 font-bold">-{simulationResult.methodComparison['star-delta'].voltageSagPercent}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Temps t_acc :</span>
                      <span className="text-slate-200 font-bold">{simulationResult.methodComparison['star-delta'].accelTimeSec} s</span>
                    </div>
                  </div>
                </div>

                {/* Soft-Starter */}
                <div className="p-3 rounded-xl bg-slate-950 border border-cyan-800/50 space-y-2">
                  <div className="flex justify-between items-center text-cyan-300 font-bold">
                    <span>Soft-Starter</span>
                    <span className="text-[10px] text-slate-500">3.2 In</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Id Appel :</span>
                      <span className="text-amber-400 font-bold">{simulationResult.methodComparison['soft-starter'].startingCurrentA} A</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Cd Décollage :</span>
                      <span className="text-emerald-400 font-bold">{simulationResult.methodComparison['soft-starter'].startingTorqueNm} Nm</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Chute Bus :</span>
                      <span className="text-cyan-300 font-bold">-{simulationResult.methodComparison['soft-starter'].voltageSagPercent}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Temps t_acc :</span>
                      <span className="text-slate-200 font-bold">{simulationResult.methodComparison['soft-starter'].accelTimeSec} s</span>
                    </div>
                  </div>
                </div>

                {/* VFD */}
                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-800/50 space-y-2">
                  <div className="flex justify-between items-center text-emerald-300 font-bold">
                    <span>VFD (Variateur)</span>
                    <span className="text-[10px] text-slate-500">1.15 In</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Id Appel :</span>
                      <span className="text-emerald-400 font-bold">{simulationResult.methodComparison.vfd.startingCurrentA} A</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Cd Décollage :</span>
                      <span className="text-emerald-400 font-bold">{simulationResult.methodComparison.vfd.startingTorqueNm} Nm</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Chute Bus :</span>
                      <span className="text-emerald-400 font-bold">-{simulationResult.methodComparison.vfd.voltageSagPercent}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Temps t_acc :</span>
                      <span className="text-slate-200 font-bold">{simulationResult.methodComparison.vfd.accelTimeSec} s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Parameter Tuning Panel */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="text-xs font-bold text-white uppercase flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>{isFr ? 'PARAMÈTRES ÉLECTRIQUES & RÉSEAU' : 'MOTOR & GRID PARAMETERS'}</span>
            </span>
          </div>

          {/* Voltage & Power */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                {isFr ? 'Tension Assignée :' : 'Voltage Tier:'}
              </label>
              <select
                value={voltageV}
                onChange={(e) => setVoltageV(Number(e.target.value) as MotorVoltageTier)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold"
              >
                <option value={400}>400 V (BT Standard)</option>
                <option value={690}>690 V (BT Lourd)</option>
                <option value={3300}>3.3 kV (HTA)</option>
                <option value={6600}>6.6 kV (HTA Industrie)</option>
                <option value={11000}>11 kV (HTA Puissance)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                {isFr ? 'Puissance P (kW) :' : 'Power (kW):'}
              </label>
              <input
                type="number"
                min={15}
                max={5000}
                step={10}
                value={powerKw}
                onChange={(e) => setPowerKw(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-cyan-300 font-bold"
              />
            </div>
          </div>

          {/* Starting Method */}
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">
              {isFr ? 'Mode de Démarrage :' : 'Starting Method:'}
            </label>
            <select
              value={startMethod}
              onChange={(e) => setStartMethod(e.target.value as MotorStartMethod)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold"
            >
              <option value="dol">Direct-On-Line (DOL) - Id ~ 6.8 In</option>
              <option value="star-delta">Étoile-Triangle (Y/Δ) - Id ~ 2.3 In</option>
              <option value="soft-starter">Démarreur Électronique (Soft-Starter)</option>
              <option value="vfd">Variateur de Fréquence (VFD / FOC)</option>
            </select>
          </div>

          {/* Mechanical Load Profile */}
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">
              {isFr ? 'Profil de Couple Résistant Mr :' : 'Mechanical Load Type:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLoadType('quadratic')}
                className={`p-2 rounded-lg text-[10px] font-bold border text-left cursor-pointer transition-colors ${
                  loadType === 'quadratic'
                    ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <div>Quadratique (k·N²)</div>
                <div className="text-[8.5px] text-slate-500 font-normal">Pompe / Ventilateur</div>
              </button>
              <button
                type="button"
                onClick={() => setLoadType('constant')}
                className={`p-2 rounded-lg text-[10px] font-bold border text-left cursor-pointer transition-colors ${
                  loadType === 'constant'
                    ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <div>Constant (M0)</div>
                <div className="text-[8.5px] text-slate-500 font-normal">Broyeur / Convoyeur</div>
              </button>
            </div>
          </div>

          {/* Upstream Transformer & Grid */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-400 uppercase font-bold">
              {isFr ? 'TRANSFORMATEUR SOURCE & RIGIDITÉ RÉSEAU' : 'SUPPLY TRANSFORMER & GRID STIFFNESS'}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-slate-500">Transfo S (kVA) :</label>
                <input
                  type="number"
                  min={100}
                  max={20000}
                  step={100}
                  value={supplyTrafoKva}
                  onChange={(e) => setSupplyTrafoKva(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500">Uk Transfo (%) :</label>
                <input
                  type="number"
                  min={3}
                  max={12}
                  step={0.5}
                  value={supplyTrafoUk}
                  onChange={(e) => setSupplyTrafoUk(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] text-slate-500">Ssc Réseau Amont (MVA) :</label>
              <input
                type="number"
                min={50}
                max={5000}
                step={50}
                value={upstreamGridSscMva}
                onChange={(e) => setUpstreamGridSscMva(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

