// src/components/equipment/modules/EquipmentPhotographicGallery.tsx
// Displays real-world high-resolution industrial photographs, nameplates, cutaways, and interactive callouts.

import React, { useState } from 'react';
import { Camera, Eye, MapPin, Award, Info, ZoomIn, Layers, CheckCircle2 } from 'lucide-react';
import type { PhotographicAsset } from '../../../types/equipmentExplorer';

interface EquipmentPhotographicGalleryProps {
  photographs: PhotographicAsset[];
  locale: 'fr' | 'en';
  equipmentName: string;
}

export const EquipmentPhotographicGallery: React.FC<EquipmentPhotographicGalleryProps> = ({
  photographs,
  locale,
  equipmentName,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [activeCalloutIndex, setActiveCalloutIndex] = useState<number | null>(null);

  if (!photographs || photographs.length === 0) {
    return null;
  }

  const currentPhoto = photographs[selectedPhotoIndex];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/90 backdrop-blur-md overflow-hidden shadow-2xl space-y-4 p-5 font-mono">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {locale === 'fr' ? 'RECONNAISSANCE VISUELLE TERRAIN' : 'FIELD VISUAL RECOGNITION'}
              </span>
              <span className="text-xs text-slate-400 font-bold">
                {selectedPhotoIndex + 1} / {photographs.length} {locale === 'fr' ? 'vues réelles' : 'real views'}
              </span>
            </div>
            <h3 className="text-sm font-black text-white mt-0.5">
              {locale === 'fr' ? 'Photographies Industrielles & Organes Internes Réels' : 'Industrial Photography & Physical Apparatus Recognition'}
            </h3>
          </div>
        </div>

        {/* View Type Badges / Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {photographs.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => {
                setSelectedPhotoIndex(idx);
                setActiveCalloutIndex(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedPhotoIndex === idx
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>
                {photo.viewType === 'FIELD_INSTALLATION'
                  ? (locale === 'fr' ? 'Poste / Chantier' : 'Field Yard')
                  : photo.viewType === 'NAMEPLATE'
                  ? (locale === 'fr' ? 'Plaque Constructeur' : 'Nameplate')
                  : photo.viewType === 'INTERNAL_CUTAWAY'
                  ? (locale === 'fr' ? 'Écorché Interne' : 'Cutaway')
                  : photo.viewType === 'TERMINAL_BUSHINGS'
                  ? (locale === 'fr' ? 'Traversées / Bornes' : 'Bushings')
                  : (locale === 'fr' ? 'Armoire' : 'Cubicle')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Image Stage with Interactive Callouts */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black aspect-[16/9] group">
        <img
          src={currentPhoto.imageUrl}
          alt={currentPhoto.caption[locale] || currentPhoto.caption.fr}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          referrerPolicy="no-referrer"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

        {/* Interactive Callout Markers */}
        {currentPhoto.calloutAnnotations?.map((callout, cIdx) => (
          <div
            key={cIdx}
            style={{ left: `${callout.x}%`, top: `${callout.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
            onClick={() => setActiveCalloutIndex(activeCalloutIndex === cIdx ? null : cIdx)}
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                activeCalloutIndex === cIdx ? 'bg-amber-400' : 'bg-sky-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-5 w-5 items-center justify-center text-[10px] font-black text-slate-950 shadow-lg border border-white/60 ${
                activeCalloutIndex === cIdx ? 'bg-amber-400 ring-2 ring-amber-300' : 'bg-sky-300'
              }`}>
                {cIdx + 1}
              </span>
            </span>

            {/* Hover / Click Popover Tooltip */}
            {activeCalloutIndex === cIdx && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-64 p-3 rounded-xl bg-slate-900/95 border border-amber-500/50 shadow-2xl backdrop-blur-md z-30 text-left pointer-events-auto">
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {locale === 'fr' ? 'Repère Physique' : 'Physical Landmark'} #{cIdx + 1}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                    CEI / IEEE
                  </span>
                </div>
                <h4 className="text-xs font-black text-white">
                  {callout.label[locale] || callout.label.fr}
                </h4>
                <p className="text-[11px] font-sans text-slate-300 mt-1 leading-snug">
                  {callout.detail[locale] || callout.detail.fr}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Bottom context caption bar */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{currentPhoto.caption[locale] || currentPhoto.caption.fr}</span>
            </div>
            {currentPhoto.locationContext && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-sans">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{currentPhoto.locationContext[locale] || currentPhoto.locationContext.fr}</span>
              </div>
            )}
          </div>
          <div className="text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800 shrink-0">
            <span className="text-slate-500 font-bold">{locale === 'fr' ? 'RÉF :' : 'REF:'}</span>{' '}
            <span className="text-slate-300 font-mono">{currentPhoto.creditOrReference}</span>
          </div>
        </div>
      </div>

      {/* Callout Quick Inspection List */}
      {currentPhoto.calloutAnnotations && currentPhoto.calloutAnnotations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
          {currentPhoto.calloutAnnotations.map((callout, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCalloutIndex(activeCalloutIndex === idx ? null : idx)}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                activeCalloutIndex === idx
                  ? 'bg-amber-500/10 border-amber-500/50 text-white'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                activeCalloutIndex === idx ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {idx + 1}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {callout.label[locale] || callout.label.fr}
                </div>
                <div className="text-[10px] font-sans text-slate-400 line-clamp-1 mt-0.5">
                  {callout.detail[locale] || callout.detail.fr}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
