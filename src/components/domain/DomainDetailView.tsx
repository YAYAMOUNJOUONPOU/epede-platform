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
import { DOMAIN_EDITORIAL_ASSETS } from '../../data/assets/editorialAssetManifest';
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
import { PedagogicalPageOrientationHeader } from '../common/PedagogicalPageOrientationHeader';
import { getDomainPedagogicalGuide } from './domainPedagogicalRegistry';
import { DOMAIN_PEDAGOGICAL_FRAMEWORK_REGISTRY } from './domainPedagogicalContentRegistry';
import { useUsageLevel } from '../../services/UsageLevelContext';
import type { CalculatorTabType, InjectedCalculatorContext } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';

// Code-Split Dynamic Workbenches for Core Web Vitals Optimization
const UniversalPedagogicalDomainView = lazy(() => import('./UniversalPedagogicalDomainView').then(m => ({ default: m.UniversalPedagogicalDomainView })));
const EnergyProductionMainView = lazy(() => import('../production/EnergyProductionMainView').then(m => ({ default: m.EnergyProductionMainView })));
const GridArchitectureVisualJourney = lazy(() => import('../grid-architecture/GridArchitectureVisualJourney').then(m => ({ default: m.GridArchitectureVisualJourney })));
const TransmissionWorkbench = lazy(() => import('../transmission/TransmissionWorkbench').then(m => ({ default: m.TransmissionWorkbench })));
const SubstationsWorkbench = lazy(() => import('../substations/SubstationsWorkbench').then(m => ({ default: m.SubstationsWorkbench })));
const D04PedagogicalPilotView = lazy(() => import('../substations/D04PedagogicalPilotView').then(m => ({ default: m.D04PedagogicalPilotView })));
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
  onNavigateCalculator?: (tab?: CalculatorTabType, context?: InjectedCalculatorContext) => void;
  onNavigateSimulation?: (tab?: SimulationTabType) => void;
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
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateView,
}) => {
  const { usageLevel } = useUsageLevel();
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

  // Specific state for D01 to D16: default to standardized 6-part pedagogical architecture when available
  const [d01Mode, setD01Mode] = useState<'pedagogical_pilot' | 'visual_journey' | 'spec_catalog'>('pedagogical_pilot');
  const [d02Mode, setD02Mode] = useState<'pedagogical_pilot' | 'visual_journey' | 'spec_catalog'>('pedagogical_pilot');
  const [d03Mode, setD03Mode] = useState<'pedagogical_pilot' | 'visual_journey' | 'spec_catalog'>('pedagogical_pilot');
  const [d04Mode, setD04Mode] = useState<'pedagogical_pilot' | 'visual_journey' | 'spec_catalog'>('pedagogical_pilot');
  const [d05Mode, setD05Mode] = useState<'pedagogical_pilot' | 'visual_journey' | 'spec_catalog'>('pedagogical_pilot');
  const [d06Mode, setD06Mode] = useState<'pedagogical_pilot' | 'visual_journey' | 'spec_catalog'>('pedagogical_pilot');
  const [showD06Metrics, setShowD06Metrics] = useState<boolean>(false);
  const [d07Mode, setD07Mode] = useState<'pedagogical_pilot' | 'visual_journey' | 'spec_catalog'>('pedagogical_pilot');
  const [d08Mode, setD08Mode] = useState<'pedagogical_pilot' | 'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d09Mode, setD09Mode] = useState<'pedagogical_pilot' | 'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d10Mode, setD10Mode] = useState<'pedagogical_pilot' | 'visual_journey' | 'spec_catalog'>('pedagogical_pilot');
  const [d11Mode, setD11Mode] = useState<'pedagogical_pilot' | 'visual_journey' | 'spec_catalog'>('pedagogical_pilot');
  const [d12Mode, setD12Mode] = useState<'pedagogical_pilot' | 'visual_journey' | 'spec_catalog'>('pedagogical_pilot');
  const [d13Mode, setD13Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d14Mode, setD14Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d15Mode, setD15Mode] = useState<'pedagogical_pilot' | 'visual_journey' | 'asset_management' | 'spec_catalog'>('pedagogical_pilot');
  const [d16Mode, setD16Mode] = useState<'visual_journey' | 'spec_catalog'>('visual_journey');
  const [d06InitialPillar, setD06InitialPillar] = useState<InstallationPillar>('INTERACTIVE_SLD');

  const hasPedagogicalData = isD04 || Boolean(DOMAIN_PEDAGOGICAL_FRAMEWORK_REGISTRY[domainCode]);

  const currentDomainMode: 'pedagogical_pilot' | 'visual_journey' | 'spec_catalog' | 'asset_management' = 
    isD01 ? d01Mode :
    isD02 ? d02Mode :
    isD03 ? d03Mode :
    isD04 ? d04Mode :
    isD05 ? d05Mode :
    isD06 ? d06Mode :
    isD07 ? d07Mode :
    isD08 ? d08Mode :
    isD09 ? d09Mode :
    isD10 ? d10Mode :
    isD11 ? d11Mode :
    isD12 ? d12Mode :
    isD13 ? d13Mode :
    isD14 ? d14Mode :
    isD15 ? d15Mode :
    isD16 ? d16Mode :
    'visual_journey';

  const setModeForCurrentDomain = (mode: 'pedagogical_pilot' | 'visual_journey' | 'spec_catalog' | 'asset_management') => {
    if (mode === 'asset_management') {
      if (isD15) setD15Mode('asset_management');
      return;
    }
    if (isD01) setD01Mode(mode);
    else if (isD02) setD02Mode(mode);
    else if (isD03) setD03Mode(mode);
    else if (isD04) setD04Mode(mode);
    else if (isD05) setD05Mode(mode);
    else if (isD06) setD06Mode(mode);
    else if (isD07) setD07Mode(mode);
    else if (isD08) setD08Mode(mode);
    else if (isD09) setD09Mode(mode);
    else if (isD10) setD10Mode(mode);
    else if (isD11) setD11Mode(mode);
    else if (isD12) setD12Mode(mode);
    else if (isD13 && mode !== 'pedagogical_pilot') setD13Mode(mode);
    else if (isD14 && mode !== 'pedagogical_pilot') setD14Mode(mode);
    else if (isD15) setD15Mode(mode);
    else if (isD16 && mode !== 'pedagogical_pilot') setD16Mode(mode);
  };

  // Sync global UsageLevel (DISCOVERY | TECHNICAL | ENGINEERING) with domain view mode & diagnostics tray
  useEffect(() => {
    if (usageLevel === 'DISCOVERY') {
      setShowD06Metrics(false);
      if (hasPedagogicalData) {
        setModeForCurrentDomain('pedagogical_pilot');
      } else {
        setModeForCurrentDomain('visual_journey');
      }
    } else if (usageLevel === 'TECHNICAL') {
      setShowD06Metrics(false);
      setModeForCurrentDomain('visual_journey');
    } else if (usageLevel === 'ENGINEERING') {
      setShowD06Metrics(true);
    }
  }, [usageLevel, domainCode]);

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
  const pedagogicalGuide = getDomainPedagogicalGuide(domainCode);

  // Collect domain-level formulas, standards, and roles
  const domainFormulas = FORMULAS.filter(
    (f) => f.applicable_domains.includes(domainCode) || f.domain_code === domainCode
  );
  const displayFormulas = domainFormulas.length > 0 ? domainFormulas : activeContent.formulas;

  const domainStandards = STANDARDS.filter((s) => s.domain_codes?.includes(domainCode));
  const displayStandards = domainStandards.length > 0 ? domainStandards : activeContent.standards;

  const domainRoles = ENGINEERING_ROLES.filter((r) => r.domain_codes?.includes(domainCode));
  const displayRoles = domainRoles.length > 0 ? domainRoles : activeContent.roles;

  const domainEditorialAsset = DOMAIN_EDITORIAL_ASSETS[domainCode] || DOMAIN_EDITORIAL_ASSETS.D04;

  return (
    <div className="space-y-10 pb-20 text-[#17282C] font-sans">
      {/* 1. Back-to-Directory & Domain Context Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#17282C] pt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#17282C] hover:text-[#147C78] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-[#147C78]" />
          <span>{locale === 'fr' ? 'Retour au Répertoire des Domaines' : 'Back to Domains Directory'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {onNavigateContextStack && (
            <button
              type="button"
              onClick={() => onNavigateContextStack(DOMAIN_SPINE_MAPPING[domainCode] || 'node-trafo-main-30')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#17282C] hover:bg-[#147C78] text-[#FFFDF9] font-semibold transition-colors"
            >
              <Zap className="h-3.5 w-3.5 text-[#B8872D]" />
              <span>{locale === 'fr' ? 'Épine Dorsale & TCC' : 'Spine & TCC Stack'}</span>
            </button>
          )}
          <span className="text-[#5C6C70] font-semibold uppercase">
            {domain.domain_group === 'chain'
              ? locale === 'fr'
                ? 'Chaîne Physique'
                : 'Physical Chain'
              : locale === 'fr'
              ? 'Discipline Transversale'
              : 'Transversal Discipline'}
          </span>
          <span className="font-bold text-[#147C78] bg-[#E3EFEC] px-2.5 py-1 rounded-full border border-[#147C78]/30">
            {domain.code}
          </span>
        </div>
      </div>

      {/* Physical Chain Stepper Navigator (D01–D06) */}
      {isChainDomain && (
        <PowerSystemChainNavigator
          currentStageId={currentChainStageId}
          locale={locale}
          onNavigateStage={handleNavigateChainStage}
        />
      )}

      {/* 2. Bright Editorial Domain Header + Domain-Specific Visual */}
      <header className="rounded-[12px] border border-[#DEDACF] bg-[#FFFDF9] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="epede-eyebrow">
                  {locale === 'fr' ? `Domaine ${domain.code}` : `Domain ${domain.code}`}
                </span>
                <EvidenceTrustBadge
                  type="VERIFIED_STANDARD"
                  locale={locale}
                  size="sm"
                  governingStandard={pedagogicalGuide.primaryStandard || `IEC / IEEE · ${domain.code}`}
                />
                {(isD11 || isD16) && (
                  <span className="font-mono text-[11px] text-[#B91C1C] bg-[#FEE2E2] px-2.5 py-0.5 rounded-full font-semibold">
                    {locale === 'fr' ? 'Protection & Sécurité Critique' : 'Safety & Protection Critical'}
                  </span>
                )}
              </div>

              <h1 className="epede-h1">
                {locale === 'fr' ? domain.name_fr : domain.name_en}
              </h1>

              <p className="epede-lead">
                {locale === 'fr' ? domain.description_fr : domain.description_en}
              </p>
            </div>

            {/* Domain Metadata Strip */}
            <div className="pt-6 border-t border-[#DEDACF] grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[#5C6C70] uppercase block">
                  {locale === 'fr' ? 'Plage de Tension' : 'Voltage Envelope'}
                </span>
                <span className="text-[#17282C] font-semibold mt-0.5 block">
                  {pedagogicalGuide.voltageLevel}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#5C6C70] uppercase block">
                  {locale === 'fr' ? 'Norme Directrice' : 'Primary Standard'}
                </span>
                <span className="text-[#147C78] font-semibold mt-0.5 block">
                  {pedagogicalGuide.primaryStandard}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#5C6C70] uppercase block">
                  {locale === 'fr' ? 'Appareils Documentés' : 'Documented Assets'}
                </span>
                <span className="text-[#B8872D] font-semibold mt-0.5 block">
                  {domainEquipments.length} {locale === 'fr' ? 'fiches CEI' : 'IEC sheets'}
                </span>
              </div>
            </div>
          </div>

          {/* Domain-Specific Photograph / Schematic Frame */}
          <figure className="lg:col-span-5 relative min-h-[240px] lg:min-h-full bg-[#10191D] overflow-hidden border-t lg:border-t-0 lg:border-l border-[#DEDACF]">
            <img
              src={domainEditorialAsset.src}
              alt={locale === 'fr' ? domainEditorialAsset.alt.fr : domainEditorialAsset.alt.en}
              className="w-full h-full object-cover epede-photo-grade"
              loading="lazy"
            />
            <figcaption className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded bg-[#10191D]/90 text-[#F4F1E8] font-mono text-[11px] flex items-center justify-between gap-2">
              <span className="truncate">
                {domain.code} · {locale === 'fr' ? domain.short_fr : domain.short_en}
              </span>
              <span className="text-[#6CC3BD] shrink-0">{pedagogicalGuide.voltageLevel}</span>
            </figcaption>
          </figure>
        </div>

        {/* Three Key Questions Index Row */}
        <div className="border-t border-[#DEDACF] bg-[#F6F4EE] p-6 sm:px-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="font-mono text-[11px] font-semibold text-[#147C78] uppercase block">
              {locale === 'fr' ? '01 · Rôle dans le Réseau' : '01 · Role in the Grid'}
            </span>
            <p className="text-xs text-[#33474B] mt-1 leading-relaxed">
              {locale === 'fr' ? pedagogicalGuide.roleInGrid.fr : pedagogicalGuide.roleInGrid.en}
            </p>
          </div>
          <div>
            <span className="font-mono text-[11px] font-semibold text-[#147C78] uppercase block">
              {locale === 'fr' ? '02 · Objectif d’Ingénierie' : '02 · Key Learning Objective'}
            </span>
            <p className="text-xs text-[#33474B] mt-1 leading-relaxed">
              {(locale === 'fr'
                ? pedagogicalGuide.learningObjectives.fr[0]
                : pedagogicalGuide.learningObjectives.en[0]) ||
                (locale === 'fr' ? domain.description_fr : domain.description_en)}
            </p>
          </div>
          <div>
            <span className="font-mono text-[11px] font-semibold text-[#B8872D] uppercase block">
              {locale === 'fr' ? '03 · Passerelle de Calcul & Norme' : '03 · Linked Solver & Code'}
            </span>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => onNavigateView?.('calculators')}
                className="text-[#17282C] font-semibold underline hover:text-[#147C78]"
              >
                {pedagogicalGuide.keyCalculators[0]
                  ? locale === 'fr'
                    ? pedagogicalGuide.keyCalculators[0].labelFr
                    : pedagogicalGuide.keyCalculators[0].labelEn
                  : locale === 'fr'
                  ? 'Solveurs CEI'
                  : 'IEC Solvers'}
              </button>
              <span className="text-[#5C6C70]">·</span>
              <button
                type="button"
                onClick={() => onNavigateView?.('standards')}
                className="text-[#147C78] font-semibold hover:underline"
              >
                {pedagogicalGuide.primaryStandard}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Unified Exploration Mode Switcher (D01–D16) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-[10px] bg-[#FFFDF9] border border-[#DEDACF]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#147C78]" />
          <span className="text-xs font-mono font-semibold text-[#17282C] uppercase tracking-wider">
            {locale === 'fr'
              ? `Mode d'étude ${domain.code} :`
              : `Study Mode ${domain.code}:`}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasPedagogicalData && (
            <button
              type="button"
              onClick={() => setModeForCurrentDomain('pedagogical_pilot')}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-mono transition-colors cursor-pointer ${
                currentDomainMode === 'pedagogical_pilot'
                  ? 'bg-[#17282C] text-[#FFFDF9]'
                  : 'bg-[#F6F4EE] text-[#5C6C70] hover:text-[#17282C] border border-[#DEDACF]'
              }`}
            >
              {locale === 'fr' ? '01 · Parcours Pédagogique (A–F)' : '01 · Pedagogical Guide (A–F)'}
            </button>
          )}
          <button
            type="button"
            onClick={() => setModeForCurrentDomain('visual_journey')}
            className={`px-4 py-2 rounded-full text-xs font-semibold font-mono transition-colors cursor-pointer ${
              currentDomainMode === 'visual_journey'
                ? 'bg-[#17282C] text-[#FFFDF9]'
                : 'bg-[#F6F4EE] text-[#5C6C70] hover:text-[#17282C] border border-[#DEDACF]'
            }`}
          >
            {locale === 'fr' ? '02 · Banc d’Ingénierie Interactif' : '02 · Interactive Workbench'}
          </button>
          {isD15 && (
            <button
              type="button"
              onClick={() => setModeForCurrentDomain('asset_management')}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-mono transition-colors cursor-pointer ${
                currentDomainMode === 'asset_management'
                  ? 'bg-[#17282C] text-[#FFFDF9]'
                  : 'bg-[#F6F4EE] text-[#5C6C70] hover:text-[#17282C] border border-[#DEDACF]'
              }`}
            >
              {locale === 'fr' ? '03 · Diagnostic DGA & Santé' : '03 · DGA & Health Index'}
            </button>
          )}
          <button
            type="button"
            onClick={() => setModeForCurrentDomain('spec_catalog')}
            className={`px-4 py-2 rounded-full text-xs font-semibold font-mono transition-colors cursor-pointer ${
              currentDomainMode === 'spec_catalog'
                ? 'bg-[#17282C] text-[#FFFDF9]'
                : 'bg-[#F6F4EE] text-[#5C6C70] hover:text-[#17282C] border border-[#DEDACF]'
            }`}
          >
            {locale === 'fr' ? '04 · Sous-Domaines & Spécifications' : '04 · Subdomains & Specs'}
          </button>
        </div>
      </div>

      {/* Collapsible Diagnostics, Traceability & NCR Tray */}
      <div className="rounded-[10px] border border-[#DEDACF] bg-[#FFFDF9] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowD06Metrics(!showD06Metrics)}
          className="w-full flex items-center justify-between p-3.5 px-5 text-xs font-mono font-semibold text-[#17282C] hover:bg-[#F6F4EE] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#147C78]" />
            <span>
              {locale === 'fr'
                ? 'Traçabilité Système, Métriques KPI & Registre NCR'
                : 'System Traceability, KPI Metrics & NCR Registry'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F6F4EE] text-[#5C6C70] border border-[#DEDACF]">
              {domainEquipments.length} {locale === 'fr' ? 'appareils' : 'assets'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#5C6C70] text-[11px]">
            <span>
              {showD06Metrics
                ? locale === 'fr'
                  ? 'Masquer'
                  : 'Hide'
                : locale === 'fr'
                ? 'Afficher'
                : 'Expand'}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                showD06Metrics ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>
        {showD06Metrics && (
          <div className="p-5 space-y-4 border-t border-[#DEDACF] bg-[#10191D] text-[#F4F1E8]">
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
            <DomainPendingIssuesPanel locale={locale} domainCode={domainCode} />
          </div>
        )}
      </div>

      {/* D01 TO D16 PEDAGOGICAL PILOT OR ADVANCED WORKBENCHES */}
      <Suspense fallback={<EngineeringLoadingSkeleton locale={locale} />}>
      {isD01 && d01Mode === 'pedagogical_pilot' ? (
        <UniversalPedagogicalDomainView
          domainCode="D01"
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateView={onNavigateView}
          onNavigateCalculator={(tab, ctx) => {
            if (onNavigateCalculator) onNavigateCalculator(tab as CalculatorTabType, ctx);
            else if (onNavigateView) onNavigateView('calculators', tab);
          }}
          onNavigateSimulation={(tab) => {
            if (onNavigateSimulation) onNavigateSimulation(tab as SimulationTabType);
            else if (onNavigateView) onNavigateView('simulation', tab);
          }}
          onSwitchToAdvancedWorkbench={() => setD01Mode('visual_journey')}
        />
      ) : isD01 && d01Mode === 'visual_journey' ? (
        <EnergyProductionMainView
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateToDomain={(dCode) => onNavigateView?.('domain', dCode)}
        />
      ) : isD02 && d02Mode === 'pedagogical_pilot' ? (
        <UniversalPedagogicalDomainView
          domainCode="D02"
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateView={onNavigateView}
          onNavigateCalculator={(tab, ctx) => {
            if (onNavigateCalculator) onNavigateCalculator(tab as CalculatorTabType, ctx);
            else if (onNavigateView) onNavigateView('calculators', tab);
          }}
          onNavigateSimulation={(tab) => {
            if (onNavigateSimulation) onNavigateSimulation(tab as SimulationTabType);
            else if (onNavigateView) onNavigateView('simulation', tab);
          }}
          onSwitchToAdvancedWorkbench={() => setD02Mode('visual_journey')}
        />
      ) : isD02 && d02Mode === 'visual_journey' ? (
        <GridArchitectureVisualJourney
          locale={locale}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD03 && d03Mode === 'pedagogical_pilot' ? (
        <UniversalPedagogicalDomainView
          domainCode="D03"
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateView={onNavigateView}
          onNavigateCalculator={(tab, ctx) => {
            if (onNavigateCalculator) onNavigateCalculator(tab as CalculatorTabType, ctx);
            else if (onNavigateView) onNavigateView('calculators', tab);
          }}
          onNavigateSimulation={(tab) => {
            if (onNavigateSimulation) onNavigateSimulation(tab as SimulationTabType);
            else if (onNavigateView) onNavigateView('simulation', tab);
          }}
          onSwitchToAdvancedWorkbench={() => setD03Mode('visual_journey')}
        />
      ) : isD03 && d03Mode === 'visual_journey' ? (
        <TransmissionWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD04 && d04Mode === 'pedagogical_pilot' ? (
        <D04PedagogicalPilotView
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateView={onNavigateView}
          onNavigateCalculator={(tab, ctx) => {
            if (onNavigateCalculator) onNavigateCalculator(tab as CalculatorTabType, ctx);
            else if (onNavigateView) onNavigateView('calculators', tab);
          }}
          onNavigateSimulation={(tab) => {
            if (onNavigateSimulation) onNavigateSimulation(tab as SimulationTabType);
            else if (onNavigateView) onNavigateView('simulation', tab);
          }}
          onSwitchToAdvancedWorkbench={() => setD04Mode('visual_journey')}
        />
      ) : isD04 && d04Mode === 'visual_journey' ? (
        <SubstationsWorkbench
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigate={onNavigateView}
        />
      ) : isD05 && d05Mode === 'pedagogical_pilot' ? (
        <UniversalPedagogicalDomainView
          domainCode="D05"
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateView={onNavigateView}
          onNavigateCalculator={(tab, ctx) => {
            if (onNavigateCalculator) onNavigateCalculator(tab as CalculatorTabType, ctx);
            else if (onNavigateView) onNavigateView('calculators', tab);
          }}
          onNavigateSimulation={(tab) => {
            if (onNavigateSimulation) onNavigateSimulation(tab as SimulationTabType);
            else if (onNavigateView) onNavigateView('simulation', tab);
          }}
          onSwitchToAdvancedWorkbench={() => setD05Mode('visual_journey')}
        />
      ) : isD05 && d05Mode === 'visual_journey' ? (
        <DistributionWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          activeSubdomainId={activeSubdomainCode}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD06 && d06Mode === 'pedagogical_pilot' ? (
        <UniversalPedagogicalDomainView
          domainCode="D06"
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateView={onNavigateView}
          onNavigateCalculator={(tab, ctx) => {
            if (onNavigateCalculator) onNavigateCalculator(tab as CalculatorTabType, ctx);
            else if (onNavigateView) onNavigateView('calculators', tab);
          }}
          onNavigateSimulation={(tab) => {
            if (onNavigateSimulation) onNavigateSimulation(tab as SimulationTabType);
            else if (onNavigateView) onNavigateView('simulation', tab);
          }}
          onSwitchToAdvancedWorkbench={() => setD06Mode('visual_journey')}
        />
      ) : isD06 && d06Mode === 'visual_journey' ? (
        <InstallationsWorkbench
          locale={locale}
          initialPillar={d06InitialPillar}
          onNavigate={(tab, domainId) => {
            if (onNavigateView) {
              onNavigateView(tab, domainId);
            }
          }}
        />
      ) : isD07 && d07Mode === 'pedagogical_pilot' ? (
        <UniversalPedagogicalDomainView
          domainCode="D07"
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateView={onNavigateView}
          onNavigateCalculator={(tab, ctx) => {
            if (onNavigateCalculator) onNavigateCalculator(tab as CalculatorTabType, ctx);
            else if (onNavigateView) onNavigateView('calculators', tab);
          }}
          onNavigateSimulation={(tab) => {
            if (onNavigateSimulation) onNavigateSimulation(tab as SimulationTabType);
            else if (onNavigateView) onNavigateView('simulation', tab);
          }}
          onSwitchToAdvancedWorkbench={() => setD07Mode('visual_journey')}
        />
      ) : isD07 && d07Mode === 'visual_journey' ? (
        <AutomationControlWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD08 && d08Mode === 'pedagogical_pilot' ? (
        <UniversalPedagogicalDomainView
          domainCode="D08"
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateView={onNavigateView}
          onNavigateCalculator={(tab, ctx) => {
            if (onNavigateCalculator) onNavigateCalculator(tab as CalculatorTabType, ctx);
            else if (onNavigateView) onNavigateView('calculators', tab);
          }}
          onNavigateSimulation={(tab) => {
            if (onNavigateSimulation) onNavigateSimulation(tab as SimulationTabType);
            else if (onNavigateView) onNavigateView('simulation', tab);
          }}
          onSwitchToAdvancedWorkbench={() => setD08Mode('visual_journey')}
        />
      ) : isD08 && d08Mode === 'visual_journey' ? (
        <ExtraLowVoltageWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD09 && d09Mode === 'pedagogical_pilot' ? (
        <UniversalPedagogicalDomainView
          domainCode="D09"
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateView={onNavigateView}
          onNavigateCalculator={(tab, ctx) => {
            if (onNavigateCalculator) onNavigateCalculator(tab as CalculatorTabType, ctx);
            else if (onNavigateView) onNavigateView('calculators', tab);
          }}
          onNavigateSimulation={(tab) => {
            if (onNavigateSimulation) onNavigateSimulation(tab as SimulationTabType);
            else if (onNavigateView) onNavigateView('simulation', tab);
          }}
          onSwitchToAdvancedWorkbench={() => setD09Mode('visual_journey')}
        />
      ) : isD09 && d09Mode === 'visual_journey' ? (
        <AdvancedAiWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD10 && d10Mode === 'pedagogical_pilot' ? (
        <UniversalPedagogicalDomainView
          domainCode="D10"
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateView={onNavigateView}
          onNavigateCalculator={(tab, ctx) => {
            if (onNavigateCalculator) onNavigateCalculator(tab as CalculatorTabType, ctx);
            else if (onNavigateView) onNavigateView('calculators', tab);
          }}
          onNavigateSimulation={(tab) => {
            if (onNavigateSimulation) onNavigateSimulation(tab as SimulationTabType);
            else if (onNavigateView) onNavigateView('simulation', tab);
          }}
          onSwitchToAdvancedWorkbench={() => setD10Mode('visual_journey')}
        />
      ) : isD10 && d10Mode === 'visual_journey' ? (
        <EnergyStorageWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD11 && d11Mode === 'pedagogical_pilot' ? (
        <UniversalPedagogicalDomainView
          domainCode="D11"
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateView={onNavigateView}
          onNavigateCalculator={(tab, ctx) => {
            if (onNavigateCalculator) onNavigateCalculator(tab as CalculatorTabType, ctx);
            else if (onNavigateView) onNavigateView('calculators', tab);
          }}
          onNavigateSimulation={(tab) => {
            if (onNavigateSimulation) onNavigateSimulation(tab as SimulationTabType);
            else if (onNavigateView) onNavigateView('simulation', tab);
          }}
          onSwitchToAdvancedWorkbench={() => setD11Mode('visual_journey')}
        />
      ) : isD11 && d11Mode === 'visual_journey' ? (
        <ProtectionEngineeringWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD12 && d12Mode === 'pedagogical_pilot' ? (
        <UniversalPedagogicalDomainView
          domainCode="D12"
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateView={onNavigateView}
          onNavigateCalculator={(tab, ctx) => {
            if (onNavigateCalculator) onNavigateCalculator(tab as CalculatorTabType, ctx);
            else if (onNavigateView) onNavigateView('calculators', tab);
          }}
          onNavigateSimulation={(tab) => {
            if (onNavigateSimulation) onNavigateSimulation(tab as SimulationTabType);
            else if (onNavigateView) onNavigateView('simulation', tab);
          }}
          onSwitchToAdvancedWorkbench={() => setD12Mode('visual_journey')}
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
      ) : isD15 && d15Mode === 'pedagogical_pilot' ? (
        <UniversalPedagogicalDomainView
          domainCode="D15"
          locale={locale}
          onSelectEquipment={onSelectEquipment}
          onNavigateView={onNavigateView}
          onNavigateCalculator={(tab, ctx) => {
            if (onNavigateCalculator) onNavigateCalculator(tab as CalculatorTabType, ctx);
            else if (onNavigateView) onNavigateView('calculators', tab);
          }}
          onNavigateSimulation={(tab) => {
            if (onNavigateSimulation) onNavigateSimulation(tab as SimulationTabType);
            else if (onNavigateView) onNavigateView('simulation', tab);
          }}
          onSwitchToAdvancedWorkbench={() => setD15Mode('visual_journey')}
        />
      ) : isD15 && d15Mode === 'visual_journey' ? (
        <SmartMeteringGridDigitalizationWorkbench
          locale={locale}
          onNavigate={onNavigateView}
          onSelectEquipment={onSelectEquipment}
        />
      ) : isD15 && d15Mode === 'asset_management' ? (
        <AssetManagementDiagnosticsWorkbench
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
            <h3 className="font-mono font-bold text-xs sm:text-sm text-[#17282C] uppercase tracking-widest flex items-center gap-2">
              <span className="text-[#147C78]">◈</span>
              <span>{locale === 'fr' ? 'SOUS-DOMAINES & TECHNOLOGIES' : 'SUBDOMAINS & TECHNOLOGIES'}</span>
            </h3>
            <span className="font-mono text-xs font-bold text-[#5C6C70]">
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
                      ? 'border-[#147C78] bg-[#E3EFEC] text-[#17282C] shadow-sm ring-1 ring-[#147C78]/30'
                      : 'border-[#DEDACF] bg-[#FFFDF9] text-[#5C6C70] hover:text-[#17282C] hover:border-[#147C78]/50'
                  }`}
                >
                  <div className="font-mono text-xs font-bold text-[#147C78]">{sub.code}</div>
                  <div className="text-xs font-bold truncate max-w-[200px] mt-0.5 text-[#17282C]">
                    {locale === 'fr' ? sub.name_fr : sub.name_en}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 10 GROUPED CONTENT TABS */}
      <section className="rounded-2xl border border-[#DEDACF] bg-[#FFFDF9] overflow-hidden shadow-sm">
        {/* Navigation bar for the tabs */}
        <div className="border-b border-[#DEDACF] bg-[#F6F4EE] px-4 flex items-center gap-1 overflow-x-auto">
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
                    ? 'border-[#147C78] text-[#17282C] bg-[#FFFDF9]'
                    : 'border-transparent text-[#5C6C70] hover:text-[#17282C]'
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
              <h4 className="text-lg font-bold uppercase tracking-tight text-[#17282C] font-mono">
                {locale === 'fr' ? '1. Principes Physiques & Variantes' : '1. Physical Principles & Variants'}
              </h4>
              <p className="text-sm sm:text-base text-[#33474B] leading-relaxed whitespace-pre-line font-medium">
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
              <h4 className="text-lg font-bold uppercase tracking-tight text-[#17282C] font-mono">
                {locale === 'fr' ? '3. Philosophie d\'Ingénierie, Contrôle & Protection' : '3. Engineering Philosophy, Control & Protection'}
              </h4>
              <p className="text-sm sm:text-base text-[#33474B] leading-relaxed whitespace-pre-line bg-[#F6F4EE] p-5 rounded-xl border border-[#DEDACF]">
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

              <h4 className="text-lg font-bold uppercase tracking-tight text-[#17282C] font-mono pt-4 border-t border-[#DEDACF]">
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
              <h4 className="text-lg font-bold uppercase tracking-tight text-[#17282C] font-mono">
                {locale === 'fr' ? '5. Normes CEI & Standards Internationaux' : '5. IEC & International Standards'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayStandards.map((std) => (
                  <div
                    key={std.id}
                    onClick={() => onSelectStandard(std.reference)}
                    className="p-4 rounded-xl border border-[#DEDACF] bg-[#F6F4EE] hover:border-[#147C78] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-[#147C78]">{std.reference}</span>
                      <span className="text-xs font-mono font-bold text-[#5C6C70]">({std.issuer})</span>
                    </div>
                    <h5 className="font-bold uppercase tracking-tight text-sm text-[#17282C] mt-1.5">
                      {locale === 'fr' ? std.title_fr : std.title_en}
                    </h5>
                    <p className="text-xs text-[#5C6C70] mt-1 line-clamp-2 font-medium">
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
              <h4 className="text-lg font-bold uppercase tracking-tight text-[#17282C] font-mono">
                {locale === 'fr' ? '6. Rôles d\'Ingénierie & Métiers Associés' : '6. Engineering Roles & Career Tracks'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayRoles.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => onSelectRole(r.slug)}
                    className="p-4 rounded-xl border border-[#DEDACF] bg-[#F6F4EE] hover:border-[#147C78] cursor-pointer transition-colors"
                  >
                    <span className="text-xl">👷</span>
                    <h5 className="font-bold uppercase tracking-tight text-sm text-[#17282C] mt-2">
                      {locale === 'fr' ? r.name_fr : r.name_en}
                    </h5>
                    <p className="text-xs text-[#5C6C70] mt-1 line-clamp-2 font-medium">
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
              <div className="p-4 rounded-xl bg-[#E3EFEC] border border-[#147C78]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-[#FFFDF9] text-[#147C78] border border-[#147C78]/30">
                    <Layers className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#17282C] font-mono">
                      {locale === 'fr' ? 'SCHÉMATHÈQUE & INFOGRAPHIES TECHNIQUES' : 'TECHNICAL SCHEMATICS & INFOGRAPHICS'}
                    </h4>
                    <p className="text-xs text-[#33474B]">
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
      <section className="space-y-6 pt-4 border-t border-[#DEDACF]">
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

        {/* POUR ALLER PLUS LOIN · BRIDGES & COMPLEMENTARY DOMAINS (AUDIT REPORT §2.3) */}
        <div className="rounded-2xl border border-[#DEDACF] bg-[#FFFDF9] p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DEDACF] pb-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#147C78] bg-[#E3EFEC] px-2.5 py-1 rounded border border-[#147C78]/30">
                {locale === 'fr' ? 'POUR ALLER PLUS LOIN' : 'EXPLORE FURTHER'}
              </span>
              <h3 className="text-base font-bold text-[#17282C] mt-2">
                {locale === 'fr' ? 'Interconnexions & Domaines Complémentaires' : 'Interconnections & Complementary Domains'}
              </h3>
              <p className="text-xs text-[#5C6C70] mt-1 max-w-2xl">
                {locale === 'fr'
                  ? 'Une installation électrique ne s\'analyse pas isolément : faites le lien avec les domaines amont/aval, les calculs normalisés et le cadre réglementaire.'
                  : 'An electrical installation cannot be analyzed in isolation: link with upstream/downstream domains, standardized calculations, and regulatory frameworks.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onNavigateView) {
                  onNavigateView('reference-hub');
                } else {
                  window.location.hash = '#/centre-reference';
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-[#147C78] hover:bg-[#0E5E5B] text-white font-mono text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Centre de Référence Technique →' : 'Technical Reference Hub →'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                if (onNavigateView) {
                  onNavigateView('standards');
                } else {
                  window.location.hash = '#/standards';
                }
              }}
              className="p-3.5 rounded-xl border border-[#DEDACF] bg-[#F6F4EE] hover:border-[#B8872D] transition-all text-left group cursor-pointer"
            >
              <div className="font-mono text-[10px] font-bold text-[#B8872D] uppercase">
                {locale === 'fr' ? 'RÉFÉRENTIELS' : 'STANDARDS'}
              </div>
              <div className="text-xs font-bold text-[#17282C] mt-1 group-hover:text-[#B8872D] transition-colors">
                {locale === 'fr' ? 'Normes & Contextes Cameroun' : 'Standards & Cameroon Grid'}
              </div>
              <div className="text-[11px] text-[#5C6C70] mt-0.5">
                {locale === 'fr' ? 'IEC, NF C, ARSEL & déclassements thermiques' : 'IEC, NF C, ARSEL & thermal derating'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateView) {
                  onNavigateView('calculators');
                } else {
                  window.location.hash = '#/calculators';
                }
              }}
              className="p-3.5 rounded-xl border border-[#DEDACF] bg-[#F6F4EE] hover:border-[#147C78] transition-all text-left group cursor-pointer"
            >
              <div className="font-mono text-[10px] font-bold text-[#147C78] uppercase">
                {locale === 'fr' ? 'CALCUL' : 'CALCULATION'}
              </div>
              <div className="text-xs font-bold text-[#17282C] mt-1 group-hover:text-[#147C78] transition-colors">
                {locale === 'fr' ? 'Calculateurs & Dimensionnement' : 'Calculators & Sizing'}
              </div>
              <div className="text-[11px] text-[#5C6C70] mt-0.5">
                {locale === 'fr' ? '19 calculateurs IEC avec hypothèses et limites' : '19 IEC calculators with validity ranges'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigateView) {
                  onNavigateView('laboratory');
                } else {
                  window.location.hash = '#/laboratory';
                }
              }}
              className="p-3.5 rounded-xl border border-[#DEDACF] bg-[#F6F4EE] hover:border-[#147C78] transition-all text-left group cursor-pointer"
            >
              <div className="font-mono text-[10px] font-bold text-[#147C78] uppercase">
                {locale === 'fr' ? 'EXPÉRIMENTATION' : 'EXPERIMENTATION'}
              </div>
              <div className="text-xs font-bold text-[#17282C] mt-1 group-hover:text-[#147C78] transition-colors">
                {locale === 'fr' ? 'Laboratoire Virtuel & SLD' : 'Virtual Lab & SLD Explorer'}
              </div>
              <div className="text-[11px] text-[#5C6C70] mt-0.5">
                {locale === 'fr' ? 'Simulations de régimes et transitoires' : 'Regime and transient simulations'}
              </div>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
