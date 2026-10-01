// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 17 : HYBRIDATION HYDRO-SOLAIRE, BESS & HYDROGÈNE P2X
// Floating PV (FPV), Battery Storage (BESS) & Green Hydrogen Power-to-X
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Sun,
  BatteryCharging,
  Droplet,
  Zap,
  Flame,
  Activity,
  Sliders,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Factory,
  Layers,
  Gauge,
  Scale,
  Sparkles,
  Waves,
} from 'lucide-react';
import {
  DEFAULT_FPV_PARAMS,
  DEFAULT_BESS_PARAMS,
  DEFAULT_H2_PARAMS,
  DEFAULT_ECONOMIC_METRICS,
  calculateFpvOutput,
  calculateH2Production,
  generate24HourDispatchProfile,
} from '../../data/hydropowerHybridHydrogenData';
import type { ElectrolyzerTechnology } from '../../types/hydropowerHybridHydrogen';

interface HydropowerHybridHydrogenViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
  onSelectSubsystem?: (subsystemId: string) => void;
}

export const HydropowerHybridHydrogenView: React.FC<HydropowerHybridHydrogenViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'fpv_bess' | 'hydrogen_p2x' | 'dispatch_24h'>('fpv_bess');

  // Sub-Tab 1 State: FPV & BESS
  const [fpvCapacityMwp, setFpvCapacityMwp] = useState<number>(120);
  const [solarIrradianceWPerM2, setSolarIrradianceWPerM2] = useState<number>(750);
  const [bessPowerMw, setBessPowerMw] = useState<number>(40);
  const [bessEnergyMwh, setBessEnergyMwh] = useState<number>(80);
  const [bessSoc, setBessSoc] = useState<number>(68);

  // Sub-Tab 2 State: Hydrogen P2X
  const [electrolyzerTech, setElectrolyzerTech] = useState<ElectrolyzerTechnology>('PEM');
  const [electrolyzerInputMw, setElectrolyzerInputMw] = useState<number>(30);
  const [specificConsumptionKwhKg, setSpecificConsumptionKwhKg] = useState<number>(51.5);

  // Computed FPV output
  const fpvCalc = useMemo(() => {
    return calculateFpvOutput(fpvCapacityMwp, solarIrradianceWPerM2, DEFAULT_FPV_PARAMS.waterCoolingEfficiencyGainPercent);
  }, [fpvCapacityMwp, solarIrradianceWPerM2]);

  // Computed Hydrogen output
  const h2Calc = useMemo(() => {
    return calculateH2Production(electrolyzerInputMw, specificConsumptionKwhKg);
  }, [electrolyzerInputMw, specificConsumptionKwhKg]);

  // 24-Hour Dispatch Profile
  const dispatchProfile = useMemo(() => {
    return generate24HourDispatchProfile(fpvCapacityMwp, bessPowerMw, electrolyzerInputMw);
  }, [fpvCapacityMwp, bessPowerMw, electrolyzerInputMw]);

  // Total daily H2 produced across 24h
  const totalDailyH2FromDispatch = useMemo(() => {
    const totalKg = dispatchProfile.reduce((acc, pt) => acc + pt.h2OutputKg, 0);
    return Number((totalKg / 1000).toFixed(2));
  }, [dispatchProfile]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#17140B] via-[#241E0F] to-[#120F08] border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
                {locale === 'fr' ? 'ÉTAPE 17 • HYBRIDATION HYDRO-SOLAIRE, BESS & HYDROGÈNE P2X' : 'STEP 17 • HYBRID HYDRO-FPV, BESS & GREEN HYDROGEN P2X'}
              </span>
              <span className="text-xs font-mono text-neutral-400">IEC 62933 / ISO 22734 / IEEE 2030.5 / IEA HYDRO TASK IX</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <Sun className="h-6 w-6 text-amber-400" />
              <span>
                {locale === 'fr'
                  ? 'Centrale Hybride Solaire Flottant (FPV), Stockage BESS & Hydrogène Vert'
                  : 'Hybrid Floating PV (FPV), BESS Storage & Green Hydrogen Hub'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Co-optimisation du plan d\'eau du barrage avec 120 MWc de solaire flottant (ombrage anti-évaporation), système BESS LFP 40 MW/80 MWh pour lissage de rampe et électrolyse PEM 30 MW pour engrais et ammoniac vert.'
                : 'Reservoir co-optimization with 120 MWp floating solar (anti-evaporation shading), 40 MW/80 MWh LFP BESS for ramp smoothing, and 30 MW PEM electrolyzer for green ammonia and fuel cell mobility.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('IEC-60041')}
                className="px-3 py-2 rounded-xl bg-[#2D2411] hover:bg-[#3D3116] border border-amber-500/40 text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>IEC 62933 / ISO 22734</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#352B16]">
          <button
            type="button"
            onClick={() => setActiveSubTab('fpv_bess')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'fpv_bess'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-[#221B0D] text-neutral-300 hover:text-white border border-[#3E3117]'
            }`}
          >
            <Sun className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Solaire Flottant (FPV) & BESS' : '1. Floating PV (FPV) & BESS'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('hydrogen_p2x')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'hydrogen_p2x'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-[#221B0D] text-neutral-300 hover:text-white border border-[#3E3117]'
            }`}
          >
            <Droplet className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. Électrolyseur PEM & Hydrogène P2X' : '2. PEM Electrolyzer & P2X'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('dispatch_24h')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'dispatch_24h'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-[#221B0D] text-neutral-300 hover:text-white border border-[#3E3117]'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Dispatch 24h & Économie LCOE/LCOH' : '3. 24h Dispatch & LCOE/LCOH'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: FLOATING SOLAR (FPV) & BESS LFP STORAGE                   */}
      {/* ==================================================================== */}
      {activeSubTab === 'fpv_bess' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Top High-Level Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A0E14] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Production Solaire FPV Actuelle</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {fpvCalc.currentPowerMw} <span className="text-xs font-normal text-neutral-400">MW</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Refroidissement eau : <strong className="text-emerald-400">+{fpvCalc.coolingBonusMw} MW (+4.8%)</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-[#252E38]">
              <div className="text-[10px] text-neutral-400 uppercase">Température Cellules FPV</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                {fpvCalc.cellTemperatureDegC} <span className="text-xs font-normal text-neutral-400">°C</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">vs ~46°C au sol (écart -11.8°C)</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-emerald-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Eau Préservée (Anti-Évaporation)</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {fpvCalc.waterSavedM3PerDay.toLocaleString()} <span className="text-xs font-normal text-neutral-400">m³/j</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Cumul annuel : <strong>~1.62 Mm³ réservoir</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">État de Charge BESS (SoC)</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                {bessSoc} <span className="text-xs font-normal text-neutral-400">%</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Capacité utile : {((bessEnergyMwh * bessSoc) / 100).toFixed(1)} / {bessEnergyMwh} MWh
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-amber-400" />
                  <span>{locale === 'fr' ? 'Paramètres Hybrides FPV & BESS' : 'FPV & BESS Operating Controls'}</span>
                </h3>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Puissance FPV Installée :' : 'Installed FPV Capacity:'}</span>
                  <span className="text-amber-400 font-bold">{fpvCapacityMwp} MWc</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="250"
                  step="10"
                  value={fpvCapacityMwp}
                  onChange={(e) => setFpvCapacityMwp(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Irradiance Solaire Directe :' : 'Solar Irradiance:'}</span>
                  <span className="text-cyan-300 font-bold">{solarIrradianceWPerM2} W/m²</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="25"
                  value={solarIrradianceWPerM2}
                  onChange={(e) => setSolarIrradianceWPerM2(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Puissance BESS LFP :' : 'BESS Power Rating:'}</span>
                  <span className="text-purple-300 font-bold">{bessPowerMw} MW</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={bessPowerMw}
                  onChange={(e) => setBessPowerMw(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Capacité de Stockage BESS :' : 'BESS Energy Storage:'}</span>
                  <span className="text-purple-400 font-bold">{bessEnergyMwh} MWh</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="10"
                  value={bessEnergyMwh}
                  onChange={(e) => setBessEnergyMwh(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'État de Charge Actuel (SoC) :' : 'Current State of Charge (SoC):'}</span>
                  <span className="text-emerald-400 font-bold">{bessSoc} %</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="95"
                  step="1"
                  value={bessSoc}
                  onChange={(e) => setBessSoc(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38] space-y-1.5 text-[11px] text-neutral-300">
                <span className="text-amber-400 font-bold text-[10px] uppercase block">
                  {locale === 'fr' ? 'Synergie Réservoir Hydraulique & PV :' : 'Reservoir-PV Physical Synergy:'}
                </span>
                <p>
                  Les 85 hectares de flotteurs FPV réduisent l'évaporation tropicale du lac de retenue de <strong>1.62 million de m³/an</strong>.
                  Cette eau conservée est turbinée en saison sèche sous 50 m de chute nette, générant <strong>+205 MWh d'énergie hydroélectrique ferme</strong>.
                </p>
              </div>
            </div>

            {/* Architecture Diagram (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Layers className="h-4 w-4 text-amber-400" />
                  <span>{locale === 'fr' ? 'Architecture Synoptique de la Centrale Hybride' : 'Hybrid Power Hub Schematic'}</span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold">
                  IEC 62933 / IEEE 2030.5
                </span>
              </div>

              {/* Graphical Layout SVG */}
              <div className="p-4 rounded-xl bg-[#080D14] border border-[#252E38] flex flex-col items-center justify-center">
                <svg viewBox="0 0 460 210" className="w-full h-52 select-none">
                  {/* Water Reservoir Surface */}
                  <rect x="20" y="20" width="180" height="90" rx="8" fill="#0C2538" stroke="#0284C7" strokeWidth="1.5" />
                  <text x="30" y="40" fill="#38BDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    RÉSERVOIR NACHTIGAL
                  </text>
                  <text x="30" y="55" fill="#94A3B8" fontSize="9" fontFamily="monospace">
                    Plan d'eau 405 m PHE
                  </text>

                  {/* FPV Island on Water */}
                  <rect x="40" y="65" width="140" height="35" rx="4" fill="#78350F" stroke="#F59E0B" strokeWidth="1.5" />
                  <text x="48" y="82" fill="#FDE68A" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    SOLAIRE FLOTTANT (FPV)
                  </text>
                  <text x="48" y="94" fill="#FEF3C7" fontSize="8" fontFamily="monospace">
                    {fpvCapacityMwp} MWc • {fpvCalc.currentPowerMw} MW injectés
                  </text>

                  {/* BESS Battery Containers */}
                  <rect x="240" y="20" width="190" height="42" rx="6" fill="#2E1065" stroke="#A855F7" strokeWidth="1.5" />
                  <text x="250" y="38" fill="#E9D5FF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    STOCKAGE BESS LFP (40 MW / 80 MWh)
                  </text>
                  <text x="250" y="52" fill="#C084FC" fontSize="8" fontFamily="monospace">
                    SoC: {bessSoc}% • RTE: 88.5% • NFPA 855
                  </text>

                  {/* Hydro Powerhouse */}
                  <rect x="240" y="75" width="190" height="42" rx="6" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
                  <text x="250" y="93" fill="#A7F3D0" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    USINE HYDRO (7x60 MW FRANCIS)
                  </text>
                  <text x="250" y="107" fill="#6EE7B7" fontSize="8" fontFamily="monospace">
                    420 MW nominaux • Régulation primaire FCR
                  </text>

                  {/* Electrolyzer P2X */}
                  <rect x="20" y="135" width="180" height="55" rx="6" fill="#134E4A" stroke="#14B8A6" strokeWidth="1.5" />
                  <text x="30" y="155" fill="#99F6E4" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    ÉLECTROLYSEUR PEM (P2X)
                  </text>
                  <text x="30" y="169" fill="#5EEAD4" fontSize="8" fontFamily="monospace">
                    {electrolyzerInputMw} MW • {h2Calc.h2FlowKgH} kg H2/h
                  </text>
                  <text x="30" y="181" fill="#CCFBF1" fontSize="8" fontFamily="monospace">
                    Ammoniac vert NH3 & Mobilité
                  </text>

                  {/* 225 kV Substation Grid Bus */}
                  <rect x="240" y="135" width="190" height="55" rx="6" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                  <text x="255" y="157" fill="#F8FAFC" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    POSTE ÉVACUATION 225 kV RIS
                  </text>
                  <text x="255" y="172" fill="#38BDF8" fontSize="9" fontFamily="monospace">
                    Ligne Nachtigal - Bafoussam / Yaoundé
                  </text>

                  {/* Interconnection Lines */}
                  <line x1="180" y1="82" x2="240" y2="82" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" />
                  <line x1="335" y1="62" x2="335" y2="75" stroke="#A855F7" strokeWidth="2" />
                  <line x1="335" y1="117" x2="335" y2="135" stroke="#10B981" strokeWidth="2" />
                  <line x1="200" y1="162" x2="240" y2="162" stroke="#14B8A6" strokeWidth="2" strokeDasharray="3 2" />
                </svg>
              </div>

              {/* Grid Support Features Table */}
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38] space-y-1">
                  <div className="text-amber-400 font-bold uppercase">Lissage de Rampe Solaire</div>
                  <p className="text-neutral-300">
                    Le BESS absorbe les passages nuageux brutaux (&gt; 15 MW/min) pour garantir une injection stable conforme au Grid Code Sonatrel.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38] space-y-1">
                  <div className="text-purple-300 font-bold uppercase">Arbitrage & Réserve Rapide</div>
                  <p className="text-neutral-300">
                    Décharge de 40 MW pendant la pointe du soir (19h-21h) et temps de réponse en moins de 150 ms pour le soutien de fréquence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: PEM ELECTROLYZER & GREEN HYDROGEN POWER-TO-X              */}
      {/* ==================================================================== */}
      {activeSubTab === 'hydrogen_p2x' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Top KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A0E14] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Débit de Production H₂</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                {h2Calc.h2FlowKgH} <span className="text-xs font-normal text-neutral-400">kg/h</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Équivalent : <strong className="text-white">{h2Calc.dailyTonnes} t/jour</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-emerald-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Rendement Énergétique LHV</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {h2Calc.stackEfficiencyLhv} <span className="text-xs font-normal text-neutral-400">%</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Sur base PCI H₂ (33.33 kWh/kg)</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Co-Produit Oxygène Pur (O₂)</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {h2Calc.oxygenFlowKgH.toLocaleString()} <span className="text-xs font-normal text-neutral-400">kg/h</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Valorisation médicale et traitement d'eau</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-[#252E38]">
              <div className="text-[10px] text-neutral-400 uppercase">Eau Déminéralisée Consommée</div>
              <div className="text-2xl font-black text-white mt-1">
                {h2Calc.deminWaterM3H} <span className="text-xs font-normal text-neutral-400">m³/h</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">ASTM D1193 Type I (résistivité &gt; 18 MΩ·cm)</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Electrolyzer Controls (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Flame className="h-4 w-4 text-cyan-400" />
                  <span>{locale === 'fr' ? 'Configuration de l\'Électrolyseur' : 'Electrolyzer Stack Configuration'}</span>
                </h3>
              </div>

              {/* Technology Selector */}
              <div>
                <label className="text-neutral-400 text-[10px] uppercase font-bold block mb-1.5">
                  {locale === 'fr' ? 'Filière Technologique d\'Électrolyse :' : 'Electrolysis Technology:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'PEM', label: 'PEM Dynamique' },
                    { id: 'Alkaline_AEL', label: 'Alcalin AEL' },
                    { id: 'SOEC', label: 'SOEC Haute T°' },
                  ].map((tech) => (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => setElectrolyzerTech(tech.id as ElectrolyzerTechnology)}
                      className={`p-2 rounded-xl text-center font-bold text-[10px] transition-all ${
                        electrolyzerTech === tech.id
                          ? 'bg-cyan-600 text-white shadow-md'
                          : 'bg-[#141A23] text-neutral-400 hover:text-white border border-[#252E38]'
                      }`}
                    >
                      {tech.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Puissance Électrique Allouée :' : 'Allocated Clean Power:'}</span>
                  <span className="text-cyan-300 font-bold">{electrolyzerInputMw} MW</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="2.5"
                  value={electrolyzerInputMw}
                  onChange={(e) => setElectrolyzerInputMw(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Consommation Spécifique (kWh/kg) :' : 'Specific Energy Consumption:'}</span>
                  <span className="text-amber-400 font-bold">{specificConsumptionKwhKg} kWh/kg</span>
                </div>
                <input
                  type="range"
                  min="48.0"
                  max="58.0"
                  step="0.5"
                  value={specificConsumptionKwhKg}
                  onChange={(e) => setSpecificConsumptionKwhKg(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2 text-[11px] text-neutral-300">
                <div className="text-cyan-400 font-bold text-[10px] uppercase">
                  {locale === 'fr' ? 'Spécifications de Sécurité ISO 22734 :' : 'ISO 22734 Safety Compliance:'}
                </div>
                <ul className="space-y-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Pureté H₂ : <strong>99.999% (Grade 5.0)</strong></span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Pression de sortie directe stack : <strong>30 bar relatif</strong></span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Inertage azote N₂ automatique et purge catalytique O₂ désox</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* P2X Offtakes Breakdown (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Factory className="h-4 w-4 text-cyan-400" />
                <span>{locale === 'fr' ? 'Débouchés Industriels Power-to-X (Cameroun & Région)' : 'Power-to-X Industrial Offtake Streams'}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                  <div className="text-emerald-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <Droplet className="h-3.5 w-3.5" />
                    <span>1. Ammoniac Vert & Engrais (NH₃)</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed text-[11px]">
                    Synthèse Haber-Bosch décarbonée alimentée par l'hydrogène vert de Nachtigal pour produire <strong>80 tonnes/jour d'engrais urée et nitrate d'ammonium</strong> pour les plantations sucrières (SOSUCAM) et cacaoyères.
                  </p>
                  <div className="text-neutral-400 text-[10px]">
                    Substitut d'engrais importés : <strong className="text-white">-45 000 t CO₂/an</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                  <div className="text-cyan-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5" />
                    <span>2. Mobilité Lourde & Camions Miniers</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed text-[11px]">
                    Station de rechargement hydrogène 350/700 bar pour la flotte de transport lourd de la route Douala-Yaoundé et les engins forestiers/miniers du Sud-Cameroun.
                  </p>
                  <div className="text-neutral-400 text-[10px]">
                    Économie gazole : <strong className="text-white">~3.8 millions L/an</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                  <div className="text-amber-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5" />
                    <span>3. Valorisation Oxygène Pur (O₂)</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed text-[11px]">
                    Récupération des {h2Calc.oxygenFlowKgH.toLocaleString()} kg/h d'oxygène pur pour les centres hospitaliers universitaires de Yaoundé et l'aération des bassins aquacoles de la Sanaga.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                  <div className="text-purple-300 font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" />
                    <span>4. Ré-électrification de Secours (Fuel Cell)</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed text-[11px]">
                    Stockage tampon de 5 tonnes d'hydrogène comprimé capable de restituer 80 MWh d'électricité en cas de black-out complet du réseau interconnecté sud (RIS).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: 24-HOUR DISPATCH & ECONOMIC LCOE / LCOH METRICS           */}
      {/* ==================================================================== */}
      {activeSubTab === 'dispatch_24h' && (
        <div className="space-y-6 font-mono text-xs">
          {/* LCOE & LCOH Comparative Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A0E14] border border-[#252E38]">
              <div className="text-[10px] text-neutral-400 uppercase">LCOE Hydro Pur</div>
              <div className="text-2xl font-black text-white mt-1">
                ${DEFAULT_ECONOMIC_METRICS.hydroLcoeUsdPerMwh} <span className="text-xs font-normal text-neutral-400">/MWh</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Fil de l'eau de référence</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">LCOE Hybride Ferme (Hydro+FPV+BESS)</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                ${DEFAULT_ECONOMIC_METRICS.hybridLcoeUsdPerMwh} <span className="text-xs font-normal text-neutral-400">/MWh</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Capacité ferme garantie 24/7</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">LCOH Hydrogène Vert Sortie Stack</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                ${DEFAULT_ECONOMIC_METRICS.greenHydrogenLcohUsdPerKg} <span className="text-xs font-normal text-neutral-400">/kg H₂</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Énergie excédentaire &lt; $30/MWh</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-emerald-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Émissions CO₂ Évitées</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {DEFAULT_ECONOMIC_METRICS.annualCo2AbatementTonnes.toLocaleString()} <span className="text-xs font-normal text-neutral-400">t/an</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">vs centrales thermiques fuel lourd</div>
            </div>
          </div>

          {/* 24-Hour Dispatch Table & Hourly Evolution */}
          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
              <div>
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  <span>{locale === 'fr' ? 'Simulation de Dispatch Multi-Énergies sur 24 Heures' : '24-Hour Multi-Carrier Dispatch Chronogram'}</span>
                </h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  Production H₂ totale sur le cycle journalier : <strong className="text-cyan-300">{totalDailyH2FromDispatch} tonnes</strong>
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                OPTIMISÉ PAR IA (COORDINATION HYDRO-SOLAIRE-BESS-H₂)
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs font-mono">
                <thead className="sticky top-0 bg-[#0A0E14]">
                  <tr className="border-b border-[#252E38] text-neutral-400 text-[10px] uppercase">
                    <th className="py-2 px-2.5">Heure</th>
                    <th className="py-2 px-2.5">Demande Réseau</th>
                    <th className="py-2 px-2.5">Hydro (MW)</th>
                    <th className="py-2 px-2.5 text-amber-400">Solaire FPV</th>
                    <th className="py-2 px-2.5 text-purple-300">BESS (MW)</th>
                    <th className="py-2 px-2.5 text-cyan-300">Électrolyse H₂</th>
                    <th className="py-2 px-2.5 text-emerald-400 font-bold">Net Réseau 225kV</th>
                    <th className="py-2 px-2.5">SoC BESS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2330]">
                  {dispatchProfile.map((pt) => (
                    <tr key={pt.hour} className="hover:bg-[#141A23]/50">
                      <td className="py-2 px-2.5 font-bold text-white">
                        {String(pt.hour).padStart(2, '0')}:00
                      </td>
                      <td className="py-2 px-2.5 text-neutral-300">{pt.gridDemandMw} MW</td>
                      <td className="py-2 px-2.5 text-white">{pt.hydroGenerationMw} MW</td>
                      <td className="py-2 px-2.5 text-amber-400 font-bold">
                        {pt.solarFpvGenerationMw > 0 ? `+${pt.solarFpvGenerationMw}` : '0.0'} MW
                      </td>
                      <td className="py-2 px-2.5">
                        <span
                          className={`font-bold ${
                            pt.bessPowerMw > 0
                              ? 'text-emerald-400'
                              : pt.bessPowerMw < 0
                              ? 'text-amber-400'
                              : 'text-neutral-500'
                          }`}
                        >
                          {pt.bessPowerMw > 0 ? `+${pt.bessPowerMw} (Décharge)` : pt.bessPowerMw < 0 ? `${pt.bessPowerMw} (Charge)` : '0.0 MW'}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 text-cyan-300">
                        {pt.electrolyzerInputMw > 0 ? `-${pt.electrolyzerInputMw} MW` : '0.0 MW'}
                      </td>
                      <td className="py-2 px-2.5 text-emerald-300 font-bold">
                        {pt.netGridExportMw} MW
                      </td>
                      <td className="py-2 px-2.5 text-purple-300 font-bold">
                        {pt.bessSocPercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
