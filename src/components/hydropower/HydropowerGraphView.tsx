import React, { useState } from 'react';
import {
  Network,
  ArrowRight,
  ArrowLeft,
  Share2,
  ShieldAlert,
  Search,
  CheckCircle2,
  Filter,
  RefreshCw,
  Info,
  Waves,
  Database,
  Shield,
  CircleDot,
  ArrowUpDown,
  Sliders,
  Disc,
  Compass,
  Zap,
  Cpu,
  BatteryCharging,
  Activity,
  Thermometer,
  Layers,
  Droplet,
  Wind,
  Calculator,
  Play,
} from 'lucide-react';
import {
  HYDRO_CANONICAL_GRAPH_NODES,
  HYDRO_CANONICAL_GRAPH_EDGES,
  traverseHydroGraph,
  getProtectionChainForEquipment,
} from '../../data/hydropowerGraphEngine';
import type {
  HydroGraphNode,
  HydroGraphEdge,
  HydroRelationType,
  HydroSubsystemId,
} from '../../types/hydropower';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { InjectedCalculatorContext } from '../../services/routerService';
import type { SimulationTabType } from '../simulation/SimulationLabView';

interface HydropowerGraphViewProps {
  locale: 'fr' | 'en';
  onSelectSubsystem?: (subsystemId: HydroSubsystemId) => void;
  onNavigateCalculator?: (tab: CalculatorTabType, context?: InjectedCalculatorContext) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Waves,
  Database,
  Shield,
  Filter,
  CircleDot,
  ArrowUpDown,
  Sliders,
  Disc,
  Compass,
  Droplet,
  Wind,
  Zap,
  Cpu,
  ShieldAlert,
  BatteryCharging,
  Activity,
  Thermometer,
  Share2,
  Layers,
  Network,
};

const CATEGORY_COLORS: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  civil: { border: 'border-amber-700/60', bg: 'bg-amber-950/20', text: 'text-amber-300', badge: 'bg-amber-950/80 text-amber-300 border-amber-800' },
  hydraulic: { border: 'border-cyan-700/60', bg: 'bg-cyan-950/20', text: 'text-cyan-300', badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
  mechanical: { border: 'border-sky-700/60', bg: 'bg-sky-950/20', text: 'text-sky-300', badge: 'bg-sky-950/80 text-sky-300 border-sky-800' },
  electrical: { border: 'border-yellow-700/60', bg: 'bg-yellow-950/20', text: 'text-yellow-300', badge: 'bg-yellow-950/80 text-yellow-300 border-yellow-800' },
  control: { border: 'border-emerald-700/60', bg: 'bg-emerald-950/20', text: 'text-emerald-300', badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
  protection: { border: 'border-red-700/60', bg: 'bg-red-950/20', text: 'text-red-300', badge: 'bg-red-950/80 text-red-300 border-red-800' },
  auxiliary: { border: 'border-purple-700/60', bg: 'bg-purple-950/20', text: 'text-purple-300', badge: 'bg-purple-950/80 text-purple-300 border-purple-800' },
};

const DOMAIN_EDGE_COLORS: Record<string, string> = {
  hydraulic: 'border-cyan-500 text-cyan-300 bg-cyan-950/40',
  mechanical: 'border-sky-500 text-sky-300 bg-sky-950/40',
  electrical: 'border-yellow-500 text-yellow-300 bg-yellow-950/40',
  control: 'border-emerald-500 text-emerald-300 bg-emerald-950/40',
  protection: 'border-red-500 text-red-300 bg-red-950/40',
  auxiliary: 'border-purple-500 text-purple-300 bg-purple-950/40',
};

export const HydropowerGraphView: React.FC<HydropowerGraphViewProps> = ({
  locale,
  onSelectSubsystem,
  onNavigateCalculator,
  onNavigateSimulation,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-h09'); // Default: Synchronous Generator
  const [traversalDirection, setTraversalDirection] = useState<'upstream' | 'downstream' | 'all'>('all');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProtectionMode, setIsProtectionMode] = useState<boolean>(false);

  // Compute traversal result based on direction and selection
  const traversalResult = isProtectionMode
    ? getProtectionChainForEquipment(selectedNodeId)
    : traverseHydroGraph(selectedNodeId, traversalDirection);

  const selectedNode = HYDRO_CANONICAL_GRAPH_NODES.find((n) => n.id === selectedNodeId) || HYDRO_CANONICAL_GRAPH_NODES[0];

  // Filter edges if a domain filter is active
  const filteredEdges = traversalResult.edges.filter((e) => {
    if (selectedDomainFilter === 'all') return true;
    return e.energyDomain === selectedDomainFilter;
  });

  // Nodes connected to current selection
  const directInboundEdges = HYDRO_CANONICAL_GRAPH_EDGES.filter((e) => e.targetId === selectedNodeId);
  const directOutboundEdges = HYDRO_CANONICAL_GRAPH_EDGES.filter((e) => e.sourceId === selectedNodeId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[#252E38] bg-linear-to-r from-[#0D1117] via-[#0B1522] to-[#0A1A24] p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-widest px-2.5 py-0.5 rounded bg-sky-950/60 border border-sky-800">
                {locale === 'fr' ? 'MOTEUR DE GRAPH KNOWLEDGE EPEDE' : 'EPEDE GRAPH KNOWLEDGE ENGINE'}
              </span>
              <span className="font-mono text-xs text-neutral-400">
                {HYDRO_CANONICAL_GRAPH_NODES.length} {locale === 'fr' ? 'Nœuds Physiques' : 'Physical Nodes'} · {HYDRO_CANONICAL_GRAPH_EDGES.length} {locale === 'fr' ? 'Relations Formelles' : 'Formal Relations'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              {locale === 'fr' ? 'Ontologie de Graphe & Traçabilité Bi-Directionnelle' : 'Graph Ontology & Bi-Directional Traversal'}
            </h2>
            <p className="text-sm text-neutral-300 mt-1 max-w-3xl">
              {locale === 'fr'
                ? 'Naviguez les chaînes causales amont/aval, les flux énergétiques croisés (hydraulique, mécanique, électrique), les boucles d\'asservissement et les matrices de déclenchement de protection.'
                : 'Traverse upstream/downstream causal pathways, coupled cross-domain energy transfers (hydraulic, mechanical, electrical), control loops, and protection trip matrices.'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsProtectionMode(false);
                setTraversalDirection('all');
              }}
              className={`px-3 py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                !isProtectionMode
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-md'
                  : 'bg-neutral-900 text-neutral-400 border-[#252E38] hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5 inline mr-1.5" />
              <span>{locale === 'fr' ? 'Graphe d\'Énergie & Contrôle' : 'Energy & Control Graph'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsProtectionMode(true)}
              className={`px-3 py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
                isProtectionMode
                  ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-md'
                  : 'bg-neutral-900 text-neutral-400 border-[#252E38] hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 inline mr-1.5 text-red-400" />
              <span>{locale === 'fr' ? 'Matrice Déclenchements Protection' : 'Protection Trip Matrix'}</span>
            </button>
          </div>
        </div>

        {/* Direction Controls & Filter Toolbar */}
        {!isProtectionMode && (
          <div className="mt-5 pt-4 border-t border-[#252E38] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-neutral-400 font-bold mr-1">
                {locale === 'fr' ? 'Direction de Traçabilité :' : 'Traversal Direction:'}
              </span>
              {[
                { dir: 'all', labelFr: 'Tout le Voisinage', labelEn: 'Full Neighborhood', icon: Share2 },
                { dir: 'upstream', labelFr: 'Amont (Origines & Fluide)', labelEn: 'Upstream (Causes/Inflow)', icon: ArrowLeft },
                { dir: 'downstream', labelFr: 'Aval (Transmission & Évacuation)', labelEn: 'Downstream (Evacuation)', icon: ArrowRight },
              ].map((d) => (
                <button
                  key={d.dir}
                  type="button"
                  onClick={() => setTraversalDirection(d.dir as typeof traversalDirection)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all ${
                    traversalDirection === d.dir
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-[#161D27] text-neutral-400 hover:text-white border border-[#252E38]'
                  }`}
                >
                  <d.icon className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? d.labelFr : d.labelEn}</span>
                </button>
              ))}
            </div>

            {/* Energy Domain Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="font-mono text-xs text-neutral-400 font-bold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Filtre Domaine :' : 'Domain:'}</span>
              </span>
              {['all', 'hydraulic', 'mechanical', 'electrical', 'control', 'protection', 'auxiliary'].map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setSelectedDomainFilter(dom)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold capitalize transition-all ${
                    selectedDomainFilter === dom
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60'
                      : 'bg-[#161D27] text-neutral-400 hover:text-white border border-transparent'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Traversal Summary Pill */}
      <div className="p-3.5 rounded-xl bg-[#090D14] border border-[#252E38] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-neutral-300">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{locale === 'fr' ? traversalResult.explanation.fr : traversalResult.explanation.en}</span>
        </div>
        <span className="font-bold text-sky-400 shrink-0 ml-3">
          {traversalResult.nodes.length} {locale === 'fr' ? 'nœuds' : 'nodes'} · {filteredEdges.length} {locale === 'fr' ? 'arêtes' : 'edges'}
        </span>
      </div>

      {/* GRAPH MAIN INTERACTION GRID: 3 COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 4 COLS: NODE SELECTION LIST */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider">
              {locale === 'fr' ? 'Points d\'Ancrage Graphiques' : 'Knowledge Graph Nodes'}
            </h3>
            <span className="font-mono text-[10px] text-neutral-500">
              {HYDRO_CANONICAL_GRAPH_NODES.length} {locale === 'fr' ? 'composants' : 'items'}
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
            <input
              type="text"
              placeholder={locale === 'fr' ? 'Rechercher un composant...' : 'Search component...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#252E38] rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Nodes list */}
          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
            {HYDRO_CANONICAL_GRAPH_NODES.filter((node) => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return (
                node.id.toLowerCase().includes(q) ||
                node.subsystemId.toLowerCase().includes(q) ||
                node.label.fr.toLowerCase().includes(q) ||
                node.label.en.toLowerCase().includes(q) ||
                node.category.toLowerCase().includes(q)
              );
            }).map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isInActiveTraversal = traversalResult.nodes.some((n) => n.id === node.id);
              const IconComp = ICON_MAP[node.iconName] || CircleDot;
              const catStyle = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.hydraulic;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-sky-400 bg-sky-950/40 text-sky-200 ring-1 ring-sky-400 shadow-md'
                      : isInActiveTraversal
                      ? 'border-[#252E38] bg-[#0A1017] text-neutral-300 hover:border-sky-600'
                      : 'border-[#1E2530] bg-[#080B10] text-neutral-500 opacity-60 hover:opacity-100 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-500/20 text-sky-300' : 'bg-[#141A24] text-neutral-400'}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-sky-400 px-1 rounded bg-[#101722] border border-sky-900">
                          {node.subsystemId}
                        </span>
                        <span className={`text-[10px] font-mono uppercase px-1 rounded ${catStyle.badge}`}>
                          {node.category}
                        </span>
                      </div>
                      <div className="font-mono text-xs font-bold text-white truncate mt-0.5">
                        {locale === 'fr' ? node.label.fr : node.label.en}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0 shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CENTER & RIGHT 8 COLS: SELECTED NODE TOPOLOGY & TRAVERSED EDGES */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Node Card */}
          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#252E38]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-300">
                  {React.createElement(ICON_MAP[selectedNode.iconName] || CircleDot, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-950 border border-sky-800">
                      {selectedNode.subsystemId} · {selectedNode.id}
                    </span>
                    <span className="font-mono text-xs text-neutral-500 capitalize">
                      {selectedNode.category} · {selectedNode.domainLayer}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white font-mono mt-1">
                    {locale === 'fr' ? selectedNode.label.fr : selectedNode.label.en}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {onSelectSubsystem && (
                  <button
                    type="button"
                    onClick={() => onSelectSubsystem(selectedNode.subsystemId)}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold transition-all shadow-xs"
                  >
                    {locale === 'fr' ? `Détails ${selectedNode.subsystemId}` : `Inspect ${selectedNode.subsystemId}`}
                  </button>
                )}

                {/* Direct Solvers & Simulation Bridge */}
                {selectedNode.category === 'electrical' && onNavigateCalculator && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedNode.id.includes('trafo') || selectedNode.subsystemId === 'H10') {
                        onNavigateCalculator('transformer', {
                          equipmentId: selectedNode.id,
                          equipmentName: locale === 'fr' ? selectedNode.label.fr : selectedNode.label.en,
                          equipmentTag: selectedNode.id,
                          params: {
                            trafoKva: 63000,
                            trafoHvKv: 225,
                            trafoLvV: 10500,
                            trafoUkPercent: 12.0,
                          },
                        });
                      } else {
                        onNavigateCalculator('power', {
                          equipmentId: selectedNode.id,
                          equipmentName: locale === 'fr' ? selectedNode.label.fr : selectedNode.label.en,
                          equipmentTag: selectedNode.id,
                          params: {
                            voltageKv: 10.5,
                            powerMva: 48,
                            cosPhi: 0.85,
                          },
                        });
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold transition-all"
                  >
                    <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{locale === 'fr' ? 'Calcul Électrique' : 'Electrical Calc'}</span>
                  </button>
                )}

                {selectedNode.category === 'electrical' && onNavigateSimulation && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedNode.id.includes('trafo') || selectedNode.subsystemId === 'H10') {
                        onNavigateSimulation('differential-protection');
                      } else {
                        onNavigateSimulation('generator-capability');
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold transition-all"
                  >
                    <Play className="w-3.5 h-3.5 text-amber-400" />
                    <span>{locale === 'fr' ? 'Simulateur' : 'Simulation'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Direct Inbound / Outbound Micro-Flow */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Inbound relations */}
              <div className="p-3.5 rounded-xl bg-[#080B10] border border-[#252E38]">
                <div className="flex items-center gap-2 mb-2 font-mono text-[11px] font-bold text-emerald-400 uppercase">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Flux & Causes Entrants' : 'Inbound Causes / Feeds'} ({directInboundEdges.length})</span>
                </div>
                {directInboundEdges.length === 0 ? (
                  <p className="text-xs text-neutral-500 font-mono italic">
                    {locale === 'fr' ? 'Point d\'origine primaire (aucun prédécesseur direct)' : 'Primary root node (no direct upstream predecessors)'}
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {directInboundEdges.map((e) => {
                      const srcNode = HYDRO_CANONICAL_GRAPH_NODES.find((n) => n.id === e.sourceId);
                      return (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => setSelectedNodeId(e.sourceId)}
                          className="w-full text-left p-2 rounded-lg bg-[#111722] hover:bg-[#182233] border border-[#1F2937] transition-all flex items-center justify-between text-xs font-mono group"
                        >
                          <div>
                            <span className="text-neutral-400 group-hover:text-white">
                              {srcNode ? (locale === 'fr' ? srcNode.label.fr : srcNode.label.en) : e.sourceId}
                            </span>
                            <div className="text-[10px] text-emerald-300 font-bold">
                              {locale === 'fr' ? e.label.fr : e.label.en}
                            </div>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-neutral-500 px-1 rounded bg-[#0A0E17]">
                            {e.relation}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Outbound relations */}
              <div className="p-3.5 rounded-xl bg-[#080B10] border border-[#252E38]">
                <div className="flex items-center gap-2 mb-2 font-mono text-[11px] font-bold text-sky-400 uppercase">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Actions & Effets Sortants' : 'Outbound Actions / Trip Targets'} ({directOutboundEdges.length})</span>
                </div>
                {directOutboundEdges.length === 0 ? (
                  <p className="text-xs text-neutral-500 font-mono italic">
                    {locale === 'fr' ? 'Nœud terminal d\'injection (aucun successeur direct)' : 'Terminal export node (no direct outbound targets)'}
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {directOutboundEdges.map((e) => {
                      const tgtNode = HYDRO_CANONICAL_GRAPH_NODES.find((n) => n.id === e.targetId);
                      return (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => setSelectedNodeId(e.targetId)}
                          className="w-full text-left p-2 rounded-lg bg-[#111722] hover:bg-[#182233] border border-[#1F2937] transition-all flex items-center justify-between text-xs font-mono group"
                        >
                          <div>
                            <span className="text-neutral-400 group-hover:text-white">
                              {tgtNode ? (locale === 'fr' ? tgtNode.label.fr : tgtNode.label.en) : e.targetId}
                            </span>
                            <div className="text-[10px] text-sky-300 font-bold">
                              {locale === 'fr' ? e.label.fr : e.label.en}
                            </div>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-neutral-500 px-1 rounded bg-[#0A0E17]">
                            {e.relation}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Traversal Chain Graph Table */}
          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0D1117] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <Network className="w-4 h-4 text-sky-400" />
                <span>{locale === 'fr' ? 'Arêtes Traverses du Sous-Graphe Actif' : 'Traversed Subgraph Formal Edges'}</span>
              </h4>
              <span className="font-mono text-xs font-bold text-sky-400 bg-[#080B10] px-2 py-0.5 rounded border border-[#252E38]">
                {filteredEdges.length} {locale === 'fr' ? 'liaisons physiques' : 'physical connections'}
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredEdges.map((edge) => {
                const srcNode = HYDRO_CANONICAL_GRAPH_NODES.find((n) => n.id === edge.sourceId);
                const tgtNode = HYDRO_CANONICAL_GRAPH_NODES.find((n) => n.id === edge.targetId);
                const badgeColor = DOMAIN_EDGE_COLORS[edge.energyDomain] || 'border-neutral-700 text-neutral-300 bg-neutral-900';

                return (
                  <div
                    key={edge.id}
                    className="p-3 rounded-xl bg-[#090D14] border border-[#252E38] hover:border-neutral-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => setSelectedNodeId(edge.sourceId)}
                        className="font-bold text-white hover:text-sky-300 transition-colors truncate max-w-[140px] text-left"
                      >
                        {srcNode ? (locale === 'fr' ? srcNode.label.fr : srcNode.label.en) : edge.sourceId}
                      </button>

                      <span className="text-neutral-500">→</span>

                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase shrink-0 ${badgeColor}`}>
                        {edge.relation}
                      </span>

                      <span className="text-neutral-500">→</span>

                      <button
                        type="button"
                        onClick={() => setSelectedNodeId(edge.targetId)}
                        className="font-bold text-white hover:text-sky-300 transition-colors truncate max-w-[140px] text-left"
                      >
                        {tgtNode ? (locale === 'fr' ? tgtNode.label.fr : tgtNode.label.en) : edge.targetId}
                      </button>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-neutral-300 font-medium">
                        {locale === 'fr' ? edge.label.fr : edge.label.en}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
