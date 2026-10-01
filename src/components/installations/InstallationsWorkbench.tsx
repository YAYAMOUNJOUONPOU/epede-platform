// src/components/installations/InstallationsWorkbench.tsx
// EPEDE D06 - Master Orchestrator for Electrical Installations & Utilization

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
  Sparkles
} from 'lucide-react';
import { OperatorFabricStream } from '../digitaltwin/OperatorFabricStream';
import { AasDrawer } from '../digitaltwin/AasDrawer';
import type { Equipment } from '../../types/epede';
import {
  InstallationCommandHeader
} from './InstallationCommandHeader';
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

// New Advanced Engineering Modules
import { MasterInstallationChainExplorer } from '../common/MasterInstallationChainExplorer';
import { FacilityArchetypesExplorer } from './FacilityArchetypesExplorer';
import { InteractiveTgbtBuilder } from './InteractiveTgbtBuilder';
import { InteractivePanelBuilder } from './InteractivePanelBuilder';
import { DifferentialProtectionLab } from './DifferentialProtectionLab';
import { SurgeProtectionDeviceLab } from './SurgeProtectionDeviceLab';
import { StructuredLoadLibrary } from './StructuredLoadLibrary';
import { InstallationFormulasExplainer } from './InstallationFormulasExplainer';

// 6 New Pro Engineering Modules
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
  // Master Orchestrator State
  const [activePillar, setActivePillar] = useState<InstallationPillar>(initialPillar || 'MASTER_CHAIN');

  useEffect(() => {
    if (initialPillar) {
      setActivePillar(initialPillar);
    }
  }, [initialPillar]);
  const [selectedArchetype, setSelectedArchetype] = useState<FacilityArchetype>('TERTIARY_COMMERCIAL');
  const [activeViewMode, setActiveViewMode] = useState<InstallationViewMode>('ELECTRICAL_SLD');
  const [selectedEarthing, setSelectedEarthing] = useState<EarthingSystemType>('TN_S');
  const [selectedRegime, setSelectedRegime] = useState<OperatingRegime>('NORMAL_GRID');

  // Journey & Equipment Selection State
  const [selectedStageId, setSelectedStageId] = useState<string>('stage-04-main-breaker');
  const [inspectedEquipmentId, setInspectedEquipmentId] = useState<string | null>(null);

  // Formulas & Norms Drawer State
  const [isEngineeringDrawerOpen, setIsEngineeringDrawerOpen] = useState<boolean>(false);
  const [isAasOpen, setIsAasOpen] = useState<boolean>(false);
  const [selectedWorkbenchStep, setSelectedWorkbenchStep] = useState<any>('POWER_BALANCE');

  const pillars: { id: InstallationPillar; label_fr: string; label_en: string; icon: any; isNew?: boolean }[] = [
    { id: 'MASTER_CHAIN', label_fr: '🔗 Chaîne Amont-Aval (11 Niveaux)', label_en: '🔗 Master Delivery Spine (11 Stages)', icon: Compass, isNew: true },
    { id: 'TGBT_BUILDER', label_fr: '⚡ Constructeur TGBT / MDB', label_en: '⚡ Interactive TGBT / MDB Builder', icon: Box, isNew: true },
    { id: 'PANEL_BUILDER', label_fr: '🎛️ Tableau Modulaire DIN', label_en: '🎛️ Modular DIN Panel Builder', icon: Sliders, isNew: true },
    { id: 'SELECTIVE_TCC', label_fr: '📈 Sélectivité & Courbes TCC (Log I-t)', label_en: '📈 Selective Coordination (TCC Studio)', icon: Activity, isNew: true },
    { id: 'ARC_FLASH', label_fr: '⚡ Risque Arc Flash & Énergie (IEEE 1584)', label_en: '⚡ Arc Flash & Incident Energy (IEEE 1584)', icon: Flame, isNew: true },
    { id: 'HARMONICS_THD', label_fr: '🌊 Harmoniques FFT & Surcharge Neutre', label_en: '🌊 Harmonics FFT & Neutral Surcharge', icon: Activity, isNew: true },
    { id: 'CABLE_SIZING_K', label_fr: '📏 Câbles & Facteurs k1-k4 (IEC 60364)', label_en: '📏 Cable Sizing & Derating k1-k4', icon: Layers, isNew: true },
    { id: 'THERMAL_TGBT', label_fr: '🔥 Bilan Thermique & Aéraulique TGBT', label_en: '🔥 TGBT Thermal Dissipation (IEC 60890)', icon: Sparkles, isNew: true },
    { id: 'CAD_DELIVERABLES', label_fr: '📑 Livrables, BOM CSV & PV Essais', label_en: '📑 Deliverables, BOM CSV & Testing Protocol', icon: FileText, isNew: true },
    { id: 'DIFF_PROTECTION_LAB', label_fr: '🧲 Labo Différentiel (RCD/RCBO)', label_en: '🧲 Differential Protection Lab', icon: Shield, isNew: true },
    { id: 'SPD_LAB', label_fr: '⚡ Labo Parafoudre (SPD 10/350 & 8/20)', label_en: '⚡ Surge Protection (SPD) Lab', icon: Zap, isNew: true },
    { id: 'FACILITY_ARCHETYPES', label_fr: '🏢 8 Archétypes de Bâtiments', label_en: '🏢 8 Facility Archetypes', icon: Layers, isNew: true },
    { id: 'LOAD_LIBRARY', label_fr: '🔌 Récepteurs & Charges (14 Cat.)', label_en: '🔌 Electrical Load Library (14 Cat.)', icon: Cpu, isNew: true },
    { id: 'FORMULAS_EXPLAINER', label_fr: '📐 Formules de Dimensionnement', label_en: '📐 Sizing Formulas & Theory', icon: BookOpen, isNew: true },
    { id: 'PROJECT_DESIGN_WORKBENCH', label_fr: '📊 Bilan & Ingénierie Projet', label_en: '📊 Project Design & Power Balance', icon: Zap },
    { id: 'KNOWLEDGE_MAP', label_fr: '📚 Référentiel & Cartographie', label_en: '📚 Knowledge Map & Taxonomy', icon: BookOpen },
    { id: 'INTERACTIVE_SLD', label_fr: 'Schéma Unifilaire Interactif', label_en: 'Interactive SLD & Power Flow', icon: Layers },
    { id: 'JOURNEY', label_fr: 'Parcours 12 Étapes Amont-Aval', label_en: '12-Stage Master Journey', icon: Compass },
    { id: 'TGBT_SWITCHBOARD', label_fr: 'TGBT & Formes de Séparation', label_en: 'TGBT & Segregation Forms', icon: Box },
    { id: 'FINAL_CIRCUITS', label_fr: 'Circuits Terminaux & Câbles', label_en: 'Final Circuits & Cables', icon: Sliders },
    { id: 'EARTHING_BALANCING', label_fr: 'Régimes de Neutre & Équilibrage', label_en: 'Earthing & Phase Balancing', icon: Scale },
    { id: 'USEFUL_ENERGY', label_fr: 'Énergie Utile & Onduleur (UPS)', label_en: 'Useful Energy & UPS / ATS', icon: Cpu },
    { id: 'FAULTS_SAFETY', label_fr: 'Scénarios Défauts & LOTO', label_en: 'Fault Scenarios & LOTO Safety', icon: AlertTriangle },
    { id: 'EQUIPMENT_CATALOG', label_fr: 'Catalogue Matériels BT', label_en: 'LV Apparatus Catalog', icon: FileText },
    { id: 'OPERATOR_FABRIC', label_fr: 'Console OperatorFabric', label_en: 'OperatorFabric Console', icon: Activity }
  ];

  const handleSelectEquipment = (eqId: string) => {
    setInspectedEquipmentId(eqId);
  };

  const inspectedComponent: InstallationComponent | undefined = INSTALLATION_EQUIPMENT.find(
    (e) => e.id === inspectedEquipmentId
  );

  return (
    <div className="space-y-4 font-mono text-xs text-slate-100">
      {/* 1. Master Command Header */}
      <InstallationCommandHeader
        locale={locale}
        activePillar={activePillar}
        onSelectPillar={(p) => setActivePillar(p as InstallationPillar)}
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

      {/* 2. Eight Pillars Navigation Bar */}
      <div className="p-2 rounded-2xl bg-[#0B0F19] border border-[#20293A] overflow-x-auto scrollbar-thin scrollbar-thumb-amber-500/20">
        <div className="flex items-center gap-1.5 min-w-[880px]">
          {pillars.map((pil) => {
            const Icon = pil.icon;
            const isSelected = pil.id === activePillar;
            return (
              <button
                key={pil.id}
                type="button"
                onClick={() => setActivePillar(pil.id)}
                className={`flex-1 py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/20 scale-[1.01]'
                    : 'bg-[#0E1522] text-slate-300 border-[#1C2538] hover:border-amber-400/50 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="text-[11px] truncate">
                  {locale === 'fr' ? pil.label_fr : pil.label_en}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Workspace Pillar View Rendering */}
      <main className="transition-all duration-150">
        {activePillar === 'MASTER_CHAIN' && (
          <MasterInstallationChainExplorer
            locale={locale}
            onNavigateToStage={(stageId) => {
              if (stageId.includes('tgbt')) setActivePillar('TGBT_BUILDER');
              else if (stageId.includes('panel')) setActivePillar('PANEL_BUILDER');
              else if (stageId.includes('load')) setActivePillar('LOAD_LIBRARY');
            }}
          />
        )}

        {activePillar === 'TGBT_BUILDER' && (
          <InteractiveTgbtBuilder locale={locale} />
        )}

        {activePillar === 'PANEL_BUILDER' && (
          <InteractivePanelBuilder locale={locale} />
        )}

        {activePillar === 'SELECTIVE_TCC' && (
          <SelectiveCoordinationTccStudio locale={locale} />
        )}

        {activePillar === 'ARC_FLASH' && (
          <ArcFlashHazardCalculator locale={locale} />
        )}

        {activePillar === 'HARMONICS_THD' && (
          <HarmonicsAndPowerQualityAnalyzer locale={locale} />
        )}

        {activePillar === 'CABLE_SIZING_K' && (
          <CableSizingDeratingMatrix locale={locale} />
        )}

        {activePillar === 'THERMAL_TGBT' && (
          <TgbtThermalDissipationCalculator locale={locale} />
        )}

        {activePillar === 'CAD_DELIVERABLES' && (
          <PanelCadAndDeliverablesExportEngine locale={locale} />
        )}

        {activePillar === 'DIFF_PROTECTION_LAB' && (
          <DifferentialProtectionLab locale={locale} />
        )}

        {activePillar === 'SPD_LAB' && (
          <SurgeProtectionDeviceLab locale={locale} />
        )}

        {activePillar === 'FACILITY_ARCHETYPES' && (
          <FacilityArchetypesExplorer locale={locale} />
        )}

        {activePillar === 'LOAD_LIBRARY' && (
          <StructuredLoadLibrary locale={locale} />
        )}

        {activePillar === 'FORMULAS_EXPLAINER' && (
          <InstallationFormulasExplainer locale={locale} />
        )}

        {activePillar === 'PROJECT_DESIGN_WORKBENCH' && (
          <ConceptualProjectDesignWorkbench 
            locale={locale} 
            initialWorkflowStep={selectedWorkbenchStep}
          />
        )}

        {activePillar === 'KNOWLEDGE_MAP' && (
          <InstallationEngineeringKnowledgeExplorer
            locale={locale}
            onSelectEquipment={handleSelectEquipment}
            onNavigateToWorkbenchTab={(tabKey) => {
              setSelectedWorkbenchStep(tabKey);
              setActivePillar('PROJECT_DESIGN_WORKBENCH');
            }}
          />
        )}

        {activePillar === 'INTERACTIVE_SLD' && (
          <InteractiveBuildingSldCanvas
            locale={locale}
            archetype={selectedArchetype}
            viewMode={activeViewMode}
            earthing={selectedEarthing}
            regime={selectedRegime}
            onSelectComponent={(nodeId) => {
              // Check if it matches an equipment in the catalog
              const eq = INSTALLATION_EQUIPMENT.find((e) => e.id === nodeId);
              if (eq) {
                setInspectedEquipmentId(eq.id);
              } else {
                setSelectedStageId(nodeId);
                setActivePillar('JOURNEY');
              }
            }}
          />
        )}

        {activePillar === 'JOURNEY' && (
          <MasterInstallationJourney
            locale={locale}
            selectedStageId={selectedStageId}
            onSelectStage={setSelectedStageId}
          />
        )}

        {activePillar === 'TGBT_SWITCHBOARD' && (
          <TgbtSwitchboardExplorer
            locale={locale}
            onSelectEquipment={handleSelectEquipment}
            onNavigateToWorkbenchTab={(tabKey) => {
              setSelectedWorkbenchStep(tabKey);
              setActivePillar('PROJECT_DESIGN_WORKBENCH');
            }}
          />
        )}

        {activePillar === 'FINAL_CIRCUITS' && (
          <DistributionBoardsAndCircuitsExplorer
            locale={locale}
            onSelectEquipment={handleSelectEquipment}
            onNavigateToWorkbenchTab={(tabKey) => {
              setSelectedWorkbenchStep(tabKey);
              setActivePillar('PROJECT_DESIGN_WORKBENCH');
            }}
          />
        )}

        {activePillar === 'EARTHING_BALANCING' && (
          <EarthingAndNeutralExplorer
            locale={locale}
            selectedEarthing={selectedEarthing}
            onSelectEarthing={setSelectedEarthing}
            onNavigateToWorkbenchTab={(tabKey) => {
              setSelectedWorkbenchStep(tabKey);
              setActivePillar('PROJECT_DESIGN_WORKBENCH');
            }}
          />
        )}

        {activePillar === 'USEFUL_ENERGY' && (
          <UsefulEnergyAndLoadsExplorer 
            locale={locale} 
            onNavigateToWorkbenchTab={(tabKey) => {
              setSelectedWorkbenchStep(tabKey);
              setActivePillar('PROJECT_DESIGN_WORKBENCH');
            }}
          />
        )}

        {activePillar === 'FAULTS_SAFETY' && (
          <InstallationScenariosAndSafetyExplorer 
            locale={locale} 
            onNavigateToWorkbenchTab={(tabKey) => {
              setSelectedWorkbenchStep(tabKey);
              setActivePillar('PROJECT_DESIGN_WORKBENCH');
            }}
          />
        )}

        {activePillar === 'EQUIPMENT_CATALOG' && (
          <div className="p-5 rounded-2xl bg-[#090D15] border border-[#20293A] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
              <div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                  LV APPARATUS CATALOG
                </span>
                <h2 className="text-sm font-bold text-white mt-1">
                  {locale === 'fr'
                    ? 'Catalogue des Matériels & Appareillages Basse Tension'
                    : 'Low-Voltage Apparatus & Switchgear Catalog'}
                </h2>
              </div>
              <span className="text-slate-400 text-xs">
                {INSTALLATION_EQUIPMENT.length} {locale === 'fr' ? 'appareillages modélisés' : 'apparatus modeled'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {INSTALLATION_EQUIPMENT.map((eq) => (
                <div
                  key={eq.id}
                  onClick={() => handleSelectEquipment(eq.id)}
                  className="p-4 rounded-xl bg-[#0D131F] border border-[#1E2738] hover:border-amber-400 cursor-pointer transition-all space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[9px] mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                        {eq.code}
                      </span>
                      <span className="text-slate-400">{eq.rating_amps}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white mb-1">
                      {locale === 'fr' ? eq.name_fr : eq.name_en}
                    </h3>
                    <p className="text-[10px] text-slate-300 font-sans line-clamp-2 leading-relaxed">
                      {locale === 'fr' ? eq.purpose_fr : eq.purpose_en}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1C2538] flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">{eq.nominal_voltage}</span>
                    <span className="text-amber-400 font-bold">
                      {locale === 'fr' ? 'Inspecter ➔' : 'Inspect ➔'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePillar === 'OPERATOR_FABRIC' && (
          <div className="space-y-6">
            <OperatorFabricStream
              locale={locale}
              onInspectAas={(assetId) => {
                setInspectedEquipmentId(assetId);
                setIsAasOpen(true);
              }}
            />
          </div>
        )}
      </main>

      {/* 4. Apparatus Deep Technical Inspector Modal */}
      {inspectedComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-mono text-xs">
          <div className="w-full max-w-3xl max-h-[90vh] bg-[#0A0E17] border border-[#20293A] rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#1E2638] flex items-center justify-between bg-[#080B12]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-xs">
                  {inspectedComponent.code}
                </span>
                <h3 className="text-sm font-bold text-white">
                  {locale === 'fr' ? inspectedComponent.name_fr : inspectedComponent.name_en}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedEquipmentId(null)}
                className="p-1.5 rounded-lg bg-[#141C2B] text-slate-400 hover:text-white border border-[#20293A] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-amber-500/20">
              {/* Ratings Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-[#0E1522] border border-[#1E2738] text-[10px]">
                <div>
                  <span className="text-slate-400 block text-[9px]">Courant Assigné :</span>
                  <strong className="text-amber-400">{inspectedComponent.rating_amps}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">Tension Nominale :</span>
                  <strong className="text-white">{inspectedComponent.nominal_voltage}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">Pouvoir de Coupure :</span>
                  <strong className="text-emerald-400">
                    {inspectedComponent.breaking_capacity || 'N/A'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">Indice Protection :</span>
                  <strong className="text-sky-400">{inspectedComponent.ip_ik_rating}</strong>
                </div>
              </div>

              {/* Purpose & Principle */}
              <div className="space-y-2 text-[11px]">
                <div className="p-3 rounded-lg bg-[#0E1522] border border-[#1E2738]">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    {locale === 'fr' ? 'Rôle & Finalité Électrotechnique :' : 'Purpose & Electrotechnical Role:'}
                  </span>
                  <p className="text-slate-200 font-sans leading-relaxed">
                    {locale === 'fr' ? inspectedComponent.purpose_fr : inspectedComponent.purpose_en}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#0E1522] border border-[#1E2738]">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                    {locale === 'fr' ? 'Principe de Fonctionnement :' : 'Operating Principle:'}
                  </span>
                  <p className="text-slate-200 font-sans leading-relaxed">
                    {locale === 'fr'
                      ? inspectedComponent.operating_principle_fr
                      : inspectedComponent.operating_principle_en}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#0E1522] border border-[#1E2738]">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    {locale === 'fr' ? 'Construction & Matériaux :' : 'Physical Construction:'}
                  </span>
                  <p className="text-slate-200 font-sans leading-relaxed">
                    {locale === 'fr'
                      ? inspectedComponent.physical_construction_fr
                      : inspectedComponent.physical_construction_en}
                  </p>
                </div>
              </div>

              {/* Failure Modes & Safety Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded-lg bg-[#0E1522] border border-[#1E2738] space-y-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                    {locale === 'fr' ? 'Modes de Défaillance :' : 'Failure Modes:'}
                  </span>
                  <ul className="space-y-1 text-slate-300 font-sans">
                    {(locale === 'fr'
                      ? inspectedComponent.failure_modes_fr
                      : inspectedComponent.failure_modes_en
                    ).map((m, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <AlertTriangle className="h-3 w-3 text-rose-400 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-[#0E1522] border border-[#1E2738] space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    {locale === 'fr' ? 'Consignes de Sécurité LOTO :' : 'Safety & LOTO Rules:'}
                  </span>
                  <ul className="space-y-1 text-slate-300 font-sans">
                    {(locale === 'fr'
                      ? inspectedComponent.safety_precautions_fr
                      : inspectedComponent.safety_precautions_en
                    ).map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Shield className="h-3 w-3 text-amber-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Standards */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400">Normes :</span>
                {inspectedComponent.standards.map((std, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-bold border border-sky-800 text-[10px]"
                  >
                    {std}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-[#1E2638] bg-[#080B12] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsAasOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold hover:bg-cyan-500/30 flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Jumeau Numérique AAS v3 (IEC 63278)' : 'AAS v3 Digital Twin'}</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectedEquipmentId(null)}
                className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 cursor-pointer"
              >
                {locale === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Formulas & Norms Side Drawer */}
      <InstallationEngineeringDrawer
        locale={locale}
        isOpen={isEngineeringDrawerOpen}
        onClose={() => setIsEngineeringDrawerOpen(false)}
        onOpenKnowledgeMap={() => setActivePillar('KNOWLEDGE_MAP')}
      />

      {/* 6. AAS v3 Slide-over Drawer */}
      <AasDrawer
        equipment={inspectedComponent ? {
          id: inspectedComponent.id,
          domain_id: 'D06',
          domain_code: 'D06',
          entity_type: inspectedComponent.category,
          name_fr: inspectedComponent.name_fr,
          name_en: inspectedComponent.name_en,
          aliases_fr: [inspectedComponent.code],
          aliases_en: [inspectedComponent.code],
          description_fr: inspectedComponent.purpose_fr,
          description_en: inspectedComponent.purpose_en,
          function_fr: inspectedComponent.purpose_fr,
          function_en: inspectedComponent.purpose_en,
          typical_location_fr: 'TGBT & Tableau de Distribution BT',
          typical_location_en: 'Main LV Switchboard & Distribution Panel',
          voltage_level: 'LV',
          is_safety_critical: true,
          hazard_level: 'low_voltage',
          technical: {
            'Courant assigné In': inspectedComponent.rating_amps,
            'Tension nominale Un': inspectedComponent.nominal_voltage,
            'Indice de protection IP/IK': inspectedComponent.ip_ik_rating,
            ...(inspectedComponent.breaking_capacity ? { 'Pouvoir de coupure Icu': inspectedComponent.breaking_capacity } : {}),
            ...(inspectedComponent.internal_form ? { 'Forme de séparation': inspectedComponent.internal_form } : {})
          }
        } : null}
        isOpen={isAasOpen && !!inspectedComponent}
        onClose={() => setIsAasOpen(false)}
        locale={locale}
      />
    </div>
  );
};
