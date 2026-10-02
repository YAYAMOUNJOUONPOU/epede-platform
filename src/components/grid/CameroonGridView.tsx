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
} from 'lucide-react';

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

type FilterCategory = 'map' | 'all' | 'ris' | 'rin' | 'plants' | 'substations' | 'lines' | 'demarcation';

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

  // Filtered Plants
  const filteredPlants = useMemo(() => {
    return CAMEROON_POWER_PLANTS.filter(p => {
      const matchesSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.operator.toLowerCase().includes(searchQuery.toLowerCase());

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
      const matchesSearch = !searchQuery.trim() || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.voltage_levels.toLowerCase().includes(searchQuery.toLowerCase());

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
      const matchesSearch = !searchQuery.trim() || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.from_substation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.to_substation.toLowerCase().includes(searchQuery.toLowerCase());

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
      title: 'EPEDE - Observatoire du Système Électrique National du Cameroun',
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
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      
      {/* Top Banner with National Grid Metrics */}
      <div className="bg-gradient-to-r from-emerald-50/70 via-white to-sky-50/60 border border-emerald-200/90 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                <span>L05 · RÉSEAU NATIONAL DU CAMEROUN</span>
              </span>
              <span className="font-mono text-xs text-slate-500">
                {locale === 'fr' ? 'SONATREL · Eneo · EDC · ARSEL' : 'Cameroon Power Grid System'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-black tracking-tight text-slate-900 uppercase">
              {locale === 'fr' ? 'Observatoire du Réseau Électrique Camerounais' : 'Cameroon Power System Observatory'}
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Cartographie technique approfondie des réseaux interconnectés Sud (RIS 225/90 kV) et Nord (RIN 110/90 kV), des grands aménagements hydroélectriques (Nachtigal 420 MW, Songloulou 384 MW, Edéa 276 MW), des nœuds de transit et des lignes d\'interconnexion stratégiques.'
                : 'Deep engineering observatory of Cameroon\'s Southern (RIS 225/90 kV) and Northern (RIN 110/90 kV) power systems, flagship hydro schemes (Nachtigal 420 MW, Songloulou 384 MW, Edéa 276 MW), key substations and regional interconnectors.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onNavigateContextStack && (
              <button
                type="button"
                onClick={() => onNavigateContextStack('node-line-225-bekoko')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-bold transition-all shadow-xs"
              >
                <Zap className="h-4 w-4 text-sky-200" />
                <span>{locale === 'fr' ? 'Épine Dorsale & TCC' : 'Spine & TCC Stack'}</span>
              </button>
            )}

            {onNavigateRegulatory && (
              <button
                type="button"
                onClick={onNavigateRegulatory}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-mono font-bold transition-all shadow-xs"
              >
                <Scale className="h-4 w-4 text-amber-700" />
                <span>{locale === 'fr' ? 'Cadre Réglementaire L06' : 'Regulatory Framework L06'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportGridData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold transition-all shadow-xs"
            >
              <Download className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Exporter Données Réseau' : 'Export Grid Data'}</span>
            </button>
          </div>
        </div>

        {/* 4 Key Grid Indicator Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200/80">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] font-mono uppercase text-slate-500">
              {locale === 'fr' ? 'Puissance Installée' : 'Installed Capacity'}
            </div>
            <div className="text-xl font-mono font-black text-emerald-700 mt-1">
              {CAMEROON_GRID_SUMMARY.national_installed_capacity_mw} MW
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
              {CAMEROON_GRID_SUMMARY.hydro_share_percent}% Hydro · {CAMEROON_GRID_SUMMARY.thermal_gas_share_percent}% Gaz
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] font-mono uppercase text-slate-500">
              {locale === 'fr' ? 'Pointe Maximale' : 'Peak Demand'}
            </div>
            <div className="text-xl font-mono font-black text-sky-700 mt-1">
              {CAMEROON_GRID_SUMMARY.peak_demand_mw} MW
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
              {locale === 'fr' ? 'Marge de réserve : ~30%' : 'Reserve margin: ~30%'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] font-mono uppercase text-slate-500">
              {locale === 'fr' ? 'Réseau Transport 225 kV' : '225 kV Transmission'}
            </div>
            <div className="text-xl font-mono font-black text-amber-700 mt-1">
              {CAMEROON_GRID_SUMMARY.transmission_line_km_225kv} km
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
              + {CAMEROON_GRID_SUMMARY.transmission_line_km_90kv} km (90 kV)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] font-mono uppercase text-slate-500">
              {locale === 'fr' ? 'Opérateur Système TSO' : 'Transmission Operator'}
            </div>
            <div className="text-xl font-mono font-black text-slate-900 mt-1 truncate">
              SONATREL
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">
              Dispatching National (Édéa/Ydé)
            </div>
          </div>
        </div>
      </div>

      {/* Filter Ribbon & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveCategory('map')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1.5 ${
              activeCategory === 'map'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-sky-300" />
            <span>{locale === 'fr' ? 'Carte Interactive SIG / SLD' : 'Interactive GIS / SLD Map'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              activeCategory === 'all'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {locale === 'fr' ? 'Tous les Éléments' : 'All Elements'}
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('ris')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              activeCategory === 'ris'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            RIS (Sud 225/90 kV)
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('rin')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              activeCategory === 'rin'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            RIN (Nord 110/90 kV)
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('plants')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              activeCategory === 'plants'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {locale === 'fr' ? 'Centrales' : 'Power Plants'}
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('substations')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              activeCategory === 'substations'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {locale === 'fr' ? 'Postes 225/90 kV' : 'Substations'}
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('lines')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              activeCategory === 'lines'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {locale === 'fr' ? 'Lignes & Interconnexions' : 'Lines & Corridors'}
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('demarcation')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold flex items-center gap-1.5 ${
              activeCategory === 'demarcation'
                ? 'bg-amber-100 text-amber-950 border border-amber-400 font-extrabold shadow-sm'
                : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50 border border-amber-200/80'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>{locale === 'fr' ? 'Frontières Contractuelles (Porte 3)' : 'Contractual Boundaries (Gate 3)'}</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'fr' ? 'Rechercher ville, centrale, poste...' : 'Search city, plant, station...'}
            className="w-full bg-slate-50 text-xs font-mono text-slate-900 pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

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

      {/* SECTION 1: Major Power Generation Plants */}
      {activeCategory !== 'demarcation' && (activeCategory === 'all' || activeCategory === 'plants' || activeCategory === 'ris' || activeCategory === 'rin') && (
        <div className="space-y-4">
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
                className="bg-[#0D1117] border border-[#252E38] hover:border-emerald-500/40 rounded-xl p-5 space-y-3 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#161C24] text-neutral-300 border border-[#252E38] flex items-center gap-1">
                      {plant.type === 'hydro' ? <Droplets className="h-3 w-3 text-cyan-400" /> :
                       plant.type === 'gas_thermal' ? <Flame className="h-3 w-3 text-amber-400" /> :
                       plant.type === 'solar_pv_bess' ? <Sun className="h-3 w-3 text-yellow-400" /> :
                       <Droplets className="h-3 w-3 text-emerald-400" />}
                      <span>{plant.type.toUpperCase()}</span>
                    </span>

                    <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                      {plant.installed_capacity_mw} MW
                    </span>
                  </div>

                  <div>
                    <h3 className="font-mono text-sm font-black text-white leading-snug">
                      {plant.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono mt-1">
                      <MapPin className="h-3 w-3 text-neutral-400" />
                      <span>{plant.location} · {plant.region}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                    {locale === 'fr' ? plant.key_highlights_fr : plant.key_highlights_en}
                  </p>

                  <div className="pt-2 border-t border-[#1e252e] space-y-1 text-[11px] font-mono text-neutral-300">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">{locale === 'fr' ? 'Groupes :' : 'Units:'}</span>
                      <span className="text-right truncate max-w-[180px]">{plant.units_description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">{locale === 'fr' ? 'Tension d\'évacuation :' : 'Evacuation Voltage:'}</span>
                      <span className="text-cyan-300 font-bold">{plant.voltage_kv} kV</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">{locale === 'fr' ? 'Exploitant :' : 'Operator:'}</span>
                      <span className="truncate max-w-[180px]">{plant.operator}</span>
                    </div>
                  </div>
                </div>

                {/* Computational & Simulation links & Spine */}
                <div className="pt-3 border-t border-[#1e252e] flex flex-wrap items-center gap-2">
                  {plant.type === 'hydro' && onNavigateHydropower && (
                    <button
                      type="button"
                      onClick={onNavigateHydropower}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold transition-all"
                    >
                      <Waves className="h-3 w-3 text-emerald-400" />
                      <span>{locale === 'fr' ? 'Jumeau Numérique Hydro (24 Étapes)' : 'Hydropower Digital Twin (24 Steps)'}</span>
                    </button>
                  )}
                  {onNavigateContextStack && (
                    <button
                      type="button"
                      onClick={() => onNavigateContextStack('node-gen-g1')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-mono font-bold transition-all"
                    >
                      <Zap className="h-3 w-3 text-sky-400" />
                      <span>{locale === 'fr' ? 'Épine Dorsale' : 'Spine Node'}</span>
                    </button>
                  )}
                  {plant.relevant_calculator && onNavigateCalculator && (
                    <button
                      type="button"
                      onClick={() => onNavigateCalculator(plant.relevant_calculator!)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-mono font-bold transition-all"
                    >
                      <Calculator className="h-3 w-3" />
                      <span>{locale === 'fr' ? 'Calculateur' : 'Calculator'}</span>
                    </button>
                  )}
                  {plant.relevant_simulation && onNavigateSimulation && (
                    <button
                      type="button"
                      onClick={() => onNavigateSimulation(plant.relevant_simulation!)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-mono font-bold transition-all"
                    >
                      <Zap className="h-3 w-3" />
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
          <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-cyan-400" />
              <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
                {locale === 'fr' ? 'POSTES STRATÉGIQUES DE TRANSPORT 225/90/30 kV' : 'STRATEGIC 225/90/30 kV SUBSTATIONS'}
              </h2>
            </div>
            <span className="font-mono text-xs text-neutral-400">
              {filteredSubstations.length} {locale === 'fr' ? 'nœuds répertoriés' : 'nodes listed'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSubstations.map((sub) => (
              <div
                key={sub.id}
                className="bg-[#0D1117] border border-[#252E38] hover:border-cyan-500/40 rounded-xl p-5 space-y-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                      {sub.code}
                    </span>
                    <span className="font-mono text-xs text-amber-400 font-bold">
                      {sub.voltage_levels}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold text-neutral-400 px-2 py-0.5 rounded bg-[#161C24] border border-[#252E38]">
                    {sub.operator}
                  </span>
                </div>

                <div>
                  <h3 className="font-mono text-base font-black text-white">
                    {sub.name}
                  </h3>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">
                    {sub.city} · Région du {sub.region}
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {locale === 'fr' ? sub.function_description_fr : sub.function_description_en}
                </p>

                <div className="p-3 rounded-lg bg-[#11161D] border border-[#252E38] space-y-1.5 text-[11px] font-mono text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{locale === 'fr' ? 'Puissance Installée MVA :' : 'Installed MVA:'}</span>
                    <span className="text-white font-bold">{sub.transformer_capacity_mva}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{locale === 'fr' ? 'Niveau de Court-Circuit (Ik") :' : 'Short-Circuit Level:'}</span>
                    <span className="text-amber-400 font-bold">{sub.short_circuit_level_ka}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">{locale === 'fr' ? 'Topologie :' : 'Topology:'}</span>
                    <span className="text-cyan-300 uppercase">{sub.bus_topology}</span>
                  </div>
                </div>

                {/* Connected lines */}
                <div className="space-y-1 pt-1">
                  <span className="font-mono text-[10px] uppercase text-neutral-400 font-bold">
                    {locale === 'fr' ? 'Artères & Lignes raccordées :' : 'Connected Lines & Feeders:'}
                  </span>
                  <ul className="space-y-1 font-mono text-[11px] text-neutral-400">
                    {sub.connected_lines.map((l, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <ArrowRight className="h-3 w-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct link to SLD CAD Schematic, Spine & Transformer Calculator */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {onNavigateContextStack && (
                    <button
                      type="button"
                      onClick={() => onNavigateContextStack(sub.code.includes('OYO') ? 'node-trafo-main-30' : sub.code.includes('MAN') ? 'node-trafo-gsu' : 'node-line-225-bekoko')}
                      className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold transition-all"
                    >
                      <Zap className="h-3.5 w-3.5 text-sky-400" />
                      <span>{locale === 'fr' ? 'Épine & TCC' : 'Spine & TCC'}</span>
                    </button>
                  )}
                  {sub.associated_diagram_topology && onNavigateDiagram && (
                    <button
                      type="button"
                      onClick={() => onNavigateDiagram(sub.associated_diagram_topology)}
                      className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#161C24] hover:bg-[#1f2733] text-amber-300 hover:text-amber-200 border border-[#252E38] hover:border-amber-400/40 text-xs font-mono font-bold transition-all"
                    >
                      <Activity className="h-3.5 w-3.5 text-amber-400" />
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
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer shadow-xs"
                    title={locale === 'fr' ? 'Auditer la conformité CEI & Code de Réseau SONATREL de ce poste' : 'Audit IEC & SONATREL Grid Code compliance for this substation'}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{locale === 'fr' ? 'Audit CEI Poste' : 'Substation Audit'}</span>
                  </button>

                  {onNavigateCalculator && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateCalculator('transformer', {
                          equipmentId: sub.id,
                          equipmentName: `${sub.name} (${sub.voltage_levels})`,
                          equipmentTag: sub.code,
                          params: {
                            trafoKva: (parseFloat(sub.transformer_capacity_mva) || 63) * 1000,
                            trafoHvKv: sub.voltage_levels.includes('225') ? 225 : 90,
                            trafoLvV: sub.voltage_levels.includes('30') ? 30000 : 15000,
                            trafoUkPercent: 12.5,
                          },
                        });
                      }}
                      className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold transition-all"
                    >
                      <Calculator className="h-3.5 w-3.5 text-emerald-400" />
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
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-[#252E38] pb-2">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-400" />
              <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
                {locale === 'fr' ? 'LIGNES DE TRANSPORT STRATÉGIQUES & INTERCONNEXIONS' : 'STRATEGIC TRANSMISSION LINES & INTERCONNECTORS'}
              </h2>
            </div>
            <span className="font-mono text-xs text-neutral-400">
              {filteredCorridors.length} {locale === 'fr' ? 'artères répertoriées' : 'corridors listed'}
            </span>
          </div>

          <div className="space-y-3">
            {filteredCorridors.map((corridor) => (
              <div
                key={corridor.id}
                className="bg-[#0D1117] border border-[#252E38] hover:border-emerald-500/40 rounded-xl p-5 space-y-3 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                      {corridor.code}
                    </span>
                    <span className="font-mono text-sm font-black text-white">
                      {corridor.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                      {corridor.voltage_kv} kV · {corridor.length_km} km
                    </span>
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                      corridor.status === 'operational'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {corridor.status === 'operational' ? (locale === 'fr' ? 'EN SERVICE' : 'OPERATIONAL') : (locale === 'fr' ? 'EN CHANTIER' : 'UNDER CONSTRUCTION')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {locale === 'fr' ? corridor.notes_fr : corridor.notes_en}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#1e252e] text-[11px] font-mono text-neutral-400">
                  <div>
                    <span className="text-neutral-400">{locale === 'fr' ? 'Conducteur :' : 'Conductor:'} </span>
                    <span className="text-white">{corridor.conductor_type}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">{locale === 'fr' ? 'Capacité Thermique :' : 'Thermal Capacity:'} </span>
                    <span className="text-amber-400 font-bold">{corridor.thermal_rating_mva} MVA</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">{locale === 'fr' ? 'Origine / Extrémité :' : 'From / To:'} </span>
                    <span className="text-cyan-300">{corridor.from_substation} → {corridor.to_substation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {onNavigateCalculator && (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigateCalculator('transmission-line', {
                            equipmentId: corridor.id,
                            equipmentName: corridor.name,
                            equipmentTag: corridor.code,
                            params: {
                              unKv: corridor.voltage_kv,
                              voltageNominal: corridor.voltage_kv,
                              lineLengthKm: corridor.length_km,
                              lengthKm: corridor.length_km,
                              transferredPowerMw: Math.round(corridor.thermal_rating_mva * 0.9),
                              powerMw: Math.round(corridor.thermal_rating_mva * 0.9),
                              conductorCode: corridor.conductor_type,
                            },
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold transition-all"
                      >
                        <Calculator className="h-3 w-3 text-amber-400" />
                        <span>{locale === 'fr' ? 'Calcul Ligne' : 'Line Calc'}</span>
                      </button>
                    )}
                    {onNavigateContextStack && (
                      <button
                        type="button"
                        onClick={() => onNavigateContextStack('node-line-225-bekoko')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-mono font-bold transition-all"
                      >
                        <Zap className="h-3 w-3 text-sky-400" />
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
