// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 23 : WAMS SYNCHROPHASORS (IEEE C37.118),
// INERTIE SYSTÈME, RoCoF (df/dt), STABILISATEURS PSS (IEEE 421.5) & FORMAGE DE RÉSEAU
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Zap,
  Gauge,
  ShieldAlert,
  ArrowRight,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  RefreshCw,
  Compass,
  Info,
} from 'lucide-react';
import {
  DEFAULT_PMU_NODES,
  DEFAULT_INERTIA_FLEET,
  ROCOF_CONTINGENCIES,
  OSCILLATION_MODES,
  DEFAULT_PSS_SETTING,
  DEFAULT_GFM_CONFIG,
  computeSystemInertia,
  simulateFrequencyTrajectory,
  computeLinePowerMargin,
} from '../../data/hydropowerWamsInertiaData';
import type {
  RocofContingencyType,
  GridInertiaPlant,
  PssSetting,
  GridFormingConfig,
} from '../../types/hydropowerWamsInertia';

interface HydropowerWamsInertiaViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
  onSelectSubsystem?: (subsystemId: string) => void;
}

export const HydropowerWamsInertiaView: React.FC<HydropowerWamsInertiaViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'wams_pmus' | 'rocof_inertia' | 'pss_damping' | 'grid_forming'>('wams_pmus');

  // Selected PMU for detail view
  const [selectedPmuId, setSelectedPmuId] = useState<string>('PMU_NACHTIGAL_225');

  // Grid Inertia Fleet Fleet state
  const [fleet, setFleet] = useState<GridInertiaPlant[]>(DEFAULT_INERTIA_FLEET);

  // RoCoF Simulation state
  const [selectedContingencyId, setSelectedContingencyId] = useState<RocofContingencyType>('LOSS_OF_GENERATION_120MW');
  const [enableFfrGfm, setEnableFfrGfm] = useState<boolean>(true);
  const [enablePss, setEnablePss] = useState<boolean>(true);

  // PSS Settings
  const [pssConfig, setPssConfig] = useState<PssSetting>(DEFAULT_PSS_SETTING);
  const [gfmConfig, setGfmConfig] = useState<GridFormingConfig>(DEFAULT_GFM_CONFIG);

  // Compute live system inertia
  const systemInertiaMetrics = useMemo(() => computeSystemInertia(fleet), [fleet]);

  // Selected contingency object
  const selectedContingency = useMemo(() => {
    return ROCOF_CONTINGENCIES.find((c) => c.id === selectedContingencyId) || ROCOF_CONTINGENCIES[1];
  }, [selectedContingencyId]);

  // Frequency and RoCoF dynamic simulation time-series
  const frequencyTrajectory = useMemo(() => {
    return simulateFrequencyTrajectory(
      selectedContingency,
      systemInertiaMetrics.hSysSeconds,
      systemInertiaMetrics.totalOnlineMva,
      enablePss,
      enableFfrGfm
    );
  }, [selectedContingency, systemInertiaMetrics, enablePss, enableFfrGfm]);

  // Selected PMU object
  const selectedPmu = useMemo(() => {
    return DEFAULT_PMU_NODES.find((p) => p.id === selectedPmuId) || DEFAULT_PMU_NODES[0];
  }, [selectedPmuId]);

  // Power margin calculation for selected PMU relative to Nachtigal
  const pmuMargin = useMemo(() => {
    const xReactance = Math.max(0.08, (selectedPmu.distanceFromNachtigalKm * 0.4) / 100);
    return computeLinePowerMargin(1.025, selectedPmu.voltageMagnitudePu, xReactance, selectedPmu.voltageAngleDeg);
  }, [selectedPmu]);

  // Handlers for adjusting online units
  const handleToggleUnit = (plantId: string, delta: number) => {
    setFleet((prev) =>
      prev.map((p) => {
        if (p.id === plantId) {
          const newUnits = Math.min(p.totalUnits, Math.max(0, p.onlineUnits + delta));
          return { ...p, onlineUnits: newUnits };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0E1714] via-[#10221A] to-[#0A120E] border border-emerald-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-emerald-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                {locale === 'fr'
                  ? 'ÉTAPE 23 • SURVEILLANCE GRANDE ZONE (WAMS) & STABILITÉ SYSTÈME'
                  : 'STEP 23 • WIDE-AREA MONITORING (WAMS) & SYSTEM STABILITY'}
              </span>
              <span className="text-xs font-mono text-neutral-400">IEEE C37.118 / IEEE 421.5 / IEC 61850-90-5 / SONATREL Grid Code</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <Radio className="h-6 w-6 text-emerald-400" />
              <span>
                {locale === 'fr'
                  ? 'Synchrophaseurs WAMS, Inertie Réseau, Dynamique RoCoF (df/dt) & Amortissement PSS'
                  : 'WAMS Synchrophasors, Grid Inertia, RoCoF Dynamics (df/dt) & PSS Damping'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Surveillance synchrone haute vitesse (50 fps, GPS) du réseau 225 kV, cartographie angulaire inter-zones, modélisation de l\'inertie tournante (H = 4.2 s, 1960 MJ) de Nachtigal, résolution de l\'équation d\'oscillation (RoCoF/Nadir) et amortissement actif des modes 0.2-1.5 Hz par PSS2B et formeurs de réseau (GFM).'
                : 'High-speed synchrophasor streaming (50 fps, GPS-locked) across the 225 kV backbone, inter-area angle difference monitoring, rotational kinetic inertia solver (H = 4.2 s, 1960 MJ) at Nachtigal, dynamic swing equation (RoCoF/Nadir), and active oscillation damping via PSS2B & Grid-Forming (GFM).'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('IEEE-C37.118')}
                className="px-3 py-2 rounded-xl bg-[#142A1E] hover:bg-[#1D3B2B] border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>IEEE C37.118 & 421.5</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#1C3827]">
          <button
            type="button"
            onClick={() => setActiveSubTab('wams_pmus')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'wams_pmus'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-[#0E1A14] text-neutral-300 hover:text-white border border-[#1D3525]'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Réseau Synchrophaseurs PMU & Vecteurs Polaires' : '1. PMU Synchrophasor Network & Polar Vectors'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('rocof_inertia')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'rocof_inertia'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-[#0E1A14] text-neutral-300 hover:text-white border border-[#1D3525]'
            }`}
          >
            <Gauge className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. Inertie Système (Hsys) & Simulateur RoCoF (df/dt)' : '2. System Inertia (Hsys) & RoCoF (df/dt) Solver'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('pss_damping')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'pss_damping'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-[#0E1A14] text-neutral-300 hover:text-white border border-[#1D3525]'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Modes d\'Oscillations & Amortissement PSS (IEEE 421.5)' : '3. Oscillation Modes & PSS Damping (IEEE 421.5)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('grid_forming')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'grid_forming'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-[#0E1A14] text-neutral-300 hover:text-white border border-[#1D3525]'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>{locale === 'fr' ? '4. Formeurs de Réseau (GFM / VSM) & Réponse Rapide' : '4. Grid-Forming (GFM / VSM) & Fast Frequency Response'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: WAMS PMU SYNCHROPHASORS & POLAR VECTORS                   */}
      {/* ==================================================================== */}
      {activeSubTab === 'wams_pmus' && (
        <div className="space-y-6">
          {/* Key WAMS Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A100E] border border-emerald-500/40">
              <div className="text-[10px] text-neutral-400 uppercase">Écart Angulaire Max (Δδ)</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                24.50° <span className="text-xs font-normal text-neutral-400">Nachtigal-Tchad</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Seuil d'alerte stabilité : &gt; 30.0°</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Fréquence Référence Nœud CNO</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                50.005 <span className="text-xs font-normal text-neutral-400">Hz</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">GPS Time-tagged ± 0.5 µs</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-emerald-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Erreur Vectorielle Totale (TVE)</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                0.042% <span className="text-xs font-normal text-neutral-400">IEEE C37.118</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Limite normative : TVE &lt; 1.00%</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Débit de Télémétrie WAMS</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                50 <span className="text-xs font-normal text-neutral-400">frames/sec</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Protocole IEC 61850-90-5 sur FO</div>
            </div>
          </div>

          {/* Synchrophasor Map & Polar Phasor Vector Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* PMU Nodes Table (7 cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Radio className="h-4 w-4 text-emerald-400" />
                  <span>Concentrateur de Données Phasorielles (PDC WAMS RIS/RIN)</span>
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                  6 PMU EN LIGNE
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1D3525] text-[10px] text-neutral-400 uppercase">
                      <th className="py-2 px-2">PMU Tag</th>
                      <th className="py-2 px-2">Poste Électrique 225 kV</th>
                      <th className="py-2 px-2 text-right">Tension |V|</th>
                      <th className="py-2 px-2 text-right">Angle (δ)</th>
                      <th className="py-2 px-2 text-right">RoCoF</th>
                      <th className="py-2 px-2 text-center">GPS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#15281E]">
                    {DEFAULT_PMU_NODES.map((pmu) => {
                      const isSelected = pmu.id === selectedPmuId;
                      return (
                        <tr
                          key={pmu.id}
                          onClick={() => setSelectedPmuId(pmu.id)}
                          className={`cursor-pointer transition-all ${
                            isSelected ? 'bg-[#12261B] text-emerald-200 font-bold' : 'hover:bg-[#0E1B14] text-neutral-300'
                          }`}
                        >
                          <td className="py-2 px-2 font-mono text-emerald-400">{pmu.tag}</td>
                          <td className="py-2 px-2 font-sans text-[11px] font-medium text-white">
                            {pmu.substationName}
                            <div className="text-[9px] text-neutral-400 font-mono">{pmu.distanceFromNachtigalKm} km de Nachtigal</div>
                          </td>
                          <td className="py-2 px-2 text-right font-mono">
                            {pmu.voltageMagnitudePu.toFixed(3)} pu
                            <div className="text-[8px] text-neutral-400 font-mono">({(pmu.voltageMagnitudePu * 225).toFixed(1)} kV)</div>
                          </td>
                          <td className="py-2 px-2 text-right font-mono font-bold">
                            <span className={Math.abs(pmu.voltageAngleDeg) > 20 ? 'text-amber-400' : 'text-cyan-300'}>
                              {pmu.voltageAngleDeg > 0 ? `+${pmu.voltageAngleDeg.toFixed(2)}` : pmu.voltageAngleDeg.toFixed(2)}°
                            </span>
                          </td>
                          <td className="py-2 px-2 text-right font-mono text-[10px]">
                            {pmu.rocofHzPerSec >= 0 ? `+${pmu.rocofHzPerSec.toFixed(3)}` : pmu.rocofHzPerSec.toFixed(3)} Hz/s
                          </td>
                          <td className="py-2 px-2 text-center">
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              LOCKED
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-xl bg-[#08120D] border border-[#183021] text-[10px] text-neutral-400 flex items-start gap-2">
                <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Principe WAMS IEEE C37.118 :</strong> Le poste 225 kV de Nachtigal sert de barre de référence (Slack Bus, angle δ = 0.00°). Les angles négatifs observés vers Edéa, Douala et N'Djamena reflètent l'écoulement naturel de la puissance active selon l'équation de transfert P = (V1 × V2 / X) × sin(δ1 - δ2).
                </p>
              </div>
            </div>

            {/* Polar Phasor Vector & Stability Margin (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Compass className="h-4 w-4 text-emerald-400" />
                  <span>Diagramme Polaire Synchrone</span>
                </h4>
                <span className="text-[9px] text-neutral-400 font-mono">Ref: Nachtigal 0.00°</span>
              </div>

              {/* Polar Plot Canvas representation */}
              <div className="relative h-56 w-full rounded-xl bg-[#060D09] border border-[#162D1F] flex items-center justify-center p-4">
                {/* Concentric voltage circles */}
                <div className="absolute h-44 w-44 rounded-full border border-dashed border-neutral-800 pointer-events-none" />
                <div className="absolute h-32 w-32 rounded-full border border-dashed border-neutral-800 pointer-events-none" />
                <div className="absolute h-20 w-20 rounded-full border border-dashed border-neutral-800 pointer-events-none" />
                <div className="absolute h-full w-0.5 bg-neutral-800 pointer-events-none" />
                <div className="absolute w-full h-0.5 bg-neutral-800 pointer-events-none" />

                <div className="absolute top-2 left-2 text-[8px] text-neutral-500 font-mono">|V| = 1.05 pu</div>
                <div className="absolute top-2 right-2 text-[8px] text-neutral-500 font-mono">0° (Slack)</div>
                <div className="absolute bottom-2 left-2 text-[8px] text-neutral-500 font-mono">-90°</div>

                {/* Draw vectors for each PMU */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-120 -120 240 240">
                  {DEFAULT_PMU_NODES.map((pmu) => {
                    const isSelected = pmu.id === selectedPmuId;
                    const radius = pmu.voltageMagnitudePu * 95; // scaling
                    const angleRad = (pmu.voltageAngleDeg * Math.PI) / 180;
                    const x = radius * Math.cos(angleRad);
                    const y = -radius * Math.sin(angleRad); // SVG Y is inverted

                    return (
                      <g key={pmu.id}>
                        <line
                          x1="0"
                          y1="0"
                          x2={x}
                          y2={y}
                          stroke={isSelected ? '#34D399' : pmu.id === 'PMU_NACHTIGAL_225' ? '#10B981' : '#06B6D4'}
                          strokeWidth={isSelected ? 3 : 1.5}
                          strokeDasharray={isSelected ? undefined : '2,2'}
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? 6 : 4}
                          fill={isSelected ? '#10B981' : '#3B82F6'}
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute bottom-2 right-2 text-[9px] text-emerald-400 font-bold">
                  {selectedPmu.tag} : {selectedPmu.voltageAngleDeg.toFixed(2)}°
                </div>
              </div>

              {/* Angular Stability Margin Box */}
              <div className="p-3.5 rounded-xl bg-[#0F1C15] border border-[#1E3A28] space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-neutral-400 uppercase font-bold">Marge de Stabilité Angulaire :</span>
                  <span className={`font-bold ${pmuMargin.marginPercent < 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {pmuMargin.marginPercent}% de réserve statique
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-[#08120D] overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      pmuMargin.marginPercent < 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pmuMargin.marginPercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[9px] text-neutral-300 pt-1">
                  <div>
                    P Transférée : <strong className="text-white">{pmuMargin.pTransferredPu} pu</strong>
                  </div>
                  <div>
                    P Max Transmissible : <strong className="text-cyan-300">{pmuMargin.pMaxPu} pu</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: SYSTEM INERTIA (Hsys) & ROCOF (df/dt) SOLVER               */}
      {/* ==================================================================== */}
      {activeSubTab === 'rocof_inertia' && (
        <div className="space-y-6">
          {/* Real-time System Kinetic Inertia Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A100E] border border-emerald-500/40">
              <div className="text-[10px] text-neutral-400 uppercase">Constante d'Inertie Globale (Hsys)</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {systemInertiaMetrics.hSysSeconds} <span className="text-xs font-normal text-neutral-400">secondes</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Seuil critique SONATREL : H &gt; 2.5 s</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Énergie Cinétique Tournante (Ek)</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                {systemInertiaMetrics.totalStoredKineticGws} <span className="text-xs font-normal text-neutral-400">GW·s</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Dont 1.96 GW·s fourni par Nachtigal</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">RoCoF Initial Théorique (t = 0+)</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {selectedContingency.expectedRocofHzPerSec > 0
                  ? `+${selectedContingency.expectedRocofHzPerSec.toFixed(2)}`
                  : selectedContingency.expectedRocofHzPerSec.toFixed(2)}{' '}
                <span className="text-xs font-normal text-neutral-400">Hz/s</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Limite déclenchement relais : 1.0 Hz/s</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Fréquence au Nadir (f_min)</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                {selectedContingency.expectedNadirHz.toFixed(2)}{' '}
                <span className="text-xs font-normal text-neutral-400">Hz</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Seuil 1er stade délestage : 49.00 Hz</div>
            </div>
          </div>

          {/* Fleet Inertia Breakdown & Contingency Trigger */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Generation Fleet Inertia Sliders (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  <span>Composition du Parc de Production & Inertie</span>
                </h3>
                <span className="text-[9px] text-neutral-400">Unités en ligne</span>
              </div>

              <div className="space-y-3">
                {fleet.map((plant) => (
                  <div
                    key={plant.id}
                    className="p-3 rounded-xl bg-[#0E1A14] border border-[#1D3525] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-white text-xs">{plant.plantName}</div>
                      <div className="text-[9px] text-neutral-400 font-mono">
                        H = {plant.inertiaConstantH} s • {plant.ratedCapacityMva} MVA • {plant.storedKineticEnergyMws.toFixed(0)} MJ
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleUnit(plant.id, -1)}
                        className="h-6 w-6 rounded bg-[#162D20] text-emerald-400 hover:bg-[#203E2D] font-black text-xs flex items-center justify-center border border-emerald-500/40"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-white text-xs min-w-[28px] text-center">
                        {plant.onlineUnits}/{plant.totalUnits}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleUnit(plant.id, 1)}
                        className="h-6 w-6 rounded bg-[#162D20] text-emerald-400 hover:bg-[#203E2D] font-black text-xs flex items-center justify-center border border-emerald-500/40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* FFR & GFM Toggles */}
              <div className="pt-2 border-t border-[#1C3827] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-300">Fast Frequency Response (FFR BESS 40 MW) :</span>
                  <button
                    type="button"
                    onClick={() => setEnableFfrGfm(!enableFfrGfm)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      enableFfrGfm ? 'bg-emerald-600 text-white' : 'bg-[#15281E] text-neutral-400'
                    }`}
                  >
                    {enableFfrGfm ? 'ACTIF (< 25 ms)' : 'DÉSACTIVÉ'}
                  </button>
                </div>
              </div>
            </div>

            {/* Contingency Selector & Dynamic Trajectory Chart (7 cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-emerald-400" />
                  <span>Trajectoire Dynamique de Fréquence (Équation d'Oscillation)</span>
                </h4>
                <span className="text-[9px] text-neutral-400 font-mono">0 à 12 secondes</span>
              </div>

              {/* Contingency Selector Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ROCOF_CONTINGENCIES.slice(0, 3).map((cnt) => (
                  <button
                    key={cnt.id}
                    type="button"
                    onClick={() => setSelectedContingencyId(cnt.id)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      selectedContingencyId === cnt.id
                        ? 'bg-[#142A1E] border-emerald-500/60 text-white'
                        : 'bg-[#08120D] border-[#1D3525] text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div className="text-[9px] font-mono text-emerald-400">{cnt.deltaPowerMw > 0 ? `+${cnt.deltaPowerMw} MW` : `${cnt.deltaPowerMw} MW`}</div>
                    <div className="text-[10px] font-bold line-clamp-1">{cnt.nameFr}</div>
                  </button>
                ))}
              </div>

              {/* Dynamic SVG Chart of Frequency Excursion */}
              <div className="p-4 rounded-xl bg-[#060D09] border border-[#15281E] space-y-2">
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span>Fréquence Réseau f(t) [Hz]</span>
                  <span className="text-emerald-400 font-bold">
                    Nadir : {selectedContingency.expectedNadirHz.toFixed(2)} Hz à t = {selectedContingency.timeToNadirSec} s
                  </span>
                </div>

                <div className="relative h-44 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                    {/* Reference line 50.0 Hz */}
                    <line x1="0" y1="50" x2="500" y2="50" stroke="#374151" strokeDasharray="3,3" strokeWidth="1" />
                    <text x="5" y="45" fill="#9CA3AF" fontSize="9" fontFamily="monospace">50.00 Hz</text>

                    {/* UFLS Stage 1 threshold at 49.00 Hz */}
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#EF4444" strokeDasharray="2,2" strokeWidth="1" />
                    <text x="5" y="115" fill="#EF4444" fontSize="8" fontFamily="monospace">Seuil Délestage UFLS : 49.00 Hz</text>

                    {/* Plot frequency trajectory curve */}
                    <polyline
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      points={frequencyTrajectory
                        .map((pt) => {
                          const x = (pt.time / 12.0) * 500;
                          // Map 50.5 Hz -> y=15, 50.0 Hz -> y=50, 49.0 Hz -> y=120, 48.5 Hz -> y=155
                          const y = 50 + (50.0 - pt.frequency) * 70;
                          return `${x},${Math.min(155, Math.max(10, y))}`;
                        })
                        .join(' ')}
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[9px] text-neutral-400 font-mono pt-1">
                  <span>t = 0 s (Défaut)</span>
                  <span>t = 3 s (Nadir & FFR)</span>
                  <span>t = 6 s (Régulateurs Francis)</span>
                  <span>t = 12 s (Stabilisation)</span>
                </div>
              </div>

              {/* Swing Equation Formula Box */}
              <div className="p-3 rounded-xl bg-[#08120D] border border-[#183021] text-[10px] text-neutral-400 space-y-1">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Équation d'Oscillation Régissant le RoCoF :</span>
                </div>
                <p className="font-mono text-cyan-300">
                  df/dt = (f0 × ΔP) / (2 × Hsys × Ssys) = (50 × {selectedContingency.deltaPowerMw} MW) / (2 × {systemInertiaMetrics.hSysSeconds} s × {systemInertiaMetrics.totalOnlineMva} MVA)
                </p>
                <p className="text-[9px]">
                  La haute inertie mécanique des 7 turbines Francis de Nachtigal amortit la pente initiale, permettant aux régulateurs hydrauliques d'intervenir sans atteindre le seuil de délestage d'urgence UFLS (49.00 Hz).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: ELECTROMECHANICAL OSCILLATIONS & PSS DAMPING (IEEE 421.5)  */}
      {/* ==================================================================== */}
      {activeSubTab === 'pss_damping' && (
        <div className="space-y-6">
          {/* Key PSS Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A100E] border border-emerald-500/40">
              <div className="text-[10px] text-neutral-400 uppercase">Taux d'Amortissement avec PSS2B (ζ)</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                14.8% <span className="text-xs font-normal text-neutral-400">robuste</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Norme IEEE / ENTSO-E : ζ &gt; 5.0%</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-red-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Taux d'Amortissement SANS PSS</div>
              <div className="text-2xl font-black text-red-400 mt-1">
                1.8% <span className="text-xs font-normal text-neutral-400">instable</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Risque d'écroulement angulaire</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-cyan-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Gain Stabilisateur Ks1</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                {pssConfig.gainKs1.toFixed(1)}{' '}
                <span className="text-xs font-normal text-neutral-400">pu</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Filtre passe-bande 0.1 - 2.5 Hz</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A100E] border border-purple-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Mode Dominant Inter-Zones</div>
              <div className="text-2xl font-black text-purple-300 mt-1">
                0.65 <span className="text-xs font-normal text-neutral-400">Hz</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Centre (Nachtigal) vs Littoral (Douala)</div>
            </div>
          </div>

          {/* Oscillation Modes Table & PSS Controller Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Modes Table (7 cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <span>Modes d'Oscillations Électromécaniques Identifiés (Analyse Modale WAMS)</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEnablePss(!enablePss)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    enablePss ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                  }`}
                >
                  {enablePss ? 'STABILISATEUR PSS EN SERVICE' : 'PSS BYPASSÉ (DANGER)'}
                </button>
              </div>

              <div className="space-y-3">
                {OSCILLATION_MODES.map((mode) => {
                  const currentDamping = enablePss ? mode.dampingRatioWithPssPercent : mode.dampingRatioWithoutPssPercent;
                  const isSafe = currentDamping >= 5.0;

                  return (
                    <div key={mode.id} className="p-3.5 rounded-xl bg-[#0E1A14] border border-[#1D3525] space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white text-xs block">{mode.modeNameFr}</span>
                          <span className="text-[9px] text-neutral-400 font-mono">
                            Fréquence modale : <strong className="text-cyan-300">{mode.frequencyHz} Hz</strong> • Type : {mode.type}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-neutral-400 block uppercase">Amortissement ζ :</span>
                          <span className={`text-base font-black font-mono ${isSafe ? 'text-emerald-400' : 'text-red-400 animate-pulse'}`}>
                            {currentDamping.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-[#08120D] overflow-hidden">
                        <div
                          className={`h-full ${isSafe ? 'bg-emerald-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(100, currentDamping * 5)}%` }}
                        />
                      </div>

                      <p className="text-[9px] text-neutral-300 font-sans">{mode.riskDescriptionFr}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PSS2B Architecture & Transfer Function Block (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-emerald-400" />
                  <span>Régulateur PSS2B (IEEE 421.5)</span>
                </h4>
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  DUAL INPUT Δω / ΔPa
                </span>
              </div>

              {/* Block Diagram schematic representation */}
              <div className="p-4 rounded-xl bg-[#060D09] border border-[#162D1F] space-y-2 text-[10px]">
                <div className="text-emerald-300 font-bold uppercase">Chaîne de Traitement PSS2B :</div>
                <div className="p-2.5 rounded-lg bg-[#0A140F] border border-[#1C3827] space-y-1 font-mono text-[9px] text-neutral-300">
                  <div>1. Entrée 1 : Écart de pulsation rotorique Δω</div>
                  <div>2. Entrée 2 : Puissance mécanique intégrée ∫(Pm - Pe)</div>
                  <div>3. Filtres Washout (Tw1 = {pssConfig.washoutTw1Sec}s, Tw2 = {pssConfig.washoutTw2Sec}s)</div>
                  <div>4. Filtres Avance-Retard Lead-Lag (T1={pssConfig.leadLagT1Sec}s, T2={pssConfig.leadLagT2Sec}s)</div>
                  <div>5. Écrêteur de sortie : ± {pssConfig.outputLimitVstMaxPu} pu vers l'AVR</div>
                </div>
              </div>

              {/* PSS Settings Tuning Controls */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-300 mb-1">
                    <span>Gain PSS Ks1 :</span>
                    <span className="font-bold text-cyan-300">{pssConfig.gainKs1.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={pssConfig.gainKs1}
                    onChange={(e) => setPssConfig((prev) => ({ ...prev, gainKs1: parseFloat(e.target.value) }))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-300 mb-1">
                    <span>Constante d'Avance T1 (sec) :</span>
                    <span className="font-bold text-cyan-300">{pssConfig.leadLagT1Sec.toFixed(2)} s</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.40"
                    step="0.01"
                    value={pssConfig.leadLagT1Sec}
                    onChange={(e) => setPssConfig((prev) => ({ ...prev, leadLagT1Sec: parseFloat(e.target.value) }))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#08120D] border border-[#183021] text-[9px] text-neutral-400">
                L'injection du signal stabilisateur PSS2B sur le régulateur de tension statique (AVR) crée un couple d'amortissement électrique en phase avec la vitesse rotorique, annihilant les oscillations électromécaniques entre le Centre et le Littoral.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 4: GRID-FORMING (GFM / VSM) & FAST FREQUENCY RESPONSE (FFR) */}
      {/* ==================================================================== */}
      {activeSubTab === 'grid_forming' && (
        <div className="space-y-6">
          {/* Architecture Comparison: GFM vs GFL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grid-Forming Card */}
            <div className="p-5 rounded-2xl border border-emerald-500/50 bg-[#0A100E] space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Onduleurs Formeurs de Réseau (Grid-Forming GFM)</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold border border-emerald-700">
                  SOURCE DE TENSION (VSM)
                </span>
              </div>

              <ul className="space-y-2 text-[11px] text-neutral-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Inertie Synthétique Instantanée :</strong> Réaction en &lt; 20 ms sans mesure de fréquence (émulation de machine synchrone VSM).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Capacité de Black-Start :</strong> Capable d'établir la tension et la fréquence à vide sans signal réseau préexistant.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Stabilité en Réseau Faible :</strong> Fonctionne avec un ratio de court-circuit SCR &lt; 1.5.</span>
                </li>
              </ul>

              <div className="p-3 rounded-xl bg-[#0E1A14] border border-[#1D3525] text-[10px] space-y-1">
                <div className="text-emerald-300 font-bold uppercase">Application Système BESS Nachtigal (40 MW / 80 MWh) :</div>
                <p className="text-neutral-400">
                  Fournit une inertie virtuelle H = 5.5 s pour combler le temps mort hydrodynamique de la colonne d'eau (Tw = 1.45 s).
                </p>
              </div>
            </div>

            {/* Grid-Following Card */}
            <div className="p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#1D3525]">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Onduleurs Suiveurs de Réseau (Grid-Following GFL)</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[9px] font-bold border border-amber-700">
                  SOURCE DE COURANT (PLL)
                </span>
              </div>

              <ul className="space-y-2 text-[11px] text-neutral-300">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Dépendance à la Boucle PLL :</strong> Nécessite une tension de référence rigide pour synchroniser son courant injecté.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Inertie Physique Nulle :</strong> Aggrave la raideur du RoCoF en cas de déconnexion d'un groupe synchrone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Instabilité en Réseau Faible :</strong> Risque de décrochage de la PLL si le SCR passe sous 2.0.</span>
                </li>
              </ul>

              <div className="p-3 rounded-xl bg-[#0E1A14] border border-[#1D3525] text-[10px] space-y-1">
                <div className="text-amber-300 font-bold uppercase">Application Solaire Flottant (50 MWp) :</div>
                <p className="text-neutral-400">
                  Fonctionne en mode suiveur standard avec limitation de rampe et participation à la réserve primaire selon consigne CNO.
                </p>
              </div>
            </div>
          </div>

          {/* Standards & Technical Norms Grid */}
          <div className="p-5 rounded-2xl border border-[#1D3525] bg-[#0A100E] space-y-3">
            <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Conformité aux Normes Internationales de Stabilité Réseau</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px]">
              <div className="p-3 rounded-xl bg-[#0F1C15] border border-[#1E3A28]">
                <strong className="text-emerald-400 block font-mono">IEEE C37.118.1 / C37.118.2</strong>
                <p className="text-neutral-400 mt-1">
                  Norme mondiale de mesure synchrophasorielle PMU : Précision TVE &lt; 1%, dérive temporelle GPS &lt; 1 µs, flux temps réel 50 Hz.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0F1C15] border border-[#1E3A28]">
                <strong className="text-emerald-400 block font-mono">IEEE 421.5 (PSS2B & PSS4B)</strong>
                <p className="text-neutral-400 mt-1">
                  Recommandations pour la modélisation et le réglage des stabilisateurs de puissance sur alternateurs synchrones.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0F1C15] border border-[#1E3A28]">
                <strong className="text-emerald-400 block font-mono">IEC 61850-90-5 WAMS</strong>
                <p className="text-neutral-400 mt-1">
                  Routage synchrophasoriel sur réseau optique télécom sécurisé sous protocole UDP/IP multicast.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
