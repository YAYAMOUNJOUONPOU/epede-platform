// src/components/installations/ProjectBessPvIntegrationEngine.tsx
// EPEDE D06/D07 - Battery Energy Storage & Photovoltaic Infeed Integration Engine
// Compliant with IEC 60364-7-712, NF C 15-712-1, and VDE-AR-N 4105 (Microgrid & Grid Decoupling)

import React, { useState, useMemo } from 'react';
import { 
  InstallationProject, 
  computeProjectPowerBalance 
} from './data/installationProjectModel';
import { 
  Sun, 
  BatteryCharging, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Sliders, 
  ArrowRight, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Radio,
  Layers,
  Sparkles,
  Leaf
} from 'lucide-react';

interface Props {
  project: InstallationProject;
  locale: 'fr' | 'en';
}

export const ProjectBessPvIntegrationEngine: React.FC<Props> = ({
  project,
  locale
}) => {
  const isFr = locale === 'fr';

  // -------------------------------------------------------------------------
  // 1. PV & BESS Configuration States
  // -------------------------------------------------------------------------
  // Solar PV peak capacity (kWp)
  const [pvCapacityKwp, setPvCapacityKwp] = useState<number>(
    Math.round(project.supplyContext.transformerRatingKva * 0.25)
  );

  // BESS capacity (kWh)
  const [bessCapacityKwh, setBessCapacityKwh] = useState<number>(
    Math.round(project.supplyContext.transformerRatingKva * 0.3)
  );

  // BESS Inverter Power (kW)
  const [bessPowerKw, setBessPowerKw] = useState<number>(
    Math.round(bessCapacityKwh * 0.5) // 0.5C rate default
  );

  // Operating Mode Strategy
  const [bessStrategy, setBessStrategy] = useState<'SELF_CONSUMPTION' | 'PEAK_SHAVING' | 'ISLANDED_BACKUP'>('PEAK_SHAVING');

  // Baseline Power Demand
  const powerSummary = computeProjectPowerBalance(project);
  const peakDemandKw = powerSummary.demandActivePowerKw;
  const transformerRatingKva = project.supplyContext.transformerRatingKva;

  // -------------------------------------------------------------------------
  // 2. Solar & Storage Energy Analytics & Transformer Relief
  // -------------------------------------------------------------------------
  const analytics = useMemo(() => {
    // Annual generation estimate: ~1200 kWh / kWp / year (Standard Central European / Mediterranean insolation)
    const annualSolarGenMwh = (pvCapacityKwp * 1250) / 1000;

    // Peak shaving impact:
    let peakReductionKw = 0;
    if (bessStrategy === 'PEAK_SHAVING') {
      peakReductionKw = Math.min(bessPowerKw, peakDemandKw * 0.35);
    } else if (bessStrategy === 'SELF_CONSUMPTION') {
      peakReductionKw = Math.min(bessPowerKw * 0.6, peakDemandKw * 0.2);
    }

    const netPeakDemandKw = Math.max(0, peakDemandKw - peakReductionKw);
    const netPeakApparentKva = netPeakDemandKw / (powerSummary.averagePowerFactor || 0.9);
    
    // New Transformer loading after peak shaving
    const initialTrafoLoadPercent = powerSummary.transformerUtilizationPercent;
    const relievedTrafoLoadPercent = Math.round((netPeakApparentKva / transformerRatingKva) * 100);

    // Self-consumption ratio
    // If solar peak <= 40% of building peak, self-consumption is ~90-95% with BESS
    const solarToDemandRatio = pvCapacityKwp / (peakDemandKw > 0 ? peakDemandKw : 1);
    let selfConsumptionPercent = 95;
    if (solarToDemandRatio > 0.5 && bessCapacityKwh < pvCapacityKwp) {
      selfConsumptionPercent = Math.max(65, Math.round(95 - (solarToDemandRatio - 0.5) * 40));
    }

    // Solar AC Inverter Current In_ac
    const solarInverterRatedCurrentA = Math.round((pvCapacityKwp * 1000) / (400 * Math.sqrt(3) * 0.95));
    // Inverter short-circuit contribution (limited electronically to 1.1x to 1.2x)
    const inverterShortCircuitCurrentA = Math.round(solarInverterRatedCurrentA * 1.15);

    // Carbon Savings: ~0.35 kg CO2 / kWh avoided grid electricity
    const annualCo2SavedTons = Number(((annualSolarGenMwh * 1000 * 0.32) / 1000).toFixed(1));

    return {
      annualSolarGenMwh: Math.round(annualSolarGenMwh),
      peakReductionKw: Math.round(peakReductionKw),
      netPeakDemandKw: Math.round(netPeakDemandKw),
      initialTrafoLoadPercent,
      relievedTrafoLoadPercent,
      selfConsumptionPercent,
      solarInverterRatedCurrentA,
      inverterShortCircuitCurrentA,
      annualCo2SavedTons
    };
  }, [pvCapacityKwp, bessCapacityKwh, bessPowerKw, bessStrategy, peakDemandKw, transformerRatingKva, powerSummary]);

  // Hourly curve generation for 24h simulation (Midnight to Midnight)
  const hourlyProfile = useMemo(() => {
    return Array.from({ length: 24 }).map((_, hour) => {
      // Typical commercial load profile: low at night (20%), rising from 7h to peak at 14h (100%), drops after 18h
      let loadFactor = 0.25;
      if (hour >= 6 && hour <= 8) loadFactor = 0.25 + (hour - 6) * 0.25;
      else if (hour > 8 && hour <= 17) loadFactor = 0.85 + Math.sin(((hour - 8) / 9) * Math.PI) * 0.15;
      else if (hour > 17 && hour <= 21) loadFactor = 0.70 - (hour - 17) * 0.12;

      const loadKw = peakDemandKw * loadFactor;

      // Solar profile (bell curve between 7h and 19h peaking at 13h)
      let solarKw = 0;
      if (hour >= 7 && hour <= 19) {
        solarKw = pvCapacityKwp * 0.9 * Math.sin(((hour - 7) / 12) * Math.PI);
      }

      // Battery flow: charge during peak solar, discharge during peak load
      let batteryKw = 0; // positive = discharging, negative = charging
      if (bessStrategy === 'PEAK_SHAVING') {
        if (loadKw > peakDemandKw * 0.75) {
          batteryKw = Math.min(bessPowerKw, loadKw - peakDemandKw * 0.75);
        } else if (solarKw > loadKw) {
          batteryKw = -Math.min(bessPowerKw, solarKw - loadKw);
        }
      }

      const gridKw = Math.max(0, loadKw - solarKw - batteryKw);

      return {
        hour,
        loadKw: Math.round(loadKw),
        solarKw: Math.round(solarKw),
        batteryKw: Math.round(batteryKw),
        gridKw: Math.round(gridKw)
      };
    });
  }, [peakDemandKw, pvCapacityKwp, bessPowerKw, bessStrategy]);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* 1. Header Toolbar with Standards                                   */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              {isFr ? 'Stockage BESS & Injection Solaire PV (Micro-Réseau)' : 'BESS Storage & Solar PV Infeed (Microgrid)'}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                NF C 15-712-1 / VDE-AR-N 4105
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isFr 
                ? 'Couplage AC sur TGBT, effacement des pointes (Peak Shaving), protection de découplage et limitation du courant de défaut.'
                : 'AC coupling at main TGBT, peak shaving, loss-of-mains decoupling protection, and inverter short-circuit dynamics.'}
            </p>
          </div>
        </div>

        {/* Green Badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold">
            <Leaf className="w-4 h-4" />
            <span>{analytics.annualCo2SavedTons} tCO₂ / {isFr ? 'an évitées' : 'yr avoided'}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Top KPI Sizing Metrics                                           */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Puissance Crête Solaire' : 'Solar Peak Capacity'}</span>
          <span className="text-lg font-black text-amber-400">{pvCapacityKwp} kWp</span>
          <span className="text-[10px] text-slate-500 block">~{analytics.annualSolarGenMwh} MWh / {isFr ? 'an' : 'yr'}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Capacité Batterie BESS' : 'BESS Battery Pack'}</span>
          <span className="text-lg font-black text-cyan-400">{bessCapacityKwh} kWh</span>
          <span className="text-[10px] text-slate-500 block">LiFePO4 (90% DoD, {bessPowerKw} kW)</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Effacement Pointe (Peak Shaving)' : 'Peak Shaving Reduction'}</span>
          <span className="text-lg font-black text-emerald-400">-{analytics.peakReductionKw} kW</span>
          <span className="text-[10px] text-slate-500 block">{peakDemandKw} kW → {analytics.netPeakDemandKw} kW</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-slate-400 block">{isFr ? 'Soulagement Transformateur' : 'Transformer Relief'}</span>
          <span className="text-lg font-black text-white">
            {analytics.initialTrafoLoadPercent}% → <span className="text-emerald-400">{analytics.relievedTrafoLoadPercent}%</span>
          </span>
          <span className="text-[10px] text-slate-500 block">Gain de marge therm. {project.supplyContext.transformerRatingKva} kVA</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Interactive Configuration Controls & Strategy Mode              */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          {isFr ? 'Dimensionnement & Stratégie de Pilotage' : 'System Sizing & Control Strategy'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Solar Capacity Slider */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">{isFr ? 'Générateur PV (kWc) :' : 'Solar PV (kWp):'}</span>
              <strong className="text-amber-400">{pvCapacityKwp} kWp</strong>
            </div>
            <input
              type="range"
              min="20"
              max={Math.round(transformerRatingKva * 0.8)}
              step="10"
              value={pvCapacityKwp}
              onChange={(e) => setPvCapacityKwp(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Min (20 kWp)</span>
              <span>Max ({Math.round(transformerRatingKva * 0.8)} kWp)</span>
            </div>
          </div>

          {/* BESS Storage Slider */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">{isFr ? 'Capacité BESS (kWh) :' : 'BESS Battery (kWh):'}</span>
              <strong className="text-cyan-400">{bessCapacityKwh} kWh</strong>
            </div>
            <input
              type="range"
              min="30"
              max={Math.round(transformerRatingKva * 1.0)}
              step="10"
              value={bessCapacityKwh}
              onChange={(e) => {
                const val = Number(e.target.value);
                setBessCapacityKwh(val);
                setBessPowerKw(Math.round(val * 0.5));
              }}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Puissance onduleur : {bessPowerKw} kW (0.5C)</span>
            </div>
          </div>

          {/* Strategy Mode Buttons */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block">{isFr ? 'Stratégie de Gestion (EMS) :' : 'Energy Management Strategy:'}</span>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                onClick={() => setBessStrategy('PEAK_SHAVING')}
                className={`py-1.5 px-2 rounded text-left font-bold transition flex items-center justify-between ${
                  bessStrategy === 'PEAK_SHAVING'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <span>{isFr ? 'Effacement de Pointe' : 'Peak Shaving'}</span>
                {bessStrategy === 'PEAK_SHAVING' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setBessStrategy('SELF_CONSUMPTION')}
                className={`py-1.5 px-2 rounded text-left font-bold transition flex items-center justify-between ${
                  bessStrategy === 'SELF_CONSUMPTION'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <span>{isFr ? 'Autoconsommation Max' : 'Max Self-Consumption'}</span>
                {bessStrategy === 'SELF_CONSUMPTION' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setBessStrategy('ISLANDED_BACKUP')}
                className={`py-1.5 px-2 rounded text-left font-bold transition flex items-center justify-between ${
                  bessStrategy === 'ISLANDED_BACKUP'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <span>{isFr ? 'Micro-Réseau / Secours' : 'Microgrid / Islanding'}</span>
                {bessStrategy === 'ISLANDED_BACKUP' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. 24-Hour Diurnal Power Flow Simulation Bar Chart                  */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            {isFr ? 'Courbe de Charge sur 24h & Effacement Solaire/Batterie' : '24-Hour Load & Solar/BESS Dispatch Curve'}
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            Pmax = {peakDemandKw} kW | Autoconsommation = {analytics.selfConsumptionPercent}%
          </span>
        </div>

        {/* 24-Hour Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-1.5 px-2 pt-6 pb-2 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs">
          {hourlyProfile.map(item => {
            const maxVal = Math.max(peakDemandKw * 1.1, 100);
            const loadHeight = (item.loadKw / maxVal) * 100;
            const gridHeight = (item.gridKw / maxVal) * 100;
            const solarHeight = (item.solarKw / maxVal) * 100;

            return (
              <div key={item.hour} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-0.5 h-full">
                  {/* Grid infeed (slate/blue) */}
                  <div 
                    style={{ height: `${gridHeight}%` }} 
                    className="w-1/2 bg-indigo-500/80 rounded-t-sm group-hover:bg-indigo-400 transition"
                    title={`Grid: ${item.gridKw} kW`}
                  />
                  {/* Solar generation (amber) */}
                  <div 
                    style={{ height: `${solarHeight}%` }} 
                    className="w-1/2 bg-amber-400/90 rounded-t-sm group-hover:bg-amber-300 transition"
                    title={`Solar: ${item.solarKw} kW`}
                  />
                </div>
                <span className="text-[8px] text-slate-500 mt-1 block group-hover:text-white">
                  {item.hour}h
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-indigo-500 inline-block" />
            <span>{isFr ? 'Soutirage Réseau Enedis/HTA' : 'Grid Infeed (Mains)'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-400 inline-block" />
            <span>{isFr ? 'Production Solaire PV Directe' : 'Solar PV Direct'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
            <span>{isFr ? 'Effacement Pointe Batterie' : 'Battery Peak Relief'}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 5. Protection, Decoupling & Inverter Short-Circuit Dynamics         */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          {isFr ? 'Règles de Protection & Raccordement TGBT (NF C 15-712-1 / VDE-AR-N 4105)' : 'Protection & Decoupling Sizing (NF C 15-712-1 / VDE-AR-N 4105)'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block font-bold">
              {isFr ? 'Protection de Découplage (DIN VDE 0126) :' : 'Loss-of-Mains Decoupling Protection:'}
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {isFr
                ? 'Relais de protection automatique à minima/maxima de tension (U<, U>) et fréquence (f<, f>) avec détection d\'îlotage (ROCOF df/dt). Déconnexion automatique en < 200 ms lors d\'une panne réseau.'
                : 'Automatic under/over-voltage and frequency relay with active anti-islanding detection (ROCOF df/dt). Disconnects within < 200 ms upon grid loss.'}
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block font-bold">
              {isFr ? 'Dynamique de Court-Circuit Onduleur :' : 'Inverter Short-Circuit Contribution:'}
            </span>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <div>Courant nominal AC : <strong className="text-white">{analytics.solarInverterRatedCurrentA} A</strong></div>
              <div>Courant Isc max onduleur : <strong className="text-amber-400">{analytics.inverterShortCircuitCurrentA} A (1.15 In)</strong></div>
              <p className="text-[10px] text-slate-400 font-sans">
                {isFr
                  ? 'Contrairement au transformateur (Isc = 20-40 kA), l\'onduleur est électroniquement bridé et n\'augmente pas le pouvoir de coupure requis des disjoncteurs TGBT.'
                  : 'Unlike the transformer (Isc = 20-40 kA), the inverter is electronically limited and does not increase TGBT breaking capacity requirements.'}
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 block font-bold">
              {isFr ? 'Protection Côté DC (Panneaux) :' : 'DC Side Protection (PV Strings):'}
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {isFr
                ? 'Parafoudre DC Type 1+2 (Ucpv = 1000V DC) obligatoire si paratonnerre présent. Fusibles gPV 1000V sur chaînes en parallèle et interrupteur-sectionneur DC cadenassable.'
                : 'Type 1+2 DC SPD (Ucpv = 1000V DC), gPV 1000V string fuses, and lockable DC load break switch in PV combiner boxes.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
