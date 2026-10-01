// src/components/journey/PhysicalEngineeringSvg.tsx
import React from 'react';
import { StageId } from './types';

interface PhysicalEngineeringSvgProps {
  locale: 'fr' | 'en';
  activeStage: StageId;
  onSelectStage: (stage: StageId) => void;
  onSelectEquipment: (equipmentId: string) => void;
  isLampOn: boolean;
  onToggleLamp: () => void;
}

export const PhysicalEngineeringSvg: React.FC<PhysicalEngineeringSvgProps> = ({
  locale,
  activeStage,
  onSelectStage,
  onSelectEquipment,
  isLampOn,
  onToggleLamp,
}) => {
  return (
    <div className="relative w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 overflow-hidden shadow-xs">
      {/* CAD Toolbar Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-800 font-bold uppercase">
            {locale === 'fr' ? 'ÉLÉVATION & COUPE TECHNIQUE CAD (INFRASTRUCTURE)' : 'CAD CROSS-SECTION & ELEVATION VIEW'}
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          {locale === 'fr' ? 'Génie Civil · Mécanique · Appareillage Électrique' : 'Civil · Mechanical · Electrical Switchgear'}
        </span>
      </div>

      <svg
        viewBox="0 0 1200 480"
        className="w-full h-auto select-none"
      >
        <defs>
          <pattern id="concreteHatch" width="10" height="10" patternUnits="userSpaceOnUse">
            <line x1="0" y1="10" x2="10" y2="0" stroke="#CBD5E1" strokeWidth="1" />
          </pattern>
          <pattern id="soilHatch" width="16" height="16" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="16" y2="16" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="16" y1="0" x2="0" y2="16" stroke="#E2E8F0" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Soil / Ground Level */}
        <line x1="0" y1="410" x2="1200" y2="410" stroke="#94A3B8" strokeWidth="2" />
        <rect x="0" y="411" width="1200" height="70" fill="url(#soilHatch)" />

        {/* ---------------- 1. DAM & POWERHOUSE CROSS-SECTION (X: 10 to 220) ---------------- */}
        <g 
          className="cursor-pointer"
          onClick={() => onSelectStage('generation')}
        >
          {/* Concrete Dam Profile */}
          <polygon
            points="20,110 90,110 160,410 20,410"
            fill="#CBD5E1"
            stroke="#64748B"
            strokeWidth="2"
          />
          {/* Reservoir Water Body */}
          <path
            d="M 20 140 L 80 140 L 80 410 L 20 410 Z"
            fill="#0284C7"
            fillOpacity="0.3"
          />
          <text x="25" y="160" fill="#0369A1" fontSize="10" fontWeight="bold" fontFamily="monospace">
            {locale === 'fr' ? 'Retenue d\'Eau' : 'Reservoir'}
          </text>
          <text x="25" y="175" fill="#0284C7" fontSize="8" fontFamily="monospace">
            H_chute = 110 m
          </text>

          {/* Trash Rack / Debris Screen */}
          <line x1="75" y1="200" x2="75" y2="250" stroke="#64748B" strokeWidth="3" strokeDasharray="3 2" />
          <text x="35" y="230" fill="#475569" fontSize="7" fontFamily="monospace">
            Grille à débris
          </text>

          {/* Penstock Conduit */}
          <path
            d="M 80 230 Q 120 250, 140 340 L 165 340"
            fill="none"
            stroke="#0284C7"
            strokeWidth="12"
            strokeLinecap="round"
            className="cursor-pointer hover:stroke-amber-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-penstock');
            }}
          />

          {/* Powerhouse Cavern */}
          <rect x="140" y="240" width="75" height="170" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" rx="4" />
          <text x="146" y="256" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">
            Centrale
          </text>

          {/* Francis Turbine Spiral Casing */}
          <circle cx="178" cy="355" r="18" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
          <circle cx="178" cy="355" r="8" fill="#0284C7" />

          {/* Vertical Shaft */}
          <line x1="178" y1="310" x2="178" y2="345" stroke="#64748B" strokeWidth="4" />

          {/* Hydro Generator Stator & Rotor */}
          <rect x="156" y="280" width="44" height="30" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" rx="2" />
          <line x1="162" y1="295" x2="194" y2="295" stroke="#D97706" strokeWidth="3" />
          <text x="160" y="274" fill="#B45309" fontSize="8" fontWeight="bold" fontFamily="monospace">
            Alternateur
          </text>
        </g>

        {/* ---------------- 2. GSU TRANSFORMER SWITCHYARD (X: 230 to 390) ---------------- */}
        <g 
          className="cursor-pointer"
          onClick={() => onSelectStage('switchyard')}
        >
          {/* Concrete Foundation Plinth with Oil Catch Basin & Pebbles */}
          <rect x="245" y="380" width="80" height="30" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <text x="250" y="402" fill="#64748B" fontSize="7" fontFamily="monospace">
            Fosse pare-feu galets
          </text>

          {/* GSU Transformer Tank */}
          <rect x="255" y="300" width="60" height="80" fill="#EEF2FF" stroke="#6366F1" strokeWidth="2" rx="3" />
          {/* Conservator tank on top */}
          <ellipse cx="285" cy="285" rx="22" ry="8" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1.5" />
          <line x1="285" y1="293" x2="285" y2="300" stroke="#6366F1" strokeWidth="3" />
          {/* Cooling radiators on side */}
          <line x1="250" y1="315" x2="250" y2="365" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          <line x1="245" y1="320" x2="245" y2="360" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          {/* 225 kV High-Voltage Porcelain Bushings */}
          <line x1="270" y1="300" x2="265" y2="250" stroke="#64748B" strokeWidth="3.5" />
          <line x1="300" y1="300" x2="305" y2="250" stroke="#64748B" strokeWidth="3.5" />
          {/* Bushing skirts / sheds */}
          {[260, 270, 280].map((y) => (
            <ellipse key={`sk-${y}`} cx="267" cy={y} rx="6" ry="2" fill="#CBD5E1" />
          ))}
          <text x="255" y="340" fill="#4338CA" fontSize="9" fontWeight="bold" fontFamily="monospace">
            TR-GSU
          </text>
          <text x="255" y="352" fill="#64748B" fontSize="8" fontFamily="monospace">
            15 / 225 kV
          </text>

          {/* Live Tank SF6 Circuit Breaker 225 kV */}
          <g transform="translate(360, 310)">
            <rect x="-6" y="50" width="12" height="50" fill="#CBD5E1" />
            <line x1="0" y1="50" x2="0" y2="0" stroke="#64748B" strokeWidth="4" />
            <rect x="-10" y="-30" width="20" height="30" fill="#EEF2FF" stroke="#6366F1" strokeWidth="1.5" rx="2" />
            <text x="-16" y="70" fill="#4338CA" fontSize="8" fontFamily="monospace" fontWeight="bold">
              DJ 225kV
            </text>
          </g>
        </g>

        {/* ---------------- 3. LATTICE TRANSMISSION TOWERS (X: 410 to 620) ---------------- */}
        <g 
          className="cursor-pointer"
          onClick={() => onSelectStage('transmission')}
        >
          {/* Anchor Lattice Tower 225 kV */}
          <g transform="translate(510, 120)">
            {/* Top Peak for OPGW Earth Wire */}
            <polygon points="0,0 -8,50 8,50" fill="none" stroke="#64748B" strokeWidth="1.5" />
            {/* Main Upper Crossarm */}
            <line x1="-55" y1="70" x2="55" y2="70" stroke="#64748B" strokeWidth="3" />
            {/* Tower Body Lattice Bracing */}
            <polygon points="-12,50 12,50 35,290 -35,290" fill="none" stroke="#64748B" strokeWidth="2" />
            <line x1="-16" y1="100" x2="16" y2="100" stroke="#64748B" strokeWidth="1.5" />
            <line x1="-20" y1="150" x2="20" y2="150" stroke="#64748B" strokeWidth="1.5" />
            <line x1="-26" y1="210" x2="26" y2="210" stroke="#64748B" strokeWidth="1.5" />
            {/* Diagonal cross braces */}
            <line x1="-16" y1="100" x2="20" y2="150" stroke="#64748B" strokeWidth="1" />
            <line x1="16" y1="100" x2="-20" y2="150" stroke="#64748B" strokeWidth="1" />
            <line x1="-20" y1="150" x2="26" y2="210" stroke="#64748B" strokeWidth="1" />
            <line x1="20" y1="150" x2="-26" y2="210" stroke="#64748B" strokeWidth="1" />

            {/* Glass Insulator Strings (Vertical Drops) */}
            <line x1="-48" y1="70" x2="-48" y2="115" stroke="#0284C7" strokeWidth="3.5" strokeDasharray="3 1" />
            <line x1="48" y1="70" x2="48" y2="115" stroke="#0284C7" strokeWidth="3.5" strokeDasharray="3 1" />

            {/* Stockbridge damper under clamp */}
            <line x1="-48" y1="115" x2="-48" y2="128" stroke="#64748B" strokeWidth="1.5" />
            <ellipse cx="-48" cy="128" rx="5" ry="2" fill="#64748B" />

            {/* Concrete Footing Blocks */}
            <rect x="-42" y="285" width="16" height="15" fill="#CBD5E1" rx="1" />
            <rect x="26" y="285" width="16" height="15" fill="#CBD5E1" rx="1" />

            <text x="-40" y="320" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">
              Pylône Treillis 225 kV
            </text>
          </g>

          {/* OPGW Earth Wire on Peak */}
          <line x1="390" y1="120" x2="620" y2="120" stroke="#64748B" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="430" y="112" fill="#475569" fontSize="8" fontFamily="monospace">
            Câble de Garde OPGW
          </text>

          {/* Bundled Catenary Conductors */}
          <path
            d="M 390 185 Q 462 230, 558 185"
            fill="none"
            stroke="#4F46E5"
            strokeWidth="3.5"
          />
          <path
            d="M 462 235 L 620 200"
            fill="none"
            stroke="#4F46E5"
            strokeWidth="3.5"
          />
        </g>

        {/* ---------------- 4. 225/30 kV GRID SUBSTATION & GANTRY (X: 630 to 810) ---------------- */}
        <g 
          className="cursor-pointer"
          onClick={() => onSelectStage('substation')}
        >
          {/* Steel Line Gantry */}
          <line x1="650" y1="160" x2="650" y2="410" stroke="#64748B" strokeWidth="4" />
          <line x1="710" y1="160" x2="710" y2="410" stroke="#64748B" strokeWidth="4" />
          <line x1="640" y1="180" x2="720" y2="180" stroke="#64748B" strokeWidth="3" />
          <text x="645" y="174" fill="#4338CA" fontSize="8" fontFamily="monospace" fontWeight="bold">
            Portique 225kV
          </text>

          {/* Autotransformer 225/30 kV */}
          <rect x="730" y="320" width="65" height="70" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" rx="3" />
          <text x="736" y="350" fill="#1D4ED8" fontSize="8" fontWeight="bold" fontFamily="monospace">
            225 / 30 kV
          </text>
          <text x="736" y="362" fill="#64748B" fontSize="7" fontFamily="monospace">
            OLTC ±10%
          </text>
          {/* Primary/secondary Bushings */}
          <line x1="745" y1="320" x2="745" y2="280" stroke="#4F46E5" strokeWidth="3" />
          <line x1="775" y1="320" x2="775" y2="290" stroke="#2563EB" strokeWidth="2.5" />
        </g>

        {/* ---------------- 5. MV DISTRIBUTION POLE & TRANSFORMER (X: 820 to 1000) ---------------- */}
        <g 
          className="cursor-pointer"
          onClick={() => onSelectStage('distribution')}
        >
          {/* Concrete / Wood Pole */}
          <rect x="870" y="190" width="10" height="220" fill="#78716C" rx="1" />
          {/* Crossarm */}
          <rect x="850" y="210" width="50" height="6" fill="#78716C" rx="1" />
          {/* MV Pin Insulators */}
          <rect x="855" y="202" width="6" height="8" fill="#0284C7" rx="1" />
          <rect x="889" y="202" width="6" height="8" fill="#0284C7" rx="1" />

          {/* Pole-Mounted Distribution Transformer 30 kV / 400 V (H61) */}
          <rect x="885" y="260" width="36" height="48" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2" rx="3" />
          <ellipse cx="903" cy="256" rx="14" ry="4" fill="#E2E8F0" />
          <text x="888" y="284" fill="#C2410C" fontSize="7" fontWeight="bold" fontFamily="monospace">
            Transfo HTA
          </text>
          <text x="888" y="295" fill="#64748B" fontSize="7" fontFamily="monospace">
            30kV/400V
          </text>

          {/* Low Voltage Service Drop Cable */}
          <path
            d="M 921 285 Q 980 320, 1030 290"
            fill="none"
            stroke="#EA580C"
            strokeWidth="2.5"
          />
        </g>

        {/* ---------------- 6. RESIDENTIAL HOME CUT-AWAY (X: 1020 to 1180) ---------------- */}
        <g 
          className="cursor-pointer"
          onClick={() => onSelectStage('consumption')}
        >
          {/* House Foundation & Walls */}
          <polygon
            points="1030,220 1100,160 1170,220 1170,410 1030,410"
            fill="#F8FAFC"
            stroke="#94A3B8"
            strokeWidth="2"
          />
          {/* Pitched Roof */}
          <polygon
            points="1025,222 1100,158 1175,222 1165,225 1100,168 1035,225"
            fill="#DC2626"
          />

          {/* Room Interior Ceiling & Floor */}
          <line x1="1040" y1="280" x2="1160" y2="280" stroke="#CBD5E1" strokeWidth="2" />
          <text x="1080" y="274" fill="#64748B" fontSize="8" fontFamily="monospace">
            Plafond
          </text>

          {/* Electric Service Entrance & Smart Meter */}
          <rect x="1035" y="300" width="16" height="24" fill="#FFF7ED" stroke="#EA580C" strokeWidth="1.5" rx="2" />
          <text x="1037" y="315" fill="#C2410C" fontSize="6" fontFamily="monospace" fontWeight="bold">
            kWh
          </text>

          {/* Domestic Distribution Board */}
          <rect x="1055" y="300" width="20" height="30" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" rx="2" />
          <line x1="1059" y1="310" x2="1071" y2="310" stroke="#059669" strokeWidth="2" />
          <text x="1058" y="325" fill="#047857" fontSize="6" fontFamily="monospace" fontWeight="bold">
            30mA
          </text>

          {/* Concealed In-Wall Conduit */}
          <path
            d="M 1075 315 L 1145 315 L 1145 340"
            fill="none"
            stroke="#EA580C"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />

          {/* Wall Switch */}
          <g 
            transform="translate(1145, 345)"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLamp();
            }}
          >
            <rect x="-8" y="-10" width="16" height="20" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" rx="2" />
            <rect x="-4" y={isLampOn ? "-6" : "0"} width="8" height="8" fill={isLampOn ? "#D97706" : "#94A3B8"} rx="1" />
            <text x="-12" y="20" fill="#B45309" fontSize="6" fontFamily="monospace" fontWeight="bold">
              {isLampOn ? 'ON' : 'OFF'}
            </text>
          </g>

          {/* Ceiling Luminaire & Bulb */}
          <g 
            transform="translate(1100, 320)"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-lamp-bulb');
            }}
          >
            {/* Cord from ceiling */}
            <line x1="0" y1="-40" x2="0" y2="-10" stroke="#64748B" strokeWidth="1.5" />
            {/* Fixture shade */}
            <path d="M -14 -10 L 14 -10 L 8 0 L -8 0 Z" fill="#64748B" />
            {/* Bulb */}
            <circle
              cx="0"
              cy="8"
              r="8"
              fill={isLampOn ? "#FDE047" : "#E2E8F0"}
              stroke={isLampOn ? "#D97706" : "#94A3B8"}
              strokeWidth="1.5"
            />
            {isLampOn && (
              <circle cx="0" cy="8" r="18" fill="#FDE047" fillOpacity="0.35" />
            )}
            <text x="-16" y="28" fill={isLampOn ? "#B45309" : "#64748B"} fontSize="8" fontWeight="bold" fontFamily="monospace">
              {isLampOn ? 'ÉCLAIRÉ' : 'ÉTEINT'}
            </text>
          </g>
        </g>
      </svg>

      {/* CAD Layer Footer Information */}
      <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-600 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-emerald-800 font-bold">{locale === 'fr' ? 'DISCIPLINES ACTIVES :' : 'ACTIVE DISCIPLINES :'}</span>
          <span>Génie Civil (Barrage & Pylônes)</span>
          <span>·</span>
          <span>Électromécanique (Turbine & Alternateur)</span>
          <span>·</span>
          <span>Lignes Aériennes & Câblerie</span>
        </div>
        <div className="text-[11px] text-slate-500">
          Coupe d'élévation normalisée selon CEI 61936-1 & Eurocodes
        </div>
      </div>
    </div>
  );
};
