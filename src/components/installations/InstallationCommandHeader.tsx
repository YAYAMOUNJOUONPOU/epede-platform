// src/components/installations/InstallationCommandHeader.tsx
// EPEDE D06 - Executive Command Header & System State Bar

import React, { useState } from 'react';
import {
  Zap,
  Layers,
  BookOpen,
  Info,
  Sliders,
  ChevronDown,
  X,
  ShieldCheck,
  Building2,
  Scale,
  Sparkles
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
  const isFr = locale === 'fr';
  const [showNotice, setShowNotice] = useState<boolean>(false);

  const archetypes: { id: FacilityArchetype; labelFr: string; labelEn: string }[] = [
    { id: 'RESIDENTIAL', labelFr: 'Immeuble Résidentiel', labelEn: 'Residential Building' },
    { id: 'TERTIARY_COMMERCIAL', labelFr: 'Tertiaire & Bureaux', labelEn: 'Commercial & Offices' },
    { id: 'PUBLIC_BUILDING', labelFr: 'Bâtiment Public / ERP', labelEn: 'Public Assembly / ERP' },
    { id: 'CRITICAL_FACILITY', labelFr: 'Site Critique / Data Center', labelEn: 'Critical / Data Center' }
  ];

  const views: { id: InstallationViewMode; labelFr: string; labelEn: string; icon: any }[] = [
    { id: 'ELECTRICAL_SLD', labelFr: 'Schéma SLD', labelEn: 'SLD Canvas', icon: Zap },
    { id: 'PHYSICAL', labelFr: 'Vue Physique', labelEn: 'Physical Layout', icon: Layers },
    { id: 'FUNCTIONAL', labelFr: 'Fonctionnel', labelEn: 'Functional Logic', icon: Sliders }
  ];

  const earthingSystems: EarthingSystemType[] = ['TT', 'TN_S', 'TN_C', 'TN_C_S', 'IT'];

  const regimes: { id: OperatingRegime; labelFr: string; labelEn: string }[] = [
    { id: 'NORMAL_GRID', labelFr: 'Réseau Normal (400V)', labelEn: 'Normal Grid (400V)' },
    { id: 'STANDBY_GENERATOR', labelFr: 'Groupe Secours (ATS)', labelEn: 'Standby Genset (ATS)' },
    { id: 'ONLINE_UPS', labelFr: 'Onduleur Critique (UPS)', labelEn: 'Critical Online UPS' },
    { id: 'ISLANDED_EMERGENCY', labelFr: 'Mode Îloté / Urgence', labelEn: 'Islanded / Emergency' }
  ];

  return (
    <header className="rounded-2xl bg-gradient-to-r from-slate-950 via-[#0A0E18] to-slate-950 border border-slate-800 shadow-xl font-mono text-xs overflow-hidden">
      {/* Primary Executive Status Ribbon */}
      <div className="p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        {/* Left: Domain Indicator & Active Config Chips */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <div className="text-[11px] font-black text-white tracking-wide flex items-center gap-2">
                <span>D06 · BASSE TENSION</span>
                <span className="text-[10px] text-amber-400 font-normal">400 V / 230 V · 50 Hz</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
              IEC 60364
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
              IEC 61439
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
              NF C 15-100
            </span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => setShowNotice(!showNotice)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              showNotice
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
            title={isFr ? "Avis méthodologique d'ingénierie" : "Engineering methodology notice"}
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{isFr ? 'Avis Pédagogique' : 'Notice'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenEngineeringDrawer}
            className="px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 cursor-pointer font-bold text-[11px]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isFr ? 'Formules & Normes' : 'Formulas & Standards'}</span>
          </button>
        </div>
      </div>

      {/* Secondary Controls Bar: Interactive State Selectors */}
      <div className="p-2.5 sm:px-4 bg-slate-900/40 flex flex-wrap items-center justify-between gap-3 text-[11px]">
        {/* Archetype Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[10px] uppercase font-bold hidden sm:inline">
            {isFr ? 'Site :' : 'Site:'}
          </span>
          <select
            value={selectedArchetype}
            onChange={(e) => onSelectArchetype(e.target.value as FacilityArchetype)}
            className="p-1 px-2.5 rounded-lg bg-slate-950 text-amber-400 border border-slate-800 font-bold focus:outline-none focus:border-amber-400 cursor-pointer text-xs"
          >
            {archetypes.map((arch) => (
              <option key={arch.id} value={arch.id}>
                {isFr ? arch.labelFr : arch.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Earthing System (SLT) */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[10px] uppercase font-bold hidden sm:inline">
            SLT :
          </span>
          <div className="flex items-center gap-1">
            {earthingSystems.map((earth) => {
              const isSelected = earth === selectedEarthing;
              return (
                <button
                  key={earth}
                  type="button"
                  onClick={() => onSelectEarthing(earth)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-xs'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {earth.replace('_', '-')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Operating Power Source / Regime */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[10px] uppercase font-bold hidden lg:inline">
            {isFr ? 'Source :' : 'Source:'}
          </span>
          <select
            value={selectedRegime}
            onChange={(e) => onSelectRegime(e.target.value as OperatingRegime)}
            className="p-1 px-2.5 rounded-lg bg-slate-950 text-sky-400 border border-slate-800 font-bold focus:outline-none focus:border-sky-400 cursor-pointer text-xs"
          >
            {regimes.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {isFr ? reg.labelFr : reg.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Tri-View Mode Selector */}
        <div className="flex items-center gap-1 ml-auto">
          {views.map((v) => {
            const Icon = v.icon;
            const isSelected = v.id === activeView;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectView(v.id)}
                className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 border-sky-400 font-black shadow-xs'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
                title={isFr ? v.labelFr : v.labelEn}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{isFr ? v.labelFr : v.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collapsible Educational Model Notice */}
      {showNotice && (
        <div className="p-3 bg-amber-950/30 border-t border-amber-900/40 text-slate-300 text-[11px] space-y-1 relative">
          <button
            type="button"
            onClick={() => setShowNotice(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="font-bold text-amber-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>MODE : Modèle d'Ingénierie des Installations Basse Tension</span>
          </div>
          <p className="text-slate-300 text-[10px] font-sans leading-relaxed max-w-4xl">
            {isFr
              ? 'Environnement d\'exploration et de calcul pour la conception des installations électriques selon la norme NF C 15-100 / CEI 60364. Les résultats fournis sont conformes aux méthodes standardisées (méthode des impédances, courbes temps-courant TCC, facteur k de conducteurs, guide UTE C 15-105).'
              : 'Exploration and sizing environment for electrical installation design in accordance with IEC 60364 / NF C 15-100 standards. Sizing calculations follow standardized impedance method, TCC log coordination curves, and conductor k-factors.'}
          </p>
        </div>
      )}
    </header>
  );
};
