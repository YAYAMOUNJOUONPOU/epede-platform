// src/components/installations/ProjectIrveEvChargingEngine.tsx
// EPEDE D06/D07 - EV Charging Infrastructure (IRVE) & Dynamic Load Management Engine
// Compliant with IEC 61851-1, IEC 60364-7-722, NF C 15-100 Part 7-722, and IEC 62955 (RDC-DD)

import React, { useState, useMemo } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  Car, 
  Zap, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  TrendingDown, 
  Layers, 
  Info,
  ArrowRight,
  ShieldCheck,
  Gauge
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

export const ProjectIrveEvChargingEngine: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  // -------------------------------------------------------------------------
  // 1. IRVE Fleet Configuration
  // -------------------------------------------------------------------------
  // 7.4 kW AC Single-Phase (32A 230V)
  const [qty7kW, setQty7kW] = useState<number>(4);
  // 22 kW AC Three-Phase (32A 400V)
  const [qty22kW, setQty22kW] = useState<number>(6);
  // 50 kW DC Fast Charging (CCS Combo 2)
  const [qty50kW, setQty50kW] = useState<number>(1);

  // Dynamic Load Management (DLM) Smart Charging active toggle
  const [dlmEnabled, setDlmEnabled] = useState<boolean>(true);

  // Building baseline power demand & transformer rating
  const powerSummary = computeProjectPowerBalance(project);
  const buildingPeakKw = powerSummary.demandActivePowerKw;
  const transformerRatingKva = project.supplyContext.transformerRatingKva;
  const transformerMaxKw = Math.round(transformerRatingKva * 0.95);

  // -------------------------------------------------------------------------
  // 2. NF C 15-100 §7-722 Simultaneity & Power Calculations
  // -------------------------------------------------------------------------
  const irveSizing = useMemo(() => {
    const totalPoints = qty7kW + qty22kW + qty50kW;

    // Total raw unconstrained installed power (kW)
    const rawInstalledPowerKw = (qty7kW * 7.4) + (qty22kW * 22) + (qty50kW * 50);

    // NF C 15-100 §7-722 Simultaneity Factor (ks) Table without DLM:
    let standardKs = 1.0;
    if (totalPoints === 0) standardKs = 1.0;
    else if (totalPoints === 1) standardKs = 1.0;
    else if (totalPoints >= 2 && totalPoints <= 4) standardKs = 0.8;
    else if (totalPoints >= 5 && totalPoints <= 9) standardKs = 0.6;
    else if (totalPoints >= 10 && totalPoints <= 19) standardKs = 0.45;
    else standardKs = 0.40;

    // Static peak demand without DLM
    const staticDemandKw = Math.round(rawInstalledPowerKw * standardKs);

    // Total combined building + EV demand without DLM
    const unconstrainedTotalKw = buildingPeakKw + staticDemandKw;

    // Available residual capacity on Transformer for EV fleet
    const availableGridMarginKw = Math.max(0, transformerMaxKw - buildingPeakKw);

    // Managed EV demand with DLM active:
    // Throttles total EV demand so (Building + EV) <= Transformer contracted capacity
    let managedEvDemandKw = staticDemandKw;
    let isThrottled = false;
    let throttlingRatio = 1.0;

    if (dlmEnabled) {
      if (unconstrainedTotalKw > transformerMaxKw) {
        managedEvDemandKw = Math.min(staticDemandKw, availableGridMarginKw);
        isThrottled = true;
        throttlingRatio = staticDemandKw > 0 ? (managedEvDemandKw / staticDemandKw) : 1;
      }
    }

    const finalTotalKw = dlmEnabled ? (buildingPeakKw + managedEvDemandKw) : unconstrainedTotalKw;
    const finalTransformerLoadPercent = Math.round((finalTotalKw / (transformerRatingKva * 0.95)) * 100);
    const isOverloaded = finalTransformerLoadPercent > 100;

    // Nominal 3-phase current for IRVE feeder busbar
    const irveFeederCurrentA = Math.round((managedEvDemandKw * 1000) / (400 * Math.sqrt(3) * 0.95));

    return {
      totalPoints,
      rawInstalledPowerKw: Math.round(rawInstalledPowerKw),
      standardKs,
      staticDemandKw,
      availableGridMarginKw: Math.round(availableGridMarginKw),
      managedEvDemandKw: Math.round(managedEvDemandKw),
      isThrottled,
      throttlingRatio: Number(throttlingRatio.toFixed(2)),
      finalTotalKw: Math.round(finalTotalKw),
      finalTransformerLoadPercent,
      isOverloaded,
      irveFeederCurrentA
    };
  }, [qty7kW, qty22kW, qty50kW, dlmEnabled, buildingPeakKw, transformerMaxKw, transformerRatingKva]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Toolbar with Standards                                   */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              {isFr ? 'Infrastructure de Recharge Véhicules Électriques (IRVE)' : 'EV Charging Infrastructure (IRVE) & DLM Engine'}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                NF C 15-100 §7-722 / IEC 61851 / IEC 62955
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Dimensionnement du parc de bornes, pilotage énergétique dynamique (DLM / Smart Charging) et protections différentielles Type B / RDC-DD.'
                : 'Charging fleet sizing, dynamic load management (DLM / Smart Charging), and Type B / RDC-DD residual protection.'}
            </p>
          </div>
        </div>

        {/* DLM Status Toggle Badge */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => setDlmEnabled(!dlmEnabled)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 font-bold transition ${
              dlmEnabled
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>DLM Smart Charging : {dlmEnabled ? (isFr ? 'ACTIF (Modulation auto)' : 'ACTIVE (Auto throttling)') : (isFr ? 'DÉSACTIVÉ (Statique)' : 'DISABLED (Static)')}</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Top Summary KPI Metrics                                          */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Total Points de Charge' : 'Total Charging Points'}</span>
          <span className="text-lg font-black text-white">{irveSizing.totalPoints} {isFr ? 'bornes' : 'units'}</span>
          <span className="text-[10px] text-slate-500 block">Puissance raccordée {irveSizing.rawInstalledPowerKw} kW</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Foisonnement §7-722 (ks)' : 'Simultaneity Factor (ks)'}</span>
          <span className="text-lg font-black text-cyan-400">ks = {irveSizing.standardKs}</span>
          <span className="text-[10px] text-slate-500 block">{isFr ? `Puissance foisonnée : ${irveSizing.staticDemandKw} kW` : `Diversified: ${irveSizing.staticDemandKw} kW`}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Appel IRVE Alloué' : 'Allocated IRVE Demand'}</span>
          <span className={`text-lg font-black ${irveSizing.isThrottled ? 'text-amber-400' : 'text-emerald-400'}`}>
            {irveSizing.managedEvDemandKw} kW
          </span>
          <span className="text-[10px] text-slate-500 block">
            {irveSizing.isThrottled 
              ? (isFr ? `Écrêté DLM (${Math.round(irveSizing.throttlingRatio * 100)}%)` : `DLM throttled (${Math.round(irveSizing.throttlingRatio * 100)}%)`)
              : (isFr ? '100% nominal' : '100% full')}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Charge Globale Transfo' : 'Overall Transformer Load'}</span>
          <span className={`text-lg font-black ${
            irveSizing.isOverloaded ? 'text-rose-400' : irveSizing.finalTransformerLoadPercent > 85 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {irveSizing.finalTransformerLoadPercent}%
          </span>
          <span className="text-[10px] text-slate-500 block">
            {irveSizing.finalTotalKw} kW / {transformerMaxKw} kW {isFr ? 'max' : 'cap'}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Fleet Configuration Sliders                                      */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-400" />
          {isFr ? 'Composition du Parc de Bornes de Recharge' : 'Charging Station Fleet Configuration'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* 7.4 kW Slider */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">7.4 kW AC Mono (32A 230V) :</span>
              <strong className="text-teal-400">{qty7kW} {isFr ? 'bornes' : 'units'} ({Math.round(qty7kW * 7.4)} kW)</strong>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={qty7kW}
              onChange={(e) => setQty7kW(Number(e.target.value))}
              className="w-full accent-teal-400"
            />
            <span className="text-[10px] text-slate-500 block">{isFr ? 'Recharge lente / Résidentiel & tertiaire' : 'Slow charge / Tertiary office'}</span>
          </div>

          {/* 22 kW Slider */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">22 kW AC Triphasé (32A 400V) :</span>
              <strong className="text-cyan-400">{qty22kW} {isFr ? 'bornes' : 'units'} ({Math.round(qty22kW * 22)} kW)</strong>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={qty22kW}
              onChange={(e) => setQty22kW(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="text-[10px] text-slate-500 block">{isFr ? 'Recharge accélérée / Parking public & flotte' : 'Accelerated charging / Fleet parking'}</span>
          </div>

          {/* 50 kW DC Fast Charging Slider */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">50 kW DC Rapide (CCS Combo 2) :</span>
              <strong className="text-amber-400">{qty50kW} {isFr ? 'bornes' : 'units'} ({Math.round(qty50kW * 50)} kW)</strong>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              value={qty50kW}
              onChange={(e) => setQty50kW(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <span className="text-[10px] text-slate-500 block">{isFr ? 'Recharge rapide DC / Passage & utilitaires' : 'DC fast charging / Rapid turnaround'}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Power Balance & Dynamic Load Management (DLM) Visualizer         */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-400" />
            {isFr ? 'Visualisation de la Puissance Souscrite & Écrêtage DLM' : 'Subscribed Power Allocation & DLM Modulation'}
          </h4>
          <span className="text-[10px] text-slate-400">
            P_transfo = {transformerMaxKw} kW | P_bâtiment = {buildingPeakKw} kW
          </span>
        </div>

        {/* Stacked Capacity Bar */}
        <div className="space-y-2">
          <div className="h-7 w-full bg-slate-950 rounded-xl border border-slate-800 flex overflow-hidden p-1 gap-1">
            {/* Building Base Load Segment */}
            <div 
              style={{ width: `${Math.min(100, (buildingPeakKw / transformerMaxKw) * 100)}%` }} 
              className="bg-indigo-600 rounded-lg flex items-center justify-center text-[10px] text-white font-bold transition-all duration-300"
              title={`Bâtiment: ${buildingPeakKw} kW`}
            >
              {isFr ? 'Bâtiment' : 'Building'} ({Math.round((buildingPeakKw / transformerMaxKw) * 100)}%)
            </div>

            {/* EV Allocated Load Segment */}
            <div 
              style={{ width: `${Math.min(100 - (buildingPeakKw / transformerMaxKw) * 100, (irveSizing.managedEvDemandKw / transformerMaxKw) * 100)}%` }} 
              className={`rounded-lg flex items-center justify-center text-[10px] text-white font-bold transition-all duration-300 ${
                irveSizing.isThrottled ? 'bg-teal-500' : 'bg-emerald-600'
              }`}
              title={`IRVE: ${irveSizing.managedEvDemandKw} kW`}
            >
              IRVE ({Math.round((irveSizing.managedEvDemandKw / transformerMaxKw) * 100)}%)
            </div>

            {/* Excess / Overload Segment if DLM disabled */}
            {irveSizing.isOverloaded && (
              <div 
                style={{ width: `${Math.min(30, irveSizing.finalTransformerLoadPercent - 100)}%` }} 
                className="bg-rose-600 rounded-lg flex items-center justify-center text-[10px] text-white font-bold animate-pulse"
              >
                SURCHARGE (+{irveSizing.finalTransformerLoadPercent - 100}%)
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-indigo-600 inline-block" />
              <span>{isFr ? `Charges Normales du Bâtiment (${buildingPeakKw} kW)` : `Base Building Load (${buildingPeakKw} kW)`}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-teal-500 inline-block" />
              <span>{isFr ? `IRVE Allouée par DLM (${irveSizing.managedEvDemandKw} kW)` : `DLM Modulated EV Load (${irveSizing.managedEvDemandKw} kW)`}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 inline-block" />
              <span>{isFr ? `Marge Réserve (${Math.max(0, transformerMaxKw - irveSizing.finalTotalKw)} kW)` : `Headroom (${Math.max(0, transformerMaxKw - irveSizing.finalTotalKw)} kW)`}</span>
            </div>
          </div>
        </div>

        {/* Warning if DLM disabled and overloaded */}
        {!dlmEnabled && irveSizing.isOverloaded && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/50 text-xs text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <p>
              {isFr
                ? `ATTENTION RISQUE DE DISJONCTION GÉNÉRALE : Sans gestion dynamique DLM, l'appel de puissance simultané (${irveSizing.finalTotalKw} kW) dépasse la puissance maximale du transformateur (${transformerMaxKw} kW). Le disjoncteur général TGBT déclenchera par surcharge thermique. Activez le pilotage DLM pour moduler les bornes en temps réel sans coupure.`
                : `RISK OF MAIN INCOMER TRIPPING: Without DLM dynamic modulation, simultaneous demand (${irveSizing.finalTotalKw} kW) exceeds transformer capacity (${transformerMaxKw} kW). Enable DLM smart charging to throttle charging current dynamically.`}
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 5. Specific Protection Rules per IEC 60364-7-722 / IEC 62955        */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          {isFr ? 'Exigences Normatives de Protection Électrique (NF C 15-100 §722 / IEC 62955)' : 'Mandatory Electrical Protection Requirements (NF C 15-100 §722)'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block font-bold">
              {isFr ? '1. Protection Différentielle Dédiée :' : '1. Dedicated Residual Protection:'}
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {isFr
                ? 'Chaque point de recharge doit être alimenté par un circuit terminal dédié avec DDR 30mA Type B, ou Type A-EV équipé d\'un détecteur de courant continu résiduel 6 mA (RDC-DD selon IEC 62955) pour éviter l\'aveuglement magnétique des DDR amont.'
                : 'Each charging point must have a dedicated branch with 30mA Type B RCD or Type A-EV with 6mA DC residual current detector (RDC-DD per IEC 62955) to prevent DC blind-spot saturation.'}
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block font-bold">
              {isFr ? '2. Chute de Tension Maximale (ΔU ≤ 2%) :' : '2. Maximum Voltage Drop (ΔU ≤ 2%):'}
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {isFr
                ? 'Pour garantir le maintien du protocole de communication PWM / ISO 15118 et éviter les échauffements prolongés à 32A continus, la chute de tension admissible sur le circuit terminal IRVE est limitée à 2% (au lieu de 3% ou 5%).'
                : 'To maintain communication integrity (PWM / ISO 15118) and prevent overheating under continuous 32A charging, voltage drop is limited to 2% max on the terminal circuit.'}
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block font-bold">
              {isFr ? '3. Coupure d\'Urgence & Déclencheur MX :' : '3. Emergency Shunt Trip (MX/MN):'}
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {isFr
                ? 'Arrêt d\'urgence "Coupure Pompiers" obligatoire en parking souterrain ou ERP. Actionne un déclencheur à émission de tension (MX) ou manque de tension (MN) sur l\'interrupteur général du tableau IRVE.'
                : 'Mandatory firefighter emergency trip button in underground or public car parks, actuating a shunt trip (MX/MN) release on the main IRVE distribution board.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
