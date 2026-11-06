// src/components/common/CatalogueCard.tsx
// Equipment catalogue card per SITEWIDE-REDESIGN.md Section 3 & 4
// Rule: White #FFFFFF, 1px #D5E0E8 border, radius 6px, image on top, mono spec line.

import React from 'react';

export interface CatalogueCardProps {
  id: string;
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  domainCode?: string;
  specs?: string[];
  voltageRating?: string;
  onClick?: () => void;
  className?: string;
}

export const CatalogueCard: React.FC<CatalogueCardProps> = ({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  domainCode,
  specs,
  voltageRating,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`group bg-[#FFFFFF] rounded-[6px] border border-[#D5E0E8] overflow-hidden flex flex-col transition-all duration-200 hover:border-[#1F5FAE] hover:shadow-[0_8px_24px_rgba(11,27,43,0.06)] ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Image container */}
      {imageSrc && (
        <div className="relative w-full aspect-[16/10] bg-[#EEF4F8] overflow-hidden border-b border-[#D5E0E8]">
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {voltageRating && (
            <span className="absolute top-2 right-2 font-mono text-[11px] font-bold px-2 py-0.5 bg-[#0B1B2B]/85 text-[#FBFCFD] rounded-[3px] backdrop-blur-sm">
              {voltageRating}
            </span>
          )}
          {domainCode && (
            <span className="absolute bottom-2 left-2 font-mono text-[11px] font-semibold px-2 py-0.5 bg-[#1F5FAE] text-white rounded-[3px]">
              {domainCode}
            </span>
          )}
        </div>
      )}

      {/* Card body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-['Space_Grotesk',sans-serif] text-base font-bold text-[#0B1B2B] group-hover:text-[#1F5FAE] transition-colors m-0">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-[#5B6B7B] line-clamp-2 m-0 font-['Space_Grotesk',sans-serif]">
              {subtitle}
            </p>
          )}
        </div>

        {/* Mono specs line */}
        {specs && specs.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#D5E0E8] flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-[#5B6B7B]">
            {specs.map((spec, sIdx) => (
              <span
                key={sIdx}
                className="after:content-['·'] after:last:content-[''] after:ml-2 after:text-[#D5E0E8]"
              >
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
