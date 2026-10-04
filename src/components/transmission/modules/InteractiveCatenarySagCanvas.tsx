// src/components/transmission/modules/InteractiveCatenarySagCanvas.tsx
// EPEDE D03 - Interactive Transmission Line Catenary Sag & Ground Clearance Canvas (IEC 60826)

import React, { useState, useMemo } from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';

interface InteractiveCatenarySagCanvasProps {
  locale: 'fr' | 'en';
  voltage?: string;
}

export const InteractiveCatenarySagCanvas: React.FC<InteractiveCatenarySagCanvasProps> = ({
  locale,
  voltage = '225kV'
}) => {
  // Mechanical Catenary Parameters
  const [spanM, setSpanM] = useState<number>(400); // 400m standard transmission span
  const [conductorTempC, setConductorTempC] = useState<number>(55); // 55°C operating
  const [horizontalTensionKn, setHorizontalTensionKn] = useState<number>(35); // 35 kN standard stringing tension
  const [conductorType, setConductorType] = useState<'ASTER_570' | 'ASTER_851' | 'ACSR_CURLEW'>('ASTER_570');
  const [windPressurePa, setWindPressurePa] = useState<number>(0); // 0 to 800 Pa

  // Conductor Physical Properties
  const conductorProps = {
    ASTER_570: { name: 'Almelec Aster 570 mm²', weightNpm: 15.4, diameterMm: 31.05, alpha: 23e-6 },
    ASTER_851: { name: 'Almelec Aster 851 mm²', weightNpm: 23.1, diameterMm: 38.00, alpha: 23e-6 },
    ACSR_CURLEW: { name: 'ACSR Curlew 54/7', weightNpm: 19.8, diameterMm: 31.63, alpha: 19.3e-6 }
  }[conductorType];

  // Mathematical Catenary Calculation:
  // D = (w_res * S^2) / (8 * H)
  // Thermal expansion alters tension H inversely
  const results = useMemo(() => {
    const tempDelta = Math.max(0, conductorTempC - 20);
    // Thermal elongation reduces tension: H_eff = H0 / (1 + alpha * deltaT * E / sigma)
    const tensionReductionFactor = 1 + tempDelta * 0.0055;
    const effectiveTensionN = (horizontalTensionKn * 1000) / tensionReductionFactor;

    // Wind force per meter: F_wind = P_wind * diameter
    const windForceNpm = (windPressurePa * conductorProps.diameterMm) / 1000;
    const resultantWeightNpm = Math.sqrt(Math.pow(conductorProps.weightNpm, 2) + Math.pow(windForceNpm, 2));

    // Mid-span Sag D
    const midspanSagM = Number(((resultantWeightNpm * Math.pow(spanM, 2)) / (8 * effectiveTensionN)).toFixed(2));

    // Tower attachment height above ground
    const towerAttachHeightM = 24.0;
    const minGroundClearanceM = Number((towerAttachHeightM - midspanSagM).toFixed(2));

    // Legal safety limits (IEC 61936-1): 225 kV requires >= 8.0m in agricultural / open terrain
    const legalMinClearanceM = voltage === '400kV' ? 9.5 : voltage === '225kV' ? 8.0 : 7.0;
    const isSafe = minGroundClearanceM >= legalMinClearanceM;

    // Swing angle under wind: theta = atan(F_wind / w)
    const swingAngleDeg = Number(((Math.atan2(windForceNpm, conductorProps.weightNpm) * 180) / Math.PI).toFixed(1));

    return {
      effectiveTensionKn: Number((effectiveTensionN / 1000).toFixed(1)),
      midspanSagM,
      minGroundClearanceM,
      legalMinClearanceM,
      isSafe,
      swingAngleDeg,
      resultantWeightNpm: Number(resultantWeightNpm.toFixed(2))
    };
  }, [spanM, conductorTempC, horizontalTensionKn, conductorProps, windPressurePa, voltage]);

  // SVG Catenary Path Generation (ViewBox: 0 0 600 240)
  const svgWidth = 600;
  const svgHeight = 240;
  const towerLeftX = 70;
  const towerRightX = 530;
  const attachY = 50; // Tower top attachment point in SVG coordinates
  const groundY = 200; // Ground line in SVG coordinates

  // Generate 50 points along the parabolic curve: y(x) = attachY + (x - midX)^2 * factor
  const midX = (towerLeftX + towerRightX) / 2;
  const sagScaleFactor = results.midspanSagM * 5.0; // scale meters to SVG pixels
  const maxSagY = Math.min(groundY - 10, attachY + sagScaleFactor);

  const curvePoints: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const x = towerLeftX + (i / 40) * (towerRightX - towerLeftX);
    const normalizedDist = (x - midX) / (midX - towerLeftX); // -1 to +1
    const y = attachY + (1 - Math.pow(normalizedDist, 2)) * sagScaleFactor;
    curvePoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const pathD = `M ${curvePoints.join(' L ')}`;

  return (
    <div className="p-6 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-2xl font-mono space-y-6">
      {/* Title & Technical Standard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222B38] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
              CEI 60826 · CIGRÉ TB 324
            </span>
            <span className="text-[10px] text-slate-400">Équation de Changement d'État de la Portée</span>
          </div>
          <h3 className="text-base font-bold text-white mt-1">
            {locale === 'fr' ? 'Profil de Flèche Caténaire & Gabarit de Sécurité au Sol' : 'Catenary Conductor Sag & Ground Clearance Profile'}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase">{locale === 'fr' ? 'Flèche à Mi-Portée' : 'Mid-Span Sag'}</div>
            <div className="text-lg font-bold text-amber-400">{results.midspanSagM} m</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase">{locale === 'fr' ? 'Garde au Sol Réelle' : 'Ground Clearance'}</div>
            <div className={`text-lg font-bold ${results.isSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
              {results.minGroundClearanceM} m
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Canvas Rendering */}
      <div className="relative rounded-xl bg-gradient-to-b from-[#0B1019] via-[#0E1522] to-[#070A10] border border-[#222B38] overflow-hidden p-3">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
          <defs>
            <linearGradient id="catenaryGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#090D14" />
            </linearGradient>
            <pattern id="soilPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <line x1="0" y1="10" x2="10" y2="0" stroke="#334155" strokeWidth="0.8" opacity="0.4" />
            </pattern>
          </defs>

          {/* Ground Fill & Safety Clearance Barrier */}
          <rect x="0" y={groundY} width={svgWidth} height={svgHeight - groundY} fill="url(#groundGrad)" />
          <rect x="0" y={groundY} width={svgWidth} height={svgHeight - groundY} fill="url(#soilPattern)" />
          <line x1="0" y1={groundY} x2={svgWidth} y2={groundY} stroke="#475569" strokeWidth="1.5" />

          {/* Legal Safety Ground Clearance Envelope Line */}
          <line
            x1="50"
            y1={groundY - results.legalMinClearanceM * 5.0}
            x2="550"
            y2={groundY - results.legalMinClearanceM * 5.0}
            stroke="#EF4444"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <text
            x="70"
            y={groundY - results.legalMinClearanceM * 5.0 - 5}
            fill="#EF4444"
            fontSize="9"
            fontFamily="monospace"
          >
            {locale === 'fr' ? `Gabarit Légal Requis : ≥ ${results.legalMinClearanceM} m` : `Legal Safety Clearance: ≥ ${results.legalMinClearanceM} m`}
          </text>

          {/* Left Steel Lattice Tower (Stylized CAD lines) */}
          <g transform={`translate(${towerLeftX}, ${attachY})`}>
            {/* Tower Crossarm */}
            <line x1="-30" y1="0" x2="10" y2="0" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Tower Body */}
            <line x1="0" y1="-20" x2="-15" y2={groundY - attachY} stroke="#64748B" strokeWidth="2" />
            <line x1="0" y1="-20" x2="15" y2={groundY - attachY} stroke="#64748B" strokeWidth="2" />
            {/* Lattice Bracing */}
            <line x1="-5" y1="10" x2="10" y2="35" stroke="#475569" strokeWidth="1" />
            <line x1="5" y1="10" x2="-10" y2="35" stroke="#475569" strokeWidth="1" />
            <line x1="-8" y1="40" x2="12" y2="80" stroke="#475569" strokeWidth="1" />
            <line x1="8" y1="40" x2="-12" y2="80" stroke="#475569" strokeWidth="1" />
            {/* Insulator String */}
            <line x1="0" y1="0" x2="0" y2="15" stroke="#38BDF8" strokeWidth="3" />
            <circle cx="0" cy="15" r="2.5" fill="#F59E0B" />
          </g>

          {/* Right Steel Lattice Tower */}
          <g transform={`translate(${towerRightX}, ${attachY})`}>
            {/* Tower Crossarm */}
            <line x1="-10" y1="0" x2="30" y2="0" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Tower Body */}
            <line x1="0" y1="-20" x2="-15" y2={groundY - attachY} stroke="#64748B" strokeWidth="2" />
            <line x1="0" y1="-20" x2="15" y2={groundY - attachY} stroke="#64748B" strokeWidth="2" />
            {/* Lattice Bracing */}
            <line x1="-5" y1="10" x2="10" y2="35" stroke="#475569" strokeWidth="1" />
            <line x1="5" y1="10" x2="-10" y2="35" stroke="#475569" strokeWidth="1" />
            <line x1="-8" y1="40" x2="12" y2="80" stroke="#475569" strokeWidth="1" />
            <line x1="8" y1="40" x2="-12" y2="80" stroke="#475569" strokeWidth="1" />
            {/* Insulator String */}
            <line x1="0" y1="0" x2="0" y2="15" stroke="#38BDF8" strokeWidth="3" />
            <circle cx="0" cy="15" r="2.5" fill="#F59E0B" />
          </g>

          {/* Catenary Cable Path */}
          <path d={pathD} fill="none" stroke="url(#catenaryGlow)" strokeWidth="2.5" filter="drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))" />

          {/* Midspan Dimension Arrow & Value */}
          <line x1={midX} y1={attachY} x2={midX} y2={attachY + sagScaleFactor} stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx={midX} cy={attachY + sagScaleFactor} r="4" fill="#F59E0B" />
          <text x={midX + 8} y={attachY + sagScaleFactor / 2} fill="#F59E0B" fontSize="10" fontWeight="bold">
            Flèche : {results.midspanSagM} m
          </text>

          {/* Ground Clearance Arrow & Value */}
          <line x1={midX} y1={attachY + sagScaleFactor} x2={midX} y2={groundY} stroke={results.isSafe ? '#10B981' : '#EF4444'} strokeWidth="1.5" />
          <text
            x={midX + 8}
            y={(attachY + sagScaleFactor + groundY) / 2}
            fill={results.isSafe ? '#34D399' : '#F87171'}
            fontSize="10"
            fontWeight="bold"
          >
            Garde : {results.minGroundClearanceM} m
          </text>

          {/* Span Length Legend */}
          <text x={midX - 35} y={groundY + 22} fill="#94A3B8" fontSize="11">
            Portée S = {spanM} m
          </text>
        </svg>

        {/* Safety Status Pill Overlay */}
        <div className="absolute top-4 right-4">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border shadow-md ${
            results.isSafe
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
          }`}>
            {results.isSafe ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {results.isSafe
              ? (locale === 'fr' ? 'GABARIT CONFORME' : 'CLEARANCE SAFE')
              : (locale === 'fr' ? 'DANGER : GABARIT VIOLE' : 'DANGER: CLEARANCE VIOLATED')}
          </span>
        </div>
      </div>

      {/* Control Sliders Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* 1. Conductor Temperature */}
        <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">{locale === 'fr' ? 'Température Âme' : 'Conductor Temp'}:</span>
            <span className="font-bold text-amber-400">{conductorTempC} °C</span>
          </div>
          <input
            type="range"
            min={20}
            max={90}
            step={1}
            value={conductorTempC}
            onChange={(e) => setConductorTempC(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="text-[10px] text-slate-500">
            {locale === 'fr' ? 'Échauffement Joule + Solaire' : 'Joule heating + Solar flux'}
          </div>
        </div>

        {/* 2. Stringing Horizontal Tension */}
        <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">{locale === 'fr' ? 'Tension Mécanique H' : 'Stringing Tension H'}:</span>
            <span className="font-bold text-sky-400">{horizontalTensionKn} kN</span>
          </div>
          <input
            type="range"
            min={20}
            max={50}
            step={1}
            value={horizontalTensionKn}
            onChange={(e) => setHorizontalTensionKn(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
          <div className="text-[10px] text-slate-500">
            {locale === 'fr' ? 'Tension nominale de pose à 20°C' : 'Nominal stringing tension at 20°C'}
          </div>
        </div>

        {/* 3. Span Length S */}
        <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">{locale === 'fr' ? 'Longueur de Portée' : 'Span Length S'}:</span>
            <span className="font-bold text-emerald-400">{spanM} m</span>
          </div>
          <input
            type="range"
            min={250}
            max={600}
            step={25}
            value={spanM}
            onChange={(e) => setSpanM(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="text-[10px] text-slate-500">
            {locale === 'fr' ? 'Distance entre deux pylônes successifs' : 'Distance between consecutive towers'}
          </div>
        </div>

        {/* 4. Conductor Type Selection */}
        <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2">
          <span className="text-slate-400 block">{locale === 'fr' ? 'Faisceau Conducteur' : 'Conductor Bundle'}:</span>
          <select
            value={conductorType}
            onChange={(e) => setConductorType(e.target.value as any)}
            className="w-full px-2 py-1.5 rounded-lg bg-[#090D14] border border-[#222B38] text-amber-300 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ASTER_570">Aster 570 mm² (15.4 N/m)</option>
            <option value="ASTER_851">Aster 851 mm² (23.1 N/m)</option>
            <option value="ACSR_CURLEW">ACSR Curlew 54/7 (19.8 N/m)</option>
          </select>
          <div className="text-[10px] text-slate-500">
            Ø {conductorProps.diameterMm} mm • α = {conductorProps.alpha * 1e6} × 10⁻⁶/K
          </div>
        </div>
      </div>
    </div>
  );
};
