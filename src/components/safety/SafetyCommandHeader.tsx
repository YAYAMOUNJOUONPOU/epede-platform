// src/components/safety/SafetyCommandHeader.tsx
// EPEDE D16 - Master Command Header HUD & Engineering Sizing Bar for Electrical Safety, Earthing & Lightning

import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Flame,
  Activity,
  Sliders,
  Layers,
  Sparkles,
  FileSpreadsheet,
  SlidersHorizontal,
  MapPin,
  Clock,
  Waves
} from 'lucide-react';
import {
  SAFETY_SITE_PROFILES,
  SafetySiteKey,
  SafetySiteProfile,
  SafetyCalculations
} from './services/useSafetyProjectStore';

interface SafetyCommandHeaderProps {
  locale: 'fr' | 'en';
  activeStage: 1 | 2 | 3 | 4 | 5;
  onSelectStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  selectedSiteId: SafetySiteKey;
  onSelectSite: (id: SafetySiteKey) => void;
  activeProfile: SafetySiteProfile;
  calculations: SafetyCalculations;
  onOpenDossier: () => void;
  onOpenPrinciplesModal: () => void;
}

export const SafetyCommandHeader: React.FC<SafetyCommandHeaderProps> = ({
  locale,
  activeStage,
  onSelectStage,
  selectedSiteId,
  onSelectSite,
  activeProfile,
  calculations,
  onOpenDossier,
  onOpenPrinciplesModal
}) => {
  return (
    <div className="font-mono text-xs rounded-2xl bg-[#090D14] border border-[#222B38] p-4 sm:p-5 shadow-2xl space-y-4">
      
      {/* Top Ribbon: Site Profiler & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#222B38]">
        
        {/* Site Selector Dropdown */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-[11px] uppercase tracking-wider">
              {locale === 'fr' ? 'Site d’Ingénierie & Contexte de Sol Camerounais :' : 'Engineering Site & Cameroon Soil Context:'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedSiteId}
              onChange={(e) => onSelectSite(e.target.value as SafetySiteKey)}
              aria-label={locale === 'fr' ? "Sélectionner le Site d'Ingénierie" : "Select Engineering Site"}
              className="bg-slate-900 border border-slate-700 hover:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-white font-bold outline-none cursor-pointer transition-all"
            >
              {Object.values(SAFETY_SITE_PROFILES).map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {locale === 'fr' ? prof.nameFr : prof.nameEn}
                </option>
              ))}
            </select>

            <span className="text-[11px] text-amber-300/80 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-lg">
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
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>{locale === 'fr' ? 'Principes & Formules' : 'Formulas & Math'}</span>
          </button>

          <button
            onClick={onOpenDossier}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Dossier & Devis DQE (FCFA)' : 'BOQ / DQE Dossier (FCFA)'}</span>
          </button>
        </div>
      </div>

      {/* Middle Grid: 6 Real-Time Safety & Earthing KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: Ground Resistance Rg */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
            <span>Résistance Terre</span>
            <Waves className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className={`text-base sm:text-lg font-bold font-mono ${calculations.groundResistanceRg <= activeProfile.targetResistanceOhm ? 'text-emerald-400' : 'text-rose-400'}`}>
            {calculations.groundResistanceRg} Ω
          </div>
          <div className="text-[10px] text-slate-500">
            Cible : &lt; {activeProfile.targetResistanceOhm} Ω (Sverak)
          </div>
        </div>

        {/* KPI 2: Ground Potential Rise (GPR) */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
            <span>Potentiel GPR</span>
            <Zap className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-rose-400 font-mono">
            {(calculations.gprVolts / 1000).toFixed(1)} kV
          </div>
          <div className="text-[10px] text-slate-500">
            Sous {activeProfile.faultCurrentKa} kA défaut
          </div>
        </div>

        {/* KPI 3: Mesh Voltage vs Tolerable Touch */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
            <span>Tension Toucher</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className={`text-base sm:text-lg font-bold font-mono ${calculations.isTouchSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
            {calculations.meshVoltageVolts} V
          </div>
          <div className="text-[10px] text-slate-500">
            Tolérable : {calculations.tolerableTouchVolts} V
          </div>
        </div>

        {/* KPI 4: Arc Flash Incident Energy */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
            <span>Énergie d’Arc</span>
            <Flame className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-orange-400 font-mono">
            {calculations.arcIncidentEnergyCalCm2} cal/cm²
          </div>
          <div className="text-[10px] text-slate-500 line-clamp-1">
            {calculations.arcPpeCategory}
          </div>
        </div>

        {/* KPI 5: Expected Lightning Strikes */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
            <span>Impacts Foudre</span>
            <Zap className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-purple-400 font-mono">
            {calculations.expectedLightningStrikesPerYear} / an
          </div>
          <div className="text-[10px] text-slate-500">
            Td = {activeProfile.keraunicDaysPerYear} j/an
          </div>
        </div>

        {/* KPI 6: CapEx Benchmark in Cameroon */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
            <span>Budget Ouvrages</span>
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-white font-mono">
            {(calculations.totalEstimatedCapExFcfa / 1_000_000).toFixed(1)} M FCFA
          </div>
          <div className="text-[10px] text-emerald-400">
            ~ {(calculations.totalEstimatedCapExEur / 1000).toFixed(0)} k€
          </div>
        </div>
      </div>

      {/* Bottom Stage Progress Selector (Stages 1 to 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-[#222B38]">
        {[
          {
            num: 1,
            titleFr: '1. Sondage Wenner & Section Cuivre',
            titleEn: '1. Wenner Soil & Copper Sizing',
            badgeFr: '4 Piquets · Formule Adiabatique',
            badgeEn: '4-Pin Wenner · Adiabatic Copper'
          },
          {
            num: 2,
            titleFr: '2. Grille de Terre IEEE 80 & GPR',
            titleEn: '2. IEEE 80 Ground Grid & GPR',
            badgeFr: 'Sverak Rg · Pas & Toucher · Gravier',
            badgeEn: 'Sverak Rg · Touch/Step · Gravel'
          },
          {
            num: 3,
            titleFr: '3. Risque d’Arc IEEE 1584 & EPI',
            titleEn: '3. Arc Flash IEEE 1584 & PPE',
            badgeFr: 'Énergie cal/cm² · Régimes SLT',
            badgeEn: 'Incident Energy · Earthing SLT'
          },
          {
            num: 4,
            titleFr: '4. Foudre CEI 62305 & Parafoudres',
            titleEn: '4. Lightning & ZnO Arresters',
            badgeFr: 'Sphère Fictive · Marge BIL ≥ 20%',
            badgeEn: 'Rolling Sphere · BIL Margin ≥ 20%'
          },
          {
            num: 5,
            titleFr: '5. Chantiers Cameroun & DQE FCFA',
            titleEn: '5. Cameroon Sites & BOQ',
            badgeFr: 'Oyomabang · Mangombé · DQE',
            badgeEn: 'Oyomabang · Mangombé · BOQ'
          }
        ].map((st) => {
          const isActive = activeStage === st.num;
          return (
            <button
              key={st.num}
              onClick={() => onSelectStage(st.num as any)}
              className={`p-2.5 rounded-xl text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 ring-1 ring-amber-300'
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
