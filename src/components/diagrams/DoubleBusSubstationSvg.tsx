// src/components/diagrams/DoubleBusSubstationSvg.tsx
import React from 'react';

interface DoubleBusSubstationSvgProps {
  // Bus Coupler bay
  qs_bc1: boolean;
  q0_bc: boolean;
  qs_bc2: boolean;

  // Feeder 1 (Songloulou Incomer)
  qs1_a: boolean;
  qs1_b: boolean;
  q0_1: boolean;
  qs1_line: boolean;
  q8_1: boolean; // Earth switch

  // Feeder 2 (Yaoundé Feeder)
  qs2_a: boolean;
  qs2_b: boolean;
  q0_2: boolean;
  qs2_line: boolean;
  q8_2: boolean; // Earth switch

  // Transformer bay
  qst_a: boolean;
  qst_b: boolean;
  q0_t: boolean;

  // Interaction handlers
  onToggle: (device: string) => void;

  // Potential states
  isBusA_Energized: boolean;
  isBusB_Energized: boolean;
  isLine1_Energized: boolean;
  isLine2_Energized: boolean;
  isTrafo_Energized: boolean;
  showTelemetryOverlay?: boolean;
  activeFault?: string | null;
}

export const DoubleBusSubstationSvg: React.FC<DoubleBusSubstationSvgProps> = ({
  qs_bc1,
  q0_bc,
  qs_bc2,
  qs1_a,
  qs1_b,
  q0_1,
  qs1_line,
  q8_1,
  qs2_a,
  qs2_b,
  q0_2,
  qs2_line,
  q8_2,
  qst_a,
  qst_b,
  q0_t,
  onToggle,
  isBusA_Energized,
  isBusB_Energized,
  isLine1_Energized,
  isLine2_Energized,
  isTrafo_Energized,
  showTelemetryOverlay = true,
  activeFault = null,
}) => {
  const colBusA = isBusA_Energized ? '#0284C7' : '#94A3B8';
  const colBusB = isBusB_Energized ? '#4F46E5' : '#94A3B8';

  const isLineFault = activeFault === '50_51' || activeFault === '21';
  const isTrafoFault = activeFault === '87T' || activeFault === '49' || activeFault === '64R';

  return (
    <svg viewBox="0 0 760 560" className="w-full max-w-3xl h-auto select-none font-mono">
      <defs>
        <filter id="db-fault-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="db-fault-burst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
          <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#EF4444" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* ---------------- 225 kV BUSBAR A (MAIN BUS 1) ---------------- */}
      <line
        x1="60"
        y1="90"
        x2="700"
        y2="90"
        stroke={colBusA}
        strokeWidth="6"
      />
      <text x="70" y="80" fill={colBusA} fontSize="11" fontWeight="bold">
        JEU DE BARRES 1 (225 kV) · {isBusA_Energized ? '225.0 kV' : '0.0 kV'}
      </text>

      {/* ---------------- 225 kV BUSBAR B (RESERVE BUS 2) ---------------- */}
      <line
        x1="60"
        y1="160"
        x2="700"
        y2="160"
        stroke={colBusB}
        strokeWidth="6"
      />
      <text x="70" y="150" fill={colBusB} fontSize="11" fontWeight="bold">
        JEU DE BARRES 2 (225 kV) · {isBusB_Energized ? '225.0 kV' : '0.0 kV'}
      </text>

      {/* ---------------- 1. TRAVÉE DE COUPLAGE (BUS COUPLER 52-BC) ---------------- */}
      {/* Position X = 160 */}
      <g transform="translate(160, 0)">
        <text x="0" y="30" textAnchor="middle" fill="#475569" fontSize="10" fontWeight="bold">
          COUPLAGE 52-BC
        </text>

        {/* Vertical tie from Bus A down through Disconnector BC1 */}
        <line x1="0" y1="90" x2="0" y2="105" stroke={colBusA} strokeWidth="3" />

        {/* QS-BC1 */}
        <g onClick={() => onToggle('qs_bc1')} className="cursor-pointer" transform="translate(-15, 105)">
          <rect width="30" height="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" rx="4" />
          <text x="15" y="14" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">QS-1</text>
          <line
            x1="15"
            y1="0"
            x2={qs_bc1 ? 15 : 24}
            y2={qs_bc1 ? 20 : 10}
            stroke={qs_bc1 ? '#0284C7' : '#DC2626'}
            strokeWidth="2.5"
          />
        </g>

        {/* Circuit Breaker 52-BC */}
        <line x1="0" y1="125" x2="0" y2="175" stroke="#94A3B8" strokeWidth="2.5" />
        <g onClick={() => onToggle('q0_bc')} className="cursor-pointer" transform="translate(-25, 185)">
          <rect
            width="50"
            height="36"
            fill="#FFFFFF"
            stroke={q0_bc ? '#0284C7' : '#DC2626'}
            strokeWidth="2"
            rx="6"
            className="shadow-xs"
          />
          <text x="25" y="16" textAnchor="middle" fill={q0_bc ? '#0369A1' : '#DC2626'} fontSize="10" fontWeight="bold">
            52-BC
          </text>
          <text x="25" y="28" textAnchor="middle" fill="#64748B" fontSize="8" fontWeight="medium">
            {q0_bc ? 'CLOSED' : 'OPEN'}
          </text>
          <circle cx="42" cy="8" r="3" fill={q0_bc ? '#059669' : '#DC2626'} />
        </g>

        {/* QS-BC2 to Bus B */}
        <line x1="0" y1="221" x2="0" y2="235" stroke="#94A3B8" strokeWidth="2.5" />
        <g onClick={() => onToggle('qs_bc2')} className="cursor-pointer" transform="translate(-15, 235)">
          <rect width="30" height="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" rx="4" />
          <text x="15" y="14" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">QS-2</text>
          <line
            x1="15"
            y1="0"
            x2={qs_bc2 ? 15 : 24}
            y2={qs_bc2 ? 20 : 10}
            stroke={qs_bc2 ? '#4F46E5' : '#DC2626'}
            strokeWidth="2.5"
          />
        </g>
        {/* Connection to Bus B */}
        <line x1="0" y1="160" x2="0" y2="235" stroke={colBusB} strokeWidth="3" />
      </g>

      {/* ---------------- 2. ARRIVÉE LIGNE 1 (SONGLOULOU 225 kV) ---------------- */}
      {/* Position X = 330 */}
      <g transform="translate(330, 0)">
        <text x="0" y="30" textAnchor="middle" fill="#0369A1" fontSize="10" fontWeight="bold">
          ARRIVÉE L1 SONGLOULOU
        </text>

        {/* Selector QS1-A (to Bus A) */}
        <line x1="-20" y1="90" x2="-20" y2="110" stroke={colBusA} strokeWidth="3" />
        <g onClick={() => onToggle('qs1_a')} className="cursor-pointer" transform="translate(-35, 110)">
          <rect width="30" height="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" rx="4" />
          <text x="15" y="14" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">QS1-A</text>
          <line
            x1="15"
            y1="0"
            x2={qs1_a ? 15 : 24}
            y2={qs1_a ? 20 : 10}
            stroke={qs1_a ? '#0284C7' : '#DC2626'}
            strokeWidth="2.5"
          />
        </g>

        {/* Selector QS1-B (to Bus B) */}
        <line x1="20" y1="160" x2="20" y2="180" stroke={colBusB} strokeWidth="3" />
        <g onClick={() => onToggle('qs1_b')} className="cursor-pointer" transform="translate(5, 180)">
          <rect width="30" height="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" rx="4" />
          <text x="15" y="14" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">QS1-B</text>
          <line
            x1="15"
            y1="0"
            x2={qs1_b ? 15 : 24}
            y2={qs1_b ? 20 : 10}
            stroke={qs1_b ? '#4F46E5' : '#DC2626'}
            strokeWidth="2.5"
          />
        </g>

        {/* Node converging to Circuit Breaker 52-1 */}
        <path d="M -20 130 L -20 220 L 0 240 L 20 220 L 20 200" fill="none" stroke="#94A3B8" strokeWidth="2.5" />
        <line x1="0" y1="240" x2="0" y2="260" stroke="#94A3B8" strokeWidth="2.5" />

        {/* Circuit Breaker 52-1 */}
        <g onClick={() => onToggle('q0_1')} className="cursor-pointer" transform="translate(-25, 260)">
          <rect
            width="50"
            height="36"
            fill="#FFFFFF"
            stroke={q0_1 ? '#0284C7' : '#DC2626'}
            strokeWidth="2"
            rx="6"
            className="shadow-xs"
          />
          <text x="25" y="16" textAnchor="middle" fill={q0_1 ? '#0369A1' : '#DC2626'} fontSize="10" fontWeight="bold">
            52-1
          </text>
          <text x="25" y="28" textAnchor="middle" fill="#64748B" fontSize="8" fontWeight="medium">
            {q0_1 ? 'CLOSED' : 'OPEN'}
          </text>
          <circle cx="42" cy="8" r="3" fill={q0_1 ? '#059669' : '#DC2626'} />
        </g>

        {/* Line Disconnector QS1-L */}
        <line x1="0" y1="296" x2="0" y2="320" stroke="#94A3B8" strokeWidth="2.5" />
        <g onClick={() => onToggle('qs1_line')} className="cursor-pointer" transform="translate(-15, 320)">
          <rect width="30" height="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" rx="4" />
          <text x="15" y="14" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">QS-L1</text>
          <line
            x1="15"
            y1="0"
            x2={qs1_line ? 15 : 24}
            y2={qs1_line ? 20 : 10}
            stroke={qs1_line ? '#0284C7' : '#DC2626'}
            strokeWidth="2.5"
          />
        </g>

        {/* Earth Switch Q8-1 (Sectionneur de terre) */}
        <g onClick={() => onToggle('q8_1')} className="cursor-pointer" transform="translate(25, 350)">
          <line x1="-25" y1="10" x2="-5" y2="10" stroke="#94A3B8" strokeWidth="2" />
          <rect width="26" height="18" fill="#FFFFFF" stroke={q8_1 ? '#059669' : '#94A3B8'} strokeWidth="1.5" rx="4" />
          <text x="13" y="13" textAnchor="middle" fill={q8_1 ? '#059669' : '#64748B'} fontSize="8" fontWeight="bold">
            Q8-1
          </text>
          {/* Earth symbol */}
          <line x1="13" y1="18" x2="13" y2="24" stroke="#059669" strokeWidth="2" />
          <line x1="7" y1="24" x2="19" y2="24" stroke="#059669" strokeWidth="2" />
          <line x1="9" y1="27" x2="17" y2="27" stroke="#059669" strokeWidth="1.5" />
          <line x1="11" y1="30" x2="15" y2="30" stroke="#059669" strokeWidth="1" />
        </g>

        {/* Line outgoing connection */}
        <line
          x1="0"
          y1="340"
          x2="0"
          y2="420"
          stroke={isLine1_Energized ? '#0284C7' : '#94A3B8'}
          strokeWidth="3"
        />

        {/* Line 1 Fault Arc */}
        {isLineFault && (
          <g transform="translate(0, 380)" className="animate-pulse pointer-events-none">
            <circle cx="0" cy="0" r="26" fill="url(#db-fault-burst)" opacity="0.9" />
            <polygon
              points="0,-20 6,-5 16,-7 5,3 10,18 -2,7 -12,14 -5,-2 -14,-9 -2,-7"
              fill="#FEF08A"
              stroke="#EF4444"
              strokeWidth="1.5"
              filter="url(#db-fault-glow)"
            />
            <rect x="18" y="-12" width="124" height="26" rx="4" fill="#7F1D1D" fillOpacity="0.95" stroke="#F87171" strokeWidth="1.5" />
            <text x="24" y="0" fill="#FEF08A" fontSize="7.5" fontWeight="bold">COURT-CIRCUIT LIGNE 1</text>
            <text x="24" y="9" fill="#FCA5A5" fontSize="7" fontWeight="bold">ANSI {activeFault} · Ik&apos;&apos; = 14.8 kA</text>
          </g>
        )}

        <circle cx="0" cy="420" r="4" fill={isLine1_Energized ? '#0284C7' : '#94A3B8'} />
        <text x="0" y="440" textAnchor="middle" fill="#0369A1" fontSize="10" fontWeight="bold">
          Source 225 kV Songloulou
        </text>
        <text x="0" y="455" textAnchor="middle" fill="#64748B" fontSize="9">
          Ligne Aérienne 225 kV (240 km)
        </text>

        {/* Live SCADA Telemetry Badge L1 */}
        {showTelemetryOverlay && (
          <g transform="translate(-60, 465)" className="filter drop-shadow-xs">
            <rect width="120" height="34" rx="4" fill="#0F172A" fillOpacity="0.9" stroke="#38BDF8" strokeWidth="1" />
            <text x="6" y="13" fill="#38BDF8" fontSize="8" fontWeight="bold">L1 SONGLOULOU</text>
            <circle cx="108" cy="10" r="3" fill={isLine1_Energized ? '#10B981' : '#EF4444'} />
            <text x="6" y="26" fill="#F8FAFC" fontSize="8">
              {isLine1_Energized ? '225.4 kV · 48.5 MW · 128 A' : '0.0 kV · HORS TENSION'}
            </text>
          </g>
        )}
      </g>

      {/* ---------------- 3. DÉPART LIGNE 2 (YAOUNDÉ AHALA 225 kV) ---------------- */}
      {/* Position X = 500 */}
      <g transform="translate(500, 0)">
        <text x="0" y="30" textAnchor="middle" fill="#4338CA" fontSize="10" fontWeight="bold">
          DÉPART L2 YAOUNDÉ
        </text>

        {/* Selector QS2-A (to Bus A) */}
        <line x1="-20" y1="90" x2="-20" y2="110" stroke={colBusA} strokeWidth="3" />
        <g onClick={() => onToggle('qs2_a')} className="cursor-pointer" transform="translate(-35, 110)">
          <rect width="30" height="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" rx="4" />
          <text x="15" y="14" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">QS2-A</text>
          <line
            x1="15"
            y1="0"
            x2={qs2_a ? 15 : 24}
            y2={qs2_a ? 20 : 10}
            stroke={qs2_a ? '#0284C7' : '#DC2626'}
            strokeWidth="2.5"
          />
        </g>

        {/* Selector QS2-B (to Bus B) */}
        <line x1="20" y1="160" x2="20" y2="180" stroke={colBusB} strokeWidth="3" />
        <g onClick={() => onToggle('qs2_b')} className="cursor-pointer" transform="translate(5, 180)">
          <rect width="30" height="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" rx="4" />
          <text x="15" y="14" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">QS2-B</text>
          <line
            x1="15"
            y1="0"
            x2={qs2_b ? 15 : 24}
            y2={qs2_b ? 20 : 10}
            stroke={qs2_b ? '#4F46E5' : '#DC2626'}
            strokeWidth="2.5"
          />
        </g>

        {/* Node converging to Circuit Breaker 52-2 */}
        <path d="M -20 130 L -20 220 L 0 240 L 20 220 L 20 200" fill="none" stroke="#94A3B8" strokeWidth="2.5" />
        <line x1="0" y1="240" x2="0" y2="260" stroke="#94A3B8" strokeWidth="2.5" />

        {/* Circuit Breaker 52-2 */}
        <g onClick={() => onToggle('q0_2')} className="cursor-pointer" transform="translate(-25, 260)">
          <rect
            width="50"
            height="36"
            fill="#FFFFFF"
            stroke={q0_2 ? '#0284C7' : '#DC2626'}
            strokeWidth="2"
            rx="6"
            className="shadow-xs"
          />
          <text x="25" y="16" textAnchor="middle" fill={q0_2 ? '#0369A1' : '#DC2626'} fontSize="10" fontWeight="bold">
            52-2
          </text>
          <text x="25" y="28" textAnchor="middle" fill="#64748B" fontSize="8" fontWeight="medium">
            {q0_2 ? 'CLOSED' : 'OPEN'}
          </text>
          <circle cx="42" cy="8" r="3" fill={q0_2 ? '#059669' : '#DC2626'} />
        </g>

        {/* Line Disconnector QS2-L */}
        <line x1="0" y1="296" x2="0" y2="320" stroke="#94A3B8" strokeWidth="2.5" />
        <g onClick={() => onToggle('qs2_line')} className="cursor-pointer" transform="translate(-15, 320)">
          <rect width="30" height="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" rx="4" />
          <text x="15" y="14" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">QS-L2</text>
          <line
            x1="15"
            y1="0"
            x2={qs2_line ? 15 : 24}
            y2={qs2_line ? 20 : 10}
            stroke={qs2_line ? '#4F46E5' : '#DC2626'}
            strokeWidth="2.5"
          />
        </g>

        {/* Earth Switch Q8-2 */}
        <g onClick={() => onToggle('q8_2')} className="cursor-pointer" transform="translate(25, 350)">
          <line x1="-25" y1="10" x2="-5" y2="10" stroke="#94A3B8" strokeWidth="2" />
          <rect width="26" height="18" fill="#FFFFFF" stroke={q8_2 ? '#059669' : '#94A3B8'} strokeWidth="1.5" rx="4" />
          <text x="13" y="13" textAnchor="middle" fill={q8_2 ? '#059669' : '#64748B'} fontSize="8" fontWeight="bold">
            Q8-2
          </text>
          <line x1="13" y1="18" x2="13" y2="24" stroke="#059669" strokeWidth="2" />
          <line x1="7" y1="24" x2="19" y2="24" stroke="#059669" strokeWidth="2" />
          <line x1="9" y1="27" x2="17" y2="27" stroke="#059669" strokeWidth="1.5" />
          <line x1="11" y1="30" x2="15" y2="30" stroke="#059669" strokeWidth="1" />
        </g>

        {/* Outgoing to Ahala */}
        <line
          x1="0"
          y1="340"
          x2="0"
          y2="420"
          stroke={isLine2_Energized ? '#4F46E5' : '#94A3B8'}
          strokeWidth="3"
        />
        <circle cx="0" cy="420" r="4" fill={isLine2_Energized ? '#4F46E5' : '#94A3B8'} />
        <text x="0" y="440" textAnchor="middle" fill="#4338CA" fontSize="10" fontWeight="bold">
          Départ Ahala Yaoundé
        </text>
        <text x="0" y="455" textAnchor="middle" fill="#64748B" fontSize="9">
          Transit 225 kV · {isLine2_Energized ? '65.4 MW' : '0.0 MW'}
        </text>

        {/* Live SCADA Telemetry Badge L2 */}
        {showTelemetryOverlay && (
          <g transform="translate(-60, 465)" className="filter drop-shadow-xs">
            <rect width="120" height="34" rx="4" fill="#0F172A" fillOpacity="0.9" stroke="#818CF8" strokeWidth="1" />
            <text x="6" y="13" fill="#818CF8" fontSize="8" fontWeight="bold">L2 AHALA YAOUNDE</text>
            <circle cx="108" cy="10" r="3" fill={isLine2_Energized ? '#10B981' : '#EF4444'} />
            <text x="6" y="26" fill="#F8FAFC" fontSize="8">
              {isLine2_Energized ? '224.8 kV · 65.4 MW · 172 A' : '0.0 kV · HORS TENSION'}
            </text>
          </g>
        )}
      </g>

      {/* ---------------- 4. TRAVÉE TRANSFORMATEUR (TR1 225/30 kV) ---------------- */}
      {/* Position X = 650 */}
      <g transform="translate(650, 0)">
        <text x="0" y="30" textAnchor="middle" fill="#D97706" fontSize="10" fontWeight="bold">
          TRANSFO TR1 63 MVA
        </text>

        {/* Selector QST-A */}
        <line x1="-20" y1="90" x2="-20" y2="110" stroke={colBusA} strokeWidth="3" />
        <g onClick={() => onToggle('qst_a')} className="cursor-pointer" transform="translate(-35, 110)">
          <rect width="30" height="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" rx="4" />
          <text x="15" y="14" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">QST-A</text>
          <line
            x1="15"
            y1="0"
            x2={qst_a ? 15 : 24}
            y2={qst_a ? 20 : 10}
            stroke={qst_a ? '#0284C7' : '#DC2626'}
            strokeWidth="2.5"
          />
        </g>

        {/* Selector QST-B */}
        <line x1="20" y1="160" x2="20" y2="180" stroke={colBusB} strokeWidth="3" />
        <g onClick={() => onToggle('qst_b')} className="cursor-pointer" transform="translate(5, 180)">
          <rect width="30" height="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" rx="4" />
          <text x="15" y="14" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold">QST-B</text>
          <line
            x1="15"
            y1="0"
            x2={qst_b ? 15 : 24}
            y2={qst_b ? 20 : 10}
            stroke={qst_b ? '#4F46E5' : '#DC2626'}
            strokeWidth="2.5"
          />
        </g>

        {/* Node converging to Trafo Breaker 52-T */}
        <path d="M -20 130 L -20 220 L 0 240 L 20 220 L 20 200" fill="none" stroke="#94A3B8" strokeWidth="2.5" />
        <line x1="0" y1="240" x2="0" y2="260" stroke="#94A3B8" strokeWidth="2.5" />

        {/* Circuit Breaker 52-T */}
        <g onClick={() => onToggle('q0_t')} className="cursor-pointer" transform="translate(-25, 260)">
          <rect
            width="50"
            height="36"
            fill="#FFFFFF"
            stroke={q0_t ? '#0284C7' : '#DC2626'}
            strokeWidth="2"
            rx="6"
            className="shadow-xs"
          />
          <text x="25" y="16" textAnchor="middle" fill={q0_t ? '#0369A1' : '#DC2626'} fontSize="10" fontWeight="bold">
            52-T
          </text>
          <text x="25" y="28" textAnchor="middle" fill="#64748B" fontSize="8" fontWeight="medium">
            {q0_t ? 'CLOSED' : 'OPEN'}
          </text>
          <circle cx="42" cy="8" r="3" fill={q0_t ? '#059669' : '#DC2626'} />
        </g>

        {/* Transformer Dual Circles */}
        <line x1="0" y1="296" x2="0" y2="330" stroke="#94A3B8" strokeWidth="2.5" />
        <g transform="translate(0, 355)">
          <circle
            cx="0"
            cy="-12"
            r="18"
            fill="none"
            stroke={isTrafo_Energized ? '#0284C7' : '#94A3B8'}
            strokeWidth="2.5"
          />
          <circle
            cx="0"
            cy="12"
            r="18"
            fill="none"
            stroke={isTrafo_Energized ? '#D97706' : '#94A3B8'}
            strokeWidth="2.5"
          />
          <text x="28" y="2" fill="#B45309" fontSize="9" fontWeight="bold">YNd11</text>
        </g>

        {/* Transformer Internal Fault Arc */}
        {isTrafoFault && (
          <g transform="translate(0, 355)" className="animate-pulse pointer-events-none">
            <circle cx="0" cy="0" r="28" fill="url(#db-fault-burst)" opacity="0.95" />
            <polygon
              points="0,-22 7,-6 18,-8 5,4 12,20 -2,8 -14,16 -6,-2 -16,-10 -3,-8"
              fill="#FEF08A"
              stroke="#DC2626"
              strokeWidth="1.5"
              filter="url(#db-fault-glow)"
            />
            <rect x="-140" y="-35" width="130" height="26" rx="4" fill="#7F1D1D" fillOpacity="0.95" stroke="#F87171" strokeWidth="1.5" />
            <text x="-75" y="-23" textAnchor="middle" fill="#FEF08A" fontSize="7.5" fontWeight="bold">DÉFAUT TRANSFO TR1</text>
            <text x="-75" y="-13" textAnchor="middle" fill="#FCA5A5" fontSize="7" fontWeight="bold">ANSI {activeFault} · Idiff = 1.45 kA</text>
          </g>
        )}

        <line
          x1="0"
          y1="385"
          x2="0"
          y2="420"
          stroke={isTrafo_Energized ? '#D97706' : '#94A3B8'}
          strokeWidth="3"
        />
        <circle cx="0" cy="420" r="4" fill={isTrafo_Energized ? '#D97706' : '#94A3B8'} />
        <text x="0" y="440" textAnchor="middle" fill="#B45309" fontSize="10" fontWeight="bold">
          Vers Rames HTA 30 kV
        </text>
        <text x="0" y="455" textAnchor="middle" fill="#64748B" fontSize="9">
          63 MVA · Uk = 12.5%
        </text>

        {/* Live SCADA Telemetry Badge TR1 */}
        {showTelemetryOverlay && (
          <g transform="translate(-60, 465)" className="filter drop-shadow-xs">
            <rect width="120" height="34" rx="4" fill="#0F172A" fillOpacity="0.9" stroke="#F59E0B" strokeWidth="1" />
            <text x="6" y="13" fill="#F59E0B" fontSize="8" fontWeight="bold">TR1 63 MVA</text>
            <circle cx="108" cy="10" r="3" fill={isTrafo_Energized ? '#10B981' : '#EF4444'} />
            <text x="6" y="26" fill="#F8FAFC" fontSize="8">
              {isTrafo_Energized ? '42.3 MW · HV 109 A · 30.1 kV' : '0.0 MW · HORS SERVICE'}
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
