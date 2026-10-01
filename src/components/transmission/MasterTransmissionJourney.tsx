// src/components/transmission/MasterTransmissionJourney.tsx
// EPEDE D03 - Master Transmission Journey (8-Stage Bulk Power Transport Corridor)

import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Info,
  Radio,
  Cable,
  Compass,
  Network,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { TRANSMISSION_JOURNEY_STAGES } from './data/transmissionData';
import type { TransmissionJourneyStage } from './types';

interface MasterTransmissionJourneyProps {
  locale: 'fr' | 'en';
  onSelectStage?: (stageId: string) => void;
  onSelectEquipment?: (equipmentId: string) => void;
}

export const MasterTransmissionJourney: React.FC<MasterTransmissionJourneyProps> = ({
  locale,
  onSelectStage,
  onSelectEquipment
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>(TRANSMISSION_JOURNEY_STAGES[0].id);

  const selectedStage = TRANSMISSION_JOURNEY_STAGES.find((s) => s.id === selectedStageId) || TRANSMISSION_JOURNEY_STAGES[0];

  return (
    <div className="space-y-6">
      {/* 1. Header & Corridor Summary */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161B22] border border-[#252E38] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                PILLIER 1 · PARCOURS MAÎTRE DU TRANSPORT HT
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                8 ÉTAPES SYNCHRONISÉES (11 kV → 400 kV)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              <span>
                {locale === 'fr'
                  ? 'Parcours Systémique du Corridor Haute Tension'
                  : 'Master High-Voltage Transmission Corridor Journey'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              {locale === 'fr'
                ? 'De l\'élévation de tension en centrale hydroélectrique (11/225 kV) jusqu\'à l\'injection dans les réseaux de sous-transport régionaux et industriels, visualisez les phénomènes physiques, équations électrotechniques et spécifications de terrain SONATREL.'
                : 'From generation step-up (11/225 kV) through bulk overhead lines and urban XLPE cables to regional infeed, explore physical phenomena, governing formulas, and Cameroon field benchmarks.'}
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs shrink-0">
            <div className="bg-[#0D1117] px-3.5 py-2 rounded-xl border border-[#252E38] text-right">
              <div className="text-[10px] text-slate-500 uppercase">Puissance Naturelle (SIL)</div>
              <div className="text-sky-400 font-bold">{selectedStage.sil_mw} MW</div>
            </div>
            <div className="bg-[#0D1117] px-3.5 py-2 rounded-xl border border-[#252E38] text-right">
              <div className="text-[10px] text-slate-500 uppercase">Impédance d'Onde Zc</div>
              <div className="text-amber-400 font-bold">{selectedStage.characteristic_impedance_ohms} Ω</div>
            </div>
          </div>
        </div>

        {/* 2. Interactive 8-Stage Horizontal Ribbon */}
        <div className="mt-5 pt-4 border-t border-[#252E38]">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {TRANSMISSION_JOURNEY_STAGES.map((stage, idx) => {
              const isSelected = stage.id === selectedStageId;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => {
                    setSelectedStageId(stage.id);
                    onSelectStage?.(stage.id);
                  }}
                  className={`p-2.5 rounded-xl text-left font-mono transition-all flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-sky-500/20 border-2 border-sky-400 text-white shadow-lg shadow-sky-500/10'
                      : 'bg-[#0D1117] border border-[#252E38] text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-sky-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {stage.code}
                    </span>
                    <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                  </div>
                  <div className="text-xs font-semibold line-clamp-2 leading-tight">
                    {locale === 'fr' ? stage.title_fr.split('&')[0] : stage.title_en.split('&')[0]}
                  </div>
                  <div className="mt-2 text-[10px] text-sky-400 font-bold">
                    {stage.voltage_level}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Deep Dive Technical Focus on Selected Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Stage Core Engineering Dossier (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Main Card */}
          <div className="p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                  ÉTAPE {selectedStage.order} / 8 · {selectedStage.code}
                </span>
                <h3 className="text-lg font-bold text-white font-mono mt-0.5">
                  {locale === 'fr' ? selectedStage.title_fr : selectedStage.title_en}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {selectedStage.voltage_level}
              </span>
            </div>

            {/* Physical Phenomenon Description */}
            <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#252E38] text-xs text-slate-300 leading-relaxed">
              <div className="text-sky-400 font-mono font-bold mb-1 flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'PHÉNOMÈNE PHYSIQUE & THÉORIE' : 'PHYSICAL PHENOMENA & THEORY'}</span>
              </div>
              <p>{locale === 'fr' ? selectedStage.physical_phenomena_fr : selectedStage.physical_phenomena_en}</p>
            </div>

            {/* Key Components List */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                {locale === 'fr' ? 'Composants Clés de la Travée / Section' : 'Key Section & Bay Components'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(locale === 'fr' ? selectedStage.key_components_fr : selectedStage.key_components_en).map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38] flex items-center gap-2 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="leading-snug">{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Governing Formulas */}
            <div className="space-y-2 pt-2 border-t border-[#252E38]">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Formulations Mathématiques Normalisées' : 'Governing Physical & Electrical Laws'}</span>
              </div>
              <div className="space-y-2">
                {selectedStage.governing_formulas.map((form, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1 font-mono text-xs">
                    <div className="text-slate-400 font-bold text-[11px]">{form.name}</div>
                    <div className="text-cyan-300 font-bold text-sm overflow-x-auto py-1">
                      {form.latex}
                    </div>
                    <div className="text-slate-500 text-[11px]">{form.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operational Rules & Safety Interlocks */}
            <div className="space-y-2 pt-2 border-t border-[#252E38]">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                {locale === 'fr' ? 'Règles d\'Exploitation & Consignes de Sécurité' : 'Operational Rules & Safety Interlocks'}
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedStage.operational_rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Cameroon SONATREL Field Benchmark & Visual Single-Line (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Cameroon Reference Benchmark */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#161B22] to-[#0D1117] border border-sky-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
                <Compass className="h-3 w-3" />
                RÉFÉRENTIEL CAMEROUN · SONATREL
              </span>
              <span className="text-[11px] font-mono text-slate-500">RIS / RIN</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white font-mono">
                {selectedStage.sonatrel_cameroon_benchmark.line_name}
              </h4>
              <div className="text-xs text-slate-400 mt-0.5">
                {selectedStage.sonatrel_cameroon_benchmark.substations}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38]">
                <span className="text-slate-500 block text-[10px]">Tension Ligne</span>
                <span className="text-white font-bold">{selectedStage.sonatrel_cameroon_benchmark.voltage}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0D1117] border border-[#252E38]">
                <span className="text-slate-500 block text-[10px]">Longueur</span>
                <span className="text-white font-bold">{selectedStage.sonatrel_cameroon_benchmark.length_km} km</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#080B10] border border-[#252E38] text-xs text-slate-300 space-y-1">
              <span className="text-sky-400 font-mono font-bold text-[11px] block">Spécificités d'Exploitation :</span>
              <p className="leading-relaxed">
                {locale === 'fr'
                  ? selectedStage.sonatrel_cameroon_benchmark.specifics_fr
                  : selectedStage.sonatrel_cameroon_benchmark.specifics_en}
              </p>
            </div>
          </div>

          {/* Electrical Single-Line Schematic of the Corridor Bay */}
          <div className="p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <Network className="h-3.5 w-3.5 text-sky-400" />
                <span>{locale === 'fr' ? 'Schéma Électrique Unifilaire Étape' : 'Bay SLD Schematic'}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                CEI 60617
              </span>
            </div>

            {/* High-Contrast SVG Schematic */}
            <div className="p-3 rounded-xl bg-[#080B10] border border-[#252E38] flex items-center justify-center">
              <svg viewBox="0 0 380 180" className="w-full h-auto">
                <defs>
                  <linearGradient id="busGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#818CF8" />
                  </linearGradient>
                </defs>

                {/* Busbar Line */}
                <line x1="20" y1="30" x2="360" y2="30" stroke="url(#busGrad)" strokeWidth="4" />
                <text x="25" y="22" fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">Jeu de Barres 225 kV (Bus 1)</text>

                {/* Disconnector 1 */}
                <line x1="100" y1="30" x2="100" y2="55" stroke="#94A3B8" strokeWidth="2" />
                <circle cx="100" cy="55" r="3" fill="#38BDF8" />
                <line x1="100" y1="55" x2="110" y2="70" stroke="#38BDF8" strokeWidth="2" />
                <circle cx="100" cy="75" r="3" fill="#38BDF8" />
                <text x="120" y="65" fill="#94A3B8" fontSize="9" fontFamily="monospace">QS1 (Sectionneur)</text>

                {/* Circuit Breaker */}
                <line x1="100" y1="78" x2="100" y2="95" stroke="#94A3B8" strokeWidth="2" />
                <rect x="90" y="95" width="20" height="22" fill="#0D1117" stroke="#10B981" strokeWidth="2" rx="2" />
                <text x="96" y="110" fill="#10B981" fontSize="10" fontWeight="bold">✕</text>
                <text x="120" y="108" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="bold">QA1 (Disjoncteur 225 kV)</text>

                {/* CT & Surge Arrester */}
                <line x1="100" y1="117" x2="100" y2="135" stroke="#94A3B8" strokeWidth="2" />
                <circle cx="100" cy="135" r="6" fill="none" stroke="#F59E0B" strokeWidth="2" />
                <text x="120" y="138" fill="#F59E0B" fontSize="9" fontFamily="monospace">TC Classe 5P20</text>

                {/* Line Disconnector & Earthing Switch */}
                <line x1="100" y1="141" x2="100" y2="160" stroke="#94A3B8" strokeWidth="2" />
                <circle cx="100" cy="160" r="3" fill="#38BDF8" />
                <line x1="100" y1="160" x2="280" y2="160" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="4 2" />
                <text x="290" y="163" fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">Départ Ligne 225 kV</text>

                {/* Earthing switch to ground */}
                <line x1="100" y1="160" x2="60" y2="160" stroke="#EF4444" strokeWidth="1.5" />
                <line x1="60" y1="150" x2="60" y2="170" stroke="#EF4444" strokeWidth="1.5" />
                <line x1="55" y1="170" x2="65" y2="170" stroke="#EF4444" strokeWidth="2" />
                <line x1="57" y1="173" x2="63" y2="173" stroke="#EF4444" strokeWidth="1.5" />
                <text x="30" y="145" fill="#EF4444" fontSize="9" fontFamily="monospace">Q8 (Terre)</text>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
