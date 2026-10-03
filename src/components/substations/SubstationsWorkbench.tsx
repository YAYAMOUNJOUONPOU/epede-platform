// src/components/substations/SubstationsWorkbench.tsx
// EPEDE D04 - Master Substation Engineering Workbench & 5-Stage Journey Orchestrator

import React, { useState } from 'react';
import {
  Zap,
  Layers,
  Activity,
  Sliders,
  Scale,
  ShieldAlert,
  ChevronRight,
  Calculator,
  Radio,
  Share2,
  FolderTree,
  Building2,
  Lock,
  Cpu,
  RefreshCw,
  Info,
  Flame,
  BatteryCharging,
  Target,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  MapPin,
  FileCheck,
  CheckCircle2,
  Sparkles,
  Award
} from 'lucide-react';
import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';
import {
  SubstationCommandHeader,
  type SubstationRepresentationView,
  type SubstationVoltageContext
} from './SubstationCommandHeader';
import { MasterSubstationJourney } from './MasterSubstationJourney';
import { SubstationBayArchitectureExplorer } from './SubstationBayArchitectureExplorer';
import { SubstationBusbarTopologyExplorer } from './SubstationBusbarTopologyExplorer';
import { PowerTransformerDeepDive } from './PowerTransformerDeepDive';
import { AisGisComparisonView } from './AisGisComparisonView';
import { SubstationProtectionZonesOverlay } from './SubstationProtectionZonesOverlay';
import { SubstationAuxiliarySystemsExplorer } from './SubstationAuxiliarySystemsExplorer';
import { SubstationEarthingSafetyViewer } from './SubstationEarthingSafetyViewer';
import { SubstationFireAndControlBuilding } from './SubstationFireAndControlBuilding';
import { SubstationScadaAutomationSystem } from './SubstationScadaAutomationSystem';
import { SubstationOperationsScenarios } from './SubstationOperationsScenarios';
import { SubstationEngineeringPrinciplesDrawer } from './SubstationEngineeringPrinciplesDrawer';
import { EngineeringInfographicCard } from '../common/EngineeringInfographicCard';
import { EngineeringInfographicsModal } from '../common/EngineeringInfographicsModal';

// Specialized Modules
import { CameroonSubstationGridNodesEngine } from './modules/CameroonSubstationGridNodesEngine';
import { SubstationDeliverablesExportEngine } from './modules/SubstationDeliverablesExportEngine';
import { SurgeArresterInsulationCoordinationSimulator } from './modules/SurgeArresterInsulationCoordinationSimulator';
import { HvDisconnectorKinematicsInterlockSimulator } from './modules/HvDisconnectorKinematicsInterlockSimulator';
import { OltcAvrParallelTransformersSimulator } from './modules/OltcAvrParallelTransformersSimulator';
import { DcAuxiliaryDualChargerGroundFaultSimulator } from './modules/DcAuxiliaryDualChargerGroundFaultSimulator';
import { Ieee485BatterySizingCalculator } from './modules/Ieee485BatterySizingCalculator';
import { StationServicesAtsEngine } from './modules/StationServicesAtsEngine';
import { DifferentialProtectionDualSlopeSaturationSimulator } from './modules/DifferentialProtectionDualSlopeSaturationSimulator';
import { NumericalDistanceProtectionRxSimulator } from './modules/NumericalDistanceProtectionRxSimulator';
import { ProcessBusMergingUnitNcitSimulator } from './modules/ProcessBusMergingUnitNcitSimulator';
import { Iec61850GoosePtpClockSimulator } from './modules/Iec61850GoosePtpClockSimulator';
import { GooseLatencyStormSimulator } from './modules/GooseLatencyStormSimulator';
import { SclConfigFileInspector } from './modules/SclConfigFileInspector';
import { SubstationSwitchingSequenceSimulator } from './modules/SubstationSwitchingSequenceSimulator';
import { BcuInterlockingAndBreakerFailureSimulator } from './modules/BcuInterlockingAndBreakerFailureSimulator';
import { TransformerFireContainmentDelugeSimulator } from './modules/TransformerFireContainmentDelugeSimulator';
import { SubstationBlackStartSimulator } from './modules/SubstationBlackStartSimulator';

// Central Reactive Data Mesh Store
import {
  useSubstationProjectStore,
  CAMEROON_SUBSTATION_NODES
} from './services/useSubstationProjectStore';

export type SubstationWorkbenchPillar =
  | 'JOURNEY'
  | 'BAYS'
  | 'TOPOLOGY'
  | 'TRANSFORMER'
  | 'AIS_GIS_COMPARE'
  | 'PROTECTION'
  | 'SCADA_SAS'
  | 'AUXILIARIES'
  | 'SAFETY_EARTHING'
  | 'BUILDING_FIRE'
  | 'SCENARIOS';

interface SubstationsWorkbenchProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (id: string) => void;
  onNavigate?: (view: string, domainCode?: string) => void;
}

export const SubstationsWorkbench: React.FC<SubstationsWorkbenchProps> = ({
  locale,
  onSelectEquipment,
  onNavigate
}) => {
  // 1. Reactive Central Data Store
  const store = useSubstationProjectStore('BEKOKO_225KV');

  // 2. Local UI Controllers
  const [activeView, setActiveView] = useState<SubstationRepresentationView>('PHYSICAL');
  const [selectedSubstationType, setSelectedSubstationType] = useState<string>('SUB_TRANS_AIS');
  const [isPrinciplesDrawerOpen, setIsPrinciplesDrawerOpen] = useState<boolean>(false);
  const [modalInfographicId, setModalInfographicId] = useState<string | null>(null);
  const [transformerInfographicTab, setTransformerInfographicTab] = useState<'how-a-transformer-works' | 'how-to-read-a-transformer-nameplate'>('how-a-transformer-works');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [sidebarSearch, setSidebarSearch] = useState<string>('');

  // Sub-Tab Navigation inside each Stage
  const [stage1Tab, setStage1Tab] = useState<'NODES' | 'JOURNEY' | 'AIS_GIS' | 'INSULATION'>('NODES');
  const [stage2Tab, setStage2Tab] = useState<'BAYS' | 'TOPOLOGY' | 'DISCONNECTOR_KINEMATICS'>('BAYS');
  const [stage3Tab, setStage3Tab] = useState<'TRANSFORMER' | 'PARALLEL_OLTC' | 'DC_AUXILIARY' | 'BATTERY_SIZING' | 'AC_ATS'>('TRANSFORMER');
  const [stage4Tab, setStage4Tab] = useState<'ZONES' | 'DIFF_87T' | 'DISTANCE_21' | 'PROCESS_BUS' | 'GOOSE_PTP' | 'SCL_INSPECTOR'>('ZONES');
  const [stage5Tab, setStage5Tab] = useState<'DOSSIER_BOQ' | 'SWITCHING_LOTO' | 'BCU_INTERLOCK' | 'EARTHING_IEEE80' | 'FIRE_CIVIL' | 'BLACK_START'>('DOSSIER_BOQ');

  return (
    <div className="space-y-6 font-mono">
      
      {/* 0. Authoritative Ecosystem Reference Hero (Page 3: Power Substation) */}
      <AuthoritativeEcosystemHero
        stage="substation"
        locale={locale}
        onNavigateToDomain={(dCode) => onNavigate?.('domain', dCode)}
        onSelectEquipment={onSelectEquipment}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
        activePillarLabel={
          store.activeStage === 1 ? (locale === 'fr' ? 'Étape 1 : Nœuds & AIS/GIS' : 'Stage 1: Nodes & AIS/GIS') :
          store.activeStage === 2 ? (locale === 'fr' ? 'Étape 2 : Travées & Barres' : 'Stage 2: Bays & Busbars') :
          store.activeStage === 3 ? (locale === 'fr' ? 'Étape 3 : Transfos & Auxiliaires' : 'Stage 3: Power Trafo & Aux') :
          store.activeStage === 4 ? (locale === 'fr' ? 'Étape 4 : Protections & CEI 61850' : 'Stage 4: Protection & IEC 61850') :
          (locale === 'fr' ? 'Étape 5 : Exploitation & Dossier SAT' : 'Stage 5: Operations & SAT Dossier')
        }
        totalPillarsCount={5}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-6">

        {/* SIDE ENGINEERING NAVIGATOR */}
        {isSidePanelOpen && (
          <aside className="w-full lg:w-80 shrink-0 space-y-4 font-mono text-xs animate-in slide-in-from-left duration-200">
            <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#222B38]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    {locale === 'fr' ? 'Parcours 5 Étapes' : '5-Stage Engineering'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidePanelOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title={locale === 'fr' ? 'Replier le volet' : 'Collapse side panel'}
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Node Indicator */}
              <div className="p-2.5 rounded-xl bg-[#0E141F] border border-amber-500/30 text-[11px] space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">{locale === 'fr' ? 'Nœud Actif' : 'Active Node'}</div>
                <div className="font-bold text-amber-300 truncate">{store.activeNode.name_fr.split('(')[0]}</div>
                <div className="text-[10px] text-slate-400">
                  {store.voltage} • {store.trafoCount * store.trafoMva} MVA • {store.scCurrentKa} kA
                </div>
              </div>

              {/* 5 Stages Navigation List */}
              <div className="space-y-1.5">
                {[
                  { stage: 1 as const, title_fr: '1. Nœuds & AIS/GIS', title_en: '1. Nodes & AIS/GIS', desc: 'Climat & Isolation' },
                  { stage: 2 as const, title_fr: '2. Travées & Barres', title_en: '2. Bays & Busbars', desc: 'Topologies & Forces' },
                  { stage: 3 as const, title_fr: '3. Transfos & Auxiliaires', title_en: '3. Power Trafo & Aux', desc: 'OLTC, DC 110V & ATS' },
                  { stage: 4 as const, title_fr: '4. Protections & CEI 61850', title_en: '4. Protection & IEC 61850', desc: '87T, 21, Process Bus' },
                  { stage: 5 as const, title_fr: '5. Exploitation & Dossier SAT', title_en: '5. Operations & SAT Dossier', desc: 'LOTO, IEEE 80 & DQE' }
                ].map((st) => {
                  const isSelected = store.activeStage === st.stage;
                  return (
                    <button
                      key={st.stage}
                      type="button"
                      onClick={() => store.setActiveStage(st.stage)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-xs'
                          : 'bg-[#0E141F]/80 border-[#222B38] text-slate-400 hover:bg-[#161B22] hover:text-slate-200'
                      }`}
                    >
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-slate-300'}`}>
                          {locale === 'fr' ? st.title_fr : st.title_en}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {st.desc}
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Direct Jump to BOQ & Principles */}
              <div className="pt-2 border-t border-[#222B38] space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    store.setActiveStage(5);
                    setStage5Tab('DOSSIER_BOQ');
                  }}
                  className="w-full p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Bordereau des Prix (DQE / BOQ)' : 'Bill of Quantities (BOQ)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPrinciplesDrawerOpen(true)}
                  className="w-full p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Formulaire Électrotechnique' : 'Formulas Drawer'}</span>
                </button>
              </div>

            </div>
          </aside>
        )}

        {/* MAIN WORKSPACE */}
        <main className="flex-1 min-w-0 space-y-5">
          {!isSidePanelOpen && (
            <button
              type="button"
              onClick={() => setIsSidePanelOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090D14] border border-[#222B38] hover:border-amber-500/50 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer shadow-md"
            >
              <PanelLeftOpen className="w-4 h-4 text-amber-400" />
              <span>{locale === 'fr' ? 'Ouvrir le Navigateur d’Ingénierie' : 'Open Engineering Navigator'}</span>
            </button>
          )}

          {/* 1. Master Substation Command Header */}
          <SubstationCommandHeader
            locale={locale}
            activeStage={store.activeStage}
            onSelectStage={(st) => store.setActiveStage(st)}
            activeView={activeView}
            onSelectView={setActiveView}
            selectedSubstationType={selectedSubstationType}
            onSelectSubstationType={setSelectedSubstationType}
            selectedVoltage={store.voltage}
            onSelectVoltage={(v) => store.setVoltage(v)}
            selectedNodeId={store.selectedNodeId}
            onSelectNode={(nodeId) => store.selectNode(nodeId)}
            onOpenPrinciplesDrawer={() => setIsPrinciplesDrawerOpen(true)}
            onOpenDossier={() => {
              store.setActiveStage(5);
              setStage5Tab('DOSSIER_BOQ');
            }}
            totalMva={store.projectMetrics.totalMva}
            scCurrentKa={store.scCurrentKa}
          />

          {/* 2. DYNAMIC STAGE WORKSPACE VIEW */}
          <div className="transition-all duration-200 space-y-6">

            {/* ========================================================
                STAGE 1: ÉCOSYSTÈME, NŒUDS RÉSEAU & TYPOLOGIES (AIS/GIS)
               ======================================================== */}
            {store.activeStage === 1 && (
              <div className="space-y-5">
                {/* Stage 1 Sub-Tab Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
                  <button
                    type="button"
                    onClick={() => setStage1Tab('NODES')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage1Tab === 'NODES'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '1. Nœuds de Transport Cameroun (SONATREL)' : '1. Cameroon Grid Nodes (SONATREL)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage1Tab('JOURNEY')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage1Tab === 'JOURNEY'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '2. Parcours Électrique (8 Étapes)' : '2. Electrical Journey (8 Steps)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage1Tab('AIS_GIS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage1Tab === 'AIS_GIS'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '3. Matrice Décisionnelle AIS vs GIS' : '3. AIS vs GIS Matrix'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage1Tab('INSULATION')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage1Tab === 'INSULATION'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '4. Coordination d’Isolement & Parafoudres' : '4. Insulation & Surge Arresters'}</span>
                  </button>
                </div>

                {stage1Tab === 'NODES' && (
                  <CameroonSubstationGridNodesEngine
                    locale={locale}
                    selectedNodeId={store.selectedNodeId}
                    onSelectNode={store.selectNode}
                    onNavigateToStage={(st) => store.setActiveStage(st)}
                  />
                )}

                {stage1Tab === 'JOURNEY' && (
                  <div className="space-y-6">
                    <EngineeringInfographicCard
                      infographicId="substation_overview"
                      locale={locale}
                      onOpenModal={(id) => setModalInfographicId(id)}
                    />
                    <MasterSubstationJourney
                      locale={locale}
                      activeView={activeView}
                      selectedVoltage={store.voltage as any}
                      onSelectEquipment={onSelectEquipment}
                    />
                  </div>
                )}

                {stage1Tab === 'AIS_GIS' && (
                  <AisGisComparisonView locale={locale} />
                )}

                {stage1Tab === 'INSULATION' && (
                  <SurgeArresterInsulationCoordinationSimulator locale={locale} />
                )}
              </div>
            )}

            {/* ========================================================
                STAGE 2: ARCHITECTURE DES TRAVÉES & TOPOLOGIES DE BARRES
               ======================================================== */}
            {store.activeStage === 2 && (
              <div className="space-y-5">
                {/* Stage 2 Sub-Tab Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
                  <button
                    type="button"
                    onClick={() => setStage2Tab('BAYS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage2Tab === 'BAYS'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '1. Architecture des Travées (Ligne, Transfo, Couplage)' : '1. Bay Architectures (Line, Trafo, Coupler)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage2Tab('TOPOLOGY')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage2Tab === 'TOPOLOGY'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <FolderTree className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '2. Topologies Barres (Simple, Double, 1½ CB)' : '2. Busbar Topologies (Single, Double, 1½ CB)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage2Tab('DISCONNECTOR_KINEMATICS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage2Tab === 'DISCONNECTOR_KINEMATICS'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '3. Cinématique Sectionneurs & Verrouillage MALT' : '3. Disconnector Kinematics & Interlocks'}</span>
                  </button>
                </div>

                {stage2Tab === 'BAYS' && (
                  <div className="space-y-6">
                    <EngineeringInfographicCard
                      infographicId="substation_components"
                      locale={locale}
                      onOpenModal={(id) => setModalInfographicId(id)}
                    />
                    <SubstationBayArchitectureExplorer
                      locale={locale}
                      onSelectEquipment={onSelectEquipment}
                    />
                  </div>
                )}

                {stage2Tab === 'TOPOLOGY' && (
                  <div className="space-y-6">
                    <EngineeringInfographicCard
                      infographicId="substation_sld"
                      locale={locale}
                      onOpenModal={(id) => setModalInfographicId(id)}
                    />
                    <SubstationBusbarTopologyExplorer locale={locale} />
                  </div>
                )}

                {stage2Tab === 'DISCONNECTOR_KINEMATICS' && (
                  <HvDisconnectorKinematicsInterlockSimulator locale={locale} />
                )}
              </div>
            )}

            {/* ========================================================
                STAGE 3: TRANSFORMATEURS DE PUISSANCE, OLTC & AUXILIAIRES
               ======================================================== */}
            {store.activeStage === 3 && (
              <div className="space-y-5">
                {/* Stage 3 Sub-Tab Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
                  <button
                    type="button"
                    onClick={() => setStage3Tab('TRANSFORMER')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage3Tab === 'TRANSFORMER'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '1. Transfo de Puissance (100 MVA & Plaque)' : '1. Power Transformer (100 MVA & Nameplate)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage3Tab('PARALLEL_OLTC')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage3Tab === 'PARALLEL_OLTC'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '2. Régleurs OLTC en Parallèle & Courant de Circulation' : '2. Parallel OLTC & Circulating Current'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage3Tab('DC_AUXILIARY')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage3Tab === 'DC_AUXILIARY'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <BatteryCharging className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '3. Auxiliaires DC 110V & Défaut d’Isolement' : '3. DC 110V Aux & Ground Fault'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage3Tab('BATTERY_SIZING')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage3Tab === 'BATTERY_SIZING'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '4. Dimensionnement Batteries IEEE 485' : '4. IEEE 485 Battery Sizing'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage3Tab('AC_ATS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage3Tab === 'AC_ATS'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '5. Inverseur Auxiliaires AC (ATS) & Groupe' : '5. AC Station ATS & Genset'}</span>
                  </button>
                </div>

                {stage3Tab === 'TRANSFORMER' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <button
                          type="button"
                          onClick={() => setTransformerInfographicTab('how-a-transformer-works')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            transformerInfographicTab === 'how-a-transformer-works'
                              ? 'bg-amber-400 text-slate-950 shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {locale === 'fr' ? '1. Principe & Induction (Faraday)' : '1. Faraday Induction & Core'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setTransformerInfographicTab('how-to-read-a-transformer-nameplate')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            transformerInfographicTab === 'how-to-read-a-transformer-nameplate'
                              ? 'bg-amber-400 text-slate-950 shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {locale === 'fr' ? '2. Plaque Signalétique (IEC 60076)' : '2. Nameplate Reading (IEC)'}
                        </button>
                      </div>

                      <EngineeringInfographicCard
                        infographicId={transformerInfographicTab}
                        locale={locale}
                        onOpenModal={(id) => setModalInfographicId(id)}
                      />
                    </div>
                    <PowerTransformerDeepDive
                      locale={locale}
                      onSelectEquipment={onSelectEquipment}
                    />
                  </div>
                )}

                {stage3Tab === 'PARALLEL_OLTC' && (
                  <OltcAvrParallelTransformersSimulator locale={locale} />
                )}

                {stage3Tab === 'DC_AUXILIARY' && (
                  <DcAuxiliaryDualChargerGroundFaultSimulator locale={locale} />
                )}

                {stage3Tab === 'BATTERY_SIZING' && (
                  <Ieee485BatterySizingCalculator locale={locale} />
                )}

                {stage3Tab === 'AC_ATS' && (
                  <StationServicesAtsEngine locale={locale} />
                )}
              </div>
            )}

            {/* ========================================================
                STAGE 4: PROTECTIONS NUMÉRIQUES & SOUS-STATION NUMÉRIQUE (CEI 61850)
               ======================================================== */}
            {store.activeStage === 4 && (
              <div className="space-y-5">
                {/* Stage 4 Sub-Tab Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
                  <button
                    type="button"
                    onClick={() => setStage4Tab('ZONES')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage4Tab === 'ZONES'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '1. Zones de Protection & Recouvrement TC' : '1. Protection Zones & CT Overlap'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage4Tab('DIFF_87T')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage4Tab === 'DIFF_87T'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '2. Différentielle Transfo 87T (Bi-pente & H2/H5)' : '2. 87T Differential (Dual-Slope & Harmonics)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage4Tab('DISTANCE_21')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage4Tab === 'DISTANCE_21'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '3. Protection de Distance 21 (Plan R-X Quad/Mho)' : '3. Distance 21 (R-X Plane Quad/Mho)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage4Tab('PROCESS_BUS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage4Tab === 'PROCESS_BUS'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '4. Process Bus & Merging Units (9-2LE)' : '4. Process Bus & Merging Units (9-2LE)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage4Tab('GOOSE_PTP')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage4Tab === 'GOOSE_PTP'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '5. Tempête GOOSE & Horloge PTP 1588' : '5. GOOSE Storm & PTP 1588 Clock'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage4Tab('SCL_INSPECTOR')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage4Tab === 'SCL_INSPECTOR'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '6. Fichiers SCL (SCD / ICD)' : '6. SCL Files (SCD / ICD)'}</span>
                  </button>
                </div>

                {stage4Tab === 'ZONES' && (
                  <div className="space-y-6">
                    <EngineeringInfographicCard
                      infographicId="substation_protection_zones"
                      locale={locale}
                      onOpenModal={(id) => setModalInfographicId(id)}
                    />
                    <SubstationProtectionZonesOverlay
                      locale={locale}
                      onSelectEquipment={onSelectEquipment}
                    />
                  </div>
                )}

                {stage4Tab === 'DIFF_87T' && (
                  <DifferentialProtectionDualSlopeSaturationSimulator locale={locale} />
                )}

                {stage4Tab === 'DISTANCE_21' && (
                  <NumericalDistanceProtectionRxSimulator locale={locale} />
                )}

                {stage4Tab === 'PROCESS_BUS' && (
                  <ProcessBusMergingUnitNcitSimulator locale={locale} />
                )}

                {stage4Tab === 'GOOSE_PTP' && (
                  <div className="space-y-6">
                    <Iec61850GoosePtpClockSimulator locale={locale} />
                    <GooseLatencyStormSimulator locale={locale} />
                  </div>
                )}

                {stage4Tab === 'SCL_INSPECTOR' && (
                  <SclConfigFileInspector locale={locale} />
                )}
              </div>
            )}

            {/* ========================================================
                STAGE 5: EXPLOITATION, SÉCURITÉ, INCENDIE & DOSSIER SAT (DQE)
               ======================================================== */}
            {store.activeStage === 5 && (
              <div className="space-y-5">
                {/* Stage 5 Sub-Tab Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
                  <button
                    type="button"
                    onClick={() => setStage5Tab('DOSSIER_BOQ')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage5Tab === 'DOSSIER_BOQ'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '1. Dossier d’Ingénierie & DQE (FCFA)' : '1. Engineering Dossier & BOQ (FCFA)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage5Tab('SWITCHING_LOTO')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage5Tab === 'SWITCHING_LOTO'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '2. Séquences de Manœuvres & LOTO' : '2. Switching Sequences & LOTO'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage5Tab('BCU_INTERLOCK')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage5Tab === 'BCU_INTERLOCK'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '3. Verrouillages BCU & Défaillance 50BF' : '3. BCU Interlocks & 50BF Breaker Failure'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage5Tab('EARTHING_IEEE80')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage5Tab === 'EARTHING_IEEE80'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '4. Réseau de Terre IEEE 80 & Tension Pas/Toucher' : '4. IEEE 80 Earthing Grid & Touch/Step'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage5Tab('FIRE_CIVIL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage5Tab === 'FIRE_CIVIL'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '5. Sécurité Incendie NFPA 15 & Bâtiment' : '5. NFPA 15 Fire Safety & Building'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage5Tab('BLACK_START')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage5Tab === 'BLACK_START'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '6. Restauration Réseau (Black-Start)' : '6. Grid Restoration (Black-Start)'}</span>
                  </button>
                </div>

                {stage5Tab === 'DOSSIER_BOQ' && (
                  <SubstationDeliverablesExportEngine
                    locale={locale}
                    selectedNodeId={store.selectedNodeId}
                    voltage={store.voltage}
                    tech={store.tech}
                    trafoMva={store.trafoMva}
                    trafoCount={store.trafoCount}
                    scCurrentKa={store.scCurrentKa}
                    projectMetrics={store.projectMetrics}
                  />
                )}

                {stage5Tab === 'SWITCHING_LOTO' && (
                  <div className="space-y-6">
                    <SubstationSwitchingSequenceSimulator locale={locale} />
                    <SubstationOperationsScenarios
                      locale={locale}
                      onSelectEquipment={onSelectEquipment}
                    />
                  </div>
                )}

                {stage5Tab === 'BCU_INTERLOCK' && (
                  <BcuInterlockingAndBreakerFailureSimulator locale={locale} />
                )}

                {stage5Tab === 'EARTHING_IEEE80' && (
                  <div className="space-y-6">
                    <EngineeringInfographicCard
                      infographicId="substation_ground_grid"
                      locale={locale}
                      onOpenModal={(id) => setModalInfographicId(id)}
                    />
                    <SubstationEarthingSafetyViewer locale={locale} />
                  </div>
                )}

                {stage5Tab === 'FIRE_CIVIL' && (
                  <div className="space-y-6">
                    <TransformerFireContainmentDelugeSimulator locale={locale} />
                    <SubstationFireAndControlBuilding locale={locale} />
                  </div>
                )}

                {stage5Tab === 'BLACK_START' && (
                  <SubstationBlackStartSimulator locale={locale} />
                )}
              </div>
            )}

          </div>

        </main>
      </div>

      {/* 4. Mathematical Engineering Principles Drawer */}
      <SubstationEngineeringPrinciplesDrawer
        isOpen={isPrinciplesDrawerOpen}
        onClose={() => setIsPrinciplesDrawerOpen(false)}
        locale={locale}
      />

      {/* 5. Fullscreen Engineering Infographics Modal */}
      {modalInfographicId && (
        <EngineeringInfographicsModal
          isOpen={!!modalInfographicId}
          onClose={() => setModalInfographicId(null)}
          initialInfographicId={modalInfographicId}
          locale={locale}
        />
      )}
    </div>
  );
};
