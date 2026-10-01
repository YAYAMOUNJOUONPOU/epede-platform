// src/components/transmission/ProtectionAndTelecomOverlay.tsx
// EPEDE D03 - Protection and Telecommunication Overlay (ANSI 21/87L & OPGW 48-Fiber Architecture)

import React, { useState } from 'react';
import {
  ShieldAlert,
  Radio,
  Sliders,
  Activity,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Cpu
} from 'lucide-react';
import {
  TRANSMISSION_PROTECTION_ZONES,
  TELEPROTECTION_SCHEMES,
  OPGW_48_FIBER_MAP
} from './data/transmissionData';

interface ProtectionAndTelecomOverlayProps {
  locale: 'fr' | 'en';
}

export const ProtectionAndTelecomOverlay: React.FC<ProtectionAndTelecomOverlayProps> = ({
  locale
}) => {
  const [faultDistancePercent, setFaultDistancePercent] = useState<number>(45);
  const [selectedSchemeName, setSelectedSchemeName] = useState<string>('POTT');
  const [faultNature, setFaultNature] = useState<'TRANSIENT_FUGITIF' | 'PERMANENT'>('TRANSIENT_FUGITIF');
  const [recloseCycleState, setRecloseCycleState] = useState<'READY' | 'FAULT_TRIP' | 'DEAD_TIME' | 'RECLOSE_SUCCESS' | 'FINAL_LOCKOUT'>('READY');

  // Trigger Autoreclosing cycle simulation
  const simulateAutoreclose = () => {
    setRecloseCycleState('FAULT_TRIP');
    setTimeout(() => {
      setRecloseCycleState('DEAD_TIME');
      setTimeout(() => {
        if (faultNature === 'TRANSIENT_FUGITIF') {
          setRecloseCycleState('RECLOSE_SUCCESS');
        } else {
          setRecloseCycleState('FINAL_LOCKOUT');
        }
      }, 1000);
    }, 600);
  };

  // Determine active trip zone based on fault distance
  let activeTripZone = 'Zone 1';
  let tripDelayMs = 45; // Breaker + Zone 1 instantaneous

  if (faultDistancePercent <= 85) {
    activeTripZone = 'Zone 1 (Instantané)';
    tripDelayMs = 45; // 20ms relay + 25ms breaker
  } else if (faultDistancePercent <= 120) {
    activeTripZone = 'Zone 2 (Temporisé / Téléprotection)';
    tripDelayMs = selectedSchemeName === 'POTT' ? 50 : 350; // Accelerated by POTT vs raw Zone 2 time
  } else if (faultDistancePercent <= 160) {
    activeTripZone = 'Zone 3 (Secours Éloigné)';
    tripDelayMs = 800;
  } else {
    activeTripZone = 'Hors Zone Ligne (Pas de déclenchement direct)';
    tripDelayMs = 0;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161B22] border border-[#252E38]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/30">
              PILLIER 7 · SYSTÈME DE PROTECTION HTB & TÉLÉCOMMUNICATIONS
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white font-mono mt-1 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-400" />
              <span>
                {locale === 'fr'
                  ? 'Plan de Protection Main 1 / Main 2 & Architecture OPGW'
                  : 'Main 1 / Main 2 Protection Overlay & OPGW Teleprotection Plan'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              {locale === 'fr'
                ? 'Architecture redondante unifiée : Protection de distance (ANSI 21) avec schéma POTT, protection différentielle de ligne à fibre optique (ANSI 87L) et plan de câblage OPGW 48 fibres.'
                : 'Unified dual redundant protection: Distance relaying (ANSI 21) with POTT teleprotection, optical line current differential (ANSI 87L), and 48-fiber OPGW allocation map.'}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
              Main 1 : ANSI 21 (Distance)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
              Main 2 : ANSI 87L (Différentiel)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive R-X Plane Simulator (Two Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Fault Location Slider & Trip Logic (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl font-mono text-xs">
          <div className="text-xs font-bold text-red-400 uppercase flex items-center gap-1.5">
            <Sliders className="h-4 w-4" />
            <span>{locale === 'fr' ? 'Simulateur de Défaut sur la Ligne 225 kV' : 'Line Fault Distance Simulator'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Position du Court-Circuit :</span>
              <span className="text-amber-400 font-bold">{faultDistancePercent}% de la ligne</span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="5"
              value={faultDistancePercent}
              onChange={(e) => setFaultDistancePercent(Number(e.target.value))}
              className="w-full accent-red-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 pt-1">
              <span>0% (Poste Local)</span>
              <span>85% (Limite Z1)</span>
              <span>100% (Poste Distant)</span>
              <span>150% (Réseau Aval)</span>
            </div>
          </div>

          {/* Scheme Selector */}
          <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-2">
            <span className="text-slate-400 uppercase text-[10px] block">Schéma de Téléprotection Actif :</span>
            <div className="grid grid-cols-2 gap-2">
              {['POTT', 'PUTT', 'BCC', 'DTT'].map((scheme) => (
                <button
                  key={scheme}
                  type="button"
                  onClick={() => setSelectedSchemeName(scheme)}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                    selectedSchemeName === scheme
                      ? 'bg-red-500/20 border-red-500 text-red-300 font-bold'
                      : 'bg-[#161B22] border-[#252E38] text-slate-400 hover:text-white'
                  }`}
                >
                  {scheme}
                </button>
              ))}
            </div>
          </div>

          {/* Tripping Action Display */}
          <div className="p-4 rounded-xl bg-[#080B10] border border-red-500/30 space-y-2">
            <div className="text-[10px] text-slate-500 uppercase">Zone de Détection Relayée</div>
            <div className="text-base font-bold text-red-400">{activeTripZone}</div>
            <div className="flex justify-between items-center pt-2 border-t border-[#252E38]">
              <span className="text-slate-400">Temps d'Élimination Défaut :</span>
              <span className="text-lg font-black text-white">{tripDelayMs} ms</span>
            </div>
          </div>

          {/* Interactive ANSI 79 Auto-Reclosing Simulator */}
          <div className="p-4 rounded-xl bg-[#0D1117] border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                CYCLE RÉENCLENCHEUR ANSI 79
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Temps Mort = 1.0 s
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFaultNature('TRANSIENT_FUGITIF')}
                className={`flex-1 py-1 px-2 rounded text-[10px] border transition-colors ${
                  faultNature === 'TRANSIENT_FUGITIF'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                    : 'bg-[#161B22] border-[#252E38] text-slate-400'
                }`}
              >
                Fugitif (85% des cas)
              </button>
              <button
                type="button"
                onClick={() => setFaultNature('PERMANENT')}
                className={`flex-1 py-1 px-2 rounded text-[10px] border transition-colors ${
                  faultNature === 'PERMANENT'
                    ? 'bg-red-500/20 border-red-400 text-red-300 font-bold'
                    : 'bg-[#161B22] border-[#252E38] text-slate-400'
                }`}
              >
                Permanent (Câble coupé)
              </button>
            </div>

            <button
              type="button"
              onClick={simulateAutoreclose}
              disabled={recloseCycleState === 'FAULT_TRIP' || recloseCycleState === 'DEAD_TIME'}
              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Simuler Déclenchement & Réenclenchement</span>
            </button>

            {/* Reclose Status indicator */}
            <div className="p-2 rounded-lg bg-[#080B10] border border-[#252E38] text-[10px] flex items-center justify-between">
              <span className="text-slate-400">Statut Automate 79 :</span>
              {recloseCycleState === 'READY' && <span className="text-slate-400">Prêt / En veille</span>}
              {recloseCycleState === 'FAULT_TRIP' && <span className="text-red-400 font-bold animate-pulse">Déclenchement Monophasé ({tripDelayMs} ms)</span>}
              {recloseCycleState === 'DEAD_TIME' && <span className="text-amber-400 font-bold animate-pulse">Temps Mort Désionisation (1.0 s)</span>}
              {recloseCycleState === 'RECLOSE_SUCCESS' && <span className="text-emerald-400 font-bold">✓ Réenclenchement Réussi (Ligne Saine)</span>}
              {recloseCycleState === 'FINAL_LOCKOUT' && <span className="text-red-400 font-bold">✕ Déclenchement Définitif & Verrouillage (86)</span>}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive R-X Plane Graphic (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-3 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase">
              {locale === 'fr' ? 'Plan d\'Impédance R-X (Caractéristique Quadrilatérale)' : 'R-X Complex Impedance Plane'}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              ANSI 21 / CEI 60255
            </span>
          </div>

          {/* SVG R-X Plane */}
          <div className="p-4 rounded-xl bg-[#080B10] border border-[#252E38] flex flex-col items-center">
            <svg viewBox="0 0 400 280" className="w-full h-auto">
              {/* Axes */}
              <line x1="30" y1="230" x2="380" y2="230" stroke="#475569" strokeWidth="1.5" />
              <line x1="120" y1="260" x2="120" y2="20" stroke="#475569" strokeWidth="1.5" />
              <text x="370" y="245" fill="#94A3B8" fontSize="10" fontFamily="monospace">R (Ω)</text>
              <text x="100" y="25" fill="#94A3B8" fontSize="10" fontFamily="monospace">X (Ω)</text>

              {/* Reverse Zone 4 */}
              <rect x="90" y="230" width="30" height="25" fill="#3B82F6" fillOpacity="0.1" stroke="#3B82F6" strokeWidth="1" strokeDasharray="3 2" />
              <text x="50" y="250" fill="#3B82F6" fontSize="8" fontFamily="monospace">Zone 4 Inv.</text>

              {/* Zone 3 Quadrilateral (160%) */}
              <polygon points="120,230 330,230 310,50 120,50" fill="#EAB308" fillOpacity="0.08" stroke="#EAB308" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="320" y="65" fill="#EAB308" fontSize="9" fontFamily="monospace">Zone 3 (160%)</text>

              {/* Zone 2 Quadrilateral (120%) */}
              <polygon points="120,230 280,230 260,95 120,95" fill="#F97316" fillOpacity="0.12" stroke="#F97316" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="270" y="110" fill="#F97316" fontSize="9" fontFamily="monospace">Zone 2 (120%)</text>

              {/* Zone 1 Quadrilateral (85%) */}
              <polygon points="120,230 230,230 215,135 120,135" fill="#EF4444" fillOpacity="0.2" stroke="#EF4444" strokeWidth="2" />
              <text x="140" y="150" fill="#EF4444" fontSize="10" fontFamily="monospace" fontWeight="bold">Zone 1 (85%)</text>

              {/* Line Characteristic Vector Z_line (angle ~ 84 degrees) */}
              <line x1="120" y1="230" x2="245" y2="115" stroke="#38BDF8" strokeWidth="3" />
              <text x="250" y="115" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">Ligne 100%</text>

              {/* Fault Impedance Spot mapped to faultDistancePercent */}
              {/* x = 120 + (faultDistancePercent / 100) * 125, y = 230 - (faultDistancePercent / 100) * 115 */}
              {(() => {
                const fx = 120 + (faultDistancePercent / 100) * 125;
                const fy = 230 - (faultDistancePercent / 100) * 115;
                return (
                  <g>
                    <circle cx={fx} cy={fy} r="7" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx={fx} cy={fy} r="14" fill="none" stroke="#EF4444" strokeWidth="1.5" className="animate-ping" />
                    <text x={fx + 12} y={fy + 4} fill="#EF4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      Défaut ({faultDistancePercent}%)
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>
      </div>

      {/* 3. OPGW 48-Fiber Optical Allocation Plan */}
      <div className="p-5 rounded-2xl bg-[#161B22] border border-[#252E38] space-y-4 shadow-xl font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-sky-400 uppercase flex items-center gap-1.5">
            <Radio className="h-4 w-4" />
            <span>{locale === 'fr' ? 'Plan d\'Allocation des 48 Fibres Optiques OPGW (CEI 60794)' : '48-Fiber OPGW Channel Allocation Plan'}</span>
          </span>
          <span className="text-[10px] text-slate-500">
            Fibre Monomode G.652D
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {OPGW_48_FIBER_MAP.map((ch, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#0D1117] border border-[#252E38] space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold text-[10px]">
                  Paires {ch.fiber_pair}
                </span>
                <span className="text-[10px] text-slate-500">{ch.latency_us} µs</span>
              </div>
              <div className="text-white font-bold text-[11px] leading-snug">
                {ch.purpose}
              </div>
              <div className="text-slate-400 text-[10px]">
                Protocole : <span className="text-amber-300">{ch.protocol}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
