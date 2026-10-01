// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 8 : PROTECTIONS ÉLECTRIQUES & STABILITÉ RÉSEAU
// IEEE C37.102 / IEC 60255 Relaying, Generator P-Q Capability, AVR/PSS, Grid Code
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Zap,
  Activity,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sliders,
  Play,
  RotateCcw,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  ANSI_PROTECTION_SCHEMES,
  SIMULATED_FAULTS,
  calculateGeneratorCapability,
  CAMEROON_RIS_GRID_CODE_CHECKS,
} from '../../data/hydropowerGridSafetyData';
import type {
  AnsiProtectionCode,
  SimulatedElectricalFault,
} from '../../types/hydropowerGridSafety';

interface HydropowerProtectionGridViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
}

export const HydropowerProtectionGridView: React.FC<HydropowerProtectionGridViewProps> = ({
  locale,
  onNavigateStandard,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'capability' | 'excitation' | 'gridcode'>('matrix');

  // Matrix Fault Simulator State
  const [selectedFaultId, setSelectedFaultId] = useState<SimulatedElectricalFault>('stator_interturn_short');
  const [selectedAnsiCode, setSelectedAnsiCode] = useState<AnsiProtectionCode>('87G');

  // Capability Curve State
  const [activePowerMW, setActivePowerMW] = useState<number>(70.0); // Nachtigal 70 MW rated
  const [reactivePowerMVAR, setReactivePowerMVAR] = useState<number>(25.0);
  const [generatorMVA] = useState<number>(82.35); // 70 MW / 0.85 cos phi

  // AVR / PSS Step Response Simulator State
  const [gridVoltageDipPercent, setGridVoltageDipPercent] = useState<number>(10);
  const [isPssActive, setIsPssActive] = useState<boolean>(true);

  // Computed Capability Point
  const capabilityPoint = useMemo(() => {
    return calculateGeneratorCapability(activePowerMW, reactivePowerMVAR, generatorMVA);
  }, [activePowerMW, reactivePowerMVAR, generatorMVA]);

  const activeFault = SIMULATED_FAULTS[selectedFaultId];
  const activeAnsiScheme = ANSI_PROTECTION_SCHEMES.find((s) => s.code === selectedAnsiCode) || ANSI_PROTECTION_SCHEMES[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0C121E] via-[#0E1626] to-[#0A0F1D] border border-cyan-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest">
                {locale === 'fr' ? 'ÉTAPE 8 • GÉNIE ÉLECTRIQUE & RÉSEAU' : 'STEP 8 • ELECTRICAL & GRID INTEGRATION'}
              </span>
              <span className="text-xs font-mono text-neutral-400">IEEE C37.102 / IEC 60255</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <Zap className="h-6 w-6 text-cyan-400" />
              <span>
                {locale === 'fr'
                  ? 'Protections Alternateur-Transformateur & Stabilité Réseau'
                  : 'Generator-Transformer Protection & Grid Code Lab'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Ingénierie de relayage numérique différentiel (87G/87T), impédance R-X (40/78), diagramme de capabilité P-Q temps réel, régulation d\'excitation AVR/PSS2B et conformité au Code de Réseau RIS (SONATREL).'
                : 'Numerical differential relaying (87G/87T), R-X plane impedance (40/78), real-time P-Q capability envelope, AVR/PSS2B damping control, and Cameroon Southern Grid (RIS) Code compliance.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('IEEE-C37.102')}
                className="px-3 py-2 rounded-xl bg-[#141E2C] hover:bg-[#1C2B3E] border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>IEEE C37.102</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#1C2634]">
          <button
            type="button"
            onClick={() => setActiveSubTab('matrix')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'matrix'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-[#141E2C] text-neutral-300 hover:text-white border border-[#253244]'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Matrice ANSI & Défauts (87G/40/78)' : '1. ANSI Protection & Fault Lab'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('capability')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'capability'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-[#141E2C] text-neutral-300 hover:text-white border border-[#253244]'
            }`}
          >
            <Gauge className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. Courbe de Capabilité P-Q' : '2. P-Q Capability Envelope'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('excitation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'excitation'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-[#141E2C] text-neutral-300 hover:text-white border border-[#253244]'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Excitation AVR & PSS2B' : '3. AVR & PSS2B Stabilizer'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('gridcode')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'gridcode'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-[#141E2C] text-neutral-300 hover:text-white border border-[#253244]'
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>{locale === 'fr' ? '4. Code Réseau RIS & Black Start' : '4. Grid Code & Black Start'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: ANSI PROTECTION MATRIX & FAULT SIMULATOR                   */}
      {/* ==================================================================== */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-6">
          {/* Fault Scenario Selector */}
          <div className="p-4 rounded-xl border border-[#252E38] bg-[#0A0E14] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-neutral-300 uppercase">
                {locale === 'fr' ? 'Scénario de Défaut Électrique Simulé :' : 'Simulated Electrical Fault Case:'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {Object.keys(SIMULATED_FAULTS).map((key) => {
                const fault = SIMULATED_FAULTS[key as SimulatedElectricalFault];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedFaultId(key as SimulatedElectricalFault)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedFaultId === key
                        ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-sm'
                        : 'bg-[#141A23] text-neutral-400 border border-[#252E38] hover:text-white'
                    }`}
                  >
                    {fault.faultName[locale]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: 10 ANSI Relaying Schemes Grid (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? 'Tableau des Fonctions de Protection ANSI' : 'ANSI Protection Relaying Matrix'}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-neutral-500">10 CODES ACTIFS</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {ANSI_PROTECTION_SCHEMES.map((scheme) => {
                    const isPrimary = activeFault.primaryTrippedRelays.includes(scheme.code);
                    const isBackup = activeFault.backupTrippedRelays.includes(scheme.code);
                    const isSelected = selectedAnsiCode === scheme.code;

                    return (
                      <button
                        key={scheme.code}
                        type="button"
                        onClick={() => setSelectedAnsiCode(scheme.code)}
                        className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-950/30'
                            : 'border-[#252E38] bg-[#141A23] hover:bg-[#1A2330]'
                        }`}
                      >
                        {isPrimary && (
                          <span className="absolute top-1.5 right-1.5 px-1 py-0.2 rounded bg-red-500 text-white text-[8px] font-black font-mono animate-pulse">
                            TRIP
                          </span>
                        )}
                        {isBackup && (
                          <span className="absolute top-1.5 right-1.5 px-1 py-0.2 rounded bg-amber-500 text-slate-950 text-[8px] font-black font-mono">
                            BCK
                          </span>
                        )}
                        <div className="text-base font-black font-mono" style={{ color: scheme.ansiColor }}>
                          {scheme.code}
                        </div>
                        <div className="text-[10px] font-bold text-neutral-200 mt-1 line-clamp-1">
                          {scheme.name[locale]}
                        </div>
                        <div className="text-[9px] font-mono text-neutral-400 mt-0.5">
                          {scheme.tripTimeMs} ms
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Relay Detail Card */}
                <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                        ANSI {activeAnsiScheme.code}
                      </span>
                      <span className="font-bold text-white">{activeAnsiScheme.name[locale]}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400">{activeAnsiScheme.standardRef}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded-lg bg-[#0A0E14] border border-[#252E38]">
                      <span className="text-neutral-400 block text-[9px] uppercase">{locale === 'fr' ? 'Réglage Déclenchement :' : 'Pickup Setting:'}</span>
                      <span className="text-amber-300 font-bold">{activeAnsiScheme.pickupSetting}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#0A0E14] border border-[#252E38]">
                      <span className="text-neutral-400 block text-[9px] uppercase">{locale === 'fr' ? 'Temporisation Sélective :' : 'Time Delay:'}</span>
                      <span className="text-cyan-300 font-bold">{activeAnsiScheme.tripTimeMs} ms ({activeAnsiScheme.tripTimeMs === 0 ? 'Instantané' : 'Coordination sélective'})</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-300">
                    <span className="text-neutral-400 block text-[9px] uppercase">{locale === 'fr' ? 'Action de Commande (Disjoncteurs) :' : 'Trip Logic Action:'}</span>
                    {activeAnsiScheme.relayAction[locale]}
                  </div>

                  <div className="text-[11px] text-emerald-300">
                    <span className="text-neutral-400 block text-[9px] uppercase">{locale === 'fr' ? 'Risque Majeur Évité :' : 'Damage Mitigated:'}</span>
                    {activeAnsiScheme.riskMitigated[locale]}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sequence of Events (SOE) Flight Recorder (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                    <Activity className="h-4 w-4 text-red-400" />
                    <span>{locale === 'fr' ? 'Chronologie des Événements (SOE - ms)' : 'Sequence of Events (SOE - ms)'}</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                    {activeFault.clearingTimeMs} ms TRIP
                  </span>
                </div>

                <div className="space-y-2">
                  {activeFault.sequenceOfEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex items-start gap-2.5 text-xs font-mono"
                    >
                      <div className="px-1.5 py-0.5 rounded bg-[#0A0E14] border border-[#252E38] text-[10px] text-cyan-300 font-bold shrink-0">
                        t+{evt.timeMs}ms
                      </div>
                      <div className="text-neutral-300 text-[11px] leading-snug">
                        {evt.description[locale]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Post Fault Diagnosis */}
                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] uppercase mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{locale === 'fr' ? 'État Post-Défaut des Équipements' : 'Post-Fault Equipment Integrity'}</span>
                  </div>
                  <p className="text-[11px] text-neutral-200">
                    {activeFault.postFaultEquipmentStatus[locale]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: GENERATOR P-Q CAPABILITY CURVE (IEEE C37.102)             */}
      {/* ==================================================================== */}
      {activeSubTab === 'capability' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SVG P-Q Vectorial Diagram (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? 'Diagramme de Capabilité P-Q Alternateur' : 'Generator P-Q Capability Chart'}</span>
                  </h3>
                  <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                    Groupe Nachtigal 70 MW / 82.35 MVA | 13.8 kV | cos φ = 0.85 | Xd = 0.95 pu
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActivePowerMW(70.0);
                    setReactivePowerMVAR(25.0);
                  }}
                  className="px-2.5 py-1 rounded bg-[#141A23] border border-[#252E38] text-[10px] font-mono text-neutral-300 hover:text-cyan-300 flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Nominal</span>
                </button>
              </div>

              {/* Vectorial SVG P-Q Chart */}
              <div className="w-full bg-[#070B0F] border border-[#252E38] rounded-xl p-3 relative select-none">
                <svg
                  viewBox="0 0 500 320"
                  className="w-full h-auto"
                  style={{ minHeight: '260px' }}
                >
                  <defs>
                    <radialGradient id="pqSafeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </radialGradient>
                  </defs>

                  {/* Axes */}
                  <line x1="250" y1="20" x2="250" y2="300" stroke="#334155" strokeWidth="1.5" />
                  <line x1="30" y1="250" x2="470" y2="250" stroke="#334155" strokeWidth="1.5" />

                  {/* Labels */}
                  <text x="250" y="15" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                    Puissance Active P (MW) ↑
                  </text>
                  <text x="470" y="245" textAnchor="end" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                    +Q Surexcité (MVAR) →
                  </text>
                  <text x="35" y="245" textAnchor="start" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                    ← -Q Sous-excité (MVAR)
                  </text>

                  {/* Stator Heating Circle: S = 82.35 MVA (Radius R = 180px from (250, 250)) */}
                  <circle cx="250" cy="250" r="180" fill="none" stroke="#06b6d4" strokeWidth="2" />
                  <text x="350" y="90" fill="#06b6d4" fontSize="9" fontFamily="monospace">
                    Limite Stator S_n = 82.4 MVA
                  </text>

                  {/* Turbine Max Mechanical Power Line: P = 70 MW (y = 250 - (70/82.35)*180 = 97px) */}
                  <line x1="100" y1="97" x2="400" y2="97" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
                  <text x="390" y="92" textAnchor="end" fill="#f59e0b" fontSize="9" fontFamily="monospace">
                    Puissance Max Turbine = 70 MW
                  </text>

                  {/* Rotor Field Current Heating Arc (Overexcited, centered below y) */}
                  <path
                    d="M 250 70 A 240 240 0 0 1 430 250"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.8"
                    strokeDasharray="3,3"
                  />
                  <text x="435" y="180" fill="#ef4444" fontSize="9" fontFamily="monospace">
                    Limite Rotor I_f_max
                  </text>

                  {/* Underexcitation Stability Limit (Left slant line) */}
                  <line x1="250" y1="250" x2="140" y2="97" stroke="#a855f7" strokeWidth="1.8" strokeDasharray="3,3" />
                  <text x="110" y="160" fill="#a855f7" fontSize="9" fontFamily="monospace">
                    Marge Stabilité δ &lt; 70°
                  </text>

                  {/* Safe Operating Area Shade */}
                  <path
                    d="M 170 97 L 330 97 A 180 180 0 0 1 410 250 L 140 250 Z"
                    fill="url(#pqSafeGlow)"
                  />

                  {/* Operating Point */}
                  {(() => {
                    // Coordinates mapping:
                    // Origin (P=0, Q=0) at (250, 250)
                    // Scale: 82.35 MVA = 180 px => 1 MW/MVAR = 180 / 82.35 = 2.185 px
                    const scale = 2.185;
                    const cx = Math.max(40, Math.min(460, 250 + reactivePowerMVAR * scale));
                    const cy = Math.max(30, Math.min(270, 250 - activePowerMW * scale));

                    return (
                      <g>
                        <line x1="250" y1={cy} x2={cx} y2={cy} stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2,2" />
                        <line x1={cx} y1="250" x2={cx} y2={cy} stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2,2" />
                        <circle cx={cx} cy={cy} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                        <circle cx={cx} cy={cy} r="14" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.4">
                          <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <rect x={cx + 10} y={cy - 22} width="115" height="18" rx="4" fill="#0D1117" stroke="#f59e0b" strokeWidth="1" />
                        <text x={cx + 15} y={cy - 10} fill="#f59e0b" fontSize="9" fontWeight="bold" fontFamily="monospace">
                          P: {activePowerMW}M, Q: {reactivePowerMVAR}M
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Sliders for Interactive P and Q */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pt-1">
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Puissance Active P :' : 'Active Power P:'}</span>
                    <span className="text-cyan-400 font-bold">{activePowerMW} MW</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="1"
                    value={activePowerMW}
                    onChange={(e) => setActivePowerMW(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Puissance Réactive Q :' : 'Reactive Power Q:'}</span>
                    <span className="text-amber-400 font-bold">{reactivePowerMVAR > 0 ? `+${reactivePowerMVAR}` : reactivePowerMVAR} MVAR</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="55"
                    step="1"
                    value={reactivePowerMVAR}
                    onChange={(e) => setReactivePowerMVAR(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Right: Real-time Telemetries & Machine Limits (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <span>{locale === 'fr' ? 'Diagnostic Rotor & Stator' : 'Rotor & Stator Diagnostics'}</span>
                  </h4>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      capabilityPoint.zone === 'normal_continuous'
                        ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                        : capabilityPoint.zone === 'forbidden'
                        ? 'bg-red-950 border border-red-800 text-red-300'
                        : 'bg-amber-950 border border-amber-800 text-amber-300'
                    }`}
                  >
                    {capabilityPoint.zone}
                  </span>
                </div>

                {/* Key Numbers */}
                <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'Facteur de Puissance' : 'Power Factor'}</div>
                    <div className="text-sm font-bold text-cyan-300 mt-0.5">cos φ = {capabilityPoint.powerFactor}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'Angle Interne Rotor δ' : 'Rotor Angle δ'}</div>
                    <div className={`text-sm font-bold mt-0.5 ${capabilityPoint.rotorAngleDeg > 65 ? 'text-red-400' : 'text-emerald-400'}`}>
                      δ = {capabilityPoint.rotorAngleDeg}° (limite 70°)
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'Courant Excitation If' : 'Field Current If'}</div>
                    <div className="text-sm font-bold text-amber-400 mt-0.5">{capabilityPoint.fieldCurrentPerUnit} pu</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-[10px] text-neutral-400 uppercase">{locale === 'fr' ? 'Puissance Apparente S' : 'Apparent Power S'}</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {Math.sqrt(activePowerMW * activePowerMW + reactivePowerMVAR * reactivePowerMVAR).toFixed(1)} MVA
                    </div>
                  </div>
                </div>

                {/* Status Explanation Card */}
                <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38] text-[11px] text-neutral-300 space-y-1">
                  <div className="text-[10px] font-bold text-amber-400 uppercase">
                    {locale === 'fr' ? 'Analyse Limite Machine :' : 'Operating Limit Assessment:'}
                  </div>
                  <p>{capabilityPoint.statusDescription[locale]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: EXCITATION AVR & PSS2B DAMPING SIMULATOR                  */}
      {/* ==================================================================== */}
      {activeSubTab === 'excitation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Transient Step Response Canvas (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? 'Réponse Transitoire de Tension (IEEE ST1A & PSS2B)' : 'AVR & PSS2B Dynamic Response'}</span>
                  </h3>
                  <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                    Amortissement des oscillations électromécaniques (0.2 Hz inter-zones & 1.2 Hz local)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPssActive(!isPssActive)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      isPssActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : 'bg-red-500/20 text-red-300 border border-red-500/50'
                    }`}
                  >
                    PSS2B : {isPssActive ? 'ACTIF (ON)' : 'BYPASS (OFF)'}
                  </button>
                </div>
              </div>

              {/* Dynamic Voltage Step Response Curve */}
              <div className="w-full bg-[#070B0F] border border-[#252E38] rounded-xl p-3 relative select-none">
                <svg
                  viewBox="0 0 500 240"
                  className="w-full h-auto"
                  style={{ minHeight: '200px' }}
                >
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="50" y2="200" stroke="#334155" strokeWidth="1.5" />
                  <line x1="50" y1="120" x2="480" y2="120" stroke="#334155" strokeWidth="1.0" strokeDasharray="3,3" />
                  <line x1="50" y1="200" x2="480" y2="200" stroke="#334155" strokeWidth="1.5" />

                  {/* Labels */}
                  <text x="260" y="225" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                    Temps t (secondes) → (0 à 5s)
                  </text>
                  <text x="18" y="110" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace" transform="rotate(-90, 18, 110)">
                    Tension V_t (pu)
                  </text>

                  <text x="40" y="123" textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">1.0 pu</text>
                  <text x="40" y="50" textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">1.1 pu</text>
                  <text x="40" y="195" textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">0.9 pu</text>

                  {/* Simulated step response curve */}
                  {(() => {
                    // Step event at x = 100 (t = 0.5s)
                    // Dip magnitude proportional to gridVoltageDipPercent
                    const pointsWithPss: [number, number][] = [];
                    const pointsWithoutPss: [number, number][] = [];

                    for (let x = 50; x <= 470; x += 3) {
                      const t = (x - 50) / 84; // 0 to 5 seconds
                      if (t < 0.5) {
                        pointsWithPss.push([x, 120]);
                        pointsWithoutPss.push([x, 120]);
                      } else {
                        const tau = t - 0.5;
                        const dip = (gridVoltageDipPercent / 100) * 70;
                        // With PSS: well damped (zeta ~ 0.25)
                        const yPss = 120 + dip * Math.exp(-2.5 * tau) * Math.sin(2 * Math.PI * 1.2 * tau - Math.PI / 2);
                        // Without PSS: poorly damped sustained swing (zeta ~ 0.03)
                        const yNoPss = 120 + dip * Math.exp(-0.4 * tau) * Math.sin(2 * Math.PI * 1.2 * tau - Math.PI / 2);

                        pointsWithPss.push([x, yPss]);
                        pointsWithoutPss.push([x, yNoPss]);
                      }
                    }

                    const pathPss = pointsWithPss.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1]}`).join(' ');
                    const pathNoPss = pointsWithoutPss.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1]}`).join(' ');

                    return (
                      <g>
                        {/* Without PSS Curve (Dashed Red) */}
                        <path d={pathNoPss} fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" opacity={isPssActive ? 0.4 : 1.0} />

                        {/* With PSS Curve (Solid Cyan) */}
                        {isPssActive && (
                          <path d={pathPss} fill="none" stroke="#06b6d4" strokeWidth="2.5" />
                        )}

                        {/* Event marker */}
                        <line x1="92" y1="20" x2="92" y2="200" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2,2" />
                        <text x="96" y="35" fill="#f59e0b" fontSize="9" fontFamily="monospace">Creux Réseau -{gridVoltageDipPercent}%</text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Slider for Perturbation Magnitude */}
              <div className="font-mono text-xs pt-1">
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Amplitude du Creux de Tension Réseau :' : 'Grid Voltage Dip Step Amplitude:'}</span>
                  <span className="text-amber-400 font-bold">-{gridVoltageDipPercent}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={gridVoltageDipPercent}
                  onChange={(e) => setGridVoltageDipPercent(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Right: IEEE ST1A & PSS2B Parameters (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? 'Paramètres IEEE ST1A / PSS2B' : 'IEEE ST1A & PSS2B Gains'}</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300">
                    IEEE Std 421.5
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex justify-between items-center">
                    <span className="text-neutral-400">Gain de Boucle AVR Ka :</span>
                    <span className="font-bold text-cyan-300">200 pu/pu (temps tr &lt; 25 ms)</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex justify-between items-center">
                    <span className="text-neutral-400">Plafond Tension Excitation V_lim :</span>
                    <span className="font-bold text-amber-300">2.0 pu (Pont thyristor complet)</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex justify-between items-center">
                    <span className="text-neutral-400">Canaux Entrée PSS2B :</span>
                    <span className="font-bold text-emerald-300">Δω (Vitesse) + ΔPe (Puissance)</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38] flex justify-between items-center">
                    <span className="text-neutral-400">Gain Stabilisateur K_pss :</span>
                    <span className="font-bold text-white">15.0 pu (Constantes T1-T4 calibrées)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141A23] border border-[#252E38] text-[11px] text-neutral-300">
                  <div className="text-[10px] font-bold text-cyan-400 uppercase mb-1">
                    {locale === 'fr' ? 'Rôle dans le RIS Cameroun :' : 'Role in Cameroon RIS Grid:'}
                  </div>
                  {locale === 'fr'
                    ? 'Le PSS2B amortit les modes d\'oscillations inter-centrales entre Nachtigal (Sanaga), Songloulou et les centrales thermiques de Kribi/Oyomabang, évitant les déclenchements en cascade des lignes 225 kV.'
                    : 'The PSS2B successfully damps inter-plant electromechanical oscillations between Nachtigal, Songloulou, and Kribi thermal gas units, preventing cascading 225 kV transmission line trips.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 4: CAMEROON RIS GRID CODE & BLACK START                      */}
      {/* ==================================================================== */}
      {activeSubTab === 'gridcode' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                  <Radio className="h-4 w-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Audit de Conformité au Code de Réseau RIS (SONATREL / ARSEL)' : 'Cameroon RIS Grid Code Compliance Audit'}</span>
                </h3>
                <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                  Spécifications d'interconnexion 225 kV et participation aux services système
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-[10px] font-mono font-bold text-emerald-300">
                100% CONFORME
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CAMEROON_RIS_GRID_CODE_CHECKS.map((check) => (
                <div
                  key={check.id}
                  className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2.5 text-xs font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{check.requirement[locale]}</span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>CONFORME</span>
                    </span>
                  </div>

                  <div className="text-[10px] text-neutral-400">
                    Autorité : <span className="text-cyan-300">{check.standardAuthority}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#0A0E14] border border-[#252E38] space-y-1 text-[11px]">
                    <div className="text-neutral-400">Exigence : <span className="text-amber-300">{check.ruleValue}</span></div>
                    <div className="text-neutral-400">Mesuré : <span className="text-emerald-300">{check.plantAchievedValue}</span></div>
                  </div>

                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    {check.notes[locale]}
                  </p>
                </div>
              ))}
            </div>

            {/* Black Start Sequence Timeline */}
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/10 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 uppercase text-xs">
                  {locale === 'fr' ? 'Protocole de Démarrage Autonome (Black Start RIS - 45 min)' : 'Black Start System Restoration Sequence (45 min)'}
                </span>
                <span className="text-[10px] text-neutral-400">SONATREL DISPATCHING</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-lg bg-[#0A0E14] border border-[#252E38]">
                  <div className="text-amber-400 font-bold text-[10px]">T+0 min</div>
                  <div className="text-neutral-300 text-[11px] mt-0.5">
                    {locale === 'fr' ? 'Démarrage groupe diesel secours 2.5 MVA' : 'Start emergency 2.5 MVA diesel set'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0A0E14] border border-[#252E38]">
                  <div className="text-amber-400 font-bold text-[10px]">T+12 min</div>
                  <div className="text-neutral-300 text-[11px] mt-0.5">
                    {locale === 'fr' ? 'Alimentation auxiliaires 400V & groupe G1' : 'Energize 400V auxiliaries & start G1'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0A0E14] border border-[#252E38]">
                  <div className="text-amber-400 font-bold text-[10px]">T+25 min</div>
                  <div className="text-neutral-300 text-[11px] mt-0.5">
                    {locale === 'fr' ? 'Mise sous tension ligne 225 kV Nachtigal-Yaoundé' : 'Energize 225 kV line to Yaoundé'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0A0E14] border border-[#252E38]">
                  <div className="text-amber-400 font-bold text-[10px]">T+45 min</div>
                  <div className="text-neutral-300 text-[11px] mt-0.5">
                    {locale === 'fr' ? 'Prise de charge initiale et synchronisation' : 'Initial load pick-up & grid restoration'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
