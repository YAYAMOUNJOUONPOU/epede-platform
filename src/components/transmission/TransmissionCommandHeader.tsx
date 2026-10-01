// src/components/transmission/TransmissionCommandHeader.tsx
// EPEDE D03 - Transmission Networks Master Interactive Command Header

import React from 'react';
import {
  Zap,
  Layers,
  FolderTree,
  Scale,
  ShieldAlert,
  Activity,
  Compass,
  FileCode2,
  Share2,
  ChevronRight,
  Info,
  Sliders,
  MapPin,
  Calculator,
  Radio,
  Sparkles,
  Gauge
} from 'lucide-react';
import type { TransmissionWorkbenchPillar } from './TransmissionWorkbench';

export type TransmissionTechnology = 'OVERHEAD_LINE' | 'UNDERGROUND_CABLE' | 'COMPARISON';
export type TransmissionVoltageContext = '400kV' | '225kV' | '90kV';

interface TransmissionCommandHeaderProps {
  locale: 'fr' | 'en';
  activePillar: TransmissionWorkbenchPillar;
  onSelectPillar: (pillar: TransmissionWorkbenchPillar) => void;
  selectedTechnology: TransmissionTechnology;
  onSelectTechnology: (tech: TransmissionTechnology) => void;
  selectedVoltage: TransmissionVoltageContext;
  onSelectVoltage: (voltage: TransmissionVoltageContext) => void;
  currentBreadcrumb?: string[];
  onOpenPrinciplesDrawer?: () => void;
}

export const TransmissionCommandHeader: React.FC<TransmissionCommandHeaderProps> = ({
  locale,
  activePillar,
  onSelectPillar,
  selectedTechnology,
  onSelectTechnology,
  selectedVoltage,
  onSelectVoltage,
  currentBreadcrumb = ['Nachtigal - Bekoko 225 kV', 'Pylône P14 (Suspension)'],
  onOpenPrinciplesDrawer
}) => {
  return (
    <div className="space-y-3 font-mono">
      {/* 1. Master System Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0F141C] via-[#0B0F17] to-[#121824] border border-[#222B38] shadow-2xl relative overflow-hidden">
        {/* Subtle decorative grid background glow & gradient lines */}
        <div className="absolute top-0 right-0 w-[500px] h-full bg-gradient-to-l from-sky-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left Title & System Description */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 tracking-wider">
                DOMAINE D03 · TRANSPORT HTB (HV / EHV)
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                DISPATCHING SONATREL ACTIF
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] text-slate-400 bg-slate-900/80 border border-slate-700/80">
                CEI 60826 · CEI 60840 · IEEE 738 · CIGRE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-sky-500/20 border border-amber-500/30 text-amber-400 shadow-inner">
                <Zap className="h-6 w-6 text-amber-400 animate-pulse" />
              </span>
              <span>
                {locale === 'fr'
                  ? 'Réseaux de Transport Haute Tension'
                  : 'HV & EHV Transmission Networks'}
              </span>
            </h1>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed font-sans font-normal">
              {locale === 'fr'
                ? 'Console maîtresse d\'ingénierie électrotechnique : dimensionnement des lignes aériennes (OHL) et câbles souterrains (UGC), transit de puissance, équation caténaire, transit réactif distribué R-L-C-G et protection différentielle 87L / distance 21.'
                : 'Master electrical engineering console: overhead lines (OHL) & underground cable links (UGC), bulk power transfer, catenary tension formulas, distributed R-L-C-G charging, and dual 21 distance / 87L line differential relaying.'}
            </p>
          </div>

          {/* Right Dispatching Telemetry & Model Status */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
            {/* Live Frequency & Power Pool Status Badge */}
            <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] text-[11px] text-slate-300 space-y-1.5 w-full sm:w-auto min-w-[240px]">
              <div className="flex items-center justify-between gap-3 text-slate-400 text-[10px] border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                  <Radio className="h-3 w-3 text-sky-400 animate-pulse" />
                  RÉSEAU RIS (CAMEROUN)
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  N-1 SÉCURISÉ
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 block">Fréquence Réseau :</span>
                  <span className="text-white font-bold text-sm">50.01 Hz</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Transit Nachtigal :</span>
                  <span className="text-amber-400 font-bold text-sm">420 MW</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Tension Réseau :</span>
                  <span className="text-sky-400 font-bold text-sm">227.4 kV</span>
                </div>
              </div>
            </div>

            {/* Principles Drawer Quick Trigger Button */}
            {onOpenPrinciplesDrawer && (
              <button
                type="button"
                onClick={onOpenPrinciplesDrawer}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-amber-500/10"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Formulaire & Principes Mathématiques' : 'Formulas & Governing Laws'}</span>
                <ChevronRight className="h-3 w-3 text-amber-400/70" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Interactive Technology & Voltage Context Control Bar */}
        <div className="mt-5 pt-4 border-t border-[#222B38] flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Technology Selector (OHL, UGC, COMPARISON) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 text-[11px] font-bold mr-1">
              {locale === 'fr' ? 'Filière Technologique :' : 'Technology Track:'}
            </span>

            <button
              type="button"
              onClick={() => {
                onSelectTechnology('OVERHEAD_LINE');
                onSelectPillar('OHL_EXPLORER');
              }}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                selectedTechnology === 'OVERHEAD_LINE'
                  ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-md shadow-sky-500/25'
                  : 'bg-[#090D14] text-slate-300 border-[#222B38] hover:text-white hover:border-sky-500/40'
              }`}
            >
              <FolderTree className="h-4 w-4" />
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">
                  {locale === 'fr' ? 'Ligne Aérienne (OHL)' : 'Overhead Line (OHL)'}
                </div>
                <div className={`text-[9px] font-normal leading-none ${
                  selectedTechnology === 'OVERHEAD_LINE' ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  Pylônes & Faisceaux Aster
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTechnology('UNDERGROUND_CABLE');
                onSelectPillar('UGC_EXPLORER');
              }}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                selectedTechnology === 'UNDERGROUND_CABLE'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/25'
                  : 'bg-[#090D14] text-slate-300 border-[#222B38] hover:text-white hover:border-amber-500/40'
              }`}
            >
              <Layers className="h-4 w-4" />
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">
                  {locale === 'fr' ? 'Câble Souterrain (UGC)' : 'Underground Cable (UGC)'}
                </div>
                <div className={`text-[9px] font-normal leading-none ${
                  selectedTechnology === 'UNDERGROUND_CABLE' ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  XLPE 11 Couches & Tranchée
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTechnology('COMPARISON');
                onSelectPillar('COMPARISON');
              }}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                selectedTechnology === 'COMPARISON'
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/25'
                  : 'bg-[#090D14] text-slate-300 border-[#222B38] hover:text-white hover:border-emerald-500/40'
              }`}
            >
              <Scale className="h-4 w-4" />
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">
                  {locale === 'fr' ? 'Comparatif OHL vs UGC' : 'OHL vs UGC Benchmark'}
                </div>
                <div className={`text-[9px] font-normal leading-none ${
                  selectedTechnology === 'COMPARISON' ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  12 Dimensions d'Analyse
                </div>
              </div>
            </button>
          </div>

          {/* Voltage Level Context Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-bold mr-1">
              {locale === 'fr' ? 'Palier de Tension :' : 'Voltage Level:'}
            </span>
            {(['400kV', '225kV', '90kV'] as TransmissionVoltageContext[]).map((v) => {
              const isSelected = selectedVoltage === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => onSelectVoltage(v)}
                  className={`px-3 py-1.5 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                    isSelected
                      ? v === '400kV'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-400 shadow-sm'
                        : v === '225kV'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                      : 'bg-[#090D14] text-slate-400 border-[#222B38] hover:text-white'
                  }`}
                >
                  <span className="font-extrabold">{v}</span>
                  <span className="text-[10px] ml-1 font-normal opacity-75 hidden sm:inline">
                    {v === '400kV' ? '(Interco)' : v === '225kV' ? '(Dorsale)' : '(Sous-Trans)'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Interactive Context Breadcrumb & Quick Jump Navigation */}
        <div className="mt-3.5 pt-3.5 border-t border-[#222B38] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-sky-400 shrink-0" />
            <span className="text-slate-500 uppercase text-[10px] font-bold">Ouvrage Actif :</span>
            <span className="text-white font-bold">{currentBreadcrumb[0]}</span>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <span className="text-sky-400 font-semibold">{currentBreadcrumb[1] || 'Vue Générale'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-[10px] text-slate-500 mr-1 uppercase">Accès Rapide :</span>
            <button
              type="button"
              onClick={() => onSelectPillar('JOURNEY')}
              className="px-2.5 py-1 rounded-md bg-[#090D14] text-slate-300 hover:text-white border border-[#222B38] hover:border-slate-500 transition-colors"
            >
              Parcours Maître
            </button>
            <button
              type="button"
              onClick={() => onSelectPillar('VIEWS')}
              className="px-2.5 py-1 rounded-md bg-[#090D14] text-cyan-300 hover:text-cyan-200 border border-[#222B38] hover:border-cyan-500/40 transition-colors"
            >
              Vues Flèche / Pi
            </button>
            <button
              type="button"
              onClick={() => onSelectPillar('PROTECTION')}
              className="px-2.5 py-1 rounded-md bg-[#090D14] text-red-300 hover:text-red-200 border border-[#222B38] hover:border-red-500/40 transition-colors"
            >
              Protections 21 / 87L
            </button>
            <button
              type="button"
              onClick={() => onSelectPillar('SCENARIOS')}
              className="px-2.5 py-1 rounded-md bg-[#090D14] text-amber-300 hover:text-amber-200 border border-[#222B38] hover:border-amber-500/40 transition-colors"
            >
              16 Scénarios
            </button>
            <button
              type="button"
              onClick={() => onSelectPillar('DATA_REUSE')}
              className="px-2.5 py-1 rounded-md bg-[#090D14] text-emerald-300 hover:text-emerald-200 border border-[#222B38] hover:border-emerald-500/40 transition-colors"
            >
              Interconnexions EPEDE
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
