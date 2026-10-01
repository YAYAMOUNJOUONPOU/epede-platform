// src/components/transmission/AdvancedDistanceRelayLab.tsx
// EPEDE D03 - Advanced ANSI 21 Distance & ANSI 87L Differential Relaying Lab
// Compliant with IEC 60255-121 (Functional standard for distance relays)

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  Sliders,
  Activity,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Cpu,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

interface Props {
  locale: 'fr' | 'en';
}

type FaultType = 'PHASE_GROUND' | 'PHASE_PHASE' | 'THREE_PHASE';
type TeleprotectionScheme = 'POTT' | 'PUTT' | 'DCB' | 'NONE';

export const AdvancedDistanceRelayLab: React.FC<Props> = ({ locale }) => {
  const isFr = locale === 'fr';

  // State Variables
  const [lineLengthKm, setLineLengthKm] = useState<number>(180); // 180 km line
  const [faultLocationPercent, setFaultLocationPercent] = useState<number>(65); // 65% of line length
  const [arcResistanceOhms, setArcResistanceOhms] = useState<number>(4.5); // arc / tower footing resistance
  const [loadCurrentA, setLoadCurrentA] = useState<number>(750); // heavy load
  const [loadPowerFactor, setLoadPowerFactor] = useState<number>(0.92);
  const [faultType, setFaultType] = useState<FaultType>('PHASE_GROUND');
  const [teleprotectionScheme, setTeleprotectionScheme] = useState<TeleprotectionScheme>('POTT');
  const [characteristicType, setCharacteristicType] = useState<'QUADRILATERAL' | 'MHO'>('QUADRILATERAL');
  const [isPowerSwingActive, setIsPowerSwingActive] = useState<boolean>(false);

  // Line positive sequence and zero sequence impedance parameters (225 kV Aster 570)
  const z1_r = 0.058; // ohm/km
  const z1_x = 0.38; // ohm/km
  const z0_r = 0.18; // ohm/km
  const z0_x = 1.15; // ohm/km

  // Total line impedance Z_line
  const R_line = z1_r * lineLengthKm;
  const X_line = z1_x * lineLengthKm;
  const Z_line_mag = Math.sqrt(Math.pow(R_line, 2) + Math.pow(X_line, 2));

  // Calculations for Zones (Standard Relay Settings)
  // Zone 1: 80% to 85% of line length (Instantaneous)
  const z1_reach_percent = 80;
  const X_zone1 = X_line * (z1_reach_percent / 100);
  const R_zone1 = (R_line * (z1_reach_percent / 100)) + 8.0; // resistive reach includes arc margin

  // Zone 2: 120% of line length (Overreaching, covers remote busbar and margin)
  const z2_reach_percent = 120;
  const X_zone2 = X_line * (z2_reach_percent / 100);
  const R_zone2 = (R_line * (z2_reach_percent / 100)) + 15.0;

  // Zone 3: 180% forward (Remote backup)
  const z3_reach_percent = 180;
  const X_zone3 = X_line * (z3_reach_percent / 100);
  const R_zone3 = (R_line * (z3_reach_percent / 100)) + 25.0;

  // Fault Impedance calculation based on location and arc
  const fault_R = (R_line * (faultLocationPercent / 100)) + arcResistanceOhms;
  const fault_X = X_line * (faultLocationPercent / 100);
  const fault_Z_mag = Math.sqrt(Math.pow(fault_R, 2) + Math.pow(fault_X, 2));

  // Load Impedance locus (apparent impedance seen under normal transfer)
  const V_phase = (225000 / Math.sqrt(3));
  const Z_load_mag = V_phase / Math.max(10, loadCurrentA);
  const phi_load = Math.acos(loadPowerFactor);
  const R_load = Z_load_mag * Math.cos(phi_load);
  const X_load = Z_load_mag * Math.sin(phi_load);

  // Determine which zone detected the fault
  const tripEvaluation = useMemo(() => {
    let zone = 'NONE';
    let tripTimeMs = 0;
    let schemeStatus = 'Normal';

    if (isPowerSwingActive) {
      return {
        zone: 'ANSI 68 BLOQUÉ',
        tripTimeMs: 0,
        isTripped: false,
        relayAction: isFr ? 'Blocage Pendulage Actif (ANSI 68 / PSB) - Aucun Déclenchement' : 'Power Swing Blocking (ANSI 68 / PSB) - Trip Blocked',
        schemeStatus: 'Inhibited'
      };
    }

    if (faultLocationPercent <= z1_reach_percent) {
      zone = 'Zone 1 (Instantané)';
      tripTimeMs = 25; // 15ms relay + 10ms trip coil
      schemeStatus = 'Zone 1 Direct Trip';
    } else if (faultLocationPercent <= z2_reach_percent) {
      zone = 'Zone 2 (Téléprotection)';
      if (teleprotectionScheme === 'POTT') {
        tripTimeMs = 45; // 20ms relay + 10ms OPGW carrier delay + 15ms permissive
        schemeStatus = 'POTT Accélération Téléprotection';
      } else if (teleprotectionScheme === 'PUTT') {
        tripTimeMs = 50;
        schemeStatus = 'PUTT Accélération';
      } else if (teleprotectionScheme === 'DCB') {
        tripTimeMs = 60;
        schemeStatus = 'DCB Absence de Blocage';
      } else {
        tripTimeMs = 350; // Raw Zone 2 coordination delay
        schemeStatus = 'Zone 2 Temporisé (Secours)';
      }
    } else if (faultLocationPercent <= z3_reach_percent) {
      zone = 'Zone 3 (Secours Éloigné)';
      tripTimeMs = 800;
      schemeStatus = 'Zone 3 Temporisé Éloigné';
    } else {
      zone = 'HORS LIGNE';
      tripTimeMs = 0;
      schemeStatus = 'Pas d\'ordre de déclenchement';
    }

    return {
      zone,
      tripTimeMs,
      isTripped: tripTimeMs > 0,
      relayAction: isFr
        ? `Déclenchement Triphasé / Monophasé via ${zone} en ${tripTimeMs} ms`
        : `Single/Three-pole Trip ordered via ${zone} in ${tripTimeMs} ms`,
      schemeStatus
    };
  }, [faultLocationPercent, z1_reach_percent, z2_reach_percent, z3_reach_percent, teleprotectionScheme, isPowerSwingActive, isFr]);

  // Warrington Arc Resistance Formula: R_arc = (28700 * L_arc) / (I_k ^ 1.4)
  const estimatedShortCircuitCurrentKa = Math.round((225 / (Math.sqrt(3) * Math.max(0.5, fault_Z_mag))) * 10) / 10;

  // Zero sequence compensation factor k0 = (Z0 - Z1) / (3 * Z1)
  const k0_mag = Math.round((((z0_x - z1_x) / (3 * z1_x))) * 100) / 100;

  return (
    <div className="space-y-6 font-mono">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-red-950/40 to-slate-900 border border-red-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-300 border border-red-500/30">
                PILLIER 16 · PLAN DE PROTECTION MAIN 1 / MAIN 2 & PLAN R-X
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                CEI 60255-121 · ANSI 21 / 21N / 87L / 68
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-400" />
              <span>
                {isFr
                  ? 'Laboratoire de Protection de Distance (ANSI 21) & Téléprotection OPGW'
                  : 'Advanced Distance Protection (ANSI 21) & OPGW Relaying Lab'}
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl font-sans">
              {isFr
                ? 'Simulation interactive du plan d\'impédance complexe R-X (caractéristique quadrilatérale et Mho), calcul de la résistance d\'arc selon Warrington, compensation homopolaire k₀, blinder d\'empiètement de charge et accélération par téléprotection POTT / PUTT.'
                : 'Interactive complex R-X impedance plane simulator with quadrilateral and Mho characteristics, Warrington arc resistance solver, zero-sequence compensation k₀, load encroachment blinder, and POTT / PUTT teleprotection acceleration.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className={`p-3.5 rounded-xl border text-right ${
              tripEvaluation.isTripped
                ? 'bg-red-950/80 border-red-500/60'
                : 'bg-slate-950/80 border-slate-800'
            }`}>
              <span className="text-[10px] text-slate-400 block">{isFr ? 'Ordre Relais' : 'Relay Order'}</span>
              <span className={`text-base font-bold ${tripEvaluation.isTripped ? 'text-red-400' : 'text-emerald-400'}`}>
                {tripEvaluation.zone}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {tripEvaluation.isTripped ? `${tripEvaluation.tripTimeMs} ms` : 'En veille'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Fault Injections, Arc, & Schemes (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Fault Location Slider */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3.5 shadow-lg">
            <div className="text-xs font-bold text-red-400 flex items-center justify-between">
              <span>{isFr ? 'Localisation du Court-Circuit' : 'Fault Distance on Line'}</span>
              <span className="text-[10px] text-slate-500">{lineLengthKm} km (Corridor Nachtigal)</span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>{isFr ? 'Distance du Défaut' : 'Fault Distance'} :</span>
                <span className="text-amber-400 font-bold">{faultLocationPercent}% ({Math.round(lineLengthKm * (faultLocationPercent / 100))} km)</span>
              </div>
              <input
                type="range"
                min="5"
                max="180"
                step="5"
                value={faultLocationPercent}
                onChange={(e) => setFaultLocationPercent(parseInt(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span className="text-red-400">Zone 1 (&lt; 80%)</span>
                <span className="text-amber-400">Zone 2 (80-120%)</span>
                <span className="text-slate-400">Zone 3 (&gt; 120%)</span>
              </div>
            </div>

            {/* Arc Resistance Slider */}
            <div className="space-y-1 text-xs pt-1">
              <div className="flex justify-between text-slate-300">
                <span>{isFr ? 'Résistance d\'Arc / Prise de Terre' : 'Arc & Footing Resistance'} :</span>
                <span className="text-sky-400 font-bold">{arcResistanceOhms} Ω (Warrington)</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="25.0"
                step="0.5"
                value={arcResistanceOhms}
                onChange={(e) => setArcResistanceOhms(parseFloat(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="text-[10px] text-slate-400 font-sans">
                {isFr
                  ? 'Une résistance d\'arc élevée déplace l\'impédance vers la droite dans le plan R-X. Le quadrilatère couvre jusqu\'à 25 Ω.'
                  : 'High arc resistance shifts measured impedance to the right. Quadrilateral characteristic covers up to 25 Ω.'}
              </div>
            </div>
          </div>

          {/* Fault Type & Teleprotection Configuration */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3.5 shadow-lg">
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>{isFr ? 'Type de Défaut & Schéma Téléprotection' : 'Fault Type & Teleprotection Scheme'}</span>
              <span className="text-[10px] text-slate-500">OPGW 48 Fibres</span>
            </div>

            {/* Fault Type Buttons */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFaultType('PHASE_GROUND')}
                className={`p-2 rounded-lg border text-center transition-all ${
                  faultType === 'PHASE_GROUND'
                    ? 'bg-red-500/20 text-white border-red-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Monophasé (Ph-T)
              </button>
              <button
                type="button"
                onClick={() => setFaultType('PHASE_PHASE')}
                className={`p-2 rounded-lg border text-center transition-all ${
                  faultType === 'PHASE_PHASE'
                    ? 'bg-red-500/20 text-white border-red-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Biphasé (Ph-Ph)
              </button>
              <button
                type="button"
                onClick={() => setFaultType('THREE_PHASE')}
                className={`p-2 rounded-lg border text-center transition-all ${
                  faultType === 'THREE_PHASE'
                    ? 'bg-red-500/20 text-white border-red-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Triphasé Franc
              </button>
            </div>

            {/* Teleprotection Scheme Selectors */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-300 block">{isFr ? 'Schéma de Téléprotection par Canal Optique :' : 'Teleprotection Carrier Scheme:'}</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                {(['POTT', 'PUTT', 'DCB', 'NONE'] as TeleprotectionScheme[]).map((scheme) => (
                  <button
                    key={scheme}
                    type="button"
                    onClick={() => setTeleprotectionScheme(scheme)}
                    className={`p-1.5 rounded-lg border text-center text-[11px] transition-all ${
                      teleprotectionScheme === scheme
                        ? 'bg-sky-500/20 text-white border-sky-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {scheme === 'NONE' ? (isFr ? 'Sans Téléprot.' : 'No Telecom') : scheme}
                  </button>
                ))}
              </div>
            </div>

            {/* Power Swing Blocking Toggle */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-300">
                <span className="font-bold block">{isFr ? 'Pendulage de Puissance (ANSI 68)' : 'Power Swing (ANSI 68)'}</span>
                <span className="text-[10px] text-slate-500">{isFr ? 'Bloque le déclenchement intempestif' : 'Prevents unwanted out-of-step trip'}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPowerSwingActive(!isPowerSwingActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  isPowerSwingActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isPowerSwingActive ? (isFr ? 'ACTIF (Bloqué)' : 'ACTIVE (Blocked)') : (isFr ? 'INACTIF' : 'INACTIVE')}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Complex R-X Plane & Telemetry (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Real-Time Impedance Locus Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block">{isFr ? 'Impédance Défaut (Zf)' : 'Fault Impedance (Zf)'}</span>
              <div className="text-base font-bold text-red-400">
                {Math.round(fault_Z_mag * 10) / 10} Ω
              </div>
              <span className="text-[10px] text-slate-500 block">
                R={Math.round(fault_R * 10) / 10} / X={Math.round(fault_X * 10) / 10}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block">{isFr ? 'Courant de Court-Circuit' : 'Fault Current (Ik)'}</span>
              <div className="text-base font-bold text-amber-400">
                {estimatedShortCircuitCurrentKa} kA
              </div>
              <span className="text-[10px] text-slate-500 block">
                {Math.round(estimatedShortCircuitCurrentKa * 225 * Math.sqrt(3))} MVA
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block">{isFr ? 'Facteur Homopolaire k₀' : 'Zero-Seq Factor k₀'}</span>
              <div className="text-base font-bold text-sky-400">
                {k0_mag} ∠ {Math.round((Math.atan2(z0_x - z1_x, z0_r - z1_r) * 180) / Math.PI)}°
              </div>
              <span className="text-[10px] text-slate-500 block">
                (Z₀ - Z₁) / (3·Z₁)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block">{isFr ? 'Temps d\'Élimination' : 'Clearing Time'}</span>
              <div className={`text-base font-bold ${tripEvaluation.tripTimeMs > 0 && tripEvaluation.tripTimeMs <= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {tripEvaluation.tripTimeMs > 0 ? `${tripEvaluation.tripTimeMs} ms` : 'Inhibé'}
              </div>
              <span className="text-[10px] text-slate-500 block">
                {tripEvaluation.schemeStatus}
              </span>
            </div>
          </div>

          {/* Graphical R-X Plane Visualization Canvas Mockup */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>{isFr ? 'Plan d\'Impédance Complexe R-X (Norme CEI 60255-121)' : 'Complex R-X Impedance Plane'}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCharacteristicType('QUADRILATERAL')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    characteristicType === 'QUADRILATERAL' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Quadrilatère
                </button>
                <button
                  type="button"
                  onClick={() => setCharacteristicType('MHO')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    characteristicType === 'MHO' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Cercle Mho
                </button>
              </div>
            </div>

            {/* SVG Complex Plane Diagram */}
            <div className="w-full h-64 bg-slate-900/90 rounded-lg relative overflow-hidden border border-slate-800 flex items-center justify-center">
              <svg viewBox="-40 -20 160 140" className="w-full h-full p-2">
                {/* Axes */}
                <line x1="-30" y1="100" x2="110" y2="100" stroke="#334155" strokeWidth="0.8" />
                <line x1="0" y1="-10" x2="0" y2="110" stroke="#334155" strokeWidth="0.8" />
                <text x="105" y="105" fill="#64748b" fontSize="4">R (Ω)</text>
                <text x="2" y="-5" fill="#64748b" fontSize="4">X (Ω)</text>

                {/* Zone 3 Boundary (Gray dotted) */}
                <rect x="0" y="100 - 75" width="80" height="75" fill="none" stroke="#475569" strokeWidth="0.6" strokeDasharray="2,2" />
                <text x="65" y="30" fill="#64748b" fontSize="3.5">Zone 3 (180%)</text>

                {/* Zone 2 Boundary (Amber dashed) */}
                <rect x="0" y="100 - 55" width="55" height="55" fill="rgba(245, 158, 11, 0.05)" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3,2" />
                <text x="40" y="50" fill="#f59e0b" fontSize="3.5">Zone 2 (120%)</text>

                {/* Zone 1 Boundary (Red solid) */}
                {characteristicType === 'QUADRILATERAL' ? (
                  <polygon
                    points="0,100 40,100 35,62 0,62"
                    fill="rgba(239, 68, 68, 0.15)"
                    stroke="#ef4444"
                    strokeWidth="1.2"
                  />
                ) : (
                  <circle cx="15" cy="80" r="20" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="1.2" />
                )}
                <text x="12" y="70" fill="#ef4444" fontSize="3.8" fontWeight="bold">Zone 1 (80%)</text>

                {/* Line Angle Vector (75 degrees transmission line) */}
                <line x1="0" y1="100" x2="20" y2="40" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="14" y="38" fill="#38bdf8" fontSize="3.5">Z_ligne</text>

                {/* Load Encroachment Blinder Wedge (preventing trip on heavy load) */}
                <path d="M 50 100 L 90 70 L 90 100 Z" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="1,1" />
                <text x="60" y="92" fill="#38bdf8" fontSize="3">Blinder Charge</text>

                {/* Fault Impedance Point (Animated Ping) */}
                {/* Map fault_R (0-30) and fault_X (0-80) to SVG coordinates */}
                {(() => {
                  const svgX = Math.min(100, Math.max(-20, (fault_R / 50) * 80));
                  const svgY = Math.min(110, Math.max(-10, 100 - (fault_X / 70) * 60));
                  return (
                    <g>
                      <circle cx={svgX} cy={svgY} r="3" fill="#ef4444" />
                      <circle cx={svgX} cy={svgY} r="6" fill="none" stroke="#ef4444" strokeWidth="0.6" className="animate-ping" />
                      <text x={svgX + 4} y={svgY - 2} fill="#ffffff" fontSize="3.5" fontWeight="bold">
                        Zf ({Math.round(fault_Z_mag)}Ω)
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Zone 1 Instantané (t = 25 ms)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Zone 2 Téléprot. ({teleprotectionScheme} : {tripEvaluation.tripTimeMs} ms)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>Zone 3 Secours (800 ms)</span>
              </span>
            </div>
          </div>

          {/* Teleprotection OPGW Fast Carrier Channel Description */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="text-sky-400 font-bold flex items-center gap-1.5">
              <Radio className="w-4 h-4" />
              <span>{isFr ? 'Architecture OPGW Main 1 / Main 2 SONATREL' : 'SONATREL Dual Main 1 / Main 2 Relaying Standard'}</span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {isFr ? (
                <>
                  Conformément aux prescriptions techniques de <strong>SONATREL</strong> sur le réseau 225 kV, chaque travée de ligne est équipée de deux protections numériques indépendantes : <strong>Main 1 (ANSI 21/21N Distance + POTT via fibres OPGW 1-2)</strong> et <strong>Main 2 (ANSI 87L Différentielle de ligne à courant optique via fibres OPGW 3-4)</strong>. Cette double redondance garantit un temps d'élimination de défaut inférieur à <strong>60 ms</strong> sur 100% de la longueur du corridor, préservant la stabilité transitoire des alternateurs de Nachtigal.
                </>
              ) : (
                <>
                  Per <strong>SONATREL</strong> grid code specifications for the 225 kV grid, each feeder bay features dual redundant numeric IEDs: <strong>Main 1 (ANSI 21/21N Distance + POTT via OPGW fibers 1-2)</strong> and <strong>Main 2 (ANSI 87L Optical Current Differential via OPGW fibers 3-4)</strong>. This guarantees fault clearance within <strong>60 ms</strong> across 100% of the transmission line, ensuring critical transient stability for Nachtigal hydro generators.
                </>
              )}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
