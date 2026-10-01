// src/components/lifecycle/LifecycleView.tsx
// EPEDE Layer 03 (Project Lifecycle & Engineering Gate Review Engine)
// Comprehensive interactive EPC engineering workflow with gate review criteria, deliverable tracking and audit exporter

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LIFECYCLE_PHASES, 
  ProjectPhase, 
  LifecycleDeliverable, 
  GateReviewCriterion 
} from '../../data/lifecycleData';
import type { CalculatorTabType } from '../calculators/services/calculationReportService';
import type { SimulationTabType } from '../simulation/SimulationLabView';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  Calculator, 
  Zap, 
  Download, 
  ChevronRight, 
  Users, 
  Layers, 
  Award,
  Filter,
  Search,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Scale,
  Globe
} from 'lucide-react';

interface LifecycleViewProps {
  locale: 'fr' | 'en';
  onNavigateCalculator?: (tab: CalculatorTabType) => void;
  onNavigateSimulation?: (tab: SimulationTabType) => void;
  onNavigatePhase2?: () => void;
  onNavigateStandards?: () => void;
  onNavigateCameroonGrid?: () => void;
  onNavigateRegulatory?: () => void;
  onNavigateContextStack?: (nodeId?: string) => void;
}

type GateStatus = 'approved' | 'in_progress' | 'pending' | 'rejected';

interface GateRecord {
  status: GateStatus;
  signoffDate?: string;
  signoffAuthor?: string;
  notes?: string;
}

const STORAGE_KEY = 'epede_lifecycle_gate_records_v1';

export const LifecycleView: React.FC<LifecycleViewProps> = ({
  locale,
  onNavigateCalculator,
  onNavigateSimulation,
  onNavigatePhase2,
  onNavigateStandards,
  onNavigateCameroonGrid,
  onNavigateRegulatory,
  onNavigateContextStack
}) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(LIFECYCLE_PHASES[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'deliverables' | 'gate_criteria' | 'risks'>('deliverables');

  // Load gate records from localStorage
  const [gateRecords, setGateRecords] = useState<Record<string, GateRecord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default seeded state
    return {
      'phase-1-feasibility': { status: 'approved', signoffDate: '2025-01-15', signoffAuthor: 'SONATREL / ARSEL Planning Committee' },
      'phase-2-feed': { status: 'approved', signoffDate: '2025-06-20', signoffAuthor: 'Lead EPC Technical Director' },
      'phase-3-detailed-design': { status: 'in_progress', signoffDate: undefined, signoffAuthor: undefined },
      'phase-4-procurement-fat': { status: 'pending' },
      'phase-5-construction': { status: 'pending' },
      'phase-6-commissioning': { status: 'pending' },
      'phase-7-operation-maintenance': { status: 'pending' }
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gateRecords));
    } catch {
      // ignore
    }
  }, [gateRecords]);

  const selectedPhase = useMemo(() => {
    return LIFECYCLE_PHASES.find(p => p.id === selectedPhaseId) || LIFECYCLE_PHASES[0];
  }, [selectedPhaseId]);

  const overallProgress = useMemo(() => {
    const total = LIFECYCLE_PHASES.length;
    const approvedCount = (Object.values(gateRecords) as GateRecord[]).filter(r => r.status === 'approved').length;
    return Math.round((approvedCount / total) * 100);
  }, [gateRecords]);

  const handleUpdateGateStatus = (phaseId: string, newStatus: GateStatus) => {
    const now = new Date().toISOString().split('T')[0];
    setGateRecords(prev => ({
      ...prev,
      [phaseId]: {
        ...prev[phaseId],
        status: newStatus,
        signoffDate: newStatus === 'approved' ? now : undefined,
        signoffAuthor: newStatus === 'approved' ? 'Lead Technical Review Board (EPEDE / SONATREL)' : undefined
      }
    }));
  };

  const handleResetWorkflow = () => {
    const resetState: Record<string, GateRecord> = {};
    LIFECYCLE_PHASES.forEach((p, idx) => {
      resetState[p.id] = { status: idx === 0 ? 'in_progress' : 'pending' };
    });
    setGateRecords(resetState);
  };

  // Export Gate Review Dossier
  const handleExportDossier = () => {
    const reportDate = new Date().toISOString();
    const content = {
      project: 'EPEDE High-Voltage & Substation EPC Project Lifecycle Dossier',
      framework: 'L03 - EPC Project Lifecycle & Engineering Gate Review Protocol',
      generated_at: reportDate,
      overall_completion_percentage: overallProgress,
      phases: LIFECYCLE_PHASES.map(p => {
        const record = gateRecords[p.id] || { status: 'pending' };
        return {
          phase_number: p.phase_number,
          code: p.code,
          title: locale === 'fr' ? p.title_fr : p.title_en,
          gate_name: locale === 'fr' ? p.gate_name_fr : p.gate_name_en,
          gate_code: p.gate_code,
          gate_status: record.status,
          signoff_date: record.signoffDate || 'N/A',
          signoff_author: record.signoffAuthor || 'N/A',
          deliverables_count: p.deliverables.length,
          deliverables: p.deliverables.map(d => ({
            code: d.code,
            title: locale === 'fr' ? d.title_fr : d.title_en,
            responsible: d.responsible_role,
            verifying: d.verifying_role,
            standards: d.applicable_standards,
            mandatory: d.is_mandatory_for_gate
          })),
          gate_criteria: p.gate_criteria.map(c => ({
            clause: c.clause,
            requirement: locale === 'fr' ? c.requirement_fr : c.requirement_en,
            threshold: c.acceptance_threshold,
            verification_method: c.verification_method
          }))
        };
      })
    };

    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EPEDE_Project_Lifecycle_Dossier_${reportDate.split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter deliverables by search
  const filteredDeliverables = useMemo(() => {
    if (!searchQuery.trim()) return selectedPhase.deliverables;
    const q = searchQuery.toLowerCase();
    return selectedPhase.deliverables.filter(d => 
      d.code.toLowerCase().includes(q) ||
      d.title_fr.toLowerCase().includes(q) ||
      d.title_en.toLowerCase().includes(q) ||
      d.description_fr.toLowerCase().includes(q) ||
      d.description_en.toLowerCase().includes(q) ||
      d.applicable_standards.some(s => s.toLowerCase().includes(q))
    );
  }, [selectedPhase, searchQuery]);

  return (
    <div className="space-y-6 pb-16 font-sans">
      
      {/* Top Banner & SCADA Ribbon Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl cad-grid-dense">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black uppercase px-2.5 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-amber-400" />
                <span>L03 · CYCLE DE VIE PROJET EPC</span>
              </span>
              <span className="font-mono text-xs text-slate-400">
                {locale === 'fr' ? 'Protocole FIDIC & CEI 61936' : 'FIDIC & IEC 61936 Protocol'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-black tracking-tight text-white uppercase">
              {locale === 'fr' ? 'Gouvernance & Jalons d\'Ingénierie EPC' : 'EPC Project Lifecycle & Gate Reviews'}
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed font-medium">
              {locale === 'fr'
                ? 'Pilotage rigoureux des 7 phases canoniques d\'un projet de transport ou distribution haute tension (225/90/30 kV). Revue formelle des jalons décisionnels (Decision Gates), validation des livrables de calcul et traçabilité QA/QC.'
                : 'Rigorous engineering governance across the 7 canonical EPC phases for high-voltage transmission & substations (225/90/30 kV). Decision gate reviews, certified calculation deliverables and QA/QC sign-offs.'}
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 min-w-[140px] shadow-xs">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                {locale === 'fr' ? 'Avancement Global' : 'Overall Progress'}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-mono font-black text-amber-400">{overallProgress}%</span>
                <span className="text-xs text-slate-400 font-mono">
                  ({(Object.values(gateRecords) as GateRecord[]).filter(r => r.status === 'approved').length}/7 {locale === 'fr' ? 'validés' : 'approved'})
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            {onNavigateContextStack && (
              <button
                type="button"
                onClick={() => onNavigateContextStack('node-trafo-main-30')}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-bold transition-all shadow-xs"
                title={locale === 'fr' ? "Consulter l'Épine Dorsale & Courbes TCC" : 'View Physical Spine & TCC Curves'}
              >
                <Zap className="h-3.5 w-3.5 text-sky-200" />
                <span>{locale === 'fr' ? 'Épine Dorsale & TCC' : 'Spine & TCC'}</span>
              </button>
            )}

            {onNavigateRegulatory && (
              <button
                type="button"
                onClick={onNavigateRegulatory}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800 hover:border-amber-400 text-xs font-mono font-bold transition-all shadow-xs"
                title={locale === 'fr' ? 'Consulter le Code Réseau & Cadre Réglementaire' : 'View Grid Code & Regulatory Framework'}
              >
                <Scale className="h-3.5 w-3.5 text-amber-400" />
                <span>{locale === 'fr' ? 'Code Réseau L06' : 'Grid Code L06'}</span>
              </button>
            )}

            {onNavigateCameroonGrid && (
              <button
                type="button"
                onClick={onNavigateCameroonGrid}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 hover:border-emerald-500/50 text-xs font-mono font-bold transition-all shadow-xs"
                title={locale === 'fr' ? 'Consulter l\'Observatoire Réseau Cameroun' : 'View Cameroon Grid Observatory'}
              >
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
                <span>{locale === 'fr' ? 'Réseau Cameroun L05' : 'Cameroon Grid L05'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportDossier}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400 text-xs font-mono font-bold transition-all shadow-md shadow-amber-500/15"
            >
              <Download className="h-4 w-4 text-slate-950" />
              <span>{locale === 'fr' ? 'Exporter Dossier EPC' : 'Export EPC Dossier'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetWorkflow}
              title={locale === 'fr' ? 'Réinitialiser les statuts' : 'Reset workflow'}
              className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors shadow-xs"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Phase Timeline Stepper */}
      <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-4 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] gap-2">
          {LIFECYCLE_PHASES.map((phase, idx) => {
            const isSelected = selectedPhaseId === phase.id;
            const record = gateRecords[phase.id] || { status: 'pending' };
            const isApproved = record.status === 'approved';
            const isInProgress = record.status === 'in_progress';

            return (
              <React.Fragment key={phase.id}>
                <button
                  type="button"
                  onClick={() => setSelectedPhaseId(phase.id)}
                  className={`flex-1 flex flex-col items-start p-3 rounded-lg border transition-all text-left group relative ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : isApproved
                      ? 'bg-[#11161D] border-emerald-500/40 hover:border-emerald-400'
                      : isInProgress
                      ? 'bg-[#11161D] border-cyan-500/40 hover:border-cyan-400'
                      : 'bg-[#11161D] border-[#252E38] hover:border-neutral-500 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-[10px] font-black uppercase text-neutral-400 group-hover:text-white">
                      {phase.code}
                    </span>
                    {isApproved ? (
                      <span className="flex items-center text-[10px] font-mono text-emerald-400 font-bold gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>DG{phase.phase_number}</span>
                      </span>
                    ) : isInProgress ? (
                      <span className="flex items-center text-[10px] font-mono text-cyan-400 font-bold gap-1">
                        <Clock className="h-3 w-3 animate-spin" />
                        <span>EN COURS</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-neutral-400">DG{phase.phase_number}</span>
                    )}
                  </div>

                  <div className="mt-2 font-mono text-xs font-bold text-white line-clamp-1">
                    {locale === 'fr' ? phase.title_fr : phase.title_en}
                  </div>

                  <div className="mt-1 text-[11px] text-neutral-400 line-clamp-1">
                    {locale === 'fr' ? phase.subtitle_fr : phase.subtitle_en}
                  </div>
                </button>

                {idx < LIFECYCLE_PHASES.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Phase Detail Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Phase Overview, Deliverables, Gate Review Engine */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Phase Header Card */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252E38] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    PHASE {selectedPhase.phase_number} · {selectedPhase.code}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    {locale === 'fr' ? 'Durée estimée :' : 'Estimated duration:'} {selectedPhase.typical_duration_months}
                  </span>
                </div>
                <h2 className="text-xl font-mono font-black text-white mt-1">
                  {locale === 'fr' ? selectedPhase.title_fr : selectedPhase.title_en}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {locale === 'fr' ? selectedPhase.subtitle_fr : selectedPhase.subtitle_en}
                </p>
              </div>

              {/* Status Badge & Controller */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-neutral-400">{locale === 'fr' ? 'Statut Jalon :' : 'Gate Status:'}</span>
                <select
                  value={gateRecords[selectedPhase.id]?.status || 'pending'}
                  onChange={(e) => handleUpdateGateStatus(selectedPhase.id, e.target.value as GateStatus)}
                  className="bg-[#161C24] text-white border border-[#323D4A] rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-cyan-400"
                >
                  <option value="approved">{locale === 'fr' ? '✓ Validé (Approved)' : '✓ Approved'}</option>
                  <option value="in_progress">{locale === 'fr' ? '⏳ En cours (In Progress)' : '⏳ In Progress'}</option>
                  <option value="pending">{locale === 'fr' ? '○ En attente (Pending)' : '○ Pending'}</option>
                  <option value="rejected">{locale === 'fr' ? '✕ Réservé / Rejeté' : '✕ Action Required'}</option>
                </select>
              </div>
            </div>

            {/* Objective statement */}
            <div className="p-3.5 rounded-lg bg-[#11161D] border border-[#252E38] text-xs text-neutral-300 leading-relaxed">
              <span className="font-mono font-bold text-amber-400 mr-2">
                {locale === 'fr' ? 'OBJECTIF STRATÉGIQUE :' : 'STRATEGIC OBJECTIVE:'}
              </span>
              {locale === 'fr' ? selectedPhase.objective_fr : selectedPhase.objective_en}
            </div>

            {/* Sub-tabs: Deliverables vs Gate Criteria vs Risk factors */}
            <div className="flex items-center gap-2 border-b border-[#252E38] pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('deliverables')}
                className={`px-3.5 py-2 font-mono text-xs font-bold transition-colors border-b-2 ${
                  activeTab === 'deliverables'
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                {locale === 'fr' ? `Livrables Techniques (${selectedPhase.deliverables.length})` : `Technical Deliverables (${selectedPhase.deliverables.length})`}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('gate_criteria')}
                className={`px-3.5 py-2 font-mono text-xs font-bold transition-colors border-b-2 ${
                  activeTab === 'gate_criteria'
                    ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                {locale === 'fr' ? `Critères du Jalon (${selectedPhase.gate_criteria.length})` : `Gate Criteria (${selectedPhase.gate_criteria.length})`}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('risks')}
                className={`px-3.5 py-2 font-mono text-xs font-bold transition-colors border-b-2 ${
                  activeTab === 'risks'
                    ? 'border-red-400 text-red-300 bg-red-500/5'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                {locale === 'fr' ? `Facteurs de Risque (${selectedPhase.risk_factors.length})` : `Risk Factors (${selectedPhase.risk_factors.length})`}
              </button>
            </div>

            {/* Tab 1: Technical Deliverables */}
            {activeTab === 'deliverables' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="h-3.5 w-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={locale === 'fr' ? 'Filtrer un livrable, code, norme...' : 'Filter deliverable, code, standard...'}
                      className="w-full bg-[#161C24] text-xs font-mono text-white pl-9 pr-3 py-1.5 rounded-lg border border-[#252E38] focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                    {filteredDeliverables.length} {locale === 'fr' ? 'livrable(s)' : 'deliverable(s)'}
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredDeliverables.map((del) => (
                    <div
                      key={del.id}
                      className="p-4 rounded-lg bg-[#11161D] border border-[#252E38] hover:border-[#3b4754] transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                            {del.code}
                          </span>
                          <span className="font-mono text-sm font-bold text-white">
                            {locale === 'fr' ? del.title_fr : del.title_en}
                          </span>
                        </div>
                        {del.is_mandatory_for_gate && (
                          <span className="font-mono text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30 shrink-0 self-start sm:self-auto">
                            {locale === 'fr' ? 'OBLIGATOIRE POUR JALON' : 'MANDATORY FOR GATE'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {locale === 'fr' ? del.description_fr : del.description_en}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1e252e] text-[11px] font-mono">
                        <div className="flex flex-wrap items-center gap-3 text-neutral-400">
                          <div>
                            <span className="text-neutral-400">{locale === 'fr' ? 'Resp :' : 'Resp:'} </span>
                            <span className="text-neutral-200">{del.responsible_role}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400">{locale === 'fr' ? 'Visa :' : 'Visa:'} </span>
                            <span className="text-cyan-300">{del.verifying_role}</span>
                          </div>
                        </div>

                        {/* Applicable Norms */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {del.applicable_standards.map((std) => (
                            <span
                              key={std}
                              onClick={onNavigateStandards}
                              className="px-2 py-0.5 rounded bg-[#161C24] text-neutral-300 border border-[#252E38] hover:border-amber-400 hover:text-amber-300 cursor-pointer transition-colors"
                            >
                              {std}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Interactive engine links */}
                      {(del.associated_calculator || del.associated_simulation) && (
                        <div className="flex items-center gap-2 pt-1">
                          {del.associated_calculator && onNavigateCalculator && (
                            <button
                              type="button"
                              onClick={() => onNavigateCalculator(del.associated_calculator!)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-mono font-bold transition-all"
                            >
                              <Calculator className="h-3 w-3" />
                              <span>{locale === 'fr' ? 'Ouvrir Calculateur' : 'Open Calculator'} ({del.associated_calculator})</span>
                            </button>
                          )}
                          {del.associated_simulation && onNavigateSimulation && (
                            <button
                              type="button"
                              onClick={() => onNavigateSimulation(del.associated_simulation!)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-mono font-bold transition-all"
                            >
                              <Zap className="h-3 w-3" />
                              <span>{locale === 'fr' ? 'Simulateur Lab' : 'Simulation Lab'} ({del.associated_simulation})</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Gate Criteria & Acceptance Thresholds */}
            {activeTab === 'gate_criteria' && (
              <div className="space-y-3 pt-2">
                <div className="text-xs text-neutral-400 font-mono">
                  {locale === 'fr'
                    ? 'Conditions contractuelles strictes requises pour franchir le jalon décisionnel :'
                    : 'Strict contractual requirements to pass the Decision Gate:'}
                </div>

                <div className="space-y-3">
                  {selectedPhase.gate_criteria.map((crit) => (
                    <div
                      key={crit.id}
                      className="p-4 rounded-lg bg-[#11161D] border border-[#252E38] space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                          {crit.clause}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400">
                          {crit.verification_method}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-white">
                        {locale === 'fr' ? crit.requirement_fr : crit.requirement_en}
                      </div>

                      <div className="p-2.5 rounded bg-[#161C24] border border-[#252E38] text-[11px] font-mono text-amber-300 flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>
                          <strong className="text-neutral-400 font-normal">
                            {locale === 'fr' ? 'Seuil d\'acceptation : ' : 'Acceptance Threshold: '}
                          </strong>
                          {crit.acceptance_threshold}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Risk Factors */}
            {activeTab === 'risks' && (
              <div className="space-y-3 pt-2">
                <div className="text-xs text-neutral-400 font-mono">
                  {locale === 'fr'
                    ? 'Risques techniques majeurs documentés pour cette phase (FMECA) :'
                    : 'Major technical risks documented for this phase (FMECA):'}
                </div>

                <div className="space-y-2.5">
                  {selectedPhase.risk_factors.map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/30 flex items-start gap-3"
                    >
                      <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-red-200 leading-relaxed font-sans">
                        {locale === 'fr' ? risk.fr : risk.en}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Decision Gate Card, Key Actors & Cross-Links */}
        <div className="space-y-6">
          
          {/* Gate Review Sign-off Card */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#252E38]">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span className="font-mono text-xs font-black uppercase text-white tracking-wider">
                {locale === 'fr' ? 'VISA DU JALON DÉCISIONNEL' : 'DECISION GATE SIGN-OFF'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-mono uppercase text-neutral-400">{locale === 'fr' ? 'Jalon :' : 'Gate:'}</div>
                <div className="font-mono text-xs font-bold text-cyan-400">
                  {selectedPhase.gate_code} · {locale === 'fr' ? selectedPhase.gate_name_fr : selectedPhase.gate_name_en}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase text-neutral-400">{locale === 'fr' ? 'Statut d\'approbation :' : 'Approval Status:'}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-1 rounded font-mono text-xs font-bold border ${
                    gateRecords[selectedPhase.id]?.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : gateRecords[selectedPhase.id]?.status === 'in_progress'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}>
                    {(gateRecords[selectedPhase.id]?.status || 'pending').toUpperCase()}
                  </span>
                </div>
              </div>

              {gateRecords[selectedPhase.id]?.signoffDate && (
                <div className="p-3 rounded-lg bg-[#11161D] border border-[#252E38] text-[11px] font-mono space-y-1">
                  <div className="text-neutral-400">
                    {locale === 'fr' ? 'Date de visa :' : 'Sign-off Date:'} <span className="text-white">{gateRecords[selectedPhase.id].signoffDate}</span>
                  </div>
                  <div className="text-neutral-400">
                    {locale === 'fr' ? 'Signataire :' : 'Signatory:'} <span className="text-cyan-300">{gateRecords[selectedPhase.id].signoffAuthor}</span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleUpdateGateStatus(
                    selectedPhase.id, 
                    gateRecords[selectedPhase.id]?.status === 'approved' ? 'in_progress' : 'approved'
                  )}
                  className={`w-full py-2 px-3 rounded-lg font-mono text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                    gateRecords[selectedPhase.id]?.status === 'approved'
                      ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  }`}
                >
                  <Award className="h-4 w-4" />
                  <span>
                    {gateRecords[selectedPhase.id]?.status === 'approved'
                      ? (locale === 'fr' ? 'Révoquer le Visa' : 'Revoke Sign-off')
                      : (locale === 'fr' ? 'Valider le Jalon DG' : 'Sign-off Decision Gate')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Engineering Actors */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#252E38]">
              <Users className="h-4 w-4 text-cyan-400" />
              <span className="font-mono text-xs font-black uppercase text-white tracking-wider">
                {locale === 'fr' ? 'ACTEURS CLÉS DE LA PHASE' : 'KEY PHASE STAKEHOLDERS'}
              </span>
            </div>

            <ul className="space-y-2 font-mono text-xs text-neutral-300">
              {selectedPhase.key_actors.map((actor, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{actor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Portals */}
          <div className="bg-[#0D1117] border border-[#252E38] rounded-xl p-5 space-y-3">
            <span className="font-mono text-xs font-black uppercase text-neutral-400 tracking-wider">
              {locale === 'fr' ? 'RESSOURCES ASSOCIÉES' : 'ASSOCIATED RESOURCES'}
            </span>

            <div className="space-y-2 font-mono text-xs">
              <button
                type="button"
                onClick={onNavigateStandards}
                className="w-full p-2.5 rounded-lg bg-[#161C24] hover:bg-[#1f2733] text-left text-neutral-200 border border-[#252E38] hover:border-amber-400/40 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-amber-400" />
                  <span>{locale === 'fr' ? 'Répertoire Normes L01 (FAT/SAT)' : 'L01 Standards & FAT/SAT'}</span>
                </div>
                <ExternalLink className="h-3 w-3 text-neutral-400" />
              </button>

              <button
                type="button"
                onClick={onNavigatePhase2}
                className="w-full p-2.5 rounded-lg bg-[#161C24] hover:bg-[#1f2733] text-left text-neutral-200 border border-[#252E38] hover:border-cyan-400/40 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{locale === 'fr' ? 'Spécifications P2 (D01-D16)' : 'P2 Specs & Matrices'}</span>
                </div>
                <ExternalLink className="h-3 w-3 text-neutral-400" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
