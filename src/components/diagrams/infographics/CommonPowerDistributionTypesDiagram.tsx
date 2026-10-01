// src/components/diagrams/infographics/CommonPowerDistributionTypesDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const CommonPowerDistributionTypesDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const handleClick = (id: string) => {
    if (onSelectHotspot) onSelectHotspot(id);
  };

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-sans">
              {locale === 'fr'
                ? "Types Courants de Réseaux de Distribution"
                : "Common Power Distribution System Types"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            {locale === 'fr'
              ? "Les distributeurs choisissent l'agencement selon la fiabilité requise, le coût d'investissement et la densité de charge."
              : "Utilities choose layouts based on reliability, cost, and load density."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
            CEI 60364 · IEEE 141
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[16/9] min-h-[380px] max-h-[560px] relative">
        <svg
          viewBox="0 0 1100 620"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284C7" />
            </marker>
            <marker id="arrow-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38BDF8" />
            </marker>
            <linearGradient id="panel-bg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B1322" />
              <stop offset="100%" stopColor="#080D17" />
            </linearGradient>
          </defs>

          {/* ================================================================ */}
          {/* 1. RADIAL SYSTEM (LEFT PANEL) */}
          {/* ================================================================ */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick('SYS_RADIAL')}
            onMouseEnter={() => setHoveredNode('SYS_RADIAL')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Panel container */}
            <rect
              x="20"
              y="20"
              width="330"
              height="530"
              rx="16"
              fill="url(#panel-bg)"
              stroke={selectedHotspotId === 'SYS_RADIAL' || hoveredNode === 'SYS_RADIAL' ? '#38BDF8' : '#1E293B'}
              strokeWidth={selectedHotspotId === 'SYS_RADIAL' || hoveredNode === 'SYS_RADIAL' ? '2.5' : '1.5'}
            />

            {/* Step header */}
            <rect x="36" y="36" width="44" height="44" rx="22" fill="#0284C7" />
            <text x="58" y="65" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle">1</text>
            <text x="96" y="65" fill="#FFFFFF" fontSize="20" fontWeight="bold" fontFamily="sans-serif">
              {locale === 'fr' ? 'Réseau Radial' : 'Radial System'}
            </text>

            {/* Diagram content */}
            {/* Source */}
            <g transform="translate(45, 230)">
              <rect x="0" y="0" width="60" height="60" rx="30" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="2" />
              <path d="M 18 20 L 42 20 M 18 30 L 42 30 M 30 14 L 30 36" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
              <path d="M 32 38 L 26 48 L 31 48 L 27 56" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <text x="30" y="78" fill="#94A3B8" fontSize="11" textAnchor="middle">Source</text>
            </g>

            {/* Main Feeder Line */}
            <line x1="105" y1="260" x2="310" y2="260" stroke="#0284C7" strokeWidth="3" markerEnd="url(#arrow-blue)" />

            {/* Branch 1 - Residential */}
            <line x1="150" y1="260" x2="150" y2="330" stroke="#0284C7" strokeWidth="2" />
            <circle cx="150" cy="260" r="5" fill="#0284C7" />
            <g transform="translate(130, 335)">
              <path d="M 20 0 L 0 16 L 6 16 L 6 36 L 34 36 L 34 16 L 40 16 Z" fill="#0284C7" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.8" />
              <rect x="14" y="22" width="12" height="14" fill="#0284C7" />
              <text x="20" y="52" fill="#94A3B8" fontSize="11" textAnchor="middle">Load</text>
            </g>

            {/* Branch 2 - Commercial */}
            <line x1="215" y1="260" x2="215" y2="330" stroke="#0284C7" strokeWidth="2" />
            <circle cx="215" cy="260" r="5" fill="#0284C7" />
            <g transform="translate(195, 335)">
              <rect x="6" y="6" width="28" height="30" rx="3" fill="#0284C7" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.8" />
              <rect x="11" y="11" width="5" height="5" fill="#38BDF8" />
              <rect x="24" y="11" width="5" height="5" fill="#38BDF8" />
              <rect x="11" y="20" width="5" height="5" fill="#38BDF8" />
              <rect x="24" y="20" width="5" height="5" fill="#38BDF8" />
              <text x="20" y="52" fill="#94A3B8" fontSize="11" textAnchor="middle">Load</text>
            </g>

            {/* Branch 3 - Industrial */}
            <line x1="280" y1="260" x2="280" y2="330" stroke="#0284C7" strokeWidth="2" />
            <circle cx="280" cy="260" r="5" fill="#0284C7" />
            <g transform="translate(260, 335)">
              <path d="M 2 36 L 2 16 L 14 26 L 14 16 L 26 26 L 26 8 L 38 8 L 38 36 Z" fill="#0284C7" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.8" />
              <text x="20" y="52" fill="#94A3B8" fontSize="11" textAnchor="middle">Load</text>
            </g>

            {/* Bottom Benefit Banner */}
            <rect x="36" y="475" width="298" height="54" rx="10" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="60" cy="502" r="14" fill="#0284C7" />
            <path d="M 54 502 L 58 506 L 67 497" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x="86" y="508" fill="#38BDF8" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
              {locale === 'fr' ? 'Simple & Économique' : 'Simple and low cost'}
            </text>
          </g>

          {/* ================================================================ */}
          {/* 2. RING MAIN SYSTEM (MIDDLE PANEL) */}
          {/* ================================================================ */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick('SYS_RING')}
            onMouseEnter={() => setHoveredNode('SYS_RING')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Panel container */}
            <rect
              x="385"
              y="20"
              width="330"
              height="530"
              rx="16"
              fill="url(#panel-bg)"
              stroke={selectedHotspotId === 'SYS_RING' || hoveredNode === 'SYS_RING' ? '#38BDF8' : '#1E293B'}
              strokeWidth={selectedHotspotId === 'SYS_RING' || hoveredNode === 'SYS_RING' ? '2.5' : '1.5'}
            />

            {/* Step header */}
            <rect x="401" y="36" width="44" height="44" rx="22" fill="#0284C7" />
            <text x="423" y="65" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle">2</text>
            <text x="461" y="65" fill="#FFFFFF" fontSize="20" fontWeight="bold" fontFamily="sans-serif">
              {locale === 'fr' ? 'Réseau Bouclé' : 'Ring Main System'}
            </text>

            {/* Loop square path */}
            <rect x="450" y="160" width="200" height="230" rx="8" fill="none" stroke="#0284C7" strokeWidth="3" />

            {/* Source on left */}
            <g transform="translate(415, 235)">
              <rect x="0" y="0" width="60" height="60" rx="30" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="2" />
              <path d="M 18 20 L 42 20 M 18 30 L 42 30 M 30 14 L 30 36" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
              <path d="M 32 38 L 26 48 L 31 48 L 27 56" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <text x="30" y="78" fill="#94A3B8" fontSize="11" textAnchor="middle">Source</text>
            </g>

            {/* Load 1 - Top (Residential) */}
            <circle cx="550" cy="160" r="5" fill="#0284C7" />
            <line x1="550" y1="160" x2="550" y2="185" stroke="#0284C7" strokeWidth="2" />
            <g transform="translate(530, 190)">
              <path d="M 20 0 L 0 16 L 6 16 L 6 36 L 34 36 L 34 16 L 40 16 Z" fill="#0284C7" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.8" />
              <rect x="14" y="22" width="12" height="14" fill="#0284C7" />
              <text x="20" y="50" fill="#94A3B8" fontSize="11" textAnchor="middle">Load</text>
            </g>

            {/* Load 2 - Right (Commercial) */}
            <circle cx="650" cy="275" r="5" fill="#0284C7" />
            <line x1="650" y1="275" x2="675" y2="275" stroke="#0284C7" strokeWidth="2" />
            <g transform="translate(680, 255)">
              <rect x="6" y="6" width="28" height="30" rx="3" fill="#0284C7" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.8" />
              <rect x="11" y="11" width="5" height="5" fill="#38BDF8" />
              <rect x="24" y="11" width="5" height="5" fill="#38BDF8" />
              <rect x="11" y="20" width="5" height="5" fill="#38BDF8" />
              <rect x="24" y="20" width="5" height="5" fill="#38BDF8" />
              <text x="20" y="50" fill="#94A3B8" fontSize="11" textAnchor="middle">Load</text>
            </g>

            {/* Load 3 - Bottom (Industrial) */}
            <circle cx="550" cy="390" r="5" fill="#0284C7" />
            <line x1="550" y1="390" x2="550" y2="415" stroke="#0284C7" strokeWidth="2" />
            <g transform="translate(530, 420)">
              <path d="M 2 34 L 2 16 L 14 26 L 14 16 L 26 26 L 26 8 L 38 8 L 38 34 Z" fill="#0284C7" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.8" />
              <text x="20" y="48" fill="#94A3B8" fontSize="11" textAnchor="middle">Load</text>
            </g>

            {/* Bottom Benefit Banner */}
            <rect x="401" y="475" width="298" height="54" rx="10" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="425" cy="502" r="14" fill="#0284C7" />
            <path d="M 425 493 L 434 497 L 434 506 C 434 511 425 515 425 515 C 425 515 416 511 416 506 L 416 497 Z" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M 421 503 L 424 506 L 429 499" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <text x="451" y="508" fill="#38BDF8" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
              {locale === 'fr' ? 'Meilleure Fiabilité' : 'Better reliability'}
            </text>
          </g>

          {/* ================================================================ */}
          {/* 3. NETWORK SYSTEM (RIGHT PANEL) */}
          {/* ================================================================ */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick('SYS_NETWORK')}
            onMouseEnter={() => setHoveredNode('SYS_NETWORK')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Panel container */}
            <rect
              x="750"
              y="20"
              width="330"
              height="530"
              rx="16"
              fill="url(#panel-bg)"
              stroke={selectedHotspotId === 'SYS_NETWORK' || hoveredNode === 'SYS_NETWORK' ? '#38BDF8' : '#1E293B'}
              strokeWidth={selectedHotspotId === 'SYS_NETWORK' || hoveredNode === 'SYS_NETWORK' ? '2.5' : '1.5'}
            />

            {/* Step header */}
            <rect x="766" y="36" width="44" height="44" rx="22" fill="#0284C7" />
            <text x="788" y="65" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle">3</text>
            <text x="826" y="65" fill="#FFFFFF" fontSize="20" fontWeight="bold" fontFamily="sans-serif">
              {locale === 'fr' ? 'Réseau Maillé' : 'Network System'}
            </text>

            {/* Dual Sources (Top Left & Top Right) */}
            <g transform="translate(780, 110)">
              <rect x="0" y="0" width="54" height="54" rx="27" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="2" />
              <path d="M 16 18 L 38 18 M 16 26 L 38 26 M 27 12 L 27 32" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
              <path d="M 29 34 L 24 43 L 28 43 L 25 50" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <text x="27" y="70" fill="#94A3B8" fontSize="11" textAnchor="middle">Source 1</text>
            </g>

            <g transform="translate(995, 110)">
              <rect x="0" y="0" width="54" height="54" rx="27" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="2" />
              <path d="M 16 18 L 38 18 M 16 26 L 38 26 M 27 12 L 27 32" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
              <path d="M 29 34 L 24 43 L 28 43 L 25 50" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <text x="27" y="70" fill="#94A3B8" fontSize="11" textAnchor="middle">Source 2</text>
            </g>

            {/* Grid Interconnect Lines */}
            <line x1="834" y1="137" x2="995" y2="137" stroke="#0284C7" strokeWidth="2.5" />
            <circle cx="915" cy="137" r="5" fill="#38BDF8" />

            <line x1="915" y1="137" x2="915" y2="235" stroke="#0284C7" strokeWidth="2.5" />

            {/* Intermediate Bus */}
            <line x1="795" y1="235" x2="1035" y2="235" stroke="#0284C7" strokeWidth="2.5" />
            <circle cx="795" cy="235" r="5" fill="#38BDF8" />
            <circle cx="915" cy="235" r="5" fill="#38BDF8" />
            <circle cx="1035" cy="235" r="5" fill="#38BDF8" />

            {/* Feed to Loads */}
            <line x1="795" y1="235" x2="795" y2="280" stroke="#0284C7" strokeWidth="2" />
            <line x1="915" y1="235" x2="915" y2="280" stroke="#0284C7" strokeWidth="2" />
            <line x1="1035" y1="235" x2="1035" y2="280" stroke="#0284C7" strokeWidth="2" />

            {/* Load 1 (Residential) */}
            <g transform="translate(775, 280)">
              <path d="M 20 0 L 0 16 L 6 16 L 6 36 L 34 36 L 34 16 L 40 16 Z" fill="#0284C7" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.8" />
              <text x="20" y="50" fill="#94A3B8" fontSize="11" textAnchor="middle">Load</text>
            </g>

            {/* Load 2 (Commercial) */}
            <g transform="translate(895, 280)">
              <rect x="6" y="6" width="28" height="30" rx="3" fill="#0284C7" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.8" />
              <rect x="11" y="11" width="5" height="5" fill="#38BDF8" />
              <rect x="24" y="11" width="5" height="5" fill="#38BDF8" />
              <text x="20" y="50" fill="#94A3B8" fontSize="11" textAnchor="middle">Load</text>
            </g>

            {/* Load 3 (Industrial) */}
            <g transform="translate(1015, 280)">
              <path d="M 2 34 L 2 16 L 14 26 L 14 16 L 26 26 L 26 8 L 38 8 L 38 34 Z" fill="#0284C7" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.8" />
              <text x="20" y="48" fill="#94A3B8" fontSize="11" textAnchor="middle">Load</text>
            </g>

            {/* Cross-mesh interconnected Load at Bottom */}
            <circle cx="815" cy="365" r="4" fill="#0284C7" />
            <circle cx="1015" cy="365" r="4" fill="#0284C7" />
            <line x1="815" y1="365" x2="915" y2="430" stroke="#0284C7" strokeWidth="2" strokeDasharray="3,3" />
            <line x1="1015" y1="365" x2="915" y2="430" stroke="#0284C7" strokeWidth="2" strokeDasharray="3,3" />
            <line x1="915" y1="340" x2="915" y2="430" stroke="#0284C7" strokeWidth="2" />
            <circle cx="915" cy="430" r="5" fill="#38BDF8" />

            <g transform="translate(895, 435)">
              <rect x="6" y="6" width="28" height="30" rx="3" fill="#0284C7" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1.8" />
              <rect x="11" y="11" width="5" height="5" fill="#38BDF8" />
              <rect x="24" y="11" width="5" height="5" fill="#38BDF8" />
              <text x="20" y="50" fill="#94A3B8" fontSize="11" textAnchor="middle">Load</text>
            </g>

            {/* Bottom Benefit Banner */}
            <rect x="766" y="475" width="298" height="54" rx="10" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="790" cy="502" r="14" fill="#0284C7" />
            <path d="M 790 491 L 793 499 L 802 499 L 795 504 L 798 512 L 790 507 L 782 512 L 785 504 L 778 499 L 787 499 Z" fill="#FFFFFF" />
            <text x="816" y="508" fill="#38BDF8" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              {locale === 'fr' ? 'Continuité Maximale' : 'Highest continuity of service'}
            </text>
          </g>

          {/* Footer note */}
          <text x="550" y="595" fill="#94A3B8" fontSize="13" textAnchor="middle" fontFamily="sans-serif">
            {locale === 'fr'
              ? 'Les distributeurs choisissent l\'agencement selon la criticité des charges (Hôpitaux, Usines, Résidentiel).'
              : 'Utilities choose layouts based on reliability, cost, and load density.'}
          </text>
        </svg>
      </div>
    </div>
  );
};
