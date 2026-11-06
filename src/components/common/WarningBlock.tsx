// src/components/common/WarningBlock.tsx
// Warning callout component per SITEWIDE-REDESIGN.md Section 3 & 4
// Rule: Left amber rule plus bold label (strictly no colored boxes around plain text)

import React from 'react';

export interface WarningBlockProps {
  label?: string;
  children: React.ReactNode;
  standardRef?: string;
  className?: string;
}

export const WarningBlock: React.FC<WarningBlockProps> = ({
  label = 'WARNING · SAFETY NOTE',
  children,
  standardRef,
  className = '',
}) => {
  return (
    <aside
      role="note"
      className={`border-l-[3px] border-[#F2A541] pl-4 sm:pl-5 py-2 my-5 bg-transparent ${className}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-['Space_Grotesk',sans-serif] font-bold text-xs uppercase tracking-wider text-[#0B1B2B]">
          {label}
        </span>
        {standardRef && (
          <span className="font-mono text-[10px] text-[#5B6B7B]">
            [{standardRef}]
          </span>
        )}
      </div>
      <div className="font-['Space_Grotesk',sans-serif] text-sm text-[#3A4B5C] leading-relaxed">
        {children}
      </div>
    </aside>
  );
};

