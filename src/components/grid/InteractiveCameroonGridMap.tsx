// src/components/grid/InteractiveCameroonGridMap.tsx
// EPEDE Priority #8 - Carte Réseau Cameroun Interactive SIG / SLD
// Hybrid Geographic GIS & Topological Single Line Diagram (SLD) of Cameroon National Grid (RIS & RIN)
// Provides interactive inspection of lines (impedance R+jX, thermal MVA, real-time simulated transit),
// substations (unifilaire mimic, busbars, circuit breakers), and power plants (Francis/Kaplan turbines, flow m³/s).

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
  Building2,
  Droplets,
  Flame,
  Sun,
  Maximize2,
  Minimize2,
  RotateCcw,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Compass,
  Sliders,
  ExternalLink,
  HelpCircle,
  X,
} from 'lucide-react';
import {
  CAMEROON_GRID_NODES,
  CAMEROON_GRID_LINES,
  GridGeoNode,
  GridGeoLine,
} from '../../data/cameroonGridGeoData';
import { AuditedValueBadge } from '../trust/AuditedValueBadge';
import { EvidenceProvenanceModal } from '../trust/EvidenceProvenanceModal';
import { AUDITED_PARAMETERS_REGISTRY, AuditedParameter } from '../../data/evidenceProvenanceData';

interface InteractiveCameroonGridMapProps {
  locale: 'fr' | 'en';
  onNavigateDiagram?: (topology?: string) => void;
  onNavigateCalculator?: (tab: any) => void;
  onNavigateSimulation?: (tab: any) => void;
}

export const InteractiveCameroonGridMap: React.FC<InteractiveCameroonGridMapProps> = ({
  locale,
  onNavigateDiagram,
  onNavigateCalculator,
  onNavigateSimulation,
}) => {
  const [viewMode, setViewMode] = useState<'gis' | 'sld'>('gis');
  const [activeSystemFilter, setActiveSystemFilter] = useState<'ALL' | 'RIS' | 'RIN'>('ALL');
  const [activeVoltageFilter, setActiveVoltageFilter] = useState<'ALL' | 225 | 90>('ALL');
  const [selectedNode, setSelectedNode] = useState<GridGeoNode | null>(CAMEROON_GRID_NODES[0]);
  const [selectedLine, setSelectedLine] = useState<GridGeoLine | null>(null);
  const [isFlowAnimated, setIsFlowAnimated] = useState(true);
  const [activeAuditParam, setActiveAuditParam] = useState<AuditedParameter | null>(null);

  // Nodes map lookup
  const nodesMap = useMemo(() => {
    const map = new Map<string, GridGeoNode>();
    CAMEROON_GRID_NODES.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return CAMEROON_GRID_NODES.filter((node) => {
      if (activeSystemFilter !== 'ALL' && node.system !== activeSystemFilter) {
        return false;
      }
      if (activeVoltageFilter !== 'ALL' && node.voltageKv !== activeVoltageFilter) {
        // Allow hydro plants with stepup transformers if 225 kV is selected
        if (activeVoltageFilter === 225 && node.voltageKv !== 225) return false;
        if (activeVoltageFilter === 90 && node.voltageKv > 110) return false;
      }
      return true;
    });
  }, [activeSystemFilter, activeVoltageFilter]);

  // Filtered lines
  const filteredLines = useMemo(() => {
    return CAMEROON_GRID_LINES.filter((line) => {
      if (activeSystemFilter !== 'ALL' && line.system !== activeSystemFilter && line.system !== 'INTERCONNECTION') {
        return false;
      }
      if (activeVoltageFilter !== 'ALL') {
        if (activeVoltageFilter === 225 && line.voltageKv < 225) return false;
        if (activeVoltageFilter === 90 && line.voltageKv >= 225) return false;
      }
      return true;
    });
  }, [activeSystemFilter, activeVoltageFilter]);

  // Topological coordinates mapping for SLD view
  const getNodeCoordinates = (node: GridGeoNode) => {
    if (viewMode === 'gis') {
      return { x: node.x, y: node.y };
    }
    // SLD topological orthogonal layout
    switch (node.id) {
      // RIN Cluster (North)
      case 'node-maroua': return { x: 75, y: 12 };
      case 'node-guider-maroua-solar': return { x: 70, y: 18 };
      case 'node-garoua': return { x: 70, y: 25 };
      case 'node-lagdo': return { x: 82, y: 25 };
      case 'node-ngaoundere': return { x: 65, y: 38 };

      // RIS Interconnection & East
      case 'node-lompangar': return { x: 75, y: 52 };
      case 'node-nachtigal': return { x: 50, y: 55 };

      // RIS Spine Central
      case 'node-nyom2': return { x: 50, y: 64 };
      case 'node-ahala': return { x: 50, y: 73 };
      case 'node-oyomabang': return { x: 42, y: 73 };

      // Central Hub Mangombé
      case 'node-songloulou': return { x: 28, y: 58 };
      case 'node-mangombe': return { x: 28, y: 68 };
      case 'node-edea': return { x: 20, y: 68 };

      // Littoral / West
      case 'node-logbaba': return { x: 20, y: 75 };
      case 'node-bekoko': return { x: 12, y: 62 };
      case 'node-bafoussam': return { x: 12, y: 50 };

      // South Deep
      case 'node-kribi': return { x: 28, y: 82 };
      case 'node-ebolowa': return { x: 50, y: 82 };
      case 'node-memveele': return { x: 50, y: 92 };

      default: return { x: node.x, y: node.y };
    }
  };

  const getLineStrokeColor = (line: GridGeoLine) => {
    if (line.status === 'under_construction') return '#eab308'; // Amber/Yellow
    if (line.voltageKv >= 225) return '#ef4444'; // Red/Crimson
    if (line.voltageKv >= 110) return '#38bdf8'; // Sky 400
    return '#0284c7'; // Cyan/Blue 600
  };

  const getNodeIcon = (type: GridGeoNode['type']) => {
    switch (type) {
      case 'hydro_plant':
        return <Droplets className="w-4 h-4 text-sky-400" />;
      case 'thermal_plant':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'solar_plant':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'dispatching':
        return <Activity className="w-4 h-4 text-emerald-400" />;
      default:
        return <Building2 className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header & View Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 text-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>SIG / SLD INTERACTIF</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              {locale === 'fr' ? 'Réseau National du Cameroun (SONATREL)' : 'Cameroon National Transmission Grid'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-mono font-black text-white uppercase tracking-tight">
            {locale === 'fr' ? 'Cartographie Hybride SIG & Schéma Unifilaire' : 'Hybrid GIS Map & Single Line Diagram'}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            {locale === 'fr'
              ? 'Explorez l\'épine dorsale 225/90 kV du RIS et du RIN. Cliquez sur un poste pour inspecter son schéma unifilaire (barres, disjoncteurs), une ligne pour ses impédances R+jX et son transit, ou une centrale pour ses groupes et son débit.'
              : 'Explore the 225/90 kV backbone of RIS and RIN grids. Click a substation to inspect its SLD mimic, a line for R+jX impedance and MW flow, or a power plant for Francis/Kaplan units.'}
          </p>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          
          {/* Mode switch: GIS vs SLD */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-700 flex items-center gap-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => setViewMode('gis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold ${
                viewMode === 'gis'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Carte SIG' : 'GIS Map'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('sld')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold ${
                viewMode === 'sld'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Unifilaire SLD' : 'SLD Network'}</span>
            </button>
          </div>

          {/* System filter: All / RIS / RIN */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-700 flex items-center gap-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveSystemFilter('ALL')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                activeSystemFilter === 'ALL'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? 'Tous' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setActiveSystemFilter('RIS')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                activeSystemFilter === 'RIS'
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              RIS (Sud)
            </button>
            <button
              type="button"
              onClick={() => setActiveSystemFilter('RIN')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                activeSystemFilter === 'RIN'
                  ? 'bg-sky-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              RIN (Nord)
            </button>
          </div>

          {/* Voltage filter: 225 / 90 */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-700 flex items-center gap-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveVoltageFilter('ALL')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                activeVoltageFilter === 'ALL'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {locale === 'fr' ? 'Toutes Tensions' : 'All kV'}
            </button>
            <button
              type="button"
              onClick={() => setActiveVoltageFilter(225)}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeVoltageFilter === 225
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-red-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>225 kV</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveVoltageFilter(90)}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeVoltageFilter === 90
                  ? 'bg-sky-600 text-white font-bold'
                  : 'text-sky-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>90/110 kV</span>
            </button>
          </div>

          {/* Toggle Flow Animation */}
          <button
            type="button"
            onClick={() => setIsFlowAnimated(!isFlowAnimated)}
            className={`p-2 rounded-xl border font-mono text-xs transition-colors flex items-center gap-1.5 ${
              isFlowAnimated
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
            title={locale === 'fr' ? 'Activer/Désactiver l\'animation des flux MW' : 'Toggle MW flow animation'}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{locale === 'fr' ? 'Flux Dynamiques' : 'Dynamic Flow'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map & Details Splitter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SVG Map Canvas (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-2xl min-h-[580px] flex flex-col justify-between">
          
          {/* Subtle Map Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          
          {/* Top Canvas Legend & Status */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-3 h-1 bg-red-500 rounded" />
                <span>225 kV Transport</span>
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-3 h-1 bg-sky-500 rounded" />
                <span>90 / 110 kV Répartition</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-3 h-1 border-t border-dashed border-amber-400" />
                <span>Interconnexion Projet</span>
              </span>
            </div>

            <div className="text-slate-400 text-[11px] bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
              {viewMode === 'gis' ? 'SIG: Géo-calage WGS84' : 'SLD: Topologie Unifilaire'} · {filteredNodes.length} Nœuds · {filteredLines.length} Liaisons
            </div>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] max-h-[640px] my-auto">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full select-none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Glow filter for 225 kV lines */}
                <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="0.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="0.6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background Country Silhouette Guide (Cameroon shape approximation) */}
              {viewMode === 'gis' && (
                <path
                  d="M 64,10 L 68,16 L 63,28 L 57,38 L 72,50 L 72,60 L 52,88 L 40,88 L 32,80 L 32,65 L 28,62 L 34,50 L 55,26 L 60,18 Z"
                  fill="#0f172a"
                  fillOpacity="0.4"
                  stroke="#334155"
                  strokeWidth="0.4"
                  strokeDasharray="1,1"
                />
              )}

              {/* Render Transmission Lines */}
              {filteredLines.map((line) => {
                const fromNode = nodesMap.get(line.fromNodeId);
                const toNode = nodesMap.get(line.toNodeId);
                if (!fromNode || !toNode) return null;

                const fromCoords = getNodeCoordinates(fromNode);
                const toCoords = getNodeCoordinates(toNode);
                const isSelected = selectedLine?.id === line.id;
                const strokeColor = getLineStrokeColor(line);
                const strokeWidth = line.voltageKv >= 225 ? 1.4 : 0.9;

                return (
                  <g
                    key={line.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedLine(line);
                      setSelectedNode(null);
                    }}
                  >
                    {/* Invisible thick stroke for easier clicking */}
                    <line
                      x1={fromCoords.x}
                      y1={fromCoords.y}
                      x2={toCoords.x}
                      y2={toCoords.y}
                      stroke="transparent"
                      strokeWidth="5"
                    />

                    {/* Underlying line with glow */}
                    <line
                      x1={fromCoords.x}
                      y1={fromCoords.y}
                      x2={toCoords.x}
                      y2={toCoords.y}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? strokeWidth * 2 : strokeWidth}
                      strokeDasharray={line.status === 'under_construction' ? '2,2' : undefined}
                      opacity={isSelected ? 1 : 0.8}
                      filter={line.voltageKv >= 225 ? 'url(#glow-red)' : 'url(#glow-blue)'}
                      className="transition-all"
                    />

                    {/* Animated Pulsing Dash Line showing MW Power Flow Direction */}
                    {isFlowAnimated && line.status === 'operational' && (
                      <line
                        x1={fromCoords.x}
                        y1={fromCoords.y}
                        x2={toCoords.x}
                        y2={toCoords.y}
                        stroke="#ffffff"
                        strokeWidth={strokeWidth * 0.7}
                        strokeDasharray="2, 6"
                        strokeDashoffset="0"
                        opacity={0.7}
                        className="animate-pulse"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="16"
                          to="0"
                          dur={`${Math.max(1.2, 500 / line.simulatedTransitMw)}s`}
                          repeatCount="indefinite"
                        />
                      </line>
                    )}

                    {/* Center line transit pill hover tooltip marker */}
                    <circle
                      cx={(fromCoords.x + toCoords.x) / 2}
                      cy={(fromCoords.y + toCoords.y) / 2}
                      r="1.2"
                      fill={strokeColor}
                      className="group-hover:r-2 transition-all"
                    />
                  </g>
                );
              })}

              {/* Render Network Nodes */}
              {filteredNodes.map((node) => {
                const coords = getNodeCoordinates(node);
                const isSelected = selectedNode?.id === node.id;
                const isHydro = node.type === 'hydro_plant';
                const isThermal = node.type === 'thermal_plant';
                const isSolar = node.type === 'solar_plant';
                const isDispatch = node.type === 'dispatching';

                let nodeColor = '#38bdf8'; // Sky
                if (isHydro) nodeColor = '#06b6d4'; // Cyan
                if (isThermal) nodeColor = '#f97316'; // Orange
                if (isSolar) nodeColor = '#eab308'; // Yellow
                if (isDispatch) nodeColor = '#10b981'; // Emerald

                const radius = isDispatch || isHydro ? 3.2 : 2.5;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedNode(node);
                      setSelectedLine(null);
                    }}
                  >
                    {/* Highlight ring if selected */}
                    {isSelected && (
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={radius + 3}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="0.8"
                        strokeDasharray="2,2"
                        className="animate-spin"
                        style={{ transformOrigin: `${coords.x}px ${coords.y}px` }}
                      />
                    )}

                    {/* Outer node circle */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={radius}
                      fill="#020617"
                      stroke={nodeColor}
                      strokeWidth={isSelected ? '1.2' : '0.8'}
                      className="group-hover:scale-125 transition-transform"
                      style={{ transformOrigin: `${coords.x}px ${coords.y}px` }}
                    />

                    {/* Inner core */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={radius * 0.5}
                      fill={nodeColor}
                    />

                    {/* Node label */}
                    <text
                      x={coords.x + 3.5}
                      y={coords.y + 1}
                      fill="#f8fafc"
                      fontSize="2.4"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="drop-shadow group-hover:fill-sky-300 transition-colors pointer-events-none"
                    >
                      {node.shortName}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom helper notes */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800">
            <span>{locale === 'fr' ? 'Cliquez sur un poste, une centrale ou une ligne pour inspecter' : 'Click any node or corridor to inspect'}</span>
            <span className="text-emerald-400 font-semibold">{locale === 'fr' ? 'SONATREL SCADA Émulé' : 'Emulated SCADA Telemetry'}</span>
          </div>
        </div>

        {/* Inspection Panel (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Substation or Power Plant Inspection Drawer */}
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100 space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-sky-400 border border-slate-700">
                      {getNodeIcon(selectedNode.type)}
                      <span>{selectedNode.code}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      {selectedNode.voltageKv} kV
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {selectedNode.system}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white mt-1">
                    {selectedNode.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    {selectedNode.capacityOrRating}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Live Telemetry Meters Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">{locale === 'fr' ? 'Puissance Active P' : 'Active Power P'}</span>
                  <span className="text-lg font-black text-amber-400 mt-0.5 block">{selectedNode.liveStatus.mwActive} MW</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">{locale === 'fr' ? 'Puissance Réactive Q' : 'Reactive Power Q'}</span>
                  <span className="text-lg font-black text-sky-400 mt-0.5 block">{selectedNode.liveStatus.mvarReactive} Mvar</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 uppercase block">{locale === 'fr' ? 'Tension / Fréq' : 'Voltage / Freq'}</span>
                  <span className="text-sm font-black text-emerald-400 mt-1 block">
                    {selectedNode.liveStatus.voltagePerUnit} pu · {selectedNode.liveStatus.frequencyHz} Hz
                  </span>
                </div>
              </div>

              {/* Specific for Hydro Plant: Turbines, Flow and Units */}
              {selectedNode.type === 'hydro_plant' && (
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-cyan-300 font-mono font-bold">
                    <span className="flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-cyan-400" />
                      <span>{locale === 'fr' ? 'Débit Turbiné & Aménagement Hydraulique' : 'Turbined Flow & Hydro Scheme'}</span>
                    </span>
                    <span className="text-cyan-200">{selectedNode.liveStatus.flowM3s} m³/s</span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedNode.unitsOrBays}
                  </div>
                  <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-cyan-400 border-t border-cyan-900/60">
                    <span>{locale === 'fr' ? 'Disponibilité des groupes :' : 'Unit Availability:'}</span>
                    <span className="font-bold text-white">{selectedNode.liveStatus.activeUnits}</span>
                  </div>
                </div>
              )}

              {/* Substation SLD Mimic Diagram Preview */}
              {(selectedNode.type.includes('substation') || selectedNode.type === 'dispatching') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>{locale === 'fr' ? 'Schéma Unifilaire du Poste (SLD Mimic)' : 'Substation Single Line Diagram (SLD)'}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
                      {selectedNode.sldTopology}
                    </span>
                  </div>

                  {/* Interactive Substation Mimic SVG */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <svg viewBox="0 0 240 110" className="w-full h-auto">
                      {/* Busbar 1 (Jeu de barres 1) */}
                      <line x1="20" y1="25" x2="220" y2="25" stroke="#ef4444" strokeWidth="2.5" />
                      <text x="25" y="20" fill="#f87171" fontSize="7" fontFamily="monospace">JEU DE BARRES 1 (225 kV)</text>

                      {/* Busbar 2 (Jeu de barres 2) */}
                      <line x1="20" y1="45" x2="220" y2="45" stroke="#ef4444" strokeWidth="2.5" />
                      <text x="25" y="40" fill="#f87171" fontSize="7" fontFamily="monospace">JEU DE BARRES 2 (225 kV)</text>

                      {/* Bay 1: Incoming line */}
                      <line x1="60" y1="25" x2="60" y2="85" stroke="#94a3b8" strokeWidth="1.2" />
                      <rect x="55" y="55" width="10" height="10" fill="#10b981" stroke="#34d399" strokeWidth="1" rx="2" />
                      <text x="60" y="62" fill="#ffffff" fontSize="6" fontFamily="monospace" textAnchor="middle">DJ1</text>
                      <text x="60" y="98" fill="#cbd5e1" fontSize="6" fontFamily="monospace" textAnchor="middle">Départ Ligne</text>

                      {/* Bay 2: Coupler (Tronçonnement / Couplage barres) */}
                      <line x1="120" y1="25" x2="120" y2="45" stroke="#94a3b8" strokeWidth="1.2" />
                      <rect x="115" y="30" width="10" height="10" fill="#10b981" stroke="#34d399" strokeWidth="1" rx="2" />
                      <text x="120" y="37" fill="#ffffff" fontSize="6" fontFamily="monospace" textAnchor="middle">QC</text>
                      <text x="120" y="58" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="middle">Couplage</text>

                      {/* Bay 3: Autotransformer 225/90 kV */}
                      <line x1="180" y1="45" x2="180" y2="85" stroke="#94a3b8" strokeWidth="1.2" />
                      <rect x="175" y="55" width="10" height="10" fill="#10b981" stroke="#34d399" strokeWidth="1" rx="2" />
                      <text x="180" y="62" fill="#ffffff" fontSize="6" fontFamily="monospace" textAnchor="middle">DJ2</text>
                      {/* Transformer 2 circles */}
                      <circle cx="180" cy="80" r="5" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
                      <circle cx="180" cy="86" r="5" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
                      <text x="180" y="102" fill="#38bdf8" fontSize="6" fontFamily="monospace" textAnchor="middle">ATR 100 MVA</text>
                    </svg>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {selectedNode.unitsOrBays}
                  </div>
                </div>
              )}

              {/* Provenance Audit Link */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <AuditedValueBadge
                  paramId="param-transfo-ucc-12"
                  locale={locale}
                  variant="full-pill"
                />

                {onNavigateDiagram && (
                  <button
                    type="button"
                    onClick={() => onNavigateDiagram(selectedNode.sldTopology)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold transition-all shadow-xs"
                  >
                    <span>{locale === 'fr' ? 'Ouvrir SLD Complet' : 'Open Full SLD'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Line Corridor Inspection Drawer */}
          {selectedLine && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100 space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-red-400 border border-red-500/40">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{selectedLine.voltageKv} kV</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {selectedLine.lengthKm} km · {selectedLine.system}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      selectedLine.status === 'operational'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                    }`}>
                      {selectedLine.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-mono text-white mt-1">
                    {selectedLine.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    {selectedLine.conductorType}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLine(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Transit & Load Flow Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 uppercase">{locale === 'fr' ? 'Transit Simulé en Temps Réel' : 'Simulated Real-Time Transit'}</span>
                  <span className="font-bold text-emerald-400">{Math.round((selectedLine.simulatedTransitMw / selectedLine.thermalRatingMva) * 100)}% de charge</span>
                </div>

                <div className="flex items-baseline justify-between font-mono">
                  <div className="text-2xl font-black text-white">
                    {selectedLine.simulatedTransitMw} <span className="text-xs font-normal text-slate-400">MW</span>
                  </div>
                  <div className="text-sm font-bold text-sky-400">
                    + {selectedLine.simulatedTransitMvar} Mvar
                  </div>
                  <div className="text-xs text-slate-400">
                    S_th max: {selectedLine.thermalRatingMva} MVA
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${Math.min(100, (selectedLine.simulatedTransitMw / selectedLine.thermalRatingMva) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Electrical Impedance Table (R + jX) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 uppercase">
                  <span>{locale === 'fr' ? 'Paramètres d\'Impédance Linéique' : 'Line Impedance Parameters'}</span>
                  <span className="text-sky-400">Carson / CEI 60909</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">R (Résistance)</span>
                    <span className="text-white font-bold">{selectedLine.resistanceOhmPerKm} Ω/km</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Totale: {(selectedLine.resistanceOhmPerKm * selectedLine.lengthKm).toFixed(2)} Ω
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">X (Réactance)</span>
                    <span className="text-amber-400 font-bold">{selectedLine.reactanceOhmPerKm} Ω/km</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Totale: {(selectedLine.reactanceOhmPerKm * selectedLine.lengthKm).toFixed(2)} Ω
                    </span>
                  </div>
                </div>
              </div>

              {/* Audit / Provenance Badge */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <AuditedValueBadge
                  paramId="param-ligne-225-r-x"
                  locale={locale}
                  variant="full-pill"
                />

                {onNavigateSimulation && (
                  <button
                    type="button"
                    onClick={() => onNavigateSimulation('load-flow')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold transition-all shadow-xs"
                  >
                    <span>{locale === 'fr' ? 'Calculer Transit' : 'Solve Load Flow'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* If neither node nor line is selected: Quick Guide Card */}
          {!selectedNode && !selectedLine && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <Compass className="w-8 h-8 text-sky-400 mx-auto" />
              <h4 className="text-sm font-bold font-mono text-white">
                {locale === 'fr' ? 'Sélectionnez un ouvrage sur la carte' : 'Select a grid asset on map'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {locale === 'fr'
                  ? 'Cliquez sur l\'une des centrales majeures (Songloulou, Nachtigal, Édéa, Lagdo), l\'un des postes sources d\'interconnexion (Mangombé, Bekoko, Ahala) ou l\'une des artères 225 kV pour ouvrir son dossier technique complet.'
                  : 'Click any major power plant (Songloulou, Nachtigal, Lagdo), intertie substation (Mangombé, Bekoko, Ahala) or 225 kV line to open its technical datasheet.'}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
