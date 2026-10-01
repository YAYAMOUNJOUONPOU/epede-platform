// src/components/diagrams/SolarBessSubstationSvg.tsx
// Single Line Diagram (SLD) for 100 MWp Solar PV Farm + 50 MWh BESS Substation
// With 33 kV Collector Busbar & 33/225 kV Step-Up Grid Interconnection Bay
// Standards: IEC 62271, IEC 62933, IEEE 1547, IEC 60076

import React from 'react';

interface SolarBessSubstationSvgProps {
  // Switch states
  q0_pv: boolean;
  q8_pv: boolean;
  q0_bess: boolean;
  q8_bess: boolean;
  q0_aux: boolean;
  qs_33_t: boolean;
  q0_33_t: boolean;
  q0_225: boolean;
  qs_225_line: boolean;
  q8_225: boolean;

  // Operational values
  solarIrradiance: number; // W/m² (0 - 1000)
  solarPowerMw: number; // MW
  bessMode: 'charge' | 'discharge' | 'standby' | 'grid_forming';
  bessPowerMw: number; // MW (+ = discharge, - = charge)
  bessSocPercent: number; // 0 - 100 %
  totalExportMw: number; // net MW to 225 kV
  reactivePowerMvar: number;

  // Potential / Energization states
  isPvGenerating: boolean;
  isBessActive: boolean;
  isBus33Energized: boolean;
  isTrafoHvEnergized: boolean;
  isGrid225Connected: boolean;
  showTelemetryOverlay?: boolean;
  activeFault?: string | null;

  onToggle: (device: string) => void;
}

export const SolarBessSubstationSvg: React.FC<SolarBessSubstationSvgProps> = ({
  q0_pv,
  q8_pv,
  q0_bess,
  q8_bess,
  q0_aux,
  qs_33_t,
  q0_33_t,
  q0_225,
  qs_225_line,
  q8_225,
  solarIrradiance,
  solarPowerMw,
  bessMode,
  bessPowerMw,
  bessSocPercent,
  totalExportMw,
  reactivePowerMvar,
  isPvGenerating,
  isBessActive,
  isBus33Energized,
  isTrafoHvEnergized,
  isGrid225Connected,
  showTelemetryOverlay = true,
  activeFault = null,
  onToggle,
}) => {
  const col33 = isBus33Energized ? '#0284C7' : '#94A3B8';
  const col225 = isGrid225Connected ? '#D97706' : isTrafoHvEnergized ? '#059669' : '#94A3B8';
  const colPv = isPvGenerating ? '#D97706' : '#94A3B8';
  const colBess = isBessActive ? (bessPowerMw >= 0 ? '#059669' : '#2563EB') : '#94A3B8';

  const isLineFault = activeFault === '50_51' || activeFault === '21';
  const isTrafoFault = activeFault === '87T' || activeFault === '49' || activeFault === '64R';

  return (
    <svg viewBox="0 0 980 620" className="w-full h-auto select-none font-mono">
      <defs>
        <filter id="solar-fault-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="solar-fault-burst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
          <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#EF4444" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Background Frame with Substation Sections */}
      <rect x="20" y="20" width="940" height="580" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" className="shadow-xs" />

      {/* Substation Title Header */}
      <text x="40" y="46" fill="#0F172A" fontSize="13" fontWeight="bold">
        CENTRALE SOLAIRE HYBRIDE 100 MWc & STOCKAGE BESS 50 MWh · POSTE ÉLÉVATEUR 33/225 kV
      </text>
      <text x="40" y="62" fill="#64748B" fontSize="10">
        Architecture de raccordement réseau HTA/HTB conforme CEI 62271-200 / CEI 62933 / IEEE 1547
      </text>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: PHOTOVOLTAIC SOLAR FARM BAY (Left, x: 50-250) */}
      {/* ------------------------------------------------------------- */}
      <g transform="translate(60, 80)">
        {/* Field Boundary Box */}
        <rect x="0" y="0" width="190" height="150" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray={isPvGenerating ? 'none' : '4 3'} />
        
        {/* PV Panel Icon */}
        <g transform="translate(20, 15)">
          <rect x="0" y="0" width="60" height="42" rx="3" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
          {/* Grid lines inside solar panel */}
          <line x1="20" y1="0" x2="20" y2="42" stroke="#93C5FD" strokeWidth="1" />
          <line x1="40" y1="0" x2="40" y2="42" stroke="#93C5FD" strokeWidth="1" />
          <line x1="0" y1="14" x2="60" y2="14" stroke="#93C5FD" strokeWidth="1" />
          <line x1="0" y1="28" x2="60" y2="28" stroke="#93C5FD" strokeWidth="1" />
        </g>

        {/* PV Farm Info */}
        <text x="90" y="28" fill="#B45309" fontSize="11" fontWeight="bold">CHAMP PV</text>
        <text x="90" y="42" fill="#64748B" fontSize="9">100 MWc Crête</text>
        <text x="90" y="55" fill="#0284C7" fontSize="9">1500 V DC</text>

        {/* Live Irradiance & Generation Badge */}
        <rect x="15" y="68" width="160" height="26" rx="6" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="25" y="85" fill="#64748B" fontSize="9">Irradiance G:</text>
        <text x="105" y="85" fill="#B45309" fontSize="10" fontWeight="bold">{solarIrradiance} W/m²</text>

        {/* Inverter Symbol (DC to AC) */}
        <g transform="translate(65, 102)">
          <rect x="0" y="0" width="60" height="36" rx="4" fill="#F8FAFC" stroke={isPvGenerating ? '#D97706' : '#CBD5E1'} strokeWidth="1.5" />
          <text x="10" y="16" fill="#64748B" fontSize="9">DC</text>
          <text x="36" y="30" fill="#64748B" fontSize="9">AC</text>
          <line x1="4" y1="32" x2="56" y2="4" stroke="#CBD5E1" strokeWidth="1" />
          <text x="8" y="28" fill={isPvGenerating ? '#059669' : '#94A3B8'} fontSize="8" fontWeight="bold">
            {solarPowerMw.toFixed(1)} MW
          </text>
        </g>
      </g>

      {/* Conductor from PV Inverter to PV MV Step-Up Transformer */}
      <line x1="155" y1="230" x2="155" y2="260" stroke={colPv} strokeWidth="3" />

      {/* PV Step-Up Transformer (0.8 / 33 kV, 2.5 MVA × 40 clusters) */}
      <g transform="translate(155, 275)">
        <circle cx="0" cy="-6" r="14" fill="#FFFFFF" stroke={colPv} strokeWidth="2" />
        <circle cx="0" cy="12" r="14" fill="#FFFFFF" stroke={col33} strokeWidth="2" />
        <text x="22" y="2" fill="#64748B" fontSize="9">Transfo PV</text>
        <text x="22" y="14" fill="#0369A1" fontSize="8">0.8 / 33 kV</text>
      </g>

      {/* Down to PV 33 kV Breaker Q0_PV */}
      <line x1="155" y1="305" x2="155" y2="330" stroke={col33} strokeWidth="2.5" />

      {/* PV Circuit Breaker Q0_PV */}
      <g
        transform="translate(143, 330)"
        onClick={() => onToggle('q0_pv')}
        className="cursor-pointer group"
      >
        <rect
          x="0"
          y="0"
          width="24"
          height="24"
          rx="4"
          fill="#FFFFFF"
          stroke={q0_pv ? '#0284C7' : '#DC2626'}
          strokeWidth="2"
          className="shadow-xs"
        />
        <text x="6" y="16" fill={q0_pv ? '#0369A1' : '#DC2626'} fontSize="10" fontWeight="bold">
          {q0_pv ? 'I' : 'O'}
        </text>
        <text x="-48" y="16" fill="#0F172A" fontSize="9" fontWeight="bold">
          52-PV
        </text>
      </g>

      {/* Earth Switch Q8_PV */}
      <g
        transform="translate(180, 342)"
        onClick={() => onToggle('q8_pv')}
        className="cursor-pointer group"
      >
        <line x1="-12" y1="0" x2="0" y2="0" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="0" y1="0" x2={q8_pv ? "16" : "12"} y2={q8_pv ? "0" : "-10"} stroke={q8_pv ? "#059669" : "#DC2626"} strokeWidth="2" />
        {/* Ground Symbol */}
        <line x1="16" y1="-6" x2="16" y2="6" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="20" y1="-4" x2="20" y2="4" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="24" y1="-2" x2="24" y2="2" stroke="#94A3B8" strokeWidth="1.5" />
        <text x="28" y="4" fill="#64748B" fontSize="8">Q8-PV</text>
      </g>

      {/* Down from Q0_PV into 33 kV Busbar */}
      <line x1="155" y1="354" x2="155" y2="400" stroke={q0_pv && !q8_pv ? col33 : '#94A3B8'} strokeWidth="2.5" />

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: BESS BATTERY STORAGE BAY (Middle-Left, x: 280-480) */}
      {/* ------------------------------------------------------------- */}
      <g transform="translate(290, 80)">
        {/* BESS Boundary Box */}
        <rect x="0" y="0" width="190" height="150" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray={isBessActive ? 'none' : '4 3'} />
        
        {/* Battery Container Icon */}
        <g transform="translate(20, 15)">
          <rect x="0" y="0" width="55" height="42" rx="4" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
          <rect x="18" y="-4" width="18" height="4" rx="1" fill="#10B981" />
          {/* Battery cell levels */}
          <rect x="6" y="26" width="43" height="10" rx="2" fill="#10B981" />
          <rect x="6" y="14" width="43" height="10" rx="2" fill={bessSocPercent > 40 ? "#10B981" : "#6EE7B7"} />
          <rect x="6" y="2" width="43" height="10" rx="2" fill={bessSocPercent > 75 ? "#10B981" : "#6EE7B7"} />
        </g>

        {/* BESS Info */}
        <text x="85" y="28" fill="#047857" fontSize="11" fontWeight="bold">STOCKAGE BESS</text>
        <text x="85" y="42" fill="#64748B" fontSize="9">50 MWh / 25 MW</text>
        <text x="85" y="55" fill="#0284C7" fontSize="9">LiFePO4 Containers</text>

        {/* SOC & Mode Display */}
        <rect x="15" y="68" width="160" height="26" rx="6" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="25" y="85" fill="#64748B" fontSize="9">SOC Batterie:</text>
        <text x="95" y="85" fill="#047857" fontSize="10" fontWeight="bold">{bessSocPercent}%</text>

        {/* Bi-directional PCS Inverter (4-Quadrant) */}
        <g transform="translate(65, 102)">
          <rect x="0" y="0" width="60" height="36" rx="4" fill="#F8FAFC" stroke={isBessActive ? '#059669' : '#CBD5E1'} strokeWidth="1.5" />
          <text x="8" y="16" fill="#64748B" fontSize="8">DC ⇌ AC</text>
          <text x="8" y="28" fill={bessPowerMw >= 0 ? '#059669' : '#2563EB'} fontSize="9" fontWeight="bold">
            {bessPowerMw >= 0 ? `+${bessPowerMw.toFixed(1)} MW` : `${bessPowerMw.toFixed(1)} MW`}
          </text>
        </g>
      </g>

      {/* Conductor from BESS PCS to BESS MV Step-up Transformer */}
      <line x1="385" y1="230" x2="385" y2="260" stroke={colBess} strokeWidth="3" />

      {/* BESS Step-Up Transformer (0.8 / 33 kV) */}
      <g transform="translate(385, 275)">
        <circle cx="0" cy="-6" r="14" fill="#FFFFFF" stroke={colBess} strokeWidth="2" />
        <circle cx="0" cy="12" r="14" fill="#FFFFFF" stroke={col33} strokeWidth="2" />
        <text x="22" y="2" fill="#64748B" fontSize="9">Transfo BESS</text>
        <text x="22" y="14" fill="#0369A1" fontSize="8">0.8 / 33 kV</text>
      </g>

      {/* Down to BESS 33 kV Breaker Q0_BESS */}
      <line x1="385" y1="305" x2="385" y2="330" stroke={col33} strokeWidth="2.5" />

      {/* BESS Circuit Breaker Q0_BESS */}
      <g
        transform="translate(373, 330)"
        onClick={() => onToggle('q0_bess')}
        className="cursor-pointer group"
      >
        <rect
          x="0"
          y="0"
          width="24"
          height="24"
          rx="4"
          fill="#FFFFFF"
          stroke={q0_bess ? '#0284C7' : '#DC2626'}
          strokeWidth="2"
          className="shadow-xs"
        />
        <text x="6" y="16" fill={q0_bess ? '#0369A1' : '#DC2626'} fontSize="10" fontWeight="bold">
          {q0_bess ? 'I' : 'O'}
        </text>
        <text x="-54" y="16" fill="#0F172A" fontSize="9" fontWeight="bold">
          52-BESS
        </text>
      </g>

      {/* Earth Switch Q8_BESS */}
      <g
        transform="translate(410, 342)"
        onClick={() => onToggle('q8_bess')}
        className="cursor-pointer group"
      >
        <line x1="-12" y1="0" x2="0" y2="0" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="0" y1="0" x2={q8_bess ? "16" : "12"} y2={q8_bess ? "0" : "-10"} stroke={q8_bess ? "#059669" : "#DC2626"} strokeWidth="2" />
        <line x1="16" y1="-6" x2="16" y2="6" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="20" y1="-4" x2="20" y2="4" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="24" y1="-2" x2="24" y2="2" stroke="#94A3B8" strokeWidth="1.5" />
        <text x="28" y="4" fill="#64748B" fontSize="8">Q8-BESS</text>
      </g>

      {/* Down from Q0_BESS into 33 kV Busbar */}
      <line x1="385" y1="354" x2="385" y2="400" stroke={q0_bess && !q8_bess ? col33 : '#94A3B8'} strokeWidth="2.5" />

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: AUXILIARY SERVICES & STATCOM (x: 520) */}
      {/* ------------------------------------------------------------- */}
      <g transform="translate(520, 290)">
        {/* Aux & STATCOM box */}
        <rect x="-35" y="-60" width="70" height="50" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1" strokeDasharray="3 2" />
        <text x="-28" y="-42" fill="#0369A1" fontSize="8" fontWeight="bold">STATCOM</text>
        <text x="-28" y="-30" fill="#64748B" fontSize="7">& SERVICES AUX</text>
        <text x="-28" y="-18" fill="#059669" fontSize="7">±30 MVAR</text>
        
        {/* Line to Breaker */}
        <line x1="0" y1="-10" x2="0" y2="40" stroke={q0_aux ? col33 : '#94A3B8'} strokeWidth="2" />
        
        {/* Q0_AUX Breaker */}
        <g
          transform="translate(-12, 40)"
          onClick={() => onToggle('q0_aux')}
          className="cursor-pointer group"
        >
          <rect
            x="0"
            y="0"
            width="24"
            height="24"
            rx="4"
            fill="#FFFFFF"
            stroke={q0_aux ? '#0284C7' : '#DC2626'}
            strokeWidth="2"
            className="shadow-xs"
          />
          <text x="6" y="16" fill={q0_aux ? '#0369A1' : '#DC2626'} fontSize="10" fontWeight="bold">
            {q0_aux ? 'I' : 'O'}
          </text>
          <text x="28" y="16" fill="#64748B" fontSize="8">
            52-AUX
          </text>
        </g>
        
        <line x1="0" y1="64" x2="0" y2="110" stroke={q0_aux ? col33 : '#94A3B8'} strokeWidth="2" />
      </g>

      {/* ------------------------------------------------------------- */}
      {/* MAIN 33 kV COLLECTOR BUSBAR (JEU DE BARRES COLLECTEUR HTA) */}
      {/* ------------------------------------------------------------- */}
      <line
        x1="110"
        y1="400"
        x2="720"
        y2="400"
        stroke={col33}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <text x="120" y="420" fill={col33} fontSize="11" fontWeight="bold">
        JEU DE BARRES 33 kV COLLECTEUR CENTRAL (CEI 62271-200) · 31.5 kA 3s
      </text>

      {/* Live SCADA Telemetry Badge on 33 kV Busbar */}
      {showTelemetryOverlay && (
        <g transform="translate(120, 432)" className="filter drop-shadow-xs">
          <rect width="180" height="26" rx="4" fill="#0F172A" fillOpacity="0.9" stroke="#38BDF8" strokeWidth="1" />
          <text x="8" y="12" fill="#38BDF8" fontSize="8" fontWeight="bold">TÉLÉMESURE BUS 33 kV</text>
          <circle cx="168" cy="10" r="3" fill={isBus33Energized ? '#10B981' : '#EF4444'} />
          <text x="8" y="21" fill="#F8FAFC" fontSize="8">
            {isBus33Energized ? `U: 33.1 kV · P: ${totalExportMw.toFixed(1)} MW · Q: ${reactivePowerMvar.toFixed(1)} Mvar` : '0.0 kV · NON ALIMENTÉ'}
          </text>
        </g>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SECTION 4: MAIN STEP-UP BAY (33 kV -> 225 kV, x: 670) */}
      {/* ------------------------------------------------------------- */}
      {/* Line going down from 33 kV busbar to 33 kV Disconnector QS_33_T */}
      <line x1="670" y1="400" x2="670" y2="435" stroke={col33} strokeWidth="3" />

      {/* 33 kV Disconnector QS_33_T */}
      <g
        transform="translate(670, 440)"
        onClick={() => onToggle('qs_33_t')}
        className="cursor-pointer group"
      >
        <circle cx="0" cy="0" r="3" fill="#94A3B8" />
        <line x1="0" y1="0" x2={qs_33_t ? "0" : "14"} y2={qs_33_t ? "18" : "6"} stroke={qs_33_t ? "#0284C7" : "#DC2626"} strokeWidth="2.5" />
        <circle cx="0" cy="18" r="3" fill="#94A3B8" />
        <text x="18" y="12" fill="#64748B" fontSize="8">QS-33-T</text>
      </g>

      <line x1="670" y1="460" x2="670" y2="480" stroke={qs_33_t ? col33 : '#94A3B8'} strokeWidth="3" />

      {/* 33 kV Transformer Incomer Breaker Q0_33_T */}
      <g
        transform="translate(658, 480)"
        onClick={() => onToggle('q0_33_t')}
        className="cursor-pointer group"
      >
        <rect
          x="0"
          y="0"
          width="24"
          height="24"
          rx="4"
          fill="#FFFFFF"
          stroke={q0_33_t ? '#0284C7' : '#DC2626'}
          strokeWidth="2"
          className="shadow-xs"
        />
        <text x="6" y="16" fill={q0_33_t ? '#0369A1' : '#DC2626'} fontSize="10" fontWeight="bold">
          {q0_33_t ? 'I' : 'O'}
        </text>
        <text x="-48" y="16" fill="#0F172A" fontSize="9" fontWeight="bold">
          52-33T
        </text>
      </g>

      <line x1="670" y1="504" x2="670" y2="525" stroke={q0_33_t && qs_33_t ? col33 : '#94A3B8'} strokeWidth="3" />

      {/* Turn right towards 33/225 kV Main Power Transformer */}
      <line x1="670" y1="525" x2="790" y2="525" stroke={q0_33_t && qs_33_t ? col33 : '#94A3B8'} strokeWidth="3" />
      <line x1="790" y1="525" x2="790" y2="465" stroke={q0_33_t && qs_33_t ? col33 : '#94A3B8'} strokeWidth="3" />

      {/* ------------------------------------------------------------- */}
      {/* SECTION 5: MAIN 33/225 kV POWER TRANSFORMER (x: 790, y: 410) */}
      {/* ------------------------------------------------------------- */}
      <g transform="translate(790, 420)">
        {/* Transformer circles: 33 kV (lower) and 225 kV (upper) */}
        <circle cx="0" cy="20" r="22" fill="#FFFFFF" stroke={col33} strokeWidth="3" />
        <circle cx="0" cy="-12" r="22" fill="#FFFFFF" stroke={col225} strokeWidth="3" />
        
        {/* Trafo specs */}
        <text x="32" y="-4" fill="#0F172A" fontSize="10" fontWeight="bold">TR-01 (120 MVA)</text>
        <text x="32" y="10" fill="#D97706" fontSize="9">33 / 225 kV · YNd11</text>
        <text x="32" y="24" fill="#64748B" fontSize="8">Ucc = 13.5% · ONAF</text>
        <text x="32" y="38" fill="#059669" fontSize="8">Régleur en charge OLTC</text>

        {/* Transformer Internal Fault Arc */}
        {isTrafoFault && (
          <g className="animate-pulse pointer-events-none">
            <circle cx="0" cy="4" r="30" fill="url(#solar-fault-burst)" opacity="0.95" />
            <polygon
              points="0,-22 7,-6 18,-8 5,4 12,20 -2,8 -14,16 -6,-2 -16,-10 -3,-8"
              fill="#FEF08A"
              stroke="#DC2626"
              strokeWidth="1.5"
              filter="url(#solar-fault-glow)"
            />
            <rect x="-150" y="-12" width="135" height="26" rx="4" fill="#7F1D1D" fillOpacity="0.95" stroke="#F87171" strokeWidth="1.5" />
            <text x="-82" y="0" textAnchor="middle" fill="#FEF08A" fontSize="7.5" fontWeight="bold">DÉFAUT TRANSFO TR-01</text>
            <text x="-82" y="9" textAnchor="middle" fill="#FCA5A5" fontSize="7" fontWeight="bold">ANSI {activeFault} · Déclenchement</text>
          </g>
        )}
      </g>

      {/* Line up from Transformer to 225 kV Breaker Q0_225 */}
      <line x1="790" y1="384" x2="790" y2="330" stroke={col225} strokeWidth="3" />

      {/* 225 kV Line Fault Arc */}
      {isLineFault && (
        <g transform="translate(790, 280)" className="animate-pulse pointer-events-none">
          <circle cx="0" cy="0" r="26" fill="url(#solar-fault-burst)" opacity="0.9" />
          <polygon
            points="0,-20 6,-5 16,-7 5,3 10,18 -2,7 -12,14 -5,-2 -14,-9 -2,-7"
            fill="#FEF08A"
            stroke="#EF4444"
            strokeWidth="1.5"
            filter="url(#solar-fault-glow)"
          />
          <rect x="-145" y="-12" width="130" height="26" rx="4" fill="#7F1D1D" fillOpacity="0.95" stroke="#F87171" strokeWidth="1.5" />
          <text x="-80" y="0" textAnchor="middle" fill="#FEF08A" fontSize="7.5" fontWeight="bold">DÉFAUT LIGNE 225 kV</text>
          <text x="-80" y="9" textAnchor="middle" fill="#FCA5A5" fontSize="7" fontWeight="bold">ANSI {activeFault} · Ik&apos;&apos; = 14.8 kA</text>
        </g>
      )}

      {/* Surge Arresters 225 kV */}
      <g transform="translate(830, 350)">
        <rect x="0" y="0" width="12" height="24" rx="2" fill="#F8FAFC" stroke="#D97706" strokeWidth="1.5" />
        <line x1="-10" y1="12" x2="0" y2="12" stroke="#D97706" strokeWidth="1.5" />
        {/* Ground */}
        <line x1="6" y1="24" x2="6" y2="34" stroke="#94A3B8" strokeWidth="1" />
        <line x1="2" y1="34" x2="10" y2="34" stroke="#94A3B8" strokeWidth="1" />
        <text x="18" y="16" fill="#64748B" fontSize="8">ZnO 225kV</text>
      </g>

      {/* 225 kV SF6 Breaker Q0_225 */}
      <g
        transform="translate(778, 305)"
        onClick={() => onToggle('q0_225')}
        className="cursor-pointer group"
      >
        <rect
          x="0"
          y="0"
          width="24"
          height="24"
          rx="4"
          fill="#FFFFFF"
          stroke={q0_225 ? '#0284C7' : '#DC2626'}
          strokeWidth="2"
          className="shadow-xs"
        />
        <text x="6" y="16" fill={q0_225 ? '#0369A1' : '#DC2626'} fontSize="10" fontWeight="bold">
          {q0_225 ? 'I' : 'O'}
        </text>
        <text x="30" y="16" fill="#0F172A" fontSize="9" fontWeight="bold">
          52-225 (SF6)
        </text>
      </g>

      <line x1="790" y1="305" x2="790" y2="260" stroke={q0_225 ? col225 : '#94A3B8'} strokeWidth="3" />

      {/* 225 kV Line Disconnector QS_225_LINE */}
      <g
        transform="translate(790, 240)"
        onClick={() => onToggle('qs_225_line')}
        className="cursor-pointer group"
      >
        <circle cx="0" cy="0" r="3" fill="#94A3B8" />
        <line x1="0" y1="0" x2={qs_225_line ? "0" : "14"} y2={qs_225_line ? "-18" : "-6"} stroke={qs_225_line ? "#0284C7" : "#DC2626"} strokeWidth="2.5" />
        <circle cx="0" cy="-18" r="3" fill="#94A3B8" />
        <text x="18" y="-6" fill="#64748B" fontSize="8">QS-L225</text>
      </g>

      {/* 225 kV Earth Switch Q8_225 */}
      <g
        transform="translate(825, 205)"
        onClick={() => onToggle('q8_225')}
        className="cursor-pointer group"
      >
        <line x1="-15" y1="0" x2="0" y2="0" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="0" y1="0" x2={q8_225 ? "16" : "12"} y2={q8_225 ? "0" : "-10"} stroke={q8_225 ? "#059669" : "#DC2626"} strokeWidth="2" />
        <line x1="16" y1="-6" x2="16" y2="6" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="20" y1="-4" x2="20" y2="4" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="24" y1="-2" x2="24" y2="2" stroke="#94A3B8" strokeWidth="1.5" />
        <text x="28" y="4" fill="#64748B" fontSize="8">Q8-225</text>
      </g>

      {/* Up to 225 kV Grid POI */}
      <line x1="790" y1="220" x2="790" y2="130" stroke={qs_225_line && !q8_225 ? col225 : '#94A3B8'} strokeWidth="4" />

      {/* 225 kV Grid Pylon & Arrow */}
      <g transform="translate(790, 100)">
        {/* Transmission Tower Symbol */}
        <polygon points="0,-25 -15,10 15,10" fill="none" stroke="#D97706" strokeWidth="1.5" />
        <line x1="-22" y1="-10" x2="22" y2="-10" stroke="#D97706" strokeWidth="1.5" />
        <line x1="-18" y1="0" x2="18" y2="0" stroke="#D97706" strokeWidth="1.5" />
        
        {/* POI Header Badge */}
        <rect x="-85" y="-55" width="170" height="26" rx="6" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5" />
        <text x="0" y="-38" textAnchor="middle" fill="#B45309" fontSize="10" fontWeight="bold">
          RÉSEAU 225 kV (POI)
        </text>
        
        {/* Live Power Injected Badge */}
        <rect x="-95" y="16" width="190" height="34" rx="6" fill="#FFFFFF" stroke="#CBD5E1" className="shadow-xs" />
        <text x="0" y="30" textAnchor="middle" fill="#64748B" fontSize="8">
          INJECTION TOTALE VERS LE RÉSEAU
        </text>
        <text x="0" y="45" textAnchor="middle" fill={totalExportMw >= 0 ? "#059669" : "#DC2626"} fontSize="12" fontWeight="black">
          {totalExportMw >= 0 ? `+${totalExportMw.toFixed(1)} MW` : `${totalExportMw.toFixed(1)} MW`} · {reactivePowerMvar.toFixed(1)} MVAR
        </text>
      </g>

      {/* Animated Flow Arrow indicators if energized and injecting */}
      {isGrid225Connected && totalExportMw > 0 && (
        <g fill="#059669">
          <circle cx="790" cy="180" r="3" className="animate-ping" />
          <polygon points="790,165 786,175 794,175" />
        </g>
      )}

      {/* Legend Box at Bottom-Left */}
      <g transform="translate(40, 540)">
        <rect x="0" y="0" width="540" height="50" rx="8" fill="#FFFFFF" stroke="#E2E8F0" className="shadow-xs" />
        <text x="12" y="18" fill="#64748B" fontSize="8" fontWeight="bold">LÉGENDE NORMALISÉE :</text>
        
        <rect x="12" y="26" width="12" height="12" rx="2" fill="#0284C7" />
        <text x="28" y="36" fill="#334155" fontSize="8">Appareil Fermé (Actif)</text>
        
        <rect x="175" y="26" width="12" height="12" rx="2" fill="#DC2626" />
        <text x="191" y="36" fill="#334155" fontSize="8">Appareil Ouvert (Isolé)</text>
        
        <circle cx="320" cy="32" r="5" fill="#0284C7" />
        <text x="330" y="36" fill="#334155" fontSize="8">Barre 33 kV Active</text>

        <circle cx="430" cy="32" r="5" fill="#D97706" />
        <text x="440" y="36" fill="#334155" fontSize="8">Réseau 225 kV Couplé</text>
      </g>
    </svg>
  );
};
