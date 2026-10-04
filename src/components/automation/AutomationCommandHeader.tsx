// src/components/automation/AutomationCommandHeader.tsx
// EPEDE D07 - Master Command Header HUD & Engineering Sizing Bar for Industrial Automation

import React from 'react';
import {
  Cpu,
  Activity,
  Sliders,
  ShieldAlert,
  Server,
  Network,
  Flame,
  Sparkles,
  FileCheck,
  Zap,
  Clock,
  SlidersHorizontal,
  Building2,
  Layers,
  Thermometer,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import {
  AUTOMATION_PROFILES,
  AutomationIndustryKey,
  AutomationIndustryProfile,
  AutomationCalculations
} from './services/useAutomationProjectStore';

interface AutomationCommandHeaderProps {
  locale: 'fr' | 'en';
  activeStage: 1 | 2 | 3 | 4 | 5;
  onSelectStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  selectedIndustryId: AutomationIndustryKey;
  onSelectIndustry: (id: AutomationIndustryKey) => void;
  activeProfile: AutomationIndustryProfile;
  calculations: AutomationCalculations;
  onOpenDossier: () => void;
  onOpenPrinciplesModal: () => void;
}

export const AutomationCommandHeader: React.FC<AutomationCommandHeaderProps> = ({
  locale,
  activeStage,
  onSelectStage,
  selectedIndustryId,
  onSelectIndustry,
  activeProfile,
  calculations,
  onOpenDossier,
  onOpenPrinciplesModal
}) => {
  return (
    <div className="font-mono text-xs rounded-2xl bg-[#090D14] border border-[#222B38] p-4 sm:p-5 shadow-2xl space-y-4">
      
      {/* Top Ribbon: Industry Profile Selector & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#222B38]">
        
        {/* Industry Selector Dropdown / Info */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 text-[11px] uppercase tracking-wider">
              {locale === 'fr' ? 'Typologie d’Installation & Référence Industrielle :' : 'Industrial Facility Profile & Reference:'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedIndustryId}
              onChange={(e) => onSelectIndustry(e.target.value as AutomationIndustryKey)}
              aria-label={locale === 'fr' ? "Typologie d'Installation Industrielle" : "Industrial Facility Typology"}
              className="bg-slate-900 border border-slate-700 hover:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-white font-bold outline-none cursor-pointer transition-all"
            >
              {Object.values(AUTOMATION_PROFILES).map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {locale === 'fr' ? prof.nameFr : prof.nameEn}
                </option>
              ))}
            </select>

            <span className="text-[11px] text-cyan-300/80 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-lg">
              📍 {activeProfile.cameroonReference}
            </span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenPrinciplesModal}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>{locale === 'fr' ? 'Principes & Formules' : 'Formulas & Math'}</span>
          </button>

          <button
            onClick={onOpenDossier}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Dossier & Devis DQE (FCFA)' : 'BOQ / DQE Dossier (FCFA)'}</span>
          </button>
        </div>
      </div>

      {/* Middle Grid: 6 Real-Time Engineering KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: Total I/O Points */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
            <span>Points d’E/S</span>
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono">
            {calculations.totalIoPoints}
          </div>
          <div className="text-[10px] text-slate-500">
            +20% rés : <span className="text-cyan-400 font-semibold">{calculations.totalIoWithReserve}</span>
          </div>
        </div>

        {/* KPI 2: Scan Cycle Time */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
            <span>Cycle PLC</span>
            <Clock className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-purple-400 font-mono">
            {calculations.estimatedScanTimeMs} ms
          </div>
          <div className="text-[10px] text-slate-500">
            Déterminisme CEI 61131
          </div>
        </div>

        {/* KPI 3: 24V DC Auxiliary Power */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
            <span>Alim 24V DC</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-amber-400 font-mono">
            {calculations.power24VWatts} W
          </div>
          <div className="text-[10px] text-slate-500">
            Courant : <span className="text-slate-300 font-semibold">{calculations.power24VAmps} A</span>
          </div>
        </div>

        {/* KPI 4: Heat Dissipation */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
            <span>Pertes Thermiques</span>
            <Thermometer className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-rose-400 font-mono">
            {calculations.heatDissipationWatts} W
          </div>
          <div className="text-[10px] text-slate-500">
            {calculations.heatDissipationBtuHr} BTU/h
          </div>
        </div>

        {/* KPI 5: SIL Safety Level */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
            <span>Sécurité SIS</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className={`text-base sm:text-lg font-bold font-mono ${calculations.isSilCompliant ? 'text-emerald-400' : 'text-rose-400'}`}>
            {calculations.achievedSil}
          </div>
          <div className="text-[10px] text-slate-500">
            PFD : {calculations.pfdAvgCalculated}
          </div>
        </div>

        {/* KPI 6: CapEx Benchmark in Cameroon */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
            <span>Budget Estimé</span>
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono">
            {(calculations.totalEstimatedCapExFcfa / 1_000_000).toFixed(1)} M FCFA
          </div>
          <div className="text-[10px] text-cyan-400">
            ~ {(calculations.totalEstimatedCapExEur / 1000).toFixed(0)} k€
          </div>
        </div>
      </div>

      {/* Bottom Stage Progress Selector (Stages 1 to 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-[#222B38]">
        {[
          {
            num: 1,
            titleFr: '1. Cartographie E/S & Boucles',
            titleEn: '1. I/O Mapping & Loops',
            badgeFr: '4-20mA HART · Bilan 24V DC',
            badgeEn: '4-20mA HART · 24V DC Power'
          },
          {
            num: 2,
            titleFr: '2. Automates CEI 61131 & CPU',
            titleEn: '2. IEC 61131 PLC & CPU',
            badgeFr: 'Ladder 10ms · Hot-Standby',
            badgeEn: 'Ladder 10ms · Hot-Standby'
          },
          {
            num: 3,
            titleFr: '3. Régulation PID & VFD (FOC)',
            titleEn: '3. Closed-Loop PID & VFD',
            badgeFr: 'Ziegler-Nichols · Vecteur FOC',
            badgeEn: 'Ziegler-Nichols · Vector FOC'
          },
          {
            num: 4,
            titleFr: '4. Sûreté SIS/SIL & Réseaux',
            titleEn: '4. Safety SIS/SIL & Networks',
            badgeFr: 'CEI 61508 2oo3 · Profinet IRT',
            badgeEn: 'IEC 61508 2oo3 · Profinet IRT'
          },
          {
            num: 5,
            titleFr: '5. Chantiers Cameroun & DQE',
            titleEn: '5. Cameroon Sites & BOQ',
            badgeFr: 'Nachtigal · Cimencam · DQE',
            badgeEn: 'Nachtigal · Cimencam · BOQ'
          }
        ].map((st) => {
          const isActive = activeStage === st.num;
          return (
            <button
              key={st.num}
              onClick={() => onSelectStage(st.num as any)}
              className={`p-2.5 rounded-xl text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-300'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
              }`}
            >
              <div className="text-[11px] font-bold line-clamp-1">
                {locale === 'fr' ? st.titleFr : st.titleEn}
              </div>
              <div className={`text-[9px] font-mono mt-1 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                {locale === 'fr' ? st.badgeFr : st.badgeEn}
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
