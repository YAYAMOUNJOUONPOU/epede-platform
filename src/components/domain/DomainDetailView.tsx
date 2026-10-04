// src/components/domain/DomainDetailView.tsx
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  DOMAINS, 
  D01_SUBDOMAINS, 
  OTHER_SUBDOMAINS, 
  SUBDOMAIN_CONTENTS, 
  EQUIPMENT_ITEMS,
  FORMULAS,
  STANDARDS,
  ENGINEERING_ROLES
} from '../../data/epedeData';
import { FormulaBlock } from '../ui/FormulaBlock';
import { StandardBadge } from '../ui/StandardBadge';
import { VoltageIndicator } from '../ui/VoltageIndicator';
import { ArrowLeft, ExternalLink, Zap, Globe, FileCode, ClipboardList, Award, CheckCircle2, Layers, ChevronDown, Activity } from 'lucide-react';
import type { DomainCode, Subdomain } from '../../types/epede';
import { EPEDE_MATURITY_REGISTRY } from '../../data/contentMaturityEngine';
import { Phase2SpecViewer } from './Phase2SpecViewer';
import { DomainAnsiTable } from './modules/DomainAnsiTable';
import { DomainSystemsTab } from './modules/DomainSystemsTab';
import { DomainCameroonReferenceCard } from './modules/DomainCameroonReferenceCard';
import { FiveLevelArchitectureTab } from './modules/FiveLevelArchitectureTab';
import { DomainVisualEngineeringAsset } from './modules/DomainVisualEngineeringAsset';
import { EngineeringFormulaSolverCard } from './modules/EngineeringFormulaSolverCard';
import { getDomainFormulaConfig } from './modules/domainFormulaSolversRegistry';
import { DomainRelationshipMatrix } from './modules/DomainRelationshipMatrix';
import { DomainEngineeringWorkbench } from './modules/DomainEngineeringWorkbench';
import { DomainEngineeringKpiBanner } from './modules/DomainEngineeringKpiBanner';
import { PowerSystemChainNavigator, type ChainStageId } from '../navigation/PowerSystemChainNavigator';
import { DomainDocumentationSection } from '../docs/DomainDocumentationSection';
import { EngineeringInfographicsGallerySection } from '../common/EngineeringInfographicsGallerySection';
import { EngineeringLoadingSkeleton } from '../common/EngineeringLoadingSkeleton';
import type { InstallationPillar } from '../installations/InstallationsWorkbench';
import {
  EngineeringRelationshipTraceCard,
  AssumptionsLimitationsCard,
  WhyThisMattersCard,
  KeyEngineeringDecisionsCard,
  RoleExplorationToolbar,
  ObjectRelationshipActionBar,
  SystemBoundaryCard
} from '../context';
import { EvidenceTrustBadge } from '../trust/EvidenceTrustBadge';
import { DomainPendingIssuesPanel } from './modules/DomainPendingIssuesPanel';

// Code-Split Dynamic Workbenches for Core Web Vitals Optimization
const EnergyProductionMainView = lazy(() => import('../production/EnergyProductionMainView').then(m => ({ default: m.EnergyProductionMainView })));
const GridArchitectureVisualJourney = lazy(() => import('../grid-architecture/GridArchitectureVisualJourney').then(m => ({ default: m.GridArchitectureVisualJourney })));
const TransmissionWorkbench = lazy(() => import('../transmission/TransmissionWorkbench').then(m => ({ default: m.TransmissionWorkbench })));
const SubstationsWorkbench = lazy(() => import('../substations/SubstationsWorkbench').then(m => ({ default: m.SubstationsWorkbench })));
const DistributionWorkbench = lazy(() => import('../distribution/DistributionWorkbench').then(m => ({ default: m.DistributionWorkbench })));
const InstallationsWorkbench = lazy(() => import('../installations/InstallationsWorkbench').then(m => ({ default: m.InstallationsWorkbench })));
const AutomationControlWorkbench = lazy(() => import('../automation/AutomationControlWorkbench').then(m => ({ default: m.AutomationControlWorkbench })));
const ExtraLowVoltageWorkbench = lazy(() => import('../elv/ExtraLowVoltageWorkbench').then(m => ({ default: m.ExtraLowVoltageWorkbench })));
const AdvancedAiWorkbench = lazy(() => import('../ai/AdvancedAiWorkbench').then(m => ({ default: m.AdvancedAiWorkbench })));
const EnergyStorageWorkbench = lazy(() => import('../storage/EnergyStorageWorkbench').then(m => ({ default: m.EnergyStorageWorkbench })));
const ProtectionEngineeringWorkbench = lazy(() => import('../protection/ProtectionEngineeringWorkbench').then(m => ({ default: m.ProtectionEngineeringWorkbench })));
const ScadaAutomationWorkbench = lazy(() => import('../scada/ScadaAutomationWorkbench').then(m => ({ default: m.ScadaAutomationWorkbench })));
const TelecomIec61850Workbench = lazy(() => import('../telecom/TelecomIec61850Workbench').then(m => ({ default: m.TelecomIec61850Workbench })));
const PowerQualityEmcWorkbench = lazy(() => import('../power-quality/PowerQualityEmcWorkbench').then(m => ({ default: m.PowerQualityEmcWorkbench })));
const AssetManagementDiagnosticsWorkbench = lazy(() => import('../assets/AssetManagementDiagnosticsWorkbench').then(m => ({ default: m.AssetManagementDiagnosticsWorkbench })));
const SmartMeteringGridDigitalizationWorkbench = lazy(() => import('../metering/SmartMeteringGridDigitalizationWorkbench').then(m => ({ default: m.SmartMeteringGridDigitalizationWorkbench })));
const SubstationEarthingLightningWorkbench = lazy(() => import('../safety/SubstationEarthingLightningWorkbench').then(m => ({ default: m.SubstationEarthingLightningWorkbench })));

const DOMAIN_INFOGRAPHIC_CATEGORY_MAP: Record<string, 'OVERVIEW' | 'SUBSTATION' | 'TRANSMISSION' | 'PROTECTION' | 'SAFETY' | 'GENERATION' | 'DISTRIBUTION' | 'ALL'> = {
  D01: 'GENERATION',
  D02: 'OVERVIEW',
  D03: 'TRANSMISSION',
  D04: 'SUBSTATION',
  D05: 'DISTRIBUTION',
  D06: 'SAFETY',
  D07: 'PROTECTION',
  D08: 'GENERATION',
  D09: 'DISTRIBUTION',
  D10: 'DISTRIBUTION',
  D11: 'PROTECTION',
  D12: 'SUBSTATION',
  D13: 'TRANSMISSION',
  D14: 'PROTECTION',
  D15: 'DISTRIBUTION',
  D16: 'SAFETY'
};

interface DomainDetailViewProps {
  domainCode: DomainCode;
  locale: 'fr' | 'en';
  onBack: () => void;
  onSelectEquipment: (id: string) => void;
  onSelectStandard: (ref: string) => void;
  onSelectRole: (slug: string) => void;
  onNavigateContextStack?: (nodeId?: string) => void;
  onNavigateView?: (view: string, domainCode?: string) => void;
}

const DOMAIN_SPINE_MAPPING: Record<DomainCode, string> = {
  D01: 'node-gen-g1',
  D02: 'node-sub-oyomabang',
  D03: 'node-line-225-bekoko',
  D04: 'node-bay-song-225',
  D05: 'node-feeder-30-ind',
  D06: 'node-tgbt-400',
  D07: 'node-motor-250',
  D08: 'node-tgbt-400',
  D09: 'node-auto-scada-ems',
  D10: 'node-sub-oyomabang',
  D11: 'node-prot-87t',
  D12: 'node-auto-sas',
  D13: 'node-line-225-bekoko',
  D14: 'node-trafo-main-30',
  D15: 'node-sub-oyomabang',
  D16: 'node-bay-song-225',
};

export const DomainDetailView: React.FC<DomainDetailViewProps> = ({
  domainCode,
  locale,
  onBack,
  onSelectEquipment,
  onSelectStandard,
  onSelectRole,
  onNavigateContextStack,
  onNavigateView,
}) => {
  const domain = DOMAINS.find((d) => d.code === domainCode) || DOMAINS[0];
  const isD01 = domainCode === 'D01';
  const isD02 = domainCode === 'D02';
  const isD03 = domainCode === 'D03';
  const isD04 = domainCode === 'D04';
  const isD05 = domainCode === 'D05';
  const isD06 = domainCode === 'D06';
  const isD07 = domainCode === 'D07';
  const isD08 = domainCode === 'D08';
  const isD09 = domainCode === 'D09';
  const isD10 = domainCode === 'D10';
  const isD11 = domainCode === 'D11';
  const isD12 = domainCode === 'D12';
  const isD13 = domainCode === 'D13';
  const isD14 = domainCode === 'D14';
  const isD15 = domainCode === 'D15';
  const isD16 = domainCode === 'D16';

  // Subdomains for this domain
  const subdomains = isD01
    ? D01_SUBDOMAINS
    : OTHER_SUBDOMAINS.filter((s) => s.domain_code === domainCode);

  const [activeSubdomainCode, setActiveSubdomainCode] = useState<string>(
    subdomains[0]?.code || `${domainCode}.01`
  );

  // Sync subdomain when navigating between domains
  useEffect(() => {
    if (subdomains.length > 0) {
      setActiveSubdomainCode(subdomains[0].code);
    } else {
      setActiveSubdomainCode(`${domainCode}.01`);
    }
    if (['D07', 'D08', 'D09', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16'].includes(domainCode)) {
      setActiveGroupTab('workbench');
    }
  }, [domainCode]);

  // Grouped tabs (including Documentation & Specs, Visuals & Schematics, Workbench, 5-Level Architecture, Phase 2 Master Specification, & 21-Domain Matrix)
  const [activeGroupTab, setActiveGroupTab] = useState<
    'workbench' | 'five_levels' | 'concept' | 'systems' | 'engineering' | 'formulas' | 'standards' | 'roles' | 'examples' | 'phase2_spec' | 'relationships' | 'documentation' | 'visuals'
  >(['D07', 'D08', 'D09', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16'].includes(domainCode) ? 'workbench' : 'five_levels');

  // Specific state for D01 Energy Production, D02 Grid Architecture, D03 Transmission Networks, & D04 Substations: default to visual interactive journey
  const [d01Mode, setD01Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d02Mode, setD02Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d03Mode, setD03Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d04Mode, setD04Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d05Mode, setD05Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d06Mode, setD06Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [showD06Metrics, setShowD06Metrics] = useState<boolean>(false);
  const [d07Mode, setD07Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d08Mode, setD08Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d09Mode, setD09Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d10Mode, setD10Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d11Mode, setD11Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d12Mode, setD12Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d13Mode, setD13Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d14Mode, setD14Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d15Mode, setD15Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d16Mode, setD16Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d06InitialPillar, setD06InitialPillar] = useState<InstallationPillar>('INTERACTIVE_SLD');

  const isChainDomain = ['D01', 'D02', 'D03', 'D04', 'D05', 'D06'].includes(domainCode);

  const currentChainStageId: ChainStageId =
    isD01 ? 'D01' :
    isD02 ? 'D02' :
    isD03 ? 'D03' :
    isD04 ? 'D04' :
    isD05 ? 'D05' :
    isD06 && d06InitialPillar === 'FINAL_CIRCUITS' ? 'D06_TD' :
    'D06';

  const handleNavigateChainStage = (stageId: ChainStageId, targetDomain: DomainCode) => {
    if (stageId === 'D06_TD') {
      setD06InitialPillar('FINAL_CIRCUITS');
      setD06Mode('visual_journey');
      if (domainCode !== 'D06') {
        onNavigateView?.('domain', 'D06');
      }
    } else {
      if (targetDomain === 'D06') {
        setD06InitialPillar('INTERACTIVE_SLD');
        setD06Mode('visual_journey');
      }
      onNavigateView?.('domain', targetDomain);
    }
  };

  const activeContent = SUBDOMAIN_CONTENTS[activeSubdomainCode] || 
    SUBDOMAIN_CONTENTS[`${domainCode}.01`] || 
    SUBDOMAIN_CONTENTS['D01.01'];
  const domainEquipments = EQUIPMENT_ITEMS.filter((eq) => eq.domain_code === domainCode);

  // Collect domain-level formulas, standards, and roles
  const domainFormulas = FORMULAS.filter(
    (f) => f.applicable_domains.includes(domainCode) || f.domain_code === domainCode
  );
  const displayFormulas = domainFormulas.length > 0 ? domainFormulas : activeContent.formulas;

  const domainStandards = STANDARDS.filter((s) => s.domain_codes?.includes(domainCode));
  const displayStandards = domainStandards.length > 0 ? domainStandards : activeContent.standards;

  const domainRoles = ENGINEERING_ROLES.filter((r) => r.domain_codes?.includes(domainCode));
  const displayRoles = domainRoles.length > 0 ? domainRoles : activeContent.roles;

  // Header background & styling
  const headerBg = isD11
    ? 'bg-gradient-to-r from-[#3B0707] via-[#200A0A] to-[#0D1117] border-red-900/60'
    : isD16
    ? 'bg-gradient-to-r from-[#3B0707] via-[#2D1606] to-[#0D1117] border-red-900/60'
    : 'bg-[#0D1117] border-[#252E38] cad-grid-dense';

  return (
    <div className="space-y-6">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{locale === 'fr' ? 'RETOUR À LA VUE GLOBALE' : 'BACK TO GLOBAL VIEW'}</span>
        </button>

        <div className="flex items-center gap-2">
          {onNavigateContextStack && (
            <button
              type="button"
              onClick={() => onNavigateContextStack(DOMAIN_SPINE_MAPPING[domainCode] || 'node-trafo-main-30')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold transition-all shadow-xs"
            >
              <Zap className="h-3.5 w-3.5 text-sky-200" />
              <span>{locale === 'fr' ? 'Épine Dorsale & TCC' : 'Spine & TCC Stack'}</span>
            </button>
          )}
          <span className="font-mono text-xs font-bold text-neutral-500">
            {domain.domain_group === 'chain'
              ? locale === 'fr' ? 'CHAÎNE PHYSIQUE' : 'PHYSICAL CHAIN'
              : locale === 'fr' ? 'DISCIPLINE SYSTÈME' : 'ENGINEERING DISCIPLINE'}
          </span>
          <span className="font-mono text-xs font-bold text-cyan-400 bg-[#080B10] px-2.5 py-1 rounded-lg border border-[#252E38]">
            {domain.code}
          </span>
        </div>
      </div>

      {/* EPEDE Master Physical Chain Stepper Navigator (Production → Architecture → Transport → Postes → Distribution → Installations → Tableaux) */}
      {isChainDomain && (
        <PowerSystemChainNavigator
          currentStageId={currentChainStageId}
          locale={locale}
          onNavigateStage={handleNavigateChainStage}
        />
      )}

      {/* Domain Header Screen */}
      <header
        className={`rounded-2xl border p-6 sm:p-8 relative overflow-hidden shadow-2xl ${headerBg}`}
      >
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-widest text-cyan-400 uppercase">
                DOMAIN {domain.code} · CAD ARCHITECTURE v1.2
              </span>
              <EvidenceTrustBadge
                type="VERIFIED_STANDARD"
                locale={locale}
                size="sm"
                governingStandard={`IEC / CIGRE / NF · Domain ${domain.code}`}
              />
              {EPEDE_MATURITY_REGISTRY[domainCode] && (
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>
                    {locale === 'fr'
                      ? `NIVEAU 5 EXCELLENCE (${EPEDE_MATURITY_REGISTRY[domainCode].maturityScorePercent}%)`
                      : `LEVEL 5 EXCELLENCE (${EPEDE_MATURITY_REGISTRY[domainCode].maturityScorePercent}%)`}
                  </span>
                </span>
              )}
            </div>
            {isD11 && (
              <span className="font-mono text-xs text-red-200 bg-red-950/90 border border-red-800 px-3 py-1 rounded font-bold tracking-wider uppercase">
                ⚠️ CRITICAL PROTECTION & MEASUREMENTS
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#F3F4F6] font-mono">
            {locale === 'fr' ? domain.name_fr : domain.name_en}
          </h1>

          <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-3xl leading-relaxed font-medium">
            {locale === 'fr' ? domain.description_fr : domain.description_en}
          </p>

          {/* Key Domain Tags / Voltage indicator */}
          <div className="mt-6 pt-5 border-t border-[#252E38] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {isD01 && (
                <>
                  {['Hydro', 'Thermal', 'Nuclear', 'Solar PV', 'Wind', 'Biomass'].map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs font-bold bg-[#080B10] text-neutral-300 px-2.5 py-1 rounded border border-[#252E38]"
                    >
                      {tag}
                    </span>
                  ))}
                </>
              )}
              {isD11 && (
                <>
                  {['87T', '87G', '87B', '21', '50/51', '67N', '81', 'IEC 60255'].map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs bg-red-950/90 text-red-200 font-bold px-2.5 py-1 rounded border border-red-800"
                    >
                      {tag}
                    </span>
                  ))}
                </>
              )}
              {!isD01 && !isD11 && (
                <span className="font-mono text-xs font-bold text-neutral-400">
                  {domainEquipments.length} {locale === 'fr' ? 'équipements documentés' : 'documented equipment'}
                </span>
              )}
            </div>

            {/* Voltage Level */}
            <div className="flex items-center gap-2 font-mono text-xs font-bold">
              <span className="text-neutral-500">{locale === 'fr' ? 'Niveau de tension :' : 'Voltage Level:'}</span>
              <span className="text-cyan-400 font-bold">
                {isD01
                  ? '11 kV → 225 kV (GSU)'
                  : isD02
                  ? '225 kV · 90 kV · 30 kV · 400 V'
                  : isD05
                  ? '30 kV · 15 kV · 400 V / 230 V (HTA/BT)'
                  : isD06
                  ? '400 V / 230 V L1-L2-L3-N-PE (BT)'
                  : isD07
                  ? '24 V DC · 400 V / 230 V (Automatisme & Contrôle)'
                  : isD08
                  ? '12 V / 24 V / 48 V DC · PoE 802.3bt (Courants Faibles)'
                  : isD09
                  ? 'Edge / Cloud · IoT / Télémétrie · IIoT'
                  : isD11
                  ? 'HTB / HTA / BT'
                  : '225 kV / 30 kV'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* D06 DEDICATED MASTER MODE SWITCHER (Directly underneath header for immediate orientation) */}
      {isD06 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-amber-800/50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Mode d\'Exploration Installations Électriques & Utilisation :' : 'Electrical Installations Exploration Mode:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD06Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
                d06Mode === 'visual_journey'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '⚡ Parcours d\'Ingénierie Basse Tension (5 Grandes Étapes)' : '⚡ Low-Voltage Engineering Lifecycle (5 Master Stages)'}
            </button>
            <button
              type="button"
              onClick={() => setD06Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
                d06Mode === 'spec_catalog'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}

      {/* DOMAIN DIAGNOSTICS & METRICS TRAY */}
      {isD06 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowD06Metrics(!showD06Metrics)}
            className="w-full flex items-center justify-between p-2.5 px-4 text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>
                {locale === 'fr' 
                  ? 'Traçabilité Système, Métriques KPI & Registre NCR (Conformité)' 
                  : 'System Traceability, KPI Metrics & NCR Registry'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {domainEquipments.length} {locale === 'fr' ? 'équipements' : 'assets'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span>{showD06Metrics ? (locale === 'fr' ? 'Masquer' : 'Hide') : (locale === 'fr' ? 'Afficher les métriques globales' : 'Show global metrics')}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showD06Metrics ? 'rotate-180' : ''}`} />
            </div>
          </button>
          {showD06Metrics && (
            <div className="p-4 space-y-4 border-t border-slate-800 bg-slate-950/40">
              <ObjectRelationshipActionBar
                nodeId={DOMAIN_SPINE_MAPPING[domainCode] || 'node-trafo-main-30'}
                locale={locale}
                onNavigateContextStack={onNavigateContextStack}
                onNavigateDomain={(dCode) => onNavigateView?.('domain', dCode)}
              />
              <DomainEngineeringKpiBanner
                domainCode={domainCode}
                locale={locale}
                onSelectEquipment={onSelectEquipment}
                onNavigateView={onNavigateView}
              />
              <DomainPendingIssuesPanel
                locale={locale}
                domainCode={domainCode}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 10-ACTION UNIVERSAL RELATIONSHIP & TRACE HUB */}
          <ObjectRelationshipActionBar
            nodeId={DOMAIN_SPINE_MAPPING[domainCode] || 'node-trafo-main-30'}
            locale={locale}
            onNavigateContextStack={onNavigateContextStack}
            onNavigateDomain={(dCode) => onNavigateView?.('domain', dCode)}
          />

          {/* DOMAIN ENGINEERING KPI DASHBOARD & APPARATUS CENSUS RIBBON */}
          <DomainEngineeringKpiBanner
            domainCode={domainCode}
            locale={locale}
            onSelectEquipment={onSelectEquipment}
            onNavigateView={onNavigateView}
          />

          {/* DOMAIN PENDING ISSUES & NCR DEFICIENCY TRACKER */}
          <DomainPendingIssuesPanel
            locale={locale}
            domainCode={domainCode}
          />
        </>
      )}

      {/* SPECIAL TREATMENT FOR D01: MODE SWITCHER BETWEEN VISUAL JOURNEY & CATALOG */}
      {isD01 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-sky-800/50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Mode d\'Exploration Production :' : 'Production Exploration Mode:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD01Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d01Mode === 'visual_journey'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '⚡ Environnement Visuel Dédié (6 Piliers)' : '⚡ Visual Journey (6 Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD01Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d01Mode === 'spec_catalog'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}

      {/* SPECIAL TREATMENT FOR D02: MODE SWITCHER BETWEEN VISUAL ARCHITECTURE JOURNEY & CATALOG */}
      {isD02 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-sky-800/50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Mode d\'Exploration Architecture & Planification :' : 'Grid Architecture Exploration Mode:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD02Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d02Mode === 'visual_journey'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '⚡ Architecture Visuelle & Planification (5 Piliers)' : '⚡ Grid Architecture Journey (5 Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD02Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d02Mode === 'spec_catalog'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}

      {/* SPECIAL TREATMENT FOR D03: MODE SWITCHER BETWEEN VISUAL TRANSMISSION WORKBENCH & CATALOG */}
      {isD03 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-sky-800/50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Mode d\'Exploration Réseaux de Transport HT :' : 'Transmission Networks Exploration Mode:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD03Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d03Mode === 'visual_journey'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '⚡ Station d\'Ingénierie Transport HT (12 Piliers Fondamentaux)' : '⚡ Transmission Engineering Workbench (12 Core Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD03Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d03Mode === 'spec_catalog'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}

      {/* SPECIAL TREATMENT FOR D04: MODE SWITCHER BETWEEN VISUAL SUBSTATION WORKBENCH & CATALOG */}
      {isD04 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-amber-800/50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Mode d\'Exploration Postes Électriques :' : 'Substation Engineering Exploration Mode:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD04Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d04Mode === 'visual_journey'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '⚡ Station d\'Ingénierie Postes HTB/HTA (11 Piliers)' : '⚡ Substation Engineering Workbench (11 Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD04Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d04Mode === 'spec_catalog'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}

      {/* SPECIAL TREATMENT FOR D05: MODE SWITCHER BETWEEN VISUAL DISTRIBUTION WORKBENCH & CATALOG */}
      {isD05 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-amber-800/50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Mode d\'Exploration Distribution HTA/BT :' : 'Distribution Engineering Exploration Mode:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD05Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d05Mode === 'visual_journey'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '⚡ Station d\'Ingénierie Distribution HTA/BT (10 Piliers)' : '⚡ Distribution Engineering Workbench (10 Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD05Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d05Mode === 'spec_catalog'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}



      {/* SPECIAL TREATMENT FOR D07: MODE SWITCHER BETWEEN VISUAL AUTOMATION WORKBENCH & CATALOG */}
      {isD07 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-cyan-800/50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Mode d\'Exploration Automatisation & Contrôle :' : 'Automation & Control Exploration Mode:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD07Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d07Mode === 'visual_journey'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '⚡ Station Expert Automatisation & PLC (7 Piliers)' : '⚡ Automation & PLC Workbench (7 Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD07Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d07Mode === 'spec_catalog'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}

      {/* SPECIAL TREATMENT FOR D08: MODE SWITCHER BETWEEN VISUAL ELV WORKBENCH & CATALOG */}
      {isD08 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-amber-800/50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e8a825] animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Mode d\'Exploration Courants Faibles & Systèmes Spéciaux :' : 'Extra Low Voltage Exploration Mode:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD08Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d08Mode === 'visual_journey'
                  ? 'bg-[#e8a825] text-slate-950 font-bold shadow-md shadow-[#e8a825]/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '⭐ Station Expert Courants Faibles & SSI (8 Piliers)' : '⭐ ELV & Life Safety Workbench (8 Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD08Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d08Mode === 'spec_catalog'
                  ? 'bg-[#e8a825] text-slate-950 font-bold shadow-md shadow-[#e8a825]/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}

      {/* SPECIAL TREATMENT FOR D09: MODE SWITCHER BETWEEN VISUAL AI WORKBENCH & CATALOG */}
      {isD09 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-indigo-800/50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1] animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Mode d\'Exploration IA & Technologies Avancées :' : 'AI & Advanced Tech Exploration Mode:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD09Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d09Mode === 'visual_journey'
                  ? 'bg-[#6366f1] text-white font-bold shadow-md shadow-[#6366f1]/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '🚀 Station Expert IA & Jumeau Numérique (6 Piliers)' : '🚀 AI & Digital Twin Workbench (6 Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD09Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d09Mode === 'spec_catalog'
                  ? 'bg-[#6366f1] text-white font-bold shadow-md shadow-[#6366f1]/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}

      {/* SPECIAL TREATMENT FOR D10: MODE SWITCHER BETWEEN VISUAL BESS & CHARGING WORKBENCH & CATALOG */}
      {isD10 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-emerald-800/50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Mode d\'Exploration Stockage BESS & IRVE :' : 'BESS Storage & EV Charging Mode:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD10Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d10Mode === 'visual_journey'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '⚡ Station Expert Stockage BESS & IRVE (7 Piliers)' : '⚡ BESS & EV Charging Workbench (7 Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD10Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d10Mode === 'spec_catalog'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}

      {isD11 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-red-800/50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Mode d\'Exploration Protections & Réseau :' : 'Protection & System Studies Mode:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD11Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d11Mode === 'visual_journey'
                  ? 'bg-red-500 text-white font-bold shadow-md shadow-red-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '⚡ Station Expert Protections & Études (7 Piliers)' : '⚡ Protection & Studies Workbench (7 Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD11Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d11Mode === 'spec_catalog'
                  ? 'bg-red-500 text-white font-bold shadow-md shadow-red-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Tableau ANSI' : '📋 Subdomain Catalog & ANSI Table'}
            </button>
          </div>
        </div>
      )}

      {isD12 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-teal-800/50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Mode d\'Exploration Téléconduite & SCADA :' : 'Automation & SCADA Exploration Mode:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD12Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d12Mode === 'visual_journey'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '⚡ Station Expert Téléconduite & SCADA (7 Piliers)' : '⚡ SCADA & Automation Workbench (7 Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD12Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d12Mode === 'spec_catalog'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}

      {isD13 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-teal-800/50 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {locale === 'fr' ? 'Mode d\'Exploration Télécommunications & CEI 61850 :' : 'Telecom & IEC 61850 Exploration Mode:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD13Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d13Mode === 'visual_journey'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '⚡ Station Expert Télécommunications & CEI 61850 (7 Piliers)' : '⚡ Telecom & IEC 61850 Workbench (7 Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD13Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d13Mode === 'spec_catalog'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}

      {/* D14 WORKBENCH MODE TOGGLE */}
      {isD14 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              {locale === 'fr' ? 'Environnement D14 · Qualité de l\'Énergie, Harmoniques & CEM :' : 'D14 Environment · Power Quality, Harmonics & EMC :'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD14Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d14Mode === 'visual_journey'
                  ? 'bg-violet-500 text-slate-950 font-bold shadow-md shadow-violet-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '⚡ Workbench Expert Qualité d\'Onde & THD (7 Piliers)' : '⚡ Power Quality & THD Workbench (7 Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD14Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d14Mode === 'spec_catalog'
                  ? 'bg-violet-500 text-slate-950 font-bold shadow-md shadow-violet-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}

      {/* D15 WORKBENCH MODE TOGGLE */}
      {isD15 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              {locale === 'fr' ? 'Environnement D15 · Comptage Intelligent, STS & Smart Grids :' : 'D15 Environment · Smart Metering, STS & Smart Grids :'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD15Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d15Mode === 'visual_journey'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '⚡ Station Expert Smart Metering & MDM (5 Piliers)' : '⚡ Smart Metering & MDM Workbench (5 Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD15Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d15Mode === 'spec_catalog'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}

      {/* D16 WORKBENCH MODE TOGGLE */}
      {isD16 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              {locale === 'fr' ? 'Environnement D16 · Sécurité, Prises de Terre & Foudre :' : 'D16 Environment · Safety, Earthing & Lightning :'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setD16Mode('visual_journey')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d16Mode === 'visual_journey'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '🛡️ Workbench Expert Sécurité & IEEE 80 (7 Piliers)' : '🛡️ Safety & IEEE 80 Ground Grid Workbench (7 Pillars)'}
            </button>
            <button
              type="button"
              onClick={() => setD16Mode('spec_catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                d16Mode === 'spec_catalog'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {locale === 'fr' ? '📋 Fiches Sous-Domaines & Spécifications' : '📋 Subdomain Catalog & Specs'}
            </button>
          </div>
        </div>
      )}

      {/* D01 VISUAL JOURNEY ENVIRONMENT */}
      <Suspense fallback={<EngineeringLoadingSkeleton locale={locale} />}>
      {isD01 && d01Mode === 'visual_journey' ? (
        <EnergyProductionMainView
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateToDomain={(dCode) => onNavigateView?.('domain', dCode)}
        />
      ) : isD02 && d02Mode === 'visual_journey' ? (
        <GridArchitectureVisualJourney
          locale={locale}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD03 && d03Mode === 'visual_journey' ? (
        <TransmissionWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD04 && d04Mode === 'visual_journey' ? (
        <SubstationsWorkbench
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigate={onNavigateView}
        />
      ) : isD05 && d05Mode === 'visual_journey' ? (
        <DistributionWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          activeSubdomainId={activeSubdomainCode}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD06 && d06Mode === 'visual_journey' ? (
        <InstallationsWorkbench
          locale={locale}
          initialPillar={d06InitialPillar}
        />
      ) : isD07 && d07Mode === 'visual_journey' ? (
        <AutomationControlWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD08 && d08Mode === 'visual_journey' ? (
        <ExtraLowVoltageWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD09 && d09Mode === 'visual_journey' ? (
        <AdvancedAiWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD10 && d10Mode === 'visual_journey' ? (
        <EnergyStorageWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD11 && d11Mode === 'visual_journey' ? (
        <ProtectionEngineeringWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD12 && d12Mode === 'visual_journey' ? (
        <ScadaAutomationWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD13 && d13Mode === 'visual_journey' ? (
        <TelecomIec61850Workbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD14 && d14Mode === 'visual_journey' ? (
        <PowerQualityEmcWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD15 && d15Mode === 'visual_journey' ? (
        <SmartMeteringGridDigitalizationWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD16 && d16Mode === 'visual_journey' ? (
        <SubstationEarthingLightningWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : (
        <>
          {/* SPECIAL TREATMENT FOR D11: ANSI PROTECTION RELAY CODES WORKSTATION TABLE */}
          {isD11 && <DomainAnsiTable locale={locale} />}

          {/* VISUAL ENGINEERING SCHEMATIC & ASSET LAYOUT (IEC Standardized Drawing) */}
          <section className="space-y-2">
            <DomainVisualEngineeringAsset domainCode={domainCode} locale={locale} />
          </section>

          {/* SUBDOMAINS TABS NAVIGATION */}
          {subdomains.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono font-bold text-xs sm:text-sm text-white uppercase tracking-widest flex items-center gap-2">
              <span className="text-cyan-400">◈</span>
              <span>{locale === 'fr' ? 'SOUS-DOMAINES & TECHNOLOGIES' : 'SUBDOMAINS & TECHNOLOGIES'}</span>
            </h3>
            <span className="font-mono text-xs font-bold text-neutral-500">
              {subdomains.length} {locale === 'fr' ? 'sous-domaines' : 'subdomains'}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {subdomains.map((sub) => {
              const isSelected = activeSubdomainCode === sub.code;
              return (
                <button
                  key={sub.code}
                  type="button"
                  data-testid="subdomain-card"
                  onClick={() => setActiveSubdomainCode(sub.code)}
                  className={`shrink-0 px-4 py-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-md ring-1 ring-cyan-400'
                      : 'border-[#252E38] bg-[#0D1117] text-neutral-400 hover:text-white hover:border-cyan-500/40'
                  }`}
                >
                  <div className="font-mono text-xs font-bold text-cyan-400">{sub.code}</div>
                  <div className="text-xs font-bold truncate max-w-[200px] mt-0.5 font-mono">
                    {locale === 'fr' ? sub.name_fr : sub.name_en}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 10 GROUPED CONTENT TABS */}
      <section className="rounded-2xl border border-[#252E38] bg-[#0D1117] overflow-hidden shadow-xl">
        {/* Navigation bar for the tabs */}
        <div className="border-b border-[#252E38] bg-[#080B10] px-4 flex items-center gap-1 overflow-x-auto">
          {[
            ...(['D07', 'D08', 'D09', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16'].includes(domainCode) ? [{ 
              id: 'workbench', 
              label_fr: `⚙️ Station d'Ingénierie ${domainCode}`, 
              label_en: `⚙️ ${domainCode} Engineering Workbench` 
            }] : []),
            { id: 'five_levels', label_fr: '⚡ Architecture 5 Niveaux', label_en: '⚡ 5-Level Architecture' },
            { id: 'concept', label_fr: 'Concept & Principes', label_en: 'Concept & Principles' },
            { id: 'systems', label_fr: 'Systèmes & Équipements', label_en: 'Systems & Hardware' },
            { id: 'engineering', label_fr: 'Ingénierie & Protection', label_en: 'Engineering & Protection' },
            { id: 'formulas', label_fr: 'Formules & Calcul', label_en: 'Formulas & Solvers' },
            { id: 'standards', label_fr: 'Normes CEI/IEEE', label_en: 'Standards' },
            { id: 'roles', label_fr: 'Métiers & Rôles', label_en: 'Roles' },
            { id: 'examples', label_fr: '🌍 Cas Cameroun & Réf.', label_en: '🌍 Cameroon & Ref Cases' },
            { id: 'relationships', label_fr: '🔗 Matrice 21 Domaines', label_en: '🔗 21-Domain Matrix' },
            { id: 'documentation', label_fr: '📁 Documentation & Spécifications', label_en: '📁 Documentation & Specs' },
            { id: 'visuals', label_fr: '📊 Infographies & Schémas', label_en: '📊 Infographics & Schematics' },
            { id: 'phase2_spec', label_fr: '📋 Spécification Phase 2 (43 pts)', label_en: '📋 Phase 2 Spec (43 pts)' },
          ].map((tab) => {
            const isTabActive = activeGroupTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveGroupTab(tab.id as typeof activeGroupTab)}
                className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap font-mono ${
                  isTabActive
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-400/5'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                {locale === 'fr' ? tab.label_fr : tab.label_en}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div className="p-6 sm:p-8">

          {/* D07 ENGINEERING WORKBENCH */}
          {activeGroupTab === 'workbench' && (
            <DomainEngineeringWorkbench
              domainCode={domainCode}
              locale={locale}
              onSelectEquipment={onSelectEquipment}
              onSelectStandard={onSelectStandard}
              onSelectRole={onSelectRole}
              onNavigateDomain={(code) => onNavigateView?.('domain', code)}
              onNavigateCalculator={(tab) => onNavigateView?.('calculators', tab)}
              onNavigateSimulation={(tab) => onNavigateView?.('simulations', tab)}
            />
          )}

          {/* 0. 5-LEVEL ARCHITECTURE */}
          {activeGroupTab === 'five_levels' && (
            <FiveLevelArchitectureTab
              domainCode={domainCode}
              locale={locale}
              onSelectEquipment={onSelectEquipment}
              onSelectStandard={onSelectStandard}
              onSelectRole={onSelectRole}
              onNavigateDomain={(code) => onNavigateView?.('domain', code)}
            />
          )}

          {/* 1. CONCEPT */}
          {activeGroupTab === 'concept' && (
            <div className="space-y-4 max-w-4xl">
              <h4 className="text-lg font-bold uppercase tracking-tight text-white font-mono">
                {locale === 'fr' ? '1. Principes Physiques & Variantes' : '1. Physical Principles & Variants'}
              </h4>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed whitespace-pre-line font-medium">
                {locale === 'fr' ? activeContent.concept_fr : activeContent.concept_en}
              </p>
            </div>
          )}

          {/* 2. SYSTÈMES */}
          {activeGroupTab === 'systems' && (
            <DomainSystemsTab
              systems_fr={activeContent.systems_fr}
              systems_en={activeContent.systems_en}
              domainEquipments={domainEquipments}
              locale={locale}
              onSelectEquipment={onSelectEquipment}
            />
          )}

          {/* 3. INGÉNIERIE */}
          {activeGroupTab === 'engineering' && (
            <div className="space-y-4 max-w-4xl">
              <h4 className="text-lg font-bold uppercase tracking-tight text-white font-mono">
                {locale === 'fr' ? '3. Philosophie d\'Ingénierie, Contrôle & Protection' : '3. Engineering Philosophy, Control & Protection'}
              </h4>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed whitespace-pre-line bg-[#080B10] p-5 rounded-xl border border-[#252E38] font-mono">
                {locale === 'fr' ? activeContent.engineering_fr : activeContent.engineering_en}
              </p>
            </div>
          )}

          {/* 4. FORMULES & CALCULATEURS RAPIDES */}
          {activeGroupTab === 'formulas' && (
            <div className="space-y-6 max-w-4xl">
              {/* Domain Specific Interactive Solver Card */}
              {(() => {
                const formulaConfig = getDomainFormulaConfig(domainCode);
                return (
                  <EngineeringFormulaSolverCard
                    key={`${domainCode}-${formulaConfig.id}`}
                    id={formulaConfig.id}
                    titleFr={formulaConfig.titleFr}
                    titleEn={formulaConfig.titleEn}
                    expression={formulaConfig.expression}
                    standardRef={formulaConfig.standardRef}
                    assumptionsFr={formulaConfig.assumptionsFr}
                    assumptionsEn={formulaConfig.assumptionsEn}
                    variables={formulaConfig.variables}
                    defaultValues={formulaConfig.defaultValues}
                    calculateResult={formulaConfig.calculateResult}
                    locale={locale}
                    onOpenFullCalculator={() => onNavigateView?.('calculators')}
                  />
                );
              })()}

              <h4 className="text-lg font-bold uppercase tracking-tight text-white font-mono pt-4 border-t border-slate-800">
                {locale === 'fr' ? 'Formules Théoriques du Domaine' : 'Domain Theoretical Formulations'}
              </h4>
              <div className="space-y-4">
                {displayFormulas.map((formula) => (
                  <FormulaBlock key={formula.id} formula={formula} locale={locale} />
                ))}
              </div>
            </div>
          )}

          {/* 5. NORMES */}
          {activeGroupTab === 'standards' && (
            <div className="space-y-4 max-w-4xl">
              <h4 className="text-lg font-bold uppercase tracking-tight text-white font-mono">
                {locale === 'fr' ? '5. Normes CEI & Standards Internationaux' : '5. IEC & International Standards'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayStandards.map((std) => (
                  <div
                    key={std.id}
                    onClick={() => onSelectStandard(std.reference)}
                    className="p-4 rounded-xl border border-[#252E38] bg-[#080B10] hover:border-cyan-400 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-cyan-400">{std.reference}</span>
                      <span className="text-xs font-mono font-bold text-neutral-500">({std.issuer})</span>
                    </div>
                    <h5 className="font-bold uppercase tracking-tight text-sm text-white mt-1.5 font-mono">
                      {locale === 'fr' ? std.title_fr : std.title_en}
                    </h5>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 font-medium">
                      {locale === 'fr' ? std.scope_fr : std.scope_en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. RÔLES */}
          {activeGroupTab === 'roles' && (
            <div className="space-y-4 max-w-4xl">
              <h4 className="text-lg font-bold uppercase tracking-tight text-white font-mono">
                {locale === 'fr' ? '6. Rôles d\'Ingénierie & Métiers Associés' : '6. Engineering Roles & Career Tracks'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayRoles.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => onSelectRole(r.slug)}
                    className="p-4 rounded-xl border border-[#252E38] bg-[#080B10] hover:border-cyan-400 cursor-pointer transition-colors"
                  >
                    <span className="text-xl">👷</span>
                    <h5 className="font-bold uppercase tracking-tight text-sm text-white mt-2 font-mono">
                      {locale === 'fr' ? r.name_fr : r.name_en}
                    </h5>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 font-medium">
                      {locale === 'fr' ? r.description_fr : r.description_en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. EXEMPLES & CAS CAMEROUNAIS */}
          {activeGroupTab === 'examples' && (
            <DomainCameroonReferenceCard
              cameroonCase={activeContent.cameroon_case}
              internationalCase={activeContent.international_case}
              locale={locale}
            />
          )}

          {/* 8. PHASE 2 MASTER SPECIFICATION (43 CANONICAL POINTS) */}
          {activeGroupTab === 'phase2_spec' && (
            <Phase2SpecViewer
              subdomainCode={activeSubdomainCode}
              locale={locale}
            />
          )}

          {/* 9. MATRICE D'INTERCONNEXION DES 21 DOMAINES */}
          {activeGroupTab === 'relationships' && (
            <DomainRelationshipMatrix
              locale={locale}
              activeDomainCode={domainCode}
              onSelectDomain={(code) => onNavigateView?.('domain', code)}
            />
          )}

          {/* 10. FICHIERS, SPÉCIFICATIONS & DOCUMENTATION TECHNIQUE (SECTIONS 3 & 4) */}
          {activeGroupTab === 'documentation' && (
            <DomainDocumentationSection
              domainCode={domainCode}
              locale={locale}
              onNavigateEquipment={onSelectEquipment}
              onNavigateStandard={onSelectStandard}
            />
          )}

          {/* 11. INFOGRAPHIES & SCHÉMATHÈQUE TECHNIQUE */}
          {activeGroupTab === 'visuals' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Layers className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">
                      {locale === 'fr' ? 'SCHÉMATHÈQUE & INFOGRAPHIES TECHNIQUES' : 'TECHNICAL SCHEMATICS & INFOGRAPHICS'}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      {locale === 'fr' 
                        ? 'Schémas unifilaires, architectures fonctionnelles et coupes interactives annotées avec références normatives CEI/IEEE.'
                        : 'Single-line diagrams, functional architectures, and interactive cutaways annotated with IEC/IEEE standards references.'}
                    </p>
                  </div>
                </div>
              </div>
              <EngineeringInfographicsGallerySection
                locale={locale}
                filterCategory={DOMAIN_INFOGRAPHIC_CATEGORY_MAP[domainCode] || 'ALL'}
              />
            </div>
          )}

        </div>
      </section>
        </>
      )}
      </Suspense>

      {/* ========================================================================= */}
      {/* ENGINEERING CONTEXT INTELLIGENCE LAYER (CROSS-DOMAIN DECISION & TRACE)    */}
      {/* ========================================================================= */}
      <section className="space-y-6 pt-4 border-t border-slate-800/80">
        <RoleExplorationToolbar locale={locale} />

        <EngineeringRelationshipTraceCard
          equipmentId={domainEquipments[0]?.id || 'eq-trafo-hta-01'}
          domainCode={domainCode}
          locale={locale}
          onNavigateToEquipment={onSelectEquipment}
          onNavigateToStandard={onSelectStandard}
          onNavigateToRole={onSelectRole}
          onNavigateToDomain={(dCode) => onNavigateView?.('domain', dCode)}
        />

        {/* SYSTEM BOUNDARY & OPERATIONAL JURISDICTION CARD */}
        <SystemBoundaryCard locale={locale} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WhyThisMattersCard
            equipmentId={domainEquipments[0]?.id || 'eq-trafo-hta-01'}
            domainCode={domainCode}
            locale={locale}
          />
          <KeyEngineeringDecisionsCard
            equipmentId={domainEquipments[0]?.id || 'eq-trafo-hta-01'}
            domainCode={domainCode}
            locale={locale}
          />
        </div>

        <AssumptionsLimitationsCard
          domainCode={domainCode}
          locale={locale}
          titleFr={`Cadre de Validité & Hypothèses Électrotechniques · Domaine ${domainCode}`}
          titleEn={`Validity Framework & Electrotechnical Assumptions · Domain ${domainCode}`}
        />
      </section>

    </div>
  );
};
