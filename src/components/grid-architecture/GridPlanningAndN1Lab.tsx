// src/components/grid-architecture/GridPlanningAndN1Lab.tsx
// EPEDE - Grid Planning, N-1 Contingency Analysis & Capacity Expansion Lab

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Compass, 
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { GRID_PLANNING_SCENARIOS } from './data/gridPlanningScenariosData';
import { GridPlanningScenario } from './types';

interface GridPlanningAndN1LabProps {
  locale: 'fr' | 'en';
}

export const GridPlanningAndN1Lab: React.FC<GridPlanningAndN1LabProps> = ({ locale }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scen-01-n1-contingency');
  const [activeTab, setActiveTab] = useState<'simulation' | 'methodology'>('simulation');

  const activeScenario = GRID_PLANNING_SCENARIOS.find(s => s.id === selectedScenarioId) || GRID_PLANNING_SCENARIOS[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                PLANIFICATION DE RÉSEAU & CRITÈRE N-1
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {locale === 'fr' ? 'Études d\'Évacuation, Marges de Transit & Sécurité Système' : 'Capacity Expansion, Power Flow Margins & System Security'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {locale === 'fr' 
                ? 'Laboratoire de Planification de Réseau & Analyse de Contingence N-1' 
                : 'Grid Planning Laboratory & Deterministic N-1 Contingency Lab'}
            </h2>
          </div>

          <div className="flex rounded-xl border border-[#252E38] bg-[#161B22] p-1 text-xs font-mono shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('simulation')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'simulation' ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? 'Scénarios N-1' : 'N-1 Scenarios'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('methodology')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'methodology' ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? 'Méthodologie & Critère N-1' : 'N-1 Rule & Math'}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'simulation' && (
        <div className="space-y-6">
          {/* Scenario Selector Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {GRID_PLANNING_SCENARIOS.map((scen) => {
              const isSelected = scen.id === selectedScenarioId;
              return (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => setSelectedScenarioId(scen.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-150 ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500 ring-2 ring-sky-500/20 shadow-md shadow-sky-500/10'
                      : 'bg-[#0D1117] border-[#252E38] hover:border-slate-700 hover:bg-[#161B22]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-sky-300 bg-sky-500/15 px-2 py-0.5 rounded border border-sky-500/30">
                      {scen.horizonYears}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white mt-2">
                    {scen.title[locale]}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {scen.objective[locale]}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Scenario Detailed Deep Dive */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 sm:p-6 shadow-lg space-y-6">
            <div className="border-b border-[#252E38] pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {locale === 'fr' ? 'Scénario Actif' : 'Active Scenario'}
                </span>
                <span className="font-mono text-xs text-slate-400">{activeScenario.horizonYears}</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {activeScenario.title[locale]}
              </h3>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                {activeScenario.objective[locale]}
              </p>
            </div>

            {/* Before vs After Intervention Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Baseline Grid State */}
              <div className="p-4 rounded-xl border border-[#252E38] bg-[#161B22] space-y-3">
                <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
                  <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wide">
                    {locale === 'fr' ? '1. ÉTAT INITIAL (AVANT INTERVENTION)' : '1. BASELINE GRID STATE'}
                  </span>
                  <span className="text-[10px] font-mono bg-[#0D1117] border border-[#252E38] px-2 py-0.5 rounded text-slate-400">
                    Normal Pre-Contingency
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#0D1117] border border-[#252E38]">
                    <span className="text-slate-400 block text-[10px]">{locale === 'fr' ? 'Demande Réseau :' : 'Grid Demand:'}</span>
                    <span className="font-bold text-white text-sm">{activeScenario.baselineState.demandMw} MW</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D1117] border border-[#252E38]">
                    <span className="text-slate-400 block text-[10px]">{locale === 'fr' ? 'Production Totale :' : 'Total Generation:'}</span>
                    <span className="font-bold text-white text-sm">{activeScenario.baselineState.generationMw} MW</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D1117] border border-[#252E38]">
                    <span className="text-slate-400 block text-[10px]">{locale === 'fr' ? 'Taux de Charge Critique :' : 'Critical Line Loading:'}</span>
                    <span className="font-bold text-amber-400 text-sm">{activeScenario.baselineState.criticalLineLoadingPct}%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D1117] border border-[#252E38]">
                    <span className="text-slate-400 block text-[10px]">{locale === 'fr' ? 'Tension Nœud Critique :' : 'Lowest Nodal Voltage:'}</span>
                    <span className="font-bold text-white text-sm">{activeScenario.baselineState.voltageLowestKv} kV</span>
                  </div>
                </div>
              </div>

              {/* Post-Intervention / Post-Contingency Grid State */}
              <div className="p-4 rounded-xl border border-sky-500/30 bg-[#161B22] space-y-3">
                <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
                  <span className="font-mono text-xs font-bold text-sky-300 uppercase tracking-wide">
                    {locale === 'fr' ? '2. ÉTAT POST-INTERVENTION / CONTINGENCE' : '2. POST-INTERVENTION / CONTINGENCY'}
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                    {activeScenario.postInterventionState.n1Compliant ? '✓ N-1 CONFORME' : 'NON CONFORME'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#0D1117] border border-[#252E38]">
                    <span className="text-slate-400 block text-[10px]">{locale === 'fr' ? 'Demande Desservie :' : 'Demand Served:'}</span>
                    <span className="font-bold text-white text-sm">{activeScenario.postInterventionState.demandMw} MW</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D1117] border border-[#252E38]">
                    <span className="text-slate-400 block text-[10px]">{locale === 'fr' ? 'Production Mobilisée :' : 'Generation Mobilized:'}</span>
                    <span className="font-bold text-white text-sm">{activeScenario.postInterventionState.generationMw} MW</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D1117] border border-[#252E38]">
                    <span className="text-slate-400 block text-[10px]">{locale === 'fr' ? 'Nouveau Taux de Charge :' : 'New Line Loading:'}</span>
                    <span className={`font-bold text-sm ${
                      activeScenario.postInterventionState.criticalLineLoadingPct > 90 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {activeScenario.postInterventionState.criticalLineLoadingPct}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D1117] border border-[#252E38]">
                    <span className="text-slate-400 block text-[10px]">{locale === 'fr' ? 'Tension Relevée :' : 'Recovered Voltage:'}</span>
                    <span className="font-bold text-emerald-400 text-sm">{activeScenario.postInterventionState.voltageLowestKv} kV</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefit Explanation & System Outcome */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1">
              <span className="font-mono font-bold text-emerald-300 block flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {locale === 'fr' ? 'Impact & Résilience Démontrée :' : 'Demonstrated Impact & System Resilience:'}
              </span>
              <p className="text-emerald-200/90 leading-relaxed text-sm font-sans">
                {activeScenario.postInterventionState.benefitExplanation[locale]}
              </p>
            </div>

            {/* Technical References */}
            <div className="p-3.5 bg-[#161B22] rounded-xl border border-[#252E38] text-xs font-mono text-slate-400">
              <span className="font-bold text-slate-300 block mb-0.5">{locale === 'fr' ? 'Référence Technique / Code Réseau :' : 'Grid Code Reference:'}</span>
              {activeScenario.technicalNotes[locale]}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'methodology' && (
        <div className="bg-[#0D1117] border border-[#252E38] rounded-2xl p-5 sm:p-6 shadow-lg space-y-6">
          <div className="border-b border-[#252E38] pb-4">
            <h3 className="text-xl font-bold text-white">
              {locale === 'fr' ? 'Méthodologie du Critère N-1 & Règles de Planification' : 'N-1 Criterion Methodology & Planning Rules'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              CEI 60038 · CEI 60909 · Code de Réseau SONATREL §4.2 · ENTSO-E Operational Handbook
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div className="space-y-3">
              <h4 className="font-bold text-white font-mono text-xs uppercase tracking-wide">
                1. Définition Mathématique du Critère N-1
              </h4>
              <p className="text-xs leading-relaxed text-slate-300">
                Le critère <strong className="text-white">N-1</strong> impose que pour tout ensemble de $N$ éléments constitutifs du réseau de grand transport (lignes aériennes, câbles souterrains, transformateurs élévateurs ou abaisseurs, groupes de production) :
              </p>
              <div className="p-3.5 bg-[#161B22] rounded-xl border border-sky-500/30 font-mono text-xs text-sky-300">
                {"∀ k ∈ {1 … N}, État(N - {k}) ⟹ (I_i ≤ I_adm,temp ∀ i) ∧ (U_j ≥ 0.90 Un ∀ j) ∧ (f ≥ 49.50 Hz)"}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autrement dit, le déclenchement fortuit d'un élément unique ne doit <strong className="text-slate-200">jamais</strong> provoquer de cascade de disjonctions, ni violer les limites thermiques temporaires admissibles des autres ouvrages, ni entraîner l'effondrement du profil de tension ou de la fréquence.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white font-mono text-xs uppercase tracking-wide">
                2. Les 3 Marges d'Exploitation Indispensables
              </h4>
              <ul className="space-y-2 text-xs">
                <li className="p-3 rounded-xl bg-[#161B22] border border-[#252E38]">
                  <strong className="text-white block font-mono mb-0.5">Marge Thermique (Transit Ampérique) :</strong>
                  <span className="text-slate-400 leading-relaxed block">
                    Les conducteurs doivent être dimensionnés pour accepter en régime de secours temporaire (15 à 30 minutes) le report intégral de puissance sans dépasser la température maximale admissible (ex: 75°C pour l'Almelec, sous peine de flèche excessive dangereuse).
                  </span>
                </li>
                <li className="p-3 rounded-xl bg-[#161B22] border border-[#252E38]">
                  <strong className="text-white block font-mono mb-0.5">Marge de Tension (Stabilité Statique) :</strong>
                  <span className="text-slate-400 leading-relaxed block">
                    La tension en tout poste 225 kV doit rester comprise entre 0.90 Un (202.5 kV) et 1.10 Un (245 kV) selon la norme CEI 60038.
                  </span>
                </li>
                <li className="p-3 rounded-xl bg-[#161B22] border border-[#252E38]">
                  <strong className="text-white block font-mono mb-0.5">Marge de Réserve Primaire & Secondaire :</strong>
                  <span className="text-slate-400 leading-relaxed block">
                    Le réseau doit disposer en permanence d'une réserve tournante égale ou supérieure à la puissance du plus gros groupe injecteur (critère du plus gros aléa de production).
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
