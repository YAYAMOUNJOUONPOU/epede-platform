// src/components/journey/JourneyView.tsx
// EPEDE 2.0 - 9-Stage Electrical Systems Journey View
// Conforms to SITEWIDE-REDESIGN.md and HOMEPAGE-EXACT-MATCH.md porcelain-and-navy specification.

import React, { useState } from 'react';
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
import { NineStagePowerGridExplorer } from './NineStagePowerGridExplorer';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { InjectedCalculatorContext } from '../../services/routerService';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  Zap,
  X,
  RotateCcw
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { DataStrip } from '../common/DataStrip';
import { FinalCTA } from '../common/FinalCTA';

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
  // Primary Experience Mode: '9stages' (Core EPEDE 2.0 9-stage explorer), '13scenes' (Cinematic continuous journey), or 'lab' (Schematic SLD multi-layer lab)
  const [journeyMode, setJourneyMode] = useState<'9stages' | '13scenes' | 'lab'>('9stages');

  // Navigation & Layer state
  const [activeStage, setActiveStage] = useState<StageId>(initialStage || 'generation');
  const [activeLayer, setActiveLayer] = useState<VisualizationLayer>('electrical');
  const [isFlowActive, setIsFlowActive] = useState<boolean>(true);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1);
  const [isLampOn, setIsLampOn] = useState<boolean>(false);

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

  const isFr = locale === 'fr';

  return (
    <div className="min-h-screen bg-[#FBFCFD] text-[#0B1B2B] flex flex-col font-['Space_Grotesk',sans-serif]">
      {/* 1. Page Header (SITEWIDE-REDESIGN.md Section 2) */}
      <PageHeader
        breadcrumb={[
          { label: isFr ? 'Accueil' : 'Home', onClick: () => onNavigateView?.('home') },
          { label: isFr ? 'Systèmes Électriques' : 'Electrical Systems' },
          { label: isFr ? 'Chaîne de Puissance' : 'Power Chain' },
        ]}
        eyebrow={isFr ? 'LE PARCOURS SYSTÈME · 9 ÉTAPES' : 'THE SYSTEM JOURNEY · 9 STAGES'}
        title={
          isFr
            ? 'De la centrale hydroélectrique jusqu’à la charge finale'
            : 'From hydroelectric turbine to the final load'
        }
        intro={
          isFr
            ? 'Parcourez les 9 étapes physiques du réseau électrique, inspectez les 13 scènes immersives ou basculez dans le laboratoire schématique unifilaire CEI.'
            : 'Step through the 9 physical stages of the power system, explore the 13-scene visual narrative, or switch into the multi-layer IEC single-line schematic lab.'
        }
      >
        <DataStrip
          items={[
            {
              label: isFr ? 'Étapes Physiques' : 'Physical Stages',
              value: '09',
              subtext: isFr ? 'De la production à la consommation' : 'From generation to end-users',
            },
            {
              label: isFr ? 'Plage de Tension' : 'Voltage Span',
              value: '0.7 → 225',
              unit: 'kV',
              subtext: 'LV · MV · HV Transmission',
            },
            {
              label: isFr ? 'Fréquence Réseau' : 'Grid Frequency',
              value: '50.00',
              unit: 'Hz',
              subtext: isFr ? 'Réseau synchrone' : 'Synchronous grid',
            },
            {
              label: isFr ? 'Corridor Réseau' : 'Transmission Corridor',
              value: 'RIS / RIN',
              subtext: 'SONATREL National Backbone',
            },
          ]}
        />
      </PageHeader>

      {/* Main Container */}
      <main id="main-content" className="flex-1 max-w-[1360px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-10">
        {/* Experience Mode Switcher Pills */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div
            role="tablist"
            aria-label={isFr ? 'Mode de parcours' : 'Journey view mode'}
            className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-[#EEF4F8] border border-[#D5E0E8] rounded-full font-mono text-xs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={journeyMode === '9stages'}
              onClick={() => setJourneyMode('9stages')}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 cursor-pointer border-0 ${
                journeyMode === '9stages'
                  ? 'bg-[#0B1B2B] text-[#FBFCFD] shadow-xs'
                  : 'bg-transparent text-[#5B6B7B] hover:text-[#0B1B2B]'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-[#F2A541]" />
              <span>{isFr ? '9 Étapes (01–09)' : '9 Stages (01–09)'}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={journeyMode === 'lab'}
              onClick={() => setJourneyMode('lab')}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 cursor-pointer border-0 ${
                journeyMode === 'lab'
                  ? 'bg-[#0B1B2B] text-[#FBFCFD] shadow-xs'
                  : 'bg-transparent text-[#5B6B7B] hover:text-[#0B1B2B]'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-[#1F5FAE]" />
              <span>{isFr ? 'Schéma & SLD Multi-Couches' : 'Multi-Layer Schematic & SLD'}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={journeyMode === '13scenes'}
              onClick={() => setJourneyMode('13scenes')}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 cursor-pointer border-0 ${
                journeyMode === '13scenes'
                  ? 'bg-[#0B1B2B] text-[#FBFCFD] shadow-xs'
                  : 'bg-transparent text-[#5B6B7B] hover:text-[#0B1B2B]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#F2A541]" />
              <span>{isFr ? '13 Scènes Narratives' : '13-Scene Narrative'}</span>
            </button>
          </div>
        </div>

        {/* View Mode Rendering */}
        {journeyMode === '9stages' ? (
          <NineStagePowerGridExplorer
            locale={locale}
            initialStageId={activeStage}
            onSelectStage={(st) => {
              setActiveStage(st.journeyStage);
            }}
            onSelectEquipment={(eqId) => {
              if (onNavigateEquipment) {
                onNavigateEquipment(eqId);
              } else {
                handleSelectEquipment(eqId);
              }
            }}
            onNavigateView={(view) => {
              if (onNavigateView) {
                onNavigateView(view);
              } else {
                window.location.hash = '#' + view;
              }
            }}
          />
        ) : journeyMode === '13scenes' ? (
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
        ) : (
          <div className="bg-[#FBFCFD] border border-[#D5E0E8] rounded-[6px] p-5 sm:p-8 space-y-8 shadow-[0_4px_24px_rgba(11,27,43,0.04)]">
            {/* Header Toolbar */}
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

            {/* Interactive House Lamp & Upstream Mystery Hero */}
            <InteractiveHouseLamp
              locale={locale}
              isLampOn={isLampOn}
              onToggleLamp={() => setIsLampOn(!isLampOn)}
              onTraceUpstream={handleTraceUpstream}
              onJumpToStage={(stage) => setActiveStage(stage)}
            />

            {/* Active Upstream Trace Physics HUD */}
            {isTracingUpstream && (
              <div className="bg-[#EEF4F8] border border-[#D5E0E8] rounded-[6px] p-5 sm:p-6 shadow-sm space-y-4 relative overflow-hidden animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D5E0E8] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1F5FAE] opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1F5FAE]" />
                    </span>
                    <span className="font-mono text-xs font-bold text-[#0B1B2B] uppercase tracking-wider">
                      {isFr 
                        ? `PROPAGATION DE L'ONDE ÉLECTROMAGNÉTIQUE · ÉTAPE ${UPSTREAM_TRACE_STEPS[traceStepIndex].stepNum}`
                        : `ELECTROMAGNETIC WAVE PROPAGATION · STEP ${UPSTREAM_TRACE_STEPS[traceStepIndex].stepNum}`}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-[3px] bg-[#FBFCFD] text-[#1F5FAE] border border-[#D5E0E8]">
                      {UPSTREAM_TRACE_STEPS[traceStepIndex].delayMs}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTraceUpstream}
                      className="px-2.5 py-1 rounded-[4px] bg-[#FBFCFD] hover:bg-[#EEF4F8] text-[#0B1B2B] font-mono text-xs flex items-center gap-1 border border-[#D5E0E8] cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>{isFr ? 'Recommencer' : 'Restart'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleStopTrace}
                      className="p-1 rounded-[4px] bg-[#FBFCFD] hover:bg-[#EEF4F8] text-[#5B6B7B] hover:text-[#0B1B2B] border border-[#D5E0E8] cursor-pointer"
                      title={isFr ? 'Fermer' : 'Close'}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Stage Title and Physical Description */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8 space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#0B1B2B] flex items-center gap-2 m-0 font-['Space_Grotesk']">
                      <Zap className="h-4 w-4 text-[#F2A541]" />
                      <span>{UPSTREAM_TRACE_STEPS[traceStepIndex].label[locale]}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-[#3A4B5C] leading-relaxed m-0 font-['Space_Grotesk']">
                      {UPSTREAM_TRACE_STEPS[traceStepIndex].physics[locale]}
                    </p>
                  </div>

                  <div className="md:col-span-4 bg-[#FBFCFD] p-3.5 rounded-[4px] border border-[#D5E0E8] font-mono text-center">
                    <span className="text-[10px] text-[#5B6B7B] uppercase block mb-1">
                      {isFr ? 'ÉQUATION PHYSIQUE DU NŒUD' : 'NODE PHYSICAL EQUATION'}
                    </span>
                    <span className="text-xs font-bold text-[#1F5FAE] tracking-wide">
                      {UPSTREAM_TRACE_STEPS[traceStepIndex].formula}
                    </span>
                  </div>
                </div>

                {/* Step Progress Bar */}
                <div className="w-full bg-[#D5E0E8] h-1.5 rounded-full overflow-hidden flex">
                  {UPSTREAM_TRACE_STEPS.map((s, idx) => (
                    <div
                      key={s.stage}
                      className={`h-full flex-1 transition-all duration-500 ${
                        idx <= traceStepIndex ? 'bg-[#F2A541]' : 'bg-[#D5E0E8]'
                      } ${idx > 0 ? 'border-l border-white' : ''}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Main Multi-Layer Synchronized Visualizer Canvas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#0B1B2B] uppercase">
                    {isFr ? 'REPRÉSENTATION SYNCHRONISÉE DU PARCOURS' : 'SYNCHRONIZED JOURNEY CANVAS'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-[#EEF4F8] text-[#1F5FAE] border border-[#D5E0E8] uppercase font-bold">
                    {activeLayer === 'conceptual' 
                      ? (isFr ? 'Vue Conceptuelle Globale' : 'Conceptual Flow')
                      : activeLayer === 'electrical'
                        ? (isFr ? 'Unifilaire CEI / IEEE' : 'IEC Single-Line')
                        : (isFr ? 'Coupe & Élévation CAD' : 'CAD Cross-Section')}
                  </span>
                </div>

                <div className="text-xs font-mono text-[#5B6B7B] hidden sm:block">
                  {isFr ? 'Cliquez sur les icônes pour inspecter les équipements' : 'Click icons to inspect equipment'}
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

            {/* Active Stage Detailed Engineering Card */}
            <div className="bg-[#FBFCFD] border border-[#D5E0E8] rounded-[6px] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D5E0E8] pb-5">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5 font-mono text-xs">
                    <span className="px-2.5 py-0.5 rounded-[3px] bg-[#0B1B2B] text-[#FBFCFD] font-bold">
                      ÉTAPE {stageData.stepNumber ?? stageData.number} / 6
                    </span>
                    <span className="font-bold text-[#1F5FAE]">
                      {stageData.voltageLevel ?? stageData.voltageRating}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B2B] font-['Space_Grotesk'] m-0">
                    {stageData.title[locale]}
                  </h2>
                  <p className="text-sm text-[#3A4B5C] mt-1 font-['Space_Grotesk'] m-0">
                    {stageData.description?.[locale] ?? stageData.subtitle[locale]}
                  </p>
                </div>

                {/* Stage navigation buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {onNavigateContextStack && (
                    <button
                      type="button"
                      onClick={() => onNavigateContextStack(STAGE_SPINE_MAPPING[activeStage])}
                      className="px-3.5 py-1.5 rounded-full bg-[#0B1B2B] hover:bg-[#1F5FAE] text-[#FBFCFD] font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border-0"
                    >
                      <Zap className="h-3.5 w-3.5 text-[#F2A541]" />
                      <span>{isFr ? 'Épine Dorsale & TCC' : 'Spine & TCC Stack'}</span>
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
                    className="px-3.5 py-1.5 rounded-full bg-[#FBFCFD] hover:bg-[#EEF4F8] text-[#0B1B2B] disabled:opacity-30 text-xs font-mono flex items-center gap-1.5 transition-colors border border-[#D5E0E8] cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{isFr ? 'Précédent' : 'Previous'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={(stageData.stepNumber ?? stageData.number) === 6}
                    onClick={() => {
                      const currentNum = stageData.stepNumber ?? stageData.number;
                      const nextStage = ECOSYSTEM_STAGES.find((s) => s.number === currentNum + 1 || s.stepNumber === currentNum + 1);
                      if (nextStage) setActiveStage(nextStage.id);
                    }}
                    className="px-4 py-1.5 rounded-full bg-[#0B1B2B] hover:bg-[#1F5FAE] text-[#FBFCFD] font-mono font-bold disabled:opacity-30 text-xs flex items-center gap-1.5 transition-colors cursor-pointer border-0"
                  >
                    <span>{isFr ? 'Étape Suivante' : 'Next Stage'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Technical Physics & Transformations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-[4px] bg-[#EEF4F8] border border-[#D5E0E8] space-y-1.5">
                  <span className="text-xs font-mono font-bold text-[#0B1B2B] uppercase flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-[#F2A541]" />
                    <span>TRANSFORMATION ÉNERGÉTIQUE / PHYSIQUE</span>
                  </span>
                  <p className="text-xs text-[#3A4B5C] font-['Space_Grotesk'] leading-relaxed m-0">
                    {stageData.physicsTransformation?.[locale] ?? stageData.transformationPrinciple?.[locale] ?? stageData.keyRole[locale]}
                  </p>
                </div>

                <div className="p-4 rounded-[4px] bg-[#EEF4F8] border border-[#D5E0E8] space-y-1.5">
                  <span className="text-xs font-mono font-bold text-[#0B1B2B] uppercase flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-[#1F5FAE]" />
                    <span>DISCIPLINE & NORMES ASSOCIÉES</span>
                  </span>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="text-[#3A4B5C]">
                      <span className="text-[#5B6B7B]">Médiation: </span>
                      <span className="text-[#0B1B2B] font-bold">
                        {stageData.primaryDiscipline?.[locale] ?? (isFr ? 'Génie Électrotechnique' : 'Electrical Engineering')}
                      </span>
                    </div>
                    <div className="text-[#3A4B5C]">
                      <span className="text-[#5B6B7B]">Standards: </span>
                      <span className="text-[#1F5FAE] font-medium">
                        {stageData.keyStandards ? stageData.keyStandards.join(' · ') : 'IEC 60034 · IEC 60076 · IEEE 80'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Equipment Grid for Current Stage */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-[#0B1B2B] uppercase m-0">
                    {isFr ? 'ÉQUIPEMENTS CLÉS DU MAILLON' : 'KEY LINK APPARATUS'}
                  </h3>
                  <span className="text-xs font-mono text-[#1F5FAE] font-bold">
                    {stageEquipments.length} {isFr ? 'équipements documentés' : 'documented assets'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {stageEquipments.map((eq) => (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => handleSelectEquipment(eq.id)}
                      className="p-3.5 rounded-[4px] bg-[#FBFCFD] border border-[#D5E0E8] hover:border-[#1F5FAE] hover:shadow-xs text-left transition-all group flex flex-col justify-between space-y-3 cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#EEF4F8] text-[#1F5FAE] font-bold border border-[#D5E0E8]">
                            {eq.tag}
                          </span>
                          <span className="text-[10px] font-mono text-[#5B6B7B] font-medium">
                            {eq.voltageLevel ?? ''}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#0B1B2B] group-hover:text-[#1F5FAE] transition-colors m-0 font-['Space_Grotesk']">
                          {eq.name[locale]}
                        </h4>
                        <p className="text-[11px] text-[#5B6B7B] mt-1 line-clamp-2 m-0 font-['Space_Grotesk']">
                          {eq.shortDesc[locale]}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#D5E0E8] flex items-center justify-between text-[10px] font-mono text-[#5B6B7B]">
                        <span>{eq.standards?.[0]?.code ?? 'IEC'}</span>
                        <span className="text-[#1F5FAE] font-bold group-hover:translate-x-0.5 transition-transform">
                          Fiche CEI →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

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

      {/* Bottom Final CTA (Navy Section with radial amber glow) */}
      <FinalCTA
        eyebrow={isFr ? 'PLATEFORME D’INGÉNIERIE ÉLECTROTECHNIQUE' : 'EPEDE POWER ENGINEERING PLATFORM'}
        title={isFr ? 'Visualisez chaque liaison. Maîtrisez le système.' : 'See every connection. Master the system.'}
        description={
          isFr
            ? 'De la centrale hydroélectrique 225 kV aux armoires de distribution industrielle basse tension. Conçu pour les ingénieurs électriciens et réseaux.'
            : 'From 225 kV hydroelectric generation to low-voltage industrial switchboards. Engineered for electrical and power systems practitioners.'
        }
        primaryAction={{
          label: isFr ? 'Ouvrir les Calculateurs CEI' : 'Open IEC Solvers',
          onClick: () => onNavigateCalculator?.('cable-ampacity'),
        }}
        secondaryAction={{
          label: isFr ? 'Explorer le Réseau Camerounais' : 'Explore Cameroon Grid',
          onClick: () => onNavigateView?.('cameroon-grid'),
        }}
      />
    </div>
  );
};
