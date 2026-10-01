// src/components/digitaltwin/modules/SubstationBay3DCanvas.tsx
import React, { useState } from 'react';
import {
  SUBSTATION_BAY_EQUIPMENT_3D,
  CLEARANCE_AUDIT_RULES_225KV
} from '../data/geotwinData';
import { BayEquipment3D, ClearanceRuleAudit } from '../../../types/geotwin';
import {
  Eye,
  Camera,
  ShieldCheck,
  Flame,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Info,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';

interface SubstationBay3DCanvasProps {
  locale: 'fr' | 'en';
  onInspectAas?: (assetId: string) => void;
  onNavigateEquipment?: (id: string) => void;
}

type CameraViewMode = 'isometric' | 'elevation_front' | 'plan_top' | 'pedestrian_walkway';

export const SubstationBay3DCanvas: React.FC<SubstationBay3DCanvasProps> = ({
  locale,
  onInspectAas,
  onNavigateEquipment
}) => {
  const [viewMode, setViewMode] = useState<CameraViewMode>('isometric');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedEquipment, setSelectedEquipment] = useState<BayEquipment3D | null>(
    SUBSTATION_BAY_EQUIPMENT_3D[5] // SF6 Circuit breaker by default
  );
  const [showClearanceEnvelopes, setShowClearanceEnvelopes] = useState<boolean>(true);
  const [showThermographyOverlay, setShowThermographyOverlay] = useState<boolean>(false);
  const [showTelemetryOverlay, setShowTelemetryOverlay] = useState<boolean>(true);
  const [activeClearanceRule, setActiveClearanceRule] = useState<ClearanceRuleAudit | null>(null);

  // Projection math based on viewMode
  // Canvas width: 1000, height: 600
  const project3D = (x: number, y: number, z: number) => {
    // Bay runs along X (0 to 45 meters), Y is lateral (-10 to +10 meters), Z is height (0 to 25 meters)
    const centerX = 500 + panOffset.x;
    const centerY = 340 + panOffset.y;
    const scale = 16 * zoomLevel;

    if (viewMode === 'isometric') {
      // Isometric projection: 30-degree isometric axes
      const isoX = (x - 22) * 0.866 - y * 0.866;
      const isoY = (x - 22) * 0.5 + y * 0.5 - z * 1.0;
      return {
        px: centerX + isoX * scale,
        py: centerY + isoY * scale
      };
    } else if (viewMode === 'elevation_front') {
      // Front elevation: looking from side, X on horizontal, Z on vertical
      return {
        px: centerX + (x - 22) * scale * 1.1,
        py: centerY - z * scale * 1.1 + 80
      };
    } else if (viewMode === 'plan_top') {
      // Top plan view: looking down, X on horizontal, Y on vertical
      return {
        px: centerX + (x - 22) * scale * 1.2,
        py: centerY + y * scale * 1.5
      };
    } else {
      // Pedestrian walkway: perspective from eye-height (z=1.8, y=-6)
      const dist = (x + 10);
      const persScale = Math.max(0.4, 1.8 - dist * 0.02) * scale;
      return {
        px: centerX + (x - 20) * persScale * 1.2,
        py: centerY - (z - 1.8) * persScale + 120
      };
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 3D Viewport Controls & Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Camera perspective buttons */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80">
          <span className="text-[11px] font-mono text-slate-400 font-bold px-2 uppercase flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            {locale === 'fr' ? 'Caméra 3D' : '3D Camera'}
          </span>
          <button
            type="button"
            onClick={() => setViewMode('isometric')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              viewMode === 'isometric'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {locale === 'fr' ? 'Isométrique' : 'Isometric 3D'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('elevation_front')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              viewMode === 'elevation_front'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {locale === 'fr' ? 'Élévation (Face)' : 'Elevation (Front)'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('plan_top')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              viewMode === 'plan_top'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {locale === 'fr' ? 'Plan (Vue du dessus)' : 'Plan (Top View)'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('pedestrian_walkway')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              viewMode === 'pedestrian_walkway'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {locale === 'fr' ? 'Allée Piétonne (1.8m)' : 'Walkway Eye-Level'}
          </button>
        </div>

        {/* Feature Toggles & Zoom */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Clearance Envelopes IEC 61936 */}
          <button
            type="button"
            onClick={() => setShowClearanceEnvelopes(!showClearanceEnvelopes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
              showClearanceEnvelopes
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Gabarits d'isolement diélectrique CEI 61936-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{locale === 'fr' ? 'Gabarits CEI 61936-1' : 'IEC 61936 Clearances'}</span>
          </button>

          {/* Thermography Heatmap FLIR */}
          <button
            type="button"
            onClick={() => setShowThermographyOverlay(!showThermographyOverlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
              showThermographyOverlay
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Superposition caméra thermique infrarouge"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{locale === 'fr' ? 'Thermographie IR' : 'IR Thermography'}</span>
          </button>

          {/* Live SCADA Telemetry Overlay */}
          <button
            type="button"
            onClick={() => setShowTelemetryOverlay(!showTelemetryOverlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
              showTelemetryOverlay
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Télémétrie temps réel SCADA"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>{locale === 'fr' ? 'Télémétrie SCADA' : 'SCADA Telemetry'}</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.15))}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 w-9 text-center font-bold">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoomLevel(1.0);
                setPanOffset({ x: 0, y: 0 });
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas + Side Inspection Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: Interactive Vector 3D Substation Bay Scene */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Spatial Metadata Watermark */}
          <div className="absolute top-3 left-4 pointer-events-none z-10">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>POSTE HTB 225 kV · TRAVÉE LIGNE AIS DOUBLE BARRE</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              IEC 61936-1 / IEC 62271-100 / IEC 60826 · Digital Twin Model
            </p>
          </div>

          {/* Live Telemetry Floating HUD */}
          {showTelemetryOverlay && (
            <div className="absolute top-14 left-4 z-10 p-3 rounded-xl bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 text-xs font-mono shadow-xl space-y-1.5 pointer-events-auto">
              <div className="flex items-center justify-between gap-4 text-[10px] text-cyan-300 font-bold border-b border-cyan-500/20 pb-1">
                <span>SCADA LIVE TELEMETRY</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">U_Barre A:</span>
                  <span className="text-white font-bold">228.4 kV</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">U_Barre B:</span>
                  <span className="text-white font-bold">227.9 kV</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">P_Actif:</span>
                  <span className="text-amber-300 font-bold">142.6 MW ➔</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">Q_Réactif:</span>
                  <span className="text-sky-300 font-bold">31.8 Mvar</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">I_Ligne:</span>
                  <span className="text-emerald-300 font-bold">382.4 A</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">T_Ambiante:</span>
                  <span className="text-purple-300 font-bold">28.5 °C</span>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Substation Event & Alarm Strip */}
          <div className="absolute bottom-2 left-4 right-4 z-10 py-1.5 px-3 rounded-lg bg-slate-950/85 backdrop-blur-sm border border-slate-800 text-[11px] font-mono flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300 truncate">
                {locale === 'fr'
                  ? 'SCADA POSTE BEKOKO 225 kV : Pression SF6 Q0 = 6.1 bar (Nominal) · Sectionneurs Q1/Q2 verrouillés'
                  : 'SCADA BEKOKO 225 kV: SF6 Density Q0 = 6.1 bar (Nominal) · Disconnectors Q1/Q2 interlocked'}
              </span>
            </div>
            <span className="text-cyan-400 shrink-0 font-bold ml-2">IEC 61850 GOOSE OK</span>
          </div>

          {/* SVG Vector Canvas */}
          <svg
            viewBox="0 0 1000 580"
            className="w-full h-[540px] select-none cursor-crosshair"
            style={{ background: 'radial-gradient(ellipse at 50% 40%, #0d1527 0%, #030712 100%)' }}
          >
            <defs>
              {/* Ground Grid Pattern */}
              <pattern id="groundGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.4" />
              </pattern>

              {/* Linear gradient for metallic lattice gantry */}
              <linearGradient id="gantrySteel" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>

              {/* Porcelain Insulator gradient */}
              <linearGradient id="porcelainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="50%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>

              {/* Silicon Composite Insulator gradient */}
              <linearGradient id="compositeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0f766e" />
                <stop offset="50%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#115e59" />
              </linearGradient>

              {/* Tubular Busbar Aluminum gradient */}
              <linearGradient id="alumBusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="40%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>

              {/* Glow filter for energized conductors */}
              <filter id="energizedGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. Ground Substation Floor (Switchyard Gravel & Earthing Mat Mesh) */}
            {viewMode !== 'plan_top' && (
              <g id="groundFloorMesh" opacity="0.6">
                {/* Switchyard gravel perimeter boundary */}
                <polygon
                  points="120,440 880,440 940,510 60,510"
                  fill="#0b1120"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                />
                {/* Pedestrian concrete walkway */}
                <polygon
                  points="180,450 820,450 850,480 150,480"
                  fill="#111827"
                  stroke="#334155"
                  strokeWidth="1"
                />
                <text x="500" y="470" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  {locale === 'fr' ? 'ALLÉE DE CIRCULATION PIÉTONNE & ACCÈS NACELLES' : 'PEDESTRIAN WALKWAY & CRANE ACCESS'}
                </text>
              </g>
            )}

            {/* 2. Concrete Equipment Plinths (Massifs Béton) */}
            {SUBSTATION_BAY_EQUIPMENT_3D.map((eq) => {
              if (eq.category === 'busbar') return null;
              const base = project3D(eq.position3D.x, eq.position3D.y, 0);
              return (
                <g key={`plinth-${eq.id}`} opacity="0.8">
                  <ellipse
                    cx={base.px}
                    cy={base.py}
                    rx={viewMode === 'plan_top' ? 18 : 22}
                    ry={viewMode === 'plan_top' ? 18 : 9}
                    fill="#1e293b"
                    stroke="#475569"
                    strokeWidth="1.2"
                  />
                  {/* Earthing connection tag to ground mesh */}
                  <line
                    x1={base.px - 14}
                    y1={base.py}
                    x2={base.px - 26}
                    y2={base.py + 6}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                </g>
              );
            })}

            {/* 3. Safety Clearance Envelopes (IEC 61936-1) */}
            {showClearanceEnvelopes &&
              SUBSTATION_BAY_EQUIPMENT_3D.map((eq) => {
                if (eq.category === 'gantry' || eq.category === 'bcu_kiosk') return null;
                const top = project3D(eq.position3D.x, eq.position3D.y, eq.dimensions.height);
                return (
                  <g key={`clearance-${eq.id}`} opacity="0.45">
                    {/* Phase-to-Earth clearance sphere (2.1m boundary) */}
                    <circle
                      cx={top.px}
                      cy={top.py}
                      r={32 * zoomLevel}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeDasharray="4,3"
                    />
                    {/* Live safety clearance tag */}
                    <text
                      x={top.px}
                      y={top.py - 35 * zoomLevel}
                      fill="#34d399"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      N=2100mm
                    </text>
                  </g>
                );
              })}

            {/* 4. Overhead Rigid Tubular Busbars BB1 & BB2 */}
            {(() => {
              const bb1Start = project3D(37, -10, 11.5);
              const bb1End = project3D(37, 10, 11.5);
              const bb2Start = project3D(42, -10, 14.5);
              const bb2End = project3D(42, 10, 14.5);
              return (
                <g id="tubularBusbars" opacity="0.95">
                  {/* Busbar 1 (Lower level @ 11.5m) */}
                  <line
                    x1={bb1Start.px}
                    y1={bb1Start.py}
                    x2={bb1End.px}
                    y2={bb1End.py}
                    stroke="url(#alumBusGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    filter="url(#energizedGlow)"
                  />
                  <text
                    x={(bb1Start.px + bb1End.px) / 2}
                    y={(bb1Start.py + bb1End.py) / 2 - 12}
                    fill="#38bdf8"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    BUS 1 (225 kV - Ø120mm)
                  </text>

                  {/* Busbar 2 (Upper level @ 14.5m) */}
                  <line
                    x1={bb2Start.px}
                    y1={bb2Start.py}
                    x2={bb2End.px}
                    y2={bb2End.py}
                    stroke="url(#alumBusGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    filter="url(#energizedGlow)"
                  />
                  <text
                    x={(bb2Start.px + bb2End.px) / 2}
                    y={(bb2Start.py + bb2End.py) / 2 - 12}
                    fill="#818cf8"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    BUS 2 (225 kV - Ø120mm)
                  </text>
                </g>
              );
            })()}

            {/* 5. Overhead Line Conductors & Droppers (Liaisons Flexibles) */}
            {(() => {
              const gantryTop = project3D(2, 0, 16);
              const saTop = project3D(6, 0, 4.8);
              const cvtTop = project3D(10, 0, 5.2);
              const dsLineTop = project3D(15, 0, 6.2);
              const ctTop = project3D(20, 0, 5.6);
              const cbTop = project3D(26, 0, 6.8);
              const dsBb1Top = project3D(33, -4, 7.2);
              const bb1Conn = project3D(37, -4, 11.5);

              return (
                <g id="lineDroppers" stroke="#38bdf8" strokeWidth="2.5" fill="none" opacity="0.85">
                  {/* Conductor span coming from transmission line */}
                  <path
                    d={`M 40,${gantryTop.py - 30} Q ${gantryTop.px - 60},${gantryTop.py - 10} ${gantryTop.px},${gantryTop.py}`}
                    stroke="#0284c7"
                    strokeWidth="3.5"
                  />
                  {/* Dropper to Surge Arrester */}
                  <line x1={gantryTop.px} y1={gantryTop.py} x2={saTop.px} y2={saTop.py} />
                  {/* Connection to CVT */}
                  <line x1={saTop.px} y1={saTop.py} x2={cvtTop.px} y2={cvtTop.py} />
                  {/* Connection to Line Disconnector */}
                  <line x1={cvtTop.px} y1={cvtTop.py} x2={dsLineTop.px} y2={dsLineTop.py} />
                  {/* Connection to CT */}
                  <line x1={dsLineTop.px} y1={dsLineTop.py} x2={ctTop.px} y2={ctTop.py} />
                  {/* Connection to Circuit Breaker */}
                  <line x1={ctTop.px} y1={ctTop.py} x2={cbTop.px} y2={cbTop.py} />
                  {/* Connection to Bus Selector Disconnector */}
                  <line x1={cbTop.px} y1={cbTop.py} x2={dsBb1Top.px} y2={dsBb1Top.py} />
                  {/* Connection up to BB1 tubular bus */}
                  <line
                    x1={dsBb1Top.px}
                    y1={dsBb1Top.py}
                    x2={bb1Conn.px}
                    y2={bb1Conn.py}
                    stroke="#a855f7"
                    strokeWidth="3"
                  />
                </g>
              );
            })()}

            {/* 6. High-Voltage Physical Equipment Geometry */}
            {SUBSTATION_BAY_EQUIPMENT_3D.map((eq) => {
              const base = project3D(eq.position3D.x, eq.position3D.y, 0);
              const top = project3D(eq.position3D.x, eq.position3D.y, eq.dimensions.height);
              const isSelected = selectedEquipment?.id === eq.id;
              const isHotspot = showThermographyOverlay && (eq.thermalHotspotTempC || 0) > 40;

              return (
                <g
                  key={`eq-render-${eq.id}`}
                  onClick={() => setSelectedEquipment(eq)}
                  className="cursor-pointer group"
                >
                  {/* A. Gantry Lattice Structure */}
                  {eq.category === 'gantry' && (
                    <g>
                      {/* Left and Right upright columns */}
                      <line
                        x1={base.px - 36}
                        y1={base.py}
                        x2={top.px - 36}
                        y2={top.py}
                        stroke="url(#gantrySteel)"
                        strokeWidth="6"
                      />
                      <line
                        x1={base.px + 36}
                        y1={base.py}
                        x2={top.px + 36}
                        y2={top.py}
                        stroke="url(#gantrySteel)"
                        strokeWidth="6"
                      />
                      {/* Crossbeam */}
                      <line
                        x1={top.px - 45}
                        y1={top.py}
                        x2={top.px + 45}
                        y2={top.py}
                        stroke="url(#gantrySteel)"
                        strokeWidth="8"
                      />
                      {/* Cross lacings */}
                      <line
                        x1={base.px - 36}
                        y1={base.py - 40}
                        x2={top.px + 36}
                        y2={top.py + 40}
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                      <line
                        x1={base.px + 36}
                        y1={base.py - 40}
                        x2={top.px - 36}
                        y2={top.py + 40}
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}

                  {/* B. Circuit Breaker SF6 (Q0-CB) */}
                  {eq.category === 'circuit_breaker' && (
                    <g>
                      {/* Main drive mechanism kiosk (Armoire de commande) */}
                      <rect
                        x={base.px - 14}
                        y={base.py - 24}
                        width="28"
                        height="24"
                        fill="#334155"
                        stroke={isSelected ? '#38bdf8' : '#64748b'}
                        strokeWidth="1.5"
                        rx="3"
                      />
                      {/* Support frame */}
                      <line
                        x1={base.px}
                        y1={base.py - 24}
                        x2={base.px}
                        y2={top.py + 26}
                        stroke="#94a3b8"
                        strokeWidth="4"
                      />
                      {/* Three interrupter chambers (Chambres de coupure SF6) */}
                      {[-12, 0, 12].map((offset, idx) => (
                        <g key={`cb-pole-${idx}`}>
                          {/* Porcelain insulator column */}
                          <rect
                            x={base.px + offset - 4}
                            y={top.py + 10}
                            width="8"
                            height="35"
                            fill="url(#porcelainGrad)"
                            rx="2"
                          />
                          {/* Interrupter head */}
                          <rect
                            x={base.px + offset - 6}
                            y={top.py - 8}
                            width="12"
                            height="18"
                            fill="#64748b"
                            rx="2"
                          />
                          {/* Corona grading ring */}
                          <ellipse
                            cx={base.px + offset}
                            cy={top.py - 6}
                            rx="9"
                            ry="4"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="1.5"
                          />
                        </g>
                      ))}
                    </g>
                  )}

                  {/* C. Disconnector / Sectionneur */}
                  {eq.category === 'disconnector' && (
                    <g>
                      {/* Support post */}
                      <line
                        x1={base.px}
                        y1={base.py}
                        x2={base.px}
                        y2={top.py + 18}
                        stroke="#64748b"
                        strokeWidth="3.5"
                      />
                      {/* Rotating Insulator Columns */}
                      {[-8, 8].map((offset, idx) => (
                        <rect
                          key={`ds-col-${idx}`}
                          x={base.px + offset - 3}
                          y={top.py + 4}
                          width="6"
                          height="24"
                          fill="url(#compositeGrad)"
                          rx="1.5"
                        />
                      ))}
                      {/* Blade arm contact */}
                      <line
                        x1={base.px - 8}
                        y1={top.py + 4}
                        x2={eq.operationalState === 'open' ? base.px : base.px + 8}
                        y2={eq.operationalState === 'open' ? top.py - 16 : top.py + 4}
                        stroke={eq.operationalState === 'open' ? '#22c55e' : '#ef4444'}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </g>
                  )}

                  {/* D. Instrument Transformers (CT / CVT) & Surge Arrester */}
                  {(eq.category === 'ct' || eq.category === 'cvt' || eq.category === 'surge_arrester') && (
                    <g>
                      {/* Steel pedestal */}
                      <line
                        x1={base.px}
                        y1={base.py}
                        x2={base.px}
                        y2={top.py + 22}
                        stroke="#475569"
                        strokeWidth="3"
                      />
                      {/* Porcelain column sheds */}
                      <rect
                        x={base.px - 5}
                        y={top.py + 6}
                        width="10"
                        height="26"
                        fill={eq.category === 'surge_arrester' ? 'url(#compositeGrad)' : 'url(#porcelainGrad)'}
                        rx="2"
                      />
                      {/* Top expansion chamber / head */}
                      <ellipse
                        cx={base.px}
                        cy={top.py + 4}
                        rx={eq.category === 'ct' ? 10 : 7}
                        ry={eq.category === 'ct' ? 8 : 5}
                        fill="#64748b"
                        stroke="#94a3b8"
                        strokeWidth="1.2"
                      />
                    </g>
                  )}

                  {/* E. BCU Local Kiosk */}
                  {eq.category === 'bcu_kiosk' && (
                    <g>
                      <rect
                        x={base.px - 16}
                        y={base.py - 30}
                        width="32"
                        height="30"
                        fill="#1e293b"
                        stroke={isSelected ? '#38bdf8' : '#475569'}
                        strokeWidth="2"
                        rx="3"
                      />
                      <line
                        x1={base.px}
                        y1={base.py - 30}
                        x2={base.px}
                        y2={base.py}
                        stroke="#334155"
                        strokeWidth="1"
                      />
                      {/* Door handle & beacon */}
                      <circle cx={base.px + 8} cy={base.py - 16} r="1.5" fill="#94a3b8" />
                      <circle cx={base.px} cy={base.py - 34} r="2.5" fill="#10b981" />
                    </g>
                  )}

                  {/* Thermography Heatmap Hotspot Glow */}
                  {isHotspot && (
                    <g>
                      <circle
                        cx={top.px}
                        cy={top.py}
                        r="18"
                        fill="rgba(239, 68, 68, 0.4)"
                        className="animate-pulse"
                      />
                      <text
                        x={top.px}
                        y={top.py - 14}
                        fill="#f87171"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {eq.thermalHotspotTempC}°C
                      </text>
                    </g>
                  )}

                  {/* Selection Indicator Ring */}
                  {isSelected && (
                    <g>
                      <circle
                        cx={top.px}
                        cy={top.py}
                        r="20"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="3,3"
                      />
                      <text
                        x={top.px}
                        y={top.py - 24}
                        fill="#38bdf8"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {eq.tag}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Quick Legend at bottom of canvas */}
          <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                {locale === 'fr' ? 'Sous tension (Fermé)' : 'Energized (Closed)'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                {locale === 'fr' ? 'Sectionné (Ouvert)' : 'Isolated (Open)'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-500" />
                {locale === 'fr' ? 'Sphère Garde N=2.1m' : 'Clearance N=2.1m'}
              </span>
            </div>
            <span className="text-slate-500">
              {locale === 'fr' ? 'Cliquez sur un appareil pour l\'inspecter' : 'Click equipment to inspect'}
            </span>
          </div>
        </div>

        {/* Right 4 Cols: Equipment Telemetry & Clearance Compliance Inspector */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Selected Equipment Dossier Card */}
          {selectedEquipment ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3.5 mb-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {selectedEquipment.tag}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {selectedEquipment.category.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {selectedEquipment.name[locale]}
                  </h3>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                    selectedEquipment.operationalState === 'closed'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {selectedEquipment.operationalState.toUpperCase()}
                </span>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">Tension Nominale (Ur)</span>
                  <span className="text-white font-bold">{selectedEquipment.ratedVoltageKv.toFixed(1)} kV</span>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">Courant Assigné (Ir)</span>
                  <span className="text-white font-bold">{selectedEquipment.ratedCurrentA} A</span>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">Tenue au Choc (BIL)</span>
                  <span className="text-amber-400 font-bold">{selectedEquipment.bilImpulseKv} kV peak</span>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">Ligne de Fuite Spécifique</span>
                  <span className="text-white font-bold">{selectedEquipment.creepageDistanceMmPerKv} mm/kV</span>
                </div>
              </div>

              {/* Real-time Condition Monitoring Metrics */}
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    {locale === 'fr' ? 'Température Infrarouge' : 'Thermography Temp'}
                  </span>
                  <span className="font-bold text-amber-300">
                    {selectedEquipment.thermalHotspotTempC || 32.0} °C
                  </span>
                </div>
                {selectedEquipment.sf6GasPressureBar && (
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-sky-400" />
                      {locale === 'fr' ? 'Pression Gaz SF6' : 'SF6 Gas Pressure'}
                    </span>
                    <span className="font-bold text-emerald-400">
                      {selectedEquipment.sf6GasPressureBar} bar (Nominal)
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Norme CEI de Référence</span>
                  <span className="text-slate-300">{selectedEquipment.iecStandard}</span>
                </div>
              </div>

              {/* Action Buttons: AAS v3 & Technical Sheet */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onInspectAas?.(selectedEquipment.aasAssetId)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-mono font-bold transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>{locale === 'fr' ? 'Consulter AAS v3' : 'View AAS v3 Asset'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateEquipment?.(selectedEquipment.id)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
                  title="Ouvrir fiche technique complète"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs font-mono">
              {locale === 'fr' ? 'Sélectionnez un appareil sur la vue 3D' : 'Select equipment in the 3D scene'}
            </div>
          )}

          {/* Clearance Rules Audit Card (IEC 61936-1) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {locale === 'fr' ? 'Audit des Distances d\'Isolement (CEI 61936-1)' : 'Clearances Audit (IEC 61936-1)'}
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                100% CONFORME
              </span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {CLEARANCE_AUDIT_RULES_225KV.map((rule) => (
                <div
                  key={rule.ruleCode}
                  onClick={() => setActiveClearanceRule(rule)}
                  className={`p-2.5 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                    activeClearanceRule?.ruleCode === rule.ruleCode
                      ? 'bg-slate-800 border-cyan-500/50 text-white'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">{rule.ruleCode}</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      +{rule.safetyMarginPercent}% Marge
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {rule.title[locale]}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 pt-1 border-t border-slate-800/60">
                    <span>Requis: {rule.requiredClearanceMm} mm</span>
                    <span className="text-slate-300 font-bold">Mesuré: {rule.actualMeasuredMm} mm</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
