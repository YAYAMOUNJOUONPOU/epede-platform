// src/components/transmission/OverheadLineExplorerTree.tsx
// EPEDE D03 - Overhead-Line (OHL) Explorer Tree with Interactive Tower CAD

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
  CheckCircle,
  Cpu,
  Info,
  ExternalLink,
  Target
} from 'lucide-react';
import { OHL_EXPLORER_TREE } from './data/transmissionData';
import type { OhlComponentNode } from './types';

interface OverheadLineExplorerTreeProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (equipmentId: string) => void;
}

export const OverheadLineExplorerTree: React.FC<OverheadLineExplorerTreeProps> = ({
  locale,
  onSelectEquipment
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ohl-towers');
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(
    new Set(['ohl-root', 'ohl-towers', 'ohl-conductors', 'ohl-insulators'])
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCadHotspot, setActiveCadHotspot] = useState<string | null>(null);

  // Toggle tree expansion
  const toggleExpand = (id: string) => {
    setExpandedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Find node by id recursively
  const findNode = (node: OhlComponentNode, id: string): OhlComponentNode | null => {
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
    () => findNode(OHL_EXPLORER_TREE, selectedNodeId) || OHL_EXPLORER_TREE,
    [selectedNodeId]
  );

  // Recursive Tree Item Renderer
  const renderTreeItem = (node: OhlComponentNode) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodeIds.has(node.id);
    const isSelected = selectedNodeId === node.id;

    // Filter match check
    const matchesSearch =
      !searchQuery ||
      node.label_fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.label_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.code.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      <div key={node.id} className="space-y-0.5">
        <div
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer select-none ${
            isSelected
              ? 'bg-sky-500/20 text-white border border-sky-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#161B22]'
          } ${!matchesSearch && searchQuery ? 'opacity-40' : ''}`}
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
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
              PILLIER 2 · ARBORESCENCE TECHNIQUE LIGNES AÉRIENNES (OHL)
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono mt-1 flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-sky-400" />
              <span>
                {locale === 'fr'
                  ? 'Arborescence & Décomposition Système Ligne Aérienne HTB'
                  : 'Overhead Line (OHL) System Decomposition & CAD Explorer'}
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
              className="w-full bg-[#0D1117] border border-[#252E38] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Explorer Tree Structure (5 Cols) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-3">
          <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              {locale === 'fr' ? 'Arborescence des Composants' : 'Component Hierarchy Tree'}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              CEI 60826 / NF C 11-201
            </span>
          </div>

          <div className="max-h-[620px] overflow-y-auto pr-1 space-y-1">
            {renderTreeItem(OHL_EXPLORER_TREE)}
          </div>
        </div>

        {/* Right Column: Interactive Tower CAD & Component Technical Sheet (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Interactive 225 kV Steel Lattice Tower CAD Schematic */}
          <div className="p-4 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-400" />
                <span>{locale === 'fr' ? 'Pylône Treillis 225 kV · Vue Schématique CAD' : '225 kV Lattice Tower CAD Hotspots'}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {locale === 'fr' ? 'Cliquez sur un élément' : 'Click hotspot to select'}
              </span>
            </div>

            {/* High-Contrast Interactive SVG Tower */}
            <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] flex flex-col items-center justify-center relative">
              <svg viewBox="0 0 400 320" className="w-full max-w-md h-auto">
                {/* Ground plane */}
                <line x1="20" y1="290" x2="380" y2="290" stroke="#475569" strokeWidth="2" strokeDasharray="4 2" />
                <text x="30" y="305" fill="#64748B" fontSize="9" fontFamily="monospace">Niveau du Sol (0.0 m)</text>

                {/* Footings / Foundations */}
                <rect
                  x="110"
                  y="290"
                  width="35"
                  height="22"
                  fill={selectedNodeId === 'ohl-foundations' ? '#38BDF8' : '#334155'}
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedNodeId('ohl-foundations')}
                />
                <rect
                  x="255"
                  y="290"
                  width="35"
                  height="22"
                  fill={selectedNodeId === 'ohl-foundations' ? '#38BDF8' : '#334155'}
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedNodeId('ohl-foundations')}
                />
                <text x="115" y="305" fill="#0F172A" fontSize="8" fontWeight="bold">Massif</text>
                <text x="260" y="305" fill="#0F172A" fontSize="8" fontWeight="bold">Massif</text>

                {/* Ground grid / Footing */}
                <line x1="127" y1="312" x2="90" y2="318" stroke="#EF4444" strokeWidth="2" />
                <line x1="272" y1="312" x2="310" y2="318" stroke="#EF4444" strokeWidth="2" />
                <text x="315" y="318" fill="#EF4444" fontSize="8" fontFamily="monospace">Terre &lt; 10 Ω</text>

                {/* Tower Base Truss */}
                <line x1="127" y1="290" x2="165" y2="180" stroke="#94A3B8" strokeWidth="2.5" />
                <line x1="273" y1="290" x2="235" y2="180" stroke="#94A3B8" strokeWidth="2.5" />
                {/* Cross Bracing */}
                <line x1="127" y1="290" x2="235" y2="235" stroke="#475569" strokeWidth="1" />
                <line x1="273" y1="290" x2="165" y2="235" stroke="#475569" strokeWidth="1" />
                <line x1="146" y1="235" x2="254" y2="235" stroke="#64748B" strokeWidth="1.5" />
                <line x1="146" y1="235" x2="235" y2="180" stroke="#475569" strokeWidth="1" />
                <line x1="254" y1="235" x2="165" y2="180" stroke="#475569" strokeWidth="1" />

                {/* Tower Waist & Body */}
                <line x1="165" y1="180" x2="185" y2="50" stroke="#94A3B8" strokeWidth="2" />
                <line x1="235" y1="180" x2="215" y2="50" stroke="#94A3B8" strokeWidth="2" />
                <line x1="165" y1="180" x2="235" y2="180" stroke="#64748B" strokeWidth="1.5" />

                {/* Crossarm Lower (Bottom Phase) */}
                <line x1="100" y1="160" x2="300" y2="160" stroke="#CBD5E1" strokeWidth="3" />
                {/* Insulator String 1 & Conductor */}
                <line x1="110" y1="160" x2="110" y2="195" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
                <circle
                  cx="110"
                  cy="200"
                  r="6"
                  fill={selectedNodeId === 'ohl-conductors' ? '#F59E0B' : '#38BDF8'}
                  className="cursor-pointer"
                  onClick={() => setSelectedNodeId('ohl-conductors')}
                />
                <circle cx="116" cy="200" r="6" fill="#F59E0B" className="cursor-pointer" onClick={() => setSelectedNodeId('ohl-conductors')} />

                {/* Crossarm Middle */}
                <line x1="115" y1="115" x2="285" y2="115" stroke="#CBD5E1" strokeWidth="3" />
                <line x1="125" y1="115" x2="125" y2="150" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
                <circle cx="125" cy="155" r="6" fill="#F59E0B" className="cursor-pointer" onClick={() => setSelectedNodeId('ohl-conductors')} />
                <circle cx="131" cy="155" r="6" fill="#F59E0B" className="cursor-pointer" onClick={() => setSelectedNodeId('ohl-conductors')} />

                {/* Crossarm Top */}
                <line x1="130" y1="70" x2="270" y2="70" stroke="#CBD5E1" strokeWidth="3" />
                <line x1="140" y1="70" x2="140" y2="105" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
                <circle cx="140" cy="110" r="6" fill="#F59E0B" className="cursor-pointer" onClick={() => setSelectedNodeId('ohl-conductors')} />
                <circle cx="146" cy="110" r="6" fill="#F59E0B" className="cursor-pointer" onClick={() => setSelectedNodeId('ohl-conductors')} />

                {/* Right side insulators & conductors */}
                <line x1="290" y1="160" x2="290" y2="195" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
                <circle cx="290" cy="200" r="6" fill="#F59E0B" className="cursor-pointer" onClick={() => setSelectedNodeId('ohl-conductors')} />
                <circle cx="296" cy="200" r="6" fill="#F59E0B" className="cursor-pointer" onClick={() => setSelectedNodeId('ohl-conductors')} />

                <line x1="275" y1="115" x2="275" y2="150" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
                <circle cx="275" cy="155" r="6" fill="#F59E0B" className="cursor-pointer" onClick={() => setSelectedNodeId('ohl-conductors')} />
                <circle cx="281" cy="155" r="6" fill="#F59E0B" className="cursor-pointer" onClick={() => setSelectedNodeId('ohl-conductors')} />

                <line x1="260" y1="70" x2="260" y2="105" stroke="#38BDF8" strokeWidth="2" strokeDasharray="2 2" />
                <circle cx="260" cy="110" r="6" fill="#F59E0B" className="cursor-pointer" onClick={() => setSelectedNodeId('ohl-conductors')} />
                <circle cx="266" cy="110" r="6" fill="#F59E0B" className="cursor-pointer" onClick={() => setSelectedNodeId('ohl-conductors')} />

                {/* Peak / Earthwire Peak */}
                <line x1="185" y1="50" x2="200" y2="20" stroke="#94A3B8" strokeWidth="2" />
                <line x1="215" y1="50" x2="200" y2="20" stroke="#94A3B8" strokeWidth="2" />
                <circle
                  cx="200"
                  cy="18"
                  r="5"
                  fill={selectedNodeId === 'ohl-shield-wires' ? '#10B981' : '#E2E8F0'}
                  className="cursor-pointer"
                  onClick={() => setSelectedNodeId('ohl-shield-wires')}
                />
                <text
                  x="215"
                  y="20"
                  fill="#10B981"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="cursor-pointer"
                  onClick={() => setSelectedNodeId('ohl-shield-wires')}
                >
                  OPGW (Foudre + 48 FO)
                </text>

                {/* Hotspot callout tags */}
                <text x="25" y="165" fill="#38BDF8" fontSize="8" fontFamily="monospace">Console Bras Inf.</text>
                <text x="35" y="210" fill="#F59E0B" fontSize="8" fontFamily="monospace">Faisceau Bifilaire</text>
                <text x="200" y="270" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  Pylône Treillis Acier Galva (Hauteur 42.5 m)
                </text>
              </svg>
            </div>
          </div>

          {/* Selected Component Technical Dossier */}
          <div className="p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
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

            {/* Technical Specifications Table */}
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

            {/* Standards & FMECA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#252E38]">
              {/* Governing Standards */}
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-sky-400 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  NORMES APPLICABLES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.governing_standards.map((std, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {std}
                    </span>
                  ))}
                </div>
              </div>

              {/* Maintenance Protocols */}
              <div className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5" />
                  MAINTENANCE PRÉVENTIVE
                </span>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  {selectedNode.maintenance_tasks.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Failure Modes (FMECA) */}
            {selectedNode.failure_modes && selectedNode.failure_modes.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-[#252E38]">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Modes de Défaillance & AMDEC' : 'Failure Modes & FMECA Mitigations'}</span>
                </div>
                <div className="space-y-1.5">
                  {selectedNode.failure_modes.map((fm, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#080B10] border border-[#252E38] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white font-mono">{fm.mode}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                          {fm.criticality}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px]">Cause : {fm.cause}</div>
                      <div className="text-emerald-300 text-[11px]">Parade : {fm.mitigation}</div>
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
