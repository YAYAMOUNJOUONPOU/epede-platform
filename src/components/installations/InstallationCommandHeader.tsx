// src/components/installations/InstallationCommandHeader.tsx
// EPEDE D06 - Master Command Header with Archetype, Tri-View, Earthing & Context Selectors

import React from 'react';
import {
  Building2,
  Home,
  ShieldCheck,
  Zap,
  Layers,
  Scale,
  Activity,
  AlertTriangle,
  BookOpen,
  Info,
  Sliders,
  Cpu,
  Power
} from 'lucide-react';
import type {
  FacilityArchetype,
  InstallationViewMode,
  EarthingSystemType,
  OperatingRegime
} from './data/installationCatalog';

interface InstallationCommandHeaderProps {
  locale: 'fr' | 'en';
  activePillar: string;
  onSelectPillar: (pillar: string) => void;
  selectedArchetype: FacilityArchetype;
  onSelectArchetype: (arch: FacilityArchetype) => void;
  activeView: InstallationViewMode;
  onSelectView: (view: InstallationViewMode) => void;
  selectedEarthing: EarthingSystemType;
  onSelectEarthing: (earth: EarthingSystemType) => void;
  selectedRegime: OperatingRegime;
  onSelectRegime: (reg: OperatingRegime) => void;
  onOpenEngineeringDrawer: () => void;
}

export const InstallationCommandHeader: React.FC<InstallationCommandHeaderProps> = ({
  locale,
  activePillar,
  onSelectPillar,
  selectedArchetype,
  onSelectArchetype,
  activeView,
  onSelectView,
  selectedEarthing,
  onSelectEarthing,
  selectedRegime,
  onSelectRegime,
  onOpenEngineeringDrawer
}) => {
  const archetypes: { id: FacilityArchetype; label_fr: string; label_en: string; icon: any }[] = [
    { id: 'RESIDENTIAL', label_fr: 'Résidentiel (Maison / Logement)', label_en: 'Residential (Villa / Flat)', icon: Home },
    { id: 'TERTIARY_COMMERCIAL', label_fr: 'Tertiaire & Commercial (Bureaux)', label_en: 'Commercial & Tertiary (Offices)', icon: Building2 },
    { id: 'PUBLIC_BUILDING', label_fr: 'Bâtiment Public (ERP / Écoles)', label_en: 'Public Building (Assembly)', icon: Scale },
    { id: 'CRITICAL_FACILITY', label_fr: 'Site Critique (Hôpital / Data Center)', label_en: 'Critical Facility (Hospital / DC)', icon: Cpu }
  ];

  const views: { id: InstallationViewMode; label_fr: string; label_en: string; icon: any }[] = [
    { id: 'PHYSICAL', label_fr: 'Vue Physique (Châssis & Coffrets)', label_en: 'Physical View (Enclosures & Racks)', icon: Layers },
    { id: 'ELECTRICAL_SLD', label_fr: 'Schéma Unifilaire Interactif (SLD)', label_en: 'Interactive Single-Line (SLD)', icon: Zap },
    { id: 'FUNCTIONAL', label_fr: 'Vue Fonctionnelle & Automatismes', label_en: 'Functional & Automation Layer', icon: Sliders }
  ];

  const earthingSystems: EarthingSystemType[] = ['TT', 'TN_S', 'TN_C', 'TN_C_S', 'IT'];

  const regimes: { id: OperatingRegime; label_fr: string; label_en: string }[] = [
    { id: 'NORMAL_GRID', label_fr: 'Réseau Normal (400V)', label_en: 'Normal Grid (400V)' },
    { id: 'STANDBY_GENERATOR', label_fr: 'Groupe Secours (ATS)', label_en: 'Standby Genset (ATS)' },
    { id: 'ONLINE_UPS', label_fr: 'Onduleur Critique (UPS)', label_en: 'Critical Online UPS' },
    { id: 'ISLANDED_EMERGENCY', label_fr: 'Mode Îloté / Urgence', label_en: 'Islanded / Emergency' }
  ];

  return (
    <header className="p-5 rounded-2xl bg-[#090D15] border border-[#20293A] shadow-2xl space-y-4 font-mono text-xs">
      {/* 1. Top Title & Educational Disclaimer Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800 text-[10px]">
                EPEDE D06 · BASSE TENSION
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                IEC 60364 · IEC 61439 · NF C 15-100
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-white uppercase tracking-tight mt-0.5">
              {locale === 'fr'
                ? 'INSTALLATIONS ÉLECTRIQUES & UTILISATION DE L\'ÉNERGIE'
                : 'ELECTRICAL INSTALLATIONS & ENERGY UTILIZATION'}
            </h1>
          </div>
        </div>

        {/* Action Button: Engineering Formulas Drawer */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenEngineeringDrawer}
            className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <BookOpen className="h-4 w-4" />
            <span>{locale === 'fr' ? 'Principes & Normes' : 'Formulas & Standards'}</span>
          </button>
        </div>
      </div>

      {/* 2. Educational Model Notice (Mandatory Directive) */}
      <div className="p-3 rounded-xl bg-[#0F1420] border border-amber-900/40 text-slate-300 space-y-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            <span>MODE: Educational Electrical Installation Engineering Model</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {locale === 'fr'
              ? 'Statut : Conceptuel / représentatif · 400 V / 230 V L1-L2-L3-N-PE'
              : 'Status: Conceptual / representative · 400 V / 230 V L1-L2-L3-N-PE'}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
          {locale === 'fr'
            ? 'Exploration visuelle de la distribution d\'énergie, du branchement d\'abonné aux récepteurs terminaux. Ne se substitue pas à une étude d\'ingénierie certifiée, note de calcul de câbles ou consignation sur site.'
            : 'Visual exploration of electrical distribution from the service connection to end-use loads. Not for final design approval, cable sizing, protection settings, installation certification, or live switching.'}
        </p>
      </div>

      {/* 3. Four Core Selectors: Archetype, Tri-View, Earthing & Operating Regime */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* Archetype Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
            {locale === 'fr' ? '1. Typologie d\'Installation :' : '1. Facility Archetype:'}
          </label>
          <div className="grid grid-cols-2 gap-1">
            {archetypes.map((arch) => {
              const Icon = arch.icon;
              const isSelected = arch.id === selectedArchetype;
              return (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => onSelectArchetype(arch.id)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer truncate ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-[#0E1522] text-slate-300 border-[#1E2738] hover:border-amber-400'
                  }`}
                  title={locale === 'fr' ? arch.label_fr : arch.label_en}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-[10px] truncate">
                      {locale === 'fr' ? arch.label_fr.split(' ')[0] : arch.label_en.split(' ')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tri-View Mode Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
            {locale === 'fr' ? '2. Représentation Tri-Vues :' : '2. Tri-View Layer:'}
          </label>
          <div className="grid grid-cols-3 gap-1">
            {views.map((v) => {
              const Icon = v.icon;
              const isSelected = v.id === activeView;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onSelectView(v.id)}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-md shadow-sky-500/20'
                      : 'bg-[#0E1522] text-slate-300 border-[#1E2738] hover:border-sky-400'
                  }`}
                  title={locale === 'fr' ? v.label_fr : v.label_en}
                >
                  <Icon className="h-3.5 w-3.5 mx-auto mb-0.5" />
                  <span className="text-[9px] block truncate">
                    {v.id === 'PHYSICAL' ? 'Physique' : v.id === 'ELECTRICAL_SLD' ? 'Schéma SLD' : 'Fonctions'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Earthing System (TT, TN-S, TN-C, TN-C-S, IT) */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
            {locale === 'fr' ? '3. Régime de Neutre (SLT) :' : '3. Earthing System (SLT):'}
          </label>
          <div className="grid grid-cols-5 gap-1">
            {earthingSystems.map((earth) => {
              const isSelected = earth === selectedEarthing;
              return (
                <button
                  key={earth}
                  type="button"
                  onClick={() => onSelectEarthing(earth)}
                  className={`py-2 rounded-xl text-center border transition-all cursor-pointer font-bold ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-[#0E1522] text-slate-300 border-[#1E2738] hover:border-emerald-400'
                  }`}
                >
                  <span className="text-[10px]">{earth.replace('_', '-')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Operating Regime (Normal, Genset, UPS, Emergency) */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
            {locale === 'fr' ? '4. Source & Régime d\'Alimentation :' : '4. Operating Power Source:'}
          </label>
          <select
            value={selectedRegime}
            onChange={(e) => onSelectRegime(e.target.value as OperatingRegime)}
            className="w-full p-2 rounded-xl bg-[#0E1522] text-amber-400 border border-[#1E2738] font-bold text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {regimes.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {locale === 'fr' ? reg.label_fr : reg.label_en}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
