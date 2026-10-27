// src/components/glossary/GlossaryView.tsx
// EPEDE - Bilingual Electrotechnical Engineering Glossary
// Searchable, filterable by domain, with standards and direct navigation links

import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Filter, ExternalLink, Calculator, Layers, FileText, ArrowRight } from 'lucide-react';
import { ELECTROTECHNICAL_GLOSSARY, GlossaryTerm } from '../../data/electrotechnicalGlossaryData';

interface GlossaryViewProps {
  locale: 'fr' | 'en';
  onNavigateEquipment?: (equipmentId: string) => void;
  onNavigateCalculator?: (tab: string) => void;
  onNavigateDomain?: (domainCode: string) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  locale,
  onNavigateEquipment,
  onNavigateCalculator,
  onNavigateDomain,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  // Extract unique domains for filtering
  const availableDomains = useMemo(() => {
    const map = new Map<string, { code: string; nameFr: string; nameEn: string }>();
    ELECTROTECHNICAL_GLOSSARY.forEach((item) => {
      if (!map.has(item.domainCode)) {
        map.set(item.domainCode, {
          code: item.domainCode,
          nameFr: item.domainNameFr,
          nameEn: item.domainNameEn,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
  }, []);

  // Filter terms
  const filteredTerms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ELECTROTECHNICAL_GLOSSARY.filter((item) => {
      if (selectedDomain !== 'ALL' && item.domainCode !== selectedDomain) {
        return false;
      }
      if (!q) return true;
      return (
        item.termFr.toLowerCase().includes(q) ||
        item.termEn.toLowerCase().includes(q) ||
        (item.acronym && item.acronym.toLowerCase().includes(q)) ||
        item.definitionFr.toLowerCase().includes(q) ||
        item.definitionEn.toLowerCase().includes(q) ||
        (item.governingStandards && item.governingStandards.some((s) => s.toLowerCase().includes(q)))
      );
    });
  }, [searchQuery, selectedDomain]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400 mb-1.5">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span className="uppercase tracking-widest font-bold">
                {locale === 'fr' ? 'RÉFÉRENTIEL TERMINOLOGIQUE BILINGUE' : 'BILINGUAL TERMINOLOGY REPOSITORY'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {locale === 'fr' ? 'Glossaire Technique Électrotechnique' : 'Electrotechnical Engineering Glossary'}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Définitions normalisées selon le Vocabulaire Électrotechnique International (CEI 60050 / IEV) et standards IEEE / NF C. Recherche instantanée par sigles, concepts ou normes associées.'
                : 'Standardized electrotechnical definitions conforming to the International Electrotechnical Vocabulary (IEC 60050 / IEV) and IEEE / NF C standards. Search by acronym, concept, or standard.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-emerald-400 font-bold">
              {filteredTerms.length} / {ELECTROTECHNICAL_GLOSSARY.length} {locale === 'fr' ? 'termes' : 'terms'}
            </span>
          </div>
        </div>

        {/* Search & Domain Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                locale === 'fr'
                  ? 'Rechercher un terme, sigle (GSU, IED, AVR, BESS...) ou norme (CEI 60909, NF C 15-105)...'
                  : 'Search term, acronym (GSU, IED, AVR, BESS...) or standard (IEC 60909, NF C 15-105)...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-hidden"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-slate-200 focus:border-amber-400"
            >
              <option value="ALL">{locale === 'fr' ? 'Tous les 16 domaines' : 'All 16 domains'}</option>
              {availableDomains.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.code} - {locale === 'fr' ? d.nameFr : d.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((term) => (
          <div
            key={term.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header: Acronym + Domain Chip */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {term.acronym && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-500/30">
                      {term.acronym}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onNavigateDomain && onNavigateDomain(term.domainCode)}
                    className="text-[10px] font-mono font-bold text-slate-400 hover:text-sky-300 transition-colors cursor-pointer"
                  >
                    {term.domainCode} · {locale === 'fr' ? term.domainNameFr : term.domainNameEn}
                  </button>
                </div>

                {term.keyFormulaOrUnit && (
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                    {term.keyFormulaOrUnit}
                  </span>
                )}
              </div>

              {/* Title: FR / EN */}
              <h3 className="text-base font-black text-white font-mono leading-snug">
                {locale === 'fr' ? term.termFr : term.termEn}
              </h3>
              <div className="text-xs text-slate-400 italic font-sans mt-0.5">
                {locale === 'fr' ? term.termEn : term.termFr}
              </div>

              {/* Definition */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans mt-3">
                {locale === 'fr' ? term.definitionFr : term.definitionEn}
              </p>
            </div>

            {/* Bottom Standards & Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-1.5">
                {term.governingStandards?.map((std) => (
                  <span
                    key={std}
                    className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 text-[10px] font-mono border border-slate-800"
                  >
                    {std}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {term.relatedCalculatorTab && onNavigateCalculator && (
                  <button
                    type="button"
                    onClick={() => onNavigateCalculator(term.relatedCalculatorTab!)}
                    className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? 'Calculer' : 'Calculate'}</span>
                  </button>
                )}

                {term.relatedEquipmentId && onNavigateEquipment && (
                  <button
                    type="button"
                    onClick={() => onNavigateEquipment(term.relatedEquipmentId!)}
                    className="flex items-center gap-1 text-[11px] font-mono text-sky-400 hover:text-sky-300 font-bold transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? 'Fiche Matériel' : 'Equipment Sheet'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
          <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
          <h4 className="text-white font-mono text-sm font-bold">
            {locale === 'fr' ? 'Aucun terme trouvé' : 'No glossary terms matched'}
          </h4>
          <p className="text-xs text-slate-400 font-mono">
            {locale === 'fr'
              ? 'Essayez avec un autre mot-clé ou réinitialisez le filtre par domaine.'
              : 'Try searching with another keyword or reset the domain filter.'}
          </p>
        </div>
      )}
    </div>
  );
};
