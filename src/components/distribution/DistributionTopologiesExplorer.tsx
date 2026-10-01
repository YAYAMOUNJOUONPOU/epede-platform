// src/components/distribution/DistributionTopologiesExplorer.tsx
// EPEDE D05 - Distribution Topologies Explorer (Radial vs Open Ring vs Interconnected)

import React, { useState } from 'react';
import {
  FolderTree,
  Repeat,
  Network,
  Zap,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ShieldCheck,
  TrendingDown,
  Info,
  Building2,
  ArrowRight,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import {
  DISTRIBUTION_TOPOLOGIES,
  type DistributionTopologyModel
} from './data/distributionTopologiesData';

interface DistributionTopologiesExplorerProps {
  locale: 'fr' | 'en';
}

export const DistributionTopologiesExplorer: React.FC<DistributionTopologiesExplorerProps> = ({
  locale
}) => {
  const [activeTopologyId, setActiveTopologyId] = useState<'RADIAL' | 'OPEN_RING' | 'INTERCONNECTED'>('OPEN_RING');
  const [isNopClosed, setIsNopClosed] = useState<boolean>(false);
  const [simulatedFaultNode, setSimulatedFaultNode] = useState<string | null>(null);

  const currentTopology: DistributionTopologyModel =
    DISTRIBUTION_TOPOLOGIES.find((t) => t.id === activeTopologyId) ||
    DISTRIBUTION_TOPOLOGIES[1];

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Topology Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {DISTRIBUTION_TOPOLOGIES.map((topo) => {
          const isSelected = topo.id === activeTopologyId;
          const Icon = topo.id === 'RADIAL' ? FolderTree : topo.id === 'OPEN_RING' ? Repeat : Network;
          return (
            <button
              key={topo.id}
              type="button"
              onClick={() => {
                setActiveTopologyId(topo.id);
                setSimulatedFaultNode(null);
                setIsNopClosed(false);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-xl shadow-amber-500/20 ring-1 ring-amber-300'
                  : 'bg-[#0A0E17] text-slate-300 border-[#222B38] hover:border-amber-500/50 hover:text-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {topo.classification}
                  </span>
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-slate-900' : 'text-amber-400'}`}>
                    {topo.capex_index}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                  <h3 className="text-sm font-bold truncate">
                    {locale === 'fr' ? topo.name_fr : topo.name_en}
                  </h3>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-sans">
                <span className={isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                  SAIDI Indicatif :
                </span>
                <span className={`font-bold font-mono ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`}>
                  ~{topo.saidi_indicative_min} min/an
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Interactive Single-Line Topology Canvas */}
      <div className="p-6 rounded-2xl bg-[#090D15] border border-[#202A3C] shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1D2636]">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {locale === 'fr'
                ? `Schéma Unifilaire & Nœuds Réseau (${currentTopology.name_fr})`
                : `Single-Line Diagram & Network Nodes (${currentTopology.name_en})`}
            </h3>
          </div>

          {/* Interactive NOP Control for Open-Ring */}
          {activeTopologyId === 'OPEN_RING' && (
            <div className="flex items-center gap-2 bg-[#05070B] px-3 py-1.5 rounded-xl border border-amber-900/60">
              <span className="text-xs text-amber-300 font-bold">
                {locale === 'fr' ? 'Point d\'Ouverture Normal (NOP) :' : 'Normally Open Point (NOP):'}
              </span>
              <button
                type="button"
                onClick={() => setIsNopClosed(!isNopClosed)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isNopClosed
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-emerald-600 text-white shadow-xs'
                }`}
              >
                {isNopClosed
                  ? locale === 'fr' ? 'FERMÉ (Boucle Reconfigurée)' : 'CLOSED (Transferred Loop)'
                  : locale === 'fr' ? 'OUVERT (Exploitation Normale)' : 'OPEN (Normal State)'}
              </button>
            </div>
          )}
        </div>

        {/* Visual Multi-Node SLD Bar */}
        <div className="p-4 rounded-xl bg-[#060910] border border-[#182130] overflow-x-auto">
          <div className="flex items-center gap-3 min-w-max py-2">
            {currentTopology.nodes.map((node, index) => {
              const isFaulted = simulatedFaultNode === node.id;
              const isNop = node.type === 'NOP';
              return (
                <React.Fragment key={node.id}>
                  <div
                    onClick={() => {
                      if (node.type !== 'SUBSTATION') {
                        setSimulatedFaultNode(isFaulted ? null : node.id);
                      }
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer min-w-[130px] flex flex-col justify-between ${
                      isFaulted
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500'
                        : isNop
                        ? isNopClosed
                          ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                          : 'bg-slate-900/90 border-slate-700 border-dashed text-slate-400'
                        : 'bg-[#0D131F] border-[#222E42] text-slate-200 hover:border-amber-400'
                    }`}
                    title={locale === 'fr' ? 'Cliquez pour simuler un défaut sur ce composant' : 'Click to simulate a fault on this asset'}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-bold text-amber-400">{node.type}</span>
                      <span className="text-slate-500">{node.voltage}</span>
                    </div>

                    <div className="text-xs font-bold leading-tight my-1 truncate">
                      {locale === 'fr' ? node.label_fr : node.label_en}
                    </div>

                    <div className="text-[10px] flex items-center justify-between mt-1 text-slate-400 font-sans">
                      <span>{node.consumers_count > 0 ? `${node.consumers_count} abs` : 'Transit'}</span>
                      {node.critical_consumers && (
                        <span className="text-rose-400 font-bold">★ Prioritaire</span>
                      )}
                    </div>
                  </div>

                  {index < currentTopology.nodes.length - 1 && (
                    <div className="flex items-center text-slate-600">
                      <div className="w-4 h-0.5 bg-amber-500/40" />
                      <ArrowRight className="h-3 w-3 text-amber-400/60 -ml-1" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Topology Comparative Properties Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#080C14] border border-[#1D2636] space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Principe d\'Exploitation :' : 'Operating Principle:'}</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr' ? currentTopology.operating_principle_fr : currentTopology.operating_principle_en}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080C14] border border-[#1D2636] space-y-2">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertOctagon className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Comportement sur Défaut & Rétablissement :' : 'Fault Response & Restoration:'}</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr' ? currentTopology.fault_behavior_fr : currentTopology.fault_behavior_en}
            </p>
          </div>
        </div>

        {/* Advantages & Limitations Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#070A10] border border-emerald-900/40 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Avantages Électrotechniques :' : 'Electrotechnical Advantages:'}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 font-sans list-disc list-inside">
              {(locale === 'fr' ? currentTopology.advantages_fr : currentTopology.advantages_en).map((adv, i) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#070A10] border border-rose-900/40 space-y-2">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Contraintes & Limites :' : 'Technical Limitations:'}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 font-sans list-disc list-inside">
              {(locale === 'fr' ? currentTopology.limitations_fr : currentTopology.limitations_en).map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
