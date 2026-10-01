import React, { useState } from 'react';
import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';
import { 
  Waves, 
  Sun, 
  Wind, 
  Flame, 
  TreePine, 
  Zap, 
  TrendingUp, 
  Layers, 
  Sliders, 
  Cpu, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  ExternalLink,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Activity,
  Shield,
  FileText
} from 'lucide-react';
import { PRODUCTION_MAJOR_SECTIONS } from './data/productionSectionsData';
import { HydropowerVisualJourney } from './HydropowerVisualJourney';
import { OtherGenerationsJourney } from './OtherGenerationsJourney';
import { ProductionPowerCalculator } from './ProductionPowerCalculator';
import { CameroonFleetExplorer } from './CameroonFleetExplorer';
import { EngineeringInfographicsGallerySection } from '../common/EngineeringInfographicsGallerySection';
import { EngineeringInfographicCard } from '../common/EngineeringInfographicCard';
import { EngineeringInfographicsModal } from '../common/EngineeringInfographicsModal';
import { Image as ImageIcon } from 'lucide-react';
import { engineeringAssets, getEngineeringImageUrl } from '../../services/engineeringAssets';
import type { GenerationTechnologyId, ProductionMainSection } from './types';

const SECTION_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Sun,
  TrendingUp,
  Zap,
  Layers,
  Sliders,
  Cpu
};

interface EnergyProductionMainViewProps {
  initialTechnology?: GenerationTechnologyId;
  onNavigateToDomain?: (domainCode: string) => void;
  locale?: 'fr' | 'en';
  onSelectEquipment?: (equipmentId: string) => void;
}

export const EnergyProductionMainView: React.FC<EnergyProductionMainViewProps> = ({
  initialTechnology,
  onNavigateToDomain,
  locale = 'fr',
  onSelectEquipment
}) => {
  const [activeTech, setActiveTech] = useState<GenerationTechnologyId | null>(initialTechnology || null);
  const [selectedSectionNumber, setSelectedSectionNumber] = useState<number>(1);
  const [activeMainTab, setActiveMainTab] = useState<'pillars' | 'simulator' | 'cameroon_fleet' | 'infographics'>('pillars');
  const [infographicSubTab, setInfographicSubTab] = useState<'how_power_generation_works' | 'main_types_of_power_generation' | 'thermal_power_plant_energy_conversion'>('how_power_generation_works');
  const [modalInfographicId, setModalInfographicId] = useState<string | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [sidebarSearch, setSidebarSearch] = useState<string>('');

  // If a specific technology journey is active, render it directly
  if (activeTech === 'hydro') {
    return (
      <HydropowerVisualJourney 
        locale={locale}
        onBackToOverview={() => setActiveTech(null)} 
        onSelectGlobalEquipment={onSelectEquipment}
      />
    );
  }

  if (activeTech) {
    return (
      <OtherGenerationsJourney
        technologyId={activeTech}
        locale={locale}
        onSelectTechnology={(techId) => setActiveTech(techId)}
        onBackToOverview={() => setActiveTech(null)}
        onSelectGlobalEquipment={onSelectEquipment}
      />
    );
  }

  const selectedSection = PRODUCTION_MAJOR_SECTIONS.find(s => s.number === selectedSectionNumber) || PRODUCTION_MAJOR_SECTIONS[0];
  const SectionIcon = SECTION_ICONS[selectedSection.icon] || Zap;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* 1. AUTHORITATIVE ECOSYSTEM IMAGE HERO (Primary Visual Entry Point) */}
      <AuthoritativeEcosystemHero
        stage="generation"
        locale={locale}
        onNavigateToDomain={onNavigateToDomain}
        onSelectEquipment={onSelectEquipment}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
        activePillarLabel={
          activeMainTab === 'pillars' 
            ? (locale === 'en' ? `Pillar ${selectedSection.number}: ${selectedSection.titleEn}` : `Pilier ${selectedSection.number}: ${selectedSection.titleFr}`)
            : activeMainTab === 'simulator'
            ? (locale === 'en' ? 'Power Simulator' : 'Simulateur de Puissance')
            : activeMainTab === 'cameroon_fleet'
            ? (locale === 'en' ? 'Cameroon Generation Fleet' : 'Parc National Cameroun')
            : (locale === 'en' ? 'IEC Engineering Posters' : 'Schémas CEI')
        }
        totalPillarsCount={6}
      />

      {/* 2. REORGANIZED WORKSPACE: SIDE ENGINEERING NAVIGATOR + MAIN ENGINEERING WORKSPACE */}
      <div className="flex flex-col lg:flex-row items-start gap-6">

        {/* SIDE ENGINEERING NAVIGATOR (Accessible, Reorganized to the Side) */}
        {isSidePanelOpen && (
          <aside className="w-full lg:w-80 shrink-0 space-y-4 font-mono text-xs animate-in slide-in-from-left duration-200">
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                    {locale === 'en' ? 'Engineering Navigator' : 'Volet d\'Ingénierie D01'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidePanelOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title={locale === 'en' ? 'Collapse side panel' : 'Replier le volet'}
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Search inside side panel */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder={locale === 'en' ? 'Filter pillars & modules...' : 'Filtrer les piliers & modules...'}
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-hidden focus:border-emerald-500/60"
                />
              </div>

              {/* Module Categories Tabs */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  {locale === 'en' ? 'Core Engineering Framework' : 'Les 6 Piliers Fondamentaux'}
                </span>
                <div className="space-y-1 pt-1">
                  {PRODUCTION_MAJOR_SECTIONS
                    .filter(sec => {
                      if (!sidebarSearch.trim()) return true;
                      const q = sidebarSearch.toLowerCase();
                      return (
                        sec.titleEn.toLowerCase().includes(q) ||
                        sec.titleFr.toLowerCase().includes(q) ||
                        sec.subtitleEn.toLowerCase().includes(q) ||
                        sec.subtitleFr.toLowerCase().includes(q)
                      );
                    })
                    .map((sec) => {
                      const Icon = SECTION_ICONS[sec.icon] || Zap;
                      const isSelected = activeMainTab === 'pillars' && sec.number === selectedSectionNumber;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => {
                            setActiveMainTab('pillars');
                            setSelectedSectionNumber(sec.number);
                          }}
                          className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-xs'
                              : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {sec.number}
                            </span>
                            <span className="text-xs truncate font-medium">
                              {locale === 'en' ? sec.titleEn : sec.titleFr}
                            </span>
                          </div>
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Specialized Lab Tools */}
              <div className="space-y-1 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  {locale === 'en' ? 'Simulation & National Grid' : 'Simulations & Parc National'}
                </span>
                <div className="space-y-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveMainTab('simulator')}
                    className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      activeMainTab === 'simulator'
                        ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-300 shadow-xs'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-medium">{locale === 'en' ? 'Power Simulator' : 'Simulateur de Puissance'}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">Lab</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMainTab('cameroon_fleet')}
                    className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      activeMainTab === 'cameroon_fleet'
                        ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300 shadow-xs'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-medium">{locale === 'en' ? 'Cameroon Assets' : 'Parc National (RIS/RIN)'}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">1.5 GW</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMainTab('infographics')}
                    className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      activeMainTab === 'infographics'
                        ? 'bg-amber-400/15 border-amber-400/60 text-amber-300 shadow-xs'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-medium">{locale === 'en' ? 'IEC Engineering Posters' : 'Schémas & Infographies CEI'}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">HD</span>
                  </button>
                </div>
              </div>

              {/* Dedicated Technology Journeys */}
              <div className="space-y-1 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  {locale === 'en' ? 'Technology Journeys' : 'Filières de Génération'}
                </span>
                <div className="grid grid-cols-1 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTech('hydro')}
                    className="p-2 rounded-xl bg-gradient-to-r from-sky-950/80 to-slate-900 border border-sky-500/40 hover:border-sky-400 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Waves className="w-3.5 h-3.5 text-sky-400" />
                      <span className="text-xs text-white font-semibold group-hover:text-sky-300">{locale === 'en' ? 'Hydropower (Flagship)' : 'Hydroélectricité (Majeur)'}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTech('solar')}
                    className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs text-slate-300 group-hover:text-amber-300">{locale === 'en' ? 'Solar Photovoltaic' : 'Solaire Photovoltaïque'}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTech('wind')}
                    className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Wind className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs text-slate-300 group-hover:text-cyan-300">{locale === 'en' ? 'Wind Generation' : 'Énergie Éolienne'}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTech('thermal')}
                    className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-orange-500/50 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-xs text-slate-300 group-hover:text-orange-300">{locale === 'en' ? 'Thermal CCGT & Gas' : 'Thermique CCGT & Gaz'}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTech('biomass')}
                    className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs text-slate-300 group-hover:text-emerald-300">{locale === 'en' ? 'Biomass Cogeneration' : 'Biomasse & Dérivés'}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          </aside>
        )}

        {/* MAIN ENGINEERING WORKSPACE AREA */}
        <main className="flex-1 min-w-0 space-y-6">

          {/* Quick toggle if side panel is closed */}
          {!isSidePanelOpen && (
            <button
              type="button"
              onClick={() => setIsSidePanelOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer shadow-md"
            >
              <PanelLeftOpen className="w-4 h-4 text-emerald-400" />
              <span>{locale === 'en' ? 'Show Engineering Navigator (6 Pillars)' : 'Ouvrir le Volet d\'Ingénierie (6 Piliers)'}</span>
            </button>
          )}
          
          {/* Quick Technology Selector Bar with Industrial Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Hydropower Card (Flagship) */}
          <div 
            onClick={() => setActiveTech('hydro')}
            className="group relative rounded-2xl bg-gradient-to-b from-sky-950/80 to-slate-900/90 border border-sky-500/50 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/20 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="relative h-24 w-full overflow-hidden bg-slate-900">
              <img
                src={getEngineeringImageUrl(engineeringAssets.generation.hydroRunner)}
                alt="Francis Turbine Runner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <div className="w-6 h-6 rounded-lg bg-sky-900/90 border border-sky-500/40 flex items-center justify-center text-sky-300">
                  <Waves className="w-3.5 h-3.5" />
                </div>
              </div>
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold font-mono bg-sky-500 text-slate-950">
                24 PTS
              </span>
              <div className="absolute bottom-1.5 left-2 text-[10px] font-mono text-sky-300 font-semibold">
                IEC 60034 / Nachtigal
              </div>
            </div>

            <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white group-hover:text-sky-300 transition-colors text-sm">
                  Hydroélectricité
                </h3>
                <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                  Parcours 17 étapes de la retenue au réseau 225 kV. Turbines Francis, Pelton, Kaplan & GSU.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-sky-400 group-hover:translate-x-0.5 transition-transform">
                <span>Lancer le Parcours</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Solar PV Card */}
          <div 
            onClick={() => setActiveTech('solar')}
            className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/60 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="relative h-24 w-full overflow-hidden bg-slate-900">
              <img
                src={getEngineeringImageUrl(engineeringAssets.generation.solarPlant)}
                alt="Solar PV Array"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <div className="w-6 h-6 rounded-lg bg-amber-950/90 border border-amber-600/40 flex items-center justify-center text-amber-400">
                  <Sun className="w-3.5 h-3.5" />
                </div>
              </div>
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                1500 V DC
              </span>
              <div className="absolute bottom-1.5 left-2 text-[10px] font-mono text-amber-300 font-semibold">
                IEC 62446
              </div>
            </div>

            <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors text-sm">
                  Solaire Photovoltaïque
                </h3>
                <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                  Rayonnement, chaînes 1 500 Vcc, boîtes DC, onduleurs centraux et postes MT.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-amber-400">
                <span>Explorer la Chaîne</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Wind Power Card */}
          <div 
            onClick={() => setActiveTech('wind')}
            className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="relative h-24 w-full overflow-hidden bg-slate-900">
              <img
                src={getEngineeringImageUrl(engineeringAssets.generation.windTurbines)}
                alt="Wind Turbines"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <div className="w-6 h-6 rounded-lg bg-cyan-950/90 border border-cyan-600/40 flex items-center justify-center text-cyan-400">
                  <Wind className="w-3.5 h-3.5" />
                </div>
              </div>
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                DFIG / PMSG
              </span>
              <div className="absolute bottom-1.5 left-2 text-[10px] font-mono text-cyan-300 font-semibold">
                IEC 61400
              </div>
            </div>

            <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm">
                  Énergie Éolienne
                </h3>
                <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                  Pales pitch, multiplicateur, génératrice DFIG/PMSG, convertisseur et transformateur.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-cyan-400">
                <span>Explorer la Chaîne</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Thermal CCGT Card */}
          <div 
            onClick={() => setActiveTech('thermal')}
            className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-800/60 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="relative h-24 w-full overflow-hidden bg-slate-900">
              <img
                src={getEngineeringImageUrl(engineeringAssets.generation.thermalCcgt)}
                alt="Combined Cycle Gas Turbine"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <div className="w-6 h-6 rounded-lg bg-orange-950/90 border border-orange-600/40 flex items-center justify-center text-orange-400">
                  <Flame className="w-3.5 h-3.5" />
                </div>
              </div>
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold">
                η ≈ 60%
              </span>
              <div className="absolute bottom-1.5 left-2 text-[10px] font-mono text-orange-300 font-semibold">
                Brayton-Rankine
              </div>
            </div>

            <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white group-hover:text-orange-300 transition-colors text-sm">
                  Thermique & Gaz (CCGT)
                </h3>
                <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                  Cycle Brayton, turbine à gaz, chaudière HRSG, turbine vapeur Rankine et turbo-alternateur.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-orange-400">
                <span>Explorer la Chaîne</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Biomass Card */}
          <div 
            onClick={() => setActiveTech('biomass')}
            className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="relative h-24 w-full overflow-hidden bg-slate-900">
              <img
                src={getEngineeringImageUrl(engineeringAssets.generation.biomassPlant)}
                alt="Biomass Power Plant"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <div className="w-6 h-6 rounded-lg bg-emerald-950/90 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
                  <TreePine className="w-3.5 h-3.5" />
                </div>
              </div>
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                Cogénération
              </span>
              <div className="absolute bottom-1.5 left-2 text-[10px] font-mono text-emerald-300 font-semibold">
                EN 12952
              </div>
            </div>

            <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white group-hover:text-emerald-300 transition-colors text-sm">
                  Biomasse & Dérivés
                </h3>
                <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                  Combustion sur lit fluidisé, cogénération vapeur, traitement des fumées et alternateur.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <span>Explorer la Chaîne</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>

      {/* DOMAIN MODULE SWITCHER TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-md">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveMainTab('pillars')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeMainTab === 'pillars'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{locale === 'en' ? '1. The 6 Engineering Pillars' : '1. Les 6 Piliers Fondamentaux'}</span>
          </button>
          <button
            onClick={() => setActiveMainTab('simulator')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeMainTab === 'simulator'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{locale === 'en' ? '2. Power Simulator & Efficiencies' : '2. Simulateur de Puissance & Rendements'}</span>
          </button>
          <button
            onClick={() => setActiveMainTab('cameroon_fleet')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeMainTab === 'cameroon_fleet'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{locale === 'en' ? '3. Cameroon Fleet & National Assets (RIS/RIN)' : '3. Parc National & Actifs Cameroun (RIS/RIN)'}</span>
          </button>
          <button
            onClick={() => setActiveMainTab('infographics')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeMainTab === 'infographics'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{locale === 'en' ? '4. Engineering Infographics' : '4. Schémas & Infographies CEI'}</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 text-xs text-slate-500 font-mono">
          <span>Ingénierie D01 • CEI / IEEE / SONATREL</span>
        </div>
      </div>

      {/* VIEW 1: THE 6 MAJOR SECTIONS OF ENERGY PRODUCTION */}
      {activeMainTab === 'pillars' && (
        <div className="space-y-6">
          {/* Visual Engineering Infographic Reference */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setInfographicSubTab('how_power_generation_works')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  infographicSubTab === 'how_power_generation_works'
                    ? 'bg-sky-400 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {locale === 'fr' ? '1. Chaîne de Production' : '1. Power Generation Chain'}
              </button>
              <button
                type="button"
                onClick={() => setInfographicSubTab('main_types_of_power_generation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  infographicSubTab === 'main_types_of_power_generation'
                    ? 'bg-sky-400 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {locale === 'fr' ? '2. Typologies de Centrales' : '2. Generation Typologies'}
              </button>
              <button
                type="button"
                onClick={() => setInfographicSubTab('thermal_power_plant_energy_conversion')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  infographicSubTab === 'thermal_power_plant_energy_conversion'
                    ? 'bg-sky-400 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {locale === 'fr' ? '3. Cycle Thermique (Rankine)' : '3. Thermal Cycle'}
              </button>
            </div>

            <EngineeringInfographicCard
              infographicId={infographicSubTab}
              locale={locale}
              onOpenModal={(id) => setModalInfographicId(id)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-400">
                {locale === 'en' ? 'Core Engineering Framework' : 'Cadre d\'Ingénierie Fondamental'}
              </span>
              <h2 className="text-2xl font-bold text-white">
                {locale === 'en' ? 'The 6 Pillars of Power Generation' : 'Les 6 Piliers de la Production d\'Énergie'}
              </h2>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {locale === 'en' ? 'Select a section to explore core concepts and equations' : 'Sélectionnez une section pour examiner ses concepts et équations clés'}
            </div>
          </div>

          {/* 6 Section Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PRODUCTION_MAJOR_SECTIONS.map((sec) => {
              const Icon = SECTION_ICONS[sec.icon] || Zap;
              const isSelected = sec.number === selectedSectionNumber;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSectionNumber(sec.number)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-28 ${
                    isSelected
                      ? 'bg-sky-950/90 border-sky-500 shadow-md shadow-sky-500/20 text-white'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      isSelected ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {sec.number}
                    </span>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold leading-tight line-clamp-2">
                    {locale === 'en' ? sec.titleEn : sec.titleFr}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Section Deep-Dive Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-950 border border-sky-600/40 flex items-center justify-center text-sky-400 shrink-0">
                  <SectionIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700">
                    {locale === 'en' ? `Section ${selectedSection.number} • ${selectedSection.subtitleEn}` : `Section ${selectedSection.number} • ${selectedSection.subtitleFr}`}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {locale === 'en' ? selectedSection.titleEn : selectedSection.titleFr}
                  </h3>
                  <p className="text-xs text-slate-400 italic">
                    {locale === 'en' ? selectedSection.titleFr : selectedSection.titleEn}
                  </p>
                </div>
              </div>

              {selectedSection.number === 4 && (
                <button
                  onClick={() => setActiveTech('hydro')}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-sky-600/20 shrink-0"
                >
                  <span>{locale === 'en' ? 'Open Hydropower Environment' : 'Accéder à l\'Environnement Hydro'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
              {locale === 'en' ? selectedSection.introEn : selectedSection.introFr}
            </p>

            {/* Section Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedSection.items.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-white text-sm">
                        {locale === 'en' ? item.titleEn : item.titleFr}
                      </h4>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-sky-950 text-sky-300 border border-sky-800/60 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {locale === 'en' ? item.descriptionEn : item.descriptionFr}
                    </p>
                  </div>

                  {item.equation && (
                    <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
                      {item.equation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PRODUCTION POWER CALCULATOR */}
      {activeMainTab === 'simulator' && (
        <ProductionPowerCalculator locale={locale} />
      )}

      {/* VIEW 3: CAMEROON GENERATION FLEET */}
      {activeMainTab === 'cameroon_fleet' && (
        <CameroonFleetExplorer locale={locale} />
      )}

      {/* VIEW 4: DEDICATED ENGINEERING INFOGRAPHICS & POSTERS */}
      {activeMainTab === 'infographics' && (
        <div className="space-y-6">
          <EngineeringInfographicsGallerySection
            locale={locale}
            filterCategory="GENERATION"
            title={locale === 'fr' ? 'Schémas et Infographies CEI - Production Électrique' : 'IEC Engineering Infographics - Power Generation'}
            subtitle={locale === 'fr' ? 'Diagrammes électromécaniques haute précision : conversion d\'énergie, thermodynamique, et technologies de centrales.' : 'High-precision electromechanical diagrams: energy conversion, thermodynamics, and power station architectures.'}
          />
        </div>
      )}

        </main>
      </div>

      {/* Fullscreen Engineering Infographics Modal */}
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
