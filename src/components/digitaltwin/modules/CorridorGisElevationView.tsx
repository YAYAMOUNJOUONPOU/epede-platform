// src/components/digitaltwin/modules/CorridorGisElevationView.tsx
import React, { useState } from 'react';
import {
  GEOTWIN_SUBSTATIONS,
  CORRIDOR_TOWERS,
  CORRIDOR_SPANS
} from '../data/geotwinData';
import {
  GisSubstation,
  TransmissionTower,
  CorridorSpan
} from '../../../types/geotwin';
import {
  Compass,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Layers,
  TreeDeciduous,
  Waves,
  Zap,
  Info,
  Maximize2,
  Calendar,
  ShieldAlert
} from 'lucide-react';

interface CorridorGisElevationViewProps {
  locale: 'fr' | 'en';
  onInspectSubstation?: (substation: GisSubstation) => void;
  onInspectTower?: (tower: TransmissionTower) => void;
}

export const CorridorGisElevationView: React.FC<CorridorGisElevationViewProps> = ({
  locale,
  onInspectSubstation,
  onInspectTower
}) => {
  const [selectedSpan, setSelectedSpan] = useState<CorridorSpan>(CORRIDOR_SPANS[1]);
  const [selectedTower, setSelectedTower] = useState<TransmissionTower>(CORRIDOR_TOWERS[1]);
  const [selectedSubstation, setSelectedSubstation] = useState<GisSubstation | null>(null);
  const [vegetationFactor, setVegetationFactor] = useState<number>(1.0); // 1.0 = current, 1.5 = +3 years growth
  const [simulatedTemperatureC, setSimulatedTemperatureC] = useState<number>(35);

  // Longitudinal Profile Coordinates & Catenary Sag Math
  // Canvas width: 900, height: 320
  const profileWidth = 900;
  const profileHeight = 300;
  const paddingX = 70;
  const paddingY = 40;

  // Spans range: from 412m to 485m elevation, towers 28m to 68m
  const minElev = 350;
  const maxElev = 520;

  const toY = (elevM: number) => {
    return (
      profileHeight -
      paddingY -
      ((elevM - minElev) / (maxElev - minElev)) * (profileHeight - 2 * paddingY)
    );
  };

  // Towers horizontal mapping across total corridor distance (approx 1650 m)
  const totalLengthM = 1650;
  const towerPositions = [
    { tower: CORRIDOR_TOWERS[0], xDistM: 0 },
    { tower: CORRIDOR_TOWERS[1], xDistM: 320 },
    { tower: CORRIDOR_TOWERS[2], xDistM: 730 },
    { tower: CORRIDOR_TOWERS[3], xDistM: 1270 },
    { tower: CORRIDOR_TOWERS[4], xDistM: 1650 }
  ];

  const toX = (xM: number) => {
    return paddingX + (xM / totalLengthM) * (profileWidth - 2 * paddingX);
  };

  // Calculate catenary sag curve points between two towers
  const calculateCatenaryPoints = (
    fromX: number,
    fromY: number,
    toXPos: number,
    toYPos: number,
    spanM: number,
    groundMidElevM: number
  ) => {
    const points: string[] = [];
    // Approximate sag: base sag + thermal elongation proportional to temperature
    const baseSagM = (spanM * spanM) / (8 * 950);
    const thermalSagAdd = Math.max(0, (simulatedTemperatureC - 20) * 0.08);
    const totalSagM = baseSagM + thermalSagAdd;

    const steps = 24;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const curX = fromX + t * (toXPos - fromX);
      // Parabolic catenary dip
      const linearY = fromY + t * (toYPos - fromY);
      const sagDipM = 4 * totalSagM * t * (1 - t);
      // Convert sag meters to pixels
      const sagPixels = (sagDipM / (maxElev - minElev)) * (profileHeight - 2 * paddingY);
      const curY = linearY + sagPixels;
      points.push(`${curX},${curY}`);
    }
    return { pathString: `M ${points.join(' L ')}`, maxSagM: totalSagM };
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Geospatial Corridor Top Overview Map & Quick Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Interactive 2D GIS Georeferenced Transmission Strip Map */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>CORRIDOR HTB 400/225 kV · TRACÉ GÉORÉFÉRENCÉ</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {locale === 'fr'
                  ? 'Axe Nachtigal (400 kV) → Batschenga → Yaoundé'
                  : 'Nachtigal (400 kV) → Batschenga → Yaoundé Axis'}
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
              WGS84 / UTM 32N
            </span>
          </div>

          {/* Interactive Vector GIS Map Strip */}
          <div className="relative bg-slate-900/90 rounded-xl border border-slate-800/80 p-3 overflow-hidden">
            <svg viewBox="0 0 600 240" className="w-full h-[230px] select-none">
              <defs>
                <linearGradient id="corridorTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#064e3b" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#1e3a8a" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1e293b" stopOpacity="0.4" />
                </linearGradient>

                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Background Topographic Terrain Contour */}
              <rect x="0" y="0" width="600" height="240" fill="url(#corridorTerrain)" rx="8" />

              {/* Sanaga River water body crossing */}
              <path
                d="M 230,0 C 240,80 280,140 270,240 L 320,240 C 330,140 290,80 280,0 Z"
                fill="url(#riverGrad)"
                opacity="0.85"
              />
              <text x="290" y="210" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Fleuve Sanaga
              </text>

              {/* Right-of-Way 50m Clearance Corridor Band */}
              <path
                d="M 50,110 L 160,115 L 250,120 L 370,125 L 530,130"
                stroke="#334155"
                strokeWidth="28"
                strokeLinecap="round"
                fill="none"
                opacity="0.7"
              />
              <path
                d="M 50,110 L 160,115 L 250,120 L 370,125 L 530,130"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeDasharray="5,4"
                fill="none"
              />

              {/* Pylon Nodes on Map */}
              {towerPositions.map((tp, idx) => {
                const mapX = 60 + idx * 115;
                const mapY = 110 + idx * 5;
                const isSelected = selectedTower.towerId === tp.tower.towerId;

                return (
                  <g
                    key={`map-node-${tp.tower.towerId}`}
                    className="cursor-pointer"
                    onClick={() => setSelectedTower(tp.tower)}
                  >
                    <circle
                      cx={mapX}
                      cy={mapY}
                      r={isSelected ? 9 : 6}
                      fill={isSelected ? '#38bdf8' : '#0f172a'}
                      stroke={isSelected ? '#f8fafc' : '#38bdf8'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />
                    <text
                      x={mapX}
                      y={mapY - 12}
                      fill={isSelected ? '#f8fafc' : '#94a3b8'}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      P0{idx + 1}
                    </text>
                    {tp.tower.type === 'river_crossing' && (
                      <text
                        x={mapX}
                        y={mapY + 18}
                        fill="#38bdf8"
                        fontSize="8"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        68m Fleuve
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Substation Terminal Nodes */}
              {/* Nachtigal Substation */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedSubstation(GEOTWIN_SUBSTATIONS[0])}
              >
                <rect
                  x="20"
                  y="92"
                  width="36"
                  height="36"
                  rx="6"
                  fill="#7c3aed"
                  stroke="#a78bfa"
                  strokeWidth="2"
                />
                <text x="38" y="114" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  NCH
                </text>
                <text x="38" y="142" fill="#c4b5fd" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  400 kV
                </text>
              </g>

              {/* Batschenga Substation */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedSubstation(GEOTWIN_SUBSTATIONS[1])}
              >
                <rect
                  x="540"
                  y="112"
                  width="36"
                  height="36"
                  rx="6"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
                <text x="558" y="134" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  BAT
                </text>
                <text x="558" y="162" fill="#7dd3fc" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  225 kV
                </text>
              </g>
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-3 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              Nachtigal 400 kV (Evacuation 420 MW)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              Batschenga 400/225 kV (Poste d\'Interconnexion)
            </span>
          </div>
        </div>

        {/* Right 5 Cols: Selected Tower & Environmental Clearance Telemetry */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Selected Tower Structural Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                  {selectedTower.towerNumber}
                </span>
                <h4 className="text-base font-bold text-white mt-1">
                  {selectedTower.type === 'river_crossing'
                    ? 'Pylône de Grande Traversée (68 m)'
                    : selectedTower.type === 'dead_end_gantry'
                    ? 'Portique d\'Extrémité Poste'
                    : 'Pylône d\'Alignement 400 kV'}
                </h4>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                  selectedTower.status === 'nominal'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {selectedTower.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Hauteur Totale</span>
                <span className="text-white font-bold">{selectedTower.heightM} mètres</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Résistance de Terre (R_p)</span>
                <span
                  className={`font-bold ${
                    selectedTower.footingEarthingResistanceOhm < 5
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {selectedTower.footingEarthingResistanceOhm} Ω (Cible &lt; 10Ω)
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Chaînes d\'Isolateurs</span>
                <span className="text-slate-200 font-bold">
                  {selectedTower.insulatorDiscsCount} coupelles ({selectedTower.insulatorType})
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Fondation Massif</span>
                <span className="text-slate-200 font-bold capitalize">
                  {selectedTower.foundationType.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Micro-actions */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => onInspectTower?.(selectedTower)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all text-center"
              >
                {locale === 'fr' ? 'Dossier Structurel Pylône' : 'Structural Tower File'}
              </button>
            </div>
          </div>

          {/* Dynamic Environmental Controls (Temp & Vegetation Growth) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <TreeDeciduous className="w-4 h-4 text-emerald-400" />
              {locale === 'fr' ? 'Simulation Thermique & Végétation' : 'Thermal Sag & Encroachment'}
            </h4>

            {/* Temperature Slider */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Température Conducteur</span>
                <span className="text-amber-400 font-bold">{simulatedTemperatureC} °C</span>
              </div>
              <input
                type="range"
                min="15"
                max="85"
                value={simulatedTemperatureC}
                onChange={(e) => setSimulatedTemperatureC(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Vegetation Growth Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Croissance Végétale (Sous-Ligne)</span>
                <span className="text-emerald-400 font-bold">
                  {(4.2 * vegetationFactor).toFixed(1)} m (Arbres)
                </span>
              </div>
              <input
                type="range"
                min="0.6"
                max="2.2"
                step="0.1"
                value={vegetationFactor}
                onChange={(e) => setVegetationFactor(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Longitudinal Elevation Profile & Catenary Sag Curve (Grand Profil en Long) */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>PROFIL EN LONG TOPOGRAPHIQUE & PORTÉES CATÉNAIRES (CEI 60826)</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {locale === 'fr'
                ? 'Profil d\'Élévation, Flèche des Conducteurs & Franc-Bord au Sol'
                : 'Elevation Profile, Conductor Catenary Sag & Ground Clearance'}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-0.5 bg-sky-400 inline-block" />
              {locale === 'fr' ? 'Conducteur sous tension' : 'Live Conductor'}
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-0.5 bg-emerald-500 inline-block" />
              {locale === 'fr' ? 'Gabarit franc-bord (9m)' : 'Clearance limit (9m)'}
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-0.5 bg-amber-600 inline-block" />
              {locale === 'fr' ? 'Ligne de terrain naturel' : 'Terrain surface'}
            </span>
          </div>
        </div>

        {/* Vector Longitudinal Profile Chart */}
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${profileWidth} ${profileHeight}`} className="w-full min-w-[800px] h-[300px]">
            <defs>
              {/* Ground Terrain Texture fill */}
              <linearGradient id="groundFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
              </linearGradient>

              {/* Vegetation canopy gradient */}
              <linearGradient id="vegeFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#065f46" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Grid Elevation Lines (Horizontal) */}
            {[350, 400, 450, 500].map((elev) => {
              const y = toY(elev);
              return (
                <g key={`grid-elev-${elev}`} opacity="0.35">
                  <line x1={paddingX} y1={y} x2={profileWidth - paddingX} y2={y} stroke="#475569" strokeDasharray="3,3" />
                  <text x={paddingX - 10} y={y + 4} fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="end">
                    {elev}m
                  </text>
                </g>
              );
            })}

            {/* Continuous Ground Terrain Polygon */}
            {(() => {
              const groundPoints: { x: number; y: number }[] = [
                { x: toX(0), y: toY(412) },
                { x: toX(320), y: toY(430) },
                { x: toX(525), y: toY(395) },
                { x: toX(730), y: toY(370) }, // River bottom
                { x: toX(945), y: toY(395) },
                { x: toX(1270), y: toY(440) },
                { x: toX(1650), y: toY(485) }
              ];

              const pathStr = `M ${groundPoints[0].x},${groundPoints[0].y} ` +
                groundPoints.slice(1).map(p => `L ${p.x},${p.y}`).join(' ') +
                ` L ${profileWidth - paddingX},${profileHeight - paddingY} L ${paddingX},${profileHeight - paddingY} Z`;

              return (
                <g>
                  {/* Terrain body */}
                  <path d={pathStr} fill="url(#groundFillGrad)" stroke="#64748b" strokeWidth="2" />

                  {/* River water body at pylon 3 */}
                  <rect
                    x={toX(680)}
                    y={toY(385)}
                    width={toX(820) - toX(680)}
                    height={toY(350) - toY(385)}
                    fill="#0284c7"
                    opacity="0.6"
                    rx="3"
                  />
                  <text x={toX(750)} y={toY(385) + 16} fill="#7dd3fc" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    Sanaga River
                  </text>
                </g>
              );
            })()}

            {/* Vegetation Canopy Envelope (Simulated Undergrowth) */}
            {(() => {
              const vegHeightM = 4.2 * vegetationFactor;
              const vegPoints: { x: number; y: number }[] = [
                { x: toX(0), y: toY(412 + vegHeightM) },
                { x: toX(320), y: toY(430 + vegHeightM) },
                { x: toX(525), y: toY(395 + vegHeightM) },
                { x: toX(730), y: toY(370) }, // Water, no trees
                { x: toX(945), y: toY(395 + vegHeightM) },
                { x: toX(1270), y: toY(440 + vegHeightM) },
                { x: toX(1650), y: toY(485 + vegHeightM) }
              ];
              const vegPath = `M ${vegPoints[0].x},${vegPoints[0].y} ` +
                vegPoints.slice(1).map(p => `L ${p.x},${p.y}`).join(' ');

              return (
                <path
                  d={vegPath}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4,2"
                  fill="none"
                  opacity="0.75"
                />
              );
            })()}

            {/* Towers Lattice Silhouettes */}
            {towerPositions.map((tp, idx) => {
              const tx = toX(tp.xDistM);
              const groundElev = tp.tower.coordinates.elevationM;
              const basePy = toY(groundElev);
              const topPy = toY(groundElev + tp.tower.heightM);
              const isSelected = selectedTower.towerId === tp.tower.towerId;

              return (
                <g
                  key={`elev-tower-${tp.tower.towerId}`}
                  className="cursor-pointer"
                  onClick={() => setSelectedTower(tp.tower)}
                >
                  {/* Tower Trunk */}
                  <line
                    x1={tx}
                    y1={basePy}
                    x2={tx}
                    y2={topPy}
                    stroke={isSelected ? '#38bdf8' : '#cbd5e1'}
                    strokeWidth={isSelected ? 3.5 : 2}
                  />
                  {/* Crossarms */}
                  <line
                    x1={tx - 18}
                    y1={topPy + 8}
                    x2={tx + 18}
                    y2={topPy + 8}
                    stroke={isSelected ? '#38bdf8' : '#94a3b8'}
                    strokeWidth="2.5"
                  />
                  <line
                    x1={tx - 14}
                    y1={topPy + 16}
                    x2={tx + 14}
                    y2={topPy + 16}
                    stroke={isSelected ? '#38bdf8' : '#94a3b8'}
                    strokeWidth="2"
                  />
                  {/* Peak groundwire mast */}
                  <line x1={tx} y1={topPy} x2={tx} y2={topPy - 6} stroke="#94a3b8" strokeWidth="1.5" />

                  {/* Tower Label */}
                  <text
                    x={tx}
                    y={basePy + 16}
                    fill={isSelected ? '#38bdf8' : '#94a3b8'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    P0{idx + 1}
                  </text>
                  <text
                    x={tx}
                    y={basePy + 28}
                    fill="#64748b"
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {tp.tower.heightM}m
                  </text>
                </g>
              );
            })}

            {/* Catenary Overhead Line Spans */}
            {towerPositions.slice(0, -1).map((tp, idx) => {
              const nextTp = towerPositions[idx + 1];
              const fromX = toX(tp.xDistM);
              const fromY = toY(tp.tower.coordinates.elevationM + tp.tower.heightM - 4);
              const toXPos = toX(nextTp.xDistM);
              const toYPos = toY(nextTp.tower.coordinates.elevationM + nextTp.tower.heightM - 4);
              const spanM = nextTp.xDistM - tp.xDistM;

              const { pathString, maxSagM } = calculateCatenaryPoints(
                fromX,
                fromY,
                toXPos,
                toYPos,
                spanM,
                400
              );

              return (
                <g key={`span-curve-${idx}`}>
                  {/* Catenary Conductor Line */}
                  <path
                    d={pathString}
                    stroke="#38bdf8"
                    strokeWidth="2.8"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Mid-span sag indicator */}
                  <text
                    x={(fromX + toXPos) / 2}
                    y={(fromY + toYPos) / 2 + 18}
                    fill="#7dd3fc"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    Flèche S = {maxSagM.toFixed(1)} m
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Status strip */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              {locale === 'fr'
                ? 'Conformité gabarit au sol CEI 60826 :'
                : 'Ground clearance compliance IEC 60826:'}
            </span>
            <span className="font-bold text-emerald-400">
              Gabarit minimal respecté (Franc-bord &gt; 9.0 m à 400 kV)
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Portée max : 540 m (Traversée Sanaga)</span>
            <span>Tension mécanique : 41.2 kN (Aster 570)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
