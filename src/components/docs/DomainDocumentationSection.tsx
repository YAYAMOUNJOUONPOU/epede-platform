// src/components/docs/DomainDocumentationSection.tsx
// Section 3 & Section 4 Implementation: Master Technical Documentation and Specifications Tab

import React, { useState, useMemo } from 'react';
import type { DomainCode } from '../../types/epede';
import type { EpedeDocumentRecord, EpedeDocumentType } from '../../types/filesAndDocs';
import { getDocumentsForDomain } from '../../data/epedeDocumentationRegistry';
import { EpedeDocumentDetailModal } from './EpedeDocumentDetailModal';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Sliders, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  BookOpen, 
  FolderOpen,
  ArrowRight,
  Info
} from 'lucide-react';

interface DomainDocumentationSectionProps {
  domainCode: DomainCode;
  locale: 'fr' | 'en';
  onNavigateEquipment?: (equipmentId: string) => void;
  onNavigateStandard?: (ref: string) => void;
}

export const DomainDocumentationSection: React.FC<DomainDocumentationSectionProps> = ({
  domainCode,
  locale,
  onNavigateEquipment,
  onNavigateStandard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<EpedeDocumentRecord | null>(null);

  const domainDocs = useMemo(() => {
    return getDocumentsForDomain(domainCode);
  }, [domainCode]);

  const filteredDocs = useMemo(() => {
    return domainDocs.filter((doc) => {
      if (selectedType !== 'ALL' && doc.documentType !== selectedType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitleFr = doc.title_fr.toLowerCase().includes(q);
        const matchTitleEn = doc.title_en.toLowerCase().includes(q);
        const matchNum = doc.documentNumber.toLowerCase().includes(q);
        const matchSummaryFr = doc.summary_fr.toLowerCase().includes(q);
        const matchSummaryEn = doc.summary_en.toLowerCase().includes(q);
        const matchStd = doc.relatedStandards.some(s => s.toLowerCase().includes(q));

        if (!matchTitleFr && !matchTitleEn && !matchNum && !matchSummaryFr && !matchSummaryEn && !matchStd) {
          return false;
        }
      }
      return true;
    });
  }, [domainDocs, selectedType, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#090D15] border border-sky-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="font-mono text-[11px] font-black uppercase tracking-widest text-sky-400 flex items-center gap-1.5">
              <FolderOpen className="h-3.5 w-3.5" />
              <span>
                {locale === 'fr' 
                  ? 'FONDATION DOCUMENTAIRE & SPÉCIFICATIONS TECHNIQUES (SECTIONS 3 & 4)' 
                  : 'TECHNICAL DOCUMENTATION & SPECIFICATIONS REPOSITORY (SECTIONS 3 & 4)'}
              </span>
            </span>
            <h3 className="text-xl font-black text-white font-mono uppercase tracking-tight">
              {locale === 'fr' 
                ? `Dossiers Techniques & Fiches de Spécifications · Domaine ${domainCode}`
                : `Technical Dossiers & Structured Specifications · Domain ${domainCode}`}
            </h3>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 font-bold">
              {domainDocs.length} {locale === 'fr' ? 'Documents Validés' : 'Verified Documents'}
            </span>
          </div>
        </div>

        <p className="text-xs font-mono text-neutral-300 leading-relaxed max-w-4xl">
          {locale === 'fr'
            ? 'Ce référentiel contient les documents d\'ingénierie formels (Cahiers des Charges, Spécifications Matérielles, Notes de Calcul, Dossiers de Réglage). Chaque document possède un numéro unique, une traçabilité de révision, des grandeurs physiques structurées et ses normes CEI / IEEE associées.'
            : 'This repository contains formal engineering documentation (Technical Specifications, Datasheets, Calculation Notes, Settings Schedules). Each document features a standardized reference number, revision history, structured parameters, and governing IEC / IEEE standards.'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'fr' ? 'Rechercher par titre, numéro, norme CEI ou composant...' : 'Search by title, doc number, IEC standard or component...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090D15] border border-[#1E293B] text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-[#090D15] border border-[#1E293B] text-xs font-mono text-neutral-200 focus:outline-none focus:border-sky-500"
        >
          <option value="ALL">{locale === 'fr' ? 'Tous les Types de Documents' : 'All Document Types'}</option>
          <option value="TECHNICAL_SPECIFICATION">Spécification Technique</option>
          <option value="ENGINEERING_REFERENCE">Note / Cadre d'Ingénierie</option>
          <option value="TRANSFORMER_SPECIFICATION">Spécification Transformateur</option>
          <option value="CABLE_SPECIFICATION">Spécification Ligne / Câble</option>
          <option value="PROTECTION_SPECIFICATION">Spécification Protection</option>
          <option value="CONFIGURATION_DOCUMENT">Document de Configuration</option>
          <option value="ENGINEERING_CALCULATION_NOTE">Note de Calcul</option>
        </select>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="p-5 rounded-2xl bg-[#080C14] border border-[#1E293B] hover:border-sky-400/80 transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-lg"
            >
              <div className="space-y-3">
                
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {doc.documentNumber}
                    </span>
                    <span className="font-mono text-xs font-bold text-neutral-400">
                      {doc.revision}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {doc.status}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-mono text-sm font-black text-white group-hover:text-sky-300 transition-colors leading-snug">
                  {locale === 'fr' ? doc.title_fr : doc.title_en}
                </h4>

                {/* Scope Preview */}
                <p className="font-sans text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                  {locale === 'fr' ? doc.summary_fr : doc.summary_en}
                </p>

                {/* Standards tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {doc.relatedStandards.slice(0, 3).map((std, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#131B2A] border border-sky-500/20 text-sky-300 font-mono text-[10px] font-bold"
                    >
                      {std}
                    </span>
                  ))}
                  {doc.relatedStandards.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded bg-[#131B2A] text-neutral-400 font-mono text-[10px]">
                      +{doc.relatedStandards.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Details Footer */}
              <div className="pt-3 border-t border-[#162030] flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400 text-[11px] truncate max-w-[200px]">
                  {doc.documentOwner}
                </span>

                <div className="flex items-center gap-1.5 text-sky-400 font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>{locale === 'fr' ? 'Ouvrir le Document' : 'Open Dossier'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-[#080C14] border border-[#1E293B] text-center space-y-3 font-mono">
          <FileText className="h-10 w-10 text-neutral-600 mx-auto" />
          <h4 className="text-white font-bold text-sm">
            {locale === 'fr' ? 'Aucun document trouvé pour ce critère' : 'No documents found matching criteria'}
          </h4>
          <p className="text-xs text-neutral-400">
            {locale === 'fr' ? 'Modifiez le terme de recherche ou le filtre de type' : 'Try adjusting your search terms or filter selection'}
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedDoc && (
        <EpedeDocumentDetailModal
          document={selectedDoc}
          locale={locale}
          onClose={() => setSelectedDoc(null)}
          onNavigateEquipment={onNavigateEquipment}
        />
      )}

    </div>
  );
};
