// src/components/home/EnergyEcosystemStage.tsx
// Exact implementation of energy-ecosystem.html as the primary interactive hero for EPEDE
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  EcosystemEquipmentDetail,
  EcosystemViewMode,
  EnergySourceType,
  ECOSYSTEM_EQUIPMENTS,
} from '../ecosystem/ecosystemData';
import { EcosystemEquipmentModal } from '../ecosystem/EcosystemEquipmentModal';
import { ExternalLink, Play, Pause, RotateCcw, Compass, Eye, Zap, Layers, Sparkles } from 'lucide-react';

interface EnergyEcosystemStageProps {
  locale: 'fr' | 'en';
  onNavigateView: (view: string) => void;
  onSelectDomain: (code: string) => void;
  onSelectEquipment: (id: string) => void;
  onNavigateJourney?: (stageId?: string) => void;
}

interface CalloutItem {
  id: string;
  badge: number;
  left: number;
  top: number;
  width: number;
  height?: number;
  titleEn: string;
  titleFr: string;
  subEn: string;
  subFr: string;
  equipmentId: string;
  domainCode: string;
}

const CALLOUTS: CalloutItem[] = [
  {
    id: 'co-1',
    badge: 1,
    left: 217,
    top: 136,
    width: 236,
    titleEn: 'Hydroelectric Power Plant',
    titleFr: 'Centrale Hydroélectrique',
    subEn: 'Water energy → Mechanical → Electrical',
    subFr: 'Énergie hydraulique → Mécanique → Électrique',
    equipmentId: 'eq-hydro-dam-01',
    domainCode: 'D01',
  },
  {
    id: 'co-3',
    badge: 3,
    left: 549,
    top: 153,
    width: 204,
    titleEn: 'High Voltage Transmission',
    titleFr: 'Ligne Transport Haute Tension',
    subEn: 'Long distance power transfer',
    subFr: 'Transport grande distance à très faibles pertes',
    equipmentId: 'eq-transmission-line-03',
    domainCode: 'D03',
  },
  {
    id: 'co-4',
    badge: 4,
    left: 789,
    top: 163,
    width: 188,
    height: 43,
    titleEn: 'Transmission Substation',
    titleFr: 'Poste Source de Transport',
    subEn: 'HV → MV (step-down)',
    subFr: 'THT → HTA (abaissement 225/30 kV)',
    equipmentId: 'eq-transmission-substation-04',
    domainCode: 'D04',
  },
  {
    id: 'co-5-dist',
    badge: 5,
    left: 987,
    top: 247,
    width: 172,
    height: 43,
    titleEn: 'Distribution Network',
    titleFr: 'Réseau de Distribution',
    subEn: 'MV distribution',
    subFr: 'Distribution HTA 30 kV urbaine/rurale',
    equipmentId: 'eq-distribution-network-06',
    domainCode: 'D05',
  },
  {
    id: 'co-6',
    badge: 6,
    left: 1174,
    top: 311,
    width: 198,
    height: 43,
    titleEn: 'Distribution Transformer',
    titleFr: 'Transformateur de Distribution',
    subEn: 'MV → LV',
    subFr: 'HTA → BT (30 kV vers 400 V / 230 V)',
    equipmentId: 'eq-distribution-transformer-07',
    domainCode: 'D05',
  },
  {
    id: 'co-7',
    badge: 7,
    left: 1316,
    top: 402,
    width: 186,
    height: 43,
    titleEn: 'Buildings & Industry',
    titleFr: 'Bâtiments & Industrie',
    subEn: 'LV distribution',
    subFr: 'Distribution basse tension & TGBT',
    equipmentId: 'eq-building-installation-08',
    domainCode: 'D06',
  },
  {
    id: 'co-5-trafo',
    badge: 5,
    left: 684,
    top: 430,
    width: 182,
    titleEn: 'Power Transformer',
    titleFr: 'Transformateur de Puissance',
    subEn: 'HV → MV / LV',
    subFr: 'THT → HTA / BT (63 MVA ONAF)',
    equipmentId: 'eq-power-transformer-05',
    domainCode: 'D04',
  },
  {
    id: 'co-1-multi',
    badge: 1,
    left: 194,
    top: 502,
    width: 202,
    titleEn: 'Multiple Generation Sources',
    titleFr: 'Sources Multiples de Production',
    subEn: 'Hydro, Wind, Solar, Thermal, Biomass',
    subFr: 'Hydro, Éolien, Solaire, Thermique, Biomasse',
    equipmentId: 'eq-multi-sources-02',
    domainCode: 'D01',
  },
  {
    id: 'co-8',
    badge: 8,
    left: 1347,
    top: 624,
    width: 186,
    titleEn: 'Final Load',
    titleFr: 'Charge Finale Utile',
    subEn: 'Homes, businesses, industry',
    subFr: 'Habitations, commerces, moteurs industriels',
    equipmentId: 'eq-final-load-09',
    domainCode: 'D06',
  },
];

interface JourneyStageItem {
  id: number;
  labelEn: string;
  labelFr: string;
  left: number;
  calloutId: string;
  viewRoute: string;
}

const JOURNEY_STAGES_UI: JourneyStageItem[] = [
  { id: 1, labelEn: 'Generation', labelFr: 'Production', left: 346, calloutId: 'co-1', viewRoute: 'domain:D01' },
  { id: 2, labelEn: 'Transmission', labelFr: 'Transport', left: 474, calloutId: 'co-3', viewRoute: 'domain:D03' },
  { id: 3, labelEn: 'Substation', labelFr: 'Poste', left: 592, calloutId: 'co-4', viewRoute: 'domain:D04' },
  { id: 4, labelEn: 'Distribution', labelFr: 'Distribution', left: 724, calloutId: 'co-5-dist', viewRoute: 'domain:D05' },
  { id: 5, labelEn: 'Installation', labelFr: 'Installation', left: 851, calloutId: 'co-7', viewRoute: 'domain:D06' },
  { id: 6, labelEn: 'Final Load', labelFr: 'Charge Utile', left: 972, calloutId: 'co-8', viewRoute: 'domain:D06' },
];

export const EnergyEcosystemStage: React.FC<EnergyEcosystemStageProps> = ({
  locale,
  onNavigateView,
  onSelectDomain,
  onSelectEquipment,
  onNavigateJourney,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [selectedEquipment, setSelectedEquipment] = useState<EcosystemEquipmentDetail | null>(null);
  const [activeSource, setActiveSource] = useState<EnergySourceType>('hydro');
  const [viewMode, setViewMode] = useState<EcosystemViewMode>('physical');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [hoveredCallout, setHoveredCallout] = useState<string | null>(null);

  // Dynamic Responsive Scale Fitting 1536x1024 coordinate canvas to container width
  const updateScale = useCallback(() => {
    if (wrapRef.current) {
      const containerWidth = wrapRef.current.clientWidth || window.innerWidth;
      const k = Math.min(1.05, Math.max(0.2, containerWidth / 1536));
      setScale(k);
    }
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  // Automated journey playback
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStageId((prev) => {
          const next = prev >= JOURNEY_STAGES_UI.length ? 1 : prev + 1;
          const stageItem = JOURNEY_STAGES_UI.find((s) => s.id === next);
          if (stageItem) {
            setHoveredCallout(stageItem.calloutId);
          }
          return next;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleOpenEquipmentModal = (equipmentId: string) => {
    const eq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === equipmentId);
    if (eq) {
      setSelectedEquipment(eq);
      onSelectEquipment(eq.id);
    }
  };

  const handleStageClick = (stage: JourneyStageItem) => {
    setActiveStageId(stage.id);
    setHoveredCallout(stage.calloutId);
    if (onNavigateJourney) {
      onNavigateJourney(String(stage.id));
    }
  };

  return (
    <div className="w-full relative select-none">
      {/* Container wrapper maintaining proportional height */}
      <div
        ref={wrapRef}
        id="wrap"
        style={{ 
          height: `${1024 * scale}px`,
          backgroundColor: 'var(--ecosystem-sky-background, #070D14)',
        }}
        className="w-full relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl transition-[height] duration-150"
      >
        {/* 1536x1024 Fixed Coordinate Stage with transform-scale */}
        <div
          id="stage"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
            backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 0',
            backgroundSize: '1536px 1024px',
          }}
          className="absolute left-0 top-0 w-[1536px] h-[1024px] overflow-hidden"
        >
          {/* HEADER BAR (exact styling and layout from energy-ecosystem.html) */}
          <div
            id="hdr"
            className="absolute left-0 top-0 w-[1536px] h-[92px] bg-gradient-to-b from-[#0a121a] to-[#070d14] border-b border-[#1a2a36] z-10"
          >
            {/* Logo Icon */}
            <svg
              className="absolute left-[22px] top-[18px]"
              width="38"
              height="56"
              viewBox="0 0 38 56"
            >
              <polygon points="24,2 4,32 17,32 10,54 34,20 20,20" fill="#e9a93a" />
            </svg>

            {/* Logo Text & Title */}
            <div className="absolute left-[68px] top-[16px] text-[36px] font-bold tracking-[6px] text-white leading-none font-mono">
              EPEDE
            </div>
            <div className="absolute left-[68px] top-[52px] text-[12.5px] leading-[14px] text-[#c9d3db] font-mono">
              Electrical Power Engineering
              <br />
              Digital Environment
            </div>

            {/* Globe Icon */}
            <svg
              className="absolute left-[218px] top-[24px]"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="#e9a93a"
              strokeWidth="1.3"
            >
              <circle cx="10" cy="10" r="8" />
              <ellipse cx="10" cy="10" rx="3.5" ry="8" />
              <path d="M2 10h16" />
            </svg>

            {/* Gold separator */}
            <div className="absolute left-[257px] top-[6px] w-[1px] h-[80px] bg-[#8a6a2c]" />

            {/* Main Title & Subtitle */}
            <div className="absolute left-0 w-[1132px] text-center top-[24px] text-[26px] font-bold tracking-[3px] text-[#f3f6f8] font-mono uppercase">
              {locale === 'fr' ? 'L\'ÉCOSYSTÈME ÉNERGÉTIQUE ÉLECTRIQUE' : 'THE ELECTRICAL ENERGY ECOSYSTEM'}
            </div>
            <div className="absolute left-0 w-[1132px] text-center top-[58px] text-[18px] text-[#dfe6ec] tracking-wide font-sans">
              {locale === 'fr' ? 'De la Source d\'Énergie au Travail Utile' : 'From Energy Source to Useful Work'}
            </div>

            {/* Navigation Actions (Explore, Journey, Equipment, Power Flow, Views) */}
            <button
              type="button"
              onClick={() => onNavigateView('journey')}
              className="absolute left-[901px] top-[26px] w-[80px] text-center text-[13.5px] text-[#dfe6ec] hover:text-[#33b6e8] transition-colors cursor-pointer group"
              title="Explore the complete power chain"
            >
              <svg className="block mx-auto mb-[6px] w-[26px] height-[26px] stroke-[#9fb0bd] group-hover:stroke-[#33b6e8] fill-none stroke-[1.4]" viewBox="0 0 26 26">
                <path d="M13 3l9 5v10l-9 5-9-5V8z" />
                <path d="M4 8l9 5 9-5M13 13v10" />
              </svg>
              <span>{locale === 'fr' ? 'Explorer' : 'Explore'}</span>
            </button>
            <div className="absolute left-[989px] top-[34px] w-[1px] h-[40px] bg-[#3a4a58]" />

            <button
              type="button"
              onClick={() => onNavigateView('journey')}
              className="absolute left-[1004px] top-[26px] w-[80px] text-center text-[13.5px] text-[#dfe6ec] hover:text-[#33b6e8] transition-colors cursor-pointer group"
              title="Continuous electrical energy journey"
            >
              <svg className="block mx-auto mb-[6px] w-[26px] height-[26px] stroke-[#9fb0bd] group-hover:stroke-[#33b6e8] fill-none stroke-[1.4]" viewBox="0 0 26 26">
                <path d="M3 6c5 0 6 14 10 14s5-14 10-14M3 20c5 0 6-14 10-14s5 14 10 14" />
              </svg>
              <span>{locale === 'fr' ? 'Parcours' : 'Journey'}</span>
            </button>
            <div className="absolute left-[1094px] top-[34px] w-[1px] h-[40px] bg-[#3a4a58]" />

            <button
              type="button"
              onClick={() => onNavigateView('equipment-list')}
              className="absolute left-[1104px] top-[26px] w-[80px] text-center text-[13.5px] text-[#dfe6ec] hover:text-[#33b6e8] transition-colors cursor-pointer group"
              title="Electrical equipment registry"
            >
              <svg className="block mx-auto mb-[6px] w-[26px] height-[26px] stroke-[#9fb0bd] group-hover:stroke-[#33b6e8] fill-none stroke-[1.4]" viewBox="0 0 26 26">
                <rect x="4" y="5" width="18" height="16" />
                <path d="M9 5v16M17 5v16M4 12h18" />
              </svg>
              <span>{locale === 'fr' ? 'Matériel' : 'Equipment'}</span>
            </button>
            <div className="absolute left-[1192px] top-[34px] w-[1px] h-[40px] bg-[#3a4a58]" />

            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'electrical' ? 'physical' : 'electrical')}
              className="absolute left-[1195px] top-[26px] w-[80px] text-center text-[13.5px] text-[#dfe6ec] hover:text-[#33b6e8] transition-colors cursor-pointer group"
              title="Toggle electrical power flow vector animation"
            >
              <svg className="block mx-auto mb-[6px] w-[26px] height-[26px] stroke-[#9fb0bd] group-hover:stroke-[#33b6e8] fill-none stroke-[1.4]" viewBox="0 0 26 26">
                <path d="M4 9h16l-4-4M22 17H6l4 4" />
              </svg>
              <span>{locale === 'fr' ? 'Électrique' : 'Power Flow'}</span>
            </button>
            <div className="absolute left-[1273px] top-[34px] w-[1px] h-[40px] bg-[#3a4a58]" />

            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'functional' ? 'physical' : 'functional')}
              className="absolute left-[1274px] top-[26px] w-[50px] text-center text-[13.5px] text-[#dfe6ec] hover:text-[#33b6e8] transition-colors cursor-pointer group"
              title="Toggle view perspectives"
            >
              <svg className="block mx-auto mb-[6px] w-[26px] height-[26px] stroke-[#9fb0bd] group-hover:stroke-[#33b6e8] fill-none stroke-[1.4]" viewBox="0 0 26 26">
                <path d="M10 4v18M16 4v18" strokeWidth="2.4" />
              </svg>
              <span>{locale === 'fr' ? 'Vues' : 'Views'}</span>
            </button>

            {/* Quote on right */}
            <div className="absolute left-[1325px] top-[26px] w-[1px] h-[56px] bg-[#c9922e]" />
            <div className="absolute left-[1338px] top-[30px] w-[184px] text-[11.5px] leading-[15px] italic text-[#d3dbe2] font-serif pr-2">
              {locale === 'fr'
                ? '« Comprendre la chaîne complète de l\'énergie pour bâtir un futur électrique durable. »'
                : '" Understanding the complete energy chain to build a smarter, more sustainable future. "'}
            </div>
          </div>

          {/* LEFT PANEL (Energy Sources & Generation Selector) */}
          <div
            id="lp"
            className="absolute left-[11px] top-[107px] w-[150px] h-[468px] bg-[#0a1620]/95 border border-[#1d3a4c] rounded-[5px] backdrop-blur-md z-10"
          >
            <div className="absolute left-[9px] top-[8px] text-[11px] font-bold text-[#e8eef3] font-mono uppercase tracking-wider">
              {locale === 'fr' ? 'Sources d\'Énergie' : 'Energy Sources'}
            </div>

            {/* Hydro */}
            <button
              type="button"
              onClick={() => {
                setActiveSource('hydro');
                handleOpenEquipmentModal('eq-hydro-dam-01');
              }}
              className={`absolute left-[6px] top-[31px] w-[136px] h-[33px] flex items-center text-[12px] rounded-[4px] cursor-pointer transition-all ${
                activeSource === 'hydro'
                  ? 'border border-[#2a86b5] bg-[#0f2a3c] text-[#5fc0ff] font-bold shadow-md'
                  : 'text-[#dfe6ec] hover:bg-[#0d1d2b]'
              }`}
            >
              <i className="w-[30px] flex justify-center shrink-0">
                <svg viewBox="0 0 22 22" className="w-[20px] h-[20px]">
                  <path d="M11 2C8 8 5 10 5 14a6 6 0 0012 0c0-4-3-6-6-12z" fill="#2a9df0" />
                </svg>
              </i>
              <span>Hydro</span>
            </button>

            {/* Wind */}
            <button
              type="button"
              onClick={() => {
                setActiveSource('wind');
                handleOpenEquipmentModal('eq-multi-sources-02');
              }}
              className={`absolute left-[6px] top-[66px] w-[136px] h-[33px] flex items-center text-[12px] rounded-[4px] cursor-pointer transition-all ${
                activeSource === 'wind'
                  ? 'border border-[#2a86b5] bg-[#0f2a3c] text-[#5fc0ff] font-bold shadow-md'
                  : 'text-[#dfe6ec] hover:bg-[#0d1d2b]'
              }`}
            >
              <i className="w-[30px] flex justify-center shrink-0">
                <svg viewBox="0 0 22 22" stroke="#4bb0e8" fill="none" strokeWidth="1.4" className="w-[20px] h-[20px]">
                  <path d="M11 10v10M11 10L6 3M11 10l6-2M11 10L5 14" />
                </svg>
              </i>
              <span>{locale === 'fr' ? 'Éolien' : 'Wind'}</span>
            </button>

            {/* Solar */}
            <button
              type="button"
              onClick={() => {
                setActiveSource('solar');
                handleOpenEquipmentModal('eq-multi-sources-02');
              }}
              className={`absolute left-[6px] top-[104px] w-[136px] h-[33px] flex items-center text-[12px] rounded-[4px] cursor-pointer transition-all ${
                activeSource === 'solar'
                  ? 'border border-[#2a86b5] bg-[#0f2a3c] text-[#5fc0ff] font-bold shadow-md'
                  : 'text-[#dfe6ec] hover:bg-[#0d1d2b]'
              }`}
            >
              <i className="w-[30px] flex justify-center shrink-0">
                <svg viewBox="0 0 22 22" className="w-[20px] h-[20px]">
                  <circle cx="11" cy="11" r="4" fill="#f5b53a" />
                  <g stroke="#f5b53a" strokeWidth="1.6">
                    <path d="M11 1v3M11 18v3M1 11h3M18 11h3M4 4l2 2M16 16l2 2M4 18l2-2M16 6l2-2" />
                  </g>
                </svg>
              </i>
              <span>{locale === 'fr' ? 'Solaire' : 'Solar'}</span>
            </button>

            {/* Thermal */}
            <button
              type="button"
              onClick={() => {
                setActiveSource('thermal');
                handleOpenEquipmentModal('eq-multi-sources-02');
              }}
              className={`absolute left-[6px] top-[143px] w-[136px] h-[33px] flex items-center text-[12px] rounded-[4px] cursor-pointer transition-all ${
                activeSource === 'thermal'
                  ? 'border border-[#2a86b5] bg-[#0f2a3c] text-[#5fc0ff] font-bold shadow-md'
                  : 'text-[#dfe6ec] hover:bg-[#0d1d2b]'
              }`}
            >
              <i className="w-[30px] flex justify-center shrink-0">
                <svg viewBox="0 0 22 22" className="w-[20px] h-[20px]">
                  <path d="M11 2c1 5 6 6 6 12a6 6 0 01-12 0c0-3 2-4 3-7 1 2 2 2 3-5z" fill="#ef5a2e" />
                </svg>
              </i>
              <span>{locale === 'fr' ? 'Thermique' : 'Thermal'}</span>
            </button>

            {/* Biomass */}
            <button
              type="button"
              onClick={() => {
                setActiveSource('biomass');
                handleOpenEquipmentModal('eq-multi-sources-02');
              }}
              className={`absolute left-[6px] top-[180px] w-[136px] h-[33px] flex items-center text-[12px] rounded-[4px] cursor-pointer transition-all ${
                activeSource === 'biomass'
                  ? 'border border-[#2a86b5] bg-[#0f2a3c] text-[#5fc0ff] font-bold shadow-md'
                  : 'text-[#dfe6ec] hover:bg-[#0d1d2b]'
              }`}
            >
              <i className="w-[30px] flex justify-center shrink-0">
                <svg viewBox="0 0 22 22" className="w-[20px] h-[20px]">
                  <path d="M4 18C4 8 10 4 19 3c0 9-4 15-13 15z" fill="#5fc25a" />
                </svg>
              </i>
              <span>Biomass</span>
            </button>

            {/* Chain links */}
            <div className="absolute left-0 top-[221px] w-[148px] h-[1px] bg-[#1d3a4c]" />

            <button
              type="button"
              onClick={() => onSelectDomain('D03')}
              className="absolute left-0 top-[226px] w-[148px] h-[44px] flex items-center text-[12px] text-[#dfe6ec] hover:bg-[#0f2a3c] hover:text-[#5fc0ff] cursor-pointer transition-colors"
            >
              <i className="w-[44px] flex justify-center shrink-0">
                <svg viewBox="0 0 30 30" className="w-[26px] h-[26px] stroke-[#c9d3db] fill-none stroke-[1.3]">
                  <path d="M15 3v24M9 27l6-24 6 24M8 10h14M10 17h10" />
                </svg>
              </i>
              <span>{locale === 'fr' ? 'Transport HT' : 'Transmission'}</span>
            </button>

            <div className="absolute left-0 top-[270px] w-[148px] h-[1px] bg-[#1d3a4c]" />

            <button
              type="button"
              onClick={() => onSelectDomain('D04')}
              className="absolute left-0 top-[275px] w-[148px] h-[44px] flex items-center text-[12px] text-[#dfe6ec] hover:bg-[#0f2a3c] hover:text-[#5fc0ff] cursor-pointer transition-colors"
            >
              <i className="w-[44px] flex justify-center shrink-0">
                <svg viewBox="0 0 30 30" className="w-[26px] h-[26px] stroke-[#c9d3db] fill-none stroke-[1.3]">
                  <path d="M4 26V10M10 26V8M16 26V10M22 26V8M28 26V10M2 26h28M4 10h6M16 10h6" />
                </svg>
              </i>
              <span>{locale === 'fr' ? 'Postes HT/MT' : 'Substation'}</span>
            </button>

            <div className="absolute left-0 top-[319px] w-[148px] h-[1px] bg-[#1d3a4c]" />

            <button
              type="button"
              onClick={() => onSelectDomain('D05')}
              className="absolute left-0 top-[324px] w-[148px] h-[44px] flex items-center text-[12px] text-[#dfe6ec] hover:bg-[#0f2a3c] hover:text-[#5fc0ff] cursor-pointer transition-colors"
            >
              <i className="w-[44px] flex justify-center shrink-0">
                <svg viewBox="0 0 30 30" className="w-[26px] h-[26px] stroke-[#c9d3db] fill-none stroke-[1.3]">
                  <circle cx="15" cy="6" r="3" />
                  <circle cx="6" cy="22" r="3" />
                  <circle cx="24" cy="22" r="3" />
                  <circle cx="15" cy="15" r="2" />
                  <path d="M15 9v4M8 20l5-4M22 20l-5-4" />
                </svg>
              </i>
              <span>{locale === 'fr' ? 'Distribution' : 'Distribution'}</span>
            </button>

            <div className="absolute left-0 top-[368px] w-[148px] h-[1px] bg-[#1d3a4c]" />

            <button
              type="button"
              onClick={() => onSelectDomain('D06')}
              className="absolute left-0 top-[374px] w-[148px] h-[44px] flex items-center text-[12px] text-[#dfe6ec] hover:bg-[#0f2a3c] hover:text-[#5fc0ff] cursor-pointer transition-colors"
            >
              <i className="w-[44px] flex justify-center shrink-0">
                <svg viewBox="0 0 30 30" className="w-[26px] h-[26px] stroke-[#c9d3db] fill-none stroke-[1.3]">
                  <rect x="5" y="3" width="14" height="24" />
                  <rect x="19" y="12" width="7" height="15" />
                  <path d="M8 8h2M12 8h2M8 13h2M12 13h2M8 18h2M12 18h2" />
                </svg>
              </i>
              <span>{locale === 'fr' ? 'Installations' : 'Installation'}</span>
            </button>

            <div className="absolute left-0 top-[417px] w-[148px] h-[1px] bg-[#1d3a4c]" />

            <button
              type="button"
              onClick={() => onNavigateView('equipment-list')}
              className="absolute left-0 top-[423px] w-[148px] h-[44px] flex items-center text-[12px] text-[#dfe6ec] hover:bg-[#0f2a3c] hover:text-[#5fc0ff] cursor-pointer transition-colors"
            >
              <i className="w-[44px] flex justify-center shrink-0">
                <svg viewBox="0 0 30 30" className="w-[26px] h-[26px] stroke-[#c9d3db] fill-none stroke-[1.3]">
                  <path d="M3 15L15 4l12 11M7 13v13h16V13M13 26v-8h4v8" />
                </svg>
              </i>
              <span>{locale === 'fr' ? 'Charge Utile' : 'Final Load'}</span>
            </button>
          </div>

          {/* INTERACTIVE CALLOUT BADGES (Placed exactly according to energy-ecosystem.html) */}
          {CALLOUTS.map((co) => {
            const isHovered = hoveredCallout === co.id;
            return (
              <button
                key={co.id}
                type="button"
                onClick={() => handleOpenEquipmentModal(co.equipmentId)}
                onMouseEnter={() => setHoveredCallout(co.id)}
                onMouseLeave={() => setHoveredCallout(null)}
                style={{
                  left: `${co.left}px`,
                  top: `${co.top}px`,
                  width: `${co.width}px`,
                  height: co.height ? `${co.height}px` : '42px',
                }}
                className={`absolute bg-[#07111b]/95 border rounded-[5px] flex items-center pl-[8px] pr-2 transition-all cursor-pointer backdrop-blur-md z-20 text-left ${
                  isHovered
                    ? 'border-[#f2b544] ring-2 ring-[#f2b544]/60 scale-105 shadow-[0_0_15px_rgba(242,181,68,0.4)] bg-[#0d1d2b]'
                    : 'border-[#2a7fa6] shadow-[0_0_8px_rgba(40,140,200,0.3)] hover:border-[#33b6e8]'
                }`}
                title={`Click to inspect ${co.titleEn}`}
              >
                <span className="flex-none w-[22px] h-[22px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[12px] font-bold text-white flex items-center justify-center mr-[9px]">
                  {co.badge}
                </span>
                <div className="overflow-hidden">
                  <b className="block text-[13.5px] font-semibold leading-[16px] text-[#f2f5f8] whitespace-nowrap truncate font-mono">
                    {locale === 'fr' ? co.titleFr : co.titleEn}
                  </b>
                  <small className="block text-[10.5px] leading-[13px] text-[#b9c6d0] whitespace-nowrap truncate font-sans">
                    {locale === 'fr' ? co.subFr : co.subEn}
                  </small>
                </div>
              </button>
            );
          })}

          {/* SVG Animated Power Flow Line (Enabled in 'electrical' and 'functional' modes) */}
          {(viewMode === 'electrical' || viewMode === 'functional') && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
              <defs>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path
                d="M 230,195 Q 320,160 410,210 T 560,230 T 670,360 T 780,240 T 960,320 T 1120,410 T 1210,480"
                fill="none"
                stroke={viewMode === 'electrical' ? '#33b6e8' : '#f2b544'}
                strokeWidth="3.5"
                strokeDasharray="10 6"
                className="animate-pulse"
                opacity="0.9"
                filter="url(#glowEffect)"
              />
            </svg>
          )}

          {/* JOURNEY BAR (Bottom Stage Progression) */}
          <div
            id="jr"
            className="absolute left-[13px] top-[714px] w-[1082px] h-[120px] bg-gradient-to-r from-[#08131d] to-[#0a1a27] border border-[#1f5573] rounded-[6px] z-10 shadow-xl"
          >
            {/* Lightning bolt icon */}
            <svg
              className="absolute left-[14px] top-[12px]"
              width="34"
              height="50"
              viewBox="0 0 38 56"
            >
              <polygon points="24,2 4,32 17,32 10,54 34,20 20,20" fill="#e9a93a" />
            </svg>

            {/* Title & Description */}
            <div className="absolute left-[64px] top-[12px] text-[17px] font-semibold tracking-[0.5px] text-white font-mono">
              <span className="font-bold text-[#f2b544]">{locale === 'fr' ? 'LE' : 'THE'}</span>{' '}
              {locale === 'fr' ? 'PARCOURS COMPLET' : 'COMPLETE JOURNEY'}
            </div>
            <p className="absolute left-[64px] top-[38px] w-[260px] text-[11.5px] leading-[17.5px] text-[#c5d0d9]">
              {locale === 'fr'
                ? 'Des sources primaires à la charge finale, l\'électricité traverse un écosystème interconnecté de production, transport, transformation, distribution et usages.'
                : 'From natural and fuel sources to the final load, electricity travels through a complex ecosystem of generation, transmission, transformation, distribution and utilization.'}
            </p>

            {/* Stage 1: Generation */}
            <button
              type="button"
              onClick={() => handleStageClick(JOURNEY_STAGES_UI[0])}
              className={`absolute top-[22px] left-[373px] w-[66px] h-[66px] rounded-full border-[1.5px] flex items-center justify-center transition-all cursor-pointer ${
                activeStageId === 1
                  ? 'border-[#f2b544] bg-[#1a3a52] ring-4 ring-[#f2b544]/40 scale-105'
                  : 'border-[#39a9d6] bg-[#0b1f2e] hover:border-[#f2b544]'
              }`}
              title="Step 1: Generation"
            >
              <svg viewBox="0 0 34 34" className="w-[34px] h-[34px]">
                <path d="M6 24c4-10 10-14 14-14" stroke="#2a86b5" strokeWidth="3" />
                <polygon points="20,4 10,19 17,19 14,30 25,14 18,14" fill="#39a9d6" />
              </svg>
            </button>
            <div className="absolute top-[96px] left-[346px] w-[120px] text-center text-[12.5px] text-[#e8eef3] font-mono font-semibold">
              {locale === 'fr' ? 'Production' : 'Generation'}
            </div>

            {/* Arrow 1 */}
            <div className="absolute top-[44px] left-[452px] text-[20px] text-[#5f7a8c] font-bold">→</div>

            {/* Stage 2: Transmission */}
            <button
              type="button"
              onClick={() => handleStageClick(JOURNEY_STAGES_UI[1])}
              className={`absolute top-[22px] left-[496px] w-[66px] h-[66px] rounded-full border-[1.5px] flex items-center justify-center transition-all cursor-pointer ${
                activeStageId === 2
                  ? 'border-[#f2b544] bg-[#1a3a52] ring-4 ring-[#f2b544]/40 scale-105'
                  : 'border-[#39a9d6] bg-[#0b1f2e] hover:border-[#f2b544]'
              }`}
              title="Step 2: Transmission"
            >
              <svg viewBox="0 0 34 34" className="w-[34px] h-[34px] stroke-[#c9d3db] fill-none stroke-[1.4]">
                <path d="M17 3v28M11 31l6-28 6 28M9 11h16M11 19h12" />
              </svg>
            </button>
            <div className="absolute top-[96px] left-[474px] w-[110px] text-center text-[12.5px] text-[#e8eef3] font-mono font-semibold">
              {locale === 'fr' ? 'Transport HT' : 'Transmission'}
            </div>

            {/* Arrow 2 */}
            <div className="absolute top-[44px] left-[578px] text-[20px] text-[#5f7a8c] font-bold">→</div>

            {/* Stage 3: Substation */}
            <button
              type="button"
              onClick={() => handleStageClick(JOURNEY_STAGES_UI[2])}
              className={`absolute top-[22px] left-[618px] w-[66px] h-[66px] rounded-full border-[1.5px] flex items-center justify-center transition-all cursor-pointer ${
                activeStageId === 3
                  ? 'border-[#f2b544] bg-[#1a3a52] ring-4 ring-[#f2b544]/40 scale-105'
                  : 'border-[#39a9d6] bg-[#0b1f2e] hover:border-[#f2b544]'
              }`}
              title="Step 3: Substation"
            >
              <svg viewBox="0 0 34 34" className="w-[34px] h-[34px] stroke-[#c9d3db] fill-none stroke-[1.4]">
                <path d="M6 29V12M12 29V10M18 29V12M24 29V10M30 29V12M3 29h28M6 12h6M18 12h6" />
              </svg>
            </button>
            <div className="absolute top-[96px] left-[592px] w-[120px] text-center text-[12.5px] text-[#e8eef3] font-mono font-semibold">
              {locale === 'fr' ? 'Poste Source' : 'Substation'}
            </div>

            {/* Arrow 3 */}
            <div className="absolute top-[44px] left-[705px] text-[20px] text-[#5f7a8c] font-bold">→</div>

            {/* Stage 4: Distribution */}
            <button
              type="button"
              onClick={() => handleStageClick(JOURNEY_STAGES_UI[3])}
              className={`absolute top-[22px] left-[751px] w-[66px] h-[66px] rounded-full border-[1.5px] flex items-center justify-center transition-all cursor-pointer ${
                activeStageId === 4
                  ? 'border-[#f2b544] bg-[#1a3a52] ring-4 ring-[#f2b544]/40 scale-105'
                  : 'border-[#39a9d6] bg-[#0b1f2e] hover:border-[#f2b544]'
              }`}
              title="Step 4: Distribution"
            >
              <svg viewBox="0 0 34 34" className="w-[34px] h-[34px] stroke-[#c9d3db] fill-none stroke-[1.4]">
                <circle cx="17" cy="7" r="3.5" />
                <circle cx="7" cy="25" r="3.5" />
                <circle cx="27" cy="25" r="3.5" />
                <circle cx="17" cy="17" r="2" />
                <path d="M17 10.5v4M9 22l6-4M25 22l-6-4" />
              </svg>
            </button>
            <div className="absolute top-[96px] left-[724px] w-[120px] text-center text-[12.5px] text-[#e8eef3] font-mono font-semibold">
              {locale === 'fr' ? 'Distribution MT' : 'Distribution'}
            </div>

            {/* Arrow 4 */}
            <div className="absolute top-[44px] left-[833px] text-[20px] text-[#5f7a8c] font-bold">→</div>

            {/* Stage 5: Installation */}
            <button
              type="button"
              onClick={() => handleStageClick(JOURNEY_STAGES_UI[4])}
              className={`absolute top-[22px] left-[877px] w-[66px] h-[66px] rounded-full border-[1.5px] flex items-center justify-center transition-all cursor-pointer ${
                activeStageId === 5
                  ? 'border-[#f2b544] bg-[#1a3a52] ring-4 ring-[#f2b544]/40 scale-105'
                  : 'border-[#39a9d6] bg-[#0b1f2e] hover:border-[#f2b544]'
              }`}
              title="Step 5: Installation"
            >
              <svg viewBox="0 0 34 34" className="w-[34px] h-[34px] stroke-[#c9d3db] fill-none stroke-[1.4]">
                <rect x="7" y="3" width="15" height="27" />
                <rect x="22" y="13" width="7" height="17" />
                <path d="M11 8h2M16 8h2M11 14h2M16 14h2M11 20h2M16 20h2" />
              </svg>
            </button>
            <div className="absolute top-[96px] left-[851px] w-[120px] text-center text-[12.5px] text-[#e8eef3] font-mono font-semibold">
              {locale === 'fr' ? 'Installations BT' : 'Installation'}
            </div>

            {/* Arrow 5 */}
            <div className="absolute top-[44px] left-[958px] text-[20px] text-[#5f7a8c] font-bold">→</div>

            {/* Stage 6: Final Load */}
            <button
              type="button"
              onClick={() => handleStageClick(JOURNEY_STAGES_UI[5])}
              className={`absolute top-[22px] left-[998px] w-[66px] h-[66px] rounded-full border-[1.5px] flex items-center justify-center transition-all cursor-pointer ${
                activeStageId === 6
                  ? 'border-[#f2b544] bg-[#1a3a52] ring-4 ring-[#f2b544]/40 scale-105'
                  : 'border-[#39a9d6] bg-[#0b1f2e] hover:border-[#f2b544]'
              }`}
              title="Step 6: Final Load"
            >
              <svg viewBox="0 0 34 34" className="w-[34px] h-[34px] stroke-[#c9d3db] fill-none stroke-[1.4]">
                <path d="M3 17L17 4l14 13M7 15v15h20V15M14 30v-9h6v9" />
              </svg>
            </button>
            <div className="absolute top-[96px] left-[972px] w-[120px] text-center text-[12.5px] text-[#e8eef3] font-mono font-semibold">
              {locale === 'fr' ? 'Travail Utile' : 'Final Load'}
            </div>
          </div>

          {/* BOTTOM THUMBNAILS (01-07) WITH CROP BACKGROUND POSITION */}
          <button
            type="button"
            onClick={() => handleStageClick(JOURNEY_STAGES_UI[0])}
            style={{
              left: '14px',
              width: '162px',
              backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
              backgroundPosition: '-14px -859px',
              backgroundSize: '1536px 1024px',
            }}
            className="absolute top-[859px] h-[122px] border border-[#2a7fa6] rounded-[4px] overflow-hidden cursor-pointer hover:border-[#33b6e8] transition-all group"
          >
            <div className="absolute left-0 right-0 bottom-0 h-[26px] bg-[#06101a]/95 flex items-center text-[12px] text-white pl-[6px] font-mono">
              <span className="w-[19px] h-[19px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[9.5px] flex items-center justify-center mr-[6px]">
                01
              </span>
              <span>{locale === 'fr' ? 'Production' : 'Generation'}</span>
              <span className="ml-auto mr-[6px] text-[14px]">›</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStageClick(JOURNEY_STAGES_UI[1])}
            style={{
              left: '189px',
              width: '159px',
              backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
              backgroundPosition: '-189px -859px',
              backgroundSize: '1536px 1024px',
            }}
            className="absolute top-[859px] h-[122px] border border-[#2a7fa6] rounded-[4px] overflow-hidden cursor-pointer hover:border-[#33b6e8] transition-all group"
          >
            <div className="absolute left-0 right-0 bottom-0 h-[26px] bg-[#06101a]/95 flex items-center text-[12px] text-white pl-[6px] font-mono">
              <span className="w-[19px] h-[19px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[9.5px] flex items-center justify-center mr-[6px]">
                02
              </span>
              <span>{locale === 'fr' ? 'Transport' : 'Transmission'}</span>
              <span className="ml-auto mr-[6px] text-[14px]">›</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStageClick(JOURNEY_STAGES_UI[2])}
            style={{
              left: '360px',
              width: '160px',
              backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
              backgroundPosition: '-360px -859px',
              backgroundSize: '1536px 1024px',
            }}
            className="absolute top-[859px] h-[122px] border border-[#2a7fa6] rounded-[4px] overflow-hidden cursor-pointer hover:border-[#33b6e8] transition-all group"
          >
            <div className="absolute left-0 right-0 bottom-0 h-[26px] bg-[#06101a]/95 flex items-center text-[12px] text-white pl-[6px] font-mono">
              <span className="w-[19px] h-[19px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[9.5px] flex items-center justify-center mr-[6px]">
                03
              </span>
              <span>{locale === 'fr' ? 'Poste' : 'Substation'}</span>
              <span className="ml-auto mr-[6px] text-[14px]">›</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStageClick(JOURNEY_STAGES_UI[3])}
            style={{
              left: '533px',
              width: '159px',
              backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
              backgroundPosition: '-533px -859px',
              backgroundSize: '1536px 1024px',
            }}
            className="absolute top-[859px] h-[122px] border border-[#2a7fa6] rounded-[4px] overflow-hidden cursor-pointer hover:border-[#33b6e8] transition-all group"
          >
            <div className="absolute left-0 right-0 bottom-0 h-[26px] bg-[#06101a]/95 flex items-center text-[12px] text-white pl-[6px] font-mono">
              <span className="w-[19px] h-[19px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[9.5px] flex items-center justify-center mr-[6px]">
                04
              </span>
              <span>{locale === 'fr' ? 'Distribution' : 'Distribution'}</span>
              <span className="ml-auto mr-[6px] text-[14px]">›</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleOpenEquipmentModal('eq-power-transformer-05')}
            style={{
              left: '704px',
              width: '159px',
              backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
              backgroundPosition: '-704px -859px',
              backgroundSize: '1536px 1024px',
            }}
            className="absolute top-[859px] h-[122px] border border-[#2a7fa6] rounded-[4px] overflow-hidden cursor-pointer hover:border-[#33b6e8] transition-all group"
          >
            <div className="absolute left-0 right-0 bottom-0 h-[26px] bg-[#06101a]/95 flex items-center text-[12px] text-white pl-[6px] font-mono">
              <span className="w-[19px] h-[19px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[9.5px] flex items-center justify-center mr-[6px]">
                05
              </span>
              <span>{locale === 'fr' ? 'Transformateur' : 'Transformer'}</span>
              <span className="ml-auto mr-[6px] text-[14px]">›</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStageClick(JOURNEY_STAGES_UI[4])}
            style={{
              left: '877px',
              width: '158px',
              backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
              backgroundPosition: '-877px -859px',
              backgroundSize: '1536px 1024px',
            }}
            className="absolute top-[859px] h-[122px] border border-[#2a7fa6] rounded-[4px] overflow-hidden cursor-pointer hover:border-[#33b6e8] transition-all group"
          >
            <div className="absolute left-0 right-0 bottom-0 h-[26px] bg-[#06101a]/95 flex items-center text-[12px] text-white pl-[6px] font-mono">
              <span className="w-[19px] h-[19px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[9.5px] flex items-center justify-center mr-[6px]">
                06
              </span>
              <span>{locale === 'fr' ? 'Installation' : 'Installation'}</span>
              <span className="ml-auto mr-[6px] text-[14px]">›</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStageClick(JOURNEY_STAGES_UI[5])}
            style={{
              left: '1046px',
              width: '105px',
              backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
              backgroundPosition: '-1046px -859px',
              backgroundSize: '1536px 1024px',
            }}
            className="absolute top-[859px] h-[122px] border border-[#2a7fa6] rounded-[4px] overflow-hidden cursor-pointer hover:border-[#33b6e8] transition-all group"
          >
            <div className="absolute left-0 right-0 bottom-0 h-[26px] bg-[#06101a]/95 flex items-center text-[12px] text-white pl-[6px] font-mono">
              <span className="w-[19px] h-[19px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[9.5px] flex items-center justify-center mr-[6px]">
                07
              </span>
              <span className="truncate">{locale === 'fr' ? 'Charge' : 'Load'}</span>
              <span className="ml-auto mr-[6px] text-[14px]">›</span>
            </div>
          </button>

          {/* CONTROLS (Play, Explore Mode, Reset) */}
          <div
            className="absolute left-[1165px] top-[858px] w-[156px] h-[124px] bg-[#08131d] border border-[#1f5573] rounded-[5px] z-10 p-[6px]"
          >
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-[140px] h-[36px] rounded-[5px] bg-gradient-to-b from-[#e8b04a] to-[#c98f2b] border border-[#f2c56a] text-[#1a1204] font-medium text-[13px] flex items-center pl-[12px] cursor-pointer hover:brightness-110 shadow-md font-mono"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-[18px] h-[18px] mr-[10px] fill-[#1a1204]" />
                  <span>{locale === 'fr' ? 'Pause' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play className="w-[18px] h-[18px] mr-[10px] fill-[#1a1204]" />
                  <span>{locale === 'fr' ? 'Lancer Parcours' : 'Play Journey'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigateView('journey')}
              className="mt-[6px] w-[140px] h-[32px] rounded-[5px] border border-[#2a86b5] bg-[#0a1a27] text-[12px] text-[#e8eef3] flex items-center pl-[12px] cursor-pointer hover:bg-[#102a3f] transition-colors font-mono"
            >
              <Compass className="w-[18px] h-[18px] mr-[10px] stroke-[#dfe6ec]" />
              <span>{locale === 'fr' ? 'Mode Exploration' : 'Explore Mode'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setActiveStageId(1);
                setHoveredCallout(null);
              }}
              className="mt-[6px] w-[140px] h-[30px] rounded-[5px] border border-[#2a86b5] bg-[#0a1a27] text-[12px] text-[#e8eef3] flex items-center pl-[12px] cursor-pointer hover:bg-[#102a3f] transition-colors font-mono"
            >
              <RotateCcw className="w-[16px] h-[16px] mr-[10px] stroke-[#dfe6ec]" />
              <span>{locale === 'fr' ? 'Réinitialiser' : 'Reset'}</span>
            </button>
          </div>

          {/* VIEW MODE SELECTOR (Physical, Electrical, Functional) */}
          <div
            className="absolute left-[1333px] top-[858px] w-[188px] h-[124px] bg-[#08131d] border border-[#1f5573] rounded-[5px] z-10 p-[7px]"
          >
            <div className="text-[10.5px] font-bold text-[#e8eef3] font-mono pl-[4px] uppercase tracking-wider mb-[4px]">
              {locale === 'fr' ? 'Mode d\'Affichage' : 'View Mode'}
            </div>

            <button
              type="button"
              onClick={() => setViewMode('physical')}
              className={`w-[168px] h-[28px] rounded-[4px] flex items-center pl-[10px] text-[12px] cursor-pointer transition-all mb-[3px] font-mono ${
                viewMode === 'physical'
                  ? 'border border-[#2a86b5] bg-[#0f2a3c] text-[#33b6e8] font-bold'
                  : 'text-[#e8eef3] hover:bg-[#102a3f]'
              }`}
            >
              <Eye className="w-[16px] h-[16px] mr-[10px]" />
              <span>{locale === 'fr' ? 'Physique (Territoire)' : 'Physical (Landscape)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('electrical')}
              className={`w-[168px] h-[28px] rounded-[4px] flex items-center pl-[10px] text-[12px] cursor-pointer transition-all mb-[3px] font-mono ${
                viewMode === 'electrical'
                  ? 'border border-[#2a86b5] bg-[#0f2a3c] text-[#33b6e8] font-bold'
                  : 'text-[#e8eef3] hover:bg-[#102a3f]'
              }`}
            >
              <Zap className="w-[16px] h-[16px] mr-[10px]" />
              <span>{locale === 'fr' ? 'Électrique (Flux THT/HTA)' : 'Electrical (Power Flow)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('functional')}
              className={`w-[168px] h-[28px] rounded-[4px] flex items-center pl-[10px] text-[12px] cursor-pointer transition-all font-mono ${
                viewMode === 'functional'
                  ? 'border border-[#2a86b5] bg-[#0f2a3c] text-[#33b6e8] font-bold'
                  : 'text-[#e8eef3] hover:bg-[#102a3f]'
              }`}
            >
              <Layers className="w-[16px] h-[16px] mr-[10px]" />
              <span>{locale === 'fr' ? 'Fonctionnel (Rôles)' : 'Functional (Roles)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* EQUIPMENT DETAIL MODAL (On apparatus pin click) */}
      <EcosystemEquipmentModal
        equipment={selectedEquipment}
        onClose={() => setSelectedEquipment(null)}
        locale={locale}
        viewMode={viewMode}
        onOpenInEpedeDomain={(domainCode, eqId) => {
          setSelectedEquipment(null);
          onSelectDomain(domainCode);
          onSelectEquipment(eqId);
        }}
      />
    </div>
  );
};
