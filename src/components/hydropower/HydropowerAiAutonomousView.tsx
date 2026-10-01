// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 16 : CONDUITE AUTONOME PAR IA & PINN
// Physics-Informed Neural Networks (PINN), DRL Dispatch & Autonomous SCADA Resolver
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Bot,
  Brain,
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame,
  Droplets,
  Radio,
  Clock,
  RotateCcw,
} from 'lucide-react';
import {
  generatePinnCavitationProfile,
  DRL_DISPATCH_SCENARIOS,
  AUTONOMOUS_INCIDENTS_LOG,
} from '../../data/hydropowerAiAutonomousData';
import type { AiAutonomyLevel } from '../../types/hydropowerAiAutonomous';

interface HydropowerAiAutonomousViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
  onSelectSubsystem?: (subsystemId: string) => void;
}

export const HydropowerAiAutonomousView: React.FC<HydropowerAiAutonomousViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pinn' | 'drl' | 'incidents'>('pinn');

  // Autonomy Level state
  const [autonomyLevel, setAutonomyLevel] = useState<AiAutonomyLevel>('L3_HIGH_AUTONOMY');

  // Sub-Tab 1: PINN parameters
  const [netHeadM, setNetHeadM] = useState<number>(50.0);
  const [tailwaterM, setTailwaterM] = useState<number>(355.2);

  // Sub-Tab 2: DRL Scenario
  const [drlScenario, setDrlScenario] = useState<'peak_revenue' | 'wear_minimization' | 'frequency_stabilization'>('peak_revenue');

  // PINN Profile calculation
  const pinnProfile = useMemo(() => {
    return generatePinnCavitationProfile(netHeadM, tailwaterM);
  }, [netHeadM, tailwaterM]);

  // Max cavitation risk point
  const worstPoint = useMemo(() => {
    return pinnProfile.reduce((prev, curr) =>
      curr.predictedVaporFractionPercent > prev.predictedVaporFractionPercent ? curr : prev
    );
  }, [pinnProfile]);

  const activeDrl = DRL_DISPATCH_SCENARIOS[drlScenario];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0C1A1A] via-[#102424] to-[#0A1616] border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-widest">
                {locale === 'fr' ? 'ÉTAPE 16 • CONDUITE AUTONOME PAR IA & RÉSEAUX PINN' : 'STEP 16 • AUTONOMOUS AI & PINN NEURAL OPERATOR'}
              </span>
              <span className="text-xs font-mono text-neutral-400">IEEE 2800 / IEC 61850-7-420 / PINN / DRL PPO</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <Bot className="h-6 w-6 text-emerald-400" />
              <span>
                {locale === 'fr'
                  ? 'Conduite Autonome de Centrale, Réseaux PINN & Résolution d\'Incidents'
                  : 'Autonomous Plant Operations, PINN Cavitation Physics & Incident AI'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Gouverneur neural autonome à base de réseaux de neurones informés par la physique (PINN), optimisation temps réel par apprentissage par renforcement profond (DRL) et résolution cyber-physique autonome.'
                : 'Physics-Informed Neural Network (PINN) cavitation modeling, Deep Reinforcement Learning (DRL) water-to-wire dispatch, and self-healing autonomous SCADA resolver.'}
            </p>
          </div>

          {/* Autonomy Level Indicator */}
          <div className="flex flex-col items-end gap-1.5 self-start md:self-auto">
            <div className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
              {locale === 'fr' ? 'Niveau d\'Autonomie IA' : 'AI Autonomy Level'}
            </div>
            <div className="flex items-center gap-1 bg-[#142A2A] p-1 rounded-xl border border-emerald-500/40">
              {(['L1_ASSISTED', 'L2_CONDITIONAL', 'L3_HIGH_AUTONOMY', 'L4_FULL_AUTONOMOUS'] as AiAutonomyLevel[]).map(
                (lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setAutonomyLevel(lvl)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      autonomyLevel === lvl
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lvl.replace('_', ' ')}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#1C3333]">
          <button
            type="button"
            onClick={() => setActiveSubTab('pinn')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'pinn'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-[#122424] text-neutral-300 hover:text-white border border-[#203D3D]'
            }`}
          >
            <Brain className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Réseau PINN Cavitation & Usure' : '1. PINN Cavitation Physics'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('drl')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'drl'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-[#122424] text-neutral-300 hover:text-white border border-[#203D3D]'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. Dispatching DRL (Deep Q-Learning)' : '2. DRL Dispatch Policy'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('incidents')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'incidents'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-[#122424] text-neutral-300 hover:text-white border border-[#203D3D]'
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Résolution Autonome d\'Incidents' : '3. Self-Healing Incident Log'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: PINN CAVITATION & VORTEX PREDICTION                      */}
      {/* ==================================================================== */}
      {activeSubTab === 'pinn' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Top KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0A0E14] border border-emerald-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Indicateur Thoma σ Plante</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {pinnProfile[0].sigmaPlant} <span className="text-xs font-normal text-neutral-400">σ</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Marge de sécurité : +14.8%</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-amber-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Taux de Vapeur Maximum</div>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {worstPoint.predictedVaporFractionPercent} <span className="text-xs font-normal text-neutral-400">%</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Sous débit 142 m³/s</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-[#252E38]">
              <div className="text-[10px] text-neutral-400 uppercase">Usure Érosive Estimée</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                {worstPoint.erosionRateMmPerYear} <span className="text-xs font-normal text-neutral-400">mm/an</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Plafond admissible : 1.5 mm/an</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E14] border border-emerald-500/30">
              <div className="text-[10px] text-neutral-400 uppercase">Confiance Modèle PINN</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                98.2 <span className="text-xs font-normal text-neutral-400">%</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Rayleigh-Plesset Loss &lt; 0.004</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  <span>{locale === 'fr' ? 'Conditions Hydrauliques PINN' : 'Hydraulic Boundary Conditions'}</span>
                </h3>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Chute Nette H_net :' : 'Net Head H_net:'}</span>
                  <span className="text-emerald-400 font-bold">{netHeadM} m</span>
                </div>
                <input
                  type="range"
                  min="42"
                  max="55"
                  step="0.5"
                  value={netHeadM}
                  onChange={(e) => setNetHeadM(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Niveau Restitution Aval :' : 'Tailwater Level:'}</span>
                  <span className="text-cyan-300 font-bold">{tailwaterM} m</span>
                </div>
                <input
                  type="range"
                  min="352"
                  max="358"
                  step="0.2"
                  value={tailwaterM}
                  onChange={(e) => setTailwaterM(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2 text-[11px] text-neutral-300">
                <div className="text-emerald-400 font-bold text-[10px] uppercase">
                  {locale === 'fr' ? 'Équation Physique PINN Intégrée :' : 'Embedded PINN PDE Physics:'}
                </div>
                <p className="leading-relaxed font-mono text-cyan-300">
                  {'∂α/∂t + ∇·(αu) = (ρ_l·ρ_v / ρ) · [3α(1-α) / R_b] · √[(2/3)·|p_v - p| / ρ_l]'}
                </p>
                <div className="text-[9px] text-neutral-500">
                  Résolution couplée Navier-Stokes RANS + Rayleigh-Plesset par rétropropagation de gradient.
                </div>
              </div>
            </div>

            {/* PINN Output Table (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Brain className="h-4 w-4 text-emerald-400" />
                <span>{locale === 'fr' ? 'Prédiction PINN Multi-Points (Régimes de Débit)' : 'PINN Multi-Regime Prediction Profile'}</span>
              </h4>

              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-[#0A0E14]">
                    <tr className="border-b border-[#252E38] text-neutral-400 text-[10px] uppercase">
                      <th className="py-2 px-2.5">Débit Unit.</th>
                      <th className="py-2 px-2.5">Thoma σ Plante</th>
                      <th className="py-2 px-2.5">Thoma σ Crit.</th>
                      <th className="py-2 px-2.5">Vapeur PINN</th>
                      <th className="py-2 px-2.5">Usure/an</th>
                      <th className="py-2 px-2.5">Action IA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A2330]">
                    {pinnProfile.map((pt) => (
                      <tr key={pt.timeIndex} className="hover:bg-[#141A23]/50">
                        <td className="py-2 px-2.5 font-bold text-white">{pt.dischargeM3s} m³/s</td>
                        <td className="py-2 px-2.5 text-emerald-400 font-bold">{pt.sigmaPlant}</td>
                        <td className="py-2 px-2.5 text-neutral-300">{pt.sigmaCritical}</td>
                        <td className="py-2 px-2.5">
                          <span
                            className={`font-bold ${
                              pt.predictedVaporFractionPercent > 0.5 ? 'text-red-400' : 'text-emerald-400'
                            }`}
                          >
                            {pt.predictedVaporFractionPercent}%
                          </span>
                        </td>
                        <td className="py-2 px-2.5 text-amber-300 font-bold">{pt.erosionRateMmPerYear} mm</td>
                        <td className="py-2 px-2.5">
                          {pt.recommendedVaneTrimPercent > 0 ? (
                            <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 text-[9px] font-bold">
                              TRIM -{pt.recommendedVaneTrimPercent}%
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold">
                              NOMINAL
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: DRL DEEP REINFORCEMENT LEARNING DISPATCH                 */}
      {/* ==================================================================== */}
      {activeSubTab === 'drl' && (
        <div className="space-y-6 font-mono text-xs">
          {/* Scenario Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: 'peak_revenue', titleFr: '1. Rente Spot Maximale', titleEn: '1. Peak Spot Revenue' },
              { id: 'wear_minimization', titleFr: '2. Préservation Longévité', titleEn: '2. Asset Life Preservation' },
              { id: 'frequency_stabilization', titleFr: '3. Réserve Primaire FCR', titleEn: '3. Primary FCR Reserve' },
            ].map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => setDrlScenario(sc.id as any)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  drlScenario === sc.id
                    ? 'bg-[#142A2A] border-emerald-500/60 shadow-lg ring-1 ring-emerald-500/40'
                    : 'bg-[#0A0E14] border-[#252E38] hover:bg-[#141A23]'
                }`}
              >
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Politique DRL PPO</div>
                <div className="text-sm font-bold text-white mt-1">
                  {locale === 'fr' ? sc.titleFr : sc.titleEn}
                </div>
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono">
                  {locale === 'fr' ? 'Décision DRL Actuelle & Fonction de Récompense' : 'Live DRL Agent Policy Output'}
                </h3>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                SCORE REWARD : {activeDrl.dynamicRewardScore} / 100
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38]">
                <div className="text-[9px] text-neutral-400 uppercase">Débit Turbiné Optimal</div>
                <div className="text-xl font-black text-cyan-300 mt-1">
                  {activeDrl.targetDischargeM3s} <span className="text-xs font-normal">m³/s</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38]">
                <div className="text-[9px] text-neutral-400 uppercase">Groupes Francis Engagés</div>
                <div className="text-xl font-black text-emerald-400 mt-1">
                  {activeDrl.activeUnitsCount} / 7 <span className="text-xs font-normal">groupes</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38]">
                <div className="text-[9px] text-neutral-400 uppercase">Rendement Global Usine</div>
                <div className="text-xl font-black text-white mt-1">
                  {activeDrl.efficiencyPercent} <span className="text-xs font-normal">%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#141A23] border border-[#252E38]">
                <div className="text-[9px] text-neutral-400 uppercase">Fréquence Réseau Cible</div>
                <div className="text-xl font-black text-emerald-300 mt-1">
                  {activeDrl.gridFrequencyHz} <span className="text-xs font-normal">Hz</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141A23] border border-emerald-500/30 text-xs text-neutral-200 leading-relaxed">
              <div className="text-emerald-400 font-bold uppercase text-[10px] mb-1">
                {locale === 'fr' ? 'Justification de la Décision par l\'Agent IA :' : 'Agent Decision Rationale:'}
              </div>
              <p>{activeDrl.actionRationale[locale]}</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: SELF-HEALING INCIDENT RESOLVER AUDIT LOG                  */}
      {/* ==================================================================== */}
      {activeSubTab === 'incidents' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono">
                  {locale === 'fr' ? 'Journal des Interventions Autonomes de l\'Agent IA' : 'Autonomous AI Self-Healing Event Log'}
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                SUPERVISION HUMAN-IN-THE-LOOP ACTIVE
              </span>
            </div>

            <div className="space-y-4">
              {AUTONOMOUS_INCIDENTS_LOG.map((event, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-neutral-400" />
                      <span className="text-white font-bold">{event.timestamp}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          event.severity === 'high'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {event.eventType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 text-[10px]">Fenêtre d'annulation opérateur :</span>
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold text-[10px]">
                        {event.humanOverrideWindowSeconds}s
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px]">
                        {event.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Sensor Inputs */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {event.sensorInputs.map((sensor, sIdx) => (
                      <div
                        key={sIdx}
                        className="px-2.5 py-1 rounded bg-[#0A0E14] border border-[#252E38] text-[10px]"
                      >
                        <span className="text-neutral-400">{sensor.name} : </span>
                        <strong className="text-cyan-300">{sensor.value}</strong>
                      </div>
                    ))}
                  </div>

                  {/* PINN Analysis */}
                  <div className="text-[11px] text-neutral-300">
                    <span className="text-neutral-400 font-bold block text-[10px] uppercase">
                      Diagnostic PINN Temps Réel :
                    </span>
                    <p className="mt-0.5 text-neutral-200">{event.pinnAnalysis[locale]}</p>
                  </div>

                  {/* Action Taken */}
                  <div className="p-3 rounded-lg bg-[#0F1E1E] border border-emerald-500/40 text-[11px] text-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-[10px] uppercase">
                        Action Autonome Exécutée :
                      </strong>
                      <p className="mt-0.5">{event.autonomousActionTaken[locale]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
