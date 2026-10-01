// src/components/context/RoleExplorationToolbar.tsx
// EPEDE Phase 7 - Role-Based Exploration Mode Selector
// Filters and prioritizes relevant electrotechnical information per engineering discipline.

import React from 'react';
import {
  Shield,
  Wrench,
  Cpu,
  Building,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import {
  contextStackSessionStore
} from '../../services/contextStackSessionStore';
import type { EngineeringRoleFilter } from '../../types/engineeringIntelligenceExtensions';

interface RoleExplorationToolbarProps {
  activeRole?: EngineeringRoleFilter;
  onChangeRole?: (role: EngineeringRoleFilter) => void;
  locale?: 'fr' | 'en';
}

export const RoleExplorationToolbar: React.FC<RoleExplorationToolbarProps> = ({
  activeRole,
  onChangeRole,
  locale = 'fr'
}) => {
  const [currentRole, setCurrentRole] = React.useState<EngineeringRoleFilter>(
    activeRole || contextStackSessionStore.getActiveRole()
  );
  const isFr = locale === 'fr';

  React.useEffect(() => {
    if (activeRole) {
      setCurrentRole(activeRole);
    } else {
      const unsubscribe = contextStackSessionStore.subscribe(() => {
        setCurrentRole(contextStackSessionStore.getActiveRole());
      });
      return () => unsubscribe();
    }
  }, [activeRole]);

  const rolesList: Array<{
    id: EngineeringRoleFilter;
    labelFr: string;
    labelEn: string;
    icon: React.ComponentType<{ className?: string }>;
    focusSummaryFr: string;
    focusSummaryEn: string;
    color: string;
  }> = [
    {
      id: 'ALL',
      labelFr: 'Vue d\'Ingénierie Complète',
      labelEn: 'Comprehensive Engineering View',
      icon: Layers,
      focusSummaryFr: 'Affiche l\'ensemble des 37 dimensions et relations.',
      focusSummaryEn: 'Displays all 37 dimensions and relationships.',
      color: 'text-sky-400 bg-sky-950/60 border-sky-800'
    },
    {
      id: 'PROTECTION',
      labelFr: 'Ingénieur Protections (ANSI)',
      labelEn: 'Protection Engineer (ANSI)',
      icon: Shield,
      focusSummaryFr: 'Met en avant TC/TP, relais IED, seuils temps-courant, déclenchements et zones.',
      focusSummaryEn: 'Prioritizes CT/VTs, IED relays, TCC curves, trip coils, and protection zones.',
      color: 'text-rose-400 bg-rose-950/60 border-rose-800'
    },
    {
      id: 'MAINTENANCE',
      labelFr: 'Ingénieur Maintenance & Diagnostic',
      labelEn: 'Maintenance & Asset Engineer',
      icon: Wrench,
      focusSummaryFr: 'Met en avant analyse DGA huile, thermographie, FMEA, LOTO et révisions.',
      focusSummaryEn: 'Prioritizes DGA oil analysis, thermography, FMEA failure modes, LOTO & overhauls.',
      color: 'text-amber-400 bg-amber-950/60 border-amber-800'
    },
    {
      id: 'COMMISSIONING',
      labelFr: 'Ingénieur Essais & Mise en Service',
      labelEn: 'Commissioning Engineer (SAT)',
      icon: Cpu,
      focusSummaryFr: 'Met en avant essais FAT/SAT, verrouillages 52/89, injection secondaire et mise sous tension.',
      focusSummaryEn: 'Prioritizes FAT/SAT tests, 52/89 interlocks, secondary injection, and energization checks.',
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
    },
    {
      id: 'BUILDING_ELECTRICAL',
      labelFr: 'Ingénieur Électrique Bâtiment & TGBT',
      labelEn: 'Building Electrical & Industrial',
      icon: Building,
      focusSummaryFr: 'Met en avant TGBT, câbles, chutes de tension, compensation réactive, ATS et régimes SLT.',
      focusSummaryEn: 'Prioritizes main switchboards, cables, voltage drops, PFC, ATS, and earthing schemes.',
      color: 'text-purple-400 bg-purple-950/60 border-purple-800'
    },
    {
      id: 'OPERATOR',
      labelFr: 'Exploitant & Conduite Réseau (SCADA)',
      labelEn: 'Grid Dispatcher & Operator',
      icon: Activity,
      focusSummaryFr: 'Met en avant télémesures, commandes de disjoncteurs, états SF6 et alarmes dispatching.',
      focusSummaryEn: 'Prioritizes SCADA telemetry, breaker commands, SF6 density, and dispatch alarms.',
      color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800'
    }
  ];

  const handleSelectRole = (roleId: EngineeringRoleFilter) => {
    setCurrentRole(roleId);
    contextStackSessionStore.setActiveRole(roleId);
    onChangeRole?.(roleId);
  };

  const activeRoleConfig = rolesList.find((r) => r.id === currentRole) || rolesList[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#090D14] p-4 space-y-3 font-sans text-slate-200">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="font-bold text-white uppercase tracking-wider">
            {isFr ? 'MODE D\'EXPLORATION MÉTIER & FILTRE DE RÔLE' : 'ROLE-BASED EXPLORATION MODE'}
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          {isFr ? 'Priorise les détails selon votre spécialité sans masquer les autres disciplines' : 'Prioritizes information by discipline without hiding broader context'}
        </span>
      </div>

      {/* Role Buttons Chip Bar */}
      <div className="flex flex-wrap gap-2 pt-1">
        {rolesList.map((r) => {
          const isSelected = currentRole === r.id;
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => handleSelectRole(r.id)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-sky-950 border-sky-400 text-white shadow-md shadow-sky-900/30 scale-102 ring-1 ring-sky-400'
                  : 'bg-[#0E141F] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{isFr ? r.labelFr : r.labelEn}</span>
              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
            </button>
          );
        })}
      </div>

      {/* Dynamic Role Focus Notification Pill */}
      {currentRole !== 'ALL' && (
        <div className="p-2.5 rounded-xl bg-[#0E1522] border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>
              <strong>{isFr ? 'Filtre Actif :' : 'Active Filter :'}</strong> {isFr ? activeRoleConfig.focusSummaryFr : activeRoleConfig.focusSummaryEn}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSelectRole('ALL')}
            className="text-[10px] text-sky-400 hover:text-sky-300 underline font-mono cursor-pointer ml-3 shrink-0"
          >
            {isFr ? 'Réinitialiser (Tous)' : 'Reset (All)'}
          </button>
        </div>
      )}

    </div>
  );
};
