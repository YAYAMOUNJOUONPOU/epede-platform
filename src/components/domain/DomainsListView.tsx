// src/components/domain/DomainsListView.tsx
// EPEDE ProCode Redesign — Route 6: Domains Directory (#/domains)
// Features:
// 1. Editorial introduction & compact searchable filter block
// 2. D01–D06 grouped under Physical Power Chain
// 3. D07–D16 grouped under Transversal Disciplines, Protection & Safety as editorial index rows
// 4. Cross-Cutting Foundations (L01–L06) in a balanced 3×2 grid

import React, { useState, useMemo } from 'react';
import { DOMAINS, LAYERS } from '../../data/epedeData';
import {
  ArrowRight,
  ShieldAlert,
  Filter,
  Search,
  Share2,
  Grid,
  Award,
  CheckCircle2,
  X,
} from 'lucide-react';
import type { DomainCode } from '../../types/epede';
import { DomainRelationshipMatrix } from './modules/DomainRelationshipMatrix';
import { EPEDE_MATURITY_REGISTRY, getOverallPlatformMaturity } from '../../data/contentMaturityEngine';
import { PlatformMaturityModal } from '../audit/PlatformMaturityModal';
import { DOMAIN_EDITORIAL_ASSETS } from '../../data/assets/editorialAssetManifest';

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
  const isFr = locale === 'fr';
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
        const matchesName = (isFr ? d.name_fr : d.name_en).toLowerCase().includes(q);
        const matchesShort = (isFr ? d.short_fr : d.short_en).toLowerCase().includes(q);
        const matchesDesc = (isFr ? d.description_fr : d.description_en).toLowerCase().includes(q);
        if (!matchesCode && !matchesName && !matchesShort && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [filterGroup, searchQuery, isFr]);

  const chainDomains = useMemo(
    () => filteredDomains.filter((d) => d.domain_group === 'chain'),
    [filteredDomains]
  );

  const transversalDomains = useMemo(
    () => filteredDomains.filter((d) => d.domain_group !== 'chain'),
    [filteredDomains]
  );

  // Ensure 6 foundations (L01-L05 + L06 Regulatory & Grid Code) for balanced 3x2 grid
  const sixFoundations = useMemo(() => {
    const base = [...LAYERS];
    if (base.length < 6) {
      base.push({
        id: 'layer-l06',
        code: 'L06',
        name_fr: 'Cadre Réglementaire & Code de Réseau',
        name_en: 'Regulatory Framework & National Grid Code',
        description_fr:
          'Architecture institutionnelle (MINEE, ARSEL, SONATREL, ENEO, EDC), Loi 2011/022 et enveloppes de tension/fréquence.',
        description_en:
          'Institutional architecture (MINEE, ARSEL, SONATREL, ENEO, EDC), Law 2011/022, and statutory voltage/frequency envelopes.',
        icon: 'Scale',
        color: '#4B5563',
        sort_order: 6,
      });
    }
    return base.slice(0, 6);
  }, []);

  return (
    <div className="space-y-14 pb-20 text-[#17282C] font-sans">
      <PlatformMaturityModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        locale={locale}
        onNavigateDomain={(code) => {
          setIsAuditModalOpen(false);
          onSelectDomain(code);
        }}
      />

      {/* 1. Editorial Header & Compact Search/Filter Block */}
      <header className="border-t border-[#17282C] pt-8 sm:pt-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12">
          <div>
            <span className="epede-eyebrow block">
              {isFr ? 'Bibliothèque — Domaines' : 'Knowledge Library — Domains'}
            </span>
            <p className="mt-2 font-mono text-xs text-[#5C6C70]">
              D01–D16 · L01–L06
            </p>
            <button
              type="button"
              onClick={() => setIsAuditModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E3EFEC] text-[#147C78] font-mono text-[11px] font-semibold border border-[#147C78]/30 hover:bg-[#147C78] hover:text-[#FFFDF9] transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>
                16/16 ({platformStats.averageScorePercent}%)
              </span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <h1 className="epede-h1">
                  {isFr ? (
                    <>
                      Les 16 domaines du{' '}
                      <em className="font-serif-editorial text-[#147C78]">
                        génie électrique et des réseaux
                      </em>
                      .
                    </>
                  ) : (
                    <>
                      The 16 domains of{' '}
                      <em className="font-serif-editorial text-[#147C78]">
                        electrical power engineering
                      </em>
                      .
                    </>
                  )}
                </h1>
                <p className="epede-lead">
                  {isFr
                    ? '6 maillons de la chaîne physique de puissance (D01–D06) et 10 disciplines transversales de protection, automatisation IEC 61850, qualité d’énergie, stockage et sécurité (D07–D16).'
                    : '6 physical power-chain stages (D01–D06) and 10 transversal engineering disciplines covering protection, IEC 61850 automation, power quality, storage, and earthing safety (D07–D16).'}
                </p>
              </div>

              {/* View Mode Switcher: Directory vs Matrix */}
              <div
                role="tablist"
                aria-label={isFr ? 'Mode d’affichage' : 'Directory display mode'}
                className="inline-flex items-center p-1 rounded-full bg-[#EFECE3] border border-[#DEDACF] font-mono text-xs self-start shrink-0"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewLayout === 'GRID'}
                  onClick={() => setViewLayout('GRID')}
                  className={`px-4 py-2 rounded-full font-semibold flex items-center gap-1.5 transition-colors ${
                    viewLayout === 'GRID'
                      ? 'bg-[#17282C] text-[#FFFDF9]'
                      : 'text-[#5C6C70] hover:text-[#17282C]'
                  }`}
                >
                  <Grid className="h-3.5 w-3.5" />
                  <span>{isFr ? 'Répertoire' : 'Directory'}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewLayout === 'MATRIX'}
                  onClick={() => setViewLayout('MATRIX')}
                  className={`px-4 py-2 rounded-full font-semibold flex items-center gap-1.5 transition-colors ${
                    viewLayout === 'MATRIX'
                      ? 'bg-[#17282C] text-[#FFFDF9]'
                      : 'text-[#5C6C70] hover:text-[#17282C]'
                  }`}
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>{isFr ? 'Matrice d’Interfaces' : 'Interaction Matrix'}</span>
                </button>
              </div>
            </div>

            {/* Compact Search & Filter Bar */}
            {viewLayout === 'GRID' && (
              <div className="bg-[#FFFDF9] border border-[#DEDACF] rounded-[10px] p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[#5C6C70] font-semibold uppercase mr-1 flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5 text-[#147C78]" />
                    <span>{isFr ? 'Groupe :' : 'Group:'}</span>
                  </span>
                  {[
                    { id: 'ALL', label: isFr ? 'Tous (16)' : 'All (16)' },
                    { id: 'CHAIN', label: isFr ? 'Chaîne Physique (D01–D06)' : 'Physical Chain (D01–D06)' },
                    {
                      id: 'DISCIPLINE',
                      label: isFr ? 'Disciplines Transversales (D07–D16)' : 'Transversal Systems (D07–D16)',
                    },
                    {
                      id: 'SAFETY',
                      label: isFr ? 'Protection & Terre (D11 / D16)' : 'Protection & Earthing (D11 / D16)',
                    },
                  ].map((btn) => {
                    const active = filterGroup === btn.id;
                    return (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setFilterGroup(btn.id as any)}
                        className={`px-3 py-1.5 rounded-full font-semibold transition-colors border ${
                          active
                            ? 'bg-[#147C78] border-[#147C78] text-[#FFFDF9]'
                            : 'bg-[#F6F4EE] border-[#DEDACF] text-[#5C6C70] hover:text-[#17282C]'
                        }`}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#147C78]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isFr
                        ? 'Filtrer (D04, poste, protection, terre...)'
                        : 'Filter (D04, substation, relay, earthing...)'
                    }
                    className="w-full bg-[#F6F4EE] border border-[#DEDACF] focus:border-[#147C78] rounded-full pl-9 pr-8 py-2 text-xs text-[#17282C] font-sans placeholder:text-[#5C6C70] outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C6C70] hover:text-[#17282C]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. MATRIX VIEW OR GROUPED DIRECTORY */}
      {viewLayout === 'MATRIX' ? (
        <DomainRelationshipMatrix
          locale={locale}
          activeDomainCode={activeDomainCode || 'D04'}
          onSelectDomain={onSelectDomain}
        />
      ) : (
        <div className="space-y-14">
          {/* GROUP 01: PHYSICAL POWER CHAIN (D01–D06) */}
          {chainDomains.length > 0 && (
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#17282C] pb-3">
                <div>
                  <span className="epede-eyebrow block">
                    {isFr ? '01 · Chaîne Physique de Puissance' : '01 · Physical Power Chain'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#17282C] mt-0.5">
                    {isFr
                      ? 'D01 à D06 — De la production aux installations basse tension'
                      : 'D01 to D06 — From generation to low-voltage installations'}
                  </h2>
                </div>
                <span className="font-mono text-xs text-[#5C6C70]">
                  {chainDomains.length} {isFr ? 'domaines séquentiels' : 'sequential stages'}
                </span>
              </div>

              <div className="divide-y divide-[#DEDACF] border-y border-[#DEDACF] bg-[#FFFDF9]">
                {chainDomains.map((dom) => {
                  const isActive = activeDomainCode === dom.code;
                  const maturity = EPEDE_MATURITY_REGISTRY[dom.code as DomainCode];
                  const asset = DOMAIN_EDITORIAL_ASSETS[dom.code];

                  return (
                    <div
                      key={dom.code}
                      data-testid={`domain-card-${dom.code}`}
                      onClick={() => onSelectDomain(dom.code)}
                      className={`p-5 sm:p-6 transition-colors cursor-pointer group grid grid-cols-1 md:grid-cols-[72px_140px_1fr_auto] gap-5 items-center ${
                        isActive ? 'bg-[#E3EFEC]/70 border-l-4 border-l-[#147C78]' : 'hover:bg-[#F6F4EE]'
                      }`}
                    >
                      <div>
                        <span className="font-mono text-base font-bold text-[#147C78] block">
                          {dom.code}
                        </span>
                        <span className="font-mono text-[10px] text-[#B8872D] uppercase">
                          {isFr ? `Étape #${dom.chain_position}` : `Stage #${dom.chain_position}`}
                        </span>
                      </div>

                      <div className="h-20 w-full rounded-lg overflow-hidden border border-[#DEDACF] bg-[#10191D]">
                        <img
                          src={asset?.src || '/images/homepage_uploads/2.jpg'}
                          alt={isFr ? dom.name_fr : dom.name_en}
                          className="w-full h-full object-cover epede-photo-grade"
                          loading="lazy"
                        />
                      </div>

                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-[#17282C] group-hover:text-[#147C78] transition-colors">
                            {isFr ? dom.name_fr : dom.name_en}
                          </h3>
                          {maturity && (
                            <span className="font-mono text-[11px] text-[#5C6C70] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#147C78]" />
                              <span>6 {isFr ? 'sous-domaines' : 'subdomains'}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#33474B] line-clamp-2 leading-relaxed max-w-[70ch]">
                          {isFr ? dom.description_fr : dom.description_en}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#17282C] group-hover:text-[#147C78] shrink-0">
                        <span>{isFr ? 'Ouvrir' : 'Explore'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* GROUP 02: TRANSVERSAL DISCIPLINES, PROTECTION & SAFETY (D07–D16) */}
          {transversalDomains.length > 0 && (
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#17282C] pb-3">
                <div>
                  <span className="epede-eyebrow block">
                    {isFr
                      ? '02 · Disciplines Transversales, Protection & Sécurité'
                      : '02 · Transversal Disciplines, Protection & Safety'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#17282C] mt-0.5">
                    {isFr
                      ? 'D07 à D16 — Contrôle-commande, protection, stockage, qualité & mise à la terre'
                      : 'D07 to D16 — Automation, protection, storage, power quality & earthing safety'}
                  </h2>
                </div>
                <span className="font-mono text-xs text-[#5C6C70]">
                  {transversalDomains.length} {isFr ? 'disciplines systèmes' : 'system disciplines'}
                </span>
              </div>

              <div className="divide-y divide-[#DEDACF] border-y border-[#DEDACF] bg-[#FFFDF9]">
                {transversalDomains.map((dom) => {
                  const isSafetyDomain = dom.code === 'D11' || dom.code === 'D16';
                  const isActive = activeDomainCode === dom.code;
                  const maturity = EPEDE_MATURITY_REGISTRY[dom.code as DomainCode];

                  return (
                    <div
                      key={dom.code}
                      data-testid={`domain-card-${dom.code}`}
                      onClick={() => onSelectDomain(dom.code)}
                      className={`p-5 sm:p-6 transition-colors cursor-pointer group grid grid-cols-1 md:grid-cols-[72px_1fr_auto] gap-5 items-center ${
                        isActive ? 'bg-[#E3EFEC]/70 border-l-4 border-l-[#147C78]' : 'hover:bg-[#F6F4EE]'
                      }`}
                    >
                      <div>
                        <span className="font-mono text-base font-bold text-[#147C78] block">
                          {dom.code}
                        </span>
                        <span className="font-mono text-[10px] text-[#5C6C70] uppercase">
                          {isSafetyDomain ? (isFr ? 'Sécurité' : 'Safety') : 'System'}
                        </span>
                      </div>

                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-lg font-bold text-[#17282C] group-hover:text-[#147C78] transition-colors">
                            {isFr ? dom.name_fr : dom.name_en}
                          </h3>
                          {isSafetyDomain && (
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-[#B91C1C] bg-[#FEE2E2] px-2 py-0.5 rounded-full">
                              <ShieldAlert className="h-3 w-3" />
                              <span>{isFr ? 'Critique Sécurité' : 'Protection & Safety'}</span>
                            </span>
                          )}
                          {maturity && (
                            <span className="font-mono text-[11px] text-[#5C6C70]">
                              · 6 {isFr ? 'sous-domaines' : 'subdomains'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#33474B] line-clamp-2 leading-relaxed max-w-[74ch]">
                          {isFr ? dom.description_fr : dom.description_en}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#17282C] group-hover:text-[#147C78] shrink-0">
                        <span>{isFr ? 'Ouvrir' : 'Explore'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {/* 3. Cross-Cutting Foundations (L01–L06) in a Balanced 3×2 Grid */}
      <section className="border-t border-[#17282C] pt-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="epede-eyebrow block">
              {isFr ? '03 · Fondations Transversales (L01–L06)' : '03 · Cross-Cutting Foundations (L01–L06)'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17282C] mt-0.5">
              {isFr
                ? '6 couches transversales reliant les 16 domaines techniques'
                : '6 cross-cutting foundations connecting all 16 engineering domains'}
            </h2>
          </div>
          <span className="font-mono text-xs text-[#5C6C70]">
            {isFr ? 'Grille équilibrée 3 × 2' : 'Balanced 3 × 2 foundation grid'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sixFoundations.map((layer) => (
            <div
              key={layer.code}
              className="p-6 rounded-[10px] bg-[#FFFDF9] border border-[#DEDACF] space-y-2"
            >
              <div className="font-mono text-xs font-bold text-[#147C78]">{layer.code}</div>
              <h3 className="font-bold text-base text-[#17282C]">
                {isFr ? layer.name_fr : layer.name_en}
              </h3>
              <p className="text-xs text-[#33474B] leading-relaxed">
                {isFr ? layer.description_fr : layer.description_en}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
