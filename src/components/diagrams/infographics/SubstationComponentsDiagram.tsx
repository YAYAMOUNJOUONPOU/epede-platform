// src/components/diagrams/infographics/SubstationComponentsDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const SubstationComponentsDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const activeId = selectedHotspotId || activeComponent;

  // 13 Substation Components
  const componentsList = [
    { id: 'SURGE_ARRESTER', num: '1', name_fr: 'Parafoudre (Surge Arrester)', name_en: 'Surge Arrester', x: 100, y: 190 },
    { id: 'DISCONNECTOR', num: '2', name_fr: 'Sectionneur (Disconnector)', name_en: 'Disconnector', x: 210, y: 170 },
    { id: 'CT_TT', num: '3', name_fr: 'Transformateurs de Mesure (CT / VT)', name_en: 'Current & Voltage Transformers (CT/VT)', x: 320, y: 210 },
    { id: 'BREAKER', num: '4', name_fr: 'Disjoncteur HT (Circuit Breaker)', name_en: 'Circuit Breaker', x: 440, y: 210 },
    { id: 'BUSBAR', num: '5', name_fr: 'Jeu de Barres (Busbar)', name_en: 'Busbar System', x: 570, y: 150 },
    { id: 'POWER_TRANSFORMER', num: '6', name_fr: 'Transformateur de Puissance', name_en: 'Power Transformer', x: 720, y: 210 },
    { id: 'CAPACITOR_BANK', num: '7', name_fr: 'Banc de Condensateurs (Capacitor Bank)', name_en: 'Capacitor Bank / Reactor', x: 890, y: 210 },
    { id: 'CONTROL_BUILDING', num: '8', name_fr: 'Bâtiment Contrôle & Relais', name_en: 'Control & Relay Building', x: 920, y: 380 },
    { id: 'BATTERY_DC', num: '9', name_fr: 'Batterie Stationnaire DC', name_en: 'Station Battery DC', x: 740, y: 390 },
    { id: 'GROUND_GRID', num: '10', name_fr: 'Réseau de Terre Enterré (Ground Grid)', name_en: 'Buried Ground Grid Mesh', x: 450, y: 470 }
  ];

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-mono">
              {locale === 'fr' 
                ? "Appareillages d'un Poste Haute Tension" 
                : "Substation Components & Apparatus"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {locale === 'fr' 
              ? "Vue architecturale d'une travée extérieure (AIS) avec les 13 équipements normalisés"
              : "Detailed physical cutaway of an outdoor AIS substation bay with 13 standard apparatus"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-400/30">
            CEI 62271 · CEI 61869 · IEEE 80
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full aspect-[16/9] min-h-[400px] max-h-[580px] relative">
        <svg 
          viewBox="0 0 1200 640" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Ground surface and crushed rock gravel */}
          <rect x="20" y="440" width="1160" height="180" fill="#0B1320" />
          <line x1="20" y1="440" x2="1180" y2="440" stroke="#334155" strokeWidth="2" />
          
          {/* Ground Grid Mesh Copper Conductors buried under soil */}
          <g transform="translate(0, 480)">
            {/* Horizontal copper lines */}
            <line x1="40" y1="20" x2="1140" y2="20" stroke="#D97706" strokeWidth="3" strokeDasharray="8 4" />
            <line x1="40" y1="60" x2="1140" y2="60" stroke="#D97706" strokeWidth="3" strokeDasharray="8 4" />
            <line x1="40" y1="100" x2="1140" y2="100" stroke="#D97706" strokeWidth="3" strokeDasharray="8 4" />
            {/* Vertical grid lines & ground rods */}
            {[100, 220, 340, 460, 580, 700, 820, 940, 1060].map((gx) => (
              <React.Fragment key={gx}>
                <line x1={gx} y1="0" x2={gx} y2="130" stroke="#D97706" strokeWidth="2.5" />
                <polygon points={`${gx - 4},130 ${gx + 4},130 ${gx},145`} fill="#D97706" />
              </React.Fragment>
            ))}
            <text x="600" y="70" fill="#F59E0B" fontSize="13" fontWeight="bold" textAnchor="middle" opacity="0.8">
              {locale === 'fr' 
                ? "GRILLE DE TERRE EN CUIVRE ENTERRÉE (IEEE 80) + PIQUETS VERTICAUX" 
                : "BURIED COPPER GROUND GRID (IEEE 80) + VERTICAL ELECTRODES"}
            </text>
          </g>

          {/* MAIN BUSBAR GANTRY OVERHEAD */}
          <g transform="translate(520, 60)">
            {/* Steel lattice structure */}
            <line x1="20" y1="380" x2="20" y2="20" stroke="#94A3B8" strokeWidth="4" />
            <line x1="120" y1="380" x2="120" y2="20" stroke="#94A3B8" strokeWidth="4" />
            <line x1="10" y1="30" x2="130" y2="30" stroke="#CBD5E1" strokeWidth="5" />
            {/* Busbar tubes */}
            <rect x="-80" y="50" width="300" height="12" rx="4" fill="#38BDF8" />
            <rect x="-80" y="90" width="300" height="12" rx="4" fill="#38BDF8" />
            <rect x="-80" y="130" width="300" height="12" rx="4" fill="#38BDF8" />
            {/* Post insulators */}
            <rect x="25" y="62" width="10" height="28" fill="#E2E8F0" />
            <rect x="105" y="62" width="10" height="28" fill="#E2E8F0" />
            <rect x="25" y="102" width="10" height="28" fill="#E2E8F0" />
            <rect x="105" y="102" width="10" height="28" fill="#E2E8F0" />
            <text x="70" y="20" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">
              JEU DE BARRES (BUSBAR)
            </text>
          </g>

          {/* 1. SURGE ARRESTER */}
          <g 
            transform="translate(80, 200)"
            className="cursor-pointer"
            onClick={() => onSelectHotspot?.('SURGE_ARRESTER')}
            onMouseEnter={() => setActiveComponent('SURGE_ARRESTER')}
            onMouseLeave={() => setActiveComponent(null)}
          >
            {/* Concrete Pedestal */}
            <rect x="20" y="170" width="30" height="70" fill="#334155" stroke="#64748B" strokeWidth="1" />
            {/* Tall Arrester Porcelain Column */}
            <rect x="26" y="20" width="18" height="150" rx="3" fill="#9A3412" stroke="#EA580C" strokeWidth="1" />
            {[40, 60, 80, 100, 120, 140].map((sy) => (
              <rect key={sy} x="20" y={sy} width="30" height="5" rx="1.5" fill="#C2410C" />
            ))}
            {/* Top corona ring */}
            <ellipse cx="35" cy="18" rx="16" ry="6" fill="none" stroke="#CBD5E1" strokeWidth="2.5" />
            {/* Earth wire to ground grid */}
            <line x1="35" y1="240" x2="35" y2="300" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />

            {/* Badge */}
            <circle cx="35" cy="0" r="14" fill="#EA580C" stroke="#FFF" strokeWidth="1.5" />
            <text x="35" y="5" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>
            <text x="35" y="260" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">Parafoudre</text>
            <text x="35" y="275" fill="#94A3B8" fontSize="10" textAnchor="middle">Surge Arrester</text>
          </g>

          {/* 2. DISCONNECTOR */}
          <g 
            transform="translate(180, 160)"
            className="cursor-pointer"
            onClick={() => onSelectHotspot?.('DISCONNECTOR')}
            onMouseEnter={() => setActiveComponent('DISCONNECTOR')}
            onMouseLeave={() => setActiveComponent(null)}
          >
            {/* Support structure */}
            <line x1="20" y1="280" x2="20" y2="120" stroke="#64748B" strokeWidth="3" />
            <line x1="90" y1="280" x2="90" y2="120" stroke="#64748B" strokeWidth="3" />
            {/* Rotating post insulators */}
            <rect x="12" y="50" width="16" height="70" rx="2" fill="#7C2D12" stroke="#B45309" strokeWidth="1" />
            <rect x="82" y="50" width="16" height="70" rx="2" fill="#7C2D12" stroke="#B45309" strokeWidth="1" />
            {/* Horizontal blade contact */}
            <line x1="20" y1="45" x2="80" y2="25" stroke="#F59E0B" strokeWidth="3.5" />
            
            {/* Badge */}
            <circle cx="55" cy="0" r="14" fill="#D97706" stroke="#FFF" strokeWidth="1.5" />
            <text x="55" y="5" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle">2</text>
            <text x="55" y="300" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">Sectionneur</text>
            <text x="55" y="315" fill="#94A3B8" fontSize="10" textAnchor="middle">Disconnector</text>
          </g>

          {/* 3. CT & VT */}
          <g 
            transform="translate(310, 180)"
            className="cursor-pointer"
            onClick={() => onSelectHotspot?.('CT_TT')}
            onMouseEnter={() => setActiveComponent('CT_TT')}
            onMouseLeave={() => setActiveComponent(null)}
          >
            {/* CT Column */}
            <rect x="15" y="190" width="30" height="70" fill="#334155" stroke="#64748B" strokeWidth="1" />
            <rect x="22" y="70" width="16" height="120" rx="2" fill="#7C2D12" />
            {/* Top head bulb (wound core) */}
            <ellipse cx="30" cy="55" rx="22" ry="18" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
            <text x="30" y="60" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">TC</text>

            {/* VT Column beside */}
            <rect x="65" y="190" width="30" height="70" fill="#334155" stroke="#64748B" strokeWidth="1" />
            <rect x="72" y="90" width="16" height="100" rx="2" fill="#7C2D12" />
            <ellipse cx="80" cy="75" rx="18" ry="16" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
            <text x="80" y="80" fill="#10B981" fontSize="11" fontWeight="bold" textAnchor="middle">TT</text>

            {/* Badge */}
            <circle cx="55" cy="15" r="14" fill="#0284C7" stroke="#FFF" strokeWidth="1.5" />
            <text x="55" y="20" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle">3</text>
            <text x="55" y="280" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">TC / TT (CT/VT)</text>
          </g>

          {/* 4. CIRCUIT BREAKER */}
          <g 
            transform="translate(430, 170)"
            className="cursor-pointer"
            onClick={() => onSelectHotspot?.('BREAKER')}
            onMouseEnter={() => setActiveComponent('BREAKER')}
            onMouseLeave={() => setActiveComponent(null)}
          >
            {/* Operating mechanism cabinet */}
            <rect x="25" y="200" width="60" height="70" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
            {/* SF6 Interrupter Columns (T-shaped or vertical) */}
            <rect x="35" y="80" width="16" height="120" rx="2" fill="#7C2D12" />
            <rect x="60" y="80" width="16" height="120" rx="2" fill="#7C2D12" />
            {/* Arc-quenching chamber on top */}
            <rect x="20" y="45" width="70" height="35" rx="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="55" cy="62" r="10" fill="#38BDF8" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="2" />
            <path d="M 49 62 L 61 62" stroke="#38BDF8" strokeWidth="3" />

            {/* Badge */}
            <circle cx="55" cy="15" r="14" fill="#0284C7" stroke="#FFF" strokeWidth="1.5" />
            <text x="55" y="20" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle">4</text>
            <text x="55" y="290" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">Disjoncteur</text>
            <text x="55" y="305" fill="#38BDF8" fontSize="10" textAnchor="middle">Circuit Breaker</text>
          </g>

          {/* 5. POWER TRANSFORMER */}
          <g 
            transform="translate(680, 130)"
            className="cursor-pointer"
            onClick={() => onSelectHotspot?.('POWER_TRANSFORMER')}
            onMouseEnter={() => setActiveComponent('POWER_TRANSFORMER')}
            onMouseLeave={() => setActiveComponent(null)}
          >
            {/* Oil Retention Pit under Transformer */}
            <rect x="5" y="300" width="180" height="20" rx="2" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
            {/* Main Tank */}
            <rect x="25" y="140" width="140" height="160" rx="6" fill="#1E293B" stroke="#CBD5E1" strokeWidth="2" />
            {/* Cooling Radiator Banks */}
            {[-12, 168].map((fx, idx) => (
              <rect key={idx} x={fx} y="160" width="12" height="120" rx="2" fill="#334155" stroke="#475569" strokeWidth="1" />
            ))}
            {/* Conservator tank */}
            <rect x="35" y="80" width="120" height="30" rx="15" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
            <rect x="90" y="110" width="10" height="30" fill="#64748B" />
            {/* Buchholz relay on pipe */}
            <rect x="85" y="120" width="20" height="12" rx="2" fill="#F59E0B" />
            {/* HV Bushings */}
            <rect x="45" y="105" width="14" height="35" rx="2" fill="#7C2D12" stroke="#F59E0B" strokeWidth="1" />
            <rect x="85" y="105" width="14" height="35" rx="2" fill="#7C2D12" stroke="#F59E0B" strokeWidth="1" />
            <rect x="125" y="105" width="14" height="35" rx="2" fill="#7C2D12" stroke="#F59E0B" strokeWidth="1" />

            {/* Badge */}
            <circle cx="95" cy="45" r="14" fill="#F59E0B" stroke="#FFF" strokeWidth="1.5" />
            <text x="95" y="50" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle">5</text>
            <text x="95" y="335" fill="#F8FAFC" fontSize="12" fontWeight="bold" textAnchor="middle">Transformateur</text>
            <text x="95" y="350" fill="#F59E0B" fontSize="10.5" textAnchor="middle">Power Transformer</text>
          </g>

          {/* 6. CAPACITOR BANK */}
          <g 
            transform="translate(890, 180)"
            className="cursor-pointer"
            onClick={() => onSelectHotspot?.('CAPACITOR_BANK')}
            onMouseEnter={() => setActiveComponent('CAPACITOR_BANK')}
            onMouseLeave={() => setActiveComponent(null)}
          >
            {/* Steel rack frame */}
            <rect x="10" y="60" width="90" height="180" fill="none" stroke="#64748B" strokeWidth="2" />
            {/* Capacitor cans stacked in matrix */}
            {[80, 120, 160].map((cy) => (
              <React.Fragment key={cy}>
                <rect x="20" y={cy} width="20" height="30" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                <rect x="45" y={cy} width="20" height="30" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                <rect x="70" y={cy} width="20" height="30" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
              </React.Fragment>
            ))}

            {/* Badge */}
            <circle cx="55" cy="25" r="14" fill="#10B981" stroke="#FFF" strokeWidth="1.5" />
            <text x="55" y="30" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle">6</text>
            <text x="55" y="260" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">Condensateurs</text>
            <text x="55" y="275" fill="#10B981" fontSize="10" textAnchor="middle">Capacitor Bank</text>
          </g>

          {/* 7. CONTROL BUILDING & SCADA RELAYS */}
          <g 
            transform="translate(1010, 160)"
            className="cursor-pointer"
            onClick={() => onSelectHotspot?.('CONTROL_BUILDING')}
            onMouseEnter={() => setActiveComponent('CONTROL_BUILDING')}
            onMouseLeave={() => setActiveComponent(null)}
          >
            {/* Concrete building shelter */}
            <rect x="10" y="80" width="140" height="200" rx="6" fill="#1E293B" stroke="#6366F1" strokeWidth="2" />
            {/* Roof overhang */}
            <polygon points="5,80 155,80 145,65 15,65" fill="#334155" />
            {/* Relay Racks inside visible through window */}
            <rect x="25" y="100" width="30" height="80" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
            <rect x="65" y="100" width="30" height="80" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
            <rect x="105" y="100" width="30" height="80" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
            {/* Door */}
            <rect x="45" y="200" width="70" height="80" fill="#0D1524" stroke="#475569" strokeWidth="1" />

            {/* Badge */}
            <circle cx="80" cy="35" r="14" fill="#6366F1" stroke="#FFF" strokeWidth="1.5" />
            <text x="80" y="40" fill="#FFF" fontSize="12" fontWeight="bold" textAnchor="middle">7</text>
            <text x="80" y="300" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">Bâtiment Relais</text>
            <text x="80" y="315" fill="#818CF8" fontSize="10" textAnchor="middle">SCADA & DC Battery</text>
          </g>
        </svg>
      </div>

      {/* Footer Info & Hotspots List */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">
            {locale === 'fr' ? '13 Équipements Clés' : '13 Core Apparatus'}
          </span>
          <span>
            {locale === 'fr'
              ? 'Cliquez sur chaque repère pour inspecter sa fonction, sa technologie d\'extinction d\'arc et sa conformité normative.'
              : 'Click any apparatus badge above to view ratings, arc-quenching technology, and IEEE/IEC standards.'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          EPEDE Substation Cutaway 2026
        </span>
      </div>
    </div>
  );
};
