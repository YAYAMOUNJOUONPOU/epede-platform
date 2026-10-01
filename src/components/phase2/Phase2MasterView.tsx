// src/components/phase2/Phase2MasterView.tsx
// EPEDE Phase 2 - Content Specification & Engineering Knowledge Development Master View
// Supreme Engineering Council Reference Platform

import React, { useState } from 'react';
import {
  FileText,
  Layers,
  ShieldCheck,
  BookOpen,
  Table,
  Award
} from 'lucide-react';
import { SubdomainSpecsView } from './modules/SubdomainSpecsView';
import { GlobalMatricesView } from './modules/GlobalMatricesView';
import { GovernanceProtocolView } from './modules/GovernanceProtocolView';

interface Phase2MasterViewProps {
  locale: 'fr' | 'en';
  onNavigateDomain?: (domainCode: any) => void;
  onNavigateStandard?: (stdRef: string) => void;
  onNavigateRole?: (roleSlug: string) => void;
}

export type MainTab = 'subdomain_specs' | 'matrices' | 'governance';

export const Phase2MasterView: React.FC<Phase2MasterViewProps> = ({
  locale,
  onNavigateDomain,
  onNavigateStandard,
  onNavigateRole
}) => {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('subdomain_specs');
  const [selectedDomainCode, setSelectedDomainCode] = useState<string>('D01');
  const [selectedSubdomainCode, setSelectedSubdomainCode] = useState<string>('D01.01');

  const handleSelectSubdomainDirect = (domainCode: string, subdomainCode: string) => {
    setSelectedDomainCode(domainCode);
    setSelectedSubdomainCode(subdomainCode);
    setActiveMainTab('subdomain_specs');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-blue-50/60 border border-sky-200/90 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-sky-100 text-sky-800 border border-sky-300">
                PHASE 2 — SPECIFICATION DU CONTENU & CONNAISSANCES D'INGÉNIERIE
              </span>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                ARCHITECTURE v1.1 FIGÉE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono flex items-center gap-3">
              <BookOpen className="h-7 w-7 text-sky-600" />
              <span>
                {locale === 'fr'
                  ? 'Portail Canonique Phase 2 (43 Points & 6 Matrices)'
                  : 'Canonical Phase 2 Knowledge Hub (43 Points & 6 Matrices)'}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
              {locale === 'fr'
                ? "Déploiement rigoureux des 43 sections canoniques d'ingénierie selon le protocole de la Phase 2 EPEDE (Conseil Supérieur d'Ingénierie & Architecture Numérique). Couverture exhaustive des 16 Domaines D01–D16 et des Matrices Globales de Complétude, Relations, Normes, Rôles, Cycle de Vie et Défaillances."
                : 'Rigorous deployment of all 43 canonical engineering specification sections according to EPEDE Phase 2 Protocol. Exhaustive coverage of 16 Domains D01–D16 and Global Matrices for Completeness, Relationships, Standards, Engineering Roles, Lifecycle, and FMECA Maintenance.'}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 font-mono text-xs shrink-0">
            <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-right space-y-1 shadow-xs">
              <div className="text-sky-700 font-bold flex items-center justify-end gap-2">
                <Layers className="h-4 w-4" />
                <span>16 Domaines | 43 Points / Objet</span>
              </div>
              <div className="text-slate-500 text-[11px]">
                {locale === 'fr' ? 'Conforme Normes CEI, IEEE & ARSEL' : 'Compliant with IEC, IEEE & ARSEL'}
              </div>
            </div>
          </div>
        </div>

        {/* Top Level View Selector */}
        <div className="mt-8 flex items-center gap-2 border-b border-slate-200 pt-2">
          {[
            {
              id: 'subdomain_specs',
              label_fr: '📋 Spécifications par Sous-Domaine (43 Points)',
              label_en: '📋 Subdomain Specifications (43 Points)',
              icon: FileText
            },
            {
              id: 'matrices',
              label_fr: '📊 Matrices Globales d\'Ingénierie (A à F)',
              label_en: '📊 Global Engineering Matrices (A to F)',
              icon: Table
            },
            {
              id: 'governance',
              label_fr: '⚖️ Protocole de Validation & Qualité',
              label_en: '⚖️ Governance & Quality Protocol',
              icon: Award
            }
          ].map((tab) => {
            const isTabActive = activeMainTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMainTab(tab.id as MainTab)}
                className={`flex items-center gap-2 px-4 py-3 font-mono text-xs font-bold transition-all border-b-2 -mb-[2px] ${
                  isTabActive
                    ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{locale === 'fr' ? tab.label_fr : tab.label_en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: SUBDOMAIN SPECIFICATIONS (43 POINTS)                              */}
      {/* ========================================================================= */}
      {activeMainTab === 'subdomain_specs' && (
        <SubdomainSpecsView
          locale={locale}
          selectedDomainCode={selectedDomainCode}
          selectedSubdomainCode={selectedSubdomainCode}
          onSelectDomainCode={setSelectedDomainCode}
          onSelectSubdomainCode={setSelectedSubdomainCode}
        />
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: GLOBAL ENGINEERING MATRICES (A TO F)                             */}
      {/* ========================================================================= */}
      {activeMainTab === 'matrices' && (
        <GlobalMatricesView
          locale={locale}
          onNavigateStandard={onNavigateStandard}
          onNavigateRole={onNavigateRole}
          onSelectSubdomainDirect={handleSelectSubdomainDirect}
        />
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: GOVERNANCE & QUALITY PROTOCOL                                     */}
      {/* ========================================================================= */}
      {activeMainTab === 'governance' && (
        <GovernanceProtocolView locale={locale} />
      )}
    </div>
  );
};
