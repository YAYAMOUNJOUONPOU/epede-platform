// src/components/equipment/EvidenceTrustBadge.tsx
// EPEDE - 10-Tier Evidence, Trust & Verification Badge System
// Displays standardized trust levels with interactive popover explanations

import React, { useState } from 'react';
import {
  CheckCircle2,
  BookOpen,
  Wrench,
  Sparkles,
  Cpu,
  MapPin,
  Building,
  Sliders,
  AlertCircle,
  HelpCircle,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import type { EvidenceTrustLevel, EvidenceTrustBadgeConfig } from '../../types/engineeringIntelligenceExtensions';

interface EvidenceTrustBadgeProps {
  level: EvidenceTrustLevel;
  referenceSource?: string;
  locale?: 'fr' | 'en';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  onOpenFullMatrix?: () => void;
}

export const EVIDENCE_BADGE_CONFIGS: Record<EvidenceTrustLevel, EvidenceTrustBadgeConfig> = {
  VERIFIED_STANDARD: {
    level: 'VERIFIED_STANDARD',
    label_fr: 'Norme Vérifiée',
    label_en: 'Verified Standard',
    short_fr: 'Norme CEI/IEEE',
    short_en: 'IEC/IEEE Std',
    description_fr: 'Directement étayé par une norme internationale ou un code réseau officiel en vigueur (ex. CEI 60076, IEEE C37, Code SONATREL).',
    description_en: 'Directly backed by an active international standard or official grid code (e.g. IEC 60076, IEEE C37, SONATREL Code).',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    iconName: 'CheckCircle2'
  },
  ENGINEERING_REFERENCE: {
    level: 'ENGINEERING_REFERENCE',
    label_fr: 'Référence d\'Ingénierie',
    label_en: 'Engineering Reference',
    short_fr: 'Réf. Ingénierie',
    short_en: 'Eng. Reference',
    description_fr: 'Information technique établie et admise par l\'état de l\'art du génie électrique (littérature CIGRE, manuels de référence).',
    description_en: 'Established technical knowledge accepted across power engineering state-of-the-art (CIGRE brochures, engineering handbooks).',
    color: '#38BDF8',
    bgColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    iconName: 'BookOpen'
  },
  FIELD_PRACTICE: {
    level: 'FIELD_PRACTICE',
    label_fr: 'Pratique Courante Terrain',
    label_en: 'Field Practice',
    short_fr: 'Pratique Terrain',
    short_en: 'Field Practice',
    description_fr: 'Démarche d\'exploitation et de maintenance couramment appliquée sur le terrain par les équipes de réseau et de centrale.',
    description_en: 'Operational and maintenance practice routinely implemented by utility field technicians and plant operators.',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    iconName: 'Wrench'
  },
  CONCEPTUAL_MODEL: {
    level: 'CONCEPTUAL_MODEL',
    label_fr: 'Modèle Pédagogique',
    label_en: 'Conceptual Model',
    short_fr: 'Pédagogique',
    short_en: 'Conceptual',
    description_fr: 'Représentation simplifiée destinée à la compréhension intuitive du système, sans présumer des tolérances réelles de calcul.',
    description_en: 'Simplified representation designed for intuitive ecosystem comprehension, excluding certified calculation tolerances.',
    color: '#A855F7',
    bgColor: 'rgba(168, 85, 247, 0.12)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
    iconName: 'Sparkles'
  },
  SIMULATION_DATA: {
    level: 'SIMULATION_DATA',
    label_fr: 'Données Simulées',
    label_en: 'Simulation Data',
    short_fr: 'Simulation',
    short_en: 'Simulation',
    description_fr: 'Grandeurs numériques générées par modèle de calcul transitoire ou d\'écoulement de puissance (non mesurées sur site).',
    description_en: 'Numerical quantities generated via power-flow or transient simulation engines (not site-measured values).',
    color: '#06B6D4',
    bgColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.35)',
    iconName: 'Cpu'
  },
  CAMEROON_CONTEXT: {
    level: 'CAMEROON_CONTEXT',
    label_fr: 'Contexte Réseau Cameroun',
    label_en: 'Cameroon Grid Context',
    short_fr: 'Cameroun (SONATREL)',
    short_en: 'Cameroon Grid',
    description_fr: 'Cas de référence contextuel spécifique au réseau interconnecté camerounais (SONATREL / ENEO / Nachtigal).',
    description_en: 'Contextual reference case specific to the interconnected Cameroon national grid (SONATREL / ENEO / Nachtigal).',
    color: '#EAB308',
    bgColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.45)',
    iconName: 'MapPin'
  },
  MANUFACTURER_SPECIFIC: {
    level: 'MANUFACTURER_SPECIFIC',
    label_fr: 'Donnée Constructeur',
    label_en: 'Manufacturer-Specific',
    short_fr: 'Constructeur',
    short_en: 'Mfr-Specific',
    description_fr: 'S\'applique à une gamme spécifique d\'un équipementier (ex. Siemens, Schneider, ABB, Alstom) ; ne pas généraliser.',
    description_en: 'Applies to a specific OEM product line (e.g. Siemens, Schneider, ABB, Alstom); not universally applicable.',
    color: '#64748B',
    bgColor: 'rgba(100, 116, 139, 0.12)',
    borderColor: 'rgba(100, 116, 139, 0.35)',
    iconName: 'Building'
  },
  APPLICATION_DEPENDENT: {
    level: 'APPLICATION_DEPENDENT',
    label_fr: 'Selon Projet Spécifique',
    label_en: 'Application-Dependent',
    short_fr: 'Selon Projet',
    short_en: 'Project-Dep.',
    description_fr: 'Nécessite une étude d\'ingénierie détaillée propre au cahier des charges du projet (valeurs dépendantes du site).',
    description_en: 'Requires project-specific detailed engineering study based on site particulars and employer requirements.',
    color: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.12)',
    borderColor: 'rgba(236, 72, 153, 0.35)',
    iconName: 'Sliders'
  },
  SOURCE_GAP: {
    level: 'SOURCE_GAP',
    label_fr: 'Source Manquante',
    label_en: 'Source Gap',
    short_fr: 'Source Manquante',
    short_en: 'Source Gap',
    description_fr: 'Aucune source autorisée n\'a pu être reliée à ce paramètre. Traitement en cours de complétion d\'ingénierie.',
    description_en: 'No reliable verified source has been attached to this parameter. Ongoing engineering completion.',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    iconName: 'AlertCircle'
  },
  REQUIRES_VALIDATION: {
    level: 'REQUIRES_VALIDATION',
    label_fr: 'En Attente de Validation',
    label_en: 'Requires Validation',
    short_fr: 'À Valider',
    short_en: 'To Validate',
    description_fr: 'Contenu proposé nécessitant une revue d\'ingénierie contradictoire avant qualification définitive.',
    description_en: 'Proposed engineering content requiring peer technical validation prior to formal approval.',
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: 'rgba(249, 115, 22, 0.35)',
    iconName: 'HelpCircle'
  }
};

const getBadgeIcon = (level: EvidenceTrustLevel) => {
  switch (level) {
    case 'VERIFIED_STANDARD': return CheckCircle2;
    case 'ENGINEERING_REFERENCE': return BookOpen;
    case 'FIELD_PRACTICE': return Wrench;
    case 'CONCEPTUAL_MODEL': return Sparkles;
    case 'SIMULATION_DATA': return Cpu;
    case 'CAMEROON_CONTEXT': return MapPin;
    case 'MANUFACTURER_SPECIFIC': return Building;
    case 'APPLICATION_DEPENDENT': return Sliders;
    case 'SOURCE_GAP': return AlertCircle;
    case 'REQUIRES_VALIDATION': return HelpCircle;
    default: return ShieldCheck;
  }
};

export const EvidenceTrustBadge: React.FC<EvidenceTrustBadgeProps> = ({
  level,
  referenceSource,
  locale = 'fr',
  size = 'md',
  className = '',
  onOpenFullMatrix
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const isFr = locale === 'fr';
  const config = EVIDENCE_BADGE_CONFIGS[level] || EVIDENCE_BADGE_CONFIGS.ENGINEERING_REFERENCE;
  const IconComponent = getBadgeIcon(level);

  // Close popover when clicking anywhere else
  React.useEffect(() => {
    if (!isPopoverOpen) return;
    const handleDocumentClick = () => setIsPopoverOpen(false);
    window.addEventListener('click', handleDocumentClick);
    return () => window.removeEventListener('click', handleDocumentClick);
  }, [isPopoverOpen]);

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'px-1.5 py-0.2 text-[9px] gap-1';
      case 'sm':
        return 'px-2 py-0.5 text-[10px] gap-1.5';
      case 'lg':
        return 'px-3 py-1.5 text-xs gap-2';
      case 'md':
      default:
        return 'px-2.5 py-1 text-[11px] gap-1.5';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'xs': return 'w-2.5 h-2.5';
      case 'sm': return 'w-3 h-3';
      case 'lg': return 'w-4 h-4';
      case 'md':
      default: return 'w-3.5 h-3.5';
    }
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Clickable Badge Pill */}
      <button
        type="button"
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        style={{
          color: config.color,
          backgroundColor: config.bgColor,
          borderColor: config.borderColor
        }}
        className={`inline-flex items-center rounded-md font-mono font-bold border transition-all cursor-pointer hover:brightness-125 shadow-xs ${getSizeClasses()}`}
        title={isFr ? `${config.label_fr} · Cliquez pour le détail d'ingénierie` : `${config.label_en} · Click for engineering evidence`}
      >
        <IconComponent className={getIconSize()} />
        <span>{size === 'xs' || size === 'sm' ? (isFr ? config.short_fr : config.short_en) : (isFr ? config.label_fr : config.label_en)}</span>
      </button>

      {/* Interactive Explanation Popover */}
      {isPopoverOpen && (
        <div 
          className="absolute left-0 bottom-full mb-2 w-72 sm:w-80 p-3.5 rounded-xl bg-slate-950/98 border border-slate-700 shadow-2xl z-50 text-xs font-mono text-slate-200 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span 
                className="w-2.5 h-2.5 rounded-full shrink-0" 
                style={{ backgroundColor: config.color }} 
              />
              <strong className="text-white font-sans text-xs">
                {isFr ? config.label_fr : config.label_en}
              </strong>
            </div>

            <button
              type="button"
              onClick={() => setIsPopoverOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-2.5 space-y-2 font-sans text-[11px] leading-relaxed text-slate-300">
            <p>{isFr ? config.description_fr : config.description_en}</p>

            {referenceSource && (
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300">
                <span className="text-slate-500 block text-[9px] uppercase font-bold">Source Associée :</span>
                {referenceSource}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
            {onOpenFullMatrix ? (
              <button
                type="button"
                onClick={() => {
                  setIsPopoverOpen(false);
                  onOpenFullMatrix();
                }}
                className="text-amber-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <span>{isFr ? 'Guide des 10 Preuves →' : '10-Tier Guide →'}</span>
              </button>
            ) : (
              <span className="text-slate-500">EPEDE Trust Layer</span>
            )}
            <span style={{ color: config.color }} className="font-bold">{level}</span>
          </div>
        </div>
      )}
    </div>
  );
};
