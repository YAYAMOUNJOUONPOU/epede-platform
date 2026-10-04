// src/components/transmission/TransmissionCommandHeader.tsx
// EPEDE D03 - Transmission Networks Master Interactive Command Header & 5-Stage Journey Orchestrator

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
  Gauge,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import type { TransmissionWorkbenchPillar } from './TransmissionWorkbench';
import {
  CAMEROON_TRANSMISSION_CORRIDORS,
  type CameroonTransmissionCorridor
} from './services/useTransmissionProjectStore';

export type TransmissionTechnology = 'OVERHEAD_LINE' | 'UNDERGROUND_CABLE' | 'COMPARISON';
export type TransmissionVoltageContext = '400kV' | '225kV' | '110kV' | '90kV';

interface TransmissionCommandHeaderProps {
  locale: 'fr' | 'en';
  activePillar?: TransmissionWorkbenchPillar;
  onSelectPillar?: (pillar: TransmissionWorkbenchPillar) => void;
  activeStage: 1 | 2 | 3 | 4 | 5;
  onSelectStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  selectedTechnology: TransmissionTechnology;
  onSelectTechnology: (tech: TransmissionTechnology) => void;
  selectedVoltage: TransmissionVoltageContext;
  onSelectVoltage: (voltage: TransmissionVoltageContext) => void;
  selectedCorridorId?: string;
  onSelectCorridor?: (corrId: string) => void;
  currentBreadcrumb?: string[];
  onOpenPrinciplesDrawer?: () => void;
  onOpenDossier?: () => void;
  lineLengthKm?: number;
  silMw?: number;
}

export const TransmissionCommandHeader: React.FC<TransmissionCommandHeaderProps> = ({
  locale,
  activePillar,
  onSelectPillar,
  activeStage,
  onSelectStage,
  selectedTechnology,
  onSelectTechnology,
  selectedVoltage,
  onSelectVoltage,
  selectedCorridorId = 'CORRIDOR_SONG_LOULOU_BEKOKO',
  onSelectCorridor,
  currentBreadcrumb,
  onOpenPrinciplesDrawer,
  onOpenDossier,
  lineLengthKm = 145,
  silMw = 135
}) => {
  const activeCorridor = CAMEROON_TRANSMISSION_CORRIDORS[selectedCorridorId] || CAMEROON_TRANSMISSION_CORRIDORS.CORRIDOR_SONG_LOULOU_BEKOKO;

  const stages = [
    {
      num: 1 as const,
      title_fr: '1. Corridors & Niveaux Tension',
      title_en: '1. Corridors & Voltages',
      sub_fr: 'Tracés & Climat Cameroun',
      sub_en: 'Routes & Climate',
      icon: Compass,
      color: 'sky'
    },
    {
      num: 2 as const,
      title_fr: '2. Pylônes & Flèche Caténaire',
      title_en: '2. Towers & Catenary Sag',
      sub_fr: 'CEI 60826 & Gabarit Sol',
      sub_en: 'IEC 60826 & Clearance',
      icon: FolderTree,
      color: 'amber'
    },
    {
      num: 3 as const,
      title_fr: '3. Propagation d’Onde & SIL',
      title_en: '3. Wave Propagation & SIL',
      sub_fr: 'Ferranti & Réactances Shunt',
      sub_en: 'Ferranti & Shunt Reactors',
      icon: Zap,
      color: 'emerald'
    },
    {
      num: 4 as const,
      title_fr: '4. Ampacité DLR & Câbles/HVDC',
      title_en: '4. DLR Ampacity & Cables/HVDC',
      sub_fr: 'IEEE 738, XLPE & FACTS',
      sub_en: 'IEEE 738, XLPE & FACTS',
      icon: Activity,
      color: 'rose'
    },
    {
      num: 5 as const,
      title_fr: '5. Protections & Dossier SAT',
      title_en: '5. Protection & SAT Dossier',
      sub_fr: 'Distance 21, OPGW & DQE',
      sub_en: 'Distance 21, OPGW & BOQ',
      icon: FileCheck,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-4 font-mono">
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
                DISPATCHING NATIONAL SONATREL
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] text-slate-400 bg-slate-900/80 border border-slate-700/80">
                CEI 60826 · IEEE 738 · CIGRÉ TB 207
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
                ? "Parcours d'ingénierie intégrée des lignes de transport HTB en 5 étapes : corridors nationaux du Cameroun, modélisation électromécanique des pylônes et calcul de flèche caténaire, propagation d'onde et compensation de l'effet Ferranti, ampacité dynamique DLR (IEEE 738), jusqu'aux protections de distance (21) et au bordereau DQE en FCFA."
                : 'Integrated 5-stage HV transmission line engineering journey: Cameroon national corridors, electromechanical towers & catenary sag calculations, wave propagation & Ferranti compensation, IEEE 738 Dynamic Line Rating (DLR), down to distance relaying (21) and turnkey BOQ in FCFA.'}
            </p>
          </div>

          {/* Right Dispatching Telemetry & Model Status */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
            {/* Live Frequency & Power Pool Status Badge */}
            <div className="p-3 rounded-xl bg-[#090D14] border border-[#222B38] text-[11px] text-slate-300 space-y-1.5 w-full sm:w-auto min-w-[250px]">
              <div className="flex items-center justify-between gap-3 text-slate-400 text-[10px] border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5 text-sky-400 font-bold truncate max-w-[170px]">
                  <Radio className="h-3 w-3 text-sky-400 animate-pulse shrink-0" />
                  {activeCorridor.name_fr.split('(')[0]}
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                  {selectedVoltage} NOMINAL
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[9px] text-slate-500 block">Longueur :</span>
                  <span className="text-white font-bold text-xs">{lineLengthKm} km</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">Capacité SIL :</span>
                  <span className="text-amber-400 font-bold text-xs">{silMw} MW</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block">Transit Max :</span>
                  <span className="text-sky-400 font-bold text-xs">{activeCorridor.normalRatingMva} MVA</span>
                </div>
              </div>
              <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>Régime : <strong className="text-emerald-400">{activeCorridor.circuitType === 'DOUBLE_CIRCUIT' ? '2x Terne' : '1x Terne'}</strong></span>
                <span>Faisceau : <strong className="text-amber-300">{activeCorridor.bundleType}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onOpenDossier && (
                <button
                  type="button"
                  onClick={onOpenDossier}
                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileCheck className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Dossier & DQE' : 'Dossier & BOQ'}</span>
                </button>
              )}

              {onOpenPrinciplesDrawer && (
                <button
                  type="button"
                  onClick={onOpenPrinciplesDrawer}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Calculator className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Formulaire' : 'Formulas'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Interactive Technology Track + Voltage Level + Corridor Selector */}
        <div className="mt-4 pt-3.5 border-t border-[#222B38] flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Technology Track Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 text-[11px] font-bold mr-1">
              {locale === 'fr' ? 'Filière :' : 'Technology Track:'}
            </span>

            <button
              type="button"
              onClick={() => onSelectTechnology('OVERHEAD_LINE')}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedTechnology === 'OVERHEAD_LINE'
                  ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-sm'
                  : 'bg-[#090D14] text-slate-300 border-[#222B38] hover:text-white hover:border-sky-500/40'
              }`}
            >
              <FolderTree className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Ligne Aérienne (OHL)' : 'Overhead Line (OHL)'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTechnology('UNDERGROUND_CABLE')}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedTechnology === 'UNDERGROUND_CABLE'
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                  : 'bg-[#090D14] text-slate-300 border-[#222B38] hover:text-white hover:border-amber-500/40'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Câble Souterrain (UGC)' : 'Underground Cable (UGC)'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTechnology('COMPARISON')}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedTechnology === 'COMPARISON'
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-sm'
                  : 'bg-[#090D14] text-slate-300 border-[#222B38] hover:text-white hover:border-emerald-500/40'
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Comparatif OHL vs UGC' : 'OHL vs UGC Benchmark'}</span>
            </button>
          </div>

          {/* Voltage Level Context Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-bold mr-1">
              {locale === 'fr' ? 'Palier de Tension :' : 'Voltage Level:'}
            </span>
            {(['400kV', '225kV', '110kV', '90kV'] as TransmissionVoltageContext[]).map((v) => {
              const isSelected = selectedVoltage === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => onSelectVoltage(v)}
                  className={`px-2.5 py-1 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                    isSelected
                      ? v === '400kV'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-400 shadow-sm'
                        : v === '225kV'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-sm'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                      : 'bg-[#090D14] text-slate-400 border-[#222B38] hover:text-white'
                  }`}
                >
                  <span className="font-extrabold">{v}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Cameroon Transmission Corridor Switcher */}
        {onSelectCorridor && (
          <div className="mt-3 pt-3 border-t border-[#222B38] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                {locale === 'fr' ? 'Corridor Stratégique SONATREL :' : 'SONATREL Transmission Corridor:'}
              </span>
              <select
                value={selectedCorridorId}
                onChange={(e) => onSelectCorridor(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#070A10] border border-[#222B38] text-sky-300 font-bold text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {Object.values(CAMEROON_TRANSMISSION_CORRIDORS).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_fr.split('(')[0]} ({c.voltage} - {c.lengthKm} km)
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[11px] text-slate-400">
              Terrain : <strong className="text-white">{activeCorridor.routeTerrain}</strong> • Vent calcul : <strong className="text-amber-300">{activeCorridor.windSpeedDesignMps} m/s</strong>
            </div>
          </div>
        )}

      </div>

      {/* 4. Master 5-Stage Engineering Journey Navigation Tray */}
      <div className="p-3 rounded-2xl bg-[#090D14] border border-[#222B38] shadow-xl overflow-x-auto">
        <div className="flex items-center gap-2.5 min-w-max">
          {stages.map((st) => {
            const isCurrent = activeStage === st.num;
            const isCompleted = activeStage > st.num;
            const Icon = st.icon;

            return (
              <button
                key={st.num}
                type="button"
                onClick={() => onSelectStage(st.num)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 min-w-[220px] ${
                  isCurrent
                    ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-md shadow-sky-500/20 ring-1 ring-sky-300'
                    : isCompleted
                    ? 'bg-[#0E141F] text-slate-200 border-[#222B38] hover:border-sky-500/40'
                    : 'bg-[#0A0E17] text-slate-400 border-[#1B2330] hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${
                  isCurrent
                    ? 'bg-slate-950 text-sky-300'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">
                    {locale === 'fr' ? st.title_fr : st.title_en}
                  </div>
                  <div className={`text-[10px] truncate ${isCurrent ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                    {locale === 'fr' ? st.sub_fr : st.sub_en}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
