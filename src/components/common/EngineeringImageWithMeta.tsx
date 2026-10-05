// src/components/common/EngineeringImageWithMeta.tsx
// Authoritative Real-World Electrical Engineering Photographic Viewer
// Compliant with EPEDE Visual Asset Expansion Directive: Full Attribution, Technical Metadata, Callouts, and SVG Fallback

import React, { useState } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  Info, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Layers, 
  FileCheck2, 
  X,
  AlertTriangle
} from 'lucide-react';
import type { EpedeImageAsset } from '../../data/assets/epedeAssetRegistry';
import { EquipmentCutawaySvgFallback } from '../reference/modules/EquipmentCutawaySvgFallback';

interface EngineeringImageWithMetaProps {
  asset: EpedeImageAsset;
  locale: 'fr' | 'en';
  className?: string;
  aspectRatioClass?: string;
  showCallouts?: boolean;
  priority?: boolean;
  onNavigateStandard?: (std: string) => void;
}

export const EngineeringImageWithMeta: React.FC<EngineeringImageWithMetaProps> = ({
  asset,
  locale,
  className = '',
  aspectRatioClass = 'aspect-video',
  showCallouts = true,
  priority = false,
  onNavigateStandard,
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showMetaDrawer, setShowMetaDrawer] = useState<boolean>(false);
  const [activeCalloutIdx, setActiveCalloutIdx] = useState<number | null>(null);

  const isFr = locale === 'fr';

  return (
    <div className={`group relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0B1017] shadow-xl flex flex-col ${className}`}>
      {/* 1. Main Viewport Stage */}
      <div className={`relative w-full ${aspectRatioClass} overflow-hidden bg-slate-950 flex items-center justify-center select-none`}>
        {/* Loading Spinner Skeleton */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-[#080D14] z-10">
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <span className="text-[11px] font-mono text-slate-400">
              {isFr ? 'Chargement de l\'archive photographique...' : 'Loading engineering photo...'}
            </span>
          </div>
        )}

        {/* Fallback to SVG Cutaway on Image Error / Offline Mode */}
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-300">
            <div className="w-full h-full max-h-[300px] flex items-center justify-center">
              <EquipmentCutawaySvgFallback
                category="TRANSFORMER"
                isOperating={true}
                locale={locale}
              />
            </div>
            <div className="mt-2 text-center">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono">
                <AlertTriangle className="w-3 h-3" />
                {isFr ? 'Photographie hors-ligne · Schéma vectoriel CEI normalisé de substitution' : 'Offline photo · Standardized IEC vector schematic fallback'}
              </span>
            </div>
          </div>
        ) : (
          <img
            src={asset.imageUrl}
            alt={asset.altText[locale]}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}

        {/* Dark Vignette Overlay for Crisp Metadata Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Technical Identification Confidence Badge (Top-Left) */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-md border ${
            asset.verificationStatus === 'VERIFIED_DOCUMENTARY'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
              : 'bg-amber-950/80 text-amber-300 border-amber-500/50'
          }`}>
            {isFr 
              ? (asset.verificationStatus === 'VERIFIED_DOCUMENTARY' ? '✓ DOCUMENTAIRE VÉRIFIÉ' : '⚡ PHOTOGRAPHIE REPRÉSENTATIVE')
              : (asset.verificationStatus === 'VERIFIED_DOCUMENTARY' ? '✓ VERIFIED DOCUMENTARY' : '⚡ REPRESENTATIVE PHOTOGRAPH')}
          </span>

          {asset.voltageClass && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
              {asset.voltageClass}
            </span>
          )}
        </div>

        {/* Interactive Action Controls (Top-Right) */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowMetaDrawer((prev) => !prev)}
            className={`p-1.5 rounded-lg border backdrop-blur-md transition-all cursor-pointer ${
              showMetaDrawer 
                ? 'bg-amber-500 text-slate-950 border-amber-300' 
                : 'bg-slate-950/80 text-slate-300 hover:text-white border-slate-700/80 hover:bg-slate-900'
            }`}
            title={isFr ? 'Détails techniques & provenance' : 'Technical details & provenance'}
          >
            <Info className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition-all cursor-pointer"
            title={isFr ? 'Agrandir en plein écran' : 'View full-screen'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Engineering Callouts over Photo */}
        {showCallouts && !hasError && asset.calloutAnnotations && asset.calloutAnnotations.map((callout, idx) => {
          const isSelected = activeCalloutIdx === idx;
          return (
            <div
              key={idx}
              style={{ left: `${callout.xPercent}%`, top: `${callout.yPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <button
                type="button"
                onClick={() => setActiveCalloutIdx(isSelected ? null : idx)}
                className={`relative w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all cursor-pointer shadow-2xl ${
                  isSelected 
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 scale-125' 
                    : 'bg-slate-900/90 text-cyan-300 border border-cyan-400 hover:scale-110 hover:border-amber-400'
                }`}
              >
                {idx + 1}
                <span className="absolute -inset-1 rounded-full bg-cyan-400/20 animate-ping pointer-events-none" />
              </button>

              {/* Pinpoint Callout Card */}
              {isSelected && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-60 p-3 rounded-xl bg-slate-950/95 border border-amber-400/60 shadow-2xl backdrop-blur-md z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800 mb-1.5">
                    <span className="text-[11px] font-bold text-amber-400 font-mono">
                      {idx + 1}. {callout.label[locale]}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCalloutIdx(null);
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {callout.detail[locale]}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom Headline Bar */}
        <div className="absolute bottom-0 inset-x-0 p-4 z-20 pointer-events-none">
          <h4 className="text-sm sm:text-base font-bold text-white tracking-wide leading-tight drop-shadow-md">
            {asset.title[locale]}
          </h4>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed drop-shadow">
            {asset.caption[locale]}
          </p>
        </div>
      </div>

      {/* 2. Technical Provenance & Specification Drawer (Collapsible) */}
      {showMetaDrawer && (
        <div className="p-4 bg-[#080D14] border-t border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {isFr ? 'Attribution & Licence' : 'Attribution & License'}
              </span>
              <div className="text-slate-200 font-medium">{asset.photographerOrCopyright}</div>
              <div className="text-[11px] text-cyan-400 flex items-center gap-1">
                <span>{asset.sourceOrganization}</span>
                <span className="text-slate-500">·</span>
                <span className="text-amber-400">{asset.licenseStatus}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">
                {isFr ? 'Normes Électriques CEI / IEEE' : 'Applicable Standards'}
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {asset.standardsRef.map((std, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => onNavigateStandard?.(std)}
                    className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50 hover:border-cyan-400 text-[10px] transition-colors"
                  >
                    {std}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mandatory Professional Technical Disclaimer */}
          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-300/90 leading-relaxed font-sans flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              {isFr
                ? 'Photographie représentative d\'un équipement industriel de cette classe de tension. La configuration exacte et les raccordements réels varient selon le constructeur et le projet.'
                : 'Representative engineering photograph. Actual equipment configuration, dimensions, and termination arrangements depend on manufacturer and project requirements.'}
            </span>
          </div>
        </div>
      )}

      {/* 3. Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setIsFullscreen(false)}
        >
          <div 
            className="relative max-w-6xl w-full max-h-[92vh] flex flex-col rounded-2xl overflow-hidden bg-[#0A0F17] border border-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0E1520]">
              <div>
                <h3 className="text-base font-bold text-white font-sans">{asset.title[locale]}</h3>
                <span className="text-xs font-mono text-cyan-400">{asset.attributionRequirement}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Full-Res Stage */}
            <div className="relative flex-1 overflow-auto bg-black flex items-center justify-center min-h-[400px]">
              <img
                src={asset.imageUrl}
                alt={asset.altText[locale]}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            {/* Lightbox Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-[#0E1520] flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="truncate max-w-[70%]">{asset.caption[locale]}</span>
              <a
                href={asset.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-amber-400 hover:underline"
              >
                <span>{isFr ? 'Source Officielle' : 'Official Source'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
