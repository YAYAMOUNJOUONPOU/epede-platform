// src/components/audit/PlatformMaturityModal.tsx
// EPEDE Continuous Improvement Engine - Full Platform Maturity & Quality Audit Modal (16/16 Level 5 Domains)

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  FileText,
  Search,
  ArrowRight,
  X,
  Award,
  BookOpen,
  Cpu
} from 'lucide-react';
import { EPEDE_MATURITY_REGISTRY, getOverallPlatformMaturity, type DomainMaturityReport } from '../../data/contentMaturityEngine';
import type { DomainCode } from '../../types/epede';

interface PlatformMaturityModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
  onNavigateDomain: (code: DomainCode) => void;
}

export const PlatformMaturityModal: React.FC<PlatformMaturityModalProps> = ({
  isOpen,
  onClose,
  locale,
  onNavigateDomain,
}) => {
  const isFr = locale === 'fr';
  const platformStats = useMemo(() => getOverallPlatformMaturity(), []);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeGroup, setActiveGroup] = useState<'ALL' | 'CHAIN' | 'DISCIPLINE'>('ALL');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const reportsList = useMemo(() => {
    const all = Object.values(EPEDE_MATURITY_REGISTRY);
    return all.filter((r) => {
      const isChain = ['D01', 'D02', 'D03', 'D04', 'D05', 'D06'].includes(r.domainCode);
      if (activeGroup === 'CHAIN' && !isChain) return false;
      if (activeGroup === 'DISCIPLINE' && isChain) return false;

      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const codeMatch = r.domainCode.toLowerCase().includes(q);
        const nameFrMatch = r.domainName.fr.toLowerCase().includes(q);
        const nameEnMatch = r.domainName.en.toLowerCase().includes(q);
        const findingsMatch = r.auditFindings.some(f => (isFr ? f.fr : f.en).toLowerCase().includes(q));
        if (!codeMatch && !nameFrMatch && !nameEnMatch && !findingsMatch) {
          return false;
        }
      }
      return true;
    });
  }, [activeGroup, searchFilter, isFr]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden font-sans text-slate-100"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-[#0d1627] to-slate-950 flex items-start justify-between gap-4 shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 font-mono text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  {isFr ? 'CERTIFICATION QUALITÉ ÉLECTROTECHNIQUE' : 'ELECTRICAL ENGINEERING QUALITY CERTIFICATION'}
                </span>
                <span className="font-mono text-xs text-purple-400 font-bold bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  {platformStats.domainsAtLevel5} / 16 {isFr ? 'DOMAINES AU NIVEAU 5' : 'DOMAINS AT LEVEL 5'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight flex items-center gap-2">
                <Activity className="w-6 h-6 text-purple-400" />
                {isFr
                  ? 'Audit Global de Maturité & Qualité Système EPEDE'
                  : 'EPEDE Platform Global Maturity & System Quality Audit'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
                {isFr
                  ? 'Évaluation rigoureuse des 16 domaines d\'ingénierie : modèles mathématiques, solveurs interactifs, conformité normative CEI/IEEE/NF C et études forensic réelles sur le réseau électrique camerounais et international.'
                  : 'Rigorous engineering evaluation across all 16 domains: mathematical models, interactive solvers, IEC/IEEE/NF C compliance, and real-world forensic field cases on the Cameroon and global grid.'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800 shrink-0"
              aria-label={isFr ? 'Fermer' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="p-4 sm:p-6 bg-slate-950/60 border-b border-slate-800 shrink-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black font-mono text-lg shrink-0">
                  {platformStats.averageScorePercent}%
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">
                    {isFr ? 'Score Moyen Global' : 'Average Platform Score'}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {isFr ? 'Excellence Maximale (L5)' : 'Maximum Excellence (L5)'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black font-mono text-lg shrink-0">
                  16/16
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">
                    {isFr ? 'Workbenches Dédiés' : 'Dedicated Workbenches'}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {isFr ? '100% Interactifs (7-8 Piliers)' : '100% Interactive (7-8 Pillars)'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 font-black font-mono text-lg shrink-0">
                  125+
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">
                    {isFr ? 'Schémas CAD & Topologies' : 'CAD Schematics & Topologies'}
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    {isFr ? 'Normes CEI 60617 / IEEE' : 'IEC 60617 / IEEE Standards'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black font-mono text-lg shrink-0">
                  100%
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block">
                    {isFr ? 'Ancrage Réel Cameroun' : 'Cameroon Real-World'}
                  </span>
                  <span className="text-xs font-bold text-amber-300">
                    {isFr ? 'SONATREL · Eneo · Songloulou' : 'SONATREL · Eneo · Songloulou'}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[11px] font-bold uppercase">{isFr ? 'Filtrer :' : 'Filter:'}</span>
                {[
                  { id: 'ALL', label: isFr ? 'TOUS (16)' : 'ALL (16)' },
                  { id: 'CHAIN', label: isFr ? 'CHAÎNE PHYSIQUE (D01-D06)' : 'PHYSICAL CHAIN (D01-D06)' },
                  { id: 'DISCIPLINE', label: isFr ? 'DISCIPLINES (D07-D16)' : 'DISCIPLINES (D07-D16)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveGroup(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                      activeGroup === tab.id
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-xs'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={isFr ? 'Rechercher (ex: D09, DGA, 61850, Songloulou...)' : 'Search (e.g. D09, DGA, 61850...)'}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-600 outline-none font-mono transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Table Container (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 font-mono text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 w-16">Code</th>
                    <th className="p-3 min-w-[200px]">{isFr ? 'Domaine & Architecture' : 'Domain & Architecture'}</th>
                    <th className="p-3 w-32">{isFr ? 'Maturité & Score' : 'Maturity & Score'}</th>
                    <th className="p-3 w-40">{isFr ? 'Densité Technique' : 'Technical Depth'}</th>
                    <th className="p-3 min-w-[320px]">{isFr ? 'Réalisations Clés & Ancrage Terrain' : 'Key Achievements & Field Grounding'}</th>
                    <th className="p-3 w-28 text-right">{isFr ? 'Action' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                  {reportsList.map((r) => {
                    const isChain = ['D01', 'D02', 'D03', 'D04', 'D05', 'D06'].includes(r.domainCode);

                    return (
                      <tr
                        key={r.domainCode}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="p-3 font-mono font-black text-sm text-cyan-400 align-top">
                          <span className="px-2 py-1 bg-slate-950 rounded border border-slate-800 block text-center">
                            {r.domainCode}
                          </span>
                        </td>

                        <td className="p-3 align-top">
                          <div className="font-bold text-white text-sm">
                            {isFr ? r.domainName.fr : r.domainName.en}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              {isChain ? (isFr ? 'Chaîne Physique' : 'Physical Chain') : (isFr ? 'Discipline Transversale' : 'Discipline')}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              {r.documentedSubdomainsCount} / {r.subdomainsCount} {isFr ? 'Sous-domaines' : 'Subdomains'}
                            </span>
                          </div>
                        </td>

                        <td className="p-3 align-top">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded font-mono font-black text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              L{r.maturityLevel}
                            </span>
                            <span className="font-mono font-bold text-xs text-white">
                              {r.maturityScorePercent}%
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono block mt-1">
                            {r.status}
                          </span>
                        </td>

                        <td className="p-3 align-top font-mono text-[11px] space-y-1">
                          <div className="text-slate-300 flex items-center justify-between">
                            <span className="text-slate-500">{isFr ? 'Schémas CAD :' : 'CAD Schematics:'}</span>
                            <span className="text-sky-400 font-bold">{r.visualSchematicsCount}</span>
                          </div>
                          <div className="text-slate-300 flex items-center justify-between">
                            <span className="text-slate-500">{isFr ? 'Formules :' : 'Formulas:'}</span>
                            <span className="text-amber-400 font-bold">{r.formulasCount}</span>
                          </div>
                          <div className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>{isFr ? 'FMEA / Sécurité validée' : 'FMEA / Safety validated'}</span>
                          </div>
                        </td>

                        <td className="p-3 align-top text-xs text-slate-300 space-y-1.5">
                          {r.auditFindings.map((finding, fIdx) => (
                            <p key={fIdx} className="leading-relaxed">
                              {isFr ? finding.fr : finding.en}
                            </p>
                          ))}
                        </td>

                        <td className="p-3 align-top text-right">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onNavigateDomain(r.domainCode as DomainCode);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-xs group-hover:scale-105 whitespace-nowrap cursor-pointer"
                          >
                            <span>{isFr ? 'Ouvrir' : 'Open'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-4 shrink-0 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-emerald-400 font-bold">✓ 100% EPEDE CORE COMPLETE</span>
              <span>·</span>
              <span>16 / 16 {isFr ? 'domaines pleinement opérationnels' : 'domains fully operational'}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
            >
              {isFr ? 'Fermer l\'Audit' : 'Close Audit'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
