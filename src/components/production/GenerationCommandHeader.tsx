// src/components/production/GenerationCommandHeader.tsx
// EPEDE D01 - Master Interactive Command Header & 5-Stage Journey Orchestrator

import React from 'react';
import {
  Waves,
  Sun,
  Flame,
  Wind,
  TreePine,
  Zap,
  Activity,
  Compass,
  FileCheck,
  Layers,
  Sliders,
  Gauge,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Building2,
  Cpu
} from 'lucide-react';
import {
  CAMEROON_GENERATION_FLEET,
  type CameroonPowerPlant
} from './data/cameroonGenerationFleet';
import type { GenerationTechnology } from './services/useGenerationProjectStore';

interface GenerationCommandHeaderProps {
  locale: 'fr' | 'en';
  activeStage: 1 | 2 | 3 | 4 | 5;
  onSelectStage: (stage: 1 | 2 | 3 | 4 | 5) => void;
  activeTechnology: GenerationTechnology;
  onSelectTechnology: (tech: GenerationTechnology) => void;
  selectedPlantId: string;
  onSelectPlant: (plantId: string) => void;
  onOpenPrinciplesDrawer?: () => void;
  onOpenDossier?: () => void;
  activePlant: CameroonPowerPlant;
  powerMw: number;
  currentAmps: number;
  headM: number;
  flowM3s: number;
  voltageKv: number;
  stepUpKv: number;
}

export const GenerationCommandHeader: React.FC<GenerationCommandHeaderProps> = ({
  locale,
  activeStage,
  onSelectStage,
  activeTechnology,
  onSelectTechnology,
  selectedPlantId,
  onSelectPlant,
  onOpenPrinciplesDrawer,
  onOpenDossier,
  activePlant,
  powerMw,
  currentAmps,
  headM,
  flowM3s,
  voltageKv,
  stepUpKv
}) => {
  return (
    <div className="space-y-4 font-mono">
      {/* 1. TOP COMMAND BAR: Active Plant Context, Technology Pills & Telemetry */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#090D14] via-[#101827] to-[#090D14] border border-[#222B38] shadow-2xl space-y-4">
        
        {/* Top Row: National Reference Plant Selector & Quick Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[#222B38]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {locale === 'fr' ? 'Référentiel National Cameroun :' : 'Cameroon National Asset :'}
              </span>
            </div>

            {/* Quick Plant Selector Dropdown */}
            <select
              value={selectedPlantId}
              onChange={(e) => onSelectPlant(e.target.value)}
              className="bg-[#0E141F] text-sky-400 border border-sky-500/40 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
            >
              {CAMEROON_GENERATION_FLEET.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.name} ({plant.installedCapacityMw} MW - {plant.gridZone})
                </option>
              ))}
            </select>

            <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[10px]">
              {activePlant.gridZone === 'RIS' ? 'Réseau Interconnecté Sud (RIS)' : activePlant.gridZone === 'RIN' ? 'Réseau Interconnecté Nord (RIN)' : 'Réseau Isolé'}
            </span>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            {onOpenPrinciplesDrawer && (
              <button
                type="button"
                onClick={onOpenPrinciplesDrawer}
                className="px-3 py-1.5 rounded-xl bg-[#0E141F] hover:bg-[#161F2E] text-slate-300 hover:text-white border border-[#222B38] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Lois & Principes' : 'Laws & Principles'}</span>
              </button>
            )}

            {onOpenDossier && (
              <button
                type="button"
                onClick={onOpenDossier}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Dossier DQE FCFA' : 'BOQ Dossier FCFA'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Middle Row: Reactive Telemetry Sizing HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
            <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Puissance Active P' : 'Active Power P'}</div>
            <div className="text-base font-bold text-sky-400">{powerMw} MW</div>
            <div className="text-[10px] text-slate-400">{activePlant.unitsCount} groupe(s) unitaire(s)</div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
            <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Courant Statorique In' : 'Stator Current In'}</div>
            <div className="text-base font-bold text-amber-400">{currentAmps.toLocaleString()} A</div>
            <div className="text-[10px] text-slate-400">@ cos φ = 0.90</div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
            <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Chute Nette H' : 'Net Head H'}</div>
            <div className="text-base font-bold text-emerald-400">{headM > 0 ? `${headM} m` : 'N/A'}</div>
            <div className="text-[10px] text-slate-400">{headM > 0 ? (headM < 30 ? 'Basse Chute' : headM <= 350 ? 'Moyenne Chute' : 'Haute Chute') : 'Thermique/PV'}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
            <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Débit Turbiné Q' : 'Turbine Flow Q'}</div>
            <div className="text-base font-bold text-cyan-400">{flowM3s > 0 ? `${flowM3s} m³/s` : 'N/A'}</div>
            <div className="text-[10px] text-slate-400">{flowM3s > 0 ? `Unité : ${Math.round(flowM3s / Math.max(1, activePlant.unitsCount))} m³/s` : 'Non-hydraulique'}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-[#222B38]">
            <div className="text-[10px] text-slate-500 uppercase">{locale === 'fr' ? 'Tension Générateur Un' : 'Generator Voltage Un'}</div>
            <div className="text-base font-bold text-violet-400">{voltageKv} kV</div>
            <div className="text-[10px] text-slate-400">50 Hz Triphasé</div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0E141F]/80 border border-sky-500/30 bg-sky-950/20">
            <div className="text-[10px] text-sky-400 uppercase">{locale === 'fr' ? 'Évacuation Réseau' : 'Grid Evacuation'}</div>
            <div className="text-base font-bold text-white">{stepUpKv} kV THT</div>
            <div className="text-[10px] text-sky-300">Vers D04 Postes / D03</div>
          </div>
        </div>

        {/* Bottom Row: 5-Stage Engineering Journey Selector Pills */}
        <div className="pt-2 border-t border-[#222B38]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {[
              {
                stage: 1 as const,
                titleFr: '1. Ressources & Parc National',
                titleEn: '1. Resources & National Fleet',
                subFr: 'Hydrologie, Solaire, Thermique & Sizing',
                subEn: 'Hydrology, Solar, Thermal & Sizing',
                icon: Waves
              },
              {
                stage: 2 as const,
                titleFr: '2. Génie Civil & Turbines',
                titleEn: '2. Civil Works & Turbines',
                subFr: '17 Étapes SVG, Conduites & Hill Chart',
                subEn: '17-Stage SVG, Penstocks & Hill Chart',
                icon: Cpu
              },
              {
                stage: 3 as const,
                titleFr: '3. Alternateur & Stabilité',
                titleEn: '3. Alternator & Stability',
                subFr: 'Diagramme P-Q, AVR & Statisme f-P',
                subEn: 'P-Q Curve, AVR & Droop f-P',
                icon: Zap
              },
              {
                stage: 4 as const,
                titleFr: '4. Auxiliaires BoP & Protections',
                titleEn: '4. Station Auxiliaries & Protection',
                subFr: 'Services Propres & 12 Relais ANSI',
                subEn: 'Station BoP & 12 ANSI Relays',
                icon: ShieldCheck
              },
              {
                stage: 5 as const,
                titleFr: '5. Essais, O&M & Dossier DQE',
                titleEn: '5. Commissioning, O&M & BOQ',
                subFr: 'Délestage, Vibrations & DQE FCFA',
                subEn: 'Load Rejection, O&M & BOQ FCFA',
                icon: FileCheck
              }
            ].map((st) => {
              const isSelected = activeStage === st.stage;
              const Icon = st.icon;
              return (
                <button
                  key={st.stage}
                  type="button"
                  onClick={() => onSelectStage(st.stage)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/40'
                      : 'bg-[#0E141F] border-[#222B38] text-slate-400 hover:text-slate-200 hover:bg-[#161F2E]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${isSelected ? 'text-sky-300' : 'text-slate-300'}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{locale === 'fr' ? st.titleFr : st.titleEn}</span>
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-500 truncate">
                    {locale === 'fr' ? st.subFr : st.subEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
