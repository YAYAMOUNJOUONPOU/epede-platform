// src/components/power-quality/PowerQualityEmcWorkbench.tsx
// EPEDE Engineering Workbench — Domain D17 / D14: Power Quality & Electromagnetic Compatibility (CEM)
// (Qualité de l'Énergie, Harmoniques IEEE 519-2022 / CEI 61000-2-4, Creux de Tension CEI 61000-4-30 Classe A,
// Courbes d'Immunité SEMI F47 / ITIC, Filtres Actifs APF IGBT 25µs, Dé-résonance LC 7% 189 Hz, Flicker Pst/Plt & DQE FCFA)
// Grounded in IEC 61000-2-4, IEC 61000-4-30 Class A, IEC 61000-4-7, IEEE 519-2022, SEMI F47, IEEE C57.110,
// and authentic Cameroon industrial power quality cases (ALUCAM Édéa 180 MW, Prometal Douala Bassa, CIMENCAM).

import React, { useState } from 'react';
import {
  Activity,
  Zap,
  Sliders,
  RotateCcw,
  Eye,
  Info,
  Flame,
  FileText,
  TrendingUp,
  Cpu,
  MapPin,
  ExternalLink,
  Layers,
  Gauge,
  BarChart3,
  Waves,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sparkles,
  BookOpen,
  Calculator,
  X
} from 'lucide-react';

import { AuthoritativeEcosystemHero } from '../common/AuthoritativeEcosystemHero';
import { PqOrientationBanner } from './PqOrientationBanner';
import { PqCommandHeader } from './PqCommandHeader';
import { PqClassAMeasurementEngine } from './modules/PqClassAMeasurementEngine';
import { PqDeliverablesExportEngine } from './modules/PqDeliverablesExportEngine';
import { usePqProjectStore } from './services/usePqProjectStore';

interface PowerQualityEmcWorkbenchProps {
  locale: 'fr' | 'en';
  onNavigate?: (view: string, domainCode?: string) => void;
  onSelectEquipment?: (id: string) => void;
}

export const PowerQualityEmcWorkbench: React.FC<PowerQualityEmcWorkbenchProps> = ({
  locale,
  onNavigate,
  onSelectEquipment
}) => {
  // Central Reactive Project Store (default to ALUCAM 180 MW)
  const store = usePqProjectStore('ALUCAM_EDEA_180MW');

  // Stage 3 Sub-tabs
  const [stage3Tab, setStage3Tab] = useState<'apf' | 'detuned' | 'kfactor'>('apf');

  // Mathematical Formulations & Standards Modal
  const [isFormulasModalOpen, setIsFormulasModalOpen] = useState<boolean>(false);

  // Sag Trigger Cause in Stage 2
  const [sagFaultCause, setSagFaultCause] = useState<
    'REMOTE_SLG_FAULT' | 'INDUCTION_MOTOR_START' | 'TRANSFORMER_INRUSH'
  >('REMOTE_SLG_FAULT');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-violet-500 selection:text-white pb-24">
      {/* 1. Authoritative Ecosystem Hero Header */}
      <AuthoritativeEcosystemHero
        stage="distribution"
        locale={locale}
        onNavigateStage={(stg) => {
          if (onNavigate) onNavigate(stg);
        }}
        onNavigateToDomain={(dom) => {
          if (onNavigate) onNavigate('domain', dom);
        }}
        onSelectEquipment={onSelectEquipment}
        activePillarLabel={
          locale === 'fr'
            ? "Qualité de l'Énergie & Dépollution CEM"
            : 'Power Quality & EMC Engineering'
        }
        totalPillarsCount={5}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6 space-y-6">
        {/* 2. Executive 7 Orientation Questions Banner */}
        <PqOrientationBanner
          locale={locale}
          onNavigateStage={(stg) => store.setActiveStage(stg)}
          onNavigateDomain={(dom) => onNavigate?.('domain', dom)}
        />

        {/* 3. Reactive Master Command Cockpit */}
        <PqCommandHeader
          locale={locale}
          store={store}
          onOpenFormulasModal={() => setIsFormulasModalOpen(true)}
        />

        {/* ========================================================================= */}
        {/* STAGE 1: CLASS A MEASUREMENT CAMPAIGN & IEEE 519 FFT SPECTRUM ANALYZER */}
        {/* ========================================================================= */}
        {store.activeStage === 1 && (
          <PqClassAMeasurementEngine locale={locale} store={store} />
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: VOLTAGE SAG & IMMUNITY GAUGE (SEMI F47 / ITIC / CBEMA) */}
        {/* ========================================================================= */}
        {store.activeStage === 2 && (
          <div className="space-y-6">
            {/* Header intro */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-violet-500/30 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    SEMI F47-0706 / CEI 61000-4-34 / ITIC
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    [Sensibilité des Process Continus & Creux de Tension Réseau]
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {locale === 'fr'
                    ? 'Immunité Industrielle aux Creux de Tension & Micro-coupures'
                    : 'Industrial Voltage Sag Ride-Through & Process Immunity'}
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                  {locale === 'fr'
                    ? "Simulez l'amplitude résiduelle (Ures) et la durée (Δt) du creux de tension pour déterminer si les variateurs VFD, automates et contacteurs franchissent l'incident sans interruption de production."
                    : 'Simulate retained voltage magnitude (Ures) and fault duration (Δt) to determine if drives, PLCs, and contactors ride through the disturbance without tripping manufacturing lines.'}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-mono text-slate-400">Statut SEMI F47 :</span>
                <span
                  className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
                    store.sagAnalytics.semiF47Pass
                      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-700'
                      : 'text-rose-400 bg-rose-950/60 border-rose-700'
                  }`}
                >
                  {store.sagAnalytics.semiF47Pass ? 'IMMUNITÉ CONFORME' : 'DÉCLENCHEMENT SÉVÈRE'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Controls Column (5 cols) */}
              <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <h3 className="text-sm font-bold font-mono text-violet-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {locale === 'fr'
                    ? 'TÉLÉMÉTRIE DU CREUX (CEI 61000-4-30 CLASSE A)'
                    : 'SAG TELEMETRY (IEC 61000-4-30 CLASS A)'}
                </h3>

                <div className="space-y-4">
                  {/* Retained Voltage Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Tension Résiduelle (Ures) :</span>
                      <span className="text-amber-400 font-bold">{store.sagRetainedPct}% Un</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="95"
                      value={store.sagRetainedPct}
                      onChange={(e) => store.setSagRetainedPct(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Profondeur creux: {store.sagAnalytics.sagDepthPct}%</span>
                      <span>Urésiduelle: {((store.nominalVoltageV * store.sagRetainedPct) / 100).toFixed(0)} V</span>
                    </div>
                  </div>

                  {/* Sag Duration Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Durée de l'Événement (Δt) :</span>
                      <span className="text-cyan-400 font-bold">{store.sagDurationMs} ms</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="1500"
                      step="20"
                      value={store.sagDurationMs}
                      onChange={(e) => store.setSagDurationMs(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>20 ms (1 cycle 50Hz)</span>
                      <span>1500 ms (Défaut persistant)</span>
                    </div>
                  </div>

                  {/* Fault Cause Preset */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-bold">
                      {locale === 'fr' ? 'Origine Physique Simulée :' : 'Simulated Fault Cause:'}
                    </label>
                    <select
                      value={sagFaultCause}
                      onChange={(e) => setSagFaultCause(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="REMOTE_SLG_FAULT">
                        Court-circuit monophasé distant 225 kV éliminé en 150 ms (Ligne SONATREL)
                      </option>
                      <option value="INDUCTION_MOTOR_START">
                        Démarrage direct gros moteur asynchrone broyeur (Appel 6 In pendant 800 ms)
                      </option>
                      <option value="TRANSFORMER_INRUSH">
                        Enclenchement transformateur de puissance 63 MVA (Courant d'inrush 200 ms)
                      </option>
                    </select>
                  </div>

                  {/* Presets Quick Jump */}
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                      Scénarios Réels Cameroun :
                    </span>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => {
                          store.setSagRetainedPct(65);
                          store.setSagDurationMs(180);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-left hover:border-violet-500 text-slate-300"
                      >
                        ⚡ Orage Édéa (65% / 180ms)
                      </button>
                      <button
                        onClick={() => {
                          store.setSagRetainedPct(35);
                          store.setSagDurationMs(280);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-left hover:border-violet-500 text-slate-300"
                      >
                        ⚡ Nomayos Broyeur (35% / 280ms)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Graphical SEMI F47 / ITIC Canvas (7 cols) */}
              <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-violet-400" />
                      {locale === 'fr'
                        ? 'GABARIT VECTORIEL SEMI F47 & COURBE ITIC (CBEMA)'
                        : 'SEMI F47 & ITIC VECTORIAL RIDE-THROUGH CURVES'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Coordonnées de fonctionnement : Δt = {store.sagDurationMs} ms | Ures = {store.sagRetainedPct}%
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
                      store.sagAnalytics.semiF47Pass
                        ? 'text-emerald-400 bg-emerald-950/60 border-emerald-700'
                        : 'text-rose-400 bg-rose-950/60 border-rose-700'
                    }`}
                  >
                    SEMI F47: {store.sagAnalytics.semiF47Pass ? 'RIDE-THROUGH OK' : 'TRIP DÉFAUT'}
                  </span>
                </div>

                {/* Vector Canvas */}
                <div className="relative w-full aspect-[16/9] max-h-[300px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-3">
                  <svg viewBox="0 0 520 240" className="w-full h-full">
                    {/* Grids */}
                    <line x1="50" y1="20" x2="50" y2="210" stroke="#334155" strokeWidth="1" />
                    <line x1="50" y1="210" x2="490" y2="210" stroke="#334155" strokeWidth="1" />

                    {/* Y ticks (Voltage %) */}
                    <text x="45" y="25" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">100%</text>
                    <text x="45" y="65" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">80%</text>
                    <text x="45" y="115" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">50%</text>
                    <text x="45" y="210" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">0%</text>

                    {/* X ticks */}
                    <text x="50" y="225" fill="#64748b" fontSize="9" fontFamily="monospace">20ms</text>
                    <text x="170" y="225" fill="#64748b" fontSize="9" fontFamily="monospace">200ms</text>
                    <text x="290" y="225" fill="#64748b" fontSize="9" fontFamily="monospace">500ms</text>
                    <text x="440" y="225" fill="#64748b" fontSize="9" fontFamily="monospace">1000ms</text>

                    {/* SEMI F47 Area Fill (Ride-through zone) */}
                    <polygon
                      points="50,20 490,20 490,65 440,65 290,65 290,85 170,85 170,115 50,115"
                      fill="#10b981"
                      fillOpacity="0.08"
                    />

                    {/* SEMI F47 Boundary Line */}
                    <polyline
                      points="50,115 170,115 170,85 290,85 290,65 440,65 490,65"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />
                    <text x="300" y="80" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">
                      Gabarit SEMI F47 (Immunité)
                    </text>

                    {/* Trip Zone Label */}
                    <text x="180" y="160" fill="#f43f5e" fillOpacity="0.7" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      ZONE DE DÉCLENCHEMENT / DÉCROCHAGE VFD
                    </text>

                    {/* Current Sag Event Coordinate Point */}
                    {(() => {
                      const cx = 50 + (Math.min(1200, store.sagDurationMs) / 1200) * 420;
                      const cy = 210 - (store.sagRetainedPct / 100) * 190;
                      return (
                        <g>
                          <circle
                            cx={cx}
                            cy={cy}
                            r="8"
                            fill={store.sagAnalytics.semiF47Pass ? '#10b981' : '#ef4444'}
                            stroke="#ffffff"
                            strokeWidth="2.5"
                            className="animate-pulse"
                          />
                          <line
                            x1={cx}
                            y1={cy}
                            x2={cx}
                            y2="210"
                            stroke="#94a3b8"
                            strokeDasharray="2,2"
                            strokeWidth="1.5"
                          />
                          <line
                            x1="50"
                            y1={cy}
                            x2={cx}
                            y2={cy}
                            stroke="#94a3b8"
                            strokeDasharray="2,2"
                            strokeWidth="1.5"
                          />
                        </g>
                      );
                    })()}
                  </svg>
                </div>

                {/* Industrial Impact Explanation */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{locale === 'fr' ? 'Diagnostic d’Exploitation Industrielle :' : 'Industrial Operational Diagnosis:'}</span>
                    <span className="text-violet-400">
                      [Indice d'Énergie Perdue : {store.sagAnalytics.lostEnergyIndex}]
                    </span>
                  </div>
                  {store.sagAnalytics.semiF47Pass ? (
                    <p className="text-emerald-400">
                      ✓ Le point se situe au-dessus de la courbe SEMI F47. Les automates programmables et les variateurs de vitesse restent en rotation continue sans arrêt des lignes de fabrication.
                    </p>
                  ) : (
                    <p className="text-rose-400 font-bold">
                      ⚠️ Décrochage immédiat des variateurs sous-tension et ouverture des contacteurs magnétiques. Préconisation : Conditionneur d'Onde Actif (AVC) 250 kVA (inclus en Étape 5 DQE).
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: ACTIVE FILTER (APF), 7% DETUNED BANK & TRANSFORMER K-FACTOR */}
        {/* ========================================================================= */}
        {store.activeStage === 3 && (
          <div className="space-y-6">
            {/* Header intro */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-violet-500/30 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-950 text-violet-300 border border-violet-800">
                    FILTRAGE ACTIF SHUNT IGBT / DÉ-RÉSONANCE 7% / IEEE C57.110
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    [Dépollution Dynamique & Protection Thermique des Transformateurs]
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {locale === 'fr'
                    ? 'Banc de Dépollution Harmonique & Déclassement Thermique Transfo'
                    : 'Harmonic Mitigation Bench & Transformer Thermal Derating'}
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                  {locale === 'fr'
                    ? "Compensez les harmoniques en temps réel par injection IGBT en opposition de phase, évitez la résonance parallèle des condensateurs au rang 5 (250 Hz) via selfs 7%, et préservez la durée de vie de l'isolant du transformateur."
                    : 'Mitigate harmonics in real-time via IGBT phase-opposition injection, avoid dangerous 5th-harmonic parallel resonance via 7% detuned reactors, and preserve transformer insulation life.'}
                </p>
              </div>

              {/* Sub-tab navigation */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  onClick={() => setStage3Tab('apf')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    stage3Tab === 'apf' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1. Filtre APF
                </button>
                <button
                  onClick={() => setStage3Tab('detuned')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    stage3Tab === 'detuned' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2. Self 7% LC
                </button>
                <button
                  onClick={() => setStage3Tab('kfactor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    stage3Tab === 'kfactor' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3. Facteur K
                </button>
              </div>
            </div>

            {/* SUB-PILLAR 1: ACTIVE POWER FILTER (APF) */}
            {stage3Tab === 'apf' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                  <h3 className="text-sm font-bold font-mono text-violet-400 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {locale === 'fr' ? 'COMMANDE DU FILTRE ACTIF (APF SHUNT)' : 'SHUNT ACTIVE FILTER CONTROLS'}
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div>
                        <div className="text-xs font-mono font-bold text-white">État du Filtre Shunt :</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          Pont d'onduleur à IGBT 20 kHz
                        </div>
                      </div>
                      <button
                        onClick={() => store.setIsApfActive(!store.isApfActive)}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                          store.isApfActive
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {store.isApfActive ? '⚡ EN SERVICE' : '⚠️ BYPASS'}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">Taux d'Atténuation Harmonique :</span>
                        <span className="text-emerald-400 font-bold">{store.apfCompensationGainPct}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="98"
                        value={store.apfCompensationGainPct}
                        onChange={(e) => store.setApfCompensationGainPct(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">Temps de Réponse Dynamique :</span>
                        <span className="text-cyan-400 font-bold">{store.apfResponseTimeMicroSec} µs</span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="100"
                        value={store.apfResponseTimeMicroSec}
                        onChange={(e) => store.setApfResponseTimeMicroSec(Number(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-violet-400" />
                    {locale === 'fr' ? 'BILAN D’INJECTION & ASSAINISSEMENT' : 'MITIGATION TELEMETRY & ATTENUATION'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-mono text-slate-400">Courant THDi Brut :</span>
                      <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                        {store.harmonicAnalytics.rawThdCurrentPct}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">Irms: {store.harmonicAnalytics.rawIrmsA} A</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-mono text-slate-400">Courant THDi Atténué :</span>
                      <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                        {store.harmonicAnalytics.effectiveThdCurrentPct}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">Irms: {store.harmonicAnalytics.effectiveIrmsA} A</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-mono text-slate-400">Courant APF Requis :</span>
                      <div className="text-xl font-bold font-mono text-violet-400 mt-1">
                        {store.harmonicAnalytics.harmonicCurrentToCancelA} A
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">Dimensionnement modules 150A</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                    <span className="text-violet-400 font-bold">Principe Physique Shunt APF : </span>
                    L'onduleur mesure le courant de charge non linéaire en amont par des TC Classe 0.2S, calcule en temps réel par transformée de Park la composante harmonique i_h(t) et injecte instantanément -i_h(t) sur le jeu de barres. Le réseau en amont ne voit plus qu'une sinusoïde pure de 50 Hz.
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PILLAR 2: DETUNED CAPACITOR BANK WITH ANTI-RESONANCE REACTOR */}
            {stage3Tab === 'detuned' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                  <h3 className="text-sm font-bold font-mono text-violet-400 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    {locale === 'fr' ? 'DIMENSIONNEMENT DE LA BATTERIE LC' : 'LC CAPACITOR & REACTOR SIZING'}
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">Puissance Réactive Cible :</span>
                        <span className="text-violet-400 font-bold">{store.targetCapacitorKvar} kvar</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="600"
                        step="25"
                        value={store.targetCapacitorKvar}
                        onChange={(e) => store.setTargetCapacitorKvar(Number(e.target.value))}
                        className="w-full accent-violet-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">Facteur de Désaccord (p) :</span>
                        <span className="text-cyan-400 font-bold">{store.detuningReactorPct}% (189 Hz)</span>
                      </div>
                      <select
                        value={store.detuningReactorPct}
                        onChange={(e) => store.setDetuningReactorPct(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white"
                      >
                        <option value="5.67">p = 5.67% (fr = 210 Hz - Rang 4.2)</option>
                        <option value="7.0">p = 7.00% (fr = 189 Hz - Rang 3.78 - Standard Recommandé)</option>
                        <option value="14.0">p = 14.00% (fr = 134 Hz - Rang 2.68 - Forte Pollution)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-violet-400" />
                    {locale === 'fr' ? 'ANALYSE DE RISQUE DE RÉSONANCE PARALLÈLE' : 'PARALLEL RESONANCE RISK ANALYSIS'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-mono text-slate-400">Fréq. Résonance Série :</span>
                      <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                        {store.detunedAnalytics.resonanceFreqHz} Hz
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Rang {store.detunedAnalytics.harmonicOrderResonance} (&lt; rang 5)
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-mono text-slate-400">Risque sans Self (Condensateur nu) :</span>
                      <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                        {store.detunedAnalytics.rawParallelFreqHz} Hz
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Rang {store.detunedAnalytics.dangerousHarmonicOrder} (Explosif si ~5 ou ~7)
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-mono text-slate-400">Tension Condensateurs Recommandée :</span>
                      <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                        {store.detunedAnalytics.recommendedCapacitorRatingV} V
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Surtension self: {store.detunedAnalytics.capacitorWorkingVoltageV} V
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                    <span className="text-emerald-400 font-bold">Sécurité Anti-Explosion : </span>
                    L'adjonction de la self en série abaisse l'impédance de la branche sous 189 Hz. Au-delà (rangs 5, 7, 11), le circuit devient inductif, rendant impossible toute résonance parallèle destructrice avec le réseau SONATREL.
                  </div>
                </div>
              </div>
            )}

            {/* SUB-PILLAR 3: TRANSFORMER K-FACTOR & THERMAL DERATING */}
            {stage3Tab === 'kfactor' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                  <h3 className="text-sm font-bold font-mono text-violet-400 flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    {locale === 'fr' ? 'CALCUL DU FACTEUR K (IEEE C57.110)' : 'K-FACTOR COMPUTATION'}
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">Puissance Assignée Transfo (kVA) :</span>
                        <span className="text-violet-400 font-bold">{store.transformerRatedKva} kVA</span>
                      </div>
                      <input
                        type="range"
                        min="250"
                        max="3150"
                        step="50"
                        value={store.transformerRatedKva}
                        onChange={(e) => store.setTransformerRatedKva(Number(e.target.value))}
                        className="w-full accent-violet-500"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                      <div className="text-slate-400">Classes Standardisées IEEE C57.110 :</div>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <span className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300">K-1</span>
                        <span className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300">K-4</span>
                        <span className="p-1 rounded bg-violet-950 border border-violet-800 text-violet-300 font-bold">K-13</span>
                        <span className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300">K-20</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                  <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-400" />
                    {locale === 'fr' ? 'DÉCLASSEMENT THERMIQUE TRANSFO STANDARD' : 'STANDARD TRANSFORMER DERATING'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-mono text-slate-400">Facteur K Calculé :</span>
                      <div className="text-xl font-bold font-mono text-violet-400 mt-1">
                        K-{store.harmonicAnalytics.kFactorEffective}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Recommandation : {store.harmonicAnalytics.recommendedKClass}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-mono text-slate-400">Facteur de Déclassement :</span>
                      <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                        {store.harmonicAnalytics.deratingFactor}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Pertes Foucault Pec-r = 15%
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-mono text-slate-400">Puissance Admissible :</span>
                      <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                        {store.harmonicAnalytics.deratedKva} kVA
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        sur {store.transformerRatedKva} kVA nominal
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                    <span className="text-amber-400 font-bold">Règle de l'Art : </span>
                    Un transformateur standard K-1 soumis à un facteur K élevé surchauffe rapidement au niveau des enroulements BT par effet de peau et courants de Foucault. Sans filtre APF, il doit être déclassé de {((1 - store.harmonicAnalytics.deratingFactor) * 100).toFixed(1)}% pour éviter la carbonisation prématurée de l'isolant papier/huile.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 4: FLICKER (Pst/Plt), NEGATIVE UNBALANCE & EMC MITIGATION */}
        {/* ========================================================================= */}
        {store.activeStage === 4 && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-violet-500/30 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-950 text-violet-300 border border-violet-800">
                    CEI 61000-4-15 / EN 50160 / FORTESCUE u2
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    [Flickermètre Numérique & Déséquilibre Inverse de Tension]
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {locale === 'fr'
                    ? 'Supervision du Flicker (Pst/Plt), Déséquilibre (V2/V1) & Bonnes Pratiques CEM'
                    : 'Flicker Supervision (Pst/Plt), Unbalance (V2/V1) & EMC Good Practices'}
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                  {locale === 'fr'
                    ? "Mesurez la sévérité du papillotement visuel induit par les fours à arc et compresseurs, évaluez l'échauffement des moteurs asynchrones par la composante inverse, et appliquez les règles CEM de câblage industriel."
                    : 'Measure visual flicker severity induced by arc furnaces and compressors, evaluate motor rotor overheating from negative sequence unbalance, and apply industrial EMC shielding guidelines.'}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-mono text-slate-400">Statut Flicker Pst :</span>
                <span
                  className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
                    store.flickerAnalytics.isPstCompliant
                      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-700'
                      : 'text-rose-400 bg-rose-950/60 border-rose-700'
                  }`}
                >
                  Pst = {store.flickerPst} {store.flickerAnalytics.isPstCompliant ? '(&le; 1.0)' : '(&gt; 1.0 HORS NORME)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Flicker & Unbalance Sliders (5 cols) */}
              <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <h3 className="text-sm font-bold font-mono text-violet-400 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  {locale === 'fr' ? 'RÉGLAGES DU FLICKERMÈTRE CEI' : 'IEC FLICKERMETER SETTINGS'}
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Flicker Court Terme (Pst - 10 min) :</span>
                      <span className="text-amber-400 font-bold">{store.flickerPst}</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="3.5"
                      step="0.05"
                      value={store.flickerPst}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        store.setFlickerPst(val);
                        store.setFlickerPlt(Number((val * 0.82).toFixed(2)));
                      }}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Limite contractuelle: 1.0</span>
                      <span>Plt (2h): {store.flickerPlt} (limite 0.8)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Taux de Déséquilibre Inverse (u2 = V2/V1) :</span>
                      <span className="text-rose-400 font-bold">{store.unbalancePct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="5.0"
                      step="0.1"
                      value={store.unbalancePct}
                      onChange={(e) => store.setUnbalancePct(Number(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Limite EN 50160: 2.0%</span>
                      <span>Déclassement moteur: -{store.flickerAnalytics.motorDeratingPct}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: EMC Rules & Shielding (7 cols) */}
              <div className="lg:col-span-7 space-y-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-400" />
                  {locale === 'fr'
                    ? 'GUIDE DE COMPATIBILITÉ ÉLECTROMAGNÉTIQUE (CEM INDUSTRIELLE)'
                    : 'INDUSTRIAL EMC COMPATIBILITY & SHIELDING GUIDELINES'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-bold text-violet-400 font-mono">1. Ségrégation des Câbles (CEI 61000-5-2)</div>
                    <p className="text-slate-300 text-[11px]">
                      Maintenir au minimum 30 cm de séparation entre câbles de puissance VFD (classe 4) et câbles de mesure analogique 4-20 mA (classe 1).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-bold text-violet-400 font-mono">2. Raccordement Blindage à 360°</div>
                    <p className="text-slate-300 text-[11px]">
                      Proscrire impérativement les tresses en fil de porc (pigtail) créant une self parasite à haute fréquence. Utiliser des colliers CEM 360°.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-bold text-violet-400 font-mono">3. Réseau de Masse Maillé (CBN)</div>
                    <p className="text-slate-300 text-[11px]">
                      Relier toutes les enveloppes métalliques, chemins de câbles et armoires à une grille équipotentielle à mailles serrées (&le; 2x2 m).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-bold text-violet-400 font-mono">4. Ferrites & Filtres d'Entrée VFD</div>
                    <p className="text-slate-300 text-[11px]">
                      Installer des tores de ferrite de mode commun sur les câbles moteur pour bloquer les courants de palier destructeurs (EDM).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 5: CAMEROON SITES FEEDBACK & STAMPED BOQ/DQE IN FCFA */}
        {/* ========================================================================= */}
        {store.activeStage === 5 && (
          <PqDeliverablesExportEngine locale={locale} store={store} />
        )}
      </div>

      {/* ========================================================================= */}
      {/* MATHEMATICAL FORMULATIONS & NORMATIVE STANDARDS MODAL */}
      {/* ========================================================================= */}
      {isFormulasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-violet-500/40 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  {locale === 'fr'
                    ? 'Formulations Mathématiques & Normes de Référence'
                    : 'Mathematical Formulations & Reference Standards'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-violet-400">1. Taux de Distorsion Harmonique Global (THDi & THDu) :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-white font-mono">
                  THDi = &radic;(&sum; [h=2..50] Ih&sup2;) / I1 &times; 100%
                </div>
                <p className="text-[11px] text-slate-400">
                  Normes : CEI 61000-2-4 Classe 2 / IEEE Std 519-2022. Limite contractuelle HTA : &le; 5.0%.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-violet-400">2. Facteur K des Transformateurs (IEEE C57.110) :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-white font-mono">
                  K = &sum; [h=1..hmax] (Ih / I1)&sup2; &times; h&sup2;
                </div>
                <p className="text-[11px] text-slate-400">
                  Quantifie l'échauffement supplémentaire des enroulements par courants de Foucault.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-violet-400">3. Accordement de la Self Anti-Résonance (7%) :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-white font-mono">
                  fr = f0 / &radic;(p) = 50 Hz / &radic;(0.07) &asymp; 189 Hz
                </div>
                <p className="text-[11px] text-slate-400">
                  Fréquence sous le rang 5 (250 Hz) interdisant toute résonance parallèle avec le réseau.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-violet-400">4. Taux de Déséquilibre Inverse de Fortescue (u2) :</div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-white font-mono">
                  u2 = |V2| / |V1| &times; 100% = |Va + a&sup2;Vb + aVc| / |Va + aVb + a&sup2;Vc| &times; 100%
                </div>
                <p className="text-[11px] text-slate-400">
                  Norme : EN 50160. Seuil admissible &le; 2.0%.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsFormulasModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold"
              >
                {locale === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
