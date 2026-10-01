// src/components/scada/ScadaIncidentConsoleModal.tsx
// EPEDE - Dynamic SCADA Grid Incident Injection & Sequence of Events (SOE) Console
// Real-time grid perturbation simulator grounded in IEC 60870-5-104 and SONATREL National Dispatching

import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  Activity,
  Zap,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Flame,
  X,
  ChevronRight,
  Radio,
  FileText,
  Layers,
  Cpu,
  Shield,
  Gauge
} from 'lucide-react';
import {
  SCADA_GRID_INCIDENTS,
  ScadaGridIncident,
  SoeEventLog
} from '../../data/scadaGridIncidentsData';
import { EvidenceTrustBadge } from '../equipment/EvidenceTrustBadge';

interface ScadaIncidentConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
  activeIncident: ScadaGridIncident | null;
  activeSoeLogs: SoeEventLog[];
  currentTelemetry: {
    freqHz: number;
    voltageKv: number;
    activePowerMw: number;
    reactivePowerMvar: number;
  };
  onTriggerIncident: (incident: ScadaGridIncident) => void;
  onResetGridNominal: () => void;
}

export const ScadaIncidentConsoleModal: React.FC<ScadaIncidentConsoleModalProps> = ({
  isOpen,
  onClose,
  locale,
  activeIncident,
  activeSoeLogs,
  currentTelemetry,
  onTriggerIncident,
  onResetGridNominal
}) => {
  const isFr = locale === 'fr';
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(SCADA_GRID_INCIDENTS[0].id);
  const [curveMetric, setCurveMetric] = useState<'frequency' | 'voltage' | 'dual'>('frequency');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const selectedIncident =
    SCADA_GRID_INCIDENTS.find(inc => inc.id === selectedIncidentId) || SCADA_GRID_INCIDENTS[0];

  // Compute points from selected incident timeline
  const chartPoints = useMemo(() => {
    const pts = [
      { t: -500, f: 50.005, v: 225.0, label: isFr ? 'Pré-défaut (Nominal)' : 'Pre-fault (Nominal)' }
    ];
    selectedIncident.eventsTimeline.forEach(ev => {
      pts.push({
        t: ev.offsetMs,
        f: ev.telemetrySnapshot.freqHz,
        v: ev.telemetrySnapshot.voltageKv,
        label: ev.sourceIed
      });
    });
    return pts;
  }, [selectedIncident, isFr]);

  const tMax = useMemo(() => {
    const last = selectedIncident.eventsTimeline[selectedIncident.eventsTimeline.length - 1];
    return Math.max(8000, (last?.offsetMs || 8000));
  }, [selectedIncident]);

  const nadirPoint = useMemo(() => {
    if (selectedIncident.id === 'LOAD_REJECTION_ALUCAM_150MW') {
      return chartPoints.reduce((max, p) => p.f > max.f ? p : max, chartPoints[0]);
    }
    return chartPoints.reduce((min, p) => p.f < min.f ? p : min, chartPoints[0]);
  }, [chartPoints, selectedIncident]);

  const calculatedRocof = useMemo(() => {
    const pt1 = chartPoints.find(p => p.t > 0 && p.t <= 500) || chartPoints[1];
    if (!pt1 || pt1.t === 0) return -0.38;
    return (pt1.f - 50.005) / (pt1.t / 1000);
  }, [chartPoints]);

  const finalFreq = chartPoints[chartPoints.length - 1]?.f || 50.0;

  // Coordinate scales for SVG (viewBox 0 0 740 190)
  const mapX = (t: number) => {
    const xMin = 55;
    const xMax = 710;
    return xMin + ((t - (-500)) / (tMax - (-500))) * (xMax - xMin);
  };

  const mapYFreq = (f: number) => {
    const yTop = 20;
    const yBottom = 155;
    const fMin = 48.0;
    const fMax = 50.8;
    const clamped = Math.max(fMin, Math.min(fMax, f));
    return yBottom - ((clamped - fMin) / (fMax - fMin)) * (yBottom - yTop);
  };

  const mapYVolt = (v: number) => {
    const yTop = 20;
    const yBottom = 155;
    const vMin = 40.0;
    const vMax = 250.0;
    const clamped = Math.max(vMin, Math.min(vMax, v));
    return yBottom - ((clamped - vMin) / (vMax - vMin)) * (yBottom - yTop);
  };

  const freqLinePath = useMemo(() => {
    return chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p.t).toFixed(1)} ${mapYFreq(p.f).toFixed(1)}`).join(' ');
  }, [chartPoints, tMax]);

  const freqAreaPath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const line = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p.t).toFixed(1)} ${mapYFreq(p.f).toFixed(1)}`).join(' ');
    const lastX = mapX(chartPoints[chartPoints.length - 1].t).toFixed(1);
    const firstX = mapX(chartPoints[0].t).toFixed(1);
    return `${line} L ${lastX} 155 L ${firstX} 155 Z`;
  }, [chartPoints, tMax]);

  const voltLinePath = useMemo(() => {
    return chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p.t).toFixed(1)} ${mapYVolt(p.v).toFixed(1)}`).join(' ');
  }, [chartPoints, tMax]);

  const voltAreaPath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const line = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p.t).toFixed(1)} ${mapYVolt(p.v).toFixed(1)}`).join(' ');
    const lastX = mapX(chartPoints[chartPoints.length - 1].t).toFixed(1);
    const firstX = mapX(chartPoints[0].t).toFixed(1);
    return `${line} L ${lastX} 155 L ${firstX} 155 Z`;
  }, [chartPoints, tMax]);

  const timeTicks = [0, 1000, 2000, 4000, 6000, 8000].filter(t => t <= tMax);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border border-rose-500/40 bg-[#0A0E17] shadow-2xl overflow-hidden font-sans">
        
        {/* Header Bar */}
        <div className="border-b border-[#252E38] bg-[#0E131F] px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-mono font-black text-white uppercase tracking-tight">
                  {isFr
                    ? 'CENTRE DE CONDUITE RÉSEAU (CCR) — INJECTION D\'INCIDENTS SCADA'
                    : 'NATIONAL DISPATCH CENTER (EMS) — SCADA INCIDENT INJECTION CONSOLE'}
                </h3>
                <EvidenceTrustBadge level="FIELD_PRACTICE" locale={locale} size="xs" />
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {isFr
                  ? 'Protocole CEI 60870-5-104 · Horodatage SOE 1 ms · Défense RIS (SONATREL)'
                  : 'IEC 60870-5-104 Protocol · 1 ms SOE Timestamping · Grid Defense Plan'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeIncident && (
              <button
                type="button"
                onClick={onResetGridNominal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isFr ? 'Réarmer Réseau (50.00 Hz)' : 'Reset Grid (50.00 Hz)'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Telemetry Display Strip */}
        <div className="px-5 py-3 bg-[#0B0F16] border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">FRÉQUENCE :</span>
            <span className={`font-bold text-sm ${
              currentTelemetry.freqHz < 49.3 || currentTelemetry.freqHz > 50.6
                ? 'text-rose-400 animate-pulse'
                : currentTelemetry.freqHz < 49.8 || currentTelemetry.freqHz > 50.2
                ? 'text-amber-400'
                : 'text-sky-400'
            }`}>
              {currentTelemetry.freqHz.toFixed(3)} Hz
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">TENSION HTB :</span>
            <span className={`font-bold text-sm ${
              currentTelemetry.voltageKv < 150 || currentTelemetry.voltageKv > 240
                ? 'text-rose-400 animate-pulse'
                : 'text-sky-400'
            }`}>
              {currentTelemetry.voltageKv.toFixed(2)} kV
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">PUISSANCE P :</span>
            <span className="font-bold text-sm text-slate-100">
              {currentTelemetry.activePowerMw.toFixed(1)} MW
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">RÉACTIF Q :</span>
            <span className="font-bold text-sm text-amber-400">
              +{currentTelemetry.reactivePowerMvar.toFixed(1)} Mvar
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Incident Selector Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-300 uppercase">
                {isFr ? 'Sélectionner un Scénario d\'Incident Réseau :' : 'Select Power System Disturbance Scenario:'}
              </span>
              <span className="text-slate-500">
                {SCADA_GRID_INCIDENTS.length} {isFr ? 'scénarios étalonnés' : 'calibrated scenarios'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SCADA_GRID_INCIDENTS.map((inc) => {
                const isSelected = selectedIncidentId === inc.id;
                const isCurrentlyActive = activeIncident?.id === inc.id;

                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-rose-500/80 bg-rose-950/20 shadow-md'
                        : 'border-slate-800 bg-[#0E131C] hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {inc.severity}
                        </span>

                        {isCurrentlyActive && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-white animate-pulse">
                            {isFr ? 'EN COURS DANS LE SCADA' : 'ACTIVE IN SCADA'}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-mono font-bold text-white">
                        {isFr ? inc.title_fr : inc.title_en}
                      </h4>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {isFr ? inc.initialDisturbance_fr : inc.initialDisturbance_en}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span className="truncate">{inc.substationTag}</span>
                      <span className="text-cyan-400 font-bold">{inc.involvedProtections[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Incident Control & Physics Detail */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h4 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>{isFr ? selectedIncident.title_fr : selectedIncident.title_en}</span>
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  {isFr ? selectedIncident.location_fr : selectedIncident.location_en}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onTriggerIncident(selectedIncident)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-rose-950 shrink-0"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isFr ? 'INJECTER DANS LE RÉSEAU' : 'INJECT PERTURBATION'}</span>
              </button>
            </div>

            {/* Electrotechnical Physics Explanation */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <span className="font-mono font-bold text-amber-400 uppercase">
                {isFr ? 'Comportement Électrotechnique & Réponse Dynamique :' : 'Power System Physics & Dynamic Response:'}
              </span>
              <p className="text-slate-300 leading-relaxed font-sans">
                {isFr ? selectedIncident.physicsExplanation_fr : selectedIncident.physicsExplanation_en}
              </p>
            </div>

            {/* Protections & Standards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  {isFr ? 'RELAIS DE PROTECTION SOLLICITÉS :' : 'PROTECTIVE RELAYS INVOLVED :'}
                </span>
                <div className="space-y-1">
                  {selectedIncident.involvedProtections.map((p, i) => (
                    <div key={i} className="text-cyan-300 font-bold">• {p}</div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  {isFr ? 'ACTION DE RESTAURATION DISPATCHING :' : 'DISPATCHER RESTORATION ACTION :'}
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                  {isFr ? selectedIncident.restorationAction_fr : selectedIncident.restorationAction_en}
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Frequency & Voltage Response Curves (f(t), U(t)) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Activity className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isFr ? 'RÉPONSE DYNAMIQUE TRANSITOIRE DU RÉSEAU · COURBES f(t) & U(t)' : 'POWER SYSTEM DYNAMIC TRANSIENT RESPONSE · f(t) & U(t) CURVES'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {isFr ? 'Inertie mécanique H = 4.2s · Statisme turbine 4% · Étalonnage SONATREL RIS' : 'Mechanical inertia H = 4.2s · Governor droop 4% · SONATREL Calibrated'}
                  </p>
                </div>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => setCurveMetric('frequency')}
                  className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                    curveMetric === 'frequency'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isFr ? 'Fréquence f(t)' : 'Frequency f(t)'}
                </button>
                <button
                  type="button"
                  onClick={() => setCurveMetric('voltage')}
                  className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                    curveMetric === 'voltage'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isFr ? 'Tension U(t)' : 'Voltage U(t)'}
                </button>
                <button
                  type="button"
                  onClick={() => setCurveMetric('dual')}
                  className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                    curveMetric === 'dual'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isFr ? 'Bi-Courbe Synchrone' : 'Synchronous Dual'}
                </button>
              </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[9px] block uppercase">FRÉQUENCE PRE-DÉFAUT</span>
                <span className="text-emerald-400 font-bold">50.005 Hz</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[9px] block uppercase">NADIR / CRÊTE TRANSITOIRE</span>
                <span className={`font-bold ${nadirPoint.f < 49.3 ? 'text-rose-400' : nadirPoint.f > 50.3 ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {nadirPoint.f.toFixed(3)} Hz ({nadirPoint.t} ms)
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[9px] block uppercase">RoCoF INITIAL (df/dt)</span>
                <span className={`font-bold ${Math.abs(calculatedRocof) > 0.3 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {calculatedRocof.toFixed(2)} Hz/s
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[9px] block uppercase">RÉGIME POST-STABILISÉ</span>
                <span className="text-emerald-400 font-bold">{finalFreq.toFixed(3)} Hz</span>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="relative rounded-xl border border-slate-800 bg-[#070A10] p-3 overflow-hidden">
              <svg viewBox="0 0 740 190" className="w-full h-auto text-xs font-mono select-none">
                <defs>
                  <linearGradient id="freqGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="voltGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal references for frequency */}
                {curveMetric !== 'voltage' && (
                  <>
                    {/* 50.00 Hz */}
                    <line x1="55" y1={mapYFreq(50.0)} x2="710" y2={mapYFreq(50.0)} stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
                    <text x="50" y={mapYFreq(50.0) + 3} fill="#10b981" fontSize="9" textAnchor="end">50.00 Hz</text>

                    {/* 49.00 Hz (UFLS 1) */}
                    <line x1="55" y1={mapYFreq(49.0)} x2="710" y2={mapYFreq(49.0)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
                    <text x="50" y={mapYFreq(49.0) + 3} fill="#f59e0b" fontSize="8" textAnchor="end">49.00 Hz (UFLS 1)</text>

                    {/* 48.80 Hz (UFLS 2) */}
                    <line x1="55" y1={mapYFreq(48.8)} x2="710" y2={mapYFreq(48.8)} stroke="#f43f5e" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                    <text x="50" y={mapYFreq(48.8) + 3} fill="#f43f5e" fontSize="8" textAnchor="end">48.80 Hz (UFLS 2)</text>
                  </>
                )}

                {/* Grid horizontal references for voltage */}
                {curveMetric === 'voltage' && (
                  <>
                    <line x1="55" y1={mapYVolt(225.0)} x2="710" y2={mapYVolt(225.0)} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
                    <text x="50" y={mapYVolt(225.0) + 3} fill="#38bdf8" fontSize="9" textAnchor="end">225 kV</text>

                    <line x1="55" y1={mapYVolt(180.0)} x2="710" y2={mapYVolt(180.0)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
                    <text x="50" y={mapYVolt(180.0) + 3} fill="#f59e0b" fontSize="8" textAnchor="end">180 kV (0.8 Un)</text>

                    <line x1="55" y1={mapYVolt(100.0)} x2="710" y2={mapYVolt(100.0)} stroke="#f43f5e" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                    <text x="50" y={mapYVolt(100.0) + 3} fill="#f43f5e" fontSize="8" textAnchor="end">100 kV</text>
                  </>
                )}

                {/* Vertical fault inception line t = 0 */}
                <line x1={mapX(0)} y1="15" x2={mapX(0)} y2="155" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,2" />
                <text x={mapX(0) + 4} y="22" fill="#f43f5e" fontSize="8" fontWeight="bold">t = 0 ms (Défaut)</text>

                {/* Time markers on X-axis */}
                {timeTicks.map((t, idx) => (
                  <g key={idx}>
                    <line x1={mapX(t)} y1="153" x2={mapX(t)} y2="159" stroke="#475569" strokeWidth="1" />
                    <text x={mapX(t)} y="172" fill="#64748b" fontSize="8" textAnchor="middle">
                      {t >= 1000 ? `${(t / 1000).toFixed(1)}s` : `${t}ms`}
                    </text>
                  </g>
                ))}

                {/* Plot Paths */}
                {/* Frequency curve */}
                {(curveMetric === 'frequency' || curveMetric === 'dual') && (
                  <>
                    <path d={freqAreaPath} fill="url(#freqGlow)" />
                    <path d={freqLinePath} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                )}

                {/* Voltage curve */}
                {(curveMetric === 'voltage' || curveMetric === 'dual') && (
                  <>
                    <path d={voltAreaPath} fill="url(#voltGlow)" />
                    <path d={voltLinePath} fill="none" stroke="#f59e0b" strokeWidth={curveMetric === 'dual' ? '1.8' : '2.5'} strokeDasharray={curveMetric === 'dual' ? '4,2' : undefined} strokeLinecap="round" strokeLinejoin="round" />
                  </>
                )}

                {/* Event Markers & Hotspots */}
                {chartPoints.map((pt, idx) => {
                  const x = mapX(pt.t);
                  const y = curveMetric === 'voltage' ? mapYVolt(pt.v) : mapYFreq(pt.f);
                  const isHovered = hoveredPointIndex === idx;
                  const isNadir = pt.f === nadirPoint.f && pt.t === nadirPoint.t;

                  return (
                    <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredPointIndex(idx)} onMouseLeave={() => setHoveredPointIndex(null)}>
                      {isNadir && (
                        <circle cx={x} cy={y} r="8" fill="none" stroke="#f43f5e" strokeWidth="1.5" className="animate-ping" />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 6 : isNadir ? 5 : 3.5}
                        fill={isNadir ? '#f43f5e' : isHovered ? '#ffffff' : curveMetric === 'voltage' ? '#f59e0b' : '#38bdf8'}
                        stroke="#0f172a"
                        strokeWidth="1.5"
                      />
                      {isHovered && (
                        <g>
                          <rect x={Math.min(Math.max(x - 65, 10), 590)} y={Math.max(y - 42, 5)} width="140" height="34" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                          <text x={Math.min(Math.max(x - 60, 15), 595)} y={Math.max(y - 28, 19)} fill="#ffffff" fontSize="9" fontWeight="bold">
                            +{pt.t}ms · {pt.f.toFixed(3)}Hz
                          </text>
                          <text x={Math.min(Math.max(x - 60, 15), 595)} y={Math.max(y - 15, 32)} fill="#94a3b8" fontSize="8">
                            U = {pt.v.toFixed(1)}kV · {pt.label}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Sequence of Events (SOE) Stream View */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{isFr ? 'JOURNAL DES ÉVÉNEMENTS CHRONORATÉS (SOE CEI 60870-5-104)' : 'SEQUENCE OF EVENTS (SOE) MILLISECOND LOG'}</span>
              </h4>
              <span className="text-[10px] text-slate-400">
                {activeSoeLogs.length > 0 ? `${activeSoeLogs.length} événements actifs` : 'Prêt pour enregistrement'}
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-2 max-h-60 overflow-y-auto text-xs">
              {(activeSoeLogs.length > 0 ? activeSoeLogs : selectedIncident.eventsTimeline).map((log, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    log.alarmState === 'TRIP'
                      ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                      : log.alarmState === 'ALARM'
                      ? 'bg-amber-950/20 border-amber-800/60 text-amber-200'
                      : log.alarmState === 'RESTORED'
                      ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-slate-400 font-mono shrink-0">
                      +{log.offsetMs} ms
                    </span>
                    <span className="font-bold text-cyan-300 text-[11px] shrink-0">
                      [{log.sourceIed}]
                    </span>
                    <span className="text-xs">
                      {isFr ? log.message_fr : log.message_en}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] shrink-0 font-bold">
                    <span className="text-slate-400">{log.telemetrySnapshot.freqHz.toFixed(2)} Hz</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">{log.telemetrySnapshot.voltageKv.toFixed(1)} kV</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="border-t border-[#252E38] bg-[#0D131F] px-5 py-3.5 flex items-center justify-between text-xs font-mono shrink-0">
          <span className="text-slate-400">
            {isFr ? 'Modélisation dynamique conforme aux critères N-1 SONATREL.' : 'Dynamic grid simulation conforming to SONATREL N-1 criteria.'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            {isFr ? 'Fermer' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
