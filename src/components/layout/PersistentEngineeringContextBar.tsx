// src/components/layout/PersistentEngineeringContextBar.tsx
// EPEDE - Persistent Engineering Context Stack & Energy Chain Navigation Bar
// Sits directly beneath Header, maintaining unbroken context orientation across the entire grid lifecycle.

import React, { useState, useEffect } from 'react';
import {
  Compass,
  History,
  Zap,
  Layers,
  Shield,
  Cpu,
  Eye,
  BookOpen,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { engineeringContextService } from '../../services/engineeringContextService';
import { EnergyChainPosition, EngineeringAspectView } from '../../types/contextStack';
import { WhereAmIDrawer } from '../context/WhereAmIDrawer';
import { soundEffects } from '../../services/soundEffectsService';

interface PersistentEngineeringContextBarProps {
  locale: 'fr' | 'en';
  currentView: string;
  onNavigateDomain?: (domainCode: string) => void;
  onNavigateEquipment?: (equipmentId: string) => void;
  onNavigateCalculator?: (tab: any) => void;
  onNavigateSimulation?: (tab: any) => void;
  onNavigateContextStack?: (nodeId?: string) => void;
  onOpenHistory?: () => void;
}

const ENERGY_STAGES: Array<{
  id: EnergyChainPosition;
  label: { fr: string; en: string };
  voltage: string;
  color: string;
}> = [
  { id: 'generation', label: { fr: 'Production Hydro', en: 'Hydro Generation' }, voltage: '10.5 kV', color: 'from-sky-500 to-blue-600' },
  { id: 'step_up_substation', label: { fr: 'Poste Élévateur', en: 'Step-Up GSU' }, voltage: '10.5/225 kV', color: 'from-blue-600 to-indigo-600' },
  { id: 'transmission_grid', label: { fr: 'Réseau Transport HTB', en: 'Transmission Grid' }, voltage: '225 kV', color: 'from-amber-500 to-orange-600' },
  { id: 'primary_substation', label: { fr: 'Poste Source', en: 'Primary Substation' }, voltage: '225/30 kV', color: 'from-purple-500 to-pink-600' },
  { id: 'distribution_network', label: { fr: 'Distribution HTA', en: 'MV Distribution' }, voltage: '30 kV', color: 'from-emerald-500 to-teal-600' },
  { id: 'industrial_commercial_load', label: { fr: 'Usine & Charges BT', en: 'Industrial Load' }, voltage: '400 V', color: 'from-cyan-500 to-sky-600' },
];

export const PersistentEngineeringContextBar: React.FC<PersistentEngineeringContextBarProps> = ({
  locale,
  currentView,
  onNavigateDomain,
  onNavigateEquipment,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateContextStack,
  onOpenHistory,
}) => {
  const [context, setContext] = useState(engineeringContextService.getCurrentContext());
  const [activeAspect, setActiveAspect] = useState<EngineeringAspectView>(engineeringContextService.getActiveAspect());
  const [isWhereAmIOpen, setIsWhereAmIOpen] = useState(false);

  useEffect(() => {
    const unsub = engineeringContextService.subscribe(() => {
      setContext(engineeringContextService.getCurrentContext());
      setActiveAspect(engineeringContextService.getActiveAspect());
    });
    return () => unsub();
  }, []);

  const handleAspectChange = (aspect: EngineeringAspectView) => {
    soundEffects.playSwitchClick();
    engineeringContextService.setActiveAspect(aspect);
    setActiveAspect(aspect);
  };

  const handleStageClick = (stageId: EnergyChainPosition) => {
    soundEffects.playSwitchClick();
    switch (stageId) {
      case 'generation':
        onNavigateDomain?.('D01');
        break;
      case 'step_up_substation':
      case 'transmission_grid':
        onNavigateDomain?.('D02');
        break;
      case 'primary_substation':
        onNavigateDomain?.('D03');
        break;
      case 'distribution_network':
        onNavigateDomain?.('D04');
        break;
      case 'industrial_commercial_load':
        onNavigateDomain?.('D07');
        break;
      default:
        onNavigateDomain?.('D03');
        break;
    }
  };

  const aspectIcons: Record<EngineeringAspectView, { Icon: any; label: { fr: string; en: string } }> = {
    physical: { Icon: Eye, label: { fr: 'Physique 3D', en: 'Physical 3D' } },
    electrical: { Icon: Zap, label: { fr: 'Électrique SLD', en: 'Electrical SLD' } },
    protection: { Icon: Shield, label: { fr: 'Protections ANSI', en: 'Protections' } },
    automation_control: { Icon: Cpu, label: { fr: 'Contrôle-BCU', en: 'Control & BCU' } },
    digital_twin: { Icon: Layers, label: { fr: 'Jumeau AAS', en: 'Digital Twin' } },
    standards_lifecycle: { Icon: BookOpen, label: { fr: 'Normes & Rôles', en: 'Standards' } },
  };

  return (
    <>
      <nav
        aria-label="Engineering Context Stack Bar"
        className="w-full bg-slate-950/95 border-b border-slate-800/80 px-3 sm:px-6 py-1.5 backdrop-blur-md sticky top-[57px] z-30 font-mono text-xs shadow-md shadow-black/20"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Energy Chain Flow Stages */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider hidden lg:inline mr-1">
              {locale === 'fr' ? 'CHAÎNE :' : 'CHAIN:'}
            </span>

            {ENERGY_STAGES.map((stage, idx) => {
              const isCurrent = context.energyChainPosition === stage.id;
              return (
                <React.Fragment key={stage.id}>
                  <button
                    type="button"
                    onClick={() => handleStageClick(stage.id)}
                    className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                      isCurrent
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                    }`}
                    title={`${stage.label[locale]} (${stage.voltage})`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-amber-400 animate-ping' : 'bg-slate-600'}`} />
                    <span>{stage.label[locale]}</span>
                  </button>
                  {idx < ENERGY_STAGES.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-slate-700 shrink-0 hidden sm:inline" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Right: Aspect Lenses + "Where Am I?" & History buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Aspect Lens Selector (Desktop) */}
            <div className="hidden xl:flex items-center gap-0.5 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
              {(Object.keys(aspectIcons) as EngineeringAspectView[]).map((key) => {
                const item = aspectIcons[key];
                const IconComponent = item.Icon;
                const isSelected = activeAspect === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleAspectChange(key)}
                    className={`p-1 px-1.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    title={item.label[locale]}
                  >
                    <IconComponent className="h-3 w-3" />
                    <span>{item.label[locale]}</span>
                  </button>
                );
              })}
            </div>

            {/* "Where Am I?" Compass Trigger */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playSwitchClick();
                setIsWhereAmIOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              title={locale === 'fr' ? 'Où suis-je ? (Boussole d\'ingénierie)' : 'Where Am I? (Engineering Compass)'}
            >
              <Compass className="h-3.5 w-3.5 text-amber-400" />
              <span>{locale === 'fr' ? 'OÙ SUIS-JE ?' : 'WHERE AM I?'}</span>
            </button>

            {/* Exploration History Button */}
            {onOpenHistory && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSwitchClick();
                  onOpenHistory();
                }}
                className="p-1 sm:px-2 sm:py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-bold flex items-center gap-1 transition-colors"
                title={locale === 'fr' ? 'Historique d\'exploration & Parcours sauvegardés' : 'Exploration History & Saved Paths'}
              >
                <History className="h-3.5 w-3.5 text-slate-400" />
                <span className="hidden sm:inline">{locale === 'fr' ? 'Historique' : 'History'}</span>
              </button>
            )}

          </div>

        </div>
      </nav>

      {/* Where Am I Compass Drawer */}
      <WhereAmIDrawer
        isOpen={isWhereAmIOpen}
        onClose={() => setIsWhereAmIOpen(false)}
        locale={locale}
        onNavigateDomain={onNavigateDomain}
        onNavigateEquipment={onNavigateEquipment}
        onNavigateCalculator={onNavigateCalculator}
        onNavigateSimulation={onNavigateSimulation}
        onNavigateContextStack={onNavigateContextStack}
      />
    </>
  );
};
