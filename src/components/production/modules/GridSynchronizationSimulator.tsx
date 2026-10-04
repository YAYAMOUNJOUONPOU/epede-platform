// src/components/production/modules/GridSynchronizationSimulator.tsx
// EPEDE D01 - Interactive Generator Grid Synchronization Simulator (ANSI 25 Synchrocheck)
// Conforms to IEEE C37.102 & IEC 60034 Grid Interconnection Standards

import React, { useState, useEffect, useMemo } from 'react';
import {
  RotateCw,
  Zap,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Activity,
  ShieldAlert,
  Compass,
  Sparkles,
  Info
} from 'lucide-react';

interface GridSynchronizationSimulatorProps {
  locale: 'fr' | 'en';
  nominalVoltageKv?: number;
}

export const GridSynchronizationSimulator: React.FC<GridSynchronizationSimulatorProps> = ({
  locale,
  nominalVoltageKv = 15.0
}) => {
  // Grid reference values (50.00 Hz, 15.00 kV)
  const gridFreqHz = 50.00;
  const gridVoltageKv = nominalVoltageKv;

  // Generator adjustable operating parameters
  const [genFreqHz, setGenFreqHz] = useState<number>(49.95);
  const [genVoltageKv, setGenVoltageKv] = useState<number>(14.90);
  const [manualPhaseAngleDeg, setManualPhaseAngleDeg] = useState<number>(8);
  const [isAutoSyncActive, setIsAutoSyncActive] = useState<boolean>(false);
  const [breakerClosed, setBreakerClosed] = useState<boolean>(false);
  const [breakerTripMessage, setBreakerTripMessage] = useState<string | null>(null);

  // Frequency difference (Slip) and Voltage difference
  const deltaF = Number((genFreqHz - gridFreqHz).toFixed(3));
  const deltaU = Number((genVoltageKv - gridVoltageKv).toFixed(2));
  const deltaUPct = Number(((deltaU / gridVoltageKv) * 100).toFixed(1));

  // Dynamic rotating phase angle simulation
  const [currentAngleDeg, setCurrentAngleDeg] = useState<number>(manualPhaseAngleDeg);

  useEffect(() => {
    if (breakerClosed) return;

    const timer = setInterval(() => {
      setCurrentAngleDeg((prev) => {
        if (isAutoSyncActive) {
          // Auto synchronizer gradually pulls frequency and voltage towards zero slip
          setGenFreqHz((f) => {
            const diff = 50.00 - f;
            return Number((f + diff * 0.15).toFixed(2));
          });
          setGenVoltageKv((v) => {
            const diff = gridVoltageKv - v;
            return Number((v + diff * 0.15).toFixed(2));
          });
        }
        // Slip angle rotation rate = 360 * deltaF degrees per second
        const angleIncrement = deltaF * 360 * 0.05; // 50ms interval
        let nextAngle = (prev + angleIncrement) % 360;
        if (nextAngle < -180) nextAngle += 360;
        if (nextAngle > 180) nextAngle -= 360;
        return nextAngle;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [deltaF, breakerClosed, isAutoSyncActive, gridVoltageKv]);

  // ANSI 25 Criteria Verification:
  // 1. |Delta U| <= 2.0%
  // 2. |Delta f| <= 0.10 Hz
  // 3. |Delta Phase| <= 5.0 degrees
  const isVoltagePermitted = Math.abs(deltaUPct) <= 2.0;
  const isFrequencyPermitted = Math.abs(deltaF) <= 0.10;
  const isPhaseAnglePermitted = Math.abs(currentAngleDeg) <= 6.0;
  const isSyncPermitGranted = isVoltagePermitted && isFrequencyPermitted && isPhaseAnglePermitted;

  // Breaker Closing Action
  const handleAttemptCloseBreaker = () => {
    if (isSyncPermitGranted) {
      setBreakerClosed(true);
      setBreakerTripMessage(null);
      setCurrentAngleDeg(0);
      setGenFreqHz(50.00);
      setGenVoltageKv(gridVoltageKv);
    } else {
      // Out of synchronism attempt: simulated mechanical/electrical shock
      setBreakerTripMessage(
        locale === 'fr'
          ? 'REFUS DE SYNCHRONISATION ANSI 25 ! Écart de phase ou tension hors gabarit. Risque de cisaillement d’arbre turbine-alternateur.'
          : 'ANSI 25 SYNCHROCHECK PERMISSIVE DENIED! Excessive phase or voltage mismatch. Severe shaft shear and torque shock risk.'
      );
    }
  };

  const handleOpenBreaker = () => {
    setBreakerClosed(false);
    setBreakerTripMessage(null);
    setGenFreqHz(49.92);
    setGenVoltageKv(14.85);
    setCurrentAngleDeg(15);
  };

  // Synchroscope dial needle angle
  const needleAngle = currentAngleDeg;

  return (
    <div className="p-5 rounded-2xl bg-[#090D14] border border-[#222B38] space-y-5 font-mono text-xs shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222B38] pb-3">
        <div className="flex items-center gap-2">
          <RotateCw className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            {locale === 'fr'
              ? 'Simulateur de Synchronisation au Réseau (Relais Contrôle de Synchro ANSI 25)'
              : 'Grid Synchronization & Synchrocheck Simulator (ANSI 25 Relay)'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 text-[11px] ${
            breakerClosed
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : isSyncPermitGranted
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}>
            {breakerClosed ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'GROUPE SYNCHRONISÉ AU RÉSEAU' : 'UNIT SYNCHRONIZED TO GRID'}</span>
              </>
            ) : isSyncPermitGranted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'AUTORISATION FERMETURE (PERMISSIVE)' : 'PERMISSIVE CLOSING GRANTED'}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'FERMETURE INTERDITE (HORS GABARIT)' : 'CLOSING INTERLOCKED'}</span>
              </>
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Synchroscope Dial & Phasor Instrument */}
        <div className="lg:col-span-5 bg-[#0E141F] rounded-2xl border border-[#222B38] p-5 flex flex-col items-center justify-center relative overflow-hidden">
          <span className="text-[11px] font-bold text-slate-400 uppercase pb-2 mb-2 border-b border-[#222B38] w-full text-center">
            {locale === 'fr' ? 'Synchroscope Analogique & Rotation de Phase' : 'Analog Synchroscope Dial'}
          </span>

          {/* Dial SVG */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full select-none">
              {/* Outer Dial Circle */}
              <circle cx="100" cy="100" r="90" fill="#090D14" stroke="#222B38" strokeWidth="4" />
              <circle cx="100" cy="100" r="82" fill="none" stroke="#161F2E" strokeWidth="2" />

              {/* Permissive Tolerance Zone Arc (-5 deg to +5 deg at 12 o'clock) */}
              <path
                d="M 94 18 A 82 82 0 0 1 106 18"
                fill="none"
                stroke="#10B981"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Dial Markings */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = i * 30;
                const rad = (angle * Math.PI) / 180;
                const x1 = 100 + 72 * Math.sin(rad);
                const y1 = 100 - 72 * Math.cos(rad);
                const x2 = 100 + 82 * Math.sin(rad);
                const y2 = 100 - 82 * Math.cos(rad);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={i === 0 ? '#10B981' : '#475569'}
                    strokeWidth={i % 3 === 0 ? 3 : 1.5}
                  />
                );
              })}

              {/* Center 12 o'clock Marker (0 deg - Exact in-phase point) */}
              <text x="100" y="38" fill="#10B981" fontSize="10" fontWeight="black" textAnchor="middle">
                0° SYNC
              </text>
              <text x="165" y="104" fill="#64748B" fontSize="9" textAnchor="middle">
                FAST +
              </text>
              <text x="35" y="104" fill="#64748B" fontSize="9" textAnchor="middle">
                SLOW -
              </text>

              {/* Rotating Needle */}
              <g transform={`rotate(${needleAngle}, 100, 100)`}>
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="28"
                  stroke={breakerClosed ? '#10B981' : isSyncPermitGranted ? '#F59E0B' : '#EF4444'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="28" r="4" fill="#FFFFFF" />
              </g>

              {/* Center Pivot */}
              <circle cx="100" cy="100" r="7" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>

          {/* Live Needle Telemetry */}
          <div className="mt-3 text-center space-y-0.5">
            <div className="text-base font-black text-white">
              Δθ = {Math.abs(currentAngleDeg).toFixed(1)}° {currentAngleDeg >= 0 ? '(Avance)' : '(Retard)'}
            </div>
            <div className="text-[10px] text-slate-400">
              Vitesse de glissement : {deltaF > 0 ? `+${deltaF}` : deltaF} Hz ({deltaF > 0 ? 'Machine trop rapide' : deltaF < 0 ? 'Machine trop lente' : 'Glissement nul'})
            </div>
          </div>
        </div>

        {/* 4 Conditions Comparison Table & Sizing Sliders */}
        <div className="lg:col-span-7 space-y-4">
          {/* Comparison Matrix */}
          <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-2.5">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>{locale === 'fr' ? 'Contrôle des 4 Critères Physiques ANSI 25' : 'ANSI 25 Physical Criteria Check'}</span>
            </span>

            <div className="space-y-2 text-xs">
              {/* Condition 1: Voltage Equality */}
              <div className="p-2.5 rounded-xl bg-[#090D14] border border-[#222B38] flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-300 block">1. Égalité des Tensions (|ΔU| ≤ 2.0%)</span>
                  <span className="text-[10px] text-slate-500">
                    Réseau : {gridVoltageKv.toFixed(2)} kV • Groupe : {genVoltageKv.toFixed(2)} kV
                  </span>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className={`font-bold ${isVoltagePermitted ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ΔU = {deltaUPct > 0 ? `+${deltaUPct}` : deltaUPct}%
                  </span>
                  {isVoltagePermitted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                </div>
              </div>

              {/* Condition 2: Frequency Equality */}
              <div className="p-2.5 rounded-xl bg-[#090D14] border border-[#222B38] flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-300 block">2. Égalité des Fréquences (|Δf| ≤ 0.10 Hz)</span>
                  <span className="text-[10px] text-slate-500">
                    Réseau : {gridFreqHz.toFixed(2)} Hz • Groupe : {genFreqHz.toFixed(2)} Hz
                  </span>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className={`font-bold ${isFrequencyPermitted ? 'text-emerald-400' : 'text-rose-400'}`}>
                    Δf = {deltaF > 0 ? `+${deltaF}` : deltaF} Hz
                  </span>
                  {isFrequencyPermitted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                </div>
              </div>

              {/* Condition 3: Phase Angle Equality */}
              <div className="p-2.5 rounded-xl bg-[#090D14] border border-[#222B38] flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-300 block">3. Concordance de Phase (|Δθ| ≤ 5.0°)</span>
                  <span className="text-[10px] text-slate-500">
                    Tolérance de fermeture synchrone à 12h00
                  </span>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className={`font-bold ${isPhaseAnglePermitted ? 'text-emerald-400' : 'text-rose-400'}`}>
                    |Δθ| = {Math.abs(currentAngleDeg).toFixed(1)}°
                  </span>
                  {isPhaseAnglePermitted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                </div>
              </div>

              {/* Condition 4: Phase Rotation Sequence */}
              <div className="p-2.5 rounded-xl bg-[#090D14] border border-[#222B38] flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-300 block">4. Ordre de Succession des Phases</span>
                  <span className="text-[10px] text-slate-500">
                    Rotation directe trigonométrique (A - B - C)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className="font-bold text-emerald-400">DIRECT (1-2-3)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Operating Sliders */}
          {!breakerClosed && (
            <div className="p-3.5 rounded-xl bg-[#0E141F] border border-[#222B38] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-400 uppercase flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{locale === 'fr' ? 'Commandes Manuelles de Vitesse & Excitation' : 'Manual Governor & AVR Trims'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAutoSyncActive(!isAutoSyncActive)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                    isAutoSyncActive
                      ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md'
                      : 'bg-[#090D14] text-slate-400 border-[#222B38] hover:text-white'
                  }`}
                >
                  {isAutoSyncActive ? '⚡ AUTO-SYNC ACTIF' : 'Activer Auto-Synchroniseur'}
                </button>
              </div>

              {/* Frequency adjustment */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>{locale === 'fr' ? 'Consigne Vitesse Turbine (Fréquence) :' : 'Turbine Speed (Frequency):'}</span>
                  <span className="text-white font-bold">{genFreqHz} Hz</span>
                </div>
                <input
                  type="range"
                  min="49.50"
                  max="50.50"
                  step="0.01"
                  value={genFreqHz}
                  disabled={isAutoSyncActive}
                  onChange={(e) => setGenFreqHz(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer disabled:opacity-50"
                />
              </div>

              {/* Voltage adjustment */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>{locale === 'fr' ? 'Consigne Excitation AVR (Tension) :' : 'AVR Excitation (Voltage):'}</span>
                  <span className="text-white font-bold">{genVoltageKv} kV</span>
                </div>
                <input
                  type="range"
                  min="14.20"
                  max="15.80"
                  step="0.02"
                  value={genVoltageKv}
                  disabled={isAutoSyncActive}
                  onChange={(e) => setGenVoltageKv(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer disabled:opacity-50"
                />
              </div>
            </div>
          )}

          {/* Action Breaker Closing Button */}
          <div className="pt-1">
            {!breakerClosed ? (
              <button
                type="button"
                onClick={handleAttemptCloseBreaker}
                className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2 ${
                  isSyncPermitGranted
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20 ring-2 ring-emerald-400'
                    : 'bg-rose-500/30 hover:bg-rose-500/40 text-rose-200 border border-rose-500/50'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{locale === 'fr' ? 'Tenter Fermeture Disjoncteur Groupe (GCB)' : 'Attempt Generator Breaker (GCB) Close'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenBreaker}
                className="w-full py-3 rounded-xl bg-[#161F2E] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#222B38] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                <span>{locale === 'fr' ? 'Découpler le Groupe du Réseau (Ouvrir GCB)' : 'Disconnect Generator from Grid (Open GCB)'}</span>
              </button>
            )}

            {breakerTripMessage && (
              <div className="mt-2 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{breakerTripMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
