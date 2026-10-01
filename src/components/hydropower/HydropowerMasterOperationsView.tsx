// ============================================================================
// HYDROPOWER DIGITAL TWIN — ÉTAPE 10 : CONDUITE AUTONOME, APM & DOSSIER MAÎTRE
// Master Operations, Unit Commitment, ISO 55000 Major Overhaul, PPA & Dossier
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Sliders,
  Calendar,
  DollarSign,
  FileText,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Flame,
  Activity,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  calculateUnitCommitment,
  MAJOR_OVERHAUL_SCHEDULE,
  calculatePpaFinancials,
  MASTER_DOSSIER_SECTIONS,
  generateFullMarkdownDossier,
} from '../../data/hydropowerMasterOpsData';
import type { OverhaulTaskItem } from '../../types/hydropowerMasterOps';

interface HydropowerMasterOperationsViewProps {
  locale: 'fr' | 'en';
  onNavigateStandard?: (standardId: string) => void;
  onSelectSubsystem?: (subsystemId: string) => void;
}

export const HydropowerMasterOperationsView: React.FC<HydropowerMasterOperationsViewProps> = ({
  locale,
  onNavigateStandard,
  onSelectSubsystem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'dispatch' | 'overhaul' | 'ppa' | 'dossier'>('dispatch');

  // Sub-Tab 1: Autonomous Dispatch State
  const [sanagaInflowM3s, setSanagaInflowM3s] = useState<number>(750);
  const [netHeadM, setNetHeadM] = useState<number>(50.0);

  // Sub-Tab 2: Overhaul Gantt State
  const [selectedTaskId, setSelectedTaskId] = useState<string>('TASK-04');
  const [onlyCriticalPath, setOnlyCriticalPath] = useState<boolean>(false);

  // Sub-Tab 3: PPA & Carbon State
  const [annualGenGWh, setAnnualGenGWh] = useState<number>(2900);
  const [availabilityRate, setAvailabilityRate] = useState<number>(96.8);

  // Sub-Tab 4: Dossier State
  const [expandedSection, setExpandedSection] = useState<string>('SEC-01');
  const [copiedDossier, setCopiedDossier] = useState<boolean>(false);

  // Solvers
  const dispatchResult = useMemo(() => {
    return calculateUnitCommitment(sanagaInflowM3s, netHeadM);
  }, [sanagaInflowM3s, netHeadM]);

  const ppaResult = useMemo(() => {
    return calculatePpaFinancials(annualGenGWh, availabilityRate);
  }, [annualGenGWh, availabilityRate]);

  const activeTask = MAJOR_OVERHAUL_SCHEDULE.find((t) => t.id === selectedTaskId) || MAJOR_OVERHAUL_SCHEDULE[0];

  const filteredTasks = useMemo(() => {
    if (onlyCriticalPath) {
      return MAJOR_OVERHAUL_SCHEDULE.filter((t) => t.isCriticalPath);
    }
    return MAJOR_OVERHAUL_SCHEDULE;
  }, [onlyCriticalPath]);

  const handleCopyDossier = () => {
    const md = generateFullMarkdownDossier(locale);
    navigator.clipboard.writeText(md);
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2500);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0E1522] via-[#121B2B] to-[#0A101C] border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-96 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
                {locale === 'fr' ? 'ÉTAPE 10 • CONDUITE OPÉRATIONNELLE & DOSSIER MAÎTRE' : 'STEP 10 • MASTER OPERATIONS & SYNTHESIS'}
              </span>
              <span className="text-xs font-mono text-neutral-400">ISO 55000 / IEEE 1147 / CIGRE</span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2.5">
              <Cpu className="h-6 w-6 text-amber-400" />
              <span>
                {locale === 'fr'
                  ? 'Cockpit de Conduite Autonome, Gestion d\'Actifs (APM) & Dossier d\'Ingénierie'
                  : 'Autonomous Dispatch Cockpit, Asset Overhaul (ISO 55000) & Master Dossier'}
              </span>
            </h2>
            <p className="text-xs text-neutral-300 max-w-3xl mt-1">
              {locale === 'fr'
                ? 'Optimisation du démarrage des 7 groupes Nachtigal (Unit Commitment), planification sur chemin critique des arrêts majeurs de tranche, contrat d\'achat PPA (42 FCFA/kWh) et dossier d\'ingénierie complet exportable.'
                : 'Automated 7-unit dispatch commitment (BEP tracking), critical-path major overhaul planning, PPA off-take economics, and comprehensive multi-step engineering technical submission dossier.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {onNavigateStandard && (
              <button
                type="button"
                onClick={() => onNavigateStandard('ISO-55001')}
                className="px-3 py-2 rounded-xl bg-[#172335] hover:bg-[#1E2E44] border border-amber-500/40 text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>ISO 55001 APM</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#1C2634]">
          <button
            type="button"
            onClick={() => setActiveSubTab('dispatch')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'dispatch'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-[#172335] text-neutral-300 hover:text-white border border-[#26374E]'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>{locale === 'fr' ? '1. Conduite & Unit Commitment (7x60 MW)' : '1. Unit Commitment Dispatch'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('overhaul')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'overhaul'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-[#172335] text-neutral-300 hover:text-white border border-[#26374E]'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>{locale === 'fr' ? '2. Arrêt Majeur de Tranche (Gantt ISO 55000)' : '2. Major Overhaul Gantt (ISO 55000)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ppa')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'ppa'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-[#172335] text-neutral-300 hover:text-white border border-[#26374E]'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>{locale === 'fr' ? '3. Contrat PPA & Crédits CO₂' : '3. PPA Revenue & Carbon Credits'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('dossier')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'dossier'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-[#172335] text-neutral-300 hover:text-white border border-[#26374E]'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>{locale === 'fr' ? '4. Dossier d\'Ingénierie Maître (Export)' : '4. Master Engineering Dossier'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: AUTONOMOUS DISPATCH & UNIT COMMITMENT                     */}
      {/* ==================================================================== */}
      {activeSubTab === 'dispatch' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls & Unit Matrix (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-5 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Optimiseur de Conduite & Répartition de Débit' : 'Unit Commitment Dispatch Solver'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300">
                  MPC REAL-TIME
                </span>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Débit Disponible Sanaga :' : 'Sanaga Available Flow:'}</span>
                    <span className="text-cyan-400 font-bold">{sanagaInflowM3s} m³/s</span>
                  </div>
                  <input
                    type="range"
                    min="250"
                    max="1250"
                    step="25"
                    value={sanagaInflowM3s}
                    onChange={(e) => setSanagaInflowM3s(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-[10px] text-neutral-500 mt-0.5">Capacité usine max : 980 m³/s</div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>{locale === 'fr' ? 'Chute Nette H_net :' : 'Effective Net Head:'}</span>
                    <span className="text-amber-400 font-bold">{netHeadM} m</span>
                  </div>
                  <input
                    type="range"
                    min="42"
                    max="55"
                    step="0.5"
                    value={netHeadM}
                    onChange={(e) => setNetHeadM(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="text-[10px] text-neutral-500 mt-0.5">Nominale : 50.0 m</div>
                </div>
              </div>

              {/* Nachtigal 7 Generating Units Bay Schematic */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] text-neutral-400 uppercase font-bold flex justify-between">
                  <span>{locale === 'fr' ? 'État des 7 Groupes Turbines Francis (7 x 60 MW) :' : '7 Francis Turbine Units Status (7 x 60 MW):'}</span>
                  <span className="text-amber-400 font-bold">{dispatchResult.activeUnitsCount} / 7 En Ligne</span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {[1, 2, 3, 4, 5, 6, 7].map((unitIdx) => {
                    const isOnline = unitIdx <= dispatchResult.activeUnitsCount;
                    return (
                      <div
                        key={unitIdx}
                        className={`p-2.5 rounded-xl border transition-all ${
                          isOnline
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                            : 'bg-[#141A23] border-[#252E38] text-neutral-500'
                        }`}
                      >
                        <div className="text-[10px] font-bold">G{unitIdx}</div>
                        <div className="text-[9px] uppercase font-bold mt-1">
                          {isOnline ? 'ON' : 'OFF'}
                        </div>
                        <div className="text-[8px] font-mono mt-0.5">
                          {isOnline ? `${(dispatchResult.totalPlantPowerMW / dispatchResult.activeUnitsCount).toFixed(0)} MW` : 'Standby'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendation Box */}
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  dispatchResult.vortexRopeRisk
                    ? 'border-red-500/50 bg-red-950/20 text-red-200'
                    : 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold uppercase text-[10px] mb-1">
                  {dispatchResult.vortexRopeRisk ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                  <span>{locale === 'fr' ? 'Directive du Système de Conduite :' : 'Dispatch Advisory:'}</span>
                </div>
                {dispatchResult.recommendationExplanation[locale]}
              </div>
            </div>

            {/* Right Telemetries & Power Indicators (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 font-mono text-xs">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-400" />
                    <span>{locale === 'fr' ? 'Bilan Énergétique Instantané' : 'Plant Output Metrics'}</span>
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300">
                    η = {(dispatchResult.activeUnitEfficiency * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-linear-to-br from-[#141E2C] to-[#0D1520] border border-cyan-500/30 text-center space-y-1">
                  <div className="text-[10px] text-neutral-400 uppercase">Puissance Totale Injectée 225 kV</div>
                  <div className="text-3xl font-black text-cyan-300 font-mono tracking-tight">
                    {dispatchResult.totalPlantPowerMW} MW
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    sur 420.0 MW nominal ({( (dispatchResult.totalPlantPowerMW / 420) * 100).toFixed(1)}% du parc)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-neutral-400 text-[9px] uppercase">Débit Turbiné/Groupe</div>
                    <div className="text-sm font-bold text-amber-300 mt-0.5">{dispatchResult.flowPerActiveUnitM3s} m³/s</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-neutral-400 text-[9px] uppercase">Débit Déversé Crue</div>
                    <div className="text-sm font-bold text-white mt-0.5">{dispatchResult.spilledFlowM3s} m³/s</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-neutral-400 text-[9px] uppercase">Production Estimée</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">{dispatchResult.annualEnergyYieldGWh} GWh/an</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#141A23] border border-[#252E38]">
                    <div className="text-neutral-400 text-[9px] uppercase">Risque Torche Aspirateur</div>
                    <div className={`text-sm font-bold mt-0.5 ${dispatchResult.vortexRopeRisk ? 'text-red-400' : 'text-emerald-400'}`}>
                      {dispatchResult.vortexRopeRisk ? 'ACTIF' : 'NÉGLIGEABLE'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: MAJOR OVERHAUL GANTT & ASSET PERFORMANCE (ISO 55000)      */}
      {/* ==================================================================== */}
      {activeSubTab === 'overhaul' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252E38]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span>{locale === 'fr' ? 'Plan Pluriannuel d\'Arrêt Majeur de Tranche (25 Jours)' : 'Major Overhaul 25-Day Outage Schedule'}</span>
                </h3>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  Révision générale décennale (ISO 55001 / IEEE 1147) programmée en étiage Sanaga
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOnlyCriticalPath(!onlyCriticalPath)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    onlyCriticalPath
                      ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                      : 'bg-[#141A23] text-neutral-300 border border-[#252E38]'
                  }`}
                >
                  {onlyCriticalPath ? 'Chemin Critique Seulement' : 'Tous les Lots de Travaux'}
                </button>
              </div>
            </div>

            {/* Visual Gantt Timeline */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[650px] space-y-2">
                {/* Day Markers 1 to 25 */}
                <div className="grid grid-cols-25 text-center text-[8px] text-neutral-500 border-b border-[#252E38] pb-1">
                  {Array.from({ length: 25 }, (_, i) => i + 1).map((day) => (
                    <div key={day}>J{day}</div>
                  ))}
                </div>

                {filteredTasks.map((task) => {
                  const isSelected = selectedTaskId === task.id;
                  const colStart = task.startDay;
                  const colSpan = task.durationDays;

                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => setSelectedTaskId(task.id)}
                      className={`w-full text-left p-2 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-950/20'
                          : 'border-[#252E38] bg-[#141A23] hover:bg-[#1A2330]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1 text-[11px]">
                        <span className="font-bold text-white flex items-center gap-2">
                          <span className="text-amber-400">{task.id}</span>
                          <span>{task.title[locale]}</span>
                        </span>
                        <span className="text-neutral-400 text-[10px]">
                          {task.durationDays}j (J{task.startDay} - J{task.endDay})
                        </span>
                      </div>

                      {/* Bar indicator */}
                      <div className="w-full bg-[#0A0E14] h-3 rounded-full overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all ${
                            task.isCriticalPath ? 'bg-red-500' : 'bg-cyan-500'
                          }`}
                          style={{
                            marginLeft: `${((task.startDay - 1) / 25) * 100}%`,
                            width: `${(task.durationDays / 25) * 100}%`,
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Task Inspection Dossier Card */}
            <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold text-sm">{activeTask.id}</span>
                  <span className="text-white font-bold text-sm">{activeTask.title[locale]}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    activeTask.isCriticalPath
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}
                >
                  {activeTask.isCriticalPath ? 'CHEMIN CRITIQUE' : 'LOT PARALLÈLE'}
                </span>
              </div>

              <p className="text-neutral-300 text-[11px] leading-relaxed">
                {activeTask.description[locale]}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] pt-1">
                <div className="p-2.5 rounded-lg bg-[#0A0E14] border border-[#252E38]">
                  <span className="text-neutral-400 block text-[9px] uppercase">Équipe Spécialisée :</span>
                  <span className="text-cyan-300 font-bold">{activeTask.specialistTeam}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0A0E14] border border-[#252E38]">
                  <span className="text-neutral-400 block text-[9px] uppercase">Pièces de Rechange Critiques :</span>
                  <span className="text-amber-300 font-bold">{activeTask.requiredSpareParts[locale]}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0A0E14] border border-[#252E38]">
                  <span className="text-neutral-400 block text-[9px] uppercase">Critère de Réception :</span>
                  <span className="text-emerald-300 font-bold">{activeTask.acceptanceCriteria[locale]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: PPA FINANCIALS & CARBON CREDITS                           */}
      {/* ==================================================================== */}
      {activeSubTab === 'ppa' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
            {/* Parameters (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-mono">
                    {locale === 'fr' ? 'Contrat PPA & Modèle Économique' : 'PPA Off-take Financial Model'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">
                  42 FCFA / kWh
                </span>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Production Annuelle Nette :' : 'Annual Net Generation:'}</span>
                  <span className="text-cyan-400 font-bold">{annualGenGWh} GWh</span>
                </div>
                <input
                  type="range"
                  min="2200"
                  max="3300"
                  step="50"
                  value={annualGenGWh}
                  onChange={(e) => setAnnualGenGWh(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="text-[10px] text-neutral-500 mt-0.5">Nachtigal standard P50 : ~2 900 GWh/an</div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>{locale === 'fr' ? 'Taux de Disponibilité Usine :' : 'Plant Availability Rate:'}</span>
                  <span className="text-amber-400 font-bold">{availabilityRate}%</span>
                </div>
                <input
                  type="range"
                  min="90.0"
                  max="99.0"
                  step="0.2"
                  value={availabilityRate}
                  onChange={(e) => setAvailabilityRate(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="text-[10px] text-neutral-500 mt-0.5">Seuil contractuel SONATREL : 95.0%</div>
              </div>

              <div className="p-4 rounded-xl bg-[#141A23] border border-[#252E38] space-y-2">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">
                  Bonus / Pénalité de Disponibilité PPA
                </div>
                <div className={`text-xl font-bold ${ppaResult.availabilityBonusPenaltyFcfa >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {ppaResult.availabilityBonusPenaltyFcfa >= 0 ? '+' : ''}
                  {(ppaResult.availabilityBonusPenaltyFcfa / 1e6).toFixed(1)} Millions FCFA
                </div>
                <div className="text-[10px] text-neutral-400">
                  {ppaResult.availabilityBonusPenaltyFcfa >= 0
                    ? 'Bonus d\'excellence opérationnelle versé par le gestionnaire de réseau.'
                    : 'Pénalité contractuelle pour indisponibilité non-programmée.'}
                </div>
              </div>
            </div>

            {/* Financial Results & Carbon Credits (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#252E38]">
                  <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span>{locale === 'fr' ? 'Compte de Résultat Simplifié (FCFA)' : 'Income Statement Overview'}</span>
                  </h4>
                  <span className="text-[10px] text-neutral-400">TARIF CONTRACTUEL FIXE 35 ANS</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-linear-to-br from-[#141E2C] to-[#0E1520] border border-cyan-500/30">
                    <div className="text-[10px] text-neutral-400 uppercase">Chiffre d'Affaires Brut</div>
                    <div className="text-2xl font-black text-cyan-300 mt-1">
                      {ppaResult.annualGrossRevenueBillionFcfa} Mds FCFA
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      ~{(ppaResult.annualGrossRevenueBillionFcfa / 0.655957).toFixed(1)} M€ / an
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-linear-to-br from-[#141E2C] to-[#0E1520] border border-emerald-500/30">
                    <div className="text-[10px] text-neutral-400 uppercase">EBITDA Opérationnel</div>
                    <div className="text-2xl font-black text-emerald-400 mt-1">
                      {ppaResult.annualEbitdaBillionFcfa} Mds FCFA
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      Marge EBITDA ~88% (OPEX: {ppaResult.annualOpexBillionFcfa} Mds FCFA)
                    </div>
                  </div>
                </div>

                {/* Carbon Offset Hero Card */}
                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{locale === 'fr' ? 'Décarbonation & Crédits Carbone (Accord de Paris Art. 6)' : 'Decarbonization & Carbon Offset Yield'}</span>
                    </span>
                    <span className="text-white font-bold text-sm">
                      {ppaResult.co2EmissionsAvoidedTonsPerYear.toLocaleString()} t CO₂ / an
                    </span>
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    {locale === 'fr'
                      ? 'Nachtigal se substitue à la production thermique fossile (Centrales fuel lourd de Limbé et Dibamba), évitant plus de 2 millions de tonnes de CO₂ chaque année avec une valorisation potentielle de '
                      : 'Nachtigal displaces thermal fossil fuel plants, mitigating over 2 million tons of CO₂ annually with an estimated carbon market value of '}
                    <span className="text-emerald-300 font-bold">
                      {ppaResult.carbonCreditRevenueMillionFcfa.toLocaleString()} Millions FCFA / an
                    </span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 4: MASTER ENGINEERING DOSSIER SYNTHESIS & EXPORT             */}
      {/* ==================================================================== */}
      {activeSubTab === 'dossier' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-[#252E38] bg-[#0A0E14] space-y-4 font-mono text-xs">
            {/* Header with Export buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252E38]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
                  <FileText className="h-4 w-4 text-amber-400" />
                  <span>{locale === 'fr' ? 'Dossier d\'Ingénierie Maître (Synthèse Étapes 1 à 10)' : 'Master Engineering Dossier (Steps 1 to 10)'}</span>
                </h3>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  Compilation certifiée conforme aux normes CEI, IEEE, CIGB et ISO 55000
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyDossier}
                  className="px-3 py-1.5 rounded-lg bg-[#141E2C] hover:bg-[#1E2B3E] border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  {copiedDossier ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedDossier ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier Markdown' : 'Copy Markdown')}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintDossier}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center gap-1.5 hover:bg-amber-400 transition-all shadow-sm"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{locale === 'fr' ? 'Imprimer / PDF' : 'Print / PDF'}</span>
                </button>
              </div>
            </div>

            {/* Accordion List of Master Dossier Sections */}
            <div className="space-y-3">
              {MASTER_DOSSIER_SECTIONS.map((section) => {
                const isExpanded = expandedSection === section.sectionNumber;
                return (
                  <div
                    key={section.sectionNumber}
                    className="border border-[#252E38] rounded-xl overflow-hidden bg-[#141A23]"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedSection(isExpanded ? '' : section.sectionNumber)}
                      className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#1A2330] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold text-[10px] border border-amber-800">
                          {section.sectionNumber}
                        </span>
                        <span className="font-bold text-white text-xs">{section.title[locale]}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-neutral-400 hidden sm:inline">
                          {section.standardsReferenced.join(', ')}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-neutral-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-neutral-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-[#252E38] bg-[#0D1219] space-y-3 text-xs">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {section.keyOutputs.map((out, idx) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-[#141A23] border border-[#252E38]">
                              <span className="text-neutral-400 block text-[9px] uppercase">{out.label[locale]}</span>
                              <span className="text-cyan-300 font-bold text-xs mt-0.5 block">
                                {out.value} {out.unit}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="p-3 rounded-lg bg-[#141A23] border border-[#252E38] text-[11px] text-neutral-300 leading-relaxed">
                          <span className="text-amber-400 font-bold block text-[10px] uppercase mb-1">
                            {locale === 'fr' ? 'Synthèse de Validation :' : 'Engineering Signoff Note:'}
                          </span>
                          {section.engineeringSummary[locale]}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-neutral-400">
                          <span>{locale === 'fr' ? 'Sous-systèmes liés :' : 'Associated Subsystems:'}</span>
                          {section.subsystemsCovered.map((subId) => (
                            <button
                              key={subId}
                              type="button"
                              onClick={() => onSelectSubsystem && onSelectSubsystem(subId)}
                              className="px-2 py-0.5 rounded bg-[#1C2634] hover:bg-cyan-900/50 hover:text-cyan-300 border border-[#2E3C4E] text-neutral-300 transition-colors"
                            >
                              {subId}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Document Signoff Footer Stamp */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="text-emerald-400 font-bold text-[10px] uppercase">
                  {locale === 'fr' ? 'Certificat de Conformité Numérique (EPEDE Digital Twin)' : 'Digital Twin Engineering Certification'}
                </div>
                <div className="text-neutral-300 text-[11px] mt-0.5">
                  Validé Bon Pour Exécution (BPE) — Référentiels CEI 60193, CEI 60034, IEEE C37.102, CIGB B.138/158 & ISO 55001.
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase">
                  APPROUVÉ BPE
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
