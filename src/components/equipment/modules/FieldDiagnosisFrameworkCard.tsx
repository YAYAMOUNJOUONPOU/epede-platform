// src/components/equipment/modules/FieldDiagnosisFrameworkCard.tsx
// EPEDE - Field Observation to Engineering Diagnosis Framework (Priority 10)
// Connects physical field symptoms to electrotechnical root causes, FMEA, ANSI relays, and LOTO safety protocols

import React, { useState } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  Flame,
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Wrench,
  Gauge,
  Shield,
  Lock,
  ExternalLink,
  X
} from 'lucide-react';
import { EvidenceTrustBadge } from '../EvidenceTrustBadge';
import { FIELD_DIAGNOSIS_CASES, FieldDiagnosisCase, DiagnosticUrgencyLevel } from '../../../data/fieldDiagnosisCasesData';
import { FieldCausalDiagnosisWorkbench } from '../../diagnostics/FieldCausalDiagnosisWorkbench';

export interface FieldDiagnosisProps {
  equipmentId?: string;
  domainCode?: string;
  locale: 'fr' | 'en';
}

export const FieldDiagnosisFrameworkCard: React.FC<FieldDiagnosisProps> = ({
  equipmentId = '',
  domainCode = 'D04',
  locale = 'fr'
}) => {
  const isFr = locale === 'fr';
  const [expandedId, setExpandedId] = useState<string | null>(FIELD_DIAGNOSIS_CASES[0].id);
  const [isFullWorkbenchModalOpen, setIsFullWorkbenchModalOpen] = useState(false);
  const [selectedCaseForModal, setSelectedCaseForModal] = useState<string>(FIELD_DIAGNOSIS_CASES[0].id);

  // Filter cases matching equipment family or fallback
  const matchingCases = React.useMemo(() => {
    const eqLower = equipmentId.toLowerCase();
    const isTrafo = eqLower.includes('trafo') || eqLower.includes('gsu') || domainCode === 'D04';
    const isBreaker = eqLower.includes('cb') || eqLower.includes('disjoncteur') || eqLower.includes('bay');
    const isLine = eqLower.includes('line') || eqLower.includes('tower') || domainCode === 'D03';
    const isGen = eqLower.includes('gen') || eqLower.includes('alternateur') || domainCode === 'D01';

    const filtered = FIELD_DIAGNOSIS_CASES.filter((c) => {
      if (isTrafo && c.targetEquipmentFamilies.includes('transformer')) return true;
      if (isBreaker && c.targetEquipmentFamilies.includes('circuit_breaker')) return true;
      if (isLine && c.targetEquipmentFamilies.includes('transmission_line')) return true;
      if (isGen && c.targetEquipmentFamilies.includes('generator')) return true;
      return false;
    });

    return filtered.length > 0 ? filtered : FIELD_DIAGNOSIS_CASES.slice(0, 3);
  }, [equipmentId, domainCode]);

  const getUrgencyBadge = (urgency: DiagnosticUrgencyLevel) => {
    switch (urgency) {
      case 'TRIP_IMMEDIATE':
        return {
          label: isFr ? 'ARRÊT IMMÉDIAT' : 'IMMEDIATE TRIP',
          bg: 'bg-rose-950/80 text-rose-300 border-rose-800/60'
        };
      case 'CRITICAL_24H':
        return {
          label: isFr ? 'INTERVENTION < 24H' : 'INTERVENE < 24H',
          bg: 'bg-amber-950/80 text-amber-300 border-amber-800/60'
        };
      case 'MONITORING_7D':
      default:
        return {
          label: isFr ? 'SURVEILLANCE' : 'MONITORING',
          bg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
        };
    }
  };

  return (
    <>
      <div className="rounded-xl border border-slate-800 bg-[#0B0F14] overflow-hidden shadow-lg font-sans">
        {/* Header */}
        <div className="px-4 py-3 bg-[#0E141D] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <Stethoscope className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>{isFr ? 'CADRE D\'ANALYSE : SYMPTÔME TERRAIN → DIAGNOSTIC & PARADE' : 'FIELD OBSERVATION TO DIAGNOSIS & REMEDY FRAMEWORK'}</span>
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                {isFr
                  ? 'Protocole causal en 6 étapes : observation, FMEA, essais CEI, relais ANSI et consignation LOTO'
                  : '6-stage causal diagnostic protocol: observation, FMEA, IEC tests, ANSI relays & LOTO'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullWorkbenchModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-slate-950 border border-rose-500/40 text-[10.5px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{isFr ? 'Atelier Causal Complet ➜' : 'Full Causal Workbench ➜'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <EvidenceTrustBadge level="FIELD_PRACTICE" locale={locale} size="sm" />
          </div>
        </div>

        {/* Diagnosis Accordion */}
        <div className="p-3 space-y-2.5">
          {matchingCases.map((c) => {
            const isExpanded = expandedId === c.id;
            const badge = getUrgencyBadge(c.urgency);

            return (
              <div
                key={c.id}
                className={`rounded-lg border transition-all ${
                  isExpanded
                    ? 'border-slate-700 bg-[#121924]'
                    : 'border-slate-800/80 bg-[#0E131A] hover:border-slate-700/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : c.id)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-left gap-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="p-1 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                      <Search className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-200 block truncate font-mono">
                        {isFr ? c.symptomTitle_fr : c.symptomTitle_en}
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans block truncate">
                        {isFr ? c.detectionTechnique_fr : c.detectionTechnique_en}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 space-y-3 border-t border-slate-800/60 text-xs">
                    
                    {/* Root Causes (FMEA) */}
                    <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isFr ? 'Causes Physiques Racines (FMEA) :' : 'Physical Root Causes (FMEA) :'}</span>
                      </span>
                      
                      <div className="space-y-1.5">
                        {c.probableRootCauses.map((rc, rcIdx) => (
                          <div key={rcIdx} className="text-[11px] font-sans flex items-start justify-between gap-2 border-b border-slate-900 pb-1">
                            <span className="text-slate-300">• {isFr ? rc.cause_fr : rc.cause_en}</span>
                            <span className="text-rose-400 font-mono text-[10px] font-bold shrink-0">{rc.probabilityPercent}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Standard Test Protocol & ANSI Protection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Tests */}
                      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase flex items-center gap-1">
                          <Gauge className="w-3 h-3" />
                          <span>{isFr ? 'Essais Contradictoires :' : 'Field Tests :'}</span>
                        </span>
                        {c.requiredFieldTests.slice(0, 2).map((t, tIdx) => (
                          <div key={tIdx} className="text-[10.5px] text-slate-300">
                            <strong className="text-slate-200 block">{isFr ? t.testName_fr : t.testName_en}</strong>
                            <span className="text-[9.5px] text-slate-500 font-mono">({t.governingStandard})</span>
                          </div>
                        ))}
                      </div>

                      {/* ANSI Relays */}
                      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-purple-400 uppercase flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          <span>{isFr ? 'Relais de Protection :' : 'Protection Relays :'}</span>
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {c.protectionFunctions.map((p, pIdx) => (
                            <span key={pIdx} className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono text-[9.5px] font-bold">
                              ANSI {p.ansiCode}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10.5px] text-slate-400 pt-0.5">
                          {isFr ? c.protectionFunctions[0]?.relayAction_fr : c.protectionFunctions[0]?.relayAction_en}
                        </p>
                      </div>
                    </div>

                    {/* Escalation & Full Workbench Link */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-[11px]">
                      <div className="flex items-center gap-1.5 text-amber-300 font-mono">
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                        <span>{c.lotoIsolationSteps.length} {isFr ? 'étapes de consignation LOTO' : 'LOTO isolation steps'}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCaseForModal(c.id);
                          setIsFullWorkbenchModalOpen(true);
                        }}
                        className="text-rose-400 hover:text-rose-300 font-mono font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isFr ? 'Explorer le diagnostic complet (6 étapes) ➜' : 'Inspect full 6-stage diagnosis ➜'}</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Causal Diagnosis Modal */}
      {isFullWorkbenchModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150 overflow-y-auto"
        >
          <div 
            className="w-full max-w-6xl max-h-[92vh] bg-[#080C11] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold font-mono text-white uppercase">
                  {isFr ? 'Atelier Causal d\'Ingénierie & Diagnostic Terrain EPEDE' : 'EPEDE Engineering Field Causal Diagnosis Workbench'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFullWorkbenchModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <FieldCausalDiagnosisWorkbench locale={locale} initialCaseId={selectedCaseForModal} embedded={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
