// src/components/context/ObjectRelationshipActionBar.tsx
// EPEDE - Universal 10-Action Object Relationship Action Hub
// Attached to any equipment, substation bay, or calculation node to immediately trace upstream/downstream and cross-discipline links.

import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  Shield,
  Activity,
  Cpu,
  Radio,
  Layers,
  RefreshCw,
  BookOpen,
  Users,
  ChevronDown,
  Check,
} from 'lucide-react';
import { canonicalGraph } from '../../data/canonicalGraphEngine';
import { soundEffects } from '../../services/soundEffectsService';

export type RelationshipActionType =
  | 'upstream'
  | 'downstream'
  | 'protection'
  | 'measurement'
  | 'control'
  | 'communication'
  | 'earthing'
  | 'lifecycle'
  | 'standards'
  | 'roles';

interface ObjectRelationshipActionBarProps {
  nodeId?: string;
  locale: 'fr' | 'en';
  onSelectAction?: (action: RelationshipActionType) => void;
  onNavigateContextStack?: (nodeId?: string) => void;
  onNavigateDomain?: (domainCode: string) => void;
  onNavigateCalculator?: (tab: any) => void;
  onNavigateSimulation?: (tab: any) => void;
  activeAction?: RelationshipActionType;
  className?: string;
}

export const ObjectRelationshipActionBar: React.FC<ObjectRelationshipActionBarProps> = ({
  nodeId,
  locale,
  onSelectAction,
  onNavigateContextStack,
  onNavigateDomain,
  onNavigateCalculator,
  onNavigateSimulation,
  activeAction,
  className = '',
}) => {
  const [selectedTab, setSelectedTab] = useState<RelationshipActionType>(activeAction || 'upstream');

  const actions: Array<{
    id: RelationshipActionType;
    label: { fr: string; en: string };
    shortLabel: { fr: string; en: string };
    Icon: any;
    color: string;
  }> = [
    { id: 'upstream', label: { fr: '⚡ Tracer Amont', en: '⚡ Trace Upstream' }, shortLabel: { fr: 'Amont', en: 'Upstream' }, Icon: Zap, color: 'hover:text-amber-300 hover:border-amber-500/50' },
    { id: 'downstream', label: { fr: '🔌 Tracer Aval', en: '🔌 Trace Downstream' }, shortLabel: { fr: 'Aval', en: 'Downstream' }, Icon: ArrowRight, color: 'hover:text-emerald-300 hover:border-emerald-500/50' },
    { id: 'protection', label: { fr: '🛡️ Chaîne Protection', en: '🛡️ Protection Path' }, shortLabel: { fr: 'Protections', en: 'Protections' }, Icon: Shield, color: 'hover:text-rose-300 hover:border-rose-500/50' },
    { id: 'measurement', label: { fr: '📊 Chaîne Mesure', en: '📊 Measurement Path' }, shortLabel: { fr: 'Mesures (TC/TT)', en: 'Measurements' }, Icon: Activity, color: 'hover:text-cyan-300 hover:border-cyan-500/50' },
    { id: 'control', label: { fr: '🎛️ Contrôle-BCU', en: '🎛️ Control Path' }, shortLabel: { fr: 'Contrôle', en: 'Control' }, Icon: Cpu, color: 'hover:text-blue-300 hover:border-blue-500/50' },
    { id: 'communication', label: { fr: '📡 Télécom CEI 61850', en: '📡 Communication Path' }, shortLabel: { fr: 'Télécom', en: 'Telecom' }, Icon: Radio, color: 'hover:text-indigo-300 hover:border-indigo-500/50' },
    { id: 'earthing', label: { fr: '⏚ Terre & SLT', en: '⏚ Earthing Path' }, shortLabel: { fr: 'Terre & Neutre', en: 'Earthing' }, Icon: Layers, color: 'hover:text-teal-300 hover:border-teal-500/50' },
    { id: 'lifecycle', label: { fr: '🔄 Cycle de Vie', en: '🔄 Lifecycle' }, shortLabel: { fr: 'Cycle de Vie', en: 'Lifecycle' }, Icon: RefreshCw, color: 'hover:text-yellow-300 hover:border-yellow-500/50' },
    { id: 'standards', label: { fr: '📜 Normes Applicables', en: '📜 Standards' }, shortLabel: { fr: 'Normes CEI', en: 'Standards' }, Icon: BookOpen, color: 'hover:text-purple-300 hover:border-purple-500/50' },
    { id: 'roles', label: { fr: '👷 Rôles Métier', en: '👷 Related Roles' }, shortLabel: { fr: 'Rôles', en: 'Roles' }, Icon: Users, color: 'hover:text-sky-300 hover:border-sky-500/50' },
  ];

  const handleActionClick = (actionId: RelationshipActionType) => {
    soundEffects.playSwitchClick();
    setSelectedTab(actionId);
    if (onSelectAction) onSelectAction(actionId);
  };

  return (
    <div className={`rounded-xl bg-slate-950/90 border border-slate-800 p-2 sm:p-2.5 font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 mb-2 px-1">
        <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-amber-400" />
          <span>{locale === 'fr' ? '10 ACTIONS DE TRAÇABILITÉ & RELATIONS D\'INGÉNIERIE' : '10 ENGINEERING RELATIONSHIP & TRACE ACTIONS'}</span>
        </span>
        <span className="text-[9px] text-slate-500">IEC / CIGRE Graph Traversal</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {actions.map((act) => {
          const IconComp = act.Icon;
          const isSelected = selectedTab === act.id;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => handleActionClick(act.id)}
              className={`p-1.5 sm:p-2 rounded-lg border text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5 transition-all text-left truncate ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-xs'
                  : `bg-slate-900/80 text-slate-300 border-slate-800/90 ${act.color}`
              }`}
              title={act.label[locale]}
            >
              <IconComp className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="truncate">{act.shortLabel[locale]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
