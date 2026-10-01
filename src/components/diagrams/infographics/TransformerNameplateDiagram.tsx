// src/components/diagrams/infographics/TransformerNameplateDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const TransformerNameplateDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [hoveredField, setHoveredField] = useState<string | null>(null);

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
                ? "Comment Lire une Plaque Signalétique de Transformateur"
                : "How to Read a Transformer Nameplate"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            {locale === 'fr'
              ? "Paramètres nominaux obligatoires selon CEI 60076-1 / IEEE C57.12.00 et leur signification opérationnelle."
              : "Key electrical nameplate ratings and what they mean for engineering, sizing, and commissioning."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-400/30">
            CEI 60076-1 · IEEE C57
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[16/10] min-h-[420px] max-h-[620px] relative">
        <svg
          viewBox="0 0 1100 660"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="metal-plate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="25%" stopColor="#CBD5E1" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="75%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="plate-inner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <marker id="callout-dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
              <circle cx="5" cy="5" r="4" fill="#38BDF8" />
            </marker>
          </defs>

          {/* ================================================================ */}
          {/* CENTRAL METAL NAMEPLATE */}
          {/* ================================================================ */}
          <g transform="translate(360, 40)">
            {/* Outer metallic plate border */}
            <rect
              x="0"
              y="0"
              width="380"
              height="490"
              rx="16"
              fill="url(#metal-plate)"
              stroke="#475569"
              strokeWidth="4"
            />

            {/* Corner Rivets */}
            <circle cx="16" cy="16" r="6" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="364" cy="16" r="6" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="16" cy="474" r="6" fill="#475569" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="364" cy="474" r="6" fill="#475569" stroke="#94A3B8" strokeWidth="2" />

            {/* Inner plate body */}
            <rect
              x="12"
              y="12"
              width="356"
              height="466"
              rx="10"
              fill="url(#plate-inner)"
              stroke="#334155"
              strokeWidth="2"
            />

            {/* Title Header on Plate */}
            <rect x="25" y="25" width="330" height="42" rx="6" fill="#0B1322" stroke="#0284C7" strokeWidth="1.5" />
            <text x="190" y="52" fill="#38BDF8" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
              THREE PHASE TRANSFORMER
            </text>

            {/* Nameplate Data Rows */}
            {/* Row 1: kVA */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('NP_KVA')}
              onMouseEnter={() => setHoveredField('NP_KVA')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <rect
                x="25"
                y="80"
                width="330"
                height="34"
                rx="4"
                fill={selectedHotspotId === 'NP_KVA' || hoveredField === 'NP_KVA' ? '#0284C7' : '#0B1322'}
                fillOpacity={selectedHotspotId === 'NP_KVA' || hoveredField === 'NP_KVA' ? 0.35 : 0.6}
                stroke={selectedHotspotId === 'NP_KVA' || hoveredField === 'NP_KVA' ? '#38BDF8' : '#1E293B'}
              />
              <text x="35" y="102" fill="#94A3B8" fontSize="13" fontWeight="bold">RATING:</text>
              <text x="280" y="102" fill="#FFFFFF" fontSize="14" fontWeight="black" textAnchor="end">1500 kVA</text>
            </g>

            {/* Row 2: Primary Voltage */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('NP_VOLT_PRI')}
              onMouseEnter={() => setHoveredField('NP_VOLT_PRI')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <rect
                x="25"
                y="122"
                width="330"
                height="34"
                rx="4"
                fill={selectedHotspotId === 'NP_VOLT_PRI' || hoveredField === 'NP_VOLT_PRI' ? '#0284C7' : '#0B1322'}
                fillOpacity={selectedHotspotId === 'NP_VOLT_PRI' || hoveredField === 'NP_VOLT_PRI' ? 0.35 : 0.6}
                stroke={selectedHotspotId === 'NP_VOLT_PRI' || hoveredField === 'NP_VOLT_PRI' ? '#38BDF8' : '#1E293B'}
              />
              <text x="35" y="144" fill="#94A3B8" fontSize="13" fontWeight="bold">PRIMARY VOLTAGE:</text>
              <text x="280" y="144" fill="#FFFFFF" fontSize="14" fontWeight="black" textAnchor="end">12,470 V</text>
            </g>

            {/* Row 3: Secondary Voltage */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('NP_VOLT_SEC')}
              onMouseEnter={() => setHoveredField('NP_VOLT_SEC')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <rect
                x="25"
                y="164"
                width="330"
                height="34"
                rx="4"
                fill={selectedHotspotId === 'NP_VOLT_SEC' || hoveredField === 'NP_VOLT_SEC' ? '#0284C7' : '#0B1322'}
                fillOpacity={selectedHotspotId === 'NP_VOLT_SEC' || hoveredField === 'NP_VOLT_SEC' ? 0.35 : 0.6}
                stroke={selectedHotspotId === 'NP_VOLT_SEC' || hoveredField === 'NP_VOLT_SEC' ? '#38BDF8' : '#1E293B'}
              />
              <text x="35" y="186" fill="#94A3B8" fontSize="13" fontWeight="bold">SECONDARY VOLTAGE:</text>
              <text x="280" y="186" fill="#FFFFFF" fontSize="14" fontWeight="black" textAnchor="end">480 V</text>
            </g>

            {/* Row 4: Phase */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('NP_PHASE')}
              onMouseEnter={() => setHoveredField('NP_PHASE')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <rect
                x="25"
                y="206"
                width="330"
                height="34"
                rx="4"
                fill={selectedHotspotId === 'NP_PHASE' || hoveredField === 'NP_PHASE' ? '#0284C7' : '#0B1322'}
                fillOpacity={selectedHotspotId === 'NP_PHASE' || hoveredField === 'NP_PHASE' ? 0.35 : 0.6}
                stroke={selectedHotspotId === 'NP_PHASE' || hoveredField === 'NP_PHASE' ? '#38BDF8' : '#1E293B'}
              />
              <text x="35" y="228" fill="#94A3B8" fontSize="13" fontWeight="bold">PHASE:</text>
              <text x="280" y="228" fill="#FFFFFF" fontSize="14" fontWeight="black" textAnchor="end">3 PHASE</text>
            </g>

            {/* Row 5: Frequency */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('NP_FREQ')}
              onMouseEnter={() => setHoveredField('NP_FREQ')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <rect
                x="25"
                y="248"
                width="330"
                height="34"
                rx="4"
                fill={selectedHotspotId === 'NP_FREQ' || hoveredField === 'NP_FREQ' ? '#0284C7' : '#0B1322'}
                fillOpacity={selectedHotspotId === 'NP_FREQ' || hoveredField === 'NP_FREQ' ? 0.35 : 0.6}
                stroke={selectedHotspotId === 'NP_FREQ' || hoveredField === 'NP_FREQ' ? '#38BDF8' : '#1E293B'}
              />
              <text x="35" y="270" fill="#94A3B8" fontSize="13" fontWeight="bold">FREQUENCY:</text>
              <text x="280" y="270" fill="#FFFFFF" fontSize="14" fontWeight="black" textAnchor="end">60 Hz / 50 Hz</text>
            </g>

            {/* Row 6: % Impedance */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('NP_IMPEDANCE')}
              onMouseEnter={() => setHoveredField('NP_IMPEDANCE')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <rect
                x="25"
                y="290"
                width="330"
                height="34"
                rx="4"
                fill={selectedHotspotId === 'NP_IMPEDANCE' || hoveredField === 'NP_IMPEDANCE' ? '#0284C7' : '#0B1322'}
                fillOpacity={selectedHotspotId === 'NP_IMPEDANCE' || hoveredField === 'NP_IMPEDANCE' ? 0.35 : 0.6}
                stroke={selectedHotspotId === 'NP_IMPEDANCE' || hoveredField === 'NP_IMPEDANCE' ? '#38BDF8' : '#1E293B'}
              />
              <text x="35" y="312" fill="#94A3B8" fontSize="13" fontWeight="bold">% IMPEDANCE:</text>
              <text x="280" y="312" fill="#FFFFFF" fontSize="14" fontWeight="black" textAnchor="end">5.75 %</text>
            </g>

            {/* Row 7: Cooling Class */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('NP_COOLING')}
              onMouseEnter={() => setHoveredField('NP_COOLING')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <rect
                x="25"
                y="332"
                width="330"
                height="34"
                rx="4"
                fill={selectedHotspotId === 'NP_COOLING' || hoveredField === 'NP_COOLING' ? '#0284C7' : '#0B1322'}
                fillOpacity={selectedHotspotId === 'NP_COOLING' || hoveredField === 'NP_COOLING' ? 0.35 : 0.6}
                stroke={selectedHotspotId === 'NP_COOLING' || hoveredField === 'NP_COOLING' ? '#38BDF8' : '#1E293B'}
              />
              <text x="35" y="354" fill="#94A3B8" fontSize="13" fontWeight="bold">COOLING CLASS:</text>
              <text x="280" y="354" fill="#FFFFFF" fontSize="14" fontWeight="black" textAnchor="end">ONAN</text>
            </g>

            {/* Row 8: Tap Settings */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('NP_TAPS')}
              onMouseEnter={() => setHoveredField('NP_TAPS')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <rect
                x="25"
                y="374"
                width="330"
                height="50"
                rx="4"
                fill={selectedHotspotId === 'NP_TAPS' || hoveredField === 'NP_TAPS' ? '#0284C7' : '#0B1322'}
                fillOpacity={selectedHotspotId === 'NP_TAPS' || hoveredField === 'NP_TAPS' ? 0.35 : 0.6}
                stroke={selectedHotspotId === 'NP_TAPS' || hoveredField === 'NP_TAPS' ? '#38BDF8' : '#1E293B'}
              />
              <text x="35" y="394" fill="#94A3B8" fontSize="12" fontWeight="bold">TAP SETTINGS:</text>
              <text x="280" y="394" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="end">2.5% FCAN / FCBN</text>
              <text x="35" y="414" fill="#64748B" fontSize="11">5-Position Off-Circuit Tap Changer</text>
            </g>

            {/* Serial & Standard */}
            <text x="190" y="455" fill="#64748B" fontSize="10" textAnchor="middle">
              SERIAL: TR-8924-B • STANDARD: IEEE C57.12.00 / IEC 60076
            </text>
          </g>

          {/* ================================================================ */}
          {/* LEFT CALLOUT BOXES */}
          {/* ================================================================ */}
          {/* Callout 1: kVA Rating */}
          <g transform="translate(30, 70)">
            <rect x="0" y="0" width="290" height="60" rx="10" fill="#0B1322" stroke="#0284C7" strokeWidth="1.5" />
            <text x="16" y="24" fill="#38BDF8" fontSize="13" fontWeight="black" fontFamily="sans-serif">
              {locale === 'fr' ? 'Puissance Apparente (kVA)' : 'kVA Rating'}
            </text>
            <text x="16" y="44" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">
              {locale === 'fr' ? 'Charge maximale continue admissible' : 'Maximum load the transformer can supply'}
            </text>
            <line x1="290" y1="30" x2="385" y2="135" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="385" cy="135" r="4" fill="#38BDF8" />
          </g>

          {/* Callout 2: Primary Voltage */}
          <g transform="translate(30, 160)">
            <rect x="0" y="0" width="290" height="60" rx="10" fill="#0B1322" stroke="#0284C7" strokeWidth="1.5" />
            <text x="16" y="24" fill="#38BDF8" fontSize="13" fontWeight="black" fontFamily="sans-serif">
              {locale === 'fr' ? 'Tension Primaire (HV)' : 'Primary Voltage'}
            </text>
            <text x="16" y="44" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">
              {locale === 'fr' ? 'Tension nominale côté entrée (HTA)' : 'Input (high-side) voltage to match grid'}
            </text>
            <line x1="290" y1="30" x2="385" y2="180" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="385" cy="180" r="4" fill="#38BDF8" />
          </g>

          {/* Callout 3: Secondary Voltage */}
          <g transform="translate(30, 250)">
            <rect x="0" y="0" width="290" height="60" rx="10" fill="#0B1322" stroke="#0284C7" strokeWidth="1.5" />
            <text x="16" y="24" fill="#38BDF8" fontSize="13" fontWeight="black" fontFamily="sans-serif">
              {locale === 'fr' ? 'Tension Secondaire (LV)' : 'Secondary Voltage'}
            </text>
            <text x="16" y="44" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">
              {locale === 'fr' ? 'Tension nominale délivrée aux charges' : 'Output (low-side) voltage delivered'}
            </text>
            <line x1="290" y1="30" x2="385" y2="220" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="385" cy="220" r="4" fill="#38BDF8" />
          </g>

          {/* Callout 4: Phase */}
          <g transform="translate(30, 340)">
            <rect x="0" y="0" width="290" height="60" rx="10" fill="#0B1322" stroke="#0284C7" strokeWidth="1.5" />
            <text x="16" y="24" fill="#38BDF8" fontSize="13" fontWeight="black" fontFamily="sans-serif">
              {locale === 'fr' ? 'Nombre de Phases' : 'Phase'}
            </text>
            <text x="16" y="44" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">
              {locale === 'fr' ? 'Configuration triphasée ou monophasée' : 'Number of electrical phases (3-phase)'}
            </text>
            <line x1="290" y1="30" x2="385" y2="265" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="385" cy="265" r="4" fill="#38BDF8" />
          </g>

          {/* ================================================================ */}
          {/* RIGHT CALLOUT BOXES */}
          {/* ================================================================ */}
          {/* Callout 5: Frequency */}
          <g transform="translate(780, 70)">
            <rect x="0" y="0" width="290" height="60" rx="10" fill="#0B1322" stroke="#0284C7" strokeWidth="1.5" />
            <text x="16" y="24" fill="#38BDF8" fontSize="13" fontWeight="black" fontFamily="sans-serif">
              {locale === 'fr' ? 'Fréquence Nominale' : 'Frequency'}
            </text>
            <text x="16" y="44" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">
              {locale === 'fr' ? 'Fréquence du réseau alternatif (50 / 60 Hz)' : 'AC operating frequency of electrical grid'}
            </text>
            <line x1="0" y1="30" x2="-65" y2="245" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="-65" cy="245" r="4" fill="#38BDF8" />
          </g>

          {/* Callout 6: % Impedance */}
          <g transform="translate(780, 160)">
            <rect x="0" y="0" width="290" height="60" rx="10" fill="#0B1322" stroke="#0284C7" strokeWidth="1.5" />
            <text x="16" y="24" fill="#38BDF8" fontSize="13" fontWeight="black" fontFamily="sans-serif">
              {locale === 'fr' ? 'Impédance de Court-Circuit (uk%)' : '% Impedance'}
            </text>
            <text x="16" y="44" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">
              {locale === 'fr' ? 'Détermine le courant de court-circuit max' : 'Internal impedance affecting fault current'}
            </text>
            <line x1="0" y1="30" x2="-65" y2="190" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="-65" cy="190" r="4" fill="#38BDF8" />
          </g>

          {/* Callout 7: Cooling Class */}
          <g transform="translate(780, 250)">
            <rect x="0" y="0" width="290" height="60" rx="10" fill="#0B1322" stroke="#0284C7" strokeWidth="1.5" />
            <text x="16" y="24" fill="#38BDF8" fontSize="13" fontWeight="black" fontFamily="sans-serif">
              {locale === 'fr' ? 'Mode de Refroidissement' : 'Cooling Class'}
            </text>
            <text x="16" y="44" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">
              {locale === 'fr' ? 'ONAN : Huile Naturelle / Air Naturel' : 'Cooling method: Oil Natural Air Natural'}
            </text>
            <line x1="0" y1="30" x2="-65" y2="135" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="-65" cy="135" r="4" fill="#38BDF8" />
          </g>

          {/* Callout 8: Tap Settings */}
          <g transform="translate(780, 340)">
            <rect x="0" y="0" width="290" height="60" rx="10" fill="#0B1322" stroke="#0284C7" strokeWidth="1.5" />
            <text x="16" y="24" fill="#38BDF8" fontSize="13" fontWeight="black" fontFamily="sans-serif">
              {locale === 'fr' ? 'Prises de Réglage (Taps)' : 'Tap Settings'}
            </text>
            <text x="16" y="44" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">
              {locale === 'fr' ? 'Ajustement de tension ±2.5% hors tension' : 'Voltage adjustment positions (FCAN/FCBN)'}
            </text>
            <line x1="0" y1="30" x2="-65" y2="105" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="-65" cy="105" r="4" fill="#38BDF8" />
          </g>

          {/* ================================================================ */}
          {/* BOTTOM VERIFICATION BANNER */}
          {/* ================================================================ */}
          <g transform="translate(50, 560)">
            <rect x="0" y="0" width="1000" height="65" rx="12" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="2" />
            <circle cx="45" cy="32" r="18" fill="#0284C7" />
            <path d="M 37 32 L 43 38 L 54 26" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            <text x="80" y="28" fill="#FFFFFF" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
              {locale === 'fr'
                ? 'Vérifiez scrupuleusement ces valeurs avant mise sous tension :'
                : 'Always verify these ratings before installation or operation:'}
            </text>
            <text x="80" y="48" fill="#38BDF8" fontSize="12" fontFamily="sans-serif">
              {locale === 'fr'
                ? 'Garantit la compatibilité du réseau, le calibrage adéquat des disjoncteurs et la sécurité des installations.'
                : 'Ensures system compatibility, protection relay coordination, and safe reliable performance.'}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
