// src/components/production/EnergyProductionMainView.tsx
// EPEDE D01 - Energy Resources & Generation Master Engineering Workbench & 5-Stage Journey Orchestrator

import React, { useState, Suspense, lazy } from 'react';
import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';
import {
  Waves,
  Sun,
  Wind,
  Flame,
  TreePine,
  Zap,
  TrendingUp,
  Layers,
  Sliders,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Activity,
  Shield,
  ShieldAlert,
  ShieldCheck,
  FileText,
  FileCheck,
  Building2,
  Compass,
  Gauge,
  Info,
  Maximize2,
  Calendar,
  RotateCw,
  Power,
  ChevronRight,
  Award
} from 'lucide-react';

// Data Registries
import { PRODUCTION_MAJOR_SECTIONS } from './data/productionSectionsData';
import { HYDRO_PROCESS_STAGES, HYDRO_EQUIPMENT_MAP } from './data/hydropowerData';
import { HYDRO_PLANT_TYPES, HYDRO_TURBINES } from './data/turbinePlantData';
import { GENERATOR_PROTECTION_MATRIX } from './data/protectionData';
import { CAMEROON_GENERATION_FLEET, type CameroonPowerPlant } from './data/cameroonGenerationFleet';

// Sub-components & Specialized Labs
import { GenerationCommandHeader } from './GenerationCommandHeader';
import { GenerationOrientationBanner } from './GenerationOrientationBanner';
import { HydropowerSchematicSvg } from './HydropowerSchematicSvg';
import { HydroPowerhouseCutawayModal } from './HydroPowerhouseCutawayModal';
import { EquipmentDetailModal } from './EquipmentDetailModal';
import { TurbineHillChartSimulator } from './modules/TurbineHillChartSimulator';
import { TurbineSelectionGuideLab } from './modules/TurbineSelectionGuideLab';
import { GeneratorPqCapabilityCurveSimulator } from './modules/GeneratorPqCapabilityCurveSimulator';
import { GridSynchronizationSimulator } from './modules/GridSynchronizationSimulator';
import { GeneratorNeutralEarthingLab } from './modules/GeneratorNeutralEarthingLab';
import { HydroAssetHealthVibrationLab } from './modules/HydroAssetHealthVibrationLab';
import { GenerationDeliverablesExportEngine } from './modules/GenerationDeliverablesExportEngine';
import { ProductionPowerCalculator } from './ProductionPowerCalculator';
import { CameroonFleetExplorer } from './CameroonFleetExplorer';
import { OtherGenerationsJourney } from './OtherGenerationsJourney';
import { EngineeringInfographicsGallerySection } from '../common/EngineeringInfographicsGallerySection';

// Central Reactive Data Mesh Store
import {
  useGenerationProjectStore,
  type GenerationTechnology
} from './services/useGenerationProjectStore';
import type { ProductionEquipment, ProtectionFunctionDetail, GenerationTechnologyId } from './types';

// Lazy load deep 24-subsystem master workbench
const HydropowerMasterWorkbench = lazy(() =>
  import('../hydropower/HydropowerMasterWorkbench').then(m => ({ default: m.HydropowerMasterWorkbench }))
);

interface EnergyProductionMainViewProps {
  initialTechnology?: GenerationTechnologyId;
  onNavigateToDomain?: (domainCode: string) => void;
  locale?: 'fr' | 'en';
  onSelectEquipment?: (equipmentId: string) => void;
}

export const EnergyProductionMainView: React.FC<EnergyProductionMainViewProps> = ({
  initialTechnology,
  onNavigateToDomain,
  locale = 'fr',
  onSelectEquipment
}) => {
  // 1. Centralized Reactive Engineering Store
  const store = useGenerationProjectStore('nachtigal');

  // 2. UI Controllers & Modals
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [selectedEquipmentForModal, setSelectedEquipmentForModal] = useState<ProductionEquipment | null>(null);
  const [isCutawayModalOpen, setIsCutawayModalOpen] = useState<boolean>(false);
  const [activeStage17Id, setActiveStage17Id] = useState<string>('stage-turbine');
  const [selectedProtectionDetail, setSelectedProtectionDetail] = useState<ProtectionFunctionDetail | null>(null);
  const [isPrinciplesModalOpen, setIsPrinciplesModalOpen] = useState<boolean>(false);

  // Sub-Tab Navigation for each of the 5 Stages
  const [stage1Tab, setStage1Tab] = useState<'FLEET' | 'SIZING' | 'PHYSICS_SOURCES' | 'OTHER_TECHS'>('FLEET');
  const [stage2Tab, setStage2Tab] = useState<'SCHEMATIC_17' | 'CUTAWAY' | 'HILL_CHART' | 'TURBINE_SELECTION' | 'TURBINE_TYPES'>('SCHEMATIC_17');
  const [stage3Tab, setStage3Tab] = useState<'PQ_DIAGRAM' | 'SYNCHRONIZATION' | 'PRIMARY_CONTROL' | 'ELECTROMAGNETIC' | 'ENERGY_BALANCE'>('PQ_DIAGRAM');
  const [stage4Tab, setStage4Tab] = useState<'PROTECTION_12' | 'NEUTRAL_EARTHING' | 'STATION_BOP'>('PROTECTION_12');
  const [stage5Tab, setStage5Tab] = useState<'DOSSIER_BOQ' | 'COMMISSIONING' | 'VIBRATION_HEALTH' | 'POSTERS' | 'DEEP_WORKBENCH'>('DOSSIER_BOQ');

  // Active Stage 17 selection
  const currentStage17 = HYDRO_PROCESS_STAGES.find(s => s.id === activeStage17Id) || HYDRO_PROCESS_STAGES[9];
  const currentEquipment17 = HYDRO_EQUIPMENT_MAP[currentStage17.equipmentId];

  // Helper for equipment inspection
  const handleInspectEquipment = (eqId: string) => {
    const eq = HYDRO_EQUIPMENT_MAP[eqId];
    if (eq) {
      setSelectedEquipmentForModal(eq);
    }
    onSelectEquipment?.(eqId);
  };

  return (
    <div className="space-y-6 font-mono animate-in fade-in duration-300 pb-16">
      
      {/* 0. Authoritative Ecosystem Reference Hero (Page 1: Energy Resources & Generation) */}
      <AuthoritativeEcosystemHero
        stage="generation"
        locale={locale}
        onNavigateToDomain={onNavigateToDomain}
        onSelectEquipment={handleInspectEquipment}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
        activePillarLabel={
          store.activeStage === 1 ? (locale === 'fr' ? 'Étape 1 : Ressources, Hydrologie & Parc National' : 'Stage 1: Resources & National Fleet') :
          store.activeStage === 2 ? (locale === 'fr' ? 'Étape 2 : Génie Civil, Conduites & Turbines' : 'Stage 2: Civil Works, Penstocks & Turbines') :
          store.activeStage === 3 ? (locale === 'fr' ? 'Étape 3 : Alternateur, Diagramme P-Q & Stabilité' : 'Stage 3: Alternator, P-Q Curve & Stability') :
          store.activeStage === 4 ? (locale === 'fr' ? 'Étape 4 : Auxiliaires BoP, Neutre & Protections ANSI' : 'Stage 4: BoP Auxiliaries, Neutral & Protections') :
          (locale === 'fr' ? 'Étape 5 : Essais SAT, O&M & Dossier DQE FCFA' : 'Stage 5: SAT Tests, O&M & BOQ FCFA')
        }
        totalPillarsCount={5}
      />

      {/* 0.5 Executive First-View Architecture & 7 Orientation Questions Banner */}
      <GenerationOrientationBanner
        locale={locale}
        onNavigateStage={store.setActiveStage}
        onNavigateToDomain={onNavigateToDomain}
      />

      {/* 1. Master Command Header HUD */}
      <GenerationCommandHeader
        locale={locale}
        activeStage={store.activeStage}
        onSelectStage={store.setActiveStage}
        activeTechnology={store.activeTechnology}
        onSelectTechnology={store.setActiveTechnology}
        selectedPlantId={store.selectedPlantId}
        onSelectPlant={store.setSelectedPlantId}
        onOpenPrinciplesDrawer={() => setIsPrinciplesModalOpen(true)}
        onOpenDossier={() => {
          store.setActiveStage(5);
          setStage5Tab('DOSSIER_BOQ');
        }}
        activePlant={store.activePlant}
        powerMw={store.calculations.electricalActivePowerMw}
        currentAmps={store.calculations.statorNominalCurrentAmps}
        headM={store.params.headM}
        flowM3s={store.params.flowM3s}
        voltageKv={store.params.generatorVoltageKv}
        stepUpKv={store.params.stepUpVoltageKv}
      />

      {/* Main Workspace Layout with Side Navigator */}
      <div className="flex flex-col lg:flex-row items-start gap-6">

        {/* SIDE ENGINEERING NAVIGATOR */}
        {isSidePanelOpen && (
          <aside className="w-full lg:w-80 shrink-0 space-y-4 font-mono text-xs animate-in slide-in-from-left duration-200">
            <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#222B38]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    {locale === 'fr' ? 'Parcours 5 Étapes D01' : '5-Stage Engineering'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidePanelOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title={locale === 'fr' ? 'Replier le volet' : 'Collapse side panel'}
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Active Plant Telemetry */}
              <div className="p-2.5 rounded-xl bg-[#0E141F] border border-sky-500/30 text-[11px] space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">{locale === 'fr' ? 'Centrale Active' : 'Active Plant'}</div>
                <div className="font-bold text-sky-300 truncate">{store.activePlant.name}</div>
                <div className="text-[10px] text-slate-400">
                  {store.calculations.electricalActivePowerMw} MW • {store.activePlant.gridZone} • In = {store.calculations.statorNominalCurrentAmps} A
                </div>
              </div>

              {/* 5 Stages Navigation List */}
              <div className="space-y-1.5">
                {[
                  { stage: 1 as const, titleFr: '1. Ressources & Parc National', titleEn: '1. Resources & Fleet', desc: 'Hydrologie & Sizing' },
                  { stage: 2 as const, titleFr: '2. Génie Civil & Turbines', titleEn: '2. Civil Works & Turbines', desc: '17 Étapes SVG & Hill Chart' },
                  { stage: 3 as const, titleFr: '3. Alternateur & Stabilité', titleEn: '3. Alternator & Stability', desc: 'Plan P-Q & Boucles AVR' },
                  { stage: 4 as const, titleFr: '4. Auxiliaires BoP & Protections', titleEn: '4. Station BoP & Protection', desc: 'Neutre & 12 Relais ANSI' },
                  { stage: 5 as const, titleFr: '5. Essais, O&M & Dossier DQE', titleEn: '5. Commissioning & BOQ', desc: 'Délestage & DQE FCFA' }
                ].map((st) => {
                  const isSelected = store.activeStage === st.stage;
                  return (
                    <button
                      key={st.stage}
                      type="button"
                      onClick={() => store.setActiveStage(st.stage)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500/20 border-sky-400 text-white shadow-xs'
                          : 'bg-[#0E141F]/80 border-[#222B38] text-slate-400 hover:bg-[#161B22] hover:text-slate-200'
                      }`}
                    >
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-sky-300' : 'text-slate-300'}`}>
                          {locale === 'fr' ? st.titleFr : st.titleEn}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {st.desc}
                        </div>
                      </div>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* MAIN STAGE CONTENT CANVAS */}
        <main className="flex-1 min-w-0 w-full space-y-6">

          {/* ========================================================
              STAGE 1: RESSOURCES, HYDROLOGIE & PARC NATIONAL
             ======================================================== */}
          {store.activeStage === 1 && (
            <div className="space-y-5">
              {/* Sub-Tabs Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
                <button
                  type="button"
                  onClick={() => setStage1Tab('FLEET')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage1Tab === 'FLEET'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '1. Parc de Production Cameroun (RIS/RIN)' : '1. Cameroon Generation Fleet'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage1Tab('SIZING')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage1Tab === 'SIZING'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '2. Simulateur de Dimensionnement Multi-Énergies' : '2. Multi-Energy Sizing Simulator'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage1Tab('PHYSICS_SOURCES')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage1Tab === 'PHYSICS_SOURCES'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '3. Physique des Sources Primaires' : '3. Primary Energy Physics'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage1Tab('OTHER_TECHS')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage1Tab === 'OTHER_TECHS'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '4. Filières Solaire, Éolien, CCGT & Biomasse' : '4. Solar, Wind, CCGT & Biomass'}</span>
                </button>
              </div>

              {stage1Tab === 'FLEET' && (
                <CameroonFleetExplorer locale={locale} />
              )}

              {stage1Tab === 'SIZING' && (
                <ProductionPowerCalculator locale={locale} />
              )}

              {stage1Tab === 'PHYSICS_SOURCES' && (
                <div className="p-6 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-sky-400">PILIER 1 · ORIGINES PHYSIQUES DE L'ÉNERGIE</span>
                    <h3 className="text-base font-bold text-white">
                      {locale === 'fr' ? PRODUCTION_MAJOR_SECTIONS[0].titleFr : PRODUCTION_MAJOR_SECTIONS[0].titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {locale === 'fr' ? PRODUCTION_MAJOR_SECTIONS[0].introFr : PRODUCTION_MAJOR_SECTIONS[0].introEn}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {PRODUCTION_MAJOR_SECTIONS[0].items.map((it, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{locale === 'fr' ? it.titleFr : it.titleEn}</span>
                          {it.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">
                              {it.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {locale === 'fr' ? it.descriptionFr : it.descriptionEn}
                        </p>
                        {it.equation && (
                          <div className="p-2 rounded-lg bg-[#090D14] text-sky-300 font-bold text-[11px] border border-[#222B38]">
                            {it.equation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stage1Tab === 'OTHER_TECHS' && (
                <OtherGenerationsJourney
                  technologyId="solar"
                  locale={locale}
                  onSelectTechnology={() => {}}
                  onSelectGlobalEquipment={handleInspectEquipment}
                />
              )}
            </div>
          )}

          {/* ========================================================
              STAGE 2: GÉNIE CIVIL, CONDUITES & TURBINES HYDRAULIQUES
             ======================================================== */}
          {store.activeStage === 2 && (
            <div className="space-y-5">
              {/* Sub-Tabs Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
                <button
                  type="button"
                  onClick={() => setStage2Tab('SCHEMATIC_17')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage2Tab === 'SCHEMATIC_17'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Waves className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '1. Schéma 17 Étapes (Bassin versant à 225 kV)' : '1. 17-Stage Schematic Flow'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage2Tab('CUTAWAY')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage2Tab === 'CUTAWAY'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '2. Écorché 2D Usine de Puissance' : '2. Machine Hall 2D Cutaway'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage2Tab('HILL_CHART')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage2Tab === 'HILL_CHART'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '3. Colline de Rendement Turbine (Hill Chart)' : '3. Turbine Hill Chart'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage2Tab('TURBINE_SELECTION')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage2Tab === 'TURBINE_SELECTION'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '4. Matrice Sélection & Vitesse Spécifique (ns)' : '4. Selection & Specific Speed (ns)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage2Tab('TURBINE_TYPES')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage2Tab === 'TURBINE_TYPES'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '5. Typologies Pelton / Francis / Kaplan' : '5. Turbine Technologies'}</span>
                </button>
              </div>

              {stage2Tab === 'SCHEMATIC_17' && (
                <div className="space-y-4">
                  {/* SVG Canvas Box */}
                  <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#222B38] text-xs">
                      <span className="font-bold text-sky-400 uppercase flex items-center gap-1.5">
                        <Waves className="w-3.5 h-3.5" />
                        <span>{locale === 'fr' ? 'Parcours d’Énergie Hydraulique Dynamique' : 'Dynamic Hydraulic Energy Path'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCutawayModalOpen(true)}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30 font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>{locale === 'fr' ? 'Voir l’Écorché Usine' : 'Open Powerhouse Cutaway'}</span>
                      </button>
                    </div>

                    <HydropowerSchematicSvg
                      currentStageId={activeStage17Id}
                      onSelectStage={(sId) => setActiveStage17Id(sId)}
                      onOpenEquipment={handleInspectEquipment}
                    />
                  </div>

                  {/* Active Step Detailed Card */}
                  <div className="p-5 rounded-2xl bg-[#0E141F] border border-[#222B38] shadow-xl flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold">
                          Étape {currentStage17.stepNumber} / 17
                        </span>
                        <h4 className="text-base font-bold text-white">
                          {locale === 'fr' ? currentStage17.labelFr : currentStage17.labelEn}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300">
                        {locale === 'fr' ? currentStage17.subtitleFr : currentStage17.subtitleEn}
                      </p>
                      <div className="text-xs text-sky-400 font-bold flex items-center gap-1.5">
                        <span>État Énergétique :</span>
                        <span className="text-white font-normal">{locale === 'fr' ? currentStage17.energyStateFr : currentStage17.energyStateEn}</span>
                      </div>
                    </div>

                    {currentEquipment17 && (
                      <button
                        type="button"
                        onClick={() => setSelectedEquipmentForModal(currentEquipment17)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-lg shadow-sky-500/20 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{locale === 'fr' ? 'Dossier 24 Points Équipement' : '24-Point Equipment Dossier'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {stage2Tab === 'CUTAWAY' && (
                <div className="p-6 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-4 text-center">
                  <div className="max-w-xl mx-auto space-y-2">
                    <h3 className="text-base font-bold text-white">
                      {locale === 'fr' ? 'Écorché Architectural de l’Usine de Production' : 'Powerhouse Architectural Cutaway'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {locale === 'fr'
                        ? 'Visualisez en coupe transversale la disposition relative de la bâche spirale, du vannage, de la roue Francis, de l’arbre et de l’alternateur vertical.'
                        : 'Explore the cross-sectional arrangement of the spiral case, distributor, Francis runner, vertical shaft, and alternator.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsCutawayModalOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-sky-500/20 inline-flex items-center gap-2 cursor-pointer mt-2"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>{locale === 'fr' ? 'Ouvrir l’Écorché Plein Écran' : 'Open Fullscreen Cutaway'}</span>
                    </button>
                  </div>
                </div>
              )}

              {stage2Tab === 'HILL_CHART' && (
                <TurbineHillChartSimulator locale={locale} />
              )}

              {stage2Tab === 'TURBINE_SELECTION' && (
                <TurbineSelectionGuideLab
                  locale={locale}
                  initialHeadM={store.params.headM}
                  initialFlowM3s={store.params.flowM3s}
                  initialPowerMw={store.calculations.electricalActivePowerMw}
                />
              )}

              {stage2Tab === 'TURBINE_TYPES' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {HYDRO_TURBINES.map((turb) => (
                    <div key={turb.id} className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{turb.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">
                          {turb.headRange}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{turb.typicalCharacteristics}</p>
                      <div className="p-2 rounded-lg bg-[#090D14] text-[11px] text-slate-400 border border-[#222B38]">
                        <span className="text-sky-400 font-bold block">Débit : {turb.flowRange}</span>
                        <span>Rendement crête : {turb.efficiencyPeak}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              STAGE 3: ALTERNATEUR, DIAGRAMME P-Q & STABILITÉ
             ======================================================== */}
          {store.activeStage === 3 && (
            <div className="space-y-5">
              {/* Sub-Tabs Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
                <button
                  type="button"
                  onClick={() => setStage3Tab('PQ_DIAGRAM')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage3Tab === 'PQ_DIAGRAM'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '1. Diagramme P-Q & Limites de Capabilité' : '1. P-Q Capability Curve'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage3Tab('SYNCHRONIZATION')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage3Tab === 'SYNCHRONIZATION'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '2. Couplage & Synchronisation Réseau (ANSI 25)' : '2. Grid Synchronization (ANSI 25)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage3Tab('PRIMARY_CONTROL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage3Tab === 'PRIMARY_CONTROL'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '3. Régulation f-P (Statisme) & AVR U-Q' : '3. Speed & Voltage Governance'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage3Tab('ELECTROMAGNETIC')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage3Tab === 'ELECTROMAGNETIC'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '4. Conversion Électrique & Faraday-Lenz' : '4. Electromechanical Conversion'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage3Tab('ENERGY_BALANCE')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage3Tab === 'ENERGY_BALANCE'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '5. Rendements & Limites de Carnot' : '5. Efficiencies & Carnot Limits'}</span>
                </button>
              </div>

              {stage3Tab === 'PQ_DIAGRAM' && (
                <GeneratorPqCapabilityCurveSimulator
                  locale={locale}
                  ratedMva={store.calculations.apparentPowerMva}
                  ratedPowerFactor={store.params.generatorPowerFactor}
                  voltageKv={store.params.generatorVoltageKv}
                />
              )}

              {stage3Tab === 'SYNCHRONIZATION' && (
                <GridSynchronizationSimulator
                  locale={locale}
                  nominalVoltageKv={store.params.generatorVoltageKv}
                />
              )}

              {stage3Tab === 'ELECTROMAGNETIC' && (
                <div className="p-6 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-sky-400">PILIER 3 · ÉLECTROMAGNÉTISME & SYNCHRONISME</span>
                    <h3 className="text-base font-bold text-white">
                      {locale === 'fr' ? PRODUCTION_MAJOR_SECTIONS[2].titleFr : PRODUCTION_MAJOR_SECTIONS[2].titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {locale === 'fr' ? PRODUCTION_MAJOR_SECTIONS[2].introFr : PRODUCTION_MAJOR_SECTIONS[2].introEn}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {PRODUCTION_MAJOR_SECTIONS[2].items.map((it, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{locale === 'fr' ? it.titleFr : it.titleEn}</span>
                          {it.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                              {it.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {locale === 'fr' ? it.descriptionFr : it.descriptionEn}
                        </p>
                        {it.equation && (
                          <div className="p-2 rounded-lg bg-[#090D14] text-amber-300 font-bold text-[11px] border border-[#222B38]">
                            {it.equation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stage3Tab === 'PRIMARY_CONTROL' && (
                <div className="p-6 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-sky-400">PILIER 5 · BOUCLES D'ASSERVISSEMENT DYNAMIQUES</span>
                    <h3 className="text-base font-bold text-white">
                      {locale === 'fr' ? PRODUCTION_MAJOR_SECTIONS[4].titleFr : PRODUCTION_MAJOR_SECTIONS[4].titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {locale === 'fr' ? PRODUCTION_MAJOR_SECTIONS[4].introFr : PRODUCTION_MAJOR_SECTIONS[4].introEn}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {PRODUCTION_MAJOR_SECTIONS[4].items.map((it, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{locale === 'fr' ? it.titleFr : it.titleEn}</span>
                          {it.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                              {it.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {locale === 'fr' ? it.descriptionFr : it.descriptionEn}
                        </p>
                        {it.equation && (
                          <div className="p-2 rounded-lg bg-[#090D14] text-emerald-300 font-bold text-[11px] border border-[#222B38]">
                            {it.equation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stage3Tab === 'ENERGY_BALANCE' && (
                <div className="p-6 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-sky-400">PILIER 2 · THERMODYNAMIQUE & CONSERVATION</span>
                    <h3 className="text-base font-bold text-white">
                      {locale === 'fr' ? PRODUCTION_MAJOR_SECTIONS[1].titleFr : PRODUCTION_MAJOR_SECTIONS[1].titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {locale === 'fr' ? PRODUCTION_MAJOR_SECTIONS[1].introFr : PRODUCTION_MAJOR_SECTIONS[1].introEn}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {PRODUCTION_MAJOR_SECTIONS[1].items.map((it, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{locale === 'fr' ? it.titleFr : it.titleEn}</span>
                          {it.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                              {it.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {locale === 'fr' ? it.descriptionFr : it.descriptionEn}
                        </p>
                        {it.equation && (
                          <div className="p-2 rounded-lg bg-[#090D14] text-cyan-300 font-bold text-[11px] border border-[#222B38]">
                            {it.equation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              STAGE 4: AUXILIAIRES BOP, NEUTRE & PROTECTIONS ANSI
             ======================================================== */}
          {store.activeStage === 4 && (
            <div className="space-y-5">
              {/* Sub-Tabs Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
                <button
                  type="button"
                  onClick={() => setStage4Tab('PROTECTION_12')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage4Tab === 'PROTECTION_12'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '1. Matrice des 12 Protections ANSI Alternateur' : '1. 12 ANSI Generator Protections'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage4Tab('NEUTRAL_EARTHING')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage4Tab === 'NEUTRAL_EARTHING'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '2. Mise à la Terre Neutre Statorique (NGT)' : '2. Stator Neutral Grounding Lab'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage4Tab('STATION_BOP')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage4Tab === 'STATION_BOP'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '3. Services Propres (BoP) & Black Start' : '3. Station Auxiliaries & Black Start'}</span>
                </button>
              </div>

              {stage4Tab === 'PROTECTION_12' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {GENERATOR_PROTECTION_MATRIX.map((prot) => (
                      <div
                        key={prot.ansiCode}
                        onClick={() => setSelectedProtectionDetail(prot)}
                        className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] hover:border-sky-500/50 transition-all cursor-pointer space-y-2 hover:bg-[#141B26]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold text-xs">
                            ANSI {prot.ansiCode}
                          </span>
                          <span className="text-[10px] text-slate-500">{prot.standard}</span>
                        </div>
                        <div className="font-bold text-white text-xs">
                          {locale === 'fr' ? prot.nameFr : prot.nameEn}
                        </div>
                        <p className="text-slate-400 text-[11px] line-clamp-2">
                          {prot.whatItProtects}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Protection Detail Modal / Box */}
                  {selectedProtectionDetail && (
                    <div className="p-4 rounded-xl bg-[#131A26] border border-sky-500/40 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#222B38] pb-2">
                        <span className="font-bold text-sky-300 text-xs">
                          ANSI {selectedProtectionDetail.ansiCode} — {locale === 'fr' ? selectedProtectionDetail.nameFr : selectedProtectionDetail.nameEn}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedProtectionDetail(null)}
                          className="text-slate-400 hover:text-white text-xs cursor-pointer"
                        >
                          ✕ Fermer
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Condition Anormale Détectée :</span>
                          <span className="text-white">{selectedProtectionDetail.abnormalCondition}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Méthode de Mesure / Relais :</span>
                          <span className="text-slate-200">{selectedProtectionDetail.detectionMethod}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Ordre de Déclenchement :</span>
                          <span className="text-amber-400 font-bold">{selectedProtectionDetail.actionOccurs}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Équipements Affectés :</span>
                          <span className="text-emerald-400">{selectedProtectionDetail.equipmentAffected}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {stage4Tab === 'NEUTRAL_EARTHING' && (
                <GeneratorNeutralEarthingLab
                  locale={locale}
                  voltageKv={store.params.generatorVoltageKv}
                  ratedMva={store.calculations.apparentPowerMva}
                />
              )}

              {stage4Tab === 'STATION_BOP' && (
                <div className="p-6 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-sky-400">PILIER 6 · BALANCE OF PLANT (BOP)</span>
                    <h3 className="text-base font-bold text-white">
                      {locale === 'fr' ? PRODUCTION_MAJOR_SECTIONS[5].titleFr : PRODUCTION_MAJOR_SECTIONS[5].titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {locale === 'fr' ? PRODUCTION_MAJOR_SECTIONS[5].introFr : PRODUCTION_MAJOR_SECTIONS[5].introEn}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {PRODUCTION_MAJOR_SECTIONS[5].items.map((it, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{locale === 'fr' ? it.titleFr : it.titleEn}</span>
                          {it.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                              {it.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {locale === 'fr' ? it.descriptionFr : it.descriptionEn}
                        </p>
                        {it.equation && (
                          <div className="p-2 rounded-lg bg-[#090D14] text-emerald-300 font-bold text-[11px] border border-[#222B38]">
                            {it.equation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              STAGE 5: ESSAIS, O&M & DOSSIER DQE FCFA
             ======================================================== */}
          {store.activeStage === 5 && (
            <div className="space-y-5">
              {/* Sub-Tabs Selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
                <button
                  type="button"
                  onClick={() => setStage5Tab('DOSSIER_BOQ')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage5Tab === 'DOSSIER_BOQ'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '1. Dossier d’Ingénierie & Devis DQE (FCFA)' : '1. Engineering Dossier & BOQ (FCFA)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage5Tab('COMMISSIONING')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage5Tab === 'COMMISSIONING'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '2. Protocoles d’Essais SAT & Délestage' : '2. SAT Commissioning & Load Rejection'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage5Tab('VIBRATION_HEALTH')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage5Tab === 'VIBRATION_HEALTH'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '3. Diagnostic Vibratoire ISO 10816-5 & Cavitation' : '3. ISO 10816-5 Vibration & Cavitation'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage5Tab('POSTERS')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage5Tab === 'POSTERS'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '4. Posters d’Ingénierie CEI' : '4. IEC Engineering Posters'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage5Tab('DEEP_WORKBENCH')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    stage5Tab === 'DEEP_WORKBENCH'
                      ? 'bg-sky-400 text-slate-950 shadow-md'
                      : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? '5. Station Complète 24 Sous-Systèmes' : '5. 24-Subsystem Deep Workbench'}</span>
                </button>
              </div>

              {stage5Tab === 'DOSSIER_BOQ' && (
                <GenerationDeliverablesExportEngine
                  locale={locale}
                  selectedPlantId={store.selectedPlantId}
                  technology={store.activeTechnology}
                  headM={store.params.headM}
                  flowM3s={store.params.flowM3s}
                  voltageKv={store.params.generatorVoltageKv}
                  stepUpKv={store.params.stepUpVoltageKv}
                  calculations={store.calculations}
                />
              )}

              {stage5Tab === 'COMMISSIONING' && (
                <div className="p-6 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-400">PROCÉDURES DE RÉCEPTION EN USINE & SUR SITE (CEI 60041 / CEI 61362)</span>
                    <h3 className="text-base font-bold text-white">
                      {locale === 'fr' ? 'Protocoles d’Essais de Mise en Service Usine' : 'Plant Commissioning & Acceptance Test Protocols'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2">
                      <span className="text-xs font-bold text-sky-400 block uppercase">1. Essais à Sec (Dry Commissioning)</span>
                      <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                        <li>Contrôle de rigidité diélectrique des enroulements statoriques (test de tenue 2·Un + 1 kV).</li>
                        <li>Mesure de l’indice de polarisation (PI) et résistance d’isolement R_iso &gt; 1000 MΩ.</li>
                        <li>Contrôle d’étanchéité et mise sous pression hydrostatique de la bâche spirale (1.5 × P_max).</li>
                        <li>Essai de fonctionnement à sec du vannage et réglage des fins de course servomoteurs.</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2">
                      <span className="text-xs font-bold text-emerald-400 block uppercase">2. Essais en Eau (Wet Commissioning)</span>
                      <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                        <li>Premier remplissage en eau et contrôle de fuites des joints de palier.</li>
                        <li>Montée en vitesse progressive jusqu’à la vitesse nominale n_nom et contrôle de survitesse.</li>
                        <li>Essais de délestage à 25%, 50%, 75% et 100% Pn avec mesure de surpression d'onde.</li>
                        <li>Contrôle de synchronisation automatique (ANSI 25) et prise de charge sur le réseau 225 kV.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {stage5Tab === 'VIBRATION_HEALTH' && (
                <HydroAssetHealthVibrationLab
                  locale={locale}
                  plantName={store.activePlant.name}
                  ratedMw={store.calculations.electricalActivePowerMw}
                />
              )}

              {stage5Tab === 'POSTERS' && (
                <EngineeringInfographicsGallerySection
                  locale={locale}
                  filterCategory="GENERATION"
                />
              )}

              {stage5Tab === 'DEEP_WORKBENCH' && (
                <Suspense fallback={<div className="p-8 text-center text-slate-400 font-mono text-xs">Chargement de la station 24 sous-systèmes...</div>}>
                  <HydropowerMasterWorkbench
                    locale={locale}
                    onBack={() => setStage5Tab('DOSSIER_BOQ')}
                  />
                </Suspense>
              )}
            </div>
          )}

        </main>
      </div>

      {/* 2. Modals */}
      {/* 24-Point Equipment Dossier Modal */}
      {selectedEquipmentForModal && (
        <EquipmentDetailModal
          equipment={selectedEquipmentForModal}
          onClose={() => setSelectedEquipmentForModal(null)}
          allEquipmentMap={HYDRO_EQUIPMENT_MAP}
          locale={locale}
        />
      )}

      {/* Powerhouse Machine Hall Cutaway Modal */}
      <HydroPowerhouseCutawayModal
        isOpen={isCutawayModalOpen}
        onClose={() => setIsCutawayModalOpen(false)}
        locale={locale}
      />

      {/* Engineering Principles Modal */}
      {isPrinciplesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#090D14] border border-[#222B38] rounded-2xl p-6 text-slate-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#222B38]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {locale === 'fr' ? 'Formulations Mathématiques & Principes d’Ingénierie D01' : 'Mathematical Principles & Engineering Formulations D01'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPrinciplesModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1.5">
                <div className="font-bold text-sky-300">1. Équation de Puissance Hydraulique Brute</div>
                <div className="font-mono text-sm text-white bg-[#090D14] p-2 rounded border border-[#222B38]">
                  P_hyd = ρ · g · Q · H = 9.81 · Q · H [kW]
                </div>
                <p className="text-slate-400 text-[11px]">
                  Où ρ = 1000 kg/m³, g = 9.81 m/s², Q est le débit turbiné en m³/s et H est la chute nette d’eau en mètres après pertes de charge singulières et régulières.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1.5">
                <div className="font-bold text-amber-300">2. Coup de Bélier Hydraulique (Formule d’Allievi-Joukowsky)</div>
                <div className="font-mono text-sm text-white bg-[#090D14] p-2 rounded border border-[#222B38]">
                  Δp = ρ · a · Δv [Pa]  ;  h_max = (a · v0) / g [m]
                </div>
                <p className="text-slate-400 text-[11px]">
                  Onde de surpression créée lors de la fermeture rapide du vannage en temps Ta &lt; 2L/a, nécessitant une cheminée d'équilibre pour protéger la conduite forcée.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1.5">
                <div className="font-bold text-emerald-300">3. Vitesse Synchrone & Constante d’Inertie H</div>
                <div className="font-mono text-sm text-white bg-[#090D14] p-2 rounded border border-[#222B38]">
                  n = (60 · f) / p  ;  H = E_cin / S_nom = (0.5 · J · ω²) / S_nom [secondes]
                </div>
                <p className="text-slate-400 text-[11px]">
                  À 50 Hz avec 24 paires de pôles (Nachtigal), la vitesse nominale est n = (60 * 50) / 24 = 125 tr/min. H = 3.8 s procure l'inertie vitale au réseau RIS.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
