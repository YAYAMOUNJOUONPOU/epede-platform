// src/components/layout/Footer.tsx
// EPEDE Merged Sitewide Dark Footer
// Combines the rich columns, branding and verified link registry of Image 1
// with the canonical layout, bottom synthesis notice, and metadata bar of Image 2 (Master v2)

import React from 'react';

interface FooterProps {
  locale: 'fr' | 'en';
  onLocaleChange?: (locale: 'fr' | 'en') => void;
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  locale,
  onLocaleChange,
  onNavigate,
}) => {
  const isFr = locale === 'fr';

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, view: string, fallbackHash: string) => {
    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
      e.preventDefault();
      if (onNavigate) {
        onNavigate(view);
      } else {
        window.location.hash = fallbackHash;
      }
    }
  };

  const columns = [
    {
      heading: isFr ? 'EXPLORER' : 'EXPLORE',
      links: [
        {
          label: isFr ? 'Systèmes électriques (9 étapes)' : 'Electrical systems (9 stages)',
          view: 'journey',
          href: isFr ? '#/systemes-electriques' : '#/en/electrical-systems',
        },
        {
          label: isFr ? 'Catalogue des équipements (39)' : 'Equipment catalogue (39)',
          view: 'equipment-list',
          href: isFr ? '#/materiel' : '#/en/equipment',
        },
        {
          label: isFr ? 'Réseau électrique du Cameroun' : 'Cameroon power grid',
          view: 'cameroon-grid',
          href: isFr ? '#/reseau-cameroun' : '#/en/cameroon-grid',
        },
        {
          label: isFr ? 'Génie électrique industriel' : 'Industrial power engineering',
          view: 'industrial-projects',
          href: isFr ? '#/genie-industriel' : '#/en/industrial-engineering',
        },
      ],
    },
    {
      heading: isFr ? 'APPRENDRE' : 'LEARN',
      links: [
        {
          label: isFr ? 'Parcours d’apprentissage (8)' : 'Learning pathways (8)',
          view: 'thematic-journeys',
          href: isFr ? '#/apprendre' : '#/en/learn',
        },
        {
          label: isFr ? 'Bibliothèque d’ingénierie D01–D16' : 'Engineering library D01–D16',
          view: 'domains',
          href: isFr ? '#/domaines' : '#/en/domains',
        },
        {
          label: isFr ? 'Normes internationales (CEI/IEEE)' : 'International standards (IEC/IEEE)',
          view: 'standards',
          href: isFr ? '#/normes' : '#/en/standards',
        },
        {
          label: isFr ? 'Cadre réglementaire & Code réseau' : 'Regulatory framework & Grid code',
          view: 'regulatory',
          href: '#/regulatory',
        },
      ],
    },
    {
      heading: isFr ? 'OUTILS & RÉFÉRENCES' : 'TOOLS & REFERENCES',
      links: [
        {
          label: isFr ? 'Calculateurs électrotechniques (19)' : 'Electrical calculators (19)',
          view: 'calculators',
          href: isFr ? '#/calculateurs' : '#/en/calculators',
        },
        {
          label: isFr ? 'Laboratoire de simulation (19)' : 'Simulation laboratory (19)',
          view: 'simulation',
          href: '#/simulation',
        },
        {
          label: isFr ? 'Schémas unifilaires & postes' : 'Single-line diagrams & substations',
          view: 'diagrams',
          href: '#/diagrams',
        },
        {
          label: isFr ? 'Complexe hydroélectrique' : 'Hydropower complex',
          view: 'hydropower',
          href: '#/hydropower',
        },
        {
          label: isFr ? 'Sources & provenance des données' : 'Sources & data provenance',
          view: 'traceability',
          href: '#/traceability',
        },
        {
          label: isFr ? 'À propos d’EPEDE' : 'About EPEDE',
          view: 'about',
          href: isFr ? '#/a-propos' : '#/en/about',
        },
      ],
    },
  ];

  return (
    <footer
      id="epede-shared-footer"
      role="contentinfo"
      aria-label={isFr ? 'Pied de page EPEDE' : 'EPEDE site footer'}
      className="bg-[#07131F] text-[#F3F7FA] border-t border-[#1A2D40] mt-0 select-none"
      style={{
        padding: 'clamp(56px, 7vw, 88px) 0 clamp(32px, 4vw, 48px)',
      }}
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* 1. Engineering Synthesis Top Note (from Image 1) */}
        <div className="pb-8 mb-10 border-b border-[#1A2D40]/60">
          <p className="m-0 max-w-[1080px] font-mono text-[12px] leading-[1.75] text-[#93A4B4]">
            {isFr
              ? 'Note de synthèse d’ingénierie — Le contenu d’EPEDE est une synthèse pédagogique et technique fondée sur les normes publiques (CEI, IEEE, CIGRE, NF C) et les données opérateurs. Il ne remplace pas les textes normatifs officiels, la documentation constructeur ou l’étude d’un ingénieur qualifié.'
              : 'Engineering synthesis note — EPEDE content is an educational and technical synthesis based on public standards (IEC, IEEE, CIGRE, NF C) and operator data. It does not replace official normative texts, manufacturer documentation or a qualified engineer’s study.'}
          </p>
        </div>

        {/* 2. Main Navigation Grid (Columns from Image 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Attribution Column */}
          <div className="sm:col-span-2 max-w-[380px]">
            <a
              href={isFr ? '#/' : '#/en/'}
              onClick={(e) => handleNav(e, 'home', isFr ? '#/' : '#/en/')}
              className="inline-flex items-center gap-2.5 font-bold text-[24px] text-[#FFFFFF] no-underline tracking-[-0.03em]"
            >
              <span className="w-7 h-7 rounded-[5px] bg-[#FFFFFF] text-[#07131F] grid place-items-center text-sm font-bold">
                E
              </span>
              <span>EPEDE</span>
            </a>
            <p className="mt-4 text-[14px] leading-[1.65] text-[#93A4B4]">
              {isFr
                ? 'Un environnement numérique bilingue pour comprendre, analyser et simuler le génie électrique et les réseaux d’énergie — de la centrale de production jusqu’à la charge finale.'
                : 'A bilingual digital environment for understanding, analysing and simulating electrical power engineering — from generation to the final load.'}
            </p>
            <p className="mt-3 font-mono text-xs text-[#5B6B7B]">
              {isFr
                ? 'Conçu par Mounjouonpou Yaya · Ingénieur Électricien & Réseaux'
                : 'Created by Mounjouonpou Yaya · Electrical & Power Systems Engineer'}
            </p>
          </div>

          {/* Nav Columns: EXPLORER, APPRENDRE, OUTILS & RÉFÉRENCES */}
          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#93A4B4] font-semibold">
                {col.heading}
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.view}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNav(e, link.view, link.href)}
                      className="text-[#F3F7FA] hover:text-[#F2A541] text-[14px] no-underline transition-colors inline-block py-0.5"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 3. Bottom Metadata, Copyright & Language Switcher (from Image 2) */}
        <div className="mt-14 pt-6 border-t border-[#1A2D40] flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-[#93A4B4]">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© 2026 EPEDE · Electrical Power Engineering Digital Environment</span>
            <span>Version 2.0 · Updated November 2026</span>
            <span>Photos: Wikimedia Commons contributors, credited on each image.</span>
          </div>

          <div className="flex items-center gap-3">
            {onLocaleChange && (
              <button
                type="button"
                onClick={() => onLocaleChange(locale === 'en' ? 'fr' : 'en')}
                className="font-mono text-xs text-[#F3F7FA] hover:text-[#F2A541] bg-transparent border border-[#1E3347] rounded-full px-3 py-1 cursor-pointer transition-colors hover:border-[#F2A541]"
              >
                {locale === 'en' ? 'EN · Switch to FR' : 'FR · Passer en EN'}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
