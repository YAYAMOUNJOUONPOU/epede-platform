import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Zap, AlertTriangle, RefreshCw, Power, Maximize2, X } from 'lucide-react';
import { CircuitBreakerCutawayWorkbench } from '../equipment/CircuitBreakerCutawayWorkbench';

interface InteractiveCircuitBreakerProps {
  locale: 'fr' | 'en';
  bayName?: string;
  voltageRating?: string;
  ratedBreakingCurrent?: string;
  onStateChange?: (state: 'CLOSED' | 'OPEN') => void;
}

export const InteractiveCircuitBreaker: React.FC<InteractiveCircuitBreakerProps> = ({
  locale,
  bayName = 'TR-225-D01',
  voltageRating = '225 kV',
  ratedBreakingCurrent = '40 kA',
  onStateChange,
}) => {
  const [breakerState, setBreakerState] = useState<'CLOSED' | 'OPEN'>('CLOSED');
  const [isCutawayModalOpen, setIsCutawayModalOpen] = useState(false);
  const [switchingEvent, setSwitchingEvent] = useState<{
    type: 'OPEN' | 'CLOSED' | 'OPENED';
    timestamp: string;
    messageFr: string;
    messageEn: string;
  } | null>(null);

  const toggleBreaker = () => {
    const newState = breakerState === 'CLOSED' ? 'OPEN' : 'CLOSED';
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

    setBreakerState(newState);
    onStateChange?.(newState);

    setSwitchingEvent({
      type: newState,
      timestamp: timeStr,
      messageFr: newState === 'OPEN'
        ? `ÉVÉNEMENT DE COMMUTATION : Déclenchement disjoncteur ${bayName} — Coupure d’arc SF6 réussie. Flux de puissance interrompu sur la travée.`
        : `ÉVÉNEMENT DE COMMUTATION : Enclenchement disjoncteur ${bayName} — Pôles synchronisés sous tension. Flux de puissance rétabli.`,
      messageEn: newState === 'OPEN'
        ? `SWITCHING EVENT : Circuit breaker ${bayName} tripped OPEN — SF6 arc extinction verified. Power flow halted on bay.`
        : `SWITCHING EVENT : Circuit breaker ${bayName} CLOSED — Synchronized poles energized. Power flow restored.`,
    });
  };

  const isClosed = breakerState === 'CLOSED';

  return (
    <>
      <div 
        id="interactive-breaker-module"
        className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs shadow-xl space-y-4"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Power className="h-4 w-4 text-amber-500" />
            <span className="font-bold uppercase tracking-wider text-slate-200">
              {locale === 'fr' ? 'DISJONCTEUR HTB INTERACTIF' : 'INTERACTIVE HV CIRCUIT BREAKER'}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-400 text-[10px]">
              {bayName}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCutawayModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/35 text-[10px] font-mono font-bold transition-all cursor-pointer shadow-sm"
            >
              <Maximize2 className="w-3 h-3 text-cyan-400" />
              <span>{locale === 'fr' ? 'Coupe 3D SF₆' : '3D SF₆ Cutaway'}</span>
            </button>

            {/* Status Badge */}
            <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
              isClosed 
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80' 
                : 'bg-red-950/80 text-red-400 border border-red-800/80'
            }`}>
              <span className={`h-2 w-2 rounded-full ${isClosed ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <span>{isClosed ? (locale === 'fr' ? 'FERMÉ (EN SERVICE)' : 'CLOSED (ENERGIZED)') : (locale === 'fr' ? 'OUVERT (DÉCLENCHÉ)' : 'OPEN (TRIPPED)')}</span>
            </div>
          </div>
        </div>

      {/* Schematic Busbar & Breaker Visual Representation */}
      <div className="relative py-6 px-4 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
        
        {/* Animated Busbar Copper Wire */}
        <div className="w-full flex items-center justify-between relative max-w-sm">
          {/* Infeed line */}
          <div className="h-2 flex-1 relative rounded-l-full overflow-hidden bg-slate-800">
            <div className={`absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 ${isClosed ? 'opacity-100 animate-pulse' : 'opacity-30'}`} />
          </div>

          {/* Central Breaker Mechanism Graphic */}
          <button
            type="button"
            onClick={toggleBreaker}
            title={locale === 'fr' ? 'Cliquer pour commuter le disjoncteur' : 'Click to toggle circuit breaker'}
            className={`relative z-10 mx-2 p-3 sm:p-4 rounded-xl border-2 transition-all transform active:scale-95 flex flex-col items-center justify-center cursor-pointer shadow-lg ${
              isClosed
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 hover:border-emerald-400 shadow-emerald-950/50'
                : 'bg-red-950/90 border-red-500 text-red-300 hover:border-red-400 shadow-red-950/50'
            }`}
          >
            <div className="flex items-center gap-1 font-black text-sm">
              <span>52</span>
              <span>{isClosed ? '●' : '○'}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
              {isClosed ? (locale === 'fr' ? 'OUVRIR' : 'TRIP OPEN') : (locale === 'fr' ? 'FERMER' : 'CLOSE')}
            </span>
          </button>

          {/* Outgoing line (cut off if open) */}
          <div className="h-2 flex-1 relative rounded-r-full overflow-hidden bg-slate-800">
            <div className={`absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 transition-opacity duration-300 ${isClosed ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
          </div>
        </div>

        {/* State description banner */}
        <div className="mt-4 text-center">
          <span className="text-[11px] text-slate-400">
            {isClosed 
              ? (locale === 'fr' ? 'Courant nominal continu sous 225 kV : 2500 A · Pression SF6 nominale 6.0 bar' : 'Continuous rated current at 225 kV : 2500 A · SF6 gas pressure nominal 6.0 bar')
              : (locale === 'fr' ? 'Disjoncteur ouvert · Isolement galvanique assuré per CEI 62271-100' : 'Breaker contacts separated · Dielectric gap maintained per IEC 62271-100')}
          </span>
        </div>
      </div>

      {/* Switching Event Notification HUD */}
      {switchingEvent && (
        <div className={`p-3 rounded-xl border transition-all ${
          switchingEvent.type === 'OPENED'
            ? 'bg-red-950/40 border-red-800/60 text-red-200'
            : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
        }`}>
          <div className="flex items-start gap-2.5">
            <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${switchingEvent.type === 'OPENED' ? 'text-red-400' : 'text-emerald-400'}`} />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[10px] tracking-wider uppercase">
                  SOE TIMESTAMP : {switchingEvent.timestamp}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-slate-950/80 text-[9px] font-mono">
                  {switchingEvent.type === 'OPENED' ? 'TRIP_EVENT' : 'CLOSE_EVENT'}
                </span>
              </div>
              <p className="text-[11px] font-sans leading-relaxed">
                {locale === 'fr' ? switchingEvent.messageFr : switchingEvent.messageEn}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Engineering Rating Meta Footer */}
      <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
        <div>
          <span className="block text-slate-500">{locale === 'fr' ? 'Tension assignée :' : 'Rated Voltage :'}</span>
          <span className="font-bold text-white">{voltageRating}</span>
        </div>
        <div>
          <span className="block text-slate-500">{locale === 'fr' ? 'Pouvoir coupure :' : 'Breaking Capacity :'}</span>
          <span className="font-bold text-amber-400">{ratedBreakingCurrent}</span>
        </div>
        <div>
          <span className="block text-slate-500">{locale === 'fr' ? 'Cycle de coupure :' : 'Operating Sequence :'}</span>
          <span className="font-bold text-slate-300">O - 0.3s - CO - 3min - CO</span>
        </div>
      </div>
    </div>

    {/* Master 3D Electromechanical Cutaway Modal */}
    {isCutawayModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-700 bg-[#0A0E15] shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-[#0E131A] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Zap className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-mono font-bold text-white uppercase">
                  {locale === 'fr' ? 'COUPE ÉLECTROMÉCANIQUE DE LA CHAMBRE DE COUPURE SF₆' : '3D SF₆ PUFFER INTERRUPTER CHAMBER CUTAWAY'}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  {locale === 'fr' ? 'Extinction de l\'arc électrique, tuyère PTFE et tension TRV CEI 62271-100' : 'Arc plasma quenching, PTFE nozzle and TRV recovery per IEC 62271-100'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCutawayModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-4 sm:p-6 flex-1">
            <CircuitBreakerCutawayWorkbench
              locale={locale}
              bayName={bayName}
              voltageKv={parseInt(voltageRating, 10) || 225}
              breakingCapacityKa={parseInt(ratedBreakingCurrent, 10) || 40}
              embedded={true}
            />
          </div>
        </div>
      </div>
    )}
  </>
  );
};
