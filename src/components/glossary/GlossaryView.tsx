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
    <div className="space-y-8 text-[#17282C]">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-[6px] bg-[#FFFDF9] border border-[#D8D2C5] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#0F6A6B] mb-2">
              <BookOpen className="h-4 w-4 text-[#0F6A6B]" />
              <span className="uppercase tracking-[0.14em] font-semibold">
                {locale === 'fr' ? 'RÉFÉRENTIEL TERMINOLOGIQUE BILINGUE (CEI 60050)' : 'BILINGUAL TERMINOLOGY REPOSITORY (IEC 60050)'}
              </span>
            </div>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl text-[#17282C] tracking-tight">
              {locale === 'fr' ? 'Glossaire Technique Électrotechnique' : 'Electrotechnical Engineering Glossary'}
            </h1>
            <p className="text-sm sm:text-base text-[#3E565B] mt-2 max-w-3xl leading-relaxed">
              {locale === 'fr'
                ? 'Définitions normalisées selon le Vocabulaire Électrotechnique International (CEI 60050 / IEV) et standards IEEE / NF C. Recherche instantanée par sigles, concepts ou normes associées.'
                : 'Standardized electrotechnical definitions conforming to the International Electrotechnical Vocabulary (IEC 60050 / IEV) and IEEE / NF C standards. Search by acronym, concept, or standard.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <span className="px-3 py-1.5 rounded-[4px] bg-[#F6F4EE] border border-[#D8D2C5] font-mono text-xs text-[#17282C] font-semibold">
              {filteredTerms.length} / {ELECTROTECHNICAL_GLOSSARY.length} {locale === 'fr' ? 'termes' : 'terms'}
            </span>
          </div>
        </div>

        {/* Search & Domain Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-6 pt-5 border-t border-[#E6E1D6]">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-[#687A7E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={locale === 'fr' ? 'Rechercher un terme du glossaire' : 'Search glossary term'}
              placeholder={
                locale === 'fr'
                  ? 'Rechercher un terme, sigle (GSU, IED, AVR, BESS...) ou norme (CEI 60909, NF C 15-105)...'
                  : 'Search term, acronym (GSU, IED, AVR, BESS...) or standard (IEC 60909, NF C 15-105)...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-[4px] bg-[#F6F4EE] border border-[#D8D2C5] font-mono text-xs text-[#17282C] placeholder-[#687A7E] focus:border-[#0F6A6B] focus:outline-hidden"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              aria-label={locale === 'fr' ? 'Filtrer par domaine' : 'Filter by domain'}
              className="w-full px-3 py-2.5 rounded-[4px] bg-[#F6F4EE] border border-[#D8D2C5] font-mono text-xs text-[#17282C] focus:border-[#0F6A6B]"
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
            className="p-5 rounded-[6px] bg-[#FFFDF9] border border-[#D8D2C5] hover:border-[#0F6A6B] transition-colors flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header: Acronym + Domain Chip */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {term.acronym && (
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#E5F2F0] text-[#0F6A6B] font-mono text-xs font-semibold border border-[#0F6A6B]/30">
                      {term.acronym}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onNavigateDomain && onNavigateDomain(term.domainCode)}
                    className="text-[11px] font-mono font-medium text-[#687A7E] hover:text-[#0F6A6B] transition-colors cursor-pointer"
                  >
                    {term.domainCode} · {locale === 'fr' ? term.domainNameFr : term.domainNameEn}
                  </button>
                </div>

                {term.keyFormulaOrUnit && (
                  <span className="text-[11px] font-mono text-[#17282C] bg-[#F6F4EE] px-2 py-0.5 rounded-[4px] border border-[#D8D2C5]">
                    {term.keyFormulaOrUnit}
                  </span>
                )}
              </div>

              {/* Title: FR / EN */}
              <h3 className="text-lg font-bold text-[#17282C] leading-snug">
                {locale === 'fr' ? term.termFr : term.termEn}
              </h3>
              <div className="text-xs text-[#687A7E] italic font-sans mt-0.5">
                {locale === 'fr' ? term.termEn : term.termFr}
              </div>

              {/* Definition */}
              <p className="text-sm text-[#3E565B] leading-relaxed font-sans mt-3">
                {locale === 'fr' ? term.definitionFr : term.definitionEn}
              </p>
            </div>

            {/* Bottom Standards & Actions */}
            <div className="pt-3 border-t border-[#E6E1D6] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-1.5">
                {term.governingStandards?.map((std) => (
                  <span
                    key={std}
                    className="px-2 py-0.5 rounded-[4px] bg-[#F6F4EE] text-[#3E565B] text-[10px] font-mono border border-[#D8D2C5]"
                  >
                    {locale === 'en' ? std.replace(/^CEI\b/, 'IEC') : std}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {term.relatedCalculatorTab && onNavigateCalculator && (
                  <button
                    type="button"
                    onClick={() => onNavigateCalculator(term.relatedCalculatorTab!)}
                    className="flex items-center gap-1 text-[11px] font-mono text-[#B8862D] hover:text-[#17282C] font-semibold transition-colors cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{locale === 'fr' ? 'Calculer' : 'Calculate'}</span>
                  </button>
                )}

                {term.relatedEquipmentId && onNavigateEquipment && (
                  <button
                    type="button"
                    onClick={() => onNavigateEquipment(term.relatedEquipmentId!)}
                    className="flex items-center gap-1 text-[11px] font-mono text-[#0F6A6B] hover:text-[#17282C] font-semibold transition-colors cursor-pointer"
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
        <div className="p-12 text-center rounded-[6px] bg-[#FFFDF9] border border-[#D8D2C5] space-y-2">
          <BookOpen className="w-8 h-8 text-[#0F6A6B] mx-auto" />
          <h4 className="text-[#17282C] font-mono text-sm font-semibold">
            {locale === 'fr' ? 'Aucun terme trouvé' : 'No glossary terms matched'}
          </h4>
          <p className="text-xs text-[#687A7E] font-mono">
            {locale === 'fr'
              ? 'Essayez avec un autre mot-clé ou réinitialisez le filtre par domaine.'
              : 'Try searching with another keyword or reset the domain filter.'}
          </p>
        </div>
      )}
    </div>
  );
};
