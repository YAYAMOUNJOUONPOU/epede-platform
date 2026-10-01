// src/components/epede/PowerSystemMap.tsx
import React, { useState, useMemo } from 'react';
import {
  NODE_BY_ID,
  POWER_CONNECTIONS,
  POWER_NODES,
  type PowerNodeId,
} from './types';
import type { DomainCode } from '../../types/epede';
import { ArrowRight, Zap, ExternalLink, Activity } from 'lucide-react';

export interface PowerSystemMapProps {
  locale: 'fr' | 'en';
  isReducedMotion?: boolean;
  onSelectDomain?: (code: DomainCode) => void;
  onNavigateView?: (view: any) => void;
  onNodeChange?: (nodeId: PowerNodeId) => void;
}

export const PowerSystemMap: React.FC<PowerSystemMapProps> = ({
  locale,
  isReducedMotion = false,
  onSelectDomain,
  onNavigateView,
  onNodeChange,
}) => {
  const [selectedId, setSelectedId] = useState<PowerNodeId>('generation');
  const selected = NODE_BY_ID[selectedId] || POWER_NODES[0];

  const connectedIds = useMemo(() => {
    const ids = new Set<PowerNodeId>([selectedId]);
    POWER_CONNECTIONS.forEach(([from, to]) => {
      if (from === selectedId) ids.add(to);
      if (to === selectedId) ids.add(from);
    });
    return ids;
  }, [selectedId]);

  const selectNode = (nodeId: PowerNodeId) => {
    setSelectedId(nodeId);
    onNodeChange?.(nodeId);
  };

  const handleDeepDive = () => {
    if (selected.domainCode && onSelectDomain) {
      onSelectDomain(selected.domainCode);
    } else if (selected.navTarget && onNavigateView) {
      onNavigateView(selected.navTarget);
    }
  };

  return (
    <div className="power-map-layout grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch mt-8">
      {/* Topology Canvas Frame */}
      <div className="power-map-frame lg:col-span-8 rounded-2xl border border-[#252E38] bg-[#0B0F12]/95 p-5 sm:p-7 shadow-2xl backdrop-blur-xl relative flex flex-col justify-between overflow-hidden">
        {/* Header HUD */}
        <div className="power-map-heading flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2630] pb-4">
          <div>
            <span className="eyebrow text-[#D7A64A] text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              {locale === 'fr' ? 'TOPOLOGIE DU SYSTÈME ÉLECTRIQUE' : 'SYSTEM TOPOLOGY'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4F1E8] font-mono mt-1">
              {locale === 'fr' ? 'Flux Continu d\'Énergie' : 'Follow the Energy Flow'}
            </h3>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#75A88C]/15 border border-[#75A88C]/40 text-[#75A88C]">
              <span className="h-2 w-2 rounded-full bg-[#75A88C] animate-pulse" />
              {locale === 'fr' ? 'Réseau Synchrone (50 Hz)' : 'Synchronous Grid (50 Hz)'}
            </span>
            <span className="text-[#A9ADA5] hidden sm:inline-block">
              06 {locale === 'fr' ? 'NŒUDS' : 'NODES'} / 07 {locale === 'fr' ? 'LIGNES' : 'PATHS'}
            </span>
          </div>
        </div>

        {/* SVG Topology Stage */}
        <div
          className="power-map relative min-h-[360px] sm:min-h-[400px] w-full my-6 rounded-xl border border-[#D7A64A]/20 bg-[radial-gradient(ellipse_at_center,rgba(86,122,135,0.12),transparent_70%)] overflow-hidden"
          role="group"
          aria-label={locale === 'fr' ? 'Carte topologique interactive du réseau' : 'Interactive power system map'}
        >
          {/* Subtle CAD coordinates background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(215, 166, 74, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(215, 166, 74, 0.25) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* SVG Connection Lines */}
          <svg
            className="power-map-lines absolute inset-0 h-full w-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="activeCopperFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D7A64A" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#F5D27D" stopOpacity="1" />
                <stop offset="100%" stopColor="#D7A64A" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {POWER_CONNECTIONS.map(([fromId, toId]) => {
              const from = NODE_BY_ID[fromId];
              const to = NODE_BY_ID[toId];
              const isActive = connectedIds.has(fromId) && connectedIds.has(toId);

              return (
                <line
                  key={`${fromId}-${toId}`}
                  x1={`${from.position.x}%`}
                  y1={`${from.position.y}%`}
                  x2={`${to.position.x}%`}
                  y2={`${to.position.y}%`}
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'stroke-[#D7A64A] stroke-[2.5] filter drop-shadow-[0_0_6px_rgba(215,166,74,0.8)]'
                      : 'stroke-[#D7A64A]/30 stroke-[1.2] opacity-35'
                  }`}
                  strokeDasharray={isActive ? '6 4' : '3 4'}
                  style={{
                    animation: isActive && !isReducedMotion ? 'connection-flow 1.8s linear infinite' : 'none',
                  }}
                />
              );
            })}
          </svg>

          {/* Topology Interactive Node Buttons */}
          {POWER_NODES.map((node) => {
            const isSelected = selectedId === node.id;
            const isConnected = connectedIds.has(node.id);

            return (
              <button
                key={node.id}
                type="button"
                className={`power-node absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center p-2 rounded-xl transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#D7A64A] ${
                  isSelected
                    ? 'bg-[#D7A64A] text-[#080B0D] shadow-[0_0_30px_rgba(215,166,74,0.6)] scale-110 border-2 border-white'
                    : isConnected
                    ? 'bg-[#151C1E]/95 text-[#F4F1E8] border border-[#D7A64A]/70 shadow-lg hover:scale-105'
                    : 'bg-[#0B0F12]/85 text-[#A9ADA5] border border-[#252E38] opacity-50 hover:opacity-90 hover:scale-105'
                }`}
                style={{
                  left: `${node.position.x}%`,
                  top: `${node.position.y}%`,
                }}
                onClick={() => selectNode(node.id)}
                aria-pressed={isSelected}
                aria-label={`${locale === 'fr' ? node.labelFr : node.label}, ${node.voltage}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'border-[#080B0D] bg-[#080B0D]'
                      : 'border-[#D7A64A] bg-[#0B0F12]'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isSelected
                        ? 'bg-[#D7A64A] shadow-[0_0_8px_#D7A64A]'
                        : 'bg-[#D7A64A]'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-black tracking-wider uppercase font-mono mt-1 ${
                    isSelected ? 'text-[#080B0D]' : 'text-[#F4F1E8]'
                  }`}
                >
                  {node.shortLabel}
                </span>
                <span
                  className={`text-[9px] font-mono hidden sm:block ${
                    isSelected ? 'text-[#3E2E10]' : 'text-[#A9ADA5]'
                  }`}
                >
                  {node.voltage.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer instructions & legend */}
        <div className="map-footer flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-3 border-t border-[#1E2630] text-[#A9ADA5]">
          <p className="flex items-center gap-1.5">
            <span className="text-[#D7A64A]">✦</span>
            {locale === 'fr'
              ? 'Cliquez sur un nœud pour illuminer le chemin adjacent d\'énergie.'
              : 'Select any node to trace adjacent connected power paths.'}
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#D7A64A] shadow-[0_0_6px_#D7A64A]" />
              {locale === 'fr' ? 'Chemin Actif' : 'Active Flow'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#252E38] border border-[#A9ADA5]" />
              {locale === 'fr' ? 'En Attente' : 'Standby'}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Node Live Inspector Panel */}
      <aside
        className="node-inspector lg:col-span-4 rounded-2xl border border-[#252E38] bg-[#0B0F12]/95 p-6 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col justify-between relative"
        aria-live="polite"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-[#D7A64A] text-xs font-mono font-bold tracking-widest uppercase">
              {locale === 'fr' ? 'SYSTÈME SÉLECTIONNÉ' : 'SELECTED SUBSYSTEM'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D7A64A]/10 text-[#D7A64A] border border-[#D7A64A]/30">
              {selected.domainCode || 'GRID'}
            </span>
          </div>

          <div
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: selected.accent }}
          />

          <div>
            <h4 className="text-2xl font-bold tracking-tight text-[#F4F1E8] font-mono">
              {locale === 'fr' ? (selected?.labelFr || selected?.label || '') : (selected?.label || '')}
            </h4>
            <span className="inline-block mt-1 text-xs font-mono font-semibold text-[#D7A64A]">
              {locale === 'fr' ? (selected?.categoryFr || selected?.category || '') : (selected?.category || '')}
            </span>
          </div>

          <p className="text-sm text-[#A9ADA5] leading-relaxed">
            {locale === 'fr' ? (selected?.descriptionFr || selected?.description || '') : (selected?.description || '')}
          </p>

          <div className="p-4 rounded-xl border-l-2 border-[#D7A64A] bg-[#D7A64A]/5 space-y-1">
            <span className="text-[11px] font-mono text-[#A9ADA5] block uppercase tracking-wider">
              {locale === 'fr' ? 'Palier de Tension Opérationnel' : 'Operating Voltage Range'}
            </span>
            <strong className="text-xl font-mono text-[#F4F1E8] block">
              {selected.voltage}
            </strong>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1E2630] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#A9ADA5]">
            <span>{locale === 'fr' ? 'Interconnexions directes :' : 'Direct connections:'}</span>
            <strong className="text-[#75A88C] font-bold">
              {connectedIds.size - 1} {locale === 'fr' ? 'nœuds adjacents' : 'adjacent nodes'}
            </strong>
          </div>

          <button
            type="button"
            onClick={handleDeepDive}
            className="w-full py-2.5 px-4 rounded-xl bg-[#D7A64A] hover:bg-[#E5C276] text-[#080B0D] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>
              {locale === 'fr'
                ? `Explorer ${selected.domainCode ? selected.domainCode : 'le Module'}`
                : `Explore ${selected.domainCode ? selected.domainCode : 'Module'}`}
            </span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>
    </div>
  );
};
