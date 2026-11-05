// src/components/grid/modules/CameroonSeasonalReliabilityWorkbench.tsx
// Authoritative Engineering Reference & Interactive Dashboard:
// "CAMEROON ELECTRICITY — SEASONAL PERFORMANCE MONITOR, HYDROLOGICAL VARIATIONS & POWER SUPPLY RELIABILITY"

import React, { useState, useEffect } from 'react';
import {
  CAMEROON_HYDROLOGICAL_BASINS,
  CAMEROON_HYDRO_SEASONAL_PROFILES,
  CAMEROON_MONTHLY_GRID_CALENDAR,
  CAMEROON_DAILY_DEMAND_CURVE_24H,
  CAMEROON_SEASONAL_CASE_STUDIES,
} from '../../../data/cameroonSeasonalHydrologyData';
import {
  Waves,
  CloudRain,
  Sun,
  Flame,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Gauge,
  Calendar,
  Clock,
  BookOpen,
  ShieldAlert,
  ArrowDown,
  Info,
} from 'lucide-react';

export type SeasonalSubTab =
  | 'seasonal_monitor'
  | 'hydrological_basins'
  | 'hydro_physics_lom_pangar'
  | 'plant_profiles'
  | 'daily_demand_outages'
  | 'drought_case_studies';

interface CameroonSeasonalReliabilityWorkbenchProps {
  locale: 'fr' | 'en';
  initialPlantId?: string;
}

export const CameroonSeasonalReliabilityWorkbench: React.FC<CameroonSeasonalReliabilityWorkbenchProps> = ({
  locale,
  initialPlantId,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SeasonalSubTab>(
    initialPlantId ? 'plant_profiles' : 'seasonal_monitor'
  );
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(2); // Default Feb (Dry season contrast)
  const [selectedPlantId, setSelectedPlantId] = useState<string>(
    initialPlantId || 'plant-nachtigal'
  );

  // Interactive P = rho * g * Q * H * eta calculator state
  const [calcFlowQ, setCalcFlowQ] = useState<number>(850);
  const [calcHeadH, setCalcHeadH] = useState<number>(51.5);
  const [calcEfficiency, setCalcEfficiency] = useState<number>(91);

  // Interactive 24-hour Available Generation Ceiling slider (MW)
  const [availableGenCeilingMw, setAvailableGenCeilingMw] = useState<number>(1200);

  // Selected Case Study
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string>('cs-3-evening-peak');

  useEffect(() => {
    if (initialPlantId) {
      setSelectedPlantId(initialPlantId);
      setActiveSubTab('plant_profiles');
    }
  }, [initialPlantId]);

  const activeMonth =
    CAMEROON_MONTHLY_GRID_CALENDAR.find((m) => m.monthIndex === selectedMonthIndex) ||
    CAMEROON_MONTHLY_GRID_CALENDAR[1];

  const activePlantProfile =
    CAMEROON_HYDRO_SEASONAL_PROFILES.find((p) => p.plantId === selectedPlantId) ||
    CAMEROON_HYDRO_SEASONAL_PROFILES[0];

  const activeCaseStudy =
    CAMEROON_SEASONAL_CASE_STUDIES.find((c) => c.id === selectedCaseStudyId) ||
    CAMEROON_SEASONAL_CASE_STUDIES[2];

  // Fundamental hydraulic formula: P (MW) = (1000 * 9.81 * Q * H * (eta/100)) / 1e6
  const computedHydraulicPowerMw =
    (1000 * 9.81 * calcFlowQ * calcHeadH * (calcEfficiency / 100)) / 1_000_000;

  const eveningBalanceMw =
    activeMonth.totalEveningAvailableMw - activeMonth.eveningPeakDemandMw;

  return (
    <div className="space-y-6">
      {/* Master Header Banner */}
      <div className="bg-[#151C1E] border border-cyan-500/40 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#252E38] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 font-bold">
              <CloudRain className="w-4 h-4" />
              <span>
                {locale === 'fr'
                  ? 'OBSERVATOIRE HYDRO-ÉNERGÉTIQUE · VARIATIONS SAISONNIÈRES & FIABILITÉ D’ALIMENTATION'
                  : 'SEASONAL GENERATION, HYDROLOGICAL VARIATIONS & POWER SUPPLY RELIABILITY'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-mono font-black text-white mt-1">
              {locale === 'fr'
                ? 'Comportement Saisonnier du Réseau Électrique Camerounais (Janvier – Décembre)'
                : 'Cameroon Electricity — Seasonal Performance Monitor & Hydrological Analysis'}
            </h2>
            <p className="text-xs text-[#A9ADA5] mt-1 max-w-4xl leading-relaxed">
              {locale === 'fr'
                ? 'Analyse technique approfondie de la chaîne Pluviométrie ➔ Débits des bassins (Sanaga, Bénoué, Ntem) ➔ Régulation Lom Pangar ➔ Puissance disponible ➔ Pointe du soir (18h–22h) ➔ Contraintes de transport/distribution et délestages.'
                : 'Research-based engineering reference linking Catchment Rainfall ➔ River Inflows (Sanaga, Benue, Ntem) ➔ Lom Pangar Regulation ➔ Available Capacity ➔ Evening Peak Demand (18:00–22:00) ➔ Grid Constraints & Load Shedding.'}
            </p>
          </div>

          <div className="bg-[#0B0F12] border border-amber-500/40 rounded-xl p-3 max-w-xs shrink-0">
            <div className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>
                {locale === 'fr' ? 'Rigueur & Traçabilité des Données' : 'Strict Data Provenance Rule'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              {locale === 'fr'
                ? 'Distinction stricte entre MW (puissance) et MWh/GWh (énergie), et entre données historiques publiées (SONATREL/Eneo/EDC/ARSEL) et profils saisonniers illustratifs.'
                : 'Strictly distinguishes MW (power) from MWh/GWh (energy), and verified operator records from labeled illustrative engineering profiles.'}
            </p>
          </div>
        </div>

        {/* 6 Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            {
              id: 'seasonal_monitor',
              labelFr: '1. Moniteur Saisonnier (Jan–Déc)',
              labelEn: '1. Seasonal Performance Monitor (Jan–Dec)',
            },
            {
              id: 'hydrological_basins',
              labelFr: '2. Saisons & Bassins Versants (Sanaga/Bénoué/Ntem)',
              labelEn: '2. Hydrological Basins & Rainfall Regimes',
            },
            {
              id: 'hydro_physics_lom_pangar',
              labelFr: '3. Physique P=ρgQHη, Lom Pangar & Limites de Crue',
              labelEn: '3. P=ρgQHη Physics, Lom Pangar & Flood Limits',
            },
            {
              id: 'plant_profiles',
              labelFr: '4. Profils Saisonniers par Centrale (5 Barrages)',
              labelEn: '4. Plant Seasonal Profiles (Nachtigal to Lagdo)',
            },
            {
              id: 'daily_demand_outages',
              labelFr: '5. Courbe 24h, Pointe du Soir & Causes de Coupures',
              labelEn: '5. 24h Demand Curve, Evening Peak & Outage Causes',
            },
            {
              id: 'drought_case_studies',
              labelFr: '6. Sécheresse Hydrologique & 6 Cas d’Étude',
              labelEn: '6. Hydrological Drought & 6 Case Studies',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as SeasonalSubTab)}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-[#0B0F12] text-slate-400 hover:text-white border border-[#252E38]'
              }`}
            >
              {locale === 'fr' ? tab.labelFr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────
          TAB 1: CAMEROON ELECTRICITY — SEASONAL PERFORMANCE MONITOR (JAN–DEC)
         ─────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'seasonal_monitor' && (
        <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#252E38] pb-4">
            <div>
              <span className="font-mono text-xs uppercase text-cyan-400 font-bold">
                CAMEROON ELECTRICITY — SEASONAL PERFORMANCE MONITOR
              </span>
              <h3 className="font-mono text-lg font-black text-white mt-0.5">
                {locale === 'fr'
                  ? 'Sélecteur Mensuel Interactif (Janvier à Décembre) & Équilibre Production–Demande'
                  : 'Interactive Monthly Selector (January to December) & Generation–Demand Balance'}
              </h3>
            </div>
            <span className="px-3 py-1 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold">
              {locale === 'fr'
                ? 'Source : Synthèse Hydrologique EDC / Eneo / SONATREL (Profil Référence 2025–2026)'
                : 'Source: EDC / Eneo / SONATREL Hydrological Synthesis (2025–2026 Reference Profile)'}
            </span>
          </div>

          {/* 12-Month Selector Strip */}
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
            {CAMEROON_MONTHLY_GRID_CALENDAR.map((m) => {
              const isSelected = m.monthIndex === selectedMonthIndex;
              const badgeColor =
                m.seasonCategory === 'HIGH_WATER'
                  ? 'border-cyan-500/50 text-cyan-300'
                  : m.seasonCategory === 'LOW_WATER'
                  ? 'border-amber-500/50 text-amber-300'
                  : 'border-purple-500/50 text-purple-300';
              return (
                <button
                  key={m.monthIndex}
                  type="button"
                  onClick={() => setSelectedMonthIndex(m.monthIndex)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-600 border-cyan-300 text-white shadow-lg scale-105'
                      : `bg-[#0B0F12] ${badgeColor} hover:bg-slate-800`
                  }`}
                >
                  <div className="font-mono text-xs font-black">
                    {locale === 'fr' ? m.monthNameFr.slice(0, 4) : m.monthNameEn.slice(0, 3)}
                  </div>
                  <div className="font-mono text-[10px] opacity-80 mt-0.5">
                    {m.sanagaNaturalFlowM3s} m³/s
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Month Detailed Telemetry Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Column 1: Basin Hydrology */}
            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
                <h4 className="font-mono text-xs font-black uppercase text-cyan-400">
                  {locale === 'fr' ? '1. État Hydrologique des Bassins' : '1. Basin Hydrological Conditions'}
                </h4>
                <span className="font-mono text-xs font-bold text-white">
                  {locale === 'fr' ? activeMonth.monthNameFr : activeMonth.monthNameEn}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-[#151C1E] border border-[#252E38]">
                  <div className="flex justify-between font-mono font-bold text-cyan-300 mb-1">
                    <span>Fleuve Sanaga (RIS)</span>
                    <span>
                      Nat: {activeMonth.sanagaNaturalFlowM3s} ➔ Rég: {activeMonth.sanagaRegulatedFlowM3s} m³/s
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    {locale === 'fr' ? activeMonth.sanagaHydrologyFr : activeMonth.sanagaHydrologyEn}
                  </p>
                </div>

                <div className="p-2.5 rounded bg-[#151C1E] border border-[#252E38]">
                  <div className="flex justify-between font-mono font-bold text-amber-300 mb-1">
                    <span>Fleuve Bénoué / Lagdo (RIN)</span>
                    <span>Remplissage : ~{activeMonth.lagdoFillPercent}%</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    {locale === 'fr' ? activeMonth.benueHydrologyFr : activeMonth.benueHydrologyEn}
                  </p>
                </div>

                <div className="p-2.5 rounded bg-[#151C1E] border border-[#252E38]">
                  <div className="flex justify-between font-mono font-bold text-emerald-300 mb-1">
                    <span>Fleuve Ntem / Memve’ele (Sud)</span>
                    <span>Lom Pangar : ~{activeMonth.lomPangarFillPercent}%</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    {locale === 'fr' ? activeMonth.ntemHydrologyFr : activeMonth.ntemHydrologyEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Available Generation Mix vs Demand */}
            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
                <h4 className="font-mono text-xs font-black uppercase text-emerald-400">
                  {locale === 'fr'
                    ? '2. Puissance Disponible vs Pointe du Soir'
                    : '2. Available Generation vs. Evening Peak'}
                </h4>
                <span className="font-mono text-xs font-bold text-emerald-400">RIS + RIN</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-2.5 rounded bg-[#151C1E] border border-cyan-500/30">
                  <span className="block font-mono text-[10px] text-slate-400 uppercase">
                    Hydro Disponible
                  </span>
                  <span className="font-mono text-base font-black text-cyan-400">
                    {activeMonth.hydroAvailableMw} MW
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#151C1E] border border-amber-500/30">
                  <span className="block font-mono text-[10px] text-slate-400 uppercase">
                    Thermique Gaz + HFO
                  </span>
                  <span className="font-mono text-base font-black text-amber-400">
                    {activeMonth.thermalAvailableMw} MW
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#151C1E] border border-yellow-500/30">
                  <span className="block font-mono text-[10px] text-slate-400 uppercase">
                    Solaire PV (12h00)
                  </span>
                  <span className="font-mono text-base font-black text-yellow-300">
                    {activeMonth.solarDaytimeMw} MW
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#151C1E] border border-rose-500/30">
                  <span className="block font-mono text-[10px] text-slate-400 uppercase">
                    Pointe Soir (19h30)
                  </span>
                  <span className="font-mono text-base font-black text-rose-400">
                    {activeMonth.eveningPeakDemandMw} MW
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38] flex items-center justify-between">
                <span className="font-mono text-xs text-slate-300">
                  {locale === 'fr'
                    ? 'Marge de Réserve Brute (19h30) :'
                    : 'Gross Spinning Margin (19:30):'}
                </span>
                <span
                  className={`font-mono text-sm font-black ${
                    eveningBalanceMw >= 150 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  +{eveningBalanceMw} MW (Post-Nachtigal)
                </span>
              </div>
            </div>

            {/* Column 3: Operational Constraints & Historical Multi-Year Context */}
            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <h4 className="font-mono text-xs font-black uppercase text-amber-400 border-b border-[#252E38] pb-2">
                  {locale === 'fr'
                    ? '3. Diagnostic d’Exploitation du Mois'
                    : '3. Monthly Operational Diagnostic'}
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-[#151C1E] p-3 rounded-lg border border-[#252E38]">
                  {locale === 'fr'
                    ? activeMonth.operationalRiskFr
                    : activeMonth.operationalRiskEn}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#252E38]">
                <div className="font-mono text-[10px] uppercase text-sky-400 font-bold">
                  {locale === 'fr'
                    ? 'Évolution Pluriannuelle Vérifiée (2022 ➔ 2025)'
                    : 'Verified Multi-Year Evolution (2022 ➔ 2025)'}
                </div>
                <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>2022 (Pré-Nachtigal / Ligne Memve’ele partielle) :</span>
                    <strong className="text-rose-400">~1 520 MW inst.</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>2023 (+Memve’ele 211 MW + Solaire RIN 30 MWp) :</span>
                    <strong className="text-amber-400">~1 660 MW inst.</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>2024–2025 (+Nachtigal 7×60 = 420 MW) :</span>
                    <strong className="text-emerald-400">~2 084 MW inst.</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          TAB 2: CAMEROON HYDROLOGICAL SEASONS & CATCHMENT BASINS (SECTION 2)
         ─────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'hydrological_basins' && (
        <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-[#252E38] pb-4">
            <span className="font-mono text-xs uppercase text-cyan-400 font-bold">
              {locale === 'fr'
                ? 'DIFFÉRENCIATION SPATIALE DES BASSINS VERSANTS CAMEROUNAIS'
                : 'REGIONAL CATCHMENT BASINS vs. LOCAL CITY RAINFALL'}
            </span>
            <h3 className="font-mono text-lg font-black text-white mt-1">
              {locale === 'fr'
                ? 'Pourquoi la pluie dans une ville (ex: Douala) ne détermine pas l’eau disponible à Nachtigal ou Lagdo'
                : 'Why Rainfall in a City (e.g., Douala) Does Not Determine Water Inflow at Nachtigal or Lagdo'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAMEROON_HYDROLOGICAL_BASINS.map((basin) => (
              <div
                key={basin.id}
                className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/40 font-mono text-[10px] font-bold text-cyan-300">
                      {basin.annualRainfallMm}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {basin.regionsCovered.join(' · ')}
                    </span>
                  </div>
                  <h4 className="font-mono text-sm font-black text-white">
                    {locale === 'fr' ? basin.nameFr : basin.nameEn}
                  </h4>
                  <p className="text-xs font-mono text-emerald-400">
                    {locale === 'fr' ? basin.climateTypeFr : basin.climateTypeEn}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded bg-[#151C1E] border border-[#252E38]">
                      <strong className="text-cyan-300 block font-mono">
                        {locale === 'fr' ? 'Saison des Pluies :' : 'Rainy Season:'}
                      </strong>
                      <span className="text-slate-300">
                        {locale === 'fr' ? basin.rainySeasonMonthsFr : basin.rainySeasonMonthsEn}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-[#151C1E] border border-[#252E38]">
                      <strong className="text-amber-300 block font-mono">
                        {locale === 'fr' ? 'Saison Sèche (Étiage) :' : 'Dry Season:'}
                      </strong>
                      <span className="text-slate-300">
                        {locale === 'fr' ? basin.drySeasonMonthsFr : basin.drySeasonMonthsEn}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#252E38]">
                  <div className="text-[11px] font-mono text-slate-300">
                    <strong className="text-white">
                      {locale === 'fr' ? 'Centrales associées : ' : 'Associated Hydro Plants: '}
                    </strong>
                    {basin.associatedHydroPlants.join(', ')}
                  </div>
                  <p className="text-xs text-amber-200/90 bg-amber-950/20 border border-amber-500/30 p-3 rounded-lg leading-relaxed">
                    {locale === 'fr'
                      ? basin.catchmentMisconceptionNoteFr
                      : basin.catchmentMisconceptionNoteEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          TAB 3: HYDROPOWER PHYSICS P=ρgQHη, LOM PANGAR & FLOOD LIMITS (SECTIONS 3, 5, 8)
         ─────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'hydro_physics_lom_pangar' && (
        <div className="space-y-6">
          {/* Interactive P = rho * g * Q * H * eta Solver & Lom Pangar Distinction */}
          <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 shadow-xl">
            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 space-y-4">
              <div className="border-b border-[#252E38] pb-3">
                <span className="font-mono text-xs uppercase text-cyan-400 font-bold">
                  {locale === 'fr'
                    ? 'LOI FONDAMENTALE DE CONVERSION HYDROÉLECTRIQUE'
                    : 'FUNDAMENTAL HYDROELECTRIC CONVERSION EQUATION'}
                </span>
                <h3 className="font-mono text-base font-black text-white mt-1">
                  P = ρ × g × Q × H × η
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300">
                      {locale === 'fr'
                        ? 'Débit turbiné Q (m³/s) :'
                        : 'Turbine Water Discharge Q (m³/s):'}
                    </span>
                    <span className="text-cyan-400 font-bold">{calcFlowQ} m³/s</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={1200}
                    step={10}
                    value={calcFlowQ}
                    onChange={(e) => setCalcFlowQ(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300">
                      {locale === 'fr'
                        ? 'Hauteur de chute nette H (m) :'
                        : 'Net Hydraulic Head H (m):'}
                    </span>
                    <span className="text-amber-400 font-bold">{calcHeadH} m</span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={55}
                    step={0.5}
                    value={calcHeadH}
                    onChange={(e) => setCalcHeadH(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { label: 'Nachtigal (980 m³/s, 51.5 m)', q: 980, h: 51.5 },
                    { label: 'Songloulou (1100 m³/s, 39.5 m)', q: 1100, h: 39.5 },
                    { label: 'Édéa (1200 m³/s, 24 m)', q: 1200, h: 24.0 },
                    { label: 'Memve’ele (600 m³/s, 35 m)', q: 600, h: 35.0 },
                    { label: 'Lagdo Nominal (350 m³/s, 22 m)', q: 350, h: 22.0 },
                    { label: 'Lagdo Étiage (160 m³/s, 17 m)', q: 160, h: 17.0 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setCalcFlowQ(preset.q);
                        setCalcHeadH(preset.h);
                      }}
                      className="px-2 py-1 rounded bg-[#151C1E] hover:bg-cyan-950/60 border border-[#252E38] text-[10px] font-mono text-slate-300 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 flex items-center justify-between">
                <div>
                  <span className="block font-mono text-[10px] uppercase text-cyan-300">
                    {locale === 'fr'
                      ? 'Puissance Électrique Calculée (ρ=1000, g=9,81, η=91%)'
                      : 'Calculated Electrical Power Output (ρ=1000, g=9.81, η=91%)'}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    P = 1000 × 9.81 × {calcFlowQ} × {calcHeadH} × 0.91
                  </span>
                </div>
                <span className="font-mono text-2xl font-black text-white">
                  {computedHydraulicPowerMw.toFixed(1)} MW
                </span>
              </div>
            </div>

            {/* Section 5: Lom Pangar Hydraulic Regulation vs Electrical Connection */}
            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 space-y-4">
              <div className="border-b border-[#252E38] pb-3">
                <span className="font-mono text-xs uppercase text-emerald-400 font-bold">
                  {locale === 'fr'
                    ? 'RÔLE EXACT DU BARRAGE DE LOM PANGAR (6 MILLIARDS DE M³)'
                    : 'LOM PANGAR RESERVOIR (6 BILLION M³): HYDRAULIC vs. ELECTRICAL ROLE'}
                </span>
                <h3 className="font-mono text-base font-black text-white mt-1">
                  {locale === 'fr'
                    ? 'Régulation Hydraulique de la Sanaga vs Évacuation Électrique 90 kV Est'
                    : 'Sanaga River Water Regulation vs. 90 kV East Region Power Evacuation'}
                </h3>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <div className="p-3 rounded-lg bg-[#151C1E] border border-cyan-500/30">
                  <strong className="text-cyan-300 block font-mono mb-1">
                    1. Chaîne Hydraulique (Eau dans le lit du fleuve Sanaga) :
                  </strong>
                  Réservoir de Lom Pangar (6,0 Gm³ sur la rivière Lom) ➔ Lâchers d’eau régulés en saison sèche (janvier–mai) dans le lit naturel de la Sanaga ➔ Maintien d’un débit &gt; 900–1 040 m³/s à 400+ km en aval ➔ Sécurisation du turbinage de Nachtigal (420 MW), Songloulou (384 MW) et Édéa (276 MW).
                </div>

                <div className="p-3 rounded-lg bg-[#151C1E] border border-amber-500/30">
                  <strong className="text-amber-300 block font-mono mb-1">
                    2. Chaîne Électrique (Usine de pied de 30 MW — 4 × 7,5 MW Kaplan) :
                  </strong>
                  Lom Pangar ne possède PAS de ligne électrique directe alimentant Songloulou ou Édéa ! Son usine hydroélectrique de pied (30 MW) évacue son électricité via une ligne 90 kV de 105 km vers le poste de Bertoua pour électrifier la Région de l’Est.
                </div>
              </div>
            </div>
          </div>

          {/* Section 8: 8 Reasons Why Heavy Rainfall Does NOT Automatically Mean Maximum Electricity Production */}
          <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-mono text-base font-black uppercase text-amber-400">
              {locale === 'fr'
                ? '8 Raisons Techniques pour lesquelles de Fortes Pluies ne Signifient PAS Automatiquement une Production Maximale'
                : '8 Engineering Reasons Why Heavy Rainfall Does NOT Automatically Mean Maximum Power Output'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                {
                  title: 'A. Décalage Spatial du Bassin',
                  desc: 'Il peut pleuvoir abondamment à Douala ou Yaoundé alors que le haut-bassin de l’Adamaoua (qui alimente la Sanaga) ou de la Bénoué (Lagdo) est sec.',
                },
                {
                  title: 'B. Temps de Réponse & Infiltration',
                  desc: 'En début de saison des pluies, les sols asséchés et les nappes phréatiques absorbent l’eau avant que le ruissellement ne fasse monter le débit des fleuves.',
                },
                {
                  title: 'C. Consigne de Stockage (Remplissage)',
                  desc: 'À Lagdo ou Lom Pangar, l’eau de la saison des pluies doit être stockée dans le réservoir pour préparer la saison sèche suivante plutôt que turbinée à perte.',
                },
                {
                  title: 'D. Plafond Physique des Turbines',
                  desc: 'Une turbine Francis de 60 MW (Nachtigal) ou 48 MW (Songloulou) ne peut jamais dépasser son débit d’équipement maximal ni la puissance nominale de son alternateur.',
                },
                {
                  title: 'E. Remontée Aval & Perte de Chute',
                  desc: 'En forte crue, le niveau du canal de fuite aval remonte plus vite que la retenue amont, réduisant la hauteur de chute nette H = Z_amont - Z_aval.',
                },
                {
                  title: 'F. Dégrillage & Maintenance Groupes',
                  desc: 'Les crues charrient troncs d’arbres et jacinthes d’eau qui colmatent les grilles de prise d’eau, ou un groupe peut être à l’arrêt pour révision.',
                },
                {
                  title: 'G. Goulots de Transport HTB',
                  desc: 'Même si la centrale peut produire 100%, une contrainte sur une ligne 225/90 kV ou un poste récepteur peut limiter l’évacuation de la puissance.',
                },
                {
                  title: 'H. Ouverture des Évacuateurs de Crue',
                  desc: 'Lorsque Q_fleuve > Q_équipement (ex: 4 500 m³/s en octobre sur la Sanaga), l’excédent est déversé par les vannes de crue sans traverser les turbines (0 MW supplémentaire).',
                },
              ].map((factor) => (
                <div
                  key={factor.title}
                  className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-3.5 space-y-1.5"
                >
                  <div className="font-mono font-bold text-white">{factor.title}</div>
                  <p className="text-slate-300 leading-relaxed">{factor.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          TAB 4: INDIVIDUAL HYDRO PLANT SEASONAL PROFILES (SECTION 4)
         ─────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'plant_profiles' && (
        <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#252E38] pb-4">
            <div>
              <span className="font-mono text-xs uppercase text-cyan-400 font-bold">
                {locale === 'fr'
                  ? 'PROFILS D’EXPLOITATION SAISONNIERS PAR AMÉNAGEMENT HYDROÉLECTRIQUE'
                  : 'PLANT-SPECIFIC SEASONAL OPERATING PROFILES (JAN – DEC)'}
              </span>
              <h3 className="font-mono text-lg font-black text-white mt-1">
                {locale === 'fr' ? activePlantProfile.nameFr : activePlantProfile.nameEn}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {CAMEROON_HYDRO_SEASONAL_PROFILES.map((p) => (
                <button
                  key={p.plantId}
                  type="button"
                  onClick={() => setSelectedPlantId(p.plantId)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    selectedPlantId === p.plantId
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-[#0B0F12] text-slate-400 hover:text-white border border-[#252E38]'
                  }`}
                >
                  {p.code} ({p.installedCapacityMw} MW)
                </button>
              ))}
            </div>
          </div>

          {/* Plant Specs + Wet vs Dry Season Behaviour */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-4 space-y-2.5 text-xs">
              <div className="font-mono font-bold text-amber-400 uppercase">
                {locale === 'fr' ? 'Caractéristiques & Régulation' : 'Technical & Regulation Specs'}
              </div>
              <div className="flex justify-between border-b border-[#252E38] py-1">
                <span className="text-slate-400">Puissance installée :</span>
                <strong className="text-white font-mono">{activePlantProfile.installedCapacityMw} MW ({activePlantProfile.unitsConfiguration})</strong>
              </div>
              <div className="flex justify-between border-b border-[#252E38] py-1">
                <span className="text-slate-400">Chute / Débit nominal :</span>
                <strong className="text-cyan-300 font-mono">{activePlantProfile.nominalHeadMeters} m / {activePlantProfile.designDischargeM3s} m³/s</strong>
              </div>
              <div className="pt-1 text-slate-300 leading-relaxed">
                <strong className="text-white block font-mono mb-0.5">Type de régulation :</strong>
                {locale === 'fr' ? activePlantProfile.regulationTypeFr : activePlantProfile.regulationTypeEn}
              </div>
            </div>

            <div className="bg-[#0B0F12] border border-cyan-500/30 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-mono font-bold text-cyan-400 uppercase">
                {locale === 'fr' ? 'Comportement en Saison des Pluies (Hautes Eaux)' : 'Wet-Season Operating Behaviour'}
              </div>
              <p className="text-slate-200 leading-relaxed">
                {locale === 'fr' ? activePlantProfile.wetSeasonBehaviourFr : activePlantProfile.wetSeasonBehaviourEn}
              </p>
            </div>

            <div className="bg-[#0B0F12] border border-amber-500/30 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-mono font-bold text-amber-400 uppercase">
                {locale === 'fr' ? 'Comportement en Saison Sèche (Étiage)' : 'Dry-Season Operating Behaviour'}
              </div>
              <p className="text-slate-200 leading-relaxed">
                {locale === 'fr' ? activePlantProfile.drySeasonBehaviourFr : activePlantProfile.drySeasonBehaviourEn}
              </p>
            </div>
          </div>

          {/* Data Availability & Provenance Banner */}
          <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-mono uppercase text-amber-300 mr-2">
                [{activePlantProfile.provenanceTier}]
              </strong>
              <span>
                {locale === 'fr'
                  ? activePlantProfile.dataAvailabilityNoticeFr
                  : activePlantProfile.dataAvailabilityNoticeEn}
              </span>
            </div>
          </div>

          {/* 12-Month Plant Seasonal Table & Visual Bars */}
          <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-4 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#252E38] text-slate-400 text-[11px]">
                  <th className="py-2 px-2">Mois</th>
                  <th className="py-2 px-2">Débit Naturel (m³/s)</th>
                  <th className="py-2 px-2">Débit Régulé/Turbiné (m³/s)</th>
                  <th className="py-2 px-2">Chute H (m)</th>
                  <th className="py-2 px-2">Puissance Dispo (MW)</th>
                  <th className="py-2 px-2">Puissance Moy. Illustr. (MW)</th>
                  <th className="py-2 px-2">Énergie Mensuelle Illustr. (GWh)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252E38]/60">
                {activePlantProfile.monthlyProfile.map((pt) => (
                  <tr key={pt.monthIndex} className="hover:bg-[#151C1E]">
                    <td className="py-2 px-2 font-bold text-white">
                      {locale === 'fr' ? pt.monthShortFr : pt.monthShortEn}
                    </td>
                    <td className="py-2 px-2 text-slate-300">{pt.naturalInflowM3s}</td>
                    <td className="py-2 px-2 text-cyan-300 font-bold">{pt.regulatedOrTurbinedFlowM3s}</td>
                    <td className="py-2 px-2 text-slate-300">{pt.netHeadMeters}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold w-14">
                          {pt.availableCapacityMw} MW
                        </span>
                        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${Math.round(
                                (pt.availableCapacityMw / activePlantProfile.installedCapacityMw) *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-amber-300">{pt.illustrativeAvgOutputMw} MW</td>
                    <td className="py-2 px-2 text-sky-300 font-bold">{pt.illustrativeEnergyGwh} GWh</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          TAB 5: 24-HOUR DEMAND CURVE, EVENING PEAK DEFICIT & OUTAGES (SECTIONS 6, 7, 9, 10)
         ─────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'daily_demand_outages' && (
        <div className="space-y-6">
          <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#252E38] pb-4">
              <div>
                <span className="font-mono text-xs uppercase text-rose-400 font-bold">
                  {locale === 'fr'
                    ? 'POURQUOI LE COURANT EST DISPONIBLE LE MATIN MAIS COUPÉ LE SOIR (18H00 – 22H00) ?'
                    : 'WHY IS ELECTRICITY AVAILABLE IN THE MORNING BUT INTERRUPTED IN THE EVENING (18:00 – 22:00)?'}
                </span>
                <h3 className="font-mono text-lg font-black text-white mt-1">
                  {locale === 'fr'
                    ? 'Courbe de Charge Journalière 24h (Illustrative) & Simulateur de Plafond de Production Disponible'
                    : '24-Hour Daily Electricity Demand Curve (Illustrative) & Available Generation Ceiling Simulator'}
                </h3>
              </div>

              <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-3 min-w-[280px]">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">
                    {locale === 'fr'
                      ? 'Plafond Production Dispo :'
                      : 'Available Generation Ceiling:'}
                  </span>
                  <span className="text-emerald-400 font-black">{availableGenCeilingMw} MW</span>
                </div>
                <input
                  type="range"
                  min={950}
                  max={1500}
                  step={25}
                  value={availableGenCeilingMw}
                  onChange={(e) => setAvailableGenCeilingMw(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>950 MW (Étiage critique)</span>
                  <span>1500 MW (Hautes eaux)</span>
                </div>
              </div>
            </div>

            {/* Interactive 24-Hour Demand vs Available Generation Bar Chart */}
            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="text-amber-300">
                  {locale === 'fr'
                    ? 'PROFIL JOURNALIER ILLUSTRATIF (BASE INDUSTRIELLE + TERTIAIRE + POINTE RÉSIDENTIELLE)'
                    : 'ILLUSTRATIVE 24-HOUR NATIONAL LOAD PROFILE (INDUSTRIAL BASE + COMMERCIAL + RESIDENTIAL PEAK)'}
                </span>
                <span className="text-rose-400 font-bold">
                  {availableGenCeilingMw < 1400
                    ? locale === 'fr'
                      ? `Déficit à 19h30 : -${1400 - availableGenCeilingMw} MW (Délestage requis)`
                      : `19:30 Peak Deficit: -${1400 - availableGenCeilingMw} MW (Load shedding required)`
                    : locale === 'fr'
                    ? `Excédent à 19h30 : +${availableGenCeilingMw - 1400} MW (0 délestage production)`
                    : `19:30 Surplus: +${availableGenCeilingMw - 1400} MW (Zero generation deficit)`}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                {CAMEROON_DAILY_DEMAND_CURVE_24H.map((pt) => {
                  const deficitMw = Math.max(0, pt.totalDemandMw - availableGenCeilingMw);
                  const isDeficit = deficitMw > 0;
                  return (
                    <div
                      key={pt.hour}
                      className="grid grid-cols-12 items-center gap-2 text-xs font-mono"
                    >
                      <div className="col-span-2 sm:col-span-1 font-bold text-white">
                        {pt.hour}
                      </div>
                      <div className="col-span-6 sm:col-span-7 bg-[#151C1E] h-5 rounded-lg overflow-hidden relative border border-[#252E38]">
                        <div
                          className={`h-full transition-all ${
                            isDeficit ? 'bg-rose-600' : 'bg-emerald-500/80'
                          }`}
                          style={{ width: `${Math.min(100, (pt.totalDemandMw / 1500) * 100)}%` }}
                        />
                        {/* Ceiling Marker Line */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-amber-400"
                          style={{
                            left: `${Math.min(100, (availableGenCeilingMw / 1500) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="col-span-4 font-mono text-[11px] flex items-center justify-between pl-2">
                        <span className={isDeficit ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                          {pt.totalDemandMw} MW {isDeficit ? `(-${deficitMw} MW)` : ''}
                        </span>
                        <span className="text-slate-400 hidden md:inline truncate ml-2">
                          {locale === 'fr' ? pt.periodLabelFr : pt.periodLabelEn}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4 Types of Outages & Why One Area is Cut While Another Stays On */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-4 space-y-2.5 text-xs">
                <h4 className="font-mono font-bold uppercase text-amber-400">
                  {locale === 'fr'
                    ? 'Distinction des 4 Types d’Interruptions au Cameroun'
                    : 'Distinguishing the 4 Types of Power Interruptions'}
                </h4>
                <ul className="space-y-2 text-slate-300 leading-relaxed">
                  <li>
                    <strong className="text-white">1. Délestage Rotatif Programmé :</strong>{' '}
                    Lorsque le déficit de pointe est prévisible (ex: -150 MW entre 18h30 et 22h00 en étiage), l’opérateur alterne l’ouverture de départs HTA non prioritaires par tranches de quelques heures.
                  </li>
                  <li>
                    <strong className="text-white">2. Délestage d’Urgence (Dispatching CNCR) :</strong>{' '}
                    Suite au déclenchement soudain d’un groupe ou d’une ligne 225 kV, le CNCR de Mangombé ouvre manuellement des départs HTA pour stopper la chute de fréquence.
                  </li>
                  <li>
                    <strong className="text-white">3. Délestage Fréquentiel Automatique (UFLS — ANSI 81U) :</strong>{' '}
                    Si la fréquence franchit 49,2 Hz / 49,0 Hz / 48,8 Hz, les relais numériques des postes sources déclenchent instantanément des échelons de départs HTA en moins de 200 ms pour sauver le réseau du blackout.
                  </li>
                  <li>
                    <strong className="text-emerald-300">4. Panne Locale Distribution / Travaux (Hors Déficit Eau) :</strong>{' '}
                    Avarie de transformateur H61, câble 15 kV percé ou chute de poteau bois. Survient même quand la production nationale est largement excédentaire !
                  </li>
                </ul>
              </div>

              <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-4 space-y-2.5 text-xs">
                <h4 className="font-mono font-bold uppercase text-sky-400">
                  {locale === 'fr'
                    ? 'Pourquoi un Quartier est Coupé Pendant que le Quartier Voisin est Alimenté ?'
                    : 'Why Is One Neighborhood Interrupted While an Adjacent Area Remains Supplied?'}
                </h4>
                <ul className="space-y-2 text-slate-300 leading-relaxed">
                  <li>
                    <strong className="text-white">• Priorisation des Départs Vitaux :</strong>{' '}
                    Les départs HTA 15/30 kV alimentant les hôpitaux de référence, les stations de pompage d’eau (CAMWATER), les aéroports, les centres télécoms et les institutions stratégiques sont exclus des premiers échelons de délestage.
                  </li>
                  <li>
                    <strong className="text-white">• Topologie Radiale par Poste Source :</strong>{' '}
                    Deux rues voisines peuvent être alimentées par deux départs HTA distincts ou deux postes sources différents (ex: un départ sur Logbaba saturé vs un départ sur Bassa disponible).
                  </li>
                  <li>
                    <strong className="text-white">• Compensation Thermique & Solaire :</strong>{' '}
                    Kribi (216 MW gaz), Logbaba (105 MW gaz) et Dibamba (86 MW HFO) tournent à pleine capacité disponible en saison sèche, mais restent soumis aux coûts de combustible, à la pression gaz et aux arrêts de maintenance programmée. Le solaire PV (Guider/Maroua 30 MWp) soulage Lagdo le jour mais produit 0 MW à 19h30 hors décharge de sa batterie BESS (19 MWh).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          TAB 6: HYDROLOGICAL DROUGHT & 6 EDUCATIONAL CASE STUDIES (SECTIONS 12, 15)
         ─────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === 'drought_case_studies' && (
        <div className="space-y-6">
          {/* Drought Typology: Meteorological vs Agricultural vs Hydrological */}
          <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-mono text-base font-black uppercase text-amber-400">
              {locale === 'fr'
                ? 'Sécheresse Météorologique vs Agricole vs Hydrologique & Conséquences Pluriannuelles'
                : 'Meteorological vs. Agricultural vs. Hydrological Drought & Multi-Year Carry-Over Effects'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-4 space-y-1.5">
                <div className="font-mono font-bold text-sky-300">
                  1. Sécheresse Météorologique
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Déficit temporaire des précipitations (mm de pluie) par rapport à la moyenne climatologique sur une région donnée. N’impacte pas immédiatement les grands barrages-réservoirs si les retenues (Lom Pangar, Mapé) sont pleines.
                </p>
              </div>
              <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-4 space-y-1.5">
                <div className="font-mono font-bold text-amber-300">
                  2. Sécheresse Agricole (Édaphique)
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Assèchement de la couche superficielle des sols réduisant l’humidité disponible pour les cultures. Lors du retour des premières pluies, ces sols secs absorbent l’eau par infiltration, retardant le ruissellement vers les rivières.
                </p>
              </div>
              <div className="bg-[#0B0F12] border border-rose-500/40 rounded-xl p-4 space-y-1.5">
                <div className="font-mono font-bold text-rose-300">
                  3. Sécheresse Hydrologique (Critique Réseau)
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Baisse prolongée des débits fluviaux, des nappes souterraines et de la cote des grands réservoirs (ex: épisodes historiques de 2001 et 2012 sur la Sanaga avant Lom Pangar, et étiages récurrents du lac de Lagdo sur la Bénoué). Une mauvaise recharge en année N réduit le productible pendant les 9 mois de l’année N+1.
                </p>
              </div>
            </div>
          </div>

          {/* 6 Interactive Educational Case Studies */}
          <div className="bg-[#151C1E] border border-[#567A87]/40 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#252E38] pb-4">
              <div>
                <span className="font-mono text-xs uppercase text-emerald-400 font-bold">
                  {locale === 'fr'
                    ? '6 CAS D’ÉTUDE PRATIQUES D’INGÉNIERIE DU RÉSEAU CAMEROUNAIS'
                    : '6 PRACTICAL CAMEROON POWER SYSTEM ENGINEERING CASE STUDIES'}
                </span>
                <h3 className="font-mono text-lg font-black text-white mt-1">
                  {locale === 'fr' ? activeCaseStudy.titleFr : activeCaseStudy.titleEn}
                </h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CAMEROON_SEASONAL_CASE_STUDIES.map((cs) => (
                  <button
                    key={cs.id}
                    type="button"
                    onClick={() => setSelectedCaseStudyId(cs.id)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                      selectedCaseStudyId === cs.id
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-[#0B0F12] text-slate-400 hover:text-white border border-[#252E38]'
                    }`}
                  >
                    Cas #{cs.number}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0B0F12] border border-[#252E38] rounded-xl p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 font-mono text-[10px] text-amber-300 font-bold">
                  {locale === 'fr'
                    ? 'EXEMPLE NUMÉRIQUE PÉDAGOGIQUE ANCRÉ SUR LE RÉSEAU CAMEROUNAIS'
                    : 'LABELED HYPOTHETICAL ENGINEERING CALCULATION ON CAMEROON ASSETS'}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {locale === 'fr'
                    ? activeCaseStudy.cameroonContextFr
                    : activeCaseStudy.cameroonContextEn}
                </p>
                <div className="space-y-2 pt-2">
                  {activeCaseStudy.engineeringParameters.map((param, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded bg-[#151C1E] border border-[#252E38] text-xs font-mono"
                    >
                      <div className="text-[10px] text-slate-400">{param.label}</div>
                      <div className="text-emerald-300 font-bold mt-0.5">{param.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h4 className="font-mono text-xs uppercase text-cyan-400 font-bold">
                    {locale === 'fr'
                      ? 'Séquence Causale Physique & Opérationnelle'
                      : 'Physical & Operational Causal Sequence'}
                  </h4>
                  <div className="space-y-2">
                    {(locale === 'fr'
                      ? activeCaseStudy.causalChainFr
                      : activeCaseStudy.causalChainEn
                    ).map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-[#151C1E] border border-[#252E38] text-xs text-slate-200 flex items-start gap-2.5"
                      >
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-xs text-emerald-200 leading-relaxed">
                  <strong className="font-mono uppercase text-emerald-400 block mb-1">
                    {locale === 'fr' ? 'Conclusion d’Ingénierie :' : 'Engineering Takeaway:'}
                  </strong>
                  {locale === 'fr'
                    ? activeCaseStudy.technicalConclusionFr
                    : activeCaseStudy.technicalConclusionEn}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
