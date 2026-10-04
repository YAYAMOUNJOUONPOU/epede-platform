// src/components/transmission/TransmissionWorkbench.tsx
// EPEDE D03 - Transmission Networks Master Engineering Workbench & 5-Stage Journey Orchestrator

import React, { useState } from 'react';
import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';
import {
  Zap,
  FolderTree,
  Layers,
  FileCode2,
  Compass,
  Network,
  ShieldAlert,
  Activity,
  Share2,
  Scale,
  GitPullRequest,
  Sliders,
  Calculator,
  Search,
  LayoutGrid,
  ListFilter,
  CheckCircle2,
  Radio,
  Sparkles,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Cpu,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  MapPin,
  FileCheck
} from 'lucide-react';
import {
  TransmissionCommandHeader,
  TransmissionTechnology,
  TransmissionVoltageContext
} from './TransmissionCommandHeader';
import { MasterTransmissionJourney } from './MasterTransmissionJourney';
import { OverheadLineExplorerTree } from './OverheadLineExplorerTree';
import { UndergroundCableExplorerTree } from './UndergroundCableExplorerTree';
import { VoltageLevelExplorer } from './VoltageLevelExplorer';
import { OverheadUndergroundComparison } from './OverheadUndergroundComparison';
import { EquipmentObjectSchemaInspector } from './EquipmentObjectSchemaInspector';
import { PhysicalElectricalFunctionalViews } from './PhysicalElectricalFunctionalViews';
import { RelationshipAndStateModel } from './RelationshipAndStateModel';
import { ProtectionAndTelecomOverlay } from './ProtectionAndTelecomOverlay';
import { TransmissionScenarioSimulator } from './TransmissionScenarioSimulator';
import { TransmissionPlanningInterface } from './TransmissionPlanningInterface';
import { EpedeDataReuseMap } from './EpedeDataReuseMap';
import { EngineeringPrinciplesDrawer } from './EngineeringPrinciplesDrawer';
import { EngineeringInfographicCard } from '../common/EngineeringInfographicCard';
import { EngineeringInfographicsModal } from '../common/EngineeringInfographicsModal';

// Specialized Labs & Engines
import { DynamicLineRatingLab } from './DynamicLineRatingLab';
import { SurgeImpedanceAndFerrantiLab } from './SurgeImpedanceAndFerrantiLab';
import { HvdcAndFactsWorkbench } from './HvdcAndFactsWorkbench';
import { AdvancedDistanceRelayLab } from './AdvancedDistanceRelayLab';
import { CameroonTransmissionCorridorEngine } from './modules/CameroonTransmissionCorridorEngine';
import { InteractiveCatenarySagCanvas } from './modules/InteractiveCatenarySagCanvas';
import { TransmissionDeliverablesExportEngine } from './modules/TransmissionDeliverablesExportEngine';

// Central Reactive Data Mesh Store
import {
  useTransmissionProjectStore,
  CAMEROON_TRANSMISSION_CORRIDORS
} from './services/useTransmissionProjectStore';

export type TransmissionWorkbenchPillar =
  | 'JOURNEY'
  | 'OHL_EXPLORER'
  | 'UGC_EXPLORER'
  | 'VOLTAGE_EXPLORER'
  | 'COMPARISON'
  | 'VIEWS'
  | 'RELATIONSHIPS'
  | 'PROTECTION'
  | 'SCENARIOS'
  | 'PLANNING'
  | 'SCHEMA'
  | 'DATA_REUSE'
  | 'DLR_LAB'
  | 'SIL_FERRANTI'
  | 'HVDC_FACTS'
  | 'DISTANCE_RELAY_LAB';

interface TransmissionWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (equipmentId: string) => void;
}

export const TransmissionWorkbench: React.FC<TransmissionWorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  // 1. Reactive Central Data Store
  const store = useTransmissionProjectStore('CORRIDOR_SONG_LOULOU_BEKOKO');

  // 2. UI Navigation & Drawer Controllers
  const [selectedTechnology, setSelectedTechnology] = useState<TransmissionTechnology>('OVERHEAD_LINE');
  const [isPrinciplesDrawerOpen, setIsPrinciplesDrawerOpen] = useState<boolean>(false);
  const [modalInfographicId, setModalInfographicId] = useState<string | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);

  // Sub-Tab Navigation inside each of the 5 Stages
  const [stage1Tab, setStage1Tab] = useState<'CORRIDORS' | 'JOURNEY' | 'VOLTAGE_LEVELS' | 'PLANNING'>('CORRIDORS');
  const [stage2Tab, setStage2Tab] = useState<'CATENARY_SAG' | 'OHL_EXPLORER' | 'STRUCTURAL_VIEWS'>('CATENARY_SAG');
  const [stage3Tab, setStage3Tab] = useState<'SIL_FERRANTI' | 'SCENARIOS' | 'SCHEMA_RELATIONSHIPS'>('SIL_FERRANTI');
  const [stage4Tab, setStage4Tab] = useState<'DLR_LAB' | 'UGC_EXPLORER' | 'OHL_UGC_BENCHMARK' | 'HVDC_FACTS'>('DLR_LAB');
  const [stage5Tab, setStage5Tab] = useState<'DOSSIER_BOQ' | 'DISTANCE_RELAY' | 'PROTECTION_TELECOM' | 'DATA_REUSE'>('DOSSIER_BOQ');

  return (
    <div className="space-y-6 font-mono">
      
      {/* 0. Authoritative Ecosystem Reference Hero (Page 2: Transmission Network) */}
      <AuthoritativeEcosystemHero
        stage="transmission"
        locale={locale}
        onNavigateToDomain={(dCode) => onNavigate?.('domain', dCode)}
        onSelectEquipment={onSelectEquipment}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
        activePillarLabel={
          store.activeStage === 1 ? (locale === 'fr' ? 'Étape 1 : Corridors & Niveaux Tension' : 'Stage 1: Corridors & Voltages') :
          store.activeStage === 2 ? (locale === 'fr' ? 'Étape 2 : Pylônes & Flèche Caténaire' : 'Stage 2: Towers & Catenary Sag') :
          store.activeStage === 3 ? (locale === 'fr' ? 'Étape 3 : Propagation d’Onde & SIL' : 'Stage 3: Wave Propagation & SIL') :
          store.activeStage === 4 ? (locale === 'fr' ? 'Étape 4 : Ampacité DLR & Câbles/HVDC' : 'Stage 4: DLR Ampacity & Cables/HVDC') :
          (locale === 'fr' ? 'Étape 5 : Protections & Dossier SAT' : 'Stage 5: Protection & SAT Dossier')
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
                  <Layers className="w-4 h-4 text-sky-400" />
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

              {/* Quick Active Corridor Telemetry */}
              <div className="p-2.5 rounded-xl bg-[#0E141F] border border-sky-500/30 text-[11px] space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">{locale === 'fr' ? 'Corridor Actif' : 'Active Corridor'}</div>
                <div className="font-bold text-sky-300 truncate">{store.activeCorridor.name_fr.split('(')[0]}</div>
                <div className="text-[10px] text-slate-400">
                  {store.voltage} • {store.lineLengthKm} km • SIL {store.linePhysics.silMw} MW
                </div>
              </div>

              {/* 5 Stages Navigation List */}
              <div className="space-y-1.5">
                {[
                  { stage: 1 as const, title_fr: '1. Corridors & Tension', title_en: '1. Corridors & Voltages', desc: 'Tracés, Climat & Niveaux' },
                  { stage: 2 as const, title_fr: '2. Pylônes & Flèche', title_en: '2. Towers & Catenary Sag', desc: 'CEI 60826 & Gabarit Sol' },
                  { stage: 3 as const, title_fr: '3. Propagation & SIL', title_en: '3. Waves, SIL & Ferranti', desc: 'Lignes Longues & Shunt' },
                  { stage: 4 as const, title_fr: '4. Ampacité DLR & Câbles', title_en: '4. DLR Ampacity & Cables', desc: 'IEEE 738, XLPE & FACTS' },
                  { stage: 5 as const, title_fr: '5. Protections & DQE', title_en: '5. Protection & BOQ', desc: 'Distance 21, OPGW & DQE' }
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
                          {locale === 'fr' ? st.title_fr : st.title_en}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {st.desc}
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-400' : 'text-slate-600'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Direct Jump to BOQ & Principles Drawer */}
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
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090D14] border border-[#222B38] hover:border-sky-500/50 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer shadow-md"
            >
              <PanelLeftOpen className="w-4 h-4 text-sky-400" />
              <span>{locale === 'fr' ? 'Ouvrir le Navigateur d’Ingénierie Lignes' : 'Open Transmission Navigator'}</span>
            </button>
          )}

          {/* 1. Master Transmission Command Header */}
          <TransmissionCommandHeader
            locale={locale}
            activeStage={store.activeStage}
            onSelectStage={(st) => store.setActiveStage(st)}
            selectedTechnology={selectedTechnology}
            onSelectTechnology={setSelectedTechnology}
            selectedVoltage={store.voltage as any}
            onSelectVoltage={(v) => store.setVoltage(v as any)}
            selectedCorridorId={store.selectedCorridorId}
            onSelectCorridor={(corrId) => store.selectCorridor(corrId)}
            onOpenPrinciplesDrawer={() => setIsPrinciplesDrawerOpen(true)}
            onOpenDossier={() => {
              store.setActiveStage(5);
              setStage5Tab('DOSSIER_BOQ');
            }}
            lineLengthKm={store.lineLengthKm}
            silMw={store.linePhysics.silMw}
          />

          {/* 2. DYNAMIC STAGE WORKSPACE VIEW */}
          <div className="transition-all duration-200 space-y-6">

            {/* ========================================================
                STAGE 1: CORRIDORS, NIVEAUX DE TENSION & TRACÉS
               ======================================================== */}
            {store.activeStage === 1 && (
              <div className="space-y-5">
                {/* Stage 1 Sub-Tab Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
                  <button
                    type="button"
                    onClick={() => setStage1Tab('CORRIDORS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage1Tab === 'CORRIDORS'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '1. Corridors Nationaux Cameroun (SONATREL)' : '1. Cameroon Grid Corridors (SONATREL)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage1Tab('JOURNEY')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage1Tab === 'JOURNEY'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '2. Parcours Énergétique (8 Étapes)' : '2. Power Transfer Journey (8 Steps)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage1Tab('VOLTAGE_LEVELS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage1Tab === 'VOLTAGE_LEVELS'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '3. Niveaux de Tension (400 / 225 / 110 / 90 kV)' : '3. Voltage Hierarchy (400 / 225 / 110 / 90 kV)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage1Tab('PLANNING')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage1Tab === 'PLANNING'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <GitPullRequest className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '4. Critère de Sécurité N-1 & Planification' : '4. Deterministic N-1 & Planning'}</span>
                  </button>
                </div>

                {stage1Tab === 'CORRIDORS' && (
                  <CameroonTransmissionCorridorEngine
                    locale={locale}
                    selectedCorridorId={store.selectedCorridorId}
                    onSelectCorridor={store.selectCorridor}
                    onNavigateToStage={(st) => store.setActiveStage(st)}
                  />
                )}

                {stage1Tab === 'JOURNEY' && (
                  <div className="space-y-6">
                    <EngineeringInfographicCard
                      infographicId="transmission_corridor"
                      locale={locale}
                      onOpenModal={(id) => setModalInfographicId(id)}
                    />
                    <MasterTransmissionJourney
                      locale={locale}
                      onSelectEquipment={onSelectEquipment}
                    />
                  </div>
                )}

                {stage1Tab === 'VOLTAGE_LEVELS' && (
                  <VoltageLevelExplorer
                    locale={locale}
                    activeVoltage={store.voltage}
                    onSelectVoltage={store.setVoltage}
                  />
                )}

                {stage1Tab === 'PLANNING' && (
                  <TransmissionPlanningInterface locale={locale} />
                )}
              </div>
            )}

            {/* ========================================================
                STAGE 2: PYLÔNES, ISOLATEURS & FLÈCHE CATÉNAIRE
               ======================================================== */}
            {store.activeStage === 2 && (
              <div className="space-y-5">
                {/* Stage 2 Sub-Tab Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
                  <button
                    type="button"
                    onClick={() => setStage2Tab('CATENARY_SAG')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage2Tab === 'CATENARY_SAG'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '1. Simulateur Flèche Caténaire & Gabarit Sol (CEI 60826)' : '1. Catenary Sag & Ground Clearance (IEC 60826)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage2Tab('OHL_EXPLORER')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage2Tab === 'OHL_EXPLORER'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <FolderTree className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '2. Pylônes Treillis & Faisceaux Aster' : '2. Steel Lattice Towers & Aster Bundles'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage2Tab('STRUCTURAL_VIEWS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage2Tab === 'STRUCTURAL_VIEWS'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '3. Vues CAO Tri-Dimensionnelles & Schéma Électrique' : '3. CAD Elevation & Electrical Model'}</span>
                  </button>
                </div>

                {stage2Tab === 'CATENARY_SAG' && (
                  <InteractiveCatenarySagCanvas
                    locale={locale}
                    voltage={store.voltage}
                  />
                )}

                {stage2Tab === 'OHL_EXPLORER' && (
                  <OverheadLineExplorerTree
                    locale={locale}
                    onSelectEquipment={onSelectEquipment}
                  />
                )}

                {stage2Tab === 'STRUCTURAL_VIEWS' && (
                  <PhysicalElectricalFunctionalViews
                    locale={locale}
                  />
                )}
              </div>
            )}

            {/* ========================================================
                STAGE 3: PROPAGATION D'ONDE, SIL & EFFET FERRANTI
               ======================================================== */}
            {store.activeStage === 3 && (
              <div className="space-y-5">
                {/* Stage 3 Sub-Tab Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
                  <button
                    type="button"
                    onClick={() => setStage3Tab('SIL_FERRANTI')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage3Tab === 'SIL_FERRANTI'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '1. Laboratoire SIL & Effet Ferranti (CIGRÉ TB 207)' : '1. SIL & Ferranti Effect Lab (CIGRE TB 207)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage3Tab('SCENARIOS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage3Tab === 'SCENARIOS'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '2. Simulateur de 16 Scénarios d’Incidents Réseau' : '2. 16 Grid Contingency Scenarios'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage3Tab('SCHEMA_RELATIONSHIPS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage3Tab === 'SCHEMA_RELATIONSHIPS'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '3. Modèle d’États & Relations Système' : '3. System States & Relationships'}</span>
                  </button>
                </div>

                {stage3Tab === 'SIL_FERRANTI' && (
                  <SurgeImpedanceAndFerrantiLab locale={locale} />
                )}

                {stage3Tab === 'SCENARIOS' && (
                  <TransmissionScenarioSimulator locale={locale} />
                )}

                {stage3Tab === 'SCHEMA_RELATIONSHIPS' && (
                  <div className="space-y-6">
                    <RelationshipAndStateModel locale={locale} />
                    <EquipmentObjectSchemaInspector locale={locale} />
                  </div>
                )}
              </div>
            )}

            {/* ========================================================
                STAGE 4: AMPACITÉ DYNAMIQUE DLR, CÂBLES & HVDC/FACTS
               ======================================================== */}
            {store.activeStage === 4 && (
              <div className="space-y-5">
                {/* Stage 4 Sub-Tab Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#222B38]">
                  <button
                    type="button"
                    onClick={() => setStage4Tab('DLR_LAB')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage4Tab === 'DLR_LAB'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '1. Laboratoire DLR Ampacité Dynamique (IEEE 738)' : '1. Dynamic Line Rating Lab (IEEE 738)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage4Tab('UGC_EXPLORER')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage4Tab === 'UGC_EXPLORER'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '2. Câbles Souterrains XLPE (CEI 60840 / 62067)' : '2. XLPE Underground Cables (IEC 60840)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage4Tab('OHL_UGC_BENCHMARK')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage4Tab === 'OHL_UGC_BENCHMARK'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '3. Matrice Comparative OHL vs UGC (16 Critères)' : '3. OHL vs UGC Benchmark (16 Criteria)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage4Tab('HVDC_FACTS')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage4Tab === 'HVDC_FACTS'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '4. Liaisons HVDC & Compensateurs FACTS' : '4. HVDC Links & FACTS Controllers'}</span>
                  </button>
                </div>

                {stage4Tab === 'DLR_LAB' && (
                  <DynamicLineRatingLab locale={locale} />
                )}

                {stage4Tab === 'UGC_EXPLORER' && (
                  <UndergroundCableExplorerTree
                    locale={locale}
                    onSelectEquipment={onSelectEquipment}
                  />
                )}

                {stage4Tab === 'OHL_UGC_BENCHMARK' && (
                  <OverheadUndergroundComparison locale={locale} />
                )}

                {stage4Tab === 'HVDC_FACTS' && (
                  <HvdcAndFactsWorkbench locale={locale} />
                )}
              </div>
            )}

            {/* ========================================================
                STAGE 5: PROTECTIONS DE LIGNE, OPGW & DOSSIER DQE
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
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '1. Dossier d’Ingénierie & DQE (FCFA)' : '1. Engineering Dossier & BOQ (FCFA)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage5Tab('DISTANCE_RELAY')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage5Tab === 'DISTANCE_RELAY'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '2. Protection de Distance 21 (Plan R-X Quad/Mho)' : '2. Distance Relay 21 (R-X Plane Quad/Mho)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage5Tab('PROTECTION_TELECOM')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage5Tab === 'PROTECTION_TELECOM'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '3. Téléprotection POTT/PUTT & Câble OPGW' : '3. Teleprotection POTT/PUTT & OPGW'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage5Tab('DATA_REUSE')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      stage5Tab === 'DATA_REUSE'
                        ? 'bg-sky-400 text-slate-950 shadow-md'
                        : 'bg-[#0E141F] text-slate-400 hover:text-white border border-[#222B38]'
                    }`}
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? '4. Interconnexions Plateforme EPEDE' : '4. EPEDE Data Interconnections'}</span>
                  </button>
                </div>

                {stage5Tab === 'DOSSIER_BOQ' && (
                  <TransmissionDeliverablesExportEngine
                    locale={locale}
                    selectedCorridorId={store.selectedCorridorId}
                    voltage={store.voltage}
                    technology={store.technology}
                    lineLengthKm={store.lineLengthKm}
                    circuitType={store.circuitType}
                    bundleType={store.bundleType}
                    linePhysics={store.linePhysics}
                  />
                )}

                {stage5Tab === 'DISTANCE_RELAY' && (
                  <AdvancedDistanceRelayLab locale={locale} />
                )}

                {stage5Tab === 'PROTECTION_TELECOM' && (
                  <ProtectionAndTelecomOverlay locale={locale} />
                )}

                {stage5Tab === 'DATA_REUSE' && (
                  <EpedeDataReuseMap locale={locale} />
                )}
              </div>
            )}

          </div>

        </main>
      </div>

      {/* 4. Mathematical Engineering Principles Drawer */}
      <EngineeringPrinciplesDrawer
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
