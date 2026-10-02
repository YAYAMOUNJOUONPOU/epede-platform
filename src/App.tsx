// src/App.tsx
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Disclaimer } from './components/layout/Disclaimer';
import { MobileFieldQuickDock } from './components/layout/MobileFieldQuickDock';
import { ScadaTelemetryBar } from './components/layout/ScadaTelemetryBar';
import { PersistentEngineeringContextDock } from './components/layout/PersistentEngineeringContextDock';
import { contextStackSessionStore } from './services/contextStackSessionStore';
import { resolveCanonicalEquipment } from './data/equipment/canonicalEquipmentRegistry';
import { EngineeringBackground } from './components/common/EngineeringBackground';
import { HomeView } from './components/home/HomeView';
import { EngineeringLoadingSkeleton } from './components/common/EngineeringLoadingSkeleton';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DOMAINS } from './data/epedeData';

// Code-split Lazy Secondary Views for Core Web Vitals Optimization
const DomainDetailView = lazy(() => import('./components/domain/DomainDetailView').then(m => ({ default: m.DomainDetailView })));
const DomainsListView = lazy(() => import('./components/domain/DomainsListView').then(m => ({ default: m.DomainsListView })));
const EquipmentDetailView = lazy(() => import('./components/equipment/EquipmentDetailView').then(m => ({ default: m.EquipmentDetailView })));
const EquipmentListView = lazy(() => import('./components/equipment/EquipmentListView').then(m => ({ default: m.EquipmentListView })));
const RolesView = lazy(() => import('./components/roles/RolesView').then(m => ({ default: m.RolesView })));
const StandardsView = lazy(() => import('./components/standards/StandardsView').then(m => ({ default: m.StandardsView })));
const InteractiveSldView = lazy(() => import('./components/diagrams/InteractiveSldView').then(m => ({ default: m.InteractiveSldView })));
const SimulationLabView = lazy(() => import('./components/simulation/SimulationLabView').then(m => ({ default: m.SimulationLabView })));
const CalculatorsView = lazy(() => import('./components/calculators/CalculatorsView').then(m => ({ default: m.CalculatorsView })));
const Phase2MasterView = lazy(() => import('./components/phase2/Phase2MasterView').then(m => ({ default: m.Phase2MasterView })));
const LifecycleView = lazy(() => import('./components/lifecycle/LifecycleView').then(m => ({ default: m.LifecycleView })));
const CameroonGridView = lazy(() => import('./components/grid/CameroonGridView').then(m => ({ default: m.CameroonGridView })));
const RegulatoryView = lazy(() => import('./components/regulatory/RegulatoryView').then(m => ({ default: m.RegulatoryView })));
const JourneyView = lazy(() => import('./components/journey/JourneyView').then(m => ({ default: m.JourneyView })));
const EngineeringContextStack = lazy(() => import('./components/common/EngineeringContextStack').then(m => ({ default: m.EngineeringContextStack })));
const HydropowerVisualJourney = lazy(() => import('./components/production/HydropowerVisualJourney').then(m => ({ default: m.HydropowerVisualJourney })));
const HydropowerMasterWorkbench = lazy(() => import('./components/hydropower/HydropowerMasterWorkbench').then(m => ({ default: m.HydropowerMasterWorkbench })));
const IndustrialProjectsView = lazy(() => import('./components/projects/IndustrialProjectsView').then(m => ({ default: m.IndustrialProjectsView })));
const EngineersChainView = lazy(() => import('./components/engineers/EngineersChainView').then(m => ({ default: m.EngineersChainView })));
const ElectricalEquipmentReferenceView = lazy(() => import('./components/reference/ElectricalEquipmentReferenceView').then(m => ({ default: m.ElectricalEquipmentReferenceView })));
const ElectricalEcosystemView = lazy(() => import('./components/ecosystem/ElectricalEcosystemView').then(m => ({ default: m.ElectricalEcosystemView })));
const ArchitectureComparisonWorkbench = lazy(() => import('./components/comparison/ArchitectureComparisonWorkbench').then(m => ({ default: m.ArchitectureComparisonWorkbench })));
const ProtectionEngineeringWorkbench = lazy(() => import('./components/protection/ProtectionEngineeringWorkbench').then(m => ({ default: m.ProtectionEngineeringWorkbench })));
const CommissioningDashboardView = lazy(() => import('./components/commissioning/CommissioningDashboardView').then(m => ({ default: m.CommissioningDashboardView })));
const KnowledgeGraphExplorer = lazy(() => import('./components/graph/KnowledgeGraphExplorer').then(m => ({ default: m.KnowledgeGraphExplorer })));
const FollowTheEnergyView = lazy(() => import('./components/energy/FollowTheEnergyView').then(m => ({ default: m.FollowTheEnergyView })));
const PedagogicalScenariosWorkbench = lazy(() => import('./components/scenarios/PedagogicalScenariosWorkbench').then(m => ({ default: m.PedagogicalScenariosWorkbench })));
const DataProvenanceRegistryView = lazy(() => import('./components/trust/DataProvenanceRegistryView').then(m => ({ default: m.DataProvenanceRegistryView })));
const ThematicJourneysWorkbench = lazy(() => import('./components/journey/ThematicJourneysWorkbench').then(m => ({ default: m.ThematicJourneysWorkbench })));
const AssetManagementDiagnosticsWorkbench = lazy(() => import('./components/assets/AssetManagementDiagnosticsWorkbench').then(m => ({ default: m.AssetManagementDiagnosticsWorkbench })));

// Lazy Modals (on-demand loading)
const SearchModal = lazy(() => import('./components/search/SearchModal').then(m => ({ default: m.SearchModal })));
const AIAssistantModal = lazy(() => import('./components/ai/AIAssistantModal').then(m => ({ default: m.AIAssistantModal })));
const FieldEquipmentVisionInspectorModal = lazy(() => import('./components/ai/FieldEquipmentVisionInspectorModal').then(m => ({ default: m.FieldEquipmentVisionInspectorModal })));
const PlatformMaturityModal = lazy(() => import('./components/audit/PlatformMaturityModal').then(m => ({ default: m.PlatformMaturityModal })));
const MobileQrScannerModal = lazy(() => import('./components/layout/MobileQrScannerModal').then(m => ({ default: m.MobileQrScannerModal })));
import { PersistentEngineeringContextBar } from './components/layout/PersistentEngineeringContextBar';
import { RecentlyExploredDrawer } from './components/context/RecentlyExploredDrawer';
import { engineeringContextService } from './services/engineeringContextService';
import type { DomainCode, LayerCode } from './types/epede';
import type { CalculatorTabType } from './components/calculators/services/calculationReportService';
import type { SimulationTabType } from './components/simulation/SimulationLabView';
import type { SldTopologyType } from './components/diagrams/modules/SldHeaderToolbar';
import type { StageId } from './components/journey/types';
import { 
  parseRouteHash, 
  buildRouteHash, 
  getDocumentTitle, 
  type RouteState, 
  type AppViewType,
  type InjectedCalculatorContext
} from './services/routerService';
import { UsageLevelProvider } from './services/UsageLevelContext';

export default function App() {
  const [locale, setLocale] = useState<'fr' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('epede-locale');
      if (saved === 'fr' || saved === 'en') return saved;
    }
    return 'fr';
  });

  // Persist locale changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('epede-locale', locale);
    }
  }, [locale]);

  // Derive initial route from window.location.hash
  const initialRoute = parseRouteHash(typeof window !== 'undefined' ? window.location.hash : '');

  const [currentView, setCurrentView] = useState<AppViewType>(initialRoute.view);
  const [activeDomainCode, setActiveDomainCode] = useState<DomainCode>(initialRoute.domainCode || 'D01');
  const [activeEquipmentId, setActiveEquipmentId] = useState<string>(initialRoute.equipmentId || 'eq-trafo-hta-01');
  const [activeRoleSlug, setActiveRoleSlug] = useState<string>(initialRoute.roleSlug || 'protection-engineer');
  const [activeStandardRef, setActiveStandardRef] = useState<string>(initialRoute.standardRef || 'IEC 60255');
  const [activeLayerCode, setActiveLayerCode] = useState<LayerCode | null>(null);
  const [activeCalculatorTab, setActiveCalculatorTab] = useState<CalculatorTabType | undefined>(initialRoute.calculatorTab);
  const [activeCalculatorContext, setActiveCalculatorContext] = useState<InjectedCalculatorContext | undefined>(initialRoute.calculatorContext);
  const [activeSimulationTab, setActiveSimulationTab] = useState<SimulationTabType | undefined>(initialRoute.simulationTab);
  const [activeTopology, setActiveTopology] = useState<SldTopologyType | undefined>(initialRoute.topology);
  const [activeJourneyStage, setActiveJourneyStage] = useState<StageId | undefined>(initialRoute.journeyStage);
  const [activeContextNodeId, setActiveContextNodeId] = useState<string>(initialRoute.contextNodeId || 'node-trafo-main-30');
  const [activeGridCategory, setActiveGridCategory] = useState<any>(initialRoute.gridCategory);
  const [activeAssetPillar, setActiveAssetPillar] = useState<string | undefined>(initialRoute.assetPillar);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isVisionInspectorOpen, setIsVisionInspectorOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [comparisonSeed, setComparisonSeed] = useState<string[]>([]);

  // Open search with optional query
  const handleOpenSearch = (query?: string) => {
    setSearchInitialQuery(query || '');
    setIsSearchOpen(true);
  };

  // Global keyboard shortcut: Ctrl+K or Cmd+K to open Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Centralized Navigation Engine: updates URL hash, browser history, state, and scroll
  const navigate = (target: RouteState) => {
    const newHash = buildRouteHash(target);
    if (typeof window !== 'undefined') {
      if (window.location.hash !== newHash) {
        window.location.hash = newHash;
      } else {
        setCurrentView(target.view);
        if (target.domainCode) setActiveDomainCode(target.domainCode);
        if (target.equipmentId) setActiveEquipmentId(target.equipmentId);
        if (target.roleSlug) setActiveRoleSlug(target.roleSlug);
        if (target.standardRef) setActiveStandardRef(target.standardRef);
        if (target.calculatorTab !== undefined) setActiveCalculatorTab(target.calculatorTab);
        if (target.calculatorContext !== undefined) setActiveCalculatorContext(target.calculatorContext);
        if (target.simulationTab !== undefined) setActiveSimulationTab(target.simulationTab);
        if (target.topology !== undefined) setActiveTopology(target.topology);
        if (target.journeyStage !== undefined) setActiveJourneyStage(target.journeyStage);
        if (target.contextNodeId) setActiveContextNodeId(target.contextNodeId);
        if (target.gridCategory !== undefined) setActiveGridCategory(target.gridCategory);
        if (target.assetPillar !== undefined) setActiveAssetPillar(target.assetPillar);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Synchronize browser Back/Forward navigation (hashchange event)
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseRouteHash(window.location.hash);
      setCurrentView(route.view);
      if (route.domainCode) setActiveDomainCode(route.domainCode);
      if (route.equipmentId) setActiveEquipmentId(route.equipmentId);
      if (route.roleSlug) setActiveRoleSlug(route.roleSlug);
      if (route.standardRef) setActiveStandardRef(route.standardRef);
      if (route.calculatorTab !== undefined) setActiveCalculatorTab(route.calculatorTab);
      if (route.calculatorContext !== undefined) setActiveCalculatorContext(route.calculatorContext);
      if (route.simulationTab !== undefined) setActiveSimulationTab(route.simulationTab);
      if (route.topology !== undefined) setActiveTopology(route.topology);
      if (route.journeyStage !== undefined) setActiveJourneyStage(route.journeyStage);
      if (route.contextNodeId) setActiveContextNodeId(route.contextNodeId);
      if (route.gridCategory !== undefined) setActiveGridCategory(route.gridCategory);
      if (route.assetPillar !== undefined) setActiveAssetPillar(route.assetPillar);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update dynamic document title based on route and locale
  useEffect(() => {
    const title = getDocumentTitle(
      {
        view: currentView,
        domainCode: activeDomainCode,
        equipmentId: activeEquipmentId,
        roleSlug: activeRoleSlug,
        standardRef: activeStandardRef,
        calculatorTab: activeCalculatorTab,
        simulationTab: activeSimulationTab,
        topology: activeTopology,
        journeyStage: activeJourneyStage,
        contextNodeId: activeContextNodeId,
        assetPillar: activeAssetPillar,
      },
      locale
    );
    document.title = title;
  }, [
    currentView,
    activeDomainCode,
    activeEquipmentId,
    activeRoleSlug,
    activeStandardRef,
    activeCalculatorTab,
    activeSimulationTab,
    activeTopology,
    activeJourneyStage,
    activeContextNodeId,
    locale,
  ]);

  // Restore shared engineering trail from URL if restoreTrail param is present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const match = window.location.hash.match(/[?&]restoreTrail=([^&]+)/);
    if (match && match[1]) {
      const restored = contextStackSessionStore.loadTrailFromParam(match[1]);
      if (restored) {
        const currentItem = contextStackSessionStore.getCurrentItem();
        if (currentItem?.routeTarget) {
          navigate({
            view: currentItem.routeTarget.view as AppViewType,
            domainCode: currentItem.routeTarget.domainCode as DomainCode,
            equipmentId: currentItem.routeTarget.equipmentId,
            contextNodeId: currentItem.routeTarget.nodeId
          });
        }
      }
    }
  }, []);

  // Synchronize exploration trail with current view/domain/equipment (Priority 1: Context Memory)
  useEffect(() => {
    if (currentView === 'domain' && activeDomainCode) {
      const domainObj = DOMAINS.find((d) => d.code === activeDomainCode);
      const info = domainObj
        ? { fr: domainObj.name_fr, en: domainObj.name_en }
        : { fr: `Domaine ${activeDomainCode}`, en: `Domain ${activeDomainCode}` };
      contextStackSessionStore.addToTrail({
        id: `domain-${activeDomainCode}`,
        name_fr: info.fr,
        name_en: info.en,
        entityType: 'domain',
        domainCode: activeDomainCode,
        routeTarget: { view: 'domain', domainCode: activeDomainCode }
      });
    } else if (currentView === 'equipment' && activeEquipmentId) {
      const canonical = resolveCanonicalEquipment(activeEquipmentId);
      contextStackSessionStore.addToTrail({
        id: activeEquipmentId,
        name_fr: canonical ? canonical.name.fr : activeEquipmentId,
        name_en: canonical ? canonical.name.en : activeEquipmentId,
        entityType: 'equipment',
        domainCode: canonical ? (canonical.parentDomain as DomainCode) : activeDomainCode,
        voltage: canonical?.ratings.nominalVoltage,
        tag: canonical?.tagIec,
        routeTarget: { view: 'equipment', equipmentId: activeEquipmentId }
      });
    } else if (currentView === 'cameroon-grid') {
      contextStackSessionStore.addToTrail({
        id: 'view-cameroon-grid',
        name_fr: 'Réseau Interconnecté Cameroun (RIS/RIN)',
        name_en: 'Cameroon National Grid (RIS/RIN)',
        entityType: 'system',
        domainCode: 'D03',
        voltage: '225 kV / 90 kV',
        routeTarget: { view: 'cameroon-grid' }
      });
    } else if (currentView === 'hydropower') {
      contextStackSessionStore.addToTrail({
        id: 'view-hydropower',
        name_fr: 'Complexe Hydroélectrique Songloulou',
        name_en: 'Songloulou Hydropower Complex',
        entityType: 'system',
        domainCode: 'D01',
        voltage: '10.5 kV / 225 kV',
        routeTarget: { view: 'hydropower' }
      });
    } else if (currentView === 'diagrams') {
      contextStackSessionStore.addToTrail({
        id: `view-sld-${activeTopology || 'single-bus'}`,
        name_fr: `Schéma Unifilaire (${activeTopology || 'Poste'})`,
        name_en: `Single-Line Diagram (${activeTopology || 'Substation'})`,
        entityType: 'substation_bay',
        domainCode: 'D04',
        routeTarget: { view: 'diagrams' }
      });
    } else if (currentView === 'simulation') {
      contextStackSessionStore.addToTrail({
        id: `view-sim-${activeSimulationTab || 'transient'}`,
        name_fr: 'Laboratoire de Simulation Numérique',
        name_en: 'Digital Simulation Laboratory',
        entityType: 'system',
        domainCode: 'D07',
        routeTarget: { view: 'simulation' }
      });
    } else if (currentView === 'calculators') {
      contextStackSessionStore.addToTrail({
        id: `view-calc-${activeCalculatorTab || 'fault'}`,
        name_fr: 'Calculateurs Électrotechniques CEI',
        name_en: 'IEC Power Engineering Solvers',
        entityType: 'system',
        domainCode: 'D07',
        routeTarget: { view: 'calculators' }
      });
    } else if (currentView === 'context-stack') {
      contextStackSessionStore.addToTrail({
        id: `view-context-${activeContextNodeId || 'node-main'}`,
        name_fr: 'Graphe Contextuel Amont / Aval',
        name_en: 'Upstream / Downstream Context Graph',
        entityType: 'node',
        domainCode: 'D04',
        routeTarget: { view: 'context-stack', nodeId: activeContextNodeId }
      });
    } else if (currentView === 'roles') {
      contextStackSessionStore.addToTrail({
        id: `view-role-${activeRoleSlug}`,
        name_fr: `Fiche Métier (${activeRoleSlug})`,
        name_en: `Engineering Role (${activeRoleSlug})`,
        entityType: 'system',
        domainCode: 'D06',
        routeTarget: { view: 'roles' }
      });
    } else if (currentView === 'standards') {
      contextStackSessionStore.addToTrail({
        id: `view-std-${activeStandardRef || 'iec'}`,
        name_fr: `Norme Technique (${activeStandardRef || 'CEI'})`,
        name_en: `Technical Standard (${activeStandardRef || 'IEC'})`,
        entityType: 'system',
        domainCode: 'D07',
        routeTarget: { view: 'standards' }
      });
    } else if (currentView === 'lifecycle') {
      contextStackSessionStore.addToTrail({
        id: 'view-lifecycle',
        name_fr: 'Cycle de Vie des Installations (EPC)',
        name_en: 'Asset Lifecycle (EPC/O&M)',
        entityType: 'system',
        domainCode: 'D04',
        routeTarget: { view: 'lifecycle' }
      });
    } else if (currentView === 'industrial-projects') {
      contextStackSessionStore.addToTrail({
        id: 'view-projects',
        name_fr: 'Projets Réseau & Chantiers Industriels',
        name_en: 'Industrial Projects & Grid Expansion',
        entityType: 'system',
        domainCode: 'D03',
        routeTarget: { view: 'industrial-projects' }
      });
    } else if (currentView === 'engineers-chain') {
      contextStackSessionStore.addToTrail({
        id: 'view-engineers-chain',
        name_fr: 'Chaîne des Métiers de l\'Énergie',
        name_en: 'Power Engineering Professions Chain',
        entityType: 'system',
        domainCode: 'D01',
        routeTarget: { view: 'engineers-chain' }
      });
    } else if (currentView === 'architectures') {
      contextStackSessionStore.addToTrail({
        id: 'view-architectures',
        name_fr: 'Comparateur Architectures Postes (AIS/GIS/TCO)',
        name_en: 'Substation Architectures & TCO Comparator',
        entityType: 'system',
        domainCode: 'D04',
        voltage: '225 kV',
        routeTarget: { view: 'architectures' }
      });
        } else if (currentView === 'asset-management') {
      contextStackSessionStore.addToTrail({
        id: 'view-asset-management',
        name_fr: "Gestion d'Actifs & Diagnostics DGA (CEI 60599 / ISO 55000)",
        name_en: 'Asset Management & DGA Diagnostics (IEC 60599 / ISO 55000)',
        entityType: 'system',
        domainCode: 'D15',
        routeTarget: { view: 'asset-management' }
      });
    } else if (currentView === 'knowledge-graph') {
      contextStackSessionStore.addToTrail({
        id: 'view-knowledge-graph',
        name_fr: 'Knowledge Graph Explorer & Causalité',
        name_en: 'Knowledge Graph Explorer & Causality',
        entityType: 'system',
        domainCode: 'D04',
        routeTarget: { view: 'knowledge-graph' }
      });
    }
  }, [
    currentView,
    activeDomainCode,
    activeEquipmentId,
    activeTopology,
    activeSimulationTab,
    activeCalculatorTab,
    activeRoleSlug,
    activeStandardRef,
    activeContextNodeId
  ]);

  // Navigation handlers
  const handleNavigateDomain = (code: DomainCode) => {
    navigate({ view: 'domain', domainCode: code });
  };

  const handleNavigateEquipment = (id: string) => {
    navigate({ view: 'equipment', equipmentId: id });
  };

  const handleNavigateRole = (slug: string) => {
    navigate({ view: 'roles', roleSlug: slug });
  };

  const handleNavigateStandard = (ref: string) => {
    navigate({ view: 'standards', standardRef: ref });
  };

  const handleNavigateCalculator = (tab?: CalculatorTabType, context?: InjectedCalculatorContext) => {
    if (context) {
      setActiveCalculatorContext(context);
    }
    navigate({ view: 'calculators', calculatorTab: tab, calculatorContext: context });
  };

  const handleNavigateSimulation = (tab?: SimulationTabType) => {
    navigate({ view: 'simulation', simulationTab: tab });
  };

  const handleNavigateDiagram = (topology?: SldTopologyType) => {
    navigate({ view: 'diagrams', topology });
  };

  const handleNavigateJourney = (stageId?: StageId) => {
    navigate({ view: 'journey', journeyStage: stageId });
  };

    const handleNavigateAssetManagement = (pillar?: string) => {
    setActiveAssetPillar(pillar);
    navigate({ view: 'asset-management', assetPillar: pillar });
  };

  const handleNavigateContextStack = (nodeId?: string) => {
    navigate({ view: 'context-stack', contextNodeId: nodeId || activeContextNodeId });
  };

  const handleNavigateHydropower = () => {
    navigate({ view: 'hydropower' });
  };

  const handleNavigateReference = (id?: string) => {
    navigate({ view: 'equipment-reference', equipmentId: id });
  };

  const handleNavigateIndustrialProjects = () => {
    navigate({ view: 'industrial-projects' });
  };

  const handleCompareEquipment = (id: string) => {
    setComparisonSeed((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
    navigate({ view: 'equipment-list' });
  };

  return (
    <UsageLevelProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/20 selection:text-amber-300 flex flex-col relative overflow-x-hidden">
      {/* Background canvas */}
      {currentView !== 'ecosystem' && <EngineeringBackground interactive={true} />}

      {/* Top SCADA Telemetry Bar */}
      {currentView !== 'ecosystem' && <ScadaTelemetryBar locale={locale} />}

      {/* Main App Navigation Header */}
      {currentView !== 'ecosystem' && (
        <Header
          locale={locale}
          onLocaleChange={setLocale}
          onToggleLocale={setLocale}
          onSearchClick={() => handleOpenSearch()}
          onOpenSearch={handleOpenSearch}
          onAIAssistantClick={() => setIsAssistantOpen(true)}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          onOpenVisionInspector={() => setIsVisionInspectorOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
          currentView={currentView}
          onNavigateHome={() => navigate({ view: 'home' })}
          onNavigateJourney={() => navigate({ view: 'journey' })}
          onNavigateDomains={() => navigate({ view: 'domains' })}
          onNavigateEquipment={() => navigate({ view: 'equipment-list' })}
          onNavigateEquipmentReference={() => navigate({ view: 'equipment-reference' })}
          onNavigateRoles={() => navigate({ view: 'roles' })}
          onNavigateStandards={() => navigate({ view: 'standards' })}
          onNavigateDiagrams={() => navigate({ view: 'diagrams' })}
          onNavigateSimulation={() => navigate({ view: 'simulation' })}
          onNavigateCalculators={() => navigate({ view: 'calculators' })}
          onNavigatePhase2={() => navigate({ view: 'phase2' })}
          onNavigateLifecycle={() => navigate({ view: 'lifecycle' })}
          onNavigateCameroonGrid={() => navigate({ view: 'cameroon-grid' })}
          onNavigateRegulatory={() => navigate({ view: 'regulatory' })}
          onNavigateContextStack={() => navigate({ view: 'context-stack' })}
          onNavigateHydropower={handleNavigateHydropower}
          onNavigateIndustrialProjects={handleNavigateIndustrialProjects}
          onNavigateEngineersChain={() => navigate({ view: 'engineers-chain' })}
          onNavigateEcosystem={() => navigate({ view: 'ecosystem' })}
          onNavigateArchitectures={() => navigate({ view: 'architectures' })}
          onOpenAudit={() => setIsAuditOpen(true)}
        />
      )}

      {/* Persistent Engineering Context Bar & Energy Chain Flow */}
      {currentView !== 'ecosystem' && (
        <PersistentEngineeringContextBar
          locale={locale}
          currentView={currentView}
          onNavigateDomain={(d) => handleNavigateDomain(d as DomainCode)}
          onNavigateEquipment={handleNavigateEquipment}
          onNavigateCalculator={handleNavigateCalculator}
          onNavigateSimulation={handleNavigateSimulation}
          onNavigateContextStack={handleNavigateContextStack}
          onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        />
      )}

      {/* Persistent Engineering Context Stack Dock (Priorities 1 & 12) */}
      {currentView !== 'ecosystem' && (
        <PersistentEngineeringContextDock
          locale={locale}
          onNavigateToTarget={(target) => {
            if (target.view === 'domain' && target.domainCode) {
              handleNavigateDomain(target.domainCode as DomainCode);
            } else if (target.view === 'equipment' && target.equipmentId) {
              handleNavigateEquipment(target.equipmentId);
            } else if (target.view === 'context-stack') {
              handleNavigateContextStack(target.nodeId);
            } else {
              navigate({
                view: target.view as AppViewType,
                domainCode: target.domainCode as DomainCode,
                equipmentId: target.equipmentId,
                contextNodeId: target.nodeId
              });
            }
          }}
          onReturnToSystemMap={() => navigate({ view: 'domains' })}
        />
      )}

      {/* Main Content Layout with responsive drawer / sidebar */}
      <div className={`flex-1 flex relative ${currentView === 'ecosystem' ? 'w-full h-full' : ''}`}>
        {/* Engineering Architecture Sidebar */}
        {currentView !== 'ecosystem' && (
          <Sidebar
            locale={locale}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            activeDomainCode={activeDomainCode}
          activeLayerCode={activeLayerCode}
          onSelectDomain={(code) => {
            handleNavigateDomain(code);
            setIsSidebarOpen(false);
          }}
          onSelectLayer={(code) => {
            setActiveLayerCode(code);
            setIsSidebarOpen(false);
            if (code === 'L01') navigate({ view: 'standards' });
            else if (code === 'L02') navigate({ view: 'engineers-chain' });
            else if (code === 'L03') navigate({ view: 'lifecycle' });
            else if (code === 'L04') navigate({ view: 'context-stack' });
            else if (code === 'L05') navigate({ view: 'cameroon-grid' });
            else if (code === 'L06') navigate({ view: 'regulatory' });
          }}
          onNavigateJourney={() => {
            handleNavigateJourney();
            setIsSidebarOpen(false);
          }}
          onNavigateEquipmentReference={() => {
            navigate({ view: 'equipment-reference' });
            setIsSidebarOpen(false);
          }}
          onNavigateEcosystem={() => {
            navigate({ view: 'ecosystem' });
            setIsSidebarOpen(false);
          }}
          onNavigateDiagrams={(topology) => {
            handleNavigateDiagram(topology);
            setIsSidebarOpen(false);
          }}
          onNavigateSimulation={() => {
            handleNavigateSimulation();
            setIsSidebarOpen(false);
          }}
          onNavigateCalculators={() => {
            handleNavigateCalculator();
            setIsSidebarOpen(false);
          }}
          onNavigatePhase2={() => {
            navigate({ view: 'phase2' });
            setIsSidebarOpen(false);
          }}
          onNavigateLifecycle={() => {
            navigate({ view: 'lifecycle' });
            setIsSidebarOpen(false);
          }}
          onNavigateCameroonGrid={() => {
            navigate({ view: 'cameroon-grid' });
            setIsSidebarOpen(false);
          }}
          onNavigateRegulatory={() => {
            navigate({ view: 'regulatory' });
            setIsSidebarOpen(false);
          }}
          onNavigateContextStack={() => {
            navigate({ view: 'context-stack' });
            setIsSidebarOpen(false);
          }}
          onNavigateHydropower={() => {
            handleNavigateHydropower();
            setIsSidebarOpen(false);
          }}
          onNavigateIndustrialProjects={() => {
            handleNavigateIndustrialProjects();
            setIsSidebarOpen(false);
          }}
          onNavigateEngineersChain={() => {
            navigate({ view: 'engineers-chain' });
            setIsSidebarOpen(false);
          }}
          onNavigateArchitectures={() => {
            navigate({ view: 'architectures' });
            setIsSidebarOpen(false);
          }}
          onNavigateProtection={() => {
            navigate({ view: 'protection' });
            setIsSidebarOpen(false);
          }}
          onNavigateCommissioning={() => {
            navigate({ view: 'commissioning' });
            setIsSidebarOpen(false);
          }}
          onNavigateKnowledgeGraph={() => {
            navigate({ view: 'knowledge-graph' });
            setIsSidebarOpen(false);
          }}
          onNavigateFollowTheEnergy={() => {
            navigate({ view: 'follow-the-energy' });
            setIsSidebarOpen(false);
          }}
          onNavigateScenarios={() => {
            navigate({ view: 'scenarios' });
            setIsSidebarOpen(false);
          }}
          onNavigateTraceability={() => {
            navigate({ view: 'traceability' });
            setIsSidebarOpen(false);
          }}
          onNavigateThematicJourneys={() => {
            navigate({ view: 'thematic-journeys' });
            setIsSidebarOpen(false);
          }}
          currentView={currentView}
        />
      )}

        {/* Right Main Content Stream */}
        <main className={`flex-1 min-w-0 w-full ${currentView === 'ecosystem' ? 'p-0 max-w-none' : 'p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 max-w-7xl mx-auto space-y-6'}`}>
          {/* View Routing with Smooth Page Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <ErrorBoundary fallbackTitle={locale === 'fr' ? 'Incident Module Ingénierie' : 'Engineering Module Incident'}>
                <Suspense fallback={<EngineeringLoadingSkeleton locale={locale} />}>
                {currentView === 'home' && (
                  <HomeView
                  locale={locale}
                  onLocaleChange={setLocale}
                  onSelectDomain={handleNavigateDomain}
                  onSelectEquipment={handleNavigateEquipment}
                  onNavigateView={(view) => {
                    if (view.startsWith('domain:')) {
                      const domainCode = view.split(':')[1] as DomainCode;
                      handleNavigateDomain(domainCode);
                      return;
                    }
                    navigate({ view: view as AppViewType });
                  }}
                  onOpenSearch={handleOpenSearch}
                  onOpenAssistant={() => setIsAssistantOpen(true)}
                  onNavigateJourney={handleNavigateJourney}
                  onNavigateStandard={handleNavigateStandard}
                  onNavigateRole={handleNavigateRole}
                  onNavigateCalculator={handleNavigateCalculator}
                  onNavigateSimulation={handleNavigateSimulation}
                  onNavigateDiagram={handleNavigateDiagram}
                />
              )}

              {currentView === 'journey' && (
                <JourneyView
                  locale={locale}
                  initialStage={activeJourneyStage}
                  onNavigateStandard={handleNavigateStandard}
                  onNavigateEquipment={handleNavigateEquipment}
                  onNavigateContextStack={handleNavigateContextStack}
                  onNavigateCalculator={handleNavigateCalculator}
                />
              )}

              {currentView === 'hydropower' && (
                <HydropowerMasterWorkbench
                  locale={locale}
                  onBack={() => navigate({ view: 'home' })}
                  onNavigateStandard={handleNavigateStandard}
                  onNavigateCalculator={handleNavigateCalculator}
                  onNavigateSimulation={handleNavigateSimulation}
                />
              )}

              {currentView === 'diagrams' && (
                <InteractiveSldView
                  locale={locale}
                  initialTopology={activeTopology}
                  onBack={() => navigate({ view: 'home' })}
                  onNavigateEquipment={handleNavigateEquipment}
                  onNavigateDomain={handleNavigateDomain}
                  onNavigateCalculator={handleNavigateCalculator}
                  onNavigateSimulation={handleNavigateSimulation}
                  onNavigateContextStack={handleNavigateContextStack}
                  onNavigateArchitectures={() => navigate({ view: 'architectures' })}
                  onNavigateCommissioning={() => navigate({ view: 'commissioning' })}
                />
              )}

              {currentView === 'simulation' && (
                <SimulationLabView
                  locale={locale}
                  initialTab={activeSimulationTab}
                  onNavigateContextStack={handleNavigateContextStack}
                  onNavigateCalculator={handleNavigateCalculator}
                  onNavigateDiagram={handleNavigateDiagram}
                />
              )}

              {currentView === 'calculators' && (
                <CalculatorsView
                  locale={locale}
                  initialTab={activeCalculatorTab}
                  injectedContext={activeCalculatorContext}
                  onClearInjectedContext={() => setActiveCalculatorContext(undefined)}
                  onNavigateContextStack={handleNavigateContextStack}
                  onNavigateSimulation={handleNavigateSimulation}
                />
              )}

              {currentView === 'domain' && (
                <DomainDetailView
                  domainCode={activeDomainCode}
                  locale={locale}
                  onBack={() => navigate({ view: 'domains' })}
                  onSelectEquipment={handleNavigateEquipment}
                  onSelectStandard={handleNavigateStandard}
                  onSelectRole={handleNavigateRole}
                  onNavigateContextStack={handleNavigateContextStack}
                  onNavigateView={(view, domainCode) => {
                    if (view === 'domain' && domainCode) {
                      handleNavigateDomain(domainCode as DomainCode);
                      return;
                    }
                    if (view.startsWith('domain:')) {
                      const dCode = view.split(':')[1] as DomainCode;
                      handleNavigateDomain(dCode);
                      return;
                    }
                    navigate({ view: view as AppViewType });
                  }}
                />
              )}

              {currentView === 'domains' && (
                <DomainsListView
                  locale={locale}
                  onSelectDomain={handleNavigateDomain}
                  activeDomainCode={activeDomainCode}
                />
              )}

              {currentView === 'equipment' && (
                <EquipmentDetailView
                  equipmentId={activeEquipmentId}
                  locale={locale}
                  onBack={() => navigate({ view: 'equipment-list' })}
                  onNavigateDomain={handleNavigateDomain}
                  onNavigateEquipment={handleNavigateEquipment}
                  onCompareEquipment={handleCompareEquipment}
                  onNavigateCalculator={handleNavigateCalculator}
                  onNavigateSimulation={handleNavigateSimulation}
                  onNavigateContextStack={handleNavigateContextStack}
                  onNavigateStandard={handleNavigateStandard}
                  onNavigateAssetManagement={handleNavigateAssetManagement}
                />
              )}

              {currentView === 'equipment-list' && (
                <EquipmentListView
                  locale={locale}
                  onSelectEquipment={handleNavigateEquipment}
                  onSelectDomain={handleNavigateDomain}
                  initialSelectedForComparison={comparisonSeed}
                />
              )}

              {currentView === 'equipment-reference' && (
                <ElectricalEquipmentReferenceView
                  locale={locale}
                  initialEquipmentId={activeEquipmentId}
                  onSelectEquipment={(id) => {
                    setActiveEquipmentId(id);
                  }}
                  onNavigateDomain={handleNavigateDomain}
                  onNavigateCalculator={handleNavigateCalculator}
                  onNavigateDiagrams={() => handleNavigateDiagram()}
                  onNavigateStandard={handleNavigateStandard}
                />
              )}

              {currentView === 'roles' && (
                <RolesView
                  initialSlug={activeRoleSlug}
                  locale={locale}
                  onBack={() => navigate({ view: 'home' })}
                  onNavigateDomain={handleNavigateDomain}
                  onNavigateStandard={handleNavigateStandard}
                />
              )}

              {currentView === 'standards' && (
                <StandardsView
                  initialRef={activeStandardRef}
                  locale={locale}
                  onBack={() => navigate({ view: 'home' })}
                  onNavigateDomain={handleNavigateDomain}
                  onNavigateRole={handleNavigateRole}
                  onNavigateCalculator={handleNavigateCalculator}
                  onNavigateSimulation={handleNavigateSimulation}
                />
              )}

              {currentView === 'phase2' && (
                <Phase2MasterView
                  locale={locale}
                  onNavigateDomain={handleNavigateDomain}
                  onNavigateStandard={handleNavigateStandard}
                  onNavigateRole={handleNavigateRole}
                />
              )}

              {currentView === 'lifecycle' && (
                <LifecycleView
                  locale={locale}
                  onNavigateCalculator={handleNavigateCalculator}
                  onNavigateSimulation={handleNavigateSimulation}
                  onNavigatePhase2={() => navigate({ view: 'phase2' })}
                  onNavigateStandards={() => navigate({ view: 'standards' })}
                  onNavigateCameroonGrid={() => navigate({ view: 'cameroon-grid' })}
                  onNavigateRegulatory={() => navigate({ view: 'regulatory' })}
                  onNavigateContextStack={handleNavigateContextStack}
                />
              )}

              {currentView === 'cameroon-grid' && (
                <CameroonGridView
                  locale={locale}
                  initialCategory={activeGridCategory}
                  onNavigateCalculator={handleNavigateCalculator}
                  onNavigateSimulation={handleNavigateSimulation}
                  onNavigateDiagram={(topo) => {
                    const mappedTopo: SldTopologyType = 
                      topo === 'single_bus' || topo === 'single-bus-segmented' ? 'single_bus' :
                      topo === 'breaker_and_half' || topo === 'ais-gis-hybrid' ? 'breaker_and_half' :
                      topo === 'rmu_distribution' || topo === 'ring-main-unit' ? 'rmu_distribution' :
                      'double_bus';
                    handleNavigateDiagram(mappedTopo);
                  }}
                  onNavigateEquipment={handleNavigateEquipment}
                  onNavigateStandards={() => navigate({ view: 'standards' })}
                  onNavigateRegulatory={() => navigate({ view: 'regulatory' })}
                  onNavigateContextStack={handleNavigateContextStack}
                  onNavigateHydropower={handleNavigateHydropower}
                />
              )}

              {currentView === 'regulatory' && (
                <RegulatoryView
                  locale={locale}
                  onNavigateCalculator={handleNavigateCalculator}
                  onNavigateSimulation={handleNavigateSimulation}
                  onNavigateCameroonGrid={() => navigate({ view: 'cameroon-grid' })}
                  onNavigateStandards={() => navigate({ view: 'standards' })}
                  onNavigateContextStack={handleNavigateContextStack}
                />
              )}

              {currentView === 'context-stack' && (
                <EngineeringContextStack
                  locale={locale}
                  initialNodeId={activeContextNodeId}
                  onNavigateDomain={handleNavigateDomain}
                  onNavigateEquipment={handleNavigateEquipment}
                  onNavigateCalculator={handleNavigateCalculator}
                  onNavigateSimulation={handleNavigateSimulation}
                  onNavigateDiagram={handleNavigateDiagram}
                  onNavigateCommissioning={() => navigate({ view: 'commissioning' })}
                  onNavigateAssetManagement={handleNavigateAssetManagement}
                />
              )}

              {currentView === 'industrial-projects' && (
                <IndustrialProjectsView
                  locale={locale}
                  onNavigateCalculator={handleNavigateCalculator}
                  onNavigateSimulation={handleNavigateSimulation}
                  onNavigateDiagram={handleNavigateDiagram}
                  onBackToHome={() => navigate({ view: 'home' })}
                />
              )}

              {currentView === 'engineers-chain' && (
                <EngineersChainView
                  locale={locale}
                  onNavigateDomain={handleNavigateDomain}
                  onNavigateRole={handleNavigateRole}
                  onNavigateStandard={handleNavigateStandard}
                />
              )}

              {currentView === 'ecosystem' && (
                <ElectricalEcosystemView
                  locale={locale}
                  onNavigate={navigate}
                />
              )}

              {currentView === 'architectures' && (
                <ArchitectureComparisonWorkbench
                  locale={locale}
                  onNavigateDiagram={handleNavigateDiagram}
                  onNavigateCalculator={handleNavigateCalculator}
                />
              )}

              {currentView === 'protection' && (
                <ProtectionEngineeringWorkbench
                  locale={locale}
                  onNavigate={(view) => navigate({ view: view as AppViewType })}
                  onSelectEquipment={handleNavigateEquipment}
                />
              )}

              {currentView === 'commissioning' && (
                <CommissioningDashboardView
                  locale={locale}
                  onNavigate={(view) => navigate({ view: view as AppViewType })}
                />
              )}

              {currentView === 'knowledge-graph' && (
                <KnowledgeGraphExplorer
                  locale={locale}
                  initialEntityId={activeContextNodeId}
                  onNavigate={(view, ctx) => {
                    if (view === 'simulation') {
                      navigate({ view: 'simulation', simulationTab: ctx?.simulationTab });
                    } else if (view === 'cameroon-grid') {
                      navigate({ view: 'cameroon-grid' });
                    } else {
                      navigate({ view: view as AppViewType });
                    }
                  }}
                />
              )}

              {currentView === 'follow-the-energy' && (
                <FollowTheEnergyView
                  locale={locale}
                  onNavigate={(view, ctx) => {
                    if (view === 'simulation') {
                      navigate({ view: 'simulation', simulationTab: ctx?.simulationTab as any });
                    } else if (view === 'knowledge-graph') {
                      navigate({ view: 'knowledge-graph', contextNodeId: ctx?.entityId });
                    } else {
                      navigate({ view: view as AppViewType });
                    }
                  }}
                  onOpenKnowledgeGraphNode={(id) => {
                    navigate({ view: 'knowledge-graph', contextNodeId: id });
                  }}
                />
              )}

              {currentView === 'scenarios' && (
                <PedagogicalScenariosWorkbench
                  locale={locale}
                  initialScenarioId={activeContextNodeId}
                  onNavigate={(view, ctx) => {
                    if (view === 'simulation') {
                      navigate({ view: 'simulation', simulationTab: ctx?.simulationTab as any });
                    } else if (view === 'knowledge-graph') {
                      navigate({ view: 'knowledge-graph', contextNodeId: ctx?.entityId });
                    } else {
                      navigate({ view: view as AppViewType });
                    }
                  }}
                />
              )}

              {currentView === 'traceability' && (
                <DataProvenanceRegistryView
                  locale={locale}
                  onNavigateEquipment={handleNavigateEquipment}
                  onNavigateCalculator={handleNavigateCalculator}
                  onNavigateCameroonGrid={() => navigate({ view: 'cameroon-grid' })}
                />
              )}

              {currentView === 'thematic-journeys' && (
                <ThematicJourneysWorkbench
                  locale={locale}
                  initialJourneyId={activeContextNodeId}
                  onNavigate={(view, ctx) => {
                    if (view === 'simulation') {
                      navigate({ view: 'simulation', simulationTab: ctx?.simulationTab as any });
                    } else if (view === 'calculators') {
                      navigate({ view: 'calculators', calculatorTab: ctx?.calculatorTab });
                    } else if (view === 'equipment') {
                      handleNavigateEquipment(ctx?.equipmentId || 'eq-trafo-hta-01');
                    } else if (view === 'scenarios') {
                      navigate({ view: 'scenarios', contextNodeId: ctx?.entityId });
                    } else {
                      navigate({ view: view as AppViewType });
                    }
                  }}
                />
              )}
            </Suspense>
          </ErrorBoundary>
          </motion.div>
        </AnimatePresence>

        {/* Discreet Engineering Notice Footer per Section 17 */}
        {currentView !== 'ecosystem' && <Disclaimer locale={locale} />}
        </main>
      </div>

      {/* Global Modals (Lazy Loaded on Demand) */}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            locale={locale}
            initialQuery={searchInitialQuery}
            onNavigateDomain={handleNavigateDomain}
            onNavigateEquipment={handleNavigateEquipment}
            onNavigateRole={handleNavigateRole}
            onNavigateStandard={handleNavigateStandard}
            onNavigateCalculator={handleNavigateCalculator}
            onNavigateSimulation={handleNavigateSimulation}
            onNavigateDiagram={handleNavigateDiagram}
            onNavigateLifecycle={() => {
              navigate({ view: 'lifecycle' });
              setIsSearchOpen(false);
            }}
            onNavigateCameroonGrid={(cat) => {
              navigate({ view: 'cameroon-grid', gridCategory: (cat as any) || 'demarcation' });
              setIsSearchOpen(false);
            }}
            onNavigateRegulatory={() => {
              navigate({ view: 'regulatory' });
              setIsSearchOpen(false);
            }}
            onNavigateJourney={(stage) => {
              handleNavigateJourney(stage);
              setIsSearchOpen(false);
            }}
            onNavigateContextStack={(nodeId) => {
              handleNavigateContextStack(nodeId);
              setIsSearchOpen(false);
            }}
            onNavigateScenarios={(scenarioId) => {
              navigate({ view: 'scenarios', contextNodeId: scenarioId });
              setIsSearchOpen(false);
            }}
            onNavigateTraceability={() => {
              navigate({ view: 'traceability' });
              setIsSearchOpen(false);
            }}
            onNavigateCommissioning={() => {
              navigate({ view: 'commissioning' });
              setIsSearchOpen(false);
            }}
            onNavigateAssetManagement={(pillar) => {
              handleNavigateAssetManagement(pillar);
              setIsSearchOpen(false);
            }}
          />
        </Suspense>
      )}

      {isAssistantOpen && (
        <Suspense fallback={null}>
          <AIAssistantModal
            isOpen={isAssistantOpen}
            onClose={() => setIsAssistantOpen(false)}
            locale={locale}
            activeEquipmentId={activeEquipmentId}
            activeDomainId={activeDomainCode}
            onNavigateDomain={handleNavigateDomain}
            onNavigateEquipment={handleNavigateEquipment}
            onNavigateStandard={handleNavigateStandard}
            onNavigateCalculator={handleNavigateCalculator}
            onNavigateSimulation={handleNavigateSimulation}
            onNavigateCameroonGrid={() => {
              navigate({ view: 'cameroon-grid' });
              setIsAssistantOpen(false);
            }}
            onNavigateRegulatory={() => {
              navigate({ view: 'regulatory' });
              setIsAssistantOpen(false);
            }}
            onNavigateLifecycle={() => {
              navigate({ view: 'lifecycle' });
              setIsAssistantOpen(false);
            }}
            onNavigateDiagram={() => {
              handleNavigateDiagram();
              setIsAssistantOpen(false);
            }}
            onNavigateJourney={() => {
              handleNavigateJourney();
              setIsAssistantOpen(false);
            }}
            onNavigateContextStack={(nodeId) => {
              handleNavigateContextStack(nodeId);
              setIsAssistantOpen(false);
            }}
            onNavigateProtection={() => {
              navigate({ view: 'protection' });
              setIsAssistantOpen(false);
            }}
            onNavigateCommissioning={() => {
              navigate({ view: 'commissioning' });
              setIsAssistantOpen(false);
            }}
          />
        </Suspense>
      )}

      {/* Global Platform Quality & Maturity Modal (16/16 L5 Domains) */}
      {isAuditOpen && (
        <Suspense fallback={null}>
          <PlatformMaturityModal
            isOpen={isAuditOpen}
            onClose={() => setIsAuditOpen(false)}
            locale={locale}
            onNavigateDomain={(code) => {
              handleNavigateDomain(code);
              setIsAuditOpen(false);
            }}
          />
        </Suspense>
      )}

      {/* Field Equipment & Nameplate AI Vision Inspector */}
      {isVisionInspectorOpen && (
        <Suspense fallback={null}>
          <FieldEquipmentVisionInspectorModal
            isOpen={isVisionInspectorOpen}
            onClose={() => setIsVisionInspectorOpen(false)}
            locale={locale}
            onNavigateCalculator={(calcTab) => {
              handleNavigateCalculator(calcTab as any);
              setIsVisionInspectorOpen(false);
            }}
          />
        </Suspense>
      )}

      {/* Field Mobile Bottom Navigation Quick Dock */}
      <MobileFieldQuickDock
        locale={locale}
        currentView={currentView}
        onNavigateView={(v) => navigate({ view: v as AppViewType })}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenVisionInspector={() => setIsVisionInspectorOpen(true)}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
      />

      {/* Mobile QR & Barcode Nameplate Scanner Modal */}
      {isQrScannerOpen && (
        <Suspense fallback={null}>
          <MobileQrScannerModal
            isOpen={isQrScannerOpen}
            onClose={() => setIsQrScannerOpen(false)}
            locale={locale}
            onNavigateEquipment={(id) => {
              handleNavigateEquipment(id);
              setIsQrScannerOpen(false);
            }}
            onNavigateReference={(id) => {
              handleNavigateReference(id);
              setIsQrScannerOpen(false);
            }}
          />
        </Suspense>
      )}

      {/* Recently Explored Context & Saved Engineering Study Paths Drawer */}
      <RecentlyExploredDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        locale={locale}
        onNavigateDomain={(code) => handleNavigateDomain(code as DomainCode)}
        onNavigateEquipment={handleNavigateEquipment}
        onNavigateCalculator={handleNavigateCalculator}
        onNavigateSimulation={handleNavigateSimulation}
        onNavigateContextStack={handleNavigateContextStack}
      />
    </div>
    </UsageLevelProvider>
  );
}
