// src/components/installations/ProjectPowerFactorCapacitorEngine.tsx
// EPEDE D06/D07 - Reactive Power Compensation & Capacitor Bank Sizing Engine
// Compliant with NF C 15-100 §559, IEC 60831 (LV Shunt Power Capacitors), and EN 61000-2-4 (Harmonic Resonance & Detuning Reactors)

import React, { useState, useMemo } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  Gauge, 
  Zap, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Layers, 
  Cpu, 
  Activity, 
  ArrowRight, 
  Info, 
  Coins, 
  TrendingUp, 
  Radio 
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

export const ProjectPowerFactorCapacitorEngine: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  // -------------------------------------------------------------------------
  // 1. Interactive States & Controls
  // -------------------------------------------------------------------------
  // Target cos phi (typically 0.95 to 0.98; tan phi <= 0.40 to avoid Enedis penalties)
  const [targetCosPhi, setTargetCosPhi] = useState<number>(0.96);

  // Compensation Strategy: 'AUTOMATIC_STEPS' (Gradins automatiques) vs 'FIXED_GLOBAL' (Fixe globale)
  const [compensationStrategy, setCompensationStrategy] = useState<'AUTOMATIC_STEPS' | 'FIXED_GLOBAL'>('AUTOMATIC_STEPS');

  // Detuning Reactor Factor (% of capacitor reactance): 0% (standard), 7% (189Hz / rank 3.8), or 14% (134Hz / rank 2.7)
  const [detuningFactorPercent, setDetuningFactorPercent] = useState<number>(7);

  // Energy Tariff Penalty Factor (€/kvarh during winter peak hours)
  const [penaltyCostPerKvarh, setPenaltyCostPerKvarh] = useState<number>(0.024);

  // High-Tariff Billing Hours per year (approx 1600 hours of winter peak tariff)
  const [billablePeakHoursPerYear, setBillablePeakHoursPerYear] = useState<number>(1600);

  // Baseline power summary
  const powerSummary = computeProjectPowerBalance(project);
  const activePowerKw = powerSummary.demandActivePowerKw;
  const initialCosPhi = powerSummary.averagePowerFactor || 0.85;
  const initialTanPhi = Number((powerSummary.demandReactivePowerKvar / (activePowerKw || 1)).toFixed(3)) || 0.62;

  // -------------------------------------------------------------------------
  // 2. Calculations per NF C 15-100 §559 & IEC 60831
  // -------------------------------------------------------------------------
  const compensationAnalytics = useMemo(() => {
    // 1. Target tan phi: tan(acos(cosPhi))
    const targetAcos = Math.acos(Math.min(1.0, Math.max(0.7, targetCosPhi)));
    const targetTanPhi = Number(Math.tan(targetAcos).toFixed(3));

    // 2. Required Reactive Power Compensation Qc:
    // Qc = P * (tan phi_1 - tan phi_2)
    const requiredQcKvar = Math.max(0, Math.round(activePowerKw * (initialTanPhi - targetTanPhi)));

    // Standard commercial step rounding (rounded up to standard 25, 50, or 75 kvar blocks):
    const commercialQcKvar = Math.ceil(requiredQcKvar / 25) * 25;

    // 3. Harmonic Pollution Ratio (Sh / Sn):
    // Sh = Apparent power of non-linear loads (VFDs, servers, LED, UPS, EV chargers)
    const estimatedNonLinearPowerKva = Math.round(
      powerSummary.criticalityBreakdown.criticalUpsKw * 1.1 + 
      activePowerKw * 0.25
    );
    const transformerRatingKva = project.supplyContext.transformerRatingKva;
    const harmonicPollutionRatioPercent = Math.round((estimatedNonLinearPowerKva / (transformerRatingKva || 1)) * 100);

    // Detuning Reactor Requirement Check (IEC 60831 / Schneider Varplus guidelines):
    // - Sh / Sn <= 15%: Standard capacitors (400V)
    // - 15% < Sh / Sn <= 25%: Reinforced insulation (440V)
    // - Sh / Sn > 25%: Mandatory detuned reactor (Self anti-harmonique 7% / 189Hz or 14% / 134Hz)
    const isDetunedReactorMandatory = harmonicPollutionRatioPercent > 25;
    const isReinforcedRequired = harmonicPollutionRatioPercent > 15;

    // 4. Capacitor Steps Subdivision (for automatic regulation controller):
    let stepComposition = '1 x 25 kvar + 2 x 50 kvar';
    let numberOfSteps = 4;
    if (commercialQcKvar <= 50) {
      stepComposition = '2 x 25 kvar';
      numberOfSteps = 2;
    } else if (commercialQcKvar <= 100) {
      stepComposition = '4 x 25 kvar';
      numberOfSteps = 4;
    } else if (commercialQcKvar <= 150) {
      stepComposition = '1 x 25 kvar + 1 x 50 kvar + 1 x 75 kvar';
      numberOfSteps = 3;
    } else if (commercialQcKvar <= 250) {
      stepComposition = '1 x 25 kvar + 1 x 50 kvar + 2 x 75 kvar';
      numberOfSteps = 4;
    } else {
      const stepCount50 = Math.ceil(commercialQcKvar / 50);
      stepComposition = `${stepCount50} x 50 kvar`;
      numberOfSteps = stepCount50;
    }

    // 5. Transformer No-load Magnetizing Reactive Power (Fixed step compensation):
    // Q0 = I0% * Sn ~= 1.5% to 2.5% * Sn
    const transformerFixedQ0Kvar = Math.max(5, Math.round(transformerRatingKva * 0.02));

    // 6. Financial Savings & Enedis Penalty Avoidance:
    // Utility penalizes billed kvarh when tan phi > 0.40 during peak winter hours
    const billableTanPhiExceedance = Math.max(0, initialTanPhi - 0.40);
    const annualExcessKvarh = Math.round(activePowerKw * billableTanPhiExceedance * billablePeakHoursPerYear);
    const annualPenaltiesAvoidedEuros = Math.round(annualExcessKvarh * penaltyCostPerKvarh);

    // Apparent Power S reduction (relieving transformer capacity):
    // S1 = P / cosPhi_1, S2 = P / cosPhi_2
    const initialApparentPowerKva = Math.round(activePowerKw / (initialCosPhi || 0.8));
    const compensatedApparentPowerKva = Math.round(activePowerKw / targetCosPhi);
    const releasedCapacityKva = Math.max(0, initialApparentPowerKva - compensatedApparentPowerKva);

    // Line current reduction:
    const initialLineCurrentA = Math.round((initialApparentPowerKva * 1000) / (Math.sqrt(3) * 400));
    const compensatedLineCurrentA = Math.round((compensatedApparentPowerKva * 1000) / (Math.sqrt(3) * 400));
    const currentReductionA = Math.max(0, initialLineCurrentA - compensatedLineCurrentA);

    return {
      targetTanPhi,
      requiredQcKvar,
      commercialQcKvar,
      estimatedNonLinearPowerKva,
      harmonicPollutionRatioPercent,
      isDetunedReactorMandatory,
      isReinforcedRequired,
      stepComposition,
      numberOfSteps,
      transformerFixedQ0Kvar,
      annualExcessKvarh,
      annualPenaltiesAvoidedEuros,
      initialApparentPowerKva,
      compensatedApparentPowerKva,
      releasedCapacityKva,
      initialLineCurrentA,
      compensatedLineCurrentA,
      currentReductionA
    };
  }, [
    activePowerKw, 
    initialCosPhi, 
    initialTanPhi, 
    targetCosPhi, 
    powerSummary.criticalityBreakdown.criticalUpsKw, 
    project.supplyContext.transformerRatingKva, 
    billablePeakHoursPerYear, 
    penaltyCostPerKvarh
  ]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Toolbar with Standards                                   */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              {isFr ? 'Compensation d\'Énergie Réactive & Batterie de Condensateurs' : 'Reactive Power Compensation & Capacitor Bank Sizing'}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                NF C 15-100 §559 / IEC 60831
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Optimisation du facteur de puissance (cos φ ≥ 0.95), selfs anti-harmoniques (7% / 189Hz) et suppression des pénalités tan φ Enedis.'
                : 'Power factor correction (cos φ ≥ 0.95), detuned reactors (7% / 189Hz), and utility reactive penalty elimination.'}
            </p>
          </div>
        </div>

        {/* Global Compensation Target Badge */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg border bg-slate-950 text-amber-400 border-amber-500/30 flex items-center gap-2 font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>
              cos φ {initialCosPhi} → {targetCosPhi} (Qc = {compensationAnalytics.commercialQcKvar} kvar)
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Top Summary KPI Cards                                            */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Puissance Réactive Requise' : 'Required Reactive Power'}</span>
          <span className="text-lg font-black text-amber-400">{compensationAnalytics.commercialQcKvar} kvar</span>
          <span className="text-[10px] text-slate-500 block">
            {isFr ? 'Calculé : ' : 'Exact : '}{compensationAnalytics.requiredQcKvar} kvar ({compensationAnalytics.stepComposition})
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Économie Annuelle Pénalités' : 'Avoided Reactive Penalties'}</span>
          <span className="text-lg font-black text-emerald-400">{compensationAnalytics.annualPenaltiesAvoidedEuros} € / an</span>
          <span className="text-[10px] text-slate-500 block">
            {compensationAnalytics.annualExcessKvarh} kvarh {isFr ? 'pénalisables évités' : 'excess avoided'}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Puissance Transfo Libérée' : 'Released Trafo Capacity'}</span>
          <span className="text-lg font-black text-cyan-400">+{compensationAnalytics.releasedCapacityKva} kVA</span>
          <span className="text-[10px] text-slate-500 block">
            {compensationAnalytics.initialApparentPowerKva} kVA → {compensationAnalytics.compensatedApparentPowerKva} kVA (-{compensationAnalytics.currentReductionA} A)
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Taux Pollution Harmonique' : 'Harmonic Ratio (Sh/Sn)'}</span>
          <span className={`text-lg font-black ${compensationAnalytics.isDetunedReactorMandatory ? 'text-rose-400' : 'text-indigo-400'}`}>
            {compensationAnalytics.harmonicPollutionRatioPercent}%
          </span>
          <span className="text-[10px] text-slate-500 block">
            {compensationAnalytics.isDetunedReactorMandatory ? (isFr ? 'Self Anti-Harmonique REQUISE' : 'Detuned Reactor MANDATORY') : 'Standard/Renforcé'}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Parameter Controls (Target cos phi, Strategy, Detuning)          */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          {isFr ? 'Paramètres de Compensation & Régulation Automatique' : 'Power Factor Target & Regulation Settings'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Target cos phi */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">{isFr ? 'Facteur de Puissance Cible :' : 'Target Power Factor:'}</span>
              <strong className="text-amber-400">cos φ = {targetCosPhi}</strong>
            </div>
            <input
              type="range"
              min="0.90"
              max="0.99"
              step="0.01"
              value={targetCosPhi}
              onChange={(e) => setTargetCosPhi(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <span className="text-[10px] text-slate-500 block">
              tan φ cible = {compensationAnalytics.targetTanPhi} (seuil Enedis: ≤ 0.40)
            </span>
          </div>

          {/* Strategy */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? 'Mode de Commutation :' : 'Compensation Mode:'}</span>
            <select
              value={compensationStrategy}
              onChange={(e) => setCompensationStrategy(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-bold text-xs"
            >
              <option value="AUTOMATIC_STEPS">{isFr ? 'Automatique en Gradins (Varlogic)' : 'Automatic Stepped (Varlogic)'}</option>
              <option value="FIXED_GLOBAL">{isFr ? 'Fixe Globale (Marche Continue)' : 'Fixed Global (Continuous)'}</option>
            </select>
            <span className="text-[10px] text-slate-500 block">
              {compensationStrategy === 'AUTOMATIC_STEPS' 
                ? (isFr ? 'Évite la surcompensation à vide' : 'Avoids no-load overcompensation') 
                : (isFr ? 'Pour charge stable permanente' : 'For steady base loads')}
            </span>
          </div>

          {/* Detuning Factor */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? 'Self Anti-Harmonique :' : 'Detuning Reactor:'}</span>
            <div className="flex gap-2">
              {[
                { factor: 0, label: '0% (Sans)' },
                { factor: 7, label: '7% (189Hz)' },
                { factor: 14, label: '14% (134Hz)' }
              ].map(f => (
                <button
                  key={f.factor}
                  onClick={() => setDetuningFactorPercent(f.factor)}
                  className={`flex-1 py-1.5 rounded font-bold transition text-[10px] ${
                    detuningFactorPercent === f.factor ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 block">
              {detuningFactorPercent === 7 ? 'Accordé sous harmonique 5 (250Hz)' : detuningFactorPercent === 14 ? 'Accordé sous harmonique 3 (150Hz)' : 'Condensateur nu'}
            </span>
          </div>

          {/* Transformer No-load Q0 */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? 'Compensation Fixe Transfo :' : 'Trafo Fixed Compensation:'}</span>
            <div className="text-lg font-black text-cyan-400">
              Q0 = {compensationAnalytics.transformerFixedQ0Kvar} kvar
            </div>
            <span className="text-[10px] text-slate-500 block">
              {isFr ? 'Compense l\'aimantation à vide du transfo (2% Sn)' : 'Offsets no-load magnetizing reactive power (2% Sn)'}
            </span>
          </div>
        </div>

        {/* Warning if Harmonic Ratio is High and no detuning reactor is equipped */}
        {compensationAnalytics.isDetunedReactorMandatory && detuningFactorPercent === 0 && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/50 text-xs text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <p>
              {isFr
                ? `ALERTE RÉSONANCE HARMONIQUE (NF C 15-100 §559) : Avec un taux de pollution Sh/Sn de ${compensationAnalytics.harmonicPollutionRatioPercent}% (> 25%), les condensateurs nus risquent d'entrer en résonance parallèle avec l'inductance du transformateur amont, provoquant des surtensions destructrices et l'explosion des condensateurs. L'adjonction d'une self anti-harmonique (7% / 189 Hz) est OBLIGATOIRE.`
                : `HARMONIC RESONANCE ALERT: With Sh/Sn = ${compensationAnalytics.harmonicPollutionRatioPercent}% (> 25%), standard capacitors will resonate with the upstream transformer inductance. A 7% (189 Hz) detuned reactor is MANDATORY to prevent catastrophic capacitor failure.`}
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Visual Vector Triangle (P - Q - S) Comparison                    */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          {isFr ? 'Triangle des Puissances & Soulagement du Réseau' : 'Power Triangle & Network Relieving Vector Diagram'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before Compensation */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400 text-xs">{isFr ? '1. AVANT COMPENSATION' : '1. BEFORE COMPENSATION'}</span>
              <span className="px-2 py-0.5 rounded bg-rose-950/50 text-rose-300 border border-rose-500/30 font-bold">
                cos φ = {initialCosPhi} (tan φ = {initialTanPhi})
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span>{isFr ? 'Puissance active (P) :' : 'Active power (P):'}</span>
                <strong className="text-white">{activePowerKw} kW</strong>
              </div>
              <div className="flex justify-between">
                <span>{isFr ? 'Puissance réactive (Q1) :' : 'Reactive power (Q1):'}</span>
                <strong className="text-rose-400">{Math.round(activePowerKw * initialTanPhi)} kvar</strong>
              </div>
              <div className="flex justify-between">
                <span>{isFr ? 'Puissance apparente (S1) :' : 'Apparent power (S1):'}</span>
                <strong className="text-amber-400">{compensationAnalytics.initialApparentPowerKva} kVA</strong>
              </div>
              <div className="flex justify-between">
                <span>{isFr ? 'Courant en ligne (I1) :' : 'Line current (I1):'}</span>
                <strong className="text-white">{compensationAnalytics.initialLineCurrentA} A</strong>
              </div>
            </div>
          </div>

          {/* After Compensation */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 text-xs">{isFr ? '2. APRÈS COMPENSATION' : '2. AFTER COMPENSATION'}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 font-bold">
                cos φ = {targetCosPhi} (tan φ = {compensationAnalytics.targetTanPhi})
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span>{isFr ? 'Puissance active (P) :' : 'Active power (P):'}</span>
                <strong className="text-white">{activePowerKw} kW</strong>
              </div>
              <div className="flex justify-between">
                <span>{isFr ? 'Puissance réactive résiduelle (Q2) :' : 'Residual reactive (Q2):'}</span>
                <strong className="text-emerald-400">{Math.round(activePowerKw * compensationAnalytics.targetTanPhi)} kvar</strong>
              </div>
              <div className="flex justify-between">
                <span>{isFr ? 'Puissance apparente (S2) :' : 'Compensated apparent (S2):'}</span>
                <strong className="text-cyan-400">{compensationAnalytics.compensatedApparentPowerKva} kVA</strong>
              </div>
              <div className="flex justify-between">
                <span>{isFr ? 'Courant en ligne (I2) :' : 'Compensated current (I2):'}</span>
                <strong className="text-emerald-400">{compensationAnalytics.compensatedLineCurrentA} A (-{compensationAnalytics.currentReductionA} A)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
