// src/components/common/ListRow.tsx
// List row component (number · title · mono reference · arrow) per SITEWIDE-REDESIGN.md

import React from 'react';

export interface ListRowProps {
  number?: string | number;
  title: string;
  subtitle?: string;
  reference?: string;
  badge?: string;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

export const ListRow: React.FC<ListRowProps> = ({
  number,
  title,
  subtitle,
  reference,
  badge,
  onClick,
  isActive = false,
  className = '',
}) => {
  const numStr =
    typeof number === 'number'
      ? String(number).padStart(2, '0')
      : number;

  return (
    <div
      onClick={onClick}
      className={`group py-4 sm:py-5 px-3 sm:px-4 flex items-center justify-between gap-4 border-b border-[#D5E0E8] transition-all rounded-[4px] ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isActive
          ? 'bg-[#EEF4F8] border-l-[3px] border-l-[#1F5FAE]'
          : 'hover:bg-[#EEF4F8]/50'
      } ${className}`}
    >
      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
        {numStr && (
          <span className="font-mono text-xs sm:text-sm font-bold text-[#1F5FAE] shrink-0 min-w-[28px]">
            {numStr}
          </span>
        )}

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-['Space_Grotesk',sans-serif] text-sm sm:text-base font-bold text-[#0B1B2B] group-hover:text-[#1F5FAE] transition-colors truncate">
              {title}
            </span>
            {badge && (
              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#EEF4F8] border border-[#D5E0E8] text-[#3A4B5C] rounded-[2px]">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <div className="font-['Space_Grotesk',sans-serif] text-xs text-[#5B6B7B] truncate mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {reference && (
          <span className="font-mono text-xs text-[#5B6B7B] hidden sm:inline">
            {reference}
          </span>
        )}
        <span className="text-[#1F5FAE] text-sm group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </div>
  );
};

