// src/components/ecosystem/EcosystemRealisticScene.tsx
import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  EcosystemEquipmentDetail,
  EcosystemViewMode,
  EnergySourceType,
  ECOSYSTEM_EQUIPMENTS
} from './ecosystemData';

interface EcosystemRealisticSceneProps {
  viewMode: EcosystemViewMode;
  activeEnergySource: EnergySourceType;
  selectedEquipment: EcosystemEquipmentDetail | null;
  onSelectEquipment: (eq: EcosystemEquipmentDetail) => void;
  isPlayingJourney: boolean;
  currentStageId: number;
  locale: 'fr' | 'en';
}

interface EquipmentPin {
  id: string;
  badgeNumber: number;
  title: { en: string; fr: string };
  subtitle: { en: string; fr: string };
  leftPct: number;
  topPct: number;
  poleDirection: 'down' | 'up';
  poleHeight: number;
  dotColor: string;
}

// 8 Interactive Pins precisely positioned on each physical apparatus in the reference picture
const EQUIPMENT_PINS: EquipmentPin[] = [
  {
    id: 'eq-hydro-dam-01',
    badgeNumber: 1,
    title: { en: 'Hydroelectric Power Plant', fr: 'Centrale Hydroélectrique' },
    subtitle: { en: 'Water energy → Mechanical → Electrical', fr: 'Énergie hydraulique → Mécanique → Électrique' },
    leftPct: 21.5,
    topPct: 15.5,
    poleDirection: 'down',
    poleHeight: 48,
    dotColor: '#00E5FF'
  },
  {
    id: 'eq-multi-sources-02',
    badgeNumber: 1,
    title: { en: 'Multiple Generation Sources', fr: 'Sources Multiples de Production' },
    subtitle: { en: 'Hydro, Wind, Solar, Thermal, Biomass', fr: 'Hydro, Éolien, Solaire, Thermique, Biomasse' },
    leftPct: 19.2,
    topPct: 51.0,
    poleDirection: 'down',
    poleHeight: 36,
    dotColor: '#00E5FF'
  },
  {
    id: 'eq-transmission-line-03',
    badgeNumber: 3,
    title: { en: 'High Voltage Transmission', fr: 'Ligne Transport Haute Tension' },
    subtitle: { en: 'Long distance power transfer', fr: 'Transport grande distance à très faibles pertes' },
    leftPct: 42.5,
    topPct: 17.2,
    poleDirection: 'down',
    poleHeight: 44,
    dotColor: '#D7A64A'
  },
  {
    id: 'eq-transmission-substation-04',
    badgeNumber: 4,
    title: { en: 'Transmission Substation', fr: 'Poste Source de Transport' },
    subtitle: { en: 'HV → MV (step-down)', fr: 'THT → HTA (abaissement 225/30 kV)' },
    leftPct: 57.2,
    topPct: 18.2,
    poleDirection: 'down',
    poleHeight: 42,
    dotColor: '#00E5FF'
  },
  {
    id: 'eq-power-transformer-05',
    badgeNumber: 5,
    title: { en: 'Power Transformer', fr: 'Transformateur de Puissance' },
    subtitle: { en: 'HV → MV / LV', fr: 'THT → HTA / BT (63 MVA ONAF)' },
    leftPct: 50.4,
    topPct: 44.0,
    poleDirection: 'down',
    poleHeight: 52,
    dotColor: '#00E5FF'
  },
  {
    id: 'eq-distribution-network-06',
    badgeNumber: 5,
    title: { en: 'Distribution Network', fr: 'Réseau de Distribution' },
    subtitle: { en: 'MV distribution', fr: 'Distribution HTA 30 kV urbaine/rurale' },
    leftPct: 70.2,
    topPct: 26.0,
    poleDirection: 'down',
    poleHeight: 46,
    dotColor: '#00E5FF'
  },
  {
    id: 'eq-distribution-transformer-07',
    badgeNumber: 6,
    title: { en: 'Distribution Transformer', fr: 'Transformateur de Distribution' },
    subtitle: { en: 'MV → LV', fr: 'HTA → BT (30 kV vers 400 V / 230 V)' },
    leftPct: 83.2,
    topPct: 32.5,
    poleDirection: 'down',
    poleHeight: 42,
    dotColor: '#00E5FF'
  },
  {
    id: 'eq-building-installation-08',
    badgeNumber: 7,
    title: { en: 'Buildings & Industry', fr: 'Bâtiments & Industrie' },
    subtitle: { en: 'LV distribution', fr: 'Distribution basse tension & TGBT' },
    leftPct: 92.0,
    topPct: 41.2,
    poleDirection: 'down',
    poleHeight: 46,
    dotColor: '#00E5FF'
  },
  {
    id: 'eq-final-load-09',
    badgeNumber: 8,
    title: { en: 'Final Load', fr: 'Charge Finale Utile' },
    subtitle: { en: 'Homes, businesses, industry', fr: 'Habitations, commerces, moteurs industriels' },
    leftPct: 93.5,
    topPct: 63.0,
    poleDirection: 'down',
    poleHeight: 40,
    dotColor: '#00E5FF'
  }
];

export const EcosystemRealisticScene: React.FC<EcosystemRealisticSceneProps> = ({
  viewMode,
  activeEnergySource,
  selectedEquipment,
  onSelectEquipment,
  isPlayingJourney,
  currentStageId,
  locale,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startDragRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Camera smooth translation per stage during automated journey
  useEffect(() => {
    if (isPlayingJourney || currentStageId) {
      const stageViews: Record<number, { x: number; y: number; zoom: number }> = {
        1: { x: 220, y: 10, zoom: 1.18 },  // Dam, wind, solar
        2: { x: 60, y: -15, zoom: 1.22 },  // HV Transmission line
        3: { x: -60, y: 25, zoom: 1.3 },   // Substation & Transformer
        4: { x: -180, y: 5, zoom: 1.25 },  // Distribution network
        5: { x: -230, y: 0, zoom: 1.32 },  // Distribution transformer
        6: { x: -290, y: -30, zoom: 1.38 },// Buildings & Industry
        7: { x: -330, y: -70, zoom: 1.42 },// Final Load (motors, homes)
      };

      const target = stageViews[currentStageId];
      if (target) {
        setPan({ x: target.x, y: target.y });
        setZoom(target.zoom);
      }
    }
  }, [currentStageId, isPlayingJourney]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startDragRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - startDragRef.current.x,
      y: e.clientY - startDragRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((z) => Math.min(2.5, Math.max(0.85, z + delta)));
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="relative w-full h-full min-h-[580px] lg:min-h-[660px] overflow-hidden bg-[#070B11] cursor-grab active:cursor-grabbing select-none"
    >
      {/* Scalable & Pannable Viewport */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
      >
        <div className="relative w-full h-full min-w-[1280px] min-h-[640px] max-w-[1920px] max-h-[1080px] aspect-video">
          
          {/* Pure 3D / Vector Interactive Digital Twin Landscape — No background image */}
          <svg
            viewBox="0 0 1920 1080"
            className="w-full h-full pointer-events-none relative z-10"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Sky Gradient */}
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3A5975" />
                <stop offset="35%" stopColor="#5E839E" />
                <stop offset="65%" stopColor="#96B4C8" />
                <stop offset="100%" stopColor="#C4D7E2" />
              </linearGradient>

              {/* Distant Sea & Lake Water */}
              <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E4D68" />
                <stop offset="45%" stopColor="#15647F" />
                <stop offset="80%" stopColor="#1C829E" />
                <stop offset="100%" stopColor="#1B556A" />
              </linearGradient>

              {/* Turquoise River & Reservoir Gradient */}
              <linearGradient id="riverWater" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#104E64" />
                <stop offset="30%" stopColor="#167994" />
                <stop offset="60%" stopColor="#229EB6" />
                <stop offset="100%" stopColor="#125E77" />
              </linearGradient>

              {/* Rushing Spillway Water Foam */}
              <linearGradient id="spillwayFoam" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E2F4FA" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#9BD5E8" stopOpacity="0.4" />
              </linearGradient>

              {/* Mountain Forest Greens */}
              <linearGradient id="forestSlope" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1C3224" />
                <stop offset="50%" stopColor="#284832" />
                <stop offset="100%" stopColor="#3C6442" />
              </linearGradient>

              <linearGradient id="distantMtn" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4A657A" />
                <stop offset="100%" stopColor="#2D4352" />
              </linearGradient>

              {/* Concrete Dam Texture */}
              <linearGradient id="damConcrete" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#555E68" />
                <stop offset="35%" stopColor="#8A95A0" />
                <stop offset="65%" stopColor="#737D87" />
                <stop offset="100%" stopColor="#48515B" />
              </linearGradient>

              {/* Solar PV Blue Reflection */}
              <linearGradient id="solarGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#15335E" />
                <stop offset="50%" stopColor="#1C4B8C" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>

              {/* Substation Ground Gravel */}
              <linearGradient id="substationGround" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2A313A" />
                <stop offset="100%" stopColor="#1D2228" />
              </linearGradient>

              {/* Golden Conductor Glow Filter */}
              <filter id="catenaryGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. SKY & DISTANT HORIZON */}
            <rect x="0" y="0" width="1920" height="420" fill="url(#skyGrad)" />

            {/* Distant Clouds & Atmosphere */}
            <ellipse cx="650" cy="180" rx="420" ry="70" fill="#FFFFFF" opacity="0.18" />
            <ellipse cx="1400" cy="140" rx="550" ry="85" fill="#FFFFFF" opacity="0.22" />

            {/* Distant Sea & Far Shoreline (Right Background) */}
            <path
              d="M 1080 230 Q 1400 200 1920 220 L 1920 420 L 1080 420 Z"
              fill="url(#oceanGrad)"
            />
            {/* Distant Mountain Ridges */}
            <polygon points="1200,230 1350,195 1520,232 1700,190 1880,225 1920,230 1920,270 1200,270" fill="url(#distantMtn)" opacity="0.75" />

            {/* Far Coastal City Skyline (Right Horizon) */}
            <g opacity="0.85">
              {Array.from({ length: 22 }).map((_, i) => {
                const x = 1620 + i * 13;
                const h = 25 + Math.sin(i * 1.7) * 22;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={225 - h}
                    width={9}
                    height={h}
                    fill="#3F5368"
                    stroke="#1E2A36"
                    strokeWidth="0.5"
                  />
                );
              })}
            </g>

            {/* 2. MAJESTIC MOUNTAIN RANGE (Left & Center Background) */}
            {/* Mountain Layer 1 (Furthest) */}
            <polygon
              points="0,290 140,190 320,130 510,185 710,210 880,265 980,310 0,310"
              fill="#263A48"
            />
            {/* Mountain Layer 2 (Lush green slopes) */}
            <polygon
              points="0,320 210,185 410,165 590,240 760,285 910,340 0,340"
              fill="url(#forestSlope)"
            />

            {/* 3. TURQUOISE RESERVOIR LAKE (Behind Hydro Dam) */}
            <path
              d="M 0 310 Q 280 290 620 310 Q 720 330 780 380 L 0 380 Z"
              fill="url(#riverWater)"
            />

            {/* 4. HYDROELECTRIC DAM (Left-Upper Composition) */}
            <g id="damGroup">
              {/* Massive Concrete Gravity Dam Crest */}
              <polygon
                points="240,240 540,245 520,380 230,370"
                fill="url(#damConcrete)"
                stroke="#1B222A"
                strokeWidth="2"
              />
              {/* Crest roadway & parapet railing */}
              <line x1="240" y1="240" x2="540" y2="245" stroke="#E2E8F0" strokeWidth="4" />
              <line x1="240" y1="243" x2="540" y2="248" stroke="#334155" strokeWidth="2" />

              {/* Spillway Chutes & Radial Gates */}
              <polygon points="350,248 450,250 470,360 340,360" fill="#3D454F" />
              {/* Spillway Pier Dividers */}
              <rect x="375" y="246" width="6" height="90" fill="#64748B" />
              <rect x="405" y="247" width="6" height="90" fill="#64748B" />
              <rect x="430" y="247" width="6" height="90" fill="#64748B" />

              {/* Rushing Waterfall Discharge & Frothing Spray */}
              <polygon points="360,270 445,272 490,440 330,440" fill="url(#spillwayFoam)" opacity="0.92" />
              {/* Discharge splash plumes */}
              <ellipse cx="410" cy="445" rx="90" ry="25" fill="#FFFFFF" opacity="0.8" />
              <ellipse cx="380" cy="450" rx="70" ry="18" fill="#E0F2FE" opacity="0.75" />

              {/* High-Pressure Penstocks (Steel Pipes to Powerhouse) */}
              <rect x="270" y="280" width="16" height="110" transform="rotate(-25 270 280)" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
              <rect x="295" y="285" width="16" height="110" transform="rotate(-25 295 285)" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
              <rect x="320" y="290" width="16" height="110" transform="rotate(-25 320 290)" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />

              {/* Hydroelectric Powerhouse (Turbine & Generator Building) */}
              <polygon points="260,395 365,395 365,455 260,455" fill="#475569" stroke="#1E293B" strokeWidth="2" />
              <rect x="275" y="405" width="20" height="15" fill="#0284C7" opacity="0.8" />
              <rect x="305" y="405" width="20" height="15" fill="#0284C7" opacity="0.8" />
              <rect x="335" y="405" width="20" height="15" fill="#0284C7" opacity="0.8" />
            </g>

            {/* 5. TURQUOISE RIVER MEANDERING THROUGH CENTER CORRIDOR */}
            <path
              d="M 330 440 Q 640 430 750 510 T 1150 560 T 1320 720 T 1400 850 L 800 850 Q 820 680 620 590 T 260 480 Z"
              fill="url(#riverWater)"
            />

            {/* 6. GREEN VALLEY & RENEWABLES SECTOR (Lower Left) */}
            {/* Green terrain base */}
            <polygon
              points="0,380 320,440 260,560 520,620 740,680 720,850 0,850"
              fill="#24442E"
            />

            {/* Solar Photovoltaic Array (Rows of Tilted Blue Panels) */}
            <g id="solarArray">
              {Array.from({ length: 6 }).map((_, r) => {
                const y = 470 + r * 14;
                return (
                  <g key={r}>
                    <polygon
                      points={`255,${y} 440,${y - 12} 435,${y + 10} 250,${y + 22}`}
                      fill="url(#solarGlass)"
                      stroke="#1E3A8A"
                      strokeWidth="1"
                    />
                    {/* Grid partition lines */}
                    <line x1="290" y1={y + 3} x2="285" y2={y + 19} stroke="#60A5FA" strokeWidth="0.8" opacity="0.6" />
                    <line x1="330" y1={y} x2="325" y2={y + 16} stroke="#60A5FA" strokeWidth="0.8" opacity="0.6" />
                    <line x1="370" y1={y - 3} x2="365" y2={y + 13} stroke="#60A5FA" strokeWidth="0.8" opacity="0.6" />
                    <line x1="410" y1={y - 6} x2="405" y2={y + 10} stroke="#60A5FA" strokeWidth="0.8" opacity="0.6" />
                  </g>
                );
              })}
            </g>

            {/* Wind Turbines on the Green Ridge */}
            {[
              { x: 340, y: 390, h: 50 },
              { x: 400, y: 405, h: 56 },
              { x: 480, y: 420, h: 62 },
              { x: 550, y: 435, h: 58 },
            ].map((wt, idx) => (
              <g key={idx}>
                {/* Tower Mast */}
                <line x1={wt.x} y1={wt.y} x2={wt.x} y2={wt.y - wt.h} stroke="#F8FAFC" strokeWidth="3" />
                {/* Nacelle */}
                <ellipse cx={wt.x} cy={wt.y - wt.h} rx="4" ry="2.5" fill="#E2E8F0" />
                {/* 3 Rotor Blades */}
                <line x1={wt.x} y1={wt.y - wt.h} x2={wt.x} y2={wt.y - wt.h - 32} stroke="#FFFFFF" strokeWidth="1.8" />
                <line x1={wt.x} y1={wt.y - wt.h} x2={wt.x - 26} y2={wt.y - wt.h + 16} stroke="#FFFFFF" strokeWidth="1.8" />
                <line x1={wt.x} y1={wt.y - wt.h} x2={wt.x + 26} y2={wt.y - wt.h + 16} stroke="#FFFFFF" strokeWidth="1.8" />
              </g>
            ))}

            {/* Thermal / Biomass Facility with Stacks */}
            <g id="thermalPlant">
              <rect x="540" y="500" width="85" height="55" fill="#475569" stroke="#1E293B" strokeWidth="2" />
              <rect x="560" y="470" width="12" height="30" fill="#94A3B8" />
              <rect x="590" y="460" width="14" height="40" fill="#94A3B8" />
              {/* Gentle White Steam Plumes */}
              <ellipse cx="566" cy="460" rx="14" ry="8" fill="#FFFFFF" opacity="0.6" />
              <ellipse cx="597" cy="450" rx="18" ry="10" fill="#FFFFFF" opacity="0.65" />
            </g>

            {/* 7. TRANSMISSION SUBSTATION (Center-Right Peninsula) */}
            <g id="substationYard">
              {/* Peninsula Ground Platform */}
              <polygon
                points="840,560 1140,570 1200,680 940,690 840,630"
                fill="url(#substationGround)"
                stroke="#64748B"
                strokeWidth="2"
              />

              {/* Substation Control Building */}
              <polygon points="720,590 790,595 785,640 715,635" fill="#64748B" stroke="#1E293B" strokeWidth="1.5" />

              {/* Step-down Power Transformers with Cooling Radiator Fins */}
              <rect x="880" y="600" width="55" height="40" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
              {/* Radiator cooling fins */}
              {Array.from({ length: 8 }).map((_, f) => (
                <line key={f} x1={885 + f * 6} y1={600} x2={885 + f * 6} y2={640} stroke="#94A3B8" strokeWidth="1.5" />
              ))}
              {/* Conservator Oil Drum */}
              <rect x="895" y="592" width="25" height="8" rx="3" fill="#64748B" />

              {/* SF6 Circuit Breakers & Switchyard Gantries */}
              {Array.from({ length: 5 }).map((_, b) => (
                <g key={b} transform={`translate(${960 + b * 40}, 605)`}>
                  <rect x="0" y="0" width="8" height="24" fill="#475569" />
                  <ellipse cx="4" cy="0" rx="6" ry="3" fill="#94A3B8" />
                  <ellipse cx="4" cy="24" rx="6" ry="3" fill="#94A3B8" />
                </g>
              ))}

              {/* Substation Security Perimeter Fence */}
              <polygon
                points="830,555 1150,565 1210,685 930,695"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="1"
                strokeDasharray="4 2"
                opacity="0.6"
              />
            </g>

            {/* 8. HIGH-VOLTAGE STEEL LATTICE TRANSMISSION PYLONS */}
            {[
              { x: 530, y: 340, s: 0.65 },
              { x: 740, y: 350, s: 0.75 },
              { x: 910, y: 390, s: 0.85 },
              { x: 1140, y: 440, s: 0.95 },
              { x: 1330, y: 530, s: 1.05 },
            ].map((pylon, idx) => (
              <g key={idx} transform={`translate(${pylon.x}, ${pylon.y}) scale(${pylon.s})`}>
                {/* 4 Leg Lattice Steel Base */}
                <line x1="-14" y1="120" x2="-4" y2="0" stroke="#94A3B8" strokeWidth="2.5" />
                <line x1="14" y1="120" x2="4" y2="0" stroke="#94A3B8" strokeWidth="2.5" />
                {/* Internal Cross Bracing (X braces) */}
                <line x1="-12" y1="95" x2="10" y2="65" stroke="#94A3B8" strokeWidth="1.2" />
                <line x1="12" y1="95" x2="-10" y2="65" stroke="#94A3B8" strokeWidth="1.2" />
                <line x1="-8" y1="65" x2="6" y2="35" stroke="#94A3B8" strokeWidth="1.2" />
                <line x1="8" y1="65" x2="-6" y2="35" stroke="#94A3B8" strokeWidth="1.2" />
                {/* Horizontal Crossarms */}
                <line x1="-36" y1="28" x2="36" y2="28" stroke="#CBD5E1" strokeWidth="3" />
                <line x1="-28" y1="48" x2="28" y2="48" stroke="#CBD5E1" strokeWidth="2.5" />
                {/* Insulator Strings hanging down */}
                <line x1="-34" y1="28" x2="-34" y2="42" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="2 1" />
                <line x1="34" y1="28" x2="34" y2="42" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="2 1" />
                {/* Peak Earthwire / OPGW Mast */}
                <line x1="0" y1="0" x2="0" y2="-16" stroke="#94A3B8" strokeWidth="2" />
              </g>
            ))}

            {/* 9. HIGH-VOLTAGE CONDUCTOR CATENARY CURVES (Animated in electrical mode) */}
            <g id="catenaryLines" filter="url(#catenaryGlow)">
              {/* Upper Phase Conductor */}
              <path
                d="M 430,340 Q 630,320 740,360 Q 820,380 910,400 Q 1020,410 1140,460 Q 1240,480 1330,550 Q 1480,590 1620,680"
                fill="none"
                stroke={viewMode === 'electrical' ? '#00E5FF' : '#D7A64A'}
                strokeWidth={viewMode === 'electrical' ? '3.5' : '2.5'}
                className={viewMode === 'electrical' ? 'animate-pulse' : ''}
                opacity={0.9}
              />
              {/* Middle Phase Conductor */}
              <path
                d="M 430,355 Q 630,335 740,375 Q 820,395 910,415 Q 1020,425 1140,475 Q 1240,495 1330,565 Q 1480,605 1620,695"
                fill="none"
                stroke={viewMode === 'electrical' ? '#00E5FF' : '#F59E0B'}
                strokeWidth={viewMode === 'electrical' ? '3.5' : '2'}
                opacity={0.85}
              />
              {/* Distribution Feeders from Substation to City */}
              <path
                d="M 910,630 Q 1050,620 1200,640 Q 1350,620 1520,660 T 1720,730"
                fill="none"
                stroke="#D7A64A"
                strokeWidth="2.5"
                strokeDasharray="6 3"
                opacity={0.9}
              />
            </g>

            {/* 10. MEDIUM-VOLTAGE DISTRIBUTION & INDUSTRIAL CITY (Right Sector) */}
            {/* Rolling Hills & Urban Topography */}
            <polygon
              points="1020,450 1450,420 1920,440 1920,850 1150,850 1020,720"
              fill="#2D4A35"
            />
            {/* Coastal Urban Peninsula */}
            <polygon
              points="1380,540 1920,530 1920,850 1320,850"
              fill="#374151"
            />

            {/* Medium Voltage Distribution Poles */}
            {[
              { x: 1320, y: 580 },
              { x: 1420, y: 600 },
              { x: 1540, y: 620 },
              { x: 1650, y: 660 },
            ].map((pole, idx) => (
              <g key={idx}>
                <line x1={pole.x} y1={pole.y} x2={pole.x} y2={pole.y - 40} stroke="#78350F" strokeWidth="2.5" />
                <line x1={pole.x - 12} y1={pole.y - 34} x2={pole.x + 12} y2={pole.y - 34} stroke="#475569" strokeWidth="2" />
                <circle cx={pole.x - 10} cy={pole.y - 34} r="2" fill="#E2E8F0" />
                <circle cx={pole.x + 10} cy={pole.y - 34} r="2" fill="#E2E8F0" />
              </g>
            ))}

            {/* Kiosk Distribution Transformer (Poste HTA/BT) */}
            <g id="kioskSubstation">
              <rect x="1480" y="640" width="34" height="24" rx="3" fill="#64748B" stroke="#1E293B" strokeWidth="1.5" />
              <rect x="1488" y="646" width="8" height="12" fill="#334155" />
              <circle cx="1506" cy="650" r="2.5" fill="#EF4444" />
            </g>

            {/* Industrial Factory Buildings & Warehouses */}
            <polygon points="1520,680 1620,660 1680,690 1560,720" fill="#4B5563" stroke="#1F2937" strokeWidth="1.5" />
            <polygon points="1600,610 1720,595 1780,630 1660,650" fill="#6B7280" stroke="#1F2937" strokeWidth="1.5" />
            {/* Sawtooth Factory Roof Sheds */}
            <polygon points="1525,675 1550,665 1550,675 1575,665 1575,675 1600,665 1600,680" fill="#9CA3AF" />

            {/* City Residential Buildings & Commercial Hub */}
            {Array.from({ length: 30 }).map((_, i) => {
              const x = 1680 + (i % 6) * 36;
              const y = 620 + Math.floor(i / 6) * 38;
              const h = 20 + (i % 5) * 8;
              return (
                <rect
                  key={i}
                  x={x}
                  y={y - h}
                  width={26}
                  height={h}
                  fill="#94A3B8"
                  stroke="#334155"
                  strokeWidth="1"
                />
              );
            })}
          </svg>

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B11] via-transparent to-[#070B11]/70 pointer-events-none" />

          {/* =========================================================================
              INTERACTIVE BADGES & GUIDE PINS — EXACTLY ALIGNED TO REFERENCE IMAGE
              ========================================================================= */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {EQUIPMENT_PINS.map((pin) => {
              const eq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === pin.id);
              if (!eq) return null;
              const isSelected = selectedEquipment?.id === pin.id;

              return (
                <div
                  key={pin.id}
                  style={{ left: `${pin.leftPct}%`, top: `${pin.topPct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-transform hover:scale-105 duration-150"
                >
                  {/* Badge Button */}
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

                    {/* Text Labels */}
                    <div className="text-left font-mono leading-tight pr-1.5">
                      <div className="text-xs font-bold tracking-tight whitespace-nowrap text-white group-hover:text-cyan-300 transition-colors">
                        {pin.title[locale]}
                      </div>
                      <div
                        className={`text-[10px] truncate max-w-[200px] ${
                          isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        {pin.subtitle[locale]}
                      </div>
                    </div>
                  </button>

                  {/* Vertical Guide Pin Needle into the Landscape Apparatus */}
                  <div className="flex flex-col items-center">
                    <div
                      style={{ height: `${pin.poleHeight}px` }}
                      className={`w-[2px] transition-colors ${
                        isSelected ? 'bg-amber-400 shadow-md shadow-amber-400' : 'bg-cyan-400/80'
                      }`}
                    />
                    <div
                      className={`w-2.5 h-2.5 rounded-full ring-2 ${
                        isSelected ? 'bg-amber-400 ring-white' : 'bg-cyan-400 ring-cyan-500/40'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active View Mode Notification Pill */}
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

      {/* Viewport Zoom & Reset Controls Dock */}
      <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2 bg-[#090E16]/85 border border-slate-800 rounded-xl p-1.5 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs cursor-pointer"
          title="Zoom In"
        >
          +
        </button>
        <span className="text-[10px] font-mono text-slate-400 px-1">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.85, z - 0.2))}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono text-xs cursor-pointer"
          title="Zoom Out"
        >
          -
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
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
