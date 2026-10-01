// src/components/digitaltwin/AasDrawer.tsx
// Slide-over drawer for Asset Administration Shell (AAS v3) Digital Twin inspection

import React from 'react';
import { X } from 'lucide-react';
import type { Equipment } from '../../types/epede';
import { AasSubmodelViewer } from './AasSubmodelViewer';

interface AasDrawerProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
}

export const AasDrawer: React.FC<AasDrawerProps> = ({
  equipment,
  isOpen,
  onClose,
  locale
}) => {
  if (!isOpen || !equipment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-[#090D14] h-full shadow-2xl border-l border-[#222B38] overflow-y-auto flex flex-col transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-[#0d1424] border-b border-[#253248] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
              Inspecteur Jumeau Numérique AAS v3 (IEC 63278)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 flex-1">
          <AasSubmodelViewer equipment={equipment} locale={locale} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};
