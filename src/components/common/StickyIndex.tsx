// src/components/common/StickyIndex.tsx
// Sticky rail navigation component per HOMEPAGE-EXACT-MATCH.md & SITEWIDE-REDESIGN.md

import React, { useEffect, useState } from 'react';

export interface StickyIndexItem {
  id: string;
  number: string;
  label: string;
  subtitle?: string;
}

export interface StickyIndexProps {
  items: StickyIndexItem[];
  activeId: string;
  onSelect: (id: string) => void;
  title?: string;
  className?: string;
}

export const StickyIndex: React.FC<StickyIndexProps> = ({
  items,
  activeId,
  onSelect,
  title = 'INDEX',
  className = '',
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const activeIdx = items.findIndex((it) => it.id === activeId);
      if (activeIdx >= 0 && items.length > 1) {
        setScrollProgress((activeIdx / (items.length - 1)) * 100);
      }
    };
    handleScroll();
  }, [activeId, items]);

  return (
    <>
      {/* Mobile / Tablet Horizontal Sticky Bar (< 1100px) */}
      <div className="xl:hidden sticky top-[68px] z-40 bg-[#FBFCFD]/95 backdrop-blur-md border-b border-[#D5E0E8] py-2.5 px-4 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-[#0B1B2B] text-[#FBFCFD] border-[#0B1B2B] font-bold shadow-sm'
                  : 'bg-[#EEF4F8] text-[#3A4B5C] border-[#D5E0E8] hover:border-[#1F5FAE]'
              }`}
            >
              <span className="opacity-60 mr-1.5">{item.number}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Sticky Rail (>= 1100px / xl) */}
      <div
        className={`hidden xl:block sticky top-[100px] max-h-[calc(100vh-140px)] overflow-y-auto pr-6 select-none ${className}`}
      >
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5B6B7B] mb-5">
          {title}
        </div>

        <div className="relative pl-5">
          {/* Vertical Track Line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-[#D5E0E8]" />

          {/* Vertical Amber Progress Line */}
          <div
            className="absolute left-[7px] top-2 w-[2px] bg-[#F2A541] transition-[height] duration-200"
            style={{ height: `${scrollProgress}%` }}
          />

          <div className="flex flex-col gap-5">
            {items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className="group relative flex items-start gap-3.5 text-left bg-transparent border-0 cursor-pointer p-0"
                >
                  {/* Indicator Dot */}
                  <span
                    className={`absolute -left-[20px] top-1.5 w-[14px] h-[14px] rounded-full border-2 transition-all ${
                      isActive
                        ? 'border-[#F2A541] bg-[#0B1B2B] scale-110 shadow-[0_0_8px_rgba(242,165,65,0.6)]'
                        : 'border-[#D5E0E8] bg-[#FBFCFD] group-hover:border-[#1F5FAE]'
                    }`}
                  />

                  <div>
                    <div
                      className={`font-mono text-xs transition-colors ${
                        isActive
                          ? 'text-[#1F5FAE] font-bold'
                          : 'text-[#5B6B7B] group-hover:text-[#0B1B2B]'
                      }`}
                    >
                      {item.number}
                    </div>
                    <div
                      className={`font-['Space_Grotesk',sans-serif] text-sm leading-tight transition-colors ${
                        isActive
                          ? 'text-[#0B1B2B] font-bold'
                          : 'text-[#3A4B5C] group-hover:text-[#0B1B2B]'
                      }`}
                    >
                      {item.label}
                    </div>
                    {item.subtitle && (
                      <div className="font-mono text-[10px] text-[#5B6B7B] mt-0.5">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
