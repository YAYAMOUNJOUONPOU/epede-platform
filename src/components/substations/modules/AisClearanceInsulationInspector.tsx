// src/components/substations/modules/AisClearanceInsulationInspector.tsx
// EPEDE 2.0: High-Voltage Air-Insulated Substation (AIS) 2.5D Clearances & Insulation Coordination Inspector
// Normative standards: IEC 61936-1, IEC 60071-1, IEC 60071-2, IEC/TS 60815-1
// Features: 2.5D Bay layout, safety clearance envelopes (Phase-to-Earth N, Phase-to-Phase P, Pedestrian B1, Vehicle B2),
// altitude dielectric derating ka, creepage distance, surge arrester separation margin, and authentic Cameroon presets.

import React, { useState, useMemo, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sliders,
  RotateCcw,
  Maximize2,
  Info,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  MapPin,
  X,
  Compass,
  Ruler,
  TrendingUp,
  Mountain,
  Waves
} from 'lucide-react';
import {
  Iec61936AisClearanceEngine,
  SubstationVoltageTier,
  PollutionClass,
  AisClearanceInput,
  AisClearanceOutput,
  CAMEROON_AIS_PRESETS
} from '../../../data/iec61936AisClearanceEngine';

interface AisClearanceInsulationInspectorProps {
  locale: 'fr' | 'en';
  initialPresetId?: string;
  onApplyClearance?: (clearanceMm: number) => void;
}

export const AisClearanceInsulationInspector: React.FC<AisClearanceInsulationInspectorProps> = ({
  locale,
  initialPresetId = 'bekoko-225kv-coastal',
  onApplyClearance
}) => {
  // Preset selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPresetId);

  // Active Parametric State
  const [nominalVoltageKv, setNominalVoltageKv] = useState<SubstationVoltageTier>(225);
  const [altitudeMeters, setAltitudeMeters] = useState<number>(25);
  const [pollutionClass, setPollutionClass] = useState<PollutionClass>('class_d_heavy');
  const [surgeArresterDistanceMeters, setSurgeArresterDistanceMeters] = useState<number>(8.0);
  const [surgeArresterResidualVoltageKv, setSurgeArresterResidualVoltageKv] = useState<number>(560);
  const [lightningSteepnessKvPerUs, setLightningSteepnessKvPerUs] = useState<number>(1200);

  // View & Interactive Measurement Overlay
  const [showPedestrianZone, setShowPedestrianZone] = useState<boolean>(true);
  const [showVehicleZone, setShowVehicleZone] = useState<boolean>(true);
  const [showClearanceCones, setShowClearanceCones] = useState<boolean>(true);
  const [isFormulasModalOpen, setIsFormulasModalOpen] = useState<boolean>(false);
  const [hoveredApparatus, setHoveredApparatus] = useState<string | null>(null);

  // Apply Cameroon Preset
  const handleApplyPreset = (presetId: string) => {
    const preset = CAMEROON_AIS_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setNominalVoltageKv(preset.input.nominalVoltageKv);
    setAltitudeMeters(preset.input.altitudeMeters);
    setPollutionClass(preset.input.pollutionClass);
    setSurgeArresterDistanceMeters(preset.input.surgeArresterDistanceMeters);
    setSurgeArresterResidualVoltageKv(preset.input.surgeArresterResidualVoltageKv);
    setLightningSteepnessKvPerUs(preset.input.lightningSteepnessKvPerUs || 1200);
  };

  // Run the physics engine
  const calculationResult: AisClearanceOutput = useMemo(() => {
    const input: AisClearanceInput = {
      nominalVoltageKv,
      highestVoltageUmKv: nominalVoltageKv === 225 ? 245 : nominalVoltageKv === 90 ? 100 : nominalVoltageKv === 30 ? 36 : 17.5,
      bilKvPeak: nominalVoltageKv === 225 ? 1050 : nominalVoltageKv === 90 ? 450 : nominalVoltageKv === 30 ? 170 : 95,
      altitudeMeters,
      pollutionClass,
      surgeArresterDistanceMeters,
      surgeArresterResidualVoltageKv,
      lightningSteepnessKvPerUs
    };
    return Iec61936AisClearanceEngine.solve(input);
  }, [
    nominalVoltageKv,
    altitudeMeters,
    pollutionClass,
    surgeArresterDistanceMeters,
    surgeArresterResidualVoltageKv,
    lightningSteepnessKvPerUs
  ]);

  // Synchronize residual voltage when voltage tier changes
  const handleVoltageTierChange = (tier: SubstationVoltageTier) => {
    setNominalVoltageKv(tier);
    if (tier === 225) {
      setSurgeArresterResidualVoltageKv(560);
    } else if (tier === 90) {
      setSurgeArresterResidualVoltageKv(245);
    } else if (tier === 30) {
      setSurgeArresterResidualVoltageKv(85);
    } else {
      setSurgeArresterResidualVoltageKv(42);
    }
  };

  // SVG Bay Layout Dimensions
  const svgWidth = 840;
  const svgHeight = 440;
  const groundY = 380; // Baseline yard ground level
  const scale = nominalVoltageKv === 225 ? 0.024 : 0.030; // mm to SVG pixels

  // Dynamic apparatus coordinates along the bay axis (X)
  const gantryX = 110;
  const busbarX = 190;
  const disconnectorX = 320;
  const breakerX = 450;
  const ctPtX = 570;
  const arresterX = 670;
  const trafoX = 770;

  // Clearances in pixels
  const nPx = calculationResult.clearancesCorrected.phaseToEarthNMm * scale;
  const pPx = calculationResult.clearancesCorrected.phaseToPhasePMm * scale;
  const b1Px = calculationResult.clearancesCorrected.pedestrianSafetyB1Mm * scale;
  const b2Px = calculationResult.clearancesCorrected.vehicularSafetyB2Mm * scale;

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. HEADER & CAMEROON PRESETS BAR */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-sky-500/30 backdrop-blur-sm space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800">
                CEI 61936-1 / CEI 60071-1 / CEI/TS 60815
              </span>
              <span className="text-xs text-slate-400 font-mono">
                [Distances d'Isolement dans l'Air, Déclassement d'Altitude ka & Lignes de Fuite]
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-400" />
              {locale === 'fr'
                ? 'Gabarits Électriques 2.5D & Coordination de l’Isolement en Poste HTB (AIS)'
                : '2.5D Electrical Clearances & Insulation Coordination Inspector (AIS)'}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-4xl">
              {locale === 'fr'
                ? "Inspectez les enveloppes de sécurité diélectriques en travée ouverte (phase-masse N, phase-phase P, hauteur piétonne B1, gabarit véhicule B2), le coefficient d'altitude ka (Hauts-Plateaux de l'Ouest / Adamaoua) et la marge de protection onde de choc parafoudre/transformateur."
                : 'Inspect dielectric safety clearances (phase-to-earth N, phase-to-phase P, pedestrian B1, vehicle B2), altitude correction ka (Western Highlands/Adamawa), and surge arrester protective margins.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFormulasModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              {locale === 'fr' ? 'Formules CEI' : 'IEC Formulas'}
            </button>
            {onApplyClearance && (
              <button
                onClick={() => onApplyClearance(calculationResult.clearancesCorrected.phaseToEarthNMm)}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                {locale === 'fr' ? 'Appliquer Distance N' : 'Apply Clearance N'}
              </button>
            )}
          </div>
        </div>

        {/* Cameroon Presets Bar */}
        <div>
          <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>{locale === 'fr' ? 'Postes Stratégiques du Réseau SONATREL (RIS / RIN) :' : 'Strategic SONATREL Substation Nodes:'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {CAMEROON_AIS_PRESETS.map((preset) => {
              const isSelected = preset.id === selectedPresetId;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-sky-950/60 border-sky-500/80 text-white shadow-md'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold font-mono">
                    <span className={isSelected ? 'text-sky-300' : 'text-slate-200'}>
                      {preset.input.nominalVoltageKv} kV — Alt. {preset.input.altitudeMeters} m
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-400">
                      BIL {preset.input.bilKvPeak} kV
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1 line-clamp-1">
                    {preset.name[locale]}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {preset.region[locale]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE 2.5D BAY LAYOUT & SAFETY CLEARANCE ENVELOPES */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 2.5D Bay SVG (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-2">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              {locale === 'fr'
                ? `Coupe Élévation Travée Poste AIS ${nominalVoltageKv} kV`
                : `${nominalVoltageKv} kV AIS Substation Bay Elevation View`}
            </h3>

            {/* Toggle Envelopes */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setShowPedestrianZone(!showPedestrianZone)}
                className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                  showPedestrianZone
                    ? 'bg-amber-950/70 border-amber-600 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                Gabarit Piéton B1
              </button>
              <button
                type="button"
                onClick={() => setShowVehicleZone(!showVehicleZone)}
                className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                  showVehicleZone
                    ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                Gabarit Véhicule B2
              </button>
              <button
                type="button"
                onClick={() => setShowClearanceCones(!showClearanceCones)}
                className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                  showClearanceCones
                    ? 'bg-sky-950/70 border-sky-600 text-sky-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                Sphères d'Isolement N
              </button>
            </div>
          </div>

          {/* SVG Substation Canvas */}
          <div className="relative bg-[#070a13] rounded-xl border border-slate-800 overflow-hidden flex justify-center p-2">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto select-none font-mono"
            >
              <defs>
                {/* Crushed rock gravel pattern */}
                <pattern id="gravelHatch" width="10" height="10" patternTransform="rotate(30 0 0)" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#475569" />
                  <circle cx="7" cy="7" r="1.2" fill="#334155" />
                  <circle cx="8" cy="2" r="0.8" fill="#64748b" />
                </pattern>
                {/* Danger stripes pattern */}
                <pattern id="dangerStripe" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#f59e0b" strokeWidth="2.5" opacity="0.4" />
                </pattern>
              </defs>

              {/* Sky Background Gradient */}
              <rect x="0" y="0" width={svgWidth} height={groundY} fill="#070a13" />

              {/* Yard Ground Surface & Gravel Layer (15 cm IEEE 80) */}
              <rect x="0" y={groundY} width={svgWidth} height={svgHeight - groundY} fill="#1e293b" />
              <rect x="0" y={groundY} width={svgWidth} height="12" fill="url(#gravelHatch)" />
              <line x1="0" y1={groundY} x2={svgWidth} y2={groundY} stroke="#94a3b8" strokeWidth="2" />
              <text x="15" y={groundY + 25} fill="#64748b" fontSize="9" fontWeight="bold">
                {locale === 'fr' ? 'Plateforme gravillonnée 15 cm (TN: 0.00 m)' : 'Crushed Rock Yard Surface (0.00 m)'}
              </text>

              {/* Safety Ground Clearance Planes (B1 Pedestrian & B2 Vehicle) */}
              {showPedestrianZone && (
                <g>
                  <line
                    x1="20"
                    y1={groundY - b1Px}
                    x2={svgWidth - 20}
                    y2={groundY - b1Px}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />
                  <rect
                    x="20"
                    y={groundY - b1Px}
                    width={svgWidth - 40}
                    height={b1Px}
                    fill="url(#dangerStripe)"
                    opacity="0.3"
                  />
                  <text x="25" y={groundY - b1Px - 4} fill="#f59e0b" fontSize="8.5" fontWeight="bold">
                    B1 Piéton : {(calculationResult.clearancesCorrected.pedestrianSafetyB1Mm / 1000).toFixed(2)} m (CEI 61936-1)
                  </text>
                </g>
              )}

              {showVehicleZone && (
                <g>
                  <line
                    x1="20"
                    y1={groundY - b2Px}
                    x2={svgWidth - 20}
                    y2={groundY - b2Px}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="6,4"
                  />
                  <text x={svgWidth - 210} y={groundY - b2Px - 4} fill="#10b981" fontSize="8.5" fontWeight="bold">
                    B2 Véhicule : {(calculationResult.clearancesCorrected.vehicularSafetyB2Mm / 1000).toFixed(2)} m
                  </text>
                </g>
              )}

              {/* ========================================================================= */}
              {/* APPARATUS RENDER: GANTRY, BUSBARS, DISCONNECTOR, BREAKER, CT, ARRESTER, TRAFO */}
              {/* ========================================================================= */}

              {/* 1. Gantry Lattice Tower Structure */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHoveredApparatus('gantry')}
                onMouseLeave={() => setHoveredApparatus(null)}
              >
                {/* Left Leg */}
                <line x1={gantryX - 18} y1={groundY} x2={gantryX - 6} y2="80" stroke="#64748b" strokeWidth="2.5" />
                {/* Right Leg */}
                <line x1={gantryX + 18} y1={groundY} x2={gantryX + 6} y2="80" stroke="#64748b" strokeWidth="2.5" />
                {/* Bracing X */}
                <line x1={gantryX - 16} y1={groundY - 60} x2={gantryX + 12} y2={groundY - 120} stroke="#475569" strokeWidth="1" />
                <line x1={gantryX + 16} y1={groundY - 60} x2={gantryX - 12} y2={groundY - 120} stroke="#475569" strokeWidth="1" />
                <line x1={gantryX - 12} y1={groundY - 120} x2={gantryX + 9} y2={groundY - 190} stroke="#475569" strokeWidth="1" />
                <line x1={gantryX + 12} y1={groundY - 120} x2={gantryX - 9} y2={groundY - 190} stroke="#475569" strokeWidth="1" />
                {/* Crossarm Header */}
                <rect x={gantryX - 45} y="72" width="160" height="12" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                <text x={gantryX} y="62" fill="#94a3b8" fontSize="8.5" textAnchor="middle">
                  Portique HTB
                </text>
              </g>

              {/* 2. High-Voltage Overhead Busbars with Suspension Insulators */}
              <g>
                {/* Suspension Insulator Strings */}
                <line x1={busbarX} y1="84" x2={busbarX} y2="135" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3,3" />
                <circle cx={busbarX} cy="138" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                {/* Busbar Conductor Section */}
                <line x1={busbarX - 35} y1="138" x2={busbarX + 35} y2="138" stroke="#38bdf8" strokeWidth="3.5" />
                <text x={busbarX} y="156" fill="#38bdf8" fontSize="8" textAnchor="middle" fontWeight="bold">
                  Jeu de Barres
                </text>

                {/* Clearance Cone N from Busbar */}
                {showClearanceCones && (
                  <circle
                    cx={busbarX}
                    cy="138"
                    r={nPx}
                    fill="#0284c7"
                    fillOpacity="0.12"
                    stroke="#0284c7"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                )}
              </g>

              {/* 3. High-Voltage Disconnector with Earth Switch (Sectionneur) */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHoveredApparatus('disconnector')}
                onMouseLeave={() => setHoveredApparatus(null)}
              >
                {/* Steel pedestal */}
                <rect x={disconnectorX - 8} y={groundY - 120} width="16" height="120" fill="#334155" stroke="#64748b" strokeWidth="1" />
                {/* Rotary insulator columns */}
                <rect x={disconnectorX - 16} y={groundY - 175} width="10" height="55" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                <rect x={disconnectorX + 6} y={groundY - 175} width="10" height="55" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                {/* Articulated main blade */}
                <line x1={disconnectorX - 11} y1={groundY - 175} x2={disconnectorX + 11} y2={groundY - 175} stroke="#f8fafc" strokeWidth="2.5" />
                <text x={disconnectorX} y={groundY - 185} fill="#e2e8f0" fontSize="8" textAnchor="middle">
                  Sectionneur
                </text>

                {/* Clearance Cone N from live contact */}
                {showClearanceCones && (
                  <circle
                    cx={disconnectorX}
                    cy={groundY - 175}
                    r={nPx}
                    fill="#38bdf8"
                    fillOpacity="0.10"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                )}
              </g>

              {/* 4. High-Voltage SF6 Circuit Breaker (Disjoncteur) */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHoveredApparatus('breaker')}
                onMouseLeave={() => setHoveredApparatus(null)}
              >
                {/* Breaker cabinet & support frame */}
                <rect x={breakerX - 22} y={groundY - 110} width="44" height="110" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                <rect x={breakerX - 14} y={groundY - 70} width="28" height="35" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1" />
                {/* Interrupter chamber (Arc quenching) */}
                <rect x={breakerX - 8} y={groundY - 195} width="16" height="85" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
                {/* Terminal pads */}
                <circle cx={breakerX - 8} cy={groundY - 192} r="3" fill="#f8fafc" />
                <circle cx={breakerX + 8} cy={groundY - 192} r="3" fill="#f8fafc" />
                <text x={breakerX} y={groundY - 205} fill="#38bdf8" fontSize="8.5" textAnchor="middle" fontWeight="bold">
                  Disjoncteur SF6
                </text>

                {/* Clearance Cone N */}
                {showClearanceCones && (
                  <circle
                    cx={breakerX}
                    cy={groundY - 195}
                    r={nPx}
                    fill="#0ea5e9"
                    fillOpacity="0.12"
                    stroke="#0ea5e9"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                )}
              </g>

              {/* 5. Instrument Transformers (TC / TT) */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHoveredApparatus('ct_pt')}
                onMouseLeave={() => setHoveredApparatus(null)}
              >
                <rect x={ctPtX - 6} y={groundY - 95} width="12" height="95" fill="#334155" stroke="#64748b" strokeWidth="1" />
                <rect x={ctPtX - 10} y={groundY - 165} width="20" height="70" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                <ellipse cx={ctPtX} cy={groundY - 170} rx="14" ry="9" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <text x={ctPtX} y={groundY - 185} fill="#e2e8f0" fontSize="8" textAnchor="middle">
                  TC / TT
                </text>
              </g>

              {/* 6. Metal-Oxide Surge Arrester (Parafoudre ZnO) */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHoveredApparatus('arrester')}
                onMouseLeave={() => setHoveredApparatus(null)}
              >
                <rect x={arresterX - 5} y={groundY - 70} width="10" height="70" fill="#334155" stroke="#64748b" strokeWidth="1" />
                {/* Silicon sheds */}
                <rect x={arresterX - 8} y={groundY - 170} width="16" height="100" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" rx="2" />
                <path d={`M ${arresterX - 12} ${groundY - 150} L ${arresterX + 12} ${groundY - 150} M ${arresterX - 12} ${groundY - 130} L ${arresterX + 12} ${groundY - 130} M ${arresterX - 12} ${groundY - 110} L ${arresterX + 12} ${groundY - 110}`} stroke="#f59e0b" strokeWidth="1.5" />
                {/* Surge Arrester Spark Symbol */}
                <text x={arresterX} y={groundY - 180} fill="#f59e0b" fontSize="8" textAnchor="middle" fontWeight="bold">
                  Parafoudre
                </text>
                <text x={arresterX} y={groundY - 50} fill="#f59e0b" fontSize="7.5" textAnchor="middle">
                  d = {surgeArresterDistanceMeters} m
                </text>
              </g>

              {/* 7. Power Transformer (Transformateur de Puissance) */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setHoveredApparatus('transformer')}
                onMouseLeave={() => setHoveredApparatus(null)}
              >
                {/* Main Tank */}
                <rect x={trafoX - 40} y={groundY - 130} width="70" height="130" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" rx="3" />
                {/* Cooling Radiators */}
                <rect x={trafoX - 50} y={groundY - 115} width="8" height="95" fill="#334155" stroke="#64748b" strokeWidth="1" />
                <rect x={trafoX + 32} y={groundY - 115} width="8" height="95" fill="#334155" stroke="#64748b" strokeWidth="1" />
                {/* Conservator tank */}
                <ellipse cx={trafoX - 15} cy={groundY - 150} rx="22" ry="9" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                {/* High Voltage Bushings */}
                <line x1={trafoX - 5} y1={groundY - 130} x2={trafoX - 15} y2={groundY - 185} stroke="#38bdf8" strokeWidth="4" />
                <circle cx={trafoX - 15} cy={groundY - 185} r="4" fill="#f8fafc" />
                <text x={trafoX - 5} y={groundY - 195} fill="#e2e8f0" fontSize="8" textAnchor="middle" fontWeight="bold">
                  Transfo HTB
                </text>

                {/* Clearance Cone N around Bushing Top */}
                {showClearanceCones && (
                  <circle
                    cx={trafoX - 15}
                    cy={groundY - 185}
                    r={nPx}
                    fill="#38bdf8"
                    fillOpacity="0.10"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                )}
              </g>

              {/* Connecting Conductor spanning between bay apparatus */}
              <path
                d={`M ${busbarX} 138 Q 250 170 ${disconnectorX - 11} ${groundY - 175} M ${disconnectorX + 11} ${groundY - 175} Q 380 180 ${breakerX - 8} ${groundY - 195} M ${breakerX + 8} ${groundY - 195} Q 510 185 ${ctPtX} ${groundY - 170} M ${ctPtX} ${groundY - 170} Q 620 175 ${arresterX} ${groundY - 170} M ${arresterX} ${groundY - 170} Q 710 175 ${trafoX - 15} ${groundY - 185}`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4,2"
              />

              {/* Dimension Callout for Phase-to-Earth N */}
              <g>
                <line x1={busbarX + 15} y1="138" x2={busbarX + 15 + nPx} y2="138" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1={busbarX + 15} y1="132" x2={busbarX + 15} y2="144" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1={busbarX + 15 + nPx} y1="132" x2={busbarX + 15 + nPx} y2="144" stroke="#38bdf8" strokeWidth="1.5" />
                <text x={busbarX + 15 + nPx / 2} y="130" fill="#38bdf8" fontSize="8" textAnchor="middle" fontWeight="bold">
                  N = {calculationResult.clearancesCorrected.phaseToEarthNMm} mm
                </text>
              </g>
            </svg>
          </div>

          {/* Quick Indicator Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Distance Phase-Masse (N) : <strong className="text-white">{calculationResult.clearancesCorrected.phaseToEarthNMm} mm</strong></span>
              {calculationResult.isAltitudeDeratingApplied && (
                <span className="text-[10px] text-amber-400">(+{calculationResult.clearancesCorrected.phaseToEarthNMm - calculationResult.clearancesStandard.phaseToEarthNMm} mm alt.)</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span>Distance Phase-Phase (P) : <strong className="text-white">{calculationResult.clearancesCorrected.phaseToPhasePMm} mm</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${calculationResult.isProtectiveMarginCompliant ? 'bg-emerald-400' : 'bg-rose-500'}`} />
              <span>Marge Parafoudre : <strong className={calculationResult.isProtectiveMarginCompliant ? 'text-emerald-400' : 'text-rose-400'}>{calculationResult.surgeArresterProtectiveMarginPercent}%</strong> (≥ 20%)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Key Outputs & Safety Envelopes (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Main Clearance Badge */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/50 border border-sky-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-sky-400 font-bold">
                {locale === 'fr' ? 'GABARIT SÉCURITÉ PIÉTON B1 (CEI 61936)' : 'PEDESTRIAN SAFETY B1'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-900/60 text-sky-300 border border-sky-700">
                2.25 m + N
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                {(calculationResult.clearancesCorrected.pedestrianSafetyB1Mm / 1000).toFixed(2)}
              </span>
              <span className="text-xl font-bold font-mono text-sky-400">m</span>
              <span className="text-xs text-slate-400 font-mono ml-auto">
                (B2 Véhicule = {(calculationResult.clearancesCorrected.vehicularSafetyB2Mm / 1000).toFixed(2)} m)
              </span>
            </div>

            {/* Altitude Correction Derating Badge */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-amber-400" />
                  {locale === 'fr' ? 'Facteur d’Altitude ka :' : 'Altitude Factor ka:'}
                </span>
                <span className="text-amber-400 font-bold text-sm">
                  &times;{calculationResult.altitudeCorrectionFactorKa}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Altitude du poste : {altitudeMeters} m</span>
                <span>{altitudeMeters > 1000 ? 'Surélévation active' : 'Niveau standard (≤1000m)'}</span>
              </div>
            </div>

            {/* Creepage & Pollution Badge */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  {locale === 'fr' ? 'Ligne de Fuite (CEI 60815) :' : 'Creepage Distance:'}
                </span>
                <span className="text-cyan-400 font-bold text-sm">
                  {calculationResult.minInsulatorCreepageDistanceMm} mm
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Pollution : {pollutionClass.replace('class_', 'Classe ').replace('_', ' ')}</span>
                <span>{calculationResult.specificCreepageMmPerKv} mm/kV</span>
              </div>
            </div>

            {/* Surge Arrester Protective Margin Card */}
            <div className={`p-3 rounded-xl border font-mono text-xs space-y-1.5 ${
              calculationResult.isProtectiveMarginCompliant
                ? 'bg-emerald-950/40 border-emerald-700/80 text-emerald-200'
                : 'bg-rose-950/50 border-rose-700 text-rose-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  {calculationResult.isProtectiveMarginCompliant ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                  Coordination Parafoudre :
                </span>
                <span className="font-bold text-sm">
                  PM = {calculationResult.surgeArresterProtectiveMarginPercent}%
                </span>
              </div>
              <div className="flex justify-between text-[10px] opacity-80">
                <span>Onde réfléchie U_T : {calculationResult.waveReflectionVoltageAtTrafoKvPeak} kV</span>
                <span>Dist. max adm. : {calculationResult.maxAllowableArresterDistanceMeters} m</span>
              </div>
            </div>
          </div>

          {/* Clearances Table Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 font-mono text-xs">
            <h4 className="font-bold text-slate-200 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-sky-400">
                <Ruler className="w-4 h-4" />
                {locale === 'fr' ? 'DISTANCES NORMATIVES (CEI 61936-1)' : 'NORMATIVE CLEARANCES'}
              </span>
              <span className="text-[10px] text-slate-400">Um = {calculationResult.highestVoltageUmKv} kV</span>
            </h4>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400">Phase-Masse (N) :</span>
                <span className="text-sky-300 font-bold">{calculationResult.clearancesCorrected.phaseToEarthNMm} mm</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400">Phase-Phase (P) :</span>
                <span className="text-sky-300 font-bold">{calculationResult.clearancesCorrected.phaseToPhasePMm} mm</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400">Clôture Enceinte (C) :</span>
                <span className="text-amber-400 font-bold">{calculationResult.clearancesCorrected.boundaryFenceDistanceCMm} mm</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-400">Mur Plein Sécurité :</span>
                <span className="text-amber-400 font-bold">{calculationResult.clearancesCorrected.solidWallDistanceMm} mm</span>
              </div>
              <div className="flex justify-between items-center bg-sky-950/40 p-2 rounded-lg border border-sky-800/60 text-sky-200 font-bold">
                <span>Hauteur Mini Barres :</span>
                <span>{(calculationResult.clearancesCorrected.minBusbarHeightAboveGroundMm / 1000).toFixed(2)} m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PARAMETRIC CONTROLS (VOLTAGE, ALTITUDE, POLLUTION, ARRESTER) */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm space-y-4">
        <h3 className="text-sm font-bold font-mono text-sky-400 flex items-center gap-2">
          <Sliders className="w-4 h-4" />
          {locale === 'fr'
            ? 'RÉGLAGES PARAMÉTRIQUES DU POSTE HTB & DU SITE'
            : 'AIS SUBSTATION & SITE PARAMETRIC CONTROLS'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Voltage Tier */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block font-bold">Palier de Tension HTB :</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[15, 30, 90, 225].map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => handleVoltageTierChange(tier as SubstationVoltageTier)}
                  className={`p-2 rounded-lg text-center font-bold transition-all ${
                    nominalVoltageKv === tier
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {tier} kV
                </button>
              ))}
            </div>
          </div>

          {/* Altitude Slider */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Altitude du Site (H) :</span>
              <span className="text-sky-400 font-bold">{altitudeMeters} m</span>
            </div>
            <input
              type="range"
              min="0"
              max="2500"
              step="50"
              value={altitudeMeters}
              onChange={(e) => setAltitudeMeters(Number(e.target.value))}
              className="w-full accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Littoral (0 m)</span>
              <span>Yaoundé (750 m)</span>
              <span>Ouest (1500 m)</span>
            </div>
          </div>

          {/* Pollution Class */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block font-bold">Classe de Pollution (CEI 60815) :</span>
            <select
              value={pollutionClass}
              onChange={(e) => setPollutionClass(e.target.value as PollutionClass)}
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
            >
              <option value="class_a_very_light">Classe a - Très légère (22.0 mm/kV)</option>
              <option value="class_b_light">Classe b - Légère (27.8 mm/kV)</option>
              <option value="class_c_medium">Classe c - Moyenne (34.7 mm/kV)</option>
              <option value="class_d_heavy">Classe d - Forte (Douala/Côtier, 43.3 mm/kV)</option>
              <option value="class_e_very_heavy">Classe e - Très forte (Kribi, 53.7 mm/kV)</option>
            </select>
          </div>

          {/* Arrester Separation Distance */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Distance Parafoudre (d) :</span>
              <span className="text-amber-400 font-bold">{surgeArresterDistanceMeters} m</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="25.0"
              step="0.5"
              value={surgeArresterDistanceMeters}
              onChange={(e) => setSurgeArresterDistanceMeters(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Proche (2 m)</span>
              <span>Standard (8 m)</span>
              <span>Éloigné (25 m)</span>
            </div>
          </div>
        </div>

        {/* Engine Advisory Notes */}
        {calculationResult.advisoryNotes.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold font-mono text-sky-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{locale === 'fr' ? 'Recommandations & Directives d’Ingénierie :' : 'Engineering Guidelines & Directives:'}</span>
            </div>
            <ul className="space-y-1 text-xs font-mono text-slate-300">
              {calculationResult.advisoryNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">•</span>
                  <span>{note[locale]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MATHEMATICAL FORMULATION MODAL */}
      {/* ========================================================================= */}
      {isFormulasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-sky-500/40 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  {locale === 'fr'
                    ? 'Formulations Mathématiques des Normes CEI 61936-1 & CEI 60071'
                    : 'IEC 61936-1 & IEC 60071 Mathematical Formulations'}
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
                <div className="font-bold text-sky-400">1. Facteur de Correction d'Altitude ka (CEI 60071-1 Art. 4.2) :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-white font-mono">
                  ka = e^[ m &middot; (H - 1000) / 8150 ] &nbsp; (pour H &gt; 1000 m, m = 1.0)
                </div>
                <p className="text-[11px] text-slate-400">
                  Prend en compte la chute de pression atmosphérique diminuant la rigidité diélectrique de l'air. Toutes les distances d'isolement dans l'air doivent être multipliées par ka.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-sky-400">2. Gabarit de Sécurité Piéton B1 (CEI 61936-1 Tableau 2) :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-white font-mono">
                  B1 = H_personne + N = 2250 mm + N
                </div>
                <p className="text-[11px] text-slate-400">
                  Garantit qu'un agent d'exploitation circulant au sol à pied avec les bras levés ne peut en aucun cas pénétrer dans la zone diélectrique de garde N.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-sky-400">3. Effet d'Éloignement du Parafoudre & Onde Réfléchie (CEI 60071-2) :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-white font-mono">
                  U_T = U_res + 2 &middot; (S / v) &middot; d
                </div>
                <p className="text-[11px] text-slate-400">
                  Pour une onde raide de foudre (S = 1200 kV/&mu;s, v = 300 m/&mu;s), la réflexion totale en extrémité de ligne élève la surtension vue par le transformateur de 8 kV par mètre de séparation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-sky-400">4. Marge de Protection de l'Isolement (CEI 60071-2) :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-white font-mono">
                  PM = [ (BIL / U_T) - 1 ] &times; 100% &ge; 20.0%
                </div>
                <p className="text-[11px] text-slate-400">
                  La norme CEI impose une marge minimale de 20% pour absorber le vieillissement de l'isolant huile/papier et les tolérances de fabrication.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold"
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

