// src/components/domain/DomainsListView.tsx
// EPEDE — Interconnected Knowledge Library (16 Core Engineering Domains + 5 Cross-Cutting Foundations)

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DOMAINS, LAYERS } from '../../data/epedeData';
import {
  ArrowRight,
  ShieldAlert,
  Filter,
  Search,
  Layers,
  Share2,
  Grid,
  Award,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.22,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <div className="space-y-8">
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

      {/* Knowledge Library Header */}
      <header className="rounded-2xl border border-[#567A87]/35 bg-[#151C1E] p-6 sm:p-8 shadow-xl cad-grid-dense">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5 font-mono text-xs">
              <span className="text-[#D7A64A] font-bold bg-[#0B0F12] px-3 py-1 rounded-lg border border-[#D7A64A]/40 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                {isFr ? 'Bibliothèque de Connaissances EPEDE' : 'EPEDE Knowledge Architecture'}
              </span>
              <span className="text-[#A9ADA5] font-bold">
                {isFr ? '16 DOMAINES + 5 COUCHES TRANSVERSALES' : '16 DOMAINS + 5 CROSS-CUTTING FOUNDATIONS'}
              </span>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30 transition-all cursor-pointer"
                title={isFr ? "Consulter le rapport d'audit de maturité" : 'View maturity audit report'}
              >
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {isFr
                    ? `16/16 Domaines Vérifiés (${platformStats.averageScorePercent}%)`
                    : `16/16 Verified Domains (${platformStats.averageScorePercent}%)`}
                </span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F4F1E8]">
              {isFr
                ? 'Bibliothèque Interconnectée du Génie Électrique'
                : 'Interconnected Electrical Power Engineering Knowledge Library'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#A9ADA5] max-w-3xl leading-relaxed">
              {isFr
                ? 'Explorez les 6 maillons de la chaîne physique de puissance (D01 à D06) et les 10 disciplines transversales de protection, automatisation, qualité d’énergie et sécurité (D07 à D16). Chaque domaine inclut définitions, principes physiques, équipements, normes CEI/IEEE et exemples réels au Cameroun.'
                : 'Explore the 6 physical power chain stages (D01–D06) and the 10 transversal engineering disciplines covering protection, substation automation, power quality, storage, and earthing safety (D07–D16). Every domain connects principles, components, IEC/IEEE standards, and real-world Cameroon infrastructure.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs shrink-0">
            <div className="flex items-center bg-[#0B0F12] p-1 rounded-xl border border-[#567A87]/35">
              <button
                type="button"
                onClick={() => setViewLayout('GRID')}
                className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewLayout === 'GRID'
                    ? 'bg-[#D7A64A] text-[#0B0F12] shadow-xs'
                    : 'text-[#A9ADA5] hover:text-[#F4F1E8]'
                }`}
              >
                <Grid className="h-3.5 w-3.5" />
                <span>{isFr ? 'Catalogue' : 'Directory'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('MATRIX')}
                className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewLayout === 'MATRIX'
                    ? 'bg-[#D7A64A] text-[#0B0F12] shadow-xs'
                    : 'text-[#A9ADA5] hover:text-[#F4F1E8]'
                }`}
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{isFr ? 'Matrice d’Interactions' : 'Interconnection Matrix'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar (Only shown in GRID mode) */}
        {viewLayout === 'GRID' && (
          <div className="mt-6 pt-5 border-t border-[#567A87]/25 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-[#A9ADA5] flex items-center gap-1 mr-1 uppercase tracking-wider">
                <Filter className="h-3.5 w-3.5 text-[#D7A64A]" />
                <span>{isFr ? 'FILTRE :' : 'FILTER:'}</span>
              </span>
              {[
                { id: 'ALL', label: isFr ? 'TOUS LES DOMAINES (16)' : 'ALL DOMAINS (16)' },
                { id: 'CHAIN', label: isFr ? 'CHAÎNE PHYSIQUE (D01–D06)' : 'PHYSICAL POWER CHAIN (D01–D06)' },
                { id: 'DISCIPLINE', label: isFr ? 'SYSTÈMES & DISCIPLINES (D07–D16)' : 'TRANSVERSAL SYSTEMS (D07–D16)' },
                { id: 'SAFETY', label: isFr ? 'PROTECTION & SÉCURITÉ (D11/D16)' : 'PROTECTION & SAFETY (D11/D16)' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setFilterGroup(btn.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                    filterGroup === btn.id
                      ? 'border-[#D7A64A] bg-[#D7A64A]/15 text-[#D7A64A]'
                      : 'border-[#567A87]/30 bg-[#0B0F12] text-[#A9ADA5] hover:text-[#F4F1E8]'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A9ADA5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isFr
                    ? 'Filtrer (ex: D04, poste, protection, terre...)'
                    : 'Filter domains (e.g. D04, substation, relay, earthing...)'
                }
                className="w-full bg-[#0B0F12] border border-[#567A87]/40 focus:border-[#D7A64A] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#F4F1E8] font-mono placeholder:text-[#A9ADA5]/60 outline-none transition-colors"
              />
            </div>
          </div>
        )}
      </header>

      {/* MATRIX VIEW OR DOMAIN DIRECTORY */}
      {viewLayout === 'MATRIX' ? (
        <DomainRelationshipMatrix
          locale={locale}
          activeDomainCode={activeDomainCode || 'D04'}
          onSelectDomain={onSelectDomain}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
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
                className={`relative rounded-2xl border p-5 transition-all duration-150 cursor-pointer group shadow-md flex flex-col justify-between overflow-hidden hover:-translate-y-0.5 ${
                  isActive
                    ? 'border-[#D7A64A] bg-[#1A2326] ring-1 ring-[#D7A64A]'
                    : 'border-[#567A87]/30 bg-[#151C1E] hover:border-[#D7A64A]/70'
                }`}
              >
                {isActive && <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D7A64A]" />}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#0B0F12] text-[#D7A64A] border border-[#D7A64A]/40">
                        {dom.code}
                      </span>
                      {maturity && (
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#0B0F12] text-[#A9ADA5] border border-[#567A87]/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>6 {isFr ? 'Sous-domaines' : 'Subdomains'}</span>
                        </span>
                      )}
                    </div>

                    {isSafetyDomain ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-red-300 font-bold uppercase tracking-wider bg-red-950/60 px-2 py-0.5 rounded border border-red-800/70">
                        <ShieldAlert className="h-3 w-3" />
                        <span>{isFr ? 'SÉCURITÉ & PROTECTION' : 'PROTECTION & SAFETY'}</span>
                      </span>
                    ) : isChain ? (
                      <span className="text-[10px] font-mono text-[#D7A64A] font-bold uppercase tracking-wider bg-[#0B0F12] px-2 py-0.5 rounded border border-[#567A87]/30">
                        {isFr ? `CHAÎNE #${dom.chain_position}` : `CHAIN STAGE #${dom.chain_position}`}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#567A87] font-bold uppercase tracking-wider">
                        {isFr ? 'SYSTÈME TRANSVERSAL' : 'TRANSVERSAL SYSTEM'}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-[#F4F1E8] group-hover:text-[#D7A64A] transition-colors leading-snug">
                    {isFr ? dom.name_fr : dom.name_en}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A9ADA5] mt-2 line-clamp-3 leading-relaxed">
                    {isFr ? dom.description_fr : dom.description_en}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#567A87]/20 flex items-center justify-between text-xs font-mono font-bold">
                  <span className="flex items-center gap-1.5 text-[#A9ADA5] group-hover:text-[#F4F1E8]">
                    <BookOpen className="w-3.5 h-3.5 text-[#D7A64A]" />
                    <span>
                      {isFr ? 'Principes, Matériels & Schémas' : 'Principles, Apparatus & Diagrams'}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#D7A64A]">
                    <span>{isFr ? 'Explorer' : 'Explore'}</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* 5 Cross-Cutting Architectural Layers (Completing the 21-Pillar Knowledge Foundation) */}
      <section className="rounded-2xl border border-[#567A87]/30 bg-[#151C1E] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#567A87]/25 pb-3">
          <div>
            <span className="font-mono text-xs font-bold uppercase text-[#567A87]">
              {isFr ? 'COUCHES TRANSVERSALES L01–L05' : 'CROSS-CUTTING FOUNDATIONS (L01–L05)'}
            </span>
            <h2 className="text-lg font-bold text-[#F4F1E8]">
              {isFr
                ? '5 Fondations qui relient les 16 Domaines Techniques'
                : '5 Cross-Cutting Foundations Connecting All 16 Engineering Domains'}
            </h2>
          </div>
          <span className="font-mono text-xs text-[#A9ADA5]">
            {isFr ? 'Architecture à 21 Piliers (16 + 5)' : '21-Pillar Knowledge Architecture (16 + 5)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {LAYERS.map((layer) => (
            <div
              key={layer.code}
              className="p-4 rounded-xl bg-[#0B0F12] border border-[#567A87]/25 space-y-1.5"
            >
              <div className="font-mono text-xs font-bold text-[#D7A64A]">{layer.code}</div>
              <div className="font-bold text-sm text-[#F4F1E8]">
                {isFr ? layer.name_fr : layer.name_en}
              </div>
              <p className="text-xs text-[#A9ADA5] leading-relaxed">
                {isFr ? layer.description_fr : layer.description_en}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
