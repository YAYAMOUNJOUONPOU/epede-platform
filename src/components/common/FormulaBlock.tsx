// src/components/common/FormulaBlock.tsx
// Formula display block on ice panel per SITEWIDE-REDESIGN.md

import React from 'react';

export interface FormulaVariable {
  symbol: string;
  unit?: string;
  definition: string;
}

export interface FormulaBlockProps {
  label?: string;
  formula: string | React.ReactNode;
  variables?: FormulaVariable[];
  standardRef?: string;
  explanation?: string;
  className?: string;
}

export const FormulaBlock: React.FC<FormulaBlockProps> = ({
  label,
  formula,
  variables,
  standardRef,
  explanation,
  className = '',
}) => {
  return (
    <div
      className={`rounded-[6px] border border-[#D5E0E8] bg-[#EEF4F8] p-5 sm:p-6 my-6 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        {label && (
          <div className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[#1F5FAE]">
            {label}
          </div>
        )}
        {standardRef && (
          <span className="font-mono text-[11px] px-2 py-0.5 bg-[#FBFCFD] border border-[#D5E0E8] text-[#5B6B7B] rounded-[3px]">
            {standardRef}
          </span>
        )}
      </div>

      {/* Main Formula Expression */}
      <div className="bg-[#FBFCFD] border border-[#D5E0E8] rounded-[4px] p-4 font-mono text-base sm:text-lg text-[#0B1B2B] overflow-x-auto text-center my-3 shadow-inner">
        {formula}
      </div>

      {explanation && (
        <p className="font-['Space_Grotesk',sans-serif] text-sm text-[#3A4B5C] mt-3 mb-0 leading-relaxed">
          {explanation}
        </p>
      )}

      {/* Variables Ledger */}
      {variables && variables.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#D5E0E8] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          {variables.map((v, idx) => (
            <div key={idx} className="flex items-baseline gap-2">
              <span className="font-bold text-[#0B1B2B]">{v.symbol}</span>
              {v.unit && <span className="text-[#1F5FAE]">[{v.unit}]</span>}
              <span className="text-[#5B6B7B]">= {v.definition}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

