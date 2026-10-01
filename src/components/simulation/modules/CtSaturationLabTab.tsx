// src/components/simulation/modules/CtSaturationLabTab.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Zap,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Layers,
  FileSpreadsheet,
  TrendingDown,
  Info,
  ShieldAlert
} from 'lucide-react';

interface CtSaturationLabTabProps {
  locale: 'fr' | 'en';
}

export type CtClassStandard = '5P20' | '10P20' | '5P10' | 'classPX_IEEE_C' | 'TPX_transient';

export const CtSaturationLabTab: React.FC<CtSaturationLabTabProps> = ({ locale }) => {
  // -------------------------------------------------------------
  // CT SPECIFICATIONS & CORE RATINGS (IEC 61869-2 / IEEE C37.110)
  // -------------------------------------------------------------
  const [ctStandard, setCtStandard] = useState<CtClassStandard>('5P20');
  const [primaryRatedA, setPrimaryRatedA] = useState<number>(1000); // Ipn: 1000 A
  const [secondaryRatedA, setSecondaryRatedA] = useState<number>(1); // Isn: 1 A
  const [ratedBurdenVa, setRatedBurdenVa] = useState<number>(15); // Sn: 15 VA
  const [ratedAlfn, setRatedAlfn] = useState<number>(20); // 5P20 -> ALF = 20
  const [rctInternalOhms, setRctInternalOhms] = useState<number>(3.5); // Secondary winding resistance Rct
  const [kneePointVkVolts, setKneePointVkVolts] = useState<number>(180); // Vk (Knee-point / excitation voltage)

  // Secondary Connected Burden (Cables + Relay)
  const [leadDistanceM, setLeadDistanceM] = useState<number>(60); // Distance in meters (loop 2L)
  const [wireCrossSectionMm2, setWireCrossSectionMm2] = useState<number>(4.0); // mm² Cu
  const [relayBurdenVa, setRelayBurdenVa] = useState<number>(0.2); // Modern numerical IED burden (VA)

  // Short-Circuit Network Conditions
  const [faultCurrentKa, setFaultCurrentKa] = useState<number>(25); // Primary symmetrical RMS fault current
  const [networkXrRatio, setNetworkXrRatio] = useState<number>(14); // Network X/R ratio
  const [faultInceptionAngleDeg, setFaultInceptionAngleDeg] = useState<number>(0); // 0° -> maximum DC offset
  const [remanentFluxPct, setRemanentFluxPct] = useState<number>(30); // Core remanence flux Ψrem (%)
  const [frequencyHz, setFrequencyHz] = useState<number>(50);

  // Active operating scenario
  const [activeScenario, setActiveScenario] = useState<
    'external_fault_high_xr' | 'internal_fault' | 'close_in_sym' | 'low_burden' | 'long_wiring_saturation' | 'custom'
  >('external_fault_high_xr');

  // Chart Canvas Refs
  const waveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bhCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // -------------------------------------------------------------
  // ELECTROTECHNICAL COMPUTATIONS
  // -------------------------------------------------------------
  const omega = 2 * Math.PI * frequencyHz;
  const tauPrimary = networkXrRatio / omega; // DC offset time constant (seconds)
  const rhoCu75 = 0.0216; // Copper resistivity at 75°C (Ω·mm²/m)
  const rLead = (2 * rhoCu75 * leadDistanceM) / wireCrossSectionMm2;
  const rRelay = relayBurdenVa / (secondaryRatedA ** 2);
  const rBurdenActual = rLead + rRelay;
  const rBurdenNominal = ratedBurdenVa / (secondaryRatedA ** 2);

  // Effective ALF according to connected burden
  const alfEffective = ratedAlfn * ((rctInternalOhms + rBurdenNominal) / (rctInternalOhms + rBurdenActual));

  // Secondary prospective fault current (ideal un-saturated)
  const isecRmsIdeal = (faultCurrentKa * 1000) * (secondaryRatedA / primaryRatedA);
  const faultMultiple = isecRmsIdeal / secondaryRatedA;

  // Maximum DC offset transient dimensioning factor (Ktd)
  // IEEE C37.110 & IEC 61869-2 transient dimensioning factor
  const faultInceptionRad = (faultInceptionAngleDeg * Math.PI) / 180;
  const dcOffsetFactor = Math.abs(Math.cos(faultInceptionRad)); // 1.0 when angle is 0°
  const ktdTheoretical = 1 + networkXrRatio * dcOffsetFactor;

  // Total secondary loop impedance for required knee-point
  const totalSecondaryRes = rctInternalOhms + rBurdenActual;
  const vkRequired = Math.min(2500, isecRmsIdeal * totalSecondaryRes * (1 + (networkXrRatio * 0.6) * (1 - Math.exp(-0.04 / (tauPrimary || 0.01)))));

  // Saturation Time to Saturate (Tsat in ms)
  // Empirical/IEEE C37.110 formula for time-to-saturation Tsat:
  // Tsat = -tauPrimary * ln(1 - ( (Vk / (Isec * Rtotal)) - 1 ) / (X/R))
  let timeToSaturationMs = 999; // Default infinite / no saturation
  const voltageRatio = kneePointVkVolts / (isecRmsIdeal * totalSecondaryRes + 0.001);
  const fluxRemanenceFactor = (100 - remanentFluxPct) / 100;
  const effectiveVoltageRatio = voltageRatio * fluxRemanenceFactor;

  if (effectiveVoltageRatio < 1.0) {
    // Immediate saturation within sub-cycle
    timeToSaturationMs = Math.max(1.8, 12 * effectiveVoltageRatio);
  } else if (effectiveVoltageRatio < (1 + networkXrRatio * dcOffsetFactor)) {
    // Saturation occurs during DC decay
    const val = (effectiveVoltageRatio - 1) / (networkXrRatio * dcOffsetFactor + 0.001);
    if (val < 0.99 && val > 0) {
      timeToSaturationMs = -tauPrimary * Math.log(1 - val) * 1000;
    } else {
      timeToSaturationMs = 15 + effectiveVoltageRatio * 8;
    }
  } else {
    // CT does not saturate
    timeToSaturationMs = 999;
  }

  // Saturation Severity Index (0 - 100%)
  const isSaturated = timeToSaturationMs < 80;
  const saturationSeverity = isSaturated 
    ? Math.min(100, Math.max(15, Math.round((1 - Math.min(1, timeToSaturationMs / 60)) * 100)))
    : 0;

  // Impact on protective relaying
  let relayImpactVerdict: {
    status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
    titleFr: string;
    titleEn: string;
    descFr: string;
    descEn: string;
  };

  if (!isSaturated) {
    relayImpactVerdict = {
      status: 'OPTIMAL',
      titleFr: 'Pas de Saturation Détectée — Linéarité Parfaite',
      titleEn: 'No Core Saturation Detected — Linear Response',
      descFr: `Le tore magnétique reste dans sa plage linéaire (Vk requis = ${vkRequired.toFixed(0)} V ≤ Vk nominal = ${kneePointVkVolts} V). Les relais 87T, 87B, 21 et 50/51 conservent 100% de leur précision et de leur temps de réponse instantané (< 15 ms).`,
      descEn: `Magnetic core operates well within linear region (Vk req = ${vkRequired.toFixed(0)} V ≤ Vk rated = ${kneePointVkVolts} V). Differential 87T/B, distance 21 and overcurrent 50/51 retain full accuracy and fast trip.`,
    };
  } else if (timeToSaturationMs > 15) {
    relayImpactVerdict = {
      status: 'WARNING',
      titleFr: 'Saturation Différée (Tsat > 15 ms) — Déclencheur Rapide Préservé',
      titleEn: 'Delayed Saturation (Tsat > 15 ms) — First Peak Preserved',
      descFr: `La saturation survient après ${timeToSaturationMs.toFixed(1)} ms. La première alternance crête est transmise sans déformation majeure, permettant aux relais numériques ultra-rapides (ANSI 50/87T à filtrage de Fourier ou corrélation d'onde) de valider le déclenchement avant l'effondrement de l'onde secondaire.`,
      descEn: `Core saturates after ${timeToSaturationMs.toFixed(1)} ms. The first peak is safely passed, permitting modern numerical relays (ANSI 50 / 87T) to make an accurate trip decision prior to secondary wave distortion.`,
    };
  } else {
    relayImpactVerdict = {
      status: 'CRITICAL',
      titleFr: 'Saturation Précoce Violente (Tsat < 10 ms) — Risque Majeur',
      titleEn: 'Severe Premature Saturation (Tsat < 10 ms) — Relaying Hazard',
      descFr: `Saturation instantanée sous la composante apériodique DC (Tsat = ${timeToSaturationMs.toFixed(1)} ms). Le courant secondaire s'effondre en impulsions pointues ("peaking"). Risque élevé de non-déclenchement (ANSI 50/51 retardés) ou de déclenchement intempestif sur défaut externe pour les différentielles (ANSI 87T/87B) sans retenue adaptée.`,
      descEn: `Severe DC offset saturation in only ${timeToSaturationMs.toFixed(1)} ms. Secondary current collapses into sharp distorted spikes. Severe risk of delayed trip on internal faults or false trip on through-faults.`,
    };
  }

  // Pre-configured Scenarios
  const handleApplyScenario = (scenarioKey: typeof activeScenario) => {
    setActiveScenario(scenarioKey);
    if (scenarioKey === 'external_fault_high_xr') {
      setFaultCurrentKa(31.5);
      setNetworkXrRatio(20);
      setFaultInceptionAngleDeg(0);
      setLeadDistanceM(80);
      setWireCrossSectionMm2(2.5);
      setRemanentFluxPct(40);
      setKneePointVkVolts(160);
    } else if (scenarioKey === 'internal_fault') {
      setFaultCurrentKa(20);
      setNetworkXrRatio(12);
      setFaultInceptionAngleDeg(45);
      setLeadDistanceM(30);
      setWireCrossSectionMm2(4.0);
      setRemanentFluxPct(15);
      setKneePointVkVolts(200);
    } else if (scenarioKey === 'close_in_sym') {
      setFaultCurrentKa(40);
      setNetworkXrRatio(6);
      setFaultInceptionAngleDeg(90); // Pure AC, no DC offset
      setLeadDistanceM(25);
      setWireCrossSectionMm2(4.0);
      setRemanentFluxPct(0);
      setKneePointVkVolts(220);
    } else if (scenarioKey === 'low_burden') {
      setFaultCurrentKa(25);
      setNetworkXrRatio(10);
      setFaultInceptionAngleDeg(15);
      setLeadDistanceM(20);
      setWireCrossSectionMm2(6.0); // Thick low resistance lead
      setRemanentFluxPct(10);
      setKneePointVkVolts(280); // High Vk
    } else if (scenarioKey === 'long_wiring_saturation') {
      setFaultCurrentKa(25);
      setNetworkXrRatio(18);
      setFaultInceptionAngleDeg(0);
      setLeadDistanceM(150); // Very long wiring to distant relay room
      setWireCrossSectionMm2(2.5);
      setRemanentFluxPct(60); // High remanence
      setKneePointVkVolts(120);
    }
  };

  // -------------------------------------------------------------
  // CANVAS 1: TRANSIENT CURRENT WAVEFORMS (PRIMARY vs SATURATED SECONDARY)
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerW = canvas.parentElement?.clientWidth || 600;
    const w = (canvas.width = Math.max(340, containerW));
    const h = (canvas.height = 320);

    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, w, h);

    const padLeft = 48;
    const padRight = 24;
    const padTop = 32;
    const padBottom = 32;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;
    const midY = padTop + plotH / 2;

    // Time window: 0 to 120 ms (approx 6 cycles at 50Hz)
    const tMaxSec = 0.12;
    const toX = (t: number) => padLeft + (t / tMaxSec) * plotW;

    // Primary current waveform calculation parameters
    const iPeakSym = Math.sqrt(2) * isecRmsIdeal;
    const iDc0 = -iPeakSym * Math.cos(faultInceptionRad);
    const maxAmplitude = Math.max(2.2 * iPeakSym, 1);
    const toY = (currentVal: number) => midY - (currentVal / maxAmplitude) * (plotH / 2);

    // Grid lines & time stamps
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(37, 46, 56, 0.7)';
    ctx.fillStyle = '#64748B';
    ctx.font = '9px ui-monospace, monospace';

    for (let ms = 0; ms <= 120; ms += 20) {
      const t = ms / 1000;
      const x = toX(t);
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, padTop + plotH);
      ctx.stroke();
      ctx.fillText(`${ms}ms`, x - 10, padTop + plotH + 16);
    }

    // Zero axis
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.5)';
    ctx.beginPath();
    ctx.moveTo(padLeft, midY);
    ctx.lineTo(padLeft + plotW, midY);
    ctx.stroke();

    // Saturation marker vertical line if saturated
    if (isSaturated && timeToSaturationMs <= 120) {
      const xSat = toX(timeToSaturationMs / 1000);
      ctx.strokeStyle = '#EF4444';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xSat, padTop);
      ctx.lineTo(xSat, padTop + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 9px ui-monospace, monospace';
      ctx.fillText(`Tsat = ${timeToSaturationMs.toFixed(1)} ms`, xSat + 4, padTop + 14);
    }

    // Sample points (1 ms resolution)
    const steps = 400;
    const dt = tMaxSec / steps;

    // 1. Draw Ideal Primary Current (reflected to secondary in Cyan)
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'; // Cyan dashed/dimmed
    ctx.setLineDash([3, 3]);

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      const acComponent = iPeakSym * Math.sin(omega * t + faultInceptionRad);
      const dcComponent = iDc0 * Math.exp(-t / (tauPrimary || 0.001));
      const iTotal = acComponent + dcComponent;
      const x = toX(t);
      const y = toY(iTotal);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Draw Real Saturated Secondary Current (Amber/Rose)
    // Non-linear differential model: CT core integrates secondary voltage (dΨ/dt = e).
    // When core enters saturation, magnetizing inductance Lm drops by 98%, diverting current into Lm.
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = isSaturated ? '#F59E0B' : '#10B981';

    let coreFlux = (remanentFluxPct / 100) * 0.8; // Initial flux in p.u. of saturation
    const fluxSat = 1.0;

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      const acComponent = iPeakSym * Math.sin(omega * t + faultInceptionRad);
      const dcComponent = iDc0 * Math.exp(-t / (tauPrimary || 0.001));
      const iPrimSecRef = acComponent + dcComponent;

      // Integration of flux linkage
      const inducedVoltageFactor = iPrimSecRef * (totalSecondaryRes / (kneePointVkVolts || 100));
      coreFlux += inducedVoltageFactor * dt * 30;

      // Core saturation non-linear function
      let iSecondaryActual = iPrimSecRef;
      if (Math.abs(coreFlux) > fluxSat) {
        // Deep saturation: magnetizing branch takes up fault current
        const excess = Math.abs(coreFlux) - fluxSat;
        const shuntingFactor = Math.min(0.92, excess * 1.8);
        const sign = iPrimSecRef >= 0 ? 1 : -1;
        // The secondary current collapses towards zero near the peaks
        iSecondaryActual = iPrimSecRef * (1 - shuntingFactor);
        // Add characteristic zero-crossing recovery peak
        if (Math.abs(acComponent) < iPeakSym * 0.2) {
          coreFlux *= 0.98; // partial reset during zero crossings
        }
      }

      const x = toX(t);
      const y = toY(iSecondaryActual);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Chart Legend
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.fillText(locale === 'fr' ? 'Courant Primaire Référé (Idéal sans saturation)' : 'Primary Current Reflected (Ideal)', padLeft + 8, padTop - 12);

    ctx.fillStyle = isSaturated ? '#F59E0B' : '#10B981';
    ctx.fillText(
      locale === 'fr' 
        ? `Courant Secondaire Réel (${isSaturated ? 'Saturé avec distorsion' : 'Conforme et Linéaire'})` 
        : `Actual Secondary (${isSaturated ? 'Saturated & Distorted' : 'Compliant Linear'})`,
      padLeft + 320,
      padTop - 12
    );
  }, [
    isecRmsIdeal,
    faultInceptionRad,
    omega,
    tauPrimary,
    totalSecondaryRes,
    kneePointVkVolts,
    isSaturated,
    timeToSaturationMs,
    remanentFluxPct,
    locale
  ]);

  // -------------------------------------------------------------
  // CANVAS 2: CORE MAGNETIZATION B-H CURVE & EXCITATION FLUX
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = bhCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.parentElement?.clientWidth || 320);
    const h = (canvas.height = 240);

    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, w, h);

    const padLeft = 40;
    const padRight = 20;
    const padTop = 25;
    const padBottom = 30;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;
    const originX = padLeft;
    const originY = padTop + plotH;

    // Draw axes
    ctx.strokeStyle = '#252E38';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(originX, padTop);
    ctx.lineTo(originX, originY);
    ctx.lineTo(originX + plotW, originY);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#64748B';
    ctx.font = '8px ui-monospace, monospace';
    ctx.fillText('H / Ie (A)', originX + plotW - 40, originY + 18);
    ctx.fillText('B / Vk (V)', originX - 35, padTop + 8);

    // Draw B-H / Excitation Curve (Log-linear knee curve)
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#38BDF8';

    const points = 100;
    const kneePointXNorm = 0.35;
    const kneePointYNorm = 0.65;

    for (let i = 0; i <= points; i++) {
      const frac = i / points;
      let yNorm = 0;
      if (frac < kneePointXNorm) {
        yNorm = (frac / kneePointXNorm) * kneePointYNorm;
      } else {
        const excess = (frac - kneePointXNorm) / (1 - kneePointXNorm);
        yNorm = kneePointYNorm + (1 - kneePointYNorm) * Math.pow(excess, 0.25);
      }

      const x = originX + frac * plotW;
      const y = originY - yNorm * plotH;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Knee point marker
    const kx = originX + kneePointXNorm * plotW;
    const ky = originY - kneePointYNorm * plotH;
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(kx, ky, 4, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.fillText(`Knee Vk = ${kneePointVkVolts}V`, kx + 8, ky + 2);

    // Current Operating Point on B-H curve
    const operatingRatio = Math.min(1.4, vkRequired / (kneePointVkVolts || 1));
    let opXNorm = 0;
    let opYNorm = 0;

    if (operatingRatio <= 1.0) {
      opXNorm = (operatingRatio / 1.0) * kneePointXNorm;
      opYNorm = (operatingRatio / 1.0) * kneePointYNorm;
    } else {
      const overKnee = Math.min(1.0, (operatingRatio - 1.0) / 0.4);
      opXNorm = kneePointXNorm + overKnee * (1 - kneePointXNorm);
      opYNorm = kneePointYNorm + overKnee * (1 - kneePointYNorm);
    }

    const opX = originX + opXNorm * plotW;
    const opY = originY - opYNorm * plotH;

    ctx.fillStyle = isSaturated ? '#EF4444' : '#10B981';
    ctx.beginPath();
    ctx.arc(opX, opY, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Operating point label
    ctx.fillStyle = isSaturated ? '#EF4444' : '#10B981';
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.fillText(
      isSaturated ? `Point saturé (${vkRequired.toFixed(0)}V)` : `Point linéaire (${vkRequired.toFixed(0)}V)`,
      opX - 30,
      opY - 10
    );
  }, [kneePointVkVolts, vkRequired, isSaturated]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-5 rounded-2xl bg-[#0D1117] border border-[#252E38] shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Gauge className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white tracking-wide uppercase font-mono">
                {locale === 'fr'
                  ? 'BANC DE SIMULATION : SATURATION DU TRANSFORMATEUR DE COURANT (TC)'
                  : 'SIMULATION LAB: CURRENT TRANSFORMER (CT) SATURATION'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-900/40 text-cyan-300 border border-cyan-700 font-mono">
                CEI 61869-2 / IEEE C37.110
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 font-sans">
              {locale === 'fr'
                ? 'Simulation transitoire de la composante apériodique DC (X/R), flux rémanent, temps de saturation (Tsat) et intégrité des déclenchements différentiels (ANSI 87T/B).'
                : 'Dynamic simulation of DC offset (X/R), core remanent flux, time-to-saturation (Tsat) and impact on differential protection (ANSI 87T/B).'}
            </p>
          </div>
        </div>

        {/* Severity Badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-neutral-400">{locale === 'fr' ? 'INDICE DE SATURATION :' : 'SATURATION INDEX:'}</span>
          <div
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border ${
              isSaturated
                ? saturationSeverity > 60
                  ? 'bg-red-500/20 text-red-300 border-red-500/50'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
            }`}
          >
            {isSaturated ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            <span>{isSaturated ? `${saturationSeverity}% (Tsat = ${timeToSaturationMs.toFixed(1)} ms)` : '0% (Linéaire)'}</span>
          </div>
        </div>
      </div>

      {/* Relaying Impact Alert Banner */}
      <div
        className={`p-4 rounded-xl border flex items-start gap-3.5 font-mono text-xs ${
          relayImpactVerdict.status === 'OPTIMAL'
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            : relayImpactVerdict.status === 'WARNING'
            ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
            : 'bg-red-950/30 border-red-500/50 text-red-300'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {relayImpactVerdict.status === 'OPTIMAL' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : relayImpactVerdict.status === 'WARNING' ? (
            <ShieldAlert className="h-5 w-5 text-amber-400" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-400" />
          )}
        </div>
        <div className="space-y-1">
          <div className="font-black text-sm">
            {locale === 'fr' ? relayImpactVerdict.titleFr : relayImpactVerdict.titleEn}
          </div>
          <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
            {locale === 'fr' ? relayImpactVerdict.descFr : relayImpactVerdict.descEn}
          </p>
        </div>
      </div>

      {/* Preset Scenarios Buttons */}
      <div className="p-4 rounded-2xl bg-[#0D1117] border border-[#252E38] space-y-2.5">
        <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            {locale === 'fr' ? 'Scénarios Préréglés de Test en Réseau :' : 'Standard Operating Scenarios:'}
          </span>
          <span className="text-[10px] text-neutral-500">Oyomabang / Nachtigal 225 kV & HTA</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleApplyScenario('external_fault_high_xr')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeScenario === 'external_fault_high_xr'
                ? 'border-red-500 bg-red-500/20 text-red-200 shadow-md'
                : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-[11px]">1. {locale === 'fr' ? 'Défaut Ext. Fort X/R' : 'Ext Fault High X/R'}</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">31.5 kA · X/R=20 · Tsat &lt; 10ms</div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyScenario('internal_fault')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeScenario === 'internal_fault'
                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200 shadow-md'
                : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-[11px]">2. {locale === 'fr' ? 'Défaut Interne Zone' : 'Internal Fault'}</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">20 kA · Câble court · Décl. Sûr</div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyScenario('close_in_sym')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeScenario === 'close_in_sym'
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200 shadow-md'
                : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-[11px]">3. {locale === 'fr' ? 'Défaut Symétrique AC' : 'Symmetrical AC Fault'}</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">40 kA · X/R=6 · Pas d’apériodique</div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyScenario('low_burden')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeScenario === 'low_burden'
                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200 shadow-md'
                : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-[11px]">4. {locale === 'fr' ? 'Filerie Forte Section' : 'Thick Cable (Low Rb)'}</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">6 mm² Cu · Vk=280V · 100% Linéaire</div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyScenario('long_wiring_saturation')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeScenario === 'long_wiring_saturation'
                ? 'border-amber-500 bg-amber-500/20 text-amber-200 shadow-md'
                : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-[11px]">5. {locale === 'fr' ? 'Câblage Long (150m)' : 'Long Wiring (150m)'}</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">2.5 mm² · Chute Rb critique</div>
          </button>
        </div>
      </div>

      {/* Main Grid: Waveform Analysis & B-H Plane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Waveform Canvas & Electrotechnical Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Waveform Canvas Card */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono">
              <span className="flex items-center gap-2 font-bold text-white uppercase">
                <Activity className="h-4 w-4 text-cyan-400" />
                {locale === 'fr' ? 'ONDE TRANSITOIRE SOUS COMPOSANTE APÉRIODIQUE DC' : 'TRANSIENT RESPONSE WITH DC OFFSET'}
              </span>
              <span className="text-neutral-400">f = {frequencyHz} Hz · X/R = {networkXrRatio} (τ = {(tauPrimary * 1000).toFixed(1)} ms)</span>
            </div>

            <div className="w-full overflow-hidden rounded-xl border border-[#252E38] bg-[#080B10]">
              <canvas ref={waveCanvasRef} className="w-full block" />
            </div>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'TEMPS DE SATURATION' : 'TIME TO SATURATE'}</div>
                <div className={`text-base font-black mt-0.5 ${timeToSaturationMs < 20 ? 'text-red-400' : timeToSaturationMs < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {timeToSaturationMs >= 999 ? '∞ (Linéaire)' : `${timeToSaturationMs.toFixed(1)} ms`}
                </div>
                <div className="text-[9px] text-neutral-500">{timeToSaturationMs < 20 ? 'Sub-cycle (< 1 période)' : 'Linéaire > 1 période'}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'Vk REQUISE' : 'REQUIRED Vk'}</div>
                <div className="text-base font-black text-amber-300 mt-0.5">{vkRequired.toFixed(0)} V</div>
                <div className="text-[9px] text-neutral-500">Nominale: {kneePointVkVolts} V</div>
              </div>

              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'CHARGE Rb RÉELLE' : 'CONNECTED BURDEN'}</div>
                <div className="text-base font-black text-cyan-300 mt-0.5">{rBurdenActual.toFixed(2)} Ω</div>
                <div className="text-[9px] text-neutral-500">Filerie: {rLead.toFixed(2)} Ω</div>
              </div>

              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'ALF EFFECTIF' : 'EFFECTIVE ALF'}</div>
                <div className={`text-base font-black mt-0.5 ${alfEffective >= faultMultiple ? 'text-emerald-400' : 'text-red-400'}`}>
                  {alfEffective.toFixed(1)}
                </div>
                <div className="text-[9px] text-neutral-500">Défaut: {faultMultiple.toFixed(1)} × In</div>
              </div>
            </div>
          </div>

          {/* B-H Curve & Physical Explanation Card */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono">
              <span className="flex items-center gap-2 font-bold text-white uppercase">
                <TrendingDown className="h-4 w-4 text-amber-400" />
                {locale === 'fr' ? 'COURBE D’EXCITATION B-H & COUDE MAGNÉTIQUE (CEI 61869-2)' : 'MAGNETIZATION B-H CURVE & KNEE POINT'}
              </span>
              <span className="text-cyan-400">CLASSE {ctStandard}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#252E38] bg-[#080B10] p-2 flex items-center justify-center">
                <canvas ref={bhCanvasRef} className="w-full block" />
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Info className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'Phénoménologie Physique :' : 'Physical Phenomenon:'}</span>
                </div>
                <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                  {locale === 'fr'
                    ? "Lors d'un court-circuit avec décalage de tension initial (angle proche de 0°), l'intégrale temporelle de la tension produit une onde de flux magnétique unipolaire (composante continue). Le flux s'accumule cycle après cycle jusqu'à dépasser la densité de saturation Bsat (~1.6 à 1.9 Tesla pour l'acier au silicium à grains orientés)."
                    : "During a short-circuit with voltage inception near 0°, the time integral of voltage forces a unidirectional flux buildup (DC component). The core flux accumulates until exceeding saturation density Bsat (~1.6-1.9 T)."}
                </p>
                <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] space-y-1 text-[11px]">
                  <div className="text-neutral-400 font-bold">{locale === 'fr' ? 'Critère de stabilité différentielle 87T/B :' : '87T/B Differential Stability Criteria:'}</div>
                  <div className="text-emerald-300">
                    • Tsat &gt; 25 ms : {locale === 'fr' ? 'Pleine stabilité sur défaut externe' : 'Full through-fault stability'}
                  </div>
                  <div className="text-amber-300">
                    • 10 ms &lt; Tsat &le; 25 ms : {locale === 'fr' ? 'Requiert algorithme anti-saturation / cosinus' : 'Requires saturation detector algorithms'}
                  </div>
                  <div className="text-red-300">
                    • Tsat &lt; 10 ms : {locale === 'fr' ? 'Déclenchement intempestif possible sans stabilisation' : 'High risk of mal-operation'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Dynamic Sliders & CT Ratings */}
        <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-5 font-mono text-xs">
          <div className="border-b border-[#252E38] pb-3 flex items-center justify-between">
            <span className="font-bold text-white uppercase flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-cyan-400" />
              {locale === 'fr' ? 'RÉGLAGES BANC D’ESSAI' : 'LAB CONTROLS'}
            </span>
            <button
              type="button"
              onClick={() => handleApplyScenario('external_fault_high_xr')}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              {locale === 'fr' ? 'Réinit' : 'Reset'}
            </button>
          </div>

          {/* CT Primary / Secondary */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Courant de Court-Circuit (kA) :' : 'Fault Current (kA):'}</span>
                <span className="text-red-400 font-bold">{faultCurrentKa} kA</span>
              </label>
              <input
                type="range"
                min={5}
                max={50}
                step={0.5}
                value={faultCurrentKa}
                onChange={(e) => {
                  setFaultCurrentKa(parseFloat(e.target.value));
                  setActiveScenario('custom');
                }}
                className="w-full accent-red-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Rapport Réseau X/R :' : 'Network X/R Ratio:'}</span>
                <span className="text-amber-400 font-bold">{networkXrRatio}</span>
              </label>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={networkXrRatio}
                onChange={(e) => {
                  setNetworkXrRatio(parseFloat(e.target.value));
                  setActiveScenario('custom');
                }}
                className="w-full accent-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Angle d’Enclenchement (°)' : 'Inception Angle (°):'}</span>
                <span className="text-cyan-400 font-bold">{faultInceptionAngleDeg}°</span>
              </label>
              <input
                type="range"
                min={0}
                max={90}
                step={5}
                value={faultInceptionAngleDeg}
                onChange={(e) => {
                  setFaultInceptionAngleDeg(parseInt(e.target.value, 10));
                  setActiveScenario('custom');
                }}
                className="w-full accent-cyan-400"
              />
              <div className="text-[9px] text-neutral-500">0° = DC offset max (asymétrique pur)</div>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Flux Rémanent Core Ψrem (%) :' : 'Remanent Core Flux (%):'}</span>
                <span className="text-rose-400 font-bold">{remanentFluxPct}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={80}
                step={5}
                value={remanentFluxPct}
                onChange={(e) => {
                  setRemanentFluxPct(parseInt(e.target.value, 10));
                  setActiveScenario('custom');
                }}
                className="w-full accent-rose-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Tension de Coude Vk (V) :' : 'Knee-Point Vk (V):'}</span>
                <span className="text-emerald-400 font-bold">{kneePointVkVolts} V</span>
              </label>
              <input
                type="range"
                min={50}
                max={500}
                step={10}
                value={kneePointVkVolts}
                onChange={(e) => {
                  setKneePointVkVolts(parseInt(e.target.value, 10));
                  setActiveScenario('custom');
                }}
                className="w-full accent-emerald-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Longueur Câble Filerie (m) :' : 'Cable Lead Distance (m):'}</span>
                <span className="text-cyan-400 font-bold">{leadDistanceM} m</span>
              </label>
              <input
                type="range"
                min={10}
                max={250}
                step={5}
                value={leadDistanceM}
                onChange={(e) => {
                  setLeadDistanceM(parseInt(e.target.value, 10));
                  setActiveScenario('custom');
                }}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Section Filerie Cu :' : 'Wire Cross Section:'}</span>
                <span className="text-cyan-400 font-bold">{wireCrossSectionMm2} mm²</span>
              </label>
              <select
                value={wireCrossSectionMm2}
                onChange={(e) => {
                  setWireCrossSectionMm2(parseFloat(e.target.value));
                  setActiveScenario('custom');
                }}
                className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-cyan-400 focus:outline-none"
              >
                <option value={2.5}>2.5 mm² Cu</option>
                <option value={4.0}>4.0 mm² Cu (Standard)</option>
                <option value={6.0}>6.0 mm² Cu</option>
                <option value={10.0}>10.0 mm² Cu</option>
              </select>
            </div>
          </div>

          {/* Reference Formulas */}
          <div className="pt-3 border-t border-[#252E38] space-y-1 text-[10px] text-neutral-400">
            <div className="text-cyan-400 font-bold uppercase">{locale === 'fr' ? 'Standards & Formules :' : 'Formulas:'}</div>
            <div>• Tsat ≈ -τ · ln(1 - (Vk/(Is·Rb) - 1)/(X/R))</div>
            <div>• Ktd = 1 + (X/R) · cos(θ)</div>
            <div>• Rb_réel = (2·ρ·L)/S + R_relais</div>
          </div>
        </div>
      </div>
    </div>
  );
};
