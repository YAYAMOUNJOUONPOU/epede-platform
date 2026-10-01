// src/components/common/EngineeringInfographicsModal.tsx
import React, { useState } from 'react';
import { 
  ENGINEERING_INFOGRAPHICS, 
  EngineeringInfographic, 
  INFOGRAPHICS_LIST,
  InfographicHotspot
} from '../../data/engineeringInfographics';
import { EngineeringInfographicRenderer } from './EngineeringInfographicRenderer';
import { X, ChevronLeft, ChevronRight, CheckCircle, Shield, BookOpen, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialInfographicId?: string;
  locale: 'fr' | 'en';
}

export const EngineeringInfographicsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialInfographicId = 'power_systems_engineering',
  locale
}) => {
  const [currentId, setCurrentId] = useState<string>(initialInfographicId);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

  // Update currentId when modal opens with new initialInfographicId
  React.useEffect(() => {
    if (initialInfographicId) {
      setCurrentId(initialInfographicId);
      setSelectedHotspotId(null);
    }
  }, [initialInfographicId]);

  if (!isOpen) return null;

  const currentIndex = INFOGRAPHICS_LIST.findIndex((item) => item.id === currentId);
  const data: EngineeringInfographic = ENGINEERING_INFOGRAPHICS[currentId] || INFOGRAPHICS_LIST[0];

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + INFOGRAPHICS_LIST.length) % INFOGRAPHICS_LIST.length;
    setCurrentId(INFOGRAPHICS_LIST[prevIndex].id);
    setSelectedHotspotId(null);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % INFOGRAPHICS_LIST.length;
    setCurrentId(INFOGRAPHICS_LIST[nextIndex].id);
    setSelectedHotspotId(null);
  };

  const activeHotspot: InfographicHotspot | undefined = data.hotspots.find(
    (h) => h.id === selectedHotspotId
  ) || data.hotspots[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-7xl max-h-[95vh] flex flex-col bg-[#070B12] rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Infographie {currentIndex + 1} / {INFOGRAPHICS_LIST.length}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-400">
                  {data.category}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {locale === 'fr' ? data.title_fr : data.title_en}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev / Next buttons */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 border border-slate-700 rounded-lg p-1">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title={locale === 'fr' ? 'Précédent' : 'Previous'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-mono text-slate-400">
                {currentIndex + 1}/{INFOGRAPHICS_LIST.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title={locale === 'fr' ? 'Suivant' : 'Next'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Close modal button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quick Diagram Switcher Carousel Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {INFOGRAPHICS_LIST.map((item, idx) => {
              const isCurrent = item.id === currentId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentId(item.id);
                    setSelectedHotspotId(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs whitespace-nowrap font-medium transition-all flex items-center gap-2 shrink-0 ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-slate-950' : 'bg-amber-400'}`} />
                  <span>{idx + 1}. {locale === 'fr' ? item.title_fr : item.title_en}</span>
                </button>
              );
            })}
          </div>

          {/* Diagram Canvas */}
          <div className="w-full">
            <EngineeringInfographicRenderer
              infographicId={currentId}
              locale={locale}
              onSelectHotspot={(id) => setSelectedHotspotId(id)}
              selectedHotspotId={selectedHotspotId}
              showToggle={true}
            />
          </div>

          {/* Standards and Hotspots Detailed Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
            {/* Left Col: Standards & Reference Context */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-400">
                <Shield className="w-4 h-4" />
                <span>{locale === 'fr' ? 'Normes & Cadre Réglementaire' : 'Standards & Regulations'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.keyStandards?.map((std) => (
                  <span key={std} className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono">
                    {std}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {locale === 'fr'
                  ? 'Intégré aux modules EPEDE pour le calcul, la sélectivité, la mise à la terre et la conformité au réseau national interconnecté.'
                  : 'Integrated with EPEDE workbench calculations for short-circuit, earthing, protection coordination, and national grid code.'}
              </p>
            </div>

            {/* Right 2 Cols: Hotspots & Technical Specs Breakdown */}
            <div className="lg:col-span-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-300">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>{locale === 'fr' ? 'Points d\'Ingénierie & Spécifications' : 'Engineering Hotspots & Specs'}</span>
                </div>
                <span className="text-xs text-slate-500">
                  {locale === 'fr' ? 'Cliquez pour changer d\'équipement actif' : 'Click below to switch active item'}
                </span>
              </div>

              {/* Hotspot buttons */}
              <div className="flex flex-wrap gap-1.5">
                {data.hotspots.map((spot) => {
                  const isSel = spot.id === (selectedHotspotId || (data.hotspots[0]?.id));
                  return (
                    <button
                      key={spot.id}
                      onClick={() => setSelectedHotspotId(spot.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        isSel 
                          ? 'bg-amber-400 text-slate-950 font-bold' 
                          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      {locale === 'fr' ? spot.name_fr : spot.name_en}
                    </button>
                  );
                })}
              </div>

              {/* Active Hotspot Deep Detail */}
              {activeHotspot && (
                <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-mono text-sm">
                      {locale === 'fr' ? activeHotspot.name_fr : activeHotspot.name_en}
                    </span>
                    {activeHotspot.standard && (
                      <span className="font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-[11px] border border-amber-400/30">
                        {activeHotspot.standard}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {locale === 'fr' ? activeHotspot.description_fr : activeHotspot.description_en}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
