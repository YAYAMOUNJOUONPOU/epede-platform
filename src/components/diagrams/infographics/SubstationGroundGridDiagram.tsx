// src/components/diagrams/infographics/SubstationGroundGridDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const SubstationGroundGridDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [activeConcept, setActiveConcept] = useState<string>('TOUCH_VOLTAGE');

  const activeId = selectedHotspotId || activeConcept;

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-mono">
              {locale === 'fr' 
                ? "Réseau de Terre & Sécurité des Personnes (Tension de Contact & de Pas)" 
                : "Substation Ground Grid & Safety (Touch & Step Voltage)"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {locale === 'fr' 
              ? "Calculs normatifs IEEE Std 80-2013, rôle du gravier concassé et dissipation du courant de défaut If"
              : "IEEE Std 80-2013 safety limits, surface crushed rock resistivity, and fault current dissipation"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-500/10 text-red-300 border border-red-400/30">
            IEEE Std 80 · CEI 61936-1
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[16/9] min-h-[420px] max-h-[600px] relative">
        <svg 
          viewBox="0 0 1200 680" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="ggGravel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="ggEarth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1C1917" />
              <stop offset="100%" stopColor="#0C0A09" />
            </linearGradient>
            <linearGradient id="ggFaultGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* ==================================================================== */}
          {/* GEOLOGICAL CROSS-SECTION (GRAVEL & SOIL) */}
          {/* ==================================================================== */}

          {/* 1. Crushed Rock Gravel Surface Layer (10 - 15 cm) */}
          <rect x="40" y="360" width="1120" height="45" fill="url(#ggGravel)" stroke="#475569" strokeWidth="1" />
          {/* Gravel texture dots */}
          {[60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080].map((gx) => (
            <React.Fragment key={gx}>
              <circle cx={gx} cy="375" r="2.5" fill="#94A3B8" opacity="0.6" />
              <circle cx={gx + 25} cy="390" r="3" fill="#CBD5E1" opacity="0.7" />
            </React.Fragment>
          ))}
          <text x="1140" y="387" fill="#CBD5E1" fontSize="11" fontWeight="bold" textAnchor="end" fontFamily="monospace">
            {locale === 'fr' ? 'GRAVIER CONCASSÉ (ρs ≥ 3000 Ω·m)' : 'CRUSHED ROCK GRAVEL (ρs ≥ 3000 Ω·m)'}
          </text>

          {/* 2. Deep Native Soil Layer */}
          <rect x="40" y="405" width="1120" height="175" fill="url(#ggEarth)" stroke="#292524" strokeWidth="1" />
          <text x="1140" y="530" fill="#78716C" fontSize="11" fontWeight="bold" textAnchor="end" fontFamily="monospace">
            {locale === 'fr' ? 'SOL NATUREL (ρ ≈ 50 - 200 Ω·m)' : 'NATIVE SOIL (ρ ≈ 50 - 200 Ω·m)'}
          </text>

          {/* 3. BURIED COPPER GROUND GRID MESH (0.5m - 0.8m depth) */}
          <g transform="translate(0, 440)">
            {/* Horizontal copper conductors */}
            <line x1="60" y1="0" x2="1100" y2="0" stroke="#F59E0B" strokeWidth="4" strokeDasharray="10 4" />
            <line x1="60" y1="40" x2="1100" y2="40" stroke="#F59E0B" strokeWidth="4" strokeDasharray="10 4" />
            
            {/* Ground Rods driven deep into earth */}
            {[100, 260, 420, 580, 740, 900, 1060].map((rx) => (
              <g key={rx}>
                <line x1={rx} y1="0" x2={rx} y2="120" stroke="#D97706" strokeWidth="4" />
                <polygon points={`${rx - 5},120 ${rx + 5},120 ${rx},135`} fill="#D97706" />
                {/* Dissipating fault current rays */}
                <path d={`M ${rx} 135 L ${rx - 20} 150 M ${rx} 135 L ${rx} 155 M ${rx} 135 L ${rx + 20} 150`} stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />
              </g>
            ))}
            <text x="580" y="25" fill="#FBBF24" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              GRILLE DE TERRE EN CUIVRE NUE (GROUND GRID MESH) · SECTION 95-120 mm²
            </text>
          </g>

          {/* ==================================================================== */}
          {/* SUBSTATION APPARATUS (TRANSFORMER ON CONCRETE PAD) */}
          {/* ==================================================================== */}
          <g transform="translate(360, 140)">
            {/* Concrete Pad Foundation */}
            <rect x="0" y="190" width="220" height="30" rx="3" fill="#475569" stroke="#64748B" strokeWidth="1.5" />
            <text x="110" y="210" fill="#E2E8F0" fontSize="10.5" fontWeight="bold" textAnchor="middle">
              MASSIF BÉTON ARMÉ
            </text>

            {/* Transformer Steel Enclosure */}
            <rect x="25" y="40" width="170" height="150" rx="8" fill="#1E293B" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Conservator tank */}
            <rect x="45" y="15" width="130" height="25" rx="12" fill="#334155" stroke="#94A3B8" strokeWidth="1.5" />
            {/* Bushing with incoming fault */}
            <rect x="65" y="-15" width="14" height="30" rx="2" fill="#7C2D12" stroke="#F59E0B" strokeWidth="1" />
            <rect x="140" y="-15" width="14" height="30" rx="2" fill="#7C2D12" stroke="#F59E0B" strokeWidth="1" />

            {/* Lightning bolt / Fault Current (If) */}
            <path d="M 72 -35 L 72 -15 L 85 -5 L 72 25 L 80 25 L 60 70" fill="none" stroke="#EF4444" strokeWidth="3.5" />
            <text x="100" y="-30" fill="#EF4444" fontSize="13" fontWeight="900" fontFamily="monospace">
              DÉFAUT À LA TERRE (If = 25 kA)
            </text>

            {/* Equipment Grounding Conductor to Grid (Green bonding wire) */}
            <path d="M 195 160 L 230 160 L 230 300" fill="none" stroke="#10B981" strokeWidth="4" />
            <text x="240" y="230" fill="#34D399" fontSize="11" fontWeight="bold">
              {locale === 'fr' ? 'Liaison équipotentielle' : 'Equipment Grounding'}
            </text>
            <text x="110" y="120" fill="#F8FAFC" fontSize="14" fontWeight="bold" textAnchor="middle">
              CUVE DU TRANSFORMATEUR
            </text>
            <text x="110" y="140" fill="#F87171" fontSize="12" fontWeight="bold" textAnchor="middle">
              PORTÉE AU POTENTIEL GPR (Up)
            </text>
          </g>

          {/* ==================================================================== */}
          {/* HUMAN 1: TOUCH VOLTAGE SCENARIO (Left) */}
          {/* ==================================================================== */}
          <g 
            transform="translate(180, 180)" 
            className="cursor-pointer"
            onClick={() => {
              setActiveConcept('TOUCH_VOLTAGE');
              onSelectHotspot?.('TOUCH_VOLTAGE');
            }}
          >
            {/* Touch Voltage Highlight Halo */}
            <ellipse cx="60" cy="120" rx="100" ry="110" fill="#EF4444" fillOpacity={activeId === 'TOUCH_VOLTAGE' ? 0.15 : 0.05} />

            {/* Person Figure touching the metal chassis */}
            {/* Head */}
            <circle cx="60" cy="50" r="16" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            {/* Hard hat safety helmet */}
            <path d="M 40 45 Q 60 25 80 45 Z" fill="#FFF" stroke="#E2E8F0" strokeWidth="1" />
            {/* Body */}
            <line x1="60" y1="66" x2="60" y2="130" stroke="#38BDF8" strokeWidth="5" />
            {/* Extended right hand touching transformer chassis */}
            <line x1="60" y1="80" x2="190" y2="80" stroke="#FDE047" strokeWidth="4" />
            {/* Left arm hanging */}
            <line x1="60" y1="80" x2="35" y2="115" stroke="#FDE047" strokeWidth="3" />
            {/* Legs standing on gravel */}
            <line x1="60" y1="130" x2="45" y2="180" stroke="#1E3A8A" strokeWidth="4.5" />
            <line x1="60" y1="130" x2="75" y2="180" stroke="#1E3A8A" strokeWidth="4.5" />
            {/* Safety boots */}
            <rect x="35" y="178" width="18" height="6" rx="2" fill="#78716C" />
            <rect x="68" y="178" width="18" height="6" rx="2" fill="#78716C" />

            {/* Hand-to-feet red electric discharge path */}
            <path d="M 190 80 Q 60 100 60 180" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="5 3" />

            {/* Touch Voltage Callout Box */}
            <rect x="-80" y="-30" width="220" height="65" rx="8" fill="#1C1115" stroke="#EF4444" strokeWidth={activeId === 'TOUCH_VOLTAGE' ? 2.5 : 1.5} />
            <text x="30" y="-10" fill="#EF4444" fontSize="13" fontWeight="900" textAnchor="middle">
              {locale === 'fr' ? '⚡ TENSION DE CONTACT (Vt)' : '⚡ TOUCH VOLTAGE (Vt)'}
            </text>
            <text x="30" y="10" fill="#FCA5A5" fontSize="10.5" textAnchor="middle">
              {locale === 'fr' 
                ? "Entre la main sur la cuve et les pieds au sol" 
                : "Between hand on chassis & feet on ground"}
            </text>
            <text x="30" y="26" fill="#F87171" fontSize="10" fontFamily="monospace" textAnchor="middle">
              IEEE 80 : Vt_admissible ≤ 850 V
            </text>
          </g>

          {/* ==================================================================== */}
          {/* HUMAN 2: STEP VOLTAGE SCENARIO (Right) */}
          {/* ==================================================================== */}
          <g 
            transform="translate(850, 190)" 
            className="cursor-pointer"
            onClick={() => {
              setActiveConcept('STEP_VOLTAGE');
              onSelectHotspot?.('STEP_VOLTAGE');
            }}
          >
            {/* Step Voltage Highlight Halo */}
            <ellipse cx="60" cy="110" rx="90" ry="100" fill="#F59E0B" fillOpacity={activeId === 'STEP_VOLTAGE' ? 0.15 : 0.05} />

            {/* Walking Person (1 meter stride) */}
            <circle cx="60" cy="40" r="16" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            <path d="M 40 35 Q 60 15 80 35 Z" fill="#FFF" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="60" y1="56" x2="60" y2="120" stroke="#38BDF8" strokeWidth="5" />
            {/* Walking arms */}
            <line x1="60" y1="70" x2="35" y2="105" stroke="#FDE047" strokeWidth="3" />
            <line x1="60" y1="70" x2="85" y2="105" stroke="#FDE047" strokeWidth="3" />
            {/* Wide stride legs (1 pace = 1 meter) */}
            <line x1="60" y1="120" x2="20" y2="170" stroke="#1E3A8A" strokeWidth="4.5" />
            <line x1="60" y1="120" x2="100" y2="170" stroke="#1E3A8A" strokeWidth="4.5" />
            <rect x="10" y="168" width="18" height="6" rx="2" fill="#78716C" />
            <rect x="92" y="168" width="18" height="6" rx="2" fill="#78716C" />

            {/* 1 Meter step voltage indicator */}
            <line x1="20" y1="185" x2="100" y2="185" stroke="#F59E0B" strokeWidth="2" />
            <line x1="20" y1="180" x2="20" y2="190" stroke="#F59E0B" strokeWidth="2" />
            <line x1="100" y1="180" x2="100" y2="190" stroke="#F59E0B" strokeWidth="2" />
            <text x="60" y="200" fill="#FBBF24" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              PAS DE 1 MÈTRE (1 PACE)
            </text>

            {/* Step Voltage Callout Box */}
            <rect x="-40" y="-35" width="200" height="65" rx="8" fill="#1C180E" stroke="#F59E0B" strokeWidth={activeId === 'STEP_VOLTAGE' ? 2.5 : 1.5} />
            <text x="60" y="-15" fill="#F59E0B" fontSize="13" fontWeight="900" textAnchor="middle">
              {locale === 'fr' ? '👣 TENSION DE PAS (Vs)' : '👣 STEP VOLTAGE (Vs)'}
            </text>
            <text x="60" y="5" fill="#FDE68A" fontSize="10.5" textAnchor="middle">
              {locale === 'fr' 
                ? "Entre les deux pieds séparés d'1 mètre" 
                : "Between two feet spaced 1 meter apart"}
            </text>
            <text x="60" y="22" fill="#F59E0B" fontSize="10" fontFamily="monospace" textAnchor="middle">
              IEEE 80 : Vs_admissible ≤ 2800 V
            </text>
          </g>

          {/* ==================================================================== */}
          {/* BOTTOM FORMULAS BANNER (IEEE 80-2013) */}
          {/* ==================================================================== */}
          <g transform="translate(40, 595)">
            <rect x="0" y="0" width="1120" height="70" rx="12" fill="#0C1322" stroke="#334155" strokeWidth="1.5" />
            
            <g transform="translate(30, 20)">
              <text x="0" y="15" fill="#38BDF8" fontSize="12" fontWeight="bold" fontFamily="monospace">
                NORMES IEEE STD 80-2013 (CORPS 50 kg) :
              </text>
              <text x="0" y="36" fill="#94A3B8" fontSize="11">
                Le gravier concassé (Cs·ρs) majore la résistance de contact des pieds, autorisant des seuils de sécurité considérablement plus élevés.
              </text>
            </g>

            <g transform="translate(620, 16)">
              <rect x="0" y="0" width="220" height="38" rx="6" fill="#1E293B" stroke="#EF4444" strokeWidth="1" />
              <text x="110" y="16" fill="#FCA5A5" fontSize="10" fontWeight="bold" textAnchor="middle">
                LIMITES TENSION DE CONTACT (TOUCH)
              </text>
              <text x="110" y="30" fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                Vt ≤ (1000 + 1.5·Cs·ρs) · 0.116 / √ts
              </text>
            </g>

            <g transform="translate(860, 16)">
              <rect x="0" y="0" width="230" height="38" rx="6" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
              <text x="115" y="16" fill="#FDE68A" fontSize="10" fontWeight="bold" textAnchor="middle">
                LIMITES TENSION DE PAS (STEP)
              </text>
              <text x="115" y="30" fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                Vs ≤ (1000 + 6.0·Cs·ρs) · 0.116 / √ts
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold font-mono">
            {locale === 'fr' ? 'Sécurité Galvanique' : 'Galvanic Safety'}
          </span>
          <span>
            {locale === 'fr'
              ? 'Cliquez sur la Tension de Contact ou de Pas ci-dessus pour inspecter les équations dimensionnantes.'
              : 'Click Touch Voltage or Step Voltage above to inspect calculation parameters and protective grounding rules.'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          EPEDE Earthing Standards 2026
        </span>
      </div>
    </div>
  );
};
