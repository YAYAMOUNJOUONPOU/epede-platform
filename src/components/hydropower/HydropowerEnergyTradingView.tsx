// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 20 : TRADING ÉNERGÉTIQUE, MARCHÉS DE RÉSERVE,
// PPA DYNAMIQUES (ALUCAM) & TRAÇABILITÉ CARBONE I-REC (ARTICLE 6 PARIS)
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Coins,
  FileCheck2,
  ShieldCheck,
  Scale,
  Leaf,
  DollarSign,
  Activity,
  Flame,
  Zap,
  Layers,
  Sliders,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building,
  Globe,
  Award,
  Hash,
} from 'lucide-react';
import {
  HOURLY_MARKET_CONDITIONS_24H,
  INDUSTRIAL_PPAS_DATA,
  IREC_CERTIFICATES_DATA,
  runCoOptimizationDispatch,
} from '../../data/hydropowerEnergyTradingData';

interface HydropowerEnergyTradingViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
  onSelectSubsystem?: (subsystemId: string) => void;
}

export const HydropowerEnergyTradingView: React.FC<HydropowerEnergyTradingViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'market_dispatch' | 'industrial_ppas' | 'irec_carbon'>('market_dispatch');

  // Sub-Tab 1 Controls: Co-Optimization Dispatch
  const [selectedHour, setSelectedHour] = useState<number>(18); // Default to evening peak hour (18:00)
  const [waterOpportunityFactor, setWaterOpportunityFactor] = useState<number>(1.0);
  const [enableR1Service, setEnableR1Service] = useState<boolean>(true);
  const [enableR2AgcService, setEnableR2AgcService] = useState<boolean>(true);
  const [alucamCurtailmentActive, setAlucamCurtailmentActive] = useState<boolean>(false);

  // Sub-Tab 2 Controls: ALUCAM LME Sensitivity
  const [simulatedLmePrice, setSimulatedLmePrice] = useState<number>(2620); // USD / Ton

  // Sub-Tab 3 Controls: I-REC Certificate Focus
  const [selectedCertId, setSelectedCertId] = useState<string>('IREC-NTG-2026-Q1-001');

  // Run Co-Optimization Dispatch
  const dispatchResult = useMemo(() => {
    return runCoOptimizationDispatch(
      selectedHour,
      waterOpportunityFactor,
      enableR1Service,
      enableR2AgcService,
      alucamCurtailmentActive
    );
  }, [selectedHour, waterOpportunityFactor, enableR1Service, enableR2AgcService, alucamCurtailmentActive]);

  // Current Market Conditions for Selected Hour
  const currentMarket = useMemo(() => {
    return HOURLY_MARKET_CONDITIONS_24H.find((m) => m.hour === selectedHour) || HOURLY_MARKET_CONDITIONS_24H[18];
  }, [selectedHour]);

  // ALUCAM PPA Dynamic Calculation
  const alucamDynamic = useMemo(() => {
    const basePpa = INDUSTRIAL_PPAS_DATA[0];
    const benchmark = basePpa.lmeBenchmarkUsdTon || 2400;
    const effectivePrice = basePpa.basePriceUsdMwh * (0.65 + 0.35 * (simulatedLmePrice / benchmark));
    const annualBillingUsd = (effectivePrice * (basePpa.annualEnergyGwh * 1000));
    return {
      effectivePrice: Number(effectivePrice.toFixed(2)),
      annualBillingUsd: Number(annualBillingUsd.toFixed(0)),
    };
  }, [simulatedLmePrice]);

  // Selected I-REC Certificate
  const selectedCert = useMemo(() => {
    return (
      IREC_CERTIFICATES_DATA.find((c) => c.certificateId === selectedCertId) ||
      IREC_CERTIFICATES_DATA[0]
    );
  }, [selectedCertId]);

  // Total Annual Carbon Avoidance
  const totalAnnualCarbonMetrics = useMemo(() => {
    const totalTons = IREC_CERTIFICATES_DATA.reduce((acc, c) => acc + c.co2AvoidedTons, 0);
    const totalRevenueUsd = IREC_CERTIFICATES_DATA.reduce((acc, c) => acc + c.totalCarbonValueUsd, 0);
    const avgPrice = totalRevenueUsd / totalTons;
    return {
      totalTons,
      totalRevenueUsd,
      avgPrice: Number(avgPrice.toFixed(2)),
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0C1412] via-[#102018] to-[#0A120E] border border-emerald-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-emerald-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                {locale === 'fr'
                  ? 'ÉTAPE 20 • TRADING ÉNERGIE, PPA INDUSTRIELS & VALORISATION CARBONE'
                  : 'STEP 20 • ENERGY TRADING, INDUSTRIAL PPAS & CARBON ASSETS'}
              </span>
              <span className="text-xs font-mono text-neutral-400">PEAC MARKET RULES / ENTSO-E MARKET CODES / I-REC STANDARD / ART. 6 PARIS</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <Coins className="h-6 w-6 text-emerald-400" />
              <span>
                {locale === 'fr'
                  ? 'Arbitrage Spot Temps Réel, Marché des Services Système & Traçabilité I-REC'
                  : 'Real-Time Spot Arbitrage, Ancillary Services Market & I-REC Traceability'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Co-optimisation économique du dispatch des 7 groupes (420 MW) entre énergie active et réserves primaires R1/secondaires R2, gestion des PPA bilatéraux indexés LME (ALUCAM 170 MW) et monétisation des 1.89 million de tonnes de CO₂ évitées sous le standard I-REC et l\'Article 6 de l\'Accord de Paris.'
                : 'Economic co-optimization dispatch across 7 units (420 MW) between active energy and R1/R2 reserves, dynamic LME-indexed industrial PPAs (ALUCAM 170 MW), and monetization of 1.89 Mt avoided CO₂ under I-REC Standard & Paris Article 6.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('PEAC-MKT-01')}
                className="px-3 py-2 rounded-xl bg-[#142A1E] hover:bg-[#1D3B2B] border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>PEAC / CAPP MARKET CODE</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#1C3827]">
          <button
            type="button"
            onClick={() => setActiveSubTab('market_dispatch')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'market_dispatch'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-[#0E1A14] text-neutral-300 hover:text-white border border-[#1D3525]'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Co-Optimisation Spot & Réserves (R1/R2)' : '1. Spot & Ancillary Reserves (R1/R2)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('industrial_ppas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'industrial_ppas'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-[#0E1A14] text-neutral-300 hover:text-white border border-[#1D3525]'
            }`}
          >
            <Building className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. PPA Grands Industriels & Indexation LME' : '2. Industrial PPAs & LME Indexation'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('irec_carbon')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'irec_carbon'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-[#0E1A14] text-neutral-300 hover:text-white border border-[#1D3525]'
            }`}
          >
            <Leaf className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Registre I-REC & Crédits Carbone (Art. 6)' : '3. I-REC Registry & Carbon Credits (Art. 6)'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: SPOT CO-OPTIMIZATION & ANCILLARY RESERVES (R1 / R2)       */}
      {/* ==================================================================== */}
      {activeSubTab === 'market_dispatch' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Key Dispatch Financial & Capacity Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A100E] border border-emerald-500/40">
              <div className="text-[10px] text-neutral-400 uppercase">Puissance Turbinée Totale</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {dispatchResult.totalTurbinedMw} <span className="text-xs font-normal text-neutral-400">MW</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Sur capacité installée 420 MW (7 groupes)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Marge Nette d'Exploitation Horaire</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                ${dispatchResult.netOperatingMarginUsd.toLocaleString()}{' '}
                <span className="text-xs font-normal text-neutral-400">/h</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Soit ~{(dispatchResult.netOperatingMarginUsd * 610 / 1e6).toFixed(2)} M FCFA / heure
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Réserve Primaire R1 (FCR)</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {dispatchResult.totalR1AllocatedMw} <span className="text-xs font-normal text-neutral-400">MW</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Bande réglante active réponse sous 15 s
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Réserve Secondaire R2 (aFRR / AGC)</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                {dispatchResult.totalR2AllocatedMw} <span className="text-xs font-normal text-neutral-400">MW</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Télé-réglage automatique CNO sous 2 min
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Market Conditions & Hour Controls (4 Cols) */}
            <div className="lg:col-span-4 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Paramètres de Trading & Marché' : 'Trading & Market Settings'}</span>
                </h3>
              </div>

              {/* Slider: Selected Hour */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Heure de Dispatch (00:00 - 23:00) :' : 'Dispatch Hour (00:00 - 23:00):'}</span>
                  <span className="text-emerald-400 font-bold">{selectedHour.toString().padStart(2, '0')}:00 UTC</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="23"
                  step="1"
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[9px] text-neutral-500 mt-0.5">
                  <span>00h (Creux nocturne)</span>
                  <span>19h (Pointe soir)</span>
                  <span>23h</span>
                </div>
              </div>

              {/* Current Clearing Prices Display */}
              <div className="p-3.5 rounded-xl bg-[#0F1C15] border border-[#1E3A28] space-y-2 text-[11px]">
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Prix Spot Day-Ahead :</span>
                  <span className="text-emerald-400 font-bold">
                    ${currentMarket.spotPriceUsdMwh} / MWh ({currentMarket.spotPriceFcfaKwh} FCFA/kWh)
                  </span>
                </div>
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Demande Globale RIS :</span>
                  <span className="text-white font-bold">{currentMarket.demandForecastMw} MW</span>
                </div>
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Prix Capacité R1 (FCR) :</span>
                  <span className="text-amber-400 font-bold">${currentMarket.r1ReservePriceUsdMw} / MW·h</span>
                </div>
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Prix Capacité R2 (aFRR) :</span>
                  <span className="text-purple-300 font-bold">${currentMarket.r2ReservePriceUsdMw} / MW·h</span>
                </div>
              </div>

              {/* Water Value Multiplier Slider */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Valeur Marginale de l\'Eau (Stockage) :' : 'Water Opportunity Value Multiplier:'}</span>
                  <span className="text-cyan-300 font-bold">{waterOpportunityFactor.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.8"
                  step="0.1"
                  value={waterOpportunityFactor}
                  onChange={(e) => setWaterOpportunityFactor(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-[9px] text-neutral-500 mt-0.5">
                  <span>0.6x (Surverse Lom Pangar)</span>
                  <span>1.8x (Étiage sévère)</span>
                </div>
              </div>

              {/* Service Switches */}
              <div className="space-y-2 pt-2 border-t border-[#1D3525]">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Participation Réserve R1 :</span>
                  <button
                    type="button"
                    onClick={() => setEnableR1Service(!enableR1Service)}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      enableR1Service ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {enableR1Service ? 'ACTIVÉ (±15 MW)' : 'DÉSACTIVÉ'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Régulation AGC Réserve R2 :</span>
                  <button
                    type="button"
                    onClick={() => setEnableR2AgcService(!enableR2AgcService)}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      enableR2AgcService ? 'bg-purple-950 text-purple-300 border border-purple-600' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {enableR2AgcService ? 'AGC CNO ACTIF' : 'MANUEL'}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-neutral-300">Effacement ALUCAM (50 MW) :</span>
                  <button
                    type="button"
                    onClick={() => setAlucamCurtailmentActive(!alucamCurtailmentActive)}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      alucamCurtailmentActive ? 'bg-red-950 text-red-300 border border-red-600' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {alucamCurtailmentActive ? 'EFFACÉ (-50 MW)' : 'NOMINAL'}
                  </button>
                </div>
              </div>
            </div>

            {/* 24-Hour Price Curve & Dispatch Allocation Table (8 Cols) */}
            <div className="lg:col-span-8 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Courbe des Prix Spot & Demande 24h' : '24-Hour Spot Prices & Demand Profile'}</span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  CO-OPTIMISATION ENTSO-E / PEAC
                </span>
              </div>

              {/* 24-Hour Price SVG Curve */}
              <div className="p-4 rounded-xl bg-[#060D09] border border-[#1D3525]">
                <div className="flex justify-between text-[10px] text-neutral-400 mb-2 font-mono">
                  <span>Prix ($/MWh) & Demande (MW)</span>
                  <span className="text-emerald-400 font-bold">Heure sélectionnée : {selectedHour}h</span>
                </div>

                <svg viewBox="0 0 520 180" className="w-full h-44 select-none">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="500" y2="20" stroke="#1D3525" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="10" y="24" fill="#64748B" fontSize="8" fontFamily="monospace">$160</text>

                  <line x1="40" y1="70" x2="500" y2="70" stroke="#1D3525" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="10" y="74" fill="#64748B" fontSize="8" fontFamily="monospace">$100</text>

                  <line x1="40" y1="120" x2="500" y2="120" stroke="#1D3525" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="10" y="124" fill="#64748B" fontSize="8" fontFamily="monospace">$50</text>

                  <line x1="40" y1="150" x2="500" y2="150" stroke="#334155" strokeWidth="1" />
                  <text x="10" y="154" fill="#64748B" fontSize="8" fontFamily="monospace">$0</text>

                  {/* Spot Price Curve */}
                  {(() => {
                    const coords = HOURLY_MARKET_CONDITIONS_24H.map((pt) => {
                      const x = 40 + (pt.hour / 23) * 460;
                      const y = 150 - (pt.spotPriceUsdMwh / 160) * 130;
                      return `${x},${y}`;
                    });

                    const areaD = `M 40,150 L ${coords.join(' L ')} L 500,150 Z`;
                    const lineD = `M ${coords.join(' L ')}`;

                    return (
                      <>
                        <path d={areaD} fill="#10B981" opacity="0.15" />
                        <path d={lineD} fill="none" stroke="#10B981" strokeWidth="2.5" />
                      </>
                    );
                  })()}

                  {/* Selected Hour Marker */}
                  {(() => {
                    const xSel = 40 + (selectedHour / 23) * 460;
                    return (
                      <>
                        <line x1={xSel} y1="15" x2={xSel} y2="150" stroke="#FDE047" strokeWidth="2" strokeDasharray="3 2" />
                        <circle
                          cx={xSel}
                          cy={150 - (currentMarket.spotPriceUsdMwh / 160) * 130}
                          r="5"
                          fill="#FDE047"
                          stroke="#000"
                          strokeWidth="1.5"
                        />
                      </>
                    );
                  })()}

                  {/* Time Axis Labels */}
                  <text x="40" y="165" fill="#64748B" fontSize="8" fontFamily="monospace">00:00</text>
                  <text x="150" y="165" fill="#64748B" fontSize="8" fontFamily="monospace">06:00</text>
                  <text x="270" y="165" fill="#64748B" fontSize="8" fontFamily="monospace">12:00</text>
                  <text x="390" y="165" fill="#64748B" fontSize="8" fontFamily="monospace">18:00</text>
                  <text x="480" y="165" fill="#64748B" fontSize="8" fontFamily="monospace">23:00</text>
                </svg>
              </div>

              {/* Units Allocation Grid */}
              <div className="space-y-2">
                <div className="text-[10px] text-neutral-400 uppercase font-bold flex justify-between">
                  <span>Allocation des 7 Groupes Turbines Francis (60 MW / unité) :</span>
                  <span className="text-emerald-400">Rendement Global ~93.4%</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {dispatchResult.units.map((u) => (
                    <div
                      key={u.unitId}
                      className={`p-2.5 rounded-xl border text-center ${
                        u.operatingStatus === 'ONLINE'
                          ? 'bg-[#0E1E15] border-emerald-500/40'
                          : 'bg-[#151210] border-neutral-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] text-neutral-400 mb-0.5">
                        <span className="font-bold text-white">{u.unitId}</span>
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            u.operatingStatus === 'ONLINE' ? 'bg-emerald-400' : 'bg-neutral-600'
                          }`}
                        />
                      </div>
                      <div className="text-base font-black text-emerald-300">
                        {u.activePowerMw} <span className="text-[8px] font-normal text-neutral-400">MW</span>
                      </div>
                      <div className="text-[9px] text-neutral-400 mt-1 space-y-0.5">
                        <div>R1 : <strong className="text-amber-400">{u.r1HeadroomMw} MW</strong></div>
                        <div>R2 : <strong className="text-purple-300">{u.r2AgcHeadroomMw} MW</strong></div>
                        <div>η : <strong className="text-cyan-300">{u.efficiencyPercent}%</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: DYNAMIC INDUSTRIAL PPAS (ALUCAM / ENEO / PEAC)            */}
      {/* ==================================================================== */}
      {activeSubTab === 'industrial_ppas' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Key PPA Financial Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A100E] border border-emerald-500/40">
              <div className="text-[10px] text-neutral-400 uppercase">Capacité Contractualisée Totale</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                420.0 <span className="text-xs font-normal text-neutral-400">MW</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                100% de la puissance sous contrats fermes
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Tarif ALUCAM Indexé LME</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                ${alucamDynamic.effectivePrice}{' '}
                <span className="text-xs font-normal text-neutral-400">/ MWh</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Benchmark : $48.50/MWh pour LME à $2400/t
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Facturation Annuelle ALUCAM</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                ${(alucamDynamic.annualBillingUsd / 1e6).toFixed(1)}{' '}
                <span className="text-xs font-normal text-neutral-400">M USD</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Volume garanti : 1 450 GWh/an (170 MW ruban)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Péages Réseau SONATREL 225 kV</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                7.1 <span className="text-xs font-normal text-neutral-400">FCFA / kWh</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Wheeling charge homologué par l'ARSEL
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ALUCAM LME Sensitivity Simulator (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Building className="h-4 w-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Simulateur d\'Indexation LME ALUCAM' : 'ALUCAM LME Indexation Simulator'}</span>
                </h3>
              </div>

              {/* Slider: LME Aluminium Price */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Cours de l\'Aluminium (London Metal Exchange) :' : 'LME Aluminium Price:'}</span>
                  <span className="text-cyan-300 font-bold">${simulatedLmePrice.toLocaleString()} / Tonne</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="3400"
                  step="20"
                  value={simulatedLmePrice}
                  onChange={(e) => setSimulatedLmePrice(parseInt(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-[9px] text-neutral-500 mt-0.5">
                  <span>$2,000/t (Crise métal)</span>
                  <span>$2,400/t (Pivot)</span>
                  <span>$3,400/t (Super-cycle)</span>
                </div>
              </div>

              {/* Formula & Explanatory Box */}
              <div className="p-3.5 rounded-xl bg-[#0F1C15] border border-[#1E3A28] space-y-2 text-[11px] text-neutral-300">
                <span className="text-emerald-400 font-bold uppercase text-[10px] block">
                  Formule d'Indexation Contractuelle PPA :
                </span>
                <p className="font-mono text-xs text-white">
                  <code>P_élec = 48.50 × [0.65 + 0.35 × (LME / 2400)]</code>
                </p>
                <p className="text-[10px] text-neutral-400">
                  Cette clause partage le risque économique : quand le cours de l'aluminium monte, Nachtigal capte un surprofit ; en cas de baisse, un plancher protège l'amortissement de la dette de la centrale.
                </p>
              </div>

              {/* Demand Response Interruptibility Notice */}
              <div className="p-3.5 rounded-xl bg-[#1A160F] border border-[#3D2E1A] space-y-1.5 text-[11px] text-neutral-300">
                <span className="text-amber-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Clause d'Effacement Industriel d'Urgence :</span>
                </span>
                <p className="text-[10px] text-neutral-400">
                  En cas de baisse brutale de fréquence réseau en dessous de 49.50 Hz, l'automate de délestage déleste automatiquement 50 MW des cuves d'électrolyse en moins de 3 secondes sans endommager le bain de cryolithe, évitant le blackout national.
                </p>
              </div>
            </div>

            {/* Active PPA Contracts Table (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Portefeuille de Contrats PPA Actifs' : 'Active PPA Contracts Portfolio'}</span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  ENGAGEMENT FERME 20 ANS
                </span>
              </div>

              <div className="space-y-2.5">
                {INDUSTRIAL_PPAS_DATA.map((ppa) => (
                  <div
                    key={ppa.contractId}
                    className="p-3.5 rounded-xl bg-[#0F1C15] border border-[#1E3A28] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{ppa.offtakerName}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold border border-emerald-800">
                        {ppa.contractType.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] text-neutral-400 pt-1">
                      <div>
                        Puissance : <strong className="text-white">{ppa.contractedCapacityMw} MW</strong>
                      </div>
                      <div>
                        Tarif : <strong className="text-cyan-300">${ppa.effectivePriceUsdMwh}/MWh</strong>
                      </div>
                      <div>
                        Volume : <strong className="text-amber-400">{ppa.annualEnergyGwh} GWh/an</strong>
                      </div>
                    </div>

                    <div className="text-[9px] text-neutral-500 pt-0.5 border-t border-[#1C3827] flex justify-between">
                      <span>Indexation : {ppa.indexationFormula}</span>
                      <span>Transit : {ppa.wheelingTariffFcfaKwh} FCFA/kWh</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: I-REC CARBON REGISTRY & ARTICLE 6 (ACCORD DE PARIS)       */}
      {/* ==================================================================== */}
      {activeSubTab === 'irec_carbon' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Key Carbon Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A100E] border border-emerald-500/40">
              <div className="text-[10px] text-neutral-400 uppercase">Émissions de CO₂ Évitées / An</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {(totalAnnualCarbonMetrics.totalTons / 1e6).toFixed(2)}{' '}
                <span className="text-xs font-normal text-neutral-400">Mt CO₂</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Facteur de déplacement : 650 g CO₂/kWh (Fuel/Gaz)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Valorisation d'Actifs Carbone</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                ${(totalAnnualCarbonMetrics.totalRevenueUsd / 1e6).toFixed(1)}{' '}
                <span className="text-xs font-normal text-neutral-400">M USD/an</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Prix moyen pondéré : ${totalAnnualCarbonMetrics.avgPrice} / tonne
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Volume Émis Certifié I-REC</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                2 910 <span className="text-xs font-normal text-neutral-400">GWh</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                100% énergie renouvelable hydroélectrique pure
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Conformité MACF / CBAM Europe</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                ZÉRO TAXE <span className="text-xs font-normal text-neutral-400">Frontière</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">
                Aluminium bas-carbone &lt; 4 t CO₂/t Al (vs 14 t moyen)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Certificate Batches Explorer (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-3">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 pb-2 border-b border-[#1D3525]">
                <Award className="h-4 w-4 text-emerald-400" />
                <span>{locale === 'fr' ? 'Lots de Certificats I-REC 2026' : '2026 I-REC Vintage Batches'}</span>
              </h3>

              <div className="space-y-2">
                {IREC_CERTIFICATES_DATA.map((cert) => (
                  <button
                    key={cert.certificateId}
                    type="button"
                    onClick={() => setSelectedCertId(cert.certificateId)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      selectedCertId === cert.certificateId
                        ? 'bg-[#122A1E] border-emerald-500 shadow-md shadow-emerald-950/40'
                        : 'bg-[#0E1A14] border-[#1D3525] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-xs">{cert.issuancePeriod}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold border border-emerald-800">
                        {cert.registryStandard.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-neutral-400">
                      <span>Volume : <strong>{(cert.volumeMwh / 1000).toLocaleString()} GWh</strong></span>
                      <span>Évité : <strong className="text-emerald-300">{cert.co2AvoidedTons.toLocaleString()} t</strong></span>
                      <span>Valeur : <strong className="text-amber-400">${(cert.totalCarbonValueUsd / 1e6).toFixed(2)}M</strong></span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Explanatory Box: Zero Double-Counting Guarantee */}
              <div className="p-3 rounded-xl bg-[#0F1C15] border border-[#1E3A28] space-y-1 text-[10px] text-neutral-300">
                <span className="text-emerald-400 font-bold uppercase block">Garantie d'Unicité & Registre Décentralisé :</span>
                <p>
                  Chaque MWh produit par les générateurs de Nachtigal est horodaté par les compteurs fiscaux ION9000, signé cryptographiquement et inscrit au registre I-REC pour empêcher tout double comptage entre le Cameroun et les acheteurs internationaux.
                </p>
              </div>
            </div>

            {/* Selected Certificate Deep-Dive & Blockchain Verification (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Détails du Lot & Certificat d\'Origine' : 'Batch Details & Origin Certificate'}</span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  {selectedCert.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Detailed Breakdown Card */}
              <div className="p-4 rounded-xl bg-[#0F1C15] border border-[#1E3A28] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 uppercase text-[10px]">Identifiant Unique du Certificat :</span>
                  <span className="text-white font-mono font-bold text-xs">{selectedCert.certificateId}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] pt-1">
                  <div className="p-2.5 rounded-lg bg-[#14261C] border border-[#21422F]">
                    <div className="text-neutral-400 uppercase text-[9px]">Bénéficiaire / Offtaker</div>
                    <div className="text-white font-bold mt-0.5">{selectedCert.offtakerClient}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#14261C] border border-[#21422F]">
                    <div className="text-neutral-400 uppercase text-[9px]">Prix de Cession Carbone</div>
                    <div className="text-emerald-400 font-bold mt-0.5">${selectedCert.unitPriceUsdTonCo2} / tonne</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#14261C] border border-[#21422F]">
                    <div className="text-neutral-400 uppercase text-[9px]">Recettes Générées</div>
                    <div className="text-amber-400 font-bold mt-0.5">${selectedCert.totalCarbonValueUsd.toLocaleString()}</div>
                  </div>
                </div>

                {/* Blockchain Proof of Provenance */}
                <div className="p-3 rounded-lg bg-[#0A120E] border border-[#1D3525] space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase font-bold">
                    <Hash className="h-3 w-3 text-emerald-400" />
                    <span>Empreinte Cryptographique d'Audit (Proof of Clean Generation) :</span>
                  </div>
                  <div className="text-emerald-300 font-mono text-[10px] break-all">
                    {selectedCert.blockchainVerificationTx}
                  </div>
                </div>
              </div>

              {/* Article 6 of Paris Agreement Context Note */}
              <div className="p-4 rounded-xl bg-[#0F1C15] border border-[#1E3A28] space-y-2 text-[11px] text-neutral-300">
                <span className="text-cyan-300 font-bold uppercase text-[10px] block">
                  {locale === 'fr' ? 'Mécanisme de Transfert ITMO (Article 6.2 Accord de Paris) :' : 'Article 6.2 ITMO Transfer Framework:'}
                </span>
                <p>
                  Dans le cadre de l'interconnexion régionale PEAC Cameroun-Tchad, les crédits carbone générés par l'énergie hydroélectrique de Nachtigal sont transférés sous forme de Résultats d'Atténuation Transférés au Niveau International (ITMO) avec ajustements correspondants (Corresponding Adjustments), évitant le double comptage dans les Contributions Déterminées au Niveau National (CDN).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
