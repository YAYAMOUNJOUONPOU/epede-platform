// src/components/common/FilterPills.tsx
// Filter pills matching homepage audience filter style per SITEWIDE-REDESIGN.md

import React from 'react';

export interface FilterPillOption<T extends string = string> {
  id: T;
  label: string;
  count?: number;
}

export interface FilterPillsProps<T extends string = string> {
  options: FilterPillOption<T>[];
  activeId: T;
  onChange: (id: T) => void;
  className?: string;
}

export const FilterPills = <T extends string = string>({
  options,
  activeId,
  onChange,
  className = '',
}: FilterPillsProps<T>) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {options.map((opt) => {
        const isActive = opt.id === activeId;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`h-9 px-4 rounded-full text-xs font-mono transition-all cursor-pointer border flex items-center gap-1.5 ${
              isActive
                ? 'bg-[#0B1B2B] text-[#FBFCFD] border-[#0B1B2B] font-bold shadow-sm'
                : 'bg-[#EEF4F8] text-[#3A4B5C] border-[#D5E0E8] hover:border-[#1F5FAE] hover:text-[#0B1B2B]'
            }`}
          >
            <span>{opt.label}</span>
            {typeof opt.count === 'number' && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-[#1E3347] text-[#F3F7FA]' : 'bg-[#D5E0E8] text-[#5B6B7B]'
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

