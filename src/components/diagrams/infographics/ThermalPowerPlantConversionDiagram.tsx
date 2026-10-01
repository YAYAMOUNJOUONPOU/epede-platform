// src/components/diagrams/infographics/ThermalPowerPlantConversionDiagram.tsx
import React, { useState } from 'react';

interface Props {
  locale: 'fr' | 'en';
  onSelectHotspot?: (hotspotId: string) => void;
  selectedHotspotId?: string | null;
}

export const ThermalPowerPlantConversionDiagram: React.FC<Props> = ({
  locale,
  onSelectHotspot,
  selectedHotspotId
}) => {
  const [activeStage, setActiveStage] = useState<string>('CONV_TURBINE');

  const activeId = selectedHotspotId || activeStage;

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#070B12] rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-mono">
              {locale === 'fr' 
                ? "Centrale Thermique · Chaîne de Conversion de l'Énergie" 
                : "Thermal Power Plant · Energy Conversion Chain"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {locale === 'fr' 
              ? "Énergie Chimique ➔ Énergie Thermique (Vapeur) ➔ Énergie Mécanique (Turbine) ➔ Énergie Électrique (Alternateur)"
              : "Chemical Energy ➔ Thermal Energy (Steam) ➔ Mechanical Energy (Turbine) ➔ Electrical Energy (Alternator)"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-400/30">
            Cycle de Rankine · CEI 60034
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
            <linearGradient id="tppSteam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="tppCondensate" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="tppElec" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* TOP 4 STEP CONVERSION BAR */}
          <g transform="translate(30, 30)">
            {/* Step 1: Chemical Energy */}
            <g 
              transform="translate(0, 0)"
              className="cursor-pointer"
              onClick={() => {
                setActiveStage('CONV_BOILER');
                onSelectHotspot?.('CONV_BOILER');
              }}
            >
              <rect x="0" y="0" width="265" height="50" rx="8" fill="#1C1113" stroke="#DC2626" strokeWidth={activeId === 'CONV_BOILER' ? 2.5 : 1} />
              <text x="132" y="22" fill="#FCA5A5" fontSize="11" fontWeight="bold" textAnchor="middle">1. COMBUSTIBLE (GAZ / CHARBON)</text>
              <text x="132" y="40" fill="#EF4444" fontSize="13" fontWeight="900" textAnchor="middle">ÉNERGIE CHIMIQUE</text>
            </g>

            <polygon points="275,25 285,25 280,20 280,30" fill="#EF4444" />

            {/* Step 2: Thermal Energy */}
            <g 
              transform="translate(295, 0)"
              className="cursor-pointer"
              onClick={() => {
                setActiveStage('CONV_BOILER');
                onSelectHotspot?.('CONV_BOILER');
              }}
            >
              <rect x="0" y="0" width="265" height="50" rx="8" fill="#1C150E" stroke="#EA580C" strokeWidth={activeId === 'CONV_BOILER' ? 2.5 : 1} />
              <text x="132" y="22" fill="#FDBA74" fontSize="11" fontWeight="bold" textAnchor="middle">2. CHAUDIÈRE À VAPEUR</text>
              <text x="132" y="40" fill="#F97316" fontSize="13" fontWeight="900" textAnchor="middle">ÉNERGIE THERMIQUE</text>
            </g>

            <polygon points="570,25 580,25 575,20 575,30" fill="#F97316" />

            {/* Step 3: Mechanical Energy */}
            <g 
              transform="translate(590, 0)"
              className="cursor-pointer"
              onClick={() => {
                setActiveStage('CONV_TURBINE');
                onSelectHotspot?.('CONV_TURBINE');
              }}
            >
              <rect x="0" y="0" width="265" height="50" rx="8" fill="#18190F" stroke="#F59E0B" strokeWidth={activeId === 'CONV_TURBINE' ? 2.5 : 1} />
              <text x="132" y="22" fill="#FDE68A" fontSize="11" fontWeight="bold" textAnchor="middle">3. TURBINE À VAPEUR</text>
              <text x="132" y="40" fill="#F59E0B" fontSize="13" fontWeight="900" textAnchor="middle">ÉNERGIE MÉCANIQUE</text>
            </g>

            <polygon points="865,25 875,25 870,20 870,30" fill="#F59E0B" />

            {/* Step 4: Electrical Energy */}
            <g 
              transform="translate(885, 0)"
              className="cursor-pointer"
              onClick={() => {
                setActiveStage('CONV_GENERATOR');
                onSelectHotspot?.('CONV_GENERATOR');
              }}
            >
              <rect x="0" y="0" width="255" height="50" rx="8" fill="#0C1D18" stroke="#10B981" strokeWidth={activeId === 'CONV_GENERATOR' ? 2.5 : 1} />
              <text x="127" y="22" fill="#A7F3D0" fontSize="11" fontWeight="bold" textAnchor="middle">4. ALTERNATEUR SYNCHRONE</text>
              <text x="127" y="40" fill="#10B981" fontSize="13" fontWeight="900" textAnchor="middle">ÉNERGIE ÉLECTRIQUE</text>
            </g>
          </g>

          {/* ==================================================================== */}
          {/* MAIN THERMODYNAMIC SCHEMATIC */}
          {/* ==================================================================== */}
          
          {/* 1. BOILER & COMBUSTOR (Left) */}
          <g 
            transform="translate(50, 140)"
            className="cursor-pointer"
            onClick={() => {
              setActiveStage('CONV_BOILER');
              onSelectHotspot?.('CONV_BOILER');
            }}
          >
            <rect x="0" y="0" width="240" height="340" rx="14" fill="#141E30" stroke="#EF4444" strokeWidth={activeId === 'CONV_BOILER' ? 2.5 : 1.5} />
            
            {/* Smokestack */}
            <rect x="20" y="-50" width="30" height="50" fill="#475569" stroke="#64748B" strokeWidth="1" />
            <ellipse cx="35" cy="-55" rx="20" ry="8" fill="#94A3B8" opacity="0.4" />

            <text x="120" y="30" fill="#EF4444" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              CHAUDIÈRE (BOILER)
            </text>

            {/* Flame Chamber at Bottom */}
            <g transform="translate(40, 240)">
              <rect x="0" y="0" width="160" height="70" rx="6" fill="#450A0A" stroke="#DC2626" strokeWidth="1.5" />
              <path d="M 20 60 Q 35 15 50 60 Q 65 20 80 60 Q 95 10 110 60 Q 125 25 140 60 Z" fill="#F59E0B" />
              <path d="M 35 60 Q 50 30 65 60 Q 80 35 95 60 Q 110 30 125 60 Z" fill="#EF4444" />
              <text x="80" y="45" fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle">BRÛLEURS GAZ</text>
            </g>

            {/* Water Tube Serpentine Coil */}
            <g transform="translate(40, 70)">
              <rect x="0" y="0" width="160" height="150" fill="#0F172A" rx="4" />
              {/* Coils */}
              {[20, 45, 70, 95, 120].map((cy) => (
                <line key={cy} x1="10" y1={cy} x2="150" y2={cy} stroke="#F97316" strokeWidth="6" strokeLinecap="round" />
              ))}
              <text x="80" y="142" fill="#FDBA74" fontSize="10" textAnchor="middle">Tubulures Vapeur HP</text>
            </g>

            <text x="120" y="325" fill="#E2E8F0" fontSize="11" textAnchor="middle">
              Vapeur Surchauffée (540°C, 160 bar)
            </text>
          </g>

          {/* HIGH PRESSURE STEAM PIPE FROM BOILER TO TURBINE */}
          <path
            d="M 290 230 L 460 230"
            fill="none"
            stroke="url(#tppSteam)"
            strokeWidth="8"
            className="animate-pulse"
          />
          <text x="375" y="215" fill="#F97316" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            Vapeur Vive ➔
          </text>

          {/* 2. STEAM TURBINE (Center-Left) */}
          <g 
            transform="translate(460, 160)"
            className="cursor-pointer"
            onClick={() => {
              setActiveStage('CONV_TURBINE');
              onSelectHotspot?.('CONV_TURBINE');
            }}
          >
            <rect x="0" y="0" width="190" height="180" rx="14" fill="#141E30" stroke="#F59E0B" strokeWidth={activeId === 'CONV_TURBINE' ? 2.5 : 1.5} />
            
            <text x="95" y="28" fill="#FBBF24" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              TURBINE À VAPEUR
            </text>

            {/* Turbine Housing Conical expanding shape */}
            <polygon points="30,130 160,150 160,55 30,75" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
            
            {/* Rotor Shaft through center */}
            <line x1="10" y1="102" x2="180" y2="102" stroke="#CBD5E1" strokeWidth="6" />
            
            {/* Blading discs */}
            {[50, 75, 100, 125, 150].map((bx, idx) => (
              <ellipse key={bx} cx={bx} cy="102" rx="4" ry={20 + idx * 6} fill="#F59E0B" />
            ))}

            <text x="95" y="170" fill="#E2E8F0" fontSize="11" textAnchor="middle">
              3000 tr/min (50 Hz)
            </text>
          </g>

          {/* MECHANICAL SHAFT LINK TO GENERATOR */}
          <rect x="650" y="258" width="50" height="8" rx="2" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />

          {/* 3. SYNCHRONOUS GENERATOR (Center-Right) */}
          <g 
            transform="translate(700, 160)"
            className="cursor-pointer"
            onClick={() => {
              setActiveStage('CONV_GENERATOR');
              onSelectHotspot?.('CONV_GENERATOR');
            }}
          >
            <rect x="0" y="0" width="190" height="180" rx="14" fill="#141E30" stroke="#10B981" strokeWidth={activeId === 'CONV_GENERATOR' ? 2.5 : 1.5} />
            
            <text x="95" y="28" fill="#34D399" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              ALTERNATEUR SYNCHRONE
            </text>

            {/* Cylindrical Generator Housing */}
            <rect x="30" y="55" width="130" height="95" rx="8" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
            {/* Rotor Core inside */}
            <ellipse cx="95" cy="102" rx="35" ry="30" fill="#0F172A" stroke="#34D399" strokeWidth="1.5" />
            <text x="95" y="106" fill="#10B981" fontSize="12" fontWeight="bold" textAnchor="middle">rotor</text>

            <text x="95" y="170" fill="#A7F3D0" fontSize="11" textAnchor="middle" fontFamily="monospace">
              15.75 kV · 200 MVA
            </text>
          </g>

          {/* STEP-UP TRANSFORMER AT RIGHT */}
          <g transform="translate(940, 175)">
            <line x1="-50" y1="85" x2="20" y2="85" stroke="url(#tppElec)" strokeWidth="6" />
            {/* Transformer */}
            <circle cx="50" cy="85" r="28" fill="none" stroke="#38BDF8" strokeWidth="3" />
            <circle cx="85" cy="85" r="28" fill="none" stroke="#38BDF8" strokeWidth="3" />
            <text x="68" y="130" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">
              Transfo Élévateur
            </text>
            <text x="68" y="146" fill="#94A3B8" fontSize="10" textAnchor="middle" fontFamily="monospace">
              15.75 kV ➔ 225 kV THT
            </text>
          </g>

          {/* GRID PYLON AT FAR RIGHT */}
          <g transform="translate(1080, 160)">
            <line x1="-30" y1="100" x2="30" y2="100" stroke="#38BDF8" strokeWidth="4" />
            <line x1="30" y1="180" x2="30" y2="40" stroke="#94A3B8" strokeWidth="3" />
            <line x1="5" y1="180" x2="30" y2="40" stroke="#64748B" strokeWidth="2" />
            <line x1="55" y1="180" x2="30" y2="40" stroke="#64748B" strokeWidth="2" />
            <line x1="0" y1="80" x2="60" y2="80" stroke="#CBD5E1" strokeWidth="2" />
            <text x="30" y="200" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">
              Réseau THT
            </text>
          </g>

          {/* ==================================================================== */}
          {/* LOWER CONDENSER & COOLING TOWER RANKINE LOOP */}
          {/* ==================================================================== */}

          {/* Steam Exhaust Down into Condenser */}
          <path d="M 555 340 L 555 420" fill="none" stroke="#94A3B8" strokeWidth="6" strokeDasharray="5 3" />
          <text x="590" y="380" fill="#94A3B8" fontSize="10">Vapeur détendue</text>

          {/* CONDENSER BOX */}
          <g 
            transform="translate(460, 420)"
            className="cursor-pointer"
            onClick={() => {
              setActiveStage('CONV_CONDENSER');
              onSelectHotspot?.('CONV_CONDENSER');
            }}
          >
            <rect x="0" y="0" width="190" height="120" rx="10" fill="#141E30" stroke="#38BDF8" strokeWidth={activeId === 'CONV_CONDENSER' ? 2.5 : 1.5} />
            <text x="95" y="25" fill="#38BDF8" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              CONDENSEUR
            </text>
            {/* Water droplets / tubes */}
            <rect x="25" y="40" width="140" height="50" rx="4" fill="#0C1A2E" />
            <text x="95" y="70" fill="#93C5FD" fontSize="11" textAnchor="middle">Condensation sous vide</text>
            <text x="95" y="105" fill="#64748B" fontSize="10" textAnchor="middle">Eau Liquide Condensée</text>
          </g>

          {/* COOLING TOWER TO RIGHT OF CONDENSER */}
          <g 
            transform="translate(730, 400)"
            className="cursor-pointer"
            onClick={() => {
              setActiveStage('CONV_CONDENSER');
              onSelectHotspot?.('CONV_CONDENSER');
            }}
          >
            {/* Hyperbolic cooling tower */}
            <path d="M 20 150 Q 50 80 40 30 L 100 30 Q 90 80 120 150 Z" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
            {/* Vapor plume */}
            <ellipse cx="70" cy="20" rx="25" ry="10" fill="#CBD5E1" opacity="0.4" />
            <text x="70" y="170" fill="#94A3B8" fontSize="11" fontWeight="bold" textAnchor="middle">
              Tour Aéro-Réfrigérante
            </text>
          </g>

          {/* Cooling Water Loop between Condenser and Cooling Tower */}
          <path d="M 650 460 L 730 460" fill="none" stroke="#0284C7" strokeWidth="4" />
          <path d="M 730 490 L 650 490" fill="none" stroke="#38BDF8" strokeWidth="4" />

          {/* FEEDWATER RETURN PUMP FROM CONDENSER TO BOILER */}
          <g transform="translate(340, 460)">
            {/* Pump circle */}
            <circle cx="25" cy="20" r="18" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
            <polygon points="15,20 35,12 35,28" fill="#38BDF8" />
            <text x="25" y="55" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Pompe Alimentaire
            </text>
          </g>

          {/* Piping back to boiler */}
          <path
            d="M 460 480 L 370 480 M 320 480 L 170 480 L 170 480"
            fill="none"
            stroke="url(#tppCondensate)"
            strokeWidth="5"
          />

          {/* ==================================================================== */}
          {/* BOTTOM RANKINE CYCLE SUMMARY BANNER */}
          {/* ==================================================================== */}
          <g transform="translate(30, 595)">
            <rect x="0" y="0" width="1140" height="60" rx="12" fill="#0D1524" stroke="#1E293B" strokeWidth="1" />
            <text x="40" y="35" fill="#FBBF24" fontSize="12" fontWeight="bold" fontFamily="monospace">
              CYCLE DE RANKINE :
            </text>
            <text x="190" y="35" fill="#E2E8F0" fontSize="12">
              L'eau en circuit fermé subit successivement : Compression (pompe) ➔ Vaporisation (chaudière) ➔ Détente (turbine) ➔ Liquéfaction (condenseur).
            </text>
            <rect x="1000" y="15" width="120" height="30" rx="6" fill="#0284C7" fillOpacity="0.2" stroke="#0284C7" />
            <text x="1060" y="34" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Rendement ≈ 40%
            </text>
          </g>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono">
            {locale === 'fr' ? 'Cycle Énergétique' : 'Energy Cycle'}
          </span>
          <span>
            {locale === 'fr'
              ? 'Cliquez sur chaque étape pour analyser les bilans thermiques, la pression de vapeur et la régulation d\'excitation.'
              : 'Click any stage above to inspect enthalpy drop, steam pressure ratings, and alternator excitation control.'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          EPEDE Generation Spec 2026
        </span>
      </div>
    </div>
  );
};
