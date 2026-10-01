// src/components/common/CanonicalTopologyCanvas.tsx
// EPEDE Wave 2: Interactive SVG Multi-Bus Topological Flow & SLD Visualizer
// Real-time AC power flow, live animated power vectors, breaker switching & contingency analysis.

import React, { useState } from 'react';
import {
  canonicalNetworkSolver,
  CanonicalNetworkSolver,
  NetworkSimulationScenario,
  NetworkSolverResult,
} from '../../data/canonicalNetworkSolver';
import {
  Play,
  RotateCcw,
  Zap,
  Power,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Activity,
} from 'lucide-react';

interface CanonicalTopologyCanvasProps {
  locale: 'fr' | 'en';
  selectedNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
}

export const CanonicalTopologyCanvas: React.FC<CanonicalTopologyCanvasProps> = ({
  locale,
  selectedNodeId,
  onSelectNode,
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('nominal_steady_state');
  const [currentScenario, setCurrentScenario] = useState<NetworkSimulationScenario>(
    CanonicalNetworkSolver.SCENARIOS[0]
  );

  const [simResult, setSimResult] = useState<NetworkSolverResult>(
    canonicalNetworkSolver.solve(CanonicalNetworkSolver.SCENARIOS[0])
  );

  const handleScenarioChange = (scenarioId: string) => {
    const sc = CanonicalNetworkSolver.SCENARIOS.find((s) => s.id === scenarioId);
    if (!sc) return;
    setActiveScenarioId(scenarioId);
    const updated = { ...sc };
    setCurrentScenario(updated);
    setSimResult(canonicalNetworkSolver.solve(updated));
  };

  const handleToggleBreaker = (branchId: string) => {
    const updated = { ...currentScenario };
    if (branchId === 'branch-line-225') {
      updated.transmissionLineInService = !updated.transmissionLineInService;
    } else if (branchId === 'branch-feeder-4') {
      updated.feeder4BreakerClosed = !updated.feeder4BreakerClosed;
    }
    setCurrentScenario(updated);
    setSimResult(canonicalNetworkSolver.solve(updated));
  };

  const handleMotorModeChange = (mode: NetworkSimulationScenario['motorOperatingState']) => {
    const updated = { ...currentScenario, motorOperatingState: mode };
    setCurrentScenario(updated);
    setSimResult(canonicalNetworkSolver.solve(updated));
  };

  const handleTapChange = (delta: number) => {
    const newTap = Math.max(-5, Math.min(5, currentScenario.substationTransformerTap + delta));
    const updated = { ...currentScenario, substationTransformerTap: newTap };
    setCurrentScenario(updated);
    setSimResult(canonicalNetworkSolver.solve(updated));
  };

  // Bus coordinates on the SVG canvas (viewBox 0 0 1000 360)
  const busLayout: Record<string, { x: number; y: number; label: string; kv: string }> = {
    'node-gen-g1': { x: 70, y: 160, label: 'G1 Alternateur', kv: '10.5 kV' },
    'node-sub-songloulou': { x: 200, y: 160, label: 'Poste 225 kV Song.', kv: '225 kV' },
    'node-sub-oyomabang': { x: 420, y: 160, label: 'Poste 225 kV Oyo.', kv: '225 kV' },
    'node-bus-30-oyomabang': { x: 550, y: 160, label: 'JDB 30 kV HTA', kv: '30 kV' },
    'node-feeder-30-ind': { x: 700, y: 160, label: 'Poste Client HTA', kv: '30 kV' },
    'node-trafo-client-bt': { x: 800, y: 160, label: 'Transfo 1600kVA', kv: '0.4 kV' },
    'node-tgbt-400': { x: 890, y: 160, label: 'TGBT 400 V', kv: '400 V' },
    'node-motor-250': { x: 960, y: 260, label: 'Moteur 250 kW', kv: '400 V' },
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Top Toolbar: Scenario & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {locale === 'fr'
                ? 'Simulateur Topologique & Répartition des Charges (AC Load Flow)'
                : 'Topological Network Simulator & AC Power Flow'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {locale === 'fr'
                ? 'Résolution en temps réel des tensions de nœud, transits de puissance active/réactive et régimes de manœuvre'
                : 'Real-time bus voltage solutions, active/reactive power transfers, and contingency switching regimes'}
            </p>
          </div>
        </div>

        {/* Scenario Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">
            {locale === 'fr' ? 'Scénario :' : 'Scenario:'}
          </span>
          <select
            value={activeScenarioId}
            onChange={(e) => handleScenarioChange(e.target.value)}
            className="text-xs font-semibold bg-slate-900 border border-slate-700 text-blue-300 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            {CanonicalNetworkSolver.SCENARIOS.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.name[locale]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 text-xs">
        {/* Breaker 225 kV */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-[11px] font-mono">
            <span className="text-slate-400 block">{locale === 'fr' ? 'Ligne 225 kV' : '225 kV Line'}</span>
            <span className={currentScenario.transmissionLineInService ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {currentScenario.transmissionLineInService ? (locale === 'fr' ? 'FERMÉE' : 'CLOSED') : (locale === 'fr' ? 'DÉCLENCHÉE' : 'TRIPPED')}
            </span>
          </div>
          <button
            onClick={() => handleToggleBreaker('branch-line-225')}
            className={`p-1.5 rounded-md transition-colors ${
              currentScenario.transmissionLineInService
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            }`}
            title="Toggle Breaker"
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feeder 4 Breaker */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-[11px] font-mono">
            <span className="text-slate-400 block">{locale === 'fr' ? 'Départ 30 kV' : '30 kV Feeder'}</span>
            <span className={currentScenario.feeder4BreakerClosed ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {currentScenario.feeder4BreakerClosed ? (locale === 'fr' ? 'EN SERVICE' : 'IN SERVICE') : (locale === 'fr' ? 'OUVERT' : 'OPEN')}
            </span>
          </div>
          <button
            onClick={() => handleToggleBreaker('branch-feeder-4')}
            className={`p-1.5 rounded-md transition-colors ${
              currentScenario.feeder4BreakerClosed
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            }`}
            title="Toggle Feeder Breaker"
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Transformer OLTC Tap */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-[11px] font-mono">
            <span className="text-slate-400 block">{locale === 'fr' ? 'Prise Régleur T2' : 'OLTC Tap T2'}</span>
            <span className="text-cyan-400 font-bold">
              {currentScenario.substationTransformerTap > 0 ? `+${currentScenario.substationTransformerTap}%` : `${currentScenario.substationTransformerTap}%`}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleTapChange(-1.25)}
              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              title="Lower Tap"
            >
              -
            </button>
            <button
              onClick={() => handleTapChange(1.25)}
              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              title="Raise Tap"
            >
              +
            </button>
          </div>
        </div>

        {/* Motor State Select */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
          <div className="text-[11px] font-mono min-w-0">
            <span className="text-slate-400 block">{locale === 'fr' ? 'Régime Moteur' : 'Motor State'}</span>
            <select
              value={currentScenario.motorOperatingState}
              onChange={(e) => handleMotorModeChange(e.target.value as any)}
              className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer text-[11px] truncate w-full"
            >
              <option value="rated_run" className="bg-slate-900">Nominal (100%)</option>
              <option value="direct_starting" className="bg-slate-900">Direct DOL (6x In)</option>
              <option value="soft_starting" className="bg-slate-900">Soft-Starter (3x)</option>
              <option value="stopped" className="bg-slate-900">Arrêté (0 kW)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive SVG Diagram Canvas */}
      <div className="relative w-full overflow-x-auto bg-slate-950/90 rounded-xl border border-slate-800 p-2">
        <svg viewBox="0 0 1000 320" className="w-full min-w-[850px] h-auto select-none">
          <defs>
            {/* Animated power flow dash style */}
            <style>
              {`
                @keyframes powerFlowAnim {
                  from { stroke-dashoffset: 24; }
                  to { stroke-dashoffset: 0; }
                }
                .flow-active {
                  stroke-dasharray: 6 6;
                  animation: powerFlowAnim 1.2s linear infinite;
                }
              `}
            </style>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#3B82F6" />
            </marker>
          </defs>

          {/* Background Grid Lines */}
          <line x1="20" y1="160" x2="980" y2="160" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />

          {/* 1. Branch: Generator G1 to Substation Songloulou (10.5 kV) */}
          <line
            x1="70"
            y1="160"
            x2="200"
            y2="160"
            stroke={currentScenario.transmissionLineInService ? '#818CF8' : '#475569'}
            strokeWidth="4"
          />
          {currentScenario.transmissionLineInService && (
            <line x1="70" y1="160" x2="200" y2="160" stroke="#C7D2FE" strokeWidth="2" className="flow-active" />
          )}

          {/* Transformer T1 symbol (two intersecting circles) */}
          <g
            transform="translate(135, 160)"
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => onSelectNode?.('node-trafo-gsu')}
          >
            {selectedNodeId === 'node-trafo-gsu' && (
              <circle cx="0" cy="0" r="24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
            )}
            <circle cx="-10" cy="0" r="14" fill="#1E293B" stroke="#818CF8" strokeWidth="2.5" />
            <circle cx="10" cy="0" r="14" fill="#1E293B" stroke="#A78BFA" strokeWidth="2.5" />
            <text x="0" y="-22" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">T1 (10.5/225kV)</text>
          </g>

          {/* 2. Branch: 225 kV Line Songloulou to Oyomabang (120 km) */}
          <line
            x1="200"
            y1="160"
            x2="420"
            y2="160"
            stroke={currentScenario.transmissionLineInService ? '#A78BFA' : '#EF4444'}
            strokeWidth={selectedNodeId === 'node-line-225-bekoko' ? 7 : 5}
            className="cursor-pointer"
            onClick={() => onSelectNode?.('node-line-225-bekoko')}
          />
          {currentScenario.transmissionLineInService ? (
            <line
              x1="200"
              y1="160"
              x2="420"
              y2="160"
              stroke="#DDD6FE"
              strokeWidth="2"
              className="flow-active cursor-pointer"
              onClick={() => onSelectNode?.('node-line-225-bekoko')}
            />
          ) : (
            <g transform="translate(310, 160)">
              <rect x="-18" y="-12" width="36" height="24" rx="4" fill="#EF4444" />
              <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">OUVERT</text>
            </g>
          )}
          <text
            x="310"
            y="140"
            textAnchor="middle"
            fill={selectedNodeId === 'node-line-225-bekoko' ? '#38BDF8' : '#A78BFA'}
            fontSize="10"
            fontWeight="bold"
            className="cursor-pointer"
            onClick={() => onSelectNode?.('node-line-225-bekoko')}
          >
            Ligne 225 kV (120 km) - {simResult.branches[1]?.currentAmperes || 0} A
          </text>

          {/* 3. Branch: Transformer T2 225/30 kV */}
          <line
            x1="420"
            y1="160"
            x2="550"
            y2="160"
            stroke={currentScenario.transmissionLineInService ? '#A78BFA' : '#475569'}
            strokeWidth="4"
          />
          <g
            transform="translate(485, 160)"
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => onSelectNode?.('node-trafo-main-30')}
          >
            {selectedNodeId === 'node-trafo-main-30' && (
              <circle cx="0" cy="0" r="24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
            )}
            <circle cx="-10" cy="0" r="14" fill="#1E293B" stroke="#A78BFA" strokeWidth="2.5" />
            <circle cx="10" cy="0" r="14" fill="#1E293B" stroke="#60A5FA" strokeWidth="2.5" />
            <text x="0" y="-22" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">T2 (63 MVA)</text>
          </g>

          {/* 4. Branch: 30 kV MV Feeder 4 */}
          <line
            x1="550"
            y1="160"
            x2="700"
            y2="160"
            stroke={currentScenario.feeder4BreakerClosed && currentScenario.transmissionLineInService ? '#60A5FA' : '#EF4444'}
            strokeWidth="4"
            className="cursor-pointer"
            onClick={() => onSelectNode?.('node-feeder-30-ind')}
          />
          {currentScenario.feeder4BreakerClosed && currentScenario.transmissionLineInService && (
            <line
              x1="550"
              y1="160"
              x2="700"
              y2="160"
              stroke="#BFDBFE"
              strokeWidth="2"
              className="flow-active cursor-pointer"
              onClick={() => onSelectNode?.('node-feeder-30-ind')}
            />
          )}

          {/* 5. Branch: Customer Transformer 1600 kVA (30 kV / 400 V) */}
          <line
            x1="700"
            y1="160"
            x2="800"
            y2="160"
            stroke={currentScenario.feeder4BreakerClosed && currentScenario.transmissionLineInService ? '#60A5FA' : '#475569'}
            strokeWidth="3.5"
          />
          <g
            transform="translate(750, 160)"
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => onSelectNode?.('node-trafo-client-bt')}
          >
            {selectedNodeId === 'node-trafo-client-bt' && (
              <circle cx="0" cy="0" r="22" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
            )}
            <circle cx="-8" cy="0" r="12" fill="#1E293B" stroke="#60A5FA" strokeWidth="2" />
            <circle cx="8" cy="0" r="12" fill="#1E293B" stroke="#FB923C" strokeWidth="2" />
            <text x="0" y="-18" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">1600 kVA</text>
          </g>

          {/* 6. Branch: TGBT to Motor */}
          <line
            x1="800"
            y1="160"
            x2="890"
            y2="160"
            stroke={currentScenario.feeder4BreakerClosed && currentScenario.transmissionLineInService ? '#FB923C' : '#475569'}
            strokeWidth="4"
          />
          <line
            x1="890"
            y1="160"
            x2="890"
            y2="260"
            stroke={currentScenario.feeder4BreakerClosed && currentScenario.transmissionLineInService ? '#FB923C' : '#475569'}
            strokeWidth="4"
          />
          <line
            x1="890"
            y1="260"
            x2="960"
            y2="260"
            stroke={currentScenario.feeder4BreakerClosed && currentScenario.transmissionLineInService ? '#FB923C' : '#475569'}
            strokeWidth="3.5"
          />
          {currentScenario.motorOperatingState !== 'stopped' && currentScenario.feeder4BreakerClosed && currentScenario.transmissionLineInService && (
            <line x1="890" y1="260" x2="960" y2="260" stroke="#FED7AA" strokeWidth="2" className="flow-active" />
          )}

          {/* Render All Buses with Voltage Badges */}
          {simResult.buses.map((bus) => {
            const coords = busLayout[bus.busId];
            if (!coords) return null;
            const isSelected = selectedNodeId === bus.busId;

            return (
              <g
                key={bus.busId}
                transform={`translate(${coords.x}, ${coords.y})`}
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => onSelectNode?.(bus.busId)}
              >
                {/* Vertical Busbar */}
                <line
                  x1="0"
                  y1="-30"
                  x2="0"
                  y2="30"
                  stroke={bus.voltageColor}
                  strokeWidth={isSelected ? 6 : 4}
                  strokeLinecap="round"
                />

                {/* Selection Aura */}
                {isSelected && (
                  <circle cx="0" cy="0" r="22" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
                )}

                {/* Bus label & voltage text */}
                <text x="0" y="-38" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  {coords.label}
                </text>
                <text x="0" y="46" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">
                  {bus.actualVoltageKv} kV
                </text>
                <rect
                  x="-22"
                  y="52"
                  width="44"
                  height="16"
                  rx="3"
                  fill={bus.voltagePu >= 0.95 ? '#064E3B' : '#7F1D1D'}
                />
                <text x="0" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  {(bus.voltagePu * 100).toFixed(1)}%
                </text>
              </g>
            );
          })}

          {/* Motor Circle Symbol */}
          <g
            transform="translate(960, 260)"
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => onSelectNode?.('node-motor-250')}
          >
            {selectedNodeId === 'node-motor-250' && (
              <circle cx="0" cy="0" r="28" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
            )}
            <circle cx="0" cy="0" r="20" fill="#1E293B" stroke="#FB923C" strokeWidth="3" />
            <text x="0" y="5" textAnchor="middle" fill="#FB923C" fontSize="13" fontWeight="bold">M</text>
            <text x="0" y="36" textAnchor="middle" fill="#E2E8F0" fontSize="9" fontWeight="semibold">250 kW IE3</text>
          </g>

          {/* Generator G1 Symbol */}
          <g
            transform="translate(70, 160)"
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => onSelectNode?.('node-gen-g1')}
          >
            {selectedNodeId === 'node-gen-g1' && (
              <circle cx="0" cy="0" r="30" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
            )}
            <circle cx="0" cy="0" r="22" fill="#1E293B" stroke="#818CF8" strokeWidth="3" />
            <text x="0" y="5" textAnchor="middle" fill="#818CF8" fontSize="13" fontWeight="bold">G1</text>
            <text x="0" y="-38" textAnchor="middle" fill="#C7D2FE" fontSize="10" fontWeight="bold">Songloulou</text>
          </g>
        </svg>
      </div>

      {/* Bottom Summary Bar: Generation, Load, Losses, Grid Status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-mono">
            {locale === 'fr' ? 'Production Totale' : 'Total Generation'}
          </span>
          <span className="text-sm font-bold text-blue-400 font-mono">
            {simResult.totalGenerationMw} MW
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-mono">
            {locale === 'fr' ? 'Charge Totale' : 'Total System Load'}
          </span>
          <span className="text-sm font-bold text-emerald-400 font-mono">
            {simResult.totalLoadMw} MW
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-mono">
            {locale === 'fr' ? 'Pertes Réseau' : 'Active Grid Losses'}
          </span>
          <span className="text-sm font-bold text-amber-400 font-mono">
            {simResult.totalLossesMw} MW ({simResult.gridEfficiencyPercent}% {locale === 'fr' ? 'rendement' : 'eff.'})
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-mono">
            {locale === 'fr' ? 'État Réseau' : 'System State'}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded inline-block mt-0.5 ${
            simResult.systemStatus === 'normal'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              : simResult.systemStatus === 'warning'
              ? 'bg-amber-950 text-amber-300 border border-amber-800'
              : 'bg-red-950 text-red-300 border border-red-800'
          }`}>
            {simResult.systemStatus.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Status Messages */}
      {simResult.messages.length > 0 && (
        <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/40 text-xs text-blue-300 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <span>{simResult.messages[0][locale]}</span>
        </div>
      )}
    </div>
  );
};
