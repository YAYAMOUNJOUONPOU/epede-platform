// src/components/diagrams/infographics/SubstationOverviewDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const SubstationOverviewDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const activeId = selectedHotspotId || hoveredStep;

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-mono">
              {locale === 'fr' 
                ? "Vue d'Ensemble du Poste Électrique" 
                : "Substation Overview"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {locale === 'fr' 
              ? "Enchaînement canonique de puissance : Arrivée THT ➔ Disjoncteur ➔ Transformateur ➔ Jeu de Barres ➔ Départs MT"
              : "Power Flow: Incoming Transmission ➔ Circuit Breaker ➔ Power Transformer ➔ Busbar ➔ Outgoing Feeders"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-500/10 text-sky-300 border border-sky-400/30">
            CEI 61936-1 · CEI 62271
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[16/9] min-h-[360px] max-h-[520px] relative">
        <svg 
          viewBox="0 0 1150 560" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="soFlowLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <filter id="soGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Background */}
          <pattern id="soGrid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1E293B" strokeWidth="0.5" opacity="0.5" />
          </pattern>
          <rect width="1150" height="560" fill="url(#soGrid)" />

          {/* GROUND LEVEL PLANE */}
          <rect x="40" y="440" width="1070" height="40" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          <line x1="40" y1="440" x2="1110" y2="440" stroke="#64748B" strokeWidth="2" strokeDasharray="6 4" />
          <text x="60" y="465" fill="#64748B" fontSize="11" fontFamily="monospace">SOL DU POSTE (GRAVIER CONCASSÉ + TERRE)</text>

          {/* MAIN CONNECTING POWER BUS LINE */}
          <path
            d="M 120 250 L 320 250 L 530 250 L 760 250 L 980 250"
            fill="none"
            stroke="url(#soFlowLine)"
            strokeWidth="5"
            strokeDasharray="6 4"
            className="animate-pulse"
          />

          {/* FLOW ARROWS BETWEEN STAGES */}
          <polygon points="230,245 242,250 230,255" fill="#38BDF8" />
          <polygon points="435,245 447,250 435,255" fill="#38BDF8" />
          <polygon points="655,245 667,250 655,255" fill="#F59E0B" />
          <polygon points="885,245 897,250 885,255" fill="#10B981" />

          {/* ==================================================================== */}
          {/* 1. INCOMING TRANSMISSION */}
          {/* ==================================================================== */}
          <g 
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectHotspot?.('INCOMING_LINE')}
            onMouseEnter={() => setHoveredStep('INCOMING_LINE')}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <rect 
              x="30" y="40" width="180" height="380" rx="14"
              fill="#0D1524"
              stroke={activeId === 'INCOMING_LINE' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeId === 'INCOMING_LINE' ? 2.5 : 1}
            />
            {/* Header */}
            <rect x="42" y="55" width="156" height="36" rx="8" fill="#38BDF8" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1" />
            <text x="120" y="77" fill="#38BDF8" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? '1. ARRIVÉE THT' : '1. INCOMING LINE'}
            </text>

            {/* Lattice Tower Silhouette */}
            <g transform="translate(60, 110)">
              <line x1="60" y1="280" x2="60" y2="30" stroke="#94A3B8" strokeWidth="3" />
              <line x1="25" y1="280" x2="60" y2="30" stroke="#64748B" strokeWidth="2" />
              <line x1="95" y1="280" x2="60" y2="30" stroke="#64748B" strokeWidth="2" />
              {/* Crossarms */}
              <line x1="15" y1="70" x2="105" y2="70" stroke="#CBD5E1" strokeWidth="2.5" />
              <line x1="20" y1="115" x2="100" y2="115" stroke="#CBD5E1" strokeWidth="2.5" />
              {/* Diagonals */}
              <line x1="25" y1="280" x2="95" y2="210" stroke="#475569" strokeWidth="1" />
              <line x1="95" y1="280" x2="25" y2="210" stroke="#475569" strokeWidth="1" />
              {/* Conductors */}
              <circle cx="15" cy="70" r="5" fill="#38BDF8" />
              <circle cx="105" cy="70" r="5" fill="#38BDF8" />
            </g>

            <text x="120" y="380" fill="#F8FAFC" fontSize="12" fontWeight="700" textAnchor="middle">
              {locale === 'fr' ? 'Ligne Haute Tension' : 'Transmission Line'}
            </text>
            <text x="120" y="400" fill="#94A3B8" fontSize="11" textAnchor="middle" fontFamily="monospace">
              225 kV / 90 kV
            </text>
          </g>

          {/* ==================================================================== */}
          {/* 2. CIRCUIT BREAKER */}
          {/* ==================================================================== */}
          <g 
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectHotspot?.('CIRCUIT_BREAKER_HV')}
            onMouseEnter={() => setHoveredStep('CIRCUIT_BREAKER_HV')}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <rect 
              x="240" y="40" width="170" height="380" rx="14"
              fill="#0D1524"
              stroke={activeId === 'CIRCUIT_BREAKER_HV' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeId === 'CIRCUIT_BREAKER_HV' ? 2.5 : 1}
            />
            {/* Header */}
            <rect x="252" y="55" width="146" height="36" rx="8" fill="#38BDF8" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1" />
            <text x="325" y="77" fill="#38BDF8" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? '2. DISJONCTEUR' : '2. BREAKER'}
            </text>

            {/* Breaker Apparatus */}
            <g transform="translate(265, 120)">
              {/* Support Column Base */}
              <rect x="40" y="190" width="40" height="80" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
              <rect x="30" y="270" width="60" height="10" rx="2" fill="#475569" />

              {/* Porcelain Insulator Columns (2 poles) */}
              <g transform="translate(30, 60)">
                <rect x="10" y="20" width="16" height="110" rx="2" fill="#7C2D12" stroke="#B45309" strokeWidth="1" />
                <rect x="35" y="20" width="16" height="110" rx="2" fill="#7C2D12" stroke="#B45309" strokeWidth="1" />
                {/* Sheds ribs */}
                {[30, 45, 60, 75, 90, 105].map((y) => (
                  <React.Fragment key={y}>
                    <rect x="7" y={y} width="22" height="4" rx="1" fill="#9A3412" />
                    <rect x="32" y={y} width="22" height="4" rx="1" fill="#9A3412" />
                  </React.Fragment>
                ))}
              </g>

              {/* Interrupter Head */}
              <rect x="35" y="45" width="50" height="35" rx="5" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="60" cy="62" r="9" fill="#38BDF8" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1.5" />
              <path d="M 54 62 L 66 62" stroke="#38BDF8" strokeWidth="2.5" />
            </g>

            <text x="325" y="380" fill="#F8FAFC" fontSize="12" fontWeight="700" textAnchor="middle">
              {locale === 'fr' ? 'Disjoncteur HT (SF6)' : 'Circuit Breaker'}
            </text>
            <text x="325" y="400" fill="#94A3B8" fontSize="11" textAnchor="middle" fontFamily="monospace">
              Coupure 31.5 kA
            </text>
          </g>

          {/* ==================================================================== */}
          {/* 3. POWER TRANSFORMER */}
          {/* ==================================================================== */}
          <g 
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectHotspot?.('POWER_TRANSFORMER')}
            onMouseEnter={() => setHoveredStep('POWER_TRANSFORMER')}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <rect 
              x="440" y="40" width="220" height="380" rx="14"
              fill="#0D1524"
              stroke={activeId === 'POWER_TRANSFORMER' ? '#F59E0B' : '#1E293B'}
              strokeWidth={activeId === 'POWER_TRANSFORMER' ? 2.5 : 1}
            />
            {/* Header */}
            <rect x="452" y="55" width="196" height="36" rx="8" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="1" />
            <text x="550" y="77" fill="#FBBF24" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? '3. TRANSFORMATEUR' : '3. TRANSFORMER'}
            </text>

            {/* Transformer Visual */}
            <g transform="translate(460, 110)">
              {/* Main Tank Body */}
              <rect x="25" y="100" width="130" height="120" rx="8" fill="#1E293B" stroke="#64748B" strokeWidth="2" />

              {/* Radiator Cooling Fins */}
              {[-10, 5, 155, 170].map((rx, idx) => (
                <rect key={idx} x={rx + 25} y="115" width="8" height="90" rx="2" fill="#334155" stroke="#475569" strokeWidth="1" />
              ))}

              {/* Conservator Oil Tank */}
              <rect x="35" y="45" width="110" height="24" rx="12" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
              <rect x="85" y="69" width="10" height="31" fill="#64748B" />

              {/* Bushings (HV & LV) */}
              <g transform="translate(45, 65)">
                <rect x="10" y="5" width="12" height="32" rx="2" fill="#7C2D12" stroke="#F59E0B" strokeWidth="1" />
                <rect x="40" y="5" width="12" height="32" rx="2" fill="#7C2D12" stroke="#F59E0B" strokeWidth="1" />
                <rect x="70" y="5" width="12" height="32" rx="2" fill="#7C2D12" stroke="#F59E0B" strokeWidth="1" />
              </g>

              {/* Callout box under transformer */}
              <rect x="5" y="235" width="170" height="32" rx="6" fill="#F59E0B" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="1" />
              <text x="90" y="255" fill="#FDE68A" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                ⬇️ {locale === 'fr' ? 'Abaissement de Tension MT' : 'Voltage Stepped Down'}
              </text>
            </g>

            <text x="550" y="380" fill="#F8FAFC" fontSize="12" fontWeight="700" textAnchor="middle">
              {locale === 'fr' ? 'Transformateur de Puissance' : 'Power Transformer'}
            </text>
            <text x="550" y="400" fill="#F59E0B" fontSize="11" textAnchor="middle" fontFamily="monospace">
              225 / 90 / 30 kV · ONAN/ONAF
            </text>
          </g>

          {/* ==================================================================== */}
          {/* 4. BUSBAR */}
          {/* ==================================================================== */}
          <g 
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectHotspot?.('BUSBAR_SYSTEM')}
            onMouseEnter={() => setHoveredStep('BUSBAR_SYSTEM')}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <rect 
              x="690" y="40" width="180" height="380" rx="14"
              fill="#0D1524"
              stroke={activeId === 'BUSBAR_SYSTEM' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeId === 'BUSBAR_SYSTEM' ? 2.5 : 1}
            />
            {/* Header */}
            <rect x="702" y="55" width="156" height="36" rx="8" fill="#38BDF8" fillOpacity="0.15" stroke="#38BDF8" strokeWidth="1" />
            <text x="780" y="77" fill="#38BDF8" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? '4. JEU DE BARRES' : '4. BUSBAR'}
            </text>

            {/* Busbar Gantry & Post Insulators */}
            <g transform="translate(710, 120)">
              {/* Structural Steel Gantry */}
              <line x1="20" y1="270" x2="20" y2="40" stroke="#CBD5E1" strokeWidth="3" />
              <line x1="120" y1="270" x2="120" y2="40" stroke="#CBD5E1" strokeWidth="3" />
              <line x1="10" y1="50" x2="130" y2="50" stroke="#CBD5E1" strokeWidth="3.5" />

              {/* 3 Horizontal Busbars */}
              <rect x="0" y="70" width="140" height="8" rx="3" fill="#38BDF8" />
              <rect x="0" y="100" width="140" height="8" rx="3" fill="#38BDF8" />
              <rect x="0" y="130" width="140" height="8" rx="3" fill="#38BDF8" />

              {/* Post Insulators */}
              <rect x="25" y="78" width="8" height="22" fill="#E2E8F0" />
              <rect x="105" y="78" width="8" height="22" fill="#E2E8F0" />
              <rect x="25" y="108" width="8" height="22" fill="#E2E8F0" />
              <rect x="105" y="108" width="8" height="22" fill="#E2E8F0" />
              <rect x="25" y="138" width="8" height="22" fill="#E2E8F0" />
              <rect x="105" y="138" width="8" height="22" fill="#E2E8F0" />
            </g>

            <text x="780" y="380" fill="#F8FAFC" fontSize="12" fontWeight="700" textAnchor="middle">
              {locale === 'fr' ? 'Jeu de Barres Principal' : 'Main Busbar System'}
            </text>
            <text x="780" y="400" fill="#94A3B8" fontSize="11" textAnchor="middle" fontFamily="monospace">
              Aluminium Tubulaire 3150 A
            </text>
          </g>

          {/* ==================================================================== */}
          {/* 5. OUTGOING FEEDERS */}
          {/* ==================================================================== */}
          <g 
            className="cursor-pointer transition-all duration-200"
            onClick={() => onSelectHotspot?.('OUTGOING_FEEDERS')}
            onMouseEnter={() => setHoveredStep('OUTGOING_FEEDERS')}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <rect 
              x="900" y="40" width="220" height="380" rx="14"
              fill="#0D1524"
              stroke={activeId === 'OUTGOING_FEEDERS' ? '#10B981' : '#1E293B'}
              strokeWidth={activeId === 'OUTGOING_FEEDERS' ? 2.5 : 1}
            />
            {/* Header */}
            <rect x="912" y="55" width="196" height="36" rx="8" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="1" />
            <text x="1010" y="77" fill="#10B981" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? '5. DÉPARTS AVAL' : '5. OUTGOING FEEDERS'}
            </text>

            {/* Distribution Gantry & Feeders */}
            <g transform="translate(930, 120)">
              {/* Distribution Pole */}
              <line x1="80" y1="270" x2="80" y2="40" stroke="#78716C" strokeWidth="6" />
              <rect x="30" y="55" width="100" height="8" rx="2" fill="#A8A29E" />
              
              {/* 3 Outgoing Conductors */}
              <circle cx="35" cy="55" r="5" fill="#10B981" />
              <circle cx="80" cy="55" r="5" fill="#10B981" />
              <circle cx="125" cy="55" r="5" fill="#10B981" />

              {/* Conductors going to city */}
              <path d="M 35 55 Q 80 80 140 100" fill="none" stroke="#10B981" strokeWidth="2" />
              <path d="M 80 55 Q 110 80 145 120" fill="none" stroke="#10B981" strokeWidth="2" />
              <path d="M 125 55 Q 135 80 150 140" fill="none" stroke="#10B981" strokeWidth="2" />

              {/* Feeders arrow callout */}
              <g transform="translate(20, 190)">
                <rect x="0" y="0" width="120" height="45" rx="6" fill="#064E3B" stroke="#059669" strokeWidth="1" />
                <text x="60" y="20" fill="#A7F3D0" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  {locale === 'fr' ? 'Départs Radiaux MT' : 'MV Radial Feeders'}
                </text>
                <text x="60" y="36" fill="#6EE7B7" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  30 kV ➔ Villes & Usines
                </text>
              </g>
            </g>

            <text x="1010" y="380" fill="#F8FAFC" fontSize="12" fontWeight="700" textAnchor="middle">
              {locale === 'fr' ? 'Départs de Distribution' : 'Distribution Feeders'}
            </text>
            <text x="1010" y="400" fill="#10B981" fontSize="11" textAnchor="middle" fontFamily="monospace">
              Alimentation Urbaine & Rurale
            </text>
          </g>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold font-mono">
            {locale === 'fr' ? 'Chaîne de Puissance' : 'Power Chain'}
          </span>
          <span>
            {locale === 'fr'
              ? 'Chaque maillon du poste assure une fonction de sécurité et de transport indispensable.'
              : 'Each link in the substation performs critical transformation, switching, and routing functions.'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          EPEDE Substation Design 2026
        </span>
      </div>
    </div>
  );
};
