// src/components/installations/InstallationsWorkbench.tsx
// EPEDE D06 - Master Orchestrator for Electrical Installations & Utilization
// Upgraded 5-Stage Progressive Architecture & First View Ecosystem

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Activity,
  Box,
  Compass,
  Layers,
  Shield,
  Sliders,
  Scale,
  Cpu,
  Power,
  AlertTriangle,
  BookOpen,
  Info,
  CheckCircle2,
  X,
  FileText,
  Flame,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Award,
  CheckSquare,
  Thermometer,
  CloudLightning,
  ChevronRight,
  Building2
} from 'lucide-react';
import { OperatorFabricStream } from '../digitaltwin/OperatorFabricStream';
import { AasDrawer } from '../digitaltwin/AasDrawer';
import type { Equipment } from '../../types/epede';
import { InstallationCommandHeader } from './InstallationCommandHeader';
import { InstallationEcosystemHero } from './InstallationEcosystemHero';
import { MasterInstallationJourney } from './MasterInstallationJourney';
import { InteractiveBuildingSldCanvas } from './InteractiveBuildingSldCanvas';
import { TgbtSwitchboardExplorer } from './TgbtSwitchboardExplorer';
import { DistributionBoardsAndCircuitsExplorer } from './DistributionBoardsAndCircuitsExplorer';
import { EarthingAndNeutralExplorer } from './EarthingAndNeutralExplorer';
import { UsefulEnergyAndLoadsExplorer } from './UsefulEnergyAndLoadsExplorer';
import { InstallationScenariosAndSafetyExplorer } from './InstallationScenariosAndSafetyExplorer';
import { InstallationEngineeringDrawer } from './InstallationEngineeringDrawer';
import { InstallationEngineeringKnowledgeExplorer } from './InstallationEngineeringKnowledgeExplorer';
import { ConceptualProjectDesignWorkbench } from './ConceptualProjectDesignWorkbench';

// Advanced Engineering Modules
import { MasterInstallationChainExplorer } from '../common/MasterInstallationChainExplorer';
import { FacilityArchetypesExplorer } from './FacilityArchetypesExplorer';
import { InteractiveTgbtBuilder } from './InteractiveTgbtBuilder';
import { InteractivePanelBuilder } from './InteractivePanelBuilder';
import { DifferentialProtectionLab } from './DifferentialProtectionLab';
import { SurgeProtectionDeviceLab } from './SurgeProtectionDeviceLab';
import { StructuredLoadLibrary } from './StructuredLoadLibrary';
import { InstallationFormulasExplainer } from './InstallationFormulasExplainer';

// 6 Pro Engineering Modules
import { SelectiveCoordinationTccStudio } from './SelectiveCoordinationTccStudio';
import { ArcFlashHazardCalculator } from './ArcFlashHazardCalculator';
import { HarmonicsAndPowerQualityAnalyzer } from './HarmonicsAndPowerQualityAnalyzer';
import { CableSizingDeratingMatrix } from './CableSizingDeratingMatrix';
import { TgbtThermalDissipationCalculator } from './TgbtThermalDissipationCalculator';
import { PanelCadAndDeliverablesExportEngine } from './PanelCadAndDeliverablesExportEngine';

import {
  INSTALLATION_EQUIPMENT,
  MASTER_JOURNEY_STAGES,
  type FacilityArchetype,
  type InstallationViewMode,
  type EarthingSystemType,
  type OperatingRegime,
  type InstallationComponent
} from './data/installationCatalog';

interface InstallationsWorkbenchProps {
  locale: 'fr' | 'en';
  initialPillar?: InstallationPillar;
}

export type MasterInstallationStage = 
  | 'STAGE_ECOSYSTEM_ARCHETYPES'
  | 'STAGE_SIZING_ANALYSIS'
  | 'STAGE_SWITCHBOARDS_EQUIPMENT'
  | 'STAGE_PROTECTION_SAFETY'
  | 'STAGE_COMMISSIONING_DELIVERABLES';

export type InstallationPillar =
  | 'MASTER_CHAIN'
  | 'TGBT_BUILDER'
  | 'PANEL_BUILDER'
  | 'SELECTIVE_TCC'
  | 'ARC_FLASH'
  | 'HARMONICS_THD'
  | 'CABLE_SIZING_K'
  | 'THERMAL_TGBT'
  | 'CAD_DELIVERABLES'
  | 'DIFF_PROTECTION_LAB'
  | 'SPD_LAB'
  | 'FACILITY_ARCHETYPES'
  | 'LOAD_LIBRARY'
  | 'FORMULAS_EXPLAINER'
  | 'PROJECT_DESIGN_WORKBENCH'
  | 'KNOWLEDGE_MAP'
  | 'INTERACTIVE_SLD'
  | 'JOURNEY'
  | 'TGBT_SWITCHBOARD'
  | 'FINAL_CIRCUITS'
  | 'EARTHING_BALANCING'
  | 'USEFUL_ENERGY'
  | 'FAULTS_SAFETY'
  | 'EQUIPMENT_CATALOG'
  | 'OPERATOR_FABRIC';

export const InstallationsWorkbench: React.FC<InstallationsWorkbenchProps> = ({
  locale,
  initialPillar
}) => {
  const isFr = locale === 'fr';

  // 5 Master Stages State
  const [activeStage, setActiveStage] = useState<MasterInstallationStage>('STAGE_ECOSYSTEM_ARCHETYPES');
  const [activeSubTool, setActiveSubTool] = useState<string>('ECOSYSTEM_OVERVIEW');

  // Facilities & Global Context
  const [selectedArchetype, setSelectedArchetype] = useState<FacilityArchetype>('TERTIARY_COMMERCIAL');
  const [activeViewMode, setActiveViewMode] = useState<InstallationViewMode>('ELECTRICAL_SLD');
  const [selectedEarthing, setSelectedEarthing] = useState<EarthingSystemType>('TN_S');
  const [selectedRegime, setSelectedRegime] = useState<OperatingRegime>('NORMAL_GRID');

  // Journey & Equipment Inspection State
  const [selectedStageId, setSelectedStageId] = useState<string>('stage-04-main-breaker');
  const [inspectedEquipmentId, setInspectedEquipmentId] = useState<string | null>(null);

  // Side Drawers State
  const [isEngineeringDrawerOpen, setIsEngineeringDrawerOpen] = useState<boolean>(false);
  const [isAasOpen, setIsAasOpen] = useState<boolean>(false);
  const [selectedWorkbenchStep, setSelectedWorkbenchStep] = useState<any>('POWER_BALANCE');

  // Map legacy initialPillar if provided
  useEffect(() => {
    if (initialPillar) {
      if (['MASTER_CHAIN', 'FACILITY_ARCHETYPES', 'LOAD_LIBRARY', 'JOURNEY', 'INTERACTIVE_SLD', 'KNOWLEDGE_MAP'].includes(initialPillar)) {
        setActiveStage('STAGE_ECOSYSTEM_ARCHETYPES');
        setActiveSubTool(initialPillar);
      } else if (['HARMONICS_THD', 'CABLE_SIZING_K', 'EARTHING_BALANCING', 'FORMULAS_EXPLAINER', 'USEFUL_ENERGY', 'PROJECT_DESIGN_WORKBENCH'].includes(initialPillar)) {
        setActiveStage('STAGE_SIZING_ANALYSIS');
        setActiveSubTool(initialPillar);
      } else if (['TGBT_BUILDER', 'TGBT_SWITCHBOARD', 'PANEL_BUILDER', 'FINAL_CIRCUITS', 'THERMAL_TGBT'].includes(initialPillar)) {
        setActiveStage('STAGE_SWITCHBOARDS_EQUIPMENT');
        setActiveSubTool(initialPillar);
      } else if (['SELECTIVE_TCC', 'ARC_FLASH', 'DIFF_PROTECTION_LAB', 'SPD_LAB', 'FAULTS_SAFETY'].includes(initialPillar)) {
        setActiveStage('STAGE_PROTECTION_SAFETY');
        setActiveSubTool(initialPillar);
      } else if (['CAD_DELIVERABLES', 'OPERATOR_FABRIC', 'EQUIPMENT_CATALOG'].includes(initialPillar)) {
        setActiveStage('STAGE_COMMISSIONING_DELIVERABLES');
        setActiveSubTool(initialPillar);
      }
    }
  }, [initialPillar]);

  // The 5 Master Stages Definition
  const stagesConfig: {
    id: MasterInstallationStage;
    number: string;
    titleFr: string;
    titleEn: string;
    subFr: string;
    subEn: string;
    icon: any;
    accentColor: string;
    tools: { id: string; labelFr: string; labelEn: string; icon: any }[];
  }[] = [
    {
      id: 'STAGE_ECOSYSTEM_ARCHETYPES',
      number: '01',
      titleFr: 'Écosystème & Archétypes',
      titleEn: 'Ecosystem & Archetypes',
      subFr: 'Vue 360°, Parcours 11 étapes & 8 typologies de sites',
      subEn: 'Macro orientation, 11-stage spine & facility types',
      icon: Compass,
      accentColor: 'amber',
      tools: [
        { id: 'ECOSYSTEM_OVERVIEW', labelFr: 'Synoptique & 7 Réponses', labelEn: 'Overview & 7 Answers', icon: Compass },
        { id: 'MASTER_CHAIN', labelFr: 'Chaîne Amont-Aval (11 Niveaux)', labelEn: '11-Stage Master Spine', icon: Layers },
        { id: 'FACILITY_ARCHETYPES', labelFr: '8 Archétypes de Bâtiments', labelEn: '8 Facility Archetypes', icon: Building2 },
        { id: 'LOAD_LIBRARY', labelFr: 'Bibliothèque de Charges (14 Cat.)', labelEn: 'Load Library (14 Cat.)', icon: Cpu },
        { id: 'INTERACTIVE_SLD', labelFr: 'Schéma Unifilaire Bâtiment', labelEn: 'Interactive Facility SLD', icon: Zap },
        { id: 'KNOWLEDGE_MAP', labelFr: 'Cartographie & Taxonomie', labelEn: 'Knowledge Taxonomy', icon: BookOpen }
      ]
    },
    {
      id: 'STAGE_SIZING_ANALYSIS',
      number: '02',
      titleFr: 'Dimensionnement & Calculs',
      titleEn: 'System Sizing & Studies',
      subFr: 'Bilan de puissance, court-circuit Ik, neutre & harmoniques',
      subEn: 'Power balance, fault impedances, earthing & harmonics',
      icon: Activity,
      accentColor: 'cyan',
      tools: [
        { id: 'POWER_BALANCE', labelFr: 'Bilan de Puissance & Transfo', labelEn: 'Power Balance & Trafo Sizing', icon: Zap },
        { id: 'SHORT_CIRCUIT_IMPEDANCE', labelFr: 'Courants de Court-Circuit (Ik)', labelEn: 'Fault Impedance & Short-Circuit', icon: Flame },
        { id: 'EARTHING_BALANCING', labelFr: 'Régimes de Neutre TT/TN/IT', labelEn: 'Earthing Systems TT/TN/IT', icon: Scale },
        { id: 'HARMONICS_THD', labelFr: 'Harmoniques & Surcharge Neutre', labelEn: 'Harmonics THD & Neutral', icon: Activity },
        { id: 'FORMULAS_EXPLAINER', labelFr: 'Formules de Dimensionnement', labelEn: 'Sizing Formulas & Theory', icon: BookOpen }
      ]
    },
    {
      id: 'STAGE_SWITCHBOARDS_EQUIPMENT',
      number: '03',
      titleFr: 'Tableaux & Équipements',
      titleEn: 'Switchboards & Cables',
      subFr: 'Constructeur TGBT, tableaux DIN, câbles k1-k4 & Canalis',
      subEn: 'TGBT builder, modular DIN panels, cable matrix & busways',
      icon: Box,
      accentColor: 'emerald',
      tools: [
        { id: 'TGBT_BUILDER', labelFr: 'Constructeur TGBT / MDB (Formes)', labelEn: 'Interactive TGBT Builder (Forms)', icon: Box },
        { id: 'PANEL_BUILDER', labelFr: 'Tableaux Divisionnaires DIN', labelEn: 'Modular DIN Panel Builder', icon: Sliders },
        { id: 'CABLE_SIZING_K', labelFr: 'Câbles & Facteurs k1-k4 (CEI 60364)', labelEn: 'Cable Sizing Matrix (IEC 60364)', icon: Layers },
        { id: 'THERMAL_TGBT', labelFr: 'Bilan Thermique TGBT (CEI 60890)', labelEn: 'TGBT Thermal Dissipation', icon: Thermometer },
        { id: 'TGBT_SWITCHBOARD', labelFr: 'Formes de Séparation 1 à 4b', labelEn: 'Internal Segregation Forms', icon: Shield }
      ]
    },
    {
      id: 'STAGE_PROTECTION_SAFETY',
      number: '04',
      titleFr: 'Sélectivité & Sécurité',
      titleEn: 'Protection & Safety',
      subFr: 'Courbes TCC log I-t, Arc Flash IEEE 1584, RCD & Parafoudres',
      subEn: 'TCC log curves, Arc Flash IEEE 1584, RCDs & SPDs',
      icon: Shield,
      accentColor: 'red',
      tools: [
        { id: 'SELECTIVE_TCC', labelFr: 'Sélectivité & Courbes TCC (Log I-t)', labelEn: 'Selective TCC Curves (Log I-t)', icon: Activity },
        { id: 'ARC_FLASH', labelFr: 'Risque Arc Flash (IEEE 1584)', labelEn: 'Arc Flash Hazard (IEEE 1584)', icon: Flame },
        { id: 'DIFF_PROTECTION_LAB', labelFr: 'Labo Différentiel (RCD / DDR)', labelEn: 'Differential Protection Lab', icon: Shield },
        { id: 'SPD_LAB', labelFr: 'Labo Parafoudres (SPD Type 1+2)', labelEn: 'Surge Protection (SPD) Lab', icon: CloudLightning },
        { id: 'FAULTS_SAFETY', labelFr: 'Scénarios Défauts & Consignation LOTO', labelEn: 'Faults & LOTO Safety', icon: AlertTriangle }
      ]
    },
    {
      id: 'STAGE_COMMISSIONING_DELIVERABLES',
      number: '05',
      titleFr: 'Essais, Recette & Livrables',
      titleEn: 'Testing & Deliverables',
      subFr: 'Essais FAT/SAT, audit de conformité, bordereau BOQ & export PDF',
      subEn: 'FAT/SAT testing, compliance audit, BOQ & master dossier',
      icon: FileSpreadsheet,
      accentColor: 'purple',
      tools: [
        { id: 'CAD_DELIVERABLES', labelFr: 'Livrables, BOM CSV & PV Essais', labelEn: 'Deliverables & BOM CSV', icon: FileText },
        { id: 'PROJECT_DESIGN_WORKBENCH', labelFr: 'Dossier Projet Complet (24 Modules)', labelEn: 'Full Project Design Suite', icon: CheckSquare },
        { id: 'EQUIPMENT_CATALOG', labelFr: 'Catalogue Matériels BT', labelEn: 'LV Apparatus Catalog', icon: FileText },
        { id: 'OPERATOR_FABRIC', labelFr: 'Console Opérateur & Télémétrie', labelEn: 'Operator Console & Stream', icon: Activity }
      ]
    }
  ];

  const currentStageConfig = stagesConfig.find(s => s.id === activeStage) || stagesConfig[0];

  const handleSelectEquipment = (eqId: string) => {
    setInspectedEquipmentId(eqId);
    setIsAasOpen(true);
  };

  const inspectedComponent: InstallationComponent | undefined = INSTALLATION_EQUIPMENT.find(
    (e) => e.id === inspectedEquipmentId
  );

  return (
    <div className="space-y-6 font-mono text-xs text-slate-100">
      {/* 1. Master Command Header */}
      <InstallationCommandHeader
        locale={locale}
        activePillar={activeSubTool}
        onSelectPillar={(p) => setActiveSubTool(p)}
        selectedArchetype={selectedArchetype}
        onSelectArchetype={setSelectedArchetype}
        activeView={activeViewMode}
        onSelectView={setActiveViewMode}
        selectedEarthing={selectedEarthing}
        onSelectEarthing={setSelectedEarthing}
        selectedRegime={selectedRegime}
        onSelectRegime={setSelectedRegime}
        onOpenEngineeringDrawer={() => setIsEngineeringDrawerOpen(true)}
      />

      {/* 2. Primary 5-Stage Lifecycle Navigation Ribbon */}
      <nav aria-label="Cycle d'ingénierie" className="p-3 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800/80 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400 font-bold">D06</span>
            <span className="font-bold text-white uppercase tracking-wider">
              {isFr ? 'Parcours d\'Ingénierie des Installations Basse Tension (5 Grandes Étapes)' : '5-Stage Low-Voltage Engineering Lifecycle'}
            </span>
          </div>
          <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">
            IEC 60364 • NF C 15-100 • IEC 61439
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {stagesConfig.map((stg) => {
            const Icon = stg.icon;
            const isSelected = stg.id === activeStage;
            return (
              <button
                key={stg.id}
                type="button"
                onClick={() => {
                  setActiveStage(stg.id);
                  setActiveSubTool(stg.tools[0].id);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-xs font-black ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                      {stg.number}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                  </div>
                  <div className="font-bold text-xs mt-1 text-white">
                    {isFr ? stg.titleFr : stg.titleEn}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {isFr ? stg.subFr : stg.subEn}
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Secondary Contextual Sub-Tool Selector */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
        <span className="text-slate-500 text-[10px] uppercase font-mono font-bold mr-2 px-1">
          {isFr ? 'Outils de l\'Étape :' : 'Stage Tools:'}
        </span>
        {currentStageConfig.tools.map((tool) => {
          const ToolIcon = tool.icon;
          const isToolActive = activeSubTool === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveSubTool(tool.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isToolActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-xs'
                  : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <ToolIcon className="w-3.5 h-3.5" />
              <span>{isFr ? tool.labelFr : tool.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Main Stage Content Area */}
      <main className="transition-all duration-150">
        {/* ========================================================================= */}
        {/* STAGE 1: ECOSYSTEM & FACILITY ARCHETYPES                                 */}
        {/* ========================================================================= */}
        {activeStage === 'STAGE_ECOSYSTEM_ARCHETYPES' && (
          <div className="space-y-6">
            {activeSubTool === 'ECOSYSTEM_OVERVIEW' && (
              <InstallationEcosystemHero
                locale={locale}
                selectedArchetype={selectedArchetype}
                onSelectArchetype={setSelectedArchetype}
                selectedEarthing={selectedEarthing}
                onSelectEarthing={setSelectedEarthing}
                onNavigateStage={(stg) => {
                  setActiveStage(stg);
                  if (stg === 'STAGE_SIZING_ANALYSIS') setActiveSubTool('POWER_BALANCE');
                  else if (stg === 'STAGE_SWITCHBOARDS_EQUIPMENT') setActiveSubTool('TGBT_BUILDER');
                  else if (stg === 'STAGE_PROTECTION_SAFETY') setActiveSubTool('SELECTIVE_TCC');
                  else if (stg === 'STAGE_COMMISSIONING_DELIVERABLES') setActiveSubTool('CAD_DELIVERABLES');
                }}
              />
            )}

            {activeSubTool === 'MASTER_CHAIN' && (
              <MasterInstallationChainExplorer
                locale={locale}
                onNavigateToStage={(stageId) => {
                  if (stageId.includes('tgbt')) {
                    setActiveStage('STAGE_SWITCHBOARDS_EQUIPMENT');
                    setActiveSubTool('TGBT_BUILDER');
                  } else if (stageId.includes('panel')) {
                    setActiveStage('STAGE_SWITCHBOARDS_EQUIPMENT');
                    setActiveSubTool('PANEL_BUILDER');
                  } else if (stageId.includes('load')) {
                    setActiveSubTool('LOAD_LIBRARY');
                  }
                }}
              />
            )}

            {activeSubTool === 'FACILITY_ARCHETYPES' && (
              <FacilityArchetypesExplorer locale={locale} />
            )}

            {activeSubTool === 'LOAD_LIBRARY' && (
              <StructuredLoadLibrary locale={locale} />
            )}

            {activeSubTool === 'INTERACTIVE_SLD' && (
              <InteractiveBuildingSldCanvas
                locale={locale}
                archetype={selectedArchetype}
                viewMode={activeViewMode}
                earthing={selectedEarthing}
                regime={selectedRegime}
                onSelectComponent={(nodeId) => {
                  const eq = INSTALLATION_EQUIPMENT.find((e) => e.id === nodeId);
                  if (eq) {
                    setInspectedEquipmentId(eq.id);
                  } else {
                    setSelectedStageId(nodeId);
                    setActiveSubTool('MASTER_CHAIN');
                  }
                }}
              />
            )}

            {activeSubTool === 'KNOWLEDGE_MAP' && (
              <InstallationEngineeringKnowledgeExplorer
                locale={locale}
                onSelectEquipment={handleSelectEquipment}
                onNavigateToWorkbenchTab={(tabKey) => {
                  setSelectedWorkbenchStep(tabKey);
                  setActiveStage('STAGE_COMMISSIONING_DELIVERABLES');
                  setActiveSubTool('PROJECT_DESIGN_WORKBENCH');
                }}
              />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: SYSTEM SIZING & ANALYSIS                                        */}
        {/* ========================================================================= */}
        {activeStage === 'STAGE_SIZING_ANALYSIS' && (
          <div className="space-y-6">
            {activeSubTool === 'POWER_BALANCE' && (
              <ConceptualProjectDesignWorkbench 
                locale={locale} 
                initialWorkflowStep="POWER_BALANCE"
              />
            )}

            {activeSubTool === 'SHORT_CIRCUIT_IMPEDANCE' && (
              <ConceptualProjectDesignWorkbench 
                locale={locale} 
                initialWorkflowStep="SHORT_CIRCUIT_IMPEDANCE"
              />
            )}

            {activeSubTool === 'EARTHING_BALANCING' && (
              <div className="space-y-6">
                <EarthingAndNeutralExplorer
                  locale={locale}
                  selectedEarthing={selectedEarthing}
                  onSelectEarthing={setSelectedEarthing}
                  onNavigateToWorkbenchTab={(tabKey) => {
                    setSelectedWorkbenchStep(tabKey);
                    setActiveStage('STAGE_COMMISSIONING_DELIVERABLES');
                    setActiveSubTool('PROJECT_DESIGN_WORKBENCH');
                  }}
                />
                <ConceptualProjectDesignWorkbench 
                  locale={locale} 
                  initialWorkflowStep="EARTHING_TOUCH_VOLTAGE"
                />
              </div>
            )}

            {activeSubTool === 'HARMONICS_THD' && (
              <HarmonicsAndPowerQualityAnalyzer locale={locale} />
            )}

            {activeSubTool === 'FORMULAS_EXPLAINER' && (
              <InstallationFormulasExplainer locale={locale} />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: SWITCHBOARDS ARCHITECTURE & EQUIPMENT                           */}
        {/* ========================================================================= */}
        {activeStage === 'STAGE_SWITCHBOARDS_EQUIPMENT' && (
          <div className="space-y-6">
            {activeSubTool === 'TGBT_BUILDER' && (
              <InteractiveTgbtBuilder locale={locale} />
            )}

            {activeSubTool === 'PANEL_BUILDER' && (
              <InteractivePanelBuilder locale={locale} />
            )}

            {activeSubTool === 'CABLE_SIZING_K' && (
              <CableSizingDeratingMatrix locale={locale} />
            )}

            {activeSubTool === 'THERMAL_TGBT' && (
              <TgbtThermalDissipationCalculator locale={locale} />
            )}

            {activeSubTool === 'TGBT_SWITCHBOARD' && (
              <TgbtSwitchboardExplorer
                locale={locale}
                onSelectEquipment={handleSelectEquipment}
                onNavigateToWorkbenchTab={(tabKey) => {
                  setSelectedWorkbenchStep(tabKey);
                  setActiveStage('STAGE_COMMISSIONING_DELIVERABLES');
                  setActiveSubTool('PROJECT_DESIGN_WORKBENCH');
                }}
              />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 4: PROTECTION, SAFETY & SELECTIVITY                                */}
        {/* ========================================================================= */}
        {activeStage === 'STAGE_PROTECTION_SAFETY' && (
          <div className="space-y-6">
            {activeSubTool === 'SELECTIVE_TCC' && (
              <SelectiveCoordinationTccStudio locale={locale} />
            )}

            {activeSubTool === 'ARC_FLASH' && (
              <ArcFlashHazardCalculator locale={locale} />
            )}

            {activeSubTool === 'DIFF_PROTECTION_LAB' && (
              <DifferentialProtectionLab locale={locale} />
            )}

            {activeSubTool === 'SPD_LAB' && (
              <SurgeProtectionDeviceLab locale={locale} />
            )}

            {activeSubTool === 'FAULTS_SAFETY' && (
              <InstallationScenariosAndSafetyExplorer 
                locale={locale} 
                onNavigateToWorkbenchTab={(tabKey) => {
                  setSelectedWorkbenchStep(tabKey);
                  setActiveStage('STAGE_COMMISSIONING_DELIVERABLES');
                  setActiveSubTool('PROJECT_DESIGN_WORKBENCH');
                }}
              />
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 5: TESTING, COMMISSIONING & DELIVERABLES                           */}
        {/* ========================================================================= */}
        {activeStage === 'STAGE_COMMISSIONING_DELIVERABLES' && (
          <div className="space-y-6">
            {activeSubTool === 'CAD_DELIVERABLES' && (
              <PanelCadAndDeliverablesExportEngine locale={locale} />
            )}

            {activeSubTool === 'PROJECT_DESIGN_WORKBENCH' && (
              <ConceptualProjectDesignWorkbench 
                locale={locale} 
                initialWorkflowStep={selectedWorkbenchStep}
              />
            )}

            {activeSubTool === 'EQUIPMENT_CATALOG' && (
              <div className="p-5 rounded-2xl bg-[#090D15] border border-[#20293A] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                      LV APPARATUS CATALOG
                    </span>
                    <h3 className="text-base font-black text-white mt-1">
                      {isFr ? 'Catalogue Matériels Basse Tension' : 'Low-Voltage Apparatus Catalog'}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {INSTALLATION_EQUIPMENT.length} {isFr ? 'composants répertoriés' : 'components cataloged'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {INSTALLATION_EQUIPMENT.map((eq) => (
                    <div
                      key={eq.id}
                      onClick={() => handleSelectEquipment(eq.id)}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-400/50 cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {eq.category}
                        </span>
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {eq.code}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-xs">{isFr ? eq.name_fr : eq.name_en}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {isFr ? eq.purpose_fr : eq.purpose_en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTool === 'OPERATOR_FABRIC' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <div>
                      <h3 className="font-bold text-white text-sm">
                        {isFr ? 'Console de Télémétrie Opérateur & Événements Réseau' : 'Operator Console & Telemetry Stream'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {isFr ? 'Flux SCADA & alarmes en temps réel' : 'Real-time SCADA alarms and telemetry'}
                      </p>
                    </div>
                  </div>
                </div>
                <OperatorFabricStream locale={locale} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. Persistent Engineering Drawer */}
      <InstallationEngineeringDrawer
        isOpen={isEngineeringDrawerOpen}
        onClose={() => setIsEngineeringDrawerOpen(false)}
        locale={locale}
      />

      {/* 6. Asset Administration Shell (AAS) Drawer */}
      <AasDrawer
        isOpen={isAasOpen}
        onClose={() => setIsAasOpen(false)}
        locale={locale}
        equipment={inspectedComponent as any}
      />
    </div>
  );
};
