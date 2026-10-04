// src/components/ai/AiCommandHeader.tsx
// EPEDE D09 - Master Command Header HUD & Engineering Sizing Bar for AI & Advanced Technologies

import React from 'react';
import {
  Sparkles,
  Cpu,
  Flame,
  Activity,
  ShieldAlert,
  Server,
  FileSpreadsheet,
  SlidersHorizontal,
  MapPin,
  Clock,
  Layers,
  BarChart3,
  Sun,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  AI_SITE_PROFILES,
  type AiSiteKey,
  type AiSiteProfile,
  type AiCalculations
} from './services/useAiProjectStore';

interface AiCommandHeaderProps {
  locale: 'fr' | 'en';
  activeStage: 1 | 2 | 3 | 4 | 5;
  onSelectStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  selectedSiteId: AiSiteKey;
  onSelectSite: (id: AiSiteKey) => void;
  activeProfile: AiSiteProfile;
  calculations: AiCalculations;
  onOpenDossier: () => void;
  onOpenPrinciplesModal: () => void;
}

export const AiCommandHeader: React.FC<AiCommandHeaderProps> = ({
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
  const stages = [
    {
      stage: 1 as const,
      num: '01',
      titleFr: 'Acquisition IIoT & Intégrité Données',
      titleEn: 'IIoT Acquisition & Data Quality',
      icon: Cpu
    },
    {
      stage: 2 as const,
      num: '02',
      titleFr: 'DGA Duval & Jumeau Thermique PINN',
      titleEn: 'Duval DGA & PINN Thermal Twin',
      icon: Flame
    },
    {
      stage: 3 as const,
      num: '03',
      titleFr: 'Spectrométrie FFT & Vibrations ISO 10816',
      titleEn: 'FFT Spectra & ISO 10816 Vibration',
      icon: Activity
    },
    {
      stage: 4 as const,
      num: '04',
      titleFr: 'Vision Drone & Cybersécurité DPI OT',
      titleEn: 'Drone Vision & OT DPI Cybersecurity',
      icon: ShieldAlert
    },
    {
      stage: 5 as const,
      num: '05',
      titleFr: 'Chantiers Cameroun & Dossier DQE FCFA',
      titleEn: 'Cameroon Assets & Stamped BOQ FCFA',
      icon: Server
    }
  ];

  return (
    <div className="rounded-2xl border border-indigo-600/40 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-md space-y-4">
      {/* Top Bar: Profile Selector and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Site Typology Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
            <MapPin className="h-4 w-4" />
            <span>{locale === 'fr' ? 'Actif Industriel Calibré :' : 'Calibrated Industrial Asset:'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2">
            {(Object.keys(AI_SITE_PROFILES) as AiSiteKey[]).map((key) => {
              const prof = AI_SITE_PROFILES[key];
              const isSelected = selectedSiteId === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectSite(key)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold border transition-all text-left ${
                    isSelected
                      ? 'bg-indigo-500 text-slate-950 border-indigo-400 font-bold shadow-md shadow-indigo-500/20'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <span className="block truncate max-w-[210px]">{prof.nameFr.split('(')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-start lg:self-center">
          <button
            type="button"
            onClick={onOpenPrinciplesModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold transition-all"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Formulations & Normes' : 'Formulas & Standards'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenDossier}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-mono text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>{locale === 'fr' ? 'Devis Estimatif DQE' : 'Stamped BOQ'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Engineering Sizing HUD (6 Key Quantities) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: DGA Status */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>DGA Duval 1</span>
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <div className="text-sm font-mono font-bold text-white flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${calculations.dgaFaultCode === 'NORMAL' ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`} />
            <span>{calculations.dgaFaultCode} ({calculations.dgaConfidencePercent}%)</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 truncate">
            TDCG : {calculations.dgaTdcgPpm} ppm
          </div>
        </div>

        {/* KPI 2: Point Chaud & RUL */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Point Chaud & RUL</span>
            <Flame className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-sm font-mono font-bold text-amber-300">
            {calculations.hotSpotTempC} °C
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            RUL : {calculations.remainingUsefulLifeYears} ans (V={calculations.relativeAgingRateV})
          </div>
        </div>

        {/* KPI 3: Vibrations ISO 10816 */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Vibration ISO</span>
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="text-sm font-mono font-bold text-cyan-300">
            {calculations.vibrationRmsVelocityMmS} mm/s (Zone {calculations.vibrationIsoZone})
          </div>
          <div className="text-[10px] font-mono text-slate-400 truncate">
            {calculations.vibrationIsoZone === 'A' ? 'Sain' : 'Alerte maintenance'}
          </div>
        </div>

        {/* KPI 4: Cybersécurité OT DPI */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Cyber-Menace OT</span>
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <div className={`text-sm font-mono font-bold ${calculations.cyberThreatLevel === 'CRITICAL' ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
            {calculations.cyberThreatLevel} ({calculations.cyberAnomalyScore}%)
          </div>
          <div className="text-[10px] font-mono text-slate-400 truncate">
            CEI 62443 / MITRE ICS
          </div>
        </div>

        {/* KPI 5: Prévision Solaire / BESS */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Prévision PV / BESS</span>
            <Sun className="h-3.5 w-3.5 text-yellow-400" />
          </div>
          <div className="text-sm font-mono font-bold text-yellow-300">
            {calculations.solarPredictedMw} MW
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Tampon : +{calculations.bessBufferMw} MW
          </div>
        </div>

        {/* KPI 6: CapEx Global en FCFA */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>CapEx Edge/IA (DQE)</span>
            <Server className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-mono font-bold text-emerald-400">
            {(calculations.totalEstimatedCapExFcfa / 1_000_000).toFixed(1)} M FCFA
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            ~ {(calculations.totalEstimatedCapExEur / 1000).toFixed(0)} k€
          </div>
        </div>
      </div>

      {/* 5-Stage Progressive Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
        {stages.map((stg) => {
          const isActive = activeStage === stg.stage;
          const Icon = stg.icon;
          return (
            <button
              key={stg.stage}
              type="button"
              onClick={() => onSelectStage(stg.stage)}
              className={`p-3 rounded-xl font-mono text-left transition-all border flex items-start gap-2.5 ${
                isActive
                  ? 'bg-gradient-to-br from-indigo-900/90 to-indigo-950 border-indigo-400 text-white shadow-lg shadow-indigo-950/60 ring-1 ring-indigo-400/50'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <div
                className={`p-2 rounded-lg mt-0.5 ${
                  isActive ? 'bg-indigo-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-indigo-400">
                  <span>Étape {stg.num}</span>
                  {isActive && <CheckCircle2 className="h-3 w-3 text-indigo-300" />}
                </div>
                <div className="text-xs font-bold truncate mt-0.5 text-slate-100">
                  {locale === 'fr' ? stg.titleFr : stg.titleEn}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
