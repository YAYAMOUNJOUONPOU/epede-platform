// src/components/diagrams/infographics/PowerSystemsEngineeringDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const PowerSystemsEngineeringDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const activeId = selectedHotspotId || hoveredNode;

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl">
      {/* Visual Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-mono">
              {locale === 'fr' 
                ? "Génie des Systèmes Électriques · Panorama Global" 
                : "What is Power Systems Engineering"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {locale === 'fr' 
              ? "Production ➔ Transport THT ➔ Distribution MT/BT ➔ Utilisation Finale & Dispatching SCADA"
              : "Generation, Transmission, Distribution, & Utilization of Electrical Energy"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
            IEC 60038 · IEEE 399
          </span>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="w-full aspect-[16/9] min-h-[380px] max-h-[560px] relative">
        <svg 
          viewBox="0 0 1200 680" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="psGenGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="psSkyLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <filter id="psGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Pattern */}
          <pattern id="psGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1E293B" strokeWidth="0.5" opacity="0.6" />
          </pattern>
          <rect width="1200" height="680" fill="url(#psGrid)" />

          {/* MAIN POWER FLOW BUS */}
          <path
            d="M 170 340 L 410 340 L 670 340 L 970 340"
            fill="none"
            stroke="url(#psSkyLine)"
            strokeWidth="5"
            strokeDasharray="8 6"
            className="animate-pulse"
          />

          {/* ==================================================================== */}
          {/* 1. GENERATION PILLAR (Left) */}
          {/* ==================================================================== */}
          <g 
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectHotspot?.('GEN_THERMAL')}
            onMouseEnter={() => setHoveredNode('GEN_THERMAL')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Outer Section Box */}
            <rect 
              x="30" y="50" width="280" height="580" rx="16"
              fill="#0D1524" 
              stroke={activeId === 'GEN_THERMAL' || activeId === 'GEN_RENEWABLE' ? '#F59E0B' : '#1E293B'}
              strokeWidth={activeId === 'GEN_THERMAL' ? 2.5 : 1.5}
            />
            
            {/* Header Tag */}
            <rect x="50" y="65" width="240" height="34" rx="8" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="1" />
            <text x="170" y="87" fill="#FBBF24" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? '1. PRODUCTION D\'ÉNERGIE' : '1. GENERATION SOURCES'}
            </text>

            {/* Sub-item A: Thermal Plant */}
            <g transform="translate(50, 115)">
              <rect x="0" y="0" width="240" height="150" rx="12" fill="#141E30" stroke="#334155" strokeWidth="1" />
              {/* Cooling tower 1 */}
              <path d="M 40 120 Q 55 70 45 40 L 75 40 Q 65 70 80 120 Z" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
              {/* Cooling tower 2 */}
              <path d="M 90 120 Q 105 70 95 40 L 125 40 Q 115 70 130 120 Z" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
              {/* Smokestack with red bands */}
              <rect x="150" y="30" width="16" height="90" fill="#475569" />
              <rect x="150" y="45" width="16" height="10" fill="#EF4444" />
              <rect x="150" y="70" width="16" height="10" fill="#EF4444" />
              {/* Steam plume */}
              <ellipse cx="60" cy="30" rx="12" ry="7" fill="#94A3B8" opacity="0.6" />
              <ellipse cx="110" cy="30" rx="12" ry="7" fill="#94A3B8" opacity="0.6" />
              {/* Label */}
              <text x="120" y="138" fill="#E2E8F0" fontSize="12" fontWeight="700" textAnchor="middle">
                {locale === 'fr' ? 'Centrales Thermiques & Gaz' : 'Thermal & Gas Generation'}
              </text>
            </g>

            {/* Sub-item B: Wind Generation */}
            <g transform="translate(50, 280)">
              <rect x="0" y="0" width="240" height="150" rx="12" fill="#141E30" stroke="#334155" strokeWidth="1" />
              {/* Wind turbine 1 */}
              <line x1="60" y1="120" x2="60" y2="45" stroke="#94A3B8" strokeWidth="3" />
              <circle cx="60" cy="45" r="4" fill="#F8FAFC" />
              <line x1="60" y1="45" x2="35" y2="30" stroke="#CBD5E1" strokeWidth="2" />
              <line x1="60" y1="45" x2="85" y2="30" stroke="#CBD5E1" strokeWidth="2" />
              <line x1="60" y1="45" x2="60" y2="75" stroke="#CBD5E1" strokeWidth="2" />

              {/* Wind turbine 2 */}
              <line x1="130" y1="120" x2="130" y2="35" stroke="#94A3B8" strokeWidth="3" />
              <circle cx="130" cy="35" r="4" fill="#F8FAFC" />
              <line x1="130" y1="35" x2="110" y2="15" stroke="#CBD5E1" strokeWidth="2" />
              <line x1="130" y1="35" x2="150" y2="15" stroke="#CBD5E1" strokeWidth="2" />
              <line x1="130" y1="35" x2="130" y2="60" stroke="#CBD5E1" strokeWidth="2" />

              {/* Wind turbine 3 */}
              <line x1="190" y1="120" x2="190" y2="55" stroke="#94A3B8" strokeWidth="2.5" />
              <circle cx="190" cy="55" r="3" fill="#F8FAFC" />
              <line x1="190" y1="55" x2="175" y2="40" stroke="#CBD5E1" strokeWidth="1.5" />
              <line x1="190" y1="55" x2="205" y2="40" stroke="#CBD5E1" strokeWidth="1.5" />

              <text x="120" y="138" fill="#E2E8F0" fontSize="12" fontWeight="700" textAnchor="middle">
                {locale === 'fr' ? 'Énergie Éolienne (Onshore)' : 'Renewable Wind Farms'}
              </text>
            </g>

            {/* Sub-item C: Solar PV */}
            <g transform="translate(50, 445)">
              <rect x="0" y="0" width="240" height="150" rx="12" fill="#141E30" stroke="#334155" strokeWidth="1" />
              {/* Sun */}
              <circle cx="50" cy="45" r="16" fill="#F59E0B" />
              <path d="M 50 20 L 50 12 M 50 70 L 50 78 M 25 45 L 17 45 M 75 45 L 83 45" stroke="#FBBF24" strokeWidth="2" />
              {/* Solar array */}
              <polygon points="90,85 140,55 190,55 140,85" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1.5" />
              <polygon points="90,115 140,85 190,85 140,115" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1.5" />
              <polygon points="145,115 195,85 225,85 175,115" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1.5" />
              
              <text x="120" y="138" fill="#E2E8F0" fontSize="12" fontWeight="700" textAnchor="middle">
                {locale === 'fr' ? 'Solaire Photovoltaïque' : 'Solar Photovoltaic (PV)'}
              </text>
            </g>
          </g>

          {/* ==================================================================== */}
          {/* 2. TRANSMISSION & SUBSTATION (Center-Left) */}
          {/* ==================================================================== */}
          <g 
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectHotspot?.('SUB_TRANS')}
            onMouseEnter={() => setHoveredNode('SUB_TRANS')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect 
              x="330" y="50" width="280" height="580" rx="16"
              fill="#0D1524" 
              stroke={activeId === 'SUB_TRANS' || activeId === 'TRANS_LINES' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeId === 'SUB_TRANS' ? 2.5 : 1.5}
            />

            {/* Header Tag */}
            <rect x="350" y="65" width="240" height="34" rx="8" fill="#38BDF8" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1" />
            <text x="470" y="87" fill="#38BDF8" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? '2. POSTE & TRANSPORT THT' : '2. TRANSMISSION SYSTEM'}
            </text>

            {/* Transmission Substation Step-Up */}
            <g transform="translate(350, 115)">
              <rect x="0" y="0" width="240" height="215" rx="12" fill="#141E30" stroke="#334155" strokeWidth="1" />
              {/* Transformer body */}
              <rect x="40" y="65" width="70" height="75" rx="6" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
              {/* Bushings */}
              <rect x="48" y="38" width="10" height="27" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="68" y="38" width="10" height="27" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="88" y="38" width="10" height="27" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="1" />
              {/* Conservator tank */}
              <rect x="40" y="25" width="60" height="15" rx="7" fill="#475569" />
              {/* Breaker module */}
              <rect x="145" y="65" width="65" height="75" rx="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
              <circle cx="177" cy="102" r="14" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="2" />
              <path d="M 170 102 L 184 102" stroke="#38BDF8" strokeWidth="3" />
              <text x="177" y="128" fill="#94A3B8" fontSize="10" textAnchor="middle">Disjoncteur</text>
              
              <text x="120" y="168" fill="#E2E8F0" fontSize="12" fontWeight="700" textAnchor="middle">
                {locale === 'fr' ? 'Poste de Transport Élévateur' : 'Step-Up Substation'}
              </text>
              <text x="120" y="190" fill="#38BDF8" fontSize="11" textAnchor="middle" fontFamily="monospace">
                11-15 kV ➔ 225 kV THT
              </text>
            </g>

            {/* Transmission Towers Pylons */}
            <g transform="translate(350, 345)">
              <rect x="0" y="0" width="240" height="250" rx="12" fill="#141E30" stroke="#334155" strokeWidth="1" />
              
              {/* Lattice Pylon 1 */}
              <g transform="translate(30, 20)">
                <line x1="45" y1="180" x2="45" y2="20" stroke="#94A3B8" strokeWidth="2.5" />
                <line x1="20" y1="180" x2="45" y2="20" stroke="#64748B" strokeWidth="1.5" />
                <line x1="70" y1="180" x2="45" y2="20" stroke="#64748B" strokeWidth="1.5" />
                {/* Crossarms */}
                <line x1="10" y1="60" x2="80" y2="60" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="15" y1="100" x2="75" y2="100" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="20" y1="140" x2="70" y2="140" stroke="#CBD5E1" strokeWidth="2" />
                {/* Diagonals */}
                <line x1="20" y1="180" x2="70" y2="140" stroke="#475569" strokeWidth="1" />
                <line x1="70" y1="180" x2="20" y2="140" stroke="#475569" strokeWidth="1" />
              </g>

              {/* Lattice Pylon 2 */}
              <g transform="translate(135, 20)">
                <line x1="45" y1="180" x2="45" y2="20" stroke="#94A3B8" strokeWidth="2.5" />
                <line x1="20" y1="180" x2="45" y2="20" stroke="#64748B" strokeWidth="1.5" />
                <line x1="70" y1="180" x2="45" y2="20" stroke="#64748B" strokeWidth="1.5" />
                <line x1="10" y1="60" x2="80" y2="60" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="15" y1="100" x2="75" y2="100" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="20" y1="140" x2="70" y2="140" stroke="#CBD5E1" strokeWidth="2" />
              </g>

              {/* Conductors linking pylons */}
              <path d="M 105 80 Q 145 95 180 80" fill="none" stroke="#F59E0B" strokeWidth="2" />
              <path d="M 105 120 Q 145 135 180 120" fill="none" stroke="#F59E0B" strokeWidth="2" />

              <text x="120" y="215" fill="#E2E8F0" fontSize="12" fontWeight="700" textAnchor="middle">
                {locale === 'fr' ? 'Lignes de Transport Aériennes' : 'High-Voltage Transmission Lines'}
              </text>
              <text x="120" y="235" fill="#94A3B8" fontSize="11" textAnchor="middle" fontFamily="monospace">
                Pylônes Métalliques 225/90 kV
              </text>
            </g>
          </g>

          {/* ==================================================================== */}
          {/* 3. DISTRIBUTION SUBSTATION (Center-Right) */}
          {/* ==================================================================== */}
          <g 
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectHotspot?.('SUB_DISTRIB')}
            onMouseEnter={() => setHoveredNode('SUB_DISTRIB')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect 
              x="630" y="50" width="240" height="580" rx="16"
              fill="#0D1524" 
              stroke={activeId === 'SUB_DISTRIB' ? '#10B981' : '#1E293B'}
              strokeWidth={activeId === 'SUB_DISTRIB' ? 2.5 : 1.5}
            />

            {/* Header Tag */}
            <rect x="650" y="65" width="200" height="34" rx="8" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="1" />
            <text x="750" y="87" fill="#10B981" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? '3. DISTRIBUTION MT/BT' : '3. DISTRIBUTION'}
            </text>

            {/* Step-Down Substation */}
            <g transform="translate(650, 115)">
              <rect x="0" y="0" width="200" height="215" rx="12" fill="#141E30" stroke="#334155" strokeWidth="1" />
              {/* Transformer */}
              <circle cx="80" cy="85" r="30" fill="none" stroke="#10B981" strokeWidth="2.5" />
              <circle cx="120" cy="85" r="30" fill="none" stroke="#10B981" strokeWidth="2.5" />
              {/* Ground connection */}
              <line x1="100" y1="115" x2="100" y2="135" stroke="#64748B" strokeWidth="2" />
              <line x1="90" y1="135" x2="110" y2="135" stroke="#64748B" strokeWidth="2" />
              <line x1="93" y1="140" x2="107" y2="140" stroke="#64748B" strokeWidth="2" />
              <line x1="96" y1="145" x2="104" y2="145" stroke="#64748B" strokeWidth="2" />

              <text x="100" y="170" fill="#E2E8F0" fontSize="12" fontWeight="700" textAnchor="middle">
                {locale === 'fr' ? 'Poste Source Abaisseur' : 'Distribution Substation'}
              </text>
              <text x="100" y="192" fill="#10B981" fontSize="11" textAnchor="middle" fontFamily="monospace">
                90 kV ➔ 30 kV / 15 kV MT
              </text>
            </g>

            {/* Distribution Network Utility Poles */}
            <g transform="translate(650, 345)">
              <rect x="0" y="0" width="200" height="250" rx="12" fill="#141E30" stroke="#334155" strokeWidth="1" />
              {/* Concrete pole */}
              <line x1="100" y1="190" x2="100" y2="35" stroke="#78716C" strokeWidth="6" />
              {/* Crossarm */}
              <rect x="50" y="45" width="100" height="8" rx="2" fill="#A8A29E" />
              {/* Insulators */}
              <rect x="55" y="32" width="6" height="13" fill="#D6D3D1" />
              <rect x="97" y="32" width="6" height="13" fill="#D6D3D1" />
              <rect x="139" y="32" width="6" height="13" fill="#D6D3D1" />
              {/* Pole transformer (H61) */}
              <rect x="105" y="70" width="35" height="45" rx="4" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
              
              <text x="100" y="215" fill="#E2E8F0" fontSize="12" fontWeight="700" textAnchor="middle">
                {locale === 'fr' ? 'Réseaux Moyenne & Basse Tension' : 'MV & LV Distribution Lines'}
              </text>
              <text x="100" y="235" fill="#94A3B8" fontSize="11" textAnchor="middle" fontFamily="monospace">
                Poteaux Béton & Bois 400V/230V
              </text>
            </g>
          </g>

          {/* ==================================================================== */}
          {/* 4. UTILIZATION & SCADA CONTROL (Right) */}
          {/* ==================================================================== */}
          <g 
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectHotspot?.('UTILIZATION')}
            onMouseEnter={() => setHoveredNode('UTILIZATION')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect 
              x="890" y="50" width="280" height="580" rx="16"
              fill="#0D1524" 
              stroke={activeId === 'UTILIZATION' || activeId === 'SCADA_CONTROL' ? '#A855F7' : '#1E293B'}
              strokeWidth={activeId === 'UTILIZATION' ? 2.5 : 1.5}
            />

            {/* Header Tag */}
            <rect x="910" y="65" width="240" height="34" rx="8" fill="#A855F7" fillOpacity="0.15" stroke="#A855F7" strokeWidth="1" />
            <text x="1030" y="87" fill="#C084FC" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? '4. USAGES & CONDUITE' : '4. USES & DISPATCHING'}
            </text>

            {/* Industrial & Commercial Loads */}
            <g transform="translate(910, 115)">
              <rect x="0" y="0" width="240" height="150" rx="12" fill="#141E30" stroke="#334155" strokeWidth="1" />
              {/* Factory silhouette */}
              <path d="M 25 100 L 25 50 L 55 70 L 55 50 L 85 70 L 85 50 L 115 70 L 115 100 Z" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
              {/* Modern skyscraper */}
              <rect x="145" y="30" width="45" height="70" rx="3" fill="#1E293B" stroke="#60A5FA" strokeWidth="1.5" />
              <line x1="155" y1="42" x2="180" y2="42" stroke="#93C5FD" strokeWidth="1" />
              <line x1="155" y1="55" x2="180" y2="55" stroke="#93C5FD" strokeWidth="1" />
              <line x1="155" y1="68" x2="180" y2="68" stroke="#93C5FD" strokeWidth="1" />
              <line x1="155" y1="81" x2="180" y2="81" stroke="#93C5FD" strokeWidth="1" />
              
              <text x="120" y="125" fill="#E2E8F0" fontSize="12" fontWeight="700" textAnchor="middle">
                {locale === 'fr' ? 'Clients Industriels & Tertiaires' : 'Industrial & Commercial'}
              </text>
              <text x="120" y="142" fill="#94A3B8" fontSize="10" textAnchor="middle">
                Haute Fiabilité de Service
              </text>
            </g>

            {/* Residential & EV Charging */}
            <g transform="translate(910, 280)">
              <rect x="0" y="0" width="240" height="150" rx="12" fill="#141E30" stroke="#334155" strokeWidth="1" />
              {/* House */}
              <polygon points="65,35 25,65 105,65" fill="#DC2626" />
              <rect x="35" y="65" width="60" height="35" fill="#475569" />
              {/* EV Car */}
              <rect x="135" y="70" width="65" height="25" rx="6" fill="#10B981" />
              <circle cx="150" cy="95" r="7" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1.5" />
              <circle cx="185" cy="95" r="7" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1.5" />
              {/* Charging station */}
              <rect x="205" y="55" width="10" height="40" rx="2" fill="#38BDF8" />
              <path d="M 210 75 L 195 80" stroke="#F59E0B" strokeWidth="1.5" />

              <text x="120" y="125" fill="#E2E8F0" fontSize="12" fontWeight="700" textAnchor="middle">
                {locale === 'fr' ? 'Résidentiel & Véhicules Électriques' : 'Residential & EV Charging'}
              </text>
              <text x="120" y="142" fill="#94A3B8" fontSize="10" textAnchor="middle">
                Compteurs Intelligents (Smart Meters)
              </text>
            </g>

            {/* SCADA Dispatching Control Center */}
            <g 
              transform="translate(910, 445)"
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot?.('SCADA_CONTROL');
              }}
            >
              <rect 
                x="0" y="0" width="240" height="150" rx="12" 
                fill="#141E30" 
                stroke={activeId === 'SCADA_CONTROL' ? '#F59E0B' : '#6366F1'} 
                strokeWidth={activeId === 'SCADA_CONTROL' ? 2 : 1} 
              />
              {/* Operator monitor screens */}
              <rect x="40" y="25" width="70" height="45" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
              <polyline points="45,45 60,35 75,50 95,38" fill="none" stroke="#10B981" strokeWidth="1.5" />
              
              <rect x="125" y="25" width="70" height="45" rx="3" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
              <circle cx="160" cy="47" r="12" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 2" />
              {/* Console desk */}
              <rect x="30" y="75" width="175" height="12" rx="2" fill="#475569" />

              <text x="120" y="115" fill="#F8FAFC" fontSize="12" fontWeight="800" textAnchor="middle">
                {locale === 'fr' ? 'Centre de Conduite SCADA/EMS' : 'Grid Control Center'}
              </text>
              <text x="120" y="135" fill="#818CF8" fontSize="10.5" textAnchor="middle" fontFamily="monospace">
                Supervision 24/7 & Équilibrage Réseau
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Interactive Bottom Caption Banner */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">
            {locale === 'fr' ? 'Écosystème Connecté' : 'Connected Architecture'}
          </span>
          <span>
            {locale === 'fr'
              ? 'Cliquez sur n\'importe quel bloc pour explorer les normes et équipements associés.'
              : 'Click any section above to inspect technical standards, apparatus ratings, and flow physics.'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          EPEDE Architecture Spec 2026
        </span>
      </div>
    </div>
  );
};
