// src/components/common/NumberedList.tsx
// Numbered apparatus/equipment list row component per SITEWIDE-REDESIGN.md

import React from 'react';

export interface NumberedListItem {
  number: string | number;
  title: string;
  description?: string;
  specs?: string[];
  standards?: string[];
  actionLabel?: string;
  onAction?: () => void;
}

export interface NumberedListProps {
  items: NumberedListItem[];
  className?: string;
}

export const NumberedList: React.FC<NumberedListProps> = ({
  items,
  className = '',
}) => {
  return (
    <div className={`divide-y divide-[#D5E0E8] border-y border-[#D5E0E8] ${className}`}>
      {items.map((item, idx) => {
        const numStr =
          typeof item.number === 'number'
            ? String(item.number).padStart(2, '0')
            : item.number;

        return (
          <div
            key={idx}
            className="py-5 sm:py-6 flex flex-col sm:flex-row items-start sm:items-baseline gap-4 sm:gap-6 group hover:bg-[#EEF4F8]/40 transition-colors px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-[4px]"
          >
            {/* Number in mono cobalt */}
            <div className="font-mono text-sm sm:text-base font-bold text-[#1F5FAE] tracking-wider shrink-0 min-w-[36px]">
              {numStr}
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline gap-3">
                <h3 className="font-['Space_Grotesk',sans-serif] text-base sm:text-lg font-bold text-[#0B1B2B] m-0">
                  {item.title}
                </h3>
                {item.standards && item.standards.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.standards.map((std, sIdx) => (
                      <span
                        key={sIdx}
                        className="font-mono text-[11px] px-2 py-0.5 bg-[#EEF4F8] border border-[#D5E0E8] text-[#1F5FAE] rounded-[3px]"
                      >
                        {std}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {item.description && (
                <p className="mt-1.5 text-sm sm:text-[15px] leading-relaxed text-[#3A4B5C] m-0 font-['Space_Grotesk',sans-serif]">
                  {item.description}
                </p>
              )}

              {item.specs && item.specs.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs text-[#5B6B7B]">
                  {item.specs.map((spec, specIdx) => (
                    <span
                      key={specIdx}
                      className="inline-flex items-center gap-1.5 after:content-['·'] after:last:content-[''] after:ml-2 after:text-[#D5E0E8]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Optional Action Button */}
            {item.onAction && (
              <button
                type="button"
                onClick={item.onAction}
                className="shrink-0 self-start sm:self-center font-mono text-xs text-[#1F5FAE] hover:text-[#174A88] font-bold flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0 group-hover:translate-x-1 transition-transform"
              >
                <span>{item.actionLabel || 'Details'}</span>
                <span>→</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
