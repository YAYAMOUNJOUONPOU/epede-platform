// src/components/diagnostics/FieldCausalDiagnosisWorkbench.tsx
// EPEDE - Field Observation to Engineering Diagnosis Interactive Workbench
// Implements the 6-stage causal diagnostic pathway for power systems field engineers

import React, { useState, useMemo } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  Flame,
  Activity,
  CheckCircle2,
  XCircle,
  Search,
  Wrench,
  Gauge,
  Layers,
  Shield,
  FileCheck,
  Lock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  Check,
  Scale,
  Sparkles,
  Info,
  Clock,
  BookOpen,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import {
  FIELD_DIAGNOSIS_CASES,
  FieldDiagnosisCase,
  DiagnosticSymptomCategory,
  DiagnosticUrgencyLevel
} from '../../data/fieldDiagnosisCasesData';
import { EvidenceTrustBadge } from '../equipment/EvidenceTrustBadge';

interface FieldCausalDiagnosisWorkbenchProps {
  locale?: 'fr' | 'en';
  initialCaseId?: string;
  embedded?: boolean;
}

export const FieldCausalDiagnosisWorkbench: React.FC<FieldCausalDiagnosisWorkbenchProps> = ({
  locale = 'fr',
  initialCaseId,
  embedded = false
}) => {
  const isFr = locale === 'fr';

  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    initialCaseId || FIELD_DIAGNOSIS_CASES[0].id
  );
  const [selectedCategory, setSelectedCategory] = useState<DiagnosticSymptomCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStageTab, setActiveStageTab] = useState<number>(1);
  const [copiedReport, setCopiedReport] = useState(false);

  // Interactive Diagnostic Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<number>(0);
  const [wizardAnswers, setWizardAnswers] = useState<Record<string, string>>({});

  const activeCase = useMemo(() => {
    return FIELD_DIAGNOSIS_CASES.find((c) => c.id === selectedCaseId) || FIELD_DIAGNOSIS_CASES[0];
  }, [selectedCaseId]);

  const filteredCases = useMemo(() => {
    return FIELD_DIAGNOSIS_CASES.filter((c) => {
      if (selectedCategory !== 'ALL' && c.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.symptomTitle_fr.toLowerCase().includes(q) || c.symptomTitle_en.toLowerCase().includes(q);
        const matchEquip = c.targetEquipmentFamilies.some(f => f.toLowerCase().includes(q));
        const matchCauses = c.probableRootCauses.some(rc => rc.cause_fr.toLowerCase().includes(q) || rc.cause_en.toLowerCase().includes(q));
        return matchTitle || matchEquip || matchCauses;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const getUrgencyBadge = (urgency: DiagnosticUrgencyLevel) => {
    switch (urgency) {
      case 'TRIP_IMMEDIATE':
        return {
          label: isFr ? 'URGENCE ABSOLUE (ARRÊT IMMÉDIAT)' : 'IMMEDIATE EMERGENCY TRIP',
          badgeClass: 'bg-rose-950/90 text-rose-300 border-rose-700/60 animate-pulse'
        };
      case 'CRITICAL_24H':
        return {
          label: isFr ? 'CRITIQUE (INTERVENTION < 24H)' : 'CRITICAL (REPAIR WITHIN 24H)',
          badgeClass: 'bg-amber-950/90 text-amber-300 border-amber-700/60'
        };
      case 'MONITORING_7D':
        return {
          label: isFr ? 'SURVEILLANCE RAPPROCHÉE' : 'CONDITION MONITORING',
          badgeClass: 'bg-cyan-950/90 text-cyan-300 border-cyan-700/60'
        };
      case 'SCHEDULED_OUTAGE':
      default:
        return {
          label: isFr ? 'MAINTENANCE PROGRAMMÉE' : 'SCHEDULED MAINTENANCE',
          badgeClass: 'bg-slate-800 text-slate-300 border-slate-700'
        };
    }
  };

  const handleExportReport = () => {
    const lines = [
      isFr ? `RAPPORT DE DIAGNOSTIC D'INGÉNIERIE TERRAIN — EPEDE` : `EPEDE FIELD ENGINEERING DIAGNOSTIC REPORT`,
      `================================================================`,
      `${isFr ? 'SYMPTÔME ANALYSÉ' : 'ANALYZED SYMPTOM'} : ${isFr ? activeCase.symptomTitle_fr : activeCase.symptomTitle_en}`,
      `${isFr ? 'NIVEAU D\'URGENCE' : 'URGENCY LEVEL'} : ${activeCase.urgency}`,
      `${isFr ? 'TECHNIQUE DE DÉTECTION' : 'DETECTION METHOD'} : ${isFr ? activeCase.detectionTechnique_fr : activeCase.detectionTechnique_en}`,
      ``,
      isFr ? `1. CAUSES PHYSIQUES RACINES (FMEA) :` : `1. PROBABLE ROOT CAUSES (FMEA):`,
      ...activeCase.probableRootCauses.map((rc, idx) => 
        `   [${rc.probabilityPercent}%] ${isFr ? rc.cause_fr : rc.cause_en} — ${isFr ? rc.physicalMechanism_fr : rc.physicalMechanism_en}`
      ),
      ``,
      isFr ? `2. ESSAIS ÉLECTROTECHNIQUES CONTRADICTOIRES :` : `2. CONTRADICTORY ELECTRICAL TESTS:`,
      ...activeCase.requiredFieldTests.map((t, idx) =>
        `   • ${isFr ? t.testName_fr : t.testName_en} (${t.governingStandard}) | Seuil : ${isFr ? t.acceptanceThreshold_fr : t.acceptanceThreshold_en}`
      ),
      ``,
      isFr ? `3. RELAIS DE PROTECTION & CODES ANSI ASSOCIÉS :` : `3. ASSOCIATED PROTECTION RELAYS (ANSI):`,
      ...activeCase.protectionFunctions.map((p, idx) =>
        `   • ANSI ${p.ansiCode} [${isFr ? p.functionName_fr : p.functionName_en}] | Temps : ${p.typicalTripTime}`
      ),
      ``,
      isFr ? `4. CONSIGNATION SÉCURITAIRE LOTO :` : `4. LOTO SAFETY ISOLATION STEPS:`,
      ...activeCase.lotoIsolationSteps.map((l, idx) =>
        `   Étape ${l.stepNumber} : ${isFr ? l.action_fr : l.action_en} [Vérif: ${isFr ? l.verificationMethod_fr : l.verificationMethod_en}]`
      ),
      ``,
      isFr ? `5. PROTOCOLE D'ESCALADE :` : `5. ESCALATION PROTOCOL:`,
      isFr ? activeCase.escalationProtocol_fr : activeCase.escalationProtocol_en,
      `================================================================`,
      isFr ? `Généré le ${new Date().toLocaleString('fr-FR')} par la Station EPEDE` : `Generated on ${new Date().toLocaleString()} by EPEDE Platform`
    ];

    const reportText = lines.join('\n');
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(reportText);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2500);
    }
  };

  const urgencyInfo = getUrgencyBadge(activeCase.urgency);

  return (
    <div className={`space-y-6 font-sans ${embedded ? '' : 'p-4 sm:p-6 max-w-7xl mx-auto'}`}>
      
      {/* Top Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-[#0A0E15] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-rose-400" />
                <span>{isFr ? 'PRATIQUE MÉTIER & DIAGNOSTIC D\'INGÉNIERIE' : 'ENGINEERING FIELD DIAGNOSTIC WORKBENCH'}</span>
              </span>
              <EvidenceTrustBadge level={activeCase.trustLevel} locale={locale} size="sm" />
            </div>

            <h2 className="text-xl sm:text-2xl font-mono font-black text-white uppercase tracking-tight">
              {isFr
                ? 'De l\'Observation Terrain au Diagnostic d\'Ingénierie & Parade'
                : 'From Field Observation to Engineering Root Cause & Remedy'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              {isFr
                ? 'Arborescence causale guidée reliant les symptômes anormaux réels aux mécanismes physiques de dégradation, normes d\'essais contradictoires, seuils d\'intervention et procédures de consignation LOTO.'
                : 'Guided causal failure trees linking field symptoms to physical degradation mechanics, contradictory electrical test procedures, protective relay coordination, and mandatory LOTO clearance.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportReport}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedReport ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">{isFr ? 'Rapport Copié !' : 'Report Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isFr ? 'Copier Rapport d\'Expertise' : 'Copy Expert Report'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Category Filters Toolbar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            {[
              { id: 'ALL', label_fr: 'Tous les Cas', label_en: 'All Cases' },
              { id: 'DGA_OIL_DIELECTRIC', label_fr: 'Huile & DGA', label_en: 'Oil & DGA' },
              { id: 'MECHANICAL_PRESSURE', label_fr: 'Pression & Buchholz', label_en: 'Pressure & Buchholz' },
              { id: 'SF6_GAS_INSULATION', label_fr: 'Gaz SF₆', label_en: 'SF₆ Gas' },
              { id: 'ELECTRICAL_TRIP', label_fr: 'Déclenchement Relais', label_en: 'Relay Trips' },
              { id: 'THERMAL_INFRARED', label_fr: 'Infrarouge & Thermique', label_en: 'Thermal & IR' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
                }`}
              >
                {isFr ? cat.label_fr : cat.label_en}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={isFr ? "Filtrer un symptôme, matériel..." : "Filter symptom, asset..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs font-mono focus:outline-hidden focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Case List (1/3) + Right 6-Stage Investigation Pathway (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Symptom Incident Selector */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
            {isFr ? `Incidents & Défaillances Documentés (${filteredCases.length})` : `Documented Failure Cases (${filteredCases.length})`}
          </span>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filteredCases.map((c) => {
              const isSelected = c.id === selectedCaseId;
              const badge = getUrgencyBadge(c.urgency);

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500/80 bg-[#121A26] shadow-lg ring-1 ring-amber-500/30'
                      : 'border-slate-800 bg-[#0B0F15] hover:border-slate-700 hover:bg-[#0E141E]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                    <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold border ${badge.badgeClass}`}>
                      {badge.label}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">
                      {c.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-200 mt-2 font-sans leading-snug">
                    {isFr ? c.symptomTitle_fr : c.symptomTitle_en}
                  </h4>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{c.probableRootCauses.length} {isFr ? 'causes FMEA' : 'FMEA causes'}</span>
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      <span>{isFr ? 'Voir analyse' : 'View case'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 6-Stage Investigation Pathway */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Active Case Header Card */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0C121B] via-[#0E1522] to-[#0A0F17] shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${urgencyInfo.badgeClass}`}>
                {urgencyInfo.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">Équipements :</span>
                {activeCase.targetEquipmentFamilies.map((fam, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 font-mono text-[10px]">
                    {fam}
                  </span>
                ))}
              </div>
            </div>

            <h3 className="text-lg font-bold font-sans text-white">
              {isFr ? activeCase.symptomTitle_fr : activeCase.symptomTitle_en}
            </h3>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-2">
              <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 font-bold block text-[10px] uppercase">
                  {isFr ? 'Mode de Détection & Découverte Terrain :' : 'Field Detection & Discovery Technique:'}
                </span>
                <span>{isFr ? activeCase.detectionTechnique_fr : activeCase.detectionTechnique_en}</span>
              </div>
            </div>
          </div>

          {/* 6-Stage Pathway Tabs Navigation */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-[11px]">
            {[
              { num: 1, label_fr: '1. Constat', label_en: '1. Observe' },
              { num: 2, label_fr: '2. Causes FMEA', label_en: '2. Causes' },
              { num: 3, label_fr: '3. Essais CEI', label_en: '3. Tests' },
              { num: 4, label_fr: '4. Relais ANSI', label_en: '4. Relays' },
              { num: 5, label_fr: '5. LOTO Sécurité', label_en: '5. LOTO' },
              { num: 6, label_fr: '6. Conduite', label_en: '6. Remedy' },
            ].map((st) => (
              <button
                key={st.num}
                type="button"
                onClick={() => setActiveStageTab(st.num)}
                className={`py-2 px-1 rounded-lg font-bold transition-all cursor-pointer truncate ${
                  activeStageTab === st.num
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {isFr ? st.label_fr : st.label_en}
              </button>
            ))}
          </div>

          {/* Stage 1: Observable Indicators */}
          {activeStageTab === 1 && (
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0B0F15] space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-xs uppercase tracking-wider">
                <Search className="w-4 h-4 text-amber-400" />
                <span>{isFr ? 'Étape 1 : Constat & Indices Observables sur le Terrain' : 'Stage 1: Field Symptoms & Observable Indicators'}</span>
              </div>

              <div className="space-y-2">
                {(isFr ? activeCase.observableIndicators_fr : activeCase.observableIndicators_en).map((ind, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>

              {activeCase.cameroonContextNotes && (
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs font-mono text-amber-300 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">
                    {isFr ? 'Spécificité Terrain Cameroun (SONATREL / ENEO) :' : 'Cameroon Grid Field Notice:'}
                  </span>
                  <p>{isFr ? activeCase.cameroonContextNotes.fr : activeCase.cameroonContextNotes.en}</p>
                </div>
              )}
            </div>
          )}

          {/* Stage 2: Causal Root Causes (FMEA) */}
          {activeStageTab === 2 && (
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0B0F15] space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-rose-400 font-bold font-mono text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>{isFr ? 'Étape 2 : Arbre des Causes Racines Physiques (FMEA)' : 'Stage 2: Physical Root Causes Tree (FMEA)'}</span>
              </div>

              <div className="space-y-3">
                {activeCase.probableRootCauses.map((rc, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-white font-sans text-xs">
                        {isFr ? rc.cause_fr : rc.cause_en}
                      </strong>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold shrink-0">
                        {rc.probabilityPercent}% {isFr ? 'probabilité' : 'likelihood'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      <span className="text-slate-500 font-mono text-[10px] uppercase font-bold block">
                        {isFr ? 'Mécanisme Physique de Dégradation :' : 'Physical Degradation Mechanism:'}
                      </span>
                      {isFr ? rc.physicalMechanism_fr : rc.physicalMechanism_en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 3: Electrical Testing Protocols */}
          {activeStageTab === 3 && (
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0B0F15] space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-xs uppercase tracking-wider">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>{isFr ? 'Étape 3 : Essais Électrotechniques & Normes d\'Essai' : 'Stage 3: Electrical Field Tests & Reference Standards'}</span>
              </div>

              <div className="space-y-3">
                {activeCase.requiredFieldTests.map((t, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-cyan-300 font-sans text-xs flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{isFr ? t.testName_fr : t.testName_en}</span>
                      </strong>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[10px] border border-slate-800">
                        {t.governingStandard}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                      <div className="p-2 rounded bg-slate-900 border border-slate-850">
                        <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">
                          {isFr ? 'Appareil de Mesure :' : 'Measuring Instrument:'}
                        </span>
                        <span className="text-slate-300">{t.measuringInstrument}</span>
                      </div>

                      <div className="p-2 rounded bg-slate-900 border border-slate-850">
                        <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold block">
                          {isFr ? 'Critère d\'Admissibilité :' : 'Acceptance Threshold:'}
                        </span>
                        <span className="text-slate-200 font-medium">{isFr ? t.acceptanceThreshold_fr : t.acceptanceThreshold_en}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-amber-300/90 font-mono">
                      <span className="text-slate-500 uppercase font-bold">Consigne Sécurité Essai : </span>
                      {isFr ? t.safetyRequirement_fr : t.safetyRequirement_en}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 4: Protection Functions & ANSI Codes */}
          {activeStageTab === 4 && (
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0B0F15] space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-purple-400 font-bold font-mono text-xs uppercase tracking-wider">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>{isFr ? 'Étape 4 : Fonctions de Protection & Relais Associés (ANSI)' : 'Stage 4: Protective Relays & ANSI Function Codes'}</span>
              </div>

              <div className="space-y-3">
                {activeCase.protectionFunctions.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-black text-xs border border-purple-500/40">
                          ANSI {p.ansiCode}
                        </span>
                        <strong className="text-white font-sans text-xs">
                          {isFr ? p.functionName_fr : p.functionName_en}
                        </strong>
                      </div>

                      <span className="text-[11px] text-cyan-300 font-mono">
                        {p.typicalTripTime}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-sans">
                      <span className="text-slate-500 font-mono text-[10px] uppercase font-bold block">
                        {isFr ? 'Action du Relais sur le Réseau :' : 'Relay Tripping Action:'}
                      </span>
                      {isFr ? p.relayAction_fr : p.relayAction_en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 5: Mandatory LOTO Safety Clearance */}
          {activeStageTab === 5 && (
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0B0F15] space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold font-mono text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>{isFr ? 'Étape 5 : Procédure de Consignation Électrique & LOTO (5 Règles d\'Or)' : 'Stage 5: Mandatory LOTO Electrical Isolation Sequence'}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">EN 50110 / UTE C 18-510</span>
              </div>

              <div className="space-y-2.5">
                {activeCase.lotoIsolationSteps.map((s) => (
                  <div key={s.stepNumber} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs">
                    <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                      {s.stepNumber}
                    </span>

                    <div className="space-y-1 flex-1">
                      <p className="text-white font-medium">
                        {isFr ? s.action_fr : s.action_en}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        <span className="text-emerald-400 font-bold">{isFr ? 'Moyen de vérification : ' : 'Verification method: '}</span>
                        {isFr ? s.verificationMethod_fr : s.verificationMethod_en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 6: Escalation & Operational Remedy */}
          {activeStageTab === 6 && (
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0B0F15] space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs uppercase tracking-wider">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>{isFr ? 'Étape 6 : Conduite à Tenir, Escalade & Remède d\'Exploitation' : 'Stage 6: Operational Remedy, Escalation & Repair Plan'}</span>
              </div>

              <div className="space-y-3 font-sans text-xs">
                {/* Escalation Protocol */}
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
                    {isFr ? 'Procédure d\'Escalade & Alerte Dispatching :' : 'Dispatching Notification & Escalation Protocol:'}
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {isFr ? activeCase.escalationProtocol_fr : activeCase.escalationProtocol_en}
                  </p>
                </div>

                {/* Provisional vs Definitive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                      {isFr ? 'Remède Provisoire d\'Exploitation :' : 'Provisional Operational Remedy:'}
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {isFr ? activeCase.provisionalRemedy_fr : activeCase.provisionalRemedy_en}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                      {isFr ? 'Réparation Définitive Requise :' : 'Definitive Engineering Overhaul:'}
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {isFr ? activeCase.definitiveRepair_fr : activeCase.definitiveRepair_en}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
