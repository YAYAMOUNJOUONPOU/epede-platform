// src/components/common/FinalCTA.tsx
// Final CTA section per HOMEPAGE-EXACT-MATCH.md Section 09 & SITEWIDE-REDESIGN.md

import React from 'react';

export interface FinalCTAProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  eyebrow,
  title = 'See every connection. Master the system.',
  description = 'From 225 kV transmission grids to low-voltage industrial distribution. Designed for electrical and power systems engineers.',
  primaryAction,
  secondaryAction,
  className = '',
}) => {
  return (
    <section
      className={`relative overflow-hidden bg-[#0B1B2B] text-[#F3F7FA] border-t border-[#1E3347] ${className}`}
      style={{
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 4vw, 48px)',
      }}
    >
      {/* Radial amber glow background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(242,165,65,0.14) 0%, rgba(11,27,43,0) 70%)',
        }}
      />

      <div className="relative max-w-[840px] mx-auto text-center">
        {eyebrow && (
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-[#F2A541] mb-4">
            {eyebrow}
          </div>
        )}

        <h2
          className="font-['Space_Grotesk',sans-serif] font-bold text-[#F3F7FA] m-0 tracking-tight leading-[1.12]"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)' }}
        >
          {title}
        </h2>

        {description && (
          <p className="mt-5 text-[#C3CFDA] text-base sm:text-lg leading-relaxed max-w-[620px] mx-auto font-['Space_Grotesk',sans-serif]">
            {description}
          </p>
        )}

        {(primaryAction || secondaryAction) && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {primaryAction && (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="h-12 px-6 rounded-full bg-[#F2A541] hover:bg-[#FFC277] text-[#0B1B2B] font-bold text-sm transition-all shadow-[0_4px_16px_rgba(242,165,65,0.3)] cursor-pointer border-0 font-['Space_Grotesk',sans-serif]"
              >
                {primaryAction.label}
              </button>
            )}

            {secondaryAction && (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="h-12 px-6 rounded-full bg-transparent hover:bg-[#10263A] text-[#FBFCFD] border border-[#1E3347] hover:border-[#F2A541] font-semibold text-sm transition-all cursor-pointer font-['Space_Grotesk',sans-serif]"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

