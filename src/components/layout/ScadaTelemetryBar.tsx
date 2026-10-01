// src/components/layout/ScadaTelemetryBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Radio, Cpu, ShieldAlert, Flame, RotateCcw, Activity } from 'lucide-react';
import { ScadaIncidentConsoleModal } from '../scada/ScadaIncidentConsoleModal';
import {
  SCADA_GRID_INCIDENTS,
  ScadaGridIncident,
  SoeEventLog
} from '../../data/scadaGridIncidentsData';

interface ScadaTelemetryBarProps {
  locale: 'fr' | 'en';
}

export const ScadaTelemetryBar: React.FC<ScadaTelemetryBarProps> = ({ locale }) => {
  const isFr = locale === 'fr';

  // Live telemetry state
  const [freq, setFreq] = useState(50.018);
  const [voltage, setVoltage] = useState(225.42);
  const [activePower, setActivePower] = useState(1482.6);
  const [reactivePower, setReactivePower] = useState(312.4);
  const [pf] = useState(0.978);
  const [isLive, setIsLive] = useState(true);
  const [packetCount, setPacketCount] = useState(18420);

  // Dynamic incident simulation state
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [activeIncident, setActiveIncident] = useState<ScadaGridIncident | null>(null);
  const [activeSoeLogs, setActiveSoeLogs] = useState<SoeEventLog[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Normal subtle jitter when no incident is active
  useEffect(() => {
    if (!isLive || activeIncident) return;
    const interval = setInterval(() => {
      // 50.00 Hz nominal with slight grid frequency jitter (+/- 0.015 Hz)
      setFreq((prev) => {
        const jitter = (Math.random() - 0.49) * 0.006;
        const next = prev + jitter;
        return Number(Math.max(49.96, Math.min(50.04, next)).toFixed(3));
      });

      // 225 kV nominal transmission bus (+/- 0.15 kV)
      setVoltage((prev) => {
        const jitter = (Math.random() - 0.5) * 0.08;
        const next = prev + jitter;
        return Number(Math.max(223.5, Math.min(227.0, next)).toFixed(2));
      });

      // Active power MW fluctuation
      setActivePower((prev) => {
        const jitter = (Math.random() - 0.5) * 1.2;
        return Number((prev + jitter).toFixed(1));
      });

      // Reactive power fluctuation
      setReactivePower((prev) => {
        const jitter = (Math.random() - 0.5) * 0.8;
        return Number((prev + jitter).toFixed(1));
      });

      // Telemetry packet tick
      setPacketCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2200);

    return () => clearInterval(interval);
  }, [isLive, activeIncident]);

  // Clean timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleTriggerIncident = (incident: ScadaGridIncident) => {
    // Clear any ongoing simulation
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    setActiveIncident(incident);
    setActiveSoeLogs([]);

    // Schedule playback of SOE timeline events (accelerated x1.2 for crisp response)
    incident.eventsTimeline.forEach((event, idx) => {
      const delay = Math.round(event.offsetMs * 0.8);
      const timeoutId = setTimeout(() => {
        setFreq(event.telemetrySnapshot.freqHz);
        setVoltage(event.telemetrySnapshot.voltageKv);
        setActivePower(event.telemetrySnapshot.activePowerMw);
        setReactivePower(event.telemetrySnapshot.reactivePowerMvar);
        setPacketCount(p => p + 12);
        setActiveSoeLogs(prev => [...prev, event]);
      }, delay);
      timeoutsRef.current.push(timeoutId);
    });
  };

  const handleResetGridNominal = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setActiveIncident(null);
    setActiveSoeLogs([]);
    setFreq(50.018);
    setVoltage(225.42);
    setActivePower(1482.6);
    setReactivePower(312.4);
  };

  const isAlarm = activeIncident !== null;
  const latestMessage = activeSoeLogs.length > 0
    ? (isFr ? activeSoeLogs[activeSoeLogs.length - 1].message_fr : activeSoeLogs[activeSoeLogs.length - 1].message_en)
    : (isFr ? activeIncident?.title_fr : activeIncident?.title_en);

  return (
    <>
      <div
        id="scada-telemetry-bar"
        role="region"
        aria-label="SCADA Grid Status and Telemetry"
        className={`w-full backdrop-blur-xl border-b text-xs font-mono select-none px-3 sm:px-6 py-1.5 transition-colors shadow-sm ${
          isAlarm
            ? 'bg-rose-950/90 border-rose-500/80 text-rose-100 animate-pulse'
            : 'bg-[#02050E]/95 border-white/[0.06] text-slate-300'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1.5 gap-x-4">
          
          {/* Left: SCADA Status indicator & Bus Voltage */}
          <div className="flex items-center gap-3 overflow-x-auto">
            {/* Status Badge */}
            <button
              type="button"
              onClick={() => setIsConsoleOpen(true)}
              className={`flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-95 shadow-xs ${
                isAlarm
                  ? 'bg-rose-600 text-white border border-rose-400 shadow-md shadow-rose-900/50'
                  : 'bg-sky-950/70 border border-sky-500/50 text-sky-300 hover:bg-sky-900/80 hover:border-sky-400'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAlarm ? 'bg-rose-200' : 'bg-sky-400'}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isAlarm ? 'bg-white' : 'bg-sky-400'}`} />
              </span>
              <span>{isAlarm ? (isFr ? 'ALERTE CCR · INCIDENT' : 'CCR ALERT · FAULT') : 'SCADA · LIVE'}</span>
            </button>

            {/* Substation Identity */}
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Cpu className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-slate-200 font-bold">
                {activeIncident ? activeIncident.substationTag : 'SUB-BEKOKO-225'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-medium">BUS 1 (225 kV)</span>
            </span>

            {/* Grid Frequency */}
            <div className={`flex items-center gap-1.5 border px-2.5 py-0.5 rounded-lg shadow-xs ${
              Math.abs(freq - 50.0) > 0.3
                ? 'bg-rose-900/80 border-rose-500 text-white font-black'
                : Math.abs(freq - 50.0) > 0.05
                ? 'bg-amber-900/60 border-amber-600 text-amber-300'
                : 'bg-slate-900/90 border-slate-800 text-slate-200'
            }`}>
              <span className="text-[10px] font-bold opacity-70">FREQ:</span>
              <span className="font-bold text-emerald-400">{freq.toFixed(3)}</span>
              <span className="text-[10px] opacity-70">Hz</span>
            </div>

            {/* Bus Voltage */}
            <div className={`flex items-center gap-1.5 border px-2.5 py-0.5 rounded-lg shadow-xs ${
              voltage < 180 || voltage > 240
                ? 'bg-rose-900/80 border-rose-500 text-white font-black'
                : 'bg-slate-900/90 border-slate-800 text-slate-200'
            }`}>
              <span className="text-[10px] font-bold opacity-70">U_bus:</span>
              <span className="font-bold text-sky-300">{voltage.toFixed(2)}</span>
              <span className="text-[10px] opacity-70">kV</span>
            </div>

            {/* Active Incident Warning ticker on larger screens */}
            {isAlarm && latestMessage && (
              <span className="hidden lg:inline-flex items-center gap-1.5 text-rose-200 text-[11px] truncate max-w-sm">
                <Flame className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                <span className="truncate">{latestMessage}</span>
              </span>
            )}
          </div>

          {/* Right: Active/Reactive Power & SCADA Telemetry status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Power P */}
            <div className="hidden sm:flex items-center gap-1 text-[11px]">
              <span className="text-slate-400 font-bold">P_grid:</span>
              <span className="font-bold text-slate-100">{activePower.toFixed(1)}</span>
              <span className="text-sky-400 font-bold text-[10px]">MW</span>
            </div>

            {/* Reactive Power Q */}
            <div className="hidden md:flex items-center gap-1 text-[11px]">
              <span className="text-slate-400 font-bold">Q_grid:</span>
              <span className="font-bold text-amber-300">+{reactivePower.toFixed(1)}</span>
              <span className="text-slate-400 text-[10px]">Mvar</span>
            </div>

            {/* Incident Lab Trigger Button */}
            <button
              type="button"
              onClick={() => setIsConsoleOpen(true)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                isAlarm
                  ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-sm'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
              }`}
            >
              <Activity className="h-3 w-3" />
              <span>{isFr ? 'CONSOLE INCIDENTS' : 'INCIDENT LAB'}</span>
            </button>

            {/* Reset Grid Button if active alarm */}
            {isAlarm && (
              <button
                type="button"
                onClick={handleResetGridNominal}
                title={isFr ? 'Réarmer le réseau à 50.00 Hz' : 'Reset grid to 50.00 Hz'}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            )}

            {/* IEC protocol */}
            <div className="hidden xl:flex items-center gap-1 text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              <ShieldCheck className="h-3 w-3 text-sky-400" />
              <span className="font-medium">IEC 60870-5-104</span>
            </div>

            {/* Live Packet Counter */}
            <button
              type="button"
              onClick={() => setIsLive(!isLive)}
              title={isLive ? 'Click to freeze telemetry stream' : 'Click to resume live telemetry'}
              className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-sky-400 transition-colors"
            >
              <Radio className={`h-3 w-3 ${isLive ? 'text-sky-400 animate-pulse' : 'text-slate-600'}`} />
              <span className="hidden xl:inline">{packetCount} pkts</span>
            </button>
          </div>

        </div>
      </div>

      {/* Interactive SCADA Incident Injection & SOE Console Modal */}
      <ScadaIncidentConsoleModal
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        locale={locale}
        activeIncident={activeIncident}
        activeSoeLogs={activeSoeLogs}
        currentTelemetry={{
          freqHz: freq,
          voltageKv: voltage,
          activePowerMw: activePower,
          reactivePowerMvar: reactivePower
        }}
        onTriggerIncident={handleTriggerIncident}
        onResetGridNominal={handleResetGridNominal}
      />
    </>
  );
};
