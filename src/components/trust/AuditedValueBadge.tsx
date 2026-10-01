// src/components/trust/AuditedValueBadge.tsx
// EPEDE - Clickable inline badge providing "D'où vient ce chiffre ?" inspection for any parameter.

import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, Info, CheckCircle2 } from 'lucide-react';
import { AUDITED_PARAMETERS_REGISTRY, AuditedParameter } from '../../data/evidenceProvenanceData';
import { EvidenceProvenanceModal } from './EvidenceProvenanceModal';

interface AuditedValueBadgeProps {
  paramId: string;
  locale: 'fr' | 'en';
  variant?: 'subtle-icon' | 'badge-compact' | 'full-pill';
  customDisplayValue?: string;
  onNavigateEquipment?: (equipmentId: string) => void;
  className?: string;
}

export const AuditedValueBadge: React.FC<AuditedValueBadgeProps> = ({
  paramId,
  locale,
  variant = 'badge-compact',
  customDisplayValue,
  onNavigateEquipment,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const parameter = AUDITED_PARAMETERS_REGISTRY.find(p => p.id === paramId || p.key === paramId);

  if (!parameter) {
    return null;
  }

  const displayVal = customDisplayValue || `${parameter.value} ${parameter.unit}`;

  return (
    <>
      {variant === 'subtle-icon' && (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          title={locale === 'fr' ? 'D’où vient ce chiffre ? (Traçabilité EPEDE)' : 'Where does this value come from? (EPEDE Provenance)'}
          className={`inline-flex items-center text-slate-400 hover:text-sky-400 transition-colors ml-1 p-0.5 rounded hover:bg-slate-800 ${className}`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      )}

      {variant === 'badge-compact' && (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900/90 hover:bg-slate-800 text-sky-300 border border-slate-700/80 hover:border-sky-500/50 transition-all shadow-xs group ${className}`}
        >
          <ShieldCheck className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">{displayVal}</span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            {parameter.confidencePercent}%
          </span>
        </button>
      )}

      {variant === 'full-pill' && (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-sky-500/60 transition-all shadow-sm ${className}`}
        >
          <span className="text-slate-400">{parameter.symbol} =</span>
          <span className="font-bold text-amber-300">{displayVal}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-sky-400" />
            <span>{parameter.confidencePercent}%</span>
          </span>
          <span className="text-[10px] text-slate-400 underline decoration-slate-600 underline-offset-2">
            {locale === 'fr' ? 'D’où vient ce chiffre ?' : 'Source'}
          </span>
        </button>
      )}

      <EvidenceProvenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parameter={parameter}
        locale={locale}
        onNavigateEquipment={onNavigateEquipment}
      />
    </>
  );
};
