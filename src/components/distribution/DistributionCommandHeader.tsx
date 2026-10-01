// src/components/distribution/DistributionCommandHeader.tsx
// EPEDE D05 - Master Distribution Command Header Component

import React from 'react';
import {
  Zap,
  Layers,
  Activity,
  Sliders,
  Radio,
  BookOpen,
  Info,
  ShieldCheck,
  Building2,
  TreePine,
  Wifi,
  ChevronRight
} from 'lucide-react';

export type DistributionRepresentationView = 'PHYSICAL' | 'ELECTRICAL_SLD' | 'FUNCTIONAL';
export type DistributionEnvironmentContext = 'URBAN' | 'RURAL' | 'HYBRID';
export type DistributionVoltageContext = '30kV' | '15kV' | '20kV' | '400V_230V';

interface DistributionCommandHeaderProps {
  locale: 'fr' | 'en';
  activePillar: string;
  onSelectPillar: (pillar: any) => void;
  activeView: DistributionRepresentationView;
  onSelectView: (view: DistributionRepresentationView) => void;
  selectedEnvironment: DistributionEnvironmentContext;
  onSelectEnvironment: (env: DistributionEnvironmentContext) => void;
  selectedVoltage: DistributionVoltageContext;
  onSelectVoltage: (volt: DistributionVoltageContext) => void;
  onOpenPrinciplesDrawer: () => void;
}

export const DistributionCommandHeader: React.FC<DistributionCommandHeaderProps> = ({
  locale,
  activePillar,
  onSelectPillar,
  activeView,
  onSelectView,
  selectedEnvironment,
  onSelectEnvironment,
  selectedVoltage,
  onSelectVoltage,
  onOpenPrinciplesDrawer
}) => {
  return (
    <header className="rounded-2xl border border-amber-900/60 bg-gradient-to-r from-[#1C1204] via-[#120B02] to-[#0A0702] p-5 sm:p-6 shadow-2xl relative overflow-hidden font-mono">
      {/* Background CAD Ambient Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D97706_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 space-y-4">
        {/* Top Operational Pill & Model Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold text-amber-400 tracking-wider uppercase">
              {locale === 'fr' ? 'EPEDE D05 · RÉSEAUX DE DISTRIBUTION HTA / BT' : 'EPEDE D05 · MV / LV DISTRIBUTION NETWORKS'}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 font-sans text-[11px]">
              {locale === 'fr' ? 'Artère Moyenne Tension → Poste MT/BT → Basse Tension → Usager' : 'MV Feeder → MV/LV Substation → LV Mains → Consumer'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-[10px] text-amber-200 font-bold">
              IEC 60076 · IEC 62271 · IEC 60364
            </span>
            <button
              type="button"
              onClick={onOpenPrinciplesDrawer}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Formules & Principes (Drawer)' : 'Formulas & Principles'}</span>
            </button>
          </div>
        </div>

        {/* Model Disclaimer Bar */}
        <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-900/40 text-[11px] text-amber-200/80 flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="font-sans leading-relaxed">
            <span className="font-bold font-mono text-amber-300">
              {locale === 'fr' ? 'MODÈLE D\'INGÉNIERIE PÉDAGOGIQUE :' : 'EDUCATIONAL ENGINEERING MODEL:'}
            </span>{' '}
            {locale === 'fr'
              ? 'Représentation conceptuelle des topologies HTA/BT, postes de transformation et appareillages. Valeurs de tension (30 kV / 15 kV / 400 V) données à titre représentatif. Ne remplace pas les études de réseau ni les consignes de sécurité réelles.'
              : 'Conceptual representation of MV/LV topologies, distribution substations, and apparatus. Voltage levels (30 kV / 15 kV / 400 V) are representative examples. Not for live switching authorization, relay settings approval, or utility billing.'}
          </p>
        </div>

        {/* Triple Synchronized View Switcher + Environment + Voltage Context */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-amber-950/60">
          {/* 1. Tri-View Controller */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0B0803] border border-amber-900/50">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {locale === 'fr' ? 'VUE :' : 'VIEW:'}
            </span>
            <button
              type="button"
              onClick={() => onSelectView('PHYSICAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'PHYSICAL'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-amber-950/40'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Physique 3D/CAO' : 'Physical 3D'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('ELECTRICAL_SLD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'ELECTRICAL_SLD'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-amber-950/40'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Schéma Électrique (SLD)' : 'Electrical SLD'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('FUNCTIONAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'FUNCTIONAL'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-amber-950/40'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Fonctionnel & Automatismes' : 'Functional & SAS'}</span>
            </button>
          </div>

          {/* 2. Environment Selector (Urban vs. Rural vs. Hybrid) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0B0803] border border-amber-900/50">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {locale === 'fr' ? 'ENVIRONNEMENT :' : 'ENV:'}
            </span>
            <button
              type="button"
              onClick={() => onSelectEnvironment('URBAN')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedEnvironment === 'URBAN'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="h-3.5 w-3.5 text-sky-300" />
              <span>{locale === 'fr' ? 'Urbain (Câbles/Kiosques)' : 'Urban (Cables)'}</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectEnvironment('RURAL')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedEnvironment === 'RURAL'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TreePine className="h-3.5 w-3.5 text-emerald-300" />
              <span>{locale === 'fr' ? 'Rural (Aérien/H61)' : 'Rural (Overhead)'}</span>
            </button>
          </div>

          {/* 3. Voltage Level Pill Context */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0B0803] border border-amber-900/50">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {locale === 'fr' ? 'TENSION :' : 'VOLT:'}
            </span>
            {(['30kV', '15kV', '400V_230V'] as DistributionVoltageContext[]).map((volt) => (
              <button
                key={volt}
                type="button"
                onClick={() => onSelectVoltage(volt)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  selectedVoltage === volt
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                {volt === '400V_230V' ? '400 V / 230 V' : volt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
