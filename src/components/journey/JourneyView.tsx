// src/components/journey/JourneyView.tsx
import React, { useState, useEffect } from 'react';
import { 
  EcosystemHeaderToolbar 
} from './EcosystemHeaderToolbar';
import { ConceptualSystemSvg } from './ConceptualSystemSvg';
import { ElectricalSldSvg } from './ElectricalSldSvg';
import { PhysicalEngineeringSvg } from './PhysicalEngineeringSvg';
import { InteractiveHouseLamp } from './InteractiveHouseLamp';
import { LightningSimulationModal } from './LightningSimulationModal';
import { FaultScenariosModal } from './FaultScenariosModal';
import { GridStabilityLabModal } from './GridStabilityLabModal';
import { DisciplinesModal } from './DisciplinesModal';
import { PowerLossAnalysisModal } from './PowerLossAnalysisModal';
import { ProtectionCoordinationModal } from './ProtectionCoordinationModal';
import { BlackStartSequenceModal } from './BlackStartSequenceModal';
import { HarmonicDistortionModal } from './HarmonicDistortionModal';
import { EquipmentDrawer } from './EquipmentDrawer';
import { 
  ECOSYSTEM_STAGES, 
  ECOSYSTEM_EQUIPMENT 
} from './data/ecosystemData';
import { 
  StageId, 
  VisualizationLayer, 
  EcosystemEquipment 
} from './types';
import { Epede13ScenesJourney } from '../epede/Epede13ScenesJourney';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { InjectedCalculatorContext } from '../../services/routerService';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ShieldAlert, 
  Activity, 
  Info,
  Zap,
  X,
  RotateCcw
} from 'lucide-react';

interface JourneyViewProps {
  locale: 'fr' | 'en';
  initialStage?: StageId;
  onNavigateStandard?: (ref: string) => void;
  onNavigateEquipment?: (id: string) => void;
  onNavigateContextStack?: (nodeId?: string) => void;
  onNavigateView?: (view: string) => void;
  onNavigateCalculator?: (tab?: CalculatorTabType, context?: InjectedCalculatorContext) => void;
}

const STAGE_SPINE_MAPPING: Record<StageId, string> = {
  generation: 'node-gen-g1',
  switchyard: 'node-trafo-gsu',
  transmission: 'node-line-225-bekoko',
  substation: 'node-trafo-main-30',
  distribution: 'node-feeder-30-ind',
  consumption: 'node-tgbt-400',
};

export const JourneyView: React.FC<JourneyViewProps> = ({
  locale,
  initialStage,
  onNavigateStandard,
  onNavigateEquipment,
  onNavigateContextStack,
  onNavigateView,
  onNavigateCalculator,
}) => {
  // Primary Experience Mode: '13scenes' (Cinematic continuous journey) or 'lab' (Schematic SLD multi-layer lab)
  const [journeyMode, setJourneyMode] = useState<'13scenes' | 'lab'>('13scenes');

  // Navigation & Layer state
  const [activeStage, setActiveStage] = useState<StageId>(initialStage || 'generation');
  const [activeLayer, setActiveLayer] = useState<VisualizationLayer>('conceptual');
  const [isFlowActive, setIsFlowActive] = useState<boolean>(true);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1);
  const [isLampOn, setIsLampOn] = useState<boolean>(true);

  // Sync initialStage if passed from external navigation
  useEffect(() => {
    if (initialStage) {
      setActiveStage(initialStage);
    }
  }, [initialStage]);

  // Modals state
  const [isLightningModalOpen, setIsLightningModalOpen] = useState<boolean>(false);
  const [isFaultModalOpen, setIsFaultModalOpen] = useState<boolean>(false);
  const [isStabilityModalOpen, setIsStabilityModalOpen] = useState<boolean>(false);
  const [isDisciplinesModalOpen, setIsDisciplinesModalOpen] = useState<boolean>(false);
  const [isLossModalOpen, setIsLossModalOpen] = useState<boolean>(false);
  const [isProtectionModalOpen, setIsProtectionModalOpen] = useState<boolean>(false);
  const [isBlackStartModalOpen, setIsBlackStartModalOpen] = useState<boolean>(false);
  const [isHarmonicsModalOpen, setIsHarmonicsModalOpen] = useState<boolean>(false);

  // Upstream tracing state & step data
  const [isTracingUpstream, setIsTracingUpstream] = useState<boolean>(false);
  const [traceStepIndex, setTraceStepIndex] = useState<number>(0);

  // Drawer state
  const [selectedEquipment, setSelectedEquipment] = useState<EcosystemEquipment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Current stage object
  const stageData = ECOSYSTEM_STAGES.find((s) => s.id === activeStage) || ECOSYSTEM_STAGES[0];

  // Stage equipment list
  const allEquipments = Object.values(ECOSYSTEM_EQUIPMENT);
  const stageEquipments = allEquipments.filter((eq) => eq.stageId === activeStage);

  // Handler to open equipment drawer by ID or Tag
  const handleSelectEquipment = (equipmentIdOrTag: string) => {
    let eq = ECOSYSTEM_EQUIPMENT[equipmentIdOrTag];
    if (!eq) {
      eq = Object.values(ECOSYSTEM_EQUIPMENT).find(
        (e) =>
          e.tag.toLowerCase() === equipmentIdOrTag.toLowerCase() ||
          e.id.toLowerCase() === equipmentIdOrTag.toLowerCase() ||
          equipmentIdOrTag.toLowerCase().includes(e.id.toLowerCase())
      );
    }
    if (eq) {
      setSelectedEquipment(eq);
      setIsDrawerOpen(true);
      if (eq.stageId !== activeStage) {
        setActiveStage(eq.stageId);
      }
    }
  };

  // Upstream tracing handler:
  // Progressively walks backward from consumption up to generation
  const UPSTREAM_TRACE_STEPS = [
    {
      stage: 'consumption' as StageId,
      stepNum: '1/6',
      label: { fr: 'Maison & Tableau BT (230 V)', en: 'Domestic Circuit & Panel (230 V)' },
      physics: { 
        fr: 'Fermeture du contact : onde électromagnétique guidée par les conducteurs cuivre.',
        en: 'Switch contact closes: electromagnetic wave guided along copper conductors.' 
      },
      formula: 'i(t) = C · (du/dt) + u(t)/R',
      delayMs: 't = 0.00 ms',
    },
    {
      stage: 'distribution' as StageId,
      stepNum: '2/6',
      label: { fr: 'Réseau HTA/BT (400 V Dyn11)', en: 'Distribution Grid & MV/LV (400 V Dyn11)' },
      physics: { 
        fr: 'Le courant remonte le câble souterrain BT jusqu\'aux enroulements secondaires du transformateur.',
        en: 'Current flows up underground LV feeder into the secondary transformer windings.' 
      },
      formula: 'V_BT = (N_BT / N_HTA) · V_HTA',
      delayMs: 't = 0.05 ms',
    },
    {
      stage: 'substation' as StageId,
      stepNum: '3/6',
      label: { fr: 'Poste Source Répartiteur (225 kV / 30 kV)', en: 'Primary Substation (225 kV / 30 kV)' },
      physics: { 
        fr: 'Collecte par jeux de barres 30 kV et traversée du transformateur 40 MVA à régleur OLTC.',
        en: 'Collection across 30 kV busbars and passage through 40 MVA OLTC power transformer.' 
      },
      formula: 'P = √3 · U · I · cosφ',
      delayMs: 't = 0.20 ms',
    },
    {
      stage: 'transmission' as StageId,
      stepNum: '4/6',
      label: { fr: 'Ligne Très Haute Tension 225 kV', en: '225 kV EHV Transmission Corridor' },
      physics: { 
        fr: 'L\'énergie voyage à travers le corridor aérien sous forme de champ de Poynting à ~290 000 km/s.',
        en: 'Energy propagates through the overhead corridor via Poynting field at ~290,000 km/s.' 
      },
      formula: 'S = E × H  ·  (Rendement 97.5%)',
      delayMs: 't = 1.05 ms',
    },
    {
      stage: 'switchyard' as StageId,
      stepNum: '5/6',
      label: { fr: 'Poste Élévateur GSU 15 kV / 225 kV', en: '15 kV / 225 kV GSU Step-Up Switchyard' },
      physics: { 
        fr: 'Élévation de tension : la composante de courant se répercute côté 15 kV amplifiée par 15 (I_15kV = 15 × I_225kV).',
        en: 'Voltage step-up: current component reflects into 15 kV side multiplied by 15 (I_15kV = 15 × I_225kV).' 
      },
      formula: 'P_perte = 3 · R · I²',
      delayMs: 't = 1.22 ms',
    },
    {
      stage: 'generation' as StageId,
      stepNum: '6/6',
      label: { fr: 'Centrale Hydroélectrique & Turbine Francis', en: 'Hydro Dam & Francis Turbine' },
      physics: { 
        fr: 'Loi de Lenz : le couple résistant freine le rotor synchrone. Le régulateur ouvre les directrices pour injecter l\'eau !',
        en: 'Lenz\'s Law: counter-torque opposes rotor. Governor opens Francis wicket gates to admit water flow!' 
      },
      formula: 'ΔTe = ΔP / ωs  ⇒  ΔQ = ΔP / (ρ · g · H · η)',
      delayMs: 't = 1.25 ms (quasi-instantané)',
    },
  ];

  const handleTraceUpstream = () => {
    setIsTracingUpstream(true);
    setTraceStepIndex(0);
    setActiveStage('consumption');

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < UPSTREAM_TRACE_STEPS.length) {
        setTraceStepIndex(currentStep);
        setActiveStage(UPSTREAM_TRACE_STEPS[currentStep].stage);
      } else {
        clearInterval(interval);
      }
    }, 1800);
  };

  const handleStopTrace = () => {
    setIsTracingUpstream(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 font-sans">
      {/* Top Experience Mode Switcher Bar */}
      <div className="w-full bg-slate-950/95 border-b border-slate-800 px-4 py-3 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'LE PARCOURS DE L’ÉLECTRICITÉ • EXPÉRIENCE EPEDE' : 'THE POWER JOURNEY • EPEDE EXPERIENCE'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs">
            <button
              type="button"
              onClick={() => setJourneyMode('13scenes')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer ${
                journeyMode === '13scenes'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? '13 Scènes Immersives' : '13-Scene Journey'}</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-950/20 text-[9px] uppercase font-mono">
                {locale === 'fr' ? 'IMMERSION' : 'CINEMATIC'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setJourneyMode('lab')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 cursor-pointer ${
                journeyMode === 'lab'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Laboratoire Schématique & SLD' : 'Schematic Lab & SLD'}</span>
            </button>
          </div>
        </div>
      </div>

      {journeyMode === '13scenes' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Epede13ScenesJourney
            locale={locale}
            onNavigateView={(view) => {
              if (onNavigateView) {
                onNavigateView(view);
              } else {
                window.location.hash = '#' + view;
              }
            }}
          />
        </div>
      ) : (
        <div className="bg-[#F8FAFC] text-slate-900 min-h-screen">
          {/* 1. Header Toolbar */}
          <EcosystemHeaderToolbar
        locale={locale}
        activeStage={activeStage}
        onSelectStage={setActiveStage}
        activeLayer={activeLayer}
        onSelectLayer={setActiveLayer}
        isFlowActive={isFlowActive}
        onToggleFlow={() => setIsFlowActive(!isFlowActive)}
        animationSpeed={animationSpeed}
        onSetSpeed={setAnimationSpeed}
        onOpenLightningModal={() => setIsLightningModalOpen(true)}
        onOpenFaultModal={() => setIsFaultModalOpen(true)}
        onOpenStabilityModal={() => setIsStabilityModalOpen(true)}
        onOpenDisciplinesModal={() => setIsDisciplinesModalOpen(true)}
        onOpenLossModal={() => setIsLossModalOpen(true)}
        onOpenProtectionModal={() => setIsProtectionModalOpen(true)}
        onOpenBlackStartModal={() => setIsBlackStartModalOpen(true)}
        onOpenHarmonicsModal={() => setIsHarmonicsModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
        {/* 2. Interactive House Lamp & Upstream Mystery Hero */}
        <InteractiveHouseLamp
          locale={locale}
          isLampOn={isLampOn}
          onToggleLamp={() => setIsLampOn(!isLampOn)}
          onTraceUpstream={handleTraceUpstream}
          onJumpToStage={(stage) => setActiveStage(stage)}
        />

        {/* Active Upstream Trace Physics HUD */}
        {isTracingUpstream && (
          <div className="bg-white/95 border border-sky-200/90 rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
                </span>
                <span className="font-mono text-xs font-black text-sky-800 uppercase tracking-wider">
                  {locale === 'fr' 
                    ? `PROPAGATION DE L'ONDE ÉLECTROMAGNÉTIQUE · ÉTAPE ${UPSTREAM_TRACE_STEPS[traceStepIndex].stepNum}`
                    : `ELECTROMAGNETIC WAVE PROPAGATION · STEP ${UPSTREAM_TRACE_STEPS[traceStepIndex].stepNum}`}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                  {UPSTREAM_TRACE_STEPS[traceStepIndex].delayMs}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTraceUpstream}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs flex items-center gap-1 border border-slate-200"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{locale === 'fr' ? 'Recommencer' : 'Restart'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleStopTrace}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
                  title="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Stage Title and Physical Description */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 space-y-1">
                <h3 className="text-base sm:text-lg font-mono font-black text-slate-900 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>{UPSTREAM_TRACE_STEPS[traceStepIndex].label[locale]}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {UPSTREAM_TRACE_STEPS[traceStepIndex].physics[locale]}
                </p>
              </div>

              <div className="md:col-span-4 bg-slate-50 p-4 rounded-xl border border-sky-200/60 font-mono text-center">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">
                  {locale === 'fr' ? 'ÉQUATION PHYSIQUE DU NŒUD' : 'NODE PHYSICAL EQUATION'}
                </span>
                <span className="text-xs font-bold text-amber-700 tracking-wide">
                  {UPSTREAM_TRACE_STEPS[traceStepIndex].formula}
                </span>
              </div>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex border border-slate-200/60">
              {UPSTREAM_TRACE_STEPS.map((s, idx) => (
                <div
                  key={s.stage}
                  className={`h-full flex-1 transition-all duration-500 ${
                    idx <= traceStepIndex
                      ? 'bg-gradient-to-r from-sky-500 to-amber-500'
                      : 'bg-slate-100'
                  } ${idx > 0 ? 'border-l border-white' : ''}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. Main Multi-Layer Synchronized Visualizer Canvas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-700 uppercase">
                {locale === 'fr' ? 'REPRÉSENTATION SYNCHRONISÉE DU PARCOURS' : 'SYNCHRONIZED JOURNEY CANVAS'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 uppercase font-bold">
                {activeLayer === 'conceptual' 
                  ? (locale === 'fr' ? 'Vue Conceptuelle Globale' : 'Conceptual Flow')
                  : activeLayer === 'electrical'
                    ? (locale === 'fr' ? 'Unifilaire CEI / IEEE' : 'IEC Single-Line')
                    : (locale === 'fr' ? 'Coupe & Élévation CAD' : 'CAD Cross-Section')}
              </span>
            </div>

            <div className="text-xs font-mono text-slate-500 hidden sm:block">
              {locale === 'fr' ? 'Cliquez sur les icônes pour inspecter les équipements' : 'Click icons to inspect equipment'}
            </div>
          </div>

          {/* Conditional View Rendering based on activeLayer */}
          {activeLayer === 'conceptual' && (
            <ConceptualSystemSvg
              locale={locale}
              activeStage={activeStage}
              onSelectStage={setActiveStage}
              onSelectEquipment={handleSelectEquipment}
              isFlowActive={isFlowActive}
              animationSpeed={animationSpeed}
              isLampOn={isLampOn}
              onToggleLamp={() => setIsLampOn(!isLampOn)}
            />
          )}

          {activeLayer === 'electrical' && (
            <ElectricalSldSvg
              locale={locale}
              activeStage={activeStage}
              onSelectStage={setActiveStage}
              onSelectEquipment={handleSelectEquipment}
              isFlowActive={isFlowActive}
              animationSpeed={animationSpeed}
            />
          )}

          {activeLayer === 'physical' && (
            <PhysicalEngineeringSvg
              locale={locale}
              activeStage={activeStage}
              onSelectStage={setActiveStage}
              onSelectEquipment={handleSelectEquipment}
              isLampOn={isLampOn}
              onToggleLamp={() => setIsLampOn(!isLampOn)}
            />
          )}
        </div>

        {/* 4. Active Stage Detailed Engineering Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="h-7 px-2.5 rounded-lg bg-amber-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                  ÉTAPE {stageData.stepNumber ?? stageData.number} / 6
                </span>
                <span className="text-sm font-mono font-bold text-sky-700">
                  {stageData.voltageLevel ?? stageData.voltageRating}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                {stageData.title[locale]}
              </h2>
              <p className="text-sm text-slate-600 mt-1 font-sans">
                {stageData.description?.[locale] ?? stageData.subtitle[locale]}
              </p>
            </div>

            {/* Stage navigation buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {onNavigateContextStack && (
                <button
                  type="button"
                  onClick={() => onNavigateContextStack(STAGE_SPINE_MAPPING[activeStage])}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700 shadow-xs"
                >
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{locale === 'fr' ? 'Épine Dorsale & TCC' : 'Spine & TCC Stack'}</span>
                </button>
              )}

              <button
                type="button"
                disabled={(stageData.stepNumber ?? stageData.number) === 1}
                onClick={() => {
                  const currentNum = stageData.stepNumber ?? stageData.number;
                  const prevStage = ECOSYSTEM_STAGES.find((s) => s.number === currentNum - 1 || s.stepNumber === currentNum - 1);
                  if (prevStage) setActiveStage(prevStage.id);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 text-xs font-mono flex items-center gap-1.5 transition-colors border border-slate-200/80"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{locale === 'fr' ? 'Précédent' : 'Previous'}</span>
              </button>

              <button
                type="button"
                disabled={(stageData.stepNumber ?? stageData.number) === 6}
                onClick={() => {
                  const currentNum = stageData.stepNumber ?? stageData.number;
                  const nextStage = ECOSYSTEM_STAGES.find((s) => s.number === currentNum + 1 || s.stepNumber === currentNum + 1);
                  if (nextStage) setActiveStage(nextStage.id);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-mono font-bold disabled:opacity-40 text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{locale === 'fr' ? 'Étape Suivante' : 'Next Stage'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Technical Physics & Transformations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-800 uppercase flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-600" />
                <span>TRANSFORMATION ÉNERGÉTIQUE / PHYSIQUE</span>
              </span>
              <p className="text-xs text-slate-700 font-sans leading-relaxed">
                {stageData.physicsTransformation?.[locale] ?? stageData.transformationPrinciple?.[locale] ?? stageData.keyRole[locale]}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
              <span className="text-xs font-mono font-bold text-indigo-800 uppercase flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-600" />
                <span>DISCIPLINE & NORMES ASSOCIÉES</span>
              </span>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-slate-700">
                  <span className="text-slate-500">Médiation: </span>
                  <span className="text-emerald-700 font-bold">
                    {stageData.primaryDiscipline?.[locale] ?? (locale === 'fr' ? 'Génie Électrotechnique' : 'Electrical Engineering')}
                  </span>
                </div>
                <div className="text-slate-700">
                  <span className="text-slate-500">Standards: </span>
                  <span className="text-sky-700 font-medium">
                    {stageData.keyStandards ? stageData.keyStandards.join(' · ') : 'IEC 60034 · IEC 60076 · IEEE 80'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Grid for Current Stage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-700 uppercase">
                {locale === 'fr' ? 'ÉQUIPEMENTS CLÉS DU MAILLON (CLIQUER POUR INSPECTION COMPLÈTE)' : 'KEY LINK EQUIPMENT (CLICK TO INSPECT)'}
              </h3>
              <span className="text-xs font-mono text-amber-700 font-bold">
                {stageEquipments.length} {locale === 'fr' ? 'équipements documentés' : 'documented assets'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {stageEquipments.map((eq) => (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => handleSelectEquipment(eq.id)}
                  className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-md hover:bg-slate-50/50 text-left transition-all group flex flex-col justify-between space-y-3 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                        {eq.tag}
                      </span>
                      <span className="text-[10px] font-mono text-sky-700 font-semibold">
                        {eq.voltageLevel ?? ''}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold font-mono text-slate-900 group-hover:text-amber-700 transition-colors">
                      {eq.name[locale]}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-1 font-sans line-clamp-2">
                      {eq.shortDesc[locale]}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{eq.standards?.[0]?.code ?? 'IEC'}</span>
                    <span className="text-amber-600 font-bold group-hover:translate-x-0.5 transition-transform">
                      Fiche CEI →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Equipment Inspector Drawer */}
      <EquipmentDrawer
        locale={locale}
        equipment={selectedEquipment}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectAnotherEquipment={handleSelectEquipment}
        onNavigateStandard={onNavigateStandard}
        onNavigateCalculator={onNavigateCalculator}
      />

      {/* Interactive Simulation Modals */}
      <LightningSimulationModal
        locale={locale}
        isOpen={isLightningModalOpen}
        onClose={() => setIsLightningModalOpen(false)}
        onSelectEquipment={handleSelectEquipment}
      />

      <FaultScenariosModal
        locale={locale}
        isOpen={isFaultModalOpen}
        onClose={() => setIsFaultModalOpen(false)}
        onSelectEquipment={handleSelectEquipment}
      />

      <GridStabilityLabModal
        locale={locale}
        isOpen={isStabilityModalOpen}
        onClose={() => setIsStabilityModalOpen(false)}
      />

      <DisciplinesModal
        locale={locale}
        isOpen={isDisciplinesModalOpen}
        onClose={() => setIsDisciplinesModalOpen(false)}
      />

      <PowerLossAnalysisModal
        locale={locale}
        isOpen={isLossModalOpen}
        onClose={() => setIsLossModalOpen(false)}
      />

      <ProtectionCoordinationModal
        locale={locale}
        isOpen={isProtectionModalOpen}
        onClose={() => setIsProtectionModalOpen(false)}
        onSelectEquipment={handleSelectEquipment}
      />

      <BlackStartSequenceModal
        locale={locale}
        isOpen={isBlackStartModalOpen}
        onClose={() => setIsBlackStartModalOpen(false)}
        onJumpToStage={(stage) => setActiveStage(stage)}
      />

      <HarmonicDistortionModal
        locale={locale}
        isOpen={isHarmonicsModalOpen}
        onClose={() => setIsHarmonicsModalOpen(false)}
        onSelectEquipment={handleSelectEquipment}
      />
        </div>
      )}
    </div>
  );
};
