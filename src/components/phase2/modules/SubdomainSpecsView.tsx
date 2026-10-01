// src/components/phase2/modules/SubdomainSpecsView.tsx
import React, { useMemo, useState } from 'react';
import { Layers, Cpu, Search, Sparkles, CheckCircle2, Shield, Wrench, X } from 'lucide-react';
import { DOMAINS, ALL_SUBDOMAINS } from '../../../data/epedeData';
import { PHASE2_SPECS } from '../../../data/phase2Specs';
import { Phase2SpecViewer } from '../../domain/Phase2SpecViewer';

interface SubdomainSpecsViewProps {
  locale: 'fr' | 'en';
  selectedDomainCode: string;
  selectedSubdomainCode: string;
  onSelectDomainCode: (code: string) => void;
  onSelectSubdomainCode: (code: string) => void;
}

type DomainCluster = 'all' | 'generation' | 'transmission' | 'distribution' | 'automation' | 'protection';

export const SubdomainSpecsView: React.FC<SubdomainSpecsViewProps> = ({
  locale,
  selectedDomainCode,
  selectedSubdomainCode,
  onSelectDomainCode,
  onSelectSubdomainCode
}) => {
  const [globalSearch, setGlobalSearch] = useState('');
  const [activeCluster, setActiveCluster] = useState<DomainCluster>('all');

  const clusters: { id: DomainCluster; label_fr: string; label_en: string; domainCodes: string[] }[] = [
    { id: 'all', label_fr: 'Tous les Domaines (D01-D16)', label_en: 'All Domains (D01-D16)', domainCodes: [] },
    { id: 'generation', label_fr: 'Production (D01)', label_en: 'Generation (D01)', domainCodes: ['D01'] },
    { id: 'transmission', label_fr: 'Transport & Postes (D02-D04)', label_en: 'Transmission & Substations (D02-D04)', domainCodes: ['D02', 'D03', 'D04'] },
    { id: 'distribution', label_fr: 'Distribution & Machines (D05-D07)', label_en: 'Distribution & Machines (D05-D07)', domainCodes: ['D05', 'D06', 'D07'] },
    { id: 'automation', label_fr: 'Électronique & Numérique (D08-D10, D12-D14)', label_en: 'Electronics & Digital (D08-D10, D12-D14)', domainCodes: ['D08', 'D09', 'D10', 'D12', 'D13', 'D14'] },
    { id: 'protection', label_fr: 'Protection, Maintenance & Terre (D11, D15-D16)', label_en: 'Protection, Diagnostics & Earth (D11, D15-D16)', domainCodes: ['D11', 'D15', 'D16'] }
  ];

  // Filtered domains based on active cluster
  const displayedDomains = useMemo(() => {
    if (activeCluster === 'all') return DOMAINS;
    const currentCluster = clusters.find((c) => c.id === activeCluster);
    if (!currentCluster || currentCluster.domainCodes.length === 0) return DOMAINS;
    return DOMAINS.filter((d) => currentCluster.domainCodes.includes(d.code));
  }, [activeCluster]);

  // Subdomains for selected domain
  const availableSubdomains = useMemo(() => {
    return ALL_SUBDOMAINS.filter((s) => s.domain_code === selectedDomainCode);
  }, [selectedDomainCode]);

  // Global search across all subdomains
  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    return ALL_SUBDOMAINS.filter((sub) => {
      const codeMatch = sub.code.toLowerCase().includes(q);
      const nameFrMatch = sub.name_fr.toLowerCase().includes(q);
      const nameEnMatch = sub.name_en.toLowerCase().includes(q);
      const descFrMatch = (sub.description_fr || '').toLowerCase().includes(q);
      const descEnMatch = (sub.description_en || '').toLowerCase().includes(q);
      return codeMatch || nameFrMatch || nameEnMatch || descFrMatch || descEnMatch;
    }).slice(0, 10);
  }, [globalSearch]);

  const handleDomainChange = (code: string) => {
    onSelectDomainCode(code);
    const subs = ALL_SUBDOMAINS.filter((s) => s.domain_code === code);
    if (subs.length > 0) {
      onSelectSubdomainCode(subs[0].code);
    }
  };

  const handleSelectSearchResult = (subCode: string, domCode: string) => {
    onSelectDomainCode(domCode);
    onSelectSubdomainCode(subCode);
    setGlobalSearch('');
  };

  const currentSub = useMemo(() => {
    return ALL_SUBDOMAINS.find((s) => s.code === selectedSubdomainCode);
  }, [selectedSubdomainCode]);

  const currentDom = useMemo(() => {
    return DOMAINS.find((d) => d.code === selectedDomainCode);
  }, [selectedDomainCode]);

  const hasGoldenSpec = !!PHASE2_SPECS[selectedSubdomainCode];

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        {/* Global Subdomain Search */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all shadow-xs">
            <Search className="h-4 w-4 text-sky-600 shrink-0" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder={
                locale === 'fr'
                  ? 'Rechercher un sous-domaine par code, titre ou mot-clé (ex: D07.01, BESS, DGA, Alternateur, IEEE 80)...'
                  : 'Search subdomain by code, title or keyword (e.g. D07.01, BESS, DGA, Alternator, IEEE 80)...'
              }
              className="bg-transparent text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none w-full font-mono"
            />
            {globalSearch && (
              <button
                type="button"
                onClick={() => setGlobalSearch('')}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick search dropdown results */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-sky-300 rounded-xl shadow-xl p-2 max-h-80 overflow-y-auto space-y-1">
              <div className="text-[10px] font-mono text-sky-700 uppercase px-2 py-1 flex items-center justify-between font-bold">
                <span>{locale === 'fr' ? 'Résultats trouvés :' : 'Matching Subdomains:'}</span>
                <span>{searchResults.length} {locale === 'fr' ? 'résultats' : 'results'}</span>
              </div>
              {searchResults.map((res) => {
                const isSelected = res.code === selectedSubdomainCode;
                const isGolden = !!PHASE2_SPECS[res.code];
                return (
                  <button
                    key={res.code}
                    type="button"
                    onClick={() => handleSelectSearchResult(res.code, res.domain_code)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-sky-100 text-sky-900 border border-sky-300'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sky-700 font-bold">{res.code}</span>
                      <span className="truncate">{locale === 'fr' ? res.name_fr : res.name_en}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                        {res.domain_code}
                      </span>
                      {isGolden && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                          GOLDEN
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Domain Cluster Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {clusters.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCluster(c.id)}
              className={`px-3 py-1 rounded-md text-[11px] font-mono transition-all border ${
                activeCluster === c.id
                  ? 'bg-sky-100 text-sky-900 border-sky-400 font-bold shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {locale === 'fr' ? c.label_fr : c.label_en}
            </button>
          ))}
        </div>

        {/* Parent Domain Grid */}
        <div>
          <label className="block text-xs font-mono font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-sky-600" />
            <span>
              {locale === 'fr'
                ? `Sélectionner le Domaine Parent (${displayedDomains.length} affichés) :`
                : `Select Parent Domain (${displayedDomains.length} shown):`}
            </span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {displayedDomains.map((dom) => {
              const isDomSelected = dom.code === selectedDomainCode;
              return (
                <button
                  key={dom.code}
                  type="button"
                  onClick={() => handleDomainChange(dom.code)}
                  className={`px-3 py-2 rounded-lg font-mono text-xs font-bold transition-all text-center border ${
                    isDomSelected
                      ? 'bg-sky-100 text-sky-900 border-sky-400 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="text-[13px]">{dom.code}</div>
                  <div className="text-[10px] font-normal truncate opacity-80">
                    {locale === 'fr' ? dom.name_fr : dom.name_en}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subdomain selector pills */}
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-xs font-mono font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-emerald-600" />
            <span>
              {locale === 'fr'
                ? `Sous-Domaines de ${selectedDomainCode} (${availableSubdomains.length}) :`
                : `Subdomains in ${selectedDomainCode} (${availableSubdomains.length}):`}
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-2">
            {availableSubdomains.map((sub) => {
              const isSubSelected = sub.code === selectedSubdomainCode;
              const hasDedicatedSpec = !!PHASE2_SPECS[sub.code];
              return (
                <button
                  key={sub.code}
                  type="button"
                  onClick={() => onSelectSubdomainCode(sub.code)}
                  className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 border ${
                    isSubSelected
                      ? 'bg-sky-100 text-sky-900 border-sky-400 shadow-xs'
                      : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-sky-700 font-bold">{sub.code}</span>
                  <span>{locale === 'fr' ? sub.name_fr : sub.name_en}</span>
                  {hasDedicatedSpec && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                      <Sparkles className="h-2.5 w-2.5" />
                      GOLDEN
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subdomain Engineering Overview Card */}
      {currentSub && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-sky-100 text-sky-800 border border-sky-300">
                  {currentSub.code}
                </span>
                <span className="text-xs font-mono text-slate-700 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 font-semibold">
                  {selectedDomainCode} &bull; {locale === 'fr' ? currentDom?.name_fr : currentDom?.name_en}
                </span>
                <span className="text-xs font-mono text-emerald-800 px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>{locale === 'fr' ? '43 Sections Canoniques' : '43 Canonical Points'}</span>
                </span>
                {hasGoldenSpec && (
                  <span className="text-xs font-mono text-amber-800 px-2 py-0.5 rounded bg-amber-100 border border-amber-300 flex items-center gap-1 font-bold">
                    <Sparkles className="h-3 w-3 text-amber-600" />
                    <span>{locale === 'fr' ? 'Spécification de Référence' : 'Golden Reference'}</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {locale === 'fr' ? currentSub.name_fr : currentSub.name_en}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
                {locale === 'fr' ? currentSub.description_fr : currentSub.description_en}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
              <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-right shadow-xs">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                  {locale === 'fr' ? 'Statut Qualité' : 'Quality Seal'}
                </div>
                <div className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1 justify-end">
                  <Shield className="h-3 w-3 text-emerald-600" />
                  <span>ISO / CEI VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Render 43-Point Spec Viewer for selected subdomain */}
      <Phase2SpecViewer subdomainCode={selectedSubdomainCode} locale={locale} />
    </div>
  );
};

