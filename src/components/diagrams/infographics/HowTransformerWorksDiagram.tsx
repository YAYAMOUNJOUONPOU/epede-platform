// src/components/diagrams/infographics/HowTransformerWorksDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const HowTransformerWorksDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const handleClick = (id: string) => {
    if (onSelectHotspot) onSelectHotspot(id);
  };

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-sans">
              {locale === 'fr'
                ? "Fonctionnement d'un Transformateur"
                : "How a Transformer Works"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            {locale === 'fr'
              ? "Induction électromagnétique (Lois de Faraday et de Lenz) et couplage par flux magnétique mutuel"
              : "Electromagnetic induction principles (Faraday & Lenz Laws) through mutual magnetic flux coupling"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-400/30">
            CEI 60076 · IEEE C57.12
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[16/10] min-h-[380px] max-h-[580px] relative">
        <svg
          viewBox="0 0 1100 640"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id="flux-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 2 L 8 5 L 0 8 z" fill="#0284C7" />
            </marker>
            <linearGradient id="core-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="25%" stopColor="#94A3B8" />
              <stop offset="50%" stopColor="#E2E8F0" />
              <stop offset="75%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="copper-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="50%" stopColor="#C2410C" />
              <stop offset="100%" stopColor="#7C2D12" />
            </linearGradient>
            <filter id="glow-flux" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ================================================================ */}
          {/* BASE STAND */}
          {/* ================================================================ */}
          <rect x="220" y="520" width="660" height="34" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="2" />
          <rect x="200" y="545" width="700" height="24" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          <circle cx="250" cy="537" r="7" fill="#070B12" stroke="#475569" strokeWidth="2" />
          <circle cx="850" cy="537" r="7" fill="#070B12" stroke="#475569" strokeWidth="2" />

          {/* ================================================================ */}
          {/* LAMINATED MAGNETIC CORE */}
          {/* ================================================================ */}
          <g
            className="cursor-pointer"
            onClick={() => handleClick('MAGNETIC_CORE')}
            onMouseEnter={() => setHoveredPart('MAGNETIC_CORE')}
            onMouseLeave={() => setHoveredPart(null)}
          >
            {/* Outer core block with rounded corners */}
            <rect
              x="280"
              y="110"
              width="540"
              height="410"
              rx="24"
              fill="url(#core-grad)"
              stroke={selectedHotspotId === 'MAGNETIC_CORE' || hoveredPart === 'MAGNETIC_CORE' ? '#38BDF8' : '#475569'}
              strokeWidth={selectedHotspotId === 'MAGNETIC_CORE' || hoveredPart === 'MAGNETIC_CORE' ? '3' : '2'}
            />

            {/* Inner window cut-out */}
            <rect
              x="420"
              y="210"
              width="260"
              height="210"
              rx="12"
              fill="#070B12"
              stroke="#475569"
              strokeWidth="2"
            />

            {/* Laminations visual lines */}
            {[118, 126, 134, 142, 502, 510].map((y, i) => (
              <line key={i} x1="290" y1={y} x2="810" y2={y} stroke="#64748B" strokeWidth="0.8" strokeOpacity="0.4" />
            ))}
            {[290, 298, 306, 314, 786, 794, 802].map((x, i) => (
              <line key={i} x1={x} y1="130" x2={x} y2="500" stroke="#64748B" strokeWidth="0.8" strokeOpacity="0.4" />
            ))}
          </g>

          {/* ================================================================ */}
          {/* MAGNETIC FLUX PATH & ARROWS */}
          {/* ================================================================ */}
          <g
            className="cursor-pointer"
            onClick={() => handleClick('MAGNETIC_FLUX')}
            onMouseEnter={() => setHoveredPart('MAGNETIC_FLUX')}
            onMouseLeave={() => setHoveredPart(null)}
          >
            {/* Dashed circulating flux loop */}
            <rect
              x="350"
              y="160"
              width="400"
              height="310"
              rx="18"
              fill="none"
              stroke="#0284C7"
              strokeWidth="4"
              strokeDasharray="14 10"
              filter="url(#glow-flux)"
            />

            {/* Flux directional arrows */}
            {/* Top right-going */}
            <line x1="510" y1="160" x2="570" y2="160" stroke="#0284C7" strokeWidth="4" markerEnd="url(#flux-arrow)" />
            {/* Right down-going */}
            <line x1="750" y1="280" x2="750" y2="340" stroke="#0284C7" strokeWidth="4" markerEnd="url(#flux-arrow)" />
            {/* Bottom left-going */}
            <line x1="570" y1="470" x2="510" y2="470" stroke="#0284C7" strokeWidth="4" markerEnd="url(#flux-arrow)" />
            {/* Left up-going */}
            <line x1="350" y1="340" x2="350" y2="280" stroke="#0284C7" strokeWidth="4" markerEnd="url(#flux-arrow)" />
          </g>

          {/* ================================================================ */}
          {/* PRIMARY WINDING (LEFT LIMB) */}
          {/* ================================================================ */}
          <g
            className="cursor-pointer"
            onClick={() => handleClick('PRIMARY_WINDING')}
            onMouseEnter={() => setHoveredPart('PRIMARY_WINDING')}
            onMouseLeave={() => setHoveredPart(null)}
          >
            {/* Copper turns on left leg */}
            {[230, 252, 274, 296, 318, 340, 362, 384].map((y, idx) => (
              <g key={idx}>
                {/* Turn front ellipse */}
                <rect x="270" y={y} width="140" height="15" rx="7" fill="url(#copper-grad)" stroke="#EA580C" strokeWidth="1.5" />
                <line x1="275" y1={y + 4} x2="405" y2={y + 4} stroke="#FED7AA" strokeWidth="1" strokeOpacity="0.5" />
              </g>
            ))}

            {/* Input terminals and leads */}
            <path d="M 120 237 L 270 237" fill="none" stroke="#C2410C" strokeWidth="4" />
            <circle cx="115" cy="237" r="7" fill="#070B12" stroke="#EA580C" strokeWidth="3" />

            <path d="M 120 392 L 270 392" fill="none" stroke="#C2410C" strokeWidth="4" />
            <circle cx="115" cy="392" r="7" fill="#070B12" stroke="#EA580C" strokeWidth="3" />
          </g>

          {/* ================================================================ */}
          {/* SECONDARY WINDING (RIGHT LIMB) */}
          {/* ================================================================ */}
          <g
            className="cursor-pointer"
            onClick={() => handleClick('SECONDARY_WINDING')}
            onMouseEnter={() => setHoveredPart('SECONDARY_WINDING')}
            onMouseLeave={() => setHoveredPart(null)}
          >
            {/* Copper turns on right leg (fewer turns or same for illustration) */}
            {[252, 278, 304, 330, 356, 382].map((y, idx) => (
              <g key={idx}>
                <rect x="690" y={y} width="140" height="17" rx="8" fill="url(#copper-grad)" stroke="#EA580C" strokeWidth="1.5" />
                <line x1="695" y1={y + 4} x2="825" y2={y + 4} stroke="#FED7AA" strokeWidth="1" strokeOpacity="0.5" />
              </g>
            ))}

            {/* Output terminals and leads */}
            <path d="M 830 260 L 980 260" fill="none" stroke="#C2410C" strokeWidth="4" />
            <circle cx="985" cy="260" r="7" fill="#070B12" stroke="#EA580C" strokeWidth="3" />

            <path d="M 830 390 L 980 390" fill="none" stroke="#C2410C" strokeWidth="4" />
            <circle cx="985" cy="390" r="7" fill="#070B12" stroke="#EA580C" strokeWidth="3" />
          </g>

          {/* ================================================================ */}
          {/* SINE WAVES: AC INPUT & INDUCED OUTPUT */}
          {/* ================================================================ */}
          {/* Left AC Input Wave */}
          <g transform="translate(40, 270)">
            <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="1.5" strokeDasharray="3,3" />
            <path
              d="M 10 50 Q 32.5 0 55 50 T 100 50"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            <text x="50" y="85" fill="#38BDF8" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'Entrée CA (V₁)' : 'AC Input'}
            </text>
          </g>

          {/* Right Induced Output Wave */}
          <g transform="translate(960, 270)">
            <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="1.5" strokeDasharray="3,3" />
            <path
              d="M 10 50 Q 32.5 15 55 50 T 100 50"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />
            <text x="50" y="85" fill="#38BDF8" fontSize="15" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'Sortie Induite (V₂)' : 'Induced Output'}
            </text>
          </g>

          {/* ================================================================ */}
          {/* CALLOUT LABELS & LEADER LINES */}
          {/* ================================================================ */}
          {/* Primary Winding Callout */}
          <g transform="translate(200, 70)">
            <text x="0" y="0" fill="#38BDF8" fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'Enroulement Primaire' : 'Primary Winding'}
            </text>
            <path d="M 0 10 L 0 50 L 80 150" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="80" cy="150" r="3.5" fill="#38BDF8" />
          </g>

          {/* Magnetic Core Callout */}
          <g transform="translate(550, 60)">
            <text x="0" y="0" fill="#38BDF8" fontSize="19" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'Noyau Magnétique' : 'Magnetic Core'}
            </text>
            <line x1="0" y1="10" x2="0" y2="50" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="0" cy="50" r="3.5" fill="#38BDF8" />
          </g>

          {/* Magnetic Flux Callout (Center of window) */}
          <g transform="translate(550, 290)">
            <circle cx="0" cy="-25" r="3.5" fill="#38BDF8" />
            <line x1="0" y1="-25" x2="0" y2="0" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="0" y="25" fill="#38BDF8" fontSize="20" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'Flux Magnétique' : 'Magnetic Flux'}
            </text>
            <text x="0" y="45" fill="#94A3B8" fontSize="12" textAnchor="middle" fontFamily="monospace">
              Φ(t) = Φmax · sin(ωt)
            </text>
          </g>

          {/* Secondary Winding Callout */}
          <g transform="translate(900, 70)">
            <text x="0" y="0" fill="#38BDF8" fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'Enroulement Secondaire' : 'Secondary Winding'}
            </text>
            <path d="M 0 10 L 0 50 L -80 150" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="-80" cy="150" r="3.5" fill="#38BDF8" />
          </g>

          {/* Bottom Formula Banner */}
          <rect x="250" y="585" width="600" height="42" rx="8" fill="#0B1322" stroke="#1E293B" strokeWidth="1" />
          <text x="550" y="612" fill="#E2E8F0" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            {locale === 'fr'
              ? 'Rapport de transformation : m = V₂ / V₁ = N₂ / N₁ = I₁ / I₂  (Loi de Faraday : e = -N · dΦ/dt)'
              : 'Turns ratio: m = V₂ / V₁ = N₂ / N₁ = I₁ / I₂  (Faraday\'s Law: e = -N · dΦ/dt)'}
          </text>
        </svg>
      </div>
    </div>
  );
};
