// src/components/diagrams/modules/SubstationBatchComplianceModal.tsx
// EPEDE Consolidated Substation Batch Compliance Dossier Modal
// Displays and exports full-substation multi-apparatus IEC engineering compliance reports.

import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Calculator, 
  ExternalLink,
  Layers,
  Award,
  FileText,
  Activity,
  Zap,
  Info,
  Filter,
  Sliders,
  Thermometer,
  Gauge,
  RotateCcw,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Flame,
  FileSpreadsheet,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { 
  SubstationBatchComplianceService,
  SubstationComplianceDossier,
  SubstationConnectedApparatus,
  ApparatusCategory,
  SubstationSimulationSnapshot
} from '../../../services/substationBatchComplianceService';
import { SubstationSensitivityCurvesView } from './SubstationSensitivityCurvesView';
import { SubstationCommissioningProtocolView } from './SubstationCommissioningProtocolView';
import type { SldTopologyType } from './SldHeaderToolbar';
import type { CalculatorTabType } from '../../calculators/services/calculationReportService';
import type { SimulationTabType } from '../../simulation/SimulationLabView';
import type { InjectedCalculatorContext } from '../../../services/routerService';

interface SubstationBatchComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  topology: SldTopologyType;
  sim: SubstationSimulationSnapshot;
  locale: 'fr' | 'en';
  onNavigateCalculator?: (tab?: CalculatorTabType, context?: InjectedCalculatorContext) => void;
  onNavigateSimulation?: (tab?: SimulationTabType) => void;
  onNavigateEquipment?: (equipmentId: string) => void;
  onSetTrafoTap?: (tap: number) => void;
  onSetActiveLoadMw?: (mw: number) => void;
  onSimulateFault?: (fault: string | null) => void;
  onResetProtections?: () => void;
}

export const SubstationBatchComplianceModal: React.FC<SubstationBatchComplianceModalProps> = ({
  isOpen,
  onClose,
  topology,
  sim,
  locale,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigateEquipment,
  onSetTrafoTap,
  onSetActiveLoadMw,
  onSimulateFault,
  onResetProtections,
}) => {
  const [activeCategory, setActiveCategory] = useState<ApparatusCategory | 'ALL'>('ALL');
  const [activeView, setActiveView] = useState<'INVENTORY' | 'SENSITIVITY_CURVES' | 'COMMISSIONING_PROTOCOL'>('INVENTORY');
  const [copied, setCopied] = useState<boolean>(false);
  const [jsonDownloaded, setJsonDownloaded] = useState<boolean>(false);
  const [csvDownloaded, setCsvDownloaded] = useState<boolean>(false);

  // Live interactive parameter controls for operational stress-testing
  const [liveLoadMw, setLiveLoadMw] = useState<number>(sim.activeLoadMw ?? 48.5);
  const [liveTap, setLiveTap] = useState<number>(sim.trafoTap ?? 0);
  const [ambientSoilTempC, setAmbientSoilTempC] = useState<number>(sim.ambientSoilTempC ?? 35);
  const [gridScMva, setGridScMva] = useState<number>(sim.gridScMva ?? 3000);
  const [breakerTimeMs, setBreakerTimeMs] = useState<number>(sim.breakerOpeningTimeMs ?? 42);
  const [activeSimFault, setActiveSimFault] = useState<string | null>(sim.activeFault ?? null);
  const [isDeckExpanded, setIsDeckExpanded] = useState<boolean>(true);
  const [autoSyncSld, setAutoSyncSld] = useState<boolean>(true);

  // Sync state if external sim props change when modal is closed
  useEffect(() => {
    if (sim.activeLoadMw !== undefined) setLiveLoadMw(sim.activeLoadMw);
  }, [sim.activeLoadMw]);

  useEffect(() => {
    if (sim.trafoTap !== undefined) setLiveTap(sim.trafoTap);
  }, [sim.trafoTap]);

  useEffect(() => {
    if (sim.activeFault !== undefined) setActiveSimFault(sim.activeFault);
  }, [sim.activeFault]);

  // Handle load change with automatic or manual synchronization
  const handleLoadChange = (val: number) => {
    setLiveLoadMw(val);
    if (autoSyncSld && onSetActiveLoadMw) {
      onSetActiveLoadMw(val);
    }
  };

  // Handle tap change with automatic or manual synchronization
  const handleTapChange = (val: number) => {
    const clamped = Math.max(-9, Math.min(9, val));
    setLiveTap(clamped);
    if (autoSyncSld && onSetTrafoTap) {
      onSetTrafoTap(clamped);
    }
  };

  // Handle fault simulation
  const handleTriggerFault = (fault: string | null) => {
    setActiveSimFault(fault);
    if (fault) {
      onSimulateFault?.(fault);
    } else {
      onResetProtections?.();
    }
  };

  // Reset all parameters to standard baseline
  const handleResetParameters = () => {
    setLiveLoadMw(48.5);
    setLiveTap(0);
    setAmbientSoilTempC(35);
    setGridScMva(3000);
    setBreakerTimeMs(42);
    setActiveSimFault(null);
    onSetActiveLoadMw?.(48.5);
    onSetTrafoTap?.(0);
    onResetProtections?.();
  };

  // Manual push to SLD
  const handlePushToSld = () => {
    onSetActiveLoadMw?.(liveLoadMw);
    onSetTrafoTap?.(liveTap);
    if (activeSimFault) {
      onSimulateFault?.(activeSimFault);
    } else {
      onResetProtections?.();
    }
  };

  // Construct effective snapshot combining base telemetry + live adjustments
  const effectiveSim: SubstationSimulationSnapshot = useMemo(() => {
    const u_hv = 225.0;
    const u_mv = 30.0 * (1 + liveTap * 0.0125);
    const i_hv = (liveLoadMw * 1e6) / (Math.sqrt(3) * u_hv * 1e3 * 0.98);
    const i_mv = (liveLoadMw * 1e6) / (Math.sqrt(3) * u_mv * 1e3 * 0.98);

    return {
      ...sim,
      activeLoadMw: liveLoadMw,
      trafoTap: liveTap,
      ambientSoilTempC,
      gridScMva,
      breakerOpeningTimeMs: breakerTimeMs,
      activeFault: activeSimFault,
      current_hv: i_hv,
      current_mv: i_mv,
      u_mv_nom: u_mv,
      relayTripped: Boolean(activeSimFault),
    };
  }, [sim, liveLoadMw, liveTap, ambientSoilTempC, gridScMva, breakerTimeMs, activeSimFault]);

  // Generate real-time batch dossier based on effective simulation snapshot
  const dossier: SubstationComplianceDossier = useMemo(() => {
    return SubstationBatchComplianceService.generateDossier(topology, effectiveSim, locale);
  }, [topology, effectiveSim, locale]);

  if (!isOpen) return null;

  // Filter apparatuses based on selected category
  const filteredApparatuses = activeCategory === 'ALL'
    ? dossier.apparatuses
    : dossier.apparatuses.filter(a => a.category === activeCategory);

  // Copy Markdown dossier to clipboard
  const handleCopyMarkdown = () => {
    const markdown = SubstationBatchComplianceService.generateMarkdownDossier(dossier, locale);
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Download structured JSON dossier
  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(dossier, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `epede-substation-dossier-${dossier.topology}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setJsonDownloaded(true);
    setTimeout(() => setJsonDownloaded(false), 2500);
  };

  // Download tabular CSV dossier
  const handleDownloadCsv = () => {
    const csvStr = SubstationBatchComplianceService.generateCsvDossier(dossier, locale);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `epede-substation-dossier-${dossier.topology}-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setCsvDownloaded(true);
    setTimeout(() => setCsvDownloaded(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: 'PASS' | 'WARNING' | 'FAIL') => {
    switch (status) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>{locale === 'fr' ? 'CONFORME CEI' : 'IEC COMPLIANT'}</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>{locale === 'fr' ? 'TOLÉRANCE LIMITE' : 'MARGINAL'}</span>
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold">
            <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            <span>{locale === 'fr' ? 'NON CONFORME' : 'NON-COMPLIANT'}</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0B121C] border border-[#223246] rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans text-slate-100">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#1E2B3A] bg-[#0E1724] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold mb-1">
                <Activity className="h-3.5 w-3.5" />
                <span className="uppercase tracking-wider">
                  {locale === 'fr' ? 'DOSSIER POSTE COMPLET · AUDIT BATCH MULTI-APPAREILLAGE' : 'CONSOLIDATED SUBSTATION DOSSIER · BATCH ASSET AUDIT'}
                </span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-slate-300 text-[10px]">
                  {dossier.documentReference}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                {dossier.substationName[locale]}
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                {locale === 'fr'
                  ? `Vérification électrotechnique conjointe de tous les transformateurs, disjoncteurs, jeux de barres et départs HTA selon le recueil CEI 60076, 60909, 62271 et 60364.`
                  : `Comprehensive electrotechnical audit covering all connected power transformers, breakers, busbars, and outgoing feeders per IEC 60076, 60909, 62271, and 60364 standards.`}
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
              title="Copier la note complète au format Markdown / ASCII"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-cyan-400" />}
              <span>{copied ? (locale === 'fr' ? 'COPIÉ !' : 'COPIED !') : (locale === 'fr' ? 'COPIER DOSSIER' : 'COPY DOSSIER')}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
              title="Exporter les données techniques brutes en JSON"
            >
              {jsonDownloaded ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Download className="h-3.5 w-3.5 text-cyan-400" />}
              <span>{jsonDownloaded ? (locale === 'fr' ? 'TÉLÉCHARGÉ' : 'DOWNLOADED') : 'EXPORT JSON'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
              title="Exporter le tableau d'audit au format CSV (compatible Excel / PowerBI)"
            >
              {csvDownloaded ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />}
              <span>{csvDownloaded ? (locale === 'fr' ? 'TABLEUR CSV OK' : 'CSV READY') : 'EXPORT CSV'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
              title="Imprimer ou enregistrer en PDF"
            >
              <Printer className="h-3.5 w-3.5 text-slate-300" />
              <span>{locale === 'fr' ? 'IMPRIMER' : 'PRINT'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs Bar */}
        <div className="px-5 py-2.5 bg-[#0C1420] border-b border-[#1E2D40] flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveView('INVENTORY')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
              activeView === 'INVENTORY'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                : 'bg-[#080E18] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>{locale === 'fr' ? '1. AUDIT MULTI-APPAREILLAGES' : '1. MULTI-ASSET AUDIT'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('SENSITIVITY_CURVES')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
              activeView === 'SENSITIVITY_CURVES'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-[#080E18] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <TrendingUp className="h-4 w-4 text-amber-400" />
            <span>{locale === 'fr' ? '2. COURBES DE SENSIBILITÉ & MARGES' : '2. SENSITIVITY & MARGIN CURVES'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('COMMISSIONING_PROTOCOL')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
              activeView === 'COMMISSIONING_PROTOCOL'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'bg-[#080E18] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <FileCheck className="h-4 w-4 text-emerald-400" />
            <span>{locale === 'fr' ? '3. PROCÈS-VERBAL OFFICIEL (FAT/SAT)' : '3. OFFICIAL ACCEPTANCE PROTOCOL'}</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#090E17]">
          {activeView === 'SENSITIVITY_CURVES' && (
            <SubstationSensitivityCurvesView
              locale={locale}
              dossier={dossier}
              liveLoadMw={liveLoadMw}
              liveTap={liveTap}
              ambientSoilTempC={ambientSoilTempC}
              gridScMva={gridScMva}
              breakerTimeMs={breakerTimeMs}
              onSetLoadMw={(mw) => {
                setLiveLoadMw(mw);
                if (autoSyncSld) onSetActiveLoadMw?.(mw);
              }}
              onSetSoilTemp={(temp) => setAmbientSoilTempC(temp)}
              onSetGridScMva={(mva) => setGridScMva(mva)}
            />
          )}

          {activeView === 'COMMISSIONING_PROTOCOL' && (
            <SubstationCommissioningProtocolView
              locale={locale}
              dossier={dossier}
            />
          )}

          {activeView === 'INVENTORY' && (
            <>
          {/* Interactive Operating Parameters & Stress-Testing Deck */}
          <div className="rounded-2xl bg-[#0D1522] border border-[#1E2E44] overflow-hidden shadow-lg">
            <div className="p-4 bg-[#111C2D] border-b border-[#1E2E44] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      {locale === 'fr' ? 'BANC DE SIMULATION & STRESS-TEST MULTI-APPAREILLAGES' : 'MULTI-ASSET STRESS-TEST & PARAMETER BENCH'}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {autoSyncSld ? (locale === 'fr' ? 'SYNCHRONISÉ SLD' : 'SLD SYNC ACTIVE') : (locale === 'fr' ? 'MANUEL' : 'MANUAL')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    {locale === 'fr'
                      ? 'Modifiez les conditions d\'exploitation (charge, plots régleur, température sol, Ik) pour observer la réponse normative instantanée de tous les organes.'
                      : 'Vary operating conditions (load, tap positions, ground temp, fault current) to observe real-time normative compliance responses.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetParameters}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-semibold transition-colors shadow-xs cursor-pointer"
                  title="Réinitialiser toutes les variables aux conditions nominales de calcul"
                >
                  <RotateCcw className="h-3 w-3 text-amber-400" />
                  <span>{locale === 'fr' ? 'RÉINIT' : 'RESET'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeckExpanded(!isDeckExpanded)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  <span>{isDeckExpanded ? (locale === 'fr' ? 'RÉDUIRE' : 'COLLAPSE') : (locale === 'fr' ? 'DÉPLOYER' : 'EXPAND')}</span>
                  {isDeckExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {isDeckExpanded && (
              <div className="p-4 sm:p-5 space-y-4 bg-[#0A101C]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Parameter 1: Active Load Slider */}
                  <div className="p-3.5 rounded-xl bg-[#0F1826] border border-[#23354C] flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{locale === 'fr' ? 'Charge Active (MW)' : 'Active Load (MW)'}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        (liveLoadMw / 0.98) > 63
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : (liveLoadMw / 0.98) > 56.7
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {((liveLoadMw / 0.98 / 63) * 100).toFixed(0)}% In TR1
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between font-mono">
                        <span className="text-2xl font-black text-white">{liveLoadMw.toFixed(1)} <span className="text-xs text-slate-400">MW</span></span>
                        <span className="text-xs text-cyan-400 font-bold">{(liveLoadMw / 0.98).toFixed(1)} MVA</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="75"
                        step="0.5"
                        value={liveLoadMw}
                        onChange={(e) => handleLoadChange(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>10 MW</span>
                        <span>48.5 MW (Nom)</span>
                        <span>75 MW (Max)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400">Presets:</span>
                      <button
                        type="button"
                        onClick={() => handleLoadChange(30)}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
                      >
                        30MW
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadChange(48.5)}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-mono"
                      >
                        48.5MW
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadChange(68)}
                        className="px-1.5 py-0.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-[10px] font-mono border border-rose-800/50"
                        title="Surcharge intentionnelle pour tester le déclenchement et les alarmes"
                      >
                        68MW
                      </button>
                    </div>
                  </div>

                  {/* Parameter 2: OLTC Tap Changer */}
                  <div className="p-3.5 rounded-xl bg-[#0F1826] border border-[#23354C] flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                        <Gauge className="h-3.5 w-3.5 text-sky-400" />
                        <span>{locale === 'fr' ? 'Régleur Transfo (OLTC)' : 'Trafo Tap Changer'}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        Math.abs(liveTap) >= 8
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      }`}>
                        {Math.abs(liveTap) >= 8 ? (locale === 'fr' ? 'PLAGE LIMITE' : 'TAP LIMIT') : 'AVR OK'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between font-mono">
                        <span className="text-2xl font-black text-white">
                          Plot {liveTap >= 0 ? `+${liveTap}` : liveTap}
                        </span>
                        <span className="text-xs text-sky-400 font-bold">
                          {(30.0 * (1 + liveTap * 0.0125)).toFixed(2)} kV
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTapChange(liveTap - 1)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono font-black text-xs cursor-pointer border border-slate-700"
                        >
                          -
                        </button>
                        <input
                          type="range"
                          min="-9"
                          max="9"
                          step="1"
                          value={liveTap}
                          onChange={(e) => handleTapChange(parseInt(e.target.value, 10))}
                          className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => handleTapChange(liveTap + 1)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono font-black text-xs cursor-pointer border border-slate-700"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>-9 (-11.25%)</span>
                        <span>0 (30 kV)</span>
                        <span>+9 (+11.25%)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400">Presets:</span>
                      <button
                        type="button"
                        onClick={() => handleTapChange(-4)}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
                      >
                        -4 (-5%)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTapChange(0)}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] font-mono"
                      >
                        Plot 0
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTapChange(4)}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
                      >
                        +4 (+5%)
                      </button>
                    </div>
                  </div>

                  {/* Parameter 3: Ambient Soil Temperature */}
                  <div className="p-3.5 rounded-xl bg-[#0F1826] border border-[#23354C] flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                        <Thermometer className="h-3.5 w-3.5 text-amber-400" />
                        <span>{locale === 'fr' ? 'Température Sol (CEI 60364)' : 'Ground Temp (IEC 60364)'}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        ambientSoilTempC >= 45
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : ambientSoilTempC >= 35
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        k1 = {Math.sqrt(Math.max(0.05, (90 - ambientSoilTempC) / 70)).toFixed(3)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between font-mono">
                        <span className="text-2xl font-black text-white">{ambientSoilTempC}°C</span>
                        <span className="text-xs text-amber-400 font-bold">
                          Iz câble = {(538 * 0.913 * Math.sqrt(Math.max(0.05, (90 - ambientSoilTempC) / 70)) * 0.85).toFixed(0)} A
                        </span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="50"
                        step="1"
                        value={ambientSoilTempC}
                        onChange={(e) => setAmbientSoilTempC(parseInt(e.target.value, 10))}
                        className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>15°C</span>
                        <span>35°C (Afrique)</span>
                        <span>50°C (Canicule)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400">Climats:</span>
                      <button
                        type="button"
                        onClick={() => setAmbientSoilTempC(20)}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
                      >
                        20°C Tempéré
                      </button>
                      <button
                        type="button"
                        onClick={() => setAmbientSoilTempC(35)}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-mono"
                      >
                        35°C Tropical
                      </button>
                      <button
                        type="button"
                        onClick={() => setAmbientSoilTempC(48)}
                        className="px-1.5 py-0.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-[10px] font-mono border border-rose-800/50"
                      >
                        48°C Canicule
                      </button>
                    </div>
                  </div>

                  {/* Parameter 4: Short Circuit & Fault Injection */}
                  <div className="p-3.5 rounded-xl bg-[#0F1826] border border-[#23354C] flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                        <Flame className="h-3.5 w-3.5 text-rose-400" />
                        <span>{locale === 'fr' ? 'Court-Circuit & Défaut' : 'Short-Circuit & Fault'}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        activeSimFault
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {activeSimFault ? (locale === 'fr' ? 'DÉFAUT ACTIF' : 'FAULT ACTIVE') : (locale === 'fr' ? 'RÉSEAU SAIN' : 'HEALTHY')}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-slate-400">Ssc Amont:</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setGridScMva(1500)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${gridScMva === 1500 ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-800 text-slate-300'}`}
                          >
                            1500MVA
                          </button>
                          <button
                            type="button"
                            onClick={() => setGridScMva(3000)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${gridScMva === 3000 ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-800 text-slate-300'}`}
                          >
                            3000MVA
                          </button>
                          <button
                            type="button"
                            onClick={() => setGridScMva(5000)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${gridScMva === 5000 ? 'bg-cyan-500 text-black font-bold' : 'bg-slate-800 text-slate-300'}`}
                          >
                            5000MVA
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-slate-400">Ouv. Disjoncteur:</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="range"
                            min="35"
                            max="75"
                            step="1"
                            value={breakerTimeMs}
                            onChange={(e) => setBreakerTimeMs(parseInt(e.target.value, 10))}
                            className="w-16 accent-rose-400 h-1 bg-slate-800 rounded cursor-pointer"
                          />
                          <span className={`text-[11px] font-mono font-bold ${breakerTimeMs > 60 ? 'text-rose-400' : 'text-slate-300'}`}>
                            {breakerTimeMs} ms
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1 pt-1">
                        <button
                          type="button"
                          onClick={() => handleTriggerFault(null)}
                          className={`px-1 py-1 rounded text-[9px] font-mono font-bold truncate transition-colors ${
                            !activeSimFault
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Sain
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTriggerFault('feeder1_fault')}
                          className={`px-1 py-1 rounded text-[9px] font-mono font-bold truncate transition-colors ${
                            activeSimFault === 'feeder1_fault'
                              ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                              : 'bg-slate-800 text-slate-400 hover:text-rose-300'
                          }`}
                          title="Court-circuit triphasé sur départ 30 kV F1"
                        >
                          Défaut F1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTriggerFault('line_fault')}
                          className={`px-1 py-1 rounded text-[9px] font-mono font-bold truncate transition-colors ${
                            activeSimFault === 'line_fault'
                              ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                              : 'bg-slate-800 text-slate-400 hover:text-rose-300'
                          }`}
                          title="Défaut phase-terre ligne 225 kV"
                        >
                          Défaut Ligne
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom synchronization toggle bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1C2C40] text-xs font-mono">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={autoSyncSld}
                      onChange={(e) => setAutoSyncSld(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-600 text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                    <span>{locale === 'fr' ? 'Synchronisation dynamique continue avec le schéma unifilaire (SLD)' : 'Continuous dynamic sync with Single-Line Diagram (SLD)'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={handlePushToSld}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3 text-cyan-400" />
                    <span>{locale === 'fr' ? 'Forcer Répercussion vers SLD' : 'Force Push to SLD'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Executive Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Health & Safety Score */}
            <div className="p-4 rounded-xl bg-[#0E1622] border border-[#223348] flex flex-col justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                {locale === 'fr' ? 'Indice de Sécurité Global' : 'Overall Safety Index'}
              </span>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-4xl font-black font-mono text-emerald-400">
                  {dossier.safetyIndexPercent}%
                </span>
                <span className="text-xs font-mono text-slate-400">
                  / 100% CEI
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${dossier.safetyIndexPercent}%` }}
                />
              </div>
            </div>

            {/* Asset Breakdown */}
            <div className="p-4 rounded-xl bg-[#0E1622] border border-[#223348] flex flex-col justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                {locale === 'fr' ? 'Parc d\'Appareillage Audité' : 'Audited Apparatus Fleet'}
              </span>
              <div className="my-2">
                <span className="text-3xl font-black font-mono text-white">
                  {dossier.totalAssets}
                </span>
                <span className="text-xs text-slate-400 ml-2">
                  {locale === 'fr' ? 'organes analysés' : 'assets verified'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-emerald-400 font-bold">{dossier.compliantCount} {locale === 'fr' ? 'validés' : 'pass'}</span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-400 font-bold">{dossier.warningCount} {locale === 'fr' ? 'tolérance' : 'margin'}</span>
                <span className="text-slate-600">·</span>
                <span className="text-rose-400 font-bold">{dossier.failCount} {locale === 'fr' ? 'réserve' : 'fail'}</span>
              </div>
            </div>

            {/* Commission Verdict */}
            <div className="md:col-span-2 p-4 rounded-xl bg-[#0E1622] border border-[#223348] flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {locale === 'fr' ? 'Avis Technique d\'Homologation' : 'Commissioning Verdict'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border bg-emerald-500/15 border-emerald-500/40 text-emerald-300">
                  {dossier.globalVerdict.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
                {dossier.globalVerdict.summary[locale]}
              </p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800">
                <span>{dossier.leadAuditor.name}</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400">{dossier.leadAuditor.stampRef}</span>
              </div>
            </div>
          </div>

            {/* Category Filter Tabs */}
          <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-800 pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Filtre :' : 'Filter:'}</span>
              </span>

              <button
                type="button"
                onClick={() => setActiveCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeCategory === 'ALL'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-xs'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {locale === 'fr' ? 'Tous les Appareils' : 'All Apparatuses'} ({dossier.apparatuses.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('TRANSFORMER')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeCategory === 'TRANSFORMER'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-xs'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {locale === 'fr' ? 'Transformateurs' : 'Transformers'} ({dossier.apparatuses.filter(a => a.category === 'TRANSFORMER').length})
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('BREAKER')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeCategory === 'BREAKER'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-xs'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {locale === 'fr' ? 'Disjoncteurs & GIS' : 'Circuit Breakers'} ({dossier.apparatuses.filter(a => a.category === 'BREAKER').length})
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('FEEDER')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeCategory === 'FEEDER'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-xs'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {locale === 'fr' ? 'Départs & Câbles' : 'Feeders & Cables'} ({dossier.apparatuses.filter(a => a.category === 'FEEDER').length})
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('BUSBAR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeCategory === 'BUSBAR'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-xs'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {locale === 'fr' ? 'Jeux de Barres & Terre' : 'Busbars & Earth'} ({dossier.apparatuses.filter(a => a.category === 'BUSBAR').length})
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('PROTECTION')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeCategory === 'PROTECTION'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-xs'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {locale === 'fr' ? 'Protections & Relais' : 'Relays'} ({dossier.apparatuses.filter(a => a.category === 'PROTECTION').length})
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400">
              {locale === 'fr' ? 'Affichage :' : 'Showing:'} <span className="text-white font-bold">{filteredApparatuses.length}</span> {locale === 'fr' ? 'organes' : 'apparatuses'}
            </div>
          </div>

          {/* Apparatus Grid / Cards */}
          <div className="space-y-4">
            {filteredApparatuses.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-xl bg-[#0D1520] border border-[#213144] hover:border-cyan-800/60 transition-all shadow-md space-y-4"
              >
                {/* Apparatus Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="px-2.5 py-1 rounded bg-[#070B10] border border-slate-700 text-cyan-400 font-mono font-black text-sm tracking-wide">
                      {app.tag}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-mono">
                        {app.name[locale]}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono flex-wrap">
                        <span className="text-slate-300 font-bold">{app.nominalRating}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-sky-400">{app.governingStandard}</span>
                        <span className="text-slate-600">•</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                          {app.operationalState}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(app.overallStatus)}

                    {onNavigateEquipment && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          const mappedEqId = 
                            app.category === 'TRANSFORMER' ? 'eq-exp-sub-trafo-225-30' :
                            app.category === 'BREAKER' ? 'eq-exp-gis-bay-225k' :
                            app.category === 'FEEDER' ? 'eq-cell-mv-30k-01' :
                            app.category === 'PROTECTION' ? 'eq-exp-relay-ied-61850' :
                            'eq-exp-gis-bay-225k';
                          onNavigateEquipment(mappedEqId);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono font-semibold transition-all cursor-pointer"
                        title={locale === 'fr' ? 'Consulter la fiche technique et le jumeau numérique' : 'View apparatus technical fiche & twin'}
                      >
                        <FileText className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{locale === 'fr' ? 'Fiche' : 'Fiche'}</span>
                      </button>
                    )}

                    {onNavigateSimulation && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          const simTab: SimulationTabType = 
                            app.category === 'TRANSFORMER' ? 'differential-protection' :
                            app.category === 'BREAKER' ? 'short-circuit' :
                            app.category === 'FEEDER' ? 'coordination' :
                            app.category === 'PROTECTION' ? 'coordination' :
                            'substation-interlocking';
                          onNavigateSimulation(simTab);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
                        title={locale === 'fr' ? 'Lancer le banc d\'essais dynamique' : 'Launch dynamic simulation lab'}
                      >
                        <Activity className="h-3.5 w-3.5 text-purple-400" />
                        <span>{locale === 'fr' ? 'Simuler' : 'Simulate'}</span>
                      </button>
                    )}

                    {onNavigateCalculator && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateCalculator(app.recommendedCalcTab, {
                            equipmentId: app.id,
                            equipmentName: app.name[locale],
                            equipmentTag: app.tag,
                            substationOrFeeder: dossier.substationName[locale],
                            params: app.calcParams,
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
                        title={locale === 'fr' ? 'Ouvrir dans le calculateur électrotechnique' : 'Open in engineering calculator'}
                      >
                        <Calculator className="h-3.5 w-3.5" />
                        <span>{locale === 'fr' ? 'Calculer' : 'Calculate'}</span>
                        <ExternalLink className="h-3 w-3 opacity-70" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Checked Normative Metrics Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {app.metrics.map((metric, mIdx) => (
                    <div 
                      key={mIdx}
                      className="p-3 rounded-lg bg-[#070C13] border border-slate-800/80 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 font-sans">
                          <span className="truncate" title={metric.label[locale]}>{metric.label[locale]}</span>
                          <span className={`h-2 w-2 rounded-full shrink-0 ${
                            metric.status === 'OK' ? 'bg-emerald-400' : metric.status === 'WARN' ? 'bg-amber-400' : 'bg-rose-400'
                          }`} />
                        </div>
                        <div className="font-mono font-black text-sm text-slate-100 mt-1">
                          {metric.measuredValue}
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{locale === 'fr' ? 'Seuil :' : 'Limit:'} {metric.nominalOrLimit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Engineering Observation Footer */}
                <div className="flex items-start gap-2 bg-[#080D14]/70 p-3 rounded-lg border border-slate-800/60 text-xs text-slate-300 font-sans leading-relaxed">
                  <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{app.engineeringObservation[locale]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Normative Reference & Audit Certification Footer Block */}
          <div className="p-5 rounded-xl bg-[#0E1624] border border-[#213042] space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              <Award className="h-4 w-4 text-amber-400" />
              <span>{locale === 'fr' ? 'Homologation et Référentiels Normatifs Internationaux' : 'Standards Certification & Audit Visa'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
              {dossier.governingStandards.map((std, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded bg-black/40 border border-slate-800">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{std}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
              <div>
                <span>{locale === 'fr' ? 'Visa Commission :' : 'Audit Seal:'} </span>
                <span className="text-cyan-400 font-bold">{dossier.leadAuditor.stampRef}</span>
              </div>
              <div>
                <span>{locale === 'fr' ? 'Autorité :' : 'Authority:'} </span>
                <span className="text-slate-200">{dossier.leadAuditor.organization}</span>
              </div>
              <div>
                <span>{locale === 'fr' ? 'Date de visa :' : 'Certification Date:'} </span>
                <span className="text-slate-200">{dossier.dateStr}</span>
              </div>
            </div>
          </div>
          </>
          )}

        </div>

        {/* Modal Bottom Sticky Action Bar */}
        <div className="p-4 bg-[#0A1018] border-t border-[#1E2B3A] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>
              {locale === 'fr' 
                ? 'Données calculées en temps réel sur la topologie active du réseau unifilaire.' 
                : 'Real-time telemetry and calculations synchronized with the active single-line diagram.'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? (locale === 'fr' ? 'COPIÉ DANS LE PRESSE-PAPIER' : 'COPIED TO CLIPBOARD') : (locale === 'fr' ? 'COPIER DOSSIER COMPLET' : 'COPY CONSOLIDATED DOSSIER')}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              {locale === 'fr' ? 'FERMER' : 'CLOSE'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
