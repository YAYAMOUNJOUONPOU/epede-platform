// src/components/grid-architecture/GridPlanningCommandHeader.tsx
// EPEDE D02 - Master Command Header HUD & Engineering Sizing Bar

import React from 'react';
import {
  Layers,
  Activity,
  Zap,
  GitFork,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  TrendingUp,
  FileCheck,
  Radio,
  RotateCw,
  Compass,
  Sparkles,
  Info
} from 'lucide-react';
import { GRID_PLANNING_SCENARIOS } from './data/gridPlanningScenariosData';
import { GridPlanningCalculations } from './services/useGridPlanningProjectStore';

interface GridPlanningCommandHeaderProps {
  locale: 'fr' | 'en';
  activeStage: 1 | 2 | 3 | 4 | 5;
  onSelectStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
  isN1Triggered: boolean;
  onToggleN1Trigger: () => void;
  onOpenDossier: () => void;
  onOpenPrinciplesModal: () => void;
  calculations: GridPlanningCalculations;
  transitPowerMw: number;
  voltageKv: number;
}

export const GridPlanningCommandHeader: React.FC<GridPlanningCommandHeaderProps> = ({
  locale,
  activeStage,
  onSelectStage,
  selectedScenarioId,
  onSelectScenario,
  isN1Triggered,
  onToggleN1Trigger,
  onOpenDossier,
  onOpenPrinciplesModal,
  calculations,
  transitPowerMw,
  voltageKv
}) => {
  return (
    <div className="font-mono text-xs rounded-2xl bg-[#090D14] border border-[#222B38] p-4 sm:p-5 shadow-2xl space-y-4">
      
      {/* Top Ribbon: Scenario Selector, N-1 Trigger & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#222B38]">
        
        {/* Scenario Selector Dropdown / Pills */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              {locale === 'fr' ? 'Scénario de Planification Actif (Réseau Cameroun) :' : 'Active Planning Scenario (Cameroon Grid):'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {GRID_PLANNING_SCENARIOS.map((scen) => {
              const isSelected = scen.id === selectedScenarioId;
              return (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => onSelectScenario(scen.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer truncate max-w-xs ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md ring-1 ring-sky-400/40'
                      : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-white hover:bg-[#141B26]'
                  }`}
                  title={scen.title[locale]}
                >
                  {scen.title[locale]}
                </button>
              );
            })}
          </div>
        </div>

        {/* N-1 Contingency Trigger & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* N-1 Simulation Toggle */}
          <button
            type="button"
            onClick={onToggleN1Trigger}
            className={`px-3.5 py-2 rounded-xl border font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
              isN1Triggered
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-rose-500/20 ring-1 ring-rose-400 animate-pulse'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            {isN1Triggered ? <ShieldAlert className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            <span>
              {isN1Triggered
                ? (locale === 'fr' ? 'Déclenchement N-1 ACTIF' : 'N-1 Outage TRIGGERED')
                : (locale === 'fr' ? 'Simuler Déclenchement N-1' : 'Trigger N-1 Contingency')}
            </span>
          </button>

          {/* Formules et Principes */}
          <button
            type="button"
            onClick={onOpenPrinciplesModal}
            className="px-3 py-2 rounded-xl bg-[#0E141F] hover:bg-[#162030] text-slate-300 border border-[#222B38] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title={locale === 'fr' ? 'Formulations Mathématiques Load Flow' : 'Mathematical Formulations'}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{locale === 'fr' ? 'Formulations' : 'Formulations'}</span>
          </button>

          {/* Dossier de Planification */}
          <button
            type="button"
            onClick={onOpenDossier}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-sky-500/20 cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            <span>{locale === 'fr' ? 'Dossier DQE' : 'Planning BOQ'}</span>
          </button>
        </div>

      </div>

      {/* 6-Parameter Live Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        
        {/* 1. Tension de Référence */}
        <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>{locale === 'fr' ? 'Tension Dorsale' : 'Bus Voltage'}</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base font-black text-white font-mono">{voltageKv} kV</div>
          <div className="text-[9px] text-slate-500 font-mono">SONATREL RIS / RIN</div>
        </div>

        {/* 2. Puissance Transitée */}
        <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>{locale === 'fr' ? 'Transit de Ligne' : 'Transit Power'}</span>
            <Activity className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-base font-black text-sky-300 font-mono">{transitPowerMw} MW</div>
          <div className="text-[9px] text-slate-500 font-mono">In = {calculations.statorOrLineCurrentAmps} A</div>
        </div>

        {/* 3. Chute de Tension & Tension Nodale Arrivée */}
        <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>{locale === 'fr' ? 'Tension Arrivée' : 'Receiving Bus'}</span>
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-base font-black text-cyan-300 font-mono">{calculations.receivingEndVoltageKv} kV</div>
          <div className="text-[9px] text-slate-500 font-mono">ΔU = -{calculations.voltageDropKv} kV ({calculations.voltageDropPct}%)</div>
        </div>

        {/* 4. Pertes Joule */}
        <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>{locale === 'fr' ? 'Pertes Joule 3RI²' : 'Joule Losses'}</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-base font-black text-purple-300 font-mono">{calculations.jouleLossesMw} MW</div>
          <div className="text-[9px] text-slate-500 font-mono">{calculations.jouleLossesPct}% du transit</div>
        </div>

        {/* 5. Taux de Charge Ligne */}
        <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>{locale === 'fr' ? 'Charge Thermique' : 'Line Loading'}</span>
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className={`text-base font-black font-mono ${
            calculations.transmissionLoadingPct > 100 ? 'text-rose-400' : calculations.transmissionLoadingPct > 85 ? 'text-amber-400' : 'text-emerald-300'
          }`}>
            {calculations.transmissionLoadingPct}%
          </div>
          <div className="text-[9px] text-slate-500 font-mono">SIL = {calculations.surgeImpedanceLoadingMw} MW</div>
        </div>

        {/* 6. Verdict Sécurité N-1 */}
        <div className="p-3 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>{locale === 'fr' ? 'Conformité N-1' : 'N-1 Security'}</span>
            {calculations.isN1Compliant ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
          </div>
          <div className={`text-xs font-black font-mono mt-1 ${calculations.isN1Compliant ? 'text-emerald-400' : 'text-rose-400'}`}>
            {calculations.isN1Compliant ? (locale === 'fr' ? 'RÉSEAU STABLE' : 'GRID SECURE') : (locale === 'fr' ? 'RISQUE SURCHARGE' : 'THERMAL SURGE')}
          </div>
          <div className="text-[9px] text-slate-500 font-mono">SAIDI est. {calculations.estimatedSaidiHoursPerYear} h/an</div>
        </div>

      </div>

      {/* 5-Stage Progressive Navigation Bar */}
      <div className="pt-2 border-t border-[#222B38]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {[
            { stage: 1 as const, titleFr: '1. Cartographie & 15 Étapes', titleEn: '1. Macro Grid & 15 Stages', desc: 'Du barrage à la charge' },
            { stage: 2 as const, titleFr: '2. Physique & Paliers (SIL)', titleEn: '2. Physics & Voltage (SIL)', desc: 'Pertes 3RI² & Impédance' },
            { stage: 3 as const, titleFr: '3. Topologies & SAIDI/SAIFI', titleEn: '3. Topologies & Reliability', desc: 'Maillage & Continuité' },
            { stage: 4 as const, titleFr: '4. Postes HTB & Verrouillages', titleEn: '4. Substations & Interlocks', desc: 'Schéma SLD & Aiguillage' },
            { stage: 5 as const, titleFr: '5. Planification N-1 & Dossier DQE', titleEn: '5. Planning N-1 & BOQ', desc: 'Adéquation & CapEx FCFA' }
          ].map((st) => {
            const isSelected = activeStage === st.stage;
            return (
              <button
                key={st.stage}
                type="button"
                onClick={() => onSelectStage(st.stage)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg shadow-sky-600/25 ring-1 ring-sky-400'
                    : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-white hover:bg-[#161B22]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs truncate">
                    {locale === 'fr' ? st.titleFr : st.titleEn}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-ping" />}
                </div>
                <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                  {st.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
