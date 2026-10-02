// src/components/grid/RealCameroonGeographicMap.tsx
// EPEDE - High-Precision Geographic Vector Map of Cameroon & National Power System
// Features: Real country borders, 10 administrative regions, Sanaga/Bénoué/Ntem hydro courses,
// animated 225/110/90 kV corridors with traveling electron pulses, and comprehensive flyout inspector.

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Zap,
  Activity,
  Layers,
  Droplets,
  Flame,
  Sun,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Building2,
  Info,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Maximize2,
  Minimize2,
  Compass,
  ArrowRight,
  TrendingUp,
  Cpu,
  Radio,
  FileText
} from 'lucide-react';
import {
  CAMEROON_NATIONAL_BORDER,
  CAMEROON_REGIONS,
  CAMEROON_RIVERS,
  CAMEROON_INFRASTRUCTURE_NODES,
  CAMEROON_GRID_CORRIDORS,
  CameroonRegionGeo,
  CameroonApparatusNode,
  CameroonGridCorridorGeo,
} from '../../data/cameroonGeoMapData';

interface RealCameroonGeographicMapProps {
  locale: 'fr' | 'en';
  onNavigateDiagram?: (topology?: string) => void;
  onNavigateCalculator?: (tab: any, context?: any) => void;
  onNavigateSimulation?: (tab: any) => void;
  onNavigateEquipment?: (equipmentId: string) => void;
}

export const RealCameroonGeographicMap: React.FC<RealCameroonGeographicMapProps> = ({
  locale,
  onNavigateDiagram,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateEquipment,
}) => {
  const isFr = locale === 'fr';

  // Filters & State
  const [selectedSystem, setSelectedSystem] = useState<'ALL' | 'RIS' | 'RIN' | 'INTERCONNECTION'>('ALL');
  const [selectedVoltage, setSelectedVoltage] = useState<'ALL' | 225 | 110 | 90>('ALL');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<CameroonApparatusNode | null>(CAMEROON_INFRASTRUCTURE_NODES[0]); // default to Nachtigal
  const [selectedCorridor, setSelectedCorridor] = useState<CameroonGridCorridorGeo | null>(null);
  
  // Layer Toggles
  const [showRegions, setShowRegions] = useState<boolean>(true);
  const [showRivers, setShowRivers] = useState<boolean>(true);
  const [showFlowAnimation, setShowFlowAnimation] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Node Map Lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, CameroonApparatusNode>();
    CAMEROON_INFRASTRUCTURE_NODES.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

  // Filtered Nodes
  const filteredNodes = useMemo(() => {
    return CAMEROON_INFRASTRUCTURE_NODES.filter((node) => {
      if (selectedSystem !== 'ALL' && node.system !== selectedSystem) return false;
      if (selectedVoltage !== 'ALL' && node.voltageKv !== selectedVoltage) return false;
      if (selectedRegionId && node.regionId !== selectedRegionId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          node.nameFr.toLowerCase().includes(q) ||
          node.nameEn.toLowerCase().includes(q) ||
          node.shortLabel.toLowerCase().includes(q) ||
          node.operator.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedSystem, selectedVoltage, selectedRegionId, searchQuery]);

  // Filtered Corridors
  const filteredCorridors = useMemo(() => {
    return CAMEROON_GRID_CORRIDORS.filter((corridor) => {
      if (selectedSystem !== 'ALL' && corridor.system !== selectedSystem) return false;
      if (selectedVoltage !== 'ALL' && corridor.voltageKv !== selectedVoltage) return false;
      return true;
    });
  }, [selectedSystem, selectedVoltage]);

  // National Capacity Totals
  const nationalStats = useMemo(() => {
    const totalMw = CAMEROON_INFRASTRUCTURE_NODES.reduce((acc, curr) => acc + (curr.nominalRatingMw || 0), 0);
    const hydroMw = CAMEROON_INFRASTRUCTURE_NODES.filter(n => n.type === 'hydro').reduce((acc, c) => acc + (c.nominalRatingMw || 0), 0);
    const thermalMw = CAMEROON_INFRASTRUCTURE_NODES.filter(n => n.type === 'thermal_gas' || n.type === 'thermal_hfo').reduce((acc, c) => acc + (c.nominalRatingMw || 0), 0);
    const solarMw = CAMEROON_INFRASTRUCTURE_NODES.filter(n => n.type === 'solar_bess').reduce((acc, c) => acc + (c.nominalRatingMw || 0), 0);
    return {
      totalMw,
      hydroMw,
      hydroPct: Math.round((hydroMw / totalMw) * 100),
      thermalMw,
      thermalPct: Math.round((thermalMw / totalMw) * 100),
      solarMw,
      solarPct: Math.round((solarMw / totalMw) * 100),
    };
  }, []);

  return (
    <div className="space-y-6">
      
      {/* 1. Header Toolbar with Dynamic Telemetry Cockpit */}
      <div className="bg-[#070D18] border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mb-1">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="uppercase tracking-wider">
                {isFr ? 'RÉPUBLIQUE DU CAMEROUN · SYSTÈME ÉLECTRIQUE NATIONAL (RIS / RIN)' : 'REPUBLIC OF CAMEROON · NATIONAL POWER SYSTEM (RIS / RIN)'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight flex items-center gap-3">
              <span>{isFr ? 'Carte Vectorielle du Réseau Électrique Camerounais' : 'Real Geographic Cameroon Power Grid Map'}</span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                WGS84 GEO-CALIBRATED
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {isFr
                ? 'Projection géographique authentique avec les 10 régions administratives, bassins hydrographiques majeurs (Sanaga, Bénoué, Ntem), centrales hydroélectriques (Songloulou, Nachtigal, Edéa, Memve\'ele, Lagdo), centrales thermiques/solaires et dorsales THT 225/110/90 kV SONATREL.'
                : 'Authentic geographic vector projection with 10 administrative regions, major river basins (Sanaga, Bénoué, Ntem), flagship hydropower plants, thermal/solar farms, and SONATREL 225/110/90 kV corridors.'}
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                {isFr ? 'Puissance Installée' : 'Installed Capacity'}
              </span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {nationalStats.totalMw.toLocaleString()} MW
              </span>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                {isFr ? 'Mix Hydro' : 'Hydro Share'}
              </span>
              <span className="text-sm font-bold font-mono text-cyan-400">
                {nationalStats.hydroPct}% ({nationalStats.hydroMw} MW)
              </span>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                {isFr ? 'Fréquence Réseau' : 'Grid Frequency'}
              </span>
              <span className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>50.02 Hz</span>
              </span>
            </div>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-800/80 text-xs font-mono">
          
          {/* System Selection: ALL / RIS / RIN / INTERCONNEXION */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedSystem('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSystem === 'ALL'
                  ? 'bg-slate-700 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isFr ? 'Tout le Cameroun' : 'All Cameroon'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedSystem('RIS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSystem === 'RIS'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-emerald-400 hover:text-white'
              }`}
            >
              RIS (Sud)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSystem('RIN')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSystem === 'RIN'
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : 'text-sky-400 hover:text-white'
              }`}
            >
              RIN (Nord)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSystem('INTERCONNECTION')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSystem === 'INTERCONNECTION'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-amber-400 hover:text-white'
              }`}
            >
              RIS ↔ RIN
            </button>
          </div>

          {/* Voltage Selection: ALL / 225 / 110 / 90 */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedVoltage('ALL')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                selectedVoltage === 'ALL'
                  ? 'bg-slate-700 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isFr ? 'Toutes Tensions' : 'All Tiers'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedVoltage(225)}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                selectedVoltage === 225
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-rose-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>225 kV</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedVoltage(110)}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                selectedVoltage === 110
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : 'text-sky-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>110 kV</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedVoltage(90)}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                selectedVoltage === 90
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-indigo-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>90 kV</span>
            </button>
          </div>

          {/* Map Layer Toggles */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowRegions(!showRegions)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                showRegions
                  ? 'bg-slate-800 text-slate-200 border-slate-700'
                  : 'bg-slate-950 text-slate-500 border-slate-850'
              }`}
            >
              {isFr ? '10 Régions' : '10 Regions'}
            </button>

            <button
              type="button"
              onClick={() => setShowRivers(!showRivers)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                showRivers
                  ? 'bg-cyan-950/60 text-cyan-300 border-cyan-700/50'
                  : 'bg-slate-950 text-slate-500 border-slate-850'
              }`}
            >
              {isFr ? 'Fleuves & Réservoirs' : 'Rivers & Basins'}
            </button>

            <button
              type="button"
              onClick={() => setShowFlowAnimation(!showFlowAnimation)}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                showFlowAnimation
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-600/50'
                  : 'bg-slate-950 text-slate-500 border-slate-850'
              }`}
              title={isFr ? 'Activer/Désactiver le transit d’électrons animé' : 'Toggle animated electron transit flow'}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isFr ? 'Flux Électrons' : 'Electron Flow'}</span>
            </button>

            {selectedRegionId && (
              <button
                type="button"
                onClick={() => setSelectedRegionId(null)}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors flex items-center gap-1"
                title={isFr ? 'Réinitialiser le zoom régional' : 'Reset regional zoom'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isFr ? 'Vue Globale' : 'Global View'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Map Canvas + Right Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Vector SVG Map Container (7 cols) */}
        <div className="lg:col-span-7 bg-[#050914] border border-slate-800 rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[640px]">
          
          {/* Subtle Radar & Geographic Watermark */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span>NORD 0° · GOLFE DE GUINÉE · RIS/RIN</span>
          </div>

          <div className="absolute top-4 right-4 z-10 font-mono text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
            <span>{filteredNodes.length} Nœuds · {filteredCorridors.length} Corridors THT</span>
          </div>

          {/* SVG Map Viewport */}
          <div className="relative w-full aspect-[1000/1200] max-h-[820px] my-auto">
            <svg
              viewBox="0 0 1000 1200"
              className="w-full h-full select-none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Glowing filters for voltages */}
                <filter id="glow-corridor-225" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-corridor-110" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-corridor-intercon" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.0" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Ocean Gradient */}
                <linearGradient id="ocean-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#032030" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#083344" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Atlantic Ocean / Bight of Biafra Coastline Backdrop */}
              <rect x="0" y="700" width="260" height="500" fill="url(#ocean-gradient)" />
              <text x="70" y="850" fill="#0891b2" fillOpacity="0.3" fontSize="18" fontFamily="monospace" fontWeight="bold">
                GOLFE DE GUINÉE
              </text>
              <text x="80" y="875" fill="#0891b2" fillOpacity="0.2" fontSize="12" fontFamily="monospace">
                (Océan Atlantique)
              </text>

              {/* National Border Silhouette */}
              <path
                d={CAMEROON_NATIONAL_BORDER}
                fill="#070E1C"
                stroke="#1E293B"
                strokeWidth="2.5"
                className="transition-colors"
              />

              {/* 10 Administrative Regions Outlines */}
              {showRegions && CAMEROON_REGIONS.map((region) => {
                const isSelected = selectedRegionId === region.id;
                const isHovered = hoveredRegionId === region.id;
                return (
                  <path
                    key={region.id}
                    d={region.pathD}
                    fill={isSelected ? `${region.color}35` : isHovered ? `${region.color}20` : '#0C1629'}
                    stroke={isSelected ? region.color : '#1E293B'}
                    strokeWidth={isSelected ? '2.5' : '1.2'}
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredRegionId(region.id)}
                    onMouseLeave={() => setHoveredRegionId(null)}
                    onClick={() => setSelectedRegionId(isSelected ? null : region.id)}
                  >
                    <title>{`${region.nameFr} (Capitale: ${region.capital}, Demande: ${region.peakDemandMw} MW)`}</title>
                  </path>
                );
              })}

              {/* Regional Names Labeling */}
              {showRegions && showLabels && CAMEROON_REGIONS.map((region) => (
                <text
                  key={`label-${region.id}`}
                  x={region.centerCoords.x}
                  y={region.centerCoords.y}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fillOpacity={selectedRegionId === region.id ? 1 : 0.65}
                  fontSize="12"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="pointer-events-none select-none tracking-wider"
                >
                  {region.nameFr.toUpperCase()}
                </text>
              ))}

              {/* Major Hydro Rivers (Sanaga, Bénoué, Ntem) */}
              {showRivers && CAMEROON_RIVERS.map((river) => (
                <g key={river.id}>
                  <path
                    d={river.pathD}
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="3.2"
                    strokeOpacity="0.75"
                    strokeLinecap="round"
                  />
                  {/* Subtle waterflow shimmer */}
                  <path
                    d={river.pathD}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1.2"
                    strokeDasharray="4, 12"
                    className="animate-pulse"
                  />
                </g>
              ))}

              {/* Transmission Corridors (225 kV, 110 kV, 90 kV) */}
              {filteredCorridors.map((corridor) => {
                const from = nodeMap.get(corridor.fromNodeId);
                const to = nodeMap.get(corridor.toNodeId);
                if (!from || !to) return null;

                const isSelected = selectedCorridor?.id === corridor.id;
                const is225 = corridor.voltageKv === 225;
                const is110 = corridor.voltageKv === 110;
                const isIntercon = corridor.system === 'INTERCONNECTION';

                const strokeColor = isIntercon 
                  ? '#F59E0B' // Golden for RIS-RIN project
                  : is225 
                    ? '#F43F5E' // Rose/Red for 225 kV
                    : is110 
                      ? '#38BDF8' // Sky blue for 110 kV
                      : '#818CF8'; // Indigo for 90 kV

                const strokeWidth = is225 ? 3.5 : is110 ? 2.5 : 2.0;

                return (
                  <g
                    key={corridor.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedCorridor(corridor);
                      setSelectedNode(null);
                    }}
                  >
                    {/* Wider hit-box line */}
                    <line
                      x1={from.coords.x}
                      y1={from.coords.y}
                      x2={to.coords.x}
                      y2={to.coords.y}
                      stroke="transparent"
                      strokeWidth="16"
                    />

                    {/* Underlying line */}
                    <line
                      x1={from.coords.x}
                      y1={from.coords.y}
                      x2={to.coords.x}
                      y2={to.coords.y}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? strokeWidth * 1.8 : strokeWidth}
                      strokeDasharray={corridor.status === 'under_construction' ? '6,6' : undefined}
                      strokeOpacity={isSelected ? 1 : 0.85}
                      filter={is225 ? 'url(#glow-corridor-225)' : is110 ? 'url(#glow-corridor-110)' : undefined}
                      className="transition-all"
                    />

                    {/* Animated Travelling Electron Pulses */}
                    {showFlowAnimation && corridor.status === 'operational' && (
                      <line
                        x1={from.coords.x}
                        y1={from.coords.y}
                        x2={to.coords.x}
                        y2={to.coords.y}
                        stroke="#FFFFFF"
                        strokeWidth={strokeWidth * 0.75}
                        strokeDasharray="4, 16"
                        strokeDashoffset="0"
                        strokeOpacity="0.9"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="40"
                          to="0"
                          dur={`${Math.max(1.0, 600 / (corridor.simulatedTransitMw || 100))}s`}
                          repeatCount="indefinite"
                        />
                      </line>
                    )}

                    {/* Transit MW badge in center of corridor */}
                    <circle
                      cx={(from.coords.x + to.coords.x) / 2}
                      cy={(from.coords.y + to.coords.y) / 2}
                      r="4"
                      fill={strokeColor}
                      className="group-hover:scale-150 transition-transform"
                    />
                  </g>
                );
              })}

              {/* Infrastructure Nodes (Hydro, Thermal, Solar, Substations) */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isHydro = node.type === 'hydro';
                const isThermal = node.type === 'thermal_gas' || node.type === 'thermal_hfo';
                const isSolar = node.type === 'solar_bess';
                const isDispatch = node.type === 'dispatching_center';

                const nodeColor = isDispatch
                  ? '#10B981' // Green for National Dispatching
                  : isHydro
                    ? '#06B6D4' // Cyan for Hydro
                    : isThermal
                      ? '#F97316' // Orange for Thermal
                      : isSolar
                        ? '#EAB308' // Yellow for Solar
                        : '#A855F7'; // Purple for Substations

                const nodeRadius = isDispatch ? 10 : node.nominalRatingMw && node.nominalRatingMw > 200 ? 9 : 7;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedNode(node);
                      setSelectedCorridor(null);
                    }}
                  >
                    {/* Animated Pulsing Halo for Flagship Plants & Dispatching */}
                    {(isDispatch || (node.nominalRatingMw && node.nominalRatingMw >= 200)) && (
                      <circle
                        cx={node.coords.x}
                        cy={node.coords.y}
                        r={nodeRadius * 2.2}
                        fill={nodeColor}
                        fillOpacity="0.15"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Selection Ring */}
                    {isSelected && (
                      <circle
                        cx={node.coords.x}
                        cy={node.coords.y}
                        r={nodeRadius + 6}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        strokeDasharray="3,3"
                        className="animate-spin-slow"
                      />
                    )}

                    {/* Node Core Shape */}
                    <circle
                      cx={node.coords.x}
                      cy={node.coords.y}
                      r={nodeRadius}
                      fill={nodeColor}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      className="transition-transform group-hover:scale-125"
                    />

                    {/* Node Inner Symbol */}
                    <circle
                      cx={node.coords.x}
                      cy={node.coords.y}
                      r={nodeRadius * 0.4}
                      fill="#050914"
                    />

                    {/* Text Label */}
                    {showLabels && (
                      <text
                        x={node.coords.x + 12}
                        y={node.coords.y + 4}
                        fill="#F8FAFC"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        className="pointer-events-none select-none drop-shadow-md"
                      >
                        {node.shortLabel}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Map Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-3.5 h-1 bg-rose-500 rounded" />
                <span>225 kV THT</span>
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-3.5 h-1 bg-sky-400 rounded" />
                <span>110 kV RIN</span>
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-3.5 h-1 bg-indigo-400 rounded" />
                <span>90 kV Répartition</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-3.5 h-1 border-t border-dashed border-amber-400" />
                <span>Projet RIS ↔ RIN</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Droplets className="w-3.5 h-3.5" />
                <span>Hydro</span>
              </span>
              <span className="flex items-center gap-1.5 text-orange-400">
                <Flame className="w-3.5 h-3.5" />
                <span>Gaz/HFO</span>
              </span>
              <span className="flex items-center gap-1.5 text-yellow-400">
                <Sun className="w-3.5 h-3.5" />
                <span>Solaire</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Radio className="w-3.5 h-3.5" />
                <span>Dispatching</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Flyout Engineering Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Node / Substation Selected Card */}
          {selectedNode && (
            <div className="bg-[#070D18] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      selectedNode.type === 'hydro' 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : selectedNode.type === 'dispatching_center'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : selectedNode.type === 'thermal_gas' || selectedNode.type === 'thermal_hfo'
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                            : selectedNode.type === 'solar_bess'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    }`}>
                      {selectedNode.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {selectedNode.code}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white font-mono mt-1.5">
                    {isFr ? selectedNode.nameFr : selectedNode.nameEn}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
                    {selectedNode.voltageKv} kV
                  </span>
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="grid grid-cols-2 gap-2.5 my-4 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">
                    {isFr ? 'Capacité / Puissance' : 'Installed Capacity'}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 mt-0.5 block">
                    {selectedNode.capacityOrMva}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">
                    {isFr ? 'Opérateur & Exploitant' : 'Grid Operator'}
                  </span>
                  <span className="text-xs font-bold text-cyan-400 mt-0.5 block">
                    {selectedNode.operator} ({selectedNode.commissioningYear})
                  </span>
                </div>
              </div>

              {/* Engineering Details */}
              <div className="space-y-2 text-xs font-sans text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div className="flex items-start gap-2">
                  <Layers className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200">{isFr ? 'Groupes & Travées : ' : 'Bays & Turbines: '}</span>
                    <span>{selectedNode.specDetails.baysOrGroups}</span>
                  </div>
                </div>

                {selectedNode.specDetails.transformationRatio && (
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200">{isFr ? 'Transformation GSU : ' : 'Step-up Ratio: '}</span>
                      <span>{selectedNode.specDetails.transformationRatio}</span>
                    </div>
                  </div>
                )}

                {selectedNode.specDetails.flowOrEfficiency && (
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200">{isFr ? 'Rôle & Productible : ' : 'Output & Role: '}</span>
                      <span>{selectedNode.specDetails.flowOrEfficiency}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons to SLD & Calculators */}
              <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3 border-t border-slate-800 font-mono text-xs">
                {selectedNode.sldTopologyRef && onNavigateDiagram && (
                  <button
                    type="button"
                    onClick={() => onNavigateDiagram(selectedNode.sldTopologyRef)}
                    className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Unifilaire SLD' : 'Open SLD'}</span>
                  </button>
                )}

                {onNavigateCalculator && (
                  <button
                    type="button"
                    onClick={() => onNavigateCalculator('short_circuit', {
                      busVoltageKv: selectedNode.voltageKv,
                      gridMva: 3500,
                    })}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Icc (CEI 60909)</span>
                  </button>
                )}

                {onNavigateSimulation && (
                  <button
                    type="button"
                    onClick={() => onNavigateSimulation('transients')}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Simulation</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Corridor Selected Card */}
          {selectedCorridor && (
            <div className="bg-[#070D18] border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                    {isFr ? 'LIAISON THT DE TRANSPORT' : 'HV TRANSMISSION CORRIDOR'} · {selectedCorridor.code}
                  </span>
                  <h3 className="text-sm font-bold text-white font-mono mt-1">
                    {isFr ? selectedCorridor.nameFr : selectedCorridor.nameEn}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
                  {selectedCorridor.voltageKv} kV
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 my-4 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">{isFr ? 'Longueur' : 'Length'}</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{selectedCorridor.lengthKm} km</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">{isFr ? 'Capacité Thermique' : 'Thermal Rating'}</span>
                  <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{selectedCorridor.thermalRatingMva} MVA</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">{isFr ? 'Transit Simulé' : 'Power Flow'}</span>
                  <span className="text-sm font-bold text-cyan-400 mt-0.5 block">{selectedCorridor.simulatedTransitMw} MW ({selectedCorridor.simulatedTransitMvar} Mvar)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">{isFr ? 'Pertes Joule Ligne' : 'Joule Losses'}</span>
                  <span className="text-sm font-bold text-amber-400 mt-0.5 block">{selectedCorridor.lossPercentage}%</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">{isFr ? 'Armement & Conducteur :' : 'Conductor Type:'}</span>
                <span className="text-emerald-300 font-bold">{selectedCorridor.conductorType} ({selectedCorridor.circuitCount === 2 ? 'Double Terne' : 'Simple Terne'})</span>
              </div>
            </div>
          )}

          {/* Regional Information Drawer when a Region is Clicked */}
          {selectedRegionId && (() => {
            const reg = CAMEROON_REGIONS.find(r => r.id === selectedRegionId);
            if (!reg) return null;
            return (
              <div className="bg-[#070D18] border border-amber-500/40 rounded-2xl p-4 shadow-xl text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: reg.color }} />
                    <span className="font-bold text-white text-sm">{isFr ? reg.nameFr : reg.nameEn}</span>
                  </div>
                  <span className="text-slate-400">{isFr ? 'Capitale :' : 'Capital:'} <strong className="text-white">{reg.capital}</strong></span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{isFr ? 'Taux Électrification' : 'Electrification Rate'}</span>
                    <span className="font-bold text-emerald-400 text-sm">{reg.electrificationRate}%</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{isFr ? 'Pointe Régionale' : 'Peak Demand'}</span>
                    <span className="font-bold text-amber-400 text-sm">{reg.peakDemandMw} MW</span>
                  </div>
                </div>

                <div className="text-slate-300">
                  <span className="text-slate-400 block mb-1">{isFr ? 'Sources Primaires :' : 'Primary Sources:'}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {reg.primaryEnergySources.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
};
