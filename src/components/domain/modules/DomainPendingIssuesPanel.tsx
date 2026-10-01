// src/components/domain/modules/DomainPendingIssuesPanel.tsx
// EPEDE — Domain Pending Issues & Deficiency Tracker
// NCR list, maintenance due dates, and deficiency severity badges per domain

import React, { useState } from 'react';
import { AlertTriangle, Wrench, CheckCircle2, Clock, ChevronDown, ChevronUp, Plus, X, ShieldAlert } from 'lucide-react';
import type { DomainCode } from '../../../types/epede';

// ─── Types ───────────────────────────────────────────────────────────────────

type Severity = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'OBSERVATION';
type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

interface PendingIssue {
  id: string;
  ncr: string;              // NCR number
  title: { fr: string; en: string };
  severity: Severity;
  status: IssueStatus;
  dueDateLabel: string;
  standard?: string;
  equipment?: string;
}

// ─── Domain Issue Data ────────────────────────────────────────────────────────

const DOMAIN_ISSUES: Partial<Record<DomainCode, PendingIssue[]>> = {
  D01: [
    { id: 'i01', ncr: 'NCR-D01-001', title: { fr: 'Révision alternateur G3 (10 000 h)', en: 'Generator G3 Major Overhaul (10,000 hr)' }, severity: 'MAJOR', status: 'IN_PROGRESS', dueDateLabel: 'Q1 2027', standard: 'CEI 60034', equipment: 'Alternateur Songloulou G3' },
    { id: 'i02', ncr: 'NCR-D01-002', title: { fr: 'Test résistance d\'isolement bobinages statoriques', en: 'Stator Winding Insulation Resistance Test' }, severity: 'MINOR', status: 'OPEN', dueDateLabel: 'Mars 2027', standard: 'IEEE 43', equipment: 'Alternateur Edéa G1' },
    { id: 'i03', ncr: 'NCR-D01-003', title: { fr: 'Inspection turbine Pelton (cavitation détectée)', en: 'Pelton Turbine Inspection (Cavitation Detected)' }, severity: 'CRITICAL', status: 'OPEN', dueDateLabel: 'URGENT', standard: 'CEI 60193', equipment: 'Turbine Pelton Lagdo' },
  ],
  D04: [
    { id: 'i04', ncr: 'NCR-D04-001', title: { fr: 'Réglage relais distance 21 hors tolérance', en: 'Distance Relay 21 Setting Drift Detected' }, severity: 'CRITICAL', status: 'OPEN', dueDateLabel: 'URGENT', standard: 'CEI 60255', equipment: 'IED Distance Bekoko' },
    { id: 'i05', ncr: 'NCR-D04-002', title: { fr: 'Essai huile diélectrique transformateur T1', en: 'Transformer T1 Dielectric Oil Test Overdue' }, severity: 'MAJOR', status: 'IN_PROGRESS', dueDateLabel: 'Févr 2027', standard: 'CEI 60296', equipment: 'Transfo 225/30 kV 63 MVA' },
    { id: 'i06', ncr: 'NCR-D04-003', title: { fr: 'Test SF6 densité disjoncteur Q0', en: 'Circuit Breaker Q0 SF6 Density Test' }, severity: 'MINOR', status: 'OPEN', dueDateLabel: 'Avr 2027', standard: 'CEI 62271', equipment: 'Disjoncteur GIS 225 kV' },
    { id: 'i07', ncr: 'NCR-D04-004', title: { fr: 'Vérification prise de terre (Rg > 1 Ω)', en: 'Earth Grid Resistance Check (Rg > 1 Ω)' }, severity: 'MAJOR', status: 'OPEN', dueDateLabel: 'Mars 2027', standard: 'IEEE 80', equipment: 'Grille de Terre Oyomabang' },
  ],
  D06: [
    { id: 'i08', ncr: 'NCR-D06-001', title: { fr: 'Migration SCADA v6.1 → v7.0 (fin de support)', en: 'SCADA v6.1 → v7.0 Migration (End-of-Life)' }, severity: 'MAJOR', status: 'IN_PROGRESS', dueDateLabel: 'Juin 2027', standard: 'CEI 61968', equipment: 'SCADA Sonatrel CNC' },
    { id: 'i09', ncr: 'NCR-D06-002', title: { fr: 'Audit cybersécurité CEI 62443 poste Bekoko', en: 'IEC 62443 Cybersecurity Audit Bekoko' }, severity: 'CRITICAL', status: 'OPEN', dueDateLabel: 'URGENT', standard: 'CEI 62443', equipment: 'Switch Station Bus' },
    { id: 'i10', ncr: 'NCR-D06-003', title: { fr: 'Remplacement batterie d\'alimentation IED', en: 'IED Battery Replacement (< 80% capacity)' }, severity: 'MINOR', status: 'OPEN', dueDateLabel: 'Mai 2027', standard: 'CEI 61850', equipment: 'IED Protections Oyomabang' },
  ],
  D09: [
    { id: 'i11', ncr: 'NCR-D09-001', title: { fr: 'Test capacité BESS (SOH < 85%)', en: 'BESS Capacity Test (SOH < 85%)' }, severity: 'MAJOR', status: 'OPEN', dueDateLabel: 'Févr 2027', standard: 'CEI 62933', equipment: 'Conteneur BESS 5 MW' },
    { id: 'i12', ncr: 'NCR-D09-002', title: { fr: 'Nettoyage panneaux solaires (perte 12% rendement)', en: 'Solar Panel Cleaning (12% Yield Loss Detected)' }, severity: 'MINOR', status: 'OPEN', dueDateLabel: 'Jan 2027', standard: 'CEI 62548', equipment: 'Parc PV 10 MWc' },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<Severity, { color: string; bg: string; border: string; icon: React.FC<{ className?: string; style?: React.CSSProperties }> }> = {
  CRITICAL:    { color: '#ef4444', bg: '#2a0f0f', border: '#7f1d1d', icon: ShieldAlert },
  MAJOR:       { color: '#f97316', bg: '#1f1007', border: '#7c2d12', icon: AlertTriangle },
  MINOR:       { color: '#eab308', bg: '#1a1605', border: '#713f12', icon: Wrench },
  OBSERVATION: { color: '#60a5fa', bg: '#0a1525', border: '#1e3a5f', icon: Clock },
};

const STATUS_CONFIG: Record<IssueStatus, { color: string; label: { fr: string; en: string } }> = {
  OPEN:        { color: '#ef4444', label: { fr: 'OUVERT', en: 'OPEN' } },
  IN_PROGRESS: { color: '#f97316', label: { fr: 'EN COURS', en: 'IN PROGRESS' } },
  CLOSED:      { color: '#22c55e', label: { fr: 'FERMÉ', en: 'CLOSED' } },
};

// ─── Component ───────────────────────────────────────────────────────────────

interface DomainPendingIssuesPanelProps {
  locale: 'fr' | 'en';
  domainCode: DomainCode;
}

export const DomainPendingIssuesPanel: React.FC<DomainPendingIssuesPanelProps> = ({
  locale,
  domainCode,
}) => {
  const isFr = locale === 'fr';
  const issues = DOMAIN_ISSUES[domainCode] || [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'ALL'>('ALL');

  if (issues.length === 0) return null;

  const filtered = filterSeverity === 'ALL' ? issues : issues.filter(i => i.severity === filterSeverity);

  const critCount = issues.filter(i => i.severity === 'CRITICAL').length;
  const openCount = issues.filter(i => i.status === 'OPEN').length;
  const inProgressCount = issues.filter(i => i.status === 'IN_PROGRESS').length;

  return (
    <div className="rounded-2xl border border-[#2a1a1a] bg-[#0A0D10] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a1a1a] bg-gradient-to-r from-[#140808] to-[#0A0D10]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-950/60 border border-red-900/40 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              {isFr ? 'Registre NCR & Déficiences' : 'NCR & Deficiency Register'}
            </h3>
            <p className="text-[10px] font-mono text-neutral-500">
              {isFr ? `${issues.length} fiches · ${openCount} ouvertes · ${inProgressCount} en cours` : `${issues.length} items · ${openCount} open · ${inProgressCount} in progress`}
            </p>
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex items-center gap-2">
          {critCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse">
              <ShieldAlert className="h-3 w-3" />
              {critCount} {isFr ? 'CRITIQUE(S)' : 'CRITICAL'}
            </span>
          )}
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
            {openCount} {isFr ? 'ouvertes' : 'open'}
          </span>
        </div>
      </div>

      {/* Severity filter */}
      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-[#1a1a2a] flex-wrap">
        {(['ALL', 'CRITICAL', 'MAJOR', 'MINOR', 'OBSERVATION'] as const).map(sev => {
          const isActive = filterSeverity === sev;
          const cfg = sev !== 'ALL' ? SEVERITY_CONFIG[sev] : null;
          return (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider border transition-all ${
                isActive
                  ? 'border-opacity-100'
                  : 'border-[#1a2235] text-neutral-500 hover:text-white'
              }`}
              style={isActive && cfg ? {
                borderColor: cfg.color,
                background: cfg.bg,
                color: cfg.color,
              } : isActive ? { borderColor: '#38bdf8', background: '#0a1525', color: '#38bdf8' } : undefined}
            >
              {sev === 'ALL' ? (isFr ? 'TOUS' : 'ALL') : sev}
            </button>
          );
        })}
      </div>

      {/* Issues list */}
      <div className="divide-y divide-[#1a1a2a]">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-[11px] font-mono text-neutral-600">
            {isFr ? 'Aucune déficience dans cette catégorie.' : 'No deficiencies in this category.'}
          </div>
        ) : (
          filtered.map(issue => {
            const sevCfg = SEVERITY_CONFIG[issue.severity];
            const statusCfg = STATUS_CONFIG[issue.status];
            const SevIcon = sevCfg.icon;
            const isOpen = expanded === issue.id;

            return (
              <div key={issue.id} className="transition-all">
                <button
                  className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] text-left transition-all"
                  onClick={() => setExpanded(isOpen ? null : issue.id)}
                >
                  {/* Severity icon */}
                  <div className="p-1.5 rounded-lg border shrink-0 mt-0.5" style={{ background: sevCfg.bg, borderColor: sevCfg.border }}>
                    <SevIcon className="h-3.5 w-3.5" style={{ color: sevCfg.color } as React.CSSProperties} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-neutral-500">{issue.ncr}</span>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded" style={{ color: sevCfg.color, background: sevCfg.bg }}>
                        {issue.severity}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border" style={{ color: statusCfg.color, borderColor: statusCfg.color + '40' }}>
                        {statusCfg.label[locale]}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-mono font-bold text-white">{issue.title[locale]}</p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {issue.dueDateLabel === 'URGENT'
                          ? <span className="text-red-400 font-bold animate-pulse">⚠ URGENT</span>
                          : issue.dueDateLabel}
                      </span>
                      {issue.standard && (
                        <span className="text-[9px] font-mono text-cyan-500/70">{issue.standard}</span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isOpen ? <ChevronUp className="h-3.5 w-3.5 text-neutral-500" /> : <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />}
                  </div>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="px-5 pb-4 border-t border-[#1a1a2a] bg-[#060810]">
                    <div className="pt-3 space-y-2">
                      {issue.equipment && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-neutral-500">{isFr ? 'Équipement:' : 'Equipment:'}</span>
                          <span className="text-[10px] font-mono font-bold text-white">{issue.equipment}</span>
                        </div>
                      )}
                      {issue.standard && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-neutral-500">{isFr ? 'Norme applicable:' : 'Applicable standard:'}</span>
                          <span className="text-[10px] font-mono font-bold text-cyan-400">{issue.standard}</span>
                        </div>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold bg-[#0D1520] border border-[#1a2235] text-neutral-400 hover:border-amber-400/50 hover:text-amber-300 transition-all">
                          <CheckCircle2 className="h-3 w-3" />
                          {isFr ? 'Marquer En Cours' : 'Mark In Progress'}
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all">
                          <CheckCircle2 className="h-3 w-3" />
                          {isFr ? 'Fermer la NCR' : 'Close NCR'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
