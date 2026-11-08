// src/components/distribution/DistributionWorkbench.tsx
// EPEDE D05 - Master Distribution Engineering Workbench Orchestrator

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Repeat,
  Sliders,
  Building2,
  Home,
  Scale,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Activity,
  ChevronRight,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Search
} from 'lucide-react';
import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';

import {
  DistributionCommandHeader,
  type DistributionRepresentationView,
  type DistributionEnvironmentContext,
  type DistributionVoltageContext
} from './DistributionCommandHeader';

import { MasterDistributionJourney } from './MasterDistributionJourney';
import { DistributionTopologiesExplorer } from './DistributionTopologiesExplorer';
import { MvFeedersAndSwitchingExplorer } from './MvFeedersAndSwitchingExplorer';
import { DistributionSubstationAndTransformerExplorer } from './DistributionSubstationAndTransformerExplorer';
import { LowVoltageAndConsumerJourney } from './LowVoltageAndConsumerJourney';
import { UrbanVsRuralDistributionView } from './UrbanVsRuralDistributionView';
import { OverheadVsUndergroundCrossSectionView } from './OverheadVsUndergroundCrossSectionView';
import { DistributionProtectionAndSafetyOverlay } from './DistributionProtectionAndSafetyOverlay';
import { DistributionFaultScenariosSimulator } from './DistributionFaultScenariosSimulator';
import { DistributionDerAndReliabilityViewer } from './DistributionDerAndReliabilityViewer';
import { DistributionEngineeringPrinciplesDrawer } from './DistributionEngineeringPrinciplesDrawer';
import { MvPowerFlowVisualizer } from './MvPowerFlowVisualizer';
import { MasterInstallationChainExplorer } from '../common/MasterInstallationChainExplorer';
import { EngineeringInfographicCard } from '../common/EngineeringInfographicCard';
import { EngineeringInfographicsModal } from '../common/EngineeringInfographicsModal';
import { OperatorFabricStream } from '../digitaltwin/OperatorFabricStream';
import { AasDrawer } from '../digitaltwin/AasDrawer';
import { PowerChain } from '../common/PowerChain';
import { WorkedExampleViewer } from '../common/WorkedExampleViewer';
import { getWorkedExampleById } from '../../data/workedExamplesRegistry';
import { EQUIPMENT_ITEMS } from '../../data/epedeData';
import { resolveCanonicalEquipment } from '../../data/equipment/canonicalEquipmentRegistry';
import type { Equipment, DomainCode } from '../../types/epede';

export type DistributionPillar =
  | 'POWER_FLOW'
  | 'MASTER_CHAIN'
  | 'JOURNEY'
  | 'TOPOLOGY'
  | 'FEEDERS_SWITCHING'
  | 'SUBSTATION_TRAFO'
  | 'LV_CONSUMER'
  | 'URBAN_VS_RURAL'
  | 'CROSS_SECTION'
  | 'PROTECTION_SAFETY'
  | 'SIMULATOR'
  | 'DER_RELIABILITY'
  | 'OPERATOR_FABRIC';

interface DistributionWorkbenchProps {
  locale?: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  activeSubdomainId?: string;
  onSelectEquipment?: (equipmentId: string) => void;
}

export const DistributionWorkbench: React.FC<DistributionWorkbenchProps> = ({
  locale = 'fr',
  onNavigate,
  activeSubdomainId,
  onSelectEquipment
}) => {
  const [activePillar, setActivePillar] = useState<DistributionPillar>('POWER_FLOW');
  const [activeView, setActiveView] = useState<DistributionRepresentationView>('PHYSICAL');
  const [selectedEnvironment, setSelectedEnvironment] = useState<DistributionEnvironmentContext>('URBAN');
  const [selectedVoltage, setSelectedVoltage] = useState<DistributionVoltageContext>('30kV');
  const [isPrinciplesDrawerOpen, setIsPrinciplesDrawerOpen] = useState<boolean>(false);
  const [modalInfographicId, setModalInfographicId] = useState<string | null>(null);
  const [selectedAasAssetId, setSelectedAasAssetId] = useState<string | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [sidebarSearch, setSidebarSearch] = useState<string>('');

  // Sync active subdomain with pillar
  useEffect(() => {
    if (!activeSubdomainId) return;
    if (activeSubdomainId.includes('D05.1')) setActivePillar('JOURNEY');
    else if (activeSubdomainId.includes('D05.2')) setActivePillar('TOPOLOGY');
    else if (activeSubdomainId.includes('D05.3')) setActivePillar('SUBSTATION_TRAFO');
    else if (activeSubdomainId.includes('D05.4')) setActivePillar('LV_CONSUMER');
    else if (activeSubdomainId.includes('D05.5')) setActivePillar('FEEDERS_SWITCHING');
    else if (activeSubdomainId.includes('D05.6')) setActivePillar('DER_RELIABILITY');
  }, [activeSubdomainId]);

  const pillarsList: {
    id: DistributionPillar;
    label_fr: string;
    label_en: string;
    icon: any;
    phase: 1 | 2 | 3 | 4;
    phaseLabel_fr: string;
    phaseLabel_en: string;
    isNew?: boolean;
  }[] = [
    // Phase 1: Topologies & Écoulement MT/BT
    { id: 'POWER_FLOW', label_fr: '⚡ Pipeline MT 30 kV & Appareillages', label_en: '⚡ 30 kV MV Power Flow & Switchgear', icon: Zap, phase: 1, phaseLabel_fr: 'Topologies & Flux', phaseLabel_en: 'Topologies & Flow', isNew: true },
    { id: 'MASTER_CHAIN', label_fr: '🔗 Spine Maîtresse MT → BT (11 Niveaux)', label_en: '🔗 Master MV → LV Delivery Spine (11 Stages)', icon: Layers, phase: 1, phaseLabel_fr: 'Topologies & Flux', phaseLabel_en: 'Topologies & Flow', isNew: true },
    { id: 'JOURNEY', label_fr: 'Parcours Électrique (10 Étapes)', label_en: 'Electrical Journey (10 Stages)', icon: Zap, phase: 1, phaseLabel_fr: 'Topologies & Flux', phaseLabel_en: 'Topologies & Flow' },
    { id: 'TOPOLOGY', label_fr: 'Topologies (Radiale, Boucle, Maillée)', label_en: 'Topologies (Radial, Ring, Mesh)', icon: Repeat, phase: 1, phaseLabel_fr: 'Topologies & Flux', phaseLabel_en: 'Topologies & Flow' },

    // Phase 2: Appareillages, Lignes & Postes MT/BT
    { id: 'FEEDERS_SWITCHING', label_fr: 'Artères MT & Appareillages (RMU/ACR)', label_en: 'MV Feeders & Switchgear (RMU/ACR)', icon: Sliders, phase: 2, phaseLabel_fr: 'Appareillages & Postes', phaseLabel_en: 'Switchgear & Subs' },
    { id: 'SUBSTATION_TRAFO', label_fr: 'Postes MT/BT & Transformateurs Dyn11', label_en: 'Substations & Dyn11 Transformers', icon: Building2, phase: 2, phaseLabel_fr: 'Appareillages & Postes', phaseLabel_en: 'Switchgear & Subs' },
    { id: 'LV_CONSUMER', label_fr: 'Réseau BT & Usager Final (Lien D06)', label_en: 'LV Mains & Consumer (D06 Link)', icon: Home, phase: 2, phaseLabel_fr: 'Appareillages & Postes', phaseLabel_en: 'Switchgear & Subs' },
    { id: 'CROSS_SECTION', label_fr: 'Coupe Câble PRC & Support Aérien', label_en: 'Cable Cutaway & Pole Structure', icon: Layers, phase: 2, phaseLabel_fr: 'Appareillages & Postes', phaseLabel_en: 'Switchgear & Subs' },

    // Phase 3: Environnements, Sûreté & FLISR
    { id: 'URBAN_VS_RURAL', label_fr: 'Urbain vs. Rural (Paradigmes)', label_en: 'Urban vs. Rural (Paradigms)', icon: Scale, phase: 3, phaseLabel_fr: 'Sûreté & FLISR', phaseLabel_en: 'Safety & FLISR' },
    { id: 'PROTECTION_SAFETY', label_fr: 'Protections, Neutre & Sécurité', label_en: 'Protection, Grounding & Safety', icon: ShieldCheck, phase: 3, phaseLabel_fr: 'Sûreté & FLISR', phaseLabel_en: 'Safety & FLISR' },
    { id: 'SIMULATOR', label_fr: 'Simulateur Défauts & FLISR (4 Cas)', label_en: 'Fault & FLISR Simulator (4 Cases)', icon: AlertTriangle, phase: 3, phaseLabel_fr: 'Sûreté & FLISR', phaseLabel_en: 'Safety & FLISR' },

    // Phase 4: Réseaux Intelligents & Jumeau Numérique
    { id: 'DER_RELIABILITY', label_fr: 'Intégration DER & IEEE 1366', label_en: 'DER Integration & IEEE 1366', icon: Activity, phase: 4, phaseLabel_fr: 'Smart Grid & Jumeau', phaseLabel_en: 'Smart Grid & Twin' },
    { id: 'OPERATOR_FABRIC', label_fr: 'Console OperatorFabric & Jumeau AAS', label_en: 'OperatorFabric Console & AAS Twin', icon: Zap, phase: 4, phaseLabel_fr: 'Smart Grid & Jumeau', phaseLabel_en: 'Smart Grid & Twin' }
  ];

  // Normative D05 Worked Example (NGR Earth Fault 30 kV)
  const d05WorkedExample = getWorkedExampleById('we-d05-distribution-ngr-earth-fault');

  // Resolve equipment for AAS drawer
  const matchedEquipment = EQUIPMENT_ITEMS.find((e) => e.id === selectedAasAssetId);
  const canonicalEq = selectedAasAssetId ? resolveCanonicalEquipment(selectedAasAssetId) : null;
  const resolvedAasEquipment: Equipment | null = matchedEquipment || (canonicalEq ? {
    id: canonicalEq.id,
    domain_id: (canonicalEq.parentDomain as DomainCode) || 'D05',
    domain_code: (canonicalEq.parentDomain as DomainCode) || 'D05',
    entity_type: canonicalEq.equipmentType || 'DistributionApparatus',
    name_fr: canonicalEq.name.fr,
    name_en: canonicalEq.name.en,
    aliases_fr: canonicalEq.aliases.fr,
    aliases_en: canonicalEq.aliases.en,
    description_fr: canonicalEq.purpose?.fr || '',
    description_en: canonicalEq.purpose?.en || '',
    function_fr: canonicalEq.primaryFunction?.fr || '',
    function_en: canonicalEq.primaryFunction?.en || '',
    typical_location_fr: 'Réseau HTA 30 kV Douala/Yaoundé',
    typical_location_en: '30 kV MV Network Douala/Yaoundé',
    voltage_level: 'MV',
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    technical: canonicalEq.keyEngineeringValues.reduce((acc, v) => {
      const labelStr = typeof v.label === 'string' ? v.label : (v.label[locale] || v.label.fr || v.key);
      acc[labelStr] = `${v.value} ${v.unit}`;
      return acc;
    }, {} as Record<string, string | number | boolean>)
  } : (selectedAasAssetId ? {
    id: selectedAasAssetId,
    domain_id: 'D05',
    domain_code: 'D05',
    entity_type: 'DistributionApparatus',
    name_fr: 'Équipement Réseau HTA / BT',
    name_en: 'MV/LV Network Apparatus',
    aliases_fr: ['Poste HTA', 'Transformateur HTA/BT'],
    aliases_en: ['MV Substation', 'MV/LV Transformer'],
    description_fr: 'Équipement de distribution électrique sous surveillance SCADA temps réel.',
    description_en: 'Electrical distribution equipment under real-time SCADA supervision.',
    function_fr: 'Distribution & Protection',
    function_en: 'Distribution & Protection',
    typical_location_fr: 'Poste HTA/BT',
    typical_location_en: 'MV/LV Substation',
    voltage_level: 'MV',
    is_safety_critical: true,
    hazard_level: 'high_voltage',
    technical: {}
  } : null));

  const activePillarConfig = pillarsList.find((p) => p.id === activePillar);

  return (
    <div className="space-y-6 font-mono">
      {/* 0. Authoritative Ecosystem Reference Hero (Page 4: Distribution & Electrical Installation) */}
      <AuthoritativeEcosystemHero
        stage="distribution"
        locale={locale}
        onNavigateToDomain={(dCode) => onNavigate?.('domain', dCode)}
        onSelectEquipment={onSelectEquipment}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
        activePillarLabel={activePillarConfig ? (locale === 'fr' ? activePillarConfig.label_fr : activePillarConfig.label_en) : undefined}
        totalPillarsCount={13}
      />

      {/* CANONICAL 9-STAGE POWER CHAIN (STAGE D1: MV/LV DISTRIBUTION) */}
      <PowerChain
        currentStageId="D1"
        locale={locale}
        onSelectStage={(stage) => {
          if (stage.id === 'G1') onNavigate?.('domain', 'D01');
          else if (stage.id === 'T1') onNavigate?.('domain', 'D03');
          else if (stage.id === 'S1') onNavigate?.('domain', 'D04');
          else if (stage.id === 'D1') onNavigate?.('domain', 'D05');
          else if (stage.id === 'I1') onNavigate?.('domain', 'D06');
          else if (stage.id === 'M1') onNavigate?.('domain', 'D06');
          else if (stage.id === 'A1') onNavigate?.('domain', 'D07');
          else if (stage.id === 'F1') onNavigate?.('domain', 'D14');
          else if (stage.id === 'S2') onNavigate?.('domain', 'D16');
        }}
      />

      {/* Reorganized Workspace: Side Navigator + Main Workspace */}
      <div className="flex flex-col lg:flex-row items-start gap-6">

        {/* SIDE ENGINEERING NAVIGATOR */}
        {isSidePanelOpen && (
          <aside className="w-full lg:w-80 shrink-0 space-y-4 font-mono text-xs animate-in slide-in-from-left duration-200">
            <div className="p-4 rounded-2xl bg-[#070A10] border border-[#1C2533] shadow-xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#1C2533]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    {locale === 'fr' ? 'Piliers Distribution (13)' : 'Distribution Pillars (13)'}
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

              {/* Quick Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder={locale === 'fr' ? 'Filtrer (ex. FLISR, Dyn11, RMU)...' : 'Search pillars...'}
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0C121C] border border-[#1C2533] text-slate-200 placeholder-slate-600 text-xs focus:outline-hidden focus:border-teal-500"
                />
              </div>

              {/* 13 Pillars Grouped List */}
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
                {[1, 2, 3, 4].map((ph) => {
                  const phasePillars = pillarsList.filter(p => p.phase === ph && (!sidebarSearch.trim() || p.label_fr.toLowerCase().includes(sidebarSearch.toLowerCase()) || p.label_en.toLowerCase().includes(sidebarSearch.toLowerCase())));
                  if (phasePillars.length === 0) return null;
                  const firstPillar = phasePillars[0];
                  return (
                    <div key={ph} className="space-y-1">
                      <div className="px-1 text-[10px] font-bold text-teal-400/80 uppercase tracking-wider">
                        {locale === 'fr' ? firstPillar.phaseLabel_fr : firstPillar.phaseLabel_en}
                      </div>
                      {phasePillars.map((p) => {
                        const isSelected = p.id === activePillar;
                        const overallIdx = pillarsList.findIndex(item => item.id === p.id);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setActivePillar(p.id)}
                            className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-teal-500/20 border-teal-400 text-white shadow-xs'
                                : 'bg-[#0C121C]/80 border-[#1C2533] text-slate-400 hover:bg-[#16202E] hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold shrink-0 ${
                                isSelected ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {overallIdx + 1}
                              </span>
                              <div className="min-w-0">
                                <div className={`text-[11px] font-semibold truncate ${isSelected ? 'text-teal-300' : 'text-slate-300'}`}>
                                  {locale === 'fr' ? p.label_fr : p.label_en}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-teal-400' : 'text-slate-600'}`} />
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Principles Drawer Shortcut */}
              <button
                type="button"
                onClick={() => setIsPrinciplesDrawerOpen(true)}
                className="w-full p-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Formulaire & Principes HTA' : 'Formulas & Principles'}</span>
              </button>

            </div>
          </aside>
        )}

        {/* MAIN WORKSPACE */}
        <div className="flex-1 min-w-0 space-y-5">
          {!isSidePanelOpen && (
            <button
              type="button"
              onClick={() => setIsSidePanelOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#070A10] border border-[#1C2533] hover:border-teal-500/50 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer shadow-md"
            >
              <PanelLeftOpen className="w-4 h-4 text-teal-400" />
              <span>{locale === 'fr' ? 'Ouvrir le Volet des 13 Piliers Distribution' : 'Open 13 Distribution Pillars Navigator'}</span>
            </button>
          )}

          {/* 1. Master Command Header */}
          <DistributionCommandHeader
        locale={locale}
        activePillar={activePillar}
        onSelectPillar={setActivePillar}
        activeView={activeView}
        onSelectView={setActiveView}
        selectedEnvironment={selectedEnvironment}
        onSelectEnvironment={setSelectedEnvironment}
        selectedVoltage={selectedVoltage}
        onSelectVoltage={setSelectedVoltage}
        onOpenPrinciplesDrawer={() => setIsPrinciplesDrawerOpen(true)}
      />

      {/* 2. 10-Pillar Interactive Tab Navigation Bar */}
      <div className="p-2.5 rounded-2xl bg-[#070A10] border border-[#1C2533] shadow-lg overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {pillarsList.map((pillar) => {
            const isSelected = pillar.id === activePillar;
            const Icon = pillar.icon;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillar(pillar.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 ring-1 ring-amber-300'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-700'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{locale === 'fr' ? pillar.label_fr : pillar.label_en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Active Pillar View Rendering */}
      <main className="transition-all duration-200 space-y-6">
        {activePillar === 'POWER_FLOW' && (
          <MvPowerFlowVisualizer
            locale={locale}
            onSelectApparatus={(appId) => {
              setSelectedAasAssetId(appId);
            }}
          />
        )}

        {activePillar === 'MASTER_CHAIN' && (
          <MasterInstallationChainExplorer
            locale={locale}
            onNavigateToStage={(stageId) => {
              if (stageId.includes('tgbt') || stageId.includes('load') || stageId.includes('panel') || stageId.includes('building')) {
                if (onNavigate) onNavigate('domain', 'D06');
              }
            }}
          />
        )}

        {activePillar === 'JOURNEY' && (
          <div className="space-y-6">
            <EngineeringInfographicCard
              infographicId="how_power_distribution_works"
              locale={locale}
              onOpenModal={(id) => setModalInfographicId(id)}
            />
            <MasterDistributionJourney
              locale={locale}
              activeView={activeView}
              onSelectEquipment={(id) => {
                setActivePillar('FEEDERS_SWITCHING');
              }}
            />
          </div>
        )}

        {activePillar === 'TOPOLOGY' && (
          <div className="space-y-6">
            <EngineeringInfographicCard
              infographicId="common_power_distribution_system_types"
              locale={locale}
              onOpenModal={(id) => setModalInfographicId(id)}
            />
            <DistributionTopologiesExplorer locale={locale} />
          </div>
        )}

        {activePillar === 'FEEDERS_SWITCHING' && (
          <MvFeedersAndSwitchingExplorer locale={locale} />
        )}

        {activePillar === 'SUBSTATION_TRAFO' && (
          <DistributionSubstationAndTransformerExplorer locale={locale} />
        )}

        {activePillar === 'LV_CONSUMER' && (
          <LowVoltageAndConsumerJourney locale={locale} onNavigate={onNavigate} />
        )}

        {activePillar === 'URBAN_VS_RURAL' && (
          <UrbanVsRuralDistributionView locale={locale} />
        )}

        {activePillar === 'CROSS_SECTION' && (
          <OverheadVsUndergroundCrossSectionView locale={locale} />
        )}

        {activePillar === 'PROTECTION_SAFETY' && (
          <div className="space-y-6">
            <DistributionProtectionAndSafetyOverlay locale={locale} />
            {d05WorkedExample && (
              <div className="p-4 sm:p-6 rounded-2xl bg-[#090D14] border border-amber-900/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E2738] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                      {locale === 'fr' ? 'Exemple Didactique Résolu Normalisé D05' : 'Normative Worked Engineering Calculation D05'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                    IEC 60071 / SONATREL 30 kV
                  </span>
                </div>
                <WorkedExampleViewer example={d05WorkedExample} locale={locale} />
              </div>
            )}
          </div>
        )}

        {activePillar === 'SIMULATOR' && (
          <div className="space-y-6">
            <DistributionFaultScenariosSimulator locale={locale} />
            {d05WorkedExample && (
              <div className="p-4 sm:p-6 rounded-2xl bg-[#090D14] border border-cyan-900/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E2738] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                      {locale === 'fr' ? 'Calcul de Dimensionnement Associé : Résistance de Neutre NGR 30 kV' : 'Associated Sizing Calculation: 30 kV NGR Grounding'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                    IEEE Std 142 / NF C 13-200
                  </span>
                </div>
                <WorkedExampleViewer example={d05WorkedExample} locale={locale} />
              </div>
            )}
          </div>
        )}

        {activePillar === 'DER_RELIABILITY' && (
          <DistributionDerAndReliabilityViewer locale={locale} />
        )}

        {activePillar === 'OPERATOR_FABRIC' && (
          <div className="space-y-6">
            <OperatorFabricStream
              locale={locale}
              onInspectAas={(assetId) => setSelectedAasAssetId(assetId)}
            />
          </div>
        )}
      </main>
      </div>
      </div>

      {/* Slide-over AAS v3 Digital Twin Drawer */}
      <AasDrawer
        equipment={resolvedAasEquipment}
        isOpen={!!selectedAasAssetId}
        onClose={() => setSelectedAasAssetId(null)}
        locale={locale}
      />

      {/* 4. Engineering Principles & Formulas Side Drawer */}
      <DistributionEngineeringPrinciplesDrawer
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
