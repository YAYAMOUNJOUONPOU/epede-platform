// src/components/equipment/CircuitBreakerCutawayWorkbench.tsx
// EPEDE - Interactive Electromechanical Cutaway & Arc Interruption Physics of SF6 Circuit Breaker
// Grounded in IEC 62271-100 (HV AC Circuit Breakers), IEC 62271-4 (Handling of SF6), and CIGRE TB 552.

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Layers,
  Shield,
  Gauge,
  Info,
  Maximize2
} from 'lucide-react';
import { EvidenceTrustBadge } from './EvidenceTrustBadge';

interface CircuitBreakerCutawayWorkbenchProps {
  locale?: 'fr' | 'en';
  bayName?: string;
  voltageKv?: number;
  breakingCapacityKa?: number;
  embedded?: boolean;
}

export type InterruptionPhase = 0 | 1 | 2 | 3;

export const CircuitBreakerCutawayWorkbench: React.FC<CircuitBreakerCutawayWorkbenchProps> = ({
  locale = 'fr',
  bayName = 'TR-225-BEKOKO',
  voltageKv = 225,
  breakingCapacityKa = 40,
  embedded = false
}) => {
  const isFr = locale === 'fr';

  // 0: Closed (En service), 1: Contact Parting & Arcing, 2: Puffer Gas Blast, 3: Extinction & TRV Withstand
  const [phase, setPhase] = useState<InterruptionPhase>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto-advance loop when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setPhase((prev) => {
        if (prev === 3) {
          setIsPlaying(false);
          return 3;
        }
        return (prev + 1) as InterruptionPhase;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const phasesMeta = [
    {
      step: 0,
      title_fr: 'Phase 1 : Contacts Fermés (Régime Permanent)',
      title_en: 'Phase 1: Closed Contacts (Continuous Rated Load)',
      timeMs: '0 ms',
      arcTempK: 350,
      gasPressureBar: 6.0,
      trvKv: 0,
      contactGapMm: 0,
      desc_fr: 'Le courant nominal (ex: 2 500 A) transite par les contacts principaux externes à très basse résistance (< 35 μΩ). Le cylindre de soufflage est en position haute repos, rempli de gaz SF₆ à 6.0 bar.',
      desc_en: 'Continuous rated load current (e.g. 2,500 A) flows through outer main contacts with very low resistance (< 35 μΩ). Puffer cylinder is at rest position filled with SF₆ gas at 6.0 bar.'
    },
    {
      step: 1,
      title_fr: 'Phase 2 : Séparation des Contacts & Amorçage de l\'Arc',
      title_en: 'Phase 2: Contact Parting & Arc Inception',
      timeMs: '18 ms',
      arcTempK: 16500,
      gasPressureBar: 8.8,
      trvKv: 24,
      contactGapMm: 35,
      desc_fr: 'Les contacts principaux se séparent en premier sans étincelle. Le courant de court-circuit (40 kA) commute sur les contacts d\'arc sacrificiels en alliage CuW (Cuivre-Tungstène). Un arc plasma incandescent jaillit dans le col de la tuyère PTFE à plus de 16 000 K.',
      desc_en: 'Main contacts part first without arcing. The 40 kA fault current commutates onto sacrificial CuW (Copper-Tungsten) arcing tips. High-energy plasma arc strikes inside the PTFE nozzle throat exceeding 16,000 K.'
    },
    {
      step: 2,
      title_fr: 'Phase 3 : Compression Auto-Pneumatique & Soufflage de SF₆',
      title_en: 'Phase 3: Puffer Compression & Supersonic SF₆ Blast',
      timeMs: '38 ms',
      arcTempK: 8200,
      gasPressureBar: 14.2,
      trvKv: 140,
      contactGapMm: 80,
      desc_fr: 'La descente du cylindre de soufflage comprime violemment le gaz SF₆. Le souffle de gaz supersonique axial traverse la tuyère PTFE, refroidit intensément la colonne d\'arc et déionise le plasma conducteur.',
      desc_en: 'The moving puffer cylinder rapidly compresses SF₆ gas. Supersonic axial gas blast sweeps through the PTFE nozzle, vigorously cooling the arc column and de-ionizing the conductive plasma.'
    },
    {
      step: 3,
      title_fr: 'Phase 4 : Extinction au Zéro de Courant & Tenue à la TRV',
      title_en: 'Phase 4: Current Zero Extinction & TRV Dielectric Recovery',
      timeMs: '52 ms',
      arcTempK: 450,
      gasPressureBar: 6.2,
      trvKv: 410,
      contactGapMm: 125,
      desc_fr: 'À l\'instant du passage à zéro du courant alternatif (I = 0), l\'arc s\'éteint définitivement. La rigidité diélectrique du SF₆ pur se reconstitue en quelques microsecondes, supportant la Tension Transitoire de Rétablissement (TRV jusqu\'à 410 kV crête selon CEI 62271-100).',
      desc_en: 'At AC current zero crossing (I = 0), the arc extinguishes permanently. High dielectric strength of pure SF₆ recovers in microseconds, withstanding severe Transient Recovery Voltage (TRV up to 410 kV peak per IEC 62271-100).'
    }
  ];

  const currentMeta = phasesMeta[phase];

  // Animated geometry positions based on phase
  const contactTravelY = phase === 0 ? 0 : phase === 1 ? 30 : phase === 2 ? 65 : 100;
  const isArcPresent = phase === 1 || phase === 2;

  return (
    <div className={`space-y-6 font-sans ${embedded ? '' : 'p-4 sm:p-6 max-w-6xl mx-auto'}`}>
      
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-[#0A0E15] p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>{isFr ? 'COUPE ÉLECTROMÉCANIQUE 3D DYNAMIQUE' : 'DYNAMIC 3D ELECTROMECHANICAL CUTAWAY'}</span>
              </span>
              <EvidenceTrustBadge level="VERIFIED_STANDARD" locale={locale} size="sm" />
              <EvidenceTrustBadge level="FIELD_PRACTICE" locale={locale} size="sm" />
            </div>

            <h2 className="text-xl sm:text-2xl font-mono font-black text-white uppercase tracking-tight">
              {isFr
                ? `Chambre de Coupure SF₆ Autopneumatique (${voltageKv} kV / ${breakingCapacityKa} kA)`
                : `SF₆ Puffer Interrupter Chamber (${voltageKv} kV / ${breakingCapacityKa} kA)`}
            </h2>

            <p className="text-xs text-slate-400 max-w-2xl font-mono">
              {isFr
                ? `Travée ${bayName} · Norme CEI 62271-100 · Cycle O - 0.3s - CO · Alliage CuW80 & Tuyère PTFE`
                : `Bay ${bayName} · IEC 62271-100 Standard · O - 0.3s - CO duty · CuW80 tips & PTFE nozzle`}
            </p>
          </div>

          {/* Animation Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (phase === 3) setPhase(0);
                setIsPlaying(!isPlaying);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-950"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>{isPlaying ? (isFr ? 'Pause' : 'Pause') : (isFr ? 'Lancer Coupure 40 kA' : 'Simulate 40 kA Trip')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setPhase(0);
              }}
              title={isFr ? 'Réarmer disjoncteur (fermé)' : 'Reset breaker (closed)'}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Phase Stepper Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-5 pt-4 border-t border-slate-800/80 font-mono text-xs">
          {phasesMeta.map((p) => (
            <button
              key={p.step}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setPhase(p.step as InterruptionPhase);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                phase === p.step
                  ? 'bg-cyan-950/40 border-cyan-500/80 text-cyan-200 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-cyan-400">ÉTAPES {p.step + 1}/4</span>
                <span className="opacity-70">{p.timeMs}</span>
              </div>
              <div className="font-bold text-[11px] text-white mt-1 truncate">
                {isFr ? p.title_fr.split(':')[1] : p.title_en.split(':')[1]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Interactive SVG Cutaway (7 cols), Right Telemetry & Physics (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Electromechanical SVG Cutaway */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col items-center justify-center relative overflow-hidden min-h-[460px]">
          
          {/* Background Technical Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#131B24_1px,transparent_1px),linear-gradient(to_bottom,#131B24_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />

          {/* SVG Interrupter Chamber Graphic */}
          <svg viewBox="0 0 400 480" className="w-full max-w-[380px] h-auto relative z-10 select-none drop-shadow-2xl">
            <defs>
              {/* Ceramic shed pattern */}
              <linearGradient id="porcelainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="50%" stopColor="#64748B" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>

              {/* Copper Tungsten CuW alloy gradient */}
              <linearGradient id="cuwGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>

              {/* PTFE Nozzle gradient */}
              <linearGradient id="ptfeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#F8FAFC" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.85" />
              </linearGradient>

              {/* Electric Arc Plasma Gradient */}
              <linearGradient id="arcPlasmaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#67E8F9" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="plasmaGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* OUTER HOUSING / PORCELAIN INSULATOR SHEDS */}
            <g opacity="0.35">
              <rect x="70" y="40" width="260" height="400" rx="12" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
              {/* Sheds */}
              {[70, 110, 150, 190, 230, 270, 310, 350, 390].map((y, i) => (
                <path key={i} d={`M 50 ${y} L 70 ${y - 8} L 70 ${y + 8} Z M 350 ${y} L 330 ${y - 8} L 330 ${y + 8} Z`} fill="url(#porcelainGrad)" />
              ))}
            </g>

            {/* UPPER TERMINAL FLANGE (FIXED POTENTIAL) */}
            <rect x="120" y="20" width="160" height="24" rx="4" fill="#64748B" stroke="#94A3B8" strokeWidth="1.5" />
            <text x="200" y="36" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">
              BORNE HTB SUPÉRIEURE (225 kV)
            </text>

            {/* FIXED CONTACT STRUCTURE */}
            <rect x="150" y="44" width="100" height="40" fill="#475569" stroke="#64748B" strokeWidth="1" />
            {/* Fixed main contact fingers */}
            <rect x="140" y="84" width="18" height="45" rx="3" fill="#D97706" stroke="#F59E0B" strokeWidth="1" />
            <rect x="242" y="84" width="18" height="45" rx="3" fill="#D97706" stroke="#F59E0B" strokeWidth="1" />
            {/* Fixed tulip arcing contact pin (CuW) */}
            <rect x="190" y="84" width="20" height="55" rx="4" fill="url(#cuwGrad)" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="200" y="118" textAnchor="middle" fill="#FEF08A" fontSize="8" fontFamily="monospace" fontWeight="bold">
              CuW
            </text>

            {/* DYNAMIC ELECTRIC ARC PLASMA (WHEN CONTACTS PART) */}
            {isArcPresent && (
              <g filter="url(#plasmaGlow)">
                {/* Core plasma channel */}
                <path
                  d={`M 200 138 Q ${196 + (Math.sin(Date.now() / 80) * 8)} ${(138 + (138 + contactTravelY)) / 2} 200 ${138 + contactTravelY}`}
                  stroke="url(#arcPlasmaGrad)"
                  strokeWidth={phase === 1 ? '10' : '6'}
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Outer halo */}
                <ellipse
                  cx="200"
                  cy={(138 + (138 + contactTravelY)) / 2}
                  rx="18"
                  ry={contactTravelY / 2}
                  fill="#38BDF8"
                  opacity={phase === 1 ? '0.35' : '0.2'}
                />
              </g>
            )}

            {/* MOVING CONTACT ASSEMBLY (TRANSFORMS DOWNWARD WITH contactTravelY) */}
            <g transform={`translate(0, ${contactTravelY})`} className="transition-transform duration-700 ease-out">
              
              {/* PTFE NOZZLE (CONVERGENT-DIVERGENT THROAT) */}
              <path
                d="M 160 135 L 180 148 L 180 185 L 155 215 L 150 180 Z"
                fill="url(#ptfeGrad)"
                stroke="#64748B"
                strokeWidth="1"
              />
              <path
                d="M 240 135 L 220 148 L 220 185 L 245 215 L 250 180 Z"
                fill="url(#ptfeGrad)"
                stroke="#64748B"
                strokeWidth="1"
              />
              <text x="200" y="165" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="monospace">
                COL PTFE
              </text>

              {/* Moving Arcing Contact Pin (CuW) */}
              <rect x="192" y="140" width="16" height="50" rx="3" fill="url(#cuwGrad)" stroke="#F59E0B" strokeWidth="1.5" />

              {/* Moving Main Contact Fingers */}
              <rect x="135" y="170" width="18" height="40" rx="3" fill="#D97706" stroke="#F59E0B" strokeWidth="1" />
              <rect x="247" y="170" width="18" height="40" rx="3" fill="#D97706" stroke="#F59E0B" strokeWidth="1" />

              {/* PUFFER COMPRESSION CYLINDER */}
              <rect x="130" y="210" width="140" height="90" rx="6" fill="#1E293B" stroke="#0284C7" strokeWidth="2" />
              <text x="200" y="240" textAnchor="middle" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                CYLINDRE DE SOUFFLAGE SF₆
              </text>
              <text x="200" y="255" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">
                Pression : {currentMeta.gasPressureBar} bar
              </text>

              {/* Gas Flow Arrows (during puffer blast phase 2) */}
              {phase === 2 && (
                <g fill="#38BDF8" opacity="0.9">
                  <path d="M 175 195 L 190 170 L 185 170 L 180 185 Z" />
                  <path d="M 225 195 L 210 170 L 215 170 L 220 185 Z" />
                </g>
              )}

              {/* INSULATING OPERATING PUSHROD */}
              <rect x="188" y="300" width="24" height="120" rx="4" fill="#334155" stroke="#475569" strokeWidth="1.5" />
              <text x="200" y="360" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace" transform="rotate(-90 200 360)">
                TRINGLE DE COMMANDE
              </text>
            </g>

            {/* LOWER FIXED BASE / CRANKCASE */}
            <rect x="110" y="440" width="180" height="30" rx="4" fill="#475569" stroke="#64748B" strokeWidth="1.5" />
            <text x="200" y="460" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">
              MÉCANISME À RESSORT / HYDRAULIQUE
            </text>
          </svg>

          {/* Contact Gap Callout */}
          <div className="absolute bottom-3 left-4 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span>Course des contacts : </span>
            <strong className="text-cyan-300">{currentMeta.contactGapMm} mm</strong>
          </div>

          {/* SF6 Purity Callout */}
          <div className="absolute bottom-3 right-4 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300">
            <span>Rigidité SF₆ : </span>
            <strong className="text-emerald-300">89 kV/cm (x3 Air)</strong>
          </div>
        </div>

        {/* Right: Dynamic Physics Telemetry & Explanation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Phase Header Box */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                TEMPS ÉCOULÉ : {currentMeta.timeMs}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {phase === 0 ? 'Fermé' : phase === 3 ? 'Coupé' : 'En commutation'}
              </span>
            </div>

            <h3 className="text-sm font-bold font-mono text-white">
              {isFr ? currentMeta.title_fr : currentMeta.title_en}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {isFr ? currentMeta.desc_fr : currentMeta.desc_en}
            </p>
          </div>

          {/* Real-time Physical Gauges */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            
            {/* Plasma Temp */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                TEMPÉRATURE ARC :
              </span>
              <div className={`text-base font-black ${currentMeta.arcTempK > 5000 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
                {currentMeta.arcTempK.toLocaleString()} K
              </div>
              <span className="text-[10px] text-slate-500">
                {currentMeta.arcTempK > 10000 ? 'Plasma ionisé incandescent' : 'Désionisé'}
              </span>
            </div>

            {/* Puffer Gas Pressure */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                PRESSION SOUFFLAGE :
              </span>
              <div className="text-base font-black text-cyan-300">
                {currentMeta.gasPressureBar.toFixed(1)} bar
              </div>
              <span className="text-[10px] text-slate-500">
                {currentMeta.gasPressureBar > 10 ? 'Surpression axiale' : 'Pression nominale'}
              </span>
            </div>

            {/* TRV Voltage */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                TENSION TRV / TTBT :
              </span>
              <div className="text-base font-black text-amber-300">
                {currentMeta.trvKv} kV
              </div>
              <span className="text-[10px] text-slate-500">
                Tension de rétablissement
              </span>
            </div>

            {/* Contact Separation */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                COURSE EXTINCTION :
              </span>
              <div className="text-base font-black text-emerald-300">
                {currentMeta.contactGapMm} mm
              </div>
              <span className="text-[10px] text-slate-500">
                Écartement géométrique
              </span>
            </div>
          </div>

          {/* Metallurgical & Gas Material Science Notes */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <span className="font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-cyan-400" />
              {isFr ? 'Science des Matériaux & Conception CEI 62271-100 :' : 'Materials Science & IEC 62271-100 Design:'}
            </span>
            <ul className="space-y-1.5 text-slate-400 font-sans leading-relaxed text-[11px]">
              <li>
                <strong className="text-amber-300 font-mono">Alliage CuW80/20 : </strong>
                {isFr
                  ? 'Matrice de tungstène fritté infiltrée de cuivre résistant à l\'érosion d\'arc jusqu\'à 3 422 °C.'
                  : 'Sintered tungsten matrix infiltrated with copper resisting arc erosion up to 3,422 °C.'}
              </li>
              <li>
                <strong className="text-slate-200 font-mono">Tuyère en PTFE pur : </strong>
                {isFr
                  ? 'Polymère fluoré à très haute résistance d\'arc guidant l\'écoulement de gaz sans cokéfaction conductrice.'
                  : 'Fluoropolymer with exceptional arc resistance shaping supersonic gas blast without conductive tracking.'}
              </li>
              <li>
                <strong className="text-cyan-300 font-mono">Électronégativité du SF₆ : </strong>
                {isFr
                  ? 'Capture immédiate des électrons libres dès le passage à zéro du courant, bloquant tout réamorçage.'
                  : 'Immediate capture of free electrons at current zero, preventing dielectric re-ignition.'}
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};
