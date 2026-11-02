// src/components/grid/modules/CameroonGridSldSynoptic.tsx
// EPEDE 2.0: Interactive Single-Line Diagram (SLD) Synoptic with Real-Time Power Flow Overlays
// Directly driven by CameroonGridSolver: Vector AC load flow, Ferranti surge, dynamic breaker trips & loading

import React, { useState } from 'react';
import {
  Zap,
  Activity,
  AlertTriangle,
  Flame,
  ShieldAlert,
  ShieldCheck,
  Info,
  Power,
  RotateCcw,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import {
  CameroonContingencyOutput,
  CameroonGridBusState,
  CameroonGridCorridorState,
} from '../../../data/cameroonGridSolver';

interface CameroonGridSldSynopticProps {
  locale: 'fr' | 'en';
  solverOutput: CameroonContingencyOutput;
  scenarioId: string;
  isFaultActive: boolean;
  manualBreakerOpen?: boolean;
  onToggleBreaker: () => void;
  onSelectCorridor?: (corridorId: string) => void;
  onSelectBus?: (busId: string) => void;
}

export const CameroonGridSldSynoptic: React.FC<CameroonGridSldSynopticProps> = ({
  locale,
  solverOutput,
  scenarioId,
  isFaultActive,
  manualBreakerOpen,
  onToggleBreaker,
  onSelectCorridor,
  onSelectBus,
}) => {
  const isFr = locale === 'fr';
  const isRin = scenarioId === 'scen-rin-islanding';

  // Selected element for HUD inspection
  const [selectedElement, setSelectedElement] = useState<{
    type: 'bus' | 'corridor';
    id: string;
  } | null>(null);

  // Helper lookup
  const getBus = (id: string): CameroonGridBusState | undefined =>
    solverOutput.buses.find((b) => b.id === id);

  const getCorridor = (id: string): CameroonGridCorridorState | undefined =>
    solverOutput.corridors.find((c) => c.id === id);

  // Active inspections
  const activeBus = selectedElement?.type === 'bus' ? getBus(selectedElement.id) : null;
  const activeCorridor =
    selectedElement?.type === 'corridor' ? getCorridor(selectedElement.id) : null;

  // Compute bus styling based on voltage pu
  const getBusColor = (bus?: CameroonGridBusState) => {
    if (!bus) return '#38bdf8';
    if (bus.voltagePu < 0.90) return '#ef4444'; // Critical undervoltage
    if (bus.voltagePu < 0.95) return '#f59e0b'; // Warning undervoltage
    if (bus.voltagePu > 1.06) return '#a855f7'; // Ferranti overvoltage
    return '#10b981'; // Nominal (0.95 - 1.05 pu)
  };

  // Compute line flow animation speed in seconds (higher MW -> faster speed)
  const getFlowDuration = (pMw: number) => {
    const absP = Math.abs(pMw);
    if (absP <= 5) return '0s'; // Virtually no flow
    const durationSec = Math.max(0.6, Math.min(3.2, 450 / Math.max(20, absP)));
    return `${durationSec.toFixed(2)}s`;
  };

  return (
    <div className="relative bg-[#050A14] border border-slate-800 rounded-2xl p-4 shadow-2xl overflow-hidden font-mono text-xs">
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
              {isFr
                ? isRin
                  ? 'SYNOPTIQUE DYNAMIQUE SLD 110 kV · RÉSEAU INTERCONNECTÉ NORD (RIN)'
                  : 'SYNOPTIQUE DYNAMIQUE SLD 225 kV · RÉSEAU INTERCONNECTÉ SUD (RIS)'
                : isRin
                ? 'DYNAMIC 110 kV SLD SYNOPTIC · NORTHERN INTERCONNECTED GRID (RIN)'
                : 'DYNAMIC 225 kV SLD SYNOPTIC · SOUTHERN INTERCONNECTED GRID (RIS)'}
            </span>
            <span className="text-[10px] text-slate-400">
              {isFr
                ? 'Vecteur de transit AC temps réel · Particules de flux animées · Déclenchement disjoncteurs'
                : 'Real-time vector AC power flow · Animated flux particles · Breaker trip control'}
            </span>
          </div>
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>0.95-1.05 pu (Nominal)</span>
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>&lt;0.95 pu (Alerte)</span>
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>&lt;0.90 pu / Surcharge</span>
          </span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Ferranti &gt;235 kV</span>
          </span>
        </div>
      </div>

      {/* 2. Embedded CSS for Flow Particles & Pulsing Fault Beacons */}
      <style>{`
        @keyframes sldFlowReverse {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 36px; }
        }
        @keyframes sldFlowForward {
          from { stroke-dashoffset: 36px; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes sldFaultFlash {
          0%, 100% { stroke-opacity: 1; stroke-width: 3.5; }
          50% { stroke-opacity: 0.25; stroke-width: 1.5; }
        }
        @keyframes sldFerrantiBeacon {
          0%, 100% { fill-opacity: 0.85; r: 7; }
          50% { fill-opacity: 0.2; r: 14; }
        }
        .corridor-flow-forward {
          stroke-dasharray: 8 6;
          animation: sldFlowForward linear infinite;
        }
        .corridor-flow-reverse {
          stroke-dasharray: 8 6;
          animation: sldFlowReverse linear infinite;
        }
        .corridor-tripped {
          stroke-dasharray: 4 4;
          animation: sldFaultFlash 1.2s ease-in-out infinite;
        }
      `}</style>

      {/* 3. Main Vector SVG Canvas */}
      <div className="w-full overflow-x-auto bg-[#030712] rounded-xl border border-slate-900/90 p-2 my-3 relative">
        {!isRin ? (
          // ==================== RIS SOUTHERN 225 kV GRID SVG ====================
          <svg
            viewBox="0 0 980 430"
            className="w-full min-w-[850px] h-96 select-none font-mono"
          >
            <defs>
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-danger" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Arrow marker for flow direction */}
              <marker
                id="arrow-cyan"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
              </marker>
              <marker
                id="arrow-rose"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#fb7185" />
              </marker>
            </defs>

            {/* Grid Coordinates Reference Lines (Subtle) */}
            <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.4">
              <line x1="20" y1="90" x2="960" y2="90" />
              <line x1="20" y1="210" x2="960" y2="210" />
              <line x1="20" y1="340" x2="960" y2="340" />
              <line x1="230" y1="20" x2="230" y2="410" />
              <line x1="530" y1="20" x2="530" y2="410" />
              <line x1="770" y1="20" x2="770" y2="410" />
            </g>

            {/* ================= TRANSMISSION CORRIDORS ================= */}

            {/* 1. Line Song Loulou -> Mangombé (Circuit 1) */}
            {(() => {
              const c1 = getCorridor('line-sl-mg-c1');
              const isTripped = c1?.status === 'tripped';
              return (
                <g
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => setSelectedElement({ type: 'corridor', id: 'line-sl-mg-c1' })}
                >
                  {/* Underlay glow */}
                  <path
                    d="M 180 75 L 360 145"
                    stroke={isTripped ? '#e11d48' : '#0284c7'}
                    strokeWidth={isTripped ? 2 : 5}
                    opacity={isTripped ? 0.3 : 0.25}
                    fill="none"
                  />
                  {/* Dynamic Flow Line */}
                  <path
                    d="M 180 75 L 360 145"
                    stroke={isTripped ? '#e11d48' : '#38bdf8'}
                    strokeWidth={isTripped ? 2 : 3}
                    fill="none"
                    className={isTripped ? 'corridor-tripped' : 'corridor-flow-forward'}
                    style={{ animationDuration: getFlowDuration(c1?.activePowerFromMw || 0) }}
                  />
                  {/* Breaker Icon SL1 */}
                  <g
                    transform="translate(235, 90)"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBreaker();
                    }}
                  >
                    <rect
                      x="-14"
                      y="-10"
                      width="28"
                      height="20"
                      rx="4"
                      fill={isTripped ? '#7f1d1d' : '#064e3b'}
                      stroke={isTripped ? '#ef4444' : '#10b981'}
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="4"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {isTripped ? 'OUV' : 'FER'}
                    </text>
                  </g>
                  {/* Label */}
                  <text
                    x="255"
                    y="125"
                    fill={isTripped ? '#f87171' : '#94a3b8'}
                    fontSize="9.5"
                    fontWeight="bold"
                  >
                    C1 (58 km) · {isTripped ? 'DÉCLENCHÉ (87L)' : `${c1?.activePowerFromMw} MW`}
                  </text>
                </g>
              );
            })()}

            {/* 2. Line Song Loulou -> Mangombé (Circuit 2) */}
            {(() => {
              const c2 = getCorridor('line-sl-mg-c2');
              const isOverload = (c2?.loadingPercent || 0) > 85;
              const isCrit = (c2?.loadingPercent || 0) > 100;
              return (
                <g
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => setSelectedElement({ type: 'corridor', id: 'line-sl-mg-c2' })}
                >
                  <path
                    d="M 180 95 L 360 165"
                    stroke={isCrit ? '#ef4444' : isOverload ? '#f59e0b' : '#0284c7'}
                    strokeWidth={isCrit ? 8 : isOverload ? 6 : 4}
                    opacity={0.3}
                    fill="none"
                  />
                  <path
                    d="M 180 95 L 360 165"
                    stroke={isCrit ? '#ef4444' : isOverload ? '#f59e0b' : '#38bdf8'}
                    strokeWidth={isCrit ? 4.5 : isOverload ? 3.5 : 2.5}
                    fill="none"
                    className="corridor-flow-forward"
                    style={{ animationDuration: getFlowDuration(c2?.activePowerFromMw || 0) }}
                  />
                  {/* Badge */}
                  <g transform="translate(265, 155)">
                    <rect
                      x="-35"
                      y="-9"
                      width="70"
                      height="18"
                      rx="4"
                      fill="#0C1525"
                      stroke={isCrit ? '#ef4444' : isOverload ? '#f59e0b' : '#334155'}
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="4"
                      fill={isCrit ? '#fca5a5' : isOverload ? '#fde68a' : '#94a3b8'}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      C2: {c2?.activePowerFromMw} MW ({c2?.loadingPercent}%)
                    </text>
                  </g>
                </g>
              );
            })()}

            {/* 3. Line Mangombé -> Bekoko (Douala Hub) */}
            {(() => {
              const c3 = getCorridor('line-mg-bkk');
              return (
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedElement({ type: 'corridor', id: 'line-mg-bkk' })}
                >
                  <path
                    d="M 400 190 L 260 280"
                    stroke="#0284c7"
                    strokeWidth="5"
                    opacity="0.2"
                    fill="none"
                  />
                  <path
                    d="M 400 190 L 260 280"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    fill="none"
                    className="corridor-flow-forward"
                    style={{ animationDuration: getFlowDuration(c3?.activePowerFromMw || 0) }}
                  />
                  <g transform="translate(340, 245)">
                    <rect
                      x="-30"
                      y="-8"
                      width="60"
                      height="16"
                      rx="3"
                      fill="#0C1525"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3.5"
                      fill="#cbd5e1"
                      fontSize="8.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {c3?.activePowerFromMw} MW ({c3?.loadingPercent}%)
                    </text>
                  </g>
                </g>
              );
            })()}

            {/* 4. Line Mangombé -> Oyomabang (Intertie Yaoundé) */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedElement({ type: 'corridor', id: 'line-sl-mg-c2' })}
            >
              <path
                d="M 460 170 L 660 170"
                stroke="#0ea5e9"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="6 4"
                className="corridor-flow-forward"
                style={{ animationDuration: '2.4s' }}
              />
              <text x="560" y="160" fill="#94a3b8" fontSize="9" textAnchor="middle">
                Interconnexion Littoral-Centre (165 km) · ~185 MW
              </text>
            </g>

            {/* 5. Line Nachtigal -> Nyom II -> Oyomabang */}
            {(() => {
              const cNacht = getCorridor('line-nacht-nyom');
              const isReduced = (cNacht?.activePowerFromMw || 0) < 300;
              return (
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedElement({ type: 'corridor', id: 'line-nacht-nyom' })}
                >
                  <path
                    d="M 830 85 L 720 160"
                    stroke={isReduced ? '#f59e0b' : '#10b981'}
                    strokeWidth={isReduced ? 3 : 4}
                    opacity="0.3"
                    fill="none"
                  />
                  <path
                    d="M 830 85 L 720 160"
                    stroke={isReduced ? '#f59e0b' : '#34d399'}
                    strokeWidth="2.5"
                    fill="none"
                    className="corridor-flow-forward"
                    style={{ animationDuration: getFlowDuration(cNacht?.activePowerFromMw || 0) }}
                  />
                  <g transform="translate(790, 130)">
                    <rect
                      x="-35"
                      y="-8"
                      width="70"
                      height="16"
                      rx="3"
                      fill="#0C1525"
                      stroke={isReduced ? '#f59e0b' : '#334155'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="4"
                      fill={isReduced ? '#fef08a' : '#a7f3d0'}
                      fontSize="8.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {cNacht?.activePowerFromMw} MW / 560 MVA
                    </text>
                  </g>
                </g>
              );
            })()}

            {/* 6. Line Memve'ele -> Nomayos (280 km) */}
            {(() => {
              const cMemv = getCorridor('line-memv-ebolowa');
              const isTripped = cMemv?.status === 'tripped';
              return (
                <g
                  className="cursor-pointer"
                  onClick={() => setSelectedElement({ type: 'corridor', id: 'line-memv-ebolowa' })}
                >
                  <path
                    d="M 520 360 L 730 330"
                    stroke={isTripped ? '#e11d48' : '#0284c7'}
                    strokeWidth={isTripped ? 2 : 4}
                    fill="none"
                    className={isTripped ? 'corridor-tripped' : 'corridor-flow-forward'}
                    style={{ animationDuration: isTripped ? '1s' : '1.8s' }}
                  />
                  {/* Ferranti capacitive beacon if tripped */}
                  {isTripped && (
                    <g transform="translate(720, 330)">
                      <circle cx="0" cy="0" r="12" fill="#a855f7" className="animate-ping opacity-60" />
                      <circle cx="0" cy="0" r="6" fill="#c084fc" />
                      <text
                        x="-10"
                        y="-16"
                        fill="#e879f9"
                        fontSize="9"
                        fontWeight="bold"
                        filter="url(#glow-purple)"
                      >
                        ⚡ U_open = {cMemv?.ferrantiVoltageRiseKv} kV (Ferranti)
                      </text>
                    </g>
                  )}
                  <text
                    x="620"
                    y="360"
                    fill={isTripped ? '#fca5a5' : '#94a3b8'}
                    fontSize="9"
                    textAnchor="middle"
                  >
                    280 km (Ebolowa) · {isTripped ? 'DÉCLENCHÉ' : `${cMemv?.activePowerFromMw} MW`}
                  </text>
                </g>
              );
            })()}

            {/* 7. Intertie Oyomabang -> Nomayos (Capital ring) */}
            <path
              d="M 710 200 L 750 300"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
              opacity="0.6"
            />
            <text x="740" y="250" fill="#64748b" fontSize="8" textAnchor="middle">
              Boucle Yaoundé 225 kV
            </text>

            {/* ================= BUSBAR NODES (SUBSTATIONS) ================= */}

            {/* BUS 1: Song Loulou (Hydro 384 MW) */}
            {(() => {
              const bus = getBus('node-songloulou');
              return (
                <g
                  transform="translate(60, 50)"
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setSelectedElement({ type: 'bus', id: 'node-songloulou' })}
                >
                  <rect
                    x="0"
                    y="0"
                    width="120"
                    height="50"
                    rx="8"
                    fill="#0B132B"
                    stroke={getBusColor(bus)}
                    strokeWidth="2.5"
                  />
                  <text x="60" y="18" fill="#38bdf8" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                    SONGLOULOU
                  </text>
                  <text x="60" y="32" fill="#e2e8f0" fontSize="9.5" textAnchor="middle">
                    {bus?.voltageKvActual} kV · {bus?.voltagePu} pu
                  </text>
                  <text x="60" y="44" fill="#10b981" fontSize="8.5" textAnchor="middle">
                    P_gen: {bus?.generationMw} MW
                  </text>
                </g>
              );
            })()}

            {/* BUS 2: Mangombé (Edéa Hub) */}
            {(() => {
              const bus = getBus('node-mangombe');
              return (
                <g
                  transform="translate(360, 140)"
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setSelectedElement({ type: 'bus', id: 'node-mangombe' })}
                >
                  <rect
                    x="0"
                    y="0"
                    width="125"
                    height="52"
                    rx="8"
                    fill="#0B132B"
                    stroke={getBusColor(bus)}
                    strokeWidth="2.5"
                  />
                  <text x="62" y="18" fill="#f8fafc" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                    MANGOMBÉ (EDÉA)
                  </text>
                  <text x="62" y="32" fill="#e2e8f0" fontSize="9.5" textAnchor="middle">
                    {bus?.voltageKvActual} kV · {bus?.voltagePu} pu
                  </text>
                  <text x="62" y="45" fill="#f59e0b" fontSize="8.5" textAnchor="middle">
                    Inj: Kribi+Dibamba
                  </text>
                </g>
              );
            })()}

            {/* BUS 3: Bekoko (Douala Hub) */}
            {(() => {
              const bus = getBus('node-bekoko');
              const isCrit = (bus?.voltagePu || 1) < 0.90;
              return (
                <g
                  transform="translate(170, 260)"
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setSelectedElement({ type: 'bus', id: 'node-bekoko' })}
                >
                  <rect
                    x="0"
                    y="0"
                    width="125"
                    height="52"
                    rx="8"
                    fill="#0B132B"
                    stroke={getBusColor(bus)}
                    strokeWidth={isCrit ? 3.5 : 2.5}
                    filter={isCrit ? 'url(#glow-danger)' : undefined}
                  />
                  <text x="62" y="18" fill="#f8fafc" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                    BEKOKO (DOUALA)
                  </text>
                  <text x="62" y="32" fill={isCrit ? '#f87171' : '#e2e8f0'} fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    {bus?.voltageKvActual} kV · {bus?.voltagePu} pu
                  </text>
                  <text x="62" y="45" fill="#f43f5e" fontSize="8.5" textAnchor="middle">
                    Charge: 250 MW
                  </text>
                </g>
              );
            })()}

            {/* BUS 4: Nachtigal Amont 420 MW */}
            {(() => {
              const bus = getBus('node-nachtigal');
              const isTrip = scenarioId === 'scen-nachtigal-trip' && isFaultActive;
              return (
                <g
                  transform="translate(800, 45)"
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setSelectedElement({ type: 'bus', id: 'node-nachtigal' })}
                >
                  <rect
                    x="0"
                    y="0"
                    width="135"
                    height="52"
                    rx="8"
                    fill="#0B132B"
                    stroke={isTrip ? '#f59e0b' : '#10b981'}
                    strokeWidth="2.5"
                  />
                  <text x="67" y="18" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                    NACHTIGAL 420 MW
                  </text>
                  <text x="67" y="32" fill="#e2e8f0" fontSize="9.5" textAnchor="middle">
                    {bus?.voltageKvActual} kV · {bus?.voltagePu} pu
                  </text>
                  <text x="67" y="45" fill={isTrip ? '#f87171' : '#10b981'} fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    {isTrip ? 'TRIP -180 MW (GSU 2)' : `P_gen: ${bus?.generationMw} MW`}
                  </text>
                </g>
              );
            })()}

            {/* BUS 5: Oyomabang (Yaoundé Hub 225/30 kV) */}
            {(() => {
              const bus = getBus('node-oyomabang');
              const isUnder = (bus?.voltagePu || 1) < 0.93;
              return (
                <g
                  transform="translate(660, 150)"
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setSelectedElement({ type: 'bus', id: 'node-oyomabang' })}
                >
                  <rect
                    x="0"
                    y="0"
                    width="140"
                    height="52"
                    rx="8"
                    fill="#0B132B"
                    stroke={getBusColor(bus)}
                    strokeWidth="2.5"
                  />
                  <text x="70" y="18" fill="#f8fafc" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                    OYOMABANG (YAOUNDÉ)
                  </text>
                  <text x="70" y="32" fill={isUnder ? '#f59e0b' : '#e2e8f0'} fontSize="9.5" textAnchor="middle">
                    {bus?.voltageKvActual} kV · {bus?.voltagePu} pu
                  </text>
                  <text x="70" y="45" fill="#f43f5e" fontSize="8.5" textAnchor="middle">
                    Conso: 280 MW / 30 kV
                  </text>
                </g>
              );
            })()}

            {/* BUS 6: Memve'ele 211 MW */}
            <g
              transform="translate(420, 335)"
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <rect
                x="0"
                y="0"
                width="125"
                height="50"
                rx="8"
                fill="#0B132B"
                stroke="#0ea5e9"
                strokeWidth="2"
              />
              <text x="62" y="18" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                MEMVE'ELE 211 MW
              </text>
              <text x="62" y="32" fill="#e2e8f0" fontSize="9" textAnchor="middle">
                225 kV · 1.020 pu
              </text>
              <text x="62" y="44" fill="#10b981" fontSize="8.5" textAnchor="middle">
                4 Francis · Sud Ntem
              </text>
            </g>

            {/* BUS 7: Nomayos (Yaoundé Sud) */}
            {(() => {
              const bus = getBus('node-nomayos');
              const isSag = (bus?.voltagePu || 1) < 0.95;
              return (
                <g
                  transform="translate(730, 290)"
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setSelectedElement({ type: 'bus', id: 'node-nomayos' })}
                >
                  <rect
                    x="0"
                    y="0"
                    width="135"
                    height="50"
                    rx="8"
                    fill="#0B132B"
                    stroke={getBusColor(bus)}
                    strokeWidth="2.5"
                  />
                  <text x="67" y="18" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">
                    NOMAYOS 225 kV
                  </text>
                  <text x="67" y="32" fill={isSag ? '#f59e0b' : '#e2e8f0'} fontSize="9.5" textAnchor="middle">
                    {bus?.voltageKvActual} kV · {bus?.voltagePu} pu
                  </text>
                  <text x="67" y="44" fill="#cbd5e1" fontSize="8.5" textAnchor="middle">
                    Injection Sud Yaoundé
                  </text>
                </g>
              );
            })()}
          </svg>
        ) : (
          // ==================== RIN NORTHERN 110 kV GRID SVG ====================
          <svg
            viewBox="0 0 980 340"
            className="w-full min-w-[850px] h-80 select-none font-mono"
          >
            {/* RIN Northern Grid: Lagdo Hydro -> Garoua -> Guider -> Maroua */}
            <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.4">
              <line x1="20" y1="160" x2="960" y2="160" />
            </g>

            {/* Line Lagdo -> Garoua (110 kV, 70 km) */}
            <path
              d="M 180 150 L 370 150"
              stroke="#10b981"
              strokeWidth="3.5"
              fill="none"
              className="corridor-flow-forward"
              style={{ animationDuration: '1.4s' }}
            />
            <text x="275" y="138" fill="#94a3b8" fontSize="9.5" textAnchor="middle">
              L-110-LD-GR (70 km) · 38 MW
            </text>

            {/* Line Garoua -> Guider (110 kV, 100 km) */}
            <path
              d="M 490 150 L 680 150"
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
              className="corridor-flow-forward"
              style={{ animationDuration: '1.8s' }}
            />
            <text x="585" y="138" fill="#94a3b8" fontSize="9.5" textAnchor="middle">
              L-110-GR-GD (100 km) · 24 MW
            </text>

            {/* Line Guider -> Maroua (110 kV, 90 km) */}
            <path
              d="M 780 150 L 890 150"
              stroke="#10b981"
              strokeWidth="2.5"
              fill="none"
              className="corridor-flow-forward"
              style={{ animationDuration: '2.1s' }}
            />

            {/* BUS: Lagdo Hydro (72 MW) */}
            <g transform="translate(60, 120)">
              <rect x="0" y="0" width="120" height="60" rx="8" fill="#0B132B" stroke="#38bdf8" strokeWidth="2.5" />
              <text x="60" y="20" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">LAGDO HYDRO</text>
              <text x="60" y="36" fill="#e2e8f0" fontSize="9.5" textAnchor="middle">110 kV · 52 MW</text>
              <text x="60" y="50" fill="#10b981" fontSize="8.5" textAnchor="middle">Statisme R=4% · Isochrone</text>
            </g>

            {/* BUS: Garoua Substation */}
            <g transform="translate(370, 120)">
              <rect x="0" y="0" width="120" height="60" rx="8" fill="#0B132B" stroke="#10b981" strokeWidth="2.5" />
              <text x="60" y="20" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">GAROUA 110 kV</text>
              <text x="60" y="36" fill="#e2e8f0" fontSize="9.5" textAnchor="middle">108.5 kV · 0.986 pu</text>
              <text x="60" y="50" fill="#f43f5e" fontSize="8.5" textAnchor="middle">Charge: 22 MW</text>
            </g>

            {/* BUS: Guider Solar PV + BESS */}
            <g transform="translate(680, 110)">
              <rect x="0" y="0" width="130" height="75" rx="8" fill="#0B132B" stroke="#f59e0b" strokeWidth="2.5" />
              <text x="65" y="18" fill="#fbbf24" fontSize="10.5" fontWeight="bold" textAnchor="middle">GUIDER SOLAIRE</text>
              <text x="65" y="32" fill="#e2e8f0" fontSize="9" textAnchor="middle">PV: 15 MWp · BESS: 10 MW</text>
              <text x="65" y="47" fill={isFaultActive ? '#f87171' : '#34d399'} fontSize="8.5" textAnchor="middle">
                {isFaultActive ? 'Chute irradiance solaire' : 'Injection nominale'}
              </text>
              <text x="65" y="62" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle">
                BESS: Support Rapide RoCoF
              </text>
            </g>

            {/* BUS: Maroua Substation */}
            <g transform="translate(890, 120)">
              <rect x="0" y="0" width="90" height="60" rx="8" fill="#0B132B" stroke="#10b981" strokeWidth="2" />
              <text x="45" y="20" fill="#f8fafc" fontSize="10.5" fontWeight="bold" textAnchor="middle">MAROUA</text>
              <text x="45" y="36" fill="#e2e8f0" fontSize="9" textAnchor="middle">107 kV</text>
              <text x="45" y="50" fill="#f43f5e" fontSize="8.5" textAnchor="middle">18 MW</text>
            </g>
          </svg>
        )}
      </div>

      {/* 4. Interactive Telemetry HUD Card for Selected Equipment */}
      {selectedElement && (
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-800/60 shadow-lg mt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in">
          <div>
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>
                {selectedElement.type === 'corridor'
                  ? isFr ? 'TÉLÉMESURE SCADA LIGNE DE TRANSPORT' : 'TRANSMISSION LINE SCADA TELEMETRY'
                  : isFr ? 'TÉLÉMESURE SCADA JEU DE BARRES' : 'BUSBAR SCADA TELEMETRY'}
              </span>
            </div>
            <div className="font-bold text-white text-sm mt-0.5">
              {selectedElement.type === 'corridor'
                ? isFr ? activeCorridor?.name.fr : activeCorridor?.name.en
                : isFr ? activeBus?.name.fr : activeBus?.name.en}
            </div>
          </div>

          {selectedElement.type === 'corridor' && activeCorridor && (
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">P_transit</span>
                <span className="font-black text-cyan-300">{activeCorridor.activePowerFromMw} MW</span>
              </div>
              <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Q_transit</span>
                <span className="font-black text-indigo-300">{activeCorridor.reactivePowerFromMvar} Mvar</span>
              </div>
              <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Courant I</span>
                <span className="font-black text-emerald-300">{activeCorridor.currentAmperes} A</span>
              </div>
              <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Chargement</span>
                <span className={`font-black ${activeCorridor.loadingPercent > 100 ? 'text-rose-400' : activeCorridor.loadingPercent > 85 ? 'text-amber-400' : 'text-emerald-300'}`}>
                  {activeCorridor.loadingPercent}%
                </span>
              </div>
            </div>
          )}

          {selectedElement.type === 'bus' && activeBus && (
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Tension U</span>
                <span className="font-black text-emerald-300">{activeBus.voltageKvActual} kV ({activeBus.voltagePu} pu)</span>
              </div>
              <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Angle de phase</span>
                <span className="font-black text-cyan-300">δ = {activeBus.angleDeg}°</span>
              </div>
              <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Puissance active</span>
                <span className="font-black text-amber-300">
                  {activeBus.generationMw > 0 ? `+${activeBus.generationMw} MW` : `-${activeBus.loadMw} MW`}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => setSelectedElement(null)}
            className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

