// src/components/ecosystem/EcosystemImagePanoramicCanvas.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  EcosystemEquipmentDetail,
  EcosystemViewMode,
  EnergySourceType,
  ECOSYSTEM_EQUIPMENTS
} from './ecosystemData';

interface EcosystemImagePanoramicCanvasProps {
  viewMode: EcosystemViewMode;
  activeEnergySource: EnergySourceType;
  selectedEquipment: EcosystemEquipmentDetail | null;
  onSelectEquipment: (eq: EcosystemEquipmentDetail) => void;
  isPlayingJourney: boolean;
  currentStageId: number;
  locale: 'fr' | 'en';
}

// 8 Interactive Pins accurately placed according to the EPEDE master reference graphic
interface PinAnchor {
  id: string;
  badgeNumber: number;
  label: { en: string; fr: string };
  sub: { en: string; fr: string };
  left: string;
  top: string;
  pinLineDirection: 'down' | 'up' | 'diag';
  pinHeight: number;
  category: 'generation' | 'transmission' | 'substation' | 'distribution' | 'installation' | 'load';
}

const PIN_ANCHORS: PinAnchor[] = [
  {
    id: 'eq-hydro-dam-01',
    badgeNumber: 1,
    label: { en: 'Hydroelectric Power Plant', fr: 'Centrale Hydroélectrique' },
    sub: { en: 'Water energy → Mechanical → Electrical', fr: 'Énergie hydraulique → Mécanique → Électrique' },
    left: '21.5%',
    top: '15.5%',
    pinLineDirection: 'down',
    pinHeight: 36,
    category: 'generation'
  },
  {
    id: 'eq-multi-sources-02',
    badgeNumber: 1,
    label: { en: 'Multiple Generation Sources', fr: 'Sources Multiples de Production' },
    sub: { en: 'Hydro, Wind, Solar, Thermal, Biomass', fr: 'Hydro, Éolien, Solaire, Thermique, Biomasse' },
    left: '19.2%',
    top: '51.0%',
    pinLineDirection: 'down',
    pinHeight: 28,
    category: 'generation'
  },
  {
    id: 'eq-transmission-line-03',
    badgeNumber: 3,
    label: { en: 'High Voltage Transmission', fr: 'Ligne Transport Haute Tension' },
    sub: { en: 'Long distance power transfer', fr: 'Transport grande distance à très faibles pertes' },
    left: '42.5%',
    top: '17.2%',
    pinLineDirection: 'down',
    pinHeight: 32,
    category: 'transmission'
  },
  {
    id: 'eq-transmission-substation-04',
    badgeNumber: 4,
    label: { en: 'Transmission Substation', fr: 'Poste Source de Transport' },
    sub: { en: 'HV → MV (step-down)', fr: 'THT → HTA (abaissement 225/30 kV)' },
    left: '57.2%',
    top: '18.2%',
    pinLineDirection: 'down',
    pinHeight: 32,
    category: 'substation'
  },
  {
    id: 'eq-power-transformer-05',
    badgeNumber: 5,
    label: { en: 'Power Transformer', fr: 'Transformateur de Puissance' },
    sub: { en: 'HV → MV / LV', fr: 'THT → HTA / BT (63 MVA ONAF)' },
    left: '50.4%',
    top: '44.0%',
    pinLineDirection: 'down',
    pinHeight: 38,
    category: 'substation'
  },
  {
    id: 'eq-distribution-network-06',
    badgeNumber: 5,
    label: { en: 'Distribution Network', fr: 'Réseau de Distribution' },
    sub: { en: 'MV distribution', fr: 'Distribution HTA 30 kV urbaine/rurale' },
    left: '70.2%',
    top: '26.0%',
    pinLineDirection: 'down',
    pinHeight: 34,
    category: 'distribution'
  },
  {
    id: 'eq-distribution-transformer-07',
    badgeNumber: 6,
    label: { en: 'Distribution Transformer', fr: 'Transformateur de Distribution' },
    sub: { en: 'MV → LV', fr: 'HTA → BT (30 kV vers 400 V / 230 V)' },
    left: '83.2%',
    top: '32.5%',
    pinLineDirection: 'down',
    pinHeight: 30,
    category: 'distribution'
  },
  {
    id: 'eq-building-installation-08',
    badgeNumber: 7,
    label: { en: 'Buildings & Industry', fr: 'Bâtiments & Industrie' },
    sub: { en: 'LV distribution', fr: 'Distribution basse tension & TGBT' },
    left: '92.0%',
    top: '41.2%',
    pinLineDirection: 'down',
    pinHeight: 34,
    category: 'installation'
  },
  {
    id: 'eq-final-load-09',
    badgeNumber: 8,
    label: { en: 'Final Load', fr: 'Charge Finale Utile' },
    sub: { en: 'Homes, businesses, industry', fr: 'Habitations, commerces, moteurs industriels' },
    left: '93.5%',
    top: '63.0%',
    pinLineDirection: 'down',
    pinHeight: 32,
    category: 'load'
  }
];

export const EcosystemImagePanoramicCanvas: React.FC<EcosystemImagePanoramicCanvasProps> = ({
  viewMode,
  activeEnergySource,
  selectedEquipment,
  onSelectEquipment,
  isPlayingJourney,
  currentStageId,
  locale,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Camera focuses smoothly onto corresponding stage area during journey playback
  useEffect(() => {
    if (isPlayingJourney || currentStageId) {
      const stageFocusMap: Record<number, { x: number; y: number; zoom: number }> = {
        1: { x: 180, y: 0, zoom: 1.15 },    // Focus Generation (dam/wind/solar)
        2: { x: 50, y: -20, zoom: 1.2 },    // Focus Transmission lines
        3: { x: -80, y: 30, zoom: 1.3 },    // Focus Substation & Transformer
        4: { x: -180, y: 0, zoom: 1.25 },   // Focus Distribution Network
        5: { x: -220, y: 0, zoom: 1.3 },    // Focus Kiosk Transformer
        6: { x: -280, y: -40, zoom: 1.35 }, // Focus Buildings & Industry
        7: { x: -320, y: -80, zoom: 1.4 },  // Focus Final Load & Motor
      };

      const focus = stageFocusMap[currentStageId];
      if (focus) {
        setPanOffset({ x: focus.x, y: focus.y });
        setZoomLevel(focus.zoom);
      }
    }
  }, [currentStageId, isPlayingJourney]);

  // Pan interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoomLevel((prev) => Math.min(2.5, Math.max(0.9, prev + zoomDelta)));
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="relative w-full h-full min-h-[560px] lg:min-h-[660px] overflow-hidden bg-[#070B11] cursor-grab active:cursor-grabbing select-none"
    >
      {/* Dynamic Viewport Canvas Container */}
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: isPanning ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
      >
        {/* THE STATIC DIGITAL TWIN LANDSCAPE */}
        <div className="relative w-full h-full min-w-[1280px] min-h-[660px] max-w-[1920px] max-h-[1080px] aspect-video">
          
          {/* Engineering Backdrop (Dam, Reservoirs, Transmission Corridor, Substation, City) */}
          <div className="absolute inset-0 bg-[#070B11] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B11] via-transparent to-[#070B11]/80 pointer-events-none" />

          {/* SVG Animated High Voltage Transmission Catenary Conductor Flow (Generation -> Substation -> City) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
            <defs>
              {/* Electric Pulse Glow Filters */}
              <filter id="electricGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <linearGradient id="powerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#D7A64A" stopOpacity="0.95" />
                <stop offset="80%" stopColor="#FFB300" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Main 225 kV Transmission Corridor Line (From Dam/Powerhouse over pylons to Substation) */}
            <path
              d="M 230,195 Q 320,160 410,210 T 560,230 T 670,360 T 780,240 T 960,320 T 1120,410 T 1210,480"
              fill="none"
              stroke={viewMode === 'electrical' ? '#00E5FF' : 'url(#powerGradient)'}
              strokeWidth={viewMode === 'electrical' ? '3.5' : '2'}
              strokeDasharray={viewMode === 'electrical' ? '8 4' : 'none'}
              className={viewMode === 'electrical' ? 'animate-pulse' : ''}
              opacity={0.85}
              filter="url(#electricGlow)"
            />

            {/* Distribution Medium-Voltage Feeders to Kiosk Substation and Commercial Loads */}
            <path
              d="M 670,360 Q 750,330 890,265 T 1070,310 T 1180,380 T 1210,480"
              fill="none"
              stroke="#D7A64A"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity={0.7}
            />
          </svg>

          {/* Interactive Badges - Exactly Aligned to Graphic Reference Image */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {PIN_ANCHORS.map((pin) => {
              const eq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === pin.id);
              if (!eq) return null;
              const isSelected = selectedEquipment?.id === pin.id;

              return (
                <div
                  key={pin.id}
                  style={{ left: pin.left, top: pin.top }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-transform hover:scale-105 duration-150"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEquipment(eq);
                    }}
                    className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all shadow-2xl cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-300 ring-4 ring-amber-400/40 font-black scale-110 shadow-amber-500/30'
                        : 'bg-[#0B121E]/95 text-slate-100 border-slate-700/90 hover:border-cyan-400 hover:bg-[#111A29]'
                    }`}
                  >
                    {/* Circle Badge Number */}
                    <span
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        isSelected
                          ? 'bg-slate-950 text-amber-400 font-extrabold'
                          : 'bg-cyan-500 text-slate-950'
                      }`}
                    >
                      {pin.badgeNumber}
                    </span>

                    {/* Label & Subtitle Text */}
                    <div className="text-left font-mono leading-tight pr-1.5">
                      <div className="text-xs font-bold tracking-tight whitespace-nowrap text-white group-hover:text-cyan-300 transition-colors">
                        {pin.label[locale]}
                      </div>
                      <div
                        className={`text-[10px] truncate max-w-[200px] ${
                          isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        {pin.sub[locale]}
                      </div>
                    </div>
                  </button>

                  {/* Vertical Guide Pin Pointing into the Physical Apparatus in the Landscape */}
                  <div className="flex flex-col items-center">
                    <div
                      style={{ height: `${pin.pinHeight}px` }}
                      className={`w-[2px] transition-colors ${
                        isSelected ? 'bg-amber-400 shadow-md shadow-amber-400' : 'bg-cyan-400/80'
                      }`}
                    />
                    <div
                      className={`w-2 h-2 rounded-full ring-2 ${
                        isSelected ? 'bg-amber-400 ring-white' : 'bg-cyan-400 ring-cyan-500/40'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Engineering View Modes Overlays */}
          {viewMode === 'electrical' && (
            <div className="absolute top-4 right-4 bg-[#0A101A]/90 border border-cyan-500/40 rounded-xl p-3 text-xs font-mono text-cyan-300 backdrop-blur-md z-30 pointer-events-none">
              <div className="flex items-center gap-2 font-bold mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                ELECTRICAL POWER FLOW ACTIVE
              </div>
              <p className="text-[10px] text-slate-400">
                225 kV Transmission Grid → 30 kV Distribution → 400V Three-Phase Utilization
              </p>
            </div>
          )}

          {viewMode === 'functional' && (
            <div className="absolute top-4 right-4 bg-[#0A101A]/90 border border-amber-500/40 rounded-xl p-3 text-xs font-mono text-amber-300 backdrop-blur-md z-30 pointer-events-none">
              <div className="flex items-center gap-2 font-bold mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                SYSTEM ROLE & FUNCTIONAL MAPPING
              </div>
              <p className="text-[10px] text-slate-400">
                Primary Conversion → Bulk Transit → Transformation → Protection → Useful Work
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Viewport Navigation & Zoom Controls (Bottom-Right within the canvas) */}
      <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2 bg-[#090E16]/85 border border-slate-800 rounded-xl p-1.5 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs cursor-pointer"
          title="Zoom In"
        >
          +
        </button>
        <span className="text-[10px] font-mono text-slate-400 px-1">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(0.9, z - 0.2))}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs cursor-pointer"
          title="Zoom Out"
        >
          -
        </button>
        <button
          type="button"
          onClick={() => {
            setZoomLevel(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 font-mono text-xs cursor-pointer ml-1"
          title="Reset View"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
