// src/components/diagrams/modules/SldSoeLogPanel.tsx
import React from 'react';
import { Activity } from 'lucide-react';
import type { FaultRecordType } from './SldOscillographyViewer';

export interface SoeLogEntry {
  id: string;
  time: string;
  ansi: string;
  event: string;
  breakers: string;
  clearing: string;
  severity: 'NORMAL' | 'WARNING' | 'CRITICAL';
  faultRecordType?: FaultRecordType;
}

interface SldSoeLogPanelProps {
  locale: 'fr' | 'en';
  soeLogs: SoeLogEntry[];
  onOpenOscillogram?: (type?: FaultRecordType) => void;
}

export const SldSoeLogPanel: React.FC<SldSoeLogPanelProps> = ({ locale, soeLogs, onOpenOscillogram }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />
          <h3 className="font-bold text-xs font-mono text-slate-900 uppercase tracking-wider">
            {locale === 'fr' ? 'Journal SOE / Téléalarmes' : 'SOE Event Chronology'}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {onOpenOscillogram && (
            <button
              type="button"
              onClick={() => onOpenOscillogram('SINGLE_PHASE_GROUND_FAULT')}
              className="flex items-center gap-1 text-[10px] font-mono font-bold bg-cyan-50 hover:bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-lg border border-cyan-300 transition-colors shadow-2xs cursor-pointer"
              title="Ouvrir le relecteur d'oscillogrammes CEI 60255 / COMTRADE"
            >
              <Activity className="h-3 w-3 text-cyan-600" />
              <span>{locale === 'fr' ? 'OSCILLOGRAMMES' : 'WAVEFORMS'}</span>
            </button>
          )}

          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg border border-slate-200">
            {soeLogs.length} EVT
          </span>
        </div>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
        {soeLogs.map((log) => (
          <div
            key={log.id}
            className={`p-2.5 rounded-xl border text-xs font-mono transition-colors ${
              log.severity === 'CRITICAL'
                ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                : log.severity === 'WARNING'
                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="font-bold text-slate-500">{log.time}</span>
              <div className="flex items-center gap-1.5">
                {onOpenOscillogram && log.severity !== 'NORMAL' && (
                  <button
                    type="button"
                    onClick={() => onOpenOscillogram(log.faultRecordType || 'SINGLE_PHASE_GROUND_FAULT')}
                    className="flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Rejouer l'onde transitoire de ce défaut"
                  >
                    <Activity className="h-2.5 w-2.5 text-cyan-600" />
                    <span>{locale === 'fr' ? 'Rejouer' : 'Replay'}</span>
                  </button>
                )}
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    log.severity === 'CRITICAL'
                      ? 'bg-rose-600 text-white'
                      : log.severity === 'WARNING'
                      ? 'bg-amber-500 text-white'
                      : 'bg-sky-100 text-sky-800'
                  }`}
                >
                  {log.ansi}
                </span>
              </div>
            </div>
            <div className="text-[11px] leading-tight font-semibold text-slate-900">
              {log.event}
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] pt-1.5 border-t border-slate-200/60">
              <span className="text-sky-700 font-medium">{log.breakers}</span>
              <span className="font-mono font-semibold text-amber-800">{log.clearing}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

