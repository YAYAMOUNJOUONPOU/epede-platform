// src/components/diagrams/infographics/SubstationSldDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const SubstationSldDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-mono">
              {locale === 'fr' 
                ? "Schéma Unifilaire Fondamental de Poste (SLD)" 
                : "Basic Substation One-Line Diagram (SLD)"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {locale === 'fr' 
              ? "Symbolique normalisée CEI/IEEE, agencement de coupure et zone de protection globale"
              : "Standardized IEC/IEEE symbology, switching arrangement, and primary protection perimeter"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
            CEI 60617 · IEEE Std 315
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
          {/* ==================================================================== */}
          {/* LEFT PANEL: STANDARDIZED LEGEND */}
          {/* ==================================================================== */}
          <g transform="translate(40, 40)">
            <rect x="0" y="0" width="280" height="520" rx="14" fill="#0D1524" stroke="#1E293B" strokeWidth="1.5" />
            
            {/* Header */}
            <rect x="20" y="20" width="240" height="36" rx="8" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="1" />
            <text x="140" y="43" fill="#38BDF8" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? 'LÉGENDE NORMALISÉE' : 'LEGEND'}
            </text>

            {/* Legend Items */}
            <g transform="translate(30, 80)">
              {/* 1. Incoming Line */}
              <g transform="translate(0, 0)">
                <line x1="10" y1="20" x2="60" y2="20" stroke="#38BDF8" strokeWidth="3" />
                <text x="85" y="24" fill="#E2E8F0" fontSize="13" fontWeight="600">
                  {locale === 'fr' ? 'Ligne Arrivée' : 'Incoming Line'}
                </text>
              </g>

              {/* 2. Breaker */}
              <g transform="translate(0, 55)">
                <rect x="20" y="5" width="30" height="30" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
                <text x="85" y="25" fill="#E2E8F0" fontSize="13" fontWeight="600">
                  {locale === 'fr' ? 'Disjoncteur' : 'Breaker'}
                </text>
              </g>

              {/* 3. Main Bus */}
              <g transform="translate(0, 115)">
                <line x1="5" y1="20" x2="65" y2="20" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
                <text x="85" y="24" fill="#E2E8F0" fontSize="13" fontWeight="600">
                  {locale === 'fr' ? 'Jeu de Barres' : 'Main Bus'}
                </text>
              </g>

              {/* 4. Transformer */}
              <g transform="translate(0, 175)">
                <circle cx="25" cy="20" r="16" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
                <circle cx="45" cy="20" r="16" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
                <text x="85" y="24" fill="#E2E8F0" fontSize="13" fontWeight="600">
                  {locale === 'fr' ? 'Transformateur' : 'Transformer'}
                </text>
              </g>

              {/* 5. Feeders */}
              <g transform="translate(0, 240)">
                <line x1="35" y1="5" x2="35" y2="35" stroke="#10B981" strokeWidth="3" />
                <polygon points="30,35 40,35 35,45" fill="#10B981" />
                <text x="85" y="27" fill="#E2E8F0" fontSize="13" fontWeight="600">
                  {locale === 'fr' ? 'Départs Aval' : 'Feeders'}
                </text>
              </g>

              {/* 6. CT / PT */}
              <g transform="translate(0, 310)">
                <line x1="10" y1="20" x2="60" y2="20" stroke="#94A3B8" strokeWidth="2" />
                <circle cx="35" cy="20" r="14" fill="none" stroke="#A855F7" strokeWidth="2.5" />
                <text x="85" y="24" fill="#E2E8F0" fontSize="13" fontWeight="600">
                  {locale === 'fr' ? 'Transformateur Mesure' : 'CT / PT'}
                </text>
              </g>

              {/* 7. Protection Zone boundary */}
              <g transform="translate(0, 375)">
                <rect x="10" y="5" width="50" height="30" rx="4" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5 3" />
                <text x="85" y="24" fill="#38BDF8" fontSize="13" fontWeight="600">
                  {locale === 'fr' ? 'Zone Protection' : 'Protection Zone'}
                </text>
              </g>
            </g>
          </g>

          {/* ==================================================================== */}
          {/* RIGHT PANEL: COMPLETE ONE-LINE SCHEMATIC */}
          {/* ==================================================================== */}
          <g transform="translate(360, 40)">
            <rect x="0" y="0" width="700" height="520" rx="14" fill="#0D1524" stroke="#1E293B" strokeWidth="1.5" />
            
            {/* Title */}
            <text x="350" y="45" fill="#F8FAFC" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? 'SCHÉMA UNIFILAIRE DU POSTE (SLD)' : 'SUBSTATION SINGLE-LINE DIAGRAM (SLD)'}
            </text>

            {/* DASHED PROTECTION ZONE BOUNDARY */}
            <rect 
              x="140" y="115" width="420" height="300" rx="16"
              fill="#0284C7" fillOpacity="0.05"
              stroke="#0284C7" strokeWidth="2.5" strokeDasharray="8 5"
            />
            {/* Protection Zone Label */}
            <rect x="420" y="125" width="130" height="26" rx="4" fill="#0284C7" />
            <text x="485" y="142" fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle">
              ⟵ {locale === 'fr' ? 'ZONE PROTECTION' : 'PROTECTION ZONE'}
            </text>

            {/* Incoming Line at Top */}
            <g transform="translate(350, 60)">
              <text x="0" y="0" fill="#38BDF8" fontSize="13" fontWeight="bold" textAnchor="middle">
                {locale === 'fr' ? 'Ligne Arrivée THT (225 kV)' : 'Incoming Line (225 kV)'}
              </text>
              <line x1="0" y1="10" x2="0" y2="40" stroke="#38BDF8" strokeWidth="3" />

              {/* CT/PT */}
              <circle cx="0" cy="55" r="14" fill="#0D1524" stroke="#A855F7" strokeWidth="2.5" />
              <text x="25" y="60" fill="#C084FC" fontSize="11" fontWeight="600">TC/TT</text>
              <line x1="0" y1="70" x2="0" y2="85" stroke="#38BDF8" strokeWidth="3" />

              {/* Incoming Breaker */}
              <rect x="-18" y="85" width="36" height="36" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
              <text x="0" y="108" fill="#38BDF8" fontSize="12" fontWeight="bold" textAnchor="middle">Q0</text>
              <line x1="0" y1="121" x2="0" y2="150" stroke="#38BDF8" strokeWidth="3" />
            </g>

            {/* MAIN BUSBAR (Thick Horizontal Line) */}
            <g transform="translate(180, 210)">
              <line x1="0" y1="0" x2="340" y2="0" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
              <text x="170" y="-12" fill="#FBBF24" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                {locale === 'fr' ? 'JEU DE BARRES PRINCIPAL (MAIN BUS)' : 'MAIN BUSBAR'}
              </text>
            </g>

            {/* Downward Path from Busbar to Transformer */}
            <g transform="translate(350, 210)">
              <line x1="0" y1="0" x2="0" y2="30" stroke="#F59E0B" strokeWidth="3" />
              {/* CT/PT */}
              <circle cx="0" cy="45" r="14" fill="#0D1524" stroke="#A855F7" strokeWidth="2.5" />
              <line x1="0" y1="60" x2="0" y2="75" stroke="#F59E0B" strokeWidth="3" />

              {/* TRANSFORMER (Interlocking Circles) */}
              <circle cx="0" cy="95" r="22" fill="none" stroke="#F59E0B" strokeWidth="3" />
              <circle cx="0" cy="125" r="22" fill="none" stroke="#F59E0B" strokeWidth="3" />
              <text x="45" y="115" fill="#FDE68A" fontSize="12" fontWeight="bold">
                {locale === 'fr' ? 'Transformateur' : 'Transformer'}
              </text>
              <line x1="0" y1="147" x2="0" y2="180" stroke="#10B981" strokeWidth="3" />
            </g>

            {/* LOWER FEEDER BUS */}
            <g transform="translate(180, 390)">
              <line x1="0" y1="0" x2="340" y2="0" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
              <text x="170" y="20" fill="#34D399" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                {locale === 'fr' ? 'Barre Moyenne Tension (30 kV)' : 'Feeder Bus (30 kV)'}
              </text>
            </g>

            {/* 4 OUTGOING FEEDERS WITH ARROWS */}
            {[205, 275, 385, 455].map((fx, idx) => (
              <g key={idx} transform={`translate(${fx}, 390)`}>
                <line x1="0" y1="0" x2="0" y2="25" stroke="#10B981" strokeWidth="2.5" />
                {/* Feeder Breaker */}
                <rect x="-12" y="25" width="24" height="24" rx="3" fill="#0F172A" stroke="#10B981" strokeWidth="2" />
                <line x1="0" y1="49" x2="0" y2="60" stroke="#10B981" strokeWidth="2.5" />
                {/* Feeder CT */}
                <circle cx="0" cy="70" r="10" fill="#0D1524" stroke="#A855F7" strokeWidth="2" />
                <line x1="0" y1="80" x2="0" y2="100" stroke="#10B981" strokeWidth="2.5" />
                {/* Downward Arrow */}
                <polygon points="-6,100 6,100 0,110" fill="#10B981" />
                <text x="0" y="124" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  D0{idx + 1}
                </text>
              </g>
            ))}

            <text x="350" y="495" fill="#34D399" fontSize="12" fontWeight="bold" textAnchor="middle">
              {locale === 'fr' ? 'Départs de Distribution (Feeders)' : 'Outgoing Distribution Feeders'}
            </text>
          </g>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold font-mono">
            {locale === 'fr' ? 'Lecture du Schéma' : 'SLD Convention'}
          </span>
          <span>
            {locale === 'fr'
              ? 'La zone délimitée en pointillés bleus correspond au périmètre surveillé par les protections différentielles du poste.'
              : 'The dashed perimeter illustrates the primary zone under supervision by differential relaying.'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          EPEDE SLD Spec 2026
        </span>
      </div>
    </div>
  );
};
