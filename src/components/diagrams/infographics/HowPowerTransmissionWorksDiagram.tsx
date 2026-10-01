// src/components/diagrams/infographics/HowPowerTransmissionWorksDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const HowPowerTransmissionWorksDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  const stages = [
    {
      id: 'TX_STAGE_1',
      stepNum: 1,
      name_fr: 'Centrale de Production',
      name_en: 'Generation',
      tag: '10 kV - 24 kV',
      desc_fr: 'Centrale hydroélectrique, thermique ou parc renouvelable',
      desc_en: 'Thermal, hydro, wind, or solar generating station'
    },
    {
      id: 'TX_STAGE_2',
      stepNum: 2,
      name_fr: 'Transfo Élévateur (GSU)',
      name_en: 'Step-Up Transformer',
      tag: 'Élévation 225 / 400 kV',
      desc_fr: 'Élévation de la tension pour réduire le courant et les pertes Joules',
      desc_en: 'Increases voltage for low-loss long distance bulk transfer'
    },
    {
      id: 'TX_STAGE_3',
      stepNum: 3,
      name_fr: 'Lignes Très Haute Tension',
      name_en: 'High-Voltage Lines',
      tag: 'Dorsale OHL / UGC',
      desc_fr: 'Conducteurs en faisceaux sur pylônes treillis en acier',
      desc_en: 'Dual circuit bundled conductors on steel lattice towers'
    },
    {
      id: 'TX_STAGE_4',
      stepNum: 4,
      name_fr: 'Poste d\'Interconnexion',
      name_en: 'Substation',
      tag: 'Nœud Électrique & Barres',
      desc_fr: 'Aiguillage des flux, coupure disjoncteurs et protections',
      desc_en: 'Switching yard, circuit breakers, busbars, and protection'
    },
    {
      id: 'TX_STAGE_5',
      stepNum: 5,
      name_fr: 'Transfo Abaisseur',
      name_en: 'Step-Down Transformer',
      tag: '225 kV → 90/33/20 kV',
      desc_fr: 'Abaissement progressif vers les réseaux régionaux',
      desc_en: 'Reduces voltage to regional and distribution grid level'
    },
    {
      id: 'TX_STAGE_6',
      stepNum: 6,
      name_fr: 'Distribution & Usagers',
      name_en: 'Distribution / Users',
      tag: 'MT / BT (400V/230V)',
      desc_fr: 'Réseaux urbains et ruraux alimentant l\'économie',
      desc_en: 'Medium/Low voltage network supplying cities and factories'
    }
  ];

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-sans">
              {locale === 'fr'
                ? "Comment Fonctionne le Transport d'Énergie"
                : "How Power Transmission Works"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            {locale === 'fr'
              ? "La tension est considérablement augmentée pour acheminer l'énergie en vrac sur de grandes distances avec un rendement maximal."
              : "Voltage is increased for efficient long-distance bulk power transfer across national corridors."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-sky-500/10 text-sky-300 border border-sky-400/30">
            Dorsale THT · 225/400 kV
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
            <marker id="tx-flow-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#0284C7" />
            </marker>
          </defs>

          {/* Flow pipe line */}
          <path
            d="M 100 240 L 980 240"
            fill="none"
            stroke="#1E293B"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 100 240 L 980 240"
            fill="none"
            stroke="#0284C7"
            strokeWidth="3"
            strokeDasharray="8 6"
          />

          {stages.map((st, i) => {
            const x = 50 + i * 170;
            const isHovered = hoveredStage === st.stepNum || selectedHotspotId === st.id;
            return (
              <g
                key={st.id}
                transform={`translate(${x}, 40)`}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectHotspot && onSelectHotspot(st.id)}
                onMouseEnter={() => setHoveredStage(st.stepNum)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                {/* Column Card Background */}
                <rect
                  x="0"
                  y="0"
                  width="155"
                  height="460"
                  rx="14"
                  fill="#0B1322"
                  stroke={isHovered ? '#38BDF8' : '#1E293B'}
                  strokeWidth={isHovered ? '2.5' : '1.5'}
                />

                {/* Step Number Badge */}
                <circle cx="28" cy="32" r="16" fill={isHovered ? '#38BDF8' : '#0284C7'} />
                <text x="28" y="38" fill="#FFFFFF" fontSize="16" fontWeight="bold" textAnchor="middle">
                  {st.stepNum}
                </text>

                {/* Title */}
                <text x="52" y="36" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                  {locale === 'fr' ? st.name_fr : st.name_en}
                </text>

                {/* Subtag */}
                <rect x="10" y="58" width="135" height="24" rx="6" fill="#070B12" stroke="#0284C7" strokeWidth="1" />
                <text x="77" y="74" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {st.tag}
                </text>

                {/* Graphical Area */}
                <g transform="translate(18, 100)">
                  <rect x="0" y="0" width="120" height="180" rx="10" fill="#070B12" stroke="#1E293B" strokeWidth="1" />

                  {/* Stage 1: Power Plant / Generator */}
                  {st.stepNum === 1 && (
                    <g transform="translate(20, 30)">
                      <circle cx="40" cy="40" r="34" fill="#1E293B" stroke="#0284C7" strokeWidth="2" />
                      <text x="40" y="35" fill="#38BDF8" fontSize="18" fontWeight="bold" textAnchor="middle">GEN</text>
                      <path d="M 25 50 Q 32 42 40 50 T 55 50" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
                      <rect x="15" y="85" width="50" height="30" rx="3" fill="#0B1322" stroke="#475569" strokeWidth="1.5" />
                      <line x1="25" y1="85" x2="25" y2="74" stroke="#94A3B8" strokeWidth="2" />
                      <line x1="40" y1="85" x2="40" y2="74" stroke="#94A3B8" strokeWidth="2" />
                      <line x1="55" y1="85" x2="55" y2="74" stroke="#94A3B8" strokeWidth="2" />
                    </g>
                  )}

                  {/* Stage 2: Step-Up Transformer (GSU) */}
                  {st.stepNum === 2 && (
                    <g transform="translate(60, 90)">
                      <circle cx="0" cy="-18" r="28" fill="#0B1322" stroke="#0284C7" strokeWidth="2.5" />
                      <circle cx="0" cy="18" r="28" fill="#0B1322" stroke="#F59E0B" strokeWidth="2.5" />
                      <path d="M 0 -45 L 0 -55" stroke="#0284C7" strokeWidth="2" />
                      <path d="M 0 45 L 0 55" stroke="#F59E0B" strokeWidth="2" />
                      <text x="0" y="3" fill="#38BDF8" fontSize="12" fontWeight="bold" textAnchor="middle">▲ HV</text>
                    </g>
                  )}

                  {/* Stage 3: High Voltage Lattice Towers */}
                  {st.stepNum === 3 && (
                    <g transform="translate(60, 25)">
                      <path d="M 0 10 L -25 130 M 0 10 L 25 130" stroke="#38BDF8" strokeWidth="2.5" />
                      <line x1="-35" y1="35" x2="35" y2="35" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="-40" y1="65" x2="40" y2="65" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="-20" y1="95" x2="20" y2="95" stroke="#38BDF8" strokeWidth="1.5" />
                      <line x1="-25" y1="130" x2="25" y2="130" stroke="#38BDF8" strokeWidth="2" />
                      {/* Suspended conductors */}
                      <path d="M -35 40 Q -10 60 15 40" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                    </g>
                  )}

                  {/* Stage 4: Substation Busbars & Breakers */}
                  {st.stepNum === 4 && (
                    <g transform="translate(20, 30)">
                      {/* Busbars */}
                      <line x1="10" y1="30" x2="70" y2="30" stroke="#EF4444" strokeWidth="3" />
                      <line x1="10" y1="45" x2="70" y2="45" stroke="#EF4444" strokeWidth="3" />
                      {/* Circuit Breaker */}
                      <rect x="25" y="70" width="30" height="30" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
                      <line x1="40" y1="45" x2="40" y2="70" stroke="#94A3B8" strokeWidth="2" />
                      <line x1="40" y1="100" x2="40" y2="125" stroke="#94A3B8" strokeWidth="2" />
                      <text x="40" y="89" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">CB</text>
                    </g>
                  )}

                  {/* Stage 5: Step-Down Transformer */}
                  {st.stepNum === 5 && (
                    <g transform="translate(60, 90)">
                      <circle cx="0" cy="-18" r="28" fill="#0B1322" stroke="#F59E0B" strokeWidth="2.5" />
                      <circle cx="0" cy="18" r="28" fill="#0B1322" stroke="#0284C7" strokeWidth="2.5" />
                      <path d="M 0 -45 L 0 -55" stroke="#F59E0B" strokeWidth="2" />
                      <path d="M 0 45 L 0 55" stroke="#0284C7" strokeWidth="2" />
                      <text x="0" y="3" fill="#38BDF8" fontSize="12" fontWeight="bold" textAnchor="middle">▼ MV</text>
                    </g>
                  )}

                  {/* Stage 6: Distribution End Users */}
                  {st.stepNum === 6 && (
                    <g transform="translate(20, 35)">
                      <path d="M 20 20 L 0 35 L 5 35 L 5 65 L 35 65 L 35 35 L 40 35 Z" fill="#0284C7" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.8" />
                      <rect x="42" y="15" width="34" height="60" rx="3" fill="#0284C7" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="1.8" />
                      <rect x="48" y="25" width="6" height="6" fill="#38BDF8" />
                      <rect x="64" y="25" width="6" height="6" fill="#38BDF8" />
                      <rect x="48" y="40" width="6" height="6" fill="#38BDF8" />
                      <rect x="64" y="40" width="6" height="6" fill="#38BDF8" />
                    </g>
                  )}
                </g>

                {/* Description */}
                <foreignObject x="10" y="300" width="135" height="70">
                  <div className="text-[11px] text-slate-300 leading-tight font-sans text-center">
                    {locale === 'fr' ? st.desc_fr : st.desc_en}
                  </div>
                </foreignObject>

                {/* Arrow to Next */}
                {i < stages.length - 1 && (
                  <g transform="translate(155, 230)">
                    <line x1="0" y1="0" x2="14" y2="0" stroke="#0284C7" strokeWidth="3" markerEnd="url(#tx-flow-arrow)" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Bottom Summary Banner */}
          <rect x="50" y="520" width="1000" height="65" rx="12" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="1.5" />
          <text x="550" y="547" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            {locale === 'fr'
              ? 'L\'interconnexion régionale permet d\'équilibrer la charge entre bassins de production et grands centres de consommation.'
              : 'Bulk transmission links diverse generating stations with metropolitan load centers via synchronous corridors.'}
          </text>
          <text x="550" y="568" fill="#38BDF8" fontSize="12" textAnchor="middle" fontFamily="sans-serif">
            {locale === 'fr'
              ? 'Conforme aux codes de réseau de transport SONATREL / CEI 61970 / IEEE 738'
              : 'Compliant with Grid Codes, IEC 61970 CIM standards, and IEEE 738 thermal line ratings'}
          </text>
        </svg>
      </div>
    </div>
  );
};
