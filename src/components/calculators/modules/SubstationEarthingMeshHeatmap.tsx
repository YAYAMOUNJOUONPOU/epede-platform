// src/components/calculators/modules/SubstationEarthingMeshHeatmap.tsx
// EPEDE 2.0: Substation Earthing Grid (IEEE Std 80-2013) Interactive 2D Mesh Heatmap & Step/Touch Voltage Inspector
// Provides: 2D Top-Down Mesh Grid Visualizer, Potential Heatmap Contour, Cursor Probe Inspector, 
// 1D Gradient Cross-Section Curve, Crushed Rock Derating (Cs), and Cameroon High-Voltage Substation Presets.

import React, { useState, useMemo, useRef } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Activity,
  Layers,
  Crosshair,
  TrendingDown,
  Info,
  Maximize2,
  RefreshCw,
  Compass,
  Zap,
} from 'lucide-react';
import {
  Ieee80EarthingGridEngine,
  CAMEROON_SUBSTATION_EARTHING_PRESETS,
  type EarthingGridInput,
  type EarthingGridOutput,
} from '../../../data/ieee80EarthingGridEngine';

interface SubstationEarthingMeshHeatmapProps {
  locale: 'fr' | 'en';
  initialPresetId?: string;
  onOpenReport?: () => void;
}

export const SubstationEarthingMeshHeatmap: React.FC<SubstationEarthingMeshHeatmapProps> = ({
  locale,
  initialPresetId = 'bekoko-225kv',
  onOpenReport,
}) => {
  const isFr = locale === 'fr';

  // 1. Selected Preset or Custom
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPresetId);
  const initialPreset =
    CAMEROON_SUBSTATION_EARTHING_PRESETS.find((p) => p.id === initialPresetId) ||
    CAMEROON_SUBSTATION_EARTHING_PRESETS[0];

  const [input, setInput] = useState<EarthingGridInput>(initialPreset.input);
  const [activeTab, setActiveTab] = useState<'2D_HEATMAP' | 'CROSS_SECTION' | 'MATH_EQUATIONS'>('2D_HEATMAP');

  // Probe Cursor coordinates (relative meters from center of grid: x: [-Lx/2 .. Lx/2], y: [-Ly/2 .. Ly/2])
  const [probePos, setProbePos] = useState<{ xM: number; yM: number } | null>(null);
  const [isHoveringGrid, setIsHoveringGrid] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Handle Preset Change
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'custom') return;
    const preset = CAMEROON_SUBSTATION_EARTHING_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setInput(preset.input);
    }
  };

  // Solve IEEE 80 Grid
  const results: EarthingGridOutput = useMemo(() => {
    return Ieee80EarthingGridEngine.solve(input);
  }, [input]);

  // Handle SVG Mouse Move for Interactive Inspector
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // ViewBox is 600 x 440, with grid centered at (300, 220)
    // Scale domain: 140% of grid length fits in 480 px width
    const svgWidth = 600;
    const svgHeight = 440;
    const normX = clientX / rect.width;
    const normY = clientY / rect.height;

    const viewBoxX = normX * svgWidth;
    const viewBoxY = normY * svgHeight;

    const centerPxX = 300;
    const centerPxY = 220;
    const scalePxPerM = 400 / Math.max(input.lengthM, input.widthM * 1.25);

    const xM = (viewBoxX - centerPxX) / scalePxPerM;
    const yM = (centerPxY - viewBoxY) / scalePxPerM;

    setProbePos({ xM: Number(xM.toFixed(1)), yM: Number(yM.toFixed(1)) });
    setIsHoveringGrid(true);
  };

  // Probe values at current cursor position
  const probeValues = useMemo(() => {
    if (!probePos) {
      // Default to corner mesh point (worst case)
      const xCorner = input.lengthM / 2 - results.meshSpacingXM / 2;
      const yCorner = input.widthM / 2 - results.meshSpacingYM / 2;
      return {
        xM: Number(xCorner.toFixed(1)),
        yM: Number(yCorner.toFixed(1)),
        surfaceV: Math.round(results.groundPotentialRiseV - results.meshVoltageCalculatedV),
        touchV: results.meshVoltageCalculatedV,
        stepV: results.stepVoltageCalculatedV,
        isTouchSafe: results.isTouchSafe,
        isStepSafe: results.isStepSafe,
        locationLabel: isFr ? 'Maille de Coin (Pire Cas)' : 'Corner Mesh (Worst Case)',
      };
    }

    const absX = Math.abs(probePos.xM);
    const absY = Math.abs(probePos.yM);
    const halfL = input.lengthM / 2;
    const halfW = input.widthM / 2;
    const isInside = absX <= halfL && absY <= halfW;
    const cornerDist = Math.sqrt(Math.pow(absX, 2) + Math.pow(absY, 2));
    const gridDiag = Math.sqrt(Math.pow(halfL, 2) + Math.pow(halfW, 2));

    // Calculate local surface potential
    let phi = 0.88;
    if (isInside) {
      const normRadius = cornerDist / gridDiag;
      // Distance to nearest mesh conductor
      const modX = absX % results.meshSpacingXM;
      const distToXMesh = Math.min(modX, results.meshSpacingXM - modX);
      const modY = absY % results.meshSpacingYM;
      const distToYMesh = Math.min(modY, results.meshSpacingYM - modY);
      const distToMesh = Math.min(distToXMesh, distToYMesh);
      const meshDip = 0.14 * (1 - Math.exp(-distToMesh / (input.burialDepthM * 1.8)));
      phi = 0.88 - meshDip - 0.08 * normRadius;
    } else {
      const outDist = Math.max(0, cornerDist - gridDiag);
      phi = 0.70 / (1 + outDist / 9.0);
    }

    const surfaceV = Math.round(results.groundPotentialRiseV * phi);
    const touchV = Math.max(0, results.groundPotentialRiseV - surfaceV);
    const stepV = Math.round(
      isInside
        ? (results.stepVoltageCalculatedV * (0.6 + 0.4 * (cornerDist / gridDiag)))
        : (results.stepVoltageCalculatedV * (1.2 / (1 + (cornerDist - gridDiag) / 5.0)))
    );

    const isTouchSafe = touchV <= results.tolerableTouchVoltageV;
    const isStepSafe = stepV <= results.tolerableStepVoltageV;

    let locationLabel = isFr ? 'Intérieur Grille' : 'Inside Grid';
    if (!isInside) {
      locationLabel = cornerDist - gridDiag < 5 ? (isFr ? 'Périmètre Clôture' : 'Fence Perimeter') : (isFr ? 'Extérieur Poste' : 'Outside Fence');
    }

    return {
      xM: probePos.xM,
      yM: probePos.yM,
      surfaceV,
      touchV,
      stepV,
      isTouchSafe,
      isStepSafe,
      locationLabel,
    };
  }, [probePos, input, results, isFr]);

  // Color helper for Heatmap Potential Gradient
  const getPotentialColor = (phi: number): string => {
    // phi: 0.0 (dark blue) -> 0.5 (cyan) -> 0.75 (emerald) -> 0.85 (amber) -> 0.95 (bright gold)
    if (phi < 0.3) return '#1E3A8A'; // Deep blue
    if (phi < 0.5) return '#0284C7'; // Cyan blue
    if (phi < 0.7) return '#0D9488'; // Teal
    if (phi < 0.8) return '#10B981'; // Emerald
    if (phi < 0.88) return '#F59E0B'; // Amber
    return '#E11D48'; // High GPR rose/red
  };

  return (
    <div className="bg-[#0B131E] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 text-white font-sans">
      {/* 1. Header Bar with Cameroon Substation Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              IEEE STD 80-2013 / CEI 60479 · DOMAINE D16
            </span>
            <span className="font-mono text-xs text-white/50">
              {isFr ? 'Cartographie 2D & Gradient de Potentiel' : '2D Mesh Heatmap & Gradient Inspector'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>
              {isFr
                ? 'Réseau de Terre de Poste HTB : Tensions de Pas & de Toucher'
                : 'Substation Earthing Grid: Step & Touch Voltage Heatmap'}
            </span>
          </h2>
          <p className="text-xs text-white/70">
            {isFr
              ? 'Simulation de la montée en potentiel (GPR), résistance de grille de Sverak, coefficient de dérating gravier (Cs) et protection contre la fibrillation cardiaque.'
              : 'Simulation of ground potential rise (GPR), Sverak grid resistance, crushed rock derating (Cs), and ventricular fibrillation safety envelopes.'}
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-mono text-white/60">
            {isFr ? 'Poste Type Cameroun :' : 'Cameroon Substation :'}
          </label>
          <select
            value={selectedPresetId}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="bg-[#121E2C] border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-emerald-300 focus:outline-none focus:border-emerald-400"
          >
            {CAMEROON_SUBSTATION_EARTHING_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {isFr ? preset.name.fr : preset.name.en}
              </option>
            ))}
            <option value="custom">⚙️ {isFr ? 'Paramétrage Personnalisé' : 'Custom Configuration'}</option>
          </select>
        </div>
      </div>

      {/* 2. Executive KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
        {/* Resistance Rg */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-[10px] text-white/50 uppercase">
            {isFr ? 'Résistance Rg' : 'Ground Resistance Rg'}
          </div>
          <div
            className={`text-xl font-black ${
              results.gridResistanceRgOhm <= 0.5
                ? 'text-emerald-400'
                : results.gridResistanceRgOhm <= 1.0
                ? 'text-cyan-300'
                : 'text-amber-400'
            }`}
          >
            {results.gridResistanceRgOhm.toFixed(2)}{' '}
            <span className="text-xs font-normal text-white/50">Ω</span>
          </div>
          <div className="text-[9px] text-white/40">
            {results.gridResistanceRgOhm <= 1.0
              ? (isFr ? '✅ Conforme (< 1.0 Ω)' : '✅ Compliant (< 1.0 Ω)')
              : (isFr ? '⚠️ Déconseillé HTB' : '⚠️ Elevated for HV')}
          </div>
        </div>

        {/* GPR */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-[10px] text-white/50 uppercase">
            {isFr ? 'Montée Potentiel (GPR)' : 'Ground Potential (GPR)'}
          </div>
          <div className="text-xl font-black text-amber-300">
            {(results.groundPotentialRiseV / 1000).toFixed(1)}{' '}
            <span className="text-xs font-normal text-white/50">kV</span>
          </div>
          <div className="text-[9px] text-white/40">
            @ {(results.gridCurrentIgA / 1000).toFixed(1)} kA {isFr ? 'injectés' : 'to grid'}
          </div>
        </div>

        {/* Mesh Touch Voltage Em */}
        <div
          className={`p-3.5 rounded-xl border space-y-1 ${
            results.isTouchSafe
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : 'bg-red-950/30 border-red-500/40'
          }`}
        >
          <div className="text-[10px] uppercase text-white/60">
            {isFr ? 'Tension Toucher (Em)' : 'Mesh Touch Voltage (Em)'}
          </div>
          <div
            className={`text-xl font-black ${
              results.isTouchSafe ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {results.meshVoltageCalculatedV}{' '}
            <span className="text-xs font-normal text-white/50">V</span>
          </div>
          <div className="text-[9px] text-white/50">
            {isFr ? 'Seuil tolérable :' : 'Tolerable limit :'} {results.tolerableTouchVoltageV} V
          </div>
        </div>

        {/* Step Voltage Es */}
        <div
          className={`p-3.5 rounded-xl border space-y-1 ${
            results.isStepSafe
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : 'bg-red-950/30 border-red-500/40'
          }`}
        >
          <div className="text-[10px] uppercase text-white/60">
            {isFr ? 'Tension Pas (Es)' : 'Step Voltage (Es)'}
          </div>
          <div
            className={`text-xl font-black ${
              results.isStepSafe ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {results.stepVoltageCalculatedV}{' '}
            <span className="text-xs font-normal text-white/50">V</span>
          </div>
          <div className="text-[9px] text-white/50">
            {isFr ? 'Seuil tolérable :' : 'Tolerable limit :'} {results.tolerableStepVoltageV} V
          </div>
        </div>

        {/* Crushed Rock Derating Cs */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-[10px] text-white/50 uppercase">
            {isFr ? 'Facteur Gravier Cs' : 'Gravel Derating Cs'}
          </div>
          <div className="text-xl font-black text-cyan-300">
            {results.csDerating.toFixed(3)}
          </div>
          <div className="text-[9px] text-white/40">
            {input.hasCrushedRockLayer
              ? `${input.crushedRockThicknessCm} cm · ${input.crushedRockResistivityOhmM} Ω·m`
              : (isFr ? 'Sol Nu (Pas de gravier)' : 'Bare Ground (No rock)')}
          </div>
        </div>

        {/* Overall Status */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col justify-between ${
            results.complianceStatus === 'COMPLIANT'
              ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-300'
              : results.complianceStatus === 'WARNING'
              ? 'bg-amber-900/30 border-amber-500/40 text-amber-300'
              : 'bg-red-900/30 border-red-500/40 text-red-300'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider">
            {isFr ? 'STATUT SÉCURITÉ' : 'SAFETY VERDICT'}
          </div>
          <div className="text-base font-black flex items-center gap-1.5">
            {results.complianceStatus === 'COMPLIANT' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isFr ? 'CONFORME' : 'COMPLIANT'}</span>
              </>
            ) : results.complianceStatus === 'WARNING' ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isFr ? 'MARGE FAIBLE' : 'LOW MARGIN'}</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{isFr ? 'DANGER DE MORT' : 'LETHAL HAZARD'}</span>
              </>
            )}
          </div>
          <div className="text-[9px] opacity-80">
            {results.complianceStatus === 'COMPLIANT'
              ? (isFr ? `Marge toucher : +${results.touchSafetyMarginV} V` : `Touch margin: +${results.touchSafetyMarginV} V`)
              : (isFr ? 'Risque fibrillation cardiaque' : 'Cardiac fibrillation risk')}
          </div>
        </div>
      </div>

      {/* 3. Main Workspace: Interactive View (Left 8 Cols) & Live Inspector / Controls (Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): 2D Canvas / 1D Graph / Equations Tabs */}
        <div className="lg:col-span-8 space-y-4">
          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('2D_HEATMAP')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === '2D_HEATMAP'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>{isFr ? 'Cartographie 2D & Grille Cuivre' : '2D Mesh & Potential Heatmap'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CROSS_SECTION')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'CROSS_SECTION'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>{isFr ? 'Profil Diagonal & Seuil de Clôture' : 'Diagonal Profile & Fence Gradient'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('MATH_EQUATIONS')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'MATH_EQUATIONS'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>{isFr ? 'Formules Normatives IEEE 80' : 'IEEE 80 Equations'}</span>
            </button>
          </div>

          {/* TAB 1: 2D MESH HEATMAP & PROBE */}
          {activeTab === '2D_HEATMAP' && (
            <div className="relative rounded-2xl bg-[#070B12] border border-white/15 p-4 overflow-hidden select-none shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono mb-2 text-white/70">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-cyan-400" />
                  <span>
                    {isFr
                      ? 'Survolez la grille avec le curseur pour sonder les tensions de pas et de toucher locales'
                      : 'Hover cursor over mesh to probe local step & touch potentials'}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400">
                  {input.lengthM}m × {input.widthM}m · {input.meshCountX}×{input.meshCountY} {isFr ? 'Mailles' : 'Meshes'}
                </span>
              </div>

              {/* Scalable SVG Grid */}
              <div className="relative w-full aspect-[4/3] max-h-[480px]">
                <svg
                  ref={svgRef}
                  viewBox="0 0 600 440"
                  className="w-full h-full cursor-crosshair"
                  onMouseMove={handleSvgMouseMove}
                  onMouseLeave={() => setIsHoveringGrid(false)}
                >
                  <defs>
                    {/* Background Grid Pattern */}
                    <pattern id="soilBackPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                      <rect width="20" height="20" fill="#06090E" />
                      <circle cx="2" cy="2" r="0.8" fill="#182332" />
                    </pattern>

                    {/* Radial glow for probe */}
                    <radialGradient id="probeGlow">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Remote Soil Background */}
                  <rect x="0" y="0" width="600" height="440" fill="url(#soilBackPattern)" />

                  {/* Outer Substation Perimeter Fence */}
                  {/* Grid centered at (300, 220). Max dimension fits in 400px */}
                  {(() => {
                    const scale = 360 / Math.max(input.lengthM, input.widthM * 1.2);
                    const gridPxW = input.lengthM * scale;
                    const gridPxH = input.widthM * scale;
                    const gridX0 = 300 - gridPxW / 2;
                    const gridY0 = 220 - gridPxH / 2;
                    const fenceMarginPx = 25;

                    return (
                      <g>
                        {/* Heatmap Layer Cells */}
                        <g opacity="0.65">
                          {results.gridSurfacePotentials.map((row, iy) => {
                            const res = results.heatmapResolution;
                            const cellW = (gridPxW * 1.4) / (res - 1);
                            const cellH = (gridPxH * 1.4) / (res - 1);
                            const startX = 300 - (gridPxW * 1.4) / 2;
                            const startY = 220 - (gridPxH * 1.4) / 2;

                            return row.map((phi, ix) => {
                              const cx = startX + ix * cellW;
                              const cy = startY + iy * cellH;
                              return (
                                <rect
                                  key={`cell-${ix}-${iy}`}
                                  x={cx - cellW / 2}
                                  y={cy - cellH / 2}
                                  width={cellW + 1}
                                  height={cellH + 1}
                                  fill={getPotentialColor(phi)}
                                  opacity="0.55"
                                />
                              );
                            });
                          })}
                        </g>

                        {/* Perimeter Fence Line (Dashed) */}
                        <rect
                          x={gridX0 - fenceMarginPx}
                          y={gridY0 - fenceMarginPx}
                          width={gridPxW + fenceMarginPx * 2}
                          height={gridPxH + fenceMarginPx * 2}
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="1.5"
                          strokeDasharray="6 4"
                          opacity="0.7"
                        />
                        <text
                          x={gridX0 - fenceMarginPx + 6}
                          y={gridY0 - fenceMarginPx + 14}
                          fill="#CBD5E1"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {isFr ? 'CLÔTURE DU POSTE (LIMITES FONCIÈRES)' : 'SUBSTATION PERIMETER FENCE'}
                        </text>

                        {/* Substation Equipment Footprints (Transformers, Busbars) */}
                        <g opacity="0.45">
                          {/* Transformer Bay 1 */}
                          <rect
                            x={300 - gridPxW * 0.25}
                            y={220 - gridPxH * 0.25}
                            width={gridPxW * 0.18}
                            height={gridPxH * 0.22}
                            fill="#1E293B"
                            stroke="#64748B"
                            strokeWidth="1"
                          />
                          <text
                            x={300 - gridPxW * 0.16}
                            y={220 - gridPxH * 0.14}
                            fill="#94A3B8"
                            fontSize="8"
                            fontFamily="monospace"
                          >
                            TR1 225/90kV
                          </text>

                          {/* Transformer Bay 2 */}
                          <rect
                            x={300 + gridPxW * 0.08}
                            y={220 - gridPxH * 0.25}
                            width={gridPxW * 0.18}
                            height={gridPxH * 0.22}
                            fill="#1E293B"
                            stroke="#64748B"
                            strokeWidth="1"
                          />
                          <text
                            x={300 + gridPxW * 0.17}
                            y={220 - gridPxH * 0.14}
                            fill="#94A3B8"
                            fontSize="8"
                            fontFamily="monospace"
                          >
                            TR2 225/90kV
                          </text>

                          {/* Control Building */}
                          <rect
                            x={300 - gridPxW * 0.35}
                            y={220 + gridPxH * 0.15}
                            width={gridPxW * 0.22}
                            height={gridPxH * 0.18}
                            fill="#0F172A"
                            stroke="#475569"
                            strokeWidth="1"
                          />
                          <text
                            x={300 - gridPxW * 0.24}
                            y={220 + gridPxH * 0.25}
                            fill="#94A3B8"
                            fontSize="8"
                            fontFamily="monospace"
                          >
                            {isFr ? 'BÂTIMENT COMMANDE' : 'CONTROL BLDG'}
                          </text>
                        </g>

                        {/* Buried Copper Grid Mesh Lines */}
                        <g stroke="#F59E0B" strokeWidth="2.5" opacity="0.95">
                          {/* Horizontal Lines (along X) */}
                          {Array.from({ length: input.meshCountY + 1 }).map((_, i) => {
                            const y = gridY0 + (i / input.meshCountY) * gridPxH;
                            return (
                              <line
                                key={`hx-${i}`}
                                x1={gridX0}
                                y1={y}
                                x2={gridX0 + gridPxW}
                                y2={y}
                              />
                            );
                          })}

                          {/* Vertical Lines (along Y) */}
                          {Array.from({ length: input.meshCountX + 1 }).map((_, i) => {
                            const x = gridX0 + (i / input.meshCountX) * gridPxW;
                            return (
                              <line
                                key={`vy-${i}`}
                                x1={x}
                                y1={gridY0}
                                x2={x}
                                y2={gridY0 + gridPxH}
                              />
                            );
                          })}
                        </g>

                        {/* Ground Rods (Circles at Corners and Perimeter) */}
                        <g fill="#06B6D4" stroke="#FFFFFF" strokeWidth="1">
                          {/* 4 Corner Rods */}
                          <circle cx={gridX0} cy={gridY0} r="4.5" />
                          <circle cx={gridX0 + gridPxW} cy={gridY0} r="4.5" />
                          <circle cx={gridX0} cy={gridY0 + gridPxH} r="4.5" />
                          <circle cx={gridX0 + gridPxW} cy={gridY0 + gridPxH} r="4.5" />

                          {/* Additional Rods Distributed Along Perimeter */}
                          {Array.from({ length: Math.min(24, Math.max(0, input.groundRodsCount - 4)) }).map(
                            (_, i) => {
                              const step = (gridPxW * 2 + gridPxH * 2) / (input.groundRodsCount - 4);
                              const perimPos = (i + 0.5) * step;
                              let rx = gridX0;
                              let ry = gridY0;
                              if (perimPos < gridPxW) {
                                rx = gridX0 + perimPos;
                                ry = gridY0;
                              } else if (perimPos < gridPxW + gridPxH) {
                                rx = gridX0 + gridPxW;
                                ry = gridY0 + (perimPos - gridPxW);
                              } else if (perimPos < gridPxW * 2 + gridPxH) {
                                rx = gridX0 + gridPxW - (perimPos - (gridPxW + gridPxH));
                                ry = gridY0 + gridPxH;
                              } else {
                                rx = gridX0;
                                ry = gridY0 + gridPxH - (perimPos - (gridPxW * 2 + gridPxH));
                              }
                              return <circle key={`rod-${i}`} cx={rx} cy={ry} r="3.5" />;
                            }
                          )}
                        </g>

                        {/* Dimension Labels */}
                        <text
                          x={300}
                          y={gridY0 - 8}
                          fill="#FBBF24"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          Lx = {input.lengthM} m ({input.meshCountX} {isFr ? 'mailles de' : 'meshes @'} {results.meshSpacingXM} m)
                        </text>
                        <text
                          x={gridX0 - 10}
                          y={220}
                          fill="#FBBF24"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                          transform={`rotate(-90, ${gridX0 - 10}, 220)`}
                        >
                          Ly = {input.widthM} m ({input.meshCountY} {isFr ? 'mailles' : 'meshes'})
                        </text>

                        {/* Interactive Probe Crosshair */}
                        {probePos && (
                          <g>
                            {/* Probe Point coordinates translated to SVG */}
                            {(() => {
                              const pSvgX = 300 + probePos.xM * scale;
                              const pSvgY = 220 - probePos.yM * scale;
                              return (
                                <g>
                                  <circle cx={pSvgX} cy={pSvgY} r="18" fill="url(#probeGlow)" />
                                  <line
                                    x1={pSvgX - 12}
                                    y1={pSvgY}
                                    x2={pSvgX + 12}
                                    y2={pSvgY}
                                    stroke="#38BDF8"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1={pSvgX}
                                    y1={pSvgY - 12}
                                    x2={pSvgX}
                                    y2={pSvgY + 12}
                                    stroke="#38BDF8"
                                    strokeWidth="1.5"
                                  />
                                  <circle
                                    cx={pSvgX}
                                    cy={pSvgY}
                                    r="4"
                                    fill="#FFFFFF"
                                    stroke="#0284C7"
                                    strokeWidth="1.5"
                                  />
                                </g>
                              );
                            })()}
                          </g>
                        )}
                      </g>
                    );
                  })()}
                </svg>

                {/* Heatmap Legend Bar */}
                <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 font-mono text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 uppercase">
                      {isFr ? 'Potentiel de Surface V(x,y) :' : 'Surface Potential V(x,y):'}
                    </span>
                    <div className="flex items-center h-2.5 w-44 rounded overflow-hidden">
                      <div className="flex-1 bg-[#1E3A8A]" />
                      <div className="flex-1 bg-[#0284C7]" />
                      <div className="flex-1 bg-[#0D9488]" />
                      <div className="flex-1 bg-[#10B981]" />
                      <div className="flex-1 bg-[#F59E0B]" />
                      <div className="flex-1 bg-[#E11D48]" />
                    </div>
                    <span className="text-white/70">0 V &rarr; GPR ({Math.round(results.groundPotentialRiseV / 1000)} kV)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <span className="w-2.5 h-0.5 bg-amber-400 inline-block" />
                      {isFr ? 'Cuivre Enterré 120 mm²' : 'Buried Copper 120mm²'}
                    </span>
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                      {input.groundRodsCount} {isFr ? 'Piquets de terre' : 'Ground rods'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 1D DIAGONAL GRADIENT PROFILE */}
          {activeTab === 'CROSS_SECTION' && (
            <div className="rounded-2xl bg-[#070B12] border border-white/15 p-5 space-y-4 font-mono">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  {isFr
                    ? 'Profil Diagonal : Tensions de Toucher & de Pas depuis le Centre jusqu’à l’Extérieur'
                    : 'Diagonal Potential Profile: Touch & Step Potentials from Center to Remote Earth'}
                </span>
                <span className="text-[10px] text-white/50">
                  {isFr ? 'Coupe à 45° traversant la clôture' : '45° cross-section crossing fence'}
                </span>
              </div>

              {/* Profile Line Graph SVG */}
              <div className="relative w-full aspect-[2/1] max-h-[340px] bg-[#0A0F18] rounded-xl border border-white/10 p-2">
                <svg viewBox="0 0 600 280" className="w-full h-full text-[10px]">
                  {/* Grid lines */}
                  <line x1="50" y1="20" x2="50" y2="240" stroke="#1E293B" strokeWidth="1" />
                  <line x1="50" y1="240" x2="580" y2="240" stroke="#334155" strokeWidth="1.5" />
                  <line x1="50" y1="130" x2="580" y2="130" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="50" y1="20" x2="580" y2="20" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Y Axis Labels */}
                  <text x="42" y="24" fill="#94A3B8" textAnchor="end">
                    {results.tolerableTouchVoltageV * 1.5}V
                  </text>
                  <text x="42" y="134" fill="#94A3B8" textAnchor="end">
                    {Math.round(results.tolerableTouchVoltageV * 0.75)}V
                  </text>
                  <text x="42" y="244" fill="#94A3B8" textAnchor="end">
                    0V
                  </text>

                  {/* Tolerable Touch Limit Line (Red Dashed) */}
                  {(() => {
                    const yMax = results.tolerableTouchVoltageV * 1.5;
                    const yEtouchTol = 240 - (results.tolerableTouchVoltageV / yMax) * 220;
                    const yEstepTol = 240 - (Math.min(yMax, results.tolerableStepVoltageV) / yMax) * 220;

                    // Plot profile curves
                    const numPts = results.crossSectionProfile.length;
                    const xStep = 520 / (numPts - 1);

                    const touchPoints = results.crossSectionProfile
                      .map((pt, i) => `${50 + i * xStep},${240 - (Math.min(yMax, pt.touchVoltageV) / yMax) * 220}`)
                      .join(' ');

                    const stepPoints = results.crossSectionProfile
                      .map((pt, i) => `${50 + i * xStep},${240 - (Math.min(yMax, pt.stepVoltageV) / yMax) * 220}`)
                      .join(' ');

                    // Fence index
                    const fenceIdx = results.crossSectionProfile.findIndex((p) => p.locationType === 'OUTSIDE_FENCE');
                    const fenceX = 50 + (fenceIdx >= 0 ? fenceIdx : numPts * 0.8) * xStep;

                    return (
                      <g>
                        {/* Fence Zone Marker */}
                        <rect
                          x={fenceX - 15}
                          y="20"
                          width="30"
                          height="220"
                          fill="#E11D48"
                          opacity="0.1"
                        />
                        <line
                          x1={fenceX}
                          y1="20"
                          x2={fenceX}
                          y2="240"
                          stroke="#E11D48"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                        />
                        <text
                          x={fenceX}
                          y="15"
                          fill="#F43F5E"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {isFr ? 'CLÔTURE' : 'PERIMETER FENCE'}
                        </text>

                        {/* Tolerable Touch Limit Line */}
                        <line
                          x1="50"
                          y1={yEtouchTol}
                          x2="580"
                          y2={yEtouchTol}
                          stroke="#F43F5E"
                          strokeWidth="1.5"
                          strokeDasharray="6 3"
                        />
                        <text
                          x="575"
                          y={yEtouchTol - 4}
                          fill="#F43F5E"
                          fontSize="9"
                          textAnchor="end"
                          fontWeight="bold"
                        >
                          Etouch,tol = {results.tolerableTouchVoltageV} V
                        </text>

                        {/* Tolerable Step Limit Line */}
                        {results.tolerableStepVoltageV < yMax && (
                          <>
                            <line
                              x1="50"
                              y1={yEstepTol}
                              x2="580"
                              y2={yEstepTol}
                              stroke="#F59E0B"
                              strokeWidth="1.5"
                              strokeDasharray="4 4"
                            />
                            <text
                              x="575"
                              y={yEstepTol - 4}
                              fill="#F59E0B"
                              fontSize="9"
                              textAnchor="end"
                              fontWeight="bold"
                            >
                              Estep,tol = {results.tolerableStepVoltageV} V
                            </text>
                          </>
                        )}

                        {/* Actual Touch Potential Polyline (Emerald / Crimson) */}
                        <polyline
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2.5"
                          points={touchPoints}
                        />

                        {/* Actual Step Potential Polyline (Amber / Cyan) */}
                        <polyline
                          fill="none"
                          stroke="#38BDF8"
                          strokeWidth="2"
                          strokeDasharray="3 2"
                          points={stepPoints}
                        />

                        {/* Legend */}
                        <g transform="translate(60, 30)">
                          <rect width="180" height="45" rx="6" fill="#0B131E" opacity="0.85" />
                          <line x1="10" y1="15" x2="30" y2="15" stroke="#10B981" strokeWidth="2.5" />
                          <text x="36" y="18" fill="#F1F5F9" fontSize="9">
                            {isFr ? 'Tension de Toucher Em(x)' : 'Touch Voltage Em(x)'}
                          </text>

                          <line x1="10" y1="32" x2="30" y2="32" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 2" />
                          <text x="36" y="35" fill="#F1F5F9" fontSize="9">
                            {isFr ? 'Tension de Pas Es(x)' : 'Step Voltage Es(x)'}
                          </text>
                        </g>
                      </g>
                    );
                  })()}

                  {/* X Axis Distance Labels */}
                  <text x="50" y="255" fill="#94A3B8" textAnchor="middle">
                    0 m (Centre)
                  </text>
                  <text x="315" y="255" fill="#94A3B8" textAnchor="middle">
                    {Math.round(results.crossSectionProfile[Math.floor(results.crossSectionProfile.length / 2)].distanceFromCenterM)} m
                  </text>
                  <text x="580" y="255" fill="#94A3B8" textAnchor="middle">
                    {results.crossSectionProfile[results.crossSectionProfile.length - 1].distanceFromCenterM} m
                  </text>
                </svg>
              </div>

              {/* Explanatory Note */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white/80 space-y-1">
                <span className="text-emerald-400 font-bold">
                  {isFr ? 'Interprétation Didactique du Profil :' : 'Engineering Interpretation of Profile :'}
                </span>
                <p className="text-[11px] leading-relaxed">
                  {isFr
                    ? "La tension de toucher Em est minimale au-dessus des conducteurs et présente des ondulations au centre des mailles. Elle atteint son pic au niveau de la maille d'angle la plus excentrée. À l'extérieur de la clôture, le gradient s'effondre vers la terre lointaine mais génère une tension de pas abrupte qui justifie l'anneau de garde équipotentiel à 1m."
                    : 'Touch voltage is lowest above conductors and ripples at mesh centers, reaching its peak at the corner mesh. Outside the fence, potential decays steeply toward remote earth, requiring an outer grading ring 1m beyond perimeter.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: NORMATIVE IEEE 80 EQUATIONS */}
          {activeTab === 'MATH_EQUATIONS' && (
            <div className="rounded-2xl bg-[#070B12] border border-white/15 p-5 space-y-4 font-mono text-xs">
              <div className="text-emerald-400 font-bold border-b border-white/10 pb-2 flex items-center justify-between">
                <span>{isFr ? 'Formulations Normalisées IEEE Std 80-2013' : 'Governing IEEE Std 80-2013 Equations'}</span>
                <span className="text-[10px] text-white/50">Corps 70 kg · Dalziel</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="text-cyan-300 font-bold">1. Tension de Toucher Tolérable (Etouch) :</div>
                  <div className="text-emerald-300 font-mono">
                    E_touch_70 = (1000 + 1.5 · Cs · ρ_s) · 0.157 / √(ts)
                  </div>
                  <div className="text-white/60">
                    = (1000 + 1.5 · {results.csDerating.toFixed(3)} · {input.hasCrushedRockLayer ? input.crushedRockResistivityOhmM : input.soilResistivityOhmM}) · (0.157 / √{input.faultClearingTimeSec})
                  </div>
                  <div className="text-emerald-400 font-bold">= {results.tolerableTouchVoltageV} V</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="text-cyan-300 font-bold">2. Tension de Pas Tolérable (Estep) :</div>
                  <div className="text-emerald-300 font-mono">
                    E_step_70 = (1000 + 6.0 · Cs · ρ_s) · 0.157 / √(ts)
                  </div>
                  <div className="text-white/60">
                    = (1000 + 6.0 · {results.csDerating.toFixed(3)} · {input.hasCrushedRockLayer ? input.crushedRockResistivityOhmM : input.soilResistivityOhmM}) · (0.157 / √{input.faultClearingTimeSec})
                  </div>
                  <div className="text-emerald-400 font-bold">= {results.tolerableStepVoltageV} V</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="text-cyan-300 font-bold">3. Facteur de Réduction Gravier (Cs) :</div>
                  <div className="text-emerald-300 font-mono">
                    Cs = 1 - [0.09 · (1 - ρ/ρ_s)] / [2 · hs + 0.09]
                  </div>
                  <div className="text-white/60">
                    = 1 - [0.09 · (1 - {input.soilResistivityOhmM}/{input.crushedRockResistivityOhmM})] / [2 · {input.crushedRockThicknessCm / 100} + 0.09]
                  </div>
                  <div className="text-emerald-400 font-bold">= {results.csDerating.toFixed(3)}</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="text-cyan-300 font-bold">4. Résistance de Prise de Terre de Sverak (Rg) :</div>
                  <div className="text-emerald-300 font-mono">
                    Rg = ρ · [ 1/Lt + 1/√(20·A) · (1 + 1/(1 + h·√(20/A))) ]
                  </div>
                  <div className="text-white/60">
                    Lt = {results.totalBuriedLengthLtM} m · Surface A = {results.gridAreaM2} m²
                  </div>
                  <div className="text-emerald-400 font-bold">= {results.gridResistanceRgOhm.toFixed(3)} Ω</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 Cols): Live Inspector Box & Parameter Adjustments */}
        <div className="lg:col-span-4 space-y-4 font-mono text-xs">
          {/* A. Live Inspector at Cursor Position */}
          <div className="p-4 rounded-2xl bg-[#0E1724] border border-cyan-500/30 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                {isFr ? 'Sondeur de Potentiel en Temps Réel' : 'Real-Time Potential Probe'}
              </span>
              <span className="text-[10px] text-white/50">{probeValues.locationLabel}</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-white/60">{isFr ? 'Coordonnées (X, Y) :' : 'Coordinates (X, Y) :'}</span>
                <span className="font-bold text-white">
                  {probeValues.xM} m, {probeValues.yM} m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">{isFr ? 'Potentiel de surface V(x,y) :' : 'Surface potential V(x,y) :'}</span>
                <span className="font-bold text-amber-300">{probeValues.surfaceV} V</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">{isFr ? 'Tension de toucher locale :' : 'Local touch voltage :'}</span>
                <span className={`font-bold ${probeValues.isTouchSafe ? 'text-emerald-400' : 'text-red-400'}`}>
                  {probeValues.touchV} V / {results.tolerableTouchVoltageV} V
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">{isFr ? 'Tension de pas locale :' : 'Local step voltage :'}</span>
                <span className={`font-bold ${probeValues.isStepSafe ? 'text-emerald-400' : 'text-red-400'}`}>
                  {probeValues.stepV} V / {results.tolerableStepVoltageV} V
                </span>
              </div>
            </div>

            <div
              className={`p-2 rounded-xl text-center font-bold text-[10px] ${
                probeValues.isTouchSafe && probeValues.isStepSafe
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/20 border border-red-500/40 text-red-300'
              }`}
            >
              {probeValues.isTouchSafe && probeValues.isStepSafe
                ? (isFr ? '✅ ZONE SÉCURISÉE (AUCUN DANGER)' : '✅ SAFE REGION (NO SHOCK HAZARD)')
                : (isFr ? '⚠️ DANGER LÉTAL : TENSIONS EXCESSIVES' : '⚠️ LETHAL HAZARD: EXCESSIVE VOLTAGE')}
            </div>
          </div>

          {/* B. Parameter Controls Accordion */}
          <div className="p-4 rounded-2xl bg-[#09101A] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-400" />
                {isFr ? 'Réglages de la Grille' : 'Grid Sizing Inputs'}
              </span>
              <button
                type="button"
                onClick={() => handleSelectPreset(selectedPresetId)}
                className="text-[10px] text-white/50 hover:text-white flex items-center gap-1 cursor-pointer"
                title={isFr ? 'Réinitialiser aux valeurs du poste' : 'Reset to preset defaults'}
              >
                <RefreshCw className="w-3 h-3" />
                <span>{isFr ? 'Défaut' : 'Reset'}</span>
              </button>
            </div>

            <div className="space-y-3 text-[11px]">
              {/* Length and Width */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-white/60 text-[10px]">{isFr ? 'Longueur Lx (m) :' : 'Length Lx (m):'}</label>
                  <input
                    type="number"
                    min={20}
                    max={300}
                    value={input.lengthM}
                    onChange={(e) =>
                      setInput({ ...input, lengthM: parseFloat(e.target.value) || 50 })
                    }
                    className="w-full bg-[#121E2C] border border-white/15 rounded-lg px-2.5 py-1 text-emerald-300 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-[10px]">{isFr ? 'Largeur Ly (m) :' : 'Width Ly (m):'}</label>
                  <input
                    type="number"
                    min={20}
                    max={300}
                    value={input.widthM}
                    onChange={(e) =>
                      setInput({ ...input, widthM: parseFloat(e.target.value) || 50 })
                    }
                    className="w-full bg-[#121E2C] border border-white/15 rounded-lg px-2.5 py-1 text-emerald-300 font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Mesh Count X & Y */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-white/60 text-[10px]">{isFr ? 'Mailles en X (Nx) :' : 'Meshes along X:'}</label>
                  <input
                    type="number"
                    min={2}
                    max={30}
                    value={input.meshCountX}
                    onChange={(e) =>
                      setInput({ ...input, meshCountX: parseInt(e.target.value) || 5 })
                    }
                    className="w-full bg-[#121E2C] border border-white/15 rounded-lg px-2.5 py-1 text-emerald-300 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-[10px]">{isFr ? 'Mailles en Y (Ny) :' : 'Meshes along Y:'}</label>
                  <input
                    type="number"
                    min={2}
                    max={30}
                    value={input.meshCountY}
                    onChange={(e) =>
                      setInput({ ...input, meshCountY: parseInt(e.target.value) || 5 })
                    }
                    className="w-full bg-[#121E2C] border border-white/15 rounded-lg px-2.5 py-1 text-emerald-300 font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Native Soil Resistivity rho */}
              <div>
                <div className="flex justify-between text-[10px] text-white/60 mb-1">
                  <span>{isFr ? 'Résistivité du sol (ρ) :' : 'Soil Resistivity (ρ):'}</span>
                  <span className="text-emerald-400 font-bold">{input.soilResistivityOhmM} Ω·m</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={1000}
                  step={10}
                  value={input.soilResistivityOhmM}
                  onChange={(e) =>
                    setInput({ ...input, soilResistivityOhmM: parseFloat(e.target.value) })
                  }
                  className="w-full accent-emerald-400"
                />
              </div>

              {/* Crushed Rock Layer */}
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/70 font-bold">
                    {isFr ? 'Lit de Gravier Concassé :' : 'Crushed Rock Surfacing :'}
                  </span>
                  <input
                    type="checkbox"
                    checked={input.hasCrushedRockLayer}
                    onChange={(e) =>
                      setInput({ ...input, hasCrushedRockLayer: e.target.checked })
                    }
                    className="accent-emerald-400 w-4 h-4 cursor-pointer"
                  />
                </div>

                {input.hasCrushedRockLayer && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-white/50 text-[9px]">{isFr ? 'Épaisseur hs (cm) :' : 'Thickness hs (cm):'}</label>
                      <input
                        type="number"
                        min={5}
                        max={30}
                        value={input.crushedRockThicknessCm}
                        onChange={(e) =>
                          setInput({ ...input, crushedRockThicknessCm: parseFloat(e.target.value) || 10 })
                        }
                        className="w-full bg-[#121E2C] border border-white/15 rounded-lg px-2 py-1 text-cyan-300 font-bold text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-[9px]">{isFr ? 'Résistivité ρs (Ω·m) :' : 'Resistivity ρs (Ω·m):'}</label>
                      <input
                        type="number"
                        min={1000}
                        max={6000}
                        step={100}
                        value={input.crushedRockResistivityOhmM}
                        onChange={(e) =>
                          setInput({ ...input, crushedRockResistivityOhmM: parseFloat(e.target.value) || 3000 })
                        }
                        className="w-full bg-[#121E2C] border border-white/15 rounded-lg px-2 py-1 text-cyan-300 font-bold text-[10px]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Fault Current & Clearing Time */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-white/60 text-[10px]">{isFr ? 'Défaut If (kA) :' : 'Fault If (kA):'}</label>
                  <input
                    type="number"
                    min={1}
                    max={63}
                    step={0.5}
                    value={input.faultCurrentRmsKa}
                    onChange={(e) =>
                      setInput({ ...input, faultCurrentRmsKa: parseFloat(e.target.value) || 10 })
                    }
                    className="w-full bg-[#121E2C] border border-white/15 rounded-lg px-2.5 py-1 text-amber-300 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-[10px]">{isFr ? 'Durée ts (s) :' : 'Time ts (s):'}</label>
                  <input
                    type="number"
                    min={0.05}
                    max={2.0}
                    step={0.05}
                    value={input.faultClearingTimeSec}
                    onChange={(e) =>
                      setInput({ ...input, faultClearingTimeSec: parseFloat(e.target.value) || 0.2 })
                    }
                    className="w-full bg-[#121E2C] border border-white/15 rounded-lg px-2.5 py-1 text-amber-300 font-bold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {onOpenReport && (
              <button
                type="button"
                onClick={onOpenReport}
                className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isFr ? 'Éditer Dossier de Terre PDF (IEEE 80)' : 'Generate IEEE 80 Earthing PDF'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

