// src/components/substations/SubstationsWorkbench.tsx
// EPEDE D04 - Master Substation Engineering Workbench Container

import React, { useState } from 'react';
import {
  Zap,
  Layers,
  Activity,
  Sliders,
  Scale,
  ShieldAlert,
  ChevronRight,
  Calculator,
  Radio,
  Share2,
  FolderTree,
  Building2,
  Lock,
  Cpu,
  RefreshCw,
  Info,
  Flame,
  BatteryCharging,
  Target,
  PanelLeftClose,
  PanelLeftOpen,
  Search
} from 'lucide-react';
import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';
import {
  SubstationCommandHeader,
  type SubstationRepresentationView,
  type SubstationVoltageContext
} from './SubstationCommandHeader';
import { MasterSubstationJourney } from './MasterSubstationJourney';
import { SubstationBayArchitectureExplorer } from './SubstationBayArchitectureExplorer';
import { SubstationBusbarTopologyExplorer } from './SubstationBusbarTopologyExplorer';
import { PowerTransformerDeepDive } from './PowerTransformerDeepDive';
import { AisGisComparisonView } from './AisGisComparisonView';
import { SubstationProtectionZonesOverlay } from './SubstationProtectionZonesOverlay';
import { SubstationAuxiliarySystemsExplorer } from './SubstationAuxiliarySystemsExplorer';
import { SubstationEarthingSafetyViewer } from './SubstationEarthingSafetyViewer';
import { SubstationFireAndControlBuilding } from './SubstationFireAndControlBuilding';
import { SubstationScadaAutomationSystem } from './SubstationScadaAutomationSystem';
import { SubstationOperationsScenarios } from './SubstationOperationsScenarios';
import { SubstationEngineeringPrinciplesDrawer } from './SubstationEngineeringPrinciplesDrawer';
import { EngineeringInfographicCard } from '../common/EngineeringInfographicCard';
import { EngineeringInfographicsModal } from '../common/EngineeringInfographicsModal';

export type SubstationWorkbenchPillar =
  | 'JOURNEY'
  | 'BAYS'
  | 'TOPOLOGY'
  | 'TRANSFORMER'
  | 'AIS_GIS_COMPARE'
  | 'PROTECTION'
  | 'SCADA_SAS'
  | 'AUXILIARIES'
  | 'SAFETY_EARTHING'
  | 'BUILDING_FIRE'
  | 'SCENARIOS';

interface SubstationsWorkbenchProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (id: string) => void;
  onNavigate?: (view: string, domainCode?: string) => void;
}

export const SubstationsWorkbench: React.FC<SubstationsWorkbenchProps> = ({
  locale,
  onSelectEquipment,
  onNavigate
}) => {
  // Workbench Active Controller State
  const [activePillar, setActivePillar] = useState<SubstationWorkbenchPillar>('JOURNEY');
  const [activeView, setActiveView] = useState<SubstationRepresentationView>('PHYSICAL');
  const [selectedVoltage, setSelectedVoltage] = useState<SubstationVoltageContext>('225kV');
  const [selectedSubstationType, setSelectedSubstationType] = useState<string>('SUB_TRANS_AIS');
  const [isPrinciplesDrawerOpen, setIsPrinciplesDrawerOpen] = useState<boolean>(false);
  const [modalInfographicId, setModalInfographicId] = useState<string | null>(null);
  const [transformerInfographicTab, setTransformerInfographicTab] = useState<'how-a-transformer-works' | 'how-to-read-a-transformer-nameplate'>('how-a-transformer-works');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [sidebarSearch, setSidebarSearch] = useState<string>('');

  // 10 Pillars Definition for Navigation Tabs
  const pillars: {
    id: SubstationWorkbenchPillar;
    code: string;
    title_fr: string;
    title_en: string;
    tag: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[] = [
    {
      id: 'JOURNEY',
      code: 'P01',
      title_fr: '1. Parcours Électrique',
      title_en: '1. Electrical Journey',
      tag: 'Flux 8 Étapes',
      icon: Zap,
      color: 'amber'
    },
    {
      id: 'BAYS',
      code: 'P02',
      title_fr: '2. Travées & Appareillages',
      title_en: '2. Bay Architectures',
      tag: 'Ligne / Transfo / CPL',
      icon: Layers,
      color: 'sky'
    },
    {
      id: 'TOPOLOGY',
      code: 'P03',
      title_fr: '3. Topologies Barres',
      title_en: '3. Busbar Topologies',
      tag: 'Simple / Double / 1½ CB',
      icon: FolderTree,
      color: 'cyan'
    },
    {
      id: 'TRANSFORMER',
      code: 'P04',
      title_fr: '4. Transfo & Régleur OLTC',
      title_en: '4. Transformer & OLTC',
      tag: '100 MVA · 17 Plots',
      icon: Activity,
      color: 'amber'
    },
    {
      id: 'AIS_GIS_COMPARE',
      code: 'P05',
      title_fr: '5. Comparatif AIS vs GIS',
      title_en: '5. AIS vs GIS Matrix',
      tag: '12 Critères CAO',
      icon: Scale,
      color: 'emerald'
    },
    {
      id: 'PROTECTION',
      code: 'P06',
      title_fr: '6. Zones de Protection',
      title_en: '6. Protection Zones',
      tag: '87T · 87B · 50BF',
      icon: ShieldAlert,
      color: 'rose'
    },
    {
      id: 'SCADA_SAS',
      code: 'P07',
      title_fr: '7. SCADA & CEI 61850',
      title_en: '7. SCADA & IEC 61850',
      tag: 'Process Bus · MMS · GOOSE',
      icon: Radio,
      color: 'cyan'
    },
    {
      id: 'AUXILIARIES',
      code: 'P08',
      title_fr: '8. Auxiliaires AC/DC 110V',
      title_en: '8. Auxiliary AC/DC 110V',
      tag: 'Double Train A/B',
      icon: BatteryCharging,
      color: 'emerald'
    },
    {
      id: 'SAFETY_EARTHING',
      code: 'P09',
      title_fr: '9. Terre & Sécurité IEEE 80',
      title_en: '9. Earthing & Safety',
      tag: 'Pas / Toucher / Foudre',
      icon: Target,
      color: 'teal'
    },
    {
      id: 'BUILDING_FIRE',
      code: 'P10',
      title_fr: '10. Bâtiment & Incendie',
      title_en: '10. Civil & Fire Safety',
      tag: 'Murs REI 240 / Sump',
      icon: Building2,
      color: 'purple'
    },
    {
      id: 'SCENARIOS',
      code: 'P11',
      title_fr: '11. Exploitation & LOTO',
      title_en: '11. Operations & LOTO',
      tag: 'Simulateur Manœuvres',
      icon: Lock,
      color: 'orange'
    }
  ];

  const activePillarConfig = pillars.find((p) => p.id === activePillar);

  return (
    <div className="space-y-6 font-mono">
      
      {/* 0. Authoritative Ecosystem Reference Hero (Page 3: Power Substation) */}
      <AuthoritativeEcosystemHero
        stage="substation"
        locale={locale}
        onNavigateToDomain={(dCode) => onNavigate?.('domain', dCode)}
        onSelectEquipment={onSelectEquipment}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
        activePillarLabel={activePillarConfig ? (locale === 'fr' ? activePillarConfig.title_fr : activePillarConfig.title_en) : undefined}
        totalPillarsCount={11}
      />

      {/* Reorganized Workspace: Side Navigator + Main Workspace */}
      <div className="flex flex-col lg:flex-row items-start gap-6">

        {/* SIDE ENGINEERING NAVIGATOR */}
        {isSidePanelOpen && (
          <aside className="w-full lg:w-80 shrink-0 space-y-4 font-mono text-xs animate-in slide-in-from-left duration-200">
            <div className="p-4 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#222B38]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    {locale === 'fr' ? 'Piliers Poste HT (11)' : 'Substation Pillars (11)'}
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
                  placeholder={locale === 'fr' ? 'Filtrer (ex. 87T, GIS, régleur)...' : 'Search pillars...'}
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0E141F] border border-[#222B38] text-slate-200 placeholder-slate-600 text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* 11 Pillars List */}
              <div className="space-y-1 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
                {pillars
                  .filter(p => {
                    if (!sidebarSearch.trim()) return true;
                    const q = sidebarSearch.toLowerCase();
                    return (
                      p.title_fr.toLowerCase().includes(q) ||
                      p.title_en.toLowerCase().includes(q) ||
                      p.tag.toLowerCase().includes(q) ||
                      p.code.toLowerCase().includes(q)
                    );
                  })
                  .map((p) => {
                    const isSelected = p.id === activePillar;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActivePillar(p.id)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-xs'
                            : 'bg-[#0E141F]/80 border-[#222B38] text-slate-400 hover:bg-[#161B22] hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {p.code}
                          </span>
                          <div className="min-w-0">
                            <div className={`text-xs font-semibold truncate ${isSelected ? 'text-amber-300' : 'text-slate-300'}`}>
                              {locale === 'fr' ? p.title_fr : p.title_en}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {p.tag}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                      </button>
                    );
                  })}
              </div>

              {/* Principles Drawer Shortcut */}
              <button
                type="button"
                onClick={() => setIsPrinciplesDrawerOpen(true)}
                className="w-full p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Formulaire Électrotechnique' : 'Formulas Drawer'}</span>
              </button>

            </div>
          </aside>
        )}

        {/* MAIN WORKSPACE */}
        <main className="flex-1 min-w-0 space-y-5">
          {!isSidePanelOpen && (
            <button
              type="button"
              onClick={() => setIsSidePanelOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090D14] border border-[#222B38] hover:border-amber-500/50 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer shadow-md"
            >
              <PanelLeftOpen className="w-4 h-4 text-amber-400" />
              <span>{locale === 'fr' ? 'Ouvrir le Volet des 11 Piliers Postes' : 'Open 11 Substation Pillars Navigator'}</span>
            </button>
          )}

          {/* 1. Master Substation Command Header */}
          <SubstationCommandHeader
        locale={locale}
        activePillar={activePillar}
        onSelectPillar={setActivePillar}
        activeView={activeView}
        onSelectView={setActiveView}
        selectedSubstationType={selectedSubstationType}
        onSelectSubstationType={setSelectedSubstationType}
        selectedVoltage={selectedVoltage}
        onSelectVoltage={setSelectedVoltage}
        onOpenPrinciplesDrawer={() => setIsPrinciplesDrawerOpen(true)}
      />

      {/* 2. Primary 11 Engineering Pillars Navigation Bar */}
      <div className="p-3 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {pillars.map((p) => {
            const isSelected = p.id === activePillar;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePillar(p.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-w-[170px] ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-300'
                    : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-amber-500/40 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {p.code}
                  </span>
                  <span className={`text-[10px] font-sans ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                    {p.tag}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-0.5">
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span className="text-xs font-bold truncate">
                    {locale === 'fr' ? p.title_fr : p.title_en}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Dynamic Pillar Workspace View */}
      <div className="transition-all duration-200 space-y-6">
        {activePillar === 'JOURNEY' && (
          <div className="space-y-6">
            <EngineeringInfographicCard
              infographicId="substation_overview"
              locale={locale}
              onOpenModal={(id) => setModalInfographicId(id)}
            />
            <MasterSubstationJourney
              locale={locale}
              activeView={activeView}
              selectedVoltage={selectedVoltage}
              onSelectEquipment={onSelectEquipment}
            />
          </div>
        )}

        {activePillar === 'BAYS' && (
          <div className="space-y-6">
            <EngineeringInfographicCard
              infographicId="substation_components"
              locale={locale}
              onOpenModal={(id) => setModalInfographicId(id)}
            />
            <SubstationBayArchitectureExplorer
              locale={locale}
              onSelectEquipment={onSelectEquipment}
            />
          </div>
        )}

        {activePillar === 'TOPOLOGY' && (
          <div className="space-y-6">
            <EngineeringInfographicCard
              infographicId="substation_sld"
              locale={locale}
              onOpenModal={(id) => setModalInfographicId(id)}
            />
            <SubstationBusbarTopologyExplorer
              locale={locale}
            />
          </div>
        )}

        {activePillar === 'TRANSFORMER' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setTransformerInfographicTab('how-a-transformer-works')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    transformerInfographicTab === 'how-a-transformer-works'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {locale === 'fr' ? '1. Principe & Induction (Faraday)' : '1. Faraday Induction & Core'}
                </button>
                <button
                  type="button"
                  onClick={() => setTransformerInfographicTab('how-to-read-a-transformer-nameplate')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    transformerInfographicTab === 'how-to-read-a-transformer-nameplate'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {locale === 'fr' ? '2. Plaque Signalétique (IEC 60076)' : '2. Nameplate Reading (IEC)'}
                </button>
              </div>

              <EngineeringInfographicCard
                infographicId={transformerInfographicTab}
                locale={locale}
                onOpenModal={(id) => setModalInfographicId(id)}
              />
            </div>
            <PowerTransformerDeepDive
              locale={locale}
              onSelectEquipment={onSelectEquipment}
            />
          </div>
        )}

        {activePillar === 'AIS_GIS_COMPARE' && (
          <AisGisComparisonView
            locale={locale}
          />
        )}

        {activePillar === 'PROTECTION' && (
          <div className="space-y-6">
            <EngineeringInfographicCard
              infographicId="substation_protection_zones"
              locale={locale}
              onOpenModal={(id) => setModalInfographicId(id)}
            />
            <SubstationProtectionZonesOverlay
              locale={locale}
              onSelectEquipment={onSelectEquipment}
            />
          </div>
        )}

        {activePillar === 'SCADA_SAS' && (
          <SubstationScadaAutomationSystem
            locale={locale}
            onSelectEquipment={onSelectEquipment}
          />
        )}

        {activePillar === 'AUXILIARIES' && (
          <div className="space-y-6">
            <EngineeringInfographicCard
              infographicId="renewable-collector-substation"
              locale={locale}
              onOpenModal={(id) => setModalInfographicId(id)}
            />
            <SubstationAuxiliarySystemsExplorer
              locale={locale}
            />
          </div>
        )}

        {activePillar === 'SAFETY_EARTHING' && (
          <div className="space-y-6">
            <EngineeringInfographicCard
              infographicId="substation_ground_grid"
              locale={locale}
              onOpenModal={(id) => setModalInfographicId(id)}
            />
            <SubstationEarthingSafetyViewer
              locale={locale}
            />
          </div>
        )}

        {activePillar === 'BUILDING_FIRE' && (
          <SubstationFireAndControlBuilding
            locale={locale}
          />
        )}

        {activePillar === 'SCENARIOS' && (
          <SubstationOperationsScenarios
            locale={locale}
            onSelectEquipment={onSelectEquipment}
          />
        )}
      </div>
      </main>
      </div>

      {/* 4. Mathematical Engineering Principles Drawer */}
      <SubstationEngineeringPrinciplesDrawer
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
