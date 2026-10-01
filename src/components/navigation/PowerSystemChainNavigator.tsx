// src/components/navigation/PowerSystemChainNavigator.tsx
// EPEDE - Master Power System Chain Navigator (De la Production au Tableau Divisionnaire)

import React from 'react';
import {
  Zap,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Layers,
  Activity,
  ArrowRight,
  Shield,
  Gauge
} from 'lucide-react';
import type { DomainCode } from '../../types/epede';

export type ChainStageId = 'D01' | 'D02' | 'D03' | 'D04' | 'D05' | 'D06' | 'D06_TD';

export interface ChainStageInfo {
  id: ChainStageId;
  stepNumber: number;
  domainCode: DomainCode;
  titleFr: string;
  titleEn: string;
  shortFr: string;
  shortEn: string;
  voltage: string;
  keyApparatusFr: string;
  keyApparatusEn: string;
  standard: string;
  colorClass: string;
  badge: string;
}

export const POWER_SYSTEM_STAGES: ChainStageInfo[] = [
  {
    id: 'D01',
    stepNumber: 1,
    domainCode: 'D01',
    titleFr: 'Production de l\'Énergie Électrique',
    titleEn: 'Power Generation & Hydro Plants',
    shortFr: '1. Production',
    shortEn: '1. Generation',
    voltage: '11 kV → 15 kV',
    keyApparatusFr: 'Alternateurs synchrones, Turbines Francis/Pelton, GSU',
    keyApparatusEn: 'Synchronous Alternators, Francis/Pelton Turbines, GSU',
    standard: 'CEI 60034 / IEEE 115',
    colorClass: 'from-sky-500 to-blue-600',
    badge: 'GEN · G1'
  },
  {
    id: 'D02',
    stepNumber: 2,
    domainCode: 'D02',
    titleFr: 'Architecture Globale & Dispatching',
    titleEn: 'Grid Architecture & Dispatching',
    shortFr: '2. Architecture',
    shortEn: '2. Grid Arch.',
    voltage: '225 kV ↔ 30 kV',
    keyApparatusFr: 'Topologies maillées/bouclées, Réglage f-U, Dispatching SCADA',
    keyApparatusEn: 'Meshed/Ring Topologies, f-U Regulation, SCADA Dispatch',
    standard: 'CEI 61970 / Grid Code',
    colorClass: 'from-blue-500 to-indigo-600',
    badge: 'ARCH · SCADA'
  },
  {
    id: 'D03',
    stepNumber: 3,
    domainCode: 'D03',
    titleFr: 'Réseaux de Transport HTB',
    titleEn: 'Bulk HV Transmission Networks',
    shortFr: '3. Transport HT',
    shortEn: '3. Transmission',
    voltage: '225 kV / 90 kV',
    keyApparatusFr: 'Lignes aériennes, Pylônes treillis, Câbles THT, Faisceaux Aster',
    keyApparatusEn: 'Overhead Lines, Lattice Pylons, EHV Cables, Aster Bundles',
    standard: 'CEI 60826 / CEI 60865',
    colorClass: 'from-indigo-500 to-violet-600',
    badge: 'THT · 225kV'
  },
  {
    id: 'D04',
    stepNumber: 4,
    domainCode: 'D04',
    titleFr: 'Postes Électriques de Transformation',
    titleEn: 'Step-Down Electrical Substations',
    shortFr: '4. Postes HTB/HTA',
    shortEn: '4. Substations',
    voltage: '225 kV → 30 kV',
    keyApparatusFr: 'Postes AIS/GIS, Transformateurs 63MVA OLTC, Travées, ANSI 87T',
    keyApparatusEn: 'AIS/GIS Switchgear, 63MVA OLTC Trafos, Bays, ANSI 87T',
    standard: 'CEI 61936-1 / CEI 62271',
    colorClass: 'from-violet-500 to-amber-600',
    badge: 'POSTE · TRANS'
  },
  {
    id: 'D05',
    stepNumber: 5,
    domainCode: 'D05',
    titleFr: 'Distribution Moyenne Tension HTA',
    titleEn: 'MV Distribution Grid (HTA)',
    shortFr: '5. Distribution MT',
    shortEn: '5. MV Distribution',
    voltage: '30 kV / 15 kV',
    keyApparatusFr: 'Cellules SM6, RMU, Postes HTA/BT H61, Câbles CIS souterrains',
    keyApparatusEn: 'SM6 Switchgear, RMU Ring, H61 Pole Trafos, Underground Cables',
    standard: 'CEI 62271-200 / Eneo STD',
    colorClass: 'from-amber-500 to-orange-600',
    badge: 'HTA · 30kV'
  },
  {
    id: 'D06',
    stepNumber: 6,
    domainCode: 'D06',
    titleFr: 'Installations Électriques BT & TGBT',
    titleEn: 'LV Installations & Main Switchboard',
    shortFr: '6. TGBT & Bâtiment',
    shortEn: '6. LV Switchboard',
    voltage: '400 V / 230 V',
    keyApparatusFr: 'Point de livraison, TGBT Forme 4b, Inverseur ATS, Régimes TT/TN/IT',
    keyApparatusEn: 'Delivery Point, TGBT Form 4b, ATS Transfer, TT/TN/IT Earthing',
    standard: 'CEI 61439-2 / NF C 15-100',
    colorClass: 'from-orange-500 to-amber-500',
    badge: 'BT · 400V'
  },
  {
    id: 'D06_TD',
    stepNumber: 7,
    domainCode: 'D06',
    titleFr: 'Tableaux Divisionnaires & Circuits Terminaux',
    titleEn: 'Distribution Boards & Final Circuits',
    shortFr: '7. Tableaux Divisionnaires',
    shortEn: '7. Sub-Distribution',
    voltage: '230 V Ph+N',
    keyApparatusFr: 'Coffrets modulaires Rail DIN, DDR 30mA, Disjoncteurs 10-32A, Câbles',
    keyApparatusEn: 'DIN Rail Enclosures, 30mA RCDs, 10-32A MCB Breakers, Sockets & Light',
    standard: 'NF C 15-100 / CEI 60364',
    colorClass: 'from-amber-500 to-emerald-500',
    badge: 'USAGE · 230V'
  }
];

interface PowerSystemChainNavigatorProps {
  currentStageId: ChainStageId;
  locale: 'fr' | 'en';
  onNavigateStage: (stageId: ChainStageId, domainCode: DomainCode) => void;
}

export const PowerSystemChainNavigator: React.FC<PowerSystemChainNavigatorProps> = ({
  currentStageId,
  locale,
  onNavigateStage
}) => {
  const currentIndex = POWER_SYSTEM_STAGES.findIndex((s) => s.id === currentStageId);
  const activeStage = POWER_SYSTEM_STAGES[currentIndex] || POWER_SYSTEM_STAGES[0];

  const prevStage = currentIndex > 0 ? POWER_SYSTEM_STAGES[currentIndex - 1] : null;
  const nextStage = currentIndex < POWER_SYSTEM_STAGES.length - 1 ? POWER_SYSTEM_STAGES[currentIndex + 1] : null;

  return (
    <div className="rounded-2xl bg-[#090D15] border border-[#20293A] p-4 space-y-3 font-mono shadow-xl relative overflow-hidden">
      {/* Top Banner: Chain Progression Overview */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1A2333]">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                {locale === 'fr' ? 'CHAÎNE ÉLECTROTECHNIQUE COMPLÈTE (EPEDE)' : 'EPEDE COMPLETE ELECTROTECHNICAL CHAIN'}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold border border-slate-700">
                7 MAILLONS END-TO-END
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              {locale === 'fr'
                ? 'De la Production de Puissance aux Tableaux Divisionnaires & Charges Finales'
                : 'From Bulk Power Generation to Final Sub-Distribution Boards & Loads'}
            </h3>
          </div>
        </div>

        {/* Step Prev/Next Action Buttons */}
        <div className="flex items-center gap-2">
          {prevStage && (
            <button
              type="button"
              onClick={() => onNavigateStage(prevStage.id, prevStage.domainCode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition-all cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {locale === 'fr' ? prevStage.shortFr : prevStage.shortEn}
              </span>
              <span className="sm:hidden">{locale === 'fr' ? 'Précédent' : 'Prev'}</span>
            </button>
          )}

          {nextStage && (
            <button
              type="button"
              onClick={() => onNavigateStage(nextStage.id, nextStage.domainCode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-all cursor-pointer shadow-sm shadow-amber-500/20"
            >
              <span className="hidden sm:inline">
                {locale === 'fr' ? nextStage.shortFr : nextStage.shortEn}
              </span>
              <span className="sm:hidden">{locale === 'fr' ? 'Suivant' : 'Next'}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Interactive Steps Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {POWER_SYSTEM_STAGES.map((stage, idx) => {
          const isCurrent = stage.id === currentStageId;
          const isPassed = idx < currentIndex;

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onNavigateStage(stage.id, stage.domainCode)}
              className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                isCurrent
                  ? 'bg-[#131B2A] border-amber-400 shadow-md ring-1 ring-amber-400/40 text-white'
                  : isPassed
                  ? 'bg-[#0B1019] border-emerald-900/50 hover:border-slate-500 text-slate-300'
                  : 'bg-[#080B12] border-[#1C2538] hover:border-slate-600 text-slate-400'
              }`}
            >
              {/* Active top glow indicator */}
              {isCurrent && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-300" />
              )}

              <div>
                <div className="flex items-center justify-between text-[10px] mb-1 font-bold">
                  <span className={isCurrent ? 'text-amber-400' : isPassed ? 'text-emerald-400' : 'text-slate-500'}>
                    0{stage.stepNumber}
                  </span>
                  <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${
                    isCurrent
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {stage.voltage}
                  </span>
                </div>

                <div className="text-[11px] font-bold tracking-tight line-clamp-1">
                  {locale === 'fr' ? stage.shortFr : stage.shortEn}
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-[#1C2538] flex items-center justify-between text-[9px]">
                <span className="text-slate-400">{stage.badge}</span>
                <span className={`font-black ${isCurrent ? 'text-amber-400' : isPassed ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isCurrent ? '● EN COURS' : isPassed ? '✓ VU' : '→'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Technical Summary Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0C121D] border border-[#1A2436] text-[11px]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 uppercase text-[9px] font-bold">Étape Active :</span>
            <span className="text-white font-black">{activeStage.stepNumber}/7 · {locale === 'fr' ? activeStage.titleFr : activeStage.titleEn}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 uppercase text-[9px] font-bold">Niveau de Tension :</span>
            <span className="text-amber-400 font-bold">{activeStage.voltage}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 uppercase text-[9px] font-bold">Référentiel :</span>
            <span className="text-sky-300 font-bold">{activeStage.standard}</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-400">
          Appareils : <strong className="text-slate-300">{locale === 'fr' ? activeStage.keyApparatusFr : activeStage.keyApparatusEn}</strong>
        </div>
      </div>
    </div>
  );
};
