// src/components/layout/Sidebar.tsx
// EPEDE Minimal Engineering Sidebar per Directive
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DOMAINS, LAYERS } from '../../data/epedeData';
import type { DomainCode, LayerCode } from '../../types/epede';
import type { SldTopologyType } from '../diagrams/modules/SldHeaderToolbar';
import { Activity, Zap, Calculator, Cpu, BookOpen, Clock, Globe, Scale, Sparkles, Layers, Waves, Factory, Users, X, Compass, Box, ShieldAlert, ShieldCheck, CheckSquare } from 'lucide-react';

interface SidebarProps {
  locale: 'fr' | 'en';
  isOpen: boolean;
  onClose: () => void;
  activeDomainCode?: DomainCode | null;
  activeLayerCode?: LayerCode | null;
  onSelectDomain: (code: DomainCode) => void;
  onSelectLayer: (code: LayerCode) => void;
  onNavigateJourney?: () => void;
  onNavigateEquipmentReference?: () => void;
  onNavigateDiagrams?: (topology?: SldTopologyType) => void;
  onNavigateSimulation?: () => void;
  onNavigateCalculators?: () => void;
  onNavigatePhase2?: () => void;
  onNavigateLifecycle?: () => void;
  onNavigateCameroonGrid?: () => void;
  onNavigateRegulatory?: () => void;
  onNavigateContextStack?: () => void;
  onNavigateHydropower?: () => void;
  onNavigateIndustrialProjects?: () => void;
  onNavigateEngineersChain?: () => void;
  onNavigateEcosystem?: () => void;
  onNavigateArchitectures?: () => void;
  onNavigateProtection?: () => void;
  onNavigateCommissioning?: () => void;
  onNavigateKnowledgeGraph?: () => void;
  onNavigateFollowTheEnergy?: () => void;
  onNavigateScenarios?: () => void;
  onNavigateTraceability?: () => void;
  onNavigateThematicJourneys?: () => void;
  onNavigateAssetManagement?: () => void;
  currentView?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  locale,
  isOpen,
  onClose,
  activeDomainCode,
  activeLayerCode,
  onSelectDomain,
  onSelectLayer,
  onNavigateJourney,
  onNavigateEquipmentReference,
  onNavigateDiagrams,
  onNavigateSimulation,
  onNavigateCalculators,
  onNavigatePhase2,
  onNavigateLifecycle,
  onNavigateCameroonGrid,
  onNavigateRegulatory,
  onNavigateContextStack,
  onNavigateHydropower,
  onNavigateIndustrialProjects,
  onNavigateEngineersChain,
  onNavigateEcosystem,
  onNavigateArchitectures,
  onNavigateProtection,
  onNavigateCommissioning,
  onNavigateKnowledgeGraph,
  onNavigateFollowTheEnergy,
  onNavigateScenarios,
  onNavigateTraceability,
  onNavigateThematicJourneys,
  onNavigateAssetManagement,
  currentView,
}) => {
  const chainDomains = DOMAINS.filter((d) => d.domain_group === 'chain');
  const disciplineDomains = DOMAINS.filter((d) => d.domain_group === 'discipline');

  const content = (
    <div className="h-full flex flex-col justify-between bg-gradient-to-b from-[#060A14] via-[#040710] to-[#02040A] backdrop-blur-xl text-slate-100 w-72 border-r border-white/[0.08] overflow-y-auto font-mono text-xs shadow-2xl">
      <div className="p-4 space-y-6">
        
        {/* Section 0: Interactive Exploration & Discovery Tools */}
        <div>
          <div className="px-2 pb-2 flex items-center justify-between border-b border-slate-800">
            <span className="font-mono text-[11px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Compass className="h-3 w-3" />
              <span>{locale === 'fr' ? 'OUTILS & EXPLORATION INTERACTIVE' : 'INTERACTIVE TOOLS & EXPLORATION'}</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title={locale === 'fr' ? 'Réduire le volet' : 'Collapse panel'}
              aria-label={locale === 'fr' ? 'Réduire le volet' : 'Collapse panel'}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 space-y-4">
            
            {/* Cluster 1: Ateliers Réseaux & Systèmes */}
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 bg-cyan-950/40 rounded-md border border-cyan-900/40">
                <span>⚡</span>
                <span>{locale === 'fr' ? 'ATELIERS RÉSEAUX & SYSTÈMES' : 'GRID & SYSTEM WORKBENCHES'}</span>
              </div>

              {/* 3D Electrical Energy Ecosystem */}
              <button
                type="button"
                onClick={() => {
                  onNavigateEcosystem?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'ecosystem'
                    ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/60 shadow-md shadow-cyan-500/20'
                    : 'text-slate-200 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'ecosystem' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-cyan-400 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-black">⚡</span>
                  <span className="font-bold text-white">
                    {locale === 'fr' ? 'Écosystème Énergétique 3D' : '3D Electrical Ecosystem'}
                  </span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-black border border-cyan-500/40">
                  3D
                </span>
              </button>

              {/* SLD Diagram */}
              <button
                type="button"
                onClick={() => {
                  onNavigateDiagrams?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'diagrams'
                    ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'diagrams' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-amber-400" />
                  <span>{locale === 'fr' ? 'Schéma SLD Unifilaire (CAD)' : 'Single-Line SLD (CAD)'}</span>
                </div>
                <span className="text-[10px] text-amber-400 font-bold">CAD</span>
              </button>

              {/* Cameroon National Grid */}
              <button
                type="button"
                data-testid="sidebar-tool-cameroon-grid"
                onClick={() => {
                  if (onNavigateCameroonGrid) onNavigateCameroonGrid();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'cameroon-grid'
                    ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'cameroon-grid' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Réseau National Cameroun (RIS/RIN)' : 'Cameroon Grid (RIS/RIN)'}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">225 kV</span>
              </button>

              {/* Hydropower Digital Twin */}
              <button
                type="button"
                onClick={() => {
                  onNavigateHydropower?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'hydropower'
                    ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'hydropower' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Waves className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{locale === 'fr' ? 'Jumeau Hydro (Songloulou 384 MW)' : 'Hydro Twin (Songloulou 384 MW)'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  HYDRO
                </span>
              </button>

              {/* Substation Architectures & TCO Comparator */}
              <button
                type="button"
                onClick={() => {
                  onNavigateArchitectures?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'architectures'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'architectures' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-emerald-400 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Scale className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-bold text-white">{locale === 'fr' ? 'Architectures Postes AIS/GIS & TCO' : 'Substation Architectures & TCO'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30">
                  AIS/GIS
                </span>
              </button>

              {/* Industrial Projects & Field Case Studies */}
              <button
                type="button"
                onClick={() => {
                  onNavigateIndustrialProjects?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'industrial-projects'
                    ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'industrial-projects' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Factory className="h-3.5 w-3.5 text-sky-400" />
                  <span>{locale === 'fr' ? 'Projets Industriels & Chantiers' : 'Industrial Projects & Field Cases'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                  FIELD
                </span>
              </button>

              {/* Engineers by Domain / Roles */}
              <button
                type="button"
                onClick={() => {
                  onNavigateEngineersChain?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'engineers-chain'
                    ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'engineers-chain' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-amber-400" />
                  <span>{locale === 'fr' ? 'Chaîne des Métiers & Experts' : 'Engineering Roles & Careers'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black border border-amber-500/30">
                  35+ ROLES
                </span>
              </button>
            </div>

            {/* Cluster 2: Calculs, Essais & Diagnostics */}
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5 bg-amber-950/40 rounded-md border border-amber-900/40">
                <span>🔬</span>
                <span>{locale === 'fr' ? 'CALCULS, ESSAIS & DIAGNOSTICS' : 'CALCULATORS, TESTS & DIAGNOSTICS'}</span>
              </div>

              {/* Calculators */}
              <button
                type="button"
                onClick={() => {
                  onNavigateCalculators?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'calculators'
                    ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'calculators' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Calculator className="h-3.5 w-3.5 text-amber-400" />
                  <span>{locale === 'fr' ? '17 Calculateurs CEI / IEEE' : '17 IEC / IEEE Calculators'}</span>
                </div>
                <span className="text-[10px] text-amber-400 font-bold">SOLVERS</span>
              </button>

              {/* Simulation Lab */}
              <button
                type="button"
                onClick={() => {
                  onNavigateSimulation?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'simulation'
                    ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'simulation' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>{locale === 'fr' ? '19 Labs Transitoires & Oscilloscope' : '19 Simulation Labs & Scope'}</span>
                </div>
                <span className="text-[10px] text-amber-400 font-bold">SIM</span>
              </button>

              {/* Protection Engineering Studio */}
              <button
                type="button"
                onClick={() => {
                  onNavigateProtection?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'protection'
                    ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'protection' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-red-400 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
                  <span className="font-bold text-white">{locale === 'fr' ? 'Coordination Protections (TCC)' : 'Protection Studio & TCC'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-black border border-red-500/30">
                  50/51/87
                </span>
              </button>

              {/* Commissioning FAT / SAT Workbench */}
              <button
                type="button"
                onClick={() => {
                  onNavigateCommissioning?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'commissioning'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'commissioning' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-cyan-400 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="font-bold text-white">{locale === 'fr' ? 'Contrôle FAT / SAT & PV CEI 61439' : 'FAT / SAT & Commissioning'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-black border border-cyan-500/30">
                  PV PDF
                </span>
              </button>

              {/* Asset Management & DGA Diagnostics */}
              <button
                type="button"
                onClick={() => {
                  onNavigateAssetManagement?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'asset-management'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'asset-management' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-400 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-amber-400" />
                  <span className="font-bold text-white">{locale === 'fr' ? "Gestion d'Actifs & DGA (Duval)" : 'Asset Management & DGA'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black border border-amber-500/30">
                  CEI 60599
                </span>
              </button>
            </div>

            {/* Cluster 3: Référentiels, Graphes & Parcours */}
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5 bg-purple-950/40 rounded-md border border-purple-900/40">
                <span>📚</span>
                <span>{locale === 'fr' ? 'RÉFÉRENTIELS, GRAPHES & PARCOURS' : 'REFERENCES, GRAPHS & JOURNEYS'}</span>
              </div>

              {/* Real-World Electrical Equipment Reference */}
              <button
                type="button"
                onClick={() => {
                  onNavigateEquipmentReference?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'equipment-reference'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'equipment-reference' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Box className="h-3.5 w-3.5 text-amber-400" />
                  <span className="font-bold text-white">{locale === 'fr' ? 'Matériel Électrique Réel & Écorchés' : 'Electrical Equipment Reference'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30">
                  CATALOG
                </span>
              </button>

              {/* Follow the Energy (8 Stages & 4 Flows) */}
              <button
                type="button"
                onClick={() => {
                  onNavigateFollowTheEnergy?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'follow-the-energy'
                    ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-500/60 shadow-md shadow-amber-500/20'
                    : 'text-slate-200 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'follow-the-energy' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-400 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span className="font-bold text-white">
                    {locale === 'fr' ? 'Follow the Energy (4 Flux)' : 'Follow the Energy (4 Flows)'}
                  </span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black border border-amber-500/40">
                  4 FLUX
                </span>
              </button>

              {/* Knowledge Graph Explorer */}
              <button
                type="button"
                onClick={() => {
                  onNavigateKnowledgeGraph?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'knowledge-graph'
                    ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/60 shadow-md shadow-cyan-500/20'
                    : 'text-slate-200 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'knowledge-graph' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-cyan-400 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Compass className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="font-bold text-white">
                    {locale === 'fr' ? 'Knowledge Graph Explorer' : 'Knowledge Graph Explorer'}
                  </span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-black border border-purple-500/40">
                  GRAPH
                </span>
              </button>

              {/* Pedagogical Scenarios & SCADA Incident Replay */}
              <button
                type="button"
                onClick={() => {
                  onNavigateScenarios?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'scenarios'
                    ? 'bg-red-950/80 text-red-300 font-bold border border-red-500/60 shadow-md shadow-red-500/20'
                    : 'text-slate-200 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'scenarios' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-red-400 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-red-400" />
                  <span className="font-bold text-white">
                    {locale === 'fr' ? 'Scénarios & Replay SCADA' : 'Scenarios & SCADA Replay'}
                  </span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-black border border-red-500/40">
                  SOE 10 MS
                </span>
              </button>

              {/* Thematic Guided Journeys */}
              <button
                type="button"
                onClick={() => {
                  onNavigateThematicJourneys?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'thematic-journeys'
                    ? 'bg-indigo-950/80 text-indigo-300 font-bold border border-indigo-500/60 shadow-md shadow-indigo-500/20'
                    : 'text-slate-200 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'thematic-journeys' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-indigo-400 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Compass className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="font-bold text-white">
                    {locale === 'fr' ? 'Parcours Guidés Thématiques' : 'Thematic Guided Journeys'}
                  </span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-black border border-indigo-500/40">
                  7 CURSUS
                </span>
              </button>

              {/* Journey of Electricity */}
              <button
                type="button"
                onClick={() => {
                  onNavigateJourney?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'journey'
                    ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'journey' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>{locale === 'fr' ? "Le Voyage de l'Électricité" : 'The Journey of Electricity'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black border border-amber-500/30">
                  STAGES
                </span>
              </button>

              {/* Canonical Energy Context Stack */}
              <button
                type="button"
                onClick={() => {
                  onNavigateContextStack?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'context-stack'
                    ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'context-stack' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-slate-300" />
                  <span>{locale === 'fr' ? "Graphe Contextuel Amont / Aval" : 'Upstream / Downstream Graph'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                  AMONT/AVAL
                </span>
              </button>

              {/* Trust & Provenance Registry */}
              <button
                type="button"
                onClick={() => {
                  onNavigateTraceability?.();
                  onClose();
                }}
                className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                  currentView === 'traceability'
                    ? 'bg-sky-950/80 text-sky-300 font-bold border border-sky-500/60 shadow-md shadow-sky-500/20'
                    : 'text-slate-200 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {currentView === 'traceability' && (
                  <span className="absolute left-0 top-1 bottom-1 w-1 bg-sky-400 rounded-r" />
                )}
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
                  <span className="font-bold text-white">
                    {locale === 'fr' ? 'Données Fiables & Traçabilité' : 'Trust & Provenance'}
                  </span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-black border border-sky-500/40">
                  AUDIT
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 1: Physical Energy Chain */}
        <div>
          <div className="px-2 pb-2 flex items-center justify-between border-b border-slate-800">
            <span className="font-mono text-[11px] font-black uppercase tracking-widest text-amber-400">
              {locale === 'fr' ? "DU PRODUCTEUR AU CONSOMMATEUR" : 'POWER FLOW: SOURCE TO USER'}
            </span>
          </div>
          <div className="mt-2 space-y-0.5">
            {chainDomains.map((dom) => {
              const isActive = activeDomainCode === dom.code;
              // User-friendly descriptive names for each stage
              const friendlyNameFr = 
                dom.code === 'D01' ? "Production d'Électricité" :
                dom.code === 'D02' ? 'Architecture & Conduite Réseau' :
                dom.code === 'D03' ? 'Transport Haute Tension' :
                dom.code === 'D04' ? 'Postes de Transformation' :
                dom.code === 'D05' ? 'Distribution Locale' :
                dom.code === 'D06' ? 'Bâtiments & Usagers Finaux' :
                dom.short_fr;

              const friendlyNameEn =
                dom.code === 'D01' ? 'Power Generation' :
                dom.code === 'D02' ? 'Grid Architecture & Dispatch' :
                dom.code === 'D03' ? 'High-Voltage Transmission' :
                dom.code === 'D04' ? 'Substations & Transformers' :
                dom.code === 'D05' ? 'Local Power Distribution' :
                dom.code === 'D06' ? 'Buildings & End-Users' :
                dom.short_en;

              return (
                <button
                  key={dom.code}
                  type="button"
                  data-testid={`sidebar-domain-${dom.code}`}
                  onClick={() => {
                    onSelectDomain(dom.code);
                    onClose();
                  }}
                  className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />
                  )}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-sm shrink-0 select-none">{dom.icon === 'Zap' ? '⚡' : dom.icon === 'Map' ? '🗺' : dom.icon === 'Cable' ? '🔌' : dom.icon === 'Building2' ? '🏭' : dom.icon === 'Network' ? '🌐' : '🏗'}</span>
                    <span className="truncate">
                      {locale === 'fr' ? friendlyNameFr : friendlyNameEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Engineering Disciplines */}
        <div>
          <div className="px-2 pb-2 flex items-center justify-between border-b border-slate-800">
            <span className="font-mono text-[11px] font-black uppercase tracking-widest text-slate-300">
              {locale === 'fr' ? "SPÉCIALITÉS & EXPERTISES" : 'TECHNICAL SPECIALTIES'}
            </span>
          </div>
          <div className="mt-2 space-y-0.5">
            {disciplineDomains.map((dom) => {
              const isActive = activeDomainCode === dom.code;
              // User-friendly descriptive labels for non-experts
              const friendlyNameFr = 
                dom.code === 'D07' ? 'Automatisme & Contrôle' :
                dom.code === 'D08' ? 'Courants Faibles & Sécurité' :
                dom.code === 'D09' ? 'IA & Technologies Avancées' :
                dom.code === 'D10' ? "Stockage d'Énergie & Batteries" :
                dom.code === 'D11' ? 'Protection des Réseaux' :
                dom.code === 'D12' ? 'Automatisation & SCADA' :
                dom.code === 'D13' ? 'Télécommunications Réseau' :
                dom.code === 'D14' ? "Qualité de l'Énergie & Pertes" :
                dom.code === 'D15' ? 'Comptage Intelligent' :
                dom.code === 'D16' ? 'Sécurité Électrique & Terre' :
                dom.short_fr;

              const friendlyNameEn =
                dom.code === 'D07' ? 'Automation & Control' :
                dom.code === 'D08' ? 'Low-Current & Security' :
                dom.code === 'D09' ? 'AI & Advanced Tech' :
                dom.code === 'D10' ? 'Energy Storage & Batteries' :
                dom.code === 'D11' ? 'Power System Protection' :
                dom.code === 'D12' ? 'Substation SCADA & Auto' :
                dom.code === 'D13' ? 'Telecoms & Connectivity' :
                dom.code === 'D14' ? 'Power Quality & Efficiency' :
                dom.code === 'D15' ? 'Smart Metering & Grid' :
                dom.code === 'D16' ? 'Electrical Safety & Earthing' :
                dom.short_en;

              return (
                <button
                  key={dom.code}
                  type="button"
                  data-testid={`sidebar-domain-${dom.code}`}
                  onClick={() => {
                    onSelectDomain(dom.code);
                    onClose();
                  }}
                  className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />
                  )}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-sm shrink-0 select-none">
                      {dom.code === 'D11' || dom.code === 'D16' ? '🛡' : dom.code === 'D07' ? '⚙' : dom.code === 'D08' ? '⚡' : dom.code === 'D09' ? '☀' : dom.code === 'D10' ? '🔋' : dom.code === 'D12' ? '🤖' : dom.code === 'D13' ? '📡' : dom.code === 'D14' ? '📊' : dom.code === 'D15' ? '📟' : '🌐'}
                    </span>
                    <span className="truncate">
                      {locale === 'fr' ? friendlyNameFr : friendlyNameEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Cross-Cutting Layers */}
        <div>
          <div className="px-2 pb-2 flex items-center justify-between border-b border-slate-800">
            <span className="font-mono text-[11px] font-black uppercase tracking-widest text-slate-300">
              {locale === 'fr' ? 'NORMES, MÉTIERS & GOUVERNANCE' : 'STANDARDS, ROLES & GOVERNANCE'}
            </span>
          </div>
          <div className="mt-2 space-y-0.5">
            {LAYERS.map((layer) => {
              const isActive = activeLayerCode === layer.code;
              // User-friendly descriptive labels for non-experts
              const friendlyNameFr = 
                layer.code === 'L01' ? 'Normes & Standards Techniques' :
                layer.code === 'L02' ? 'Métiers & Fiches de Compétences' :
                layer.code === 'L03' ? 'Gestion & Jalons de Projets' :
                layer.code === 'L04' ? 'Ingénierie Numérique & Données' :
                layer.code === 'L05' ? 'Cas Pratiques & Réseau Cameroun' :
                layer.code === 'L06' ? 'Cadre Réglementaire & Code Réseau' :
                layer.name_fr;

              const friendlyNameEn =
                layer.code === 'L01' ? 'Standards & Technical Codes' :
                layer.code === 'L02' ? 'Engineering Roles & Careers' :
                layer.code === 'L03' ? 'Project Stages & Gate Reviews' :
                layer.code === 'L04' ? 'Digital Engineering & Data' :
                layer.code === 'L05' ? 'Practical Cases & Cameroon Grid' :
                layer.code === 'L06' ? 'Regulatory Framework & Grid Code' :
                layer.name_en;

              return (
                <button
                  key={layer.code}
                  type="button"
                  data-testid={`sidebar-layer-${layer.code}`}
                  onClick={() => {
                    onSelectLayer(layer.code);
                    onClose();
                  }}
                  className={`relative overflow-hidden w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />
                  )}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-sm shrink-0 select-none">
                      {layer.code === 'L01' ? '📋' : layer.code === 'L02' ? '👷' : layer.code === 'L03' ? '🔄' : layer.code === 'L04' ? '🚀' : layer.code === 'L05' ? '🌍' : '🗺'}
                    </span>
                    <span className="truncate">
                      {locale === 'fr' ? friendlyNameFr : friendlyNameEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer Info in Sidebar */}
      <div className="p-4 border-t border-white/[0.08] bg-[#02040A] text-[11px] text-slate-400 space-y-1.5">
        <div className="flex items-center justify-between font-mono">
          <span className="text-amber-400 font-bold tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SONATREL · Eneo
          </span>
          <span className="font-semibold text-slate-500">225 kV / 30 kV</span>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>EPEDE v3.2 Engine</span>
          <span className="text-cyan-400">IEC / IEEE Online</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-14 sm:top-15 h-[calc(100vh-3.75rem)] z-30 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 overflow-hidden pointer-events-none'
        }`}
      >
        <div className="w-72 h-full">
          {content}
        </div>
      </aside>

      {/* Mobile Slide-in Drawer with cubic-bezier easing */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
              onClick={onClose}
              aria-hidden="true"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
              className="relative z-10 h-full"
            >
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
