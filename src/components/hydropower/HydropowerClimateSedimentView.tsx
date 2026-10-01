// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 12 : RÉSILIENCE CLIMATIQUE & RE-POWERING
// IEC 62364 Sediment Abrasion, IPCC Scenarios, Eco-Hydraulics & Circular Uprating
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  CloudSun,
  Waves,
  Fish,
  RefreshCw,
  TrendingDown,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Trees,
  Layers,
  BarChart3,
  Gauge,
  HelpCircle,
} from 'lucide-react';
import {
  CLIMATE_PROJECTIONS,
  calculateSedimentFlushing,
  ECO_HYDRAULICS_TELEMETRY,
  REPOWERING_UPGRADE_OPTIONS,
} from '../../data/hydropowerClimateSedimentData';
import type {
  ClimateScenario,
  SedimentFlushingParams,
} from '../../types/hydropowerClimateSediment';

interface HydropowerClimateSedimentViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
  onSelectSubsystem?: (subsystemId: string) => void;
}

export const HydropowerClimateSedimentView: React.FC<HydropowerClimateSedimentViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sediment' | 'climate' | 'ecohydraulics' | 'repowering'>('sediment');

  // Sub-Tab 1: Sediment & Abrasion state
  const [sscGPerL, setSscGPerL] = useState<number>(0.85); // 0.85 g/L
  const [quartzPercent, setQuartzPercent] = useState<number>(65); // 65% Quartz
  const [grainSizeD50Mm, setGrainSizeD50Mm] = useState<number>(0.09); // 0.09 mm
  const [flushingFlowM3s, setFlushingFlowM3s] = useState<number>(380); // 380 m3/s
  const [flushingHours, setFlushingHours] = useState<number>(48); // 48 hours

  // Sub-Tab 2: Climate Scenario selector
  const [selectedScenario, setSelectedScenario] = useState<ClimateScenario>('rcp_45');

  // Sub-Tab 4: Repowering Selection
  const [selectedRepoweringIds, setSelectedRepoweringIds] = useState<string[]>(['REP-01', 'REP-02']);

  // Calculated sediment results
  const sedimentResult = useMemo(() => {
    return calculateSedimentFlushing({
      suspendedSedimentConcentrationGPerL: sscGPerL,
      quartzHardnessPercent: quartzPercent,
      sedimentGrainSizeD50Mm: grainSizeD50Mm,
      flushingDischargeM3s: flushingFlowM3s,
      flushingDurationHours: flushingHours,
    });
  }, [sscGPerL, quartzPercent, grainSizeD50Mm, flushingFlowM3s, flushingHours]);

  // Aggregate repowering calculations
  const totalRepoweringStats = useMemo(() => {
    const selected = REPOWERING_UPGRADE_OPTIONS.filter((opt) => selectedRepoweringIds.includes(opt.id));
    const totalCapacityGainMW = selected.reduce((acc, opt) => acc + opt.capacityGainMW * 7, 0); // 7 units
    const totalCapexMUsd = selected.reduce((acc, opt) => acc + opt.capexMillionUsd, 0);
    const totalCo2AvoidedTons = selected.reduce((acc, opt) => acc + opt.co2AvoidedAdditionalTonsYear, 0);
    const avgEfficiencyGain = selected.reduce((acc, opt) => acc + opt.efficiencyGainPercent, 0);

    return {
      totalCapacityGainMW: Number(totalCapacityGainMW.toFixed(1)),
      newPlantCapacityMW: Number((420 + totalCapacityGainMW).toFixed(1)),
      totalCapexMUsd: Number(totalCapexMUsd.toFixed(1)),
      totalCo2AvoidedTons,
      avgEfficiencyGain: Number(avgEfficiencyGain.toFixed(1)),
    };
  }, [selectedRepoweringIds]);

  const toggleRepowering = (id: string) => {
    setSelectedRepoweringIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0C1A1A] via-[#102422] to-[#0A1616] border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest">
                {locale === 'fr' ? 'ÉTAPE 12 • RÉSILIENCE CLIMATIQUE & RE-POWERING' : 'STEP 12 • CLIMATE RESILIENCE & RE-POWERING'}
              </span>
              <span className="text-xs font-mono text-neutral-400">CEI 62364 / GIEC / IHA ESG / ISO 14040</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <CloudSun className="h-6 w-6 text-emerald-400" />
              <span>
                {locale === 'fr'
                  ? 'Résilience Climatique, Gestion Sédimentaire & Re-powering Circulaire'
                  : 'Climate Resilience, Sediment Siltation (IEC 62364) & Circular Re-powering'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Simulation d\'abrasion hydro-sédimentaire sur roue Francis, projections hydrologiques GIEC (RCP 4.5/8.5), suivi éco-hydraulique du débit réservé et surpuissance circulaire (+63 MW) sans extension de génie civil.'
                : 'IEC 62364 hydro-abrasive runner wear modeling, IPCC climate streamflow projections, eco-hydraulic fish pass compliance, and circular plant uprating (+63 MW) with 98% material recyclability.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('IEC-62364')}
                className="px-3 py-2 rounded-xl bg-[#142A27] hover:bg-[#1E3D39] border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>CEI 62364 (Abrasion)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#1C322F]">
          <button
            type="button"
            onClick={() => setActiveSubTab('sediment')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'sediment'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-[#142624] text-neutral-300 hover:text-white border border-[#23423E]'
            }`}
          >
            <Waves className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Sédimentologie & Chasse (CEI 62364)' : '1. Sediment & Abrasion (IEC 62364)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('climate')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'climate'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-[#142624] text-neutral-300 hover:text-white border border-[#23423E]'
            }`}
          >
            <TrendingDown className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. Projections Climatiques GIEC (RCP)' : '2. IPCC Climate Projections'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ecohydraulics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'ecohydraulics'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-[#142624] text-neutral-300 hover:text-white border border-[#23423E]'
            }`}
          >
            <Fish className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Éco-Hydraulique & Qualité d\'Eau' : '3. Eco-Hydraulics & Fish Pass'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('repowering')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'repowering'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-[#142624] text-neutral-300 hover:text-white border border-[#23423E]'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>{locale === 'fr' ? '4. Re-powering Circulaire (+63 MW)' : '4. Circular Re-powering (+63 MW)'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: SEDIMENT SILTATION & IEC 62364 RUNNER WEAR                */}
      {/* ==================================================================== */}
      {activeSubTab === 'sediment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
            {/* Left Sliders: Sediment Parameters (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Paramètres Sédimentaires Sanaga' : 'Sanaga Sediment Inputs'}
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">
                  CRUE ANNUELLE
                </span>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Concentration en Suspension (MES) :' : 'Suspended Sediment (SSC):'}</span>
                  <span className="text-amber-400 font-bold">{sscGPerL} g/L</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.05"
                  value={sscGPerL}
                  onChange={(e) => setSscGPerL(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Teneur en Quartz (Dureté Mohs 7) :' : 'Quartz Content (Mohs 7):'}</span>
                  <span className="text-red-400 font-bold">{quartzPercent}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="90"
                  step="5"
                  value={quartzPercent}
                  onChange={(e) => setQuartzPercent(parseFloat(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Diamètre Médian Grains d₅₀ :' : 'Median Grain Size d₅₀:'}</span>
                  <span className="text-cyan-400 font-bold">{(grainSizeD50Mm * 1000).toFixed(0)} µm</span>
                </div>
                <input
                  type="range"
                  min="0.03"
                  max="0.25"
                  step="0.01"
                  value={grainSizeD50Mm}
                  onChange={(e) => setGrainSizeD50Mm(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="pt-2 border-t border-[#252E38]">
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Débit de Chasse Vidange de Fond :' : 'Bottom Outlet Flushing Flow:'}</span>
                  <span className="text-emerald-400 font-bold">{flushingFlowM3s} m³/s</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="600"
                  step="10"
                  value={flushingFlowM3s}
                  onChange={(e) => setFlushingFlowM3s(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Durée de la Chasse Hydraulique :' : 'Flushing Event Duration:'}</span>
                  <span className="text-blue-400 font-bold">{flushingHours} h</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="96"
                  step="6"
                  value={flushingHours}
                  onChange={(e) => setFlushingHours(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            {/* Right Output: IEC 62364 Wear & Flushing Metrics (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-amber-400" />
                    <span>{locale === 'fr' ? 'Indice d\'Abrasion Francis CEI 62364' : 'Francis Runner IEC 62364 Wear Rates'}</span>
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sedimentResult.iec62364WearCategory === 'extreme'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : sedimentResult.iec62364WearCategory === 'severe'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    CATÉGORIE : {sedimentResult.iec62364WearCategory.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-400 uppercase">Taux d'Usure Roue</div>
                    <div className="text-2xl font-black text-amber-400 mt-1">
                      {sedimentResult.runnerAbrasiveWearRateMmPerYear} <span className="text-xs font-normal text-neutral-400">mm/an</span>
                    </div>
                    <div className="text-[9px] text-neutral-500 mt-0.5">Sur aubes et bord de fuite</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-400 uppercase">Intervalle Rechargement</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">
                      {sedimentResult.runnerRecoatingIntervalYears} <span className="text-xs font-normal text-neutral-400">ans</span>
                    </div>
                    <div className="text-[9px] text-neutral-500 mt-0.5">Revêtement céramique HVOF</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-400 uppercase">Vitesse Curage Fond</div>
                    <div className="text-2xl font-black text-cyan-400 mt-1">
                      {sedimentResult.flushingScourVelocityMs} <span className="text-xs font-normal text-neutral-400">m/s</span>
                    </div>
                    <div className="text-[9px] text-neutral-500 mt-0.5">Vitesse seuil critique &gt; 3.0 m/s</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-400 uppercase">Sédiments Évacués par Chasse</div>
                    <div className="text-xl font-bold text-white mt-1">
                      {sedimentResult.flushedSedimentTonsPerEvent.toLocaleString()} tonnes
                    </div>
                    <div className="text-[9px] text-neutral-500 mt-0.5">Sur la campagne de {flushingHours} h</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-400 uppercase">Perte Retenue (50 ans)</div>
                    <div className="text-xl font-bold text-red-400 mt-1">
                      {sedimentResult.reservoirVolumeLossPercent50Years} %
                    </div>
                    <div className="text-[9px] text-neutral-500 mt-0.5">Sans campagnes de purge</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#141A23] border border-emerald-500/30 text-[11px] text-neutral-300 space-y-1 leading-relaxed">
                  <div className="text-emerald-400 font-bold uppercase text-[10px]">
                    {locale === 'fr' ? 'Recommandation d\'Exploitation CEI 62364 :' : 'IEC 62364 Operating Directive:'}
                  </div>
                  <p>{sedimentResult.actionRecommendation[locale]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: IPCC / GIEC CLIMATE CHANGE SCENARIOS                      */}
      {/* ==================================================================== */}
      {activeSubTab === 'climate' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Scenario Selector */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0A0E14] border border-[#252E38]">
            <span className="text-neutral-400 text-xs font-bold uppercase">
              {locale === 'fr' ? 'Scénario Climatique GIEC :' : 'IPCC Climate Pathway:'}
            </span>
            <button
              type="button"
              onClick={() => setSelectedScenario('baseline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedScenario === 'baseline'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-[#141A23] text-neutral-400 hover:text-white border border-[#252E38]'
              }`}
            >
              Baseline Historique (1990-2020)
            </button>
            <button
              type="button"
              onClick={() => setSelectedScenario('rcp_45')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedScenario === 'rcp_45'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-[#141A23] text-neutral-400 hover:text-white border border-[#252E38]'
              }`}
            >
              GIEC RCP 4.5 (Modéré +1.8°C)
            </button>
            <button
              type="button"
              onClick={() => setSelectedScenario('rcp_85')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedScenario === 'rcp_85'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-[#141A23] text-neutral-400 hover:text-white border border-[#252E38]'
              }`}
            >
              GIEC RCP 8.5 (Intense +3.5°C)
            </button>
          </div>

          {/* Decadal Projections Table */}
          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
              <span>{locale === 'fr' ? 'Évolution Décennale des Débits & Productibilité Sanaga' : 'Decadal Sanaga Streamflow & Generation Forecast'}</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#252E38] text-neutral-400 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Horizon</th>
                    <th className="py-2.5 px-3">Débit Moyen Modélisé</th>
                    <th className="py-2.5 px-3">Anomalie Thermique</th>
                    <th className="py-2.5 px-3">Impact Productibilité</th>
                    <th className="py-2.5 px-3">Indice Risque Sécheresse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2330]">
                  {CLIMATE_PROJECTIONS.map((pt) => {
                    const flow =
                      selectedScenario === 'baseline'
                        ? pt.baselineInflowM3s
                        : selectedScenario === 'rcp_45'
                        ? pt.rcp45InflowM3s
                        : pt.rcp85InflowM3s;
                    return (
                      <tr key={pt.decade} className="hover:bg-[#141A23]/50">
                        <td className="py-3 px-3 font-bold text-white">{pt.decade}</td>
                        <td className="py-3 px-3 text-cyan-300 font-bold">{flow} m³/s</td>
                        <td className="py-3 px-3 text-amber-400">+{pt.temperatureAnomalyC} °C</td>
                        <td className="py-3 px-3 text-red-400 font-bold">{pt.annualGenerationImpactPercent} %</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              pt.droughtRiskIndex === 'extreme'
                                ? 'bg-red-950 text-red-300 border border-red-800'
                                : pt.droughtRiskIndex === 'high'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            {pt.droughtRiskIndex}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Climate Adaptation Blueprint */}
            <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2 text-[11px] leading-relaxed text-neutral-300">
              <div className="text-emerald-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                <Trees className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Stratégie d\'Adaptation & Résilience Bassin Versant :' : 'Watershed Adaptation Strategy:'}</span>
              </div>
              <p>
                {locale === 'fr'
                  ? 'Pour compenser le déficit d\'étiage simulé sous RCP 8.5 (-15.6% à horizon 2050), le système s\'appuie sur la gestion dynamique de la retenue de Lom Pangar (6 milliards m³), le reboisement agro-forestier des berges de la Sanaga (lutte contre le ruissellement sédimentaire) et le couplage avec le stockage BESS.'
                  : 'To counteract projected dry-season deficits under RCP 8.5 (-15.6% by 2050), the system coordinates dynamic storage releases from Lom Pangar reservoir (6 billion m³), headwater agroforestry reforestation, and hybrid BESS integration.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: ECO-HYDRAULICS & FISH PASS MONITORING                     */}
      {/* ==================================================================== */}
      {activeSubTab === 'ecohydraulics' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
              <div className="flex items-center gap-2">
                <Fish className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono">
                  {locale === 'fr' ? 'Télémétrie Éco-Hydraulique & Conformité Environnementale' : 'Eco-Hydraulic Live Monitoring & ESG Compliance'}
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                100% CONFORME IHA ESG
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ECO_HYDRAULICS_TELEMETRY.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-xs">{item.parameterName[locale]}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold">
                      CONFORME
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-cyan-300">{item.currentValue}</span>
                    <span className="text-neutral-400 text-xs">{item.unit}</span>
                    <span className="text-neutral-500 text-[10px] ml-auto">
                      Seuil normatif : {item.regulatoryMinimum} {item.unit}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-300 leading-relaxed pt-1 border-t border-[#1C2634]">
                    {item.ecologicalFunction[locale]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 4: CIRCULAR RE-POWERING & UPRATING LAB                       */}
      {/* ==================================================================== */}
      {activeSubTab === 'repowering' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Top Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A0E14] border border-emerald-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Gain de Puissance Totale</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                +{totalRepoweringStats.totalCapacityGainMW} MW
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Nouvelle capacité : {totalRepoweringStats.newPlantCapacityMW} MW</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Gain de Rendement Moyen</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                +{totalRepoweringStats.avgEfficiencyGain} %
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Optimisation CFD aubes et vortex</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-[#252E38]">
              <div className="text-[10px] text-neutral-400 uppercase">Investissement Total CAPEX</div>
              <div className="text-2xl font-black text-white mt-1">
                {totalRepoweringStats.totalCapexMUsd} M$
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Amortissement moyen : ~3.2 ans</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-emerald-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">CO₂ Évité Additionnel</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {totalRepoweringStats.totalCo2AvoidedTons.toLocaleString()} t/an
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Substitue le thermique d'appoint</div>
            </div>
          </div>

          {/* Upgrades Checklist */}
          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-emerald-400" />
              <span>{locale === 'fr' ? 'Modules de Modernisation & Re-powering Circulaire' : 'Circular Re-powering & Modernization Modules'}</span>
            </h3>

            <div className="space-y-3">
              {REPOWERING_UPGRADE_OPTIONS.map((opt) => {
                const isChecked = selectedRepoweringIds.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleRepowering(opt.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-[#142624] border-emerald-500/60 shadow-md'
                        : 'bg-[#141A23] border-[#252E38] hover:bg-[#1A2330]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-400'
                              : 'border-neutral-500 bg-transparent'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="h-3.5 w-3.5 text-slate-950" />}
                        </div>
                        <span className="font-bold text-white text-xs">{opt.title[locale]}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                          +{opt.capacityGainMW * 7} MW
                        </span>
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold">
                          +{opt.efficiencyGainPercent}% η
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-300 mt-2 leading-relaxed pl-6">
                      {opt.description[locale]}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-2 pt-2 border-t border-[#1C2634] pl-6">
                      <span>Cible : <strong className="text-white">{opt.componentTargeted}</strong></span>
                      <span>Recyclabilité matière : <strong className="text-emerald-400">{opt.circularRecyclabilityPercent}%</strong></span>
                      <span>CAPEX : <strong className="text-cyan-300">{opt.capexMillionUsd} M$</strong> (Retour : {opt.paybackPeriodYears} ans)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
