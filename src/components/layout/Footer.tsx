// src/components/layout/Footer.tsx
// EPEDE Sitewide Dark Footer (Porcelain & Navy Specification)
// Follows SITEWIDE-REDESIGN.md and HOMEPAGE-EXACT-MATCH.md

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
          label: isFr ? 'Systèmes électriques (9 étapes)' : 'Electrical systems',
          view: 'journey',
          href: isFr ? '#/systemes-electriques' : '#/en/electrical-systems',
        },
        {
          label: isFr ? 'Catalogue des équipements (39)' : 'Equipment',
          view: 'equipment-list',
          href: isFr ? '#/materiel' : '#/en/equipment',
        },
        {
          label: isFr ? 'Réseau électrique du Cameroun' : 'Cameroon grid',
          view: 'cameroon-grid',
          href: isFr ? '#/reseau-cameroun' : '#/en/cameroon-grid',
        },
        {
          label: isFr ? 'Génie électrique industriel' : 'Industrial engineering',
          view: 'industrial-projects',
          href: isFr ? '#/genie-industriel' : '#/en/industrial-engineering',
        },
      ],
    },
    {
      heading: isFr ? 'APPRENDRE' : 'LEARN',
      links: [
        {
          label: isFr ? 'Parcours d’apprentissage (8)' : 'Learning pathways',
          view: 'thematic-journeys',
          href: isFr ? '#/apprendre' : '#/en/learn',
        },
        {
          label: isFr ? 'Bibliothèque d’ingénierie D01–D16' : 'Engineering library D01–D16',
          view: 'domains',
          href: isFr ? '#/domaines' : '#/en/domains',
        },
        {
          label: isFr ? 'Normes internationales (CEI/IEEE)' : 'Standards',
          view: 'standards',
          href: isFr ? '#/normes' : '#/en/standards',
        },
        {
          label: isFr ? 'Cadre réglementaire & Code réseau' : 'Regulatory',
          view: 'regulatory',
          href: '#/regulatory',
        },
      ],
    },
    {
      heading: isFr ? 'OUTILS & RÉFÉRENCES' : 'TOOLS',
      links: [
        {
          label: isFr ? 'Calculateurs électrotechniques (19)' : 'Calculators',
          view: 'calculators',
          href: isFr ? '#/calculateurs' : '#/en/calculators',
        },
        {
          label: isFr ? 'Laboratoire de simulation (19)' : 'Simulation lab',
          view: 'simulation',
          href: '#/simulation',
        },
        {
          label: isFr ? 'Schémas unifilaires & postes' : 'SLD & substations',
          view: 'diagrams',
          href: '#/diagrams',
        },
        {
          label: isFr ? 'Complexe hydroélectrique' : 'Hydropower suite',
          view: 'hydropower',
          href: '#/hydropower',
        },
        {
          label: isFr ? 'Sources & provenance des données' : 'Sources & provenance',
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
      className="bg-[#07131F] text-[#F3F7FA] pt-14 md:pt-20 pb-24 md:pb-12 mt-0 border-t border-[#1A2D40]"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <p className="m-0 mb-10 max-w-[800px] font-mono text-xs leading-[1.7] text-[#93A4B4]">
          {isFr
            ? "Note de synthèse d’ingénierie — Le contenu d’EPEDE est une synthèse pédagogique et technique fondée sur les normes publiques (CEI, IEEE, CIGRE, NF C) et les données opérateurs. Il ne remplace pas les textes normatifs officiels, la documentation constructeur ou l’étude d’un ingénieur qualifié."
            : "Engineering synthesis notice — EPEDE content is an educational synthesis of public standards and sources. It does not replace official standards text, manufacturer data or a qualified engineer's study."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pt-10 border-t border-[#1A2D40]">
          <div className="sm:col-span-2 max-w-[380px]">
            <a
              href={isFr ? '#/' : '#/en/'}
              onClick={(e) => handleNav(e, 'home', isFr ? '#/' : '#/en/')}
              className="inline-flex items-center gap-2.5 font-bold text-[22px] text-[#FFFFFF] no-underline tracking-[-0.03em] font-['Space_Grotesk']"
            >
              <span className="w-7 h-7 rounded-[6px] bg-[#FFFFFF] text-[#07131F] grid place-items-center text-sm font-bold">
                E
              </span>
              <span>EPEDE</span>
            </a>
            <p className="mt-4 text-[14px] leading-[1.65] text-[#93A4B4] font-['Space_Grotesk']">
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

          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <div className="font-mono text-xs tracking-[0.12em] uppercase text-[#93A4B4]">
                {col.heading}
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.view}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNav(e, link.view, link.href)}
                      className="text-[#C3CFDA] hover:text-[#F2A541] text-[14px] no-underline transition-colors inline-block py-0.5 font-['Space_Grotesk']"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-[#1A2D40] flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#93A4B4]">
          <span>© 2026 EPEDE · Electrical Power Engineering Digital Environment</span>
          <div className="flex items-center gap-4">
            {onLocaleChange ? (
              <button
                type="button"
                onClick={() => onLocaleChange(locale === 'en' ? 'fr' : 'en')}
                className="font-mono text-xs text-[#F3F7FA] hover:text-[#F2A541] bg-transparent border border-[#1E3347] rounded-full px-3.5 py-1.5 min-h-[34px] cursor-pointer transition-colors hover:border-[#F2A541]"
              >
                {locale === 'en' ? 'EN · Switch to FR' : 'FR · Passer en EN'}
              </button>
            ) : (
              <span>EN / FR</span>
            )}
            <span className="text-[#5B6B7B]">Synthesis v2</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
