// src/components/journey/EcosystemHeaderToolbar.tsx
import React from 'react';
import { 
  Zap, 
  Layers, 
  Activity, 
  Eye, 
  Search, 
  CloudLightning, 
  AlertTriangle, 
  BarChart3, 
  Users, 
  Play, 
  Pause, 
  ArrowRightLeft,
  Compass,
  Scale,
  ShieldCheck,
  Power
} from 'lucide-react';
import { StageId, VisualizationLayer } from './types';
import { ECOSYSTEM_STAGES } from './data/ecosystemData';

interface EcosystemHeaderToolbarProps {
  locale: 'fr' | 'en';
  activeStage: StageId;
  onSelectStage: (stage: StageId) => void;
  activeLayer: VisualizationLayer;
  onChangeLayer?: (layer: VisualizationLayer) => void;
  onSelectLayer?: (layer: VisualizationLayer) => void;
  isFlowActive: boolean;
  onToggleFlow: () => void;
  animationSpeed: number;
  onChangeSpeed?: (speed: number) => void;
  onSetSpeed?: (speed: number) => void;
  direction?: 'forward' | 'reverse';
  onToggleDirection?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenLightning?: () => void;
  onOpenLightningModal?: () => void;
  onOpenFaults?: () => void;
  onOpenFaultModal?: () => void;
  onOpenStability?: () => void;
  onOpenStabilityModal?: () => void;
  onOpenDisciplines?: () => void;
  onOpenDisciplinesModal?: () => void;
  onOpenLossAnalyzer?: () => void;
  onOpenLossModal?: () => void;
  onOpenProtectionCoordination?: () => void;
  onOpenProtectionModal?: () => void;
  onOpenBlackStart?: () => void;
  onOpenBlackStartModal?: () => void;
  onOpenHarmonics?: () => void;
  onOpenHarmonicsModal?: () => void;
}

export const EcosystemHeaderToolbar: React.FC<EcosystemHeaderToolbarProps> = ({
  locale,
  activeStage,
  onSelectStage,
  activeLayer,
  onChangeLayer,
  onSelectLayer,
  isFlowActive,
  onToggleFlow,
  animationSpeed,
  onChangeSpeed,
  onSetSpeed,
  direction = 'forward',
  onToggleDirection,
  searchQuery = '',
  onSearchChange,
  onOpenLightning,
  onOpenLightningModal,
  onOpenFaults,
  onOpenFaultModal,
  onOpenStability,
  onOpenStabilityModal,
  onOpenDisciplines,
  onOpenDisciplinesModal,
  onOpenLossAnalyzer,
  onOpenLossModal,
  onOpenProtectionCoordination,
  onOpenProtectionModal,
  onOpenBlackStart,
  onOpenBlackStartModal,
  onOpenHarmonics,
  onOpenHarmonicsModal,
}) => {
  const handleLayerChange = (layer: VisualizationLayer) => {
    if (onChangeLayer) onChangeLayer(layer);
    else if (onSelectLayer) onSelectLayer(layer);
  };

  const handleSpeedChange = (spd: number) => {
    if (onChangeSpeed) onChangeSpeed(spd);
    else if (onSetSpeed) onSetSpeed(spd);
  };

  const handleLightning = onOpenLightning || onOpenLightningModal;
  const handleFaults = onOpenFaults || onOpenFaultModal;
  const handleStability = onOpenStability || onOpenStabilityModal;
  const handleDisciplines = onOpenDisciplines || onOpenDisciplinesModal;
  const handleLossAnalyzer = onOpenLossAnalyzer || onOpenLossModal;
  const handleProtection = onOpenProtectionCoordination || onOpenProtectionModal;
  const handleBlackStart = onOpenBlackStart || onOpenBlackStartModal;
  const handleHarmonics = onOpenHarmonics || onOpenHarmonicsModal;
  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      {/* Upper Bar: Title, View Switcher & Action Tools */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Concept */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
            <Compass className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-black tracking-wide text-slate-900 uppercase font-mono">
                {locale === 'fr' ? 'LE PARCOURS DE L\'ÉLECTRICITÉ' : 'THE JOURNEY OF ELECTRICITY'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                EPEDE 360°
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1 font-sans">
              {locale === 'fr' 
                ? 'De la source d\'énergie primaire jusqu\'à l\'interrupteur de votre lampe'
                : 'From the primary energy resource to your domestic light switch'}
            </p>
          </div>
        </div>

        {/* View Layer Selector: Conceptual / Electrical SLD / Physical CAD */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => handleLayerChange('conceptual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'conceptual'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Vue Conceptuelle' : 'Conceptual View'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleLayerChange('electrical')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'electrical'
                ? 'bg-white text-amber-800 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Schéma Électrique (SLD)' : 'Electrical SLD'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleLayerChange('physical')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'physical'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Vue Physique & CAD' : 'Physical & CAD'}</span>
          </button>
        </div>

        {/* Action Simulations & Explorers */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Why 225 kV & Power Loss Waterfall */}
          <button
            type="button"
            onClick={handleLossAnalyzer}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-mono font-medium transition-all shadow-2xs"
          >
            <Scale className="h-3.5 w-3.5 text-emerald-600" />
            <span>{locale === 'fr' ? 'Bilan 225 kV & Pertes' : 'Why 225 kV & Losses'}</span>
          </button>

          {/* Lightning Simulation */}
          <button
            type="button"
            onClick={handleLightning}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-xs font-mono font-medium transition-all shadow-2xs"
          >
            <CloudLightning className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
            <span>{locale === 'fr' ? 'Impact Foudre' : 'Lightning Strike'}</span>
          </button>

          {/* Fault Scenarios */}
          <button
            type="button"
            onClick={handleFaults}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/80 text-xs font-mono font-medium transition-all shadow-2xs"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            <span>{locale === 'fr' ? 'Scénarios Défauts' : 'Fault Scenarios'}</span>
          </button>

          {/* Protection Coordination & Selectivity (TCC) */}
          <button
            type="button"
            onClick={handleProtection}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/80 text-xs font-mono font-medium transition-all shadow-2xs"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
            <span>{locale === 'fr' ? 'Sélectivité Protections (TCC)' : 'Selectivity & TCC'}</span>
          </button>

          {/* Black Start Grid Restoration */}
          <button
            type="button"
            onClick={handleBlackStart}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-mono font-medium transition-all shadow-2xs"
          >
            <Power className="h-3.5 w-3.5 text-emerald-600" />
            <span>{locale === 'fr' ? 'Black Start & Renvoi' : 'Black Start Lab'}</span>
          </button>

          {/* Harmonics & Waveform Distortion (IEEE 519) */}
          <button
            type="button"
            onClick={handleHarmonics}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/80 text-xs font-mono font-medium transition-all shadow-2xs"
          >
            <Activity className="h-3.5 w-3.5 text-indigo-600" />
            <span>{locale === 'fr' ? 'Harmoniques & Onde' : 'Harmonics & THD'}</span>
          </button>

          {/* Grid Stability */}
          <button
            type="button"
            onClick={handleStability}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/80 text-xs font-mono font-medium transition-all shadow-2xs"
          >
            <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
            <span>{locale === 'fr' ? 'Équilibre Réseau (P-f, Q-V)' : 'Grid Stability'}</span>
          </button>

          {/* Disciplines */}
          <button
            type="button"
            onClick={handleDisciplines}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200/80 text-xs font-mono font-medium transition-all shadow-2xs"
          >
            <Users className="h-3.5 w-3.5 text-purple-600" />
            <span>{locale === 'fr' ? 'Disciplines Ingénierie' : 'Engineering Roles'}</span>
          </button>
        </div>
      </div>

      {/* Lower Bar: 6-Stage Timeline Navigator, Direction & Flow Controls */}
      <div className="bg-slate-50/90 border-t border-slate-200/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Stage pills (1 to 6) */}
          <div className="flex items-center overflow-x-auto w-full md:w-auto py-1 gap-1.5 scrollbar-none">
            {ECOSYSTEM_STAGES.map((stg) => {
              const isActive = activeStage === stg.id;
              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => onSelectStage(stg.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white text-amber-900 border border-amber-400 font-bold shadow-xs'
                      : 'bg-white/80 text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-white'
                  }`}
                >
                  <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {stg.number}
                  </span>
                  <span>{stg.title[locale]}</span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/50">
                    {stg.voltageRating}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Flow Controls & Search */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {/* Direction toggle */}
            <button
              type="button"
              onClick={onToggleDirection}
              title={locale === 'fr' ? 'Inverser le sens d\'analyse' : 'Reverse journey direction'}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono transition-colors shadow-2xs"
            >
              <ArrowRightLeft className="h-3 w-3 text-sky-600" />
              <span className="hidden sm:inline">
                {direction === 'forward' 
                  ? (locale === 'fr' ? 'Source → Lampe' : 'Source → Lamp')
                  : (locale === 'fr' ? 'Lampe → Source' : 'Lamp → Source')}
              </span>
            </button>

            {/* Play/Pause Flow */}
            <button
              type="button"
              onClick={onToggleFlow}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors shadow-2xs ${
                isFlowActive
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isFlowActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              <span>{isFlowActive ? (locale === 'fr' ? 'Flux Actif' : 'Flowing') : (locale === 'fr' ? 'Pause' : 'Paused')}</span>
            </button>

            {/* Speed toggle */}
            <button
              type="button"
              onClick={() => {
                const speeds = [0.5, 1, 2];
                const nextIdx = (speeds.indexOf(animationSpeed) + 1) % speeds.length;
                handleSpeedChange(speeds[nextIdx]);
              }}
              className="px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono shadow-2xs"
            >
              {animationSpeed}x
            </button>

            {/* Contextual Search Input */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={locale === 'fr' ? 'Rechercher équipement...' : 'Search equipment...'}
                className="pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 w-36 sm:w-44 font-mono shadow-2xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
