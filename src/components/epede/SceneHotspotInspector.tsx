// src/components/epede/SceneHotspotInspector.tsx
// Interactive equipment hotspot inspector overlay on engineering photographs
import React, { useState } from 'react';
import { Info, X, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export interface EquipmentHotspot {
  id: string;
  xPercent: number; // 0 - 100%
  yPercent: number; // 0 - 100%
  labelFr: string;
  labelEn: string;
  roleFr: string;
  roleEn: string;
  standardRef?: string;
}

interface SceneHotspotInspectorProps {
  locale: 'fr' | 'en';
  imageUrl: string;
  imageAlt: string;
  captionFr: string;
  captionEn: string;
  hotspots?: EquipmentHotspot[];
  heightClass?: string;
}

export const SceneHotspotInspector: React.FC<SceneHotspotInspectorProps> = ({
  locale,
  imageUrl,
  imageAlt,
  captionFr,
  captionEn,
  hotspots = [],
  heightClass = 'h-80 sm:h-96',
}) => {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const activeHotspot = hotspots.find((h) => h.id === activeHotspotId);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group select-none ${heightClass}`}>
      {/* Engineering Photograph */}
      <img
        src={imageUrl}
        alt={imageAlt}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover opacity-90 group-hover:opacity-95 transition-opacity duration-300"
        loading="lazy"
      />

      {/* Atmospheric Vignette & Contrast Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

      {/* Hotspots layer */}
      {hotspots.map((hs) => {
        const isSelected = activeHotspotId === hs.id;
        return (
          <button
            key={hs.id}
            type="button"
            onClick={() => setActiveHotspotId(isSelected ? null : hs.id)}
            style={{ left: `${hs.xPercent}%`, top: `${hs.yPercent}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-1 rounded-full transition-transform cursor-pointer ${
              isSelected ? 'scale-125' : 'hover:scale-110'
            }`}
            title={locale === 'fr' ? (hs?.labelFr || '') : (hs?.labelEn || '')}
          >
            <span className="relative flex h-7 w-7 items-center justify-center">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSelected ? 'bg-cyan-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex rounded-full h-5 w-5 items-center justify-center text-[10px] font-mono font-bold text-slate-950 shadow-md ${
                isSelected ? 'bg-cyan-300 ring-2 ring-white' : 'bg-amber-400'
              }`}>
                +
              </span>
            </span>
          </button>
        );
      })}

      {/* Active Hotspot Drawer / Card */}
      {activeHotspot && (
        <div className="absolute top-3 left-3 right-3 sm:left-auto sm:right-3 sm:max-w-xs z-30 p-3.5 rounded-xl bg-slate-950/95 backdrop-blur-md border border-cyan-500/40 text-slate-100 shadow-2xl font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">
                {locale === 'fr' ? 'Composant Identifié' : 'Identified Component'}
              </span>
              <h5 className="font-bold text-white text-sm">
                {locale === 'fr' ? (activeHotspot?.labelFr || '') : (activeHotspot?.labelEn || '')}
              </h5>
            </div>
            <button
              type="button"
              onClick={() => setActiveHotspotId(null)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-slate-300 text-[11px] font-sans leading-relaxed">
            {locale === 'fr' ? (activeHotspot?.roleFr || '') : (activeHotspot?.roleEn || '')}
          </p>
          {activeHotspot.standardRef && (
            <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-amber-400">
              <span>Norme / Standard :</span>
              <span className="font-bold">{activeHotspot.standardRef}</span>
            </div>
          )}
        </div>
      )}

      {/* Bottom Technical Caption */}
      <div className="absolute bottom-3 left-3 right-3 text-xs font-mono text-slate-300 bg-slate-950/85 backdrop-blur-sm p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3">
        <div className="truncate">
          <span className="text-amber-400 font-bold mr-2 block sm:inline">
            {locale === 'fr' ? captionFr.split('—')[0] : captionEn.split('—')[0]}
          </span>
          <span className="text-slate-300 text-[11px] hidden md:inline">
            {locale === 'fr' ? captionFr : captionEn}
          </span>
        </div>
        {hotspots.length > 0 && (
          <span className="shrink-0 px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold border border-sky-500/30 hidden sm:inline-block">
            {hotspots.length} {locale === 'fr' ? 'POINTS CLÉS' : 'HOTSPOTS'}
          </span>
        )}
      </div>
    </div>
  );
};
