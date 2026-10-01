// src/components/ui/FormulaBlock.tsx
import React from 'react';
import type { Formula } from '../../types/epede';

interface FormulaBlockProps {
  formula: Formula;
  locale: 'fr' | 'en';
  className?: string;
}

export const FormulaBlock: React.FC<FormulaBlockProps> = ({
  formula,
  locale,
  className = '',
}) => {
  return (
    <div
      role="math"
      aria-label={`Formule: ${formula.expression}`}
      className={`border-l-4 border-[#D97706] bg-[#111827] rounded-r-lg border-y border-r border-[#374151] overflow-hidden shadow-md ${className}`}
    >
      {/* Expression header */}
      <div className="px-5 py-3.5 border-b border-[#374151] bg-[#0A1628]/40 flex flex-wrap items-center justify-between gap-3">
        <div>
          <code className="font-mono text-lg sm:text-xl font-bold text-[#D97706] tracking-wide select-all">
            {formula.expression}
          </code>
          {(formula.description_fr || formula.description_en) && (
            <p className="mt-1 text-xs text-[#9CA3AF]">
              {locale === 'fr' ? formula.description_fr : formula.description_en}
            </p>
          )}
        </div>
      </div>

      {/* Variables list */}
      {formula.variables && formula.variables.length > 0 && (
        <div className="px-5 py-3 divide-y divide-[#1F2937] text-sm">
          {formula.variables.map((v, i) => (
            <div key={i} className="py-2 first:pt-1 last:pb-1 flex items-baseline justify-between gap-4">
              <div className="flex items-baseline gap-3 min-w-0">
                <code className="font-mono text-sm font-bold text-[#D97706] w-12 shrink-0">
                  {v.symbol}
                </code>
                <span className="text-xs sm:text-sm text-[#D1D5DB] truncate">
                  {locale === 'fr' ? v.desc_fr : v.desc_en}
                </span>
              </div>
              <span className="font-mono text-xs text-[#D97706] bg-[#1F2937] px-2 py-0.5 rounded border border-[#374151] shrink-0">
                [{v.unit}]
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Standard reference and domains */}
      {(formula.standard_ref || (formula.applicable_domains && formula.applicable_domains.length > 0)) && (
        <div className="px-5 py-2.5 border-t border-[#374151] bg-[#0A1628]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
          {formula.standard_ref && (
            <code className="font-mono text-[#9CA3AF] flex items-center gap-1.5">
              <span>📋</span> {formula.standard_ref}
            </code>
          )}
          {formula.applicable_domains && formula.applicable_domains.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[#6B7280]">
                {locale === 'fr' ? 'Applicable :' : 'Applies to:'}
              </span>
              <div className="flex gap-1 flex-wrap">
                {formula.applicable_domains.map((dom) => (
                  <span
                    key={dom}
                    className="font-mono text-[10px] bg-[#1F2937] text-[#9CA3AF] px-1.5 py-0.5 rounded border border-[#374151]"
                  >
                    {dom}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
