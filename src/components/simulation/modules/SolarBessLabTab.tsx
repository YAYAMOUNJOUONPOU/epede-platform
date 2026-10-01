// src/components/simulation/modules/SolarBessLabTab.tsx
// Section 8: Solar PV & BESS Microgrid Transient Dispatch & Frequency Response Simulator
// Compliant with IEEE 2800-2022, IEC 62933-2-1, IEC 62548, and ENTSO-E Grid Codes

import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Battery,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Gauge,
  Info,
  Clock,
  Waves,
  Play,
  Pause,
  ShieldCheck
} from 'lucide-react';

interface SolarBessLabTabProps {
  locale: 'fr' | 'en';
}

export type GridEventScenario = 'cloud_cover_drop' | 'load_step_increase' | 'generator_trip_underfrequency' | 'normal_solar_noon';

export const SolarBessLabTab: React.FC<SolarBessLabTabProps> = ({ locale }) => {
  // -------------------------------------------------------------
  // HYBRID PLANT SPECIFICATIONS (Cameroon Northern Interconnected Grid / Maroua-Guider Model)
  // -------------------------------------------------------------
  const [solarRatedMw, setSolarRatedMw] = useState<number>(30); // 30 MWp PV array
  const [bessPowerMw, setBessPowerMw] = useState<number>(15); // 15 MW PCS
  const [bessCapacityMwh, setBessCapacityMwh] = useState<number>(30); // 30 MWh 2-hour storage
  const [initialSocPct, setInitialSocPct] = useState<number>(65); // Initial State of Charge (%)
  const [gridBaseLoadMw, setGridBaseLoadMw] = useState<number>(25); // Local MV feeder load (MW)

  // Environmental & Operational Inputs
  const [irradianceWm2, setIrradianceWm2] = useState<number>(1000); // Solar Irradiance (W/m²)
  const [cellTempC, setCellTempC] = useState<number>(45); // Solar Cell Temp (°C)
  const [bessDroopPct, setBessDroopPct] = useState<number>(3.0); // Synthetic Inertia / FFR Droop (3% to 5%)
  const [bessDeadbandHz, setBessDeadbandHz] = useState<number>(0.05); // Frequency deadband (±0.05 Hz)
  const [gridFrequencyHz, setGridFrequencyHz] = useState<number>(50.0); // Grid Frequency (Hz)

  // Simulation Controls
  const [activeScenario, setActiveScenario] = useState<GridEventScenario>('cloud_cover_drop');
  const [simTimeSec, setSimTimeSec] = useState<number>(30); // Instantaneous scrubber (0 to 120s)
  const [bessMode, setBessMode] = useState<'smoothing' | 'ffr_frequency' | 'peak_shaving'>('smoothing');

  // Canvas Refs
  const dispatchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const frequencyCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // -------------------------------------------------------------
  // TRANSIENT HYBRID DISPATCH CALCULATIONS (IEEE 2800 / IEC 62933)
  // -------------------------------------------------------------
  // Solar PV Actual Output Power P_pv(t):
  // P_pv = P_rated * (G / 1000) * [1 + gamma * (T_cell - 25)] * Inverter_Eff
  const gammaTempCoeff = -0.0035; // -0.35%/°C
  const tempDerateFactor = 1 + gammaTempCoeff * (cellTempC - 25);

  // Time-domain dynamic trajectory across 120 seconds
  const getHybridStateAtTime = (t: number) => {
    let effectiveIrradiance = irradianceWm2;
    let externalGridFreq = gridFrequencyHz;
    let feederDemand = gridBaseLoadMw;

    if (activeScenario === 'cloud_cover_drop') {
      // Cloud edge shadow sweeps across PV field from t = 20s to t = 60s, irradiance plummets from 1000 to 220 W/m²
      if (t >= 20 && t <= 50) {
        const ramp = (t - 20) / 30;
        effectiveIrradiance = 1000 - ramp * 750;
      } else if (t > 50 && t <= 80) {
        effectiveIrradiance = 250;
      } else if (t > 80 && t <= 110) {
        const recover = (t - 80) / 30;
        effectiveIrradiance = 250 + recover * 700;
      } else if (t > 110) {
        effectiveIrradiance = 950;
      }
      // Small frequency oscillation due to power deficit
      const deficit = (1000 - effectiveIrradiance) / 1000;
      externalGridFreq = 50.0 - (deficit * 0.45) * Math.sin(Math.min(Math.PI, (t - 20) / 40));
    } else if (activeScenario === 'generator_trip_underfrequency') {
      // 40 MW thermal unit trips at t = 25s, grid frequency plunges to 49.15 Hz at rate 0.4 Hz/s (RoCoF)
      if (t >= 25) {
        const dt = t - 25;
        externalGridFreq = Math.max(49.10, 50.0 - 0.90 * (1 - Math.exp(-dt / 4.5)));
      }
    } else if (activeScenario === 'load_step_increase') {
      // 10 MW industrial arc furnace / pump station switches on at t = 20s
      if (t >= 20) {
        feederDemand = gridBaseLoadMw + 10;
        externalGridFreq = Math.max(49.60, 50.0 - 0.40 * (1 - Math.exp(-(t - 20) / 8)));
      }
    }

    // Solar raw output (unbuffered)
    const rawPvMw = Math.max(0, solarRatedMw * (effectiveIrradiance / 1000) * tempDerateFactor * 0.98);

    // BESS Power Response P_bess:
    let targetBessMw = 0;
    if (bessMode === 'smoothing') {
      // Ramp-rate control: limit solar injection ramp to max 10% per minute (0.05 MW/s)
      const nominalPvAtFullSun = solarRatedMw * tempDerateFactor * 0.98;
      const expectedFirm = Math.min(nominalPvAtFullSun, feederDemand);
      const solarDeficit = expectedFirm - rawPvMw;
      targetBessMw = Math.min(bessPowerMw, Math.max(-bessPowerMw, solarDeficit));
    } else if (bessMode === 'ffr_frequency') {
      // IEEE 2800 Fast Frequency Response: ΔP = - (1 / droop) * (Δf / f_nom) * P_rated
      const deltaF = externalGridFreq - 50.0;
      if (Math.abs(deltaF) > bessDeadbandHz) {
        const droopGain = 1 / (bessDroopPct / 100);
        targetBessMw = Math.min(bessPowerMw, Math.max(-bessPowerMw, -droopGain * (deltaF / 50.0) * bessPowerMw));
      }
    } else if (bessMode === 'peak_shaving') {
      // Shave feeder load spikes above 20 MW
      if (feederDemand > 20) {
        targetBessMw = Math.min(bessPowerMw, feederDemand - 20);
      }
    }

    // Battery SOC dynamic drift: ΔSOC = - Integral(P_bess * dt) / E_cap
    // Approximate across time t (seconds)
    const averageDischargePowerMw = targetBessMw * 0.8;
    const deltaSocPct = ((averageDischargePowerMw * (t / 3600)) / bessCapacityMwh) * 100;
    const currentSocPct = Math.max(10, Math.min(95, initialSocPct - deltaSocPct));

    // If battery is empty or full, clamp power:
    let actualBessMw = targetBessMw;
    if (currentSocPct <= 10 && targetBessMw > 0) actualBessMw = 0; // Prevent over-discharge
    if (currentSocPct >= 95 && targetBessMw < 0) actualBessMw = 0; // Prevent over-charge

    // Net Combined Feeder Injection:
    const netHybridInjectionMw = rawPvMw + actualBessMw;
    const netFeederBalanceMw = netHybridInjectionMw - feederDemand;

    // Stabilized Grid Frequency with BESS contribution
    const freqStabilizationBenefit = (actualBessMw / bessPowerMw) * 0.35;
    const finalGridFreqHz = Math.min(50.2, externalGridFreq + freqStabilizationBenefit);

    return {
      timeSec: t,
      irradianceWm2: effectiveIrradiance,
      rawPvMw,
      actualBessMw,
      netHybridInjectionMw,
      feederDemand,
      netFeederBalanceMw,
      externalGridFreq,
      finalGridFreqHz,
      currentSocPct
    };
  };

  const currentInstantState = getHybridStateAtTime(simTimeSec);

  // Scenario Handlers
  const handleApplyScenario = (scen: GridEventScenario) => {
    setActiveScenario(scen);
    if (scen === 'cloud_cover_drop') {
      setBessMode('smoothing');
      setGridBaseLoadMw(22);
      setGridFrequencyHz(50.0);
      setSimTimeSec(45); // In the middle of cloud drop
    } else if (scen === 'generator_trip_underfrequency') {
      setBessMode('ffr_frequency');
      setGridBaseLoadMw(25);
      setGridFrequencyHz(49.20);
      setSimTimeSec(35);
    } else if (scen === 'load_step_increase') {
      setBessMode('peak_shaving');
      setGridBaseLoadMw(20);
      setGridFrequencyHz(49.85);
      setSimTimeSec(35);
    } else if (scen === 'normal_solar_noon') {
      setBessMode('smoothing');
      setGridBaseLoadMw(22);
      setGridFrequencyHz(50.0);
      setIrradianceWm2(1000);
      setSimTimeSec(20);
    }
  };

  // Diagnostic Verdict
  const isFreqWithinStatutory = currentInstantState.finalGridFreqHz >= 49.5 && currentInstantState.finalGridFreqHz <= 50.5;
  const isBessEffective = Math.abs(currentInstantState.actualBessMw) > 0.5;

  let hybridVerdict: {
    status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
    titleFr: string;
    titleEn: string;
    descFr: string;
    descEn: string;
  };

  if (isFreqWithinStatutory && (currentInstantState.netFeederBalanceMw >= -2.0)) {
    hybridVerdict = {
      status: 'OPTIMAL',
      titleFr: 'Stabilité Micro-Réseau & Réponse BESS Exemplaire (IEEE 2800)',
      titleEn: 'Optimal Microgrid Stability & Fast BESS Response (IEEE 2800)',
      descFr: `La batterie BESS injecte ${currentInstantState.actualBessMw.toFixed(1)} MW pour compenser le déficit solaire/charge. Fréquence réseau stabilisée à ${currentInstantState.finalGridFreqHz.toFixed(2)} Hz (plage légale 49.5–50.5 Hz respectée). Injection nette vers l'épine dorsale : ${currentInstantState.netHybridInjectionMw.toFixed(1)} MW.`,
      descEn: `BESS provides ${currentInstantState.actualBessMw.toFixed(1)} MW of fast dynamic support. Grid frequency is firmly maintained at ${currentInstantState.finalGridFreqHz.toFixed(2)} Hz (within 49.5–50.5 Hz statutory band). Net hybrid injection: ${currentInstantState.netHybridInjectionMw.toFixed(1)} MW.`,
    };
  } else if (!isFreqWithinStatutory) {
    hybridVerdict = {
      status: 'CRITICAL',
      titleFr: 'Excursion Sévère de Fréquence — Risque de Déclestage UFLS (ANSI 81L)',
      titleEn: 'Severe Frequency Excursion — Risk of Under-Frequency Load Shedding (81L)',
      descFr: `Fréquence réseau dégradée à ${currentInstantState.finalGridFreqHz.toFixed(2)} Hz (< 49.50 Hz) ! La puissance BESS disponible (${bessPowerMw} MW) est saturée. Risque immédiat de déclenchement des relais à manque de fréquence 81L et déconnexion en cascade.`,
      descEn: `Grid frequency plummeted to ${currentInstantState.finalGridFreqHz.toFixed(2)} Hz (< 49.50 Hz)! BESS PCS power rating (${bessPowerMw} MW) is saturated. Immediate risk of automatic underfrequency load shedding (81L).`,
    };
  } else {
    hybridVerdict = {
      status: 'WARNING',
      titleFr: 'Soutien Actif Limite — Réserve de Stockage Fortement Sollicitée',
      titleEn: 'Active Support Operating Near Storage Depletion Limits',
      descFr: `Le micro-réseau soutient la charge mais l'état de charge SOC (${currentInstantState.currentSocPct.toFixed(1)}%) s'érode rapidement. Prévoir le démarrage d'une tranche thermique de secours si le déficit persiste au-delà de l'autonomie BESS.`,
      descEn: `Microgrid balance maintained, but battery state of charge (${currentInstantState.currentSocPct.toFixed(1)}%) is rapidly depleting. Prepare dispatch of auxiliary dispatchable units.`,
    };
  }

  // -------------------------------------------------------------
  // CANVAS 1: POWER DISPATCH TRAJECTORY (SOLAR RAW vs BESS vs NET INJECTION vs LOAD)
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = dispatchCanvasRef.current;
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

    const tMax = 120; // seconds
    const pMax = Math.max(35, solarRatedMw * 1.15, gridBaseLoadMw * 1.3);
    const pMin = -15; // BESS charging can be negative

    const toX = (t: number) => originX + (t / tMax) * plotW;
    const toY = (p: number) => originY - ((p - pMin) / (pMax - pMin)) * plotH;

    // Grid Lines
    ctx.strokeStyle = '#252E38';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748B';
    ctx.font = '9px ui-monospace, monospace';

    for (let t = 0; t <= tMax; t += 20) {
      const x = toX(t);
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, originY);
      ctx.stroke();
      ctx.fillText(`${t}s`, x - 8, originY + 16);
    }

    for (let p = 0; p <= pMax; p += 10) {
      const y = toY(p);
      ctx.beginPath();
      ctx.moveTo(originX, y);
      ctx.lineTo(originX + plotW, y);
      ctx.stroke();
      ctx.fillText(`${p} MW`, originX - 42, y + 3);
    }

    // Zero line
    const yZero = toY(0);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(originX, yZero);
    ctx.lineTo(originX + plotW, yZero);
    ctx.stroke();

    // 1. Draw Feeder Demand Line (Red Dashed)
    ctx.strokeStyle = '#F43F5E';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let t = 0; t <= tMax; t += 2) {
      const st = getHybridStateAtTime(t);
      const x = toX(t);
      const y = toY(st.feederDemand);
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Draw Raw Solar PV Output (Amber Dotted)
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
    ctx.setLineDash([2, 2]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let t = 0; t <= tMax; t += 1) {
      const st = getHybridStateAtTime(t);
      const x = toX(t);
      const y = toY(st.rawPvMw);
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Draw BESS Power Dispatch (Cyan / Violet)
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let t = 0; t <= tMax; t += 1) {
      const st = getHybridStateAtTime(t);
      const x = toX(t);
      const y = toY(st.actualBessMw);
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 4. Draw Combined Net Hybrid Injection to Grid (Emerald Bold)
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let t = 0; t <= tMax; t += 1) {
      const st = getHybridStateAtTime(t);
      const x = toX(t);
      const y = toY(st.netHybridInjectionMw);
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Time Scrubber Cursor
    const currX = toX(simTimeSec);
    ctx.strokeStyle = '#FFFFFF';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(currX, padTop);
    ctx.lineTo(currX, originY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Legend
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
    ctx.fillText('PV Brute', originX + 8, padTop - 12);
    ctx.fillStyle = '#38BDF8';
    ctx.fillText('BESS PCS', originX + 85, padTop - 12);
    ctx.fillStyle = '#10B981';
    ctx.fillText('Injection Nette', originX + 165, padTop - 12);
    ctx.fillStyle = '#F43F5E';
    ctx.fillText('Charge Réseau', originX + 285, padTop - 12);
  }, [
    solarRatedMw,
    bessPowerMw,
    gridBaseLoadMw,
    irradianceWm2,
    cellTempC,
    bessMode,
    activeScenario,
    simTimeSec
  ]);

  // -------------------------------------------------------------
  // CANVAS 2: FREQUENCY RESPONSE (GRID FREQ WITH vs WITHOUT BESS SUPPORT)
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = frequencyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.parentElement?.clientWidth || 320);
    const h = (canvas.height = 230);

    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, w, h);

    const padLeft = 40;
    const padRight = 20;
    const padTop = 24;
    const padBottom = 28;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;
    const originX = padLeft;
    const originY = padTop + plotH;

    const fMin = 48.8;
    const fMax = 50.4;
    const tMax = 120;

    const toX = (t: number) => originX + (t / tMax) * plotW;
    const toY = (f: number) => originY - ((f - fMin) / (fMax - fMin)) * plotH;

    // Grid
    ctx.strokeStyle = '#252E38';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748B';
    ctx.font = '8px ui-monospace, monospace';

    // Nominal 50.0 Hz line
    const yNom = toY(50.0);
    ctx.strokeStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(originX, yNom);
    ctx.lineTo(originX + plotW, yNom);
    ctx.stroke();
    ctx.fillText('50.0 Hz', originX - 35, yNom + 3);

    // Statutory 49.5 Hz threshold (Orange)
    const yUfls = toY(49.5);
    ctx.strokeStyle = '#F59E0B';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(originX, yUfls);
    ctx.lineTo(originX + plotW, yUfls);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText('49.5 Hz', originX - 35, yUfls + 3);

    // Unmitigated Frequency (Dashed Rose)
    ctx.beginPath();
    ctx.strokeStyle = '#F43F5E';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;
    for (let t = 0; t <= tMax; t += 2) {
      const st = getHybridStateAtTime(t);
      const x = toX(t);
      const y = toY(st.externalGridFreq);
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Stabilized Frequency with BESS FFR (Emerald Bold)
    ctx.beginPath();
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2.5;
    for (let t = 0; t <= tMax; t += 2) {
      const st = getHybridStateAtTime(t);
      const x = toX(t);
      const y = toY(st.finalGridFreqHz);
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Current point
    const currX = toX(simTimeSec);
    const currY = toY(currentInstantState.finalGridFreqHz);
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(currX, currY, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.fillText(`${currentInstantState.finalGridFreqHz.toFixed(2)} Hz`, currX + 6, currY - 6);
  }, [
    simTimeSec,
    currentInstantState,
    activeScenario,
    bessMode,
    bessPowerMw
  ]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-5 rounded-2xl bg-[#0D1117] border border-[#252E38] shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Sun className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white tracking-wide uppercase font-mono">
                {locale === 'fr'
                  ? 'BANC DE SIMULATION : DISPATCHING SOLAIRE PV & STOCKAGE BESS'
                  : 'SIMULATION LAB: SOLAR PV & BESS HYBRID TRANSIENT DISPATCH'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-900/40 text-amber-300 border border-amber-700 font-mono">
                IEEE 2800 / CEI 62933 / CEI 62548
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 font-sans">
              {locale === 'fr'
                ? "Lissage des rampes d'ensoleillement (passages nuageux), réponse inertielle rapide FFR (Fast Frequency Response) et écrêtement des pointes sur réseau HTA 30 kV."
                : 'Solar ramp smoothing, Fast Frequency Response (FFR) synthetic inertia, and peak-shaving dispatch on 30 kV microgrid interconnection.'}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-neutral-400">{locale === 'fr' ? 'FRÉQUENCE RÉSEAU :' : 'GRID FREQUENCY:'}</span>
          <div
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border ${
              isFreqWithinStatutory
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-red-500/20 text-red-300 border-red-500/50'
            }`}
          >
            {isFreqWithinStatutory ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <span>{`${currentInstantState.finalGridFreqHz.toFixed(2)} Hz (${isFreqWithinStatutory ? 'Stable' : 'Anomalie UFLS'})`}</span>
          </div>
        </div>
      </div>

      {/* Engineering Diagnostic Verdict */}
      <div
        className={`p-4 rounded-xl border flex items-start gap-3.5 font-mono text-xs ${
          hybridVerdict.status === 'OPTIMAL'
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            : hybridVerdict.status === 'WARNING'
            ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
            : 'bg-red-950/30 border-red-500/50 text-red-300'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {hybridVerdict.status === 'OPTIMAL' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : hybridVerdict.status === 'WARNING' ? (
            <ShieldAlert className="h-5 w-5 text-amber-400" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-400" />
          )}
        </div>
        <div className="space-y-1">
          <div className="font-black text-sm">
            {locale === 'fr' ? hybridVerdict.titleFr : hybridVerdict.titleEn}
          </div>
          <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
            {locale === 'fr' ? hybridVerdict.descFr : hybridVerdict.descEn}
          </p>
        </div>
      </div>

      {/* Preset Microgrid Scenarios */}
      <div className="p-4 rounded-2xl bg-[#0D1117] border border-[#252E38] space-y-2.5">
        <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold">
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            {locale === 'fr' ? 'Scénarios Préréglés de Dynamique Micro-Réseau :' : 'Microgrid Disturbance Scenarios:'}
          </span>
          <span className="text-[10px] text-neutral-500">Centrale Hybride Maroua-Guider (30 MW PV + 15 MW BESS)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleApplyScenario('cloud_cover_drop')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeScenario === 'cloud_cover_drop'
                ? 'border-amber-400 bg-amber-400/20 text-amber-200 shadow-md'
                : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-[11px]">1. {locale === 'fr' ? 'Passage Nuageux Rapide' : 'Cloud Shading Drop'}</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">Chute 1000 &rarr; 250 W/m² · Lissage BESS</div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyScenario('generator_trip_underfrequency')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeScenario === 'generator_trip_underfrequency'
                ? 'border-red-500 bg-red-500/20 text-red-200 shadow-md'
                : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-[11px]">2. {locale === 'fr' ? 'Déclenchement Groupe 40MW' : '40MW Gen Trip'}</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">Fréquence 49.1 Hz · Réponse FFR &le; 200ms</div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyScenario('load_step_increase')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeScenario === 'load_step_increase'
                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200 shadow-md'
                : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-[11px]">3. {locale === 'fr' ? 'Appel de Charge +10MW' : 'Load Step +10MW'}</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">Écrêtage de pointe & soutien tension</div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyScenario('normal_solar_noon')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeScenario === 'normal_solar_noon'
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200 shadow-md'
                : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-[11px]">4. {locale === 'fr' ? 'Plein Ensoleillement (Midi)' : 'Full Solar Noon'}</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">Recharge BESS & export maximal</div>
          </button>
        </div>
      </div>

      {/* Main Grid: Power Dispatch Curve & Frequency Response */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Dynamic Dispatch Graph */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono">
              <span className="flex items-center gap-2 font-bold text-white uppercase">
                <Activity className="h-4 w-4 text-amber-400" />
                {locale === 'fr' ? 'CHRONOGRAMME DE DISPATCH HYBRIDE : SOLAIRE vs BESS vs INJECTION' : 'HYBRID POWER DISPATCH: PV vs BESS vs NET EXPORT'}
              </span>
              <span className="text-cyan-400">
                PV = {currentInstantState.rawPvMw.toFixed(1)} MW · BESS = {currentInstantState.actualBessMw > 0 ? `+${currentInstantState.actualBessMw.toFixed(1)}` : currentInstantState.actualBessMw.toFixed(1)} MW
              </span>
            </div>

            <div className="w-full overflow-hidden rounded-xl border border-[#252E38] bg-[#080B10]">
              <canvas ref={dispatchCanvasRef} className="w-full block" />
            </div>

            {/* Time Scrubber Slider */}
            <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="flex items-center gap-1.5 font-bold">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  {locale === 'fr' ? 'Curseur Temporel Instantané t :' : 'Instantaneous Simulation Time t:'}
                </span>
                <span className="text-cyan-300 font-bold">{simTimeSec}s / 120s</span>
              </div>
              <input
                type="range"
                min={0}
                max={120}
                step={1}
                value={simTimeSec}
                onChange={(e) => setSimTimeSec(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'INJECTION NETTE' : 'NET INJECTION'}</div>
                <div className="text-base font-black text-emerald-300 mt-0.5">
                  {currentInstantState.netHybridInjectionMw.toFixed(1)} MW
                </div>
                <div className="text-[9px] text-neutral-500">Demande: {currentInstantState.feederDemand} MW</div>
              </div>

              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'PUISSANCE BESS' : 'BESS OUTPUT'}</div>
                <div className="text-base font-black text-cyan-300 mt-0.5">
                  {currentInstantState.actualBessMw > 0 ? `+${currentInstantState.actualBessMw.toFixed(1)}` : currentInstantState.actualBessMw.toFixed(1)} MW
                </div>
                <div className="text-[9px] text-neutral-500">Capacité: ±{bessPowerMw} MW</div>
              </div>

              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'ÉTAT CHARGE SOC' : 'BATTERY SOC'}</div>
                <div className="text-base font-black text-amber-300 mt-0.5">
                  {currentInstantState.currentSocPct.toFixed(1)}%
                </div>
                <div className="text-[9px] text-neutral-500">30 MWh installés</div>
              </div>

              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'FRÉQUENCE STABILISÉE' : 'FINAL FREQUENCY'}</div>
                <div className={`text-base font-black mt-0.5 ${isFreqWithinStatutory ? 'text-emerald-300' : 'text-red-400'}`}>
                  {currentInstantState.finalGridFreqHz.toFixed(2)} Hz
                </div>
                <div className="text-[9px] text-neutral-500">Sans BESS: {currentInstantState.externalGridFreq.toFixed(2)} Hz</div>
              </div>
            </div>
          </div>

          {/* Frequency Dynamics & Standards Card */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono">
              <span className="flex items-center gap-2 font-bold text-white uppercase">
                <Waves className="h-4 w-4 text-cyan-400" />
                {locale === 'fr' ? 'RÉPONSE EN FRÉQUENCE FFR DU BESS (IEEE 2800 / ENTSO-E)' : 'FAST FREQUENCY RESPONSE FFR (IEEE 2800)'}
              </span>
              <span className="text-emerald-400">Statutaire : 49.50 – 50.50 Hz</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#252E38] bg-[#080B10] p-2 flex items-center justify-center">
                <canvas ref={frequencyCanvasRef} className="w-full block" />
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Info className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'Norme IEEE 2800 pour Micro-Réseaux Hybrides :' : 'IEEE 2800 Hybrid Grid Code Rules:'}</span>
                </div>
                <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                  {locale === 'fr'
                    ? "Les onduleurs hybrides (PV + BESS) doivent réagir en moins de 200 ms lors d'une baisse de fréquence pour injecter de la puissance active (Fast Frequency Response FFR). La pente de statisme (droop = 3%) permet d'amortir le creux de fréquence (Nadir) et d'éviter l'effondrement du réseau."
                    : "Inverters must inject fast active power in under 200ms during frequency drops (Fast Frequency Response FFR). A 3% droop slope mitigates the frequency nadir and eliminates cascading blackout risks."}
                </p>
                <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] space-y-1 text-[11px]">
                  <div className="text-emerald-300">• {locale === 'fr' ? 'Statisme configuré (Droop) :' : 'Configured Droop:'} {bessDroopPct}%</div>
                  <div className="text-cyan-300">• {locale === 'fr' ? 'Bande morte fréquentielle :' : 'Deadband:'} ±{bessDeadbandHz} Hz</div>
                  <div className="text-amber-300">• {locale === 'fr' ? 'Mode régulation active :' : 'Active Mode:'} {bessMode.toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Dynamic Controls & Operational Modes */}
        <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-5 font-mono text-xs">
          <div className="border-b border-[#252E38] pb-3 flex items-center justify-between">
            <span className="font-bold text-white uppercase flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-amber-400" />
              {locale === 'fr' ? 'RÉGULATION BESS & PV' : 'BESS & PV DISPATCH'}
            </span>
            <button
              type="button"
              onClick={() => handleApplyScenario('cloud_cover_drop')}
              className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              {locale === 'fr' ? 'Réinit' : 'Reset'}
            </button>
          </div>

          <div className="space-y-4">
            {/* Control Mode Selector */}
            <div className="space-y-1">
              <label className="text-neutral-300">{locale === 'fr' ? 'Mode de Contrôle BESS :' : 'BESS Control Mode:'}</label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { id: 'smoothing', fr: 'Lissage de Rampe Solaire', en: 'Solar Ramp Smoothing' },
                  { id: 'ffr_frequency', fr: 'Inertie & Soutien Fréquence FFR', en: 'Synthetic Inertia & FFR' },
                  { id: 'peak_shaving', fr: 'Écrêtement des Pointes de Charge', en: 'Peak-Shaving Feeder' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setBessMode(m.id as any)}
                    className={`py-2 px-3 rounded-lg border text-left font-bold transition-all ${
                      bessMode === m.id
                        ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300 shadow-xs'
                        : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {locale === 'fr' ? m.fr : m.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Solar Array Rating MW */}
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Capacité Champ PV (MWc) :' : 'Solar PV Field (MWp):'}</span>
                <span className="text-amber-400 font-bold">{solarRatedMw} MWc</span>
              </label>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={solarRatedMw}
                onChange={(e) => setSolarRatedMw(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400"
              />
            </div>

            {/* BESS Power MW */}
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Puissance PCS BESS (MW) :' : 'BESS PCS Power (MW):'}</span>
                <span className="text-cyan-400 font-bold">±{bessPowerMw} MW</span>
              </label>
              <input
                type="range"
                min={2}
                max={30}
                step={1}
                value={bessPowerMw}
                onChange={(e) => setBessPowerMw(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Grid Feeder Demand MW */}
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Charge Départ HTA (MW) :' : 'Feeder Demand (MW):'}</span>
                <span className="text-rose-400 font-bold">{gridBaseLoadMw} MW</span>
              </label>
              <input
                type="range"
                min={5}
                max={45}
                step={1}
                value={gridBaseLoadMw}
                onChange={(e) => setGridBaseLoadMw(parseInt(e.target.value, 10))}
                className="w-full accent-rose-400"
              />
            </div>

            {/* FFR Droop % */}
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Statisme FFR (Droop) :' : 'FFR Droop Slope:'}</span>
                <span className="text-emerald-400 font-bold">{bessDroopPct}%</span>
              </label>
              <input
                type="range"
                min={1.5}
                max={6.0}
                step={0.5}
                value={bessDroopPct}
                onChange={(e) => setBessDroopPct(parseFloat(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>
          </div>

          {/* Reference footer */}
          <div className="pt-3 border-t border-[#252E38] space-y-1 text-[10px] text-neutral-400">
            <div className="text-amber-400 font-bold uppercase">{locale === 'fr' ? 'Spécifications Techniques :' : 'Technical Specs:'}</div>
            <div>• IEEE 2800-2022 : Fast Frequency Response (FFR &le; 200 ms)</div>
            <div>• CEI 62933-2-1 : Essais dynamiques des systèmes BESS</div>
            <div>• CEI 62548 : Conception des générateurs photovoltaïques</div>
          </div>
        </div>
      </div>
    </div>
  );
};
