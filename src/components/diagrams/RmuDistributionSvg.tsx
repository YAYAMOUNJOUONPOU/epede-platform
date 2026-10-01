// src/components/diagrams/RmuDistributionSvg.tsx
import React from 'react';

interface RmuDistributionSvgProps {
  // RMU Incomer 1 (Ring Feeder Upstream)
  lbs1: boolean; // Load Break Switch 1
  q8_1: boolean; // Earth Switch 1

  // RMU Incomer 2 (Ring Feeder Downstream)
  lbs2: boolean; // Load Break Switch 2
  q8_2?: boolean; // Earth Switch 2
  q8_rmu2?: boolean;

  // RMU Transformer Feeder
  q0_trafo_mv: boolean; // Vacuum / SF6 Breaker
  q8_t: boolean; // Earth switch trafo

  // Low Voltage Incomer & Feeders
  q0_bt: boolean; // ACB Masterpact 400 V
  q0_bt_f1: boolean;
  q0_bt_f2: boolean;
  q0_bt_f3: boolean;

  // Potential and energized states
  isRing1_Energized: boolean;
  isRing2_Energized: boolean;
  isRmuBus_Energized: boolean;
  isDistTrafo_Energized: boolean;
  isTgbt_Energized: boolean;
  activeFault?: string | null;

  onToggle: (device: string) => void;
}

export const RmuDistributionSvg: React.FC<RmuDistributionSvgProps> = ({
  lbs1,
  q8_1,
  lbs2,
  q8_2,
  q0_trafo_mv,
  q8_t,
  q0_bt,
  q0_bt_f1,
  q0_bt_f2,
  q0_bt_f3,
  isRing1_Energized,
  isRing2_Energized,
  isRmuBus_Energized,
  isDistTrafo_Energized,
  isTgbt_Energized,
  activeFault = null,
  onToggle,
}) => {
  const colBus = isRmuBus_Energized ? '#0284C7' : '#94A3B8';
  const colBt = isTgbt_Energized ? '#D97706' : '#94A3B8';

  const isTrafoFault = activeFault === '87T' || activeFault === '49' || activeFault === '64R';
  const isMvFault = activeFault === '50N' || activeFault === '50_51';

  return (
    <svg viewBox="0 0 760 560" className="w-full max-w-3xl h-auto select-none font-mono">
      <defs>
        <filter id="rmu-fault-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="rmu-fault-burst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
          <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#EF4444" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Frame Outline: Enclosure RMU 36 kV SF6 / Vacuum (CEI 62271-200) */}
      <rect
        x="60"
        y="40"
        width="640"
        height="240"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        rx="12"
        className="shadow-xs"
      />
      <text x="80" y="62" fill="#0369A1" fontSize="11" fontWeight="bold">
        TABLEAU HTA COMPACT SOUS ENVELOPPE MÉTALLIQUE 36 kV (RMU - CEI 62271-200)
      </text>

      {/* Internal RMU Busbar 30 kV */}
      <line
        x1="120"
        y1="90"
        x2="640"
        y2="90"
        stroke={colBus}
        strokeWidth="5"
      />
      <text x="500" y="80" fill={colBus} fontSize="10" fontWeight="bold">
        JEU DE BARRES RMU 30 kV
      </text>

      {/* ---------------- CELLULE 1: ARRIVÉE BOUCLE AMONT (LBS 1) ---------------- */}
      <g transform="translate(180, 90)">
        <text x="0" y="30" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="bold">
          ARRIVÉE BOUCLE 1
        </text>

        {/* Vertical line to LBS1 */}
        <line x1="0" y1="0" x2="0" y2="35" stroke={colBus} strokeWidth="3" />

        {/* Interrupteur-Sectionneur LBS 1 */}
        <g onClick={() => onToggle('lbs1')} className="cursor-pointer" transform="translate(-18, 35)">
          <rect
            width="36"
            height="32"
            fill="#FFFFFF"
            stroke={lbs1 ? '#0284C7' : '#DC2626'}
            strokeWidth="2"
            rx="4"
            className="shadow-xs"
          />
          <text x="18" y="16" textAnchor="middle" fill={lbs1 ? '#0369A1' : '#DC2626'} fontSize="9" fontWeight="bold">
            LBS 1
          </text>
          <text x="18" y="26" textAnchor="middle" fill="#64748B" fontSize="7">
            {lbs1 ? 'FERMÉ' : 'OUVERT'}
          </text>
        </g>

        {/* Sectionneur de Terre Q8-1 */}
        <line x1="0" y1="67" x2="0" y2="105" stroke="#94A3B8" strokeWidth="2.5" />
        <g onClick={() => onToggle('q8_1')} className="cursor-pointer" transform="translate(25, 75)">
          <line x1="-25" y1="10" x2="-5" y2="10" stroke="#94A3B8" strokeWidth="2" />
          <rect width="28" height="20" fill="#FFFFFF" stroke={q8_1 ? '#059669' : '#CBD5E1'} strokeWidth="1.5" rx="3" />
          <text x="14" y="14" textAnchor="middle" fill={q8_1 ? '#059669' : '#64748B'} fontSize="8" fontWeight="bold">
            Q8-1
          </text>
          {/* Earth symbol */}
          <line x1="14" y1="20" x2="14" y2="26" stroke={q8_1 ? '#059669' : '#94A3B8'} strokeWidth="1.5" />
          <line x1="8" y1="26" x2="20" y2="26" stroke={q8_1 ? '#059669' : '#94A3B8'} strokeWidth="1.5" />
          <line x1="10" y1="29" x2="18" y2="29" stroke={q8_1 ? '#059669' : '#94A3B8'} strokeWidth="1" />
        </g>

        {/* Outgoing Ring Cable 1 */}
        <line
          x1="0"
          y1="105"
          x2="0"
          y2="210"
          stroke={isRing1_Energized ? '#0284C7' : '#94A3B8'}
          strokeWidth="3"
        />
        <circle cx="0" cy="210" r="4" fill={isRing1_Energized ? '#0284C7' : '#94A3B8'} />
        <text x="0" y="225" textAnchor="middle" fill="#0369A1" fontSize="9" fontWeight="bold">
          Câble HTA Amont
        </text>
        <text x="0" y="238" textAnchor="middle" fill="#64748B" fontSize="8">
          Poste Source 225/30 kV
        </text>
      </g>

      {/* ---------------- CELLULE 2: DÉPART BOUCLE AVAL (LBS 2) ---------------- */}
      <g transform="translate(380, 90)">
        <text x="0" y="30" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="bold">
          DÉPART BOUCLE 2
        </text>

        <line x1="0" y1="0" x2="0" y2="35" stroke={colBus} strokeWidth="3" />

        {/* LBS 2 */}
        <g onClick={() => onToggle('lbs2')} className="cursor-pointer" transform="translate(-18, 35)">
          <rect
            width="36"
            height="32"
            fill="#FFFFFF"
            stroke={lbs2 ? '#0284C7' : '#DC2626'}
            strokeWidth="2"
            rx="4"
            className="shadow-xs"
          />
          <text x="18" y="16" textAnchor="middle" fill={lbs2 ? '#0369A1' : '#DC2626'} fontSize="9" fontWeight="bold">
            LBS 2
          </text>
          <text x="18" y="26" textAnchor="middle" fill="#64748B" fontSize="7">
            {lbs2 ? 'FERMÉ' : 'OUVERT'}
          </text>
        </g>

        {/* Earth switch Q8-2 */}
        <line x1="0" y1="67" x2="0" y2="105" stroke="#94A3B8" strokeWidth="2.5" />
        <g onClick={() => onToggle('q8_2')} className="cursor-pointer" transform="translate(25, 75)">
          <line x1="-25" y1="10" x2="-5" y2="10" stroke="#94A3B8" strokeWidth="2" />
          <rect width="28" height="20" fill="#FFFFFF" stroke={q8_2 ? '#059669' : '#CBD5E1'} strokeWidth="1.5" rx="3" />
          <text x="14" y="14" textAnchor="middle" fill={q8_2 ? '#059669' : '#64748B'} fontSize="8" fontWeight="bold">
            Q8-2
          </text>
          <line x1="14" y1="20" x2="14" y2="26" stroke={q8_2 ? '#059669' : '#94A3B8'} strokeWidth="1.5" />
          <line x1="8" y1="26" x2="20" y2="26" stroke={q8_2 ? '#059669' : '#94A3B8'} strokeWidth="1.5" />
          <line x1="10" y1="29" x2="18" y2="29" stroke={q8_2 ? '#059669' : '#94A3B8'} strokeWidth="1" />
        </g>

        {/* Cable Downstream to next RMU */}
        <line
          x1="0"
          y1="105"
          x2="0"
          y2="210"
          stroke={isRing2_Energized ? '#0284C7' : '#94A3B8'}
          strokeWidth="3"
        />
        <circle cx="0" cy="210" r="4" fill={isRing2_Energized ? '#0284C7' : '#94A3B8'} />
        <text x="0" y="225" textAnchor="middle" fill="#0369A1" fontSize="9" fontWeight="bold">
          Câble HTA Aval
        </text>
        <text x="0" y="238" textAnchor="middle" fill="#64748B" fontSize="8">
          Vers Poste Suivant (Boucle)
        </text>
      </g>

      {/* ---------------- CELLULE 3: PROTECTION TRANSFORMATEUR HTA/BT ---------------- */}
      <g transform="translate(580, 90)">
        <text x="0" y="30" textAnchor="middle" fill="#0369A1" fontSize="9" fontWeight="bold">
          PROTECTION TRANSFO
        </text>

        <line x1="0" y1="0" x2="0" y2="30" stroke={colBus} strokeWidth="3" />

        {/* Circuit Breaker 52-T / VIP Relay */}
        <g onClick={() => onToggle('q0_trafo_mv')} className="cursor-pointer" transform="translate(-22, 30)">
          <rect
            width="44"
            height="34"
            fill="#FFFFFF"
            stroke={q0_trafo_mv ? '#0284C7' : '#DC2626'}
            strokeWidth="2"
            rx="5"
            className="shadow-xs"
          />
          <text x="22" y="15" textAnchor="middle" fill={q0_trafo_mv ? '#0369A1' : '#DC2626'} fontSize="9" fontWeight="bold">
            52-T
          </text>
          <text x="22" y="26" textAnchor="middle" fill="#64748B" fontSize="7">
            {q0_trafo_mv ? 'CLOSED' : 'OPEN'}
          </text>
        </g>

        {/* Sectionneur de terre Q8-T */}
        <line x1="0" y1="64" x2="0" y2="95" stroke="#94A3B8" strokeWidth="2.5" />
        <g onClick={() => onToggle('q8_t')} className="cursor-pointer" transform="translate(25, 68)">
          <line x1="-25" y1="10" x2="-5" y2="10" stroke="#94A3B8" strokeWidth="2" />
          <rect width="28" height="20" fill="#FFFFFF" stroke={q8_t ? '#059669' : '#CBD5E1'} strokeWidth="1.5" rx="3" />
          <text x="14" y="14" textAnchor="middle" fill={q8_t ? '#059669' : '#64748B'} fontSize="8" fontWeight="bold">
            Q8-T
          </text>
          <line x1="14" y1="20" x2="14" y2="26" stroke={q8_t ? '#059669' : '#94A3B8'} strokeWidth="1.5" />
          <line x1="8" y1="26" x2="20" y2="26" stroke={q8_t ? '#059669' : '#94A3B8'} strokeWidth="1.5" />
          <line x1="10" y1="29" x2="18" y2="29" stroke={q8_t ? '#059669' : '#94A3B8'} strokeWidth="1" />
        </g>

        {/* Connection out of RMU down to Distribution Transformer */}
        <line
          x1="0"
          y1="95"
          x2="0"
          y2="170"
          stroke={isDistTrafo_Energized ? '#0284C7' : '#94A3B8'}
          strokeWidth="3"
        />

        {/* Transformer Dual Circles (630 kVA 30 kV / 400 V Dyn11) */}
        <g transform="translate(0, 195)">
          <circle
            cx="0"
            cy="-12"
            r="16"
            fill="#FFFFFF"
            stroke={isDistTrafo_Energized ? '#0284C7' : '#94A3B8'}
            strokeWidth="2.5"
          />
          <circle
            cx="0"
            cy="12"
            r="16"
            fill="#FFFFFF"
            stroke={isDistTrafo_Energized ? '#D97706' : '#94A3B8'}
            strokeWidth="2.5"
          />
          <text x="24" y="-8" fill="#0369A1" fontSize="8" fontWeight="bold">30 kV</text>
          <text x="24" y="5" fill="#64748B" fontSize="7">630 kVA · Dyn11</text>
          <text x="24" y="18" fill="#D97706" fontSize="8" fontWeight="bold">400 V</text>

          {/* Fault Arc in Distribution Transformer */}
          {(isTrafoFault || isMvFault) && (
            <g className="animate-pulse pointer-events-none">
              <circle cx="0" cy="0" r="24" fill="url(#rmu-fault-burst)" opacity="0.9" />
              <polygon
                points="0,-16 5,-4 13,-6 4,3 9,14 -1,6 -9,11 -4,-1 -11,-7 -2,-6"
                fill="#FEF08A"
                stroke="#DC2626"
                strokeWidth="1.2"
                filter="url(#rmu-fault-glow)"
              />
              <rect x="-125" y="-12" width="115" height="24" rx="4" fill="#7F1D1D" fillOpacity="0.95" stroke="#F87171" strokeWidth="1.2" />
              <text x="-67" y="-1" textAnchor="middle" fill="#FEF08A" fontSize="7" fontWeight="bold">DÉFAUT HTA / BT</text>
              <text x="-67" y="7" textAnchor="middle" fill="#FCA5A5" fontSize="6.5" fontWeight="bold">ANSI {activeFault} · Déclenchement</text>
            </g>
          )}
        </g>
      </g>

      {/* ---------------- TGBT BASSE TENSION 400 V ---------------- */}
      {/* Position Y = 350 to 520 */}
      <rect
        x="60"
        y="330"
        width="640"
        height="200"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        rx="12"
        className="shadow-xs"
      />
      <text x="80" y="352" fill="#D97706" fontSize="11" fontWeight="bold">
        TABLEAU GÉNÉRAL BASSE TENSION 400 V (TGBT - CEI 61439-1/2)
      </text>

      {/* Down from Transformer to Main LV Circuit Breaker Q0-BT */}
      <line
        x1="580"
        y1="315"
        x2="580"
        y2="365"
        stroke={isDistTrafo_Energized ? '#D97706' : '#94A3B8'}
        strokeWidth="3"
      />

      {/* Disjoncteur Général BT (Masterpact 1000 A) */}
      <g onClick={() => onToggle('q0_bt')} className="cursor-pointer" transform="translate(555, 365)">
        <rect
          width="50"
          height="34"
          fill="#FFFFFF"
          stroke={q0_bt ? '#D97706' : '#DC2626'}
          strokeWidth="2"
          rx="5"
          className="shadow-xs"
        />
        <text x="25" y="15" textAnchor="middle" fill={q0_bt ? '#D97706' : '#DC2626'} fontSize="9" fontWeight="bold">
          Q0-BT
        </text>
        <text x="25" y="26" textAnchor="middle" fill="#64748B" fontSize="7">
          {q0_bt ? '1000A ON' : 'TRIP'}
        </text>
      </g>

      {/* Main LV Busbar 400 V */}
      <line
        x1="580"
        y1="399"
        x2="580"
        y2="425"
        stroke={isTgbt_Energized ? '#D97706' : '#94A3B8'}
        strokeWidth="3"
      />
      <line
        x1="120"
        y1="425"
        x2="640"
        y2="425"
        stroke={colBt}
        strokeWidth="5"
      />
      <text x="130" y="418" fill={colBt} fontSize="10" fontWeight="bold">
        JEU DE BARRES TGBT 400 V · {isTgbt_Energized ? '400 V / 230 V (50 Hz)' : '0 V'}
      </text>

      {/* Outgoing Feeder 1 (Atelier / Production) */}
      <g transform="translate(180, 425)">
        <line x1="0" y1="0" x2="0" y2="20" stroke={colBt} strokeWidth="2.5" />
        <g onClick={() => onToggle('q0_bt_f1')} className="cursor-pointer">
          <rect x="-16" y="20" width="32" height="26" fill="#FFFFFF" stroke={q0_bt_f1 ? '#D97706' : '#DC2626'} strokeWidth="1.5" rx="3" className="shadow-xs" />
          <text x="0" y="36" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="bold">F1</text>
        </g>
        <line x1="0" y1="46" x2="0" y2="65" stroke={isTgbt_Energized && q0_bt_f1 ? '#D97706' : '#94A3B8'} strokeWidth="2" />
        <text x="0" y="80" textAnchor="middle" fill="#64748B" fontSize="8">Départ Usine</text>
        <text x="0" y="92" textAnchor="middle" fill="#B45309" fontSize="8" fontWeight="bold">250 A · Compact NSX</text>
      </g>

      {/* Outgoing Feeder 2 (Bâtiment Administratif) */}
      <g transform="translate(340, 425)">
        <line x1="0" y1="0" x2="0" y2="20" stroke={colBt} strokeWidth="2.5" />
        <g onClick={() => onToggle('q0_bt_f2')} className="cursor-pointer">
          <rect x="-16" y="20" width="32" height="26" fill="#FFFFFF" stroke={q0_bt_f2 ? '#D97706' : '#DC2626'} strokeWidth="1.5" rx="3" className="shadow-xs" />
          <text x="0" y="36" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="bold">F2</text>
        </g>
        <line x1="0" y1="46" x2="0" y2="65" stroke={isTgbt_Energized && q0_bt_f2 ? '#D97706' : '#94A3B8'} strokeWidth="2" />
        <text x="0" y="80" textAnchor="middle" fill="#64748B" fontSize="8">Départ Tertiaire</text>
        <text x="0" y="92" textAnchor="middle" fill="#B45309" fontSize="8" fontWeight="bold">160 A · Compact NSX</text>
      </g>

      {/* Outgoing Feeder 3 (Éclairage & Auxiliaires) */}
      <g transform="translate(500, 425)">
        <line x1="0" y1="0" x2="0" y2="20" stroke={colBt} strokeWidth="2.5" />
        <g onClick={() => onToggle('q0_bt_f3')} className="cursor-pointer">
          <rect x="-16" y="20" width="32" height="26" fill="#FFFFFF" stroke={q0_bt_f3 ? '#D97706' : '#DC2626'} strokeWidth="1.5" rx="3" className="shadow-xs" />
          <text x="0" y="36" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="bold">F3</text>
        </g>
        <line x1="0" y1="46" x2="0" y2="65" stroke={isTgbt_Energized && q0_bt_f3 ? '#D97706' : '#94A3B8'} strokeWidth="2" />
        <text x="0" y="80" textAnchor="middle" fill="#64748B" fontSize="8">Éclairage / Auxiliaires</text>
        <text x="0" y="92" textAnchor="middle" fill="#B45309" fontSize="8" fontWeight="bold">63 A · Acti9</text>
      </g>
    </svg>
  );
};
