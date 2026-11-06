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
import { PageHeader, DataStrip, FinalCTA } from '../common';

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
    <div className="space-y-12 pb-20 font-['Space_Grotesk',sans-serif] text-[#0B1B2B] bg-[#FBFCFD]">
      <PlatformMaturityModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        locale={locale}
        onNavigateDomain={(code) => {
          setIsAuditModalOpen(false);
          onSelectDomain(code);
        }}
      />

      {/* 1. Page Header (SITEWIDE-REDESIGN.md Section 2) */}
      <PageHeader
        breadcrumb={[
          { label: isFr ? 'Accueil' : 'Home', href: '#/' },
          { label: isFr ? 'Domaines' : 'Domains' },
        ]}
        eyebrow={isFr ? 'BIBLIOTHÈQUE TECHNIQUE · 16 DOMAINES & 6 FONDATIONS' : 'TECHNICAL LIBRARY · 16 DOMAINS & 6 FOUNDATIONS'}
        title={
          isFr
            ? 'Les 16 domaines du génie électrique et des réseaux'
            : 'The 16 domains of electrical power engineering'
        }
        intro={
          isFr
            ? '6 maillons de la chaîne physique de puissance (D01–D06) et 10 disciplines transversales de protection, automatisation IEC 61850, qualité d’énergie, stockage et sécurité (D07–D16).'
            : '6 physical power-chain stages (D01–D06) and 10 transversal engineering disciplines covering protection, IEC 61850 automation, power quality, storage, and earthing safety (D07–D16).'
        }
      >
        <DataStrip
          items={[
            {
              label: isFr ? 'Domaines Exhaustifs' : 'Total Domains',
              value: '16',
              subtext: isFr ? 'D01 à D16 couverts' : 'Complete D01–D16 scope',
            },
            {
              label: isFr ? 'Chaîne Physique' : 'Power Chain',
              value: '06',
              subtext: isFr ? 'Production aux charges BT' : 'Generation to end-users',
            },
            {
              label: isFr ? 'Disciplines Systèmes' : 'Transversal Systems',
              value: '10',
              subtext: isFr ? 'Protection, SCADA & IA' : 'Protection, SCADA & AI',
            },
            {
              label: isFr ? 'Maturité Moyenne' : 'Average Maturity',
              value: `${platformStats.averageScorePercent}%`,
              subtext: isFr ? '16/16 audités selon normes' : '16/16 normative audit',
            },
          ]}
        />
      </PageHeader>

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
        {/* Mode Switcher & Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#D5E0E8]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAuditModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EEF4F8] text-[#1F5FAE] font-mono text-xs font-semibold border border-[#1F5FAE]/30 hover:bg-[#1F5FAE] hover:text-white transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>
                {isFr ? 'Maturité :' : 'Maturity:'} 16/16 ({platformStats.averageScorePercent}%)
              </span>
            </button>
            <span className="font-mono text-xs text-[#5B6B7B]">
              D01–D16 · L01–L06
            </span>
          </div>

          <div
            role="tablist"
            aria-label={isFr ? 'Mode d’affichage' : 'Directory display mode'}
            className="inline-flex items-center p-1 rounded-full bg-[#EEF4F8] border border-[#D5E0E8] font-mono text-xs self-start shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewLayout === 'GRID'}
              onClick={() => setViewLayout('GRID')}
              className={`px-4 py-2 rounded-full font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewLayout === 'GRID'
                  ? 'bg-[#0B1B2B] text-[#F3F7FA]'
                  : 'text-[#5B6B7B] hover:text-[#0B1B2B]'
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
              className={`px-4 py-2 rounded-full font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewLayout === 'MATRIX'
                  ? 'bg-[#0B1B2B] text-[#F3F7FA]'
                  : 'text-[#5B6B7B] hover:text-[#0B1B2B]'
              }`}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{isFr ? 'Matrice d’Interfaces' : 'Interaction Matrix'}</span>
            </button>
          </div>
        </div>

        {/* Compact Search & Filter Bar */}
        {viewLayout === 'GRID' && (
          <div className="bg-[#FBFCFD] border border-[#D5E0E8] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[#5B6B7B] font-semibold uppercase mr-1 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-[#1F5FAE]" />
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
                    className={`px-3 py-1.5 rounded-full font-semibold transition-colors border cursor-pointer ${
                      active
                        ? 'bg-[#0B1B2B] border-[#0B1B2B] text-[#F3F7FA]'
                        : 'bg-[#FBFCFD] border-[#D5E0E8] text-[#5B6B7B] hover:text-[#0B1B2B] hover:border-[#1F5FAE]'
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#1F5FAE]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isFr
                    ? 'Filtrer (D04, poste, protection, terre...)'
                    : 'Filter (D04, substation, relay, earthing...)'
                }
                className="w-full bg-[#FBFCFD] border border-[#D5E0E8] focus:border-[#1F5FAE] rounded-full pl-9 pr-8 py-2 text-xs text-[#0B1B2B] font-sans placeholder:text-[#5B6B7B] outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B6B7B] hover:text-[#0B1B2B]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

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
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#0B1B2B] pb-3">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#1F5FAE] font-bold block">
                    {isFr ? '01 · Chaîne Physique de Puissance' : '01 · Physical Power Chain'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B2B] mt-0.5">
                    {isFr
                      ? 'D01 à D06 — De la production aux installations basse tension'
                      : 'D01 to D06 — From generation to low-voltage installations'}
                  </h2>
                </div>
                <span className="font-mono text-xs text-[#5B6B7B]">
                  {chainDomains.length} {isFr ? 'domaines séquentiels' : 'sequential stages'}
                </span>
              </div>

              <div className="divide-y divide-[#D5E0E8] border-y border-[#D5E0E8] bg-[#FBFCFD]">
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
                        isActive ? 'bg-[#EEF4F8] border-l-4 border-l-[#1F5FAE]' : 'hover:bg-[#EEF4F8]/60'
                      }`}
                    >
                      <div>
                        <span className="font-mono text-base font-bold text-[#1F5FAE] block">
                          {dom.code}
                        </span>
                        <span className="font-mono text-[10px] text-[#F2A541] uppercase font-bold">
                          {isFr ? `Étape #${dom.chain_position}` : `Stage #${dom.chain_position}`}
                        </span>
                      </div>

                      <div className="h-20 w-full rounded-lg overflow-hidden border border-[#D5E0E8] bg-[#0B1B2B]">
                        <img
                          src={asset?.src || '/images/homepage_uploads/2.jpg'}
                          alt={isFr ? dom.name_fr : dom.name_en}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-[#0B1B2B] group-hover:text-[#1F5FAE] transition-colors">
                            {isFr ? dom.name_fr : dom.name_en}
                          </h3>
                          {maturity && (
                            <span className="font-mono text-[11px] text-[#5B6B7B] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#1F5FAE]" />
                              <span>6 {isFr ? 'sous-domaines' : 'subdomains'}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#3A4B5C] line-clamp-2 leading-relaxed max-w-[70ch]">
                          {isFr ? dom.description_fr : dom.description_en}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#0B1B2B] group-hover:text-[#1F5FAE] shrink-0">
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
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#0B1B2B] pb-3">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#1F5FAE] font-bold block">
                    {isFr
                      ? '02 · Disciplines Transversales, Protection & Sécurité'
                      : '02 · Transversal Disciplines, Protection & Safety'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B2B] mt-0.5">
                    {isFr
                      ? 'D07 à D16 — Contrôle-commande, protection, stockage, qualité & mise à la terre'
                      : 'D07 to D16 — Automation, protection, storage, power quality & earthing safety'}
                  </h2>
                </div>
                <span className="font-mono text-xs text-[#5B6B7B]">
                  {transversalDomains.length} {isFr ? 'disciplines systèmes' : 'system disciplines'}
                </span>
              </div>

              <div className="divide-y divide-[#D5E0E8] border-y border-[#D5E0E8] bg-[#FBFCFD]">
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
                        isActive ? 'bg-[#EEF4F8] border-l-4 border-l-[#1F5FAE]' : 'hover:bg-[#EEF4F8]/60'
                      }`}
                    >
                      <div>
                        <span className="font-mono text-base font-bold text-[#1F5FAE] block">
                          {dom.code}
                        </span>
                        <span className="font-mono text-[10px] text-[#5B6B7B] uppercase font-bold">
                          {isSafetyDomain ? (isFr ? 'Sécurité' : 'Safety') : 'System'}
                        </span>
                      </div>

                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-lg font-bold text-[#0B1B2B] group-hover:text-[#1F5FAE] transition-colors">
                            {isFr ? dom.name_fr : dom.name_en}
                          </h3>
                          {isSafetyDomain && (
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-[#B91C1C] bg-[#FEE2E2] px-2 py-0.5 rounded-full">
                              <ShieldAlert className="h-3 w-3" />
                              <span>{isFr ? 'Critique Sécurité' : 'Protection & Safety'}</span>
                            </span>
                          )}
                          {maturity && (
                            <span className="font-mono text-[11px] text-[#5B6B7B]">
                              · 6 {isFr ? 'sous-domaines' : 'subdomains'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#3A4B5C] line-clamp-2 leading-relaxed max-w-[74ch]">
                          {isFr ? dom.description_fr : dom.description_en}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#0B1B2B] group-hover:text-[#1F5FAE] shrink-0">
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
      <section className="border-t border-[#D5E0E8] pt-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#1F5FAE] font-bold block">
              {isFr ? '03 · Fondations Transversales (L01–L06)' : '03 · Cross-Cutting Foundations (L01–L06)'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B2B] mt-0.5">
              {isFr
                ? '6 couches transversales reliant les 16 domaines techniques'
                : '6 cross-cutting foundations connecting all 16 engineering domains'}
            </h2>
          </div>
          <span className="font-mono text-xs text-[#5B6B7B]">
            {isFr ? 'Grille équilibrée 3 × 2' : 'Balanced 3 × 2 foundation grid'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sixFoundations.map((layer) => (
            <div
              key={layer.code}
              className="p-6 rounded-xl bg-[#FBFCFD] border border-[#D5E0E8] space-y-2 hover:border-[#1F5FAE]/60 transition-colors shadow-xs"
            >
              <div className="font-mono text-xs font-bold text-[#1F5FAE]">{layer.code}</div>
              <h3 className="font-bold text-base text-[#0B1B2B]">
                {isFr ? layer.name_fr : layer.name_en}
              </h3>
              <p className="text-xs text-[#3A4B5C] leading-relaxed">
                {isFr ? layer.description_fr : layer.description_en}
              </p>
            </div>
          ))}
        </div>
      </section>
      </div>

      {/* 4. Final Call to Action */}
      <FinalCTA
        title={
          isFr
            ? 'Naviguez dans l’ordre physique de l’énergie'
            : 'Explore the complete power system in physical sequence'
        }
        description={
          isFr
            ? 'De la centrale hydroélectrique de Songloulou aux postes de transport 225 kV et départs industriels 30 kV. Découvrez chaque appareillage avec ses schémas unifilaires et normes CEI.'
            : 'From Songloulou hydropower station through 225 kV transmission substations to 30 kV industrial feeders. Inspect every asset with single-line diagrams and IEC standards.'
        }
        primaryAction={{
          label: isFr ? 'Lancer le Parcours 9 Étapes' : 'Launch 9-Stage Explorer',
          onClick: () => {
            window.location.hash = '#/journey';
          },
        }}
        secondaryAction={{
          label: isFr ? 'Ouvrir les 19 Calculateurs' : 'Open 19 Solvers',
          onClick: () => {
            window.location.hash = '#/calculators';
          },
        }}
      />
    </div>
  );
};
