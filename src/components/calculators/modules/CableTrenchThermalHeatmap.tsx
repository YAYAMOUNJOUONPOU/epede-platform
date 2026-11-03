// src/components/calculators/modules/CableTrenchThermalHeatmap.tsx
// EPEDE 2.0: Interactive 2D Underground Cable Trench Soil Thermal Heatmap & Cyclic Rating Inspector
// Normative standards: IEC 60287-1-1 / IEC 60287-2-1 / IEC 60853-1 / NF C 15-105 / Neher-McGrath Method
// Features: Superimposed Kennelly line source & mirror sink isotherm mesh, Trefoil/Flat/Double-Circuit arrangements,
// live crosshair thermal probe, cyclic boost factor M, and authentic Cameroon industrial grid presets.

import React, { useState, useMemo, useRef } from 'react';
import {
  Thermometer,
  Layers,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Flame,
  Info,
  Clock,
  Gauge,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sun,
  Eye,
  BookOpen,
  X,
  MapPin
} from 'lucide-react';
import {
  Iec60287CableAmpacityEngine,
  CableConstructionInput,
  TrenchEnvironmentInput,
  TrenchCableArrangement,
  ConductorMetal,
  InsulationMaterial,
  CAMEROON_CABLE_PRESETS,
  Iec60287AmpacityOutput
} from '../../../data/iec60287CableAmpacityEngine';

interface CableTrenchThermalHeatmapProps {
  locale: 'fr' | 'en';
  initialPresetId?: string;
  onSelectAmpacity?: (ampacityA: number) => void;
}

export const CableTrenchThermalHeatmap: React.FC<CableTrenchThermalHeatmapProps> = ({
  locale,
  initialPresetId = 'nomayos-225kv-feeder',
  onSelectAmpacity
}) => {
  // Preset selector
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPresetId);

  // Active Cable Construction State
  const [voltageKv, setVoltageKv] = useState<number>(225);
  const [conductorMaterial, setConductorMaterial] = useState<ConductorMetal>('aluminium');
  const [crossSectionMm2, setCrossSectionMm2] = useState<number>(630);
  const [insulationType, setInsulationType] = useState<InsulationMaterial>('xlpe_90');
  const [hasMetallicScreen, setHasMetallicScreen] = useState<boolean>(true);
  const [hasArmour, setHasArmour] = useState<boolean>(false);

  // Active Trench State
  const [arrangement, setArrangement] = useState<TrenchCableArrangement>('trefoil');
  const [axialSpacingMm, setAxialSpacingMm] = useState<number>(140);
  const [burialDepthM, setBurialDepthM] = useState<number>(1.4);
  const [soilThermalResistivityKmPerW, setSoilThermalResistivityKmPerW] = useState<number>(1.6);
  const [ambientGroundTempC, setAmbientGroundTempC] = useState<number>(30);
  const [cyclicLoadFactorMu, setCyclicLoadFactorMu] = useState<number>(0.75);

  // Interactive UI probe
  const [mouseProbe, setMouseProbe] = useState<{ xM: number; yM: number; tempC: number } | null>(null);
  const [isFormulasModalOpen, setIsFormulasModalOpen] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Apply Cameroon Preset
  const handleApplyPreset = (presetId: string) => {
    const preset = CAMEROON_CABLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setVoltageKv(preset.cable.voltageKv);
    setConductorMaterial(preset.cable.conductorMaterial);
    setCrossSectionMm2(preset.cable.crossSectionMm2);
    setInsulationType(preset.cable.insulationType);
    setHasMetallicScreen(preset.cable.hasMetallicScreen);
    setHasArmour(preset.cable.hasArmour);

    setArrangement(preset.trench.arrangement);
    setAxialSpacingMm(preset.trench.axialSpacingMm);
    setBurialDepthM(preset.trench.burialDepthM);
    setSoilThermalResistivityKmPerW(preset.trench.soilThermalResistivityKmPerW);
    setAmbientGroundTempC(preset.trench.ambientGroundTempC);
    setCyclicLoadFactorMu(preset.trench.cyclicLoadFactorMu);
  };

  // Run the physics engine
  const calculationResult: Iec60287AmpacityOutput = useMemo(() => {
    const cableInput: CableConstructionInput = {
      voltageKv,
      conductorMaterial,
      crossSectionMm2,
      insulationType,
      hasMetallicScreen,
      hasArmour,
      operatingFrequencyHz: 50
    };

    const trenchInput: TrenchEnvironmentInput = {
      arrangement,
      axialSpacingMm,
      burialDepthM,
      soilThermalResistivityKmPerW,
      ambientGroundTempC,
      cyclicLoadFactorMu,
      phaseNumber: 3
    };

    return Iec60287CableAmpacityEngine.solve(cableInput, trenchInput);
  }, [
    voltageKv,
    conductorMaterial,
    crossSectionMm2,
    insulationType,
    hasMetallicScreen,
    hasArmour,
    arrangement,
    axialSpacingMm,
    burialDepthM,
    soilThermalResistivityKmPerW,
    ambientGroundTempC,
    cyclicLoadFactorMu
  ]);

  // SVG Coordinates Transformation (Domain: X [-0.8m .. +0.8m], Y [0.0m .. 1.6m])
  const svgWidth = 640;
  const svgHeight = 440;
  const paddingLeft = 65;
  const paddingRight = 35;
  const paddingTop = 45;
  const paddingBottom = 45;
  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  const toSvgX = (xM: number) => {
    // xM: -0.8 to +0.8
    const norm = (xM - (-0.8)) / 1.6;
    return paddingLeft + norm * plotWidth;
  };

  const toSvgY = (yM: number) => {
    // yM: 0.0 to 1.6
    const norm = yM / 1.6;
    return paddingTop + norm * plotHeight;
  };

  const fromSvgCoords = (svgX: number, svgY: number) => {
    const normX = Math.max(0, Math.min(1, (svgX - paddingLeft) / plotWidth));
    const normY = Math.max(0, Math.min(1, (svgY - paddingTop) / plotHeight));
    const xM = -0.8 + normX * 1.6;
    const yM = normY * 1.6;
    return { xM, yM };
  };

  // Temperature color palette (Navy Blue -> Cyan -> Yellow -> Orange -> Crimson)
  const getTemperatureColor = (tempC: number) => {
    const minT = ambientGroundTempC;
    const maxT = Math.max(minT + 25, calculationResult.maxContinuousTempC);
    const ratio = Math.max(0, Math.min(1, (tempC - minT) / (maxT - minT)));

    if (ratio < 0.25) {
      // Blue to Cyan
      const t = ratio / 0.25;
      const r = Math.round(15 + t * (6 - 15));
      const g = Math.round(23 + t * (182 - 23));
      const b = Math.round(42 + t * (212 - 42));
      return `rgb(${r}, ${g}, ${b})`;
    } else if (ratio < 0.5) {
      // Cyan to Emerald/Lime
      const t = (ratio - 0.25) / 0.25;
      const r = Math.round(6 + t * (16 - 6));
      const g = Math.round(182 + t * (185 - 182));
      const b = Math.round(212 + t * (129 - 212));
      return `rgb(${r}, ${g}, ${b})`;
    } else if (ratio < 0.75) {
      // Lime to Amber
      const t = (ratio - 0.5) / 0.25;
      const r = Math.round(16 + t * (245 - 16));
      const g = Math.round(185 + t * (158 - 185));
      const b = Math.round(129 + t * (11 - 129));
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Amber to Crimson
      const t = (ratio - 0.75) / 0.25;
      const r = Math.round(245 + t * (239 - 245));
      const g = Math.round(158 + t * (68 - 158));
      const b = Math.round(11 + t * (68 - 11));
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  // Mouse move handler over SVG
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * svgWidth;
    const svgY = ((e.clientY - rect.top) / rect.height) * svgHeight;

    if (svgX < paddingLeft || svgX > svgWidth - paddingRight || svgY < paddingTop || svgY > svgHeight - paddingBottom) {
      setMouseProbe(null);
      return;
    }

    const { xM, yM } = fromSvgCoords(svgX, svgY);

    // Calculate probe temperature using Kennelly line source & mirror sink superposition
    const deExtM = calculationResult.cableExternalDiameterMm / 1000;
    let tempRise = 0;
    for (const cable of calculationResult.cables) {
      const dDirect = Math.sqrt(Math.pow(xM - cable.xM, 2) + Math.pow(yM - cable.yM, 2));
      const dClamped = Math.max(deExtM / 2, dDirect);
      const dMirror = Math.sqrt(Math.pow(xM - cable.xM, 2) + Math.pow(yM + cable.yM, 2));
      const deltaT = (soilThermalResistivityKmPerW * cable.heatLossWPerM) / (2 * Math.PI) * Math.log(dMirror / dClamped);
      tempRise += Math.max(0, deltaT);
    }
    const tempC = Number((ambientGroundTempC + tempRise).toFixed(1));
    setMouseProbe({ xM, yM, tempC });
  };

  const handleSvgMouseLeave = () => {
    setMouseProbe(null);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. HEADER & PRESETS SELECTOR */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-sm space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                CEI 60287 / CEI 60853 / NF C 15-105
              </span>
              <span className="text-xs text-slate-400 font-mono">
                [Modèle Neher-McGrath & Superposition Isotherme 2D de Kennelly]
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-cyan-400" />
              {locale === 'fr'
                ? 'Champ Thermique 2D en Tranchée & Ampacité Cyclique des Câbles Souterrains'
                : '2D Cable Trench Soil Thermal Heatmap & Cyclic Ampacity Inspector'}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-4xl">
              {locale === 'fr'
                ? "Simulez le champ de température bidimensionnel T(x, y) dans le sol, la résistance thermique externe T4 par la méthode des images de Kennelly, le coefficient de surintensité cyclique journalier M (CEI 60853-1) et le risque critique d'assèchement du sol (Soil Drying-Out) sous climat tropical camerounais."
                : 'Simulate 2D soil temperature gradient T(x, y), external thermal resistance T4 via Kennelly image sources, daily cyclic overload boost M (IEC 60853-1), and soil drying-out risks under tropical conditions.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFormulasModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              {locale === 'fr' ? 'Formules & Normes' : 'Formulas & Standards'}
            </button>
            {onSelectAmpacity && (
              <button
                onClick={() => onSelectAmpacity(calculationResult.continuousAmpacityA)}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                {locale === 'fr' ? 'Injecter dans Calculateur' : 'Inject into Sizing'}
              </button>
            )}
          </div>
        </div>

        {/* Cameroon Presets Bar */}
        <div>
          <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{locale === 'fr' ? 'Cas d’Études d’Ingénierie Réels au Cameroun (SONATREL / Eneo / Projets Industriels) :' : 'Authentic Cameroon Engineering Presets:'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {CAMEROON_CABLE_PRESETS.map((preset) => {
              const isSelected = preset.id === selectedPresetId;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-500/80 text-white shadow-md'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold font-mono">
                    <span className={isSelected ? 'text-cyan-300' : 'text-slate-200'}>
                      {preset.cable.voltageKv} kV — {preset.cable.crossSectionMm2} mm² {preset.cable.conductorMaterial === 'aluminium' ? 'Al' : 'Cu'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-400">
                      {preset.trench.arrangement}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1 line-clamp-1">
                    {preset.name[locale]}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    ρs = {preset.trench.soilThermalResistivityKmPerW} K·m/W | Prof. {preset.trench.burialDepthM} m
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 2D INTERACTIVE TRENCH HEATMAP & LIVE CROSSHAIR PROBE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 2D SVG Heatmap (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              {locale === 'fr'
                ? 'Coupe Transversale de la Tranchée & Isothermes du Sol'
                : 'Trench Cross-Section & Soil Isothermal Field'}
            </h3>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                {ambientGroundTempC}°C Sol Ambiant
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                {calculationResult.maxContinuousTempC}°C Âme Câble
              </span>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden flex justify-center">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto cursor-crosshair select-none"
              onMouseMove={handleSvgMouseMove}
              onMouseLeave={handleSvgMouseLeave}
            >
              <defs>
                {/* Ground surface hatch pattern */}
                <pattern id="soilHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#334155" strokeWidth="1" />
                </pattern>
                {/* Warning mesh pattern (grillage avertisseur) */}
                <pattern id="warningGrid" width="6" height="6" patternUnits="userSpaceOnUse">
                  <path d="M 0 3 L 6 3 M 3 0 L 3 6" stroke="#ef4444" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Trench Background Soil Area */}
              <rect
                x={paddingLeft}
                y={paddingTop}
                width={plotWidth}
                height={plotHeight}
                fill="#090d16"
              />

              {/* 2D Heatmap Grid Cell Rectangles */}
              {calculationResult.heatmapGrid.map((row, iy) => {
                if (iy === calculationResult.heatmapGrid.length - 1) return null;
                const nextRow = calculationResult.heatmapGrid[iy + 1];
                const cellY = toSvgY(row[0].yM);
                const cellHeight = toSvgY(nextRow[0].yM) - cellY;

                return row.map((point, ix) => {
                  if (ix === row.length - 1) return null;
                  const nextPoint = row[ix + 1];
                  const cellX = toSvgX(point.xM);
                  const cellWidth = toSvgX(nextPoint.xM) - cellX;
                  const avgTemp = (point.tempC + nextPoint.tempC + nextRow[ix].tempC + nextRow[ix + 1].tempC) / 4;

                  return (
                    <rect
                      key={`grid-${iy}-${ix}`}
                      x={cellX}
                      y={cellY}
                      width={cellWidth + 0.5}
                      height={cellHeight + 0.5}
                      fill={getTemperatureColor(avgTemp)}
                      opacity={0.78}
                    />
                  );
                });
              })}

              {/* Sand Bedding Envelope (Lit de pose en sable) */}
              <rect
                x={toSvgX(-0.55)}
                y={toSvgY(burialDepthM - 0.25)}
                width={toSvgX(0.55) - toSvgX(-0.55)}
                height={toSvgY(burialDepthM + 0.25) - toSvgY(burialDepthM - 0.25)}
                fill="none"
                stroke="#eab308"
                strokeWidth="1.2"
                strokeDasharray="4,4"
                opacity={0.65}
              />
              <text
                x={toSvgX(-0.53)}
                y={toSvgY(burialDepthM - 0.20)}
                fill="#eab308"
                fontSize="9"
                fontFamily="monospace"
                opacity={0.8}
              >
                {locale === 'fr' ? 'Lit de pose sable stabilisé' : 'Stabilized sand bedding'}
              </text>

              {/* Red Warning Mesh (Grillage avertisseur rouge NF C 15-100) */}
              <rect
                x={toSvgX(-0.50)}
                y={toSvgY(Math.max(0.2, burialDepthM - 0.40))}
                width={toSvgX(0.50) - toSvgX(-0.50)}
                height={6}
                fill="url(#warningGrid)"
                stroke="#ef4444"
                strokeWidth="1"
              />
              <text
                x={toSvgX(-0.48)}
                y={toSvgY(Math.max(0.2, burialDepthM - 0.40)) - 3}
                fill="#f87171"
                fontSize="8.5"
                fontFamily="monospace"
              >
                {locale === 'fr' ? 'Grillage avertisseur rouge (20 cm au-dessus)' : 'Red warning tape mesh (20 cm above)'}
              </text>

              {/* Ground Surface Line (y = 0.0m) */}
              <line
                x1={paddingLeft}
                y1={paddingTop}
                x2={paddingLeft + plotWidth}
                y2={paddingTop}
                stroke="#22c55e"
                strokeWidth="2.5"
              />
              <rect
                x={paddingLeft}
                y={paddingTop - 14}
                width={plotWidth}
                height={14}
                fill="url(#soilHatch)"
                opacity={0.5}
              />
              <text
                x={paddingLeft + 10}
                y={paddingTop - 4}
                fill="#86efac"
                fontSize="9.5"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {locale === 'fr' ? 'Niveau du Sol Naturel (TN: y = 0.00 m)' : 'Natural Ground Surface (y = 0.00 m)'}
              </text>

              {/* Depth Markers on Y-Axis */}
              {[0.0, 0.4, 0.8, 1.2, 1.6].map((depth) => {
                const yPos = toSvgY(depth);
                return (
                  <g key={`y-mark-${depth}`}>
                    <line
                      x1={paddingLeft - 6}
                      y1={yPos}
                      x2={paddingLeft}
                      y2={yPos}
                      stroke="#64748b"
                      strokeWidth="1.2"
                    />
                    <text
                      x={paddingLeft - 10}
                      y={yPos + 3.5}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {depth.toFixed(1)} m
                    </text>
                  </g>
                );
              })}

              {/* Lateral Markers on X-Axis */}
              {[-0.6, -0.3, 0.0, 0.3, 0.6].map((xVal) => {
                const xPos = toSvgX(xVal);
                return (
                  <g key={`x-mark-${xVal}`}>
                    <line
                      x1={xPos}
                      y1={paddingTop + plotHeight}
                      x2={xPos}
                      y2={paddingTop + plotHeight + 6}
                      stroke="#64748b"
                      strokeWidth="1.2"
                    />
                    <text
                      x={xPos}
                      y={paddingTop + plotHeight + 17}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {xVal > 0 ? `+${xVal.toFixed(1)}` : xVal.toFixed(1)} m
                    </text>
                  </g>
                );
              })}

              {/* Cable Conductors Renders (Concentric Circles: Sheath -> Insulation -> Core) */}
              {calculationResult.cables.map((cable) => {
                const cx = toSvgX(cable.xM);
                const cy = toSvgY(cable.yM);
                const deExtM = calculationResult.cableExternalDiameterMm / 1000;
                const rExtSvg = (deExtM / 1.6) * plotWidth * 0.5;
                const rCoreSvg = rExtSvg * 0.45;

                return (
                  <g key={`cable-${cable.cableIndex}`}>
                    {/* Outer Sheath */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={rExtSvg}
                      fill="#1e293b"
                      stroke="#06b6d4"
                      strokeWidth="2"
                    />
                    {/* Insulation Layer */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={rExtSvg * 0.75}
                      fill="#334155"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                    {/* Metallic Conductor Core */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={rCoreSvg}
                      fill={conductorMaterial === 'copper' ? '#ea580c' : '#94a3b8'}
                      stroke="#f8fafc"
                      strokeWidth="1.5"
                    />
                    {/* Phase Label */}
                    <text
                      x={cx}
                      y={cy + 3}
                      fill="#ffffff"
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {cable.phaseId}
                    </text>
                    {/* Temperature Pill */}
                    <rect
                      x={cx - 18}
                      y={cy - rExtSvg - 14}
                      width={36}
                      height={12}
                      rx="3"
                      fill="#0f172a"
                      stroke="#06b6d4"
                      strokeWidth="1"
                    />
                    <text
                      x={cx}
                      y={cy - rExtSvg - 5}
                      fill="#22d3ee"
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {calculationResult.maxContinuousTempC}°C
                    </text>
                  </g>
                );
              })}

              {/* Interactive Crosshair Probe Indicator */}
              {mouseProbe && (
                <g>
                  {/* Vertical Crosshair Line */}
                  <line
                    x1={toSvgX(mouseProbe.xM)}
                    y1={paddingTop}
                    x2={toSvgX(mouseProbe.xM)}
                    y2={paddingTop + plotHeight}
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  {/* Horizontal Crosshair Line */}
                  <line
                    x1={paddingLeft}
                    y1={toSvgY(mouseProbe.yM)}
                    x2={paddingLeft + plotWidth}
                    y2={toSvgY(mouseProbe.yM)}
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  {/* Probe Circle Target */}
                  <circle
                    cx={toSvgX(mouseProbe.xM)}
                    cy={toSvgY(mouseProbe.yM)}
                    r="4.5"
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>
              )}
            </svg>

            {/* Floating Live Hover Tooltip */}
            {mouseProbe && (
              <div
                className="absolute pointer-events-none px-3 py-2 rounded-xl bg-slate-900/95 border border-cyan-400 text-white font-mono text-xs shadow-2xl space-y-0.5 backdrop-blur-md"
                style={{
                  left: `${Math.min(70, Math.max(15, ((toSvgX(mouseProbe.xM)) / svgWidth) * 100))}%`,
                  top: `${Math.min(75, Math.max(10, ((toSvgY(mouseProbe.yM)) / svgHeight) * 100))}%`
                }}
              >
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>T_sol = {mouseProbe.tempC} °C</span>
                </div>
                <div className="text-[10px] text-slate-300">
                  x = {(mouseProbe.xM * 100).toFixed(0)} cm | Profondeur y = {(mouseProbe.yM * 100).toFixed(0)} cm
                </div>
                <div className="text-[9px] text-slate-400">
                  Échauffement ΔT : +{(mouseProbe.tempC - ambientGroundTempC).toFixed(1)} K
                </div>
              </div>
            )}
          </div>

          {/* Color Scale Legend */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2">
            <span>Ambiant : {ambientGroundTempC}°C</span>
            <div className="h-3 w-48 rounded-full bg-gradient-to-r from-[#0f172a] via-[#06b6d4] via-[#eab308] to-[#ef4444] border border-slate-700" />
            <span>Âme Câble : {calculationResult.maxContinuousTempC}°C</span>
          </div>
        </div>

        {/* Right Column: Key Outputs & Safety Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Permissible Ampacity Badge */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/50 border border-cyan-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold">
                {locale === 'fr' ? 'COURANT ADMISSIBLE NOMINAL (CEI 60287)' : 'CONTINUOUS PERMISSIBLE AMPACITY'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-900/60 text-cyan-300 border border-cyan-700">
                θ_max = {calculationResult.maxContinuousTempC}°C
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                {calculationResult.continuousAmpacityA}
              </span>
              <span className="text-xl font-bold font-mono text-cyan-400">A</span>
              <span className="text-xs text-slate-400 font-mono ml-auto">
                (S_eff = {calculationResult.continuousAmpacityA * Math.sqrt(3) * voltageKv / 1000 > 10 ? (calculationResult.continuousAmpacityA * Math.sqrt(3) * voltageKv / 1000).toFixed(1) : (calculationResult.continuousAmpacityA * Math.sqrt(3) * voltageKv / 1000).toFixed(2)} MVA)
              </span>
            </div>

            {/* Cyclic Ampacity Benefit (IEC 60853) */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {locale === 'fr' ? 'Ampacité Cyclique (CEI 60853-1) :' : 'Cyclic Ampacity (IEC 60853):'}
                </span>
                <span className="text-amber-400 font-bold text-sm">
                  {calculationResult.cyclicAmpacityA} A
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Facteur de boost M : &times;{calculationResult.cyclicBoostFactorM}</span>
                <span>Facteur charge μ : {cyclicLoadFactorMu.toFixed(2)}</span>
              </div>
            </div>

            {/* Diagnostic Badges */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className={`p-2.5 rounded-xl border ${
                calculationResult.soilDryingRisk
                  ? 'bg-rose-950/60 border-rose-700 text-rose-300'
                  : 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
              }`}>
                <div className="text-[10px] opacity-75">T_gaine/sol :</div>
                <div className="text-sm font-bold mt-0.5">{calculationResult.outerSheathTempC}°C</div>
                <div className="text-[9px] mt-0.5">
                  {calculationResult.soilDryingRisk ? 'DANGER ASSÈCHEMENT (>50°C)' : 'Sain (≤ 50°C)'}
                </div>
              </div>

              <div className="p-2.5 rounded-xl border bg-slate-950 border-slate-800 text-slate-300">
                <div className="text-[10px] text-slate-500">Tenue Isc 1s (CEI 60949) :</div>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">
                  {calculationResult.oneSecondShortCircuitKa} kA
                </div>
                <div className="text-[9px] text-slate-500">k = {calculationResult.shortCircuitAdiabaticConstantK} A·s½/mm²</div>
              </div>
            </div>
          </div>

          {/* Thermal Resistances Ladder Breakdown (T1, T2, T3, T4) */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono text-xs">
            <h4 className="font-bold text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Layers className="w-4 h-4" />
                {locale === 'fr' ? 'ÉCHELLE DES RÉSISTANCES THERMIQUES (K·m/W)' : 'THERMAL RESISTANCES LADDER'}
              </span>
              <span className="text-white font-bold">Rth = {calculationResult.totalThermalResistanceRth}</span>
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400">T1 (Isolant XLPE/EPR) :</span>
                <span className="text-cyan-300 font-bold">{calculationResult.t1_insulation} K·m/W</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400">T3 (Gaine extérieure PE) :</span>
                <span className="text-cyan-300 font-bold">{calculationResult.t3_outerSheath} K·m/W</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400">T4 Propre (Sol Kennelly) :</span>
                <span className="text-amber-400 font-bold">{calculationResult.t4_externalSoilSelf} K·m/W</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400">T4 Mutuel (Proximité phases) :</span>
                <span className="text-amber-400 font-bold">+{calculationResult.t4_mutualProximity} K·m/W</span>
              </div>
              <div className="flex justify-between items-center bg-cyan-950/40 p-2 rounded-lg border border-cyan-800/60 text-cyan-200 font-bold">
                <span>T4 Total Sol Environnant :</span>
                <span>{calculationResult.t4_totalSurrounding} K·m/W</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PARAMETRIC SLIDERS & TRENCH GEOMETRY CONTROLS */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-4">
        <h3 className="text-sm font-bold font-mono text-cyan-400 flex items-center gap-2">
          <Sliders className="w-4 h-4" />
          {locale === 'fr'
            ? 'RÉGLAGES PARAMÉTRIQUES DE LA TRANCHÉE & DU CÂBLE'
            : 'TRENCH & CABLE PARAMETRIC CONFIGURATION'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Arrangement */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block font-bold">Disposition en Tranchée :</span>
            <select
              value={arrangement}
              onChange={(e) => setArrangement(e.target.value as TrenchCableArrangement)}
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
            >
              <option value="trefoil">Trèfle Jointif (Trefoil touching)</option>
              <option value="flat_touching">Nappe Horizontale Jointive</option>
              <option value="flat_spaced">Nappe Horizontale Espacée</option>
              <option value="two_circuits_spaced">Double Terne Espacé (6 câbles)</option>
            </select>
          </div>

          {/* Section mm2 */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Section Conducteur :</span>
              <span className="text-cyan-400 font-bold">{crossSectionMm2} mm²</span>
            </div>
            <select
              value={crossSectionMm2}
              onChange={(e) => setCrossSectionMm2(Number(e.target.value))}
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
            >
              {[95, 120, 150, 185, 240, 300, 400, 500, 630, 800].map((s) => (
                <option key={s} value={s}>{s} mm²</option>
              ))}
            </select>
          </div>

          {/* Burial Depth L */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Profondeur de Pose (L) :</span>
              <span className="text-cyan-400 font-bold">{burialDepthM} m</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="2.0"
              step="0.05"
              value={burialDepthM}
              onChange={(e) => setBurialDepthM(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Soil Thermal Resistivity */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Résistivité Sol (ρs) :</span>
              <span className="text-amber-400 font-bold">{soilThermalResistivityKmPerW} K·m/W</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.1"
              value={soilThermalResistivityKmPerW}
              onChange={(e) => setSoilThermalResistivityKmPerW(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Humide (0.8)</span>
              <span>Standard (1.5)</span>
              <span>Sahel Sec (2.2)</span>
            </div>
          </div>

          {/* Conductor Material */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block font-bold">Métal d'Âme :</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConductorMaterial('aluminium')}
                className={`p-2 rounded-lg text-center font-bold transition-all ${
                  conductorMaterial === 'aluminium'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Aluminium (Al)
              </button>
              <button
                type="button"
                onClick={() => setConductorMaterial('copper')}
                className={`p-2 rounded-lg text-center font-bold transition-all ${
                  conductorMaterial === 'copper'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Cuivre (Cu)
              </button>
            </div>
          </div>

          {/* Axial Spacing */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Entraxe Câbles (s) :</span>
              <span className="text-cyan-400 font-bold">{axialSpacingMm} mm</span>
            </div>
            <input
              type="range"
              min="80"
              max="450"
              step="10"
              value={axialSpacingMm}
              onChange={(e) => setAxialSpacingMm(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Ambient Ground Temp */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Température Sol (θa) :</span>
              <span className="text-rose-400 font-bold">{ambientGroundTempC} °C</span>
            </div>
            <input
              type="range"
              min="20"
              max="40"
              step="1"
              value={ambientGroundTempC}
              onChange={(e) => setAmbientGroundTempC(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

          {/* Cyclic Load Factor mu */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Facteur de Charge (μ) :</span>
              <span className="text-cyan-400 font-bold">{cyclicLoadFactorMu.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.05"
              value={cyclicLoadFactorMu}
              onChange={(e) => setCyclicLoadFactorMu(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Cyclique fort (0.5)</span>
              <span>Continu 100% (1.0)</span>
            </div>
          </div>
        </div>

        {/* Advisory Notes from Engine */}
        {calculationResult.advisoryNotes.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold font-mono text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{locale === 'fr' ? 'Recommandations & Directives Normatives :' : 'Normative Recommendations:'}</span>
            </div>
            <ul className="space-y-1 text-xs font-mono text-slate-300">
              {calculationResult.advisoryNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>{note[locale]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MATHEMATICAL FORMULATIONS & NORMATIVE EQUATIONS MODAL */}
      {/* ========================================================================= */}
      {isFormulasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  {locale === 'fr'
                    ? 'Formulations Mathématiques de la CEI 60287 & CEI 60853'
                    : 'IEC 60287 & IEC 60853 Mathematical Formulations'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400">1. Équation Fondamentale d'Ampacité Continue (CEI 60287-1-1 Éq. 1) :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-white font-mono">
                  I = &radic;[ (&Delta;&theta; - Wd &middot; [0.5 T1 + n(T2 + T3 + T4)]) / (Rac &middot; [T1 + n(1+&lambda;1)T2 + n(1+&lambda;1+&lambda;2)(T3+T4)]) ]
                </div>
                <p className="text-[11px] text-slate-400">
                  Équilibre exact entre échauffement Joule dans l'âme, pertes diélectriques Wd, pertes par courants de circulation dans les écrans (&lambda;1) et dissipation dans le sol (T4).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400">2. Résistance Thermique Externe du Sol T4 (Méthode de Kennelly) :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-white font-mono">
                  T4 = (&rho;s / 2&pi;) &middot; ln[ (2L / De) + &radic;((2L / De)&sup2; - 1) ]
                </div>
                <p className="text-[11px] text-slate-400">
                  Résout l'équation de conduction de Laplace dans le demi-plan infini en introduisant une ligne puits thermique miroir au-dessus du sol (y = -L).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400">3. Facteur de Majoration Cyclique Journalière M (CEI 60853-1) :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-white font-mono">
                  M = 1 / &radic;[ &mu; + (1 - &mu;) &middot; (T_interne / T_total) ]
                </div>
                <p className="text-[11px] text-slate-400">
                  Prend en compte l'inertie thermique élevée du sol environnant face à une courbe de charge journalière foisonnée (&mu; &lt; 1.0).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400">4. Superposition Isotherme du Champ 2D T(x, y) :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-white font-mono">
                  T(x, y) = Ta + &sum; [ (&rho;s &middot; Wk / 2&pi;) &middot; ln( &radic;((x - xk)&sup2; + (y + yk)&sup2;) / &radic;((x - xk)&sup2; + (y - yk)&sup2;) ) ]
                </div>
                <p className="text-[11px] text-slate-400">
                  La superposition de chaque source réelle en (xk, yk) et de son image miroir négative en (xk, -yk) force rigoureusement la condition limite isotherme T(x, 0) = Ta en surface.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold"
              >
                {locale === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

