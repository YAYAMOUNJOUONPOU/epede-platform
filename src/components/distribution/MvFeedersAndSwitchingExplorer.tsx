// src/components/distribution/MvFeedersAndSwitchingExplorer.tsx
// EPEDE D05 - Medium-Voltage Feeders & Primary Switching Apparatus Explorer

import React, { useState } from 'react';
import {
  Zap,
  Sliders,
  ShieldCheck,
  Layers,
  Activity,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  FolderTree,
  Radio,
  Lock,
  Cpu
} from 'lucide-react';
import {
  DISTRIBUTION_APPARATUS_CATALOG,
  type DistributionApparatus
} from './data/distributionEquipmentCatalog';

interface MvFeedersAndSwitchingExplorerProps {
  locale: 'fr' | 'en';
  onSelectEquipment?: (id: string) => void;
}

export const MvFeedersAndSwitchingExplorer: React.FC<MvFeedersAndSwitchingExplorerProps> = ({
  locale,
  onSelectEquipment
}) => {
  const [selectedApparatusId, setSelectedApparatusId] = useState<string>('EQ-TABLEAU-RMU');

  const selectedApparatus: DistributionApparatus =
    DISTRIBUTION_APPARATUS_CATALOG.find((a) => a.id === selectedApparatusId) ||
    DISTRIBUTION_APPARATUS_CATALOG[1];

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Header & Apparatus Selector Ribbon */}
      <div className="p-4 rounded-2xl bg-[#090D15] border border-[#20293B] shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {locale === 'fr'
                  ? 'APPAREILLAGES DE COUPURE & AUTOMATISATION MT'
                  : 'MV SWITCHING & FEEDER AUTOMATION APPARATUS'}
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {locale === 'fr'
                  ? 'Disjoncteurs de départ, Tableaux compacts RMU, Réenclencheurs aériens & IAT'
                  : 'Feeder breakers, Compact RMUs, Pole-mounted auto-reclosers & Sectionalizers'}
              </p>
            </div>
          </div>
        </div>

        {/* Apparatus Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#1C2432]">
          {DISTRIBUTION_APPARATUS_CATALOG.filter(a => ['BREAKER', 'RMU', 'RECLOSER'].includes(a.category)).map((app) => {
            const isSelected = app.id === selectedApparatusId;
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => setSelectedApparatusId(app.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20 ring-1 ring-amber-300'
                    : 'bg-[#0E141F] text-slate-300 border-[#222B38] hover:border-amber-500/50 hover:text-white'
                }`}
              >
                <div className="text-[10px] opacity-80 uppercase tracking-wider mb-1">
                  {app.code}
                </div>
                <div className="text-xs font-bold truncate">
                  {locale === 'fr' ? app.name_fr : app.name_en}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Deep Technical Anatomy Card for Selected Apparatus */}
      <div className="p-6 rounded-2xl bg-[#090D15] border border-[#20293B] shadow-2xl space-y-6">
        {/* Title & Ratings Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1D2533]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-xs font-bold">
                {selectedApparatus.voltage_level}
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 text-xs font-bold">
                In = {selectedApparatus.rated_current}
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-xs font-bold">
                Icu = {selectedApparatus.breaking_capacity.split(' ')[0]} kA
              </span>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              {locale === 'fr' ? selectedApparatus.name_fr : selectedApparatus.name_en}
            </h2>
          </div>

          {/* Standards Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedApparatus.standards.map((std) => (
              <span key={std} className="px-2 py-1 rounded bg-[#06080E] border border-slate-700 text-slate-300 text-xs font-bold">
                {std}
              </span>
            ))}
          </div>
        </div>

        {/* Purpose & Operating Principle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1C2534] space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Rôle & Destination Électrotechnique :' : 'Purpose & Application:'}</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr' ? selectedApparatus.purpose_fr : selectedApparatus.purpose_en}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1C2534] space-y-2">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Principe de Coupure & Fonctionnement :' : 'Operating Principle:'}</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr' ? selectedApparatus.operating_principle_fr : selectedApparatus.operating_principle_en}
            </p>
          </div>
        </div>

        {/* Physical Construction & Components List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-amber-400" />
            <span>{locale === 'fr' ? 'Constitution & Composants Internes :' : 'Physical Construction & Components:'}</span>
          </h4>
          <div className="p-4 rounded-xl bg-[#070A10] border border-[#18212E] space-y-3">
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {locale === 'fr' ? selectedApparatus.physical_construction_fr : selectedApparatus.physical_construction_en}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              {(locale === 'fr' ? selectedApparatus.components_list_fr : selectedApparatus.components_list_en).map((comp, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300 font-sans">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{comp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Specs Key-Value Table */}
        <div className="p-4 rounded-xl bg-[#070A10] border border-[#1A2330] space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {locale === 'fr' ? 'Spécifications Techniques Représentatives :' : 'Representative Engineering Ratings:'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {Object.entries(selectedApparatus.representative_specs).map(([key, val]) => (
              <div key={key} className="p-2.5 rounded-lg bg-[#0E1522] border border-[#202B3C]">
                <div className="text-[10px] text-slate-400 truncate">{key}</div>
                <div className="text-xs font-bold text-amber-300 mt-0.5">{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
