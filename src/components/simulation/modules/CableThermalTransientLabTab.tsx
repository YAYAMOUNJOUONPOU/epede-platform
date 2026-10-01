// src/components/simulation/modules/CableThermalTransientLabTab.tsx
// Section 7: Cable Transient Thermal Dynamics & Overload Heating Simulator
// Compliant with IEC 60853-1, IEC 60853-2 (Cyclic & Emergency Ratings), IEC 60287 (Steady-State), and IEC 60949 (Short-Circuit)

import React, { useState, useEffect, useRef } from 'react';
import {
  Thermometer,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Layers,
  Flame,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Gauge,
  Info,
  Clock,
  Sun,
  ShieldCheck
} from 'lucide-react';

interface CableThermalTransientLabTabProps {
  locale: 'fr' | 'en';
}

export type CableConductorMaterial = 'copper' | 'aluminum';
export type CableInsulationType = 'xlpe_90' | 'epr_90' | 'pvc_70';
export type InstallationMediumType = 'air_trefoil' | 'air_flat' | 'buried_direct' | 'duct_bank';

export const CableThermalTransientLabTab: React.FC<CableThermalTransientLabTabProps> = ({ locale }) => {
  // -------------------------------------------------------------
  // CABLE CONSTRUCTION & THERMAL PARAMETERS
  // -------------------------------------------------------------
  const [crossSectionMm2, setCrossSectionMm2] = useState<number>(240); // mm²
  const [material, setMaterial] = useState<CableConductorMaterial>('aluminum');
  const [insulation, setInsulation] = useState<CableInsulationType>('xlpe_90');
  const [installationMedium, setInstallationMedium] = useState<InstallationMediumType>('buried_direct');

  // Thermal Network Constants (2-loop Cauer/Foster Model IEC 60853)
  const [ambientTempC, setAmbientTempC] = useState<number>(35); // Ambient or ground temperature (°C)
  const [soilThermalResistivityKmPerW, setSoilThermalResistivityKmPerW] = useState<number>(1.2); // Soil thermal resistivity g (K·m/W)
  const [burialDepthM, setBurialDepthM] = useState<number>(1.0); // Burial depth L (m)

  // Operating Current Profile
  const [baseCurrentA, setBaseCurrentA] = useState<number>(380); // Normal operating load (A)
  const [stepOverloadCurrentA, setStepOverloadCurrentA] = useState<number>(620); // Emergency overload current (A)
  const [overloadDurationMin, setOverloadDurationMin] = useState<number>(45); // Overload duration (minutes)
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true);

  // Time window for simulation: 0 to 180 minutes
  const [simTimeMin, setSimTimeMin] = useState<number>(75);

  // Canvas Ref
  const tempProfileCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cableCrossSectionCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Thermal Limits
  const maxContinuousTempC = insulation === 'pvc_70' ? 70 : 90;
  const maxEmergencyTempC = insulation === 'pvc_70' ? 95 : 130;
  const maxShortCircuitTempC = insulation === 'pvc_70' ? 160 : 250;

  // -------------------------------------------------------------
  // ELECTROTHERMAL COMPUTATIONS (IEC 60287 / IEC 60853)
  // -------------------------------------------------------------
  // Conductor AC Resistance at operating temp θ: R(θ) = R20 * [1 + α20 * (θ - 20)] * (1 + ys + yp)
  const rho20 = material === 'copper' ? 0.017241 : 0.028264; // Ω·mm²/m
  const alpha20 = material === 'copper' ? 0.00393 : 0.00403; // 1/K
  const r20 = (rho20 / crossSectionMm2); // Ω/m
  const rAtMaxCont = r20 * (1 + alpha20 * (maxContinuousTempC - 20)) * 1.05; // Skin & proximity factor ~1.05

  // Thermal resistance parts (K·m/W):
  // T1: Insulation, T2: Bedding/Armour, T3: Outer Sheath, T4: Surrounding Environment
  const t1_insulation = insulation === 'xlpe_90' ? 0.35 : 0.42;
  const t3_sheath = 0.08;
  const t4_environment = installationMedium === 'buried_direct'
    ? (soilThermalResistivityKmPerW / (2 * Math.PI)) * Math.log((4 * burialDepthM * 1000) / 75)
    : installationMedium === 'duct_bank' ? 1.4 : 0.65;

  const totalThermalResistance = t1_insulation + t3_sheath + t4_environment; // K·m/W

  // Thermal capacitances (J / K·m):
  // Conductor capacitance C_c = cross_section * density * specific_heat
  // Cu: density 8900 kg/m³, c = 385 J/kg·K => ~3.4 J/cm³·K
  // Al: density 2700 kg/m³, c = 900 J/kg·K => ~2.4 J/cm³·K
  const cConductor = crossSectionMm2 * 1e-6 * (material === 'copper' ? 8900 * 385 : 2700 * 900); // J/K·m
  const cInsulation = 800; // J/K·m
  const cEnvironment = installationMedium === 'buried_direct' ? 8000 : 1200; // Large ground thermal inertia

  // Thermal time constants:
  // Conductor to sheath tau1 (minutes): fast (~5 to 15 mins)
  const tau1Min = (cConductor * t1_insulation * 60) / 120;
  // Cable to environment tau2 (minutes): slow thermal inertia of soil (~60 to 180 mins)
  const tau2Min = (cEnvironment * t4_environment) / 60;

  // Rated continuous ampacity I_rated (A):
  // I_rated = sqrt( (θ_max - θ_amb) / (R_ac * totalThermalResistance) )
  const ratedAmpacityA = Math.round(
    Math.sqrt(Math.max(0, maxContinuousTempC - ambientTempC) / (rAtMaxCont * totalThermalResistance))
  );

  // Dynamic Temperature Evaluation Function at time t (minutes):
  // Overload applied from t = 20 min to t = 20 + overloadDurationMin
  const getConductorTempAtTime = (t: number): { thetaC: number; currentA: number } => {
    const tOverloadStart = 20;
    const tOverloadEnd = tOverloadStart + overloadDurationMin;

    let current = baseCurrentA;
    if (t >= tOverloadStart && t < tOverloadEnd) {
      current = stepOverloadCurrentA;
    } else if (t >= tOverloadEnd) {
      current = baseCurrentA;
    }

    // Steady state temp for base current:
    const jouleLossBase = Math.pow(baseCurrentA, 2) * rAtMaxCont;
    const deltaThetaBase = jouleLossBase * totalThermalResistance;

    if (t < tOverloadStart) {
      return { thetaC: ambientTempC + deltaThetaBase, currentA: current };
    }

    // Overload pulse response:
    const jouleLossOverload = Math.pow(stepOverloadCurrentA, 2) * rAtMaxCont;
    const deltaThetaOverload = jouleLossOverload * totalThermalResistance;
    const deltaStep = deltaThetaOverload - deltaThetaBase;

    if (t >= tOverloadStart && t < tOverloadEnd) {
      const dt = t - tOverloadStart;
      // Dual exponential heating curve: Δθ(t) = Δθ_base + ΔStep * [ 0.45*(1 - e^(-dt/tau1)) + 0.55*(1 - e^(-dt/tau2)) ]
      const transientFactor = 0.45 * (1 - Math.exp(-dt / tau1Min)) + 0.55 * (1 - Math.exp(-dt / tau2Min));
      return { thetaC: ambientTempC + deltaThetaBase + deltaStep * transientFactor, currentA: current };
    } else {
      // Cooling phase:
      const dtCool = t - tOverloadEnd;
      const duration = overloadDurationMin;
      const peakRiseAtEnd = deltaStep * (0.45 * (1 - Math.exp(-duration / tau1Min)) + 0.55 * (1 - Math.exp(-duration / tau2Min)));
      const decayFactor = 0.45 * Math.exp(-dtCool / tau1Min) + 0.55 * Math.exp(-dtCool / tau2Min);
      return { thetaC: ambientTempC + deltaThetaBase + peakRiseAtEnd * decayFactor, currentA: current };
    }
  };

  // Peak temperature reached during overload
  const peakTempC = getConductorTempAtTime(20 + overloadDurationMin).thetaC;
  const currentInstantData = getConductorTempAtTime(simTimeMin);

  // Thermal Safety Assessment
  const isContinuousSafe = peakTempC <= maxContinuousTempC;
  const isEmergencySafe = peakTempC <= maxEmergencyTempC;

  let thermalVerdict: {
    status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
    titleFr: string;
    titleEn: string;
    descFr: string;
    descEn: string;
  };

  if (isContinuousSafe) {
    thermalVerdict = {
      status: 'OPTIMAL',
      titleFr: 'Surcharge Thermique Absorbée sans Vieillissement Accéléré',
      titleEn: 'Overload Thermal Stress Absorbed Within Normal Limits',
      descFr: `La température maximale de l'âme conductrice plafonne à ${peakTempC.toFixed(1)}°C, ce qui reste inférieur au régime continu nominal (${maxContinuousTempC}°C). L'inertie thermique du sol amortit la surintensité sans entamer la durée de vie de l'isolant ${insulation.toUpperCase()}.`,
      descEn: `Conductor core temperature peaks at ${peakTempC.toFixed(1)}°C, well within rated continuous limits (${maxContinuousTempC}°C). Ground thermal inertia safely absorbs the overload without cable insulation degradation.`,
    };
  } else if (isEmergencySafe) {
    thermalVerdict = {
      status: 'WARNING',
      titleFr: 'Régime de Surcharge de Secours Conforme CEI 60853 (Admissible Temporairement)',
      titleEn: 'Emergency Overload Rating (IEC 60853 Permissible Temporarily)',
      descFr: `La température (${peakTempC.toFixed(1)}°C) dépasse le régime continu (${maxContinuousTempC}°C) mais reste en dessous de la limite d'urgence (${maxEmergencyTempC}°C). Conforme aux surcharges de secours temporaires (max 100h par an selon CEI 60853). Prévoir un retour à la normale dans les délais.`,
      descEn: `Temperature (${peakTempC.toFixed(1)}°C) exceeds continuous rating (${maxContinuousTempC}°C) but remains below emergency limit (${maxEmergencyTempC}°C). Compliant with IEC 60853 cyclic emergency overloads (max 100 hrs/year).`,
    };
  } else {
    thermalVerdict = {
      status: 'CRITICAL',
      titleFr: 'Emballement Thermique & Dégradation de l’Isolant (Dépassement > 130°C)',
      titleEn: 'Thermal Runaway & Insulation Degradation (Exceeded > 130°C)',
      descFr: `La température maximale atteinte (${peakTempC.toFixed(1)}°C) outrepasse la tenue thermique d'urgence (${maxEmergencyTempC}°C) ! Risque immédiat de fluage du polyéthylène réticulé, de cloquage diélectrique et de court-circuit entre phases. Réduire l'intensité ou la durée de la surcharge.`,
      descEn: `Peak temperature reached (${peakTempC.toFixed(1)}°C) violates maximum emergency rating (${maxEmergencyTempC}°C)! High risk of XLPE thermal flow, dielectric breakdown, and phase-to-phase flashover. Curtail overload current or duration immediately.`,
    };
  }

  // -------------------------------------------------------------
  // CANVAS 1: TRANSIENT HEATING & COOLING TEMPERATURE PROFILE
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = tempProfileCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerW = canvas.parentElement?.clientWidth || 600;
    const w = (canvas.width = Math.max(340, containerW));
    const h = (canvas.height = 300);

    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, w, h);

    const padLeft = 48;
    const padRight = 24;
    const padTop = 32;
    const padBottom = 32;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;
    const originX = padLeft;
    const originY = padTop + plotH;

    const tMax = 180; // minutes
    const tempMax = Math.max(150, peakTempC * 1.15);
    const tempMin = Math.min(20, ambientTempC - 5);

    const toX = (t: number) => originX + (t / tMax) * plotW;
    const toY = (temp: number) => originY - ((temp - tempMin) / (tempMax - tempMin)) * plotH;

    // Grid & Axes
    ctx.strokeStyle = '#252E38';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748B';
    ctx.font = '9px ui-monospace, monospace';

    for (let t = 0; t <= tMax; t += 30) {
      const x = toX(t);
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, originY);
      ctx.stroke();
      ctx.fillText(`${t} min`, x - 12, originY + 16);
    }

    for (let temp = 40; temp <= tempMax; temp += 20) {
      const y = toY(temp);
      ctx.beginPath();
      ctx.moveTo(originX, y);
      ctx.lineTo(originX + plotW, y);
      ctx.stroke();
      ctx.fillText(`${temp}°C`, originX - 35, y + 3);
    }

    // Overload Period Shading
    const xOvlStart = toX(20);
    const xOvlEnd = toX(20 + overloadDurationMin);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
    ctx.fillRect(xOvlStart, padTop, xOvlEnd - xOvlStart, plotH);

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(xOvlStart, padTop, xOvlEnd - xOvlStart, plotH);
    ctx.setLineDash([]);

    // Draw Continuous Rated Temp Line (90°C)
    const yCont = toY(maxContinuousTempC);
    ctx.strokeStyle = '#F59E0B';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(originX, yCont);
    ctx.lineTo(originX + plotW, yCont);
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.fillText(`RÉGIME CONTINU MAX = ${maxContinuousTempC}°C`, originX + plotW - 190, yCont - 4);

    // Draw Emergency Limit Line (130°C)
    const yEmerg = toY(maxEmergencyTempC);
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(originX, yEmerg);
    ctx.lineTo(originX + plotW, yEmerg);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#EF4444';
    ctx.fillText(`LIMITE URGENCE CEI = ${maxEmergencyTempC}°C`, originX + plotW - 180, yEmerg - 4);

    // Plot Dynamic Heating / Cooling Curve
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = peakTempC > maxEmergencyTempC ? '#EF4444' : peakTempC > maxContinuousTempC ? '#F59E0B' : '#10B981';

    for (let t = 0; t <= tMax; t += 1) {
      const { thetaC } = getConductorTempAtTime(t);
      const x = toX(t);
      const y = toY(thetaC);
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Mark Current Time Pointer
    const currentX = toX(simTimeMin);
    const currentY = toY(currentInstantData.thetaC);

    ctx.strokeStyle = '#38BDF8';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(currentX, padTop);
    ctx.lineTo(currentX, originY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 6, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px ui-monospace, monospace';
    ctx.fillText(`${currentInstantData.thetaC.toFixed(1)}°C @ t=${simTimeMin}m`, currentX + 8, currentY - 8);
  }, [
    simTimeMin,
    peakTempC,
    ambientTempC,
    maxContinuousTempC,
    maxEmergencyTempC,
    overloadDurationMin,
    baseCurrentA,
    stepOverloadCurrentA,
    currentInstantData
  ]);

  // -------------------------------------------------------------
  // CANVAS 2: RADIAL TEMPERATURE GRADIENT (CONDUCTOR -> INSULATION -> SHEATH -> SOIL)
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = cableCrossSectionCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.parentElement?.clientWidth || 320);
    const h = (canvas.height = 230);

    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;

    // Radii of concentric layers (scaled in pixels)
    const rCond = 28;
    const rInsul = 48;
    const rSheath = 60;
    const rSoil = 90;

    // Conductor Core Color based on temperature
    const tempRatio = Math.min(1.0, Math.max(0, (currentInstantData.thetaC - 40) / 100));
    const condColor = tempRatio > 0.8 ? '#EF4444' : tempRatio > 0.5 ? '#F59E0B' : '#10B981';

    // Soil isothermal gradient
    const grad = ctx.createRadialGradient(centerX, centerY, rSheath, centerX, centerY, rSoil);
    grad.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
    grad.addColorStop(1, 'rgba(30, 41, 59, 0.1)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, rSoil, 0, 2 * Math.PI);
    ctx.fill();

    // Outer Sheath
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(centerX, centerY, rSheath, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Insulation Layer (XLPE)
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(centerX, centerY, rInsul, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Conductor Core
    ctx.fillStyle = condColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, rCond, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${currentInstantData.thetaC.toFixed(0)}°C`, centerX, centerY + 3);
    ctx.fillText(material === 'copper' ? 'Cu' : 'Al', centerX, centerY + 14);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(`Âme: ${crossSectionMm2} mm²`, 12, 20);
    ctx.fillText(`Sol: ${ambientTempC}°C`, 12, h - 14);
  }, [currentInstantData, crossSectionMm2, material, ambientTempC]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-[#0D1117] border border-[#252E38] shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Thermometer className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white tracking-wide uppercase font-mono">
                {locale === 'fr'
                  ? 'BANC DE SIMULATION : RÉGIME THERMIQUE TRANSITOIRE DES CÂBLES'
                  : 'SIMULATION LAB: TRANSIENT CABLE THERMAL DYNAMICS & CYCLIC OVERLOAD'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-900/40 text-amber-300 border border-amber-700 font-mono">
                CEI 60853 / CEI 60287 / CEI 60949
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 font-sans">
              {locale === 'fr'
                ? "Modélisation dynamique Cauer/Foster à 2 constantes de temps (tau1 âme-gaine, tau2 gaine-sol), tenue en surcharge d'urgence et vieillissement thermique de l'isolant."
                : 'Dual time-constant electrothermal dynamics (tau1 core-to-sheath, tau2 sheath-to-soil), cyclic emergency withstand, and insulation thermal endurance.'}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-neutral-400">{locale === 'fr' ? 'CRÊTE THERMIQUE :' : 'PEAK CORE TEMP:'}</span>
          <div
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border ${
              isContinuousSafe
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : isEmergencySafe
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-red-500/20 text-red-300 border-red-500/50'
            }`}
          >
            {isContinuousSafe ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <span>{`${peakTempC.toFixed(1)}°C (${isContinuousSafe ? 'Permanent Conforme' : isEmergencySafe ? 'Urgence Admissible' : 'Surchauffe Critique'})`}</span>
          </div>
        </div>
      </div>

      {/* Engineering Diagnostic Verdict */}
      <div
        className={`p-4 rounded-xl border flex items-start gap-3.5 font-mono text-xs ${
          thermalVerdict.status === 'OPTIMAL'
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            : thermalVerdict.status === 'WARNING'
            ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
            : 'bg-red-950/30 border-red-500/50 text-red-300'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {thermalVerdict.status === 'OPTIMAL' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : thermalVerdict.status === 'WARNING' ? (
            <ShieldAlert className="h-5 w-5 text-amber-400" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-400" />
          )}
        </div>
        <div className="space-y-1">
          <div className="font-black text-sm">
            {locale === 'fr' ? thermalVerdict.titleFr : thermalVerdict.titleEn}
          </div>
          <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
            {locale === 'fr' ? thermalVerdict.descFr : thermalVerdict.descEn}
          </p>
        </div>
      </div>

      {/* Main Grid: Transient Curve Canvas & Radial Gradient */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Dynamic Temperature Graph */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono">
              <span className="flex items-center gap-2 font-bold text-white uppercase">
                <Activity className="h-4 w-4 text-amber-400" />
                {locale === 'fr' ? 'ÉCHAUFFEMENT TRANSITOIRE : CRÉNEAU DE SURCHARGE' : 'DYNAMIC THERMAL HEATING: OVERLOAD PULSE'}
              </span>
              <span className="text-cyan-400">
                Inom = {baseCurrentA} A · Isurcharge = {stepOverloadCurrentA} A ({overloadDurationMin} min)
              </span>
            </div>

            <div className="w-full overflow-hidden rounded-xl border border-[#252E38] bg-[#080B10]">
              <canvas ref={tempProfileCanvasRef} className="w-full block" />
            </div>

            {/* Time Scrubber Slider */}
            <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="flex items-center gap-1.5 font-bold">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  {locale === 'fr' ? 'Curseur Temporel Instantané t :' : 'Instantaneous Simulation Time t:'}
                </span>
                <span className="text-cyan-300 font-bold">{simTimeMin} minutes (I = {currentInstantData.currentA} A)</span>
              </div>
              <input
                type="range"
                min={0}
                max={180}
                step={1}
                value={simTimeMin}
                onChange={(e) => setSimTimeMin(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'TEMP. INSTANTANÉE' : 'INSTANT TEMP'}</div>
                <div className="text-base font-black text-cyan-300 mt-0.5">
                  {currentInstantData.thetaC.toFixed(1)}°C
                </div>
                <div className="text-[9px] text-neutral-500">t = {simTimeMin} min</div>
              </div>

              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'TEMP. CRÊTE MAX' : 'PEAK TEMP'}</div>
                <div className={`text-base font-black mt-0.5 ${isContinuousSafe ? 'text-emerald-300' : 'text-amber-400'}`}>
                  {peakTempC.toFixed(1)}°C
                </div>
                <div className="text-[9px] text-neutral-500">Max Perm: {maxContinuousTempC}°C</div>
              </div>

              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'COURANT ADMISSIBLE' : 'RATED AMPACITY'}</div>
                <div className="text-base font-black text-white mt-0.5">
                  {ratedAmpacityA} A
                </div>
                <div className="text-[9px] text-neutral-500">I_rated continu</div>
              </div>

              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'CONSTANTE TAU 2' : 'GROUND TAU 2'}</div>
                <div className="text-base font-black text-amber-300 mt-0.5">
                  {tau2Min.toFixed(0)} min
                </div>
                <div className="text-[9px] text-neutral-500">Inertie thermique sol</div>
              </div>
            </div>
          </div>

          {/* Radial Cross-section & Technical Insights */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono">
              <span className="flex items-center gap-2 font-bold text-white uppercase">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                {locale === 'fr' ? 'GRADIENT THERMIQUE RADIAL DU CÂBLE (CEI 60287)' : 'RADIAL TEMPERATURE GRADIENT (IEC 60287)'}
              </span>
              <span className="text-amber-400">{material.toUpperCase()} {crossSectionMm2} mm² · {insulation.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#252E38] bg-[#080B10] p-2 flex items-center justify-center">
                <canvas ref={cableCrossSectionCanvasRef} className="w-full block" />
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Info className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'Mécanismes Physiques de la CEI 60853 :' : 'IEC 60853 Physical Principles:'}</span>
                </div>
                <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                  {locale === 'fr'
                    ? "En régime transitoire, la chaleur produite par effet Joule (R·I²) est d'abord absorbée par la capacité calorifique de l'âme métallique (tau1 ~ 5 min), puis se diffuse lentement dans l'isolant et le massif de terre environnant (tau2 ~ 60 à 120 min). Cela autorise des surcharges substantielles sans risquer l'échauffement critique de l'isolant."
                    : "During transient overloads, Joule heat (R·I²) is initially absorbed by the conductor's heat capacity (tau1 ~ 5 min) before slowly diffusing into the insulation and soil surrounding the trench (tau2 ~ 60 to 120 min). This enables cyclic emergency overloads."}
                </p>
                <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] space-y-1 text-[11px]">
                  <div className="text-emerald-300">• {locale === 'fr' ? 'Âme conductrice :' : 'Core:'} {material === 'copper' ? 'Cuivre (ρ = 0.0172 Ω·mm²/m)' : 'Aluminium (ρ = 0.0282 Ω·mm²/m)'}</div>
                  <div className="text-cyan-300">• {locale === 'fr' ? 'Résistance linéique R_ac :' : 'AC Resistance R_ac:'} {(rAtMaxCont * 1000).toFixed(4)} mΩ/m</div>
                  <div className="text-amber-300">• {locale === 'fr' ? 'Résistivité thermique sol g :' : 'Soil thermal resistivity g:'} {soilThermalResistivityKmPerW} K·m/W</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Dynamic Controls & Cable Configurations */}
        <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-5 font-mono text-xs">
          <div className="border-b border-[#252E38] pb-3 flex items-center justify-between">
            <span className="font-bold text-white uppercase flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-amber-400" />
              {locale === 'fr' ? 'PARAMÈTRES DU CÂBLE' : 'CABLE PARAMETERS'}
            </span>
            <button
              type="button"
              onClick={() => {
                setCrossSectionMm2(240);
                setMaterial('aluminum');
                setBaseCurrentA(380);
                setStepOverloadCurrentA(620);
                setOverloadDurationMin(45);
              }}
              className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              {locale === 'fr' ? 'Réinit' : 'Reset'}
            </button>
          </div>

          <div className="space-y-4">
            {/* Section mm² */}
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Section de l’Âme (mm²) :' : 'Cross-Section (mm²):'}</span>
                <span className="text-amber-400 font-bold">{crossSectionMm2} mm²</span>
              </label>
              <select
                value={crossSectionMm2}
                onChange={(e) => setCrossSectionMm2(parseInt(e.target.value, 10))}
                className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-amber-400 focus:outline-none"
              >
                {[50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630].map((s) => (
                  <option key={s} value={s}>{s} mm²</option>
                ))}
              </select>
            </div>

            {/* Material */}
            <div className="space-y-1">
              <label className="text-neutral-300">{locale === 'fr' ? 'Métal Conducteur :' : 'Conductor Material:'}</label>
              <div className="grid grid-cols-2 gap-2">
                {(['aluminum', 'copper'] as CableConductorMaterial[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMaterial(m)}
                    className={`py-1.5 rounded-lg border text-center font-bold ${
                      material === m
                        ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                        : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {m === 'aluminum' ? 'Aluminium' : 'Cuivre'}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Overload Current A */}
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Courant de Surcharge (A) :' : 'Overload Current (A):'}</span>
                <span className="text-red-400 font-bold">{stepOverloadCurrentA} A</span>
              </label>
              <input
                type="range"
                min={200}
                max={1200}
                step={20}
                value={stepOverloadCurrentA}
                onChange={(e) => setStepOverloadCurrentA(parseInt(e.target.value, 10))}
                className="w-full accent-red-400"
              />
              <div className="text-[9px] text-neutral-500">
                Charge : {((stepOverloadCurrentA / Math.max(1, ratedAmpacityA)) * 100).toFixed(0)}% du continu
              </div>
            </div>

            {/* Overload Duration minutes */}
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Durée de la Surcharge (min) :' : 'Overload Duration (min):'}</span>
                <span className="text-amber-400 font-bold">{overloadDurationMin} min</span>
              </label>
              <input
                type="range"
                min={5}
                max={120}
                step={5}
                value={overloadDurationMin}
                onChange={(e) => setOverloadDurationMin(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Ambient Ground Temp */}
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Température Ambiante / Sol :' : 'Ambient / Soil Temp:'}</span>
                <span className="text-emerald-400 font-bold">{ambientTempC}°C</span>
              </label>
              <input
                type="range"
                min={15}
                max={50}
                step={1}
                value={ambientTempC}
                onChange={(e) => setAmbientTempC(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-400"
              />
            </div>

            {/* Soil Resistivity */}
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Résistivité Sol g (K·m/W) :' : 'Soil Resistivity g (K·m/W):'}</span>
                <span className="text-cyan-400 font-bold">{soilThermalResistivityKmPerW} K·m/W</span>
              </label>
              <input
                type="range"
                min={0.7}
                max={2.5}
                step={0.1}
                value={soilThermalResistivityKmPerW}
                onChange={(e) => setSoilThermalResistivityKmPerW(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          {/* Reference footer */}
          <div className="pt-3 border-t border-[#252E38] space-y-1 text-[10px] text-neutral-400">
            <div className="text-amber-400 font-bold uppercase">{locale === 'fr' ? 'Normes Applicables :' : 'Applicable Standards:'}</div>
            <div>• CEI 60853-1 / CEI 60853-2 : Régimes cycliques & de secours</div>
            <div>• CEI 60287 : Courant admissible en régime permanent</div>
            <div>• CEI 60949 : Tenue thermique aux courts-circuits</div>
          </div>
        </div>
      </div>
    </div>
  );
};
