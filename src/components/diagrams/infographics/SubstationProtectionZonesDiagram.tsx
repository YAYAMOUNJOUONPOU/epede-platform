// src/components/diagrams/infographics/SubstationProtectionZonesDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const SubstationProtectionZonesDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('ZONE_TRAFO');

  const activeZone = selectedHotspotId || selectedZone;

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-mono">
              {locale === 'fr' 
                ? "Zones de Protection du Poste Haute Tension" 
                : "Substation Protection Zones"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {locale === 'fr' 
              ? "Le principe de recouvrement aux disjoncteurs garantit l'absence totale de zone morte aveugle"
              : "Protection zones overlap at breakers and CTs to ensure there is no unprotected blind gap in the system"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">
            IEEE C37.90 · ANSI 87L / 87B / 87T
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
          {/* ==================================================================== */}
          {/* LEFT PANEL: 4 PROTECTION ZONES CARDS */}
          {/* ==================================================================== */}
          <g transform="translate(30, 40)">
            <rect x="0" y="0" width="310" height="520" rx="14" fill="#0D1524" stroke="#1E293B" strokeWidth="1.5" />
            
            {/* Header */}
            <rect x="15" y="15" width="280" height="34" rx="8" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="1" />
            <text x="155" y="37" fill="#34D399" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? '4 ZONES DE PROTECTION' : '4 PROTECTION ZONES'}
            </text>

            {/* Zone 1: Line (Green) */}
            <g 
              transform="translate(15, 60)" 
              className="cursor-pointer"
              onClick={() => {
                setSelectedZone('ZONE_LINE');
                onSelectHotspot?.('ZONE_LINE');
              }}
            >
              <rect 
                x="0" y="0" width="280" height="95" rx="10" 
                fill={activeZone === 'ZONE_LINE' ? '#064E3B' : '#0B1F17'} 
                stroke="#10B981" 
                strokeWidth={activeZone === 'ZONE_LINE' ? 2.5 : 1} 
              />
              <rect x="10" y="10" width="260" height="22" rx="4" fill="#059669" />
              <text x="20" y="25" fill="#FFF" fontSize="11" fontWeight="bold">
                1. {locale === 'fr' ? 'ZONE PROTECTION LIGNE' : 'LINE PROTECTION ZONE'}
              </text>
              <text x="15" y="52" fill="#E2E8F0" fontSize="11.5" fontWeight="600">
                {locale === 'fr' ? 'Protège la ligne de transport THT.' : 'Protects the incoming transmission line.'}
              </text>
              <text x="15" y="72" fill="#6EE7B7" fontSize="10.5" fontFamily="monospace">
                ANSI 21 (Distance) / ANSI 87L (Diff. Ligne)
              </text>
            </g>

            {/* Zone 2: Bus (Blue) */}
            <g 
              transform="translate(15, 170)" 
              className="cursor-pointer"
              onClick={() => {
                setSelectedZone('ZONE_BUS');
                onSelectHotspot?.('ZONE_BUS');
              }}
            >
              <rect 
                x="0" y="0" width="280" height="95" rx="10" 
                fill={activeZone === 'ZONE_BUS' ? '#0C3247' : '#091C28'} 
                stroke="#38BDF8" 
                strokeWidth={activeZone === 'ZONE_BUS' ? 2.5 : 1} 
              />
              <rect x="10" y="10" width="260" height="22" rx="4" fill="#0284C7" />
              <text x="20" y="25" fill="#FFF" fontSize="11" fontWeight="bold">
                2. {locale === 'fr' ? 'ZONE DIFFÉRENTIELLE BARRES' : 'BUS DIFFERENTIAL ZONE'}
              </text>
              <text x="15" y="52" fill="#E2E8F0" fontSize="11.5" fontWeight="600">
                {locale === 'fr' ? 'Protège le jeu de barres et départs.' : 'Protects the busbar and all connections.'}
              </text>
              <text x="15" y="72" fill="#7DD3FC" fontSize="10.5" fontFamily="monospace">
                ANSI 87B (Diff. Barres) &lt; 15 ms
              </text>
            </g>

            {/* Zone 3: Transformer (Purple) */}
            <g 
              transform="translate(15, 280)" 
              className="cursor-pointer"
              onClick={() => {
                setSelectedZone('ZONE_TRAFO');
                onSelectHotspot?.('ZONE_TRAFO');
              }}
            >
              <rect 
                x="0" y="0" width="280" height="95" rx="10" 
                fill={activeZone === 'ZONE_TRAFO' ? '#3B154D' : '#1C0D26'} 
                stroke="#A855F7" 
                strokeWidth={activeZone === 'ZONE_TRAFO' ? 2.5 : 1} 
              />
              <rect x="10" y="10" width="260" height="22" rx="4" fill="#7E22CE" />
              <text x="20" y="25" fill="#FFF" fontSize="11" fontWeight="bold">
                3. {locale === 'fr' ? 'ZONE DIFF. TRANSFORMATEUR' : 'TRANSFORMER DIFF. ZONE'}
              </text>
              <text x="15" y="52" fill="#E2E8F0" fontSize="11.5" fontWeight="600">
                {locale === 'fr' ? 'Protège la cuve et les traversées.' : 'Protects power transformer and connections.'}
              </text>
              <text x="15" y="72" fill="#D8B4FE" fontSize="10.5" fontFamily="monospace">
                ANSI 87T / 87N (REF) + 63 Buchholz
              </text>
            </g>

            {/* Zone 4: Feeder (Yellow/Amber) */}
            <g 
              transform="translate(15, 390)" 
              className="cursor-pointer"
              onClick={() => {
                setSelectedZone('ZONE_FEEDER');
                onSelectHotspot?.('ZONE_FEEDER');
              }}
            >
              <rect 
                x="0" y="0" width="280" height="95" rx="10" 
                fill={activeZone === 'ZONE_FEEDER' ? '#4D3605' : '#261B04'} 
                stroke="#F59E0B" 
                strokeWidth={activeZone === 'ZONE_FEEDER' ? 2.5 : 1} 
              />
              <rect x="10" y="10" width="260" height="22" rx="4" fill="#D97706" />
              <text x="20" y="25" fill="#FFF" fontSize="11" fontWeight="bold">
                4. {locale === 'fr' ? 'ZONE PROTECTION DÉPARTS' : 'FEEDER PROTECTION ZONE'}
              </text>
              <text x="15" y="52" fill="#E2E8F0" fontSize="11.5" fontWeight="600">
                {locale === 'fr' ? 'Protège chaque départ de distribution.' : 'Protects each outgoing feeder circuit.'}
              </text>
              <text x="15" y="72" fill="#FDE68A" fontSize="10.5" fontFamily="monospace">
                ANSI 50/51 (Surintensité) &amp; 51N (Terre)
              </text>
            </g>
          </g>

          {/* ==================================================================== */}
          {/* CENTER SCHEMATIC WITH OVERLAPPING ZONE ENVELOPES */}
          {/* ==================================================================== */}
          <g transform="translate(360, 40)">
            <rect x="0" y="0" width="510" height="520" rx="14" fill="#0A0F1D" stroke="#1E293B" strokeWidth="1.5" />
            
            <text x="255" y="32" fill="#F8FAFC" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? 'RECOUVREMENT DES ZONES AUX DISJONCTEURS' : 'OVERLAPPING ZONES PRINCIPLE'}
            </text>

            {/* ======================= OVERLAY ZONES ======================= */}

            {/* 1. Line Zone (Green overlay at top) */}
            <rect 
              x="180" y="45" width="150" height="125" rx="12"
              fill="#10B981" fillOpacity={activeZone === 'ZONE_LINE' ? 0.35 : 0.15}
              stroke="#10B981" strokeWidth={activeZone === 'ZONE_LINE' ? 3 : 1.5}
              strokeDasharray="6 3"
            />

            {/* 2. Bus Zone (Blue overlay spanning across bus) */}
            <rect 
              x="60" y="145" width="390" height="110" rx="14"
              fill="#0284C7" fillOpacity={activeZone === 'ZONE_BUS' ? 0.35 : 0.15}
              stroke="#38BDF8" strokeWidth={activeZone === 'ZONE_BUS' ? 3 : 1.5}
              strokeDasharray="6 3"
            />

            {/* 3. Transformer Zone (Purple overlay surrounding transformer) */}
            <rect 
              x="170" y="235" width="170" height="145" rx="14"
              fill="#9333EA" fillOpacity={activeZone === 'ZONE_TRAFO' ? 0.35 : 0.15}
              stroke="#A855F7" strokeWidth={activeZone === 'ZONE_TRAFO' ? 3 : 1.5}
              strokeDasharray="6 3"
            />

            {/* 4. Feeder Zone (Amber overlay at bottom) */}
            <rect 
              x="70" y="360" width="370" height="120" rx="14"
              fill="#D97706" fillOpacity={activeZone === 'ZONE_FEEDER' ? 0.35 : 0.15}
              stroke="#F59E0B" strokeWidth={activeZone === 'ZONE_FEEDER' ? 3 : 1.5}
              strokeDasharray="6 3"
            />

            {/* ======================= ELECTRICAL SCHEMATIC ======================= */}
            
            {/* Incoming Line */}
            <line x1="255" y1="50" x2="255" y2="85" stroke="#10B981" strokeWidth="3.5" />
            <text x="255" y="45" fill="#34D399" fontSize="11" fontWeight="bold" textAnchor="middle">Ligne THT</text>

            {/* Line CT */}
            <circle cx="255" cy="95" r="10" fill="#0D1524" stroke="#10B981" strokeWidth="2" />
            <line x1="255" y1="105" x2="255" y2="120" stroke="#10B981" strokeWidth="3" />

            {/* Line Breaker (Q0-Line) */}
            <rect x="240" y="120" width="30" height="30" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
            <text x="255" y="139" fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle">Q0-L</text>
            <line x1="255" y1="150" x2="255" y2="185" stroke="#38BDF8" strokeWidth="3.5" />

            {/* MAIN BUSBAR (Horizonal line) */}
            <line x1="90" y1="185" x2="420" y2="185" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" />
            <text x="255" y="178" fill="#7DD3FC" fontSize="11" fontWeight="bold" textAnchor="middle">JEU DE BARRES (87B)</text>

            {/* Transformer Bay Connection */}
            <line x1="255" y1="185" x2="255" y2="210" stroke="#A855F7" strokeWidth="3" />
            {/* Bus CT / Trafo HV CT */}
            <circle cx="255" cy="220" r="10" fill="#0D1524" stroke="#A855F7" strokeWidth="2" />
            <line x1="255" y1="230" x2="255" y2="245" stroke="#A855F7" strokeWidth="3" />

            {/* Trafo HV Breaker */}
            <rect x="240" y="245" width="30" height="30" rx="4" fill="#0F172A" stroke="#A855F7" strokeWidth="2" />
            <line x1="255" y1="275" x2="255" y2="290" stroke="#A855F7" strokeWidth="3" />

            {/* Power Transformer */}
            <circle cx="255" cy="305" r="16" fill="none" stroke="#A855F7" strokeWidth="2.5" />
            <circle cx="255" cy="328" r="16" fill="none" stroke="#A855F7" strokeWidth="2.5" />
            <text x="290" y="322" fill="#D8B4FE" fontSize="11" fontWeight="bold">Transfo 87T</text>
            <line x1="255" y1="344" x2="255" y2="360" stroke="#F59E0B" strokeWidth="3" />

            {/* Trafo LV CT & Breaker */}
            <circle cx="255" cy="370" r="10" fill="#0D1524" stroke="#F59E0B" strokeWidth="2" />
            <line x1="255" y1="380" x2="255" y2="395" stroke="#F59E0B" strokeWidth="3" />

            {/* Feeder Bus */}
            <line x1="100" y1="395" x2="410" y2="395" stroke="#F59E0B" strokeWidth="4" />

            {/* 3 Feeder Breakers & CTs */}
            {[140, 255, 370].map((fx, idx) => (
              <g key={idx} transform={`translate(${fx}, 395)`}>
                <line x1="0" y1="0" x2="0" y2="15" stroke="#F59E0B" strokeWidth="2" />
                <rect x="-11" y="15" width="22" height="22" rx="3" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
                <line x1="0" y1="37" x2="0" y2="48" stroke="#F59E0B" strokeWidth="2" />
                <circle cx="0" cy="55" r="7" fill="#0D1524" stroke="#F59E0B" strokeWidth="1.5" />
                <line x1="0" y1="62" x2="0" y2="75" stroke="#F59E0B" strokeWidth="2" />
                <polygon points="-4,75 4,75 0,83" fill="#F59E0B" />
              </g>
            ))}

            {/* Overlapping zones callout badge */}
            <rect x="40" y="485" width="430" height="26" rx="6" fill="#1E293B" stroke="#64748B" strokeWidth="1" />
            <text x="255" y="502" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
              {locale === 'fr' 
                ? "💡 Les zones se chevauchent aux TC : aucune zone morte non couverte" 
                : "💡 Zones overlap at CTs across breakers: Zero unprotected dead zones"}
            </text>
          </g>

          {/* ==================================================================== */}
          {/* RIGHT PANEL: PROTECTION RELAYS BREAKDOWN */}
          {/* ==================================================================== */}
          <g transform="translate(890, 40)">
            <rect x="0" y="0" width="280" height="520" rx="14" fill="#0D1524" stroke="#1E293B" strokeWidth="1.5" />
            
            {/* Header */}
            <rect x="15" y="15" width="250" height="34" rx="8" fill="#6366F1" fillOpacity="0.15" stroke="#6366F1" strokeWidth="1" />
            <text x="140" y="37" fill="#818CF8" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              {locale === 'fr' ? 'RELAIS NUMÉRIQUES (IED)' : 'PROTECTION RELAYS'}
            </text>

            <g transform="translate(15, 60)">
              {/* Relay 1: Line Relay */}
              <g transform="translate(0, 0)">
                <rect x="0" y="0" width="250" height="95" rx="8" fill="#141E30" stroke="#334155" strokeWidth="1" />
                <text x="15" y="24" fill="#34D399" fontSize="12" fontWeight="bold">
                  {locale === 'fr' ? 'Relais de Ligne (21 / 87L)' : 'Line Relay (21 / 87L)'}
                </text>
                <text x="15" y="44" fill="#94A3B8" fontSize="11">
                  {locale === 'fr' 
                    ? 'Détecte les défauts sur la ligne et déclenche le disjoncteur de ligne.' 
                    : 'Detects faults on the line and trips the line breaker.'}
                </text>
                <text x="15" y="80" fill="#6EE7B7" fontSize="10.5" fontFamily="monospace">
                  Temps &lt; 20 ms · Télé-action DTT
                </text>
              </g>

              {/* Relay 2: Bus Relay */}
              <g transform="translate(0, 110)">
                <rect x="0" y="0" width="250" height="95" rx="8" fill="#141E30" stroke="#334155" strokeWidth="1" />
                <text x="15" y="24" fill="#38BDF8" fontSize="12" fontWeight="bold">
                  {locale === 'fr' ? 'Relais Différentiel Barres (87B)' : 'Bus Differential Relay (87B)'}
                </text>
                <text x="15" y="44" fill="#94A3B8" fontSize="11">
                  {locale === 'fr' 
                    ? 'Compare la somme des TC de toutes les travées (∑I = 0).' 
                    : 'Compares currents from all bus CTs and trips all connected breakers.'}
                </text>
                <text x="15" y="80" fill="#7DD3FC" fontSize="10.5" fontFamily="monospace">
                  Ultra-rapide (&lt; 15 ms)
                </text>
              </g>

              {/* Relay 3: Transformer Relay */}
              <g transform="translate(0, 220)">
                <rect x="0" y="0" width="250" height="95" rx="8" fill="#141E30" stroke="#334155" strokeWidth="1" />
                <text x="15" y="24" fill="#C084FC" fontSize="12" fontWeight="bold">
                  {locale === 'fr' ? 'Relais Différentiel Transfo (87T)' : 'Transformer Relay (87T)'}
                </text>
                <text x="15" y="44" fill="#94A3B8" fontSize="11">
                  {locale === 'fr' 
                    ? 'Compare les courants primaire et secondaire avec filtrage H2/H5.' 
                    : 'Compares currents on both sides of transformer for internal faults.'}
                </text>
                <text x="15" y="80" fill="#D8B4FE" fontSize="10.5" fontFamily="monospace">
                  Retenue d\'Inrush &amp; Surfluxage
                </text>
              </g>

              {/* Relay 4: Feeder Relay */}
              <g transform="translate(0, 330)">
                <rect x="0" y="0" width="250" height="95" rx="8" fill="#141E30" stroke="#334155" strokeWidth="1" />
                <text x="15" y="24" fill="#FBBF24" fontSize="12" fontWeight="bold">
                  {locale === 'fr' ? 'Relais Départ (50/51/51N)' : 'Feeder Relay (50/51/51N)'}
                </text>
                <text x="15" y="44" fill="#94A3B8" fontSize="11">
                  {locale === 'fr' 
                    ? 'Détecte les courts-circuits et défauts à la terre sur les départs.' 
                    : 'Detects faults on feeder circuits and selectively trips feeder breaker.'}
                </text>
                <text x="15" y="80" fill="#FDE68A" fontSize="10.5" fontFamily="monospace">
                  Courbes à temps inverse CEI/IEEE
                </text>
              </g>
            </g>
          </g>

          {/* ==================================================================== */}
          {/* BOTTOM KEY TAKEAWAY BANNER */}
          {/* ==================================================================== */}
          <g transform="translate(30, 580)">
            <rect x="0" y="0" width="1140" height="70" rx="14" fill="#0A1826" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="45" cy="35" r="22" fill="#0284C7" fillOpacity="0.2" />
            <text x="45" y="42" fill="#38BDF8" fontSize="18" textAnchor="middle">🛡️</text>
            <text x="85" y="28" fill="#38BDF8" fontSize="13" fontWeight="900" fontFamily="monospace">
              {locale === 'fr' ? 'POINT CLÉ D\'INGÉNIERIE (KEY TAKEAWAY)' : 'KEY ENGINEERING TAKEAWAY'}
            </text>
            <text x="85" y="50" fill="#E2E8F0" fontSize="12" fontWeight="600">
              {locale === 'fr'
                ? "Des zones de protection coordonnées et se chevauchant garantissent une détection ultra-rapide des défauts, un isolement sélectif sans coupure générale, et une fiabilité maximale du système."
                : "Coordinated, overlapping protection zones ensure fast fault detection, selective isolation, and maximum system reliability."}
            </text>
          </g>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">
            {locale === 'fr' ? 'Sélectivité Chronométrique & Ampèremétrique' : 'Protection Selectivity'}
          </span>
          <span>
            {locale === 'fr'
              ? 'Sélectionnez une zone ci-dessus pour inspecter son temps d\'élimination et ses disjoncteurs asservis.'
              : 'Click any protection zone card to inspect its fault clearing time and tripped breaker matrix.'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          EPEDE Protection Spec 2026
        </span>
      </div>
    </div>
  );
};
