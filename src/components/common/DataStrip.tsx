// src/components/common/DataStrip.tsx
// Fact metrics strip with fine rules (no boxes), per SITEWIDE-REDESIGN.md

import React from 'react';

export interface DataStripItem {
  label: string;
  value: string | number | React.ReactNode;
  unit?: string;
  subtext?: string;
}

export interface DataStripProps {
  items: DataStripItem[];
  theme?: 'light' | 'navy';
  className?: string;
}

export const DataStrip: React.FC<DataStripProps> = ({
  items,
  theme = 'light',
  className = '',
}) => {
  const isNavy = theme === 'navy';

  return (
    <div
      className={`flex flex-wrap items-stretch divide-y sm:divide-y-0 sm:divide-x border-y sm:border-y-0 sm:border-x ${
        isNavy
          ? 'divide-[#1E3347] border-[#1E3347] text-[#F3F7FA]'
          : 'divide-[#D5E0E8] border-[#D5E0E8] text-[#0B1B2B]'
      } ${className}`}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex-1 min-w-[140px] px-4 sm:px-6 py-3.5 flex flex-col justify-center"
        >
          <div
            className={`font-mono text-[11px] uppercase tracking-[0.1em] ${
              isNavy ? 'text-[#93A4B4]' : 'text-[#5B6B7B]'
            }`}
          >
            {item.label}
          </div>
          <div className="mt-1 flex items-baseline gap-1.5 font-['Space_Grotesk',sans-serif]">
            <span
              className={`text-xl sm:text-2xl font-bold tracking-tight ${
                isNavy ? 'text-[#F3F7FA]' : 'text-[#0B1B2B]'
              }`}
            >
              {item.value}
            </span>
            {item.unit && (
              <span
                className={`font-mono text-xs ${
                  isNavy ? 'text-[#C3CFDA]' : 'text-[#5B6B7B]'
                }`}
              >
                {item.unit}
              </span>
            )}
          </div>
          {item.subtext && (
            <div
              className={`mt-1 font-mono text-[10px] ${
                isNavy ? 'text-[#93A4B4]' : 'text-[#5B6B7B]'
              }`}
            >
              {item.subtext}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
