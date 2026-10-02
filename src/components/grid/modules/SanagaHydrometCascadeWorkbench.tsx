// src/components/grid/modules/SanagaHydrometCascadeWorkbench.tsx
// EPEDE Deep Engineering Module — Cameroon Power Grid
// Hydrological River Basin Cascade Digital Twin (Sanaga Hydromet Engine)
// Simulates the seasonal hydro-regulation of Lom Pangar, Nachtigal, Songloulou, and Edéa

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Waves,
  Zap,
  Sliders,
  TrendingUp,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Info,
  RotateCcw,
  Gauge,
  ArrowRight,
  ShieldCheck,
  Building2,
  Layers
} from 'lucide-react';

interface Props {
  locale: 'fr' | 'en';
  onNavigatePlant?: (plantId: string) => void;
  onNavigateCalculator?: (tab: string, context?: any) => void;
}

export const SanagaHydrometCascadeWorkbench: React.FC<Props> = ({
  locale,
  onNavigatePlant,
  onNavigateCalculator,
}) => {
  const isFr = locale === 'fr';

  // 1. Seasonal Hydrological State
  // Month: 1 (Jan) to 12 (Dec)
  const [selectedMonth, setSelectedMonth] = useState<number>(3); // March (peak dry season / étiage)
  
  // Lom Pangar Controlled Sluice Gate Discharge (m³/s)
  const [lomPangarReleaseM3s, setLomPangarReleaseM3s] = useState<number>(950);
  
  // Lom Pangar Reservoir Storage Filling Rate (%)
  const [reservoirFillingPct, setReservoirFillingPct] = useState<number>(78);

  // Month metadata
  const monthInfo = useMemo(() => {
    const months = [
      { num: 1, nameFr: 'Janvier', nameEn: 'January', season: 'etiage', naturalInflowM3s: 480 },
      { num: 2, nameFr: 'Février', nameEn: 'February', season: 'etiage', naturalInflowM3s: 390 },
      { num: 3, nameFr: 'Mars', nameEn: 'March', season: 'etiage_severe', naturalInflowM3s: 320 },
      { num: 4, nameFr: 'Avril', nameEn: 'Avril', season: 'transition_up', naturalInflowM3s: 510 },
      { num: 5, nameFr: 'Mai', nameEn: 'Mai', season: 'transition_up', naturalInflowM3s: 780 },
      { num: 6, nameFr: 'Juin', nameEn: 'Juin', season: 'transition_up', naturalInflowM3s: 920 },
      { num: 7, nameFr: 'Juillet', nameEn: 'Juillet', season: 'crue', naturalInflowM3s: 1450 },
      { num: 8, nameFr: 'Août', nameEn: 'Août', season: 'crue', naturalInflowM3s: 2100 },
      { num: 9, nameFr: 'Septembre', nameEn: 'Septembre', season: 'crue_max', naturalInflowM3s: 2850 },
      { num: 10, nameFr: 'Octobre', nameEn: 'Octobre', season: 'crue', naturalInflowM3s: 2600 },
      { num: 11, nameFr: 'Novembre', nameEn: 'Novembre', season: 'transition_down', naturalInflowM3s: 1600 },
      { num: 12, nameFr: 'Décembre', nameEn: 'Décembre', season: 'etiage', naturalInflowM3s: 820 },
    ];
    return months[selectedMonth - 1];
  }, [selectedMonth]);

  // Mbam tributary contribution based on season
  const mbamTributaryFlowM3s = useMemo(() => {
    switch (monthInfo.season) {
      case 'etiage_severe': return 110;
      case 'etiage': return 160;
      case 'transition_up': return 320;
      case 'crue': return 850;
      case 'crue_max': return 1250;
      case 'transition_down': return 480;
      default: return 200;
    }
  }, [monthInfo.season]);

  // Total Sanaga River Flow downstream of confluence
  // If in wet season, river has natural abundance; if dry season, Lom Pangar regulates to release target
  const regulatedSanagaFlowM3s = useMemo(() => {
    const naturalBase = monthInfo.naturalInflowM3s;
    if (naturalBase > 1400) {
      // High flood season: water naturally exceeds regulation target
      return naturalBase + mbamTributaryFlowM3s;
    }
    // Regulated by Lom Pangar releases + Mbam
    return Math.max(lomPangarReleaseM3s, naturalBase) + mbamTributaryFlowM3s;
  }, [monthInfo.naturalInflowM3s, mbamTributaryFlowM3s, lomPangarReleaseM3s]);

  // Theoretical flow WITHOUT Lom Pangar regulation
  const unregulatedFlowM3s = monthInfo.naturalInflowM3s + mbamTributaryFlowM3s;

  // Plant Outputs Calculation (Turbine hydro power: P = eta * rho * g * Q * H)
  // 1. Lom Pangar Foot Plant (30 MW max, H = 22m, Q_max = 160 m³/s)
  const lomPangarOutputMw = useMemo(() => {
    const qTurbined = Math.min(160, lomPangarReleaseM3s);
    return Math.round((qTurbined / 160) * 30);
  }, [lomPangarReleaseM3s]);

  // 2. Nachtigal Amont (420 MW max, 7x60 MW Francis, Q_equip = 980 m³/s, H = 50m)
  const nachtigalOutputMw = useMemo(() => {
    const flowRatio = Math.min(1.0, regulatedSanagaFlowM3s / 980);
    return Math.round(flowRatio * 420);
  }, [regulatedSanagaFlowM3s]);

  const nachtigalActiveGroups = Math.min(7, Math.ceil((nachtigalOutputMw / 420) * 7));

  // 3. Songloulou (384 MW max, 8x48 MW Francis, Q_equip = 1100 m³/s, H = 39.5m)
  const songloulouOutputMw = useMemo(() => {
    const flowRatio = Math.min(1.0, regulatedSanagaFlowM3s / 1100);
    return Math.round(flowRatio * 384);
  }, [regulatedSanagaFlowM3s]);

  const songloulouActiveGroups = Math.min(8, Math.ceil((songloulouOutputMw / 384) * 8));

  // 4. Edéa (276 MW max, 14 groups, Q_equip = 1200 m³/s, H = 24.5m)
  const edeaOutputMw = useMemo(() => {
    const flowRatio = Math.min(1.0, regulatedSanagaFlowM3s / 1200);
    return Math.round(flowRatio * 276);
  }, [regulatedSanagaFlowM3s]);

  const edeaActiveGroups = Math.min(14, Math.ceil((edeaOutputMw / 276) * 14));

  // Total Cascade Output with Regulation
  const totalCascadeOutputMw = lomPangarOutputMw + nachtigalOutputMw + songloulouOutputMw + edeaOutputMw;

  // Unregulated Cascade Output (Without Lom Pangar dam)
  const unregulatedCascadeMw = useMemo(() => {
    const nP = Math.round(Math.min(1.0, unregulatedFlowM3s / 980) * 420);
    const sP = Math.round(Math.min(1.0, unregulatedFlowM3s / 1100) * 384);
    const eP = Math.round(Math.min(1.0, unregulatedFlowM3s / 1200) * 276);
    return nP + sP + eP;
  }, [unregulatedFlowM3s]);

  // Gain from Lom Pangar regulation
  const regulationGainMw = Math.max(0, totalCascadeOutputMw - unregulatedCascadeMw);

  // ALUCAM smelter dedicated potlines allocation (150 MW constant base)
  const alucamSupplyMw = Math.min(150, Math.round(edeaOutputMw * 0.75));
  const gridNetExportMw = totalCascadeOutputMw - alucamSupplyMw;

  return (
    <div className="bg-[#070D18] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold mb-1">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span className="uppercase tracking-wider">
              {isFr ? 'JUMEAU NUMÉRIQUE HYDROLOGIQUE · BASSIN DU FLEUVE SANAGA' : 'HYDROLOGICAL DIGITAL TWIN · SANAGA RIVER BASIN'}
            </span>
          </div>
          <h2 className="text-xl font-bold font-mono text-white tracking-tight flex items-center gap-2.5">
            <span>{isFr ? 'Simulateur de Cascade Hydroélectrique & Régulation de Lom Pangar' : 'Hydroelectric Cascade & Lom Pangar Regulation Simulator'}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              1 110 MW CASCADE
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {isFr
              ? 'Modélisation physique du débit régulé de la Sanaga (6 milliards m³ de retenue) et de son impact direct sur les productibles de Nachtigal (420 MW), Songloulou (384 MW) et Edéa (276 MW).'
              : 'Physical modeling of regulated Sanaga flow (6 billion m³ reservoir) and its direct production impact on Nachtigal (420 MW), Songloulou (384 MW), and Edéa (276 MW).'}
          </p>
        </div>

        {/* Global Cascade Power Gauge */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              {isFr ? 'Puissance Cascade Totale' : 'Total Cascade Output'}
            </span>
            <span className="text-lg font-black font-mono text-cyan-400">
              {totalCascadeOutputMw} MW
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-right">
            <span className="text-[10px] font-mono text-emerald-300 block uppercase">
              {isFr ? 'Gain Régulation LP' : 'Lom Pangar Gain'}
            </span>
            <span className="text-lg font-black font-mono text-emerald-400">
              +{regulationGainMw} MW
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Hydro-Climatic Controllers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        
        {/* Month / Season Selector */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5 font-bold uppercase">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isFr ? 'Mois & Régime Saisonnier' : 'Month & Hydro Regime'}</span>
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              monthInfo.season.includes('etiage') 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
            }`}>
              {monthInfo.season.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center justify-between text-white font-bold text-sm">
            <span>{isFr ? monthInfo.nameFr : monthInfo.nameEn}</span>
            <span className="text-xs text-slate-400">
              Q naturel: <strong className="text-cyan-400">{monthInfo.naturalInflowM3s} m³/s</strong>
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Jan (Étiage)</span>
            <span>Juil (Pluies)</span>
            <span>Sep (Crue Max)</span>
            <span>Déc</span>
          </div>
        </div>

        {/* Lom Pangar Sluice Release Controller */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5 font-bold uppercase">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isFr ? 'Lâcher Vanne Lom Pangar' : 'Lom Pangar Discharge'}</span>
            </span>
            <span className="text-emerald-400 font-bold text-sm">
              {lomPangarReleaseM3s} m³/s
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>{isFr ? 'Consigne de régulation aval' : 'Downstream target flow'}</span>
            <span className="text-white font-semibold">Cible: 1 000 m³/s</span>
          </div>

          <input
            type="range"
            min={400}
            max={1200}
            step={25}
            value={lomPangarReleaseM3s}
            onChange={(e) => setLomPangarReleaseM3s(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-500">
            <span>400 m³/s</span>
            <span>Étiage Normal (850-1000)</span>
            <span>1 200 m³/s</span>
          </div>
        </div>

        {/* Reservoir Retention Level */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5 font-bold uppercase">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>{isFr ? 'Taux Remplissage Retenue' : 'Reservoir Storage'}</span>
            </span>
            <span className="text-sky-400 font-bold text-sm">
              {reservoirFillingPct}% ({(reservoirFillingPct * 0.06).toFixed(2)} Gm³)
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex justify-between">
            <span>{isFr ? 'Capacité utile max' : 'Usable capacity'}</span>
            <span className="text-white font-semibold">6.00 Milliards m³</span>
          </div>

          <input
            type="range"
            min={20}
            max={100}
            step={1}
            value={reservoirFillingPct}
            onChange={(e) => setReservoirFillingPct(Number(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-500">
            <span>20% (Fin Étiage)</span>
            <span>50%</span>
            <span>100% (Plein)</span>
          </div>
        </div>
      </div>

      {/* 3. Visual Cascade Flow Diagram & Turbine Output Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span className="uppercase tracking-wider font-bold text-slate-300">
            {isFr ? 'CASCADE HYDROÉLECTRIQUE D\'AMONT EN AVAL' : 'HYDROELECTRIC CASCADE FROM UPSTREAM TO OCEAN'}
          </span>
          <span className="text-cyan-400">
            {isFr ? 'Débit Sanaga régulé total :' : 'Total regulated Sanaga flow:'} <strong className="text-white">{regulatedSanagaFlowM3s} m³/s</strong>
          </span>
        </div>

        {/* Cascade Stepper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
          
          {/* Node 1: Lom Pangar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/50 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase block">
                  {isFr ? 'Retenue Régulatrice' : 'Regulating Dam'}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">Lom Pangar</h4>
              </div>
              <span className="text-xs text-cyan-300 px-2 py-0.5 bg-cyan-950 rounded border border-cyan-800">
                {lomPangarOutputMw} / 30 MW
              </span>
            </div>

            <div className="my-3 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>{isFr ? 'Lâcher Vanne :' : 'Discharge:'}</span>
                <span className="text-white font-bold">{lomPangarReleaseM3s} m³/s</span>
              </div>
              <div className="flex justify-between">
                <span>{isFr ? 'Usine de pied :' : 'Foot plant:'}</span>
                <span className="text-emerald-400">4 x 7.5 MW Kaplan</span>
              </div>
              <div className="flex justify-between">
                <span>{isFr ? 'Chute nette :' : 'Net head:'}</span>
                <span className="text-slate-300">22 m</span>
              </div>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full transition-all duration-300"
                style={{ width: `${(lomPangarOutputMw / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Node 2: Nachtigal Amont */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                  {isFr ? 'Fil de l\'eau avec retenue' : 'Run-of-River Pondage'}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">Nachtigal Amont</h4>
              </div>
              <span className="text-xs text-emerald-300 px-2 py-0.5 bg-emerald-950 rounded border border-emerald-800">
                {nachtigalOutputMw} / 420 MW
              </span>
            </div>

            <div className="my-3 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>{isFr ? 'Débit turbiné :' : 'Turbined flow:'}</span>
                <span className="text-white font-bold">{Math.min(980, regulatedSanagaFlowM3s)} m³/s</span>
              </div>
              <div className="flex justify-between">
                <span>{isFr ? 'Groupes en service :' : 'Active turbines:'}</span>
                <span className="text-emerald-400">{nachtigalActiveGroups} / 7 Francis</span>
              </div>
              <div className="flex justify-between">
                <span>{isFr ? 'Chute nette :' : 'Net head:'}</span>
                <span className="text-slate-300">50 m</span>
              </div>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(nachtigalOutputMw / 420) * 100}%` }}
              />
            </div>
          </div>

          {/* Node 3: Songloulou */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-sky-500/50 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-sky-400 font-bold uppercase block">
                  {isFr ? 'Basse Chute Francis' : 'Low Head Francis'}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">Songloulou</h4>
              </div>
              <span className="text-xs text-sky-300 px-2 py-0.5 bg-sky-950 rounded border border-sky-800">
                {songloulouOutputMw} / 384 MW
              </span>
            </div>

            <div className="my-3 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>{isFr ? 'Débit turbiné :' : 'Turbined flow:'}</span>
                <span className="text-white font-bold">{Math.min(1100, regulatedSanagaFlowM3s)} m³/s</span>
              </div>
              <div className="flex justify-between">
                <span>{isFr ? 'Groupes en service :' : 'Active turbines:'}</span>
                <span className="text-sky-400">{songloulouActiveGroups} / 8 Francis</span>
              </div>
              <div className="flex justify-between">
                <span>{isFr ? 'Chute nette :' : 'Net head:'}</span>
                <span className="text-slate-300">39.5 m</span>
              </div>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-full transition-all duration-300"
                style={{ width: `${(songloulouOutputMw / 384) * 100}%` }}
              />
            </div>
          </div>

          {/* Node 4: Edéa */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500/50 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase block">
                  {isFr ? 'Basse Chute & ALUCAM' : 'Low Head & ALUCAM'}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">Edéa (I, II, III)</h4>
              </div>
              <span className="text-xs text-indigo-300 px-2 py-0.5 bg-indigo-950 rounded border border-indigo-800">
                {edeaOutputMw} / 276 MW
              </span>
            </div>

            <div className="my-3 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>{isFr ? 'Débit turbiné :' : 'Turbined flow:'}</span>
                <span className="text-white font-bold">{Math.min(1200, regulatedSanagaFlowM3s)} m³/s</span>
              </div>
              <div className="flex justify-between">
                <span>{isFr ? 'Groupes en service :' : 'Active turbines:'}</span>
                <span className="text-indigo-400">{edeaActiveGroups} / 14 Groupes</span>
              </div>
              <div className="flex justify-between">
                <span>{isFr ? 'Fourniture ALUCAM :' : 'ALUCAM Offtake:'}</span>
                <span className="text-amber-400">{alucamSupplyMw} MW</span>
              </div>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${(edeaOutputMw / 276) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Comparative Regulation Impact & ALUCAM Guarantee */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white">
              {isFr ? 'Bilan Énergétique Garanti par Lom Pangar (Étiage Mars)' : 'Guaranteed Energy Balance by Lom Pangar (March Dry Season)'}
            </h4>
            <p className="text-slate-400 text-[11px] mt-0.5 max-w-2xl leading-relaxed">
              {isFr
                ? `Sans Lom Pangar, le débit naturel de mars (${monthInfo.naturalInflowM3s} m³/s) n'aurait produit que ${unregulatedCascadeMw} MW, provoquant d'importants délestages à Douala et Yaoundé. Grâce au soutien de débit à ${regulatedSanagaFlowM3s} m³/s, la cascade génère ${totalCascadeOutputMw} MW (+${regulationGainMw} MW de puissance garantie).`
                : `Without Lom Pangar, natural March flow (${monthInfo.naturalInflowM3s} m³/s) would have only produced ${unregulatedCascadeMw} MW, causing heavy load-shedding. Controlled discharge to ${regulatedSanagaFlowM3s} m³/s yields ${totalCascadeOutputMw} MW (+${regulationGainMw} MW guaranteed firm capacity).`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block uppercase">{isFr ? 'Solde Net vers Réseau' : 'Net to Grid'}</span>
            <span className="text-base font-bold text-white">{gridNetExportMw} MW</span>
          </div>
        </div>
      </div>

    </div>
  );
};
