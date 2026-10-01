// src/components/domain/DomainsListView.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DOMAINS } from '../../data/epedeData';
import { ArrowRight, ShieldAlert, Zap, Cpu, Filter, Search, Layers, Share2, Grid, Award, CheckCircle2, Sparkles } from 'lucide-react';
import type { DomainCode } from '../../types/epede';
import { DomainRelationshipMatrix } from './modules/DomainRelationshipMatrix';
import { EPEDE_MATURITY_REGISTRY, getOverallPlatformMaturity } from '../../data/contentMaturityEngine';
import { PlatformMaturityModal } from '../audit/PlatformMaturityModal';

interface DomainsListViewProps {
  locale: 'fr' | 'en';
  onSelectDomain: (code: DomainCode) => void;
  activeDomainCode?: DomainCode | null;
}

export const DomainsListView: React.FC<DomainsListViewProps> = ({
  locale,
  onSelectDomain,
  activeDomainCode,
}) => {
  const [viewLayout, setViewLayout] = useState<'GRID' | 'MATRIX'>('GRID');
  const [filterGroup, setFilterGroup] = useState<'ALL' | 'CHAIN' | 'DISCIPLINE' | 'SAFETY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const platformStats = useMemo(() => getOverallPlatformMaturity(), []);

  const filteredDomains = useMemo(() => {
    return DOMAINS.filter((d) => {
      if (filterGroup === 'CHAIN' && d.domain_group !== 'chain') return false;
      if (filterGroup === 'DISCIPLINE' && d.domain_group !== 'discipline') return false;
      if (filterGroup === 'SAFETY' && d.code !== 'D11' && d.code !== 'D16') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = d.code.toLowerCase().includes(q);
        const matchesName = (locale === 'fr' ? d.name_fr : d.name_en).toLowerCase().includes(q);
        const matchesShort = (locale === 'fr' ? d.short_fr : d.short_en).toLowerCase().includes(q);
        const matchesDesc = (locale === 'fr' ? d.description_fr : d.description_en).toLowerCase().includes(q);
        if (!matchesCode && !matchesName && !matchesShort && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [filterGroup, searchQuery, locale]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Platform Maturity Audit Modal */}
      <PlatformMaturityModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        locale={locale}
        onNavigateDomain={(code) => {
          setIsAuditModalOpen(false);
          onSelectDomain(code);
        }}
      />
      
      {/* Header */}
      <header className="rounded-2xl border border-[#252E38] bg-[#0D1117] p-6 sm:p-8 shadow-xl cad-grid-dense">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-xs">
              <span className="text-cyan-400 font-bold bg-[#080B10] px-2.5 py-1 rounded border border-[#252E38] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                Matrice d'Architecture EPEDE
              </span>
              <span className="text-neutral-500 font-bold">16 DOMAINES SYSTÈMES</span>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30 transition-all cursor-pointer shadow-xs"
                title={locale === 'fr' ? "Consulter le rapport d'audit de maturité" : 'View maturity audit report'}
              >
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>16/16 NIVEAU 5 ({platformStats.averageScorePercent}%)</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-mono">
              {locale === 'fr' ? 'Architecture des 16 Domaines EPEDE' : 'EPEDE 16 Domains Architecture'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed font-medium">
              {locale === 'fr'
                ? 'La modélisation d\'ingénierie électrique EPEDE sépare rigoureusement la chaîne physique de l\'énergie (D01 à D06) des disciplines transversales de conception, protection et numérisation (D07 à D16). Tous les 16 domaines disposent désormais de stations de travail interactives de Niveau 5.'
                : 'The EPEDE power engineering model segments the physical energy conversion chain (D01-D06) from transversal design, protection and digital engineering disciplines (D07-D16). All 16 domains now feature fully interactive Level 5 engineering workbenches.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs shrink-0">
            <button
              type="button"
              onClick={() => setIsAuditModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Award className="h-4 w-4 text-purple-200" />
              <span>{locale === 'fr' ? 'Audit de Maturité EPEDE' : 'Maturity Audit Report'}</span>
            </button>

            <div className="flex items-center bg-[#080B10] p-1 rounded-xl border border-[#252E38]">
              <button
                type="button"
                onClick={() => setViewLayout('GRID')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  viewLayout === 'GRID'
                    ? 'bg-cyan-500 text-slate-950 shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Grid className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Grille' : 'Grid'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('MATRIX')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  viewLayout === 'MATRIX'
                    ? 'bg-cyan-500 text-slate-950 shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{locale === 'fr' ? 'Matrice' : 'Matrix'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar (Only shown in GRID mode) */}
        {viewLayout === 'GRID' && (
          <div className="mt-6 pt-5 border-t border-[#252E38] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-neutral-400 flex items-center gap-1 mr-1 uppercase tracking-wider">
                <Filter className="h-3.5 w-3.5 text-cyan-400" />
                <span>{locale === 'fr' ? 'FILTRE :' : 'FILTER:'}</span>
              </span>
              {[
                { id: 'ALL', label: locale === 'fr' ? 'TOUS (16)' : 'ALL (16)' },
                { id: 'CHAIN', label: locale === 'fr' ? 'CHAÎNE PHYSIQUE (D01-D06)' : 'PHYSICAL CHAIN (D01-D06)' },
                { id: 'DISCIPLINE', label: locale === 'fr' ? 'DISCIPLINES (D07-D16)' : 'DISCIPLINES (D07-D16)' },
                { id: 'SAFETY', label: locale === 'fr' ? 'SÉCURITÉ CRITIQUE (D11/D16)' : 'SAFETY CRITICAL (D11/D16)' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setFilterGroup(btn.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all border ${
                    filterGroup === btn.id
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                      : 'border-[#252E38] bg-[#080B10] text-neutral-400 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === 'fr' ? 'Filtrer (ex: D04, transport, terre...)' : 'Filter (e.g. D04, grid...)'}
                className="w-full bg-[#080B10] border border-[#252E38] focus:border-cyan-400 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white font-mono placeholder:text-neutral-600 outline-none transition-colors"
              />
            </div>
          </div>
        )}
      </header>

      {/* MATRIX VIEW */}
      {viewLayout === 'MATRIX' ? (
        <DomainRelationshipMatrix
          locale={locale}
          activeDomainCode={activeDomainCode || 'D04'}
          onSelectDomain={onSelectDomain}
        />
      ) : (
        /* Grid of Domains with Staggered Motion */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
        {filteredDomains.map((dom) => {
          const isSafetyDomain = dom.code === 'D11' || dom.code === 'D16';
          const isChain = dom.domain_group === 'chain';
          const isActive = activeDomainCode === dom.code;
          const maturity = EPEDE_MATURITY_REGISTRY[dom.code as DomainCode];

          return (
            <motion.div
              key={dom.code}
              variants={cardVariants}
              data-testid={`domain-card-${dom.code}`}
              onClick={() => onSelectDomain(dom.code)}
              className={`relative rounded-xl border p-5 transition-all duration-150 cursor-pointer group shadow-md flex flex-col justify-between overflow-hidden hover:-translate-y-1 ${
                isActive
                  ? 'border-amber-400 bg-[#161C24] ring-1 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                  : isSafetyDomain
                  ? 'border-red-900/60 bg-[#140C0F] hover:border-amber-400 hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)]'
                  : 'border-[#252E38] bg-[#0D1117] hover:border-amber-400 hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)]'
              }`}
            >
              {/* Active domain left border indicator */}
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400" />
              )}

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                        isSafetyDomain
                          ? 'text-red-400 bg-red-950/80 border-red-800'
                          : 'text-cyan-400 bg-[#080B10] border-[#252E38]'
                      }`}
                    >
                      {dom.code}
                    </span>
                    {maturity && (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        L{maturity.maturityLevel} · {maturity.maturityScorePercent}%
                      </span>
                    )}
                  </div>

                  {isSafetyDomain ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-red-300 font-bold uppercase tracking-wider bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                      <ShieldAlert className="h-3 w-3" />
                      <span>SÉCURITÉ CRITIQUE</span>
                    </span>
                  ) : isChain ? (
                    <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider bg-[#080B10] px-2 py-0.5 rounded border border-[#252E38]">
                      CHAÎNE #{dom.chain_position}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wider">
                      DISCIPLINE
                    </span>
                  )}
                </div>

                <h3
                  className={`font-bold uppercase tracking-tight text-base font-mono transition-colors ${
                    isSafetyDomain
                      ? 'text-white group-hover:text-amber-300'
                      : 'text-white group-hover:text-amber-300'
                  }`}
                >
                  {locale === 'fr' ? dom.name_fr : dom.name_en}
                </h3>
                <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed font-medium">
                  {locale === 'fr' ? dom.description_fr : dom.description_en}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#252E38] flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-slate-400 group-hover:text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{locale === 'fr' ? 'Workbench Interactif' : 'Interactive Workbench'}</span>
                </span>
                <span className={`inline-flex items-center gap-1 ${isSafetyDomain ? 'text-red-400 group-hover:text-amber-400' : 'text-cyan-400 group-hover:text-amber-400'}`}>
                  <span>{locale === 'fr' ? 'Ouvrir' : 'Open'}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      )}

    </div>
  );
};

