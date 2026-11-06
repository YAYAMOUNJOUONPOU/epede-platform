// src/components/common/PageHeader.tsx
// Inner Page Header Component conforming to SITEWIDE-REDESIGN.md Section 2

import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  breadcrumb?: BreadcrumbItem[];
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
  heroImage?: {
    src: string;
    alt: string;
    caption?: string;
  };
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumb,
  eyebrow,
  title,
  intro,
  children,
  heroImage,
  className = '',
}) => {
  return (
    <div
      className={`w-full bg-[#EEF4F8] border-b border-[#D5E0E8] ${className}`}
      style={{
        padding: 'clamp(120px, 14vw, 180px) 0 clamp(56px, 7vw, 96px)',
      }}
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb in mono 12px muted */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center flex-wrap gap-2 font-mono text-[12px] text-[#5B6B7B]"
          >
            {breadcrumb.map((item, idx) => {
              const isLast = idx === breadcrumb.length - 1;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="opacity-40 select-none">/</span>}
                  {item.onClick || item.href ? (
                    <a
                      href={item.href || '#'}
                      onClick={(e) => {
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        }
                      }}
                      className="hover:text-[#1F5FAE] transition-colors no-underline text-[#5B6B7B]"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className={isLast ? 'text-[#0B1B2B] font-medium' : ''}>
                      {item.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* Eyebrow in mono 12px cobalt, uppercase, letter-spacing .12em */}
        {eyebrow && (
          <div className="font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-[#1F5FAE] mb-3">
            {eyebrow}
          </div>
        )}

        {/* H1 in clamp(2.4rem, 5vw, 4.6rem), weight 700, letter-spacing -.045em */}
        <h1
          className="text-[#0B1B2B] font-bold leading-[1.08] tracking-[-0.045em] m-0 max-w-[1050px] font-['Space_Grotesk',sans-serif]"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 4.6rem)' }}
        >
          {title}
        </h1>

        {/* Intro paragraph, max-width 640px, body #3A4B5C */}
        {intro && (
          <p className="mt-6 text-[17px] sm:text-[19px] leading-[1.6] text-[#3A4B5C] max-w-[640px] m-0 font-['Space_Grotesk',sans-serif]">
            {intro}
          </p>
        )}

        {/* Optional DataStrip / Actions */}
        {children && <div className="mt-8">{children}</div>}

        {/* Optional full-width photo below the header: radius 6px */}
        {heroImage && (
          <div className="mt-12 overflow-hidden rounded-[6px] border border-[#D5E0E8] shadow-[0_12px_32px_rgba(11,27,43,0.06)]">
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className="w-full h-auto max-h-[560px] object-cover block"
            />
            {heroImage.caption && (
              <div className="bg-[#FBFCFD] px-4 py-2.5 font-mono text-xs text-[#5B6B7B] border-t border-[#D5E0E8]">
                {heroImage.caption}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

