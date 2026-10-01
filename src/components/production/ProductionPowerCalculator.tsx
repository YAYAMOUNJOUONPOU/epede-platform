// src/components/production/ProductionPowerCalculator.tsx
import React, { useState } from 'react';
import { 
  Calculator, 
  Waves, 
  Sun, 
  Flame, 
  Wind, 
  ArrowRight, 
  Zap, 
  Activity, 
  CheckCircle2, 
  Info,
  Sliders,
  Sparkles,
  TreePine,
  ShieldAlert
} from 'lucide-react';

interface ProductionPowerCalculatorProps {
  locale?: 'fr' | 'en';
}

export const ProductionPowerCalculator: React.FC<ProductionPowerCalculatorProps> = ({
  locale = 'fr'
}) => {
  const [calcTech, setCalcTech] = useState<'hydro' | 'solar' | 'thermal' | 'wind'>('hydro');

  // Hydro state
  const [hydroHead, setHydroHead] = useState<number>(50.5); // Net head in m (Nachtigal: 50.5m)
  const [hydroFlow, setHydroFlow] = useState<number>(140); // Flow rate in m3/s (1 Francis turbine at Nachtigal: 140 m3/s, full plant: 980 m3/s)
  const [hydroEfficiency, setHydroEfficiency] = useState<number>(91); // Global efficiency in %
  const [hydroCapacityFactor, setHydroCapacityFactor] = useState<number>(80); // %

  // Solar state
  const [solarPeakMw, setSolarPeakMw] = useState<number>(30); // MWp (Maroua+Guider: 30 MWp)
  const [solarIrradiance, setSolarIrradiance] = useState<number>(850); // W/m2
  const [solarPR, setSolarPR] = useState<number>(78); // Performance Ratio %
  const [solarPeakSunHours, setSolarPeakSunHours] = useState<number>(5.6); // h/day in Grand Nord Cameroon

  // CCGT Thermal state
  const [thermalFuelHeatMw, setThermalFuelHeatMw] = useState<number>(350); // MW thermal input
  const [thermalGtEff, setThermalGtEff] = useState<number>(38); // %
  const [thermalStEff, setThermalStEff] = useState<number>(21); // %

  // Wind state
  const [windSpeed, setWindSpeed] = useState<number>(9.5); // m/s
  const [windRotorDiameter, setWindRotorDiameter] = useState<number>(114); // m
  const [windTurbinesCount, setWindTurbinesCount] = useState<number>(12); // turbines
  const [windCp, setWindCp] = useState<number>(44); // % power coefficient

  // Calculations for Hydro
  // P = rho * g * Q * H * eta = 1000 * 9.81 * Q * H * (eta/100) Watts = 9.81 * Q * H * eta / 100000 kW -> / 1000 MW
  const hydroPowerMw = (9.81 * hydroFlow * hydroHead * (hydroEfficiency / 100)) / 1000;
  const hydroAnnualGwh = (hydroPowerMw * 8760 * (hydroCapacityFactor / 100)) / 1000;
  const hydroCo2AvoidedTonnes = hydroAnnualGwh * 1000 * 0.72; // ~720 kg CO2 / MWh avoided vs coal/gas

  const recommendedTurbine = 
    hydroHead < 30 ? 'Turbine Kaplan (Basse Chute, Débit Fort)' :
    hydroHead <= 350 ? 'Turbine Francis (Moyenne Chute, Plage Universelle)' :
    'Turbine Pelton (Haute Chute > 350 m, Jets Haute Pression)';

  // Calculations for Solar
  // Instantaneous AC power: P_inst = P_peak * (G / 1000) * (PR / 100)
  const solarActiveMw = solarPeakMw * (solarIrradiance / 1000) * (solarPR / 100);
  const solarDailyMwh = solarPeakMw * solarPeakSunHours * (solarPR / 100);
  const solarAnnualGwh = (solarDailyMwh * 365) / 1000;
  const solarLandAreaHa = solarPeakMw * 1.35; // ~1.35 ha per MWp

  // Calculations for CCGT
  const thermalPowerGtMw = thermalFuelHeatMw * (thermalGtEff / 100);
  const thermalAvailableSteamMw = thermalFuelHeatMw * (1 - thermalGtEff / 100);
  const thermalPowerStMw = thermalAvailableSteamMw * (thermalStEff / 100);
  const thermalTotalPowerMw = thermalPowerGtMw + thermalPowerStMw;
  const thermalCombinedEff = (thermalTotalPowerMw / thermalFuelHeatMw) * 100;
  const thermalGasConsumptionNm3h = (thermalFuelHeatMw * 3600) / 38; // ~38 MJ/Nm3 LHV natural gas
  const thermalCo2TonnesPerHour = (thermalTotalPowerMw * 0.38); // ~380 g CO2 / kWh

  // Calculations for Wind
  // Area = pi * (D/2)^2
  const windArea = Math.PI * Math.pow(windRotorDiameter / 2, 2);
  const airDensity = 1.225; // kg/m3 at sea level
  // P_unit = 0.5 * rho * A * v^3 * Cp
  const windUnitPowerWatts = 0.5 * airDensity * windArea * Math.pow(windSpeed, 3) * (windCp / 100);
  const windUnitPowerKw = Math.min(3500, Math.max(0, windSpeed < 3 || windSpeed > 25 ? 0 : windUnitPowerWatts / 1000));
  const windTotalPowerMw = (windUnitPowerKw * windTurbinesCount) / 1000;
  const windAnnualGwh = (windTotalPowerMw * 8760 * 0.32) / 1000;

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              {locale === 'en' ? 'Generation Engineering Simulator & Calculator' : 'Simulateur & Calculateur d\'Ingénierie de Production'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {locale === 'en' ? 'Power Balance & Electromechanical Efficiencies' : 'Bilans de Puissance & Rendements Électromécaniques'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            {locale === 'en'
              ? 'Adjust thermodynamic and physical inputs to calculate active injected power, capacity factors, and operational indicators.'
              : 'Ajustez les grandeurs thermodynamiques et physiques d\'entrée pour calculer la puissance active injectée et les indicateurs d\'exploitation.'}
          </p>
        </div>

        {/* Technology Selector */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
          <button
            onClick={() => setCalcTech('hydro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
              calcTech === 'hydro'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            {locale === 'en' ? 'Hydroelectric' : 'Hydroélectricité'}
          </button>
          <button
            onClick={() => setCalcTech('solar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
              calcTech === 'solar'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            {locale === 'en' ? 'Solar PV' : 'Solaire PV'}
          </button>
          <button
            onClick={() => setCalcTech('thermal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
              calcTech === 'thermal'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            {locale === 'en' ? 'Thermal CCGT' : 'Thermique CCGT'}
          </button>
          <button
            onClick={() => setCalcTech('wind')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
              calcTech === 'wind'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            {locale === 'en' ? 'Wind Power' : 'Éolien'}
          </button>
        </div>
      </div>

      {/* TECH 1: HYDROPOWER CALCULATOR */}
      {calcTech === 'hydro' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4 bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase">Paramètres d'Écoulement & Chute</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                P = ρ · g · Q · H · η
              </span>
            </div>

            {/* Head Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Hauteur de Chute Nette (H)</span>
                <span className="font-mono font-bold text-white">{hydroHead} m</span>
              </div>
              <input
                type="range"
                min="5"
                max="800"
                step="0.5"
                value={hydroHead}
                onChange={(e) => setHydroHead(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5 m (Basse chute)</span>
                <span>50.5 m (Nachtigal)</span>
                <span>800 m (Haute chute)</span>
              </div>
            </div>

            {/* Flow Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Débit Volumique Turbiné (Q)</span>
                <span className="font-mono font-bold text-white">{hydroFlow} m³/s</span>
              </div>
              <input
                type="range"
                min="1"
                max="1200"
                step="1"
                value={hydroFlow}
                onChange={(e) => setHydroFlow(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 m³/s</span>
                <span>140 m³/s (1 Grp Nachtigal)</span>
                <span>980 m³/s (Total Nachtigal)</span>
              </div>
            </div>

            {/* Efficiency Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Rendement Global Turbine × Alternateur (η)</span>
                <span className="font-mono font-bold text-emerald-400">{hydroEfficiency}%</span>
              </div>
              <input
                type="range"
                min="75"
                max="96"
                step="0.5"
                value={hydroEfficiency}
                onChange={(e) => setHydroEfficiency(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Capacity Factor */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Facteur de Charge Annuel (FC)</span>
                <span className="font-mono font-bold text-cyan-400">{hydroCapacityFactor}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                step="1"
                value={hydroCapacityFactor}
                onChange={(e) => setHydroCapacityFactor(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Quick Benchmark Presets */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1.5">Profils Usines Cameroun</span>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  onClick={() => { setHydroHead(50.5); setHydroFlow(140); setHydroEfficiency(92); setHydroCapacityFactor(82); }}
                  className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-200 truncate"
                >
                  Nachtigal (1 Grp)
                </button>
                <button
                  onClick={() => { setHydroHead(40); setHydroFlow(135); setHydroEfficiency(90); setHydroCapacityFactor(75); }}
                  className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-200 truncate"
                >
                  Song Loulou (1 Grp)
                </button>
                <button
                  onClick={() => { setHydroHead(22); setHydroFlow(95); setHydroEfficiency(88); setHydroCapacityFactor(55); }}
                  className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-200 truncate"
                >
                  Lagdo (1 Grp)
                </button>
              </div>
            </div>
          </div>

          {/* Results Display (7 cols) */}
          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-sky-950/80 to-slate-900 border border-sky-600/40 space-y-1">
                <span className="text-xs font-mono uppercase text-sky-300">Puissance Active Électrique</span>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {hydroPowerMw.toFixed(1)} <span className="text-base text-sky-400 font-normal">MW</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Débit de puissance injecté au jeu de barres HT
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-600/40 space-y-1">
                <span className="text-xs font-mono uppercase text-emerald-300">Productible Annuel</span>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {hydroAnnualGwh.toFixed(0)} <span className="text-base text-emerald-400 font-normal">GWh/an</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  À un facteur d'utilisation de {hydroCapacityFactor}%
                </p>
              </div>
            </div>

            {/* Recommendation & Benchmarks */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Technologie de Roue Recommandée :</span>
                  <span className="text-sky-300 font-mono font-bold">{recommendedTurbine}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800">
                <TreePine className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Bilan Carbone Évité (vs Thermique Fossile) :</span>
                  <span className="text-slate-300">
                    ~<strong>{(hydroCo2AvoidedTonnes / 1000).toFixed(1)} milliers de tonnes</strong> de CO₂ évitées chaque année dans l'atmosphère.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800">
                <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Équivalence Réseau Camerounais (RIS) :</span>
                  <span className="text-slate-300">
                    Cette configuration correspond à{' '}
                    <strong>{(hydroPowerMw / 60).toFixed(1)} groupe(s)</strong> de la centrale de Nachtigal (60 MW/groupe).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TECH 2: SOLAR PHOTOVOLTAIC CALCULATOR */}
      {calcTech === 'solar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4 bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">Paramètres du Champ Solaire</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                P_ac = P_dc · (G/1000) · PR
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Puissance Crête Installée</span>
                <span className="font-mono font-bold text-white">{solarPeakMw} MWc</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={solarPeakMw}
                onChange={(e) => setSolarPeakMw(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 MWc</span>
                <span>15 MWc (Maroua)</span>
                <span>30 MWc (Maroua+Guider)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Irradiance Solaire Incidente (G)</span>
                <span className="font-mono font-bold text-amber-400">{solarIrradiance} W/m²</span>
              </div>
              <input
                type="range"
                min="100"
                max="1150"
                step="10"
                value={solarIrradiance}
                onChange={(e) => setSolarIrradiance(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Performance Ratio (PR)</span>
                <span className="font-mono font-bold text-emerald-400">{solarPR}%</span>
              </div>
              <input
                type="range"
                min="65"
                max="88"
                step="1"
                value={solarPR}
                onChange={(e) => setSolarPR(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Heures Équivalentes Plein Soleil (HSP)</span>
                <span className="font-mono font-bold text-cyan-400">{solarPeakSunHours} h/jour</span>
              </div>
              <input
                type="range"
                min="3"
                max="7"
                step="0.1"
                value={solarPeakSunHours}
                onChange={(e) => setSolarPeakSunHours(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/80 to-slate-900 border border-amber-600/40 space-y-1">
                <span className="text-xs font-mono uppercase text-amber-300">Puissance AC Instantanée</span>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {solarActiveMw.toFixed(1)} <span className="text-base text-amber-400 font-normal">MW</span>
                </div>
                <p className="text-[11px] text-slate-400">À {solarIrradiance} W/m² d'ensoleillement</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-600/40 space-y-1">
                <span className="text-xs font-mono uppercase text-emerald-300">Production Annuelle</span>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {solarAnnualGwh.toFixed(1)} <span className="text-base text-emerald-400 font-normal">GWh/an</span>
                </div>
                <p className="text-[11px] text-slate-400">Production journalière ~{solarDailyMwh.toFixed(0)} MWh/j</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Emprise Foncière Estimée :</span>
                  <span className="text-slate-300">
                    Surface requise pour le champ de modules PV : <strong>~{solarLandAreaHa.toFixed(1)} hectares</strong>.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Système de Stockage Associé (BESS recommandé) :</span>
                  <span className="text-slate-300">
                    Pour lisser l'intermittence et éviter les variations brusques de fréquence, un stockage d'environ <strong>{(solarPeakMw * 0.6).toFixed(0)} MWh</strong> est recommandé (comme à Maroua/Guider).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TECH 3: CCGT THERMAL CALCULATOR */}
      {calcTech === 'thermal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4 bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-orange-400 uppercase">Cycle Combiné Gaz-Vapeur</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800">
                Brayton + Rankine
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Puissance Thermique Combustible (MWth)</span>
                <span className="font-mono font-bold text-white">{thermalFuelHeatMw} MWth</span>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                step="10"
                value={thermalFuelHeatMw}
                onChange={(e) => setThermalFuelHeatMw(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Rendement Turbine à Gaz (Cycle Brayton)</span>
                <span className="font-mono font-bold text-orange-400">{thermalGtEff}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="44"
                step="0.5"
                value={thermalGtEff}
                onChange={(e) => setThermalGtEff(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Rendement Récupération HRSG + Turbine Vapeur</span>
                <span className="font-mono font-bold text-cyan-400">{thermalStEff}%</span>
              </div>
              <input
                type="range"
                min="14"
                max="26"
                step="0.5"
                value={thermalStEff}
                onChange={(e) => setThermalStEff(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-950/80 to-slate-900 border border-orange-600/40 space-y-1">
                <span className="text-xs font-mono uppercase text-orange-300">Puissance Électrique Nette</span>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {thermalTotalPowerMw.toFixed(1)} <span className="text-base text-orange-400 font-normal">MW</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  TG : {thermalPowerGtMw.toFixed(1)} MW | TV : {thermalPowerStMw.toFixed(1)} MW
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-600/40 space-y-1">
                <span className="text-xs font-mono uppercase text-emerald-300">Rendement Global Combiné</span>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {thermalCombinedEff.toFixed(1)} <span className="text-base text-emerald-400 font-normal">%</span>
                </div>
                <p className="text-[11px] text-slate-400">Gain de ~20% par rapport au cycle simple</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Consommation Spécifique de Gaz Naturel :</span>
                  <span className="text-slate-300">
                    Débit de combustible requis : <strong>~{thermalGasConsumptionNm3h.toFixed(0)} Nm³/heure</strong>.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Émissions de CO₂ Estimées :</span>
                  <span className="text-slate-300">
                    Environ <strong>~{thermalCo2TonnesPerHour.toFixed(1)} tCO₂/h</strong> (~380 gCO₂/kWh contre ~850 gCO₂/kWh pour le fioul/charbon).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TECH 4: WIND POWER CALCULATOR */}
      {calcTech === 'wind' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4 bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Aérogénérateur & Aérodynamique</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                P = 0.5 · ρ · A · v³ · Cp
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Vitesse du Vent à Hauteur de Moyeu (v)</span>
                <span className="font-mono font-bold text-cyan-400">{windSpeed} m/s</span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                step="0.5"
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>V_cut-in (3 m/s)</span>
                <span>V_nominale (11 m/s)</span>
                <span>V_cut-out (25 m/s)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Diamètre du Rotor (D)</span>
                <span className="font-mono font-bold text-white">{windRotorDiameter} m</span>
              </div>
              <input
                type="range"
                min="50"
                max="160"
                step="2"
                value={windRotorDiameter}
                onChange={(e) => setWindRotorDiameter(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Nombre d'Éoliennes du Parc</span>
                <span className="font-mono font-bold text-emerald-400">{windTurbinesCount} unités</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={windTurbinesCount}
                onChange={(e) => setWindTurbinesCount(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/80 to-slate-900 border border-cyan-600/40 space-y-1">
                <span className="text-xs font-mono uppercase text-cyan-300">Puissance Totale du Parc</span>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {windTotalPowerMw.toFixed(1)} <span className="text-base text-cyan-400 font-normal">MW</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Puissance unitaire : {(windUnitPowerKw / 1000).toFixed(2)} MW / éolienne
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-600/40 space-y-1">
                <span className="text-xs font-mono uppercase text-emerald-300">Productible Annuel Estimé</span>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {windAnnualGwh.toFixed(1)} <span className="text-base text-emerald-400 font-normal">GWh/an</span>
                </div>
                <p className="text-[11px] text-slate-400">Facteur de charge moyen ~32%</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Sensibilité Cubique au Vent (v³) :</span>
                  <span className="text-slate-300">
                    Doubler la vitesse du vent multiplie la puissance disponible par <strong>8 (2³ = 8)</strong>, ce qui démontre la primauté de la sélection du site (microlocalisation anémométrique).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
