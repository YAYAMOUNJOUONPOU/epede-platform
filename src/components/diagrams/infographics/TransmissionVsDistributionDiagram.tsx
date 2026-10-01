// src/components/diagrams/infographics/TransmissionVsDistributionDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const TransmissionVsDistributionDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [activeSide, setActiveSide] = useState<'TRANSMISSION' | 'DISTRIBUTION' | null>(null);

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl">
      {/* Visual Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-mono">
              {locale === 'fr' 
                ? "Transport vs Distribution" 
                : "Transmission vs Distribution"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {locale === 'fr' 
              ? "Comparaison structurelle, tensions de service et finalités physiques"
              : "Structural comparison, operating voltage hierarchies, and delivery scopes"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
            CEI 60038 · CEI 61936-1
          </span>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="w-full aspect-[16/9] min-h-[360px] max-h-[540px] relative">
        <svg 
          viewBox="0 0 1100 620" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="tvdTransGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B1A30" />
              <stop offset="100%" stopColor="#07101E" />
            </linearGradient>
            <linearGradient id="tvdDistGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B231A" />
              <stop offset="100%" stopColor="#061610" />
            </linearGradient>
            <linearGradient id="tvdFlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* ==================================================================== */}
          {/* LEFT PANEL: TRANSMISSION */}
          {/* ==================================================================== */}
          <g 
            className="cursor-pointer transition-all duration-200"
            onClick={() => {
              setActiveSide('TRANSMISSION');
              onSelectHotspot?.('HV_LEVELS');
            }}
          >
            {/* Background Card */}
            <rect 
              x="30" y="30" width="500" height="490" rx="16"
              fill="url(#tvdTransGrad)"
              stroke={activeSide === 'TRANSMISSION' || selectedHotspotId === 'HV_LEVELS' ? '#38BDF8' : '#1E293B'}
              strokeWidth={activeSide === 'TRANSMISSION' ? 2.5 : 1.5}
            />

            {/* Header Tag */}
            <rect x="50" y="50" width="460" height="42" rx="10" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" strokeWidth="1" />
            <text x="280" y="77" fill="#38BDF8" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? 'RÉSEAU DE TRANSPORT (THT / HT)' : 'TRANSMISSION SYSTEM'}
            </text>

            {/* Visual: Transmission Towers & Bulk Substation */}
            <g transform="translate(60, 110)">
              {/* Sky background behind towers */}
              <rect x="0" y="0" width="440" height="180" rx="10" fill="#0B132B" stroke="#1E293B" strokeWidth="1" />
              
              {/* Ground line */}
              <line x1="10" y1="160" x2="430" y2="160" stroke="#334155" strokeWidth="2" />

              {/* Lattice Pylon 1 (Large Suspension Tower) */}
              <g transform="translate(60, 15)">
                <line x1="40" y1="145" x2="40" y2="15" stroke="#94A3B8" strokeWidth="3" />
                <line x1="15" y1="145" x2="40" y2="15" stroke="#64748B" strokeWidth="2" />
                <line x1="65" y1="145" x2="40" y2="15" stroke="#64748B" strokeWidth="2" />
                {/* Crossarms */}
                <line x1="5" y1="45" x2="75" y2="45" stroke="#CBD5E1" strokeWidth="2.5" />
                <line x1="10" y1="80" x2="70" y2="80" stroke="#CBD5E1" strokeWidth="2.5" />
                <line x1="15" y1="115" x2="65" y2="115" stroke="#CBD5E1" strokeWidth="2.5" />
                {/* Diagonal lacings */}
                <line x1="15" y1="145" x2="65" y2="115" stroke="#475569" strokeWidth="1" />
                <line x1="65" y1="145" x2="15" y2="115" stroke="#475569" strokeWidth="1" />
                <line x1="15" y1="115" x2="65" y2="80" stroke="#475569" strokeWidth="1" />
                <line x1="65" y1="115" x2="15" y2="80" stroke="#475569" strokeWidth="1" />
                {/* Insulators */}
                <line x1="5" y1="45" x2="5" y2="60" stroke="#E2E8F0" strokeWidth="2" />
                <line x1="75" y1="45" x2="75" y2="60" stroke="#E2E8F0" strokeWidth="2" />
              </g>

              {/* Lattice Pylon 2 */}
              <g transform="translate(190, 25)">
                <line x1="30" y1="135" x2="30" y2="15" stroke="#94A3B8" strokeWidth="2.5" />
                <line x1="10" y1="135" x2="30" y2="15" stroke="#64748B" strokeWidth="1.5" />
                <line x1="50" y1="135" x2="30" y2="15" stroke="#64748B" strokeWidth="1.5" />
                <line x1="5" y1="45" x2="55" y2="45" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="8" y1="75" x2="52" y2="75" stroke="#CBD5E1" strokeWidth="2" />
              </g>

              {/* Conductors linking towers */}
              <path d="M 65 60 Q 140 85 195 60" fill="none" stroke="#38BDF8" strokeWidth="2.5" />
              <path d="M 135 60 Q 210 85 245 60" fill="none" stroke="#38BDF8" strokeWidth="2.5" />

              {/* Substation Bay at Right of Scene */}
              <g transform="translate(300, 70)">
                {/* Transformer */}
                <rect x="25" y="45" width="55" height="45" rx="4" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
                <rect x="35" y="25" width="8" height="20" fill="#94A3B8" />
                <rect x="55" y="25" width="8" height="20" fill="#94A3B8" />
                {/* Gantry */}
                <line x1="10" y1="90" x2="10" y2="10" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="100" y1="90" x2="100" y2="10" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="10" y1="15" x2="100" y2="15" stroke="#CBD5E1" strokeWidth="2.5" />
                <text x="55" y="105" fill="#94A3B8" fontSize="10" textAnchor="middle">Poste THT</text>
              </g>
            </g>

            {/* 3 Core Transmission Bullet Points */}
            <g transform="translate(60, 310)">
              {/* Bullet 1: High Voltage */}
              <g transform="translate(0, 0)">
                <rect x="0" y="0" width="440" height="52" rx="10" fill="#141E30" stroke="#1E3A8A" strokeWidth="1" />
                <circle cx="30" cy="26" r="14" fill="#0284C7" fillOpacity="0.2" />
                <text x="30" y="31" fill="#38BDF8" fontSize="16" fontWeight="bold" textAnchor="middle">⚡</text>
                <text x="60" y="24" fill="#F8FAFC" fontSize="13" fontWeight="800">
                  {locale === 'fr' ? 'Haute & Très Haute Tension (THT)' : 'High Voltage Levels'}
                </text>
                <text x="60" y="42" fill="#94A3B8" fontSize="11">
                  {locale === 'fr' ? '60 kV à 765 kV (Cameroun : 225 kV et 90 kV)' : '60 kV to 765 kV (Cameroon grid: 225 kV & 90 kV)'}
                </text>
              </g>

              {/* Bullet 2: Long Distance */}
              <g transform="translate(0, 64)">
                <rect x="0" y="0" width="440" height="52" rx="10" fill="#141E30" stroke="#1E3A8A" strokeWidth="1" />
                <circle cx="30" cy="26" r="14" fill="#0284C7" fillOpacity="0.2" />
                <text x="30" y="31" fill="#38BDF8" fontSize="16" fontWeight="bold" textAnchor="middle">🌐</text>
                <text x="60" y="24" fill="#F8FAFC" fontSize="13" fontWeight="800">
                  {locale === 'fr' ? 'Très Longues Distances Interrégionales' : 'Long-Distance Corridors'}
                </text>
                <text x="60" y="42" fill="#94A3B8" fontSize="11">
                  {locale === 'fr' ? 'Centaines de kilomètres des barrages aux villes' : 'Hundreds of kilometers connecting dams to metropolises'}
                </text>
              </g>

              {/* Bullet 3: Bulk Power */}
              <g transform="translate(0, 128)">
                <rect x="0" y="0" width="440" height="52" rx="10" fill="#141E30" stroke="#1E3A8A" strokeWidth="1" />
                <circle cx="30" cy="26" r="14" fill="#0284C7" fillOpacity="0.2" />
                <text x="30" y="31" fill="#38BDF8" fontSize="16" fontWeight="bold" textAnchor="middle">↔️</text>
                <text x="60" y="24" fill="#F8FAFC" fontSize="13" fontWeight="800">
                  {locale === 'fr' ? 'Transit Massif d\'Énergie (Bulk Power)' : 'Bulk Power Transfer'}
                </text>
                <text x="60" y="42" fill="#94A3B8" fontSize="11">
                  {locale === 'fr' ? 'Centaines de mégawatts véhiculés avec faibles pertes' : 'Hundreds of megawatts transported with minimal Joule loss'}
                </text>
              </g>
            </g>
          </g>

          {/* ==================================================================== */}
          {/* RIGHT PANEL: DISTRIBUTION */}
          {/* ==================================================================== */}
          <g 
            className="cursor-pointer transition-all duration-200"
            onClick={() => {
              setActiveSide('DISTRIBUTION');
              onSelectHotspot?.('LOWER_VOLTAGE');
            }}
          >
            {/* Background Card */}
            <rect 
              x="570" y="30" width="500" height="490" rx="16"
              fill="url(#tvdDistGrad)"
              stroke={activeSide === 'DISTRIBUTION' || selectedHotspotId === 'LOWER_VOLTAGE' ? '#10B981' : '#1E293B'}
              strokeWidth={activeSide === 'DISTRIBUTION' ? 2.5 : 1.5}
            />

            {/* Header Tag */}
            <rect x="590" y="50" width="460" height="42" rx="10" fill="#059669" fillOpacity="0.2" stroke="#059669" strokeWidth="1" />
            <text x="820" y="77" fill="#10B981" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? 'RÉSEAU DE DISTRIBUTION (MT / BT)' : 'DISTRIBUTION SYSTEM'}
            </text>

            {/* Visual: Utility Poles & Customers */}
            <g transform="translate(600, 110)">
              {/* Sky background */}
              <rect x="0" y="0" width="440" height="180" rx="10" fill="#081C15" stroke="#1E293B" strokeWidth="1" />
              
              {/* Ground line */}
              <line x1="10" y1="160" x2="430" y2="160" stroke="#334155" strokeWidth="2" />

              {/* Utility Pole with H61 Transformer */}
              <g transform="translate(70, 20)">
                <line x1="30" y1="140" x2="30" y2="15" stroke="#A8A29E" strokeWidth="6" />
                <rect x="5" y="25" width="50" height="6" rx="2" fill="#78716C" />
                <rect x="8" y="15" width="4" height="10" fill="#D6D3D1" />
                <rect x="28" y="15" width="4" height="10" fill="#D6D3D1" />
                <rect x="48" y="15" width="4" height="10" fill="#D6D3D1" />
                {/* Pole Mounted Transformer (H61) */}
                <rect x="35" y="45" width="30" height="40" rx="4" fill="#334155" stroke="#10B981" strokeWidth="1.5" />
                <circle cx="50" cy="65" r="7" fill="none" stroke="#10B981" strokeWidth="1" />
                <text x="50" y="98" fill="#A7F3D0" fontSize="9" textAnchor="middle">Transfo H61</text>
              </g>

              {/* Second Utility Pole */}
              <g transform="translate(200, 30)">
                <line x1="20" y1="130" x2="20" y2="15" stroke="#A8A29E" strokeWidth="5" />
                <rect x="2" y="25" width="36" height="5" rx="2" fill="#78716C" />
              </g>

              {/* Distribution conductors */}
              <path d="M 75 35 Q 145 50 220 40" fill="none" stroke="#10B981" strokeWidth="2" />
              <path d="M 220 40 Q 280 55 330 85" fill="none" stroke="#10B981" strokeWidth="1.5" />

              {/* Customer House */}
              <g transform="translate(320, 80)">
                <polygon points="45,15 5,45 85,45" fill="#EF4444" />
                <rect x="15" y="45" width="60" height="35" fill="#475569" />
                <rect x="25" y="55" width="15" height="15" fill="#FDE047" />
                <rect x="50" y="55" width="12" height="25" fill="#1E293B" />
                <text x="45" y="95" fill="#E2E8F0" fontSize="10" textAnchor="middle">Usager Résidentiel</text>
              </g>
            </g>

            {/* 3 Core Distribution Bullet Points */}
            <g transform="translate(600, 310)">
              {/* Bullet 1: Lower Voltage */}
              <g transform="translate(0, 0)">
                <rect x="0" y="0" width="440" height="52" rx="10" fill="#0C281E" stroke="#047857" strokeWidth="1" />
                <circle cx="30" cy="26" r="14" fill="#10B981" fillOpacity="0.2" />
                <text x="30" y="31" fill="#10B981" fontSize="16" fontWeight="bold" textAnchor="middle">⚡</text>
                <text x="60" y="24" fill="#F8FAFC" fontSize="13" fontWeight="800">
                  {locale === 'fr' ? 'Moyenne & Basse Tension (MT / BT)' : 'Lower Voltage Range'}
                </text>
                <text x="60" y="42" fill="#A7F3D0" fontSize="11">
                  {locale === 'fr' ? 'MT : 33 kV, 30 kV, 15 kV · BT : 400V triphasé / 230V monophasé' : 'MV: 15-33 kV · LV: 400V 3-phase / 230V 1-phase'}
                </text>
              </g>

              {/* Bullet 2: Local Delivery */}
              <g transform="translate(0, 64)">
                <rect x="0" y="0" width="440" height="52" rx="10" fill="#0C281E" stroke="#047857" strokeWidth="1" />
                <circle cx="30" cy="26" r="14" fill="#10B981" fillOpacity="0.2" />
                <text x="30" y="31" fill="#10B981" fontSize="16" fontWeight="bold" textAnchor="middle">🏠</text>
                <text x="60" y="24" fill="#F8FAFC" fontSize="13" fontWeight="800">
                  {locale === 'fr' ? 'Acheminement Capillaire Local' : 'Local Feeder Delivery'}
                </text>
                <text x="60" y="42" fill="#A7F3D0" fontSize="11">
                  {locale === 'fr' ? 'Maillage fin au cœur des quartiers, rues et zones d\'activités' : 'Capillary routing through streets, towns, and industrial clusters'}
                </text>
              </g>

              {/* Bullet 3: Power to Customers */}
              <g transform="translate(0, 128)">
                <rect x="0" y="0" width="440" height="52" rx="10" fill="#0C281E" stroke="#047857" strokeWidth="1" />
                <circle cx="30" cy="26" r="14" fill="#10B981" fillOpacity="0.2" />
                <text x="30" y="31" fill="#10B981" fontSize="16" fontWeight="bold" textAnchor="middle">👥</text>
                <text x="60" y="24" fill="#F8FAFC" fontSize="13" fontWeight="800">
                  {locale === 'fr' ? 'Alimentation Directe des Usagers' : 'Power Directly to Customers'}
                </text>
                <text x="60" y="42" fill="#A7F3D0" fontSize="11">
                  {locale === 'fr' ? 'Prises domestiques, commerces, ateliers et petites industries' : 'Households, offices, schools, commercial shops, and workshops'}
                </text>
              </g>
            </g>
          </g>

          {/* ==================================================================== */}
          {/* BOTTOM INTERCONNECTION BANNER */}
          {/* ==================================================================== */}
          <g transform="translate(30, 540)">
            <rect x="0" y="0" width="1040" height="55" rx="12" fill="#0F172A" stroke="url(#tvdFlow)" strokeWidth="1.5" />
            
            {/* Pulsing Arrow */}
            <circle cx="520" cy="27" r="18" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
            <path d="M 512 27 L 526 27 M 520 21 L 526 27 L 520 33" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
            
            <text x="260" y="33" fill="#E2E8F0" fontSize="13" fontWeight="800" textAnchor="middle">
              {locale === 'fr' 
                ? "L'électricité circule des réseaux de transport THT..." 
                : "Electricity moves from transmission systems..."}
            </text>
            <text x="780" y="33" fill="#34D399" fontSize="13" fontWeight="800" textAnchor="middle">
              {locale === 'fr' 
                ? "...directement vers les réseaux de distribution pour consommation." 
                : "...into local distribution systems for safe end-use."}
            </text>
          </g>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold font-mono">
            {locale === 'fr' ? 'Frontière Physique' : 'Interface Boundary'}
          </span>
          <span>
            {locale === 'fr'
              ? 'Le poste source assure la frontière réglementaire et physique entre concessionnaire de transport (SONATREL) et distributeur (ENEO).'
              : 'The transmission-distribution substation marks the physical and regulatory interface between grid operator and local utility.'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          EPEDE Specification Reference
        </span>
      </div>
    </div>
  );
};
