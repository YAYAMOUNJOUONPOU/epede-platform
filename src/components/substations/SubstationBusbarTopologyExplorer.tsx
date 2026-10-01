// src/components/substations/SubstationBusbarTopologyExplorer.tsx
// EPEDE D04 - Substation Busbar Topologies & Node Schematics Explorer

import React, { useState } from 'react';
import {
  Layers,
  Zap,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  GitBranch
} from 'lucide-react';
import { BUSBAR_TOPOLOGIES_CATALOG, BusbarTopologyDefinition } from './data/substationBusbarsData';
import { SubstationSwitchingSequenceSimulator } from './modules/SubstationSwitchingSequenceSimulator';

interface SubstationBusbarTopologyExplorerProps {
  locale: 'fr' | 'en';
}

export const SubstationBusbarTopologyExplorer: React.FC<SubstationBusbarTopologyExplorerProps> = ({
  locale
}) => {
  const [activeTab, setActiveTab] = useState<'TOPOLOGY_CATALOG' | 'SWITCHING_SIMULATOR'>('TOPOLOGY_CATALOG');
  const [selectedTopologyId, setSelectedTopologyId] = useState<string>('BUS_DOUBLE');
  const [simulationMode, setSimulationMode] = useState<'NORMAL' | 'BUS_FAULT' | 'BREAKER_MAINTENANCE'>('NORMAL');

  const currentTopology = BUSBAR_TOPOLOGIES_CATALOG.find((t) => t.id === selectedTopologyId) || BUSBAR_TOPOLOGIES_CATALOG[2];

  return (
    <div className="space-y-4 font-mono">
      {/* Top View Switcher: Topologies Catalog vs Dynamic Switching Sequence Simulator */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('TOPOLOGY_CATALOG')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'TOPOLOGY_CATALOG'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 ring-1 ring-amber-300'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{locale === 'fr' ? '1. Topologies & Architectures Nodales N-1' : '1. Busbar Topologies & N-1 Matrix'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SWITCHING_SIMULATOR')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'SWITCHING_SIMULATOR'
              ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/20 ring-1 ring-sky-300'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>{locale === 'fr' ? '2. Séquences de Manœuvres & Transfert de Barres (CIGRE B3)' : '2. Switching Sequences & Busbar Transfer (CIGRE B3)'}</span>
        </button>
      </div>

      {activeTab === 'SWITCHING_SIMULATOR' ? (
        <SubstationSwitchingSequenceSimulator locale={locale} />
      ) : (
        <>
          {/* 1. Header & Topology Selector */}
          <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <GitBranch className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white">
                {locale === 'fr' ? 'Topologies & Schémas de Jeux de Barres' : 'Busbar Topologies & Switching Schemes'}
              </h2>
              <p className="text-[11px] text-slate-400 font-sans font-normal">
                {locale === 'fr'
                  ? 'Comparaison des architectures nodales : arbitrage coût d\'appareillage, flexibilité d\'exploitation et continuité de service N-1.'
                  : 'Comparing node architectures: balancing capital switchgear investment, switching flexibility, and N-1 reliability.'}
              </p>
            </div>
          </div>

          {/* Simulation Mode Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              {locale === 'fr' ? 'Scénario Nodal :' : 'Node Scenario:'}
            </span>
            <button
              type="button"
              onClick={() => setSimulationMode('NORMAL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                simulationMode === 'NORMAL'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#070A10] text-slate-400 border-slate-800'
              }`}
            >
              {locale === 'fr' ? 'Nominal' : 'Normal'}
            </button>
            <button
              type="button"
              onClick={() => setSimulationMode('BUS_FAULT')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                simulationMode === 'BUS_FAULT'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-[#070A10] text-slate-400 border-slate-800'
              }`}
            >
              {locale === 'fr' ? 'Défaut Barre (87B)' : 'Busbar Fault (87B)'}
            </button>
            <button
              type="button"
              onClick={() => setSimulationMode('BREAKER_MAINTENANCE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                simulationMode === 'BREAKER_MAINTENANCE'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-[#070A10] text-slate-400 border-slate-800'
              }`}
            >
              {locale === 'fr' ? 'Maintenance Disjoncteur' : 'Breaker Outage (LOTO)'}
            </button>
          </div>
        </div>

        {/* Topologies Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {BUSBAR_TOPOLOGIES_CATALOG.map((topo) => {
            const isSelected = topo.id === selectedTopologyId;
            return (
              <button
                key={topo.id}
                type="button"
                onClick={() => setSelectedTopologyId(topo.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-300'
                    : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-amber-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      Note {topo.reliability_score}/10
                    </span>
                  </div>
                  <div className={`text-xs font-bold leading-tight ${
                    isSelected ? 'text-slate-950' : 'text-white group-hover:text-amber-300'
                  }`}>
                    {locale === 'fr' ? topo.name_fr : topo.name_en}
                  </div>
                </div>
                <div className={`text-[10px] mt-2 font-mono ${
                  isSelected ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  {topo.circuit_breaker_ratio.split('(')[0]?.trim()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Synoptic ASCII Diagram & Scheme Dynamics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 7 Cols: Diagrammatic SLD & Operational State */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#222B38] pb-3">
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase">{currentTopology.code}</span>
              <h3 className="text-base font-bold text-white">
                {locale === 'fr' ? currentTopology.name_fr : currentTopology.name_en}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Indice Capex Relatif :</span>
              <span className="text-xs text-sky-400 font-bold">{currentTopology.capex_relative}</span>
            </div>
          </div>

          {/* SLD ASCII Visual Canvas */}
          <div className="p-4 rounded-xl bg-[#05070B] border border-[#1E2634] font-mono text-xs text-amber-300 overflow-x-auto shadow-inner">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex items-center justify-between">
              <span>Schéma Électrique Unifilaire Représentatif (SLD) :</span>
              <span className="text-emerald-400">
                {simulationMode === 'NORMAL' ? '● En Service Nominal' : simulationMode === 'BUS_FAULT' ? '▲ Défaut Éliminé par 87B' : '🔧 Isolement Disjoncteur LOTO'}
              </span>
            </div>
            <pre className="text-xs leading-tight text-amber-200 select-all whitespace-pre font-mono">
              {currentTopology.diagram_ascii}
            </pre>
          </div>

          {/* Simulation Impact Banner based on selected scenario */}
          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
            simulationMode === 'NORMAL'
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
              : simulationMode === 'BUS_FAULT'
              ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
              : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
          }`}>
            <div className="font-bold flex items-center gap-1.5 text-xs">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>
                {simulationMode === 'NORMAL' && (locale === 'fr' ? 'Comportement en Régime Nominal :' : 'Normal Operation Behaviour:')}
                {simulationMode === 'BUS_FAULT' && (locale === 'fr' ? 'Conséquence d\'un Défaut Jeu de Barres (ANSI 87B) :' : 'Busbar Fault Consequences (ANSI 87B):')}
                {simulationMode === 'BREAKER_MAINTENANCE' && (locale === 'fr' ? 'Flexibilité lors de la Maintenance d\'un Disjoncteur :' : 'Circuit Breaker Maintenance Flexibility:')}
              </span>
            </div>
            <p className="text-[11px] font-sans font-normal leading-relaxed text-slate-300">
              {simulationMode === 'NORMAL' && (locale === 'fr' ? currentTopology.switching_flexibility_fr : currentTopology.switching_flexibility_en)}
              {simulationMode === 'BUS_FAULT' && (locale === 'fr' ? currentTopology.fault_impact_fr : currentTopology.fault_impact_en)}
              {simulationMode === 'BREAKER_MAINTENANCE' && (locale === 'fr' ? currentTopology.maintenance_flexibility_fr : currentTopology.maintenance_flexibility_en)}
            </p>
          </div>

          {/* Dynamic Protection Telemetry (ANSI 87B Busbar Differential & 50BF Breaker Failure) */}
          <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Protection Différentielle de Barres (ANSI 87B / CEI 60255)
              </span>
              <span className={`px-2 py-0.5 rounded font-bold ${
                simulationMode === 'BUS_FAULT'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
              }`}>
                {simulationMode === 'BUS_FAULT' ? 'DÉCLENCHEMENT 87B ACTIF (Zone 1 Isolée)' : 'STABILISÉ EN VEILLE (Idiff = 0 A)'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="p-2 rounded bg-[#0A0E17] border border-[#1E2634]">
                <span className="text-slate-500 block">Courant Différentiel Id :</span>
                <span className={`font-bold ${simulationMode === 'BUS_FAULT' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {simulationMode === 'BUS_FAULT' ? '31.4 kA (Seuil dépassé)' : '0.04 A (< 0.2 In)'}
                </span>
              </div>
              <div className="p-2 rounded bg-[#0A0E17] border border-[#1E2634]">
                <span className="text-slate-500 block">Courant de Retenue Ir :</span>
                <span className="text-white font-bold font-mono">
                  {simulationMode === 'BUS_FAULT' ? '34.2 kA' : '3.8 kA (Charge)'}
                </span>
              </div>
              <div className="p-2 rounded bg-[#0A0E17] border border-[#1E2634]">
                <span className="text-slate-500 block">Temps d'Élimination Défaut :</span>
                <span className="text-sky-300 font-bold font-mono">
                  {simulationMode === 'BUS_FAULT' ? '18 ms (Ultra-rapide)' : 'N/A'}
                </span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-sans">
              Principe 87B : <span className="text-slate-300 font-mono">Σ I_entrants + Σ I_sortants = 0</span> en régime sain. Un défaut barre rompt la somme de Kirchhoff, déclenchant instantanément tous les disjoncteurs connectés à la section touchée.
            </div>
          </div>

          {/* Representative Applications */}
          <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] text-xs space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              {locale === 'fr' ? 'Applications & Sites Typiques :' : 'Typical Applications & Sites:'}
            </span>
            <p className="text-slate-300 font-sans font-normal text-[11px]">
              {locale === 'fr' ? currentTopology.representative_applications_fr : currentTopology.representative_applications_en}
            </p>
          </div>

        </div>

        {/* Right 5 Cols: Comparative Engineering Matrices & Trade-offs */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222B38] pb-3">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <span>{locale === 'fr' ? 'Analyse Avantages / Limites' : 'Advantages & Trade-Offs'}</span>
          </h4>

          {/* Advantages */}
          <div className="space-y-2">
            <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {locale === 'fr' ? 'Points Forts Clés :' : 'Key Strengths:'}
            </span>
            <div className="space-y-1.5">
              {(locale === 'fr' ? currentTopology.key_advantages_fr : currentTopology.key_advantages_en).map((adv, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-emerald-950/10 border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span className="font-sans font-normal text-[11px] leading-snug">{adv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Limitations */}
          <div className="space-y-2 pt-2 border-t border-[#222B38]">
            <span className="text-[10px] text-rose-400 uppercase font-bold flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {locale === 'fr' ? 'Contraintes & Limites :' : 'Limitations & Vulnerabilities:'}
            </span>
            <div className="space-y-1.5">
              {(locale === 'fr' ? currentTopology.key_limitations_fr : currentTopology.key_limitations_en).map((lim, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-rose-950/10 border border-rose-500/20 text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span className="font-sans font-normal text-[11px] leading-snug">{lim}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantitative Metrics Box */}
          <div className="p-3 rounded-xl bg-[#070A10] border border-[#1E2634] space-y-2 pt-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              {locale === 'fr' ? 'Indicateurs Électrotechniques :' : 'Electrotechnical Metrics:'}
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-500 block">
                  {locale === 'fr' ? 'Ratio Disjoncteur :' : 'Circuit Breaker Ratio:'}
                </span>
                <span className="text-white font-bold text-[11px]">{currentTopology.circuit_breaker_ratio.split(' ')[0]}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-500 block">
                  {locale === 'fr' ? 'Indice Disponibilité :' : 'Availability Score:'}
                </span>
                <span className="text-emerald-400 font-bold text-[11px]">{currentTopology.reliability_score * 10}%</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  )}

</div>
);
};
