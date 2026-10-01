// src/components/diagrams/infographics/RenewableCollectorSubstationDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const RenewableCollectorSubstationDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const handleClick = (id: string) => {
    if (onSelectHotspot) onSelectHotspot(id);
  };

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-sans">
              {locale === 'fr'
                ? "Poste d'Évacuation et de Collecte Renouvelable"
                : "Renewable Collector Substation"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            {locale === 'fr'
              ? "Collecte l'énergie des parcs solaires et éoliens (34.5 kV), élève la tension et l'injecte au Point d'Interconnexion (POI)."
              : "Collects power from multiple renewable sources, steps up voltage, and delivers it to the grid via the Point of Interconnection (POI)."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">
            34.5 kV → 115/230 kV · POI
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[16/10] min-h-[420px] max-h-[620px] relative">
        <svg
          viewBox="0 0 1100 640"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id="poi-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#10B981" />
            </marker>
            <linearGradient id="ren-sub-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B1322" />
              <stop offset="100%" stopColor="#060A10" />
            </linearGradient>
          </defs>

          {/* ================================================================ */}
          {/* SECTION 1: RENEWABLE PLANT (COLLECTION SYSTEM) - LEFT */}
          {/* ================================================================ */}
          <g transform="translate(30, 30)">
            <rect x="0" y="0" width="240" height="480" rx="14" fill="#0B1322" stroke="#1E293B" strokeWidth="1.5" />
            <rect x="14" y="14" width="212" height="32" rx="6" fill="#047857" fillOpacity="0.2" stroke="#10B981" strokeWidth="1" />
            <text x="120" y="35" fill="#34D399" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'PARC RENOUVELABLE' : 'RENEWABLE PLANT'}
            </text>

            {/* Solar Array Blocks */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('REN_SOLAR')}
              onMouseEnter={() => setHoveredBlock('REN_SOLAR')}
              onMouseLeave={() => setHoveredBlock(null)}
              transform="translate(20, 65)"
            >
              <rect
                x="0"
                y="0"
                width="200"
                height="150"
                rx="10"
                fill="#070B12"
                stroke={hoveredBlock === 'REN_SOLAR' || selectedHotspotId === 'REN_SOLAR' ? '#EAB308' : '#1E293B'}
                strokeWidth="1.5"
              />
              <text x="100" y="24" fill="#EAB308" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                {locale === 'fr' ? 'Champs Solaires PV' : 'Solar Array Blocks'}
              </text>
              {/* Solar Panels Grid */}
              <g transform="translate(25, 35)">
                {[0, 38, 76, 114].map((x, idx) => (
                  <rect key={idx} x={x} y="0" width="32" height="48" rx="2" fill="#1E293B" stroke="#EAB308" strokeWidth="1" />
                ))}
              </g>
              <text x="100" y="112" fill="#94A3B8" fontSize="10" textAnchor="middle">
                {locale === 'fr' ? 'Onduleurs + Transfos élévateurs' : 'Inverter + Pad Transformer'}
              </text>
              <text x="100" y="132" fill="#34D399" fontSize="11" fontWeight="bold" textAnchor="middle">
                Départ Collecteur 34.5 kV
              </text>
            </g>

            {/* Wind Turbines Block */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('REN_WIND')}
              onMouseEnter={() => setHoveredBlock('REN_WIND')}
              onMouseLeave={() => setHoveredBlock(null)}
              transform="translate(20, 240)"
            >
              <rect
                x="0"
                y="0"
                width="200"
                height="160"
                rx="10"
                fill="#070B12"
                stroke={hoveredBlock === 'REN_WIND' || selectedHotspotId === 'REN_WIND' ? '#06B6D4' : '#1E293B'}
                strokeWidth="1.5"
              />
              <text x="100" y="24" fill="#06B6D4" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                {locale === 'fr' ? 'Turbines Éoliennes' : 'Wind Turbines'}
              </text>

              {/* Wind turbine sketches */}
              <g transform="translate(60, 35)">
                <line x1="0" y1="20" x2="0" y2="70" stroke="#94A3B8" strokeWidth="2.5" />
                <circle cx="0" cy="20" r="3" fill="#FFFFFF" />
                <line x1="0" y1="20" x2="-15" y2="5" stroke="#38BDF8" strokeWidth="2" />
                <line x1="0" y1="20" x2="15" y2="10" stroke="#38BDF8" strokeWidth="2" />
                <line x1="0" y1="20" x2="0" y2="38" stroke="#38BDF8" strokeWidth="2" />
              </g>
              <g transform="translate(140, 35)">
                <line x1="0" y1="20" x2="0" y2="70" stroke="#94A3B8" strokeWidth="2.5" />
                <circle cx="0" cy="20" r="3" fill="#FFFFFF" />
                <line x1="0" y1="20" x2="-15" y2="5" stroke="#38BDF8" strokeWidth="2" />
                <line x1="0" y1="20" x2="15" y2="10" stroke="#38BDF8" strokeWidth="2" />
                <line x1="0" y1="20" x2="0" y2="38" stroke="#38BDF8" strokeWidth="2" />
              </g>

              <text x="100" y="125" fill="#94A3B8" fontSize="10" textAnchor="middle">
                {locale === 'fr' ? 'Génératrices + Transfos de mât' : 'Tower Base Step-Up Transformer'}
              </text>
              <text x="100" y="145" fill="#34D399" fontSize="11" fontWeight="bold" textAnchor="middle">
                Départ Collecteur 34.5 kV
              </text>
            </g>

            {/* Feeder arrows leaving towards substation */}
            <line x1="220" y1="195" x2="250" y2="195" stroke="#10B981" strokeWidth="3" markerEnd="url(#poi-arrow)" />
            <line x1="220" y1="375" x2="250" y2="375" stroke="#10B981" strokeWidth="3" markerEnd="url(#poi-arrow)" />
          </g>

          {/* ================================================================ */}
          {/* SECTION 2: COLLECTOR SUBSTATION (MAIN COMPOUND) */}
          {/* ================================================================ */}
          <g transform="translate(300, 30)">
            <rect
              x="0"
              y="0"
              width="500"
              height="480"
              rx="16"
              fill="url(#ren-sub-bg)"
              stroke="#0284C7"
              strokeWidth="2"
            />
            {/* Title Header */}
            <rect x="20" y="14" width="460" height="34" rx="6" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="1" />
            <text x="250" y="37" fill="#38BDF8" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'POSTE DE COLLECTE (COLLECTOR SUBSTATION)' : 'COLLECTOR SUBSTATION'}
            </text>

            {/* 34.5 kV Collector Busbar */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('COLLECTOR_BUS')}
              onMouseEnter={() => setHoveredBlock('COLLECTOR_BUS')}
              onMouseLeave={() => setHoveredBlock(null)}
              transform="translate(40, 70)"
            >
              <text x="35" y="15" fill="#10B981" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                {locale === 'fr' ? 'Jeu de Barres Collecteur 34.5 kV' : '34.5 kV Collector Bus'}
              </text>
              {/* Bus conductor line */}
              <line x1="15" y1="35" x2="15" y2="290" stroke="#10B981" strokeWidth="6" />

              {/* Feeders connecting into Bus */}
              {/* Feeder 1 from solar */}
              <line x1="-50" y1="95" x2="15" y2="95" stroke="#10B981" strokeWidth="2.5" />
              {/* Disconnect switch & CB */}
              <rect x="-35" y="87" width="16" height="16" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />

              {/* Feeder 2 from wind */}
              <line x1="-50" y1="210" x2="15" y2="210" stroke="#10B981" strokeWidth="2.5" />
              <rect x="-35" y="202" width="16" height="16" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />

              {/* Outfeed to main transformer */}
              <line x1="15" y1="150" x2="110" y2="150" stroke="#10B981" strokeWidth="3" />
              {/* Bus Tie / Main Incomer Breaker */}
              <rect x="50" y="142" width="16" height="16" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
            </g>

            {/* Main Power Transformer (Step-Up to 115/230 kV) */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('MAIN_TRAFO')}
              onMouseEnter={() => setHoveredBlock('MAIN_TRAFO')}
              onMouseLeave={() => setHoveredBlock(null)}
              transform="translate(170, 160)"
            >
              <rect
                x="0"
                y="0"
                width="140"
                height="125"
                rx="10"
                fill="#070B12"
                stroke={hoveredBlock === 'MAIN_TRAFO' || selectedHotspotId === 'MAIN_TRAFO' ? '#F59E0B' : '#334155'}
                strokeWidth="2"
              />
              <text x="70" y="22" fill="#F59E0B" fontSize="12" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
                {locale === 'fr' ? 'Transfo Principal' : 'Power Transformer'}
              </text>
              <text x="70" y="38" fill="#94A3B8" fontSize="10" textAnchor="middle">
                34.5 kV → 115/230 kV
              </text>
              {/* Intersecting Trafo Circles */}
              <circle cx="50" cy="75" r="22" fill="none" stroke="#10B981" strokeWidth="2.5" />
              <circle cx="90" cy="75" r="22" fill="none" stroke="#0284C7" strokeWidth="2.5" />
              <text x="70" y="112" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                100 - 300 MVA
              </text>
            </g>

            {/* High-Side Breaker & Disconnects */}
            <g transform="translate(330, 205)">
              <line x1="-20" y1="18" x2="50" y2="18" stroke="#0284C7" strokeWidth="3" />
              <rect x="10" y="8" width="20" height="20" rx="3" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
              <text x="20" y="42" fill="#94A3B8" fontSize="10" textAnchor="middle">HV Breaker</text>
            </g>

            {/* Revenue Metering (CT / PT) */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('REVENUE_METER')}
              onMouseEnter={() => setHoveredBlock('REVENUE_METER')}
              onMouseLeave={() => setHoveredBlock(null)}
              transform="translate(390, 155)"
            >
              <rect
                x="0"
                y="0"
                width="95"
                height="125"
                rx="8"
                fill="#070B12"
                stroke="#10B981"
                strokeWidth="1.5"
              />
              <text x="47" y="22" fill="#10B981" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                {locale === 'fr' ? 'Comptage POI' : 'Revenue Meter'}
              </text>
              <circle cx="47" cy="55" r="16" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="47" y="59" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">CT / PT</text>
              <text x="47" y="90" fill="#94A3B8" fontSize="9" textAnchor="middle">Classe 0.2S</text>
              <text x="47" y="106" fill="#64748B" fontSize="9" textAnchor="middle">Facturation Réseau</text>
            </g>

            {/* Optional Reactive Support (Bottom of Substation) */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('REACTIVE_SUPPORT')}
              onMouseEnter={() => setHoveredBlock('REACTIVE_SUPPORT')}
              onMouseLeave={() => setHoveredBlock(null)}
              transform="translate(40, 385)"
            >
              <rect
                x="0"
                y="0"
                width="220"
                height="80"
                rx="8"
                fill="#070B12"
                stroke="#06B6D4"
                strokeWidth="1.5"
              />
              <text x="110" y="22" fill="#06B6D4" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                {locale === 'fr' ? 'Support Réactif (STATCOM / BAP)' : 'Reactive Support (Optional)'}
              </text>
              <text x="110" y="42" fill="#94A3B8" fontSize="10" textAnchor="middle">
                Batterie de Condensateurs / Selfs / STATCOM
              </text>
              <text x="110" y="62" fill="#38BDF8" fontSize="9" textAnchor="middle">
                Contrôle tension & facteur de puissance au POI
              </text>
              {/* Tap line connecting to 34.5 kV bus */}
              <line x1="15" y1="0" x2="15" y2="-25" stroke="#10B981" strokeWidth="2" strokeDasharray="3,3" />
            </g>

            {/* SCADA & Plant Controller (Bottom Right) */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('SCADA_PPC')}
              onMouseEnter={() => setHoveredBlock('SCADA_PPC')}
              onMouseLeave={() => setHoveredBlock(null)}
              transform="translate(280, 385)"
            >
              <rect
                x="0"
                y="0"
                width="200"
                height="80"
                rx="8"
                fill="#070B12"
                stroke="#A855F7"
                strokeWidth="1.5"
              />
              <text x="100" y="22" fill="#C084FC" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                SCADA & Plant Controller (PPC)
              </text>
              <text x="100" y="42" fill="#94A3B8" fontSize="10" textAnchor="middle">
                Régulation active/réactive (P-Q), téléconduite
              </text>
              <text x="100" y="62" fill="#E2E8F0" fontSize="9" textAnchor="middle">
                Automates CEI 61850 & télémesures
              </text>
            </g>
          </g>

          {/* ================================================================ */}
          {/* SECTION 3: POINT OF INTERCONNECTION (POI) & UTILITY GRID - RIGHT */}
          {/* ================================================================ */}
          <g transform="translate(825, 30)">
            <rect x="0" y="0" width="245" height="480" rx="14" fill="#0B1322" stroke="#1E293B" strokeWidth="1.5" />
            <rect x="14" y="14" width="217" height="32" rx="6" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="1" />
            <text x="122" y="35" fill="#38BDF8" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'RÉSEAU DE TRANSPORT (POI)' : 'POINT OF INTERCONNECTION (POI)'}
            </text>

            {/* Connecting line from Substation to POI */}
            <line x1="-25" y1="223" x2="30" y2="223" stroke="#0284C7" strokeWidth="4" markerEnd="url(#poi-arrow)" />

            {/* POI Terminal Box */}
            <g
              className="cursor-pointer"
              onClick={() => handleClick('POI_TERMINAL')}
              onMouseEnter={() => setHoveredBlock('POI_TERMINAL')}
              onMouseLeave={() => setHoveredBlock(null)}
              transform="translate(20, 130)"
            >
              <rect
                x="0"
                y="0"
                width="205"
                height="180"
                rx="10"
                fill="#070B12"
                stroke={hoveredBlock === 'POI_TERMINAL' || selectedHotspotId === 'POI_TERMINAL' ? '#38BDF8' : '#1E293B'}
                strokeWidth="2"
              />
              <text x="102" y="26" fill="#38BDF8" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Point d'Interconnexion (POI)
              </text>
              <text x="102" y="44" fill="#94A3B8" fontSize="10" textAnchor="middle">
                Frontière d'exploitation & de propriété
              </text>

              {/* Transmission Line Lattice Tower */}
              <g transform="translate(102, 58)">
                <path d="M 0 5 L -20 90 M 0 5 L 20 90" stroke="#38BDF8" strokeWidth="2" />
                <line x1="-25" y1="25" x2="25" y2="25" stroke="#38BDF8" strokeWidth="2" />
                <line x1="-30" y1="50" x2="30" y2="50" stroke="#38BDF8" strokeWidth="2" />
                <line x1="-15" y1="70" x2="15" y2="70" stroke="#38BDF8" strokeWidth="1.5" />
                <line x1="-20" y1="90" x2="20" y2="90" stroke="#38BDF8" strokeWidth="2" />
              </g>

              <text x="102" y="165" fill="#34D399" fontSize="12" fontWeight="bold" textAnchor="middle">
                Ligne THT 115 kV / 230 kV
              </text>
            </g>

            {/* Grid code compliance note */}
            <rect x="20" y="335" width="205" height="120" rx="8" fill="#070B12" stroke="#1E293B" strokeWidth="1" />
            <text x="102" y="358" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {locale === 'fr' ? 'Exigences Grid Code' : 'Grid Code Requirements'}
            </text>
            <text x="28" y="380" fill="#94A3B8" fontSize="10">• FRT (Fault Ride-Through)</text>
            <text x="28" y="400" fill="#94A3B8" fontSize="10">• Contrôle P(f) et Q(U)</text>
            <text x="28" y="420" fill="#94A3B8" fontSize="10">• Filtrage d'harmoniques</text>
            <text x="28" y="440" fill="#94A3B8" fontSize="10">• Télégestion dispatching</text>
          </g>

          {/* ================================================================ */}
          {/* BOTTOM LEGEND & SYMBOLOGY BAR */}
          {/* ================================================================ */}
          <g transform="translate(30, 530)">
            <rect x="0" y="0" width="1040" height="50" rx="10" fill="#0B1322" stroke="#1E293B" strokeWidth="1" />
            <text x="20" y="30" fill="#94A3B8" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              LÉGENDE / LEGEND :
            </text>

            {/* High Voltage AC */}
            <line x1="160" y1="26" x2="190" y2="26" stroke="#0284C7" strokeWidth="3" />
            <text x="200" y="30" fill="#E2E8F0" fontSize="11">Haute Tension (AC)</text>

            {/* Collector 34.5 kV */}
            <line x1="360" y1="26" x2="390" y2="26" stroke="#10B981" strokeWidth="3" />
            <text x="400" y="30" fill="#E2E8F0" fontSize="11">Collecteur 34.5 kV</text>

            {/* Circuit Breaker symbol */}
            <rect x="540" y="19" width="14" height="14" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="562" y="30" fill="#E2E8F0" fontSize="11">Disjoncteur (CB)</text>

            {/* Transformer */}
            <circle cx="700" cy="26" r="8" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="712" cy="26" r="8" fill="none" stroke="#0284C7" strokeWidth="1.5" />
            <text x="728" y="30" fill="#E2E8F0" fontSize="11">Transformateur</text>

            {/* POI */}
            <circle cx="850" cy="26" r="6" fill="#38BDF8" />
            <text x="865" y="30" fill="#E2E8F0" fontSize="11">Point d'Interconnexion (POI)</text>
          </g>

          {/* Footer note */}
          <text x="550" y="605" fill="#64748B" fontSize="11" textAnchor="middle" fontFamily="sans-serif">
            {locale === 'fr'
              ? 'Conforme IEEE 2800 (Inverter-Based Resources Interconnection) et CEI 61850 pour sous-stations renouvelables.'
              : 'Compliant with IEEE 2800 standard for Inverter-Based Resources and IEC 61850 substation automation.'}
          </text>
        </svg>
      </div>
    </div>
  );
};
