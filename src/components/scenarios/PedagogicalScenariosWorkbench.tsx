// src/components/scenarios/PedagogicalScenariosWorkbench.tsx
// EPEDE - Pedagogical Scenarios with 8-Phase Timeline & SCADA Incident Replay Player
// Implements Priority #4 & Priority #5 of EPEDE Advanced Architecture

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Activity,
  ShieldAlert,
  Zap,
  Clock,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Info,
  Layers,
  ChevronDown
} from 'lucide-react';
import {
  PEDAGOGICAL_SCENARIOS,
  type PedagogicalScenario,
  type ScenarioPhase,
  type ScenarioPhaseType
} from '../../data/pedagogicalScenariosData';
import type { AppViewType } from '../../services/routerService';

interface Props {
  locale: 'fr' | 'en';
  onNavigate: (view: AppViewType, context?: Record<string, string>) => void;
  initialScenarioId?: string;
}

export const PedagogicalScenariosWorkbench: React.FC<Props> = ({
  locale,
  onNavigate,
  initialScenarioId
}) => {
  const isFr = locale === 'fr';

  // Selected scenario
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    initialScenarioId || PEDAGOGICAL_SCENARIOS[0].id
  );

  const scenario = useMemo(() => {
    return PEDAGOGICAL_SCENARIOS.find((s) => s.id === selectedScenarioId) || PEDAGOGICAL_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Current time in ms
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.1, 0.5, 1.0, 2.0, 5.0
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Active Phase calculation based on currentTimeMs
  const activePhaseIndex = useMemo(() => {
    let activeIdx = 0;
    for (let i = 0; i < scenario.phases.length; i++) {
      if (currentTimeMs >= scenario.phases[i].timeMs) {
        activeIdx = i;
      }
    }
    return activeIdx;
  }, [scenario, currentTimeMs]);

  const activePhase = scenario.phases[activePhaseIndex] || scenario.phases[0];

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const tickIntervalMs = 25; // 40 updates per second
    const advancePerTick = (tickIntervalMs * playbackSpeed * 1.5);

    const interval = setInterval(() => {
      setCurrentTimeMs((prev) => {
        const next = prev + advancePerTick;
        if (next >= scenario.totalDurationMs) {
          if (isLooping) return 0;
          setIsPlaying(false);
          return scenario.totalDurationMs;
        }
        return next;
      });
    }, tickIntervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, isLooping, scenario.totalDurationMs]);

  // Reset time when scenario changes
  useEffect(() => {
    setCurrentTimeMs(0);
    setIsPlaying(false);
  }, [selectedScenarioId]);

  // Handlers
  const handleJumpToPhase = (phaseTimeMs: number) => {
    setCurrentTimeMs(phaseTimeMs);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTimeMs(Number(e.target.value));
  };

  const stepForward = (ms: number = 20) => {
    setCurrentTimeMs((prev) => Math.min(prev + ms, scenario.totalDurationMs));
  };

  const stepBackward = (ms: number = 20) => {
    setCurrentTimeMs((prev) => Math.max(prev - ms, 0));
  };

  // Alarms that have occurred up to currentTimeMs
  const triggeredAlarms = useMemo(() => {
    const list: ScenarioPhase['activeAlarms'][0][] = [];
    for (const ph of scenario.phases) {
      if (ph.timeMs <= currentTimeMs) {
        for (const al of ph.activeAlarms) {
          if (al.timestampMs <= currentTimeMs) {
            list.push(al);
          }
        }
      }
    }
    return list;
  }, [scenario, currentTimeMs]);

  // Waveform calculation points for real-time SVG Oscilloscope
  const waveformPoints = useMemo(() => {
    const pointsV: string[] = [];
    const pointsI: string[] = [];
    const width = 600;
    const height = 140;
    const midY = height / 2;

    const totalT = scenario.totalDurationMs;
    const numSamples = 120;

    for (let i = 0; i < numSamples; i++) {
      const t = (i / numSamples) * totalT;
      const x = (i / numSamples) * width;

      // Find phase for this sample
      let samplePhase = scenario.phases[0];
      for (const ph of scenario.phases) {
        if (t >= ph.timeMs) samplePhase = ph;
      }

      // Base 50 Hz sine
      const omega = 2 * Math.PI * 0.025; // scaled visual frequency
      const sinWave = Math.sin(omega * t);

      // Voltage waveform
      const vAmp = samplePhase.voltageFactor * (height * 0.38);
      const yV = midY - sinWave * vAmp;
      pointsV.push(`${x.toFixed(1)},${yV.toFixed(1)}`);

      // Current waveform (with DC decay during fault)
      let dcOffset = 0;
      if (samplePhase.phaseType === 'TRANSIENT_FAULT' || samplePhase.phaseType === 'INITIATING_EVENT') {
        dcOffset = Math.exp(-(t - samplePhase.timeMs) / 80) * (height * 0.3);
      }
      const iAmp = Math.min(samplePhase.currentFactor, 4.0) * (height * 0.12);
      const yI = midY - (sinWave * iAmp + dcOffset);
      pointsI.push(`${x.toFixed(1)},${yI.toFixed(1)}`);
    }

    return {
      pathV: `M ${pointsV.join(' L ')}`,
      pathI: `M ${pointsI.join(' L ')}`,
      cursorX: (currentTimeMs / totalT) * width
    };
  }, [scenario, currentTimeMs]);

  return (
    <div className="space-y-6 text-slate-100 font-sans pb-16">
      {/* ── TOP HERO HEADER & SCADA BADGE ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-[#0B1528] to-[#040814] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span>{isFr ? 'Scénarios Physiques & SOE Player' : 'Physical Scenarios & SOE Player'}</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-300 font-bold">Priority #4 & #5</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>{isFr ? 'Incident Replay SCADA' : 'SCADA Incident Replay'}</span>
              <span className="text-slate-400 text-xl font-normal">—</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-400 to-cyan-400 text-xl sm:text-2xl font-bold">
                {isFr ? 'Timeline 8 Phases au Milliseconde' : '8-Phase Millisecond Timeline'}
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {isFr
                ? 'Rejouez au milliseconde près les 10 incidents physiques majeurs du réseau électrique. Observez l’effondrement transitoire, les oscillogrammes synchronisés, le comportement des relais de protection ANSI et l’extinction d’arc dans les disjoncteurs.'
                : 'Replay the 10 greatest grid physical disturbance scenarios with millisecond fidelity. Analyze synchronized waveforms, ANSI protection timings, breaker arc quenching, and real SCADA sequence-of-events logs.'}
            </p>
          </div>

          {/* Quick Scenario Code & Standard Badge */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 shrink-0">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono font-bold text-cyan-300">
              {scenario.code} · {scenario.primaryStandard}
            </div>
            <div className="text-xs font-mono text-slate-400">
              {isFr ? 'Durée totale :' : 'Total duration:'}{' '}
              <span className="text-white font-bold">{scenario.totalDurationMs} ms</span>
            </div>
          </div>
        </div>

        {/* ── 10 SCENARIO QUICK SELECTOR PILLS ── */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isFr ? 'Sélectionner un Scénario d’Incident :' : 'Select Disturbance Scenario:'}</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {PEDAGOGICAL_SCENARIOS.map((sc) => {
              const isSelected = sc.id === selectedScenarioId;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-900 border-white/10'
                  }`}
                >
                  <span className="opacity-70 mr-1.5">{sc.code}</span>
                  <span>{isFr ? sc.titleFr.replace(/^\d+\.\s*/, '') : sc.titleEn.replace(/^\d+\.\s*/, '')}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SCADA SOE REPLAY TIMELINE PLAYER (Priority #5) ── */}
      <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Top Player Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          {/* Left: Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentTimeMs(0)}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isFr ? 'Remise à zéro (0 ms)' : 'Rewind to 0 ms'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => stepBackward(20)}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isFr ? 'Recul de 20 ms' : 'Step back 20 ms'}
            >
              <Rewind className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/30'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? (isFr ? 'Pause' : 'Pause') : (isFr ? 'Rejouer Incident' : 'Replay Incident')}</span>
            </button>

            <button
              type="button"
              onClick={() => stepForward(20)}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isFr ? 'Avance de 20 ms' : 'Step forward 20 ms'}
            >
              <FastForward className="w-4 h-4" />
            </button>

            {/* Speed Multiplier */}
            <div className="flex items-center gap-1 ml-2 bg-slate-900/80 p-1 rounded-xl border border-white/10">
              {[0.1, 0.5, 1.0, 2.0, 5.0].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Right: Digital LED Timestamp & Phase Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 font-mono text-cyan-300 text-sm font-black shadow-inner">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>t = {currentTimeMs.toFixed(1).padStart(6, '0')} ms</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{isFr ? activePhase.labelFr : activePhase.labelEn}</span>
            </div>
          </div>
        </div>

        {/* ── TIME SEEKER SLIDER ── */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={scenario.totalDurationMs}
            step={1}
            value={currentTimeMs}
            onChange={handleSeek}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0.0 ms</span>
            <span>{(scenario.totalDurationMs / 2).toFixed(0)} ms</span>
            <span>{scenario.totalDurationMs.toFixed(0)} ms</span>
          </div>
        </div>

        {/* ── 8-PHASE INTERACTIVE RAIL (Priority #4) ── */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{isFr ? 'Chronologie Séquentielle des 8 Phases :' : '8-Phase Chronological Timeline:'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {scenario.phases.map((ph, idx) => {
              const isCurrent = idx === activePhaseIndex;
              const isPast = currentTimeMs >= ph.timeMs;

              return (
                <button
                  key={ph.id}
                  type="button"
                  onClick={() => handleJumpToPhase(ph.timeMs)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-102'
                      : isPast
                      ? 'bg-slate-900/90 border-white/20 text-slate-300 hover:border-white/40'
                      : 'bg-slate-950/40 border-white/5 text-slate-500 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-black text-amber-400">
                      {ph.timeMs} ms
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isCurrent
                          ? 'bg-cyan-400 animate-ping'
                          : isPast
                          ? 'bg-emerald-400'
                          : 'bg-slate-700'
                      }`}
                    />
                  </div>
                  <div className="text-[11px] font-bold line-clamp-1">
                    {isFr ? ph.labelFr : ph.labelEn}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── SYNCHRONIZED WAVEFORM OSCILLOGRAM & SCADA MIMIC (Priority #5) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-white/10">
          {/* Oscilloscope Dual-Trace Canvas (Left 2 cols) */}
          <div className="lg:col-span-2 rounded-2xl bg-[#030712] border border-cyan-500/30 p-4 space-y-3 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  {isFr ? 'Oscillogramme COMTRADE en Temps Réel' : 'Live COMTRADE Disturbance Scope'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
                  <span>{isFr ? 'Tension U(t)' : 'Voltage U(t)'}</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span className="w-2.5 h-0.5 bg-amber-400 inline-block" />
                  <span>{isFr ? 'Courant I(t)' : 'Current I(t)'}</span>
                </span>
              </div>
            </div>

            {/* SVG Plot */}
            <div className="relative w-full h-[140px] bg-slate-950/80 rounded-xl border border-white/5 overflow-hidden">
              {/* Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:30px_20px]" />
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10" />

              <svg className="w-full h-full" viewBox="0 0 600 140" preserveAspectRatio="none">
                {/* Voltage Waveform */}
                <path
                  d={waveformPoints.pathV}
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Current Waveform */}
                <path
                  d={waveformPoints.pathI}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Vertical Playback Cursor */}
                <line
                  x1={waveformPoints.cursorX}
                  y1="0"
                  x2={waveformPoints.cursorX}
                  y2="140"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>

            {/* Waveform Telemetry Values at cursor */}
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 text-[10px]">U_INST</span>
                <div className="text-cyan-300 font-bold">
                  {(activePhase.voltageFactor * 100).toFixed(0)}% Unom
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 text-[10px]">I_INST</span>
                <div className="text-amber-300 font-bold">
                  {(activePhase.currentFactor).toFixed(1)} x Inom
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 text-[10px]">FREQ</span>
                <div className="text-white font-bold">{activePhase.frequencyHz.toFixed(2)} Hz</div>
              </div>
            </div>
          </div>

          {/* Animated Substation Mimic / Circuit Breaker State (Right col) */}
          <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-4 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {isFr ? 'État Organe de Coupure' : 'Switchgear Mimic Status'}
                </span>
                <span
                  className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border ${
                    activePhase.breakerState === 'CLOSED'
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : activePhase.breakerState === 'TRIPPED' || activePhase.breakerState === 'OPENING'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {activePhase.breakerState}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {isFr ? 'Disjoncteur SF6 / Vide de ligne' : 'Line SF6 / Vacuum Circuit Breaker'}
              </div>
            </div>

            {/* Graphic Representation of Breaker Contacts */}
            <div className="h-32 rounded-xl bg-slate-950 border border-white/5 flex flex-col items-center justify-center relative p-3">
              {/* Busbar top */}
              <div className="w-24 h-1 bg-amber-400 rounded-full" />
              <div className="w-0.5 h-6 bg-amber-400" />

              {/* Breaker Contact Box */}
              <div
                className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  activePhase.breakerState === 'CLOSED'
                    ? 'bg-red-500/20 border-red-500 text-red-400 shadow-lg shadow-red-500/30'
                    : activePhase.breakerState === 'TRIPPED' || activePhase.breakerState === 'OPENING'
                    ? 'bg-amber-500/30 border-amber-400 text-amber-300 animate-bounce'
                    : 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                }`}
              >
                <Zap className="w-6 h-6" />
                <span className="text-[9px] font-mono font-bold mt-0.5">
                  {activePhase.breakerState === 'CLOSED' ? 'FERMÉ' : 'OUVERT'}
                </span>
              </div>

              {/* Busbar bottom */}
              <div className="w-0.5 h-6 bg-cyan-400" />
              <div className="w-24 h-1 bg-cyan-400 rounded-full" />
            </div>

            <div className="text-center font-mono text-[11px] text-slate-400">
              {isFr ? 'ANSI 52 · Déclenchement bobines doubles' : 'ANSI 52 · Dual shunt trip coils'}
            </div>
          </div>
        </div>

        {/* ── SYNCHRONIZED SEQUENCE OF EVENTS (SOE) SCADA ALARM LOG ── */}
        <div className="rounded-2xl bg-slate-950 border border-white/10 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400" />
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                {isFr ? 'Journal d’Événements SOE Téléconduite (Horodatage ms)' : 'SCADA SOE Event Log (Millisecond Accurate)'}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {triggeredAlarms.length} {isFr ? 'événements déclenchés' : 'events triggered'}
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto rounded-xl border border-white/5 divide-y divide-white/5 font-mono text-xs">
            {triggeredAlarms.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-[11px]">
                {isFr ? 'Aucun événement pour t = 0 ms' : 'No event triggered at t = 0 ms'}
              </div>
            ) : (
              triggeredAlarms.map((al, aIdx) => (
                <div key={aIdx} className="p-2.5 flex items-center justify-between hover:bg-white/5 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-bold shrink-0">
                      +{al.timestampMs.toFixed(1).padStart(6, '0')} ms
                    </span>
                    <span className="text-slate-400 shrink-0 text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-white/5">
                      {al.source}
                    </span>
                    <span className="text-white font-medium">
                      {isFr ? al.messageFr : al.messageEn}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      al.severity === 'TRIP'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : al.severity === 'CRITICAL'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : al.severity === 'WARNING'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {al.severity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── ENGINEERING DOSSIER & CAMEROON CONTEXT ── */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0B1528] to-slate-950 border border-white/10 p-6 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
              <Info className="w-4 h-4" />
              <span>{isFr ? 'Explication Physique de la Phase Active :' : 'Active Phase Physics Breakdown:'}</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {isFr ? activePhase.physicsDescriptionFr : activePhase.physicsDescriptionEn}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10 text-xs font-mono">
            {/* Ancrage Cameroun */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[10px]">
                <Compass className="w-3.5 h-3.5" />
                <span>{isFr ? 'Ancrage Réseau Cameroun (RIS/RIN)' : 'Cameroon Grid Asset Anchor'}</span>
              </div>
              <p className="text-slate-300 font-sans text-[11px] leading-snug">
                {isFr ? scenario.cameroonContextFr : scenario.cameroonContextEn}
              </p>
            </div>

            {/* Protections ANSI impliquées */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-purple-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold uppercase text-[10px]">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{isFr ? 'Fonctions de Protection ANSI / CEI' : 'ANSI / IEC Protection Functions'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {scenario.governingAnsiCodes.map((code, cIdx) => (
                  <span
                    key={cIdx}
                    className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px]"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Gateways */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {scenario.linkedSimulatorTab && (
                <button
                  type="button"
                  onClick={() => onNavigate('simulation', { simulationTab: scenario.linkedSimulatorTab })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Ouvrir dans le Simulateur' : 'Open in Simulation Lab'}</span>
                </button>
              )}

              {scenario.linkedEquipmentId && (
                <button
                  type="button"
                  onClick={() => onNavigate('equipment-reference')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold font-mono transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Fiche Matériel Équipement' : 'Equipment Datasheet'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onNavigate('cameroon-grid')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold font-mono transition-all cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{isFr ? 'Voir sur le Réseau Cameroun' : 'View on Cameroon Grid'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
