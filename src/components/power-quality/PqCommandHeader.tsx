// src/components/power-quality/PqCommandHeader.tsx
// EPEDE Domain D17 / D14 - Interactive Executive Command Cockpit for Power Quality & EMC

import React from 'react';
import {
  Activity,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Zap,
  Gauge,
  Flame,
  Radio,
  BookOpen
} from 'lucide-react';
import {
  type PqSiteKey,
  PQ_SITE_PROFILES,
  type PqProjectStoreType
} from './services/usePqProjectStore';

interface PqCommandHeaderProps {
  locale: 'fr' | 'en';
  store: PqProjectStoreType;
  onOpenFormulasModal: () => void;
}

export const PqCommandHeader: React.FC<PqCommandHeaderProps> = ({
  locale,
  store,
  onOpenFormulasModal
}) => {
  const {
    activeStage,
    setActiveStage,
    selectedSiteKey,
    switchSiteProfile,
    harmonicAnalytics,
    sagAnalytics,
    flickerAnalytics,
    activeProfile
  } = store;

  const stagesList = [
    {
      num: 1,
      code: 'STAGE_1_FFT_AUDIT',
      titleFr: '1. Audit Harmonique IEEE 519',
      titleEn: '1. IEEE 519 FFT Audit',
      icon: Activity,
      descFr: 'Spectre FFT & THD',
      descEn: 'FFT Spectrum & THD'
    },
    {
      num: 2,
      code: 'STAGE_2_SAG_SEMI_F47',
      titleFr: '2. Immunité Creux (SEMI F47)',
      titleEn: '2. Sag Ride-Through (SEMI F47)',
      icon: Zap,
      descFr: 'Gabarit ITIC & AVC',
      descEn: 'ITIC Profile & AVC'
    },
    {
      num: 3,
      code: 'STAGE_3_APF_DETUNED_K',
      titleFr: '3. APF Shunt & Dé-résonance LC',
      titleEn: '3. Shunt APF & Detuned 7% LC',
      icon: Sliders,
      descFr: 'IGBT 25µs & Facteur K',
      descEn: '25µs IGBT & K-Factor'
    },
    {
      num: 4,
      code: 'STAGE_4_FLICKER_UNBALANCE',
      titleFr: '4. Flicker & Déséquilibre CEM',
      titleEn: '4. Flicker & Unbalance EMC',
      icon: Gauge,
      descFr: 'Pst/Plt & u2 Fortescue',
      descEn: 'Pst/Plt & Fortescue u2'
    },
    {
      num: 5,
      code: 'STAGE_5_DELIVERABLES_DQE',
      titleFr: '5. Cas Cameroun & DQE FCFA',
      titleEn: '5. Cameroon Sites & BOQ FCFA',
      icon: MapPin,
      descFr: 'ALUCAM, Prometal & Devis',
      descEn: 'ALUCAM, Prometal & BOQ'
    }
  ];

  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md mb-6 space-y-5">
      {/* Top Bar: Cameroon Industrial Site Selector & Global Telemetry Strip */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Site Profile Picker */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              {locale === 'fr'
                ? 'Profil Industriel Réactif & Point de Raccordement (PCC)'
                : 'Reactive Industrial Site Profile & PCC Grid Node'}
            </div>
            <select
              value={selectedSiteKey}
              onChange={(e) => switchSiteProfile(e.target.value as PqSiteKey)}
              aria-label={locale === 'fr' ? 'Sélectionner le profil industriel' : 'Select industrial site profile'}
              className="mt-1 bg-slate-950 border border-slate-700 text-white font-mono text-xs md:text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-violet-500 transition-colors"
            >
              {Object.values(PQ_SITE_PROFILES).map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {locale === 'fr' ? prof.nameFr : prof.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-Time Compliance Badges Strip */}
        <div className="flex flex-wrap items-center gap-2">
          {/* THDv Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono ${
              harmonicAnalytics.isVoltageCompliant
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                : 'bg-rose-950/60 border-rose-800/80 text-rose-300'
            }`}
          >
            {harmonicAnalytics.isVoltageCompliant ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span>
              THDv: <strong className="font-bold">{harmonicAnalytics.effectiveThdVoltagePct}%</strong>{' '}
              (&le; 5.0%)
            </span>
          </div>

          {/* THDi Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono ${
              harmonicAnalytics.isCurrentCompliant
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                : 'bg-amber-950/60 border-amber-800/80 text-amber-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>
              THDi: <strong className="font-bold">{harmonicAnalytics.effectiveThdCurrentPct}%</strong>{' '}
              {store.isApfActive && '(APF ON)'}
            </span>
          </div>

          {/* Sag SEMI F47 Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono ${
              sagAnalytics.semiF47Pass
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                : 'bg-rose-950/60 border-rose-800/80 text-rose-300'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>
              SEMI F47: <strong className="font-bold">{sagAnalytics.semiF47Pass ? 'CONFORME' : 'DÉCLENCHEMENT'}</strong>
            </span>
          </div>

          {/* K-Factor Badge */}
          <div className="px-3 py-1.5 rounded-xl border border-violet-800/60 bg-violet-950/60 text-violet-300 flex items-center gap-2 text-xs font-mono">
            <Flame className="w-4 h-4 text-violet-400" />
            <span>
              Transfo: <strong className="font-bold">{harmonicAnalytics.recommendedKClass}</strong>
            </span>
          </div>

          {/* Mathematical Formulations Button */}
          <button
            onClick={onOpenFormulasModal}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-mono"
            title={locale === 'fr' ? 'Formulations mathématiques et normes' : 'Mathematical formulations & standards'}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{locale === 'fr' ? 'Formules & Normes' : 'Formulas & Standards'}</span>
          </button>
        </div>
      </div>

      {/* Cameroon Grid Context Description */}
      <div className="text-xs text-slate-300 bg-slate-950/70 border border-slate-800/80 rounded-xl px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-violet-300 font-bold">
            {locale === 'fr' ? 'Contexte Réseau Cameroun :' : 'Cameroon Grid Context:'}
          </span>
          <span className="text-slate-300">{activeProfile.cameroonReference}</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 hidden md:block">
          Ssc = {activeProfile.shortCircuitPowerMva} MVA | Pcontractuelle = {activeProfile.contractualPowerMw} MW | I1 = {activeProfile.fundamentalCurrentA} A
        </div>
      </div>

      {/* 5-Stage Progressive Engineering Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 pt-1">
        {stagesList.map((stage) => {
          const isActive = activeStage === stage.num;
          const IconComponent = stage.icon;
          return (
            <button
              key={stage.num}
              onClick={() => setActiveStage(stage.num as 1 | 2 | 3 | 4 | 5)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/30 ring-2 ring-violet-400/20'
                  : 'bg-slate-950/80 border-slate-800/80 hover:border-violet-500/50 hover:bg-slate-850 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  ÉTAPE {stage.num}
                </span>
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-violet-400'}`} />
              </div>
              <div>
                <div className="text-xs font-bold font-sans line-clamp-1">
                  {locale === 'fr' ? stage.titleFr : stage.titleEn}
                </div>
                <div
                  className={`text-[10px] font-mono mt-0.5 ${
                    isActive ? 'text-violet-100' : 'text-slate-400'
                  }`}
                >
                  {locale === 'fr' ? stage.descFr : stage.descEn}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
