// src/components/ecosystem/ElectricalEcosystemView.tsx
// EPEDE — THE ELECTRICAL ENERGY ECOSYSTEM
// Authoritative interactive recreation of the master reference composition

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Zap,
  Globe,
  Play,
  Pause,
  RotateCcw,
  Compass,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Eye,
  Activity,
  Layers,
  Sliders,
  Box,
  Home,
  Building2,
  GitBranch,
  Server,
  Radio,
  ExternalLink,
  Info,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { EcosystemEquipmentModal } from './EcosystemEquipmentModal';
import { EcosystemR3FCanvas } from './EcosystemR3FCanvas';
import {
  EcosystemEquipmentDetail,
  EcosystemViewMode,
  EnergySourceType,
  ECOSYSTEM_EQUIPMENTS
} from './ecosystemData';
import type { RouteState } from '../../services/routerService';

interface ElectricalEcosystemViewProps {
  locale: 'fr' | 'en';
  onNavigate: (state: Partial<RouteState>) => void;
}

interface CalloutPinDef {
  id: string;
  badgeNumber: number;
  titleEn: string;
  titleFr: string;
  subEn: string;
  subFr: string;
  left: number;
  top: number;
  width: number;
  height?: number;
  equipmentId: string;
  stageStep: number;
  voltageRating?: string;
  powerRating?: string;
  ansiCodes?: string[];
  equation?: string;
}

export const ElectricalEcosystemView: React.FC<ElectricalEcosystemViewProps> = ({
  locale,
  onNavigate,
}) => {
  const [scale, setScale] = useState<number>(1);
  const [viewMode, setViewMode] = useState<EcosystemViewMode>('physical');
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [activeEnergySource, setActiveEnergySource] = useState<EnergySourceType>('hydro');
  const [selectedEquipment, setSelectedEquipment] = useState<EcosystemEquipmentDetail | null>(null);
  const [isPlayingJourney, setIsPlayingJourney] = useState<boolean>(false);
  const [currentStageStep, setCurrentStageStep] = useState<number>(1);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [showPowerFlow, setShowPowerFlow] = useState<boolean>(true);
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState<number | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<'explore' | 'journey' | 'equipment' | 'powerflow' | 'views'>('explore');
  const [fitMode, setFitMode] = useState<'fit' | 'width'>('fit');
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Exact 9 Callout Pins from Authoritative Master Graphic
  const callouts: CalloutPinDef[] = useMemo(() => [
    {
      id: 'pin-hydro',
      badgeNumber: 1,
      titleEn: 'Hydroelectric Power Plant',
      titleFr: 'Centrale Hydroélectrique',
      subEn: 'Water energy → Mechanical → Electrical',
      subFr: 'Énergie hydraulique → Mécanique → Électrique',
      left: 217,
      top: 136,
      width: 238,
      equipmentId: 'eq-hydro-dam-01',
      stageStep: 1,
      voltageRating: '15 kV',
      powerRating: '48 MW',
      ansiCodes: ['87G', '50/51', '59N', '40'],
      equation: 'P = \\rho \\cdot g \\cdot Q \\cdot H \\cdot \\eta'
    },
    {
      id: 'pin-multi-gen',
      badgeNumber: 1,
      titleEn: 'Multiple Generation Sources',
      titleFr: 'Production Multi-Sources',
      subEn: 'Hydro, Wind, Solar, Thermal, Biomass',
      subFr: 'Hydro, Éolien, Solaire, Thermique, Biomasse',
      left: 194,
      top: 502,
      width: 202,
      equipmentId: 'eq-multi-sources-02',
      stageStep: 1,
      voltageRating: '20 kV / 225 kV',
      powerRating: 'Mix 100 MW',
      ansiCodes: ['25', '81O/U', '27/59'],
      equation: 'P_{total} = \\sum P_{hydro} + P_{pv} + P_{wind} + P_{th}'
    },
    {
      id: 'pin-transmission',
      badgeNumber: 3,
      titleEn: 'High Voltage Transmission',
      titleFr: 'Ligne Transport Haute Tension',
      subEn: 'Long distance power transfer',
      subFr: 'Transport d\'énergie grande distance',
      left: 549,
      top: 153,
      width: 210,
      equipmentId: 'eq-transmission-line-03',
      stageStep: 4,
      voltageRating: '225 kV THT',
      powerRating: '1 483 MW Transit',
      ansiCodes: ['21 (Distance)', '87L (Ligne)', '50/51'],
      equation: 'P = \\sqrt{3} \\cdot U \\cdot I \\cdot \\cos\\varphi'
    },
    {
      id: 'pin-substation',
      badgeNumber: 4,
      titleEn: 'Transmission Substation',
      titleFr: 'Poste Source de Transport',
      subEn: 'HV → MV (step-down)',
      subFr: 'THT → HTA (abaissement 225/30 kV)',
      left: 789,
      top: 163,
      width: 190,
      height: 43,
      equipmentId: 'eq-transmission-substation-04',
      stageStep: 5,
      voltageRating: '225 kV / 30 kV',
      powerRating: '2 × 63 MVA',
      ansiCodes: ['87T', '50/51', '51N', '49'],
      equation: 'U_2 = U_1 \\cdot (N_2 / N_1)'
    },
    {
      id: 'pin-trafo-power',
      badgeNumber: 5,
      titleEn: 'Power Transformer',
      titleFr: 'Transformateur de Puissance',
      subEn: 'HV → MV / LV',
      subFr: 'THT → HTA / BT (63 MVA)',
      left: 684,
      top: 430,
      width: 182,
      equipmentId: 'eq-power-transformer-05',
      stageStep: 5,
      voltageRating: '225 kV / 30 kV',
      powerRating: '63 MVA ONAF',
      ansiCodes: ['87T', '63 (Buchholz)', '49 (Therm.)'],
      equation: 'S = \\sqrt{3} \\cdot U_n \\cdot I_n'
    },
    {
      id: 'pin-distribution',
      badgeNumber: 5,
      titleEn: 'Distribution Network',
      titleFr: 'Réseau de Distribution',
      subEn: 'MV distribution',
      subFr: 'Distribution HTA 30 kV urbaine/rurale',
      left: 987,
      top: 247,
      width: 172,
      height: 43,
      equipmentId: 'eq-distribution-network-06',
      stageStep: 6,
      voltageRating: '30 kV HTA',
      powerRating: 'Boucle 25 MVA',
      ansiCodes: ['50/51', '50N/51N', '79 (Réenclencheur)'],
      equation: '\\Delta U = \\sqrt{3} \\cdot I \\cdot (R\\cos\\varphi + X\\sin\\varphi)'
    },
    {
      id: 'pin-dist-trafo',
      badgeNumber: 6,
      titleEn: 'Distribution Transformer',
      titleFr: 'Transformateur de Distribution',
      subEn: 'MV → LV',
      subFr: 'HTA → BT (30 kV / 400 V)',
      left: 1174,
      top: 311,
      width: 198,
      height: 43,
      equipmentId: 'eq-dist-transformer-07',
      stageStep: 7,
      voltageRating: '30 kV / 400 V',
      powerRating: '630 kVA ONAN',
      ansiCodes: ['Fusibles HTA HPC', 'DGPT2'],
      equation: 'I_{BT} = S / (\\sqrt{3} \\cdot 400\\text{ V}) = 909\\text{ A}'
    },
    {
      id: 'pin-buildings',
      badgeNumber: 7,
      titleEn: 'Buildings & Industry',
      titleFr: 'Bâtiments & Industrie',
      subEn: 'LV distribution',
      subFr: 'Distribution Basse Tension 400/230 V',
      left: 1316,
      top: 402,
      width: 188,
      height: 43,
      equipmentId: 'eq-installation-tgbt-08',
      stageStep: 8,
      voltageRating: '400 V / 230 V BT',
      powerRating: 'TGBT 1 250 A',
      ansiCodes: ['Disjoncteur Débrochable', 'Différentiel RCD'],
      equation: 'P = \\sqrt{3} \\cdot 400 \\cdot I \\cdot \\cos\\varphi'
    },
    {
      id: 'pin-final-load',
      badgeNumber: 8,
      titleEn: 'Final Load',
      titleFr: 'Charges Finales & Travail Utile',
      subEn: 'Homes, businesses, industry',
      subFr: 'Résidentiel, tertiaire, moteurs & procédés',
      left: 1347,
      top: 624,
      width: 184,
      equipmentId: 'eq-final-load-09',
      stageStep: 9,
      voltageRating: '400 V / 230 V',
      powerRating: 'Consommation Utile',
      ansiCodes: ['Disjoncteur divisionnaire', 'Variateur VFD'],
      equation: 'P_{utile} = \\eta \\cdot P_{electrique} \\quad \\text{(Travail Utile)}'
    },
  ], []);

  // 9 Journey Steps narrative definitions
  const journeyStages = useMemo(() => [
    {
      step: 1,
      nameEn: 'Generation',
      nameFr: 'Production',
      descEn: 'Hydroelectric turbine converts water potential head into electrical energy at 15 kV.',
      descFr: 'La turbine hydroélectrique convertit la charge potentielle de l\'eau en énergie électrique à 15 kV.',
      targetPin: 'pin-hydro',
      equipmentTarget: 'eq-hydro-dam-01',
    },
    {
      step: 2,
      nameEn: 'Voltage Transformation',
      nameFr: 'Élévation de Tension',
      descEn: 'Generator Step-Up (GSU) transformer raises voltage from 15 kV to 225 kV for bulk transfer.',
      descFr: 'Le transformateur élévateur GSU monte la tension de 15 kV à 225 kV pour le transport de masse.',
      targetPin: 'pin-trafo-power',
      equipmentTarget: 'eq-power-transformer-05',
    },
    {
      step: 3,
      nameEn: 'Generating Switchyard',
      nameFr: 'Poste d\'Évacuation',
      descEn: 'SF6 circuit breakers and disconnectors connect generators safely to the grid.',
      descFr: 'Disjoncteurs SF6 et sectionneurs raccordent les alternateurs en toute sécurité.',
      targetPin: 'pin-hydro',
      equipmentTarget: 'eq-hydro-dam-01',
    },
    {
      step: 4,
      nameEn: 'High-Voltage Transmission',
      nameFr: 'Transport Haute Tension',
      descEn: '225 kV overhead lines on steel towers transmit power across long distances with minimal losses.',
      descFr: 'Lignes aériennes 225 kV sur pylônes treillis transportent l\'énergie à très faibles pertes.',
      targetPin: 'pin-transmission',
      equipmentTarget: 'eq-transmission-line-03',
    },
    {
      step: 5,
      nameEn: 'Transmission Substation',
      nameFr: 'Poste Source de Transport',
      descEn: 'Air-insulated substation steps down 225 kV to 30 kV for regional distribution.',
      descFr: 'Le poste de transport abaisse la tension de 225 kV à 30 kV pour la distribution régionale.',
      targetPin: 'pin-substation',
      equipmentTarget: 'eq-transmission-substation-04',
    },
    {
      step: 6,
      nameEn: 'Medium-Voltage Distribution',
      nameFr: 'Distribution Moyenne Tension',
      descEn: '30 kV feeder lines, reclosers, and ring main units (RMUs) route power across communities.',
      descFr: 'Départs 30 kV, réenclencheurs et cellules RMU acheminent l\'énergie vers les centres urbains.',
      targetPin: 'pin-distribution',
      equipmentTarget: 'eq-distribution-network-06',
    },
    {
      step: 7,
      nameEn: 'Final Transformation',
      nameFr: 'Transformation Finale',
      descEn: 'Distribution transformers convert 30 kV into safe low-voltage 400 V / 230 V.',
      descFr: 'Les transformateurs de distribution convertissent le 30 kV en basse tension 400 V / 230 V.',
      targetPin: 'pin-dist-trafo',
      equipmentTarget: 'eq-dist-transformer-07',
    },
    {
      step: 8,
      nameEn: 'Electrical Installation',
      nameFr: 'Installation Électrique',
      descEn: 'TGBT main switchboard, circuit breakers, and distribution boards protect building subcircuits.',
      descFr: 'TGBT, disjoncteurs et coffrets de distribution protègent les circuits terminaux.',
      targetPin: 'pin-buildings',
      equipmentTarget: 'eq-installation-tgbt-08',
    },
    {
      step: 9,
      nameEn: 'Final Load (Useful Work)',
      nameFr: 'Charge Finale (Travail Utile)',
      descEn: 'Electricity is transformed into mechanical work, heat, light, and computational power.',
      descFr: 'L\'électricité est transformée en travail mécanique, chaleur, lumière et puissance utile.',
      targetPin: 'pin-final-load',
      equipmentTarget: 'eq-final-load-09',
    },
  ], []);

  // Responsive stage scaling: preserves exact 1536x1024 aspect ratio on all screens
  useEffect(() => {
    const handleResize = () => {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      let k: number;
      let ox = 0;
      let oy = 0;
      if (fitMode === 'fit') {
        k = Math.min(winW / 1536, winH / 1024);
        ox = Math.max(0, (winW - 1536 * k) / 2);
        oy = Math.max(0, (winH - 1024 * k) / 2);
        if (wrapRef.current) {
          wrapRef.current.style.height = `${winH}px`;
        }
      } else {
        const containerWidth = wrapRef.current?.clientWidth || winW;
        k = Math.min(containerWidth, winW) / 1536;
        ox = 0;
        oy = 0;
        if (wrapRef.current) {
          wrapRef.current.style.height = `${1024 * k}px`;
        }
      }
      setScale(k);
      setOffsetX(ox);
      setOffsetY(oy);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [fitMode]);

  // Automatic journey playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingJourney) {
      interval = setInterval(() => {
        setCurrentStageStep((prev) => {
          if (prev >= 9) {
            setIsPlayingJourney(false);
            return 1;
          }
          return prev + 1;
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlayingJourney]);

  // Sync active stage pin with current stage
  useEffect(() => {
    const activeStage = journeyStages.find((s) => s.step === currentStageStep);
    if (activeStage) {
      setActivePinId(activeStage.targetPin);
    }
  }, [currentStageStep, journeyStages]);

  const handleSelectPin = (callout: CalloutPinDef) => {
    setActivePinId(callout.id);
    setCurrentStageStep(callout.stageStep);
    const eq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === callout.equipmentId);
    if (eq) {
      setSelectedEquipment(eq);
    }
  };

  const handleSelectThumbnail = (index: number, equipmentId: string, stageStep: number) => {
    setActiveThumbnailIndex(index);
    setCurrentStageStep(stageStep);
    const eq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === equipmentId);
    if (eq) {
      setSelectedEquipment(eq);
    }
  };

  const handleReset = () => {
    setIsPlayingJourney(false);
    setCurrentStageStep(1);
    setActivePinId(null);
    setSelectedEquipment(null);
    setActiveThumbnailIndex(null);
    setViewMode('physical');
    setActiveEnergySource('hydro');
  };

  const currentStageInfo = journeyStages.find((s) => s.step === currentStageStep) || journeyStages[0];

  return (
    <div className="w-full bg-[#050b12] text-[#e8eef3] overflow-x-hidden font-['Exo_2',sans-serif] select-none flex flex-col items-center">
      {/* Floating Return to Platform Portal Button */}
      <button
        type="button"
        onClick={() => onNavigate({ view: 'home' })}
        className="fixed top-3 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0a121a]/90 hover:bg-[#122232] text-amber-300 hover:text-white border border-amber-500/40 hover:border-amber-400 shadow-2xl backdrop-blur-md transition-all font-mono text-xs font-bold group cursor-pointer"
        title={locale === 'fr' ? 'Retourner au portail EPEDE' : 'Return to EPEDE Portal'}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-amber-400" />
        <span>{locale === 'fr' ? '← Portail EPEDE' : '← EPEDE Portal'}</span>
      </button>

      {/* Dynamic Viewport Responsive Wrapper */}
      <div
        ref={wrapRef}
        id="wrap"
        className={`w-full relative overflow-hidden ${fitMode === 'fit' ? 'h-screen' : ''}`}
        style={{
          height: fitMode === 'fit' ? '100vh' : `${1024 * scale}px`,
          backgroundColor: 'var(--ecosystem-sky-background, #070D14)',
        }}
      >
        {/* 1536x1024 Fixed Canvas Stage with Exact Scaled Transformation */}
        <div
          ref={stageRef}
          id="stage"
          className="absolute overflow-hidden shadow-2xl"
          style={{
            width: '1536px',
            height: '1024px',
            left: `${offsetX}px`,
            top: `${offsetY}px`,
            transformOrigin: '0 0',
            transform: `scale(${scale})`,
            backgroundImage: is3DMode ? 'none' : `url('/assets/electrical-energy-ecosystem.jpg')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 0',
            backgroundSize: '1536px 1024px',
            backgroundColor: is3DMode ? 'var(--ecosystem-sky-background, #070D14)' : '#050b12',
          }}
        >
          {/* ========================================================================= */}
          {/* 1. TOP HEADER (Height: 92px) - Authoritative Identity & Navigation        */}
          {/* ========================================================================= */}
          <header
            id="hdr"
            className="absolute left-0 top-0 w-[1536px] h-[92px] bg-gradient-to-b from-[#0a121a] to-[#070d14] border-b border-[#1a2a36] z-30"
          >
            {/* EPEDE Brand Lightning Icon */}
            <svg
              className="absolute left-[22px] top-[18px] cursor-pointer hover:scale-105 transition-transform"
              width="38"
              height="56"
              viewBox="0 0 38 56"
              onClick={() => onNavigate({ view: 'home' })}
            >
              <title>{locale === 'fr' ? 'Retour au portail EPEDE' : 'Back to EPEDE Portal'}</title>
              <polygon points="24,2 4,32 17,32 10,54 34,20 20,20" fill="#e9a93a" />
            </svg>

            {/* Logo Title & Subtitle */}
            <div
              className="absolute left-[68px] top-[16px] text-[36px] font-bold tracking-[6px] text-white leading-none cursor-pointer"
              onClick={() => onNavigate({ view: 'home' })}
            >
              EPEDE
            </div>
            <div className="absolute left-[68px] top-[52px] text-[12.5px] leading-[14px] text-[#c9d3db]">
              Electrical Power Engineering<br />Digital Environment
            </div>

            {/* Globe Icon & Gold Divider */}
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
            <div className="absolute left-[257px] top-[6px] w-[1px] h-[80px] bg-[#8a6a2c]" />

            {/* Central Stage Headline */}
            <h1 className="absolute left-0 w-[1132px] text-center top-[26px] text-[26px] font-semibold tracking-[3px] text-[#f3f6f8] pointer-events-none">
              THE ELECTRICAL ENERGY ECOSYSTEM
            </h1>
            <div className="absolute left-0 w-[1132px] text-center top-[59px] text-[19px] text-[#dfe6ec] tracking-[0.3px] pointer-events-none">
              {locale === 'fr' ? 'De la Source d\'Énergie au Travail Utile' : 'From Energy Source to Useful Work'}
            </div>

            {/* Top Navigation Items */}
            {/* 1. Explore */}
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('explore');
                handleReset();
              }}
              className={`absolute top-[32px] left-[901px] w-[80px] text-center text-[13.5px] cursor-pointer transition-colors ${
                activeNavTab === 'explore' ? 'text-amber-400 font-bold' : 'text-[#dfe6ec] hover:text-white'
              }`}
            >
              <svg className="block mx-auto mb-[6px] w-[26px] height-[26px] stroke-current fill-none stroke-[1.4]" viewBox="0 0 26 26">
                <path d="M13 3l9 5v10l-9 5-9-5V8z" />
                <path d="M4 8l9 5 9-5M13 13v10" />
              </svg>
              Explore
            </button>
            <div className="absolute left-[989px] top-[34px] w-[1px] h-[40px] bg-[#3a4a58]" />

            {/* 2. Journey */}
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('journey');
                setIsPlayingJourney(!isPlayingJourney);
              }}
              className={`absolute top-[32px] left-[1004px] w-[80px] text-center text-[13.5px] cursor-pointer transition-colors ${
                isPlayingJourney || activeNavTab === 'journey' ? 'text-amber-400 font-bold' : 'text-[#dfe6ec] hover:text-white'
              }`}
            >
              <svg className="block mx-auto mb-[6px] w-[26px] height-[26px] stroke-current fill-none stroke-[1.4]" viewBox="0 0 26 26">
                <path d="M3 6c5 0 6 14 10 14s5-14 10-14M3 20c5 0 6-14 10-14s5 14 10 14" />
              </svg>
              Journey
            </button>
            <div className="absolute left-[1094px] top-[34px] w-[1px] h-[40px] bg-[#3a4a58]" />

            {/* 3. Equipment */}
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('equipment');
                setSelectedEquipment(ECOSYSTEM_EQUIPMENTS[0]);
              }}
              className={`absolute top-[32px] left-[1104px] w-[80px] text-center text-[13.5px] cursor-pointer transition-colors ${
                activeNavTab === 'equipment' ? 'text-amber-400 font-bold' : 'text-[#dfe6ec] hover:text-white'
              }`}
            >
              <svg className="block mx-auto mb-[6px] w-[26px] height-[26px] stroke-current fill-none stroke-[1.4]" viewBox="0 0 26 26">
                <rect x="4" y="5" width="18" height="16" />
                <path d="M9 5v16M17 5v16M4 12h18" />
              </svg>
              Equipment
            </button>
            <div className="absolute left-[1192px] top-[34px] w-[1px] h-[40px] bg-[#3a4a58]" />

            {/* 4. Power Flow */}
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('powerflow');
                setShowPowerFlow((prev) => !prev);
              }}
              className={`absolute top-[32px] left-[1195px] w-[80px] text-center text-[13.5px] cursor-pointer transition-colors ${
                showPowerFlow ? 'text-cyan-400 font-bold' : 'text-[#dfe6ec] hover:text-white'
              }`}
            >
              <svg className="block mx-auto mb-[6px] w-[26px] height-[26px] stroke-current fill-none stroke-[1.4]" viewBox="0 0 26 26">
                <path d="M4 9h16l-4-4M22 17H6l4 4" />
              </svg>
              Power Flow
            </button>
            <div className="absolute left-[1273px] top-[34px] w-[1px] h-[40px] bg-[#3a4a58]" />

            {/* 5. Views */}
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('views');
                setViewMode((prev) => (prev === 'physical' ? 'electrical' : prev === 'electrical' ? 'functional' : 'physical'));
              }}
              className={`absolute top-[32px] left-[1254px] w-[80px] text-center text-[13.5px] cursor-pointer transition-colors ${
                viewMode !== 'physical' ? 'text-amber-400 font-bold' : 'text-[#dfe6ec] hover:text-white'
              }`}
            >
              <svg className="block mx-auto mb-[6px] w-[26px] height-[26px] stroke-current fill-none stroke-[1.4]" viewBox="0 0 26 26">
                <path d="M10 4v18M16 4v18" strokeWidth="2.4" />
              </svg>
              Views
            </button>

            {/* Right Divider & Sustainable Engineering Quote */}
            <div className="absolute left-[1325px] top-[26px] w-[1px] h-[56px] bg-[#c9922e]" />
            <div className="absolute left-[1338px] top-[33px] w-[170px] text-[12px] leading-[15px] italic text-[#d3dbe2]">
              " Understanding the complete energy chain to build a smarter, more sustainable future. "
            </div>

            {/* 3D Spatial Twin Toggle Button */}
            <button
              type="button"
              onClick={() => setIs3DMode((prev) => !prev)}
              className={`absolute right-[250px] top-[10px] px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 cursor-pointer transition-all shadow-sm border ${
                is3DMode
                  ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400 font-bold shadow-cyan-500/20'
                  : 'bg-[#0d1a24] hover:bg-[#152838] text-slate-300 border-[#2a7fa6]/60 hover:text-white'
              }`}
              title={is3DMode ? 'Basculer en vue 2D Master CAD' : 'Basculer en vue 3D Interactive WebGL'}
            >
              <Box className={`w-3.5 h-3.5 ${is3DMode ? 'text-cyan-400' : 'text-amber-400'}`} />
              <span>{is3DMode ? (locale === 'fr' ? 'VUE 2D MASTER' : '2D MASTER VIEW') : (locale === 'fr' ? 'JUMEAU 3D' : '3D SPATIAL TWIN')}</span>
            </button>

            {/* Viewport Scale Fit Mode Button */}
            <button
              type="button"
              onClick={() => setFitMode((prev) => (prev === 'fit' ? 'width' : 'fit'))}
              className="absolute right-[136px] top-[10px] px-2.5 py-1 rounded bg-[#0d1a24] hover:bg-[#152838] border border-[#2a7fa6]/60 text-[11px] font-mono text-cyan-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
              title={fitMode === 'fit' ? 'Basculer en pleine largeur avec défilement' : 'Ajuster à l\'écran (vue d\'ensemble 100%)'}
            >
              {fitMode === 'fit' ? <Maximize2 className="w-3 h-3 text-cyan-400" /> : <Minimize2 className="w-3 h-3 text-amber-400" />}
              <span>{fitMode === 'fit' ? 'VUE ÉCRAN' : 'LARGEUR 100%'}</span>
            </button>

            {/* Portal Return Gateway Button */}
            <button
              type="button"
              onClick={() => onNavigate({ view: 'home' })}
              className="absolute right-4 top-[10px] px-2.5 py-1 rounded bg-[#0d1a24] hover:bg-[#152838] border border-[#2a7fa6]/60 text-[11px] font-mono text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer transition-all shadow-sm"
              title="Retour au portail EPEDE"
            >
              <ArrowRight className="w-3 h-3 rotate-180 text-amber-400" />
              <span>PORTAL EPEDE</span>
            </button>
          </header>

          {/* ========================================================================= */}
          {/* 2. LEFT NAVIGATION PANEL (#lp) (Left: 11px, Top: 107px, Width: 150px)      */}
          {/* ========================================================================= */}
          <nav
            id="lp"
            className="absolute left-[11px] top-[107px] w-[150px] h-[468px] bg-[#0a1620]/95 border border-[#1d3a4c] rounded-[5px] backdrop-blur-md z-20 shadow-xl"
          >
            <div className="absolute left-[9px] top-[8px] text-[12px] text-[#e8eef3] font-semibold">
              Energy Sources &amp; Generation
            </div>

            {/* 1. Hydro */}
            <div
              onClick={() => {
                setActiveEnergySource('hydro');
                handleSelectPin(callouts[0]);
              }}
              className={`absolute left-0 w-[148px] h-[34px] flex items-center text-[12px] cursor-pointer transition-all ${
                activeEnergySource === 'hydro'
                  ? 'left-[6px] w-[136px] h-[33px] border border-[#2a86b5] bg-[#0f2a3c] rounded-[4px] text-[#5fc0ff] font-bold'
                  : 'text-[#dfe6ec] hover:bg-[#0e2130]'
              }`}
              style={{ top: '31px' }}
            >
              <i className="w-[36px] flex justify-center">
                <svg viewBox="0 0 22 22" className="w-[22px] h-[22px]">
                  <path d="M11 2C8 8 5 10 5 14a6 6 0 0012 0c0-4-3-6-6-12z" fill="#2a9df0" />
                </svg>
              </i>
              <span>Hydro</span>
            </div>

            {/* 2. Wind */}
            <div
              onClick={() => {
                setActiveEnergySource('wind');
                handleSelectPin(callouts[1]);
              }}
              className={`absolute left-0 w-[148px] h-[34px] flex items-center text-[12px] cursor-pointer transition-all ${
                activeEnergySource === 'wind'
                  ? 'left-[6px] w-[136px] h-[33px] border border-[#2a86b5] bg-[#0f2a3c] rounded-[4px] text-[#5fc0ff] font-bold'
                  : 'text-[#dfe6ec] hover:bg-[#0e2130]'
              }`}
              style={{ top: '66px' }}
            >
              <i className="w-[36px] flex justify-center">
                <svg viewBox="0 0 22 22" className="w-[22px] h-[22px]" stroke="#4bb0e8" fill="none" strokeWidth="1.4">
                  <path d="M11 10v10M11 10L6 3M11 10l6-2M11 10L5 14" />
                </svg>
              </i>
              <span>Wind</span>
            </div>

            {/* 3. Solar */}
            <div
              onClick={() => {
                setActiveEnergySource('solar');
                handleSelectPin(callouts[1]);
              }}
              className={`absolute left-0 w-[148px] h-[34px] flex items-center text-[12px] cursor-pointer transition-all ${
                activeEnergySource === 'solar'
                  ? 'left-[6px] w-[136px] h-[33px] border border-[#2a86b5] bg-[#0f2a3c] rounded-[4px] text-[#f5b53a] font-bold'
                  : 'text-[#dfe6ec] hover:bg-[#0e2130]'
              }`}
              style={{ top: '104px' }}
            >
              <i className="w-[36px] flex justify-center">
                <svg viewBox="0 0 22 22" className="w-[22px] h-[22px]">
                  <circle cx="11" cy="11" r="4" fill="#f5b53a" />
                  <g stroke="#f5b53a" strokeWidth="1.6">
                    <path d="M11 1v3M11 18v3M1 11h3M18 11h3M4 4l2 2M16 16l2 2M4 18l2-2M16 6l2-2" />
                  </g>
                </svg>
              </i>
              <span>Solar</span>
            </div>

            {/* 4. Thermal */}
            <div
              onClick={() => {
                setActiveEnergySource('thermal');
                handleSelectPin(callouts[1]);
              }}
              className={`absolute left-0 w-[148px] h-[34px] flex items-center text-[12px] cursor-pointer transition-all ${
                activeEnergySource === 'thermal'
                  ? 'left-[6px] w-[136px] h-[33px] border border-[#2a86b5] bg-[#0f2a3c] rounded-[4px] text-[#ef5a2e] font-bold'
                  : 'text-[#dfe6ec] hover:bg-[#0e2130]'
              }`}
              style={{ top: '143px' }}
            >
              <i className="w-[36px] flex justify-center">
                <svg viewBox="0 0 22 22" className="w-[22px] h-[22px]">
                  <path d="M11 2c1 5 6 6 6 12a6 6 0 01-12 0c0-3 2-4 3-7 1 2 2 2 3-5z" fill="#ef5a2e" />
                </svg>
              </i>
              <span>Thermal</span>
            </div>

            {/* 5. Biomass */}
            <div
              onClick={() => {
                setActiveEnergySource('biomass');
                handleSelectPin(callouts[1]);
              }}
              className={`absolute left-0 w-[148px] h-[34px] flex items-center text-[12px] cursor-pointer transition-all ${
                activeEnergySource === 'biomass'
                  ? 'left-[6px] w-[136px] h-[33px] border border-[#2a86b5] bg-[#0f2a3c] rounded-[4px] text-[#5fc25a] font-bold'
                  : 'text-[#dfe6ec] hover:bg-[#0e2130]'
              }`}
              style={{ top: '180px' }}
            >
              <i className="w-[36px] flex justify-center">
                <svg viewBox="0 0 22 22" className="w-[22px] h-[22px]">
                  <path d="M4 18C4 8 10 4 19 3c0 9-4 15-13 15z" fill="#5fc25a" />
                </svg>
              </i>
              <span>Biomass</span>
            </div>

            <div className="absolute left-0 w-[148px] h-[1px] bg-[#1d3a4c]" style={{ top: '221px' }} />

            {/* Stage: Transmission */}
            <div
              onClick={() => handleSelectPin(callouts[2])}
              className={`absolute left-0 w-[148px] h-[48px] flex items-center text-[12px] cursor-pointer transition-all ${
                currentStageStep === 4 ? 'bg-[#0f2a3c] text-cyan-300 font-bold border-l-2 border-cyan-400' : 'text-[#dfe6ec] hover:bg-[#0e2130]'
              }`}
              style={{ top: '226px' }}
            >
              <i className="w-[44px] flex justify-center">
                <svg viewBox="0 0 30 30" className="w-[30px] h-[30px] stroke-[#c9d3db] fill-none stroke-[1.3]">
                  <path d="M15 3v24M9 27l6-24 6 24M8 10h14M10 17h10" />
                </svg>
              </i>
              <span>Transmission</span>
            </div>

            <div className="absolute left-0 w-[148px] h-[1px] bg-[#1d3a4c]" style={{ top: '270px' }} />

            {/* Stage: Substation */}
            <div
              onClick={() => handleSelectPin(callouts[3])}
              className={`absolute left-0 w-[148px] h-[48px] flex items-center text-[12px] cursor-pointer transition-all ${
                currentStageStep === 5 ? 'bg-[#0f2a3c] text-cyan-300 font-bold border-l-2 border-cyan-400' : 'text-[#dfe6ec] hover:bg-[#0e2130]'
              }`}
              style={{ top: '275px' }}
            >
              <i className="w-[44px] flex justify-center">
                <svg viewBox="0 0 30 30" className="w-[30px] h-[30px] stroke-[#c9d3db] fill-none stroke-[1.3]">
                  <path d="M4 26V10M10 26V8M16 26V10M22 26V8M28 26V10M2 26h28M4 10h6M16 10h6" />
                </svg>
              </i>
              <span>Substation</span>
            </div>

            <div className="absolute left-0 w-[148px] h-[1px] bg-[#1d3a4c]" style={{ top: '319px' }} />

            {/* Stage: Distribution */}
            <div
              onClick={() => handleSelectPin(callouts[5])}
              className={`absolute left-0 w-[148px] h-[48px] flex items-center text-[12px] cursor-pointer transition-all ${
                currentStageStep === 6 ? 'bg-[#0f2a3c] text-cyan-300 font-bold border-l-2 border-cyan-400' : 'text-[#dfe6ec] hover:bg-[#0e2130]'
              }`}
              style={{ top: '324px' }}
            >
              <i className="w-[44px] flex justify-center">
                <svg viewBox="0 0 30 30" className="w-[30px] h-[30px] stroke-[#c9d3db] fill-none stroke-[1.3]">
                  <circle cx="15" cy="6" r="3" />
                  <circle cx="6" cy="22" r="3" />
                  <circle cx="24" cy="22" r="3" />
                  <circle cx="15" cy="15" r="2" />
                  <path d="M15 9v4M8 20l5-4M22 20l-5-4" />
                </svg>
              </i>
              <span>Distribution</span>
            </div>

            <div className="absolute left-0 w-[148px] h-[1px] bg-[#1d3a4c]" style={{ top: '368px' }} />

            {/* Stage: Installation */}
            <div
              onClick={() => handleSelectPin(callouts[7])}
              className={`absolute left-0 w-[148px] h-[48px] flex items-center text-[12px] cursor-pointer transition-all ${
                currentStageStep === 8 ? 'bg-[#0f2a3c] text-cyan-300 font-bold border-l-2 border-cyan-400' : 'text-[#dfe6ec] hover:bg-[#0e2130]'
              }`}
              style={{ top: '374px' }}
            >
              <i className="w-[44px] flex justify-center">
                <svg viewBox="0 0 30 30" className="w-[30px] h-[30px] stroke-[#c9d3db] fill-none stroke-[1.3]">
                  <rect x="5" y="3" width="14" height="24" />
                  <rect x="19" y="12" width="7" height="15" />
                  <path d="M8 8h2M12 8h2M8 13h2M12 13h2M8 18h2M12 18h2" />
                </svg>
              </i>
              <span>Installation</span>
            </div>

            <div className="absolute left-0 w-[148px] h-[1px] bg-[#1d3a4c]" style={{ top: '417px' }} />

            {/* Stage: Final Load */}
            <div
              onClick={() => handleSelectPin(callouts[8])}
              className={`absolute left-0 w-[148px] h-[48px] flex items-center text-[12px] cursor-pointer transition-all ${
                currentStageStep === 9 ? 'bg-[#0f2a3c] text-cyan-300 font-bold border-l-2 border-cyan-400' : 'text-[#dfe6ec] hover:bg-[#0e2130]'
              }`}
              style={{ top: '423px' }}
            >
              <i className="w-[44px] flex justify-center">
                <svg viewBox="0 0 30 30" className="w-[30px] h-[30px] stroke-[#c9d3db] fill-none stroke-[1.3]">
                  <path d="M3 15L15 4l12 11M7 13v13h16V13M13 26v-8h4v8" />
                </svg>
              </i>
              <span>Final Load</span>
            </div>
          </nav>

          {/* 3D WebGL Ecosystem Canvas Stage */}
          {is3DMode && (
            <div 
              className="absolute left-[165px] top-[92px] w-[1371px] h-[932px] z-10 overflow-hidden"
              style={{ backgroundColor: 'var(--ecosystem-sky-background, #070D14)' }}
            >
              <EcosystemR3FCanvas
                viewMode={viewMode}
                activeEnergySource={activeEnergySource}
                selectedEquipment={selectedEquipment}
                onSelectEquipment={(eq) => setSelectedEquipment(eq)}
                isPlayingJourney={isPlayingJourney}
                currentStageId={currentStageStep}
                locale={locale}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. DYNAMIC ANIMATED POWER FLOW OVERLAYS (SVG Canvas - 2D Mode only)        */}
          {/* ========================================================================= */}
          {!is3DMode && showPowerFlow && (
            <svg
              className="absolute left-0 top-0 w-[1536px] height-[1024px] pointer-events-none z-10"
              viewBox="0 0 1536 1024"
            >
              <defs>
                {/* Glowing Flow Gradients */}
                <linearGradient id="flow-ehv-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#FBBF24" stopOpacity="1" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="flow-mv-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#FBBF24" stopOpacity="1" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Path 1: Hydro Dam to Switchyard */}
              <path
                d="M 320 280 Q 420 270 510 260"
                fill="none"
                stroke={currentStageStep === 1 ? '#FBBF24' : '#38BDF8'}
                strokeWidth={currentStageStep === 1 ? 3.5 : 2}
                strokeDasharray="6,4"
                className="animate-[dash_1s_linear_infinite]"
                filter="url(#glow-gold)"
                opacity="0.85"
              />

              {/* Path 2: Thermal / Solar / Wind to Switchyard */}
              <path
                d="M 340 520 Q 460 480 540 450 L 590 400"
                fill="none"
                stroke={currentStageStep === 1 ? '#FBBF24' : '#F59E0B'}
                strokeWidth="2"
                strokeDasharray="6,4"
                className="animate-[dash_1.2s_linear_infinite]"
                opacity="0.8"
              />

              {/* Path 3: High Voltage Transmission Corridor (Left Pylons -> Center Substation) */}
              <path
                d="M 510 260 Q 640 230 750 215 L 850 205 L 910 240"
                fill="none"
                stroke={currentStageStep === 4 ? '#FBBF24' : '#38BDF8'}
                strokeWidth={currentStageStep === 4 ? 4 : 2.5}
                strokeDasharray="8,5"
                className="animate-[dash_0.8s_linear_infinite]"
                filter="url(#glow-gold)"
                opacity="0.9"
              />

              {/* Path 4: Transmission Substation Transformer to MV Distribution */}
              <path
                d="M 910 240 L 960 270 L 1020 300 Q 1120 330 1210 365"
                fill="none"
                stroke={currentStageStep === 5 || currentStageStep === 6 ? '#FBBF24' : '#F59E0B'}
                strokeWidth={currentStageStep === 6 ? 3.5 : 2}
                strokeDasharray="6,4"
                className="animate-[dash_1.1s_linear_infinite]"
                filter="url(#glow-gold)"
                opacity="0.85"
              />

              {/* Path 5: MV Feeder into Industrial/Commercial Facilities */}
              <path
                d="M 1210 365 L 1290 410 Q 1340 435 1370 470"
                fill="none"
                stroke={currentStageStep === 7 || currentStageStep === 8 ? '#FBBF24' : '#10B981'}
                strokeWidth="2.2"
                strokeDasharray="5,4"
                className="animate-[dash_1.3s_linear_infinite]"
                opacity="0.85"
              />

              {/* Path 6: Low Voltage Branch into Final Loads */}
              <path
                d="M 1370 470 Q 1400 540 1430 630"
                fill="none"
                stroke={currentStageStep === 9 ? '#FBBF24' : '#10B981'}
                strokeWidth={currentStageStep === 9 ? 3.5 : 2}
                strokeDasharray="5,3"
                className="animate-[dash_1s_linear_infinite]"
                filter="url(#glow-gold)"
                opacity="0.9"
              />

              {/* Voltage & Electrical Overlay Badges in 'electrical' mode */}
              {viewMode === 'electrical' && (
                <g className="font-mono text-[10px] font-bold select-none">
                  {/* 225 kV Transmission */}
                  <rect x="630" y="195" width="80" height="20" rx="4" fill="#0A1626" stroke="#0284C7" strokeWidth="1" />
                  <text x="670" y="209" fill="#38BDF8" textAnchor="middle">225 kV THT</text>

                  {/* Substation Step-down */}
                  <rect x="860" y="195" width="105" height="20" rx="4" fill="#0A1626" stroke="#F59E0B" strokeWidth="1" />
                  <text x="912" y="209" fill="#FBBF24" textAnchor="middle">225 kV → 30 kV</text>

                  {/* 30 kV Distribution */}
                  <rect x="1080" y="295" width="75" height="20" rx="4" fill="#0A1626" stroke="#F59E0B" strokeWidth="1" />
                  <text x="1117" y="309" fill="#FBBF24" textAnchor="middle">30 kV HTA</text>

                  {/* 400 V Low Voltage */}
                  <rect x="1270" y="380" width="90" height="20" rx="4" fill="#0A1626" stroke="#10B981" strokeWidth="1" />
                  <text x="1315" y="394" fill="#34D399" textAnchor="middle">400 V / 230 V BT</text>
                </g>
              )}

              {/* Protection & Functional Overlays in 'functional' mode */}
              {viewMode === 'functional' && (
                <g className="font-mono text-[9px] font-bold select-none">
                  <rect x="230" y="110" width="110" height="18" rx="3" fill="#14090A" stroke="#EF4444" strokeWidth="1" />
                  <text x="285" y="122" fill="#FCA5A5" textAnchor="middle">ANSI 87G / 50/51</text>

                  <rect x="610" y="125" width="100" height="18" rx="3" fill="#14090A" stroke="#EF4444" strokeWidth="1" />
                  <text x="660" y="137" fill="#FCA5A5" textAnchor="middle">ANSI 21 (Distance)</text>

                  <rect x="810" y="135" width="90" height="18" rx="3" fill="#14090A" stroke="#EF4444" strokeWidth="1" />
                  <text x="855" y="147" fill="#FCA5A5" textAnchor="middle">ANSI 87T (Diff.)</text>

                  <rect x="1010" y="220" width="95" height="18" rx="3" fill="#14090A" stroke="#EF4444" strokeWidth="1" />
                  <text x="1057" y="232" fill="#FCA5A5" textAnchor="middle">ANSI 50N / 79</text>
                </g>
              )}
            </svg>
          )}

          {/* ========================================================================= */}
          {/* 4. THE 9 EXACT INTERACTIVE CALLOUT PINS OVER INFRASTRUCTURE (2D Mode only) */}
          {/* ========================================================================= */}
          {!is3DMode && callouts.map((pin) => {
            const isActive = activePinId === pin.id || currentStageStep === pin.stageStep;
            return (
              <div
                key={pin.id}
                onClick={() => handleSelectPin(pin)}
                className={`absolute flex items-center pl-[8px] rounded-[5px] cursor-pointer transition-all duration-200 z-20 ${
                  isActive
                    ? 'bg-[#0f2a3c]/95 border-2 border-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.5)] scale-105'
                    : 'bg-[#07111b]/95 border border-[#2a7fa6] shadow-[0_0_8px_rgba(40,140,200,0.25)] hover:border-amber-400 hover:scale-102'
                }`}
                style={{
                  left: `${pin.left}px`,
                  top: `${pin.top}px`,
                  width: `${pin.width}px`,
                  height: `${pin.height || 42}px`,
                }}
              >
                {/* Numbered Circle Badge */}
                <span
                  className={`shrink-0 w-[22px] h-[22px] rounded-full text-[12px] font-semibold flex items-center justify-center mr-[9px] ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold border border-amber-300'
                      : 'bg-[#1a73c4] border border-[#7fd0ff] text-white'
                  }`}
                >
                  {pin.badgeNumber}
                </span>

                {/* Title & Subtitle */}
                <div className="overflow-hidden pr-2">
                  <b className="block text-[14px] font-semibold leading-[17px] text-[#f2f5f8] whitespace-nowrap truncate">
                    {locale === 'fr' ? pin.titleFr : pin.titleEn}
                  </b>
                  <small className="block text-[11px] leading-[14px] text-[#b9c6d0] whitespace-nowrap truncate">
                    {locale === 'fr' ? pin.subFr : pin.subEn}
                  </small>
                </div>
              </div>
            );
          })}

          {/* ========================================================================= */}
          {/* 5. FLOATING HUD WHEN PLAYING JOURNEY                                      */}
          {/* ========================================================================= */}
          {isPlayingJourney && (
            <div className="absolute left-[360px] top-[104px] z-20 px-4 py-2 rounded-xl bg-[#08131d]/95 border border-amber-400 shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  {locale === 'fr' ? `ÉTAPE ${currentStageStep} / 9` : `STEP ${currentStageStep} OF 9`}
                </span>
              </div>
              <div className="w-[1px] h-4 bg-slate-700" />
              <div className="text-xs font-mono font-bold text-white">
                {locale === 'fr' ? currentStageInfo.nameFr : currentStageInfo.nameEn}
              </div>
              <div className="text-[11px] text-slate-300 max-w-[420px] truncate">
                {locale === 'fr' ? currentStageInfo.descFr : currentStageInfo.descEn}
              </div>
              <button
                type="button"
                onClick={() => setIsPlayingJourney(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. "THE COMPLETE JOURNEY" BANNER (#jr) (Left: 13px, Top: 714px)            */}
          {/* ========================================================================= */}
          <div
            id="jr"
            className="absolute left-[13px] top-[714px] w-[1082px] h-[120px] bg-gradient-to-r from-[#08131d] to-[#0a1a27] border border-[#1f5573] rounded-[6px] shadow-2xl z-20"
          >
            {/* Lightning Icon & Title */}
            <svg
              className="absolute left-[14px] top-[12px]"
              width="34"
              height="50"
              viewBox="0 0 38 56"
            >
              <polygon points="24,2 4,32 17,32 10,54 34,20 20,20" fill="#e9a93a" />
            </svg>
            <div className="absolute left-[64px] top-[12px] text-[17px] font-semibold tracking-[0.5px] text-white">
              <span className="font-bold">THE</span> COMPLETE JOURNEY
            </div>
            <p className="absolute left-[64px] top-[38px] w-[260px] text-[12px] leading-[18.5px] text-[#c5d0d9]">
              {locale === 'fr'
                ? 'Des sources naturelles jusqu\'au travail utile, l\'électricité traverse un écosystème complexe de production, transport, transformation, distribution et utilisation.'
                : 'From natural and fuel sources to the final load, electricity travels through a complex ecosystem of generation, transmission, transformation, distribution and utilization.'}
            </p>

            {/* Stepper Nodes */}
            {/* Node 1: Generation */}
            <div
              onClick={() => {
                setCurrentStageStep(1);
                handleSelectPin(callouts[0]);
              }}
              className={`absolute top-[24px] left-[373px] w-[66px] h-[66px] rounded-full border-[1.5px] flex items-center justify-center cursor-pointer transition-all ${
                currentStageStep === 1
                  ? 'border-amber-400 bg-[#0f2a3c] scale-110 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'border-[#39a9d6] bg-[#0b1f2e] hover:border-amber-400'
              }`}
            >
              <svg viewBox="0 0 34 34" className="w-[34px] h-[34px]">
                <path d="M6 24c4-10 10-14 14-14" stroke="#2a86b5" strokeWidth="3" fill="none" />
                <polygon points="20,4 10,19 17,19 14,30 25,14 18,14" fill="#39a9d6" stroke="none" />
              </svg>
            </div>
            <div className="absolute top-[96px] left-[346px] w-[120px] text-center text-[12.5px] text-[#e8eef3] font-medium">
              Generation
            </div>
            <div className="absolute top-[44px] left-[452px] text-[20px] text-[#5f7a8c]">→</div>

            {/* Node 2: Transmission */}
            <div
              onClick={() => {
                setCurrentStageStep(4);
                handleSelectPin(callouts[2]);
              }}
              className={`absolute top-[24px] left-[496px] w-[66px] h-[66px] rounded-full border-[1.5px] flex items-center justify-center cursor-pointer transition-all ${
                currentStageStep === 4
                  ? 'border-amber-400 bg-[#0f2a3c] scale-110 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'border-[#39a9d6] bg-[#0b1f2e] hover:border-amber-400'
              }`}
            >
              <svg viewBox="0 0 34 34" className="w-[34px] h-[34px] stroke-[#c9d3db] fill-none stroke-[1.4]">
                <path d="M17 3v28M11 31l6-28 6 28M9 11h16M11 19h12" />
              </svg>
            </div>
            <div className="absolute top-[96px] left-[474px] w-[120px] text-center text-[12.5px] text-[#e8eef3] font-medium">
              Transmission
            </div>
            <div className="absolute top-[44px] left-[578px] text-[20px] text-[#5f7a8c]">→</div>

            {/* Node 3: Substation */}
            <div
              onClick={() => {
                setCurrentStageStep(5);
                handleSelectPin(callouts[3]);
              }}
              className={`absolute top-[24px] left-[618px] w-[66px] h-[66px] rounded-full border-[1.5px] flex items-center justify-center cursor-pointer transition-all ${
                currentStageStep === 5
                  ? 'border-amber-400 bg-[#0f2a3c] scale-110 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'border-[#39a9d6] bg-[#0b1f2e] hover:border-amber-400'
              }`}
            >
              <svg viewBox="0 0 34 34" className="w-[34px] h-[34px] stroke-[#c9d3db] fill-none stroke-[1.4]">
                <path d="M6 29V12M12 29V10M18 29V12M24 29V10M30 29V12M3 29h28M6 12h6M18 12h6" />
              </svg>
            </div>
            <div className="absolute top-[96px] left-[592px] w-[120px] text-center text-[12.5px] text-[#e8eef3] font-medium">
              Substation
            </div>
            <div className="absolute top-[44px] left-[705px] text-[20px] text-[#5f7a8c]">→</div>

            {/* Node 4: Distribution */}
            <div
              onClick={() => {
                setCurrentStageStep(6);
                handleSelectPin(callouts[5]);
              }}
              className={`absolute top-[24px] left-[751px] w-[66px] h-[66px] rounded-full border-[1.5px] flex items-center justify-center cursor-pointer transition-all ${
                currentStageStep === 6
                  ? 'border-amber-400 bg-[#0f2a3c] scale-110 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'border-[#39a9d6] bg-[#0b1f2e] hover:border-amber-400'
              }`}
            >
              <svg viewBox="0 0 34 34" className="w-[34px] h-[34px] stroke-[#c9d3db] fill-none stroke-[1.4]">
                <circle cx="17" cy="7" r="3.5" />
                <circle cx="7" cy="25" r="3.5" />
                <circle cx="27" cy="25" r="3.5" />
                <circle cx="17" cy="17" r="2" />
                <path d="M17 10.5v4M9 22l6-4M25 22l-6-4" />
              </svg>
            </div>
            <div className="absolute top-[96px] left-[724px] w-[120px] text-center text-[12.5px] text-[#e8eef3] font-medium">
              Distribution
            </div>
            <div className="absolute top-[44px] left-[833px] text-[20px] text-[#5f7a8c]">→</div>

            {/* Node 5: Installation */}
            <div
              onClick={() => {
                setCurrentStageStep(8);
                handleSelectPin(callouts[7]);
              }}
              className={`absolute top-[24px] left-[877px] w-[66px] h-[66px] rounded-full border-[1.5px] flex items-center justify-center cursor-pointer transition-all ${
                currentStageStep === 8
                  ? 'border-amber-400 bg-[#0f2a3c] scale-110 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'border-[#39a9d6] bg-[#0b1f2e] hover:border-amber-400'
              }`}
            >
              <svg viewBox="0 0 34 34" className="w-[34px] h-[34px] stroke-[#c9d3db] fill-none stroke-[1.4]">
                <rect x="7" y="3" width="15" height="27" />
                <rect x="22" y="13" width="7" height="17" />
                <path d="M11 8h2M16 8h2M11 14h2M16 14h2M11 20h2M16 20h2" />
              </svg>
            </div>
            <div className="absolute top-[96px] left-[851px] w-[120px] text-center text-[12.5px] text-[#e8eef3] font-medium">
              Installation
            </div>
            <div className="absolute top-[44px] left-[958px] text-[20px] text-[#5f7a8c]">→</div>

            {/* Node 6: Final Load */}
            <div
              onClick={() => {
                setCurrentStageStep(9);
                handleSelectPin(callouts[8]);
              }}
              className={`absolute top-[24px] left-[998px] w-[66px] h-[66px] rounded-full border-[1.5px] flex items-center justify-center cursor-pointer transition-all ${
                currentStageStep === 9
                  ? 'border-amber-400 bg-[#0f2a3c] scale-110 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'border-[#39a9d6] bg-[#0b1f2e] hover:border-amber-400'
              }`}
            >
              <svg viewBox="0 0 34 34" className="w-[34px] h-[34px] stroke-[#c9d3db] fill-none stroke-[1.4]">
                <path d="M3 17L17 4l14 13M7 15v15h20V15M14 30v-9h6v9" />
              </svg>
            </div>
            <div className="absolute top-[96px] left-[972px] w-[120px] text-center text-[12.5px] text-[#e8eef3] font-medium">
              Final Load
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 7. BOTTOM 7 REAL PHOTOGRAPHIC THUMBNAIL CARDS (Top: 859px)               */}
          {/* ========================================================================= */}
          {/* 01 Generation */}
          <div
            onClick={() => handleSelectThumbnail(0, 'eq-hydro-dam-01', 1)}
            className={`absolute top-[859px] left-[14px] w-[162px] h-[122px] rounded-[4px] overflow-hidden border cursor-pointer transition-all ${
              activeThumbnailIndex === 0 || currentStageStep === 1
                ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102 z-20'
                : 'border-[#2a7fa6] hover:border-cyan-400'
            }`}
            style={{
              backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
              backgroundPosition: '-14px -859px',
              backgroundSize: '1536px 1024px',
            }}
          >
            <div className="absolute left-0 right-0 bottom-0 h-[26px] bg-[#06101a]/95 flex items-center text-[12px] text-white pl-[6px]">
              <span className="w-[19px] h-[19px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[9.5px] font-bold flex items-center justify-center mr-[6px]">
                01
              </span>
              <span>Generation</span>
              <span className="ml-auto mr-[6px] text-[14px] text-slate-400">›</span>
            </div>
          </div>

          {/* 02 Transmission */}
          <div
            onClick={() => handleSelectThumbnail(1, 'eq-transmission-line-03', 4)}
            className={`absolute top-[859px] left-[189px] w-[159px] h-[122px] rounded-[4px] overflow-hidden border cursor-pointer transition-all ${
              activeThumbnailIndex === 1 || currentStageStep === 4
                ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102 z-20'
                : 'border-[#2a7fa6] hover:border-cyan-400'
            }`}
            style={{
              backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
              backgroundPosition: '-189px -859px',
              backgroundSize: '1536px 1024px',
            }}
          >
            <div className="absolute left-0 right-0 bottom-0 h-[26px] bg-[#06101a]/95 flex items-center text-[12px] text-white pl-[6px]">
              <span className="w-[19px] h-[19px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[9.5px] font-bold flex items-center justify-center mr-[6px]">
                02
              </span>
              <span>Transmission</span>
              <span className="ml-auto mr-[6px] text-[14px] text-slate-400">›</span>
            </div>
          </div>

          {/* 03 Substation */}
          <div
            onClick={() => handleSelectThumbnail(2, 'eq-transmission-substation-04', 5)}
            className={`absolute top-[859px] left-[360px] w-[160px] h-[122px] rounded-[4px] overflow-hidden border cursor-pointer transition-all ${
              activeThumbnailIndex === 2 || currentStageStep === 5
                ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102 z-20'
                : 'border-[#2a7fa6] hover:border-cyan-400'
            }`}
            style={{
              backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
              backgroundPosition: '-360px -859px',
              backgroundSize: '1536px 1024px',
            }}
          >
            <div className="absolute left-0 right-0 bottom-0 h-[26px] bg-[#06101a]/95 flex items-center text-[12px] text-white pl-[6px]">
              <span className="w-[19px] h-[19px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[9.5px] font-bold flex items-center justify-center mr-[6px]">
                03
              </span>
              <span>Substation</span>
              <span className="ml-auto mr-[6px] text-[14px] text-slate-400">›</span>
            </div>
          </div>

          {/* 04 Distribution */}
          <div
            onClick={() => handleSelectThumbnail(3, 'eq-distribution-network-06', 6)}
            className={`absolute top-[859px] left-[533px] w-[159px] h-[122px] rounded-[4px] overflow-hidden border cursor-pointer transition-all ${
              activeThumbnailIndex === 3 || currentStageStep === 6
                ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102 z-20'
                : 'border-[#2a7fa6] hover:border-cyan-400'
            }`}
            style={{
              backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
              backgroundPosition: '-533px -859px',
              backgroundSize: '1536px 1024px',
            }}
          >
            <div className="absolute left-0 right-0 bottom-0 h-[26px] bg-[#06101a]/95 flex items-center text-[12px] text-white pl-[6px]">
              <span className="w-[19px] h-[19px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[9.5px] font-bold flex items-center justify-center mr-[6px]">
                04
              </span>
              <span>Distribution</span>
              <span className="ml-auto mr-[6px] text-[14px] text-slate-400">›</span>
            </div>
          </div>

          {/* 05 Transformer */}
          <div
            onClick={() => handleSelectThumbnail(4, 'eq-power-transformer-05', 5)}
            className={`absolute top-[859px] left-[704px] w-[159px] h-[122px] rounded-[4px] overflow-hidden border cursor-pointer transition-all ${
              activeThumbnailIndex === 4 || currentStageStep === 5
                ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102 z-20'
                : 'border-[#2a7fa6] hover:border-cyan-400'
            }`}
            style={{
              backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
              backgroundPosition: '-704px -859px',
              backgroundSize: '1536px 1024px',
            }}
          >
            <div className="absolute left-0 right-0 bottom-0 h-[26px] bg-[#06101a]/95 flex items-center text-[12px] text-white pl-[6px]">
              <span className="w-[19px] h-[19px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[9.5px] font-bold flex items-center justify-center mr-[6px]">
                05
              </span>
              <span>Transformer</span>
              <span className="ml-auto mr-[6px] text-[14px] text-slate-400">›</span>
            </div>
          </div>

          {/* 06 Installation */}
          <div
            onClick={() => handleSelectThumbnail(5, 'eq-installation-tgbt-08', 8)}
            className={`absolute top-[859px] left-[877px] w-[158px] h-[122px] rounded-[4px] overflow-hidden border cursor-pointer transition-all ${
              activeThumbnailIndex === 5 || currentStageStep === 8
                ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102 z-20'
                : 'border-[#2a7fa6] hover:border-cyan-400'
            }`}
            style={{
              backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
              backgroundPosition: '-877px -859px',
              backgroundSize: '1536px 1024px',
            }}
          >
            <div className="absolute left-0 right-0 bottom-0 h-[26px] bg-[#06101a]/95 flex items-center text-[12px] text-white pl-[6px]">
              <span className="w-[19px] h-[19px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[9.5px] font-bold flex items-center justify-center mr-[6px]">
                06
              </span>
              <span>Installation</span>
              <span className="ml-auto mr-[6px] text-[14px] text-slate-400">›</span>
            </div>
          </div>

          {/* 07 Final Load */}
          <div
            onClick={() => handleSelectThumbnail(6, 'eq-final-load-09', 9)}
            className={`absolute top-[859px] left-[1046px] w-[105px] h-[122px] rounded-[4px] overflow-hidden border cursor-pointer transition-all ${
              activeThumbnailIndex === 6 || currentStageStep === 9
                ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102 z-20'
                : 'border-[#2a7fa6] hover:border-cyan-400'
            }`}
            style={{
              backgroundImage: `url('/assets/electrical-energy-ecosystem.jpg')`,
              backgroundPosition: '-1046px -859px',
              backgroundSize: '1536px 1024px',
            }}
          >
            <div className="absolute left-0 right-0 bottom-0 h-[26px] bg-[#06101a]/95 flex items-center text-[12px] text-white pl-[6px]">
              <span className="w-[19px] h-[19px] rounded-full bg-[#1a73c4] border border-[#7fd0ff] text-[9.5px] font-bold flex items-center justify-center mr-[6px]">
                07
              </span>
              <span>Final Load</span>
              <span className="ml-auto mr-[6px] text-[14px] text-slate-400">›</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 8. CONTROLS BOX (.ctl) (Left: 1165px, Top: 858px, Width: 156px)           */}
          {/* ========================================================================= */}
          <div
            className="absolute left-[1165px] top-[858px] w-[156px] h-[124px] bg-[#08131d] border border-[#1f5573] rounded-[5px] z-20 shadow-xl"
          >
            {/* Play Journey Button (Gold) */}
            <button
              type="button"
              onClick={() => setIsPlayingJourney(!isPlayingJourney)}
              className="absolute left-[10px] top-[6px] w-[136px] h-[36px] rounded-[5px] bg-gradient-to-b from-[#e8b04a] to-[#c98f2b] border border-[#f2c56a] text-[#1a1204] font-medium text-[13px] flex items-center pl-[14px] cursor-pointer shadow-md hover:brightness-110 transition-all"
            >
              <svg className="w-[20px] h-[20px] mr-[12px] stroke-[#1a1204] fill-none stroke-[1.4]" viewBox="0 0 20 20">
                {isPlayingJourney ? (
                  <>
                    <rect x="6" y="5" width="3" height="10" fill="#1a1204" />
                    <rect x="11" y="5" width="3" height="10" fill="#1a1204" />
                  </>
                ) : (
                  <>
                    <circle cx="10" cy="10" r="8" />
                    <path d="M8 6l6 4-6 4z" fill="#1a1204" />
                  </>
                )}
              </svg>
              <span>{isPlayingJourney ? 'Pause' : 'Play Journey'}</span>
            </button>

            {/* Explore Mode Button */}
            <button
              type="button"
              onClick={() => {
                setIsPlayingJourney(false);
                setSelectedEquipment(null);
                setActivePinId(null);
              }}
              className="absolute left-[10px] top-[48px] w-[136px] h-[32px] rounded-[5px] border border-[#2a86b5] bg-[#0a1a27] hover:bg-[#0f2a3c] text-[#e8eef3] text-[12px] flex items-center pl-[14px] cursor-pointer transition-colors"
            >
              <svg className="w-[20px] h-[20px] mr-[12px] stroke-[#dfe6ec] fill-none stroke-[1.4]" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" />
                <path d="M6 14l2-6 6-2-2 6z" />
              </svg>
              <span>Explore Mode</span>
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="absolute left-[10px] top-[87px] w-[136px] h-[30px] rounded-[5px] border border-[#2a86b5] bg-[#0a1a27] hover:bg-[#0f2a3c] text-[#e8eef3] text-[12px] flex items-center pl-[14px] cursor-pointer transition-colors"
            >
              <svg className="w-[20px] h-[20px] mr-[12px] stroke-[#dfe6ec] fill-none stroke-[1.4]" viewBox="0 0 20 20">
                <path d="M4 10a6 6 0 116 6M4 10V5M4 10h5" />
              </svg>
              <span>Reset</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 9. VIEW MODE SELECTOR (.vm) (Left: 1333px, Top: 858px, Width: 188px)        */}
          {/* ========================================================================= */}
          <div
            className="absolute left-[1333px] top-[858px] w-[188px] h-[124px] bg-[#08131d] border border-[#1f5573] rounded-[5px] z-20 shadow-xl"
          >
            <div className="absolute left-[10px] top-[7px] text-[10.5px] text-[#e8eef3] font-bold uppercase tracking-wider">
              View Mode
            </div>

            {/* Physical Mode */}
            <button
              type="button"
              onClick={() => setViewMode('physical')}
              className={`absolute left-[9px] top-[25px] w-[167px] h-[29px] flex items-center text-[12px] pl-[14px] rounded-[4px] cursor-pointer transition-all ${
                viewMode === 'physical'
                  ? 'border border-[#2a86b5] bg-[#0f2a3c] text-white font-bold'
                  : 'text-[#e8eef3] hover:bg-[#0c1f2e]'
              }`}
            >
              <svg className={`w-[20px] h-[20px] mr-[12px] fill-none stroke-[1.4] ${viewMode === 'physical' ? 'stroke-[#33b6e8]' : 'stroke-[#c9d3db]'}`} viewBox="0 0 20 20">
                <path d="M10 2l7 4v8l-7 4-7-4V6zM3 6l7 4 7-4M10 10v8" />
              </svg>
              <span>Physical</span>
            </button>

            {/* Electrical Mode */}
            <button
              type="button"
              onClick={() => setViewMode('electrical')}
              className={`absolute left-[9px] top-[57px] w-[167px] h-[29px] flex items-center text-[12px] pl-[14px] rounded-[4px] cursor-pointer transition-all ${
                viewMode === 'electrical'
                  ? 'border border-[#2a86b5] bg-[#0f2a3c] text-white font-bold'
                  : 'text-[#e8eef3] hover:bg-[#0c1f2e]'
              }`}
            >
              <svg className={`w-[20px] h-[20px] mr-[12px] fill-none stroke-[1.4] ${viewMode === 'electrical' ? 'stroke-[#33b6e8]' : 'stroke-[#c9d3db]'}`} viewBox="0 0 20 20">
                <polygon points="12,2 5,11 10,11 8,18 15,8 10,8" />
              </svg>
              <span>Electrical</span>
            </button>

            {/* Functional Mode */}
            <button
              type="button"
              onClick={() => setViewMode('functional')}
              className={`absolute left-[9px] top-[89px] w-[167px] h-[29px] flex items-center text-[12px] pl-[14px] rounded-[4px] cursor-pointer transition-all ${
                viewMode === 'functional'
                  ? 'border border-[#2a86b5] bg-[#0f2a3c] text-white font-bold'
                  : 'text-[#e8eef3] hover:bg-[#0c1f2e]'
              }`}
            >
              <svg className={`w-[20px] h-[20px] mr-[12px] fill-none stroke-[1.4] ${viewMode === 'functional' ? 'stroke-[#33b6e8]' : 'stroke-[#c9d3db]'}`} viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="3" />
                <path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.5 4.5l2 2M13.5 13.5l2 2M4.5 15.5l2-2M13.5 6.5l2-2" />
              </svg>
              <span>Functional</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 10. HIGH-FIDELITY ENGINEERING DOSSIER MODAL ON PIN / EQUIPMENT CLICK     */}
      {/* ========================================================================= */}
      {selectedEquipment && (
        <EcosystemEquipmentModal
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
          locale={locale}
          viewMode={viewMode}
          onOpenInEpedeDomain={(domainCode, equipmentId) => {
            setSelectedEquipment(null);
            onNavigate({
              view: 'domain',
              domainCode: domainCode as any,
              equipmentId: equipmentId,
            });
          }}
          onOpenSimulation={() => {
            setSelectedEquipment(null);
            onNavigate({ view: 'simulation' });
          }}
          onOpenProtection={() => {
            setSelectedEquipment(null);
            onNavigate({ view: 'protection' });
          }}
          onOpenCalculator={() => {
            setSelectedEquipment(null);
            onNavigate({ view: 'calculators' });
          }}
        />
      )}
    </div>
  );
};
