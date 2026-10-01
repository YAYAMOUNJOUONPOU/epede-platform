// src/components/diagrams/BreakerAndHalfSubstationSvg.tsx
import React from 'react';

interface BreakerAndHalfSubstationSvgProps {
  // Bus 1 side
  qs_bh_1a: boolean; // Bus 1 disconnect
  q0_bh_1: boolean;  // CB-1A (52-1A)
  qs_bh_1b: boolean; // Line 1 side disconnect of CB-1A
  q8_bh_cb1: boolean; // Earth switch for CB-1A maintenance

  // Feeder 1 (Ligne 1 Ouest - Mangombé)
  qs_bh_l1: boolean; // Line 1 disconnect
  q8_bh_1: boolean;  // Line 1 earth switch

  // Middle Tie
  qs_bh_m1: boolean; // Line 1 side disconnect of CB-M
  q0_bh_m: boolean;  // CB-M (52-M) Middle Tie Breaker
  qs_bh_m2: boolean; // Line 2 side disconnect of CB-M
  q8_bh_cbm: boolean; // Earth switch for CB-M maintenance

  // Feeder 2 (Ligne 2 Est - Nachtigal)
  qs_bh_l2: boolean; // Line 2 disconnect
  q8_bh_2: boolean;  // Line 2 earth switch

  // Bus 2 side
  qs_bh_2a: boolean; // Line 2 side disconnect of CB-2A
  q0_bh_2: boolean;  // CB-2A (52-2A)
  qs_bh_2b: boolean; // Bus 2 disconnect
  q8_bh_cb2: boolean; // Earth switch for CB-2A maintenance

  // Energized potential states
  isBus1_Energized: boolean;
  isBus2_Energized: boolean;
  isLine1_Energized: boolean;
  isLine2_Energized: boolean;
  isNode1_Energized: boolean;
  isNode2_Energized: boolean;
  isCbmPath_Energized: boolean;

  // Interaction handlers
  onToggle: (device: string) => void;
  locale: 'fr' | 'en';
  activeFault?: string | null;
}

export const BreakerAndHalfSubstationSvg: React.FC<BreakerAndHalfSubstationSvgProps> = ({
  qs_bh_1a,
  q0_bh_1,
  qs_bh_1b,
  q8_bh_cb1,
  qs_bh_l1,
  q8_bh_1,
  qs_bh_m1,
  q0_bh_m,
  qs_bh_m2,
  q8_bh_cbm,
  qs_bh_l2,
  q8_bh_2,
  qs_bh_2a,
  q0_bh_2,
  qs_bh_2b,
  q8_bh_cb2,
  isBus1_Energized,
  isBus2_Energized,
  isLine1_Energized,
  isLine2_Energized,
  isNode1_Energized,
  isNode2_Energized,
  isCbmPath_Energized,
  onToggle,
  locale,
  activeFault = null,
}) => {
  const colBus1 = isBus1_Energized ? '#0284C7' : '#94A3B8';
  const colBus2 = isBus2_Energized ? '#4F46E5' : '#94A3B8';
  const colLine1 = isLine1_Energized ? '#059669' : '#94A3B8';
  const colLine2 = isLine2_Energized ? '#D97706' : '#94A3B8';
  const colNode1 = isNode1_Energized ? '#0284C7' : '#94A3B8';
  const colNode2 = isNode2_Energized ? '#4F46E5' : '#94A3B8';
  const colCbm = isCbmPath_Energized ? '#7C3AED' : '#94A3B8';

  const isLineFault = activeFault === '50_51' || activeFault === '21';
  const isBreakerFailure = activeFault === '50BF';
  const isTrafoFault = activeFault === '87T' || activeFault === '49' || activeFault === '64R';

  return (
    <svg viewBox="0 0 880 660" className="w-full max-w-4xl h-auto select-none font-mono">
      <defs>
        <filter id="bh-fault-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="bh-fault-burst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
          <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#EF4444" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background Schema Grid Canvas */}
      <rect x="0" y="0" width="880" height="660" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" rx="12" />

      {/* Substation Header Label */}
      <text x="35" y="32" fill="#0F172A" fontSize="13" fontWeight="bold" letterSpacing="0.05em">
        {locale === 'fr' 
          ? 'POSTE 225 kV SCHÉMA À UN DISJONCTEUR ET DEMI (1-1/2 CB) · CEI 61936-1 / IEEE C37.100'
          : '225 kV SUBSTATION BREAKER-AND-A-HALF (1-1/2 CB) SCHEME · IEC 61936-1 / IEEE C37.100'}
      </text>
      <text x="35" y="48" fill="#64748B" fontSize="10">
        {locale === 'fr'
          ? 'Architecture à haute disponibilité : 2 jeux de barres, 3 disjoncteurs par diamètre, 2 départs indépendants'
          : 'High-availability scheme: 2 main busbars, 3 circuit breakers per diameter bay, 2 independent circuits'}
      </text>

      {/* ========================================================================= */}
      {/* 1. TOP BUSBAR: JEU DE BARRES 1 (BUS 1 - 225 kV) */}
      {/* ========================================================================= */}
      <line
        x1="60"
        y1="85"
        x2="820"
        y2="85"
        stroke={colBus1}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="60" cy="85" r="4" fill={colBus1} />
      <circle cx="820" cy="85" r="4" fill={colBus1} />
      <text x="70" y="75" fill={colBus1} fontSize="11" fontWeight="bold">
        JEU DE BARRES 1 (225 kV) · {isBus1_Energized ? '225.0 kV' : '0.0 kV'}
      </text>
      <text x="730" y="75" fill="#64748B" fontSize="9" textAnchor="end">
        {isBus1_Energized ? 'SOUS TENSION (NORMAL)' : 'HORS TENSION'}
      </text>

      {/* ========================================================================= */}
      {/* 2. BOTTOM BUSBAR: JEU DE BARRES 2 (BUS 2 - 225 kV) */}
      {/* ========================================================================= */}
      <line
        x1="60"
        y1="575"
        x2="820"
        y2="575"
        stroke={colBus2}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="60" cy="575" r="4" fill={colBus2} />
      <circle cx="820" cy="575" r="4" fill={colBus2} />
      <text x="70" y="595" fill={colBus2} fontSize="11" fontWeight="bold">
        JEU DE BARRES 2 (225 kV) · {isBus2_Energized ? '225.0 kV' : '0.0 kV'}
      </text>
      <text x="730" y="595" fill="#64748B" fontSize="9" textAnchor="end">
        {isBus2_Energized ? 'SOUS TENSION (NORMAL)' : 'HORS TENSION'}
      </text>

      {/* ========================================================================= */}
      {/* MAIN DIAMETER (BAY 1) CENTRAL AXIS: X = 440 */}
      {/* ========================================================================= */}

      {/* Bus 1 Tap node to CB-1A */}
      <line x1="440" y1="85" x2="440" y2="120" stroke={colBus1} strokeWidth="3" />
      <circle cx="440" cy="85" r="4" fill={colBus1} />

      {/* SECTIONNEUR BARRE 1: QS_1A */}
      <g className="cursor-pointer" onClick={() => onToggle('qs_bh_1a')}>
        <circle cx="440" cy="120" r="3" fill="#94A3B8" />
        <circle cx="440" cy="150" r="3" fill="#94A3B8" />
        {qs_bh_1a ? (
          <line x1="440" y1="120" x2="440" y2="150" stroke={colBus1} strokeWidth="3" />
        ) : (
          <line x1="440" y1="120" x2="455" y2="135" stroke="#DC2626" strokeWidth="3" />
        )}
        <rect x="460" y="125" width="85" height="18" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="465" y="138" fill={qs_bh_1a ? '#0369A1' : '#DC2626'} fontSize="9" fontWeight="bold">
          QS-1A [{qs_bh_1a ? 'FERMÉ' : 'OUVERT'}]
        </text>
      </g>

      {/* Line between QS_1A and CB-1A */}
      <line x1="440" y1="150" x2="440" y2="175" stroke={qs_bh_1a && isBus1_Energized ? colBus1 : '#94A3B8'} strokeWidth="3" />

      {/* DISJONCTEUR 1A: 52-1A (CB-1) */}
      <g className="cursor-pointer" onClick={() => onToggle('q0_bh_1')}>
        {/* CB Box */}
        <rect
          x="420"
          y="175"
          width="40"
          height="32"
          rx="6"
          fill="#FFFFFF"
          stroke={q0_bh_1 ? '#0284C7' : '#DC2626'}
          strokeWidth="2"
          className="shadow-xs"
        />
        <text x="440" y="195" fill={q0_bh_1 ? '#0369A1' : '#DC2626'} fontSize="10" fontWeight="bold" textAnchor="middle">
          52-1A
        </text>
        <text x="350" y="195" fill={q0_bh_1 ? '#0369A1' : '#DC2626'} fontSize="9" fontWeight="bold" textAnchor="end">
          DJ 1 (Barres 1) [{q0_bh_1 ? 'FERMÉ' : 'OUVERT'}]
        </text>
      </g>

      {/* Breaker Failure (50BF) Arc Flash on 52-1A */}
      {isBreakerFailure && (
        <g transform="translate(440, 191)" className="animate-pulse pointer-events-none">
          <circle cx="0" cy="0" r="28" fill="url(#bh-fault-burst)" opacity="0.95" />
          <polygon
            points="0,-22 7,-6 18,-8 5,4 12,20 -2,8 -14,16 -6,-2 -16,-10 -3,-8"
            fill="#FEF08A"
            stroke="#DC2626"
            strokeWidth="1.5"
            filter="url(#bh-fault-glow)"
          />
          <rect x="30" y="-12" width="130" height="26" rx="4" fill="#7F1D1D" fillOpacity="0.95" stroke="#F87171" strokeWidth="1.5" />
          <text x="36" y="0" fill="#FEF08A" fontSize="7.5" fontWeight="bold">REFUS D&apos;OUVERTURE DJ</text>
          <text x="36" y="9" fill="#FCA5A5" fontSize="7" fontWeight="bold">ANSI 50BF · Déclenchement Amont</text>
        </g>
      )}

      {/* Line between CB-1A and QS_1B */}
      <line x1="440" y1="207" x2="440" y2="230" stroke={colNode1} strokeWidth="3" />

      {/* SECTIONNEUR D'ISOLEMENT 1B: QS_1B */}
      <g className="cursor-pointer" onClick={() => onToggle('qs_bh_1b')}>
        <circle cx="440" cy="230" r="3" fill="#94A3B8" />
        <circle cx="440" cy="260" r="3" fill="#94A3B8" />
        {qs_bh_1b ? (
          <line x1="440" y1="230" x2="440" y2="260" stroke={colNode1} strokeWidth="3" />
        ) : (
          <line x1="440" y1="230" x2="455" y2="245" stroke="#DC2626" strokeWidth="3" />
        )}
        <rect x="460" y="235" width="85" height="18" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="465" y="248" fill={qs_bh_1b ? '#0369A1' : '#DC2626'} fontSize="9" fontWeight="bold">
          QS-1B [{qs_bh_1b ? 'FERMÉ' : 'OUVERT'}]
        </text>
      </g>

      {/* Earth switch for CB-1A Maintenance (Q8_CB1) */}
      <g className="cursor-pointer" onClick={() => onToggle('q8_bh_cb1')}>
        <line x1="420" y1="191" x2="395" y2="191" stroke="#94A3B8" strokeWidth="2" strokeDasharray="2 2" />
        {q8_bh_cb1 ? (
          <line x1="395" y1="191" x2="380" y2="191" stroke="#DC2626" strokeWidth="2.5" />
        ) : (
          <line x1="395" y1="191" x2="385" y2="180" stroke="#059669" strokeWidth="2.5" />
        )}
        <line x1="380" y1="184" x2="380" y2="198" stroke="#DC2626" strokeWidth="2" />
        <line x1="375" y1="187" x2="375" y2="195" stroke="#DC2626" strokeWidth="1.5" />
        <text x="365" y="178" fill={q8_bh_cb1 ? '#DC2626' : '#64748B'} fontSize="8" fontWeight="bold" textAnchor="end">
          MALT DJ1
        </text>
      </g>

      {/* ========================================================================= */}
      {/* NODE 1: TAP FOR CIRCUIT 1 (LIGNE 1 OUEST - 225 kV) */}
      {/* ========================================================================= */}
      <circle cx="440" cy="275" r="5" fill={colNode1} />
      <line x1="440" y1="260" x2="440" y2="290" stroke={colNode1} strokeWidth="3" />

      {/* Circuit 1 Branch: Runs horizontally to the left (X: 440 -> 100) */}
      <line x1="440" y1="275" x2="300" y2="275" stroke={colNode1} strokeWidth="3" />

      {/* Sectionneur Ligne 1: QS_L1 */}
      <g className="cursor-pointer" onClick={() => onToggle('qs_bh_l1')}>
        <circle cx="300" cy="275" r="3" fill="#94A3B8" />
        <circle cx="265" cy="275" r="3" fill="#94A3B8" />
        {qs_bh_l1 ? (
          <line x1="300" y1="275" x2="265" y2="275" stroke={colLine1} strokeWidth="3" />
        ) : (
          <line x1="300" y1="275" x2="280" y2="260" stroke="#DC2626" strokeWidth="3" />
        )}
        <text x="282" y="255" fill={qs_bh_l1 ? '#059669' : '#DC2626'} fontSize="9" fontWeight="bold" textAnchor="middle">
          QS-L1 [{qs_bh_l1 ? 'F' : 'O'}]
        </text>
      </g>

      {/* Continuing line towards line termination */}
      <line x1="265" y1="275" x2="160" y2="275" stroke={colLine1} strokeWidth="3" />

      {/* Line 1 Fault Arc */}
      {isLineFault && (
        <g transform="translate(190, 275)" className="animate-pulse pointer-events-none">
          <circle cx="0" cy="0" r="26" fill="url(#bh-fault-burst)" opacity="0.9" />
          <polygon
            points="0,-20 6,-5 16,-7 5,3 10,18 -2,7 -12,14 -5,-2 -14,-9 -2,-7"
            fill="#FEF08A"
            stroke="#EF4444"
            strokeWidth="1.5"
            filter="url(#bh-fault-glow)"
          />
          <rect x="-60" y="-36" width="120" height="24" rx="4" fill="#7F1D1D" fillOpacity="0.95" stroke="#F87171" strokeWidth="1.5" />
          <text x="0" y="-24" textAnchor="middle" fill="#FEF08A" fontSize="7.5" fontWeight="bold">DÉFAUT LIGNE 1</text>
          <text x="0" y="-15" textAnchor="middle" fill="#FCA5A5" fontSize="7" fontWeight="bold">ANSI {activeFault} · Ik&apos;&apos; = 14.8 kA</text>
        </g>
      )}

      {/* Earth switch Line 1: Q8_1 */}
      <g className="cursor-pointer" onClick={() => onToggle('q8_bh_1')}>
        <line x1="220" y1="275" x2="220" y2="295" stroke="#94A3B8" strokeWidth="2" />
        {q8_bh_1 ? (
          <line x1="220" y1="295" x2="220" y2="310" stroke="#DC2626" strokeWidth="2.5" />
        ) : (
          <line x1="220" y1="295" x2="232" y2="305" stroke="#059669" strokeWidth="2.5" />
        )}
        {/* Ground symbol */}
        <line x1="210" y1="310" x2="230" y2="310" stroke="#DC2626" strokeWidth="2" />
        <line x1="214" y1="314" x2="226" y2="314" stroke="#DC2626" strokeWidth="1.5" />
        <line x1="218" y1="318" x2="222" y2="318" stroke="#DC2626" strokeWidth="1" />
        <text x="205" y="305" fill={q8_bh_1 ? '#DC2626' : '#64748B'} fontSize="8" fontWeight="bold" textAnchor="end">
          Q8-L1
        </text>
      </g>

      {/* Surge Arrester Line 1 (ZnO) */}
      <g>
        <line x1="185" y1="275" x2="185" y2="290" stroke="#0284C7" strokeWidth="1.5" />
        <rect x="179" y="290" width="12" height="18" fill="#F8FAFC" stroke="#0284C7" strokeWidth="1.5" rx="2" />
        <line x1="182" y1="295" x2="188" y2="303" stroke="#0284C7" strokeWidth="1.5" />
        <line x1="185" y1="308" x2="185" y2="316" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="180" y1="316" x2="190" y2="316" stroke="#94A3B8" strokeWidth="1.5" />
        <text x="175" y="330" fill="#0369A1" fontSize="7.5" textAnchor="middle">
          SA1 (ZnO)
        </text>
      </g>

      {/* Line 1 Nameplate Banner */}
      <rect x="60" y="260" width="100" height="30" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
      <text x="110" y="275" fill="#065F46" fontSize="9" fontWeight="bold" textAnchor="middle">
        LIGNE 1 OUEST
      </text>
      <text x="110" y="286" fill="#059669" fontSize="8" textAnchor="middle">
        Vers Mangombé / Douala
      </text>

      {/* ========================================================================= */}
      {/* 3. MIDDLE TIE SECTION: CB-M (52-M DISJONCTEUR CENTRAL) */}
      {/* ========================================================================= */}

      {/* Line between Node 1 and QS_M1 */}
      <line x1="440" y1="290" x2="440" y2="305" stroke={colNode1} strokeWidth="3" />

      {/* Sectionneur QS_M1 */}
      <g className="cursor-pointer" onClick={() => onToggle('qs_bh_m1')}>
        <circle cx="440" cy="305" r="3" fill="#94A3B8" />
        <circle cx="440" cy="335" r="3" fill="#94A3B8" />
        {qs_bh_m1 ? (
          <line x1="440" y1="305" x2="440" y2="335" stroke={colCbm} strokeWidth="3" />
        ) : (
          <line x1="440" y1="305" x2="455" y2="320" stroke="#DC2626" strokeWidth="3" />
        )}
        <rect x="460" y="310" width="85" height="18" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="465" y="323" fill={qs_bh_m1 ? '#7C3AED' : '#DC2626'} fontSize="9" fontWeight="bold">
          QS-M1 [{qs_bh_m1 ? 'FERMÉ' : 'OUVERT'}]
        </text>
      </g>

      {/* Line to CB-M */}
      <line x1="440" y1="335" x2="440" y2="350" stroke={colCbm} strokeWidth="3" />

      {/* DISJONCTEUR CENTRAL 52-M (CB-M TIE BREAKER) */}
      <g className="cursor-pointer" onClick={() => onToggle('q0_bh_m')}>
        <rect
          x="420"
          y="350"
          width="40"
          height="32"
          rx="6"
          fill="#FFFFFF"
          stroke={q0_bh_m ? '#7C3AED' : '#DC2626'}
          strokeWidth="2"
          className="shadow-xs"
        />
        <text x="440" y="370" fill={q0_bh_m ? '#7C3AED' : '#DC2626'} fontSize="10" fontWeight="bold" textAnchor="middle">
          52-M
        </text>
        <text x="350" y="370" fill={q0_bh_m ? '#7C3AED' : '#DC2626'} fontSize="9" fontWeight="bold" textAnchor="end">
          DJ CENTRAL (Tie) [{q0_bh_m ? 'FERMÉ' : 'OUVERT'}]
        </text>
      </g>

      {/* Line between CB-M and QS_M2 */}
      <line x1="440" y1="382" x2="440" y2="397" stroke={colCbm} strokeWidth="3" />

      {/* Sectionneur QS_M2 */}
      <g className="cursor-pointer" onClick={() => onToggle('qs_bh_m2')}>
        <circle cx="440" cy="397" r="3" fill="#94A3B8" />
        <circle cx="440" cy="427" r="3" fill="#94A3B8" />
        {qs_bh_m2 ? (
          <line x1="440" y1="397" x2="440" y2="427" stroke={colNode2} strokeWidth="3" />
        ) : (
          <line x1="440" y1="397" x2="455" y2="412" stroke="#DC2626" strokeWidth="3" />
        )}
        <rect x="460" y="402" width="85" height="18" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="465" y="415" fill={qs_bh_m2 ? '#7C3AED' : '#DC2626'} fontSize="9" fontWeight="bold">
          QS-M2 [{qs_bh_m2 ? 'FERMÉ' : 'OUVERT'}]
        </text>
      </g>

      {/* Earth switch for CB-M Maintenance (Q8_CBM) */}
      <g className="cursor-pointer" onClick={() => onToggle('q8_bh_cbm')}>
        <line x1="420" y1="366" x2="395" y2="366" stroke="#94A3B8" strokeWidth="2" strokeDasharray="2 2" />
        {q8_bh_cbm ? (
          <line x1="395" y1="366" x2="380" y2="366" stroke="#DC2626" strokeWidth="2.5" />
        ) : (
          <line x1="395" y1="366" x2="385" y2="355" stroke="#059669" strokeWidth="2.5" />
        )}
        <line x1="380" y1="359" x2="380" y2="373" stroke="#DC2626" strokeWidth="2" />
        <line x1="375" y1="362" x2="375" y2="370" stroke="#DC2626" strokeWidth="1.5" />
        <text x="365" y="353" fill={q8_bh_cbm ? '#DC2626' : '#64748B'} fontSize="8" fontWeight="bold" textAnchor="end">
          MALT DJ-M
        </text>
      </g>

      {/* ========================================================================= */}
      {/* NODE 2: TAP FOR CIRCUIT 2 (LIGNE 2 EST - 225 kV NACHTIGAL) */}
      {/* ========================================================================= */}
      <circle cx="440" cy="437" r="5" fill={colNode2} />
      <line x1="440" y1="427" x2="440" y2="447" stroke={colNode2} strokeWidth="3" />

      {/* Circuit 2 Branch: Runs horizontally to the right (X: 440 -> 780) */}
      <line x1="440" y1="437" x2="580" y2="437" stroke={colNode2} strokeWidth="3" />

      {/* Sectionneur Ligne 2: QS_L2 */}
      <g className="cursor-pointer" onClick={() => onToggle('qs_bh_l2')}>
        <circle cx="580" cy="437" r="3" fill="#94A3B8" />
        <circle cx="615" cy="437" r="3" fill="#94A3B8" />
        {qs_bh_l2 ? (
          <line x1="580" y1="437" x2="615" y2="437" stroke={colLine2} strokeWidth="3" />
        ) : (
          <line x1="580" y1="437" x2="600" y2="422" stroke="#DC2626" strokeWidth="3" />
        )}
        <text x="597" y="417" fill={qs_bh_l2 ? '#D97706' : '#DC2626'} fontSize="9" fontWeight="bold" textAnchor="middle">
          QS-L2 [{qs_bh_l2 ? 'F' : 'O'}]
        </text>
      </g>

      {/* Continuing line towards line termination */}
      <line x1="615" y1="437" x2="720" y2="437" stroke={colLine2} strokeWidth="3" />

      {/* Earth switch Line 2: Q8_2 */}
      <g className="cursor-pointer" onClick={() => onToggle('q8_bh_2')}>
        <line x1="660" y1="437" x2="660" y2="457" stroke="#94A3B8" strokeWidth="2" />
        {q8_bh_2 ? (
          <line x1="660" y1="457" x2="660" y2="472" stroke="#DC2626" strokeWidth="2.5" />
        ) : (
          <line x1="660" y1="457" x2="672" y2="467" stroke="#059669" strokeWidth="2.5" />
        )}
        <line x1="650" y1="472" x2="670" y2="472" stroke="#DC2626" strokeWidth="2" />
        <line x1="654" y1="476" x2="666" y2="476" stroke="#DC2626" strokeWidth="1.5" />
        <text x="645" y="467" fill={q8_bh_2 ? '#DC2626' : '#64748B'} fontSize="8" fontWeight="bold" textAnchor="end">
          Q8-L2
        </text>
      </g>

      {/* Surge Arrester Line 2 (ZnO) */}
      <g>
        <line x1="695" y1="437" x2="695" y2="452" stroke="#D97706" strokeWidth="1.5" />
        <rect x="689" y="452" width="12" height="18" fill="#F8FAFC" stroke="#D97706" strokeWidth="1.5" rx="2" />
        <line x1="692" y1="457" x2="698" y2="465" stroke="#D97706" strokeWidth="1.5" />
        <line x1="695" y1="470" x2="695" y2="478" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="690" y1="478" x2="700" y2="478" stroke="#94A3B8" strokeWidth="1.5" />
        <text x="705" y="492" fill="#B45309" fontSize="7.5" textAnchor="middle">
          SA2 (ZnO)
        </text>
      </g>

      {/* Line 2 Nameplate Banner */}
      <rect x="720" y="422" width="115" height="30" rx="6" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5" />
      <text x="777" y="437" fill="#92400E" fontSize="9" fontWeight="bold" textAnchor="middle">
        LIGNE 2 EST
      </text>
      <text x="777" y="448" fill="#D97706" fontSize="8" textAnchor="middle">
        Vers Nachtigal / Yaoundé
      </text>

      {/* ========================================================================= */}
      {/* 4. BOTTOM BREAKER SECTION: 52-2A (CB-2A BARRES 2) */}
      {/* ========================================================================= */}

      {/* Line between Node 2 and QS_2A */}
      <line x1="440" y1="447" x2="440" y2="465" stroke={colNode2} strokeWidth="3" />

      {/* Sectionneur d'isolement QS_2A */}
      <g className="cursor-pointer" onClick={() => onToggle('qs_bh_2a')}>
        <circle cx="440" cy="465" r="3" fill="#94A3B8" />
        <circle cx="440" cy="495" r="3" fill="#94A3B8" />
        {qs_bh_2a ? (
          <line x1="440" y1="465" x2="440" y2="495" stroke={colNode2} strokeWidth="3" />
        ) : (
          <line x1="440" y1="465" x2="455" y2="480" stroke="#DC2626" strokeWidth="3" />
        )}
        <rect x="460" y="470" width="85" height="18" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="465" y="483" fill={qs_bh_2a ? '#4338CA' : '#DC2626'} fontSize="9" fontWeight="bold">
          QS-2A [{qs_bh_2a ? 'FERMÉ' : 'OUVERT'}]
        </text>
      </g>

      {/* Line to CB-2A */}
      <line x1="440" y1="495" x2="440" y2="510" stroke={colNode2} strokeWidth="3" />

      {/* DISJONCTEUR 2A: 52-2A (CB-2) */}
      <g className="cursor-pointer" onClick={() => onToggle('q0_bh_2')}>
        <rect
          x="420"
          y="510"
          width="40"
          height="32"
          rx="6"
          fill="#FFFFFF"
          stroke={q0_bh_2 ? '#4F46E5' : '#DC2626'}
          strokeWidth="2"
          className="shadow-xs"
        />
        <text x="440" y="530" fill={q0_bh_2 ? '#4338CA' : '#DC2626'} fontSize="10" fontWeight="bold" textAnchor="middle">
          52-2A
        </text>
        <text x="350" y="530" fill={q0_bh_2 ? '#4338CA' : '#DC2626'} fontSize="9" fontWeight="bold" textAnchor="end">
          DJ 2 (Barres 2) [{q0_bh_2 ? 'FERMÉ' : 'OUVERT'}]
        </text>
      </g>

      {/* Line between CB-2A and QS_2B */}
      <line x1="440" y1="542" x2="440" y2="550" stroke={colBus2} strokeWidth="3" />

      {/* Sectionneur Barres 2: QS_2B */}
      <g className="cursor-pointer" onClick={() => onToggle('qs_bh_2b')}>
        <circle cx="440" cy="550" r="3" fill="#94A3B8" />
        <circle cx="440" cy="575" r="3" fill="#94A3B8" />
        {qs_bh_2b ? (
          <line x1="440" y1="550" x2="440" y2="575" stroke={colBus2} strokeWidth="3" />
        ) : (
          <line x1="440" y1="550" x2="455" y2="562" stroke="#DC2626" strokeWidth="3" />
        )}
        <rect x="460" y="545" width="85" height="18" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="465" y="558" fill={qs_bh_2b ? '#4338CA' : '#DC2626'} fontSize="9" fontWeight="bold">
          QS-2B [{qs_bh_2b ? 'FERMÉ' : 'OUVERT'}]
        </text>
      </g>

      {/* Earth switch for CB-2A Maintenance (Q8_CB2) */}
      <g className="cursor-pointer" onClick={() => onToggle('q8_bh_cb2')}>
        <line x1="420" y1="526" x2="395" y2="526" stroke="#94A3B8" strokeWidth="2" strokeDasharray="2 2" />
        {q8_bh_cb2 ? (
          <line x1="395" y1="526" x2="380" y2="526" stroke="#DC2626" strokeWidth="2.5" />
        ) : (
          <line x1="395" y1="526" x2="385" y2="515" stroke="#059669" strokeWidth="2.5" />
        )}
        <line x1="380" y1="519" x2="380" y2="533" stroke="#DC2626" strokeWidth="2" />
        <line x1="375" y1="522" x2="375" y2="530" stroke="#DC2626" strokeWidth="1.5" />
        <text x="365" y="513" fill={q8_bh_cb2 ? '#DC2626' : '#64748B'} fontSize="8" fontWeight="bold" textAnchor="end">
          MALT DJ2
        </text>
      </g>

      {/* ========================================================================= */}
      {/* 5. LIVE FLOW STATUS BADGES & LEGEND (RIGHT PANEL) */}
      {/* ========================================================================= */}
      <g transform="translate(640, 110)">
        <rect width="215" height="235" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" className="shadow-xs" />
        
        <text x="15" y="24" fill="#0F172A" fontSize="11" fontWeight="bold">
          {locale === 'fr' ? 'ÉTAT DES CHEMINS & FLUX' : 'PATH & FLOW STATES'}
        </text>

        {/* Bus 1 feed status */}
        <circle cx="22" cy="48" r="4" fill={isBus1_Energized ? '#0284C7' : '#DC2626'} />
        <text x="34" y="52" fill="#334155" fontSize="9.5">
          Jeu de Barres 1 : {isBus1_Energized ? '225 kV ACTIF' : '0 kV ISOLÉ'}
        </text>

        {/* Bus 2 feed status */}
        <circle cx="22" cy="74" r="4" fill={isBus2_Energized ? '#4F46E5' : '#DC2626'} />
        <text x="34" y="78" fill="#334155" fontSize="9.5">
          Jeu de Barres 2 : {isBus2_Energized ? '225 kV ACTIF' : '0 kV ISOLÉ'}
        </text>

        {/* Line 1 feed status */}
        <circle cx="22" cy="100" r="4" fill={isLine1_Energized ? '#059669' : '#DC2626'} />
        <text x="34" y="104" fill="#334155" fontSize="9.5">
          Ligne 1 (Mangombé) : {isLine1_Energized ? 'SOUS TENSION' : 'DÉCLENCHÉE'}
        </text>

        {/* Line 2 feed status */}
        <circle cx="22" cy="126" r="4" fill={isLine2_Energized ? '#D97706' : '#DC2626'} />
        <text x="34" y="130" fill="#334155" fontSize="9.5">
          Ligne 2 (Nachtigal) : {isLine2_Energized ? 'SOUS TENSION' : 'DÉCLENCHÉE'}
        </text>

        {/* Tie Breaker status */}
        <circle cx="22" cy="152" r="4" fill={q0_bh_m ? '#7C3AED' : '#94A3B8'} />
        <text x="34" y="156" fill="#334155" fontSize="9.5">
          Disjoncteur Tie 52-M : {q0_bh_m ? 'FERMÉ (COUPLEUR)' : 'OUVERT'}
        </text>

        {/* Reliability callout */}
        <rect x="12" y="172" width="191" height="52" rx="5" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="18" y="187" fill="#0369A1" fontSize="8.5" fontWeight="bold">
          {locale === 'fr' ? 'Avantage Clé Schéma 1-1/2 :' : 'Key 1-1/2 Breaker Advantage:'}
        </text>
        <text x="18" y="200" fill="#475569" fontSize="8">
          {locale === 'fr'
            ? 'Perte d\'une barre = ZÉRO coupure.'
            : 'Loss of one bus = ZERO outage.'}
        </text>
        <text x="18" y="212" fill="#475569" fontSize="8">
          {locale === 'fr'
            ? 'Entretien d\'un disjoncteur sans arrêt.'
            : 'Breaker maintenance with zero drop.'}
        </text>
      </g>
    </svg>
  );
};
