// src/components/grid/CameroonGridView.tsx
// EPEDE Layer 05 (Applications & Reference Cases) - Cameroon Power System Observatory
// Comprehensive interactive registry of RIS, RIN, Interconnections, Hydro/Thermal generation plants,
// 225/90/30 kV substations, dispatching governance (SONATREL, Eneo, EDC, ARSEL)

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CAMEROON_GRID_SUMMARY, 
  CAMEROON_POWER_PLANTS, 
  CAMEROON_SUBSTATIONS, 
  CAMEROON_TRANSMISSION_CORRIDORS,
  PowerPlantNode,
  SubstationNode,
  TransmissionCorridor
} from '../../data/cameroonGridData';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import type { SldTopologyType } from '../diagrams/modules/SldHeaderToolbar';
import type { InjectedCalculatorContext } from '../../services/routerService';
import { CameroonContractualDemarcationViewer } from './CameroonContractualDemarcationViewer';
import { MultiDisciplinaryInterfaceMatrixViewer } from './MultiDisciplinaryInterfaceMatrixViewer';
import { InteractiveCameroonGridMap } from './InteractiveCameroonGridMap';
import { RealCameroonGeographicMap } from './RealCameroonGeographicMap';
import { SubstationBatchComplianceModal } from '../diagrams/modules/SubstationBatchComplianceModal';
import type { SubstationSimulationSnapshot } from '../../services/substationBatchComplianceService';
import { PageHeader, DataStrip, FinalCTA } from '../common';
import { 
  Globe, 
  Zap, 
  Activity, 
  Layers, 
  ShieldCheck, 
  Calculator, 
  Download, 
  Search, 
  Building2, 
  Compass, 
  ExternalLink,
  Cpu,
  Flame,
  Droplets,
  Sun,
  MapPin,
  ArrowRight,
  Scale,
  Waves,
  FileText,
  Radio,
  Box,
  Factory,
  Sparkles,
  Gauge
} from 'lucide-react';
import { SanagaHydrometCascadeWorkbench } from './modules/SanagaHydrometCascadeWorkbench';
import { NationalScadaDispatchingCockpit } from './modules/NationalScadaDispatchingCockpit';
import { CameroonGridContingencySimulator } from './modules/CameroonGridContingencySimulator';
import { RegionalInterconnectionPirectWorkbench } from './modules/RegionalInterconnectionPirectWorkbench';
import { IndustrialOfftakersMatrixViewer } from './modules/IndustrialOfftakersMatrixViewer';
import { Substation3DFlyoverWorkbench } from './modules/Substation3DFlyoverWorkbench';
import { ContractualGovernanceFlowViewer } from './modules/ContractualGovernanceFlowViewer';
import { GenerationMasterPlan2035Workbench } from './modules/GenerationMasterPlan2035Workbench';
import { CameroonGridBriefingPdfService } from './services/CameroonGridBriefingPdfService';
import { CameroonPowerFlowJourney } from './modules/CameroonPowerFlowJourney';
import { CameroonSubstationArchitectureExplorer } from './modules/CameroonSubstationArchitectureExplorer';
import { CameroonDistributionNetworkViewer } from './modules/CameroonDistributionNetworkViewer';
import { CameroonGenerationPortfolioVisualizer } from './modules/CameroonGenerationPortfolioVisualizer';
import { CameroonTransmissionEngineeringVisualizer } from './modules/CameroonTransmissionEngineeringVisualizer';
import { CameroonSeasonalReliabilityWorkbench } from './modules/CameroonSeasonalReliabilityWorkbench';
import {
  CameroonInstitutionalGovernanceViewer,
  CameroonGridTimelineViewer,
  CameroonEngineeringReferenceDatabase,
  CameroonTechnicalSourcesLibrary,
} from './modules/CameroonReferenceEncyclopediaModules';

export type FilterCategory = 
  | 'map' 
  | 'seasonal_reliability'
  | 'overview_journey'
  | 'scada_dispatching'
  | 'sanaga_cascade'
  | 'contingency_n1'
  | 'pirect_interconnexion'
  | 'industrial_offtakers'
  | 'substation_3d_bim'
  | 'substation_architectures'
  | 'distribution_hta_bt'
  | 'governance_loi2011'
  | 'institutions_matrix'
  | 'history_timeline'
  | 'masterplan_2035'
  | 'apparatus_encyclopedia'
  | 'sources_library'
  | 'all' 
  | 'ris' 
  | 'rin' 
  | 'plants' 
  | 'substations' 
  | 'lines' 
  | 'demarcation';

interface CameroonGridViewProps {
  locale: 'fr' | 'en';
  initialCategory?: FilterCategory;
  onNavigateCalculator?: (tab: CalculatorTabType, context?: InjectedCalculatorContext) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
  onNavigateDiagram?: (topology?: SldTopologyType | 'double-bus' | 'ais-gis-hybrid' | 'generator-stepup' | string) => void;
  onNavigateEquipment?: (id: string) => void;
  onNavigateStandards?: () => void;
  onNavigateRegulatory?: () => void;
  onNavigateContextStack?: (nodeId?: string) => void;
  onNavigateHydropower?: () => void;
}

export const CameroonGridView: React.FC<CameroonGridViewProps> = ({
  locale,
  initialCategory,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateDiagram,
  onNavigateEquipment,
  onNavigateStandards,
  onNavigateRegulatory,
  onNavigateContextStack,
  onNavigateHydropower,
}) => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>(initialCategory || 'map');
  const [complianceModalData, setComplianceModalData] = useState<{
    topology: SldTopologyType;
    snapshot: SubstationSimulationSnapshot;
  } | null>(null);

  React.useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlant, setSelectedPlant] = useState<PowerPlantNode | null>(CAMEROON_POWER_PLANTS[0]);
  const [selectedSubstation, setSelectedSubstation] = useState<SubstationNode | null>(CAMEROON_SUBSTATIONS[0]);
  const [demarcationSubTab, setDemarcationSubTab] = useState<'disciplines_matrix' | 'contractual_gate3'>('disciplines_matrix');
  const [mapDisplayMode, setMapDisplayMode] = useState<'real_geo' | 'topological_sld'>('real_geo');
  const [selectedContingencyScenarioId, setSelectedContingencyScenarioId] = useState<string | undefined>(undefined);
  const [selectedSeasonalPlantId, setSelectedSeasonalPlantId] = useState<string | undefined>(undefined);

  // Filtered Plants
  const filteredPlants = useMemo(() => {
    return CAMEROON_POWER_PLANTS.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(q) ||
        p.name_en.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.operator.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (activeCategory === 'all' || activeCategory === 'plants') return true;
      if (activeCategory === 'ris') return p.grid_system === 'RIS';
      if (activeCategory === 'rin') return p.grid_system === 'RIN';
      return false;
    });
  }, [searchQuery, activeCategory]);

  // Filtered Substations
  const filteredSubstations = useMemo(() => {
    return CAMEROON_SUBSTATIONS.filter(s => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery.trim() || 
        s.name.toLowerCase().includes(q) ||
        s.name_en.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.voltage_levels.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (activeCategory === 'all' || activeCategory === 'substations') return true;
      if (activeCategory === 'ris') return s.grid_system === 'RIS';
      if (activeCategory === 'rin') return s.grid_system === 'RIN';
      return false;
    });
  }, [searchQuery, activeCategory]);

  // Filtered Corridors
  const filteredCorridors = useMemo(() => {
    return CAMEROON_TRANSMISSION_CORRIDORS.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery.trim() || 
        c.name.toLowerCase().includes(q) ||
        c.name_en.toLowerCase().includes(q) ||
        c.from_substation.toLowerCase().includes(q) ||
        c.to_substation.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (activeCategory === 'all' || activeCategory === 'lines') return true;
      if (activeCategory === 'ris') return c.grid_system === 'RIS';
      if (activeCategory === 'rin') return c.grid_system === 'RIN';
      return false;
    });
  }, [searchQuery, activeCategory]);

  // Export Dossier
  const handleExportGridData = () => {
    const reportDate = new Date().toISOString();
    const payload = {
      title: 'EPEDE - Cameroon National Electrical Power System Observatory (Verified Public Data & Engineering Reference Models)',
      generated_at: reportDate,
      summary: CAMEROON_GRID_SUMMARY,
      power_plants: CAMEROON_POWER_PLANTS,
      substations: CAMEROON_SUBSTATIONS,
      transmission_lines: CAMEROON_TRANSMISSION_CORRIDORS
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EPEDE_Cameroon_Power_System_Dossier_${reportDate.split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.appendChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 pb-24 font-sans text-[#0B1B2B]">
      {/* 1. Page Header */}
      <PageHeader
        eyebrow={
          locale === 'fr'
            ? 'L05 · RÉSEAU NATIONAL DU CAMEROUN'
            : 'L05 · CAMEROON POWER NETWORK EXPLORER'
        }
        title={
          locale === 'fr'
            ? 'Observatoire du Réseau Électrique Camerounais'
            : 'Cameroon Power Network Explorer'
        }
        intro={
          locale === 'fr'
            ? "Cartographie technique approfondie des réseaux interconnectés Sud (RIS 225/90 kV) et Nord (RIN 110/90 kV), des grands aménagements hydroélectriques (Nachtigal 420 MW, Songloulou 384 MW, Édéa 276 MW, Memve'ele 211 MW, Lom Pangar 30 MW), des postes sources et des artères de transport HTB."
            : "Research-based engineering exploration of Cameroon's Southern Interconnected Grid (RIS 225/90 kV) and Northern Interconnected Grid (RIN 110/90 kV), major hydropower & thermal plants (Nachtigal 420 MW, Songloulou 384 MW, Edéa 276 MW, Memve'ele 211 MW, Kribi 216 MW), strategic substations, and transmission corridors."
        }
      />

      {/* 2. Normative Grid Metrics Data Strip */}
      <DataStrip
        items={[
          {
            label: locale === 'fr' ? 'Puissance Installée (2024–2025)' : 'Installed Capacity (2024–2025)',
            value: `${CAMEROON_GRID_SUMMARY.national_installed_capacity_mw} MW`,
            subtext: `${CAMEROON_GRID_SUMMARY.hydro_share_percent}% Hydro · ${CAMEROON_GRID_SUMMARY.thermal_gas_share_percent}% ${locale === 'fr' ? 'Gaz' : 'Gas'}`,
          },
          {
            label: locale === 'fr' ? 'Pointe Maximale' : 'Peak Demand',
            value: `${CAMEROON_GRID_SUMMARY.peak_demand_mw} MW`,
            subtext: locale === 'fr' ? 'Marge de réserve : ~30%' : 'Reserve margin: ~30%',
          },
          {
            label: locale === 'fr' ? 'Réseau Transport 225 kV' : '225 kV Transmission',
            value: `${CAMEROON_GRID_SUMMARY.transmission_line_km_225kv} km`,
            subtext: `+ ${CAMEROON_GRID_SUMMARY.transmission_line_km_90kv} km (90/110 kV)`,
          },
          {
            label: locale === 'fr' ? 'Opérateur Système TSO' : 'Transmission Operator',
            value: 'SONATREL',
            subtext: locale === 'fr' ? 'Dispatching Mangombé' : 'Mangombé Dispatch',
          },
        ]}
      />

      {/* 3. Actions & Research Integrity Toolbar */}
      <div className="bg-[#FBFCFD] border border-[#D5E0E8] rounded-[6px] p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-1 rounded-[3px] bg-[#EEF4F8] text-[#5B6B7B] border border-[#D5E0E8]">
              SONATREL · Eneo · EDC · ARSEL · NHPC
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onNavigateContextStack && (
              <button
                type="button"
                onClick={() => onNavigateContextStack('node-line-225-bekoko')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#FBFCFD] hover:border-[#1F5FAE] text-[#0B1B2B] border border-[#D5E0E8] text-xs font-mono font-semibold transition-all cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 text-[#F2A541]" />
                <span>{locale === 'fr' ? 'Épine Dorsale & TCC' : 'Spine & TCC Stack'}</span>
              </button>
            )}

            {onNavigateRegulatory && (
              <button
                type="button"
                onClick={onNavigateRegulatory}
                className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#FBFCFD] hover:border-[#1F5FAE] text-[#0B1B2B] border border-[#D5E0E8] text-xs font-mono font-semibold transition-all cursor-pointer"
              >
                <Scale className="h-3.5 w-3.5 text-[#1F5FAE]" />
                <span>{locale === 'fr' ? 'Cadre Réglementaire L06' : 'Regulatory Framework L06'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => CameroonGridBriefingPdfService.generateExecutiveBriefingPdf()}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] bg-[#1F5FAE] hover:bg-[#174A88] text-white text-xs font-mono font-semibold transition-all shadow-xs cursor-pointer"
              title={
                locale === 'fr'
                  ? 'Générer & Télécharger le Dossier Exécutif A4 Officiel du Réseau Camerounais (PDF Vectoriel)'
                  : 'Generate & Download Official Cameroon Grid Executive Briefing A4 Dossier (Vector PDF)'
              }
            >
              <FileText className="h-3.5 w-3.5 text-white" />
              <span>{locale === 'fr' ? 'Dossier Exécutif PDF (A4)' : 'Executive Dossier PDF (A4)'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportGridData}
              className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#0B1B2B] hover:bg-[#1F5FAE] text-[#FBFCFD] text-xs font-mono font-semibold transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Exporter JSON' : 'Export Grid JSON'}</span>
            </button>
          </div>
        </div>

        {/* Research Integrity & Provenance Notice */}
        <div className="p-3 rounded-[4px] bg-[#EEF4F8] border border-[#D5E0E8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2 text-xs text-[#3A4B5C]">
            <ShieldCheck className="h-4 w-4 text-[#1F5FAE] shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong className="text-[#0B1B2B] font-mono uppercase">
                {locale === 'fr' ? 'Intégrité des Données & Provenance : ' : 'Research Integrity & Source Provenance: '}
              </strong>
              {locale === 'fr'
                ? 'Les puissances installées, niveaux de tension et exploitants proviennent des publications officielles publiques (ARSEL, SONATREL, Eneo, EDC, NHPC, Banque Mondiale).'
                : 'Installed capacities, voltage levels, and operators are verified from public institutional records (ARSEL, SONATREL, Eneo, EDC, NHPC, World Bank).'}
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] bg-[#1F5FAE]/10 text-[#1F5FAE] border border-[#1F5FAE]/30 shrink-0">
            {locale === 'fr' ? 'VÉRIFIÉ 2024–2025' : 'VERIFIED 2024–2025'}
          </span>
        </div>
      </div>

      {/* Cockpit Strategic Navigation Tabs */}
      <div className="bg-[#FFFDF9] border border-[#DEDACF] rounded-2xl p-4 shadow-sm space-y-3">
        {/* Row 1: Advanced Operational Workbenches (9 Strategic Pillars) */}
        <div className="flex items-center justify-between pb-2 border-b border-[#DEDACF]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#147C78]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#17282C]">
              {locale === 'fr' ? 'Modules Stratégiques de l\'Observatoire National' : 'National Power System Strategic Workbenches'}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#147C78] bg-[#E3EFEC] px-2 py-0.5 rounded border border-[#147C78]/30">
            {locale === 'fr' ? '10 Piliers Déployés' : '10 Strategic Workbenches'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {[
            { id: 'map', icon: Compass, labelFr: 'Carte WGS84 SIG', labelEn: 'GIS Map WGS84' },
            { id: 'seasonal_reliability', icon: Droplets, labelFr: 'Production Saisonnière & Fiabilité (Jan–Déc)', labelEn: 'Seasonal Generation & Grid Reliability' },
            { id: 'scada_dispatching', icon: Gauge, labelFr: 'Dispatching Mangombé 50Hz', labelEn: 'Mangombé Dispatching 50Hz' },
            { id: 'sanaga_cascade', icon: Waves, labelFr: 'Cascade Sanaga & Lom Pangar', labelEn: 'Sanaga Cascade & Lom Pangar' },
            { id: 'contingency_n1', icon: ShieldCheck, labelFr: 'Simulateur N-1 & Incidents', labelEn: 'N-1 Contingency Lab' },
            { id: 'pirect_interconnexion', icon: Globe, labelFr: 'Interconnexion & PIRECT Tchad', labelEn: 'Interconnection & Chad PIRECT' },
            { id: 'industrial_offtakers', icon: Factory, labelFr: 'Grands Comptes HT-B & PPA', labelEn: 'Industrial Offtakers & PPA' },
            { id: 'substation_3d_bim', icon: Box, labelFr: 'Jumeaux 3D Postes HT', labelEn: '3D Substation Digital Twins' },
            { id: 'governance_loi2011', icon: Scale, labelFr: 'Loi 2011 & Flux Financiers', labelEn: 'Law 2011 & Financial Flows' },
            { id: 'masterplan_2035', icon: Sparkles, labelFr: 'Master Plan 2035 (Kikot, Eweng)', labelEn: 'Master Plan 2035' },
            { id: 'demarcation', icon: Scale, labelFr: 'Frontières Porte 3', labelEn: 'Gate 3 Demarcation' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveCategory(item.id as FilterCategory)}
                className={`px-3 py-1.5 rounded-xl transition-all font-bold flex items-center gap-1.5 cursor-pointer border ${
                  isActive
                    ? 'bg-[#147C78] text-white border-[#147C78] shadow-sm'
                    : 'bg-[#F6F4EE] text-[#33474B] border-[#DEDACF] hover:text-[#17282C] hover:border-[#147C78]/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? item.labelFr : item.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2: 12-Section Reference Centre Navigation & Search Filter */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-3 border-t border-[#DEDACF]">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
            <span className="text-[#5C6C70] mr-1 uppercase font-bold">{locale === 'fr' ? 'Centre de Référence :' : 'Reference Centre:'}</span>
            {[
              { id: 'overview_journey', label: locale === 'fr' ? 'Parcours 7 Étapes' : '7-Stage Power Flow' },
              { id: 'all', label: locale === 'fr' ? 'Tout le Parc' : 'All Grid' },
              { id: 'ris', label: 'RIS (Sud 225/90)' },
              { id: 'rin', label: 'RIN (Nord 110)' },
              { id: 'plants', label: locale === 'fr' ? 'Centrales (18)' : 'Plants (18)' },
              { id: 'substations', label: locale === 'fr' ? 'Postes HT (17)' : 'Substations (17)' },
              { id: 'substation_architectures', label: locale === 'fr' ? 'Schémas Jeux de Barres' : 'Busbar SLD Topologies' },
              { id: 'lines', label: locale === 'fr' ? 'Lignes HTB (14)' : 'HV Corridors (14)' },
              { id: 'distribution_hta_bt', label: locale === 'fr' ? 'Distribution HTA/BT (30/15 kV)' : 'MV/LV Distribution (30/15 kV)' },
              { id: 'institutions_matrix', label: locale === 'fr' ? 'Institutions & Gouvernance' : 'Institutions & Governance' },
              { id: 'history_timeline', label: locale === 'fr' ? 'Chronologie 1953–2035' : 'Timeline 1953–2035' },
              { id: 'apparatus_encyclopedia', label: locale === 'fr' ? 'Encyclopédie Appareillages' : 'Apparatus Encyclopedia' },
              { id: 'sources_library', label: locale === 'fr' ? 'Lois & Sources Officielles' : 'Laws & Official Sources' },
            ].map(subTab => (
              <button
                key={subTab.id}
                type="button"
                onClick={() => setActiveCategory(subTab.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-all font-bold cursor-pointer border ${
                  activeCategory === subTab.id
                    ? 'bg-[#17282C] text-white border-[#17282C] shadow-xs'
                    : 'bg-[#F6F4EE] text-[#5C6C70] border-[#DEDACF] hover:text-[#17282C]'
                }`}
              >
                {subTab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 text-[#5C6C70] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'fr' ? 'Rechercher centrale, poste...' : 'Search plant, station...'}
              className="w-full bg-[#F6F4EE] text-xs font-mono text-[#17282C] placeholder-[#5C6C70] pl-9 pr-3 py-1.5 rounded-lg border border-[#DEDACF] focus:outline-none focus:border-[#147C78]"
            />
          </div>
        </div>
      </div>

      {/* Dedicated Dark Technical Workbench Container for Active GIS / Engineering Views */}
      <div className="epede-workbench rounded-2xl p-4 sm:p-6 shadow-md space-y-6">

      {/* SECTION: Interactive GIS / SLD Hybrid Map */}
      {activeCategory === 'map' && (
        <div className="space-y-4">
          {/* Sub-selector for Real Vector Map vs Orthogonal Topological SLD */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#0D1117] border border-slate-800 shadow-md">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMapDisplayMode('real_geo')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  mapDisplayMode === 'real_geo'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? '1. Carte Vectorielle Réelle WGS84 (10 Régions & Fleuves)' : '1. Real Geographic WGS84 Map (10 Regions & Rivers)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setMapDisplayMode('topological_sld')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  mapDisplayMode === 'topological_sld'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? '2. Schéma Topologique Unifilaire (SLD Orthogonal)' : '2. Orthogonal Topological SLD Schematic'}</span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 pr-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>{locale === 'fr' ? 'Simulation Flux Dynamiques MW' : 'Live MW Power Flow Simulation'}</span>
            </div>
          </div>

          {mapDisplayMode === 'real_geo' ? (
            <RealCameroonGeographicMap
              locale={locale}
              onNavigateDiagram={onNavigateDiagram}
              onNavigateCalculator={onNavigateCalculator}
              onNavigateSimulation={onNavigateSimulation}
              onNavigateEquipment={onNavigateEquipment}
            />
          ) : (
            <InteractiveCameroonGridMap
              locale={locale}
              onNavigateDiagram={onNavigateDiagram}
              onNavigateCalculator={onNavigateCalculator}
              onNavigateSimulation={onNavigateSimulation}
              onSelectCategory={(category, scenarioId) => {
                if (category === 'contingency_n1') {
                  if (scenarioId) setSelectedContingencyScenarioId(scenarioId);
                  setActiveCategory('contingency_n1');
                } else {
                  setActiveCategory(category as FilterCategory);
                }
              }}
            />
          )}
        </div>
      )}

      {/* SECTION: Cameroon Demarcation & Multidisciplinary Interface Matrix */}
      {activeCategory === 'demarcation' && (
        <div className="space-y-4">
          {/* Sub-selector for Demarcation / Interface Matrix */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#0D1117] border border-[#252E38]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDemarcationSubTab('disciplines_matrix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  demarcationSubTab === 'disciplines_matrix'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {locale === 'fr' ? '1. Matrice des 8 Métiers & Frontières Réseau' : '1. 8 Disciplines & Utility Demarcation Matrix'}
              </button>

              <button
                type="button"
                onClick={() => setDemarcationSubTab('contractual_gate3')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  demarcationSubTab === 'contractual_gate3'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {locale === 'fr' ? '2. Conventions & Réglementation Porte 3 (TURPE)' : '2. Porte 3 Legal Demarcation & TURPE'}
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              {demarcationSubTab === 'disciplines_matrix'
                ? (locale === 'fr' ? 'Passations inter-disciplines & SONATREL / ENEO / IPPs' : 'Inter-discipline handovers & utility boundaries')
                : (locale === 'fr' ? 'Frontières physiques, litiges & responsabilités réseau' : 'Physical boundaries, dispute allocation & grid liabilities')}
            </span>
          </div>

          {demarcationSubTab === 'disciplines_matrix' ? (
            <MultiDisciplinaryInterfaceMatrixViewer
              locale={locale}
              embedded={true}
              onNavigateCalculator={onNavigateCalculator}
              onNavigateSimulation={onNavigateSimulation}
              onNavigateDiagram={onNavigateDiagram}
              onNavigateStandards={onNavigateStandards}
              onNavigateRegulatory={onNavigateRegulatory}
              onNavigateHydropower={onNavigateHydropower}
            />
          ) : (
            <CameroonContractualDemarcationViewer locale={locale} embedded={true} />
          )}
        </div>
      )}

      {/* SECTION: SCADA Dispatching Cockpit (Step 2) */}
      {activeCategory === 'scada_dispatching' && (
        <div className="space-y-4">
          <NationalScadaDispatchingCockpit locale={locale} />
        </div>
      )}

      {/* SECTION: Sanaga Hydromet Cascade Workbench (Step 1) */}
      {activeCategory === 'sanaga_cascade' && (
        <div className="space-y-4">
          <SanagaHydrometCascadeWorkbench locale={locale} />
        </div>
      )}

      {/* SECTION: Seasonal Generation, Hydrological Variations & Power Supply Reliability */}
      {activeCategory === 'seasonal_reliability' && (
        <div className="space-y-4">
          <CameroonSeasonalReliabilityWorkbench
            locale={locale}
            initialPlantId={selectedSeasonalPlantId}
          />
        </div>
      )}

      {/* SECTION: Cameroon Grid Contingency Simulator (Step 3) */}
      {activeCategory === 'contingency_n1' && (
        <div className="space-y-4">
          <CameroonGridContingencySimulator
            locale={locale}
            initialScenarioId={selectedContingencyScenarioId}
            onNavigateSimulation={onNavigateSimulation}
            onNavigateCalculator={onNavigateCalculator}
          />
        </div>
      )}

      {/* SECTION: Regional Interconnection & PIRECT Chad Export Hub (Step 4) */}
      {activeCategory === 'pirect_interconnexion' && (
        <div className="space-y-4">
          <RegionalInterconnectionPirectWorkbench />
        </div>
      )}

      {/* SECTION: Industrial Heavy Loads & Anchor Offtakers Layer (Step 5) */}
      {activeCategory === 'industrial_offtakers' && (
        <div className="space-y-4">
          <IndustrialOfftakersMatrixViewer />
        </div>
      )}

      {/* SECTION: Interactive 3D Substation BIM / Digital Twin (Step 6) */}
      {activeCategory === 'substation_3d_bim' && (
        <div className="space-y-4">
          <Substation3DFlyoverWorkbench />
        </div>
      )}

      {/* SECTION: Contractual Flow & Institutional Governance Matrix (Step 7) */}
      {activeCategory === 'governance_loi2011' && (
        <div className="space-y-4">
          <ContractualGovernanceFlowViewer />
        </div>
      )}

      {/* SECTION: Horizon 2030-2035 Generation Master Plan Pipeline (Step 8) */}
      {activeCategory === 'masterplan_2035' && (
        <div className="space-y-4">
          <GenerationMasterPlan2035Workbench />
        </div>
      )}

      {/* SECTION: 7-Stage Power Flow Journey (Overview & All Grid) */}
      {(activeCategory === 'overview_journey' || activeCategory === 'all') && (
        <div className="space-y-4">
          <CameroonPowerFlowJourney locale={locale} />
        </div>
      )}

      {/* SECTION: Substation Busbar Topologies & Single-Line Architectures */}
      {(activeCategory === 'substation_architectures' || activeCategory === 'substations') && (
        <div className="space-y-4">
          <CameroonSubstationArchitectureExplorer locale={locale} />
        </div>
      )}

      {/* SECTION: Medium & Low-Voltage Distribution Network (30/15 kV & 400/230 V) */}
      {activeCategory === 'distribution_hta_bt' && (
        <div className="space-y-4">
          <CameroonDistributionNetworkViewer locale={locale} />
        </div>
      )}

      {/* SECTION: Institutional Organization & Governance Matrix (Law 2011/022) */}
      {activeCategory === 'institutions_matrix' && (
        <div className="space-y-6">
          <CameroonInstitutionalGovernanceViewer locale={locale} />
          <ContractualGovernanceFlowViewer />
        </div>
      )}

      {/* SECTION: Historical Evolution Timeline (1953 - 2035) */}
      {activeCategory === 'history_timeline' && (
        <div className="space-y-4">
          <CameroonGridTimelineViewer locale={locale} />
        </div>
      )}

      {/* SECTION: Engineering Apparatus Reference Encyclopedia */}
      {activeCategory === 'apparatus_encyclopedia' && (
        <div className="space-y-4">
          <CameroonEngineeringReferenceDatabase locale={locale} />
        </div>
      )}

      {/* SECTION: Official Laws, Grid Codes & Sourced Documentation Library */}
      {activeCategory === 'sources_library' && (
        <div className="space-y-4">
          <CameroonTechnicalSourcesLibrary locale={locale} />
        </div>
      )}

      {/* SECTION 1: Major Power Generation Plants */}
      {activeCategory !== 'demarcation' && (activeCategory === 'all' || activeCategory === 'plants' || activeCategory === 'ris' || activeCategory === 'rin') && (
        <div className="space-y-6">
          <CameroonGenerationPortfolioVisualizer locale={locale} />
          <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
                {locale === 'fr' ? 'PARC DE PRODUCTION MAJEUR DU CAMEROUN' : 'MAJOR POWER GENERATION FLEET'}
              </h2>
            </div>
            <span className="font-mono text-xs text-neutral-400">
              {filteredPlants.length} {locale === 'fr' ? 'aménagements répertoriés' : 'plants listed'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlants.map((plant) => (
              <div
                key={plant.id}
                className="bg-[#151C1E] border border-[#567A87]/35 hover:border-[#D7A64A]/60 rounded-xl p-5 space-y-3 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#0B0F12] text-[#F4F1E8] border border-[#567A87]/35 flex items-center gap-1">
                      {plant.type === 'hydro' ? <Droplets className="h-3 w-3 text-[#567A87]" /> :
                       plant.type === 'gas_thermal' ? <Flame className="h-3 w-3 text-[#D7A64A]" /> :
                       plant.type === 'solar_pv_bess' ? <Sun className="h-3 w-3 text-[#D7A64A]" /> :
                       <Droplets className="h-3 w-3 text-[#567A87]" />}
                      <span>{plant.type.toUpperCase()}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#0B0F12] text-[#A9ADA5] border border-[#567A87]/30">
                        {plant.grid_system}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#D7A64A] px-2 py-0.5 rounded bg-[#D7A64A]/15 border border-[#D7A64A]/40">
                        {plant.installed_capacity_mw} MW
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-mono text-sm font-black text-[#F4F1E8] leading-snug">
                      {locale === 'fr' ? plant.name : plant.name_en}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#A9ADA5] font-mono mt-1">
                      <MapPin className="h-3 w-3 text-[#D7A64A]" />
                      <span>{plant.location} · {plant.region}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#A9ADA5] line-clamp-3 leading-relaxed">
                    {locale === 'fr' ? plant.key_highlights_fr : plant.key_highlights_en}
                  </p>

                  <div className="pt-2 border-t border-[#567A87]/25 space-y-1 text-[11px] font-mono text-[#F4F1E8]">
                    <div className="flex justify-between gap-2">
                      <span className="text-[#A9ADA5]">{locale === 'fr' ? 'Groupes :' : 'Generating Units:'}</span>
                      <span className="text-right truncate max-w-[200px]">{locale === 'fr' ? plant.units_description : plant.units_description_en}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-[#A9ADA5]">{locale === 'fr' ? 'Source / Rivière :' : 'River / Fuel:'}</span>
                      <span className="text-right truncate max-w-[200px]">{locale === 'fr' ? plant.river_or_fuel : plant.river_or_fuel_en}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-[#A9ADA5]">{locale === 'fr' ? 'Tension d\'évacuation :' : 'Evacuation Voltage:'}</span>
                      <span className="text-[#D7A64A] font-bold">{plant.voltage_kv} kV</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-[#A9ADA5]">{locale === 'fr' ? 'Exploitant :' : 'Operator:'}</span>
                      <span className="truncate max-w-[200px]">{plant.operator}</span>
                    </div>
                  </div>

                  {/* Provenance & Verification Block */}
                  <div className="p-2.5 rounded-lg bg-[#0B0F12] border border-[#567A87]/30 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-[#D7A64A]">
                        {plant.verification_status === 'CONFIRMED_PUBLIC_SOURCE'
                          ? (locale === 'fr' ? 'SOURCE PUBLIQUE VÉRIFIÉE' : 'CONFIRMED PUBLIC SOURCE')
                          : (locale === 'fr' ? 'CHANTIER VÉRIFIÉ' : 'VERIFIED PROJECT')}
                      </span>
                      <span className="font-mono text-[9px] text-[#A9ADA5]">
                        {plant.source_date}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-[#F4F1E8] truncate" title={plant.source_citation}>
                      {plant.source_citation}
                    </div>
                    <p className="text-[10px] text-[#A9ADA5] leading-snug">
                      {locale === 'fr'
                        ? `Domaines liés : ${plant.related_domains.join(', ')}`
                        : `Connected domains: ${plant.related_domains.join(', ')}`}
                    </p>
                  </div>
                </div>

                {/* Computational & Simulation links & Spine */}
                <div className="pt-3 border-t border-[#567A87]/25 flex flex-wrap items-center gap-2">
                  {(plant.type === 'hydro' || plant.type === 'reservoir') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSeasonalPlantId(plant.id);
                        setActiveCategory('seasonal_reliability');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/40 text-[11px] font-mono font-bold transition-all cursor-pointer"
                    >
                      <Droplets className="h-3 w-3 text-teal-300" />
                      <span>
                        {locale === 'fr'
                          ? 'Profil Saisonnier & Hydrologie (Jan–Déc)'
                          : 'Seasonal Profile & Hydrology (Jan–Dec)'}
                      </span>
                    </button>
                  )}
                  {plant.type === 'hydro' && onNavigateHydropower && (
                    <button
                      type="button"
                      onClick={onNavigateHydropower}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-[#D7A64A]/15 hover:bg-[#D7A64A]/25 text-[#D7A64A] border border-[#D7A64A]/40 text-[11px] font-mono font-bold transition-all"
                    >
                      <Waves className="h-3 w-3 text-[#D7A64A]" />
                      <span>{locale === 'fr' ? 'Jumeau Numérique Hydro (24 Étapes)' : 'Hydropower Digital Twin (24 Steps)'}</span>
                    </button>
                  )}
                  {onNavigateContextStack && (
                    <button
                      type="button"
                      onClick={() => onNavigateContextStack('node-gen-g1')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-[#0B0F12] hover:bg-[#567A87]/20 text-[#F4F1E8] border border-[#567A87]/40 text-[11px] font-mono font-bold transition-all"
                    >
                      <Zap className="h-3 w-3 text-[#D7A64A]" />
                      <span>{locale === 'fr' ? 'Épine Dorsale' : 'Spine Node'}</span>
                    </button>
                  )}
                  {plant.relevant_calculator && onNavigateCalculator && (
                    <button
                      type="button"
                      onClick={() => onNavigateCalculator(plant.relevant_calculator!)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-[#0B0F12] hover:bg-[#567A87]/20 text-[#D7A64A] border border-[#D7A64A]/35 text-[11px] font-mono font-bold transition-all"
                    >
                      <Calculator className="h-3 w-3" />
                      <span>{locale === 'fr' ? 'Calculateur' : 'Calculator'}</span>
                    </button>
                  )}
                  {plant.relevant_simulation && onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation(plant.relevant_simulation!)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-[#0B0F12] hover:bg-[#567A87]/20 text-[#F4F1E8] border border-[#567A87]/40 text-[11px] font-mono font-bold transition-all"
                    >
                      <Zap className="h-3 w-3 text-[#567A87]" />
                      <span>{locale === 'fr' ? 'Simulateur' : 'Simulation'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: Strategic 225/90/30 kV Substations */}
      {activeCategory !== 'demarcation' && (activeCategory === 'all' || activeCategory === 'substations' || activeCategory === 'ris' || activeCategory === 'rin') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-[#567A87]/30 pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#D7A64A]" />
              <h2 className="font-mono text-sm font-black uppercase tracking-wider text-[#F4F1E8]">
                {locale === 'fr' ? 'POSTES STRATÉGIQUES DE TRANSPORT 225/90/30 kV' : 'STRATEGIC 225/90/30 kV SUBSTATIONS'}
              </h2>
            </div>
            <span className="font-mono text-xs text-[#A9ADA5]">
              {filteredSubstations.length} {locale === 'fr' ? 'nœuds répertoriés' : 'nodes listed'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSubstations.map((sub) => (
              <div
                key={sub.id}
                className="bg-[#151C1E] border border-[#567A87]/35 hover:border-[#D7A64A]/60 rounded-xl p-5 space-y-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-[#D7A64A] px-2 py-0.5 rounded bg-[#D7A64A]/15 border border-[#D7A64A]/40">
                      {sub.code}
                    </span>
                    <span className="font-mono text-xs text-[#F4F1E8] font-bold">
                      {sub.voltage_levels}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold text-[#A9ADA5] px-2 py-0.5 rounded bg-[#0B0F12] border border-[#567A87]/35">
                    {sub.operator}
                  </span>
                </div>

                <div>
                  <h3 className="font-mono text-base font-black text-[#F4F1E8]">
                    {locale === 'fr' ? sub.name : sub.name_en}
                  </h3>
                  <div className="text-xs text-[#A9ADA5] font-mono mt-0.5">
                    {sub.city} · {locale === 'fr' ? `Région du ${sub.region}` : `${sub.region} Region`}
                  </div>
                </div>

                <p className="text-xs text-[#A9ADA5] leading-relaxed">
                  {locale === 'fr' ? sub.function_description_fr : sub.function_description_en}
                </p>

                <div className="p-3 rounded-lg bg-[#0B0F12] border border-[#567A87]/30 space-y-1.5 text-[11px] font-mono text-[#F4F1E8]">
                  <div className="flex justify-between">
                    <span className="text-[#A9ADA5]">{locale === 'fr' ? 'Puissance Installée MVA :' : 'Installed MVA:'}</span>
                    <span className="text-[#F4F1E8] font-bold">{sub.transformer_capacity_mva}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A9ADA5]">{locale === 'fr' ? 'Niveau de Court-Circuit (Modèle) :' : 'Short-Circuit Level (Ref. Model):'}</span>
                    <span className="text-[#D7A64A] font-bold">{sub.short_circuit_level_ka}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A9ADA5]">{locale === 'fr' ? 'Topologie :' : 'Bus Topology:'}</span>
                    <span className="text-[#F4F1E8] uppercase">{sub.bus_topology}</span>
                  </div>
                </div>

                {/* Connected lines */}
                <div className="space-y-1 pt-1">
                  <span className="font-mono text-[10px] uppercase text-[#A9ADA5] font-bold">
                    {locale === 'fr' ? 'Artères & Lignes raccordées :' : 'Connected Lines & Feeders:'}
                  </span>
                  <ul className="space-y-1 font-mono text-[11px] text-[#F4F1E8]">
                    {(locale === 'fr' ? sub.connected_lines : sub.connected_lines_en).map((l, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <ArrowRight className="h-3 w-3 text-[#D7A64A] shrink-0" />
                        <span className="truncate">{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Provenance & Verification Block */}
                <div className="p-2.5 rounded-lg bg-[#0B0F12] border border-[#567A87]/30 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-[#D7A64A]">
                      {locale === 'fr' ? 'SOURCE PUBLIQUE + MODÈLE ÉLECTROTECHNIQUE' : 'CONFIRMED NODE + ENGINEERING MODEL'}
                    </span>
                    <span className="font-mono text-[9px] text-[#A9ADA5]">
                      {sub.source_date}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-[#F4F1E8] truncate" title={sub.source_citation}>
                    {sub.source_citation}
                  </div>
                  <p className="text-[10px] text-[#A9ADA5] leading-snug">
                    {locale === 'fr' ? sub.engineering_note_fr : sub.engineering_note_en}
                  </p>
                </div>

                {/* Direct link to SLD CAD Schematic, Spine & Transformer Calculator */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {onNavigateContextStack && (
                    <button
                      type="button"
                      onClick={() => onNavigateContextStack(sub.code.includes('OYO') ? 'node-trafo-main-30' : sub.code.includes('MAN') ? 'node-trafo-gsu' : 'node-line-225-bekoko')}
                      className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#0B0F12] hover:bg-[#567A87]/20 text-[#F4F1E8] border border-[#567A87]/40 text-xs font-mono font-bold transition-all"
                    >
                      <Zap className="h-3.5 w-3.5 text-[#D7A64A]" />
                      <span>{locale === 'fr' ? 'Épine & TCC' : 'Spine & TCC'}</span>
                    </button>
                  )}
                  {sub.associated_diagram_topology && onNavigateDiagram && (
                    <button
                      type="button"
                      onClick={() => onNavigateDiagram(sub.associated_diagram_topology)}
                      className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#0B0F12] hover:bg-[#567A87]/20 text-[#D7A64A] border border-[#D7A64A]/40 text-xs font-mono font-bold transition-all"
                    >
                      <Activity className="h-3.5 w-3.5 text-[#D7A64A]" />
                      <span>{locale === 'fr' ? 'Schéma SLD' : 'Inspect SLD'}</span>
                    </button>
                  )}

                  {/* One-Click Batch Substation Compliance Audit Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const topo: SldTopologyType = 
                        sub.associated_diagram_topology === 'ais-gis-hybrid' ? 'breaker_and_half' :
                        sub.bus_topology?.toLowerCase().includes('simple') ? 'single_bus' :
                        'double_bus';

                      const mvaVal = parseFloat(sub.transformer_capacity_mva) || 63;
                      const scKa = parseFloat(sub.short_circuit_level_ka) || 31.5;
                      const uHv = sub.voltage_levels.includes('225') ? 225 : 90;

                      setComplianceModalData({
                        topology: topo,
                        snapshot: {
                          u_hv_nom: uHv,
                          u_mv_nom: sub.voltage_levels.includes('30') ? 30 : 15,
                          activeLoadMw: Math.round(mvaVal * 0.75 * 10) / 10,
                          gridScMva: Math.round(Math.sqrt(3) * uHv * scKa),
                          isLineEnergized: true,
                          isBus225Energized: true,
                          isTrafoEnergized: true,
                          isBus30Energized: true,
                          isBusA_Energized: true,
                          isBusB_Energized: true,
                        }
                      });
                    }}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#0B0F12] hover:bg-[#567A87]/20 text-[#F4F1E8] border border-[#567A87]/40 text-xs font-mono font-bold transition-all cursor-pointer"
                    title={locale === 'fr' ? 'Auditer la conformité CEI & Code de Réseau SONATREL de ce poste' : 'Audit IEC & SONATREL Grid Code compliance for this substation'}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-[#D7A64A]" />
                    <span>{locale === 'fr' ? 'Audit CEI Poste' : 'Substation Audit'}</span>
                  </button>

                  {onNavigateCalculator && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateCalculator('transformer', {
                          equipmentId: sub.id,
                          equipmentName: `${locale === 'fr' ? sub.name : sub.name_en} (${sub.voltage_levels})`,
                          equipmentTag: sub.code,
                          params: {
                            trafoKva: (parseFloat(sub.transformer_capacity_mva) || 63) * 1000,
                            trafoHvKv: sub.voltage_levels.includes('225') ? 225 : 90,
                            trafoLvV: sub.voltage_levels.includes('30') ? 30000 : 15000,
                            trafoUkPercent: 12.5,
                          },
                        });
                      }}
                      className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#D7A64A]/15 hover:bg-[#D7A64A]/25 text-[#D7A64A] border border-[#D7A64A]/40 text-xs font-mono font-bold transition-all"
                    >
                      <Calculator className="h-3.5 w-3.5 text-[#D7A64A]" />
                      <span>{locale === 'fr' ? 'Calcul Transfo' : 'Trafo Calc'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: Transmission Corridors & Interconnections */}
      {activeCategory !== 'demarcation' && (activeCategory === 'all' || activeCategory === 'lines') && (
        <div className="space-y-6 pt-4">
          <CameroonTransmissionEngineeringVisualizer locale={locale} />
          <div className="flex items-center justify-between border-b border-[#567A87]/30 pb-2">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-[#D7A64A]" />
              <h2 className="font-mono text-sm font-black uppercase tracking-wider text-[#F4F1E8]">
                {locale === 'fr' ? 'LIGNES DE TRANSPORT STRATÉGIQUES & INTERCONNEXIONS' : 'STRATEGIC TRANSMISSION LINES & INTERCONNECTORS'}
              </h2>
            </div>
            <span className="font-mono text-xs text-[#A9ADA5]">
              {filteredCorridors.length} {locale === 'fr' ? 'artères répertoriées' : 'corridors listed'}
            </span>
          </div>

          <div className="space-y-3">
            {filteredCorridors.map((corridor) => (
              <div
                key={corridor.id}
                className="bg-[#151C1E] border border-[#567A87]/35 hover:border-[#D7A64A]/60 rounded-xl p-5 space-y-3 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-[#D7A64A] px-2 py-0.5 rounded bg-[#D7A64A]/15 border border-[#D7A64A]/40">
                      {corridor.code}
                    </span>
                    <span className="font-mono text-sm font-black text-[#F4F1E8]">
                      {locale === 'fr' ? corridor.name : corridor.name_en}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#F4F1E8] px-2 py-0.5 rounded bg-[#0B0F12] border border-[#567A87]/35">
                      {corridor.voltage_kv} kV · {corridor.length_km} km
                    </span>
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                      corridor.status === 'operational'
                        ? 'bg-[#D7A64A]/15 text-[#D7A64A] border-[#D7A64A]/40'
                        : 'bg-[#0B0F12] text-[#A9ADA5] border-[#567A87]/40'
                    }`}>
                      {corridor.status === 'operational' ? (locale === 'fr' ? 'EN SERVICE' : 'OPERATIONAL') : (locale === 'fr' ? 'EN CHANTIER (VÉRIFIÉ)' : 'UNDER CONSTRUCTION (VERIFIED)')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#A9ADA5] leading-relaxed">
                  {locale === 'fr' ? corridor.notes_fr : corridor.notes_en}
                </p>

                <div className="p-2.5 rounded-lg bg-[#0B0F12] border border-[#567A87]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono">
                  <div className="text-[#A9ADA5]">
                    <span className="text-[#D7A64A] font-bold uppercase mr-1.5">
                      {corridor.verification_status === 'CONFIRMED_PUBLIC_SOURCE'
                        ? (locale === 'fr' ? 'SOURCE VÉRIFIÉE :' : 'VERIFIED SOURCE:')
                        : (locale === 'fr' ? 'PROJET VÉRIFIÉ :' : 'VERIFIED PROJECT:')}
                    </span>
                    <span className="text-[#F4F1E8]">{corridor.source_citation}</span> ({corridor.source_date})
                  </div>
                  <div className="text-[#A9ADA5]">
                    {locale === 'fr'
                      ? `Domaines : ${corridor.related_domains.join(', ')}`
                      : `Domains: ${corridor.related_domains.join(', ')}`}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#567A87]/25 text-[11px] font-mono text-[#A9ADA5]">
                  <div>
                    <span className="text-[#A9ADA5]">{locale === 'fr' ? 'Conducteur :' : 'Conductor:'} </span>
                    <span className="text-[#F4F1E8]">{locale === 'fr' ? corridor.conductor_type : corridor.conductor_type_en}</span>
                  </div>
                  <div>
                    <span className="text-[#A9ADA5]">{locale === 'fr' ? 'Capacité Thermique :' : 'Thermal Rating:'} </span>
                    <span className="text-[#D7A64A] font-bold">{corridor.thermal_rating_mva} MVA</span>
                  </div>
                  <div>
                    <span className="text-[#A9ADA5]">{locale === 'fr' ? 'Origine / Extrémité :' : 'From / To:'} </span>
                    <span className="text-[#F4F1E8]">{corridor.from_substation} → {corridor.to_substation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {onNavigateCalculator && (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigateCalculator('transmission-line', {
                            equipmentId: corridor.id,
                            equipmentName: locale === 'fr' ? corridor.name : corridor.name_en,
                            equipmentTag: corridor.code,
                            params: {
                              unKv: corridor.voltage_kv,
                              voltageNominal: corridor.voltage_kv,
                              lineLengthKm: corridor.length_km,
                              lengthKm: corridor.length_km,
                              transferredPowerMw: Math.round(corridor.thermal_rating_mva * 0.9),
                              powerMw: Math.round(corridor.thermal_rating_mva * 0.9),
                              conductorCode: locale === 'fr' ? corridor.conductor_type : corridor.conductor_type_en,
                            },
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D7A64A]/15 hover:bg-[#D7A64A]/25 text-[#D7A64A] border border-[#D7A64A]/40 text-[11px] font-mono font-bold transition-all"
                      >
                        <Calculator className="h-3 w-3 text-[#D7A64A]" />
                        <span>{locale === 'fr' ? 'Calcul Ligne' : 'Line Calc'}</span>
                      </button>
                    )}
                    {onNavigateContextStack && (
                      <button
                        type="button"
                        onClick={() => onNavigateContextStack('node-line-225-bekoko')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B0F12] hover:bg-[#567A87]/20 text-[#F4F1E8] border border-[#567A87]/40 text-[11px] font-mono font-bold transition-all"
                      >
                        <Zap className="h-3 w-3 text-[#D7A64A]" />
                        <span>{locale === 'fr' ? 'Épine & TCC' : 'Spine & TCC'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* Final Call to Action */}
      <FinalCTA
        eyebrow={
          locale === 'fr'
            ? 'Ingénierie des Réseaux Nationaux'
            : 'National Grid Engineering'
        }
        title={
          locale === 'fr'
            ? 'Analysez les transitoires et calculez les chutes de tension du réseau.'
            : 'Analyze grid transients and calculate transmission line drops.'
        }
        description={
          locale === 'fr'
            ? 'Simulez les contingences N-1 des lignes 225 kV et vérifiez les plans de protection avec les calculateurs normatifs.'
            : 'Simulate 225 kV line N-1 contingencies and verify protection schemes with normative calculation tools.'
        }
        primaryAction={{
          label: locale === 'fr' ? 'Ouvrir les calculateurs' : 'Open Calculators',
          onClick: () => {
            window.location.hash = '#/calculators';
          },
        }}
        secondaryAction={{
          label: locale === 'fr' ? 'Laboratoire de simulation' : 'Simulation Lab',
          onClick: () => {
            window.location.hash = '#/simulation';
          },
        }}
      />

      {/* Automated Consolidated Substation Batch Compliance Dossier Modal */}
      {complianceModalData && (
        <SubstationBatchComplianceModal
          isOpen={Boolean(complianceModalData)}
          onClose={() => setComplianceModalData(null)}
          topology={complianceModalData.topology}
          sim={complianceModalData.snapshot}
          locale={locale}
          onNavigateCalculator={onNavigateCalculator}
          onNavigateSimulation={onNavigateSimulation}
          onNavigateEquipment={onNavigateEquipment}
        />
      )}

    </div>
  );
};
