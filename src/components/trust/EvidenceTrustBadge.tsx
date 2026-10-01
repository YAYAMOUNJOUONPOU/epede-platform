// src/components/trust/EvidenceTrustBadge.tsx
// EPEDE - Universal Evidence & Verification Trust Badge System
// Provides transparent engineering evidence classification across all calculations, dossiers, and diagrams.

import React, { useState } from 'react';
import {
  ShieldCheck,
  BookOpen,
  Wrench,
  Lightbulb,
  Activity,
  Globe,
  Cpu,
  Layers,
  AlertCircle,
  HelpCircle,
  Info,
} from 'lucide-react';
import { EvidenceBadgeType, EvidenceVerificationMeta } from '../../types/contextStack';

export const EVIDENCE_REGISTRY: Record<EvidenceBadgeType, EvidenceVerificationMeta> = {
  VERIFIED_STANDARD: {
    type: 'VERIFIED_STANDARD',
    label: {
      fr: 'NORME VÉRIFIÉE (CEI / IEEE)',
      en: 'VERIFIED STANDARD (IEC / IEEE)',
    },
    shortLabel: { fr: 'CEI/IEEE VÉRIFIÉ', en: 'IEC/IEEE VERIFIED' },
    description: {
      fr: 'Formulation, calage et critères de dimensionnement rigoureusement conformes aux normes internationales publiées.',
      en: 'Formulation, sizing criteria and tolerances strictly conform to published international electrotechnical standards.',
    },
    confidencePercent: 99,
  },
  ENGINEERING_REFERENCE: {
    type: 'ENGINEERING_REFERENCE',
    label: {
      fr: 'RÉFÉRENCE D\'INGÉNIERIE ÉTABLIE',
      en: 'ESTABLISHED ENGINEERING REFERENCE',
    },
    shortLabel: { fr: 'RÉFÉRENCE TECHNIQUE', en: 'ENG. REFERENCE' },
    description: {
      fr: 'Issu d\'ouvrages universitaires de référence (Kundur, Blackburn, Glover) et de guides d\'application CIGRE.',
      en: 'Derived from authoritative peer-reviewed literature (Kundur, Blackburn, Glover) and CIGRE technical brochures.',
    },
    confidencePercent: 95,
  },
  FIELD_PRACTICE: {
    type: 'FIELD_PRACTICE',
    label: {
      fr: 'PRATIQUE D\'EXPLOITATION RÉSEAU',
      en: 'UTILITY FIELD PRACTICE',
    },
    shortLabel: { fr: 'PRATIQUE EXPLOITATION', en: 'FIELD PRACTICE' },
    description: {
      fr: 'Pratique opérationnelle en poste source et dispatching constatée chez les gestionnaires de réseau (SONATREL, RTE, Hydro-Québec).',
      en: 'Operational field and dispatching practices verified across transmission system operators (SONATREL, RTE, Hydro-Quebec).',
    },
    confidencePercent: 92,
  },
  CONCEPTUAL_MODEL: {
    type: 'CONCEPTUAL_MODEL',
    label: {
      fr: 'MODÈLE PÉDAGOGIQUE CONCEPTUEL',
      en: 'CONCEPTUAL EDUCATIONAL MODEL',
    },
    shortLabel: { fr: 'MODÈLE CONCEPTUEL', en: 'CONCEPTUAL MODEL' },
    description: {
      fr: 'Formulation analytique simplifiée destinée à la compréhension intuitive. Requiert une étude par éléments finis ou logiciel certifié pour exécution.',
      en: 'Simplified analytical formulation intended for fundamental intuitive learning. Requires certified numerical tools for construction.',
    },
    confidencePercent: 85,
  },
  SIMULATION: {
    type: 'SIMULATION',
    label: {
      fr: 'SIMULATION NUMÉRIQUE DYNAMIQUE',
      en: 'DYNAMIC NUMERICAL SIMULATION',
    },
    shortLabel: { fr: 'SIMULATION NUMÉRIQUE', en: 'NUMERICAL SIM' },
    description: {
      fr: 'Calcul matriciel itératif en temps réel (Newton-Raphson, CEI 60909, Sélectivité TCC) exécuté dans le navigateur.',
      en: 'Real-time iterative matrix calculation (Newton-Raphson, IEC 60909, TCC Selectivity) computed in-browser.',
    },
    confidencePercent: 94,
  },
  CAMEROON_CONTEXT: {
    type: 'CAMEROON_CONTEXT',
    label: {
      fr: 'RÉSEAU NATIONAL DU CAMEROUN (RIS / RIN)',
      en: 'CAMEROON NATIONAL GRID CONTEXT',
    },
    shortLabel: { fr: 'CONTEXTE CAMEROUN', en: 'CAMEROON CONTEXT' },
    description: {
      fr: 'Paramètres réels calibrés sur le réseau de transport 225 kV / 90 kV SONATREL et les centrales hydroélectriques de la Sanaga (Songloulou, Nachtigal).',
      en: 'Real grid parameters calibrated against SONATREL 225 kV/90 kV network and Sanaga hydropower plants (Songloulou, Nachtigal).',
    },
    confidencePercent: 96,
  },
  MANUFACTURER_SPECIFIC: {
    type: 'MANUFACTURER_SPECIFIC',
    label: {
      fr: 'SPÉCIFICATION CONSTRUCTEUR (OEM)',
      en: 'MANUFACTURER SPECIFIC (OEM)',
    },
    shortLabel: { fr: 'SPÉC. CONSTRUCTEUR', en: 'OEM SPECIFIC' },
    description: {
      fr: 'Caractéristiques basées sur des séries industrielles majeures (Schneider SM6, ABB PASS, Siemens SIPROTEC, GE Multilin).',
      en: 'Characteristics mapped to prominent industrial series (Schneider SM6, ABB PASS, Siemens SIPROTEC, GE Multilin).',
    },
    confidencePercent: 90,
  },
  APPLICATION_DEPENDENT: {
    type: 'APPLICATION_DEPENDENT',
    label: {
      fr: 'DÉPENDANT DES CONDITIONS DE SITE',
      en: 'SITE APPLICATION DEPENDENT',
    },
    shortLabel: { fr: 'DÉPEND DU SITE', en: 'SITE DEPENDENT' },
    description: {
      fr: 'Le dimensionnement final dépend de la résistivité du sol, de l\'altitude, de la température ambiante et du niveau kéraunique.',
      en: 'Final sizing depends on soil resistivity, altitude, ambient temperature, and local keraunic lightning density.',
    },
    confidencePercent: 88,
  },
  REQUIRES_VALIDATION: {
    type: 'REQUIRES_VALIDATION',
    label: {
      fr: 'VALIDATION SITE REQUISE',
      en: 'REQUIRES SITE COMMISSIONING VALIDATION',
    },
    shortLabel: { fr: 'À VALIDER SUR SITE', en: 'NEEDS VALIDATION' },
    description: {
      fr: 'Nécessite des essais de mise en service (injection primaire/secondaire, rigidité diélectrique) avant mise sous tension.',
      en: 'Requires commissioning tests (primary/secondary injection, dielectric withstand) prior to final energization.',
    },
    confidencePercent: 80,
  },
  SOURCE_GAP: {
    type: 'SOURCE_GAP',
    label: {
      fr: 'LIMITE DE DONNÉE DÉCLARÉE',
      en: 'DECLARED SOURCE GAP',
    },
    shortLabel: { fr: 'DONNÉE NON FOURNIE', en: 'DATA GAP' },
    description: {
      fr: 'Paramètre technique non spécifié par le constructeur ou en attente d\'audit terrain.',
      en: 'Technical parameter unspecified by manufacturer or awaiting field survey confirmation.',
    },
    confidencePercent: 65,
  },
};

interface EvidenceTrustBadgeProps {
  type: EvidenceBadgeType;
  locale: 'fr' | 'en';
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  governingStandard?: string;
  sourceReference?: string;
  className?: string;
}

export const EvidenceTrustBadge: React.FC<EvidenceTrustBadgeProps> = ({
  type,
  locale,
  size = 'md',
  showDetails = false,
  governingStandard,
  sourceReference,
  className = '',
}) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const meta = EVIDENCE_REGISTRY[type] || EVIDENCE_REGISTRY.VERIFIED_STANDARD;

  const getBadgeStyle = (bType: EvidenceBadgeType) => {
    switch (bType) {
      case 'VERIFIED_STANDARD':
        return {
          bg: 'bg-emerald-950/80',
          border: 'border-emerald-500/50 hover:border-emerald-400',
          text: 'text-emerald-300',
          iconColor: 'text-emerald-400',
          Icon: ShieldCheck,
        };
      case 'ENGINEERING_REFERENCE':
        return {
          bg: 'bg-sky-950/80',
          border: 'border-sky-500/50 hover:border-sky-400',
          text: 'text-sky-300',
          iconColor: 'text-sky-400',
          Icon: BookOpen,
        };
      case 'FIELD_PRACTICE':
        return {
          bg: 'bg-amber-950/80',
          border: 'border-amber-500/50 hover:border-amber-400',
          text: 'text-amber-300',
          iconColor: 'text-amber-400',
          Icon: Wrench,
        };
      case 'CONCEPTUAL_MODEL':
        return {
          bg: 'bg-purple-950/80',
          border: 'border-purple-500/50 hover:border-purple-400',
          text: 'text-purple-300',
          iconColor: 'text-purple-400',
          Icon: Lightbulb,
        };
      case 'SIMULATION':
        return {
          bg: 'bg-cyan-950/80',
          border: 'border-cyan-500/50 hover:border-cyan-400',
          text: 'text-cyan-300',
          iconColor: 'text-cyan-400',
          Icon: Activity,
        };
      case 'CAMEROON_CONTEXT':
        return {
          bg: 'bg-teal-950/80',
          border: 'border-teal-500/50 hover:border-teal-400',
          text: 'text-teal-300',
          iconColor: 'text-teal-400',
          Icon: Globe,
        };
      case 'MANUFACTURER_SPECIFIC':
        return {
          bg: 'bg-blue-950/80',
          border: 'border-blue-500/50 hover:border-blue-400',
          text: 'text-blue-300',
          iconColor: 'text-blue-400',
          Icon: Cpu,
        };
      case 'APPLICATION_DEPENDENT':
        return {
          bg: 'bg-orange-950/80',
          border: 'border-orange-500/50 hover:border-orange-400',
          text: 'text-orange-300',
          iconColor: 'text-orange-400',
          Icon: Layers,
        };
      case 'REQUIRES_VALIDATION':
        return {
          bg: 'bg-yellow-950/80',
          border: 'border-yellow-500/50 hover:border-yellow-400',
          text: 'text-yellow-300',
          iconColor: 'text-yellow-400',
          Icon: AlertCircle,
        };
      case 'SOURCE_GAP':
        return {
          bg: 'bg-rose-950/80',
          border: 'border-rose-500/50 hover:border-rose-400',
          text: 'text-rose-300',
          iconColor: 'text-rose-400',
          Icon: HelpCircle,
        };
    }
  };

  const style = getBadgeStyle(type);
  const IconComponent = style.Icon;

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  }[size];

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => setIsTooltipOpen(!isTooltipOpen)}
        onMouseEnter={() => setIsTooltipOpen(true)}
        onMouseLeave={() => setIsTooltipOpen(false)}
        className={`inline-flex items-center rounded-lg border font-mono font-bold transition-all shadow-xs ${style.bg} ${style.border} ${style.text} ${sizeClasses} cursor-help`}
        aria-label={meta.label[locale]}
      >
        <IconComponent className={`${iconSizes} ${style.iconColor} shrink-0`} />
        <span>{size === 'sm' ? meta.shortLabel[locale] : meta.label[locale]}</span>
        <span className="opacity-60 text-[9px] ml-0.5">{meta.confidencePercent}%</span>
      </button>

      {/* Trust & Evidence Tooltip Drawer */}
      {isTooltipOpen && (
        <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-xl bg-slate-950/95 border border-slate-700 shadow-2xl p-3.5 z-50 text-left font-mono text-xs backdrop-blur-md animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <IconComponent className={`h-4 w-4 ${style.iconColor}`} />
              <span className="text-[11px]">{meta.label[locale]}</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}>
              {meta.confidencePercent}% {locale === 'fr' ? 'Confiance' : 'Confidence'}
            </span>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed font-sans mb-2.5">
            {meta.description[locale]}
          </p>

          {(governingStandard || meta.governingStandard) && (
            <div className="text-[10px] text-slate-400 bg-slate-900/90 p-1.5 rounded border border-slate-800 mb-1.5 flex items-center justify-between">
              <span className="text-slate-500 font-bold">{locale === 'fr' ? 'Norme :' : 'Standard:'}</span>
              <span className="text-amber-300 font-bold">{governingStandard || meta.governingStandard}</span>
            </div>
          )}

          {(sourceReference || meta.sourceReference) && (
            <div className="text-[10px] text-slate-400 bg-slate-900/90 p-1.5 rounded border border-slate-800 flex items-center justify-between">
              <span className="text-slate-500 font-bold">{locale === 'fr' ? 'Source :' : 'Source:'}</span>
              <span className="text-sky-300 truncate max-w-[180px]">{sourceReference || meta.sourceReference}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
