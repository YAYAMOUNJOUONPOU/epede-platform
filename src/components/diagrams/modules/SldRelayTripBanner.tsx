// src/components/diagrams/modules/SldRelayTripBanner.tsx
import React from 'react';
import { ShieldAlert, Sliders, Activity } from 'lucide-react';

export interface RelayTripInfo {
  ansi: string;
  description_fr: string;
  description_en: string;
  timestamp: string;
  clearingTime?: string;
  faultMagnitude?: string;
}

interface SldRelayTripBannerProps {
  locale: 'fr' | 'en';
  relayTripped: RelayTripInfo | null;
  onResetProtections: () => void;
  onOpenTcc?: () => void;
  onOpenOscillogram?: () => void;
}

export const SldRelayTripBanner: React.FC<SldRelayTripBannerProps> = ({
  locale,
  relayTripped,
  onResetProtections,
  onOpenTcc,
  onOpenOscillogram,
}) => {
  if (!relayTripped) return null;

  return (
    <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-start justify-between gap-4 shadow-sm animate-in fade-in duration-200">
      <div className="flex items-start gap-3">
        <ShieldAlert className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-black bg-rose-600 text-white px-2 py-0.5 rounded-md shadow-xs">
              {relayTripped.ansi}
            </span>
            <span className="text-xs font-mono text-rose-800 font-bold">
              {relayTripped.timestamp} · RELAY TRIP LOCKOUT 86 ACTIVE
            </span>
            {relayTripped.clearingTime && (
              <span className="text-[11px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                t_clear: {relayTripped.clearingTime}
              </span>
            )}
            {relayTripped.faultMagnitude && (
              <span className="text-[11px] font-mono bg-white text-rose-900 px-2 py-0.5 rounded-md border border-rose-200 shadow-xs">
                {relayTripped.faultMagnitude}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-rose-950 mt-1">
            {locale === 'fr' ? relayTripped.description_fr : relayTripped.description_en}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onOpenOscillogram && (
          <button
            type="button"
            onClick={onOpenOscillogram}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-mono font-bold transition-colors shadow-xs cursor-pointer"
          >
            <Activity className="h-3.5 w-3.5 text-white" />
            <span>{locale === 'fr' ? 'Oscillogramme' : 'Waveform Replay'}</span>
          </button>
        )}
        {onOpenTcc && (
          <button
            type="button"
            onClick={onOpenTcc}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-mono font-bold transition-colors shadow-xs cursor-pointer"
          >
            <Sliders className="h-3.5 w-3.5 text-sky-600" />
            <span>{locale === 'fr' ? 'Courbe TCC' : 'View TCC'}</span>
          </button>
        )}
        <button
          type="button"
          onClick={onResetProtections}
          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-mono font-bold uppercase transition-colors shadow-xs cursor-pointer"
        >
          {locale === 'fr' ? 'Acquitter (Re-Arm)' : 'Acknowledge Trip'}
        </button>
      </div>
    </div>
  );
};

