// src/components/installations/ProjectUpsBatteryAutonomyEngine.tsx
// EPEDE D06/D07 - Uninterruptible Power Supply (UPS / ASI) & Battery Autonomy Sizing Engine
// Compliant with NF EN 62040-3 (VFI-SS-111 Online Double Conversion), EN 50091, IEEE 485 / IEEE 1184

import React, { useState, useMemo } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  Battery, 
  BatteryCharging, 
  Zap, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Layers, 
  Cpu, 
  Activity, 
  Clock, 
  Weight, 
  Workflow, 
  Server, 
  Check, 
  RefreshCw 
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

export const ProjectUpsBatteryAutonomyEngine: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  // -------------------------------------------------------------------------
  // 1. Interactive States & Controls
  // -------------------------------------------------------------------------
  // UPS Single Unit Rating (kVA)
  const defaultUpsKva = project.backupSupplyContext.upsRatingKva || 120;
  const [singleUpsRatingKva, setSingleUpsRatingKva] = useState<number>(defaultUpsKva);

  // Redundancy Configuration
  const [redundancyMode, setRedundancyMode] = useState<'STANDALONE_N' | 'PARALLEL_N_PLUS_1' | 'DUAL_BUS_2N'>('PARALLEL_N_PLUS_1');

  // Battery Chemistry Technology
  const [batteryChemistry, setBatteryChemistry] = useState<'VRLA_AGM' | 'LITHIUM_LIFEPO4'>('VRLA_AGM');

  // Target Autonomy Duration (minutes)
  const [targetAutonomyMinutes, setTargetAutonomyMinutes] = useState<number>(15);

  // Inverter Efficiency (%)
  const [inverterEfficiencyPercent, setInverterEfficiencyPercent] = useState<number>(96);

  // DC Bus Nominal Voltage (VDC) - Typically 384V (32 blocks of 12V) or 480V (40 blocks of 12V)
  const [dcBusNominalVoltageV, setDcBusNominalVoltageV] = useState<number>(480);

  // Simulated Operating Mode: 'NORMAL_ONLINE' | 'BATTERY_MODE' | 'STATIC_BYPASS' | 'MAINTENANCE_BYPASS'
  const [simulatedUpsMode, setSimulatedUpsMode] = useState<'NORMAL_ONLINE' | 'BATTERY_MODE' | 'STATIC_BYPASS' | 'MAINTENANCE_BYPASS'>('NORMAL_ONLINE');

  // Baseline power summary
  const powerSummary = computeProjectPowerBalance(project);
  const criticalUpsLoadKw = powerSummary.criticalityBreakdown.criticalUpsKw;
  const powerFactorOutput = 0.90; // Modern UPS load PF

  // -------------------------------------------------------------------------
  // 2. Sizing Analytics & Peukert Discharge Computation
  // -------------------------------------------------------------------------
  const upsAnalytics = useMemo(() => {
    // Total system capacity based on redundancy mode
    let totalInstalledKva = singleUpsRatingKva;
    let usableRedundantKva = singleUpsRatingKva;
    let unitCount = 1;

    if (redundancyMode === 'PARALLEL_N_PLUS_1') {
      unitCount = 2;
      totalInstalledKva = singleUpsRatingKva * 2;
      usableRedundantKva = singleUpsRatingKva; // N+1: 1 unit can fail without load drop
    } else if (redundancyMode === 'DUAL_BUS_2N') {
      unitCount = 2;
      totalInstalledKva = singleUpsRatingKva * 2;
      usableRedundantKva = singleUpsRatingKva; // 2N: Each side A and B feeds 100% load
    }

    const usableActiveCapacityKw = usableRedundantKva * powerFactorOutput;
    const loadingPercent = Math.round((criticalUpsLoadKw / (usableActiveCapacityKw || 1)) * 100);
    const isOverloaded = loadingPercent > 100;

    // Battery DC power requirement:
    // P_dc = P_load / eta_inverter
    const inverterEta = inverterEfficiencyPercent / 100;
    const requiredDcPowerKw = criticalUpsLoadKw / inverterEta;
    const dcDischargeCurrentA = Number(((requiredDcPowerKw * 1000) / dcBusNominalVoltageV).toFixed(1));

    // Battery Capacity Sizing (Ah at C10):
    // For short discharge times (10-60 min), Peukert's law derates lead-acid significantly:
    // VRLA derating factor for 15min is ~0.45; Li-Ion is ~0.85
    const dischargeHours = targetAutonomyMinutes / 60;
    const peukertFactor = batteryChemistry === 'VRLA_AGM' 
      ? Math.max(0.35, Math.min(0.85, 0.35 + Math.sqrt(dischargeHours) * 0.45))
      : 0.88; // Lithium holds capacity much better at high C-rates

    // Required nominal capacity in Ah:
    const requiredBatteryAh = Math.round((dcDischargeCurrentA * dischargeHours) / peukertFactor);

    // Physical Footprint & Weight Estimations:
    // VRLA: ~ 32 kg / kWh; LiFePO4: ~ 11 kg / kWh
    const batteryEnergyKwh = Number(((dcBusNominalVoltageV * requiredBatteryAh) / 1000).toFixed(1));
    const totalBatteryWeightKg = Math.round(batteryEnergyKwh * (batteryChemistry === 'VRLA_AGM' ? 32 : 11));
    const estimatedCabinetsCount = Math.max(1, Math.ceil(totalBatteryWeightKg / 800));
    const floorFootprintM2 = Number((estimatedCabinetsCount * 0.9).toFixed(1));

    // Battery Charger / Rectifier Rating:
    // Recharging current typically I_charge = 0.10 * C10 (for VRLA) or 0.20 * C10 (for Li-Ion)
    const rechargeCurrentA = Math.round(requiredBatteryAh * (batteryChemistry === 'VRLA_AGM' ? 0.10 : 0.20));
    const rechargePowerKw = Number(((rechargeCurrentA * dcBusNominalVoltageV) / 1000).toFixed(1));
    const totalRectifierInputKw = Number((requiredDcPowerKw + rechargePowerKw).toFixed(1));

    return {
      unitCount,
      totalInstalledKva,
      usableRedundantKva,
      usableActiveCapacityKw,
      loadingPercent,
      isOverloaded,
      requiredDcPowerKw: Number(requiredDcPowerKw.toFixed(1)),
      dcDischargeCurrentA,
      requiredBatteryAh,
      batteryEnergyKwh,
      totalBatteryWeightKg,
      estimatedCabinetsCount,
      floorFootprintM2,
      rechargePowerKw,
      totalRectifierInputKw
    };
  }, [
    singleUpsRatingKva, 
    redundancyMode, 
    criticalUpsLoadKw, 
    powerFactorOutput, 
    inverterEfficiencyPercent, 
    dcBusNominalVoltageV, 
    targetAutonomyMinutes, 
    batteryChemistry
  ]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Toolbar with Standards                                   */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <BatteryCharging className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              {isFr ? 'Onduleurs (ASI / UPS) & Autonomie Batteries' : 'Uninterruptible Power Supply (UPS) & Battery Sizing Engine'}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                NF EN 62040-3 (VFI-SS-111) / IEEE 485
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Topologie On-Line double conversion, redondance N+1/2N, loi de Peukert (VRLA vs Li-Ion) et by-pass statique/manuel.'
                : 'Online double conversion topology, N+1/2N redundancy, Peukert discharge law (VRLA vs LiFePO4), and static/maintenance bypass.'}
            </p>
          </div>
        </div>

        {/* Operating Status Badge */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 font-bold ${
            upsAnalytics.isOverloaded 
              ? 'bg-rose-950/50 text-rose-400 border-rose-500/40' 
              : 'bg-emerald-950/50 text-emerald-400 border-emerald-500/40'
          }`}>
            <Server className="w-4 h-4" />
            <span>
              {criticalUpsLoadKw} kW / {upsAnalytics.usableActiveCapacityKw} kW — {upsAnalytics.loadingPercent}% {isFr ? 'Charge' : 'Load'}
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Top Summary KPI Cards                                            */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Puissance Installée ASI' : 'Installed UPS Rating'}</span>
          <span className="text-lg font-black text-cyan-400">{upsAnalytics.totalInstalledKva} kVA</span>
          <span className="text-[10px] text-slate-500 block">
            {upsAnalytics.unitCount} x {singleUpsRatingKva} kVA ({redundancyMode === 'PARALLEL_N_PLUS_1' ? 'N+1' : redundancyMode === 'DUAL_BUS_2N' ? '2N' : 'N'})
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Capacité Batterie Requise' : 'Battery Capacity'}</span>
          <span className="text-lg font-black text-amber-400">{upsAnalytics.requiredBatteryAh} Ah</span>
          <span className="text-[10px] text-slate-500 block">
            {upsAnalytics.batteryEnergyKwh} kWh ({targetAutonomyMinutes} min @ {batteryChemistry})
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Courant Décharge DC' : 'DC Discharge Current'}</span>
          <span className="text-lg font-black text-white">{upsAnalytics.dcDischargeCurrentA} A</span>
          <span className="text-[10px] text-slate-500 block">
            Bus DC : {dcBusNominalVoltageV} Vcc (P = {upsAnalytics.requiredDcPowerKw} kW)
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Poids & Encombrement' : 'Weight & Footprint'}</span>
          <span className="text-lg font-black text-indigo-400">{upsAnalytics.totalBatteryWeightKg} kg</span>
          <span className="text-[10px] text-slate-500 block">
            ~{upsAnalytics.floorFootprintM2} m² ({upsAnalytics.estimatedCabinetsCount} {isFr ? 'armoires' : 'cabinets'})
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Parameter Controls (Redundancy, Technology & Autonomy)          */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          {isFr ? 'Configuration ASI, Redondance & Technologie d\'Accumulateurs' : 'UPS Architecture & Battery Parameters'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Rating */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">{isFr ? 'Calibre Modulaire :' : 'Module Rating:'}</span>
              <strong className="text-cyan-400">{singleUpsRatingKva} kVA</strong>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="20"
              value={singleUpsRatingKva}
              onChange={(e) => setSingleUpsRatingKva(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="text-[10px] text-slate-500 block">{Math.round(singleUpsRatingKva * 0.9)} kW utile</span>
          </div>

          {/* Redundancy */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? 'Architecture Sécurité :' : 'Redundancy Mode:'}</span>
            <select
              value={redundancyMode}
              onChange={(e) => setRedundancyMode(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-bold text-xs"
            >
              <option value="STANDALONE_N">{isFr ? 'Simple Module (N)' : 'Single (N)'}</option>
              <option value="PARALLEL_N_PLUS_1">{isFr ? 'Parallèle Redondant (N+1)' : 'Parallel Redundant (N+1)'}</option>
              <option value="DUAL_BUS_2N">{isFr ? 'Double Chaîne (2N / Tier IV)' : 'Dual Bus (2N / Tier IV)'}</option>
            </select>
            <span className="text-[10px] text-slate-500 block">
              {redundancyMode === 'PARALLEL_N_PLUS_1' ? (isFr ? 'Tolérance panne 1 onduleur' : 'Tolerates 1 unit failure') : ''}
            </span>
          </div>

          {/* Battery Tech */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? 'Chimie Batterie :' : 'Battery Chemistry:'}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setBatteryChemistry('VRLA_AGM')}
                className={`flex-1 py-1.5 rounded font-bold transition text-[11px] ${
                  batteryChemistry === 'VRLA_AGM' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                VRLA Plomb
              </button>
              <button
                onClick={() => setBatteryChemistry('LITHIUM_LIFEPO4')}
                className={`flex-1 py-1.5 rounded font-bold transition text-[11px] ${
                  batteryChemistry === 'LITHIUM_LIFEPO4' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Lithium LFP
              </button>
            </div>
            <span className="text-[10px] text-slate-500 block">
              {batteryChemistry === 'LITHIUM_LIFEPO4' ? (isFr ? 'Gain de poids 65% / Durée 15 ans' : '65% lighter / 15-year life') : (isFr ? 'Standard économique / Durée 5-8 ans' : 'Economic / 5-8 year life')}
            </span>
          </div>

          {/* Autonomy Time */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 font-bold block">{isFr ? 'Autonomie Cible :' : 'Autonomy Target:'}</span>
            <div className="flex gap-1.5">
              {[10, 15, 30, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => setTargetAutonomyMinutes(mins)}
                  className={`flex-1 py-1.5 rounded font-bold transition ${
                    targetAutonomyMinutes === mins ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 block">Loi de Peukert intégrée</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Power Flow & Synoptic State Visualizer (VFI-SS-111)              */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Workflow className="w-4 h-4 text-emerald-400" />
            {isFr ? 'Synoptique Dynamique des Flux d\'Énergie (NF EN 62040-3)' : 'Dynamic Power Flow & Synoptic Visualizer'}
          </h4>
          
          {/* Mode Selector Buttons */}
          <div className="flex items-center gap-1.5">
            {[
              { id: 'NORMAL_ONLINE', label_fr: 'Normal On-Line', label_en: 'Online Double' },
              { id: 'BATTERY_MODE', label_fr: 'Mode Batterie', label_en: 'Battery Discharge' },
              { id: 'STATIC_BYPASS', label_fr: 'By-Pass Statique', label_en: 'Static Bypass' },
              { id: 'MAINTENANCE_BYPASS', label_fr: 'By-Pass Manuel', label_en: 'Maint. Bypass' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setSimulatedUpsMode(m.id as any)}
                className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                  simulatedUpsMode === m.id 
                    ? 'bg-emerald-600 text-white shadow' 
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {isFr ? m.label_fr : m.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Schematics of UPS Blocks */}
        <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center">
          {/* Grid Incomer */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block">Réseau Amont 1</span>
            <div className="text-xs font-bold text-white">400V Tri + N</div>
            <span className={`text-[10px] font-bold block ${simulatedUpsMode === 'BATTERY_MODE' ? 'text-rose-400' : 'text-emerald-400'}`}>
              {simulatedUpsMode === 'BATTERY_MODE' ? 'COUPÉ (Panne)' : 'PRÉSENT'}
            </span>
          </div>

          {/* Rectifier / PFC */}
          <div className={`p-3 rounded-lg border space-y-1 transition ${
            simulatedUpsMode === 'NORMAL_ONLINE' 
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' 
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}>
            <span className="text-[10px] uppercase font-bold block">Redresseur / PFC</span>
            <div className="text-xs font-bold">AC → DC</div>
            <span className="text-[9px] block">cos φ ≥ 0.99 | THDi &lt; 3%</span>
          </div>

          {/* DC Bus & Battery */}
          <div className={`p-3 rounded-lg border space-y-1 transition ${
            simulatedUpsMode === 'BATTERY_MODE' 
              ? 'bg-amber-950/50 border-amber-500 text-amber-300 ring-2 ring-amber-500/20' 
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <span className="text-[10px] uppercase font-bold block flex items-center justify-center gap-1">
              <Battery className="w-3.5 h-3.5" />
              Batterie DC
            </span>
            <div className="text-xs font-bold">{dcBusNominalVoltageV} Vcc</div>
            <span className="text-[9px] block">
              {simulatedUpsMode === 'BATTERY_MODE' ? `Décharge ${upsAnalytics.dcDischargeCurrentA}A` : 'Floating 100%'}
            </span>
          </div>

          {/* Inverter (Onduleur) */}
          <div className={`p-3 rounded-lg border space-y-1 transition ${
            simulatedUpsMode === 'NORMAL_ONLINE' || simulatedUpsMode === 'BATTERY_MODE'
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' 
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}>
            <span className="text-[10px] uppercase font-bold block">Onduleur IGBT</span>
            <div className="text-xs font-bold">DC → AC 50Hz</div>
            <span className="text-[9px] block">Rendement {inverterEfficiencyPercent}%</span>
          </div>

          {/* Critical Load Output */}
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 space-y-1">
            <span className="text-[10px] uppercase font-bold block">Départ Ondulé</span>
            <div className="text-xs font-bold">{criticalUpsLoadKw} kW Secouru</div>
            <span className="text-[9px] text-slate-400 block">Zéro coupure (0 ms)</span>
          </div>
        </div>

        {/* State Description Notes */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-sans">
          {simulatedUpsMode === 'NORMAL_ONLINE' && (
            <p>
              <strong>{isFr ? 'Fonctionnement Normal On-Line (Double Conversion VFI) :' : 'Normal Online Mode (VFI Double Conversion):'}</strong>{' '}
              {isFr
                ? 'L\'onduleur alimente les charges sensibles en permanence avec une tension et une fréquence parfaitement stabilisées, indépendantes des perturbations du réseau public. Le redresseur maintient la batterie en charge d\'entretien.'
                : 'The inverter continuously supplies sensitive loads with tightly regulated voltage and frequency, completely isolated from grid disturbances. The rectifier floats the battery.'}
            </p>
          )}

          {simulatedUpsMode === 'BATTERY_MODE' && (
            <p>
              <strong>{isFr ? 'Fonctionnement sur Accumulateurs (Autonomie Active) :' : 'Battery Mode (Active Discharge):'}</strong>{' '}
              {isFr
                ? `Le réseau d'alimentation amont est défaillant. L'onduleur puise son énergie instantanément sur le parc accumulateur (${upsAnalytics.dcDischargeCurrentA} A en ${dcBusNominalVoltageV} Vcc) sans interruption de tension pour les serveurs et équipements médicaux.`
                : `Mains supply is lost. The inverter draws DC current (${upsAnalytics.dcDischargeCurrentA} A at ${dcBusNominalVoltageV} VDC) with zero transfer time (0 ms interruption).`}
            </p>
          )}

          {simulatedUpsMode === 'STATIC_BYPASS' && (
            <p>
              <strong>{isFr ? 'Bascule sur By-Pass Statique à Thyristors :' : 'Static Bypass Active:'}</strong>{' '}
              {isFr
                ? 'En cas de surintensité transitoire (appel de courant aval) ou d\'avarie interne de l\'onduleur, le commutateur statique commute la charge sur le réseau de réserve sans coupure (< 1 ms), synchronisé en fréquence.'
                : 'In the event of an internal inverter fault or severe load inrush, the static bypass thyristors instantly transfer the load to the bypass line (< 1 ms).'}
            </p>
          )}

          {simulatedUpsMode === 'MAINTENANCE_BYPASS' && (
            <p>
              <strong>{isFr ? 'By-Pass Manuel de Maintenance (Consignation Sécurisée) :' : 'Manual Maintenance Bypass Engaged:'}</strong>{' '}
              {isFr
                ? 'L\'armoire ASI est complètement isolée mécaniquement et électriquement pour permettre le remplacement des condensateurs ou cartes de commande en toute sécurité par les techniciens, sans interrompre l\'alimentation du bâtiment.'
                : 'The UPS cubicle is completely isolated for servicing while raw power is routed around the unit, ensuring uninterrupted operation.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
