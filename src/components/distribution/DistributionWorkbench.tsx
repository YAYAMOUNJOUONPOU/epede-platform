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

  const pillarsList: { id: DistributionPillar; label_fr: string; label_en: string; icon: any; isNew?: boolean }[] = [
    { id: 'POWER_FLOW', label_fr: '⚡ Pipeline MT 30 kV & Appareillages', label_en: '⚡ 30 kV MV Power Flow & Switchgear', icon: Zap, isNew: true },
    { id: 'MASTER_CHAIN', label_fr: '🔗 Spine Maîtresse MT → BT (11 Niveaux)', label_en: '🔗 Master MV → LV Delivery Spine (11 Stages)', icon: Layers, isNew: true },
    { id: 'JOURNEY', label_fr: 'Parcours Électrique (10 Étapes)', label_en: 'Electrical Journey (10 Stages)', icon: Zap },
    { id: 'TOPOLOGY', label_fr: 'Topologies (Radiale, Boucle, Maillée)', label_en: 'Topologies (Radial, Ring, Mesh)', icon: Repeat },
    { id: 'FEEDERS_SWITCHING', label_fr: 'Artères MT & Appareillages (RMU/ACR)', label_en: 'MV Feeders & Switchgear (RMU/ACR)', icon: Sliders },
    { id: 'SUBSTATION_TRAFO', label_fr: 'Postes MT/BT & Transformateurs Dyn11', label_en: 'Substations & Dyn11 Transformers', icon: Building2 },
    { id: 'LV_CONSUMER', label_fr: 'Réseau BT & Usager Final (Lien D06)', label_en: 'LV Mains & Consumer (D06 Link)', icon: Home },
    { id: 'URBAN_VS_RURAL', label_fr: 'Urbain vs. Rural (Paradigmes)', label_en: 'Urban vs. Rural (Paradigms)', icon: Scale },
    { id: 'CROSS_SECTION', label_fr: 'Coupe Câble PRC & Support Aérien', label_en: 'Cable Cutaway & Pole Structure', icon: Layers },
    { id: 'PROTECTION_SAFETY', label_fr: 'Protections, Neutre & Sécurité', label_en: 'Protection, Grounding & Safety', icon: ShieldCheck },
    { id: 'SIMULATOR', label_fr: 'Simulateur Défauts & FLISR (4 Cas)', label_en: 'Fault & FLISR Simulator (4 Cases)', icon: AlertTriangle },
    { id: 'DER_RELIABILITY', label_fr: 'Intégration DER & IEEE 1366', label_en: 'DER Integration & IEEE 1366', icon: Activity },
    { id: 'OPERATOR_FABRIC', label_fr: 'Console OperatorFabric & Jumeau AAS', label_en: 'OperatorFabric Console & AAS Twin', icon: Zap }
  ];

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
        totalPillarsCount={11}
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
                    {locale === 'fr' ? 'Piliers Distribution (11)' : 'Distribution Pillars (11)'}
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

              {/* 11 Pillars List */}
              <div className="space-y-1 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
                {pillarsList
                  .filter(p => {
                    if (!sidebarSearch.trim()) return true;
                    const q = sidebarSearch.toLowerCase();
                    return (
                      p.label_fr.toLowerCase().includes(q) ||
                      p.label_en.toLowerCase().includes(q)
                    );
                  })
                  .map((p, idx) => {
                    const isSelected = p.id === activePillar;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActivePillar(p.id)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-teal-500/20 border-teal-400 text-white shadow-xs'
                            : 'bg-[#0C121C]/80 border-[#1C2533] text-slate-400 hover:bg-[#16202E] hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isSelected ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className={`text-xs font-semibold truncate ${isSelected ? 'text-teal-300' : 'text-slate-300'}`}>
                              {locale === 'fr' ? p.label_fr : p.label_en}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-teal-400' : 'text-slate-600'}`} />
                      </button>
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
              <span>{locale === 'fr' ? 'Ouvrir le Volet des 11 Piliers Distribution' : 'Open 11 Distribution Pillars Navigator'}</span>
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
          <DistributionProtectionAndSafetyOverlay locale={locale} />
        )}

        {activePillar === 'SIMULATOR' && (
          <DistributionFaultScenariosSimulator locale={locale} />
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
