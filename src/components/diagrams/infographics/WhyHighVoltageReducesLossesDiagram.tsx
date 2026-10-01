// src/components/diagrams/infographics/WhyHighVoltageReducesLossesDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const WhyHighVoltageReducesLossesDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [hoveredSide, setHoveredSide] = useState<'LOW' | 'HIGH' | null>(null);

  const handleClick = (id: string) => {
    if (onSelectHotspot) onSelectHotspot(id);
  };

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-sans">
              {locale === 'fr'
                ? "Pourquoi la Haute Tension Réduit les Pertes"
                : "Why High Voltage Reduces Losses"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            {locale === 'fr'
              ? "Loi d'Ohm & Effet Joule : À puissance constante (P = U·I), élever la tension divise le courant et réduit les pertes thermiques au carré (P_pertes = R·I²)."
              : "Ohm's & Joule's Laws: At constant power (P = V·I), stepping up voltage lowers current, reducing conductor heat losses quadratically (P_loss = I²·R)."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-sky-500/10 text-sky-300 border border-sky-400/30">
            P = V × I · P_loss = I²R
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[16/9] min-h-[380px] max-h-[560px] relative">
        <svg
          viewBox="0 0 1100 600"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="pnl-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B1322" />
              <stop offset="100%" stopColor="#070B12" />
            </linearGradient>
            <marker id="arr-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#EF4444" />
            </marker>
            <marker id="arr-blue-thin" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 2 L 8 5 L 0 8 z" fill="#0284C7" />
            </marker>
          </defs>

          {/* ================================================================ */}
          {/* LEFT PANEL: LOWER VOLTAGE */}
          {/* ================================================================ */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick('LOSS_LOWER_VOLTAGE')}
            onMouseEnter={() => setHoveredSide('LOW')}
            onMouseLeave={() => setHoveredSide(null)}
          >
            <rect
              x="20"
              y="20"
              width="515"
              height="340"
              rx="16"
              fill="url(#pnl-grad)"
              stroke={selectedHotspotId === 'LOSS_LOWER_VOLTAGE' || hoveredSide === 'LOW' ? '#EF4444' : '#1E293B'}
              strokeWidth={selectedHotspotId === 'LOSS_LOWER_VOLTAGE' || hoveredSide === 'LOW' ? '2.5' : '1.5'}
            />

            {/* Header pill */}
            <rect x="36" y="36" width="483" height="40" rx="8" fill="#1E293B" stroke="#334155" strokeWidth="1" />
            <text x="277" y="62" fill="#F87171" fontSize="18" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'BASSE / MOYENNE TENSION' : 'LOWER VOLTAGE'}
            </text>

            {/* Source Plant */}
            <g transform="translate(45, 120)">
              <circle cx="35" cy="35" r="35" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="2" />
              {/* Factory/Plant icon */}
              <path d="M 22 48 L 22 30 L 30 30 L 30 48 M 34 48 L 34 22 L 42 22 L 42 48" stroke="#38BDF8" strokeWidth="2" fill="none" />
              <path d="M 46 48 L 46 16 L 50 16 L 50 48" stroke="#38BDF8" strokeWidth="2" />
              <text x="35" y="92" fill="#94A3B8" fontSize="12" textAnchor="middle">SOURCE</text>
            </g>

            {/* Transmission Tower 1 */}
            <g transform="translate(145, 95)">
              {/* Lattice Tower */}
              <path d="M 25 20 L 5 110 M 25 20 L 45 110" stroke="#94A3B8" strokeWidth="2" />
              <line x1="12" y1="50" x2="38" y2="50" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="8" y1="80" x2="42" y2="80" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="5" y1="110" x2="45" y2="110" stroke="#94A3B8" strokeWidth="1.5" />
              {/* Crossarms */}
              <line x1="0" y1="40" x2="50" y2="40" stroke="#94A3B8" strokeWidth="2" />
              <line x1="-5" y1="65" x2="55" y2="65" stroke="#94A3B8" strokeWidth="2" />
            </g>

            {/* High Current Flow Arrows (Thick Red) */}
            <g transform="translate(210, 115)">
              <text x="75" y="0" fill="#EF4444" fontSize="13" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
                {locale === 'fr' ? 'FORT COURANT (I ÉLEVÉ)' : 'HIGH CURRENT'}
              </text>
              <line x1="0" y1="18" x2="140" y2="18" stroke="#EF4444" strokeWidth="6" markerEnd="url(#arr-red)" />
              <line x1="0" y1="42" x2="140" y2="42" stroke="#EF4444" strokeWidth="6" markerEnd="url(#arr-red)" />

              {/* Heat waves */}
              <g transform="translate(45, 52)">
                <path d="M 10 20 Q 15 10 10 0 M 25 20 Q 30 10 25 0 M 40 20 Q 45 10 40 0" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
                <text x="25" y="32" fill="#F97316" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {locale === 'fr' ? 'ÉCHAUFFEMENT FORT' : 'MORE HEATING'}
                </text>
              </g>
            </g>

            {/* Load Building */}
            <g transform="translate(435, 120)">
              <circle cx="35" cy="35" r="35" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="2" />
              <rect x="22" y="20" width="26" height="30" rx="2" fill="#0284C7" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="26" y1="26" x2="30" y2="26" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="38" y1="26" x2="42" y2="26" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="26" y1="36" x2="30" y2="36" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="38" y1="36" x2="42" y2="36" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="35" y="92" fill="#94A3B8" fontSize="12" textAnchor="middle">LOAD</text>
            </g>

            {/* Higher Losses Box */}
            <rect x="140" y="275" width="275" height="65" rx="10" fill="#EF4444" fillOpacity="0.1" stroke="#EF4444" strokeWidth="1.5" />
            <text x="277" y="297" fill="#F87171" fontSize="13" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'PERTES JOULE ÉLEVÉES' : 'HIGHER LOSSES'}
            </text>
            <g transform="translate(210, 305)">
              {[0, 22, 44, 66, 88, 110].map((x, idx) => (
                <path
                  key={idx}
                  d={`M ${x + 6} 0 L ${x} 12 L ${x + 5} 12 L ${x + 2} 22 L ${x + 10} 8 L ${x + 5} 8 Z`}
                  fill="#EF4444"
                />
              ))}
            </g>
          </g>

          {/* ================================================================ */}
          {/* RIGHT PANEL: HIGHER VOLTAGE */}
          {/* ================================================================ */}
          <g
            className="cursor-pointer transition-all duration-200"
            onClick={() => handleClick('LOSS_HIGHER_VOLTAGE')}
            onMouseEnter={() => setHoveredSide('HIGH')}
            onMouseLeave={() => setHoveredSide(null)}
          >
            <rect
              x="565"
              y="20"
              width="515"
              height="340"
              rx="16"
              fill="url(#pnl-grad)"
              stroke={selectedHotspotId === 'LOSS_HIGHER_VOLTAGE' || hoveredSide === 'HIGH' ? '#0284C7' : '#1E293B'}
              strokeWidth={selectedHotspotId === 'LOSS_HIGHER_VOLTAGE' || hoveredSide === 'HIGH' ? '2.5' : '1.5'}
            />

            {/* Header pill */}
            <rect x="581" y="36" width="483" height="40" rx="8" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="1" />
            <text x="822" y="62" fill="#38BDF8" fontSize="18" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'HAUTE / TRÈS HAUTE TENSION (THT)' : 'HIGHER VOLTAGE'}
            </text>

            {/* Source Plant */}
            <g transform="translate(590, 120)">
              <circle cx="35" cy="35" r="35" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="2" />
              <path d="M 22 48 L 22 30 L 30 30 L 30 48 M 34 48 L 34 22 L 42 22 L 42 48" stroke="#38BDF8" strokeWidth="2" fill="none" />
              <path d="M 46 48 L 46 16 L 50 16 L 50 48" stroke="#38BDF8" strokeWidth="2" />
              <text x="35" y="92" fill="#94A3B8" fontSize="12" textAnchor="middle">SOURCE</text>
            </g>

            {/* Transmission Tower 2 */}
            <g transform="translate(690, 95)">
              <path d="M 25 20 L 5 110 M 25 20 L 45 110" stroke="#94A3B8" strokeWidth="2" />
              <line x1="12" y1="50" x2="38" y2="50" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="8" y1="80" x2="42" y2="80" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="5" y1="110" x2="45" y2="110" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="0" y1="40" x2="50" y2="40" stroke="#94A3B8" strokeWidth="2" />
              <line x1="-5" y1="65" x2="55" y2="65" stroke="#94A3B8" strokeWidth="2" />
            </g>

            {/* Low Current Flow Arrows (Thin Blue) */}
            <g transform="translate(755, 115)">
              <text x="75" y="0" fill="#38BDF8" fontSize="13" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
                {locale === 'fr' ? 'FAIBLE COURANT (I RÉDUIT)' : 'LOW CURRENT'}
              </text>
              <line x1="10" y1="18" x2="130" y2="18" stroke="#0284C7" strokeWidth="2.5" markerEnd="url(#arr-blue-thin)" />
              <line x1="10" y1="42" x2="130" y2="42" stroke="#0284C7" strokeWidth="2.5" markerEnd="url(#arr-blue-thin)" />

              {/* Slight heat waves */}
              <g transform="translate(55, 52)">
                <path d="M 20 20 Q 24 10 20 0" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
                <text x="20" y="32" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  {locale === 'fr' ? 'ÉCHAUFFEMENT FAIBLE' : 'LESS HEATING'}
                </text>
              </g>
            </g>

            {/* Load Building */}
            <g transform="translate(980, 120)">
              <circle cx="35" cy="35" r="35" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="2" />
              <rect x="22" y="20" width="26" height="30" rx="2" fill="#0284C7" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="26" y1="26" x2="30" y2="26" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="38" y1="26" x2="42" y2="26" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="26" y1="36" x2="30" y2="36" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="38" y1="36" x2="42" y2="36" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="35" y="92" fill="#94A3B8" fontSize="12" textAnchor="middle">LOAD</text>
            </g>

            {/* Lower Losses Box */}
            <rect x="685" y="275" width="275" height="65" rx="10" fill="#0284C7" fillOpacity="0.15" stroke="#0284C7" strokeWidth="1.5" />
            <text x="822" y="297" fill="#38BDF8" fontSize="13" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'PERTES JOULE MINIMISÉES' : 'LOWER LOSSES'}
            </text>
            <g transform="translate(775, 305)">
              {[0, 25, 50, 75].map((x, idx) => (
                <path
                  key={idx}
                  d={`M ${x + 6} 0 L ${x} 12 L ${x + 5} 12 L ${x + 2} 22 L ${x + 10} 8 L ${x + 5} 8 Z`}
                  fill={idx < 2 ? '#0284C7' : '#334155'}
                />
              ))}
            </g>
          </g>

          {/* ================================================================ */}
          {/* MIDDLE DUAL FORMULA BOXES */}
          {/* ================================================================ */}
          {/* Left Formula: P = V x I */}
          <g transform="translate(100, 385)">
            <rect x="0" y="0" width="400" height="75" rx="12" fill="#0B1322" stroke="#0284C7" strokeWidth="1.5" />
            <text x="200" y="32" fill="#38BDF8" fontSize="22" fontWeight="black" textAnchor="middle" fontFamily="monospace">
              P = V × I
            </text>
            <text x="200" y="58" fill="#94A3B8" fontSize="13" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'Puissance = Tension × Courant  (I = P / V)' : 'Power = Voltage × Current'}
            </text>
          </g>

          {/* Right Formula: Power loss = I²R */}
          <g transform="translate(600, 385)">
            <rect x="0" y="0" width="400" height="75" rx="12" fill="#0B1322" stroke="#0284C7" strokeWidth="1.5" />
            <text x="200" y="32" fill="#38BDF8" fontSize="22" fontWeight="black" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? 'P_pertes = I² · R' : 'Power loss = I² R'}
            </text>
            <text x="200" y="58" fill="#94A3B8" fontSize="13" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr'
                ? 'Les pertes thermiques sont proportionnelles au carré du courant'
                : 'Power loss is proportional to the square of current'}
            </text>
          </g>

          {/* ================================================================ */}
          {/* BOTTOM SUMMARY BANNER */}
          {/* ================================================================ */}
          <g transform="translate(30, 485)">
            <rect x="0" y="0" width="1040" height="85" rx="14" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="2" />
            {/* Lightbulb icon */}
            <circle cx="55" cy="42" r="26" fill="#0284C7" />
            <path d="M 55 24 C 47 24 41 30 41 37 C 41 42 44 46 47 48 L 47 52 L 63 52 L 63 48 C 66 46 69 42 69 37 C 69 30 63 24 55 24 Z" fill="#FFFFFF" />
            <rect x="49" y="54" width="12" height="3" rx="1.5" fill="#FFFFFF" />

            <text x="105" y="38" fill="#FFFFFF" fontSize="18" fontWeight="bold" fontFamily="sans-serif">
              {locale === 'fr'
                ? 'À puissance égale, multiplier la tension divise le courant d\'autant...'
                : 'For the same power, increasing voltage reduces current...'}
            </text>
            <text x="105" y="64" fill="#38BDF8" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
              {locale === 'fr'
                ? '...et divise les pertes par le carré de ce facteur (ex: tension ×2 = courant /2 = pertes thermiques divisées par 4 !)'
                : '...which greatly reduces line losses (e.g. 2x voltage = 1/2 current = 1/4 line thermal loss!)'}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
