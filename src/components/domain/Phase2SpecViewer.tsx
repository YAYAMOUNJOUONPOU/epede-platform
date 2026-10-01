// src/components/domain/Phase2SpecViewer.tsx
// Interactive Phase 2 Engineering Specification Viewer (43 Canonical Points)

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Filter,
  Copy,
  Check,
  ShieldCheck,
  Layers,
  BookOpen,
  Download,
  Share2
} from 'lucide-react';
import { getOrGeneratePhase2Spec } from '../../data/canonicalSpecEngine';
import type { Phase2SubdomainSpec } from '../../data/phase2Specs';

interface Phase2SpecViewerProps {
  subdomainCode: string;
  locale: 'fr' | 'en';
}

type SectionCategory = 'all' | 'identity' | 'systems' | 'protection' | 'standards' | 'roles' | 'lifecycle' | 'verification';

export const Phase2SpecViewer: React.FC<Phase2SpecViewerProps> = ({ subdomainCode, locale }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SectionCategory>('all');
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    7: true,
    11: true,
    15: true,
    21: true,
    43: true
  });
  const [copiedSection, setCopiedSection] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Retrieve spec for this subdomain or generate canonical spec
  const spec: Phase2SubdomainSpec = useMemo(() => {
    return getOrGeneratePhase2Spec(subdomainCode, locale);
  }, [subdomainCode, locale]);

  const toggleSection = (num: number) => {
    setExpandedSections((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const expandAll = () => {
    const allExpanded: Record<number, boolean> = {};
    spec.sections.forEach((s) => {
      allExpanded[s.number] = true;
    });
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const copySectionContent = (num: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(num);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(spec, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `EPEDE_Phase2_${spec.subdomain_code}_Spec.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyMarkdown = () => {
    const isFr = locale === 'fr';
    let md = `# EPEDE Phase 2 Engineering Specification: ${spec.subdomain_code} - ${isFr ? spec.subdomain_name_fr : spec.subdomain_name_en}\n`;
    md += `**Domain:** ${spec.domain_code} - ${isFr ? spec.domain_name_fr : spec.domain_name_en}\n`;
    md += `**Version:** ${spec.version} | **Status:** ${spec.quality_status}\n\n`;
    spec.sections.forEach((sec) => {
      md += `## Section ${sec.number}: ${isFr ? sec.title_fr : sec.title}\n`;
      md += `${isFr ? sec.content_fr : sec.content_en}\n\n`;
    });
    navigator.clipboard.writeText(md);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Category matcher
  const isSectionInCat = (num: number, cat: SectionCategory): boolean => {
    if (cat === 'all') return true;
    if (cat === 'identity') return num >= 1 && num <= 7;
    if (cat === 'systems') return num >= 8 && num <= 13;
    if (cat === 'protection') return num >= 14 && num <= 20;
    if (cat === 'standards') return num >= 21 && num <= 25;
    if (cat === 'roles') return num >= 26 && num <= 30;
    if (cat === 'lifecycle') return num >= 31 && num <= 35;
    if (cat === 'verification') return num >= 36 && num <= 43;
    return true;
  };

  // Filtered sections
  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return spec.sections.filter((sec) => {
      const inCat = isSectionInCat(sec.number, selectedCategory);
      if (!inCat) return false;
      if (!q) return true;
      const titleMatch = sec.title.toLowerCase().includes(q) || sec.title_fr.toLowerCase().includes(q);
      const textMatch = sec.content_en.toLowerCase().includes(q) || sec.content_fr.toLowerCase().includes(q);
      return titleMatch || textMatch;
    });
  }, [spec, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-sky-100 text-sky-800 border border-sky-300">
                PHASE 2 MASTER SPECIFICATION
              </span>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                {spec.quality_status}
              </span>
              <span className="font-mono text-xs text-slate-500 font-semibold">
                v{spec.version}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-mono flex items-center gap-2 tracking-tight">
              <span className="text-sky-700 font-bold">{spec.subdomain_code}</span>
              <span className="text-slate-300">—</span>
              <span>{locale === 'fr' ? spec.subdomain_name_fr : spec.subdomain_name_en}</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? "Spécification d'ingénierie formelle articulée selon les 43 sections canoniques de la Phase 2 EPEDE (Conseil Supérieur d'Ingénierie & Architecture Numérique)."
                : "Formal engineering knowledge specification structured across all 43 canonical Phase 2 sections (EPEDE Supreme Engineering & Digital Architecture Council)."}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 font-mono text-xs">
            <div className="flex items-center gap-2 text-sky-800 font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
              <Layers className="h-4 w-4 text-sky-600" />
              <span>{spec.sections.length} / 43 {locale === 'fr' ? 'Sections Renseignées' : 'Sections Documented'}</span>
            </div>
            <span className="text-slate-400 text-[11px] font-semibold">
              {locale === 'fr' ? 'Architecture v1.1 Figée' : 'Architecture v1.1 Locked'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Toolbar: Search, Filters & Expand/Collapse */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'fr' ? 'Rechercher dans les 43 points (ex. ANSI, Joukowsky, FAT)...' : 'Search in 43 points (e.g., ANSI, Joukowsky, FAT)...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-mono shadow-xs"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleDownloadJson}
              title={locale === 'fr' ? 'Télécharger la spécification complète en format JSON' : 'Download complete specification as JSON'}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-sky-700 shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-sky-600" />
              <span>{locale === 'fr' ? 'Export JSON' : 'Export JSON'}</span>
            </button>
            <button
              type="button"
              onClick={handleCopyMarkdown}
              title={locale === 'fr' ? 'Copier le rapport technique complet en Markdown' : 'Copy complete technical report as Markdown'}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700 shadow-xs flex items-center gap-1.5 transition-colors"
            >
              {copiedAll ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Share2 className="h-3.5 w-3.5 text-slate-500" />
              )}
              <span>{copiedAll ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier Markdown' : 'Copy Markdown')}</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block mx-1" />
            <button
              type="button"
              onClick={expandAll}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-700 shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              <span>{locale === 'fr' ? 'Déployer tout' : 'Expand All'}</span>
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-700 shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <ChevronUp className="h-3.5 w-3.5 text-slate-500" />
              <span>{locale === 'fr' ? 'Réduire tout' : 'Collapse All'}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <Filter className="h-3.5 w-3.5 text-slate-400 mr-1 shrink-0" />
          {[
            { id: 'all', label_fr: 'Toutes (43)', label_en: 'All (43)' },
            { id: 'identity', label_fr: '1-7. Identité & Principes', label_en: '1-7. Identity & Principles' },
            { id: 'systems', label_fr: '8-13. Systèmes & Matériel', label_en: '8-13. Systems & Hardware' },
            { id: 'protection', label_fr: '14-20. Protections & Contrôle', label_en: '14-20. Protection & Control' },
            { id: 'standards', label_fr: '21-25. Normes & Calculs', label_en: '21-25. Standards & Calcs' },
            { id: 'roles', label_fr: '26-30. Rôles & Outils', label_en: '26-30. Roles & Tools' },
            { id: 'lifecycle', label_fr: '31-35. Maintenance & Essais', label_en: '31-35. Maintenance & Tests' },
            { id: 'verification', label_fr: '36-43. Relations & Qualité', label_en: '36-43. Graph & Quality' },
          ].map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as SectionCategory)}
                className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  isCatActive
                    ? 'bg-sky-100 text-sky-900 border border-sky-400 shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {locale === 'fr' ? cat.label_fr : cat.label_en}
              </button>
            );
          })}
        </div>
      </div>

      {/* 43 Sections Accordion List */}
      <div className="space-y-3">
        {filteredSections.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-2 shadow-xs">
            <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto" />
            <p className="text-sm text-slate-600 font-mono">
              {locale === 'fr' ? 'Aucune section ne correspond à votre filtre.' : 'No sections match your filter criteria.'}
            </p>
          </div>
        ) : (
          filteredSections.map((sec) => {
            const isExpanded = !!expandedSections[sec.number];
            const content = locale === 'fr' ? sec.content_fr : sec.content_en;
            const title = locale === 'fr' ? sec.title_fr : sec.title;

            return (
              <div
                key={sec.number}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-150 shadow-xs hover:border-slate-300"
              >
                {/* Section Header Button */}
                <div
                  onClick={() => toggleSection(sec.number)}
                  className="w-full px-5 py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded w-10 text-center">
                      #{sec.number}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 font-mono tracking-tight">
                      {title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title={locale === 'fr' ? 'Copier le contenu' : 'Copy content'}
                      onClick={(e) => {
                        e.stopPropagation();
                        copySectionContent(sec.number, content);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {copiedSection === sec.number ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Section Expanded Body */}
                {isExpanded && (
                  <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
                    <div className="font-mono text-xs sm:text-[13px] text-slate-800 leading-relaxed whitespace-pre-line bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                      {content}
                    </div>

                    {/* Quality stamp */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        {locale === 'fr' ? 'Conforme Spécification Phase 2' : 'Phase 2 Canonical Conformance'}
                      </span>
                      <span>Ref: EPEDE-{spec.subdomain_code}-SEC{sec.number}</span>
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
