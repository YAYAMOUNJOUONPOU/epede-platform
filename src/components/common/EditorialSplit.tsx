// src/components/common/EditorialSplit.tsx
// Editorial split component (image plus text) per SITEWIDE-REDESIGN.md Section 3 & 4

import React from 'react';

export interface EditorialSplitProps {
  imageSrc: string;
  imageAlt: string;
  caption?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  reversed?: boolean;
  className?: string;
}

export const EditorialSplit: React.FC<EditorialSplitProps> = ({
  imageSrc,
  imageAlt,
  caption,
  eyebrow,
  title,
  children,
  reversed = false,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-12 sm:my-16 ${className}`}
    >
      {/* Image Column */}
      <div
        className={`lg:col-span-6 ${
          reversed ? 'lg:order-2' : 'lg:order-1'
        }`}
      >
        <div className="overflow-hidden rounded-[6px] border border-[#D5E0E8] shadow-[0_8px_24px_rgba(11,27,43,0.06)] bg-[#EEF4F8]">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto object-cover aspect-[4/3] block"
            loading="lazy"
          />
          {caption && (
            <div className="p-3 font-mono text-xs text-[#5B6B7B] bg-[#FBFCFD] border-t border-[#D5E0E8]">
              {caption}
            </div>
          )}
        </div>
      </div>

      {/* Text Column */}
      <div
        className={`lg:col-span-6 flex flex-col justify-center ${
          reversed ? 'lg:order-1' : 'lg:order-2'
        }`}
      >
        {eyebrow && (
          <div className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#1F5FAE] mb-2.5">
            {eyebrow}
          </div>
        )}
        <h2 className="font-['Space_Grotesk',sans-serif] text-2xl sm:text-3xl font-bold text-[#0B1B2B] leading-tight m-0">
          {title}
        </h2>
        <div className="mt-4 font-['Space_Grotesk',sans-serif] text-[#3A4B5C] text-base leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

