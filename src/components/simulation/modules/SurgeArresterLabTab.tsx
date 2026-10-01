// src/components/simulation/modules/SurgeArresterLabTab.tsx
// Section 6: Overvoltage Protection & Surge Arrester (ZnO) Coordination Simulator
// Compliant with IEC 60099-4, IEC 60071-1, IEC 60071-2, IEEE C62.11, and IEEE C62.22

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Layers,
  Sparkles,
  Info,
  Flame,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface SurgeArresterLabTabProps {
  locale: 'fr' | 'en';
}

export type ImpulseWaveType = 'lightning_1_2_50' | 'switching_250_2500' | 'tofs_power_freq' | 'steep_front_0_5';
export type ArresterClassType = 'class_1' | 'class_2' | 'class_3' | 'station_high_energy';

export const SurgeArresterLabTab: React.FC<SurgeArresterLabTabProps> = ({ locale }) => {
  // -------------------------------------------------------------
  // PRIMARY RATINGS & SYSTEM SPECIFICATIONS
  // -------------------------------------------------------------
  const [unKv, setUnKv] = useState<number>(225); // Nominal system voltage (kV RMS)
  const [umKv, setUmKv] = useState<number>(245); // Highest voltage for equipment (kV RMS)
  const [earthFaultFactorK, setEarthFaultFactorK] = useState<number>(1.4); // Earth fault factor k (1.4 effectively earthed, 1.73 isolated/resonance)
  const [equipmentBilKv, setEquipmentBilKv] = useState<number>(1050); // Transformer Lightning Impulse Withstand (BIL, kV peak)
  const [equipmentSilKv, setEquipmentSilKv] = useState<number>(850); // Transformer Switching Impulse Withstand (SIL, kV peak)

  // Surge Arrester (ZnO / Metal-Oxide) Ratings
  const [urKv, setUrKv] = useState<number>(198); // Rated voltage Ur (kV RMS)
  const [ucKv, setUcKv] = useState<number>(158); // Continuous operating voltage Uc (kV RMS, >= Um / sqrt(3))
  const [uplResidualKv, setUplResidualKv] = useState<number>(495); // Lightning impulse residual voltage Upl at In (kV peak)
  const [upsResidualKv, setUpsResidualKv] = useState<number>(415); // Switching impulse residual voltage Ups at 1 kA/2 kA (kV peak)
  const [thermalEnergyKjPerKv, setThermalEnergyKjPerKv] = useState<number>(7.0); // Thermal energy rating Wth (kJ/kV of Ur)

  // Installation Topology & Separation Distance
  const [distanceArresterToTrafoM, setDistanceArresterToTrafoM] = useState<number>(18); // Separation distance d (m)
  const [leadLengthArresterM, setLeadLengthArresterM] = useState<number>(3.5); // Connecting lead length (m)
  const [leadInductanceMicroHPerM, setLeadInductanceMicroHPerM] = useState<number>(1.0); // µH/m lead inductance
  const [waveVelocityMPerMicroSec, setWaveVelocityMPerMicroSec] = useState<number>(300); // Surge propagation velocity in substation bus (m/µs ~ c)

  // Incident Overvoltage Parameters
  const [waveType, setWaveType] = useState<ImpulseWaveType>('lightning_1_2_50');
  const [surgePeakKv, setSurgePeakKv] = useState<number>(1450); // Prospective incoming surge crest (kV)
  const [surgeSteepnessKvPerUs, setSurgeSteepnessKvPerUs] = useState<number>(1000); // S = dU/dt (kV/µs)
  const [surgeDischargeCurrentKa, setSurgeDischargeCurrentKa] = useState<number>(10); // Actual discharge current In (kA)
  const [multiStrokeCount, setMultiStrokeCount] = useState<number>(1); // Number of successive lightning strokes (1, 2, or 3)

  // Pre-configured Test Scenarios
  const [activeScenario, setActiveScenario] = useState<
    'standard_lightning' | 'steep_front_distant' | 'switching_line_drop' | 'tof_earth_fault' | 'close_in_transformer' | 'custom'
  >('standard_lightning');

  // Canvas Refs
  const impulseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const viCurveCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // -------------------------------------------------------------
  // ELECTROTECHNICAL INSULATION COORDINATION COMPUTATIONS (IEC 60071 / 60099)
  // -------------------------------------------------------------
  // 1. Inductive Voltage Drop in connecting leads: ΔU_lead = L_lead * (di/dt)
  // For 10 kA lightning wave 8/20µs, mean front rate di/dt ≈ 10 kA / 8 µs = 1.25 kA/µs
  const diDtKaPerMicroSec = waveType === 'steep_front_0_5' ? 4.0 : waveType === 'lightning_1_2_50' ? 1.25 : 0.15;
  const leadTotalInductanceMicroH = leadLengthArresterM * leadInductanceMicroHPerM;
  const deltaULeadKv = leadTotalInductanceMicroH * diDtKaPerMicroSec; // kV

  // 2. Voltage reflected at transformer terminals due to separation distance:
  // Traveling wave reflection formula: U_trafo = U_arrester + 2 * (S / v) * d
  // where S = surge steepness (kV/µs), v = wave speed (m/µs), d = separation distance (m)
  const deltaUDistanceKv = 2 * (surgeSteepnessKvPerUs / waveVelocityMPerMicroSec) * distanceArresterToTrafoM;

  // 3. Peak Voltage reaching the Transformer Insulation:
  // Utrafo_peak = Upl + ΔU_lead + ΔU_distance (for lightning)
  // or Ups + ΔU_lead for switching
  const isLightningType = waveType === 'lightning_1_2_50' || waveType === 'steep_front_0_5';
  const baseResidualKv = isLightningType ? uplResidualKv : upsResidualKv;
  const totalArresterTerminalPeakKv = baseResidualKv + deltaULeadKv;
  const totalTrafoInsulationStressKv = isLightningType
    ? baseResidualKv + deltaULeadKv + deltaUDistanceKv
    : baseResidualKv + deltaULeadKv; // Switching surges have low steepness, distance reflection negligible

  // 4. Protective Margins (IEC 60071-1 / IEEE C62.22):
  // Lightning Protective Margin MP1 = ((BIL / Utrafo_peak) - 1) * 100% (Required >= 20% by IEC / IEEE)
  const mp1LightningPct = ((equipmentBilKv / Math.max(1, totalTrafoInsulationStressKv)) - 1) * 100;

  // Switching Protective Margin MP2 = ((SIL / Ups) - 1) * 100% (Required >= 15%)
  const mp2SwitchingPct = ((equipmentSilKv / Math.max(1, upsResidualKv + deltaULeadKv)) - 1) * 100;

  // 5. Energy absorbed by Arrester (kJ)
  // Single-event energy: W = Integral(U * I * dt) ≈ 1.4 * Ur * In * T_duration
  const waveDurationMicroSec = waveType === 'switching_250_2500' ? 2000 : waveType === 'tofs_power_freq' ? 20000 : 35;
  const energyPerStrokeKj = Math.round(
    1.35 * (uplResidualKv * 0.72) * surgeDischargeCurrentKa * (waveDurationMicroSec / 1000)
  );
  const totalAbsorbedEnergyKj = energyPerStrokeKj * multiStrokeCount;
  const thermalEnergyLimitKj = thermalEnergyKjPerKv * urKv;
  const energyStressRatioPct = Math.round((totalAbsorbedEnergyKj / Math.max(1, thermalEnergyLimitKj)) * 100);

  // 6. Temporary Overvoltage (TOV) capability check
  // TOV under line-to-earth fault: U_tov = k * (Um / sqrt(3))
  const uTovSystemKv = earthFaultFactorK * (umKv / Math.sqrt(3));
  const tovWithstandRatio = (urKv * 1.15) / Math.max(1, uTovSystemKv); // Arrester typically withstands 1.15 * Ur for 1 sec
  const isTovSafe = tovWithstandRatio >= 1.0;

  // Safety Status Verdict
  const isInsulationProtected = isLightningType ? mp1LightningPct >= 20 : mp2SwitchingPct >= 15;
  const isEnergySafe = energyStressRatioPct <= 100;

  let overallVerdict: {
    status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
    titleFr: string;
    titleEn: string;
    descFr: string;
    descEn: string;
  };

  if (isInsulationProtected && isEnergySafe && isTovSafe) {
    overallVerdict = {
      status: 'OPTIMAL',
      titleFr: 'Coordination d’Isolement Parfaite & Conforme CEI 60071',
      titleEn: 'Optimal Insulation Coordination & Compliant (IEC 60071)',
      descFr: `Marge de protection foudre MP1 = ${mp1LightningPct.toFixed(1)}% (≥ 20% requis) avec une contrainte au transformateur de ${totalTrafoInsulationStressKv.toFixed(0)} kV sous BIL = ${equipmentBilKv} kV. L'énergie absorbée (${totalAbsorbedEnergyKj} kJ, soit ${energyStressRatioPct}% de la capacité thermique) garantit l'intégrité totale des blocs ZnO sans risque d'emballement thermique.`,
      descEn: `Lightning protective margin MP1 = ${mp1LightningPct.toFixed(1)}% (≥ 20% standard) with peak transformer stress of ${totalTrafoInsulationStressKv.toFixed(0)} kV under BIL = ${equipmentBilKv} kV. Absorbed energy (${totalAbsorbedEnergyKj} kJ, ${energyStressRatioPct}% of thermal capability) prevents thermal runaway of ZnO varistor blocks.`,
    };
  } else if (!isInsulationProtected && isEnergySafe) {
    overallVerdict = {
      status: 'CRITICAL',
      titleFr: 'Rupture Diélectrique Transformateur — Marge MP1 Insuffisante !',
      titleEn: 'Transformer Dielectric Breakdown — MP1 Margin Insufficient!',
      descFr: `La surtension crête au transformateur (${totalTrafoInsulationStressKv.toFixed(0)} kV) outrepasse la tenue admissible. La marge foudre n'est que de ${mp1LightningPct.toFixed(1)}% (< 20% requis par la CEI 60071-1). Cause : Distance parasurtenseur-transformateur excessive (${distanceArresterToTrafoM} m) provoquant une surtension de réflexion d'onde de +${deltaUDistanceKv.toFixed(0)} kV.`,
      descEn: `Peak transformer voltage (${totalTrafoInsulationStressKv.toFixed(0)} kV) violates safe margin (MP1 = ${mp1LightningPct.toFixed(1)}% < 20% standard). Cause: Excessive distance (${distanceArresterToTrafoM} m) generating a traveling-wave reflection spike of +${deltaUDistanceKv.toFixed(0)} kV.`,
    };
  } else if (!isEnergySafe) {
    overallVerdict = {
      status: 'CRITICAL',
      titleFr: 'Emballement Thermique du Parafoudre ZnO — Explosion Varistance !',
      titleEn: 'ZnO Arrester Thermal Runaway — Varistor Energy Overload!',
      descFr: `L'énergie accumulée (${totalAbsorbedEnergyKj} kJ) outrepasse la tenue thermique nominale du parafoudre (${thermalEnergyLimitKj.toFixed(0)} kJ, contrainte à ${energyStressRatioPct}%). Risque imminent de flashover interne et destruction de l'enveloppe composite. Augmenter la classe de décharge de ligne (Classe 3 ou 4) ou le Ur.`,
      descEn: `Cumulative absorbed energy (${totalAbsorbedEnergyKj} kJ) exceeds rated thermal energy (${thermalEnergyLimitKj.toFixed(0)} kJ, ${energyStressRatioPct}% load). Imminent varistor thermal puncture and porcelain/silicone housing destruction. Increase arrester discharge class.`,
    };
  } else {
    overallVerdict = {
      status: 'WARNING',
      titleFr: 'Marge Étroite ou Tenue TOV Limite (CEI 60099-4)',
      titleEn: 'Narrow Protective Margin or Borderline TOV (IEC 60099-4)',
      descFr: `Fonctionnement admissible mais proche des limites de tolérance. Vérifier la tension d'extinction TOV lors de défauts à la terre prolongés (facteur k = ${earthFaultFactorK}).`,
      descEn: `Operation borderline permissible. Verify Temporary Overvoltage (TOV) withstand capability during persistent phase-to-earth faults (k factor = ${earthFaultFactorK}).`,
    };
  }

  // Handle Preset Scenarios
  const handleApplyScenario = (scen: typeof activeScenario) => {
    setActiveScenario(scen);
    if (scen === 'standard_lightning') {
      setWaveType('lightning_1_2_50');
      setSurgePeakKv(1450);
      setSurgeSteepnessKvPerUs(1000);
      setSurgeDischargeCurrentKa(10);
      setDistanceArresterToTrafoM(12);
      setLeadLengthArresterM(2.5);
      setMultiStrokeCount(1);
    } else if (scen === 'steep_front_distant') {
      // Very steep front with long distance: will trigger distance reflection failure!
      setWaveType('steep_front_0_5');
      setSurgePeakKv(1800);
      setSurgeSteepnessKvPerUs(1800);
      setSurgeDischargeCurrentKa(20);
      setDistanceArresterToTrafoM(35); // Long busbar connection
      setLeadLengthArresterM(5.0);
      setMultiStrokeCount(1);
    } else if (scen === 'switching_line_drop') {
      setWaveType('switching_250_2500');
      setSurgePeakKv(750);
      setSurgeSteepnessKvPerUs(150);
      setSurgeDischargeCurrentKa(2);
      setDistanceArresterToTrafoM(15);
      setLeadLengthArresterM(2.0);
      setMultiStrokeCount(2);
    } else if (scen === 'tof_earth_fault') {
      setWaveType('tofs_power_freq');
      setSurgePeakKv(380);
      setSurgeSteepnessKvPerUs(50);
      setSurgeDischargeCurrentKa(1.5);
      setEarthFaultFactorK(1.73); // Isolated network, very high TOV!
      setDistanceArresterToTrafoM(10);
      setLeadLengthArresterM(2.0);
      setMultiStrokeCount(1);
    } else if (scen === 'close_in_transformer') {
      // Optimal installation directly on transformer bushings
      setWaveType('lightning_1_2_50');
      setSurgePeakKv(1450);
      setSurgeSteepnessKvPerUs(1000);
      setSurgeDischargeCurrentKa(10);
      setDistanceArresterToTrafoM(3); // Mounted directly on tank
      setLeadLengthArresterM(1.0);
      setMultiStrokeCount(1);
    }
  };

  // -------------------------------------------------------------
  // CANVAS 1: IMPULSE WAVEFORM (INCIDENT vs CLAMPED vs TRANSFORMER STRESS)
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = impulseCanvasRef.current;
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
    const padTop = 36;
    const padBottom = 32;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;
    const originX = padLeft;
    const originY = padTop + plotH;

    // Time window depending on wave type:
    // Lightning: 0 to 60 µs
    // Switching: 0 to 3000 µs
    const tMaxUs = waveType === 'switching_250_2500' ? 2500 : waveType === 'tofs_power_freq' ? 20000 : 50;
    const vMaxPlot = Math.max(equipmentBilKv * 1.25, surgePeakKv * 1.1, totalTrafoInsulationStressKv * 1.2);

    const toX = (t: number) => originX + (t / tMaxUs) * plotW;
    const toY = (v: number) => originY - (v / vMaxPlot) * plotH;

    // Draw Grid & Axes
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#252E38';
    ctx.fillStyle = '#64748B';
    ctx.font = '9px ui-monospace, monospace';

    for (let frac = 0; frac <= 1.0; frac += 0.2) {
      const t = frac * tMaxUs;
      const x = toX(t);
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, originY);
      ctx.stroke();
      ctx.fillText(`${t.toFixed(0)}${waveType === 'tofs_power_freq' ? 'µs' : 'µs'}`, x - 12, originY + 16);
    }

    // Horizontal Voltage Grid
    for (let v = 0; v <= vMaxPlot; v += 400) {
      const y = toY(v);
      ctx.beginPath();
      ctx.moveTo(originX, y);
      ctx.lineTo(originX + plotW, y);
      ctx.stroke();
      ctx.fillText(`${v} kV`, originX - 44, y + 3);
    }

    // Draw Transformer BIL Line (Dashed Red)
    const yBil = toY(equipmentBilKv);
    ctx.strokeStyle = '#EF4444';
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(originX, yBil);
    ctx.lineTo(originX + plotW, yBil);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.fillText(`TRANSFORMER BIL = ${equipmentBilKv} kV`, originX + plotW - 190, yBil - 5);

    // Number of time steps
    const steps = 300;
    const dt = tMaxUs / steps;

    // 1. Draw Incident Prospective Wave (Cyan Dashed)
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.setLineDash([3, 3]);

    const tFront = waveType === 'switching_250_2500' ? 250 : waveType === 'steep_front_0_5' ? 0.5 : 1.2;
    const tTail = waveType === 'switching_250_2500' ? 2500 : waveType === 'steep_front_0_5' ? 20 : 50;

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      // Standard double-exponential impulse equation: V(t) = V0 * (exp(-t/t2) - exp(-t/t1))
      const alpha = 1 / (tTail * 1.2);
      const beta = 1 / (tFront * 0.35);
      const waveNorm = Math.max(0, Math.exp(-alpha * t) - Math.exp(-beta * t));
      const v = surgePeakKv * (waveNorm * 1.05);

      const x = toX(t);
      const y = toY(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Draw Clamped Voltage at Surge Arrester Terminals (Emerald / Clamped)
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#10B981';

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      const alpha = 1 / (tTail * 1.2);
      const beta = 1 / (tFront * 0.35);
      const waveNorm = Math.max(0, Math.exp(-alpha * t) - Math.exp(-beta * t));
      const vIncident = surgePeakKv * (waveNorm * 1.05);

      // ZnO non-linear characteristic clamps at totalArresterTerminalPeakKv
      const vClamped = Math.min(vIncident, totalArresterTerminalPeakKv);

      const x = toX(t);
      const y = toY(vClamped);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 3. Draw Voltage Wave at Protected Transformer Terminals (Amber/Rose with Reflection Spike)
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = isInsulationProtected ? '#F59E0B' : '#F43F5E';

    // Delay time for surge travel from Arrester to Transformer: t_travel = d / v
    const tTravelUs = distanceArresterToTrafoM / waveVelocityMPerMicroSec;

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      let vTrafo = 0;

      if (t >= tTravelUs) {
        const tEff = t - tTravelUs;
        const alpha = 1 / (tTail * 1.2);
        const beta = 1 / (tFront * 0.35);
        const waveNorm = Math.max(0, Math.exp(-alpha * tEff) - Math.exp(-beta * tEff));
        const vIncident = surgePeakKv * (waveNorm * 1.05);

        // Clamped at arrester plus traveling wave reflection spike
        if (vIncident < baseResidualKv) {
          vTrafo = vIncident;
        } else {
          // Add reflection peak during the wave front
          const frontFactor = Math.min(1.0, tEff / (tFront + 0.1));
          const spikeComponent = deltaUDistanceKv * Math.exp(-tEff / (tFront * 2.5));
          vTrafo = Math.min(vIncident, totalArresterTerminalPeakKv + spikeComponent);
        }
      }

      const x = toX(t);
      const y = toY(vTrafo);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Legend
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.fillText(locale === 'fr' ? 'Onde Incidente Non Écrêtée' : 'Prospective Incoming Surge', originX + 8, padTop - 14);

    ctx.fillStyle = '#10B981';
    ctx.fillText(
      locale === 'fr' ? `Écrêtage Parafoudre (${totalArresterTerminalPeakKv.toFixed(0)} kV)` : `Arrester Terminals (${totalArresterTerminalPeakKv.toFixed(0)} kV)`,
      originX + 220,
      padTop - 14
    );

    ctx.fillStyle = isInsulationProtected ? '#F59E0B' : '#F43F5E';
    ctx.fillText(
      locale === 'fr'
        ? `Contrainte Transformateur (${totalTrafoInsulationStressKv.toFixed(0)} kV)`
        : `Transformer Terminal Stress (${totalTrafoInsulationStressKv.toFixed(0)} kV)`,
      originX + 440,
      padTop - 14
    );
  }, [
    waveType,
    surgePeakKv,
    equipmentBilKv,
    totalArresterTerminalPeakKv,
    totalTrafoInsulationStressKv,
    distanceArresterToTrafoM,
    waveVelocityMPerMicroSec,
    baseResidualKv,
    deltaUDistanceKv,
    isInsulationProtected,
    locale
  ]);

  // -------------------------------------------------------------
  // CANVAS 2: ZnO VARISTOR V-I LOGARITHMIC CHARACTERISTIC
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = viCurveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.parentElement?.clientWidth || 320);
    const h = (canvas.height = 230);

    ctx.fillStyle = '#080B10';
    ctx.fillRect(0, 0, w, h);

    const padLeft = 40;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 30;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;
    const originX = padLeft;
    const originY = padTop + plotH;

    // Draw Log axes (Current from 10^-4 A to 10^5 A)
    ctx.strokeStyle = '#252E38';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(originX, padTop);
    ctx.lineTo(originX, originY);
    ctx.lineTo(originX + plotW, originY);
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.font = '8px ui-monospace, monospace';
    ctx.fillText('Log I (A)', originX + plotW - 40, originY + 16);
    ctx.fillText('U (kV)', originX - 35, padTop + 8);

    // X-axis log decades: 0.1mA, 1mA, 1A, 1kA, 10kA, 100kA
    const currentTicks = ['1mA', '1A', '1kA', '10kA', '100kA'];
    currentTicks.forEach((txt, idx) => {
      const frac = (idx + 1) / (currentTicks.length + 1);
      const x = originX + frac * plotW;
      ctx.fillText(txt, x - 10, originY + 12);
    });

    // Draw ZnO V-I characteristic with 3 distinct zones:
    // Zone 1: Pre-breakdown (leakage current < 1mA)
    // Zone 2: Highly non-linear varistor region (α = 30 to 50)
    // Zone 3: High-current upturn (grain boundary resistance dominance)
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#38BDF8';

    const points = 100;
    for (let i = 0; i <= points; i++) {
      const frac = i / points;
      let uNorm = 0;
      if (frac < 0.35) {
        // Pre-breakdown
        uNorm = (frac / 0.35) * 0.58;
      } else if (frac < 0.75) {
        // Varistor plateau (flat voltage across 4 orders of magnitude)
        const subFrac = (frac - 0.35) / 0.40;
        uNorm = 0.58 + subFrac * 0.16;
      } else {
        // High-current upturn
        const subFrac = (frac - 0.75) / 0.25;
        uNorm = 0.74 + Math.pow(subFrac, 1.6) * 0.24;
      }

      const x = originX + frac * plotW;
      const y = originY - uNorm * plotH;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Operating point at nominal discharge current (e.g. 10 kA)
    const opFrac = 0.75 + (surgeDischargeCurrentKa / 40) * 0.15;
    const opX = originX + Math.min(plotW * 0.95, opFrac * plotW);
    const opY = originY - (uplResidualKv / (equipmentBilKv * 0.9)) * plotH * 0.78;

    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(opX, opY, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 9px ui-monospace, monospace';
    ctx.fillText(`Upl = ${uplResidualKv} kV @ ${surgeDischargeCurrentKa}kA`, opX - 80, opY - 8);
  }, [uplResidualKv, surgeDischargeCurrentKa, equipmentBilKv]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-5 rounded-2xl bg-[#0D1117] border border-[#252E38] shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <ShieldAlert className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white tracking-wide uppercase font-mono">
                {locale === 'fr'
                  ? 'BANC DE SIMULATION : SURTENSIONS & COORDINATION PARAFOUDRES ZnO'
                  : 'SIMULATION LAB: OVERVOLTAGE PROTECTION & ZnO ARRESTER COORDINATION'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-900/40 text-amber-300 border border-amber-700 font-mono">
                CEI 60099-4 / CEI 60071 / IEEE C62.11
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 font-sans">
              {locale === 'fr'
                ? 'Propagation d’ondes de foudre (1.2/50 µs) et manœuvre (250/2500 µs), chute inductive filerie, réflexion d’onde par éloignement d et marges MP1 / MP2.'
                : 'Traveling wave propagation (1.2/50 µs lightning & 250/2500 µs switching), lead inductance drop, distance reflection spike d, and MP1 / MP2 margins.'}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-neutral-400">{locale === 'fr' ? 'MARGE DE SÉCURITÉ MP1 :' : 'PROTECTIVE MARGIN MP1:'}</span>
          <div
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border ${
              isInsulationProtected
                ? mp1LightningPct >= 30
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-red-500/20 text-red-300 border-red-500/50'
            }`}
          >
            {isInsulationProtected ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <span>{`${mp1LightningPct.toFixed(1)}% (${mp1LightningPct >= 20 ? 'Conforme ≥ 20%' : 'Non Conforme'})`}</span>
          </div>
        </div>
      </div>

      {/* Insulation Coordination Verdict Banner */}
      <div
        className={`p-4 rounded-xl border flex items-start gap-3.5 font-mono text-xs ${
          overallVerdict.status === 'OPTIMAL'
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            : overallVerdict.status === 'WARNING'
            ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
            : 'bg-red-950/30 border-red-500/50 text-red-300'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {overallVerdict.status === 'OPTIMAL' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : overallVerdict.status === 'WARNING' ? (
            <ShieldAlert className="h-5 w-5 text-amber-400" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-400" />
          )}
        </div>
        <div className="space-y-1">
          <div className="font-black text-sm">
            {locale === 'fr' ? overallVerdict.titleFr : overallVerdict.titleEn}
          </div>
          <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
            {locale === 'fr' ? overallVerdict.descFr : overallVerdict.descEn}
          </p>
        </div>
      </div>

      {/* Preset Substation Scenarios */}
      <div className="p-4 rounded-2xl bg-[#0D1117] border border-[#252E38] space-y-2.5">
        <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold">
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            {locale === 'fr' ? 'Scénarios Préréglés de Surtension en Poste :' : 'Substation Operating Scenarios:'}
          </span>
          <span className="text-[10px] text-neutral-500">Poste 225 kV Nachtigal / Oyomabang</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleApplyScenario('standard_lightning')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeScenario === 'standard_lightning'
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200 shadow-md'
                : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-[11px]">1. {locale === 'fr' ? 'Choc Foudre Standard' : 'Standard Lightning'}</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">1.2/50 µs · 10 kA · d=12m · MP1 &ge; 25%</div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyScenario('steep_front_distant')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeScenario === 'steep_front_distant'
                ? 'border-red-500 bg-red-500/20 text-red-200 shadow-md'
                : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-[11px]">2. {locale === 'fr' ? 'Front Raide Éloigné' : 'Steep Front Distant'}</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">1800 kV/µs · d=35m · Réflexion critique!</div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyScenario('switching_line_drop')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeScenario === 'switching_line_drop'
                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200 shadow-md'
                : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-[11px]">3. {locale === 'fr' ? 'Onde de Manœuvre' : 'Switching Surge'}</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">250/2500 µs · Énergie élevée · MP2</div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyScenario('close_in_transformer')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeScenario === 'close_in_transformer'
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200 shadow-md'
                : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-[11px]">4. {locale === 'fr' ? 'Montage Sur Cuve (d=3m)' : 'Close-coupled (d=3m)'}</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">Liaison ultra-courte · Marge maximale</div>
          </button>

          <button
            type="button"
            onClick={() => handleApplyScenario('tof_earth_fault')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              activeScenario === 'tof_earth_fault'
                ? 'border-amber-500 bg-amber-500/20 text-amber-200 shadow-md'
                : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="font-bold text-[11px]">5. {locale === 'fr' ? 'Surtension TOV (k=1.73)' : 'TOV Ground Fault'}</div>
            <div className="text-[9px] text-neutral-400 mt-0.5">Neutre isolé · Contrainte 50 Hz</div>
          </button>
        </div>
      </div>

      {/* Main Grid: Transient Impulse Canvas & V-I Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Waveform Analysis & Insulation Stresses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Impulse Waveform Canvas Card */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono">
              <span className="flex items-center gap-2 font-bold text-white uppercase">
                <Activity className="h-4 w-4 text-amber-400" />
                {locale === 'fr' ? 'ONDE TRANSITOIRE DE SURTENSION : PARAFOUDRE vs TRANSFORMATEUR' : 'TRANSIENT SURGE PROPAGATION: ARRESTER vs TRANSFORMER'}
              </span>
              <span className="text-neutral-400">
                S = {surgeSteepnessKvPerUs} kV/µs · d = {distanceArresterToTrafoM} m (ΔU_dist = +{deltaUDistanceKv.toFixed(0)} kV)
              </span>
            </div>

            <div className="w-full overflow-hidden rounded-xl border border-[#252E38] bg-[#080B10]">
              <canvas ref={impulseCanvasRef} className="w-full block" />
            </div>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'TENSION CRÊTE TRAFO' : 'PEAK TRAFO STRESS'}</div>
                <div className={`text-base font-black mt-0.5 ${isInsulationProtected ? 'text-emerald-300' : 'text-red-400'}`}>
                  {totalTrafoInsulationStressKv.toFixed(0)} kV
                </div>
                <div className="text-[9px] text-neutral-500">BIL Max: {equipmentBilKv} kV</div>
              </div>

              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'MARGE FOUDRE MP1' : 'MARGIN MP1'}</div>
                <div className={`text-base font-black mt-0.5 ${mp1LightningPct >= 20 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {mp1LightningPct.toFixed(1)}%
                </div>
                <div className="text-[9px] text-neutral-500">Norme: &ge; 20.0%</div>
              </div>

              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'SURTENSION RÉFLEXION' : 'DISTANCE REFLECTION'}</div>
                <div className={`text-base font-black mt-0.5 ${deltaUDistanceKv > 150 ? 'text-amber-400' : 'text-cyan-300'}`}>
                  +{deltaUDistanceKv.toFixed(0)} kV
                </div>
                <div className="text-[9px] text-neutral-500">2·(S/v)·d (v = 300 m/µs)</div>
              </div>

              <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38]">
                <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'ÉNERGIE ABSORBÉE' : 'ENERGY ABSORBED'}</div>
                <div className={`text-base font-black mt-0.5 ${isEnergySafe ? 'text-cyan-300' : 'text-red-400'}`}>
                  {totalAbsorbedEnergyKj} kJ
                </div>
                <div className="text-[9px] text-neutral-500">{energyStressRatioPct}% de Wth ({thermalEnergyLimitKj.toFixed(0)} kJ)</div>
              </div>
            </div>
          </div>

          {/* V-I Characteristic & Electrotechnical Equations */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#252E38] pb-3 text-xs font-mono">
              <span className="flex items-center gap-2 font-bold text-white uppercase">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                {locale === 'fr' ? 'CARACTÉRISTIQUE LOGARITHMIQUE V-I DES VARISTANCES ZnO (CEI 60099-4)' : 'ZnO VARISTOR LOGARITHMIC V-I CHARACTERISTIC'}
              </span>
              <span className="text-amber-400">Ur = {urKv} kV · In = {surgeDischargeCurrentKa} kA</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#252E38] bg-[#080B10] p-2 flex items-center justify-center">
                <canvas ref={viCurveCanvasRef} className="w-full block" />
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Info className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'Principes de la CEI 60071 / 60099 :' : 'IEC 60071 / 60099 Core Laws:'}</span>
                </div>
                <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                  {locale === 'fr'
                    ? "Les varistances à oxyde de zinc (ZnO) présentent une non-linéarité extrême (I = k·U^α avec α > 35). Cependant, la protection d'un transformateur de puissance dépend de son éloignement d : à chaque mètre d'écart, l'onde incidente non écrêtée se réfléchit à front d'onde ouvert, ajoutant ΔU = 2·(S/v)·d à la tension résiduelle."
                    : "Zinc Oxide (ZnO) varistors offer extreme non-linearity (α > 35). However, transformer protection heavily depends on physical distance d: traveling waves reflect at the high impedance transformer bushing, boosting stress by ΔU = 2·(S/v)·d."}
                </p>
                <div className="p-3 rounded-xl bg-[#161C24] border border-[#252E38] space-y-1 text-[11px]">
                  <div className="text-neutral-400 font-bold">{locale === 'fr' ? 'Règles de bonne pratique en poste HTB :' : 'HV Substation Best Practices:'}</div>
                  <div className="text-emerald-300">
                    • {locale === 'fr' ? 'Distance d < 15 m pour les postes 225 kV aériens' : 'Distance d < 15 m for 225 kV air-insulated bays'}
                  </div>
                  <div className="text-cyan-300">
                    • {locale === 'fr' ? 'Longueur de liaison filerie < 3 m pour limiter ΔU_lead' : 'Connecting lead length < 3 m to minimize L·di/dt'}
                  </div>
                  <div className="text-amber-300">
                    • {locale === 'fr' ? 'Uc ≥ 1.05 × Um / √3 pour éviter le vieillissement thermique' : 'Continuous Uc ≥ 1.05 × Um / √3 to prevent degradation'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Dynamic Sliders & Physical Dimensions */}
        <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-2xl space-y-5 font-mono text-xs">
          <div className="border-b border-[#252E38] pb-3 flex items-center justify-between">
            <span className="font-bold text-white uppercase flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-amber-400" />
              {locale === 'fr' ? 'PARAMÈTRES PHYSIQUES' : 'PHYSICAL PARAMETERS'}
            </span>
            <button
              type="button"
              onClick={() => handleApplyScenario('standard_lightning')}
              className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              {locale === 'fr' ? 'Réinit' : 'Reset'}
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Distance to Transformer */}
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Distance Parafoudre-Transfo d (m) :' : 'Separation Distance d (m):'}</span>
                <span className={`font-bold ${distanceArresterToTrafoM > 25 ? 'text-red-400' : 'text-amber-300'}`}>{distanceArresterToTrafoM} m</span>
              </label>
              <input
                type="range"
                min={2}
                max={50}
                step={1}
                value={distanceArresterToTrafoM}
                onChange={(e) => {
                  setDistanceArresterToTrafoM(parseInt(e.target.value, 10));
                  setActiveScenario('custom');
                }}
                className="w-full accent-amber-400"
              />
              <div className="text-[9px] text-neutral-500">
                {locale === 'fr' ? 'Rebond d’onde :' : 'Wave reflection:'} +{deltaUDistanceKv.toFixed(0)} kV
              </div>
            </div>

            {/* Connecting Lead Length */}
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Longueur Filerie Raccordement (m) :' : 'Connecting Lead Length (m):'}</span>
                <span className="text-cyan-400 font-bold">{leadLengthArresterM} m</span>
              </label>
              <input
                type="range"
                min={0.5}
                max={8.0}
                step={0.5}
                value={leadLengthArresterM}
                onChange={(e) => {
                  setLeadLengthArresterM(parseFloat(e.target.value));
                  setActiveScenario('custom');
                }}
                className="w-full accent-cyan-400"
              />
              <div className="text-[9px] text-neutral-500">
                L·di/dt = +{deltaULeadKv.toFixed(0)} kV ({leadTotalInductanceMicroH.toFixed(1)} µH)
              </div>
            </div>

            {/* Surge Steepness S */}
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Raideur d’Onde S (kV/µs) :' : 'Surge Steepness S (kV/µs):'}</span>
                <span className="text-red-400 font-bold">{surgeSteepnessKvPerUs} kV/µs</span>
              </label>
              <input
                type="range"
                min={200}
                max={2000}
                step={50}
                value={surgeSteepnessKvPerUs}
                onChange={(e) => {
                  setSurgeSteepnessKvPerUs(parseInt(e.target.value, 10));
                  setActiveScenario('custom');
                }}
                className="w-full accent-red-400"
              />
            </div>

            {/* Equipment BIL */}
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Niveau d’Isolement BIL (kV) :' : 'Transformer BIL (kV):'}</span>
                <span className="text-emerald-400 font-bold">{equipmentBilKv} kV</span>
              </label>
              <select
                value={equipmentBilKv}
                onChange={(e) => {
                  setEquipmentBilKv(parseInt(e.target.value, 10));
                  setActiveScenario('custom');
                }}
                className="w-full bg-[#161C24] border border-[#252E38] rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-amber-400 focus:outline-none"
              >
                <option value={850}>850 kV (Standard 225 kV Réduit)</option>
                <option value={950}>950 kV (Standard 225 kV Normalisé)</option>
                <option value={1050}>1050 kV (Standard 225 kV Renforcé / Oyomabang)</option>
                <option value={450}>450 kV (Poste 90 kV Mangombé)</option>
                <option value={170}>170 kV (Réseau HTA 30 kV)</option>
              </select>
            </div>

            {/* Multi-stroke lightning discharges */}
            <div className="space-y-1">
              <label className="text-neutral-300 flex justify-between">
                <span>{locale === 'fr' ? 'Coups de Foudre Répétés :' : 'Lightning Multi-Strokes:'}</span>
                <span className="text-rose-400 font-bold">{multiStrokeCount} × Chocs</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[1, 2, 3].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => {
                      setMultiStrokeCount(cnt);
                      setActiveScenario('custom');
                    }}
                    className={`py-1.5 rounded-lg border text-center font-bold ${
                      multiStrokeCount === cnt
                        ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                        : 'border-[#252E38] bg-[#161C24] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cnt} {locale === 'fr' ? 'coup' : 'stroke'}
                  </button>
                ))}
              </div>
              <div className="text-[9px] text-neutral-500">
                {locale === 'fr' ? 'Contrainte thermique cumulée' : 'Cumulative thermal energy'}
              </div>
            </div>
          </div>

          {/* Formulas reference footer */}
          <div className="pt-3 border-t border-[#252E38] space-y-1 text-[10px] text-neutral-400">
            <div className="text-amber-400 font-bold uppercase">{locale === 'fr' ? 'Formules Clés CEI 60071 :' : 'IEC 60071 Formulas:'}</div>
            <div>• Utrafo = Upl + L·(di/dt) + 2·(S/v)·d</div>
            <div>• MP1 = ((BIL / Utrafo) - 1) × 100% &ge; 20%</div>
            <div>• W_th = W_spécifique × Ur &ge; Σ(W_chocs)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
