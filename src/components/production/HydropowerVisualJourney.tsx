// src/components/production/HydropowerVisualJourney.tsx
import React, { useState, Suspense, lazy } from 'react';
import { 
  Waves, 
  Shield, 
  LogIn, 
  Filter, 
  Sliders, 
  Compass, 
  Maximize2, 
  ArrowDownRight, 
  Disc, 
  RotateCw, 
  Activity, 
  Zap, 
  Cpu, 
  Power, 
  Box, 
  GitCommit, 
  Radio, 
  ArrowRight,
  Info,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { HYDRO_PROCESS_STAGES, HYDRO_EQUIPMENT_MAP } from './data/hydropowerData';
import { HYDRO_PLANT_TYPES, HYDRO_TURBINES } from './data/turbinePlantData';
import { GENERATOR_PROTECTION_MATRIX } from './data/protectionData';
import { EquipmentDetailModal } from './EquipmentDetailModal';
import { HydropowerSchematicSvg } from './HydropowerSchematicSvg';
import { HydroPowerhouseCutawayModal } from './HydroPowerhouseCutawayModal';
import { TurbineHillChartSimulator } from './modules/TurbineHillChartSimulator';
import type { ProductionEquipment, ProtectionFunctionDetail, HydropowerPlantType, TurbineTechnology } from './types';

// Lazy load the comprehensive 24-subsystem engineering master workbench
const HydropowerMasterWorkbench = lazy(() => import('../hydropower/HydropowerMasterWorkbench').then(m => ({ default: m.HydropowerMasterWorkbench })));

const ICON_COMPONENTS: Record<string, React.FC<{ className?: string }>> = {
  Waves,
  Shield,
  LogIn,
  Filter,
  Sliders,
  Compass,
  Maximize2,
  ArrowDownRight,
  Disc,
  RotateCw,
  Activity,
  Zap,
  Cpu,
  Power,
  Box,
  GitCommit,
  Radio
};

interface HydropowerVisualJourneyProps {
  onBackToOverview?: () => void;
  locale?: 'fr' | 'en';
  onSelectGlobalEquipment?: (equipmentId: string) => void;
}

export const HydropowerVisualJourney: React.FC<HydropowerVisualJourneyProps> = ({
  onBackToOverview,
  locale = 'fr',
  onSelectGlobalEquipment
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'journey' | 'plants' | 'turbines' | 'protection' | 'workbench'>('journey');
  const [selectedEquipment, setSelectedEquipment] = useState<ProductionEquipment | null>(null);
  const [activeStageId, setActiveStageId] = useState<string>('stage-turbine');
  const [selectedProtection, setSelectedProtection] = useState<ProtectionFunctionDetail | null>(null);
  const [selectedPlantType, setSelectedPlantType] = useState<HydropowerPlantType>(HYDRO_PLANT_TYPES[0]);
  const [selectedTurbine, setSelectedTurbine] = useState<TurbineTechnology>(HYDRO_TURBINES[0]);
  const [journeyViewMode, setJourneyViewMode] = useState<'schematic' | 'linear'>('schematic');
  const [isCutawayModalOpen, setIsCutawayModalOpen] = useState<boolean>(false);

  const activeStage = HYDRO_PROCESS_STAGES.find(s => s.id === activeStageId) || HYDRO_PROCESS_STAGES[9];
  const activeEquipment = HYDRO_EQUIPMENT_MAP[activeStage.equipmentId];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border border-sky-800/40 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {onBackToOverview && (
                <button
                  onClick={onBackToOverview}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-sky-300 hover:text-white hover:bg-slate-700 transition-colors border border-sky-700/40 flex items-center gap-1"
                >
                  ← {locale === 'en' ? 'Generation Overview' : 'Domaine Production'}
                </button>
              )}
              <span className="px-2.5 py-1 rounded-full bg-sky-900/80 text-sky-200 border border-sky-600/50">
                {locale === 'en' ? 'Hydroelectric Power' : 'Filière Hydroélectricité'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
                {locale === 'en' ? 'Plant Reference: Nachtigal 420 MW (Cameroon)' : 'Référence Usine : Nachtigal 420 MW (Cameroun)'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {locale === 'en' ? 'Hydroelectric Engineering Visual Journey' : 'Parcours d\'Ingénierie Hydroélectrique'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {locale === 'en' 
                ? 'Follow the complete energy path from hydrological catchment and reservoir dam to 225 kV high-voltage grid injection. Click any component to open full 24-point engineering dossiers.'
                : 'Suivez le parcours complet de l\'énergie, depuis le bassin versant et la retenue jusqu\'à l\'injection sur le réseau Très Haute Tension 225 kV. Cliquez sur n\'importe quel équipement pour accéder aux dossiers d\'ingénierie détaillés.'}
            </p>
          </div>

          {/* Key Metric Badge */}
          <div className="flex sm:flex-col gap-3 shrink-0 p-4 rounded-xl bg-slate-950/60 border border-sky-700/40 text-center">
            <div>
              <div className="text-xs text-sky-400 font-mono uppercase">{locale === 'en' ? 'Global Efficiency' : 'Rendement Global'}</div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">88% - 93%</div>
            </div>
            <div className="border-t border-slate-800 pt-2 hidden sm:block">
              <div className="text-xs text-slate-400 font-mono">17 Étapes Visuelles</div>
            </div>
          </div>
        </div>

        {/* View Switcher Sub-tabs */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('journey')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'journey'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            Chaîne Complète de Processus (17 Étapes)
          </button>
          <button
            onClick={() => setActiveSubTab('plants')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'plants'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            Types d'Aménagements Hydro (8 Architectures)
          </button>
          <button
            onClick={() => setActiveSubTab('turbines')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'turbines'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <RotateCw className="w-4 h-4" />
            Technologies de Turbines (Francis, Pelton, Kaplan...)
          </button>
          <button
            onClick={() => setActiveSubTab('protection')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'protection'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            Matrice de Protections Alternateur (ANSI)
          </button>
          <button
            onClick={() => setActiveSubTab('workbench')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSubTab === 'workbench'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            {locale === 'en' ? 'Master Engineering Workbench (24 Subsystems)' : 'Station Complète d\'Ingénierie (24 Sous-Systèmes H01-H24)'}
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: INTERACTIVE PROCESS CHAIN */}
      {activeSubTab === 'journey' && (
        <div className="space-y-6">
          {/* Mode switch between SVG schematic and linear 17-steps */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Mode de visualisation de la chaîne hydroélectrique :</span>
            </div>
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800">
              <button
                onClick={() => setJourneyViewMode('schematic')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                  journeyViewMode === 'schematic'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Synoptique Coupe d'Usine (Schéma SCADA)
              </button>
              <button
                onClick={() => setJourneyViewMode('linear')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                  journeyViewMode === 'linear'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Parcours Linéaire (17 Étapes)
              </button>
              <button
                onClick={() => setIsCutawayModalOpen(true)}
                className="px-3 py-1.5 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                Coupe 2D Francis/Pelton
              </button>
            </div>
          </div>

          {/* If schematic mode is selected, render SVG schematic */}
          {journeyViewMode === 'schematic' && (
            <HydropowerSchematicSvg
              currentStageId={activeStage.id}
              onSelectStage={(stageId) => {
                const found = HYDRO_PROCESS_STAGES.find(s => s.id === stageId);
                if (found) setActiveStageId(found.id);
              }}
              onOpenEquipment={(eqId) => {
                const eq = HYDRO_EQUIPMENT_MAP[eqId];
                if (eq) setSelectedEquipment(eq);
              }}
            />
          )}

          {/* Energy Transformation Ribbon Indicator */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-sky-400 font-semibold uppercase tracking-wider font-mono shrink-0">
              <Sparkles className="w-4 h-4" />
              État Actuel de l'Énergie :
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full py-1 text-slate-300">
              <span className="px-3 py-1.5 rounded-lg bg-sky-950 text-sky-300 border border-sky-800/60 font-medium whitespace-nowrap">
                Étape {activeStage.stepNumber} : {activeStage.labelFr}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="px-3 py-1.5 rounded-lg bg-indigo-950 text-indigo-200 border border-indigo-800/60 font-medium whitespace-nowrap">
                {activeStage.energyStateFr}
              </span>
              {activeStage.voltageLevel && (
                <>
                  <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                  <span className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-800/60 font-bold whitespace-nowrap font-mono">
                    Niveau de Tension : {activeStage.voltageLevel}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* The Horizontal Interactive Chain Navigator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Écoulement Amont (Eau)</span>
              <span>Ligne de Production</span>
              <span>Injection Réseau (Électricité)</span>
            </div>
            
            <div className="overflow-x-auto pb-4 pt-1 scrollbar-thin">
              <div className="flex items-center gap-2 min-w-max">
                {HYDRO_PROCESS_STAGES.map((stage, idx) => {
                  const IconCmp = ICON_COMPONENTS[stage.iconName] || Zap;
                  const isCurrent = stage.id === activeStageId;
                  return (
                    <React.Fragment key={stage.id}>
                      <button
                        onClick={() => setActiveStageId(stage.id)}
                        className={`group relative p-3 rounded-xl border text-left transition-all w-44 flex flex-col justify-between h-32 ${
                          isCurrent
                            ? 'bg-sky-950/80 border-sky-500 shadow-lg shadow-sky-500/20 scale-105 z-10'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                            isCurrent ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {stage.stepNumber}
                          </span>
                          <IconCmp className={`w-5 h-5 ${isCurrent ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        </div>
                        <div>
                          <div className={`text-xs font-bold line-clamp-2 ${isCurrent ? 'text-white' : 'text-slate-200'}`}>
                            {stage.labelFr}
                          </div>
                          {stage.voltageLevel && (
                            <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/40">
                              {stage.voltageLevel}
                            </span>
                          )}
                        </div>
                      </button>

                      {idx < HYDRO_PROCESS_STAGES.length - 1 && (
                        <div className="w-4 h-0.5 bg-slate-700 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Equipment Spotlight & Detailed Card */}
          {activeEquipment && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-sky-950 border border-sky-600/40 flex items-center justify-center text-sky-400 shrink-0 shadow-inner">
                    {React.createElement(ICON_COMPONENTS[activeStage.iconName] || Zap, { className: 'w-7 h-7' })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800/60 font-semibold">
                        {activeEquipment.tag}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {activeEquipment.subsystem}
                      </span>
                      {activeStage.voltageLevel && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold">
                          {activeStage.voltageLevel}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {activeEquipment.name}
                    </h3>
                    <p className="text-xs text-slate-400 italic">
                      {activeEquipment.nameEn}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEquipment(activeEquipment)}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-sky-600/20 shrink-0"
                >
                  <Info className="w-4 h-4" />
                  Ouvrir le Dossier Technique Complet (24 Points)
                </button>
              </div>

              {/* High-Level Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-mono uppercase text-sky-400 font-semibold">Définition & Fonction</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeEquipment.purpose}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-mono uppercase text-emerald-400 font-semibold">Flux & Rendement</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Sortie :</strong> {activeEquipment.energyFlow.outflow}
                  </p>
                  <div className="text-xs text-emerald-300 font-bold pt-1">
                    Rendement typique : {activeEquipment.energyFlow.efficiencyTypical}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-mono uppercase text-amber-400 font-semibold">Rôle dans la Centrale</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeEquipment.electricalRole}</p>
                </div>
              </div>

              {/* Fast Parameters preview */}
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase text-slate-400">Paramètres Caractéristiques de Dimensionnement</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeEquipment.parameters.slice(0, 3).map((param, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400">{param.label}</div>
                        <div className="text-xs text-slate-400 italic">{param.significance}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-mono font-bold text-white">
                          {param.typicalValue} <span className="text-xs text-slate-400 font-normal">{param.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation within stages */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  disabled={activeStage.stepNumber === 1}
                  onClick={() => {
                    const prev = HYDRO_PROCESS_STAGES.find(s => s.stepNumber === activeStage.stepNumber - 1);
                    if (prev) setActiveStageId(prev.id);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  ← Étape Précédente
                </button>

                <div className="text-xs font-mono text-slate-400">
                  Étape {activeStage.stepNumber} sur {HYDRO_PROCESS_STAGES.length}
                </div>

                <button
                  disabled={activeStage.stepNumber === HYDRO_PROCESS_STAGES.length}
                  onClick={() => {
                    const next = HYDRO_PROCESS_STAGES.find(s => s.stepNumber === activeStage.stepNumber + 1);
                    if (next) setActiveStageId(next.id);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  Étape Suivante →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: PLANT TYPES EXPLORER */}
      {activeSubTab === 'plants' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {HYDRO_PLANT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedPlantType(type)}
                className={`p-3 rounded-xl border text-left transition-all text-xs ${
                  selectedPlantType.id === type.id
                    ? 'bg-sky-950/80 border-sky-500 text-white font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold">{type.nameFr}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{type.schematicType}</div>
              </button>
            ))}
          </div>

          {/* Plant Type Detailed Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
                  Architecture d'Aménagement
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">{selectedPlantType.nameFr}</h3>
                <p className="text-xs text-slate-400 italic">{selectedPlantType.nameEn}</p>
                <p className="text-sm text-sky-200 mt-2">{selectedPlantType.taglineFr}</p>
              </div>

              {selectedPlantType.cameroonBenchmark && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 max-w-sm shrink-0">
                  <div className="text-xs font-mono text-emerald-400 font-semibold mb-1">Exemple / Référence Cameroun :</div>
                  <div className="text-xs text-slate-200">{selectedPlantType.cameroonBenchmark}</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="font-mono uppercase text-sky-400 font-semibold">Comment ça fonctionne</h4>
                <p className="leading-relaxed">{selectedPlantType.howItWorks}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="font-mono uppercase text-emerald-400 font-semibold">Chemin Hydraulique de l'Eau</h4>
                <p className="leading-relaxed">{selectedPlantType.waterPath}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <h4 className="font-mono uppercase text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Avantages Principaux
                </h4>
                <div className="space-y-1.5">
                  {selectedPlantType.advantages.map((adv, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-slate-200">
                      • {adv}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Contraintes & Limites
                </h4>
                <div className="space-y-1.5">
                  {selectedPlantType.limitations.map((lim, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-slate-200">
                      • {lim}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: TURBINE TECHNOLOGIES */}
      {activeSubTab === 'turbines' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {HYDRO_TURBINES.map((turb) => (
              <button
                key={turb.id}
                onClick={() => setSelectedTurbine(turb)}
                className={`p-3 rounded-xl border text-left transition-all text-xs ${
                  selectedTurbine.id === turb.id
                    ? 'bg-sky-950/80 border-sky-500 text-white font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold truncate">{turb.name.split('(')[0]}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 capitalize">{turb.category}</div>
              </button>
            ))}
          </div>

          {/* Turbine Details */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800 capitalize">
                  Turbine à {selectedTurbine.category === 'reaction' ? 'Réaction' : 'Action / Impulsion'}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">{selectedTurbine.name}</h3>
                <p className="text-xs text-sky-300 font-mono mt-1">Équation Clé : {selectedTurbine.keyEquation}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCutawayModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-mono font-bold text-xs shadow-lg shadow-sky-900/40 transition-all cursor-pointer border border-sky-400/40"
                  title={locale === 'en' ? 'Open interactive physical cross-section cutaway' : 'Ouvrir la coupe physique transversale interactive'}
                >
                  <Box className="w-4 h-4 text-cyan-300" />
                  <span>{locale === 'en' ? '3D Powerhouse Cutaway' : 'Coupe 3D Centrale & Turbine'}</span>
                </button>
                <div className="flex gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400">Plage de Chute</div>
                    <div className="text-sm font-bold text-sky-400">{selectedTurbine.headRange}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400">Rendement Max</div>
                    <div className="text-sm font-bold text-emerald-400">{selectedTurbine.efficiencyPeak}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="font-mono uppercase text-sky-400 font-semibold">Entrée & Chemin de l'Eau</h4>
                <p className="leading-relaxed">{selectedTurbine.waterEntry}</p>
                <p className="leading-relaxed text-slate-400 pt-1">{selectedTurbine.waterPath}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="font-mono uppercase text-emerald-400 font-semibold">Génération du Couple Mécanique</h4>
                <p className="leading-relaxed">{selectedTurbine.mechanicalPowerProduction}</p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 mt-2">
                  <strong>Roue (Runner) :</strong> {selectedTurbine.runnerDescription}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-mono text-cyan-400 uppercase font-semibold">Référence / Usine Typique :</span>
              <p>{selectedTurbine.benchmarkPlant}</p>
            </div>
          </div>

          {/* IEC 60193 Hill Chart & Governor Dynamics Simulator */}
          <TurbineHillChartSimulator
            locale={locale}
            turbineId={selectedTurbine.id}
          />
        </div>
      )}

      {/* SUB-VIEW 4: PROTECTION MATRIX (ANSI) */}
      {activeSubTab === 'protection' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <h3 className="text-base font-bold text-white mb-1">Architecture de Protection Électrique Alternateur-Transformateur</h3>
            <p className="text-slate-400">
              Cliquez sur un code de protection ANSI pour examiner le phénomène physique anormal détecté, la méthode de détection par transformateurs de mesure, l'ordre de déclenchement (Trip) et les équipements affectés.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GENERATOR_PROTECTION_MATRIX.map((prot) => (
              <div 
                key={prot.ansiCode}
                onClick={() => setSelectedProtection(prot)}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/60 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-rose-950 text-rose-300 border border-rose-800 text-xs font-mono font-bold">
                    ANSI {prot.ansiCode}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{prot.standard}</span>
                </div>
                <div className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors">
                  {prot.nameFr}
                </div>
                <div className="text-xs text-slate-400 line-clamp-2">
                  {prot.whatItProtects}
                </div>
              </div>
            ))}
          </div>

          {/* Protection Detail Modal / Drawer */}
          {selectedProtection && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl text-slate-200">
                <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="px-2.5 py-1 rounded-md bg-rose-950 text-rose-300 border border-rose-800 text-xs font-mono font-bold">
                      ANSI {selectedProtection.ansiCode}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1.5">{selectedProtection.nameFr}</h3>
                    <p className="text-xs text-slate-400 italic">{selectedProtection.nameEn}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedProtection(null)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="font-semibold text-sky-400 block mb-1">Ce que la fonction protège :</span>
                    <p className="text-slate-300">{selectedProtection.whatItProtects}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="font-semibold text-amber-400 block mb-1">Condition anormale détectée :</span>
                    <p className="text-slate-300">{selectedProtection.abnormalCondition}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="font-semibold text-cyan-400 block mb-1">Méthode de détection :</span>
                    <p className="text-slate-300">{selectedProtection.detectionMethod}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40">
                    <span className="font-semibold text-rose-400 block mb-1">Action de déclenchement (Trip Action) :</span>
                    <p className="text-slate-200">{selectedProtection.actionOccurs}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="font-semibold text-emerald-400 block mb-1">Équipements affectés :</span>
                    <p className="text-slate-300">{selectedProtection.equipmentAffected}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedProtection(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 5: COMPREHENSIVE HYDROPOWER MASTER WORKBENCH (24 SUBSYSTEMS) */}
      {activeSubTab === 'workbench' && (
        <Suspense fallback={
          <div className="p-12 text-center text-sky-400 font-mono animate-pulse rounded-2xl bg-slate-900 border border-slate-800">
            Initialisation de la station d'ingénierie hydroélectrique (H01 - H24)...
          </div>
        }>
          <HydropowerMasterWorkbench
            locale={locale}
            onBack={onBackToOverview}
          />
        </Suspense>
      )}

      {/* Equipment Detail Modal (24 Points) */}
      {selectedEquipment && (
        <EquipmentDetailModal
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
          onSelectEquipment={onSelectGlobalEquipment}
          allEquipmentMap={HYDRO_EQUIPMENT_MAP}
          locale={locale}
        />
      )}

      {/* Hydro Powerhouse Physical Cross-Section Cutaway Modal */}
      {isCutawayModalOpen && (
        <HydroPowerhouseCutawayModal
          isOpen={isCutawayModalOpen}
          onClose={() => setIsCutawayModalOpen(false)}
          locale={locale}
        />
      )}
    </div>
  );
};
