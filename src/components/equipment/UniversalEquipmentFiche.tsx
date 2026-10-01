// src/components/equipment/UniversalEquipmentFiche.tsx
// EPEDE - Fiche Équipement Universelle Standardisée (12 Sections Canoniques)
// Implements Priority #3 of EPEDE Advanced Architecture

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Lock,
  Cpu,
  Globe,
  Wrench,
  BookOpen,
  Gauge,
  Radio,
  HardHat,
  ArrowRight,
  Filter,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Compass,
  Sliders,
  Sparkles
} from 'lucide-react';
import type { CanonicalEquipmentObject } from '../../types/equipmentExplorer';

interface UniversalEquipmentFicheProps {
  canonical: CanonicalEquipmentObject;
  locale: 'fr' | 'en';
  onNavigateEquipment?: (equipmentId: string) => void;
  onNavigateSimulation?: (tab?: string) => void;
  onNavigateStandard?: (ref: string) => void;
  onNavigateCameroonGrid?: () => void;
  onNavigateKnowledgeGraph?: (nodeId: string) => void;
}

export const UniversalEquipmentFiche: React.FC<UniversalEquipmentFicheProps> = ({
  canonical,
  locale,
  onNavigateEquipment,
  onNavigateSimulation,
  onNavigateStandard,
  onNavigateCameroonGrid,
  onNavigateKnowledgeGraph,
}) => {
  const isFr = locale === 'fr';

  // Section Expansion State (Accordion toggles or expand all)
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
    12: true
  });

  const toggleSection = (sectionNum: number) => {
    setExpandedSections((prev) => ({ ...prev, [sectionNum]: !prev[sectionNum] }));
  };

  const expandAll = (expand: boolean) => {
    const next: Record<number, boolean> = {};
    for (let i = 1; i <= 12; i++) {
      next[i] = expand;
    }
    setExpandedSections(next);
  };

  // Quick helper to safely get bilingual text
  const t = (obj?: { fr: string; en: string } | string): string => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return isFr ? obj.fr || obj.en : obj.en || obj.fr;
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* ── TOP FICHE BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-[#0B1528] to-[#040814] p-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{isFr ? 'Fiche Technique Universelle' : 'Universal Technical Datasheet'}</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-400 font-bold">12 / 12 {isFr ? 'Sections Normalisées' : 'Standard Sections'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <span>{t(canonical.name)}</span>
              {canonical.tagIec && (
                <span className="text-sm font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold">
                  {canonical.tagIec}
                </span>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {t(canonical.definition) || t(canonical.purpose)}
            </p>
          </div>

          {/* Quick Header Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => expandAll(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {isFr ? 'Tout Déplier' : 'Expand All'}
            </button>
            <button
              type="button"
              onClick={() => expandAll(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {isFr ? 'Tout Replier' : 'Collapse All'}
            </button>
            {onNavigateKnowledgeGraph && (
              <button
                type="button"
                onClick={() => onNavigateKnowledgeGraph(canonical.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{isFr ? 'Knowledge Graph' : 'Knowledge Graph'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 12 STANDARDIZED SECTIONS (ACCORDION & CARDS) ── */}
      <div className="space-y-4">
        {/* ============================================================== */}
        {/* SECTION 1: IDENTITÉ & FONCTION SYSTÈME */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(1)}
            className="w-full p-4 flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 transition-colors text-left cursor-pointer border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono text-xs font-black flex items-center justify-center border border-amber-500/30">
                01
              </span>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {isFr ? 'Identité & Fonction Système' : 'Identity & System Function'}
                </h2>
                <div className="text-[11px] text-slate-400">
                  {isFr ? 'Rôle dans le réseau, classification et problème résolu' : 'Grid role, categorization, and solved engineering challenge'}
                </div>
              </div>
            </div>
            {expandedSections[1] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSections[1] && (
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-slate-400 text-[10px] uppercase">{isFr ? 'Catégorie' : 'Category'}</div>
                  <div className="text-white font-bold mt-0.5">{canonical.category}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-slate-400 text-[10px] uppercase">{isFr ? 'Tension Assignée' : 'Nominal Voltage'}</div>
                  <div className="text-amber-400 font-bold mt-0.5">{canonical.voltageContext?.nominalVoltage || 'N/A'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-slate-400 text-[10px] uppercase">{isFr ? 'Domaine Parent' : 'Parent Domain'}</div>
                  <div className="text-cyan-400 font-bold mt-0.5">{canonical.parentDomain}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-slate-400 text-[10px] uppercase">{isFr ? 'Palier Réseau' : 'System Stage'}</div>
                  <div className="text-purple-400 font-bold mt-0.5">{canonical.systemStage}</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-slate-300 font-medium">
                  <span className="text-amber-400 font-bold font-mono uppercase text-[11px]">
                    {isFr ? 'Fonction Principale : ' : 'Primary Function: '}
                  </span>
                  {t(canonical.primaryFunction)}
                </div>
                {canonical.engineeringProblemSolved && (
                  <div className="text-slate-400">
                    <span className="text-cyan-400 font-bold font-mono uppercase text-[11px]">
                      {isFr ? 'Problème Résolu : ' : 'Problem Solved: '}
                    </span>
                    {t(canonical.engineeringProblemSolved)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: SCHÉMA & SYMBOLE NORMALISÉ */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(2)}
            className="w-full p-4 flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 transition-colors text-left cursor-pointer border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono text-xs font-black flex items-center justify-center border border-cyan-500/30">
                02
              </span>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {isFr ? 'Schéma Électrique & Symbole Normalisé' : 'Electrical Schematic & Standard Symbol'}
                </h2>
                <div className="text-[11px] text-slate-400">
                  {isFr ? 'Symbole unifilaire CEI 60617 et repérage fonctionnel' : 'IEC 60617 SLD graphic symbol and functional designation'}
                </div>
              </div>
            </div>
            {expandedSections[2] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSections[2] && (
            <div className="p-5 flex flex-col md:flex-row items-center gap-6">
              {/* Graphic Vector Symbol Box */}
              <div className="w-44 h-44 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col items-center justify-center p-4 text-center shrink-0">
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-2">
                  <Activity className="w-10 h-10" />
                </div>
                <div className="text-[11px] font-mono font-bold text-white">CEI 60617</div>
                <div className="text-[10px] font-mono text-cyan-300">{canonical.tagIec || 'TAG-SYS'}</div>
              </div>

              <div className="space-y-3 flex-1 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="font-mono text-slate-400 text-[10px] uppercase">
                    {isFr ? 'Principe de Fonctionnement Électrique' : 'Electrical Operating Principle'}
                  </div>
                  <div className="text-slate-200 leading-relaxed">
                    {t(canonical.operatingPrincipleSummary)}
                  </div>
                </div>

                {canonical.workingPrincipleSequence && canonical.workingPrincipleSequence.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="font-mono text-[10px] text-amber-400 uppercase font-bold">
                      {isFr ? 'Séquence Physique Dynamique :' : 'Dynamic Physical Sequence:'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {canonical.workingPrincipleSequence.slice(0, 4).map((step, sIdx) => (
                        <div key={sIdx} className="p-2 rounded-lg bg-slate-900/40 border border-white/5 flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {step.stepNumber}
                          </span>
                          <div>
                            <div className="font-bold text-white text-[11px]">{t(step.title)}</div>
                            <div className="text-[10px] text-slate-400 line-clamp-2">{t(step.description)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 3: GRANDEURS NOMINALES & PLAQUE SIGNALÉTIQUE */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(3)}
            className="w-full p-4 flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 transition-colors text-left cursor-pointer border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs font-black flex items-center justify-center border border-emerald-500/30">
                03
              </span>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {isFr ? 'Grandeurs Nominales & Plaque Signalétique' : 'Rated Ratings & Nameplate Parameters'}
                </h2>
                <div className="text-[11px] text-slate-400">
                  {isFr ? 'Valeurs assignées, tenue aux courts-circuits et niveaux d’isolement' : 'Rated characteristics, short-circuit withstand, and insulation levels'}
                </div>
              </div>
            </div>
            {expandedSections[3] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSections[3] && (
            <div className="p-5 space-y-4">
              {/* Nameplate-style table */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {canonical.keyEngineeringValues.map((val, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-0.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wide truncate">
                      {typeof val.label === 'string' ? val.label : t(val.label)}
                    </div>
                    <div className="text-lg font-black font-mono text-white flex items-baseline gap-1">
                      <span>{val.value}</span>
                      {val.unit && <span className="text-xs text-cyan-400 font-semibold">{val.unit}</span>}
                    </div>
                    <div className="text-[9px] font-mono text-emerald-400">
                      {val.status || 'VERIFIED'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 4: COMPOSANTS INTERNES & MATÉRIAUX */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(4)}
            className="w-full p-4 flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 transition-colors text-left cursor-pointer border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 font-mono text-xs font-black flex items-center justify-center border border-purple-500/30">
                04
              </span>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {isFr ? 'Composants Internes & Matériaux' : 'Internal Subassemblies & Materials'}
                </h2>
                <div className="text-[11px] text-slate-400">
                  {isFr ? 'Nomenclature constructive des pièces maîtresses et technologies d’isolation' : 'Constructive bill-of-materials and insulation technologies'}
                </div>
              </div>
            </div>
            {expandedSections[4] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSections[4] && (
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {canonical.componentsAndSubassemblies.map((part) => (
                  <div key={part.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{t(part.name)}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        part.criticality === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        part.criticality === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {part.criticality}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{t(part.function)}</p>
                    {part.materialOrTechnology && (
                      <div className="text-[10px] font-mono text-purple-400">
                        {part.materialOrTechnology}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 5: PROTECTIONS ASSOCIÉES & SEUILS TYPES */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(5)}
            className="w-full p-4 flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 transition-colors text-left cursor-pointer border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 font-mono text-xs font-black flex items-center justify-center border border-red-500/30">
                05
              </span>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {isFr ? 'Protections Associées & Seuils Types' : 'Associated Protective Relays & Typical Settings'}
                </h2>
                <div className="text-[11px] text-slate-400">
                  {isFr ? 'Codes ANSI/IEEE, sélectivité ampèremétrique et chronométrique' : 'ANSI/IEEE codes, current thresholds, and time coordination'}
                </div>
              </div>
            </div>
            {expandedSections[5] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSections[5] && (
            <div className="p-5 space-y-3">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex items-start gap-3 text-xs">
                <ShieldCheck className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-white font-mono uppercase">
                    {isFr ? 'Philosophie de Protection de l’Appareil' : 'Apparatus Protection Philosophy'}
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {t(canonical.protectionAndSafety?.primaryProtections) || 
                      (isFr 
                        ? 'Protection principale assurée par différentielle (ANSI 87), complétée par une protection de secours à maximum de courant à temps dépendant (ANSI 51/51N) et déclencheur mécanique instantané.'
                        : 'Primary protection via differential scheme (ANSI 87), backed up by time-overcurrent relays (ANSI 51/51N) and mechanical pressure trip.')}
                  </p>
                </div>
              </div>

              {/* Typical ANSI Relay List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-red-400 font-black text-sm">ANSI 87 / 87T</span>
                  <div className="text-white font-bold text-[11px]">{isFr ? 'Différentielle' : 'Differential'}</div>
                  <div className="text-[10px] text-slate-400">{isFr ? 'Seuil Id > 0.2 In, t = 0 ms' : 'Setting Id > 0.2 In, t = 0 ms'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-amber-400 font-black text-sm">ANSI 50 / 51</span>
                  <div className="text-white font-bold text-[11px]">{isFr ? 'Max de Courant' : 'Overcurrent'}</div>
                  <div className="text-[10px] text-slate-400">{isFr ? 'Courbe CEI Normale Inverse, TMS = 0.15' : 'IEC Standard Inverse Curve, TMS = 0.15'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <span className="text-cyan-400 font-black text-sm">ANSI 49 / 63</span>
                  <div className="text-white font-bold text-[11px]">{isFr ? 'Surcharge Thermique / Gaz' : 'Thermal Image / DGPT2'}</div>
                  <div className="text-[10px] text-slate-400">{isFr ? 'Alarme 90°C, Déclenchement 105°C' : 'Alarm 90°C, Trip 105°C'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 6: MODES DE DÉFAILLANCE & MAINTENANCE (FMEA) */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(6)}
            className="w-full p-4 flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 transition-colors text-left cursor-pointer border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 font-mono text-xs font-black flex items-center justify-center border border-orange-500/30">
                06
              </span>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {isFr ? 'Modes de Défaillance & Maintenance' : 'Failure Modes & Maintenance Strategies'}
                </h2>
                <div className="text-[11px] text-slate-400">
                  {isFr ? 'Analyse FMEA, causes racines, criticité et plans de maintenance préventive' : 'FMEA analysis, root causes, severity, and preventive maintenance'}
                </div>
              </div>
            </div>
            {expandedSections[6] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSections[6] && (
            <div className="p-5 space-y-4">
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/60">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-900 border-b border-white/10 text-slate-400 uppercase text-[10px]">
                      <th className="p-3">{isFr ? 'Mode de Défaillance' : 'Failure Mode'}</th>
                      <th className="p-3">{isFr ? 'Cause Racine' : 'Root Cause'}</th>
                      <th className="p-3">{isFr ? 'Conséquence Réseau' : 'Grid Consequence'}</th>
                      <th className="p-3">{isFr ? 'Réponse' : 'Response'}</th>
                      <th className="p-3">{isFr ? 'Sévérité' : 'Severity'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {canonical.failureModesAndFmea.map((fmea) => (
                      <tr key={fmea.code} className="hover:bg-white/5">
                        <td className="p-3 font-bold text-white">{t(fmea.name)}</td>
                        <td className="p-3 text-slate-300">{t(fmea.rootCause)}</td>
                        <td className="p-3 text-slate-400">{t(fmea.consequenceOnSystem)}</td>
                        <td className="p-3 text-cyan-300">{t(fmea.protectiveResponse)}</td>
                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            fmea.severity === 'CATASTROPHIC' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                            fmea.severity === 'CRITICAL' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                            'bg-amber-500/20 text-amber-300'
                          }`}>
                            {fmea.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 7: SIGNAUX SCADA / TÉLÉCONDUITE */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(7)}
            className="w-full p-4 flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 transition-colors text-left cursor-pointer border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 font-mono text-xs font-black flex items-center justify-center border border-purple-500/30">
                07
              </span>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {isFr ? 'Signaux SCADA / Téléconduite (CEI 61850)' : 'SCADA Telemetry & Control Signals (IEC 61850)'}
                </h2>
                <div className="text-[11px] text-slate-400">
                  {isFr ? 'Points TS, TM, TC et messages rapides GOOSE' : 'Digital status (TS), analogue measurements (TM), controls (TC), and GOOSE messages'}
                </div>
              </div>
            </div>
            {expandedSections[7] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSections[7] && (
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                {/* TS */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold uppercase text-[11px]">
                    <Radio className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Télésignalisations (TS)' : 'Digital Status (TS)'}</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    <li>• Position Ouvert / Fermé (DPI)</li>
                    <li>• Déclenchement sur Défaut (Trip)</li>
                    <li>• Ressort Réarmé / Déchargé</li>
                    <li>• Pression de gaz basse (SF6 / N2)</li>
                    <li>• Sélecteur Local / Distance</li>
                  </ul>
                </div>

                {/* TM */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
                    <Gauge className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Télémesures (TM)' : 'Analogue Values (TM)'}</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    <li>• Courants de phase Ia, Ib, Ic (A)</li>
                    <li>• Tensions Uab, Ubc, Uca (kV)</li>
                    <li>• Puissance Active P (MW) & Réactive Q (Mvar)</li>
                    <li>• Fréquence f (Hz) & Cos φ</li>
                    <li>• Température huile / enroulements (°C)</li>
                  </ul>
                </div>

                {/* TC */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px]">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Télécommandes (TC)' : 'Remote Controls (TC)'}</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    <li>• Ordre d’Ouverture / Déclenchement</li>
                    <li>• Ordre de Fermeture (avec synchro-check 25)</li>
                    <li>• Réarmement des signalisations d’alarmes</li>
                    <li>• Commande du changeur de prises sous charge</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 8: RACCORDEMENT AMONT / AVAL */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(8)}
            className="w-full p-4 flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 transition-colors text-left cursor-pointer border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 font-mono text-xs font-black flex items-center justify-center border border-sky-500/30">
                08
              </span>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {isFr ? 'Raccordement Amont & Aval' : 'Upstream & Downstream Interconnections'}
                </h2>
                <div className="text-[11px] text-slate-400">
                  {isFr ? 'Chaîne de transit de puissance et dépendances électriques' : 'Power transit chain and grid dependencies'}
                </div>
              </div>
            </div>
            {expandedSections[8] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSections[8] && (
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold uppercase text-[11px]">
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>{isFr ? 'Connexions Amont (Alimentation)' : 'Upstream Supply Feeds'}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {canonical.upstreamRelationships?.map(r => t(r.targetName)).join(', ') || 
                      (isFr ? 'Alimenté par le jeu de barres principal ou la ligne amont via sectionneur de tête.' : 'Supplied by main busbar or incoming transmission feeder via disconnector.')}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-mono font-bold uppercase text-[11px]">
                    <ArrowRight className="w-4 h-4" />
                    <span>{isFr ? 'Connexions Aval (Dessertes)' : 'Downstream Loads & Branches'}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {canonical.downstreamRelationships?.map(r => t(r.targetName)).join(', ') || 
                      (isFr ? 'Dessert la travée transformateur, les départs HTA de distribution et les charges terminales.' : 'Feeds step-down transformer bay, MV distribution feeders, and final loads.')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 9: NORMES APPLICABLES */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(9)}
            className="w-full p-4 flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 transition-colors text-left cursor-pointer border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 font-mono text-xs font-black flex items-center justify-center border border-teal-500/30">
                09
              </span>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {isFr ? 'Normes Applicables & Conformité' : 'Applicable International Standards'}
                </h2>
                <div className="text-[11px] text-slate-400">
                  {isFr ? 'Référentiels normatifs CEI, IEEE et exigences de qualification' : 'IEC, IEEE regulatory frameworks and design compliance criteria'}
                </div>
              </div>
            </div>
            {expandedSections[9] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSections[9] && (
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
                {canonical.applicableStandards.map((std, sIdx) => (
                  <div
                    key={sIdx}
                    onClick={() => onNavigateStandard?.(std.standardCode)}
                    className="p-3.5 rounded-xl bg-slate-900/70 border border-white/10 hover:border-teal-500/50 hover:bg-slate-900 transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-300 text-sm">{std.standardCode}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="text-[11px] text-white font-sans line-clamp-1">{std.title}</div>
                    <div className="text-[10px] text-slate-400">{std.jurisdiction || 'International'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 10: LIENS VERS SIMULATEURS EPEDE */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(10)}
            className="w-full p-4 flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 transition-colors text-left cursor-pointer border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 font-mono text-xs font-black flex items-center justify-center border border-pink-500/30">
                10
              </span>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {isFr ? 'Liens vers Simulateurs EPEDE' : 'Direct Gateways to EPEDE Simulators'}
                </h2>
                <div className="text-[11px] text-slate-400">
                  {isFr ? 'Laboratoires virtuels interactifs pour tester le comportement de l’appareil' : 'Interactive virtual labs to test physical apparatus response'}
                </div>
              </div>
            </div>
            {expandedSections[10] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSections[10] && (
            <div className="p-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigateSimulation?.('short_circuit')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500/15 text-pink-300 hover:bg-pink-500/25 border border-pink-500/30 text-xs font-bold font-mono transition-all cursor-pointer"
              >
                <Activity className="w-4 h-4 text-pink-400" />
                <span>{isFr ? 'Simulateur Court-Circuit CEI 60909' : 'IEC 60909 Short-Circuit Lab'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateSimulation?.('protection')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 text-xs font-bold font-mono transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-red-400" />
                <span>{isFr ? 'Banc Protection R-X & TCC' : 'Protection R-X & TCC Workbench'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateSimulation?.('transient')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-bold font-mono transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>{isFr ? 'Oscilloscope DSO Temps Réel (4 Voies)' : 'Live 4-CH DSO Scope'}</span>
              </button>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 11: RÉFÉRENCES INDUSTRIELLES RÉELLES */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(11)}
            className="w-full p-4 flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 transition-colors text-left cursor-pointer border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-mono text-xs font-black flex items-center justify-center border border-indigo-500/30">
                11
              </span>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {isFr ? 'Références Industrielles Réelles' : 'Real-World Industrial OEM Models'}
                </h2>
                <div className="text-[11px] text-slate-400">
                  {isFr ? 'Modèles constructeurs du marché certifiés (Schneider, Siemens, ABB, GE)' : 'Certified commercial vendor series and datasheets'}
                </div>
              </div>
            </div>
            {expandedSections[11] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSections[11] && (
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Schneider Electric</div>
                  <div className="text-white font-bold text-sm">Masterpact MTZ / SM6 36 kV</div>
                  <div className="text-[10px] text-indigo-300">{isFr ? 'Cellule HTA compacte à coupure SF6' : 'MV compact SF6 switchgear'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Siemens Energy</div>
                  <div className="text-white font-bold text-sm">3AP1-DTC / 8DN8 GIS 225 kV</div>
                  <div className="text-[10px] text-indigo-300">{isFr ? 'Disjoncteur cuve morte et poste blindé' : 'Dead-tank circuit breaker & GIS bay'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Hitachi Energy (ABB)</div>
                  <div className="text-white font-bold text-sm">TrafoStar 60 MVA / Relion 670</div>
                  <div className="text-[10px] text-indigo-300">{isFr ? 'Transformateur de puissance & IED CEI 61850' : 'Power transformer & IEC 61850 IED'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 12: CAS PRATIQUE & DÉPLOIEMENT AU CAMEROUN */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection(12)}
            className="w-full p-4 flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 transition-colors text-left cursor-pointer border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs font-black flex items-center justify-center border border-emerald-500/30">
                12
              </span>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  {isFr ? 'Cas Pratique & Déploiement au Cameroun' : 'Real-World Cameroon Field Deployment'}
                </h2>
                <div className="text-[11px] text-slate-400">
                  {isFr ? 'Postes SONATREL / Eneo, contraintes tropicales et retour d’expérience' : 'SONATREL/Eneo substations, tropical climate constraints, and operational field notes'}
                </div>
              </div>
            </div>
            {expandedSections[12] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>

          {expandedSections[12] && (
            <div className="p-5 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-slate-900/70 to-slate-950 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold uppercase text-[11px]">
                    <Compass className="w-4 h-4" />
                    <span>{isFr ? 'Ouvrage Référencé sur le Réseau National' : 'Referenced National Grid Asset'}</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {canonical.cameroonContext?.substationName || 'Poste d’Interconnexion de Bekoko 225/90/30 kV'}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {isFr
                      ? 'Nœud stratégique d’évacuation de l’énergie de Songloulou vers la zone industrielle de Douala (Bassa / Bonabéri).'
                      : 'Critical wheeling node transmitting Songloulou hydro power into the Douala industrial basin.'}
                  </div>
                </div>

                {onNavigateCameroonGrid && (
                  <button
                    type="button"
                    onClick={onNavigateCameroonGrid}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 font-mono font-bold shrink-0 transition-all cursor-pointer"
                  >
                    <span>{isFr ? 'Voir sur le SIG Cameroun' : 'View on Cameroon GIS'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Local Challenges & Tropical Constraints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="text-amber-400 text-[10px] uppercase font-bold">
                    {isFr ? 'Contraintes Climatiques Tropicales' : 'Tropical Climate Factors'}
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans">
                    {isFr
                      ? 'Humidité relative > 85%, indice kéronique élevé (foudroiement fréquent) et salinité atmosphérique côtière.'
                      : 'Relative humidity > 85%, high keraunic lightning density, and maritime salt contamination in Douala area.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                  <div className="text-cyan-400 text-[10px] uppercase font-bold">
                    {isFr ? 'Dispositifs d’Adaptation Locaux' : 'Local Adaptation Measures'}
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans">
                    {isFr
                      ? 'Parafoudres ZnO classe 4 renforcés, résistances de chauffage anti-condensation dans les armoires et tropicalisation des cartes électroniques.'
                      : 'Heavy-duty ZnO surge arresters, anti-condensation heaters in control cabinets, and conformal PCB coating.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
