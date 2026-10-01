// src/components/equipment/ProvenanceBadge.tsx
// EPEDE - Unified Provenance & 10-Tier Evidence Trust Badge Component
// Bridges legacy verification statuses with the master 10-Tier Evidence Hierarchy

import React, { useState } from 'react';
import type { Provenance, VerificationStatus } from '../../types/epede';
import type { EvidenceTrustLevel } from '../../types/engineeringIntelligenceExtensions';
import { EvidenceTrustBadge } from './EvidenceTrustBadge';
import { EvidenceTrustModal } from './EvidenceTrustModal';
import { ShieldCheck, HelpCircle, ExternalLink, UserCheck, Calendar, BookOpen } from 'lucide-react';

interface ProvenanceBadgeProps {
  provenance?: Provenance | null;
  trustLevel?: EvidenceTrustLevel;
  locale: 'fr' | 'en';
  className?: string;
  onOpenFullMatrix?: () => void;
}

const STATUS_CONFIGS: Record<VerificationStatus, {
  label_fr: string;
  label_en: string;
  icon: string;
  badgeClass: string;
}> = {
  verified: {
    label_fr: 'VÉRIFIÉ',
    label_en: 'VERIFIED',
    icon: '✅',
    badgeClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
  },
  reference: {
    label_fr: 'RÉFÉRENCE',
    label_en: 'REFERENCE',
    icon: '📘',
    badgeClass: 'text-blue-400 bg-blue-950/60 border-blue-800',
  },
  estimated: {
    label_fr: 'ESTIMÉ',
    label_en: 'ESTIMATED',
    icon: '📊',
    badgeClass: 'text-amber-400 bg-amber-950/60 border-amber-800',
  },
  generic: {
    label_fr: 'GÉNÉRIQUE',
    label_en: 'GENERIC',
    icon: '⚙️',
    badgeClass: 'text-gray-400 bg-gray-900 border-gray-700',
  },
};

/**
 * Infer the best matching EvidenceTrustLevel from provenance data
 */
export function inferEvidenceTrustLevel(provenance?: Provenance | null, explicitLevel?: EvidenceTrustLevel): EvidenceTrustLevel {
  if (explicitLevel) return explicitLevel;
  if (!provenance) return 'CONCEPTUAL_MODEL';

  const sourceRef = (provenance.source_ref || '').toLowerCase();
  if (sourceRef.includes('sonatrel') || sourceRef.includes('eneo') || sourceRef.includes('cameroun') || sourceRef.includes('nachtigal') || sourceRef.includes('minee')) {
    return 'CAMEROON_CONTEXT';
  }

  switch (provenance.verification_status) {
    case 'verified':
      return 'VERIFIED_STANDARD';
    case 'reference':
      return 'ENGINEERING_REFERENCE';
    case 'estimated':
      return 'SIMULATION_DATA';
    case 'generic':
    default:
      return 'CONCEPTUAL_MODEL';
  }
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  provenance,
  trustLevel,
  locale = 'fr',
  className = '',
  onOpenFullMatrix
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isFr = locale === 'fr';

  if (!provenance && !trustLevel) return null;

  const derivedTrustLevel = inferEvidenceTrustLevel(provenance, trustLevel);
  const statusConfig = provenance 
    ? (STATUS_CONFIGS[provenance.verification_status] || STATUS_CONFIGS.generic)
    : STATUS_CONFIGS.verified;
  
  const statusLabel = isFr ? statusConfig.label_fr : statusConfig.label_en;
  const confidencePercent = provenance ? Math.round(provenance.confidence * 100) : 95;

  const handleOpenMatrix = () => {
    if (onOpenFullMatrix) {
      onOpenFullMatrix();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        className={`rounded-xl border border-slate-800 bg-[#0F141B] p-4 font-mono text-xs text-slate-300 shadow-md ${className}`}
      >
        {/* Top Header: Badge + Confidence Bar + Matrix Link */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isFr ? 'Preuve & Traçabilité :' : 'Evidence & Provenance:'}</span>
            </span>

            {/* 10-Tier Interactive Evidence Badge */}
            <EvidenceTrustBadge
              level={derivedTrustLevel}
              referenceSource={provenance?.source_ref}
              locale={locale}
              size="sm"
              onOpenFullMatrix={handleOpenMatrix}
            />

            {/* Legacy Status Tag */}
            <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold ${statusConfig.badgeClass}`}>
              <span>{statusConfig.icon}</span>
              <span>{statusLabel}</span>
            </span>
          </div>

          {/* Confidence Score Bar */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-[11px] font-sans">
              {isFr ? 'Indice de Confiance :' : 'Confidence Score:'}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 sm:w-20 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    confidencePercent >= 90
                      ? 'bg-emerald-400'
                      : confidencePercent >= 75
                      ? 'bg-sky-400'
                      : confidencePercent >= 50
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`}
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
              <strong className="font-bold text-white text-xs">{confidencePercent}%</strong>
            </div>

            {/* View Full 10-Tier Guide Button */}
            <button
              type="button"
              onClick={handleOpenMatrix}
              className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-850 transition-colors cursor-pointer"
              title={isFr ? "Consulter la matrice des 10 niveaux de preuve" : "View 10-tier evidence hierarchy"}
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Detailed Metadata Grid */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          {provenance?.source_ref && (
            <div className="flex items-start gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-500 font-sans block text-[10px] uppercase font-bold">
                  {isFr ? 'Norme / Référence Source :' : 'Governing Source Standard:'}
                </span>
                <span className="text-slate-200 font-medium">{provenance.source_ref}</span>
              </div>
            </div>
          )}

          {provenance?.verified_by && (
            <div className="flex items-start gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-500 font-sans block text-[10px] uppercase font-bold">
                  {isFr ? 'Entité Auditrice :' : 'Auditing Entity:'}
                </span>
                <span className="text-slate-200 font-medium">
                  {provenance.verified_by}
                  {provenance.verified_at && (
                    <span className="text-slate-500 text-[10px] font-mono"> ({provenance.verified_at})</span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {provenance?.notes && (
          <p className="mt-2.5 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 italic font-sans leading-relaxed">
            {provenance.notes}
          </p>
        )}

        {/* Footer Link to 10-Tier Guide */}
        <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center justify-between text-[10.5px]">
          <span className="text-slate-500 font-sans">
            {isFr 
              ? 'Conforme au protocole de traçabilité EPEDE v2' 
              : 'Compliant with EPEDE v2 traceability protocol'}
          </span>
          <button
            type="button"
            onClick={handleOpenMatrix}
            className="text-amber-400 hover:text-amber-300 font-sans font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{isFr ? 'Comprendre les 10 niveaux de confiance →' : 'Understand 10 evidence tiers →'}</span>
          </button>
        </div>
      </div>

      {/* Embedded Evidence Trust Modal */}
      <EvidenceTrustModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
        initialHighlightLevel={derivedTrustLevel}
      />
    </>
  );
};
