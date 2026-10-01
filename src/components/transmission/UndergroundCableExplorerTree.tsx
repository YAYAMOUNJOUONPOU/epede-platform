// src/components/transmission/UndergroundCableExplorerTree.tsx
// EPEDE D03 - Underground Cable (UGC) Explorer Tree with Concentric Cross-Section CAD & Cross-Bonding Simulator

import React, { useState, useMemo } from 'react';
import {
  FolderTree,
  ChevronRight,
  ChevronDown,
  Layers,
  ShieldAlert,
  Wrench,
  BookOpen,
  Search,
  Activity,
  Sliders,
  CheckCircle2,
  Cpu,
  Target
} from 'lucide-react';
import { UGC_EXPLORER_TREE } from './data/transmissionData';
import type { UgcComponentNode } from './types';

interface UndergroundCableExplorerTreeProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (equipmentId: string) => void;
}

export const UndergroundCableExplorerTree: React.FC<UndergroundCableExplorerTreeProps> = ({
  locale,
  onSelectEquipment
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ugc-crossbonding');
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(
    new Set(['ugc-root', 'ugc-core', 'ugc-dielectric', 'ugc-sheath', 'ugc-crossbonding', 'ugc-terminations'])
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Cross-Bonding Demonstrator State
  const [bondingMode, setBondingMode] = useState<'CROSS_BONDING' | 'SOLID_BONDING' | 'SINGLE_POINT'>('CROSS_BONDING');
  const [loadCurrentA, setLoadCurrentA] = useState<number>(850);
  const [minorSectionKm, setMinorSectionKm] = useState<number>(0.65);

  // Toggle tree expansion
  const toggleExpand = (id: string) => {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Recursive search
  const findNode = (node: UgcComponentNode, id: string): UgcComponentNode | null => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = useMemo(
    () => findNode(UGC_EXPLORER_TREE, selectedNodeId) || UGC_EXPLORER_TREE,
    [selectedNodeId]
  );

  // Sheath Electrical Calculations
  // Induced voltage: E = I * omega * M * L (approx M = 0.2 mH/km => omega*M ~ 0.063 ohm/km)
  const inducedVoltagePerSection = Math.round(loadCurrentA * 0.063 * minorSectionKm);
  const circulatingCurrentA =
    bondingMode === 'SOLID_BONDING'
      ? Math.round(inducedVoltagePerSection / (0.15 * minorSectionKm))
      : bondingMode === 'CROSS_BONDING'
      ? Math.round(inducedVoltagePerSection * 0.05) // 95% cancellation in cross-bonding
      : 0; // zero in single-point
  const sheathJouleLossesKW = Math.round((3 * (circulatingCurrentA ** 2) * (0.15 * minorSectionKm * 3)) / 1000);

  // Recursive Tree Item
  const renderTreeItem = (node: UgcComponentNode) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodeIds.has(node.id);
    const isSelected = selectedNodeId === node.id;

    return (
      <div key={node.id} className="space-y-0.5">
        <div
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer select-none ${
            isSelected
              ? 'bg-amber-500/20 text-white border border-amber-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#161B22]'
          }`}
          onClick={() => {
            setSelectedNodeId(node.id);
            if (hasChildren && !isExpanded) toggleExpand(node.id);
          }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              className="p-0.5 hover:text-white"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              )}
            </button>
          ) : (
            <span className="w-3.5 text-center text-slate-600">·</span>
          )}

          <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {node.code}
          </span>

          <span className="truncate flex-1">
            {locale === 'fr' ? node.label_fr : node.label_en}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="pl-4 border-l border-[#252E38] ml-2 space-y-0.5">
            {node.children!.map((child) => renderTreeItem(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161B22] border border-[#252E38]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              PILLIER 3 · ARBORESCENCE TECHNIQUE CÂBLES SOUTERRAINS HT (UGC)
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono mt-1 flex items-center gap-2">
              <Layers className="h-5 w-5 text-amber-400" />
              <span>
                {locale === 'fr'
                  ? 'Arborescence Câble Souterrain XLPE & Système Cross-Bonding'
                  : 'Underground XLPE Cable Tree & Cross-Bonding System'}
              </span>
            </h2>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder={locale === 'fr' ? 'Filtrer composants, normes...' : 'Filter components, codes...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#252E38] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Explorer Tree (5 Cols) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-3">
          <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              {locale === 'fr' ? 'Arborescence Câble HTB' : 'HV Cable Breakdown Tree'}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              CEI 60840 / 62067 / CIGRE 283
            </span>
          </div>

          <div className="max-h-[620px] overflow-y-auto pr-1 space-y-1">
            {renderTreeItem(UGC_EXPLORER_TREE)}
          </div>
        </div>

        {/* Right Column: Concentric Cross-Section CAD & Cross-Bonding Simulator (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Concentric Cable Radial Slice CAD */}
          <div className="p-4 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-400" />
                <span>{locale === 'fr' ? 'Coupe Radiale Concentrique du Câble 225 kV XLPE' : '225 kV XLPE Concentric Cable Cross-Section CAD'}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {locale === 'fr' ? 'Cliquez sur les anneaux' : 'Click concentric ring'}
              </span>
            </div>

            {/* High-Contrast SVG Concentric Cable Cross-Section */}
            <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] flex flex-col items-center justify-center">
              <svg viewBox="0 0 360 260" className="w-full max-w-sm h-auto">
                {/* Outer HDPE Sheath (Outer Layer) */}
                <circle
                  cx="180"
                  cy="130"
                  r="115"
                  fill="#0F172A"
                  stroke={selectedNodeId === 'ugc-sheath' ? '#F59E0B' : '#475569'}
                  strokeWidth="6"
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedNodeId('ugc-sheath')}
                />

                {/* Metallic Sheath (Corrugated Aluminum) */}
                <circle
                  cx="180"
                  cy="130"
                  r="98"
                  fill="#1E293B"
                  stroke={selectedNodeId === 'ugc-sheath' ? '#38BDF8' : '#64748B'}
                  strokeWidth="5"
                  strokeDasharray="4 2"
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedNodeId('ugc-sheath')}
                />

                {/* Outer Semi-Con Screen */}
                <circle
                  cx="180"
                  cy="130"
                  r="88"
                  fill="#0D1117"
                  stroke="#10B981"
                  strokeWidth="3"
                  className="cursor-pointer"
                  onClick={() => setSelectedNodeId('ugc-dielectric')}
                />

                {/* XLPE Dielectric Insulation */}
                <circle
                  cx="180"
                  cy="130"
                  r="82"
                  fill="#334155"
                  stroke={selectedNodeId === 'ugc-dielectric' ? '#38BDF8' : '#475569'}
                  strokeWidth="2"
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedNodeId('ugc-dielectric')}
                />

                {/* Inner Semi-Con Screen */}
                <circle
                  cx="180"
                  cy="130"
                  r="52"
                  fill="#0D1117"
                  stroke="#10B981"
                  strokeWidth="3"
                  className="cursor-pointer"
                  onClick={() => setSelectedNodeId('ugc-core')}
                />

                {/* Segmented Copper Milliken Core (4 Segments) */}
                <circle
                  cx="180"
                  cy="130"
                  r="48"
                  fill={selectedNodeId === 'ugc-core' ? '#EA580C' : '#C2410C'}
                  className="cursor-pointer"
                  onClick={() => setSelectedNodeId('ugc-core')}
                />
                {/* Milliken Segment Dividers */}
                <line x1="180" y1="82" x2="180" y2="178" stroke="#1E293B" strokeWidth="2" />
                <line x1="132" y1="130" x2="228" y2="130" stroke="#1E293B" strokeWidth="2" />

                {/* Labels */}
                <text x="180" y="134" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  Cuivre 1200 mm²
                </text>
                <text x="180" y="65" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  Isolant XLPE (23 mm)
                </text>
                <text x="180" y="22" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  Gaine PE Extérieure + Écran Al
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600 inline-block" /> Âme Cuivre Milliken
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" /> Isolant XLPE Super-Clean
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" /> Écran Al Ondulé
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 inline-block" /> Gaine PE
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Cross-Bonding Simulator */}
          <div className="p-4 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>{locale === 'fr' ? 'Simulateur de Régime de Mise à la Terre des Écrans' : 'Sheath Earthing & Cross-Bonding Simulator'}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                IEEE 575 / CIGRE 283
              </span>
            </div>

            {/* Mode Selector Buttons */}
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setBondingMode('CROSS_BONDING')}
                className={`py-2 px-3 rounded-xl border text-center transition-all ${
                  bondingMode === 'CROSS_BONDING'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-[#0D1117] border-[#252E38] text-slate-400 hover:text-white'
                }`}
              >
                1. Cross-Bonding (Permuté)
              </button>
              <button
                type="button"
                onClick={() => setBondingMode('SOLID_BONDING')}
                className={`py-2 px-3 rounded-xl border text-center transition-all ${
                  bondingMode === 'SOLID_BONDING'
                    ? 'bg-red-500/20 border-red-500 text-red-300 font-bold'
                    : 'bg-[#0D1117] border-[#252E38] text-slate-400 hover:text-white'
                }`}
              >
                2. Solid-Bonding (Direct)
              </button>
              <button
                type="button"
                onClick={() => setBondingMode('SINGLE_POINT')}
                className={`py-2 px-3 rounded-xl border text-center transition-all ${
                  bondingMode === 'SINGLE_POINT'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-[#0D1117] border-[#252E38] text-slate-400 hover:text-white'
                }`}
              >
                3. Single-Point (Unilatéral)
              </button>
            </div>

            {/* Live Parameter Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Courant de Charge Phase :</span>
                  <span className="text-white font-bold">{loadCurrentA} A</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="50"
                  value={loadCurrentA}
                  onChange={(e) => setLoadCurrentA(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Longueur Section Mineure :</span>
                  <span className="text-white font-bold">{minorSectionKm} km</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.2"
                  step="0.05"
                  value={minorSectionKm}
                  onChange={(e) => setMinorSectionKm(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Computed Results Dashboard */}
            <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
              <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <div className="text-[10px] text-slate-500 uppercase">Tension Induite Gaine</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">
                  {inducedVoltagePerSection} V
                </div>
                <div className="text-[10px] text-slate-500">Limite &lt; 65 V (CEI)</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <div className="text-[10px] text-slate-500 uppercase">Courant Circulation</div>
                <div className={`text-base font-bold mt-0.5 ${
                  circulatingCurrentA > 100 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {circulatingCurrentA} A
                </div>
                <div className="text-[10px] text-slate-500">
                  {bondingMode === 'CROSS_BONDING' ? 'Neutralisé à 95%' : 'Boucle fermée'}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0D1117] border border-[#252E38]">
                <div className="text-[10px] text-slate-500 uppercase">Pertes Joules Gaine</div>
                <div className={`text-base font-bold mt-0.5 ${
                  sheathJouleLossesKW > 10 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {sheathJouleLossesKW} kW
                </div>
                <div className="text-[10px] text-slate-500">Sur section majeure</div>
              </div>
            </div>
          </div>

          {/* Selected Component Technical Sheet */}
          <div className="p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {selectedNode.code} · NIVEAU {selectedNode.level}
                </span>
                <h3 className="text-base font-bold text-white font-mono mt-1">
                  {locale === 'fr' ? selectedNode.label_fr : selectedNode.label_en}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  {locale === 'fr' ? selectedNode.subsystem_fr : selectedNode.subsystem_en}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#0D1117] p-3 rounded-xl border border-[#252E38]">
              {locale === 'fr' ? selectedNode.description_fr : selectedNode.description_en}
            </p>

            {/* Technical Specifications */}
            {selectedNode.technical_specs && selectedNode.technical_specs.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase">
                  {locale === 'fr' ? 'Spécifications Techniques Nominales' : 'Rated Technical Specifications'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {selectedNode.technical_specs.map((spec, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38] flex justify-between">
                      <span className="text-slate-400">{spec.key}</span>
                      <span className="text-white font-bold">
                        {spec.value} {spec.unit || ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
