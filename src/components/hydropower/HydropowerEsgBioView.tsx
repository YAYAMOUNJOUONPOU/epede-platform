// ============================================================================
// HYDROPOWER DIGITAL TWIN — STEP 24 COMPONENT
// ESG, Ecological Flow (e-Flow), Fish Migration Passages & GHG Carbon Twin
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Leaf,
  Fish,
  Droplets,
  Award,
  ShieldCheck,
  Globe,
  Trees,
  Waves,
  Info,
  CheckCircle2,
  Sliders,
  Flame,
  Search,
  Activity,
  ArrowRight,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  IFC_PERFORMANCE_STANDARDS,
  EFLOW_ANNUAL_HYDROGRAPH,
  SANAGA_FISH_BIODIVERSITY,
  NACHTIGAL_GHG_PROFILE,
  WATER_QUALITY_STATIONS,
} from '../../data/hydropowerEsgBioData';
import type { IfcPerformanceStandardId } from '../../types/hydropowerEsgBio';
import type { HydroSubsystemId } from '../../types/hydropower';

interface HydropowerEsgBioViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (stdId: string) => void;
  onSelectSubsystem?: (subId: HydroSubsystemId) => void;
}

type EsgSubTab = 'ifc_standards' | 'eflow_hydrograph' | 'fishways_bio' | 'ghg_carbon' | 'water_quality';

export const HydropowerEsgBioView: React.FC<HydropowerEsgBioViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<EsgSubTab>('ifc_standards');
  const [expandedStandard, setExpandedStandard] = useState<IfcPerformanceStandardId | null>(
    'IFC_PS6_BIODIVERSITY_CONSERVATION'
  );
  const [simulatedSanagaInflow, setSimulatedSanagaInflow] = useState<number>(550); // m3/s (Saison sèche / transition)
  const [selectedFishSpecies, setSelectedFishSpecies] = useState<string>('LAB_SAN');
  const [showAcousticTelemetryPulse, setShowAcousticTelemetryPulse] = useState<boolean>(true);

  // e-Flow allocation logic:
  // Strict environmental law: Qmin = 100 m3/s must ALWAYS be discharged to TCC before any turbining.
  // Capacity of 7 Francis units: max 980 m3/s (7 x 140 m3/s).
  const eflowAlloc = useMemo(() => {
    const qEco = Math.min(simulatedSanagaInflow, 100);
    const qRemaining = Math.max(0, simulatedSanagaInflow - 100);
    const qTurbined = Math.min(qRemaining, 980);
    const qSpill = Math.max(0, qRemaining - 980);
    const complianceOk = qEco >= 100;
    const powerEstimatedMw = (qTurbined * 9.81 * 50.5 * 0.93) / 1000; // H = 50.5m, eta = 93%

    return {
      qEco,
      qTurbined,
      qSpill,
      complianceOk,
      powerEstimatedMw: Math.round(powerEstimatedMw),
    };
  }, [simulatedSanagaInflow]);

  // Overall average IFC compliance score
  const avgIfcScore = useMemo(() => {
    const sum = IFC_PERFORMANCE_STANDARDS.reduce((acc, item) => acc + item.scorePercent, 0);
    return (sum / IFC_PERFORMANCE_STANDARDS.length).toFixed(1);
  }, []);

  const selectedFish = useMemo(() => {
    return SANAGA_FISH_BIODIVERSITY.find((f) => f.speciesCode === selectedFishSpecies) || SANAGA_FISH_BIODIVERSITY[0];
  }, [selectedFishSpecies]);

  return (
    <div className="space-y-6 text-neutral-200">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1E13] via-[#0E281A] to-[#08170F] border border-emerald-900/60 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono tracking-wider uppercase font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {locale === 'fr' ? 'ÉTAPE 24 • ESG & BIODIVERSITÉ' : 'STEP 24 • ESG & BIODIVERSITY'}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                IFC PS 1-8 • IHA GOLD STANDARD
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                G-res GHG TOOL • UNESCO
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <Leaf className="h-7 w-7 text-emerald-400" />
              {locale === 'fr'
                ? 'Jumeau ESG, Débit Réservé (e-Flow), Passes à Poissons & Empreinte Carbone'
                : 'ESG Digital Twin, Environmental Flow (e-Flow), Fishways & Carbon Footprint'}
            </h2>
            <p className="text-neutral-300 text-sm max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? "Garantie opérationnelle du débit réservé biologique (Qmin = 100 m³/s dans le tronçon court-circuité de la Sanaga), conformité rigoureuse aux 8 Normes de Performance SFI/Banque Mondiale, surveillance acoustique des espèces endémiques de poissons (Labeo, Chiloglanis), suivi physico-chimique en 5 stations et bilan carbone G-res (11.8 g CO₂eq/kWh)."
                : 'Operational guarantee of minimum environmental flow (Qmin = 100 m³/s released into the bypassed Sanaga riverbed), strict compliance with 8 IFC/World Bank Performance Standards, acoustic telemetry of endemic fish (Labeo, Chiloglanis), 5-station water quality telemetry, and G-res GHG lifecycle footprint (11.8 g CO₂eq/kWh).'}
            </p>
          </div>

          {/* Quick KPI badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-black/40 border border-emerald-900/50 flex flex-col justify-center">
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                {locale === 'fr' ? 'Score ESG SFI' : 'IFC ESG Score'}
              </div>
              <div className="text-xl font-bold text-white font-mono mt-0.5">{avgIfcScore}%</div>
              <div className="text-[10px] text-neutral-400">Certification Or (IHA)</div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-blue-900/50 flex flex-col justify-center">
              <div className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                {locale === 'fr' ? 'Débit Réservé' : 'e-Flow Guarantee'}
              </div>
              <div className="text-xl font-bold text-white font-mono mt-0.5">100 m³/s</div>
              <div className="text-[10px] text-neutral-400">3.15 Gm³/an écologie</div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-900/50 flex flex-col justify-center">
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                {locale === 'fr' ? 'CO₂ Évité' : 'Avoided CO₂'}
              </div>
              <div className="text-xl font-bold text-white font-mono mt-0.5">-730 kt/an</div>
              <div className="text-[10px] text-neutral-400">Substitue thermique</div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-purple-900/50 flex flex-col justify-center">
              <div className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                {locale === 'fr' ? 'Facteur Émission' : 'GHG Factor'}
              </div>
              <div className="text-xl font-bold text-white font-mono mt-0.5">11.8 g/kWh</div>
              <div className="text-[10px] text-neutral-400">Retenue fil de l’eau</div>
            </div>
          </div>
        </div>

        {/* SUB-TABS NAVIGATION */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-emerald-900/50">
          <button
            onClick={() => setActiveSubTab('ifc_standards')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'ifc_standards'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-900/50 font-bold'
                : 'bg-black/40 text-neutral-300 hover:bg-emerald-950/40 hover:text-white border border-emerald-900/40'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            {locale === 'fr' ? '1. Normes de Performance SFI (PS 1-8)' : '1. IFC Performance Standards (PS 1-8)'}
          </button>

          <button
            onClick={() => setActiveSubTab('eflow_hydrograph')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'eflow_hydrograph'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-900/50 font-bold'
                : 'bg-black/40 text-neutral-300 hover:bg-emerald-950/40 hover:text-white border border-emerald-900/40'
            }`}
          >
            <Waves className="h-4 w-4" />
            {locale === 'fr' ? '2. Débit Écologique (e-Flow Qmin = 100 m³/s)' : '2. Environmental Flow (e-Flow Qmin = 100 m³/s)'}
          </button>

          <button
            onClick={() => setActiveSubTab('fishways_bio')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'fishways_bio'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-900/50 font-bold'
                : 'bg-black/40 text-neutral-300 hover:bg-emerald-950/40 hover:text-white border border-emerald-900/40'
            }`}
          >
            <Fish className="h-4 w-4" />
            {locale === 'fr' ? '3. Passes à Poissons & Télémétrie Sanaga' : '3. Fish Passes & Telemetry Tracking'}
          </button>

          <button
            onClick={() => setActiveSubTab('ghg_carbon')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'ghg_carbon'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-900/50 font-bold'
                : 'bg-black/40 text-neutral-300 hover:bg-emerald-950/40 hover:text-white border border-emerald-900/40'
            }`}
          >
            <Flame className="h-4 w-4" />
            {locale === 'fr' ? '4. Bilan Carbone G-res & Climat' : '4. G-res Carbon Footprint & Climate'}
          </button>

          <button
            onClick={() => setActiveSubTab('water_quality')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === 'water_quality'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-900/50 font-bold'
                : 'bg-black/40 text-neutral-300 hover:bg-emerald-950/40 hover:text-white border border-emerald-900/40'
            }`}
          >
            <Droplets className="h-4 w-4" />
            {locale === 'fr' ? '5. Réseau Qualité de l’Eau (5 Stations)' : '5. Water Quality Network (5 Stations)'}
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: IFC PERFORMANCE STANDARDS (PS 1 to 8)                     */}
      {/* ==================================================================== */}
      {activeSubTab === 'ifc_standards' && (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#09150E] border border-emerald-900/40 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Award className="h-4 w-4" />
                {locale === 'fr' ? 'CADRE RÉGLEMENTAIRE MONDIAL' : 'GLOBAL REGULATORY FRAMEWORK'}
              </div>
              <div className="text-sm font-semibold text-white">
                {locale === 'fr' ? 'Groupe Banque Mondiale & SFI (IFC)' : 'World Bank Group & IFC Standards'}
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {locale === 'fr'
                  ? 'Audit périodique d’alignement aux 8 Normes de Performance environnementales et sociales (PS 1 à PS 8).'
                  : 'Periodic third-party audit verifying full alignment with the 8 IFC Environmental & Social Performance Standards.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#09150E] border border-emerald-900/40 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                <Trees className="h-4 w-4" />
                {locale === 'fr' ? 'COMPENSATION BIODIVERSITÉ' : 'BIODIVERSITY OFFSET'}
              </div>
              <div className="text-sm font-semibold text-white">
                {locale === 'fr' ? 'Parc National du Mpem et Djim' : 'Mpem & Djim National Park Offset'}
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {locale === 'fr'
                  ? 'Financement de 97 000 ha de forêt tropicale protégée pour garantir un "Gain Net Positif" en biodiversité (PS 6).'
                  : 'Financing 97,000 hectares of pristine rainforest conservation to guarantee a Net Positive Gain (PS 6).'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#09150E] border border-emerald-900/40 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <CheckCircle2 className="h-4 w-4" />
                {locale === 'fr' ? 'PLAN D’ACTION RÉINSTALLATION' : 'RESETTLEMENT ACTION PLAN'}
              </div>
              <div className="text-sm font-semibold text-white">
                {locale === 'fr' ? '100% Relogés & PRMS Opérationnel' : '100% Resettled & Active Livelihoods'}
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {locale === 'fr'
                  ? 'Constructions en dur viabilisées avec adduction d’eau, électrification et restauration des moyens d’existence (PS 5).'
                  : 'Engineered masonry housing with potable water, grid connection, and agricultural livelihood programs (PS 5).'}
              </p>
            </div>
          </div>

          {/* List of Standards */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>{locale === 'fr' ? 'NORMES DE PERFORMANCE SFI & PLANS D’ACTION' : 'IFC PERFORMANCE STANDARDS AUDIT MATRIX'}</span>
              <span className="text-emerald-400 text-xs font-normal">
                {locale === 'fr' ? '7 normes applicables • 100% Conformité' : '7 applicable standards • 100% Compliance'}
              </span>
            </h3>

            <div className="space-y-2">
              {IFC_PERFORMANCE_STANDARDS.map((item) => {
                const isExpanded = expandedStandard === item.id;
                return (
                  <div
                    key={item.id}
                    className="rounded-xl bg-[#07130B] border border-emerald-950/60 hover:border-emerald-800/60 transition-all overflow-hidden"
                  >
                    <div
                      onClick={() => setExpandedStandard(isExpanded ? null : item.id)}
                      className="p-4 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {item.standardNumber}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {locale === 'fr' ? item.nameFr : item.nameEn}
                          </div>
                          <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                            <span>Audit: {item.auditDate}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-mono">
                              {item.status === 'COMPLIANT_GOLD' ? 'Conforme Or (100%)' : 'Conforme Certifié'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-base font-bold font-mono text-emerald-400">{item.scorePercent}%</div>
                          <div className="text-[10px] text-neutral-400">{locale === 'fr' ? 'Score audit' : 'Audit score'}</div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-neutral-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-neutral-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-emerald-950/80 bg-black/20 space-y-3 text-xs">
                        <div className="font-mono text-neutral-400 uppercase tracking-wider text-[11px]">
                          {locale === 'fr' ? 'ACTIONS MAJEURES & MESURES D’ATTÉNUATION AUDITÉES :' : 'AUDITED ACTIONS & MITIGATION MEASURES:'}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {(locale === 'fr' ? item.keyActionsFr : item.keyActionsEn).map((action, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-lg bg-[#0B1A10] border border-emerald-900/30 flex items-start gap-2 text-neutral-300"
                            >
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: ECOLOGICAL FLOW (e-FLOW / DÉBIT RÉSERVÉ)                   */}
      {/* ==================================================================== */}
      {activeSubTab === 'eflow_hydrograph' && (
        <div className="space-y-6">
          {/* Interactive Hydrologic Dispatch Simulator */}
          <div className="p-5 rounded-2xl bg-[#07130B] border border-emerald-900/60 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-emerald-400" />
                  {locale === 'fr'
                    ? 'Simulateur d’Arbitrage Hydrologique & Débit Réservé Sanaga'
                    : 'Hydrological Allocation & Sanaga e-Flow Simulator'}
                </h3>
                <p className="text-xs text-neutral-400">
                  {locale === 'fr'
                    ? 'Tester la préservation inconditionnelle des 100 m³/s dans le tronçon court-circuité (TCC) selon les apports du fleuve.'
                    : 'Simulate unconditional preservation of 100 m³/s into the bypassed river section according to inflow variations.'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-400">
                  {locale === 'fr' ? 'Apport Fleuve Sanaga :' : 'Sanaga Inflow:'}
                </span>
                <span className="px-3 py-1 rounded-lg bg-black text-emerald-400 font-mono font-bold text-sm border border-emerald-800">
                  {simulatedSanagaInflow} m³/s
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min={80}
                max={3200}
                step={20}
                value={simulatedSanagaInflow}
                onChange={(e) => setSimulatedSanagaInflow(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                <span>Étiage sévère (80 m³/s)</span>
                <span>Étiage moyen (400 m³/s)</span>
                <span>Nominal turbines (1080 m³/s)</span>
                <span>Pointe de crue (3200 m³/s)</span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-black/50 border border-emerald-900/50">
                <div className="text-[10px] font-mono text-emerald-400 uppercase">
                  {locale === 'fr' ? 'Débit Réservé TCC (Qmin)' : 'Bypass e-Flow (Qmin)'}
                </div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {eflowAlloc.qEco} <span className="text-xs font-normal text-neutral-400">m³/s</span>
                </div>
                <div className="text-[11px] mt-1 flex items-center gap-1 font-mono">
                  {eflowAlloc.complianceOk ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Seuil légal 100 m³/s garanti
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1">
                      Inflow &lt; 100 m³/s (Étiage extrême)
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-blue-900/50">
                <div className="text-[10px] font-mono text-blue-400 uppercase">
                  {locale === 'fr' ? 'Débit Turbiné Usine' : 'Turbined Power Discharge'}
                </div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {eflowAlloc.qTurbined} <span className="text-xs font-normal text-neutral-400">m³/s</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Max: 980 m³/s (7 Francis × 140 m³/s)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-amber-900/50">
                <div className="text-[10px] font-mono text-amber-400 uppercase">
                  {locale === 'fr' ? 'Déversement Évacuateur' : 'Spillway Overflow'}
                </div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {eflowAlloc.qSpill} <span className="text-xs font-normal text-neutral-400">m³/s</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  {eflowAlloc.qSpill > 0 ? 'Surverse vers chutes naturelles' : 'Aucun déversement crue'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-purple-900/50">
                <div className="text-[10px] font-mono text-purple-400 uppercase">
                  {locale === 'fr' ? 'Puissance Électrique Active' : 'Generated Active Power'}
                </div>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {eflowAlloc.powerEstimatedMw} <span className="text-xs font-normal text-neutral-400">MW</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  {Math.round((eflowAlloc.powerEstimatedMw / 420) * 100)}% de capacité nominale
                </div>
              </div>
            </div>
          </div>

          {/* Annual Hydrograph Table & Chart Representation */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>{locale === 'fr' ? 'HYDROGRAMME ANNUEL SANAGA & OBLIGATION ÉCOLOGIQUE' : 'ANNUAL SANAGA HYDROGRAPH & E-FLOW COMPLIANCE'}</span>
              <span className="text-emerald-400 text-xs font-mono">Qmin garanti ≥ 100 m³/s chaque mois</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-emerald-950/80 bg-[#07130B]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0A1A0E] text-[10px] font-mono uppercase text-neutral-400 border-b border-emerald-900/40">
                  <tr>
                    <th className="p-3">Mois</th>
                    <th className="p-3">Apport Sanaga (m³/s)</th>
                    <th className="p-3">Turbiné Usine (m³/s)</th>
                    <th className="p-3">Débit Réservé TCC (m³/s)</th>
                    <th className="p-3">Seuil Légal</th>
                    <th className="p-3">Périmètre Mouillé (m)</th>
                    <th className="p-3">Oxygène Dissous (mg/L)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/40 font-mono">
                  {EFLOW_ANNUAL_HYDROGRAPH.map((pt) => (
                    <tr key={pt.month} className="hover:bg-emerald-950/20">
                      <td className="p-3 font-bold text-white">{pt.month}</td>
                      <td className="p-3 text-neutral-200">{pt.sanagaInflowM3s}</td>
                      <td className="p-3 text-blue-400">{pt.plantTurbinedDischargeM3s}</td>
                      <td className="p-3 text-emerald-400 font-bold">{pt.reservedEcoFlowM3s}</td>
                      <td className="p-3 text-neutral-400">≥ {pt.complianceMinimumM3s}</td>
                      <td className="p-3 text-neutral-300">{pt.riverbedWettedPerimeterM} m</td>
                      <td className="p-3 text-cyan-300 flex items-center gap-1">
                        <Droplets className="h-3 w-3" /> {pt.dissolvedOxygenMgL}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-[#08150D] border border-emerald-900/40 text-[11px] text-neutral-300 flex items-start gap-2">
              <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong>Principe de conception Nachtigal :</strong> Même lors des étiages les plus sévères de février-mars, l’aménagement est physiquement calé pour restituer au minimum 100 m³/s à l’aval direct du barrage de Nachtigal-Amont. Cela assure la pérennité de la biocénose aquatique, le maintien du périmètre mouillé rocheux et l’oxygénation continue des cascades jusqu’à la confluence du canal de fuite.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: FISH PASSES & TELEMETRY                                  */}
      {/* ==================================================================== */}
      {activeSubTab === 'fishways_bio' && (
        <div className="space-y-6">
          {/* Top Species Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left List of Species */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                {locale === 'fr' ? 'ESPÈCES PISCICOLES SUIVIES (SANAGA)' : 'MONITORED SANAGA FISH SPECIES'}
              </div>
              <div className="space-y-1.5">
                {SANAGA_FISH_BIODIVERSITY.map((f) => (
                  <button
                    key={f.speciesCode}
                    onClick={() => setSelectedFishSpecies(f.speciesCode)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedFishSpecies === f.speciesCode
                        ? 'bg-emerald-950/80 border-emerald-500 shadow-md text-white'
                        : 'bg-[#07130B] border-emerald-950/60 text-neutral-300 hover:border-emerald-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs">{locale === 'fr' ? f.commonNameFr : f.commonNameEn}</span>
                      {f.isSanagaEndemic && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ENDÉMIQUE
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono italic text-neutral-400 mt-0.5">{f.scientificName}</div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-2 font-mono">
                      <span>Statut: {f.iucnStatus}</span>
                      <span className="text-emerald-400">Passe: {f.passageEfficiencyPercent}% eff.</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Species Focus Detail */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-[#07130B] border border-emerald-900/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/40 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {locale === 'fr' ? selectedFish.commonNameFr : selectedFish.commonNameEn}
                    </h3>
                    <span className="text-xs font-mono italic text-emerald-400">
                      ({selectedFish.scientificName})
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {locale === 'fr'
                      ? 'Espèce rhéophile adaptée aux forts courants et substrats rocheux du fleuve Sanaga'
                      : 'Rheophilic species adapted to high velocity currents and rocky substrates of the Sanaga river'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    IUCN: {selectedFish.iucnStatus}
                  </span>
                  {selectedFish.acousticTagTrackingActive && (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                      <Activity className="h-3 w-3 animate-pulse text-blue-400" />
                      TÉLÉMÉTRIE ACTIVE
                    </span>
                  )}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-900/40">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase">
                    {locale === 'fr' ? 'Indice Biomasse' : 'Biomass Index'}
                  </div>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">
                    {selectedFish.biomassIndex} <span className="text-xs text-neutral-400">/100</span>
                  </div>
                  <div className="text-[10px] text-neutral-400">Population saine</div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-blue-900/40">
                  <div className="text-[10px] font-mono text-blue-400 uppercase">
                    {locale === 'fr' ? 'Comptage Annuel' : 'Annual Count'}
                  </div>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">
                    {selectedFish.annualCountFishway.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-neutral-400">Individus dénombrés</div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-amber-900/40">
                  <div className="text-[10px] font-mono text-amber-400 uppercase">
                    {locale === 'fr' ? 'Efficacité Passe' : 'Passage Rate'}
                  </div>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">
                    {selectedFish.passageEfficiencyPercent}%
                  </div>
                  <div className="text-[10px] text-neutral-400">Franchissement amont</div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-cyan-900/40">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase">
                    {locale === 'fr' ? 'Pic Migration' : 'Peak Migration'}
                  </div>
                  <div className="text-xs font-bold text-white mt-1 leading-snug">
                    {selectedFish.migrationSeasonPeak}
                  </div>
                </div>
              </div>

              {/* Acoustic Telemetry Simulator */}
              <div className="p-4 rounded-xl bg-[#0B1B11] border border-emerald-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono uppercase text-emerald-400 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    {locale === 'fr'
                      ? 'Télémétrie Acoustique & Vidéo-Comptage (Passe à bassins successifs)'
                      : 'Acoustic Tag Receiver & Optical Counter (Vertical Slot Fish Ladder)'}
                  </div>
                  <button
                    onClick={() => setShowAcousticTelemetryPulse(!showAcousticTelemetryPulse)}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-black/50 text-neutral-300 border border-emerald-900 hover:text-white"
                  >
                    {showAcousticTelemetryPulse ? 'Simulation: Active' : 'Simulation: Pause'}
                  </button>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {locale === 'fr'
                    ? 'Le barrage de Nachtigal est équipé d’un dispositif de franchissement mixte associant une passe à fentes verticales (vitesse limite < 1.4 m/s) et une rivière de contournement naturelle débitant en continu 5 m³/s d’attrait. Des émetteurs acoustiques 69 kHz implantés chirurgicalement permettent de quantifier le temps de franchissement (médiane : 42 minutes).'
                    : 'The Nachtigal dam features a dual fish passage system combining a vertical-slot ladder (flow velocity < 1.4 m/s) and a nature-like bypass river releasing a continuous 5 m³/s attraction flow. Surgically implanted 69 kHz acoustic transmitters track individual passage times (median: 42 minutes).'}
                </p>

                {/* Simulated ladder stages */}
                <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-center text-[10px]">
                  <div className="p-2 rounded-lg bg-black/50 border border-emerald-900/40">
                    <div className="text-neutral-400">Bassin Aval #1</div>
                    <div className="text-emerald-400 font-bold mt-0.5">V = 1.1 m/s</div>
                    <div className="text-[9px] text-neutral-500">Attrait hydraulique</div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/50 border border-emerald-900/40">
                    <div className="text-neutral-400">Fentes Mixtes #12</div>
                    <div className="text-emerald-400 font-bold mt-0.5">ΔH = 0.25 m</div>
                    <div className="text-[9px] text-neutral-500">Repos inter-bassins</div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/50 border border-emerald-900/40">
                    <div className="text-neutral-400">Tunnel Vidéo #24</div>
                    <div className="text-cyan-400 font-bold mt-0.5">IA Identification</div>
                    <div className="text-[9px] text-neutral-500">Comptage optique</div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/50 border border-emerald-900/40">
                    <div className="text-neutral-400">Sortie Retenue #32</div>
                    <div className="text-emerald-400 font-bold mt-0.5">V = 0.4 m/s</div>
                    <div className="text-[9px] text-neutral-500">Franchissement OK</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 4: GHG CARBON FOOTPRINT (G-res TOOL)                          */}
      {/* ==================================================================== */}
      {activeSubTab === 'ghg_carbon' && (
        <div className="space-y-6">
          {/* Core G-res Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#07130B] border border-emerald-900/50 space-y-1">
              <div className="text-[10px] font-mono text-emerald-400 uppercase">
                {locale === 'fr' ? 'Émissions Cycle de Vie' : 'Lifecycle GHG Factor'}
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {NACHTIGAL_GHG_PROFILE.lifecycleEmissionFactorGCoe2PerKwh}{' '}
                <span className="text-xs text-neutral-400 font-normal">gCO₂eq/kWh</span>
              </div>
              <div className="text-xs text-emerald-300">
                {locale === 'fr' ? 'Niveau comparable à l’éolien' : 'Comparable to onshore wind'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#07130B] border border-blue-900/50 space-y-1">
              <div className="text-[10px] font-mono text-blue-400 uppercase">
                {locale === 'fr' ? 'Temps de Séjour Hydraulique' : 'Water Residence Time'}
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {NACHTIGAL_GHG_PROFILE.waterResidenceTimeDays}{' '}
                <span className="text-xs text-neutral-400 font-normal">jours (35h)</span>
              </div>
              <div className="text-xs text-neutral-400">
                {locale === 'fr' ? 'Aucune anoxie profonde' : 'Prevents thermal anoxia'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#07130B] border border-amber-900/50 space-y-1">
              <div className="text-[10px] font-mono text-amber-400 uppercase">
                {locale === 'fr' ? 'CO₂ Net Évité au Cameroun' : 'Avoided Carbon Footprint'}
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {(NACHTIGAL_GHG_PROFILE.avoidedAnnualCo2Tonnes / 1000).toFixed(0)} kt{' '}
                <span className="text-xs text-neutral-400 font-normal">/an</span>
              </div>
              <div className="text-xs text-neutral-400">
                {locale === 'fr' ? 'Remplace fioul lourd / diesel' : 'Replaces heavy oil peakers'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#07130B] border border-purple-900/50 space-y-1">
              <div className="text-[10px] font-mono text-purple-400 uppercase">
                {locale === 'fr' ? 'Retour Carbone Investi' : 'Carbon Payback Time'}
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {NACHTIGAL_GHG_PROFILE.carbonPaybackPeriodMonths}{' '}
                <span className="text-xs text-neutral-400 font-normal">mois</span>
              </div>
              <div className="text-xs text-neutral-400">
                {locale === 'fr' ? 'Génie civil amorti en &lt; 5 mois' : 'Civil works carbon offset in &lt; 5 mo'}
              </div>
            </div>
          </div>

          {/* Benchmark Comparison: Nachtigal vs Other Energy Sources */}
          <div className="p-5 rounded-2xl bg-[#07130B] border border-emerald-900/60 space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-300 flex items-center justify-between">
              <span>{locale === 'fr' ? 'COMPARAISON DU FACTEUR D’ÉMISSION (IPCC / IHA G-RES TOOL)' : 'BENCHMARK LIFECYCLE EMISSIONS (IPCC / IHA G-RES)'}</span>
              <span className="text-xs text-emerald-400 font-mono">g CO₂eq / kWh produit</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {/* Nachtigal */}
              <div className="space-y-1">
                <div className="flex justify-between text-white font-bold">
                  <span className="flex items-center gap-2 text-emerald-400">
                    <Leaf className="h-4 w-4" /> Nachtigal Hydro (Fil de l'eau, Cameroun)
                  </span>
                  <span>11.8 g CO₂eq/kWh</span>
                </div>
                <div className="h-3 rounded-full bg-neutral-900 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '2%' }}></div>
                </div>
              </div>

              {/* Wind */}
              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Éolien Terrestre (Benchmark mondial)</span>
                  <span>11.0 g CO₂eq/kWh</span>
                </div>
                <div className="h-3 rounded-full bg-neutral-900 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '2%' }}></div>
                </div>
              </div>

              {/* Solar PV */}
              <div className="space-y-1">
                <div className="flex justify-between text-neutral-300">
                  <span>Solaire Photovoltaïque (Silicium cristallin)</span>
                  <span>41.0 g CO₂eq/kWh</span>
                </div>
                <div className="h-3 rounded-full bg-neutral-900 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '6%' }}></div>
                </div>
              </div>

              {/* Gas Combined Cycle */}
              <div className="space-y-1">
                <div className="flex justify-between text-neutral-400">
                  <span>Turbine Gaz Cycle Combiné (TGCC)</span>
                  <span>450.0 g CO₂eq/kWh</span>
                </div>
                <div className="h-3 rounded-full bg-neutral-900 overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              {/* Heavy Fuel Peakers */}
              <div className="space-y-1">
                <div className="flex justify-between text-neutral-400">
                  <span>Centrales Thermiques Fioul Lourd (HFO - Cameroun Ouest/Sud)</span>
                  <span>680.0 g CO₂eq/kWh</span>
                </div>
                <div className="h-3 rounded-full bg-neutral-900 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              {/* Coal */}
              <div className="space-y-1">
                <div className="flex justify-between text-neutral-500">
                  <span>Charbon Pulvérisé supercritique</span>
                  <span>1,001.0 g CO₂eq/kWh</span>
                </div>
                <div className="h-3 rounded-full bg-neutral-900 overflow-hidden">
                  <div className="h-full bg-neutral-700 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#08150D] border border-emerald-900/40 text-[11px] text-neutral-300">
              <strong>Pourquoi Nachtigal a-t-il une empreinte si faible en milieu tropical ?</strong> Contrairement aux très grands barrages de stockage à forte submersion de biomasse (forêt inondée) et long temps de séjour (des mois voire des années), Nachtigal est un aménagement pur au fil de l’eau avec une retenue de seulement 14.2 km² pour 420 MW de puissance installée (densité de puissance exceptionnelle de <strong>29.6 W/m²</strong>). L’eau ne séjourne que 35 heures, éliminant tout risque de méthanisation anoxique en profondeur.
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 5: WATER QUALITY NETWORK (5 STATIONS)                        */}
      {/* ==================================================================== */}
      {activeSubTab === 'water_quality' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>{locale === 'fr' ? 'RÉSEAU DE TÉLÉMESURE PHYSICO-CHIMIQUE EN CONTINU (5 STATIONS)' : 'CONTINUOUS WATER QUALITY TELEMETRY NETWORK (5 STATIONS)'}</span>
              <span className="text-emerald-400 text-xs font-mono">Norme Rejet OMS & Législation Camerounaise</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {WATER_QUALITY_STATIONS.map((st) => (
                <div
                  key={st.id}
                  className="p-4 rounded-xl bg-[#07130B] border border-emerald-950/80 hover:border-emerald-800/60 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-emerald-950/60 pb-2">
                    <div className="font-semibold text-xs text-white">{st.locationName}</div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 text-emerald-400 border border-emerald-900">
                      Pk {st.chainageKm.toFixed(1)} km
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-black/40 border border-emerald-950">
                      <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                        <Droplets className="h-3 w-3 text-cyan-400" /> O₂ Dissous
                      </div>
                      <div className="text-base font-bold text-white mt-0.5">{st.dissolvedOxygenMgL} mg/L</div>
                      <div className="text-[9px] text-emerald-400">Seuil &gt; 6.0 mg/L OK</div>
                    </div>

                    <div className="p-2 rounded bg-black/40 border border-emerald-950">
                      <div className="text-[10px] text-neutral-400">Température</div>
                      <div className="text-base font-bold text-white mt-0.5">{st.temperatureC} °C</div>
                      <div className="text-[9px] text-neutral-400">Régime tropical naturel</div>
                    </div>

                    <div className="p-2 rounded bg-black/40 border border-emerald-950">
                      <div className="text-[10px] text-neutral-400">pH Hydrogène</div>
                      <div className="text-base font-bold text-white mt-0.5">{st.pH}</div>
                      <div className="text-[9px] text-neutral-400">Neutre / Équilibré</div>
                    </div>

                    <div className="p-2 rounded bg-black/40 border border-emerald-950">
                      <div className="text-[10px] text-neutral-400">Turbidité</div>
                      <div className="text-base font-bold text-white mt-0.5">{st.turbidityNtu} NTU</div>
                      <div className="text-[9px] text-neutral-400">Fines en suspension</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1 border-t border-emerald-950/40">
                    <span>Conductivité: {st.conductivityUsCm} µS/cm</span>
                    <span>DBO₅: {st.bod5MgL} mg/L</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#08150D] border border-emerald-900/40 text-xs text-neutral-300 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Dispositif de réaération par clapet renifleur d'aspirateur :</strong> Les 7 turbines Francis de 60 MW disposent d'orifices d'injection d'air atmosphérique automatique dans le coude de l'aspirateur en régime partiel. Ce dispositif empêche non seulement les poches de cavitation et de vortex en torche, mais sur-sature l'eau en oxygène dissous (&gt; 7.9 mg/L), garantissant une qualité optimale de l'eau restituée au fleuve Sanaga.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
