// src/components/docs/EpedeDocumentDetailModal.tsx
// High-Fidelity Engineering Document Viewer adhering strictly to Sections 3 and 4 of EPEDE Master Content Directive

import React, { useState } from 'react';
import type { EpedeDocumentRecord, StructuredSpecificationGroup } from '../../types/filesAndDocs';
import { 
  FileText, 
  X, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Globe, 
  ExternalLink, 
  Layers, 
  BookOpen, 
  Wrench, 
  Info,
  Sliders,
  FolderOpen
} from 'lucide-react';

interface EpedeDocumentDetailModalProps {
  document: EpedeDocumentRecord;
  locale: 'fr' | 'en';
  onClose: () => void;
  onNavigateEquipment?: (equipmentId: string) => void;
}

export const EpedeDocumentDetailModal: React.FC<EpedeDocumentDetailModalProps> = ({
  document,
  locale,
  onClose,
  onNavigateEquipment
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'structured_specs' | 'toc'>('overview');

  const handleCopySummary = () => {
    const text = `[EPEDE MASTER TECHNICAL DOCUMENT]
Document No: ${document.documentNumber} (${document.revision})
Title: ${locale === 'fr' ? document.title_fr : document.title_en}
Type: ${document.documentType} | Domain: ${document.domainCode}
Status: ${document.status} | Source: ${document.source}
Standards: ${document.relatedStandards.join(', ')}
Summary: ${locale === 'fr' ? document.summary_fr : document.summary_en}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-5xl max-h-[92vh] rounded-2xl border border-sky-500/40 bg-[#090D14] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="border-b border-[#1E293B] bg-[#0E1522] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  {document.documentNumber}
                </span>
                <span className="font-mono text-xs font-bold text-neutral-400">
                  {document.revision} · v{document.version}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {document.status}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white font-mono mt-1 leading-snug">
                {locale === 'fr' ? document.title_fr : document.title_en}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="p-2 rounded-lg bg-[#151F2E] border border-neutral-700/60 text-neutral-300 hover:text-white transition-colors"
              title={locale === 'fr' ? 'Copier la référence' : 'Copy reference'}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-[#151F2E] border border-neutral-700/60 text-neutral-300 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Conceptual disclaimer banner (Section 3 rule) */}
        {document.isConceptual && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center gap-2 text-xs font-mono text-amber-300">
            <Info className="h-4 w-4 shrink-0 text-amber-400" />
            <span>
              {locale === 'fr' 
                ? 'Structure documentaire représentative — document non issu d\'un projet exécuté spécifique.'
                : 'Representative documentation structure — not a real project document.'}
            </span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1E293B] bg-[#0A101A] px-6 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            {locale === 'fr' ? 'Fiche Métadonnées & Résumé' : 'Metadata & Scope'}
          </button>
          {document.structuredSpecifications && document.structuredSpecifications.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('structured_specs')}
              className={`py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'structured_specs'
                  ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>{locale === 'fr' ? 'Spécifications Structurées' : 'Structured Specs'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-300">
                {document.structuredSpecifications.reduce((acc, g) => acc + g.parameters.length, 0)}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveTab('toc')}
            className={`py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'toc'
                ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            {locale === 'fr' ? 'Table des Matières Normalisée' : 'Standard Table of Contents'}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Metadata 4-Box Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#1E293B]">
                  <span className="text-neutral-500 block mb-1">
                    {locale === 'fr' ? 'Type de Document' : 'Document Type'}
                  </span>
                  <span className="text-sky-300 font-bold">{document.documentType}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#1E293B]">
                  <span className="text-neutral-500 block mb-1">
                    {locale === 'fr' ? 'Domaine & Sous-Système' : 'Domain & Subsystem'}
                  </span>
                  <span className="text-amber-400 font-bold">{document.domainCode} · {document.subdomainCode}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#1E293B]">
                  <span className="text-neutral-500 block mb-1">
                    {locale === 'fr' ? 'Statut de Vérification' : 'Verification Status'}
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{document.verificationStatus}</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0F172A] border border-[#1E293B]">
                  <span className="text-neutral-500 block mb-1">
                    {locale === 'fr' ? 'Date d\'Approbation' : 'Approval Date'}
                  </span>
                  <span className="text-neutral-200 font-bold">{document.date}</span>
                </div>
              </div>

              {/* Summary / Scope Note */}
              <div className="p-5 rounded-xl bg-[#0E1522] border border-[#1E293B] space-y-2">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{locale === 'fr' ? 'Objet & Résumé Exécutif' : 'Scope & Executive Summary'}</span>
                </h4>
                <p className="text-sm font-sans text-neutral-300 leading-relaxed font-normal">
                  {locale === 'fr' ? document.summary_fr : document.summary_en}
                </p>
              </div>

              {/* Source & Project Context */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-[#0B111D] border border-[#1E293B] space-y-1.5">
                  <span className="text-neutral-500 font-bold uppercase">
                    {locale === 'fr' ? 'Source Technique & Émetteur' : 'Technical Source & Originator'}
                  </span>
                  <p className="text-neutral-200 font-medium">{document.source}</p>
                  <p className="text-[11px] text-neutral-400">{document.documentOwner}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0B111D] border border-[#1E293B] space-y-1.5">
                  <span className="text-neutral-500 font-bold uppercase">
                    {locale === 'fr' ? 'Contexte Projet & Réseau' : 'Project & Network Context'}
                  </span>
                  <p className="text-neutral-200 font-medium">
                    {locale === 'fr' ? document.relatedProjectContext.fr : document.relatedProjectContext.en}
                  </p>
                </div>
              </div>

              {/* Governing Standards */}
              <div className="p-4 rounded-xl bg-[#0B111D] border border-[#1E293B] space-y-2">
                <span className="font-mono text-xs font-bold uppercase text-neutral-400 block">
                  {locale === 'fr' ? 'Normes & Standards Internationaux Régissant ce Document :' : 'Governing International Standards:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {document.relatedStandards.map((std, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-[#162032] border border-sky-500/20 text-sky-300 font-mono text-xs font-bold"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related Equipment & Components */}
              <div className="p-4 rounded-xl bg-[#0B111D] border border-[#1E293B] space-y-3">
                <span className="font-mono text-xs font-bold uppercase text-neutral-400 block">
                  {locale === 'fr' ? 'Composants & Appareils Associés :' : 'Associated Components & Apparatus:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {(locale === 'fr' ? document.relatedComponentNames_fr : document.relatedComponentNames_en).map((comp, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-[#131B2A] border border-neutral-700/60 text-neutral-200 text-xs font-mono"
                    >
                      {comp}
                    </span>
                  ))}
                </div>

                {document.primaryEquipmentId && onNavigateEquipment && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onNavigateEquipment(document.primaryEquipmentId!)}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:text-sky-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>{locale === 'fr' ? 'Ouvrir la Fiche Appareil Correspondante' : 'Open Corresponding Equipment Dossier'}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: STRUCTURED SPECIFICATIONS (Section 4 Compliance) */}
          {activeTab === 'structured_specs' && document.structuredSpecifications && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-800/30 text-xs font-mono text-sky-300">
                {locale === 'fr'
                  ? 'Spécifications techniques structurées par catégories fondamentales. Toutes les grandeurs sont normalisées avec unité et statut de vérification.'
                  : 'Structured engineering specifications organized by core physical category. All parameters include standardized engineering units and status tags.'}
              </div>

              {document.structuredSpecifications.map((group: StructuredSpecificationGroup, gIdx: number) => (
                <div key={gIdx} className="rounded-xl border border-[#1E293B] bg-[#0E1522] overflow-hidden">
                  <div className="bg-[#141C2E] px-4 py-2.5 border-b border-[#1E293B] flex items-center justify-between">
                    <span className="font-mono text-xs font-black uppercase text-amber-400 tracking-wider">
                      {locale === 'fr' ? group.title_fr : group.title_en}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400 font-bold">
                      {group.category}
                    </span>
                  </div>

                  <div className="divide-y divide-[#1A2333]">
                    {group.parameters.map((param, pIdx) => (
                      <div key={pIdx} className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono hover:bg-[#121A2B] transition-colors">
                        <div className="space-y-0.5">
                          <span className="text-neutral-300 font-medium">
                            {locale === 'fr' ? param.label_fr : param.label_en}
                          </span>
                          <span className="text-[10px] text-neutral-500 block font-mono">
                            {param.key} {param.standardClause ? `(${param.standardClause})` : ''}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <span className="font-bold text-sky-300 text-sm">
                            {param.value} {param.unit || ''}
                          </span>
                          {param.status && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                              param.status === 'VERIFIED'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {param.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: TABLE OF CONTENTS */}
          {activeTab === 'toc' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0E1522] border border-[#1E293B]">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
                  {locale === 'fr' ? 'Sommaire Normalisé du Document' : 'Standard Document Table of Contents'}
                </h4>
                <div className="space-y-2">
                  {(locale === 'fr' ? document.tableOfContents_fr : document.tableOfContents_en).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#0A101A] border border-[#1A2333] text-xs font-mono text-neutral-300 flex items-center gap-3 hover:border-sky-500/40 transition-colors"
                    >
                      <span className="text-sky-400 font-bold">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#1E293B] bg-[#0E1522] px-6 py-3 flex items-center justify-between text-xs font-mono text-neutral-400 shrink-0">
          <span>EPEDE Engineering Documentation System · Master Specification Format</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1E293B] text-white hover:bg-neutral-700 transition-colors font-bold"
          >
            {locale === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
