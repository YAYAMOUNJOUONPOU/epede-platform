// src/components/common/EngineeringInfographicCard.tsx
import React, { useState } from 'react';
import { ENGINEERING_INFOGRAPHICS, EngineeringInfographic, InfographicHotspot } from '../../data/engineeringInfographics';
import { EngineeringInfographicRenderer } from './EngineeringInfographicRenderer';
import { Maximize2, ShieldCheck, Cpu, ChevronRight, Info, CheckCircle } from 'lucide-react';

interface Props {
  infographicId: string;
  locale: 'fr' | 'en';
  onOpenModal?: (infographicId: string) => void;
  className?: string;
  compact?: boolean;
}

export const EngineeringInfographicCard: React.FC<Props> = ({
  infographicId,
  locale,
  onOpenModal,
  className = '',
  compact = false
}) => {
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

  const data: EngineeringInfographic | undefined = ENGINEERING_INFOGRAPHICS[infographicId];

  if (!data) return null;

  const activeHotspot: InfographicHotspot | undefined = data.hotspots.find(
    (h) => h.id === selectedHotspotId
  ) || data.hotspots[0];

  return (
    <div className={`rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-2xl p-5 sm:p-6 transition-all hover:border-slate-700/80 ${className}`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {data.category}
            </span>
            {data.keyStandards?.map((std) => (
              <span key={std} className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/50">
                {std}
              </span>
            ))}
          </div>
          <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {locale === 'fr' ? data.title_fr : data.title_en}
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            {locale === 'fr' ? data.subtitle_fr : data.subtitle_en}
          </p>
        </div>

        {onOpenModal && (
          <button
            onClick={() => onOpenModal(infographicId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-colors shrink-0"
            title={locale === 'fr' ? 'Plein écran & Détails' : 'Fullscreen & Details'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Agrandir' : 'Fullscreen'}</span>
          </button>
        )}
      </div>

      {/* Diagram Canvas */}
      <div className="mb-5">
        <EngineeringInfographicRenderer
          infographicId={infographicId}
          locale={locale}
          onSelectHotspot={(id) => setSelectedHotspotId(id)}
          selectedHotspotId={selectedHotspotId}
        />
      </div>

      {/* Interactive Hotspots Inspector */}
      {!compact && data.hotspots && data.hotspots.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-300">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>{locale === 'fr' ? 'Points Clés & Équipements Normalisés' : 'Key Apparatus & Technical Specs'}</span>
            </div>
            <span className="text-[11px] text-slate-400">
              {locale === 'fr' ? 'Sélectionnez un équipement pour examiner sa fiche' : 'Click any item below to inspect'}
            </span>
          </div>

          {/* Hotspots Pills List */}
          <div className="flex flex-wrap gap-2 mb-4">
            {data.hotspots.map((spot) => {
              const isSelected = spot.id === selectedHotspotId;
              return (
                <button
                  key={spot.id}
                  onClick={() => setSelectedHotspotId(spot.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/20'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-amber-400'}`} />
                  <span>{locale === 'fr' ? spot.name_fr : spot.name_en}</span>
                </button>
              );
            })}
          </div>

          {/* Active Hotspot Technical Callout */}
          {activeHotspot && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs sm:text-sm text-slate-300 space-y-2 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold text-white font-mono text-sm">
                    {locale === 'fr' ? activeHotspot.name_fr : activeHotspot.name_en}
                  </span>
                </div>
                {activeHotspot.standard && (
                  <span className="text-[11px] font-mono text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 self-start sm:self-auto">
                    {activeHotspot.standard}
                  </span>
                )}
              </div>
              <p className="text-slate-300 leading-relaxed pl-6">
                {locale === 'fr' ? activeHotspot.description_fr : activeHotspot.description_en}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
