// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 14 : MARCHÉ RÉGIONAL & INTERCONNEXION PEAC
// Cross-Border 225kV Interconnection, Regional Merit Order & Ancillary Services
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Globe,
  Sliders,
  DollarSign,
  TrendingUp,
  Activity,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  Layers,
  BarChart3,
  Flame,
  Droplets,
  Coins,
} from 'lucide-react';
import {
  REGIONAL_MERIT_ORDER,
  CAMEROON_CHAD_CORRIDOR,
  ANCILLARY_SERVICES,
  generate24HourDayAheadDispatch,
} from '../../data/hydropowerRegionalGridData';

interface HydropowerRegionalGridViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
  onSelectSubsystem?: (subsystemId: string) => void;
}

export const HydropowerRegionalGridView: React.FC<HydropowerRegionalGridViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'corridor' | 'merit' | 'dayahead' | 'ancillary'>('corridor');

  // Sub-Tab 1: Export level slider
  const [exportPowerMW, setExportPowerMW] = useState<number>(85); // 85 MW export to Chad

  // 24-hour dispatch calculations
  const dispatchProfile = useMemo(() => {
    return generate24HourDayAheadDispatch(exportPowerMW);
  }, [exportPowerMW]);

  // Aggregate stats
  const totalDailyGenerationGWh = useMemo(() => {
    const totalMWh = dispatchProfile.reduce((acc, pt) => acc + pt.nachtigalDispatchedMW, 0);
    return Number((totalMWh / 1000).toFixed(2));
  }, [dispatchProfile]);

  const totalDailyRevenueMFcfa = useMemo(() => {
    const total = dispatchProfile.reduce((acc, pt) => acc + pt.hourlyRevenueMillionFcfa, 0);
    return Number(total.toFixed(1));
  }, [dispatchProfile]);

  const totalAnnualAncillaryMFcfa = useMemo(() => {
    const total = ANCILLARY_SERVICES.reduce((acc, s) => acc + s.annualRevenueMillionFcfa, 0);
    return Number(total.toFixed(1));
  }, []);

  // Transmit stats for Corridor
  const corridorStats = useMemo(() => {
    const hourlyExportMWh = exportPowerMW;
    const lossesMW = Number(((exportPowerMW * CAMEROON_CHAD_CORRIDOR.transitLossesPercent) / 100).toFixed(1));
    const receivedPowerMW = Number((exportPowerMW - lossesMW).toFixed(1));
    const annualExportGWh = Number(((exportPowerMW * 8760 * 0.92) / 1000).toFixed(1));
    const annualWheelingFeesMFcfa = Number(
      ((annualExportGWh * 1e6 * CAMEROON_CHAD_CORRIDOR.wheelingTariffFcfaKwh) / 1e6).toFixed(1)
    );
    // CO2 avoided in Chad displacing 820 kg/MWh diesel peakers with Nachtigal 14 kg/MWh
    const co2SavedTonsPerYear = Math.round(annualExportGWh * 1000 * 0.806);

    return {
      lossesMW,
      receivedPowerMW,
      annualExportGWh,
      annualWheelingFeesMFcfa,
      co2SavedTonsPerYear,
    };
  }, [exportPowerMW]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0C1624] via-[#101F33] to-[#0A121E] border border-blue-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500/40 text-[10px] font-mono font-bold text-blue-300 uppercase tracking-widest">
                {locale === 'fr' ? 'ÉTAPE 14 • MARCHÉ RÉGIONAL PEAC & INTERCONNEXION' : 'STEP 14 • CAPP REGIONAL POWER POOL & EXPORT'}
              </span>
              <span className="text-xs font-mono text-neutral-400">PIRECT 225 kV / PEAC / WAPP / ENTSO-E</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <Globe className="h-6 w-6 text-blue-400" />
              <span>
                {locale === 'fr'
                  ? 'Marché Régional de l\'Énergie (PEAC), Interconnexion Cameroun-Tchad & Services Système'
                  : 'Central Africa Power Pool (CAPP), Cross-Border Interconnection & Ancillary Markets'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Supervision du corridor 225 kV Cameroun-Tchad (1 024 km), ordre de mérite économique régional, arbitrage horaire Day-Ahead (J-1) et monétisation des réserves de réglage (FCR, aFRR, mFRR).'
                : 'Supervision of the 225 kV Cameroon-Chad corridor (1,024 km), regional merit order stack, Day-Ahead 24-hour spot dispatching, and multi-market ancillary service monetization.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('IEEE-1547')}
                className="px-3 py-2 rounded-xl bg-[#14263D] hover:bg-[#1E3657] border border-blue-500/40 text-xs font-mono font-bold text-blue-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Code Réseau PEAC</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#1C2F47]">
          <button
            type="button"
            onClick={() => setActiveSubTab('corridor')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'corridor'
                ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20'
                : 'bg-[#122238] text-neutral-300 hover:text-white border border-[#20395B]'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Corridor 225 kV Cameroun-Tchad' : '1. Cameroon-Chad 225 kV Corridor'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('merit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'merit'
                ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20'
                : 'bg-[#122238] text-neutral-300 hover:text-white border border-[#20395B]'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. Ordre de Mérite Économique PEAC' : '2. CAPP Merit Order Stack'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('dayahead')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'dayahead'
                ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20'
                : 'bg-[#122238] text-neutral-300 hover:text-white border border-[#20395B]'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Dispatching J-1 (Day-Ahead 24h)' : '3. Day-Ahead 24h Dispatch'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ancillary')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'ancillary'
                ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20'
                : 'bg-[#122238] text-neutral-300 hover:text-white border border-[#20395B]'
            }`}
          >
            <Coins className="h-4 w-4" />
            <span>{locale === 'fr' ? '4. Services Système & Réserve (5.17 Md)' : '4. Ancillary Services (5.17B)'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: CAMEROON - CHAD 225 KV CORRIDOR (PIRECT)                  */}
      {/* ==================================================================== */}
      {activeSubTab === 'corridor' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Top KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A0E14] border border-blue-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Puissance Exportée N'Djaména</div>
              <div className="text-2xl font-black text-blue-400 mt-1">
                {exportPowerMW} <span className="text-xs font-normal text-neutral-400">MW</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Capacité contractuelle : 100 MW</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-[#252E38]">
              <div className="text-[10px] text-neutral-400 uppercase">Volume Annuel Transité</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                {corridorStats.annualExportGWh} <span className="text-xs font-normal text-neutral-400">GWh/an</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Facteur de charge : ~92%</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-emerald-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Péages de Transit SONATREL</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {corridorStats.annualWheelingFeesMFcfa} <span className="text-xs font-normal text-neutral-400">M FCFA</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Tarif péage : 8.5 FCFA/kWh</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-emerald-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">CO₂ Évité au Tchad</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {corridorStats.co2SavedTonsPerYear.toLocaleString()} <span className="text-xs font-normal text-neutral-400">t/an</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Substitution diesel Farcha</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Consigne de Transit International' : 'Cross-Border Dispatch Setpoint'}
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300">
                  PIRECT 225 kV
                </span>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Flux Exporté vers N\'Djaména :' : 'Export Flow to N\'Djaména:'}</span>
                  <span className="text-blue-400 font-bold">{exportPowerMW} MW</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={exportPowerMW}
                  onChange={(e) => setExportPowerMW(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="pt-2 border-t border-[#252E38] space-y-2 text-[11px] text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Longueur du Corridor :</span>
                  <span className="text-white font-bold">{CAMEROON_CHAD_CORRIDOR.totalLengthKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Tension Interconnexion :</span>
                  <span className="text-cyan-300 font-bold">{CAMEROON_CHAD_CORRIDOR.voltageNominalKv} kV</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Pertes en Ligne (4.2%) :</span>
                  <span className="text-red-400 font-bold">{corridorStats.lossesMW} MW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Puissance Nette Livrée :</span>
                  <span className="text-emerald-400 font-bold">{corridorStats.receivedPowerMW} MW</span>
                </div>
              </div>
            </div>

            {/* Right Map / Schematic (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-400" />
                <span>{locale === 'fr' ? 'Topologie de Transit Régional (Cameroun -> Tchad)' : 'Regional Transit Topology'}</span>
              </h4>

              <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-400">Nachtigal (Usine 420 MW)</span>
                  <span className="text-neutral-500">→ 450 km →</span>
                  <span className="text-cyan-400">Ngaoundéré (Poste 225 kV)</span>
                  <span className="text-neutral-500">→ 380 km →</span>
                  <span className="text-amber-400">Maroua</span>
                  <span className="text-neutral-500">→ 194 km →</span>
                  <span className="text-blue-400">N'Djaména (SNE)</span>
                </div>

                <div className="w-full bg-[#0A0E14] h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${(exportPowerMW / 100) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-neutral-400">
                  <span>Charge corridor : {((exportPowerMW / 250) * 100).toFixed(1)}% de la capacité thermique (250 MVA)</span>
                  <span className="text-emerald-400 font-bold">Stabilité inter-zone PSS2B : Amortie (ζ &gt; 0.12)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141A23] border border-blue-500/30 text-[11px] text-neutral-300 space-y-1 leading-relaxed">
                <div className="text-blue-400 font-bold uppercase text-[10px]">
                  {locale === 'fr' ? 'Impact Macroéconomique & Bilan Carbone :' : 'Macroeconomic & ESG Impact:'}
                </div>
                <p>
                  {locale === 'fr'
                    ? `L'exportation de ${exportPowerMW} MW d'hydroélectricité camerounaise propre se substitue directement aux groupes électrogènes diesel vétustes de Farcha à N'Djaména (qui coûtent 185 FCFA/kWh au Trésor tchadien contre 42 FCFA/kWh pour Nachtigal), tout en générant ${corridorStats.annualWheelingFeesMFcfa} M FCFA de redevances annuelles de transit pour le Cameroun.`
                    : `Exporting ${exportPowerMW} MW of clean Cameroonian hydro generation directly displaces obsolete diesel generators in N'Djaména (operating at 185 FCFA/kWh vs 42 FCFA/kWh for Nachtigal), saving ${corridorStats.co2SavedTonsPerYear.toLocaleString()} tons of CO2 annually.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: REGIONAL MERIT ORDER SUPPLY STACK                         */}
      {/* ==================================================================== */}
      {activeSubTab === 'merit' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono">
                  {locale === 'fr' ? 'Empilement des Coûts Marginaux (Merit Order PEAC / CAPP)' : 'Regional Merit Order Generation Stack'}
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                DISPATCH ÉCONOMIQUE OPTIMAL
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#252E38] text-neutral-400 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Rang</th>
                    <th className="py-2.5 px-3">Centrale & Technologie</th>
                    <th className="py-2.5 px-3">Pays</th>
                    <th className="py-2.5 px-3">Capacité Disponible</th>
                    <th className="py-2.5 px-3">Coût Marginal</th>
                    <th className="py-2.5 px-3">Intensité Carbone</th>
                    <th className="py-2.5 px-3">Rôle Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2330]">
                  {REGIONAL_MERIT_ORDER.map((plant, idx) => (
                    <tr key={plant.id} className="hover:bg-[#141A23]/50">
                      <td className="py-3 px-3 font-bold text-neutral-400">{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-white">{plant.name[locale]}</td>
                      <td className="py-3 px-3 text-cyan-300">{plant.country}</td>
                      <td className="py-3 px-3 text-white font-bold">{plant.availableCapacityMW} MW</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">{plant.marginalCostFcfaKwh} FCFA/kWh</td>
                      <td className="py-3 px-3 text-neutral-400">{plant.co2IntensityKgMWh} kg/MWh</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            plant.technology === 'Hydro'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : plant.technology === 'Gas'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : plant.technology === 'HeavyFuel'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-red-950 text-red-300 border border-red-800'
                          }`}
                        >
                          {plant.technology === 'Hydro' ? 'BASE / BANDE' : plant.technology === 'Gas' ? 'SEMI-BASE' : 'POINTE THERMIQUE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: 24-HOUR DAY-AHEAD ECONOMIC DISPATCH PROFILE               */}
      {/* ==================================================================== */}
      {activeSubTab === 'dayahead' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Top Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[#0A0E14] border border-blue-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Production Totale Journalière</div>
              <div className="text-2xl font-black text-blue-400 mt-1">
                {totalDailyGenerationGWh} <span className="text-xs font-normal text-neutral-400">GWh/j</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Sur les 7 groupes Francis</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-emerald-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Chiffre d'Affaires Spot J-1</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {totalDailyRevenueMFcfa} <span className="text-xs font-normal text-neutral-400">M FCFA/j</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Prix moyen pondéré : 58.2 FCFA/kWh</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Pointe de Demande Système</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                1 380 <span className="text-xs font-normal text-neutral-400">MW (20:00)</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Cameroun 1280 MW + Export 100 MW</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span>{locale === 'fr' ? 'Courbe de Charge & Prix Spot Horaire Day-Ahead (24 Heures)' : '24-Hour Day-Ahead Load & Spot Price Profile'}</span>
            </h3>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-[#0A0E14]">
                  <tr className="border-b border-[#252E38] text-neutral-400 text-[10px] uppercase">
                    <th className="py-2 px-2.5">Heure</th>
                    <th className="py-2 px-2.5">Demande Nationale</th>
                    <th className="py-2 px-2.5">Export Tchad</th>
                    <th className="py-2 px-2.5">Dispatch Nachtigal</th>
                    <th className="py-2 px-2.5">Prix Spot Marché</th>
                    <th className="py-2 px-2.5">Centrale Marginale</th>
                    <th className="py-2 px-2.5">Revenu Horaire</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2330]">
                  {dispatchProfile.map((pt) => (
                    <tr key={pt.hour} className="hover:bg-[#141A23]/50">
                      <td className="py-2 px-2.5 font-bold text-white">{String(pt.hour).padStart(2, '0')}:00</td>
                      <td className="py-2 px-2.5 text-neutral-300">{pt.nationalDemandMW} MW</td>
                      <td className="py-2 px-2.5 text-blue-400 font-bold">{pt.crossBorderExportMW} MW</td>
                      <td className="py-2 px-2.5 text-cyan-300 font-bold">{pt.nachtigalDispatchedMW} MW</td>
                      <td className="py-2 px-2.5 text-emerald-400 font-bold">{pt.spotMarketPriceFcfaKwh} FCFA/kWh</td>
                      <td className="py-2 px-2.5 text-neutral-400 text-[10px]">{pt.marginalPlantName}</td>
                      <td className="py-2 px-2.5 text-white font-bold">{pt.hourlyRevenueMillionFcfa} M FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 4: ANCILLARY SERVICES MONETIZATION                           */}
      {/* ==================================================================== */}
      {activeSubTab === 'ancillary' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Top Banner */}
          <div className="p-4 rounded-xl bg-[#0A0E14] border border-emerald-500/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-neutral-400 uppercase">Revenu Annuel Total Services Système</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {totalAnnualAncillaryMFcfa.toLocaleString()} <span className="text-xs font-normal text-neutral-400">Millions FCFA/an (~ 8.5 M$)</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
              4 CONTRATS GRILLE ACTIFS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ANCILLARY_SERVICES.map((as) => (
              <div key={as.id} className="p-4 rounded-xl bg-[#0A0E14] border border-[#252E38] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{as.serviceName[locale]}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[9px] font-bold">
                    {as.serviceType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    Volume Engagé : <strong className="text-white">±{as.committedVolumeMW} MW</strong>
                  </div>
                  <div>
                    Temps de Réponse : <strong className="text-cyan-300">{as.responseTimeRequirementSec} s</strong>
                  </div>
                  <div>
                    Rémunération : <strong className="text-amber-400">{as.tariffPerMwHourFcfa} FCFA/MW·h</strong>
                  </div>
                  <div>
                    Revenu Annuel : <strong className="text-emerald-400">{as.annualRevenueMillionFcfa} M FCFA</strong>
                  </div>
                </div>

                <div className="text-[10px] text-neutral-400 pt-2 border-t border-[#1C2634]">
                  Standard Normatif : <strong className="text-neutral-300">{as.regulatoryStandard}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
