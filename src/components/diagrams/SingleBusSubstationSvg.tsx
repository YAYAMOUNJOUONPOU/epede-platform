// src/components/diagrams/SingleBusSubstationSvg.tsx
import React from 'react';

interface SingleBusSubstationSvgProps {
  qs_line: boolean;
  q0_line: boolean;
  qs_trafo: boolean;
  q0_trafo_hv: boolean;
  q0_trafo_mv: boolean;
  q0_f1: boolean;
  q0_f2: boolean;
  q0_f3: boolean;
  q8_line?: boolean;

  onToggle: (device: string) => void;

  isLineEnergized: boolean;
  isBus225Energized: boolean;
  isTrafoEnergized: boolean;
  isBus30Energized: boolean;

  u_hv_nom: number;
  u_mv_nom: number;
  trafoTap: number;
  activeLoadMw?: number;
  current_hv?: number;
  current_mv?: number;
  showTelemetryOverlay?: boolean;
  activeFault?: string | null;
  onOpenTcc?: () => void;
}

export const SingleBusSubstationSvg: React.FC<SingleBusSubstationSvgProps> = ({
  qs_line,
  q0_line,
  qs_trafo,
  q0_trafo_hv,
  q0_trafo_mv,
  q0_f1,
  q0_f2,
  q0_f3,
  q8_line = false,
  onToggle,
  isLineEnergized,
  isBus225Energized,
  isTrafoEnergized,
  isBus30Energized,
  u_hv_nom,
  u_mv_nom,
  trafoTap,
  activeLoadMw = 48.5,
  current_hv = 130,
  current_mv = 952,
  showTelemetryOverlay = true,
  activeFault = null,
  onOpenTcc,
}) => {
  const cHv = isBus225Energized ? '#0284C7' : '#94A3B8';
  const cLine = isLineEnergized ? '#0284C7' : '#94A3B8';
  const cTrafo = isTrafoEnergized ? '#0284C7' : '#94A3B8';
  const cMv = isBus30Energized ? '#D97706' : '#94A3B8';

  const isLineFault = activeFault === '50_51' || activeFault === '21';
  const isTrafoFault = activeFault === '87T' || activeFault === '49' || activeFault === '64R';
  const isMvBusFault = activeFault === '50N';

  return (
    <svg viewBox="0 0 740 580" className="w-full max-w-2xl h-auto select-none font-mono">
      <defs>
        {/* Glow filter for electrical fault arcs */}
        <filter id="fault-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="fault-burst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
          <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#EF4444" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* ---------------- 225 kV GRID INCOMER ---------------- */}
      <text x="370" y="24" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="bold">
        LIGNE HTB 225 kV (RÉSEAU INTERCONNECTÉ - SONATREL)
      </text>
      <line
        x1="370"
        y1="30"
        x2="370"
        y2="60"
        stroke={cLine}
        strokeWidth="3"
        className={isLineEnergized ? 'chain-line' : ''}
      />

      {/* Line Disconnector QS1 */}
      <g
        onClick={() => onToggle('qs_line')}
        className="cursor-pointer group"
        transform="translate(355, 60)"
      >
        <rect width="30" height="24" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" rx="4" />
        <text x="15" y="16" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="bold">QS1</text>
        <line
          x1="15"
          y1="0"
          x2={qs_line ? 15 : 24}
          y2={qs_line ? 24 : 12}
          stroke={qs_line ? '#0284C7' : '#DC2626'}
          strokeWidth="2.5"
        />
      </g>

      {/* Earth Switch Q8 Line */}
      <g
        onClick={() => onToggle('q8_line')}
        className="cursor-pointer group"
        transform="translate(415, 60)"
      >
        <line x1="-30" y1="12" x2="-5" y2="12" stroke="#94A3B8" strokeWidth="2" />
        <rect width="26" height="20" fill="#FFFFFF" stroke={q8_line ? '#059669' : '#94A3B8'} strokeWidth="1.5" rx="4" />
        <text x="13" y="14" textAnchor="middle" fill={q8_line ? '#059669' : '#64748B'} fontSize="8" fontWeight="bold">
          Q8
        </text>
        <line x1="13" y1="20" x2="13" y2="26" stroke="#059669" strokeWidth="1.5" />
        <line x1="7" y1="26" x2="19" y2="26" stroke="#059669" strokeWidth="1.5" />
        <line x1="9" y1="29" x2="17" y2="29" stroke="#059669" strokeWidth="1" />
      </g>

      {/* Live SCADA Telemetry Badge: Incomer 225 kV Line */}
      {showTelemetryOverlay && (
        <g transform="translate(435, 102)" className="filter drop-shadow-xs">
          <rect width="118" height="46" rx="5" fill="#0F172A" fillOpacity="0.92" stroke="#38BDF8" strokeWidth="1" />
          <text x="8" y="14" fill="#38BDF8" fontSize="8" fontWeight="bold">INCOMER 225 kV</text>
          <circle cx="106" cy="11" r="3" fill={isLineEnergized ? '#10B981' : '#EF4444'} />
          <text x="8" y="27" fill="#F8FAFC" fontSize="9" fontWeight="medium">
            U: {isLineEnergized ? u_hv_nom.toFixed(1) : '0.0'} kV · 50.0 Hz
          </text>
          <text x="8" y="39" fill="#FCD34D" fontSize="9" fontWeight="bold">
            P: {isTrafoEnergized ? activeLoadMw.toFixed(1) : '0.0'} MW · {isTrafoEnergized ? current_hv.toFixed(0) : '0'} A
          </text>
        </g>
      )}

      <line
        x1="370"
        y1="84"
        x2="370"
        y2="105"
        stroke={cLine}
        strokeWidth="3"
      />

      {/* Visual Arc Flash / Lightning Fault: 225 kV Line Fault (50/51 or 21) */}
      {isLineFault && (
        <g transform="translate(370, 95)" className="animate-pulse pointer-events-none">
          <circle cx="0" cy="0" r="28" fill="url(#fault-burst)" opacity="0.9" />
          <polygon
            points="0,-22 7,-6 18,-8 5,4 12,20 -2,8 -14,16 -6,-2 -16,-10 -3,-8"
            fill="#FEF08A"
            stroke="#EF4444"
            strokeWidth="1.5"
            filter="url(#fault-glow)"
          />
          <rect x="25" y="-14" width="130" height="28" rx="4" fill="#7F1D1D" fillOpacity="0.95" stroke="#F87171" strokeWidth="1.5" />
          <text x="32" y="-1" fill="#FEF08A" fontSize="8" fontWeight="bold">DÉFAUT LIGNE 225 kV</text>
          <text x="32" y="10" fill="#FCA5A5" fontSize="7.5" fontWeight="bold">Ik&apos;&apos; = 14.8 kA · ANSI {activeFault}</text>
        </g>
      )}

      {/* 225 kV Line Circuit Breaker 52-1 (Q0) */}
      <g
        onClick={() => onToggle('q0_line')}
        className="cursor-pointer group"
        transform="translate(345, 105)"
      >
        <rect
          width="50"
          height="40"
          fill="#FFFFFF"
          stroke={q0_line ? '#0284C7' : '#DC2626'}
          strokeWidth="2"
          rx="6"
          className="transition-all group-hover:stroke-sky-600 shadow-xs"
        />
        <text x="25" y="18" textAnchor="middle" fill={q0_line ? '#0369A1' : '#DC2626'} fontSize="11" fontWeight="bold">
          52-1
        </text>
        <text x="25" y="32" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="medium">
          {q0_line ? 'CLOSED' : 'OPEN'}
        </text>
        <circle cx="42" cy="10" r="3" fill={q0_line ? '#059669' : '#DC2626'} />
      </g>

      {/* TCC Protection Tag on 52-1 (ANSI 21 / 51) */}
      {onOpenTcc && (
        <g
          onClick={onOpenTcc}
          className="cursor-pointer group hover:opacity-90"
          transform="translate(402, 114)"
        >
          <rect
            width="64"
            height="22"
            fill="#F0F9FF"
            stroke="#0284C7"
            strokeWidth="1"
            rx="4"
            className="filter drop-shadow-xs group-hover:fill-sky-100"
          />
          <text x="32" y="10" textAnchor="middle" fill="#0369A1" fontSize="7.5" fontWeight="bold">
            P546 · ANSI 21/51
          </text>
          <text x="32" y="18" textAnchor="middle" fill="#0284C7" fontSize="6.5">
            TMS 0.32 · TCC ➔
          </text>
        </g>
      )}

      <line
        x1="370"
        y1="145"
        x2="370"
        y2="175"
        stroke={cHv}
        strokeWidth="3"
        className={isBus225Energized ? 'chain-line' : ''}
      />

      {/* ---------------- 225 kV MAIN BUSBAR ---------------- */}
      <line
        x1="80"
        y1="175"
        x2="660"
        y2="175"
        stroke={cHv}
        strokeWidth="6"
      />
      <text x="90" y="165" fill="#0369A1" fontSize="11" fontWeight="bold">
        JEU DE BARRES 1 (225 kV) · U = {isBus225Energized ? u_hv_nom.toFixed(1) : '0.0'} kV
      </text>

      {/* Down from Busbar to Transformer Bay */}
      <line
        x1="370"
        y1="178"
        x2="370"
        y2="210"
        stroke={cHv}
        strokeWidth="3"
      />

      {/* Trafo HV Disconnector QS2 */}
      <g
        onClick={() => onToggle('qs_trafo')}
        className="cursor-pointer"
        transform="translate(355, 210)"
      >
        <rect width="30" height="24" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" rx="4" />
        <text x="15" y="16" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="bold">QS2</text>
        <line
          x1="15"
          y1="0"
          x2={qs_trafo ? 15 : 24}
          y2={qs_trafo ? 24 : 12}
          stroke={qs_trafo ? '#0284C7' : '#DC2626'}
          strokeWidth="2.5"
        />
      </g>

      <line
        x1="370"
        y1="234"
        x2="370"
        y2="255"
        stroke={cTrafo}
        strokeWidth="3"
      />

      {/* Trafo HV Circuit Breaker 52-2 */}
      <g
        onClick={() => onToggle('q0_trafo_hv')}
        className="cursor-pointer group"
        transform="translate(345, 255)"
      >
        <rect
          width="50"
          height="40"
          fill="#FFFFFF"
          stroke={q0_trafo_hv ? '#0284C7' : '#DC2626'}
          strokeWidth="2"
          rx="6"
        />
        <text x="25" y="18" textAnchor="middle" fill={q0_trafo_hv ? '#0369A1' : '#DC2626'} fontSize="11" fontWeight="bold">
          52-2
        </text>
        <text x="25" y="32" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="medium">
          {q0_trafo_hv ? 'CLOSED' : 'OPEN'}
        </text>
        <circle cx="42" cy="10" r="3" fill={q0_trafo_hv ? '#059669' : '#DC2626'} />
      </g>

      {/* TCC Protection Tag on 52-2 (ANSI 87T / 51) */}
      {onOpenTcc && (
        <g
          onClick={onOpenTcc}
          className="cursor-pointer group hover:opacity-90"
          transform="translate(402, 264)"
        >
          <rect
            width="64"
            height="22"
            fill="#FAF5FF"
            stroke="#9333EA"
            strokeWidth="1"
            rx="4"
            className="filter drop-shadow-xs group-hover:fill-purple-100"
          />
          <text x="32" y="10" textAnchor="middle" fill="#7E22CE" fontSize="7.5" fontWeight="bold">
            RET670 · 87T/51
          </text>
          <text x="32" y="18" textAnchor="middle" fill="#9333EA" fontSize="6.5">
            TMS 0.28 · TCC ➔
          </text>
        </g>
      )}

      <line
        x1="370"
        y1="295"
        x2="370"
        y2="315"
        stroke={cTrafo}
        strokeWidth="3"
      />

      {/* ---------------- POWER TRANSFORMER (63 MVA 225/30 kV) ---------------- */}
      <g transform="translate(370, 345)">
        <circle
          cx="0"
          cy="-14"
          r="22"
          fill="none"
          stroke={cTrafo}
          strokeWidth="3"
        />
        <circle
          cx="0"
          cy="14"
          r="22"
          fill="none"
          stroke={isTrafoEnergized ? '#D97706' : '#94A3B8'}
          strokeWidth="3"
        />
        <text x="35" y="-10" fill="#0369A1" fontSize="10" fontWeight="bold">YN (225 kV)</text>
        <text x="35" y="6" fill="#64748B" fontSize="9">63 MVA · Dyn11</text>
        <text x="35" y="22" fill="#B45309" fontSize="10" fontWeight="bold">d (30 kV)</text>
        <rect x="-85" y="-12" width="50" height="24" fill="#F8FAFC" stroke="#0284C7" strokeWidth="1.5" rx="4" />
        <text x="-60" y="4" textAnchor="middle" fill="#0369A1" fontSize="9" fontWeight="bold">87T / 63</text>
      </g>

      {/* Visual Arc Flash / Lightning Fault: Transformer Internal Fault (87T / 49 / 64R) */}
      {isTrafoFault && (
        <g transform="translate(370, 345)" className="animate-pulse pointer-events-none">
          <circle cx="0" cy="0" r="34" fill="url(#fault-burst)" opacity="0.95" />
          <polygon
            points="0,-24 8,-6 20,-8 6,6 14,24 -3,9 -16,18 -7,-3 -18,-12 -3,-9"
            fill="#FEF08A"
            stroke="#DC2626"
            strokeWidth="2"
            filter="url(#fault-glow)"
          />
          <rect x="-165" y="-45" width="150" height="32" rx="4" fill="#7F1D1D" fillOpacity="0.95" stroke="#F87171" strokeWidth="1.5" />
          <text x="-90" y="-31" textAnchor="middle" fill="#FEF08A" fontSize="8.5" fontWeight="bold">DÉFAUT INTERNE TRANSFO</text>
          <text x="-90" y="-19" textAnchor="middle" fill="#FCA5A5" fontSize="7.5" fontWeight="bold">
            {activeFault === '87T' ? 'Idiff = 1.45 kA · ANSI 87T' : activeFault === '49' ? 'θ = 124°C · ANSI 49 Surcharge' : 'Imc = 420 A · ANSI 64R Masse Cuve'}
          </text>
        </g>
      )}

      {/* Live SCADA Telemetry Badge: Power Transformer 63 MVA */}
      {showTelemetryOverlay && (
        <g transform="translate(485, 322)" className="filter drop-shadow-xs">
          <rect width="136" height="52" rx="5" fill="#0F172A" fillOpacity="0.92" stroke="#D97706" strokeWidth="1" />
          <text x="8" y="14" fill="#F59E0B" fontSize="8" fontWeight="bold">TRANSFORMATEUR TR-1</text>
          <circle cx="124" cy="11" r="3" fill={isTrafoEnergized ? '#10B981' : '#EF4444'} />
          <text x="8" y="27" fill="#F8FAFC" fontSize="9" fontWeight="medium">
            S: {isTrafoEnergized ? (activeLoadMw / 0.98).toFixed(1) : '0.0'} MVA · cos φ 0.98
          </text>
          <text x="8" y="38" fill="#38BDF8" fontSize="8">
            HV: {isTrafoEnergized ? current_hv.toFixed(0) : '0'} A · MV: {isBus30Energized ? current_mv.toFixed(0) : '0'} A
          </text>
          <text x="8" y="47" fill="#34D399" fontSize="8">
            Charge: {isTrafoEnergized ? ((activeLoadMw / 63.0) * 100).toFixed(0) : '0'}% (Nom. 63 MVA)
          </text>
        </g>
      )}

      <line
        x1="370"
        y1="375"
        x2="370"
        y2="395"
        stroke={isTrafoEnergized ? '#D97706' : '#94A3B8'}
        strokeWidth="3"
      />

      {/* 30 kV Incomer Breaker 52-3 */}
      <g
        onClick={() => onToggle('q0_trafo_mv')}
        className="cursor-pointer group"
        transform="translate(345, 395)"
      >
        <rect
          width="50"
          height="40"
          fill="#FFFFFF"
          stroke={q0_trafo_mv ? '#D97706' : '#DC2626'}
          strokeWidth="2"
          rx="6"
        />
        <text x="25" y="18" textAnchor="middle" fill={q0_trafo_mv ? '#B45309' : '#DC2626'} fontSize="11" fontWeight="bold">
          52-3
        </text>
        <text x="25" y="32" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="medium">
          {q0_trafo_mv ? 'CLOSED' : 'OPEN'}
        </text>
        <circle cx="42" cy="10" r="3" fill={q0_trafo_mv ? '#059669' : '#DC2626'} />
      </g>

      {/* TCC Protection Tag on 52-3 (ANSI 51/51N) */}
      {onOpenTcc && (
        <g
          onClick={onOpenTcc}
          className="cursor-pointer group hover:opacity-90"
          transform="translate(402, 404)"
        >
          <rect
            width="64"
            height="22"
            fill="#ECFDF5"
            stroke="#10B981"
            strokeWidth="1"
            rx="4"
            className="filter drop-shadow-xs group-hover:fill-emerald-100"
          />
          <text x="32" y="10" textAnchor="middle" fill="#047857" fontSize="7.5" fontWeight="bold">
            P141 · 51/51N
          </text>
          <text x="32" y="18" textAnchor="middle" fill="#059669" fontSize="6.5">
            TMS 0.22 · TCC ➔
          </text>
        </g>
      )}

      <line
        x1="370"
        y1="435"
        x2="370"
        y2="465"
        stroke={cMv}
        strokeWidth="3"
        className={isBus30Energized ? 'chain-line' : ''}
      />

      {/* ---------------- 30 kV MEDIUM VOLTAGE BUSBAR ---------------- */}
      <line
        x1="80"
        y1="465"
        x2="660"
        y2="465"
        stroke={cMv}
        strokeWidth="5"
      />
      <text x="90" y="455" fill="#B45309" fontSize="11" fontWeight="bold">
        JEU DE BARRES HTA 30 kV · U = {isBus30Energized ? u_mv_nom.toFixed(2) : '0.0'} kV (Tap: {trafoTap > 0 ? `+${trafoTap}` : trafoTap})
      </text>

      {/* Visual Arc Flash / Lightning Fault: 30 kV Earth Fault (50N/51N) */}
      {isMvBusFault && (
        <g transform="translate(480, 465)" className="animate-pulse pointer-events-none">
          <circle cx="0" cy="0" r="26" fill="url(#fault-burst)" opacity="0.9" />
          <polygon
            points="0,-20 6,-5 16,-7 5,3 10,18 -2,7 -12,14 -5,-2 -14,-9 -2,-7"
            fill="#FEF08A"
            stroke="#EA580C"
            strokeWidth="1.5"
            filter="url(#fault-glow)"
          />
          <rect x="20" y="-14" width="130" height="28" rx="4" fill="#7C2D12" fillOpacity="0.95" stroke="#FB923C" strokeWidth="1.5" />
          <text x="27" y="-1" fill="#FEF08A" fontSize="8" fontWeight="bold">DÉFAUT TERRE 30 kV</text>
          <text x="27" y="10" fill="#FDBA74" fontSize="7.5" fontWeight="bold">3I0 = 1.62 kA · ANSI 50N/51N</text>
        </g>
      )}

      {/* Outgoing Feeder 1 */}
      <g transform="translate(180, 465)">
        <line x1="0" y1="0" x2="0" y2="25" stroke={cMv} strokeWidth="2.5" />
        <g onClick={() => onToggle('q0_f1')} className="cursor-pointer">
          <rect x="-18" y="25" width="36" height="30" fill="#FFFFFF" stroke={q0_f1 ? '#D97706' : '#DC2626'} strokeWidth="1.5" rx="4" />
          <text x="0" y="44" textAnchor="middle" fill={q0_f1 ? '#B45309' : '#DC2626'} fontSize="9" fontWeight="bold">F1</text>
        </g>
        <line x1="0" y1="55" x2="0" y2="75" stroke={isBus30Energized && q0_f1 ? '#D97706' : '#94A3B8'} strokeWidth="2.5" />
        
        {/* TCC Protection Tag on F1 (ANSI 51/50) */}
        {onOpenTcc && (
          <g
            onClick={onOpenTcc}
            className="cursor-pointer group hover:opacity-90"
            transform="translate(24, 28)"
          >
            <rect
              width="58"
              height="20"
              fill="#FEF3C7"
              stroke="#F59E0B"
              strokeWidth="1"
              rx="4"
              className="filter drop-shadow-xs group-hover:fill-amber-200"
            />
            <text x="29" y="9" textAnchor="middle" fill="#92400E" fontSize="7" fontWeight="bold">
              REF615 · 51
            </text>
            <text x="29" y="16" textAnchor="middle" fill="#B45309" fontSize="6">
              TMS 0.12 · TCC
            </text>
          </g>
        )}

        <text x="0" y="90" textAnchor="middle" fill="#64748B" fontSize="9">Départ 1 (Yaoundé)</text>
        <text x="0" y="102" textAnchor="middle" fill={isBus30Energized && q0_f1 ? '#B45309' : '#94A3B8'} fontSize="9" fontWeight="bold">
          {isBus30Energized && q0_f1 ? '18.2 MW' : '0.0 MW'}
        </text>
        {showTelemetryOverlay && isBus30Energized && q0_f1 && (
          <text x="0" y="112" textAnchor="middle" fill="#0284C7" fontSize="8" fontWeight="medium">
            358 A · cos φ 0.98
          </text>
        )}
      </g>

      {/* Outgoing Feeder 2 */}
      <g transform="translate(370, 465)">
        <line x1="0" y1="0" x2="0" y2="25" stroke={cMv} strokeWidth="2.5" />
        <g onClick={() => onToggle('q0_f2')} className="cursor-pointer">
          <rect x="-18" y="25" width="36" height="30" fill="#FFFFFF" stroke={q0_f2 ? '#D97706' : '#DC2626'} strokeWidth="1.5" rx="4" />
          <text x="0" y="44" textAnchor="middle" fill={q0_f2 ? '#B45309' : '#DC2626'} fontSize="9" fontWeight="bold">F2</text>
        </g>
        <line x1="0" y1="55" x2="0" y2="75" stroke={isBus30Energized && q0_f2 ? '#D97706' : '#94A3B8'} strokeWidth="2.5" />
        <text x="0" y="90" textAnchor="middle" fill="#64748B" fontSize="9">Départ 2 (Zone Indus)</text>
        <text x="0" y="102" textAnchor="middle" fill={isBus30Energized && q0_f2 ? '#B45309' : '#94A3B8'} fontSize="9" fontWeight="bold">
          {isBus30Energized && q0_f2 ? '24.5 MW' : '0.0 MW'}
        </text>
        {showTelemetryOverlay && isBus30Energized && q0_f2 && (
          <text x="0" y="112" textAnchor="middle" fill="#0284C7" fontSize="8" fontWeight="medium">
            481 A · cos φ 0.98
          </text>
        )}
      </g>

      {/* Outgoing Feeder 3 */}
      <g transform="translate(560, 465)">
        <line x1="0" y1="0" x2="0" y2="25" stroke={cMv} strokeWidth="2.5" />
        <g onClick={() => onToggle('q0_f3')} className="cursor-pointer">
          <rect x="-18" y="25" width="36" height="30" fill="#FFFFFF" stroke={q0_f3 ? '#D97706' : '#DC2626'} strokeWidth="1.5" rx="4" />
          <text x="0" y="44" textAnchor="middle" fill={q0_f3 ? '#B45309' : '#DC2626'} fontSize="9" fontWeight="bold">F3</text>
        </g>
        <line x1="0" y1="55" x2="0" y2="75" stroke={isBus30Energized && q0_f3 ? '#D97706' : '#94A3B8'} strokeWidth="2.5" />
        <text x="0" y="90" textAnchor="middle" fill="#64748B" fontSize="9">Départ 3 (Hydro Tie)</text>
        <text x="0" y="102" textAnchor="middle" fill={isBus30Energized && q0_f3 ? '#B45309' : '#94A3B8'} fontSize="9" fontWeight="bold">
          {isBus30Energized && q0_f3 ? '5.8 MW' : 'OFFLINE'}
        </text>
        {showTelemetryOverlay && isBus30Energized && q0_f3 && (
          <text x="0" y="112" textAnchor="middle" fill="#0284C7" fontSize="8" fontWeight="medium">
            114 A · cos φ 0.98
          </text>
        )}
      </g>
    </svg>
  );
};
