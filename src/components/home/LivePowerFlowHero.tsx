// src/components/home/LivePowerFlowHero.tsx
// EPEDE — Immersive Animated Hero with Live Power Flow, SCADA Gauges & Platform Navigator
// Animated SVG energy flow particles + real-time SCADA data + feature capsules + domain grid

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Activity, Calculator, BookOpen, Cpu, Search,
  ChevronRight, ArrowRight, Shield, Layers, Radio,
  FlaskConical, Globe, Wrench, BarChart3, Sparkles,
  Terminal, Play, Pause, RefreshCw
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────────────────────────────────────

interface LivePowerFlowHeroProps {
  locale: 'fr' | 'en';
  onOpenSearch: (query?: string) => void;
  onNavigateView: (view: string) => void;
  onSelectDomain: (code: string) => void;
  onNavigateJourney?: () => void;
}

interface ScadaTelemetry {
  freq: number;
  voltage: number;
  power: number;
  reactive: number;
  load: number;
}

interface FlowParticle {
  id: number;
  progress: number; // 0→1 along the path
  speed: number;
  size: number;
  opacity: number;
  segmentIdx: number;
}

// SVG path segments: Generation → StepUp → Transmission → Substation → Distribution → Load
const FLOW_PATH_SEGMENTS = [
  { x1: 60,  y1: 80, x2: 155, y2: 80,  label: 'Gen→GSU',     color: '#D7A64A' },
  { x1: 175, y1: 80, x2: 290, y2: 80,  label: 'GSU→Line',    color: '#E07A5F' },
  { x1: 290, y1: 80, x2: 390, y2: 80,  label: 'HV Trans',    color: '#7C6FCD' },
  { x1: 390, y1: 80, x2: 490, y2: 80,  label: 'Sub→MV',      color: '#3A8FC7' },
  { x1: 490, y1: 80, x2: 580, y2: 80,  label: 'MV→LV',       color: '#52C784' },
  { x1: 580, y1: 80, x2: 660, y2: 80,  label: 'LV→Load',     color: '#EC4899' },
];

const CHAIN_NODES = [
  { id: 'gen',   x: 60,  label: { fr: 'Production', en: 'Generation' },   icon: '⚡', color: '#D7A64A', view: 'domain:D01' },
  { id: 'gsu',   x: 165, label: { fr: 'Élévation GSU', en: 'GSU Step-Up' }, icon: '🔺', color: '#E07A5F', view: 'domain:D04' },
  { id: 'hv',    x: 290, label: { fr: 'Transport HTB', en: 'HV Trans.' },  icon: '🗼', color: '#7C6FCD', view: 'domain:D03' },
  { id: 'sub',   x: 390, label: { fr: 'Poste THT',   en: 'HV Sub.' },     icon: '🏗', color: '#3A8FC7', view: 'domain:D04' },
  { id: 'mv',    x: 490, label: { fr: 'Distribution HTA', en: 'MV Dist.'}, icon: '🏙', color: '#52C784', view: 'domain:D05' },
  { id: 'lv',    x: 580, label: { fr: 'BT & Charges', en: 'LV & Loads' }, icon: '💡', color: '#EC4899', view: 'domain:D06' },
];

const PLATFORM_FEATURES = [
  {
    id: 'reference',
    icon: BookOpen,
    color: '#D7A64A',
    bg: 'rgba(215,166,74,0.12)',
    border: 'rgba(215,166,74,0.35)',
    label: { fr: 'Référentiel Matériel', en: 'Equipment Reference' },
    desc: { fr: '57 équipements · 10 onglets techniques · AMDEC', en: '57 equipment · 10 technical tabs · FMEA' },
    view: 'equipment-reference',
    badge: '57 EQ',
  },
  {
    id: 'calculators',
    icon: Calculator,
    color: '#3A8FC7',
    bg: 'rgba(58,143,199,0.12)',
    border: 'rgba(58,143,199,0.35)',
    label: { fr: 'Calculateurs CEI/IEEE', en: 'IEC/IEEE Calculators' },
    desc: { fr: '17 calculateurs · Chute de tension · Court-circuit', en: '17 calculators · Voltage drop · Short-circuit' },
    view: 'calculators',
    badge: '17 CALC',
  },
  {
    id: 'simulation',
    icon: FlaskConical,
    color: '#52C784',
    bg: 'rgba(82,199,132,0.12)',
    border: 'rgba(82,199,132,0.35)',
    label: { fr: 'Laboratoire de Simulation', en: 'Simulation Lab' },
    desc: { fr: '16 onglets · Protection · BESS · Distance · TCC', en: '16 tabs · Protection · BESS · Distance · TCC' },
    view: 'simulation',
    badge: '16 LABS',
  },
  {
    id: 'domains',
    icon: Layers,
    color: '#7C6FCD',
    bg: 'rgba(124,111,205,0.12)',
    border: 'rgba(124,111,205,0.35)',
    label: { fr: 'Domaines Ingénierie', en: 'Engineering Domains' },
    desc: { fr: '16 domaines · Hydro · SCADA · Smart Grid · ELV', en: '16 domains · Hydro · SCADA · Smart Grid · ELV' },
    view: 'domains',
    badge: '16 DOM',
  },
  {
    id: 'standards',
    icon: Shield,
    color: '#EC4899',
    bg: 'rgba(236,72,153,0.12)',
    border: 'rgba(236,72,153,0.35)',
    label: { fr: 'Référentiel Normatif', en: 'Standards Library' },
    desc: { fr: 'CEI 60909 · CEI 61850 · IEEE 1584 · CEI 60076', en: 'IEC 60909 · IEC 61850 · IEEE 1584 · IEC 60076' },
    view: 'standards',
    badge: 'IEC/IEEE',
  },
  {
    id: 'journey',
    icon: Globe,
    color: '#F97316',
    bg: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.35)',
    label: { fr: 'Parcours Pédagogique', en: 'Learning Journey' },
    desc: { fr: 'Du lac au prise · Toute la chaîne électrique', en: 'From dam to plug · Full electrical chain' },
    view: 'journey',
    badge: 'EXPLORE',
  },
];

const QUICK_SEARCHES = [
  { fr: 'Transformateur GSU', en: 'GSU Transformer', q: 'GSU' },
  { fr: 'Protection 87T', en: '87T Differential', q: '87T' },
  { fr: 'TGBT 400V', en: '400V Switchboard', q: 'TGBT' },
  { fr: 'CEI 60909', en: 'IEC 60909', q: 'IEC 60909' },
  { fr: 'Disjoncteur SF6', en: 'SF6 Breaker', q: 'SF6' },
  { fr: 'BESS & Stockage', en: 'BESS Storage', q: 'BESS' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Live SCADA telemetry simulation hook
// ─────────────────────────────────────────────────────────────────────────────
function useLiveTelemetry(): ScadaTelemetry {
  const [telemetry, setTelemetry] = useState<ScadaTelemetry>({
    freq: 50.031, voltage: 225.29, power: 1481.5, reactive: 312.8, load: 74.2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        freq:     +(50 + (Math.random() - 0.5) * 0.06).toFixed(3),
        voltage:  +(225 + (Math.random() - 0.5) * 2.5).toFixed(2),
        power:    +(prev.power + (Math.random() - 0.5) * 8).toFixed(1),
        reactive: +(prev.reactive + (Math.random() - 0.5) * 4).toFixed(1),
        load:     +(prev.load + (Math.random() - 0.5) * 0.8).toFixed(1),
      }));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return telemetry;
}

// ─────────────────────────────────────────────────────────────────────────────
// Power Flow SVG Component
// ─────────────────────────────────────────────────────────────────────────────
const PowerFlowSvg: React.FC<{ playing: boolean; onNodeClick: (view: string) => void; locale: 'fr' | 'en' }> = ({
  playing, onNodeClick, locale
}) => {
  const [particles, setParticles] = useState<FlowParticle[]>([]);
  const nextId = useRef(0);
  const rafRef = useRef<number>(0);
  const lastSpawn = useRef(0);

  const spawnParticle = useCallback(() => {
    const segIdx = Math.floor(Math.random() * FLOW_PATH_SEGMENTS.length);
    setParticles(prev => [
      ...prev.slice(-40),
      {
        id: nextId.current++,
        progress: 0,
        speed: 0.005 + Math.random() * 0.006,
        size: 2.5 + Math.random() * 2,
        opacity: 0.7 + Math.random() * 0.3,
        segmentIdx: segIdx,
      },
    ]);
  }, []);

  useEffect(() => {
    if (!playing) return;

    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 16.67;
      last = now;

      setParticles(prev =>
        prev
          .map(p => ({ ...p, progress: p.progress + p.speed * dt }))
          .filter(p => p.progress < 1)
      );

      if (now - lastSpawn.current > 80) {
        spawnParticle();
        lastSpawn.current = now;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, spawnParticle]);

  const getParticlePos = (p: FlowParticle) => {
    const seg = FLOW_PATH_SEGMENTS[p.segmentIdx];
    return {
      cx: seg.x1 + (seg.x2 - seg.x1) * p.progress,
      cy: seg.y1 + (seg.y2 - seg.y1) * p.progress,
      color: seg.color,
    };
  };

  return (
    <svg
      viewBox="0 0 720 160"
      className="w-full"
      style={{ height: 160 }}
      aria-label="Live electrical power flow animation"
    >
      {/* Grid lines background */}
      {[40, 80, 120].map(y => (
        <line key={y} x1="0" y1={y} x2="720" y2={y} stroke="#1e293b" strokeWidth="0.5" />
      ))}
      {[60, 165, 230, 340, 440, 535, 620, 680].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="#1e293b" strokeWidth="0.5" />
      ))}

      {/* Transmission Lines */}
      {FLOW_PATH_SEGMENTS.map((seg, i) => (
        <g key={i}>
          {/* Shadow / glow line */}
          <line
            x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
            stroke={seg.color} strokeWidth="6" strokeOpacity="0.08"
          />
          {/* Main conductor */}
          <line
            x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
            stroke={seg.color} strokeWidth="1.5" strokeOpacity="0.4"
            strokeDasharray="4 3"
          />
        </g>
      ))}

      {/* Particles */}
      {particles.map(p => {
        const pos = getParticlePos(p);
        return (
          <g key={p.id}>
            <circle cx={pos.cx} cy={pos.cy} r={p.size * 2} fill={pos.color} fillOpacity={0.1} />
            <circle cx={pos.cx} cy={pos.cy} r={p.size} fill={pos.color} fillOpacity={p.opacity} />
          </g>
        );
      })}

      {/* Chain nodes */}
      {CHAIN_NODES.map((node) => (
        <g
          key={node.id}
          className="cursor-pointer"
          onClick={() => onNodeClick(node.view)}
          role="button"
          aria-label={locale === 'fr' ? node.label.fr : node.label.en}
        >
          {/* Glow ring */}
          <circle cx={node.x} cy={80} r={18} fill={node.color} fillOpacity="0.12" />
          {/* Node circle */}
          <circle
            cx={node.x} cy={80} r={13}
            fill="#0f172a" stroke={node.color} strokeWidth="2"
            className="hover:fill-slate-800 transition-all"
          />
          {/* Icon text */}
          <text x={node.x} y={84} textAnchor="middle" fontSize="11" dominantBaseline="middle">
            {node.icon}
          </text>
          {/* Label */}
          <text
            x={node.x} y={108} textAnchor="middle"
            fontSize="7.5" fill={node.color} fontWeight="700"
            fontFamily="monospace"
          >
            {locale === 'fr' ? node.label.fr : node.label.en}
          </text>
        </g>
      ))}

      {/* Voltage labels on segments */}
      {[
        { x: 107, label: '10.5 kV', color: '#D7A64A' },
        { x: 232, label: '225 kV', color: '#E07A5F' },
        { x: 340, label: '225 kV', color: '#7C6FCD' },
        { x: 440, label: '30 kV',  color: '#3A8FC7' },
        { x: 534, label: '400 V',  color: '#52C784' },
      ].map((v, i) => (
        <text key={i} x={v.x} y={62} textAnchor="middle" fontSize="7" fill={v.color} fontWeight="600" fontFamily="monospace" fillOpacity="0.9">
          {v.label}
        </text>
      ))}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Hero Component
// ─────────────────────────────────────────────────────────────────────────────
export const LivePowerFlowHero: React.FC<LivePowerFlowHeroProps> = ({
  locale, onOpenSearch, onNavigateView, onSelectDomain, onNavigateJourney,
}) => {
  const [playing, setPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const telemetry = useLiveTelemetry();

  const handleNodeClick = (view: string) => {
    if (view.startsWith('domain:')) {
      onSelectDomain(view.split(':')[1]);
    } else {
      onNavigateView(view);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenSearch(searchQuery.trim());
  };

  // Frequency health color
  const freqColor = telemetry.freq >= 49.9 && telemetry.freq <= 50.1 ? '#52C784' : telemetry.freq >= 49.7 ? '#D7A64A' : '#EF4444';
  const loadColor = telemetry.load > 85 ? '#EF4444' : telemetry.load > 70 ? '#D7A64A' : '#52C784';

  return (
    <div id="epede-hero" className="space-y-6 font-sans">

      {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#060B18] via-[#040711] to-[#020409] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] specular-border">

        {/* Ambient background glow blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-8">

          {/* ── TOP ROW: Title + SCADA Panel ────────────────────────── */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Title block */}
            <div className="space-y-3.5 max-w-2xl">
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>EPEDE · Electrical Power Engineering Digital Environment</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight leading-tight">
                {locale === 'fr' ? (
                  <>Comprenez l'<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500">Ingénierie</span><br />Électrique Complète</>
                ) : (
                  <>Master Complete<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500">Electrical Engineering</span></>
                )}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
                {locale === 'fr'
                  ? 'De la production hydroélectrique au consommateur final — 16 domaines, 57 équipements, 17 calculateurs CEI/IEEE, 16 laboratoires de simulation.'
                  : 'From hydroelectric generation to the final consumer — 16 domains, 57 equipment, 17 IEC/IEEE calculators, 16 simulation labs.'}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigateJourney ? onNavigateJourney() : onNavigateView('journey')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  {locale === 'fr' ? 'Parcourir la Chaîne' : 'Explore the Chain'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigateView('equipment-reference')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-500/50 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-md cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  {locale === 'fr' ? 'Référentiel Matériel' : 'Equipment Reference'}
                </motion.button>
              </div>
            </div>

            {/* SCADA Live Telemetry Panel */}
            <div className="shrink-0 rounded-2xl border border-white/[0.08] bg-[#070D1C]/85 p-5 space-y-3.5 min-w-[260px] backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SCADA · LIVE TELEMETRY</span>
                </div>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>

              {/* Frequency */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">f (Hz)</span>
                  <span className="font-mono font-black" style={{ color: freqColor }}>{telemetry.freq.toFixed(3)}</span>
                </div>
                <div className="w-full h-1 rounded-full bg-slate-800">
                  <motion.div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: freqColor,
                      width: `${((telemetry.freq - 49.5) / 1) * 100}%`,
                    }}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
              </div>

              {/* Voltage */}
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">U (kV)</span>
                <span className="font-mono font-black text-sky-400">{telemetry.voltage.toFixed(2)}</span>
              </div>

              {/* Active Power */}
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">P (MW)</span>
                <span className="font-mono font-black text-amber-400">{telemetry.power.toFixed(1)}</span>
              </div>

              {/* Reactive Power */}
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Q (Mvar)</span>
                <span className="font-mono font-black text-violet-400">+{telemetry.reactive.toFixed(1)}</span>
              </div>

              {/* Load */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">{locale === 'fr' ? 'Charge' : 'Load'} (%)</span>
                  <span className="font-mono font-black" style={{ color: loadColor }}>{telemetry.load.toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800">
                  <motion.div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ backgroundColor: loadColor, width: `${telemetry.load}%` }}
                  />
                </div>
              </div>

              <div className="pt-1 text-[9px] font-mono text-slate-600 text-center uppercase tracking-wider">
                SUB-BEKOKO-225 · BUS 1 (225 kV)
              </div>
            </div>
          </div>

          {/* ── LIVE POWER FLOW SVG ─────────────────────────────────── */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold uppercase tracking-wider">
                  {locale === 'fr' ? 'Chaîne Électrique Temps Réel' : 'Real-Time Electrical Power Chain'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black">
                  {playing ? 'LIVE' : 'PAUSED'}
                </span>
              </div>
              <button
                onClick={() => setPlaying(p => !p)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[10px] font-bold"
              >
                {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {playing ? (locale === 'fr' ? 'Pause' : 'Pause') : (locale === 'fr' ? 'Reprendre' : 'Resume')}
              </button>
            </div>

            <PowerFlowSvg playing={playing} onNodeClick={handleNodeClick} locale={locale} />

            <p className="text-[10px] text-slate-500 text-center font-mono">
              {locale === 'fr'
                ? 'Cliquez sur un nœud pour explorer le domaine correspondant'
                : 'Click on any node to explore the corresponding engineering domain'}
            </p>
          </div>

          {/* ── SEARCH BAR ──────────────────────────────────────────── */}
          <div className="space-y-3">
            <form onSubmit={handleSearch} className="relative group">
              <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/90 pointer-events-none transition-colors group-focus-within:text-amber-300" />
              <input
                id="hero-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => onOpenSearch(searchQuery)}
                placeholder={
                  locale === 'fr'
                    ? 'Rechercher équipements, protections, normes CEI, formules...'
                    : 'Search equipment, protection, IEC standards, formulas...'
                }
                className="w-full pl-11 pr-28 py-3.5 bg-[#050B16]/80 backdrop-blur-xl border border-white/[0.08] focus:border-amber-500/60 focus:ring-4 focus:ring-amber-500/10 rounded-xl text-white placeholder-slate-400/80 font-mono text-sm outline-none transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-white/[0.05] border border-white/[0.08] text-slate-300 font-mono text-[10px] font-bold shadow-sm">
                  Ctrl+K
                </kbd>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-[0_2px_12px_rgba(245,158,11,0.3)] active:scale-[0.98]"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-bold">{locale === 'fr' ? 'Chercher' : 'Search'}</span>
                </button>
              </div>
            </form>

            {/* Quick Search Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {QUICK_SEARCHES.map((item, i) => (
                <button
                  key={i}
                  onClick={() => onOpenSearch(item.q)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-amber-500/40 text-slate-300 hover:text-white font-mono text-xs transition-all flex items-center shadow-sm"
                >
                  <span className="text-amber-400/90 font-bold mr-1">#</span>
                  {locale === 'fr' ? item.fr : item.en}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PLATFORM FEATURES 6-CARD GRID ─────────────────────────────────── */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-tech tracking-wider">{locale === 'fr' ? 'Que puis-je faire sur EPEDE ?' : 'What can I do on EPEDE?'}</span>
          </h2>
          <button
            onClick={() => onNavigateView('domains')}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors group"
          >
            <span>{locale === 'fr' ? 'Tout explorer' : 'Explore all'}</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PLATFORM_FEATURES.map((feat) => {
            const Icon = feat.icon;
            const isActive = activeFeature === feat.id;
            return (
              <motion.button
                key={feat.id}
                whileHover={{ scale: 1.025, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveFeature(feat.id);
                  onNavigateView(feat.view);
                }}
                className="relative flex flex-col items-start gap-3 p-4 rounded-2xl text-left transition-all group backdrop-blur-xl overflow-hidden border shadow-lg"
                style={{
                  backgroundColor: isActive ? feat.bg : 'rgba(8, 14, 26, 0.75)',
                  borderColor: isActive ? feat.border : 'rgba(255, 255, 255, 0.07)',
                  boxShadow: isActive ? `0 10px 30px -10px ${feat.color}30` : undefined,
                }}
                onMouseEnter={() => setActiveFeature(feat.id)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                {/* Specular top border */}
                <div
                  className="absolute inset-x-0 top-0 h-px transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${feat.color}, transparent)`,
                    opacity: isActive ? 1 : 0.25,
                  }}
                />

                {/* Badge */}
                <span
                  className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded text-[8px] font-mono font-black tracking-wider uppercase"
                  style={{
                    color: feat.color,
                    backgroundColor: feat.bg,
                    border: `1px solid ${feat.border}`,
                  }}
                >
                  {feat.badge}
                </span>

                {/* Icon */}
                <div
                  className="p-2.5 rounded-xl transition-all shadow-inner"
                  style={{
                    backgroundColor: feat.bg,
                    border: `1px solid ${feat.border}`,
                    boxShadow: isActive ? `0 0 16px ${feat.color}40` : undefined,
                  }}
                >
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: feat.color }} />
                </div>

                {/* Text */}
                <div className="space-y-1">
                  <div className="text-[12px] font-black text-white font-display leading-tight group-hover:text-amber-200 transition-colors">
                    {locale === 'fr' ? feat.label.fr : feat.label.en}
                  </div>
                  <div className="text-[10px] text-slate-400/90 leading-tight font-sans">
                    {locale === 'fr' ? feat.desc.fr : feat.desc.en}
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight
                  className="absolute bottom-3 right-3 w-3.5 h-3.5 transition-all group-hover:translate-x-1"
                  style={{ color: feat.color, opacity: isActive ? 1 : 0.4 }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── PLATFORM STATS RIBBON ─────────────────────────────────────────── */}
      <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#060B18]/90 via-[#040813]/90 to-[#060B18]/90 p-4 sm:p-5 backdrop-blur-xl shadow-xl overflow-hidden">
        {/* Specular highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { n: '16',  label: { fr: 'Domaines',         en: 'Domains' },      color: '#7C6FCD' },
            { n: '57',  label: { fr: 'Équipements',      en: 'Equipment' },    color: '#D7A64A' },
            { n: '17',  label: { fr: 'Calculateurs',     en: 'Calculators' },  color: '#3A8FC7' },
            { n: '16',  label: { fr: 'Labs Simulation',  en: 'Sim Labs' },     color: '#52C784' },
            { n: '50+', label: { fr: 'Normes CEI/IEEE',  en: 'IEC/IEEE Stds'}, color: '#EC4899' },
            { n: '18',  label: { fr: 'Vues Hydropower',  en: 'Hydro Views' },  color: '#F97316' },
            { n: '10',  label: { fr: 'Onglets Matériel', en: 'EQ Inspector' }, color: '#14B8A6' },
            { n: '200+',label: { fr: 'Formules CEI',     en: 'IEC Formulas' }, color: '#A855F7' },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-1 group">
              <div
                className="text-xl sm:text-2xl font-black font-tech transition-transform group-hover:scale-105"
                style={{ color: stat.color, textShadow: `0 0 16px ${stat.color}40` }}
              >
                {stat.n}
              </div>
              <div className="text-[10px] text-slate-400 group-hover:text-slate-200 uppercase font-mono font-bold tracking-wider transition-colors">
                {locale === 'fr' ? stat.label.fr : stat.label.en}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
