// src/components/journey/ElectricalSldSvg.tsx
import React from 'react';
import { StageId } from './types';

interface ElectricalSldSvgProps {
  locale: 'fr' | 'en';
  activeStage: StageId;
  onSelectStage: (stage: StageId) => void;
  onSelectEquipment: (equipmentId: string) => void;
  isFlowActive: boolean;
  animationSpeed: number;
}

export const ElectricalSldSvg: React.FC<ElectricalSldSvgProps> = ({
  locale,
  activeStage,
  onSelectStage,
  onSelectEquipment,
  isFlowActive,
  animationSpeed,
}) => {
  const dashSpeedSec = isFlowActive ? (3 / animationSpeed) : 0;

  return (
    <div className="relative w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 overflow-hidden shadow-xs">
      {/* Upper Title and Engineering Note */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-amber-800 font-bold uppercase">
            {locale === 'fr' ? 'SCHÉMA UNIFILAIRE DE PUISSANCE (CEI 60617 / IEEE)' : 'POWER SINGLE-LINE DIAGRAM (IEC 60617 / IEEE)'}
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          {locale === 'fr' ? 'Valeurs d\'ingénierie illustratives (50 Hz)' : 'Illustrative engineering parameters (50 Hz)'}
        </span>
      </div>

      <svg
        viewBox="0 0 1200 480"
        className="w-full h-auto select-none"
        style={{ filter: 'drop-shadow(0 2px 6px rgba(15,23,42,0.05))' }}
      >
        <defs>
          <style>
            {`
              @keyframes sldFlow {
                from { stroke-dashoffset: 40; }
                to { stroke-dashoffset: 0; }
              }
              .sld-bus-flow {
                stroke-dasharray: 6 4;
                animation: ${isFlowActive ? `sldFlow ${dashSpeedSec}s linear infinite` : 'none'};
              }
            `}
          </style>
        </defs>

        {/* ---------------- 1. GENERATOR BUSBAR & UNIT (15 kV) ---------------- */}
        <g 
          className="cursor-pointer"
          onClick={() => {
            onSelectStage('generation');
            onSelectEquipment('eq-generator');
          }}
        >
          {/* Alternator G01 */}
          <circle cx="90" cy="380" r="30" fill="#FFFBEB" stroke="#D97706" strokeWidth="3" />
          <text x="76" y="388" fill="#B45309" fontSize="22" fontWeight="bold" fontFamily="monospace">
            G
          </text>
          <text x="65" y="430" fill="#0F172A" fontSize="10" fontWeight="bold" fontFamily="monospace">
            GEN 01
          </text>
          <text x="50" y="445" fill="#64748B" fontSize="9" fontFamily="monospace">
            150 MVA · 15 kV
          </text>

          {/* Neutral Grounding Resistor / Earthing */}
          <line x1="90" y1="410" x2="90" y2="455" stroke="#64748B" strokeWidth="2" />
          <rect x="84" y="425" width="12" height="18" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" />
          <line x1="82" y1="455" x2="98" y2="455" stroke="#64748B" strokeWidth="2" />
          <line x1="85" y1="459" x2="95" y2="459" stroke="#64748B" strokeWidth="1.5" />
          <line x1="88" y1="463" x2="92" y2="463" stroke="#64748B" strokeWidth="1" />
        </g>

        {/* Current Transformers on Gen Terminals */}
        <g transform="translate(90, 310)">
          <circle cx="0" cy="0" r="8" fill="none" stroke="#0284C7" strokeWidth="1.5" />
          <text x="12" y="4" fill="#0369A1" fontSize="8" fontFamily="monospace" fontWeight="bold">
            TC 6000/1A
          </text>
        </g>

        {/* Generator Protection Relay 87G / 64S */}
        <g 
          transform="translate(30, 290)"
          className="cursor-pointer"
          onClick={() => onSelectEquipment('eq-gen-relay')}
        >
          <rect x="0" y="0" width="45" height="40" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" rx="2" />
          <text x="6" y="16" fill="#B45309" fontSize="9" fontWeight="bold" fontFamily="monospace">
            87G
          </text>
          <text x="6" y="28" fill="#64748B" fontSize="8" fontFamily="monospace">
            64S/40
          </text>
          {/* Connecting signal line */}
          <line x1="45" y1="20" x2="82" y2="20" stroke="#D97706" strokeWidth="1" strokeDasharray="2 2" />
        </g>

        {/* Generator Circuit Breaker (GCB) 15 kV */}
        <g 
          transform="translate(90, 240)"
          className="cursor-pointer"
          onClick={() => onSelectEquipment('eq-gen-breaker')}
        >
          <rect x="-12" y="-12" width="24" height="24" fill="#FFFFFF" stroke="#059669" strokeWidth="2" rx="2" />
          <line x1="-8" y1="-8" x2="8" y2="8" stroke="#059669" strokeWidth="2.5" />
          <text x="16" y="4" fill="#0F172A" fontSize="9" fontWeight="bold" fontFamily="monospace">
            GCB 15kV
          </text>
        </g>

        {/* Bus Connection Line 15 kV */}
        <line x1="90" y1="350" x2="90" y2="180" stroke="#D97706" strokeWidth="3" className="sld-bus-flow" />

        {/* ---------------- 2. GSU STEP-UP TRANSFORMER (15 / 225 kV) ---------------- */}
        <g 
          transform="translate(90, 140)"
          className="cursor-pointer"
          onClick={() => {
            onSelectStage('switchyard');
            onSelectEquipment('eq-gsu-trafo');
          }}
        >
          {/* Primary Delta / Secondary Wye */}
          <circle cx="0" cy="15" r="18" fill="none" stroke="#D97706" strokeWidth="2.5" />
          <circle cx="0" cy="-15" r="18" fill="none" stroke="#4F46E5" strokeWidth="2.5" />
          <text x="-4" y="20" fill="#B45309" fontSize="10" fontWeight="bold">
            Δ
          </text>
          <text x="-3" y="-10" fill="#4338CA" fontSize="10" fontWeight="bold">
            Y
          </text>
          <text x="24" y="-5" fill="#0F172A" fontSize="9" fontWeight="bold" fontFamily="monospace">
            TR-GSU 01
          </text>
          <text x="24" y="8" fill="#64748B" fontSize="8" fontFamily="monospace">
            15 / 225 kV · YNd11
          </text>
        </g>

        {/* Connection to 225 kV Substation Yard */}
        <line x1="90" y1="105" x2="90" y2="70" stroke="#4F46E5" strokeWidth="3.5" className="sld-bus-flow" />
        <line x1="90" y1="70" x2="220" y2="70" stroke="#4F46E5" strokeWidth="3.5" className="sld-bus-flow" />

        {/* ---------------- 3. SWITCHYARD 225 kV BUSBARS & BAY ---------------- */}
        {/* Main Busbar 1 (225 kV) */}
        <line x1="220" y1="50" x2="380" y2="50" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" />
        <text x="225" y="42" fill="#4338CA" fontSize="9" fontWeight="bold" fontFamily="monospace">
          JDB 1 (225 kV)
        </text>

        {/* Main Busbar 2 (225 kV) */}
        <line x1="220" y1="70" x2="380" y2="70" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" />
        <text x="225" y="85" fill="#4338CA" fontSize="9" fontWeight="bold" fontFamily="monospace">
          JDB 2 (225 kV)
        </text>

        {/* Disconnector 225 kV */}
        <g transform="translate(290, 110)">
          <circle cx="0" cy="-20" r="3" fill="#4F46E5" />
          <circle cx="0" cy="15" r="3" fill="#4F46E5" />
          <line x1="0" y1="-20" x2="8" y2="12" stroke="#4F46E5" strokeWidth="2" />
          <text x="12" y="0" fill="#64748B" fontSize="8" fontFamily="monospace">
            DS-225
          </text>
        </g>

        {/* 225 kV Circuit Breaker */}
        <g 
          transform="translate(290, 160)"
          className="cursor-pointer"
          onClick={() => onSelectEquipment('eq-hv-breaker')}
        >
          <rect x="-14" y="-14" width="28" height="28" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2" rx="2" />
          <line x1="-8" y1="-8" x2="8" y2="8" stroke="#059669" strokeWidth="2.5" />
          <text x="18" y="4" fill="#4338CA" fontSize="9" fontWeight="bold" fontFamily="monospace">
            DJ-225 (SF6)
          </text>
        </g>

        {/* Surge Arrester */}
        <g 
          transform="translate(350, 160)"
          className="cursor-pointer"
          onClick={() => onSelectEquipment('eq-surge-arrester-hv')}
        >
          <line x1="-40" y1="0" x2="0" y2="0" stroke="#4F46E5" strokeWidth="2" />
          <rect x="-6" y="-10" width="12" height="20" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
          <line x1="0" y1="10" x2="0" y2="25" stroke="#64748B" strokeWidth="1.5" />
          <line x1="-8" y1="25" x2="8" y2="25" stroke="#64748B" strokeWidth="2" />
          <line x1="-5" y1="29" x2="5" y2="29" stroke="#64748B" strokeWidth="1.5" />
          <text x="8" y="0" fill="#B45309" fontSize="8" fontFamily="monospace" fontWeight="bold">
            ZnO
          </text>
        </g>

        {/* Bay feed down to Transmission Line */}
        <line x1="290" y1="70" x2="290" y2="90" stroke="#4F46E5" strokeWidth="3" />
        <line x1="290" y1="125" x2="290" y2="146" stroke="#4F46E5" strokeWidth="3" />
        <line x1="290" y1="174" x2="290" y2="220" stroke="#4F46E5" strokeWidth="3" />
        <line x1="290" y1="220" x2="450" y2="220" stroke="#4F46E5" strokeWidth="3.5" className="sld-bus-flow" />

        {/* ---------------- 4. TRANSMISSION LINE (225 kV) ---------------- */}
        <g 
          className="cursor-pointer"
          onClick={() => onSelectStage('transmission')}
        >
          {/* Transmission Line Impedance Symbol (Z = R + jX) */}
          <line x1="450" y1="220" x2="510" y2="220" stroke="#4F46E5" strokeWidth="3.5" />
          <rect x="510" y="212" width="60" height="16" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.5" />
          <text x="518" y="224" fill="#4338CA" fontSize="8" fontWeight="bold" fontFamily="monospace">
            Z_line 85km
          </text>
          <line x1="570" y1="220" x2="630" y2="220" stroke="#4F46E5" strokeWidth="3.5" className="sld-bus-flow" />

          {/* Distance Protection Relay (ANSI 21) */}
          <g 
            transform="translate(480, 250)"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-distance-relay');
            }}
          >
            <rect x="0" y="0" width="45" height="30" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.5" rx="2" />
            <text x="8" y="18" fill="#4338CA" fontSize="10" fontWeight="bold" fontFamily="monospace">
              21 / 21N
            </text>
            <line x1="22" y1="0" x2="22" y2="-30" stroke="#4F46E5" strokeWidth="1" strokeDasharray="2 2" />
          </g>
        </g>

        {/* ---------------- 5. GRID SUBSTATION (225 / 30 kV) ---------------- */}
        <g 
          className="cursor-pointer"
          onClick={() => onSelectStage('substation')}
        >
          {/* Incoming 225 kV Substation Breaker */}
          <g transform="translate(650, 220)">
            <rect x="-12" y="-12" width="24" height="24" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2" rx="2" />
            <line x1="-7" y1="-7" x2="7" y2="7" stroke="#059669" strokeWidth="2" />
          </g>

          <line x1="662" y1="220" x2="720" y2="220" stroke="#4F46E5" strokeWidth="3" />

          {/* Step-Down Autotransformer with OLTC */}
          <g 
            transform="translate(740, 220)"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelectEquipment('eq-stepdown-trafo');
            }}
          >
            <circle cx="-14" cy="0" r="18" fill="none" stroke="#4F46E5" strokeWidth="2.5" />
            <circle cx="14" cy="0" r="18" fill="none" stroke="#2563EB" strokeWidth="2.5" />
            {/* Arrow indicating OLTC */}
            <line x1="-12" y1="18" x2="16" y2="-18" stroke="#0284C7" strokeWidth="2" />
            <polygon points="18,-18 10,-17 17,-10" fill="#0284C7" />
            <text x="-32" y="32" fill="#0F172A" fontSize="9" fontWeight="bold" fontFamily="monospace">
              TR-225/30kV
            </text>
            <text x="-24" y="44" fill="#64748B" fontSize="8" fontFamily="monospace">
              OLTC ±10%
            </text>
          </g>

          {/* Differential Relay 87T */}
          <g transform="translate(718, 140)">
            <rect x="0" y="0" width="44" height="28" fill="#FFFFFF" stroke="#2563EB" strokeWidth="1.5" rx="2" />
            <text x="8" y="18" fill="#1D4ED8" fontSize="10" fontWeight="bold" fontFamily="monospace">
              87T
            </text>
          </g>

          {/* 30 kV Outgoing Breaker */}
          <line x1="772" y1="220" x2="810" y2="220" stroke="#2563EB" strokeWidth="3" className="sld-bus-flow" />
          <g transform="translate(825, 220)">
            <rect x="-12" y="-12" width="24" height="24" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" rx="2" />
            <line x1="-7" y1="-7" x2="7" y2="7" stroke="#059669" strokeWidth="2" />
            <text x="-16" y="24" fill="#1D4ED8" fontSize="8" fontFamily="monospace" fontWeight="bold">
              DJ-30kV
            </text>
          </g>
        </g>

        {/* ---------------- 6. 30 kV DISTRIBUTION BUSBAR & FEEDER ---------------- */}
        <line x1="860" y1="160" x2="860" y2="340" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
        <text x="866" y="175" fill="#1D4ED8" fontSize="10" fontWeight="bold" fontFamily="monospace">
          JDB HTA (30 kV)
        </text>

        {/* Feeder connection */}
        <line x1="860" y1="250" x2="940" y2="250" stroke="#2563EB" strokeWidth="3" className="sld-bus-flow" />

        {/* Recloser 30 kV */}
        <g 
          transform="translate(920, 250)"
          className="cursor-pointer"
          onClick={() => onSelectEquipment('eq-recloser')}
        >
          <circle cx="0" cy="0" r="10" fill="#FFFFFF" stroke="#2563EB" strokeWidth="1.5" />
          <text x="-5" y="4" fill="#1D4ED8" fontSize="8" fontWeight="bold" fontFamily="monospace">
            REC
          </text>
        </g>

        {/* ---------------- 7. DISTRIBUTION TRANSFORMER (30 kV / 400 V Dyn11) ---------------- */}
        <g 
          transform="translate(980, 250)"
          className="cursor-pointer"
          onClick={() => {
            onSelectStage('distribution');
            onSelectEquipment('eq-dist-trafo');
          }}
        >
          <circle cx="-10" cy="0" r="14" fill="none" stroke="#2563EB" strokeWidth="2" />
          <circle cx="10" cy="0" r="14" fill="none" stroke="#EA580C" strokeWidth="2" />
          <text x="-26" y="26" fill="#C2410C" fontSize="9" fontWeight="bold" fontFamily="monospace">
            Dyn11 400kVA
          </text>
          <text x="-22" y="38" fill="#64748B" fontSize="8" fontFamily="monospace">
            30kV / 400V
          </text>
        </g>

        {/* Low-voltage 400V / 230V Bus line to house */}
        <line x1="1004" y1="250" x2="1050" y2="250" stroke="#EA580C" strokeWidth="3" className="sld-bus-flow" />

        {/* ---------------- 8. RESIDENTIAL SERVICE ENTRANCE & BREAKER ---------------- */}
        {/* Smart Meter (kWh) */}
        <g 
          transform="translate(1065, 250)"
          className="cursor-pointer"
          onClick={() => onSelectEquipment('eq-energy-meter')}
        >
          <circle cx="0" cy="0" r="12" fill="#FFFFFF" stroke="#EA580C" strokeWidth="1.5" />
          <text x="-7" y="4" fill="#C2410C" fontSize="9" fontWeight="bold" fontFamily="monospace">
            kWh
          </text>
          <text x="-12" y="22" fill="#64748B" fontSize="8" fontFamily="monospace">
            Compteur
          </text>
        </g>

        <line x1="1077" y1="250" x2="1105" y2="250" stroke="#EA580C" strokeWidth="2.5" />

        {/* Differential 30 mA & Lighting MCB */}
        <g 
          transform="translate(1120, 250)"
          className="cursor-pointer"
          onClick={() => onSelectEquipment('eq-rcd-diff')}
        >
          <rect x="-10" y="-10" width="20" height="20" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" rx="2" />
          <text x="-8" y="4" fill="#047857" fontSize="8" fontWeight="bold" fontFamily="monospace">
            ΔI
          </text>
          <text x="-14" y="20" fill="#047857" fontSize="8" fontFamily="monospace">
            30mA
          </text>
        </g>

        <line x1="1130" y1="250" x2="1155" y2="250" stroke="#EA580C" strokeWidth="2" />

        {/* Wall switch symbol */}
        <g transform="translate(1165, 250)">
          <circle cx="-5" cy="0" r="2" fill="#D97706" />
          <circle cx="5" cy="0" r="2" fill="#D97706" />
          <line x1="-5" y1="0" x2="3" y2="-6" stroke="#D97706" strokeWidth="1.5" />
          <text x="-10" y="16" fill="#B45309" fontSize="8" fontFamily="monospace">
            SW
          </text>
        </g>

        {/* Lamp symbol (Circle with Cross) */}
        <g 
          transform="translate(1165, 310)"
          className="cursor-pointer"
          onClick={() => onSelectEquipment('eq-lamp-bulb')}
        >
          <line x1="0" y1="-50" x2="0" y2="-15" stroke="#EA580C" strokeWidth="2" />
          <circle cx="0" cy="0" r="14" fill="#FFFBEB" stroke="#D97706" strokeWidth="2" />
          <line x1="-10" y1="-10" x2="10" y2="10" stroke="#D97706" strokeWidth="2" />
          <line x1="-10" y1="10" x2="10" y2="-10" stroke="#D97706" strokeWidth="2" />
          <text x="-16" y="26" fill="#B45309" fontSize="9" fontWeight="bold" fontFamily="monospace">
            LAMPE
          </text>
        </g>
      </svg>

      {/* Standards & ANSI Legend */}
      <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-600 gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-slate-900 font-bold">{locale === 'fr' ? 'CODES ANSI / CEI :' : 'ANSI CODES :'}</span>
          <span><strong className="text-amber-600">87G/T</strong> = Différentielle</span>
          <span><strong className="text-indigo-600">21</strong> = Distance</span>
          <span><strong className="text-emerald-600">50/51</strong> = Max de courant</span>
          <span><strong className="text-sky-600">64S</strong> = Terre stator</span>
          <span><strong className="text-emerald-600">ΔI 30mA</strong> = Différentiel résiduel</span>
        </div>
        <div className="text-[11px] text-slate-500">
          Normes: IEC 60617 · IEC 60255 · IEC 61936-1 · NF C 15-100
        </div>
      </div>
    </div>
  );
};
