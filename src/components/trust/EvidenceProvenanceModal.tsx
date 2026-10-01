// src/components/trust/EvidenceProvenanceModal.tsx
// EPEDE - "D'où vient ce chiffre ?" / "Where does this value come from?"
// Interactive modal providing complete engineering transparency and normative provenance audit for any electrotechnical parameter.

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Globe,
  Activity,
  Cpu,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  X,
  Scale,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  AuditedParameter,
  PROVENANCE_CATEGORIES_META,
  ProvenanceCategory,
} from '../../data/evidenceProvenanceData';

interface EvidenceProvenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  parameter: AuditedParameter | null;
  locale: 'fr' | 'en';
  onNavigateEquipment?: (equipmentId: string) => void;
  onNavigateCalculator?: (tab: any) => void;
}

export const EvidenceProvenanceModal: React.FC<EvidenceProvenanceModalProps> = ({
  isOpen,
  onClose,
  parameter,
  locale,
  onNavigateEquipment,
  onNavigateCalculator,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !parameter) return null;

  const catMeta = PROVENANCE_CATEGORIES_META[parameter.category];

  const handleCopyCitation = () => {
    const text = `${parameter.name[locale]} = ${parameter.value} ${parameter.unit} — Source: ${parameter.sourceCitation.authority}, « ${parameter.sourceCitation.document} » (${parameter.sourceCitation.publicationYear}). Normes: ${parameter.applicableStandards.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getCategoryIcon = (category: ProvenanceCategory) => {
    switch (category) {
      case 'GRID_VERIFIED':
        return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'NORMATIVE_STANDARD':
        return <ShieldCheck className="w-5 h-5 text-sky-400" />;
      case 'SIMULATION_EMPIRICAL':
        return <Activity className="w-5 h-5 text-purple-400" />;
      case 'OEM_MANUFACTURER':
        return <Cpu className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  const getConfidenceLevel = (score: number) => {
    if (score >= 98) {
      return {
        label: locale === 'fr' ? 'Traçabilité Absolue (Certifiée In Situ / Normée)' : 'Absolute Traceability (Certified In Situ / Standardized)',
        color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40',
        barColor: 'bg-emerald-500',
      };
    }
    if (score >= 92) {
      return {
        label: locale === 'fr' ? 'Fiabilité Élevée (Référence Industrielle Calibrée)' : 'High Reliability (Calibrated Industrial Reference)',
        color: 'text-sky-400 bg-sky-950/80 border-sky-500/40',
        barColor: 'bg-sky-500',
      };
    }
    return {
      label: locale === 'fr' ? 'Modèle Analytique / Donnée Déclarée' : 'Analytical Model / Declared Data',
      color: 'text-amber-400 bg-amber-950/80 border-amber-500/40',
      barColor: 'bg-amber-500',
    };
  };

  const confidenceInfo = getConfidenceLevel(parameter.confidencePercent);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 z-10 flex flex-col font-sans"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 relative">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${catMeta.borderClass} ${catMeta.badgeClass} ${catMeta.textClass}`}>
                    {getCategoryIcon(parameter.category)}
                    <span>{catMeta.shortLabel[locale]}</span>
                  </span>
                  <span className="font-mono text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                    ID: {parameter.key}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {locale === 'fr' ? 'Audit du' : 'Audited:'} {parameter.lastAuditDate}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white mt-1">
                  {parameter.name[locale]}
                </h2>
                <p className="text-xs text-slate-400">
                  {catMeta.description[locale]}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Value & Symbol Highlight Ribbon */}
            <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 font-mono text-sm font-semibold text-sky-300">
                  {parameter.symbol}
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {locale === 'fr' ? 'Valeur Audité & Unité' : 'Audited Value & Unit'}
                  </div>
                  <div className="text-2xl font-mono font-black text-amber-400 flex items-baseline gap-1.5">
                    <span>{parameter.value}</span>
                    <span className="text-base font-normal text-slate-300">{parameter.unit}</span>
                  </div>
                </div>
              </div>

              {/* Confidence Score Gauge */}
              <div className="min-w-[200px]">
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">{locale === 'fr' ? 'Indice de Confiance' : 'Confidence Index'}</span>
                  <span className="font-bold text-white">{parameter.confidencePercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className={`h-full ${confidenceInfo.barColor} transition-all duration-500`}
                    style={{ width: `${parameter.confidencePercent}%` }}
                  />
                </div>
                <div className={`mt-1.5 text-[10px] font-mono px-2 py-0.5 rounded border inline-block ${confidenceInfo.color}`}>
                  {confidenceInfo.label}
                </div>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 overflow-y-auto">
            
            {/* Primary Source Citation Box */}
            <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-300 uppercase">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>{locale === 'fr' ? 'Source Primaire Vérifiée & Autorité Émettrice' : 'Verified Primary Source & Issuing Authority'}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-900/60 text-sky-300 border border-sky-700/60">
                  {parameter.sourceCitation.auditStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">{locale === 'fr' ? 'Organisme / Gestionnaire :' : 'Authority / Utility:'}</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{parameter.sourceCitation.authority}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block font-mono text-[10px] uppercase">{locale === 'fr' ? 'Document & Millésime :' : 'Document & Year:'}</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{parameter.sourceCitation.document} ({parameter.sourceCitation.publicationYear})</span>
                </div>
              </div>

              {parameter.sourceCitation.referenceSection && (
                <div className="text-xs font-mono text-sky-200 bg-sky-900/20 p-2.5 rounded border border-sky-800/40">
                  <span className="text-sky-400 font-bold">{locale === 'fr' ? 'Paragraphe / Réf : ' : 'Clause / Ref: '}</span>
                  {parameter.sourceCitation.referenceSection}
                </div>
              )}
            </div>

            {/* Rationale: Why this value? */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>{locale === 'fr' ? 'Justification Physique & Choix d\'Ingénierie' : 'Physical Rationale & Engineering Sizing'}</span>
              </h3>
              <p className="text-sm text-slate-300 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                {parameter.rationale[locale]}
              </p>
            </div>

            {/* Measurement or Calculation Protocol */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span>{locale === 'fr' ? 'Protocole de Mesure ou Formulation Mathématique' : 'Measurement Protocol or Mathematical Derivation'}</span>
              </h3>
              <p className="text-xs font-mono text-slate-300 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                {parameter.calculationOrMeasurementMethod[locale]}
              </p>
            </div>

            {/* Field Boundary Conditions (Cameroon Climate, Soil, Ambient) */}
            {parameter.fieldBoundaryConditions && (
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>{locale === 'fr' ? 'Conditions aux Limites Terrain (Cameroun / Tropical)' : 'Field Boundary Conditions (Cameroon / Tropical)'}</span>
                </h3>
                <p className="text-xs text-amber-200/90 bg-amber-950/20 p-3.5 rounded-xl border border-amber-800/40 leading-relaxed">
                  {parameter.fieldBoundaryConditions[locale]}
                </p>
              </div>
            )}

            {/* Norms & Standards References */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>{locale === 'fr' ? 'Normes Internationales Applicables' : 'Applicable International Standards'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {parameter.applicableStandards.map((std, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-sky-300 flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>{std}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Auditor signature box */}
            <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">{locale === 'fr' ? 'Contrôle Technique :' : 'Technical Review:'} {parameter.auditorTitle[locale]}</span>
              <span className="flex items-center gap-1 text-emerald-400 font-mono font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Vérifié' : 'Verified'}</span>
              </span>
            </div>

          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCopyCitation}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? (locale === 'fr' ? 'Référence Copiée !' : 'Reference Copied!') : (locale === 'fr' ? 'Copier la Référence Normative' : 'Copy Normative Citation')}</span>
            </button>

            <div className="flex items-center gap-2">
              {parameter.associatedEquipmentIds && parameter.associatedEquipmentIds.length > 0 && onNavigateEquipment && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateEquipment(parameter.associatedEquipmentIds![0]);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-semibold transition-colors"
                >
                  <span>{locale === 'fr' ? 'Voir Fiche Équipement' : 'View Equipment Fiche'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
              >
                {locale === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
