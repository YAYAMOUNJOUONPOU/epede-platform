// src/components/context/AssumptionsLimitationsCard.tsx
// EPEDE Phase 3 - Assumptions, Model Limitations & Verification Disclaimers Panel
// Clarifies verified standards vs. conceptual models vs. site-specific dependencies.

import React, { useState } from 'react';
import {
  AlertTriangle,
  FileCheck2,
  Sliders,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
  Scale,
  Sparkles,
  Calculator
} from 'lucide-react';
import { EvidenceTrustBadge } from '../equipment/EvidenceTrustBadge';
import type { EvidenceTrustLevel } from '../../types/engineeringIntelligenceExtensions';

interface AssumptionsLimitationsCardProps {
  titleFr?: string;
  titleEn?: string;
  isCalculator?: boolean;
  domainCode?: string;
  equipmentId?: string;
  locale?: 'fr' | 'en';
  verifiedPoints?: string[];
  representativeAssumptions?: string[];
  projectSpecificDependencies?: string[];
  modelLimitations?: string[];
}

export const AssumptionsLimitationsCard: React.FC<AssumptionsLimitationsCardProps> = ({
  titleFr,
  titleEn,
  isCalculator = false,
  domainCode,
  equipmentId,
  locale = 'fr',
  verifiedPoints,
  representativeAssumptions,
  projectSpecificDependencies,
  modelLimitations
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const isFr = locale === 'fr';

  const defaultVerified = isFr ? [
    'Équations fondamentales électrotechniques basées sur les normes CEI 60076, CEI 60909 et IEEE Std 80.',
    'Constantes physiques de l\'eau, résistivités du cuivre/aluminium et impédances normalisées.',
    'Matrices de déclenchement ANSI et temporisations de coordination sélective.'
  ] : [
    'Fundamental electrotechnical equations based on IEC 60076, IEC 60909 and IEEE Std 80.',
    'Physical water constants, copper/aluminum conductor resistivities and standardized impedances.',
    'ANSI trip matrices and selective protection grading margins.'
  ];

  const defaultRepresentative = isFr ? [
    'Topologie architecturale représentative d\'un poste type 225/30 kV du Réseau Interconnecté Sud (RIS).',
    'Longueurs moyennes de liaisons aériennes (ex. 120 km) et profils thermiques moyens en climat tropical.',
    'Facteurs de simultanéité et charges industrielles typiques.'
  ] : [
    'Representative architectural topology of a 225/30 kV substation on the Cameroon Southern Interconnected Grid (RIS).',
    'Average overhead transmission line lengths (e.g. 120 km) and tropical ambient temperature derating.',
    'Typical industrial diversity factors and load profiles.'
  ];

  const defaultDependencies = isFr ? [
    'Résistivité réelle du sol sur site (mesure Wenner 4 piquets obligatoire pour IEEE 80).',
    'Tenue diélectrique de l\'huile minérale (analyse DGA et rigidité diélectrique en laboratoire accrédité).',
    'Pouvoir de coupure assigné des disjoncteurs selon étude de court-circuit contractuelle.'
  ] : [
    'Site-measured soil resistivity (4-pin Wenner test mandatory for IEEE 80 grounding design).',
    'Transformer oil dielectric condition (certified DGA lab tests).',
    'Breaker rated breaking capacity to be confirmed by formal project-specific fault study.'
  ];

  const defaultLimitations = isFr ? [
    'Modèle pédagogique en régime permanent sinusoïdal équilibré (ne remplace pas les simulations EMT / DIgSILENT / ETAP).',
    'Non destiné à servir de note de calcul d\'exécution contractuelle sans visa d\'un ingénieur certifié.'
  ] : [
    'Educational steady-state balanced sinusoidal model (does not substitute for certified EMT / DIgSILENT / ETAP studies).',
    'Not intended as execution contract calculation notes without certification by a licensed professional engineer.'
  ];

  const verifiedList = verifiedPoints || defaultVerified;
  const representativeList = representativeAssumptions || defaultRepresentative;
  const dependenciesList = projectSpecificDependencies || defaultDependencies;
  const limitationsList = modelLimitations || defaultLimitations;

  return (
    <div className="rounded-2xl border border-amber-900/40 bg-[#0B0E14] overflow-hidden shadow-xl font-sans text-slate-200">
      
      {/* Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-3.5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-b border-amber-900/30 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-amber-950/50"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                {isFr ? 'CADRE DE VALIDITÉ TECHNIQUE & LIMITATIONS' : 'TECHNICAL VALIDITY & ASSUMPTIONS MANIFEST'}
              </span>
              <EvidenceTrustBadge level="APPLICATION_DEPENDENT" locale={locale} size="xs" />
            </div>
            <h4 className="text-sm font-bold text-white font-mono">
              {titleFr ? (isFr ? titleFr : titleEn) : (isFr ? 'Hypothèses de Calcul, Périmètre & Données Vérifiées' : 'Calculation Assumptions, Scope & Verified Data')}
            </h4>
          </div>
        </div>

        <button 
          type="button"
          className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white"
          title={isExpanded ? 'Réduire' : 'Déplier'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Calculator Prominent Warning Banner if applicable */}
      {isCalculator && (
        <div className="px-5 py-2.5 bg-amber-950/60 border-b border-amber-800/40 flex items-center gap-2 text-xs text-amber-200 font-mono">
          <Calculator className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>{isFr ? 'CALCUL D\'INGÉNIERIE CONCEPTUEL :' : 'CONCEPTUAL ENGINEERING CALCULATION :'}</strong>{' '}
            {isFr
              ? 'Résultat indicatif de prédimensionnement. Non certifié pour exécution contractuelle sans revue d\'ingénierie.'
              : 'Indicative sizing output. Not a certified design output. Engineering review required where applicable.'}
          </span>
        </div>
      )}

      {/* Expanded Grid Body */}
      {isExpanded && (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Section 1: Verified Data */}
          <div className="p-4 rounded-xl bg-[#0F141F] border border-emerald-900/30 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-emerald-900/20">
              <span className="font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" />
                {isFr ? 'Données & Normes Vérifiées' : 'Verified Data & Standards'}
              </span>
              <EvidenceTrustBadge level="VERIFIED_STANDARD" locale={locale} size="xs" />
            </div>
            <ul className="space-y-1.5 text-slate-300">
              {verifiedList.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Representative Model Assumptions */}
          <div className="p-4 rounded-xl bg-[#0F141F] border border-cyan-900/30 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-cyan-900/20">
              <span className="font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {isFr ? 'Hypothèses de Modèle Représentatif' : 'Representative Model Assumptions'}
              </span>
              <EvidenceTrustBadge level="CONCEPTUAL_MODEL" locale={locale} size="xs" />
            </div>
            <ul className="space-y-1.5 text-slate-300">
              {representativeList.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Project-Specific Dependencies */}
          <div className="p-4 rounded-xl bg-[#0F141F] border border-purple-900/30 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-purple-900/20">
              <span className="font-mono font-bold text-purple-300 uppercase flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                {isFr ? 'Paramètres Dépendants du Projet' : 'Project-Specific Dependencies'}
              </span>
              <EvidenceTrustBadge level="APPLICATION_DEPENDENT" locale={locale} size="xs" />
            </div>
            <ul className="space-y-1.5 text-slate-300">
              {dependenciesList.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Engineering Limitations & Safeguards */}
          <div className="p-4 rounded-xl bg-[#0F141F] border border-amber-900/30 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-amber-900/20">
              <span className="font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {isFr ? 'Limites & Réserve d\'Ingénierie' : 'Limitations & Engineering Disclaimer'}
              </span>
              <EvidenceTrustBadge level="REQUIRES_VALIDATION" locale={locale} size="xs" />
            </div>
            <ul className="space-y-1.5 text-slate-300">
              {limitationsList.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">⚠️</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
};
