// src/components/epede/CinematicAwakeningHero.tsx
import React, { useState, useEffect } from 'react';
import { CopperEnergyParticles } from './CopperEnergyParticles';
import { PowerSystemMap } from './PowerSystemMap';
import type { PowerNodeId } from './types';
import type { DomainCode } from '../../types/epede';
import { ArrowDown, Radio, Activity, Compass, Zap } from 'lucide-react';

export interface CinematicAwakeningHeroProps {
  locale: 'fr' | 'en';
  isReducedMotion?: boolean;
  onSelectDomain?: (code: DomainCode) => void;
  onNavigateView?: (view: any) => void;
  onExploreSystem?: () => void;
}

export const CinematicAwakeningHero: React.FC<CinematicAwakeningHeroProps> = ({
  locale,
  isReducedMotion = false,
  onSelectDomain,
  onNavigateView,
  onExploreSystem,
}) => {
  const [journeyProgress, setJourneyProgress] = useState(0);
  const [mapNode, setMapNode] = useState<PowerNodeId>('generation');

  useEffect(() => {
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setJourneyProgress(maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const scrollToMap = () => {
    const mapElement = document.getElementById('system-topology-map');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="epede-hero-suite space-y-12 font-sans">
      {/* 1. CINEMATIC AWAKENING HERO */}
      <section
        className="awakening-hero relative min-h-[580px] sm:min-h-[640px] rounded-3xl overflow-hidden border border-[#252E38] bg-[#080B0D] flex items-center shadow-2xl p-6 sm:p-12"
        id="awakening"
      >
        {/* Background Engineering Diagram Vector & SVG Backdrop */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Schematic SVG High-Voltage Transmission Corridor & Substation Bay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-35 object-cover"
            viewBox="0 0 1440 680"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="gridLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D7A64A" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#567A87" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#D7A64A" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Ground line */}
            <line x1="0" y1="560" x2="1440" y2="560" stroke="#252E38" strokeWidth="2" />

            {/* Transmission Towers (Lattice Pylons) */}
            {[240, 680, 1120].map((xPylon, idx) => (
              <g key={idx} opacity={0.65 - idx * 0.12}>
                {/* Main tower legs */}
                <line x1={xPylon - 40} y1="560" x2={xPylon - 12} y2="220" stroke="#567A87" strokeWidth="2" />
                <line x1={xPylon + 40} y1="560" x2={xPylon + 12} y2="220" stroke="#567A87" strokeWidth="2" />
                {/* Tower head & crossarms */}
                <line x1={xPylon - 75} y1="260" x2={xPylon + 75} y2="260" stroke="#D7A64A" strokeWidth="2.5" />
                <line x1={xPylon - 95} y1="320" x2={xPylon + 95} y2="320" stroke="#D7A64A" strokeWidth="2.5" />
                <line x1={xPylon - 80} y1="380" x2={xPylon + 80} y2="380" stroke="#D7A64A" strokeWidth="2.5" />
                {/* Lattice bracings */}
                <line x1={xPylon - 30} y1="500" x2={xPylon + 25} y2="440" stroke="#252E38" strokeWidth="1.5" />
                <line x1={xPylon + 30} y1="500" x2={xPylon - 25} y2="440" stroke="#252E38" strokeWidth="1.5" />
                <line x1={xPylon - 22} y1="440" x2={xPylon + 20} y2="380" stroke="#252E38" strokeWidth="1.5" />
                <line x1={xPylon + 22} y1="440" x2={xPylon - 20} y2="380" stroke="#252E38" strokeWidth="1.5" />
                {/* Insulator strings */}
                <line x1={xPylon - 75} y1="260" x2={xPylon - 75} y2="295" stroke="#75A88C" strokeWidth="3" />
                <line x1={xPylon + 75} y1="260" x2={xPylon + 75} y2="295" stroke="#75A88C" strokeWidth="3" />
              </g>
            ))}

            {/* Catenary Conductor Overhead Curves */}
            <path
              d="M 0 310 Q 160 380 240 295 Q 460 370 680 295 Q 900 370 1120 295 Q 1280 370 1440 310"
              fill="none"
              stroke="url(#gridLineGrad)"
              strokeWidth="2.5"
            />
            <path
              d="M 0 370 Q 160 440 240 355 Q 460 430 680 355 Q 900 430 1120 355 Q 1280 430 1440 370"
              fill="none"
              stroke="url(#gridLineGrad)"
              strokeWidth="1.8"
              strokeDasharray="8 6"
            />
          </svg>

          {/* Perspective CAD Technical Grid */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(215, 166, 74, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(215, 166, 74, 0.2) 1px, transparent 1px)',
              backgroundSize: '70px 70px',
              maskImage: 'linear-gradient(to right, black 20%, transparent 90%)',
            }}
          />

          {/* Graphite Readability Washes */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(8,11,13,0.96) 0%, rgba(8,11,13,0.85) 45%, rgba(8,11,13,0.4) 75%, rgba(8,11,13,0.88) 100%), linear-gradient(180deg, rgba(8,11,13,0.3) 0%, transparent 40%, rgba(8,11,13,0.9) 100%)',
            }}
          />

          {/* Radial Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 60% 40%, transparent 25%, rgba(8,11,13,0.85) 100%)',
            }}
          />
        </div>

        {/* 28-Particle Copper Energy Canvas */}
        <CopperEnergyParticles particleCount={28} className="z-10" paused={isReducedMotion} />

        {/* Hero Foreground Content */}
        <div className="relative z-20 max-w-2xl space-y-6">
          {/* Eyebrow / Kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D7A64A]/30 bg-[#D7A64A]/10 text-[#D7A64A] text-xs font-mono font-bold tracking-widest uppercase">
            <Radio className="h-3.5 w-3.5 text-[#D7A64A] animate-pulse" />
            <span>
              {locale === 'fr'
                ? 'ENVIRONNEMENT NUMÉRIQUE DU GÉNIE ÉLECTRIQUE'
                : 'ELECTRICAL POWER ENGINEERING DIGITAL ENVIRONMENT'}
            </span>
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-mono tracking-tight text-white leading-[1.05]">
            {locale === 'fr' ? (
              <>
                Le système <br />
                <span className="text-[#D7A64A]">prend vie.</span>
              </>
            ) : (
              <>
                The system <br />
                <span className="text-[#D7A64A]">comes alive.</span>
              </>
            )}
          </h1>

          {/* Body */}
          <p className="text-lg sm:text-xl text-[#F4F1E8]/90 font-sans leading-relaxed max-w-xl">
            {locale === 'fr'
              ? 'Suivez l\'énergie électrique en continu : de la production hydroélectrique haute tension jusqu\'aux postes de transformation et au réseau intelligent.'
              : 'Follow electrical energy through every stage: from high-voltage generation corridors to transformation switchyards and the intelligent grid.'}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={scrollToMap}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#D7A64A] hover:bg-[#E5C276] text-[#080B0D] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-xl hover:-translate-y-0.5 cursor-pointer active:scale-95"
            >
              <span>{locale === 'fr' ? 'Entrer dans le système' : 'Enter the power system'}</span>
              <ArrowDown className="h-4 w-4" />
            </button>

            {onExploreSystem && (
              <button
                type="button"
                onClick={onExploreSystem}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#252E38] bg-[#151C1E]/80 hover:bg-[#1E2630] text-[#F4F1E8] font-mono text-xs font-semibold tracking-wider transition-all cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 text-[#D7A64A]" />
                <span>{locale === 'fr' ? 'Parcours Étape par Étape' : 'Step-by-Step Journey'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Dispatch Telemetry HUD HUD */}
        <div
          className="hidden md:flex flex-col gap-4 absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 z-20 p-5 rounded-2xl border-l-2 border-[#D7A64A] border-y border-r border-[#252E38] bg-[#0B0F12]/90 backdrop-blur-md font-mono text-xs shadow-2xl"
          aria-hidden="true"
        >
          <div>
            <span className="text-[10px] text-[#A9ADA5] block uppercase tracking-wider">
              {locale === 'fr' ? 'ÉTAT DU RÉSEAU' : 'NETWORK STATE'}
            </span>
            <strong className="text-sm text-[#75A88C] font-bold block mt-0.5">
              ● {locale === 'fr' ? 'SYNCHRONE EN LIGNE' : 'SYNCHRONOUS ONLINE'}
            </strong>
          </div>

          <div>
            <span className="text-[10px] text-[#A9ADA5] block uppercase tracking-wider">
              {locale === 'fr' ? 'CORRIDOR DE FLUX' : 'SYSTEM FLOW'}
            </span>
            <strong className="text-xs text-white block mt-0.5">
              GEN → THT 225 kV → POSTE
            </strong>
          </div>

          <div>
            <span className="text-[10px] text-[#A9ADA5] block uppercase tracking-wider">
              {locale === 'fr' ? 'NŒUD GÉOGRAPHIQUE' : 'GRID COORDINATES'}
            </span>
            <strong className="text-xs text-[#D7A64A] block mt-0.5">
              06°12′N / 12°22′E
            </strong>
          </div>

          <div className="pt-2 border-t border-[#1E2630] flex items-center justify-between text-[10px] text-[#A9ADA5]">
            <span>CEI 60038 / 60076</span>
            <span className="text-[#75A88C]">50.00 Hz</span>
          </div>
        </div>

        {/* Scene Meta Bottom Bar */}
        <div
          className="absolute left-6 right-6 sm:left-12 sm:right-12 bottom-4 z-20 flex items-center justify-between text-[11px] font-mono text-[#A9ADA5]"
          aria-hidden="true"
        >
          <span className="flex items-center gap-1.5">
            <Compass className="h-3 w-3 text-[#D7A64A]" />
            {locale === 'fr' ? 'DÉFILEZ POUR DÉCOUVRIR LE SYSTÈME' : 'SCROLL TO EXPLORE ARCHITECTURE'}
          </span>
          <span>EPEDE / 2026</span>
        </div>
      </section>

      {/* 2. TOPOLOGY MAP ANCHOR SECTION */}
      <section className="space-y-4 pt-4" id="system-topology-map">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-[#D7A64A] uppercase block">
            {locale === 'fr' ? 'LE SYSTÈME ÉLECTRIQUE EST UNIFIÉ' : 'THE POWER SYSTEM IS CONNECTED'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-slate-900">
            {locale === 'fr' ? (
              <>
                Un seul flux d'énergie. <span className="text-[#0284C7]">Tous les systèmes coordonnés.</span>
              </>
            ) : (
              <>
                One continuous flow. <span className="text-[#0284C7]">Every system working together.</span>
              </>
            )}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
            {locale === 'fr'
              ? 'L\'électricité ne se résume pas à des machines isolées. Cliquez sur un nœud ci-dessous pour voir comment production, élévation, transport très haute tension, postes de transformation, distribution et flexibilité s\'articulent.'
              : 'Electrical energy is not a disconnected collection of machines. Select any node below to explore how generation, step-up transformation, high-voltage transmission, substations, distribution, and smart grid flexibility operate together.'}
          </p>
        </div>

        {/* Interactive Topology Graph */}
        <PowerSystemMap
          locale={locale}
          isReducedMotion={isReducedMotion}
          onSelectDomain={onSelectDomain}
          onNavigateView={onNavigateView}
          onNodeChange={(id) => setMapNode(id)}
        />
        <span className="sr-only" aria-live="polite">
          Current map focus: {mapNode}
        </span>
      </section>
    </div>
  );
};
